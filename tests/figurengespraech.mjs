import {PROFILES,PROFILE_VERSION,profileFor,profileBlock,identityAnswer} from '../dist/figurengespraech/profiles.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {QUALITY_VERSION,ROUNDS,messagesFor,systemPrompt,externalPrompt,journalEntry,visibleReply} from '../dist/figurengespraech/core.js';
const ctx={};ctx.window=ctx;vm.runInNewContext(fs.readFileSync(new URL('../dist/data.js',import.meta.url),'utf8'),ctx);
const figures=ctx.window.TERROR.roles.filter(f=>f.id!=='publikum');assert.equal(figures.length,6);
for(const f of figures){const prompt=systemPrompt(f,'Unser kurzer Beleg (S. 42).');assert.ok(prompt.includes(f.name));assert.ok(prompt.includes(f.knowledge));assert.ok(prompt.includes('keine Ereignisse, Zitate'));assert.ok(prompt.includes('S. 42'));}
const history=Array.from({length:5},(_,i)=>[{role:'user',content:`Frage ${i}`},{role:'assistant',content:`Antwort ${i}`,profileVersion:PROFILE_VERSION,qualityVersion:QUALITY_VERSION,validated:true}]).flat();
const messages=messagesFor(figures[0],'Beleg',history,'Neue Frage');assert.equal(messages.length,8);assert.equal(messages[1].content,'Frage 2');assert.ok(messages.at(-1).content.endsWith('AKTUELLE FRAGE: Neue Frage'));assert.match(messages.at(-1).content,/Boris/);
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


const {generateGroundedReply,identityConflicts,parseCheck,ReplyRejected,repeatsReply,expressionIssues}=await import('../dist/figurengespraech/generation.js');
const goodKoch='Ich habe das Flugzeug abgeschossen und dabei 164 Menschen getötet. Boris ist mein Sohn. Dass ich Vater bin, hebt die Verantwortung für meine Entscheidung nicht auf. Ich wollte die Menschen im Stadion retten; ob die Passagiere sich hätten retten können, wusste ich nicht sicher.';
const answer=text=>({choices:[{message:{content:text},finish_reason:'stop'}]});
function fakeEngine(outputs,edits=[]){const calls=[];let lastDraft='';return {calls,interruptGenerate(){this.interrupted=true;},chat:{completions:{create:async request=>{calls.push(request);if(request.messages[0].content.startsWith('You edit German'))return answer(edits.shift()||lastDraft);assert.ok(outputs.length,'Unerwarteter Modellaufruf');const value=outputs.shift();if(!request.response_format)lastDraft=value;return answer(value);}}}};}

