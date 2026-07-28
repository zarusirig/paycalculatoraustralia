import { formatAUD } from "@/lib/constants";
import {
  calculatePAYGWithholding,
  FREQUENCY_LABELS,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";
import type { ForeignResidentBand } from "./ato-schedules";

interface ForeignResidentTableProps {
  frequency: PayFrequency;
  amounts: readonly number[];
  /** The ATO's own printed rate bands for this pay cycle. */
  bands: readonly ForeignResidentBand[];
  caption: string;
}

/**
 * Foreign-resident (ATO Scale 3) withholding. No tax-free threshold and no
 * Medicare levy, so withholding starts at 30c in the dollar from the first
 * dollar earned.
 *
 * Every amount is computed from SCALE_3_FOREIGN in the shared PAYG engine at
 * render time — nothing here is transcribed from a printed table.
 */
export default function ForeignResidentTable({
  frequency,
  amounts,
  bands,
  caption,
}: ForeignResidentTableProps) {
  const periodLabel = FREQUENCY_LABELS[frequency];
  const periodTitle = periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1);

  const rows = amounts.map((gross) => {
    const base = calculatePAYGWithholding(gross, frequency, { foreignResident: true });
    const withStsl = calculatePAYGWithholding(gross, frequency, {
      foreignResident: true,
      hasSTSL: true,
    });
    return {
      gross,
      withheld: base.totalWithheld,
      withheldWithStsl: withStsl.totalWithheld,
      net: base.netPerPeriod,
    };
  });

  return (
    <div className="not-prose my-6">
      <div className="mb-4 overflow-x-auto rounded-xl border border-sandstone-dark/20">
        <table className="w-full text-sm text-left text-navy">
          <caption className="sr-only">
            ATO foreign resident withholding rate bands, {periodLabel}ly earnings, 2026-27
          </caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-4 py-3">
                {periodTitle}ly earnings ($)
              </th>
              <th scope="col" className="px-4 py-3">
                {periodTitle}ly rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {bands.map((band) => (
              <tr key={band.earnings}>
                <td className="px-4 py-3 font-medium">{band.earnings}</td>
                <td className="px-4 py-3">{band.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-4 py-4">
                {periodTitle}ly Gross
              </th>
              <th scope="col" className="px-4 py-4">
                Withheld (Foreign Resident)
              </th>
              <th scope="col" className="px-4 py-4">
                Withheld (Foreign Resident + STSL)
              </th>
              <th scope="col" className="px-4 py-4">
                Take-Home
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((row) => (
              <tr key={row.gross}>
                <td className="px-4 py-3 font-medium">{formatAUD(row.gross)}</td>
                <td className="px-4 py-3">{formatAUD(row.withheld)}</td>
                <td className="px-4 py-3">{formatAUD(row.withheldWithStsl)}</td>
                <td className="px-4 py-3 font-semibold text-eucalyptus-dark">
                  {formatAUD(row.net)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
