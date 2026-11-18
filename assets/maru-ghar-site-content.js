import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
(()=>{
const slots=[...document.querySelectorAll('[data-mg-content-slot]')];if(!slots.length||location.protocol==='file:')return;
const app=getApps().length?getApp():initializeApp(firebaseConfig),db=getFirestore(app),lang=()=>{try{return localStorage.getItem('mg_language')||'gu'}catch(_){return 'gu'}};
const text=(x,k)=>{const l=lang();return (l==='en'&&x[k+'En'])||(l==='hi'&&x[k+'Hi'])||x[k]||'';};
function block(x){const el=document.createElement('section');el.className='mg-cms-public-card '+(['gold','emerald','light'].includes(x.style)?x.style:'gold');el.dataset.userContent='';const title=text(x,'title'),body=text(x,'body'),button=text(x,'button');if(title){const h=document.createElement('h2');h.textContent=title;el.append(h);}if(body){const p=document.createElement('p');p.textContent=body;el.append(p);}if(x.mediaUrl&&/^https:\/\//i.test(x.mediaUrl)){const m=x.mediaType==='video'?document.createElement('video'):document.createElement('img');m.src=x.mediaUrl;if(x.mediaType==='video'){m.controls=true;m.playsInline=true;m.preload='metadata';}else{m.alt=title||'Maru Ghar';m.loading='lazy';}el.append(m);}if(button&&/^https:\/\//i.test(x.buttonUrl||'')){const a=document.createElement('a');a.href=x.buttonUrl;a.target='_blank';a.rel='noopener noreferrer';a.textContent=button;el.append(a);}return el;}
function render(items){const map=new Map(slots.map(s=>[s.dataset.mgContentSlot,s]));slots.forEach(s=>s.replaceChildren());items.filter(x=>x.visible===true&&!x.deletedAt).sort((a,b)=>(a.order??0)-(b.order??0)).forEach(x=>map.get(x.placement)?.append(block(x)));}
async function load(){try{const snap=await getDocs(query(collection(db,'siteContent'),orderBy('order')));render(snap.docs.map(d=>d.data()));}catch(e){console.warn('Admin-managed content unavailable',e);}}
window.addEventListener('mg-language-changed',load);load();
})();