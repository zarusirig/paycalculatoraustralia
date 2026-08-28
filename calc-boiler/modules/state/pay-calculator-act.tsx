"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
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

const PROFILE = STATE_PROFILES.ACT;

/** Display order for the cross-state payroll tax comparison table (home territory first). */
const PAYROLL_COMPARE_ORDER = ["ACT", "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT"] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: `Average Weekly Earnings, Australia (${STATE_EMPLOYEE_SOURCES.absReferencePeriod}) — Table 13h, Australian Capital Territory`, url: STATE_EMPLOYEE_SOURCES.absAwe, publisher: SOURCES.abs.name },
  { title: "2026 public holidays — Australian Capital Territory", url: STATE_EMPLOYEE_SOURCES.fwoPublicHolidays, publisher: SOURCES.fwo.name },
  { title: "Long service leave (Long Service Leave Act 1976)", url: PROFILE.longServiceLeave.agencyUrl, publisher: PROFILE.longServiceLeave.agency },
  { title: "ACT Payroll Tax", url: "https://www.revenue.act.gov.au/payroll-tax", publisher: "ACT Revenue Office" },
];

export default function PayCalculatorACTPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-4xl rounded-2xl border border-sandstone-dark/10 bg-eucalyptus-light/30 p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator ACT</span></li>
            </ol>
          </nav>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-navy md:text-4xl">
              Pay Calculator ACT: Your Take-Home Pay in Canberra
            </h1>
            <span className="rounded-full bg-eucalyptus-dark px-3 py-1 text-xs font-bold text-white shadow-sm">ACT</span>
          </div>
          <p className="text-lg text-warmgray">
            Canberra has the highest earnings in the country and the shortest wait for long service
            leave. This salary calculator applies ATO {SITE_CONFIG.financialYear} rates to your gross
            pay, and the sections below deal with the ACT-only parts: Canberra Day, Reconciliation Day,
            7-year long service leave, and the public service super rate that makes package figures here
            misleading.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR — above the fold */}
        <section className="mx-auto max-w-4xl">
          <StateTakeHomeCalculator stateCode="ACT" defaultSalary={typicalSalary(PROFILE)} />
        </section>

        <div className="mx-auto max-w-4xl space-y-10">
          <section>
            <H2>How much of a Canberra salary do you actually keep?</H2>
            <p className="mb-4 text-warmgray">
              The ACT does not levy income tax; nobody in Australia does except the Commonwealth. A
              Canberra public servant and a Queanbeyan retail worker are taxed on exactly the same
              scale. What is different is the level: ACT earnings are the highest in the country, so a
              larger share of Canberra salaries reach the 37% bracket. Here is the arithmetic on{" "}
              {formatAUD(typicalSalary(PROFILE))}, the average full-time wage in the ACT.
            </p>
            <WorkedExample profile={PROFILE} />
            <p className="text-sm text-warmgray">
              Cross-border commuters from Queanbeyan, Yass or Bungendore are taxed identically —
              income tax follows the taxpayer, not the border. Public holidays do not: you get the
              holidays of the place you are <em>based</em> for work.
            </p>
          </section>

          <section>
            <H2>Is your Canberra salary normal? What the ABS says</H2>
            <p className="mb-4 text-warmgray">
              The ACT posts the highest full-time ordinary time earnings in Australia at{" "}
              {formatAUD(PROFILE.awote.personsFullTime, 2)} a week, and by some distance the smallest
              gender gap of any jurisdiction — a consequence of a workforce dominated by classified
              public service pay scales rather than negotiated private rates.
            </p>
            <AbsEarningsTable profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              Note how close the full-time and total-earnings rows are: there is very little overtime in
              the ACT compared with the resource states, so base salary tells you nearly the whole
              story.
            </p>
          </section>

          <section>
            <H2>The ACT super rate that makes package offers confusing</H2>
            <p className="mb-4 text-warmgray">
              This is the single most common source of confusion in a Canberra pay comparison, and the
              calculator above handles it if you tick the package box.
            </p>
            <ul className="mb-4 space-y-2 text-sm text-warmgray">
              <li><strong>APS Superannuation</strong> &mdash; Federal public servants under the PSSap scheme receive employer super contributions of <strong>15.4%</strong>, compared to the standard SG rate of 12%. This adds <strong>$3,400 per year</strong> in additional super for an employee on $100,000. Learn more in our <Link href="/superannuation-guide/" className="text-eucalyptus-dark hover:underline">Superannuation Guide</Link>.</li>
            </ul>
            <p className="text-sm text-warmgray">
              The calculator above uses the statutory guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)},
              which is what a private-sector Canberra employer pays. If you are on a higher scheme rate,
              the take-home figure is unaffected — super is paid on top of salary, not out of it — but
              the total package line will understate you. Compare offers with the{" "}
              <Link href="/salary-package-calculator/" className="text-eucalyptus-dark hover:underline">salary package calculator</Link>.
            </p>
          </section>

          <section>
            <H2>ACT public holidays and what they do to your pay</H2>
            <p className="mb-4 text-warmgray">
              The ACT has 15 gazetted public holidays — more than NSW, which surrounds it. Two are
              unique to the Territory: Canberra Day in March and Reconciliation Day, held on the first
              Monday on or after 27 May. A retail or hospitality worker in Civic therefore gets two
              penalty-rate days a year that a colleague fifteen minutes away in Queanbeyan does not.
            </p>
            <PublicHolidayTable profile={PROFILE} />
            <PenaltyRateNote profile={PROFILE} />
          </section>

          <section>
            <H2>Long service leave in the ACT</H2>
            <p className="mb-4 text-warmgray">
              The ACT reaches the entitlement faster than anywhere else in Australia — 7 years, and a
              pro-rata payment can be owed from as little as 5. There is also a quirk worth knowing:
              if a public holiday falls during your long service leave, the leave is extended by a day.
            </p>
            <LongServiceLeaveBlock profile={PROFILE} />
            <ForwardLslLinks profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              The {PROFILE.longServiceLeave.act} covers ACT private sector employees who are not
              covered by an award or agreement containing long service leave terms. Public sector staff
              are not covered by it, and the building, cleaning, community and security industries
              accrue through ACT Leave&apos;s portable schemes instead.
            </p>
          </section>

          <section>
            <H2>Does ACT payroll tax come out of your pay?</H2>
            <PayrollTaxForEmployees profile={PROFILE} />
            <p className="mt-4 text-sm text-warmgray">
              The ACT charges the highest headline payroll tax rate in the country against the highest
              threshold, so very few Canberra employers pay it at all. Either way it is not your
              deduction — see the{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">payslip guide</Link> for the
              items that genuinely are.
            </p>
          </section>

          <OtherStatesNav profile={PROFILE} />

          {/* ================================================================= */}
          {/* EMPLOYER SECTION — demoted below the employee content, figures    */}
          {/* preserved exactly as previously published.                        */}
          {/* ================================================================= */}
          <section className="rounded-2xl border border-sandstone-dark/20 bg-white p-6 md:p-8">
            <H2>For employers: payroll tax and premiums in the ACT</H2>
            <p className="mb-6 text-sm text-warmgray-light">
              None of this reduces an employee&apos;s take-home pay.
            </p>

            <H3>What is ACT payroll tax?</H3>
            <p className="mb-4 text-warmgray">ACT payroll tax is <strong>{formatPercent(STATE_PAYROLL_TAX.ACT.rate, 2)}</strong> on taxable wages above a <strong>{formatAUD(STATE_PAYROLL_TAX.ACT.threshold)} annual threshold</strong>, paid exclusively by employers and administered by the ACT Revenue Office.</p>
            <p className="mb-4 text-warmgray">The ACT threshold is among the highest in Australia, exempting the majority of small and medium businesses. Payroll tax does not reduce your take-home pay &mdash; it is an employer-only obligation. However, larger employers factor payroll tax into total employment costs, which indirectly influences salary budgets and hiring capacity.</p>
            {STATE_PAYROLL_TAX.ACT.note && (
              <p className="mb-4 text-sm text-warmgray-light">{STATE_PAYROLL_TAX.ACT.note}</p>
            )}

            <H3>How does ACT payroll tax compare to other states?</H3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm text-left">
                <thead className="bg-sandstone text-navy uppercase tracking-wider text-xs">
                  <tr><th className="px-4 py-3">State / Territory</th><th className="px-4 py-3 text-right">Rate</th><th className="px-4 py-3 text-right">Annual Threshold</th></tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10 text-warmgray">
                  {PAYROLL_COMPARE_ORDER.map((code) => {
                    const s = STATE_PAYROLL_TAX[code];
                    const isHome = code === "ACT";
                    const linkHref: Record<string, string> = {
                      NSW: "/pay-calculator-nsw/",
                      VIC: "/pay-calculator-vic/",
                      QLD: "/pay-calculator-qld/",
                    };
                    const label = linkHref[code] ? (
                      <Link href={linkHref[code]} className="text-eucalyptus-dark hover:underline">{code}</Link>
                    ) : isHome ? "ACT" : code;
                    return (
                      <tr key={code} className={isHome ? "bg-eucalyptus-light/20" : ""}>
                        <td className={`px-4 py-3 ${isHome ? "font-medium text-navy" : ""}`}>{label}</td>
                        <td className={`px-4 py-3 text-right ${isHome ? "font-semibold" : ""}`}>{formatPercent(s.rate, 2)}</td>
                        <td className={`px-4 py-3 text-right ${isHome ? "font-semibold" : ""}`}>{formatAUD(s.threshold)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-warmgray">The ACT&apos;s <strong>{formatAUD(STATE_PAYROLL_TAX.ACT.threshold)}</strong> threshold means a business with a total annual wage bill under that amount pays zero payroll tax. In contrast, a Victorian employer exceeding {formatAUD(STATE_PAYROLL_TAX.VIC.threshold)} in wages already triggers liability at {formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)}.</p>
            <p className="mt-3 text-sm text-warmgray">
              Work injury insurance in the ACT is provided by private licensed insurers and funded by
              employer premiums. Model payroll tax, super and premiums together with the{" "}
              <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link>.
            </p>
          </section>

          <FAQSection>
            <FAQItem value="federal" question="Is income tax different in the ACT?">
              No. Your income tax, Medicare levy, and HECS-HELP obligations are determined by the ATO at the federal level and do not change based on your residential address. Cross-border commuters from Queanbeyan, Yass, or Bungendore pay the same taxation as Canberra residents.
            </FAQItem>
            <FAQItem value="takehome" question="What is the take-home pay on the average Canberra salary?">
              Full-time adults in the ACT earn {formatAUD(PROFILE.awote.personsFullTime, 2)} a week in ordinary time earnings, about {formatAUD(typicalSalary(PROFILE))} a year — the highest in Australia (ABS, {STATE_EMPLOYEE_SOURCES.absReferencePeriod}). The worked example above shows what is left after tax.
            </FAQItem>
            <FAQItem value="holidays" question="Which public holidays are unique to the ACT?">
              Canberra Day, held on the second Monday in March, and Reconciliation Day, held on the first Monday on or after 27 May. Neither is observed in NSW, so a worker based in Canberra gets two penalty-rate days a Queanbeyan colleague does not.
            </FAQItem>
            <FAQItem value="crossborder" question="I live in Queanbeyan but work in Canberra. Which public holidays do I get?">
              The ones where you are based for work. Public holiday entitlements follow the location your job is based in, not where you live or where you happen to be on the day, so an ACT-based role gets the ACT calendar.
            </FAQItem>
            <FAQItem value="lsl" question="When do I get long service leave in the ACT?">
              After 7 years of continuous service you are entitled to 6.0667 weeks of paid leave, plus a further fifth of a month for each subsequent year. A pro-rata payment can be owed from 5 years in defined circumstances. Public sector employees and portable-scheme industries are covered separately.
            </FAQItem>
            <FAQItem value="super" question="Does 15.4% super change my take-home pay?">
              No. Superannuation is paid on top of your salary, not deducted from it, so a higher scheme rate raises your total package without changing your net pay. The calculator above uses the statutory {formatPercent(SUPER_GUARANTEE.rate, 0)} guarantee; adjust the package figure if you are on the APS rate.
            </FAQItem>
            <FAQItem value="payroll" question="Do ACT employees pay payroll tax?">
              No. It is charged to employers whose Australia-wide wages exceed {formatAUD(STATE_PAYROLL_TAX.ACT.threshold)}. It is never deducted from wages and never appears on a payslip.
            </FAQItem>
          </FAQSection>

          <MethodologyDisclosure>
            <p>Income tax, the Medicare levy, HECS-HELP and superannuation are calculated with the site&apos;s federal engine for {SITE_CONFIG.financialYear}; there are no territory-specific individual income taxes. ACT earnings come from the ABS Average Weekly Earnings release for {STATE_EMPLOYEE_SOURCES.absReferencePeriod} (Table 13h, original series). Public holidays come from the Fair Work Ombudsman&apos;s 2026 list, and long service leave from the Long Service Leave Act 1976 as explained by WorkSafe ACT. ACT payroll tax data is sourced from the ACT Revenue Office and describes employer obligations only.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={STATE_EMPLOYEE_SOURCES.verifiedOn} />
        </div>
      </div>
    </div>
  );
}
