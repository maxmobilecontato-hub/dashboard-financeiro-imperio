import * as XLSX from 'xlsx';
import { readFileSync } from 'node:fs';
import { findReceivablesAmountColumn, parseReceivablesRows } from './client/src/lib/financeRules';

const path = '/home/ubuntu/upload/4-MICHAEL-DSHBOARDFINANCEIRO-25-08-2026_status_cores_funcionais.xlsx';
const workbook = XLSX.read(readFileSync(path), { type: 'buffer', cellDates: true });
const sheetName = workbook.SheetNames.find((name) => name.toLowerCase().includes('pagamentos') && name.toLowerCase().includes('receber'));
if (!sheetName) throw new Error('Aba de pagamentos a receber não encontrada');
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, raw: true, defval: '' }) as unknown[][];
const parsed = parseReceivablesRows(rows);
console.log(JSON.stringify({ sheetName, amountColumn: String.fromCharCode(65 + findReceivablesAmountColumn(rows)), rowCount: parsed.length, amounts: parsed.map((item) => item.amount), total: parsed.reduce((sum, item) => sum + item.amount, 0), names: parsed.map((item) => item.name) }, null, 2));
