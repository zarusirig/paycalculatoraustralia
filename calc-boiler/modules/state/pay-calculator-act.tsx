import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";
import { STATE_EMPLOYEE_SOURCES, STATE_PROFILES } from "@/lib/data/state-employee";
import { PAYROLL_TAX_STATES } from "@/lib/constants/payroll-tax";
import StateTakeHomeCalculator from "./state-take-home-calculator";
import StateMinimumWage from "./state-minimum-wage";
import { FaqAnswer } from "@/components/common/faq-accordion";
import { ACT_FAQS } from "./pay-calculator-act-faqs";
import {
  AbsEarningsTable,
  FAQItem,
  FAQSection,
  ForwardLslLinks,
  H2,
  LongServiceLeaveBlock,
  OtherStatesNav,
  EmployerPayrollTaxLink,
  PayrollTaxForEmployees,
  StatePayFacts,
  PenaltyRateNote,
  PublicHolidayTable,
  WorkedExample,
  typicalSalary,
} from "./state-sections";
import FeaturedImage from "@/components/common/featured-image";

const PROFILE = STATE_PROFILES.ACT;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}), Table 13h, Australian Capital Territory`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays, Australian Capital Territory", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Long Service Leave Act 1976)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "ACT payroll tax rates and thresholds (employers)", url: PAYROLL_TAX_STATES.act.ratesUrl, publisher: PAYROLL_TAX_STATES.act.revenueOffice },
];

export default function PayCalculatorACTPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-sandstone-dark/10 bg-eucalyptus-light/30 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator ACT</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator ACT: Your Take-Home Pay in Canberra
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">ACT</span>
          </div>
          <p className="text-lg text-warmgray">
            Canberra take-home pay is your gross salary minus federal income tax and the Medicare
            levy: the Australian Capital Territory (ACT) sets no income tax of its own. Canberra has the highest
            earnings in the country and the shortest wait for long service leave. This salary
            calculator applies the ATO {SITE_CONFIG.financialYear} rates to your gross pay and shows
            your weekly, fortnightly and monthly take-home pay. The sections below cover the ACT-only
            parts: Canberra Day, Reconciliation Day, 7-year long service leave, and the public service
            super rate that makes Canberra package figures misleading.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="ACT" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <FeaturedImage placement="content" className="mt-0 mb-10" />
          <StatePayFacts profile={PROFILE} />

          <StateMinimumWage state="act" />

          <section>
            <H2>How much of a Canberra salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              The ACT does not levy income tax; nobody in Australia does except the Commonwealth. A
              Canberra public servant and a Queanbeyan retail worker are taxed on exactly the same
              scale. What is different is the level: ACT earnings are the highest in the country, so a
              larger share of Canberra salaries reach the 37% bracket. Here is the arithmetic on{" "}
              {formatAUD(typicalSalary(PROFILE))}, the average full-time wage in the ACT.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              Cross-border commuters from Queanbeyan, Yass or Bungendore are taxed identically:
              income tax follows the taxpayer, not the border. Public holidays do not: you get the
              holidays of the place you are <em>based</em> for work.
            </p>
          </section>

          <section>
            <H2>Is your Canberra salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              The ACT posts the highest full-time ordinary time earnings in Australia at{" "}
              {formatAUD(PROFILE.awote.personsFullTime, 2)} a week. It also has by some distance the
              smallest gender gap of any jurisdiction, because classified public service pay scales,
              not negotiated private rates, dominate the ACT workforce.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              The full-time rows for ordinary hours and including overtime sit close together because
              ACT workers earn very little overtime compared with the resource states. For a Canberra
              salary, base pay is nearly the whole figure.
            </p>
          </section>

          <section>
            <H2>The ACT super rate that makes package offers confusing</H2>
            <p className="mb-4 text-warmgray">
              Federal public servants under PSSap get a higher employer super rate than the standard
              SG rate, which makes Canberra package offers hard to compare. The calculator above handles
              this if you tick the package box.
            </p>
            <ul className="mb-4 space-y-2 text-sm text-warmgray">
              <li><strong>APS Superannuation</strong>: federal public servants under the PSSap scheme receive employer super contributions of <strong>15.4%</strong>, compared to the standard SG rate of 12%. This adds <strong>$3,400 per year</strong> in additional super for an employee on $100,000. Learn more in our <Link href="/superannuation-guide/" className="text-eucalyptus-dark hover:underline">Superannuation Guide</Link>.</li>
            </ul>
            <p className="text-sm text-warmgray">
              The calculator above uses the statutory guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)},
              which is what a private-sector Canberra employer pays. If you are on a higher scheme rate,
              the take-home figure is unaffected (super is paid on top of salary, not out of it), but
              the total package line will understate your package. Compare offers with the{" "}
              <Link href="/salary-package-calculator/" className="text-eucalyptus-dark hover:underline">salary package calculator</Link>.
            </p>
          </section>

          <section>
            <H2>ACT public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              The ACT has 15 gazetted public holidays, more than NSW, which surrounds it. Two are
              unique to the Territory: Canberra Day in March and Reconciliation Day, held on the first
              Monday on or after 27 May. A retail or hospitality worker in Civic therefore gets two
              penalty-rate days a year that a colleague fifteen minutes away in Queanbeyan does not.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
          </section>

          <section>
            <H2>Long service leave in the ACT</H2>
            <p className="mb-4 text-warmgray">
              ACT employees reach the long service leave entitlement faster than anywhere else in
              Australia: after 7 years, and a pro-rata payment can be owed from as little as 5. If a
              public holiday falls during your long service leave in the ACT, the leave is extended by
              a day.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              The {PROFILE.longServiceLeave.act} covers ACT private sector employees who are not
              covered by an award or agreement containing long service leave terms. Public sector staff
              are not covered by it, and the building, cleaning, community and security industries
              accrue through ACT Leave&apos;s portable schemes instead.
            </p>
          </section>

          <section>
            <H2>Does ACT payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              The ACT charges the highest general payroll tax rate in the country (6.75%, rising with
              payroll size), but only on employers with more than $1.75 million of Australian wages. The employer
              pays it, and it is not deducted from ACT wages. The{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">payslip guide</Link> lists
              the deductions that do come out of your pay.
            </p>
          </section>


          <OtherStatesNav profile={PROFILE} />

          {/* T2: employer payroll tax detail moved to /payroll-tax/act/ */}
          <EmployerPayrollTaxLink profile={PROFILE} />


          <FAQSection>
            {ACT_FAQS.map((f) => (
              <FAQItem key={f.q} value={f.q} question={f.q}><FaqAnswer faq={f} /></FAQItem>
            ))}
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, the Medicare levy, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear}; there are no territory-specific individual income taxes. ACT earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13h, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Long Service Leave Act 1976 as explained by WorkSafe ACT. ACT payroll tax data is sourced from the ACT Revenue Office and describes employer obligations only.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
