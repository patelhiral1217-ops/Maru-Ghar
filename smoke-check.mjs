import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root=process.cwd();
const required=['index.html','admin.html','privacy.html','download.html','firebase-config.js','google-services.json','firestore.rules','firestore.indexes.json','firebase.json','assets/maru-ghar-backend.js','assets/maru-ghar-extras.js','assets/maru-ghar-qr.js','assets/maru-ghar-form-steps.js','assets/maru-ghar-submit-toggle.js','assets/maru-ghar-i18n.js','assets/maru-ghar-i18n-complete.js','assets/maru-ghar-file-mode.js','functions/index.js','www/index.html','www/admin.html'];
const errors=[];
for(const f of required) if(!fs.existsSync(path.join(root,f))) errors.push(`Missing file: ${f}`);
for(const f of ['package.json','capacitor.config.json','firebase.json','firestore.indexes.json','functions/package.json','google-services.json']){try{JSON.parse(fs.readFileSync(path.join(root,f),'utf8'))}catch(e){errors.push(`Invalid JSON ${f}: ${e.message}`)}}
for(const f of ['assets/maru-ghar-backend.js','assets/maru-ghar-extras.js','assets/maru-ghar-qr.js','assets/maru-ghar-form-steps.js','assets/maru-ghar-submit-toggle.js','assets/maru-ghar-i18n.js','assets/maru-ghar-i18n-complete.js','assets/maru-ghar-file-mode.js','functions/index.js']){const r=spawnSync(process.execPath,['--check',f],{cwd:root,encoding:'utf8'});if(r.status!==0)errors.push(`JS syntax ${f}: ${r.stderr||r.stdout}`)}
for(const f of ['index.html','admin.html']){const html=fs.readFileSync(path.join(root,f),'utf8');const matches=[...html.matchAll(/<script\s+type="module">([\s\S]*?)<\/script>/g)];for(let i=0;i<matches.length;i++){const tmp=path.join(root,`.smoke-${path.basename(f)}-${i}.mjs`);fs.writeFileSync(tmp,matches[i][1]);const r=spawnSync(process.execPath,['--check',tmp],{cwd:root,encoding:'utf8'});fs.rmSync(tmp,{force:true});if(r.status!==0)errors.push(`Inline module syntax ${f} #${i}: ${r.stderr||r.stdout}`)}}
for(const f of ['index.html','admin.html','privacy.html','download.html','firebase-config.js']){const a=fs.readFileSync(path.join(root,f));const b=fs.readFileSync(path.join(root,'www',f));if(!a.equals(b))errors.push(`www mirror out of sync: ${f}`)}
const androidFirebase=JSON.parse(fs.readFileSync(path.join(root,'google-services.json'),'utf8'));
if(androidFirebase.project_info?.project_id!=='maru-ghar-gandhinagar-8dbe4')errors.push('Android Firebase project ID does not match web Firebase config');
if(!(androidFirebase.client||[]).some(c=>c.client_info?.android_client_info?.package_name==='in.marughar.gandhinagar'))errors.push('Android Firebase package name mismatch');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const marker of ['id="mgLanguage"','value="gu"','value="hi"','value="en"'])if(!home.includes(marker))errors.push(`Language selector missing: ${marker}`);
const i18n=fs.readFileSync(path.join(root,'assets/maru-ghar-i18n-complete.js'),'utf8');
const fileMode=fs.readFileSync(path.join(root,'assets/maru-ghar-file-mode.js'),'utf8');
if(!home.includes('id="mgLocalFileWarning"')||!home.includes('assets/maru-ghar-file-mode.js?v=20261102r6'))errors.push('Direct-file mode warning/fallback missing from home page');
for(const f of ['index.html','admin.html','privacy.html','download.html']){const h=fs.readFileSync(path.join(root,f),'utf8');for(const key of ['central','engine']){const m=h.match(new RegExp(`<script data-mg-i18n-inline=\"${key}\">([\\s\\S]*?)<\\/script>`));if(!m)errors.push(`${f}: inline ${key} language script missing`);else{const tmp=path.join(root,`.inline-${f}-${key}.js`);fs.writeFileSync(tmp,m[1]);const r=spawnSync(process.execPath,['--check',tmp],{cwd:root,encoding:'utf8'});fs.rmSync(tmp,{force:true});if(r.status!==0)errors.push(`${f}: inline ${key} language script syntax: ${r.stderr||r.stdout}`)}}}
if(!fileMode.includes("protocol==='file:'||protocol==='content:'")||!fileMode.includes("href.startsWith('content:')")||!fileMode.includes('Firebase Login'))errors.push('Direct-file/content URI mode Firebase limitation handling missing');
for(const marker of ["localStorage.setItem('mg_language'",'window.mgI18nText=','window.mgTranslate=window.mgI18nText','document.documentElement.lang=selected','new MutationObserver','record.addedNodes'])if(!i18n.includes(marker))errors.push(`Customer language engine missing: ${marker}`);
const customerExtras=fs.readFileSync(path.join(root,'assets/maru-ghar-extras.js'),'utf8');
for(const marker of ['auth/weak-password','auth/user-not-found','auth/requires-recent-login','ફાઇલ અપલોડ કરવાની પરવાનગી નથી.','આ કાર્ય માટે લોગિન જરૂરી છે.'])if(!customerExtras.includes(marker))errors.push(`Customer/backend message translation missing: ${marker}`);
const admin=fs.readFileSync(path.join(root,'admin.html'),'utf8');
if(!admin.includes('data-mg-i18n-inline="central"')||!admin.includes('data-mg-i18n-inline="engine"'))errors.push('Admin standalone inline language bundle missing');
if(admin.includes('Admin UI language support.'))errors.push('Legacy competing admin language translator still present');
for(const id of ['exportXlsx','restoreListings','refreshErrorLog','exportErrorLog','mgBreakdown','enquiryList','mgReportCity','mgReportPurpose','mgReportYear','mgReportMonth','mgReportSummary','migrateOwnerContacts'])if(!admin.includes(`id="${id}"`))errors.push(`Admin feature missing: ${id}`);
for(const fn of ['mgReportFilteredRows','mgReportDownloadCSV','mgReportRender','mgAttachPrivateContacts'])if(!admin.includes(`function ${fn}`))errors.push(`Report function missing: ${fn}`);
if(!admin.includes("const source=await getAllListingRows();mgReportPopulateFilters(source);const rows=mgReportRender(mgReportFilteredRows(source))"))errors.push('Filtered report preview must load all listings, not only the first admin page');
if(!admin.includes("const b=$('mgReportPrint'),w=window.open"))errors.push('PDF report popup must open synchronously before asynchronous Firestore loading');
for(const marker of ['function mgCurrentLanguage()','function mgPrintText(gu,hi,en)','toLocaleDateString(locale)',"mgPrintText('રિપોર્ટ તારીખ','रिपोर्ट की तारीख','Report Date')"])if(!admin.includes(marker))errors.push(`Localized property PDF missing: ${marker}`);
if(!admin.includes('const lang=mgCurrentLanguage(),locale=lang===\'hi\'?\'hi-IN\':lang===\'en\'?\'en-IN\':\'gu-IN\''))errors.push('Property PDF must use selected language locale');
for(const marker of ['const lang=mgCurrentLanguage(),locale=lang===\'hi\'?\'hi-IN\':lang===\'en\'?\'en-IN\':\'gu-IN\'','const rowsHtml=rows.slice(0,1000)','T(\'કુલ રેકોર્ડ\',\'कुल रिकॉर्ड\',\'Total Records\')','<th>${T(\'શહેર\',\'शहर\',\'City\')}</th>'])if(!admin.includes(marker))errors.push(`Filtered report PDF localization missing: ${marker}`);
const rules=fs.readFileSync(path.join(root,'firestore.rules'),'utf8');
for(const term of ['match /users/{uid}/favorites/{listingId}','match /enquiries/{enquiryId}','match /adminLogs/{logId}','match /listingContacts/{listingId}'])if(!rules.includes(term))errors.push(`Firestore rule missing: ${term}`);
if(!rules.includes("resource.data.status == 'approved'") || !rules.includes('query rules are not filters'))errors.push('Public approved-listing read and legacy-contact migration prerequisite missing');
const privacy=fs.readFileSync(path.join(root,'privacy.html'),'utf8');
if(!privacy.includes('સામાન્ય મુલાકાતી ફોન નંબર જોઈ શકતો નથી'))errors.push('Privacy policy must describe private owner contact access');
const validCommon=rules.match(/function validCommon\(data\)\s*\{([\s\S]*?)\n    \}/);
if(!validCommon||validCommon[1].includes('ownerPhone'))errors.push('Public listing validation must not include ownerPhone');
const backend=fs.readFileSync(path.join(root,'assets/maru-ghar-backend.js'),'utf8');
if(!backend.includes("doc(db,'listingContacts',listingRef.id)"))errors.push('Customer listing must save owner contact privately');
if(!admin.includes("doc(db,'listingContacts',listingRef.id)"))errors.push('Admin listing must save owner contact privately');
if(!admin.includes('ownerPhone:deleteField()'))errors.push('Legacy public phone migration must remove ownerPhone after private copy');
const restoreStart=admin.indexOf("const allowed=['ownerName','type','purpose'");
const restoreEnd=admin.indexOf('added++',restoreStart);
const restoreBlock=restoreStart>=0&&restoreEnd>restoreStart?admin.slice(restoreStart,restoreEnd):'';
if(!restoreBlock||restoreBlock.includes("'ownerPhone'"))errors.push('Backup restore must never copy ownerPhone into public listing data');
if(!restoreBlock||!restoreBlock.includes('setDoc(contactRef')||!restoreBlock.includes('await setDoc(ref,data)'))errors.push('Backup restore must save private contact before public listing');
if(!admin.includes('mgAttachPrivateContacts(pageRows)'))errors.push('Admin listing cards must load private contacts');
if(!admin.includes("deleteDoc(doc(db,'listingContacts',id))"))errors.push('Admin listing deletion must clean up private contact');
if(errors.length){console.error('SMOKE CHECK FAILED');errors.forEach(e=>console.error(' - '+e));process.exit(1)}
console.log(`SMOKE CHECK PASS — ${required.length} required files, JSON, JS syntax, inline modules, www sync, admin features and security-rule markers.`);
