import {PROFILES,PROFILE_VERSION,profileFor,profileBlock,identityAnswer} from '../dist/figurengespraech/profiles.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {QUALITY_VERSION,ROUNDS,messagesFor,systemPrompt,externalPrompt,journalEntry,visibleReply} from '../dist/figurengespraech/core.js';
const ctx={};ctx.window=ctx;vm.runInNewContext(fs.readFileSync(new URL('../dist/data.js',import.meta.url),'utf8'),ctx);
const figures=ctx.window.TERROR.roles.filter(f=>f.id!=='publikum');assert.equal(figures.length,6);
for(const f of figures){const prompt=systemPrompt(f,'Unser kurzer Beleg (S. 42).');assert.ok(prompt.includes(f.name));assert.ok(prompt.includes(f.knowledge));assert.ok(prompt.includes('keine Ereignisse, Zitate'));assert.ok(prompt.includes('S. 42'));}
const history=Array.from({length:5},(_,i)=>[{role:'user',content:`Frage ${i}`},{role:'assistant',content:`Antwort ${i}`,profileVersion:PROFILE_VERSION,qualityVersion:QUALITY_VERSION,validated:true}]).flat();
const messages=messagesFor(figures[0],'Beleg',history,'Neue Frage');assert.equal(messages.length,8);assert.equal(messages[1].content,'Frage 2');assert.equal(messages.at(-1).content,'Neue Frage');assert.match(messages[0].content,/Boris/);
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


const {generateGroundedReply,identityConflicts,parseCheck,ReplyRejected,repeatsReply,expressionIssues,DRAFT_SCHEMA,CHECK_SCHEMA,editPreservesReferences,confirmsNelsonCoverage,COVERAGE_SCHEMA,parseCoverage,polishSurface}=await import('../dist/figurengespraech/generation.js');
const goodKoch='Ich habe das Flugzeug abgeschossen und dabei 164 Menschen getötet. Boris ist mein Sohn. Dass ich Vater bin, hebt die Verantwortung für meine Entscheidung nicht auf. Ich wollte die Menschen im Stadion retten; ob die Passagiere sich hätten retten können, wusste ich nicht sicher.';
const answer=text=>({choices:[{message:{content:text},finish_reason:'stop'}]});
function fakeEngine(outputs,edits=[],coverageResults=[]){const calls=[];let lastDraft='';return {calls,interruptGenerate(){this.interrupted=true;},chat:{completions:{create:async request=>{calls.push(request);if(request.response_format?.schema===COVERAGE_SCHEMA)return answer(coverageResults.shift()||JSON.stringify({comparison:'Die tatsächlichen Frageteile werden konkret beantwortet.',coverage:'pass',missing:''}));if(request.messages[0].content.startsWith('Du bist Sprachlektor'))return answer(edits.shift()||lastDraft);assert.ok(outputs.length,'Unerwarteter Modellaufruf');const value=outputs.shift();if(request.response_format&&JSON.parse(request.response_format.schema).properties?.grounding){const plan=typeof value==='string'?{grounding:'Figur, Frage und Textfakten abgeglichen.',answer:value}:value;lastDraft=[plan.answer,plan.detail].filter(Boolean).join(' ');return answer(JSON.stringify(plan));}return answer(value);}}}};}

const passCheck=JSON.stringify({evidence:'Konkrete Aussagen mit den vorgegebenen Textfakten und der Frage verglichen.',facts:'pass',language:'pass',coverage:'pass',reason:'',quote:''});
const f=figures.find(f=>f.id==='koch');
const engine=fakeEngine([goodKoch,passCheck]);
const r=await generateGroundedReply({engine,figure:f,passage:'',history:[],question:'Ist Boris nach Ihrer Entscheidung weniger wichtig?'});
assert.equal(r.text,goodKoch);assert.equal(r.validated,true);assert.equal(engine.calls.length,4);assert.equal(engine.calls[0].stream,false);assert.ok(engine.calls[2].response_format.schema);
assert.match(engine.calls[0].messages[0].content,/Boris/);assert.match(engine.calls[2].messages[0].content,/independently review/);
const corrected=fakeEngine(['Ich bin kinderlos.',goodKoch,passCheck]);
assert.equal((await generateGroundedReply({engine:corrected,figure:f,passage:'',history:[],question:'Warum trotz Boris?'})).attempts,2);
assert.match(corrected.calls[1].messages[0].content,/Korrekturauftrag/);
const blocked=fakeEngine(['Ich bin kinderlos.','Ich habe keine Kinder.']);
await assert.rejects(()=>generateGroundedReply({engine:blocked,figure:f,passage:'',history:[],question:'Warum?'}),ReplyRejected);
const semantic=fakeEngine(['Mein erfundener Erlebnisbericht.',JSON.stringify({evidence:'Konkrete Aussagen mit den vorgegebenen Textfakten und der Frage verglichen.',facts:'revise',language:'pass',coverage:'pass',reason:'Erlebnis nicht belegt',quote:'Mein erfundener Erlebnisbericht.'}),goodKoch,passCheck]);
assert.equal((await generateGroundedReply({engine:semantic,figure:f,passage:'',history:[],question:'Warum?'})).attempts,2);
const malformed=fakeEngine([goodKoch,'kein JSON','kein JSON']);await assert.rejects(()=>generateGroundedReply({engine:malformed,figure:f,passage:'',history:[],question:'Warum?'}),ReplyRejected);
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
const pendingEngine={interruptGenerate(){checkInterrupted=true;},chat:{completions:{create:async request=>{if(request.response_format?.schema===CHECK_SCHEMA){queueMicrotask(()=>duringCheck.abort());return new Promise(()=>{});}return answer(request.response_format?.schema===DRAFT_SCHEMA?JSON.stringify({grounding:'Koch ist Vater von Boris.',answer:goodKoch}):goodKoch);}}}};
await assert.rejects(()=>generateGroundedReply({engine:pendingEngine,figure:f,passage:'',history:[],question:'Was sagen Sie Boris?',signal:duringCheck.signal}),{name:'AbortError'});assert.equal(checkInterrupted,true);

