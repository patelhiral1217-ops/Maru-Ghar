import { firebaseConfig } from '../firebase-config.js';
import { initializeApp,getApps,getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore,collection,getDocs,query,orderBy,limit } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
(()=>{const ADMIN_UID='yJYiuaUE3KXVLVuWqLyLRH5owQJ3',root=document.getElementById('mgActivityLog');if(!root)return;
const app=getApps().length?getApp():initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),$=id=>document.getElementById(id);let ok=false;
const status=$('mgActivityStatus'),list=$('mgActivityList'),say=s=>status.textContent=s;
$('mgLoadActivity').addEventListener('click',async()=>{if(!ok){say('Admin login જરૂરી છે.');return;}const b=$('mgLoadActivity');b.disabled=true;say('ઇતિહાસ લોડ થઈ રહ્યો છે…');list.replaceChildren();
try{const snap=await getDocs(query(collection(db,'adminLogs'),orderBy('createdAt','desc'),limit(100)));if(snap.empty){list.textContent='હજુ કોઈ Activity History નથી.';say('0 રેકોર્ડ');return;}
snap.docs.forEach(d=>{const x=d.data(),card=document.createElement('article');card.className='mg-activity-item';const title=document.createElement('strong');title.textContent=String(x.action||x.kind||'Admin activity');const meta=document.createElement('div');meta.textContent=[x.target||x.uid||'',x.details||x.reason||'',x.email||x.phoneNumber||'',x.at||''].filter(Boolean).join(' · ');card.append(title,meta);list.append(card);});say(snap.size+' તાજેતરના રેકોર્ડ બતાવ્યા.');
}catch(e){say('ઇતિહાસ લોડ ન થયો: '+(e.message||e.code||'Rules તપાસો.'));}finally{b.disabled=false;}});
onAuthStateChanged(auth,u=>{ok=!!u&&u.uid===ADMIN_UID;});})();