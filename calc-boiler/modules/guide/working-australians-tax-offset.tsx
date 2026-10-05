import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { LITO, SOURCES, TAX_BRACKETS_2026_27, TAX_FREE_THRESHOLD, formatAUD } from "@/lib/constants";
import {
  MAX_COMBINED_GAIN,
  MAX_RATE_CUT_SAVING,
  RATE_2027_28,
  RATE_CUT_EFFECTIVE,
  TAX_BRACKETS_2027_28,
  WATO,
  WATO_SOURCES,
  compareTakeHome,
} from "@/lib/constants/tax-2027-28";
import WorkingAustraliansTaxOffsetCalculator from "@/modules/calculator/working-australians-tax-offset-calculator";
import { WATO_FAQS } from "./working-australians-tax-offset-faqs";
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

// /working-australians-tax-offset/ (Oct 2026): the $250 offset and the 14%
// rate from 1 July 2027. Rules and sources: lib/constants/tax-2027-28.ts.

export const WATO_VERIFIED_ON = "5 October 2026";

const SOURCES_LIST: SourceLink[] = [
  { title: "Working Australians tax offset", url: WATO_SOURCES.ato, publisher: SOURCES.ato.name },
  { title: "Personal income tax - new tax cuts for every Australian taxpayer", url: WATO_SOURCES.atoCuts, publisher: SOURCES.ato.name },
  { title: "Latest news on tax law and policy (Royal Assent dates)", url: WATO_SOURCES.atoLegislation, publisher: SOURCES.ato.name },
  { title: "Budget 2026-27 tax system changes", url: WATO_SOURCES.treasury, publisher: "Treasury" },
  { title: "Tax reform, Budget 2026-27", url: WATO_SOURCES.budget, publisher: "Australian Government" },
];

const SALARIES = [25_000, 30_000, 45_000, 60_000, 80_000, 100_000, 150_000, 200_000];
const TABLE = SALARIES.map((s) => ({ s, c: compareTakeHome(s) }));
const EX = compareTakeHome(60_000);

const pct = (r: number) => `${Math.round(r * 100)}%`;

export default function WorkingAustraliansTaxOffsetPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/tax-changes-2026-27/", label: "Tax Changes" }, { label: "Working Australians Tax Offset" }]} />

      <PageHeader title="Working Australians Tax Offset Calculator: $250 and the 14% Rate">
        <p>
          <strong>From 1 July 2027 two tax changes stack: the 15% rate falls to {pct(RATE_2027_28)}, and a new {formatAUD(WATO.maxOffset)} Working Australians Tax Offset (WATO) starts in the {WATO.firstIncomeYear} income year.</strong> Both are law. On the same salary a full-time worker earning $45,000 or more is up to {formatAUD(MAX_COMBINED_GAIN)} a year better off than in 2026-27: {formatAUD(MAX_RATE_CUT_SAVING)} from the rate cut plus {formatAUD(WATO.maxOffset)} from the offset. Enter your salary below to compare your take-home pay.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "New offset", v: `${formatAUD(WATO.maxOffset)} a year`, s: `From ${WATO.firstIncomeYear}, non-refundable` },
          { k: "Rate cut", v: `15% to ${pct(RATE_2027_28)}`, s: `On $18,201 to $45,000, from ${RATE_CUT_EFFECTIVE}` },
          { k: "Most you gain", v: `${formatAUD(MAX_COMBINED_GAIN)} a year`, s: "Versus 2026-27, same salary" },
          { k: "Status", v: "Law", s: `Royal Assent ${WATO.royalAssent}` },
        ]}
      />

      <div className="mb-12"><WorkingAustraliansTaxOffsetCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="what-is-wato">What Is the Working Australians Tax Offset?</H2>
            <p>
              The WATO is a new non-refundable tax offset for Australian resident individuals who earn labour income. The Government announced it in the 2026-27 Budget, and the ATO now lists the measure as law. It is available from the {WATO.firstIncomeYear} income year (1 July 2027 to 30 June 2028) for individuals who are Australian residents for tax purposes during that year and whose net labour income, meaning labour amounts less labour deductions, is above the {formatAUD(WATO.incomeThreshold)} tax-free threshold.
            </p>
            <p>
              The maximum benefit is {formatAUD(WATO.maxOffset)}, and you get all of it if the income tax payable on your net labour income is above {formatAUD(WATO.maxOffset)}. An offset is not a deduction. A deduction lowers your taxable income, so it saves tax at your marginal rate. An offset comes off the tax itself, dollar for dollar, so {formatAUD(WATO.maxOffset)} is worth {formatAUD(WATO.maxOffset)} whatever you earn. Because the WATO is non-refundable it can only reduce your tax to nil. Any unused amount is lost: it is not refunded, transferred or carried forward.
            </p>
          </section>

          <section>
            <H2 id="rate-cut">The 15% to 14% Tax Rate Cut From 1 July 2027</H2>
            <p>
              The second tax rate, on taxable income between $18,201 and $45,000, was 16% in 2025-26, fell to 15% on 1 July 2026, and falls again to {pct(RATE_2027_28)} on {RATE_CUT_EFFECTIVE}. The ATO says both stages are law. The thresholds and the 30%, 37% and 45% rates above $45,000 do not change. A person earning $45,000 or more pays {formatAUD(MAX_RATE_CUT_SAVING)} less tax a year than in 2026-27, and one earning $31,700 pays 1 cent less for every dollar above $18,200, which is $135.
            </p>
            <DataTable
              head={["Taxable income", "2026-27 tax on this income", "2027-28 tax on this income"]}
              rows={TAX_BRACKETS_2026_27.map((b, i) => {
                const n = TAX_BRACKETS_2027_28[i];
                const range = b.max === Infinity ? `${formatAUD(b.min)} and over` : `${formatAUD(b.min)} to ${formatAUD(b.max)}`;
                const text = (x: typeof b) => (x.rate === 0 ? "Nil" : `${formatAUD(Math.round(x.base))} plus ${Math.round(x.rate * 100)}c for each $1 over ${formatAUD(x.min - 1)}`);
                return [range, text(b), text(n)];
              })}
              caption={<>Resident rates, not including the 2% Medicare levy. 2026-27 is the ATO&rsquo;s published scale; 2027-28 applies the ATO&rsquo;s {pct(RATE_2027_28)} rate to the same band. See <Link href="/tax-brackets/">tax brackets</Link> and <Link href="/tax-bracket-history/">tax bracket history</Link>.</>}
            />
          </section>

          <section>
            <H2 id="take-home">Take-Home Pay in 2027-28 vs 2026-27</H2>
            <p>
              The table holds your salary the same in both years, so the difference is purely the law. It includes income tax, the low income tax offset and the Medicare levy at current settings. Pay rises would add to it.
            </p>
            <DataTable
              head={["Salary", "Take-home 2026-27", "Take-home 2027-28", "Better off a year", "Per fortnight"]}
              align={["l", "r", "r", "r", "r"]}
              rows={TABLE.map(({ s, c }) => [formatAUD(s), formatAUD(c.y2026_27.takeHome), formatAUD(c.y2027_28.takeHome), formatAUD(c.gainPerYear), formatAUD(c.gainPerYear / 26, 2)])}
              caption={<>Resident, all labour income, no deductions, HECS or private health adjustments. LITO and Medicare levy held at 2026-27 settings.</>}
            />
            <p>
              <strong>Worked example, $60,000 salary.</strong> In 2026-27 the income tax is {formatAUD(EX.y2026_27.taxBeforeOffsets)} ($4,020 plus 30c on the $15,000 above $45,000), the Medicare levy is {formatAUD(EX.y2026_27.medicare)}, and take-home is {formatAUD(EX.y2026_27.takeHome)}. In 2027-28 the tax before offsets is {formatAUD(EX.y2027_28.taxBeforeOffsets)}, because the first $26,800 of the taxable band now costs 14c rather than 15c. The WATO takes off a further {formatAUD(EX.y2027_28.wato)}, leaving income tax of {formatAUD(EX.y2027_28.incomeTaxPayable)} and take-home of {formatAUD(EX.y2027_28.takeHome)}. That is {formatAUD(EX.gainPerYear)} a year, or {formatAUD(EX.gainPerYear / 26, 2)} a fortnight, more.
            </p>
          </section>

          <section>
            <H2 id="who-gets-less">Who Gets Less Than the Maximum?</H2>
            <ul>
              <li><strong>Earners below $45,000.</strong> The rate cut is worth 1 cent per dollar of income above $18,200, so it grows from nil to {formatAUD(MAX_RATE_CUT_SAVING)}.</li>
              <li><strong>Low earners with little tax payable.</strong> The offset cannot reduce your tax below nil. The low income tax offset already wipes out the tax for people earning up to about {formatAUD(Math.round(TAX_FREE_THRESHOLD + LITO.maxOffset / 0.15), 0)} in 2026-27 and {formatAUD(Math.round(TAX_FREE_THRESHOLD + LITO.maxOffset / RATE_2027_28), 0)} in 2027-28 (<Link href="/low-income-tax-offset/">see the LITO guide</Link>), so they have nothing left for the WATO to reduce.</li>
              <li><strong>Anyone not earning labour income.</strong> Investment income alone does not count as net labour income.</li>
              <li><strong>Non-residents for tax purposes.</strong> The offset needs Australian residency during the income year. See <Link href="/non-resident-tax/">non-resident tax rates</Link>.</li>
            </ul>
          </section>

          <section>
            <H2 id="what-we-dont-know">What We Have Not Confirmed Yet</H2>
            <p>
              Three things are not settled in the official material we read. First, <strong>how the offset will be delivered</strong>: whether your employer&rsquo;s PAYG withholding will include it from 1 July 2027 or whether you receive it when your {WATO.firstIncomeYear} return is assessed. Second, <strong>the exact definition of labour income</strong> for people with business income. Third, <strong>2027-28 settings for the Medicare levy and the low income tax offset</strong>, which this calculator holds at their current values. We will update this page when the ATO publishes more. In the meantime the annual figures above are the effect on your tax for the year.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/tax-changes-2026-27/">Tax Changes 2026-27</Link>: what changed on 1 July 2026</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link>: your tax this year</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>: net pay with super and HECS</li>
              <li><Link href="/pay-rise-calculator/">Pay Rise Calculator</Link>: what a raise adds after tax</li>
              <li><Link href="/stage-3-tax-cuts/">Stage 3 Tax Cuts</Link>: the 2024 cuts, for context</li>
            </ul>
          </section>

          <FaqSection faqs={WATO_FAQS} label="Working Australians Tax Offset" />

          <PageFooter
            slug="working-australians-tax-offset"
            lastVerified={WATO_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>For each year, tax is worked out on the resident scale (2026-27: 15% second rate; 2027-28: {pct(RATE_2027_28)}, same thresholds), less the low income tax offset (limited to the tax), less in 2027-28 the WATO of the lesser of {formatAUD(WATO.maxOffset)} and the tax left after LITO, then the 2% Medicare levy with its low-income phase-in is added. Take-home = salary minus income tax minus Medicare. The WATO is zero at or below {formatAUD(WATO.incomeThreshold)}. The offset is capped at tax after LITO, the cautious reading of &ldquo;can only reduce tax payable to nil&rdquo;.</p>
              <p>Assumes all income is salary, residency for the full year, and no deductions, HECS, private health or other adjustments. General information, not tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/tax-changes-2026-27/", label: "Tax Changes 2026-27" },
          { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
          { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
          { href: "/tax-brackets/", label: "Tax Brackets" },
          { href: "/pay-rise-calculator/", label: "Pay Rise Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
