"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import { AUSTUDY, CENTRELINK_SOURCES, STUDENT_INCOME_TEST, YOUTH_ALLOWANCE_JOBSEEKER, YOUTH_ALLOWANCE_STUDENT, studentFortnightly, studentReduction } from "@/lib/constants/centrelink-income-test";
import { FONT, INPUT, LABEL, NotIncluded, Row, clamp } from "./centrelink-shared";

// GSC to 27 Aug 2026: "services australia austudy income test taper rate 50
// cents 60 cents" and variants — 2,455 visible impressions at pos 7.5 with
// zero clicks, landing on the income-test guide. Searchers were quoting last
// year's $509 free area; it is $539 from 1 January 2026.

const T = STUDENT_INCOME_TEST;
type Payment = "austudy" | "youthAllowance";
interface Sit { key: string; label: string; rate: number; cutOff: number }
const AUSTUDY_SITS: Sit[] = [
  { key: "a-single", label: "Single, no children", rate: AUSTUDY.maxFortnightly.singleNoChildren, cutOff: AUSTUDY.publishedCutOff.singleOrCoupleNoChildren },
  { key: "a-single-kids", label: "Single, with children", rate: AUSTUDY.maxFortnightly.singleWithChildren, cutOff: AUSTUDY.publishedCutOff.singleWithChildren },
  { key: "a-couple", label: "Partnered, no children", rate: AUSTUDY.maxFortnightly.coupleNoChildren, cutOff: AUSTUDY.publishedCutOff.singleOrCoupleNoChildren },
  { key: "a-couple-kids", label: "Partnered, with children", rate: AUSTUDY.maxFortnightly.coupleWithChildren, cutOff: AUSTUDY.publishedCutOff.coupleWithChildren },
  { key: "a-lt-single", label: "Single, no children — long-term income support rate", rate: AUSTUDY.maxFortnightly.longTermSingleNoChildren, cutOff: AUSTUDY.publishedCutOff.longTermSingleNoChildren },
  { key: "a-lt-couple", label: "Partnered, no children — long-term income support rate", rate: AUSTUDY.maxFortnightly.longTermCoupleNoChildren, cutOff: AUSTUDY.publishedCutOff.longTermCoupleNoChildren },
];
const YA = YOUTH_ALLOWANCE_STUDENT;
const YA_SITS: Sit[] = [
  { key: "y-u18-home", label: "Single, under 18, living at parents' home", rate: YA.maxFortnightly.under18AtHome, cutOff: YA.publishedCutOff.under18AtHome },
  { key: "y-u18-away", label: "Single, under 18, living away from home", rate: YA.maxFortnightly.under18AwayFromHome, cutOff: YA.publishedCutOff.awayFromHome },
  { key: "y-18-home", label: "Single, 18 or older, living at parents' home", rate: YA.maxFortnightly.over18AtHome, cutOff: YA.publishedCutOff.over18AtHome },
  { key: "y-away", label: "Single or partnered, no children, living away from home", rate: YA.maxFortnightly.awayFromHome, cutOff: YA.publishedCutOff.awayFromHome },
  { key: "y-single-kids", label: "Single, with children", rate: YA.maxFortnightly.singleWithChildren, cutOff: YA.publishedCutOff.singleWithChildren },
  { key: "y-couple-kids", label: "Partnered, with children", rate: YA.maxFortnightly.coupleWithChildren, cutOff: YA.publishedCutOff.coupleWithChildren },
  { key: "y-lt-home", label: "Long-term rate, living at home", rate: YA.maxFortnightly.longTermAtHome, cutOff: YA.publishedCutOff.longTermAtHome },
  { key: "y-lt-away", label: "Long-term rate, living away from home", rate: YA.maxFortnightly.longTermAwayFromHome, cutOff: YA.publishedCutOff.longTermAwayFromHome },
];
const YJ = YOUTH_ALLOWANCE_JOBSEEKER;

/**
 * The interactive part of /austudy-youth-allowance-calculator/: hero and
 * calculator card. The static long-form content is server-rendered
 * (austudy-youth-allowance-calculator-content.tsx) and passed in as
 * `children`, so it is not part of this client bundle.
 */
