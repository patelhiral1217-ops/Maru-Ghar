(()=>{'use strict';
const $=s=>document.querySelector(s);
function fold(panel,open=false){
 if(!panel||panel.dataset.mgFolded==='1')return;
 const title=panel.querySelector(':scope > h2')||panel.querySelector(':scope h2')||panel.querySelector(':scope h3');
 const details=document.createElement('details');details.className='mg-admin-fold';details.open=open;
 const summary=document.createElement('summary');summary.textContent=(title?.textContent||'Admin વિભાગ').trim();
 panel.before(details);details.append(summary,panel);panel.dataset.mgFolded='1';
}
function init(){
 const dashboard=$('#dashboard'),main=$('#adminMain'),settings=$('#adminSettings'),nav=document.querySelector('.admin-shortcuts');
 if(!dashboard||!main||!settings)return;

 /* Keep only the three everyday destinations in the compact top bar. */
 if(nav){
  nav.replaceChildren();
  [['#listings','🏠 લિસ્ટિંગ'],['#enquiryList','✉️ પૂછપરછ'],['#adminSettings','⚙️ સેટિંગ્સ']].forEach(([href,label])=>{
   const a=document.createElement('a');a.href=href;a.textContent=label;nav.append(a);
  });
 }

 /* Put add-property, upload-test and reports inside Settings, not on the main screen. */
 if(!settings.querySelector('#mgAdminToolsFold')){
  const tools=document.createElement('details');tools.id='mgAdminToolsFold';tools.className='mg-admin-fold';
  const summary=document.createElement('summary');summary.textContent='🧰 પ્રોપર્ટી ઉમેરો, અપલોડ ટેસ્ટ અને રિપોર્ટ';
  tools.append(summary,main);settings.insertBefore(tools,settings.firstChild);
 }
 [...main.children].forEach(node=>{if(node.matches('section.panel'))fold(node,false);});
 [...settings.children].forEach(node=>{if(node.matches('section.panel'))fold(node,false);});

 const manager=$('#mgSiteContentManager');
 if(manager){
  const grid=manager.querySelector(':scope > .formgrid');
  const actions=manager.querySelector(':scope > .actions');
  const preview=$('#mgCmsPreview'),status=$('#mgCmsStatus');
  if(grid&&actions&&!manager.querySelector('.mg-cms-editor')){
   const details=document.createElement('details');details.className='mg-cms-editor';
   const summary=document.createElement('summary');summary.textContent='＋ નવું લખાણ / ફોટો / વીડિયો ઉમેરો';
   const body=document.createElement('div');body.className='mg-cms-editor-body';
   manager.insertBefore(details,grid);details.append(summary,body);body.append(grid,actions);
   if(preview)body.append(preview);if(status)body.append(status);
  }
  const list=$('#mgCmsList'),heading=list?.previousElementSibling;
  if(list&&heading?.tagName==='H3'&&!manager.querySelector('.mg-cms-items-fold')){
   const details=document.createElement('details');details.className='mg-cms-items-fold';
   const summary=document.createElement('summary');summary.textContent='📚 બનાવેલા વિભાગો જુઓ / Edit કરો';
   manager.insertBefore(details,heading);details.append(summary,heading,list);
  }
 }
 document.querySelectorAll('.admin-shortcuts a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
  const target=$(a.getAttribute('href'));if(!target)return;
  let p=target.parentElement;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}
 }));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();