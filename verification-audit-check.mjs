import fs from 'node:fs';
const admin=fs.readFileSync('admin.html','utf8');
const rules=fs.readFileSync('firestore.rules','utf8');
const errors=[];
for(const marker of [
  "if(action==='toggle_verified')",
  'શું તમે માલિકની ઓળખ, પ્રોપર્ટી પરનો અધિકાર/માલિકી સંબંધિત દસ્તાવેજો',
  'વેરિફિકેશનનો આધાર ઓછામાં ઓછા 8 અક્ષરમાં લખો.',
  "collection(db,'listingVerifications')",
  "action:next?'verified':'unverified'",
  'writeBatch(db)',
  'await batch.commit()'
]) if(!admin.includes(marker)) errors.push(`Verification workflow marker missing: ${marker}`);
const block=rules.match(/match \/listingVerifications\/\{verificationId\} \{([\s\S]*?)\n    \}/)?.[1]||'';
if(!block.includes('allow read: if isAdmin();') || !block.includes('allow create: if isAdmin()')) errors.push('Verification audit must be admin-only for read/create');
if(!block.includes("request.resource.data.action in ['verified', 'unverified']") || !block.includes('request.resource.data.note.size() >= 8') || !block.includes('request.resource.data.checkedAt == request.time')) errors.push('Verification audit fields must be validated');
if(!block.includes('allow update, delete: if false;')) errors.push('Verification audit records must be immutable');
if(errors.length){console.error('VERIFICATION AUDIT CHECK FAILED');errors.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log('VERIFICATION AUDIT CHECK PASS — evidence prompt, explicit confirmation, atomic badge+audit write, admin-only audit read/create, immutable history. Actual document verification remains an admin responsibility.');
