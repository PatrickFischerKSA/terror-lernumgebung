import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const base=process.env.ROOM_API||'http://127.0.0.1:8787',config=JSON.parse(await readFile(new URL('../library/private/config.json',import.meta.url)));
const policy=JSON.parse(await readFile(new URL('../library/policy.json',import.meta.url)));
async function req(path,body,secret){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(secret?{Authorization:'Bearer '+secret}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
assert.equal((await req('/library/bridge',{ready:true},'wrong')).status,401);
assert.equal((await req('/library/bridge',{ready:true,model:'test-model',policy},config.secret)).status,200);
const judge=(await req('/rooms',{})).data;const path='/rooms/'+judge.code+'/library';
const other=(await req('/rooms/'+judge.code+'/join',{role:'koch'})).data;
assert.equal((await req(path,null,other.token)).status,403);
assert.equal((await req(path,{question:'Was bedeutet Menschenwürde?'},judge.token)).status,202);
assert.equal((await req(path,{question:'Eine zweite Frage?'},judge.token)).status,429);
const job=(await req('/library/bridge',{ready:true,model:'test-model',policy,take:true},config.secret)).data.job;assert.equal(job.room,judge.code);
assert.equal((await req('/library/bridge',{ready:true,model:'test-model',policy,take:true},config.secret)).data.job,null);
await req('/library/bridge',{ready:true,model:'test-model',policy,result:{id:job.id,lease:job.lease,answer:'Testbeleg',sources:[]}},config.secret);
assert.equal((await req(path,null,judge.token)).data.jobs[0].answer,'Testbeleg');
assert.equal((await req('/rooms/'+other.code+'/library',null,'0'.repeat(64))).status,403);
// Remove the test room and its private library records.
const {default:WebSocket}=await import('ws');const ws=new WebSocket(base.replace(/^http/,'ws')+'/rooms/'+judge.code+'/socket',['terror-v1',judge.token]);await new Promise((r,j)=>{ws.on('open',r);ws.on('error',j);});ws.send(JSON.stringify({type:'delete',id:crypto.randomUUID()}));await new Promise(r=>ws.on('close',r));
console.log('PASS: bridge secret, judge-only access, bounded queue, lease, result, room deletion.');
