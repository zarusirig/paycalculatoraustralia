import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { LISTO_2027_28, LISTO_CURRENT, LISTO_SOURCES, listoFromSalary, salaryForFullListo } from "@/lib/constants/listo";
import ListoCalculator from "@/modules/calculator/listo-calculator";
import { LISTO_FAQS } from "./listo-calculator-faqs";
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

// /listo-calculator/ (Oct 2026): low income super tax offset today and the
// 1 July 2027 boost. Rules and sources: lib/constants/listo.ts.

export const LISTO_VERIFIED_ON = "5 October 2026";

const SOURCES_LIST: SourceLink[] = [
  { title: "Low income super tax offset", url: LISTO_SOURCES.ato, publisher: SOURCES.ato.name },
  { title: "Low Income Superannuation Tax Offset (LISTO): 1 July 2027 boost", url: LISTO_SOURCES.atoBoost, publisher: SOURCES.ato.name },
  { title: "Latest news on tax law and policy (Royal Assent dates)", url: LISTO_SOURCES.atoLegislation, publisher: SOURCES.ato.name },
  { title: "Low Income Superannuation Tax Offset fact sheet", url: LISTO_SOURCES.treasury, publisher: "Treasury" },
];

const NOW = LISTO_CURRENT;
const NEXT = LISTO_2027_28;
const SG_PCT = Math.round(SUPER_GUARANTEE.rate * 100);
const SALARIES = [20_000, 25_000, 30_000, 37_000, 40_000, 45_000, 50_000];
const pct = (r: number) => `${Math.round(r * 100)}%`;
const fmt2 = (n: number) => formatAUD(n, 2);

