// The static long-form content on /family-tax-benefit-calculator/ (rate
// tables, income test, pay-rise table, eligibility, FAQ, sources). A server
// component, so it ships as HTML; the client module
// (family-tax-benefit-calculator.tsx) renders it via `children`.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  FAMILY_PAYMENT_SOURCES,
  FTB_A,
  FTB_B,
  ftbA,
  ftbABaseRateIncome,
  ftbANilIncome,
} from "@/lib/constants/centrelink-family-payments";
import { CentrelinkRelated } from "./centrelink-shared";
import { FTB_FAQS } from "./family-tax-benefit-faqs";

// Same values as the exports of centrelink-shared.tsx, re-declared here because
// a server file cannot import non-component values from a "use client" module.
const H2 = "text-2xl font-semibold text-navy mb-4";
const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const A = FTB_A;
const B = FTB_B;
const TWO_KIDS = { age0to12: 2, age13to19: 0 };
const PAY_RISE_INCOMES = [60_000, 70_000, 80_000, 90_000, 100_000, 110_000, 120_000, 130_000, 140_000, 150_000];

const SOURCES_LIST = [
  source("FTB Part A payment rates", FAMILY_PAYMENT_SOURCES.ftbARates),
  source("Income test for FTB Part A", FAMILY_PAYMENT_SOURCES.ftbAIncomeTest),
  source("FTB Part B payment rates", FAMILY_PAYMENT_SOURCES.ftbBRates),
  source("Income test for FTB Part B", FAMILY_PAYMENT_SOURCES.ftbBIncomeTest),
  source("Who can get Family Tax Benefit", FAMILY_PAYMENT_SOURCES.ftbEligibility),
];
const authorship = getGuideAuthorship("family-tax-benefit-calculator");

