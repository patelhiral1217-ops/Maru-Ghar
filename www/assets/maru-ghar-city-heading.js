/* Show the currently selected city as a clear Housing-style heading above the city selector. */
(function(){
 function init(){const city=document.getElementById('cityFilter');if(!city||document.getElementById('mgCityHeading'))return;const label=document.createElement('div');label.id='mgCityHeading';label.className='mg-city-heading';label.textContent=city.value==='all'?'શહેર':city.value;city.parentElement.insertBefore(label,city);const sync=()=>{label.textContent=city.value==='all'?'શહેર':city.value;};city.addEventListener('change',sync);window.addEventListener('mg-language-changed',sync);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
