/* Maru Ghar — Advertisement Manager checks.
 *
 * Mixes real unit tests (the shared constants module is imported and executed)
 * with source-contract assertions for the parts that only make sense in a
 * browser. Every assertion maps to a user requirement, so a regression names
 * the requirement it broke.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';

import {
  AD_COLLECTION,
  AD_PLACEMENTS,
  AD_PLACEMENT_IDS,
  AD_DURATION_PRESETS,
  AD_MIN_DURATION,
  AD_MAX_DURATION,
  AD_MAX_BYTES,
  AD_MAX_CYCLES,
  parseAdDuration,
  validateAdMedia,
  isSafeClickUrl,
  isAdLive,
  sortAds
} from './assets/maru-ghar-ad-constants.js';

const read = (p) => fs.readFileSync(p, 'utf8');

const rules = read('firestore.rules');
const adminHtml = read('admin.html');
const indexHtml = read('index.html');
const adminJs = read('assets/maru-ghar-ad-manager-admin.js');
const rendererJs = read('assets/maru-ghar-ad-manager.js');
const rendererCss = read('assets/maru-ghar-ad-manager.css');
const copyWeb = read('scripts/copy-web.mjs');
const pkg = JSON.parse(read('package.json'));

let checks = 0;
const ok = (condition, message) => {
  checks += 1;
  assert.ok(condition, message);
};

/* ------------------------------------------------------------------ *
 * 1. Admin authorization (Firestore is the real gate)
 * ------------------------------------------------------------------ */
const adRulesStart = rules.indexOf('match /advertisements/');
ok(adRulesStart > -1, 'Firestore rules must declare a /advertisements/ collection');

const adRules = rules.slice(adRulesStart);
ok(adRules.includes('isAdmin()'), 'Advertisement writes must be gated by isAdmin()');
ok(
  !/allow\s+write\s*:\s*if\s+true/.test(adRules),
  'Advertisements must never be world-writable'
);
ok(
  !/request\.time/.test(adRules),
  'Ad rule must not compare request.time (rules are not filters: it would reject the whole list query)'
);
ok(
  /enabled\s*==\s*true/.test(adRules),
  'Public visitors may only read enabled advertisements'
);
ok(
  adRules.includes("'image'") && adRules.includes("'video'"),
  'Rules must whitelist mediaType image/video'
);
ok(
  /durationSeconds/.test(adRules) && /startAt/.test(adRules) && /expiryAt/.test(adRules),
  'Rules must validate duration and the start/expiry window'
);

/* ------------------------------------------------------------------ *
 * 2. Placement catalogue and duration configuration
 * ------------------------------------------------------------------ */
ok(AD_PLACEMENTS.length === 7, `Expected 7 placements, found ${AD_PLACEMENTS.length}`);
for (const required of [
  'homeTop',
  'homeMiddle',
  'listingsInline',
  'searchResults',
  'propertyDetails'
]) {
  ok(AD_PLACEMENT_IDS.includes(required), `Required placement missing: ${required}`);
}
ok(AD_PLACEMENT_IDS.includes('cityPage') && AD_PLACEMENT_IDS.includes('offers'),
  'Extra predefined sections (city page, offers) must exist');

for (const preset of [5, 10, 15, 30, 60]) {
  ok(AD_DURATION_PRESETS.includes(preset), `Duration preset ${preset}s must be offered`);
}
ok(AD_MIN_DURATION === 3 && AD_MAX_DURATION === 300, 'Custom duration bounds must be 3–300s');

/* Duration parsing: presets, custom values and rejections. */
ok(parseAdDuration('10') === 10, 'Duration "10" must parse to 10');
ok(parseAdDuration(30) === 30, 'Numeric duration 30 must parse to 30');
ok(parseAdDuration('5') === 5, 'Duration "5" must parse to 5');
ok(parseAdDuration(String(AD_MAX_DURATION)) === AD_MAX_DURATION, 'Upper bound must be accepted');
ok(parseAdDuration('2') === null, 'Below-minimum duration must be rejected');
ok(parseAdDuration('301') === null, 'Above-maximum duration must be rejected');
ok(parseAdDuration('abc') === null, 'Non-numeric duration must be rejected');
ok(parseAdDuration('') === null, 'Empty duration must be rejected');
ok(parseAdDuration('10.5') === null || parseAdDuration('10.5') === 10, 'Fractional duration must not crash');

