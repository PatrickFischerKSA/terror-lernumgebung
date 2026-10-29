const STORAGE_KEY = 'terror-lernumgebung-urteil-duell-v1';

const MODE_CARDS = [
  {
    id: 'verdict',
    title: 'Urteilsweg',
    text: '10 Einzelfragen führen zur Schlussabstimmung, ohne die Urteilsfrage vorwegzunehmen.'
  },
  {
    id: 'duel',
    title: 'Argumente-Pingpong',
    text: 'Zwei Personen spielen sieben Runden mit lokalem Regel-Schiedsrichter.'
  }
];

const TROLLEY_VIDEO_LINK = 'https://www.dropbox.com/scl/fi/0q2zm7rgr03b7l9bz133z/STRASSENBAHN-das-philosophische-Gedankenexperiment-filosofix.mp4?rlkey=oh1qz7n1nhgq0kcuu8jpgipt2&st=1pr1uosz&dl=0';
const TROLLEY_VIDEO_EMBED = 'https://www.dropbox.com/scl/fi/0q2zm7rgr03b7l9bz133z/STRASSENBAHN-das-philosophische-Gedankenexperiment-filosofix.mp4?rlkey=oh1qz7n1nhgq0kcuu8jpgipt2&st=1pr1uosz&raw=1';

const PREP_MODULES = [
  {
    id: 'video',
    title: '1. Trolleyproblem ansehen',
    kind: 'video',
    text: 'Das Video öffnet den Kernkonflikt des ganzen Projekts: Darf man aktiv eingreifen, wenn dadurch wenige sterben, aber viele gerettet werden?',
    bullets: [
      'Leitfrage 1: Ist Nicht-Handeln wirklich neutral oder auch schon eine Entscheidung?',
      'Leitfrage 2: Ändert sich moralisch etwas, wenn ich aktiv umstelle oder aktiv abschieße?',
      'Leitfrage 3: Wo wird aus Rettungslogik eine Grenzverletzung?'
    ],
    tags: ['Video', 'Trolleyproblem', 'Einstieg', 'Leben gegen Leben']
  },
  {
    id: 'util',
    title: '2. Utilitarismus kurz erklärt',
    text: 'Utilitaristisches Denken fragt zuerst nach den Folgen: Welche Handlung verringert insgesamt Leid oder rettet mehr Menschen? Im Fall Koch klingt diese Linie oft so: 164 sterben, aber 70 000 werden gerettet.',
    bullets: [
      'Typische Frage: Welche Option hat die besseren Folgen für möglichst viele?',
      'Typischer Satz: Das kleinere Übel muss gewählt werden.',
      'Risiko: Menschen werden zu schnell zu Zahlen oder bloßen Rechenposten.'
    ],
    tags: ['Folgen', 'kleineres Übel', 'Rettungslogik', '70 000 vs. 164']
  },
  {
    id: 'deon',
    title: '3. Deontologie kurz erklärt',
    text: 'Deontologisches Denken fragt zuerst nach Grenze, Würde und Pflicht. Im Fall Koch klingt diese Linie oft so: Unschuldige dürfen nicht absichtlich geopfert und als Mittel benutzt werden, auch dann nicht, wenn damit viele andere gerettet werden sollen.',
    bullets: [
      'Typische Frage: Gibt es eine Grenze, die auch im Extremfall nicht fällt?',
      'Typischer Satz: Menschen dürfen nicht bloßes Mittel sein.',
      'Risiko: Die Position wirkt hart, weil sie extreme Folgen des Unterlassens aushalten muss.'
    ],
    tags: ['Pflicht', 'Würde', 'Grenze', 'bloßes Mittel']
  },
  {
    id: 'inference',
    title: '4. Arten des Schlussfolgerns',
    text: 'Im Spiel zählt nicht nur, was ihr denkt, sondern wie ihr vom Argument zur Schlussfolgerung kommt. Die App achtet deshalb ausdrücklich auf Schlussformen.',
    bullets: [
      'Deduktion: Wenn die Menschenwürde absolut gilt, dann folgt daraus ein Verbot.',
      'Abduktion: Aus Kurs, Funkmeldung und Zeitdruck wird auf den wahrscheinlichsten Ausgang geschlossen.',
      'Analogie: Fälle wie Schiffbruch, Organtransplantation oder Weichensteller werden herangezogen.',
      'Warnung: Achtet auf Fehlschlüsse wie falsches Dilemma, slippery slope oder ad hominem.'
    ],
    tags: ['Deduktion', 'Abduktion', 'Analogie', 'Fehlschlüsse']
  }
];

