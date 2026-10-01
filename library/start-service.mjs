import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {setTimeout as sleep} from 'node:timers/promises';
const config=JSON.parse(await readFile(new URL('./private/config.json',import.meta.url),'utf8'));
const lms=config.lmsPath||join(homedir(),'.lmstudio','bin',process.platform==='win32'?'lms.exe':'lms');
const run=(args)=>new Promise((resolve,reject)=>{const p=spawn(lms,args,{stdio:'ignore'});p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(Error('LM Studio: '+args[0]+' fehlgeschlagen.')));});
async function ready(){try{const r=await fetch('http://127.0.0.1:1234/v1/models',{signal:AbortSignal.timeout(5000)});return (await r.json()).data?.some(x=>x.id===(config.model||'terror-richter'));}catch{return false;}}
while(!await ready()){try{await run(['server','start','--bind','127.0.0.1','--port','1234']);await run(['load',config.modelKey||'mistral-small-3.2-24b-instruct-2506','--identifier',config.model||'terror-richter','--context-length',String(config.contextLength||16384),'-y']);}catch(e){console.error(new Date().toISOString(),e.message);await sleep(30000);}}
await import('./bridge.mjs');