assert.equal(identityConflicts('nelson','Wenn mein Sohn im Stadion wäre, würde ich dieselben rechtlichen Massstäbe anwenden.').length,0);
assert.ok(identityConflicts('nelson','Mein Sohn ist im Stadion.').length);

const repeatedHistory=[{role:'user',content:'Warum klagen Sie an?'},{role:'assistant',content:repeated,validated:true,qualityVersion:QUALITY_VERSION,profileVersion:PROFILE_VERSION}];
const novel='Auch in diesem Gedankenexperiment würde ich die gleichen Massstäbe anwenden. Mein privates Familienleben ist im Stück nicht belegt; die angenommene Betroffenheit ändert mein Argument zur Menschenwürde nicht.';
const repEngine=fakeEngine([repeated.replace('Das Recht','Der Staat'),passCheck,novel,passCheck],[],[JSON.stringify({comparison:'Die hypothetische Betroffenheit bleibt unbeantwortet.',coverage:'revise',missing:'wenn Ihr Sohn im Stadion wäre'}),JSON.stringify({comparison:'Die hypothetische Betroffenheit wird aufgegriffen.',coverage:'pass',missing:''})]);
assert.equal((await generateGroundedReply({engine:repEngine,figure:figures.find(f=>f.id==='nelson'),passage:'',history:repeatedHistory,question:'Und wenn Ihr Sohn im Stadion wäre?'})).text,novel);
assert.equal(repEngine.calls[1].messages.length,2);

assert.ok(identityConflicts('meiser','Die SMS zeigt, dass mein Vater sich Sorgen machte.').length);
assert.equal(identityConflicts('meiser','Mein Mann ist der Vater meiner Tochter. Seine SMS berichtete vom Versuch, ins Cockpit zu gelangen.').length,0);

const smsPrompt=messagesFor(figures.find(f=>f.id==='meiser'),'',[],'Wie erklären Sie Ihrer Tochter die SMS ihres Vaters?')[0].content;
assert.match(smsPrompt,/Ehemann/);assert.match(smsPrompt,/Cockpit/);

const awkward='Ich würde ihm sagen, dass ich damals sehr schwer stand. Ich musste den Flug abbrechen, aber ich wollte helfen.';
const polished='Ich würde Boris sagen: Ich habe das Flugzeug abgeschossen und dabei 164 Menschen getötet. Ich wollte die Menschen im Stadion retten. Dass ich sein Vater bin, nimmt mir die Verantwortung für diese Entscheidung nicht ab. Ich kann ihm den Verlust der anderen Kinder nicht einfach erklären oder ungeschehen machen.';
assert.ok(expressionIssues('koch',awkward).length);
assert.equal(expressionIssues('koch',polished).length,0);
assert.equal(expressionIssues('koch','Ich habe den Flug nicht bloss abgebrochen, sondern das Flugzeug abgeschossen.').length,0);
assert.ok(expressionIssues('biegler','Ich blijf den Fokus auf die Bewertung richten.').length);
const grammarDraft='Ich würde Boris sagen: Ich habe das Flugzeug abgeschossen und dabei 164 Menschen getötet. Ich wollte die Menschen im Stadion retten, aber ich damals sehr schwer stand.';
const grammarPolished='Ich würde Boris sagen: Ich habe das Flugzeug abgeschossen und dabei 164 Menschen getötet. Ich wollte die Menschen im Stadion retten, aber ich stand damals vor einer sehr schweren Entscheidung.';
const edited=fakeEngine([grammarDraft,passCheck],[grammarPolished]);
const polishedResult=await generateGroundedReply({engine:edited,figure:f,passage:'',history:[],question:'Was würden Sie Boris sagen?'});
assert.equal(polishedResult.text,grammarPolished);assert.equal(polishedResult.qualityVersion,QUALITY_VERSION);
assert.match(edited.calls[2].messages.at(-1).content,/164 Menschen/);
const editorChangesFact=fakeEngine([goodKoch,passCheck],['Ich bin kinderlos.']);
assert.equal((await generateGroundedReply({engine:editorChangesFact,figure:f,passage:'',history:[],question:'Was sagen Sie Boris?'})).text,goodKoch);
assert.equal(messagesFor(f,'',[{role:'user',content:'Alt'},{role:'assistant',content:awkward,validated:true,profileVersion:PROFILE_VERSION}],'Neu').length,2);
console.log('Sprachqualität: Originalbeispiel korrigiert, Flugabbruch nicht als Abschuss akzeptiert, überarbeiteter Text erneut auf Fakten geprüft.');

