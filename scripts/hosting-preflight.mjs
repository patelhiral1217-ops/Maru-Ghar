import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const web = path.join(root, 'www');
const pages = ['index.html', 'admin.html', 'privacy.html', 'download.html'];
const errors = [];

for (const page of pages) {
  const source = path.join(root, page);
  const deployed = path.join(web, page);
  if (!fs.existsSync(source)) errors.push(`Missing source page: ${page}`);
  if (!fs.existsSync(deployed)) errors.push(`Missing Hosting page: www/${page}`);
  if (fs.existsSync(source) && fs.existsSync(deployed) &&
      !fs.readFileSync(source).equals(fs.readFileSync(deployed))) {
    errors.push(`Hosting copy is out of sync: ${page}`);
  }
}

for (const file of ['firebase-config.js', 'manifest.webmanifest']) {
  if (!fs.existsSync(path.join(web, file))) errors.push(`Missing Hosting file: www/${file}`);
}

for (const page of pages) {
  const file = path.join(web, page);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)]
    .map(match => match[1].split('?')[0])
    .filter(ref => !/^(https?:|data:|mailto:|tel:|javascript:|#|\$\{)/i.test(ref));
  for (const ref of refs) {
    if (ref.startsWith('/')) continue;
    const target = path.resolve(web, ref);
    if (!target.startsWith(web + path.sep) && target !== web) continue;
    if (!fs.existsSync(target)) errors.push(`${page} references missing Hosting file: ${ref}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Hosting preflight passed: public pages and their local file references are present.');
