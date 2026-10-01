# Zweiten Lehrercomputer unter macOS einrichten

Dieser Mac kann zusätzlich zum bisherigen Lehrercomputer oder als Ersatz dieselbe Bibliothek bedienen. Der bisherige Mac muss dafür nicht laufen. Die bereits im Server hinterlegte fiktive Spielregel bleibt gültig. Neue Computer verändern diese Regel standardmässig nicht.

## Voraussetzungen

- [LM Studio](https://lmstudio.ai/download), einmal geöffnet, mit einem lokal heruntergeladenen Instruct-Modell.
- [Node.js 24 LTS](https://nodejs.org/) und [Python 3](https://www.python.org/downloads/macos/).
- Die originale 103-seitige Terror-PDF und Argumentationslehre.pdf auf diesem Mac. Andere Ausgaben haben andere Belegseiten und sind hierfür ungeeignet.
- Der private Verbindungsschlüssel der bestehenden Bibliothek, vertraulich von der verantwortlichen Lehrperson übergeben. Er steht auf dem bisherigen Mac in `~/Library/Application Support/TerrorRichterbibliothek/library/private/config.json` im Feld `secret`. Niemals auf GitHub, in Unterrichtschats oder in Screenshots veröffentlichen. Beide Rechner erhalten damit Zugang zur Beratungswarteschlange aller Räume und gehören zum selben Vertrauensbereich.

## Einrichtung

1. **terror-bibliothek-mac.zip** herunterladen und vollständig entpacken.
2. Im Terminal in den entpackten Hauptordner wechseln. Darin diese Befehle ausführen:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install pypdf
.venv/bin/python library/install-mac.py
```

Die isolierte Python-Umgebung vermeidet Änderungen an der systemweiten Python-Installation. Nach den ersten beiden Befehlen ist auch `library/Einrichten-Mac.command` als Einstieg verfügbar. Falls macOS oder Schulrichtlinien die Ausführung blockieren, die Schul-IT hinzuziehen; Sicherheitswarnungen nicht umgehen.

3. Den privaten Schlüssel eingeben (unsichtbare Eingabe), ein vorhandenes Modell aus der angezeigten Liste wählen und die beiden PDF-Pfade eingeben. Pfade mit Leerzeichen sind erlaubt; am besten über Finder → Informationen den tatsächlichen Pfad übernehmen, ohne Shell-Escapes einzutippen.
4. Entscheiden, ob die Bibliothek sofort und bei jeder Anmeldung automatisch starten soll. Sonst wird ein manuelles Startskript vorbereitet.

Der Hauptcomputer nutzt Mistral Small 3.2 24B Instruct (2506). Je nach Mac kann ein kleineres Instruct-Modell gewählt werden. Es muss strukturierte JSON-Antworten und 16.384 Kontexttokens unterstützen; Qualität und Geschwindigkeit hängen vom Modell und Rechner ab. Es wird kein Modell automatisch heruntergeladen. Die aktuelle Hardware-Unterstützung steht beim [LM-Studio-Download](https://lmstudio.ai/download).

## Betrieb und Kontrolle

Installation: `~/Library/Application Support/TerrorRichterbibliothek/`.

Ohne Autostart: `Bibliothek-starten.command` in diesem Ordner öffnen und das Fenster offen lassen. Mit **Strg+C** beenden. Nur einen Dienst bzw. ein manuelles Fenster betreiben. Mit Autostart wird kein zusätzliches manuelles Fenster benötigt.

Im Spielraum als Vorsitz den Reiter **LM-Bibliothek** öffnen. Dort steht die Zahl der verbundenen Bibliothekscomputer. Eine kurze Frage, etwa „Was belegt Meisers SMS?“, stellen und Antwort und Fundstellen prüfen. Für den Ersatzbetrieb den bisherigen Dienst stoppen, etwa 45 Sekunden warten und erneut fragen. Der neue Mac muss angemeldet, wach und online bleiben.

```sh
# Autostart-Dienst prüfen
launchctl print gui/$(id -u)/ch.patrickfischer.terror-richterbibliothek
# Dienst stoppen
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/ch.patrickfischer.terror-richterbibliothek.plist
# Wieder starten
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/ch.patrickfischer.terror-richterbibliothek.plist
```

Dauerhaft ohne Autostart: Nach dem Stoppen nur die genannte plist aus `~/Library/LaunchAgents` entfernen. Andere Dienste unverändert lassen. Das LM-Studio-Modell bleibt beim Stoppen geladen und kann in LM Studio entladen werden. Protokolle stehen im Installationsordner unter `library/private/service.log` und `service-error.log`; sie enthalten keine Fragen oder Antworten.

## Gemeinsame Regeln und Updates

Jeder neue Mac erhält eine eigene `bridgeId` und `publishPolicy: false`. Er verarbeitet die zentrale Spielregel, die mit jeder Frage geliefert wird. Nur ein Hauptcomputer sollte `publishPolicy: true` haben. Bei einer dauerhaften Übergabe zuerst dessen aktuelle `policy.json` übertragen, den bisherigen Hauptcomputer auf `false` und den neuen auf `true` setzen und die Dienste neu starten. `rubric.json` sollte auf allen Rechnern übereinstimmen.

Für ein Update zuerst den Dienst stoppen, das neue Paket entpacken und die Einrichtung erneut ausführen. Bestehender Schlüssel, Rechnerkennung, lokale PDFs, Index und angepasste Spielregeln bleiben erhalten. Auch eine bereits bestehende Hauptcomputer-Rolle wird nicht stillschweigend geändert.

Die gemeinsame macOS-Laufzeit ist auf dem bisherigen Lehrercomputer erprobt. Der Assistent für einen zusätzlichen Mac wurde separat mit simulierten Eingaben und isolierten Dateien geprüft; ein vollständiger Erstinstallationslauf auf dem Zielcomputer bleibt erforderlich.
