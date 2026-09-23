"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { formatAUD } from "@/lib/constants";
import {
  buildTaxTableRows,
  taxTableCsv,
  CSV_TABLE_RANGES,
  FREQUENCY_LABELS,
  HTML_TABLE_RANGES,
  PAYG_FINANCIAL_YEARS,
  PAYG_YEAR_INFO,
  type PayFrequency,
  type PaygFinancialYear,
} from "@/lib/constants/payg-withholding";

interface FullTaxTableProps {
  frequency: PayFrequency;
  caption: string;
}

const toggleBase =
  "px-3 py-1.5 text-sm font-semibold rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-eucalyptus/40";
const toggleOn = "bg-eucalyptus-dark text-white border-eucalyptus-dark";
const toggleOff = "bg-white text-navy border-sandstone-dark/30 hover:border-eucalyptus/50";

/**
 * The full tax table as crawlable HTML, in fixed earnings steps, with both
 * ATO threshold columns. The server render is the current financial year; the
 * toggle swaps in the previous year's coefficients. "Download CSV" builds a
 * whole-dollar version in the browser — nothing is fetched.
 */
export default function FullTaxTable({ frequency, caption }: FullTaxTableProps) {
  const [fy, setFy] = useState<PaygFinancialYear>(PAYG_FINANCIAL_YEARS[0]);
  const rows = useMemo(() => buildTaxTableRows(frequency, fy, HTML_TABLE_RANGES[frequency]), [frequency, fy]);
  const showStsl = PAYG_YEAR_INFO[fy].stslSupported;
  const period = FREQUENCY_LABELS[frequency];
  const periodTitle = `${period.charAt(0).toUpperCase()}${period.slice(1)}ly`;
  const range = HTML_TABLE_RANGES[frequency];
  const csvRange = CSV_TABLE_RANGES[frequency];

  function downloadCsv() {
    const csvRows = buildTaxTableRows(frequency, fy, csvRange);
    const blob = new Blob([taxTableCsv(frequency, fy, csvRows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${period}ly-tax-table-${fy}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="not-prose my-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Financial year">
          {PAYG_FINANCIAL_YEARS.map((y) => (
            <button key={y} type="button" aria-pressed={fy === y} onClick={() => setFy(y)} className={`${toggleBase} ${fy === y ? toggleOn : toggleOff}`}>
              {y}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md border border-eucalyptus-dark text-eucalyptus-dark bg-white hover:bg-eucalyptus-light/40"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download CSV ({fy}, every ${csvRange.step === 1 ? "1" : csvRange.step} to {formatAUD(csvRange.to)})
        </button>
      </div>
      <p className="text-xs text-warmgray mb-2">
        {fy}: applies to {PAYG_YEAR_INFO[fy].appliesTo}. Rows every {formatAUD(range.step)} from {formatAUD(range.from)} to{" "}
        {formatAUD(range.to)}; use the lookup above for an exact amount.
      </p>
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-navy">
          <caption className="sr-only">{`${caption} (${fy})`}</caption>
          <thead className="bg-sandstone font-semibold text-navy sticky top-0">
            <tr>
              <th scope="col" className="px-3 py-3">{periodTitle} earnings</th>
              <th scope="col" className="px-3 py-3">With tax-free threshold</th>
              <th scope="col" className="px-3 py-3">No tax-free threshold</th>
              {showStsl && <th scope="col" className="px-3 py-3">Threshold + study loan</th>}
              <th scope="col" className="px-3 py-3">Take-home (threshold)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((row) => (
              <tr key={row.gross}>
                <th scope="row" className="px-3 py-2 font-medium">{formatAUD(row.gross)}</th>
                <td className="px-3 py-2">{formatAUD(row.withTFT)}</td>
                <td className="px-3 py-2">{formatAUD(row.noTFT)}</td>
                {showStsl && <td className="px-3 py-2">{formatAUD(row.withTFTAndSTSL ?? 0)}</td>}
                <td className="px-3 py-2 font-semibold text-eucalyptus-dark">{formatAUD(row.gross - row.withTFT)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
