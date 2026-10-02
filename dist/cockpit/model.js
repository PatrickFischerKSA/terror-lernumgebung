export const DURATION=180;
export const EVENTS=[
 {at:0,who:'Lage',text:'Du bist Lars Koch. Du fliegst neben dem Passagierflugzeug und blickst seitlich durch die Cockpithaube. Nach der Einsatzmeldung sind 164 Menschen an Bord. Als mögliches Ziel wird ein Stadion mit 70’000 Menschen genannt. Du kannst nicht sehen, was in der Kabine geschieht.',scene:'begleitung'},
 {at:25,who:'Innerer Monolog · erfunden',text:'Ich sehe eine Maschine. Hinter diesen Fenstern sitzen Menschen. Wer weiss dort gerade mehr als ich?',scene:'kontakt'},
 {at:120,who:'Beobachtung · simuliert',text:'Die Maschine geht in einen sichtbaren Sinkflug über. Du deutest dies als Zuspitzung der Gefahr für das Stadion. Der Sinkflug allein zeigt dir nicht, wer gerade die Kontrolle hat.',scene:'sinkflug'},
 {at:150,who:'Innerer Monolog · erfunden',text:'Die Zeit drängt. Ich wünsche mir Gewissheit. Aber wird etwas dadurch sicher, dass ich es nicht länger offenlassen kann?',scene:'nahsicht'},
 {at:180,who:'Entscheidungspunkt',text:'Die simulierte Entscheidungszeit ist abgelaufen. Das Bild hält an. Es wird keine Entscheidung für dich getroffen. Was willst du verantworten?',scene:'entscheidung'}
];
export function createState(){return {elapsed:0,eventIndex:0,log:[],pending:[],ended:false,choice:null,dialog:{awaiting:null,topic:null,repeats:{},contactFailed:false,escalation:'none',requestAt:null}};}
export function advance(s,seconds){if(s.ended)return [];s.elapsed=Math.min(DURATION,s.elapsed+Math.max(0,seconds));const due=[];while(s.eventIndex<EVENTS.length&&EVENTS[s.eventIndex].at<=s.elapsed)due.push({...EVENTS[s.eventIndex++]});due.push(...s.pending.filter(p=>p.at<=s.elapsed));s.pending=s.pending.filter(p=>p.at>s.elapsed);due.sort((a,b)=>a.at-b.at);const added=[];for(const e of due){if(e.kind==='forwarded')s.dialog.escalation='forwarded';if(e.kind==='refused')s.dialog.escalation='refused';if(e.kind==='reply'){const response=radioReply(e.message,s);added.push({at:e.at,...response,radio:true});}else{const {kind,...entry}=e;added.push(entry);}}s.log.push(...added);return added;}
export function decide(s,choice){if(s.ended||!['schiessen','nicht','offen'].includes(choice))return false;s.ended=true;s.choice=choice;s.log.push({at:s.elapsed,who:'Deine Entscheidung',text:{schiessen:'Abschuss entscheiden',nicht:'Nicht schiessen',offen:'Entscheidung bewusst offenlassen'}[choice]});return true;}

