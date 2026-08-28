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

const PROFILE = STATE_PROFILES.VIC;

/** Display order for the cross-state payroll tax comparison table (home state first). */
const PAYROLL_COMPARE_ORDER = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13b, Victoria`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — Victoria", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Long Service Leave Act 2018)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "VIC Payroll Tax", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax", publisher: "State Revenue Office Victoria" },
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
              employer costs, not payslip deductions. The detail is in the employer section below.
              What <em>does</em> come out of your pay is set out in the{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">payslip guide</Link>.
            </p>
          </section>

          <OtherStatesNav profile={PROFILE} />

          {/* ================================================================= */}
          {/* EMPLOYER SECTION — demoted below the employee content, figures    */}
          {/* preserved exactly as previously published.                        */}
          {/* ================================================================= */}
          <section className="rounded-2xl border border-sandstone-dark/20 bg-white p-6 md:p-8">
            <H2>For employers: payroll tax and premiums in Victoria</H2>
            <p className="mb-6 text-sm text-warmgray-light">
              Nothing in this section affects an employee&apos;s take-home pay. It is here because it
              is the cost of employing someone in Victoria, and because employers ask.
            </p>

            <H3>What is VIC payroll tax?</H3>
            <p className="text-warmgray mb-4">VIC payroll tax is a state tax paid by employers at a rate of <strong>{formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)}</strong> on wages exceeding a <strong>{formatAUD(STATE_PAYROLL_TAX.VIC.threshold)}</strong> annual threshold, administered by the State Revenue Office Victoria.</p>
            <p className="text-warmgray mb-4">Payroll tax does not reduce your personal take-home pay. Employers pay it directly to the state government based on their total Australian wage bill. Regional Victorian employers benefit from a reduced rate of <strong>1.2125%</strong>, encouraging businesses to operate outside Melbourne. The threshold increases to <strong>$1,000,000</strong> from 1 July 2025. Victoria also applies the &quot;Mental Health and Wellbeing Surcharge&quot; on employers with national payrolls exceeding $10 million.</p>

            <H3>How does VIC payroll tax compare to other states?</H3>
            <p className="text-warmgray mb-4">Victorian payroll tax sits in the middle range nationally. Queensland and WA offer higher thresholds, while the ACT charges a higher rate. The following table compares payroll tax across all 8 states and territories for FY2025-26.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-left px-4 py-3 font-semibold">State/Territory</th>
                    <th className="text-right px-4 py-3 font-semibold">Rate</th>
                    <th className="text-right px-4 py-3 font-semibold">Annual Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {PAYROLL_COMPARE_ORDER.map((code, i) => {
                    const s = STATE_PAYROLL_TAX[code];
                    const isHome = code === "VIC";
                    const rowClass = isHome ? "bg-eucalyptus-light/20 font-semibold" : i % 2 === 0 ? "bg-sandstone/50" : "bg-white";
                    return (
                      <tr key={code} className={rowClass}>
                        <td className="px-4 py-2.5 text-navy">{s.name}</td>
                        <td className={`px-4 py-2.5 text-right ${isHome ? "text-navy" : "text-warmgray"}`}>{formatPercent(s.rate, 2)}</td>
                        <td className={`px-4 py-2.5 text-right ${isHome ? "text-navy" : "text-warmgray"}`}>{formatAUD(s.threshold)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm">Victoria has the lowest threshold of any state, meaning more employers cross the payroll tax trigger point. Explore how employer costs differ using the <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link>. Compare VIC to the <Link href="/pay-calculator-nsw/" className="text-eucalyptus-dark hover:underline">Pay Calculator NSW</Link> or <Link href="/pay-calculator-qld/" className="text-eucalyptus-dark hover:underline">Pay Calculator QLD</Link> for interstate salary comparisons.</p>

            <H3>WorkSafe Victoria</H3>
            <ul className="mb-4 space-y-2 text-sm text-warmgray">
              <li><strong>WorkSafe Coverage:</strong> Employer-funded workplace injury insurance at no cost to the employee</li>
            </ul>
            <p className="text-sm text-warmgray">
              Premiums are set by industry risk classification and are paid by the employer. An
              employee never contributes to them and never sees them on a payslip.
            </p>
          </section>

          {/* FAQ */}
          <FAQSection>
            <FAQItem value="federal" question="Is income tax different in Victoria compared to other states?">
              No. Personal income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment thresholds are identical in Victoria, New South Wales, Queensland, and every other state and territory.
            </FAQItem>
            <FAQItem value="takehome" question="What is the take-home pay on the average Victorian salary?">
              A full-time adult in Victoria earns {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings, or about {formatAUD(typicalSalary(PROFILE))} a year (ABS, {STATE_EMPLOYEE_SOURCES.absReferencePeriod}). The worked example above shows exactly what is left after income tax and the Medicare levy, per week, fortnight and month.
            </FAQItem>
            <FAQItem value="holidays" question="Which public holidays are unique to Victoria?">
              Victoria gazettes Labour Day in March, the Friday before the AFL Grand Final in September and Melbourne Cup Day in November — none of which are national. Some regional areas hold the Melbourne Cup holiday on a different date. Working one of these attracts public holiday penalty rates under most awards.
            </FAQItem>
            <FAQItem value="lsl" question="When do I get long service leave in Victoria?">
              After 7 years of continuous service with one employer, under the Long Service Leave Act 2018. Leave accrues at one week for every 60 weeks of service. Past 7 years the accrued balance is paid out however the employment ends, including resignation.
            </FAQItem>
            <FAQItem value="payroll" question="Do employees pay VIC payroll tax?">
              No. Payroll tax is charged to the employer once its Australian wage bill passes {formatAUD(STATE_PAYROLL_TAX.VIC.threshold)}. It is never deducted from an employee&apos;s salary and never appears on a payslip.
            </FAQItem>
            <FAQItem value="employee" question="Do employees pay the Mental Health and Wellbeing Surcharge?">
              No. The Mental Health and Wellbeing Surcharge is paid exclusively by employers whose national payroll exceeds $10 million. It does not reduce your personal salary or affect your take-home pay calculation.
            </FAQItem>
            <FAQItem value="regional" question="Do regional Victorian workers pay less tax?">
              No. Regional Victorian workers pay exactly the same federal income tax as Melbourne workers. Regional employers benefit from a reduced payroll tax rate of 1.2125% (compared to {formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)} in metro areas), but this employer saving does not affect employee tax deductions or net pay.
            </FAQItem>
            <FAQItem value="hecs" question="How does HECS-HELP affect my VIC take-home pay?">
              HECS-HELP repayments are a federal obligation applied identically across all states. Tick the HECS-HELP box in the calculator above and it will show the repayment withheld at your salary and the reduced take-home figure, per pay cycle.
            </FAQItem>
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
