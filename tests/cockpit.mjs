import assert from 'node:assert/strict';
import {createState,advance,call,decide} from '../dist/cockpit/model.js';
const s=createState();assert.equal(advance(s,0).length,1);assert(call(s,'cockpit'));assert(!call(s,'cockpit'));assert(!call(s,'bad'));advance(s,6);assert.equal(s.pending.length,1);advance(s,1);assert.equal(s.pending.length,0);advance(s,80);assert(s.log.some(e=>e.text.includes('Minister hat den Abschuss abgelehnt')));assert(call(s,'lauterbach'));advance(s,7);assert(s.log.at(-1).text.includes('Nicht-Abschussbefehl gilt'));advance(s,1000);assert.equal(s.elapsed,180);assert(!s.ended);assert(!call(s,'kabine'));assert(decide(s,'nicht'));assert(!decide(s,'schiessen'));assert.deepEqual(advance(s,20),[]);
for(const c of ['schiessen','nicht','offen']){const run=createState();advance(run,130);assert(decide(run,c));assert.equal(run.choice,c);}
console.log('PASS: delayed calls; duplicate protection; clear refusal; descent; deadline without automatic choice; all endings immutable.');
