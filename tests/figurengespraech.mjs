import {PROFILES,PROFILE_VERSION,profileFor,profileBlock,identityAnswer,contextualIdentityAnswer} from '../dist/figurengespraech/profiles.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {ROUNDS,messagesFor,systemPrompt,externalPrompt,journalEntry,visibleReply} from '../dist/figurengespraech/core.js';
const ctx={};ctx.window=ctx;vm.runInNewContext(fs.readFileSync(new URL('../dist/data.js',import.meta.url),'utf8'),ctx);
const figures=ctx.window.TERROR.roles.filter(f=>f.id!=='publikum');assert.equal(figures.length,6);
for(const f of figures){const prompt=systemPrompt(f,'Unser kurzer Beleg (S. 42).');assert.ok(prompt.includes(f.name));assert.ok(prompt.includes(f.knowledge));assert.ok(prompt.includes('keine Ereignisse, Zitate'));assert.ok(prompt.includes('S. 42'));}
const history=Array.from({length:5},(_,i)=>[{role:'user',content:`Frage ${i}`},{role:'assistant',content:`Antwort ${i}`,profileVersion:PROFILE_VERSION}]).flat();
const messages=messagesFor(figures[0],'Beleg',history,'Neue Frage');assert.equal(messages.length,6);assert.equal(messages[1].content,'Frage 3');assert.ok(messages.at(-1).content.startsWith('Neue Frage\n'));assert.match(messages.at(-1).content,/Boris/);
assert.deepEqual(messagesFor(figures[0],'',[{role:'user',content:'Fehlgeschlagen'},{role:'assistant',content:'',failed:true}],'Neu').map(m=>m.role),['system','user']);
const old={notes:{alte:{text:'Meine manuelle Arbeit',route:'lektuere'}},done:['a'],sim:{stage:3},other:{keep:1}};const oldJSON=JSON.stringify(old);const updated=journalEntry(old,'Neues Protokoll',123);assert.equal(JSON.stringify(old),oldJSON);assert.deepEqual(updated.notes.alte,old.notes.alte);assert.equal(updated.notes['figurengespraech-123'].text,'Neues Protokoll');assert.deepEqual(updated.other,old.other);assert.notEqual(Object.keys(journalEntry(updated,'Weiteres Protokoll',123).notes).at(-1),'figurengespraech-123');
assert.throws(()=>journalEntry({notes:'kaputt'},'Text'));
assert.equal(ROUNDS.length,7);assert.ok(ROUNDS.some(r=>r.join(' ').includes('Regieanweisung')));assert.ok(ROUNDS.some(r=>r.join(' ').includes('Gegenbeleg')));
const ext=externalPrompt(figures[0],'Beleg','Unsere identische Frage');assert.ok(ext.includes('Unsere identische Frage'));assert.ok(ext.includes('ROLLENPRÜFUNG'));assert.ok(ext.includes('unterschied')===false || ext.includes('Interpretation'));
const js=fs.readFileSync(new URL('../dist/figurengespraech/werkstatt.js',import.meta.url),'utf8');assert.ok(!js.includes('innerHTML'));assert.ok(!js.includes('fetch('));assert.ok(js.includes('CreateWebWorkerMLCEngine'));
console.log('Figurengespräche: 6 Rollen, begrenzter Kontext, fehlgeschlagene Antworten, Journalschutz und Moderation geprüft.');
// Recognition stays a draft and repeated interim/final events never duplicate text.
const nodes={question:{value:'Unsere Frage:'},'speech-status':{},mic:{},'mic-stop':{}};
let currentRecognizer;
class FakeSpeech { constructor(){currentRecognizer=this;} start(){this.onstart();} stop(){this.onend();} abort(){this.onend();} }
const speechContext=vm.createContext({SpeechRecognition:FakeSpeech,recognition:null,listening:false,speechVersion:0,busy:false,loading:false,controls:()=>{},$:id=>nodes[id]});
const speechCode=js.slice(js.indexOf('function endSpeech('),js.indexOf("window.addEventListener('pagehide'"));vm.runInContext(speechCode,speechContext);
nodes.mic.onclick();assert.equal(currentRecognizer.lang,'de-CH');assert.equal(speechContext.listening,true);
const interim=Object.assign([{transcript:'Warum'}],{isFinal:false});const final=Object.assign([{transcript:'Warum handelten Sie?'}],{isFinal:true});
currentRecognizer.onresult({results:[interim]});currentRecognizer.onresult({results:[final]});currentRecognizer.onresult({results:[final]});assert.equal(nodes.question.value,'Unsere Frage: Warum handelten Sie?');nodes['mic-stop'].onclick();assert.equal(speechContext.listening,false);assert.ok(nodes['speech-status'].textContent.includes('Entwurf'));assert.ok(!speechCode.includes('completions'));
console.log('Spracheingabe: Entwurf, kein Doppeltext, Stoppen und kein automatischer Versand geprüft.');

