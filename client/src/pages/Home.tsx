import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  FileSpreadsheet,
  Landmark,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Upload,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { calculateProfit, getBillStatus, isValidXlsxFile, parseReceivablesRows } from "@/lib/financeRules";

type Bill = { dueDate: Date | null; amount: number; proof: boolean; name: string };
type Ledger = { date: Date | null; amount: number; name: string; method?: string };
type DashboardData = { entries: Ledger[]; expenses: Ledger[]; bills: Bill[]; receivables: Ledger[]; fileName: string; importedAt: string };

const emptyData: DashboardData = { entries: [], expenses: [], bills: [], receivables: [], fileName: "Nenhum arquivo importado", importedAt: "—" };
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const compactMoney = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 });
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function normalized(value: unknown) { return String(value ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function numberValue(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const text = String(value ?? "").replace(/R\$\s?/gi, "").replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}
function dateValue(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") { const parsed = XLSX.SSF.parse_date_code(value); return parsed ? new Date(parsed.y, parsed.m - 1, parsed.d) : null; }
  const text = String(value ?? "").trim(); if (!text) return null;
  const br = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/); if (br) return new Date(Number(br[3].length === 2 ? `20${br[3]}` : br[3]), Number(br[2]) - 1, Number(br[1]));
  const parsed = new Date(text); return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function findHeader(rows: unknown[][], terms: string[]) {
  return rows.findIndex((row) => terms.every((term) => row.some((cell) => normalized(cell).includes(term))));
}
function headerIndex(row: unknown[], terms: string[]) { return row.findIndex((cell) => terms.some((term) => normalized(cell).includes(term))); }
function parseLedger(rows: unknown[][], terms: string[], amountTerms: string[], methodTerms: string[] = []) {
  const headerRow = findHeader(rows, terms); if (headerRow < 0) return [];
  const headers = rows[headerRow]; const dateIndex = headerIndex(headers, ["data"]); const amountIndex = headerIndex(headers, amountTerms); const methodIndex = methodTerms.length ? headerIndex(headers, methodTerms) : -1;
  if (dateIndex < 0 || amountIndex < 0) return [];
  return rows.slice(headerRow + 1).map((row) => ({ date: dateValue(row[dateIndex]), amount: numberValue(row[amountIndex]), name: String(row[1] ?? row[2] ?? "Lançamento"), method: methodIndex >= 0 ? String(row[methodIndex] ?? "").trim() : undefined })).filter((item) => item.amount > 0 || item.date);
}
function parseBills(rows: unknown[][]) {
  const headerRow = findHeader(rows, ["data de vencimento", "valor"]); if (headerRow < 0) return [];
  const headers = rows[headerRow]; const dueIndex = headerIndex(headers, ["data de vencimento", "vencimento"]); const amountIndex = headerIndex(headers, ["valor do boleto", "valor"]); const proofIndex = headerIndex(headers, ["comprovante"]);
  return rows.slice(headerRow + 1).map((row) => ({ dueDate: dateValue(row[dueIndex]), amount: numberValue(row[amountIndex]), proof: proofIndex >= 0 && String(row[proofIndex] ?? "").trim() !== "" && String(row[proofIndex] ?? "").trim() !== "....", name: String(row[2] ?? row[1] ?? "Boleto") })).filter((item) => item.amount > 0 || item.dueDate);
}
function parseReceivables(rows: unknown[][]) {
  const headerRow = findHeader(rows, ["nome"]); if (headerRow < 0) return [];
  const headers = rows[headerRow]; const dateIndex = Math.max(0, headerIndex(headers, ["data processamento", "data"])); const nameIndex = Math.max(0, headerIndex(headers, ["nome"]));
  let amountIndex = headerIndex(headers, ["valor", "valores", "recebimento"]);
  if (amountIndex < 0) {
    const candidates = headers.map((_, index) => index).filter((index) => index !== dateIndex);
    amountIndex = candidates.sort((a, b) => {
      const score = (column: number) => rows.slice(headerRow + 1, headerRow + 30).filter((row) => numberValue(row[column]) > 0).length;
      return score(b) - score(a);
    })[0] ?? -1;
  }
  if (amountIndex < 0) return [];
  return rows.slice(headerRow + 1).map((row) => ({ date: dateValue(row[dateIndex]), amount: numberValue(row[amountIndex]), name: String(row[nameIndex] ?? "Recebimento") })).filter((item) => item.amount > 0 || item.date);
}
function findSheet(workbook: XLSX.WorkBook, terms: string[]) { return workbook.SheetNames.find((name) => terms.every((term) => normalized(name).includes(term))); }
function parseWorkbook(workbook: XLSX.WorkBook, fileName: string): DashboardData {
  const rowsFor = (terms: string[]) => { const name = findSheet(workbook, terms); return name ? XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, raw: true, defval: "" }) as unknown[][] : []; };
  const importedAt = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  return { entries: parseLedger(rowsFor(["controle", "fluxo", "entrada"]), ["data", "valor"], ["valor", "valores"]), expenses: parseLedger(rowsFor(["controle", "fluxo", "saida"]), ["data", "valor"], ["valor"], ["forma de pagamento"]), bills: parseBills(rowsFor(["boletos", "pagar"])), receivables: parseReceivablesRows(rowsFor(["pagamentos", "receber"])), fileName, importedAt };
}

