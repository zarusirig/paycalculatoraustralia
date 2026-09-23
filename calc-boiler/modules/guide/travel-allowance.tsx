import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import {
  CAPITAL_CITIES,
  DOMESTIC_TABLES,
  HIGH_COST_CENTRES,
  OVERSEAS_COST_GROUP,
  OVERSEAS_TABLES,
  OVERTIME_MEAL_REASONABLE,
  PUBLISHED_DAILY_TOTALS,
  SALARY_BANDS,
  TD_2026_4,
  TRAVEL_SOURCES,
  TRUCK_DRIVER_MEALS,
  type CostGroup,
  type SalaryBand,
} from "@/lib/constants/travel-allowance";
import TravelAllowanceCalculator from "@/modules/calculator/travel-allowance-calculator";
import { TRAVEL_ALLOWANCE_FAQS } from "./travel-allowance-faqs";
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

const SOURCES_LIST: SourceLink[] = [
  { title: `${TD_2026_4.id}: reasonable travel and overtime meal allowance expense amounts for the 2026-27 income year`, url: TD_2026_4.url, publisher: SOURCES.ato.name },
  { title: "Travel allowances – PAYG withholding (QC18645)", url: TRAVEL_SOURCES.atoTravelAllowances, publisher: SOURCES.ato.name },
  { title: "Withholding for allowances (QC51680)", url: TRAVEL_SOURCES.atoWithholdingForAllowances, publisher: SOURCES.ato.name },
];

const BANDS: SalaryBand[] = [1, 2, 3];
const money = (n: number) => formatAUD(n, 2);
const mealSum = (b: SalaryBand) => {
  const m = DOMESTIC_TABLES[b].meals;
  return m.breakfast + m.lunch + m.dinner;
};
const T1 = DOMESTIC_TABLES[1];
const OTHER1 = T1.otherCountry!;
const centres = Object.entries(HIGH_COST_CENTRES);
const countriesByGroup = (g: CostGroup) => Object.entries(OVERSEAS_COST_GROUP).filter(([, v]) => v === g).map(([k]) => k);

