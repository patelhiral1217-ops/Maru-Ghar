import fs from 'node:fs';
import vm from 'node:vm';

// Execute the actual shared dictionary and translation engine used by every page.
const home=fs.readFileSync('index.html','utf8');
const pages=['index.html','admin.html','privacy.html','download.html'];
for(const page of pages){
  const html=fs.readFileSync(page,'utf8');
  if(!html.includes('data-mg-i18n-inline="central"')||!html.includes('data-mg-i18n-inline="engine"'))throw new Error(`${page}: standalone inline language bundle missing`);
}
const handlers={};
const select={id:'mgLanguage',value:'gu',addEventListener:()=>{}};
const body={nodeType:1,querySelectorAll:()=>[],closest:()=>null,getAttribute:()=>null,setAttribute:()=>{}};
const document={body,documentElement:{lang:'gu'},readyState:'complete',getElementById:id=>id==='mgLanguage'?select:null,createTreeWalker:()=>({nextNode:()=>null}),addEventListener:(name,fn)=>{handlers[name]=fn}};
const window={addEventListener:()=>{},dispatchEvent:()=>{}};
const local={value:'gu'};
const languageContext={window,document,NodeFilter:{SHOW_TEXT:4},MutationObserver:class{observe(){}},localStorage:{getItem:()=>local.value,setItem:(k,v)=>{local.value=v}},setTimeout:fn=>fn(),Event:class{}};
vm.runInNewContext(fs.readFileSync('assets/maru-ghar-i18n.js','utf8'),languageContext);
vm.runInNewContext(fs.readFileSync('assets/maru-ghar-i18n-complete.js','utf8'),languageContext);
const cases=[['પ્રોપર્ટી જુઓ','View Properties','प्रॉपर्टी देखें'],['ગોપનીયતા નીતિ','Privacy Policy','गोपनीयता नीति'],['એડમિન લોગિન','Admin Login','एडमिन लॉगिन'],['🌐 વેબસાઇટ / એપ ખોલો','🌐 Open Website / App','🌐 वेबसाइट / ऐप खोलें']];
for(const [gu,en,hi] of cases){
  select.value='gu';handlers.change({target:select});
  if(window.mgI18nText(gu)!==gu)throw new Error(`Gujarati translation failed: ${gu}`);
  select.value='en';handlers.change({target:select});if(window.mgI18nText(gu)!==en)throw new Error(`English translation failed: ${gu} -> ${window.mgI18nText(gu)}`);
  if(document.documentElement.lang!=='en')throw new Error('English page language attribute did not update');
  select.value='hi';handlers.change({target:select});if(window.mgI18nText(gu)!==hi)throw new Error(`Hindi translation failed: ${gu} -> ${window.mgI18nText(gu)}`);
  if(document.documentElement.lang!=='hi')throw new Error('Hindi page language attribute did not update');
}
if(typeof window.mgAdminTranslate!=='function')throw new Error('Admin translation API missing');
select.value='en';handlers.change({target:select});
if(window.mgAdminTranslate('શહેર')!=='City')throw new Error('Admin export translation API failed');

// Exercise the real property-panel controller open/close behavior.
const title={textContent:''},hint={textContent:''},content={hidden:true,style:{}};
const attrs={};
const toggle={querySelector:s=>s.includes('title')?title:hint,setAttribute:(k,v)=>attrs[k]=v};
const section={classList:{toggle:()=>{}},scrollIntoView:()=>{}};
const elements={submit:section,propertyFormToggle:toggle,propertySubmitContent:content};
const formDocument={readyState:'complete',getElementById:id=>elements[id]||null,addEventListener:()=>{}};
const formWindow={addEventListener:()=>{}};
const formContext={window:formWindow,document:formDocument,location:{hash:''},requestAnimationFrame:fn=>fn()};
vm.runInNewContext(fs.readFileSync('assets/maru-ghar-submit-toggle.js','utf8'),formContext);
formWindow.mgTogglePropertyForm(true);
if(content.hidden||content.style.display!=='grid'||attrs['aria-expanded']!=='true')throw new Error('Property form did not open');
formWindow.mgTogglePropertyForm(false);
if(!content.hidden||content.style.display!=='none'||attrs['aria-expanded']!=='false')throw new Error('Property form did not close');

