'use strict';
// Scene coordinates refer to the supplied 93:37 film and the 103-page btb PDF.
let readerPdfZoom=1,readerPart=0,readerQuestion=0,readerModule='',readerPdf=null,readerPdfName='',readerPdfPage=1,readerPdfJob=0,readerPdfRender=null,readerPdfLoading=0,readerRestored=false,readerEvents=false,readerFilmEnabled=false,readerVideoCleanup=null;
const READER_TEXT_URL='media/text/Schirach_Terror_9783641203290.pdf';
let readerDefaultRequest=null;
const READER_ORIGINAL_QUESTIONS = {
 auftakt: {first: 1, questions: [
  "Erläutern Sie die Ausgangslage zu Beginn des Prozesses! Worum geht es? Welche Rolle spielt das Publikum? Welche Rolle spielen die Schauspieler/Beteiligten des Prozesses? Welche Gedanken macht er sich zum Wesen der Hauptverhandlung?",
  "Beschreiben Sie die Textgestalt! Was bedeuten die kursiv geschriebenen Passagen? Was muss «man» da machen?",
  "Beschreiben Sie die «Handlung»! Wer tritt auf? Was erfahren wir über das Bühnenbild? Zeichnen Sie die Anordnung der Personen! Was erfahren wir über die Kostüme? Was hat dies zu bedeuten?",
 ]},
 anklage: {first: 4, questions: [
  "Fassen Sie die Eingangsrede des Vorsitzenden zusammen! Welches Bedürfnis meldet der Verteidiger an? Was erfahren wir über Lars Koch?",
  "Fassen Sie die Anklageschrift vor, welche die Staatsanwältin verliest!",
  "Was sagt der Verteidiger zur Anklageschrift? Wie schildert er die Lage? Wie argumentiert er?",
 ]},
 lauterbach: {first: 7, questions: [
  "Wer ist Christian Lauterbach? Erläutern Sie seine Funktion! Was ist ihm am entsprechenden Abend durch den Kopf gegangen? Inwiefern gelten für ihn andere Spielregeln vor Gericht als für Lars Koch? Wann dürfte er schweigen?",
  "Erklären Sie die ganze Geschichte mit der Luftraumüberwachung?",
  "Rekonstruieren Sie den Tathergang? Wie haben die Leute um Lauterbach im Kontrollzentrum reagiert? Wen hat er kontaktiert? Wie hat dieser General reagiert? Wie funktioniert die Kommandokaskade?",
  "Welchen Befehl hat Lauterbach erteilt? Welche Rolle spielt Lars Koch bei dieser Mission?",
  "Wie hat Lauterbach Bericht an Radtke erstattet? Was hat Radtke getan? Beschreiben Sie die Befehlslücke, mit der sich Koch in der Luft konfrontiert sah! Inwiefern hat der Verteidigungsminister die Entwicklung gestoppt? Erläutern Sie die verfassungsmässige Lücke!",
  "Was passierte nach dieser kommandotechnischen Sackgasse? Protokollieren Sie den Abschuss!",
  "Welche Nachfragen stellte die Staatsanwältin? Welche Stossrichtung verfolgt ihre Argumentation? Wie sicher war das Bodenpersonal, dass Koch das Flugzeug abschiessen wird? Wie geht die Staatsanwältin vor? Welche Rolle spielte dabei die Haltung des früheren Verteidigungsministers Franz Josef Jung? Was wäre ein «übergesetzlicher Notstand»?",
 ]},
 evakuierung: {first: 14, questions: [
  "Warum war das Fussballstadion nicht geräumt worden? Inwiefern war dies eine Wette?",
  "Wie greift der Verteidiger in diese Debatte ein?",
 ]},
 koch: {first: 16, questions: [
  "Beschreiben Sie Lars Koch nach den Informationen, welche wir zu Beginn der Befragung durch den Vorsitzenden vermittelt bekommen! wie verläuft der Werdegang zum Kampfpiloten? Wie wirkt Koch auf Sie?",
  "Wie spricht Koch über die Schlussphase vor dem Abschuss? Inwiefern war er auf die Situation vorbereitet?",
  "Was wusste Koch über die Vorgänge im gekidnappten Flugzeug?",
  "Inwiefern hatte sich Koch juristisch auf die Sachlage vorbereiten können? Was tut dies zur Sache? Inwiefern denkt er, dass Leben gegen Leben abgewogen werden darf? Was hält er vom Verfassungsgrundsatz?",
 ]},
 grenzfaelle: {first: 20, questions: [
  "Was halten Sie vom Vorwurf der Staatsanwältin, Koch habe sich gottgleich verhalten?",
  "Kommentieren Sie die Beispiele zur Lebenserwartung, welche die Staatsanwältin ins Spiel bringt!",
  "Kommentieren Sie das Argument, wonach jeder, der sich in ein Flugzeug begibt, seinen Tod in Kauf nimmt! Vollziehen Sie Kochs Argumentation nach und wägen Sie sie gegen die Widerrede der Staatsanwältin ab!",
  "Kommentieren Sie den Standpunkt von Koch, wonach verfassungsmässiges Handeln in die Katastrophe führen würde!",
  "Wie treibt die Staatsanwältin Koch in die Enge?",
 ]},
 meiser: {first: 25, questions: [
  "Beschreiben Sie die Nebenklägerin Meiser! Was ist ihr widerfahren? Wie argumentiert sie?",
  "Wie beschreibt sie die Vorgänge? Was ist ihr Klagemotiv? Wie verarbeitet sie den Tod ihres Mannes?",
  "Wie wirkt die Nebenklägerin auf sie? Warum?",
 ]},
 nelson: {first: 28, questions: [
  "Fassen Sie das Plädoyer der Staatsanwältin zusammen! Warum soll Koch verurteilt werden, obschon er kein Krimineller ist?",
  "Erläutern Sie die ethischen Schulbeispiele, welche die Staatsanwältin in die Diskussion einbringt! Was haben diese mit dem Fall zu tun? Inwiefern lassen sich diese da anwenden? Wie stellt sie sich zum so genannten «übergesetzlichen Notstand»? Warum brauchen wir nach Auffassung der Staatsanwältin Prinzipien? Warum stehen diese über dem Einzelfall und dem moralischen Empfinden?",
  "Was bedeutet der Satz «Die Würde des Menschen ist unantastbar»? Wo ist er zu finden und welche Folgen hat er aus Sicht der Staatsanwältin für den Prozess?",
 ]},
 biegler: {first: 31, questions: [
  "Wie reagiert der Verteidiger auf das Plädoyer der Staatsanwältin? Wie argumentiert er mit Immanuel Kant? Welche Pointe besitzt seine Argumentation? Worüber haben die Richter nicht entschieden?",
  "Wie zerpflückt Biegler die Argumentation der Staatsanwältin, wonach Leben nicht gegen Leben aufgewogen werden dürften? Was meint Biegler mit dem «kleineren Übel»? Welche Konsequenzen hätte laut Biegler eine Verurteilung von Lars Koch?",
 ]},
 urteile: {first: 33, questions: [
  "Wie schliesst der Vorsitzende das Verfahren ab? Welche Aufgabe erteilt er den Schöffen, d.h. dem Publikum?",
  "Fassen Sie Ihr Urteil und begründen Sie es mit einer Argumentation von etwa einer halben Seite!",
  "Fassen Sie die beiden Urteilsbegründungen zusammen! Vergleichen Sie diese mit Ihrem eigenen Standpunkt",
 ]},
};

