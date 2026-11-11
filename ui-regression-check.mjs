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
console.log('UI REGRESSION CHECK PASS — shared Gujarati/Hindi/English dictionaries across all four pages and property panel open/close logic. This is a code-level test, not a full browser/device test.');