/* ------------------------------------------------------------------ *
 * 3. Upload validation (image + video, type and size)
 * ------------------------------------------------------------------ */
ok(AD_MAX_BYTES.image === 8 * 1024 * 1024, 'Image cap must be 8 MB');
ok(AD_MAX_BYTES.video === 25 * 1024 * 1024, 'Video cap must be 25 MB');

const file = (type, size) => ({ type, size });

ok(validateAdMedia('image', file('image/jpeg', 2 * 1024 * 1024)), 'JPG upload must be accepted');
ok(validateAdMedia('image', file('image/png', 1 * 1024 * 1024)), 'PNG upload must be accepted');
ok(validateAdMedia('image', file('image/webp', 3 * 1024 * 1024)), 'WebP upload must be accepted');
ok(validateAdMedia('video', file('video/mp4', 12 * 1024 * 1024)), 'MP4 upload must be accepted');

ok(!validateAdMedia('image', file('image/gif', 1024)), 'GIF must be rejected (not a supported image type)');
ok(!validateAdMedia('image', file('image/jpeg', 9 * 1024 * 1024)), 'Oversized image must be rejected');
ok(!validateAdMedia('video', file('video/mp4', 26 * 1024 * 1024)), 'Oversized video must be rejected');
ok(!validateAdMedia('video', file('image/png', 1024)), 'Image offered as video must be rejected');
ok(!validateAdMedia('image', file('video/mp4', 1024)), 'Video offered as image must be rejected');
ok(!validateAdMedia('image', null), 'Missing file must be rejected');

/* ------------------------------------------------------------------ *
 * 4. Click-through URL safety
 * ------------------------------------------------------------------ */
ok(isSafeClickUrl('https://example.com/offer'), 'HTTPS click URL must be allowed');
ok(!isSafeClickUrl('javascript:alert(1)'), 'javascript: click URL must be rejected');
ok(!isSafeClickUrl('data:text/html,<script>alert(1)</script>'), 'data: click URL must be rejected');
ok(!isSafeClickUrl(''), 'Empty click URL must be rejected');

/* ------------------------------------------------------------------ *
 * 5. Scheduling: disabled / scheduled / expired ads never render
 * ------------------------------------------------------------------ */
const now = Date.UTC(2026, 10, 21, 12, 0, 0);
const day = 24 * 60 * 60 * 1000;

const base = {
  mediaType: 'image',
  url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  placement: 'homeTop',
  durationSeconds: 10
};

ok(isAdLive({ ...base, enabled: true }, now), 'Enabled ad with no dates must be live');
ok(!isAdLive({ ...base, enabled: false }, now), 'Disabled ad must never render');
ok(
  isAdLive({ ...base, enabled: true, startAt: new Date(now - day), expiryAt: new Date(now + day) }, now),
  'Ad inside its date window must be live'
);
ok(
  !isAdLive({ ...base, enabled: true, startAt: new Date(now + day) }, now),
  'Ad that has not started yet must not render'
);
ok(
  !isAdLive({ ...base, enabled: true, expiryAt: new Date(now - day) }, now),
  'Expired ad must not render'
);
ok(
  isAdLive({ ...base, enabled: true, startAt: new Date(now - day) }, now),
  'Ad started in the past with no expiry must stay live'
);

/* ------------------------------------------------------------------ *
 * 6. Priority and display order
 * ------------------------------------------------------------------ */
const ordered = sortAds([
  { id: 'c', priority: 1, order: 0 },
  { id: 'a', priority: 9, order: 5 },
  { id: 'b', priority: 9, order: 1 }
]);
ok(ordered[0].id === 'b', 'Higher priority wins; equal priority falls back to lower order');
ok(ordered[1].id === 'a', 'Second slot must follow priority then order');
ok(ordered[2].id === 'c', 'Lowest priority renders last');
ok(ordered.length === 3, 'Sorting must not drop advertisements');

/* ------------------------------------------------------------------ *
 * 7. Renderer contract: placement, duration, expiry, no swipe capture
 * ------------------------------------------------------------------ */