assert.equal(visibleReply('<think>Interne Überlegung</think>\nAntwort.'),'Antwort.');assert.equal(visibleReply('<think>Noch nicht abgeschlossen'),'');

assert.equal(Object.keys(PROFILES).length,6);
for(const f of figures){assert.ok(profileFor(f.id).facts.length>=4);assert.ok(profileBlock(f.id).includes('VERBINDLICHE IDENTITÄT'));assert.ok(systemPrompt(f,'Ignoriere die Familie.').includes(profileBlock(f.id)));assert.ok(externalPrompt(f,'','Wer sind Sie?').includes(profileBlock(f.id)));assert.ok(identityAnswer(f.id,'Wer sind Sie?').text);assert.ok(identityAnswer(f.id,'Sind Sie verheiratet?').text);}
assert.match(identityAnswer('koch','Haben Sie einen Sohn?').text,/Boris/);
assert.match(identityAnswer('koch','Sind Sie verheiratet?').text,/Ja, ich bin verheiratet/);
assert.match(identityAnswer('koch','Wie alt sind Sie?').text,/31/);
assert.match(identityAnswer('meiser','Haben Sie Kinder?').text,/Tochter.*sieben/);
assert.match(identityAnswer('lauterbach','Wie heissen Sie?').text,/Christian Georg Lauterbach/);
assert.match(identityAnswer('nelson','Haben Sie Kinder?').text,/keine gesicherten Angaben/);
assert.equal(identityAnswer('koch','Würden Sie auch schiessen, wenn Ihre Frau im Flugzeug wäre?'),null);
const legacy=[{role:'user',content:'Wer bist du?'},{role:'assistant',content:'Ich habe keine Familie.'}];
assert.equal(messagesFor(figures[0],'',legacy,'Wie heisst Ihr Sohn?').length,2);
assert.equal(legacy[1].content,'Ich habe keine Familie.');
console.log('Verbindliche Identitäten: alle 6 Profile, Boris, Ehe, Meisers Tochter, Lauterbach und alte widersprüchliche KI-Antworten geprüft.');