function readerScene(id){const s=window.TERROR.scenes.find(s=>s.id===id);return s?.parts?{...s,...s.parts[readerPart]}:s;}
function sceneReading(m){
 if(readerModule!==m.id){readerQuestion=0;readerPart=0;readerModule=m.id;}const s=readerScene(m.id),index=D.modules.indexOf(m);
 return `<div class="reader-heading"><div><p class="breadcrumb"><a href="#lektuere">Text erschliessen</a> / Leseraum</p>${head((s?'TEXT × FILM / SZENE ':'TEXTSTATION / VERTIEFUNG ')+String(index+1).padStart(2,'0'),m.title,READER_ORIGINAL_QUESTIONS[m.id]?'':m.goal)}</div><a class="button secondary small" href="#journal">Mein Journal ↗</a></div>
 <div class="reader-layout" id="readerWorkspace" data-module="${m.id}"><aside class="scene-rail" aria-label="Szenen und Textstationen"><div class="rail-heading">DEIN LESERAUM <span>12 Stationen</span></div>${D.modules.map((x,i)=>{const c=D.scenes.find(s=>s.id===x.id);return `<a href="#lektuere/${x.id}" class="scene-link ${x.id===m.id?'active':''}" ${x.id===m.id?'aria-current="step"':''}><span class="scene-number">${String(i+1).padStart(2,'0')}</span><span><strong>${c?.title||x.title}</strong><small>PDF ${x.pages}${c?' · '+fmtTime(c.start):' · Vertiefung'}${state.done.includes(x.id)?' · ✓':''}</small></span></a>`;}).join('')}</aside>
 <div class="reader-content">${readerOriginalQuestions(m)}<div class="reader-media"><section class="reader-film" aria-labelledby="readerFilmTitle"><div class="reader-panel-head"><span>FILMSPUR</span><h2 id="readerFilmTitle">${s?escape(s.title):'Text und Inszenierung'}</h2></div>${s?`${s.parts?`<div class="verdict-tabs" role="group" aria-label="Urteilsfassungen">${s.parts.map((p,i)=>`<button class="${readerPart===i?'':'secondary'} small" data-reader-part="${i}" aria-pressed="${readerPart===i}">${escape(p.title)}</button>`).join('')}</div>`:''}<div id="readerVideoMount" class="reader-video-mount"><div class="scene-slate scene-illustrated">${filmImage(m.id)}<span class="eyebrow">TERROR · IHR URTEIL</span><strong>${escape(s.title)}</strong><span>${fmtTime(s.start)}–${fmtTime(s.end)}</span><button class="accent" data-reader-play>Filmszene laden & starten</button><small>Der Player lädt den Film von Dropbox.</small></div></div><div class="reader-transport"><button class="secondary small" data-reader-restart aria-label="Szene von vorne abspielen">↺ Szene</button><input type="range" id="readerSeek" min="${s.start}" max="${s.end}" value="${s.start}" step="0.1" aria-label="Position innerhalb der Filmszene"><output id="readerClock">0:00 / ${fmtTime(s.end-s.start)}</output></div><p class="reader-status" id="readerFilmStatus" role="status">${escape(s.note||'Die Wiedergabe stoppt am Szenenende.')}</p><details class="reader-film-prompt"><summary>Optionale Filmanalyse</summary><p>${escape(s.prompt)}</p></details><details><summary>Filmquelle und andere Fassung</summary><div><p>Die Kapitelmarken beziehen sich auf die bereitgestellte Fassung (93:37). Text und Film sind nicht wortgleich. Die Grenzen sind didaktische Abschnitte, keine offiziellen Kapitel.</p><p>${external(D.videos[0].url,'Film bei Dropbox öffnen')}</p><label class="field"><span>Dieselbe Filmfassung lokal öffnen</span><input id="readerLocalFilm" type="file" accept="video/*"></label><p class="notice">Andere Schnitte benötigen angepasste Marken in der <a href="#film/film">Filmwerkstatt</a>.</p></div></details>`:`<div class="scene-slate text-only"><strong>${m.id==='rede'?'Eine Rede ausserhalb des Dramas':'Die Inszenierung als Ganzes'}</strong><p>${m.id==='rede'?'Die Rede auf Charlie Hebdo gehört zum Buch, nicht zur Gerichtsverfilmung. Lies sie im PDF und untersuche ihren gesellschaftlichen Kontext.':'Vergleiche den Auftakt, die Zeugin und den Schluss. Nutze die Szenenleiste, um gezielt zu den Filmausschnitten zu springen.'}</p>${m.id==='dramenform'?'<a class="button accent" href="#lektuere/auftakt">Zum Auftakt</a>':'<a class="button accent" href="#politik">Politische Kontexte öffnen</a>'}</div>`}</section>
 <section class="reader-document" aria-labelledby="readerPdfTitle"><div class="reader-panel-head"><span>TEXTSPUR · PDF ${m.pages}</span><h2 id="readerPdfTitle">Dein Text direkt daneben</h2></div><div class="pdf-tools"><button class="secondary small" data-pdf-prev aria-label="Vorherige PDF-Seite">←</button><label>Seite <input id="readerPage" type="number" min="1" value="${parseInt(m.pages)}" aria-label="PDF-Seite"></label><span id="readerPageCount">/ 103</span><button class="secondary small" data-pdf-next aria-label="Nächste PDF-Seite">→</button><button class="secondary small" data-pdf-home>Textstelle</button><button class="secondary small" data-pdf-zoom="out" aria-label="PDF verkleinern">−</button><output id="readerZoom">${Math.round(readerPdfZoom*100)}%</output><button class="secondary small" data-pdf-zoom="in" aria-label="PDF vergrössern">+</button></div><div id="readerPdfMount" class="reader-pdf-mount"><div class="pdf-empty"><span class="pdf-symbol" aria-hidden="true">¶</span><h3>Die Textstelle wird geöffnet …</h3><p>Der Buchtext ist bereits eingebunden. Beim Szenenwechsel öffnet sich automatisch die passende Seite.</p><p><a href="${READER_TEXT_URL}#page=${parseInt(m.pages)}" target="_blank" rel="noopener">PDF direkt öffnen ↗</a></p><button class="secondary small" data-pdf-retry>Text erneut laden</button></div></div><p id="readerPdfStatus" role="status" class="reader-status">Die Seitenangaben zählen die 103 PDF-Seiten, inklusive Vorspann.</p><div class="pdf-source"><div id="readerPdfLinks"></div><details><summary>Optional: eigene PDF-Ausgabe verwenden</summary><label class="field"><span>Eigene PDF auswählen / wechseln</span><input id="readerPdfInput" type="file" accept="application/pdf,.pdf"></label><label class="notice"><input type="checkbox" id="rememberReaderPdf" checked>PDF auf diesem Gerät merken</label><p class="notice muted">Eine hier ausgewählte eigene PDF bleibt in diesem Browser und wird nicht hochgeladen. Ohne eigene Datei öffnet sich die eingebundene Ausgabe automatisch.</p></details></div></section></div>
 ${visualWindows("lektuere",m.id)}${["lauterbach","evakuierung","koch"].includes(m.id)?`<section class="section card"><span class="eyebrow">AVIATISCHES HINTERGRUNDWISSEN</span><h2>Was wusste die Luftüberwachung?</h2><p>Unterscheide Tower, militärisches Lagezentrum, technische Beobachtung und Prognose. Nutze Karten und Zeitmodelle, um präzisere Fragen an die Figuren zu stellen.</p><a href="#aviatik">Flugkarten, Tower & Lagebild erkunden →</a></section>`:""}
 <details class="reader-question card"><summary>Zusatzmaterial · frühere Analyseaufträge</summary><div class="section-head"><span class="eyebrow">LESEN · SEHEN · BEGRÜNDEN</span><span class="tag">PDF ${m.pages}</span></div><p>${m.intro}</p><div id="readerQuestionPanel">${readerQuestionHTML(m)}</div>${details('Hilfe 1 · Einen Anfang finden',m.help)}${details('Hilfe 2 · Möglicher Deutungsweg',m.model)}${rubric(m.id)}</details>
 <section class="section card"><h2>Deine zusammenhängende Deutung</h2>${note('lekt-'+m.id,m.title+' · Analyse','Verbinde deine Beobachtungen. Belege die Textspur mit PDF-Seiten und die Filmspur mit Zeitmarken. Bisherige Antworten stehen weiterhin hier.')}${note('filmspur-'+m.id,m.title+' · Text und Film','Welche Inszenierungsentscheidung verändert oder verstärkt deine Lesart? Textbeleg → Filmmittel → Wirkung → alternative Deutung.')}<h3>Weiterdenken und gestalten</h3><p>${m.transfer}</p>${note('transfer-'+m.id,m.title+' · Transfer')}${completion(m.id)}</section>
 <section class="section card"><h2>Kurzcheck</h2><p>${m.check.q}</p><div class="options">${m.check.options.map((o,i)=>`<button data-module-check="${m.id}" data-option="${i}">${o}</button>`).join('')}</div><div id="moduleFeedback" role="status"></div></section><div class="reader-next">${index>0?`<a class="button secondary" href="#lektuere/${D.modules[index-1].id}">← Vorherige Station</a>`:'<span></span>'}${index<D.modules.length-1?`<a class="button" href="#lektuere/${D.modules[index+1].id}">Nächste Station →</a>`:'<a class="button" href="#journal">Zum Journal →</a>'}</div></div></div>`;
}
const READER_ORIGINAL_FEEDBACK = [
 [7, [[["schöffen"], "Der Vorsitzende setzt das Publikum als Schöffen ein. Es stimmt über Lars Koch ab und soll ausschliesslich die in der Hauptverhandlung erhobenen Beweise berücksichtigen."], [["sprache"], "Die Prozessbeteiligten rekonstruieren die bereits geschehene Tat durch Sprache. Der Vorsitzende vergleicht den Gerichtssaal mit einer Bühne und fordert ein besonnenes Urteil über einen Menschen."]]],
 [8, [[["regie"], "Die kursiven Passagen sind Regieanweisungen. Sie bestimmen unter anderem Auftritte, Bewegungen, Sprechweisen und Ausstattung. Auf der Bühne werden sie umgesetzt. Beim Lesen stellt man sich das Geschehen anhand dieser Angaben vor."]]],
 [8, [[["richtertisch"], "In der Mitte steht der Richtertisch mit Vorsitzendem und Protokollführerin, davor der Zeugenplatz. Links sitzen Nelson und Meiser, rechts Biegler, dahinter Koch in einer Zelle. Der Wachtmeister sitzt an der Tür."], [["robe"], "Roben und Uniformen machen die institutionellen Rollen sichtbar. Koch trägt Luftwaffenuniform. Biegler trägt zunächst keine Robe. Der Vorsitzende legt seine Robe nach der Publikumsansprache an."]]],
 [9, [[["platz"], "Der Vorsitzende eröffnet die Sitzung, stellt die Beteiligten fest und klärt Kochs Personalien. Biegler bittet darum, dass Koch neben ihm Platz nimmt. Vor der Anklage bittet er ausserdem darum, ein Fenster zu öffnen."], [["major"], "Koch ist Major der Luftwaffe und wird aus der Untersuchungshaft vorgeführt. Die Befragung liefert auch Angaben zu Familie und Beruf."]]],
 [12, [[["164"], "Nelson wirft Koch vor, am 26. Mai 2013 um 20.21 Uhr über Oberappersdorf ein Lufthansa-Passagierflugzeug abgeschossen und alle 164 Menschen an Bord mit gemeingefährlichen Mitteln getötet zu haben."], [["mord"], "Die Staatsanwaltschaft wertet die Tat als Mord. Das ist der Vorwurf, über den das Gericht erst entscheiden muss."]]],
 [14, [[["stadion"], "Biegler schildert das entführte Flugzeug auf Kurs zum voll besetzten Stadion. Er räumt den Abschuss ein und stellt ihm die Rettung der rund 70 000 Zuschauer gegenüber."], [["bewertung"], "Er trennt den eingeräumten äusseren Ablauf von der umstrittenen rechtlichen Bewertung und kündigt an, die Entscheidung aus der damaligen Lage zu erklären."]]],
 [17, [[["duty controller"], "Lauterbach ist Oberstleutnant und war am betreffenden Tag ab 14 Uhr als Duty Controller im Lagezentrum im Einsatz. Seine Gedanken schildert er bei der Rekonstruktion der Meldungen und Entscheidungen unter Zeitdruck."], [["dienstgeheim"], "Als Zeuge muss er vollständig und wahrheitsgemäss aussagen. Bei Dienstgeheimnissen darf er gemäss seiner Aussagegenehmigung die Auskunft verweigern und muss das offen sagen. Koch darf als Angeklagter zur Sache schweigen."]]],
 [19, [[["nato"], "Die NATO überwacht den deutschen Luftraum. Bei einer Entführung im deutschen Luftraum geht die Zuständigkeit an das Nationale Lage- und Führungszentrum über."], [["radar"], "Dort werden Radar- und Funkinformationen sowie Meldungen ziviler und militärischer Stellen zu einem Lagebild zusammengeführt. Bei einem verdächtigen Flug klärt die Alarmrotte die Lage aus der Luft."]]],
 [22, [[["radtke"], "Nach der Entführungsmeldung verfolgen die Beteiligten im Lagezentrum die Lage gemeinsam. Lauterbach informiert Generalleutnant Radtke, der zunächst nach dem Stand der Alarmrotte fragt und dann die Intervention befiehlt."], [["minister"], "Die Alarmrotte meldet ihre Beobachtungen an Lauterbach. Er meldet an Radtke weiter. Für die nächste Eskalationsstufe trägt Radtke die Lage und seinen Vorschlag dem Verteidigungsminister vor."]]],
 [25, [[["abdräng"], "Lauterbach gibt Radtkes Interventionsbefehl an die Alarmrotte weiter. Die Maschine soll abgedrängt und zur Landung gezwungen werden."], [["alarmrotte"], "Major Koch ist der verantwortliche Pilot der Alarmrotte. Er führt die Massnahmen in der Luft aus und meldet seine Beobachtungen an das Lagezentrum zurück."]]],
 [29, [[["minister"], "Lauterbach meldet Radtke den fortgesetzten Kurs auf das Stadion. Radtke schlägt dem Verteidigungsminister den Abschuss als letzte Stufe vor. Der Minister lehnt ab."], [["nicht geschossen", "kein abschuss"], "Koch erhält die Weisung, dass nicht geschossen werden darf, und lässt sich das zweimal bestätigen. Die verfassungsrechtliche Grenze betrifft die staatliche Ermächtigung, ein Flugzeug mit unschuldigen Menschen abzuschießen. Die individuelle Strafbarkeit Kochs ist eine gesonderte Frage."]]],
 [31, [[["sinkflug"], "Koch fragt zweimal nach dem Befehl, meldet den Sinkflug und erklärt, ohne seinen Eingriff würden Zehntausende sterben. Die Maschine ist noch etwa 25 Kilometer vom Stadion entfernt."], [["20.21", "20:21"], "Koch löst das Geschoss aus. Der Abschuss erfolgt um 20.21 Uhr. Alle 164 Menschen an Bord sterben. Lauterbach rekonstruiert den Vorgang anhand von Funk und Bildschirm."]]],
 [33, [[["sicher", "erwart"], "Nelson fragt nach der unterlassenen Räumung und hakt nach, ob man auf Kochs Abschuss vertraute. Lauterbach sagt erst Nein und räumt dann ein, er habe sich vorstellen können, dass Koch schiessen würde. Das belegt keine Gewissheit des gesamten Bodenpersonals."], [["jung"], "Die Frage nach der Haltung des früheren Verteidigungsministers Jung führt zum übergesetzlichen Notstand. Gemeint ist ein möglicher, gesetzlich nicht geregelter Entschuldigungsgrund für eine extreme Konfliktlage."]]],
 [35, [[["räum"], "Niemand im Lagezentrum gab den Räumungsbefehl. Lauterbach beruft sich auf Zeitmangel. Nelson hält ihm 52 Minuten zwischen dem ersten Funkspruch und dem prognostizierten Einschlag entgegen. Laut Notfallplan sollte die Räumung 15 Minuten dauern."], [["wette", "verlassen"], "Eine Wette ist es in dem Sinn, dass man das Risiko für die Zuschauer hinnahm und darauf setzte, der befürchtete Einschlag werde ausbleiben oder noch verhindert."]]],
 [38, [[["zuständig", "verantwort"], "Biegler hinterfragt, wer für eine Räumung zuständig gewesen wäre und ob Lauterbach darüber zuverlässig Auskunft geben kann. Damit lenkt er den Blick auf die Verantwortung der Behörden und die Lage, die Koch bei seiner Entscheidung tatsächlich vorfand."]]],
 [43, [[["1,0", "physik"], "Koch schildert eine glückliche Jugend, ein Abitur mit 1,0 und sein Interesse an Physik und Sport. Der Berufswunsch knüpft an den unerfüllten Wunsch seines Vaters an. Koch absolviert die Ausbildung zum Kampfpiloten und wird Major."], [["eindruck", "diszipliniert", "ehrgeizig"], "Ein möglicher Eindruck ist der eines leistungsorientierten und disziplinierten Menschen. Das lässt sich am Abitur und am Ausbildungsgang zeigen. Andere Eindrücke sind mit Textbelegen möglich."]]],
 [47, [[["training", "ausbildung", "vorbereit"], "Koch beschreibt die letzten Augenblicke aus seiner Sicht als Pilot. Er konnte auf Training und eingeübte Abläufe zurückgreifen."], [["entscheidung", "zeitdruck"], "Die Entscheidung, ob er gegen die Weisung schiesst, musste er in der konkreten Lage selbst und unter Zeitdruck treffen. Technische Vorbereitung beantwortet diese Entscheidung nicht."]]],
 [51, [[["cockpit", "entführer"], "Koch kannte die Entführungsmeldung und beobachtete den Flug von aussen. Was sich im Innern der Maschine im entscheidenden Moment abspielte, wusste er nicht sicher."], [["passagiere", "gewissheit"], "Insbesondere konnte er nicht sicher wissen, ob die Passagiere den Entführer noch hätten überwältigen können. Seine Prognose stützte sich auf die von aussen erkennbare Lage."]]],
 [54, [[["verfassungsgericht", "urteil"], "Koch hatte sich mit dem Urteil des Bundesverfassungsgerichts und dem Abschussverbot beschäftigt. Seine Entscheidung fiel somit vor dem Hintergrund einer ihm bekannten rechtlichen Grenze."], [["abwäg", "verfassungsgrundsatz"], "Er hält die Abwägung in einer extremen Lage dennoch für geboten und stellt der abstrakten Regel die erwarteten Todesopfer eines Einschlags gegenüber."]]],
 [56, [[["selbst", "eigenmächtig"], "Nelson wirft Koch vor, eigenmächtig darüber entschieden zu haben, wer leben und wer sterben soll. Das Bild vom gottgleichen Handeln greift diesen Anspruch an."], [["einwand", "rett"], "Der Vorwurf ist nachvollziehbar, weil die Menschen an Bord keine Wahl hatten. Zugleich kann man einwenden, dass Koch eine unmittelbar drohende Katastrophe abwenden wollte. Entscheidend ist, wie man beide Aspekte gewichtet."]]],
 [57, [[["lebenserwart", "alt", "jung"], "Nelsons Beispiele zeigen, wohin eine Bewertung von Leben nach Alter oder verbleibender Lebenszeit führen kann."], [["würde", "gleichwert"], "Die verbleibenden Lebensjahre liefern keinen Massstab für die Würde eines Menschen. Wer dennoch nach Zahlen entscheiden will, muss begründen, warum gerade die Zahl der Betroffenen und keine andere Rechengrösse zählen soll."]]],
 [59, [[["risiko"], "Koch behandelt den Tod als Risiko, das jeder Fluggast beim Einsteigen in Kauf nimmt."], [["einwillig", "zustimm"], "Nelsons Widerrede trennt die Übernahme eines allgemeinen Flugrisikos von der Einwilligung, absichtlich durch den Staat getötet zu werden. Ein Flugticket enthält keine solche Einwilligung."]]],
 [61, [[["katastroph", "stadion"], "Koch meint, die Einhaltung des Abschussverbots hätte in dieser Lage zur Katastrophe im Stadion geführt."], [["prognos", "würde"], "Dagegen steht, dass der Einschlag eine Prognose war und dass der Verfassungsgrundsatz gerade in Extremlagen die Menschen an Bord schützt. Eine Stellungnahme muss beide Punkte abwägen."]]],
 [62, [[["nachfrag", "widerspruch"], "Nelson prüft Kochs Annahmen mit kurzen Nachfragen und zugespitzten Gegenbeispielen. Sie zwingt ihn, seine Begründung auch dann zu verteidigen, wenn die Betroffenen einzeln betrachtet werden."], [["sicher", "grenze"], "So legt sie die Grenzen seiner Gewissheit und den Widerspruch zwischen seinem Rettungsziel und der Tötung Unbeteiligter offen."]]],
 [65, [[["nebenkläger"], "Franziska Meiser ist Nebenklägerin und wird als Zeugin vernommen. Ihr Mann kam beim Abschuss ums Leben."], [["mann", "verlust"], "Sie schildert den Verlust aus ihrer persönlichen Perspektive. Ihre Aussage macht aus der Zahl der Opfer den Tod eines konkreten Menschen mit Familie und Geschichte."]]],
 [67, [[["nachricht", "sms"], "Meiser rekonstruiert den Kontakt zu ihrem Mann und die Zeit der Ungewissheit bis zur Nachricht von seinem Tod."], [["verlust", "verstehen"], "Ihre Beteiligung am Prozess lässt sich als Versuch verstehen, das Geschehen aufzuklären und ihrem Mann Gehör zu verschaffen. Die konkreten Erinnerungen zeigen, wie gegenwärtig der Verlust für sie bleibt."]]],
 [68, [[["eindruck", "gefasst", "berühr"], "Meiser kann durch ihre genaue Schilderung zugleich gefasst und tief betroffen wirken."], [["beispiel", "nachricht", "erinner"], "Als Beleg eignet sich, wie sie von den letzten Nachrichten und vom Warten erzählt. Eine andere Wirkung ist möglich, wenn sie an einer konkreten Stelle begründet wird."]]],
 [75, [[["mord"], "Nelson fordert eine Verurteilung wegen Mordes. Sie unterscheidet die persönliche Anständigkeit und das Rettungsmotiv Kochs von der strafrechtlichen Beurteilung der absichtlichen Tötung."], [["würde"], "Für sie dürfen unschuldige Menschen nicht zur Rettung anderer als Mittel benutzt werden. Auch eine grosse Zahl geretteter Menschen hebt diese Grenze nicht auf."]]],
 [77, [[["weiche", "trolley", "brücke"], "Die Beispiele mit der Weiche und dem Stoss von der Brücke prüfen, warum Menschen zwischen dem Umlenken einer Gefahr und der gezielten Benutzung eines Menschen als Rettungsmittel unterscheiden."], [["notstand", "prinzip"], "Nelson lehnt eine Entschuldigung durch einen übergesetzlichen Notstand in diesem Fall ab. Prinzipien sollen den Einzelnen gerade dort schützen, wo Empörung oder ein erwarteter Nutzen dazu verleiten, Ausnahmen zu machen."]]],
 [79, [[["grundgesetz", "artikel 1"], "Der Satz steht in Artikel 1 Absatz 1 des Grundgesetzes. Die Menschenwürde verpflichtet den Staat zur Achtung und zum Schutz jedes Menschen."], [["objekt", "mittel"], "Für Nelson folgt daraus, dass die Passagiere auch im Notfall nicht zu blossen Objekten einer staatlichen Rettungsrechnung werden dürfen."]]],
 [81, [[["kant", "mörder"], "Biegler antwortet mit Kants Beispiel vom Mörder, der nach dem Versteck seines Opfers fragt. Er kritisiert die Konsequenz eines ausnahmslosen Prinzips, wenn es die Rettung des Opfers verhindert."], [["strafbar", "einzelfall"], "Seine Pointe ist die Trennung zwischen dem verfassungsgerichtlichen Urteil über eine staatliche Abschussermächtigung und der Entscheidung über die persönliche Strafbarkeit Kochs. Letztere hat das Verfassungsgericht nicht getroffen."]]],
 [83, [[["kleineres übel", "kleinere übel"], "Biegler vergleicht die Folgen des Handelns und des Unterlassens. Für ihn war der Abschuss unter den angenommenen Umständen das kleinere Übel."], [["verurteil", "zukunft"], "Eine Verurteilung würde nach seiner Argumentation jemanden bestrafen, der unter extremem Druck eine grössere Katastrophe verhindern wollte, und hätte Folgen dafür, wie Verantwortliche in vergleichbaren Lagen handeln."]]],
 [84, [[["schöffen", "publikum"], "Der Vorsitzende schliesst die Verhandlung und übergibt die Entscheidung den Schöffen, also dem Publikum."], [["abstimm", "stimme"], "Sie müssen zwischen Verurteilung und Freispruch entscheiden. Das Abstimmungsergebnis bestimmt, welche der beiden Urteilsfassungen verkündet wird."]]],
 [84, [[["freispruch", "verurteil"], "Beispiel für eine Verurteilung. Ich würde Koch verurteilen, weil er bewusst 164 Menschen tötete, die für die Entführung keine Verantwortung trugen."], [["einwand", "zwar", "dennoch"], "Sein Rettungsmotiv und der Zeitdruck sind gewichtige Gründe für einen Freispruch. Dennoch beruhte der erwartete Einschlag auf einer Prognose. Die Passagiere hatten Anspruch darauf, dass der Staat ihr Leben nicht gezielt opfert. Eine begründete Gegenposition kann die individuelle Entschuldigung in den Mittelpunkt stellen."]]],
 [87, [[["lebenslang", "mord"], "Die Verurteilung wertet den Abschuss als Mord und verhängt lebenslange Freiheitsstrafe. Sie verwirft einen übergesetzlichen Entschuldigungsgrund."], [["freispruch", "entschuld"], "Die Freispruchsfassung erkennt bei gleicher Tat einen übergesetzlichen Notstand als persönlichen Entschuldigungsgrund an. Im Vergleich mit dem eigenen Urteil ist entscheidend, ob man diese Ausnahme für tragfähig hält und warum."]]],
];

