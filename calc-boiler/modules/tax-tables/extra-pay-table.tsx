import { formatAUD } from "@/lib/constants";
import { FREQUENCY_LABELS, type PayFrequency } from "@/lib/constants/payg-withholding";
import type { ExtraPaySchedule } from "./ato-schedules";

interface ExtraPayTableProps {
  frequency: PayFrequency;
  schedule: ExtraPaySchedule;
}

/**
 * The ATO's optional additional-withholding table for financial years that
 * contain 53 weekly or 27 fortnightly pay days.
 *
 * These are published look-up values, not outputs of the Schedule 1 formula, so
 * they are transcribed in ato-schedules.ts with their ATO source URL rather than
 * computed.
 */
export default function ExtraPayTable({ frequency, schedule }: ExtraPayTableProps) {
  const periodLabel = FREQUENCY_LABELS[frequency];
  const periodTitle = periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1);

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-sm text-left text-navy">
        <caption className="sr-only">
          Additional amount to withhold from each pay in a {schedule.extraPayCount}-pay financial
          year, by {periodLabel}ly earnings, 2026-27
        </caption>
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th scope="col" className="px-4 py-4">
              {periodTitle}ly earnings ($)
            </th>
            <th scope="col" className="px-4 py-4">
              Additional withholding per {periodLabel} ($)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {schedule.bands.map((band) => (
            <tr key={band.from}>
              <td className="px-4 py-3 font-medium">
                {band.to === null
                  ? `${formatAUD(band.from)} and over`
                  : `${formatAUD(band.from)} to ${formatAUD(band.to)}`}
              </td>
              <td className="px-4 py-3 font-semibold text-eucalyptus-dark">
                {formatAUD(band.additional)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