export default function FamilyTaxBenefitCalculatorContent() {
  return (
    <>
      <section>
        <h2 style={FONT} className={H2}>FTB Part A Rates for {A.financialYear}</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Per child</th><th scope="col" className={TH + " text-right"}>Per fortnight</th><th scope="col" className={TH + " text-right"}>Per year (365 days)</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Maximum rate, child 0–12</td><td className={TD + " text-right font-semibold"}>{formatAUD(A.maxFortnightly.age0to12, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.age0to12 * 365 / 14)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Maximum rate, child 13–15 (or 16–19 in secondary study)</td><td className={TD + " text-right font-semibold"}>{formatAUD(A.maxFortnightly.age13to19, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.age13to19 * 365 / 14)}</td></tr>
              <tr><td className={TD}>Base rate, any age</td><td className={TD + " text-right font-semibold"}>{formatAUD(A.baseFortnightly, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.baseFortnightly * 365 / 14)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>FTB Part A supplement (yearly, family ATI ≤ {formatAUD(A.supplementIncomeLimit)})</td><td className={TD + " text-right"}>—</td><td className={TD + " text-right"}>up to {formatAUD(A.supplementAnnual, 2)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={FONT} className={H2}>The FTB Part A Income Test</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Family adjusted taxable income</th><th scope="col" className={TH}>What happens</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>{formatAUD(A.lowerThreshold)} or less</td><td className={TD}>Maximum rate</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>{formatAUD(A.lowerThreshold)} to {formatAUD(A.higherThreshold)}</td><td className={TD}>Reduces by 20c per $1 over {formatAUD(A.lowerThreshold)}, but not below the base rate</td></tr>
              <tr><td className={TD}>Over {formatAUD(A.higherThreshold)}</td><td className={TD}>Reduces by 30c per $1 over {formatAUD(A.higherThreshold)} until nil</td></tr>
            </tbody>
          </table>
        </div>
        <h3 style={FONT} className="text-xl font-semibold text-navy mb-3 mt-6">Where FTB Part A reaches the base rate, and where it stops</h3>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Children</th><th scope="col" className={TH + " text-right"}>Falls to base rate at</th><th scope="col" className={TH + " text-right"}>Stops at</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {([
                ["1 child aged 0–12", { age0to12: 1, age13to19: 0 }, A.publishedBaseRateLimit.oneChild0to12, A.publishedNilLimit.oneChild],
                ["1 child aged 13–19", { age0to12: 0, age13to19: 1 }, A.publishedBaseRateLimit.oneChild13to19, A.publishedNilLimit.oneChild],
                ["2 children aged 0–12", { age0to12: 2, age13to19: 0 }, A.publishedBaseRateLimit.twoChildren0to12, A.publishedNilLimit.twoChildren0to12],
                ["1 aged 0–12 and 1 aged 13–19", { age0to12: 1, age13to19: 1 }, A.publishedBaseRateLimit.oneEach, A.publishedNilLimit.twoChildren0to12],
                ["2 children aged 13–19", { age0to12: 0, age13to19: 2 }, null, A.publishedNilLimit.twoChildren13to19],
                ["3 children aged 0–12", { age0to12: 3, age13to19: 0 }, null, A.publishedNilLimit.threeChildren0to12],
              ] as const).map(([label, , base, nil], i) => (
                <tr key={label} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{label}</td>
                  <td className={TD + " text-right"}>{base ? formatAUD(base) : `never — stays above base until ${formatAUD(A.higherThreshold)}`}</td>
                  <td className={TD + " text-right"}>{formatAUD(nil)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Income limits as published by Services Australia for {A.financialYear}. Our calculator&apos;s own limits (e.g. {formatAUD(ftbABaseRateIncome({ age0to12: 1, age13to19: 0 }))} and {formatAUD(ftbANilIncome({ age0to12: 1, age13to19: 0 }))} for one child) reproduce each figure to within $1. Limits are higher if you also get Rent Assistance or Energy Supplement.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>FTB Part B Rates and Income Test</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Youngest child</th><th scope="col" className={TH + " text-right"}>Maximum per fortnight</th><th scope="col" className={TH + " text-right"}>Couples: lower earner stops getting Part B at</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Under 5</td><td className={TD + " text-right font-semibold"}>{formatAUD(B.maxFortnightly.youngestUnder5, 2)}</td><td className={TD + " text-right"}>{formatAUD(B.publishedSecondaryLimit.youngestUnder5)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>5 to 12</td><td className={TD + " text-right font-semibold"}>{formatAUD(B.maxFortnightly.youngest5to18, 2)}</td><td className={TD + " text-right"}>{formatAUD(B.publishedSecondaryLimit.youngest5to12)}</td></tr>
              <tr><td className={TD}>13 to 18 (single parents only; 16–18 in full-time secondary school)</td><td className={TD + " text-right font-semibold"}>{formatAUD(B.maxFortnightly.youngest5to18, 2)}</td><td className={TD + " text-right"}>not payable to couples</td></tr>
            </tbody>
          </table>
        </div>
        <p className={P + " mt-4"}>Part B is a two-part test. First, the single parent — or in a couple, the higher earner — must have adjusted taxable income of {formatAUD(B.primaryEarnerLimit)} or less; above that there is no Part B at all. Second, for couples, the lower earner can earn {formatAUD(B.secondaryFreeArea)} a year before Part B reduces by 20 cents per dollar. A supplement of up to {formatAUD(B.supplementAnnual, 2)} per family is paid after the year.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>How a Pay Rise Changes Your FTB</h2>
        <p className={P}>FTB Part A for two children aged 0–12 at different family incomes. Between {formatAUD(A.lowerThreshold)} and the base-rate point each extra dollar costs 20 cents of Part A; above {formatAUD(A.higherThreshold)}, 30 cents.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Family income</th><th scope="col" className={TH + " text-right"}>Part A a fortnight</th><th scope="col" className={TH + " text-right"}>Part A a year (incl. supplement)</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {PAY_RISE_INCOMES.map((inc, i) => { const r = ftbA(inc, TWO_KIDS); return (
                <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD + " font-medium"}>{formatAUD(inc)}</td><td className={TD + " text-right"}>{formatAUD(r.fortnightly, 2)}</td><td className={TD + " text-right"}>{formatAUD(r.annualTotal)}</td></tr>
              ); })}
            </tbody>
          </table>
        </div>
        <p className={P + " mt-4"}>Going from {formatAUD(70_000)} to {formatAUD(80_000)} costs about {formatAUD(ftbA(70_000, TWO_KIDS).annualExSupplement - ftbA(80_000, TWO_KIDS).annualExSupplement)} of Part A for this family, and crossing {formatAUD(A.supplementIncomeLimit)} loses the {formatAUD(2 * A.supplementAnnual, 2)} supplement. Tax takes its share of the rise too — see what an extra shift is worth after tax with the <Link href="/pay-rise-calculator/" className={LINK}>pay rise calculator</Link> or the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>, and remember to update your family income estimate with Services Australia.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Who Can Get Family Tax Benefit</h2>
        <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
          <li>You care for a dependent child at least 35% of the time — a child under 16, or 16 to 19 in full-time secondary study.</li>
          <li>You meet the residence rules, and your child meets the immunisation and Healthy Start for School requirements.</li>
          <li>Part A: your family&apos;s adjusted taxable income is under the limit for your children&apos;s ages (table above).</li>
          <li>Part B: you are a single parent or grandparent carer, or a couple with one main income and a youngest child under {B.coupleYoungestUnder}.</li>
        </ul>
        <p className={P}>FTB is separate from <Link href="/parenting-payment-calculator/" className={LINK}>Parenting Payment</Link> — you can get both, and getting Parenting Payment means the maximum rate of Part A. Families who rent privately and get more than the base rate of Part A may also get <Link href="/rent-assistance-calculator/" className={LINK}>Rent Assistance</Link>.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Related Calculators and Guides</h2>
        <CentrelinkRelated current="ftb" />
      </section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Part A is the higher of two methods. Method 1: maximum rate − 20c × income between {formatAUD(A.lowerThreshold)} and {formatAUD(A.higherThreshold)} − 30c × income over {formatAUD(A.higherThreshold)}. Method 2: base rate − 30c × income over {formatAUD(A.higherThreshold)}.</li>
          <li>Part B: maximum rate if the single or higher-earner income is {formatAUD(B.primaryEarnerLimit)} or less; for couples, less 20c × the lower earner&apos;s income over {formatAUD(B.secondaryFreeArea)}.</li>
          <li>Yearly amounts are the fortnightly rate × 365 ÷ 14. Supplements are added to the tested amount and reduced last; the Part A supplement needs family ATI of {formatAUD(A.supplementIncomeLimit)} or less. These reproduce every income limit Services Australia publishes for {A.financialYear} to within $1 (our unit tests check each one).</li>
          <li>Figures read at Services Australia on {FAMILY_PAYMENT_SOURCES.verifiedOn}. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder, which also handles shared care and child support.</li>
        </ul>
      </MethodologyDisclosure>

      <section>
        <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
        <div className="sr-only"><h3>Family Tax Benefit questions and answers</h3>{FTB_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
        <Accordion type="multiple">
          {FTB_FAQS.map((f) => (<AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent><p>{f.a}</p></AccordionContent></AccordionItem>))}
        </Accordion>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={FAMILY_PAYMENT_SOURCES.verifiedOn} />
      {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
    </>
  );
}
