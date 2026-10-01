import assert from 'node:assert/strict';
import {recommend,createCoach} from '../dist/spielraum/coach.js';
const base={code:'TEST',phase:4,cycles:0,closed:false,variant:'original',people:[],messages:[]};
assert.equal(recommend(base).length,1);assert.equal(recommend(base,base).length,0);
const message=(id,text,kind='aussage',role='koch')=>({id,text,kind,role});
const sms={...base,messages:[message(1,'Die SMS zeigt einen Versuch am Cockpit.')]};
assert.equal(recommend(sms,base)[0].title,'Wissensstände auseinanderhalten');
assert.match(recommend({...sms,variant:'kontakt'},base)[0].options[0].text,/unserer Variante/);
assert.equal(recommend(sms,sms).length,0);
assert.equal(recommend({...base,messages:[message(1,'Ich widerspreche.','einwand')]},base)[0].priority,5);
assert.equal(recommend({...base,messages:[message(1,'Organisation','organisation')]},base).length,0);
assert.equal(recommend({...sms,closed:true},base).length,0);
const balanced={...base,messages:[message(1,'eins'),message(2,'zwei'),message(3,'drei')]};assert(recommend(balanced,base).some(t=>t.key==='balance:3'));
assert(recommend({...base,people:[{role:'nelson',raised:123}]},base).some(t=>t.key==='hand:nelson:123'));
// Exercise controller through its event interface: private display, draft-only action and role handover.
const root={hidden:true,innerHTML:'',onclick:null},store=new Map(),drafts=[];
const coach=createCoach(root,{draft:t=>drafts.push(t),storage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)}});
coach.update(base,{code:'TEST',role:'koch'});assert.equal(root.hidden,true);
coach.update(base,{code:'TEST',role:'richter'});assert.equal(root.hidden,false);
coach.update(sms,{code:'TEST',role:'richter'});assert.match(root.innerHTML,/Wissensstände/);
const click=(action,option,checked)=>root.onclick({target:{closest:()=>({dataset:{coach:action,option},checked})}});
click('draft','0');assert.equal(drafts.length,1);assert.match(drafts[0],/Welche Information/);
click('toggle',undefined,false);coach.update({...base,messages:[message(2,'Evakuierung')]},{code:'TEST',role:'richter'});assert.match(root.innerHTML,/ausgeschaltet/);
coach.update({...base,cycles:1},{code:'TEST',role:'koch'});assert.equal(root.hidden,true);assert.equal(root.innerHTML,'');
coach.destroy();
// Player content is rendered as text, never executable HTML.
const safeRoot={hidden:true,innerHTML:'',onclick:null};const safe=createCoach(safeRoot,{draft:()=>{},storage:{getItem:()=>null,setItem:()=>{}}});safe.update(base,{code:'SAFE',role:'richter'});safe.update({...base,messages:[message(1,'<img src=x onerror=alert(1)> SMS')]},{code:'SAFE',role:'richter'});assert(!safeRoot.innerHTML.includes('<img'));assert(safeRoot.innerHTML.includes('&lt;img'));safe.destroy();
console.log('PASS: live context, variants, deduplication, private role transition, opt-out, draft-only action, escaped chat.');
let clock=1000;const pauseRoot={hidden:true,innerHTML:'',onclick:null};const pause=createCoach(pauseRoot,{now:()=>clock,draft:()=>{},storage:{getItem:()=>null,setItem:()=>{}}});pause.update(base,{code:'PAUSE',role:'richter'});pauseRoot.onclick({target:{closest:()=>({dataset:{coach:'pause'}})}});pause.update(sms,{code:'PAUSE',role:'richter'});assert.match(pauseRoot.innerHTML,/pausiert/);clock+=300001;pause.update({...base,messages:[message(2,'Evakuierung')]},{code:'PAUSE',role:'richter'});assert.match(pauseRoot.innerHTML,/Alternative konkret/);pause.destroy();
for(let phase=0;phase<11;phase++)assert.equal(recommend({...base,phase}).length,1);
// A new high-priority event must not silently change the action behind a focused old card.
let focused=false;const focusDrafts=[],focusRoot={hidden:true,innerHTML:'',onclick:null,ownerDocument:{activeElement:{}},contains:()=>focused};const focusCoach=createCoach(focusRoot,{draft:t=>focusDrafts.push(t),storage:{getItem:()=>null,setItem:()=>{}}});focusCoach.update(base,{code:'FOCUS',role:'richter'});focusCoach.update(sms,{code:'FOCUS',role:'richter'});focused=true;focusCoach.update({...sms,messages:[...sms.messages,message(2,'Einwand','einwand','nelson')]},{code:'FOCUS',role:'richter'});assert.match(focusRoot.innerHTML,/Wissensstände/);focusRoot.onclick({target:{closest:()=>({dataset:{coach:'draft',option:'0'}})}});assert.match(focusDrafts[0],/Welche Information/);focusCoach.destroy();
