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

const PROFILE = STATE_PROFILES.NSW;

/** Display order for the cross-state payroll tax comparison table (home state first). */
const PAYROLL_COMPARE_ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13a, New South Wales`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — New South Wales", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Long Service Leave Act 1955)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "NSW Payroll Tax", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax", publisher: "Revenue NSW" },
];

export default function PayCalculatorNSWPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-sandstone-dark/10 bg-eucalyptus-light/30 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator NSW</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator NSW: Your Take-Home Pay in New South Wales
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">NSW</span>
          </div>
          <p className="text-lg text-warmgray">
            A salary calculator for the 4 million people who work in NSW. Enter your gross pay and see
            the net figure that should appear on your next payslip, using ATO{" "}
            {SITE_CONFIG.financialYear} rates — then check the NSW-only things underneath: the public
            holiday calendar, long service leave after 10 years, and who really pays payroll tax.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="NSW" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <section>
            <H2>How much of a NSW salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              There is no such thing as NSW income tax. Every dollar of income tax you pay goes to the
              Commonwealth, on the same scale used in Perth and Hobart. What follows is the arithmetic
              on {formatAUD(typicalSalary(PROFILE))} — the average full-time wage in this state, and
              the highest of any state on the mainland east coast.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              Change the number in the calculator above for your own salary. If you are weighing up an
              offer, the{" "}
              <Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">pay rise calculator</Link> shows what a
              raise is worth after tax, and the{" "}
              <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">{SITE_CONFIG.financialYear} tax brackets</Link>{" "}
              show where the next threshold sits.
            </p>
          </section>

          <section>
            <H2>Is your NSW salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              NSW is the highest-paying state after Western Australia and the ACT. Full-time adults
              here take {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings.
              Note the gap between the first and last rows of the table — the &quot;all employees&quot;
              figure is dragged down by part-time hours, not by lower hourly rates.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              An average is not a floor. If you suspect you are being underpaid, the floor is your
              award rate — see the{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Australian award rates guide</Link>, or the
              {" "}<Link href="/retail-award-rates/" className="text-eucalyptus-dark hover:underline">retail</Link> and{" "}
              <Link href="/hospitality-award-rates/" className="text-eucalyptus-dark hover:underline">hospitality</Link> rates, the two
              awards that cover the most NSW workers.
            </p>
          </section>

          <section>
            <H2>NSW public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              NSW has the leanest public holiday calendar in the country — 13 days, with no equivalent
              of Melbourne Cup Day, Canberra Day or the Ekka. What NSW does have is an extra day when
              Anzac Day falls on a weekend, and the October Labour Day that Victoria and WA hold in
              March.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Regional NSW also has local show-day holidays declared council by council. Those are not
              in the state-wide list above; check with{" "}
              <a href="https://www.nsw.gov.au/about-nsw/public-holidays" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">NSW Government</a>{" "}
              for your area.
            </p>
          </section>

          <section>
            <H2>Long service leave in NSW</H2>
            <p className="mb-4 text-warmgray">
              NSW runs on the oldest long service leave statute in the country — the{" "}
              {PROFILE.longServiceLeave.act}, which still measures the entitlement in months and
              defines a month as 4⅓ weeks.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Building and construction workers are covered separately by the NSW Long Service
              Corporation&apos;s portable scheme, which follows you between employers rather than
              resetting each time you change jobs.
            </p>
          </section>

          <section>
            <H2>Does NSW payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Workers compensation premiums (iCare in NSW) work the same way — an employer expense,
              never a payslip line. The legitimate deductions are listed in the{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">payslip guide</Link>; anything
              else is worth querying.
            </p>
          </section>

          <OtherStatesNav profile={PROFILE} />

          {/* ================================================================= */}
          {/* EMPLOYER SECTION — demoted below the employee content, figures    */}
          {/* preserved exactly as previously published.                        */}
          {/* ================================================================= */}
          <section className="rounded-2xl border border-sandstone-dark/20 bg-white p-6 md:p-8">
            <H2>For employers: payroll tax and premiums in New South Wales</H2>
            <p className="mb-6 text-sm text-warmgray-light">
              None of this changes an employee&apos;s net pay. It is the cost of employing someone in
              NSW.
            </p>

            <H3>What is NSW payroll tax?</H3>
            <p className="text-warmgray mb-4">NSW payroll tax is a state tax that employers pay at a rate of <strong>{formatPercent(STATE_PAYROLL_TAX.NSW.rate, 2)}</strong> on total annual wages exceeding the <strong>{formatAUD(STATE_PAYROLL_TAX.NSW.threshold)}</strong> threshold, administered by Revenue NSW.</p>
            <p className="text-warmgray mb-4">Payroll tax is strictly an employer cost. It does not reduce employee take-home pay or appear on payslips. Employers with wage bills below the {formatAUD(STATE_PAYROLL_TAX.NSW.threshold)} annual threshold pay no payroll tax at all, which exempts most small businesses. The tax applies to wages, superannuation contributions, fringe benefits, and contractor payments in many cases.</p>

            <H3>How does NSW payroll tax compare to other states?</H3>
            <p className="text-warmgray mb-4">NSW has a mid-range payroll tax rate compared to other Australian states and territories. Queensland and Western Australia offer higher thresholds, while the ACT has the highest headline rate.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone text-navy">
                    <th className="text-left px-4 py-3 font-semibold">State / Territory</th>
                    <th className="text-right px-4 py-3 font-semibold">Rate</th>
                    <th className="text-right px-4 py-3 font-semibold">Annual Threshold</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  {PAYROLL_COMPARE_ORDER.map((code, i) => {
                    const s = STATE_PAYROLL_TAX[code];
                    const isHome = code === "NSW";
                    const rowClass = isHome
                      ? "border-t border-sandstone-dark/10 bg-eucalyptus-light/20 font-medium"
                      : i % 2 === 0
                      ? "border-t border-sandstone-dark/10 bg-sandstone/30"
                      : "border-t border-sandstone-dark/10";
                    return (
                      <tr key={code} className={rowClass}>
                        <td className={`px-4 py-2.5 ${isHome ? "text-navy" : ""}`}>{s.name}</td>
                        <td className="text-right px-4 py-2.5">{formatPercent(s.rate, 2)}</td>
                        <td className="text-right px-4 py-2.5">{formatAUD(s.threshold)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">Employers expanding into NSW from Victoria face a higher threshold ({formatAUD(STATE_PAYROLL_TAX.NSW.threshold)} vs {formatAUD(STATE_PAYROLL_TAX.VIC.threshold)}) but a higher rate ({formatPercent(STATE_PAYROLL_TAX.NSW.rate, 2)} vs {formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)}). Use the <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link> to model total employment costs including payroll tax, superannuation, and workers compensation premiums.</p>

            <H3>Workers compensation (iCare)</H3>
            <p className="text-warmgray">
              Both payroll tax and workers compensation (iCare in NSW) are employer expenses. These
              costs do not appear on your payslip and do not reduce your gross salary or take-home pay.
              Employers factor these on-costs into total hiring budgets, which indirectly influences
              salary offers.
            </p>
          </section>

          <FAQSection>
            <FAQItem value="federal" question="Is income tax different in NSW compared to other states?">
              No. Income tax in Australia is levied by the federal government through the ATO. The tax brackets, Medicare levy, and HECS-HELP repayment rates are exactly the same in NSW as they are in Victoria, Queensland, Western Australia, or any other state and territory. There is no state-level income tax anywhere in Australia.
            </FAQItem>
            <FAQItem value="takehome" question="What is the take-home pay on the average NSW salary?">
              Full-time adults in NSW earn {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings, about {formatAUD(typicalSalary(PROFILE))} a year (ABS, {STATE_EMPLOYEE_SOURCES.absReferencePeriod}). The worked example above breaks that down to weekly, fortnightly and monthly net pay.
            </FAQItem>
            <FAQItem value="holidays" question="How many public holidays does NSW have?">
              Thirteen state-wide public holidays in 2026, the fewest of any state or territory. NSW adds a day when Anzac Day and Boxing Day fall on a weekend but has no equivalent of Melbourne Cup Day, Canberra Day or the Royal Queensland Show. Regional show days are declared locally and sit outside the state-wide list.
            </FAQItem>
            <FAQItem value="lsl" question="When do I get long service leave in NSW?">
              After 10 years of continuous service with the same employer you are entitled to 8.67 weeks — two months — of paid leave, then 4.33 weeks for each further 5 years. Between 5 and 10 years a pro-rata payment is only owed in defined circumstances.
            </FAQItem>
            <FAQItem value="employee" question="Do employees pay payroll tax or workers compensation premiums?">
              No. Both payroll tax and workers compensation (iCare in NSW) are employer expenses. These costs do not appear on your payslip and do not reduce your gross salary or take-home pay. Employers factor these on-costs into total hiring budgets, which indirectly influences salary offers.
            </FAQItem>
            <FAQItem value="medicare" question="Do I pay the Medicare levy surcharge in NSW?">
              The Medicare levy surcharge applies identically across all states. Untick &quot;I hold private hospital cover&quot; in the calculator above and it will add the surcharge at your income level so you can see the difference in dollars.
            </FAQItem>
            <FAQItem value="hecs" question="How does HECS-HELP change my NSW take-home pay?">
              HECS-HELP repayment thresholds are federal and identical in every state. Tick the HECS-HELP box in the calculator to see the repayment withheld at your salary and what your fortnightly pay drops to.
            </FAQItem>
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, the Medicare levy, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear} Australian residents; there are no state-specific individual income taxes in Australia. NSW earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13a, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Long Service Leave Act 1955 as explained by {PROFILE.longServiceLeave.agency}. State payroll tax and workers compensation data are sourced from Revenue NSW and iCare, but these only affect employers, not employee net pay.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
