const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('dist/verhandlungspoker/app.js','utf8').split("const desktopApp =")[0];
const ctx={URL,TextEncoder,TextDecoder,Uint8Array,console,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),window:{location:{href:'https://patrickfischerksa.github.io/terror-lernumgebung/verhandlungspoker/'}}};
vm.createContext(ctx);vm.runInContext(source+'\nlet state=createInitialState();',ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('ROLE_ORDER.length'),6);assert.equal(run('ROUNDS.length'),13);
assert.equal(run('decodePayload(encodePayload({text:"Würde & Verantwortung"})).text'),'Würde & Verantwortung');
assert.equal(run('decodePayload("bad!")'),null);
for(const role of run('ROLE_ORDER')){
 const invite=run(`buildInviteUrl(${JSON.stringify(role)},'2')`);const url=new URL(invite);
 assert.equal(url.pathname,'/terror-lernumgebung/verhandlungspoker/');assert.equal(url.searchParams.get('phone'),'2');
 assert.equal(run(`decodePayload(${JSON.stringify(url.searchParams.get('payload'))}).o`),role);
 assert.equal(run(`parseAnswerCode(buildAnswerCode('ABCD',12,${JSON.stringify(role)},2)).roundIndex`),12);
 assert.equal(run(`parseDetailedAnswerPackage(buildDetailedAnswerPackage(buildCompanionInvite(${JSON.stringify(role)}),{voteChoiceIndex:1,voteReason:'Menschenwürde',cardId:'test'})).voteReason`),'Menschenwürde');
}
const html=fs.readFileSync('dist/index.html','utf8');assert(html.includes('poker-integration.js'));
assert(fs.existsSync('dist/verhandlungspoker/vendor/qrcode.js'));
console.log('Verhandlungspoker: 6 Rollen, 13 Runden, Unicode, lokale QR-Einladungen und Antwortpakete geprüft.');