const VERDICT_QUESTIONS = [
  {
    id: 'fact_anchor',
    stage: 'Tatgeschehen',
    title: '1. Welcher Ausgangspunkt trägt eure weitere Prüfung am stärksten?',
    prompt: 'Bevor ihr überhaupt normativ urteilt, müsst ihr festlegen, welches Faktum in eurem Kopf an erster Stelle stehen soll.',
    why: 'Schon der gewählte Einstieg verschiebt die ganze Schlusskette: Schaut ihr zuerst auf die getöteten Passagiere, auf die geretteten Stadionbesucher oder auf die Krisensituation?',
    options: [
      {
        id: 'killed_as_means',
        label: 'Koch tötete 164 Unschuldige bewusst als Mittel, um andere zu retten.',
        summary: 'Dieser Startpunkt legt den Fokus auf die aktiv getöteten Passagiere.',
        inference: 'Deduktive Grenzprüfung',
        logicNote: 'Wenn absichtliche Tötung Unschuldiger den Kern bildet, wird später eher nach einer unüberschreitbaren Grenze gefragt.',
        warning: 'Achtung: Wer nur diesen Startpunkt sieht, blendet leicht die reale Bedrohung des Stadions aus.',
        weights: { convict: 3, acquit: 0 },
        trace: 'Ihr habt das Tatgeschehen zuerst als bewusste Tötung Unschuldiger gerahmt. Das verstärkt später die Verurteilungsseite.'
      },
      {
        id: 'mass_attack_prevented',
        label: 'Koch verhinderte einen fast sicheren Massenanschlag auf 70 000 Menschen.',
        summary: 'Dieser Startpunkt legt den Fokus auf die verhinderte Katastrophe.',
        inference: 'Abduktive Rettungslogik',
        logicNote: 'Von der drohenden Wirkung her denkt ihr auf die plausibelste Rettungsreaktion zurück.',
        warning: 'Achtung: Wer nur auf die gerettete Menge blickt, kann zu schnell Leben gegen Leben verrechnen.',
        weights: { convict: 0, acquit: 3 },
        trace: 'Ihr habt den Fall zuerst als verhinderte Massenkatastrophe gelesen. Das stärkt später die Freispruchsseite.'
      },
      {
        id: 'crisis_decision',
        label: 'Koch musste in einer extremen Krisenlage unter Zeitdruck allein entscheiden.',
        summary: 'Dieser Startpunkt richtet den Blick auf Druck, Unsicherheit und Verantwortung.',
        inference: 'Praktischer Schluss',
        logicNote: 'Ihr prüft erst die Handlungssituation und noch nicht sofort die letzte Norm.',
        warning: 'Achtung: Diese Mitte wirkt fair, kann aber später unklar bleiben, wenn keine schärfere Regel folgt.',
        weights: { convict: 1, acquit: 1 },
        trace: 'Ihr habt die Handlungssituation selbst ins Zentrum gestellt. Das hält beide Urteilslinien zunächst offen.'
      }
    ]
  },
  {
    id: 'court_focus',
    stage: 'Prüfauftrag',
    title: '2. Was muss ein Gericht nach den Fakten als Nächstes am strengsten prüfen?',
    prompt: 'Das Gericht prüft nicht alles gleichzeitig. Es ordnet. Wofür soll eure Prüfung zuerst die schärfste Sprache finden?',
    why: 'Hier entscheidet sich, ob ihr eher Nelsons Verfassungsgrenze, Bieglers kleinere-Übel-Logik oder eine doppelte Prüfung verfolgt.',
    options: [
      {
        id: 'absolute_boundary',
        label: 'Ob eine absolute Grenze verletzt wurde, die auch im Extremfall nicht fallen darf.',
        summary: 'Ihr prüft zuerst die verfassungsrechtliche Grenze.',
        inference: 'Deduktion',
        logicNote: 'Wenn die Grenze absolut ist, folgt das Urteil später strenger aus der Norm.',
        warning: 'Achtung: Diese Sicht kann reale Ausnahmezwänge zu schnell aus dem Fall drücken.',
        weights: { convict: 3, acquit: 0 },
        trace: 'Ihr habt den gerichtlichen Fokus zuerst auf eine absolute Grenze gesetzt. Das zieht die Schlusslinie eher zur Verurteilung.'
      },
      {
        id: 'lesser_evil',
        label: 'Ob in dieser Lage das objektiv kleinere Übel gewählt wurde.',
        summary: 'Ihr prüft zuerst Rettungslogik und Schadensvergleich.',
        inference: 'Abwägender praktischer Schluss',
        logicNote: 'Die spätere Schlussfolgerung hängt dann stärker an Folgen und Schaden.',
        warning: 'Achtung: Diese Sicht gerät in Gefahr, Menschen nur noch als Zahlen zu lesen.',
        weights: { convict: 0, acquit: 3 },
        trace: 'Ihr habt die Prüfung zuerst auf das kleinere Übel gerichtet. Das stärkt die spätere Freispruchsrichtung.'
      },
      {
        id: 'double_check',
        label: 'Ob Grenzverletzung und Rettungslogik nacheinander geprüft werden müssen.',
        summary: 'Ihr wollt weder Grenze noch Folgen sofort ausblenden.',
        inference: 'Stufenprüfung',
        logicNote: 'Die Schlussfolgerung entsteht hier nicht in einem einzigen Sprung, sondern in einer Abfolge.',
        warning: 'Achtung: Diese Antwort bleibt nur tragfähig, wenn ihr später tatsächlich entscheidet, was Vorrang hat.',
        weights: { convict: 1, acquit: 1 },
        trace: 'Ihr habt eine doppelte Prüfung gewählt. Das hält den Weg offen, zwingt euch aber später zu klarer Priorität.'
      }
    ]
  },
  {
    id: 'danger_certainty',
    stage: 'Gefahrenlage',
    title: '3. Wie sicher bewertet ihr die Gefahr für das Stadion?',
    prompt: 'Jetzt müsst ihr festlegen, wie stark ihr auf die Wahrscheinlichkeit des Einschlags vertraut.',
    why: 'Gerade die Schlussreden und die beiden Urteile drehen sich darum, ob man mit Fakten oder mit Restwundern rechnen darf.',
    options: [
      {
        id: 'almost_certain',
        label: 'Die Gefahr war praktisch unmittelbar; mit einem Wunder durfte nicht gerechnet werden.',
        summary: 'Ihr folgt eher Bieglers und Kochs Faktenlogik.',
        inference: 'Abduktion aus Lage und Verhalten des Terroristen',
        logicNote: 'Aus Kurs, Funkmeldung und Zeitlage wird auf den wahrscheinlichsten Ausgang geschlossen.',
        warning: 'Achtung: Wahrscheinlich heißt nicht automatisch sicher genug für eine Tötungsbefugnis.',
        weights: { convict: 0, acquit: 3 },
        trace: 'Ihr behandelt den Einschlag als praktisch unmittelbar. Dadurch wächst die Freispruchsseite.'
      },
      {
        id: 'relevant_doubt',
        label: 'Es blieb ein relevanter Restzweifel; genau deshalb wiegt die Tötung besonders schwer.',
        summary: 'Ihr stärkt den Gedanken, dass Unsicherheit gegen aktives Töten spricht.',
        inference: 'Modus tollens ähnlicher Grenzschluss',
        logicNote: 'Wenn sichere letzte Tatsachen fehlen, soll die extremste Handlung gerade nicht folgen.',
        warning: 'Achtung: Wer zu hohe Sicherheit verlangt, macht Handeln in Extremfällen fast unmöglich.',
        weights: { convict: 3, acquit: 0 },
        trace: 'Ihr nehmt den Restzweifel ernst und lasst ihn gegen aktives Töten arbeiten. Das stärkt die Verurteilungsseite.'
      },
      {
        id: 'serious_not_absolute',
        label: 'Die Gefahr war sehr ernst, aber nicht mathematisch sicher.',
        summary: 'Ihr anerkennt die Bedrohung, ohne sie absolut zu setzen.',
        inference: 'Wahrscheinlichkeitsschluss',
        logicNote: 'Diese Antwort hält den Fall in einer tragischen Grauzone.',
        warning: 'Achtung: Diese Mitte ist nur tragfähig, wenn ihr später sagt, wie viel Unsicherheit der Staat aushalten muss.',
        weights: { convict: 1, acquit: 2 },
        trace: 'Ihr seht eine hoch ernste, aber nicht absolute Gefahr. Das gibt der Freispruchsseite etwas Rückenwind, lässt aber Zweifel stehen.'
      }
    ]
  },
  {
    id: 'alternatives',
    stage: 'Alternativen',
    title: '4. Wie geht ihr mit möglichen milderen Mitteln um?',
    prompt: 'Hier prüft ihr, ob Koch wirklich vor einer letzten Entscheidung stand oder ob andere Wege noch ernsthaft offen waren.',
    why: 'Sobald echte Alternativen offen bleiben, wirkt ein Abschuss anders, als wenn die Zeitlage alle anderen Wege fast geschlossen hat.',
    options: [
      {
        id: 'no_real_alternative',
        label: 'Es gab in der verbleibenden Zeit keine realistische Alternative mehr.',
        summary: 'Ihr vertraut auf Zeitdruck und die knappe operative Lage.',
        inference: 'Praktischer Notlagenschluss',
        logicNote: 'Wenn alle milderen Mittel faktisch ausfallen, gewinnt die äußerste Handlung an Plausibilität.',
        warning: 'Achtung: Das darf nicht bloß behauptet werden; es braucht eine belastbare Lageannahme.',
        weights: { convict: 0, acquit: 3 },
        trace: 'Ihr verneint realistische mildere Mittel. Damit wird der Abschuss eher als letzte verbleibende Option lesbar.'
      },
      {
        id: 'alternatives_not_closed',
        label: 'Solange mildere Mittel nicht sicher ausgeschlossen sind, darf nicht getötet werden.',
        summary: 'Ihr lasst die Unsicherheit zugunsten der Passagiere wirken.',
        inference: 'Grenzschluss mit Vorsichtsregel',
        logicNote: 'Wenn die äußerste Maßnahme nicht alternativlos ist, verliert sie ihre Rechtfertigung.',
        warning: 'Achtung: Diese Regel setzt sehr hohe Anforderungen und kann spätere Katastrophen kaum noch abfangen.',
        weights: { convict: 3, acquit: 0 },
        trace: 'Ihr verlangt den sicheren Ausschluss milderer Mittel. Das drückt die Schlusslinie in Richtung Verurteilung.'
      },
      {
        id: 'alternatives_thin',
        label: 'Es gab denkbare Alternativen, aber keine davon war noch belastbar genug.',
        summary: 'Ihr trennt zwischen theoretisch denkbar und praktisch tragfähig.',
        inference: 'Abwägender Wahrscheinlichkeitsvergleich',
        logicNote: 'Die Frage lautet hier nicht: Was war denkbar? Sondern: Was war noch ernsthaft tragfähig?',
        warning: 'Achtung: Diese Antwort ist plausibel, aber sie braucht später eine klare Grenze gegen bloße Zweckrechnung.',
        weights: { convict: 1, acquit: 2 },
        trace: 'Ihr unterscheidet zwischen denkbaren und tragfähigen Alternativen. Das stützt eher die Freispruchsseite, aber nicht vorbehaltlos.'
      }
    ]
  },
  {
    id: 'dignity',
    stage: 'Menschenwürde',
    title: '5. Was bedeutet die Menschenwürde in diesem Fall für euch am stärksten?',
    prompt: 'Jetzt kommt der härteste Normpunkt des ganzen Stücks.',
    why: 'Nelson und das Verurteilungsurteil bestehen darauf, dass Menschen nicht zum Mittel gemacht werden dürfen. Die Gegenseite versucht, genau diese Grenze gegen die Rettung vieler Menschen zu verschieben.',
    options: [
      {
        id: 'means_forbidden',
        label: 'Menschenwürde verbietet, Unschuldige als bloßes Mittel zu opfern.',
        summary: 'Die Passagiere dürfen nicht zur Rettungsmasse werden.',
        inference: 'Deduktiver Normschluss',
        logicNote: 'Wenn Würde absolut wirkt, folgt daraus ein Verbot der aktiven Opferung.',
        warning: 'Achtung: Diese Strenge wirkt hart, gerade weil sie Rettungswünsche zurückweist.',
        weights: { convict: 4, acquit: 0 },
        trace: 'Ihr versteht Menschenwürde als Sperre gegen das Instrumentalisieren der Passagiere. Das ist ein sehr starkes Argument für Verurteilung.'
      },
      {
        id: 'dignity_protects_many',
        label: 'Menschenwürde schützt auch die 70 000 im Stadion und drängt auf Rettung.',
        summary: 'Ihr lest Würde als Schutzauftrag für die Vielen.',
        inference: 'Analoger Schutzschluss',
        logicNote: 'Ihr übertragt den Würdeschutz von den Passagieren auf die bedrohten Stadionbesucher.',
        warning: 'Achtung: Diese Übertragung kann kippen, wenn sie stillschweigend doch wieder Leben gegen Leben aufrechnet.',
        weights: { convict: 0, acquit: 3 },
        trace: 'Ihr lest Menschenwürde auch als Schutzauftrag für die 70 000. Das stärkt die Freispruchsseite deutlich.'
      },
      {
        id: 'dignity_collision',
        label: 'Hier kollidieren Würde und Rettungspflicht tragisch miteinander.',
        summary: 'Ihr weigert euch, die Kollision sofort aufzulösen.',
        inference: 'Konfliktschluss',
        logicNote: 'Diese Antwort hält zwei starke Normen gleichzeitig im Raum.',
        warning: 'Achtung: Wer die Kollision nur benennt, muss später trotzdem entscheiden, welche Regel handeln darf.',
        weights: { convict: 2, acquit: 1 },
        trace: 'Ihr seht eine echte Kollision zwischen Würde und Rettung. Das gibt der Verurteilungsseite etwas mehr Gewicht, aber nicht eindeutig.'
      }
    ]
  },
  {
    id: 'life_weighing',
    stage: 'Abwägung',
    title: '6. Wie steht ihr zur Formel „wenige töten, viele retten“?',
    prompt: 'Hier wird das Trolleyproblem direkt juristisch scharf.',
    why: 'Genau an dieser Stelle prallen utilitaristische und deontologische Linien frontal aufeinander.',
    options: [
      {
        id: 'no_weighing',
        label: 'Gerade diese Abwägung markiert die Grenze: Leben darf nicht verrechnet werden.',
        summary: 'Ihr folgt der harten Linie gegen jede Zahlenschlusslogik.',
        inference: 'Deduktive Verbotsschlussform',
        logicNote: 'Wenn Leben nicht gegeneinander verrechnet werden darf, darf die Zahlenlogik nicht entscheiden.',
        warning: 'Achtung: Diese Position verlangt, das Unterlassen schwerer Folgen auszuhalten.',
        weights: { convict: 4, acquit: 0 },
        trace: 'Ihr lehnt die Zahlenlogik selbst als Grenzbruch ab. Das treibt den Weg stark in Richtung Verurteilung.'
      },
      {
        id: 'lesser_evil_choice',
        label: 'Im Extremfall muss das objektiv kleinere Übel gewählt werden.',
        summary: 'Ihr folgt der Linie des kleineren Übels.',
        inference: 'Praktischer Abwägungsschluss',
        logicNote: 'Wenn beide Wege tödlich sind, soll der Weg mit weniger Opfern gewählt werden.',
        warning: 'Achtung: Diese Regel kann gefährlich werden, wenn sie zu schnell zur allgemeinen Staatslogik wird.',
        weights: { convict: 0, acquit: 4 },
        trace: 'Ihr nehmt das kleinere Übel als Leitregel. Das stärkt den Freispruch deutlich.'
      },
      {
        id: 'only_under_extreme_conditions',
        label: 'Eine solche Abwägung dürfte höchstens unter extremsten Bedingungen überhaupt erwogen werden.',
        summary: 'Ihr öffnet keinen Normalfall, sondern einen fast gesperrten Grenzfall.',
        inference: 'Konditionaler Ausnahmeschluss',
        logicNote: 'Ihr lasst die Abwägung nicht frei, sondern bindet sie an außergewöhnliche Bedingungen.',
        warning: 'Achtung: Diese Lösung wirkt vernünftig, bleibt aber rechtlich unsauber, wenn die Bedingungen unklar bleiben.',
        weights: { convict: 2, acquit: 2 },
        trace: 'Ihr akzeptiert die kleinere-Übel-Logik nur für einen engen Grenzfall. Beide Urteilsrichtungen gewinnen dadurch Stoff.'
      }
    ]
  },
  {
    id: 'conscience',
    stage: 'Gewissen',
    title: '7. Wie bewertet ihr Kochs persönliche Gewissensentscheidung?',
    prompt: 'Das Stück drängt euch hier weg von bloßem Sympathisieren und hin zur Frage nach persönlicher Verantwortung.',
    why: 'Der Freispruch sieht Koch als tragisch allein gelassen. Die Verurteilung erkennt seine Ernsthaftigkeit an, will aber keine Schule daraus machen.',
    options: [
      {
        id: 'conscience_not_enough',
        label: 'Sein Gewissen verdient Respekt, ersetzt aber keine Rechtsgrenze.',
        summary: 'Ihr trennt Ernsthaftigkeit von Rechtfertigung.',
        inference: 'Trennschärfender Schluss',
        logicNote: 'Eine gute Absicht macht noch keinen zulässigen Eingriff.',
        warning: 'Achtung: Diese Sicht kann hart erscheinen, obwohl sie die moralische Last Kochs ernst nimmt.',
        weights: { convict: 3, acquit: 0 },
        trace: 'Ihr nehmt Kochs Ernsthaftigkeit wahr, lasst sein Gewissen aber nicht zur Rechtfertigung werden. Das stärkt die Verurteilung.'
      },
      {
        id: 'conscience_last_instance',
        label: 'Sein Gewissen war in dieser Lage die letzte notwendige Instanz.',
        summary: 'Ihr folgt der Idee, dass das Recht ihn in einer unauflösbaren Lage allein ließ.',
        inference: 'Praktischer Gewissensschluss',
        logicNote: 'Wenn institutionelle Regeln versagen, rückt die Einzelentscheidung nach vorne.',
        warning: 'Achtung: Diese Antwort wird heikel, sobald viele Einzelne ihre Gewissensausnahme beanspruchen.',
        weights: { convict: 0, acquit: 3 },
        trace: 'Ihr behandelt Kochs Gewissen als letzte Instanz in der Grenzlage. Das stützt den Freispruch klar.'
      },
      {
        id: 'conscience_strict_review',
        label: 'Sein Gewissen zählt, muss aber nachträglich streng überprüft werden.',
        summary: 'Ihr erkennt Gewissensdruck an, wollt ihn aber nicht unkontrolliert gelten lassen.',
        inference: 'Prüfender Mittelschluss',
        logicNote: 'Gewissen ist hier Anlass zur Prüfung, nicht sofort zur Entlastung.',
        warning: 'Achtung: Diese Antwort verlangt später eine klare Grenze, sonst bleibt sie nur moralisch verständnisvoll.',
        weights: { convict: 2, acquit: 1 },
        trace: 'Ihr nehmt die Gewissensentscheidung ernst, wollt sie aber streng nachprüfen. Das gibt der Verurteilung etwas mehr Gewicht.'
      }
    ]
  },
  {
    id: 'emergency_clause',
    stage: 'Ausnahme',
    title: '8. Wie geht ihr mit dem übergesetzlichen Notstand um?',
    prompt: 'Jetzt müsst ihr entscheiden, ob ihr eine Ausnahme jenseits des geschriebenen Rechts überhaupt zulassen wollt.',
    why: 'Gerade hier greifen politische und philosophische Linien ineinander: Rettungsdrang, Ausnahmezustand und Angst vor einem Staatsbruch.',
    options: [
      {
        id: 'dangerous_exception',
        label: 'Der übergesetzliche Notstand ist eine gefährliche Öffnung jenseits des Rechts.',
        summary: 'Ihr lest die Ausnahme als Risiko für den Rechtsstaat.',
        inference: 'Slippery-slope-wache Gegenregel',
        logicNote: 'Wer Ausnahmen zulässt, muss erklären, warum daraus keine dauerhafte Entgrenzung wird.',
        warning: 'Achtung: Aus der Warnung vor dem Dammbruch darf kein bloßer Fehlschluss werden; sie braucht konkrete Gründe.',
        weights: { convict: 3, acquit: 0 },
        trace: 'Ihr seht den übergesetzlichen Notstand als gefährliche Entgrenzung. Das stützt die Verurteilungsseite.'
      },
      {
        id: 'rare_exception',
        label: 'Er bleibt eine seltene Ausnahmeformel für unlösbare Grenzfälle.',
        summary: 'Ihr erlaubt keinen Alltag, aber einen extremen Ausnahmefall.',
        inference: 'Konditionaler Ausnahmeschluss',
        logicNote: 'Die Ausnahme soll nur dort greifen, wo das Recht keine saubere Lösung mehr liefert.',
        warning: 'Achtung: Je offener die Ausnahmeformel bleibt, desto schwerer wird sie zu kontrollieren.',
        weights: { convict: 0, acquit: 3 },
        trace: 'Ihr haltet einen seltenen Ausnahmeweg offen. Das gibt der Freispruchsseite deutliche Unterstützung.'
      },
      {
        id: 'moral_not_legal',
        label: 'Als moralische Beschreibung mag er taugen, als sichere Rechtsgrundlage nicht.',
        summary: 'Ihr trennt Moralbeschreibung und Rechtsquelle.',
        inference: 'Differenzierungsschluss',
        logicNote: 'Nicht jede starke moralische Intuition ist schon eine tragfähige Rechtsgrundlage.',
        warning: 'Achtung: Diese Lösung wirkt klug, muss aber später trotzdem in ein Urteil übersetzt werden.',
        weights: { convict: 2, acquit: 1 },
        trace: 'Ihr trennt moralische Plausibilität und rechtliche Grundlage. Das gibt der Verurteilung etwas mehr Kraft, ohne den Grenzfall zu leugnen.'
      }
    ]
  },
  {
    id: 'inference_type',
    stage: 'Schlussform',
    title: '9. Welche Schlussform überzeugt euch in diesem Fall am meisten?',
    prompt: 'Jetzt blickt ihr nicht nur auf den Inhalt, sondern auf die Form des Schlusses.',
    why: 'Genau hier greift die Argumentationslehre ein: Deduktion, Abduktion, Analogie und ihre Risiken.',
    options: [
      {
        id: 'deductive_boundary',
        label: 'Der stärkste Schluss ist deduktiv: Wenn die Grenze absolut gilt, folgt daraus das Verbot.',
        summary: 'Ihr gebt der formalen Grenzlogik Vorrang.',
        inference: 'Deduktion',
        logicNote: 'Diese Form ist streng, weil die Konklusion aus der Norm folgen soll.',
        warning: 'Achtung: Deduktion ist nur so stark wie die Prämisse. Wenn die Prämisse umstritten ist, bleibt auch das Ergebnis umstritten.',
        weights: { convict: 3, acquit: 0 },
        trace: 'Ihr traut der deduktiven Grenzlogik am meisten. Das stärkt die Verurteilungslinie.'
      },
      {
        id: 'abductive_rescue',
        label: 'Der stärkste Schluss ist abduktiv: In der Lage war der Abschuss die plausibelste Rettungsreaktion.',
        summary: 'Ihr folgt vom sichtbaren Gefahrenszenario auf die wahrscheinlichste Reaktion.',
        inference: 'Abduktion',
        logicNote: 'Diese Form ist nicht notwendig, aber in Krisen oft handlungsleitend.',
        warning: 'Achtung: Abduktion liefert Plausibilität, nicht Gewissheit. Genau das bleibt ihr Risiko.',
        weights: { convict: 0, acquit: 3 },
        trace: 'Ihr vertraut der abduktiven Rettungslogik. Das stärkt den Freispruch.'
      },
      {
        id: 'careful_analogy',
        label: 'Der Fall lässt sich nur vorsichtig über kleinere-Übel-Analogien erschließen.',
        summary: 'Ihr arbeitet mit Vergleichsfällen wie Schiffbruch oder Grenzfallmedizin, aber mit Vorsicht.',
        inference: 'Analogie',
        logicNote: 'Analoge Schlüsse helfen, bleiben aber immer angreifbar, wenn die Fälle nicht wirklich gleich sind.',
        warning: 'Achtung: Hier droht schnell die falsche Analogie, wenn Unterschiede zu klein geredet werden.',
        weights: { convict: 1, acquit: 2 },
        trace: 'Ihr arbeitet mit vorsichtigen Analogien. Das hilft eher der Freispruchsseite, aber nur begrenzt.'
      }
    ]
  },
  {
    id: 'future_rule',
    stage: 'Zukunftsregel',
    title: '10. Welche Regel soll nach diesem Fall für die Zukunft gelten?',
    prompt: 'Erst jetzt entscheidet ihr darüber, welche Regel euer ganzer Denkweg am Ende erzeugt.',
    why: 'Die Schlussabstimmung ist nie nur ein Rückblick. Sie erzeugt immer auch eine Regel für künftige Grenzfälle.',
    options: [
      {
        id: 'state_never_sacrifices',
        label: 'Der Staat darf niemals aktiv Unschuldige opfern, auch nicht zur Rettung vieler.',
        summary: 'Ihr setzt die härteste Zukunftsgrenze.',
        inference: 'Normativer Deduktionsschluss',
        logicNote: 'Die Zukunftsregel soll verhindern, dass der Staat Menschen zu Rettungsmitteln macht.',
        warning: 'Achtung: Diese Regel verlangt, dass die Gesellschaft auch extreme Folgen des Unterlassens aushält.',
        weights: { convict: 4, acquit: 0 },
        trace: 'Eure Zukunftsregel verbietet aktive Opferung Unschuldiger kategorisch. Damit landet ihr stark bei einer Verurteilung.'
      },
      {
        id: 'state_needs_exception_path',
        label: 'Für absolute Extremfälle braucht der Staat einen begrenzten Ausnahmeweg.',
        summary: 'Ihr fordert eine eng begrenzte Rettungsoption für seltenste Ausnahmefälle.',
        inference: 'Konditionaler Regelungsschluss',
        logicNote: 'Die Zukunftsregel soll nicht Alltag werden, aber extreme Lähmung verhindern.',
        warning: 'Achtung: Ohne enge Schranken droht aus der Ausnahme sehr schnell eine Zwecklogik.',
        weights: { convict: 0, acquit: 4 },
        trace: 'Eure Zukunftsregel öffnet einen engen Ausnahmeweg. Das stützt am Ende stark den Freispruch.'
      },
      {
        id: 'law_unclear_individual_not_criminal',
        label: 'Das Recht bleibt im Grenzfall unklar, aber die Einzelperson soll strafrechtlich nicht allein die ganze Last tragen.',
        summary: 'Ihr trennt Systemversagen und individuelle Strafbarkeit.',
        inference: 'Verantwortungsverschiebender Schluss',
        logicNote: 'Die Ordnung war unklar, deshalb fällt die letzte Last nicht vollständig auf die Einzelperson.',
        warning: 'Achtung: Diese Lösung wirkt menschlich, kann aber den normativen Kern unscharf lassen.',
        weights: { convict: 1, acquit: 3 },
        trace: 'Ihr legt die Last stärker auf das System als auf Koch allein. Das führt eher zum Freispruch.'
      }
    ]
  }
];

