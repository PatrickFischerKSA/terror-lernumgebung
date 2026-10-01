"""Portable checks; does not claim to execute the Windows installer on macOS/Linux."""
import ast
from pathlib import Path
from zipfile import ZipFile
root=Path(__file__).resolve().parent.parent
for name in ['install-windows.py','index-pdf.py','package-windows.py']:
    ast.parse((root/'library'/name).read_text(encoding='utf-8'))
with ZipFile(root/'dist/downloads/terror-bibliothek-windows.zip') as z:
    assert len(z.namelist())==11
    for name in z.namelist():
        assert '/private/' not in name and not name.endswith('.pdf') and '..' not in name
        assert z.read(name)==(root/name).read_bytes(),f'Package stale: {name}'
print('PASS: Windows Python syntax, allowlisted package and current file contents. Native Windows run still required.')
