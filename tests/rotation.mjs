import assert from 'node:assert/strict';
import WebSocket from 'ws';
import {setTimeout as delay} from 'node:timers/promises';
const base=process.env.ROOM_API||'http://127.0.0.1:8787',clients=[];
const request=async(path,body,token)=>{const r=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};};
async function until(fn){for(let i=0;i<150;i++){if(fn())return;await delay(30);}throw Error('Timeout');}
async function connect(s){const c={s,events:[]};c.ws=new WebSocket(base.replace(/^http/,'ws')+'/rooms/'+s.code+'/socket',['terror-v1',s.token]);c.ws.on('message',raw=>{const m=JSON.parse(raw);c.events.push(m);if(m.type==='identity')c.role=m.role;if(m.type==='state')c.state=m.state;});clients.push(c);await until(()=>c.state);return c;}
async function action(c,type,data={},id=crypto.randomUUID()){await delay(430);const start=c.events.length;c.ws.send(JSON.stringify({type,id,...data}));await until(()=>c.events.slice(start).some(m=>m.id===id));return c.events.slice(start).find(m=>m.id===id);}
let current;
try{
 const opened=(await request('/rooms',{})).data;const judge=await connect(opened);current=judge;
 assert.equal((await action(judge,'round')).type,'error');
 const order=['richter','koch','biegler','nelson','lauterbach','meiser'];for(const role of order.slice(1))await connect((await request('/rooms/'+opened.code+'/join',{role})).data);
 assert.equal((await action(clients[1],'round')).type,'error');
 for(let i=0;i<14;i++)assert.equal((await action(judge,'round')).type,'ack');
 assert.equal(judge.state.rounds,14);assert.equal(judge.role,'richter');
 const id=crypto.randomUUID();assert.equal((await action(judge,'round',{},id)).type,'ack');await until(()=>clients.every((c,i)=>c.role===order[(i+1)%6]));current=clients[5];
 assert.equal(judge.state.rounds,0);assert.equal(judge.state.cycles,1);assert.equal(judge.state.people.filter(p=>p.online).length,6);
 assert.equal((await action(judge,'round')).type,'error');assert.equal((await action(judge,'round',{},id)).type,'ack');assert.equal(judge.state.cycles,1);
 assert.equal((await request('/rooms/'+opened.code+'/library',null,judge.s.token)).status,403);assert.equal((await request('/rooms/'+opened.code+'/library',null,current.s.token)).status,200);
 const reconnect=await connect(judge.s);assert.equal(reconnect.role,'koch');assert.equal((await action(reconnect,'control',{phase:1,floor:'alle'})).type,'error');
 assert.equal((await action(current,'rotation',{enabled:false})).type,'ack');assert.equal((await action(current,'round')).type,'error');assert.equal(current.state.rounds,0);
 assert.equal((await action(current,'rotation',{enabled:true})).type,'ack');assert.equal((await action(current,'round')).type,'ack');assert.equal(current.state.rounds,1);
 console.log('PASS: manual 15-round cycle, six roles, identity and reconnect, permissions, duplicate request, disable and restart.');
}finally{if(current){await delay(450);current.ws.send(JSON.stringify({type:'delete',id:crypto.randomUUID()}));await delay(300);}for(const c of clients)c.ws.terminate();}