const DUEL_PROMPTS = [
  {
    id: 'facts',
    title: 'Runde 1 · Tatsachenbasis',
    prompt: 'Welcher Ausgangspunkt trägt den Fall besser: die 164 getöteten Passagiere oder die 70 000 bedrohten Menschen im Stadion?',
    support: ['164 Passagiere', '70 000 im Stadion', 'bewusster Abschuss', 'Zeitdruck']
  },
  {
    id: 'certainty',
    title: 'Runde 2 · Sicherheit der Gefahr',
    prompt: 'Wie sicher musste die Gefahr für das Stadion sein, damit Koch handeln durfte oder eben nicht handeln durfte?',
    support: ['keine Wunder einkalkulieren', 'Restzweifel', 'Funkmeldung', 'Kurs auf Arena']
  },
  {
    id: 'dignity',
    title: 'Runde 3 · Menschenwürde',
    prompt: 'Was bedeutet Menschenwürde hier genauer: Schutz vor Instrumentalisierung oder Schutzauftrag gegenüber den vielen Bedrohten?',
    support: ['Menschenwürde', 'bloßes Mittel', 'Schutzauftrag', 'Verfassungsgrenze']
  },
  {
    id: 'weighing',
    title: 'Runde 4 · Leben gegen Leben',
    prompt: 'Ist die Formel „wenige töten, viele retten“ hier ein gültiger Schluss oder bereits der Kern des Problems?',
    support: ['kleineres Übel', 'Leben gegen Leben', 'Trolleyproblem', 'Rettungslogik']
  },
  {
    id: 'emergency',
    title: 'Runde 5 · Übergesetzlicher Notstand',
    prompt: 'Ist der übergesetzliche Notstand ein notwendiges Ventil für Grenzfälle oder eine gefährliche Öffnung jenseits des Rechts?',
    support: ['übergesetzlicher Notstand', 'Rechtsstaat', 'Ausnahme', 'Minister Jung']
  },
  {
    id: 'conscience',
    title: 'Runde 6 · Gewissen und Verantwortung',
    prompt: 'Darf Kochs Gewissensentscheidung ihn entlasten oder muss gerade sie besonders streng kontrolliert werden?',
    support: ['Gewissen', 'alleingelassen', 'Verantwortung', 'keine Schule machen']
  },
  {
    id: 'future',
    title: 'Runde 7 · Zukunftsregel',
    prompt: 'Welche Regel soll nach diesem Fall gelten: absolute Grenze oder engster Ausnahmeweg?',
    support: ['Zukunftsregel', 'absolute Grenze', 'Ausnahmeweg', 'Folgen für spätere Fälle']
  }
];

