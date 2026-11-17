/* Maru Ghar — clearly labelled demo showcase, auto photo carousel and full-page details. */
(function(){
 'use strict';
 const samples=[
 {id:'sample-gandhinagar-3bhk',title:'આધુનિક 3 BHK પરિવારનું ઘર',type:'ફ્લેટ',purpose:'ભાડે',city:'ગાંધીનગર',area:'સેક્ટર 21',price:'₹22,000 / મહિનો',deposit:'₹44,000',bhk:'3 BHK',size:'1,450 ચો.ફૂટ',floor:'5મો માળ',furn:'સેમી ફર્નિશ્ડ',parking:'કાર પાર્કિંગ',facing:'પૂર્વમુખી',amenities:['લિફ્ટ','24 કલાક પાણી','સિક્યુરિટી','બાલ્કની','પાવર બેકઅપ'],desc:'પરિવાર માટે અનુકૂળ, હવા-ઉજાસવાળું ઘર. નજીકમાં શાળા, બજાર અને જાહેર પરિવહન.',photos:['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85']},
 {id:'sample-ahmedabad-villa',title:'પ્રીમિયમ 4 BHK વિલા',type:'ઘર',purpose:'વેચાણ',city:'અમદાવાદ',area:'થલતેજ',price:'₹2.15 કરોડ',deposit:'લાગુ પડતું નથી',bhk:'4 BHK',size:'2,650 ચો.ફૂટ',floor:'2 માળ',furn:'અનફર્નિશ્ડ',parking:'2 કાર પાર્કિંગ',facing:'ઉત્તરમુખી',amenities:['પ્રાઇવેટ ગાર્ડન','મોડ્યુલર કિચન','ટેરેસ','CCTV','ક્લબહાઉસ'],desc:'મોટા પરિવાર માટે વિશાળ વિલા. શાંત રહેણાંક વિસ્તાર, ગાર્ડન અને બે કાર પાર્કિંગની સુવિધા.',photos:['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85']},
 {id:'sample-kalol-2bhk',title:'સુંદર 2 BHK ફ્લેટ',type:'ફ્લેટ',purpose:'ભાડે',city:'કલોલ',area:'નવા કલોલ વિસ્તાર',price:'₹12,500 / મહિનો',deposit:'₹25,000',bhk:'2 BHK',size:'1,050 ચો.ફૂટ',floor:'3જો માળ',furn:'અનફર્નિશ્ડ',parking:'બાઈક પાર્કિંગ',facing:'પશ્ચિમમુખી',amenities:['લિફ્ટ','પાણી','બાલ્કની','ગાર્ડન','સુરક્ષા'],desc:'નાના પરિવાર માટે યોગ્ય 2 BHK. બજાર અને રોજિંદી જરૂરિયાતની દુકાનો નજીક.',photos:['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85']},
 {id:'sample-gandhinagar-plot',title:'રહેણાંક પ્લોટ — સારો લોકેશન',type:'રેસિડેન્શિયલ પ્લોટ',purpose:'વેચાણ',city:'ગાંધીનગર',area:'સેક્ટર 26 નજીક',price:'₹48 લાખ',deposit:'લાગુ પડતું નથી',bhk:'NA',size:'150 ચો.વાર',floor:'NA',furn:'NA',parking:'NA',facing:'રોડ ફેસિંગ',amenities:['રહેણાંક ઝોન','રોડ કનેક્ટિવિટી','વીજળી','પાણીની લાઇન'],desc:'ઘર બાંધવા માટેનો રહેણાંક પ્લોટ. ખરીદી પહેલાં ઝોનિંગ, ટાઇટલ અને મંજૂરીના દસ્તાવેજોની સ્વતંત્ર તપાસ કરવી.',photos:['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85']},
 {id:'sample-ahmedabad-shop',title:'મેઇન રોડ પર કોમર્શિયલ દુકાન',type:'દુકાન',purpose:'ભાડે',city:'અમદાવાદ',area:'બોપલ',price:'₹28,000 / મહિનો',deposit:'₹84,000',bhk:'NA',size:'520 ચો.ફૂટ',floor:'ગ્રાઉન્ડ ફ્લોર',furn:'અનફર્નિશ્ડ',parking:'ગ્રાહક પાર્કિંગ',facing:'મેઇન રોડ ફેસિંગ',amenities:['ગ્રાઉન્ડ ફ્લોર','શેતરંજ શટર','પાણી','ટોઇલેટ','વિઝિબિલિટી'],desc:'રિટેલ અથવા સર્વિસ બિઝનેસ માટે નમૂનાની દુકાન. ભાડું અને દુકાનની શરતો માલિક સાથે ચકાસવાની રહેશે.',photos:['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85']}
 ];
 const css=`
 #mgDemoShowcase{margin:22px 0 28px;padding:18px;border:1px solid #d8c58d;border-radius:20px;background:linear-gradient(145deg,#fffdf7,#edf2ed);box-shadow:0 8px 24px #203b2c12}
 #mgDemoShowcase .mg-demo-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
 #mgDemoShowcase h2{margin:0;color:#173d32;font-size:clamp(20px,3vw,27px)}
 #mgDemoShowcase .mg-demo-note{font-size:12px;color:#795d25;font-weight:800}
 #mgDemoShowcase .mg-demo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:15px}
 #mgDemoShowcase .mg-demo-card{min-width:0;overflow:hidden;border:1px solid #d8d8c9;border-radius:16px;background:#fff;box-shadow:0 4px 13px #203b2c12}
 #mgDemoShowcase .mg-demo-photo{position:relative;height:190px;overflow:hidden;background:#e7ece7}
 #mgDemoShowcase .mg-demo-photo img{width:100%;height:100%;display:block;object-fit:cover;transition:opacity .3s ease}
 #mgDemoShowcase .mg-demo-photo .mg-demo-tag{position:absolute;left:10px;top:10px;padding:5px 9px;border-radius:20px;background:#fff5d7;color:#664b17;font-size:11px;font-weight:900}
 #mgDemoShowcase .mg-demo-photo .mg-demo-counter{position:absolute;right:10px;bottom:10px;padding:4px 8px;border-radius:20px;background:#102a23cc;color:white;font-size:11px}
 #mgDemoShowcase .mg-demo-controls{display:flex;gap:6px;position:absolute;right:9px;top:9px}
 #mgDemoShowcase .mg-demo-controls button{width:30px;height:30px;border:1px solid #e1c77c;border-radius:50%;background:#fffdf0;color:#173d32;font-weight:900}
 #mgDemoShowcase .mg-demo-body{padding:13px}
 #mgDemoShowcase .mg-demo-body h3{margin:0 0 7px;color:#203b31;font-size:16px;line-height:1.35}
 #mgDemoShowcase .mg-demo-location{color:#68766e;font-size:12px;margin-bottom:8px}
 #mgDemoShowcase .mg-demo-price{color:#a27b25;font-size:19px;font-weight:900;margin:8px 0}
 #mgDemoShowcase .mg-demo-spec{font-size:12px;color:#59675f;line-height:1.7}
 #mgDemoShowcase .mg-demo-open{width:100%;margin-top:12px;padding:11px;border:1px solid #b28b3f;border-radius:11px;background:linear-gradient(145deg,#fff1bb,#d7b75e 58%,#b9c4bb);color:#183c30;font-weight:900;box-shadow:0 3px 0 #89692c,0 5px 10px #203b2c18}
 #mgDemoDetail{position:fixed;inset:0;z-index:100500;overflow:auto;background:#f6f5ef;color:#203b31;padding:0 0 36px}
 #mgDemoDetail .mg-detail-top{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px max(16px,calc((100vw - 1100px)/2));background:#173d32;color:#fff;box-shadow:0 3px 12px #0002}
 #mgDemoDetail .mg-detail-top a{color:#ffe5a2;text-decoration:none;font-weight:900}
 #mgDemoDetail .mg-detail-wrap{max-width:1100px;margin:20px auto;padding:0 16px}
 #mgDemoDetail .mg-detail-gallery{display:grid;grid-template-columns:2fr 1fr;gap:9px;height:390px;overflow:hidden;border-radius:18px}
 #mgDemoDetail .mg-detail-gallery img{width:100%;height:100%;object-fit:cover}
 #mgDemoDetail .mg-detail-gallery .mg-detail-side{display:grid;grid-template-rows:1fr 1fr;gap:9px;min-height:0}
 #mgDemoDetail .mg-detail-title{margin:20px 0 6px;font-size:clamp(23px,4vw,32px)}
 #mgDemoDetail .mg-detail-price{font-size:26px;color:#9c7523;font-weight:900}
 #mgDemoDetail .mg-detail-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0}
 #mgDemoDetail .mg-detail-cell{padding:13px;border:1px solid #ded8c5;border-radius:12px;background:#fff}
 #mgDemoDetail .mg-detail-cell small{display:block;color:#758078;margin-bottom:5px}
 #mgDemoDetail .mg-detail-cell b{color:#203b31}
 #mgDemoDetail .mg-detail-amenities{display:flex;flex-wrap:wrap;gap:8px}
 #mgDemoDetail .mg-detail-amenities span{padding:8px 11px;border-radius:20px;background:#e5eee7;color:#315b48;font-weight:700;font-size:13px}
 #mgDemoDetail .mg-detail-warning{padding:12px;border:1px solid #d9bd76;border-radius:12px;background:#fff6dc;color:#72551c;font-size:13px;line-height:1.6}
 @media(max-width:650px){#mgDemoShowcase{padding:12px}#mgDemoShowcase .mg-demo-grid{grid-template-columns:1fr}#mgDemoShowcase .mg-demo-photo{height:220px}#mgDemoDetail .mg-detail-gallery{height:260px;grid-template-columns:1fr}#mgDemoDetail .mg-detail-gallery .mg-detail-side{display:none}#mgDemoDetail .mg-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(prefers-reduced-motion:reduce){#mgDemoShowcase img{transition:none}}
 `;
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function detail(p){
  document.body.innerHTML='<div id="mgDemoDetail"><div class="mg-detail-top"><a href="index.html#listings">← મારું ઘર પર પાછા જાઓ</a><b>નમૂનાની પ્રોપર્ટી વિગત</b></div><div class="mg-detail-wrap"><div class="mg-detail-gallery"><img src="'+esc(p.photos[0])+'" alt="'+esc(p.title)+'">'+
  '<div class="mg-detail-side"><img src="'+esc(p.photos[1])+'" alt="અંદરનો ફોટો"><img src="'+esc(p.photos[2])+'" alt="વધુ ફોટો"></div></div><h1 class="mg-detail-title">'+esc(p.title)+'</h1><div>📍 '+esc(p.area)+', '+esc(p.city)+', ગુજરાત</div><div class="mg-detail-price">'+esc(p.price)+'</div><div class="mg-detail-grid">'+[['પ્રોપર્ટીનો પ્રકાર',p.type],['હેતુ',p.purpose],['BHK',p.bhk],['વિસ્તાર',p.size],['માળ',p.floor],['ફર્નિચર',p.furn],['ડિપોઝિટ',p.deposit],['પાર્કિંગ',p.parking],['મુખ',p.facing]].map(x=>'<div class="mg-detail-cell"><small>'+esc(x[0])+'</small><b>'+esc(x[1])+'</b></div>').join('')+'</div><h3>સુવિધાઓ</h3><div class="mg-detail-amenities">'+p.amenities.map(x=>'<span>✓ '+esc(x)+'</span>').join('')+'</div><h3>પ્રોપર્ટીની વિગત</h3><p style="line-height:1.8">'+esc(p.desc)+'</p><div class="mg-detail-warning">આ માત્ર વેબસાઇટનું ડિઝાઇન અને ફીચર બતાવવા માટેના ડેમો નમૂનાઓ છે. આ વાસ્તવિક ઉપલબ્ધ પ્રોપર્ટી કે માલિકની પુષ્ટિ કરેલી જાહેરાત નથી. વાસ્તવિક લિસ્ટિંગ માલિકની મંજૂરી પછી જ બતાવાશે.</div></div></div>';
  window.scrollTo(0,0);
 }
 const params=new URLSearchParams(location.search),sample=params.get('demo-property');
 if(sample){const p=samples.find(x=>x.id===sample);if(p){detail(p);return}}
 function card(p,i){return '<article class="mg-demo-card" data-demo-id="'+p.id+'"><div class="mg-demo-photo"><img src="'+esc(p.photos[0])+'" alt="'+esc(p.title)+'" loading="lazy"><span class="mg-demo-tag">ડેમો નમૂનો</span><div class="mg-demo-controls"><button type="button" data-demo-pause aria-label="ફોટા રોકો">Ⅱ</button><button type="button" data-demo-next aria-label="આગળનો ફોટો">›</button></div><span class="mg-demo-counter">1 / '+p.photos.length+'</span></div><div class="mg-demo-body"><h3>'+esc(p.title)+'</h3><div class="mg-demo-location">📍 '+esc(p.area)+', '+esc(p.city)+'</div><div class="mg-demo-price">'+esc(p.price)+'</div><div class="mg-demo-spec">'+esc(p.bhk)+' · '+esc(p.size)+' · '+esc(p.purpose)+'</div><button class="mg-demo-open" type="button" data-demo-open="'+p.id+'">સંપૂર્ણ વિગત જુઓ →</button></div></article>'}
 function init(){
  const listing=document.getElementById('listings');if(!listing||document.getElementById('mgDemoShowcase'))return;
  const section=document.createElement('section');section.id='mgDemoShowcase';section.innerHTML='<div class="mg-demo-head"><h2>પસંદગીની પ્રોપર્ટી — ડેમો</h2><span class="mg-demo-note">ફક્ત નમૂના · વાસ્તવિક લિસ્ટિંગ નથી</span></div><div class="mg-demo-grid">'+samples.map(card).join('')+'</div>';
  listing.parentNode.insertBefore(section,listing);
  const timers=new Map(),indices=new Map(),paused=new Set();
  function show(card,idx){const p=samples.find(x=>x.id===card.dataset.demoId);idx=(idx+p.photos.length)%p.photos.length;indices.set(p.id,idx);const im=card.querySelector('img');im.style.opacity='.25';const next=new Image();next.onload=()=>{im.src=next.src;im.style.opacity='1'};next.onerror=()=>im.style.opacity='1';next.src=p.photos[idx];card.querySelector('.mg-demo-counter').textContent=(idx+1)+' / '+p.photos.length;}
  section.querySelectorAll('.mg-demo-card').forEach(card=>{const id=card.dataset.demoId;timers.set(id,setInterval(()=>{if(!paused.has(id)&&!document.hidden)show(card,(indices.get(id)||0)+1)},4500));});
  section.addEventListener('click',e=>{const card=e.target.closest('.mg-demo-card');if(!card)return;const id=card.dataset.demoId;
   if(e.target.closest('[data-demo-pause]')){const b=e.target.closest('button');if(paused.has(id)){paused.delete(id);b.textContent='Ⅱ';b.setAttribute('aria-label','ફોટા રોકો')}else{paused.add(id);b.textContent='▶';b.setAttribute('aria-label','ફોટા ચાલુ કરો')}return}
   if(e.target.closest('[data-demo-next]')){show(card,(indices.get(id)||0)+1);return}
   const open=e.target.closest('[data-demo-open]');if(open){location.href='index.html?demo-property='+encodeURIComponent(id);return}
  });
  window.addEventListener('pagehide',()=>timers.forEach(clearInterval),{once:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();