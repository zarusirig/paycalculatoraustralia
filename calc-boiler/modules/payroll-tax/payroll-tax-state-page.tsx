import Link from "next/link";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import {
  PAYROLL_TAX_FY,
  PAYROLL_TAX_STATES,
  calculatePayrollTax,
  type PayrollTaxStateCode,
} from "@/lib/constants/payroll-tax";
import PayrollTaxCalculator from "./payroll-tax-calculator";
import { exampleRows, stateFaqs } from "./content";
import { pctTrim } from "./format";
import { Breadcrumb, FaqList, H2_STYLE, RelatedCard, StateLinksNav } from "./sections";
import { PAYROLL_TAX_STATE_DETAIL, PAYROLL_TAX_STATE_DETAIL_VERIFIED_ON } from "./state-detail";
import FeaturedImage from "@/components/common/featured-image";

/** State-specific paragraph for the "how it is calculated" section. */
const HOW_NOTE: Record<PayrollTaxStateCode, string> = {
  nsw: "NSW is the simplest system in the country: the threshold never phases out, so every NSW-only employer over $1.2 million pays 5.45% on the excess.",
  vic: "The phase-out means the threshold falls by 50 cents for each dollar of Australian wages above $3 million. A Victoria-only employer can shortcut it as ($5 million − wages) × 50%.",
  qld: "The deduction is worked out on Australian wages first — $1.3 million less one-seventh of wages above $1.3 million — and then multiplied by the Queensland share.",
  wa: "WA's deductable amount is $1 million − (Australian wages − $1 million) × 2/13, multiplied by the WA share. It is zero from $7.5 million.",
  sa: "Two steps: the rate is set by total Australian wages (0% to 4.95% between $1.5 million and $1.7 million), then applied to SA wages less the $600,000 deduction (SA share).",
  tas: "Above $2 million of Australian wages: 4% on the gap between the two apportioned thresholds, plus 6.1% on Tasmanian wages above the apportioned $2 million.",
  act: "Find your band from total Australia-wide wages, then apply that single rate to ACT wages less the apportioned $1.75 million.",
  nt: "The $2.5 million falls by $1 for every $2 of Australian wages above $2.5 million; the NT share of what is left is deducted, and 5.5% (or 6.5% from $100 million) applies to the rest.",
};

