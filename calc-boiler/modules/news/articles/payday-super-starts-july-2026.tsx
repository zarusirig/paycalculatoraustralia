import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function PaydaySuperStartsJuly2026() {
  return (
    <>
      <p className="lead">
        From <strong>1 July 2026</strong>, employers must pay super guarantee contributions into
        your fund with every payday, not once a quarter. The money must land within{" "}
        <strong>7 business days</strong> of payday, and the old Small Business Superannuation
        Clearing House has closed for good.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Super guarantee due", before: "Quarterly", after: "Every payday" },
          { label: "Payment deadline", after: "Within 7 business days of payday" },
          { label: "SBSCH availability", before: "Open", after: "Closed permanently from 30 June 2026" },
          { label: "Super guarantee rate", after: "12% of ordinary time earnings" },
          { label: "Takes effect", after: "1 July 2026" },
        ]}
      />

      <h2>What payday super actually changes</h2>
      <p>
        Until now, employers had until 28 days after the end of each quarter to pay super guarantee
        — meaning contributions could sit outside your fund for up to four months after you earned
        them. Payday super closes that gap. From 1 July 2026, super guarantee on qualifying earnings
        must be calculated and paid alongside each pay run, and must reach your super fund within 7
        business days of payday, with a longer window for some new employees while their fund
        details are confirmed. Employers must also work out and pay super on qualifying earnings
        paid from 1 July 2026 even where the underlying work was performed before that date, so the
        cut-over applies to when you're paid rather than when the shift or task happened. Payroll
        systems now need to calculate ordinary time earnings, apply the 12% super guarantee rate,
        and initiate the payment on the same day wages are processed, which is a substantial change
        from batching contributions once every three months.
      </p>

      <h2>Why the Small Business Superannuation Clearing House closed</h2>
      <p>
        The ATO&apos;s free clearing house, SBSCH, closed permanently on 30 June 2026 because it
        couldn&apos;t process contributions fast enough to meet the new 7-business-day deadline.
        Employers who relied on it needed to move to a commercial clearing house or their payroll
        software&apos;s default fund service before payday super began, so their existing employees&apos;
        contributions weren&apos;t disrupted. The NSW Small Business Commissioner and other advisory
        bodies urged small employers to download their SBSCH payment records well before the closure
        date, since access to historical data disappeared along with the service on 1 July 2026.
        Most major payroll platforms rolled out a built-in clearing house or a direct integration
        with commercial providers in the lead-up to the change, so the switch for most businesses
        was a configuration update rather than a full system replacement.
      </p>

      <h2>What happens if super is paid late</h2>
      <p>
        Missing the 7-business-day deadline triggers the redesigned super guarantee charge, which is
        no longer tax-deductible and includes the shortfall amount, interest, and administrative
        penalties. The ATO can now see contribution timing far sooner through Single Touch Payroll
        and fund reporting, so late payments are expected to be identified and chased up faster than
        under the old quarterly system. Because the charge is no longer deductible, a late payment
        under payday super can end up more expensive for an employer than simply paying the super
        guarantee correctly and on time in the first place, which is part of the compliance incentive
        behind the redesign.
      </p>

      <h2>How employees can check it's working</h2>
      <p>
        You can track whether contributions are landing on time through your super fund&apos;s app,
        member portal, or the ATO online services section of myGov. If you notice super guarantee is
        missing a few business days after payday, raise it with your employer first — see our guide
        to <Link href="/understanding-your-payslip/">understanding your payslip</Link> for what your
        super line should show each pay cycle.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Payday super doesn&apos;t change your super guarantee rate — it stays at 12% of ordinary
        time earnings for 2026-27 — only how quickly it reaches your account. Getting contributions
        in sooner and more often means slightly more time in the market for compounding growth over
        a working life. Run your numbers through our{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link> to see how
        consistent, on-time contributions add up, and employers can check their total on-cost with
        the <Link href="/employer-cost-calculator/">employer cost calculator</Link>.
      </p>
    </>
  );
}
