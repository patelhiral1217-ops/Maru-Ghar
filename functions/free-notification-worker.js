// Free scheduled notification worker. Runs from public-repository GitHub Actions,
// so it does not require deploying Firebase Cloud Functions or enabling Blaze billing.
const admin = require('firebase-admin');
const crypto = require('crypto');

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT secret is missing.');
const serviceAccount = JSON.parse(raw);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: 'maru-ghar-gandhinagar-8dbe4' });
const db = admin.firestore();
const ADMIN_UID = 'yJYiuaUE3KXVLVuWqLyLRH5owQJ3';
const DEAD = new Set(['messaging/registration-token-not-registered', 'messaging/invalid-registration-token']);

async function sendTokens(tokenDocs, notification, data) {
  const docs = tokenDocs.filter(d => d.id && d.data()?.token);
  let sent = 0;
  for (let i = 0; i < docs.length; i += 500) {
    const group = docs.slice(i, i + 500);
    const result = await admin.messaging().sendEachForMulticast({
      tokens: group.map(d => d.data().token),
      notification,
      data: Object.fromEntries(Object.entries(data || {}).map(([k, v]) => [k, String(v)])),
      android: { priority: 'high', notification: { sound: 'default' } }
    });
    sent += result.successCount;
    await Promise.all(result.responses.map((r, n) => {
      if (!r.success && r.error && DEAD.has(r.error.code)) return group[n].ref.delete();
      return null;
    }));
  }
  return sent;
}

async function processNewListings(cursor) {
  const snap = await db.collection('listings').where('createdAt', '>=', cursor).get();
  const tokens = await db.collection('adminTokens').get();
  let processed = 0;
  for (const doc of snap.docs) {
    const d = doc.data() || {};
    if (d.status !== 'pending' || d.submitterUid === ADMIN_UID) continue;
    const marker = db.collection('notificationWorkerEvents').doc('admin_' + doc.id);
    const existing = await marker.get();
    if (existing.exists) continue;
    if (tokens.empty) continue; // Keep it eligible; send after the admin phone registers its token.
    const body = [d.type, d.purpose, d.location].filter(Boolean).join(' · ') || 'નવી પ્રોપર્ટી મંજૂરી માટે આવી છે';
    const delivered = await sendTokens(tokens.docs,
      { title: 'મારું ઘર — નવી લિસ્ટિંગ મંજૂરી માટે', body },
      { listingId: doc.id, kind: 'new_listing' });
    if (delivered > 0) {
      await marker.set({ kind: 'admin_new_listing', listingId: doc.id, sentAt: admin.firestore.FieldValue.serverTimestamp() });
      processed++;
    }
  }
  return processed;
}

async function processPriceDrops(cursor) {
  const snap = await db.collection('listings').where('priceUpdatedAt', '>=', cursor).get();
  let processed = 0;
  for (const listing of snap.docs) {
    const d = listing.data() || {};
    const oldPrice = Number(d.previousPriceNum || 0);
    const newPrice = Number(d.priceNum || 0);
    if (d.status !== 'approved' || !oldPrice || !newPrice || newPrice >= oldPrice) continue;
    const updatedAt = d.priceUpdatedAt?.toMillis?.() || 0;
    if (!updatedAt) continue;
    const saved = await db.collectionGroup('favorites').where('listingId', '==', listing.id).get();
    for (const fav of saved.docs) {
      const userRef = fav.ref.parent.parent;
      if (!userRef) continue;
      const uid = userRef.id;
      const digest = crypto.createHash('sha256').update(`${listing.id}:${updatedAt}:${uid}`).digest('hex');
      const noteRef = userRef.collection('notifications').doc('price_' + digest);
      let created = false;
      await db.runTransaction(async tx => {
        const prior = await tx.get(noteRef);
        if (prior.exists) return;
        tx.create(noteRef, {
          type: 'price_drop', listingId: listing.id,
          message: `મનપસંદ પ્રોપર્ટીનો ભાવ ઘટ્યો: ₹${oldPrice.toLocaleString('en-IN')} → ₹${newPrice.toLocaleString('en-IN')} (₹${(oldPrice-newPrice).toLocaleString('en-IN')} ઓછો).`,
          oldPrice, newPrice, createdAt: admin.firestore.FieldValue.serverTimestamp(), read: false
        });
        created = true;
      });
      if (!created) continue;
      const userTokens = await userRef.collection('pushTokens').get();
      if (!userTokens.empty) {
        await sendTokens(userTokens.docs,
          { title: 'મારું ઘર — પ્રોપર્ટીનો ભાવ ઘટ્યો', body: `તમારી મનપસંદ પ્રોપર્ટીનો ભાવ ₹${(oldPrice-newPrice).toLocaleString('en-IN')} ઘટ્યો છે.` },
          { listingId: listing.id, kind: 'price_drop' });
      }
    }
    processed++;
  }
  return processed;
}

(async () => {
  const stateRef = db.collection('notificationWorkerState').doc('main');
  const state = await stateRef.get();
  const now = admin.firestore.Timestamp.now();
  let previous;
  if (!state.exists || !state.data()?.lastCheckedAt) {
    // First run checks the last hour so submissions made during setup are not missed.
    previous = now.toMillis() - 60 * 60 * 1000;
    await stateRef.set({ lastCheckedAt: admin.firestore.Timestamp.fromMillis(previous), initializedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  } else {
    previous = state.data().lastCheckedAt.toMillis();
  }
  // A one-hour overlap protects against delayed schedules; event markers prevent repeats.
  const cursor = admin.firestore.Timestamp.fromMillis(Math.max(0, previous - 60 * 60 * 1000));
  const [newListings, priceDrops] = await Promise.all([
    processNewListings(cursor),
    processPriceDrops(cursor)
  ]);
  await stateRef.set({ lastCheckedAt: now, lastRunAt: admin.firestore.FieldValue.serverTimestamp(), newListings, priceDrops }, { merge: true });
  console.log(`Free notification worker completed: ${newListings} new listings, ${priceDrops} price-drop listings.`);
})().catch(error => { console.error('Free notification worker failed:', error); process.exitCode = 1; });
