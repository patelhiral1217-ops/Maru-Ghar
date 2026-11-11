// Sends a push notification to the admin phone whenever a new listing is submitted for approval.
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const crypto = require('crypto');
admin.initializeApp();

const ADMIN_UID = 'yJYiuaUE3KXVLVuWqLyLRH5owQJ3';
const DEAD_TOKEN_CODES = ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token'];

exports.notifyAdminNewListing = functions.firestore
  .document('listings/{listingId}')
  .onCreate(async (snap) => {
    const d = snap.data() || {};
    if (d.status !== 'pending') return null;           // only listings waiting for approval
    if (d.submitterUid === ADMIN_UID) return null;     // admin's own entries need no alert

    const tokenDocs = (await admin.firestore().collection('adminTokens').get()).docs;
    if (!tokenDocs.length) { console.log('No admin device registered yet.'); return null; }

    const body = [d.type, d.purpose, d.location].filter(Boolean).join(' · ') || 'નવી પ્રોપર્ટી મંજૂરી માટે આવી છે';
    const res = await admin.messaging().sendEachForMulticast({
      tokens: tokenDocs.map((t) => t.id),
      notification: { title: 'મારું ઘર — નવી લિસ્ટિંગ મંજૂરી માટે', body },
      android: { priority: 'high', notification: { sound: 'default' } },
      data: { listingId: snap.id }
    });

    // Remove tokens of phones where the app was uninstalled.
    await Promise.all(res.responses.map((r, i) =>
      (!r.success && r.error && DEAD_TOKEN_CODES.includes(r.error.code)) ? tokenDocs[i].ref.delete() : null));
    console.log(`Push sent: ${res.successCount} ok, ${res.failureCount} failed`);
    return null;
  });


// Notify signed-in customers who saved a property when its numeric price decreases.
exports.notifyPriceDrop = functions.firestore
  .document('listings/{listingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() || {};
    const after = change.after.data() || {};
    const oldPrice = Number(before.priceNum || 0);
    const newPrice = Number(after.priceNum || 0);
    if (!oldPrice || !newPrice || newPrice >= oldPrice || after.status !== 'approved') return null;
    const listingId = context.params.listingId;
    const saved = await admin.firestore().collectionGroup('favorites')
      .where('listingId', '==', listingId).get();
    if (saved.empty) return null;
    const db = admin.firestore();
    const amount = oldPrice - newPrice;
    // Firestore batches are limited to 500 writes. Chunk at 400 so a large
    // customer wishlist cannot make the entire price update trigger fail.
    let queued = 0;
    for (let offset = 0; offset < saved.docs.length; offset += 400) {
      const batch = db.batch();
      const group = saved.docs.slice(offset, offset + 400);
      group.forEach(fav => {
        const userRef = fav.ref.parent.parent;
        if (!userRef) return;
        // Firestore triggers are delivered at-least-once. A stable per-user/event
        // document ID makes retries idempotent instead of creating duplicate alerts.
        const digest = crypto.createHash('sha256').update(`${context.eventId}:${userRef.id}`).digest('hex');
        const note = userRef.collection('notifications').doc(`price_${digest}`);
        batch.set(note, {
          type: 'price_drop', listingId,
          message: `મનપસંદ પ્રોપર્ટીનો ભાવ ઘટ્યો: ${before.price || oldPrice} → ${after.price || newPrice} (₹${amount.toLocaleString('en-IN')} ઓછો).`,
          oldPrice, newPrice, eventId: context.eventId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(), read: false
        }, { merge: false });
        queued++;
      });
      await batch.commit();
    }
    console.log(`Price-drop notifications queued for ${queued} saved customer(s).`);
    return null;
  });


// Customer-initiated account deletion required by the privacy workflow.
exports.deleteMyAccount = functions.https.onCall(async (_data, context) => {
  if (!context.auth || context.auth.token.firebase?.sign_in_provider === 'anonymous') {
    throw new functions.https.HttpsError('unauthenticated', 'લોગિન જરૂરી છે.');
  }
  const uid = context.auth.uid;
  if (uid === ADMIN_UID) throw new functions.https.HttpsError('failed-precondition', 'એડમિન એકાઉન્ટ આ વિકલ્પથી ડિલીટ કરી શકાતું નથી.');
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  // Remove customer-owned subcollections and enquiry documents before Auth user.
  await db.recursiveDelete(userRef);
  const enquiries = await db.collection('enquiries').where('uid', '==', uid).get();
  for (let i = 0; i < enquiries.docs.length; i += 400) {
    const batch = db.batch();
    enquiries.docs.slice(i, i + 400).forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  await admin.auth().deleteUser(uid);
  return { ok: true };
});


// Admin-only: delete Cloudinary photos/videos when a listing or a media file is removed.
// Optional: needs CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (written into functions/.env by the deploy workflow from GitHub secrets; never in client code).
exports.deleteListingMedia = functions
  .https.onCall(async (data, context) => {
    if (!context.auth || context.auth.uid !== ADMIN_UID) {
      throw new functions.https.HttpsError('permission-denied', 'Only the admin can delete media.');
    }
    const items = Array.isArray(data && data.items) ? data.items.slice(0, 50) : [];
    const cloud = 't5gd6nts';
    const key = process.env.CLOUDINARY_API_KEY, secret = process.env.CLOUDINARY_API_SECRET;
    if (!key || !secret) return { skipped: true, deleted: 0, failed: 0 }; // optional feature: works only when keys are configured
    let deleted = 0, failed = 0;
    for (const it of items) {
      const publicId = String((it && it.publicId) || '');
      if (!/^[A-Za-z0-9_\-\/\.]{1,200}$/.test(publicId)) { failed++; continue; }
      const type = it.type === 'video' ? 'video' : 'image';
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = crypto.createHash('sha1').update(`public_id=${publicId}&timestamp=${timestamp}${secret}`).digest('hex');
      try {
        const body = new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), api_key: key, signature });
        const r = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${type}/destroy`, { method: 'POST', body });
        const j = await r.json().catch(() => ({}));
        if (r.ok && (j.result === 'ok' || j.result === 'not found')) deleted++; else failed++;
      } catch (e) { console.error('cloudinary destroy failed', e); failed++; }
    }
    return { deleted, failed };
  });
