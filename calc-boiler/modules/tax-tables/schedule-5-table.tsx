import { formatAUD, formatPercent } from "@/lib/constants";
import {
  calculateSchedule5MethodB,
  FREQUENCY_LABELS,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";

interface Schedule5TableProps {
  /** Regular gross pay per period the ready reckoner is built on. */
  regularGross: number;
  frequency: PayFrequency;
  amounts: readonly number[];
  caption: string;
}

/**
 * Schedule 5 ready reckoner: withholding on an additional payment (bonus,
 * commission or back payment) at a fixed regular wage.
 *
 * Every figure comes from calculateSchedule5MethodB in the shared PAYG engine,
 * which implements the ATO's apportion-difference-multiply arithmetic on top of
 * the Schedule 1 coefficient tables.
 */
export default function Schedule5Table({
  regularGross,
  frequency,
  amounts,
  caption,
}: Schedule5TableProps) {
  const periodLabel = FREQUENCY_LABELS[frequency];
  const rows = amounts.map((additional) => {
    const result = calculateSchedule5MethodB(regularGross, additional, frequency);
    return { additional, result };
  });

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-sm text-left text-navy">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th scope="col" className="px-4 py-4">
              Bonus / back payment
            </th>
            <th scope="col" className="px-4 py-4">
              Apportioned per {periodLabel}
            </th>
            <th scope="col" className="px-4 py-4">
              Tax withheld
            </th>
            <th scope="col" className="px-4 py-4">
              Effective rate
            </th>
            <th scope="col" className="px-4 py-4">
              In your pocket
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {rows.map(({ additional, result }) => (
            <tr key={additional}>
              <td className="px-4 py-3 font-medium">{formatAUD(additional)}</td>
              <td className="px-4 py-3">{formatAUD(result.apportionedAmount)}</td>
              <td className="px-4 py-3">{formatAUD(result.withheldFromAdditionalPayment)}</td>
              <td className="px-4 py-3">{formatPercent(result.effectiveRate)}</td>
              <td className="px-4 py-3 font-semibold text-eucalyptus-dark">
                {formatAUD(result.netAdditionalPayment)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
