"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import { formatAUD, formatNegAUD } from "@/lib/constants";
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
  FONT,
  H2,
  INPUT,
  LABEL,
  MARCH_2026,
  NotIncluded,
  P,
  RATE_SET_LABELS,
  RateChangeNote,
  Row,
  SEPTEMBER_2026,
  TABLE_WRAP,
  TD,
  TH,
  clamp,
  useCentrelinkRateKey,
} from "./centrelink-shared";

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

/**
 * The interactive part of /jobseeker-payment-calculator/: hero, the rates
 * table and calculator card (both read the in-force rate set). The static
 * long-form content is server-rendered (jobseeker-payment-calculator-content.tsx)
 * and passed in as `children`, so it is not part of this client bundle.
 */
export default function JobseekerPaymentCalculatorPage({ children }: { children: React.ReactNode }) {
  const [situation, setSituation] = useState<Situation>("single");
  const [income, setIncome] = useState(600);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [partnerAge, setPartnerAge] = useState<PartnerAge>("partner22ToPensionAge");

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
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">JobSeeker Payment Calculator — Rates and How Working Affects Your Payment</h1>
          <p className="text-lg text-warmgray">
            JobSeeker Payment is <strong>{formatAUD(active.maxFortnightly.single, 2)} a fortnight</strong> for a single person with no children, {formatAUD(active.maxFortnightly.singleWithChildren, 2)} with a dependent child and {formatAUD(active.maxFortnightly.partnered, 2)} each for a couple, from {active.ratesFrom}. Enter your gross fortnightly wages to see how much you keep: the first {formatAUD(T.freeArea)} is free, then it reduces by 50 cents to {formatAUD(T.band1End)} and 60 cents above.
          </p>
          <p className="mt-3 inline-block rounded-full bg-eucalyptus-light/60 px-3 py-1 text-xs font-semibold text-navy">Rates from {active.ratesFrom} · verified {CENTRELINK_SOURCES.verifiedOn}</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto" aria-labelledby="how-much-jobseeker">
          <h2 id="how-much-jobseeker" style={FONT} className={H2}>How Much Is JobSeeker Payment?</h2>
          <p className={P}>These are the maximum fortnightly rates from {active.ratesFrom}, before any reduction for income. JobSeeker is paid every two weeks, and Energy Supplement is paid on top.</p>
          <div className={TABLE_WRAP}>
            <table className="w-full text-sm">
              <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Per fortnight</th><th scope="col" className={TH + " text-right"}>Per week</th><th scope="col" className={TH + " text-right"}>Income cut-off (fortnight)</th></tr></thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {SITUATIONS.map((s, i) => (
                  <tr key={s.key} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                    <td className={TD}>{s.label}</td>
                    <td className={TD + " text-right font-semibold"}>{formatAUD(rateFor(active, s), 2)}</td>
                    <td className={TD + " text-right"}>{formatAUD(rateFor(active, s) / 2, 2)}</td>
                    <td className={TD + " text-right"}>{s.partnered ? "depends on partner income" : formatAUD(cutOffFor(active, s)!, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-warmgray-light">Services Australia&apos;s figures, indexed on {JOBSEEKER.indexedOn}; the next change is 20 March 2027. The single rate with a dependent child also applies if you are 55 or older after 9 continuous months on payment, or have a partial capacity to work of less than 15 hours a week.</p>
        </section>

        <section className="max-w-4xl mx-auto space-y-6">
          <RateChangeNote activeKey={activeKey} payment="JobSeeker" />
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much JobSeeker Do You Keep?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
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
                    <input type="range" min={0} max={2000} step={10} value={clamp(income, 0, 2000)} onChange={(e) => setIncome(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
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
                        <Row label={`40c per $1 over ${formatAUD(T.freeArea)}`} value={formatNegAUD(result.ownReduction, 2)} />
                      ) : (
                        <>
                          <Row label={`50c per $1 from ${formatAUD(T.freeArea)} to ${formatAUD(T.band1End)}`} value={formatNegAUD(Math.min(Math.max(0, income - T.freeArea), T.band1End - T.freeArea) * 0.5, 2)} />
                          <Row label={`60c per $1 over ${formatAUD(T.band1End)}`} value={formatNegAUD(Math.max(0, income - T.band1End) * 0.6, 2)} />
                        </>
                      )}
                      {sit.partnered && <Row label={`60c per $1 of partner income over ${formatAUD(result.partnerLimit)}`} value={formatNegAUD(result.partnerReduction, 2)} />}
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
          {children}
        </div>
      </div>
    </div>
  );
}