assert.ok(expressionIssues('koch','Es war schwer. Ich wollte helfen.','Was würden Sie Boris zu Ihrer Entscheidung sagen?').length);
assert.equal(expressionIssues('koch',polished,'Was bedeutet Ihre Entscheidung für die Kinder?').length,0);

assert.ok(expressionIssues('koch','Meine Entscheidung war falsch.','Was würden Sie Boris sagen?').length);
assert.equal(expressionIssues('koch','Ich habe das Flugzeug abgeschossen und dabei 164 Menschen getötet. Ich wollte Menschen retten; das nimmt mir die Verantwortung nicht ab.','Was bedeutet die Entscheidung?').length,0);
assert.match(messagesFor(f,'',[],'Warum?')[0].content,/Verteidige deine Entscheidung/);

assert.ok(expressionIssues('koch','Ich weiss, wie es sich anfühlt, einen Elternteil zu verlieren.').length);
assert.ok(expressionIssues('koch','Andere Familien haben dadurch zerbrochen.').length);

assert.ok(expressionIssues('biegler','Ich vertrete die Position, dass der Abschuss eine Notwehr war.').length);
assert.equal(expressionIssues('biegler','Ich verteidige Koch und bestreite die strafrechtliche Bewertung der Anklage.').length,0);

const {sourceIssues,sourceFor}=await import('../dist/figurengespraech/text-checks.js');
const baseline=JSON.parse(fs.readFileSync(new URL('./fixtures/figurengespraech-audit.json',import.meta.url),'utf8'));
for(const row of baseline){const issues=[...sourceIssues(row.figure,row.question,row.answer,row.context||''),...expressionIssues(row.figure,row.answer,row.question)];assert.equal(issues.length>0,row.mustReject,`${row.figure}: ${row.question} (${issues.join(' ')})`);}
const variants=[
 ['nelson','Was wissen wir über Ihre Familie?','Das Stück nennt keine gesicherten Angaben über mein Privatleben. Ein eigenes Kind wäre in dieser Frage eine Annahme.'],
 ['meiser','Was beweist die SMS Ihres Mannes?','Er war bereits an Bord. Seine Nachricht berichtet vom Versuch, zum Raum der Piloten zu gelangen; sie belegt keinen erfolgreichen Zutritt.'],
 ['meiser','Hätte er nach gelungenem Zutritt sicher überlebt?','Auch dann wäre sein Überleben nicht garantiert gewesen. Tatsächlich wurde mein Mann beim Abschuss getötet.'],
 ['lauterbach','Sind Sie Kochs Vorgesetzter?','Ich bin Oberstleutnant und war Duty Controller. Ich gab Radtkes Befehle weiter; der Abschusspilot war Koch. Eine disziplinarische Stellung folgt nicht allein aus meinem Rang.'],
 ['vorsitz','Welche Rolle hat das Publikum?','Die Abstimmung der Zuschauenden bestimmt das Urteil. Ich verkünde je nach Ergebnis Freispruch oder Verurteilung.'],
 ['vorsitz','Gibt es eine zweite Fassung nach dem Freispruch?','Der Text bietet Freispruch und Verurteilung als Alternativen. In einer Aufführung wird nur eine Fassung gespielt; die andere bleibt im Text vorhanden.']
];
for(const [id,q,a] of variants)assert.deepEqual(sourceIssues(id,q,a),[],`${id}: freie korrekte Paraphrase`);
assert.throws(()=>parseCheck('{"verdict":"pass","reason":""}'),ReplyRejected);
assert.equal(parseCheck(passCheck).verdict,'pass');
assert.throws(()=>parseCheck(JSON.stringify({evidence:'Konkrete Aussagen mit den vorgegebenen Textfakten und der Frage verglichen.',facts:'revise',language:'pass',coverage:'pass',reason:'Rollenwechsel',quote:'Ich bin Koch'}),'Ich bin Nelson'),ReplyRejected);
const missingPart=JSON.stringify({evidence:'Konkrete Aussagen mit den vorgegebenen Textfakten und der Frage verglichen.',facts:'pass',language:'pass',coverage:'revise',reason:'Familienfrage unbeantwortet',quote:''});assert.equal(parseCheck(missingPart,'Meine Position bleibt gleich.').verdict,'pass');
const wrongSms='Mein Mann versuchte, ins Flugzeug zu kommen.';
const protectedEngine=fakeEngine([wrongSms,wrongSms]);
await assert.rejects(()=>generateGroundedReply({engine:protectedEngine,figure:figures.find(f=>f.id==='meiser'),passage:'',history:[],question:'Was beweist die SMS?'}),ReplyRejected);
assert.ok(protectedEngine.calls.every(c=>c.response_format?.schema!==CHECK_SCHEMA),'Geschützter Sachfehler darf nicht durch eine pauschale Modellfreigabe überstimmt werden.');
assert.ok(sourceFor('vorsitz').includes('Abstimmung'));
console.log('Textgebundene Prüfung: alte Fehlantworten zurückgewiesen, freie korrekte Paraphrasen zugelassen, drei Prüfkriterien und echte Belegzitate verlangt.');

