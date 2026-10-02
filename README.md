# TERROR · Urteilen lernen

Offene Selbstlernumgebung für die gymnasiale Oberstufe zu Ferdinand von Schirachs *Terror*. Erstellt am 30. September 2026.

## Start

**Website:** https://patrickfischerksa.github.io/terror-lernumgebung/

**Repository:** https://github.com/PatrickFischerKSA/terror-lernumgebung

`dist/index.html` direkt im Browser öffnen oder den Ordner `dist` als statische Website bereitstellen. Für zuverlässige Speicherung einen normalen Browser und eine feste Webadresse verwenden. Externe Videos benötigen Internetzugang und werden erst nach Klick geladen.

## Inhalte

- Szenenleseraum nach dem Vorbild des Faust-Leseraums: Film und PDF parallel, Szenenleiste, 36 einzeln bearbeitbare Analyseaufträge, Filmspuren und gestufte Hilfen
- Zehn didaktische Filmkapitel mit geprüften Marken für die 93:37-Fassung; Entscheidungspause und beide Urteilsfassungen separat anwählbar
- Lokaler PDF-Reader mit PDF.js, automatischem Seitenwechsel, optionalem Merken der Datei im Browser und Löschfunktion
- 7 Rollenakten, 6 Dilemmavarianten und ein Perspektivwechsel nach Rawls
- 8 philosophische Positionen und ein Vergleichswerkzeug
- Rechtslabor mit 8 kommentierten Kurzchecks
- 7-stufige Verhandlung mit fest formulierten Rückmeldungen und eigenem Schlussvotum
- Filmwerkstatt mit 4 Medien, lokalen oder externen Spielfilmdateien und selbst definierten Ausschnitten
- 6 politische Vertiefungen und didaktisch angebundene Links auf die 4 vorhandenen Spiele
- Lokales Journal, Markdown-Export, JSON-Sicherung mit Import und Druckansicht
- Quellenapparat, Hinweise für Lehrpersonen und Bewertungsraster

## Dateien

- `dist/data.js`: redaktionelle Inhalte
- `dist/app.js`: Navigation, Simulation und lokale Lernfunktionen
- `dist/style.css`: responsive Gestaltung und Druckformat
- `dist/index.html`: Einstieg und Metadaten

Keine Buch-PDF oder vollständige Filmkopie wird mit der Website verbreitet. Auf ausdrücklichen Wunsch enthält `dist/media/film/` 14 ausgewählte Filmstandbilder und sechs Ausschnitte von je 20 Sekunden aus der bereitgestellten Filmfassung. Die bereitgestellten Quellen wurden für Aufgaben und Seitenverweise ausgewertet. Originale können lokal im Browser geöffnet werden. Die Filmszenen wurden anhand einer lokalen Transkription, Textabgleich und Filmstandbildern zeitlich zugeordnet. Der Player springt zum Kapitelanfang und stoppt am Ende. Die Filmwerkstatt bietet zusätzlich frei definierbare Zeitmarken.

Offene Texte werden nicht automatisch benotet. Die Website enthält keine KI-API, keine Klassenkonten, keine zentrale Lernstandserfassung und keine Live-Abstimmung. Der zusätzliche Multiplayer-Prozess synchronisiert nur seine eigenen Chatbeiträge und den Verfahrensstand. Lektürenotizen bleiben im Browser. Externe Seiten und Videodienste können eigene Zugangsbedingungen haben.

## Inhaltliche Orientierung

Moralische Bewertung, literarische Interpretation und rechtliche Prüfung werden getrennt. Der Fall ist im deutschen Recht verortet; ein eigener Vergleichsauftrag behandelt die Schweizer Bundesverfassung. Staatsrechtliche Befugnis, Rechtfertigung, Entschuldigung und Strafzumessung sind nicht austauschbar. Die Lernkarten vereinfachen für die Sekundarstufe II und verlinken zur Vertiefung.

## Veröffentlichung und Prüfung

Änderungen auf `main` werden automatisch geprüft und aus `dist` mit GitHub Actions auf GitHub Pages veröffentlicht. Die Selbstlernbereiche benötigen keinen Server und keine API-Schlüssel. Der zusätzliche Multiplayer-Spielraum nutzt den unten beschriebenen Cloudflare-Server.

