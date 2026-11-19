(()=>{
'use strict';
const $=id=>document.getElementById(id);
const frame=$('mgCmsLivePreview'),page=$('mgCmsPreviewPage'),reload=$('mgCmsPreviewReload'),status=$('mgCmsLiveStatus');
if(!frame||!page||!reload)return;
let attachTimer=null;
function say(message){if(status)status.textContent=message;}
function pageUrl(){return page.value==='download'?'download.html?mgAdminPreview=1':'index.html?mgAdminPreview=1';}
function refresh(){say('વેબસાઇટ Preview લોડ થઈ રહ્યું છે…');frame.src=pageUrl();}
function attach(){try{
 const doc=frame.contentDocument;if(!doc||!doc.body){say('Preview ફરી લોડ કરો.');return;}
 if(doc.getElementById('mg-admin-live-preview-style'))return;
 const style=doc.createElement('style');style.id='mg-admin-live-preview-style';style.textContent='.mg-cms-slot{position:relative!important;min-height:54px!important;outline:2px dashed #d6a62e!important;outline-offset:-3px!important;background:rgba(255,213,91,.13)!important;cursor:pointer!important}.mg-cms-slot:empty:before{content:"＋ અહીં કન્ટેન્ટ મૂકો — ટેપ કરો";display:flex;align-items:center;justify-content:center;min-height:48px;color:#72500a;font:700 13px/1.4 Arial,sans-serif;text-align:center;pointer-events:none}.mg-cms-slot:after{content:"SELECT AREA";position:absolute;right:5px;top:4px;padding:2px 6px;border-radius:5px;background:#d6a62e;color:#17271f;font:700 9px Arial;pointer-events:none}';doc.head.append(style);
 doc.addEventListener('click',event=>{const slot=event.target.closest?.('[data-mg-content-slot]');if(!slot)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();const selectedPage=page.value==='download'?'download':'home';const pageSelect=$('mgCmsPage'),placementSelect=$('mgCmsPlacement'),editor=$('mgCmsEditor');if(!pageSelect||!placementSelect)return;const newButton=$('mgCmsNewBtn');if(newButton)newButton.click();pageSelect.value=selectedPage;pageSelect.dispatchEvent(new Event('change',{bubbles:true}));const placement=slot.getAttribute('data-mg-content-slot');if([...placementSelect.options].some(option=>option.value===placement)){placementSelect.value=placement;placementSelect.dispatchEvent(new Event('change',{bubbles:true}));editor.open=true;editor.scrollIntoView({behavior:'smooth',block:'start'});say('જગ્યા પસંદ થઈ: '+placement+' — હવે લખાણ/ફોટો ઉમેરો અને Preview પછી Publish કરો.');}else say('આ જગ્યા માટે CMS વિકલ્પ ઉપલબ્ધ નથી: '+placement);
 },true);
 say('Live Preview તૈયાર છે. પીળા નિશાનવાળી જગ્યાને ટેપ/ક્લિક કરીને પસંદ કરો.');
 }catch(error){say('Preview જોડાઈ શક્યું નથી. Preview ફરી ખોલો.');console.warn('Maru Ghar live editor:',error);}}
frame.addEventListener('load',()=>{clearTimeout(attachTimer);attachTimer=setTimeout(attach,250);});
reload.addEventListener('click',refresh);page.addEventListener('change',refresh);
})();