export default function TravelAllowancePage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/understanding-your-payslip/", label: "Your Payslip" }, { label: "Travel Allowance" }]} />

      <PageHeader title={`Travel Allowance ${TD_2026_4.incomeYear}: ATO Reasonable Amounts`}>
        <p>
          <strong>The ATO&rsquo;s reasonable travel allowance amounts for {TD_2026_4.incomeYear} are in {TD_2026_4.id}, issued {TD_2026_4.issued}.</strong> On a salary of $153,210 or less, a day in Sydney is {money(PUBLISHED_DAILY_TOTALS[1].Sydney!)}: {formatAUD(T1.accommodation.Sydney)} accommodation, {money(mealSum(1))} meals and {money(T1.incidentals)} incidentals. The overtime meal amount is {formatAUD(OVERTIME_MEAL_REASONABLE)}. These aren&rsquo;t rates your employer must pay: they decide whether tax is withheld from your allowance and whether you need receipts to claim what you spent.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Sydney, per day", v: money(PUBLISHED_DAILY_TOTALS[1].Sydney!), s: "Salary $153,210 or less" },
          { k: "Country centres", v: money(PUBLISHED_DAILY_TOTALS[1]["Other country centres"]!), s: "Not in the high-cost list" },
          { k: "Overtime meal", v: formatAUD(OVERTIME_MEAL_REASONABLE), s: "Per meal, 2026-27" },
          { k: "Salary bands", v: "3", s: "$153,210 and $272,680 cut-offs" },
        ]}
      />

      <div className="mb-12"><TravelAllowanceCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="capital-cities">Reasonable Travel Allowance by Capital City, {TD_2026_4.incomeYear}</H2>
            <p>Daily totals (accommodation, meals and incidentals) from Tables 1 to 3 of {TD_2026_4.id}. Your salary means salary excluding allowances; part-timers use the full-time equivalent.</p>
            <DataTable
              head={["City", ...BANDS.map((b) => `Salary ${SALARY_BANDS[b].label}`)]}
              align={["l", "r", "r", "r"]}
              rows={[
                ...CAPITAL_CITIES.map((c) => [c, ...BANDS.map((b) => money(PUBLISHED_DAILY_TOTALS[b][c]!))]),
                ["Other country centres", money(PUBLISHED_DAILY_TOTALS[1]["Other country centres"]!), money(PUBLISHED_DAILY_TOTALS[2]["Other country centres"]!), `${money(207 + mealSum(3) + DOMESTIC_TABLES[3].incidentals)}+`],
              ]}
              caption={<>For the top salary band every country centre uses $207 accommodation, or the high-cost figure below if higher. Source: <a href={TD_2026_4.url} target="_blank" rel="noopener noreferrer">{TD_2026_4.id}</a>, read {TD_2026_4.verifiedOn}.</>}
            />
            <DataTable
              head={["Per day", ...BANDS.map((b) => SALARY_BANDS[b].label)]}
              align={["l", "r", "r", "r"]}
              rows={[
                ["Breakfast", ...BANDS.map((b) => money(DOMESTIC_TABLES[b].meals.breakfast))],
                ["Lunch", ...BANDS.map((b) => money(DOMESTIC_TABLES[b].meals.lunch))],
                ["Dinner", ...BANDS.map((b) => money(DOMESTIC_TABLES[b].meals.dinner))],
                ["Incidentals", ...BANDS.map((b) => money(DOMESTIC_TABLES[b].incidentals))],
                ["Accommodation: Sydney", ...BANDS.map((b) => formatAUD(DOMESTIC_TABLES[b].accommodation.Sydney))],
                ["Accommodation: Melbourne", ...BANDS.map((b) => formatAUD(DOMESTIC_TABLES[b].accommodation.Melbourne))],
                ["Accommodation: Brisbane", ...BANDS.map((b) => formatAUD(DOMESTIC_TABLES[b].accommodation.Brisbane))],
              ]}
              caption={`Capital cities and high-cost country centres. In other country centres the lower bands use ${money(OTHER1.meals.breakfast)} / ${money(OTHER1.meals.lunch)} / ${money(OTHER1.meals.dinner)} for meals (salary $153,210 or less) and ${formatAUD(OTHER1.accommodation)} accommodation.`}
            />
            <p>Meals only count if they fall within your trip: leave at 10 am Monday and return at 3 pm Tuesday and you can use lunch and dinner on Monday and breakfast and lunch on Tuesday. Incidentals apply in full to every day, including part days. The accommodation amount applies only to hotels, motels and serviced apartments, not hostels or caravan parks.</p>
          </section>

          <section>
            <H2 id="country-centres">High-Cost Country Centres: Accommodation</H2>
            <p>{centres.length} regional centres have their own accommodation amount (Table 4). Meals and incidentals are the capital-city amounts for your salary band.</p>
            <details className="not-prose my-4 rounded-xl border border-sandstone-dark/20 bg-white p-4">
              <summary className="cursor-pointer font-semibold text-navy">Show all {centres.length} centres</summary>
              <ul className="mt-4 grid gap-x-6 gap-y-1 text-sm text-warmgray sm:grid-cols-2 lg:grid-cols-3">
                {centres.map(([name, amount]) => (
                  <li key={name} className="flex justify-between gap-2 border-b border-sandstone-dark/10 py-1"><span>{name}</span><span className="tabular-nums text-navy">{formatAUD(amount)}</span></li>
                ))}
              </ul>
            </details>
          </section>

          <section>
            <H2 id="overseas">Overseas Travel: Meals and Incidentals</H2>
            <p>Overseas there is no reasonable amount for accommodation: it must always be substantiated, and tax is always withheld from an overseas accommodation allowance. Meals and incidentals depend on the country&rsquo;s cost group. Countries not listed use cost group 3, and on a day in two countries you use the higher group. Away 6 or more nights in a row? Keep travel records such as a diary, even within the reasonable amount.</p>
            <DataTable
              head={["Cost group", ...BANDS.map((b) => SALARY_BANDS[b].label), "Example countries"]}
              align={["l", "r", "r", "r", "l"]}
              rows={([1, 2, 3, 4, 5, 6] as CostGroup[]).map((g) => [
                String(g),
                ...BANDS.map((b) => formatAUD(OVERSEAS_TABLES[b][g].meals + OVERSEAS_TABLES[b][g].incidentals)),
                countriesByGroup(g).filter((c) => ["New Zealand", "United States of America", "United Kingdom", "Japan", "Singapore", "Indonesia", "India", "China", "Fiji", "Vietnam", "Thailand", "Philippines", "Egypt", "South Africa", "Pakistan", "Nepal", "Canada", "France", "Germany", "Hong Kong"].includes(c)).join(", ") || countriesByGroup(g).slice(0, 3).join(", "),
              ])}
              caption={`Daily meals + incidentals, Tables 6 to 8. ${Object.keys(OVERSEAS_COST_GROUP).length} countries are listed in Table 9; the calculator above covers them all.`}
            />
          </section>

          <section>
            <H2 id="payslip">Travel Allowance on Your Payslip: Is Tax Withheld?</H2>
            <p>Your employer doesn&rsquo;t withhold tax from a travel allowance, and leaves it out of the allowance box on your income statement, when all four of these hold (<a href={TRAVEL_SOURCES.atoTravelAllowances} target="_blank" rel="noopener noreferrer">ATO</a>):</p>
            <ol>
              <li>they expect you to spend all of it on accommodation, food, drink or incidentals;</li>
              <li>the amount and what it&rsquo;s for are shown separately in their records;</li>
              <li>it isn&rsquo;t for overseas accommodation; and</li>
              <li>it&rsquo;s no more than the reasonable amount.</li>
            </ol>
            <p>If the first two hold but the allowance is above the reasonable amount, tax is withheld from the <strong>excess only</strong>, and the whole allowance is reported. The allowance still appears on your payslip either way. An allowance for day trips with no overnight stay is different: it&rsquo;s added to your gross pay and taxed like wages. See how allowances sit on a payslip in <Link href="/understanding-your-payslip/">understanding your payslip</Link>.</p>
            <p><strong>Overtime meals:</strong> an award overtime meal allowance up to {formatAUD(OVERTIME_MEAL_REASONABLE)} isn&rsquo;t withheld from or reported; above it, tax is withheld from the excess.</p>
          </section>

          <section>
            <H2 id="tax-return">Travel Allowance in Your Tax Return</H2>
            <p>If you received an allowance and spent it on deductible travel, you can claim what you actually spent. Claim no more than the reasonable amount and you don&rsquo;t need receipts, but you must be able to show you travelled for work, received and declared the allowance, how you worked out the amount, and that you weren&rsquo;t reimbursed. Claim more than the reasonable amount and you must substantiate the whole claim. If the allowance wasn&rsquo;t on your income statement and you spent all of it, you can leave both the allowance and the deduction out of your return. More: our <Link href="/tax-deductions-guide/">tax deductions guide</Link>.</p>
            <p><strong>Truck drivers</strong> have separate meal amounts for any domestic trip: {money(TRUCK_DRIVER_MEALS.breakfast)} breakfast, {money(TRUCK_DRIVER_MEALS.lunch)} lunch and {money(TRUCK_DRIVER_MEALS.dinner)} dinner, each meal separately (Table 5). Their accommodation and incidentals must always be substantiated.</p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/cents-per-km/">Cents per Kilometre</Link>: the car allowance rate and the 5,000 km cap</li>
              <li><Link href="/gross-vs-net-pay/">Gross vs Net Pay</Link>: where allowances sit on a payslip</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link></li>
              <li><Link href="/tax-return-calculator/">Tax Return Calculator</Link>: estimate your refund</li>
            </ul>
          </section>

          <FaqSection faqs={TRAVEL_ALLOWANCE_FAQS} label="Travel allowance" />

          <PageFooter
            slug="travel-allowance"
            lastVerified={TD_2026_4.verifiedOn}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Every amount is transcribed from {TD_2026_4.id} (the authorised PDF and the ATO legal database page were compared figure by figure). A trip&rsquo;s reasonable amount is accommodation × nights plus (meals + incidentals) × days, where days = nights + 1. The meals figure is a maximum, because meals outside the travel period on the first and last day don&rsquo;t count. The withheld portion is the allowance minus that reasonable amount.</p>
              <p>{TD_2026_4.id} applies to the 2026-27 income year only. For 2025-26 returns use <a href={TD_2026_4.previous.url} target="_blank" rel="noopener noreferrer">{TD_2026_4.previous.id}</a>. General information, not tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/cents-per-km/", label: "Cents per km (91c)" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
          { href: "/tax-deductions-guide/", label: "Tax Deductions Guide" },
          { href: "/gross-vs-net-pay/", label: "Gross vs Net Pay" },
          { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
