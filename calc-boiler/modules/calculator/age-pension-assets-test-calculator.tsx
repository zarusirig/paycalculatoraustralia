"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, formatNegAUD, SITE_CONFIG } from "@/lib/constants";
import {
  AGE_PENSION_INCOME_TEST,
  WORK_BONUS,
  assessableAfterWorkBonus,
  pensionReduction,
} from "@/lib/constants/centrelink-income-test";
import {
  DEEMING,
  MEANS_TEST_SOURCES as SRC,
  PENSION_ASSETS_TEST as AT,
  PENSION_RATES_NOW,
  applyingTest,
  assetsTestRate,
  assetsTestReduction,
  deemedIncomeFortnightly,
  pensionMaxRate,
  type AssetsSituation,
  type Homeownership,
} from "@/lib/constants/centrelink-means-test";
import { INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, FONT, source } from "./centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { ASSETS_TEST_FAQS } from "./centrelink-h3-faqs";

// DataForSEO 24 Sep 2026 (AU): "age pension assets test" 9.9k (KD 1),
// "pension asset test" 5.4k, "age pension asset limits" 1.3k, "pension assets
// test calculator" 880, "age pension assets test calculator" 720. Framed as
// "which test sets your pension" so the page still answers the pay question:
// wages go through the income test, savings through both.

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

/** One person's pension under the income test, for any assets situation. */
function incomeTestRate(assessable: number, situation: AssetsSituation): number {
  const test = situation === "single" ? "single" : "couple";
  return Math.max(0, Math.round((pensionMaxRate(situation) - pensionReduction(assessable, test)) * 100) / 100);
}

const SITUATION_LABEL: Record<AssetsSituation, string> = {
  single: "Single",
  couple: "Couple living together",
  coupleIllness: "Couple separated due to illness",
};

