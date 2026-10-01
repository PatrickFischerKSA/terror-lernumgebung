import assert from 'node:assert/strict';
const base=process.env.ROOM_API||'http://127.0.0.1:8787';
async function req(path,body,token){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Origin:'https://patrickfischerksa.github.io','Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
const made=await req('/ballots',{});assert.equal(made.status,200);const {code,token}=made.data,path='/ballots/'+code;
assert(!('token' in (await req(path)).data));assert(!('counts' in made.data));
const votes=await Promise.all(Array.from({length:24},(_,i)=>req(path+'/vote',{voter:i.toString(16).padStart(64,'0'),choice:i<15?'schuldig':'unschuldig'})));assert(votes.every(r=>r.status===200));
assert.equal((await req(path)).data.total,24);assert(!('counts' in (await req(path)).data));
await req(path+'/vote',{voter:'0'.repeat(64),choice:'unschuldig'});await req(path+'/vote',{voter:'0'.repeat(64),choice:'unschuldig'});
assert.equal((await req(path)).data.total,24);
assert.equal((await req(path+'/vote',{voter:'bad',choice:'schuldig'})).status,400);
assert.equal((await req(path+'/close',{},'wrong')).status,403);
const closed=await req(path+'/close',{},token);assert.deepEqual(closed.data.counts,{schuldig:14,unschuldig:10});
assert.equal((await req(path+'/vote',{voter:'f'.repeat(64),choice:'schuldig'})).status,409);
assert.deepEqual((await req(path)).data.counts,closed.data.counts);
const missing=await req('/ballots/000000000000');assert.equal(missing.status,404);
console.log('PASS: 24 concurrent voters; hidden counts; duplicate/update semantics; invalid input; host-only closure; final counts; closed vote rejection; missing room.');
