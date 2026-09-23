import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, calculatePayBreakdown, formatAUD, formatNegAUD, formatPercent } from "@/lib/constants";
import { payslipFromGross } from "@/lib/constants/gross-vs-net";
import { takeHomeHref } from "@/lib/data/teacher-pay";
import GrossVsNetCalculator from "@/modules/calculator/gross-vs-net-calculator";
import { GROSS_VS_NET_FAQS } from "./gross-vs-net-pay-faqs";
import {
  ARTICLE_CLASS,
  Breadcrumbs,
  DataTable,
  FaqSection,
  H2,
  KeyFigures,
  PAGE_INNER,
  PAGE_WRAP,
  PageFooter,
  PageHeader,
  RelatedSidebar,
} from "./t3-shared";

const FWO_PAYSLIPS = "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips";
const ATO_ITEM1 = "https://www.ato.gov.au/forms-and-instructions/individual-tax-return-2025-instructions/income-questions-1-12-individual-tax-return-2025/1-salary-or-wages-2025";
const ATO_SCHEDULE1 = "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld";
const VERIFIED = "23 September 2026";

const SOURCES_LIST: SourceLink[] = [
  { title: "Pay slips – what a pay slip must include", url: FWO_PAYSLIPS, publisher: SOURCES.fwo.name },
  { title: "Individual tax return instructions – 1 Salary or wages ('Gross payments')", url: ATO_ITEM1, publisher: SOURCES.ato.name },
  { title: "Schedule 1 – Statement of formulas for calculating amounts to be withheld", url: ATO_SCHEDULE1, publisher: SOURCES.ato.name },
];

const FY = SITE_CONFIG.financialYear;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

// Worked payslip: $3,000 gross a fortnight, $150 salary sacrifice, $25 union fee.
const BASIC = payslipFromGross({ gross: 3_000, frequency: "fortnightly" });
const FULL = payslipFromGross({ gross: 3_000, frequency: "fortnightly", salarySacrifice: 150, postTaxDeductions: 25 });
const SALARIES = [50_000, 70_000, 90_000, 120_000, 150_000];

