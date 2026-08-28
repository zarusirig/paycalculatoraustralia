"use client";

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  SUPER_GUARANTEE,
  STATE_PAYROLL_TAX,
} from "@/lib/constants";
import {
  ABS_NATIONAL_AWOTE_WEEKLY,
  STATE_EMPLOYEE_SOURCES,
  STATE_PROFILES,
  weeklyToAnnualSalary,
  type StateEmployeeProfile,
} from "@/lib/data/state-employee";

/**
 * Shared building blocks for the eight /pay-calculator-<state>/ pages.
 *
 * Every number these render is either read live from the tax engine
 * (`calculatePayBreakdown`) or from the sourced state data in
 * lib/data/state-employee. Nothing is hardcoded into the markup, so a page can
 * never drift out of step with the engine sitting at the top of it.
 */

/** The salary each state's worked example uses: that state's own ABS AWOTE. */
export function typicalSalary(profile: StateEmployeeProfile): number {
  return weeklyToAnnualSalary(profile.awote.personsFullTime, EMPLOYMENT.weeksPerYear);
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      className="mb-4 text-2xl font-semibold text-navy"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 mt-6 text-xl font-semibold text-navy">{children}</h3>;
}

export function FAQItem({
  value,
  question,
  children,
}: {
  value: string;
  question: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={value} className="rounded-xl border border-sandstone-dark/20 px-5">
      <AccordionTrigger className="text-left text-base font-medium text-navy">
        {question}
      </AccordionTrigger>
      <AccordionContent>
        <p className="leading-relaxed text-warmgray">{children}</p>
      </AccordionContent>
    </AccordionItem>
  );
}

