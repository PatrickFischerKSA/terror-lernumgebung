# Zweiten Lehrercomputer unter Windows einrichten

Der Windows-PC kann zusätzlich zum Mac oder allein arbeiten. Die Schüler verwenden weiterhin denselben Spielraum. Kein kostenpflichtiger KI-Schlüssel und keine Freigabe von Router- oder Firewall-Ports nötig. Der lokale LM-Studio-Server bleibt auf `127.0.0.1:1234`.

## 1. Voraussetzungen

- Windows mit [LM Studio](https://lmstudio.ai/download), einmal geöffnet.
- [Node.js 24 LTS](https://nodejs.org/) und [Python 3](https://www.python.org/downloads/windows/) mit Python Launcher `py`.
- In einem Terminal einmal `py -3 -m pip install pypdf` ausführen.
- Ein heruntergeladenes Instruct-Modell in LM Studio. Der Mac verwendet Mistral Small 3.2 24B Instruct (2506). Es benötigt erheblich RAM/VRAM; ein kleineres Instruct-Modell kann gewählt werden. Es muss strukturierte JSON-Antworten und 16.384 Kontexttokens unterstützen. Qualität und Geschwindigkeit hängen vom Modell und PC ab. Es wird kein Modell automatisch heruntergeladen.
- Die originale 103-seitige Terror-PDF und Argumentationslehre.pdf lokal auf dem Windows-PC. Andere PDF-Ausgaben verschieben die Belegseiten und sind hierfür ungeeignet.

## 2. Installieren

Das Paket **terror-bibliothek-windows.zip** herunterladen, vollständig entpacken und im Unterordner `library` **Einrichten-Windows.cmd** doppelklicken. Alternativ im entpackten Hauptordner `py -3 library/install-windows.py` ausführen.

Das Programm fragt nach:

1. Dem Verbindungsschlüssel des bestehenden Spielraums. Er steht auf dem Mac in `~/Library/Application Support/TerrorRichterbibliothek/library/private/config.json` im Feld `secret`. Nur der verantwortlichen zweiten Lehrperson über einen privaten, vertrauenswürdigen Weg geben; niemals in GitHub, Unterrichtschats oder Screenshots veröffentlichen. Dieser Schlüssel erlaubt den Zugriff auf die Beratungswarteschlange aller Räume; beide Lehrercomputer gehören damit zum selben Vertrauensbereich.
2. Einer vorhandenen Modellkennung aus `lms ls` und gegebenenfalls dem Pfad zu `lms.exe`.
3. Den beiden lokalen PDF-Dateien. Der Index wird auf dem Windows-PC erstellt.
4. Optionalem Start bei der Windows-Anmeldung.

Die Installation liegt unter `%LOCALAPPDATA%\TerrorRichterbibliothek`. Private Daten werden per Windows-Dateiberechtigungen auf das angemeldete Konto und SYSTEM begrenzt. Kein Administratorkonto nötig. Es wird keine Windows-Ausführungsrichtlinie geändert.

Falls Windows oder Schulrichtlinien die Ausführung blockieren, die Schul-IT mit der Installation beauftragen; Sicherheitswarnungen nicht umgehen.

## 3. Starten und prüfen

`%LOCALAPPDATA%\TerrorRichterbibliothek\Bibliothek-starten.cmd` doppelklicken und das Fenster offen lassen. Ein Fenster pro Computer genügt. LM Studio lädt das gewählte Modell, danach erscheint „Richterbibliothek gestartet“. Im Spielraum als Vorsitz unter **LM-Bibliothek** steht die Zahl der verbundenen Bibliothekscomputer.

Eine kurze Frage stellen, etwa „Was belegt Meisers SMS?“. Die Antwort muss nach der Modellberechnung mit Fundstellen eintreffen. Für den Ersatzbetrieb den Mac-Dienst stoppen und nach etwa 45 Sekunden nochmals eine Frage stellen. Antworten und Fundstellen fachlich prüfen: Ein kleineres Modell kann deutlich mehr Fehler machen.

Beenden mit **Strg+C** im Bibliotheksfenster. Das Modell bleibt in LM Studio geladen. Zum Abschalten des Autostarts `shell:startup` im Windows-Ausführen-Dialog öffnen und nur `Terror-Richterbibliothek.cmd` entfernen. Keine anderen Einträge ändern. Die privaten Daten bleiben erhalten.

## 4. Zwei Computer, eine Rechtslage

Der Mac veröffentlicht standardmässig die zentrale fiktive Spielregel. Windows hat `publishPolicy: false` und übernimmt die im Server gespeicherte Regel jeder Frage. Sie bleibt gültig, wenn der Mac ausgeschaltet ist. Bei einer dauerhaften Übergabe an Windows die aktuelle `policy.json` privat übertragen, auf dem Mac `publishPolicy` auf `false` und auf Windows auf `true` setzen, dann Dienste neu starten. Nur EIN Computer soll die Regel veröffentlichen. `rubric.json` sollte auf beiden Computern übereinstimmen.

Jeder Rechner besitzt eine eigene `bridgeId`. Gleichzeitige Abrufe werden im Backend transaktional koordiniert. Jede Frage wird zunächst genau einem Rechner zugeteilt. Fällt dieser aus, darf nach fünf Minuten ein anderer übernehmen; verspätete Ergebnisse der alten Zuteilung werden verworfen. Beide können unterschiedliche Fragen gleichzeitig bearbeiten. Ein offline gemeldeter Rechner schaltet einen weiterhin verbundenen Rechner nicht ab.

## 5. Aktualisieren und Grenzen

Vor dem Aktualisieren das Bibliotheksfenster schliessen. Neues Paket entpacken und Einrichtung erneut ausführen. Modellwahl kann geändert werden; vorhandene private Daten, PDF-Index und Verbindungsschlüssel bleiben erhalten. Für neue PDF-Dateien den Index bewusst mit `index-pdf.py` neu erzeugen.

Die Windows-Skripte wurden hier auf macOS erstellt und auf Syntax sowie gemeinsame Programmlogik geprüft. Ein echter Windows-Installationslauf bleibt auf dem zweiten Computer erforderlich. macOS-Livebetrieb und Mehrcomputer-Warteschlange werden getrennt getestet.

Technische Referenzen: [LM-Studio-CLI](https://lmstudio.ai/docs/cli), [lokaler API-Server](https://lmstudio.ai/docs/developer/core/server).
