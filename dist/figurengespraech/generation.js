import {profileFor,RELATIONS,PROFILE_VERSION} from './profiles.js?v=20261122-free6';
import {messagesFor,visibleReply} from './core.js?v=20261122-free6';
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
 if(id==='meiser'&&/mein sohn boris|boris ist mein sohn|ich (?:bin|war) (?:staatsanwältin|selbst an bord)|ich habe keine kinder/.test(s))issues.push('Meiser ist Nebenklägerin und Zeugin, Mutter einer siebenjährigen Tochter, nicht an Bord.');
 if(!['koch','meiser'].includes(id)&&/mein(?:e|en)? (?:sohn|tochter|ehefrau|ehemann)|ich (?:bin verheiratet|habe (?:ein|zwei|drei|keine) kinder)/.test(assertions))issues.push('Für diese Figur sind private Angehörige und Familienstand nicht belegt.');
 if(id==='nelson'&&/ich (?:bin|vertrete).{0,25}(?:kochs verteidiger|die verteidigung)|mein mandant ist/.test(s))issues.push('Nelson vertritt die Anklage, nicht Kochs Verteidigung.');
 if(id==='biegler'&&/ich (?:bin|war) (?:der )?(?:staatsanwalt|pilot)|ich vertrete die anklage/.test(s))issues.push('Biegler ist Kochs Verteidiger, kein Pilot oder Staatsanwalt.');
 if(id==='lauterbach'&&/ich (?:bin|war) (?:der )?(?:major|pilot)|ich habe.{0,20}(?:flugzeug abgeschossen|abschuss ausgeführt)/.test(s))issues.push('Lauterbach ist Oberstleutnant und Duty Controller, nicht Abschusspilot.');
 if(id==='vorsitz'&&/ich (?:bin|vertrete) (?:der |die )?(?:staatsanwalt|verteidiger|anklage|verteidigung)/.test(s))issues.push('Der Vorsitzende leitet die Verhandlung, er ist keine Prozesspartei.');
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
 const messages=messagesFor(figure,passage,history,question), previous=history.filter(m=>m.role==='assistant'&&m.validated&&m.profileVersion===PROFILE_VERSION).slice(-2).map(m=>m.content);
 let correction='',lastReason='';
 for(let attempt=0;attempt<2;attempt++){
  onPhase(attempt?'Antwort wird anhand der Fakten neu formuliert …':'Die Figur formuliert eine eigene Antwort …');
  const input=correction?[messages[0],{role:'user',content:'Bisheriges Gespräch (nur Kontext, nicht wiederholen): '+JSON.stringify(messages.slice(1,-1))+'\n'+messages.at(-1).content+'\nKorrekturauftrag: '+correction+'\nBeantworte jetzt genau diese Frage: '+question}]:messages;
  const draft=await complete(engine,{messages:input,temperature:0.65,top_p:0.85,frequency_penalty:0.2,presence_penalty:0.2,max_tokens:360},signal);
  if(!draft)throw new ReplyRejected('Die lokale KI hat keine vollständige Antwort formuliert.');
  let issues=identityConflicts(figure.id,draft);
  if(previous.some(p=>repeatsReply(p,draft)))issues.push('Die Antwort wiederholt weitgehend die vorherige Antwort, statt auf die neue Frage einzugehen.');
  if(!issues.length){
   onPhase('Identität, Fakten und Bezug zur Frage werden lokal geprüft …');
   const check=await complete(engine,{messages:[{role:'system',content:`You check a fictional character's draft answer against FACTS below. You are NOT the character. Return JSON only: {"verdict":"pass" or "revise","reason":"at most 12 words; empty for pass"}. Default to pass. Revise only for a concrete claim actually present in the DRAFT that contradicts FACTS, an invented biography/event/quotation attributed to the play, or an answer that ignores the changed premise of the current question. The question is NOT a claim by the character. Do not invent a claim absent from the draft. Plausible feelings, interpretations, arguments and hypothetical dialogue are allowed. Do not judge the morality or persuasiveness of the argument. Do not demand new textual evidence for every interpretation. Role-play speech is NOT a claimed original quotation.
Examples: FACT: Boris is Koch's son. DRAFT: "I thought of Boris." => pass (no daughter claim!). FACT: Koch is the accused. DRAFT: "I am not the defender, I am the accused." => pass (negation agrees!). FACT: Koch has a son. DRAFT: "I have no children." => revise. FACT: his son is Boris. DRAFT: "I would tell him I wanted to save people." => pass (hypothetical speech).
FACTS:
\n${profileFor(figure.id).facts.map(([label,text])=>label+': '+text).join('\n')}\nAndere Figuren: ${RELATIONS}`},{role:'user',content:JSON.stringify({recentConversation:messages.slice(1,-1),question,providedPassage:passage,answerToCheck:draft})}],temperature:0,max_tokens:160,response_format:{type:'json_object',schema:CHECK_SCHEMA}},signal);
   const checked=parseCheck(check);if(checked.verdict==='pass')return {text:draft,validated:true,attempts:attempt+1};issues.push(checked.reason||'Der Entwurf entspricht nicht den verbindlichen Fakten oder geht nicht konkret auf die Frage ein.');
  }
  lastReason=issues.join(' ');correction=lastReason+ ' Beantworte die ursprüngliche Frage neu und konkret. Gehe ausdrücklich auf die geänderte Prämisse oder Nachfrage ein. Wiederhole nicht einfach das Profil oder die vorige Begründung. Erfinde keine fehlenden Angaben.';
 }
 throw new ReplyRejected('Prüfhinweis: '+lastReason.slice(0,180)+' Die lokale KI konnte nach einer Korrektur keine ausreichend verlässliche Antwort formulieren. Bitte präzisiert die Frage oder ergänzt einen kurzen Textbeleg. Es wird keine Ersatzantwort eingesetzt.');
}
