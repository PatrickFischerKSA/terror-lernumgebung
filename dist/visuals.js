'use strict';
// Actual frames from the supplied film. Times refer to the 93:37 edition.
const FILM_IMAGES={
auftakt:[185,'Koch und Biegler an ihrem Tisch im Gerichtssaal'],
vorsitz:[217,'Der Vorsitzende des Gerichts in Nahaufnahme'],
anklage:[550,'Blick auf die Richterbank'],
koch:[615,'Lars Koch in Uniform neben seinem Verteidiger'],
lauterbach:[1420,'Lauterbach am Zeugentisch vor dem Publikum'],
evakuierung:[1500,'Befragung im Gerichtssaal'],
zeichnung:[1965,'Eine Gerichtszeichnung von Koch und Biegler entsteht'],
grenzfaelle:[2700,'Die Befragung zu Kochs Entscheidung'],
meiser:[3350,'Franziska Meiser am Zeugentisch in Nahaufnahme'],
nelson:[4000,'Szene während Nelsons Plädoyer'],
biegler:[4500,'Szene während Bieglers Plädoyer'],
gericht:[3877,'Totale des Gerichtssaals mit Publikum und Richterbank'],
publikum:[3280,'Der Gerichtssaal aus der Perspektive des Publikums'],
'letztes-wort':[4964,'Koch ergreift vor der Entscheidung das Wort']
};
const FILM_WINDOWS=[
['auftakt',175,'Vor Gericht','Wie ordnet der Raum die Beteiligten? Achte auf Abstand, Sitzposition und Blickrichtung.'],
['lauterbach',1400,'Aussage und Beobachtung','Unterscheide den Inhalt der Aussage von der Wirkung des Auftretens. Welche Beobachtung kannst du genau belegen?'],
['koch',2100,'Eine Entscheidung erklären','Achte auf Sprechtempo und Pausen. Was erfährst du durch Worte, was deutest du aus dem Gesicht?'],
['meiser',3340,'Ein einzelner Mensch','Wie verändert die Nähe der Kamera deine Wahrnehmung? Trenne Mitgefühl von der Prüfung eines Arguments.'],
['nelson',3990,'Die Anklage spricht','Wer ist im Bild, während gesprochen wird? Welche Wirkung hat die Verteilung der Aufmerksamkeit?'],
['biegler',4490,'Die Verteidigung spricht','Vergleiche Auftreten und Adressierung mit Nelson. Ein überzeugender Auftritt ersetzt noch keinen tragfähigen Grund.']
];
function filmKey(id){return ({urteile:'letztes-wort',dramenform:'zeichnung',rede:'publikum',richter:'vorsitz'})[id]||id;}
function filmStamp(t){return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');}
function filmImage(key,cls='',eager=false){const k=filmKey(key),m=FILM_IMAGES[k];return m?`<img class="film-image ${cls}" src="media/film/${k}.webp" alt="${m[1]}" width="1280" height="720" loading="${eager?'eager':'lazy'}" decoding="async">`:'';}
function filmFigure(key,prompt='',hero=false){const k=filmKey(key),m=FILM_IMAGES[k];return m?`<figure class="film-figure ${hero?'film-hero':''}">${filmImage(k,'',hero)}<figcaption><span>FILMSTANDBILD · ${filmStamp(m[0])} · Terror – Ihr Urteil</span>${prompt?`<strong>${prompt}</strong>`:''}</figcaption></figure>`:'';}
function visualHeader(){const [route,id]=(location.hash.slice(1)||'start').split('/');if(route==='lektuere'&&id)return '';const key=route==='rollen'&&id?filmKey(id):({start:'gericht',lektuere:'zeichnung',rollen:'auftakt',dilemma:'koch',recht:'vorsitz',philosophie:'grenzfaelle',simulation:'publikum',film:'gericht',politik:'publikum',spiele:'auftakt'})[route];return key?filmFigure(key,route==='start'?'Ein Gerichtssaal. Sechs Rollen. Dein Blick auf den Fall.':'',route==='start'):'';}
function filmCardImage(href){const [route,id]=href.split('/');return ['lektuere','rollen'].includes(route)&&id?filmImage(filmKey(id),'film-card-image'):'';}
function filmWindow(item){const [key,start,title,prompt]=item;return `<article class="film-window"><video controls playsinline preload="none" poster="media/film/${key}.webp" aria-label="20 Sekunden: ${title}"><source src="media/film/${key}.mp4" type="video/mp4"></video><div><span class="eyebrow">20 SEKUNDEN · ${filmStamp(start)}–${filmStamp(start+20)}</span><h3>${title}</h3><p>${prompt}</p><a href="#lektuere/${key}">Text und ganze Szene vergleichen →</a></div></article>`;}
function visualWindows(route,id){if(route==='lektuere'&&id){const item=FILM_WINDOWS.find(x=>x[0]===id);return item?`<section class="film-insert"><h2>Ein kurzer Blick, eine genaue Beobachtung</h2>${filmWindow(item)}</section>`:'';}if(route==='rollen'&&id){const item=FILM_WINDOWS.find(x=>x[0]===id);return item?`<section class="film-insert"><h2>Die Rolle im Film</h2>${filmWindow(item)}</section>`:'';}const groups={start:['auftakt','meiser','biegler'],rollen:['koch','meiser','lauterbach'],recht:['nelson','biegler'],philosophie:['koch','meiser'],dilemma:['koch','meiser'],simulation:['lauterbach','nelson','biegler'],politik:['auftakt','nelson'],film:FILM_WINDOWS.map(x=>x[0])};const keys=groups[route];return keys&&!id?`<section class="film-insert"><span class="eyebrow">SEHEN · INNEHALTEN · DEUTEN</span><h2>Kurze Szenen, verschiedene Perspektiven</h2><p>Wähle einen Ausschnitt. Die Beobachtungsfragen richten den Blick auf die Inszenierung; zur Prüfung der Argumente führt der Link in den Leseraum.</p><div class="film-windows">${keys.map(k=>filmWindow(FILM_WINDOWS.find(x=>x[0]===k))).join('')}</div><p class="film-credit">Standbilder und Ausschnitte: «Terror – Ihr Urteil», bereitgestellte Filmfassung (93:37). Zeitmarken beziehen sich auf diese Fassung. Bild und Ton bleiben unverändert; Auswahl und Fragen: Lernredaktion. <a href="#quellen">Quellen</a></p></section>`:'';}