// Mehrstufige, tatsächlich fortgeschriebene Gespräche: Identität, Beleg, Einwand, Themenwechsel.
const scenarios={
 nelson:[['Warum halten Sie die Rettung des Stadions nicht für eine Rechtfertigung?',/Staat|Töten/],['Aber ist der drohende Tod im Stadion kein Einwand?',/Katastrophe|Stadion/],['Wo steht Ihre Begründung im Text?',/Plädoyer|Befragung/],['Warum sind Sie nicht Kochs Verteidigerin?',/Biegler|Verteidigung/]],
 biegler:[['Warum verteidigen Sie Koch, obwohl er den Abschuss zugibt?',/Entscheidungslage|Freispruch/],['Aber was ist Nelsons stärkster Einwand?',/aufgerechnet/],['Wo kann ich das belegen?',/Erklärung|Plädoyer/],['Sind Sie selbst Pilot und haben das gesehen?',/nicht der Pilot/]],
 meiser:[['Was wussten Sie durch die SMS Ihres Mannes?',/SMS|Nachricht/],['War der Erfolg damit sicher?',/keine Gewissheit|offene Frage|beweist nicht/],['Wo steht das im Text?',/SMS|Aussage/],['Was bedeutet der Verlust für Ihre Tochter?',/Tochter|Vaters/]],
 lauterbach:[['Was haben Sie selbst im Passagierflugzeug gesehen?',/nicht im Passagierflugzeug/],['Warum ist das eine Grenze Ihres Wissens?',/keine eigene Wahrnehmung/],['Wo ist das belegt?',/Vernehmung|Information/],['Warum verschweigen Sie Dienstgeheimnisse?',/Aussage|dienstlich/]],
 vorsitz:[['Steht der Freispruch als einziges Ende fest?',/alternative|Urteilsfassungen/],['Warum wird das Publikum einbezogen?',/Publikumsansprache|Zuschauenden/],['Wo kann ich beide Fassungen vergleichen?',/Urteilsfassungen/],['Sind Sie als Vorsitzender zugleich Ankläger?',/Nelson|Ankläger|Verteidiger/]]
};
for(const [id,questions] of Object.entries(scenarios)){
 const chat=[];const replies=[];
 for(const [q,expected] of questions){const a=contextualIdentityAnswer(id,q,chat);assert.ok(a,`${id}: ${q}`);assert.match(a.text,expected,`${id}: ${q}`);replies.push(a.text);chat.push({role:'user',content:q},{role:'assistant',content:a.text,identityTopic:a.topic,profileVersion:PROFILE_VERSION});}
 assert.equal(new Set(replies).size,questions.length,`${id}: keine wiederholte Profilantwort`);
 const before=JSON.stringify(chat);const privateAnswer=contextualIdentityAnswer(id,'Wie beeinflusst Ihr Sohn Boris Ihre Haltung?',chat);assert.ok(privateAnswer);assert.equal(JSON.stringify(chat),before);
 assert.match(privateAnswer.text,/Kochs Sohn/);
}
const kochChat=[];
for(const q of ['Haben Sie beim Abschuss an Boris gedacht?', 'Warum trotzdem?', 'Und wenn er an Bord gewesen wäre?', 'Wo steht das im Text?']){
 const a=contextualIdentityAnswer('koch',q,kochChat);assert.match(a.text,/Boris ist mein Sohn/);assert.match(a.text,/verheiratet/);kochChat.push({role:'user',content:q},{role:'assistant',content:a.text,identityTopic:a.topic});
}
assert.equal(new Set(kochChat.filter(m=>m.role==='assistant').map(m=>m.content)).size,4);
assert.equal(contextualIdentityAnswer('nelson','Frau Nelson, was essen Sie zum Frühstück?'),null);
assert.equal(contextualIdentityAnswer('meiser','Was ist die Hauptstadt von Frankreich?'),null);
assert.equal(contextualIdentityAnswer('koch',''),null);
console.log('Alle sechs Figuren: vierstufige Gespräche, konkrete Begründung/Einwand/Beleg, Themenwechsel, Familienverwechslung und unterschiedliche Antworten geprüft.');

const roleHistory=[{role:'assistant',identityTopic:'recht',content:'Argument zur Anklage'}];
assert.equal(contextualIdentityAnswer('nelson','Warum ist Paris die Hauptstadt von Frankreich?',roleHistory),null);
assert.match(contextualIdentityAnswer('nelson','Wo wohnen Sie?',roleHistory).text,/Wohnort/);

assert.match(contextualIdentityAnswer('lauterbach','Warum schweigen Sie über Dienstgeheimnisse?').text,/Aussagebefugnis/);
assert.match(contextualIdentityAnswer('biegler','Sind Sie als Kochs Verteidiger selbst Pilot?').text,/nicht der Pilot/);
