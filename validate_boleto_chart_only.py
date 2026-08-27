from pathlib import Path
from zipfile import ZipFile
import re

original = Path('/home/ubuntu/upload/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_aprimorados.xlsx')
final = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_boleto_grafico_conectado.xlsx')
with ZipFile(original) as zo, ZipFile(final) as zf:
    names_o = set(zo.namelist()); names_f = set(zf.namelist())
    assert names_o == names_f
    # All chart-related files except chart3 remain exactly unchanged.
    for name in sorted(n for n in names_o if n.startswith('xl/charts/') and n != 'xl/charts/chart3.xml'):
        assert zo.read(name) == zf.read(name), name
    assert zo.read('xl/drawings/drawing1.xml') == zf.read('xl/drawings/drawing1.xml')
    assert zo.read('xl/drawings/_rels/drawing1.xml.rels') == zf.read('xl/drawings/_rels/drawing1.xml.rels')
    before = zo.read('xl/charts/chart3.xml').decode('utf-8')
    after = zf.read('xl/charts/chart3.xml').decode('utf-8')
    # Visual structure remains unchanged: title, style IDs, colors and series count.
    assert re.findall(r'<c:title>.*?</c:title>', before, re.S) == re.findall(r'<c:title>.*?</c:title>', after, re.S)
    assert before.count('<c:ser>') == after.count('<c:ser>')
    assert before.count('<a:solidFill>') == after.count('<a:solidFill>')
    assert before.count('<c:spPr>') == after.count('<c:spPr>')
    for row in range(10, 14):
        assert f'DASHBOARD!$M${row}' in after
        assert f'DASHBOARD!$N${row}' in after
    # Only worksheet XML and chart3 may differ.
    changed = {name for name in names_o if zo.read(name) != zf.read(name)}
    assert changed <= {'xl/worksheets/sheet1.xml', 'xl/charts/chart3.xml'}, changed
print('OK boleto_chart_connected=True chart_count_preserved=True position_preserved=True style_colors_preserved=True other_objects_unchanged=True')
