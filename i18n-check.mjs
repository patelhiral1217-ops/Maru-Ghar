import fs from 'node:fs';
import assert from 'node:assert/strict';
const pages=['index.html','admin.html','privacy.html','download.html'];
const read=p=>fs.readFileSync(p,'utf8');
const complete=read('assets/maru-ghar-i18n-complete.js');
const central=read('assets/maru-ghar-i18n.js');
import vm from 'node:vm';
const dictionaryContext={window:{}};vm.runInNewContext(central,dictionaryContext);
const sharedDictionary=dictionaryContext.window.MG_I18N_DICTIONARY;
const completeDictMatch=complete.match(/const dict=(\{[\s\S]*?\n  \};)/);
assert.ok(completeDictMatch,'supplemental UI dictionary not found');
const completeContext={};vm.runInNewContext('globalThis.__dict='+completeDictMatch[1],completeContext);
for(const [gu,pair] of Object.entries(completeContext.__dict)){const [hi,en]=pair.split('|');assert.ok(hi&&en,`supplemental translation missing: ${gu}`);assert.ok(!/[\u0A80-\u0AFF]/.test(hi),`Gujarati remains in supplemental Hindi: ${gu}`);assert.ok(!/[\u0A80-\u0AFF]/.test(en),`Gujarati remains in supplemental English: ${gu}`);}
assert.ok(Object.keys(sharedDictionary).length>=300,'shared dictionary should include all four pages and admin messages');
for(const [gu,v] of Object.entries(sharedDictionary)){
  assert.ok(v&&typeof v.hi==='string'&&v.hi.trim(),`Hindi translation missing: ${gu}`);
  assert.ok(v&&typeof v.en==='string'&&v.en.trim(),`English translation missing: ${gu}`);
  if(gu!=='ID')assert.notEqual(v.hi,gu,`Hindi still Gujarati: ${gu}`);
  if(gu!=='ID'&&gu!=='PG')assert.notEqual(v.en,gu,`English still Gujarati: ${gu}`);
  assert.ok(!/[\u0A80-\u0AFF]/.test(v.hi),`Gujarati script remains in Hindi: ${gu}`);
  assert.ok(!/[\u0A80-\u0AFF]/.test(v.en),`Gujarati script remains in English: ${gu}`);
}

