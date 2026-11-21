import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, collection, getDocs, getDoc, query, orderBy, doc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

window.__mgHeroSlidesReady = (async () => {
  try {
    if (location.protocol === 'file:' || location.protocol === 'content:') return false;
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [snap,config,headerConfig] = await Promise.all([
      getDocs(query(collection(db,'homeShowcaseSlides'),orderBy('order'))),
      getDoc(doc(db,'settings','homeShowcase')),
      getDoc(doc(db,'settings','homeHeader'))
    ]);
    const headerImage = headerConfig.exists() ? headerConfig.data().imageUrl : '';
    if (/^https:\/\//i.test(headerImage || '')) {
      const header = document.querySelector('body > header');
      if (header) {
        header.style.backgroundImage = 'linear-gradient(90deg,rgba(3,17,18,.97) 0%,rgba(5,31,31,.88) 52%,rgba(6,23,25,.66) 100%),url(' + JSON.stringify(headerImage) + ')';
        header.style.backgroundPosition = 'center';
        header.style.backgroundSize = 'cover';
      }
    }
    const items = snap.docs.map(d => d.data()).filter(x => x.visible === true && !x.deletedAt && /^https:\/\//i.test(x.imageUrl || ''));
    if (!items.length) return false;
    const keepBuiltIns = config.exists() ? config.data().keepBuiltIns !== false : true;
    const root = document.getElementById('mgShowcase');
    const dotsRoot = document.getElementById('mgShowcaseDots');
    if (!root || !dotsRoot) return false;
    if (!keepBuiltIns) {
      root.querySelectorAll('.mg-showcase-slide').forEach(el => el.remove());
      dotsRoot.replaceChildren();
    }
    items.forEach((item,index) => {
      const slide = document.createElement('div');
      slide.className = 'mg-showcase-slide' + (index === 0 ? ' active' : '');
      slide.dataset.title = item.title || item.titleHi || item.titleEn || '';
      slide.dataset.titleHi = item.titleHi || '';
      slide.dataset.titleEn = item.titleEn || '';
      slide.dataset.sub = item.subtitle || '';
      slide.dataset.subHi = item.subtitleHi || '';
      slide.dataset.subEn = item.subtitleEn || '';
      const img = document.createElement('img');
      img.className = 'mg-showcase-img';
      img.src = item.imageUrl;
      img.alt = item.alt || item.title || 'Maru Ghar property';
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      slide.append(img);
      root.insertBefore(slide,root.querySelector('.mg-showcase-copy'));
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label','Slide ' + (index+1));
      if (index === 0) dot.className = 'active';
      dotsRoot.append(dot);
    });
    return true;
  } catch (error) {
    console.warn('Admin-managed home showcase unavailable; built-in photos remain active.',error);
    return false;
  }
})();
