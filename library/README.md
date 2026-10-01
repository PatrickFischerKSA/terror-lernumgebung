# Lokale Richterbibliothek

Im Spielraum unter **LM-Bibliothek**. Zugang besitzt der jeweils aktuelle Vorsitz in jedem Raum. Die Akte verbindet das lokale Drama-PDF, Argumentationslehre, redaktionelle Fakten, das vollständige Grundgesetz und die vorhandenen StGB-/StPO-Normen. BM25-artige Stichwortsuche mit Begriffserweiterungen findet Textabschnitte; Mistral Small 3.2 (vorhandenes Modell in LM Studio) formuliert Beratung mit geprüften Quellenkennungen. Kein externer KI-Anbieter und kein kostenpflichtiger API-Schlüssel.

Die Prüfung einer Quellenkennung garantiert nicht, dass die KI den Inhalt richtig interpretiert. Fundstellen prüfen; die Richterhilfe bleibt jederzeit ohne Modell nutzbar. Die Bibliothek fällt kein Urteil und vergibt keine automatische Note.

## Betrieb auf diesem Mac

Der aktivierte LaunchAgent `ch.patrickfischer.terror-richterbibliothek` startet beim Anmelden den lokalen Dienst. Cloudflare-Verbindung und Veröffentlichung wurden am 01.10.2026 ausdrücklich freigegeben. LM Studio lauscht nur auf `127.0.0.1:1234`. Der Rechner muss eingeschaltet, angemeldet, wach und mit dem Internet verbunden sein. Im Ruhezustand ist die Bibliothek offline. Anfragen werden pro Computer nacheinander bearbeitet; mehrere Computer können unterschiedliche Fragen gleichzeitig beantworten, typischerweise mit Wartezeit von einer bis mehreren Minuten.

Der lokale Dienst ruft ausgehend die geschützte Warteschlange im Worker ab. Es wird kein öffentlicher Port zum Mac geöffnet. Das gemeinsame Geheimnis liegt ausschliesslich als Cloudflare-Secret und in `library/private/config.json` (Dateirechte 600). Nicht veröffentlichen. PDFs und Volltextindex liegen nur in `library/private/`, von Git ausgeschlossen. Nur Fragen und begrenzte Antworten/Quellenausschnitte verlassen den Rechner; der Verhandlungschat wird nicht automatisch übertragen.

```sh
# Status
launchctl print gui/$(id -u)/ch.patrickfischer.terror-richterbibliothek
# Stoppen
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/ch.patrickfischer.terror-richterbibliothek.plist
# Wieder starten
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/ch.patrickfischer.terror-richterbibliothek.plist
```

Beim Stoppen wird das LM-Studio-Modell nicht automatisch entladen, damit andere lokale Nutzung nicht gestört wird. Es kann in LM Studio manuell entladen werden. Die aktive Installation liegt unter `~/Library/Application Support/TerrorRichterbibliothek/`. Betriebslogs ohne Fragen/Antworten liegen dort in `library/private/service.log` und `service-error.log`. `python3 library/install-runtime.py` installiert bzw. aktualisiert den Laufzeitcode aus dem Repository; vorhandene private Daten und angepasste Spielregeln werden erhalten.

## Verbindliche fiktive Rechtslage

`~/Library/Application Support/TerrorRichterbibliothek/library/policy.json` legt die aktive Spielregel zentral fest. `library/policy.json` im Repository ist die mitgelieferte Vorlage. Die Lehrperson hat **Rechtfertigung als mögliche Ausnahme** gewählt. Die Voraussetzungen sind didaktische Simulationsregeln, keine Rechtsquellen. Sie ersetzen weder Grundgesetz noch reales Recht. Jede Änderung bekommt eine neue Versionskennung; laufende Anfragen behalten die bei Eingang gültige Version. Neue Fragen übernehmen die Datei beim nächsten Kontakt (etwa fünf Sekunden). Änderungen an `rubric.json` im selben aktiven Laufzeitordner bestimmen das Beratungsraster. Die KI und Spielerfragen dürfen diese Vorgaben nicht selbst ändern.

## Rollenrotation

Neue Räume starten mit aktiviertem Modus. Der Vorsitz beendet Runden manuell. Alle sechs Rollen müssen besetzt sein. Nach 15 Runden wechselt jede Person um eine Rolle: Vorsitz → Koch → Biegler → Nelson → Lauterbach → Meiser → Vorsitz. Auch offline reservierte Rollen werden mitgetauscht; beim Wiederverbinden wird die richtige Rolle anhand des persönlichen Tokens geladen. Phase und alte Protokollrollen bleiben erhalten, Rederecht geht an alle. Ausschalten setzt den Zähler zurück; Einschalten beginnt bei null. Bestehende Räume ohne Rotationseinstellung starten deaktiviert.

## Grenzen und Datenhaltung

Maximal eine laufende Frage pro Raum, mindestens 30 Sekunden zwischen Fragen, maximal 20 wartende/laufende Fragen insgesamt. Antworten stehen dem jeweils aktuellen Vorsitz desselben Raumes zur Verfügung, einschliesslich des nachfolgenden Vorsitzes. Nach einer Stunde werden Fragen/Antworten gelöscht; Raumlöschung entfernt sie sofort. Nach zehn Minuten ohne Ergebnis gilt eine Frage als fehlgeschlagen. Offline bleiben Faktenakte, Gesetze, Argumentationsprüfung und geführte Richterhilfe nutzbar.

## Entwicklung

`npm run check`, `node tests/rotation.mjs`, `node tests/library.mjs` (lokaler Worker und private Konfiguration erforderlich). PDF-Index mit `library/index-pdf.py <Drama-PDF> <Argumentationslehre-PDF>` erzeugen. Die Installation benötigt Python mit pypdf; der laufende Dienst nur Node und LM Studio. Änderungen an Backend und Frontend müssen mit Wrangler bzw. GitHub Pages veröffentlicht werden. Der Worker verwendet eine separate SQLite Durable Object für die gemeinsame Bibliothekswarteschlange.

## Zweiter Lehrercomputer (Windows)

[Windows-Anleitung](WINDOWS.md) · [Installationspaket herunterladen](https://patrickfischerksa.github.io/terror-lernumgebung/downloads/terror-bibliothek-windows.zip). Beide Rechner können gleichzeitig unterschiedliche Fragen bearbeiten; Windows übernimmt standardmässig die zentrale Spielregel des Macs. Offline-Meldungen werden pro Computer ausgewertet. Die Vergabe von Fragen ist transaktional und an die Rechnerkennung gebunden.
