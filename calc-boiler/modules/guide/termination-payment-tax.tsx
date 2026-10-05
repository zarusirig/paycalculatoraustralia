import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import {
  ETP_RATES,
  GENUINE_REDUNDANCY_AGE_LIMIT,
  PRESERVATION_AGE,
  REDUNDANCY_TAX_2025_26,
  REDUNDANCY_TAX_2026_27 as Y,
  genuineRedundancyTaxFreeLimit,
} from "@/lib/constants/redundancy";
import { TERMINATION_SOURCES, WHOLE_OF_INCOME_CAP, terminationTax } from "@/lib/constants/termination-tax";
import TerminationPaymentTaxCalculator from "@/modules/calculator/termination-payment-tax-calculator";
import { TERMINATION_TAX_FAQS } from "./termination-payment-tax-faqs";
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

// /termination-payment-tax-calculator/ (Oct 2026): tax on genuine redundancy
// and other ETPs, including the whole-of-income cap. Rules and sources:
// lib/constants/redundancy.ts and lib/constants/termination-tax.ts.

export const TERMINATION_VERIFIED_ON = "5 October 2026";

const SOURCES_LIST: SourceLink[] = [
  { title: "Genuine redundancy payments", url: TERMINATION_SOURCES.genuine, publisher: SOURCES.ato.name },
  { title: "Employment termination payments: key rates and thresholds", url: TERMINATION_SOURCES.caps, publisher: SOURCES.ato.name },
  { title: "Payments that are ETPs", url: TERMINATION_SOURCES.etpList, publisher: SOURCES.ato.name },
  { title: "Working out the whole-of-income cap amount", url: TERMINATION_SOURCES.woi, publisher: SOURCES.ato.name },
  { title: "Taxation of termination payments", url: TERMINATION_SOURCES.taxation, publisher: SOURCES.ato.name },
];

const pct = (r: number) => `${Math.round(r * 100)}%`;
const YEARS = [1, 2, 3, 5, 8, 10, 15, 20];

const BASE = { completedYears: 0, ageAtEndOfIncomeYear: 45, ageAtDismissal: 45, otherTaxableIncome: 0 };
// Worked example 1: genuine redundancy, 6 completed years, $60,000, under preservation age.
const G = terminationTax({ ...BASE, kind: "genuine-redundancy", payment: 60_000, completedYears: 6 });
// Worked example 2: a $100,000 golden handshake, $85,000 of other income, under preservation age.
const H = terminationTax({ ...BASE, kind: "other-etp", payment: 100_000, otherTaxableIncome: 85_000 });
const H_WITHOUT = terminationTax({ ...BASE, kind: "other-etp", payment: 100_000, otherTaxableIncome: 25_000 });