if(!home.includes('onclick="if(window.mgTogglePropertyForm)'))throw new Error('Inline open fallback missing');
if(!home.includes('MG_I18N_INLINE_BUNDLE_START')||!home.includes('MG_I18N_INLINE_BUNDLE_END'))throw new Error('Standalone inline language bundle markers missing');
const admin=fs.readFileSync('admin.html','utf8');
const rules=fs.readFileSync('firestore.rules','utf8');
const cmsAdmin=fs.readFileSync('assets/maru-ghar-content-admin.js','utf8');
const cmsPublic=fs.readFileSync('assets/maru-ghar-site-content.js','utf8');
for(const slot of ['home_top','home_mid','home_bottom','home_before_showcase','home_showcase','home_after_hero','home_before_listings','home_listings_heading','home_categories','home_filters','home_results','home_submit','home_account','home_footer','download_top','download_story','download_bottom'])if(!home.includes('data-mg-content-slot="'+slot+'"')&&!fs.readFileSync('download.html','utf8').includes('data-mg-content-slot="'+slot+'"'))throw new Error('Managed content slot missing: '+slot);
for(const id of ['mgSiteContentManager','mgCmsMedia','mgCmsPreviewBtn','mgCmsSaveBtn','mgCmsList','mgCmsTrashList','mgCmsRemoveMedia'])if(!admin.includes('id="'+id+'"'))throw new Error('Admin content manager control missing: '+id);
if(!rules.includes('match /siteContent/{blockId}')||!rules.includes('allow read: if true;')||!rules.includes('allow create, update, delete: if isAdmin();'))throw new Error('Admin-managed content Firestore rules missing');
for(const term of ['upload(file)','deleteListingMedia','orderBy(\'order\')','visible','deletedAt:serverTimestamp()','async function restoreItem','mgCmsRemoveMedia'])if(!cmsAdmin.includes(term))throw new Error('Admin CMS behavior missing: '+term);
for(const term of ['x.visible===true&&!x.deletedAt','textContent=title','dataset.userContent'])if(!cmsPublic.includes(term))throw new Error('Public CMS safe rendering missing: '+term);
if(!admin.includes('assets/maru-ghar-content-admin.js')||!home.includes('assets/maru-ghar-site-content.js'))throw new Error('CMS scripts not connected to pages');
if(!admin.includes('assets/maru-ghar-admin-compact.js')||!admin.includes('assets/maru-ghar-admin-compact.css'))throw new Error('Compact admin assets not connected');
const compactAdmin=fs.readFileSync('assets/maru-ghar-admin-compact.js','utf8');
if(!compactAdmin.includes('const sections=[...main.children,...settings.children]')||!compactAdmin.includes('settings.append(panel)')||!compactAdmin.includes('main.replaceChildren()'))throw new Error('Restored compact admin sections are not moved into the Settings panel');
for(const slot of ['home_mid','home_bottom','home_listings_heading','home_categories','home_filters','home_results','home_submit','home_account','download_story'])if(!cmsAdmin.includes(slot))throw new Error('Admin CMS placement missing: '+slot);

console.log('UI REGRESSION CHECK PASS — shared Gujarati/Hindi/English dictionaries across all four pages and property panel open/close logic. This is a code-level test, not a full browser/device test.');

