"""Extract user-provided PDFs locally; no full text enters the public repository."""
import json, sys, shutil
from pathlib import Path
from pypdf import PdfReader
out=Path(__file__).parent/'private'
out.mkdir(exist_ok=True,mode=0o700)
docs=[]
for source,tag,label in [(sys.argv[1],'PDF','Terror · btb-PDF'),(sys.argv[2],'ARG','Argumentationslehre')]:
    path=Path(source)
    shutil.copy2(path,out/(tag+'.pdf'))
    for page_no,page in enumerate(PdfReader(path).pages,1):
        text=page.extract_text() or ''
        section=' · Urteilsfassung: Verurteilung' if tag=='PDF' and 87<=page_no<=90 else ' · Urteilsfassung: Freispruch' if tag=='PDF' and 91<=page_no<=93 else ' · Rede im Anhang' if tag=='PDF' and page_no>=95 else ''
        # Overlapping chunks keep local context while retaining exact page references.
        for start in range(0,len(text),1400):
            chunk=text[start:start+1800].strip()
            if chunk:docs.append({'id':f'{tag}-{page_no}-{start//1400+1}','label':f'{label}, PDF-S. {page_no}{section}','text':chunk,'page':page_no,'kind':tag})
(out/'documents.json').write_text(json.dumps(docs,ensure_ascii=False))
print(f'{len(docs)} lokale Textabschnitte indexiert.')