Lokale Prüfung: `node check.cjs`. Der Check prüft die 48 Ansichten, Inhaltsverweise, Simulationsschritte, Zeitangaben und das JSON-Exportformat.

Beim Wechsel von einer anderen Webadresse werden lokale Journale nicht automatisch übertragen. Exportiere dort eine JSON-Sicherung und importiere sie unter „Mein Journal“ auf dieser Website.

## Szenenleseraum

`dist/reader.js` enthält Mediensteuerung, PDF-Reader und Einzelaufträge. `TERROR.scenes` in `dist/data.js` enthält die Marken (Sekunden) der bereitgestellten Fassung. Andere Filmschnitte brauchen eigene Marken. PDF-Seiten sind absolute Dateiseiten der 103-seitigen btb-Ausgabe. Die Varianten unter `urteile.parts` verknüpfen Freispruch mit PDF 91 und Verurteilung mit PDF 87. Die Entscheidungspause endet vor dem ersten Urteilstitel.

Die gewählte PDF wird auf Wunsch ausschliesslich in IndexedDB (`terror-reader-media`) gespeichert. Die Datei kann im Leseraum entfernt werden. Die Journal-Sicherung enthält weiterhin nur Antworten und Lernstand, keine Medien. Filmdateien werden nicht dauerhaft im Browser gespeichert. Externes Filmstreaming wird erst nach Auswahl aktiviert.

PDF.js 6.3.289 liegt samt Worker, Standardschriften und Apache-2.0-Lizenz unter `dist/vendor/pdfjs/`. Quellen: https://github.com/mozilla/pdf.js und https://www.npmjs.com/package/pdfjs-dist. Kein CDN und kein Buildschritt erforderlich.

## Sofortfeedback für Lektürefragen

Alle 36 Einzelaufträge im Leseraum haben eigene Erwartungshorizonte, Referenzantworten und überprüfte PDF-Fundstellen. `dist/feedback.js` enthält die lokalen Regeln: umfangreiche Synonymfelder, Wortformen, ss/ß und Umlautvarianten, begrenzte Tippfehlertoleranz bei langen Wörtern sowie Kontextfenster aus höchstens zwei Sätzen. Feedback erscheint nach 650 ms Schreibpause oder sofort über «Antwort prüfen». Es wird beim Wiederöffnen einer gespeicherten Antwort neu berechnet.

Erkannte Aspekte werden mit einem Ausschnitt der eigenen Antwort angezeigt. Fehlende Treffer erzeugen Hinweise, keine automatische Falschwertung. Explizite typische Fehlannahmen erhalten Korrektur, Begründung und PDF-Verweis. Die Fehlerregeln behandeln Verneinungen, Zitate und zurückgewiesene Behauptungen vorsichtig. Die Referenzbuttons öffnen die Fundstelle im lokal geladenen PDF-Reader. Kurzchecks nennen nach jeder Auswahl die richtige Antwort, die Begründung und eine Fundstelle.

Dies ist ein transparenter Sprachabgleich, kein allgemeines Sprachverständnis, keine Benotung und kein externer KI-Dienst. Er kann Umformulierungen übersehen und Zusammenhänge falsch einordnen. Bei kreativen und interpretierenden Aufgaben bleiben abweichende textgestützte Lösungen zulässig. Eine Zahl erkannter Aspekte ist kein Qualitäts- oder Richtigkeitsscore.

`node feedback-check.cjs` prüft alle 36 Erwartungshorizonte und Referenzantworten, sinngleiche Formulierungen, typische Fehler samt Korrekturen, Verneinungen, Zitate, Schreibvarianten und Fundstellen. Beide Prüfscripte laufen vor jeder Veröffentlichung auf GitHub Pages.

## Multiplayer-Prozess für sechs Rollen

**Spielraum:** https://patrickfischerksa.github.io/terror-lernumgebung/spielraum/

