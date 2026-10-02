"""Render three short cinematic sequences from the generated game layers."""
from pathlib import Path
import subprocess
root=Path(__file__).resolve().parents[1]/'dist/cockpit/assets'
for name,x,y,angle in [('begleitung','660+8*sin(t/2)','130+3*sin(t)',0),('kontakt','630-5*t','135+2*sin(t)',0),('sinkflug','650+5*t','145+9*t',0.19)]:
    graph=f"[0:v]scale=1280:720,setsar=1[b];[1:v]scale=330:-1,format=rgba,rotate={angle}:c=none:ow=rotw({angle}):oh=roth({angle})[p];[b][p]overlay=x='{x}':y='{y}':shortest=1,format=yuv420p[out]"
    subprocess.run(['/opt/homebrew/bin/ffmpeg','-y','-loglevel','error','-loop','1','-framerate','24','-i',str(root/'cockpit.png'),'-loop','1','-framerate','24','-i',str(root/'airliner.png'),'-filter_complex',graph,'-map','[out]','-t','9','-an','-c:v','libx264','-preset','fast','-crf','23','-movflags','+faststart',str(root/(name+'.mp4'))],check=True)
    print(name,flush=True)
