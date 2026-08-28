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

const PROFILE = STATE_PROFILES.QLD;

/** Display order for the cross-state payroll tax comparison table (home state first). */
const PAYROLL_COMPARE_ORDER = ["QLD", "NSW", "VIC", "WA", "SA", "TAS", "ACT", "NT"] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13c, Queensland`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — Queensland", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Industrial Relations Act 2016)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "QLD Payroll Tax", url: "https://qro.qld.gov.au/payroll-tax/", publisher: "Queensland Revenue Office" },
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

          <OtherStatesNav profile={PROFILE} />

          {/* ================================================================= */}
          {/* EMPLOYER SECTION — demoted below the employee content, figures    */}
          {/* preserved exactly as previously published.                        */}
          {/* ================================================================= */}
          <section className="rounded-2xl border border-sandstone-dark/20 bg-white p-6 md:p-8">
            <H2>For employers: payroll tax and premiums in Queensland</H2>
            <p className="mb-6 text-sm text-warmgray-light">
              None of the figures below reduce an employee&apos;s take-home pay. They are the cost of
              employing someone in Queensland.
            </p>

            <H3>What is QLD payroll tax?</H3>
            <p className="text-warmgray mb-4">Queensland payroll tax is a state tax paid by employers on total Australian taxable wages exceeding <strong>{formatAUD(STATE_PAYROLL_TAX.QLD.threshold)} per year</strong>, at a base rate of <strong>{formatPercent(STATE_PAYROLL_TAX.QLD.rate, 2)}</strong>.</p>
            <p className="text-warmgray mb-4">The Queensland Revenue Office (QRO) administers payroll tax. Employers with an annual wage bill above $1.3 million pay <strong>{formatPercent(STATE_PAYROLL_TAX.QLD.rate, 2)}</strong> on the amount exceeding the threshold. A higher rate of <strong>4.95%</strong> applies where total wages exceed <strong>$6.5 million</strong>. A mental health levy of <strong>0.25%</strong> applies to employers with wages above $10 million, increasing to <strong>0.5%</strong> above $100 million. Employees do not pay payroll tax. It does not reduce your gross salary or affect your take-home pay calculation.</p>

            <H3>How does QLD payroll tax compare to other states?</H3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-navy">State / Territory</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">Annual Threshold</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">Base Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {PAYROLL_COMPARE_ORDER.map((code, i) => {
                    const s = STATE_PAYROLL_TAX[code];
                    const isHome = code === "QLD";
                    const rowClass = isHome ? "bg-eucalyptus/5" : i % 2 === 0 ? "bg-sandstone/30" : "";
                    return (
                      <tr key={code} className={rowClass}>
                        <td className={`px-4 py-3 ${isHome ? "text-navy font-medium" : "text-warmgray"}`}>{s.name}</td>
                        <td className="px-4 py-3 text-navy text-right">{formatAUD(s.threshold)}</td>
                        <td className="px-4 py-3 text-navy text-right">{formatPercent(s.rate, 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm mt-3">Queensland&apos;s {formatAUD(STATE_PAYROLL_TAX.QLD.threshold)} threshold and {formatPercent(STATE_PAYROLL_TAX.QLD.rate, 2)} base rate position it as a competitive state for employers. Compared to <Link href="/pay-calculator-nsw/" className="text-eucalyptus-dark hover:underline">Pay Calculator NSW</Link> ({formatPercent(STATE_PAYROLL_TAX.NSW.rate, 2)}) and <Link href="/pay-calculator-vic/" className="text-eucalyptus-dark hover:underline">Pay Calculator VIC</Link> ({formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)}), Queensland offers a lower base rate, which benefits small-to-medium enterprises with wage bills just above the threshold.</p>

            <H3>WorkCover Queensland</H3>
            <ul className="mb-4 mt-4 space-y-2 text-sm text-warmgray">
              <li><strong>WorkCover QLD:</strong> Employer-funded workplace injury insurance that provides income replacement at <strong>85%</strong> of normal weekly earnings for the first 26 weeks of incapacity</li>
            </ul>
            <p className="text-warmgray text-sm">
              WorkCover Queensland insurance premiums are an employer-only expense. They do not reduce
              your gross salary and do not affect your take-home pay or net pay after tax. Use the{" "}
              <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link> to
              model payroll tax, super and premiums together.
            </p>
          </section>

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