Eine Person eröffnet den Raum als Vorsitz. Fünf weitere Personen wählen über den Einladungslink Lars Koch, Biegler, Nelson, Lauterbach oder Franziska Meiser. Die Rollen werden serverseitig exklusiv vergeben. Alle haben Zugriff auf zwölf belegte Fallkarten, alle Rollenakten, die rechtlichen Orientierungshilfen, 17 einschlägige StGB-/StPO-Normen und das vollständige durchsuchbare Grundgesetz. Die Gesetzestexte stammen aus den XML-Paketen von Gesetze im Internet (Abruf 30.09.2026); die didaktischen Erläuterungen sind ausdrücklich von den Normtexten getrennt. Die heutige Gesetzesfassung wird nicht als historischer Rechtsstand von 2013 ausgegeben.

Der Vorsitz steuert elf Verfahrensphasen und das Rederecht. Wortmeldungen, Einwände und Organisationsnachrichten bleiben möglich. Eine achtteilige textbasierte Entscheidungshilfe führt von den Tatsachen über Beweise, Tatbestand, Rechtfertigung und Schuld bis zu Gegenargument und Begründung. Sie vergibt keine juristische Richtigkeitsnote. Nur der Vorsitz kann das ausgearbeitete Urteil veröffentlichen. Drei gekennzeichnete erfundene Fallvarianten können in der Vorbereitung gewählt werden. Eine neue Verhandlung kann auf den Vorbereitungsschritt zurückgesetzt werden; Änderungen bleiben im Protokoll erkennbar.

### Technik und Datenschutz

Die **gesamte Oberfläche und der gesamte Quellcode liegen auf GitHub**, die Oberfläche läuft auf GitHub Pages. Echte geräteübergreifende Synchronisation benötigt zusätzlich einen Server: `terror-spielraum.patrick-fischer.workers.dev` im bestehenden Cloudflare-Konto. Ein SQLite Durable Object koordiniert jeden Raum. Die WebSocket-Verbindungen können hibernieren; kein kostenpflichtiges Upgrade ist eingerichtet.

- Keine Anmeldung, keine echten Namen, keine KI-API; die Figuren sind menschliche Mitspieler*innen.
- Der zufällige Raumcode im Einladungslink ermöglicht das Beanspruchen freier Rollen. Es gibt kein öffentliches Raumverzeichnis. Belegte Rollen können nicht über den Link übernommen werden.
- Ein eigener zufälliger Rollenschlüssel wird in `sessionStorage` dieses Browserfensters gespeichert und beim WebSocket-Verbindungsaufbau als Unterprotokoll übertragen, nicht als URL-Parameter. Der Server speichert nur dessen SHA-256-Hash. Keine Tokens werden im öffentlichen Zustand oder Protokoll ausgegeben.
- Chat und gemeinsamer Verfahrensstand werden bei Cloudflare gespeichert. Automatische Löschung 24 Stunden nach Eröffnung über einen Durable-Object-Alarm. Zugriff endet spätestens mit der Ablaufzeit. Der Vorsitz kann früher löschen. Bei einer technischen Verzögerung des Alarms erfolgt die physische Löschung beim nächsten Alarmdurchlauf.
- Urteilsentwurf und ungesendeter Beitrag bleiben im jeweiligen Browserfenster, bis sie bewusst veröffentlicht werden. Neuladen erhält die Rolle. Nach Schliessen/Verlust des Fensters ist die Wiederherstellung browserabhängig. Der Vorsitz kann eine offline befindliche Mitspielerrolle freigeben; deren alter Schlüssel verliert dabei seine Gültigkeit. Geht der Vorsitz-Zugang verloren, einen neuen Raum erstellen.
- Das gemeinsame Protokoll lässt sich als Markdown sichern. **Vor Löschung oder Ablauf exportieren.** Die lokale Sicherung wird nicht durch den Server gelöscht.
- Begrenzte Nachrichtenlänge, serverseitige Rollenrechte, Schreibbremse, maximal 1200 Protokolleinträge, maximal drei Verbindungen pro Rolle, Begrenzung neuer Räume pro IP. Keine Chattexte oder Zugangsschlüssel werden durch Anwendungscode geloggt. Cloudflare verarbeitet technisch erforderliche Verbindungsdaten und Betriebsmetadaten.
- Die bisherigen Lektürenotizen, PDF-Dateien und Journale verbleiben weiterhin lokal; sie werden nicht an den Spielraum-Server gesendet.

