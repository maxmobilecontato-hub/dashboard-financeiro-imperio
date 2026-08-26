import { describe, expect, it } from "vitest";
import { calculateProfit, getBillStatus, isValidXlsxFile } from "./financeRules";

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
});

  it("reads receivables when the amount header is missing", async () => {
    const { parseReceivablesRows } = await import("./financeRules");
    const rows = [
      ["CÓDIGO", "DATA DO PROCESSAMENTO", "NOME", "DATA", "", "DIAS"],
      [1, "05/08/2026", "BIG BEN AGRO LTDA", "31/08/2026", 760, "=IF(F9=\"\",\"\",D9-TODAY())"],
      [2, "06/08/2026", "ANCORE", "31/08/2026", 21300, "=IF(F10=\"\",\"\",D10-TODAY())"],
    ];
    const parsed = parseReceivablesRows(rows);
    expect(parsed).toHaveLength(2);
    expect(parsed.map((item) => item.amount)).toEqual([760, 21300]);
    expect(parsed[0]?.name).toBe("BIG BEN AGRO LTDA");
  });
