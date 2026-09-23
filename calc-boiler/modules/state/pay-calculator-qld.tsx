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

const PROFILE = STATE_PROFILES.QLD;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13c, Queensland`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — Queensland", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Industrial Relations Act 2016)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "QLD payroll tax rates and thresholds (employers)", url: PAYROLL_TAX_STATES.qld.ratesUrl, publisher: PAYROLL_TAX_STATES.qld.revenueOffice },
];

export default function PayCalculatorQLDPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-sandstone-dark/10 bg-eucalyptus-light/30 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator QLD</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator QLD: Your Take-Home Pay in Queensland
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">QLD</span>
          </div>
          <p className="text-lg text-warmgray">
            Type in your gross salary and this wage calculator returns the net figure using ATO{" "}
            {SITE_CONFIG.financialYear} rates. Below it, the parts of your pay that really are
            Queensland-specific: a public holiday calendar with two part-days and a Brisbane-only show
            day, long service leave under the Industrial Relations Act, and payroll tax you do not pay.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="QLD" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <section>
            <H2>How much of a Queensland salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              Queensland has no state income tax, and never has. The deductions on a Brisbane payslip
              are the same ones on a Perth payslip. Here is the arithmetic on{" "}
              {formatAUD(typicalSalary(PROFILE))}, the average full-time wage in Queensland.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              Queensland has a larger share of shift, mining and FIFO work than most states, so the
              ordinary-time figure often understates real earnings. If overtime is a regular part of
              your pay, run it through the{" "}
              <Link href="/overtime-pay-calculator/" className="text-eucalyptus-dark hover:underline">overtime pay calculator</Link> — overtime
              is taxed at your marginal rate, which the calculator above reports.
            </p>
          </section>

          <section>
            <H2>Is your Queensland salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              Queensland sits fractionally behind Victoria on ordinary time earnings but ahead of it
              once overtime is counted — the resources and construction sectors do that. Compare the
              first two rows of the table below: the gap between them is the biggest of any eastern
              state.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Most Queensland private-sector workers are on federal modern awards; state and local
              government employees are covered by Queensland industrial instruments instead. Look up
              your minimum in the{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">award rates guide</Link>, or read the{" "}
              <Link href="/mining-fifo-pay-guide/" className="text-eucalyptus-dark hover:underline">mining and FIFO pay guide</Link> if you
              work a roster.
            </p>
          </section>

          <section>
            <H2>Queensland public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              Queensland is unusual twice over. Christmas Eve is a <em>part-day</em> public holiday
              from 6 pm — an hour earlier than the 7 pm start used in SA and the NT — so an evening
              hospitality shift on 24 December crosses into penalty rates midway through. And the
              Royal Queensland Show (the Ekka) is a public holiday in the Brisbane area only; a
              Townsville worker gets nothing that day.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
          </section>

          <section>
            <H2>Long service leave in Queensland</H2>
            <p className="mb-4 text-warmgray">
              Queensland is the only jurisdiction that puts long service leave inside its general
              industrial statute rather than a dedicated Act — it lives in the{" "}
              {PROFILE.longServiceLeave.act}, which also covers casual, regular part-time and seasonal
              employees subject to conditions.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Building and construction workers accrue through QLeave&apos;s portable scheme instead,
              which carries service between employers.
            </p>
          </section>

          <section>
            <H2>Does QLD payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Queensland&apos;s mental health levy catches the same confusion — it is charged to large
              employers, not to employees, and it is not a second Medicare levy. The only health charge
              that touches your pay is the federal{" "}
              <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare levy</Link>, which the calculator
              above already deducts.
            </p>
          </section>

          <StatePayFacts profile={PROFILE} />

          <OtherStatesNav profile={PROFILE} />

          {/* T2: employer payroll tax detail moved to /payroll-tax/qld/ */}
          <EmployerPayrollTaxLink profile={PROFILE} />


          <FAQSection>
            <FAQItem value="federal" question="Is income tax different in Queensland compared to other states?">
              No. Income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment rates are identical in Queensland, New South Wales, Victoria, and every other state and territory.
            </FAQItem>
            <FAQItem value="takehome" question="What is the take-home pay on the average Queensland salary?">
              Full-time adults in Queensland earn {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings, about {formatAUD(typicalSalary(PROFILE))} a year (ABS, {STATE_EMPLOYEE_SOURCES.absReferencePeriod}). Including overtime the figure rises to {formatAUD(PROFILE.awote.personsFullTimeTotal, 2)} a week. The worked example above shows the net result.
            </FAQItem>
            <FAQItem value="ekka" question="Is the Ekka a public holiday for the whole of Queensland?">
              No. The Royal Queensland Show public holiday on Wednesday 12 August 2026 applies to the Brisbane area only. Other parts of Queensland hold their own local show holidays on different dates, declared regionally.
            </FAQItem>
            <FAQItem value="christmaseve" question="Is Christmas Eve a public holiday in Queensland?">
              Partly. Christmas Eve is a part-day public holiday in Queensland from 6 pm to midnight. Hours worked before 6 pm are ordinary hours; hours after it attract public holiday entitlements. Queensland&apos;s 6 pm start is an hour earlier than South Australia&apos;s and the Northern Territory&apos;s.
            </FAQItem>
            <FAQItem value="lsl" question="When do I get long service leave in Queensland?">
              After 10 years of continuous service you can take 8.6667 weeks of paid leave, rising to 13 weeks at 15 years. Between 7 and 10 years a proportionate payment is owed only in defined circumstances; at 10 years the payment on termination becomes automatic.
            </FAQItem>
            <FAQItem value="employee" question="Do employees pay for WorkCover in QLD?">
              No. WorkCover Queensland insurance premiums are an employer-only expense. They do not reduce your gross salary and do not affect your take-home pay or net pay after tax.
            </FAQItem>
            <FAQItem value="mentalhealth" question="Does the Queensland mental health levy come out of my wages?">
              No. The mental health levy is charged to employers with Australian wages above $10 million, on top of payroll tax. It is not deducted from employee pay and does not appear on a payslip.
            </FAQItem>
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, the Medicare levy, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear}; there are no state-specific individual income taxes in Australia. Queensland earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13c, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Industrial Relations Act 2016 as explained by {PROFILE.longServiceLeave.agency}. State payroll tax and workers compensation data are sourced from the Queensland Revenue Office and WorkCover QLD, but these only affect employers.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
