"""Interactive Windows installer. No administrator access or firewall change needed."""
import getpass, json, os, re, shutil, subprocess, sys, uuid
from pathlib import Path

def main():
    if sys.platform!='win32':raise RuntimeError('Dieses Installationsprogramm ist für Windows. Auf macOS install-runtime.py verwenden.')
    source=Path(__file__).resolve().parent.parent
    node=shutil.which('node')
    if not node:raise RuntimeError('Bitte Node.js 24 LTS von https://nodejs.org installieren und das Fenster neu öffnen.')
    major=int(subprocess.check_output([node,'--version'],text=True).strip().lstrip('v').split('.')[0])
    if major<22:raise RuntimeError('Node.js 22 oder neuer erforderlich; empfohlen: Node.js 24 LTS.')
    try:import pypdf
    except ImportError:raise RuntimeError('Bitte zuerst ausführen: py -3 -m pip install pypdf')
    runtime=Path(os.environ['LOCALAPPDATA'])/'TerrorRichterbibliothek'
    runtime.mkdir(parents=True,exist_ok=True)
    private=runtime/'library/private';private.mkdir(parents=True,exist_ok=True)
    # Restrict private material to the signed-in Windows account and SYSTEM.
    sid=subprocess.check_output(['whoami','/user','/fo','csv','/nh'],text=True).strip().split(',')[-1].strip('"')
    if not re.fullmatch(r'S-1-\d+(?:-\d+)+',sid):raise RuntimeError('Windows-Benutzerkennung konnte nicht ermittelt werden.')
    subprocess.run(['icacls',str(private),'/inheritance:r','/grant:r',f'*{sid}:(OI)(CI)F','*S-1-5-18:(OI)(CI)F'],check=True,stdout=subprocess.DEVNULL)
    for folder in ['library','dist/spielraum']:(runtime/folder).mkdir(parents=True,exist_ok=True)
    for name in ['bridge.mjs','retrieval.mjs','start-service.mjs','index-pdf.py']:
        shutil.copy2(source/'library'/name,runtime/'library'/name)
    for name in ['policy.json','rubric.json']:
        if not (runtime/'library'/name).exists():shutil.copy2(source/'library'/name,runtime/'library'/name)
    for name in ['content.js','laws.json']:shutil.copy2(source/'dist/spielraum'/name,runtime/'dist/spielraum'/name)
    (runtime/'package.json').write_text('{"type":"module","private":true}\n')
    config_path=private/'config.json'
    config=json.loads(config_path.read_text(encoding='utf-8')) if config_path.exists() else {}
    if not config.get('secret'):
        print('Verbindungsschlüssel vom betreuenden Lehrercomputer übernehmen. Eingabe wird nicht angezeigt.')
        secret=getpass.getpass('Bibliotheks-Verbindungsschlüssel: ').strip()
        if not re.fullmatch('[a-fA-F0-9]{64}',secret):raise RuntimeError('Erwartet wird der 64-stellige Verbindungsschlüssel, kein LM-Studio-API-Key.')
        config['secret']=secret
    lms=Path.home()/'.lmstudio/bin/lms.exe'
    if not lms.exists():
        lms=Path(input('Vollständiger Pfad zu lms.exe (LM Studio einmal öffnen): ').strip().strip('"'))
    if not lms.is_file():raise RuntimeError('lms.exe wurde nicht gefunden.')
    subprocess.run([str(lms),'ls'],check=True)
    old=config.get('modelKey','mistral-small-3.2-24b-instruct-2506')
    model=input(f'Modellkennung aus der Liste [Enter: {old}]: ').strip() or old
    config.update(endpoint='https://terror-spielraum.patrick-fischer.workers.dev',model='terror-richter',modelKey=model,lmsPath=str(lms),contextLength=16384,bridgeId=config.get('bridgeId','windows-'+uuid.uuid4().hex),publishPolicy=False)
    if not (private/'documents.json').exists():
        drama=Path(input('Pfad zur 103-seitigen Terror-PDF: ').strip().strip('"'))
        argument=Path(input('Pfad zur Argumentationslehre.pdf: ').strip().strip('"'))
        if not drama.is_file() or not argument.is_file():raise RuntimeError('Beide PDF-Dateien müssen lokal vorhanden sein.')
        subprocess.run([sys.executable,str(runtime/'library/index-pdf.py'),str(drama),str(argument)],check=True)
    config_path.write_text(json.dumps(config,ensure_ascii=False,indent=2),encoding='utf-8')
    # No execution-policy bypass; ordinary per-user Startup shortcut runs Node directly.
    start=runtime/'Bibliothek-starten.cmd'
    start.write_text('@echo off\nchcp 65001 >nul\n"'+node+'" "'+str(runtime/'library/start-service.mjs')+'"\npause\n',encoding='utf-8')
    if input('Bei Windows-Anmeldung automatisch starten? [j/N]: ').strip().lower()=='j':
        startup=Path(os.environ['APPDATA'])/'Microsoft/Windows/Start Menu/Programs/Startup'
        startup.mkdir(parents=True,exist_ok=True)
        shutil.copy2(start,startup/'Terror-Richterbibliothek.cmd')
    print('\nEingerichtet:',runtime)
    print('Start: Bibliothek-starten.cmd doppelklicken. Nur EIN Fenster öffnen. Beenden: Strg+C.')
    print('Der PC verwendet die zentrale Spielregel. Andere Lehrercomputer dürfen gleichzeitig laufen.')

if __name__=='__main__':
    try:main()
    except Exception as error:print('\nEinrichtung nicht abgeschlossen:',error);sys.exit(1)
