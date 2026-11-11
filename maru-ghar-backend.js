import { firebaseConfig, cloudinaryConfig, isFirebaseConfigured, isCloudinaryConfigured } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, collection, getDocs, getDoc, doc, query, where, orderBy, limit, startAfter, addDoc, setDoc, serverTimestamp, Timestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const form = document.getElementById('propertyForm');
const statusBox = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitListingBtn');
const grid = document.getElementById('properties');
// Never leave design/demo cards visible if Firebase is unavailable; public listings must come from Firestore only.
if (grid) grid.replaceChildren();
const count = document.getElementById('count');
const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MG_BACKEND_MSG={
'':['सेटअप बाकी: Live save/upload के लिए Firebase web config और Cloudinary Cloud Name भरें।','Setup required: Add Firebase web config and Cloudinary Cloud Name for live save/upload.'],
'Firebase rules અથવા index તપાસો.':['Firebase rules या index जाँचें।','Check Firebase rules or index.'],'ફોટા માટે Cloudinary config ઉપલબ્ધ નથી.':['फ़ोटो के लिए Cloudinary config उपलब्ध नहीं है।','Cloudinary config is unavailable for photos.'],'ફોટો અપલોડ નિષ્ફળ.':['फ़ोटो अपलोड विफल।','Photo upload failed.'],'Cloudinaryમાં વીડિયો માટે અલગ Unsigned Upload Preset બનાવો અને firebase-config.js માં videoUploadPreset લખો.':['Cloudinary में वीडियो के लिए अलग Unsigned Upload Preset बनाएँ और firebase-config.js में videoUploadPreset लिखें।','Create a separate unsigned video upload preset in Cloudinary and set videoUploadPreset in firebase-config.js.'],'લિસ્ટિંગ લોડ ન થઈ:':['लिस्टिंग लोड नहीं हुई:','Could not load listings:'],'Firebase જોડાણ/રીડ નિષ્ફળ:':['Firebase कनेक्शन/रीड विफल:','Firebase connection/read failed:'],'લિસ્ટિંગ સાચવી શકાતી નથી:':['लिस्टिंग सेव नहीं की जा सकती:','Cannot save listing:'],'લિસ્ટિંગ મોકલવામાં નિષ્ફળ:':['लिस्टिंग भेजने में विफल:','Failed to submit listing:'],'ફરિયાદ મોકલી શકાઈ નથી. થોડી વાર પછી ફરી પ્રયાસ કરો.':['शिकायत नहीं भेजी जा सकी। थोड़ी देर बाद फिर प्रयास करें।','Could not submit report. Please try again later.'],'આભાર! તમારી ફરિયાદ એડમિનને મોકલાઈ.':['धन्यवाद! आपकी शिकायत एडमिन को भेज दी गई है।','Thank you! Your report has been sent to the admin.'],'માત્ર JPG, PNG અથવા WEBP ફોટા સ્વીકારાય છે.':['केवल JPG, PNG या WEBP फोटो स्वीकार किए जाते हैं।','Only JPG, PNG or WEBP photos are accepted.'],'દરેક ફોટો 8 MB કરતાં નાનો હોવો જોઈએ.':['हर फोटो 8 MB से कम होना चाहिए।','Each photo must be smaller than 8 MB.'],'ઇન્ટરનેટ કનેક્શન તૂટ્યું.':['इंटरनेट कनेक्शन टूट गया।','Internet connection was interrupted.'],'Cloudinary ગોઠવાયેલું નથી.':['Cloudinary कॉन्फ़िगर नहीं है।','Cloudinary is not configured.'],'દરેક વિડિયો 25 MB કરતાં નાનો હોવો જોઈએ.':['हर वीडियो 25 MB से कम होना चाहिए।','Each video must be smaller than 25 MB.'],'વિડિયો માત્ર MP4, WEBM અથવા MOV હોવો જોઈએ.':['वीडियो केवल MP4, WEBM या MOV होना चाहिए।','Video must be MP4, WEBM or MOV.'],'લિસ્ટિંગ સાચવાઈ ગઈ.':['लिस्टिंग सेव हो गई।','Listing saved.'],'લિસ્ટિંગ મોકલવામાં નિષ્ફળ:':['लिस्टिंग भेजने में विफल:','Failed to submit listing:'],'માલિકનો સંપર્ક નંબર જોવા માટે પહેલાં ગ્રાહક એકાઉન્ટમાં Login કરો.':['मालिक का संपर्क नंबर देखने के लिए पहले ग्राहक खाते में लॉगिन करें।','Log in to your customer account to view the owner’s contact number.'],'માલિકનો નંબર ઉપલબ્ધ નથી.':['मालिक का नंबर उपलब्ध नहीं है।','Owner phone number is unavailable.'],'Cloudinary Cloud Name ગોઠવાયેલું નથી. firebase-config.js માં cloudName ભરો.':['Cloudinary Cloud Name कॉन्फ़िगर नहीं है। firebase-config.js में cloudName भरें।','Cloudinary Cloud Name is not configured. Set cloudName in firebase-config.js.'],'આ લિસ્ટિંગમાં શું ખોટું છે? ટૂંકમાં લખો (ખોટો ફોન, વેચાઈ ગયું, ખોટી માહિતી…):':['इस लिस्टिंग में क्या गलत है? संक्षेप में लिखें (गलत फोन, बिक गई, गलत जानकारी…):','What is wrong with this listing? Briefly describe (wrong phone, sold, incorrect information…):'],'માલિકનો સંપર્ક નંબર જોવા માટે પહેલાં ગ્રાહક એકાઉન્ટમાં Login કરો.':['मालिक का संपर्क नंबर देखने के लिए पहले ग्राहक खाते में लॉगिन करें।','Log in to your customer account to view the owner’s contact number.']};
const mgBackendTranslate=(msg)=>{let out=String(msg??''),l='gu';try{l=localStorage.getItem('mg_language')||'gu'}catch(_){}if(l==='gu')return out;for(const [k,a] of Object.entries(MG_BACKEND_MSG))out=out.split(k).join(a[l==='hi'?0:1]);return out};
const setStatus = (msg, bad=false) => { if(statusBox){statusBox.textContent=mgBackendTranslate(msg);statusBox.style.color=bad?'#ffb4a9':'#f3d37b';} };
const mgOldAlert=window.alert.bind(window),mgOldConfirm=window.confirm.bind(window),mgOldPrompt=window.prompt.bind(window);window.alert=m=>mgOldAlert(mgBackendTranslate(m));window.confirm=m=>mgOldConfirm(mgBackendTranslate(m));window.prompt=(m,v)=>mgOldPrompt(mgBackendTranslate(m),v);
let db=null, auth=null, liveMode=false, lastListingDoc=null, loadingMore=false, hasMoreListings=true;
const PAGE_SIZE=12;
const ADMIN_UID='yJYiuaUE3KXVLVuWqLyLRH5owQJ3';
// Default Gujarat cities. The admin can add more cities from the admin panel (stored in Firestore) - no rebuild needed.
const DEFAULT_CITIES=[["ગાંધીનગર", "Gandhinagar"], ["અમદાવાદ", "Ahmedabad"], ["સુરત", "Surat"], ["વડોદરા", "Vadodara"], ["રાજકોટ", "Rajkot"], ["ભાવનગર", "Bhavnagar"], ["જામનગર", "Jamnagar"], ["જૂનાગઢ", "Junagadh"], ["આણંદ", "Anand"], ["નડિયાદ", "Nadiad"], ["મહેસાણા", "Mehsana"], ["કલોલ", "Kalol"], ["મોરબી", "Morbi"], ["સુરેન્દ્રનગર", "Surendranagar"], ["ભરૂચ", "Bharuch"], ["વાપી", "Vapi"], ["નવસારી", "Navsari"], ["પાટણ", "Patan"], ["ગોધરા", "Godhra"], ["પોરબંદર", "Porbandar"], ["ભુજ", "Bhuj"], ["અમરેલી", "Amreli"], ["પાલનપુર", "Palanpur"], ["હિંમતનગર", "Himatnagar"]];
let currentCity='all';
function mergeCities(extra){const m=new Map(DEFAULT_CITIES.map(([n,e])=>[n,e]));(extra||[]).forEach(c=>{if(c&&c.name)m.set(c.name,c.nameEn||m.get(c.name)||'')});return [...m.entries()];}
async function loadCities(){
  let extra=[];try{const s=await getDocs(collection(db,'cities'));extra=s.docs.map(d=>d.data());}catch(e){console.warn('cities load failed (defaults used):',e);}
  const list=mergeCities(extra);
  const cf=document.getElementById('cityFilter'); if(cf){cf.replaceChildren(new Option('આખું ગુજરાત','all'));list.forEach(([n,en])=>{const o=new Option(n,n);o.dataset.en=en||'';cf.appendChild(o)});cf.value=currentCity;}
  const ff=document.getElementById('cityField'); if(ff){const cur=ff.value||'ગાંધીનગર';ff.replaceChildren();list.forEach(([n])=>ff.appendChild(new Option(n,n)));ff.value=list.some(([n])=>n===cur)?cur:list[0][0];}
}
function isTrustedMapsUrl(value){try{const u=new URL(String(value||''));return u.protocol==='https:'&&(['google.com','www.google.com','maps.google.com','maps.app.goo.gl','goo.gl'].includes(u.hostname.toLowerCase()))&&((u.hostname==='google.com'||u.hostname==='www.google.com')?u.pathname.startsWith('/maps'):u.hostname==='goo.gl'?u.pathname.startsWith('/maps'):true)}catch(_){return false}}
function mapHref(p){const l=String(p.mapLink||'').trim();if(isTrustedMapsUrl(l))return l;return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent([p.location,p.city||'ગાંધીનગર','ગુજરાત'].filter(Boolean).join(', '));}
// Private entry for the owner: tap the brand 7 times to open the admin login (login is still required).
(()=>{let t=0,tm;document.querySelector('.brand')?.addEventListener('click',()=>{t++;clearTimeout(tm);tm=setTimeout(()=>{t=0},2000);if(t>=7){t=0;location.href='admin.html#login'}})})();

