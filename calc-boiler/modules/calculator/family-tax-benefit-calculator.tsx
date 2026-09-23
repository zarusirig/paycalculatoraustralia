"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import {
  FAMILY_PAYMENT_SOURCES,
  FTB_A,
  FTB_B,
  ftbA,
  ftbABaseRateIncome,
  ftbANilIncome,
  ftbB,
  type FamilyType,
} from "@/lib/constants/centrelink-family-payments";
import { CentrelinkRelated, FONT, H2, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, clamp, source } from "./centrelink-shared";
import { FTB_FAQS } from "./family-tax-benefit-faqs";

// DataForSEO 23 Sep 2026: "family tax benefit calculator" and five variants,
// 9.9k each (KD 0–8), fairworkmate #5–12. FTB is a FAMILY income test, the
// furthest node from "Australian pay" — the page is framed around how a pay
// rise or extra hours move the payment, and links back to the pay calculators.
//
// Scope: an estimator, not Services Australia's full model. It applies the
// published 2026–27 rates, thresholds and tapers (reconciled in the tests to
// every published income limit); shared care, the Maintenance Income Test,
// Rent Assistance, Energy Supplement and the newborn supplement are out.

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

function num(v: string, max: number) {
  return clamp(Math.round(Number(v || 0)), 0, max);
}

