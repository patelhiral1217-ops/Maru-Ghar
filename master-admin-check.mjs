import fs from 'node:fs';
const admin = fs.readFileSync('admin.html','utf8');
const home = fs.readFileSync('index.html','utf8');
const manager = fs.readFileSync('assets/maru-ghar-master-hero-admin.js','utf8');
const publicLoader = fs.readFileSync('assets/maru-ghar-home-showcase-config.js','utf8');
const rules = fs.readFileSync('firestore.rules','utf8');
const checks = [
  [admin.includes('id="mgHeroSlideManager"') && admin.includes('maru-ghar-master-hero-admin.js'), 'Homepage slideshow admin panel is not connected'],
  [admin.includes('mgHeroSlidesList') && admin.includes('mgHeroSlidesTrash'), 'Homepage slideshow list/trash UI is missing'],
  [manager.includes('onAuthStateChanged') && manager.includes('user?.uid !== ADMIN_UID'), 'Homepage slideshow admin access guard is missing'],
  [manager.includes('homeShowcaseSlides') && manager.includes('Cloudinary') && manager.includes('8 * 1024 * 1024'), 'Homepage slideshow storage/upload integration is missing'],
  [manager.includes('deletedAt:serverTimestamp()') && manager.includes('async function restore'), 'Homepage slideshow soft-delete/restore is missing'],
  [manager.includes('async function move') && manager.includes('↑ ઉપર') && manager.includes('↓ નીચે'), 'Mobile-friendly slideshow ordering controls are missing'],
  [admin.includes('mgHeroKeepBuiltIns') && manager.includes("settings','homeShowcase") && publicLoader.includes('keepBuiltIns'), 'Keep-existing-home-photos safety option is missing'],
  [home.includes('maru-ghar-home-showcase-config.js') && home.includes('window.__mgHeroSlidesReady'), 'Homepage slideshow public loader is not connected to rotation'],
  [publicLoader.includes("if (!items.length) return false") && publicLoader.includes("catch (error)"), 'Legacy homepage slideshow fallback is missing'],
  [rules.includes('match /homeShowcaseSlides/{slideId}') && rules.includes('allow read: if true;') && rules.includes('allow create, update: if isAdmin();') && rules.includes('allow delete: if false;'), 'Homepage slideshow Firestore access rules are missing or unsafe'],
  [admin.includes('mgHeaderBannerManager') && admin.includes('mgHeaderBannerImage'), 'Top header background controls are missing from Admin Panel'],
  [manager.includes("settings','homeHeader") && manager.includes('async function saveHeaderBanner') && manager.includes('async function resetHeaderBanner'), 'Top header background admin save/restore flow is missing'],
  [publicLoader.includes("settings','homeHeader") && publicLoader.includes("setProperty('background-image'"), 'Public homepage does not load the Admin-managed header background'],
];
const failed = checks.filter(([ok]) => !ok);
if (failed.length) { console.error('MASTER ADMIN CHECK FAILED'); failed.forEach(([,msg]) => console.error(' - '+msg)); process.exit(1); }
console.log('MASTER ADMIN CHECK PASS — '+checks.length+'/'+checks.length);
