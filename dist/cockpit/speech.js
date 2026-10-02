export function createDictation({Recognition,onText,onStatus,onActive,setTimer=setTimeout,clearTimer=clearTimeout}){
 let current=null;
 const finish=(session,message)=>{if(current!==session)return;clearTimer(session.timer);current=null;onActive(false);onStatus(message);};
 return {
  get active(){return !!current;},
  start(base,maxLength=2000){if(current||!Recognition)return false;const recognition=new Recognition();const session={recognition,base:base.trimEnd(),parts:new Map(),timer:null};current=session;
   recognition.lang='de-DE';recognition.continuous=true;recognition.interimResults=true;recognition.maxAlternatives=1;
   onActive(true);onStatus('Mikrofon wird angefragt …');
   recognition.onstart=()=>{if(current===session)onStatus('Ich höre zu. Zum Abschluss „Diktat beenden“ wählen.');};
   recognition.onresult=e=>{if(current!==session)return;let interim='';for(let i=e.resultIndex;i<e.results.length;i++){const result=e.results[i];if(result.isFinal)session.parts.set(i,result[0].transcript.trim());else interim+=result[0].transcript+' ';}
    const text=[session.base,...session.parts.values()].filter(Boolean).join(' ');onText(text.slice(0,maxLength));onStatus(interim?'Erkannt (vorläufig): '+interim:'Text übernommen. Du kannst weiter diktieren oder beenden.');
    if(text.length>=maxLength){finish(session,'Textgrenze erreicht. Bitte den Entwurf prüfen.');recognition.abort();}
   };
   recognition.onerror=e=>{const message={ 'not-allowed':'Mikrofonzugriff wurde nicht erlaubt. Nutze die Website-Einstellungen deines Browsers oder tippe den Text.', 'service-not-allowed':'Der Browser erlaubt diesen Spracherkennungsdienst nicht. Tippen bleibt möglich.', 'audio-capture':'Kein verfügbares Mikrofon gefunden.', 'network':'Der Spracherkennungsdienst ist nicht erreichbar. Bereits erkannter Text bleibt erhalten.', 'no-speech':'Keine Sprache erkannt. Du kannst es erneut versuchen.', aborted:'Diktat beendet. Bitte den Text prüfen.'}[e.error]||'Spracherkennung unterbrochen. Bitte den Text prüfen.';finish(session,message);try{recognition.abort();}catch{}};
   recognition.onend=()=>finish(session,'Diktat beendet. Text prüfen und selbst senden bzw. Entscheidung bestätigen.');
   try{recognition.start();session.timer=setTimer(()=>{finish(session,'Diktat nach einer Minute beendet. Bereits erkannter Text bleibt erhalten.');recognition.abort();},60000);}catch{finish(session,'Spracherkennung konnte nicht starten. Bitte tippen oder in einem unterstützten Browser öffnen.');return false;}return true;
  },
  stop(){if(current){onStatus('Diktat wird abgeschlossen …');try{current.recognition.stop();}catch{this.cancel();}}},
  cancel(){if(!current)return;const session=current;finish(session,'Diktat beendet. Bereits erkannter Text bleibt erhalten.');try{session.recognition.abort();}catch{}}
 };
}
