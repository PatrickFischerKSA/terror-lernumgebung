"""Interactive setup for an additional Mac; the existing main Mac is not required."""
import getpass, json, os, plistlib, re, shlex, shutil, subprocess, sys, time, uuid
from pathlib import Path

def configuration(existing, secret, model, lms):
    return {**existing,'secret':secret,'endpoint':'https://terror-spielraum.patrick-fischer.workers.dev','model':'terror-richter','modelKey':model,'lmsPath':str(lms),'contextLength':16384,'bridgeId':existing.get('bridgeId','mac-'+uuid.uuid4().hex),'publishPolicy':existing.get('publishPolicy',False)}

def agent_config(runtime,node):
    return {'Label':'ch.patrickfischer.terror-richterbibliothek','ProgramArguments':[str(node),str(runtime/'library/start-service.mjs')],'WorkingDirectory':str(runtime),'RunAtLoad':True,'KeepAlive':True,'ThrottleInterval':30,'StandardOutPath':str(runtime/'library/private/service.log'),'StandardErrorPath':str(runtime/'library/private/service-error.log'),'EnvironmentVariables':{'PATH':str(Path(node).parent)+':/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin'}}

def main():
    if sys.platform!='darwin':raise RuntimeError('Dieses Installationsprogramm ist für macOS. Unter Windows install-windows.py verwenden.')
    source=Path(__file__).resolve().parent.parent
    node=shutil.which('node')
    if not node:raise RuntimeError('Bitte Node.js 24 LTS von https://nodejs.org installieren und das Terminal neu öffnen.')
    if int(subprocess.check_output([node,'--version'],text=True).strip().lstrip('v').split('.')[0])<22:raise RuntimeError('Node.js 22 oder neuer erforderlich; empfohlen: 24 LTS.')
    try:import pypdf
    except ImportError:raise RuntimeError('pypdf fehlt. Bitte die drei Vorbereitungsschritte mit einer Python-Umgebung in MAC.md ausführen.')
    runtime=Path.home()/'Library/Application Support/TerrorRichterbibliothek'
    private=runtime/'library/private';private.mkdir(parents=True,exist_ok=True,mode=0o700);private.chmod(0o700)
    config_path=private/'config.json'
    existing=json.loads(config_path.read_text(encoding='utf-8')) if config_path.exists() else {}
    if existing and 'publishPolicy' not in existing:
        # Preserve a legacy primary installation rather than silently demoting it.
        existing['publishPolicy']=True
    secret=existing.get('secret') or getpass.getpass('Privater Bibliotheks-Verbindungsschlüssel (Eingabe unsichtbar): ').strip()
    if not re.fullmatch('[a-fA-F0-9]{64}',secret):raise RuntimeError('Erwartet wird der 64-stellige Verbindungsschlüssel, kein LM-Studio-API-Key.')
    lms=Path(existing.get('lmsPath',str(Path.home()/'.lmstudio/bin/lms')))
    if not lms.is_file():lms=Path(input('Vollständiger Pfad zu lms (LM Studio einmal öffnen): ').strip().strip('"'))
    if not lms.is_file():raise RuntimeError('lms wurde nicht gefunden.')
    subprocess.run([str(lms),'ls'],check=True)
    default=existing.get('modelKey','mistral-small-3.2-24b-instruct-2506')
    model=input(f'Modellkennung aus der Liste [Enter: {default}]: ').strip() or default
    for folder in ['library','dist/spielraum']:(runtime/folder).mkdir(parents=True,exist_ok=True)
    for name in ['bridge.mjs','retrieval.mjs','start-service.mjs','index-pdf.py']:shutil.copy2(source/'library'/name,runtime/'library'/name)
    for name in ['policy.json','rubric.json']:
        if not (runtime/'library'/name).exists():shutil.copy2(source/'library'/name,runtime/'library'/name)
    for name in ['content.js','laws.json']:shutil.copy2(source/'dist/spielraum'/name,runtime/'dist/spielraum'/name)
    (runtime/'package.json').write_text('{"type":"module","private":true}\n',encoding='utf-8')
    if not (private/'documents.json').exists():
        drama=Path(input('Pfad zur 103-seitigen Terror-PDF: ').strip().strip('"').strip("'"))
        argument=Path(input('Pfad zur Argumentationslehre.pdf: ').strip().strip('"').strip("'"))
        if not drama.is_file() or not argument.is_file():raise RuntimeError('Beide PDF-Dateien müssen lokal vorhanden sein.')
        subprocess.run([sys.executable,str(runtime/'library/index-pdf.py'),str(drama),str(argument)],check=True)
    config_path.write_text(json.dumps(configuration(existing,secret,model,lms),ensure_ascii=False,indent=2),encoding='utf-8')
    for name in ['config.json','documents.json','PDF.pdf','ARG.pdf']:(private/name).chmod(0o600)
    start=runtime/'Bibliothek-starten.command'
    start.write_text('#!/bin/zsh\nexec '+shlex.quote(node)+' '+shlex.quote(str(runtime/'library/start-service.mjs'))+'\n',encoding='utf-8');start.chmod(0o700)
    if input('Jetzt starten und bei jeder Anmeldung automatisch starten? [j/N]: ').strip().lower()=='j':
        plist=Path.home()/'Library/LaunchAgents/ch.patrickfischer.terror-richterbibliothek.plist';plist.parent.mkdir(parents=True,exist_ok=True)
        service=f'gui/{os.getuid()}/ch.patrickfischer.terror-richterbibliothek'
        subprocess.run(['launchctl','bootout',service],capture_output=True)
        plist.write_bytes(plistlib.dumps(agent_config(runtime,node)));plist.chmod(0o600)
        subprocess.run(['launchctl','enable',service],check=True)
        for attempt in range(10):
            result=subprocess.run(['launchctl','bootstrap',f'gui/{os.getuid()}',str(plist)],capture_output=True,text=True)
            if result.returncode==0:break
            time.sleep(1)
        else:raise RuntimeError('Dateien eingerichtet, Autostart konnte nicht registriert werden: '+result.stderr)
        print('Autostart läuft. Nicht zusätzlich das manuelle Startskript öffnen.')
    else:print('Manueller Start: Bibliothek-starten.command im Installationsordner. Fenster offen lassen, mit Strg+C beenden.')
    print('Eingerichtet:',runtime)
    print('Neue Macs verwenden die zentrale Spielregel des Hauptcomputers und eine eigene Rechnerkennung.')

if __name__=='__main__':
    try:main()
    except Exception as error:print('\nEinrichtung nicht abgeschlossen:',error);sys.exit(1)
