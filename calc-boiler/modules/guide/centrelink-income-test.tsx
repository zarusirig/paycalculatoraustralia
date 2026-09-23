import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { CENTRELINK_INCOME_TEST_FAQS } from "./centrelink-income-test-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import { AGE_PENSION, AGE_PENSION_RATES, AUSTUDY, CENTRELINK_SOURCES, JOBSEEKER, JOBSEEKER_RATES, MARCH_2026, SEPTEMBER_2026, STUDENT_INCOME_TEST, WORK_BONUS, YOUTH_ALLOWANCE_STUDENT, jobseekerFortnightly, jobseekerReduction } from "@/lib/constants/centrelink-income-test";
import { FAMILY_PAYMENT_SOURCES, FTB_A, FTB_B, PARENTING_PAYMENT, RENT_ASSISTANCE, ppsFreeArea } from "@/lib/constants/centrelink-family-payments";
import { CARER_ALLOWANCE } from "@/lib/constants/centrelink-carer-and-support";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
const SOURCES_LIST: SourceLink[] = [
  { title: "Income test for pensions", url: "https://www.servicesaustralia.gov.au/income-test-for-age-pension", publisher: SOURCES.servicesAustralia.name },
  { title: "Income test for JobSeeker Payment", url: "https://www.servicesaustralia.gov.au/income-test-for-jobseeker-payment", publisher: SOURCES.servicesAustralia.name },
  { title: "Working Credit", url: "https://www.servicesaustralia.gov.au/working-credit", publisher: SOURCES.servicesAustralia.name },
  { title: "Assets test", url: "https://www.servicesaustralia.gov.au/assets-test-for-age-pension", publisher: SOURCES.servicesAustralia.name },
  { title: CENTRELINK_SOURCES.dssRatesListTitle, url: CENTRELINK_SOURCES.dssRatesList, publisher: "Department of Social Services" },
  { title: "Income and assets tests for Parenting Payment", url: FAMILY_PAYMENT_SOURCES.parentingPaymentIncomeTest, publisher: SOURCES.servicesAustralia.name },
  { title: "Income test for FTB Part A", url: FAMILY_PAYMENT_SOURCES.ftbAIncomeTest, publisher: SOURCES.servicesAustralia.name },
  { title: "How much Rent Assistance you can get", url: FAMILY_PAYMENT_SOURCES.rentAssistanceRates, publisher: SOURCES.servicesAustralia.name },
];

// JobSeeker and pension rates index on 20 September 2026. The hub carries both
// dated sets side by side rather than switching: a reader checking a payment
// dated before 20 September needs the March figures, and this page is static
// copy (no client date resolution — that lives in the calculators).
const JS_MAR = JOBSEEKER_RATES[MARCH_2026];
const JS_SEP = JOBSEEKER_RATES[SEPTEMBER_2026];
const AP_MAR = AGE_PENSION_RATES[MARCH_2026];
const AP_SEP = AGE_PENSION_RATES[SEPTEMBER_2026];

export default function CentrelinkIncomeTestPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Centrelink Income Test</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Centrelink Income Test Guide</h1><p className="text-xl text-warmgray leading-relaxed mb-6">How your income affects Centrelink payments like JobSeeker, Parenting Payment, Family Tax Benefit, Youth Allowance and Age Pension. Understand income thresholds, taper rates, and how to estimate your entitlement.</p><TrustBar className="!max-w-none" /></header>
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ── H2 1: What Is the Centrelink Income Test? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Centrelink Income Test?</h2>
            <p>The Centrelink income test is a means-testing formula that reduces your social security payment as your assessable income rises above a set &ldquo;free area&rdquo; threshold. Services Australia applies this test to every income-support payment including JobSeeker Payment, Youth Allowance, Age Pension, Parenting Payment, Austudy, and Disability Support Pension.</p>
            <p>The test operates on a <strong>fortnightly</strong> reporting cycle. You report your gross employment income every 14 days, and Centrelink calculates your adjusted payment before the next pay run. Two separate means tests exist &mdash; the <strong>income test</strong> and the <strong>assets test</strong> &mdash; and your payment is set at the lower result of the two. Understanding both is essential for estimating your actual entitlement.</p>
            <p>The Australian tax calculator treats Centrelink payments as assessable income for tax purposes. Your payment amount directly affects your <Link href="/take-home-pay-calculator/">take-home pay</Link>, so knowing the income test thresholds helps you plan part-time work alongside your benefit.</p>
          </section>

