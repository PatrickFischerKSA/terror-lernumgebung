import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import WebSocket from 'ws';
const base=process.env.ROOM_API||'http://127.0.0.1:8787',secret=JSON.parse(await readFile(new URL('../library/private/config.json',import.meta.url))).secret,policy=JSON.parse(await readFile(new URL('../library/policy.json',import.meta.url)));
async function req(path,body,token){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
const poll=(id,extra={})=>req('/library/bridge',{bridgeId:id,ready:true,model:id,policy,publishPolicy:id==='test-primary',...extra},secret);
const rooms=[];
try{
 await poll('test-primary');await poll('test-windows',{policy:{...policy,version:'WRONG'}});
 for(let i=0;i<2;i++)rooms.push((await req('/rooms',{})).data);
 const path='/rooms/'+rooms[0].code+'/library';assert.equal((await req(path,null,rooms[0].token)).data.policy.version,policy.version);
 await poll('test-primary',{ready:false});assert.equal((await req(path,null,rooms[0].token)).data.online,true);
 await req(path,{question:'Welche Belege sind gesichert?'},rooms[0].token);
 const claims=await Promise.all([poll('test-primary',{take:true}),poll('test-windows',{take:true})]);const jobs=claims.map(x=>x.data.job).filter(Boolean);assert.equal(jobs.length,1);const job=jobs[0],owner=job.owner,other=owner==='test-primary'?'test-windows':'test-primary';
 await poll(other,{result:{id:job.id,lease:job.lease,answer:'Fremdes Ergebnis'}});assert.equal((await req(path,null,rooms[0].token)).data.jobs[0].state,'working');
 await poll(owner,{result:{id:job.id,lease:job.lease,answer:'Belegte Beratung'}});assert.equal((await req(path,null,rooms[0].token)).data.jobs[0].answer,'Belegte Beratung');
 await poll('test-primary',{ready:false});await req('/rooms/'+rooms[1].code+'/library',{question:'Welche Regeln gelten hier?'},rooms[1].token);const second=(await poll('test-windows',{take:true})).data.job;assert.equal(second.room,rooms[1].code);assert.equal(second.policy.version,policy.version);
 console.log('PASS: simultaneous exclusive claims, owner-bound results, offline primary failover, central policy preserved.');
}finally{
 for(const r of rooms){const ws=new WebSocket(base.replace(/^http/,'ws')+'/rooms/'+r.code+'/socket',['terror-v1',r.token]);await new Promise((ok,no)=>{ws.on('open',ok);ws.on('error',no);});ws.send(JSON.stringify({type:'delete',id:crypto.randomUUID()}));await new Promise(ok=>ws.on('close',ok));}
 await poll('test-primary',{ready:false});await poll('test-windows',{ready:false});
}
