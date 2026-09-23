import Link from "next/link";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import { PAYROLL_TAX_FY, PAYROLL_TAX_STATES, calculatePayrollTax } from "@/lib/constants/payroll-tax";
import PayrollTaxCalculator from "./payroll-tax-calculator";
import { CALCULATOR_FAQS } from "./content";
import {
  Breadcrumb,
  ComparisonGrid,
  FaqList,
  H2_STYLE,
  LAST_VERIFIED,
  RatesTable,
  RelatedCard,
  StateLinksNav,
  TaxableWagesList,
  allStateSources,
} from "./sections";

export default function PayrollTaxCalculatorPage() {
  const nswEx = calculatePayrollTax({ state: "nsw", stateWages: 2_000_000 });
  const vicEx = calculatePayrollTax({ state: "vic", stateWages: 4_000_000 });
  const inter = calculatePayrollTax({ state: "nsw", stateWages: 900_000, australianWages: 3_000_000 });
  const authorship = getGuideAuthorship("payroll-tax-calculator");

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb trail={[{ href: "/", label: "Pay Calculator" }, { label: "Payroll Tax Calculator" }]} />

        <header className="mb-8 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H2_STYLE}>
            Payroll Tax Calculator {PAYROLL_TAX_FY}: Every State and Territory
          </h1>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> payroll tax = (taxable wages in the state − the state&rsquo;s threshold
              or deduction) × the state&rsquo;s rate. Rates run from 4% (Tasmania&rsquo;s first band) to 8.75%
              (ACT, above $150 million), and thresholds from {formatAUD(PAYROLL_TAX_STATES.vic.annualThreshold)}{" "}
              (VIC, WA) to {formatAUD(PAYROLL_TAX_STATES.nt.annualThreshold)} (NT). A business paying{" "}
              {formatAUD(2_000_000)} of wages only in NSW pays <strong>{formatAUD(nswEx.total)}</strong> a year.
              Employers pay it; employees never do.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-12">
          <PayrollTaxCalculator />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="rates">
              <h2 style={H2_STYLE}>Payroll Tax Rates and Thresholds {PAYROLL_TAX_FY}</h2>
              <p>
                Each state and territory sets its own rate and threshold. The threshold is tested against your total
                Australian wages — and your group&rsquo;s, if you are grouped — not just the wages in one state.
              </p>
              <RatesTable />
              <p>
                Select a state for the full rules, due dates and a calculator already set to that state:{" "}
                {(["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as const).map((c, i, a) => (
                  <span key={c}>
                    <Link href={`/payroll-tax/${c}/`}>{PAYROLL_TAX_STATES[c].abbr}</Link>
                    {i < a.length - 1 ? ", " : "."}
                  </span>
                ))}
              </p>
            </section>

            <section id="how-calculated">
              <h2 style={H2_STYLE}>How Payroll Tax Is Calculated</h2>
              <ol>
                <li><strong>Add up taxable wages</strong> paid in the state for the year, then Australia-wide (including every member of your group).</li>
                <li><strong>Work out the threshold or deduction.</strong> Start from the state&rsquo;s annual figure. In Victoria, Queensland, Western Australia and the Northern Territory it shrinks as Australian wages grow; everywhere it is multiplied by the state&rsquo;s share of your Australian wages.</li>
                <li><strong>Subtract it</strong> from the state&rsquo;s taxable wages.</li>
                <li><strong>Apply the rate.</strong> Queensland, the ACT and the NT choose the rate by the size of your Australian payroll; South Australia phases its rate in; Tasmania uses two bands.</li>
                <li><strong>Add any surcharge.</strong> Victoria&rsquo;s two surcharges and Queensland&rsquo;s mental health levy apply only to wages over an apportioned $10 million.</li>
              </ol>
              <p>
                <strong>Example (phase-out):</strong> a Victorian business with {formatAUD(4_000_000)} of wages gets a
                threshold of {formatAUD(vicEx.deduction)} instead of $1 million (50 cents less for every dollar over
                $3 million), so it pays {formatAUD(vicEx.total)}.
              </p>
              <p>
                <strong>Example (interstate):</strong> Revenue NSW&rsquo;s own example has {formatAUD(900_000)} of NSW
                wages out of {formatAUD(3_000_000)} Australia-wide. The NSW threshold becomes $1.2m × 900,000 ÷
                3,000,000 = {formatAUD(inter.deduction)}, leaving {formatAUD(inter.taxableWages)} taxed at 5.45% ={" "}
                {formatAUD(inter.total)}.
              </p>
            </section>

            <section id="compare">
              <h2 style={H2_STYLE}>What the Same Payroll Costs in Each State</h2>
              <p>
                Annual payroll tax for a single-state employer at four wage bills, full year, no regional concession.
                The order changes with size: the NT&rsquo;s big threshold wins at the small end, but its taper means a
                $10 million payroll there pays on every dollar.
              </p>
              <ComparisonGrid />
            </section>

            <section id="taxable-wages">
              <h2 style={H2_STYLE}>What Counts as Taxable Wages</h2>
              <TaxableWagesList />
            </section>

            <section id="grouping">
              <h2 style={H2_STYLE}>Grouping: Why a Small Business Can Still Pay</h2>
              <p>
                Businesses that are related corporations, share employees, or are controlled by the same people are
                grouped. The group&rsquo;s wages are added together to test the threshold, only the designated group
                employer claims it, and the other members pay on every dollar of their wages. Enter the group&rsquo;s
                combined wages in the calculator to get the group&rsquo;s total.
              </p>
            </section>

            <section id="employees">
              <h2 style={H2_STYLE}>Payroll Tax and Employees</h2>
              <p>
                Payroll tax is never withheld from pay. If you are an employee checking your payslip, the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> shows what is withheld (income
                tax, the Medicare levy and any study loan), and the{" "}
                <Link href="/employer-cost-calculator/">employer cost calculator</Link> shows what your job costs the
                business on top of your salary.
              </p>
            </section>

            <FaqList faqs={CALCULATOR_FAQS} />

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this calculator works">
                <p>
                  The calculator applies each state&rsquo;s {PAYROLL_TAX_FY} rate, threshold or deduction, phase-out and
                  surcharge to a full financial year of wages, with the threshold apportioned by the state&rsquo;s
                  share of Australian wages and claimed in full by the employer or designated group employer. It does
                  not apportion for part-year employment, calculate monthly returns or apply exemptions. Every figure
                  was checked against the state and territory revenue offices on {LAST_VERIFIED}, and the arithmetic is
                  tested against the worked examples those offices publish. The revenue office&rsquo;s own return is
                  the final word.
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
                  { href: "/payroll-tax/", label: "Payroll Tax by State" },
                  { href: "/employer-cost-calculator/", label: "Employer Cost Calculator" },
                  { href: "/superannuation-guide/", label: "Super Guarantee Guide" },
                  { href: "/payg-withholding-tables/", label: "PAYG Withholding Tables" },
                  { href: "/payday-super/", label: "Payday Super" },
                ]}
              />
              <StateLinksNav />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
