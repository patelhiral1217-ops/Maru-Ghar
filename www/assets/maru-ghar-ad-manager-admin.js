/* Maru Ghar — Advertisement Manager admin controller.
 *
 * Requires an authenticated admin session. Firestore rules are the real gate;
 * this module only builds the UI and reports denials honestly.
 *
 * Media uploads use the project's existing Cloudinary unsigned presets —
 * no API key or secret is ever read, stored or transmitted from this code.
 */
import {
  firebaseConfig,
  cloudinaryConfig,
  isCloudinaryConfigured,
  isVideoCloudinaryConfigured
} from '../firebase-config.js';
import {
  initializeApp,
  getApps,
  getApp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {
  AD_COLLECTION,
  AD_PLACEMENTS,
  AD_DURATION_PRESETS,
  AD_DEFAULT_DURATION,
  AD_ACCEPT_ATTR,
  adState,
  adPlacementLabel,
  sortAds,
  parseAdDuration,
  validateAdMedia,
  isSafeClickUrl,
  toMillis,
  localInputToDate,
  dateToLocalInput
} from './maru-ghar-ad-constants.js';

(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  let db = null;
  let currentUser = null;
  let editingId = null;
  let rows = [];
  let replaceTargetId = null;
  let booted = false;

  /* ---------------------------------------------------------------- status */

  function setStatus(message, kind) {
    const box = $('mgAdStatus');
    if (!box) return;
    box.textContent = message || '';
    box.className = kind ? `is-${kind}` : '';
  }

  /* ---------------------------------------------------------------- upload */

  function uploadToCloudinary(file, mediaType, onProgress) {
    return new Promise((resolve, reject) => {
      const resource = mediaType === 'video' ? 'video' : 'image';
      const preset =
        mediaType === 'video'
          ? cloudinaryConfig.videoUploadPreset
          : cloudinaryConfig.uploadPreset;

      if (!cloudinaryConfig.cloudName || !preset) {
        reject(new Error('Cloudinary કન્ફિગરેશન ઉપલબ્ધ નથી.'));
        return;
      }

      const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
        cloudinaryConfig.cloudName
      )}/${resource}/upload`;

      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', preset);
      form.append('folder', 'maru-ghar/advertisements');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && typeof onProgress === 'function') {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        let payload = null;
        try {
          payload = JSON.parse(xhr.responseText || '{}');
        } catch {
          payload = null;
        }
        if (xhr.status >= 200 && xhr.status < 300 && payload && payload.secure_url) {
          resolve(payload);
          return;
        }
        const reason =
          (payload && payload.error && payload.error.message) ||
          `Cloudinary એપલોડ નિષ્ફળ (HTTP ${xhr.status}).`;
        reject(new Error(reason));
      };

      xhr.onerror = () => reject(new Error('નેટવર્ક ભૂલ: એપલોડ થઈ શક્યું નહીં.'));
      xhr.ontimeout = () => reject(new Error('એપલોડ સમય સમાપ્ત થયો.'));
      xhr.send(form);
    });
  }

  /* ------------------------------------------------------------- form state */

  function currentMediaType() {
    return $('mgAdMediaType').value === 'video' ? 'video' : 'image';
  }

  function syncMediaTypeUI() {
    const type = currentMediaType();
    const fileInput = $('mgAdFile');
    if (fileInput) fileInput.setAttribute('accept', AD_ACCEPT_ATTR[type]);
    const hint = $('mgAdFileHint');
    if (hint) {
      hint.textContent =
        type === 'video'
          ? 'MP4, વધુમાં વધુ 25 MB. વિડિયો પ્રીસેટ Cloudinary માં સક્રિય હોવો જોઈએ.'
          : 'JPG / PNG / WebP, વધુમાં વધુ 8 MB.';
    }
  }

  function syncDurationUI() {
    const select = $('mgAdDuration');
    const custom = $('mgAdDurationCustom');
    if (!select || !custom) return;
    const isCustom = select.value === 'custom';
    custom.hidden = !isCustom;
    if (!isCustom) custom.value = '';
  }

  function readDuration() {
    const select = $('mgAdDuration');
    if (select.value === 'custom') {
      return parseAdDuration($('mgAdDurationCustom').value);
    }
    return parseAdDuration(select.value);
  }

  function resetForm() {
    editingId = null;
    const form = $('mgAdForm');
    if (form) form.reset();
    $('mgAdMediaType').value = 'image';
    $('mgAdPlacement').value = AD_PLACEMENTS[0].id;
    $('mgAdDuration').value = String(AD_DEFAULT_DURATION);
    $('mgAdDurationCustom').value = '';
    $('mgAdDurationCustom').hidden = true;
    $('mgAdEnabled').checked = true;
    $('mgAdPriority').value = '0';
    $('mgAdOrder').value = '0';
    $('mgAdClickUrl').value = '';
    $('mgAdStart').value = '';
    $('mgAdExpiry').value = '';
    const save = $('mgAdSave');
    if (save) save.textContent = 'સાચવો અને પ્રકાશિત કરો';
    syncMediaTypeUI();
    setStatus('', '');
  }

  function fillForm(ad) {
    editingId = ad.id;
    $('mgAdTitle').value = ad.title || '';
    $('mgAdMediaType').value = ad.mediaType === 'video' ? 'video' : 'image';
    $('mgAdPlacement').value = ad.placement || AD_PLACEMENTS[0].id;

    const seconds = Number(ad.durationSeconds) || AD_DEFAULT_DURATION;
    if (AD_DURATION_PRESETS.includes(seconds)) {
      $('mgAdDuration').value = String(seconds);
      $('mgAdDurationCustom').value = '';
      $('mgAdDurationCustom').hidden = true;
    } else {
      $('mgAdDuration').value = 'custom';
      $('mgAdDurationCustom').value = String(seconds);
      $('mgAdDurationCustom').hidden = false;
    }

    $('mgAdStart').value = dateToLocalInput(toMillis(ad.startAt));
    $('mgAdExpiry').value = dateToLocalInput(toMillis(ad.expiryAt));
    $('mgAdEnabled').checked = ad.enabled === true;
    $('mgAdPriority').value = String(Number(ad.priority) || 0);
    $('mgAdOrder').value = String(Number(ad.order) || 0);
    $('mgAdClickUrl').value = ad.clickUrl || '';

    const save = $('mgAdSave');
    if (save) save.textContent = 'ફેરફાર સાચવો';
    syncMediaTypeUI();
    $('mgAdManagerPanel').open = true;
    $('mgAdForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    setStatus(`સંપાદન: ${ad.title || ad.id}`, 'ok');
  }

  function validateForm() {
    const title = String($('mgAdTitle').value || '').trim();
    if (title.length < 2) return { error: 'શીર્ષક ઓછામાં ઓછું 2 અક્ષરનું હોવું જોઈએ.' };
    if (title.length > 80) return { error: 'શીર્ષક 80 અક્ષરથી વધુ ન હોવું જોઈએ.' };

    const placement = $('mgAdPlacement').value;
    if (!AD_PLACEMENTS.some((p) => p.id === placement)) {
      return { error: 'માન્ય સ્થાન પસંદ કરો.' };
    }

    const duration = readDuration();
    if (!duration) return { error: 'સમયગાળો 3 થી 300 સેકન્ડ વચ્ચે હોવો જોઈએ.' };

    const start = localInputToDate($('mgAdStart').value);
    const expiry = localInputToDate($('mgAdExpiry').value);
    if (!start) return { error: 'શરૂ થવાની તારીખ જરૂરી છે.' };
    if (!expiry) return { error: 'સમાપ્તિ તારીખ જરૂરી છે.' };
    if (expiry.getTime() <= start.getTime()) {
      return { error: 'સમાપ્તિ તારીખ શરૂ થવાની તારીખ પછીની હોવી જોઈએ.' };
    }

    const priority = Number($('mgAdPriority').value || 0);
    if (!Number.isInteger(priority) || priority < 0 || priority > 9999) {
      return { error: 'પ્રાયોરિટી 0 થી 9999 વચ્ચેની પૂર્ણાંક હોવી જોઈએ.' };
    }

    const order = Number($('mgAdOrder').value || 0);
    if (!Number.isInteger(order) || order < 0 || order > 9999) {
      return { error: 'ક્રમ 0 થી 9999 વચ્ચેનો પૂર્ણાંક હોવો જોઈએ.' };
    }

    const clickUrl = String($('mgAdClickUrl').value || '').trim();
    if (!isSafeClickUrl(clickUrl)) {
      return { error: 'ક્લિક URL https:// થી શરૂ થતું પૂર્ણ લિંક હોવું જોઈએ.' };
    }

    return {
      value: { title, placement, duration, start, expiry, priority, order, clickUrl }
    };
  }

  /* ---------------------------------------------------------------- saving */

  async function save() {
    const checked = validateForm();
    if (checked.error) {
      setStatus(checked.error, 'error');
      return;
    }

    const { title, placement, duration, start, expiry, priority, order, clickUrl } =
      checked.value;

    const file = $('mgAdFile').files && $('mgAdFile').files[0];
    const mediaType = currentMediaType();

    if (!editingId && !file) {
      setStatus('નવી જાહેરાત માટે ઇમેજ અથવા વિડિયો ફાઇલ પસંદ કરો.', 'error');
      return;
    }

    if (file) {
      const mediaCheck = validateAdMedia(mediaType, file);
      if (!mediaCheck.ok) {
        setStatus(mediaCheck.error, 'error');
        return;
      }
    }

    if (mediaType === 'video' && !isVideoCloudinaryConfigured()) {
      setStatus('વિડિયો પ્રીસેટ Cloudinary માં ગોઠવાયેલું નથી.', 'error');
      return;
    }

    const saveBtn = $('mgAdSave');
    saveBtn.disabled = true;
    setStatus('સાચવી રહ્યા છીએ…', 'busy');

    try {
      let media = null;
      if (file) {
        setStatus('મીડિયા અપલોડ થઈ રહ્યું છે… 0%', 'busy');
        const uploaded = await uploadToCloudinary(file, mediaType, (pct) => {
          setStatus(`મીડિયા અપલોડ થઈ રહ્યું છે… ${pct}%`, 'busy');
        });
        media = {
          url: uploaded.secure_url,
          publicId: uploaded.public_id || '',
          format: uploaded.format || '',
          bytes: Number(uploaded.bytes) || 0,
          mediaType
        };
      }

      const base = {
        title,
        placement,
        durationSeconds: duration,
        startAt: start,
        expiryAt: expiry,
        enabled: $('mgAdEnabled').checked === true,
        priority,
        order,
        clickUrl,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser ? currentUser.uid : ''
      };

      if (media) {
        base.mediaType = media.mediaType;
        base.url = media.url;
        base.publicId = media.publicId;
        base.format = media.format;
        base.bytes = media.bytes;
      }

      if (editingId) {
        await updateDoc(doc(db, AD_COLLECTION, editingId), base);
        setStatus('જાહેરાત અપડેટ થઈ ગઈ.', 'ok');
      } else {
        await addDoc(collection(db, AD_COLLECTION), {
          ...base,
          createdAt: serverTimestamp(),
          createdBy: currentUser ? currentUser.uid : ''
        });
        setStatus('જાહેરાત પ્રકાશિત થઈ ગઈ.', 'ok');
      }

      resetForm();
      await loadRows();
      if (window.mgAdManager && typeof window.mgAdManager.refresh === 'function') {
        window.mgAdManager.refresh();
      }
    } catch (error) {
      const code = error && error.code ? error.code : '';
      if (code === 'permission-denied') {
        setStatus('પરવાનગી નકારી: ફક્ત એડમિન જાહેરાત સાચવી શકે છે.', 'error');
      } else {
        setStatus((error && error.message) || 'સાચવવામાં ભૂલ થઈ.', 'error');
      }
    } finally {
      saveBtn.disabled = false;
    }
  }

  /* ---------------------------------------------------------------- listing */

  function statePill(ad) {
    const state = adState(ad);
    const labels = {
      live: 'લાઇવ',
      scheduled: 'શેડ્યુલ્ડ',
      expired: 'સમાપ્ત',
      disabled: 'બંધ'
    };
    const pill = document.createElement('span');
    pill.className = `mg-ad-pill state-${state}`;
    pill.textContent = labels[state] || state;
    return pill;
  }

  function formatDate(ms) {
    if (!ms || Number.isNaN(ms)) return '—';
    const d = new Date(ms);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }

  function buildRow(ad) {
    const row = document.createElement('div');
    row.className = 'mg-ad-row';
    row.dataset.adId = ad.id;

    const thumb = document.createElement('img');
    thumb.className = 'mg-ad-thumb';
    thumb.src = ad.url || '';
    thumb.alt = ad.title || 'જાહેરાત';
    thumb.loading = 'lazy';
    row.appendChild(thumb);

    const body = document.createElement('div');
    body.className = 'mg-ad-row-body';

    const titleEl = document.createElement('div');
    titleEl.className = 'mg-ad-row-title';
    titleEl.textContent = ad.title || '(શીર્ષક વગર)';
    titleEl.appendChild(document.createTextNode(' '));
    titleEl.appendChild(statePill(ad));
    body.appendChild(titleEl);

    const meta = document.createElement('div');
    meta.className = 'mg-ad-meta';
    const lines = [
      `સ્થાન: ${adPlacementLabel(ad.placement)}`,
      `પ્રકાર: ${ad.mediaType === 'video' ? 'વિડિયો' : 'ઇમેજ'} · સમય: ${Number(ad.durationSeconds) || 0} સેકન્ડ`,
      `શરૂ: ${formatDate(toMillis(ad.startAt))} · સમાપ્તિ: ${formatDate(toMillis(ad.expiryAt))}`,
      `પ્રાયોરિટી: ${Number(ad.priority) || 0} · ક્રમ: ${Number(ad.order) || 0}`
    ];
    if (ad.clickUrl) lines.push(`લિંક: ${ad.clickUrl}`);
    lines.forEach((line) => {
      const p = document.createElement('div');
      p.textContent = line;
      meta.appendChild(p);
    });
    body.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'mg-ad-row-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'સંપાદિત કરો';
    editBtn.addEventListener('click', () => fillForm(ad));
    actions.appendChild(editBtn);

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.textContent = ad.enabled ? 'બંધ કરો' : 'સક્રિય કરો';
    toggleBtn.addEventListener('click', () => toggleEnabled(ad));
    actions.appendChild(toggleBtn);

    const replaceBtn = document.createElement('button');
    replaceBtn.type = 'button';
    replaceBtn.textContent = 'મીડિયા બદલો';
    replaceBtn.addEventListener('click', () => startReplace(ad));
    actions.appendChild(replaceBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'કાઢી નાખો';
    deleteBtn.addEventListener('click', () => removeAd(ad));
    actions.appendChild(deleteBtn);

    body.appendChild(actions);
    row.appendChild(body);
    return row;
  }

  async function loadRows() {
    const list = $('mgAdList');
    if (!list) return;
    setStatus('જાહેરાતો લોડ થઈ રહી છે…', 'busy');

    try {
      const snapshot = await getDocs(collection(db, AD_COLLECTION));
      rows = [];
      snapshot.forEach((docSnap) => rows.push({ ...(docSnap.data() || {}), id: docSnap.id }));
      rows = sortAds(rows);

      list.replaceChildren();
      if (!rows.length) {
        const empty = document.createElement('div');
        empty.className = 'mg-ad-empty';
        empty.textContent = 'હજી કોઈ જાહેરાત નથી. ઉપરનું ફોર્મ ભરીને પ્રથમ જાહેરાત ઉમેરો.';
        list.appendChild(empty);
      } else {
        rows.forEach((ad) => list.appendChild(buildRow(ad)));
      }
      setStatus(`${rows.length} જાહેરાત મળી.`, 'ok');
    } catch (error) {
      const code = error && error.code ? error.code : '';
      if (code === 'permission-denied') {
        setStatus('પરવાનગી નકારી: જાહેરાત જોવા માટે એડમિન લોગિન જરૂરી છે.', 'error');
      } else {
        setStatus((error && error.message) || 'જાહેરાતો લોડ થઈ શકી નહીં.', 'error');
      }
    }
  }

  async function toggleEnabled(ad) {
    try {
      await updateDoc(doc(db, AD_COLLECTION, ad.id), {
        enabled: ad.enabled !== true,
        updatedAt: serverTimestamp()
      });
      await loadRows();
    } catch (error) {
      setStatus((error && error.message) || 'સ્થિતિ બદલી શકાઈ નહીં.', 'error');
    }
  }

  async function removeAd(ad) {
    const ok = window.confirm(`જાહેરાત કાઢી નાખવી છે? "${ad.title || ad.id}"`);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, AD_COLLECTION, ad.id));
      if (editingId === ad.id) resetForm();
      await loadRows();
      setStatus('જાહેરાત કાઢી નાખવામાં આવી.', 'ok');
    } catch (error) {
      setStatus((error && error.message) || 'કાઢી શકાઈ નહીં.', 'error');
    }
  }

  function startReplace(ad) {
    replaceTargetId = ad.id;
    const picker = $('mgAdReplaceFile');
    if (!picker) return;
    picker.setAttribute('accept', AD_ACCEPT_ATTR[ad.mediaType === 'video' ? 'video' : 'image']);
    picker.value = '';
    picker.click();
  }

  async function handleReplaceFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file || !replaceTargetId) return;

    const target = rows.find((r) => r.id === replaceTargetId);
    const mediaType = target && target.mediaType === 'video' ? 'video' : 'image';

    const mediaCheck = validateAdMedia(mediaType, file);
    if (!mediaCheck.ok) {
      setStatus(mediaCheck.error, 'error');
      replaceTargetId = null;
      return;
    }

    setStatus('નવું મીડિયા અપલોડ થઈ રહ્યું છે… 0%', 'busy');
    try {
      const uploaded = await uploadToCloudinary(file, mediaType, (pct) => {
        setStatus(`નવું મીડિયા અપલોડ થઈ રહ્યું છે… ${pct}%`, 'busy');
      });
      await updateDoc(doc(db, AD_COLLECTION, replaceTargetId), {
        mediaType,
        url: uploaded.secure_url,
        publicId: uploaded.public_id || '',
        format: uploaded.format || '',
        bytes: Number(uploaded.bytes) || 0,
        updatedAt: serverTimestamp()
      });
      setStatus('મીડિયા બદલાઈ ગયું.', 'ok');
      await loadRows();
    } catch (error) {
      setStatus((error && error.message) || 'મીડિયા બદલી શકાયું નહીં.', 'error');
    } finally {
      replaceTargetId = null;
    }
  }

  /* ---------------------------------------------------------------- preview */

  function buildPreviewCard() {
    const title = String($('mgAdTitle').value || '').trim() || 'જાહેરાત';
    const placement = $('mgAdPlacement').value;
    const duration = readDuration();
    const clickUrl = String($('mgAdClickUrl').value || '').trim();
    const mediaType = currentMediaType();
    const file = $('mgAdFile').files && $('mgAdFile').files[0];
    const existing = editingId ? rows.find((r) => r.id === editingId) : null;

    const wrap = document.createElement('div');
    wrap.className = 'mg-adv';
    wrap.style.maxWidth = '560px';

    const card = document.createElement('div');
    card.className = 'mg-adv-card';

    const shell = document.createElement(clickUrl ? 'a' : 'div');
    shell.className = 'mg-adv-link';
    if (clickUrl && isSafeClickUrl(clickUrl)) {
      shell.href = clickUrl;
      shell.target = '_blank';
      shell.rel = 'noopener noreferrer';
    }

    const media = document.createElement(mediaType === 'video' ? 'video' : 'img');
    media.className = 'mg-adv-media';

    if (file) {
      media.src = URL.createObjectURL(file);
    } else if (existing && existing.url) {
      media.src = existing.url;
    } else {
      media.removeAttribute('src');
    }

    if (mediaType === 'video') {
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      media.setAttribute('playsinline', '');
      media.setAttribute('muted', '');
      media.setAttribute('controls', '');
      media.setAttribute('preload', 'metadata');
    } else {
      media.alt = title;
    }

    shell.appendChild(media);
    card.appendChild(shell);

    const badge = document.createElement('span');
    badge.className = 'mg-adv-badge';
    badge.textContent = 'જાહેરાત';
    card.appendChild(badge);

    const caption = document.createElement('span');
    caption.className = 'mg-adv-title';
    caption.textContent = title;
    card.appendChild(caption);

    wrap.appendChild(card);

    const note = document.createElement('div');
    note.className = 'mg-ad-meta';
    note.style.marginTop = '8px';
    note.textContent = `સ્થાન: ${adPlacementLabel(placement)} · ${duration || '?'} સેકન્ડ`;
    wrap.appendChild(note);

    return wrap;
  }

  function showPreview() {
    const box = $('mgAdPreview');
    if (!box) return;
    const checked = validateForm();
    if (checked.error) {
      setStatus(checked.error, 'error');
      return;
    }
    box.replaceChildren();
    const label = document.createElement('div');
    label.className = 'mg-ad-preview-label';
    label.textContent = 'પૂર્વાવલોકન (પ્રકાશિત નથી)';
    box.appendChild(label);
    box.appendChild(buildPreviewCard());
    box.hidden = false;
    setStatus('પૂર્વાવલોકન તૈયાર છે.', 'ok');
  }

  /* ------------------------------------------------------------------ init */

  function populateSelects() {
    const placement = $('mgAdPlacement');
    if (placement && !placement.options.length) {
      AD_PLACEMENTS.forEach((p) => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.label} — ${p.en}`;
        placement.appendChild(opt);
      });
    }

    const duration = $('mgAdDuration');
    if (duration && !duration.options.length) {
      AD_DURATION_PRESETS.forEach((secs) => {
        const opt = document.createElement('option');
        opt.value = String(secs);
        opt.textContent = `${secs} સેકન્ડ`;
        duration.appendChild(opt);
      });
      const custom = document.createElement('option');
      custom.value = 'custom';
      custom.textContent = 'કસ્ટમ…';
      duration.appendChild(custom);
    }
  }

  function wireEvents() {
    $('mgAdMediaType').addEventListener('change', syncMediaTypeUI);
    $('mgAdDuration').addEventListener('change', syncDurationUI);
    $('mgAdSave').addEventListener('click', save);
    $('mgAdPreviewBtn').addEventListener('click', showPreview);
    $('mgAdReset').addEventListener('click', () => {
      resetForm();
      $('mgAdPreview').hidden = true;
    });

    const replaceInput = $('mgAdReplaceFile');
    if (replaceInput) replaceInput.addEventListener('change', handleReplaceFile);
  }

  function boot(user) {
    currentUser = user;
    if (booted) return;
    booted = true;

    populateSelects();
    wireEvents();
    resetForm();

    if (!isCloudinaryConfigured()) {
      setStatus('Cloudinary કન્ફિગરેશન ઉપલબ્ધ નથી — અપલોડ શક્ય નથી.', 'error');
    }

    loadRows();
  }

  function init() {
    const panel = $('mgAdManagerPanel');
    if (!panel) return;

    try {
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          currentUser = null;
          return;
        }
        boot(user);
      });
    } catch (error) {
      setStatus('Firebase શરૂ થઈ શક્યું નહીં.', 'error');
      console.warn('[Maru Ghar] ad manager init failed:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
