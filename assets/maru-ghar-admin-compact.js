(()=>{'use strict';
const $=s=>document.querySelector(s);
function init(){
 const dashboard=$('#dashboard'),main=$('#adminMain'),settings=$('#adminSettings'),nav=document.querySelector('.admin-shortcuts');
 if(!dashboard||!main||!settings||settings.dataset.mgSectionButtons==='1')return;
 settings.dataset.mgSectionButtons='1';

 /* Preserve the three primary destinations in the compact top bar. */
 if(nav){
  nav.replaceChildren();
  [['#listings','🏠 લિસ્ટિંગ'],['#enquiryList','✉️ પૂછપરછ'],['#adminSettings','⚙️ સેટિંગ્સ']].forEach(([href,label])=>{
   const a=document.createElement('a');a.href=href;a.textContent=label;nav.append(a);
  });
 }

 /* Every admin tool becomes its own gold/silver 3D button inside Settings. */
 const sections=[...main.children,...settings.children].filter(node=>node.matches&&node.matches('section.panel'));
 const menu=document.createElement('div');menu.className='mg-admin-section-menu';menu.setAttribute('aria-label','Admin વિભાગો');
 const menuTitle=document.createElement('h3');menuTitle.className='mg-admin-menu-title';menuTitle.textContent='⚙️ જરૂરી વિભાગ પસંદ કરો';
 menu.append(menuTitle);
 const notification=$('#enableNotif');
 if(notification){
  const tile=document.createElement('div');tile.className='mg-admin-menu-tile mg-admin-notification-tile';
  notification.classList.add('mg-admin-section-btn');tile.append(notification);menu.append(tile);
 }
 sections.forEach((panel,index)=>{
  const heading=panel.querySelector(':scope > h2,:scope > h3')||panel.querySelector('h2,h3');
  const label=(heading?.textContent||'વધુ સેટિંગ્સ').trim();
  if(!panel.id)panel.id='mgAdminSection'+(index+1);
  panel.classList.add('mg-admin-section-content');
  panel.hidden=true;
  settings.append(panel);
  const tile=document.createElement('div');tile.className='mg-admin-menu-tile';
  const button=document.createElement('button');button.type='button';button.className='mg-admin-section-btn';
  button.textContent=label;button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-expanded','false');
  button.addEventListener('click',()=>{
   const willOpen=panel.hidden;
   sections.forEach(other=>{
    other.hidden=true;
    const b=menu.querySelector('[aria-controls="'+other.id+'"]');
    if(b)b.setAttribute('aria-expanded','false');
   });
   if(willOpen){
    settings.open=true;
    panel.hidden=false;
    button.setAttribute('aria-expanded','true');
    requestAnimationFrame(()=>panel.scrollIntoView({behavior:'smooth',block:'start'}));
   }else{
    panel.hidden=true;
    button.setAttribute('aria-expanded','false');
   }
  });
  tile.append(button);menu.append(tile);
 });
 const summary=settings.querySelector(':scope > summary');settings.insertBefore(menu,summary?.nextSibling||settings.firstChild);
 /* Remove the old Add Property / Reports container from the visible page. */
 main.replaceChildren();
 /* Clicking Settings in the top bar opens the Settings drawer. */
 document.querySelectorAll('.admin-shortcuts a[href="#adminSettings"]').forEach(a=>a.addEventListener('click',()=>{settings.open=true;}));

 /* Remove any accidental source-code text nodes left by a malformed inline script.
    Only known JavaScript bundle signatures are targeted; normal admin copy is untouched. */
 function removeLeakedSource(root=document.body){
  if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const remove=[];
  let node;
  while((node=walker.nextNode())){
   const value=node.nodeValue||'';
   if(value.length>100 && (
    value.includes('const originals=new WeakMap()') ||
    value.includes('window.mgSetLanguage=value=>') ||
    value.includes('document.createTreeWalker(root,NodeFilter.SHOW_TEXT)') ||
    value.includes('window.__mgI18nObserver=new MutationObserver') ||
    value.includes('document.createTreeWalker(root,NodeFilter.SHOW_TEXT)') ||
    value.includes('function translateNode') ||
    (value.length>160 && /document\\.getElementById|addEventListener\\s*\\(|window\\.mgSetLanguage|const originals/.test(value))
   )) remove.push(node);
  }
  remove.forEach(n=>n.parentNode&&n.parentNode.removeChild(n));
 }
 removeLeakedSource(document.body);
 const leakObserver=new MutationObserver(records=>records.forEach(record=>{
  record.addedNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)removeLeakedSource(node.parentNode||document.body);else if(node.nodeType===Node.ELEMENT_NODE)removeLeakedSource(node)});
 }));
 leakObserver.observe(document.body,{subtree:true,childList:true});

}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();