export default function FamilyTaxBenefitCalculatorPage() {
  const [family, setFamily] = useState<FamilyType>("couple");
  const [yourIncome, setYourIncome] = useState(75_000);
  const [partnerIncome, setPartnerIncome] = useState(20_000);
  const [kids0to12, setKids0to12] = useState(2);
  const [kids13to19, setKids13to19] = useState(0);
  const [youngest, setYoungest] = useState(3);
  const [incomeSupport, setIncomeSupport] = useState(false);
  const authorship = getGuideAuthorship("family-tax-benefit-calculator");

  const noKids = kids0to12 + kids13to19 === 0;
  const familyIncome = family === "couple" ? yourIncome + partnerIncome : yourIncome;

  const result = useMemo(() => {
    const a = ftbA(familyIncome, { age0to12: kids0to12, age13to19: kids13to19 }, incomeSupport);
    const primary = family === "couple" ? Math.max(yourIncome, partnerIncome) : yourIncome;
    const secondary = family === "couple" ? Math.min(yourIncome, partnerIncome) : 0;
    const b = kids0to12 + kids13to19 === 0
      ? null
      : ftbB({ family, youngestAge: youngest, primaryIncome: primary, secondaryIncome: secondary });
    return { a, b, primary, secondary };
  }, [family, yourIncome, partnerIncome, kids0to12, kids13to19, youngest, incomeSupport, familyIncome]);

  const totalFortnight = result.a.fortnightly + (result.b?.fortnightly ?? 0);
  const totalYear = result.a.annualTotal + (result.b?.annualTotal ?? 0);
  const youngestInconsistent = (kids0to12 > 0 && youngest > 12) || (kids0to12 === 0 && kids13to19 > 0 && youngest < 13);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><Link href="/centrelink-income-test/" className="hover:text-eucalyptus-dark hover:underline">Centrelink Income Test</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Family Tax Benefit Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Family Tax Benefit Calculator — FTB Part A and Part B ({A.financialYear})</h1>
          <p className="text-lg text-warmgray">
            FTB Part A is up to <strong>{formatAUD(A.maxFortnightly.age0to12, 2)} a fortnight per child aged 0–12</strong> and {formatAUD(A.maxFortnightly.age13to19, 2)} for a teenager; FTB Part B is up to <strong>{formatAUD(B.maxFortnightly.youngestUnder5, 2)} per family</strong>. Enter your incomes and children to estimate both — and see how a pay rise or extra hours changes them.
          </p>
          <p className="mt-3 inline-block rounded-full bg-eucalyptus-light/60 px-3 py-1 text-xs font-semibold text-navy">{A.financialYear} rates and thresholds (from 1 July 2026) · verified {FAMILY_PAYMENT_SOURCES.verifiedOn}</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Estimate Your Family Tax Benefit</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="family" className={LABEL}>Your family</label>
                    <select id="family" value={family} onChange={(e) => setFamily(e.target.value as FamilyType)} className={INPUT}>
                      <option value="couple">Couple</option>
                      <option value="single">Single parent</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="yourIncome" className={LABEL}>Your adjusted taxable income (a year)</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="yourIncome" min={0} max={400000} step={1000} value={yourIncome} onChange={(e) => setYourIncome(num(e.target.value, 400_000))} className={INPUT} /></div>
                  </div>
                  {family === "couple" && (
                    <div>
                      <label htmlFor="partnerIncome" className={LABEL}>Your partner&apos;s adjusted taxable income (a year)</label>
                      <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="partnerIncome" min={0} max={400000} step={1000} value={partnerIncome} onChange={(e) => setPartnerIncome(num(e.target.value, 400_000))} className={INPUT} /></div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="kids0to12" className={LABEL}>Children 0–12</label>
                      <input type="number" id="kids0to12" min={0} max={10} value={kids0to12} onChange={(e) => setKids0to12(num(e.target.value, 10))} className={INPUT} />
                    </div>
                    <div>
                      <label htmlFor="kids13to19" className={LABEL}>Children 13–19*</label>
                      <input type="number" id="kids13to19" min={0} max={10} value={kids13to19} onChange={(e) => setKids13to19(num(e.target.value, 10))} className={INPUT} />
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light -mt-3">*13–15, or 16–19 and in full-time secondary study.</p>
                  <div>
                    <label htmlFor="youngest" className={LABEL}>Age of your youngest child</label>
                    <input type="number" id="youngest" min={0} max={19} value={youngest} onChange={(e) => setYoungest(num(e.target.value, 19))} className={INPUT} />
                    {youngestInconsistent && <p className="text-xs text-ochre mt-1">Check this against the children you entered.</p>}
                  </div>
                  <label className="flex items-start gap-2 text-sm text-navy">
                    <input type="checkbox" checked={incomeSupport} onChange={(e) => setIncomeSupport(e.target.checked)} className="mt-1 accent-eucalyptus" />
                    <span>You or your partner get an income support payment (such as Parenting Payment or JobSeeker) that isn&apos;t reduced to $0</span>
                  </label>
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Estimated FTB a fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(totalFortnight, 2)}</div>
                    <div className="text-sm text-warmgray">{formatAUD(totalYear)} a year including supplements · family income {formatAUD(familyIncome)}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How we worked it out</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      {noKids ? <p className="text-warmgray">Add at least one child to estimate FTB.</p> : (
                        <>
                          <Row label="FTB Part A a fortnight" value={formatAUD(result.a.fortnightly, 2)} bold />
                          <Row label={incomeSupport ? "Maximum rate (income support payment)" : result.a.method === "max" ? `Maximum rate (income ≤ ${formatAUD(A.lowerThreshold)})` : result.a.method === "method1" ? "Maximum rate less the income test" : result.a.method === "method2" ? "Base rate (less 30c over the higher threshold)" : "Over the income limit"} value={formatAUD(result.a.annualExSupplement) + " a year"} />
                          <Row label={`Part A supplement (after the year, ATI ≤ ${formatAUD(A.supplementIncomeLimit)})`} value={formatAUD(result.a.supplement)} />
                          <div className="border-t border-sandstone-dark/20 pt-3" />
                          {result.b && result.b.eligible ? (
                            <>
                              <Row label="FTB Part B a fortnight" value={formatAUD(result.b.fortnightly, 2)} bold />
                              <Row label={family === "couple" ? `Lower earner ${formatAUD(result.secondary)} (free to ${formatAUD(B.secondaryFreeArea)})` : "Single parent — maximum rate"} value={formatAUD(result.b.annualExSupplement) + " a year"} />
                              <Row label="Part B supplement (after the year)" value={formatAUD(result.b.supplement)} />
                            </>
                          ) : (
                            <Row label="FTB Part B" value={result.b?.reason ?? "—"} />
                          )}
                          <div className="border-t border-sandstone-dark/20 pt-3" />
                          <Row label="Total a year, including supplements" value={formatAUD(totalYear)} bold highlight />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                    <strong>An estimate, on stated assumptions.</strong> Uses the {A.financialYear} rates, thresholds and tapers published by Services Australia (read {FAMILY_PAYMENT_SOURCES.verifiedOn}). Assumes 100% care of every child and that you meet the Maintenance Action Test and immunisation requirements. Not modelled: shared care, the Maintenance Income Test (child support), Rent Assistance and Energy Supplement paid with FTB, the newborn supplement, grandparent carer rules. Supplements are reduced last. FTB is paid on your income estimate and balanced after the year.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
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
        </div>
      </div>
    </div>
  );
}