assert.throws(()=>parseCheck(JSON.stringify({evidence:'Konkrete Aussagen mit den vorgegebenen Textfakten und der Frage verglichen.',facts:'revise',language:'pass',coverage:'pass',reason:'Angeblicher Fehler ohne Zitat',quote:''}),'Korrekte Antwort.'),ReplyRejected);
assert.deepEqual(r.validation,{facts:'pass',language:'pass',coverage:'pass',sourceRules:'pass'});

assert.ok(sourceIssues('nelson','Was heisst das?','Das führt zur Entmündigung der Rechte anderer.').length);
assert.deepEqual(sourceIssues('nelson','Was wissen wir über Ihre Familie?','Meine Familie bleibt im Stück unerwähnt. Die Annahme eines Kindes ist hypothetisch.'),[]);

assert.ok(sourceIssues('biegler','Was bestreiten Sie?','Ob der Abschuss rechtfertigt ist, muss geprüft werden.').length);
const llamaFake=fakeEngine([goodKoch,passCheck]);await generateGroundedReply({engine:llamaFake,figure:f,passage:'',history:[],question:'Was sagen Sie Boris?',modelId:'Llama-3.1-8B-Instruct-q4f16_1-MLC'});assert.ok(llamaFake.calls.every(c=>!c.extra_body),'Kein künstlicher Qwen-Denkheader für Llama.');

assert.equal(parseCheck(JSON.stringify({evidence:'Konkrete Aussagen mit den vorgegebenen Textfakten und der Frage verglichen.',facts:'revise',language:'pass',coverage:'pass',reason:'Unklare Aussage',quote:'«Ich bin Koch»'}),'Ich bin Koch.').verdict,'revise');
assert.deepEqual(sourceIssues('nelson','Was wissen wir über Ihre Familie?','Über meine Familie erfahren wir im Text nichts.'),[]);
assert.equal(identityConflicts('nelson','Meine Tochter würde im Stadion sitzen.').length,0);

assert.ok(sourceIssues('nelson','Koch wollte retten. Warum bleibt das strafbar?','Ihre Rettungsabsicht rechtfertigt die Tötung nicht.').length);
assert.ok(sourceIssues('nelson','Was wissen wir über Ihre Familie?','Ich kann nicht bestätigen, ob ich Kinder habe.').length);
assert.ok(sourceIssues('nelson','Warum nicht verrechnen?','Der Staat darf keine unschuldigen Leben als Mittel zum Zweck anderer retten.').length);

assert.ok(sourceIssues('nelson','Was wissen wir aus dem Stück über Kinder?','Daher weiss ich nicht, ob ich Kinder habe.').length);
assert.ok(sourceIssues('meiser','Was beweist die Nachricht?','Die Nachricht beweist den Versuch Ihres Vaters.').length);
assert.ok(sourceIssues('biegler','Warum Freispruch?','Ihre Tat war entschuldigend, nicht als straflos zu werten.').length);
assert.equal(messagesFor(f,'',[],'Wer ist Boris?').at(-1).content,'Wer ist Boris?');

assert.ok(sourceIssues('nelson','Warum strafbar?','Obwohl Sie eine Rettungsabsicht verfolgten, beantrage ich Ihre Verurteilung.').length);

