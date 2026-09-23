import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import {
  EXTRA_PAY_SCHEDULES,
  FY_2026_27,
  PAY_PERIODS_SOURCES,
  PAY_PERIODS_VERIFIED_ON,
  extraPayTriggers,
  financialYear,
  weekdayName,
  weeksInCalendarYear,
} from "@/lib/constants/pay-periods";
import ExtraPayTable from "@/modules/tax-tables/extra-pay-table";
import PayDatesCalculator from "@/modules/calculator/pay-dates-calculator";
import { PAY_PERIODS_FAQS } from "./pay-periods-faqs";
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
  { title: "Fortnightly tax table: When there are 27 pays in a financial year", url: PAY_PERIODS_SOURCES.atoFortnightly, publisher: SOURCES.ato.name },
  { title: "Weekly tax table: When there are 53 pays in a financial year", url: PAY_PERIODS_SOURCES.atoWeekly, publisher: SOURCES.ato.name },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${weekdayName(iso)} ${d} ${MONTHS[m - 1]} ${y}`;
};

const FN = EXTRA_PAY_SCHEDULES.fortnightly;
const WK = EXTRA_PAY_SCHEDULES.weekly;
const T = extraPayTriggers(FY_2026_27);
const FUTURE = Array.from({ length: 10 }, (_, i) => financialYear(2026 + i));
const CAL_YEARS = [2026, 2027, 2028];

export default function PayPeriodsPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator" }, { label: "Fortnights in a Year" }]} />

      <PageHeader title="How Many Fortnights in a Year?">
        <p>
          <strong>There are 26 fortnights in a year, plus one spare day (two in a leap year).</strong> So fortnightly pay is usually 26 pays a year, weekly pay 52 and monthly pay 12. Because of the spare day, a financial year sometimes holds 27 fortnightly or 53 weekly pay days. In 2026-27 that happens if you&rsquo;re paid fortnightly on {longDate(FY_2026_27.start)}, or weekly on a {T.weeklyWeekdays.join(" or ")}.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Fortnights in a year", v: "26", s: "+1 day (+2 in a leap year)" },
          { k: "Weeks in a year", v: "52", s: "+1 day (+2 in a leap year)" },
          { k: "Most fortnightly pays", v: String(FN.extraPayCount), s: `In ${FY_2026_27.label}: pay day on 1 July 2026` },
          { k: "Most weekly pays", v: String(WK.extraPayCount), s: `In ${FY_2026_27.label}: paid on ${T.weeklyWeekdays.join("/")}s` },
        ]}
      />

      <div className="mb-12"><PayDatesCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="pay-periods">Pay Periods in a Year</H2>
            <DataTable
              head={["Paid", "Pay periods in a normal year", "Most in one financial year", "Divide annual salary by"]}
              align={["l", "r", "r", "r"]}
              rows={[
                ["Weekly", String(WK.standardPayCount), String(WK.extraPayCount), "52"],
                ["Fortnightly", String(FN.standardPayCount), String(FN.extraPayCount), "26"],
                ["Monthly", "12", "12", "12"],
              ]}
              caption="The ATO's tax tables assume 52 weekly and 26 fortnightly pays; monthly pay is always 12."
            />
            <p>To turn a salary into pay per period, divide by the number in the last column, or use the <Link href="/weekly-pay-calculator/">weekly</Link>, <Link href="/fortnightly-pay-calculator/">fortnightly</Link> or <Link href="/monthly-pay-calculator/">monthly pay calculator</Link>, which also take out tax.</p>
          </section>

          <section>
            <H2 id="weeks">How Many Weeks in a Year?</H2>
            <p>A year has 52 weeks and 1 day, or 52 weeks and 2 days in a leap year. The spare day means the weekday the year starts on happens 53 times.</p>
            <DataTable
              head={["Calendar year", "Days", "Weeks", "Weekday that occurs 53 times"]}
              align={["l", "r", "l", "l"]}
              rows={CAL_YEARS.map((y) => {
                const w = weeksInCalendarYear(y);
                const extra = Array.from({ length: w.spareDays }, (_, i) => weekdayName(`${y}-01-0${i + 1}`));
                return [String(y), String(w.days), `52 weeks + ${w.spareDays} day${w.spareDays > 1 ? "s" : ""}`, extra.join(" and ")];
              })}
            />
          </section>

          <section>
            <H2 id="financial-year">Fortnights and Weeks in the 2026-27 Financial Year</H2>
            <p>The 2026-27 financial year runs from {longDate(FY_2026_27.start)} to {longDate(FY_2026_27.end)}: {FY_2026_27.days} days, which is 26 fortnights (or 52 weeks) and 1 day. What matters for pay is how many <strong>pay days</strong> fall inside those dates:</p>
            <ul>
              <li><strong>Fortnightly:</strong> 27 pay days if one falls on {longDate(FY_2026_27.start)} (the 27th is then {longDate(FY_2026_27.end)}). Every other fortnightly cycle gets 26.</li>
              <li><strong>Weekly:</strong> 53 pay days if you&rsquo;re paid on a {T.weeklyWeekdays.join(" or ")}; 52 on any other day.</li>
              <li><strong>Monthly:</strong> 12, always.</li>
            </ul>
            <p>The table shows when the extra pay can happen over the next ten financial years. A year containing 29 February has two spare days, so two fortnightly start dates and two weekdays qualify.</p>
            <DataTable
              head={["Financial year", "Days", "53 weekly pays if paid on", "27 fortnightly pays if a pay day is on"]}
              rows={FUTURE.map((fy) => {
                const t = extraPayTriggers(fy);
                return [fy.label, String(fy.days), t.weeklyWeekdays.join(" or "), t.fortnightlyFirstPayDates.map(longDate).join(" or ")];
              })}
              caption="Worked out from the calendar. A fortnightly cycle whose pay day falls on the listed date also has a pay day 26 fortnights later, on 30 June (or 29 June)."
            />
          </section>

          <section>
            <H2 id="extra-pay">Tax When There Are 27 or 53 Pays</H2>
            <p>PAYG withholding tables are built for {FN.standardPayCount} fortnightly or {WK.standardPayCount} weekly pays. In an extra-pay year you can end up with slightly too little tax withheld, and a small bill when you lodge. The ATO says employers should tell staff when a year has an extra pay, and publishes an optional extra amount you can <strong>ask</strong> your employer to withhold from every pay:</p>
            <h3>Fortnightly (27 pays)</h3>
            <ExtraPayTable frequency="fortnightly" schedule={FN} />
            <h3>Weekly (53 pays)</h3>
            <ExtraPayTable frequency="weekly" schedule={WK} />
            <p className="text-sm">Source: ATO <a href={PAY_PERIODS_SOURCES.atoFortnightly} target="_blank" rel="noopener noreferrer">fortnightly</a> and <a href={PAY_PERIODS_SOURCES.atoWeekly} target="_blank" rel="noopener noreferrer">weekly</a> tax tables, read {PAY_PERIODS_VERIFIED_ON}. Full tables: <Link href="/fortnightly-tax-table/#27-pays">fortnightly tax table</Link>, <Link href="/weekly-tax-table/#53-pays">weekly tax table</Link>.</p>
          </section>

          <section>
            <H2 id="more-money">Does a 27th Pay Mean More Money?</H2>
            <p>That depends on how your employer sets your pay, and your contract, award or agreement decides it. If your fortnightly amount stays the same, you get 27 pays in that financial year instead of 26: more cash in that year and a higher taxable income for it, which is why withholding can fall short. Some employers instead recalculate the fortnightly amount so an annual salary is spread over 27 pays, and the year&rsquo;s total stays the same. If you&rsquo;re not sure which applies, ask your payroll team before the year starts.</p>
            <p>Budgeting tip: most years, two months have three fortnightly pays (five weekly pays for four months). The calculator above lists them for your pay day.</p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/fortnightly-pay-calculator/">Fortnightly Pay Calculator</Link>: pay after tax each fortnight</li>
              <li><Link href="/weekly-pay-calculator/">Weekly Pay Calculator</Link></li>
              <li><Link href="/monthly-pay-calculator/">Monthly Pay Calculator</Link></li>
              <li><Link href="/fortnightly-tax-table/">Fortnightly Tax Table 2026-27</Link></li>
              <li><Link href="/tax-calendar/">Tax Calendar 2026-27</Link>: key dates in the financial year</li>
              <li><Link href="/centrelink-payment-dates/">Centrelink Payment Dates</Link>: the fortnightly payment cycle and Christmas changes</li>
            </ul>
          </section>

          <FaqSection faqs={PAY_PERIODS_FAQS} label="Pay periods" />

          <PageFooter
            slug="fortnights-in-a-year"
            lastVerified={PAY_PERIODS_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Pay days are generated from the date you enter by stepping 7 or 14 days (or one calendar month, clamped to the last day of short months) and counted if they fall between 1 July and 30 June. A year has an extra pay when the count is above 52 (weekly) or 26 (fortnightly), which is the test the ATO uses. The extra-withholding amounts are the ATO&rsquo;s published look-up values, not a formula.</p>
              <p>We don&rsquo;t move pay days for weekends or public holidays, because employers handle that differently. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator" },
          { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
          { href: "/monthly-pay-calculator/", label: "Monthly Pay Calculator" },
          { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table" },
          { href: "/tax-calendar/", label: "Tax Calendar 2026-27" },
        ]} />
      </div>
    </div></div>
  );
}
