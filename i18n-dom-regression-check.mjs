import fs from 'node:fs';
import vm from 'node:vm';

const makeDom=()=>{
  const all=[];
  class Element {
    constructor(tag,attrs={}){this.nodeType=1;this.isConnected=true;this.tagName=tag.toUpperCase();this.attrs={...attrs};this.id=attrs.id||'';this.parentElement=null;this.children=[];this.textContent='';this.handlers={};all.push(this);}
    append(child){child.parentElement=this;this.children.push(child);return child;}
    addEventListener(n,fn){(this.handlers[n]??=[]).push(fn);}
    hasAttribute(k){return Object.prototype.hasOwnProperty.call(this.attrs,k);}
    getAttribute(k){return this.hasAttribute(k)?this.attrs[k]:null;}
    setAttribute(k,v){this.attrs[k]=String(v);}
    matchesOne(sel){
      sel=sel.trim();if(!sel)return false;
      if(sel.startsWith('#'))return this.attrs.id===sel.slice(1);
      if(sel.startsWith('.'))return (this.attrs.class||'').split(/\s+/).includes(sel.slice(1));
      if(sel.startsWith('[')){const m=sel.match(/^\[([^\]=]+)(?:=["']?([^\]"']+)["']?)?\]$/);return !!m&&this.hasAttribute(m[1])&&(m[2]===undefined||this.getAttribute(m[1])===m[2]);}
      return this.tagName.toLowerCase()===sel.toLowerCase();
    }
    matches(selector){return selector.split(',').some(s=>this.matchesOne(s));}
    closest(selector){for(let n=this;n;n=n.parentElement)if(n.matches(selector))return n;return null;}
    querySelectorAll(selector){const out=[];const visit=n=>{for(const c of n.children){if(c.nodeType===1){if(c.matches(selector))out.push(c);visit(c);}}};visit(this);return out;}
  }
  class Text {
    constructor(value,parent){this.nodeType=3;this.isConnected=true;this.nodeValue=value;this.parentElement=parent;}
  }
  const body=new Element('body');
  const select=body.append(new Element('select',{id:'mgLanguage'}));select.value='gu';
  const nav=body.append(new Element('nav'));
  const navLink=nav.append(new Element('a'));const navText=new Text('પ્રોપર્ટી જુઓ',navLink);navLink.children.push(navText);
  const section=body.append(new Element('section',{id:'listings'}));
  const heading=section.append(new Element('h2'));const headingText=new Text('પ્રોપર્ટી લિસ્ટિંગ',heading);heading.children.push(headingText);
  const more=section.append(new Element('button'));const moreText=new Text('વધુ પ્રોપર્ટી જુઓ',more);more.children.push(moreText);
  const demo=section.append(new Element('article',{class:'property', 'data-demo':'true'}));
  const demoTitle=demo.append(new Element('h3'));const demoTitleText=new Text('રહેણાંક ઘર — અડાલજ',demoTitle);demoTitle.children.push(demoTitleText);
  const live=section.append(new Element('article',{class:'property'}));
  const liveTitle=live.append(new Element('h3'));const liveTitleText=new Text('Owner entered: ઘર',liveTitle);liveTitle.children.push(liveTitleText);
  const liveButton=live.append(new Element('button'));const liveButtonText=new Text('નામંજૂર કરો',liveButton);liveButton.children.push(liveButtonText);
  const card=body.append(new Element('article',{class:'card'}));
  const owner=card.append(new Element('p'));const ownerText=new Text('માલિકનું નામ: ઘર',owner);owner.children.push(ownerText);
  const cardButton=card.append(new Element('button'));const cardButtonText=new Text('ફરી લોડ કરો',cardButton);cardButton.children.push(cardButtonText);
  const placeholder=body.append(new Element('input',{placeholder:'શહેરનું નામ (ગુજરાતીમાં)'}));
  let treeWalkerCalls=0;
  const document={body,documentElement:{lang:'gu'},readyState:'complete',getElementById:id=>id==='mgLanguage'?select:null,addEventListener:(n,fn)=>{(document.handlers[n]??=[]).push(fn);},handlers:{},createTreeWalker(root){treeWalkerCalls++;const nodes=[];const walk=n=>{for(const c of n.children||[]){if(c.nodeType===3)nodes.push(c);else walk(c);}};walk(root);let i=0;return{nextNode:()=>nodes[i++]||null};}};
  const window={addEventListener(){},dispatchEvent(){}};
  const local={value:'gu'};
  const context={window,document,NodeFilter:{SHOW_TEXT:4},MutationObserver:class{observe(){}},localStorage:{getItem:()=>local.value,setItem:(k,v)=>{local.value=v;}},Event:class{},setTimeout:fn=>fn()};
  return {context,document,window,select,get treeWalkerCalls(){return treeWalkerCalls;},nodes:{navText,headingText,moreText,demoTitleText,liveTitleText,liveButtonText,ownerText,cardButtonText,placeholder}};
};

const dom=makeDom();
vm.runInNewContext(fs.readFileSync('assets/maru-ghar-i18n.js','utf8'),dom.context);
vm.runInNewContext(fs.readFileSync('assets/maru-ghar-i18n-complete.js','utf8'),dom.context);
const change=lang=>{dom.select.value=lang;for(const fn of dom.select.handlers.change||[])fn();for(const fn of dom.document.handlers.change||[])fn({target:dom.select});};
change('en');
const n=dom.nodes;
const initialTreeWalkerCalls=dom.treeWalkerCalls;
if(n.navText.nodeValue!=='View Properties')throw new Error(`Home navigation was not translated: ${n.navText.nodeValue}`);
if(n.headingText.nodeValue!=='Property Listings')throw new Error(`Listings section was not translated: ${n.headingText.nodeValue}`);
if(n.moreText.nodeValue!=='View More Properties')throw new Error(`Listings action was not translated: ${n.moreText.nodeValue}`);
if(!n.demoTitleText.nodeValue.includes('Residential'))throw new Error(`Demo property card was not translated: ${n.demoTitleText.nodeValue}`);
if(n.liveTitleText.nodeValue!=='Owner entered: ઘર')throw new Error('Owner-entered property title was modified');
if(n.ownerText.nodeValue!=='માલિકનું નામ: ઘર')throw new Error('Owner-entered admin card content was modified');
if(n.liveButtonText.nodeValue!=='Reject')throw new Error(`Live property action button was not translated: ${n.liveButtonText.nodeValue}`);
if(n.cardButtonText.nodeValue!=='Refresh')throw new Error(`Admin card action button was not translated: ${n.cardButtonText.nodeValue}`);
if(n.placeholder.getAttribute('placeholder')!=='City Name (Gujarati)')throw new Error(`Placeholder was not translated: ${n.placeholder.getAttribute('placeholder')}`);
change('hi');
if(n.navText.nodeValue!=='प्रॉपर्टी देखें')throw new Error(`Hindi switch failed: ${n.navText.nodeValue}`);
change('gu');
if(dom.treeWalkerCalls!==initialTreeWalkerCalls)throw new Error('Language switching rescanned the full page instead of using cached translations');
if(n.navText.nodeValue!=='પ્રોપર્ટી જુઓ')throw new Error(`Gujarati restore failed: ${n.navText.nodeValue}`);
console.log('I18N DOM + SPEED REGRESSION PASS — Gujarati/Hindi/English switching uses cached text after the first scan; buttons/attributes translate and owner-entered content stays unchanged.');