assert.ok(sourceIssues('nelson','Warum strafbar?','Die Rettung der Menschen im Flugzeug rechtfertigt die Tötung der 164 Unschuldigen im Stadion nicht.').length);
assert.deepEqual(sourceIssues('nelson','Warum strafbar?','Die 164 Menschen wurden nicht im Stadion getötet, sondern im Flugzeug.'),[]);
// A quality upgrade must not migrate or rewrite manually saved work on load.
const manuallySaved={figure:'meiser',passages:{meiser:'Mein bearbeiteter Textbeleg'},chats:{meiser:[{role:'assistant',content:'Meine gespeicherte Überarbeitung',manual:true,qualityVersion:'alt'}]},notes:{vergleich:'Meine eigene Deutung'},round:2,roundNotes:{2:'Moderationsnotiz'},checks:{beleg:true},custom:{keep:'Unbekannte Zusatzdaten'}};
let storageWrites=0;const savedContext=vm.createContext({figures,ROUNDS,KEY:"terror-figurengespraech-v1",localStorage:{getItem:()=>JSON.stringify(manuallySaved),setItem:()=>storageWrites++}});
vm.runInContext(js.slice(js.indexOf('let state='),js.indexOf('let engine='))+';this.loadedState=state;',savedContext);
assert.equal(JSON.stringify(savedContext.loadedState),JSON.stringify(manuallySaved));assert.equal(storageWrites,0);
assert.equal(messagesFor(figures.find(f=>f.id==='meiser'),'',manuallySaved.chats.meiser,'Neue Nachfrage').length,2);
assert.equal(manuallySaved.chats.meiser[0].content,'Meine gespeicherte Überarbeitung');
console.log('Gespeicherte Änderungen: Textbelege, manuelle Chattexte, Notizen, Diskussionsnotizen, Prüfhäkchen und Zusatzdaten bleiben beim Laden vollständig erhalten.');

assert.ok(sourceIssues('biegler','Ist das Notwehr?','Hier lag kein Angriff durch einen Dritten vor.').length);
assert.ok(sourceIssues('biegler','Was bestreiten Sie?','Ich bestreite die strafrechtliche Bewertung als rechtfertigenden Akt.').length);

assert.throws(()=>parseCheck(JSON.stringify({facts:'pass',language:'pass',coverage:'pass',reason:'',quote:''})),ReplyRejected);
assert.ok(sourceIssues('nelson','Wenn Ihr eigenes Kind dort wäre?','Selbst wenn mein Sohn im Cockpit gesessen hätte, bliebe meine Position gleich.','Müsste der Staat im Stadion zusehen?').length);
assert.ok(sourceIssues('meiser','Wo schrieb Ihr Mann?','Mein Mann war bereits im Cockpit. Die SMS belegt den Versuch.').length);
assert.ok(sourceIssues('meiser','Hätte er bei gelungenem Zutritt überlebt?','Der Terrorist hätte das Flugzeug trotzdem abgeschossen.').length);
assert.ok(sourceIssues('meiser','Was wissen Sie?','Nicht im Flugzeug, sondern allein auf der Basis.').length);
assert.deepEqual(sourceIssues('meiser','Was beweist die SMS?','Die Nachricht beweist nicht, dass mein Mann im Cockpit war. Sie berichtet vom Versuch, dorthin zu gelangen.'),[]);

assert.ok(!messagesFor(figures.find(f=>f.id==='nelson'),'',[],'Warum strafbar?')[0].content.includes('Erklärung an die Tochter'));
assert.match(messagesFor(f,'',[],'Warum?')[0].content,/Sprich als Koch/);
assert.ok(sourceIssues('nelson','Warum ist Kochs Tat strafbar?','Ich würde meiner Tochter erklären, dass das verboten ist.').length);

assert.equal(editPreservesReferences('Ob ich Kinder habe, ist im Stück nicht belegt.','Ob Sie Kinder haben, ist im Stück nicht erwähnt.'),false);
assert.equal(editPreservesReferences('Ich habe 164 Menschen getötet.','Ich habe 70 000 Menschen getötet.'),false);
assert.equal(editPreservesReferences('Boris ist mein Sohn.','Boris ist nicht mein Sohn.'),false);
assert.equal(editPreservesReferences('Ich war sehr schwer stand.','Ich stand vor einer sehr schweren Entscheidung.'),true);
const familyDraft='Ob ich Kinder habe, ist im Stück nicht belegt. Die Menschen an Bord dürfen nicht verrechnet werden.';
const editorWrongPerson=fakeEngine([familyDraft,passCheck],['Ob Sie Kinder haben, ist im Stück nicht erwähnt. Die Menschen an Bord dürfen nicht verrechnet werden.']);
assert.equal((await generateGroundedReply({engine:editorWrongPerson,figure:figures.find(f=>f.id==='nelson'),passage:'',history:[],question:'Was wissen wir aus dem Stück über Ihre Kinder?'})).text,familyDraft);
console.log('Sprachkorrektur: Änderungen an Sprecherbezügen, Zahlen, Namen und Verneinungen werden verworfen; der freie Originalentwurf durchläuft danach alle Prüfungen.');