// Maru Ghar user-requested regression: ten demo cards, direct 1–2 columns, trust actions only in Settings.
const demo=fs.readFileSync('assets/maru-ghar-demo-showcase.js','utf8');
const demoIds=[...demo.matchAll(/\{id:'([^']+)'/g)].map(x=>x[1]);
if(demoIds.length!==10||new Set(demoIds).size!==10)throw new Error('Demo showcase must contain exactly ten unique demo properties');
if(!home.includes('mg-settings-only-trust-actions-20261118')||!home.includes('new MutationObserver(clean)'))throw new Error('Trust strip must be removed outside Settings, including dynamically inserted duplicates');
if(!home.includes('data-cols="1" onclick=')||!home.includes('data-cols="2" onclick=')||home.includes('data-cols="3" onclick=')||home.includes('data-cols="4" onclick='))throw new Error('Only 1 and 2 column buttons must call the direct grid controller');
if(!demo.includes('કુલ 10 ડેમો નમૂનાઓ')||!demo.includes('rootObserver.observe'))throw new Error('Demo showcase must expose all ten samples and initialize when listing root is delayed');
console.log('MARU GHAR DEMO / GRID / SETTINGS REGRESSION PASS — ten unique demo samples, direct 1–2 column controls, trust buttons restricted to Settings.');
const discovery=fs.readFileSync('assets/maru-ghar-discovery.js','utf8');
if(!discovery.includes("const applyRangeButton=$('mgApplyRangeFilters')")||!discovery.includes("if(applyRangeButton)applyRangeButton.addEventListener('click'"))throw new Error('Apply range filters button is not connected to an action');
const gridController=fs.readFileSync('assets/maru-ghar-grid-controller.js','utf8');
if(!home.includes('assets/maru-ghar-grid-controller.js?v=20261118c'))throw new Error('Independent property column controller is not loaded by the home page');
for(const n of ['1','2'])if(!new RegExp(`data-cols="${n}" onclick="window\\.mgSetPropertyColumns&&window\\.mgSetPropertyColumns\\('${n}'\\)"`).test(home))throw new Error('Column '+n+' button is not directly connected to the controller');
if(home.includes('data-cols="3" onclick=')||home.includes('data-cols="4" onclick='))throw new Error('3 and 4 column buttons must be removed');
if(!gridController.includes("document.querySelector('#mgDemoShowcase .mg-demo-grid')"))throw new Error('Demo showcase grid is not connected to the column controller');
if(!gridController.includes("observer.observe(document.body, { childList: true, subtree: true })"))throw new Error('Dynamically inserted demo showcase is not observed');
for(const term of ["repeat(' + cols + ', minmax(0, 1fr))","grid.style.setProperty('display', 'grid', 'important')","window.mgSetPropertyColumns = applyColumns","card.classList.contains('mg-demo-card')"])if(!gridController.includes(term))throw new Error('Independent column controller missing behavior: '+term);
if(gridController.includes("document.addEventListener('click'"))throw new Error('Competing delegated capture handler must not intercept direct column button actions');
// Execute the actual controller against both real grid types and verify every column choice.
const makeStyle=()=>({values:{},setProperty(k,v){this.values[k]=v}});
const buttons=['1','2'].map(n=>({dataset:{cols:n},classList:{toggle(){}},setAttribute(k,v){this[k]=v}}));
const makeCard=cls=>({classList:{contains:x=>x===cls},style:makeStyle()});
const liveGrid={dataset:{},style:makeStyle(),children:[makeCard('property'),makeCard('property')]};
const demoGrid={dataset:{},style:makeStyle(),children:[makeCard('mg-demo-card'),makeCard('mg-demo-card')]};
const switcher={querySelectorAll:()=>buttons};
const fakeDoc={readyState:'complete',body:{},getElementById:id=>id==='properties'?liveGrid:id==='gridSwitch'?switcher:null,querySelector:sel=>sel==='#mgDemoShowcase .mg-demo-grid'?demoGrid:null,addEventListener(){}};
const fakeWindow={addEventListener(){}};
const fakeLocal={setItem(k,v){this[k]=v},getItem(k){return this[k]||null}};
vm.runInNewContext(gridController,{window:fakeWindow,document:fakeDoc,localStorage:fakeLocal,MutationObserver:class{observe(){}},requestAnimationFrame:fn=>fn(),Array,Set,String});
for(const n of ['1','2']){
 const expected='repeat('+n+', minmax(0, 1fr))';
 if(fakeWindow.mgSetPropertyColumns(n)!==true||liveGrid.dataset.cols!==n||demoGrid.dataset.cols!==n||liveGrid.style.values['grid-template-columns']!==expected||demoGrid.style.values['grid-template-columns']!==expected||fakeLocal.mg_cols!==n)throw new Error('Column controller failed on live/demo grids for '+n);
}
console.log('INDEPENDENT PROPERTY COLUMN CONTROLLER PASS — 1 and 2 column choices update live listings and the visible demo showcase.');