### Entwicklung und Veröffentlichung

```sh
npm ci
npx wrangler types
npm run check
npx wrangler dev --port 8787
# In einem zweiten Terminal:
python3 -m http.server 8769 --directory dist
# In einem dritten Terminal, gegen den lokalen Worker:
npm run test:room
```

Die beiden lokalen Origins `localhost:8769` und `127.0.0.1:8769` sind erlaubt. Die Oberfläche wählt nur dort den lokalen Worker. Produktion verwendet die feste Adresse aus `dist/spielraum/config.js`.

```sh
# Mit vorhandener Cloudflare-Anmeldung:
npx wrangler deploy --dry-run
npm run deploy:server
# Integrationstest gegen die veröffentlichte API; legt einen eigenen Testraum an und löscht ihn:
ROOM_API=https://terror-spielraum.patrick-fischer.workers.dev npm run test:room
# Gesetzesakte bei Bedarf bewusst aktualisieren:
python3 scripts/fetch-laws.py
```

Backend-Veröffentlichungen erfolgen bewusst separat mit Wrangler; GitHub Pages veröffentlicht die statischen Dateien nach den Prüfungen auf `main`. Secrets gehören weder in `dist` noch ins Repository. `wrangler.jsonc`, Backend, Tests und npm-Lockdatei sind versioniert. Die automatisch erzeugten Laufzeittypen befinden sich in `worker-configuration.d.ts`.

`tests/room.mjs` prüft sechs gleichzeitige Clients, konkurrierende Rollenvergabe, bereinigte öffentliche Daten, Richterberechtigungen, Rederecht, Einwände, Wortmeldungen, gemeinsame Nachrichten, Duplikatschutz, Wiederverbindung, Varianten, Urteilsübertragung, Abschluss und Löschung. `tests/content.mjs` kontrolliert die Gesetzesakte, Quellenverweise und das Rollen-/Phasenschema. Die Oberfläche wurde zusätzlich mit zwei unabhängigen Browser-Tabs und schmalem Viewport geprüft.

## Begleiteter Gerichtsassistent und Argumentationsprüfung

Der Vorsitz startet im begleiteten Modus. Sieben Schritte bieten phasenbezogene Fragevorschläge, eine private Belegliste aus konkreten Chatbeiträgen (gesichert/umstritten/offen), Faktenfragen mit Sofortfeedback und Fundstellen, alltagssprachliche Rechtsfragen, persönliche Schuld, Gegenprüfung und einen bearbeitbaren Urteilsentwurf. Die Texte werden aus den eigenen Antworten zusammengesetzt; fehlende Begründungen werden nicht erfunden. Eine noch offene Entscheidung wird nicht automatisch in ein Urteil umgewandelt. Die freie Richterhilfe bleibt erreichbar.

