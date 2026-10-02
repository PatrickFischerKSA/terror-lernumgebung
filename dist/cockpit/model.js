export const DURATION=180;
export const EVENTS=[
 {at:0,who:'Lage',text:'Du bist Lars Koch. Das Passagierflugzeug liegt vor dir. Nach der Einsatzmeldung sind 164 Menschen an Bord. Als mögliches Ziel wird ein Stadion mit 70’000 Menschen genannt. Du kannst nicht sehen, was in der Kabine geschieht.',scene:'begleitung'},
 {at:25,who:'Innerer Monolog · erfunden',text:'Ich sehe eine Maschine. Hinter diesen Fenstern sitzen Menschen. Wer weiss dort gerade mehr als ich?',scene:'kontakt'},
 {at:55,who:'Lauterbach · erfundener Funkdialog',text:'Deine Anfrage wird weitergegeben. Die Entscheidung liegt nicht allein bei mir. Radtke trägt die Frage an den Verteidigungsminister heran.'},
 {at:85,who:'Lauterbach · erfundener Funkdialog',text:'Rückmeldung aus der Befehlskette: Keine Freigabe. Das Flugzeug darf nicht abgeschossen werden. Der Minister hat den Abschuss abgelehnt.',scene:'befehl'},
 {at:120,who:'Beobachtung · simuliert',text:'Die Maschine geht in einen sichtbaren Sinkflug über. Du deutest dies als Zuspitzung der Gefahr für das Stadion. Der Sinkflug allein zeigt dir nicht, wer gerade die Kontrolle hat.',scene:'sinkflug'},
 {at:150,who:'Innerer Monolog · erfunden',text:'Die Zeit drängt. Ich wünsche mir Gewissheit. Aber wird etwas dadurch sicher, dass ich es nicht länger offenlassen kann?',scene:'nahsicht'},
 {at:180,who:'Entscheidungspunkt',text:'Die simulierte Entscheidungszeit ist abgelaufen. Das Bild hält an. Es wird keine Entscheidung für dich getroffen. Was willst du verantworten?',scene:'entscheidung'}
];
export const CALLS={
 cockpit:{label:'Cockpit / Entführer ansprechen',own:'Ich versuche, die Person im Cockpit des Passagierflugzeugs anzusprechen. Wer führt die Maschine? Können Sie mich hören?',reply:'Keine verständliche Antwort. Du weisst nicht, ob die Übertragung gehört wurde, ob jemand antworten kann oder wer im Cockpit die Kontrolle hat.'},
 lauterbach:{label:'Lauterbach um Entscheidung bitten',own:'Lauterbach, ich brauche eine Entscheidung. Wie lautet der Befehl?',reply:'Lauterbach: Ich gebe deine Frage weiter. Radtke ist eingeschaltet; die Entscheidung wird an den Verteidigungsminister herangetragen.'},
 kabine:{label:'Nach Menschen in der Kabine fragen',own:'Gibt es Informationen von Besatzung oder Passagieren? Versucht jemand einzugreifen?',reply:'Lauterbach: Mir liegt dazu keine belastbare Rückmeldung vor. Keine Nachricht bedeutet nicht, dass dort niemand handelt.'},
 stadion:{label:'Nach Räumung des Stadions fragen',own:'Was ist mit dem Stadion? Werden die Menschen herausgebracht?',reply:'Lauterbach: Ich kann dir keine bestätigte Räumung melden. Die Information, die du brauchst, liegt mir jetzt nicht vor.'}
};
export function createState(){return {elapsed:0,eventIndex:0,log:[],pending:[],called:[],ended:false,choice:null};}
export function advance(s,seconds){if(s.ended)return [];s.elapsed=Math.min(DURATION,s.elapsed+Math.max(0,seconds));const added=[];while(s.eventIndex<EVENTS.length&&EVENTS[s.eventIndex].at<=s.elapsed){const e=EVENTS[s.eventIndex++];added.push({...e});}for(const p of s.pending.filter(p=>p.at<=s.elapsed))added.push(p);s.pending=s.pending.filter(p=>p.at>s.elapsed);added.sort((a,b)=>a.at-b.at);s.log.push(...added);return added;}
export function call(s,id){if(s.ended||s.elapsed>=DURATION||!CALLS[id]||s.called.includes(id))return false;s.called.push(id);s.log.push({at:s.elapsed,who:'Du · erfundener Funkdialog',text:CALLS[id].own});s.pending.push({at:Math.min(DURATION,s.elapsed+7),who:'Funk · erfunden',text:id==='lauterbach'&&s.elapsed>=85?'Lauterbach: Der Nicht-Abschussbefehl gilt. Es liegt keine neue Freigabe vor.':CALLS[id].reply});return true;}
export function decide(s,choice){if(s.ended||!['schiessen','nicht','offen'].includes(choice))return false;s.ended=true;s.choice=choice;s.log.push({at:s.elapsed,who:'Deine Entscheidung',text:{schiessen:'Abschuss entscheiden',nicht:'Nicht schiessen',offen:'Entscheidung bewusst offenlassen'}[choice]});return true;}
