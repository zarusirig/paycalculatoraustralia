import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function NewMinimumWageTakeHomePay() {
  return (
    <>
      <p className="lead">
        The national minimum wage is now <strong>$26.44 an hour</strong> — $1,004.90 for a
        38-hour week, or about $52,255 a year full-time. But gross pay isn&apos;t what lands in
        your account. Here&apos;s what a minimum-wage worker actually takes home after tax, at
        weekly, fortnightly and annual frequency.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Minimum wage (hourly)", after: "$26.44" },
          { label: "Minimum wage (weekly, 38 hrs)", after: "$1,004.90" },
          { label: "Minimum wage (annual, full-time)", after: "$52,254.80" },
          { label: "Weekly take-home (approx.)", after: "$869.90" },
          { label: "Casual rate (25% loading)", after: "$33.05/hr" },
        ]}
      />

      <h2>How the take-home figures were worked out</h2>
      <p>
        These numbers are calculated using the site&apos;s own FY2026-27 PAYG withholding engine —
        the same methodology the Australian Taxation Office uses in its Statement of Formulas
        (NAT 1004): annualising the pay period earnings, applying the FY2026-27 resident tax
        scale, the Low Income Tax Offset and the shaded Medicare levy, then dividing back to the
        pay period. The figures below assume a single Australian resident who claims the tax-free
        threshold and has no HECS-HELP or other study loan debt. You can see how the same
        withholding rates apply at other income levels on our{" "}
        <Link href="/weekly-tax-table/">weekly tax table</Link>.
      </p>

      <div className="overflow-x-auto not-prose my-8 rounded-xl border border-eucalyptus/30 bg-eucalyptus/5 p-1">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-navy/60">
              <th className="px-4 py-2 font-semibold">Pay frequency</th>
              <th className="px-4 py-2 font-semibold">Gross pay</th>
              <th className="px-4 py-2 font-semibold">Tax withheld</th>
              <th className="px-4 py-2 font-semibold">Take-home pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-eucalyptus/10 text-navy">
            <tr>
              <td className="px-4 py-2.5 font-medium">Weekly</td>
              <td className="px-4 py-2.5">$1,004.90</td>
              <td className="px-4 py-2.5">$135.00</td>
              <td className="px-4 py-2.5 font-semibold">$869.90</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">Fortnightly</td>
              <td className="px-4 py-2.5">$2,009.80</td>
              <td className="px-4 py-2.5">$270.00</td>
              <td className="px-4 py-2.5 font-semibold">$1,739.80</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">Annual</td>
              <td className="px-4 py-2.5">$52,254.80</td>
              <td className="px-4 py-2.5">$7,025.00</td>
              <td className="px-4 py-2.5 font-semibold">$45,229.80</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Why weekly tax isn&apos;t simply annual tax ÷ 52</h2>
      <p>
        Withholding is worked out by annualising each pay period first, so weekly and fortnightly
        withholding land on slightly different totals than a straight division of the annual tax
        figure once you account for rounding. On a $52,254.80 annual income, the Low Income Tax
        Offset trims about $216 off the tax bill and the Medicare levy is shaded rather than
        charged in full, because earnings sit close to the low-income threshold. Together these
        keep the effective tax rate on minimum-wage earnings well under 15%.
      </p>
      <p>
        The tax-free threshold does most of the heavy lifting here: the first $18,200 of annual
        income isn&apos;t taxed at all, and the 15% rate that applies from FY2026-27 covers most of
        the remaining minimum-wage earnings up to $45,000. Because a full-time minimum-wage income
        sits only just above that $45,000 mark, very little of it is taxed at the higher 30% rate,
        which is why the effective average tax rate on the whole $52,254.80 works out closer to
        13.4%.
      </p>

      <h2>Casuals and part-timers</h2>
      <p>
        Casual employees on the minimum wage receive a 25% casual loading on top of the base rate,
        taking their minimum hourly rate to $33.05 from 1 July 2026 — paid to compensate for
        missing out on paid leave. Part-time workers are simply paid $26.44 for each hour rostered;
        there&apos;s no separate part-time rate, so a 20-hour week comes to $528.80 gross. Use our{" "}
        <Link href="/weekly-pay-calculator/">weekly pay calculator</Link> to work out gross and
        net pay for your own hours.
      </p>
      <p>
        Because casual and part-time earnings are usually lower per pay period than a full-time
        wage, a larger share sits inside the tax-free threshold, so the average tax rate on those
        hours can be lower again than the full-time figures shown above. If your hours vary week
        to week, your employer withholds tax based on what you earn that period, not an assumed
        annual average — so a big week can see proportionally more withheld than a quiet one, even
        though it evens out at tax time.
      </p>

      <h2>What happens if you have a HECS-HELP debt</h2>
      <p>
        A full-time minimum-wage income of $52,254.80 a year sits below the $67,000 compulsory
        repayment threshold for HECS-HELP and other study and training support loans, so nobody on
        the minimum wage alone has a compulsory repayment withheld — the take-home figures above
        apply whether or not you carry a HECS-HELP debt. Repayments only kick in once your total
        repayment income, including any second job or other earnings, pushes you over that
        threshold.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you&apos;re paid the minimum wage, expect roughly $870 a week, $1,740 a fortnight or
        $45,230 a year after tax under the new rate, assuming you claim the tax-free threshold and
        carry no HECS debt. Your figures will differ if you have a study loan, salary sacrifice
        arrangements or additional income. Run your exact hours and pay cycle through our{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to get a precise
        after-tax number for your situation.
      </p>
    </>
  );
}
