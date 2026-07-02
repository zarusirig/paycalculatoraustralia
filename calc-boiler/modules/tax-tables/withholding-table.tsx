import { formatAUD } from "@/lib/constants";
import {
  buildWithholdingRows,
  FREQUENCY_LABELS,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";

interface WithholdingTableProps {
  frequency: PayFrequency;
  amounts: readonly number[];
  caption: string;
}

/**
 * Crawlable static withholding table. Every figure is computed from the shared
 * PAYG engine at render time, so the table can never drift from the widget.
 */
export default function WithholdingTable({ frequency, amounts, caption }: WithholdingTableProps) {
  const rows = buildWithholdingRows(frequency, amounts);
  const periodLabel = FREQUENCY_LABELS[frequency];
  const periodTitle = periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1);

  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-4 py-4">{periodTitle}ly Gross</th>
              <th scope="col" className="px-4 py-4">Withheld (Tax-Free Threshold)</th>
              <th scope="col" className="px-4 py-4">Withheld (TFT + STSL)</th>
              <th scope="col" className="px-4 py-4">Withheld (No TFT)</th>
              <th scope="col" className="px-4 py-4">Take-Home (TFT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((row) => (
              <tr key={row.gross}>
                <td className="px-4 py-3 font-medium">{formatAUD(row.gross)}</td>
                <td className="px-4 py-3">{formatAUD(row.withTFT)}</td>
                <td className="px-4 py-3">{formatAUD(row.withTFTAndSTSL)}</td>
                <td className="px-4 py-3">{formatAUD(row.noTFT)}</td>
                <td className="px-4 py-3 font-semibold text-eucalyptus-dark">{formatAUD(row.netWithTFT)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