export default function ListoCalculatorPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/superannuation-guide/", label: "Superannuation" }, { label: "LISTO Calculator" }]} />

      <PageHeader title="LISTO Calculator: Low Income Super Tax Offset 2026-27 and 2027">
        <p>
          <strong>The low income super tax offset (LISTO) refunds the {pct(NOW.rate)} tax your super fund takes from before-tax contributions, up to {formatAUD(NOW.maxPayment)} a year, if your income is {formatAUD(NOW.incomeThreshold)} or less.</strong> From 1 July 2027 the income limit rises to {formatAUD(NEXT.incomeThreshold)} and the maximum to {formatAUD(NEXT.maxPayment)}, and the ATO says the change is law. You do not apply: the ATO pays it into your super. Use the calculator to see what you get now and in 2027-28.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Rate", v: pct(NOW.rate), s: "Of before-tax super contributions" },
          { k: "Maximum now", v: formatAUD(NOW.maxPayment), s: `Income ${formatAUD(NOW.incomeThreshold)} or less` },
          { k: "From 1 July 2027", v: formatAUD(NEXT.maxPayment), s: `Income ${formatAUD(NEXT.incomeThreshold)} or less` },
          { k: "Do you apply?", v: "No", s: "ATO pays it to your fund; it needs your TFN" },
        ]}
      />

      <div className="mb-12"><ListoCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <FeaturedImage placement="content" className="mt-0" />
          <section>
            <H2 id="what-is-listo">What Is LISTO?</H2>
            <p>
              Contributions your employer pays into super are taxed at {pct(NOW.rate)} inside the fund. For someone paying little or no income tax, that {pct(NOW.rate)} can be more than the tax on their take-home pay. LISTO fixes this: the government pays an amount equal to {pct(NOW.rate)} of your concessional (before-tax) contributions into your super account, up to a yearly cap. It is paid for you automatically, so there is nothing to claim.
            </p>
            <p>
              Concessional contributions include your employer&rsquo;s super guarantee ({SG_PCT}% of your pay), salary sacrifice, and personal contributions you claim a tax deduction for. For most low-income employees the super guarantee on their pay is the main part.
            </p>
          </section>

          <section>
            <H2 id="eligibility">Who Is Eligible for LISTO?</H2>
            <p>The ATO says you must satisfy <strong>all</strong> of these:</p>
            <ul>
              <li>You or your employer paid concessional contributions, including super guarantee, for the year to a complying super fund.</li>
              <li>Your adjusted taxable income is {formatAUD(NOW.incomeThreshold)} or less (rising to {formatAUD(NEXT.incomeThreshold)} from 1 July 2027). The ATO uses your actual or estimated adjusted taxable income.</li>
              <li>You did not hold a temporary resident visa at any time during the income year. New Zealand citizens in Australia are eligible.</li>
              <li>If you lodge a tax return, 10% or more of your total income comes from business and/or employment. If you do not lodge, 10% or more of your total income comes from employment.</li>
            </ul>
            <p>
              Make sure your super fund has your tax file number. Without it the fund cannot accept a LISTO payment. If you are a low-income earner you may also be eligible for the <Link href="/super-co-contribution/">government super co-contribution</Link> when you make personal after-tax contributions.
            </p>
          </section>

          <section>
            <H2 id="how-much">How Much LISTO Do You Get?</H2>
            <p>
              The payment is {pct(NOW.rate)} of your concessional contributions, rounded to the cent, to a maximum of {formatAUD(NOW.maxPayment)} (the ATO&rsquo;s minimum is {formatAUD(NOW.minPayment)}: anything smaller is rounded up to it). The ATO&rsquo;s own example: a childcare assistant on $32,000 with $3,360 of super guarantee has 15% of $3,360 = $504, which is above the cap, so she receives {formatAUD(NOW.maxPayment)}.
            </p>
            <p>
              At a {SG_PCT}% super guarantee rate, an employee on about {formatAUD(salaryForFullListo(NOW))} reaches the full {formatAUD(NOW.maxPayment)}. Below that the payment is {(NOW.rate * SUPER_GUARANTEE.rate * 100).toFixed(1)}% of salary, so someone on $20,000 gets {fmt2(listoFromSalary(20_000, NOW))}.
            </p>
          </section>

          <section>
            <H2 id="boost-2027">The 1 July 2027 Boost: $37,000 to $45,000, $500 to $810</H2>
            <p>
              Treasury and the ATO confirm that from 1 July 2027 the LISTO income threshold increases from {formatAUD(NOW.incomeThreshold)} to {formatAUD(NEXT.incomeThreshold)}, to match the top of the second income tax bracket, and the maximum payment increases to {formatAUD(NEXT.maxPayment)} to account for the rises in the super guarantee rate. The ATO lists the measure as law. Two consequences:
            </p>
            <ul>
              <li><strong>More people qualify.</strong> Workers with income between {formatAUD(NOW.incomeThreshold + 1)} and {formatAUD(NEXT.incomeThreshold)} are newly eligible.</li>
              <li><strong>A bigger cap.</strong> {formatAUD(NEXT.maxPayment)} is exactly {pct(NOW.rate)} of {SG_PCT}% of {formatAUD(NEXT.incomeThreshold)}, so a full-time worker on $45,000 gets the maximum from super guarantee alone. The official wording changes only the threshold and the cap, so we have assumed the {pct(NOW.rate)} rate and the {formatAUD(NOW.minPayment)} minimum carry over. Check the ATO if the final detail matters to you.</li>
            </ul>
            <DataTable
              head={["Salary", `Super at ${SG_PCT}%`, "LISTO now", "LISTO from 1 July 2027"]}
              align={["l", "r", "r", "r"]}
              rows={SALARIES.map((s) => {
                const now = listoFromSalary(s, NOW);
                const next = listoFromSalary(s, NEXT);
                return [formatAUD(s), formatAUD(s * SUPER_GUARANTEE.rate), now > 0 ? fmt2(now) : "Not eligible", next > 0 ? fmt2(next) : "Not eligible"];
              })}
              caption={<>Employer super guarantee only, income equal to salary. Current rules: {formatAUD(NOW.incomeThreshold)} limit, {formatAUD(NOW.maxPayment)} cap. 2027-28: {formatAUD(NEXT.incomeThreshold)} limit, {formatAUD(NEXT.maxPayment)} cap.</>}
            />
            <p>
              <strong>Worked example, $42,000 salary.</strong> Super guarantee is {formatAUD(42_000 * SUPER_GUARANTEE.rate)}. In 2026-27 the salary is above {formatAUD(NOW.incomeThreshold)}, so there is no LISTO. In 2027-28 the salary is under {formatAUD(NEXT.incomeThreshold)}, so LISTO is {pct(NOW.rate)} of {formatAUD(42_000 * SUPER_GUARANTEE.rate)} = {fmt2(listoFromSalary(42_000, NEXT))}, paid into the worker&rsquo;s super.
            </p>
          </section>

          <section>
            <H2 id="how-paid">How and When LISTO Is Paid</H2>
            <p>
              If you lodge a tax return, the ATO pays your LISTO directly into your super fund, based on your return and information from your fund. If you do not lodge, it works out your eligibility using information from your fund and other sources and pays the fund. So lodging your <Link href="/tax-return-2026/">tax return</Link> on time helps. If you have reached your preservation age and are retired, you can ask for it to be paid to you through ATO online services. LISTO goes into your super account, not your pay packet, so it shows up as a lift in your super balance.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link>: check your employer is paying the right super</li>
              <li><Link href="/super-co-contribution/">Super Co-Contribution</Link>: the other low-income super boost</li>
              <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>: more before-tax super</li>
              <li><Link href="/superannuation-guide/">Superannuation Guide</Link>: rates, caps and how super works</li>
              <li><Link href="/working-australians-tax-offset/">Working Australians Tax Offset</Link>: the other 2027-28 change for lower earners</li>
            </ul>
          </section>

          <FaqSection faqs={LISTO_FAQS} label="LISTO" />

          <PageFooter
            slug="listo-calculator"
            lastVerified={LISTO_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>LISTO = {pct(NOW.rate)} × concessional contributions for the year, capped at {formatAUD(NOW.maxPayment)} ({formatAUD(NEXT.maxPayment)} from 1 July 2027) and rounded up to {formatAUD(NOW.minPayment)} if smaller. You must have adjusted taxable income at or below {formatAUD(NOW.incomeThreshold)} ({formatAUD(NEXT.incomeThreshold)} from 1 July 2027), not have held a temporary resident visa, and get at least 10% of income from work. The salary table assumes only employer super guarantee at {SG_PCT}% of salary.</p>
              <p>The ATO&rsquo;s eligibility page was last updated in 2023, before the boost, and states the current rules. The 2027 figures come from the ATO&rsquo;s new-legislation page (updated 17 March 2026) and Treasury. The {pct(NOW.rate)} rate and {formatAUD(NOW.minPayment)} minimum in 2027-28 are assumed unchanged. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
          { href: "/super-co-contribution/", label: "Super Co-Contribution" },
          { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator" },
          { href: "/working-australians-tax-offset/", label: "Working Australians Tax Offset" },
          { href: "/low-income-tax-offset/", label: "Low Income Tax Offset (LITO)" },
        ]} />
      </div>
    </div></div>
  );
}
