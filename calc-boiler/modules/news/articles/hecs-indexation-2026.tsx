import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function HecsIndexation2026() {
  return (
    <>
      <p className="lead">
        HECS and other HELP debts were indexed by <strong>2.8%</strong> on 1 June 2026 — the
        lowest rate since 2021 — after the government capped indexation at whichever is lower:
        the Consumer Price Index (CPI) or the Wage Price Index (WPI). Here&apos;s what it added
        to a typical balance and how the cap works.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "2026 indexation rate", after: "2.8%" },
          { label: "Indexation applied", after: "1 June 2026" },
          { label: "Indexation cap", after: "Lower of CPI or WPI (to March quarter)" },
          { label: "Extra on a $30,000 balance", after: "≈ $840" },
          { label: "2023 spike (for comparison)", before: "7.1%", after: "Capped, backdated to 3.2%" },
        ]}
      />

      <h2>Why 2.8% and not the headline CPI figure</h2>
      <p>
        Since 1 June 2023, HELP indexation has been capped at the lower of CPI or WPI, both
        measured over the 12 months to the March quarter. The cap was legislated after CPI-based
        indexation hit 7.1% in June 2023, adding thousands of dollars to balances overnight — that
        year&apos;s rate was later backdated down to 3.2%. In 2026, WPI came in lower than CPI, so
        2.8% was the rate applied on 1 June.
      </p>

      <h2>What 2.8% adds to a real balance</h2>
      <p>
        Indexation applies to whatever balance had remained unpaid for more than 11 months. A
        graduate with a $30,000 debt saw roughly $840 added on 1 June 2026; someone with $50,000
        owing picked up around $1,400. If you made a voluntary repayment before 1 June, only the
        reduced balance was indexed — a payment made on or after 1 June does nothing for that
        year&apos;s indexation, since it&apos;s calculated on the balance as it stood that morning.
      </p>

      <h2>How this interacts with the 20% debt cut</h2>
      <p>
        The one-off 20% reduction applied to balances as at 1 June 2025 is a separate measure to
        annual indexation. If your balance was cut in 2025, the 2.8% applied on 1 June 2026 was
        calculated on your already-reduced balance, not the pre-cut figure. See our explainer on{" "}
        <Link href="/news/hecs-20-percent-cut-status/">checking the 20% cut landed</Link> if
        you&apos;re not sure your account reflects it.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Indexation changes your total loan balance, not your compulsory repayment rate or your
        take-home pay directly — your employer still withholds STSL based on your income, not
        your outstanding debt. To see how much of your pay currently goes toward compulsory HECS
        repayments under the FY2026-27 thresholds, run your salary through our{" "}
        <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>, and compare early
        repayment against super contributions with our{" "}
        <Link href="/extra-super-vs-hecs-repayment/">extra super vs HECS repayment guide</Link>.
      </p>
    </>
  );
}
