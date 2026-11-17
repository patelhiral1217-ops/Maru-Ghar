/* Maru Ghar discovery controls: dual range filters, saved search and 3-way comparison. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const tr=s=>typeof window.mgI18nText==='function'?window.mgI18nText(s):s;
  const PRICE_MAX=500000000, AREA_MAX=5000;
  const status=message=>{const el=$('mgDiscoveryStatus');if(el)el.textContent=message||''};
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(n))?Number(n):min));
  const money=n=>{n=Number(n)||0;if(n>=10000000)return '₹'+(n/10000000).toLocaleString('en-IN',{maximumFractionDigits:2})+' '+tr('કરોડ');if(n>=100000)return '₹'+(n/100000).toLocaleString('en-IN',{maximumFractionDigits:2})+' '+tr('લાખ');return '₹'+Math.round(n).toLocaleString('en-IN')};
  const areaText=n=>(Number(n)||0).toLocaleString('en-IN')+' '+tr('ચો.મી.');
  function setupRange(c){
    const lo=$(c.lo),hi=$(c.hi),loInput=$(c.loInput),hiInput=$(c.hiInput),fill=$(c.fill),label=$(c.label);
    if(!lo||!hi||!loInput||!hiInput)return;
    const fmt=c.kind==='price'?money:areaText;
    function update(side,runFilter=true){
      let a=clamp(side==='min'?lo.value:loInput.value,0,c.max);
      let b=clamp(side==='max'?hi.value:hiInput.value,0,c.max);
      if(side==='min'&&a>b)a=b;
      if(side==='max'&&b<a)b=a;
      if(side==='both'){a=clamp(lo.value,0,c.max);b=clamp(hi.value,0,c.max);if(a>b){if(c.last==='min')a=b;else b=a;}}
      lo.value=String(a);hi.value=String(b);loInput.value=String(a);hiInput.value=String(b);
      const left=(a/c.max)*100,right=(b/c.max)*100;
      if(fill){fill.style.left=left+'%';fill.style.width=Math.max(0,right-left)+'%';}
      if(label)label.textContent=fmt(a)+' – '+fmt(b);
      if(runFilter&&typeof window.filterProps==='function')window.filterProps();
    }
    lo.addEventListener('input',()=>{c.last='min';update('min')});
    hi.addEventListener('input',()=>{c.last='max';update('max')});
    loInput.addEventListener('change',()=>{c.last='min';lo.value=loInput.value;update('min')});
    hiInput.addEventListener('change',()=>{c.last='max';hi.value=hiInput.value;update('max')});
    c.reset=()=>{lo.value='0';hi.value=String(c.max);update('both',false)};
    c.read=()=>({min:Number(lo.value),max:Number(hi.value)});
    c.restore=v=>{lo.value=String(clamp(v?.min??0,0,c.max));hi.value=String(clamp(v?.max??c.max,0,c.max));c.last='max';update('both',false)};
    update('both',false);
  }
  const ranges=[
    {kind:'price',lo:'fMin',hi:'fMax',loInput:'fMinValue',hiInput:'fMaxValue',fill:'mgPriceFill',label:'mgPriceRangeLabel',max:PRICE_MAX},
    {kind:'area',lo:'fAreaMin',hi:'fAreaMax',loInput:'fAreaMinValue',hiInput:'fAreaMaxValue',fill:'mgAreaFill',label:'mgAreaRangeLabel',max:AREA_MAX}
  ];
  ranges.forEach(setupRange);
  const filterIds=['fBhk','fVerified','fFurn','fMedia','fSort'];
  const searchIds=['purpose','type','query','cityFilter',...filterIds];
  const savedKey='mg_saved_search_v1';
  function readSaved(){try{const s=JSON.parse(localStorage.getItem(savedKey)||'null');return s&&s.values?s:null}catch(_){return null}}
  const loadButton=$('mgLoadSearch');if(loadButton)loadButton.hidden=!readSaved();
  const saveButton=$('mgSaveSearch');
  if(saveButton)saveButton.addEventListener('click',()=>{
    const values={};searchIds.forEach(id=>{const el=$(id);if(el)values[id]=el.value});
    ranges.forEach((r,i)=>{const v=r.read();values[i?'areaRange':'priceRange']=v});
    try{localStorage.setItem(savedKey,JSON.stringify({version:1,savedAt:Date.now(),values}));if(loadButton)loadButton.hidden=false;status(tr('તમારી શોધ આ મોબાઇલમાં સાચવાઈ ગઈ છે.'));}
    catch(_){status(tr('શોધ સાચવી શકાઈ નથી. મોબાઇલમાં જગ્યા તપાસો.'));}
  });
  if(loadButton)loadButton.addEventListener('click',()=>{
    const saved=readSaved();if(!saved)return;
    searchIds.forEach(id=>{const el=$(id);if(el&&saved.values[id]!=null)el.value=saved.values[id]});
    ranges.forEach((r,i)=>r.restore(saved.values[i?'areaRange':'priceRange']));
    const city=$('cityFilter');if(city&&saved.values.cityFilter!=null)city.dispatchEvent(new Event('change',{bubbles:true}));
    if(typeof window.filterProps==='function')window.filterProps();
    status(tr('તમારી છેલ્લી સાચવેલી શોધ ફરી લાગુ થઈ.'));
  });
  const reset=$('mgResetFilters');
  if(reset)reset.addEventListener('click',()=>{
    filterIds.forEach(id=>{const el=$(id);if(el)el.value=id==='fSort'?'new':'all'});
    ranges.forEach(r=>r.reset());
    window.__favOnly=false;const fav=$('favOnly');if(fav){fav.classList.remove('active');fav.setAttribute('aria-pressed','false');}
    if(typeof window.filterProps==='function')window.filterProps();
    status(tr('એડવાન્સ ફિલ્ટર સાફ થઈ ગયા.'));
  });
  const compareIds=[];
  function updateCompareButtons(){
    const open=$('mgOpenCompare');
    if(open)open.textContent=tr('⇄ તુલના')+' ('+compareIds.length+')';
    document.querySelectorAll('[data-act="compare"]').forEach(b=>{
      const card=b.closest('.property'),id=card?.dataset.id,selected=compareIds.includes(id);
      b.classList.toggle('is-selected',selected);b.textContent=selected?tr('✓ ઉમેર્યું'):tr('⇄ તુલના');
      b.setAttribute('aria-pressed',String(selected));
    });
  }
  function propertyFor(id){try{return typeof window.mgGetPropertyById==='function'?window.mgGetPropertyById(id):null}catch(_){return null}}
  function compareValue(p,key){
    const sqft=Number(String(p.areaSqft||'').replace(/,/g,'')),sqm=Number(p.areaSqm)|| (Number.isFinite(sqft)&&sqft>0?sqft*0.092903:0);
    const values={
      'કિંમત / ભાડું':p.price||tr('કિંમત માટે સંપર્ક કરો'),
      'શહેર / વિસ્તાર':[p.city,p.location].filter(Boolean).join(' · ')||'—',
      'પ્રકાર':p.type||'—','હેતુ':p.purpose||'—','BHK':p.bhk||'—',
      'ક્ષેત્રફળ':sqm>0?Math.round(sqm).toLocaleString('en-IN')+' '+tr('ચો.મી.'):(p.areaSqft||'—'),
      'માળ':p.floor||'—','ફર્નિચર':p.furnishing||'—','પાર્કિંગ':p.parking||'—',
      'વેરિફાઇડ':p.verified?'હા':'ના','ફીચર્ડ':p.featured?'હા':'ના',
      'ફોટા':Array.isArray(p.photos)?String(p.photos.length):'0',
      'વીડિયો':Array.isArray(p.videos)?String(p.videos.length):'0'
    };
    return values[key]??tr('વિગત ઉપલબ્ધ નથી');
  }
  function openCompare(){
    const props=compareIds.map(propertyFor).filter(Boolean);
    if(props.length<2){status(tr('તુલના કરવા માટે ઓછામાં ઓછી 2 પ્રોપર્ટી પસંદ કરો.'));return;}
    document.querySelector('.mg-compare-overlay')?.remove();
    const overlay=document.createElement('div');overlay.className='mg-compare-overlay';overlay.setAttribute('role','presentation');
    const dialog=document.createElement('section');dialog.className='mg-compare-dialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','પ્રોપર્ટીની તુલના');
    const head=document.createElement('div');head.className='mg-compare-head';
    const title=document.createElement('h2');title.textContent=tr('પ્રોપર્ટીની સરખામણી');
    const close=document.createElement('button');close.type='button';close.textContent='બંધ કરો';close.addEventListener('click',()=>overlay.remove());
    head.append(title,close);dialog.append(head);
    const wrap=document.createElement('div');wrap.className='mg-compare-table-wrap';const table=document.createElement('table');table.className='mg-compare-table';
    const thead=document.createElement('thead'),hr=document.createElement('tr'),first=document.createElement('th');first.textContent=tr('વિગત');hr.append(first);
    props.forEach(p=>{const th=document.createElement('th');th.textContent=p.title||p.type||'પ્રોપર્ટી';hr.append(th)});thead.append(hr);table.append(thead);
    const tbody=document.createElement('tbody');
    const keys=['કિંમત / ભાડું','શહેર / વિસ્તાર','પ્રકાર','હેતુ','BHK','ક્ષેત્રફળ','માળ','ફર્નિચર','પાર્કિંગ','વેરિફાઇડ','ફીચર્ડ','ફોટા','વીડિયો'];
    keys.forEach(key=>{const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=tr(key);tr.append(th);props.forEach(p=>{const td=document.createElement('td');td.textContent=compareValue(p,key);tr.append(td)});tbody.append(tr)});
    table.append(tbody);wrap.append(table);dialog.append(wrap);
    const actions=document.createElement('div');actions.style.cssText='display:flex;justify-content:flex-end;gap:8px;margin-top:12px;flex-wrap:wrap';
    const clear=document.createElement('button');clear.type='button';clear.textContent=tr('પસંદગી સાફ કરો');clear.addEventListener('click',()=>{compareIds.splice(0);overlay.remove();updateCompareButtons();});
    actions.append(clear);dialog.append(actions);overlay.append(dialog);
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
    document.body.append(overlay);
  }
  document.addEventListener('mg-compare-select',e=>{
    const id=String(e.detail?.id||'');if(!id)return;
    const at=compareIds.indexOf(id);
    if(at>=0)compareIds.splice(at,1);
    else if(compareIds.length>=3){status(tr('એક સાથે વધુમાં વધુ 3 પ્રોપર્ટીની તુલના કરી શકાય છે.'));return;}
    else compareIds.push(id);
    updateCompareButtons();
    status(compareIds.length+' '+tr('પ્રોપર્ટી તુલના માટે પસંદ છે.'));
  });
  const open=$('mgOpenCompare');if(open)open.addEventListener('click',openCompare);
  document.addEventListener('click',e=>{if(e.target.closest('[data-act="compare"]'))setTimeout(updateCompareButtons,0)});
  document.addEventListener('DOMContentLoaded',updateCompareButtons);
  updateCompareButtons();
})();