export default function PayrollTaxStatePage({ code }: { code: PayrollTaxStateCode }) {
  const s = PAYROLL_TAX_STATES[code];
  const d = PAYROLL_TAX_STATE_DETAIL[code];
  const rows = exampleRows(code);
  const ex3 = calculatePayrollTax({ state: code, stateWages: 3_000_000 });
  const faqs = stateFaqs(code);
  const authorship = getGuideAuthorship("payroll-tax");
  // "the State Revenue Office Victoria", but "Revenue NSW", "RevenueSA", "RevenueWA (…)".
  const office = /^Revenue/.test(s.revenueOffice) ? s.revenueOffice : `the ${s.revenueOffice}`;
  const sources: SourceLink[] = [
    { title: `${s.name} payroll tax rates and thresholds`, url: s.ratesUrl, publisher: s.revenueOffice },
    ...d.sources.filter((x) => x.url !== s.ratesUrl),
  ];

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: "/payroll-tax/", label: "Payroll Tax" },
            { label: `${s.abbr} Payroll Tax` },
          ]}
        />

        <header className="mb-8 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H2_STYLE}>
            {s.abbr} Payroll Tax {PAYROLL_TAX_FY}: Rate, Threshold and Calculator
          </h1>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> {s.name} payroll tax for {PAYROLL_TAX_FY} is{" "}
              <strong>{s.headlineRate}</strong> on taxable wages above a <strong>{formatAUD(s.annualThreshold)}</strong>{" "}
              annual threshold (monthly: {s.monthlyThresholdText}). A business paying {formatAUD(3_000_000)} of wages
              only in {s.abbr} pays <strong>{formatAUD(ex3.total)}</strong> for the year. It is paid by employers to
              {office}; nothing is deducted from employees&rsquo; pay.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-12">
          <PayrollTaxCalculator defaultState={code} defaultWages={3_000_000} title={`${s.abbr} Payroll Tax Calculator ${PAYROLL_TAX_FY}`} />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <FeaturedImage placement="content" className="mt-0" />
            <section id="rate">
              <h2 style={H2_STYLE}>{s.abbr} Payroll Tax Rate {PAYROLL_TAX_FY}</h2>
              <p>{s.rateSummary}</p>
              {s.changeFrom2025_26 && <p><strong>What changed on 1 July 2026:</strong> {s.changeFrom2025_26}</p>}
            </section>

            <section id="threshold">
              <h2 style={H2_STYLE}>{s.abbr} Payroll Tax Threshold</h2>
              <ul>
                <li><strong>Annual:</strong> {formatAUD(s.annualThreshold)} of Australian taxable wages</li>
                <li><strong>Monthly:</strong> {s.monthlyThresholdText}</li>
              </ul>
              <p>{s.thresholdSummary}</p>
              <p>{HOW_NOTE[code]}</p>
            </section>

            <section id="calculate">
              <h2 style={H2_STYLE}>{s.abbr} Payroll Tax Worked Examples</h2>
              {d.workedExample.map((t) => (
                <p key={t}>{t}</p>
              ))}
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                  <caption className="sr-only">{s.abbr} payroll tax at four wage bills, {PAYROLL_TAX_FY}</caption>
                  <thead className="bg-sandstone font-semibold">
                    <tr>
                      <th scope="col" className="px-4 py-3">{s.abbr} wages (all in {s.abbr})</th>
                      <th scope="col" className="px-4 py-3 text-right">Threshold / deduction</th>
                      <th scope="col" className="px-4 py-3 text-right">Payroll tax{code === "vic" || code === "qld" ? " incl. surcharge" : ""}</th>
                      <th scope="col" className="px-4 py-3 text-right">Effective rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {rows.map((r) => (
                      <tr key={r.stateWages}>
                        <th scope="row" className="px-4 py-3 text-left font-medium">{formatAUD(r.stateWages)}</th>
                        <td className="px-4 py-3 text-right tabular-nums">{r.overThreshold ? formatAUD(r.deduction) : "—"}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatAUD(r.total)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{pctTrim(r.effectiveRate, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="levies">
              <h2 style={H2_STYLE}>{d.leviesHeading}</h2>
              {d.levies.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </section>

            <section id="grouping">
              <h2 style={H2_STYLE}>Grouping Rules in {s.name}</h2>
              {d.grouping.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </section>

            <section id="contractors">
              <h2 style={H2_STYLE}>{d.contractorsHeading}</h2>
              {d.contractors.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </section>

            <section id="lodging">
              <h2 style={H2_STYLE}>Registering, Lodging and Paying in {s.abbr}</h2>
              <p>{s.registration}</p>
              <ul>
                <li><strong>Monthly returns:</strong> {s.monthlyDue}</li>
                <li><strong>Annual return for {PAYROLL_TAX_FY}:</strong> {s.annualDue}</li>
              </ul>
              {d.lodgement.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </section>

            <p>
              What counts as wages, why employees never pay it and how {s.abbr} compares with the other states are the
              same everywhere, so they are covered once on the{" "}
              <Link href="/payroll-tax/#taxable-wages">payroll tax hub</Link> and in the{" "}
              <Link href="/payroll-tax/#compare">state-by-state comparison</Link>. For an employee&rsquo;s take-home pay
              use the <Link href={s.payCalculatorPath}>{s.abbr} pay calculator</Link>; for the full cost of a hire, the{" "}
              <Link href="/employer-cost-calculator/">employer cost calculator</Link>.
            </p>

            <FaqList faqs={faqs} />

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these figures are worked out">
                <p>
                  {s.abbr} payroll tax is administered by {office} under the {d.legislation}. The rate,
                  thresholds and rules on this page were read from its own pages on{" "}
                  {PAYROLL_TAX_STATE_DETAIL_VERIFIED_ON}. The calculator assumes a full {PAYROLL_TAX_FY} year with the
                  threshold claimed in full and no exempt wages; the revenue office&rsquo;s worked examples above are
                  pinned against it in the test suite.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={PAYROLL_TAX_STATE_DETAIL_VERIFIED_ON} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <RelatedCard
                links={[
                  { href: "/payroll-tax-calculator/", label: "Payroll Tax Calculator (all states)" },
                  { href: "/payroll-tax/", label: "Payroll Tax Rates by State" },
                  { href: "/employer-cost-calculator/", label: "Employer Cost Calculator" },
                  { href: s.payCalculatorPath, label: `Pay Calculator ${s.abbr}` },
                  { href: `/long-service-leave-calculator/${code}/`, label: `Long Service Leave ${s.abbr}` },
                ]}
              />
              <StateLinksNav current={code} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
