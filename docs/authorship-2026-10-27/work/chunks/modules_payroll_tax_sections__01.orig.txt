import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatAUD } from "@/lib/constants";
import {
  PAYROLL_TAX_STATE_CODES,
  PAYROLL_TAX_STATES,
  PAYROLL_TAX_VERIFIED_ON,
  PAYROLL_TAX_AUSTRALIA_URL,
  type PayrollTaxStateCode,
} from "@/lib/constants/payroll-tax";
import type { SourceLink } from "@/components/common/source-attribution";
import { EXAMPLE_BILLS, billLabel, comparisonAt, type Faq } from "./content";

export const H2_STYLE = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

export function Breadcrumb({ trail }: { trail: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-x-1">
            {i > 0 && <ChevronRight className="h-3 w-3 text-warmgray-light" />}
            {t.href ? (
              <Link href={t.href} className="hover:text-eucalyptus-dark hover:underline">{t.label}</Link>
            ) : (
              <span className="font-medium text-navy" aria-current="page">{t.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Rates and thresholds for all eight jurisdictions. */
export function RatesTable({ highlight }: { highlight?: PayrollTaxStateCode }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full min-w-[40rem] text-left text-sm text-navy">
        <caption className="sr-only">Payroll tax rates and thresholds by state, 2026-27</caption>
        <thead className="bg-sandstone font-semibold">
          <tr>
            <th scope="col" className="px-4 py-3">State</th>
            <th scope="col" className="px-4 py-3">Rate</th>
            <th scope="col" className="px-4 py-3">Annual threshold</th>
            <th scope="col" className="px-4 py-3">Threshold phase-out / extras</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {PAYROLL_TAX_STATE_CODES.map((c) => {
            const s = PAYROLL_TAX_STATES[c];
            return (
              <tr key={c} className={c === highlight ? "bg-eucalyptus-light/20 font-medium" : undefined}>
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  <Link href={`/payroll-tax/${c}/`} className="text-eucalyptus-dark hover:underline">{s.abbr} payroll tax</Link>
                </th>
                <td className="px-4 py-3 whitespace-nowrap">{s.headlineRate}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatAUD(s.annualThreshold)}</td>
                <td className="px-4 py-3 text-warmgray">{PHASE_NOTE[c]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const PHASE_NOTE: Record<PayrollTaxStateCode, string> = {
  nsw: "No phase-out; no surcharge",
  vic: "Phases out $3m–$5m; 1.2125% regional rate; surcharges from $10m",
  qld: "4.95% above $6.5m; deduction nil at $10.4m; regional discount; mental health levy from $10m",
  wa: "Diminishes to nil at $7.5m",
  sa: "Rate phases in 0%–4.95% between $1.5m and $1.7m; $600k deduction",
  tas: "4% from $1.25m to $2m, 6.1% above",
  act: "Rate rises in bands to 8.75% above $150m",
  nt: "Tapers to nil at $7.5m; 6.5% from $100m",
};

/** Liability at four wage bills in every state (single-state employer, full year). */
export function ComparisonGrid({ highlight }: { highlight?: PayrollTaxStateCode }) {
  const cols = EXAMPLE_BILLS.map((w) => ({ w, rows: comparisonAt(w) }));
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full min-w-[36rem] text-left text-sm text-navy">
        <caption className="sr-only">Annual payroll tax by state at four wage bills</caption>
        <thead className="bg-sandstone font-semibold">
          <tr>
            <th scope="col" className="px-4 py-3">State</th>
            {EXAMPLE_BILLS.map((w) => (
              <th key={w} scope="col" className="px-4 py-3 text-right">{billLabel(w)} wages</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {PAYROLL_TAX_STATE_CODES.map((c) => (
            <tr key={c} className={c === highlight ? "bg-eucalyptus-light/20 font-medium" : undefined}>
              <th scope="row" className="px-4 py-3 text-left font-medium">{PAYROLL_TAX_STATES[c].abbr}</th>
              {cols.map(({ w, rows }) => {
                const hit = rows.find((x) => x.code === c)!;
                return (
                  <td key={w} className="px-4 py-3 text-right tabular-nums">{formatAUD(hit.r.total)}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TaxableWagesList() {
  return (
    <>
      <p>
        Payroll tax law is harmonised across the states on what counts as wages, so the list is broadly the same
        everywhere. Taxable wages include:
      </p>
      <ul>
        <li>salaries, wages, commissions, bonuses and allowances;</li>
        <li>employer superannuation contributions;</li>
        <li>fringe benefits and employee share scheme benefits;</li>
        <li>director&rsquo;s fees and termination payments such as paid-out leave;</li>
        <li>payments to many contractors (the &ldquo;relevant contract&rdquo; rules) and to employment agencies, unless an exemption applies.</li>
      </ul>
      <p>
        Commonly exempt: government Paid Parental Leave, paid parental leave the employer provides (within limits),
        workers compensation payments, and the tax-free part of a genuine redundancy payment. Exemptions and their
        limits do differ by state, so check the revenue office&rsquo;s list before you rely on one.
      </p>
    </>
  );
}

export function StateLinksNav({ current }: { current?: PayrollTaxStateCode }) {
  return (
    <section className="not-prose rounded-xl border border-sandstone-dark/20 bg-sandstone/50 p-6">
      <h2 className="mb-2 text-lg font-semibold text-navy">Payroll tax by state</h2>
      <ul className="flex flex-wrap gap-2 text-sm">
        {PAYROLL_TAX_STATE_CODES.filter((c) => c !== current).map((c) => (
          <li key={c}>
            <Link
              href={`/payroll-tax/${c}/`}
              className="inline-block rounded-full border border-sandstone-dark/30 bg-white px-3 py-1.5 text-navy transition-colors hover:border-eucalyptus hover:text-eucalyptus-dark"
            >
              {PAYROLL_TAX_STATES[c].abbr} payroll tax
            </Link>
          </li>
        ))}
        <li>
          <Link href="/payroll-tax/" className="inline-block rounded-full border border-sandstone-dark/30 bg-white px-3 py-1.5 text-navy transition-colors hover:border-eucalyptus hover:text-eucalyptus-dark">
            All states compared
          </Link>
        </li>
        <li>
          <Link href="/payroll-tax-calculator/" className="inline-block rounded-full border border-sandstone-dark/30 bg-white px-3 py-1.5 text-navy transition-colors hover:border-eucalyptus hover:text-eucalyptus-dark">
            Payroll tax calculator
          </Link>
        </li>
      </ul>
    </section>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq">
      <h2 style={H2_STYLE}>Frequently Asked Questions</h2>
      {faqs.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </section>
  );
}

export function RelatedCard({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-6">
      <h2 className="mb-3 font-bold text-navy">Related</h2>
      <div className="space-y-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
          >
            <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{l.label}</span>
            <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Every revenue office's rates page, plus Payroll Tax Australia. */
export function allStateSources(): SourceLink[] {
  return [
    ...PAYROLL_TAX_STATE_CODES.map((c) => ({
      title: `${PAYROLL_TAX_STATES[c].name} payroll tax rates and thresholds`,
      url: PAYROLL_TAX_STATES[c].ratesUrl,
      publisher: PAYROLL_TAX_STATES[c].revenueOffice,
    })),
    { title: "Lodging payroll tax returns", url: PAYROLL_TAX_AUSTRALIA_URL, publisher: "Payroll Tax Australia (state and territory revenue offices)" },
  ];
}

export const LAST_VERIFIED = PAYROLL_TAX_VERIFIED_ON;