function readerOriginalQuestions(m){
 const group=READER_ORIGINAL_QUESTIONS[m.id];
 if(!group)return '';
 return `<section class="section card" aria-labelledby="readerOriginalQuestionsTitle">
 <h2 id="readerOriginalQuestionsTitle">Hauptauftrag · Fragen zur Lektüre</h2>
 <ul role="list" style="list-style:none;padding-inline-start:0">${group.questions.map((question,index)=>`<li>${escape(question)}${readerOriginalAnswer(group.first+index)}</li>`).join('')}</ul>
 </section>`;
}
function readerOriginalAnswer(number){
 const [page, criteria]=READER_ORIGINAL_FEEDBACK[number-1];
 return `<div data-original-answer="${number}">
 ${note('original-terror-'+number,'Deine Antwort')}
 <button type="button" class="secondary small" data-original-check>Antwort prüfen</button>
 <div class="feedback-result" data-original-result aria-live="polite"></div>
 <details><summary>Musterlösung</summary>
 ${criteria.map(([,hint])=>`<p>${escape(hint)}</p>`).join('')}
 ${feedbackReference(page,'Zur Textstelle')}
 </details></div>`;
}
function updateOriginalFeedback(answer){
 if(!answer.isConnected)return;
 const number=Number(answer.dataset.originalAnswer);
 const [page, criteria]=READER_ORIGINAL_FEEDBACK[number-1];
 const response=answer.querySelector('textarea').value;
 const value=TERROR_FEEDBACK.normalize(response);
 const result=answer.querySelector('[data-original-result]');
 if(!value){result.textContent='Schreibe zuerst eine Antwort.';return;}
 const words=value.split(' ');
 const errors=TERROR_FEEDBACK.check(readerCurrentModule().id+'-0',response)?.errors||[];
 const matches=criteria.map(([terms])=>terms.some(term=>{
  const phrase=TERROR_FEEDBACK.normalize(term).split(' ');
  return words.some((word,index)=>word.startsWith(phrase[0]) &&
   phrase.slice(1).every((part,offset)=>words[index+offset+1]?.startsWith(part)) &&
   !words.slice(Math.max(0,index-3),index).some(w=>/^(nicht|nie|kein(?:e|en|er|es|em)?)$/.test(w)));
 }));
 result.innerHTML=`<p>${matches.filter(Boolean).length} von ${criteria.length} Prüfpunkten sprachlich erkannt. Vergleiche deine Aussage mit dem Korrekturhinweis.</p>
 ${errors.map(error=>`<p class="feedback-error"><strong>Sachlich überprüfen</strong> ${escape(error.correction)} ${feedbackReference(error.page,'Zur Textstelle')}</p>`).join('')}
 <ul>${criteria.map(([,hint],index)=>`<li><strong>${matches[index]?'Im Text abgleichen':'Ergänzen oder genauer formulieren'}</strong><p>${escape(hint)}</p></li>`).join('')}</ul>
 ${feedbackReference(page,'Zur Textstelle')}`;
}
const originalFeedbackTimers=new WeakMap();
function readerQuestionHTML(m){const q=readerQuestion;return `<div class="question-tabs" role="group" aria-label="Analyseaufträge">${m.tasks.map((_,i)=>`<button class="${i===q?'':'secondary'} small" data-reader-question="${i}" aria-pressed="${i===q}">Auftrag ${i+1}${state.notes['leseraum-'+m.id+'-'+i]?.text?.trim()?' · ✓':''}</button>`).join('')}</div><span class="eyebrow">AUFTRAG ${q+1} / ${m.tasks.length}</span><h2 id="readerQuestionTitle" tabindex="-1">${m.tasks[q]}</h2>${note('leseraum-'+m.id+'-'+q,m.title+' · Auftrag '+(q+1),'Notiere zuerst deine Beobachtung, dann einen Beleg und deine Deutung.')}<div class="feedback-toolbar"><button type="button" class="accent small" data-feedback-check>Antwort prüfen</button><span>Automatisches Feedback nach einer kurzen Schreibpause · lokal auf deinem Gerät</span></div><div id="readerFeedback" class="reader-feedback" aria-live="polite" aria-atomic="false">${readerFeedbackHTML(m.id+'-'+q,state.notes['leseraum-'+m.id+'-'+q]?.text||'')}</div><details class="feedback-method"><summary>Wie werden meine Formulierungen erkannt?</summary><div>Der lokale Sprachabgleich berücksichtigt Synonyme, Wortformen, Umlaute, ss/ß, mehrere passende Begriffe im Satz und einzelne Tippfehler in längeren Wörtern. Er erkennt nicht jede Bedeutung oder Ironie. Ein gefundener Begriff beweist keine korrekte Argumentation. Bei abweichenden Lesarten entscheiden deine Belege; fehlende Treffer sind kein automatisches Falschurteil.</div></details><div class="reader-next"><button class="secondary small" data-reader-question="${q-1}" ${q===0?'disabled':''}>← Zurück</button><button class="small" data-reader-question="${q+1}" ${q===m.tasks.length-1?'disabled':''}>Weiter →</button></div>`;}
function readerCurrentModule(){return D.modules.find(m=>m.id===location.hash.split('/')[1]);}
function initReader(){
 const root=document.getElementById('readerWorkspace');if(!root?.dataset?.module)return;
 const m=readerCurrentModule();readerPdfPage=readerScene(m.id)?.page||parseInt(m.pages);
 if(readerPdf)drawReaderPdf(readerPdfPage);else if(!readerRestored){readerRestored=true;readPdfCache().catch(()=>null).then(f=>{if(!readerPdf&&readerPdfLoading===0){if(f)loadReaderPdf(f,undefined);else loadDefaultReaderPdf();}});}
 if(readerFilmEnabled&&readerScene(m.id))mountReaderVideo(false);
 if(readerEvents)return;readerEvents=true;
 main.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset,m=readerCurrentModule();if(!m)return;
 if('originalCheck' in a){
  const answer=b.closest('[data-original-answer]');
  clearTimeout(originalFeedbackTimers.get(answer));
  updateOriginalFeedback(answer);
  return;
 }
 if(a.readerPart!==undefined){const n=Number(a.readerPart),parts=D.scenes.find(s=>s.id===m.id)?.parts;if(parts&&n>=0&&n<parts.length){readerPart=n;render();}return;}
 if('readerPlay'in a||'readerRestart'in a){readerFilmEnabled=true;mountReaderVideo(true);}
 if(a.readerQuestion!==undefined){const n=Number(a.readerQuestion);if(n>=0&&n<m.tasks.length){readerQuestion=n;document.getElementById('readerQuestionPanel').innerHTML=readerQuestionHTML(m);document.getElementById('readerQuestionTitle').focus({preventScroll:true});}}
 if(a.pdfZoom){readerPdfZoom=Math.max(1,Math.min(2.5,readerPdfZoom+(a.pdfZoom==='in'?.25:-.25)));document.getElementById('readerZoom').textContent=Math.round(readerPdfZoom*100)+'%';drawReaderPdf(readerPdfPage);}
 if('pdfPrev'in a)drawReaderPdf(readerPdfPage-1);if('pdfNext'in a)drawReaderPdf(readerPdfPage+1);if('pdfHome'in a)drawReaderPdf(readerScene(m.id)?.page||parseInt(m.pages));
 if('pdfRetry'in a)loadDefaultReaderPdf();
 if('pdfForget'in a){readerPdfLoading++;readerPdfJob++;readerPdfRender?.cancel();readerPdfRender=null;readerPdf?.destroy();readerPdf=null;readerPdfName='';if(pdfURL)URL.revokeObjectURL(pdfURL);pdfURL='';writePdfCache(null).catch(()=>{});render();loadDefaultReaderPdf();toast('Eigene PDF entfernt. Die eingebundene Ausgabe wird geöffnet. Deine Notizen bleiben erhalten.');}
 });
 main.addEventListener('change',e=>{const el=e.target;if(el.id==='readerPdfInput'&&el.files[0])loadReaderPdf(el.files[0],document.getElementById('rememberReaderPdf').checked);if(el.id==='readerPage')drawReaderPdf(Number(el.value));if(el.id==='readerLocalFilm'&&el.files[0]){if(filmObjectURL)URL.revokeObjectURL(filmObjectURL);filmObjectURL=URL.createObjectURL(el.files[0]);readerFilmEnabled=true;if(readerVideoCleanup){readerVideoCleanup();readerVideoCleanup=null;}document.getElementById('readerVideo')?.remove();mountReaderVideo(false);}});
 main.addEventListener('input',e=>{
  const answer=e.target.closest('[data-original-answer]');
  if(answer && e.target.matches('textarea')){
   clearTimeout(originalFeedbackTimers.get(answer));
   originalFeedbackTimers.set(answer,setTimeout(()=>updateOriginalFeedback(answer),650));
  }
  if(e.target.id==='readerSeek'){const v=document.getElementById('readerVideo');if(v?.readyState>=1)v.currentTime=Number(e.target.value);}});
}
function mountReaderVideo(play){
 const m=readerCurrentModule(),s=readerScene(m?.id);if(!s)return;const mount=document.getElementById('readerVideoMount');if(!mount)return;
 let v=document.getElementById('readerVideo');if(v){v.currentTime=s.start;if(play)v.play().catch(()=>{});return;}
 mount.innerHTML='<video id="readerVideo" controls playsinline preload="metadata" aria-label="Filmszene: '+escape(s.title)+'"></video>';
 v=document.getElementById('readerVideo');const status=document.getElementById('readerFilmStatus'),seek=document.getElementById('readerSeek'),clock=document.getElementById('readerClock');
 const update=()=>{if(!v.isConnected)return;if(v.currentTime>=s.end){v.pause();status.textContent='Szenenende erreicht. Vergleiche jetzt die Textstelle oder wähle die nächste Szene.';}const t=Math.max(s.start,Math.min(s.end,v.currentTime));seek.value=t;clock.textContent=fmtTime(t-s.start)+' / '+fmtTime(s.end-s.start);};
 v.addEventListener('loadedmetadata',()=>{if(v.duration<s.end){status.textContent='Diese Filmfassung ist zu kurz für die Kapitelmarken. Wähle die bereitgestellte Fassung oder nutze die Filmwerkstatt.';return;}v.currentTime=s.start;status.textContent=fmtTime(s.start)+'–'+fmtTime(s.end)+' · '+s.note;if(play)v.play().catch(()=>{status.textContent='Szene ist bereit. Starte sie mit der Wiedergabetaste.';});});
 v.addEventListener('play',()=>{if(v.currentTime<s.start||v.currentTime>=s.end)v.currentTime=s.start;});
 v.addEventListener('seeking',()=>{if(v.currentTime<s.start)v.currentTime=s.start;else if(v.currentTime>s.end)v.currentTime=s.end;});
 v.addEventListener('timeupdate',update);v.addEventListener('error',()=>{status.textContent='Der Film konnte nicht geladen werden. Öffne die Filmquelle oder wähle dieselbe Fassung als lokale Datei.';});
 v.src=filmObjectURL||D.videos[0].src;const timer=setInterval(()=>{if(!v.paused)update();},100);readerVideoCleanup=()=>{clearInterval(timer);v.pause();v.removeAttribute('src');v.load();};
}
function stopReader(){if(readerVideoCleanup){readerVideoCleanup();readerVideoCleanup=null;}readerPdfJob++;readerPdfRender?.cancel();readerPdfRender=null;}
function pdfCache(){return new Promise((resolve,reject)=>{if(!window.indexedDB){reject(Error('Lokaler Dateispeicher nicht verfügbar'));return;}const req=indexedDB.open('terror-reader-media',1);req.onupgradeneeded=()=>req.result.createObjectStore('files');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function readPdfCache(){const db=await pdfCache();return new Promise((resolve,reject)=>{const tx=db.transaction('files','readonly'),r=tx.objectStore('files').get('text');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function writePdfCache(file){const db=await pdfCache();return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');file?tx.objectStore('files').put(file,'text'):tx.objectStore('files').delete('text');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
async function loadDefaultReaderPdf(){
 if(readerDefaultRequest)return readerDefaultRequest;
 const version=readerPdfLoading;
 const status=document.getElementById('readerPdfStatus');if(status)status.textContent='Die eingebundene Textausgabe wird geladen …';
 readerDefaultRequest=(async()=>{
  try{const response=await fetch(READER_TEXT_URL);if(!response.ok)throw Error('HTTP '+response.status);
   const blob=await response.blob();if(version!==readerPdfLoading)return;
   await loadReaderPdf(new File([blob],'Schirach_Terror_9783641203290.pdf',{type:'application/pdf'}),undefined);
  }catch(err){if(version===readerPdfLoading){const status=document.getElementById('readerPdfStatus');if(status)status.textContent='Der Text konnte nicht geladen werden. Prüfe die Verbindung und wähle «Text erneut laden» oder «PDF direkt öffnen».';}}
  finally{readerDefaultRequest=null;}
 })();return readerDefaultRequest;
}
async function loadReaderPdf(file,remember){
 const loadId=++readerPdfLoading;const status=()=>document.getElementById('readerPdfStatus');if(file.type!=='application/pdf'&&!file.name?.toLowerCase().endsWith('.pdf')){toast('Bitte eine PDF-Datei wählen.');return;}
 if(status())status().textContent='PDF wird lokal geöffnet …';
 try{const lib=await import('./vendor/pdfjs/pdf.mjs');lib.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.mjs',location.href.split('#')[0]).href;
 const pdf=await lib.getDocument({data:await file.arrayBuffer(),standardFontDataUrl:new URL('./vendor/pdfjs/standard_fonts/',location.href.split('#')[0]).href,isEvalSupported:false}).promise;
 if(loadId!==readerPdfLoading){pdf.destroy();return;}readerPdfJob++;readerPdfRender?.cancel();readerPdfRender=null;readerPdf?.destroy();readerPdf=pdf;readerPdfName=file.name||'Deine PDF';if(pdfURL)URL.revokeObjectURL(pdfURL);pdfURL=URL.createObjectURL(file);
 let cacheFailed=false;try{if(remember!==undefined)await writePdfCache(remember?file:null);}catch(_){cacheFailed=remember;}
 const m=readerCurrentModule();if(m)await drawReaderPdf(readerScene(m.id)?.page||parseInt(m.pages));if(cacheFailed)toast('PDF geöffnet. Dauerhaftes Merken ist hier nicht möglich.');
 }catch(err){if(status())status().textContent='Die PDF konnte nicht geöffnet werden. Prüfe die Datei; verschlüsselte PDFs müssen zuerst entsperrt werden.';}
}
async function drawReaderPdf(page){
 const mount=document.getElementById('readerPdfMount');if(!mount)return;
 if(!readerPdf){document.getElementById('readerPdfStatus').textContent='Die Textausgabe wird geladen. Falls sie nicht erscheint, wähle «Text erneut laden».';return;}
 const pdf=readerPdf,job=++readerPdfJob;readerPdfPage=Math.max(1,Math.min(pdf.numPages,Math.trunc(Number(page))||1));
 readerPdfRender?.cancel();readerPdfRender=null;
 const input=document.getElementById('readerPage');input.value=readerPdfPage;input.max=pdf.numPages;document.getElementById('readerPageCount').textContent='/ '+pdf.numPages;
 document.getElementById('readerPdfStatus').textContent=readerPdfName+' · Seite '+readerPdfPage+(pdf.numPages!==103?' · Andere Ausgabe: Prüfe die Zuordnung selbst.':'');
 document.getElementById('readerPdfLinks').innerHTML=`<a href="${pdfURL}#page=${readerPdfPage}" target="_blank" rel="noopener">PDF gross öffnen ↗</a> <button class="secondary small" data-pdf-forget>Zur eingebundenen Ausgabe zurückkehren</button>`;
 try{const p=await pdf.getPage(readerPdfPage);if(job!==readerPdfJob||!mount.isConnected)return;
 const base=p.getViewport({scale:1}),width=Math.max(250,mount.clientWidth-24)*readerPdfZoom,ratio=Math.min(window.devicePixelRatio||1,2),viewport=p.getViewport({scale:width/base.width*ratio});
 const canvas=document.createElement('canvas');canvas.width=viewport.width;canvas.height=viewport.height;canvas.style.width=width+'px';canvas.style.maxWidth='none';canvas.setAttribute('role','img');canvas.setAttribute('aria-label','PDF-Seite '+readerPdfPage);mount.replaceChildren(canvas);mount.scrollTop=0;
 const task=p.render({canvasContext:canvas.getContext('2d'),viewport});readerPdfRender=task;await task.promise;if(job===readerPdfJob)readerPdfRender=null;
 const text=await p.getTextContent();if(job!==readerPdfJob||!mount.isConnected)return;const accessible=document.createElement('div');accessible.className='sr-only';accessible.textContent=text.items.map(x=>x.str).join(' ');mount.appendChild(accessible);
 }catch(err){if(err.name!=='RenderingCancelledException'&&job===readerPdfJob)document.getElementById('readerPdfStatus').textContent='Diese Seite konnte nicht dargestellt werden. Nutze «PDF gross öffnen».';}
}
