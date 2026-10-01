import { DurableObject } from 'cloudflare:workers';
const json=(x:unknown,status=200)=>Response.json(x,{status,headers:{'Cache-Control':'no-store'}});
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
type Meta={code:string;host:string;expires:number;closed:boolean};
export class ClassBallot extends DurableObject<Env>{
 constructor(ctx:DurableObjectState,env:Env){super(ctx,env);ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY,data TEXT); CREATE TABLE IF NOT EXISTS votes(voter TEXT PRIMARY KEY,choice TEXT NOT NULL)');}
 meta(){const r=this.ctx.storage.sql.exec<{data:string}>('SELECT data FROM settings WHERE id=1').toArray()[0];return r?JSON.parse(r.data) as Meta:undefined;}
 save(m:Meta){this.ctx.storage.sql.exec('INSERT OR REPLACE INTO settings VALUES(1,?)',JSON.stringify(m));}
 snapshot(m:Meta){const rows=this.ctx.storage.sql.exec<{choice:string;n:number}>('SELECT choice,COUNT(*) AS n FROM votes GROUP BY choice').toArray();return {code:m.code,closed:m.closed,expires:m.expires,total:rows.reduce((a,r)=>a+r.n,0),...(m.closed?{counts:{schuldig:rows.find(r=>r.choice==='schuldig')?.n||0,unschuldig:rows.find(r=>r.choice==='unschuldig')?.n||0}}:{})};}
 async fetch(req:Request){
  const path=new URL(req.url).pathname;
  if(path.endsWith('/create')&&req.method==='POST'){
   if(this.meta())return json({error:'Bitte nochmals einen Raum erstellen.'},409);
   const secret=crypto.randomUUID()+crypto.randomUUID(),host=await hash(secret);
   if(this.meta())return json({error:'Bitte nochmals einen Raum erstellen.'},409);
   const m={code:path.split('/')[2],host,expires:Date.now()+86400000,closed:false};this.save(m);await this.ctx.storage.setAlarm(m.expires);return json({...this.snapshot(m),token:secret});
  }
  let m=this.meta();if(!m||m.expires<=Date.now())return json({error:'Abstimmung nicht gefunden oder nach 24 Stunden abgelaufen.'},404);
  if(req.method==='GET')return json(this.snapshot(m));
  if(req.method!=='POST')return json({error:'Methode nicht erlaubt.'},405);
  if(path.endsWith('/close')){
   const secret=(req.headers.get('Authorization')||'').replace(/^Bearer /,'');
   if(secret.length>100||await hash(secret)!==m.host)return json({error:'Nur die eröffnende Lehrperson kann abschliessen.'},403);
   m=this.meta();if(!m||m.expires<=Date.now())return json({error:'Abgelaufen.'},404);m.closed=true;this.save(m);return json(this.snapshot(m));
  }
  if(!path.endsWith('/vote'))return json({error:'Unbekannte Aktion.'},404);
  const reader=req.body?.getReader();if(!reader)return json({error:'Stimme fehlt.'},400);
  let raw='',size=0;const decoder=new TextDecoder();while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>1024){await reader.cancel();return json({error:'Anfrage zu gross.'},413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
  let b;try{b=JSON.parse(raw);}catch{return json({error:'Ungültige Stimme.'},400);}
  if(typeof b.voter!=='string'||!/^[a-f0-9]{64}$/.test(b.voter)||!['schuldig','unschuldig'].includes(b.choice))return json({error:'Ungültige Stimme.'},400);
  const voter=await hash(b.voter);m=this.meta();if(!m||m.expires<=Date.now())return json({error:'Abgelaufen.'},404);if(m.closed)return json({error:'Die Abstimmung ist abgeschlossen.'},409);
  const exists=this.ctx.storage.sql.exec('SELECT voter FROM votes WHERE voter=?',voter).toArray().length;
  if(!exists&&this.snapshot(m).total>=500)return json({error:'Maximal 500 Stimmen pro Raum.'},409);
  this.ctx.storage.sql.exec('INSERT INTO votes VALUES(?,?) ON CONFLICT(voter) DO UPDATE SET choice=excluded.choice',voter,b.choice);
  return json({...this.snapshot(m),choice:b.choice});
 }
 async alarm(){await this.ctx.storage.deleteAll();}
}