export default function AustudyYouthAllowanceCalculatorPage({ children }: { children: React.ReactNode }) {
  const [payment, setPayment] = useState<Payment>("austudy");
  const [sitKey, setSitKey] = useState(AUSTUDY_SITS[0].key);
  const [income, setIncome] = useState(800);
  const sits = payment === "austudy" ? AUSTUDY_SITS : YA_SITS;
  const sit = sits.find((s) => s.key === sitKey) ?? sits[0];
  const result = useMemo(() => {
    const reduction = studentReduction(income);
    const pay = studentFortnightly(sit.rate, income);
    return { reduction, pay, total: pay + income, band1: Math.min(Math.max(0, income - T.freeArea), T.band1End - T.freeArea) * T.taper1, band2: Math.max(0, income - T.band1End) * T.taper2 };
  }, [income, sit]);

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
              <li><span className="font-medium text-navy" aria-current="page">Austudy &amp; Youth Allowance Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Youth Allowance and Austudy Calculator — Rates, Eligibility and Income Test</h1>
          <p className="text-lg text-warmgray">
            A youth allowance calculation applies the student personal income test to the maximum fortnightly rate: income up to {formatAUD(T.freeArea)} is free, the payment falls {Math.round(T.taper1 * 100)} cents per dollar from {formatAUD(T.freeArea)} to {formatAUD(T.band1End)}, then by {formatAUD(T.band1Reduction, 2)} plus {Math.round(T.taper2 * 100)} cents per dollar above {formatAUD(T.band1End)}. On the <a href={CENTRELINK_SOURCES.youthAllowanceRates} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">{YA.ratesFrom} rates</a>, a student living away from home starts at <strong>{formatAUD(YA.maxFortnightly.awayFromHome, 2)} a fortnight</strong> and reaches $0 at {formatAUD(YA.publishedCutOff.awayFromHome, 2)}; living at home from 18 the maximum is {formatAUD(YA.maxFortnightly.over18AtHome, 2)}, and Austudy (25 and over) pays up to {formatAUD(AUSTUDY.maxFortnightly.singleNoChildren, 2)}. Enter your wages to see what you keep.
          </p>
          <p className="mt-3 inline-block rounded-full bg-eucalyptus-light/60 px-3 py-1 text-xs font-semibold text-navy">Student rates from {AUSTUDY.ratesFrom} · job seeker rates from {YJ.ratesFrom} · verified {CENTRELINK_SOURCES.verifiedOn}</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much Do You Keep When You Work?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="payment" className={LABEL}>Payment</label>
                    <select id="payment" value={payment} onChange={(e) => { const p = e.target.value as Payment; setPayment(p); setSitKey(p === "austudy" ? AUSTUDY_SITS[0].key : YA_SITS[0].key); }} className={INPUT}>
                      <option value="austudy">Austudy</option>
                      <option value="youthAllowance">Youth Allowance (student or Australian Apprentice)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sit" className={LABEL}>Your situation</label>
                    <select id="sit" value={sit.key} onChange={(e) => setSitKey(e.target.value)} className={INPUT}>
                      {sits.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="income" className={LABEL}>Your gross income this fortnight</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="income" min={0} max={5000} step={10} value={income} onChange={(e) => setIncome(clamp(Number(e.target.value || 0), 0, 5000))} className={INPUT} /></div>
                    <input type="range" min={0} max={2200} step={10} value={clamp(income, 0, 2200)} onChange={(e) => setIncome(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>
                </form>
                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">{payment === "austudy" ? "Austudy" : "Youth Allowance"} this fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.pay, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(sit.rate, 2)} maximum · {formatAUD(result.total, 2)} with your wages</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the income test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Maximum rate" value={formatAUD(sit.rate, 2)} bold />
                      <Row label={`Free area (first ${formatAUD(T.freeArea)})`} value="no reduction" />
                      <Row label={`50c per $1 from ${formatAUD(T.freeArea)} to ${formatAUD(T.band1End)}`} value={formatNegAUD(result.band1, 2)} />
                      <Row label={`60c per $1 over ${formatAUD(T.band1End)}`} value={formatNegAUD(result.band2, 2)} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Payment" value={formatAUD(result.pay, 2)} bold highlight />
                      <Row label="Published cut-off for this situation" value={formatAUD(sit.cutOff, 2)} />
                    </div>
                  </div>
                  <NotIncluded items={["Income Bank credits", "the parental means test (dependent students)", "the partner income test and assets test", "Youth Allowance for job seekers (a different income test — rates and cut-offs are in the table below)", "Rent Assistance and Energy Supplement (the published cut-off sits a little above where this payment reaches $0 for that reason)"]} />
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
