const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const c={};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('dist/data.js','utf8'),c);vm.runInContext(fs.readFileSync('dist/feedback.js','utf8'),c);const F=c.window.TERROR_FEEDBACK,D=c.window.TERROR;
assert.equal(Object.keys(F.rubrics).length,36);
for(const m of D.modules)for(let i=0;i<m.tasks.length;i++){
 const id=m.id+'-'+i,r=F.rubrics[id];assert(r,id);assert(r.answer.length>150,id);assert(r.refs.length,id);
 for(const cr of r.criteria){for(const key of cr.groups)assert(F.lexicon[key],id+': '+key);assert(cr.reason&&cr.page>=1&&cr.page<=103,id);}
 for(const [p,label]of r.refs)assert(Number.isInteger(p)&&p>=1&&p<=103&&label,id);
 assert.equal(F.check(id,'').status,'empty',id);assert.equal(F.check(id,'Ich mag Pizza und gehe morgen spazieren.').found,0,id);
 const model=F.check(id,r.answer);assert.equal(model.errors.length,0,id+' model should not trigger correction');assert.equal(model.found,3,id+' model aspects: '+model.criteria.filter(x=>!x.match).map(x=>x.label));
}
// Same meaning, deliberately different everyday language and spelling.
const paraphrases=[
 ['meiser-1','Die Kurznachricht berichtet einen Versuch der Selbstrettung. Ein Gelingen ist damit keineswegs gesichert. Ob der Kampfpilot davon wusste, ist nicht belegt.',3],
 ['meiser-1','Die Nachricht zeigt die Absicht, sich zu wehren. Die Rettung bleibt ungewiss. Koch kannte diese Nachricht nicht.',3],
 ['biegler-0','Die verfassungsrechtliche Ermächtigung des Staates ist von der persönlichen Schuld zu trennen. Aus dem Urteil über das Gesetz folgt nicht automatisch die individuelle Strafbarkeit.',3],
 ['auftakt-0','Vor dem Vorhang steht der Richter. Er zieht seine Amtstracht erst beim Abgehen an. Durch die unmittelbare Ansprache der Zuschauenden erzeugt er Nähe.',3],
 ['evakuierung-0','Niemand hat die Arena evakuiert. Im Notfallplan werden 15 Minuten für die Räumung genannt. Die Vorgesetzten vertrauten darauf, dass Koch schiessen würde.',3],
 ['lauterbach-2','Militärische Terminologie erzeugt einen Wissensvorsprung. Die Nachfragen des Richters übersetzen Renegade in verständliche Sprache. Das vermittelt dem Zeugen Autorität.',3],
 ['biegler-2','Das Wir konstruiert Zusammengehörigkeit. Die Behauptung eines Krieges schafft ein Feindbild. Ein rechtlicher Kategorienwechsel ist damit nicht bewiesen.',3]
];
for(const[id,text,n]of paraphrases)assert.equal(F.check(id,text).found,n,'paraphrase: '+id+' '+text);
for(const [text,error]of [
 ['Die SMS beweist die sichere Rettung.','sms-erfolg'],['Das Stadion wurde rechtzeitig geräumt.','raeumung'],['Koch hat die SMS gelesen.','sms-wissen'],['Koch hat den Abschussbefehl befolgt.','befehl'],['Koch befolgte den Abschussbefehl.','befehl'],['Nelson ist die Verteidigerin.','rollen-nelson'],['Lauterbach hat das Flugzeug abgeschossen.','lauterbach-schuss']
]){const r=F.check('meiser-1',text);assert(r.errors.some(x=>x.id===error),text);assert.equal(r.status,'revise');assert(r.errors.every(x=>x.correction&&x.page&&x.anchor));}
for(const text of ['Die SMS beweist nicht die sichere Rettung.','Das Stadion wurde nicht geräumt.','Die Behauptung, die SMS beweise die sichere Rettung, ist falsch.','„Die SMS beweist die sichere Rettung“ ist eine falsche Behauptung.','Koch hat die SMS nicht gelesen.','Nelson ist keine Verteidigerin.'])assert.equal(F.check('meiser-1',text).errors.length,0,text);
assert.equal(F.normalize('Würde, ÄUSSERUNG, Größe und Äußerung'),F.normalize('Wuerde, AEUSSERUNG, Groesse und Aeusserung'));
assert(F.check('nelson-2','Die Menschnwuerde ist eine universelle Grenze.').criteria.some(c=>c.match?.fuzzy));
assert.equal(F.check('meiser-1','Die SMS berichtet keinen Versuch.').criteria[0].match,null);
console.log('Feedback: 36 rubrics, all reference answers, synonym paraphrases, errors, negations, quotations, spelling and PDF references passed.');
