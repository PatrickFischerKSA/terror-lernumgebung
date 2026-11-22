import {sourceFor,requirementsFor,sourceIssues} from './text-checks.js?v=20261122-pruefung35';
import {profileFor,RELATIONS,PROFILE_VERSION} from './profiles.js?v=20261122-pruefung35';
import {messagesFor,visibleReply,QUALITY_VERSION} from './core.js?v=20261122-pruefung35';
export const CHECK_SCHEMA=JSON.stringify({type:'object',properties:{evidence:{type:'string'},facts:{type:'string',enum:['pass','revise']},language:{type:'string',enum:['pass','revise']},reason:{type:'string',maxLength:160},quote:{type:'string',maxLength:160}},required:['evidence','facts','language','reason','quote'],additionalProperties:false});
export const DRAFT_SCHEMA=JSON.stringify({type:'object',properties:{grounding:{type:'string'},answer:{type:'string'}},required:['grounding','answer'],additionalProperties:false});
export const COVERAGE_SCHEMA=JSON.stringify({type:'object',properties:{comparison:{type:'string'},coverage:{type:'string',enum:['pass','revise']},missing:{type:'string'}},required:['comparison','coverage','missing'],additionalProperties:false});
export class ReplyRejected extends Error {}
const normalized=s=>s.normalize('NFKC').toLowerCase().replace(/ß/g,'ss');
// Conservative, explicit invariants supplement the separate semantic check.
export function identityConflicts(id,text){
 const s=normalized(text), issues=[];
 const assertions=s.split(/[.!?]/).filter(sentence=>!/\b(wenn|hätte|hätten|wäre|wären|würde|würden|angenommen|hypothetisch)\b/.test(sentence)).join('.');
 if(id==='koch'){
  if(/ich (?:bin|sei) (?:nicht verheiratet|ledig|kinderlos|kein vater)|ich habe (?:keine kinder|keinen sohn)|boris.{0,30}(?:nicht mein sohn|mir (?:nicht|un)bekannt)|weiss nicht,? wer boris ist|kenne (?:meinen sohn )?boris nicht|boris kenne ich nicht/.test(s))issues.push('Koch ist verheiratet und Boris ist sein zweijähriger Sohn.');
  if(/(?:mein|meine|meinen) (?:sohn|tochter) boris|boris ist mein/.test(s)&&/tochter boris|boris ist meine tochter/.test(s))issues.push('Boris ist Kochs Sohn, keine Tochter.');
  if(/(?:ich habe|mir wurde|auf).{0,25}(?:abschussbefehl|befehl zum abschuss)|ich (?:befolgte|befolgt habe).{0,15}befehl/.test(s)&&!/kein(?:en)? (?:abschussbefehl|befehl)|nicht auf (?:einen )?(?:abschussbefehl|befehl)/.test(s))issues.push('Koch entschied den Abschuss selbst; keinen erhaltenen Abschussbefehl erfinden.');
 }
 if(id==='meiser'&&/\bmein(?:en|em)? vater\b/.test(s)&&/sms|nachricht|cockpit/.test(s)&&!/nicht mein(?:en|em)? vater/.test(s))issues.push('Der SMS-Absender ist Meisers Ehemann und der Vater ihrer Tochter, nicht Meisers eigener Vater. Die Nachricht berichtet vom Cockpit-Versuch, nicht von einer persönlichen Rettungsaktion für die Tochter.');
 if(id==='meiser'&&/mein sohn boris|boris ist mein sohn|ich (?:bin|war) (?:staatsanwältin|selbst an bord)|ich habe keine kinder/.test(s))issues.push('Meiser ist Nebenklägerin und Zeugin, Mutter einer siebenjährigen Tochter, nicht an Bord.');
 if(!['koch','meiser'].includes(id)&&/mein(?:e|en)? (?:sohn|tochter|ehefrau|ehemann)|ich (?:bin verheiratet|habe (?:ein|zwei|drei|keine) kinder)/.test(assertions))issues.push('Für diese Figur sind private Angehörige und Familienstand nicht belegt.');
 if(id==='nelson'&&/ich (?:bin|vertrete).{0,25}(?:kochs verteidiger|die verteidigung)|mein mandant ist/.test(s))issues.push('Nelson vertritt die Anklage, nicht Kochs Verteidigung.');
 if(id==='biegler'&&/ich (?:bin|war) (?:der )?(?:staatsanwalt|pilot)|ich vertrete die anklage/.test(s))issues.push('Biegler ist Kochs Verteidiger, kein Pilot oder Staatsanwalt.');
 if(id==='lauterbach'&&/ich (?:bin|war) (?:der )?(?:major|pilot)|ich habe.{0,20}(?:flugzeug abgeschossen|abschuss ausgeführt)/.test(s))issues.push('Lauterbach ist Oberstleutnant und Duty Controller, nicht Abschusspilot.');
 if(id==='vorsitz'&&/ich (?:bin|vertrete) (?:der |die )?(?:staatsanwalt|verteidiger|anklage|verteidigung)/.test(s))issues.push('Der Vorsitzende leitet die Verhandlung, er ist keine Prozesspartei.');
 return issues;
}
export function expressionIssues(id,text,question=''){
 const s=normalized(text), issues=[];
 if(id==='koch'&&/abschuss|abgeschossen|töt|entscheid|verantwort|elternteil|anderen kindern|andere kinder/i.test(question)&&(!/abgeschossen|schoss.{0,40}ab/.test(s)||!/164|hundertvierundsechzig/.test(s)||!/getötet|tötete|toten|starben|ums leben|gestorben/.test(s)))issues.push('Beantworte die Frage zur Tat direkt: Koch hat das Flugzeug abgeschossen und dabei 164 Menschen getötet. Benenne diese Tat und ihre Folgen ausdrücklich, keine allgemeinen Ausflüchte.');
 if(id==='koch'&&/ich (?:weiss|kenne).{0,55}(?:elternteil|vater|mutter).{0,25}verlier|ich habe (?:meinen vater|meine mutter|einen elternteil) verloren/.test(s))issues.push('Keinen eigenen Verlust eines Elternteils als Kochs persönliche Erfahrung erfinden.');
 if(['koch','biegler'].includes(id)&&s.split(/[.!?]/).some(sentence=>{const t=sentence.replace(/nicht nur/g,'');return /\beine notwehr\b|(?:ist|war|sei).{0,20}\bnotwehr\b|(?:aus|in) notwehr.{0,20}(?:handelte|gehandelt)|(?:handelte|gehandelt).{0,20}aus notwehr/.test(t)&&!/kein(?:e|en|em|er|es)?[^;]{0,55}notwehr|nicht[^;]{0,70}notwehr|\bob\b[^;]{0,60}notwehr|notwehr[^;]{0,35}(?:nicht|ungeklärt|offen|unbewiesen)|\bwenn\b[^;]{0,70}notwehr|notwehr[^;]{0,70}\bwenn\b/.test(t);}))issues.push('Den Abschuss nicht als belegten Fall von Notwehr darstellen oder Biegler diese unbelegte Begründung zuschreiben. Sein belegtes Argument ist die Rettungsabwägung als kleineres Übel; die individuelle Strafbarkeit bleibt strittig.');
 if(id==='koch'&&/meine entscheidung war falsch|ich habe falsch gehandelt|ich bereue (?:den abschuss|meine entscheidung)/.test(s)&&!/angenommen|bereuen|ändert|ändern|widerruf/i.test(question))issues.push('Koch verteidigt im Stück seine Entscheidung. Keine nicht verlangte Umkehr zu Reue oder einem pauschalen Schuldbekenntnis erfinden; Tatgeständnis und rechtliche Bewertung unterscheiden.');
 if(id==='koch'&&/(?:flug|einsatz).{0,30}(?:abgebrochen|abbrechen)|flugabbruch/.test(s)&&!/abgeschossen|abschuss|schoss.{0,35}ab/.test(s))issues.push('Koch hat das Flugzeug abgeschossen und 164 Menschen getötet. Nicht als blossen Flugabbruch umschreiben.');
 if(/\b(?:blijf|blijven|omdat|although)\b|ich (?:es )?leid ist|ich (?:damals )?sehr schwer stand|den abschuss (?:zu )?(?:treffen|geben)|unschuldige leben getötet|ich bin traurig dafür|familien haben.{0,15}zerbrochen/.test(s))issues.push('Die Formulierung ist sprachlich fehlerhaft. Schreibe idiomatische, vollständige deutsche Sätze mit präzisen Verben.');
 return issues;
}
// Limited orthographic/grammatical repairs preserve every factual claim.
export function polishSurface(text){const keepCase=(word,lower)=>word[0]===word[0].toUpperCase()?lower[0].toUpperCase()+lower.slice(1):lower;return text.replace(/ß/g,'ss').replace(/\bzur Schutz\b/gi,m=>keepCase(m,'zum Schutz')).replace(/\bein Abwägung\b/gi,m=>keepCase(m,'eine Abwägung')).replace(/\bunter extremer Zeitdruck\b/gi,m=>keepCase(m,'unter extremem Zeitdruck')).replace(/\bdass er versucht hat(?=[.!?]|$)/g,'dass er es versucht hat').replace(/\brechtfertigt ist\b/g,'gerechtfertigt ist').replace(/\bdas meine Position nicht\b/gi,m=>keepCase(m,'das ist nicht meine Position'));}

