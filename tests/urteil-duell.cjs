const fs=require('fs'),vm=require('vm'),assert=require('assert');
const els={},storage={};const el=id=>els[id]??={innerHTML:'',value:'',textContent:'',classList:{toggle(){},add(){},remove(){}},querySelectorAll:()=>[],querySelector:()=>el('nested'),addEventListener(){},scrollIntoView(){}};
const ctx={console,document:{querySelector:el,getElementById:el},localStorage:{getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v},setTimeout(){}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/urteil-duell/app.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('VERDICT_QUESTIONS.length'),10);assert.equal(run('DUEL_PROMPTS.length'),7);assert.equal(run('PREP_MODULES.length'),4);
run('VERDICT_QUESTIONS.forEach(q=>setVerdictAnswer(q.id,q.options[0].id));showVerdictResult()');assert.equal(run('getVerdictEvaluation().steps.length'),10);assert(run('state.verdict.showResult'));assert(els['#verdictResultPanel'].innerHTML.length>1000);
run('startDuel()');for(let i=0;i<7;i++){run("updateDuelText('attack','Meine These ist: Menschenwürde schützt jeden Menschen, weil niemand bloss Mittel sein darf. Artikel 1 ist der Bezug.');updateDuelText('response','Du sagst, dass Würde absolut gilt. Aber auch das Unterlassen hat Folgen, weil Menschen im Stadion gefährdet sind. Das muss geprüft werden.');judgeCurrentRound()");assert.equal(run('state.duel.history.length'),i+1);assert.equal(run('state.duel.attacker'),run('state.duel.history.at(-1).loser'));}
assert.equal(run('state.duel.scores.a+state.duel.scores.b'),7);assert.equal(run('hydrateState(JSON.parse(localStorage.getItem(STORAGE_KEY))).duel.history.length'),7);
run('startDuel(true)');assert.equal(run('state.duel.history.length'),0);assert.equal(run('state.duel.revengeCount'),1);
assert(run("escapeHtml('<script>')").includes('&lt;'));assert(!fs.readFileSync('dist/urteil-duell/index.html','utf8').includes('KI-Schiedsrichter'));
console.log('PASS: all 10 verdict stations, 4 preparation modules, 7 duel rounds, loser opens next round, persistence, rematch, escaped inputs.');
