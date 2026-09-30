# Text und Film im Szenenleseraum

Grundlage ist die vom Nutzer bereitgestellte Filmdatei **Terror – Ihr Urteil**, Laufzeit 5617,34 Sekunden (93:37). Die Filmspur wird über den bestehenden Dropbox-Link gestreamt. Eine lokal gewählte identische Filmdatei kann alternativ verwendet werden. Die Website enthält keine Filmkopie.

Die Einteilung ist didaktisch, nicht als offizielle Kapitelstruktur ausgegeben. Zur Zuordnung wurden die Dialoge lokal transkribiert, die Übergänge anhand kurzer Audiobereiche überprüft und mit Filmstandbildern sowie dem Dramentext abgeglichen. Die automatische Transkription ist lediglich Arbeitsmaterial und wird nicht veröffentlicht. Die Zeitmarken sind auf diese Fassung bezogen; bei anderen Schnitten können sie abweichen.

| Station | Filmabschnitt | PDF-Seiten |
|---|---|---|
| Auftakt und Gerichtsraum | 00:00–03:38 | 7–12 |
| Anklage und erste Erklärung | 03:38–09:08 | 12–16 |
| Lauterbach: der Ablauf | 09:08–23:40 | 17–35 |
| Unterlassene Räumung | 23:40–32:45 | 35–42 |
| Koch: Person und Entscheidung | 32:45–43:03 | 43–54 |
| Leben gegen Leben? | 43:03–54:15 | 54–64 |
| Meiser: der einzelne Mensch | 54:15–64:04 | 65–73 |
| Nelsons Plädoyer | 64:04–74:25 | 75–81 |
| Bieglers Plädoyer | 74:25–82:44 | 81–84 |
| Letztes Wort und Entscheidungspause | 82:44–83:07,84 | 84–85 |
| Freispruch | 83:07,84–88:34,8 | 91–93 |
| Verurteilung | 88:34,8–92:48,5 | 87–90 |

Die beiden Urteile stehen in der Filmdatei in umgekehrter Reihenfolge zum Buch. Die Entscheidungspause endet vor der ersten Titelkarte. Die Urteilsabschnitte beginnen jeweils mit ihrer Titelkarte. Der Szenenpfad endet nach der mündlichen Schliessung der Verhandlung, nicht erst am Ende der gesamten Datei.

Die Seitenzahlen zählen die **103 PDF-Seiten** von *Terror. Ein Theaterstück und eine Rede*, btb, Neuausgabe 2016, eISBN 978-3-641-20329-0. Überlappungen entstehen, weil Dialogabschnitte teilweise auf derselben Buchseite wechseln. Die Filmfassung verändert einzelne Angaben, Dialoge und Abläufe; die Zuordnung behauptet keine wortgetreue Übereinstimmung.

Die Station **Dramenform** ist ein Vergleich mehrerer Szenen. Die **Rede auf Charlie Hebdo** (PDF 95–103) hat keine Entsprechung im Film und erhält deshalb keinen erfundenen Clip.

## Bedienung und Speicherung

- Die Szenenleiste öffnet Filmabschnitt, PDF-Seite und passende Analyseaufträge gemeinsam.
- Der Film wird erst nach einer bewussten Auswahl geladen. Nach einem Szenenwechsel steht er am Kapitelanfang bereit; er startet nicht ungefragt.
- Der Kapitelregler und die Wiedergabebegrenzung halten den Player im gewählten Abschnitt. Die native Videoleiste zeigt weiterhin die Laufzeit der zugrunde liegenden Gesamtdatei.
- Die PDF wird einmal lokal gewählt. Optional merkt sich der Browser diese Datei in IndexedDB. «PDF entfernen» entfernt die lokale Kopie; das Journal bleibt bestehen.
- PDF-Zoom und Seitenwahl ermöglichen auch den Vergleich mit angrenzenden Stellen. «Textstelle» kehrt zum Anfang der aktuellen Passage zurück.
- Einzelantworten, Filmbeobachtungen und die bisherige zusammenhängende Analyse bleiben im bestehenden Journal. Sie können als Text oder JSON exportiert werden.

## Prüfung

Syntaxprüfung aller eigenen JavaScript-Dateien; `node check.cjs` prüft 48 Ansichten, Inhaltsverweise, Szenengrenzen, Zuordnung der Urteilsfassungen und das Exportformat. Im Browser geprüft: Dropbox-Wiedergabe, Szenenwechsel, Begrenzung am Szenenende, PDF-Darstellung, Wiederherstellung nach Neuladen, Seitenwechsel, Zoom, Aufgabenwechsel und Antwortspeicherung sowie schmales Layout ohne horizontales Überlaufen der Seite.
