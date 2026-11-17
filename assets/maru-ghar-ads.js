/* Optional Google AdSense placements. No ads load until real publisher + slot IDs are configured. */
import { adsConfig } from '../firebase-config.js';
(() => {
  'use strict';
  const client=String(adsConfig?.adsenseClient||'').trim();
  if(!/^ca-pub-\d{16}$/.test(client))return;
  const slots=[...document.querySelectorAll('[data-mg-ad-slot]')];
  const configured=slots.map(el=>({el,id:String(adsConfig?.slots?.[el.dataset.mgAdSlot]||'').trim()})).filter(x=>/^\d{10}$/.test(x.id));
  if(!configured.length)return;
  let script=document.querySelector('script[data-mg-adsense]');
  if(!script){
    script=document.createElement('script');
    script.async=true;script.crossOrigin='anonymous';script.dataset.mgAdsense='1';
    script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(client);
    document.head.appendChild(script);
  }
  const render=()=>{
    configured.forEach(({el,id})=>{
      if(el.dataset.mgRendered==='1')return;
      el.replaceChildren();
      const ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';
      ins.setAttribute('data-ad-client',client);ins.setAttribute('data-ad-slot',id);
      ins.setAttribute('data-ad-format','auto');ins.setAttribute('data-full-width-responsive','true');
      el.appendChild(ins);el.hidden=false;el.dataset.mgRendered='1';
      try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){el.hidden=true;delete el.dataset.mgRendered;console.warn('Maru Ghar AdSense slot unavailable',e);}
    });
  };
  if(script.dataset.mgLoaded==='1')render();
  else{script.addEventListener('load',()=>{script.dataset.mgLoaded='1';render()},{once:true});script.addEventListener('error',()=>console.warn('Maru Ghar AdSense script could not load'),{once:true});}
})();
