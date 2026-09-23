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
import { AUSTUDY, CENTRELINK_SOURCES, STUDENT_INCOME_TEST, YOUTH_ALLOWANCE_JOBSEEKER, YOUTH_ALLOWANCE_STUDENT, studentFortnightly, studentReduction } from "@/lib/constants/centrelink-income-test";
import { CentrelinkRelated, FONT, H2, INPUT, LABEL, LINK, NotIncluded, P, Row, TABLE_WRAP, TD, TH, clamp, source } from "./centrelink-shared";
import { STUDENT_FAQS } from "./austudy-youth-allowance-faqs";

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
const TABLE_INCOMES = [0, 300, 539, 600, 646, 700, 800, 900, 1_000, 1_200, 1_400, 1_600, 1_700];
const SOURCES_LIST = [
  source("Income tests for Austudy", CENTRELINK_SOURCES.austudyIncomeTest),
  source("How much Austudy you can get", CENTRELINK_SOURCES.austudyRates),
  source("Personal income test for Youth Allowance (students and Australian Apprentices)", CENTRELINK_SOURCES.youthAllowanceIncomeTest),
  source("How much Youth Allowance for students and apprentices you can get", CENTRELINK_SOURCES.youthAllowanceRates),
  source("Who can get Youth Allowance for students and Australian Apprentices", CENTRELINK_SOURCES.youthAllowanceEligibility),
  source("How much Youth Allowance for job seekers you can get", CENTRELINK_SOURCES.youthAllowanceJobSeekerRates),
  source("Personal income test for Youth Allowance for job seekers", CENTRELINK_SOURCES.youthAllowanceJobSeekerIncomeTest),
  source("Who can get Youth Allowance for job seekers", CENTRELINK_SOURCES.youthAllowanceJobSeekerEligibility),
];
const YJ = YOUTH_ALLOWANCE_JOBSEEKER;
const RATE_ROWS: { label: string; student: number | null; jobSeeker: number; jsCutOff: number | null }[] = [
  { label: "Single, no children, under 18, living at a parent's home", student: YA.maxFortnightly.under18AtHome, jobSeeker: YJ.maxFortnightly.under18AtHome, jsCutOff: YJ.publishedCutOff.under18AtHome },
  { label: "Single, no children, under 18, living away from home", student: YA.maxFortnightly.under18AwayFromHome, jobSeeker: YJ.maxFortnightly.under18AwayFromHome, jsCutOff: YJ.publishedCutOff.awayFromHome },
  { label: "Single, no children, 18 or older, living at a parent's home", student: YA.maxFortnightly.over18AtHome, jobSeeker: YJ.maxFortnightly.over18AtHome, jsCutOff: YJ.publishedCutOff.over18AtHome },
  { label: "Single, no children, 18 or older, living away from home", student: YA.maxFortnightly.awayFromHome, jobSeeker: YJ.maxFortnightly.over18AwayFromHome, jsCutOff: YJ.publishedCutOff.awayFromHome },
  { label: "Single, with children", student: YA.maxFortnightly.singleWithChildren, jobSeeker: YJ.maxFortnightly.singleWithChildren, jsCutOff: YJ.publishedCutOff.singleWithChildren },
  { label: "Couple, no children", student: YA.maxFortnightly.coupleNoChildren, jobSeeker: YJ.maxFortnightly.coupleNoChildren, jsCutOff: YJ.publishedCutOff.awayFromHome },
  { label: "Couple, with children", student: YA.maxFortnightly.coupleWithChildren, jobSeeker: YJ.maxFortnightly.coupleWithChildren, jsCutOff: YJ.publishedCutOff.coupleWithChildren },
  { label: "Single principal carer exempt from mutual obligations (job seekers)", student: null, jobSeeker: YJ.maxFortnightly.singlePrincipalCarerExempt, jsCutOff: YJ.publishedCutOff.singlePrincipalCarerExempt },
];

