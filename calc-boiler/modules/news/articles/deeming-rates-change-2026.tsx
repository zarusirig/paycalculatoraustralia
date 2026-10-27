import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { formatAUD, formatPercent } from "@/lib/constants";
import { DEEMING, DEEMING_HISTORY } from "@/lib/constants/centrelink-means-test";

const pct = (n: number) => formatPercent(n, 2);

function deemingRow(from: string) {
  const row = DEEMING_HISTORY.find((r) => r.from === from);
  if (!row) throw new Error(`No deeming history row from ${from}`);
  return row;
}

export default function DeemingRatesChange2026() {
  const frozen = deemingRow("1 May 2020");
  const before = deemingRow("20 September 2025");
  const march = deemingRow("20 March 2026");
  return (
    <>
      <p className="lead">
        Centrelink deeming rates rose from <strong>20 March 2026</strong>, the second step in the
        gradual reset that followed the end of the deeming freeze on 30 June 2025. The lower rate
        lifted to <strong>{pct(march.lower)}</strong> and the upper rate to{" "}
        <strong>{pct(march.upper)}</strong>, changing how much income Centrelink assumes your savings and
        investments earn for the pension income test.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Lower deeming rate", before: pct(before.lower), after: pct(march.lower) },
          { label: "Upper deeming rate", before: pct(before.upper), after: pct(march.upper) },
          { label: "Lower-rate threshold, single", after: `Up to ${formatAUD(march.single)}` },
          { label: "Lower-rate threshold, couple (combined)", after: `Up to ${formatAUD(march.pensionerCouple)}` },
          { label: "Effective from", after: "20 March 2026" },
        ]}
      />

      <h2>What changed and when</h2>
      <p>
        On the recommendation of the Australian Government Actuary, the Minister for Social
        Services set the lower deeming rate at {pct(march.lower)} (up from {pct(before.lower)}) and
        the upper rate at {pct(march.upper)} (up from {pct(before.upper)}), effective 20 March 2026.
        The rates were frozen at {pct(frozen.lower)} and {pct(frozen.upper)} from 1 May 2020 to
        30 June 2025, and the first step up came on 20 September 2025. The Actuary says the new
        rates reflect investment returns available to most payment recipients and support the
        government&apos;s plan to reset deeming rates gradually.
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
        From 20 March 2026, the {pct(march.lower)} lower rate applied to financial assets up to{" "}
        {formatAUD(march.single)} for a single person, and up to {formatAUD(march.pensionerCouple)}{" "}
        combined for a couple where at least one member receives a pension. Anything above those
        thresholds is deemed to earn income at the higher {pct(march.upper)} rate, regardless of
        what the assets actually return. The thresholds are not reviewed with the{" "}
        <Link href="/news/age-pension-increase-march-2026/">Age Pension rate</Link> each March and
        September: they are indexed each 1 July. On {DEEMING.thresholdsFrom} they rose to{" "}
        {formatAUD(DEEMING.thresholds.single)} (single) and{" "}
        {formatAUD(DEEMING.thresholds.pensionerCouple)} (couple, combined), and from{" "}
        {DEEMING.ratesFrom} the rates rose again to {pct(DEEMING.lowerRate)} and{" "}
        {pct(DEEMING.upperRate)}.
      </p>

      <h2>What counts as a deemed financial asset</h2>
      <p>
        Deeming applies to bank accounts, term deposits, shares, managed investments and, for
        people who&apos;ve reached Age Pension age, most superannuation balances. Centrelink
        totals your financial assets, applies the lower rate up to the threshold and the higher
        rate above it, and counts that assumed income toward your pension income test, whether
        your actual returns are higher, lower, or negative in a given year. Your home and most
        personal assets like your car and household contents aren&apos;t financial assets for
        deeming purposes. Your car and household contents still count toward the separate assets
        test.
      </p>

      <h2>Why deeming rates matter for the pension income test</h2>
      <p>
        Because deemed income is fixed regardless of actual returns, a higher deeming rate can
        reduce a part-pensioner&apos;s payment even if their real investment income hasn&apos;t
        changed. Someone earning less than the deemed rate on a term deposit or savings account is
        counted as earning more than they actually receive. Someone earning above the deemed rate
        keeps the difference without it affecting their pension. Check your own position with the{" "}
        <Link href="/centrelink-income-test/">Centrelink income test guide</Link>, which explains
        how the income and assets tests interact to determine your actual payment rate.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you&apos;re approaching retirement and weighing up how much to hold in super versus
        other savings, deeming rates are one factor in how Centrelink treats different assets.
        A large lump sum in a low-interest savings account is deemed to earn the same income as the
        same amount in higher-yielding term deposits or shares. Moving money between deemed
        financial assets doesn&apos;t change your pension assessment, only your actual returns. Model your retirement balance with the{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link>, and use the{" "}
        <Link href="/centrelink-income-test/">Centrelink income test guide</Link> to see how the
        new thresholds interact with any part-time income you&apos;re still earning.
      </p>
    </>
  );
}
