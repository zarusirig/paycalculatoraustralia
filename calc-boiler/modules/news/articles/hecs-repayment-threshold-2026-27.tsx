import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function HecsRepaymentThreshold202627() {
  return (
    <>
      <p className="lead">
        The minimum HECS and HELP repayment threshold for FY2026-27 is{" "}
        <strong>$69,528</strong>, up from $67,000 in FY2025-26. Below that, you make no
        compulsory repayment; above it, the marginal system applies 15c in the dollar rising to
        10% at the top band.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Minimum threshold", before: "$67,000", after: "$69,528" },
          { label: "15% band", after: "$69,529 – $129,717" },
          { label: "17% band", after: "$129,718 – $186,050 ($9,028 + 17c/$)" },
          { label: "Flat rate band", after: "10% above $186,050" },
        ]}
      />

      <h2>The threshold, band by band</h2>
      <p>
        Once your repayment income exceeds $69,528, you pay 15c for every dollar above that
        figure, up to $129,717. From $129,718 to $186,050, the repayment is $9,028 plus 17c per
        dollar over $129,717. Above $186,050, you pay a flat 10% of your total repayment income.
        Repayment income includes your taxable income, reportable fringe benefits, reportable
        super contributions and net investment losses — not just your salary.
      </p>

      <h2>Why $69,528, not $69,529</h2>
      <p>
        It&apos;s a common point of confusion: $69,528 is the exempt threshold — earn up to and
        including that amount and you owe nothing. The first dollar taxed at 15% is $69,529, the
        start of the next band. Our{" "}
        <Link href="/stsl-on-payslip/">STSL on your payslip guide</Link> uses the same figures to
        explain when withholding starts appearing on your pay.
      </p>

      <h2>How it compares to the old flat-rate system</h2>
      <p>
        Before the marginal system launched in FY2025-26, crossing the threshold meant a
        percentage of your <em>entire</em> income became repayable — a sharp cliff that could turn
        a small pay rise into a large tax bill. Under the current marginal bands, only the income
        above $69,528 is taxed at the relevant rate, so someone on $70,000 owes a small amount on
        the $472 sliver above the threshold rather than a lump-sum percentage of their whole salary.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your income sits near $69,528, small changes — a bonus, overtime, or a pay rise — can
        push you just over the threshold and trigger a modest compulsory repayment for the first
        time. Run your salary through our{" "}
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
