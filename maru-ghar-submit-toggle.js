/* MARU GHAR — reliable, reversible property submission panel. */
(function(){
  'use strict';
  function init(){
    var section=document.getElementById('submit');
    var toggle=document.getElementById('propertyFormToggle');
    var content=document.getElementById('propertySubmitContent');
    if(!section||!toggle||!content)return;
    var title=toggle.querySelector('.mg-submit-toggle-title');
    var hint=toggle.querySelector('.mg-submit-toggle-hint');
    function tr(gu){return typeof window.mgI18nText==='function'?window.mgI18nText(gu):gu;}
    function setOpen(open,scroll){
      open=!!open;
      content.hidden=!open;
      content.style.display=open?'grid':'none';
      section.classList.toggle('mg-submit-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      if(title)title.textContent=(open?'− ':'＋ ')+tr(open?'ફોર્મ બંધ કરો':'તમારી પ્રોપર્ટી લિસ્ટ કરો');
      if(hint)hint.textContent=open?'':tr('પ્રોપર્ટી ઉમેરો');
      if(open&&scroll){requestAnimationFrame(function(){section.scrollIntoView({behavior:'smooth',block:'start'});});}
    }
    window.mgTogglePropertyForm=function(force){setOpen(typeof force==='boolean'?force:content.hidden,true);};
    document.addEventListener('click',function(e){
      var target=e.target&&e.target.nodeType===1?e.target:e.target&&e.target.parentElement;
      var link=target&&target.closest('a[href="#submit"]');
      if(link)setOpen(true,false);
    },true);
    window.addEventListener('hashchange',function(){if(location.hash==='#submit')setOpen(true,false);});
    window.addEventListener('mg-language-changed',function(){setOpen(!content.hidden,false);});
    setOpen(location.hash==='#submit',false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
