/* Maru Ghar — clearly labelled demo showcase, auto photo carousel and full-page details. */
(function(){
 'use strict';
 const samples=[
 {id:'sample-gandhinagar-3bhk',title:'આધુનિક 3 BHK પરિવારનું ઘર',type:'ફ્લેટ',purpose:'ભાડે',city:'ગાંધીનગર',area:'સેક્ટર 21',price:'₹22,000 મહિનો',deposit:'₹44,000',bhk:'3 BHK',size:'1,450 ચો.ફૂટ',floor:'5મો માળ',furn:'સેમી ફર્નિશ્ડ',parking:'કાર પાર્કિંગ',facing:'પૂર્વમુખી',amenities:['લિફ્ટ','24 કલાક પાણી','સિક્યુરિટી','બાલ્કની','પાવર બેકઅપ'],desc:'પરિવાર માટે અનુકૂળ, હવા-ઉજાસવાળું ઘર. નજીકમાં શાળા, બજાર અને જાહેર પરિવહન.',photos:['https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg','https://www.indiaartndesign.com/wp-content/uploads/2022/09/Vadodara-Mansion-Design-Studio-Associates-indiaartndesign.jpg','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&h=900&q=88']},
 {id:'sample-ahmedabad-villa',title:'પ્રીમિયમ 4 BHK વિલા',type:'ઘર',purpose:'વેચાણ',city:'અમદાવાદ',area:'થલતેજ',price:'₹2.15 કરોડ',deposit:'લાગુ પડતું નથી',bhk:'4 BHK',size:'2,650 ચો.ફૂટ',floor:'2 માળ',furn:'અનફર્નિશ્ડ',parking:'2 કાર પાર્કિંગ',facing:'ઉત્તરમુખી',amenities:['પ્રાઇવેટ ગાર્ડન','મોડ્યુલર કિચન','ટેરેસ','CCTV','ક્લબહાઉસ'],desc:'મોટા પરિવાર માટે વિશાળ વિલા. શાંત રહેણાંક વિસ્તાર, ગાર્ડન અને બે કાર પાર્કિંગની સુવિધા.',photos:['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&h=900&q=88','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg']},
 {id:'sample-kalol-2bhk',title:'સુંદર 2 BHK ફ્લેટ',type:'ફ્લેટ',purpose:'ભાડે',city:'કલોલ',area:'નવા કલોલ વિસ્તાર',price:'₹12,500 મહિનો',deposit:'₹25,000',bhk:'2 BHK',size:'1,050 ચો.ફૂટ',floor:'3જો માળ',furn:'અનફર્નિશ્ડ',parking:'બાઈક પાર્કિંગ',facing:'પશ્ચિમમુખી',amenities:['લિફ્ટ','પાણી','બાલ્કની','ગાર્ડન','સુરક્ષા'],desc:'નાના પરિવાર માટે યોગ્ય 2 BHK. બજાર અને રોજિંદી જરૂરિયાતની દુકાનો નજીક.',photos:['https://www.indiaartndesign.com/wp-content/uploads/2022/09/Vadodara-Mansion-Design-Studio-Associates-indiaartndesign.jpg','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&h=900&q=88','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&h=900&q=88']},
 {id:'sample-gandhinagar-plot',title:'રહેણાંક પ્લોટ — સારો લોકેશન',type:'રેસિડેન્શિયલ પ્લોટ',purpose:'વેચાણ',city:'ગાંધીનગર',area:'સેક્ટર 26 નજીક',price:'₹48 લાખ',deposit:'લાગુ પડતું નથી',bhk:'NA',size:'150 ચો.વાર',floor:'NA',furn:'NA',parking:'NA',facing:'રોડ ફેસિંગ',amenities:['રહેણાંક ઝોન','રોડ કનેક્ટિવિટી','વીજળી','પાણીની લાઇન'],desc:'ઘર બાંધવા માટેનો રહેણાંક પ્લોટ. ખરીદી પહેલાં ઝોનિંગ, ટાઇટલ અને મંજૂરીના દસ્તાવેજોની સ્વતંત્ર તપાસ કરવી.',photos:['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&h=900&q=88','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg','https://www.indiaartndesign.com/wp-content/uploads/2022/09/Vadodara-Mansion-Design-Studio-Associates-indiaartndesign.jpg']},
 {id:'sample-ahmedabad-shop',title:'મેઇન રોડ પર કોમર્શિયલ દુકાન',type:'દુકાન',purpose:'ભાડે',city:'અમદાવાદ',area:'બોપલ',price:'₹28,000 મહિનો',deposit:'₹84,000',bhk:'NA',size:'520 ચો.ફૂટ',floor:'ગ્રાઉન્ડ ફ્લોર',furn:'અનફર્નિશ્ડ',parking:'ગ્રાહક પાર્કિંગ',facing:'મેઇન રોડ ફેસિંગ',amenities:['ગ્રાઉન્ડ ફ્લોર','શેતરંજ શટર','પાણી','ટોઇલેટ','વિઝિબિલિટી'],desc:'રિટેલ અથવા સર્વિસ બિઝનેસ માટે નમૂનાની દુકાન. ભાડું અને દુકાનની શરતો માલિક સાથે ચકાસવાની રહેશે.',photos:['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&h=900&q=88','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg']}
 ,
 {id:'sample-gandhinagar-2bhk-sale',title:'2 BHK તૈયાર ફ્લેટ',type:'ફ્લેટ',purpose:'વેચાણ',city:'ગાંધીનગર',area:'કુડાસણ',price:'₹62 લાખ',deposit:'લાગુ પડતું નથી',bhk:'2 BHK',size:'1,180 ચો.ફૂટ',floor:'4થો માળ',furn:'સેમી ફર્નિશ્ડ',parking:'કાર પાર્કિંગ',facing:'પૂર્વમુખી',amenities:['લિફ્ટ','CCTV','બાલ્કની','પાવર બેકઅપ'],desc:'કુડાસણ વિસ્તારમાં 2 BHK ફ્લેટનું ડેમો ઉદાહરણ. કિંમત અને ઉપલબ્ધતા વાસ્તવિક નથી; માત્ર એપનું પ્રદર્શન કરવા માટે.',photos:['https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&h=900&q=88','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg']},
 {id:'sample-sargasan-house-rent',title:'3 BHK વિશાળ પરિવારનું મકાન',type:'ઘર',purpose:'ભાડે',city:'ગાંધીનગર',area:'સરગાસણ',price:'₹25,000 મહિનો',deposit:'₹50,000',bhk:'3 BHK',size:'1,700 ચો.ફૂટ',floor:'ડુપ્લેક્સ',furn:'અનફર્નિશ્ડ',parking:'2 કાર પાર્કિંગ',facing:'ઉત્તરમુખી',amenities:['નાનું ગાર્ડન','મોડ્યુલર કિચન','પાણી','સુરક્ષા'],desc:'સરગાસણ વિસ્તારમાં પરિવારના મકાનનું ડેમો ઉદાહરણ. આ વાસ્તવિક ભાડાની ઓફર નથી.',photos:['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&h=900&q=88','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&h=900&q=88']},
 {id:'sample-ahmedabad-office',title:'આધુનિક કોમર્શિયલ ઓફિસ',type:'ઓફિસ',purpose:'ભાડે',city:'અમદાવાદ',area:'એસ.જી. હાઇવે',price:'₹35,000 મહિનો',deposit:'₹1,05,000',bhk:'NA',size:'900 ચો.ફૂટ',floor:'6ઠ્ઠો માળ',furn:'ફર્નિશ્ડ',parking:'2 કાર પાર્કિંગ',facing:'રોડ ફેસિંગ',amenities:['લિફ્ટ','રિસેપ્શન','કોન્ફરન્સ રૂમ','સેન્ટ્રલ AC'],desc:'ઓફિસ સ્પેસનું ડેમો ઉદાહરણ. ફોટા અને ભાડું નમૂનાના છે, વાસ્તવિક જાહેરાત નથી.',photos:['https://www.indiaartndesign.com/wp-content/uploads/2022/09/Vadodara-Mansion-Design-Studio-Associates-indiaartndesign.jpg','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&h=900&q=88','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&h=900&q=88']},
 {id:'sample-kalol-commercial-plot',title:'કોમર્શિયલ પ્લોટ',type:'કોમર્શિયલ પ્લોટ',purpose:'વેચાણ',city:'કલોલ',area:'હાઇવે નજીક',price:'₹75 લાખ',deposit:'લાગુ પડતું નથી',bhk:'NA',size:'220 ચો.વાર',floor:'NA',furn:'NA',parking:'NA',facing:'હાઇવે ફેસિંગ',amenities:['રોડ કનેક્ટિવિટી','વીજળી નજીક','કોમર્શિયલ ઝોન'],desc:'કોમર્શિયલ પ્લોટનું ડેમો ઉદાહરણ. ખરીદી પહેલાં ઝોનિંગ અને કાનૂની દસ્તાવેજો તપાસવા.',photos:['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&h=900&q=88','https://www.indiaartndesign.com/wp-content/uploads/2022/09/Vadodara-Mansion-Design-Studio-Associates-indiaartndesign.jpg','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg']},
 {id:'sample-vavol-shop-sale',title:'રોડ ટચ દુકાન',type:'દુકાન',purpose:'વેચાણ',city:'ગાંધીનગર',area:'વાવોલ',price:'₹42 લાખ',deposit:'લાગુ પડતું નથી',bhk:'NA',size:'430 ચો.ફૂટ',floor:'ગ્રાઉન્ડ ફ્લોર',furn:'અનફર્નિશ્ડ',parking:'ગ્રાહક પાર્કિંગ',facing:'રોડ ફેસિંગ',amenities:['ગ્રાઉન્ડ ફ્લોર','રોલિંગ શટર','પાણી','મેઇન રોડ'],desc:'વાવોલ વિસ્તારમાં દુકાનનું ડેમો ઉદાહરણ. આ વાસ્તવિક વેચાણ લિસ્ટિંગ નથી.',photos:['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&h=900&q=88','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg','https://assets.architecturaldigest.in/photos/600843cfcce5700439e126cd/16:9/w_2560,c_limit/Ahmedabad-home-interior-design-home-decor-photos-1366x768.jpg']}

 ];
 /* Local category photos: demo cards and the detail gallery load from assets/images, so the showcase works offline. */
 const LOCAL_PHOTOS={
  'ઘર':['assets/images/house.jpg','assets/images/bungalow.jpg','assets/images/house.jpg'],
  'બંગલો':['assets/images/bungalow.jpg','assets/images/house.jpg','assets/images/bungalow.jpg'],
  'ફ્લેટ':['assets/images/flat.jpg','assets/images/flat.jpg','assets/images/house.jpg'],
  'દુકાન':['assets/images/shop.jpg','assets/images/commercial.jpg','assets/images/shop.jpg'],
  'ઓફિસ':['assets/images/office.jpg','assets/images/commercial.jpg','assets/images/office.jpg'],
  'રેસિડેન્શિયલ પ્લોટ':['assets/images/plot.jpg','assets/images/plot.jpg','assets/images/house.jpg'],
  'કોમર્શિયલ પ્લોટ':['assets/images/plot.jpg','assets/images/commercial.jpg','assets/images/plot.jpg'],
  'કોમર્શિયલ પ્રોપર્ટી':['assets/images/commercial.jpg','assets/images/shop.jpg','assets/images/office.jpg']
 };
 samples.forEach(p=>{const local=LOCAL_PHOTOS[p.type];if(local&&local.length)p.photos=local.slice();});
 /* Admin-managed soft deletion: public visitors receive the same shared Firestore setting. */
 let demoConfigReady=Promise.resolve();
 demoConfigReady=(async()=>{try{
  if(location.protocol==='file:'||location.protocol==='content:')return;
  const [{firebaseConfig},{initializeApp,getApps,getApp}]=await Promise.all([
   import('../firebase-config.js'),
   import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js')
  ]);
  const [{getFirestore,doc,getDoc}]=await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
  const app=getApps().length?getApp():initializeApp(firebaseConfig);
  const snap=await getDoc(doc(getFirestore(app),'settings','demoShowcase'));
  const hidden=snap.exists()&&Array.isArray(snap.data().hiddenIds)?snap.data().hiddenIds:[];
  if(hidden.length)for(let i=samples.length-1;i>=0;i--)if(hidden.includes(samples[i].id))samples.splice(i,1);
 }catch(e){console.warn('Demo visibility settings unavailable; showing built-in demo samples.',e)}})();

 const css=`
 #mgDemoShowcase{margin:22px 0 28px;padding:18px;border:1px solid #d8c58d;border-radius:20px;background:linear-gradient(145deg,#fffdf7,#edf2ed);box-shadow:0 8px 24px #203b2c12}
 #mgDemoShowcase .mg-demo-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
 #mgDemoShowcase h2{margin:0;color:#173d32;font-size:clamp(20px,3vw,27px)}
 #mgDemoShowcase .mg-demo-note{font-size:12px;color:#795d25;font-weight:800}
 #mgDemoShowcase .mg-demo-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:15px}
 #mgDemoShowcase .mg-demo-card{min-width:0;overflow:hidden;border:1px solid #d8d8c9;border-radius:16px;background:#fff;box-shadow:0 4px 13px #203b2c12} #mgDemoShowcase .mg-demo-card{container-type:inline-size}
 #mgDemoShowcase .mg-demo-photo{position:relative;height:190px;overflow:hidden;background:#e7ece7;touch-action:pan-y pinch-zoom;user-select:none}
 #mgDemoShowcase .mg-demo-photo img{width:100%;height:100%;display:block;object-fit:contain;background:#e7ece7;transition:opacity .3s ease}
  #mgDemoShowcase .mg-demo-photo-unavailable{display:grid;place-items:center;background:radial-gradient(ellipse at 75% 25%,#d9c17c55,transparent 42%),linear-gradient(145deg,#17483b,#0a2925)!important}
  #mgDemoShowcase .mg-demo-photo-unavailable:after{content:'⌂';color:#f2d995;font-size:92px;font-weight:900;text-shadow:0 5px 18px #0005}
 #mgDemoShowcase .mg-family-feature{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(220px,.75fr);gap:18px;align-items:center;margin:8px 0 18px;padding:12px;border:1px solid #d8c58d;border-radius:16px;background:linear-gradient(145deg,#fffdf7,#edf2ed)}
 #mgDemoShowcase .mg-family-feature img{display:block;width:100%;height:auto;max-height:330px;object-fit:contain;background:#e7ece7;border-radius:12px}
 #mgDemoShowcase .mg-family-copy h3{margin:0 0 8px;color:#173d32;font-size:clamp(18px,2.5vw,24px)}
 #mgDemoShowcase .mg-family-copy p{margin:0;color:#59675f;line-height:1.7;font-size:14px}
 #mgDemoShowcase .mg-family-copy small{display:block;margin-top:9px;color:#7b806f;font-size:11px}
 #mgDemoShowcase .mg-family-copy a{color:#795d25;text-decoration:underline}
 #properties .property .photo{background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;background-color:#102c32!important}
 #properties .property .photo img{object-fit:contain!important;background:#102c32!important}
 .photo.mg-slider .mg-slide{background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;background-color:#0d1a1f!important}
 .photo.mg-slider .mg-slide img{width:100%!important;height:100%!important;object-fit:contain!important;background:#0d1a1f!important}
 .mgm-gal img{object-fit:contain!important;background:#102c32!important}
 #mgDemoDetail .mg-detail-gallery img{object-fit:contain!important;background:#e7ece7!important}
 #mgDemoShowcase .mg-demo-photo .mg-demo-tag{position:absolute;left:10px;top:10px;padding:5px 9px;border-radius:20px;background:#fff5d7;color:#664b17;font-size:11px;font-weight:900}
 #mgDemoShowcase .mg-demo-photo .mg-demo-counter{position:absolute;right:10px;bottom:10px;padding:4px 8px;border-radius:20px;background:#102a23cc;color:white;font-size:11px}
 #mgDemoShowcase .mg-demo-controls{display:none!important} #mgDemoShowcase .mg-demo-controls button{display:none!important;position:absolute;pointer-events:auto;width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #b28b3f;border-radius:50%;background:linear-gradient(145deg,#fff6d5 0%,#e5c76f 58%,#c3cfc5 100%);color:#173d32;font-size:17px;font-weight:950;box-shadow:0 3px 0 #89692c,0 5px 9px #203b2c30,inset 0 1px 2px #fff;cursor:pointer;transition:filter .15s,box-shadow .15s} #mgDemoShowcase .mg-demo-controls [data-demo-pause]{top:9px;right:9px;width:29px;height:29px;font-size:13px} #mgDemoShowcase .mg-demo-controls [data-demo-prev]{left:9px;top:50%;transform:translateY(-50%)} #mgDemoShowcase .mg-demo-controls [data-demo-next]{right:9px;top:50%;transform:translateY(-50%)} #mgDemoShowcase .mg-demo-controls button:hover{filter:brightness(1.06);box-shadow:0 4px 0 #89692c,0 6px 11px #203b2c30,inset 0 1px 2px #fff} #mgDemoShowcase .mg-demo-controls button:active{filter:brightness(.97);box-shadow:0 1px 0 #89692c,0 2px 5px #203b2c25,inset 0 1px 2px #0001}
 #mgDemoShowcase .mg-demo-controls button{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #b28b3f;border-radius:50%;background:linear-gradient(145deg,#fff6d5 0%,#e5c76f 58%,#c3cfc5 100%);color:#173d32;font-size:15px;font-weight:950;box-shadow:0 3px 0 #89692c,0 5px 9px #203b2c30,inset 0 1px 2px #fff;cursor:pointer;transition:transform .15s,box-shadow .15s,filter .15s}
 #mgDemoShowcase .mg-demo-controls button:hover{transform:translateY(-2px);filter:brightness(1.04);box-shadow:0 5px 0 #89692c,0 7px 12px #203b2c30,inset 0 1px 2px #fff}
 #mgDemoShowcase .mg-demo-controls button:active{transform:translateY(2px);box-shadow:0 1px 0 #89692c,0 2px 5px #203b2c25,inset 0 1px 2px #0001}
 #mgDemoShowcase .mg-demo-open{cursor:pointer;transition:transform .15s,box-shadow .15s,filter .15s}
 #mgDemoShowcase .mg-demo-open:hover{transform:translateY(-2px);filter:brightness(1.045);box-shadow:0 5px 0 #89692c,0 8px 14px #203b2c25,inset 0 1px 2px #fff}
 #mgDemoShowcase .mg-demo-open:active{transform:translateY(2px);box-shadow:0 1px 0 #89692c,0 2px 5px #203b2c25,inset 0 1px 2px #0001}
 #mgDemoDetail .mg-detail-top a{display:inline-flex;align-items:center;justify-content:center;padding:9px 13px;border:1px solid #d4b45e;border-radius:11px;background:linear-gradient(145deg,#fff4c8,#dfc16b 58%,#bfcac1);color:#173d32;text-decoration:none;font-weight:950;box-shadow:0 3px 0 #89692c,0 5px 10px #0002,inset 0 1px 2px #fff;transition:transform .15s,box-shadow .15s}
 #mgDemoDetail .mg-detail-top a:hover{transform:translateY(-2px);box-shadow:0 5px 0 #89692c,0 7px 12px #0002,inset 0 1px 2px #fff}
 #mgDemoDetail .mg-detail-top a:active{transform:translateY(2px);box-shadow:0 1px 0 #89692c,0 2px 5px #0002,inset 0 1px 2px #0001}
 #mgDemoShowcase .mg-demo-body{padding:13px}
 #mgDemoShowcase .mg-demo-body h3{margin:0 0 7px;color:#203b31;font-size:16px;line-height:1.35}
 #mgDemoShowcase .mg-demo-location{color:#68766e;font-size:12px;margin-bottom:8px}
 #mgDemoShowcase .mg-demo-price{display:block!important;box-sizing:border-box;width:100%;max-width:100%;min-width:0;min-height:22px;color:#a27b25;font-size:16px!important;font-weight:900;margin:8px 0;white-space:nowrap!important;word-break:keep-all!important;overflow-wrap:normal!important;line-height:1.35;letter-spacing:-.55px;overflow:visible;text-overflow:clip} #mgDemoShowcase .mg-demo-price span{display:inline-block;max-width:none;white-space:nowrap!important;word-break:keep-all!important;overflow-wrap:normal!important;line-height:1.35;transform-origin:left center} #mgDemoDetail .mg-detail-price{display:inline-block;white-space:nowrap!important;word-break:keep-all;overflow-wrap:normal;line-height:1.35;font-size:clamp(18px,5vw,25px)}
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
 @media(max-width:650px){#mgDemoShowcase{padding:12px}#mgDemoShowcase .mg-demo-grid{grid-template-columns:1fr}#mgDemoShowcase .mg-demo-photo{height:220px}#mgDemoShowcase .mg-family-feature{grid-template-columns:1fr;padding:9px}#mgDemoShowcase .mg-family-feature img{max-height:260px}#mgDemoDetail .mg-detail-gallery{height:260px;grid-template-columns:1fr}#mgDemoDetail .mg-detail-gallery .mg-detail-side{display:none}#mgDemoDetail .mg-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}

 /* Live Firestore properties: align cards with the demo showcase while retaining existing controls. */
 #properties .property{overflow:hidden;border:1px solid #c9ad65!important;border-radius:17px!important;background:linear-gradient(145deg,#123b31,#0b2b25)!important;box-shadow:0 5px 0 #071c17,0 10px 22px #0004,inset 0 1px 1px #ffffff20!important}
 #properties .property .photo{height:220px;min-height:180px;overflow:hidden}
 #properties .property .property-body{padding:14px 15px 10px!important}
 #properties .property .property-body h3{font-size:17px!important;line-height:1.4;color:#fff0c0!important}
 #properties .property .loc{font-size:12px!important;line-height:1.6}
 #properties .property .price{font-size:20px!important;font-weight:950;color:#ffdf7b!important}
 #properties .property .details span{display:inline-block;margin:3px 4px 3px 0;padding:5px 8px;border:1px solid #c6b16c55;border-radius:20px;background:#ffffff0b;color:#e9e2c7;font-size:11px}
 #properties .property .property-foot{padding:0 14px 10px!important}
 #properties .property .property-foot .btn{width:100%;border:1px solid #b28b3f!important;border-radius:11px!important;background:linear-gradient(145deg,#fff4c8 0%,#e4c56d 56%,#bdc9c1 100%)!important;color:#173d32!important;font-weight:950!important;box-shadow:0 4px 0 #89692c,0 7px 12px #0003,inset 0 1px 2px #fff!important}
 #properties .property .mg-tools{padding:0 12px 14px!important;gap:7px!important}
 #properties .property .mg-tools button{min-height:38px;border:1px solid #b28b3f!important;border-radius:10px!important;background:linear-gradient(145deg,#fff4c8 0%,#e4c56d 56%,#bdc9c1 100%)!important;color:#173d32!important;font-weight:950!important;box-shadow:0 3px 0 #89692c,0 5px 9px #0003,inset 0 1px 2px #fff!important;transition:transform .15s,box-shadow .15s,filter .15s}
 #properties .property .mg-tools button:nth-child(even){background:linear-gradient(145deg,#ffffff 0%,#dce2df 58%,#aebbb7 100%)!important;border-color:#879b94!important;box-shadow:0 3px 0 #71827b,0 5px 9px #0003,inset 0 1px 2px #fff!important}
 #properties .property .mg-tools button:hover{transform:translateY(-2px);filter:brightness(1.04)}
 #properties .property .mg-tools button:active{transform:translateY(2px);box-shadow:0 1px 0 #89692c,0 2px 5px #0003!important}
 #properties .property .mg-nav{border:1px solid #b28b3f;background:linear-gradient(145deg,#fff4c8,#dfc16b 58%,#bfcac1);color:#173d32;box-shadow:0 3px 0 #89692c,0 5px 10px #0003}
 /* Full-screen real-property detail view, matching the demo detail-page layout. */
 .mgm{align-items:stretch!important;background:#f6f5ef!important;overflow:auto!important}
 .mgm-box{width:100%!important;max-width:1100px!important;height:100dvh!important;max-height:100dvh!important;margin:0 auto!important;overflow:auto!important;border:0!important;border-radius:0!important;padding:16px max(16px,calc((100vw - 1068px)/2)) calc(28px + env(safe-area-inset-bottom,0px))!important;background:#f6f5ef!important;color:#203b31!important;box-shadow:none!important}
 .mgm-x{position:sticky!important;top:8px!important;float:right!important;width:42px!important;height:42px!important;border:1px solid #b28b3f!important;background:linear-gradient(145deg,#fff4c8,#dfc16b 58%,#bfcac1)!important;color:#173d32!important;font-weight:950!important;box-shadow:0 3px 0 #89692c,0 5px 10px #0002,inset 0 1px 2px #fff!important}
 .mgm-box h3{color:#173d32!important;font-size:clamp(21px,3vw,30px)!important;line-height:1.35}
 .mgm-box .loc{color:#64736a!important;font-size:14px!important}
 .mgm-price{color:#9c7523!important;font-size:27px!important;font-weight:950!important}
 .mgm-gal{display:flex!important;gap:9px!important;margin:12px 0 18px!important;padding-bottom:4px!important}
 .mgm-gal img{height:clamp(190px,32vw,340px)!important;max-width:88%!important;border:1px solid #d4c38f!important;border-radius:14px!important;box-shadow:0 5px 15px #203b2c18}
 .mgm-spec{gap:10px!important;margin:16px 0 20px!important}
 .mgm-spec div{padding:12px!important;border:1px solid #ded8c5!important;border-radius:12px!important;background:#fff!important;color:#203b31!important;line-height:1.55}
 .mgm-spec b{color:#9b762d!important;font-size:12px!important;margin-bottom:4px}
 .mgm-act{gap:10px!important;margin:18px 0 8px!important}
 .mgm-act a,.mgm-act button{min-height:44px!important;flex:1 1 145px!important;border:1px solid #b28b3f!important;border-radius:11px!important;padding:11px 12px!important;background:linear-gradient(145deg,#fff4c8 0%,#e4c56d 56%,#bdc9c1 100%)!important;color:#173d32!important;font-weight:950!important;box-shadow:0 4px 0 #89692c,0 6px 11px #0002,inset 0 1px 2px #fff!important;transition:transform .15s,box-shadow .15s,filter .15s}
 .mgm-act a:nth-child(even),.mgm-act button:nth-child(even),.mgm-act .alt{background:linear-gradient(145deg,#fff 0%,#dce2df 58%,#aebbb7 100%)!important;border-color:#879b94!important;box-shadow:0 4px 0 #71827b,0 6px 11px #0002,inset 0 1px 2px #fff!important;color:#203b31!important}
 .mgm-act a:hover,.mgm-act button:hover{transform:translateY(-2px);filter:brightness(1.03)}
 .mgm-act a:active,.mgm-act button:active{transform:translateY(2px);box-shadow:0 1px 0 #89692c,0 2px 5px #0002!important}
 .mgm-box p{color:#45564d!important;line-height:1.8!important}
 @media(max-width:650px){#properties .property .photo{height:215px}.mgm-box{padding:12px 13px calc(24px + env(safe-area-inset-bottom,0px))!important}.mgm-gal img{height:225px!important;max-width:88%!important}.mgm-act a,.mgm-act button{flex-basis:calc(50% - 8px)!important;font-size:13px!important;padding:10px 7px!important}}
 @media(prefers-reduced-motion:reduce){#mgDemoShowcase img{transition:none}}
 `;
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function detail(p){
  document.body.innerHTML='<div id="mgDemoDetail"><div class="mg-detail-top"><a href="index.html#listings">← મારું ઘર પર પાછા જાઓ</a><b>નમૂનાની પ્રોપર્ટી વિગત</b></div><div class="mg-detail-wrap"><div class="mg-detail-gallery"><img src="'+esc(p.photos[0])+'" alt="'+esc(p.title)+'">'+
  '<div class="mg-detail-side"><img src="'+esc(p.photos[1])+'" alt="અંદરનો ફોટો"><img src="'+esc(p.photos[2])+'" alt="વધુ ફોટો"></div></div><h1 class="mg-detail-title">'+esc(p.title)+'</h1><div>📍 '+esc(p.area)+', '+esc(p.city)+', ગુજરાત</div><div class="mg-detail-price">'+esc(p.price)+'</div><div class="mg-detail-grid">'+[['પ્રોપર્ટીનો પ્રકાર',p.type],['હેતુ',p.purpose],['BHK',p.bhk],['વિસ્તાર',p.size],['માળ',p.floor],['ફર્નિચર',p.furn],['ડિપોઝિટ',p.deposit],['પાર્કિંગ',p.parking],['મુખ',p.facing]].map(x=>'<div class="mg-detail-cell"><small>'+esc(x[0])+'</small><b>'+esc(x[1])+'</b></div>').join('')+'</div><h3>સુવિધાઓ</h3><div class="mg-detail-amenities">'+p.amenities.map(x=>'<span>✓ '+esc(x)+'</span>').join('')+'</div><h3>પ્રોપર્ટીની વિગત</h3><p style="line-height:1.8">'+esc(p.desc)+'</p><div class="mg-detail-warning">આ માત્ર વેબસાઇટનું ડિઝાઇન અને ફીચર બતાવવા માટેના ડેમો નમૂનાઓ છે. આ વાસ્તવિક ઉપલબ્ધ પ્રોપર્ટી કે માલિકની પુષ્ટિ કરેલી જાહેરાત નથી. વાસ્તવિક લિસ્ટિંગ માલિકની મંજૂરી પછી જ બતાવાશે.</div></div></div>';
  document.querySelectorAll('#mgDemoDetail img').forEach(img=>{img.loading='eager';img.onerror=()=>{img.onerror=null;img.src='assets/maru-ghar-approved-app-icon.png';img.style.objectFit='contain';img.style.background='#e7ece7';};});
  window.scrollTo(0,0);
 }
 const params=new URLSearchParams(location.search),sample=params.get('demo-property');
 if(sample){const p=samples.find(x=>x.id===sample);if(p){detail(p);return}}
 function card(p,i){return '<article class="mg-demo-card" data-demo-id="'+p.id+'"><div class="mg-demo-photo"><img src="'+esc(p.photos[0])+'" alt="'+esc(p.title)+'" loading="lazy"><span class="mg-demo-tag">ડેમો નમૂનો</span><span class="mg-demo-counter">1 / '+p.photos.length+'</span></div><div class="mg-demo-body"><h3>'+esc(p.title)+'</h3><div class="mg-demo-location">📍 '+esc(p.area)+', '+esc(p.city)+'</div><div class="mg-demo-price"><span>'+esc(p.price)+'</span></div><div class="mg-demo-spec">'+esc(p.bhk)+' · '+esc(p.size)+' · '+esc(p.purpose)+'</div><button class="mg-demo-open" type="button" data-demo-open="'+p.id+'">સંપૂર્ણ વિગત જુઓ →</button></div></article>'}
 async function init(){
  await demoConfigReady;
  const listing=document.getElementById('listings');if(!listing)return;
  const existing=document.getElementById('mgDemoShowcase');
  if(existing){const grid=existing.querySelector('.mg-demo-grid');existing.querySelectorAll('.mg-family-feature').forEach(node=>node.remove());if(grid&&grid.children.length===samples.length)return;existing.remove();}
  const section=document.createElement('section');section.id='mgDemoShowcase';section.innerHTML='<div class="mg-demo-head"><h2>પસંદગીની પ્રોપર્ટી — ડેમો</h2><span class="mg-demo-note">કુલ '+samples.length+' ડેમો નમૂનાઓ · ફક્ત પ્રદર્શન માટે, વાસ્તવિક લિસ્ટિંગ નથી</span></div><div class="mg-demo-grid">'+samples.map(card).join('')+'</div>'
  listing.parentNode.insertBefore(section,listing);
  section.querySelectorAll('.mg-demo-photo img').forEach(img=>{img.onerror=()=>{img.onerror=null;img.style.display='none';const frame=img.closest('.mg-demo-photo');if(frame){frame.classList.add('mg-demo-photo-unavailable');frame.setAttribute('aria-label','પ્રોપર્ટીનો ફોટો હાલમાં ઉપલબ્ધ નથી');}};});
  /* Normalize each demo card to exactly one visible price label if an older page instance left duplicates. */ section.querySelectorAll('.mg-demo-card').forEach(card=>{const prices=card.querySelectorAll('.mg-demo-price');prices.forEach((node,i)=>{if(i>0)node.remove();});});
  const timers=new Map(),indices=new Map(),paused=new Set(),visibleCards=new Set();
  /* Do not download rotating photos for cards the visitor has not scrolled to. */
  const visibilityObserver=('IntersectionObserver' in window)?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)visibleCards.add(entry.target);else visibleCards.delete(entry.target)}),{rootMargin:'120px'}):null;
  function show(card,idx){const p=samples.find(x=>x.id===card.dataset.demoId);idx=(idx+p.photos.length)%p.photos.length;indices.set(p.id,idx);const im=card.querySelector('img');im.style.opacity='.25';const next=new Image();next.decoding='async';next.onload=()=>{im.src=next.src;im.style.opacity='1'};next.onerror=()=>im.style.opacity='1';next.src=p.photos[idx];card.querySelector('.mg-demo-counter').textContent=(idx+1)+' / '+p.photos.length;}
  section.querySelectorAll('.mg-demo-card').forEach(card=>{const id=card.dataset.demoId;if(visibilityObserver)visibilityObserver.observe(card);else visibleCards.add(card);timers.set(id,setInterval(()=>{if(visibleCards.has(card)&&!paused.has(id)&&!document.hidden)show(card,(indices.get(id)||0)+1)},6500));});
  /* Swipe gestures are owned by assets/maru-ghar-swipe.js (pointer capture +
     direction lock + touchcancel recovery) and reported here as an mg-swipe event. */
  section.querySelectorAll('.mg-demo-photo').forEach(photo=>{
   photo.addEventListener('mg-swipe',e=>{const card=photo.closest('.mg-demo-card');if(!card)return;const id=card.dataset.demoId;const dir=(e.detail&&e.detail.direction===-1)?-1:1;show(card,(indices.get(id)||0)+dir);});
   /* Native touch fallback is used on phones; Pointer Events remain for mouse/trackpad. */
   let startX=null,startY=null,pointerId=null;
   const advance=(dx,dy)=>{
    if(window.__mgSwipeReady)return;
    const delta=Math.abs(dx)>=Math.abs(dy)?dx:dy;
    if(Math.abs(delta)>24){
     const card=photo.closest('.mg-demo-card'),id=card.dataset.demoId;
     paused.add(id);show(card,(indices.get(id)||0)+(delta<0?1:-1));
     setTimeout(()=>paused.delete(id),900);
    }
   };
   photo.addEventListener('touchstart',e=>{if(e.touches.length){startX=e.touches[0].clientX;startY=e.touches[0].clientY;}},{passive:true});
   photo.addEventListener('touchend',e=>{if(startX!==null&&e.changedTouches.length)advance(e.changedTouches[0].clientX-startX,e.changedTouches[0].clientY-startY);startX=null;startY=null;},{passive:true});
   photo.addEventListener('touchcancel',()=>{startX=null;startY=null},{passive:true});
   photo.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;startX=e.clientX;startY=e.clientY;pointerId=e.pointerId;try{photo.setPointerCapture(e.pointerId)}catch(_){}});
   photo.addEventListener('pointerup',e=>{if(pointerId===null||e.pointerId!==pointerId)return;advance(e.clientX-startX,e.clientY-startY);startX=null;startY=null;pointerId=null;});
   photo.addEventListener('pointercancel',()=>{startX=null;startY=null;pointerId=null});
   const img=photo.querySelector('img');if(img)img.draggable=false;
  });
  /* Measure actual rendered Gujarati text and shrink only as much as each card needs. */
  const fitPrice=el=>{const span=el.querySelector('span');if(!span)return;span.style.fontSize='16px';const available=Math.max(1,el.clientWidth);const natural=Math.max(1,span.scrollWidth);span.style.fontSize=Math.max(8,Math.min(16,16*available/natural))+'px';};
  const priceObserver=('ResizeObserver' in window)?new ResizeObserver(entries=>entries.forEach(entry=>fitPrice(entry.target))):null;
  section.querySelectorAll('.mg-demo-price').forEach(el=>{fitPrice(el);if(priceObserver)priceObserver.observe(el);});
  section.addEventListener('click',e=>{const open=e.target.closest('[data-demo-open]');if(open){location.href='index.html?demo-property='+encodeURIComponent(open.dataset.demoOpen);return}});

  window.addEventListener('pagehide',()=>timers.forEach(clearInterval),{once:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.addEventListener('pageshow',init);
 const rootObserver=new MutationObserver(()=>{if(!document.getElementById('mgDemoShowcase')&&document.getElementById('listings'))init()});
 rootObserver.observe(document.documentElement,{childList:true,subtree:true});
})();