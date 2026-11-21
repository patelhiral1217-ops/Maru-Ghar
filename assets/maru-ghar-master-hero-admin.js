import { firebaseConfig, cloudinaryConfig, isCloudinaryConfigured } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, collection, getDocs, getDoc, query, orderBy, addDoc, setDoc, updateDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

(() => {
  const root = document.getElementById('mgHeroSlideManager');
  if (!root) return;
  const ADMIN_UID = 'yJYiuaUE3KXVLVuWqLyLRH5owQJ3';
  const $ = id => document.getElementById(id);
  const tr = value => window.mgI18nText ? window.mgI18nText(value) : value;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const fields = ['mgHeroTitleGu','mgHeroTitleHi','mgHeroTitleEn','mgHeroSubGu','mgHeroSubHi','mgHeroSubEn','mgHeroAlt'];
  let slides = [];
  let editingId = '';
  let oldImage = null;
  let previewUrl = '';
  let headerImage = null;
  let headerPreviewUrl = '';

  const say = message => { $('mgHeroStatus').textContent = tr(message); };
  const value = id => $(id).value.trim();
  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = '';
    $('mgHeroPreview').replaceChildren();
  };
  function resetForm() {
    editingId = '';
    oldImage = null;
    fields.forEach(id => { $(id).value = ''; });
    $('mgHeroImage').value = '';
    $('mgHeroVisible').checked = true;
    $('mgHeroKeepBuiltIns').checked = true;
    clearPreview();
    $('mgHeroSave').textContent = tr('ફોટો ઉમેરો અને સેવ કરો');
  }
  function preview(url, alt) {
    clearPreview();
    if (!url) return;
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt || 'Maru Ghar showcase preview';
    $('mgHeroPreview').append(img);
  }
  function recordFromForm(image) {
    return {
      title: value('mgHeroTitleGu'),
      titleHi: value('mgHeroTitleHi'),
      titleEn: value('mgHeroTitleEn'),
      subtitle: value('mgHeroSubGu'),
      subtitleHi: value('mgHeroSubHi'),
      subtitleEn: value('mgHeroSubEn'),
      alt: value('mgHeroAlt'),
      imageUrl: image.url,
      imagePublicId: image.publicId || '',
      visible: $('mgHeroVisible').checked,
      updatedAt: serverTimestamp()
    };
  }
  async function upload(file) {
    if (!isCloudinaryConfigured()) throw new Error('Cloudinary સેટિંગ ઉપલબ્ધ નથી.');
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      throw new Error('JPG, PNG અથવા WEBP ફોટો પસંદ કરો. મહત્તમ સાઇઝ 8 MB છે.');
    }
    if (!cloudinaryConfig.uploadPreset) throw new Error('ફોટો અપલોડ માટે Cloudinary preset ઉપલબ્ધ નથી.');
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', cloudinaryConfig.uploadPreset);
    const response = await fetch('https://api.cloudinary.com/v1_1/' + encodeURIComponent(cloudinaryConfig.cloudName) + '/image/upload', { method:'POST', body });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'ફોટો અપલોડ થઈ શક્યો નથી.');
    return { url:data.secure_url, publicId:data.public_id || '' };
  }
  async function log(action, id, details) {
    try {
      await addDoc(collection(db,'adminLogs'), {
        kind:'admin_activity', action, target:id, details:String(details || '').slice(0,500),
        changedBy:auth.currentUser?.uid || '', at:new Date().toISOString(), createdAt:serverTimestamp()
      });
    } catch (error) { console.warn('Hero slide activity log unavailable', error); }
  }
  function localized(item, key) {
    const lang = (() => { try { return localStorage.getItem('mg_language') || 'gu'; } catch (_) { return 'gu'; } })();
    return (lang === 'en' && item[key + 'En']) || (lang === 'hi' && item[key + 'Hi']) || item[key] || '';
  }
  function renderList() {
    const list = $('mgHeroSlidesList');
    const trash = $('mgHeroSlidesTrash');
    list.replaceChildren();
    trash.replaceChildren();
    const active = slides.filter(x => !x.deletedAt).sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
    const deleted = slides.filter(x => !!x.deletedAt).sort((a,b) => (b.deletedAt?.seconds || 0) - (a.deletedAt?.seconds || 0));
    if (!active.length) list.textContent = tr('હાલ કોઈ કસ્ટમ ફોટો નથી. જૂના 7 ફોટા ચાલુ રહેશે.');
    active.forEach((item,index) => list.append(makeRow(item,index,active.length,false)));
    if (!deleted.length) trash.textContent = tr('કચરાપેટી ખાલી છે.');
    deleted.forEach(item => trash.append(makeRow(item,0,0,true)));
  }
  function makeRow(item,index,total,isTrash) {
    const row = document.createElement('article');
    row.className = 'mg-hero-slide-row';
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.alt || '';
    img.loading = 'lazy';
    const info = document.createElement('div');
    info.className = 'mg-hero-slide-info';
    const title = document.createElement('strong');
    title.textContent = item.title || item.titleHi || item.titleEn || tr('શીર્ષક વગર');
    const sub = document.createElement('small');
    sub.textContent = (item.visible ? tr('પ્રકાશિત') : tr('છુપાવેલો')) + ' · ' + tr('ક્રમ') + ' ' + ((item.order ?? 0) + 1);
    info.append(title,sub);
    row.append(img,info);
    const actions = document.createElement('div');
    actions.className = 'mg-hero-slide-actions';
    const button = (label,fn,disabled=false) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'primary'; b.textContent = tr(label); b.disabled = disabled;
      b.addEventListener('click',fn); actions.append(b);
    };
    if (isTrash) {
      button('↶ પાછો લાવો',() => restore(item));
    } else {
      button('Edit',() => edit(item));
      button(item.visible ? 'છુપાવો' : 'દેખાડો',() => toggle(item));
      button('↑ ઉપર',() => move(item,-1),index===0);
      button('↓ નીચે',() => move(item,1),index===total-1);
      button('કચરાપેટીમાં મૂકો',() => remove(item));
    }
    row.append(actions);
    return row;
  }
  function edit(item) {
    editingId = item.id;
    oldImage = {url:item.imageUrl,publicId:item.imagePublicId || ''};
    $('mgHeroTitleGu').value = item.title || '';
    $('mgHeroTitleHi').value = item.titleHi || '';
    $('mgHeroTitleEn').value = item.titleEn || '';
    $('mgHeroSubGu').value = item.subtitle || '';
    $('mgHeroSubHi').value = item.subtitleHi || '';
    $('mgHeroSubEn').value = item.subtitleEn || '';
    $('mgHeroAlt').value = item.alt || '';
    $('mgHeroVisible').checked = item.visible !== false;
    $('mgHeroImage').value = '';
    $('mgHeroSave').textContent = tr('ફેરફાર સેવ કરો');
    preview(item.imageUrl,item.alt);
    $('mgHeroEditor').open = true;
    $('mgHeroEditor').scrollIntoView({behavior:'smooth',block:'start'});
  }
  async function load() {
    $('mgHeroSlidesList').textContent = tr('લોડ થઈ રહ્યું છે…');
    const [snap,config,headerConfig] = await Promise.all([
      getDocs(query(collection(db,'homeShowcaseSlides'),orderBy('order'))),
      getDoc(doc(db,'settings','homeShowcase')),
      getDoc(doc(db,'settings','homeHeader'))
    ]);
    slides = snap.docs.map(d => ({id:d.id,...d.data()}));
    $('mgHeroKeepBuiltIns').checked = config.exists() ? config.data().keepBuiltIns !== false : true;
    headerImage = headerConfig.exists() && /^https:\/\//i.test(headerConfig.data().imageUrl || '')
      ? {url:headerConfig.data().imageUrl,publicId:headerConfig.data().imagePublicId || ''} : null;
    renderHeaderPreview(headerImage?.url || '');
    renderList();
  }
  async function save() {
    const file = $('mgHeroImage').files?.[0];
    if (!editingId && !file) { say('નવો ફોટો ઉમેરવા પહેલાં ફોટો પસંદ કરો.'); return; }
    if (!value('mgHeroTitleGu') && !value('mgHeroTitleHi') && !value('mgHeroTitleEn')) {
      say('ઓછામાં ઓછું એક ભાષામાં ફોટાનું શીર્ષક લખો.'); return;
    }
    const button = $('mgHeroSave');
    button.disabled = true;
    say('ફોટો સેવ થઈ રહ્યો છે…');
    let uploaded = null;
    try {
      if (file) uploaded = await upload(file);
      const image = uploaded || oldImage;
      if (!image?.url) throw new Error('ફોટો ઉપલબ્ધ નથી.');
      const data = recordFromForm(image);
      await setDoc(doc(db,'settings','homeShowcase'),{keepBuiltIns:$('mgHeroKeepBuiltIns').checked,updatedAt:serverTimestamp()},{merge:true});
      if (editingId) {
        await updateDoc(doc(db,'homeShowcaseSlides',editingId),data);
        await log('home_slide_updated',editingId,data.title || data.titleEn);
      } else {
        data.order = Math.max(-1,...slides.filter(x => !x.deletedAt).map(x => x.order ?? 0)) + 1;
        data.createdAt = serverTimestamp();
        const created = await addDoc(collection(db,'homeShowcaseSlides'),data);
        await log('home_slide_created',created.id,data.title || data.titleEn);
      }
      await load();
      resetForm();
      say('ફોટો સેવ થયો. Home Page ફરી ખોલશો ત્યારે નવો સ્લાઇડ દેખાશે.');
    } catch (error) {
      say('સેવ નિષ્ફળ: ' + (error.message || 'Firebase/Cloudinary તપાસો.'));
    } finally { button.disabled = false; }
  }
  async function toggle(item) {
    try {
      await updateDoc(doc(db,'homeShowcaseSlides',item.id),{visible:!item.visible,updatedAt:serverTimestamp()});
      await log(item.visible?'home_slide_hidden':'home_slide_published',item.id,item.title || item.titleEn);
      await load();
    } catch (error) { say('ફેરફાર સેવ થયો નથી: ' + error.message); }
  }
  async function move(item,delta) {
    const active = slides.filter(x => !x.deletedAt).sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
    const index = active.findIndex(x => x.id === item.id), other = active[index + delta];
    if (!other) return;
    try {
      await Promise.all([
        updateDoc(doc(db,'homeShowcaseSlides',item.id),{order:other.order ?? index + delta,updatedAt:serverTimestamp()}),
        updateDoc(doc(db,'homeShowcaseSlides',other.id),{order:item.order ?? index,updatedAt:serverTimestamp()})
      ]);
      await load();
    } catch (error) { say('ક્રમ બદલાયો નથી: ' + error.message); }
  }
  async function remove(item) {
    if (!confirm(tr('આ ફોટો સ્લાઇડમાંથી દૂર કરીને કચરાપેટીમાં મૂકવો છે? તેને પાછો લાવી શકશો.'))) return;
    try {
      await updateDoc(doc(db,'homeShowcaseSlides',item.id),{deletedAt:serverTimestamp(),visible:false,updatedAt:serverTimestamp()});
      await log('home_slide_trashed',item.id,item.title || item.titleEn);
      await load();
      say('ફોટો કચરાપેટીમાં મૂક્યો. જૂના ફોટા બેકઅપ તરીકે યથાવત છે.');
    } catch (error) { say('ફોટો દૂર થયો નથી: ' + error.message); }
  }
  async function restore(item) {
    try {
      await updateDoc(doc(db,'homeShowcaseSlides',item.id),{deletedAt:null,visible:true,updatedAt:serverTimestamp()});
      await log('home_slide_restored',item.id,item.title || item.titleEn);
      await load();
      say('ફોટો પાછો લાવવામાં આવ્યો.');
    } catch (error) { say('Restore નિષ્ફળ: ' + error.message); }
  }

  function renderHeaderPreview(url) {
    if (headerPreviewUrl) URL.revokeObjectURL(headerPreviewUrl);
    headerPreviewUrl = '';
    const host = $('mgHeaderBannerPreview');
    host.replaceChildren();
    if (!url) {
      const note = document.createElement('small');
      note.textContent = 'No custom photo saved — the original header background is active.';
      host.append(note);
      return;
    }
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Top header background preview';
    host.append(img);
  }
  async function saveHeaderBanner() {
    const file = $('mgHeaderBannerImage').files?.[0];
    if (!file && !headerImage?.url) { $('mgHeaderBannerStatus').textContent = 'Choose a photo first.'; return; }
    const button = $('mgHeaderBannerSave');
    button.disabled = true;
    $('mgHeaderBannerStatus').textContent = 'Saving header photo…';
    try {
      const image = file ? await upload(file) : headerImage;
      await setDoc(doc(db,'settings','homeHeader'),{
        imageUrl:image.url,imagePublicId:image.publicId || '',updatedAt:serverTimestamp()
      },{merge:true});
      headerImage = image;
      $('mgHeaderBannerImage').value = '';
      renderHeaderPreview(image.url);
      $('mgHeaderBannerStatus').textContent = 'Header photo saved. Reopen Home Page to see it.';
      await log('home_header_background_updated','homeHeader','Top header background photo updated');
    } catch (error) {
      $('mgHeaderBannerStatus').textContent = 'Save failed: ' + (error.message || 'Check Firebase/Cloudinary.');
    } finally { button.disabled = false; }
  }
  async function resetHeaderBanner() {
    if (!confirm('Restore the original website header background photo?')) return;
    const button = $('mgHeaderBannerReset');
    button.disabled = true;
    try {
      await setDoc(doc(db,'settings','homeHeader'),{imageUrl:'',imagePublicId:'',updatedAt:serverTimestamp()},{merge:true});
      headerImage = null;
      $('mgHeaderBannerImage').value = '';
      renderHeaderPreview('');
      $('mgHeaderBannerStatus').textContent = 'Original header background restored.';
      await log('home_header_background_reset','homeHeader','Original header background restored');
    } catch (error) {
      $('mgHeaderBannerStatus').textContent = 'Restore failed: ' + (error.message || 'Check Firebase.');
    } finally { button.disabled = false; }
  }
  $('mgHeroSave').addEventListener('click',save);
  $('mgHeroNew').addEventListener('click',() => { resetForm(); $('mgHeroEditor').open = true; });
  $('mgHeroCancel').addEventListener('click',resetForm);
  $('mgHeaderBannerSave').addEventListener('click',saveHeaderBanner);
  $('mgHeaderBannerReset').addEventListener('click',resetHeaderBanner);
  $('mgHeaderBannerImage').addEventListener('change',() => {
    const file = $('mgHeaderBannerImage').files?.[0];
    if (!file) return;
    if (headerPreviewUrl) URL.revokeObjectURL(headerPreviewUrl);
    headerPreviewUrl = URL.createObjectURL(file);
    renderHeaderPreview(headerPreviewUrl);
  });
  $('mgHeroImage').addEventListener('change',() => {
    const file = $('mgHeroImage').files?.[0];
    if (!file) return;
    clearPreview();
    previewUrl = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = previewUrl;
    img.alt = value('mgHeroAlt') || 'Maru Ghar showcase preview';
    $('mgHeroPreview').append(img);
  });
  onAuthStateChanged(auth,user => {
    if (user?.uid !== ADMIN_UID) {
      root.hidden = true;
      return;
    }
    root.hidden = false;
    load().catch(error => say('ફોટા લોડ થયા નથી: ' + error.message));
  });
  window.addEventListener('mg-language-changed',renderList);
  resetForm();
})();