export default function AustudyYouthAllowanceCalculatorPage() {
  const [payment, setPayment] = useState<Payment>("austudy");
  const [sitKey, setSitKey] = useState(AUSTUDY_SITS[0].key);
  const [income, setIncome] = useState(800);
  const authorship = getGuideAuthorship("austudy-youth-allowance-calculator");
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
            Youth Allowance pays up to <strong>{formatAUD(YA.maxFortnightly.over18AtHome, 2)} a fortnight</strong> if you&apos;re 18 or older and live at home, and <strong>{formatAUD(YA.maxFortnightly.awayFromHome, 2)}</strong> if you live away from home; Austudy (25 and over) pays up to {formatAUD(AUSTUDY.maxFortnightly.singleNoChildren, 2)}. Students can earn {formatAUD(T.freeArea)} a fortnight before the payment reduces — 50 cents in the dollar to {formatAUD(T.band1End)}, then {formatAUD(T.band1Reduction, 2)} plus 60 cents. Enter your wages to see what you keep.
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
                      <Row label={`50c per $1 from ${formatAUD(T.freeArea)} to ${formatAUD(T.band1End)}`} value={`-${formatAUD(result.band1, 2)}`} />
                      <Row label={`60c per $1 over ${formatAUD(T.band1End)}`} value={`-${formatAUD(result.band2, 2)}`} />
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
          <section>
            <h2 style={FONT} className={H2}>How Much Is Youth Allowance? Rates by Circumstance</h2>
            <p className={P}>Maximum fortnightly rates before any income test. The same rates apply to students, Australian Apprentices and job seekers in the same situation; they index on {YOUTH_ALLOWANCE_STUDENT.indexedOn} (the job seeker principal carer rate on 20 March and 20 September).</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your circumstances</th><th scope="col" className={TH + " text-right"}>Students and apprentices</th><th scope="col" className={TH + " text-right"}>Job seekers</th><th scope="col" className={TH + " text-right"}>Job seeker cut-off</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {RATE_ROWS.map((r, i) => (
                    <tr key={r.label} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                      <td className={TD}>{r.label}</td>
                      <td className={TD + " text-right font-semibold"}>{r.student === null ? "—" : formatAUD(r.student, 2)}</td>
                      <td className={TD + " text-right"}>{formatAUD(r.jobSeeker, 2)}</td>
                      <td className={TD + " text-right"}>{r.jsCutOff === null ? "—" : formatAUD(r.jsCutOff, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Job seeker cut-offs are Services Australia&apos;s &ldquo;maximum income before your payment reduces to $0&rdquo; figures (the principal carer one includes Pharmaceutical Allowance). Job seekers&apos; payments start reducing once income passes {formatAUD(YJ.freeArea)} a fortnight — far sooner than the {formatAUD(T.freeArea)} student free area. Students on the long-term income support rate get {formatAUD(YA.maxFortnightly.longTermAtHome, 2)} at home or {formatAUD(YA.maxFortnightly.longTermAwayFromHome, 2)} away from home (table further down).</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Youth Allowance Eligibility</h2>
            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3">Students and Australian Apprentices</h3>
            <p className={P}>You must be one of the following:</p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li>18 to 24 and studying full time;</li>
              <li>16 to 24 and doing a full-time Australian Apprenticeship;</li>
              <li>16 or 17 and independent, or needing to live away from home to study;</li>
              <li>16 or 17, studying full time, having completed year 12 or equivalent.</li>
            </ul>
            <p className={P}>You also need to meet the residence rules and the income and assets tests, and be in an approved course or a full-time apprenticeship. You can stay on Youth Allowance after turning 25 until you finish that course. Full-time secondary students under 18 usually can&apos;t get it unless they qualify for the away-from-home rate, meet the independence criteria, or moved straight across from Youth Allowance as a job seeker.</p>
            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3 mt-6">Job seekers</h3>
            <p className={P}>You must be {YJ.minAge} to {YJ.maxAge}, meet the residence rules and the income test, and either be unemployed and looking for work (part-time or casual work is fine) or be sick or injured and unable to do your usual work or study for a short time. From 22 the equivalent payment is <Link href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker</Link>.</p>
            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3 mt-6">Dependent or independent — your parents&apos; income</h3>
            <p className={P}>Services Australia assesses you as dependent or independent. If you&apos;re dependent, a parental means test applies as well as your own income test: if your parents or guardians earn too much you can&apos;t be paid, and if you&apos;re under 18 your parent usually receives the payment. This calculator covers your own income test only — use the Payment Finder for the parental test. If you&apos;re 25 or older, the student payment is Austudy, which uses the same personal income test.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>The Student Personal Income Test</h2>
            <p className={P}>Austudy and Youth Allowance for students and Australian Apprentices share one personal income test. It is applied to your gross income — before tax, not including child support — when you claim and each fortnight you report.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your income per fortnight</th><th scope="col" className={TH}>Your payment reduces by</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Up to {formatAUD(T.freeArea)}</td><td className={TD}>Nothing — and you build Income Bank credits</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>{formatAUD(T.freeArea)} to {formatAUD(T.band1End)}</td><td className={TD}>50 cents for each dollar over {formatAUD(T.freeArea)}</td></tr>
                  <tr><td className={TD}>Over {formatAUD(T.band1End)}</td><td className={TD}>{formatAUD(T.band1Reduction, 2)} plus 60 cents for each dollar over {formatAUD(T.band1End)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>Searches still quote a {formatAUD(509)} free area — that was the figure before the {AUSTUDY.ratesFrom} indexation. It is {formatAUD(T.freeArea)} now.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Maximum Rates and Cut-Offs From {AUSTUDY.ratesFrom}</h2>
            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3">Austudy</h3>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation</th><th scope="col" className={TH + " text-right"}>Maximum per fortnight</th><th scope="col" className={TH + " text-right"}>Payment reaches $0 at</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {AUSTUDY_SITS.map((s, i) => (<tr key={s.key} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD}>{s.label}</td><td className={TD + " text-right"}>{formatAUD(s.rate, 2)}</td><td className={TD + " text-right"}>{formatAUD(s.cutOff, 2)}</td></tr>))}
                </tbody>
              </table>
            </div>
            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3 mt-6">Youth Allowance — students and Australian Apprentices</h3>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation</th><th scope="col" className={TH + " text-right"}>Maximum per fortnight</th><th scope="col" className={TH + " text-right"}>Payment reaches $0 at</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {YA_SITS.map((s, i) => (<tr key={s.key} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD}>{s.label}</td><td className={TD + " text-right"}>{formatAUD(s.rate, 2)}</td><td className={TD + " text-right"}>{formatAUD(s.cutOff, 2)}</td></tr>))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Rates are indexed on {AUSTUDY.indexedOn}. The long-term rate applies after 26 of the last 39 weeks on a non-student income support payment, with no dependent child, starting study or an apprenticeship after turning 22 (21 for Austudy).</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Austudy at Different Incomes (Single, No Children)</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Fortnightly wages</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>Austudy</th><th scope="col" className={TH + " text-right"}>Wages + Austudy</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_INCOMES.map((inc, i) => { const pay = studentFortnightly(AUSTUDY.maxFortnightly.singleNoChildren, inc); return (
                    <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD + " font-medium"}>{formatAUD(inc)}</td><td className={TD + " text-right"}>-{formatAUD(studentReduction(inc), 2)}</td><td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td><td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td></tr>); })}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Income Bank, and the 12-Fortnight Rule</h2>
            <p className={P}>In fortnights when you earn under {formatAUD(T.freeArea)}, the unused free area goes into your Income Bank. When a later fortnight is higher — exam-break shifts, a summer job — Services Australia draws on those credits before applying the taper, so the reduction above may not happen straight away. Once the Income Bank is empty the table applies in full. If income holds your payment at $0 for {T.cancelAfterZeroFortnights} fortnights in a row, the payment is cancelled and you must reapply.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Related Calculators and Guides</h2>
            <CentrelinkRelated current="student" />
          </section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Reduction = 50c × income between {formatAUD(T.freeArea)} and {formatAUD(T.band1End)} + 60c × income over {formatAUD(T.band1End)}. Payment = maximum rate for the situation minus the reduction, floored at $0.</li>
              <li>Thresholds, rates and cut-offs are read from one constants file verified at Services Australia on {CENTRELINK_SOURCES.verifiedOn}; tests reconcile each published cut-off to its maximum rate.</li>
              <li>Not modelled: Income Bank, parental means test, partner income test, assets test, supplements. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder for a claim estimate.</li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
            <div className="sr-only"><h3>Austudy and Youth Allowance questions and answers</h3>{STUDENT_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
            <Accordion type="multiple">
              {STUDENT_FAQS.map((f) => (<AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent><p>{f.a}</p></AccordionContent></AccordionItem>))}
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={CENTRELINK_SOURCES.verifiedOn} />
          {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
        </div>
      </div>
    </div>
  );
}
