"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  SOURCES,
  SITE_CONFIG,
  STATE_PAYROLL_TAX,
} from "@/lib/constants";
import { STATE_EMPLOYEE_SOURCES, STATE_PROFILES } from "@/lib/data/state-employee";
import StateTakeHomeCalculator from "./state-take-home-calculator";
import {
  AbsEarningsTable,
  FAQItem,
  FAQSection,
  ForwardLslLinks,
  H2,
  H3,
  LongServiceLeaveBlock,
  OtherStatesNav,
  PayrollTaxForEmployees,
  PenaltyRateNote,
  PublicHolidayTable,
  WorkedExample,
  typicalSalary,
} from "./state-sections";

const PROFILE = STATE_PROFILES.TAS;

/** Display order for the cross-state payroll tax comparison table (home state first). */
const PAYROLL_COMPARE_ORDER = ["TAS", "NSW", "VIC", "QLD", "WA", "SA", "ACT", "NT"] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13f, Tasmania`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — Tasmania", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Long Service Leave Act 1976)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "TAS Payroll Tax", url: "https://www.sro.tas.gov.au/payroll-tax", publisher: "State Revenue Office Tasmania" },
];

export default function PayCalculatorTASPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-sandstone-dark/10 bg-eucalyptus-light/30 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator TAS</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator TAS: Your Take-Home Pay in Tasmania
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">TAS</span>
          </div>
          <p className="text-lg text-warmgray">
            Tasmanian wages are the lowest in the country, which makes the after-tax number matter more,
            not less. This salary calculator applies ATO {SITE_CONFIG.financialYear} rates, and the rest
            of the page covers the Tasmanian specifics: a holiday calendar that changes depending on
            which end of the state you work in, and long service leave under the 1976 Act.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="TAS" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <section>
            <H2>How much of a Tasmanian salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              Tasmania has no state income tax. What it does have is a wage distribution sitting lower
              than the mainland, which means a larger share of Tasmanians keep the{" "}
              <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline">low income tax offset</Link> in full and
              a smaller share ever reach the 37% bracket. Here is the arithmetic on{" "}
              {formatAUD(typicalSalary(PROFILE))}, the average full-time wage in Tasmania.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              At Tasmanian wage levels the effective tax rate is meaningfully lower than the headline
              brackets suggest, because the tax-free threshold and LITO make up a bigger fraction of a
              smaller salary. The calculator above shows your own effective rate.
            </p>
          </section>

          <section>
            <H2>Is your Tasmanian salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              Tasmania records the lowest full-time ordinary time earnings of any state or territory at{" "}
              {formatAUD(PROFILE.awote.personsFullTime, 2)} a week. It also records the narrowest gap
              between men and women anywhere in Australia — {formatAUD(PROFILE.awote.malesFullTime - PROFILE.awote.femalesFullTime, 2)}{" "}
              a week, against far larger gaps in the resource states.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Low averages make the award floor more relevant here than almost anywhere else. The
              national minimum wage is {formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour and{" "}
              {formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} a week for a {EMPLOYMENT.standardWeeklyHours}-hour
              week — check your award rate in the{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">award rates guide</Link>.
            </p>
          </section>

          <section>
            <H2>Tasmanian public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              No other state splits its holidays geographically the way Tasmania does. The Royal Hobart
              Regatta in February is observed in the south; the areas that do not observe it get
              Recreation Day in November instead. The Royal Hobart Show in October is likewise
              southern-only, and Easter Tuesday is generally a Tasmanian Public Service day rather than
              a general one. Eight Hours Day in March is Tasmania&apos;s name for Labour Day, marking
              the eight-hour-day campaign.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Because Regatta and Recreation Day are mutually exclusive by area, two Tasmanians on the
              same award can be paid a penalty rate on different days of the year. If you are unsure
              which applies to your workplace, confirm with{" "}
              <a href="https://worksafe.tas.gov.au/topics/laws-and-compliance/public-holidays" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">WorkSafe Tasmania</a>.
            </p>
          </section>

          <section>
            <H2>Long service leave in Tasmania</H2>
            <p className="mb-4 text-warmgray">
              Tasmania&apos;s {PROFILE.longServiceLeave.act} covers private sector workers only, and the
              exclusions matter: government employees, construction workers under TasBuild, and anyone
              whose federal award or agreement already contains long service leave provisions are all
              outside it.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Tasmania also counts certified sick leave, annual leave, public holidays and jury service
              as continuous employment, so those absences do not reset your clock.
            </p>
          </section>

          <section>
            <H2>Does TAS payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Tasmania charges the lowest headline payroll tax rate in the country, which is an employer
              saving, not a wage effect. What actually leaves your pay is set out in the{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">payslip guide</Link>.
            </p>
          </section>

          <OtherStatesNav profile={PROFILE} />

          {/* ================================================================= */}
          {/* EMPLOYER SECTION — demoted below the employee content, figures    */}
          {/* preserved exactly as previously published.                        */}
          {/* ================================================================= */}
          <section className="rounded-2xl border border-sandstone-dark/20 bg-white p-6 md:p-8">
            <H2>For employers: payroll tax and premiums in Tasmania</H2>
            <p className="mb-6 text-sm text-warmgray-light">
              None of this is deducted from an employee&apos;s wages.
            </p>

            <H3>What is TAS payroll tax?</H3>
            <p className="mb-4 text-warmgray">Tasmania&apos;s payroll tax rate is <strong>{formatPercent(STATE_PAYROLL_TAX.TAS.rate, 0)}</strong> on taxable wages above a <strong>{formatAUD(STATE_PAYROLL_TAX.TAS.threshold)}</strong> annual threshold, increasing to <strong>6.1%</strong> for employers with Australian wages exceeding $2,000,000.</p>
            <p className="mb-4 text-warmgray">Payroll tax is an employer obligation and does not reduce an employee&apos;s gross or net pay. The State Revenue Office Tasmania administers the tax. Businesses with total Australian wages below the {formatAUD(STATE_PAYROLL_TAX.TAS.threshold)} threshold pay no payroll tax at all, which exempts most small businesses across Hobart, Launceston, and Devonport. Tasmania&apos;s threshold is among the lowest in Australia, meaning more employers cross it, but the base rate of {formatPercent(STATE_PAYROLL_TAX.TAS.rate, 0)} is the lowest of any state.</p>

            <H3>How does TAS payroll tax compare to other states?</H3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
                <thead><tr className="bg-sandstone text-navy"><th className="px-4 py-3 text-left font-semibold">State / Territory</th><th className="px-4 py-3 text-right font-semibold">Base Rate</th><th className="px-4 py-3 text-right font-semibold">Annual Threshold</th></tr></thead>
                <tbody className="text-warmgray">
                  {PAYROLL_COMPARE_ORDER.map((code, i) => {
                    const s = STATE_PAYROLL_TAX[code];
                    const isHome = code === "TAS";
                    const rowClass = isHome
                      ? "border-t border-sandstone-dark/10 bg-eucalyptus-light/20 font-medium"
                      : i % 2 === 0
                      ? "border-t border-sandstone-dark/10 bg-sandstone/30"
                      : "border-t border-sandstone-dark/10";
                    return (
                      <tr key={code} className={rowClass}>
                        <td className="px-4 py-2">{s.name}</td>
                        <td className={`px-4 py-2 text-right ${isHome ? "text-navy" : ""}`}>{formatPercent(s.rate, 2)}</td>
                        <td className={`px-4 py-2 text-right ${isHome ? "text-navy" : ""}`}>{formatAUD(s.threshold)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">Tasmania&apos;s <strong>{formatPercent(STATE_PAYROLL_TAX.TAS.rate, 0)}</strong> base rate is the lowest in Australia, though its tiered structure increases the rate to <strong>6.1%</strong> for payrolls above $2,000,000. Employers comparing operating costs across states can use our <Link href="/pay-calculator-nsw/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Pay Calculator NSW</Link> or <Link href="/pay-calculator-vic/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Pay Calculator Victoria</Link> pages for state-specific context.</p>
            <p className="text-sm text-warmgray">
              Work injury insurance in Tasmania is provided by licensed insurers and funded entirely by
              employer premiums set by industry classification. Model total employment cost with the{" "}
              <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link>.
            </p>
          </section>

          <FAQSection>
            <FAQItem value="federal" question="Is income tax different in Tasmania?">
              No. Income tax, the Medicare levy and HECS-HELP repayment thresholds are set federally by the ATO and are identical in Tasmania, on the mainland, and in both territories. There is no Tasmanian income tax.
            </FAQItem>
            <FAQItem value="takehome" question="What is the take-home pay on the average Tasmanian salary?">
              Full-time adults in Tasmania earn {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings, about {formatAUD(typicalSalary(PROFILE))} a year (ABS, {STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — the lowest of any state or territory. The worked example above shows the net result per week, fortnight and month.
            </FAQItem>
            <FAQItem value="regatta" question="Do I get Royal Hobart Regatta or Recreation Day?">
              One or the other, depending on where in Tasmania you work. The Regatta in February is observed in certain areas including Hobart; the areas that do not observe it get Recreation Day in early November instead. Both are Tasmanian-only public holidays.
            </FAQItem>
            <FAQItem value="eighthours" question="What is Eight Hours Day?">
              Eight Hours Day, held on the second Monday in March, is Tasmania&apos;s version of Labour Day. It commemorates the campaign for the eight-hour working day. It attracts the same public holiday entitlements as any other gazetted holiday.
            </FAQItem>
            <FAQItem value="lsl" question="When do I get long service leave in Tasmania?">
              Private sector employees get 8⅔ weeks after 10 years of continuous employment, then 4⅓ weeks every further 5 years. A pro-rata payment may be owed on termination once you have completed 7 but fewer than 10 years. Government and TasBuild construction workers are covered by separate arrangements.
            </FAQItem>
            <FAQItem value="payroll" question="Do Tasmanian employees pay payroll tax?">
              No. Payroll tax is charged to employers whose Australian wages exceed {formatAUD(STATE_PAYROLL_TAX.TAS.threshold)}. It never appears on an employee&apos;s payslip and does not reduce gross pay.
            </FAQItem>
            <FAQItem value="medicare" question="Do I pay the Medicare levy surcharge in TAS?">
              The Medicare levy surcharge is federal and applies on the same income thresholds everywhere in Australia. Untick &quot;I hold private hospital cover&quot; in the calculator above to see whether it applies at your income and what it costs.
            </FAQItem>
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, LITO, the Medicare levy, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear}. Tasmanian earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13f, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Long Service Leave Act 1976 as explained by WorkSafe Tasmania. TAS payroll tax data is sourced from the State Revenue Office Tasmania and describes employer obligations only.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
