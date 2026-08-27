from pathlib import Path
from openpyxl import load_workbook
source = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_conectados.xlsx')
wb = load_workbook(source, data_only=False)
for ws in wb.worksheets:
    for cell in ws._cells.values():
        value = cell.value
        text = getattr(value, 'text', value)
        if isinstance(text, str) and '#REF!' in text:
            print(ws.title, cell.coordinate, text)