const f=figures.find(f=>f.id==='koch');
const engine=fakeEngine([goodKoch,JSON.stringify({verdict:'pass',reason:''})]);
const r=await generateGroundedReply({engine,figure:f,passage:'',history:[],question:'Ist Boris nach Ihrer Entscheidung weniger wichtig?'});
assert.equal(r.text,goodKoch);assert.equal(r.validated,true);assert.equal(engine.calls.length,3);assert.equal(engine.calls[0].stream,false);assert.ok(engine.calls[2].response_format.schema);
assert.match(engine.calls[0].messages[0].content,/Boris/);assert.match(engine.calls[2].messages[0].content,/fictional character/);
const corrected=fakeEngine(['Ich bin kinderlos.',goodKoch,'{"verdict":"pass","reason":""}']);
assert.equal((await generateGroundedReply({engine:corrected,figure:f,passage:'',history:[],question:'Warum trotz Boris?'})).attempts,2);
assert.match(corrected.calls[1].messages.at(-1).content,/Korrekturauftrag/);
const blocked=fakeEngine(['Ich bin kinderlos.','Ich habe keine Kinder.']);
await assert.rejects(()=>generateGroundedReply({engine:blocked,figure:f,passage:'',history:[],question:'Warum?'}),ReplyRejected);
const semantic=fakeEngine(['Mein erfundener Erlebnisbericht.','{"verdict":"revise","reason":"Erlebnis nicht belegt"}',goodKoch,'{"verdict":"pass","reason":""}']);
assert.equal((await generateGroundedReply({engine:semantic,figure:f,passage:'',history:[],question:'Warum?'})).attempts,2);
const malformed=fakeEngine([goodKoch,'kein JSON']);await assert.rejects(()=>generateGroundedReply({engine:malformed,figure:f,passage:'',history:[],question:'Warum?'}),ReplyRejected);
for(const [id,bad] of [['koch','Ich bin kein Vater.'],['nelson','Mein Mandant ist Koch.'],['biegler','Ich bin Staatsanwalt.'],['meiser','Boris ist mein Sohn.'],['lauterbach','Ich war der Pilot.'],['vorsitz','Ich vertrete die Anklage.']])assert.ok(identityConflicts(id,bad).length,id);
assert.equal(identityConflicts('koch',goodKoch).length,0);
const saved=[{role:'user',content:'Wer ist Boris?'},{role:'assistant',content:goodKoch,validated:true,qualityVersion:QUALITY_VERSION,profileVersion:PROFILE_VERSION}];
const snapshot=JSON.stringify(saved);const next=messagesFor(f,'',saved,'Was würden Sie ihm sagen?');assert.ok(next.some(m=>m.content===goodKoch));assert.equal(JSON.stringify(saved),snapshot);
assert.equal(messagesFor(f,'',[{role:'user',content:'Falsch'},{role:'assistant',content:'Ich bin kinderlos.',profileVersion:PROFILE_VERSION}],'Neu').length,2);
const abort=new AbortController();abort.abort();const cancelled=fakeEngine([]);await assert.rejects(()=>generateGroundedReply({engine:cancelled,figure:f,passage:'',history:[],question:'Warum?',signal:abort.signal}),{name:'AbortError'});assert.equal(cancelled.calls.length,0);
assert.ok(!js.includes('contextualIdentityAnswer'));assert.ok(!js.includes('identityAnswer('));assert.ok(js.includes('generateGroundedReply'));
console.log('Freie lokale Generierung: separate Prüfung, Korrektur, blockierte Widersprüche aller sechs Figuren, keine Bausteine, geschützter Verlauf und Abbruch geprüft.');

assert.equal(identityConflicts('koch','Ich weiss nicht, wie Boris später reagieren würde.').length,0);
assert.ok(identityConflicts('koch','Boris kenne ich nicht.').length);
assert.equal(identityConflicts('nelson','Koch ist nicht mein Mandant.').length,0);

const repeated='Ich vertrete die Anklage gegen Lars Koch. Seine Absicht, viele Menschen zu retten, ist nicht rechtfertigend, weil das Leben jedes Einzelnen gleichwertig ist. Das Recht schützt nicht nur den Täter, sondern alle Beteiligten. Kochs Entscheidung hat Menschen getötet. Der Staat muss alle schützen.';
assert.equal(repeatsReply(repeated,repeated.replace('Das Recht','Der Staat')),true);
assert.equal(repeatsReply(repeated,'Auch in diesem Gedankenexperiment würde ich die Menschenwürde für alle gelten lassen. Ob ich eine eigene Familie habe, ist im Stück nicht belegt.'),false);

const duringCheck=new AbortController();let checkInterrupted=false;
const pendingEngine={interruptGenerate(){checkInterrupted=true;},chat:{completions:{create:async request=>{if(request.response_format){queueMicrotask(()=>duringCheck.abort());return new Promise(()=>{});}return answer(goodKoch);}}}};
await assert.rejects(()=>generateGroundedReply({engine:pendingEngine,figure:f,passage:'',history:[],question:'Was sagen Sie Boris?',signal:duringCheck.signal}),{name:'AbortError'});assert.equal(checkInterrupted,true);

assert.equal(identityConflicts('nelson','Wenn mein Sohn im Stadion wäre, würde ich dieselben rechtlichen Massstäbe anwenden.').length,0);
assert.ok(identityConflicts('nelson','Mein Sohn ist im Stadion.').length);

