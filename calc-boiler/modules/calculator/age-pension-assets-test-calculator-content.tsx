// The static long-form content on /age-pension-assets-test-calculator/, below
// the calculator card. Server component, so it ships as HTML; the client
// module (age-pension-assets-test-calculator.tsx) renders it via `children`.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, formatNegAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import { AGE_PENSION_INCOME_TEST, WORK_BONUS } from "@/lib/constants/centrelink-income-test";
import {
  DEEMING,
  MEANS_TEST_SOURCES as SRC,
  PENSION_ASSETS_TEST as AT,
  PENSION_RATES_NOW,
  assetsTestRate,
  assetsTestReduction,
  type AssetsSituation,
} from "@/lib/constants/centrelink-means-test";
import { Note, W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { ASSETS_TEST_FAQS } from "./centrelink-h3-faqs";

// Same values as the class-name constants in centrelink-shared.tsx, which is a
// "use client" module (its non-component exports cannot be read here).
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const IT = AGE_PENSION_INCOME_TEST;
const R = PENSION_RATES_NOW;
const TABLE_ASSETS = [333_000, 400_000, 450_000, 500_000, 550_000, 600_000, 650_000, 700_000, 745_750];

const SOURCES_LIST = [
  source("Assets test for Age Pension", SRC.agePensionAssetsTest),
  source("Assets test for Disability Support Pension (states the $3 / $1.50 per $1,000 taper)", SRC.dspAssetsTest),
  source("Income test for Age Pension", SRC.agePensionIncomeTest),
  source("How much Age Pension you can get", SRC.agePensionRates),
  source("Asset types", SRC.assetTypes),
  source("Deeming", SRC.deeming),
  { title: SRC.dssRatesListTitle, url: SRC.dssRatesList, publisher: "Department of Social Services" },
];

// Same labels as in age-pension-assets-test-calculator.tsx.
const SITUATION_LABEL: Record<AssetsSituation, string> = {
  single: "Single",
  couple: "Couple living together",
  coupleIllness: "Couple separated due to illness",
};

export default function AgePensionAssetsTestCalculatorContent() {
  return (
    <>
      <W3Section title="Age Pension Assets Test Limits From 20 September 2026">
        <p className={P}>Services Australia publishes two sets of limits: the most you can have and still get the full pension, and the cut-off where a part pension stops. Couples&apos; limits are for both of you combined.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Full pension up to</th><th scope="col" className={TH + " text-right"}>Part pension stops above</th><th scope="col" className={TH + " text-right"}>Cut-off to 19 Sep 2026</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {(["single", "couple", "coupleIllness"] as const).flatMap((s) => (["homeowner", "nonHomeowner"] as const).map((h, i) => (
                <tr key={`${s}-${h}`} className={i === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{SITUATION_LABEL[s]}, {h === "homeowner" ? "homeowner" : "non-homeowner"}</td>
                  <td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit[s][h])}</td>
                  <td className={TD + " text-right font-bold"}>{formatAUD(AT.partPensionCutOff[s][h])}</td>
                  <td className={TD + " text-right text-warmgray"}>{formatAUD(AT.previousPartPensionCutOff[s][h])}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">A couple where only one partner is eligible has the same limits as a couple. If you get Rent Assistance your cut-off is higher. The full-pension limits did not change on 20 September 2026; the cut-offs rose because the pension rate did. Transitional-rate pensioners have lower cut-offs: {formatAUD(AT.transitionalCutOff.single.homeowner)} single homeowner, {formatAUD(AT.transitionalCutOff.couple.homeowner)} couple homeowner.</p>
      </W3Section>

      <W3Section title="How the Assets Taper Works">
        <p className={P}>For every $1,000 of assets above the full-pension limit, the pension reduces by <strong>$3 a fortnight</strong> for a single person and <strong>$1.50 a fortnight each</strong> for a couple — the same $3 per $1,000 across the two of you. That is $78 a year per $1,000, or 7.8% of the excess every year. The cut-off is simply the point where the reduction swallows the whole maximum rate ({formatAUD(R.maxFortnightly.single.total, 2)} single, {formatAUD(R.maxFortnightly.coupleEach.total, 2)} each for a couple).</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Single homeowner, assets</th><th scope="col" className={TH + " text-right"}>Over the limit</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>Assets-test pension</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {TABLE_ASSETS.map((a, i) => (
                <tr key={a} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD + " font-medium"}>{formatAUD(a)}</td>
                  <td className={TD + " text-right"}>{formatAUD(Math.max(0, a - AT.fullPensionLimit.single.homeowner))}</td>
                  <td className={TD + " text-right"}>{formatNegAUD(assetsTestReduction(a, "single", "homeowner"), 2)}</td>
                  <td className={TD + " text-right font-bold"}>{formatAUD(assetsTestRate(a, "single", "homeowner"), 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Non-homeowner: add {formatAUD(AT.fullPensionLimit.single.nonHomeowner - AT.fullPensionLimit.single.homeowner)} to every asset figure in this table and the pension is the same.</p>
      </W3Section>

      <W3Section title="What Counts as an Asset">
        <ul className="list-disc pl-6 space-y-1 text-warmgray">
          <li><strong>Counted:</strong> bank and credit union accounts, term deposits, cash, shares, managed funds, loans you have made, superannuation once you are Age Pension age (or once you draw a pension from it), account-based income streams, investment property, cars, caravans, boats, home contents and personal effects, business interests and some gifts.</li>
          <li><strong>Not counted:</strong> your principal home and generally up to 2 hectares of land it sits on, and superannuation in accumulation phase while you are under Age Pension age.</li>
          <li><strong>Valued at:</strong> what you would get if you sold it at market value, less any debt secured against that asset.</li>
          <li><strong>Tell Services Australia</strong> when financial assets rise by $2,000 or more, or other assets by $1,000 or more. Listed shares and market-linked investments are revalued automatically twice a year.</li>
        </ul>
      </W3Section>

      <W3Section title="Working, Savings and Which Test Applies">
        <p className={P}>Your wages never go through the assets test — only the income test, after the Work Bonus takes the first {formatAUD(WORK_BONUS.fortnightlyCredit)} a fortnight out. Your savings go through both: their value counts as an asset, and the same balance is deemed to earn income ({(DEEMING.lowerRate * 100).toFixed(2)}% on the first {formatAUD(DEEMING.thresholds.single)} for a single pensioner, {(DEEMING.upperRate * 100).toFixed(2)}% above — see <Link href="/deeming-rates/" className={LINK}>deeming rates</Link>). That is why a pensioner with a large balance is often on the assets test even while working a few shifts: the income test result is higher, so it doesn&apos;t bite.</p>
        <p className={P}>If the income test is setting your pension, extra hours cost you 50 cents in the dollar above the free area — check your net pay on the <Link href="/fortnightly-pay-calculator/" className={LINK}>fortnightly pay calculator</Link> and model the pension on the <Link href="/age-pension-income-test-calculator/" className={LINK}>Age Pension calculator</Link>. If the assets test is setting it, extra wages may not change your pension at all until the income test result falls below the assets test result.</p>
        <Note>Both tests are recalculated whenever you report income or an asset changes. A fortnight with a big pay packet can switch you from the assets test to the income test just for that fortnight.</Note>
      </W3Section>

      <W3Section title="Related Calculators and Guides">
        <W3Related current="assets" />
      </W3Section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assets-test rate = maximum rate − (assets over the full-pension limit ÷ $1,000) × $3 (single) or × $1.50 each (couples, on combined assets), floored at $0. Services Australia states the taper on its DSP assets test page; the Age Pension uses the same pension assets test and the same limits.</li>
          <li>This taper, the maximum rates and the full-pension limits rebuild every published cut-off exactly — our tests assert all of them, including the ones in force before 20 September 2026. The calculator applies the taper continuously; Services Australia works in $250 steps, so results can differ by a few cents.</li>
          <li>Income-test rate = maximum rate − 50c per dollar over {formatAUD(IT.single.freeArea)} (single) or 25c each per combined dollar over {formatAUD(IT.couple.freeArea)} (couples). Assessable income = wages after the Work Bonus + deemed income on the financial assets you enter + other income.</li>
          <li>Rates from {AT.ratesFrom}, read at Services Australia and in the DSS rates list on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia.</li>
        </ul>
      </MethodologyDisclosure>

      <W3Faqs faqs={ASSETS_TEST_FAQS} topic="Age Pension assets test" />
      <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="age-pension-assets-test-calculator" />
    </>
  );
}
