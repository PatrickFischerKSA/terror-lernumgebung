"""Install the explicitly authorised local service in macOS Application Support."""
import os, plistlib, shutil, subprocess
from pathlib import Path
source=Path(__file__).resolve().parent.parent
runtime=Path.home()/'Library/Application Support/TerrorRichterbibliothek'
for sub in ['library/private','dist/spielraum']:(runtime/sub).mkdir(parents=True,exist_ok=True)
(runtime/'library/private').chmod(0o700)
for name in ['bridge.mjs','retrieval.mjs','start-service.mjs']:
    shutil.copy2(source/'library'/name,runtime/'library'/name)
for name in ['policy.json','rubric.json']:
    target=runtime/'library'/name
    if not target.exists():shutil.copy2(source/'library'/name,target)
for name in ['config.json','documents.json','PDF.pdf','ARG.pdf']:
    target=runtime/'library/private'/name
    if not target.exists():shutil.copy2(source/'library/private'/name,target)
    target.chmod(0o600)
for name in ['content.js','laws.json']:shutil.copy2(source/'dist/spielraum'/name,runtime/'dist/spielraum'/name)
(runtime/'package.json').write_text('{"type":"module","private":true}\n')
plist=Path.home()/'Library/LaunchAgents/ch.patrickfischer.terror-richterbibliothek.plist'
service=f'gui/{os.getuid()}/ch.patrickfischer.terror-richterbibliothek'
subprocess.run(['launchctl','bootout',service],capture_output=True)
config={'Label':'ch.patrickfischer.terror-richterbibliothek','ProgramArguments':['/usr/local/bin/node',str(runtime/'library/start-service.mjs')],'WorkingDirectory':str(runtime),'RunAtLoad':True,'KeepAlive':True,'ThrottleInterval':30,'StandardOutPath':str(runtime/'library/private/service.log'),'StandardErrorPath':str(runtime/'library/private/service-error.log'),'EnvironmentVariables':{'PATH':'/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin'}}
plist.write_bytes(plistlib.dumps(config));plist.chmod(0o600)
subprocess.run(['launchctl','enable',service],check=True)
subprocess.run(['launchctl','bootstrap',f'gui/{os.getuid()}',str(plist)],check=True)
print('Lokaler Dienst installiert:',runtime)
