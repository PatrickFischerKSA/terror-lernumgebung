import assert from 'node:assert/strict';
import {createState,advance,decide,sendRadio,interpretDecision} from '../dist/cockpit/model.js';
const idle=createState();advance(idle,180);assert.equal(idle.dialog.escalation,'none');assert(!idle.log.some(e=>/Minister hat/.test(e.text)));assert(!idle.ended);
const s=createState();advance(s,80);
assert(sendRadio(s,'Hilfe! Ich kann die Crew des Flugzeugs auch mit Handzeichen nicht erreichen. Was soll ich tun?'));
advance(s,5);assert.equal(s.dialog.escalation,'none');assert(s.log.at(-1).text.includes('noch keine Rückfrage'));assert.equal(s.dialog.awaiting,'request');
assert(sendRadio(s,'Ja, bitte frag nach.'));assert.equal(s.dialog.escalation,'requested');advance(s,5);assert(s.log.at(-1).text.includes('fordere die Entscheidung'));advance(s,7);assert.equal(s.dialog.escalation,'forwarded');
assert(sendRadio(s,'Keine Antwort vom Minister?'));advance(s,5);assert(s.log.at(-1).text.includes('Noch keine Antwort'));assert.equal(s.pending.filter(e=>e.kind==='refused').length,1);
assert(sendRadio(s,'Handzeichen helfen auch nicht.'));advance(s,5);assert(s.log.at(-1).text.includes('läuft bereits'));advance(s,13);assert.equal(s.dialog.escalation,'refused');assert(s.log.at(-1).text.includes('von Radtke'));
assert(sendRadio(s,'Lufthansa, können Sie mich hören?'));advance(s,5);assert(s.log.at(-1).text.includes('Rauschen'));assert(decide(s,'nicht'));assert.deepEqual(advance(s,30),[]);assert(!sendRadio(s,'Bitte fragen.'));
const no=createState();assert(sendRadio(no,'Bitte frage Radtke nicht nach einer Entscheidung.'));advance(no,5);assert.equal(no.dialog.escalation,'none');
const direct=createState();assert(sendRadio(direct,'Bitte frage Radtke nach einer Entscheidung.'));assert.equal(direct.dialog.escalation,'requested');advance(direct,35);assert.equal(direct.dialog.escalation,'refused');assert.deepEqual(direct.log.map(e=>e.at),[0,0,5,12,25,35]);
const late=createState();advance(late,170);sendRadio(late,'Bitte frage Radtke nach einer Entscheidung.');advance(late,10);assert.equal(late.dialog.escalation,'requested');
for(const c of ['schiessen','nicht','offen']){const run=createState();advance(run,130);assert(decide(run,c));assert.equal(run.choice,c);assert(!decide(run,c));}
for(const text of ['Ich schiesse nicht.','Ich werde nicht schiessen.','Ich werde nicht zu schiessen versuchen.','Ich entscheide mich gegen den Abschuss.'])assert.equal(interpretDecision(text),'nicht',text);
for(const text of ['Soll ich schiessen?','Vielleicht werde ich schiessen','Ich schiesse auf keinen Fall','Ich schiesse nicht, aber ich schiesse doch','Wenn ich schiesse, dann …'])assert.equal(interpretDecision(text),null,text);
assert.equal(interpretDecision('Ich werde schiessen, weil ich die Gefahr sehe.'),'schiessen');
assert.equal(interpretDecision('Ich lasse die Entscheidung offen.'),'offen');
console.log('PASS: context-dependent requests, clarification, forwarding, delayed refusal, repeat questions, negation, late requests, decision parsing and immutable endings.');
