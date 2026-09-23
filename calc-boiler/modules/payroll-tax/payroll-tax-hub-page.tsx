import Link from "next/link";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import { PAYROLL_TAX_FY, PAYROLL_TAX_STATE_CODES, PAYROLL_TAX_STATES } from "@/lib/constants/payroll-tax";
import { HUB_FAQS } from "./content";
import {
  Breadcrumb,
  ComparisonGrid,
  FaqList,
  H2_STYLE,
  LAST_VERIFIED,
  RatesTable,
  RelatedCard,
  TaxableWagesList,
  allStateSources,
} from "./sections";

export default function PayrollTaxHubPage() {
  const authorship = getGuideAuthorship("payroll-tax");
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb trail={[{ href: "/", label: "Pay Calculator" }, { label: "Payroll Tax" }]} />

        <header className="mb-8 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H2_STYLE}>
            Payroll Tax in Australia {PAYROLL_TAX_FY}: Rates and Thresholds by State
          </h1>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> payroll tax is a state and territory tax that employers pay on wages
              once their total Australian wages pass a threshold. In {PAYROLL_TAX_FY} the thresholds run from{" "}
              {formatAUD(PAYROLL_TAX_STATES.vic.annualThreshold)} (Victoria, Western Australia) to{" "}
              {formatAUD(PAYROLL_TAX_STATES.nt.annualThreshold)} (Northern Territory), and the general rates from 4.75%
              (Queensland) to 6.75% (ACT), with lower bands in Tasmania and South Australia and regional rates in
              Victoria and Queensland. It is an employer cost: nothing comes out of an employee&rsquo;s pay.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
          <p className="mt-6">
            <Link
              href="/payroll-tax-calculator/"
              className="inline-block rounded-lg bg-eucalyptus-dark px-5 py-3 font-semibold text-white shadow-sm hover:bg-navy"
            >
              Calculate payroll tax for your business
            </Link>
          </p>
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="by-state">
              <h2 style={H2_STYLE}>Payroll Tax Rates by State, {PAYROLL_TAX_FY}</h2>
              <RatesTable />
              <p>
                Tasmania&rsquo;s main rate is 6.1% (4% applies only between $1.25 million and $2 million), and the
                ACT&rsquo;s rate rises with payroll size. Queensland charges 4.95% once Australian wages pass $6.5
                million, and the NT 6.5% from $100 million.
              </p>
            </section>

            <section id="states">
              <h2 style={H2_STYLE}>State-by-State Guides</h2>
              <ul>
                {PAYROLL_TAX_STATE_CODES.map((c) => {
                  const s = PAYROLL_TAX_STATES[c];
                  return (
                    <li key={c}>
                      <Link href={`/payroll-tax/${c}/`}>{s.abbr} payroll tax</Link> — {s.headlineRate},{" "}
                      {formatAUD(s.annualThreshold)} threshold. Administered by {s.revenueOffice}.
                    </li>
                  );
                })}
              </ul>
            </section>

            <section id="compare">
              <h2 style={H2_STYLE}>Payroll Tax on the Same Wage Bill in Each State</h2>
              <p>
                Thresholds, tapers and rates interact, so the cheapest state depends on the size of the payroll.
                Annual tax for a business paying wages in one state for the full year:
              </p>
              <ComparisonGrid />
            </section>

            <section id="who-pays">
              <h2 style={H2_STYLE}>Who Has to Pay Payroll Tax</h2>
              <p>
                An employer pays payroll tax in a state when it pays wages there and its total Australian wages —
                including the wages of every business it is grouped with — exceed that state&rsquo;s threshold. A
                business with a $900,000 Victorian payroll that belongs to a group paying $4 million nationally is
                liable, even though its own wages are under the threshold.
              </p>
              <p>
                Registration is triggered monthly, not annually. NSW, Queensland, WA and the ACT require you to
                register within 7 days after the end of the month in which Australian wages first exceed the monthly
                threshold; the NT allows 21 days. Each state guide below gives its exact rule. Returns are then lodged monthly, usually by the 7th, with an annual reconciliation due 21
                July (28 July in NSW, the ACT and SA).
              </p>
            </section>

            <section id="taxable-wages">
              <h2 style={H2_STYLE}>What Payroll Tax Is Charged On</h2>
              <TaxableWagesList />
            </section>

            <section id="employees">
              <h2 style={H2_STYLE}>Does Payroll Tax Affect Employees?</h2>
              <p>
                Not directly. It is not withheld from pay and never appears on a payslip. If you are an employee, the
                state pay calculators (<Link href="/pay-calculator-nsw/">NSW</Link>,{" "}
                <Link href="/pay-calculator-vic/">VIC</Link>, <Link href="/pay-calculator-qld/">QLD</Link>,{" "}
                <Link href="/pay-calculator-wa/">WA</Link>) show your take-home pay; if you are an employer, the{" "}
                <Link href="/employer-cost-calculator/">employer cost calculator</Link> adds payroll tax to super and
                leave to give the full cost of a hire.
              </p>
            </section>

            <FaqList faqs={HUB_FAQS} />

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="Where these figures come from">
                <p>
                  Rates, thresholds, phase-outs, surcharges, registration rules and due dates are taken from each state
                  and territory revenue office and were checked on {LAST_VERIFIED}. The comparison tables are computed
                  by the same engine as the payroll tax calculator: full financial year, one state, threshold claimed in
                  full, no exemptions or regional concessions.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={allStateSources()} lastVerified={LAST_VERIFIED} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <RelatedCard
                links={[
                  { href: "/payroll-tax-calculator/", label: "Payroll Tax Calculator" },
                  { href: "/employer-cost-calculator/", label: "Employer Cost Calculator" },
                  { href: "/superannuation-guide/", label: "Super Guarantee Guide" },
                  { href: "/fringe-benefits-tax/", label: "Fringe Benefits Tax" },
                  { href: "/payg-withholding-tables/", label: "PAYG Withholding Tables" },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
