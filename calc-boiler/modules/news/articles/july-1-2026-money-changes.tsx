import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function July12026MoneyChanges() {
  return (
    <>
      <p className="lead">
        1 July 2026 brought the biggest single-day reshuffle of Australian pay, tax and benefits
        in years: the minimum wage jumped <strong>6%</strong>, payday super began, the tax rate
        dropped to <strong>15%</strong>, HECS thresholds rose, and Centrelink payments were
        indexed. Here&apos;s every change in one place.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Minimum wage", before: "$24.95/hr", after: "$26.44/hr (+6%)" },
          { label: "Modern award rates", after: "+4.75%" },
          { label: "Payday super", after: "Super paid within 7 business days of payday" },
          { label: "Income tax (16% bracket)", before: "16%", after: "15%" },
          { label: "HECS repayment threshold", before: "$67,000", after: "$69,528" },
        ]}
      />

      <h2>Pay: minimum wage and award rates rise</h2>
      <p>
        The national minimum wage rose 6% to $26.44 an hour — $1,004.90 for a 38-hour week — while
        modern award minimum rates rose a separate 4.75%, reaching about 2.8 million
        award-reliant workers, roughly 21% of the workforce. The rise applies from the first full
        pay period on or after 1 July 2026. Read the full breakdown in{" "}
        <Link href="/news/minimum-wage-increase-july-2026/">minimum wage rise explained</Link>,
        then check your own pay with the{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
      </p>

      <h2>Super: payday super goes live</h2>
      <p>
        Employers must now pay super guarantee into your fund within 7 business days of each
        payday, instead of waiting until the end of the quarter — see{" "}
        <Link href="/news/payday-super-starts-july-2026/">payday super starts</Link> for what
        changed for employers and employees. The super guarantee rate itself stays at 12% of
        ordinary time earnings; use the{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link> to project your
        balance. Higher balances are also affected: Division 296 tax, an extra 15% on earnings
        from balances above $3 million, applies from the same date.
      </p>

      <h2>Tax: the 16% rate drops to 15%</h2>
      <p>
        The tax rate on income between $18,201 and $45,000 fell from 16% to 15%, worth up to $268
        a year, applied automatically through PAYG withholding. Full detail in{" "}
        <Link href="/news/tax-cut-july-2026/">tax cut from 1 July 2026</Link>; check your exact
        saving with the <Link href="/income-tax-calculator/">income tax calculator</Link>. The
        $1,000 instant work-related deduction also starts applying from this date, though it&apos;s
        first claimed on the return lodged from July 2027 — see the{" "}
        <Link href="/news/1000-dollar-instant-tax-deduction/">
          $1,000 instant deduction explainer
        </Link>{" "}
        for the detail.
      </p>

      <h2>HECS: repayment threshold and indexation both moved</h2>
      <p>
        The compulsory repayment threshold for 2026-27 rose to $69,528, and HECS balances were
        indexed 2.8% back on 1 June. Under the marginal repayment system, you now pay 15c for
        every dollar of repayment income above that threshold, rather than a flat percentage of
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
        rose to $235.48 a fortnight per child under 13, and the Part B primary earner income limit
        lifted to $124,327. Pension-type payments like Age Pension, JobSeeker and Carer Payment
        instead index every 20 March and 20 September — the Age Pension&apos;s last rise was 20 March
        2026. See{" "}
        <Link href="/news/centrelink-changes-july-2026/">Centrelink changes from July 2026</Link>{" "}
        for the updated family payment rates and thresholds, and use the{" "}
        <Link href="/centrelink-income-test/">Centrelink income test guide</Link> to check how
        your earnings affect your payment.
      </p>

      <h2>Putting it all together</h2>
      <p>
        No single change on 1 July 2026 is dramatic on its own, but stacked together they touch
        almost every working Australian: a pay rise if you&apos;re on the minimum wage or an award, a
        small tax cut whatever you earn, faster super contributions, a higher HECS threshold if
        you have a study loan, and adjusted Centrelink rates if you receive a payment. Most flow
        through automatically via payroll, your super fund or Services Australia — the main thing
        worth doing is checking your own payslip and notice of assessment reflect the new rates.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Most of these changes apply automatically — through payroll, your super fund, or Centrelink
        — so there&apos;s usually nothing to apply for. The exception is checking your own numbers: run
        your salary through the{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> for your new
        after-tax pay, or the{" "}
        <Link href="/income-tax-calculator/">income tax calculator</Link> to see the tax cut,
        HECS repayment and Medicare levy together under FY2026-27 settings.
      </p>
    </>
  );
}
