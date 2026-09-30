import {readFile} from 'node:fs/promises';
import {setTimeout as sleep} from 'node:timers/promises';
import {corpus,settings,answer} from './retrieval.mjs';
const config=JSON.parse(await readFile(process.argv[2]||new URL('./private/config.json',import.meta.url),'utf8'));
const docs=await corpus();let busy=false,stopping=false;
async function status(){try{const r=await fetch('http://127.0.0.1:1234/v1/models',{signal:AbortSignal.timeout(4000)});const j=await r.json();return j.data?.some(m=>m.id===config.model)||false;}catch{return false;}}
async function poll(take=false,result){const {policy}=await settings();const response=await fetch(config.endpoint+'/library/bridge',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+config.secret},body:JSON.stringify({ready:await status(),model:config.model,policy,take,result}),signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Bibliotheksverbindung HTTP '+response.status);return response.json();}
async function work(job){try{const result=await answer(job.question,job.variant,job.policy,docs,config.model);await poll(false,{id:job.id,lease:job.lease,...result});console.log(new Date().toISOString(),'Beratung abgeschlossen.');}catch(e){console.error(new Date().toISOString(),e.message);try{await poll(false,{id:job.id,lease:job.lease,error:true,answer:'Die lokale Beratung ist fehlgeschlagen. '+e.message,sources:[]});}catch{}}finally{busy=false;}}
process.on('SIGTERM',()=>{stopping=true;});process.on('SIGINT',()=>{stopping=true;});
console.log('Richterbibliothek gestartet. Modell:',config.model,'Lokale Abschnitte:',docs.length);
while(!stopping){try{const {job}=await poll(!busy);if(job){busy=true;void work(job);}}catch(e){console.error(new Date().toISOString(),e.message);}await sleep(5000);}
