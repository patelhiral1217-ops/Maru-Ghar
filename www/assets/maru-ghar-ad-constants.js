/* Maru Ghar — Advertisement Manager shared constants.
   Used by both the admin controller and the public renderer so the two can
   never drift apart on placement ids, duration limits or media rules. */

export const AD_COLLECTION = 'advertisements';

/* Predefined placements. `id` is the stored value and must stay in sync with
   the hasOnly/`in` whitelist in firestore.rules. */
export const AD_PLACEMENTS = [
  { id: 'homeTop', label: 'હોમપેજ ટોચ', en: 'Homepage top' },
  { id: 'homeMiddle', label: 'હોમપેજ મધ્ય', en: 'Homepage middle' },
  { id: 'listingsInline', label: 'લિસ્ટિંગ વચ્ચે', en: 'Between property listings' },
  { id: 'searchResults', label: 'શોધ પરિણામ', en: 'Search results' },
  { id: 'propertyDetails', label: 'પ્રોપર્ટી વિગત પૃષ્ઠ', en: 'Property details page' },
  { id: 'cityPage', label: 'શહેર પૃષ્ઠ', en: 'City page' },
  { id: 'offers', label: 'ઓફર / સ્કીમ વિભાગ', en: 'Offers section' }
];

export const AD_PLACEMENT_IDS = AD_PLACEMENTS.map((p) => p.id);

/* Duration presets offered as buttons; a custom value from 3 to 300 is allowed. */
export const AD_DURATION_PRESETS = [5, 10, 15, 30, 60];
export const AD_MIN_DURATION = 3;
export const AD_MAX_DURATION = 300;
export const AD_DEFAULT_DURATION = 10;

export const AD_MAX_BYTES = { image: 8 * 1024 * 1024, video: 25 * 1024 * 1024 };
export const AD_ACCEPTED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4']
};
export const AD_ACCEPT_ATTR = {
  image: 'image/jpeg,image/png,image/webp',
  video: 'video/mp4'
};

/* How many times one placement may cycle through its ads per page load.
   Keeps a busy placement from turning into a permanent slideshow. */
export const AD_MAX_CYCLES = 3;

export function adPlacement(id) {
  return AD_PLACEMENTS.find((p) => p.id === id) || null;
}

export function adPlacementLabel(id) {
  const p = adPlacement(id);
  return p ? p.label : String(id || '');
}

/* Returns an integer number of seconds, or null when the value is not usable. */
export function parseAdDuration(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const secs = Math.round(n);
  if (secs < AD_MIN_DURATION || secs > AD_MAX_DURATION) return null;
  return secs;
}

/* Client-side media gate. Cloudinary still enforces its own limits; this just
   fails fast with a clear message instead of a slow rejected upload. */
export function validateAdMedia(mediaType, file) {
  if (!file) return { ok: false, error: 'ફાઇલ પસંદ કરો.' };
  const allowed = AD_ACCEPTED_TYPES[mediaType];
  if (!allowed) return { ok: false, error: 'અજાણ્યો મીડિયા પ્રકાર.' };
  if (!allowed.includes(file.type)) {
    return {
      ok: false,
      error:
        mediaType === 'image'
          ? 'ફક્ત JPG, PNG અથવા WebP ઇમેજ માન્ય છે.'
          : 'ફક્ત MP4 વિડિયો માન્ય છે.'
    };
  }
  const max = AD_MAX_BYTES[mediaType];
  if (file.size > max) {
    const mb = Math.round(max / (1024 * 1024));
    return { ok: false, error: `ફાઇલ ખૂબ મોટી છે. વધુમાં વધુ ${mb} MB.` };
  }
  return { ok: true, error: '' };
}

export function isSafeClickUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) return true; // optional field
  if (!/^https:\/\/[^\s]+$/i.test(raw)) return false;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/* Firestore Timestamp | Date | {seconds,nanoseconds} | number -> epoch ms. */
export function toMillis(value) {
  if (!value && value !== 0) return NaN;
  if (typeof value === 'number') return value;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  return NaN;
}

export function isAdLive(ad, nowMs = Date.now()) {
  if (!ad || ad.enabled !== true) return false;
  const start = toMillis(ad.startAt);
  const expiry = toMillis(ad.expiryAt);
  if (Number.isNaN(start) || Number.isNaN(expiry)) return false;
  return start <= nowMs && nowMs < expiry;
}

/* 'live' | 'scheduled' | 'expired' | 'disabled' — drives the admin status pill. */
export function adState(ad, nowMs = Date.now()) {
  if (!ad || ad.enabled !== true) return 'disabled';
  const start = toMillis(ad.startAt);
  const expiry = toMillis(ad.expiryAt);
  if (Number.isNaN(start) || Number.isNaN(expiry)) return 'scheduled';
  if (nowMs < start) return 'scheduled';
  if (nowMs >= expiry) return 'expired';
  return 'live';
}

/* Highest priority first, then lowest display order, then oldest first. */
export function sortAds(list) {
  return [...list].sort((a, b) => {
    const pa = Number(a.priority) || 0;
    const pb = Number(b.priority) || 0;
    if (pb !== pa) return pb - pa;
    const oa = Number(a.order) || 0;
    const ob = Number(b.order) || 0;
    if (oa !== ob) return oa - ob;
    return (toMillis(a.createdAt) || 0) - (toMillis(b.createdAt) || 0);
  });
}

/* <input type="datetime-local"> value -> Date, interpreted in local time. */
export function localInputToDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/* Date -> value for <input type="datetime-local">. */
export function dateToLocalInput(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(toMillis(date));
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
