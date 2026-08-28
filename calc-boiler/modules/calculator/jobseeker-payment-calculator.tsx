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
  CENTRELINK_SOURCES,
  JOBSEEKER,
  JOBSEEKER_INCOME_TEST,
  JOBSEEKER_RATES,
  jobseekerFortnightly,
  jobseekerReduction,
  type JobseekerRateSet,
} from "@/lib/constants/centrelink-income-test";
import {
  CentrelinkRelated,
  FONT,
  H2,
  INPUT,
  LABEL,
  LINK,
  MARCH_2026,
  NotIncluded,
  P,
  RATE_SET_LABELS,
  RATE_SET_ORDER,
  RateChangeNote,
  Row,
  SEPTEMBER_2026,
  TABLE_WRAP,
  TD,
  TH,
  clamp,
  rateColumnHeading,
  source,
  useCentrelinkRateKey,
} from "./centrelink-shared";
import { JOBSEEKER_FAQS } from "./jobseeker-payment-faqs";

// GSC to 27 Aug 2026: "jobseeker payment calculator australia" 403 impressions,
// "centrelink payment calculator when working" 455 (5.5% CTR) — all landing
// on the income-test guide, which had no calculator.
//
// 28 Aug 2026: rates index on 20 September. Both dated sets are on the page —
// the calculator applies the one in force today (resolved in the browser, see
// useCentrelinkRateKey) and every rate table carries both columns.

/** Free area and tapers — these index on 1 July, not 20 September. */
const T = JOBSEEKER_INCOME_TEST;
const MAR = JOBSEEKER_RATES[MARCH_2026];
const SEP = JOBSEEKER_RATES[SEPTEMBER_2026];

type Situation = "single" | "singleWithChild" | "singlePrincipalCarer" | "singleOver55" | "partialCapacity" | "partnered" | "principalCarerExempt";
type RateKey = keyof JobseekerRateSet["maxFortnightly"];
type CutOffKey = keyof JobseekerRateSet["publishedCutOff"];

interface SituationDef {
  key: Situation;
  label: string;
  rateKey: RateKey;
  carer: boolean;
  cutOffKey: CutOffKey | null;
  partnered?: boolean;
}

const SITUATIONS: SituationDef[] = [
  { key: "single", label: "Single, no children", rateKey: "single", carer: false, cutOffKey: "single" },
  { key: "singleWithChild", label: "Single, dependent child under 16 (not the principal carer)", rateKey: "singleWithChildren", carer: false, cutOffKey: "singleWithChildNotCarer" },
  { key: "singlePrincipalCarer", label: "Single, principal carer of a child under 16", rateKey: "singleWithChildren", carer: true, cutOffKey: "principalCarer" },
  { key: "singleOver55", label: "Single, 55 or older, 9+ months on payment", rateKey: "singleOver55LongTerm", carer: false, cutOffKey: "singleOver55LongTerm" },
  { key: "partialCapacity", label: "Single, partial capacity to work (under 15 hrs/week)", rateKey: "partialCapacity", carer: false, cutOffKey: "partialCapacity" },
  { key: "partnered", label: "Partnered", rateKey: "partnered", carer: false, cutOffKey: null, partnered: true },
  { key: "principalCarerExempt", label: "Single principal carer, exempt from mutual obligations", rateKey: "principalCarerExempt", carer: true, cutOffKey: "principalCarerExempt" },
];

const rateFor = (set: JobseekerRateSet, s: SituationDef) => set.maxFortnightly[s.rateKey];
const cutOffFor = (set: JobseekerRateSet, s: SituationDef) => (s.cutOffKey ? set.publishedCutOff[s.cutOffKey] : null);

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
  { title: CENTRELINK_SOURCES.dssRatesListTitle, url: CENTRELINK_SOURCES.dssRatesList, publisher: "Department of Social Services" },
];

