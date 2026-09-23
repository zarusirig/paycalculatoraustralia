"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  formatPercent,
  SOURCES,
  SITE_CONFIG,
  STATE_PAYROLL_TAX,
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

const PROFILE = STATE_PROFILES.SA;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13d, South Australia`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — South Australia", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Long Service Leave Act 1987)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "SA payroll tax rates and thresholds (employers)", url: PAYROLL_TAX_STATES.sa.ratesUrl, publisher: PAYROLL_TAX_STATES.sa.revenueOffice },
];

export default function PayCalculatorSAPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-sandstone-dark/10 bg-eucalyptus-light/30 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator SA</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator SA: Your Take-Home Pay in South Australia
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">SA</span>
          </div>
          <p className="text-lg text-warmgray">
            A wage calculator for South Australia, running ATO {SITE_CONFIG.financialYear} rates. Below
            the result are the three things SA does differently: four part-day and Proclamation Day
            holidays that other states do not have, the most generous long service leave entitlement in
            the country, and a payroll tax threshold that is none of your business as an employee.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="SA" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <section>
            <H2>How much of a South Australian salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              South Australia levies no personal income tax, so every deduction on an Adelaide payslip
              is federal. Here is the arithmetic on {formatAUD(typicalSalary(PROFILE))} — the average
              full-time wage in SA, and the lowest of any mainland state.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              Because SA salaries cluster lower, more South Australians sit inside the{" "}
              <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline">low income tax offset</Link> range than
              in NSW or WA. The calculator above applies LITO automatically and shows it as a separate
              line when it applies to you.
            </p>
          </section>

          <section>
            <H2>Is your South Australian salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              SA full-time adults earn {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary
              time earnings. That is behind every other mainland jurisdiction but comfortably ahead of
              Tasmania, and the gap between men and women here is narrower than the national pattern.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Health care and social assistance is the largest employing industry in SA, and most of it
              runs on federal awards — check yours in the{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">award rates guide</Link> or the{" "}
              <Link href="/schads-award-pay-rates/" className="text-eucalyptus-dark hover:underline">SCHADS award rates</Link>, and remember
              that many SA health and charity employers offer salary packaging that changes the tax
              maths considerably.
            </p>
          </section>

          <section>
            <H2>South Australian public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              SA has the most complicated holiday calendar in the country for anyone working retail or
              hospitality. Christmas Eve and New Year&apos;s Eve are both <em>part-day</em> public
              holidays from 7 pm — so a shift that starts at 4 pm changes rate partway through — and 26
              December is Proclamation Day rather than Boxing Day, with its own substitute day on the
              28th. Adelaide Cup Day in March is unique to SA.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
          </section>

          <section>
            <H2>Long service leave in South Australia</H2>
            <p className="mb-4 text-warmgray">
              This is the single best employee entitlement in any Australian state. The{" "}
              {PROFILE.longServiceLeave.act} gives 13 weeks after 10 years — half again what NSW, WA,
              Queensland and Tasmania pay at the same milestone — and it accrues at the same 1.3 weeks
              a year whether you are full-time, part-time or casual.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
          </section>

          <section>
            <H2>Does SA payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              SA also runs a variable payroll tax rate between $1.5m and $1.7m of wages, which
              occasionally gets mistaken for a sliding deduction on employees. It is not. Employers can
              see how it works on the{" "}
              <Link href="/payroll-tax/sa/" className="text-eucalyptus-dark hover:underline">SA payroll tax</Link> page.
            </p>
          </section>

          <section>
            <H2>Working in a remote part of SA?</H2>
            <p className="mb-4 text-warmgray">
              One federal offset genuinely varies by where you live in South Australia, and the
              calculator above cannot apply it for you because it depends on your exact locality.
            </p>
            <ul className="mb-4 space-y-2 text-sm text-warmgray">
              <li><strong>Zone Tax Offset:</strong> Federal tax offset for SA residents in designated remote zones including Coober Pedy (Zone A &mdash; up to <strong>$1,173</strong>) and Woomera, Leigh Creek, and parts of the APY Lands (special area &mdash; up to <strong>$1,423</strong>).</li>
            </ul>
            <p className="text-sm text-warmgray">
              It reduces the tax you owe rather than your taxable income, and you claim it in your
              return. See the{" "}
              <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">zone tax offset guide</Link> for the
              qualifying localities and the residency test.
            </p>
          </section>

          <StatePayFacts profile={PROFILE} />

          <OtherStatesNav profile={PROFILE} />

          {/* T2: employer payroll tax detail moved to /payroll-tax/sa/ */}
          <EmployerPayrollTaxLink profile={PROFILE} />


          <FAQSection>
            <FAQItem value="federal" question="Is income tax different in South Australia?">
              No. Income tax is levied by the federal government through the ATO and is <strong>identical in all 6 states and 2 territories</strong>. Your income tax brackets, LITO, and Medicare levy are the same whether you live in Adelaide, Sydney, or Perth. There is no state-level personal income tax anywhere in Australia.
            </FAQItem>
            <FAQItem value="takehome" question="What is the take-home pay on the average SA salary?">
              Full-time adults in SA earn {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings, about {formatAUD(typicalSalary(PROFILE))} a year (ABS, {STATE_EMPLOYEE_SOURCES.absReferencePeriod}). The worked example above shows the weekly, fortnightly and monthly net figures.
            </FAQItem>
            <FAQItem value="parttime-holidays" question="Are Christmas Eve and New Year's Eve public holidays in SA?">
              Both are part-day public holidays in South Australia, running from 7 pm to midnight. Hours worked before 7 pm are ordinary hours and hours after it attract public holiday entitlements, so a single evening shift can span both.
            </FAQItem>
            <FAQItem value="proclamation" question="Why does SA have Proclamation Day instead of Boxing Day?">
              South Australia gazettes 26 December as the Proclamation Day holiday, marking the proclamation of the colony in 1836. For pay purposes it functions the same way as Boxing Day elsewhere, and an additional public holiday is observed on Monday 28 December 2026.
            </FAQItem>
            <FAQItem value="lsl" question="Why is long service leave better in South Australia?">
              The Long Service Leave Act 1987 (SA) sets accrual at 1.3 weeks per completed year, which produces 13 weeks at the 10-year mark. Most other states accrue about 0.867 weeks a year and reach only 8.67 weeks at 10 years. A pro-rata payment becomes available once you complete 7 years.
            </FAQItem>
            <FAQItem value="payroll" question="Do SA employees pay payroll tax?">
              No. Payroll tax is charged to the employer once its Australian wage bill passes {formatAUD(STATE_PAYROLL_TAX.SA.threshold)}, at a rate of up to {formatPercent(STATE_PAYROLL_TAX.SA.rate, 2)}. It never appears as a deduction on an employee&apos;s payslip.
            </FAQItem>
            <FAQItem value="packaging" question="Does salary packaging change my SA take-home pay?">
              Yes, and it is common in SA health and not-for-profit employment. Packaged amounts reduce your taxable income, which reduces income tax and the Medicare levy. Model it with the <Link href="/salary-packaging-guide/" className="text-eucalyptus-dark hover:underline">salary packaging guide</Link> and the <Link href="/salary-package-calculator/" className="text-eucalyptus-dark hover:underline">salary package calculator</Link>.
            </FAQItem>
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, LITO, the Medicare levy, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear}; there are no state-specific individual income taxes in Australia. SA earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13d, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Long Service Leave Act 1987 as explained by SafeWork SA. SA payroll tax figures are sourced from RevenueSA and describe employer obligations only.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
