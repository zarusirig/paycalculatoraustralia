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
        year&apos;s indexation was applied. Because the reduction came first, 2025 indexation was
        then recalculated on the smaller post-cut amount, compounding the benefit slightly.
      </p>
      <p>
        On the average $27,600 debt, the cut is worth roughly $5,520; a $40,000 balance dropped by
        $8,000, and a $15,000 balance by $3,000. More than three million Australians with study
        loans received a reduction. The measure passed alongside the repayment reforms that lifted
        the minimum threshold and introduced marginal rates, but the two operate independently —
        the cut changed what you owe, while the thresholds change how fast you repay it.
      </p>

      <h2>You didn&apos;t need to apply</h2>
      <p>
        The reduction was applied automatically by the ATO to every eligible account — there was
        no application form and nothing to opt into. Eligibility was determined entirely by
        whether your loan existed on 1 June 2025: debts fully repaid before that date missed out,
        and loans first drawn down after it were never in scope. Most reductions were processed
        before the end of 2025, with a small number of more complex accounts, such as those with
        recent transfers or multiple loan types, finalised into early 2026. The ATO has since
        confirmed processing is complete for all study and training support debts that existed on
        the qualifying date.
      </p>

      <h2>How to check it landed on your account</h2>
      <p>
        Log in to the ATO app or ATO online services through myGov and open &ldquo;Tax &gt; Study
        and training loans&rdquo; to view your balance and transaction history. The reduction
        shows as a credit transaction dated against your 1 June 2025 balance — look for it
        alongside that year&apos;s recalculated indexation entry and any compulsory repayments
        credited after your 2024-25 return was assessed. If you held more than one loan type, such
        as a HECS-HELP debt and a SA-HELP debt, the 20% applied across your combined study loan
        balances, so check each account listed. For a full breakdown of how your loan balance,
        indexation and repayments fit together, see our{" "}
        <Link href="/hecs-help-calculator/">HECS-HELP guide</Link>.
      </p>
      <p>
        If the balance looks wrong — the reduction is missing entirely, or the amount doesn&apos;t
        match 20% of what you owed on 1 June 2025 — check the transaction dates first, since
        repayments credited after that date change the balance without affecting the cut. If it
        still doesn&apos;t reconcile, contact the ATO through myGov or by phone with your loan
        account details handy.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        The 20% cut lowers your total loan balance, but it doesn&apos;t change your compulsory
        repayment rate or the STSL withheld from each payslip — those are set by your income under
        the FY2026-27 thresholds, not your outstanding debt. The real effect shows up at the end:
        a smaller balance means fewer years of withholding before the debt clears, and less
        indexation added each 1 June along the way. Use our{" "}
        <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> to see your current
        compulsory repayment against your reduced balance, and read our piece on{" "}
        <Link href="/news/hecs-marginal-repayment-first-tax-time/">
          your first tax return under the marginal system
        </Link>{" "}
        for what changes at assessment time.
      </p>
    </>
  );
}