export default function JobseekerPaymentCalculatorPage() {
  const [situation, setSituation] = useState<Situation>("single");
  const [income, setIncome] = useState(600);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [partnerAge, setPartnerAge] = useState<PartnerAge>("partner22ToPensionAge");
  const authorship = getGuideAuthorship("jobseeker-payment-calculator");

  // Resolved in the browser after mount, so a page built today starts paying
  // the September rates on 20 September without a redeploy.
  const activeKey = useCentrelinkRateKey();
  const active = JOBSEEKER_RATES[activeKey];
  const other = activeKey === MARCH_2026 ? SEP : MAR;
  const otherKey = activeKey === MARCH_2026 ? SEPTEMBER_2026 : MARCH_2026;

  const sit = SITUATIONS.find((s) => s.key === situation)!;
  const activeRate = rateFor(active, sit);
  const activeCutOff = cutOffFor(active, sit);

  // Every dependency is a primitive (the situation and the rate-set date are
  // both keys), so the rate sets themselves are looked up inside.
  const result = useMemo(() => {
    const s = SITUATIONS.find((x) => x.key === situation)!;
    const now = JOBSEEKER_RATES[activeKey];
    const then = JOBSEEKER_RATES[activeKey === MARCH_2026 ? SEPTEMBER_2026 : MARCH_2026];
    const partnerLimit = now.partnerIncomeLimit[partnerAge];
    const ownReduction = jobseekerReduction(income, s.carer);
    const partnerReduction = s.partnered ? Math.max(0, partnerIncome - partnerLimit) * now.partnerIncomeLimit.taper : 0;
    const payment = jobseekerFortnightly(rateFor(now, s), income, s.carer, s.partnered ? partnerIncome : 0, partnerLimit, now.partnerIncomeLimit.taper);
    const otherPayment = jobseekerFortnightly(
      rateFor(then, s),
      income,
      s.carer,
      s.partnered ? partnerIncome : 0,
      then.partnerIncomeLimit[partnerAge],
      then.partnerIncomeLimit.taper,
    );
    return { ownReduction, partnerReduction, payment, otherPayment, partnerLimit, total: payment + income };
  }, [income, partnerIncome, partnerAge, situation, activeKey]);

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
            Enter your gross fortnightly wages and see how much JobSeeker you keep. Uses the Services Australia income test — {formatAUD(T.freeArea)} free area, 50 cents to {formatAUD(T.band1End)}, 60 cents above — with both the {RATE_SET_LABELS[MARCH_2026]} maximum rates and the {RATE_SET_LABELS[SEPTEMBER_2026]} rates that replace them.
          </p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto space-y-6">
          <RateChangeNote activeKey={activeKey} payment="JobSeeker" />
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
                          {(Object.keys(PARTNER_LABELS) as PartnerAge[]).map((k) => <option key={k} value={k}>{PARTNER_LABELS[k]} — limit {formatAUD(active.partnerIncomeLimit[k])}</option>)}
                        </select>
                        <p className="text-xs text-warmgray-light mt-1">Assumes your partner does not get a pension payment. From 20 September 2026 the 22-to-pension-age limit rises to {formatAUD(SEP.partnerIncomeLimit.partner22ToPensionAge)}; the under-22 limits are unchanged.</p>
                      </div>
                    </>
                  )}
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">JobSeeker this fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.payment, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(activeRate, 2)} maximum · {formatAUD(result.total, 2)} with your wages</div>
                    <div className="text-sm text-navy mt-3 pt-3 border-t border-sandstone-dark/20">
                      {activeKey === MARCH_2026 ? "From 20 September 2026" : "To 19 September 2026 it was"}:{" "}
                      <strong>{formatAUD(result.otherPayment, 2)}</strong> on the same income ({formatAUD(rateFor(other, sit), 2)} maximum)
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the income test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label={`Maximum rate (${RATE_SET_LABELS[activeKey]})`} value={formatAUD(activeRate, 2)} bold />
                      <Row label={`Free area (first ${formatAUD(T.freeArea)})`} value="no reduction" />
                      {sit.carer ? (
                        <Row label={`40c per $1 over ${formatAUD(T.freeArea)}`} value={`-${formatAUD(result.ownReduction, 2)}`} />
                      ) : (
                        <>
                          <Row label={`50c per $1 from ${formatAUD(T.freeArea)} to ${formatAUD(T.band1End)}`} value={`-${formatAUD(Math.min(Math.max(0, income - T.freeArea), T.band1End - T.freeArea) * 0.5, 2)}`} />
                          <Row label={`60c per $1 over ${formatAUD(T.band1End)}`} value={`-${formatAUD(Math.max(0, income - T.band1End) * 0.6, 2)}`} />
                        </>
                      )}
                      {sit.partnered && <Row label={`60c per $1 of partner income over ${formatAUD(result.partnerLimit)}`} value={`-${formatAUD(result.partnerReduction, 2)}`} />}
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Payment" value={formatAUD(result.payment, 2)} bold highlight />
                      <Row label={`Payment on the ${RATE_SET_LABELS[otherKey]} rate`} value={formatAUD(result.otherPayment, 2)} />
                      {activeCutOff !== null && <Row label="Cut-off for this situation" value={formatAUD(activeCutOff, 2)} />}
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
            <p className={P}>Services Australia reduces JobSeeker once your own income passes {formatAUD(T.freeArea)} a fortnight. The free area and the tapers are not part of the September indexation — they are the same before and after 20 September 2026:</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your income per fortnight</th><th scope="col" className={TH}>Most recipients</th><th scope="col" className={TH}>Single principal carer</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Up to {formatAUD(T.freeArea)}</td><td className={TD}>$0</td><td className={TD}>$0</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>{formatAUD(T.freeArea)} to {formatAUD(T.band1End)}</td><td className={TD}>50c for each dollar</td><td className={TD}>40c for each dollar over {formatAUD(T.freeArea)}</td></tr>
                  <tr><td className={TD}>Over {formatAUD(T.band1End)}</td><td className={TD}>60c for each dollar</td><td className={TD}>40c for each dollar over {formatAUD(T.freeArea)}</td></tr>
                </tbody>
              </table>
            </div>

            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3 mt-6">Maximum rates before and after 20 September 2026</h3>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" rowSpan={2} className={TH}>Situation</th>
                    <th scope="col" colSpan={2} className={TH + " text-right"}>Maximum per fortnight</th>
                    <th scope="col" colSpan={2} className={TH + " text-right"}>Cut-off (payment reaches $0)</th>
                  </tr>
                  <tr>
                    {RATE_SET_ORDER.map((k) => <th key={`r-${k}`} scope="col" className={TH + " text-right text-xs font-medium"}>{rateColumnHeading(k)}</th>)}
                    {RATE_SET_ORDER.map((k) => <th key={`c-${k}`} scope="col" className={TH + " text-right text-xs font-medium"}>{rateColumnHeading(k)}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {SITUATIONS.map((s, i) => (
                    <tr key={s.key} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                      <td className={TD}>{s.label}</td>
                      <td className={TD + " text-right"}>{formatAUD(rateFor(MAR, s), 2)}</td>
                      <td className={TD + " text-right font-semibold"}>{formatAUD(rateFor(SEP, s), 2)}</td>
                      <td className={TD + " text-right"}>{s.partnered ? "depends on partner income" : formatAUD(cutOffFor(MAR, s)!, 2)}</td>
                      <td className={TD + " text-right font-semibold"}>{s.partnered ? "depends on partner income" : formatAUD(cutOffFor(SEP, s)!, 2)}</td>
                    </tr>
                  ))}
                  <tr className={SITUATIONS.length % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                    <td className={TD}>Partner income free area (partner 22 to Age Pension age)</td>
                    <td className={TD + " text-right"}>{formatAUD(MAR.partnerIncomeLimit.partner22ToPensionAge, 2)}</td>
                    <td className={TD + " text-right font-semibold"}>{formatAUD(SEP.partnerIncomeLimit.partner22ToPensionAge, 2)}</td>
                    <td className={TD + " text-right"} colSpan={2}>60c per $1 above it, either way</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              Rates are indexed on {JOBSEEKER.indexedOn}. The {RATE_SET_LABELS[MARCH_2026]} figures are Services Australia&apos;s, read on {CENTRELINK_SOURCES.verifiedOn}; the {RATE_SET_LABELS[SEPTEMBER_2026]} rates are from the DSS rates list published {CENTRELINK_SOURCES.dssRatesListPublished}.{" "}
              {SEP.cutOffSource === "derived" && "The September cut-offs are calculated from those published rates and the unchanged taper — Services Australia publishes its own cut-off figures on the day, and we will replace ours with them."}{" "}
              Cut-offs include an Energy Supplement (and, for some situations, a Pharmaceutical Allowance) that not every recipient gets, which is why the payment above reaches $0 slightly below them.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>JobSeeker Payment at Different Incomes (Single, No Children)</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Fortnightly wages</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>JobSeeker to 19 Sep 2026</th><th scope="col" className={TH + " text-right"}>JobSeeker from 20 Sep 2026</th><th scope="col" className={TH + " text-right"}>Wages + JobSeeker (from 20 Sep)</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_INCOMES.map((inc, i) => {
                    const payMar = jobseekerFortnightly(MAR.maxFortnightly.single, inc);
                    const paySep = jobseekerFortnightly(SEP.maxFortnightly.single, inc);
                    return (
                      <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{formatAUD(inc)}</td>
                        <td className={TD + " text-right"}>-{formatAUD(jobseekerReduction(inc), 2)}</td>
                        <td className={TD + " text-right"}>{formatAUD(payMar, 2)}</td>
                        <td className={TD + " text-right font-bold"}>{formatAUD(paySep, 2)}</td>
                        <td className={TD + " text-right"}>{formatAUD(paySep + inc, 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>Every extra dollar you earn above {formatAUD(T.band1End)} leaves you 40 cents better off before tax, and that is before working credits — so working more always adds to the total, but at a flatter slope than the wage suggests. The 20 September increase of {formatAUD(SEP.maxFortnightly.single - MAR.maxFortnightly.single, 2)} a fortnight for a single recipient flows through at every income up to the cut-off.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Working Credits</h2>
            <p className={P}>In fortnights when your income is under {formatAUD(T.workingCreditThreshold)}, you build working credits. Services Australia uses them first in a fortnight when you earn more, which can keep some payment flowing above the published cut-off. The calculator does not include them because the balance is individual — check yours in your Centrelink online account before relying on a figure here.</p>
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
              <li>Reduction = 50c × income between {formatAUD(T.freeArea)} and {formatAUD(T.band1End)} + 60c × income over {formatAUD(T.band1End)}; single principal carers 40c × income over {formatAUD(T.freeArea)}. Partner income (partner not on a pension): 60c × income over the limit for their age. The free area and tapers index on 1 July and did not change on 20 September 2026.</li>
              <li>Payment = maximum rate for the situation minus the reduction, floored at $0. Two dated rate sets are held: {RATE_SET_LABELS[MARCH_2026]} (Services Australia, read {CENTRELINK_SOURCES.verifiedOn}) and {RATE_SET_LABELS[SEPTEMBER_2026]} (DSS rates list published {CENTRELINK_SOURCES.dssRatesListPublished}). The calculator reads today&apos;s date in your browser and applies whichever set is in force, so it changes over on 20 September by itself.</li>
              <li>The {RATE_SET_LABELS[MARCH_2026]} cut-offs are Services Australia&apos;s published figures. The {RATE_SET_LABELS[SEPTEMBER_2026]} cut-offs are <strong>derived</strong> — cut-off = (typical total rate − $53) ÷ 0.6 + $256, or ÷ 0.4 + $150 for a single principal carer — because Services Australia publishes September cut-offs on the day. The same arithmetic reproduces every March 2026 published cut-off, and the tests assert it.</li>
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
