/* Maru Ghar — consolidated search tools, EMI panel and map shortcut. */
(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)};
  var tr=function(s){try{return window.mgI18nText?window.mgI18nText(s):s}catch(_){return s}};
  function fire(el){if(el)el.dispatchEvent(new Event('change',{bubbles:true}))}
  function scrollResults(){var l=$('listings');if(l)l.scrollIntoView({behavior:'smooth',block:'start'})}
  function apply(){if(typeof window.filterProps==='function'){try{window.filterProps()}catch(e){}}scrollResults()}
  function makeRow(sel,label,skipAll){
    var el=$(sel);if(!el)return null;
    var row=document.createElement('div');row.className='mg-chips';row.setAttribute('role','group');row.setAttribute('aria-label',label);
    Array.prototype.forEach.call(el.options,function(o){
      if(skipAll&&o.value==='all')return;
      var b=document.createElement('button');b.type='button';b.className='mg-chip';b.textContent=o.textContent;b.dataset.v=o.value;
      b.addEventListener('click',function(){
        var was=b.classList.contains('on');
        Array.prototype.forEach.call(row.children,function(c){c.classList.remove('on')});
        if(was){el.value='all'}else{b.classList.add('on');el.value=o.value}
        fire(el);apply();
      });
      row.appendChild(b);
    });
    return row;
  }
  function formatINR(n){try{return '₹ '+Math.round(n).toLocaleString('en-IN')}catch(_){return '₹ '+Math.round(n)}}
  function createEMI(list){
    if($('mgEmi'))return $('mgEmi');
    var panel=document.createElement('section');panel.id='mgEmi';panel.className='mg-emi';panel.hidden=true;
    panel.innerHTML=
      '<div class="mg-emi-head"><div><span class="mg-emi-kicker">MARU GHAR · HOME FINANCE</span><h2>🧮 EMI કેલ્ક્યુલેટર</h2><p class="sub">ઘર ખરીદવા માટે લોનનો માસિક હપ્તો જાણો</p></div><button type="button" class="mg-emi-close" id="emiClose" aria-label="બંધ કરો">✕ બંધ કરો</button></div>'+
      '<div class="mg-emi-g"><label>લોનની રકમ (₹)<input id="emiP" type="number" inputmode="numeric" min="1" value="2500000"></label>'+
      '<label>વ્યાજ દર (% વાર્ષિક)<input id="emiR" type="number" inputmode="decimal" min="0" max="40" step="0.1" value="8.5"></label>'+
      '<label>સમયગાળો (વર્ષ)<input id="emiN" type="number" inputmode="numeric" min="1" max="40" value="20"></label></div>'+
      '<button type="button" class="mg-emi-calc" id="emiGo">ગણતરી કરો</button><div id="emiOut" class="mg-emi-out" aria-live="polite"><div><small>માસિક EMI</small><b>—</b></div><div><small>કુલ વ્યાજ</small><b>—</b></div><div><small>કુલ ચુકવણી</small><b>—</b></div></div>'+
      '<p class="mg-emi-note">ગણતરી અંદાજિત છે; બેંકની શરતો મુજબ બદલાઈ શકે.</p>';
    list.parentNode.insertBefore(panel,list.nextSibling);
    function calculate(){
      var P=Number($('emiP').value),R=Number($('emiR').value),Y=Number($('emiN').value);
      var out=$('emiOut');
      if(!(P>0)||!(R>=0)||R>40||!(Y>0)||Y>40){out.innerHTML='<p class="mg-emi-error">યોગ્ય રકમ, વ્યાજ અને વર્ષ લખો.</p>';return}
      var months=Y*12,rate=R/1200,monthly=rate===0?P/months:P*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1),total=monthly*months;
      out.innerHTML='<div><small>માસિક EMI</small><b>'+formatINR(monthly)+'</b></div><div><small>કુલ વ્યાજ</small><b>'+formatINR(total-P)+'</b></div><div><small>કુલ ચુકવણી</small><b>'+formatINR(total)+'</b></div>';
    }
    $('emiGo').addEventListener('click',calculate);
    ['emiP','emiR','emiN'].forEach(function(id){$(id).addEventListener('input',calculate)});
    $('emiClose').addEventListener('click',function(){setEMIOpen(false)});
    return panel;
  }
  function setEMIOpen(open){
    var panel=$('mgEmi'),button=$('mgEmiToggle');if(!panel||!button)return;
    panel.hidden=!open;button.setAttribute('aria-expanded',String(!!open));
    button.textContent=(open?'− ':'🧮 ')+(open?tr('EMI બંધ કરો'):tr('EMI ગણતરી'));
    if(open){requestAnimationFrame(function(){panel.scrollIntoView({behavior:'smooth',block:'center'});$('emiP')?.focus({preventScroll:true})})}
  }
  function addTools(list){
    var q=$('mgQuick');if(!q||q.querySelector('.mg-tools'))return;
    var row=document.createElement('div');row.className='mg-chips mg-tools';
    var map=document.createElement('button');map.type='button';map.className='mg-chip mg-map-search';map.textContent='🗺 નકશા પર શોધો';
    map.addEventListener('click',function(){
      var city=$('cityFilter'),selected=city&&city.value&&city.value!=='all'?city.options[city.selectedIndex].text:'ગુજરાત';
      var query=($('query')?.value||'').trim();
      var address=[query,selected,'Gujarat'].filter(Boolean).join(' ');
      window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address),'_blank','noopener,noreferrer');
    });
    var emi=document.createElement('button');emi.type='button';emi.id='mgEmiToggle';emi.className='mg-chip mg-emi-toggle';emi.setAttribute('aria-expanded','false');emi.textContent='🧮 EMI ગણતરી';
    emi.addEventListener('click',function(){setEMIOpen($('mgEmi')?.hidden!==false)});
    row.appendChild(map);row.appendChild(emi);q.appendChild(row);
    createEMI(list);
  }
  function init(){
    var list=$('listings');if(!list)return;
    if(!$('mgQuick')){
      var wrap=document.createElement('div');wrap.id='mgQuick';wrap.className='mg-quick';
      var purpose=makeRow('purpose','ભાડે અથવા વેચાણ',true),type=makeRow('type','પ્રોપર્ટીનો પ્રકાર',true);
      if(purpose)wrap.appendChild(purpose);if(type)wrap.appendChild(type);
      if(wrap.children.length)list.insertBefore(wrap,list.firstChild);
    }
    addTools(list);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
