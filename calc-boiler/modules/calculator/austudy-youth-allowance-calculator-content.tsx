// The static long-form content on /austudy-youth-allowance-calculator/, below
// the calculator card. Server component, so it ships as HTML; the client module
// (austudy-youth-allowance-calculator.tsx) renders it via `children`.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, formatNegAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import { AUSTUDY, CENTRELINK_SOURCES, STUDENT_INCOME_TEST, YOUTH_ALLOWANCE_JOBSEEKER, YOUTH_ALLOWANCE_STUDENT, studentFortnightly, studentReduction } from "@/lib/constants/centrelink-income-test";
import { CentrelinkRelated } from "./centrelink-shared";
import { STUDENT_FAQS } from "./austudy-youth-allowance-faqs";

// Same values as the class-name constants and helper in centrelink-shared.tsx,
// which is a "use client" module (its non-component exports cannot be read here).
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

const T = STUDENT_INCOME_TEST;
// Same situations as in austudy-youth-allowance-calculator.tsx.
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

export default function AustudyYouthAllowanceCalculatorContent() {
  const authorship = getGuideAuthorship("austudy-youth-allowance-calculator");
  return (
    <>
      <section id="how-to-use">
        <h2 style={FONT} className={H2}>How to Use This Youth Allowance Estimator</h2>
        <p className={P}><strong>What to enter.</strong> Your gross wages per fortnight (before tax), whether you are a student or Australian Apprentice or a job seeker, and whether you live at home or away from home. Those answers set the maximum rate the estimate starts from: {formatAUD(YA.maxFortnightly.over18AtHome, 2)} at home from 18, {formatAUD(YA.maxFortnightly.awayFromHome, 2)} away from home, {formatAUD(AUSTUDY.maxFortnightly.singleNoChildren, 2)} for Austudy (25 and over) and {formatAUD(YJ.maxFortnightly.over18AwayFromHome, 2)} for a job seeker of 18 or more living away from home.</p>
        <p className={P}><strong>How the estimate is produced.</strong> The calculator applies the student personal income test to that maximum: nothing comes off the first {formatAUD(T.freeArea)} a fortnight, {Math.round(T.taper1 * 100)} cents per dollar comes off between {formatAUD(T.freeArea)} and {formatAUD(T.band1End)}, and {formatAUD(T.band1Reduction, 2)} plus {Math.round(T.taper2 * 100)} cents per dollar comes off above {formatAUD(T.band1End)}, as set out in the <a href={CENTRELINK_SOURCES.youthAllowanceIncomeTest} target="_blank" rel="noopener noreferrer" className={LINK}>Services Australia personal income test</a>.</p>
        <p className={P}><strong>What it does not model.</strong> The parental income test for dependants, which can reduce the payment before your own income is counted. An existing <a href="#income-bank" className={LINK}>Income Bank</a> balance, which delays the taper in a high-earning fortnight. Rent Assistance, which is paid on top of the rate shown. Partner income, which has its own test.</p>
        <p className={P}><strong>How it compares with the Services Australia finder.</strong> The <a href="https://www.servicesaustralia.gov.au/payment-and-service-finder" target="_blank" rel="noopener noreferrer" className={LINK}>Payment and Service Finder</a> checks eligibility across every payment from your answers; this page shows the income-test arithmetic for one payment so you can check the fortnightly amount on your statement.</p>
        <p className={P}><strong>When the figures change.</strong> Student rates index on {AUSTUDY.indexedOn}; the rates here apply from {AUSTUDY.ratesFrom} and the constants behind the calculator are re-verified at each indexation (last verified {CENTRELINK_SOURCES.verifiedOn}). The output is an estimate, not a statement that you are eligible.</p>
      </section>

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
                <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD + " font-medium"}>{formatAUD(inc)}</td><td className={TD + " text-right"}>{formatNegAUD(studentReduction(inc), 2)}</td><td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td><td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td></tr>); })}
            </tbody>
          </table>
        </div>
      </section>

      <section id="income-bank">
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
    </>
  );
}