const JUDGE_RUBRIC = [
  {
    title: 'Klare These',
    text: 'Sagt die Person deutlich, was sie behauptet, oder bleibt alles nur vage?'
  },
  {
    title: 'Begründung',
    text: 'Gibt es nachvollziehbare Prämissen mit Wörtern wie „weil“, „denn“, „deshalb“, „folglich“?'
  },
  {
    title: 'Beleg',
    text: 'Tauchen konkrete Bezugspunkte aus Terror oder der Rechtslage auf, etwa 164, 70 000, Menschenwürde, Luftsicherheitsgesetz?'
  },
  {
    title: 'Schlussform',
    text: 'Wirkt der Schluss eher deduktiv, abduktiv, analog oder bloß behauptet?'
  },
  {
    title: 'Reaktion',
    text: 'Geht die Antwort wirklich auf das Gegenargument ein oder redet sie daran vorbei?'
  },
  {
    title: 'Fehlschlüsse',
    text: 'Der Schiedsrichter sucht nach ad hominem, falschem Dilemma, slippery slope, ad populum und ähnlichen Trugschlüssen.'
  }
];

function createInitialState() {
  return {
    mode: 'verdict',
    verdict: {
      currentIndex: 0,
      showResult: false,
      answers: {}
    },
    duel: {
      players: {
        a: 'Person A',
        b: 'Person B'
      },
      started: false,
      revengeCount: 0,
      roundIndex: 0,
      attacker: 'a',
      currentAttack: '',
      currentResponse: '',
      scores: {
        a: 0,
        b: 0
      },
      history: [],
      judge: null
    }
  };
}

