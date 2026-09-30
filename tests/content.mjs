import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ROLES,PHASES,VARIANTS,FACTS,LAW_GUIDES,VERDICT_FIELDS} from '../dist/spielraum/content.js';
const laws=JSON.parse(fs.readFileSync('dist/spielraum/laws.json','utf8'));
assert.equal(Object.keys(ROLES).length,6);assert.equal(PHASES.length,11);assert.equal(FACTS.length,12);assert.equal(VERDICT_FIELDS.length,8);
assert.equal(new Set(FACTS.map(f=>f[0])).size,12);
for(const p of PHASES)assert(p[2]==='alle'||ROLES[p[2]]);
for(const [title,label,law] of LAW_GUIDES)assert(laws[law].some(n=>n.label===label),title);
for(const law of ['gg','stgb','stpo'])for(const n of laws[law]){assert(n.text.trim());assert(n.url.startsWith('https://www.gesetze-im-internet.de/'+law+'/'));}
for(const label of ['Art 1','Art 2','Art 20','Art 79','Art 97','Art 103','Art 146'])assert(laws.gg.some(n=>n.label===label));
assert(laws.gg.length>=190);assert.equal(laws.stgb.length,8);assert.equal(laws.stpo.length,9);
assert(laws.gg.find(n=>n.label==='Art 1').text.includes('unantastbar'));
assert(laws.stgb.find(n=>n.label==='§ 35').text.includes('nahestehenden Person'));
for(const [id,v] of Object.entries(VARIANTS))if(id!=='original')assert(v.text.startsWith('Erfundene Abweichung:'));
const data=fs.readFileSync('dist/data.js','utf8');for(const f of FACTS)assert(data.includes("id:'"+f[4]+"'")||data.includes('id: "'+f[4]+'"')||data.includes('id:"'+f[4]+'"'),f[4]);
console.log('PASS: six roles, eleven phases, source-backed facts, explicit variants, complete GG and 17 legal norms.');
