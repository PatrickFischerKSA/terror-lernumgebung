import {profileFor,RELATIONS,PROFILE_VERSION} from './profiles.js?v=20261122-sprache14';
import {messagesFor,visibleReply,QUALITY_VERSION} from './core.js?v=20261122-sprache14';
export const CHECK_SCHEMA=JSON.stringify({type:'object',properties:{verdict:{type:'string',enum:['pass','revise']},reason:{type:'string',maxLength:180}},required:['verdict','reason'],additionalProperties:false});
export class ReplyRejected extends Error {}
const normalized=s=>s.normalize('NFKC').toLowerCase().replace(/ß/g,'ss');
// Conservative, explicit invariants supplement the separate semantic check.
export function identityConflicts(id,text){
 const s=normalized(text), issues=[];
 const assertions=s.split(/[.!?]/).filter(sentence=>!/\b(wenn|hätte|wäre|angenommen|hypothetisch)\b/.test(sentence)).join('.');
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
 if(id==='koch'&&/meine entscheidung war falsch|ich habe falsch gehandelt|ich bereue (?:den abschuss|meine entscheidung)/.test(s)&&!/angenommen|bereuen|ändert|ändern|widerruf/i.test(question))issues.push('Koch verteidigt im Stück seine Entscheidung. Keine nicht verlangte Umkehr zu Reue oder einem pauschalen Schuldbekenntnis erfinden; Tatgeständnis und rechtliche Bewertung unterscheiden.');
 if(id==='koch'&&/(?:flug|einsatz).{0,30}(?:abgebrochen|abbrechen)|flugabbruch/.test(s)&&!/abgeschossen|abschuss|schoss.{0,35}ab/.test(s))issues.push('Koch hat das Flugzeug abgeschossen und 164 Menschen getötet. Nicht als blossen Flugabbruch umschreiben.');
 if(/\b(?:blijf|blijven|omdat|although)\b|ich (?:es )?leid ist|ich (?:damals )?sehr schwer stand|den abschuss (?:zu )?(?:treffen|geben)|unschuldige leben getötet|ich bin traurig dafür|familien haben.{0,15}zerbrochen/.test(s))issues.push('Die Formulierung ist sprachlich fehlerhaft. Schreibe idiomatische, vollständige deutsche Sätze mit präzisen Verben.');
 return issues;
}
export function repeatsReply(a,b){
 const words=t=>normalized(t).replace(/[^\p{L}\p{N} ]/gu,' ').split(/\s+/).filter(Boolean);
 const aw=words(a),bw=words(b);if(aw.length<35||bw.length<35)return normalized(a)===normalized(b);
 const grams=w=>new Set(w.slice(0,-3).map((_,i)=>w.slice(i,i+4).join(' ')));
 const x=grams(aw),y=grams(bw);let shared=0;for(const g of x)if(y.has(g))shared++;
 return shared/Math.max(1,Math.min(x.size,y.size))>0.72;
}
export function parseCheck(raw){
 let result;try{result=JSON.parse(visibleReply(raw));}catch{throw new ReplyRejected('Die lokale Faktenprüfung lieferte kein lesbares Ergebnis.');}
 if(!result||!['pass','revise'].includes(result.verdict)||typeof result.reason!=='string')throw new ReplyRejected('Die lokale Faktenprüfung war unvollständig.');
 return result;
}
async function complete(engine,request,signal){
 if(signal?.aborted)throw new DOMException('Antwort gestoppt','AbortError');
 let timer,abort;
 const stopped=new Promise((_,reject)=>{abort=()=>{engine.interruptGenerate();reject(new DOMException('Antwort gestoppt','AbortError'));};signal?.addEventListener('abort',abort,{once:true});timer=setTimeout(()=>{engine.interruptGenerate();reject(new Error('Die lokale Antwort oder Prüfung dauert zu lange. Bitte erneut versuchen.'));},90000);});
 try {const result=await Promise.race([engine.chat.completions.create({...request,stream:false,extra_body:{enable_thinking:false}}),stopped]);if(signal?.aborted)throw new DOMException('Antwort gestoppt','AbortError');if(result.choices?.[0]?.finish_reason==='length')throw new ReplyRejected('Die Antwort wurde vorzeitig abgeschnitten. Bitte die Frage kürzer stellen.');return visibleReply(result.choices?.[0]?.message?.content||'');}
 finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
export async function generateGroundedReply({engine,figure,passage,history,question,signal,onPhase=()=>{}}){
 const messages=messagesFor(figure,passage,history,question), previous=history.filter(m=>m.role==='assistant'&&m.validated&&m.qualityVersion===QUALITY_VERSION&&m.profileVersion===PROFILE_VERSION).slice(-2).map(m=>m.content);
 let correction='',lastReason='';
 for(let attempt=0;attempt<2;attempt++){
  onPhase(attempt?'Antwort wird anhand der Fakten neu formuliert …':'Die Figur formuliert eine eigene Antwort …');
  const input=correction?[messages[0],{role:'user',content:'Bisheriges Gespräch (nur Kontext, nicht wiederholen): '+JSON.stringify(messages.slice(1,-1))+'\n'+messages.at(-1).content+'\nKorrekturauftrag: '+correction+'\nBeantworte jetzt genau diese Frage: '+question}]:messages;
  let draft=await complete(engine,{messages:input,temperature:0.65,top_p:0.85,frequency_penalty:0.2,presence_penalty:0.2,max_tokens:360},signal);
  if(!draft)throw new ReplyRejected('Die lokale KI hat keine vollständige Antwort formuliert.');
  let issues=identityConflicts(figure.id,draft);
  if(!issues.length){
   onPhase('Sprache, Klarheit und genaue Benennung werden überarbeitet …');
   draft=await complete(engine,{messages:[{role:'system',content:`You edit German dialogue, not the story. Rewrite the draft in clear, idiomatic Swiss Standard German, first person of ${figure.name}, at most 3–4 short complete sentences. No minimum length. Shorten rather than pad. Answer the substance, not merely how difficult answering is. Avoid repetitive filler such as Es ist schwer. Output ONLY the rewritten reply, no heading or commentary. Preserve the character's position, uncertainty and hypothetical status. Correct grammar, mixed languages, vague verbs, filler and evasion. Do not add new content, personal experiences or emotions to reach a word count. Do not claim that the character has lost a parent or suffered any undocumented private event. Address the specific question directly. Use concrete facts below, without inventing new events, names, emotions as facts or legal outcomes. For a question about Koch's decision, responsibility, killing or children losing parents, explicitly write that he shot down the aircraft and killed 164 people; do not call it merely aborting a flight. Do not replace his admission of responsibility with generic 'I wanted to help'. Do not add a stock moral verdict or rewrite the character's position. Keep Boris as Koch's son, not an unknown person.
EXISTING CHARACTER POSITION AND TASK: ${figure.principle}. ${figure.prompt}. Acknowledging the act is not a confession that the decision was wrong or legally guilty. Do not invent a change of conviction.
IMMUTABLE FACTS:
${profileFor(figure.id).facts.map(([label,text])=>label+': '+text).join('\n')}
${RELATIONS}`},{role:'user',content:JSON.stringify({question,recentConversation:messages.slice(1,-1),draft})}],temperature:0.2,max_tokens:360},signal);
   if(!draft)throw new ReplyRejected('Die sprachliche Überarbeitung hat keine vollständige Antwort erzeugt.');
   issues=[...identityConflicts(figure.id,draft),...expressionIssues(figure.id,draft,question)];
  }
  if(previous.some(p=>repeatsReply(p,draft)))issues.push('Die Antwort wiederholt weitgehend die vorherige Antwort, statt auf die neue Frage einzugehen.');
  if(!issues.length){
   onPhase('Identität, Fakten, Sprache und Bezug zur Frage werden lokal geprüft …');
   const check=await complete(engine,{messages:[{role:'system',content:`You check a fictional character's draft answer against FACTS below. You are NOT the character. Return JSON only: {"verdict":"pass" or "revise","reason":"at most 12 words; empty for pass"}. Default to pass. Revise only for a concrete claim actually present in the DRAFT that contradicts FACTS, an invented biography/event/quotation attributed to the play, an answer that ignores the changed premise of the current question, clearly ungrammatical or mixed-language German, or a euphemism that replaces shooting down the aircraft with merely aborting a flight. The question is NOT a claim by the character. Do not invent a claim absent from the draft. Plausible feelings, interpretations, arguments and hypothetical dialogue are allowed. Do not judge the morality or persuasiveness of the argument. Do not demand new textual evidence for every interpretation. Role-play speech is NOT a claimed original quotation.
Examples: FACT: Boris is Koch's son. DRAFT: "I thought of Boris." => pass (no daughter claim!). FACT: Koch is the accused. DRAFT: "I am not the defender, I am the accused." => pass (negation agrees!). FACT: Koch has a son. DRAFT: "I have no children." => revise. FACT: his son is Boris. DRAFT: "I would tell him I wanted to save people." => pass (hypothetical speech).
CHARACTER POSITION AND TASK: ${figure.principle}. ${figure.prompt}. Do not invent a reversal of this position unless the question explicitly asks for that counterfactual.
FACTS:
\n${profileFor(figure.id).facts.map(([label,text])=>label+': '+text).join('\n')}\nAndere Figuren: ${RELATIONS}`},{role:'user',content:JSON.stringify({recentConversation:messages.slice(1,-1),question,providedPassage:passage,answerToCheck:draft})}],temperature:0,max_tokens:160,response_format:{type:'json_object',schema:CHECK_SCHEMA}},signal);
   const checked=parseCheck(check);if(checked.verdict==='pass')return {text:draft,validated:true,qualityVersion:QUALITY_VERSION,attempts:attempt+1};issues.push(checked.reason||'Der Entwurf entspricht nicht den verbindlichen Fakten oder geht nicht konkret auf die Frage ein.');
  }
  lastReason=issues.join(' ');correction=lastReason+ ' Beantworte die ursprüngliche Frage neu und konkret. Gehe ausdrücklich auf die geänderte Prämisse oder Nachfrage ein. Wiederhole nicht einfach das Profil oder die vorige Begründung. Erfinde keine fehlenden Angaben.';
 }
 throw new ReplyRejected('Prüfhinweis: '+lastReason.slice(0,180)+' Die lokale KI konnte nach einer Korrektur keine ausreichend verlässliche Antwort formulieren. Bitte präzisiert die Frage oder ergänzt einen kurzen Textbeleg. Es wird keine Ersatzantwort eingesetzt.');
}
