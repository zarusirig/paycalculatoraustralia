// The static long-form content on /jobseeker-payment-calculator/, below the
// calculator card. Server component, so it ships as HTML; the client module
// (jobseeker-payment-calculator.tsx) renders it via `children`.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, formatNegAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  CENTRELINK_SOURCES,
  JOBSEEKER,
  JOBSEEKER_INCOME_TEST,
  JOBSEEKER_RATES,
  MARCH_2026,
  RATE_SET_LABELS,
  SEPTEMBER_2026,
  jobseekerFortnightly,
  jobseekerReduction,
  type JobseekerRateSet,
  type RateSetKey,
} from "@/lib/constants/centrelink-income-test";
import { CentrelinkRelated } from "./centrelink-shared";
import { JOBSEEKER_FAQS } from "./jobseeker-payment-faqs";

// Same values as the class-name constants and helpers in centrelink-shared.tsx,
// which is a "use client" module (its non-component exports cannot be read here).
const H2 = "text-2xl font-semibold text-navy mb-4";
const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

const RATE_SET_ORDER: readonly RateSetKey[] = [MARCH_2026, SEPTEMBER_2026];

/** Column heading for a dated rate set: "To 19 Sep 2026" / "From 20 Sep 2026". */
function rateColumnHeading(key: RateSetKey): string {
  return key === MARCH_2026 ? "To 19 Sep 2026" : "From 20 Sep 2026";
}

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

/** Free area and tapers — these index on 1 July, not 20 September. */
const T = JOBSEEKER_INCOME_TEST;
const MAR = JOBSEEKER_RATES[MARCH_2026];
const SEP = JOBSEEKER_RATES[SEPTEMBER_2026];

// Same situations as in jobseeker-payment-calculator.tsx.
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

const TABLE_INCOMES = [0, 100, 150, 200, 256, 300, 400, 500, 600, 800, 1_000, 1_200, 1_400, 1_500];

const SOURCES_LIST = [
  source("Income test for JobSeeker Payment", CENTRELINK_SOURCES.jobseekerIncomeTest),
  source("How much JobSeeker Payment you can get", CENTRELINK_SOURCES.jobseekerRates),
  { title: CENTRELINK_SOURCES.dssRatesListTitle, url: CENTRELINK_SOURCES.dssRatesList, publisher: "Department of Social Services" },
];

export default function JobseekerPaymentCalculatorContent() {
  const authorship = getGuideAuthorship("jobseeker-payment-calculator");
  return (
    <>
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
          Rates are indexed on {JOBSEEKER.indexedOn}. The {RATE_SET_LABELS[MARCH_2026]} figures are Services Australia&apos;s, read on {CENTRELINK_SOURCES.marchSetReadOn}; the {RATE_SET_LABELS[SEPTEMBER_2026]} rates are from the DSS rates list published {CENTRELINK_SOURCES.dssRatesListPublished}.{" "}
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
                    <td className={TD + " text-right"}>{formatNegAUD(jobseekerReduction(inc), 2)}</td>
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
        <h2 style={FONT} className={H2}>Who Can Get JobSeeker Payment</h2>
        <p className={P}>JobSeeker Payment (it replaced Newstart Allowance, so it is still often called the JobSeeker allowance) is the main Centrelink payment for people of working age who are looking for work. To get it you must:</p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
          <li>be between 22 and Age Pension age;</li>
          <li>meet the residence rules, and the income and assets tests;</li>
          <li>be unemployed and looking for work — which includes working part-time or casually, being temporarily stood down, or having your hours cut — <em>or</em> be sick or injured and unable to do your usual work or study for a short time (with a medical certificate).</li>
        </ul>
        <p className={P}>Under 22? Look at <Link href="/austudy-youth-allowance-calculator/" className={LINK}>Youth Allowance</Link>. Single and caring for a child under 14? <Link href="/parenting-payment-calculator/" className={LINK}>Parenting Payment</Link> pays more and tapers more gently. If you rent privately you may also get <Link href="/rent-assistance-calculator/" className={LINK}>Rent Assistance</Link> with your JobSeeker.</p>
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
        <h2 style={FONT} className={H2}>Other Centrelink Payment Calculators</h2>
        <CentrelinkRelated current="jobseeker" />
      </section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Reduction = 50c × income between {formatAUD(T.freeArea)} and {formatAUD(T.band1End)} + 60c × income over {formatAUD(T.band1End)}; single principal carers 40c × income over {formatAUD(T.freeArea)}. Partner income (partner not on a pension): 60c × income over the limit for their age. The free area and tapers index on 1 July and did not change on 20 September 2026.</li>
          <li>Payment = maximum rate for the situation minus the reduction, floored at $0. Two dated rate sets are held: {RATE_SET_LABELS[MARCH_2026]} (Services Australia, read {CENTRELINK_SOURCES.marchSetReadOn}) and {RATE_SET_LABELS[SEPTEMBER_2026]} (DSS rates list published {CENTRELINK_SOURCES.dssRatesListPublished}). The calculator reads today&apos;s date in your browser and applies whichever set is in force, so it changes over on 20 September by itself.</li>
          <li>Both sets of cut-offs are Services Australia&apos;s published figures; the {RATE_SET_LABELS[SEPTEMBER_2026]} ones were re-checked on its income test page on {CENTRELINK_SOURCES.verifiedOn}. Each reconciles to cut-off = (typical total rate − $53) ÷ 0.6 + $256, or ÷ 0.4 + $150 for a single principal carer, to within a cent — the tests assert it.</li>
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
    </>
  );
}
