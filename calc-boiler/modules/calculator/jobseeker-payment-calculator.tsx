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
import { CENTRELINK_SOURCES, JOBSEEKER, jobseekerFortnightly, jobseekerReduction } from "@/lib/constants/centrelink-income-test";
import { CentrelinkRelated, FONT, H2, INPUT, LABEL, LINK, NotIncluded, P, Row, TABLE_WRAP, TD, TH, clamp, source } from "./centrelink-shared";
import { JOBSEEKER_FAQS } from "./jobseeker-payment-faqs";

// GSC to 27 Aug 2026: "jobseeker payment calculator australia" 403 impressions,
// "centrelink payment calculator when working" 455 (5.5% CTR) — all landing
// on the income-test guide, which had no calculator.

const J = JOBSEEKER;

type Situation = "single" | "singleWithChild" | "singlePrincipalCarer" | "singleOver55" | "partialCapacity" | "partnered" | "principalCarerExempt";
const SITUATIONS: { key: Situation; label: string; rate: number; carer: boolean; cutOff: number; partnered?: boolean }[] = [
  { key: "single", label: "Single, no children", rate: J.maxFortnightly.single, carer: false, cutOff: J.publishedCutOff.single },
  { key: "singleWithChild", label: "Single, dependent child under 16 (not the principal carer)", rate: J.maxFortnightly.singleWithChildren, carer: false, cutOff: J.publishedCutOff.singleWithChildNotCarer },
  { key: "singlePrincipalCarer", label: "Single, principal carer of a child under 16", rate: J.maxFortnightly.singleWithChildren, carer: true, cutOff: J.publishedCutOff.principalCarer },
  { key: "singleOver55", label: "Single, 55 or older, 9+ months on payment", rate: J.maxFortnightly.singleOver55LongTerm, carer: false, cutOff: J.publishedCutOff.singleOver55LongTerm },
  { key: "partialCapacity", label: "Single, partial capacity to work (under 15 hrs/week)", rate: J.maxFortnightly.partialCapacity, carer: false, cutOff: J.publishedCutOff.partialCapacity },
  { key: "partnered", label: "Partnered", rate: J.maxFortnightly.partnered, carer: false, cutOff: 0, partnered: true },
  { key: "principalCarerExempt", label: "Single principal carer, exempt from mutual obligations", rate: J.maxFortnightly.principalCarerExempt, carer: true, cutOff: J.publishedCutOff.principalCarerExempt },
];
type PartnerAge = "partner22ToPensionAge" | "partnerUnder22NoChildren" | "partnerUnder22WithChildren";
const PARTNER_LABELS: Record<PartnerAge, string> = {
  partner22ToPensionAge: "22 to Age Pension age",
  partnerUnder22NoChildren: "under 22, no children",
  partnerUnder22WithChildren: "under 22, with children",
};
const TABLE_INCOMES = [0, 100, 150, 200, 256, 300, 400, 500, 600, 800, 1_000, 1_200, 1_400, 1_500];

const SOURCES_LIST = [
  source("Income test for JobSeeker Payment", CENTRELINK_SOURCES.jobseekerIncomeTest),
  source("How much JobSeeker Payment you can get", CENTRELINK_SOURCES.jobseekerRates),
];

