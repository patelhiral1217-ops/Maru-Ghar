/* Maru Ghar city -> area -> purpose/type browser. Keeps the existing Firebase filters as the source of truth. */
(()=>{
  const $=id=>document.getElementById(id);
  const lang=()=>{try{return localStorage.getItem('mg_language')||'gu'}catch(_){return 'gu'}};
  const words={
    gu:{city:'શહેર પસંદ કરો',area:'વિસ્તાર પસંદ કરો',purpose:'ભાડે કે વેચાણ પસંદ કરો',type:'પ્રોપર્ટીનો પ્રકાર પસંદ કરો',all:'બધા વિસ્તાર',allCities:'આખું ગુજરાત',rent:'ભાડે',sale:'વેચાણ',allTypes:'બધી પ્રોપર્ટી',house:'મકાન',flat:'ફ્લેટ',shop:'દુકાન',resPlot:'રહેણાંક પ્લોટ',comPlot:'કોમર્શિયલ પ્લોટ',office:'ઓફિસ',warehouse:'ગોડાઉન',pg:'PG માટે અલગ',back:'પાછળ',close:'બંધ કરો',next:'આગળ વધો',empty:'આ શહેર માટે વિસ્તારની યાદી ઉપલબ્ધ નથી. બધા વિસ્તાર પસંદ કરીને આગળ વધો.',listing:'પ્રોપર્ટી લિસ્ટિંગ'},
    hi:{city:'शहर चुनें',area:'इलाका चुनें',purpose:'किराया या बिक्री चुनें',type:'प्रॉपर्टी का प्रकार चुनें',all:'सभी इलाके',allCities:'पूरा गुजरात',rent:'किराया',sale:'बिक्री',allTypes:'सभी प्रॉपर्टी',house:'मकान',flat:'फ्लैट',shop:'दुकान',resPlot:'आवासीय प्लॉट',comPlot:'कमर्शियल प्लॉट',office:'ऑफिस',warehouse:'गोदाम',pg:'अलग PG',back:'वापस',close:'बंद करें',next:'आगे बढ़ें',empty:'इस शहर के इलाकों की सूची उपलब्ध नहीं है। सभी इलाके चुनकर आगे बढ़ें।',listing:'प्रॉपर्टी लिस्टिंग'},
    en:{city:'Choose City',area:'Choose Area',purpose:'Choose Rent or Sale',type:'Choose Property Type',all:'All Areas',allCities:'All Gujarat',rent:'Rent',sale:'Sale',allTypes:'All Properties',house:'House',flat:'Flat',shop:'Shop',resPlot:'Residential Plot',comPlot:'Commercial Plot',office:'Office',warehouse:'Warehouse',pg:'Separate PG',back:'Back',close:'Close',next:'Continue',empty:'Area list is not available for this city yet. Choose All Areas to continue.',listing:'Property Listings'}
  };
  const t=k=>(words[lang()]||words.gu)[k]||words.gu[k]||k;
  function init(){
    const city=$('cityFilter'),area=$('areaFilter'),purpose=$('purpose'),type=$('type'),row=city?.parentElement;
    if(!city||!area||!row||$('mgCityBrowser'))return;
    city.hidden=true;area.hidden=true;
    const trigger=document.createElement('button');trigger.type='button';trigger.id='mgCityBrowserOpen';trigger.className='mg-city-browser-open';trigger.textContent=t('city')+' · '+(city.selectedOptions[0]?.textContent||t('allCities'));row.insertBefore(trigger,city);
    const modal=document.createElement('div');modal.id='mgCityBrowser';modal.className='mg-city-browser';modal.hidden=true;
    modal.innerHTML='<div class="mg-city-browser-backdrop" data-close="1"></div><section class="mg-city-browser-dialog" role="dialog" aria-modal="true" aria-labelledby="mgCityBrowserTitle"><header class="mg-city-browser-head"><div><small>MARU GHAR</small><h2 id="mgCityBrowserTitle"></h2></div><button type="button" class="mg-city-browser-close" data-close="1" aria-label="Close">×</button></header><div class="mg-city-browser-progress"><span data-step="1"></span><span data-step="2"></span><span data-step="3"></span></div><div class="mg-city-browser-content" id="mgCityBrowserContent"></div><footer class="mg-city-browser-foot"><button type="button" id="mgCityBrowserBack"></button><button type="button" id="mgCityBrowserNext"></button></footer></section>';
    document.body.appendChild(modal);
    const content=$('mgCityBrowserContent'),title=$('mgCityBrowserTitle'),back=$('mgCityBrowserBack'),next=$('mgCityBrowserNext');
    let step=1,selectedCity=city.value||'all',selectedArea='all',selectedPurpose='all',selectedType='all';
    function refreshTrigger(){trigger.textContent=t('city')+' · '+(city.selectedOptions[0]?.textContent||t('allCities'))+(selectedArea!=='all'?' / '+selectedArea:'');}
    function close(){modal.hidden=true;document.body.style.overflow='';}
    function show(){
      title.textContent=step===1?t('city'):step===2?t('area'):t('purpose')+' · '+t('type');
      modal.querySelectorAll('[data-step]').forEach(x=>x.classList.toggle('active',Number(x.dataset.step)<=step));
      back.hidden=step===1;back.textContent='‹ '+t('back');next.hidden=step!==2;next.textContent=t('next')+' ›';
      content.replaceChildren();
      if(step===1){
        const list=document.createElement('div');list.className='mg-city-browser-grid';
        [...city.options].forEach(o=>{const b=document.createElement('button');b.type='button';b.className='mg-city-choice';b.textContent=o.value==='all'?t('allCities'):o.textContent;b.classList.toggle('selected',o.value===selectedCity);b.addEventListener('click',()=>{selectedCity=o.value;city.value=o.value;city.dispatchEvent(new Event('change',{bubbles:true}));selectedArea='all';refreshTrigger();if(selectedCity==='all'){step=3;show();}else{step=2;setTimeout(show,450);}});list.append(b);});
        content.append(list);
      }else if(step===2){
        const options=[...area.options].filter(o=>o.value!=='all');
        const cards=[...document.querySelectorAll('#properties .property')].filter(p=>p.dataset.city===selectedCity);
        const known=new Set(options.map(o=>o.value));
        cards.forEach(p=>{const loc=String(p.dataset.location||'').trim();if(loc&&!known.has(loc)){known.add(loc);const o=new Option(loc,loc);o.dataset.match=loc;area.add(o);options.push(o);}});
        const list=document.createElement('div');list.className='mg-city-browser-grid';
        const all=document.createElement('button');all.type='button';all.className='mg-city-choice';all.textContent=t('all');all.classList.toggle('selected',selectedArea==='all');all.addEventListener('click',()=>{selectedArea='all';show()});list.append(all);
        options.forEach(o=>{const b=document.createElement('button');b.type='button';b.className='mg-city-choice';b.textContent=o.textContent;b.classList.toggle('selected',selectedArea===o.value);b.addEventListener('click',()=>{selectedArea=o.value;show()});list.append(b);});
        if(!options.length){const note=document.createElement('p');note.className='mg-city-browser-note';note.textContent=t('empty');content.append(note);}
        content.append(list);
      }else{
        const purposeWrap=document.createElement('div');purposeWrap.className='mg-city-browser-group';
        const ph=document.createElement('h3');ph.textContent=t('purpose');purposeWrap.append(ph);
        [['all',t('allTypes')],['rent',t('rent')],['sale',t('sale')]].forEach(([v,label])=>{const b=document.createElement('button');b.type='button';b.className='mg-city-choice';b.textContent=label;b.classList.toggle('selected',selectedPurpose===v);b.addEventListener('click',()=>{selectedPurpose=v;purposeWrap.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});purposeWrap.append(b);});
        const typeWrap=document.createElement('div');typeWrap.className='mg-city-browser-group';const th=document.createElement('h3');th.textContent=t('type');typeWrap.append(th);
        const types=[['all',t('allTypes')],['ઘર',t('house')],['ફ્લેટ',t('flat')],['દુકાન',t('shop')],['રેસિડેન્શિયલ પ્લોટ',t('resPlot')],['કોમર્શિયલ પ્લોટ',t('comPlot')],['ઓફિસ',t('office')],['વેરહાઉસ',t('warehouse')],['પી.જી. (PG)',t('pg')]];
        types.forEach(([v,label])=>{const b=document.createElement('button');b.type='button';b.className='mg-city-choice'+(v==='પી.જી. (PG)'?' mg-city-pg':'');b.textContent=label;b.classList.toggle('selected',selectedType===v);b.addEventListener('click',()=>{selectedType=v;typeWrap.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});typeWrap.append(b);});
        content.append(purposeWrap,typeWrap);
      }
    }
    function apply(){
      city.value=selectedCity;area.value=selectedArea;
      purpose.value=selectedPurpose;type.value=selectedType;
      city.dispatchEvent(new Event('change',{bubbles:true}));
      area.dispatchEvent(new Event('change',{bubbles:true}));
      const cat=[...document.querySelectorAll('#listings .cat')].find(b=>b.dataset.cat===(selectedType==='all'?'all':selectedType));
      if(cat)cat.click();else if(typeof window.filterProps==='function')window.filterProps();
      refreshTrigger();close();
      $('listings')?.scrollIntoView({behavior:'smooth',block:'start'});
    }
    trigger.addEventListener('click',()=>{selectedCity=city.value||'all';selectedArea=area.value||'all';selectedPurpose=purpose.value||'all';selectedType=type.value||'all';step=1;modal.hidden=false;document.body.style.overflow='hidden';show();});
    back.addEventListener('click',()=>{if(step>1){step--;show();}});
    next.addEventListener('click',()=>{if(step===2){step=3;show();}});
    modal.addEventListener('click',e=>{if(e.target.closest('[data-close]'))close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close();});
    $('mgListingTitleButton')?.addEventListener('click',()=>$('listings')?.scrollIntoView({behavior:'smooth',block:'start'}));
    window.addEventListener('mg-language-changed',()=>{trigger.textContent=t('city')+' · '+(city.selectedOptions[0]?.textContent||t('allCities'));if(!modal.hidden)show();});
    refreshTrigger();show();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();