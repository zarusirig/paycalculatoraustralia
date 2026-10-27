import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { SITE_CONFIG } from "@/lib/constants";
import {
  EMPLOYMENT,
  HECS_HELP,
  MEDICARE_LEVY,
  TAX_BRACKETS,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
} from "@/lib/constants/australian-tax";
import { calculatePAYGWithholding } from "@/lib/constants/payg-withholding";

// Every figure below comes from the site's FY2026-27 tax and withholding engines.
const WEEKLY_GROSS = EMPLOYMENT.minimumWageWeekly;
const ANNUAL_GROSS = WEEKLY_GROSS * EMPLOYMENT.weeksPerYear;
const WEEKLY = calculatePAYGWithholding(WEEKLY_GROSS, "weekly");
const FORTNIGHTLY = calculatePAYGWithholding(WEEKLY_GROSS * 2, "fortnightly");
const ANNUAL_TAX = Math.round(
  calculateIncomeTax(ANNUAL_GROSS) - calculateLITO(ANNUAL_GROSS) + calculateMedicareLevy(ANNUAL_GROSS)
);
const ANNUAL_NET = ANNUAL_GROSS - ANNUAL_TAX;
const WEEKLY_WITHHELD_FOR_YEAR = WEEKLY.paygWithheld * EMPLOYMENT.weeksPerYear;
const BRACKET_30 = TAX_BRACKETS[2];
const SLICE_AT_30 = ANNUAL_GROSS - (BRACKET_30.min - 1);