const directNelson='Die Tötung von 164 Menschen ist unabhängig von der Rettungsabsicht strafbar. Jeder Mensch hat das Recht auf Leben und darf nicht als Mittel zum Zweck betrachtet werden.';
const whyNelson='Koch wollte viele Menschen retten. Weshalb halten Sie die Tötung der Passagiere trotzdem für strafbar?';
assert.equal(confirmsNelsonCoverage(whyNelson,directNelson),true);
assert.equal(confirmsNelsonCoverage(whyNelson,'Ich bin Staatsanwältin und befrage Koch.'),false);
assert.equal(confirmsNelsonCoverage(whyNelson+' Welche Familie haben Sie?',directNelson),false);
assert.equal(confirmsNelsonCoverage('Was wissen Sie über Ihre Kinder?',directNelson),false);
assert.equal(confirmsNelsonCoverage('Beweist dies Notwehr, und warum ist es strafbar trotz Rettung?',directNelson),false);
const falseMissing=JSON.stringify({evidence:'Lebensrecht wird genannt, aber fehlender Rettungsbezug behauptet.',facts:'pass',language:'pass',coverage:'revise',reason:'Fehlender Rettungsbezug',quote:''});
const sufficient=fakeEngine([directNelson,falseMissing]);assert.equal((await generateGroundedReply({engine:sufficient,figure:figures.find(f=>f.id==='nelson'),passage:'',history:[],question:whyNelson})).attempts,1);
const falseMoral=fakeEngine([directNelson,JSON.stringify({evidence:'Ein Satz wird beanstandet.',facts:'revise',language:'pass',coverage:'revise',reason:'Sachfehler',quote:'164 Menschen'}),directNelson,falseMissing]);assert.equal((await generateGroundedReply({engine:falseMoral,figure:figures.find(f=>f.id==='nelson'),passage:'',history:[],question:whyNelson})).attempts,2);
assert.equal(confirmsNelsonCoverage('Muss der Staat im Stadion beim Sterben zusehen?','Nein, der Staat muss Menschen im Stadion schützen. Das darf nicht durch die Tötung Unschuldiger erreicht werden.'),true);
assert.ok(sourceIssues('nelson','Wie lautet die Position?','Nein, das meine Position nicht.').length);
assert.ok(sourceIssues('nelson','Warum?','Man darf unschuldige Leben aufzählen.').length);
const qwenFake=fakeEngine([goodKoch,passCheck]);await generateGroundedReply({engine:qwenFake,figure:f,passage:'',history:[],question:'Was sagen Sie Boris?',modelId:'Qwen3-8B-q4f16_1-MLC'});assert.ok(qwenFake.calls.every(c=>c.extra_body?.enable_thinking===false));

const afterFailure=[{role:'user',content:'Muss der Staat im Stadion zusehen?'},{role:'assistant',content:'Ungeprüfter falscher Entwurf',failed:true}];
const afterFailurePrompt=messagesFor(figures.find(f=>f.id==='nelson'),'',afterFailure,'Wenn Ihr Kind dort wäre?');
assert.ok(afterFailurePrompt[0].content.includes('Muss der Staat im Stadion zusehen?'));assert.ok(!afterFailurePrompt.some(m=>m.content.includes('Ungeprüfter falscher Entwurf')));
const splitEngine=fakeEngine([{grounding:'Hypothetische Betroffenheit; Privatleben im Stück offen.',answer:'Auch dann würde ich Menschenleben nicht gegeneinander aufrechnen.',detail:'Das Stück nennt keine gesicherten Angaben zu meiner Familie.'},passCheck]);
const splitResult=await generateGroundedReply({engine:splitEngine,figure:figures.find(f=>f.id==='nelson'),passage:'',history:afterFailure,question:'Wenn Ihr eigenes Kind dort wäre: Würden Sie anders urteilen, und was wissen wir überhaupt über Ihre Familie?'});
assert.ok(splitResult.text.includes('Auch dann'));assert.ok(splitResult.text.includes('keine gesicherten Angaben'));
assert.ok(JSON.parse(splitEngine.calls[0].response_format.schema).required.includes('detail'));
assert.equal(confirmsNelsonCoverage('Muss der Staat im Stadion beim Sterben zusehen?','Der Staat hat die Pflicht, Menschen zu schützen, aber diese Pflicht darf nicht durch die Tötung unschuldiger Menschen erfüllt werden.'),true);
console.log('Nachfragen: frühere Schülerfragen bleiben nach Fehlern im Kontext; ungeprüfte Antworten bleiben ausgeschlossen. Zusammengesetzte Fragen erhalten zwei frei generierte Antwortteile.');

