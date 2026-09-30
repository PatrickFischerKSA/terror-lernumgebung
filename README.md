# TERROR · Urteilen lernen

Offene Selbstlernumgebung für die gymnasiale Oberstufe zu Ferdinand von Schirachs *Terror*. Erstellt am 30. September 2026.

## Start

**Website:** https://patrickfischerksa.github.io/terror-lernumgebung/

**Repository:** https://github.com/PatrickFischerKSA/terror-lernumgebung

`dist/index.html` direkt im Browser öffnen oder den Ordner `dist` als statische Website bereitstellen. Für zuverlässige Speicherung einen normalen Browser und eine feste Webadresse verwenden. Externe Videos benötigen Internetzugang und werden erst nach Klick geladen.

## Inhalte

- 12 Lektürestationen mit PDF-Seitenverweisen, Aufgaben, zwei Hilfestufen und Reflexionsrastern
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

Keine Buch-PDF oder Filmkopie wird mit der Website verbreitet. Die bereitgestellten Quellen wurden für Aufgaben und Seitenverweise ausgewertet. Originale können lokal im Browser geöffnet werden. Die Filmstellen sind nicht vorgetäuscht: Nutzende setzen ihre Zeitmarken passend zur vorhandenen Fassung selbst.

Offene Texte werden nicht automatisch bewertet. Die Website enthält keine KI-API, keine Klassenkonten, keine zentrale Lernstandserfassung und keine Live-Abstimmung. Notizen bleiben im Browser. Externe Seiten und Videodienste können eigene Zugangsbedingungen haben.

## Inhaltliche Orientierung

Moralische Bewertung, literarische Interpretation und rechtliche Prüfung werden getrennt. Der Fall ist im deutschen Recht verortet; ein eigener Vergleichsauftrag behandelt die Schweizer Bundesverfassung. Staatsrechtliche Befugnis, Rechtfertigung, Entschuldigung und Strafzumessung sind nicht austauschbar. Die Lernkarten vereinfachen für die Sekundarstufe II und verlinken zur Vertiefung.

## Veröffentlichung und Prüfung

Änderungen auf `main` werden automatisch geprüft und aus `dist` mit GitHub Actions auf GitHub Pages veröffentlicht. Die Website benötigt keinen Server und keine API-Schlüssel.

Lokale Prüfung: `node check.cjs`. Der Check prüft die 48 Ansichten, Inhaltsverweise, Simulationsschritte, Zeitangaben und das JSON-Exportformat.

Beim Wechsel von einer anderen Webadresse werden lokale Journale nicht automatisch übertragen. Exportiere dort eine JSON-Sicherung und importiere sie unter „Mein Journal“ auf dieser Website.
