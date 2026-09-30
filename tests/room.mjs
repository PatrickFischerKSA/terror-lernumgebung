import assert from 'node:assert/strict';
import WebSocket from 'ws';
import {setTimeout as delay} from 'node:timers/promises';
const BASE=process.env.ROOM_API||'http://127.0.0.1:8787';
const ORIGIN=BASE.includes('localhost')||BASE.includes('127.0.0.1')?'http://127.0.0.1:8769':'https://patrickfischerksa.github.io';
async function req(path,body){const r=await fetch(BASE+path,{method:body?'POST':'GET',headers:{Origin:ORIGIN,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
const clients=[];
async function rejectedSocket(s,origin=ORIGIN){return await new Promise((resolve,reject)=>{const ws=new WebSocket(BASE.replace(/^http/,'ws')+'/rooms/'+s.code+'/socket',['terror-v1',s.token],{origin});ws.on('unexpected-response',(_req,res)=>{res.resume();resolve(res.statusCode);ws.terminate();});ws.on('open',()=>{ws.terminate();reject(Error('Unauthorised socket accepted'));});ws.on('error',()=>{});});}
async function client(s){const ws=new WebSocket(BASE.replace(/^http/,'ws')+'/rooms/'+s.code+'/socket',['terror-v1',s.token],{origin:ORIGIN});const c={ws,session:s,events:[],state:null};ws.on('message',raw=>{const m=JSON.parse(raw);c.events.push(m);if(m.type==='state')c.state=m.state;});clients.push(c);await new Promise((resolve,reject)=>{ws.on('open',resolve);ws.on('error',reject);});await until(()=>c.state);return c;}
async function until(fn){for(let i=0;i<100;i++){if(fn())return;await delay(50);}throw Error('Timed out waiting for event');}
async function action(c,type,data={},sameId){await delay(450);const id=sameId||crypto.randomUUID();const offset=c.events.length;c.ws.send(JSON.stringify({type,id,...data}));await until(()=>c.events.slice(offset).some(e=>(e.type==='ack'||e.type==='error')&&e.id===id));return c.events.slice(offset).find(e=>(e.type==='ack'||e.type==='error')&&e.id===id);}
let judge;
try{
 const opened=await req('/rooms',{});assert.equal(opened.status,200);judge=await client(opened.data);const code=opened.data.code;
 assert.equal(await rejectedSocket({...opened.data,token:'a'.repeat(64)}),401);
 assert.equal(await rejectedSocket(opened.data,'https://untrusted.example'),403);
 const contests=await Promise.all([req('/rooms/'+code+'/join',{role:'koch'}),req('/rooms/'+code+'/join',{role:'koch'})]);assert.deepEqual(contests.map(x=>x.status).sort(),[200,409]);const koch=await client(contests.find(x=>x.status===200).data);
 const others=[];for(const role of ['biegler','nelson','lauterbach','meiser']){const r=await req('/rooms/'+code+'/join',{role});assert.equal(r.status,200);others.push(await client(r.data));}
 await until(()=>clients.every(c=>c.state.people.filter(p=>p.online).length===6));
 const read=await req('/rooms/'+code);assert.equal(read.data.roles.length,6);assert(!JSON.stringify(read).includes('messages'));assert(!JSON.stringify(judge.state).includes('hash'));assert(!JSON.stringify(judge.state).includes('token'));
 assert.equal((await action(koch,'control',{phase:9,floor:'koch'})).type,'error');assert.equal((await action(koch,'delete')).type,'error');
 assert.equal((await action(judge,'control',{phase:4,floor:'lauterbach'})).type,'ack');
 assert.equal((await action(koch,'chat',{text:'I should not have the floor',kind:'aussage'})).type,'error');
 assert.equal((await action(koch,'hand',{raised:true})).type,'ack');await until(()=>judge.state.people.find(p=>p.role==='koch').raised);
 assert.equal((await action(koch,'chat',{text:'Einwand: Bitte den Wissensstand prüfen.',kind:'einwand'})).type,'ack');
 assert.equal((await action(judge,'control',{phase:4,floor:'alle'})).type,'ack');
 const id=crypto.randomUUID(),text='Synchronisationstest <script>alert(1)</script> · F02 Nicht-Abschussbefehl';
 assert.equal((await action(koch,'chat',{text,kind:'aussage'},id)).type,'ack');
 await until(()=>clients.every(c=>c.state.messages.some(m=>m.text===text)));
 assert.equal((await action(koch,'chat',{text,kind:'aussage'},id)).type,'ack');assert.equal(koch.state.messages.filter(m=>m.text===text).length,1);
 assert.equal((await action(judge,'variant',{variant:'kontakt'})).type,'error');
 assert.equal((await action(judge,'control',{phase:0,floor:'alle'})).type,'ack');assert.equal((await action(judge,'variant',{variant:'kontakt'})).type,'ack');
 const former=others[3];former.ws.close();await until(()=>judge.state.people.find(p=>p.role==='meiser')?.online===false);
 assert.equal((await action(judge,'release',{role:'meiser'})).type,'ack');
 assert.equal(await rejectedSocket(former.session),401);
 const replacement=await req('/rooms/'+code+'/join',{role:'meiser'});assert.equal(replacement.status,200);await client(replacement.data);
 const before=koch.state.messages.length;koch.ws.close();await delay(200);const resumed=await client(koch.session);assert(resumed.state.messages.length>=before);assert.equal(resumed.state.variant,'kontakt');
 assert.equal((await action(judge,'release',{role:'koch'})).type,'error');
 const fields=Object.fromEntries(['tenor','facts','evidence','offence','justification','excuse','counter','reasons'].map(k=>[k,'Testbegründung mit genügend Zeichen: '+k]));
 assert.equal((await action(judge,'verdict',{fields})).type,'error');assert.equal((await action(judge,'control',{phase:9,floor:'richter'})).type,'ack');
 assert.equal((await action(others[0],'verdict',{fields})).type,'error');assert.equal((await action(judge,'verdict',{fields})).type,'ack');await until(()=>resumed.state.phase===10&&resumed.state.messages.some(m=>m.kind==='urteil'));
 assert.equal((await action(judge,'close')).type,'ack');assert.equal((await action(resumed,'chat',{text:'Closed chat',kind:'organisation'})).type,'error');assert.equal((await req('/rooms/'+code+'/join',{role:'koch'})).status,410);
 // Deletion invalidates all sessions and removes the room.
 await delay(450);judge.ws.send(JSON.stringify({type:'delete',id:crypto.randomUUID()}));await until(()=>judge.events.some(e=>e.type==='deleted'));await delay(150);const deleted=await req('/rooms/'+code);assert([404,410].includes(deleted.status),JSON.stringify(deleted));
 console.log('PASS: six clients, atomic role claims, private credentials, invalid-token and origin rejection, offline role recovery, judge authorisation, floor, objections, hands, ordered shared chat, deduplication, reconnect, variants, verdict, closure, deletion.');
}catch(e){console.error(e);process.exitCode=1;}finally{for(const c of clients)c.ws.terminate();}
