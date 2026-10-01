import ast, importlib.util, json, subprocess, sys, tempfile
from pathlib import Path
from unittest.mock import patch
from zipfile import ZipFile
root=Path(__file__).resolve().parent.parent
for name in ['install-mac.py','package-mac.py']:ast.parse((root/'library'/name).read_text(encoding='utf-8'))
with ZipFile(root/'dist/downloads/terror-bibliothek-mac.zip') as z:
    assert len(z.namelist())==11
    for name in z.namelist():
        assert '/private/' not in name and not name.endswith('.pdf') and '..' not in name
        assert z.read(name)==(root/name).read_bytes(),f'Package stale: {name}'
    assert (z.getinfo('library/Einrichten-Mac.command').external_attr>>16)&0o100
spec=importlib.util.spec_from_file_location('mac_installer',root/'library/install-mac.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
with tempfile.TemporaryDirectory() as tmp:
    home=Path(tmp);lms=home/'.lmstudio/bin/lms';lms.parent.mkdir(parents=True);lms.touch()
    pdf=home/'Drama mit Leerzeichen.pdf';pdf.write_bytes(b'fixture');arg=home/'Argumente.pdf';arg.write_bytes(b'fixture')
    runtime=home/'Library/Application Support/TerrorRichterbibliothek';private=runtime/'library/private';calls=[]
    def run(args,**kwargs):
        calls.append(args)
        if len(args)>1 and str(args[1]).endswith('index-pdf.py'):
            (private/'documents.json').write_text('[]');(private/'PDF.pdf').write_bytes(b'fixture');(private/'ARG.pdf').write_bytes(b'fixture')
        return subprocess.CompletedProcess(args,0,stdout='',stderr='')
    with patch.object(module.sys,'platform','darwin'),patch.dict(sys.modules,{'pypdf':object()}),patch.object(module.Path,'home',return_value=home),patch.object(module.shutil,'which',return_value='/opt/homebrew/bin/node'),patch.object(module.subprocess,'check_output',return_value='v24.0.0'),patch.object(module.subprocess,'run',side_effect=run),patch.object(module.getpass,'getpass',return_value='a'*64),patch('builtins.input',side_effect=['',str(pdf),str(arg),'n']):module.main()
    first=json.loads((private/'config.json').read_text());assert first['publishPolicy'] is False;assert first['bridgeId'].startswith('mac-');assert not any(c[0]=='launchctl' for c in calls);assert (private/'config.json').stat().st_mode&0o777==0o600
    first.pop('publishPolicy');(private/'config.json').write_text(json.dumps(first));calls.clear()
    with patch.object(module.sys,'platform','darwin'),patch.dict(sys.modules,{'pypdf':object()}),patch.object(module.Path,'home',return_value=home),patch.object(module.shutil,'which',return_value='/opt/homebrew/bin/node'),patch.object(module.subprocess,'check_output',return_value='v24.0.0'),patch.object(module.subprocess,'run',side_effect=run),patch('builtins.input',side_effect=['','j']):module.main()
    second=json.loads((private/'config.json').read_text());assert second['bridgeId']==first['bridgeId'];assert second['publishPolicy'] is True;assert second['secret']==first['secret'];assert any(c[:2]==['launchctl','bootstrap'] for c in calls)
    config=module.agent_config(runtime,'/opt/homebrew/bin/node');assert config['ProgramArguments'][0]=='/opt/homebrew/bin/node'
print('PASS: Mac package, executable launcher, isolated fresh setup, permissions, optional autostart, preserved primary configuration. LM Studio/PDF extraction mocked.')
