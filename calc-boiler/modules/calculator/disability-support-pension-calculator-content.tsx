// The static long-form content on /disability-support-pension-calculator/
// (rates, income test, work hours, assets test, eligibility, FAQ, sources).
// A server component, so it ships as HTML; the client module
// (disability-support-pension-calculator.tsx) renders it via `children`.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, formatNegAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import { AGE_PENSION_INCOME_TEST, pensionReduction } from "@/lib/constants/centrelink-income-test";
import {
  DSP,
  MEANS_TEST_SOURCES as SRC,
  PENSION_ASSETS_TEST as AT,
} from "@/lib/constants/centrelink-means-test";
import { Note, W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { DSP_FAQS } from "./centrelink-h3-faqs";

// Same values as the exports of centrelink-shared.tsx, re-declared here because
// a server file cannot import non-component values from a "use client" module.
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const IT = AGE_PENSION_INCOME_TEST;
const R = DSP.rates21Plus.maxFortnightly;
const TABLE_INCOMES = [0, 226, 400, 600, 800, 1_000, 1_500, 2_000, 2_400, DSP.publishedCutOff.single21Plus];

const SOURCES_LIST = [
  source("Payment rates for Disability Support Pension", SRC.dspRates),
  source("Income test for Disability Support Pension", SRC.dspIncomeTest),
  source("Assets test for Disability Support Pension", SRC.dspAssetsTest),
  source("Working while you get DSP", SRC.dspWork),
  source("Non-medical rules for DSP", SRC.dspNonMedical),
  source("Disability Support Pension", SRC.dsp),
  { title: SRC.dssRatesListTitle, url: SRC.dssRatesList, publisher: "Department of Social Services" },
];

export default function DisabilitySupportPensionCalculatorContent() {
  return (
    <>
      <W3Section title="DSP Rates From 20 September 2026">
        <p className={P}>If you are 21 or older, or younger than 21 with a child in your care, DSP is paid at the pension rate — the same figures as the Age Pension, adjusted every 20 March and 20 September.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Per fortnight</th><th scope="col" className={TH + " text-right"}>Single</th><th scope="col" className={TH + " text-right"}>Couple each</th><th scope="col" className={TH + " text-right"}>Couple combined</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {([["Maximum basic rate", "basic"], ["Pension Supplement", "supplement"], ["Energy Supplement", "energy"], ["Total", "total"]] as const).map(([label, f]) => (
                <tr key={f} className={f === "total" ? "bg-eucalyptus-light/30 font-bold" : undefined}>
                  <td className={TD}>{label}</td>
                  <td className={TD + " text-right"}>{formatAUD(R.single[f], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(R.coupleEach[f], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(R.coupleCombined[f], 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">A couple separated due to ill health each get the single rate. Services Australia&apos;s DSP page shows the couple Pension Supplement as $65.50 each, but its total ({formatAUD(R.coupleEach.total, 2)}) only adds up with {formatAUD(R.coupleEach.supplement, 2)} — the figure in the DSS rates list and on the Age Pension page, which we use.</p>
        <h3 className="font-semibold text-navy mt-6 mb-2">Under 21 with no children</h3>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Maximum per fortnight</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Single, under 18, dependent</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.under18Dependent, 2)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Single, under 18, independent</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.under18Independent, 2)}</td></tr>
              <tr><td className={TD}>Single, 18 to 20, dependent</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.age18to20Dependent, 2)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Single, 18 to 20, independent</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.age18to20Independent, 2)}</td></tr>
              <tr><td className={TD}>A couple, under 21</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.coupleUnder21, 2)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">These include the Youth Disability Supplement but not Pharmaceutical Allowance or Energy Supplement, and index on {DSP.under21IndexedOn}. Your parents&apos; income does not affect the rate.</p>
      </W3Section>

      <W3Section title="DSP Income Test">
        <p className={P}>DSP uses the pension income test. It counts your and your partner&apos;s income from all sources, including <Link href="/deeming-rates/" className={LINK}>deemed income</Link> on savings. If you are permanently blind the income test doesn&apos;t apply unless you get Rent Assistance.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Payment stops at (a fortnight)</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>21 or older, single</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.single21Plus, 2)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>21 or older, couple living together</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.couple21PlusCombined, 2)} combined</td></tr>
              <tr><td className={TD}>21 or older, couple apart due to ill health</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.coupleApartIllHealthCombined, 2)} combined</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>18 to 20, single, no children, at home</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.age18to20SingleAtHome, 2)}</td></tr>
              <tr><td className={TD}>16 to 17, single, no children, at home</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.age16to17SingleAtHome, 2)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>16 to 20, single, no children, independent</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.age16to20SingleIndependent, 2)}</td></tr>
              <tr><td className={TD}>16 to 20, couple, no children</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.age16to20CoupleCombined, 2)} combined</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Free area {formatAUD(IT.single.freeArea)} a fortnight single ({formatAUD(IT.couple.freeArea)} combined for a couple); 50c per dollar above it (25c each for a couple). Cut-offs as published by Services Australia from {DSP.ratesFrom}.</p>
        <div className={TABLE_WRAP + " mt-6"}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Single, 21+, income a fortnight</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>DSP</th><th scope="col" className={TH + " text-right"}>Income + DSP</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {TABLE_INCOMES.map((inc, i) => {
                const pay = Math.max(0, Math.round((R.single.total - pensionReduction(inc, "single")) * 100) / 100);
                return (
                  <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                    <td className={TD + " font-medium"}>{formatAUD(inc, 2)}</td>
                    <td className={TD + " text-right"}>{formatNegAUD(pensionReduction(inc, "single"), 2)}</td>
                    <td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td>
                    <td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </W3Section>

      <W3Section title="How Many Hours Can You Work on DSP?">
        <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
          <li><strong>Up to {DSP.maxWorkHoursPerWeek} hours a week:</strong> you keep DSP, and your pay goes through the income test.</li>
          <li><strong>{DSP.suspensionHoursPerWeek} or more hours a week on an ongoing basis:</strong> DSP is suspended for up to {DSP.suspensionYears} years. You keep your Pensioner Concession Card, and can ask for DSP to be restored within that time if your hours or income drop — no new claim.</li>
          <li><strong>Exceptions:</strong> work in an Australian Disability Enterprise, under the Supported Wage System, or with ongoing Inclusive Employment Australia support doesn&apos;t trigger the suspension.</li>
          <li><strong>Pay over the cut-off:</strong> DSP is $0 for that fortnight. After more than {DSP.nilRateFortnights} fortnights in a row at $0, DSP is suspended (or cancelled if it&apos;s your partner&apos;s income on a payment like JobSeeker doing it).</li>
          <li><strong>Report every 2 weeks:</strong> your and your partner&apos;s gross pay and the hours you worked. Tell Services Australia within 14 days when you start work.</li>
        </ul>
        <Note>To turn an hourly rate into the fortnightly gross the calculator needs, use the <Link href="/fortnightly-pay-calculator/" className={LINK}>fortnightly pay calculator</Link>. DSP is tax-free under Age Pension age, so tax on your wages is the only tax in the picture — see the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>.</Note>
      </W3Section>

      <W3Section title="DSP Assets Test">
        <p className={P}>DSP uses the pension assets test: the lower of the income-test and assets-test results is paid. Above the full-pension limit, DSP reduces by $3 a fortnight per $1,000 ($1.50 each for a couple). Your home is not counted. Figures from {AT.ratesFrom}; couples combined.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation (21+)</th><th scope="col" className={TH + " text-right"}>Full pension up to</th><th scope="col" className={TH + " text-right"}>Part pension stops above</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Single, homeowner</td><td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit.single.homeowner)}</td><td className={TD + " text-right"}>{formatAUD(AT.partPensionCutOff.single.homeowner)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Single, non-homeowner</td><td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit.single.nonHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(AT.partPensionCutOff.single.nonHomeowner)}</td></tr>
              <tr><td className={TD}>Couple, homeowner</td><td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit.couple.homeowner)}</td><td className={TD + " text-right"}>{formatAUD(AT.partPensionCutOff.couple.homeowner)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Couple, non-homeowner</td><td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit.couple.nonHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(AT.partPensionCutOff.couple.nonHomeowner)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Under 21 with no children, DSP stops above {formatAUD(DSP.under21AssetsCutOff.age16to17Dependent.homeowner)} (16–17, dependent, homeowner) to {formatAUD(DSP.under21AssetsCutOff.age16to20Independent.nonHomeowner)} (independent, non-homeowner). Run your own figures on the <Link href="/age-pension-assets-test-calculator/" className={LINK}>assets test calculator</Link> — the 21+ limits are identical.</p>
      </W3Section>

      <W3Section title="Who Can Get DSP">
        <ul className="list-disc pl-6 space-y-1 text-warmgray">
          <li>You have a physical, intellectual or psychiatric condition that is likely to persist for more than {DSP.conditionYears} years and stops you from working, and you meet the medical rules.</li>
          <li>You are at least {DSP.minClaimAge} and under Age Pension age when you claim, and meet the residence rules and the income and assets tests.</li>
          <li>If you are under {DSP.participationUnderAge} you may have participation requirements — a compulsory work-focused activity with an employment services provider.</li>
          <li>DSP is taxable only once you reach Age Pension age; you can then choose to transfer to the Age Pension.</li>
        </ul>
      </W3Section>

      <W3Section title="Related Calculators and Guides">
        <W3Related current="dsp" />
      </W3Section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>DSP = maximum rate − 50c per $1 of assessable income over {formatAUD(IT.single.freeArea)} (single), or − 25c per combined $1 over {formatAUD(IT.couple.freeArea)} for each member of a couple, floored at $0. For 21+ this reproduces Services Australia&apos;s published cut-offs exactly (tests assert it).</li>
          <li>Under-21 maximum rates are as published and exclude Pharmaceutical Allowance and Energy Supplement, which the published cut-offs include — so the calculator reaches $0 slightly earlier than Services Australia&apos;s figure.</li>
          <li>Hours rule: up to {DSP.maxWorkHoursPerWeek} hours a week keeps DSP; {DSP.suspensionHoursPerWeek}+ ongoing suspends it. The calculator flags the hours; it doesn&apos;t decide whether hours are &ldquo;ongoing&rdquo;.</li>
          <li>Rates and rules read at Services Australia on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder for a claim estimate.</li>
        </ul>
      </MethodologyDisclosure>

      <W3Faqs faqs={DSP_FAQS} topic="Disability Support Pension" />
      <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="disability-support-pension-calculator" />
    </>
  );
}
