import {PHASES,ROLES} from './content.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const phaseOptions=[
 ['Ihr könntet zuerst klären, welche Fakten feststehen und welche Fragen offen sind.','Welche Tatsachen nehmen wir aus der Akte als gesichert an, und was möchten wir heute klären?'],
 ['Du könntest die Rollen und den ergebnisoffenen Ablauf gemeinsam klären.','Bevor wir beginnen: Sind die Rollen und der Ablauf für alle verständlich?'],
 ['Eine Möglichkeit wäre, Tatvorwurf und Beleg voneinander zu trennen.','Welche konkrete Handlung wird Koch vorgeworfen, und auf welche Belege stützen Sie sich?'],
 ['Du könntest Koch Gelegenheit zu seiner Sicht geben, ohne eine Aussage zu verlangen.','Möchten Sie sich zum Vorwurf äussern? Sie können auch schweigen.'],
 ['Du könntest mit Lauterbach eine Chronologie aus Informationen und Befehlen aufbauen.','Welche Information lag zu welchem Zeitpunkt vor, und an wen wurde sie weitergegeben?'],
 ['Eine Möglichkeit wäre, Meisers Bericht zunächst Raum zu geben und dann behutsam nachzufragen.','Möchten Sie Ihren Bericht fortsetzen oder zunächst eine kurze Pause machen?'],
 ['Du könntest nach Nelson auch die Perspektive der Nebenklage einladen.','Welche Punkte möchte die Nebenklage ergänzen, und welche Belege tragen diese Sicht?'],
 ['Du könntest die Verteidigung um ihre Antwort auf das stärkste Gegenargument bitten.','Welcher Einwand gegen Ihre Position wiegt am schwersten, und wie beantworten Sie ihn?'],
 ['Du könntest Koch Raum für sein letztes Wort geben.','Herr Koch, was möchten Sie dem Gericht vor der Beratung noch sagen?'],
 ['Du könntest gesicherte Tatsachen, offene Fragen und rechtliche Bewertung getrennt sammeln.','Welche Feststellungen sind belegt, welche bleiben offen, und was bedeutet das für unsere Begründung?'],
 ['Du könntest nach der Begründung zu einem Perspektivwechsel ausserhalb der Rollen einladen.','Welches Gegenargument hat euch am meisten beschäftigt, und welche Frage ist offen geblieben?']
];
const content=m=>['aussage','frage','einwand'].includes(m.kind);
export function recommend(room,previous=null){
 if(!room||room.closed)return [];
 const tips=[];const phase=room.phase||0;
 const add=(key,title,reason,options,ref='',priority=1)=>tips.push({key,title,reason,options,ref,priority,phase});
 if(!previous||previous.phase!==phase||previous.cycles!==room.cycles){const p=phaseOptions[phase]||phaseOptions[0];add('phase:'+phase+':'+(room.cycles||0),previous&&previous.cycles!==room.cycles?'Du übernimmst den Vorsitz':'Option für '+PHASES[phase][0],'Aktuelle Verfahrensphase · kein vorgeschriebener Ablauf.',[{label:p[0],text:p[1]},{label:'Zuerst offene Fragen aus der Gruppe sammeln.',text:'Welche Frage sollten wir noch klären, bevor wir weitergehen?'}],'Verfahrenshilfe · '+PHASES[phase][0],0);}
 // Only react to genuinely new contributions, not a replay of the room history.
 if(!previous)return tips;
 const lastId=Math.max(0,...previous.messages.map(m=>m.id));
 for(const m of room.messages.filter(m=>m.id>lastId&&content(m)&&m.role!=='richter').slice(-8)){
  const who=ROLES[m.role]?.short||m.role;const why=`Beitrag #${m.id} von ${who}: „${m.text.slice(0,180)}${m.text.length>180?' …':''}“`;
  if(m.kind==='einwand')add('objection:'+m.id,'Einen Einwand klären',why,[{label:'Den strittigen Punkt eingrenzen lassen.',text:'Wogegen richtet sich Ihr Einwand genau: gegen eine Tatsache, eine Schlussfolgerung oder den Ablauf?'},{label:'Die andere Seite zu diesem Punkt hören.',text:'Wie antwortet die andere Seite auf diesen konkreten Einwand?'}],'Gesprächsführung',5);
  else if(m.kind==='frage')add('question:'+m.id,'Eine Frage aufnehmen',why,[{label:'Eine passende Auskunftsperson einladen.',text:'Wer kann diese Frage aus dem eigenen Wissensstand beantworten? Bitte nennen Sie auch die Grundlage.'},{label:'Die Frage zunächst als offen festhalten.',text:'Wir könnten diese Frage vorerst offen festhalten. Welchen Beleg bräuchten wir zur Klärung?'}],'Belegprüfung',2);
  const t=m.text.toLowerCase();
  if(/sms|cockpit|passagiere.*(versuch|widerstand)/.test(t))add('knowledge:'+m.id,'Wissensstände auseinanderhalten',why,[{label:'Nach dem damaligen Informationsstand fragen.',text:room.variant==='kontakt'?'In unserer Variante kennt Koch die Meldung über den Cockpitversuch. Was wusste er damit tatsächlich, und was blieb ungewiss?':'Welche Information hatte Koch vor dem Abschuss, und was erfahren wir erst durch die spätere Zeugenaussage?'},{label:'Versuch und sicheren Ausgang unterscheiden.',text:'Was belegt der Versuch am Cockpit – und was lässt sich daraus noch nicht sicher ableiten?'}],'F05–F07 · PDF-S. 51–52, 68–71',4);
  else if(/evakuier|räumung|raumung/.test(t))add('evacuation:'+m.id,'Eine Alternative konkret prüfen',why,[{label:'Zeit, Zuständigkeit und Wissen getrennt prüfen.',text:'Welche Zeit und welche Informationen standen für eine Räumung zur Verfügung? Wer konnte darüber entscheiden?'},{label:'Plan und tatsächlichen Erfolg unterscheiden.',text:'Was belegt der Räumungsplan, und welche Annahmen über seinen Erfolg bleiben zu prüfen?'}],'F04 · PDF-S. 35–41',3);
  else if(/notstand|rechtfertig|entschuldig|freispruch/.test(t))add('law:'+m.id,'Den rechtlichen Gedankengang klären',why,[{label:'Nach Voraussetzungen und Belegen fragen.',text:'Auf welche Voraussetzung Ihrer rechtlichen Begründung beziehen Sie sich, und welcher Beleg soll sie tragen?'},{label:'Spielregel, geltendes Recht und Entschuldigung unterscheiden.',text:'Sprechen wir gerade über die fiktive Regierungsregel, über geltendes Recht oder über eine persönliche Entschuldigung? Was folgt daraus für Ihre Begründung?'}],'Rechtsakte und zentrale fiktive Spielregel',3);
  else if(/70000|70[. ’']000|164|mehr menschen/.test(t))add('numbers:'+m.id,'Den Schritt von Zahlen zur Bewertung prüfen',why,[{label:'Die zusätzliche Bewertungsregel erfragen.',text:'Welche zusätzliche Regel verbindet für Sie diese Opferzahlen mit der rechtlichen Schlussfolgerung?'},{label:'Die Gegenposition ausdrücklich einladen.',text:'Welche begründete Gegenposition gibt es zu dieser Abwägung?'}],'F01 · Zahlen allein ersetzen keine Begründung',2);
 }
 for(const p of room.people||[]){const before=previous.people?.find(x=>x.role===p.role);if(p.role!=='richter'&&p.raised&&p.raised!==before?.raised)add('hand:'+p.role+':'+p.raised,'Eine Wortmeldung berücksichtigen',`${ROLES[p.role]?.short||p.role} hat sich neu gemeldet.`,[{label:'Die Wortmeldung nach dem laufenden Beitrag aufgreifen.',text:`Nach diesem Beitrag könnten wir ${ROLES[p.role]?.name||p.role} hören. Welchen Punkt möchten Sie ergänzen?`}],'Wortmeldungen · Rederecht bleibt bei dir',1);}
 const recent=room.messages.filter(content).slice(-3);if(recent.length===3&&recent.every(m=>m.role===recent[0].role)&&recent[0].role!=='richter'&&recent[2].id>lastId)add('balance:'+recent[2].id,'Weitere Perspektiven einladen','Die letzten drei Sachbeiträge stammen aus derselben Rolle. Das ist ein Gesprächssignal, kein Beweis für ein Ungleichgewicht.',[{label:'Eine bisher weniger gehörte Perspektive anbieten.',text:'Möchte eine andere Rolle auf diese Begründung eingehen oder eine offene Frage ergänzen?'},{label:'Zunächst den Gedanken abschliessen lassen.',text:'Welcher eine Punkt ist Ihnen zum Abschluss dieses Gedankens besonders wichtig?'}],'Beteiligung im Verlauf',2);
 return tips.sort((a,b)=>b.priority-a.priority);
}
export function createCoach(root,{draft,notify,storage=globalThis.sessionStorage,now=()=>Date.now()}={}){
 let previous=null,code='',role='',cycle=-1,queue=[],seen=new Set(),paused=0,enabled=true,timer,lastRender='',renderedTip=null;
 function save(){try{storage.setItem('terror-coach-'+code,JSON.stringify({enabled,paused,seen:[...seen].slice(-100)}));}catch{}}
 function draw(force=false){const visible=role==='richter'&&!!previous&&!previous.closed;root.hidden=!visible;if(!visible){root.innerHTML='';lastRender='';renderedTip=null;return;}if(!force&&root.contains?.(root.ownerDocument?.activeElement))return;const active=queue[0],key=JSON.stringify({active,enabled,paused,count:queue.length});if(key===lastRender)return;lastRender=key;renderedTip=active;
 root.innerHTML=`<div class="coach-toolbar"><b>Begleitender Vorsitz</b><label><input type="checkbox" data-coach="toggle" ${enabled?'checked':''}> Live-Tipps</label></div><p class="coach-note">Nur für dich · lokal aus Phase und Gesprächssignalen · Empfehlungen, keine Bewertung.${queue.length>1?' · '+queue.length+' Hinweise bereit.':''}</p>${!enabled?'<p>Live-Tipps ausgeschaltet.</p>':paused>now()?'<p>Hinweise für fünf Minuten pausiert.</p><button data-coach="resume">Jetzt fortsetzen</button>':active?`<article class="coach-card"><div role="status" aria-live="polite"><span class="eyebrow">MÖGLICHE NÄCHSTE SCHRITTE</span><h3>${esc(active.title)}</h3></div><p class="coach-reason">${esc(active.reason)}</p>${active.options.map((o,i)=>`<div class="coach-option"><b>${esc(o.label)}</b><p>${esc(o.text)}</p><button data-coach="draft" data-option="${i}">Als eigenen Entwurf übernehmen</button></div>`).join('')}<p class="source">${esc(active.ref)}</p><div class="coach-actions"><button data-coach="dismiss">${queue.length>1?'Nächste Option ('+(queue.length-1)+')':'Hinweis verwerfen'}</button><button data-coach="pause">5 Min. Ruhe</button></div></article>`:'<p>Die Begleitung wartet auf neue Beiträge. Du kannst den Verlauf jederzeit selbst gestalten.</p>'}`;
 }
 root.onclick=e=>{const b=e.target.closest('[data-coach]');if(!b||role!=='richter'||previous?.closed)return;const action=b.dataset.coach;if(action==='toggle'){enabled=b.checked;queue=[];}if(action==='pause'){paused=now()+300000;queue=[];clearTimeout(timer);timer=null;timer=setTimeout(()=>{paused=0;save();draw();},300000);}if(action==='resume'){paused=0;clearTimeout(timer);timer=null;}if(action==='dismiss')queue=queue.filter(t=>t.key!==renderedTip?.key);if(action==='draft'&&renderedTip){if(renderedTip.phase!==previous.phase){draw(true);return;}const option=renderedTip.options[Number(b.dataset.option)];if(option){draft(option.text);notify?.('Vorschlag in deinem Entwurf. Du kannst ihn ändern; gesendet wird erst durch dich.');queue=queue.filter(t=>t.key!==renderedTip.key);}}save();draw(true);};
 root.onfocusout=()=>setTimeout(()=>draw(),0);
 return {update(room,session){
  if(code!==session.code){code=session.code;previous=null;seen=new Set();queue=[];clearTimeout(timer);timer=null;paused=0;enabled=true;try{const saved=JSON.parse(storage.getItem('terror-coach-'+code)||'null');if(saved){enabled=saved.enabled!==false;paused=saved.paused||0;seen=new Set(saved.seen||[]);}}catch{}}
  const switched=role!==session.role||cycle!==(room.cycles||0);role=session.role;cycle=room.cycles||0;
  if(switched){queue=[];previous=null;}
  if(previous&&previous.phase!==room.phase)queue=[];
  const tips=recommend(room,previous);previous=room;
  if(queue[0]?.key.startsWith('phase:')&&tips.some(t=>t.priority>0))queue=[];
  if(role==='richter'&&enabled&&paused<=now())for(const tip of tips){if(seen.has(tip.key))continue;seen.add(tip.key);if(queue[0]&&tip.priority>queue[0].priority){queue.unshift(tip);queue=queue.slice(0,3);}else if(queue.length<3)queue.push(tip);}
  if(role!=='richter'||room.closed)queue=[];
  if(paused>now()&&!timer)timer=setTimeout(()=>{timer=null;paused=0;save();draw();},paused-now());
  save();draw();
 },hide(){role='';queue=[];clearTimeout(timer);timer=null;timer=null;draw();},destroy(){clearTimeout(timer);timer=null;root.innerHTML='';root.hidden=true;}};
}
