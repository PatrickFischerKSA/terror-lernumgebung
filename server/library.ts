import { DurableObject } from 'cloudflare:workers';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
type Job={id:string;room:string;question:string;variant:string;created:number;state:string;lease?:number;answer?:string;sources?:unknown[];policy?:unknown;model?:string};
type Status={seen:number;ready:boolean;model:string;policy:unknown};
export class JudgeLibrary extends DurableObject<Env>{
  async jobs(){return this.ctx.storage.list<Job>({prefix:'job:'});}
  async cleanup(){const now=Date.now();for(const [key,job] of await this.jobs()){if(now-job.created>3600000)await this.ctx.storage.delete(key);else if(['queued','working'].includes(job.state)&&now-job.created>600000){job.state='error';job.answer='Die lokale Beratung hat nicht rechtzeitig geantwortet. Bitte erneut fragen oder die statische Richterhilfe verwenden.';await this.ctx.storage.put(key,job);}}}
  async fetch(request:Request){
    await this.cleanup();const url=new URL(request.url);
    if(url.pathname==='/purge'){for(const [key,j] of await this.jobs())if(j.room===url.searchParams.get('room'))await this.ctx.storage.delete(key);return json({ok:true});}
    if(url.pathname==='/read'){const status=await this.ctx.storage.get<Status>('status');return json({online:!!status?.ready&&Date.now()-status.seen<45000,model:status?.model,policy:status?.policy,jobs:[...(await this.jobs()).values()].filter(j=>j.room===url.searchParams.get('room')).sort((a,b)=>a.created-b.created)});}
    const raw=await request.text();if(raw.length>24000)return json({error:'Anfrage zu gross.'},413);
    let data;try{data=JSON.parse(raw);}catch{return json({error:'Ungültige Anfrage.'},400);}
    if(url.pathname==='/enqueue'){
      const status=await this.ctx.storage.get<Status>('status');if(!status?.ready||Date.now()-status.seen>45000)return json({error:'LM Studio ist gerade offline. Nutze die Richterhilfe und die Gesetzesakte.'},503);
      const jobs=[...(await this.jobs()).values()];
      if(jobs.length>=300)return json({error:'Die Bibliothek ist ausgelastet. Bitte später erneut versuchen.'},429);
      if(jobs.filter(j=>['queued','working'].includes(j.state)).length>=20)return json({error:'Die Bibliothek ist ausgelastet. Bitte später erneut versuchen.'},429);
      if(jobs.some(j=>j.room===data.room&&(['queued','working'].includes(j.state)||Date.now()-j.created<30000)))return json({error:'Warte auf die laufende Antwort und mindestens 30 Sekunden zwischen Fragen.'},429);
      const job:Job={id:crypto.randomUUID(),room:data.room,question:data.question,variant:data.variant,created:Date.now(),state:'queued',policy:status.policy,model:status.model};await this.ctx.storage.put('job:'+job.id,job);const alarm=await this.ctx.storage.getAlarm();if(!alarm||alarm>job.created+3600000)await this.ctx.storage.setAlarm(job.created+3600000);return json({id:job.id},202);
    }
    if(url.pathname==='/poll'){
      await this.ctx.storage.put('status',{seen:Date.now(),ready:data.ready===true,model:String(data.model||'').slice(0,120),policy:data.policy} satisfies Status);
      if(data.result){const r=data.result;const j=await this.ctx.storage.get<Job>('job:'+r.id);if(j&&j.state==='working'&&r.lease===j.lease){j.state=r.error?'error':'done';j.answer=String(r.answer||'Keine Antwort.').slice(0,10000);j.sources=Array.isArray(r.sources)?r.sources.slice(0,10):[];await this.ctx.storage.put('job:'+j.id,j);}}
      if(!data.take||!data.ready)return json({ok:true});
      const next=[...(await this.jobs()).values()].filter(j=>j.state==='queued'||(j.state==='working'&&(j.lease||0)<Date.now()-300000)).sort((a,b)=>a.created-b.created)[0];
      if(next){next.state='working';next.lease=Date.now();await this.ctx.storage.put('job:'+next.id,next);}
      return json({job:next||null});
    }
    return json({error:'Unbekannte Aktion.'},404);
  }
  async alarm(){await this.cleanup();const jobs=[...(await this.jobs()).values()];if(jobs.length)await this.ctx.storage.setAlarm(Math.max(Date.now()+1000,Math.min(...jobs.map(j=>j.created))+3600000));}
}
