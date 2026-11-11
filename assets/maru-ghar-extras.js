/* Maru Ghar Premium customer account extension. */
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, collection, doc, getDocs, setDoc, addDoc, serverTimestamp, query, orderBy, limit, deleteDoc, where, updateDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js';
(() => {
 'use strict';
 const $=id=>document.getElementById(id); const status=$('customerStatus');
 const MG_MSG={
 'પહેલાં લોગિન કરો.':['पहले लॉगिन करें।','Please log in first.'],'મનપસંદ Sync ન થયું. ફરી લોગિન કરીને પ્રયાસ કરો.':['पसंदीदा सूची सिंक नहीं हुई। फिर लॉगिन करके प्रयास करें।','Favourites did not sync. Please log in again and retry.'],'પૂછપરછ મોકલવા પહેલાં ગ્રાહક એકાઉન્ટમાં લોગિન કરો.':['पूछताछ भेजने से पहले ग्राहक खाते में लॉगिन करें।','Log in to your customer account before sending an enquiry.'],'તમારું નામ લખો:':['अपना नाम लिखें:','Enter your name:'],'તમારો મોબાઇલ નંબર લખો:':['अपना मोबाइल नंबर लिखें:','Enter your mobile number:'],'યોગ્ય મોબાઇલ નંબર લખો.':['सही मोबाइल नंबर लिखें।','Enter a valid mobile number.'],'તમારો પ્રશ્ન / જરૂરિયાત લખો (વૈકલ્પિક):':['अपना प्रश्न / आवश्यकता लिखें (वैकल्पिक):','Enter your question / requirement (optional):'],'તમારી પૂછપરછ મોકલાઈ ગઈ છે. એડમિન તમારો સંપર્ક કરશે.':['आपकी पूछताछ भेज दी गई है। एडमिन आपसे संपर्क करेगा।','Your enquiry has been sent. The admin will contact you.'],'પૂછપરછ મોકલી શકાઈ નથી:':['पूछताछ नहीं भेजी जा सकी:','Could not send enquiry:'],'તમારું એકાઉન્ટ, મનપસંદ યાદી, સૂચનાઓ અને પૂછપરછ કાયમ માટે ડિલીટ થશે. આગળ વધવું છે?':['आपका खाता, पसंदीदा सूची, सूचनाएँ और पूछताछ हमेशा के लिए हट जाएँगी। आगे बढ़ें?','Your account, favourites, notifications and enquiries will be permanently deleted. Continue?'],'એકાઉન્ટ ડિલીટ થયું.':['खाता हटा दिया गया।','Account deleted.'],'એકાઉન્ટ ડિલીટ થઈ શક્યું નથી:':['खाता हटाया नहीं जा सका:','Could not delete account:'],'લોગિન સફળ.':['लॉगिन सफल।','Login successful.'],'લોગિન નિષ્ફળ:':['लॉगिन विफल:','Login failed:'],'એકાઉન્ટ સફળતાપૂર્વક બન્યું.':['खाता सफलतापूर्वक बन गया।','Account created successfully.'],'એકાઉન્ટ બની શક્યું નથી:':['खाता नहीं बन सका:','Could not create account:'],'પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ.':['पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।','Password must be at least 6 characters.'],'Firebase જોડાણ ઉપલબ્ધ નથી.':['Firebase कनेक्शन उपलब्ध नहीं है।','Firebase connection is unavailable.'],'લોગઆઉટ થયું.':['लॉगआउट हो गया।','Logged out.'],'લોગઆઉટ નિષ્ફળ.':['लॉगआउट विफल।','Logout failed.'],'તમારો ડેટા ડાઉનલોડ થયો.':['आपका डेटा डाउनलोड हो गया।','Your data has been downloaded.'],'ડેટા ડાઉનલોડ નિષ્ફળ:':['डेटा डाउनलोड विफल:','Data download failed:'],'ભાવ / એકાઉન્ટ સૂચનાઓ':['कीमत / खाता सूचनाएँ','Price / account notifications'],'નવી સૂચના':['नई सूचना','New notification'],'વાંચી':['पढ़ा','Read'],'સૂચના અપડેટ ન થઈ:':['सूचना अपडेट नहीं हुई:','Notification could not be updated:'],'એકાઉન્ટ ડેટા લોડ ન થયું:':['खाते का डेटा लोड नहीं हुआ:','Account data could not be loaded:'],'લોગિન કર્યા પછી મનપસંદ પ્રોપર્ટી Sync થશે.':['लॉगिन के बाद पसंदीदा प्रॉपर्टी सिंक होंगी।','Favourite properties will sync after login.'],'મારી પ્રોપર્ટી જોવા માટે ગ્રાહક એકાઉન્ટમાં લોગિન કરો.':['अपनी प्रॉपर्टी देखने के लिए ग्राहक खाते में लॉगिन करें।','Log in to your customer account to view your properties.'],'તમારી પ્રોપર્ટી લોડ થઈ રહી છે…':['आपकी प्रॉपर्टी लोड हो रही हैं…','Loading your properties…'],'આ લોગિન એકાઉન્ટથી હજી કોઈ પ્રોપર્ટી મોકલેલી નથી.':['इस खाते से अभी तक कोई प्रॉपर्टी नहीं भेजी गई है।','No properties have been submitted from this account yet.'],'પ્રોપર્ટી મંજૂરી માટે બાકી છે':['प्रॉपर्टी की मंज़ूरी लंबित है','Pending approval'],'મંજૂર — પ્રોપર્ટી જાહેર છે':['मंज़ूर — प्रॉपर्टी सार्वजनिक है','Approved — listing is public'],'નામંજૂર':['अस्वीकृत','Rejected'],'સ્થિતિ ઉપલબ્ધ નથી':['स्थिति उपलब्ध नहीं है','Status unavailable'],'એડમિનની નોંધ: ':['एडमिन की टिप्पणी: ','Admin note: '],'મોકલ્યાની તારીખ: ':['भेजने की तारीख: ','Submitted: '],'તમારી પ્રોપર્ટી લોડ થઈ શકી નથી: ':['आपकी प्रॉपर्टी लोड नहीं हो सकी: ','Could not load your properties: '],'auth/email-already-in-use':['यह ईमेल पहले से पंजीकृत है।','This email is already registered.'],'auth/invalid-email':['ईमेल पता सही नहीं है।','The email address is invalid.'],'auth/invalid-credential':['ईमेल या पासवर्ड सही नहीं है।','The email or password is incorrect.'],'auth/user-disabled':['यह खाता निष्क्रिय किया गया है।','This account has been disabled.'],'auth/too-many-requests':['बहुत अधिक प्रयास हुए हैं। कुछ देर बाद फिर प्रयास करें।','Too many attempts. Please try again later.'],'auth/network-request-failed':['नेटवर्क समस्या है। इंटरनेट कनेक्शन जाँचें।','Network error. Check your internet connection.'],'permission-denied':['आपको यह कार्य करने की अनुमति नहीं है।','You do not have permission to perform this action.'],'unavailable':['सेवा अभी उपलब्ध नहीं है। कुछ देर बाद फिर प्रयास करें।','The service is currently unavailable. Please try again later.'],'deadline-exceeded':['अनुरोध में अधिक समय लगा। फिर प्रयास करें।','The request timed out. Please try again.'],'resource-exhausted':['सेवा की सीमा पूरी हो गई है। कुछ देर बाद फिर प्रयास करें।','The service limit has been reached. Please try again later.'],'auth/weak-password':['पासवर्ड पर्याप्त मज़बूत नहीं है।','The password is too weak.'],'auth/operation-not-allowed':['यह लॉगिन तरीका अभी चालू नहीं है।','This sign-in method is not enabled.'],'auth/user-not-found':['इस ईमेल से कोई खाता नहीं मिला।','No account was found for this email.'],'auth/wrong-password':['पासवर्ड सही नहीं है।','The password is incorrect.'],'auth/requires-recent-login':['सुरक्षा के लिए फिर से लॉगिन करें और दोबारा प्रयास करें।','For security, sign in again and retry.'],'auth/invalid-password':['पासवर्ड सही नहीं है।','The password is invalid.'],'auth/account-exists-with-different-credential':['इस ईमेल के लिए दूसरा लॉगिन तरीका पहले से जुड़ा है।','A different sign-in method is already linked to this email.'],'ફાઇલ અપલોડ કરવાની પરવાનગી નથી.':['फ़ाइल अपलोड करने की अनुमति नहीं है।','You are not allowed to upload this file.'],'ફાઇલ અપલોડ રદ થયું.':['फ़ाइल अपलोड रद्द कर दिया गया।','File upload was cancelled.'],'અપલોડમાં વારંવાર સમસ્યા આવી. ફરી પ્રયાસ કરો.':['अपलोड में बार-बार समस्या आई। फिर प्रयास करें।','The upload failed repeatedly. Please retry.'],'આ કાર્ય માટે લોગિન જરૂરી છે.':['इस कार्य के लिए लॉगिन आवश्यक है।','Login is required for this action.'],'આ કાર્ય કરવાની પરવાનગી નથી.':['आपको यह कार्य करने की अनुमति नहीं है।','You do not have permission to do this.']
 };
 const mgLang=()=>{try{return localStorage.getItem('mg_language')||'gu'}catch(_){return 'gu'}};
 const mgTr=(v)=>{let out=String(v??''),l=mgLang();if(l==='gu')return out;for(const [k,a] of Object.entries(MG_MSG))out=out.split(k).join(a[l==='hi'?0:1]);return out};
 const oldAlert=window.alert.bind(window),oldConfirm=window.confirm.bind(window),oldPrompt=window.prompt.bind(window);
 window.alert=m=>oldAlert(mgTr(m));window.confirm=m=>oldConfirm(mgTr(m));window.prompt=(m,v)=>oldPrompt(mgTr(m),v);

 if(!status)return;
 let app,auth,db,functions,currentUser=null;
 const say=(m,bad=false)=>{status.textContent=mgTr(m);status.style.color=bad?'#b42318':'#536071'};
 // Keep guest and signed-in customer favourites separate on shared devices.
 const favKey=()=>currentUser&&!currentUser.isAnonymous?`mg_favs_user_${currentUser.uid}`:'mg_favs_guest';
 const readKey=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(_){return[]}};
 const favs=()=>readKey(favKey());
 const saveFavs=a=>{const clean=[...new Set((a||[]).map(String).filter(Boolean))];try{localStorage.setItem(favKey(),JSON.stringify(clean));localStorage.setItem('mg_favs',JSON.stringify(clean))}catch(_){}};
 const showActiveFavs=()=>{try{localStorage.setItem('mg_favs',JSON.stringify(favs()))}catch(_){}};
 const safe=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function refreshFavs(){
   if(!currentUser||currentUser.isAnonymous)return;
   const uid=currentUser.uid,ref=collection(db,'users',uid,'favorites');
   const snap=await getDocs(ref);const remote=snap.docs.map(d=>d.id);
   // Migrate legacy guest favourites to the first signed-in account only once per device.
   // Later accounts never inherit another account's private favourites.
   let local=favs();
   const migrationKey='mg_guest_favs_migrated_v1';
   if(localStorage.getItem(migrationKey)!=='yes'){
     const guest=readKey('mg_favs_guest');
     const legacy=readKey('mg_favs');
     const importIds=[...new Set([...guest,...legacy].map(String).filter(Boolean))];
     local=[...new Set([...local,...importIds])];
   }
   const merged=[...new Set([...local,...remote])];
   saveFavs(merged);
   for(const id of merged){if(!remote.includes(id))await setDoc(doc(db,'users',uid,'favorites',id),{listingId:id,createdAt:serverTimestamp()});}
   // Mark migration only after all writes succeed.
   try{localStorage.setItem(migrationKey,'yes')}catch(_){}
   $('customerFavList').textContent=mgTr('તમારા એકાઉન્ટમાં ')+`${merged.length} `+mgTr('મનપસંદ પ્રોપર્ટી સેવ છે. આ જ ઈમેલથી બીજા ફોનમાં લોગિન કરશો તો પણ મળશે.');
   document.dispatchEvent(new CustomEvent('marughar:favorites-updated'));
 }
 window.mgSyncFavorite=async(id,on)=>{
   if(!currentUser||currentUser.isAnonymous)return;
   const uid=currentUser.uid,ref=doc(db,'users',uid,'favorites',String(id));
   try{
     const current=favs();saveFavs(on?[...current,String(id)]:current.filter(x=>x!==String(id)));
     if(on)await setDoc(ref,{listingId:String(id),createdAt:serverTimestamp()});else await deleteDoc(ref);
     document.dispatchEvent(new CustomEvent('marughar:favorites-updated'));
   }catch(e){console.warn('favorite sync failed',e);say('મનપસંદ Sync ન થયું. ફરી લોગિન કરીને પ્રયાસ કરો.',true)}
 };
 window.mgCreateEnquiry=async listing=>{
   if(!currentUser||currentUser.isAnonymous){say('પૂછપરછ મોકલવા પહેલાં ગ્રાહક એકાઉન્ટમાં લોગિન કરો.',true);$('customerAccount').scrollIntoView({behavior:'smooth'});return;}
   const name=prompt('તમારું નામ લખો:');if(!name||name.trim().length<2)return;
   const phone=prompt('તમારો મોબાઇલ નંબર લખો:');if(!phone||!/^[0-9+() -]{10,16}$/.test(phone.trim())){alert('યોગ્ય મોબાઇલ નંબર લખો.');return;}
   const message=(prompt('તમારો પ્રશ્ન / જરૂરિયાત લખો (વૈકલ્પિક):')||'').trim().slice(0,500);
   try{await addDoc(collection(db,'enquiries'),{uid:currentUser.uid,listingId:String(listing.id),listingTitle:String(listing.title||listing.type||'પ્રોપર્ટી').slice(0,120),customerName:name.trim().slice(0,80),customerPhone:phone.trim(),message,status:'pending',createdAt:serverTimestamp()});alert('તમારી પૂછપરછ મોકલાઈ ગઈ છે. એડમિન તમારો સંપર્ક કરશે.');}
   catch(e){console.error(e);alert('પૂછપરછ મોકલી શકાઈ નથી: '+(e.code||e.message));}
 };
 async function loadMyProperties(){
   const box=$('customerMyPropertiesList'); if(!box)return;
   box.replaceChildren();
   if(!currentUser||currentUser.isAnonymous){box.textContent=mgTr('મારી પ્રોપર્ટી જોવા માટે ગ્રાહક એકાઉન્ટમાં લોગિન કરો.');return;}
   const loading=document.createElement('div');loading.textContent=mgTr('તમારી પ્રોપર્ટી લોડ થઈ રહી છે…');box.append(loading);
   try{
     const snap=await getDocs(query(collection(db,'listings'),where('submitterUid','==',currentUser.uid),limit(100)));
     box.replaceChildren();
     if(snap.empty){box.textContent=mgTr('આ લોગિન એકાઉન્ટથી હજી કોઈ પ્રોપર્ટી મોકલેલી નથી.');return;}
     const rows=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>{
       const ta=a.createdAt?.toMillis?.()||0,tb=b.createdAt?.toMillis?.()||0;return tb-ta;
     });
     rows.forEach(item=>{
       const card=document.createElement('article');card.style.cssText='padding:12px;margin:8px 0;border:1px solid #e4d6b4;border-radius:11px;background:#fff';
       const heading=document.createElement('div');heading.style.cssText='font-weight:800;color:#173b30';heading.textContent=[item.type,item.purpose,item.location].filter(Boolean).join(' · ')||mgTr('પ્રોપર્ટી');card.append(heading);
       const statusRow=document.createElement('div');statusRow.style.cssText='margin-top:7px;font-weight:800';
       const state=String(item.status||'pending');const labels={pending:['મંજૂરી માટે બાકી છે','Pending approval'],approved:['મંજૂર — પ્રોપર્ટી જાહેર છે','Approved — listing is public'],rejected:['નામંજૂર','Rejected']};
       statusRow.textContent=mgTr(labels[state]?.[0]||'સ્થિતિ ઉપલબ્ધ નથી');statusRow.style.color=state==='approved'?'#187044':state==='rejected'?'#b42318':'#946200';card.append(statusRow);
       if(item.reviewNote){const note=document.createElement('p');note.style.cssText='margin:7px 0 0;color:#8b2424';note.textContent=mgTr('એડમિનની નોંધ: ')+String(item.reviewNote).slice(0,300);card.append(note);}
       const date=item.createdAt?.toDate?.();if(date&&!Number.isNaN(date.getTime())){const meta=document.createElement('small');meta.style.color='#68736d';meta.textContent=mgTr('મોકલ્યાની તારીખ: ')+date.toLocaleDateString(mgLang()==='gu'?'gu-IN':mgLang()==='hi'?'hi-IN':'en-IN');card.append(meta)}
       box.append(card);
     });
   }catch(e){console.error('owner listings load failed',e);box.textContent=mgTr('તમારી પ્રોપર્ટી લોડ થઈ શકી નથી: ')+(e.code||e.message||'');}
 }
 async function exportMyData(){if(!currentUser||currentUser.isAnonymous){say('પહેલાં લોગિન કરો.',true);return;}try{const [f,n,e]=await Promise.all([getDocs(collection(db,'users',currentUser.uid,'favorites')),getDocs(query(collection(db,'users',currentUser.uid,'notifications'),orderBy('createdAt','desc'),limit(500))),getDocs(query(collection(db,'enquiries'),where('uid','==',currentUser.uid),limit(500)))]);const payload={schemaVersion:1,exportedAt:new Date().toISOString(),email:currentUser.email||'',favorites:f.docs.map(d=>({id:d.id,...d.data()})),notifications:n.docs.map(d=>({id:d.id,...d.data()})),enquiries:e.docs.map(d=>({id:d.id,...d.data()}))};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='maru-ghar-my-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('તમારો ડેટા ડાઉનલોડ થયો.');}catch(e){say('ડેટા ડાઉનલોડ નિષ્ફળ: '+(e.code||e.message),true)}}
 async function restoreMyData(file){
   if(!currentUser||currentUser.isAnonymous){say('પહેલાં લોગિન કરો.',true);return;}
   if(!file||file.size>2*1024*1024){say('બેકઅપ ફાઇલ 2 MBથી નાની હોવી જોઈએ.',true);return;}
   try{
     const raw=JSON.parse(await file.text());
     if(raw?.schemaVersion!==1||!Array.isArray(raw.favorites)||raw.favorites.length>5000)throw new Error('invalid-backup');
     const ids=[...new Set(raw.favorites.map(x=>String(x?.id||x?.listingId||'')).filter(x=>x&&x.length<=128&&!x.includes('/')))];
     if(!ids.length){say('બેકઅપમાં પુનઃસ્થાપિત કરવા મનપસંદ પ્રોપર્ટી નથી.',true);return;}
     if(!confirm(`${ids.length} મનપસંદ પ્રોપર્ટી તમારા હાલના એકાઉન્ટમાં ઉમેરાશે. હાલની યાદી ડિલીટ નહીં થાય. આગળ વધવું છે?`))return;
     for(const id of ids)await setDoc(doc(db,'users',currentUser.uid,'favorites',id),{listingId:id,restoredAt:serverTimestamp()},{merge:true});
     saveFavs([...favs(),...ids]);await refreshFavs();say('બેકઅપમાંથી મનપસંદ પ્રોપર્ટી પાછી આવી ગઈ.');
   }catch(e){console.error('restore failed',e);say('બેકઅપ ખોલી શકાયું નથી અથવા તેમાં ખોટો ડેટા છે.',true)}
 }
 async function deleteMyAccount(){if(!currentUser||currentUser.isAnonymous){say('પહેલાં લોગિન કરો.',true);return;}if(!confirm('તમારું એકાઉન્ટ, મનપસંદ યાદી, સૂચનાઓ અને પૂછપરછ કાયમ માટે ડિલીટ થશે. આગળ વધવું છે?'))return;try{const fn=httpsCallable(functions,'deleteMyAccount');await fn({});await signOut(auth);saveFavs([]);say('એકાઉન્ટ ડિલીટ થયું.');}catch(e){say('એકાઉન્ટ ડિલીટ થઈ શક્યું નથી: '+(e.code||e.message),true)}}
 async function loadNotifications(){
   if(!currentUser||currentUser.isAnonymous)return;
   try{const s=await getDocs(query(collection(db,'users',currentUser.uid,'notifications'),orderBy('createdAt','desc'),limit(10)));const box=$('customerNotifications');box.replaceChildren();if(s.empty)return;const h=document.createElement('b');h.textContent='🔔 ભાવ / એકાઉન્ટ સૂચનાઓ';box.append(h);s.docs.forEach(d=>{const x=d.data(),row=document.createElement('div');row.style.cssText='padding:9px 0;border-bottom:1px solid #ddd;display:flex;gap:8px;align-items:center;justify-content:space-between';const msg=document.createElement('span');msg.textContent=(x.read?'':'🔔 ')+(x.message||'નવી સૂચના');row.append(msg);if(!x.read){const b=document.createElement('button');b.type='button';b.textContent='વાંચી';b.style.cssText='padding:5px 9px;border:1px solid #c8a44f;border-radius:7px;background:#fff8e5;color:#333';b.addEventListener('click',async()=>{try{await updateDoc(doc(db,'users',currentUser.uid,'notifications',d.id),{read:true});await loadNotifications()}catch(e){say('સૂચના અપડેટ ન થઈ: '+(e.code||e.message),true)}});row.append(b)}box.append(row)});}catch(e){console.warn('notifications unavailable',e)}
 }
 async function init(){
   try{app=getApps()[0]||initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);functions=getFunctions(app);}
   catch(e){say('Firebase જોડાણ ઉપલબ્ધ નથી. '+(e.message||''),true);return;}
   $('customerRegister').addEventListener('click',async()=>{const email=$('customerEmail').value.trim(),password=$('customerPassword').value;if(password.length<6){say('પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ.',true);return;}try{await createUserWithEmailAndPassword(auth,email,password);say('એકાઉન્ટ સફળતાપૂર્વક બન્યું.');}catch(e){say('એકાઉન્ટ બની શક્યું નથી: '+(e.code||e.message),true)}});
   $('customerLogin').addEventListener('click',async()=>{try{await signInWithEmailAndPassword(auth,$('customerEmail').value.trim(),$('customerPassword').value);say('લોગિન સફળ.');}catch(e){say('લોગિન નિષ્ફળ: '+(e.code||e.message),true)}});
   $('customerExport').addEventListener('click',exportMyData);$('customerDelete').addEventListener('click',deleteMyAccount);
   $('customerMyPropertiesReload')?.addEventListener('click',loadMyProperties);
   const restoreBtn=$('customerRestore'),restoreFile=$('customerRestoreFile');
   if(restoreBtn&&restoreFile){restoreBtn.addEventListener('click',()=>restoreFile.click());restoreFile.addEventListener('change',async()=>{const f=restoreFile.files?.[0];if(f)await restoreMyData(f);restoreFile.value='';});}
   $('customerLogout').addEventListener('click',async()=>{try{await signOut(auth);say('લોગઆઉટ થયું.')}catch(e){say('લોગઆઉટ નિષ્ફળ.',true)}});
   onAuthStateChanged(auth,async u=>{
     currentUser=u;
     $('customerLogout').classList.toggle('hidden',!u||u.isAnonymous);$('customerExport').classList.toggle('hidden',!u||u.isAnonymous);$('customerDelete').classList.toggle('hidden',!u||u.isAnonymous);if($('customerRestore'))$('customerRestore').classList.toggle('hidden',!u||u.isAnonymous);$('customerRegister').classList.toggle('hidden',!!u&&!u.isAnonymous);$('customerLogin').classList.toggle('hidden',!!u&&!u.isAnonymous);
     if(u&&!u.isAnonymous){say('લોગિન: '+(u.email||'ગ્રાહક'));try{await refreshFavs();await loadNotifications();await loadMyProperties()}catch(e){say('એકાઉન્ટ ડેટા લોડ ન થયું: '+(e.code||e.message),true)}}
     else {showActiveFavs();$('customerFavList').textContent='લોગિન કર્યા પછી મનપસંદ પ્રોપર્ટી Sync થશે.';if($('customerMyPropertiesList'))$('customerMyPropertiesList').textContent=mgTr('મારી પ્રોપર્ટી જોવા માટે ગ્રાહક એકાઉન્ટમાં લોગિન કરો.');document.dispatchEvent(new CustomEvent('marughar:favorites-updated'))}
   });
 }
 init();
})();
