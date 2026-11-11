/* Maru Ghar: quick filter chips, lighter rendering, calmer slideshow. Additive; safe if anything is missing. */
(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)};
  function fire(el){el.dispatchEvent(new Event('change',{bubbles:true}))}
  function apply(){if(typeof window.filterProps==='function'){try{window.filterProps()}catch(e){}}var l=$('listings');if(l&&l.scrollIntoView)l.scrollIntoView({behavior:'smooth',block:'start'})}
  function makeRow(sel,label,skipAll,onPick){
    var el=$(sel);if(!el)return null;
    var row=document.createElement('div');row.className='mg-chips';row.setAttribute('role','group');row.setAttribute('aria-label',label);
    Array.prototype.forEach.call(el.options,function(o){
      if(skipAll&&(o.value==='all'))return;
      var b=document.createElement('button');b.type='button';b.className='mg-chip';b.textContent=o.textContent;b.dataset.v=o.value;
      b.addEventListener('click',function(){var on=b.classList.contains('on');Array.prototype.forEach.call(row.children,function(c){c.classList.remove('on')});
        if(on){el.value='all'}else{b.classList.add('on');el.value=o.value}
        fire(el);onPick()});
      row.appendChild(b)});
    return row;
  }
  function init(){
    var list=$('listings');if(!list||$('mgQuick'))return;
    var wrap=document.createElement('div');wrap.id='mgQuick';wrap.className='mg-quick';
    var a=makeRow('purpose','ભાડે અથવા વેચાણ',true,apply),b=makeRow('type','પ્રોપર્ટીનો પ્રકાર',true,apply);
    if(a)wrap.appendChild(a);if(b)wrap.appendChild(b);
    if(wrap.children.length)list.insertBefore(wrap,list.firstChild);
  }
  // Slideshow: stop timers work when the tab/app is hidden (saves battery, avoids jank).
  var _si=window.setInterval;window.setInterval=function(fn,ms){var id=_si(function(){if(document.hidden)return;fn()},ms);return id};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  // EMI calculator + "search on map" shortcut
  function inr(n){try{return '₹'+Math.round(n).toLocaleString('en-IN')}catch(e){return '₹'+Math.round(n)}}
  function emiBox(){
    if($('mgEmi'))return;var list=$('listings');if(!list||!list.parentNode)return;
    var s=document.createElement('section');s.id='mgEmi';s.className='mg-emi';
    s.innerHTML='<h3>🧮 EMI ગણતરી</h3><p>ઘર ખરીદવા માટે લોનનો માસિક હપ્તો ગણો</p>'+
    '<div class="mg-emi-g"><label>લોનની રકમ (₹)<input id="emiP" type="number" inputmode="numeric" min="1" value="2500000"></label>'+
    '<label>વ્યાજ દર (% વાર્ષિક)<input id="emiR" type="number" inputmode="decimal" min="0" step="0.1" value="8.5"></label>'+
    '<label>સમયગાળો (વર્ષ)<input id="emiN" type="number" inputmode="numeric" min="1" max="40" value="20"></label></div>'+
    '<button type="button" class="btn" id="emiGo">ગણતરી કરો</button><div id="emiOut" class="mg-emi-out" aria-live="polite"></div>';
    list.parentNode.insertBefore(s,list.nextSibling);
    $('emiGo').addEventListener('click',function(){
      var P=+$('emiP').value,R=+$('emiR').value,N=+$('emiN').value,out=$('emiOut');
      if(!(P>0)||!(R>=0)||!(N>0)||N>40||R>40){out.textContent='યોગ્ય આંકડા લખો.';return}
      var r=R/1200,n=N*12,e=r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),t=e*n;
      out.innerHTML='<div><small>માસિક EMI</small><b>'+inr(e)+'</b></div><div><small>કુલ વ્યાજ</small><b>'+inr(t-P)+'</b></div><div><small>કુલ ચુકવણી</small><b>'+inr(t)+'</b></div>';
    });
  }
  function extraChips(){
    var q=$('mgQuick');if(!q||q.querySelector('.mg-tools'))return;
    var row=document.createElement('div');row.className='mg-chips mg-tools';
    var m=document.createElement('button');m.type='button';m.className='mg-chip';m.textContent='🗺 નકશા પર શોધો';
    m.addEventListener('click',function(){var city=$('cityFilter'),c=city&&city.value&&city.value!=='all'?city.value:'';var qv=($('query')&&$('query').value||'').trim();
      var text=[qv,c,'Gujarat'].filter(Boolean).join(' ');window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(text),'_blank','noopener')});
    var e=document.createElement('button');e.type='button';e.className='mg-chip';e.textContent='🧮 EMI ગણતરી';
    e.addEventListener('click',function(){var b=$('mgEmi');if(b)b.scrollIntoView({behavior:'smooth',block:'center'})});
    row.appendChild(m);row.appendChild(e);q.appendChild(row);
  }
  function more(){emiBox();extraChips()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',more);else more();


  /* EMI calculator + map search button */
  function inr(n){return '₹ '+Math.round(n).toLocaleString('en-IN')}
  function initExtras(){
    var sub=$('submit');
    if(sub&&!$('mgEmi')){
      var sec=document.createElement('section');sec.id='mgEmi';sec.className='mg-emi';
      sec.innerHTML='<h2>EMI કેલ્ક્યુલેટર</h2><p class="sub">ઘર ખરીદવા માટે લોનનો માસિક હપ્તો જાણો</p>'+
        '<div class="g"><label>લોનની રકમ (₹)<input id="emiP" type="number" inputmode="numeric" min="0" value="2500000"></label>'+
        '<label>વ્યાજ દર (% વાર્ષિક)<input id="emiR" type="number" inputmode="decimal" min="0" step="0.1" value="8.5"></label>'+
        '<label>સમય (વર્ષ)<input id="emiN" type="number" inputmode="numeric" min="1" max="40" value="20"></label></div>'+
        '<div class="out"><div>માસિક EMI<b id="emiOut">—</b></div><div>કુલ વ્યાજ<b id="emiInt">—</b></div><div>કુલ ચુકવણી<b id="emiTot">—</b></div></div>'+
        '<p class="note">ગણતરી અંદાજિત છે; બેંકની શરતો મુજબ બદલાઈ શકે.</p>';
      sub.parentNode.insertBefore(sec,sub);
      var t=null;function calc(){var P=+$('emiP').value,R=+$('emiR').value,N=+$('emiN').value;
        if(!(P>0)||!(R>=0)||!(N>0)||N>40||R>40){$('emiOut').textContent=$('emiInt').textContent=$('emiTot').textContent='—';return}
        var n=N*12,r=R/1200,e=r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
        $('emiOut').textContent=inr(e);$('emiInt').textContent=inr(e*n-P);$('emiTot').textContent=inr(e*n)}
      ['emiP','emiR','emiN'].forEach(function(id){$(id).addEventListener('input',function(){clearTimeout(t);t=setTimeout(calc,150)})});calc();
    }
    var q=$('mgQuick');
    if(q&&!$('mgMapBtn')){
      var a=document.createElement('a');a.id='mgMapBtn';a.className='mg-mapbtn';a.target='_blank';a.rel='noopener noreferrer';a.textContent='📍 નકશા પર જુઓ';
      a.addEventListener('click',function(){var c=$('cityFilter'),city=(c&&c.value!=='all')?c.options[c.selectedIndex].text:'Gujarat',qq=($('query')&&$('query').value||'').trim();
        a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((qq+' '+city).trim())});
      a.href='https://www.google.com/maps/search/?api=1&query=Gujarat';
      q.appendChild(a);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initExtras);else initExtras();
})();
