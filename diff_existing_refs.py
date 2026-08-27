from pathlib import Path
from zipfile import ZipFile

paths = [Path('/home/ubuntu/upload/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_aprimorados.xlsx'), Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_originais_conectados.xlsx')]
def refs(path):
    with ZipFile(path) as z:
        return {n: z.read(n).count(b'#REF!') for n in z.namelist() if n.endswith('.xml')}
a, b = map(refs, paths)
for name in sorted(set(a) | set(b)):
    if a.get(name, 0) != b.get(name, 0): print(name, a.get(name, 0), b.get(name, 0))
