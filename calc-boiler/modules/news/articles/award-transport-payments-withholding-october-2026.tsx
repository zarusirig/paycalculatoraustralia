import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { formatAUD } from "@/lib/constants";
import { withholdingForPeriod } from "@/lib/constants/payg-withholding";
import {
  AWARD_TRANSPORT_CHANGE_DATE,
  CPK_KM_CAP,
  CURRENT_CPK_RATE,
  CURRENT_CPK_YEAR,
} from "@/lib/constants/cents-per-km";

// The ATO's own worked example uses a $22-a-week "fares and travel patterns" allowance.
const ALLOWANCE = 22;
const WAGES = [500, 1_300, 3_500];

export default function AwardTransportPaymentsWithholdingOctober2026() {
  const rows = WAGES.map((wage) => {
    const before = withholdingForPeriod(wage, "weekly");
    const after = withholdingForPeriod(wage + ALLOWANCE, "weekly");
    return { wage, before, after, extra: after - before };
  });
  const mid = rows[1];

  return (
    <>
      <p className="lead">
        From <strong>{AWARD_TRANSPORT_CHANGE_DATE}</strong>, employers must withhold tax from award transport
        payments — travel and fares allowances under long-standing industrial instruments that, until now, have been
        paid with no tax withheld. On a {formatAUD(ALLOWANCE)}-a-week fares allowance, a worker earning{" "}
        {formatAUD(mid.wage)} a week will have about <strong>{formatAUD(mid.extra)} more tax taken out</strong> each
        week.
      </p>

      <NewsKeyFacts
        title="Award transport payments from 1 October 2026"
        rows={[
          { label: "PAYG withholding on the payment", before: "Varied to nil", after: "Withheld like other pay" },
          { label: "Single Touch Payroll", before: "Reported as award transport payment (type AD)", after: "Reported under the allowance's normal category" },
          { label: "Applies to amounts paid", after: `On or after ${AWARD_TRANSPORT_CHANGE_DATE}` },
          { label: "Cents per km car allowance at the ATO rate", after: `Unchanged — ${Math.round(CURRENT_CPK_RATE * 100)}c/km up to ${CPK_KM_CAP.toLocaleString("en-AU")} km in ${CURRENT_CPK_YEAR}` },
        ]}
      />

      <h2>What changed and why</h2>
      <p>
        Award transport payments had their own rules in tax law, so the ATO varied withholding on them to nil and
        required employers to report them separately in Single Touch Payroll. The Treasury Laws Amendment (Tax
        Reform No. 1) Act 2026 received royal assent on 26 June 2026 and repeals those provisions. The ATO&apos;s
        guidance, published on 26 August 2026, says that for amounts previously treated as award transport payments
        and paid on or after {AWARD_TRANSPORT_CHANGE_DATE}, employers must withhold from them and no longer identify
        them separately in STP. The payments still have to be reported, under whichever allowance category fits.
      </p>
      <p>
        Employers can switch their STP reporting with either a cutover method (new amounts go to the new category
        from the first payday on or after 1 October) or a zeroing-out method (an update event moves the year-to-date
        amount across, available until 31 December 2026). Either way, reporting of award transport payments as type AD
        has to stop during 2026-27.
      </p>

      <h2>What it means for your pay</h2>
      <p>
        The allowance is added to the pay your employer withholds from, so your net pay drops slightly. Using the
        FY2026-27 weekly tax table (tax-free threshold claimed), a {formatAUD(ALLOWANCE)} weekly allowance on top of:
      </p>
      <div className="overflow-x-auto not-prose my-6 rounded-xl border border-sandstone-dark/20">
        <table className="min-w-full text-sm text-navy">
          <thead className="bg-sandstone text-left">
            <tr>
              <th className="px-4 py-2 font-semibold">Weekly wage</th>
              <th className="px-4 py-2 font-semibold">Tax withheld before</th>
              <th className="px-4 py-2 font-semibold">From 1 October</th>
              <th className="px-4 py-2 font-semibold">Extra withheld a week</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((r) => (
              <tr key={r.wage}>
                <td className="px-4 py-2">{formatAUD(r.wage)}</td>
                <td className="px-4 py-2">{formatAUD(r.before)}</td>
                <td className="px-4 py-2">{formatAUD(r.after)}</td>
                <td className="px-4 py-2">{formatAUD(r.extra)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Withholding is a prepayment, not the final bill: what you actually owe on the allowance is worked out in your
        tax return. What changes is that the tax is collected through the year instead of at tax time.
      </p>
      <p>
        This does not change cents-per-kilometre car allowances paid at or below the ATO rate for deductible work
        travel, which remain free of withholding for the first {CPK_KM_CAP.toLocaleString("en-AU")} km. Our{" "}
        <Link href="/cents-per-km/">cents per km guide</Link> covers those, the{" "}
        <Link href="/travel-allowance/">travel allowance guide</Link> covers overnight travel, and you can check
        your new net pay with the <Link href="/tax-withheld-calculator/">tax withheld calculator</Link> or read the
        allowance lines on your payslip with our <Link href="/understanding-your-payslip/">payslip guide</Link>.
      </p>
    </>
  );
}
