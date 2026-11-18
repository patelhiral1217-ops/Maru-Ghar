/* Maru Ghar admin UX: all major admin work areas are compact, accessible accordions. */
(function(){
 'use strict';
 const CITY_AREAS={
 'ગાંધીનગર':['સેક્ટર 1','સેક્ટર 2','સેક્ટર 3','સેક્ટર 4','સેક્ટર 5','સેક્ટર 6','સેક્ટર 7','સેક્ટર 8','સેક્ટર 9','સેક્ટર 10','સેક્ટર 11','સેક્ટર 12','સેક્ટર 13','સેક્ટર 14','સેક્ટર 15','સેક્ટર 16','સેક્ટર 17','સેક્ટર 18','સેક્ટર 19','સેક્ટર 20','સેક્ટર 21','સેક્ટર 22','સેક્ટર 23','સેક્ટર 24','સેક્ટર 25','સેક્ટર 26','સેક્ટર 27','સેક્ટર 28','સેક્ટર 29','સેક્ટર 30','કુડાસણ','રાંદેસણ','રાયસણ','સરગાસણ','વાવોલ','પેથાપુર','કોબા','કોલવડા','રાંધેજા','ભાટ','સુઘડ','ઝુંડાલ','ખોરજ','અમિયાપુર','અડાલજ','ઇન્ફોસિટી'],
 'અમદાવાદ':['ચાંદખેડા','અડાલજ','બોપલ','સેટેલાઇટ','ગોતા','થલતેજ','વસ્ત્રાપુર','મણિનગર','નરોડા','નિકોલ','મોટેરા','સાબરમતી','બોડકદેવ','પ્રહલાદનગર','સાયન્સ સિટી','એસ.જી. હાઇવે','સાઉથ બોપલ','શેલા','ઘુમા','ચાંદલોડિયા','વેજલપુર']
 };
 function makeAccordion(panel,index){
   if(panel.dataset.mgAccordionReady==='1')return;
   const heading=panel.querySelector(':scope > h2')||panel.querySelector(':scope > .row h2');if(!heading)return;
   panel.dataset.mgAccordionReady='1';
   const title=heading.textContent.trim();const content=document.createElement('div');content.className='mg-admin-panel-content';content.hidden=true;
   const header=heading.closest('.row')&&heading.closest('.row').parentElement===panel?heading.closest('.row'):heading;
   const button=document.createElement('button');button.type='button';button.className='mg-admin-toggle';button.setAttribute('aria-expanded','false');button.innerHTML='<span></span><span class="mg-chevron" aria-hidden="true">⌄</span>';button.firstElementChild.textContent=title;
   panel.insertBefore(button,header);
   if(header===heading){heading.hidden=true;let node=heading.nextSibling;while(node){const next=node.nextSibling;content.appendChild(node);node=next;}}
   else{header.hidden=true;let node=header.nextSibling;while(node){const next=node.nextSibling;content.appendChild(node);node=next;}}
   panel.appendChild(content);
   button.addEventListener('click',function(){
     const open=button.getAttribute('aria-expanded')!=='true';
     const group=panel.parentElement;
     if(open&&group)group.querySelectorAll(':scope > .panel > .mg-admin-toggle[aria-expanded="true"]').forEach(other=>{if(other!==button){other.setAttribute('aria-expanded','false');other.nextElementSibling.hidden=true;}});
     button.setAttribute('aria-expanded',String(open));content.hidden=!open;
     if(open)setTimeout(()=>button.scrollIntoView({behavior:'smooth',block:'nearest'}),40);
   });
 }
 function setup(){
   const dash=document.getElementById('dashboard');if(!dash)return;
   [...dash.querySelectorAll('.panel')].filter(p=>!p.closest('#adminSettings')).forEach((p,i)=>makeAccordion(p,i));
   /* Keep only the main three work areas outside Settings; secondary tools stay in the Settings drawer. */
   const main=document.getElementById('adminMain');
   if(main){const panels=[...main.querySelectorAll(':scope > .panel')];panels.forEach(p=>{p.hidden=false;});}
   const formPanel=document.querySelector('#adminMain > .panel');
   if(formPanel){const form=formPanel.querySelector('#adminAddForm');if(form){const content=form.closest('.mg-admin-panel-content');if(content){content.hidden=true;const b=formPanel.querySelector('.mg-admin-toggle');if(b)b.setAttribute('aria-expanded','false');}}}
   const city=document.getElementById('cityFilter');
   if(city&&!document.getElementById('mgCityHeading')){const label=document.createElement('div');label.id='mgCityHeading';label.className='mg-city-heading';label.textContent=city.value==='ગાંધીનગર'?'ગાંધીનગર':'આખું ગુજરાત';city.parentElement.insertBefore(label,city);}
   if(city){const label=document.getElementById('mgCityHeading');const update=()=>{if(label)label.textContent=city.value==='all'?'આખું ગુજરાત':city.value;};city.addEventListener('change',update);update();}
   const adminCity=document.getElementById('adminCityField'),location=document.querySelector('#adminAddForm [name="location"]');
   if(adminCity){const names=['ગાંધીનગર','અમદાવાદ','સુરત','વડોદરા','રાજકોટ','ભાવનગર','જામનગર','જૂનાગઢ','આણંદ','નડિયાદ','મહેસાણા','કલોલ','મોરબી','સુરેન્દ્રનગર','ભરૂચ','વાપી','નવસારી','પાટણ','ગોધરા','પોરબંદર','ભુજ','અમરેલી','પાલનપુર','હિંમતનગર'];const old=adminCity.value||'ગાંધીનગર';adminCity.replaceChildren(...names.map(n=>new Option(n,n)));adminCity.value=names.includes(old)?old:'ગાંધીનગર';}
   if(location){location.setAttribute('list','mgAdminAreaOptions');let dl=document.getElementById('mgAdminAreaOptions');if(!dl){dl=document.createElement('datalist');dl.id='mgAdminAreaOptions';location.after(dl);}const cityField=document.getElementById('adminCityField');const fill=()=>{dl.replaceChildren(...(CITY_AREAS[cityField?.value]||[]).map(n=>new Option(n,n)));};cityField?.addEventListener('change',fill);fill();}
   /* Remove orphaned JavaScript that was accidentally rendered as page text, without touching real copy. */
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const remove=[];while(walker.nextNode()){const n=walker.currentNode,t=n.nodeValue||'';if(t.length>90&&/(?:document\\.getElementById|addEventListener\\s*\\(|function\\s*\\(|=>\\s*\\{|\\bconst\\s+[A-Za-z_$][\\w$]*\\s*=)/.test(t))remove.push(n);}remove.forEach(n=>n.parentNode&&n.parentNode.removeChild(n));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
