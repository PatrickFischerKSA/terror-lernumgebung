'use strict';
const stages=[
 '0–6 s · Eine warme Quelle sendet elektromagnetische Strahlung aus. Die gelben Wellen sind ein sichtbares Symbol für unsichtbares Infrarot.',
 '6–12 s · Ein Teil der Strahlung erreicht den Sensor. Passiv bedeutet: Zur Erfassung muss dieser Sensor nicht selbst Radarimpulse aussenden.',
 '12–18 s · Die Elektronik verarbeitet das empfangene Signal. Sensor, Verarbeitung und Antrieb erfüllen verschiedene Aufgaben.',
 '18–24 s · Ein technisches Signal erkennt keine Menschen, Absichten oder Rechtslage. Diese Darstellung zeigt ein Prinzip, keinen Abschuss.'
];
let position=0,running=false,last=0,frame=0;
const play=document.getElementById('play'),scrub=document.getElementById('scrub');
function paint(){
 const stage=Math.min(3,Math.floor(position/6));
 const caption=document.getElementById('demo-caption');
 if(caption.textContent!==stages[stage])caption.textContent=stages[stage];
 document.getElementById('time').textContent=Math.floor(position)+' / 24 s';scrub.value=position;
 document.getElementById('waves').style.opacity=stage===0?'1':'.55';
 document.getElementById('sensor').style.opacity=stage>=1?'1':'.25';
 document.getElementById('signal').style.opacity=stage>=2?'1':'.15';
 document.getElementById('processing').style.opacity=stage>=2?'1':'.25';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.getElementById('waves').setAttribute('transform',reduced?'':`translate(${Math.sin(position*2)*8} 0)`);
 document.getElementById('signal').setAttribute('stroke-dashoffset',reduced?'0':String(-position*12));
 play.textContent=running?'Pause':position>=24?'Erneut abspielen':'Demofilm starten';
}
function stop(){running=false;cancelAnimationFrame(frame);paint();}
function tick(now){if(!running)return;position=Math.min(24,position+(now-last)/1000);last=now;paint();if(position>=24){stop();return;}frame=requestAnimationFrame(tick);}
play.addEventListener('click',()=>{if(running){stop();return;}if(position>=24)position=0;running=true;last=performance.now();paint();frame=requestAnimationFrame(tick);});
document.getElementById('reset').addEventListener('click',()=>{position=0;stop();});
scrub.addEventListener('input',()=>{position=Number(scrub.value);stop();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('pagehide',stop);paint();
const questions=[
 ['Was bedeutet Fly-by-wire?',['Das Flugzeug entscheidet selbst über das Flugziel.','Steuerbefehle werden elektrisch übertragen.','Es fliegt nur mit Autopilot.'],1,'Elektrische Flugsteuerung und Autopilot sind unterschiedliche Funktionen. Referenz: Airbus-Dossier, «Fly-by-wire und Schutzfunktionen».','#airbus'],
 ['Was beweist ein Triebwerksausfall?',['Dass eine Tragfläche abgebrochen ist.','Dass das Flugzeug sofort abstürzen muss.','Für sich allein weder Flügelverlust noch sofortigen Absturz.'],2,'Ein Triebwerksausfall ist von einem strukturellen Flügelverlust zu unterscheiden. Koch berichtet zusätzliche Schäden, PDF-S. 49–50. Referenz: «Ein Triebwerksausfall ist kein Flügelverlust».','#airbus'],
 ['Wofür steht die Zahl 90 kN beim EJ200?',['Schubkraft pro Triebwerk mit Nachbrenner als Herstellerreferenz.','Die Geschwindigkeit im Steigflug.','Eine Leistung in Kilowatt.'],0,'Newton ist eine Einheit der Kraft. Der Hersteller nennt 60 kN ohne und 90 kN mit Nachbrenner je Triebwerk. Referenz: Triebwerksdossier / EUROJET.','#antrieb'],
 ['Was beschreibt die Sidewinder-Animation?',['Eine überprüfte Rekonstruktion von Kochs Flugbahn.','Das abstrakte Prinzip passiver Infraroterfassung.','Die Sicht durch die Kabinenwand.'],1,'Die Animation verwendet frei gestaltete Symbole, keine Sensordaten. Der Text nennt AIM-9L/I; sie darf nicht mit AIM-9X gleichgesetzt werden. Referenz: Sidewinder-Dossier; Drama PDF-S. 33.','#sidewinder']
];
const quiz=document.getElementById('quiz');
questions.forEach(([title,options,correct,reason,ref],i)=>{const card=document.createElement('article');const h=document.createElement('h3');h.textContent=title;card.append(h);const feedback=document.createElement('p');feedback.className='answer';feedback.setAttribute('role','status');feedback.hidden=true;options.forEach((text,n)=>{const b=document.createElement('button');b.textContent=text;b.addEventListener('click',()=>{feedback.hidden=false;feedback.replaceChildren(document.createTextNode((n===correct?'Richtig. ':'Noch einmal prüfen. ')+'Korrekte Antwort: '+options[correct]+' '+reason+' '));const a=document.createElement('a');a.href=ref;a.textContent='Referenzstelle öffnen';feedback.append(a);});card.append(b);});card.append(feedback);quiz.append(card);});
