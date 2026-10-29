// Additive integration: keeps the existing learning routes and in-progress work intact.
(()=>{
 const route='#urteil-duell';
 function integrate(){
  const nav=document.getElementById('nav'),main=document.getElementById('main');if(!main||!nav)return;
  if(!document.getElementById('duellNav')){const a=document.createElement('a');a.id='duellNav';a.href=route;a.textContent='Urteilsweg & Argumente-Pingpong';nav.append(a);}
  const active=location.hash===route;document.getElementById('duellNav').classList.toggle('active',active);
  if(active){if(document.getElementById('integratedDuell'))return;document.title='Urteil-Duell · TERROR';main.innerHTML='<p class="breadcrumb"><a href="#spiele">Lernspiele</a> / Urteil-Duell</p><h1>Urteilsweg & Argumente-Pingpong</h1><p>Zehn Prüfstationen allein oder sieben Argumentationsrunden zu zweit. Mit Voreinheit, Video, nachvollziehbaren Gewichtungen und lokalem Protokoll.</p><p><a href="urteil-duell/">In voller Breite öffnen →</a> · <a href="#lektuere/urteile">Zurück zu den Urteilstexten</a></p><iframe id="integratedDuell" title="Urteilsweg und Argumente-Pingpong" src="urteil-duell/" style="width:100%;height:85vh;min-height:650px;border:1px solid #bcc9cd;border-radius:10px"></iframe>';return;}
  for(const a of main.querySelectorAll('a[href="https://patrickfischerksa.github.io/terror_urteil_duell/"]')){a.href=route;a.removeAttribute('target');a.textContent='Integriertes Urteil-Duell öffnen →';}
  if(['#spiele','#lektuere/urteile','#simulation'].includes(location.hash)&&!document.getElementById('duellEntry')){const section=document.createElement('section');section.id='duellEntry';section.className='section card';section.innerHTML='<span class="eyebrow">URTEILEN & ARGUMENTIEREN</span><h2>Deine Gründe auf die Probe stellen.</h2><p>Erprobe die zehn Stationen des Urteilswegs oder das Argumente-Pingpong: sieben Runden, wechselnder Angriff, transparente Regelwertung, Protokoll und Revanche. Die vier Vorbereitungsmodule erklären Trolleyproblem, Folgenethik, Pflichtethik und Schlussformen.</p><a class="button" href="#urteil-duell">Urteil-Duell hier starten →</a>';main.append(section);}
 }
 new MutationObserver(integrate).observe(document.getElementById('main'),{childList:true});window.addEventListener('hashchange',integrate);integrate();
})();
