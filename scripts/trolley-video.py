"""Render an original, non-graphic captioned trolley introduction. Requires Pillow/ffmpeg."""
from PIL import Image,ImageDraw,ImageFont
import subprocess,math,textwrap
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
def font(size):return ImageFont.truetype(FONT,size)
out=ROOT/'dist/media/grundkurs/weiche.mp4'
proc=subprocess.Popen(['ffmpeg','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','960x540','-framerate','10','-i','-','-an','-c:v','libx264','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
chapters=[('1 / Die Lage','Eine Bahn kann nicht mehr bremsen. Auf ihrem Gleis stehen fünf Menschen.'),('2 / Die andere Möglichkeit','Du könntest eine Weiche umstellen. Auf dem anderen Gleis steht eine Person.'),('3 / Der Konflikt','Nicht umstellen: fünf sterben. Umstellen: eine Person stirbt. Was spricht für welche Entscheidung?'),('4 / Die Annahmen','Nur im Modell sind die Folgen sicher und andere Rettungswege ausgeschlossen.'),('5 / Der Transfer zu Terror','Im Drama kommen unsicheres Wissen, mögliche Alternativen, Befehle und Grundrechte hinzu.')]
for n in range(400):
 t=n/10;stage=min(4,int(t/8));im=Image.new('RGB',(960,540),'#142f3c');d=ImageDraw.Draw(im)
 d.text((40,26),'DAS WEICHENSTELLER-DILEMMA',font=font(20),fill='#dfeaab')
 d.text((40,64),chapters[stage][0],font=font(34),fill='white')
 d.line((60,225,860,225),fill='#89a7b1',width=9);d.line([(310,225),(540,335),(860,335)],fill='#89a7b1',width=9)
 if stage==1:d.line([(310,225),(540,335),(860,335)],fill='#e9c082',width=5)
 d.ellipse((298,213,322,237),fill='#e9c082');d.text((265,258),'Weiche',font=font(19),fill='white')
 x=70+min(t,7)*20;d.rounded_rectangle((x,185,x+100,225),radius=5,fill='#dfeaab');d.text((x+18,191),'Bahn',font=font(22),fill='#142f3c')
 for x,y in [(620+i*45,220) for i in range(5)]+[(730,330)]:
  d.ellipse((x-8,y-34,x+8,y-18),fill='#e6b397');d.line((x,y-18,x,y),fill='#e6b397',width=8)
 d.text((640,154),'5 Menschen',font=font(23),fill='white');d.text((735,350),'1 Mensch',font=font(23),fill='white')
 y=409
 for line in textwrap.wrap(chapters[stage][1],width=69):d.text((40,y),line,font=font(25),fill='white');y+=33
 d.rectangle((40,510,40+int(880*t/40),514),fill='#dfeaab');d.text((40,520),'Eigenes Lernmodell · ohne Ton · keine reale Situation',font=font(13),fill='#b8ccd2')
 proc.stdin.write(im.tobytes())
proc.stdin.close();assert proc.wait()==0
print(out)
