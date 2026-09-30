"""Refresh public-domain legal texts from the official federal portal."""
import urllib.request, zipfile, io, xml.etree.ElementTree as E, json, datetime
from pathlib import Path
base='https://www.gesetze-im-internet.de/'
def norms(law):
    archive=zipfile.ZipFile(io.BytesIO(urllib.request.urlopen(base+law+'/xml.zip',timeout=45).read()))
    data=archive.read(archive.namelist()[0])
    root=E.fromstring(data)
    result=[]
    for n in root.findall('norm'):
        label=n.findtext('metadaten/enbez','')
        title=n.findtext('metadaten/titel','')
        text=n.find('textdaten/text')
        if text is None: continue
        paras=[''.join(p.itertext()).strip() for p in text.iter('P')]
        if not paras: paras=[''.join(text.itertext()).strip()]
        if not any(paras): continue
        result.append({'label':label,'title':title,'text':'\n\n'.join(paras),'url':base+law+'/'+ ('art_'+label.split()[-1].lower()+'.html' if law=='gg' and label.startswith('Art') else '__'+label.split()[-1]+'.html' if label.startswith('§') else 'BJNR'+{'gg':'000010949','stgb':'001270871','stpo':'006290950'}[law]+'.html')})
    return result
out={'retrieved':datetime.date.today().isoformat(),'source':base,'gg':norms('gg')}
for law,ids in [('stgb',['§ 15','§ 16','§ 17','§ 32','§ 34','§ 35','§ 211','§ 212']),('stpo',['§ 136','§ 160','§ 238','§ 240','§ 244','§ 258','§ 261','§ 267','§ 397'])]:
    out[law]=[n for n in norms(law) if n['label'] in ids]
Path('dist/spielraum/laws.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print({k:len(v) for k,v in out.items() if isinstance(v,list)})
