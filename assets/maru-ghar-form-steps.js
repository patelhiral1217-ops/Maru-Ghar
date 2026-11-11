/* Guided property listing wizard. Keeps original field names and form submission intact. */
(()=>{
 const init=()=>{
  const form=document.getElementById('propertyForm');if(!form||form.dataset.guidedWizard==='1')return;
  const grid=form.querySelector('.formgrid');if(!grid)return;form.dataset.guidedWizard='1';
  const submit=document.getElementById('submitListingBtn'),status=document.getElementById('formStatus');
  const nodes=[...grid.children].filter(n=>n!==submit&&n!==status);
  const byName=name=>nodes.find(n=>n.matches?.(`[name="${name}"]`)||n.querySelector?.(`[name="${name}"]`));
  const configs=[
   {title:'તમારું નામ',names:['ownerName']},
   {title:'મોબાઇલ નંબર',names:['ownerPhone']},
   {title:'વિસ્તાર / સેક્ટર',names:['location']},
   {title:'શહેર પસંદ કરો',names:['city']},
   {title:'પ્રોપર્ટીનો પ્રકાર',names:['type']},
   {title:'ભાડે કે વેચાણ?',names:['purpose']},
   {title:'BHK પસંદ કરો',names:['bhk']},
   {title:'અંદાજિત કિંમત / ભાડું',names:['price']},
   {title:'નકશાની લિંક (વૈકલ્પિક)',names:['mapLink']},
   {title:'ક્ષેત્રફળ (વૈકલ્પિક)',names:['areaSqft']},
   {title:'માળ (વૈકલ્પિક)',names:['floor']},
   {title:'ફર્નિચર (વૈકલ્પિક)',names:['furnishing']},
   {title:'પાર્કિંગ (વૈકલ્પિક)',names:['parking']},
   {title:'ડિપોઝિટ (વૈકલ્પિક)',names:['deposit']},
   {title:'ભાવ (ફિલ્ટર માટે, વૈકલ્પિક)',names:['priceNum']},
   {title:'સ્કીમનું નામ (વૈકલ્પિક)',names:['offerTitle'],includeOfferHeading:true},
   {title:'સ્કીમ ક્યાં સુધી (વૈકલ્પિક)',names:['offerUntil']},
   {title:'સ્કીમની વિગત (વૈકલ્પિક)',names:['offerText']},
   {title:'પ્રોપર્ટીની વધુ માહિતી',names:['description']},
   {title:'માલિકીની સંમતિ',names:['ownerConsent']},
   {title:'પ્રોપર્ટીના ફોટા',names:['photos']},
   {title:'પ્રોપર્ટીનો વિડિયો (વૈકલ્પિક)',names:['videos']}
  ];
  const assigned=new Set(),steps=[];
  const getName=node=>{const c=node.matches?.('input,select,textarea')?node:node.querySelector?.('input,select,textarea');return c?.name||'';};
  const offerHeading=nodes.find(n=>n.tagName==='DIV'&&/સ્કીમ\s*\/\s*ઑફર/.test(n.textContent||''));
  configs.forEach((cfg,index)=>{
   const group=[];
   if(cfg.includeOfferHeading&&offerHeading&&!assigned.has(offerHeading)){group.push(offerHeading);assigned.add(offerHeading);}
   cfg.names.forEach(name=>{const n=byName(name);if(n&&!assigned.has(n)){group.push(n);assigned.add(n);}});
   if(!group.length)return;
   const details=document.createElement('details');details.className='mg-form-step';details.dataset.step=String(index);
   const summary=document.createElement('summary');summary.textContent=cfg.title;summary.setAttribute('aria-label',cfg.title);
   const content=document.createElement('div');content.className='mg-form-step-content';
   const actions=document.createElement('div');actions.className='mg-step-actions';
   const back=document.createElement('button');back.type='button';back.className='mg-step-back';back.textContent='પાછળ જાઓ';
   const next=document.createElement('button');next.type='button';next.className='mg-step-next';next.textContent='આગળ વધો';
   actions.append(back,next);content.append(actions);details.append(summary,content);
   const first=group[0];grid.insertBefore(details,first);
   group.forEach(n=>content.insertBefore(n,actions));
   const controls=group.flatMap(n=>n.matches?.('input,select,textarea')?[n]:[...n.querySelectorAll?.('input,select,textarea')||[]]);
   const step={details,controls,index:steps.length};steps.push(step);
   next.addEventListener('click',()=>advance(step,false));
   back.addEventListener('click',()=>{const prev=steps[step.index-1];if(prev){details.open=false;prev.details.open=true;focusFirst(prev);prev.details.scrollIntoView({behavior:'smooth',block:'center'});}});
   controls.forEach(control=>{
    const isSelect=control.tagName==='SELECT'||control.type==='checkbox'||control.type==='file';
    control.addEventListener(isSelect?'change':'blur',e=>{
     if(isSelect){if(isComplete(step))advance(step,false);return;}
     setTimeout(()=>{if(document.activeElement===next||details.open===false)return;if(isComplete(step))advance(step,false);},0);
    });
    control.addEventListener('keydown',e=>{if(e.key==='Enter'&&control.tagName!=='TEXTAREA'&&isComplete(step)){e.preventDefault();advance(step,false);}});
   });
  });
  /* Keep any future fields visible in a final additional-details step instead of losing them. */
  const leftovers=nodes.filter(n=>!assigned.has(n));
  if(leftovers.length){const details=document.createElement('details');details.className='mg-form-step';const summary=document.createElement('summary');summary.textContent='અન્ય વિગતો';const content=document.createElement('div');content.className='mg-form-step-content';const actions=document.createElement('div');actions.className='mg-step-actions';const next=document.createElement('button');next.type='button';next.className='mg-step-next';next.textContent='આગળ વધો';actions.append(next);details.append(summary,content);grid.insertBefore(details,leftovers[0]);leftovers.forEach(n=>content.append(n));content.append(actions);steps.push({details,controls:[],index:steps.length});next.addEventListener('click',()=>advance(steps[steps.length-1],false));}
  function isComplete(step){return step.controls.every(c=>{if(c.disabled)return true;if(c.type==='checkbox')return !c.required||c.checked;if(c.type==='file')return !c.required||c.files?.length>0;if(!c.required)return true;return c.checkValidity()&&String(c.value||'').trim().length>0;});}
  function focusFirst(step){const c=step.controls.find(x=>!['file','checkbox'].includes(x.type));if(c)setTimeout(()=>c.focus({preventScroll:true}),150);}
  function advance(step,force){if(!force&&!isComplete(step)){const bad=step.controls.find(c=>c.required&&!c.checkValidity());bad?.reportValidity?.();return;}const next=steps[step.index+1];if(!next){submit?.scrollIntoView({behavior:'smooth',block:'center'});submit?.focus({preventScroll:true});return;}step.details.open=false;next.details.open=true;next.details.scrollIntoView({behavior:'smooth',block:'center'});focusFirst(next);}
  steps.forEach((s,i)=>{s.details.open=i===0;});
  if(submit){submit.addEventListener('click',e=>{const bad=[...form.querySelectorAll('input,select,textarea')].find(c=>!c.disabled&&!c.checkValidity());if(bad){e.preventDefault();const target=steps.find(s=>s.details.contains(bad));if(target){steps.forEach(s=>s.details.open=s===target);bad.focus();}}},true);}
  form.addEventListener('reset',()=>setTimeout(()=>steps.forEach((s,i)=>s.details.open=i===0),0));
 };
 const style=document.createElement('style');style.textContent=`#propertyForm .mg-form-step{grid-column:1/-1;border:1px solid #d6bd7b;border-radius:12px;background:rgba(255,255,255,.045);overflow:hidden;margin:0 0 5px;min-width:0}#propertyForm .mg-form-step>summary{list-style:none;cursor:pointer;padding:14px 15px;font-weight:800;color:#fff0bd;display:flex;align-items:center;justify-content:space-between;gap:12px}#propertyForm .mg-form-step>summary::-webkit-details-marker{display:none}#propertyForm .mg-form-step>summary:after{content:'＋';font-size:18px;color:#ffdd00}#propertyForm .mg-form-step[open]>summary:after{content:'−'}#propertyForm .mg-form-step-content{padding:4px 12px 13px;display:grid;gap:10px;min-width:0}#propertyForm .mg-form-step-content>*{min-width:0}#propertyForm .mg-step-actions{display:flex;justify-content:space-between;gap:10px;grid-column:1/-1;order:99}#propertyForm .mg-step-next,#propertyForm .mg-step-back{border:0;border-radius:8px;padding:9px 15px;font-weight:800;cursor:pointer}#propertyForm .mg-step-next{margin-left:auto;background:linear-gradient(120deg,#ffdd00,#d6ad00);color:#173126}#propertyForm .mg-step-back{background:transparent;color:#e8d58b;border:1px solid #bda653}#propertyForm .mg-form-step-content>input,#propertyForm .mg-form-step-content>select,#propertyForm .mg-form-step-content>textarea{width:100%}#propertyForm .mg-form-step-content>label{display:block}#propertyForm .mg-form-step-content>div[style*="font-weight"]{grid-column:1/-1!important}#propertyForm .mg-form-step-content label input[type=file]{display:block;width:100%;margin-top:8px}@media(max-width:560px){#propertyForm .mg-form-step-content{padding-left:8px;padding-right:8px}}`;
 document.head.appendChild(style);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
