import fs from 'node:fs';
const rules = fs.readFileSync('firestore.rules', 'utf8');
const checks = [
  [rules.includes("request.auth.uid == 'yJYiuaUE3KXVLVuWqLyLRH5owQJ3'"), 'Fixed admin UID rule missing'],
  [rules.includes("match /listingVerifications/{verificationId}") && rules.includes('allow update, delete: if false;') && rules.includes('request.resource.data.note.size() >= 8'), 'Immutable verification audit rule missing'],
  [rules.includes("'createdAt', 'restoredAt'") && rules.includes('request.resource.data.restoredAt is timestamp'), 'Favorites backup-restore timestamp rule missing'],
  [rules.includes("request.resource.data.reviewedAt == request.time"), 'Review timestamp validation missing'],
  [rules.includes("data.mapLink.matches('^https://(www\\\\.)?google\\\\.com/maps/"), 'Google Maps URL allowlist missing'],
  [rules.includes("match /listingContacts/{listingId}") && rules.includes('allow list: if isAdmin();'), 'Private contact list restriction missing'],
  [rules.includes("match /users/{uid}/notifications/{notificationId}") && rules.includes('allow create, delete: if false;'), 'Customer notification write restriction missing'],
  [rules.includes("match /adminTokens/{token}") && rules.includes('allow read, write: if isAdmin();'), 'Admin push token restriction missing'],
  [!((rules.match(/function validCommon\(data\)\s*\{([\s\S]*?)\n    \}/)?.[1] || '').includes('ownerPhone')), 'Public listing must not accept ownerPhone'],
  [rules.includes('query rules are not filters') && rules.includes('run the Admin'), 'Legacy phone migration prerequisite comment missing'],
];
const failed = checks.filter(([ok]) => !ok);
if (failed.length) { console.error('FINAL FIRESTORE RULES CHECK FAILED'); failed.forEach(([, msg]) => console.error(' - ' + msg)); process.exit(1); }
console.log(`FINAL FIRESTORE RULES STATIC CHECK PASS — ${checks.length}/${checks.length}`);