function hydrateState(input) {
  const state = createInitialState();
  if (!input || typeof input !== 'object') return state;

  state.mode = input.mode === 'duel' ? 'duel' : 'verdict';

  if (input.verdict && typeof input.verdict === 'object') {
    state.verdict.currentIndex = Number.isInteger(input.verdict.currentIndex)
      ? clamp(input.verdict.currentIndex, 0, VERDICT_QUESTIONS.length - 1)
      : 0;
    state.verdict.showResult = Boolean(input.verdict.showResult);
    state.verdict.answers = normalizeAnswers(input.verdict.answers);
  }

  if (input.duel && typeof input.duel === 'object') {
    state.duel.players.a = sanitizeName(input.duel.players?.a, 'Person A');
    state.duel.players.b = sanitizeName(input.duel.players?.b, 'Person B');
    state.duel.started = Boolean(input.duel.started);
    state.duel.revengeCount = Number.isInteger(input.duel.revengeCount) ? Math.max(0, input.duel.revengeCount) : 0;
    state.duel.roundIndex = Number.isInteger(input.duel.roundIndex) ? clamp(input.duel.roundIndex, 0, DUEL_PROMPTS.length) : 0;
    state.duel.attacker = input.duel.attacker === 'b' ? 'b' : 'a';
    state.duel.currentAttack = typeof input.duel.currentAttack === 'string' ? input.duel.currentAttack : '';
    state.duel.currentResponse = typeof input.duel.currentResponse === 'string' ? input.duel.currentResponse : '';
    state.duel.scores.a = Number.isFinite(input.duel.scores?.a) ? Math.max(0, Number(input.duel.scores.a)) : 0;
    state.duel.scores.b = Number.isFinite(input.duel.scores?.b) ? Math.max(0, Number(input.duel.scores.b)) : 0;
    state.duel.history = Array.isArray(input.duel.history) ? input.duel.history.slice(0, DUEL_PROMPTS.length) : [];
    state.duel.judge = input.duel.judge && typeof input.duel.judge === 'object' ? input.duel.judge : null;
  }

  return state;
}

function normalizeAnswers(input) {
  const answers = {};
  if (!input || typeof input !== 'object') return answers;
  VERDICT_QUESTIONS.forEach((question) => {
    const optionId = input[question.id];
    if (question.options.some((option) => option.id === optionId)) {
      answers[question.id] = optionId;
    }
  });
  return answers;
}

function sanitizeName(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { const status=document.getElementById('storageStatus'); if(status)status.textContent='Speichern ist in diesem Browser nicht möglich. Nutze den Protokolldownload.'; }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return hydrateState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getVerdictOption(questionId, optionId) {
  const question = VERDICT_QUESTIONS.find((entry) => entry.id === questionId);
  return question?.options.find((option) => option.id === optionId) || null;
}

function getAnsweredVerdictCount() {
  return VERDICT_QUESTIONS.filter((question) => state.verdict.answers[question.id]).length;
}

function getVerdictEvaluation() {
  const steps = [];
  let convict = 0;
  let acquit = 0;

  VERDICT_QUESTIONS.forEach((question, index) => {
    const option = getVerdictOption(question.id, state.verdict.answers[question.id]);
    if (!option) return;
    convict += option.weights.convict;
    acquit += option.weights.acquit;
    steps.push({
      index,
      question,
      option
    });
  });

  const difference = Math.abs(convict - acquit);
  const verdict = convict === acquit ? 'offen (Punktgleichstand)' : convict > acquit ? 'schuldig' : 'nicht schuldig';
  const tone = verdict === 'schuldig' ? 'verdict-convict' : 'verdict-acquit';
  const clarity = difference >= 8 ? 'sehr deutlich' : difference >= 4 ? 'klar' : 'knapp';
  const ratioText = `${convict} Punkte Richtung Verurteilung · ${acquit} Punkte Richtung Freispruch`;
  const strongestConvict = steps
    .filter((step) => step.option.weights.convict > step.option.weights.acquit)
    .sort((a, b) => (b.option.weights.convict - b.option.weights.acquit) - (a.option.weights.convict - a.option.weights.acquit))
    .slice(0, 3);
  const strongestAcquit = steps
    .filter((step) => step.option.weights.acquit > step.option.weights.convict)
    .sort((a, b) => (b.option.weights.acquit - b.option.weights.convict) - (a.option.weights.acquit - a.option.weights.convict))
    .slice(0, 3);

  return {
    convict,
    acquit,
    difference,
    verdict,
    tone,
    clarity,
    ratioText,
    steps,
    strongestConvict,
    strongestAcquit
  };
}

function setMode(mode) {
  state.mode = mode === 'duel' ? 'duel' : 'verdict';
  saveState();
  render();
}

function setVerdictAnswer(questionId, optionId) {
  state.verdict.answers[questionId] = optionId;
  if (getAnsweredVerdictCount() < VERDICT_QUESTIONS.length) {
    state.verdict.showResult = false;
  }
  saveState();
  render();
}

function moveVerdict(delta) {
  state.verdict.currentIndex = clamp(state.verdict.currentIndex + delta, 0, VERDICT_QUESTIONS.length - 1);
  saveState();
  render();
}

function showVerdictResult() {
  if (getAnsweredVerdictCount() === VERDICT_QUESTIONS.length) {
    state.verdict.showResult = true;
    saveState();
    render();
  }
}

function resetVerdictMode() {
  state.verdict = createInitialState().verdict;
  saveState();
  render();
}

function updateDuelPlayers() {
  state.duel.players.a = sanitizeName(playerAInput.value, 'Person A');
  state.duel.players.b = sanitizeName(playerBInput.value, 'Person B');
  saveState();
}

function startDuel(revenge = false) {
  updateDuelPlayers();
  state.duel.started = true;
  state.duel.roundIndex = 0;
  state.duel.attacker = revenge ? (state.duel.attacker === 'a' ? 'b' : 'a') : 'a';
  state.duel.currentAttack = '';
  state.duel.currentResponse = '';
  state.duel.scores = { a: 0, b: 0 };
  state.duel.history = [];
  state.duel.judge = null;
  if (revenge) {
    state.duel.revengeCount += 1;
  }
  saveState();
  render();
}

function updateDuelText(type, value) {
  if (type === 'attack') {
    state.duel.currentAttack = value;
  } else {
    state.duel.currentResponse = value;
  }
  saveState();
}

function getCurrentDuelPrompt() {
  return DUEL_PROMPTS[Math.min(state.duel.roundIndex, DUEL_PROMPTS.length - 1)] || null;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}\s]/gu, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