export default function JobseekerPaymentCalculatorPage() {
  const [situation, setSituation] = useState<Situation>("single");
  const [income, setIncome] = useState(600);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [partnerAge, setPartnerAge] = useState<PartnerAge>("partner22ToPensionAge");
  const authorship = getGuideAuthorship("jobseeker-payment-calculator");

  const sit = SITUATIONS.find((s) => s.key === situation)!;
  const result = useMemo(() => {
    const partnerLimit = J.partnerIncomeLimit[partnerAge];
    const ownReduction = jobseekerReduction(income, sit.carer);
    const partnerReduction = sit.partnered ? Math.max(0, partnerIncome - partnerLimit) * J.partnerIncomeLimit.taper : 0;
    const payment = jobseekerFortnightly(sit.rate, income, sit.carer, sit.partnered ? partnerIncome : 0, partnerLimit);
    return { ownReduction, partnerReduction, payment, partnerLimit, total: payment + income };
  }, [income, partnerIncome, partnerAge, sit]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><Link href="/centrelink-income-test/" className="hover:text-eucalyptus-dark hover:underline">Centrelink Income Test</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">JobSeeker Payment Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">JobSeeker Payment Calculator — How Working Affects Your Payment</h1>
          <p className="text-lg text-warmgray">
            Enter your gross fortnightly wages and see how much JobSeeker you keep. Uses the Services Australia income test — {formatAUD(J.incomeTest.freeArea)} free area, 50 cents to {formatAUD(J.incomeTest.band1End)}, 60 cents above — and the maximum rates from {J.ratesFrom}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much JobSeeker Do You Keep?</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="situation" className={LABEL}>Your situation</label>
                    <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as Situation)} className={INPUT}>
                      {SITUATIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="income" className={LABEL}>Your gross income this fortnight</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="income" min={0} max={5000} step={10} value={income} onChange={(e) => setIncome(clamp(Number(e.target.value || 0), 0, 5000))} className={INPUT} /></div>
                    <input type="range" min={0} max={2000} step={10} value={clamp(income, 0, 2000)} onChange={(e) => setIncome(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>
                  {sit.partnered && (
                    <>
                      <div>
                        <label htmlFor="partnerIncome" className={LABEL}>Your partner&apos;s gross income this fortnight</label>
                        <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                          <input type="number" id="partnerIncome" min={0} max={10000} step={10} value={partnerIncome} onChange={(e) => setPartnerIncome(clamp(Number(e.target.value || 0), 0, 10000))} className={INPUT} /></div>
                      </div>
                      <div>
                        <label htmlFor="partnerAge" className={LABEL}>Your partner is</label>
                        <select id="partnerAge" value={partnerAge} onChange={(e) => setPartnerAge(e.target.value as PartnerAge)} className={INPUT}>
                          {(Object.keys(PARTNER_LABELS) as PartnerAge[]).map((k) => <option key={k} value={k}>{PARTNER_LABELS[k]} — limit {formatAUD(J.partnerIncomeLimit[k])}</option>)}
                        </select>
                        <p className="text-xs text-warmgray-light mt-1">Assumes your partner does not get a pension payment.</p>
                      </div>
                    </>
                  )}
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">JobSeeker this fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.payment, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(sit.rate, 2)} maximum · {formatAUD(result.total, 2)} with your wages</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the income test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Maximum rate" value={formatAUD(sit.rate, 2)} bold />
                      <Row label={`Free area (first ${formatAUD(J.incomeTest.freeArea)})`} value="no reduction" />
                      {sit.carer ? (
                        <Row label={`40c per $1 over ${formatAUD(J.incomeTest.freeArea)}`} value={`-${formatAUD(result.ownReduction, 2)}`} />
                      ) : (
                        <>
                          <Row label={`50c per $1 from ${formatAUD(J.incomeTest.freeArea)} to ${formatAUD(J.incomeTest.band1End)}`} value={`-${formatAUD(Math.min(Math.max(0, income - J.incomeTest.freeArea), J.incomeTest.band1End - J.incomeTest.freeArea) * 0.5, 2)}`} />
                          <Row label={`60c per $1 over ${formatAUD(J.incomeTest.band1End)}`} value={`-${formatAUD(Math.max(0, income - J.incomeTest.band1End) * 0.6, 2)}`} />
                        </>
                      )}
                      {sit.partnered && <Row label={`60c per $1 of partner income over ${formatAUD(result.partnerLimit)}`} value={`-${formatAUD(result.partnerReduction, 2)}`} />}
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Payment" value={formatAUD(result.payment, 2)} bold highlight />
                      {!sit.partnered && <Row label="Published cut-off for this situation" value={formatAUD(sit.cutOff, 2)} />}
                    </div>
                  </div>
                  <NotIncluded items={["working credits", "the assets test", "Rent Assistance, Energy Supplement and Pharmaceutical Allowance (which is why the published cut-off sits a little above where this payment reaches $0)", "partners who get a pension"]} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 style={FONT} className={H2}>JobSeeker Income Test Rates and Thresholds</h2>
            <p className={P}>Services Australia reduces JobSeeker once your own income passes {formatAUD(J.incomeTest.freeArea)} a fortnight. The taper depends on whether you are a single principal carer:</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your income per fortnight</th><th scope="col" className={TH}>Most recipients</th><th scope="col" className={TH}>Single principal carer</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Up to {formatAUD(J.incomeTest.freeArea)}</td><td className={TD}>$0</td><td className={TD}>$0</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>{formatAUD(J.incomeTest.freeArea)} to {formatAUD(J.incomeTest.band1End)}</td><td className={TD}>50c for each dollar</td><td className={TD}>40c for each dollar over {formatAUD(J.incomeTest.freeArea)}</td></tr>
                  <tr><td className={TD}>Over {formatAUD(J.incomeTest.band1End)}</td><td className={TD}>60c for each dollar</td><td className={TD}>40c for each dollar over {formatAUD(J.incomeTest.freeArea)}</td></tr>
                </tbody>
              </table>
            </div>
            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3 mt-6">Maximum rates from {J.ratesFrom}</h3>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation</th><th scope="col" className={TH + " text-right"}>Maximum per fortnight</th><th scope="col" className={TH + " text-right"}>Published cut-off</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {SITUATIONS.map((s, i) => (
                    <tr key={s.key} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                      <td className={TD}>{s.label}</td>
                      <td className={TD + " text-right"}>{formatAUD(s.rate, 2)}</td>
                      <td className={TD + " text-right"}>{s.partnered ? `${formatAUD(1_414.67, 2)} less your income` : formatAUD(s.cutOff, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Rates are indexed on {J.indexedOn}. Cut-offs are the fortnightly income at which the payment reaches $0 and include supplements not all recipients get.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>JobSeeker Payment at Different Incomes (Single, No Children)</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Fortnightly wages</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>JobSeeker</th><th scope="col" className={TH + " text-right"}>Wages + JobSeeker</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_INCOMES.map((inc, i) => {
                    const pay = jobseekerFortnightly(J.maxFortnightly.single, inc);
                    return (
                      <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{formatAUD(inc)}</td>
                        <td className={TD + " text-right"}>-{formatAUD(jobseekerReduction(inc), 2)}</td>
                        <td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td>
                        <td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>Every extra dollar you earn above {formatAUD(J.incomeTest.band1End)} leaves you 40 cents better off before tax, and that is before working credits — so working more always adds to the total, but at a flatter slope than the wage suggests.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Working Credits</h2>
            <p className={P}>In fortnights when your income is under {formatAUD(J.incomeTest.workingCreditThreshold)}, you build working credits. Services Australia uses them first in a fortnight when you earn more, which can keep some payment flowing above the published cut-off. The calculator does not include them because the balance is individual — check yours in your Centrelink online account before relying on a figure here.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>What Counts as Income, and When</h2>
            <p className={P}>Gross wages in the fortnight they are paid — before tax, salary sacrifice or HECS. Commission, bonuses, overtime and penalty rates count too. Your <Link href="/fortnightly-pay-calculator/" className={LINK}>fortnightly gross</Link> is the figure to enter, and JobSeeker itself is taxable, so put the wages and the payment together through the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link> to see the year.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Related Calculators and Guides</h2>
            <CentrelinkRelated current="jobseeker" />
          </section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Reduction = 50c × income between {formatAUD(J.incomeTest.freeArea)} and {formatAUD(J.incomeTest.band1End)} + 60c × income over {formatAUD(J.incomeTest.band1End)}; single principal carers 40c × income over {formatAUD(J.incomeTest.freeArea)}. Partner income (partner not on a pension): 60c × income over the limit for their age.</li>
              <li>Payment = maximum rate for the situation minus the reduction, floored at $0. Maximum rates and thresholds read from one constants file verified at Services Australia on {CENTRELINK_SOURCES.verifiedOn}; tests reconcile the published cut-offs to those rates.</li>
              <li>Not modelled: working credits, assets test, Rent Assistance and other supplements, partners receiving a pension. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder for a claim estimate.</li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
            <div className="sr-only"><h3>JobSeeker payment questions and answers</h3>{JOBSEEKER_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
            <Accordion type="multiple">
              {JOBSEEKER_FAQS.map((f) => (<AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent><p>{f.a}</p></AccordionContent></AccordionItem>))}
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={CENTRELINK_SOURCES.verifiedOn} />
          {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
        </div>
      </div>
    </div>
  );
}