for(const page of pages){
  const html=read(page);
  const inlineCentral=html.match(/<script data-mg-i18n-inline="central">([\s\S]*?)<\/script>/)?.[1]?.trim();
  const inlineEngine=html.match(/<script data-mg-i18n-inline="engine">([\s\S]*?)<\/script>/)?.[1]?.trim();
  assert.equal(inlineCentral,central.trim(),`${page}: inline central dictionary differs from source asset`);
  assert.equal(inlineEngine,complete.trim(),`${page}: inline language engine differs from source asset`);
  const id=page==='admin.html'?'mgAdminLanguage':'mgLanguage';
  assert.ok(html.includes(`id="${id}"`),`${page}: language selector missing`);
  assert.ok(complete.includes("localStorage.setItem('mg_language'"),`${page}: language preference is not persisted`);
  for(const lang of ['gu','hi','en'])assert.ok(html.includes(`value="${lang}"`),`${page}: ${lang} option missing`);
  assert.ok(complete.includes('document.documentElement.lang'),`${page}: document language not updated`);
  assert.equal(read(page),read(`www/${page}`),`${page} and www mirror differ`);
}
const home=read('index.html');
assert.ok(complete.includes('window.mgTranslate=window.mgI18nText'),'customer translation API missing');
assert.ok(central.includes('window.MG_I18N_DICTIONARY='),'central page dictionary must be present');
assert.ok(complete.includes('window.MG_I18N_DICTIONARY'),'shared translator must consume the central page dictionary');
for(const page of pages){const html=read(page);assert.ok(html.includes('MG_I18N_INLINE_BUNDLE_START')&&html.includes('data-mg-i18n-inline="central"')&&html.includes('data-mg-i18n-inline="engine"'),`${page}: standalone inline language bundle missing`);assert.ok(!html.includes('Admin UI language support.'),`${page}: legacy page-specific translator still present`);}
assert.ok(complete.includes('new MutationObserver'),'customer dynamic DOM observer missing');
const admin=read('admin.html');
for(const marker of ['window.mgAdminTranslate','window.alert=','window.confirm=','window.prompt=','new MutationObserver'])assert.ok(complete.includes(marker),`central admin translation handler missing: ${marker}`);
for(const phrase of ['હાલ કોઈ નોંધાયેલી Error નથી.','ફિલ્ટર રિપોર્ટ CSV','તમારી પૂછપરછ મોકલાઈ ગઈ છે.','જૂની લિસ્ટિંગમાં શહેર = ગાંધીનગર સેટ કરો','માલિકનું નામ','ફોલો-અપ બાકી','Error Log JSON ડાઉનલોડ'])assert.ok(central.includes(phrase),`admin dynamic UI dictionary phrase missing: ${phrase}`);
const privacy=read('privacy.html');
for(const phrase of ['ગોપનીયતા નીતિ','ફોન નંબરની ખાનગી સુરક્ષા','માહિતી ક્યાં સચવાય છે','ગ્રાહક એકાઉન્ટ અને મનપસંદ યાદી'])assert.ok(privacy.includes(phrase),`privacy source phrase missing: ${phrase}`);
const download=read('download.html');
for(const phrase of ['વેબસાઇટ / એપ ખોલો','Android APK ડાઉનલોડ કરો','QR ઇમેજ (PNG) સેવ કરો','પ્રિન્ટ કરો'])assert.ok(download.includes(phrase),`download source phrase missing: ${phrase}`);
console.log('I18N STRUCTURE CHECK PASS — selectors, persisted language, page language attribute, privacy/download dictionaries, customer/admin handlers and www mirrors. This is a structural check, not full translation coverage or browser E2E proof.');

for(const marker of ['Select City','Property Type','Owner Name','Mobile Number','Submit Property for Approval','Gandhinagar','Ahmedabad','Surat'])assert.ok(complete.includes(marker),`supplemental language coverage missing: ${marker}`);
for(const marker of ['data-mg-i18n-inline="engine"','assets/maru-ghar-form-steps.js'])assert.ok(home.includes(marker),`customer page script missing: ${marker}`);
const wizard=read('assets/maru-ghar-form-steps.js');for(const marker of ["names:['ownerName']","names:['ownerPhone']","names:['location']","names:['city']","names:['type']","names:['purpose']","names:['bhk']","names:['price']",'mg-form-step','આગળ વધો'])assert.ok(wizard.includes(marker),`property wizard step missing: ${marker}`);
for(const page of pages)assert.ok(read(page).includes('data-mg-i18n-inline="engine"'),`${page}: inline supplemental translator not loaded`);

const submitToggle=read('assets/maru-ghar-submit-toggle.js');
for(const marker of ['propertyFormToggle','propertySubmitContent','content.hidden=!open',"content.style.display=open?'grid':'none'",'a[href="#submit"]','mg-language-changed','mgTogglePropertyForm'])assert.ok(submitToggle.includes(marker),`property submit panel behavior missing: ${marker}`);
assert.ok(home.includes('id="propertySubmitContent" class="mg-submit-content" hidden'), 'property form must be hidden by default');
assert.ok(home.includes('id="propertyFormToggle"'), 'property form open control missing');
assert.ok(home.includes('window.mgTogglePropertyForm'), 'property form inline click fallback missing');
assert.ok(home.includes('assets/maru-ghar-submit-toggle.js'), 'property form toggle script missing');
assert.ok(complete.includes('window.MG_I18N_DICTIONARY'),'complete translator must merge the central page dictionary');
assert.ok(complete.includes('onLanguageChange'),'language selector input fallback missing');
console.log('ADDITIONAL UI CHECK PASS — language dictionaries, city translations, sequential form steps and initially-collapsed property submission panel.');
