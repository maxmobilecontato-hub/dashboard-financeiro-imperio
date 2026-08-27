from pathlib import Path
from openpyxl import load_workbook

path = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_conectados.xlsx')
wb = load_workbook(path, data_only=False)
ws = wb['DASHBOARD']
assert len(ws._charts) == 4
expected = [
    ('DASHBOARD!$Y$18:$Y$20', 'DASHBOARD!$X$18:$X$20'),
    ('DASHBOARD!$Y$23:$Y$25', 'DASHBOARD!$X$23:$X$25'),
    ('DASHBOARD!$D$10:$D$14', 'DASHBOARD!$C$10:$C$14'),
    ('DASHBOARD!$J$10:$J$14', 'DASHBOARD!$I$10:$I$14'),
]
for chart, (values_expected, categories_expected) in zip(ws._charts, expected):
    series = chart.ser[0]
    values = series.val.numRef.f.replace("'", '')
    categories = (series.cat.strRef.f if series.cat.strRef else series.cat.numRef.f).replace("'", '')
    assert values == values_expected, (values, values_expected)
    assert categories == categories_expected, (categories, categories_expected)
print('OK chart_sources_linked=True operational_summary_cells=True charts=4')
