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

const PROFILE = STATE_PROFILES.WA;

/** Display order for the cross-state payroll tax comparison table (home state first). */
const PAYROLL_COMPARE_ORDER = ["WA", "NSW", "VIC", "QLD", "SA", "TAS", "ACT", "NT"] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13e, Western Australia`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — Western Australia", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Overview of long service leave in WA (Long Service Leave Act 1958)", url: PROFILE.longServiceLeave.agencyUrl, publisher: "Government of Western Australia" },
  { title: "WA Payroll Tax", url: "https://www.wa.gov.au/organisation/department-of-finance/payroll-tax", publisher: "Department of Finance WA" },
];

export default function PayCalculatorWAPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-sandstone-dark/10 bg-eucalyptus-light/30 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator WA</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator WA: Your Take-Home Pay in Western Australia
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">WA</span>
          </div>
          <p className="text-lg text-warmgray">
            WA has the highest full-time earnings of any state. This salary calculator turns that gross
            figure into the net one using ATO {SITE_CONFIG.financialYear} rates — and then covers what
            is genuinely different in WA: your own state industrial system, WA Day, and long service
            leave that pays out from 7 years.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="WA" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <section>
            <H2>How much of a WA salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              Income tax is federal, so a Perth payslip is taxed exactly like a Hobart one — the
              difference is that WA salaries are bigger, which pushes more of them into the 37% bracket.
              Here is the arithmetic on {formatAUD(typicalSalary(PROFILE))}, the average full-time wage
              in Western Australia.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              If you work in the Pilbara, the Kimberley or the Goldfields, you may also be entitled to
              the federal{" "}
              <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">zone tax offset</Link>, which the
              calculator above does not apply because it depends on your specific locality. It reduces
              tax payable rather than income, so it lands at tax time.
            </p>
          </section>

          <section>
            <H2>Is your WA salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              WA has the highest full-time ordinary time earnings of any state — only the ACT is higher,
              and that is a public service artefact. Note the size of the gap between men and women in
              the table below: it is the widest in the country, and it is a composition effect of the
              resources workforce rather than a difference in award rates.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Overtime pushes the WA full-time figure up by more than {formatAUD(PROFILE.awote.personsFullTimeTotal - PROFILE.awote.personsFullTime, 2)}{" "}
              a week. If you work a roster, the{" "}
              <Link href="/mining-fifo-pay-guide/" className="text-eucalyptus-dark hover:underline">mining and FIFO pay guide</Link> and the{" "}
              <Link href="/overtime-pay-calculator/" className="text-eucalyptus-dark hover:underline">overtime calculator</Link> are the
              right tools; base salary alone will understate you.
            </p>
          </section>

          <section>
            <H2>Western Australian public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              WA moves two holidays that most of the country holds on fixed dates: Labour Day falls in
              early March, and the King&apos;s Birthday is held in late September rather than June, so
              a WA worker and a NSW worker doing the same job get penalty rates on entirely different
              Mondays. WA Day in June is unique to this state.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Regional WA sometimes observes the King&apos;s Birthday on a different date again — check
              with{" "}
              <a href="https://www.wa.gov.au/service/employment/workplace-arrangements/public-holidays-western-australia" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">the WA Government</a>{" "}
              for your town before you count on a penalty shift.
            </p>
          </section>

          <section>
            <H2>Long service leave in Western Australia</H2>
            <p className="mb-4 text-warmgray">
              WA is the most generous state at the exit. Under the {PROFILE.longServiceLeave.act}, a
              payment can be owed after 7 years of continuous employment when the job ends — including
              by plain resignation — even though the leave itself cannot be taken until 10 years.
              Full-time, part-time, casual and seasonal employees are all covered.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Construction workers accrue through MyLeave instead, which carries service between
              employers across the industry.
            </p>
          </section>

          <section>
            <H2>Does WA payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              WorkCover WA premiums are the same story — an employer insurance cost, priced by industry
              risk, never deducted from wages. The deductions that <em>are</em> legitimate are listed
              in the{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">payslip guide</Link>.
            </p>
          </section>

          <section>
            <H2>WA has its own industrial relations system</H2>
            <p className="mb-4 text-warmgray">
              This is the one genuinely structural difference in WA, and it changes which minimum rate
              applies to you. Western Australia never referred its full industrial relations power to
              the Commonwealth, so sole traders, unincorporated partnerships and other non-constitutional
              employers in WA sit in the <strong>state</strong> system with its own award rates and its
              own state minimum wage — not the national minimum wage.
            </p>
            <p className="text-sm text-warmgray">
              If your employer is a Pty Ltd company, you are in the national system and the{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">federal award rates</Link> apply. If it is a
              sole trader or a partnership, check the WA state award instead — the base rate can differ,
              and so can the penalty rate loadings the calculator above assumes.
            </p>
          </section>

          <OtherStatesNav profile={PROFILE} />

          {/* ================================================================= */}
          {/* EMPLOYER SECTION — demoted below the employee content, figures    */}
          {/* preserved exactly as previously published.                        */}
          {/* ================================================================= */}
          <section className="rounded-2xl border border-sandstone-dark/20 bg-white p-6 md:p-8">
            <H2>For employers: payroll tax and premiums in Western Australia</H2>
            <p className="mb-6 text-sm text-warmgray-light">
              None of this is deducted from an employee. It is the cost of employing someone in WA.
            </p>

            <H3>What is WA payroll tax?</H3>
            <p className="text-warmgray mb-4">WA payroll tax is a <strong>{formatPercent(STATE_PAYROLL_TAX.WA.rate, 2)} state tax</strong> levied on employers whose total Australian taxable wages exceed <strong>{formatAUD(STATE_PAYROLL_TAX.WA.threshold)} per year</strong>.</p>
            <p className="text-warmgray mb-4">Payroll tax is an employer cost managed by the Department of Finance WA. Employees do not pay payroll tax, and it does not reduce your gross salary or take-home pay. The tax applies to the employer&apos;s total wage bill, not individual salaries. A tiered scale applies to larger employers with wages exceeding $100 million, where the rate increases to 6.5%.</p>

            <H3>How does WA payroll tax compare to other states?</H3>
            <p className="text-warmgray mb-4">WA&apos;s payroll tax threshold of {formatAUD(STATE_PAYROLL_TAX.WA.threshold)} sits in the middle range nationally. The comparison table below shows rates and thresholds across all 8 Australian states and territories.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left p-3 font-semibold text-navy border border-sandstone-dark/20">State / Territory</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Rate</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Annual Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYROLL_COMPARE_ORDER.map((code, i) => {
                    const s = STATE_PAYROLL_TAX[code];
                    const isHome = code === "WA";
                    const rowClass = isHome ? "bg-ochre/10" : i % 2 === 0 ? "bg-sandstone/50" : "";
                    return (
                      <tr key={code} className={rowClass}>
                        <td className={`p-3 border border-sandstone-dark/20 text-warmgray ${isHome ? "font-semibold" : ""}`}>{s.name}</td>
                        <td className={`p-3 border border-sandstone-dark/20 text-right text-navy ${isHome ? "font-bold" : ""}`}>{formatPercent(s.rate, 2)}</td>
                        <td className={`p-3 border border-sandstone-dark/20 text-right ${isHome ? "font-bold text-navy" : "text-warmgray"}`}>{formatAUD(s.threshold)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm">WA&apos;s payroll tax rate matches the Northern Territory at <strong>{formatPercent(STATE_PAYROLL_TAX.WA.rate, 2)}</strong> but carries a lower threshold than Queensland, SA, and the NT. For employers calculating total hiring costs including payroll tax, WorkCover, and superannuation, see our <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link>.</p>

            <H3>WorkCover WA</H3>
            <p className="text-warmgray">
              WorkCover WA insurance premiums are entirely an employer expense. Premiums vary by
              industry risk classification, ranging from 0.5% of wages in low-risk office roles to over
              7% in underground mining. These costs do not reduce your gross salary or take-home pay.
            </p>
          </section>

          <FAQSection>
            <FAQItem value="federal" question="Is income tax different in WA compared to other states?">
              No. Personal income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment thresholds are identical in Western Australia, New South Wales, Victoria, Queensland, and every other state and territory. Use our <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">tax brackets guide</Link> to see the current rates.
            </FAQItem>
            <FAQItem value="takehome" question="What is the take-home pay on the average WA salary?">
              Full-time adults in WA earn {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings, about {formatAUD(typicalSalary(PROFILE))} a year — the highest of any state (ABS, {STATE_EMPLOYEE_SOURCES.absReferencePeriod}). The worked example above shows what is left after tax.
            </FAQItem>
            <FAQItem value="statesystem" question="Am I covered by WA state awards or federal awards?">
              It depends on your employer&apos;s legal structure, not on where you live. Employees of incorporated companies are in the national system and covered by federal modern awards. Employees of sole traders, unincorporated partnerships and other non-constitutional employers in WA are covered by the WA state system, with its own awards and its own state minimum wage.
            </FAQItem>
            <FAQItem value="holidays" question="Why is the King's Birthday in September in WA?">
              Western Australia sets its own public holiday dates. It observes the King&apos;s Birthday in late September rather than the June date used in NSW, Victoria, SA, Tasmania and the NT, and it holds Labour Day in early March. Some regional areas in WA hold the King&apos;s Birthday on a different date again.
            </FAQItem>
            <FAQItem value="lsl" question="When do I get long service leave in WA?">
              Leave can be taken after 10 years of continuous employment, when 8.667 weeks has accrued, then a further 4.333 weeks every 5 years. Separately, after 7 years of continuous employment a payment may be owed when employment ends by resignation, dismissal, redundancy or death.
            </FAQItem>
            <FAQItem value="employee" question="Do WA employees pay for WorkCover?">
              No. WorkCover WA insurance premiums are entirely an employer expense. Premiums vary by industry risk classification, ranging from 0.5% of wages in low-risk office roles to over 7% in underground mining. These costs do not reduce your gross salary or take-home pay.
            </FAQItem>
            <FAQItem value="zone" question="Does the zone tax offset show in my WA pay calculation?">
              Not in the calculator above. The zone tax offset depends on the specific locality you live in for more than half the income year, so it is claimed in your tax return rather than through withholding. See the <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">zone tax offset guide</Link> for the qualifying WA areas.
            </FAQItem>
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, the Medicare levy, LITO, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear}; there are no state-specific individual income taxes in Australia. WA earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13e, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Long Service Leave Act 1958 as explained by Private Sector Labour Relations. State payroll tax and WorkCover data are sourced from the Department of Finance WA and WorkCover WA.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
