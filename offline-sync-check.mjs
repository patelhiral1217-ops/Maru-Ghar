import fs from 'node:fs';
const backend=fs.readFileSync('assets/maru-ghar-backend.js','utf8');
const errors=[];
for(const token of ['initializeFirestore','persistentLocalCache','persistentMultipleTabManager',"window.__mgOfflineCache='persistent'","window.__mgOfflineCache='memory-fallback'","addEventListener('offline'","addEventListener('online'","ઇન્ટરનેટ બંધ છે"]){
  if(!backend.includes(token)) errors.push('Missing offline support: '+token);
}
if(!backend.includes("getFirestore(app)")) errors.push('Memory-cache fallback must remain available when IndexedDB persistence is blocked');
if(errors.length){console.error('OFFLINE SYNC CHECK FAILED');errors.forEach(e=>console.error(' - '+e));process.exit(1)}
console.log('OFFLINE SYNC CHECK PASS — persistent Firestore local cache, multi-tab support, safe fallback, and online/offline status notice are wired. Physical airplane-mode write/reconnect verification is still required.');
