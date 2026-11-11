import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];
let project;
try{project=JSON.parse(read('.firebaserc')).projects?.default}catch(e){errors.push('.firebaserc is missing or invalid JSON')}
let firebase;
try{firebase=JSON.parse(read('firebase.json'))}catch(e){errors.push('firebase.json is missing or invalid JSON')}
let indexes;
try{indexes=JSON.parse(read('firestore.indexes.json'))}catch(e){errors.push('firestore.indexes.json is invalid JSON')}
let fnPkg;
try{fnPkg=JSON.parse(read('functions/package.json'))}catch(e){errors.push('functions/package.json is invalid JSON')}
if(project!=='maru-ghar-gandhinagar-8dbe4')errors.push('Firebase default project does not match the configured Maru Ghar project');
if(firebase?.firestore?.rules!=='firestore.rules'||firebase?.firestore?.indexes!=='firestore.indexes.json')errors.push('Firebase Firestore rules/index paths do not match project files');
if(firebase?.functions?.[0]?.source!=='functions')errors.push('Firebase Functions source path is not functions/');
if(fnPkg?.engines?.node!=='22')errors.push('Cloud Functions runtime must remain Node.js 22');
for(const p of ['firestore.rules','firestore.indexes.json','functions/index.js','functions/package.json','.firebaserc'])if(!fs.existsSync(path.join(root,p)))errors.push(`Required deployment file missing: ${p}`);
const rules=read('firestore.rules');
for(const [needle,msg] of [
 ['function isAdmin()','Admin identity guard missing'],
 ['match /listingContacts/{listingId}','Private listing contact rules missing'],
 ["allow create, delete: if false",'Customer cannot be allowed to create/delete trusted notifications'],
 ["match /listingVerifications/{verificationId}",'Verification audit rules missing'],
 ["allow update, delete: if false",'Immutable verification audit guard missing'],
 ["match /adminTokens/{token}",'Admin FCM token rules missing']
])if(!rules.includes(needle))errors.push(msg);
const fn=read('functions/index.js');
for(const [needle,msg] of [
 ["exports.notifyAdminNewListing",'Admin new-listing notification function missing'],
 ["exports.notifyPriceDrop",'Price-drop notification function missing'],
 ["exports.deleteMyAccount",'Account deletion callable function missing'],
 ["context.eventId",'Price-drop retry idempotency key missing'],
 ["admin.firestore().collection('adminTokens')",'Admin token lookup missing']
])if(!fn.includes(needle))errors.push(msg);
if(errors.length){console.error('FIREBASE DEPLOY PREFLIGHT FAILED');errors.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log(`FIREBASE DEPLOY PREFLIGHT PASS — target ${project}; Firestore rules/index paths, Node ${fnPkg.engines.node} Functions source, admin/customer privacy guards and required callable/trigger functions found.`);
console.log('NOTE: This is a local preflight only. It does not authenticate, deploy, compile Rules in the Firebase emulator, or verify live project permissions.');
