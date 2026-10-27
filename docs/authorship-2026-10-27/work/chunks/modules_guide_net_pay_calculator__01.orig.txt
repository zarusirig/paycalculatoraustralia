import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD, formatPercent } from "@/lib/constants";
import { netPay } from "@/lib/constants/net-pay";
import { NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import NetPayCalculator from "@/modules/calculator/net-pay-calculator";
import { NET_PAY_CALCULATOR_FAQS } from "./net-pay-calculator-faqs";
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
import FeaturedImage from "@/components/common/featured-image";

// /net-pay-calculator/ — the hourly-rate view of net pay, laid out as a
// payslip, with net pay per hour. Distinct from /take-home-pay-calculator/
// (annual salary → year-end tax) and /gross-vs-net-pay/ (the gross, taxable and
// net definitions). Arithmetic: lib/constants/net-pay.ts.

const VERIFIED = "23 September 2026";
const FWO_PAYSLIPS = "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips";
const ATO_SCHEDULE1 = "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld";

const SOURCES_LIST: SourceLink[] = [
  { title: "Pay slips: what a pay slip must show", url: FWO_PAYSLIPS, publisher: SOURCES.fwo.name },
  { title: "Schedule 1: statement of formulas for calculating amounts to be withheld", url: ATO_SCHEDULE1, publisher: SOURCES.ato.name },
];

const FY = SITE_CONFIG.financialYear;
const RATES = [25, 30, 35, 40, 50, 60, 80] as const;
const pct = (n: number) => formatPercent(n, 0);

export default function NetPayPage() {
  const example = netPay({ hourlyRate: 40, hoursPerWeek: 38, frequency: "fortnightly" });
  const casual = netPay({ hourlyRate: 30, hoursPerWeek: 20, frequency: "weekly", casualLoading: true });
  const withHelp = netPay({ hourlyRate: 40, hoursPerWeek: 38, frequency: "fortnightly", options: { hasSTSL: true } });
  const noThreshold = netPay({ hourlyRate: 40, hoursPerWeek: 38, frequency: "fortnightly", options: { claimsTaxFreeThreshold: false } });

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/take-home-pay-calculator/", label: "Take-Home Pay" }, { label: "Net Pay Calculator" }]} />

      <PageHeader title={`Net Pay Calculator Australia ${FY}: Hourly Rate to Payslip`}>
        <p>
          <strong>Net pay is what reaches your bank account after tax and deductions.</strong> On {formatAUD(40)} an hour for 38 hours a week, a fortnightly pay is {formatAUD(example.gross)} gross and <strong>{formatAUD(example.net)} net</strong>, which is {formatAUD(example.netPerHour, 2)} for each hour you work. Enter your hourly rate and hours to see your net pay line by line, the way a payslip shows it, using the ATO&rsquo;s {FY} withholding tables.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "$40/h, 38 h", v: formatAUD(example.net), s: "Net each fortnight, tax-free threshold claimed" },
          { k: "Net per hour", v: formatAUD(example.netPerHour, 2), s: `${pct(example.netPerHour / 40)} of the gross rate` },
          { k: "With a HELP debt", v: formatAUD(withHelp.net), s: "Same job, STSL withheld each pay" },
          { k: "No threshold claimed", v: formatAUD(noThreshold.net), s: "Second job: more is withheld" },
        ]}
      />

      <div className="mb-12"><NetPayCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <FeaturedImage placement="content" className="mt-0" />
          <section>
            <H2 id="what-is-net-pay">What Net Pay Means on a Payslip</H2>
            <p>
              A payslip works from the top down. It starts with <strong>gross pay</strong>, everything you earned in the pay period: ordinary hours, overtime, penalties, allowances, leave and any bonus. It then subtracts the <strong>tax withheld</strong> (PAYG withholding, which includes the Medicare levy), any <strong>HELP or study loan</strong> amount, and any <strong>other deductions</strong> you have agreed to. What is left is <strong>net pay</strong>. Your employer&rsquo;s super contribution is listed too, but it goes to your fund on top of your wages and is not part of net pay (<a href={FWO_PAYSLIPS} target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a>).
            </p>
            <p>
              This calculator starts from the numbers you know, your hourly rate and your hours, rather than an annual salary. If you have a salary, the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> gives the year-end view, and the <Link href="/gross-vs-net-pay/">gross vs net pay</Link> page explains each term in detail.
            </p>
          </section>

          <section>
            <H2 id="net-per-hour">Net Pay Per Hour at Common Hourly Rates</H2>
            <p>The table shows what a full-time week of 38 hours pays after tax at each rate, paid fortnightly, and what each hour is really worth once tax is withheld.</p>
            <DataTable
              head={["Hourly rate", "Gross a fortnight", "Tax withheld", "Net a fortnight", "Net per hour"]}
              align={["l", "r", "r", "r", "r"]}
              rows={RATES.map((rate) => {
                const r = netPay({ hourlyRate: rate, hoursPerWeek: 38, frequency: "fortnightly" });
                return [formatAUD(rate, 2), formatAUD(r.gross), formatAUD(r.paygWithheld), formatAUD(r.net), formatAUD(r.netPerHour, 2)];
              })}
              caption={<>38 ordinary hours a week, resident, tax-free threshold claimed, no HELP debt, no deductions. Withholding from the ATO&rsquo;s {FY} Schedule 1 tables (<a href={ATO_SCHEDULE1} target="_blank" rel="noopener noreferrer">ATO</a>), read {VERIFIED}.</>}
            />
            <p>
              The share you keep shrinks as the rate rises, because each higher band is taxed at a higher rate. The marginal rate on your next dollar is on the <Link href="/marginal-tax-rates/">marginal tax rates</Link> page.
            </p>
          </section>

          <section>
            <H2 id="worked-example">Worked Example: $40 an Hour, 38 Hours, Paid Fortnightly</H2>
            <ul>
              <li>Gross: $40 × 38 hours × 2 weeks = <strong>{formatAUD(example.gross, 2)}</strong>.</li>
              <li>PAYG withholding (tax and Medicare levy), tax-free threshold claimed: <strong>{formatAUD(example.paygWithheld, 2)}</strong>.</li>
              <li>Net pay: {formatAUD(example.gross, 2)} − {formatAUD(example.paygWithheld, 2)} = <strong>{formatAUD(example.net, 2)}</strong>, or {formatAUD(example.netPerHour, 2)} for each of the 76 hours.</li>
              <li>Employer super on top: {formatAUD(example.employerSuper, 2)}, paid to the fund and not part of net pay.</li>
            </ul>
            <p>
              For a casual on {formatAUD(30)} an hour base plus 25% loading for 20 hours a week, gross is {formatAUD(casual.gross, 2)} a week and net is {formatAUD(casual.net, 2)}. See the <Link href="/casual-loading-calculator/">casual loading calculator</Link> for how the loading compares with permanent pay.
            </p>
          </section>

          <section>
            <H2 id="why-lower">Why Your Net Pay Can Be Lower Than Expected</H2>
            <DataTable
              head={["Cause", "Effect on the $40 an hour example (fortnightly)"]}
              rows={[
                ["Tax-free threshold claimed (the default for your main job)", `Net ${formatAUD(example.net)}`],
                ["Threshold not claimed, as on a second job", `Net ${formatAUD(noThreshold.net)}, ${formatAUD(example.net - noThreshold.net)} less`],
                ["A HELP or study loan", `Net ${formatAUD(withHelp.net)}, ${formatAUD(example.net - withHelp.net)} less`],
                ["No tax file number given to your employer", `Withholding at ${pct(NO_TFN_RATES.resident)} for residents`],
              ]}
              caption="Each row changes one thing against the first. The tax withheld is an estimate; any over-withholding is refunded when you lodge your return."
            />
            <p>
              The second-job case is common: only one employer should apply the tax-free threshold. See the <Link href="/second-job-tax-calculator/">second job tax calculator</Link> and the <Link href="/tax-file-number-declaration/">TFN declaration guide</Link>. If a HELP debt is the cause, the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> shows the repayment, and <Link href="/stsl-on-payslip/">STSL on your payslip</Link> explains the line.
            </p>
          </section>

          <section>
            <H2 id="check-payslip">Checking Your Payslip Against the Calculator</H2>
            <p>
              Work out your gross for the pay period first: hours paid × rate, plus any penalties, overtime or allowances on the payslip. Then compare the tax withheld with the ATO table for that gross. If your payslip shows less net than the calculator, look at the deductions listed between gross and net; if the gross is lower than expected, check the hours and rate, then your award&rsquo;s minimum with the <Link href="/award-rates/">award rates</Link> and <Link href="/overtime-penalty-rates-guide/">penalty rates guide</Link>. For a line-by-line walk through a payslip see <Link href="/understanding-your-payslip/">understanding your payslip</Link>, and to produce a sample payslip use the <Link href="/payslip-generator/">payslip generator</Link>.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>: annual salary to net pay, with HELP and super</li>
              <li><Link href="/gross-pay-calculator/">Gross Pay Calculator</Link>: work back from the net pay you want</li>
              <li><Link href="/fortnightly-pay-calculator/">Fortnightly Pay Calculator</Link>: tax on each fortnight&rsquo;s pay</li>
              <li><Link href="/tax-withheld-calculator/">Tax Withheld Calculator</Link>: PAYG withholding each pay</li>
              <li><Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link>: your rate as a yearly figure</li>
            </ul>
          </section>

          <FaqSection faqs={NET_PAY_CALCULATOR_FAQS} label="Net pay" />

          <PageFooter
            slug="net-pay-calculator"
            lastVerified={VERIFIED}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Gross pay = hourly rate (plus 25% casual loading if selected) × hours a week × weeks in the pay period (1 for weekly, 2 for fortnightly, 52 ÷ 12 for monthly). Tax withheld is calculated with the ATO&rsquo;s Schedule 1 coefficients for {FY}, using the scale for claiming or not claiming the tax-free threshold, plus the Schedule 8 study and training loan amount if selected. Salary sacrifice reduces the amount tax is calculated on; other deductions come off after tax. Net pay = gross − salary sacrifice − withholding − other deductions. Net per hour = net pay ÷ hours paid in the period.</p>
              <p>Assumes an Australian resident for tax purposes and regular salary and wages. Withholding is an estimate and does not include bonuses or back pay, which are withheld by a different method, or any offsets or deductions you claim at tax time. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
          { href: "/gross-vs-net-pay/", label: "Gross vs Net Pay" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
          { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator" },
          { href: "/second-job-tax-calculator/", label: "Second Job Tax Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
