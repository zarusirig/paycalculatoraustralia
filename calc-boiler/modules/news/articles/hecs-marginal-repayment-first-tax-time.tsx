import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { HECS_HELP, HECS_HELP_2025_26, formatAUD, formatPercent } from "@/lib/constants/australian-tax";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";

// Tax time 2026 reconciles 2025-26 income, so this page uses the 2025-26 bands.
const THRESHOLD = HECS_HELP_2025_26.minimumThreshold;
const FIRST_RATE = HECS_HELP_2025_26.bands[1].marginalRate;
const EXAMPLE_INCOME = 80_000;
const EXAMPLE_EXCESS = EXAMPLE_INCOME - THRESHOLD;
const EXAMPLE_REPAYMENT = EXAMPLE_EXCESS * FIRST_RATE;

export default function HecsMarginalRepaymentFirstTaxTime() {
  return (
    <>
      <p className="lead">
        HECS debtors are lodging their first tax returns under the marginal repayment system,
        which began in 2025-26. These returns reconcile a full year of PAYG withholding against
        the 2025-26 bands, with <strong>{formatPercent(FIRST_RATE, 0)}</strong> charged only on
        income above <strong>{formatAUD(THRESHOLD)}</strong>. Before you lodge, check whether
        enough STSL was withheld across all your jobs.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Minimum threshold", after: `${formatAUD(THRESHOLD)} (2025-26)` },
          { label: "First marginal rate", after: `${formatPercent(FIRST_RATE, 0)} above threshold` },
          { label: "Withholding method", after: "STSL, per employer, per pay period" },
          { label: "Reconciled at", after: "Tax return assessment" },
        ]}
      />

      <h2>Why your notice of assessment matters this year</h2>
      <p>
        Your employer withholds STSL each pay period based on that job&apos;s income alone. At tax
        time, the ATO adds up your total repayment income across all employers and any investment
        income, applies the 2025-26 marginal bands, and works out your actual compulsory
        repayment. Any gap between what was withheld and what you actually owe shows up as a
        refund or a bill on your notice of assessment.
      </p>
      <p>
        The marginal system makes this reconciliation less brutal than it used to be. Under the
        old flat-rate rules, tipping just over the threshold made a percentage of your entire
        income repayable, so an under-withheld year could produce a four-figure surprise. Now the
        repayment rises gradually with income. As our coverage of the{" "}
        <Link href="/news/hecs-repayment-threshold-2026-27/">
          FY2026-27 threshold rise to $69,528
        </Link>{" "}
        shows, someone just over the threshold owes tens of dollars, not thousands.
      </p>

      <h2>How the repayment is actually worked out</h2>
      <p>
        Take a graduate on {formatAUD(EXAMPLE_INCOME)} in 2025-26 with no other income. Their
        repayment income exceeds the {formatAUD(THRESHOLD)} threshold by{" "}
        {formatAUD(EXAMPLE_EXCESS)}, and {Math.round(FIRST_RATE * 100)}c in the dollar on that
        excess comes to {formatAUD(EXAMPLE_REPAYMENT)} for the year. The notice of assessment sets
        that amount against the STSL their employer withheld. Employers moved to the marginal
        withholding tables for payments made from 24 September 2025, so pays before that date
        were withheld under the earlier tables, and any gap shows up as a refund or a bill.
        Repayment income is broader than salary.
        Reportable fringe benefits, reportable super contributions and net investment
        losses are all added back, which is a common reason assessments come in higher than the
        payslip maths suggests. Our <Link href="/hecs-help-calculator/">HECS-HELP guide</Link> walks
        through the full definition.
      </p>

      <h2>Two jobs, two separate calculations</h2>
      <p>
        If you held two jobs that each paid under {formatAUD(THRESHOLD)}, each employer worked out
        STSL on that job&apos;s pay alone, but your combined repayment income from both jobs can
        still exceed the threshold. Any shortfall shows up as a bill on your notice of
        assessment. Ticking the HELP
        debt box on every TFN declaration doesn&apos;t eliminate this, since withholding tables
        only ever look at income from that one job. If you keep working both jobs, you can ask
        one employer to withhold extra each pay, or set aside the shortfall yourself once you
        know its size.
      </p>

      <h2>What the 20% cut and indexation don&apos;t change here</h2>
      <p>
        The 20% debt reduction (taken off balances as they stood on{" "}
        {RETURN_2026.helpReductionDebtsAsAt}) and the{" "}
        {formatPercent(HECS_HELP.indexationRate, 1)} indexation applied on{" "}
        {HECS_HELP.indexationDate} both adjust your outstanding loan balance directly through the
        ATO. Neither appears as a line item on your
        tax return. Your compulsory repayment for the year is your repayment income run through
        the bands, applied against whatever balance remains after those adjustments. They matter
        at tax time in one case: if your remaining balance is smaller than your calculated
        repayment, you only repay what&apos;s left, and any excess withholding comes back as a
        refund.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your income moved during the year (a raise, a new job, or extra hours), check whether
        enough STSL was withheld before you lodge. Estimate your compulsory
        repayment with our <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>, then
        run your full return through our{" "}
        <Link href="/tax-return-calculator/">tax return calculator</Link> to see whether
        you&apos;re tracking toward a refund or a bill this year.
      </p>
    </>
  );
}
