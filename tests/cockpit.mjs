import assert from 'node:assert/strict';
import {createState,advance,call,decide,sendRadio,interpretDecision} from '../dist/cockpit/model.js';
const s=createState();assert.equal(advance(s,0).length,1);assert(call(s,'cockpit'));assert(!call(s,'cockpit'));assert(!call(s,'bad'));advance(s,6);assert.equal(s.pending.length,1);advance(s,1);assert.equal(s.pending.length,0);advance(s,80);assert(s.log.some(e=>e.text.includes('Minister hat den Abschuss abgelehnt')));assert(call(s,'lauterbach'));advance(s,7);assert(s.log.at(-1).text.includes('Nicht-Abschussbefehl gilt'));advance(s,1000);assert.equal(s.elapsed,180);assert(!s.ended);assert(!call(s,'kabine'));assert(decide(s,'nicht'));assert(!decide(s,'schiessen'));assert.deepEqual(advance(s,20),[]);
for(const c of ['schiessen','nicht','offen']){const run=createState();advance(run,130);assert(decide(run,c));assert.equal(run.choice,c);}
console.log('PASS: delayed calls; duplicate protection; clear refusal; descent; deadline without automatic choice; all endings immutable.');

for(const text of ['Ich schiesse nicht.','Ich werde nicht schiessen.','Ich werde nicht zu schiessen versuchen.','Ich entscheide mich gegen den Abschuss.'])assert.equal(interpretDecision(text),'nicht',text);
for(const text of ['Soll ich schiessen?','Vielleicht werde ich schiessen','Ich schiesse auf keinen Fall','Ich schiesse nicht, aber ich schiesse doch','Wenn ich schiesse, dann …'])assert.equal(interpretDecision(text),null,text);
assert.equal(interpretDecision('Ich werde schiessen, weil ich die Gefahr sehe.'),'schiessen');
assert.equal(interpretDecision('Ich lasse die Entscheidung offen.'),'offen');
const chat=createState();advance(chat,0);assert(sendRadio(chat,'Lauterbach, wie lautet der Befehl?'));advance(chat,7);assert(chat.log.at(-1).text.includes('Verteidigungsminister'));advance(chat,80);assert(sendRadio(chat,'Lauterbach, ich frage erneut nach dem Befehl.'));advance(chat,7);assert(chat.log.at(-1).text.includes('Nicht-Abschussbefehl'));assert(sendRadio(chat,'Lufthansa, können Sie mich hören?'));advance(chat,7);assert(chat.log.at(-1).text.includes('Rauschen'));assert(sendRadio(chat,'<script>alert(1)</script>'));advance(chat,7);assert(chat.log.at(-1).text.includes('nicht klar'));
console.log('PASS: free radio text, repeated questions, absent response, unclear input, negative and ambiguous decisions.');
