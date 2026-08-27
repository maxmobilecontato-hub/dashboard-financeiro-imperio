from pathlib import Path
from zipfile import ZipFile
import re

path = Path('/home/ubuntu/upload/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_aprimorados.xlsx')
with ZipFile(path) as z:
    xml = z.read('xl/worksheets/sheet1.xml').decode('utf-8')
for cell in ('I5', 'M5', 'Y18', 'Y20'):
    match = re.search(r'<c r="' + cell + r'"[^>]*>.*?</c>', xml)
    print(cell, match.group(0) if match else 'NOT_FOUND')
