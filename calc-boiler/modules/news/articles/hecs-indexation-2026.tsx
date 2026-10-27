import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { HECS_HELP, formatAUD, formatPercent } from "@/lib/constants";

// Example balances for the indexation table; the rate is HECS_HELP.indexationRate.
const EXAMPLE_BALANCES = [20_000, 30_000, 50_000] as const;

export default function HecsIndexation2026() {
  return (
    <>
      <p className="lead">
        HECS and other HELP debts were indexed by <strong>2.8%</strong> on 1 June 2026, the
        lowest rate since 2021, after the government capped indexation at whichever is lower:
        the Consumer Price Index (CPI) or the Wage Price Index (WPI). This update shows what the
        rate added to typical balances, how the cap works and how voluntary repayments change the
        amount indexed.
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

      <h2>What 2.8% adds to a real balance</h2>
      <p>
        Indexation applies to whatever balance had remained unpaid for more than 11 months. At{" "}
        {formatPercent(HECS_HELP.indexationRate)}, indexation on {HECS_HELP.indexationDate} added these
        amounts:
      </p>
      <div className="overflow-x-auto not-prose my-8 rounded-xl border border-eucalyptus/30 bg-eucalyptus/5 p-1">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-navy/60">
              <th className="px-4 py-2 font-semibold">Balance indexed</th>
              <th className="px-4 py-2 font-semibold">Indexation added</th>
              <th className="px-4 py-2 font-semibold">New balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-eucalyptus/10 text-navy">
            {EXAMPLE_BALANCES.map((balance) => (
              <tr key={balance}>
                <td className="px-4 py-2.5 font-medium">{formatAUD(balance)}</td>
                <td className="px-4 py-2.5">{formatAUD(balance * HECS_HELP.indexationRate)}</td>
                <td className="px-4 py-2.5 font-semibold">{formatAUD(balance * (1 + HECS_HELP.indexationRate))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The ATO adds indexation to your study loan account automatically. Nothing changes on your
        payslip, and your employer is not notified.
      </p>
      <p>
        Because compulsory repayments made through the year sit as a credit with the ATO until
        your tax return is assessed, they do not reduce the balance that gets indexed on 1 June.
        Only voluntary repayments, paid directly to the ATO, reduce the balance mid-year.
      </p>

      <h2>Why 2.8% and not the headline CPI figure</h2>
      <p>
        Since 1 June 2023, HELP indexation has been capped at the lower of CPI or WPI, both
        measured over the 12 months to the March quarter. The cap was legislated after CPI-based
        indexation hit 7.1% in June 2023, when a $30,000 balance had more than $2,000
        added in a single day.
        Parliament later backdated the cap, retrospectively cutting that year&apos;s rate to 3.2%
        and crediting the difference back to affected accounts. In 2026, the wage measure came in
        lower than the price measure, so 2.8% was the rate applied on 1 June.
      </p>
      <p>
        Under the cap, the HELP indexation rate cannot be higher than growth in the Wage Price
        Index, so your student debt does not grow faster than wages. HECS carries no commercial
        interest, so indexation is the only way the balance rises. It now follows the slower of
        CPI and WPI rather than tracking inflation alone.
      </p>

      <h2>The 1 June deadline and voluntary repayment timing</h2>
      <p>
        If you made a voluntary repayment before 1 June, only the reduced balance was indexed. A
        payment made on or after 1 June does nothing for that year&apos;s indexation, since the
        calculation uses the balance as it stood that morning. A $5,000 voluntary payment on
        31 May saved $140 of indexation at the 2.8% rate; the same payment on 2 June saved
        nothing until 2027. Whether paying early is worthwhile at all is a separate question.
        With indexation at 2.8%, a savings account that earns more than that rate after tax
        returns more than early repayment saves. The maths only favours voluntary payments in
        high-indexation years or when the cash has no better use.
      </p>

      <h2>How this interacts with the 20% debt cut</h2>
      <p>
        The one-off 20% reduction applied to balances as at 1 June 2025 is a separate measure to
        annual indexation. If your balance was cut in 2025, the 2.8% applied on 1 June 2026 was
        calculated on your already-reduced balance, not the pre-cut figure. The cut therefore
        also shrinks every future year&apos;s indexation in dollar terms. See our explainer on{" "}
        <Link href="/news/hecs-20-percent-cut-status/">checking the 20% cut landed</Link> if
        you&apos;re not sure your account reflects it.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Indexation changes your total loan balance, not your compulsory repayment rate or your
        take-home pay directly. Your employer still withholds STSL based on your income under the
        FY2026-27 thresholds, not your outstanding debt. Indexation does change how long the debt
        takes to clear: a bigger balance means more years of repayments at the same withholding
        rate. To see how much of your pay currently goes toward compulsory HECS repayments, run
        your salary through our <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>,
        and compare early repayment against super contributions with our{" "}
        <Link href="/extra-super-vs-hecs-repayment/">extra super vs HECS repayment guide</Link>.
      </p>
    </>
  );
}
