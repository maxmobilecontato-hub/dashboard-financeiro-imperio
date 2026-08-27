from pathlib import Path
from openpyxl import load_workbook
source = Path('/home/ubuntu/5-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_graficos_conectados.xlsx')
wb = load_workbook(source, data_only=False)
ws = wb['Boletos a Pagar- AGOSTO']
for cf in ws.conditional_formatting:
    for rule in ws.conditional_formatting[cf]:
        formulas = [str(item) for item in (rule.formula or [])]
        if any('#REF!' in item for item in formulas):
            print('RANGE', cf, 'TYPE', rule.type, 'FORMULAS', formulas)
