import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../dist/spielraum/court.js',import.meta.url),'utf8');const send=source.slice(source.indexOf('function send('),source.indexOf('function updateRoom('));
const sent=[],storage=new Map(),ctx={socket:{readyState:1,send:x=>sent.push(JSON.parse(x))},session:{code:'test'},readStore:key=>storage.get(key)||null,putStore:(k,v)=>storage.set(k,v),pending:new Map(),crypto,announce:()=>{},setTimeout:()=>{}};
vm.createContext(ctx);vm.runInContext(send,ctx);
for(const [type,data] of [['rotation',{enabled:false}],['round',{}],['control',{phase:0,floor:'alle'}],['close',{}]]){ctx.send(type,data);assert.equal(sent.at(-1).type,type);assert.match(sent.at(-1).id,/^[a-f0-9-]{36}$/);}
ctx.send('chat',{text:'Beleg',kind:'aussage'});const id=sent.at(-1).id;ctx.send('chat',{text:'Beleg',kind:'aussage'});assert.equal(sent.at(-1).id,id);console.log('PASS: non-chat control IDs and stable chat retry ID.');
