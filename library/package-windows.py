"""Create a public Windows setup ZIP containing code, never PDFs or credentials."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
files=['library/Einrichten-Windows.cmd','library/install-windows.py','library/WINDOWS.md','library/index-pdf.py','library/start-service.mjs','library/bridge.mjs','library/retrieval.mjs','library/policy.json','library/rubric.json','dist/spielraum/content.js','dist/spielraum/laws.json']
output=root/'dist/downloads/terror-bibliothek-windows.zip';output.parent.mkdir(exist_ok=True)
with ZipFile(output,'w',ZIP_DEFLATED) as bundle:
    for name in files:bundle.write(root/name,name)
print(output)
