import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { HECS_HELP, MEDICARE_LEVY, formatAUD, formatPercent } from "@/lib/constants";
import {
  MARGINAL_RATES_SOURCES as SRC,
  MARGINAL_RATES_VERIFIED_ON,
  marginalBands,
  raiseOutcome,
} from "@/lib/constants/marginal-rates";
import MarginalRateCalculator from "@/modules/calculator/marginal-rate-calculator";
import { MARGINAL_TAX_RATES_FAQS } from "./marginal-tax-rates-faqs";
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

// /marginal-tax-rates/ — what the next dollar costs and what a raise or bonus
// really adds to take-home pay. Deliberately NOT a second /tax-brackets/: that
// page lists the scale and what tax is payable at each threshold; this one
// answers the raise question and shows the all-in band rates (Medicare
// shade-in and LITO withdrawal included). Arithmetic: lib/constants/marginal-rates.ts.

const SOURCES_LIST: SourceLink[] = [
  { title: "Tax rates – Australian resident", url: SRC.atoResidentRates, publisher: "Australian Taxation Office" },
  { title: "Low income tax offset", url: SRC.atoLitoPage, publisher: "Australian Taxation Office" },
  { title: "Medicare levy reduction for low-income earners", url: SRC.atoMedicareLevy, publisher: "Australian Taxation Office" },
  { title: "PAYG withholding: Schedule 1 formulas", url: SRC.atoWithholding, publisher: "Australian Taxation Office" },
];

const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;
const ROWS = [30_000, 50_000, 70_000, 90_000, 140_000, 200_000];

