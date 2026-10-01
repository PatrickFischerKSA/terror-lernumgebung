"""Create a public Mac setup ZIP with an explicit allowlist and no private data."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
files=['library/Einrichten-Mac.command','library/install-mac.py','library/MAC.md','library/index-pdf.py','library/start-service.mjs','library/bridge.mjs','library/retrieval.mjs','library/policy.json','library/rubric.json','dist/spielraum/content.js','dist/spielraum/laws.json']
output=root/'dist/downloads/terror-bibliothek-mac.zip';output.parent.mkdir(exist_ok=True)
with ZipFile(output,'w',ZIP_DEFLATED) as bundle:
    for name in files:bundle.write(root/name,name)
print(output)