async function uploadPhoto(file) {
  if (!isCloudinaryConfigured()) throw new Error('Cloudinary Cloud Name ગોઠવાયેલું નથી. firebase-config.js માં cloudName ભરો.');
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('માત્ર JPG, PNG અથવા WEBP ફોટા સ્વીકારાય છે.');
  if (file.size > 8*1024*1024) throw new Error('દરેક ફોટો 8 MB કરતાં નાનો હોવો જોઈએ.');
  const body = new FormData(); body.append('file', file); body.append('upload_preset', cloudinaryConfig.uploadPreset);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudinaryConfig.cloudName)}/image/upload`, {method:'POST',body});
  const data = await response.json().catch(()=>({}));
  if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'ફોટા અપલોડ થઈ શક્યા નહીં. ફરી પ્રયાસ કરો.');
  return {url:data.secure_url, publicId:data.public_id};
}


const VIDEO_TYPES=['video/mp4','video/webm','video/quicktime'];
const VIDEO_MAX=25*1024*1024;
function uploadVideoOnce(file,onProgress){
  return new Promise((resolve,reject)=>{
    if(!cloudinaryConfig.videoUploadPreset || cloudinaryConfig.videoUploadPreset.startsWith('PASTE_')) throw new Error('Cloudinaryમાં વીડિયો માટે અલગ Unsigned Upload Preset બનાવો અને firebase-config.js માં videoUploadPreset લખો.');
    const body=new FormData(); body.append('file',file); body.append('upload_preset',cloudinaryConfig.videoUploadPreset);
    const xhr=new XMLHttpRequest();
    xhr.open('POST',`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudinaryConfig.cloudName)}/video/upload`);
    xhr.upload.onprogress=e=>{if(e.lengthComputable&&onProgress)onProgress(Math.round(e.loaded/e.total*100));};
    xhr.onerror=()=>reject(new Error('ઇન્ટરનેટ કનેક્શન તૂટ્યું.'));
    xhr.onload=()=>{let d={};try{d=JSON.parse(xhr.responseText)}catch(_){}
      if(xhr.status>=200&&xhr.status<300&&d.secure_url)resolve({url:d.secure_url,publicId:d.public_id,format:d.format||'',bytes:d.bytes||file.size});
      else reject(new Error(d.error?.message||`વિડિયો અપલોડ નિષ્ફળ (HTTP ${xhr.status}). Cloudinary preset વિડિયો માટે મંજૂર છે કે નહીં તપાસો.`));};
    xhr.send(body);
  });
}
async function uploadVideo(file,onProgress){
  if(!isCloudinaryConfigured())throw new Error('Cloudinary ગોઠવાયેલું નથી.');
  if(!cloudinaryConfig.videoUploadPreset || cloudinaryConfig.videoUploadPreset.startsWith('PASTE_'))throw new Error('Cloudinaryમાં વીડિયો માટે અલગ Unsigned Upload Preset બનાવો અને firebase-config.js માં videoUploadPreset લખો.');
  if(!VIDEO_TYPES.includes(file.type))throw new Error('વિડિયો માત્ર MP4, WEBM અથવા MOV હોવો જોઈએ.');
  if(file.size>VIDEO_MAX)throw new Error('દરેક વિડિયો 25 MB કરતાં નાનો હોવો જોઈએ.');
  let lastErr;
  for(let attempt=1;attempt<=3;attempt++){
    try{return await uploadVideoOnce(file,onProgress);}catch(e){lastErr=e;if(attempt<3&&onProgress)onProgress(-attempt);await new Promise(r=>setTimeout(r,1200*attempt));}
  }
  throw lastErr;
}

const cld=(u,t)=>/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?!(?:[a-z]{1,3}_[^/]*,?)+\/)/.test(u)?u.replace('/image/upload/','/image/upload/'+t+'/'):u;
const isHttps=u=>typeof u==='string'&&/^https:\/\//i.test(u);
const posterOf=u=>{const p=u.replace(/\.[a-z0-9]+(\?.*)?$/i,'.jpg');return /^https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\//.test(p)?p.replace('/video/upload/','/video/upload/so_0,w_640,q_auto/'):p;};
function buildMedia(p){
  const photos=(Array.isArray(p.photos)?p.photos:[]).filter(x=>x&&isHttps(x.url)).map(x=>({t:'img',url:x.url,s:cld(x.url,'f_auto,q_auto,w_900'),l:cld(x.url,'f_auto,q_auto,w_1600')}));
  const videos=(Array.isArray(p.videos)?p.videos:[]).filter(x=>x&&isHttps(x.url)).map(x=>({t:'vid',url:x.url}));
  return [...photos,...videos];
}
function slideHtml(m,i,alt){
  return m.t==='img'
    ? `<div class="mg-slide" data-i="${i}" data-mg-open="1" role="button" aria-label="ફોટો મોટો જુઓ" data-bg="${esc(m.s||m.url)}"${i===0?` style="background-image:url('${esc(m.s||m.url)}')"`:''}></div>`
    : `<div class="mg-slide mg-vid" data-i="${i}"><video src="${esc(m.url)}" poster="${esc(posterOf(m.url))}" controls playsinline preload="metadata" aria-label="${esc(alt)} વિડિયો"></video><button type="button" class="mg-full" data-mg-open="1" aria-label="મોટા સ્ક્રીનમાં જુઓ">⤢</button></div>`;
}
function sliderHtml(p,media){
  const alt=p.type||'પ્રોપર્ટી';
  const pill=`<span class="pill">${esc(p.purpose||'પ્રોપર્ટી')}</span>`;
  if(!media.length) return `<div class="photo">${pill}</div>`;
  const nav=media.length>1?`<button type="button" class="mg-nav mg-prev" data-mg-step="-1" aria-label="પાછળનો">‹</button><button type="button" class="mg-nav mg-next" data-mg-step="1" aria-label="આગળનો">›</button><span class="mg-count">1 / ${media.length}</span>`:'';
  return `<div class="photo mg-slider" data-n="${media.length}" data-cur="0"><div class="mg-track">${media.map((m,i)=>slideHtml(m,i,alt)).join('')}</div>${pill}${nav}</div>`;
}
const sliderData=new WeakMap();
function goTo(sl,idx){
  const n=+sl.dataset.n; idx=(idx+n)%n; sl.dataset.cur=idx;
  sl.querySelector('.mg-track').style.transform=`translateX(-${idx*100}%)`;
  const c=sl.querySelector('.mg-count'); if(c)c.textContent=`${idx+1} / ${n}`;
  [idx,(idx+1)%n].forEach(k=>{const s=sl.querySelector(`.mg-slide[data-i="${k}"][data-bg]`);if(s&&!s.style.backgroundImage)s.style.backgroundImage=`url('${s.dataset.bg}')`;});
  sl.querySelectorAll('video').forEach(v=>{try{v.pause()}catch(_){}});
}
let lb=null, lbMedia=[], lbIdx=0;
function ensureLb(){
  if(lb)return lb;
  lb=document.createElement('div'); lb.className='mg-lb'; lb.hidden=true;
  lb.innerHTML='<button type="button" class="mg-lb-x" aria-label="બંધ કરો">✕</button><button type="button" class="mg-nav mg-prev" data-lb="-1" aria-label="પાછળનો">‹</button><div class="mg-lb-stage"></div><button type="button" class="mg-nav mg-next" data-lb="1" aria-label="આગળનો">›</button><span class="mg-count"></span>';
  document.body.appendChild(lb);
  lb.addEventListener('click',e=>{
    if(e.target.closest('.mg-lb-x')||e.target===lb||e.target.classList.contains('mg-lb-stage')){closeLb();return;}
    const s=e.target.closest('[data-lb]'); if(s)showLb(lbIdx+ +s.dataset.lb);
  });
  let sx=null; lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',e=>{if(sx==null||lbMedia.length<2)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)showLb(lbIdx+(dx<0?1:-1));sx=null},{passive:true});
  document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')showLb(lbIdx+1);if(e.key==='ArrowLeft')showLb(lbIdx-1);});
  return lb;
}
function showLb(i){
  if(!lbMedia.length)return; lbIdx=(i+lbMedia.length)%lbMedia.length; const m=lbMedia[lbIdx]; const st=lb.querySelector('.mg-lb-stage');
  st.replaceChildren();
  if(m.t==='img'){const im=document.createElement('img');im.src=m.l||m.url;im.alt='પ્રોપર્ટી ફોટો';st.appendChild(im);}
  else{const v=document.createElement('video');v.src=m.url;v.controls=true;v.autoplay=true;v.playsInline=true;st.appendChild(v);}
  lb.querySelector('.mg-count').textContent=`${lbIdx+1} / ${lbMedia.length}`;
  lb.querySelectorAll('.mg-nav').forEach(x=>x.style.display=lbMedia.length>1?'':'none');
}
function openLb(media,i){ensureLb();lbMedia=media;lb.hidden=false;document.body.style.overflow='hidden';showLb(i);}
function closeLb(){if(!lb)return;lb.hidden=true;lb.querySelector('.mg-lb-stage').replaceChildren();document.body.style.overflow='';}
if(grid){
  grid.addEventListener('click',e=>{
    const sl=e.target.closest('.mg-slider'); if(!sl)return;
    const step=e.target.closest('[data-mg-step]');
    if(step){goTo(sl,+sl.dataset.cur + +step.dataset.mgStep);return;}
    if(e.target.closest('[data-mg-open]')){const m=sliderData.get(sl);if(m)openLb(m,+sl.dataset.cur);}
  });
  let tx=null,tsl=null;
  grid.addEventListener('touchstart',e=>{const t=e.target.closest('.mg-track');if(!t||e.target.closest('video')){tsl=null;return;}tsl=t.closest('.mg-slider');tx=e.touches[0].clientX},{passive:true});
  grid.addEventListener('touchend',e=>{if(!tsl||tx==null||+tsl.dataset.n<2)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40){goTo(tsl,+tsl.dataset.cur+(dx<0?1:-1));}tx=null},{passive:true});
}

function renderLiveProperties(items) {
  if (!grid) return;
  // Only live approved items are rendered in configured mode; demo sample cards are removed.
  if (!items.length && !lastListingDoc) { grid.innerHTML=currentCity==='all'?'<div class="empty">હાલ મંજૂર થયેલી પ્રોપર્ટી ઉપલબ્ધ નથી. માલિકની લિસ્ટિંગ એડમિન મંજૂરી પછી અહીં દેખાશે.</div>':'<div class="empty">આ શહેરમાં હાલ મંજૂર પ્રોપર્ટી ઉપલબ્ધ નથી. બીજું શહેર કે "આખું ગુજરાત" પસંદ કરો.</div>'; }
  for (const p of items) {
    const article=document.createElement('article'); article.className='property';
    article.dataset.type=p.type||''; article.dataset.purpose=p.purpose==='ભાડે'?'rent':'sale';
    article.dataset.city=p.city||'ગાંધીનગર'; article.dataset.id=p.id||''; article.dataset.verified=p.verified?'1':'0'; article.dataset.bhk=p.bhk||''; article.dataset.furn=p.furnishing||''; article.dataset.pricenum=p.priceNum||''; article.dataset.ts=p.createdMs||0; article.dataset.featured=p.featured?'1':''; if(p.closed) article.classList.add('closed'); itemsById.set(p.id,p); article.dataset.search=[p.location,p.city,(DEFAULT_CITIES.find(c=>c[0]===p.city)||[])[1],p.type,p.title,p.description].join(' ').toLowerCase();
    const media=buildMedia(p);
    const waText=encodeURIComponent(`નમસ્તે, મને ${p.type||'પ્રોપર્ટી'} (${p.purpose||''}) વિશે માહિતી જોઈએ. શહેર: ${p.city||'ગાંધીનગર'}. વિસ્તાર: ${p.location||''}. મારું ઘર પરથી લિસ્ટિંગ જોયું છે.`);
    article.innerHTML=`${sliderHtml(p,media)}<div class="property-body">${badgesHtml(p)}<h3 data-act="details">${esc(p.title||p.type||'પ્રોપર્ટી')}</h3><div class="loc">📍 ${esc(p.city||'ગાંધીનગર')} · ${esc(p.location||'વિગતો માટે સંપર્ક')} · <a class="mapa" href="${esc(mapHref(p))}" target="_blank" rel="noopener noreferrer">🗺️ નકશો</a></div><div class="price">${esc(p.price||'કિંમત માટે સંપર્ક')}</div><div class="details">${specsHtml(p)}</div>${p.offerTitle?`<div class="mg-offer" data-act="poster">🎉 ${esc(p.offerTitle)}${p.offerText?' — '+esc(p.offerText):''} · <u>પોસ્ટર જુઓ</u></div>`:''}</div><div class="property-foot"><button class="btn" type="button" data-contact="${esc(p.id)}" data-act="contact">📞 સંપર્ક નંબર જુઓ</button></div><div class="mg-tools"><button type="button" data-act="details">ℹ️ વિગત</button><button type="button" data-act="share">↗ શેર</button><button type="button" data-act="poster">🖼️ પોસ્ટર</button><button type="button" class="mg-fav${isFav(p.id)?' on':''}" data-act="fav" aria-label="મનપસંદ">${isFav(p.id)?'❤️':'🤍'}</button><button type="button" data-act="report" aria-label="ફરિયાદ">🚩</button></div>`;
    grid.appendChild(article);
    const slEl=article.querySelector('.mg-slider'); if(slEl) sliderData.set(slEl,media);
  }
  if(count) count.textContent=`${grid.querySelectorAll('.property').length} પ્રોપર્ટી`;
  const more=document.getElementById('loadMoreListings'); if(more) more.hidden=!hasMoreListings;
  if(typeof window.filterProps==='function') window.filterProps();
}

const CACHE_KEY='mg_first_page_v4', CACHE_MS=3*60*1000;
let lastCursorMs=null;
function readCache(){try{const c=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');if(c&&Date.now()-c.t<CACHE_MS&&Array.isArray(c.items))return c;}catch(_){}return null;}
function writeCache(items,lastMs,hasMore){try{localStorage.setItem(CACHE_KEY,JSON.stringify({t:Date.now(),items,lastMs,hasMore}));}catch(_){}}
async function loadApproved(reset=false) {
  if(loadingMore || (!hasMoreListings && !reset)) return;
  loadingMore=true;
  const more=document.getElementById('loadMoreListings'); if(more){more.disabled=true;more.textContent='લોડ થઈ રહ્યું છે…';}
  try {
    if(reset){lastListingDoc=null;lastCursorMs=null;hasMoreListings=true;grid?.replaceChildren();
      const c=currentCity==='all'?readCache():null; if(c){lastCursorMs=c.lastMs||null;hasMoreListings=!!c.hasMore;renderLiveProperties(c.items);return;}}
    const constraints=[where('status','==','approved'),...(currentCity!=='all'?[where('city','==',currentCity)]:[]),orderBy('createdAt','desc'),limit(PAGE_SIZE)];
    const isFirst=!lastListingDoc&&!lastCursorMs;
    if(lastListingDoc) constraints.push(startAfter(lastListingDoc)); else if(lastCursorMs) constraints.push(startAfter(Timestamp.fromMillis(lastCursorMs)));
    const snap=await getDocs(query(collection(db,'listings'),...constraints));
    lastListingDoc=snap.docs.at(-1)||lastListingDoc;
    hasMoreListings=snap.size===PAGE_SIZE;
    const items=snap.docs.map(d=>{const {createdAt,...r}=d.data();return {id:d.id,...r,createdMs:(createdAt&&createdAt.toMillis)?createdAt.toMillis():0};});
    if(isFirst&&currentCity==='all'){const lm=snap.docs.at(-1)?.data()?.createdAt;writeCache(items,lm&&lm.toMillis?lm.toMillis():null,hasMoreListings);}
    renderLiveProperties(items);
  } catch(e) {
    console.error('Maru Ghar listing page load failed:',e);
    setStatus('લિસ્ટિંગ લોડ ન થઈ. ઇન્ટરનેટ તપાસી ફરી પ્રયાસ કરો.',true);
  } finally {
    loadingMore=false;
    if(more){more.disabled=false;more.textContent='વધુ પ્રોપર્ટી જુઓ';more.hidden=!hasMoreListings;}
  }
}

// ======== Scheme poster, details sheet, share, favourites, reports ========
const itemsById=new Map();
let siteUrlSetting='';
async function loadSettings(){try{const s=await getDoc(doc(db,'settings','site'));if(s.exists())siteUrlSetting=String(s.data().url||'')}catch(e){console.warn('settings load failed:',e)}}
function siteUrl(){if(/^https:\/\//i.test(siteUrlSetting))return siteUrlSetting;
  if(/^https?:$/.test(location.protocol)&&!['localhost','127.0.0.1'].includes(location.hostname))return location.origin+location.pathname.replace(/[^/]*$/,'');return '';}
const getFavs=()=>{try{return JSON.parse(localStorage.getItem('mg_favs')||'[]')}catch(_){return[]}};
const isFav=id=>getFavs().includes(id);
function toggleFav(id){let f=getFavs();f=f.includes(id)?f.filter(x=>x!==id):[...f,id];try{localStorage.setItem('mg_favs',JSON.stringify(f))}catch(_){}const on=f.includes(id);if(typeof window.mgSyncFavorite==='function')window.mgSyncFavorite(id,on);return on;}
function timeAgo(ms){if(!ms)return '';const m=Math.floor((Date.now()-ms)/60000);if(m<60)return 'હમણાં જ';const h=Math.floor(m/60);if(h<24)return h+' કલાક પહેલાં';const d=Math.floor(h/24);return d+' દિવસ પહેલાં';}
function badgesHtml(p){const a=[];
  if(p.closed)a.push(`<span class="mg-b sold">🔴 ${p.purpose==='ભાડે'?'ભાડે અપાઈ ગયું':'વેચાઈ ગયું'}</span>`);
  if(p.verified)a.push('<span class="mg-b ver">✔ વેરિફાઇડ</span>');
  if(p.featured)a.push('<span class="mg-b feat">⭐ ફીચર્ડ</span>');
  if(p.offerTitle)a.push(`<span class="mg-b off">🎉 ${esc(p.offerTitle)}</span>`);
  const t=timeAgo(p.createdMs);if(t)a.push(`<span class="mg-b">🕒 ${t}</span>`);
  return `<div class="mg-badges">${a.join('')}</div>`;}
function specsHtml(p){const a=[p.type||'પ્રોપર્ટી'];if(p.bhk)a.push(p.bhk);if(p.areaSqft)a.push(p.areaSqft+' ચો.ફૂટ');if(p.floor)a.push('માળ '+p.floor);if(p.furnishing)a.push(p.furnishing);if(p.parking)a.push(p.parking);return a.map(x=>`<span>${esc(x)}</span>`).join('');}
function shareText(p){return `${p.type||'પ્રોપર્ટી'} (${p.purpose||''}) — ${p.city||'ગાંધીનગર'}, ${p.location||''}\n${p.price?'💰 '+p.price+'\n':''}${p.offerTitle?'🎉 '+p.offerTitle+(p.offerText?': '+p.offerText:'')+'\n':''}${siteUrl()?'🔗 '+siteUrl()+'\n':''}— મારું ઘર`;}
async function shareListing(p){const text=shareText(p);try{if(navigator.share){await navigator.share({title:'મારું ઘર',text});return}}catch(e){if(e&&e.name==='AbortError')return}
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');}
async function reportListing(p){const reason=(prompt('આ લિસ્ટિંગમાં શું ખોટું છે? ટૂંકમાં લખો (ખોટો ફોન, વેચાઈ ગયું, ખોટી માહિતી…):')||'').trim();
  if(reason.length<2)return;
  try{if(!auth.currentUser)await signInAnonymously(auth);await addDoc(collection(db,'reports'),{listingId:String(p.id).slice(0,40),reason:reason.slice(0,300),createdAt:serverTimestamp(),uid:auth.currentUser.uid});alert('આભાર! તમારી ફરિયાદ એડમિનને મોકલાઈ.');}
  catch(e){console.error(e);alert('ફરિયાદ મોકલી શકાઈ નથી. થોડી વાર પછી ફરી પ્રયાસ કરો.');}}
function closeSheets(){document.querySelectorAll('.mgm').forEach(x=>x.remove());document.body.style.overflow='';}
function sheet(inner){closeSheets();const m=document.createElement('div');m.className='mgm';m.innerHTML=`<div class="mgm-box"><button type="button" class="mgm-x" aria-label="બંધ કરો">✕</button>${inner}</div>`;
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.mgm-x'))closeSheets()});document.body.appendChild(m);document.body.style.overflow='hidden';return m;}
async function getPrivateOwnerPhone(listingId){
  const u=auth?.currentUser;
  if(!u||u.isAnonymous){alert('માલિકનો સંપર્ક નંબર જોવા માટે પહેલાં ગ્રાહક એકાઉન્ટમાં Login કરો.');document.getElementById('customerAccount')?.scrollIntoView({behavior:'smooth'});return '';}
  try{const snap=await getDoc(doc(db,'listingContacts',String(listingId)));if(!snap.exists())throw new Error('આ લિસ્ટિંગનો સંપર્ક નંબર હજી ખાનગી રેકોર્ડમાં ખસેડાયો નથી. Adminને સંપર્ક કરો.');return String(snap.data().ownerPhone||'');}
  catch(e){console.error('private owner contact read failed',e);alert(e.code==='permission-denied'?'નંબર જોવા માટે ગ્રાહક Login જરૂરી છે.':(e.message||'સંપર્ક નંબર લોડ ન થયો.'));return '';}
}
function phoneDigits(phone){let d=String(phone||'').replace(/\D/g,'');if(d.length===11&&d.startsWith('0'))d=d.slice(1);if(d.length===12&&d.startsWith('91'))d=d.slice(2);return /^[6-9]\d{9}$/.test(d)?'91'+d:'';}
async function revealOwnerContact(p){const phone=await getPrivateOwnerPhone(p.id);if(!phone)return;const digits=phoneDigits(phone);if(!digits){alert('માલિકનો મોબાઇલ નંબર યોગ્ય ફોર્મેટમાં ઉપલબ્ધ નથી. Admin દ્વારા તપાસ કરાવો.');return;}const choice=confirm('માલિકનો નંબર: '+phone+'\nOK દબાવો તો ફોન કોલ થશે. Cancel દબાવો તો WhatsApp ખૂલશે.');if(choice){location.href='tel:+'+digits;}else{window.open('https://wa.me/'+digits+'?text='+encodeURIComponent('નમસ્તે, મારું ઘર પર તમારી પ્રોપર્ટી જોઈ. વધુ માહિતી આપશો?'),'_blank','noopener,noreferrer');}}
window.mgRevealOwnerContact=revealOwnerContact;
function openDetails(p){
  const imgs=(Array.isArray(p.photos)?p.photos:[]).filter(x=>x&&isHttps(x.url)).map(x=>cld(x.url,'f_auto,q_auto,w_1000'));
  const spec=[['પ્રકાર',p.type],['હેતુ',p.purpose],['BHK',p.bhk],['ક્ષેત્રફળ',p.areaSqft?p.areaSqft+' ચો.ફૂટ':''],['માળ',p.floor],['ફર્નિચર',p.furnishing],['પાર્કિંગ',p.parking],['ડિપોઝિટ',p.deposit]].filter(x=>x[1]);
  const m=sheet(`${imgs.length?`<div class="mgm-gal">${imgs.map(u=>`<img src="${esc(u)}" alt="" loading="lazy">`).join('')}</div>`:''}${badgesHtml(p)}<h3>${esc(p.title||p.type||'પ્રોપર્ટી')}</h3><div class="loc">📍 ${esc(p.city||'ગાંધીનગર')} · ${esc(p.location||'')}</div><div class="mgm-price">${esc(p.price||'કિંમત માટે સંપર્ક')}</div>${p.offerTitle?`<div class="mg-offer" style="cursor:default">🎉 ${esc(p.offerTitle)}${p.offerText?' — '+esc(p.offerText):''}${p.offerUntil?' (📅 '+esc(p.offerUntil)+' સુધી)':''}</div>`:''}<div class="mgm-spec">${spec.map(([k,v])=>`<div><b>${esc(k)}</b>${esc(v)}</div>`).join('')}</div><div style="margin:14px 0;border-radius:12px;overflow:hidden;border:1px solid #d8dce2"><iframe title="પ્રોપર્ટીનું Google Maps સ્થાન" loading="lazy" referrerpolicy="no-referrer-when-downgrade" width="100%" height="220" style="border:0;display:block" src="https://www.google.com/maps?q=${encodeURIComponent([p.location,p.city||'ગાંધીનગર','ગુજરાત'].filter(Boolean).join(', '))}&output=embed"></iframe></div>${p.description?`<p style="line-height:1.6;white-space:pre-line">${esc(p.description)}</p>`:''}<div class="mgm-act"><button type="button" data-s="contact">📞 માલિકનો સંપર્ક નંબર જુઓ</button><a class="alt" target="_blank" rel="noopener noreferrer" href="${esc(mapHref(p))}">🗺️ નકશો</a><button type="button" class="alt" data-s="enquiry">✉️ પૂછપરછ</button><button type="button" class="alt" data-s="share">↗ શેર કરો</button><button type="button" class="alt" data-s="poster">🖼️ પોસ્ટર</button><button type="button" class="alt" data-s="report">🚩 ફરિયાદ</button></div>`);
  m.addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;if(b.dataset.s==='share')shareListing(p);else if(b.dataset.s==='poster')openPoster(p);else if(b.dataset.s==='contact')revealOwnerContact(p);else if(b.dataset.s==='enquiry'){if(window.mgCreateEnquiry)window.mgCreateEnquiry(p);else alert('ગ્રાહક એકાઉન્ટ મોડ્યુલ લોડ થઈ રહ્યું છે. ફરી પ્રયાસ કરો.')}else reportListing(p);});
}
function wrapText(ctx,text,x,y,maxW,lh,maxLines){const words=String(text).split(/\s+/);let line='',lines=[];for(const w of words){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w}else line=t}if(line)lines.push(line);
  lines=lines.slice(0,maxLines);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lh));return y+lines.length*lh;}
function loadImg(url){return new Promise(res=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>res(i);i.onerror=()=>res(null);i.src=url;});}
async function drawPoster(p,withPhoto){
  const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const F="'Noto Sans Gujarati','Shruti','Nirmala UI','Segoe UI',Arial,sans-serif";
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#071f1b');g.addColorStop(1,'#12493c');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle='#e7bd63';x.lineWidth=8;x.strokeRect(24,24,W-48,H-48);x.lineWidth=2;x.strokeRect(40,40,W-80,H-80);
  x.textAlign='center';x.fillStyle='#ffdd00';x.font=`800 64px ${F}`;x.fillText('🏠 મારું ઘર',W/2,125);x.fillStyle='#b8cfc5';x.font=`600 26px ${F}`;x.fillText('TRUST • HOME • PROPERTY',W/2,168);
  // photo
  const url=(Array.isArray(p.photos)?p.photos:[]).find(a=>a&&isHttps(a.url));let img=null;if(withPhoto&&url)img=await loadImg(cld(url.url,'f_auto,q_auto,w_1100'));
  x.save();x.beginPath();x.roundRect?x.roundRect(70,200,940,470,28):x.rect(70,200,940,470);x.clip();
  if(img){const s=Math.max(940/img.width,470/img.height),w=img.width*s,h=img.height*s;x.drawImage(img,70+(940-w)/2,200+(470-h)/2,w,h)}else{x.fillStyle='#0e3a32';x.fillRect(70,200,940,470);x.font='200px serif';x.fillStyle='#e7bd63';x.fillText('🏠',W/2,480)}
  x.restore();x.strokeStyle='#e7bd63';x.lineWidth=4;x.beginPath();x.roundRect?x.roundRect(70,200,940,470,28):x.rect(70,200,940,470);x.stroke();
  // offer ribbon
  const title=p.offerTitle||'નવી પ્રોપર્ટી ઉપલબ્ધ';
  const rg=x.createLinearGradient(70,0,1010,0);rg.addColorStop(0,'#ffdd00');rg.addColorStop(1,'#d9a400');x.fillStyle=rg;x.beginPath();x.roundRect?x.roundRect(70,700,940,120,24):x.rect(70,700,940,120);x.fill();
  x.fillStyle='#1b2a1d';x.font=`900 ${title.length>16?54:68}px ${F}`;x.fillText('🎉 '+title,W/2,780);
  let y=868;x.fillStyle='#ffffff';x.font=`700 44px ${F}`;
  if(p.offerText)y=wrapText(x,p.offerText,W/2,y,900,58,2);
  if(p.offerUntil){x.fillStyle='#ffd3df';x.font=`700 36px ${F}`;x.fillText('📅 '+p.offerUntil+' સુધી',W/2,y+10);y+=56}
  y=Math.max(y+30,990);
  x.fillStyle='#f3d37b';x.font=`800 46px ${F}`;x.fillText([p.type,p.bhk,p.purpose].filter(Boolean).join(' · '),W/2,y);
  x.fillStyle='#e9f3ee';x.font=`600 38px ${F}`;x.fillText('📍 '+[p.city,p.location].filter(Boolean).join(', '),W/2,y+60);
  x.fillStyle='#ffdd00';x.font=`900 64px ${F}`;x.fillText(p.price||'કિંમત માટે સંપર્ક',W/2,y+142);
  if(siteUrl()){x.fillStyle='#b8cfc5';x.font=`500 28px ${F}`;x.fillText(siteUrl().replace(/^https:\/\//,''),W/2,H-70)}
  return c;}
async function openPoster(p){
  const m=sheet('<h3>🖼️ ડિજિટલ પોસ્ટર</h3><p class="loc">પોસ્ટર તૈયાર થઈ રહ્યું છે…</p>');
  let c;try{c=await drawPoster(p,true);c.toDataURL('image/jpeg',0.9)}catch(_){c=await drawPoster(p,false)}
  const url=c.toDataURL('image/jpeg',0.92);
  m.querySelector('.mgm-box').innerHTML=`<button type="button" class="mgm-x" aria-label="બંધ કરો">✕</button><h3>🖼️ ડિજિટલ પોસ્ટર</h3><img class="mgm-poster" src="${url}" alt="પોસ્ટર"><div class="mgm-act"><button type="button" data-s="sharepic">↗ પોસ્ટર શેર કરો</button><a class="alt" href="${url}" download="maru-ghar-poster.jpg">⬇ સેવ કરો</a></div><p class="loc">સેવ ન થાય તો પોસ્ટર પર લાંબો સમય દબાવી "ઇમેજ સેવ" કરો.</p>`;
  m.querySelector('[data-s="sharepic"]').addEventListener('click',async()=>{try{const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',0.92));const f=new File([blob],'maru-ghar-poster.jpg',{type:'image/jpeg'});
    if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:shareText(p)});return}}catch(e){if(e&&e.name==='AbortError')return}
    shareListing(p);});
}
// one click handler for all card buttons
grid&&grid.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el)return;const card=el.closest('.property');const p=card&&itemsById.get(card.dataset.id);if(!p)return;
  const a=el.dataset.act;
  if(a==='details')openDetails(p);else if(a==='poster')openPoster(p);else if(a==='share')shareListing(p);else if(a==='report')reportListing(p);
  else if(a==='contact')revealOwnerContact(p);
  else if(a==='fav'){const on=toggleFav(p.id);el.classList.toggle('on',on);el.textContent=on?'❤️':'🤍';if(typeof window.filterProps==='function'&&window.__favOnly)window.filterProps();}});

async function init() {
  if (!isFirebaseConfigured()) {
    if(count) count.textContent='ડેમો લિસ્ટિંગ';
    setStatus('',true);
    return;
  }
  try {
    const app=initializeApp(firebaseConfig); db=getFirestore(app); auth=getAuth(app); liveMode=true;
    // Admin shortcut buttons exist in the page but stay hidden for everyone except the signed-in admin.
    onAuthStateChanged(auth,u=>{const ok=!!u&&!u.isAnonymous&&u.uid===ADMIN_UID;['adminNavLink','adminQuick'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.toggle('hidden',!ok)})});
    await loadCities();
    await loadSettings();
    const cityEl=document.getElementById('cityFilter');
    if(cityEl) cityEl.addEventListener('change',async()=>{currentCity=cityEl.value||'all';while(loadingMore) await new Promise(r=>setTimeout(r,100));loadApproved(true);});
    await loadApproved(true);
    setStatus('',false);
  } catch (e) {
    console.error('Maru Ghar Firebase init/read failed:',e);
    setStatus('લિસ્ટિંગ લોડ ન થઈ. ઇન્ટરનેટ તપાસી ફરી પ્રયાસ કરો.',true);
  }
}

if(form) form.addEventListener('submit', async ev=>{
  ev.preventDefault();
  if(!isFirebaseConfigured() || !db || !auth) { setStatus('લિસ્ટિંગ હમણાં મોકલી શકાતી નથી. થોડી વાર પછી ફરી પ્રયાસ કરો.',true); return; }
  const files=[...(document.getElementById('propertyPhotos')?.files||[])];
  submitBtn.disabled=true; submitBtn.textContent='માહિતી અને ફોટા મોકલાઈ રહ્યા છે…'; setStatus('કૃપા કરીને રાહ જુઓ…');
  try {
    // Anonymous sign-in lets the Firestore rule require an authenticated request without exposing private keys.
    if(!auth.currentUser) await signInAnonymously(auth);
    const uploaded=[];
    for(let i=0;i<files.length;i++){setStatus(`ફોટો ${i+1}/${files.length} અપલોડ થઈ રહ્યો છે…`);uploaded.push(await uploadPhoto(files[i]));}
    const vfiles=[...(document.getElementById('propertyVideos')?.files||[])];
    const uploadedVideos=[];
    for(let i=0;i<vfiles.length;i++){
      setStatus(`વિડિયો ${i+1}/${vfiles.length} અપલોડ થઈ રહ્યો છે…`);
      const v=await uploadVideo(vfiles[i],pct=>{ if(pct>=0) setStatus(`વિડિયો ${i+1}/${vfiles.length} અપલોડ: ${pct}%`); else setStatus(`નેટવર્ક સમસ્યા. ફરી પ્રયાસ ${-pct+1}/3…`,true); });
      uploadedVideos.push({url:v.url,publicId:v.publicId,format:v.format,bytes:v.bytes});
    }
    const fd=new FormData(form); const payload={
      ownerName:String(fd.get('ownerName')||'').trim(),
      type:String(fd.get('type')||''), purpose:String(fd.get('purpose')||''), location:String(fd.get('location')||'').trim(),
      city:String(fd.get('city')||'ગાંધીનગર').trim(), price:String(fd.get('price')||'').trim(), description:String(fd.get('description')||'').trim(), ownerConsent:fd.get('ownerConsent')==='on', photos:uploaded, videos:uploadedVideos,
      status:'pending', createdAt:serverTimestamp(), submitterUid:auth.currentUser.uid
    };
    ['bhk','areaSqft','floor','furnishing','parking','deposit','offerTitle','offerText','offerUntil'].forEach(k=>{const v=String(fd.get(k)||'').trim();if(v)payload[k]=v;});
    { const pn=Number(String(fd.get('priceNum')||'').replace(/,/g,'')); if(isFinite(pn)&&pn>0) payload.priceNum=Math.round(pn); }
    { const ml=String(fd.get('mapLink')||'').trim(); if(ml){ if(!/^https:\/\//i.test(ml)) throw new Error('નકશાની લિંક https:// થી શરૂ થવી જોઈએ.'); payload.mapLink=ml; } }
    if(payload.ownerName.length<2 || payload.location.length<2) throw new Error('નામ અને વિસ્તાર યોગ્ય રીતે ભરો.');
    const listingRef=doc(collection(db,'listings'));
    await setDoc(listingRef,payload);
    await setDoc(doc(db,'listingContacts',listingRef.id),{ownerName:payload.ownerName,ownerPhone:String(fd.get('ownerPhone')||'').trim(),ownerUid:auth.currentUser.uid,listingId:listingRef.id,createdAt:serverTimestamp()});
    form.reset(); setStatus('લિસ્ટિંગ સફળતાપૂર્વક મોકલાઈ. એડમિન મંજૂરી મળે પછી જ વેબસાઇટ અને APKમાં જાહેર થશે.');
  } catch(e) {
    console.error('Maru Ghar listing submission failed:',e);
    setStatus('લિસ્ટિંગ મોકલી શકાઈ નથી. ઇન્ટરનેટ તપાસી ફરી પ્રયાસ કરો.',true);
  } finally {submitBtn.disabled=false;submitBtn.textContent='પ્રોપર્ટી મંજૂરી માટે મોકલો';}
});

function mgShowUploadPreview(input,previewId,kind){
  const box=document.getElementById(previewId); if(!box)return;
  (box._mgUrls||[]).forEach(u=>URL.revokeObjectURL(u)); box._mgUrls=[]; box.replaceChildren();
  const files=[...(input?.files||[])];
  files.forEach(file=>{
    const url=URL.createObjectURL(file); box._mgUrls.push(url);
    const figure=document.createElement('figure');
    const media=document.createElement(kind==='video'?'video':'img');
    if(kind==='video'){media.src=url;media.controls=true;media.preload='metadata';media.playsInline=true;}
    else {media.src=url;media.alt=file.name;}
    const caption=document.createElement('figcaption'); caption.textContent=file.name;
    figure.append(media,caption); box.appendChild(figure);
  });
}
const videoInput=document.getElementById('propertyVideos');
if(videoInput){videoInput.addEventListener('change',()=>{const st=document.getElementById('videoSelectionStatus');const fs=[...(videoInput.files||[])];const bad=fs.find(f=>!VIDEO_TYPES.includes(f.type)||f.size>VIDEO_MAX);if(st)st.textContent=bad?'ભૂલ: વિડિયો MP4/WEBM/MOV અને 25 MB સુધી જ હોવો જોઈએ.':(fs.length?`${fs.length} વિડિયો પસંદ કર્યા.`:'વૈકલ્પિક: MP4/WEBM/MOV, દરેક વિડિયો 25 MB સુધી.');if(bad)videoInput.value='';mgShowUploadPreview(videoInput,'propertyVideoPreview','video');});}
const photoInput=document.getElementById('propertyPhotos');
if(photoInput){photoInput.addEventListener('change',()=>{const status=document.getElementById('photoSelectionStatus');const files=[...(photoInput.files||[])];const bad=files.find(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>8*1024*1024);if(bad){if(status)status.textContent='ભૂલ: JPG/PNG/WEBP ફોટો અને દરેક 8 MB સુધી હોવો જોઈએ.';photoInput.value='';}else if(status)status.textContent=files.length?`${files.length} ફોટા પસંદ કર્યા. દરેક ફોટો 8 MB સુધી; ફોટાની સંખ્યા પર કોઈ નક્કી મર્યાદા નથી.`:'એક સાથે અનેક ફોટા પસંદ કરી શકો છો. ફોટાની સંખ્યા પર કોઈ નક્કી મર્યાદા નથી.';mgShowUploadPreview(photoInput,'propertyPhotoPreview','image');});}

init();

const moreButton=document.getElementById('loadMoreListings'); if(moreButton) moreButton.addEventListener('click',()=>loadApproved(false));
