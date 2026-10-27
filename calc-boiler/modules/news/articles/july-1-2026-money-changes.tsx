import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { EMPLOYMENT, HECS_HELP, formatAUD, formatPercent } from "@/lib/constants/australian-tax";
import { FTB_A, FTB_B } from "@/lib/constants/centrelink-family-payments";
import { DIVISION_296 } from "@/lib/constants/super-contributions";
import { RATE_SET_LABELS, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";

export default function July12026MoneyChanges() {
  return (
    <>
      <p className="lead">
        On 1 July 2026 Australian pay, super, tax, HECS and family payment rules all changed at
        once: the national minimum wage rose <strong>6%</strong> to{" "}
        {formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour, payday super began, the tax rate
        on the second income tax bracket dropped to <strong>15%</strong>, the HECS repayment
        threshold rose, and Family Tax Benefit was indexed. Each section below gives the new figure
        and links to the calculator or guide that checks your own numbers.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Minimum wage", before: "$24.95/hr", after: "$26.44/hr (+6%)" },
          { label: "Modern award rates", after: "+4.75%" },
          { label: "Payday super", after: "Super paid within 7 business days of payday" },
          { label: "Income tax (16% bracket)", before: "16%", after: "15%" },
          { label: "HECS repayment threshold", before: "$67,000", after: "$69,528" },
          { label: "Family Tax Benefit Part A (per child under 13)", after: `${formatAUD(FTB_A.maxFortnightly.age0to12, 2)}/fortnight` },
        ]}
      />

      <h2>Pay: minimum wage and award rates rise</h2>
      <p>
        The national minimum wage rose 6% to $26.44 an hour ($1,004.90 for a 38-hour week), while
        modern award minimum rates rose a separate 4.75%. The award rise reaches award-reliant
        workers, about 23% of employees according to the ABS (May 2025). The rise applies from the first full
        pay period on or after 1 July 2026. Read the full breakdown in{" "}
        <Link href="/news/minimum-wage-increase-july-2026/">minimum wage rise explained</Link>,
        then check your own pay with the{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
      </p>

      <h2>Super: payday super goes live</h2>
      <p>
        Employers must now pay super guarantee into your fund within 7 business days of each
        payday, instead of waiting until the end of the quarter. See{" "}
        <Link href="/news/payday-super-starts-july-2026/">payday super starts</Link> for what
        changed for employers and employees. The super guarantee rate itself stays at 12%, now
        calculated on qualifying earnings; use the{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link> to project your
        balance. Higher balances are also affected: from {DIVISION_296.start}, Division 296 tax
        adds an extra {formatPercent(DIVISION_296.rate, 0)} on earnings from the part of a balance
        above {formatAUD(DIVISION_296.largeBalanceThreshold / 1_000_000)} million, and a further{" "}
        {formatPercent(DIVISION_296.additionalRate, 0)} on the part above{" "}
        {formatAUD(DIVISION_296.veryLargeBalanceThreshold / 1_000_000)} million.
      </p>

      <h2>Tax: the 16% rate drops to 15%</h2>
      <p>
        The tax rate on income between $18,201 and $45,000 fell from 16% to 15%, worth up to $268
        a year, applied automatically through PAYG withholding. The full detail is in{" "}
        <Link href="/news/tax-cut-july-2026/">tax cut from 1 July 2026</Link>; check your exact
        saving with the <Link href="/income-tax-calculator/">income tax calculator</Link>. The
        $1,000 instant work-related deduction also starts applying from this date, though it&apos;s
        first claimed on the return lodged from July 2027. See the{" "}
        <Link href="/news/1000-dollar-instant-tax-deduction/">
          $1,000 instant deduction explainer
        </Link>{" "}
        for the detail.
      </p>

      <h2>HECS: repayment threshold and indexation both moved</h2>
      <p>
        The compulsory repayment threshold for 2026-27 rose to $69,528, and HECS balances were
        indexed {formatPercent(HECS_HELP.indexationRate)} back on 1 June. Under the marginal repayment system, you now pay 15c for
        every dollar of repayment income above that threshold in the first band, rather than a flat percentage of
        your total income. See{" "}
        <Link href="/news/hecs-repayment-threshold-2026-27/">
          HECS threshold rises to $69,528
        </Link>{" "}
        for the full repayment bands, and run your own numbers through the{" "}
        <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>.
      </p>

      <h2>Centrelink: family payments indexed</h2>
      <p>
        Family Tax Benefit rose from 1 July 2026 under the family assistance indexation cycle,
        which runs on the financial year rather than the calendar dates used for pensions. Part A
        rose to {formatAUD(FTB_A.maxFortnightly.age0to12, 2)} a fortnight per child under 13, and the Part B primary earner income limit
        lifted to {formatAUD(FTB_B.primaryEarnerLimit)}. Pension-type payments like Age Pension, JobSeeker and Carer Payment
        instead index every 20 March and 20 September. The Age Pension&apos;s latest rise was on{" "}
        {RATE_SET_LABELS[SEPTEMBER_2026]}. See{" "}
        <Link href="/news/centrelink-changes-july-2026/">Centrelink changes from July 2026</Link>{" "}
        for the updated family payment rates and thresholds, and use the{" "}
        <Link href="/centrelink-income-test/">Centrelink income test guide</Link> to check how
        your earnings affect your payment.
      </p>

      <h2>Putting it all together</h2>
      <p>
        Each 1 July 2026 change reaches a different group: a pay rise if you&apos;re on the
        minimum wage or an award, a small tax cut if your income is above the tax-free threshold, faster
        super contributions, a higher HECS threshold if you have a study loan, and adjusted
        Centrelink rates if you receive a payment. Most flow through automatically via payroll,
        your super fund or Services Australia. Check that your own payslip and notice of
        assessment reflect the new rates.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        The pay rises, the tax rate cut, payday super and Family Tax Benefit indexation apply
        automatically through payroll, your super fund or Centrelink, so you do not apply for them.
        To check your own numbers, run
        your salary through the{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> for your new
        after-tax pay, or the{" "}
        <Link href="/income-tax-calculator/">income tax calculator</Link> to see the tax cut,
        HECS repayment and Medicare levy together under FY2026-27 settings.
      </p>
    </>
  );
}
