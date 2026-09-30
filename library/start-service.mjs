import {spawn} from 'node:child_process';
import {homedir} from 'node:os';
import {setTimeout as sleep} from 'node:timers/promises';
const lms=homedir()+'/.lmstudio/bin/lms';
const run=(args)=>new Promise((resolve,reject)=>{const p=spawn(lms,args,{stdio:'ignore'});p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(Error('LM Studio: '+args[0]+' fehlgeschlagen.')));});
async function ready(){try{const r=await fetch('http://127.0.0.1:1234/v1/models',{signal:AbortSignal.timeout(5000)});return (await r.json()).data?.some(x=>x.id==='terror-richter');}catch{return false;}}
while(!await ready()){try{await run(['server','start','--bind','127.0.0.1','--port','1234']);await run(['load','mistral-small-3.2-24b-instruct-2506','--identifier','terror-richter','--context-length','16384','-y']);}catch(e){console.error(new Date().toISOString(),e.message);await sleep(30000);}}
await import('./bridge.mjs');
