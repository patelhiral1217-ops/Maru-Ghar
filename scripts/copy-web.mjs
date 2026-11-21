import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'www');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const publicFiles = [
  'index.html',
  'admin.html',
  'privacy.html',
  'download.html',
  'firebase-config.js',
  'manifest.webmanifest',
  'icon.ico',
  'icon.png',
  'maru-ghar-approved-app-icon.png'
];

for (const file of publicFiles) {
  const src = path.join(root, file);
  if (fs.existsSync(src) && fs.statSync(src).isFile()) {
    fs.copyFileSync(src, path.join(out, file));
  }
}

const assets = path.join(root, 'assets');
if (fs.existsSync(assets)) {
  fs.cpSync(assets, path.join(out, 'assets'), { recursive: true });
}

// Build the OTA loader bundle so a local preview matches the CI hosting build
// and never requests a missing assets/maru-ghar-ota.bundle.js (404).
let otaBuilt = false;
const otaSource = path.join(root, 'scripts', 'maru-ghar-ota.js');
if (fs.existsSync(otaSource)) {
  try {
    const { build } = await import('esbuild');
    await build({
      entryPoints: [otaSource],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      outfile: path.join(out, 'assets', 'maru-ghar-ota.bundle.js'),
      logLevel: 'silent'
    });
    otaBuilt = true;
    console.log('OTA loader bundle built into www/assets/maru-ghar-ota.bundle.js');
  } catch (error) {
    console.warn('OTA bundle skipped (esbuild unavailable):', error && error.message ? error.message : error);
  }
}

for (const required of [
  'index.html',
  'admin.html',
  'firebase-config.js',
  'assets/maru-ghar-backend.js',
  'assets/maru-ghar-extras.js',
  'assets/maru-ghar-form-steps.js',
  'assets/maru-ghar-polish.js',
  'assets/maru-ghar-delight.js',
  'assets/maru-ghar-submit-toggle.js',
  'assets/maru-ghar-file-mode.js',
  'assets/maru-ghar-discovery.js',
  'assets/maru-ghar-discovery.css',
  'assets/maru-ghar-ads.js',
  'assets/maru-ghar-content-admin.js',
  'assets/maru-ghar-site-content.js',
  'assets/maru-ghar-site-content.css',
  'assets/maru-ghar-admin-compact.js',
  'assets/maru-ghar-admin-compact.css',
  ...(otaBuilt ? ['assets/maru-ghar-ota.bundle.js'] : [])
]) {
  if (!fs.existsSync(path.join(out, required))) {
    throw new Error(`Hosting build missing required file: ${required}`);
  }
}

console.log('Maru Ghar Hosting files copied to www/.');
