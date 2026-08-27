from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

path = Path('/home/ubuntu/upload/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_aprimorados.xlsx')
ns = {'c':'http://schemas.openxmlformats.org/drawingml/2006/chart'}
with ZipFile(path) as z:
    root = ET.fromstring(z.read('xl/charts/chart3.xml'))
for idx, ser in enumerate(root.findall('.//c:bar3DChart/c:ser', ns), 1):
    def text(path):
        node = ser.find(path, ns)
        return node.text if node is not None else None
    print(idx, 'tx=', text('c:tx/c:strRef/c:f'), 'cat=', text('c:cat/c:numRef/c:f'), 'val=', text('c:val/c:numRef/c:f'))
