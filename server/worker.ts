import { timingSafeEqual } from 'node:crypto';
export { ClassBallot } from './ballot';
export { JudgeLibrary } from './library';
import { DurableObject } from 'cloudflare:workers';

const ROLES = ['richter','koch','biegler','nelson','lauterbach','meiser'];
const ORIGINS = ['https://patrickfischerksa.github.io','http://localhost:8769','http://127.0.0.1:8769'];
const TTL = 24 * 60 * 60 * 1000;
type Meta = { code: string; expires: number; phase: number; floor: string; variant: string; closed: boolean; rotation?: boolean; rounds?: number; cycles?: number };
type Person = { role: string; hash: string; raised: number; last: number };
type Entry = { id: number; role: string; kind: string; text: string; time: number; request: string };
const json = (value: unknown, status=200) => Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
const token = () => Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
const digest = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),v=>v.toString(16).padStart(2,'0')).join('');
const clean = (value: unknown, max: number) => typeof value==='string' ? value.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g,'').trim().slice(0,max) : '';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin=request.headers.get('Origin')||'';
    if(origin && !ORIGINS.includes(origin)) return json({error:'Dieser Ursprung ist nicht freigegeben.'},403);
    const headers={'Access-Control-Allow-Origin':origin||ORIGINS[0],'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Vary':'Origin'};
    if(request.method==='OPTIONS') return new Response(null,{status:204,headers});
    let response: Response;
    try {
      const url=new URL(request.url);
      if(url.pathname==='/health') response=json({ok:true,version:1});
      else if(url.pathname==='/library/bridge' && request.method==='POST') {
        const supplied=request.headers.get('Authorization')||'', expected='Bearer '+env.LIBRARY_SECRET;
        if(!env.LIBRARY_SECRET || supplied.length!==expected.length || !timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))) return json({error:'Nicht autorisiert.'},401);
        response=await env.LIBRARY.getByName('shared').fetch(new Request('https://library/poll',request));
      }
      else if(url.pathname==='/ballots' && request.method==='POST'){
        const allowed=await env.CREATE_LIMIT.limit({key:request.headers.get('CF-Connecting-IP')||'local'});
        if(!allowed.success)response=json({error:'Bitte vor einer weiteren Abstimmung eine Minute warten.'},429);
        else {const code=token().slice(0,12).toUpperCase();response=await env.BALLOTS.getByName(code).fetch(new Request('https://ballot/ballots/'+code+'/create',{method:'POST'}));}
      } else if(/^\/ballots\/[A-F0-9]{12}(?:\/(vote|close))?$/.test(url.pathname)){
        response=await env.BALLOTS.getByName(url.pathname.split('/')[2]).fetch(request);
      } else if(url.pathname==='/rooms' && request.method==='POST') {
        const allowed=await env.CREATE_LIMIT.limit({key:request.headers.get('CF-Connecting-IP')||'local'});
        if(!allowed.success) return new Response(JSON.stringify({error:'Bitte eine Minute warten, bevor du einen weiteren Raum eröffnest.'}),{status:429,headers:{...headers,'Content-Type':'application/json'}});
        const code=token().slice(0,16).toUpperCase();
        response=await env.ROOMS.getByName(code).fetch(new Request('https://room/'+code+'/create',{method:'POST'}));
      } else {
        const m=url.pathname.match(/^\/rooms\/([A-F0-9]{16})(?:\/(join|socket|library))?$/);
        response=m ? await env.ROOMS.getByName(m[1]).fetch(request) : json({error:'Unbekannte Adresse.'},404);
      }
    } catch { response=json({error:'Verbindung zum Raum fehlgeschlagen. Bitte erneut versuchen.'},503); }
    if(response.status===101) return response;
    const copy=new Response(response.body,response);
    Object.entries(headers).forEach(([k,v])=>copy.headers.set(k,v));
    return copy;
  }
} satisfies ExportedHandler<Env>;

