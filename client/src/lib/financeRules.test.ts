import { describe, expect, it } from "vitest";
import {
  buildMonthlyProfitComparison,
  buildMonthlyRevenueComparison,
  calculateProfit,
  classifyInvoiceCompany,
  extractInvoiceCnpj,
  extractInvoiceDateText,
  extractInvoiceTotalText,
  percentChange,
  getBillStatus,
  isValidPdfFile,
  isValidXlsxFile,
  parseReceivablesRows,
  rankByName,
} from "./financeRules";

describe("finance dashboard rules", () => {
  it("calculates profit as entries minus expenses minus bills", () => {
    expect(calculateProfit([{ amount: 1000 }], [{ amount: 250 }], [{ amount: 150 }])).toBe(600);
  });

  it("prioritizes payment proof over the due date", () => {
    expect(getBillStatus(new Date("2026-01-01"), true, new Date("2026-02-01"))).toBe("paid");
    expect(getBillStatus(new Date("2026-01-01"), false, new Date("2026-02-01"))).toBe("overdue");
    expect(getBillStatus(new Date("2026-03-01"), false, new Date("2026-02-01"))).toBe("on-time");
  });

  it("accepts only xlsx uploads", () => {
    expect(isValidXlsxFile("financeiro.xlsx")).toBe(true);
    expect(isValidXlsxFile("financeiro.xls")).toBe(false);
    expect(isValidXlsxFile("financeiro.csv")).toBe(false);
  });

  it("reads receivables when the amount header is missing", () => {
    const rows = [
      ["CÓDIGO", "DATA DO PROCESSAMENTO", "NOME", "DATA", "", "DIAS"],
      [1, "05/08/2026", "BIG BEN AGRO LTDA", "31/08/2026", 760, '=IF(F9="","",D9-TODAY())'],
      [2, "06/08/2026", "ANCORE", "31/08/2026", 21300, '=IF(F10="","",D10-TODAY())'],
    ];
    const parsed = parseReceivablesRows(rows);
    expect(parsed).toHaveLength(2);
    expect(parsed.map((item) => item.amount)).toEqual([760, 21300]);
    expect(parsed[0]?.name).toBe("BIG BEN AGRO LTDA");
  });

  it("ranks customers and suppliers without empty names", () => {
    expect(rankByName([{ name: "A", amount: 10 }, { name: "A", amount: 30 }, { name: "", amount: 20 }, { name: "B", amount: 50 }], 2)).toEqual([{ name: "A", value: 40 }, { name: "B", value: 50 }].sort((a, b) => b.value - a.value));
  });

  it("calculates month-over-month variation", () => {
    expect(percentChange(120, 100)).toBe(20);
    expect(percentChange(0, 0)).toBe(0);
    expect(percentChange(100, 0)).toBeNull();
  });

  it("compares multiple imported monthly bases dynamically", () => {
    const bases = [
      { key: "2026-09", label: "Set 2026", data: { entries: [{ amount: 1500 }], expenses: [{ amount: 300 }], bills: [{ amount: 100 }] } },
      { key: "2026-08", label: "Ago 2026", data: { entries: [{ amount: 1000 }], expenses: [{ amount: 200 }], bills: [{ amount: 100 }] } },
    ];
    expect(buildMonthlyProfitComparison(bases)).toEqual([{ name: "Ago 2026", lucro: 700 }, { name: "Set 2026", lucro: 1100 }]);
    expect(buildMonthlyRevenueComparison(bases)).toEqual([{ name: "Ago 2026", faturamento: 1000 }, { name: "Set 2026", faturamento: 1500 }]);
  });

  it("validates PDF files and extracts an invoice total", () => {
    expect(isValidPdfFile("nota.pdf")).toBe(true);
    expect(isValidPdfFile("nota.xlsx")).toBe(false);
    expect(extractInvoiceTotalText("VALOR TOTAL DA NOTA R$ 1.234,56")).toBe(1234.56);
    expect(extractInvoiceTotalText("documento sem valor")).toBe(0);
  });

  it("separates Império dos Balões BH before the base company name", () => {
    expect(classifyInvoiceCompany("DESTINATÁRIO: IMPÉRIO DOS BALÕES BH\nCNPJ: 12.345.678/0001-90")).toEqual({ company: "imperio-bh", cnpj: "12.345.678/0001-90" });
    expect(classifyInvoiceCompany("DESTINATÁRIO: IMPÉRIO DOS BALÕES\nCNPJ: 98.765.432/0001-10")).toEqual({ company: "imperio", cnpj: "98.765.432/0001-10" });
  });

  it("extracts invoice CNPJ and emission date and keeps unknown documents reviewable", () => {
    expect(extractInvoiceCnpj("CNPJ: 12.345.678/0001-90")).toBe("12.345.678/0001-90");
    expect(extractInvoiceDateText("DATA DE EMISSÃO: 08/09/2026")?.toISOString().slice(0, 10)).toBe("2026-09-08");
    expect(classifyInvoiceCompany("CNPJ: 11.222.333/0001-44")).toEqual({ company: "unknown", cnpj: "11.222.333/0001-44" });
  });
});