export default function AgePensionAssetsTestCalculatorPage() {
  const [situation, setSituation] = useState<AssetsSituation>("single");
  const [home, setHome] = useState<Homeownership>("homeowner");
  const [financial, setFinancial] = useState(250_000);
  const [otherAssets, setOtherAssets] = useState(40_000);
  const [employment, setEmployment] = useState(0);
  const [balance, setBalance] = useState(0);
  const [partnerEmployment, setPartnerEmployment] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);

  const couple = situation !== "single";

  const r = useMemo(() => {
    const assets = financial + otherAssets;
    const deemed = deemedIncomeFortnightly(financial, couple ? "pensionerCouple" : "single");
    const wages = assessableAfterWorkBonus(employment, balance) + (couple ? assessableAfterWorkBonus(partnerEmployment, 0) : 0);
    const assessable = Math.round((wages + deemed + otherIncome) * 100) / 100;
    const byIncome = incomeTestRate(assessable, situation);
    const byAssets = assetsTestRate(assets, situation, home);
    const paid = Math.min(byIncome, byAssets);
    return {
      assets,
      deemed,
      wages,
      assessable,
      byIncome,
      byAssets,
      paid,
      applies: applyingTest(byIncome, byAssets),
      assetsReduction: assetsTestReduction(assets, situation, home),
      max: pensionMaxRate(situation),
      limit: AT.fullPensionLimit[situation][home],
      cutOff: AT.partPensionCutOff[situation][home],
    };
  }, [financial, otherAssets, employment, balance, partnerEmployment, otherIncome, situation, home, couple]);

  const appliesText =
    r.applies === "nil" ? "Both tests reduce your pension to $0." :
      r.applies === "both" ? "Both tests give the same rate." :
        r.applies === "assets" ? "The assets test sets your pension — it gives the lower rate." :
          "The income test sets your pension — it gives the lower rate.";

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Age Pension Assets Test Calculator" title="Age Pension Assets Test Calculator 2026 — Limits, Taper and Which Test Applies">
          <p>
            From {AT.ratesFrom} you get the full Age Pension with assets up to <strong>{formatAUD(AT.fullPensionLimit.single.homeowner)}</strong> (single homeowner) or <strong>{formatAUD(AT.fullPensionLimit.couple.homeowner)}</strong> (couple homeowner, combined). Above that the pension falls by <strong>$3 a fortnight for every $1,000</strong> ($1.50 each for a couple) and stops at <strong>{formatAUD(AT.partPensionCutOff.single.homeowner)}</strong> single or <strong>{formatAUD(AT.partPensionCutOff.couple.homeowner)}</strong> for a couple. Non-homeowners can have {formatAUD(AT.fullPensionLimit.single.nonHomeowner - AT.fullPensionLimit.single.homeowner)} more.
          </p>
          <p className="text-base">The calculator runs the assets test and the income test (with your wages, the Work Bonus and deemed income on your savings) and shows which one sets your pension — Services Australia pays the lower.</p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Your Age Pension Under Both Tests</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="situation" className={LABEL}>You are</label>
                    <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as AssetsSituation)} className={INPUT}>
                      <option value="single">Single</option>
                      <option value="couple">A couple living together (both on Age Pension)</option>
                      <option value="coupleIllness">A couple separated due to illness</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="home" className={LABEL}>Do you own your home?</label>
                    <select id="home" value={home} onChange={(e) => setHome(e.target.value as Homeownership)} className={INPUT}>
                      <option value="homeowner">Yes — homeowner</option>
                      <option value="nonHomeowner">No — non-homeowner</option>
                    </select>
                  </div>
                  <MoneyInput id="financial" label={`Financial assets${couple ? " (combined)" : ""}`} value={financial} onChange={setFinancial} max={5_000_000} step={1_000} hint="Bank accounts, term deposits, shares, managed funds, super once you are Age Pension age. These are also deemed." />
                  <MoneyInput id="otherAssets" label={`Other assets${couple ? " (combined)" : ""}`} value={otherAssets} onChange={setOtherAssets} max={5_000_000} step={1_000} hint="Cars, caravan, boat, home contents, investment property (less its loan). Not your home." />
                  <MoneyInput id="employment" label="Your employment income this fortnight" value={employment} onChange={setEmployment} max={10_000} />
                  <MoneyInput id="balance" label="Your Work Bonus balance" value={balance} onChange={setBalance} max={WORK_BONUS.maxBalance} step={100} hint={`Up to ${formatAUD(WORK_BONUS.maxBalance)}, shown in your Centrelink online account.`} />
                  {couple && <MoneyInput id="partnerEmployment" label="Partner's employment income this fortnight" value={partnerEmployment} onChange={setPartnerEmployment} max={10_000} hint="The first $300 is disregarded (Work Bonus); partner balance not modelled." />}
                  <MoneyInput id="otherIncome" label={`Other income this fortnight${couple ? " (combined)" : ""}`} value={otherIncome} onChange={setOtherIncome} max={10_000} hint="Rent, overseas pensions. Do not include interest — the calculator deems your financial assets." />
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">{couple ? "Age Pension each, this fortnight" : "Age Pension this fortnight"}</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(r.paid, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(r.max, 2)} maximum · about {formatAUD(r.paid * 26 * (couple ? 2 : 1))} a year{couple ? " for the two of you" : ""}</div>
                    <div className="text-sm text-navy mt-3 pt-3 border-t border-sandstone-dark/20 font-medium">{appliesText}</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className={`rounded-xl border p-4 ${r.applies === "income" ? "border-eucalyptus bg-eucalyptus-light/40" : "border-sandstone-dark/20 bg-white"}`}>
                      <div className="text-xs uppercase tracking-wider text-warmgray mb-1">Income test</div>
                      <div className="text-2xl font-bold text-navy">{formatAUD(r.byIncome, 2)}</div>
                      <div className="text-xs text-warmgray mt-1">on {formatAUD(r.assessable, 2)} assessable income a fortnight</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${r.applies === "assets" ? "border-eucalyptus bg-eucalyptus-light/40" : "border-sandstone-dark/20 bg-white"}`}>
                      <div className="text-xs uppercase tracking-wider text-warmgray mb-1">Assets test</div>
                      <div className="text-2xl font-bold text-navy">{formatAUD(r.byAssets, 2)}</div>
                      <div className="text-xs text-warmgray mt-1">on {formatAUD(r.assets)} of assessable assets</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How each test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Assessable assets" value={formatAUD(r.assets)} />
                      <Row label={`Full-pension limit (${SITUATION_LABEL[situation].toLowerCase()}, ${home === "homeowner" ? "homeowner" : "non-homeowner"})`} value={formatAUD(r.limit)} />
                      <Row label={`Over the limit × ${situation === "single" ? "$3" : "$1.50 each"} per $1,000`} value={formatNegAUD(r.assetsReduction, 2)} />
                      <Row label="Assets test rate" value={formatAUD(r.byAssets, 2)} bold />
                      <Row label="Part pension stops above" value={formatAUD(r.cutOff)} />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Wages after the Work Bonus" value={formatAUD(r.wages, 2)} />
                      <Row label="Deemed income on financial assets" value={formatAUD(r.deemed, 2)} />
                      <Row label="Other income" value={formatAUD(otherIncome, 2)} />
                      <Row label={`${situation === "single" ? "50c" : "25c each"} per $1 over ${formatAUD(IT[situation === "single" ? "single" : "couple"].freeArea)}`} value={formatNegAUD(pensionReduction(r.assessable, situation === "single" ? "single" : "couple"), 2)} />
                      <Row label="Income test rate" value={formatAUD(r.byIncome, 2)} bold />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Paid: the lower of the two" value={formatAUD(r.paid, 2)} bold highlight />
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light">Estimate only, on the rates from {AT.ratesFrom}. Not modelled: Rent Assistance (which raises the cut-offs), transitional-rate pensioners, a partner&apos;s Work Bonus balance, couples where only one partner gets a pension. Services Australia&apos;s Payment Finder gives a claim estimate.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
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
        </div>
      </div>
    </div>
  );
}