function StatCard({ label, value, icon: Icon, accent, detail }: { label: string; value: string; icon: typeof Wallet; accent: string; detail?: string }) {
  return <Card className="stat-card"><CardContent className="p-0"><div className={cn("stat-icon", accent)}><Icon size={21} /></div><div className="stat-copy"><p>{label}</p><strong>{value}</strong>{detail && <span>{detail}</span>}</div></CardContent></Card>;
}
function chartMoney(value: number) { return compactMoney.format(value).replace(" ", " "); }

export default function Home() {
  const [data, setData] = useState<DashboardData>(() => { const raw = localStorage.getItem("finance-dashboard-data"); if (!raw) return emptyData; try { const parsed = JSON.parse(raw) as DashboardData; return { ...parsed, entries: parsed.entries.map((item) => ({ ...item, date: dateValue(item.date) })), expenses: parsed.expenses.map((item) => ({ ...item, date: dateValue(item.date) })), receivables: parsed.receivables.map((item) => ({ ...item, date: dateValue(item.date) })), bills: parsed.bills.map((item) => ({ ...item, dueDate: dateValue(item.dueDate) })) }; } catch { return emptyData; } });
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const summary = useMemo(() => {
    const entries = data.entries.reduce((sum, item) => sum + item.amount, 0); const expenses = data.expenses.reduce((sum, item) => sum + item.amount, 0); const bills = data.bills.reduce((sum, item) => sum + item.amount, 0); const receivables = data.receivables.reduce((sum, item) => sum + item.amount, 0);
    const paid = data.bills.filter((b) => getBillStatus(b.dueDate, b.proof, today) === "paid"); const overdue = data.bills.filter((b) => getBillStatus(b.dueDate, b.proof, today) === "overdue"); const onTime = data.bills.filter((b) => getBillStatus(b.dueDate, b.proof, today) === "on-time");
    return { entries, expenses, bills, receivables, paid, overdue, onTime, balance: calculateProfit([{ amount: entries }], [{ amount: expenses }], [{ amount: bills }]) };
  }, [data, today]);
  const monthly = useMemo(() => monthNames.map((month, index) => { const entries = data.entries.filter((item) => item.date?.getMonth() === index); const expenses = data.expenses.filter((item) => item.date?.getMonth() === index); const bills = data.bills.filter((item) => item.dueDate?.getMonth() === index); return { month, lucro: calculateProfit(entries, expenses, bills) }; }), [data]);
  const paymentMethods = useMemo(() => { const map = new Map<string, number>(); data.expenses.forEach((item) => { const key = item.method || "Outros"; map.set(key, (map.get(key) || 0) + item.amount); }); return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name: name.length > 18 ? `${name.slice(0, 18)}…` : name, value })); }, [data]);
  const comparison = [{ name: "Entradas", value: summary.entries }, { name: "Saídas", value: summary.expenses }, { name: "Boletos", value: summary.bills }];
  const statusData = [{ name: "Pagos", value: summary.paid.length, color: "#93D44A" }, { name: "Vencidos", value: summary.overdue.length, color: "#EA665A" }, { name: "Em dia", value: summary.onTime.length, color: "#F4B183" }];
  const statusText = data.bills.length ? `${summary.paid.length} pagos · ${summary.overdue.length} vencidos · ${summary.onTime.length} em dia` : "Importe sua planilha para visualizar";
  async function handleFile(file?: File) { if (!file) return; setError(""); if (!isValidXlsxFile(file.name)) { setError("Formato inválido. Envie somente um arquivo .xlsx."); return; } setLoading(true); try { const buffer = await file.arrayBuffer(); const workbook = XLSX.read(buffer, { type: "array", cellDates: true }); const next = parseWorkbook(workbook, file.name); setData(next); localStorage.setItem("finance-dashboard-data", JSON.stringify(next)); } catch { setError("Não foi possível ler este arquivo. Verifique se ele é um Excel .xlsx válido."); } finally { setLoading(false); } }
  return <div className="dashboard-shell">
    <aside className="sidebar"><div className="brand-mark"><span>MF</span></div><div className="brand-caption">FINANCE<br /><b>CONTROL</b></div><nav><a className="active"><LayoutDashboard size={18} /><span>Visão geral</span></a><a><Wallet size={18} /><span>Fluxo de caixa</span></a><a><Landmark size={18} /><span>Boletos</span></a><a><CircleDollarSign size={18} /><span>Recebimentos</span></a></nav><div className="sidebar-foot"><div className="mini-status"><span className="pulse" /> Sincronização local</div></div></aside>
    <main className="main-content"><header className="topbar"><div><p className="eyebrow">CENTRAL FINANCEIRA</p><h1>Visão geral</h1><p className="subtitle">Uma leitura clara do seu negócio, em um só lugar.</p></div><div className="top-actions"><div className="date-chip"><CalendarDays size={17} /><span>Atualizado em<br /><b>{data.importedAt}</b></span></div><label className="upload-button">{loading ? <Loader2 className="spin" size={18} /> : <Upload size={18} />}<span>{loading ? "Lendo planilha…" : "Importar XLSX"}</span><input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => handleFile(event.target.files?.[0])} /></label></div></header>
      {error && <div className="error-banner"><CircleAlert size={18} />{error}</div>}
      <section className="hero-strip"><div><span className="hero-kicker">LUCRATIVIDADE ACUMULADA</span><strong>{money.format(summary.balance)}</strong><p>Entradas menos saídas e boletos a pagar</p></div><div className="hero-visual"><div className="hero-ring"><span>R$</span></div><div><b>{data.fileName === "Nenhum arquivo importado" ? "Comece pela sua base" : "Base sincronizada"}</b><small>{data.fileName}</small></div></div></section>
      <section className="stats-grid"><StatCard label="Total de entradas" value={money.format(summary.entries)} icon={ArrowDownRight} accent="accent-cyan" detail={`${data.entries.length} lançamentos`} /><StatCard label="Total de saídas" value={money.format(summary.expenses)} icon={ArrowUpRight} accent="accent-magenta" detail={`${data.expenses.length} lançamentos`} /><StatCard label="Boletos a pagar" value={money.format(summary.bills)} icon={FileSpreadsheet} accent="accent-orange" detail={`${data.bills.length} títulos`} /><StatCard label="A receber" value={money.format(summary.receivables)} icon={CircleDollarSign} accent="accent-purple" detail={`${data.receivables.length} registros`} /></section>
      <section className="content-grid"><Card className="chart-card chart-wide"><CardHeader><div><p className="section-label">PERFORMANCE</p><CardTitle>Lucro líquido por mês</CardTitle></div><div className="legend-pill"><span /> Atualização automática</div></CardHeader><CardContent><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthly} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6C63FF" stopOpacity={0.5} /><stop offset="100%" stopColor="#6C63FF" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#293251" strokeDasharray="3 5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8C96B5", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8C96B5", fontSize: 11 }} tickFormatter={chartMoney} /><Tooltip contentStyle={{ background: "#1D2541", border: "1px solid #354269", borderRadius: 12, color: "#fff" }} formatter={(value: number) => [money.format(value), "Lucro líquido"]} /><Area type="monotone" dataKey="lucro" stroke="#8B82FF" strokeWidth={3} fill="url(#profitFill)" dot={{ r: 3, fill: "#D9D6FF", stroke: "#6C63FF", strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div></CardContent></Card>
        <Card className="chart-card"><CardHeader><div><p className="section-label">ACOMPANHAMENTO</p><CardTitle>Status dos boletos</CardTitle></div></CardHeader><CardContent><div className="donut-layout"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={77} paddingAngle={3} stroke="none"><Cell fill="#93D44A" /><Cell fill="#EA665A" /><Cell fill="#F4B183" /></Pie><Tooltip contentStyle={{ background: "#1D2541", border: "1px solid #354269", borderRadius: 12, color: "#fff" }} /></PieChart></ResponsiveContainer><div className="donut-center"><b>{data.bills.length}</b><span>boletos</span></div></div><div className="status-list"><div><i className="dot green" /><span>Pagos</span><b>{summary.paid.length}</b></div><div><i className="dot red" /><span>Vencidos</span><b>{summary.overdue.length}</b></div><div><i className="dot orange" /><span>Em dia</span><b>{summary.onTime.length}</b></div></div></div><p className="chart-footnote">{statusText}</p></CardContent></Card>
        <Card className="chart-card"><CardHeader><div><p className="section-label">COMPOSIÇÃO</p><CardTitle>Despesas por lançamento</CardTitle></div></CardHeader><CardContent><div className="chart-wrap short"><ResponsiveContainer width="100%" height="100%"><BarChart data={paymentMethods} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#293251" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{ fill: "#AAB3CA", fontSize: 10 }} /><Tooltip contentStyle={{ background: "#1D2541", border: "1px solid #354269", borderRadius: 12, color: "#fff" }} formatter={(value: number) => [money.format(value), "Valor"]} /><Bar dataKey="value" fill="#B04B9B" radius={[0, 5, 5, 0]} barSize={15} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card className="chart-card"><CardHeader><div><p className="section-label">MOVIMENTO</p><CardTitle>Entradas x compromissos</CardTitle></div></CardHeader><CardContent><div className="chart-wrap short"><ResponsiveContainer width="100%" height="100%"><BarChart data={comparison} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid vertical={false} stroke="#293251" strokeDasharray="3 5" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#AAB3CA", fontSize: 10 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8C96B5", fontSize: 10 }} tickFormatter={chartMoney} /><Tooltip contentStyle={{ background: "#1D2541", border: "1px solid #354269", borderRadius: 12, color: "#fff" }} formatter={(value: number) => [money.format(value), "Valor"]} /><Bar dataKey="value" radius={[6, 6, 0, 0]}><Cell fill="#2CB5C8" /><Cell fill="#C64D9B" /><Cell fill="#F4B183" /></Bar></BarChart></ResponsiveContainer></div></CardContent></Card></section>
      <section className="bottom-grid"><Card className="import-card"><CardHeader><div><p className="section-label">ÚLTIMA IMPORTAÇÃO</p><CardTitle>Histórico da base</CardTitle></div><RefreshCw size={18} className="muted-icon" /></CardHeader><CardContent><div className="import-row"><div className="file-icon"><FileSpreadsheet size={22} /></div><div className="import-meta"><b>{data.fileName}</b><span>{data.importedAt} · Base atual substituída</span></div><div className="import-check"><Check size={16} /></div></div><Progress value={data.fileName === "Nenhum arquivo importado" ? 0 : 100} className="progress-track" /></CardContent></Card><Card className="attention-card"><CardHeader><div><p className="section-label">PONTOS DE ATENÇÃO</p><CardTitle>Prioridades financeiras</CardTitle></div><ChevronDown size={18} className="muted-icon" /></CardHeader><CardContent><div className="attention-line"><span className="priority red" /><div><b>{summary.overdue.length ? `${summary.overdue.length} boleto(s) vencido(s)` : "Nenhum boleto vencido"}</b><small>{summary.overdue.length ? "Revisar pagamentos pendentes" : "Sua agenda está em dia"}</small></div><CircleAlert size={18} className="attention-icon" /></div><div className="attention-line"><span className="priority orange" /><div><b>{summary.onTime.length ? `${summary.onTime.length} boleto(s) em acompanhamento` : "Sem boletos em acompanhamento"}</b><small>Próximos vencimentos da base</small></div><CalendarDays size={18} className="attention-icon" /></div></CardContent></Card></section>
    </main>
  </div>;
}
