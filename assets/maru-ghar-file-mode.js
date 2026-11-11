/* Helpful fallbacks when HTML is opened directly from a file manager.
   Android document providers may expose files as content:// rather than file://.
   Firebase ES modules require a supported secure web origin (HTTPS or the packaged app runtime). */
(()=>{
  const protocol=String(location.protocol||'').toLowerCase();
  const href=String(location.href||'').toLowerCase();
  const isDirectFile=protocol==='file:'||protocol==='content:'||href.startsWith('content:');
  if(!isDirectFile)return;
  const t=s=>window.mgI18nText?window.mgI18nText(s):s;
  const msg='આ ફાઇલ સીધી File Managerમાંથી ખોલેલી છે. આ રીતે Firebase Login, એકાઉન્ટ, લાઇવ ડેટા, ફોટો/વિડિયો અપલોડ અને Sync કામ કરતા નથી. કૃપા કરીને HTTPS વેબસાઇટ અથવા પછી તૈયાર કરેલી ઇન્સ્ટોલ કરેલી APK ખોલો.';
  const admin=document.getElementById('loginForm')||document.getElementById('refresh');
  if(admin){
    document.documentElement.style.visibility='visible';
    const banner=document.createElement('div');banner.setAttribute('role','alert');
    banner.style.cssText='margin:12px auto;padding:12px 16px;max-width:1100px;border:1px solid #d6b45b;border-radius:10px;background:#fff4cf;color:#49370a;font:600 13px/1.6 Arial,sans-serif';
    banner.textContent=t(msg);document.body.prepend(banner);
    const login=document.getElementById('loginForm');
    if(login)login.addEventListener('submit',e=>{e.preventDefault();const s=document.getElementById('loginStatus');if(s)s.textContent=t(msg);});
    document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b.id!=='mgAdminLanguage'&&!b.closest('#loginForm'))alert(t(msg));},true);
    return;
  }
  const customerButtons=['customerRegister','customerLogin','customerLogout','customerExport','customerDelete'];
  for(const id of customerButtons){const b=document.getElementById(id);if(b)b.addEventListener('click',()=>{const s=document.getElementById('customerStatus');if(s)s.textContent=t(msg);else alert(t(msg));});}
  const form=document.getElementById('propertyForm');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();const s=document.getElementById('formStatus');if(s)s.textContent=t(msg);});
  for(const id of ['propertyPhotos','propertyVideos']){const input=document.getElementById(id);if(input)input.addEventListener('change',()=>{const s=document.getElementById(id==='propertyPhotos'?'photoSelectionStatus':'videoSelectionStatus');if(s)s.textContent=t(msg);});}
})();
