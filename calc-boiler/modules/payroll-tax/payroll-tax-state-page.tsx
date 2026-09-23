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
  PAYROLL_TAX_AUSTRALIA_URL,
  calculatePayrollTax,
  type PayrollTaxStateCode,
} from "@/lib/constants/payroll-tax";
import PayrollTaxCalculator from "./payroll-tax-calculator";
import { INTERSTATE_EXAMPLE, billLabel, exampleRows, interstateExample, stateFaqs } from "./content";
import { pctTrim } from "./format";
import {
  Breadcrumb,
  FaqList,
  H2_STYLE,
  LAST_VERIFIED,
  RatesTable,
  RelatedCard,
  StateLinksNav,
  TaxableWagesList,
} from "./sections";

/** Pages each state's figures were read from (23 Sep 2026), beyond the rates page. */
const EXTRA_SOURCES: Record<PayrollTaxStateCode, SourceLink[]> = {
  nsw: [
    { title: "Key dates for payroll tax", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/lodge-and-pay-returns/key-dates", publisher: "Revenue NSW" },
    { title: "Register for payroll tax", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/registration/register-for-payroll-tax", publisher: "Revenue NSW" },
  ],
  vic: [
    { title: "Threshold and phase-out rate", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/thresholds-and-grouping/threshold-and-phase-out-rate", publisher: "State Revenue Office Victoria" },
    { title: "Payroll tax surcharges", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/thresholds-and-grouping/payroll-tax-surcharges", publisher: "State Revenue Office Victoria" },
    { title: "Regional employers", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/industries-and-locations/regional-employers", publisher: "State Revenue Office Victoria" },
    { title: "Lodge your monthly return", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/managing-your-payroll-tax/lodge-your-monthly-return", publisher: "State Revenue Office Victoria" },
  ],
  qld: [
    { title: "Payroll tax deductions", url: "https://qro.qld.gov.au/payroll-tax/calculate/deductions/", publisher: "Queensland Revenue Office" },
    { title: "Payroll tax discount for regional businesses", url: "https://qro.qld.gov.au/payroll-tax/calculate/regional-discount/", publisher: "Queensland Revenue Office" },
    { title: "Calculating the mental health levy", url: "https://qro.qld.gov.au/payroll-tax/mental-health-levy/calculating/", publisher: "Queensland Revenue Office" },
    { title: "Payroll tax due dates", url: "https://qro.qld.gov.au/payroll-tax/returns/due-dates/", publisher: "Queensland Revenue Office" },
  ],
  wa: [
    { title: "Local non-group employer: payroll tax", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/calculation-payroll-tax-employer-guide/local-non-group-employer-payroll-tax", publisher: "Department of Treasury and Finance WA" },
    { title: "Interstate non-group employer: payroll tax", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/calculation-payroll-tax-employer-guide/interstate-non-group-employer-payroll-tax", publisher: "Department of Treasury and Finance WA" },
    { title: "Registration: Payroll Tax Employer Guide", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/registration-payroll-tax-employer-guide", publisher: "Department of Treasury and Finance WA" },
  ],
  sa: [
    { title: "How is payroll tax calculated?", url: "https://www.revenuesa.sa.gov.au/payrolltax/how-is-payroll-tax-calculated", publisher: "RevenueSA" },
    { title: "Payroll Tax Rate Table (from 1 January 2019)", url: "https://www.revenuesa.sa.gov.au/__data/assets/pdf_file/0007/205459/PRT-Rate-Table.pdf", publisher: "RevenueSA" },
  ],
  tas: [
    { title: "Lodge your return", url: "https://www.sro.tas.gov.au/payroll-tax/lodge-your-return", publisher: "State Revenue Office Tasmania" },
    { title: "Payroll tax annual adjustment return guideline", url: "https://www.sro.tas.gov.au/Documents/Annual-Adjustment-Return-Guideline.pdf", publisher: "State Revenue Office Tasmania" },
  ],
  act: [
    { title: "Calculating payroll tax", url: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax/calculating-payroll-tax", publisher: "ACT Revenue Office" },
    { title: "Lodging returns", url: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax/lodging-returns", publisher: "ACT Revenue Office" },
  ],
  nt: [
    { title: "Payroll tax (rates, due dates and 1 July 2026 changes)", url: "https://treasury.nt.gov.au/dtf/territory-revenue-office/payroll-tax", publisher: "Territory Revenue Office" },
    { title: "Payroll tax guide for NT employers and businesses", url: "https://treasury.nt.gov.au/pms/tro/information/I-PRT-001.pdf", publisher: "Territory Revenue Office" },
  ],
};

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
  const rows = exampleRows(code);
  const inter = interstateExample(code);
  const ex3 = calculatePayrollTax({ state: code, stateWages: 3_000_000 });
  const faqs = stateFaqs(code);
  const authorship = getGuideAuthorship("payroll-tax");
  const sources: SourceLink[] = [
    { title: `${s.name} payroll tax rates and thresholds`, url: s.ratesUrl, publisher: s.revenueOffice },
    ...EXTRA_SOURCES[code],
    { title: "Lodging payroll tax returns", url: PAYROLL_TAX_AUSTRALIA_URL, publisher: "Payroll Tax Australia" },
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
              the {s.revenueOffice}; nothing is deducted from employees&rsquo; pay.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-12">
          <PayrollTaxCalculator defaultState={code} defaultWages={3_000_000} title={`${s.abbr} Payroll Tax Calculator ${PAYROLL_TAX_FY}`} />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="rate">
              <h2 style={H2_STYLE}>{s.abbr} Payroll Tax Rate {PAYROLL_TAX_FY}</h2>
              <p>{s.rateSummary}</p>
              {s.extras && <p><strong>Surcharges and concessions:</strong> {s.extras}</p>}
              {s.changeFrom2025_26 && <p><strong>What changed on 1 July 2026:</strong> {s.changeFrom2025_26}</p>}
            </section>

            <section id="threshold">
              <h2 style={H2_STYLE}>{s.abbr} Payroll Tax Threshold</h2>
              <ul>
                <li><strong>Annual:</strong> {formatAUD(s.annualThreshold)} of Australian taxable wages</li>
                <li><strong>Monthly:</strong> {s.monthlyThresholdText}</li>
              </ul>
              <p>{s.thresholdSummary}</p>
            </section>

            <section id="calculate">
              <h2 style={H2_STYLE}>How to Calculate {s.abbr} Payroll Tax</h2>
              <p>{HOW_NOTE[code]}</p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                  <caption className="sr-only">{s.abbr} payroll tax at four wage bills, {PAYROLL_TAX_FY}</caption>
                  <thead className="bg-sandstone font-semibold">
                    <tr>
                      <th scope="col" className="px-4 py-3">{s.abbr} wages (all in {s.abbr})</th>
                      <th scope="col" className="px-4 py-3 text-right">Threshold / deduction</th>
                      <th scope="col" className="px-4 py-3 text-right">Payroll tax{s.extras && code !== "act" ? " incl. surcharge" : ""}</th>
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
              <p>
                <strong>Interstate example:</strong> an employer paying {formatAUD(INTERSTATE_EXAMPLE.stateWages)} in{" "}
                {s.abbr} out of {formatAUD(INTERSTATE_EXAMPLE.australianWages)} Australia-wide ({pctTrim(inter.share, 0)} in{" "}
                {s.abbr}) gets a threshold or deduction of {formatAUD(inter.deduction)} and pays{" "}
                {formatAUD(inter.total)} in {s.abbr}. It also pays payroll tax in the other states on the other{" "}
                {billLabel(INTERSTATE_EXAMPLE.australianWages - INTERSTATE_EXAMPLE.stateWages)}.
              </p>
            </section>

            <section id="register">
              <h2 style={H2_STYLE}>Who Must Register for {s.abbr} Payroll Tax</h2>
              <p>{s.registration}</p>
              <p>
                The test uses total Australian wages, including every business you are grouped with, so an employer
                with a small {s.abbr} payroll can still be liable. Grouped businesses add their wages together, and
                only the designated group employer claims the threshold.
              </p>
            </section>

            <section id="due-dates">
              <h2 style={H2_STYLE}>{s.abbr} Payroll Tax Due Dates {PAYROLL_TAX_FY}</h2>
              <ul>
                <li><strong>Monthly returns:</strong> {s.monthlyDue}</li>
                <li><strong>Annual reconciliation:</strong> {s.annualDue}</li>
              </ul>
              <p>
                Returns are lodged and paid online with the <a href={s.revenueOfficeUrl} target="_blank" rel="noreferrer noopener">{s.revenueOffice}</a>.
                Late payment attracts interest and penalty tax.
              </p>
            </section>

            <section id="taxable-wages">
              <h2 style={H2_STYLE}>What Counts as Wages for {s.abbr} Payroll Tax</h2>
              <TaxableWagesList />
            </section>

            <section id="employees">
              <h2 style={H2_STYLE}>{s.abbr} Payroll Tax and Your Employees</h2>
              <p>
                Payroll tax is an on-cost, like super and {s.workersComp} workers compensation premiums: the employer
                pays it on top of wages and none of it is withheld from pay. Employees who want their own figures should
                use the <Link href={s.payCalculatorPath}>{s.abbr} pay calculator</Link> for take-home pay. For the full
                cost of a hire — salary, super, leave and payroll tax — use the{" "}
                <Link href="/employer-cost-calculator/">employer cost calculator</Link>.
              </p>
            </section>

            <section id="compare">
              <h2 style={H2_STYLE}>{s.abbr} Compared With Other States</h2>
              <RatesTable highlight={code} />
            </section>

            <FaqList faqs={faqs} />

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these figures are worked out">
                <p>
                  Rates, thresholds and rules come from the {s.revenueOffice} and were checked on {LAST_VERIFIED}. The
                  calculator and tables assume a full {PAYROLL_TAX_FY} year of wages with the threshold claimed in full
                  (by the designated group employer, for a group) and no exemptions. They do not model part-year
                  employers or monthly returns; the {s.revenueOffice}&rsquo;s online return is the final word. The
                  engine is tested against the worked examples the revenue offices publish.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={LAST_VERIFIED} />
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
