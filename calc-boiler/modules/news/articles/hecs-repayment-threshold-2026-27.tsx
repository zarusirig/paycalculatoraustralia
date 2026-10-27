import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { HECS_HELP, HECS_HELP_2025_26, calculateHECS, formatAUD, formatPercent } from "@/lib/constants";

// Every figure below comes from HECS_HELP (FY2026-27) and HECS_HELP_2025_26.
const THRESHOLD = HECS_HELP.minimumThreshold;
const [, BAND_1, BAND_2, TOP] = HECS_HELP.bands;
const PREV = HECS_HELP_2025_26;
const cents = (rate: number) => `${Math.round(rate * 100)}c`;
const pct = (rate: number) => formatPercent(rate, 0);

/** Repayment incomes used in the worked examples. */
const EXAMPLE_INCOMES = [70_000, 80_000, 100_000, 150_000, 200_000] as const;

function bandFor(income: number) {
  return HECS_HELP.bands.find((b) => income >= b.min && income <= b.max) ?? TOP;
}

/** The part of income the band's rate applies to: the excess over the band floor, or all of it in the top band. */
function assessed(income: number): number {
  const band = bandFor(income);
  return band === TOP ? income : income - (band.min - 1);
}

export default function HecsRepaymentThreshold202627() {
  return (
    <>
      <p className="lead">
        The minimum HECS and HELP repayment threshold for FY2026-27 is{" "}
        <strong>{formatAUD(THRESHOLD)}</strong>, up from {formatAUD(HECS_HELP.previousThreshold)} in FY2025-26. Below that, you make no
        compulsory repayment. Above it, you repay {cents(BAND_1.marginalRate)} for each dollar over the threshold, and the
        top band switches to {pct(TOP.marginalRate)} of your total repayment income.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Minimum threshold", before: formatAUD(HECS_HELP.previousThreshold), after: formatAUD(THRESHOLD) },
          { label: `${pct(BAND_1.marginalRate)} band`, after: `${formatAUD(BAND_1.min)} to ${formatAUD(BAND_1.max)}` },
          {
            label: `${pct(BAND_2.marginalRate)} band`,
            after: `${formatAUD(BAND_2.min)} to ${formatAUD(BAND_2.max)} (${formatAUD(BAND_2.base)} + ${cents(BAND_2.marginalRate)}/$)`,
          },
          { label: "Flat rate band", after: `${pct(TOP.marginalRate)} above ${formatAUD(BAND_2.max)}` },
        ]}
      />

      <h2>The threshold, band by band</h2>
      <p>
        Once your repayment income exceeds {formatAUD(THRESHOLD)}, you pay {cents(BAND_1.marginalRate)} for every dollar above that
        figure, up to {formatAUD(BAND_1.max)}. From {formatAUD(BAND_2.min)} to {formatAUD(BAND_2.max)}, the repayment is{" "}
        {formatAUD(BAND_2.base)} plus {cents(BAND_2.marginalRate)} per dollar over {formatAUD(BAND_1.max)}. Above{" "}
        {formatAUD(BAND_2.max)}, you pay a flat {pct(TOP.marginalRate)} of your total repayment income.
        Every band boundary moved up with indexation from the FY2025-26 launch-year figures of{" "}
        {formatAUD(PREV.minimumThreshold)}, {formatAUD(PREV.bands[1].max)} and {formatAUD(PREV.bands[2].max)}. The structure is identical, only the dollar points shift
        each year.
      </p>
      <p>
        Your HECS repayment income is broader than your salary: it includes your taxable
        income plus reportable fringe benefits, reportable super contributions and net investment
        losses. Salary sacrificing into super, for instance, lowers your taxable income but is
        added straight back for HECS purposes, so it cannot be used to duck under the threshold.
      </p>

      <h2>Worked examples at real salaries</h2>
      <p>The compulsory repayment for the year at five repayment incomes:</p>
      <div className="overflow-x-auto not-prose my-8 rounded-xl border border-eucalyptus/30 bg-eucalyptus/5 p-1">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-navy/60">
              <th className="px-4 py-2 font-semibold">Repayment income</th>
              <th className="px-4 py-2 font-semibold">Income assessed</th>
              <th className="px-4 py-2 font-semibold">Band</th>
              <th className="px-4 py-2 font-semibold">Repayment for the year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-eucalyptus/10 text-navy">
            {EXAMPLE_INCOMES.map((income) => (
              <tr key={income}>
                <td className="px-4 py-2.5 font-medium">{formatAUD(income)}</td>
                <td className="px-4 py-2.5">{formatAUD(assessed(income))}</td>
                <td className="px-4 py-2.5">{bandFor(income).label}</td>
                <td className="px-4 py-2.5 font-semibold">{formatAUD(calculateHECS(income))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The repayment amounts rise smoothly with income; there
        is no point where earning one more dollar costs you more than a dollar.
      </p>

      <h2>Why {formatAUD(THRESHOLD)}, not {formatAUD(BAND_1.min)}</h2>
      <p>
        {formatAUD(THRESHOLD)} is the exempt threshold: earn up to and including that amount and you owe
        nothing. The first dollar assessed at {pct(BAND_1.marginalRate)} is {formatAUD(BAND_1.min)}, the
        start of the next band. Both figures describe the same boundary, but the ATO&apos;s
        schedule names {formatAUD(THRESHOLD)} as the threshold, which is why you&apos;ll see it quoted on
        withholding tables and in our{" "}
        <Link href="/stsl-on-payslip/">STSL on your payslip guide</Link>, which uses the same
        figures to explain when withholding starts appearing on your pay.
      </p>

      <h2>How it compares to the old flat-rate system</h2>
      <p>
        Before the marginal system launched in FY2025-26, crossing the threshold meant a
        percentage of your <em>entire</em> income became repayable, a sharp cliff that could turn
        a small pay rise into a repayment bill of over a thousand dollars. Under the current
        marginal bands, only the income above {formatAUD(THRESHOLD)} is assessed at the relevant rate, so the
        {" "}{formatAUD(EXAMPLE_INCOMES[0])} earner above owes {formatAUD(calculateHECS(EXAMPLE_INCOMES[0]))} rather than a lump-sum percentage of their whole salary.
        The higher threshold compounds that relief: an income that triggered repayments in
        FY2024-25, when the threshold was $54,435, now sits entirely inside the exempt zone if it
        is no higher than the new threshold.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your income sits near {formatAUD(THRESHOLD)}, small changes (a bonus, overtime, or a pay rise) can
        push you just over the threshold and trigger a modest compulsory repayment for the first
        time. Because the system is marginal, that first repayment will be small, but your
        employer will begin withholding STSL once your per-pay earnings cross the pro-rated
        threshold for your pay cycle. Run your salary through our{" "}
        <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> to see your exact
        FY2026-27 repayment, and read what changes at tax time in{" "}
        <Link href="/news/hecs-marginal-repayment-first-tax-time/">
          your first return under the new system
        </Link>
        .
      </p>
    </>
  );
}
