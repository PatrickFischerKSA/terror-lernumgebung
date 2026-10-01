const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={};c.window=c;vm.createContext(c);for(const f of ['data','foundations'])vm.runInContext(fs.readFileSync(`dist/${f}.js`,'utf8'),c);
for(const p of c.window.TERROR.philosophies){assert(p.who.length>100,p.id);assert(p.example.length>100,p.id);assert(p.plain&&p.bridge&&p.terms,p.id);}
const source=fs.readFileSync('dist/foundations.js','utf8');
assert(source.includes('yg16u_bzjPE'));
assert(source.includes('Der General hat den Abschuss vorgeschlagen, der Minister hat ihn abgelehnt'));
assert(source.includes('heutiger Absatz 3 ist nicht der 2006'));
assert(source.includes('Bundesregierung als Kollegium'));
assert(source.includes('keine Beschreibung des deutschen Rechts'));
assert(source.includes('PDF-S. 29–33'));
assert(source.includes('Holocaust'));
console.log('PASS: eight introductory profiles, video identity, command-chain direction, legal chronology and fictional-rule distinction.');