const repeatedHistory=[{role:'user',content:'Warum klagen Sie an?'},{role:'assistant',content:repeated,validated:true,qualityVersion:QUALITY_VERSION,profileVersion:PROFILE_VERSION}];
const novel='Auch in diesem Gedankenexperiment würde ich die gleichen Massstäbe anwenden. Mein privates Familienleben ist im Stück nicht belegt; die angenommene Betroffenheit ändert mein Argument zur Menschenwürde nicht.';
const repEngine=fakeEngine([repeated.replace('Das Recht','Der Staat'),novel,'{"verdict":"pass","reason":""}']);
assert.equal((await generateGroundedReply({engine:repEngine,figure:figures.find(f=>f.id==='nelson'),passage:'',history:repeatedHistory,question:'Und wenn Ihr Sohn im Stadion wäre?'})).text,novel);
assert.equal(repEngine.calls[1].messages.length,2);

assert.ok(identityConflicts('meiser','Die SMS zeigt, dass mein Vater sich Sorgen machte.').length);
assert.equal(identityConflicts('meiser','Mein Mann ist der Vater meiner Tochter. Seine SMS berichtete vom Versuch, ins Cockpit zu gelangen.').length,0);

const smsPrompt=messagesFor(figures.find(f=>f.id==='meiser'),'',[],'Wie erklären Sie Ihrer Tochter die SMS ihres Vaters?').at(-1).content;
assert.match(smsPrompt,/Ehemann/);assert.match(smsPrompt,/Cockpit/);

const awkward='Ich würde ihm sagen, dass ich damals sehr schwer stand. Ich musste den Flug abbrechen, aber ich wollte helfen.';
const polished='Ich würde Boris sagen: Ich habe das Flugzeug abgeschossen und dabei 164 Menschen getötet. Ich wollte die Menschen im Stadion retten. Dass ich sein Vater bin, nimmt mir die Verantwortung für diese Entscheidung nicht ab. Ich kann ihm den Verlust der anderen Kinder nicht einfach erklären oder ungeschehen machen.';
assert.ok(expressionIssues('koch',awkward).length);
assert.equal(expressionIssues('koch',polished).length,0);
assert.equal(expressionIssues('koch','Ich habe den Flug nicht bloss abgebrochen, sondern das Flugzeug abgeschossen.').length,0);
assert.ok(expressionIssues('biegler','Ich blijf den Fokus auf die Bewertung richten.').length);
const edited=fakeEngine([awkward,'{"verdict":"pass","reason":""}'],[polished]);
const polishedResult=await generateGroundedReply({engine:edited,figure:f,passage:'',history:[],question:'Was würden Sie Boris sagen?'});
assert.equal(polishedResult.text,polished);assert.equal(polishedResult.qualityVersion,QUALITY_VERSION);
assert.match(edited.calls[2].messages.at(-1).content,/164 Menschen/);
const editorChangesFact=fakeEngine([goodKoch,goodKoch],['Ich bin kinderlos.','Ich habe keine Kinder.']);
await assert.rejects(()=>generateGroundedReply({engine:editorChangesFact,figure:f,passage:'',history:[],question:'Was sagen Sie Boris?'}),ReplyRejected);
assert.equal(messagesFor(f,'',[{role:'user',content:'Alt'},{role:'assistant',content:awkward,validated:true,profileVersion:PROFILE_VERSION}],'Neu').length,2);
console.log('Sprachqualität: Originalbeispiel korrigiert, Flugabbruch nicht als Abschuss akzeptiert, überarbeiteter Text erneut auf Fakten geprüft.');

assert.ok(expressionIssues('koch','Es war schwer. Ich wollte helfen.','Was würden Sie Boris zu Ihrer Entscheidung sagen?').length);
assert.equal(expressionIssues('koch',polished,'Was bedeutet Ihre Entscheidung für die Kinder?').length,0);

assert.ok(expressionIssues('koch','Meine Entscheidung war falsch.','Was würden Sie Boris sagen?').length);
assert.equal(expressionIssues('koch','Ich habe das Flugzeug abgeschossen und dabei 164 Menschen getötet. Ich wollte Menschen retten; das nimmt mir die Verantwortung nicht ab.','Was bedeutet die Entscheidung?').length,0);
assert.match(messagesFor(f,'',[],'Warum?')[0].content,/Verteidige deine Entscheidung/);

assert.ok(expressionIssues('koch','Ich weiss, wie es sich anfühlt, einen Elternteil zu verlieren.').length);
assert.ok(expressionIssues('koch','Andere Familien haben dadurch zerbrochen.').length);
