import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function DeemingRatesChange2026() {
  return (
    <>
      <p className="lead">
        Centrelink deeming rates rose from <strong>20 March 2026</strong>, ending a multi-year
        freeze. The lower rate lifted to <strong>1.25%</strong> and the upper rate to{" "}
        <strong>3.25%</strong>, changing how much income Centrelink assumes your savings and
        investments earn for the pension income test.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Lower deeming rate", before: "0.25%", after: "1.25%" },
          { label: "Upper deeming rate", before: "2.25%", after: "3.25%" },
          { label: "Lower-rate threshold — single", after: "Up to $64,200" },
          { label: "Lower-rate threshold — couple (combined)", after: "Up to $106,200" },
          { label: "Effective from", after: "20 March 2026" },
        ]}
      />

      <h2>What changed and when</h2>
      <p>
        On the recommendation of the Australian Government Actuary, the lower deeming rate rose
        from 0.25% to 1.25% and the upper rate from 2.25% to 3.25%, effective 20 March 2026. The
        rates had been frozen at their pandemic-era levels since May 2020 to shield pensioners
        from record-low interest rates; the Actuary&apos;s review found current savings rates
        justify a partial reset, though the new rates remain well below long-term averages and
        below the returns available on many at-call savings accounts.
      </p>
      <p>
        The Actuary reviews deeming rates regularly against actual returns available on standard,
        low-risk investments such as term deposits and online savings accounts at major banks.
        Because rates on those accounts have risen since the 2020 freeze began, this adjustment
        brings deeming closer in line with what a cautious investor could realistically earn,
        while still sitting below the top rates advertised by banks for new deposits.
      </p>

      <h2>Deeming thresholds for singles and couples</h2>
      <p>
        The 1.25% lower rate applies to financial assets up to $64,200 for a single person, and up
        to $106,200 combined for a couple where at least one member receives a pension. Anything
        above those thresholds is deemed to earn income at the higher 3.25% rate, regardless of
        what the assets actually return. The thresholds themselves are reviewed alongside the{" "}
        <Link href="/news/age-pension-increase-march-2026/">Age Pension rate</Link> each March and
        September, so they can move even in years when the deeming percentages themselves stay
        unchanged.
      </p>

      <h2>What counts as a deemed financial asset</h2>
      <p>
        Deeming applies to bank accounts, term deposits, shares, managed investments and, for
        people who&apos;ve reached Age Pension age, most superannuation balances. Centrelink
        totals your financial assets, applies the lower rate up to the threshold and the higher
        rate above it, and counts that assumed income toward your pension income test — whether
        your actual returns are higher, lower, or negative in a given year. Your home and most
        personal assets like your car and household contents aren&apos;t financial assets for
        deeming purposes, though they can still count toward the separate assets test.
      </p>

      <h2>Why deeming rates matter for the pension income test</h2>
      <p>
        Because deemed income is fixed regardless of actual returns, a higher deeming rate can
        reduce a part-pensioner&apos;s payment even if their real investment income hasn&apos;t
        changed. Conversely, someone earning less than the deemed rate on a term deposit or
        savings account effectively gets counted as earning more than they actually receive, while
        someone earning above the deemed rate effectively keeps the difference without it
        affecting their pension. Check your own position with the{" "}
        <Link href="/centrelink-income-test/">Centrelink income test guide</Link>, which explains
        how the income and assets tests interact to determine your actual payment rate.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you&apos;re approaching retirement and weighing up how much to hold in super versus
        other savings, deeming rates are one factor in how Centrelink treats different assets.
        Someone with a large lump sum in a low-interest savings account, for instance, is deemed
        to earn the same income as someone whose money is invested in higher-yielding term
        deposits or shares — so the choice of where to hold your savings doesn&apos;t change your
        pension assessment, only your actual returns. Model your retirement balance with the{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link>, and use the{" "}
        <Link href="/centrelink-income-test/">Centrelink income test guide</Link> to see how the
        new thresholds interact with any part-time income you&apos;re still earning.
      </p>
    </>
  );
}
