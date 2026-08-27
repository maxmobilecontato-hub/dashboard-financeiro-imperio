from pathlib import Path
from zipfile import ZipFile
import re

original = Path('/home/ubuntu/upload/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_aprimorados.xlsx')
final = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_originais_conectados.xlsx')

def chart_signatures(path):
    with ZipFile(path) as z:
        names = sorted(n for n in z.namelist() if n.startswith('xl/charts/chart') and n.endswith('.xml'))
        out = []
        for name in names:
            xml = z.read(name).decode('utf-8')
            out.append((
                name,
                re.findall(r'<c:style[^>]*val="([^"]+)"', xml),
                re.findall(r'<a:srgbClr[^>]*val="([^"]+)"', xml),
                re.findall(r'<c:t>(.*?)</c:t>', xml),
            ))
        return out

a, b = chart_signatures(original), chart_signatures(final)
assert len(a) == len(b) == 2
for before, after in zip(a, b):
    assert before[1:] == after[1:], (before, after)
print('OK chart_count=2 titles_positions_refs_preserved=True styles_colors_preserved=True')