{/* ── Calculators (added 2026-08-28: spokes for the payment types this hub was catching) ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>Work Out Your Own Payment</h2>
            <p className="text-warmgray mb-4">One page cannot hold every payment&apos;s rules, so each has its own calculator built on the figures Services Australia published for {CENTRELINK_SOURCES.verifiedOn}:</p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray">
              <li><Link href="/jobseeker-payment-calculator/" className="text-eucalyptus-dark hover:underline font-medium">JobSeeker payment calculator</Link> &mdash; what you keep when you work, with partner income and the {formatAUD(JOBSEEKER.incomeTest.freeArea)} / 50c / 60c test.</li>
              <li><Link href="/austudy-youth-allowance-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Austudy and Youth Allowance calculator</Link> &mdash; the student income test: {formatAUD(STUDENT_INCOME_TEST.freeArea)} free area, 50c to {formatAUD(STUDENT_INCOME_TEST.band1End)}, then {formatAUD(STUDENT_INCOME_TEST.band1Reduction, 2)} plus 60c.</li>
              <li><Link href="/age-pension-income-test-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Age Pension income test calculator</Link> &mdash; single and couple tests with the {formatAUD(WORK_BONUS.fortnightlyCredit)}-a-fortnight Work Bonus applied.</li>
              <li><Link href="/parenting-payment-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Parenting Payment calculator</Link> &mdash; single ({formatAUD(PARENTING_PAYMENT.single.maxFortnightly, 2)}, 40c over {formatAUD(ppsFreeArea(1), 2)}) and partnered ({formatAUD(PARENTING_PAYMENT.partnered.maxFortnightly, 2)}), with your partner&apos;s income.</li>
              <li><Link href="/family-tax-benefit-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Family Tax Benefit calculator</Link> &mdash; FTB Part A and Part B on your family income for {FTB_A.financialYear}.</li>
              <li><Link href="/rent-assistance-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Rent Assistance calculator</Link> &mdash; 75c for each dollar of rent over the threshold, up to {formatAUD(RENT_ASSISTANCE.rows.single.max, 2)} a fortnight single.</li>
              {/* W3 Centrelink wave 2 (2026-09-23) */}
              <li><Link href="/carer-payment-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Carer Payment calculator</Link> &mdash; the pension income test, the 100-hours-in-4-weeks work rule and the assets limits.</li>
              <li><Link href="/carer-allowance/" className="text-eucalyptus-dark hover:underline font-medium">Carer Allowance</Link> &mdash; {formatAUD(CARER_ALLOWANCE.fortnightly, 2)} a fortnight, not reduced by wages under the {formatAUD(CARER_ALLOWANCE.incomeLimit)} family income limit.</li>
              <li><Link href="/parental-leave-pay/" className="text-eucalyptus-dark hover:underline font-medium">Paid Parental Leave calculator</Link> &mdash; 26 weeks from 1 July 2026, the income and work tests, and super.</li>
              <li><Link href="/centrelink-advance-payment/" className="text-eucalyptus-dark hover:underline font-medium">Centrelink advance payment calculator</Link> &mdash; how much you can get early and the advance &divide; 13 repayment.</li>
              <li><Link href="/centrelink-payment-dates/" className="text-eucalyptus-dark hover:underline font-medium">Centrelink payment dates</Link> &mdash; how the fortnightly payment and reporting cycle works, and the Christmas date changes.</li>
              <li><Link href="/centrelink-crisis-payment/" className="text-eucalyptus-dark hover:underline font-medium">Crisis Payment</Link> &mdash; one week of your payment&apos;s basic rate after an extreme circumstance.</li>
              <li><Link href="/centrelink-debt/" className="text-eucalyptus-dark hover:underline font-medium">Centrelink debt</Link> &mdash; how a wrong income report becomes an overpayment, refunds and the income apportionment scheme.</li>
              <li><Link href="/cost-of-living-payment-2026/" className="text-eucalyptus-dark hover:underline font-medium">Cost of living payment 2026</Link> &mdash; there isn&apos;t one; what exists instead.</li>
              {/* end W3 */}
            </ul>
            <div className="not-prose my-6 rounded-xl border border-ochre/40 bg-ochre/10 p-4 text-sm text-navy">
              <strong>Rates changed on 20 September 2026.</strong> JobSeeker, Parenting Payment, Rent Assistance and the pensions are indexed on 20 March and 20 September. The figures on this page are given for both sides of the change: what was paid to 19 September 2026 (keep these for any payslip or Centrelink letter dated before then) and what is paid from 20 September 2026 &mdash; re-verified at Services Australia on {CENTRELINK_SOURCES.verifiedOn}. Single JobSeeker went from {formatAUD(JS_MAR.maxFortnightly.single, 2)} to {formatAUD(JS_SEP.maxFortnightly.single, 2)} a fortnight and the single Age Pension from {formatAUD(AP_MAR.maxFortnightly.single.total, 2)} to {formatAUD(AP_SEP.maxFortnightly.single.total, 2)}. Student payments &mdash; Austudy and Youth Allowance &mdash; index on 1 January, and Family Tax Benefit on 1 July.
            </div>
          </section>

          {/* ── H2 2: How Does the Income Test Work? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Income Test Work?</h2>
            <p>The Centrelink income test reduces your payment by a fixed number of cents for every dollar you earn above the free area &mdash; this reduction rate is the <strong>taper rate</strong>. Below the free area, your payment remains at the full maximum rate with no reduction.</p>
            <p>Most working-age payments use a <strong>two-stage taper</strong>. JobSeeker Payment, for example, applies a <strong>50-cent</strong> taper for each dollar earned between <strong>$150</strong> and <strong>$256</strong> per fortnight, then increases to a <strong>60-cent</strong> taper for every dollar above <strong>$256</strong>. The Age Pension uses a single <strong>50-cent</strong> taper above its free area of <strong>$226</strong> per fortnight for singles.</p>
            <p>Your payment reaches <strong>$0</strong> (the &ldquo;cut-off point&rdquo;) once your income exceeds the level where the taper fully absorbs the maximum payment. For a single JobSeeker recipient with no children on the {formatAUD(JS_MAR.maxFortnightly.single, 2)} maximum paid to 19 September 2026, the published cut-off is {formatAUD(JS_MAR.publishedCutOff.single, 2)} a fortnight; from 20 September 2026 the maximum rises to {formatAUD(JS_SEP.maxFortnightly.single, 2)} and the cut-off with it, to {formatAUD(JS_SEP.publishedCutOff.single, 2)}. Earning above that amount means your fortnightly JobSeeker drops to nil.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Income Free Area?</h3>
            <p>The &ldquo;Income Free Area&rdquo; is the amount you earn each fortnight before any reduction applies. For JobSeeker and Youth Allowance (job seeker), the free area is <strong>$150 per fortnight</strong>. For Age Pension (single), it is <strong>$226 per fortnight</strong>. For Parenting Payment Single, it is <strong>$202.60 per fortnight</strong>. Earning at or below the free area means your Centrelink payment stays at the full rate.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Taper Rate?</h3>
            <p>The taper rate determines how quickly your payment reduces per dollar of income above the free area. A <strong>50-cent taper</strong> means you lose 50 cents of payment for every $1 earned. A <strong>60-cent taper</strong> means you lose 60 cents. Parenting Payment Single uses a gentler <strong>40-cent taper</strong>, reflecting the policy goal of encouraging single parents to re-enter the workforce. You can use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to estimate the combined effect of income tax and taper-rate reductions on your take-home pay.</p>
          </section>

{/* ── H2 3: Income Test Thresholds Table — every figure from lib/constants/centrelink-income-test.ts ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>Current Income Test Thresholds and Rates</h2>
            <p className="text-warmgray mb-4">Free areas, tapers, maximum fortnightly rates and the cut-off (the income at which the payment reaches $0) for the main payments. Verified at Services Australia on {CENTRELINK_SOURCES.verifiedOn}; JobSeeker and Age Pension are indexed on {JOBSEEKER.indexedOn}, the student payments on {AUSTUDY.indexedOn}. The last column carries the <strong>20 September 2026</strong> figures, published in the DSS rates list on {CENTRELINK_SOURCES.dssRatesListPublished} &mdash; the March rates in the columns before it are the ones actually paid until 19 September 2026.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Free area (per fortnight)</th><th className="px-5 py-3">Taper</th><th className="px-5 py-3">Maximum rate (from)</th><th className="px-5 py-3">Cut-off</th><th className="px-5 py-3">From 20 Sep 2026 (max / cut-off)</th></tr></thead><tbody>
              <tr><td className="px-5 py-3">JobSeeker Payment (single, no children)</td><td className="px-5 py-3">{formatAUD(JOBSEEKER.incomeTest.freeArea)}</td><td className="px-5 py-3">50c to {formatAUD(JOBSEEKER.incomeTest.band1End)}, then 60c</td><td className="px-5 py-3">{formatAUD(JS_MAR.maxFortnightly.single, 2)} ({JS_MAR.ratesFrom})</td><td className="px-5 py-3">{formatAUD(JS_MAR.publishedCutOff.single, 2)}</td><td className="px-5 py-3">{formatAUD(JS_SEP.maxFortnightly.single, 2)} / {formatAUD(JS_SEP.publishedCutOff.single, 2)}</td></tr>
              <tr><td className="px-5 py-3">JobSeeker Payment (single principal carer)</td><td className="px-5 py-3">{formatAUD(JOBSEEKER.incomeTest.freeArea)}</td><td className="px-5 py-3">40c per $1</td><td className="px-5 py-3">{formatAUD(JS_MAR.maxFortnightly.singleWithChildren, 2)} ({JS_MAR.ratesFrom})</td><td className="px-5 py-3">{formatAUD(JS_MAR.publishedCutOff.principalCarer, 2)}</td><td className="px-5 py-3">{formatAUD(JS_SEP.maxFortnightly.singleWithChildren, 2)} / {formatAUD(JS_SEP.publishedCutOff.principalCarer, 2)}</td></tr>
              <tr><td className="px-5 py-3">JobSeeker Payment (partnered)</td><td className="px-5 py-3">{formatAUD(JOBSEEKER.incomeTest.freeArea)}</td><td className="px-5 py-3">50c to {formatAUD(JOBSEEKER.incomeTest.band1End)}, then 60c; partner income 60c over {formatAUD(JOBSEEKER.partnerIncomeLimit.partner22ToPensionAge)}</td><td className="px-5 py-3">{formatAUD(JS_MAR.maxFortnightly.partnered, 2)} ({JS_MAR.ratesFrom})</td><td className="px-5 py-3">depends on partner income</td><td className="px-5 py-3">{formatAUD(JS_SEP.maxFortnightly.partnered, 2)} / partner free area {formatAUD(JS_SEP.partnerIncomeLimit.partner22ToPensionAge)}</td></tr>
              <tr><td className="px-5 py-3">Austudy (single, no children)</td><td className="px-5 py-3">{formatAUD(STUDENT_INCOME_TEST.freeArea)}</td><td className="px-5 py-3">50c to {formatAUD(STUDENT_INCOME_TEST.band1End)}, then 60c</td><td className="px-5 py-3">{formatAUD(AUSTUDY.maxFortnightly.singleNoChildren, 2)} ({AUSTUDY.ratesFrom})</td><td className="px-5 py-3">{formatAUD(AUSTUDY.publishedCutOff.singleOrCoupleNoChildren, 2)}</td><td className="px-5 py-3">no change &mdash; indexes 1 January</td></tr>
              <tr><td className="px-5 py-3">Youth Allowance, student (single, away from home)</td><td className="px-5 py-3">{formatAUD(STUDENT_INCOME_TEST.freeArea)}</td><td className="px-5 py-3">50c to {formatAUD(STUDENT_INCOME_TEST.band1End)}, then 60c</td><td className="px-5 py-3">{formatAUD(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome, 2)} ({YOUTH_ALLOWANCE_STUDENT.ratesFrom})</td><td className="px-5 py-3">{formatAUD(YOUTH_ALLOWANCE_STUDENT.publishedCutOff.awayFromHome, 2)}</td><td className="px-5 py-3">no change &mdash; indexes 1 January</td></tr>
              <tr><td className="px-5 py-3">Youth Allowance, student (single, 18+, at home)</td><td className="px-5 py-3">{formatAUD(STUDENT_INCOME_TEST.freeArea)}</td><td className="px-5 py-3">50c to {formatAUD(STUDENT_INCOME_TEST.band1End)}, then 60c</td><td className="px-5 py-3">{formatAUD(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.over18AtHome, 2)} ({YOUTH_ALLOWANCE_STUDENT.ratesFrom})</td><td className="px-5 py-3">{formatAUD(YOUTH_ALLOWANCE_STUDENT.publishedCutOff.over18AtHome, 2)}</td><td className="px-5 py-3">no change &mdash; indexes 1 January</td></tr>
              <tr><td className="px-5 py-3">Age Pension (single)</td><td className="px-5 py-3">{formatAUD(AGE_PENSION.incomeTest.single.freeArea)}</td><td className="px-5 py-3">50c per $1</td><td className="px-5 py-3">{formatAUD(AP_MAR.maxFortnightly.single.total, 2)} ({AP_MAR.ratesFrom})</td><td className="px-5 py-3">{formatAUD(AP_MAR.publishedCutOff.single, 2)}</td><td className="px-5 py-3">{formatAUD(AP_SEP.maxFortnightly.single.total, 2)} / {formatAUD(AP_SEP.publishedCutOff.single, 2)}</td></tr>
              <tr><td className="px-5 py-3">Age Pension (couple, combined)</td><td className="px-5 py-3">{formatAUD(AGE_PENSION.incomeTest.couple.freeArea)}</td><td className="px-5 py-3">25c per $1 off each pension</td><td className="px-5 py-3">{formatAUD(AP_MAR.maxFortnightly.coupleCombined.total, 2)} combined ({AP_MAR.ratesFrom})</td><td className="px-5 py-3">{formatAUD(AP_MAR.publishedCutOff.coupleCombined, 2)} combined</td><td className="px-5 py-3">{formatAUD(AP_SEP.maxFortnightly.coupleCombined.total, 2)} / {formatAUD(AP_SEP.publishedCutOff.coupleCombined, 2)} combined</td></tr>
            </tbody></table></div></div>
            <p className="text-warmgray mb-4 mt-3 text-xs">Cut-offs for JobSeeker and the student payments include the Energy Supplement, which not every recipient gets, so the payment in our calculators reaches $0 slightly below them. Age Pension totals already include the Pension and Energy Supplements. All cut-offs are Services Australia&apos;s published figures (the {JS_SEP.ratesFrom} ones re-checked on {CENTRELINK_SOURCES.verifiedOn}). Parenting Payment, Family Tax Benefit and Rent Assistance are in the next section; Carer Payment uses the same pension income test as the Age Pension &mdash; see the <Link href="/carer-payment-calculator/">Carer Payment calculator</Link>. Disability Support Pension is not covered here &mdash; check its Services Australia page.</p>
          </section>

          {/* ── C4 (2026-09-23): family payments spokes ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>Parenting Payment, Family Tax Benefit and Rent Assistance</h2>
            <p className="text-warmgray mb-4">Three more payments that change with your pay. Parenting Payment and Rent Assistance move on 20 March and 20 September; Family Tax Benefit is set per financial year and tested on your family&apos;s <em>yearly</em> adjusted taxable income rather than fortnightly wages. Verified at Services Australia on {FAMILY_PAYMENT_SOURCES.verifiedOn}.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Maximum</th><th className="px-5 py-3">Income test</th><th className="px-5 py-3">Calculator</th></tr></thead><tbody>
              <tr><td className="px-5 py-3">Parenting Payment Single</td><td className="px-5 py-3">{formatAUD(PARENTING_PAYMENT.single.maxFortnightly, 2)} a fortnight (from {PARENTING_PAYMENT.ratesFrom})</td><td className="px-5 py-3">40c per $1 over {formatAUD(ppsFreeArea(1), 2)} (1 child, +{formatAUD(PARENTING_PAYMENT.single.freeAreaPerExtraChild, 2)} each extra); cut-off {formatAUD(PARENTING_PAYMENT.single.publishedCutOffOneChild, 2)}</td><td className="px-5 py-3"><Link href="/parenting-payment-calculator/">Parenting Payment</Link></td></tr>
              <tr><td className="px-5 py-3">Parenting Payment Partnered</td><td className="px-5 py-3">{formatAUD(PARENTING_PAYMENT.partnered.maxFortnightly, 2)} a fortnight</td><td className="px-5 py-3">50c {formatAUD(150)}&ndash;{formatAUD(256)}, then 60c; partner 60c over {formatAUD(PARENTING_PAYMENT.partnered.partnerIncomeFreeArea, 2)}</td><td className="px-5 py-3"><Link href="/parenting-payment-calculator/">Parenting Payment</Link></td></tr>
              <tr><td className="px-5 py-3">FTB Part A ({FTB_A.financialYear})</td><td className="px-5 py-3">{formatAUD(FTB_A.maxFortnightly.age0to12, 2)} per child 0&ndash;12, {formatAUD(FTB_A.maxFortnightly.age13to19, 2)} per teen</td><td className="px-5 py-3">20c per $1 over {formatAUD(FTB_A.lowerThreshold)} to the base rate; 30c over {formatAUD(FTB_A.higherThreshold)}</td><td className="px-5 py-3"><Link href="/family-tax-benefit-calculator/">Family Tax Benefit</Link></td></tr>
              <tr><td className="px-5 py-3">FTB Part B ({FTB_B.financialYear})</td><td className="px-5 py-3">{formatAUD(FTB_B.maxFortnightly.youngestUnder5, 2)} (youngest under 5), {formatAUD(FTB_B.maxFortnightly.youngest5to18, 2)} (5&ndash;18)</td><td className="px-5 py-3">Higher earner &le; {formatAUD(FTB_B.primaryEarnerLimit)}; lower earner 20c over {formatAUD(FTB_B.secondaryFreeArea)}</td><td className="px-5 py-3"><Link href="/family-tax-benefit-calculator/">Family Tax Benefit</Link></td></tr>
              <tr><td className="px-5 py-3">Rent Assistance</td><td className="px-5 py-3">{formatAUD(RENT_ASSISTANCE.rows.single.max, 2)} single; {formatAUD(RENT_ASSISTANCE.rows.singleFamily1or2.max, 2)} family, 1&ndash;2 children (from {RENT_ASSISTANCE.ratesFrom})</td><td className="px-5 py-3">75c per $1 of rent over {formatAUD(RENT_ASSISTANCE.rows.single.threshold, 2)} (single); part of the payment it comes with</td><td className="px-5 py-3"><Link href="/rent-assistance-calculator/">Rent Assistance</Link></td></tr>
            </tbody></table></div></div>
          </section>

          {/* ── H2 4: What Counts as Assessable Income? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Counts as Assessable Income for Centrelink?</h2>
            <p>Assessable income for Centrelink purposes includes <strong>all gross employment income</strong>, investment returns, and certain other receipts &mdash; broadly any money that increases your capacity to support yourself.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Income Types That Are Counted</h3>
            <ul>
              <li><strong>Employment income</strong> &mdash; wages, salary, commissions, bonuses, overtime, and penalty rates paid by an employer</li>
              <li><strong>Self-employment income</strong> &mdash; net business profit after allowable deductions</li>
              <li><strong>Investment income</strong> &mdash; bank interest, share dividends, managed fund distributions, and rental income</li>
              <li><strong>Overseas income</strong> &mdash; any income earned from overseas sources, converted to AUD</li>
              <li><strong>Superannuation income streams</strong> &mdash; account-based pensions and annuity payments if you are of Age Pension age</li>
              <li><strong>Deemed income</strong> &mdash; income assumed from financial assets using the deeming rate, regardless of actual returns earned</li>
              <li><strong>Director fees and trust distributions</strong> &mdash; payments received as a company director or trust beneficiary</li>
            </ul>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Income Types That Are Not Counted</h3>
            <ul>
              <li>Lump-sum leave payments on termination of employment</li>
              <li>Child support payments you receive</li>
              <li>Certain compensation payments (e.g., workers&apos; compensation periodic payments are treated separately)</li>
              <li>Family Tax Benefit payments</li>
              <li>Rent Assistance</li>
              <li>Energy Supplement payments</li>
            </ul>
            <p>Salary sacrifice arrangements require special attention. Any pre-tax salary sacrifice to superannuation reduces your gross employment income reported to Centrelink, potentially keeping your payment higher. Our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link> explains how concessional contributions interact with both employer SG rate obligations and Centrelink reporting.</p>
          </section>

          {/* ── H2 5: How Does the Assets Test Interact? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Assets Test Interact with the Income Test?</h2>
            <p>Services Australia applies <strong>both</strong> an income test and an assets test to your Centrelink claim, then pays you the <strong>lower</strong> of the two results. You must pass both tests to receive the full payment rate.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Homeowner &mdash; Full Pension Limit</th><th className="px-5 py-3 text-right">Non-Homeowner &mdash; Full Pension Limit</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Single</td><td className="px-5 py-3 text-right">$314,000</td><td className="px-5 py-3 text-right">$566,000</td></tr>
              <tr><td className="px-5 py-3">Couple (combined)</td><td className="px-5 py-3 text-right">$470,000</td><td className="px-5 py-3 text-right">$722,000</td></tr>
            </tbody></table></div></div>
            <p>Assets above the full-pension limit reduce the Age Pension by <strong>$3.00 per fortnight</strong> for every <strong>$1,000</strong> of assets above the threshold (single rate) or <strong>$1.50 each</strong> for couples. The assets test does not count your principal home, but it does count superannuation balances if you have reached Age Pension age.</p>
            <p>Working-age payments use a separate allowance assets test with a single cut-off rather than a taper. For <Link href="/parenting-payment-calculator/">Parenting Payment</Link>, the payment stops when assets exceed <strong>{formatAUD(PARENTING_PAYMENT.assetLimits.singleHomeowner)}</strong> for a single homeowner or <strong>{formatAUD(PARENTING_PAYMENT.assetLimits.singleNonHomeowner)}</strong> for a non-homeowner ({formatAUD(PARENTING_PAYMENT.assetLimits.coupleHomeowner)} and {formatAUD(PARENTING_PAYMENT.assetLimits.coupleNonHomeowner)} for a couple, combined); JobSeeker and Youth Allowance list their limits on their own Services Australia pages. Understanding how both tests interact helps you decide whether to draw down savings, adjust your superannuation balance through <Link href="/superannuation-calculator/">Superannuation Calculator</Link> modelling, or restructure investments before claiming.</p>
          </section>

{/* ── H2: JobSeeker worked example — computed by jobseekerFortnightly, cannot drift ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>How Much JobSeeker Do You Keep with Part-Time Work?</h2>
            <p className="text-warmgray mb-4">A single person on JobSeeker with no children who earns <strong>{formatAUD(600)} a fortnight</strong> keeps <strong>{formatAUD(jobseekerFortnightly(JS_MAR.maxFortnightly.single, 600), 2)}</strong> of the {formatAUD(JS_MAR.maxFortnightly.single, 2)} maximum, for {formatAUD(600 + jobseekerFortnightly(JS_MAR.maxFortnightly.single, 600), 2)} in total before tax. The reduction does not change on 20 September &mdash; only the maximum rate does &mdash; so from {JS_SEP.ratesFrom} the same fortnight keeps {formatAUD(jobseekerFortnightly(JS_SEP.maxFortnightly.single, 600), 2)}:</p>
            <ol className="list-decimal pl-6 space-y-1 text-warmgray">
              <li>Maximum rate from {JS_MAR.ratesFrom}: <strong>{formatAUD(JS_MAR.maxFortnightly.single, 2)}</strong> (from {JS_SEP.ratesFrom}: <strong>{formatAUD(JS_SEP.maxFortnightly.single, 2)}</strong>)</li>
              <li>First {formatAUD(JOBSEEKER.incomeTest.freeArea)} &mdash; free area, no reduction</li>
              <li>{formatAUD(JOBSEEKER.incomeTest.freeArea)} to {formatAUD(JOBSEEKER.incomeTest.band1End)} at 50c: <strong>{formatAUD((JOBSEEKER.incomeTest.band1End - JOBSEEKER.incomeTest.freeArea) * 0.5, 2)}</strong></li>
              <li>{formatAUD(JOBSEEKER.incomeTest.band1End)} to {formatAUD(600)} at 60c: <strong>{formatAUD((600 - JOBSEEKER.incomeTest.band1End) * 0.6, 2)}</strong></li>
              <li>Total reduction <strong>{formatAUD(jobseekerReduction(600), 2)}</strong>; payment <strong>{formatAUD(jobseekerFortnightly(JS_MAR.maxFortnightly.single, 600), 2)}</strong>, or <strong>{formatAUD(jobseekerFortnightly(JS_SEP.maxFortnightly.single, 600), 2)}</strong> from {JS_SEP.ratesFrom}</li>
            </ol>
            <p className="text-warmgray mb-4 mt-3">Working credits built up in low-income fortnights are used before this test applies, so the first higher fortnight after a quiet stretch often keeps more. Try your own figures in the <Link href="/jobseeker-payment-calculator/" className="text-eucalyptus-dark hover:underline font-medium">JobSeeker payment calculator</Link>, then put wages and payment together through the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">take-home pay calculator</Link> &mdash; JobSeeker is taxable.</p>
          </section>

          {/* ── H2 7: How to Report Income ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Report Income to Centrelink?</h2>
            <p>You report your gross employment income to Centrelink every <strong>14 days</strong> on your designated reporting day, using one of four channels: the myGov app, the Centrelink online account, the Express Plus app, or by phone on <strong>13 28 50</strong>.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step Reporting Process</h3>
            <ol>
              <li><strong>Log in to myGov</strong> and navigate to your linked Centrelink account</li>
              <li><strong>Select &ldquo;Report Employment Income&rdquo;</strong> from the Payments and Claims menu</li>
              <li><strong>Enter your gross income</strong> for the reporting period &mdash; this is your total pay before tax, Medicare levy, or salary sacrifice deductions</li>
              <li><strong>Declare any other income</strong> such as bank interest, rental income, or overseas income received during the fortnight</li>
              <li><strong>Confirm hours worked</strong> &mdash; Centrelink requires both the dollar amount and the total hours for mutual obligation tracking</li>
              <li><strong>Submit your report</strong> before 7:00 pm AEST on your reporting day to avoid payment delays</li>
            </ol>
            <p>Failing to report on time suspends your payment. If you miss your reporting day, submit as soon as possible &mdash; late reports are processed the next business day. Deliberately underreporting income results in a Centrelink debt, and Services Australia applies a <strong>10% recovery fee</strong> on debts caused by false reporting.</p>
            <p>Employers now report payroll data to the ATO through &ldquo;Single Touch Payroll&rdquo; (STP), and Centrelink cross-references this data against your self-reported figures. Discrepancies trigger automated reviews. Our <Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> guide explains which payslip figure to use when reporting to Centrelink.</p>
          </section>

{/* ── H2: Current rates and indexation dates — from constants, replaces the FY2025-26 "what changed" table ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>Current Maximum Rates and Indexation Dates</h2>
            <p className="text-warmgray mb-4">JobSeeker and pension rates move on 20 March and 20 September; student payments on 1 January. The middle column is what was paid to 19 September 2026; the last column is the <strong>20 September 2026</strong> indexation, in force now, published in the DSS rates list on {CENTRELINK_SOURCES.dssRatesListPublished} and verified here on {CENTRELINK_SOURCES.verifiedOn}. Keep the March figures for any payslip or Centrelink letter dated before 20 September.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Rates from</th><th className="px-5 py-3">Maximum per fortnight</th><th className="px-5 py-3">From 20 September 2026</th></tr></thead><tbody>
              <tr><td className="px-5 py-3">JobSeeker Payment</td><td className="px-5 py-3">{JS_MAR.ratesFrom}</td><td className="px-5 py-3">Single {formatAUD(JS_MAR.maxFortnightly.single, 2)}; single with a child, 55+ after 9 months, or partial capacity {formatAUD(JS_MAR.maxFortnightly.singleWithChildren, 2)}; partnered {formatAUD(JS_MAR.maxFortnightly.partnered, 2)}</td><td className="px-5 py-3">Single {formatAUD(JS_SEP.maxFortnightly.single, 2)}; single with a child, 55+ or partial capacity {formatAUD(JS_SEP.maxFortnightly.singleWithChildren, 2)}; partnered {formatAUD(JS_SEP.maxFortnightly.partnered, 2)}</td></tr>
              <tr><td className="px-5 py-3">Austudy</td><td className="px-5 py-3">{AUSTUDY.ratesFrom}</td><td className="px-5 py-3">Single or partnered, no children {formatAUD(AUSTUDY.maxFortnightly.singleNoChildren, 2)}; single with children {formatAUD(AUSTUDY.maxFortnightly.singleWithChildren, 2)}; partnered with children {formatAUD(AUSTUDY.maxFortnightly.coupleWithChildren, 2)}</td><td className="px-5 py-3">No change &mdash; Austudy indexes on 1 January</td></tr>
              <tr><td className="px-5 py-3">Youth Allowance (students / apprentices)</td><td className="px-5 py-3">{YOUTH_ALLOWANCE_STUDENT.ratesFrom}</td><td className="px-5 py-3">From {formatAUD(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.under18AtHome, 2)} (under 18, at home) to {formatAUD(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome, 2)} (away from home); {formatAUD(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.singleWithChildren, 2)} single with children</td><td className="px-5 py-3">No change &mdash; Youth Allowance indexes on 1 January</td></tr>
              <tr><td className="px-5 py-3">Age Pension</td><td className="px-5 py-3">{AP_MAR.ratesFrom}</td><td className="px-5 py-3">Single {formatAUD(AP_MAR.maxFortnightly.single.total, 2)}; couple {formatAUD(AP_MAR.maxFortnightly.coupleEach.total, 2)} each ({formatAUD(AP_MAR.maxFortnightly.coupleCombined.total, 2)} combined), including supplements</td><td className="px-5 py-3">Single {formatAUD(AP_SEP.maxFortnightly.single.total, 2)}; couple {formatAUD(AP_SEP.maxFortnightly.coupleEach.total, 2)} each ({formatAUD(AP_SEP.maxFortnightly.coupleCombined.total, 2)} combined)</td></tr>
              <tr><td className="px-5 py-3">Work Bonus (pensioners)</td><td className="px-5 py-3">ongoing</td><td className="px-5 py-3">{formatAUD(WORK_BONUS.fortnightlyCredit)} credit a fortnight; balance up to {formatAUD(WORK_BONUS.maxBalance)}</td><td className="px-5 py-3">No change &mdash; set in legislation, not indexed in September</td></tr>
            </tbody></table></div></div>
            <p className="text-warmgray mb-4 mt-3">The taper rates &mdash; 50 and 60 cents for allowances, 40 cents for single principal carers, 50 cents (single) and 25 cents each (couple) for pensions &mdash; are unchanged by the September indexation, and so are the free areas ({formatAUD(JOBSEEKER.incomeTest.freeArea)} for JobSeeker, {formatAUD(AGE_PENSION.incomeTest.single.freeArea)} for a single pensioner), which index on 1 July. It is the maximum rates that move on 20 September, and the cut-offs move with them. The JobSeeker and Age Pension calculators hold both dated sets and switch over on the day.</p>
          </section>

          {/* ── CONTEXT BORDER ── */}