assert.throws(()=>parseCoverage(JSON.stringify({comparison:'Zusätzliche juristische Argumente gefordert',coverage:'revise',missing:'vollständige juristische Argumentation'}),'Was können Sie noch bestreiten?'),ReplyRejected);
assert.equal(parseCoverage(JSON.stringify({comparison:'Altersfrage fehlt',coverage:'revise',missing:'wie alt ist Ihre Tochter'}),'Was wissen Sie und wie alt ist Ihre Tochter?').coverage,'revise');
const bieglerDirect='Als Verteidiger kann ich bestreiten, ob Koch unter den Umständen strafrechtlich verantwortlich ist.';
const tooMuch=JSON.stringify({evidence:'Strafrechtliche Verantwortung korrekt, weitere Argumente vermisst.',facts:'pass',language:'pass',coverage:'revise',reason:'Weitere juristische Argumente gewünscht.',quote:''});
const literalCoverage=JSON.stringify({comparison:'Gefragt ist, was noch bestritten werden kann; die Antwort nennt die strafrechtliche Verantwortung.',coverage:'pass',missing:''});
const independent=fakeEngine([bieglerDirect,tooMuch],[],[literalCoverage]);
assert.equal((await generateGroundedReply({engine:independent,figure:figures.find(f=>f.id==='biegler'),passage:'',history:[],question:'Koch gibt den Abschuss zu. Was können Sie als Verteidiger dann noch bestreiten?'})).text,bieglerDirect);
assert.ok(independent.calls.find(c=>c.response_format?.schema===COVERAGE_SCHEMA).messages[0].content.includes('KEINE Fakten'));
console.log('Separate Fragenprüfung: nur tatsächliche Frageteile statt vollständiger Quellenkatalog; Fakten- und Sprachveto bleiben verbindlich.');

assert.equal(polishSurface('Andere Möglichkeiten zur Schutz von Leben. Ein Abwägung ist nötig. Ob die Handlung rechtfertigt ist, wird geprüft.'),'Andere Möglichkeiten zum Schutz von Leben. Eine Abwägung ist nötig. Ob die Handlung gerechtfertigt ist, wird geprüft.');
assert.equal(polishSurface('Nein, das meine Position nicht.'),'Nein, das ist nicht meine Position.');
const bieglerGeneration=messagesFor(figures.find(f=>f.id==='biegler'),'',[],'Koch gibt den Abschuss zu. Was bestreiten Sie?')[0].content;
assert.ok(!bieglerGeneration.includes('Verfassungssicherheit'));assert.ok(!bieglerGeneration.includes('Notwehr'));assert.ok(!bieglerGeneration.includes('Rechte entmündigen'));