export default function MarginalTaxRatesPage() {
  const bands = marginalBands();
  const example = raiseOutcome({ salary: 85_000, raise: 10_000 });
  const crossing = raiseOutcome({ salary: 130_000, raise: 10_000 });
  const helpExample = raiseOutcome({ salary: 85_000, raise: 10_000, hasHelpDebt: true });
  const noPhi = raiseOutcome({ salary: 100_000, raise: 10_000, noPrivateHealth: true });
  const withPhi = raiseOutcome({ salary: 100_000, raise: 10_000 });
  const topBand = bands[bands.length - 1];

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/tax-brackets/", label: "Tax" }, { label: "Marginal Tax Rates" }]} />

      <PageHeader title="Marginal Tax Rates Australia 2026-27: What a Raise or Bonus Really Nets">
        <p>
          <strong>Your marginal tax rate is the tax on your next dollar, not on all of your income.</strong> A $10,000 raise on $85,000 is taxed at 30% plus 2% Medicare, so you keep {formatAUD(example.netGain)} of it. Your average rate is lower than your marginal rate, and a raise never lowers your take-home pay. Use the calculator below to see what any raise, bonus or extra overtime is worth after tax, using 2026-27 resident rates.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "$85k + $10k raise", v: formatAUD(example.netGain), s: `You keep ${Math.round((1 - example.marginalRateOnRaise) * 100)}c in the dollar` },
          { k: "Top band", v: pct(topBand.effectiveRate), s: "45% scale rate + 2% Medicare, over $190,000" },
          { k: "Most workers", v: "32%", s: "$66,667 to $135,000: 30% + 2% Medicare" },
          { k: "Costliest low band", v: pct(Math.max(...bands.filter((b) => b.to <= 66_667).map((b) => b.effectiveRate))), s: "$45,000 to $66,667 as the LITO is withdrawn" },
        ]}
      />

      <div className="mb-12"><MarginalRateCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="marginal-vs-average">Marginal vs Average Tax Rate</H2>
            <p>
              Australia taxes income in slices. The first $18,200 is tax-free, the next slice up to $45,000 is taxed at 15%, and so on up to 45% above $190,000. Your <strong>marginal tax rate</strong> is the rate on the slice your next dollar lands in. Your <strong>average tax rate</strong> is your total tax divided by your total income. Because most of your income sits in the lower slices, the average is always below the marginal rate.
            </p>
            <p>
              The distinction matters whenever your income changes at the edge: a pay rise, a bonus, overtime, a second job, a salary sacrifice, or a deduction. The edge dollar is taxed at the marginal rate, so that is the rate to use. If you want the scale itself, with the tax payable at every threshold and how 2026-27 compares with 2025-26, see the <Link href="/tax-brackets/">tax brackets page</Link>. This page starts where that one stops: what the scale means for the money you are about to earn.
            </p>
          </section>

          <section>
            <H2 id="all-in-bands">The All-In Marginal Rate at Every Income</H2>
            <p>
              The scale rate is not always what the next dollar costs. The Medicare levy and the low income tax offset (LITO) change the real rate in the lower bands. Here is the all-in marginal rate for a resident single taxpayer with no HELP debt, in ten bands:
            </p>
            <DataTable
              head={["Taxable income", "Scale rate", "All-in marginal rate", "Why"]}
              align={["l", "r", "r", "l"]}
              rows={bands.map((b) => [
                b.to === Infinity ? `Over ${formatAUD(b.from)}` : `${formatAUD(b.from + (b.from === 0 ? 0 : 1))} to ${formatAUD(b.to)}`,
                pct(b.scaleRate),
                pct(b.effectiveRate),
                b.why,
              ])}
              caption={<>ATO resident rates for 2026-27 (last updated 13 August 2026), LITO (ATO QC105020) and the Medicare levy. Medicare levy low-income thresholds are the 2025-26 figures, the latest the ATO has published. Read {MARGINAL_RATES_VERIFIED_ON}.</>}
            />
            <p>
              Two bands catch people out. Between {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} and {formatAUD(MEDICARE_LEVY.shadeInThreshold)}, the Medicare levy phases in at 10c per dollar, so the all-in rate is 25%, not 15%. And from $37,500 to $66,667 the LITO is withdrawn, which adds 5c per dollar to $45,000 and 1.5c per dollar after it. That is why a raise at $50,000 can cost more than a raise at $90,000, as the table below shows. For the offset itself, see the <Link href="/low-income-tax-offset/">low income tax offset page</Link>.
            </p>
          </section>

          <section>
            <H2 id="what-a-raise-nets">What a $5,000 Raise Actually Nets</H2>
            <p>The same $5,000 raise is worth different amounts depending on where your salary sits. Each row below is a full run of the 2026-27 tax engine, with and without the raise.</p>
            <DataTable
              head={["Current salary", "Extra tax and Medicare", "You keep", "Marginal rate on the raise"]}
              align={["l", "r", "r", "r"]}
              rows={ROWS.map((s) => {
                const r = raiseOutcome({ salary: s, raise: 5_000 });
                return [formatAUD(s), formatAUD(r.extraTax), formatAUD(r.netGain), pct(r.marginalRateOnRaise)];
              })}
              caption="Resident, single, no HELP debt, private hospital cover held. Not a statement of what your employer will withhold."
            />
          </section>

          <section>
            <H2 id="worked-example">Worked Example: A $10,000 Raise on $85,000</H2>
            <p>
              Sam earns {formatAUD(85_000)} and is offered a {formatAUD(10_000)} raise to {formatAUD(example.newSalary)}. Both incomes sit inside the 30% bracket ($45,001 to $135,000), so the extra {formatAUD(10_000)} is taxed at 30% plus the 2% Medicare levy: {formatAUD(example.extraTax)} of extra tax, leaving Sam with <strong>{formatAUD(example.netGain)}</strong> a year, or {formatAUD(example.perFortnight, 2)} extra each fortnight. Sam&rsquo;s average rate moves from {formatPercent(example.averageBefore, 1)} to {formatPercent(example.averageAfter, 1)}; the raise costs {formatPercent(example.marginalRateOnRaise, 0)}, the average only edges up.
            </p>
            <p>
              If Sam had {formatAUD(130_000)} instead, the same {formatAUD(10_000)} would cross the {formatAUD(135_000)} line. Only the part above it is taxed at 37%: five thousand at 32% and five thousand at 39% all-in gives {formatAUD(crossing.extraTax)} of extra tax. Crossing a bracket never taxes the income below it at the higher rate. To see the full picture of a salary change with take-home pay per pay period, use the <Link href="/pay-rise-calculator/">pay rise calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="things-that-change-it">What Can Make a Raise Cost More</H2>
            <ul>
              <li><strong>A HELP debt.</strong> From {formatAUD(HECS_HELP.minimumThreshold)} a repayment applies, built from 15c per dollar up to {formatAUD(HECS_HELP.bands[2].min - 1)}, then 17c to {formatAUD(HECS_HELP.bands[3].min - 1)}. On Sam&rsquo;s example, a HELP debt takes the net gain from {formatAUD(example.netGain)} to {formatAUD(helpExample.netGain)}. Use the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> for the exact repayment.</li>
              <li><strong>The Medicare levy surcharge.</strong> Without private hospital cover, the surcharge applies to singles above {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} and is charged on your whole income, not just the part above it. A {formatAUD(10_000)} raise on {formatAUD(100_000)} keeps {formatAUD(withPhi.netGain)} with cover, but {formatAUD(noPhi.netGain)} without it. See the <Link href="/medicare-levy-surcharge-calculator/">Medicare levy surcharge calculator</Link>.</li>
              <li><strong>Losing a benefit.</strong> Family Tax Benefit, Centrelink payments and child care subsidy all reduce as income rises, which is a cost on top of tax. Those are separate income tests, not part of the tax scale.</li>
            </ul>
          </section>

          <section>
            <H2 id="bonus-overtime">Bonuses, Overtime and Extra Shifts</H2>
            <p>
              A bonus or overtime is not taxed at a special rate. It is added to your taxable income for the year, so it is taxed at your marginal rate exactly like a raise. What differs is the <em>withholding</em>. Your employer withholds tax on a bonus using the ATO&rsquo;s method for bonuses and back payments, which spreads the payment across the year&rsquo;s pay periods to estimate the tax. That can withhold more or less than the final tax, and the difference is settled when you lodge your return. The <Link href="/bonus-tax-calculator/">bonus tax calculator</Link> shows the true annual tax on a bonus and the likely withholding; the <Link href="/overtime-pay-calculator/">overtime calculator</Link> does the same for extra hours.
            </p>
          </section>

          <section>
            <H2 id="reducing">Using Your Marginal Rate to Decide</H2>
            <p>
              Because the marginal rate is the rate on the next dollar, it is also the rate that a deduction or pre-tax contribution saves. A $1,000 work-related deduction saves 32c in the dollar at $90,000 but 39c at $150,000. Salary sacrificing into super works the same way: the money skips your marginal rate and pays 15% contributions tax in the fund instead, so the saving grows with your marginal rate. The <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> shows the result against the concessional contributions cap, and the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> shows the full pay after tax.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/tax-brackets/">Tax Brackets 2026-27</Link>: the scale and the tax at each threshold</li>
              <li><Link href="/pay-rise-calculator/">Pay Rise Calculator</Link>: what a permanent raise adds to each pay</li>
              <li><Link href="/bonus-tax-calculator/">Bonus Tax Calculator</Link>: tax on a bonus, and what is withheld</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link>: your total tax for the year</li>
              <li><Link href="/tax-on/">Tax on Every Salary</Link>: income tax and marginal rate at each salary</li>
            </ul>
          </section>

          <FaqSection faqs={MARGINAL_TAX_RATES_FAQS} label="Marginal tax rate" />

          <PageFooter
            slug="marginal-tax-rates"
            lastVerified={MARGINAL_RATES_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Every figure is a difference between two full runs of the site&rsquo;s 2026-27 resident tax engine: tax on the new income less tax on the old income, with the low income tax offset applied, the Medicare levy (including the low-income shade-in), the HELP repayment if selected and the Medicare levy surcharge if no private cover is selected. The marginal rate on a raise is the extra tax divided by the raise; the average rate is total tax divided by total income. The all-in bands are the slope of tax plus levy across the breakpoints in the ATO scale, the LITO and the levy thresholds.</p>
              <p>Assumes a resident for the full year, single, with no other offsets, deductions or income. It shows the annual tax outcome, not your employer&rsquo;s withholding, and is general information, not tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/tax-brackets/", label: "Tax Brackets 2026-27" },
          { href: "/pay-rise-calculator/", label: "Pay Rise Calculator" },
          { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator" },
          { href: "/low-income-tax-offset/", label: "Low Income Tax Offset" },
          { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
