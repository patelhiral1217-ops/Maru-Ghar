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


// Account deletion cleanup is deployed with this Functions bundle; deployment condition verified.
// Customer-initiated account deletion. Remove the account's listings and private
// contact records as well, so an erased account cannot leave public listings with
// stale personal details. Cloudinary assets are removed when server credentials exist.
exports.deleteMyAccount = functions.https.onCall(async (_data, context) => {
  if (!context.auth || context.auth.token.firebase?.sign_in_provider === 'anonymous') {
    throw new functions.https.HttpsError('unauthenticated', 'લોગિન જરૂરી છે.');
  }
  const uid = context.auth.uid;
  if (uid === ADMIN_UID) throw new functions.https.HttpsError('failed-precondition', 'એડમિન એકાઉન્ટ આ વિકલ્પથી ડિલીટ કરી શકાતું નથી.');

  const db = admin.firestore();
  const cloudName = 't5gd6nts';
  const cloudKey = process.env.CLOUDINARY_API_KEY;
  const cloudSecret = process.env.CLOUDINARY_API_SECRET;
  const mediaToDelete = [];
  let deletedListings = 0;

  // Delete every listing submitted by this account in bounded batches.
  while (true) {
    const page = await db.collection('listings')
      .where('submitterUid', '==', uid).limit(400).get();
    if (page.empty) break;

    const batch = db.batch();
    for (const listing of page.docs) {
      const data = listing.data() || {};
      for (const media of [...(Array.isArray(data.photos) ? data.photos : []),
        ...(Array.isArray(data.videos) ? data.videos : [])]) {
        if (media && media.publicId) {
          mediaToDelete.push({ publicId: String(media.publicId), type:
            (Array.isArray(data.videos) ? data.videos : []).includes(media) ? 'video' : 'image' });
        }
      }
      batch.delete(db.collection('listingContacts').doc(listing.id));
      batch.delete(listing.ref);
      deletedListings++;
    }
    await batch.commit();
  }

  // Also remove any orphaned private contacts owned by this UID.
  while (true) {
    const page = await db.collection('listingContacts')
      .where('ownerUid', '==', uid).limit(400).get();
    if (page.empty) break;
    const batch = db.batch();
    page.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }

  // Remove customer-owned subcollections and enquiry documents before Auth user.
  await db.recursiveDelete(db.collection('users').doc(uid));
  while (true) {
    const page = await db.collection('enquiries').where('uid', '==', uid).limit(400).get();
    if (page.empty) break;
    const batch = db.batch();
    page.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }

  // Cloudinary cleanup is best-effort; database privacy cleanup must not be
  // blocked if optional Cloudinary API credentials have not been configured.
  let mediaDeleted = 0, mediaSkipped = mediaToDelete.length;
  if (cloudKey && cloudSecret && mediaToDelete.length) {
    mediaSkipped = 0;
    for (const item of mediaToDelete) {
      if (!/^[A-Za-z0-9_\-/.]{1,200}$/.test(item.publicId)) { mediaSkipped++; continue; }
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = crypto.createHash('sha1')
        .update(`public_id=${item.publicId}&timestamp=${timestamp}${cloudSecret}`).digest('hex');
      try {
        const body = new URLSearchParams({ public_id: item.publicId, timestamp: String(timestamp), api_key: cloudKey, signature });
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${item.type}/destroy`, { method: 'POST', body });
        const result = await response.json().catch(() => ({}));
        if (response.ok && (result.result === 'ok' || result.result === 'not found')) mediaDeleted++;
        else mediaSkipped++;
      } catch (error) {
        console.error('Cloudinary account-cleanup failed', error);
        mediaSkipped++;
      }
    }
  }

  await admin.auth().deleteUser(uid);
  return { ok: true, deletedListings, mediaDeleted, mediaSkipped };
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


// Admin-only customer account deletion. Keep property records and media for manual review,
// but hide every listing, remove private contacts/enquiries, and erase the Auth/customer account.
exports.adminDeleteCustomer = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.uid !== ADMIN_UID) {
    throw new functions.https.HttpsError('permission-denied', 'Only the admin can manage customers.');
  }
  const uid = String(data?.uid || '').trim();
  if (!uid || uid.length > 128 || data?.confirmation !== 'DELETE') {
    throw new functions.https.HttpsError('invalid-argument', 'Customer ID or confirmation is invalid.');
  }
  if (uid === ADMIN_UID) {
    throw new functions.https.HttpsError('failed-precondition', 'The administrator account cannot be deleted here.');
  }
  const db = admin.firestore();
  const target = await admin.auth().getUser(uid);
  let hiddenListings = 0;
  while (true) {
    const page = await db.collection('listings').where('submitterUid', '==', uid).limit(400).get();
    if (page.empty) break;
    const batch = db.batch();
    page.docs.forEach(listing => {
      batch.update(listing.ref, {
        status: 'rejected',
        reviewNote: 'ગ્રાહક એકાઉન્ટ કાયમી ડિલીટ થયું — Admin તપાસ બાકી.',
        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
        reviewedBy: ADMIN_UID,
        accountDeleted: true,
        accountDeletedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      batch.delete(db.collection('listingContacts').doc(listing.id));
      hiddenListings++;
    });
    await batch.commit();
  }
  while (true) {
    const page = await db.collection('listingContacts').where('ownerUid', '==', uid).limit(400).get();
    if (page.empty) break;
    const batch = db.batch();
    page.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  await db.recursiveDelete(db.collection('users').doc(uid));
  while (true) {
    const page = await db.collection('enquiries').where('uid', '==', uid).limit(400).get();
    if (page.empty) break;
    const batch = db.batch();
    page.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  await db.collection('adminLogs').add({
    kind: 'customer_deleted', uid, email: target.email || '',
    phoneNumber: target.phoneNumber || '', hiddenListings,
    mediaPreserved: true, changedBy: context.auth.uid,
    at: new Date().toISOString(),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  await admin.auth().deleteUser(uid);
  return { ok: true, uid, hiddenListings, mediaPreserved: true };
});

// Admin-only customer account control. Blocking disables Firebase Authentication access.
exports.adminListCustomers = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.uid !== ADMIN_UID) {
    throw new functions.https.HttpsError('permission-denied', 'Only the admin can manage customers.');
  }
  const pageToken = typeof data?.pageToken === 'string' ? data.pageToken : undefined;
  const result = await admin.auth().listUsers(100, pageToken);
  return {
    users: result.users.map(user => ({
      uid: user.uid,
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      displayName: user.displayName || '',
      disabled: !!user.disabled,
      createdAt: user.metadata?.creationTime || '',
      lastSignInAt: user.metadata?.lastSignInTime || '',
      providers: (user.providerData || []).map(p => p.providerId)
    })),
    nextPageToken: result.pageToken || null
  };
});

exports.adminSetCustomerDisabled = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.uid !== ADMIN_UID) {
    throw new functions.https.HttpsError('permission-denied', 'Only the admin can manage customers.');
  }
  const uid = String(data?.uid || '').trim();
  const disabled = data?.disabled;
  const reason = String(data?.reason || '').trim().slice(0, 300);
  if (!uid || uid.length > 128 || typeof disabled !== 'boolean') {
    throw new functions.https.HttpsError('invalid-argument', 'Customer ID or action is invalid.');
  }
  if (uid === ADMIN_UID) {
    throw new functions.https.HttpsError('failed-precondition', 'The administrator account cannot be blocked here.');
  }
  if (disabled && reason.length < 3) {
    throw new functions.https.HttpsError('invalid-argument', 'Blocking requires a short reason.');
  }
  const target = await admin.auth().getUser(uid);
  await admin.auth().updateUser(uid, { disabled });
  const db = admin.firestore();
  await db.collection('adminLogs').add({
    kind: disabled ? 'customer_blocked' : 'customer_unblocked',
    uid,
    email: target.email || '',
    phoneNumber: target.phoneNumber || '',
    reason,
    changedBy: context.auth.uid,
    at: new Date().toISOString(),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { ok: true, uid, disabled };
});
