/* One-button hierarchy: City -> Area -> Property type -> matching approved listings. */
(()=>{
 const $=id=>document.getElementById(id);
 const lang=()=>{try{return localStorage.getItem('mg_language')||'gu'}catch(_){return 'gu'}};
 const dict={
 gu:{city:'શહેર',chooseCity:'શહેર પસંદ કરો',area:'વિસ્તાર પસંદ કરો',type:'મિલકતનો પ્રકાર પસંદ કરો',allCities:'શહેર',allAreas:'બધા વિસ્તાર',allProps:'બધી પ્રોપર્ટી',rent:'ભાડે',sale:'વેચાણ',allPurposes:'ભાડે અને વેચાણ',house:'મકાન',flat:'ફ્લેટ',shop:'દુકાન',res:'રહેણાંક પ્લોટ',com:'કોમર્શિયલ પ્લોટ',office:'ઓફિસ',warehouse:'ગોડાઉન',pg:'PG',back:'પાછળ',close:'બંધ કરો',emptyArea:'આ વિસ્તારમાં હજી કોઈ મંજૂર મિલકત ઉમેરાઈ નથી.',emptyType:'આ પ્રકારની મિલકત હજી ઉમેરાઈ નથી.',loading:'મિલકતો લોડ થઈ રહી છે…'},
 hi:{city:'शहर',chooseCity:'शहर चुनें',area:'इलाका चुनें',type:'प्रॉपर्टी का प्रकार चुनें',allCities:'शहर',allAreas:'सभी इलाके',allProps:'सभी प्रॉपर्टी',rent:'किराया',sale:'बिक्री',allPurposes:'किराया और बिक्री',house:'मकान',flat:'फ्लैट',shop:'दुकान',res:'आवासीय प्लॉट',com:'कमर्शियल प्लॉट',office:'ऑफिस',warehouse:'गोदाम',pg:'PG',back:'वापस',close:'बंद करें',emptyArea:'इस इलाके में अभी कोई मंजूर प्रॉपर्टी नहीं जोड़ी गई है।',emptyType:'इस प्रकार की प्रॉपर्टी अभी नहीं जोड़ी गई है।',loading:'प्रॉपर्टी लोड हो रही है…'},
 en:{city:'City',chooseCity:'Choose City',area:'Choose Area',type:'Choose Property Type',allCities:'City',allAreas:'All Areas',allProps:'All Properties',rent:'Rent',sale:'Sale',allPurposes:'Rent and Sale',house:'House',flat:'Flat',shop:'Shop',res:'Residential Plot',com:'Commercial Plot',office:'Office',warehouse:'Warehouse',pg:'PG',back:'Back',close:'Close',emptyArea:'No approved properties have been added in this area yet.',emptyType:'No properties of this type have been added yet.',loading:'Loading properties…'}
 };
 const t=k=>(dict[lang()]||dict.gu)[k]||dict.gu[k]||k;
 function init(){
  const city=$('cityFilter'),area=$('areaFilter'),purpose=$('purpose'),type=$('type'),row=city?.parentElement;
  if(!city||!area||!purpose||!type||!row||$('mgCityBrowser'))return;
  city.hidden=true;area.hidden=true;
  const trigger=document.createElement('button');trigger.type='button';trigger.id='mgCityBrowserOpen';trigger.className='mg-city-browser-open';trigger.textContent=t('city');row.insertBefore(trigger,city);
  const modal=document.createElement('div');modal.id='mgCityBrowser';modal.className='mg-city-browser';modal.hidden=true;
  modal.innerHTML='<div class="mg-city-browser-backdrop" data-close="1"></div><section class="mg-city-browser-dialog" role="dialog" aria-modal="true" aria-labelledby="mgCityBrowserTitle"><header class="mg-city-browser-head"><div><small>MARU GHAR</small><h2 id="mgCityBrowserTitle"></h2></div><button type="button" class="mg-city-browser-close" data-close="1" aria-label="Close">×</button></header><div class="mg-city-browser-progress"><span data-step="1"></span><span data-step="2"></span><span data-step="3"></span></div><div class="mg-city-browser-content" id="mgCityBrowserContent"></div><footer class="mg-city-browser-foot"><button type="button" id="mgCityBrowserBack"></button><button type="button" id="mgCityBrowserCloseFoot"></button></footer></section>';
  document.body.appendChild(modal);
  const content=$('mgCityBrowserContent'),title=$('mgCityBrowserTitle'),back=$('mgCityBrowserBack');
  let step=1,chosenCity=city.value||'all',chosenArea='all',chosenPurpose='all',busy=false;
  let cityLoadPromise=Promise.resolve();
  const types=[['all','allProps'],['ઘર','house'],['ફ્લેટ','flat'],['દુકાન','shop'],['રેસિડેન્શિયલ પ્લોટ','res'],['કોમર્શિયલ પ્લોટ','com'],['ઓફિસ','office'],['વેરહાઉસ','warehouse'],['પી.જી. (PG)','pg']];
  function close(){modal.hidden=true;document.body.style.overflow='';}
  function button(label,selected,fn,extra=''){const b=document.createElement('button');b.type='button';b.className='mg-city-choice'+(extra?' '+extra:'');b.textContent=label;b.classList.toggle('selected',!!selected);b.addEventListener('click',fn);return b;}
  function setProgress(){modal.querySelectorAll('[data-step]').forEach(x=>x.classList.toggle('active',Number(x.dataset.step)<=step));back.hidden=step===1;back.textContent='‹ '+t('back');$('mgCityBrowserTitle').textContent=step===1?t('chooseCity'):step===2?t('area'):t('type');}
  function listLiveAreas(){
   const opts=[...area.options].filter(o=>o.value!=='all');
   const seen=new Set(opts.map(o=>o.value.toLowerCase()));
   document.querySelectorAll('#properties .property').forEach(card=>{
    if(chosenCity!=='all'&&card.dataset.city!==chosenCity)return;
    const raw=String(card.dataset.location||'').trim();if(!raw||seen.has(raw.toLowerCase()))return;
    seen.add(raw.toLowerCase());
    const option=new Option(raw,raw);option.dataset.match=raw;opts.push(option);
    // Keep dynamically discovered, real listing areas selectable by the filter itself.
    area.add(option.cloneNode(true));
   });
   if(opts.length)area.disabled=false;
   return opts;
  }
  function showCities(){
   const wrap=document.createElement('div');wrap.className='mg-city-browser-grid';
   [...city.options].filter(o=>o.value&&o.value!=='all').forEach(o=>wrap.append(button(o.textContent,o.value===chosenCity,()=>{
    if(busy)return;
    chosenCity=o.value;city.value=chosenCity;chosenArea='all';step=2;busy=false;
    let request;
    try{
     // Start the city change first so its area options are populated synchronously.
     if(typeof window.mgSelectCity==='function') request=window.mgSelectCity(chosenCity);
     else {city.dispatchEvent(new Event('change',{bubbles:true}));request=Promise.resolve();}
    }catch(err){console.error('City listing load failed:',err);return;}
    // Move to the area step immediately; the listing query continues in the background.
    show();
    cityLoadPromise=Promise.resolve(request);
    cityLoadPromise.then(()=>{
     if(!modal.hidden&&step===2&&chosenCity===o.value)show();
    }).catch(err=>console.error('City listing load failed:',err));
   })));
   content.replaceChildren(wrap);
  }
  function showAreas(){
   const wrap=document.createElement('div');wrap.className='mg-city-browser-grid';
   wrap.append(button(t('allAreas'),chosenArea==='all',()=>{chosenArea='all';step=3;show()}));
   const opts=listLiveAreas();
   opts.forEach(o=>wrap.append(button(o.textContent,chosenArea===o.value,()=>{chosenArea=o.value;step=3;show()})));
   if(!opts.length){const note=document.createElement('p');note.className='mg-city-browser-note';note.textContent=t('emptyArea');content.append(note);}
   content.append(wrap);
  }
  function showTypes(){
   const purposes=document.createElement('div');purposes.className='mg-city-browser-group';
   [['all','allPurposes'],['rent','rent'],['sale','sale']].forEach(([v,k])=>purposes.append(button(t(k),chosenPurpose===v,()=>{chosenPurpose=v;show();})));
   const wrap=document.createElement('div');wrap.className='mg-city-browser-grid';
   types.forEach(([v,k])=>wrap.append(button(t(k),false,()=>apply(v),v==='પી.જી. (PG)'?'mg-city-pg':'')));
   content.append(purposes,wrap);
  }
  function show(){
   content.replaceChildren();setProgress();
   if(step===1)showCities();else if(step===2)showAreas();else showTypes();
  }
  async function apply(typeValue){
   try{
    if(city.value!==chosenCity){
     city.value=chosenCity;
     cityLoadPromise=typeof window.mgSelectCity==='function'?window.mgSelectCity(chosenCity):Promise.resolve(city.dispatchEvent(new Event('change',{bubbles:true})));
    }
    await cityLoadPromise;
    city.value=chosenCity;area.value=chosenArea;purpose.value=chosenPurpose;type.value=typeValue;
    if(typeof window.filterProps==='function')window.filterProps();
    close();
   }catch(err){console.error('City/area filter apply failed:',err);}
  }
  trigger.addEventListener('click',()=>{chosenCity=city.value||'all';chosenArea='all';chosenPurpose='all';step=1;modal.hidden=false;document.body.style.overflow='hidden';show();});
  back.addEventListener('click',()=>{if(step>1){step--;show();}});
  $('mgCityBrowserCloseFoot').addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target.closest('[data-close]'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close();});
  $('mgListingTitleButton')?.addEventListener('click',()=>$('listings')?.scrollIntoView({behavior:'smooth',block:'start'}));
  window.addEventListener('mg-language-changed',()=>{trigger.textContent=t('city');if(!modal.hidden)show();});
  trigger.textContent=t('city');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();