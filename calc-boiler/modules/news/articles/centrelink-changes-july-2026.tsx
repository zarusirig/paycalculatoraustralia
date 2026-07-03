import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function CentrelinkChangesJuly2026() {
  return (
    <>
      <p className="lead">
        Family Tax Benefit rates and income limits rose from <strong>1 July 2026</strong> under
        the standard annual indexation cycle for family payments. Part A climbed to{" "}
        <strong>$235.48</strong> a fortnight per child under 13, and the Part B primary earner
        income limit lifted to <strong>$124,327</strong>.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "FTB Part A — per child under 13", after: "$235.48/fortnight" },
          { label: "FTB Part A — per child 13–15", after: "$306.46/fortnight" },
          { label: "FTB Part B — youngest under 5", after: "$200.34/fortnight" },
          { label: "FTB Part B — youngest 5 and over", after: "$139.86/fortnight" },
          { label: "FTB Part B primary earner limit", after: "$124,327" },
        ]}
      />

      <h2>Family Tax Benefit rates from 1 July</h2>
      <p>
        Family Tax Benefit Part A&apos;s maximum rate rose to $235.48 a fortnight for each child
        under 13 and $306.46 for each child aged 13 to 15, up a few dollars on last year&apos;s
        rates. Family Tax Benefit Part B, paid to single parents and single-income couple
        families, rose to $200.34 a fortnight where the youngest child is under 5, and $139.86
        where the youngest is 5 or older. Both parts index every 1 July, in line with the
        financial year, so families see the new rate in their first payment of the new financial
        year rather than partway through it.
      </p>
      <p>
        The exact amount a family receives depends on the number and ages of children, whether
        they&apos;re on the maximum rate or a part rate under the income test, and any
        supplementary payments like the FTB Part A supplement, paid after the end of the financial
        year once your tax return confirms your actual family income.
      </p>

      <h2>Income limits moved too</h2>
      <p>
        Alongside the rate rises, the Family Tax Benefit Part B primary earner income limit lifted
        to $124,327 for 2026-27 — families where the primary earner earns more than that aren&apos;t
        eligible for Part B at all. Family Tax Benefit Part A&apos;s income-free areas and taper
        thresholds were indexed on the same date, which can lift the payment for some families
        already receiving a part rate, and may bring some higher-income families back into
        eligibility for at least a small payment.
      </p>

      <h2>Why family payments index in July, not March</h2>
      <p>
        Family Tax Benefit and related family assistance payments run on the financial year, so
        they&apos;re indexed each 1 July. That&apos;s a different cycle to pension-type payments
        like the{" "}
        <Link href="/news/age-pension-increase-march-2026/">Age Pension</Link>, JobSeeker and
        Carer Payment, which index every 20 March and 20 September, and to student payments like
        Youth Allowance and Austudy, which index each{" "}
        <Link href="/news/centrelink-payment-increase-january-2026/">1 January</Link>. Running
        three separate indexation cycles across the year means Centrelink payment rates are
        essentially always being reviewed for some category of recipient, even though any single
        payment only moves once or twice a year.
      </p>

      <h2>Do you need to do anything</h2>
      <p>
        Existing Family Tax Benefit recipients get the higher rate automatically from their first
        payment after 1 July 2026 — there&apos;s no need to reapply. If your family income has
        dropped below the new, higher Part B limit and you weren&apos;t previously eligible, or
        you have a new baby or changed care arrangements, you&apos;ll need to lodge or update a
        claim through myGov to start receiving the payment. It&apos;s also worth confirming your
        family income estimate for the new financial year is accurate, since an outdated estimate
        can lead to an overpayment that Centrelink claws back at tax time.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Family Tax Benefit sits alongside your take-home pay rather than through it, but a change
        in household income can shift how much you&apos;re entitled to. If you&apos;re weighing up
        extra shifts, a pay rise, or returning to work after parental leave, use our{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to see your new
        after-tax income, and the{" "}
        <Link href="/parental-leave-pay/">Parental Leave Pay guide</Link> if you&apos;re also
        weighing government-funded leave against family payments.
      </p>
    </>
  );
}
