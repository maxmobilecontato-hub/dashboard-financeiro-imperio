from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

path = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_boleto_grafico_conectado.xlsx')
with ZipFile(path) as z: raw = z.read('xl/worksheets/sheet1.xml')
try:
    ET.fromstring(raw)
except ET.ParseError as e:
    print('ERROR', e)
    line, col = e.position
    text = raw.decode('utf-8')
    lines = text.splitlines()
    bad = lines[line-1]
    print('CONTEXT', bad[max(0,col-250):col+250])
