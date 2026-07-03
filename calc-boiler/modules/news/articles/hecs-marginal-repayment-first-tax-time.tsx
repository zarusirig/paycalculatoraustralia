import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function HecsMarginalRepaymentFirstTaxTime() {
  return (
    <>
      <p className="lead">
        Millions of HECS debtors are lodging tax returns that reconcile a full year of PAYG
        withholding against the FY2026-27 marginal repayment bands for the first time, with{" "}
        <strong>15%</strong> charged only on income above <strong>$69,528</strong>. Here&apos;s
        what to check before you lodge.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Minimum threshold", after: "$69,528" },
          { label: "First marginal rate", after: "15% above threshold" },
          { label: "Withholding method", after: "STSL, per employer, per pay period" },
          { label: "Reconciled at", after: "Tax return assessment" },
        ]}
      />

      <h2>Why your notice of assessment matters this year</h2>
      <p>
        Your employer withholds STSL each pay period based on that job&apos;s income alone. At tax
        time, the ATO adds up your total repayment income across all employers and any investment
        income, applies the FY2026-27 marginal bands, and works out your actual compulsory
        repayment. Any gap between what was withheld and what you actually owe shows up as a
        refund or a bill on your notice of assessment.
      </p>

      <h2>Two jobs, two separate calculations</h2>
      <p>
        If you held two jobs that each paid under $69,528, neither employer would have withheld
        any STSL — but your combined repayment income from both jobs can still exceed the
        threshold. That produces an unexpected compulsory repayment at tax time. Ticking the HELP
        debt box on every TFN declaration doesn&apos;t eliminate this, since withholding tables
        only ever look at income from that one job.
      </p>

      <h2>What the 20% cut and indexation don&apos;t change here</h2>
      <p>
        The 20% debt reduction and the 2.8% indexation applied on 1 June 2026 both adjust your
        outstanding loan balance directly through the ATO — neither appears as a line item on your
        tax return. Your compulsory repayment for the year is simply your repayment income run
        through the bands, applied against whatever balance remains after those adjustments.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your income moved during the year — a raise, a new job, or extra hours — it&apos;s worth
        checking whether enough STSL was withheld before you lodge. Estimate your compulsory
        repayment with our <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>, then
        run your full return through our{" "}
        <Link href="/tax-return-calculator/">tax return calculator</Link> to see whether you&apos;re
        tracking toward a refund or a bill this year.
      </p>
    </>
  );
}
