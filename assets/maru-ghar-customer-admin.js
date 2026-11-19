import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js';
(()=>{
 const ADMIN_UID='yJYiuaUE3KXVLVuWqLyLRH5owQJ3', $=id=>document.getElementById(id), root=$('mgCustomerAdmin'); if(!root)return;
 const app=getApps().length?getApp():initializeApp(firebaseConfig),auth=getAuth(app),functions=getFunctions(app);
 const listCall=httpsCallable(functions,'adminListCustomers'),blockCall=httpsCallable(functions,'adminSetCustomerDisabled');
 let users=[],pageToken=null,busy=false,authorized=false;
 const status=$('mgCustomerStatus'),list=$('mgCustomerList'),say=s=>status.textContent=s;
 const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 function render(){list.replaceChildren();const q=String($('mgCustomerSearch').value||'').trim().toLowerCase();const rows=users.filter(u=>[u.displayName,u.email,u.phoneNumber,u.uid].join(' ').toLowerCase().includes(q));
 if(!rows.length){list.textContent=users.length?'શોધ પ્રમાણે કોઈ ગ્રાહક મળ્યો નથી.':'હાલ કોઈ ગ્રાહક એકાઉન્ટ મળ્યું નથી.';return;}
 rows.forEach(u=>{const card=el('article','mg-customer-card'),head=el('div','mg-customer-head'),title=el('strong','',u.displayName||u.phoneNumber||u.email||'ગ્રાહક'),badge=el('span',u.disabled?'mg-customer-badge blocked':'mg-customer-badge',u.disabled?'BLOCKED':'ACTIVE');
 head.append(title,badge);card.append(head);const info=el('div','mg-customer-meta');
 info.append(el('div','','ઈમેલ: '+(u.email||'ઉપલબ્ધ નથી')));info.append(el('div','','મોબાઇલ: '+(u.phoneNumber||'Firebaseમાં નોંધાયેલ નથી')));info.append(el('div','','UID: '+u.uid));
 info.append(el('div','','લોગિન રીત: '+((u.providers||[]).join(', ')||'અજ્ઞાત')));info.append(el('div','','છેલ્લું લોગિન: '+(u.lastSignInAt||'હજુ લોગિન નથી')));card.append(info);
 const actions=el('div','mg-customer-actions'),b=el('button','primary',u.disabled?'Unblock કરો':'Block કરો');b.type='button';
 b.addEventListener('click',async()=>{if(busy)return;let reason='';if(!u.disabled){reason=(prompt('આ એકાઉન્ટ શા માટે બ્લોક કરવું છે? કારણ લખો:')||'').trim();if(reason.length<3){say('બ્લોક કરવા માટે ઓછામાં ઓછા 3 અક્ષરનું કારણ જરૂરી છે.');return;}}else if(!confirm('આ ગ્રાહકને ફરી લોગિન કરવાની મંજૂરી આપવી છે?'))return;
 if(!u.disabled&&!confirm('ખાતરી કરો: આ એકાઉન્ટ બ્લોક થશે અને લોગિન કરી શકશે નહીં.'))return;b.disabled=true;say('એકાઉન્ટ સ્થિતિ બદલાઈ રહી છે…');
 try{await blockCall({uid:u.uid,disabled:!u.disabled,reason});u.disabled=!u.disabled;render();say('એકાઉન્ટ સ્થિતિ સફળતાપૂર્વક બદલાઈ. ફેરફારનો રેકોર્ડ સાચવાયો.');}catch(e){say('ફેરફાર નિષ્ફળ: '+(e.message||e.code||'સર્વર તપાસો.'));b.disabled=false;}});
 actions.append(b);card.append(actions);list.append(card);});}
 async function load(more=false){if(busy||!authorized)return;busy=true;$('mgLoadCustomers').disabled=true;$('mgLoadMoreCustomers').disabled=true;say('ગ્રાહકો લોડ થઈ રહ્યા છે…');
 try{const result=await listCall({pageToken:more?pageToken:null}),payload=result.data||{};users=more?users.concat(payload.users||[]):(payload.users||[]);pageToken=payload.nextPageToken||null;$('mgLoadMoreCustomers').hidden=!pageToken;render();say(users.length+' ગ્રાહક એકાઉન્ટ લોડ થયા.');}
 catch(e){say('ગ્રાહકો લોડ ન થયા: '+(e.message||e.code||'Cloud Function તપાસો.'));}finally{busy=false;$('mgLoadCustomers').disabled=false;$('mgLoadMoreCustomers').disabled=false;}}
 $('mgLoadCustomers').addEventListener('click',()=>load(false));$('mgLoadMoreCustomers').addEventListener('click',()=>load(true));$('mgCustomerSearch').addEventListener('input',render);
 onAuthStateChanged(auth,user=>{authorized=!!user&&user.uid===ADMIN_UID;if(!authorized)list.textContent='Admin login જરૂરી છે.';});
})();