export class Courtroom extends DurableObject<Env> {
  private ended = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx,env);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS meta (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS people (role TEXT PRIMARY KEY, hash TEXT NOT NULL UNIQUE, raised INTEGER DEFAULT 0, last INTEGER DEFAULT 0);
      CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT NOT NULL, kind TEXT NOT NULL, text TEXT NOT NULL, time INTEGER NOT NULL, request TEXT UNIQUE);`);
  }
  meta(): Meta|undefined {const row=this.ctx.storage.sql.exec<{data:string}>('SELECT data FROM meta WHERE id=1').toArray()[0];return row?JSON.parse(row.data):undefined;}
  put(meta: Meta) {this.ctx.storage.sql.exec('INSERT OR REPLACE INTO meta(id,data) VALUES (1,?)',JSON.stringify(meta));}
  people() {return this.ctx.storage.sql.exec<Person>('SELECT * FROM people').toArray();}
  online(role: string) {return this.ctx.getWebSockets().some(ws=>ws.readyState===1&&ws.deserializeAttachment()?.role===role&&!ws.deserializeAttachment()?.disconnected);}
  publicState() {return {...this.meta(),people:this.people().map(p=>({role:p.role,online:this.online(p.role),raised:p.raised})),messages:this.ctx.storage.sql.exec<Entry>('SELECT * FROM messages ORDER BY id').toArray().map(({request,...e})=>e)};}
  send(ws: WebSocket, data: unknown) {try {ws.send(JSON.stringify(data));}catch { /* A reconnect obtains the persisted snapshot. */ }}
  broadcast() {const value=JSON.stringify({type:'state',state:this.publicState()});for(const ws of this.ctx.getWebSockets()){try{this.send(ws,{type:'identity',role:this.people().find(p=>p.hash===ws.deserializeAttachment()?.hash)?.role});ws.send(value);}catch{ /* Reconnect loads persisted state. */ }}}
  entry(role:string,kind:string,text:string,request:string|null=null) {this.ctx.storage.sql.exec('INSERT INTO messages(role,kind,text,time,request) VALUES (?,?,?,?,?)',role,kind,text,Date.now(),request);}
  async authenticate(raw: string) {if(!/^[a-f0-9]{64}$/.test(raw)) return undefined;const hash=await digest(raw);return this.ctx.storage.sql.exec<Person>('SELECT * FROM people WHERE hash=?',hash).toArray()[0];}
  async fetch(request: Request): Promise<Response> {
    if(this.ended)return json({error:"Dieser Raum wurde gelöscht."},410);
    const path=new URL(request.url).pathname;
    if(path.endsWith('/create')) {
      if(this.meta())return json({error:'Raum existiert bereits.'},409);
      const secret=token(),hash=await digest(secret),code=path.split('/')[1];
      this.ctx.storage.transactionSync(()=>{this.put({code,expires:Date.now()+TTL,phase:0,floor:'alle',variant:'original',closed:false,rotation:true,rounds:0,cycles:0});this.ctx.storage.sql.exec('INSERT INTO people(role,hash) VALUES (?,?)','richter',hash);this.entry('system','system','Der Spielraum ist eröffnet. Bereitet eure Rollen vor.');});
      await this.ctx.storage.setAlarm(Date.now()+TTL);
      return json({code,role:'richter',token:secret});
    }
    const meta=this.meta();
    if(!meta || meta.expires<=Date.now()) return json({error:'Dieser Raum existiert nicht oder ist nach 24 Stunden abgelaufen.'},404);
    if(path.endsWith('/library')) {
      const person=await this.authenticate((request.headers.get('Authorization')||'').replace(/^Bearer /,''));
      if(person?.role!=='richter')return json({error:'Nur der aktuelle Vorsitz hat Zugang zur Beratung.'},403);
      const lib=this.env.LIBRARY.getByName('shared');
      if(request.method==='GET')return lib.fetch('https://library/read?room='+meta.code);
      if(request.method==='POST'){
        if(this.meta()?.closed)return json({error:'Der Prozess ist abgeschlossen.'},410);
        const raw=await request.text();if(raw.length>3000)return json({error:'Frage zu lang.'},413);
        let question;try{question=clean(JSON.parse(raw).question,2000);}catch{return json({error:'Ungültige Frage.'},400);}
        if(!question || question.length<8)return json({error:'Formuliere eine Frage mit mindestens acht Zeichen.'},400);
        return lib.fetch(new Request('https://library/enqueue',{method:'POST',body:JSON.stringify({room:meta.code,question,variant:meta.variant})}));
      }
      return json({error:'Methode nicht erlaubt.'},405);
    }
    if(request.method==='GET' && !path.endsWith('/socket')) return json({code:meta.code,expires:meta.expires,closed:meta.closed,roles:this.people().map(p=>p.role)});
    if(path.endsWith('/join') && request.method==='POST') {
      if(meta.closed)return json({error:'Der Raum wurde geschlossen.'},410);
      if(Number(request.headers.get('Content-Length'))>1000)return json({error:'Anfrage zu gross.'},413);
      const raw=await request.text();if(raw.length>1000)return json({error:'Anfrage zu gross.'},413);
      let role: string;try {role=JSON.parse(raw).role;}catch{return json({error:'Ungültige Anfrage.'},400);}
      if(!ROLES.includes(role)||role==='richter')return json({error:'Wähle eine der fünf freien Spielrollen.'},400);
      const secret=token(),hash=await digest(secret);
      // No await between checking occupancy and writing: a role cannot be claimed twice.
      if(this.meta()?.closed)return json({error:'Der Raum wurde geschlossen.'},410);
      if(this.people().some(p=>p.role===role))return json({error:'Diese Rolle wurde bereits besetzt. Bitte eine andere wählen.'},409);
      this.ctx.storage.sql.exec('INSERT INTO people(role,hash) VALUES (?,?)',role,hash);
      this.entry('system','system',`${role} hat den Raum betreten.`);this.broadcast();
      return json({code:meta.code,role,token:secret});
    }
    if(path.endsWith('/socket') && request.headers.get('Upgrade')?.toLowerCase()==='websocket') {
      const protocols=(request.headers.get('Sec-WebSocket-Protocol')||'').split(',').map(s=>s.trim());
      if(protocols[0]!=='terror-v1')return json({error:'Ungültiges Protokoll.'},400);
      const p=await this.authenticate(protocols[1]||'');
      if(!p)return json({error:'Die Rollenberechtigung ist ungültig.'},401);
      if(this.ctx.getWebSockets().filter(ws=>ws.readyState===1&&ws.deserializeAttachment()?.hash===p.hash).length>=3)return json({error:'Diese Rolle ist bereits in drei Fenstern geöffnet.'},429);
      const pair=new WebSocketPair();this.ctx.acceptWebSocket(pair[1],[p.role]);pair[1].serializeAttachment({role:p.role,hash:p.hash});
      this.broadcast();
      return new Response(null,{status:101,webSocket:pair[0],headers:{'Sec-WebSocket-Protocol':'terror-v1'}});
    }
    return json({error:'Unbekannte Aktion.'},400);
  }
  async webSocketMessage(ws: WebSocket, raw: string|ArrayBuffer) {
    let request='';
    try {
      if(typeof raw!=='string'||raw.length>14000)throw Error('Die Nachricht ist zu lang.');
      const m=JSON.parse(raw);request=clean(m.id,64);
      const auth=ws.deserializeAttachment() as {role:string;hash:string};
      const p=this.people().find(p=>p.hash===auth.hash);
      const meta=this.meta();
      if(!p||!meta||meta.expires<=Date.now()){ws.close(4001,'Raum oder Rolle abgelaufen');return;}
      if(m.type==='sync'){this.send(ws,{type:'identity',role:p.role});this.send(ws,{type:'state',state:this.publicState()});return;}
      if(!/^[a-zA-Z0-9-]{8,64}$/.test(request))throw Error('Ungültige Nachrichtenkennung.');
      if(this.ctx.storage.sql.exec('SELECT id FROM messages WHERE request=?',p.hash+':'+request).toArray().length){this.send(ws,{type:'ack',id:request});return;}
      if(meta.closed && m.type!=='delete')throw Error('Der Prozess ist geschlossen. Exportiere das Protokoll oder eröffne einen neuen Raum.');
      if(Date.now()-p.last<400)throw Error('Bitte kurz warten, bevor du erneut sendest.');
      this.ctx.storage.sql.exec('UPDATE people SET last=? WHERE role=?',Date.now(),p.role);
      const isJudge=p.role==='richter';
      if(!['delete','close','hand'].includes(m.type)&&this.ctx.storage.sql.exec<{n:number}>('SELECT COUNT(*) AS n FROM messages').one().n>=1200)throw Error('Das Protokoll ist voll. Bitte exportieren und einen neuen Raum beginnen.');
      if(m.type==='chat') {
        const text=clean(m.text,4000),kind=['aussage','frage','einwand','organisation'].includes(m.kind)?m.kind:'aussage';
        if(!text)throw Error('Schreibe zuerst eine Nachricht.');
        if(!isJudge&&meta.floor!=='alle'&&meta.floor!==p.role&&kind!=='organisation'&&kind!=='einwand')throw Error('Du hast gerade kein Rederecht. Melde dich oder nutze Organisation / Einwand.');
        if(this.ctx.storage.sql.exec<{n:number}>('SELECT COUNT(*) AS n FROM messages').one().n>=1200)throw Error('Das Protokoll ist voll. Bitte exportieren und einen neuen Raum beginnen.');
        this.entry(p.role,kind,text,p.hash+':'+request);
      } else if(m.type==='hand') {
        this.ctx.storage.sql.exec('UPDATE people SET raised=? WHERE role=?',m.raised?Date.now():0,p.role);
      } else {
        if(!isJudge)throw Error('Diese Aktion steht ausschliesslich dem Vorsitz zu.');
        if(m.type==='rotation') {
          if(typeof m.enabled!=='boolean')throw Error('Ungültiger Wechselmodus.');
          meta.rotation=m.enabled;meta.rounds=0;this.put(meta);
          this.entry('richter','system',m.enabled?'Rollenwechsel eingeschaltet. Der Vorsitz beendet jede Runde manuell; Wechsel nach 15 Runden. Zähler neu gestartet.':'Rollenwechsel ausgeschaltet. Zähler zurückgesetzt.',p.hash+':'+request);
        } else if(m.type==='round') {
          if(!meta.rotation)throw Error('Der Rollenwechsel ist ausgeschaltet.');
          if(this.people().length!==6)throw Error('Für den Rollenwechsel müssen alle sechs Rollen besetzt sein.');
          meta.rounds=(meta.rounds||0)+1;
          this.ctx.storage.transactionSync(()=>{
            this.entry('richter','system',`Runde ${meta.rounds} von 15 abgeschlossen.`,p.hash+':'+request);
            if(meta.rounds===15){
              const people=this.people();this.ctx.storage.sql.exec('DELETE FROM people');
              for(const person of people){const next=ROLES[(ROLES.indexOf(person.role)+1)%6];this.ctx.storage.sql.exec('INSERT INTO people(role,hash,raised,last) VALUES (?,?,0,?)',next,person.hash,person.last);}
              meta.rounds=0;meta.cycles=(meta.cycles||0)+1;meta.floor='alle';
              this.entry('system','system','Perspektivwechsel: Vorsitz → Koch → Biegler → Nelson → Lauterbach → Meiser → Vorsitz. Der Verfahrensstand bleibt erhalten. Macht euch mit eurer neuen Rolle vertraut.');
            }
            this.put(meta);
          });
          for(const socket of this.ctx.getWebSockets()){const a=socket.deserializeAttachment();const person=this.people().find(p=>p.hash===a?.hash);if(person)socket.serializeAttachment({...a,role:person.role});}
        } else if(m.type==='control') {
          if(!Number.isInteger(m.phase)||m.phase<0||m.phase>10||!['alle',...ROLES].includes(m.floor))throw Error('Ungültige Verfahrensphase oder Worterteilung.');
          meta.phase=m.phase;meta.floor=m.floor;this.put(meta);
          if(m.floor!=='alle')this.ctx.storage.sql.exec('UPDATE people SET raised=0 WHERE role=?',m.floor);
          this.entry('richter','control',`Verfahrensphase ${m.phase+1}; Rederecht: ${m.floor}.`,p.hash+':'+request);
        } else if(m.type==='variant') {
          if(meta.phase!==0)throw Error('Fallvarianten können nur in der Vorbereitung festgelegt werden.');
          if(!['original','evakuierung','angehoerige','kontakt'].includes(m.variant))throw Error('Unbekannte Variante.');
          meta.variant=m.variant;this.put(meta);this.entry('richter','variant',m.variant,p.hash+':'+request);
        } else if(m.type==='verdict') {
          const fields=['tenor','facts','evidence','offence','justification','excuse','counter','reasons'];
          if(!m.fields || fields.some(k=>typeof m.fields[k]!=='string'||m.fields[k].trim().length<15||m.fields[k].length>1200))throw Error('Begründe alle acht Urteilsfelder mit mindestens 15 und höchstens 1200 Zeichen.');
          if(meta.phase<9)throw Error('Wechsle nach dem letzten Wort zur Urteilsberatung.');
          this.entry('richter','urteil',JSON.stringify(Object.fromEntries(fields.map(k=>[k,clean(m.fields[k],1200)]))),p.hash+':'+request);meta.phase=10;meta.floor='alle';this.put(meta);
        } else if(m.type==='release') {
          if(!ROLES.includes(m.role)||m.role==='richter')throw Error('Diese Rolle kann nicht freigegeben werden.');
          if(this.online(m.role))throw Error('Die Rolle ist noch verbunden. Bitte zuerst das betreffende Fenster schliessen lassen.');
          this.ctx.storage.sql.exec('DELETE FROM people WHERE role=?',m.role);this.entry('richter','system',`${m.role} wurde für eine neue Person freigegeben.`,p.hash+':'+request);
        } else if(m.type==='close') {meta.closed=true;this.put(meta);this.entry('richter','system','Der Raum wurde geschlossen. Das Protokoll bleibt bis zum Ablauf exportierbar.',p.hash+':'+request);}
        else if(m.type==='delete') {for(const socket of this.ctx.getWebSockets()){this.send(socket,{type:'deleted'});socket.close(4002,'Raum gelöscht');}this.ended=true;await this.env.LIBRARY.getByName('shared').fetch(new Request('https://library/purge?room='+meta.code,{method:'POST'}));await this.ctx.storage.deleteAll();return;}
        else throw Error('Unbekannte Aktion.');
      }
      this.send(ws,{type:'ack',id:request});this.broadcast();
    } catch(e) {this.send(ws,{type:'error',id:request,error:e instanceof Error?e.message:'Ungültige Anfrage.'});}
  }
  async webSocketClose(ws: WebSocket, code:number) {
    ws.serializeAttachment({...ws.deserializeAttachment(),disconnected:true});
    // 1005/1006 are received-only status codes and must never be sent in a close frame.
    if(ws.readyState===1)ws.close(code===1005||code===1006?1000:code);
    if(!this.ended)this.broadcast();
  }
  async webSocketError(ws: WebSocket) {ws.serializeAttachment({...ws.deserializeAttachment(),disconnected:true});ws.close(1011,'Verbindungsfehler');if(!this.ended)this.broadcast();}
  async alarm() {this.ended=true;for(const ws of this.ctx.getWebSockets()){this.send(ws,{type:'deleted'});ws.close(4002,'Raum abgelaufen');}await this.ctx.storage.deleteAll();}
}
