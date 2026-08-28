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

const PROFILE = STATE_PROFILES.NT;

/** Display order for the cross-state payroll tax comparison table (home territory first). */
const PAYROLL_COMPARE_ORDER = ["NT", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT"] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13g, Northern Territory`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — Northern Territory", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Long Service Leave Act 1981)", url: PROFILE.longServiceLeave.agencyUrl, publisher: "NT Government" },
  { title: "NT Payroll Tax", url: "https://treasury.nt.gov.au/dtf/territory-revenue-office/payroll-tax", publisher: "NT Treasury" },
];

export default function PayCalculatorNTPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-eucalyptus-light bg-eucalyptus-light/40 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator NT</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator NT: Your Take-Home Pay in the Northern Territory
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">NT</span>
          </div>
          <p className="text-lg text-warmgray">
            A wage calculator for Territory workers, on ATO {SITE_CONFIG.financialYear} rates. Two
            things change the answer more here than anywhere else in Australia: the zone tax offset,
            which every NT resident can claim, and Picnic Day and May Day, which nobody outside the
            Territory gets.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="NT" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <section>
            <H2>How much of a Northern Territory salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              The Territory levies no income tax. What it does have is the zone tax offset, which the
              calculator above deliberately does not apply because the amount depends on your locality
              and it is claimed in your return rather than withheld from your pay. Here is the base
              arithmetic on {formatAUD(typicalSalary(PROFILE))}, the average full-time wage in the NT.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              Add the zone offset on top of this result at tax time — it reduces the tax you owe, not
              your taxable income, so it comes back as a refund rather than a bigger fortnightly pay.
            </p>
          </section>

          <section>
            <H2>The zone tax offset: the NT-only adjustment to your tax</H2>
            <p className="mb-4 text-warmgray">
              Every NT resident lives in a designated zone. Which one decides how much you get back, and
              you must have lived there for more than half the income year to claim.
            </p>
            <ul className="mb-4 space-y-2 text-sm text-warmgray">
              <li><strong>Zone A</strong> (higher offset) &ndash; Alice Springs, Katherine, Tennant Creek, Nhulunbuy, Jabiru, and most communities outside Darwin</li>
              <li><strong>Zone B</strong> (lower offset) &ndash; Darwin, Palmerston, and surrounding suburbs</li>
              <li><strong>Special Zone</strong> (highest offset) &ndash; particularly remote locations more than 250 km from a population centre of 2,500 people</li>
            </ul>
            <p className="text-sm text-warmgray">
              Work out yours with the{" "}
              <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">zone tax offset guide and calculator</Link>,
              then add it to the take-home figure above. Remote-area housing and district allowances
              paid by your employer are a separate matter again — some are fringe benefits rather than
              salary, so check how yours is treated on your payslip.
            </p>
          </section>

          <section>
            <H2>Is your NT salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              The Territory has an unusual earnings shape. Full-time ordinary time earnings of{" "}
              {formatAUD(PROFILE.awote.personsFullTime, 2)} a week sit below the national average — but
              the all-employees figure of {formatAUD(PROFILE.awote.allEmployees, 2)} is the second
              highest in the country, because the NT has proportionally far less part-time work than
              anywhere else.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Overtime adds more than {formatAUD(PROFILE.awote.personsFullTimeTotal - PROFILE.awote.personsFullTime, 2)}{" "}
              a week to the full-time figure — the second largest overtime gap of any jurisdiction. If
              you work a roster, the{" "}
              <Link href="/overtime-pay-calculator/" className="text-eucalyptus-dark hover:underline">overtime calculator</Link> and the{" "}
              <Link href="/mining-fifo-pay-guide/" className="text-eucalyptus-dark hover:underline">mining and FIFO pay guide</Link> will get
              you closer than base salary alone.
            </p>
          </section>

          <section>
            <H2>Northern Territory public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              The NT gazettes 15 public holidays, more than any state. Two are Territory-only: May Day
              in early May and Picnic Day on the first Monday in August. Christmas Eve and New
              Year&apos;s Eve are both part-day holidays from 7 pm, so an evening shift changes rate
              partway through. Regional show days in Darwin, Katherine, Tennant Creek and Alice Springs
              are declared separately and are not in the Territory-wide list.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
          </section>

          <section>
            <H2>Long service leave in the Northern Territory</H2>
            <p className="mb-4 text-warmgray">
              The NT matches South Australia on quantity — 13 weeks at 10 years — but is stricter about
              how you get there. Part years do not count at all, workers compensation absences do not
              accrue, and you cannot cash the leave out instead of taking it.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              While on long service leave you are paid at your usual rate, which does <em>not</em>{" "}
              include overtime, penalties, or district and site allowances — a meaningful difference in
              the Territory, where those can be a large share of take-home pay. NT Government and
              Australian Government employees, and construction workers under NT Build, are covered by
              separate arrangements.
            </p>
          </section>

          <section>
            <H2>Does NT payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              The Territory has the highest payroll tax threshold in the country, so most NT employers
              never pay it. Either way, it is not a payslip line — see the{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">payslip guide</Link>.
            </p>
          </section>

          <OtherStatesNav profile={PROFILE} />

          {/* ================================================================= */}
          {/* EMPLOYER SECTION — demoted below the employee content, figures    */}
          {/* preserved exactly as previously published.                        */}
          {/* ================================================================= */}
          <section className="rounded-2xl border border-sandstone-dark/20 bg-white p-6 md:p-8">
            <H2>For employers: payroll tax and premiums in the Northern Territory</H2>
            <p className="mb-6 text-sm text-warmgray-light">
              None of this is deducted from an employee&apos;s pay.
            </p>

            <H3>What is NT payroll tax?</H3>
            <p className="mb-4 text-warmgray">NT payroll tax is <strong>{formatPercent(STATE_PAYROLL_TAX.NT.rate, 1)}</strong> on taxable wages above a <strong>{formatAUD(STATE_PAYROLL_TAX.NT.threshold)} annual threshold</strong>, payable by the employer only and not deducted from employee take-home pay.</p>
            <p className="mb-4 text-warmgray">The Northern Territory offers one of Australia&apos;s highest payroll tax thresholds, meaning small-to-medium businesses with total annual wages below {formatAUD(STATE_PAYROLL_TAX.NT.threshold)} pay no payroll tax at all. Employers with interstate operations must register and apportion wages across jurisdictions. Exempt categories include wages paid to apprentices during the first 2 years of a training contract, Commonwealth Government wages, and certain Indigenous community organisations.</p>
            {STATE_PAYROLL_TAX.NT.note && (
              <p className="mb-4 text-sm text-warmgray-light">{STATE_PAYROLL_TAX.NT.note}</p>
            )}

            <H3>How does NT payroll tax compare to other states?</H3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
                <thead><tr className="bg-sandstone text-navy"><th className="text-left px-4 py-3 font-semibold">State / Territory</th><th className="text-right px-4 py-3 font-semibold">Rate</th><th className="text-right px-4 py-3 font-semibold">Annual Threshold</th></tr></thead>
                <tbody className="text-warmgray">
                  {PAYROLL_COMPARE_ORDER.map((code, i) => {
                    const s = STATE_PAYROLL_TAX[code];
                    const isHome = code === "NT";
                    const rowClass = isHome
                      ? "border-t border-sandstone-dark/10 bg-eucalyptus-light/20 font-medium"
                      : i % 2 === 0
                      ? "border-t border-sandstone-dark/10 bg-sandstone/30"
                      : "border-t border-sandstone-dark/10";
                    return (
                      <tr key={code} className={rowClass}>
                        <td className="px-4 py-2">{s.name}</td>
                        <td className="text-right px-4 py-2">{formatPercent(s.rate, 2)}</td>
                        <td className="text-right px-4 py-2">{formatAUD(s.threshold)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">The NT&apos;s <strong>{formatAUD(STATE_PAYROLL_TAX.NT.threshold)}</strong> threshold is the highest outside the ACT. Use our <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link> to see the total cost of employing staff including payroll tax, superannuation, and workers&apos; compensation.</p>
          </section>

          <FAQSection>
            <FAQItem value="federal" question="Is income tax different in the Northern Territory?">
              No. The Medicare levy is a federal charge of <strong>2%</strong> of taxable income, applied uniformly across Australia, and income tax brackets and HECS-HELP thresholds are federal too. NT residents pay the same rates as everyone else — the zone tax offset is the only NT-linked adjustment, and it is claimed in your tax return.
            </FAQItem>
            <FAQItem value="takehome" question="What is the take-home pay on the average NT salary?">
              Full-time adults in the NT earn {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings, about {formatAUD(typicalSalary(PROFILE))} a year (ABS, {STATE_EMPLOYEE_SOURCES.absReferencePeriod}). The worked example above shows the net figure before any zone tax offset.
            </FAQItem>
            <FAQItem value="zone" question="Why isn't the zone tax offset in the calculator?">
              Because it depends on the exact locality you live in and on a residency test — more than half the income year in the zone. It is a rebate against tax payable, claimed in your return, so it does not change your fortnightly withholding. See the <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">zone tax offset guide</Link> for the amounts by zone.
            </FAQItem>
            <FAQItem value="picnic" question="What is Picnic Day?">
              Picnic Day is a Northern Territory public holiday held on the first Monday in August — 3 August in 2026. It is observed nowhere else in Australia and attracts full public holiday entitlements, including penalty rates under most awards if you work it.
            </FAQItem>
            <FAQItem value="lsl" question="When do I get long service leave in the NT?">
              After 10 years of continuous service you may be eligible for 13 weeks, calculated at 1.3 weeks for each year of employment. Part years do not count. Between 7 and 10 years a pro-rata payment is owed only if you reach retirement age, the employer ends the job for something other than serious misconduct, or you resign for illness, incapacity or pressing necessity.
            </FAQItem>
            <FAQItem value="allowances" question="Are district allowances included in my long service leave pay?">
              No. NT long service leave is paid at your usual rate of pay, which excludes overtime, penalties, and district and site allowances. If a large part of your income comes from allowances, your leave pay will be noticeably lower than your normal fortnightly pay.
            </FAQItem>
            <FAQItem value="payroll" question="Do NT employees pay payroll tax?">
              No. It is charged to employers whose Australian wages exceed {formatAUD(STATE_PAYROLL_TAX.NT.threshold)} — the highest threshold outside the ACT — and it never appears on an employee&apos;s payslip.
            </FAQItem>
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, LITO, the Medicare levy, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear}. The zone tax offset is not included in the automated calculation because zone classification is location-dependent and the offset is claimed in a tax return. NT earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13g, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Long Service Leave Act 1981 as published by the NT Government. NT payroll tax data is sourced from NT Treasury and describes employer obligations only.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
