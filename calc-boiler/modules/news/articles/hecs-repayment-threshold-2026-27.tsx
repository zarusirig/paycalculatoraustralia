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
        Every band boundary moved up with indexation from the FY2025-26 launch-year figures of
        $67,000, $125,000 and $179,285 — the structure is identical, only the dollar points shift
        each year.
      </p>
      <p>
        Note that &ldquo;repayment income&rdquo; is broader than salary: it includes your taxable
        income plus reportable fringe benefits, reportable super contributions and net investment
        losses. Salary sacrificing into super, for instance, lowers your taxable income but is
        added straight back for HECS purposes, so it cannot be used to duck under the threshold.
      </p>

      <h2>Why $69,528, not $69,529</h2>
      <p>
        It&apos;s a common point of confusion: $69,528 is the exempt threshold — earn up to and
        including that amount and you owe nothing. The first dollar taxed at 15% is $69,529, the
        start of the next band. Both figures describe the same boundary, but the ATO&apos;s
        schedule names $69,528 as the threshold, which is why you&apos;ll see it quoted on
        withholding tables and in our{" "}
        <Link href="/stsl-on-payslip/">STSL on your payslip guide</Link>, which uses the same
        figures to explain when withholding starts appearing on your pay.
      </p>

      <h2>Worked examples at real salaries</h2>
      <p>
        On $70,000 of repayment income, only the $472 above the threshold is assessed — 15c in
        the dollar comes to about $71 for the whole year. On $80,000, the excess is $10,472 and
        the repayment is roughly $1,571. On $100,000, it&apos;s 15% of $30,472, about $4,571. A
        $150,000 earner crosses into the second band: $9,028 plus 17% of the $20,283 above
        $129,717, around $12,476. And someone on $200,000 sits in the flat zone, paying 10% of
        total repayment income — $20,000. The repayment amounts rise smoothly with income; there
        is no point where earning one more dollar costs you more than a dollar.
      </p>

      <h2>How it compares to the old flat-rate system</h2>
      <p>
        Before the marginal system launched in FY2025-26, crossing the threshold meant a
        percentage of your <em>entire</em> income became repayable — a sharp cliff that could turn
        a small pay rise into a repayment bill of over a thousand dollars. Under the current
        marginal bands, only the income above $69,528 is assessed at the relevant rate, so the
        $70,000 earner above owes $71 rather than a lump-sum percentage of their whole salary.
        The higher threshold compounds that relief: an income that triggered repayments in
        FY2024-25, when the threshold was $54,435, may now sit entirely inside the exempt zone.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your income sits near $69,528, small changes — a bonus, overtime, or a pay rise — can
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
