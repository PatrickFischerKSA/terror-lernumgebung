import assert from 'node:assert/strict';
import {createDictation} from '../dist/cockpit/speech.js';
let instance,text='',status='',active=false;
class Fake {constructor(){instance=this;} start(){} stop(){this.onend();} abort(){} }
const d=createDictation({Recognition:Fake,onText:t=>text=t,onStatus:s=>status=s,onActive:a=>active=a,setTimer:()=>1,clearTimer:()=>{}});
assert(d.start('Lauterbach,',100));assert(active);assert(!d.start('other'));assert.equal(instance.lang,'de-DE');
const result=(words,final)=>Object.assign([{transcript:words}],{isFinal:final});
instance.onresult({resultIndex:0,results:[result('hier Koch',false)]});assert.equal(text,'Lauterbach,');assert(status.includes('vorläufig'));
instance.onresult({resultIndex:0,results:[result('hier Koch.',true)]});assert.equal(text,'Lauterbach, hier Koch.');
instance.onresult({resultIndex:0,results:[result('hier Koch.',true)]});assert.equal(text,'Lauterbach, hier Koch.');
d.stop();assert(!active);assert(status.includes('selbst senden'));const stale=instance;
d.start(text,100);stale.onresult({resultIndex:0,results:[result('falsche Sitzung',true)]});assert.equal(text,'Lauterbach, hier Koch.');
instance.onerror({error:'not-allowed'});assert(!active);assert(status.includes('nicht erlaubt'));assert.equal(text,'Lauterbach, hier Koch.');
d.start('',10);instance.onresult({resultIndex:0,results:[result('Ein sehr langer Satz',true)]});assert.equal(text.length,10);assert(!active);
d.start('',100);d.cancel();assert(!active);
const unavailable=createDictation({Recognition:null});assert(!unavailable.start(''));
console.log('PASS: speech draft, interim text, no duplicate results, stop, denied microphone, stale events, length bound, cancel, unsupported browser.');