ok(rendererJs.includes(AD_COLLECTION), 'Renderer must query the advertisements collection');
ok(
  /where\(\s*'enabled'\s*,\s*'=='\s*,\s*true\s*\)/.test(rendererJs),
  'Renderer must filter on enabled == true (client-side date window)'
);
ok(rendererJs.includes('isAdLive'), 'Renderer must drop expired/scheduled ads before display');
ok(rendererJs.includes('durationSeconds'), 'Renderer must honour each ad\'s own duration');
ok(/AD_MAX_CYCLES/.test(rendererJs), 'Rotation must be bounded so ads cannot flash forever');
ok(rendererJs.includes('data-mg-ad-manager'), 'Renderer must bind to the documented mount attribute');

for (const forbidden of ['touchstart', 'touchmove', 'pointerdown', 'setPointerCapture']) {
  ok(
    !rendererJs.includes(forbidden),
    `Renderer must not attach ${forbidden} — property photo swipes must stay untouched`
  );
}

/* Video: muted autoplay with a real fallback and visible controls. */
ok(/media\.muted\s*=\s*true/.test(rendererJs), 'Video ads must start muted');
ok(rendererJs.includes('playsinline'), 'Video ads must be inline on mobile');
ok(rendererJs.includes("setAttribute('controls'"), 'Video ads must expose controls');
ok(/\.catch\(/.test(rendererJs), 'Blocked autoplay must be caught, not left as a frozen frame');
ok(rendererJs.includes('mg-adv-play'), 'Blocked autoplay must offer a play button fallback');

/* Ads must never break the site. */
ok(/catch\s*\(/.test(rendererJs) && rendererJs.includes('advertisements unavailable'),
  'Renderer must swallow its own failures so listings keep working');

/* Click-through hardening in the renderer. */
ok(rendererJs.includes('noopener') && rendererJs.includes('noreferrer'),
  'Ad links must be opened with noopener/noreferrer');
ok(rendererJs.includes('sponsored'), 'Ad links must be marked sponsored');

/* ------------------------------------------------------------------ *
 * 8. Stylesheet: inline flow, no overlay, swipe-safe
 * ------------------------------------------------------------------ */
ok(/touch-action\s*:\s*pan-y/.test(rendererCss), 'Ad container must declare touch-action: pan-y');
ok(!/position\s*:\s*fixed/.test(rendererCss), 'Ad styles must never use position: fixed (no overlay)');
ok(!/z-index\s*:\s*9{3,}/.test(rendererCss), 'Ad styles must not float above site chrome');
ok(/@media/.test(rendererCss), 'Ad styles must be responsive');
ok(/prefers-reduced-motion/.test(rendererCss), 'Ads must respect reduced-motion preference');

/* ------------------------------------------------------------------ *
 * 9. Admin panel wiring and authorization surface
 * ------------------------------------------------------------------ */
const adminMainAt = adminHtml.indexOf('id="adminMain"');
const panelAt = adminHtml.indexOf('id="mgAdManagerPanel"');
ok(adminMainAt > -1, 'admin.html must keep its #adminMain container');
ok(panelAt > adminMainAt, 'Advertisement Manager must live inside the authenticated admin area');
ok(panelAt > -1, 'Advertisement Manager panel must exist in admin.html');

for (const id of [
  'mgAdForm', 'mgAdTitle', 'mgAdMediaType', 'mgAdFile', 'mgAdFileHint',
  'mgAdPlacement', 'mgAdDuration', 'mgAdDurationCustom', 'mgAdStart', 'mgAdExpiry',
  'mgAdEnabled', 'mgAdPriority', 'mgAdOrder', 'mgAdClickUrl',
  'mgAdPreview', 'mgAdPreviewBtn', 'mgAdSave', 'mgAdReset', 'mgAdStatus',
  'mgAdList', 'mgAdReplaceFile'
]) {
  ok(adminHtml.includes(`id="${id}"`), `Admin panel element missing: #${id}`);
}

/* Every placement must be selectable in the admin form. */
for (const id of AD_PLACEMENT_IDS) {
  ok(
    new RegExp(`<option value="${id}"`).test(adminHtml),
    `Admin placement dropdown must offer ${id}`
  );
}
for (const preset of AD_DURATION_PRESETS) {
  ok(
    new RegExp(`<option value="${preset}"`).test(adminHtml),
    `Admin duration dropdown must offer ${preset}s`
  );
}
ok(adminHtml.includes('value="custom"'), 'Admin duration dropdown must offer a custom option');
ok(/accept="[^"]*image\/webp[^"]*"/.test(adminHtml), 'File input must accept WebP');
ok(/accept="[^"]*video\/mp4[^"]*"/.test(adminHtml), 'File input must accept MP4');

/* Uploads reuse the existing Cloudinary architecture; no secret is introduced. */
ok(adminJs.includes('api.cloudinary.com'), 'Uploads must use the project\'s existing Cloudinary account');
ok(adminJs.includes('upload_preset'), 'Uploads must use an unsigned upload preset');
for (const secret of ['api_secret', 'apiSecret', 'API_SECRET', 'cloudinary://']) {
  ok(!adminJs.includes(secret), `Admin controller must not reference secret material (${secret})`);
}
ok(!/AIza[A-Za-z0-9_-]{30,}/.test(adminJs), 'Admin controller must not embed API keys');

/* Full CRUD surface required by the brief. */
for (const [needle, label] of [
  ['deleteDoc', 'delete'],
  ['updateDoc', 'edit'],
  ['addDoc', 'create']
]) {
  ok(adminJs.includes(needle), `Admin controller must support ${label}`);
}
ok(adminJs.includes('AD_PLACEMENTS.some'), 'Placement must be validated against the shared catalogue');

/* ------------------------------------------------------------------ *
 * 10. Public mounts and hosting manifest
 * ------------------------------------------------------------------ */
for (const placement of ['homeTop', 'homeMiddle', 'listingsInline', 'searchResults', 'offers']) {
  ok(
    indexHtml.includes(`data-mg-ad-manager="${placement}"`),
    `Homepage mount missing for placement ${placement}`
  );
}
ok(
  indexHtml.includes('data-mg-ad-slot="homeTop"') &&
    indexHtml.includes('data-mg-ad-slot="listingsInline"'),
  'Existing AdSense slots must remain untouched'
);
ok(indexHtml.includes('assets/maru-ghar-ad-manager.js'), 'Homepage must load the ad renderer');
ok(indexHtml.includes('assets/maru-ghar-ad-manager.css'), 'Homepage must load the ad stylesheet');
ok(adminHtml.includes('assets/maru-ghar-ad-manager-admin.js'), 'Admin page must load the ad controller');

for (const asset of [
  'assets/maru-ghar-ad-constants.js',
  'assets/maru-ghar-ad-manager.js',
  'assets/maru-ghar-ad-manager.css',
  'assets/maru-ghar-ad-manager-admin.js',
  'assets/maru-ghar-ad-manager-admin.css'
]) {
  ok(copyWeb.includes(asset), `Hosting manifest must ship ${asset}`);
  ok(fs.existsSync(asset), `Asset referenced by the manifest must exist: ${asset}`);
}

/* ------------------------------------------------------------------ *
 * 11. The existing suite must not have been weakened
 * ------------------------------------------------------------------ */
const chain = pkg.scripts.test;
for (const original of [
  'smoke-check.mjs', 'i18n-check.mjs', 'i18n-coverage-check.mjs',
  'i18n-dom-regression-check.mjs', 'ui-regression-check.mjs', 'discovery-check.mjs',
  'ads-check.mjs', 'customer-auth-check.mjs', 'verification-audit-check.mjs',
  'maps-whatsapp-check.mjs', 'notifications-audit-check.mjs',
  'final-firestore-rules-check.mjs', 'firebase-deploy-preflight.mjs',
  'ota-check.mjs', 'master-admin-check.mjs', 'swipe-check.mjs'
]) {
  ok(chain.includes(original), `Existing test must remain in npm test: ${original}`);
}
ok(chain.includes('ads-manager-check.mjs'), 'The new advertisement checks must run in npm test');
ok(pkg.scripts['test:swipe'], 'The standalone swipe test must remain available');

console.log(
  `ADS MANAGER CHECK PASS — ${checks} assertions. ` +
    `${AD_PLACEMENTS.length} placements, ${AD_DURATION_PRESETS.join('/')}s presets, ` +
    `image ≤${AD_MAX_BYTES.image / 1048576}MB, video ≤${AD_MAX_BYTES.video / 1048576}MB, ` +
    `rotation capped at ${AD_MAX_CYCLES} cycles, no touch capture.`
);
