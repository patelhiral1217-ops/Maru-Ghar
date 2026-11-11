import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const extras=fs.readFileSync('assets/maru-ghar-extras.js','utf8');
const fileMode=fs.readFileSync('assets/maru-ghar-file-mode.js','utf8');
const errors=[];
const requiredIds=['customerAccount','customerEmail','customerPassword','customerRegister','customerLogin','customerLogout','customerStatus','customerFavList','customerNotifications','customerExport','customerDelete','customerMyProperties','customerMyPropertiesList','customerMyPropertiesReload'];
for(const id of requiredIds) if(!html.includes(`id="${id}"`)) errors.push(`Customer account control missing: ${id}`);
for(const marker of [
  "getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged",
  "createUserWithEmailAndPassword(auth,email,password)",
  "signInWithEmailAndPassword(auth,$('customerEmail').value.trim(),$('customerPassword').value)",
  "signOut(auth)",
  "onAuthStateChanged(auth,async u=>",
  "await refreshFavs();await loadNotifications();await loadMyProperties()",
  "where('submitterUid','==',currentUser.uid)",
  "async function loadMyProperties()",
  "item.reviewNote",
  "mg_favs_user_${currentUser.uid}",
  "mg_guest_favs_migrated_v1",
  "const snap=await getDocs(ref);const remote=snap.docs.map(d=>d.id);",
  "Later accounts never inherit another account's private favourites.",
  "document.dispatchEvent(new CustomEvent('marughar:favorites-updated'))",
  "auth/email-already-in-use","auth/invalid-email","auth/invalid-credential",
  "auth/weak-password","auth/operation-not-allowed","auth/network-request-failed",
  "if(!status)return;"
]) if(!extras.includes(marker)) errors.push(`Customer auth flow marker missing: ${marker}`);
if(!fs.readFileSync('firestore.rules','utf8').includes("resource.data.submitterUid == request.auth.uid")) errors.push('Owner-only listing read rule is missing');
if(!html.includes('<script type="module" src="assets/maru-ghar-extras.js"></script>')) errors.push('Customer auth module is not loaded on home page');
if(!fileMode.includes("protocol==='file:'||protocol==='content:'") || !fileMode.includes("href.startsWith('content:')") || !fileMode.includes('Firebase Login')) errors.push('file:// and Android content:// modes must clearly explain that Firebase login is unavailable');
if(!html.includes("location.protocol==='content:'") || !html.includes('File Managerમાંથી સીધી ખોલેલી છે')) errors.push('Android content:// warning banner is missing');
if(!html.includes('autocomplete="email"') || !html.includes('autocomplete="current-password"')) errors.push('Email/password autocomplete hints missing');
if(!html.includes('minlength="6"') || !html.includes('type="email"')) errors.push('Email/password basic input constraints missing');
if(errors.length){console.error('CUSTOMER AUTH CHECK FAILED');errors.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log('CUSTOMER AUTH STATIC CHECK PASS — registration, login, logout, auth-state listener, account data hooks, owner property status view, owner-only listing read rule, error mappings and file:// guard are present. Live Firebase credentials/device test is not covered.');
