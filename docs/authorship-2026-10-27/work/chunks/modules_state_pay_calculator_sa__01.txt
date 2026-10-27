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
import StateMinimumWage from "./state-minimum-wage";
import { FaqAnswer } from "@/components/common/faq-accordion";
import { SA_FAQS } from "./pay-calculator-sa-faqs";
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
import { ZONE_AREA_RATES, ZONE_OFFSET_INCOME_YEAR } from "@/lib/constants/zone-tax-offset";
import FeaturedImage from "@/components/common/featured-image";

const PROFILE = STATE_PROFILES.SA;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}), Table 13d, South Australia`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays, South Australia", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
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
            This South Australia pay calculator turns your gross salary into take-home pay per week,
            fortnight and month, using ATO {SITE_CONFIG.financialYear} resident tax rates and the Medicare
            levy. It opens on the ABS average full-time salary in South Australia; type your own salary to
            replace it. Below the result are the three things SA does differently. Its calendar has four
            state-specific holidays around Christmas and New Year: the Christmas Eve and New Year&apos;s Eve
            part-days, Proclamation Day and its substitute day. SA has the most generous long service
            leave entitlement in the country. SA payroll tax is paid by employers, not employees.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="SA" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <FeaturedImage placement="content" className="mt-0 mb-10" />
          <StatePayFacts profile={PROFILE} />

          <StateMinimumWage state="sa" />

          <section>
            <H2>How much of a South Australian salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              South Australia levies no personal income tax, so every deduction on an Adelaide payslip
              is federal. Here is the arithmetic on {formatAUD(typicalSalary(PROFILE))}, the average
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
              runs on federal awards. Check yours in the{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">award rates guide</Link> or the{" "}
              <Link href="/schads-award-pay-rates/" className="text-eucalyptus-dark hover:underline">SCHADS award rates</Link>, and check
              whether your SA health or charity employer offers salary packaging, which lowers your
              taxable income and the income tax on it.
            </p>
          </section>

          <section>
            <H2>South Australian public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              SA has the most complicated holiday calendar in the country for anyone working retail or
              hospitality. Christmas Eve and New Year&apos;s Eve are both <em>part-day</em> public
              holidays from 7 pm to midnight, so a shift that starts at 4 pm changes rate partway through.
              Proclamation Day takes the place of Boxing Day on 26 December, with its own substitute day
              on the 28th. Adelaide Cup Day in March is unique to SA.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
          </section>

          <section>
            <H2>Long service leave in South Australia</H2>
            <p className="mb-4 text-warmgray">
              South Australia gives the most generous long service leave of any Australian state. The{" "}
              {PROFILE.longServiceLeave.act} gives 13 weeks after 10 years, half again what NSW, WA,
              Queensland and Tasmania pay at the same milestone. SA long service leave accrues at the
              same 1.3 weeks a year whether you are full-time, part-time or casual.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
          </section>

          <section>
            <H2>Does SA payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              SA payroll tax also has a variable rate between $1.5m and $1.7m of wages. That sliding
              rate applies to the employer&apos;s wage bill and is not a deduction from employee pay. Employers can
              see how it works on the{" "}
              <Link href="/payroll-tax/sa/" className="text-eucalyptus-dark hover:underline">SA payroll tax</Link> page.
            </p>
          </section>

          <section>
            <H2>Working in a remote part of SA?</H2>
            <p className="mb-4 text-warmgray">
              One federal offset, the Zone Tax Offset, varies by where you live in South Australia. The
              calculator above cannot apply it for you because it depends on your exact locality.
            </p>
            <ul className="mb-4 space-y-2 text-sm text-warmgray">
              <li><strong>Zone Tax Offset:</strong> Federal tax offset for SA residents in designated remote zones. Coober Pedy, Roxby Downs, Leigh Creek and most APY Lands communities are <em>special areas</em> ({formatAUD(ZONE_AREA_RATES.specialArea.fixedAmount)} fixed amount plus {Math.round(ZONE_AREA_RATES.specialArea.basePercentage * 100)}% of any dependant base amount), while Woomera and most of the state are ordinary Zone B ({formatAUD(ZONE_AREA_RATES.zoneB.fixedAmount)} plus {Math.round(ZONE_AREA_RATES.zoneB.basePercentage * 100)}%). Amounts are for the {ZONE_OFFSET_INCOME_YEAR} income year.</li>
            </ul>
            <p className="text-sm text-warmgray">
              It reduces the tax you owe rather than your taxable income, and you claim it in your
              return. See the{" "}
              <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">zone tax offset guide</Link> for the
              qualifying localities and the residency test.
            </p>
          </section>


          <OtherStatesNav profile={PROFILE} />

          {/* T2: employer payroll tax detail moved to /payroll-tax/sa/ */}
          <EmployerPayrollTaxLink profile={PROFILE} />


          <FAQSection>
            {SA_FAQS.map((f) => (
              <FAQItem key={f.q} value={f.q} question={f.q}><FaqAnswer faq={f} /></FAQItem>
            ))}
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
