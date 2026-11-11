import fs from 'node:fs';
const backend=fs.readFileSync('assets/maru-ghar-backend.js','utf8');
const admin=fs.readFileSync('admin.html','utf8');
const rules=fs.readFileSync('firestore.rules','utf8');
const errors=[];
function extractFunction(source,name,args){
  const re=new RegExp(`function ${name}\\(${args}\\)\\s*\\{([^\\n]*)\\}`);
  const m=source.match(re); if(!m) throw new Error(`Missing function ${name}`);
  return new Function(args,m[1]);
}
try{
  const trusted=extractFunction(backend,'isTrustedMapsUrl','value');
  const adminTrusted=extractFunction(admin,'mgIsTrustedMapsUrl','value');
  const phone=extractFunction(backend,'phoneDigits','phone');
  const good=['https://www.google.com/maps/place/Test','https://maps.google.com/?q=Gandhinagar','https://maps.app.goo.gl/abc123','https://goo.gl/maps/abc123'];
  const bad=['http://www.google.com/maps','https://google.com.evil.example/maps','https://evil.example/?next=https://google.com/maps','javascript:alert(1)','not-a-url'];
  for(const u of good){if(!trusted(u)||!adminTrusted(u))errors.push(`Valid Maps URL rejected: ${u}`)}
  for(const u of bad){if(trusted(u)||adminTrusted(u))errors.push(`Untrusted Maps URL accepted: ${u}`)}
  const validPhones=['9876543210','09876543210','919876543210','+91 98765-43210'];
  for(const n of validPhones){if(phone(n)!=='919876543210')errors.push(`Valid Indian mobile normalized incorrectly: ${n}`)}
  for(const n of ['1234567890','987654321','+1 9876543210','9999999999999','']){if(phone(n)!=='')errors.push(`Invalid mobile accepted: ${n}`)}
}catch(e){errors.push(e.message)}
if(!backend.includes('if(isTrustedMapsUrl(l))'))errors.push('Public map link must fall back to generated Google Maps search for untrusted legacy links');
if(!backend.includes("location.href='tel:+'+digits"))errors.push('Call action must use normalized international mobile digits');
if(!backend.includes("'noopener,noreferrer'"))errors.push('WhatsApp external window must use noopener,noreferrer');
if(!backend.includes('if(!digits){alert('))errors.push('Invalid legacy owner mobile must be blocked before call/WhatsApp');
if(!admin.includes('if(m&&!mgIsTrustedMapsUrl(m))'))errors.push('Admin must validate Maps URL before saving');
const mapRules=(rules.match(/mapLink\.matches\('\^https:\/\//g)||[]).length;
if(mapRules!==2)errors.push(`Both listing create and admin map update rules must validate trusted domains (found ${mapRules})`);
if(rules.includes("mapLink.matches('^https://.*')"))errors.push('Broad arbitrary HTTPS map URL rule remains');
if(errors.length){console.error('MAPS + WHATSAPP CHECK FAILED');errors.forEach(e=>console.error(' - '+e));process.exit(1)}
console.log('MAPS + WHATSAPP CHECK PASS — trusted map hosts, hostile URL rejection, legacy link fallback, Indian mobile normalization, invalid-number blocking, safe external WhatsApp launch, and matching Firestore rules.');