export function FAQSection({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <H2>Frequently Asked Questions</H2>
      <Accordion type="multiple" className="space-y-3">
        {children}
      </Accordion>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Worked example — computed from the live engine at the state's ABS salary
// ---------------------------------------------------------------------------

export function WorkedExample({ profile }: { profile: StateEmployeeProfile }) {
  const salary = typicalSalary(profile);
  const r = calculatePayBreakdown({ grossSalary: salary });
  const withHecs = calculatePayBreakdown({ grossSalary: salary, includeHECS: true });

  return (
    <div className="mb-4 rounded-xl border border-sandstone-dark/20 bg-sandstone p-6">
      <h3 className="mb-1 text-lg font-semibold text-navy">
        Worked example: {formatAUD(salary)} {profile.inName}
      </h3>
      <p className="mb-4 text-sm text-warmgray-light">
        {formatAUD(salary)} is what a full-time adult {profile.inName} earns on average before
        overtime — ABS average weekly ordinary time earnings of{" "}
        {formatAUD(profile.awote.personsFullTime, 2)} a week, {STATE_EMPLOYEE_SOURCES.absReferencePeriod},
        over {EMPLOYMENT.weeksPerYear} weeks.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full overflow-hidden rounded-lg border border-sandstone-dark/20 text-sm">
          <tbody className="divide-y divide-sandstone-dark/10">
            <ExRow label="Gross salary" value={formatAUD(r.grossSalary)} />
            <ExRow label="Income tax" value={`− ${formatAUD(r.incomeTax)}`} shaded />
            {r.litoOffset > 0 && (
              <ExRow label="Low income tax offset" value={`+ ${formatAUD(r.litoOffset)}`} />
            )}
            <ExRow
              label={`Medicare levy (${formatPercent(0.02, 0)})`}
              value={`− ${formatAUD(r.medicareLevy)}`}
              shaded={r.litoOffset > 0}
            />
            {r.medicareSurcharge > 0 && (
              <ExRow
                label="Medicare levy surcharge (no hospital cover)"
                value={`− ${formatAUD(r.medicareSurcharge)}`}
              />
            )}
            <ExRow label="Take-home pay" value={formatAUD(r.takeHomePay)} strong />
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-1 text-sm text-warmgray">
        <p>
          That is <strong>{formatAUD(r.weekly, 2)} a week</strong>,{" "}
          <strong>{formatAUD(r.fortnightly, 2)} a fortnight</strong> or{" "}
          <strong>{formatAUD(r.monthly, 2)} a month</strong> in the bank.
        </p>
        <p>
          Effective tax rate <strong>{formatPercent(r.effectiveTaxRate)}</strong>. The next dollar
          you earn is taxed at <strong>{formatPercent(r.marginalTaxRate, 0)}</strong> — that is the
          marginal bracket plus the {formatPercent(0.02, 0)} Medicare levy.
        </p>
        <p>
          Superannuation of <strong>{formatAUD(r.superContribution)}</strong> at{" "}
          {formatPercent(SUPER_GUARANTEE.rate, 0)} is paid by your employer on top, making the
          package <strong>{formatAUD(r.totalPackage)}</strong>.
        </p>
        <p>
          With a HECS-HELP debt, a further{" "}
          <strong>{formatAUD(withHecs.hecsRepayment)}</strong> is withheld and take-home pay falls
          to <strong>{formatAUD(withHecs.takeHomePay)}</strong> —{" "}
          {formatAUD(withHecs.fortnightly, 2)} a fortnight.
        </p>
      </div>
    </div>
  );
}

function ExRow({
  label,
  value,
  strong,
  shaded,
}: {
  label: string;
  value: string;
  strong?: boolean;
  shaded?: boolean;
}) {
  return (
    <tr className={strong ? "bg-eucalyptus-light/30 font-semibold" : shaded ? "bg-white" : "bg-sandstone/50"}>
      <td className="px-4 py-2.5 text-navy">{label}</td>
      <td className="px-4 py-2.5 text-right font-medium text-navy">{value}</td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// ABS earnings — what people in this state actually get paid
// ---------------------------------------------------------------------------

export function AbsEarningsTable({ profile }: { profile: StateEmployeeProfile }) {
  const rows: { label: string; weekly: number; note: string }[] = [
    {
      label: "Full-time adults, ordinary hours",
      weekly: profile.awote.personsFullTime,
      note: "Base pay only — the figure this page's worked example uses",
    },
    {
      label: "Full-time adults, including overtime",
      weekly: profile.awote.personsFullTimeTotal,
      note: "Adds overtime, so it runs ahead of the ordinary-time figure",
    },
    {
      label: "Full-time adult men",
      weekly: profile.awote.malesFullTime,
      note: "Ordinary time earnings",
    },
    {
      label: "Full-time adult women",
      weekly: profile.awote.femalesFullTime,
      note: "Ordinary time earnings",
    },
    {
      label: "All employees, including part-time",
      weekly: profile.awote.allEmployees,
      note: "Pulled down by part-time hours, not by lower rates",
    },
  ];

  const vsNational =
    (profile.awote.personsFullTime - ABS_NATIONAL_AWOTE_WEEKLY) / ABS_NATIONAL_AWOTE_WEEKLY;

  return (
    <>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full overflow-hidden rounded-lg border border-sandstone-dark/20 text-sm">
          <thead>
            <tr className="bg-navy text-white">
              <th className="px-4 py-3 text-left font-semibold">
                {profile.shortName} average weekly earnings
              </th>
              <th className="px-4 py-3 text-right font-semibold">Per week</th>
              <th className="px-4 py-3 text-right font-semibold">Per year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/10">
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-sandstone/50"}>
                <td className="px-4 py-2.5 text-navy">
                  {row.label}
                  <span className="block text-xs text-warmgray-light">{row.note}</span>
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-navy">
                  {formatAUD(row.weekly, 2)}
                </td>
                <td className="px-4 py-2.5 text-right text-warmgray">
                  {formatAUD(weeklyToAnnualSalary(row.weekly, EMPLOYMENT.weeksPerYear))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-warmgray">
        Full-time adults {profile.inName} earn{" "}
        <strong>
          {vsNational >= 0 ? "" : "−"}
          {formatPercent(Math.abs(vsNational))}
        </strong>{" "}
        {vsNational >= 0 ? "more than" : "less than"} the national average of{" "}
        {formatAUD(ABS_NATIONAL_AWOTE_WEEKLY, 2)} a week. Source: ABS Average Weekly Earnings,{" "}
        {STATE_EMPLOYEE_SOURCES.absReferencePeriod}, released{" "}
        {STATE_EMPLOYEE_SOURCES.absReleasedOn} (Table 13, original series). Read on{" "}
        {STATE_EMPLOYEE_SOURCES.verifiedOn}.
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
// Public holidays — the only thing that genuinely changes penalty rates by state
// ---------------------------------------------------------------------------

export function PublicHolidayTable({ profile }: { profile: StateEmployeeProfile }) {
  const stateOnly = profile.publicHolidays2026.filter((h) => h.stateSpecific);

  return (
    <>
      <p className="mb-4 text-warmgray">
        {profile.name} publishes <strong>{profile.publicHolidays2026.length}</strong> public
        holidays for 2026, and <strong>{stateOnly.length}</strong> of them are not observed
        Australia-wide. Those are the days a worker one state over does not get paid a penalty rate
        for. The days marked <em>{profile.shortName} only</em> below are the difference.
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full overflow-hidden rounded-lg border border-sandstone-dark/20 text-sm">
          <thead>
            <tr className="bg-navy text-white">
              <th className="px-4 py-3 text-left font-semibold">2026 date</th>
              <th className="px-4 py-3 text-left font-semibold">Public holiday</th>
              <th className="px-4 py-3 text-right font-semibold">Observed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/10">
            {profile.publicHolidays2026.map((h, i) => (
              <tr
                key={`${h.date}-${h.name}`}
                className={h.stateSpecific ? "bg-eucalyptus-light/20" : i % 2 === 0 ? "bg-white" : "bg-sandstone/50"}
              >
                <td className="whitespace-nowrap px-4 py-2.5 text-navy">{h.date}</td>
                <td className="px-4 py-2.5 text-navy">
                  {h.name}
                  {h.note && <span className="block text-xs text-warmgray-light">{h.note}</span>}
                </td>
                <td className="px-4 py-2.5 text-right text-xs text-warmgray">
                  {h.stateSpecific ? (
                    <span className="font-semibold text-eucalyptus-dark">
                      {profile.shortName} only
                    </span>
                  ) : (
                    "Nationwide"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-warmgray">
        Source: Fair Work Ombudsman,{" "}
        <a
          href={STATE_EMPLOYEE_SOURCES.fwoPublicHolidays}
          target="_blank"
          rel="noreferrer noopener"
          className="text-eucalyptus-dark hover:underline"
        >
          2026 public holidays
        </a>
        , read {STATE_EMPLOYEE_SOURCES.verifiedOn}. Regional and part-day variations apply — check
        with {profile.name} for the list that covers your town.
      </p>
    </>
  );
}

export function PenaltyRateNote({ profile }: { profile: StateEmployeeProfile }) {
  return (
    <div className="mt-4 rounded-r-lg border-l-4 border-eucalyptus bg-sandstone p-4">
      <p className="mb-2 font-medium text-navy">Why the {profile.shortName} list matters to your pay</p>
      <p className="mb-2 text-sm text-navy">
        Under most modern awards, working a public holiday attracts a penalty of{" "}
        <strong>{formatPercent(EMPLOYMENT.penaltyRates.publicHolidayMin, 0)}</strong> to{" "}
        <strong>{formatPercent(EMPLOYMENT.penaltyRates.publicHolidayMax, 0)}</strong> of your base
        rate, and if you do not work you are still entitled to be absent without losing pay. You
        are entitled to the public holidays where you are <em>based</em> for work, not where you
        happen to be standing on the day.
      </p>
      <p className="text-sm text-navy">
        Work out what a holiday shift is actually worth with the{" "}
        <Link href="/overtime-pay-calculator/" className="text-eucalyptus-dark hover:underline">
          overtime and penalty rate calculator
        </Link>
        , or read the{" "}
        <Link href="/overtime-penalty-rates-guide/" className="text-eucalyptus-dark hover:underline">
          penalty rates guide
        </Link>
        .
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Long service leave
// ---------------------------------------------------------------------------

export function LongServiceLeaveBlock({ profile }: { profile: StateEmployeeProfile }) {
  const lsl = profile.longServiceLeave;
  return (
    <>
      <p className="mb-4 text-warmgray">{lsl.summary}</p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full overflow-hidden rounded-lg border border-sandstone-dark/20 text-sm">
          <tbody className="divide-y divide-sandstone-dark/10">
            <tr className="bg-white">
              <td className="px-4 py-2.5 text-navy">Governing law</td>
              <td className="px-4 py-2.5 text-right font-medium text-navy">{lsl.act}</td>
            </tr>
            <tr className="bg-sandstone/50">
              <td className="px-4 py-2.5 text-navy">Service before you can take leave</td>
              <td className="px-4 py-2.5 text-right font-medium text-navy">
                {lsl.takeAfterYears} years
              </td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-2.5 text-navy">Leave at that point</td>
              <td className="px-4 py-2.5 text-right font-medium text-navy">
                {lsl.weeksAtEntitlement} weeks
              </td>
            </tr>
            <tr className="bg-sandstone/50">
              <td className="px-4 py-2.5 text-navy">After that</td>
              <td className="px-4 py-2.5 text-right text-warmgray">{lsl.thereafter}</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-2.5 text-navy">Pro-rata payment when the job ends</td>
              <td className="px-4 py-2.5 text-right font-medium text-navy">
                {lsl.proRataOnEndingYears === null
                  ? "Not available"
                  : `From ${lsl.proRataOnEndingYears} years`}
              </td>
            </tr>
            <tr className="bg-sandstone/50">
              <td className="px-4 py-2.5 text-navy">Who to ask</td>
              <td className="px-4 py-2.5 text-right font-medium text-navy">
                <a
                  href={lsl.agencyUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-eucalyptus-dark hover:underline"
                >
                  {lsl.agency}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-warmgray">
        Long service leave is paid at your ordinary rate, so the calculator at the top of this page
        tells you what a week of it is worth after tax. A lump sum paid out when you leave is taxed
        differently — see the{" "}
        <Link href="/final-pay-calculator/" className="text-eucalyptus-dark hover:underline">
          final pay calculator
        </Link>
        . Source: {lsl.agency}, read {STATE_EMPLOYEE_SOURCES.verifiedOn}.
      </p>
    </>
  );
}

/**
 * Forward links into the /long-service-leave-calculator/ cluster being built in
 * parallel. These routes DO NOT EXIST YET — they are listed in the G6 manifest
 * under `forwardLinks` and must be verified before this ships.
 */
export function ForwardLslLinks({ profile }: { profile: StateEmployeeProfile }) {
  return (
    <div
      className="mt-4 rounded-r-lg border-l-4 border-sandstone-dark/40 bg-sandstone/60 p-4"
      data-forward-links="long-service-leave-calculator"
    >
      <p className="mb-2 text-sm font-medium text-navy">
        Coming soon: {profile.shortName} long service leave calculator
      </p>
      <p className="text-sm text-warmgray">
        We are building a calculator for each state&apos;s long service leave rules. The{" "}
        <Link href={profile.lslCalculatorPath} className="text-eucalyptus-dark hover:underline">
          {profile.name} long service leave calculator
        </Link>{" "}
        will work out your accrued weeks and what they are worth after tax. Until it lands, use{" "}
        <Link href="/leave-calculator/" className="text-eucalyptus-dark hover:underline">
          the leave calculator
        </Link>{" "}
        or go straight to{" "}
        <a
          href={profile.longServiceLeave.agencyUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-eucalyptus-dark hover:underline"
        >
          {profile.longServiceLeave.agency}
        </a>
        .
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payroll tax, framed for the employee reading the page
// ---------------------------------------------------------------------------

export function PayrollTaxForEmployees({ profile }: { profile: StateEmployeeProfile }) {
  const pt = STATE_PAYROLL_TAX[profile.code];
  return (
    <div className="rounded-r-lg border-l-4 border-navy/30 bg-sandstone p-4">
      <p className="mb-2 font-medium text-navy">
        Does {profile.shortName} payroll tax come out of your pay? No.
      </p>
      <p className="text-sm text-navy">
        It is a cost of hiring you, not a deduction from you. Once an employer&apos;s Australian
        wage bill passes <strong>{formatAUD(pt.threshold)}</strong> a year it starts paying{" "}
        <strong>{formatPercent(pt.rate, 2)}</strong> to the {profile.name} revenue office on the
        excess. That never appears on your payslip and never reduces your gross salary. If you see a
        deduction you cannot account for, the full employer-side detail is further down this page.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cross-links between the eight state pages (real anchors, not a JS menu)
// ---------------------------------------------------------------------------

const STATE_LINKS: readonly { code: string; href: string }[] = [
  { code: "NSW", href: "/pay-calculator-nsw/" },
  { code: "VIC", href: "/pay-calculator-vic/" },
  { code: "QLD", href: "/pay-calculator-qld/" },
  { code: "WA", href: "/pay-calculator-wa/" },
  { code: "SA", href: "/pay-calculator-sa/" },
  { code: "TAS", href: "/pay-calculator-tas/" },
  { code: "ACT", href: "/pay-calculator-act/" },
  { code: "NT", href: "/pay-calculator-nt/" },
];

export function OtherStatesNav({ profile }: { profile: StateEmployeeProfile }) {
  return (
    <section className="rounded-xl border border-sandstone-dark/20 bg-sandstone/50 p-6">
      <h2 className="mb-2 text-lg font-semibold text-navy">Pay calculators for other states</h2>
      <p className="mb-3 text-sm text-warmgray">
        Income tax is identical everywhere in Australia. What changes is the public holiday
        calendar, the long service leave Act and the payroll tax your employer pays.
      </p>
      <ul className="flex flex-wrap gap-2 text-sm">
        {STATE_LINKS.filter((s) => s.code !== profile.code).map((s) => (
          <li key={s.code}>
            <Link
              href={s.href}
              className="inline-block rounded-full border border-sandstone-dark/30 bg-white px-3 py-1.5 text-navy transition-colors hover:border-eucalyptus hover:text-eucalyptus-dark"
            >
              Pay calculator {s.code}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/take-home-pay-calculator/"
            className="inline-block rounded-full border border-sandstone-dark/30 bg-white px-3 py-1.5 text-navy transition-colors hover:border-eucalyptus hover:text-eucalyptus-dark"
          >
            Australia-wide take-home pay calculator
          </Link>
        </li>
      </ul>
    </section>
  );
}

export { STATE_PROFILES };