assert.ok(expressionIssues('biegler','Ich argumentiere, dass Koch aus Notwehr handelte.').length);
assert.deepEqual(expressionIssues('biegler','Es ist nicht bewiesen, dass Koch aus Notwehr gehandelt hat.'),[]);
assert.deepEqual(expressionIssues('biegler','Ich behaupte nicht, dass Koch aus Notwehr handelte.'),[]);
assert.deepEqual(sourceIssues('lauterbach','Wer schoss?','Radtke hat gemeldet, dass Koch das Flugzeug abgeschossen hat.'),[]);
assert.ok(sourceIssues('meiser','Was wäre geschehen?','Der Terrorist hätte das Flugzeug trotzdem abgeschossen.').length);
assert.deepEqual(sourceIssues('biegler','Antworten Sie auf den Einwand der Anklage.','Die Anklage fokussiert nicht auf die Zahl der Opfer, sondern auf die Würde jedes Einzelnen.'),[]);
assert.equal(polishSurface('Er handelte unter extremer Zeitdruck. Die Nachricht sagt nur, dass er versucht hat.'),'Er handelte unter extremem Zeitdruck. Die Nachricht sagt nur, dass er es versucht hat.');
assert.equal(polishSurface('Die Nachricht sagt, dass er versucht hat, ins Cockpit zu kommen.'),'Die Nachricht sagt, dass er versucht hat, ins Cockpit zu kommen.');
for(const [id,question,main,detail] of [
 ['meiser','Sagen Sie das aus eigener Wahrnehmung im Flugzeug oder aus der Nachricht? Und wie alt ist Ihre Tochter im Stück?','Ich war nicht an Bord und kenne den Versuch aus der Nachricht meines Mannes.','Meine Tochter ist im Stück sieben Jahre alt.'],
 ['lauterbach','Welchen Dienstgrad hatten Sie, und wessen Anweisungen haben Sie den Piloten übermittelt?','Ich gab die Befehle Generalleutnant Radtkes an die Alarmrotte weiter.','Ich war Oberstleutnant.'],
 ['vorsitz','Wenn Sie die Verhandlung leiten, weshalb braucht das Stück dann die Entscheidung des Publikums?','Ich leite die Verhandlung und verkünde das Urteil.','Die Publikumsabstimmung bestimmt Freispruch oder Verurteilung.']]){
 const splitFake=fakeEngine([{grounding:'Zwei konkrete Frageteile, beide aus dem Text belegt.',answer:main,detail},passCheck]);
 const split=await generateGroundedReply({engine:splitFake,figure:figures.find(f=>f.id===id),passage:'',history:[],question});
 assert.equal(split.text,main+' '+detail);assert.ok(JSON.parse(splitFake.calls[0].response_format.schema).required.includes('detail'));
}
for(const id of ['nelson','biegler','lauterbach','vorsitz'])assert.ok(sourceIssues(id,'Was wissen wir aus dem Stück über Ihre Familie?','Ich weiss nicht, ob ich Kinder habe.').length,id);
const rankReview=fakeEngine([{grounding:'Dienstgrad und Befehlskette.',answer:'Ich gab Radtkes Befehle weiter; Koch war der Abschusspilot und ist Major.',detail:'Ich war Oberstleutnant.'},passCheck]);
await generateGroundedReply({engine:rankReview,figure:figures.find(f=>f.id==='lauterbach'),passage:'',history:[],question:'Trennen Sie Dienstgrad, Aufgabe und Verantwortung und nennen Sie wessen Befehle Sie übermittelt haben.'});
assert.ok(rankReview.calls.find(c=>c.response_format?.schema===CHECK_SCHEMA).messages[0].content.includes('Major und Kampfpilot'));
console.log('Biografische Teilfragen und Querbezüge: Tochteralter, Dienstgrad, Publikumsentscheidung und Kochs Rang bleiben auch im Prüfer verfügbar; Notwehrbehauptungen werden unabhängig verworfen.');

assert.deepEqual(sourceIssues('biegler','Was wäre ohne Angriff?','Wenn kein Angriff durch einen Dritten vorläge, wäre diese Annahme gesondert zu prüfen.'),[]);

assert.ok(sourceIssues('nelson','Muss der Staat im Stadion einfach beim Sterben zusehen?','Es geht darum, die Balance zwischen Schutz und Tötung zu finden.').length);
assert.deepEqual(sourceIssues('nelson','Was sagt Biegler?','Biegler sucht eine Balance zwischen Schutz und Tötung.'),[]);
assert.ok(sourceIssues('biegler','Koch gibt den Abschuss zu. Was bestreiten Sie?','Strittig ist, ob Koch strafrechtlich relevant handelte.').length);
assert.ok(sourceIssues('meiser','Hätte Ihr Mann sicher überlebt?','Nein, selbst wenn dein Papa ins Cockpit gekommen wäre, wäre das nicht sicher.').length);
assert.deepEqual(sourceIssues('meiser','Wie würden Sie Ihrer Tochter die SMS erklären?','Ich würde meiner Tochter sagen: Dein Papa versuchte, ins Cockpit zu kommen. Ob er es geschafft hat, wissen wir nicht.'),[]);
const invalidQuote=JSON.stringify({evidence:'Eine falsche Rolle behauptet.',facts:'revise',language:'pass',reason:'Rolle falsch',quote:'Ich bin Staatsanwältin'});
const retryReview=fakeEngine([goodKoch,invalidQuote,passCheck]);
const rechecked=await generateGroundedReply({engine:retryReview,figure:f,passage:'',history:[],question:'Was würden Sie Boris sagen?'});
assert.equal(rechecked.text,goodKoch);assert.equal(rechecked.attempts,1);assert.equal(retryReview.calls.filter(c=>c.response_format?.schema===CHECK_SCHEMA).length,2);
assert.ok(!JSON.parse(CHECK_SCHEMA).properties.coverage);assert.deepEqual(JSON.parse(CHECK_SCHEMA).required,['evidence','facts','language','reason','quote']);
console.log('Prüfungsfehler: ungültige Zitate werden am selben Entwurf erneut geprüft; Vollständigkeit kann nicht als Sachfehler ausgegeben werden. Personenbezüge bleiben auch nach einer Tochter-Erklärung stabil.');

assert.ok(sourceIssues('biegler','Warum Freispruch trotz 164 Getöteten?','Die Anklage spricht vom vermeintlichen Verlust von 164 Menschen.').length);
assert.ok(sourceIssues('biegler','Warum Freispruch?','Die Tat war möglicherweise rechtfertigt in dieser extremen Situation.').length);
