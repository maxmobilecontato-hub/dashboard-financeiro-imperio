from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

path = Path('/home/ubuntu/upload/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_aprimorados.xlsx')
NS = {'xdr':'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing','c':'http://schemas.openxmlformats.org/drawingml/2006/chart','cx':'http://schemas.microsoft.com/office/drawing/2014/chartex','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
with ZipFile(path) as z:
    drawing = ET.fromstring(z.read('xl/drawings/drawing1.xml'))
    rels = ET.fromstring(z.read('xl/drawings/_rels/drawing1.xml.rels'))
    relmap = {rel.attrib['Id']: rel.attrib['Target'] for rel in rels}
    for anchor in list(drawing):
        frm = anchor.find('xdr:from', NS)
        if frm is None: continue
        pos = (frm.findtext('xdr:col', namespaces=NS), frm.findtext('xdr:row', namespaces=NS))
        frame = anchor.find('.//xdr:graphicFrame', NS)
        if frame is None: continue
        chart = frame.find('.//c:chart', NS)
        if chart is None:
            chart = frame.find('.//cx:chart', NS)
        if chart is None: continue
        rid = chart.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
        target = relmap.get(rid)
        title = ''
        if target:
            chart_path = 'xl/' + target.replace('../','')
            raw = z.read(chart_path)
            try:
                cxroot = ET.fromstring(raw)
                title = ''.join(cxroot.itertext())[:200]
            except Exception: pass
        print('anchor', pos, 'rel', rid, 'target', target, 'title_text', title)
