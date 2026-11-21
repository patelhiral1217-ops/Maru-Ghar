/* Admin-only management for the built-in demo property samples.
   Soft delete is stored in settings/demoShowcase so the public website and WebView stay in sync. */
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const ADMIN_UID='yJYiuaUE3KXVLVuWqLyLRH5owQJ3';
const DEMOS=[
 ['sample-gandhinagar-3bhk','આધુનિક 3 BHK પરિવારનું ઘર'],
 ['sample-ahmedabad-villa','પ્રીમિયમ 4 BHK વિલા'],
 ['sample-kalol-2bhk','સુંદર 2 BHK ફ્લેટ'],
 ['sample-gandhinagar-plot','રહેણાંક પ્લોટ — સારો લોકેશન'],
 ['sample-ahmedabad-shop','મેઇન રોડ પર કોમર્શિયલ દુકાન'],
 ['sample-gandhinagar-2bhk-sale','2 BHK તૈયાર ફ્લેટ'],
 ['sample-sargasan-house-rent','3 BHK વિશાળ પરિવારનું મકાન'],
 ['sample-ahmedabad-office','આધુનિક કોમર્શિયલ ઓફિસ'],
 ['sample-kalol-commercial-plot','કોમર્શિયલ પ્લોટ'],
 ['sample-vavol-shop-sale','રોડ ટચ દુકાન']
];
const app=getApps().length?getApp():initializeApp(firebaseConfig);
const auth=getAuth(app), db=getFirestore(app), ref=doc(db,'settings','demoShowcase');
let hiddenIds=[];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mount(){
 const dashboard=document.getElementById('dashboard');
 if(!dashboard||document.getElementById('mgDemoAdmin'))return;
 const section=document.createElement('section');
 section.id='mgDemoAdmin';section.className='panel';
 section.innerHTML='<h2>ડેમો પ્રોપર્ટી મેનેજમેન્ટ</h2><p class="muted">અહીંથી માત્ર નમૂનાની ડેમો પ્રોપર્ટી વેબસાઇટ અને એપમાંથી છુપાવી અથવા ફરી ચાલુ કરી શકશો. ગ્રાહકોની અસલી પ્રોપર્ટી પર તેની કોઈ અસર નહીં થાય.</p><div id="mgDemoAdminList"></div><div id="mgDemoAdminStatus" class="status" role="status"></div>';
 const nav=dashboard.querySelector('.admin-shortcuts');
 if(nav)nav.after(section);else dashboard.prepend(section);
 const style=document.createElement('style');
 style.textContent='#mgDemoAdmin .mg-demo-admin-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;margin:9px 0;border:1px solid #d8b86a55;border-radius:12px;background:#0e1c24}#mgDemoAdmin .mg-demo-admin-row span{font-weight:800;line-height:1.5}#mgDemoAdmin .mg-demo-admin-row button{min-width:112px}#mgDemoAdmin .mg-demo-admin-row button.restore{background:linear-gradient(145deg,#dce9df,#a9c6b2)!important;color:#173b30!important;border-color:#8cab96!important}@media(max-width:520px){#mgDemoAdmin .mg-demo-admin-row{align-items:flex-start;flex-direction:column}#mgDemoAdmin .mg-demo-admin-row button{width:100%}}';
 document.head.append(style);
}
function draw(){
 mount();const list=document.getElementById('mgDemoAdminList');if(!list)return;
 list.innerHTML=DEMOS.map(([id,title])=>{const hidden=hiddenIds.includes(id);return '<div class="mg-demo-admin-row"><span>'+esc(title)+'</span><button type="button" data-demo-id="'+id+'" class="'+(hidden?'restore':'')+'">'+(hidden?'ફરી બતાવો':'ડિલીટ કરો')+'</button></div>'}).join('');
 list.querySelectorAll('button[data-demo-id]').forEach(button=>button.addEventListener('click',async()=>{
  const id=button.dataset.demoId, isHidden=hiddenIds.includes(id);
  if(!isHidden&&!confirm('આ ડેમો પ્રોપર્ટી વેબસાઇટ અને એપમાંથી દૂર કરવી છે?'))return;
  button.disabled=true;const status=document.getElementById('mgDemoAdminStatus');status.textContent='સેવ થઈ રહ્યું છે…';
  try{
   hiddenIds=isHidden?hiddenIds.filter(x=>x!==id):[...hiddenIds,id];
   await setDoc(ref,{hiddenIds,updatedAt:new Date().toISOString()},{merge:true});
   status.textContent=isHidden?'ડેમો પ્રોપર્ટી ફરીથી બતાવાશે.':'ડેમો પ્રોપર્ટી વેબસાઇટ અને એપમાંથી દૂર થઈ ગઈ છે.';
   draw();
  }catch(e){hiddenIds=isHidden?[...hiddenIds,id]:hiddenIds.filter(x=>x!==id);status.textContent='સેવ ન થયું. ઇન્ટરનેટ અને Firebase Rules તપાસો.';console.error(e);button.disabled=false;}
 }));
}
onAuthStateChanged(auth,async user=>{
 if(!user||user.uid!==ADMIN_UID)return;
 mount();const status=document.getElementById('mgDemoAdminStatus');
 try{const snap=await getDoc(ref);hiddenIds=snap.exists()&&Array.isArray(snap.data().hiddenIds)?snap.data().hiddenIds.filter(x=>DEMOS.some(d=>d[0]===x)):[];draw();}
 catch(e){if(status)status.textContent='ડેમો સેટિંગ્સ લોડ ન થઈ. ઇન્ટરનેટ તપાસો.';console.error(e)}
});