export default function TerminationPaymentTaxPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/redundancy-pay-calculator/", label: "Redundancy Pay" }, { label: "Termination Payment Tax" }]} />

      <PageHeader title="Termination Payment Tax Calculator: Redundancy and ETP Tax 2026-27">
        <p>
          <strong>A genuine redundancy payment is tax-free up to {formatAUD(Y.taxFreeBase)} plus {formatAUD(Y.taxFreePerYear)} for each completed year of service in {Y.incomeYear}. The rest, and any other termination payment, is an employment termination payment (ETP) taxed at {pct(ETP_RATES.atOrOverPreservationAge)} or {pct(ETP_RATES.underPreservationAge)} up to a {formatAUD(Y.etpCap)} cap.</strong> Above the cap it is taxed at {pct(ETP_RATES.aboveCap)}. Golden handshakes and other ETPs also face a {formatAUD(WHOLE_OF_INCOME_CAP)} whole-of-income cap that your other earnings reduce. The calculator applies all of it.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Tax-free base", v: formatAUD(Y.taxFreeBase), s: `Genuine redundancy, ${Y.incomeYear}` },
          { k: "Plus per year", v: formatAUD(Y.taxFreePerYear), s: "Each completed year of service" },
          { k: "ETP cap", v: formatAUD(Y.etpCap), s: `Then ${pct(ETP_RATES.aboveCap)} above it` },
          { k: "Tax rate on the rest", v: `${pct(ETP_RATES.atOrOverPreservationAge)} / ${pct(ETP_RATES.underPreservationAge)}`, s: `Preservation age ${PRESERVATION_AGE} or over / under` },
        ]}
      />

      <div className="mb-12"><TerminationPaymentTaxCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="what-is-etp">What Counts as a Termination Payment for Tax?</H2>
            <p>
              Not everything you receive when a job ends is taxed the same way. The ATO separates employment termination payments from other things paid at the same time. Getting the split right is what makes the calculator accurate.
            </p>
            <DataTable
              head={["Taxed as an ETP", "Not an ETP"]}
              rows={[
                ["A gratuity or golden handshake", "Unused annual leave and long service leave payouts"],
                ["Genuine redundancy above the tax-free limit", "Genuine redundancy up to the tax-free limit"],
                ["Severance pay and non-genuine redundancy", "Salary, wages and allowances owed for work already done"],
                ["Payment in lieu of notice of termination", "Super benefits paid from a fund"],
                ["Compensation for loss of job", "Employee share scheme payments"],
              ]}
              caption={<>Source: ATO, <a href={TERMINATION_SOURCES.etpList} target="_blank" rel="noopener noreferrer">payments that are ETPs</a> and <a href={TERMINATION_SOURCES.genuine} target="_blank" rel="noopener noreferrer">genuine redundancy payments</a>. For notice and leave, use the <Link href="/final-pay-calculator/">final pay calculator</Link>.</>}
            />
          </section>

          <section>
            <H2 id="genuine-redundancy">Genuine Redundancy: The Tax-Free Amount</H2>
            <p>
              The ATO says a genuine redundancy is when your job is abolished, you no longer have a job and you are under age pension age ({GENUINE_REDUNDANCY_AGE_LIMIT}). It is not genuine if you retire at normal retirement age, are pension age or older when dismissed, resign, finish a contract or are dismissed for discipline or inefficiency. A genuine redundancy payment is tax-free up to a limit and anything above it is an ETP. The limit is a base plus an amount for each <strong>completed</strong> year of service, and it is indexed every 1 July.
            </p>
            <DataTable
              head={["Completed years", `Tax-free limit ${Y.incomeYear}`, `Tax-free limit ${REDUNDANCY_TAX_2025_26.incomeYear}`]}
              align={["l", "r", "r"]}
              rows={YEARS.map((n) => [`${n} year${n === 1 ? "" : "s"}`, formatAUD(genuineRedundancyTaxFreeLimit(n, Y)), formatAUD(genuineRedundancyTaxFreeLimit(n, REDUNDANCY_TAX_2025_26))])}
              caption={<>{formatAUD(Y.taxFreeBase)} + {formatAUD(Y.taxFreePerYear)} × completed years (ATO, <a href={TERMINATION_SOURCES.caps} target="_blank" rel="noopener noreferrer">employment termination payments</a>, updated 17 April 2026). The 2025-26 column is for payments made before 1 July 2026.</>}
            />
            <p>
              <strong>Worked example.</strong> After 6 completed years, a $60,000 genuine redundancy payment has a tax-free limit of {formatAUD(G.taxFreeLimit)}, so {formatAUD(G.taxFree)} is tax-free and {formatAUD(G.etpTaxable)} is an ETP. Under preservation age that is taxed at {pct(ETP_RATES.underPreservationAge)}, which is {formatAUD(G.tax)} of tax, leaving {formatAUD(G.net)}. At preservation age or over the rate is {pct(ETP_RATES.atOrOverPreservationAge)}, which is {formatAUD(G.etpTaxable * ETP_RATES.atOrOverPreservationAge)}. To see the redundancy pay you are owed in the first place, use the <Link href="/redundancy-pay-calculator/">redundancy pay calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="etp-rates">ETP Tax Rates and the ETP Cap</H2>
            <p>
              The taxable part of an ETP is taxed at a flat concessional rate up to the ETP cap, then at the top marginal rate. The ATO&rsquo;s withholding rates include the 2% Medicare levy.
            </p>
            <DataTable
              head={["Situation", "Tax rate"]}
              align={["l", "r"]}
              rows={[
                [`Reached preservation age (${PRESERVATION_AGE}) by the end of the income year, up to the cap`, pct(ETP_RATES.atOrOverPreservationAge)],
                ["Under preservation age, up to the cap", pct(ETP_RATES.underPreservationAge)],
                [`Above the ${formatAUD(Y.etpCap)} cap`, pct(ETP_RATES.aboveCap)],
              ]}
              caption={<>ETP cap {formatAUD(Y.etpCap)} for {Y.incomeYear} ({formatAUD(REDUNDANCY_TAX_2025_26.etpCap)} in {REDUNDANCY_TAX_2025_26.incomeYear}), indexed each year. Preservation age is 60 for anyone born after 30 June 1964.</>}
            />
          </section>

          <section>
            <H2 id="whole-of-income-cap">The Whole-of-Income Cap for Golden Handshakes and Other ETPs</H2>
            <p>
              A genuine redundancy above the tax-free limit is an &ldquo;excluded&rdquo; ETP and only the {formatAUD(Y.etpCap)} ETP cap applies. Every other ETP, such as a golden handshake, severance or a non-genuine redundancy, is also tested against a <strong>{formatAUD(WHOLE_OF_INCOME_CAP)} whole-of-income cap</strong>, reduced by your other taxable income in the same income year, whether you earn it before or after the payment. The lesser of the two caps applies. Other taxable income counts salary, overtime, bonuses, interest and accrued leave paid out when you leave. It does not count super guarantee, salary sacrifice or reportable fringe benefits.
            </p>
            <p>
              <strong>Worked example.</strong> A $100,000 golden handshake is paid in August to someone under preservation age who had earned $25,000 that year, so the cap is {formatAUD(H_WITHOUT.wholeOfIncomeCapRemaining ?? 0)} and the whole payment is taxed at {pct(ETP_RATES.underPreservationAge)}: {formatAUD(H_WITHOUT.tax)}. If they then take a new job and earn a further $60,000 before 30 June, their other income is $85,000, the cap falls to {formatAUD(H.wholeOfIncomeCapRemaining ?? 0)} and {formatAUD(H.aboveCap)} is taxed at {pct(ETP_RATES.aboveCap)}. The tax becomes {formatAUD(H.tax)}, so the extra {formatAUD(H.tax - H_WITHOUT.tax)} is due when the return is assessed. This follows the ATO&rsquo;s own worked example for the cap, using the 2026-27 cap and rates.
            </p>
          </section>

          <section>
            <H2 id="tips">Practical Points</H2>
            <ul>
              <li><strong>Split the payment correctly.</strong> Check the payment summary or income statement. Leave and notice pay are separate lines from the redundancy payment.</li>
              <li><strong>Timing matters.</strong> The caps are by income year (1 July to 30 June). Two ETPs in one year share the caps.</li>
              <li><strong>Check your age cut-offs.</strong> Turning 60 before 30 June moves the rate from {pct(ETP_RATES.underPreservationAge)} to {pct(ETP_RATES.atOrOverPreservationAge)}. Being {GENUINE_REDUNDANCY_AGE_LIMIT} on the day of dismissal removes the genuine redundancy tax-free amount.</li>
              <li><strong>Centrelink.</strong> A termination payment can delay income support. See the <Link href="/jobseeker-payment-calculator/">JobSeeker payment calculator</Link> and the redundancy page for the income maintenance period.</li>
            </ul>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/redundancy-pay-calculator/">Redundancy Pay Calculator</Link>: what you are owed under the NES</li>
              <li><Link href="/final-pay-calculator/">Final Pay Calculator</Link>: notice, leave and wages when you leave</li>
              <li><Link href="/bonus-tax-calculator/">Bonus Tax Calculator</Link>: tax on a one-off lump sum</li>
              <li><Link href="/long-service-leave-calculator/">Long Service Leave Calculator</Link>: payout on redundancy by state</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link>: tax on the rest of your year</li>
            </ul>
          </section>

          <FaqSection faqs={TERMINATION_TAX_FAQS} label="Termination payment tax" />

          <PageFooter
            slug="termination-payment-tax-calculator"
            lastVerified={TERMINATION_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>For a genuine redundancy, tax-free = the lesser of the payment and {formatAUD(Y.taxFreeBase)} + {formatAUD(Y.taxFreePerYear)} × completed years. The remainder is an excluded ETP, taxed at {pct(ETP_RATES.atOrOverPreservationAge)} (preservation age {PRESERVATION_AGE} reached by 30 June) or {pct(ETP_RATES.underPreservationAge)} up to the {formatAUD(Y.etpCap)} ETP cap and {pct(ETP_RATES.aboveCap)} above it. Any other termination payment has no tax-free part and the cap is the lesser of the ETP cap and {formatAUD(WHOLE_OF_INCOME_CAP)} less your other taxable income.</p>
              <p>Not modelled: pre-1983 and invalidity components, early retirement scheme payments, earlier ETPs in the same year, ETPs paid on death, and the Medicare levy surcharge. The tax withheld can differ from your final assessment. General information, not tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/redundancy-pay-calculator/", label: "Redundancy Pay Calculator" },
          { href: "/final-pay-calculator/", label: "Final Pay Calculator" },
          { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator" },
          { href: "/long-service-leave-calculator/", label: "Long Service Leave Calculator" },
          { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
