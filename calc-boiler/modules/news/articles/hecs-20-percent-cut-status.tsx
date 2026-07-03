import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function Hecs20PercentCutStatus() {
  return (
    <>
      <p className="lead">
        The ATO has finished applying the one-off <strong>20% reduction</strong> to every HELP and
        other student loan balance that existed on 1 June 2025, wiping about{" "}
        <strong>$5,520</strong> off the average $27,600 debt. If you haven&apos;t checked your
        account, here&apos;s exactly what to look for.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Debt reduction", after: "20% one-off cut" },
          { label: "Balance date used", after: "1 June 2025" },
          { label: "Average debt", after: "$27,600" },
          { label: "Average cut", after: "≈ $5,520" },
          { label: "Legislation", after: "Passed 2 August 2025" },
          { label: "Processing status", after: "Complete as of 2026" },
        ]}
      />

      <h2>What the 20% cut actually did</h2>
      <p>
        The Universities Accord (Cutting Student Debt by 20 Per Cent) Act 2025 became law on 2
        August 2025, reducing every outstanding HELP, VET Student Loan and other study loan
        balance by 20%, calculated against the balance as it stood on 1 June 2025 — before that
        year&apos;s indexation was applied. On the average $27,600 debt, that&apos;s roughly $5,520
        wiped off, with larger debts seeing a proportionally larger dollar reduction.
      </p>

      <h2>You didn&apos;t need to apply</h2>
      <p>
        The reduction was applied automatically by the ATO to every eligible account — there was
        no application form and nothing to opt into. Most reductions were processed before the end
        of 2025, with a small number of more complex accounts, such as those with recent transfers
        or multiple loan types, finalised into early 2026.
      </p>

      <h2>How to check it landed on your account</h2>
      <p>
        Log in to the ATO app or ATO online services through myGov and open &ldquo;Tax &gt; Study
        and training loans&rdquo; to view your balance and transaction history. The reduction shows
        as a credit transaction dated against your 1 June 2025 balance. For a full breakdown of how
        your loan balance and repayments now work together, see our{" "}
        <Link href="/hecs-help-guide/">HECS-HELP guide</Link>.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        The 20% cut lowers your total loan balance, but it doesn&apos;t change your compulsory
        repayment rate or the STSL withheld from each payslip — those are set by your income under
        the FY2026-27 thresholds, not your outstanding debt. Use our{" "}
        <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> to see your current
        compulsory repayment, and check our piece on{" "}
        <Link href="/news/hecs-marginal-repayment-first-tax-time/">
          your first tax return under the marginal system
        </Link>{" "}
        for what changes at assessment time.
      </p>
    </>
  );
}
