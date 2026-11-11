import fs from 'node:fs';
import vm from 'node:vm';

const select={id:'mgLanguage',value:'gu',addEventListener(){}};
const body={nodeType:1,querySelectorAll:()=>[],closest:()=>null,getAttribute:()=>null,hasAttribute:()=>false};
const document={body,documentElement:{lang:'gu'},readyState:'complete',getElementById:id=>(id==='mgLanguage'||id==='mgAdminLanguage')?select:null,addEventListener(){},createTreeWalker(){return{nextNode(){return null}}}};
const window={addEventListener(){},dispatchEvent(){}};
const context={window,document,NodeFilter:{SHOW_TEXT:4},MutationObserver:class{observe(){}},localStorage:{getItem:()=>select.value,setItem(){}},Event:class{},setTimeout:fn=>fn()};
vm.runInNewContext(fs.readFileSync('assets/maru-ghar-i18n.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('assets/maru-ghar-i18n-complete.js','utf8'),context);
const gujarati=/[\u0A80-\u0AFF]/;
const pages=['index.html','admin.html','privacy.html','download.html'];
const failures=[];
for(const page of pages){
  let html=fs.readFileSync(page,'utf8')
    .replace(/<!--[\s\S]*?-->/g,'')
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi,'')
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi,'')
    .replace(/<noscript\b[\s\S]*?<\/noscript\s*>/gi,'');
  const textNodes=[...html.matchAll(/>([^<>]+)</g)].map(m=>m[1].trim()).filter(Boolean);
  for(const lang of ['hi','en']){
    select.value=lang;
    for(const text of textNodes){
      const out=window.mgI18nText(text);
      if(gujarati.test(out))failures.push(`${page} [${lang}] text: ${text} => ${out}`);
    }
    const attrs=[...html.matchAll(/(?:placeholder|title|aria-label)\s*=\s*(["'])(.*?)\1/gi)].map(m=>m[2]);
    for(const attr of attrs){const out=window.mgI18nText(attr);if(gujarati.test(out))failures.push(`${page} [${lang}] attribute: ${attr} => ${out}`);}
  }
}
if(failures.length){console.error(failures.slice(0,80).join('\n'));throw new Error(`${failures.length} untranslated static UI text/attributes remain`);}
console.log('I18N COVERAGE PASS — all extracted static Gujarati UI text and placeholder/title/aria-label values on all four pages translate to Hindi and English. Owner-entered runtime content is excluded by design.');