const norm=text=>text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');
function beginRequest(s){if(s.dialog.escalation!=='none')return;const at=s.elapsed;s.dialog.escalation='requested';s.dialog.requestAt=at;s.dialog.awaiting=null;
 s.pending.push({at:at+12,kind:'forwarded',who:'Lauterbach · inszenierter Funk',text:'Koch, deine Rückfrage ist bei Radtke. Er hat sie an den Verteidigungsminister weitergegeben. Eine Antwort liegt mir noch nicht vor.'});
 s.pending.push({at:at+35,kind:'refused',who:'Lauterbach · inszenierter Funk',text:'Jetzt Rückmeldung von Radtke: Der Minister hat den Abschuss abgelehnt. Ich gebe dir den Befehl weiter: nicht abschiessen.',scene:'befehl'});
}
export function radioReply(text,s){const t=norm(text),d=s.dialog;const reply=text=>({who:'Lauterbach · inszenierter Funk',text});
 if(/^(?:lufthansa|airbus|entfuhrer|cockpit|passagierflugzeug)[, :]|(?:an|rufe|spreche) (?:das |die |den )?(?:cockpit|entfuhrer|lufthansa)/.test(t)&&!/lauterbach/.test(t)){d.topic='contact';return {who:'Passagierflugzeug · Funkversuch',text:'[Rauschen. Keine verständliche Antwort.]'};}
 if(!/minister|radtke|befehl/.test(t)&&/handzeichen|sichtkontakt|funkkontakt|nicht erreichen|kein(?:e|en)? (?:antwort|reaktion|kontakt)|auch.*nicht.*erreich/.test(t)){
  const repeat=d.contactFailed;d.contactFailed=true;d.topic='contact';if(d.escalation!=='none')return reply('Deine Meldung ist angekommen. '+(d.escalation==='refused'?'Der übermittelte Nicht-Abschussbefehl gilt weiterhin.':'Deine Rückfrage läuft bereits. Eine Entscheidung liegt noch nicht vor.'));d.awaiting='request';return reply(repeat?'Auch der erneute Kontaktversuch bleibt ohne Reaktion. Verstanden. Soll ich eine Entscheidung bei Radtke anfordern?':'Verstanden, Koch: keine Reaktion auf deine Kontaktversuche. Ich habe dazu noch keine Rückfrage gestellt. Brauchst du eine Entscheidung aus der Befehlskette?');
 }
 if(d.escalation==='requested'&&/^(?:ja|bitte|genau|unbedingt|mach|tu das|fordere)/.test(t)){d.awaiting=null;return reply('Verstanden. Ich fordere die Entscheidung bei Radtke an. Bleib am Funk.');}
 if(/befehl|schiess|schuss|feuer|freigabe|erlaub|minister|radtke|entschei|genehmig|nachgefragt|nachfragen|ruckmeldung|antwort|weitergeb/.test(t)||(/^(ja|bitte|und|was jetzt)/.test(t)&&d.topic==='command')){
  d.topic='command';const n=d.repeats.command=(d.repeats.command||0)+1;
  if(d.escalation==='refused')return reply(n%2?'Der Nicht-Abschussbefehl gilt. Ich habe keine neue Entscheidung.':'Ich habe deine erneute Nachfrage gehört. Es liegt keine Änderung des Befehls vor.');
  if(d.escalation==='forwarded')return reply(n%2?'Noch keine Antwort. Radtke hat die Anfrage weitergegeben. Ich melde mich, sobald er sich zurückmeldet.':'Koch, ich warte ebenfalls. Vom Minister ist bei mir noch nichts angekommen.');
  if(d.escalation==='requested')return reply('Ich habe die Rückfrage aufgenommen und gebe sie an Radtke. Noch liegt keine Antwort vor.');
  d.awaiting='request';return reply('Du brauchst eine Entscheidung zum Abschuss. Soll ich diese Rückfrage jetzt an Radtke weitergeben?');
 }
 if(/stadion|raum|evak|zuschauer/.test(t)){d.topic='stadium';d.awaiting=null;return reply('Zur Räumung habe ich keine bestätigte Meldung. Ich kann dir nicht sagen, wie weit sie ist.');}
 if(/kabine|passagier|besatzung|crew|rett|eingreif|gegenwehr|an bord/.test(t)){d.topic='cabin';d.awaiting=null;return reply('Aus der Kabine liegt mir nichts Belastbares vor. Ob jemand eingreift, weiss ich nicht. Was konntest du selbst erkennen?');}
 if(/sink|sinkt|tiefer|zeit|kurs|gefahr/.test(t)){d.topic='flight';return reply('Deine Lagemeldung ist angekommen. '+(d.escalation==='forwarded'?'Eine Antwort auf die weitergegebene Anfrage steht noch aus.':d.escalation==='refused'?'Der übermittelte Nicht-Abschussbefehl ist unverändert.':'Welche Entscheidung brauchst du von mir?'));}
 if(/angst|hilfe|familie|sohn|frau|nerv|kann nicht|allein|verantwort|was soll ich/.test(t)){d.topic='support';return reply('Ich höre dich, Koch. Was ist gerade passiert? Sag mir, welche Rückmeldung du jetzt brauchst.');}
 if(d.awaiting==='request'&&/^(nein|noch nicht)/.test(t)){d.awaiting=null;return reply('Verstanden. Ich habe die Rückfrage nicht weitergegeben.');}
 return reply('Ich habe dich nicht eindeutig verstanden. Beschreibe kurz, was passiert ist oder was ich nachfragen soll.');
}
export function sendRadio(s,text){const message=String(text).trim().slice(0,1200);if(s.ended||s.elapsed>=DURATION||message.length<3||s.pending.filter(e=>e.kind==='reply').length>=3)return false;
 const t=norm(message);const negated=/\b(nicht|nein|keine|keinen|niemals)\b/.test(t);const confirm=!negated&&s.dialog.awaiting==='request'&&/^(?:ja|bitte|genau|unbedingt|mach|tu das|fordere)/.test(t);
 const explicit=!negated&&/(?:frag|frage|fordere|gib|geb|leite|leit).*(?:radtke|minister|weiter|freigabe|abschuss|entscheidung)|(?:radtke|minister).*(?:fragen|anfragen)/.test(t)&&!(/(?:nicht|keine) (?:weiter|nach|anfragen|ruckfrage)/.test(t));
 if(confirm||explicit)beginRequest(s);
 s.log.push({at:s.elapsed,who:'Du · eigener Funktext',text:message});s.pending.push({at:Math.min(DURATION,s.elapsed+5),kind:'reply',message});return true;}
export function interpretDecision(text){const t=norm(text).trim();if(t.length<6||/[?]/.test(t)||/\b(vielleicht|eventuell|falls|wenn|oder|sollte|wurde|unsicher)\b/.test(t))return null;
 if(/\b(offen|unentschieden)\b|noch nicht entscheiden|keine entscheidung/.test(t))return 'offen';
 const no=/nicht (?:zu )?(?:ab)?schiess|schiesse nicht|schiessen (?:werde ich )?nicht|kein(?:en)? (?:abschuss|schuss)|verzichte auf (?:den )?abschuss|unterlasse (?:den )?abschuss|nicht feuern|feuere nicht|gegen (?:den )?abschuss|halte (?:das )?feuer zuruck/.test(t);
 const yes=/ich (?:werde (?:jetzt )?)?(?:jetzt )?(?:schiesse|schiessen|feuere)|ich entscheide mich fur (?:den )?abschuss|ich werde (?:die maschine |das flugzeug )?abschiessen/.test(t);
 if(no){const rest=t.replace(/ich schiesse nicht|nicht (?:zu )?(?:ab)?schiessen|kein(?:en)? (?:abschuss|schuss)/g,'');if(/aber.*(?:ich schiesse|ich feuere)|doch.*abschuss/.test(rest))return null;return 'nicht';}if(/\b(nicht|kein|keine|keinen|niemals|nie)\b/.test(t))return null;return yes?'schiessen':null;}