export default function GrossVsNetPayPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/understanding-your-payslip/", label: "Your Payslip" }, { label: "Gross vs Net Pay" }]} />

      <PageHeader title="Gross vs Net Pay: What's the Difference?">
        <p>
          <strong>Gross pay is what you earn before anything comes out. Net pay is what&rsquo;s left and lands in your account</strong>, after PAYG tax withheld, any HELP repayment and other deductions. On {formatAUD(3_000)} gross a fortnight, claiming the tax-free threshold, {formatAUD(BASIC.paygWithheld)} is withheld in {FY} and your net pay is {formatAUD(BASIC.net, 2)}. Your employer&rsquo;s {SG} super ({formatAUD(BASIC.employerSuper, 2)}) is paid on top and isn&rsquo;t in either figure.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Gross (fortnight)", v: formatAUD(3_000), s: "Before tax and deductions" },
          { k: "Tax withheld", v: formatAUD(BASIC.paygWithheld), s: `ATO ${FY} scale, tax-free threshold` },
          { k: "Net (fortnight)", v: formatAUD(BASIC.net, 2), s: "Paid into your account" },
          { k: `Super (${SG})`, v: formatAUD(BASIC.employerSuper, 2), s: "On top, to your fund" },
        ]}
      />

      <div className="mb-12"><GrossVsNetCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="definitions">Gross, Taxable and Net Pay</H2>
            <DataTable
              head={["Term", "What it means", "Example (fortnight)"]}
              rows={[
                ["Gross pay", "All earnings for the period before any deduction: ordinary hours, overtime, penalties, allowances, leave and loading, bonuses.", formatAUD(FULL.gross, 2)],
                ["Pre-tax deductions", "Salary sacrifice (to super or a novated lease) comes off before tax is worked out.", formatNegAUD(FULL.salarySacrifice, 2, "−")],
                ["Taxable gross", "The amount PAYG withholding is calculated on.", formatAUD(FULL.taxableGross, 2)],
                ["Tax withheld", "PAYG withholding (includes the Medicare levy), plus any HELP/study loan amount.", formatNegAUD(FULL.paygWithheld + FULL.stslWithheld, 2, "−")],
                ["After-tax deductions", "Union fees, donations, repayments you’ve authorised.", formatNegAUD(FULL.postTaxDeductions, 2, "−")],
                ["Net pay", "What’s paid into your bank account.", formatAUD(FULL.net, 2)],
                ["Employer super", `${SG} super guarantee on your earnings, paid to your fund, not to you.`, formatAUD(FULL.employerSuper, 2)],
              ]}
              caption={`Worked payslip: ${formatAUD(3_000)} gross a fortnight, ${formatAUD(150)} salary sacrificed to super, ${formatAUD(25)} union fee, tax-free threshold claimed, no study loan. Withholding from the ATO's ${FY} Schedule 1 formulas.`}
            />
            <p>Salary sacrifice cut the tax withheld from {formatAUD(BASIC.paygWithheld)} to {formatAUD(FULL.paygWithheld)}, so the {formatAUD(150)} sacrificed reduced net pay by only {formatAUD(BASIC.net - FULL.net - 25, 2)} (before the union fee). Model it with the <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link>.</p>
          </section>

          <section>
            <H2 id="whats-in-gross">What Goes Into Gross Pay</H2>
            <ul>
              <li><strong>Ordinary hours</strong> at your base rate, plus <Link href="/overtime-penalty-rates-guide/">penalty rates</Link> and <Link href="/overtime-pay-calculator/">overtime</Link>.</li>
              <li><strong>Leave</strong> paid at your base rate, plus <Link href="/leave-loading-calculator/">leave loading</Link> if your award gives it.</li>
              <li><strong>Allowances.</strong> Most are taxed like wages. Some are shown separately and may have no tax withheld, such as a <Link href="/travel-allowance/">travel allowance</Link> within the ATO&rsquo;s reasonable amount or a <Link href="/cents-per-km/">cents per km car allowance</Link> at the ATO rate.</li>
              <li><strong>Bonuses and back pay</strong>, often withheld from using a separate method: see the <Link href="/bonus-tax-calculator/">bonus tax calculator</Link>.</li>
            </ul>
            <p>A payslip must show gross and net pay, each loading, allowance, penalty or bonus that can be separated out, every deduction, and the super paid for you (<a href={FWO_PAYSLIPS} target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a>). Line-by-line help: <Link href="/understanding-your-payslip/">understanding your payslip</Link>.</p>
          </section>

          <section>
            <H2 id="gross-payment">What Is a &ldquo;Gross Payment&rdquo; on Your Income Statement?</H2>
            <p>At the end of the year your income statement (in myGov) shows <strong>Gross payments</strong>: the total salary and wages that employer paid you, before tax. That&rsquo;s the figure for item 1, salary or wages, in your tax return (<a href={ATO_ITEM1} target="_blank" rel="noopener noreferrer">ATO</a>). Allowances reported separately appear in their own box, and tax withheld is shown as its own total. Estimate your refund with the <Link href="/tax-return-calculator/">tax return calculator</Link>.</p>
          </section>

          <section>
            <H2 id="salaries">Gross vs Net Salary: {FY} Examples</H2>
            <DataTable
              head={["Gross salary", "Gross per fortnight", "Net per fortnight (withheld)", "Net per year (tax payable)"]}
              align={["l", "r", "r", "r"]}
              rows={SALARIES.map((s) => {
                const fn = payslipFromGross({ gross: s / 26, frequency: "fortnightly" });
                const yr = calculatePayBreakdown({ grossSalary: s });
                return [<Link key={s} href={takeHomeHref(s)}>{formatAUD(s)}</Link>, formatAUD(s / 26, 2), formatAUD(fn.net, 2), formatAUD(yr.takeHomePay)];
              })}
              caption="Resident, tax-free threshold claimed, no study loan, private hospital cover assumed so no surcharge. The per-fortnight column is what the ATO scales withhold; the yearly column is tax actually payable after offsets, so 26 fortnights won't match it exactly. Your return squares up the difference."
            />
            <p>For any salary, use the <Link href="/gross-pay-calculator/">gross pay calculator</Link> (annual, with a net-to-gross mode) or the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.</p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/gross-pay-calculator/">Gross Pay Calculator</Link>: annual gross to net and back</li>
              <li><Link href="/fortnightly-tax-table/">Fortnightly Tax Table</Link>: tax withheld at every pay amount</li>
              <li><Link href="/understanding-your-payslip/">Understanding Your Payslip</Link></li>
              <li><Link href="/payslip-generator/">Payslip Generator</Link></li>
            </ul>
          </section>

          <FaqSection faqs={GROSS_VS_NET_FAQS} label="Gross vs net pay" />

          <PageFooter
            slug="gross-vs-net-pay"
            lastVerified={VERIFIED}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Per-pay figures use the ATO&rsquo;s {FY} Schedule 1 withholding formulas (and Schedule 8 for study loans), the same engine as our tax table pages, reproducing the ATO&rsquo;s published tables. Net to gross searches for the gross pay whose net first reaches your target. Yearly figures use our core tax engine: resident rates, the low income tax offset and the Medicare levy.</p>
              <p>General information, not tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/gross-pay-calculator/", label: "Gross Pay Calculator" },
          { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
          { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table" },
          { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
