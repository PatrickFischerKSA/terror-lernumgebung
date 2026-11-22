// Redaktionelle Gesprächsbausteine: Fakten sind fest, Deutungen werden gekennzeichnet.
// Die Auswahl erfolgt nach Frageabsicht und explizitem Thema, nicht nach einem LLM-Urteil.
const topics={
 nelson:[
 ['recht',/recht|würde|aufrechn|leben|anklage|freispruch|stadion|rett|unschuldig/i,
 'Ich vertrete die Anklage. Mein Einwand gegen Kochs Rechtfertigung ist, dass unschuldige Menschen nicht zu einer verrechenbaren Grösse werden dürfen.',
 'Die Zahl der Bedrohten beantwortet für mich noch nicht, welche Befugnis der Staat zum Töten Unschuldiger hat. Genau diese Grenze steht im Zentrum meiner Anklage.',
 'Der stärkste Einwand gegen meine Position ist die drohende Katastrophe im Stadion. Ich muss diesen Einwand ernst nehmen; daraus folgt für mich aber keine freie Verfügung über die Menschen im Flugzeug.',
 'Prüft mein Plädoyer und meine Befragung Kochs. Unterscheidet dabei meine rechtliche Argumentation von einer Behauptung über mein Privatleben.'],
 ['rolle',/verteidig|biegler|staatsanw|mandant|partei/i,
 'Ich bin Staatsanwältin, nicht Kochs Verteidigerin. Biegler vertritt die Verteidigung; ich begründe die Anklage.',
 'Wir streiten über die strafrechtliche Bewertung derselben Tat. Dass Biegler Koch verteidigt, macht mich nicht zur Angehörigen eines Opfers.',
 'Ich muss die Gegenargumente der Verteidigung prüfen. Meine Prozessrolle erlaubt mir nicht, private Motive oder eine persönliche Betroffenheit zu erfinden.',
 'Vergleicht Anklage und Plädoyers: Wer behauptet was, und worauf stützt sich die jeweilige Bewertung?']
 ],
 biegler:[
 ['verteidigung',/koch|mandant|verteidig|freispruch|schuld|rett|stadion|rechtfert|entscheid/i,
 'Lars Koch ist mein Mandant. Ich bestreite den Abschuss als Tatgeschehen nicht; ich verteidige ihn gegen die strafrechtliche Bewertung der Anklage.',
 'Ich argumentiere mit der extremen Entscheidungslage und plädiere für Freispruch. Das ist eine Verteidigungsposition, keine Behauptung, ich hätte selbst im Cockpit gesessen.',
 'Nelsons stärkster Einwand ist, dass unschuldige Leben nicht aufgerechnet werden dürfen. Meine Verteidigung muss gerade auf diesen Einwand antworten, statt die Opfer verschwinden zu lassen.',
 'Schlagt meine Erklärung zu Beginn und mein Plädoyer nach. Trennt das eingeräumte Geschehen vom Streit über Schuld und Rechtfertigung.'],
 ['rolle',/staatsanw|ankläger|pilot|selbst|befehl/i,
 'Ich bin Rechtsanwalt Biegler und Kochs Verteidiger, nicht der Pilot und nicht der Staatsanwalt.',
 'Meine Aufgabe hier ist die Verteidigung meines Mandanten. Seine Erlebnisse darf ich nicht als eigene Erinnerungen erzählen.',
 'Dass ich Kochs Interessen vertrete, macht mich nicht zum Zeugen des Abschusses. Meine Argumente sind als Verteidigungsargumente zu prüfen.',
 'Vergleicht meine Prozessrolle mit Kochs Aussage: Ein Plädoyer und eine Aussage aus eigener Wahrnehmung leisten Unterschiedliches.']
 ],
 meiser:[
 ['nachricht',/sms|nachricht|cockpit|selbstrett|rettungsversuch|gewusst|wissen|sicher|beleg/i,
 'Mein Mann schrieb mir per SMS von dem Versuch, ins Cockpit zu gelangen. Ich war nicht selbst an Bord; von dem Versuch weiss ich durch seine Nachricht.',
 'Die Nachricht belegt für mich, dass die Passagiere einen Versuch unternahmen. Sie beweist nicht, dass dieser Versuch sicher erfolgreich gewesen wäre.',
 'Aus meinem Verlust folgt keine Gewissheit über einen anderen Ausgang. Ebenso darf der Versuch der Passagiere nicht einfach als bedeutungslos abgetan werden.',
 'Prüft meine Aussage zur SMS. Trennt den berichteten Versuch von der offenen Frage nach seinen Erfolgsaussichten.'],
 ['verlust',/tochter|mann|ehemann|famil|mutter|verlust|trau|schuh|sarg|boris|kind/i,
 'Mein Mann wurde beim Abschuss getötet. Unsere Tochter ist im Stück sieben Jahre alt. Boris ist Kochs Sohn, nicht mein Kind.',
 'Als mögliche Deutung: Für unsere Tochter bedeutet der Tod meines Mannes den Verlust ihres Vaters. Ihre genauen Gedanken oder spätere Reaktionen sind damit noch nicht belegt.',
 'Mein persönlicher Verlust ist Teil meiner Perspektive als Nebenklägerin und Zeugin. Er macht mich weder zur Staatsanwältin noch zur allwissenden Beobachterin im Flugzeug.',
 'Meine Aussage über den linken Schuh und den leeren Sarg macht den Verlust konkret. Prüft am Text, wie diese Einzelheiten wirken, statt Gefühle meiner Tochter zu erfinden.'],
 ['rolle',/krankenschw|beruf|zeuge|zeugin|nebenkl|anklage|nelson/i,
 'Ich bin Krankenschwester in München und trete als Nebenklägerin und Zeugin auf. Nelson ist die Staatsanwältin.',
 'Ich berichte von meinem Mann und der Nachricht, die ich erhielt. Meine Prozessrolle ist von Nelsons rechtlicher Anklage zu unterscheiden.',
 'Meine Betroffenheit ersetzt keinen Beleg. Zugleich darf meine Aussage nicht auf eine bloss abstrakte Opferzahl reduziert werden.',
 'Achtet in meiner Vernehmung darauf, was ich selbst erlebt habe und was mir mein Mann berichtet hat.']
 ],
 lauterbach:[
 ['lage',/cockpit|flugzeug|gesehen|wissen|gewusst|sicher|wahrnehm|zeuge|lage|beleg/i,
 'Ich bin Christian Georg Lauterbach, Oberstleutnant und Zeuge. Als Duty Controller war ich Teil des Lage- und Führungsablaufs, nicht im Passagierflugzeug.',
 'Lageinformationen und weitergegebene Meldungen sind keine eigene Wahrnehmung aus der Kabine. Diese Grenze muss auch bei einer Nachfrage bestehen bleiben.',
 'Aus meiner dienstlichen Funktion folgt keine Gewissheit über jeden Vorgang an Bord. Fragt deshalb jeweils nach der Quelle einer Information.',
 'Prüft meine Vernehmung: Welche Information stammt aus dem Führungsablauf, und welche unmittelbare Wahrnehmung könnte ich überhaupt haben?'],
 ['dienst',/befehl|dienst|geheim|rang|major|pilot|abschuss|verantwort|koch|verwandt/i,
 'Ich bin Oberstleutnant und war Duty Controller. Koch ist der Major und Pilot des Abschusses; ich bin mit ihm weder verwandt noch verschwägert.',
 'Ich sage über den dienstlichen Ablauf aus. Kochs eigene Entscheidung darf ich nicht in eine eigene Pilotenerinnerung umschreiben.',
 'Dienstgeheimnisse begrenzen meine Aussagebefugnis. Das ist weder ein Beweis für ein bestimmtes Geheimnis noch eine Erlaubnis, fehlende Informationen zu erfinden.',
 'Schlagt die Belehrung und meine Aussage nach. Unterscheidet Dienstgrad, Funktion, Befehlskette und persönliche Verantwortung.']
 ],
 vorsitz:[
 ['urteil',/urteil|freispruch|verurteil|\bende\b|abstimm|publikum|entscheid/i,
 'Ich leite die Verhandlung als Vorsitzender. Das Stück enthält Freispruch und Verurteilung als alternative Urteilsfassungen; ich darf keines davon als einziges feststehendes Ende ausgeben.',
 'Die Publikumsansprache bezieht die Zuschauenden in die Urteilsfrage ein. Die beiden Fassungen halten unterschiedliche Begründungen zur Prüfung bereit.',
 'Eine Abstimmung ersetzt keine Begründung. Als Lektüreaufgabe müsst ihr prüfen, welche Argumente eine jeweilige Urteilsfassung trägt und welche Einwände offenbleiben.',
 'Vergleicht beide Urteilsfassungen und die Ansprache an das Publikum. Fragt auch, wie sich dadurch eure eigene Rolle als Zuschauende verändert.'],
 ['leitung',/richter|vorsitz|name|nelson|biegler|anklage|verteidig|neutral|personal|verhandlung/i,
 'Ich bin der Vorsitzende der Strafkammer. Nelson vertritt die Anklage, Biegler die Verteidigung. Mein persönlicher Name ist im Profil nicht belegt.',
 'Ich leite das Verfahren, nehme Personalien auf, belehre und stelle Fragen. Das macht mich nicht zum Ankläger oder Verteidiger.',
 'Meine Leitung der Verhandlung ist von den Positionen der Parteien zu unterscheiden. Prüft meine konkreten Fragen, statt mir eine erfundene private Motivation zuzuschreiben.',
 'Untersucht Sitzungseröffnung, Belehrungen und Gesprächsführung: Wie verteilt der Vorsitzende das Wort und lenkt die Aufmerksamkeit?']
 ],
 koch:[
 ['entscheidung',/entscheid|abschuss|abgeschossen|befehl|verantwort|opfer|rechtfert|schuld|gewissen|boris|sohn|famil|vater|verheirat|kinderlos/i,
 'Boris ist mein Sohn; ich bin verheiratet. Bei meiner Entscheidung habe ich an meine Frau und meinen Sohn gedacht. Den Abschuss habe ich selbst entschieden, nicht auf einen Abschussbefehl hin.',
 'Als mögliche Deutung meiner Haltung: Ich wollte die Menschen im Stadion retten. Dass ich selbst Vater bin, beseitigt den Konflikt mit dem Lebensrecht der Passagiere nicht.',
 'Die Frage, ob ich anders gehandelt hätte, wenn Boris an Bord gewesen wäre, ist hypothetisch. Eine sichere Antwort darauf darf ich nicht als Aussage aus dem Stück erfinden.',
 'Prüft meine Aussage über Frau und Sohn sowie meine Befragung zur Entscheidung. Meine Kenntnis der Lage ist von Gewissheit über das Innere der Passagiermaschine zu trennen.']
 ]
};
const family=/famil|verheirat|ledig|kinderlos|ehefrau|ehemann|\b(sohn|söhne|tochter|töchter|kinder|kind|boris)\b|(?:ihre?|deine?|meine?) (?:frau|mann)|(?:sind sie|bist du) (?:vater|mutter)/i;
const follow=/^(und\b|aber\b|warum\b|weshalb\b|wieso\b|was (?:heisst|bedeutet|folgt)|wie (?:begründen|belegen|erklären)|können sie das|was sagen sie (?:dazu|ihm)|was dann|wo\b|ist das\b|war das\b|war der erfolg\b)/i;
export function topicAnswer(id,question,history){
 const q=question.normalize('NFKC').trim();if(!q)return null;
 const entries=topics[id]||[];
 let entry=entries.find(e=>e[1].test(q));
 const last=history.filter(m=>m.role==='assistant').at(-1);
 const previousQuestion=history.filter(m=>m.role==='user').at(-1)?.content||'';
 if(!entry&&/wohn|geburts|frühstück|hauptstadt|wie alt|wie heiss|beruf/i.test(q))return null;
 if(!entry&&follow.test(q))entry=entries.find(e=>e[0]===last?.identityTopic)||entries.find(e=>e[1].test(previousQuestion));
 // Family claims about figures with no documented private biography must not become invented motives.
 if(family.test(q)&&!['koch','meiser'].includes(id)){
  const base='Zu meiner Familie macht das Stück hier keine gesicherten Angaben. Daraus folgt nicht, dass ich kinderlos bin.';
  const specifics=/boris/i.test(q)?' Boris ist Kochs Sohn, nicht ein belegter Sohn von mir.':/name|heiss/i.test(q)?' Einen Namen für angebliche Angehörige kann ich deshalb nicht nennen.':/warum|motiv|haltung|beeinfluss/i.test(q)?' Meine Haltung ist an meiner Prozessrolle und meinen Argumenten zu prüfen, nicht an einer erfundenen Familiengeschichte.':' Eine angenommene eigene Elternrolle darf ich nicht als Tatsache ausgeben.';
  return {text:base+specifics,topic:'privat',origin:'profile'};
 }
 if(!entry&&last?.identityTopic==='privat'&&follow.test(q))return {text:/name|heiss/i.test(q)?'Auch einen Namen kann ich nicht nennen: Diese private Person ist im Stück nicht als mein Angehöriger belegt.':'Aus dieser Lücke folgt keine private Lebensgeschichte. Bitte prüfen wir stattdessen meine konkrete Aussage im Verfahren.',topic:'privat',origin:'profile'};
 if(!entry)return null;
 let facet=/beleg|text|stelle|wo steht|wo kann|vergleichen|nachweis|woher/i.test(q)?3:/wenn|hätte|würde|einwand|trotz|gegenargument|aber|sicher/i.test(q)?2:/warum|weshalb|wieso|begründen|bedeut|folg|motiv/i.test(q)?1:0;
 const prior=history.filter(m=>m.role==='assistant'&&m.identityTopic===entry[0]);
 if(/^(warum|weshalb|wieso)\b/i.test(q)&&!/wenn|hätte|würde/i.test(q))facet=1;
 // A bare follow-up develops the same subject rather than replaying its opening statement.
 if(follow.test(q)&&!entries.some(e=>e[1].test(q))&&!/beleg|text|stelle|wo steht|wo kann|vergleichen|nachweis|woher|warum|weshalb|wieso|begründen|bedeut|folg|motiv|wenn|hätte|würde|einwand|trotz|gegenargument|aber|sicher/i.test(q))facet=(prior.length)%4;
 let text=entry[facet+2];
 // Keep the anchor concise; never replace the concrete answer by the complete profile.
 const anchor=id==='koch'?'Boris ist mein Sohn, im Stück zwei Jahre alt; ich bin verheiratet. ':id==='meiser'?'Ich bin Franziska Meiser, Nebenklägerin und Zeugin; meine Tochter ist sieben. ':'';
 if(anchor&&!text.includes(id==='koch'?'Boris ist mein Sohn':'sieben'))text=anchor+text;
 return {text,topic:entry[0],origin:'reviewed'};
}