function countPattern(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function detectInferenceType(text) {
  const normalized = normalizeText(text);
  if (/(wenn .* dann|also|folglich|somit|daraus folgt)/.test(normalized)) {
    return 'Deduktion';
  }
  if (/(wahrscheinlich|am ehesten|naheliegend|spricht dafür|plausibel)/.test(normalized)) {
    return 'Abduktion';
  }
  if (/(wie im fall|ähnlich wie|vergleichbar mit|analog)/.test(normalized)) {
    return 'Analogie';
  }
  if (/(wenn nicht .* dann|kleineres übel|abwägen|mehr menschen|weniger menschen)/.test(normalized)) {
    return 'Praktischer Abwägungsschluss';
  }
  return 'Unklare Schlussform';
}

function detectFallacies(text) {
  const normalized = normalizeText(text);
  const fallacies = [];
  if (/(du bist|typisch du|du hast keine ahnung|weil du kein)/.test(normalized)) {
    fallacies.push('ad hominem');
  }
  if (/(alle wissen|jeder weiß|alle denken|die meisten sagen)/.test(normalized)) {
    fallacies.push('ad populum');
  }
  if (/(entweder .* oder .*|nur zwei möglichkeiten)/.test(normalized) && !/(auch|sowohl|dazwischen)/.test(normalized)) {
    fallacies.push('falsches Dilemma');
  }
  if (/(wenn wir .* dann .* chaos|dann bricht alles zusammen|das endet zwangsläufig)/.test(normalized)) {
    fallacies.push('slippery slope');
  }
  if (/(niemand hat bewiesen|nicht widerlegt|nicht bewiesen dass)/.test(normalized)) {
    fallacies.push('ad ignorantiam');
  }
  if (/(mitleid|er tat mir leid|weil es so traurig ist|wegen seines kindes)/.test(normalized)) {
    fallacies.push('ad misericordiam');
  }
  if (/(weil .* minister .* sagte|weil .* richter .* sagte|eine autorität sagt)/.test(normalized)) {
    fallacies.push('ad verecundiam');
  }
  return fallacies;
}

function analyzeArgument(text, prompt, opponentText = '') {
  const normalized = normalizeText(text);
  const promptTokens = normalizeText(prompt.prompt).split(' ').filter((token) => token.length > 5);
  const supportTokens = prompt.support.map((token) => normalizeText(token));
  const opponentTokens = normalizeText(opponentText)
    .split(' ')
    .filter((token) => token.length > 5)
    .slice(0, 14);

  let score = 0;
  const strengths = [];
  const issues = [];

  if (text.trim().length >= 120) {
    score += 2;
    strengths.push('Die Aussage ist ausführlich genug, um einen echten Gedankengang zu tragen.');
  } else if (text.trim().length >= 70) {
    score += 1;
    strengths.push('Die Aussage ist knapp, aber noch tragfähig formuliert.');
  } else {
    issues.push('Die Aussage bleibt sehr kurz und entwickelt den Gedanken kaum aus.');
  }

  if (/(weil|denn|deshalb|darum|folglich|somit|also)/i.test(text)) {
    score += 2;
    strengths.push('Es gibt sichtbare Begründungssignale.');
  } else {
    issues.push('Die Begründung bleibt sprachlich zu wenig markiert.');
  }

  const evidenceHits = supportTokens.filter((token) => normalized.includes(token)).length
    + countPattern(normalized, /\b(164|70000|70 000|menschenwürde|bundesverfassungsgericht|luftsicherheitsgesetz|notstand|stadion|passagiere|terrorist)\b/g);
  if (evidenceHits >= 2) {
    score += 2;
    strengths.push('Das Argument arbeitet mit konkreten Bezügen aus dem Fall.');
  } else if (evidenceHits === 1) {
    score += 1;
    strengths.push('Es gibt wenigstens einen konkreten Bezugspunkt aus dem Fall.');
  } else {
    issues.push('Es fehlt an klaren Belegen aus Terror oder der Rechtslage.');
  }

  const promptFit = promptTokens.some((token) => normalized.includes(token));
  if (promptFit) {
    score += 1;
    strengths.push('Das Argument bleibt beim eigentlichen Rundenthema.');
  } else {
    issues.push('Das Argument entfernt sich vom Kern der aktuellen Runde.');
  }

  const inferenceType = detectInferenceType(text);
  if (inferenceType !== 'Unklare Schlussform') {
    score += 1;
    strengths.push(`Es lässt sich eine erkennbare Schlussform lesen: ${inferenceType}.`);
  } else {
    issues.push('Die Schlussform bleibt unklar; die Konklusion springt zu schnell.');
  }

  let addressedOpponent = false;
  if (opponentText.trim()) {
    addressedOpponent = /(du sagst|dein argument|deine these|ich widerspreche|genau da liegt|gerade das)/i.test(text)
      || opponentTokens.some((token) => normalized.includes(token));
    if (addressedOpponent) {
      score += 1;
      strengths.push('Die Reaktion greift erkennbar das Gegenargument auf.');
    } else {
      issues.push('Die Reaktion geht kaum sichtbar auf das Gegenargument ein.');
    }
  }

  const fallacies = detectFallacies(text);
  if (fallacies.length) {
    score -= fallacies.length * 1.5;
    issues.push(`Auffällige Fehlschlüsse: ${fallacies.join(', ')}.`);
  }

  return {
    score: Math.max(0, Math.round(score * 10) / 10),
    strengths,
    issues,
    fallacies,
    inferenceType,
    addressedOpponent
  };
}

function judgeCurrentRound() {
  const prompt = getCurrentDuelPrompt();
  if (!prompt) return;
  const attackText = state.duel.currentAttack.trim();
  const responseText = state.duel.currentResponse.trim();
  if (!attackText || !responseText) return;

  const attacker = state.duel.attacker;
  const defender = attacker === 'a' ? 'b' : 'a';
  const attackAnalysis = analyzeArgument(attackText, prompt);
  const responseAnalysis = analyzeArgument(responseText, prompt, attackText);

  let winner = attacker;
  let loser = defender;
  let reason = '';

  if (responseAnalysis.score > attackAnalysis.score) {
    winner = defender;
    loser = attacker;
    reason = 'Die Antwort hat das Ausgangsargument logischer, konkreter und reaktionsstärker verarbeitet.';
  } else if (responseAnalysis.score === attackAnalysis.score) {
    if (responseAnalysis.addressedOpponent && !attackAnalysis.addressedOpponent) {
      winner = defender;
      loser = attacker;
      reason = 'Bei Punktgleichstand bekommt die echte Reaktion auf das Gegenargument den Ausschlag.';
    } else if (attackAnalysis.fallacies.length < responseAnalysis.fallacies.length) {
      winner = attacker;
      loser = defender;
      reason = 'Bei Punktgleichstand gewinnt die Seite mit der saubereren Argumentation ohne zusätzliche Fehlschlüsse.';
    } else {
      winner = defender;
      loser = attacker;
      reason = 'Bei fast gleicher Qualität gewinnt hier die reagierende Seite, weil sie die gegnerische These aushalten und beantworten musste.';
    }
  } else {
    reason = 'Das Ausgangsargument blieb klarer, besser belegt und schlüssiger als die Antwort.';
  }

  state.duel.scores[winner] += 1;

  const roundRecord = {
    round: state.duel.roundIndex + 1,
    promptId: prompt.id,
    title: prompt.title,
    attacker,
    defender,
    attackText,
    responseText,
    attackAnalysis,
    responseAnalysis,
    winner,
    loser,
    reason
  };

  state.duel.history.push(roundRecord);
  state.duel.judge = roundRecord;
  state.duel.roundIndex += 1;
  state.duel.attacker = loser;
  state.duel.currentAttack = '';
  state.duel.currentResponse = '';
  saveState();
  render();
}

function renderModeSwitch() {
  modeSwitch.innerHTML = MODE_CARDS.map((card) => `
    <button class="mode-btn ${state.mode === card.id ? 'active' : ''}" type="button" data-mode="${card.id}">
      <strong>${card.title}</strong>
      <span>${card.text}</span>
    </button>
  `).join('');

  modeSwitch.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      setMode(button.dataset.mode);
    });
  });
}

function renderPrepUnit() {
  if (prepUnit.innerHTML) return;
  prepUnit.innerHTML = PREP_MODULES.map((module) => {
    if (module.kind === 'video') {
      return `
        <article class="prep-card video-card">
          <span class="mini-chip">Vorentlastung vor dem Urteil</span>
          <h3>${module.title}</h3>
          <p>${module.text}</p>
          <div class="video-frame">
            <video controls preload="metadata" playsinline>
              <source src="${TROLLEY_VIDEO_EMBED}" type="video/mp4" />
            </video>
          </div>
          <p class="small-note">Wenn das Video im Browser nicht sauber lädt, öffnet es direkt hier: <a href="${TROLLEY_VIDEO_LINK}" target="_blank" rel="noreferrer noopener">Straßenbahn - das philosophische Gedankenexperiment</a>.</p>
          <ul>
            ${module.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
          </ul>
          <div class="prep-tags">
            ${module.tags.map((tag) => `<span class="prep-tag">${tag}</span>`).join('')}
            <span class="prep-tag">Im Spiel: Schritt 6 und Duell-Runde 4</span>
          </div>
        </article>
      `;
    }

    return `
      <article class="prep-card">
        <span class="mini-chip">Denkwerkzeug</span>
        <h3>${module.title}</h3>
        <p>${module.text}</p>
        <ul>
          ${module.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
        </ul>
        <div class="prep-tags">
          ${module.tags.map((tag) => `<span class="prep-tag">${tag}</span>`).join('')}
        </div>
      </article>
    `;
  }).join('');
}

function renderVerdictProgress() {
  verdictProgress.innerHTML = VERDICT_QUESTIONS.map((question, index) => {
    const answered = Boolean(state.verdict.answers[question.id]);
    const status = index === state.verdict.currentIndex ? 'active' : answered ? 'done' : 'pending';
    return `
      <article class="progress-item ${status}">
        <span class="progress-step">Schritt ${index + 1}</span>
        <strong>${question.stage}</strong>
        <span>${question.title}</span>
      </article>
    `;
  }).join('');
}

