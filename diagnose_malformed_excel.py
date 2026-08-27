from pathlib import Path
from zipfile import ZipFile

path = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_boleto_grafico_conectado.xlsx')
with ZipFile(path) as z:
    raw = z.read('xl/worksheets/sheet1.xml')
text = raw.decode('utf-8')
for marker in ('AB10', 'AC10', 'M10', 'N10'):
    pos = text.find(f'r="{marker}"')
    print('\n', marker, 'pos', pos, text[max(0,pos-80):pos+500])
