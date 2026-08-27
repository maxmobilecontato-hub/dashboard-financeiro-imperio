from pathlib import Path
from zipfile import ZipFile
import re

original = Path('/home/ubuntu/upload/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_aprimorados.xlsx')
final = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_preservados_conectados.xlsx')
with ZipFile(original) as zo, ZipFile(final) as zf:
    original_chart_files = sorted(n for n in zo.namelist() if n.startswith('xl/charts/'))
    final_chart_files = sorted(n for n in zf.namelist() if n.startswith('xl/charts/'))
    assert original_chart_files == final_chart_files
    for name in original_chart_files:
        assert zo.read(name) == zf.read(name), name
    xml = zf.read('xl/worksheets/sheet1.xml').decode('utf-8')
    i5 = re.search(r'<c r="I5"[^>]*><f>(.*?)</f><v>(.*?)</v></c>', xml).groups()
    m5 = re.search(r'<c r="M5"[^>]*><f>(.*?)</f><v>(.*?)</v></c>', xml).groups()
    assert i5[0] == "SUM('CONTROLE- Fluxo de Entrada'!$E$15:$E$1000)"
    assert m5[0] == 'SUMIF(\'Boletos a Pagar- AGOSTO\'!$A$12:$A$1000,"✓",\'Boletos a Pagar- AGOSTO\'!$G$12:$G$1000)'
    assert (b'#REF!' in zo.read('xl/worksheets/sheet1.xml')) == (b'#REF!' in zf.read('xl/worksheets/sheet1.xml'))
print('OK all_chart_xml_preserved=True chart_files=', len(original_chart_files), 'target_formulas_connected=True caches_preserved=True')