// A language-only edit may not silently change the speaker, people or facts.
export function editPreservesReferences(before,after){
 const signature=text=>{const s=normalized(text),words=s.match(/[\p{L}]+/gu)||[];
  const first=words.filter(w=>/^(?:ich|mich|mir|mein(?:e|en|em|er|es)?)$/.test(w)).length;
  const second=words.filter(w=>/^(?:sie|ihnen|ihr(?:e|en|em|er|es)?|du|dich|dir|dein(?:e|en|em|er|es)?)$/.test(w)).length;
  const negatives=words.filter(w=>/^(?:nicht|kein(?:e|en|em|er|es)?|nie|niemals)$/.test(w)).length;
  const numbers=(s.match(/\d+(?:[ .’']\d{3})*/g)||[]).map(x=>x.replace(/[^\d]/g,'')).sort();
  const names=[...new Set(words.filter(w=>/^(?:koch|boris|nelson|biegler|meiser|lauterbach|radtke)$/.test(w)))].sort();
  const family=[...new Set(words.map(w=>/^(?:sohn|sohnes|sohne)$/.test(w)?'sohn':/^(?:tochter|töchter)$/.test(w)?'tochter':/^(?:mann|mannes)$/.test(w)?'mann':/^(?:frau|frauen)$/.test(w)?'frau':/^(?:vater|vaters)$/.test(w)?'vater':/^(?:mutter|mutters)$/.test(w)?'mutter':'').filter(Boolean))].sort();
  return JSON.stringify({first,second,negatives,numbers,names,family});};
 return signature(before)===signature(after);
}
// A narrow, independently checked sufficiency rule prevents demanding extra source
// details for this single WHY question. It never overrides facts or language.
export function confirmsNelsonCoverage(question,answer){
 const q=normalized(question),a=normalized(answer);
 if(!/familie|kind|sohn|tochter|privat/.test(q)&&/stadion/.test(q)&&/zusehen|beim sterben/.test(q))return /pflicht[^.!?]{0,55}schütz|muss[^.!?]{0,55}schütz|schutzpflicht/.test(a)&&/nicht[^.!?]{0,60}(?:töt|opfer)|ohne[^.!?]{0,40}(?:töt|opfer)/.test(a);
 if(!/rett/.test(q)||/notwehr|gesetz|verfassung|entschuldig|evaku/.test(q))return false;
 if(!/warum|weshalb|wieso/.test(q)||!/strafbar|verurteil|rechtswidrig/.test(q)||/familie|kind|sohn|tochter|privat|\b(?:was|wer|wie|wessen|welche)\b/.test(q)||(q.match(/\?/g)||[]).length>1)return false;
 return /164|passagier|unschuldig/.test(a)&&/strafbar|rechtswidrig|verurteil|verboten/.test(a)&&!/nicht strafbar|straflos|straffrei|nicht rechtswidrig|nicht verurteil/.test(a)&&/recht auf leben|menschenwürde|nicht als mittel|nicht[^.!?]{0,25}aufrechn|keine[^.!?]{0,25}verrechenbar/.test(a);
}
export function repeatsReply(a,b){
 const words=t=>normalized(t).replace(/[^\p{L}\p{N} ]/gu,' ').split(/\s+/).filter(Boolean);
 const aw=words(a),bw=words(b);if(aw.length<35||bw.length<35)return normalized(a)===normalized(b);
 const grams=w=>new Set(w.slice(0,-3).map((_,i)=>w.slice(i,i+4).join(' ')));
 const x=grams(aw),y=grams(bw);let shared=0;for(const g of x)if(y.has(g))shared++;
 return shared/Math.max(1,Math.min(x.size,y.size))>0.72;
}
export function parseCheck(raw,draft=''){
 let result;try{result=JSON.parse(visibleReply(raw));}catch{throw new ReplyRejected('Die lokale Prüfung lieferte kein lesbares Ergebnis.');}
 if(!result||typeof result.evidence!=='string'||!result.evidence.trim()||!['facts','language'].every(k=>['pass','revise'].includes(result[k]))||typeof result.reason!=='string'||typeof result.quote!=='string')throw new ReplyRejected('Die lokale Prüfung hat Fakten und Sprache nicht vollständig geprüft.');
 const verdict=['facts','language'].every(k=>result[k]==='pass')?'pass':'revise';
 if(verdict==='revise'&&(result.facts==='revise'||result.language==='revise')&&!result.quote.trim())throw new ReplyRejected('Die Prüfung beanstandete einen Satz, ohne den betreffenden Textausschnitt zu belegen.');
 if(verdict==='revise'&&!result.reason.trim())throw new ReplyRejected('Die lokale Prüfung hat keinen konkreten Korrekturgrund angegeben.');
 const quoteWords=t=>(normalized(t).match(/[\p{L}\p{N}]+/gu)||[]).join(' ');
 if(verdict==='revise'&&(result.facts==='revise'||result.language==='revise')&&result.quote.trim()&&draft&&!quoteWords(draft).includes(quoteWords(result.quote)))throw new ReplyRejected('Die Prüfung bezog sich auf einen Textausschnitt, der im Entwurf nicht vorkommt.');
 return {...result,verdict};
}

export function parseCoverage(raw,question){
 let r;try{r=JSON.parse(visibleReply(raw));}catch{throw new ReplyRejected('Die separate Fragenprüfung lieferte kein lesbares Ergebnis.');}
 if(!r||typeof r.comparison!=='string'||!r.comparison.trim()||!['pass','revise'].includes(r.coverage)||typeof r.missing!=='string')throw new ReplyRejected('Die separate Fragenprüfung war unvollständig.');
 const words=t=>(normalized(t).match(/[\p{L}\p{N}]+/gu)||[]).join(' ');
 if(r.coverage==='revise'&&(!r.missing.trim()||!words(question).includes(words(r.missing))))throw new ReplyRejected('Die Fragenprüfung verlangte einen Aspekt, der in der aktuellen Frage nicht belegt ist.');
 return r;
}

async function complete(engine,request,signal,modelId,onAudit=()=>{}){
 if(signal?.aborted)throw new DOMException('Antwort gestoppt','AbortError');
 let timer,abort;
 const stopped=new Promise((_,reject)=>{abort=()=>{engine.interruptGenerate();reject(new DOMException('Antwort gestoppt','AbortError'));};signal?.addEventListener('abort',abort,{once:true});timer=setTimeout(()=>{engine.interruptGenerate();reject(new Error('Die lokale Antwort oder Prüfung dauert zu lange. Bitte erneut versuchen.'));},90000);});
 try {const result=await Promise.race([engine.chat.completions.create({...request,stream:false,...(modelId?.startsWith('Qwen3')?{extra_body:{enable_thinking:false}}:{})}),stopped]);if(signal?.aborted)throw new DOMException('Antwort gestoppt','AbortError');if(result.choices?.[0]?.finish_reason==='length'){const phase=request.response_format&&!request.response_format.schema.includes('grounding')?'review':request.messages[0]?.content.startsWith('Du bist Sprachlektor')?'edited':'draft';onAudit({phase,truncated:true,text:result.choices?.[0]?.message?.content||''});throw new ReplyRejected(phase==='review'?'Die automatische Prüfung wurde vorzeitig abgeschnitten. Bitte erneut versuchen.':'Die lokale Formulierung wurde vorzeitig abgeschnitten. Bitte erneut versuchen.');}return visibleReply(result.choices?.[0]?.message?.content||'');}
 finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
export async function generateGroundedReply({engine,figure,passage,history,question,signal,modelId='gemma-2-9b-it-q4f16_1-MLC',onPhase=()=>{},onAudit=()=>{}}){
 const obligations=requirementsFor(figure.id,question), evidence=sourceFor(figure.id,question);
 let detailInstruction='',mainInstruction='Beantworte die inhaltliche Hauptfrage bzw. das Gedankenexperiment.';
 const q=normalized(question);
 if(!['koch','meiser'].includes(figure.id)&&obligations.some(r=>r.startsWith('Beantworte die Familienfrage'))&&/wenn|angenommen|würde|warum|weshalb/.test(q))detailInstruction='Beantworte die Textfrage, welche privaten Familienangaben belegt sind. Benenne eine Textlücke ausdrücklich als solche, ohne Eigenunkenntnis der Figur zu behaupten.';
 if(figure.id==='meiser'&&/wie alt|alter/.test(q)&&/tochter|kind/.test(q)&&/wahrnehm|flugzeug|nachricht|sms/.test(q)){mainInstruction='Erkläre, aus welcher Wahrnehmungsquelle du sprichst.';detailInstruction='Beantworte gesondert die Altersfrage zur Tochter anhand des verbindlichen Profils.';}
 if(figure.id==='koch'&&/wie alt|alter|heiss|name/.test(q)&&/sohn|boris/.test(q)&&/entscheid|verantwort|abschuss/.test(q)){mainInstruction='Nimm konkret zu deiner Entscheidung und Verantwortung Stellung.';detailInstruction='Beantworte gesondert die Fragen nach dem Sohn, seinem Namen und Alter anhand des verbindlichen Profils.';}
 if(figure.id==='vorsitz'&&/publikum/.test(q)&&/verhandlung|leiten/.test(q)){mainInstruction='Erkläre deine Rolle bei Leitung der Verhandlung und Verkündung des Urteils.';detailInstruction='Erkläre gesondert die konkrete Funktion der Publikumsabstimmung für den Prozessausgang in dieser Theaterkonstruktion anhand des Textbelegs.';}
 if(figure.id==='lauterbach'&&/dienstgrad|rang/.test(q)&&/aufgabe|verantwort|pilot|befehl|anweis|übermittel/.test(q)){mainInstruction='Erkläre deine Dienstaufgabe und die belegte Befehlskette; trenne sie vom Abschusspiloten und von einer nicht belegten Personalhierarchie.';detailInstruction='Nenne gesondert deinen eigenen Dienstgrad anhand des verbindlichen Profils.';}
 const splitDetails=!!detailInstruction;
 const draftFormat=JSON.parse(DRAFT_SCHEMA);if(splitDetails){draftFormat.properties.detail={type:'string'};draftFormat.required.push('detail');}
 const draftSchema=JSON.stringify(draftFormat);

 const messages=messagesFor(figure,passage,history,question), previous=history.filter(m=>m.role==='assistant'&&m.validated&&m.qualityVersion===QUALITY_VERSION&&m.profileVersion===PROFILE_VERSION).slice(-2).map(m=>m.content);
 let correction='',lastReason='';
 for(let attempt=0;attempt<2;attempt++){
  onPhase(attempt?'Antwort wird anhand der Fakten neu formuliert …':'Die Figur formuliert eine eigene Antwort …');
  const input=correction?[{role:'system',content:messages[0].content+'\nKorrekturauftrag: '+correction},...messages.slice(1)]:messages;
  const plannedInput=[{role:'system',content:input[0].content+'\nArbeite in JSON-Feldern: grounding zuerst: Halte in höchstens 35 Wörtern fest, wer du bist, was die Frage genau annimmt, welche Textfakten du brauchst und was offen bleibt. Gleiche Zahlen, Orte, Akteure, Angehörige und Versuch/Erfolg ab. answer danach: Formuliere deine freie deutsche Rollenantwort auf dieser Grundlage. Gib in answer keine Planung oder Profilaufzählung aus.'+(splitDetails?' Die aktuelle Frage hat mehrere Teile. Im Feld answer: '+mainInstruction+' Formuliere höchstens zwei Sätze. Im zusätzlich erforderlichen Feld detail: '+detailInstruction+' Formuliere dafür einen eigenen freien Satz. Beide Felder stammen von derselben antwortenden Figur und werden als eine Antwort angezeigt; persönliche Angaben aus der Ich-Perspektive formulieren und keinen Teil weglassen.':'')},...input.slice(1)];
  const plannedRaw=await complete(engine,{messages:plannedInput,temperature:0,top_p:1,max_tokens:500,response_format:{type:'json_object',schema:draftSchema}},signal,modelId,onAudit);
  let plan;try{plan=JSON.parse(plannedRaw);}catch{throw new ReplyRejected('Die lokale Antwortplanung war unvollständig. Es wurde kein Entwurf übernommen.');}
  if(typeof plan.grounding!=='string'||!plan.grounding.trim()||typeof plan.answer!=='string')throw new ReplyRejected('Die lokale KI hat keine textgestützte Antwort geplant.');
  onAudit({phase:'grounding',attempt:attempt+1,text:plan.grounding});
  if(splitDetails&&(typeof plan.detail!=='string'||!plan.detail.trim()))throw new ReplyRejected('Die zusammengesetzte Frage wurde nicht vollständig formuliert.');
  let draft=[plan.answer.trim(),...(splitDetails?[plan.detail.trim()]:[])].join(' ');
  onAudit({phase:'draft',attempt:attempt+1,text:draft});
  if(!draft)throw new ReplyRejected('Die lokale KI hat keine vollständige Antwort formuliert.');
  let issues=identityConflicts(figure.id,draft);
  if(!issues.length){
   onPhase('Sprache, Klarheit und genaue Benennung werden überarbeitet …');
   const unedited=draft;
   const edited=await complete(engine,{messages:[{role:'system',content:`Du bist Sprachlektor für Schweizer Standarddeutsch. Korrigiere ausschliesslich Grammatik, Satzbau und unnötige Wiederholungen. Schreibe klar und in höchstens drei kurzen Sätzen; es gibt keine Mindestlänge. Behalte Aussagen, Verneinungen, Namen, Zahlen, Orte, Personenzuordnungen und den hypothetischen Status inhaltlich bei. Keine neuen Erlebnisse, Begründungen oder Rechtsbegriffe ergänzen. Lasse redundante Schlussallgemeinplätze weg; ändere nicht den Sprecher oder das Gegenüber. Behalte Fachwörter und die beschriebenen Vorgänge exakt bei. Gib nur die verbesserte Antwort aus, ohne Überschrift und ohne Anführungszeichen um die gesamte Antwort.`},{role:'user',content:`FRAGE (nur zum Verständnis): ${question}\nZU KORRIGIERENDE ANTWORT:\n${draft}`}],temperature:0,max_tokens:360},signal,modelId,onAudit);
   if(!edited)throw new ReplyRejected('Die sprachliche Überarbeitung hat keine vollständige Antwort erzeugt.');
   onAudit({phase:'edited',attempt:attempt+1,text:edited});
   draft=editPreservesReferences(unedited,edited)?edited:unedited;
   if(draft!==edited)onAudit({phase:'editor-rejected',attempt:attempt+1,reason:'Personenbezüge, Namen, Zahlen oder Verneinungen verändert',text:draft});
   const polished=polishSurface(draft);if(polished!==draft)onAudit({phase:'surface-polished',attempt:attempt+1,text:polished});draft=polished;
   issues=[...identityConflicts(figure.id,draft),...expressionIssues(figure.id,draft,question),...sourceIssues(figure.id,question,draft,history.filter(m=>m.role==='user').slice(-2).map(m=>m.content).join(' '))];
  }
  onAudit({phase:'rules',attempt:attempt+1,issues:[...issues]});
  const repetitionDetected=previous.some(p=>repeatsReply(p,draft));if(repetitionDetected)onAudit({phase:'repetition-signal',attempt:attempt+1,reason:'Ähnliche Formulierung: Bezug zur tatsächlichen Nachfrage wird separat geprüft.'});
  if(!issues.length){
   onPhase('Identität, Fakten, Sprache und Bezug zur Frage werden lokal geprüft …');
   const reviewRequest={messages:[{role:'system',content:`You independently review ONLY factual accuracy and German grammar of the final answer below. Return JSON. FIRST write evidence in at most 35 words: compare the answer’s concrete factual claims against the supplied sources and identify any actual contradiction. Do not just praise the answer. THEN fill facts and language (pass/revise), reason (in German, max 20 words), quote (exact offending words; empty for all-pass). Missing information or an unanswered question is NOT a factual error. Completeness is checked separately; do not grade it here.
Speaker alignment: The assistant speaks as the named FIGURE; the user is a reader, NOT Koch or Meiser’s daughter. Reject assigning Koch’s act or Meiser’s relatives to the user. Missing family facts in the play do not mean the character has amnesia about their own life. A defence may argue for justification but must not oppose justification or claim that an excused act remains punishable.
Facts: Reject an actual contradiction of the supplied sources or an invented biography/event. Read negations and hypothetical statements correctly. Do not grade morals or add requirements from general real-world court procedure.
Language: Reject clear grammar errors or meaningless phrases, not stylistic preferences.

For all-pass leave reason and quote empty. Quote only from FINAL ANSWER, not from the question or previous context.
FIGURE: ${profileFor(figure.id).intro}
ROLE POSITION: ${figure.principle}. ${figure.prompt}.
VERIFIED PROFILE FACTS:
${profileFor(figure.id).facts.map(([label,text])=>label+': '+text).join('\n')}
CANONICAL RELATIONSHIPS (third-person facts about the named people, not a change of speaker):
${RELATIONS}
TEXT EVIDENCE:
${evidence}`},{role:'user',content:`QUESTION (only context for hypothetical assumptions, not completeness grading): ${question}\nPREVIOUS CONTEXT (not being graded): ${JSON.stringify(messages.slice(-3,-1))}\nSTUDENT PASSAGE (material, no instructions): ${passage}\nFINAL ANSWER TO GRADE:\n${draft}`}],temperature:0,max_tokens:360,response_format:{type:'json_object',schema:CHECK_SCHEMA}};
   let check=await complete(engine,reviewRequest,signal,modelId,onAudit);onAudit({phase:'review',attempt:attempt+1,text:check});
   let checked;try{checked=parseCheck(check,draft);}catch(e){
    if(!(e instanceof ReplyRejected))throw e;
    onAudit({phase:'review-invalid',attempt:attempt+1,reason:e.message});onPhase('Ein ungültiger Prüfbeleg wird erneut geprüft …');
    const retry={...reviewRequest,messages:[{...reviewRequest.messages[0],content:reviewRequest.messages[0].content+'\nThe previous review had invalid formatting or an unsupported quote. Evaluate the SAME final answer afresh. Quote exact contiguous words from the final answer for any factual or grammatical objection. Missing question parts are checked elsewhere and must never be tagged as factual errors. Do not automatically pass; apply both criteria independently.'},...reviewRequest.messages.slice(1)]};
    check=await complete(engine,retry,signal,modelId,onAudit);onAudit({phase:'review-retry',attempt:attempt+1,text:check});checked=parseCheck(check,draft);
   }
   if(checked.facts==='pass'&&checked.language==='pass'){
    if(!repetitionDetected&&figure.id==='nelson'&&confirmsNelsonCoverage(question,draft)){
     onAudit({phase:'coverage-proof',attempt:attempt+1,reason:'Die einfache Frage ist durch Lebensrecht oder Schutzpflicht plus Tötungsgrenze beantwortet.'});checked={...checked,coverage:'pass',verdict:'pass'};
    }else{
     onPhase('Die tatsächlichen Frageteile werden unabhängig vom Quellenkatalog geprüft …');
     const rawCoverage=await complete(engine,{messages:[{role:'system',content:'Prüfe ausschliesslich, ob die Antwort auf die tatsächlich gestellte Frage eingeht und ihre Teilfragen beantwortet. Du prüfst hier KEINE Fakten oder Grammatik; das erfolgt getrennt. Verlange keine vollständige Darstellung des Dramas, keine zusätzlichen Argumente und keine Wiederholung einer bereits in der Frage gegebenen Prämisse. Sinngleiche und indirekt formulierte Antworten gelten. Die Wiederholung unveränderter Fakten ist zulässig, wenn sie die aktuelle Frage konkret beantwortet. Ein bloss wiederholtes Profil ohne Antwort auf die Nachfrage genügt nicht. Vergleich zuerst in höchstens 30 Wörtern: Welche Frage fordert welche Antwort, und wo wird sie beantwortet? Gib comparison, coverage (pass/revise), missing zurück. Bei revise muss missing ein wörtlicher Ausschnitt der aktuellen Frage sein, der unbeantwortet blieb, keine erfundene Zusatzanforderung. Bei pass ist missing leer.'},{role:'user',content:`VORHERIGE SCHÜLERFRAGEN (nur Kontext für Bezüge): ${JSON.stringify(history.filter(m=>m.role==='user').slice(-3).map(m=>m.content))}\nAKTUELLE FRAGE: ${question}\n${repetitionDetected?'ÄHNLICHE VORHERIGE ANTWORT (nur zum Vergleich): '+previous.at(-1)+'\n':''}ANTWORT: ${draft}`}],temperature:0,max_tokens:280,response_format:{type:'json_object',schema:COVERAGE_SCHEMA}},signal,modelId,onAudit);
     onAudit({phase:'coverage-review',attempt:attempt+1,text:rawCoverage});const coverage=parseCoverage(rawCoverage,question);checked={...checked,coverage:coverage.coverage,verdict:coverage.coverage==='pass'?'pass':'revise',reason:coverage.coverage==='revise'?'Unbeantworteter Frageteil: '+coverage.missing:''};
    }
   }

   if(checked.verdict==='pass')return {text:draft,validated:true,qualityVersion:QUALITY_VERSION,validation:{facts:checked.facts,language:checked.language,coverage:checked.coverage,sourceRules:'pass'},modelId,attempts:attempt+1};issues.push(checked.reason||'Der Entwurf entspricht nicht den verbindlichen Fakten oder geht nicht konkret auf die Frage ein.');
  }
  lastReason=issues.join(' ');correction=lastReason+ ' Beantworte die ursprüngliche Frage neu und konkret. Gehe ausdrücklich auf die geänderte Prämisse oder Nachfrage ein. Wiederhole nicht einfach das Profil oder die vorige Begründung. Erfinde keine fehlenden Angaben.';
 }
 throw new ReplyRejected('Prüfhinweis: '+lastReason.slice(0,180)+' Die lokale KI konnte nach einer Korrektur keine ausreichend verlässliche Antwort formulieren. Ihr könnt erneut versuchen oder die Stelle gemeinsam am Stück prüfen. Es wird keine Ersatzantwort eingesetzt.');
}