Alle Spielenden können einen eigenen Text oder einen Chatbeitrag unter **Argumente** prüfen. Fünf Strukturmerkmale orientieren sich an den lokalen Prüfideen aus [PatrickFischerKSA/argumentationspruefer](https://github.com/PatrickFischerKSA/argumentationspruefer), `server.js`, Quellenstand `372e4351177bb49bc71a7a14c17bd9f7d41bb7bf`. Die Integration ist eine lokale, redaktionell angepasste Browser-Implementierung; sie ruft weder dessen Express-Endpunkte noch OpenAI, LanguageTool oder Literaturdienste auf. Die dortigen heuristischen Punktwerte wurden bewusst nicht als Qualitätsnote übernommen.

Die bereitgestellte **Argumentationslehre.pdf**, S. 1–4, liefert die Schlussarten und Denkfehler-Kategorien. Zehn vorsichtige Sprachmuster und zehn zusätzliche manuelle Prüfbereiche, ergänzt durch eine formale Logik-Werkstatt, erschliessen sie für den Fall. Treffer zeigen den Textausschnitt, eine Rückfrage und eine Quellenstelle. Zitate, Verneinungen und berichtete Positionen erhalten einen ausdrücklichen Kontextvorbehalt. Ein fehlender Treffer bestätigt nicht die Fehlerfreiheit. Emotion, Autorität, Analogie oder eine Folgenprognose werden nicht pauschal als Fehlschluss gewertet. Deduktive Gültigkeit wird von wahren Prämissen und von induktiver/abduktiver Plausibilität unterschieden; vereinfachende Aussagen der Vorlage werden damit präzisiert. Die PDF selbst wird nicht veröffentlicht.

Private Belegnotizen und Zwischenschritte liegen in `sessionStorage` (`terror-guide-<Raumcode>`); Entwürfe werden erst durch die bestehende ausdrückliche Urteilsverkündung geteilt. Kein zusätzlicher API-Key und keine Änderung des Multiplayer-Backends sind erforderlich.

Dateien: `dist/spielraum/assistant.js`, `argumentation.js`; Regressionen: `tests/assistant.mjs`. Geprüft werden die Faktenrückmeldungen, elf Phasen, Belegübernahme in Entwürfe, Mustertreffer, Zitat-/Verneinungshinweise sowie gültige und ungültige formale Schlüsse.

## Filmische Gestaltung

`dist/visuals.js` verzeichnet die originalen Zeitmarken, Bildbeschreibungen und Beobachtungsaufträge. WebP-Standbilder (1280 × 720) und MP4-Ausschnitte (854 × 480, H.264/AAC) werden von GitHub Pages ausgeliefert. Insgesamt ca. 5,5 MB; Videos laden erst bei Bedarf (`preload="none"`), ohne Autoplay. Die sechs Fenster dienen der Analyse von Raum, Auftreten und Kamera; sie ersetzen keine vollständige Aussage. Die zugehörige Textstation erschliesst jeweils den Kontext. Die Urteilsvarianten werden in den Vorschaubildern nicht vorweggenommen.

## Aviatik · Lage und Verantwortung

`#aviatik` erschliesst acht selbstständig nutzbare Stationen, 18 Glossareinträge, ein interaktives schematisches Lagebild, einen Zeit-Distanz-Rechner, eine literarische Zeitlinie und acht Auswahlfragen mit begründetem Sofortfeedback. Freie Transfertexte verwenden das bestehende lokale Journal; sie erhalten ein offengelegtes Selbstprüfraster. Es gibt keine Flug-Livedaten, keine echte Funkverbindung und keine automatische rechtliche Schlussfolgerung.

Fachquellen und vollständige Bildnachweise stehen in `dist/aviation.js` und auf der Website. Zwei kleinere, vom Bildarchiv bezogene Vorschauen beschleunigen die Darstellung; Originale öffnen erst auf Klick. Fünf Original-JPEGs in `dist/media/aviatik/`: München (High Contrast, CC BY 3.0 DE), Zürich (Hornet Driver, CC BY-SA 3.0), DLR-Simulator (DLR, CC BY 3.0 DE), Washington ARTCC (FAA, Public Domain USA), Anchorage-Kartenausschnitt 21.03.2024 (FAA, Public Domain). Die verschiedenen Fotoorte und Jahre sind ausdrücklich bezeichnet. Das Kartenbeispiel ist kein Deutschland-Flugweg; die DFS-AIP ist als Originalquelle für EDDM verlinkt. Inhalte und Quellen am 30.09.2026 geprüft.

`node tests/aviation.cjs` prüft Quellenverknüpfung, Bildlizenzen, Erklärungen, Rechenfälle und ungültige Eingaben.

## Fallakte Flydubai

`#flydubai` ergänzt die Lektüre um vier Stationen zum Vorfall auf FZ1073 vom 30. September 2026: Basistext, drei Textquellen, zwei DW-Filmbeiträge und Transfer zu «Terror». Separater redaktioneller Quellenstand: 1. Oktober 2026, kein Live-Ticker. Die genauen Abläufe und Motive werden als Gegenstand der laufenden Untersuchung behandelt.

`dist/flydubai.js` enthält Quellen, Lernaufträge und Ansichten, `dist/flydubai.css` die Ergänzungen zur vorhandenen Gestaltung. Links im Hauptmenü, am Ende der Lektüreübersicht, bei Auftakt, Meiser, Koch und Grenzfällen sowie im Aviatikbereich öffnen die Akte. Alle freien Antworten verwenden die vorhandenen lokalen Journal-, Export- und Importfunktionen. Die DW-Beiträge öffnen extern; es werden keine externen Player oder Tracking-Anfragen automatisch geladen. Die Videometadaten wurden geprüft, die vollständige Wiedergabe nicht.

`node check.cjs` prüft auch die fünf neuen Routen, ihre internen Verweise, die Journaldarstellung und die Maskierung gespeicherter Texte.

## Gemeinsame Klassenabstimmung

`abstimmung/` eröffnet einen eigenen Klassenraum für «schuldig / unschuldig». Teilnahmelink oder zwölfstelligen Code teilen. Pro Browserprofil wird eine zufällige Kennung gespeichert; erneutes Abstimmen ersetzt die vorherige Stimme. Keine Identitätskontrolle über mehrere Geräte hinweg. Die Verteilung bleibt serverseitig bis zum Abschluss verborgen. Nur der im eröffnenden Browser gespeicherte Lehrerzugang kann abschliessen. Danach sind Ergebnis und CSV-Export verfügbar. Räume laufen nach 24 Stunden ab und werden per Alarm gelöscht.

Backend: separate SQLite Durable Object `ClassBallot`, Binding `BALLOTS`, Migration `v3`. Prüfung mit lokal laufendem `wrangler dev`: `npm run test:ballot`. Die vorhandenen Prozessräume und die Richterbibliothek bleiben getrennt.

## Cockpit-Rollensimulation

`cockpit/`: dreiminütige didaktische Verdichtung aus Kochs Perspektive, alternativ manuell in 15-Sekunden-Schritten. Vier Kontaktversuche mit verzögerten Rückmeldungen, ausdrücklicher Nicht-Abschussbefehl, Sinkflug, bestätigte Entscheidung und Reflexionsprotokoll. Ablauf und Dialog sind erfunden; keine taktische Flugsimulation oder moralische Punktewertung. Pausiert beim Tabwechsel, unterstützt reduzierte Bewegung und optional synthetische Sprachausgabe. Drei lokale MP4-Filmanimationen zu je neun Sekunden aus zwei mit dem eingebauten Imagegen erzeugten PNGs. Prompts und Herkunft: `dist/cockpit/assets/generation.json`; Renderprogramm: `scripts/cockpit-clips.py`. Tests: `tests/cockpit.mjs`.

Cockpit-Überarbeitung: Freitext-Funk mit transparentem lokalen Themenabgleich, wiederholten Nachfragen und frei formulierter Entscheidung samt Rückbestätigung. Seitlicher Blick auf die Parallelbegleitung gemäss Dramen-PDF S. 47; der spätere Wechsel hinter/über das Flugzeug (S. 49) ist in der Reflexion erklärt. Neue Seitenansichten und neu gerenderte MP4s ersetzen die frühere Perspektive im Spiel.

Der Cockpit-Funk verwendet einen lokalen Gesprächszustand: Rückfrage, bestätigte Weiterleitung und verzögerte Antwort bauen aufeinander auf. Ohne Anfrage gibt es keine automatische Ministermeldung. Die Ablehnung wird textgemäss über Radtke vermittelt (PDF S. 29); Wartezeiten und Wortlaut sind inszeniert. Optional kann LM Studio über eine kompatible /v1-Adresse kurze gekennzeichnete Reaktionen ergänzen. Verbindungstest, Modellauswahl, flüchtiger Token, zwölf Sekunden Zeitlimit und fester Ersatzdialog sind eingebaut. Die feste Funkmeldung bleibt sichtbar; der Wortfilter bietet keine vollständige semantische Garantie. Einrichtung: dist/cockpit/lm-studio.html. Die bestehende Richterbibliothek-Warteschlange wird hierfür nicht verwendet.
