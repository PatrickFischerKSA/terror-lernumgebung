const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={location:{hash:'#start'}};vm.createContext(c);vm.runInContext(fs.readFileSync('dist/visuals.js','utf8')+';this.images=FILM_IMAGES;this.clips=FILM_WINDOWS;',c);
assert.equal(Object.keys(c.images).length,14);assert.equal(c.clips.length,6);
for(const [key,[time,alt]] of Object.entries(c.images)){assert(time>=0&&time<4987.84);assert(alt.length>15);assert(fs.statSync(`dist/media/film/${key}.webp`).size>10000);}
for(const item of c.clips){const [key,time]=item;assert(time+20<4987.84);assert(fs.statSync(`dist/media/film/${key}.mp4`).size>100000);const html=c.filmWindow(item);assert(html.includes('preload="none"'));assert(!html.includes('autoplay'));assert(html.includes('#lektuere/'+key));}
console.log('PASS: 14 actual film stills, six clips, explicit timecodes, context links, no autoplay or verdict spoilers.');