{/* ── H2: Working Credit — kept to what Services Australia states ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{fontFamily: "'Bricolage Grotesque', sans-serif"}}>How Does Working Credit Help You Keep More of Your Payment?</h2>
            <p className="text-warmgray mb-4">Working credits build in fortnights when your employment income is under {formatAUD(JOBSEEKER.incomeTest.workingCreditThreshold)}. When a later fortnight is higher, Services Australia applies those credits to your income first, so you can still get some payment even above the published cut-off. Students on Austudy or Youth Allowance have the equivalent Income Bank, which builds while income is under {formatAUD(STUDENT_INCOME_TEST.freeArea)}; pensioners have the <Link href="/age-pension-income-test-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Work Bonus</Link>. Your balance is shown in your Centrelink online account &mdash; none of our calculators assume one.</p>
          </section>

          {/* ── H2 10: Related Resources ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
            <p>These tools and guides help you model the combined impact of Centrelink income testing, Australian income tax, and employer obligations on your take-home pay and salary planning.</p>
            <ul>
              <li><Link href="/jobseeker-payment-calculator/" className="text-eucalyptus-dark hover:underline font-medium">JobSeeker Payment Calculator</Link> &mdash; what you keep of JobSeeker when you work part-time</li>
              <li><Link href="/austudy-youth-allowance-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Austudy &amp; Youth Allowance Calculator</Link> &mdash; the student income test with current rates</li>
              <li><Link href="/age-pension-income-test-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Age Pension Income Test Calculator</Link> &mdash; single and couple tests with the Work Bonus</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; estimate your after-tax income including Centrelink payments in your total assessable income</li>
              <li><Link href="/tax-brackets/">Tax Brackets Guide</Link> &mdash; view the FY{SITE_CONFIG.financialYear} marginal tax rates that apply to your combined employment and Centrelink income</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> &mdash; calculate PAYG withholding on your employment income, including the Medicare levy and surcharge thresholds</li>
              <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; check how your employer&apos;s SG rate contributions affect your retirement savings alongside Centrelink entitlements</li>
              <li><Link href="/parenting-payment-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Parenting Payment Calculator</Link> &mdash; single and partnered, with the 40c single-parent taper</li>
              <li><Link href="/family-tax-benefit-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Family Tax Benefit Calculator</Link> &mdash; FTB Part A and Part B on your family income</li>
              <li><Link href="/rent-assistance-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Rent Assistance Calculator</Link> &mdash; Centrelink Rent Assistance for your rent</li>
              {/* W3 */}
              <li><Link href="/carer-payment-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Carer Payment Calculator</Link> &mdash; rates, income test and work hours for carers</li>
              <li><Link href="/centrelink-debt/" className="text-eucalyptus-dark hover:underline font-medium">Centrelink Debt</Link> &mdash; overpayments from income reporting, refunds and repayment options</li>
              {/* end W3 */}
              <li><Link href="/parental-leave-pay/">Paid Parental Leave Calculator</Link> &mdash; government-funded parental leave: weeks, pay, income and work tests</li>
              <li><Link href="/low-income-tax-offset/">Low Income Tax Offset Guide</Link> &mdash; find out if you qualify for the LITO, which reduces tax for Australians earning under $66,667</li>
            </ul>
          </section>

          {/* ── H2 11: FAQs ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <FaqAccordion faqs={CENTRELINK_INCOME_TEST_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Income thresholds and taper rates sourced from Services Australia. Rates are indexed twice yearly (20 March and 20 September). Payment rates reflect the most recent indexation. The Australian tax calculator and income test thresholds are updated each financial year to align with ATO and Services Australia data.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("centrelink-income-test"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/jobseeker-payment-calculator/" label="JobSeeker Payment Calculator" /><SidebarLink href="/austudy-youth-allowance-calculator/" label="Austudy &amp; Youth Allowance Calculator" /><SidebarLink href="/age-pension-income-test-calculator/" label="Age Pension Income Test Calculator" /><SidebarLink href="/parenting-payment-calculator/" label="Parenting Payment Calculator" /><SidebarLink href="/family-tax-benefit-calculator/" label="Family Tax Benefit Calculator" /><SidebarLink href="/rent-assistance-calculator/" label="Rent Assistance Calculator" /><SidebarLink href="/carer-payment-calculator/" label="Carer Payment Calculator" /><SidebarLink href="/carer-allowance/" label="Carer Allowance" /><SidebarLink href="/centrelink-advance-payment/" label="Centrelink Advance Payment" /><SidebarLink href="/centrelink-payment-dates/" label="Centrelink Payment Dates" /><SidebarLink href="/centrelink-crisis-payment/" label="Crisis Payment" /><SidebarLink href="/centrelink-debt/" label="Centrelink Debt" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /><SidebarLink href="/parental-leave-pay/" label="Paid Parental Leave Calculator" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/low-income-tax-offset/" label="Low Income Tax Offset Guide" /><SidebarLink href="/superannuation-calculator/" label="Superannuation Calculator" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
