import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE, formatPercent } from "@/lib/constants/australian-tax";
import { SBSCH_CLOSURE } from "@/lib/constants/payday-super";

const DAYS_NEW = SUPER_GUARANTEE_CHARGE.current.businessDaysNewEmployee;

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
          { label: "SBSCH availability", before: "Open", after: `Closed; last day for existing users ${SBSCH_CLOSURE.lastDayForExistingUsers}` },
          { label: "Super guarantee rate", after: "12% of qualifying earnings" },
          { label: "Takes effect", after: "1 July 2026" },
        ]}
      />

      <h2>What payday super actually changes</h2>
      <p>
        Under the old quarterly system, employers had until 28 days after the end of each quarter to
        pay super guarantee, so contributions could sit outside your fund for up to four months after
        you earned them. Payday super closes that gap. From 1 July 2026, super guarantee on qualifying
        earnings must be calculated and paid alongside each pay run, and must reach your super fund
        within 7 business days of payday. The deadline is {DAYS_NEW} business days for the first
        contribution for a new employee, and for the first contribution to a new fund after an
        existing employee changes funds. Employers must also work out and pay super on qualifying earnings
        paid from 1 July 2026 even where the work was performed before that date. The cut-over
        follows when you&apos;re paid, not when the shift or task happened. Payroll systems now need
        to calculate qualifying earnings, apply the 12% super guarantee rate and get each
        contribution to the fund within 7 business days of payday. That replaces batching
        contributions once every three months.
      </p>

      <h2>Why the Small Business Superannuation Clearing House closed</h2>
      <p>
        The ATO&apos;s free clearing house, SBSCH, closed to new users on{" "}
        {SBSCH_CLOSURE.closedToNewUsers}, and existing users could use it until{" "}
        {SBSCH_CLOSURE.lastDayForExistingUsers}. The ATO says it closed permanently from 1 July 2026
        as part of the Payday Super reform, and it can no longer be used to make payments or
        download records. The ATO told SBSCH users to download their employee payment records
        before 30 June 2026. Employers who used it can now pay super through their payroll
        software&apos;s super function, a product on the ATO&apos;s Super Product Register, a large
        super fund&apos;s online payment service or a commercial clearing house.
      </p>

      <h2>What happens if super is paid late</h2>
      <p>
        Missing the 7-business-day deadline triggers the redesigned super guarantee charge, made up of
        the shortfall, notional earnings at the general interest charge rate, an administrative
        uplift and, where choice rules were broken, a choice loading. The ATO can now see contribution timing far sooner through Single Touch Payroll
        and fund reporting, so late payments are expected to be identified and chased up faster than
        under the old quarterly system. Unlike the old quarterly charge, the new charge is tax-deductible,
        but the uplift and interest still make a late payment more expensive for an employer than
        paying the super guarantee correctly and on time in the first place.
      </p>

      <h2>How employees can check it&apos;s working</h2>
      <p>
        You can track whether contributions are landing on time through your super fund&apos;s app,
        member portal, or the ATO online services section of myGov. If super guarantee is still
        missing from your fund once the deadline has passed, raise it with your employer first. See our guide
        to <Link href="/understanding-your-payslip/">understanding your payslip</Link> for what your
        super line should show each pay cycle.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Payday super doesn&apos;t change your super guarantee rate. It stays at{" "}
        {formatPercent(SUPER_GUARANTEE.rate, 0)} of qualifying earnings for 2026-27. What changes is
        how quickly it reaches your account. Getting contributions
        in sooner and more often means slightly more time in the market for compounding growth over
        a working life. Run your numbers through our{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link> to see how
        consistent, on-time contributions add up, and employers can check their total on-cost with
        the <Link href="/employer-cost-calculator/">employer cost calculator</Link>.
      </p>
    </>
  );
}
