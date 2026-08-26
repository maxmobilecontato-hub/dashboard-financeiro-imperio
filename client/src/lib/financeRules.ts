export type FinancialItem = { amount: number };

export function isValidXlsxFile(fileName: string) {
  return fileName.toLowerCase().endsWith('.xlsx');
}

export function calculateProfit(entries: FinancialItem[], expenses: FinancialItem[], bills: FinancialItem[]) {
  const total = (items: FinancialItem[]) => items.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0);
  return total(entries) - total(expenses) - total(bills);
}

export function getBillStatus(dueDate: Date | null, hasProof: boolean, today = new Date()) {
  if (hasProof) return 'paid' as const;
  if (!dueDate) return 'unknown' as const;
  const reference = new Date(today); reference.setHours(0, 0, 0, 0);
  const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
  return due < reference ? 'overdue' as const : 'on-time' as const;
}

export type ReceivableRow = { date: Date | null; amount: number; name: string };

function normalizeCell(value: unknown) {
  return String(value ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function numericCell(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value ?? '').replace(/R\$\s?/gi, '').replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}
function parseDateCell(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const text = String(value ?? '').trim();
  const br = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (br) return new Date(Number(br[3].length === 2 ? `20${br[3]}` : br[3]), Number(br[2]) - 1, Number(br[1]));
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function extractInvoiceTotalText(text: string) { const matches = Array.from(text.matchAll(/(?:valor\s+total|total\s+da\s+nota|valor\s+dos\s+produtos)[^\d]{0,30}(?:R\$\s*)?([\d.]+,\d{2})/gi)); const values = matches.map((match) => numericCell(match[1])); return values.length ? Math.max(...values) : 0; }
export function isValidPdfFile(name: string) { return name.toLowerCase().endsWith('.pdf'); }

export function findReceivablesAmountColumn(rows: unknown[][]) {
  const headerRow = rows.findIndex((row) => row.some((cell) => normalizeCell(cell) === 'nome'));
  if (headerRow < 0) return -1;
  const headers = rows[headerRow] ?? [];
  const dateIndex = Math.max(0, headers.findIndex((cell) => normalizeCell(cell).includes('data')));
  const nameIndex = Math.max(0, headers.findIndex((cell) => normalizeCell(cell) === 'nome'));
  const codeIndex = headers.findIndex((cell) => normalizeCell(cell).includes('codigo'));
  const explicit = headers.findIndex((cell) => ['valor', 'valores', 'recebimento'].some((term) => normalizeCell(cell).includes(term)));
  if (explicit >= 0) return explicit;
  const candidates = headers.map((_, index) => index).filter((index) => index !== dateIndex && index !== nameIndex && index !== codeIndex);
  return candidates.sort((a, b) => {
    const score = (index: number) => rows.slice(headerRow + 1).filter((row) => typeof row[index] === 'number' && Number.isFinite(row[index]) && row[index] > 0).length;
    return score(b) - score(a);
  })[0] ?? -1;
}

export function parseReceivablesRows(rows: unknown[][]): ReceivableRow[] {
  const headerRow = rows.findIndex((row) => row.some((cell) => normalizeCell(cell) === 'nome'));
  if (headerRow < 0) return [];
  const headers = rows[headerRow] ?? [];
  const dateIndex = Math.max(0, headers.findIndex((cell) => normalizeCell(cell).includes('data')));
  const nameIndex = Math.max(0, headers.findIndex((cell) => normalizeCell(cell) === 'nome'));
  const amountIndex = findReceivablesAmountColumn(rows);
  if (amountIndex < 0) return [];
  return rows.slice(headerRow + 1).map((row) => ({ date: parseDateCell(row[dateIndex]), amount: numericCell(row[amountIndex]), name: String(row[nameIndex] ?? '').trim() })).filter((item) => item.amount > 0 && item.name.length > 0);
}

export function rankByName(rows: Array<{ name: string; amount: number }>, limit = 5) {
  const grouped = new Map<string, number>();
  rows.forEach((row) => { const name = row.name.trim() || "Não identificado"; grouped.set(name, (grouped.get(name) || 0) + row.amount); });
  return Array.from(grouped.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([name, value]) => ({ name, value }));
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function buildMonthlyProfitComparison<T extends { key: string; label: string; data: { entries: Array<{ amount: number }>; expenses: Array<{ amount: number }>; bills: Array<{ amount: number }> } }>(bases: T[]) {
  return bases.slice().sort((a, b) => a.key.localeCompare(b.key)).map((base) => ({ name: base.label, lucro: calculateProfit(base.data.entries, base.data.expenses, base.data.bills) }));
}

export function buildMonthlyRevenueComparison<T extends { key: string; label: string; data: { entries: Array<{ amount: number }> } }>(bases: T[]) {
  return bases.slice().sort((a, b) => a.key.localeCompare(b.key)).map((base) => ({ name: base.label, faturamento: base.data.entries.reduce((sum, item) => sum + item.amount, 0) }));
}
