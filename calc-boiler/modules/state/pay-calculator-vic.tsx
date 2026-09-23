"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";
import { STATE_EMPLOYEE_SOURCES, STATE_PROFILES } from "@/lib/data/state-employee";
import { PAYROLL_TAX_STATES } from "@/lib/constants/payroll-tax";
import StateTakeHomeCalculator from "./state-take-home-calculator";
import { FaqAnswer } from "@/components/common/faq-accordion";
import { VIC_FAQS } from "./pay-calculator-vic-faqs";
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

const PROFILE = STATE_PROFILES.VIC;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13b, Victoria`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — Victoria", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Long Service Leave Act 2018)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "VIC payroll tax rates and thresholds (employers)", url: PAYROLL_TAX_STATES.vic.ratesUrl, publisher: PAYROLL_TAX_STATES.vic.revenueOffice },
];

export default function PayCalculatorVICPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-sandstone-dark/10 bg-eucalyptus-light/30 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator VIC</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator VIC: Your Take-Home Pay in Victoria
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">VIC</span>
          </div>
          <p className="text-lg text-warmgray">
            Put your salary in and see what actually lands in your account. This wage calculator uses
            the ATO&apos;s {SITE_CONFIG.financialYear} rates, then covers the three things that really
            are different in Victoria: the public holidays that trigger penalty rates, long service
            leave after 7 years, and the payroll tax your employer pays.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="VIC" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          {/* EMPLOYEE: what you keep */}
          <section>
            <H2>How much of a Victorian salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              On {formatAUD(typicalSalary(PROFILE))} — the average full-time wage in Victoria — you
              keep a little over three-quarters of it. Victoria has no state income tax; nobody in
              Australia does. Your income tax, Medicare levy and HECS-HELP repayment are set by the
              ATO and are identical whether you work in Melbourne, Geelong, Ballarat or Bendigo.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              The salary calculator above will redo this for your number. To see how the brackets
              stack up, read the {SITE_CONFIG.financialYear}{" "}
              <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link>, or model a
              {" "}<Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">salary sacrifice</Link> arrangement — many
              Victorian health and charity employers offer packaging that cuts taxable income.
            </p>
          </section>

          {/* EMPLOYEE: is my pay normal */}
          <section>
            <H2>Is your Victorian salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              Victoria sits just below the national average. Full-time adults here earn{" "}
              {formatAUD(PROFILE.awote.personsFullTime, 2)} a week before overtime — behind NSW and WA,
              a shade ahead of Queensland.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              If your pay is below the award floor rather than below the average, that is a different
              problem. Most Victorian private-sector employees are covered by federal modern awards —
              look yours up in the{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Australian award rates guide</Link>. Victorian
              state public sector staff (teachers, public hospital nurses, public servants) are usually
              on Victorian agreements instead.
            </p>
          </section>

          {/* EMPLOYEE: public holidays */}
          <section>
            <H2>Victorian public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              Victoria is the only state that stops for a horse race and a football match. The Friday
              before the AFL Grand Final and Melbourne Cup Day are both gazetted public holidays here
              and nowhere else, which means a Melbourne hospitality or retail worker can bank two
              penalty-rate shifts a Sydney colleague never sees.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
          </section>

          {/* EMPLOYEE: long service leave */}
          <section>
            <H2>Long service leave in Victoria</H2>
            <p className="mb-4 text-warmgray">
              This is where Victoria is genuinely more generous than most of the country. The{" "}
              {PROFILE.longServiceLeave.act} sets the qualifying period at 7 years, not the 10 years
              used in NSW, Queensland, WA, SA, Tasmania and the NT.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
          </section>

          {/* EMPLOYEE: payroll tax, framed correctly */}
          <section>
            <H2>Does VIC payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              The same goes for WorkSafe premiums and the Mental Health and Wellbeing Surcharge:
              employer costs, not payslip deductions. Employers will find both on the{" "}
              <Link href="/payroll-tax/vic/" className="text-eucalyptus-dark hover:underline">VIC payroll tax</Link> page.
              What <em>does</em> come out of your pay is set out in the{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">payslip guide</Link>.
            </p>
          </section>

          <StatePayFacts profile={PROFILE} />

          <OtherStatesNav profile={PROFILE} />

          {/* T2: employer payroll tax detail moved to /payroll-tax/vic/ */}
          <EmployerPayrollTaxLink profile={PROFILE} />


          {/* FAQ */}
          <FAQSection>
            {VIC_FAQS.map((f) => (
              <FAQItem key={f.q} value={f.q} question={f.q}><FaqAnswer faq={f} /></FAQItem>
            ))}
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, the Medicare levy, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear}; there are no state-specific individual income taxes in Australia, so the result is the same in every state. Victorian earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13b, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Long Service Leave Act 2018 as explained by {PROFILE.longServiceLeave.agency}. State payroll tax and WorkSafe data are sourced from the State Revenue Office Victoria and WorkSafe VIC, but these only outline employer obligations and do not affect employee net pay.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
