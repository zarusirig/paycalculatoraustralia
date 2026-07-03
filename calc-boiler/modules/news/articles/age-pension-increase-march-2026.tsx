import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function AgePensionIncreaseMarch2026() {
  return (
    <>
      <p className="lead">
        The Age Pension rose <strong>$22.20 a fortnight</strong> for singles from{" "}
        <strong>20 March 2026</strong>, taking the maximum rate to <strong>$1,200.90</strong>.
        Couples now receive $905.20 each, up $16.70. The Disability Support Pension and Carer
        Payment moved by the same amount.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Age Pension — single", before: "$1,178.70", after: "$1,200.90" },
          { label: "Age Pension — couple (each)", before: "$888.50", after: "$905.20" },
          { label: "Age Pension — couple (combined)", before: "$1,777.00", after: "$1,810.40" },
          { label: "Disability Support Pension", after: "Same rates as Age Pension" },
          { label: "Carer Payment", after: "Same rates as Age Pension" },
        ]}
      />

      <h2>The new pension rates</h2>
      <p>
        From 20 March 2026 to 19 September 2026, the maximum full Age Pension is $1,200.90 a
        fortnight for a single person and $905.20 each for a couple — $1,810.40 combined. Both
        figures include the pension and energy supplements. The rise applies automatically to
        existing recipients; there&apos;s nothing you need to do to receive the higher rate, and
        the new amount should appear in your first payment on or after 20 March 2026 without any
        need to update your details.
      </p>
      <p>
        For context, the single rate has now risen every March and September for several years
        running, tracking cost-of-living pressures and wages growth. Couples separated by illness
        — for example where one partner is in permanent residential care — are generally paid at
        the higher single rate rather than the couple rate, so it&apos;s worth checking which rate
        applies to your specific household circumstances.
      </p>

      <h2>Disability Support Pension and Carer Payment rise too</h2>
      <p>
        The Disability Support Pension and Carer Payment are paid at the same maximum rate as the
        Age Pension, so both increased to $1,200.90 a fortnight for singles and $905.20 each for
        couples on the same date. All three payments share the twice-yearly indexation cycle,
        which is separate from the family payments and student allowances indexed in{" "}
        <Link href="/news/centrelink-payment-increase-january-2026/">January</Link> and{" "}
        <Link href="/news/centrelink-changes-july-2026/">July</Link>. JobSeeker Payment and other
        allowance-type payments are also reviewed on the same 20 March and 20 September dates,
        though they&apos;re indexed to CPI alone rather than the wage-linked benchmark that applies
        to pensions, so their dollar increases are typically smaller.
      </p>

      <h2>Why the pension rises twice a year</h2>
      <p>
        Pension rates are indexed every 20 March and 20 September, using the higher of the
        Consumer Price Index or the Pensioner and Beneficiary Living Cost Index, then checked
        against a benchmark percentage of Male Total Average Weekly Earnings. That benchmark
        protects pensioner incomes from falling behind wages growth even in years when inflation
        is low. It&apos;s a deliberate design feature of the pension system: rather than pension
        rates being set once and left to erode with inflation, they&apos;re recalculated twice a
        year against whichever measure gives pensioners the better outcome.
      </p>

      <h2>Income and assets test thresholds also moved</h2>
      <p>
        The income and assets test cut-off points that determine how much pension you receive are
        indexed alongside the payment rate. Because the thresholds usually rise by a similar
        proportion, some part-pensioners may find they&apos;re now eligible for a slightly higher
        payment, or that they&apos;ve become eligible for the first time even if their income and
        assets haven&apos;t changed. The way Centrelink assesses savings and investments also
        changed on the same date — see how{" "}
        <Link href="/news/deeming-rates-change-2026/">deeming rates shifted</Link>, since a higher
        deeming rate can partly offset the benefit of a higher pension rate for part-pensioners
        with significant savings.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you&apos;re still working part-time alongside a pension, the higher payment rate and
        adjusted income test can change how much of your wages get taxed away under the taper. Use
        our <Link href="/centrelink-income-test/">Centrelink income test guide</Link> to check the
        current thresholds, and the{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link> if you&apos;re
        drawing down super alongside your pension and want to see how contributions or withdrawals
        affect your balance.
      </p>
    </>
  );
}
