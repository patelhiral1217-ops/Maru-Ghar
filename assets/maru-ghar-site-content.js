import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
(()=>{
function addExtraSlots(){
 const isDownload=location.pathname.endsWith('download.html'),isPrivacy=location.pathname.endsWith('privacy.html');
 const defs=isDownload?[
  ['download_card_after','.card','afterend'],['download_story_after','#mgAppStory','afterend'],['download_qr_before','.noprint','beforebegin']
 ]:isPrivacy?[
  ['privacy_top','main > .card','beforebegin'],['privacy_mid','main > .card h2:nth-of-type(3)','afterend'],['privacy_bottom','main > .card','afterend']
 ]:[
  ['home_header_after','header','afterend'],['home_showcase_after','.mg-showcase','afterend'],['home_listings_after','#listings','afterend'],['home_submit_after','#submit','afterend'],['home_account_after','#customerAccount','afterend'],['home_contact_before','#contact','beforebegin'],['home_footer_after','#contact','afterend']
 ];
 defs.forEach(([id,selector,where])=>{if(document.querySelector('[data-mg-content-slot="'+id+'"]'))return;const target=document.querySelector(selector);if(!target)return;const slot=document.createElement('div');slot.className='mg-cms-slot';slot.dataset.mgContentSlot=id;target.insertAdjacentElement(where,slot);});
 }
 const style=document.createElement('style');style.textContent='.mg-cms-slot{min-height:46px;margin:10px 0;border:1px dashed #c99b35;border-radius:10px;background:rgba(201,155,53,.08)}.mg-cms-public-card{margin:12px 0;padding:16px;border:1px solid #c99b35;border-radius:14px;background:#fff;color:#26313d}.mg-cms-public-card img,.mg-cms-public-card video{display:block;max-width:100%;max-height:420px;margin:10px auto;border-radius:10px}.mg-cms-public-card a{display:inline-block;margin-top:8px;padding:8px 14px;border-radius:9px;background:#9b742b;color:#fff;text-decoration:none}';document.head.append(style);
 addExtraSlots();const slots=[...document.querySelectorAll('[data-mg-content-slot]')];if(!slots.length||location.protocol==='file:')return;
const app=getApps().length?getApp():initializeApp(firebaseConfig),db=getFirestore(app),lang=()=>{try{return localStorage.getItem('mg_language')||'gu'}catch(_){return 'gu'}};
const text=(x,k)=>{const l=lang();return (l==='en'&&x[k+'En'])||(l==='hi'&&x[k+'Hi'])||x[k]||'';};
function block(x){const el=document.createElement('section');el.className='mg-cms-public-card '+(['gold','emerald','light'].includes(x.style)?x.style:'gold');el.dataset.userContent='';const title=text(x,'title'),body=text(x,'body'),button=text(x,'button');if(title){const h=document.createElement('h2');h.textContent=title;el.append(h);}if(body){const p=document.createElement('p');p.textContent=body;el.append(p);}if(x.mediaUrl&&/^https:\/\//i.test(x.mediaUrl)){const m=x.mediaType==='video'?document.createElement('video'):document.createElement('img');m.src=x.mediaUrl;if(x.mediaType==='video'){m.controls=true;m.playsInline=true;m.preload='metadata';}else{m.alt=title||'Maru Ghar';m.loading='lazy';}el.append(m);}if(button&&/^https:\/\//i.test(x.buttonUrl||'')){const a=document.createElement('a');a.href=x.buttonUrl;a.target='_blank';a.rel='noopener noreferrer';a.textContent=button;el.append(a);}return el;}
function render(items){const map=new Map(slots.map(s=>[s.dataset.mgContentSlot,s]));slots.forEach(s=>{s.replaceChildren();s.hidden=true;});items.filter(x=>x.visible===true&&!x.deletedAt).sort((a,b)=>(a.order??0)-(b.order??0)).forEach(x=>{const target=map.get(x.placement);if(target){target.append(block(x));target.hidden=false;}});}
async function load(){try{const snap=await getDocs(query(collection(db,'siteContent'),orderBy('order')));render(snap.docs.map(d=>d.data()));}catch(e){console.warn('Admin-managed content unavailable',e);}}
window.addEventListener('mg-language-changed',load);load();
})();