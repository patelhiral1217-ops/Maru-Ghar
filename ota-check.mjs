import fs from 'node:fs';

const index = fs.readFileSync('index.html', 'utf8');
const updater = fs.readFileSync('scripts/maru-ghar-ota.js', 'utf8');
const apkWorkflow = fs.readFileSync('.github/workflows/android-apk.yml', 'utf8');
const hostingWorkflow = fs.readFileSync('.github/workflows/deploy-firebase.yml', 'utf8');

const checks = [
  ['index loads the OTA module', /maru-ghar-ota\.bundle\.js/.test(index)],
  ['native launch confirms app-ready before update fetch', updater.indexOf('notifyAppReady()') >= 0 && updater.indexOf('notifyAppReady()') < updater.indexOf('fetch(OTA_MANIFEST')],
  ['OTA manifest is HTTPS and fixed to Firebase Hosting', /https:\/\/maru-ghar-gandhinagar-8dbe4\.web\.app\/ota\/latest\.json/.test(updater)],
  ['bundle URL is restricted to the trusted HTTPS host', /bundleUrl\.origin !== OTA_ORIGIN/.test(updater) && /bundleUrl\.protocol !== 'https:'/.test(updater)],
  ['OTA applies at next launch, not during active use', /CapacitorUpdater\.next\(\{ id: bundle\.id \}\)/.test(updater)],
  ['APK workflow installs Capacitor updater v7', /@capgo\/capacitor-updater@\^7/.test(apkWorkflow)],
  ['Hosting workflow builds and publishes OTA bundle', /ota\/bundles/.test(hostingWorkflow) && /latest\.json/.test(hostingWorkflow)]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