function renderQuestionCard() {
  const question = VERDICT_QUESTIONS[state.verdict.currentIndex];
  const selectedOptionId = state.verdict.answers[question.id];
  const selectedOption = getVerdictOption(question.id, selectedOptionId);
  const answeredCount = getAnsweredVerdictCount();

  questionCard.innerHTML = `
    <div class="question-layout">
      <div class="question-topline">
        <span class="question-kicker">${question.stage}</span>
        <span class="mini-chip">${answeredCount} / ${VERDICT_QUESTIONS.length} beantwortet</span>
      </div>
      <div class="panel-head">
        <div>
          <h2>${question.title}</h2>
          <p class="question-text">${question.prompt}</p>
        </div>
      </div>
      <div class="question-explainer">
        <strong>Warum ist dieser Schritt wichtig?</strong>
        <p>${question.why}</p>
      </div>
      <div class="question-grid">
        ${question.options.map((option) => `
          <button
            class="option-btn ${selectedOptionId === option.id ? 'selected' : ''}"
            type="button"
            data-question-option="${option.id}"
          >
            <strong>${option.label}</strong>
            <span>${option.summary}</span>
            <em>Schlussform: ${option.inference}</em>
          </button>
        `).join('')}
      </div>
      ${selectedOption ? `
        <div class="question-explainer">
          <strong>So liest die App eure Auswahl</strong>
          <p>${selectedOption.logicNote}</p>
          <p><strong>Worauf ihr achten solltet:</strong> ${selectedOption.warning}</p>
        </div>
      ` : ''}
      <div class="button-row">
        <button id="prevQuestionBtn" class="ghost-btn" type="button" ${state.verdict.currentIndex === 0 ? 'disabled' : ''}>Zurück</button>
        ${state.verdict.currentIndex < VERDICT_QUESTIONS.length - 1
          ? `<button id="nextQuestionBtn" class="primary-btn" type="button" ${selectedOption ? '' : 'disabled'}>Nächster Schritt</button>`
          : `<button id="showVerdictBtn" class="primary-btn" type="button" ${answeredCount === VERDICT_QUESTIONS.length ? '' : 'disabled'}>Urteil sichtbar machen</button>`}
        <button id="resetVerdictBtn" class="ghost-btn" type="button">Urteilsweg neu starten</button>
      </div>
    </div>
  `;

  questionCard.querySelectorAll('[data-question-option]').forEach((button) => {
    button.addEventListener('click', () => {
      setVerdictAnswer(question.id, button.dataset.questionOption);
    });
  });

  const prevButton = document.querySelector('#prevQuestionBtn');
  if (prevButton) {
    prevButton.addEventListener('click', () => moveVerdict(-1));
  }
  const nextButton = document.querySelector('#nextQuestionBtn');
  if (nextButton) {
    nextButton.addEventListener('click', () => moveVerdict(1));
  }
  const showVerdictButton = document.querySelector('#showVerdictBtn');
  if (showVerdictButton) {
    showVerdictButton.addEventListener('click', showVerdictResult);
  }
  const resetButton = document.querySelector('#resetVerdictBtn');
  if (resetButton) {
    resetButton.addEventListener('click', resetVerdictMode);
  }
}

function renderTracePanel() {
  const answeredSteps = VERDICT_QUESTIONS
    .map((question, index) => ({
      index,
      question,
      option: getVerdictOption(question.id, state.verdict.answers[question.id])
    }))
    .filter((entry) => entry.option);

  tracePanel.innerHTML = answeredSteps.length
    ? answeredSteps.map((entry) => `
      <article class="trace-entry" data-step="Schritt ${entry.index + 1}">
        <strong>${entry.question.stage}</strong>
        <p>${entry.option.trace}</p>
        <div class="pill-row">
          <span class="choice-chip">Schlussform: ${entry.option.inference}</span>
          <span class="choice-chip">Verurteilung +${entry.option.weights.convict}</span>
          <span class="choice-chip">Freispruch +${entry.option.weights.acquit}</span>
        </div>
      </article>
    `).join('')
    : `
      <article class="trace-entry" data-step="Noch leer">
        <strong>Start</strong>
        <p>Wählt im ersten Schritt eine Antwort. Danach seht ihr hier, wie sich eure Schlussfolgerung Stück für Stück aufbaut.</p>
      </article>
    `;
}

function renderVerdictResult() {
  const complete = getAnsweredVerdictCount() === VERDICT_QUESTIONS.length;
  verdictResultPanel.classList.toggle('hidden', !(complete && state.verdict.showResult));
  if (!complete || !state.verdict.showResult) {
    verdictResultPanel.innerHTML = '';
    return;
  }

  const evaluation = getVerdictEvaluation();
  const verdictLine = evaluation.verdict === 'schuldig'
    ? 'Der Urteilsweg führt am Ende zur Linie: Lars Koch soll schuldig gesprochen werden.'
    : 'Der Urteilsweg führt am Ende zur Linie: Lars Koch soll nicht schuldig gesprochen werden.';

  verdictResultPanel.innerHTML = `
    <div class="result-headline">
      <strong>Schlussabstimmung erst jetzt sichtbar</strong>
      <h2>So ist euer Urteil entstanden</h2>
      <p>${verdictLine} Das Ergebnis fällt ${evaluation.clarity} aus.</p>
    </div>

    <div class="result-grid">
      <article class="result-card ${evaluation.tone}">
        <strong>Urteil</strong>
        <p>${evaluation.verdict === 'schuldig' ? 'Schuldig' : 'Nicht schuldig'}</p>
      </article>
      <article class="result-card">
        <strong>Gewicht</strong>
        <p>${evaluation.ratioText}</p>
      </article>
      <article class="result-card">
        <strong>Spannung</strong>
        <p>${evaluation.difference >= 8 ? 'großer Abstand zwischen den beiden Linien' : evaluation.difference >= 4 ? 'sichtbarer Abstand zwischen den beiden Linien' : 'enger Fall mit tragischen Gegengründen'}</p>
      </article>
    </div>

    <div class="result-explanation-grid">
      <article class="support-card">
        <h3>Schritt-für-Schritt-Erklärung</h3>
        <ul>
          ${evaluation.steps.map((step) => `<li><strong>${step.question.stage}:</strong> ${step.option.trace}</li>`).join('')}
        </ul>
      </article>

      <div class="result-grid">
        <article class="result-card">
          <strong>Stärkste Gründe Richtung Verurteilung</strong>
          <p>${evaluation.strongestConvict.length
            ? evaluation.strongestConvict.map((step) => `${step.question.stage}: ${step.option.label}`).join(' ')
            : 'Eure Antworten haben hier kaum Druck in Richtung Verurteilung aufgebaut.'}</p>
        </article>
        <article class="result-card">
          <strong>Stärkste Gründe Richtung Freispruch</strong>
          <p>${evaluation.strongestAcquit.length
            ? evaluation.strongestAcquit.map((step) => `${step.question.stage}: ${step.option.label}`).join(' ')
            : 'Eure Antworten haben hier kaum Druck in Richtung Freispruch aufgebaut.'}</p>
        </article>
        <article class="result-card">
          <strong>Argumentationslehre</strong>
          <p>Die App erklärt euer Ergebnis nicht bloß inhaltlich, sondern auch formal: Welche Schlüsse waren deduktiv, welche abduktiv, wo drohten falsche Analogien oder unklare Ausnahmeformeln?</p>
        </article>
      </div>
    </div>
  `;
}

function renderJudgeRubric() {
  judgeRubric.innerHTML = JUDGE_RUBRIC.map((entry) => `
    <article class="judge-box">
      <strong>${entry.title}</strong>
      <p>${entry.text}</p>
    </article>
  `).join('');
}