export default function NewMinimumWageTakeHomePay() {
  return (
    <>
      <p className="lead">
        The national minimum wage is now <strong>$26.44 an hour</strong>: $1,004.90 for a
        38-hour week, or about $52,255 a year full-time, before tax. The tables below show a
        full-time minimum-wage worker&apos;s weekly, fortnightly and annual take-home pay after tax.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Minimum wage (hourly)", after: "$26.44" },
          { label: "Minimum wage (weekly, 38 hrs)", after: "$1,004.90" },
          { label: "Minimum wage (annual, full-time)", after: "$52,254.80" },
          { label: "Weekly take-home (approx.)", after: formatAUD(WEEKLY.netPerPeriod, 2) },
          { label: "Casual rate (25% loading)", after: "$33.05/hr" },
        ]}
      />

      <h2>How the take-home figures were worked out</h2>
      <p>
        The weekly and fortnightly figures on this page come from our FY2026-27 PAYG withholding
        engine, which follows the Australian Taxation Office&apos;s Statement of Formulas (NAT
        1004). It converts each pay to a weekly amount and applies the ATO&apos;s formula for a
        payee who claims the tax-free threshold. The annual figure is the tax for the full year:
        the FY2026-27 resident tax scale, less the Low Income Tax Offset, plus the Medicare levy. The figures below assume a single Australian resident who claims the tax-free
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
              <td className="px-4 py-2.5">{formatAUD(WEEKLY.totalWithheld, 2)}</td>
              <td className="px-4 py-2.5 font-semibold">{formatAUD(WEEKLY.netPerPeriod, 2)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">Fortnightly</td>
              <td className="px-4 py-2.5">$2,009.80</td>
              <td className="px-4 py-2.5">{formatAUD(FORTNIGHTLY.totalWithheld, 2)}</td>
              <td className="px-4 py-2.5 font-semibold">{formatAUD(FORTNIGHTLY.netPerPeriod, 2)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">Annual</td>
              <td className="px-4 py-2.5">$52,254.80</td>
              <td className="px-4 py-2.5">{formatAUD(ANNUAL_TAX, 2)}</td>
              <td className="px-4 py-2.5 font-semibold">{formatAUD(ANNUAL_NET, 2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Why weekly tax isn&apos;t simply annual tax ÷ 52</h2>
      <p>
        Withholding uses the ATO&apos;s formulas, which work on each pay and round to the dollar,
        so they do not land exactly on the annual tax. A full year of weekly withholding comes to{" "}
        {formatAUD(WEEKLY_WITHHELD_FOR_YEAR)}, which is{" "}
        {formatAUD(WEEKLY_WITHHELD_FOR_YEAR - ANNUAL_TAX)} more than the annual tax of{" "}
        {formatAUD(ANNUAL_TAX)}. You get the difference back when you lodge your tax return. The ATO publishes the exact amounts, and you can
        look them up in our{" "}
        <Link href="/payg-withholding-tables/">weekly tax table {SITE_CONFIG.financialYear}</Link> and{" "}
        <Link href="/fortnightly-tax-table/">fortnightly tax table</Link>. On a $52,254.80 annual income, the Low Income Tax
        Offset trims about {formatAUD(calculateLITO(ANNUAL_GROSS))} off the tax bill. The Medicare
        levy applies in full at {formatPercent(MEDICARE_LEVY.rate, 0)}, because this income is well above the low-income range where
        the levy is reduced. Together these keep the effective tax rate on minimum-wage earnings
        under 15%.
      </p>
      <p>
        Under the tax-free threshold, the first $18,200 of annual income isn&apos;t taxed at all,
        and the 15% rate that applies from FY2026-27 covers most of
        the remaining minimum-wage earnings up to $45,000. A full-time minimum-wage income sits{" "}
        {formatAUD(SLICE_AT_30, 2)} above that mark, and that slice is taxed at the higher{" "}
        {formatPercent(BRACKET_30.rate, 0)} rate, adding about{" "}
        {formatAUD(SLICE_AT_30 * BRACKET_30.rate)} of tax. After the offset and the Medicare levy,
        the effective average tax rate on the whole {formatAUD(ANNUAL_GROSS, 2)} works out to about{" "}
        {formatPercent(ANNUAL_TAX / ANNUAL_GROSS, 1)}.
      </p>

      <h2>Casuals and part-timers</h2>
      <p>
        Casual employees on the national minimum wage receive a 25% casual loading on top of the
        base rate, taking their minimum hourly rate to $33.05 from 1 July 2026, as compensation
        for missing out on paid leave. Many casuals are also covered by a modern award whose{" "}
        <Link href="/award-rates/">award pay rates</Link> sit above the national minimum. Part-time workers on the national minimum wage are paid $26.44 for each hour rostered;
        there&apos;s no separate part-time rate, so a 20-hour week comes to $528.80 gross. Use our{" "}
        <Link href="/weekly-pay-calculator/">weekly pay calculator</Link> to work out gross and
        net pay for your own hours.
      </p>
      <p>
        Casual and part-time earnings are usually lower per pay period than a full-time wage, so a
        larger share sits inside the tax-free threshold. The average tax rate on those hours can
        be lower again than the full-time figures shown above. If your hours vary week to week,
        your employer withholds tax based on what you earn that period, not an assumed annual
        average. A big week can see proportionally more withheld than a quiet one, and the
        difference evens out at tax time.
      </p>

      <h2>What happens if you have a HECS-HELP debt</h2>
      <p>
        A full-time minimum-wage income of $52,254.80 a year sits below the $69,528 compulsory
        repayment threshold for 2026-27 for HECS-HELP and other study and training support loans.
        Nobody earning only the minimum wage has a compulsory repayment withheld, so the take-home
        figures above apply whether or not you carry a HECS-HELP debt. Repayments only kick in once your total
        repayment income, including any second job or other earnings, pushes you over that
        threshold.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you&apos;re paid the full-time national minimum wage, expect about{" "}
        {formatAUD(WEEKLY.netPerPeriod)} a week or {formatAUD(FORTNIGHTLY.netPerPeriod)} a
        fortnight after withholding, and {formatAUD(ANNUAL_NET)} a year after tax under the new
        rate, assuming you claim the tax-free threshold. Your figures will differ if you have
        salary sacrifice arrangements or additional income, and a study loan adds a repayment only
        once your total repayment income passes {formatAUD(HECS_HELP.minimumThreshold)}. Run your exact hours and pay cycle through our{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to get a precise
        after-tax number for your situation.
      </p>
    </>
  );
}
