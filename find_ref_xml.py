from pathlib import Path
from zipfile import ZipFile
import re

source = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_conectados.xlsx')
with ZipFile(source) as package:
    for name in package.namelist():
        if not name.endswith('.xml'):
            continue
        raw = package.read(name).decode('utf-8', errors='replace')
        if '#REF!' in raw:
            print('FILE', name)
            for match in re.finditer(r'.{0,250}#REF!.{0,350}', raw):
                print(match.group(0))
