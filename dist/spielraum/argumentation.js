// Adapted conceptually from PatrickFischerKSA/argumentationspruefer, server.js,
// commit 372e4351177bb49bc71a7a14c17bd9f7d41bb7bf. No external API or scoring.
export const THINKING = [
 ['dilemma','Nur zwei Möglichkeiten?','entweder.{0,140}oder','Welche dritte Möglichkeit wurde geprüft? Eine Alternative muss damals erreichbar gewesen sein.','F04 / F06; Argumentationslehre S. 2'],
 ['majority','Mehrheit als Wahrheitsbeweis?','(alle|mehrheit|die meisten).{0,100}(recht|richtig|stimmt|freisprechen)','Zeigt die Zustimmung, dass der Grund stimmt? Suche einen unabhängigen Sach- oder Rechtsgrund.','Argumentationslehre S. 2'],
 ['person','Person statt Argument?','(dumm|idiot|naiv|herzlos|unmenschlich|keine ahnung)','Wird eine konkrete Begründung widerlegt oder nur die Person abgewertet? Formuliere den Einwand sachlich.','Argumentationslehre S. 2'],
 ['ignorance','Fehlender Beweis als Beweis?','(niemand|keiner|nicht).{0,40}(bewiesen|beweisen|widerlegt).{0,100}(also|deshalb|darum|folglich)','Folgt die Behauptung wirklich aus der Beweislücke? Achtung: Die strafrechtliche Behandlung verbleibender Zweifel ist nicht einfach dieser Fehlschluss.','Argumentationslehre S. 3'],
 ['slope','Unvermeidliche Katastrophe?','(dann|sonst).{0,100}(immer|jeder|chaos|willkür|willkuer)','Welche Zwischenschritte und Belege tragen diese Folgenprognose? Risiken dürfen diskutiert werden; ihre Unvermeidlichkeit braucht Gründe.','Argumentationslehre S. 3'],
 ['certainty','Prognose oder gesicherte Tatsache?','(sowieso|ohnehin|auf jeden fall|ganz sicher|hundertprozentig).{0,80}(tot|gestorben|sterben|einschlag|abgestürzt)','Der Verlauf ohne Abschuss ist unbekannt. Trenne eine hohe Gefahr von Gewissheit. Welche Information hatte Koch damals?','F05–F07; PDF-S. 51–52, 68–71'],
 ['numbers','Zahlen ersetzen einen Rechtsgrund?','(70000|70[’\x27. ]000|mehr menschen).{0,100}(164|weniger).{0,100}(also|deshalb|darum|richtig|erlaubt)','Die Opferzahlen beschreiben den Konflikt. Welche zusätzliche Regel soll daraus die Erlaubnis ableiten? Prüfe Würde und Lebensschutz.','F01; GG Art. 1 und 2; StGB § 34'],
 ['authority','Autorität prüfen','(experte|professor|prominent|minister).{0,90}(sagt|meint).{0,90}(also|deshalb|stimmt)','Ist die Person für diese Frage zuständig? Welche Gründe und Belege nennt sie? Fachwissen ist nicht schon ein Fehlschluss.','Argumentationslehre S. 2'],
 ['analogy','Trägt der Vergleich?','(genauso wie|vergleichbar mit|ist wie|wie bei)','Welche Gemeinsamkeit ist entscheidend? Welcher Unterschied könnte den Schluss verhindern?','Argumentationslehre S. 1 und 3'],
 ['tradition','Alt oder neu als einziger Grund?','(schon immer|noch nie|neuartig|brandneu)','Warum sollte Alter oder Neuheit die Richtigkeit beweisen? Ergänze einen sachlichen Grund.','Argumentationslehre S. 3']
];
export const MANUAL = [
 ['Zirkelschluss','Wiederholt die Begründung nur die Behauptung? Suche einen unabhängigen Grund.','S. 2'],
 ['Strohmann','Würde die Gegenseite ihre Position in deiner Wiedergabe wiedererkennen? Zitiere ihren tatsächlichen Einwand.','S. 3'],
 ['Gefühl und Argument','Trauer und Empathie sind nicht automatisch Denkfehler. Prüfe, ob ein Gefühl einen nötigen Beleg ersetzen soll.','S. 2'],
 ['Drohung','Wird eine Behauptung durch Einschüchterung statt durch Gründe gestützt?','S. 2'],
 ['Wunsch und Wahrheit','Ist etwas belegt oder nur erwünscht? Die Folgen einer Entscheidung und die Wahrheit einer Tatsachenbehauptung unterscheiden.','S. 3'],
 ['Ablenkung','Beantwortet der Beitrag die strittige Frage oder verschiebt er das Thema?','S. 3'],
 ['Teil und Ganzes','Wird eine Eigenschaft einzelner Personen auf alle übertragen – oder umgekehrt?','S. 3'],
 ['Mehrdeutige Begriffe','Bedeutet „Schuld“, „Verantwortung“ oder „Recht“ am Anfang und Ende dasselbe?','S. 3–4'],
 ['Scheinkausalität','Beweist das zeitliche Zusammentreffen eine Ursache? Welche andere Erklärung kommt infrage?','S. 2'],
 ['Schluss ohne Verbindung','Welche zusätzliche, bisher ungenannte Annahme wäre nötig, damit die Schlussfolgerung trägt?','S. 3']
];
const normalize=s=>s.toLowerCase().replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue');
export function analyse(text){
 const sentences=String(text).slice(0,12000).split(/(?<=[.!?])\s+|\n+/).filter(Boolean);
 const flags=[];
 for(const [id,title,pattern,question,source] of THINKING){const re=new RegExp(normalize(pattern),'iu');const sentence=sentences.find(s=>re.test(normalize(s)));if(sentence)flags.push({id,title,question,source,excerpt:sentence.slice(0,350),reported:/[„“”"]|\b(nicht|kein|keine|falsch|behauptet|widerspreche|bestreite|kritisiere)\b/i.test(sentence)});}
 const structure=[['These','ich (finde|meine|behaupte)|meiner meinung|wir (entscheiden|halten)|sollte|muss'],['Begründung','\\b(weil|denn|deshalb|daher|darum)\\b'],['Beleg','\\b(F\\d{2}|PDF|Beleg|Quelle|Aussage|SMS)\\b|§|Art\\.'],['Gegenargument','allerdings|jedoch|andererseits|einwand|gegenargument|obwohl|trotzdem'],['Schluss','folglich|somit|fazit|daraus|deshalb|darum']].map(([label,p])=>({label,found:new RegExp(p,'iu').test(text)}));
 return {flags,structure};
}
export function formCheck(premise,conclusion){return premise==='a'&&conclusion==='b'?'Aus „Wenn A, dann B“ und A folgt B (Modus ponens). Ob die Prämissen zutreffen, musst du gesondert belegen.':premise==='notb'&&conclusion==='nota'?'Aus „Wenn A, dann B“ und nicht B folgt nicht A (Modus tollens). Auch hier müssen die Prämissen zutreffen.':premise==='b'&&conclusion==='a'?'So folgt A nicht zwingend: B kann andere Ursachen haben. Das ist die Bejahung der Folge (PDF S. 2). Als plausible Erklärung wäre A erst gegen Alternativen zu prüfen.':premise==='nota'&&conclusion==='notb'?'So folgt nicht B nicht zwingend: B kann auch ohne A eintreten. Das ist die Verneinung der Voraussetzung (PDF S. 2).':'Diese Auswahl liefert aus „Wenn A, dann B“ allein keinen solchen notwendigen Schluss. Formuliere die fehlende Prämisse.';}
export const SOURCES='Grundlage: Argumentationslehre.pdf, S. 1–4 (bereitgestelltes Unterrichtsmaterial); lokale Strukturprüfung nach den Prüfideen aus PatrickFischerKSA/argumentationspruefer. Redaktionell für Terror angepasst. Deduktive Gültigkeit, wahre Prämissen und die Plausibilität induktiver/abduktiver Schlüsse werden getrennt.';