function renderDuelBoard() {
  playerAInput.value = state.duel.players.a;
  playerBInput.value = state.duel.players.b;

  if (!state.duel.started) {
    duelBoard.innerHTML = `
      <div class="duel-board">
        <article class="duel-card">
          <strong>Noch kein Match gestartet</strong>
          <p>Tragt die beiden Namen ein und klickt danach auf „Match starten“. Das erste Argument beginnt dann mit Person A. Nach jeder verlorenen Runde muss die unterlegene Person den nächsten Angriff setzen.</p>
        </article>
      </div>
    `;
    judgeResult.innerHTML = `
      <article class="judge-result-card">
        <strong>Warte auf Matchstart</strong>
        <p>Der Regel-Schiedsrichter erscheint nach der ersten ausgewerteten Runde mit einer Begründung.</p>
      </article>
    `;
    duelHistory.innerHTML = '';
    return;
  }

  if (state.duel.roundIndex >= DUEL_PROMPTS.length) {
    const winner = state.duel.scores.a === state.duel.scores.b
      ? null
      : state.duel.scores.a > state.duel.scores.b ? 'a' : 'b';
    duelBoard.innerHTML = `
      <div class="duel-board">
        <article class="duel-card highlight">
          <strong>Match beendet</strong>
          <p>${winner
            ? `${state.duel.players[winner]} gewinnt das Match mit ${state.duel.scores[winner]} zu ${state.duel.scores[winner === 'a' ? 'b' : 'a']} Punkten.`
            : `Das Match endet unentschieden mit ${state.duel.scores.a} zu ${state.duel.scores.b} Punkten.`}</p>
          <p>Drückt jetzt auf „Revanche“, wenn ihr dieselben Spielenden noch einmal sieben Runden gegeneinander antreten lassen wollt.</p>
        </article>
        <div class="score-grid">
          <article class="score-card">
            <span>${state.duel.players.a}</span>
            <strong>${state.duel.scores.a}</strong>
            <span>Punkte</span>
          </article>
          <article class="score-card">
            <span>${state.duel.players.b}</span>
            <strong>${state.duel.scores.b}</strong>
            <span>Punkte</span>
          </article>
          <article class="score-card">
            <span>Revanchen</span>
            <strong>${state.duel.revengeCount}</strong>
            <span>bisher gestartet</span>
          </article>
        </div>
      </div>
    `;
    renderJudgeResult();
    renderHistory();
    return;
  }

  const prompt = getCurrentDuelPrompt();
  const attacker = state.duel.attacker;
  const defender = attacker === 'a' ? 'b' : 'a';
  const canJudge = Boolean(state.duel.currentAttack.trim() && state.duel.currentResponse.trim());

  duelBoard.innerHTML = `
    <div class="duel-board">
      <div class="score-grid">
        <article class="score-card">
          <span>${state.duel.players.a}</span>
          <strong>${state.duel.scores.a}</strong>
          <span>Punkte</span>
        </article>
        <article class="score-card">
          <span>${state.duel.players.b}</span>
          <strong>${state.duel.scores.b}</strong>
          <span>Punkte</span>
        </article>
        <article class="score-card">
          <span>Runde</span>
          <strong>${state.duel.roundIndex + 1} / ${DUEL_PROMPTS.length}</strong>
          <span>${prompt.title}</span>
        </article>
      </div>

      <article class="duel-card highlight">
        <strong>${prompt.title}</strong>
        <p>${prompt.prompt}</p>
        <div class="pill-row">
          ${prompt.support.map((item) => `<span class="choice-chip">${item}</span>`).join('')}
        </div>
        <p class="small-note">Angriff in dieser Runde: ${state.duel.players[attacker]}. Antwort in dieser Runde: ${state.duel.players[defender]}.</p>
      </article>

      <div class="duel-round-grid">
        <article class="duel-card">
          <strong>${state.duel.players[attacker]} eröffnet</strong>
          <p>Formuliere eine klare These mit Begründung und mindestens einem konkreten Bezugspunkt aus dem Fall.</p>
          <textarea id="attackField" class="field-textarea" placeholder="Beispielstruktur: These. Weil ... Deshalb ...">${escapeHtml(state.duel.currentAttack)}</textarea>
        </article>

        <article class="duel-card">
          <strong>${state.duel.players[defender]} reagiert</strong>
          <p>Greife das erste Argument direkt auf. Zeige, wo die These zu kurz greift oder warum dein Gegenschluss stärker ist.</p>
          <textarea id="responseField" class="field-textarea" placeholder="Reagiere konkret auf das Gegenargument und führe dann deinen Gegenschluss aus.">${escapeHtml(state.duel.currentResponse)}</textarea>
        </article>
      </div>

      <div class="button-row">
        <button id="judgeRoundBtn" class="primary-btn" type="button" ${canJudge ? '' : 'disabled'}>Runde urteilen</button>
      </div>
    </div>
  `;

  const attackField = document.querySelector('#attackField');
  const responseField = document.querySelector('#responseField');
  const judgeRoundBtn = document.querySelector('#judgeRoundBtn');

  attackField.addEventListener('input', () => {
    updateDuelText('attack', attackField.value);
    judgeRoundBtn.disabled = !(attackField.value.trim() && responseField.value.trim());
  });

  responseField.addEventListener('input', () => {
    updateDuelText('response', responseField.value);
    judgeRoundBtn.disabled = !(attackField.value.trim() && responseField.value.trim());
  });

  judgeRoundBtn.addEventListener('click', judgeCurrentRound);

  renderJudgeResult();
  renderHistory();
}

function renderJudgeResult() {
  const round = state.duel.judge;
  if (!round) {
    judgeResult.innerHTML = `
      <article class="judge-result-card">
        <strong>Noch kein Urteil im Duell</strong>
        <p>Sobald die erste Runde bewertet wurde, erklärt der Schiedsrichter hier, wer vorne lag und warum.</p>
      </article>
    `;
    return;
  }

  const winnerClass = round.winner === 'a' ? 'winner-a' : 'winner-b';
  judgeResult.innerHTML = `
    <article class="judge-result-card ${winnerClass}">
      <strong>Runde ${round.round}: ${state.duel.players[round.winner]} gewinnt</strong>
      <p>${round.reason}</p>
      <div class="result-grid">
        <article class="result-card">
          <strong>${state.duel.players[round.attacker]}</strong>
          <p>Punktzahl: ${round.attackAnalysis.score}</p>
          <p>Schlussform: ${round.attackAnalysis.inferenceType}</p>
          <p>Stärken: ${round.attackAnalysis.strengths.join(' ') || 'keine besonderen Stärken erkannt.'}</p>
          <p>Probleme: ${round.attackAnalysis.issues.join(' ') || 'keine größeren Probleme erkannt.'}</p>
        </article>
        <article class="result-card">
          <strong>${state.duel.players[round.defender]}</strong>
          <p>Punktzahl: ${round.responseAnalysis.score}</p>
          <p>Schlussform: ${round.responseAnalysis.inferenceType}</p>
          <p>Stärken: ${round.responseAnalysis.strengths.join(' ') || 'keine besonderen Stärken erkannt.'}</p>
          <p>Probleme: ${round.responseAnalysis.issues.join(' ') || 'keine größeren Probleme erkannt.'}</p>
        </article>
        <article class="result-card">
          <strong>Nächste Runde</strong>
          <p>${state.duel.roundIndex >= DUEL_PROMPTS.length
            ? 'Das Match ist beendet. Jetzt kann eine Revanche starten.'
            : `${state.duel.players[state.duel.attacker]} muss jetzt als unterlegene Seite das nächste Argument eröffnen.`}</p>
        </article>
      </div>
    </article>
  `;
}

function renderHistory() {
  duelHistory.innerHTML = state.duel.history.length
    ? state.duel.history.map((round) => `
      <article class="history-item">
        <div class="history-head">
          <strong>Runde ${round.round}: ${round.title}</strong>
          <span class="history-winner">${state.duel.players[round.winner]} gewinnt</span>
        </div>
        <p><strong>${state.duel.players[round.attacker]} eröffnet:</strong> ${escapeHtml(round.attackText)}</p>
        <p><strong>${state.duel.players[round.defender]} reagiert:</strong> ${escapeHtml(round.responseText)}</p>
        <p><strong>Begründung des Schiedsrichters:</strong> ${round.reason}</p>
      </article>
    `).join('')
    : `<article class="history-item"><p>Hier erscheinen die sieben Runden, sobald das Match begonnen hat.</p></article>`;
}

function render() {
  renderModeSwitch();
  renderPrepUnit();
  verdictMode.classList.toggle('hidden', state.mode !== 'verdict');
  duelMode.classList.toggle('hidden', state.mode !== 'duel');
  renderVerdictProgress();
  renderQuestionCard();
  renderTracePanel();
  renderVerdictResult();
  renderJudgeRubric();
  renderDuelBoard();
}

const state = loadState() || createInitialState();

const modeSwitch = document.querySelector('#modeSwitch');
const prepUnit = document.querySelector('#prepUnit');
const verdictMode = document.querySelector('#verdictMode');
const duelMode = document.querySelector('#duelMode');
const verdictProgress = document.querySelector('#verdictProgress');
const questionCard = document.querySelector('#questionCard');
const tracePanel = document.querySelector('#tracePanel');
const verdictResultPanel = document.querySelector('#verdictResultPanel');
const playerAInput = document.querySelector('#playerA');
const playerBInput = document.querySelector('#playerB');
const startDuelBtn = document.querySelector('#startDuelBtn');
const rematchBtn = document.querySelector('#rematchBtn');
const duelBoard = document.querySelector('#duelBoard');
const judgeRubric = document.querySelector('#judgeRubric');
const judgeResult = document.querySelector('#judgeResult');
const duelHistory = document.querySelector('#duelHistory');

playerAInput.addEventListener('input', updateDuelPlayers);
playerBInput.addEventListener('input', updateDuelPlayers);
startDuelBtn.addEventListener('click', () => startDuel(false));
rematchBtn.addEventListener('click', () => startDuel(true));

render();

// Export the actual local learning record without sending it to a server.
document.getElementById('exportProtocol').addEventListener('click',()=>{
 const report={format:'terror-urteil-duell-v1',exportiert:new Date().toISOString(),hinweis:'Regelbasierte Übung, kein juristisches Urteil. Fehlschlüsse sind Prüfhinweise.',urteilsweg:getVerdictEvaluation(),duell:state.duel};
 const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='terror-urteil-duell-protokoll.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
