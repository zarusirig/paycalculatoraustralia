import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import {
  FIFO_DEFAULTS,
  FIFO_SOURCES,
  FIFO_VERIFIED_ON,
  LAFHA_STATUTORY_FOOD,
  ROSTER_PRESETS,
  calculateFifoPay,
} from "@/lib/constants/fifo-pay";
import { AWE_BY_INDUSTRY, AWE_HEADLINE, AWE_RELEASE, annualise } from "@/lib/data/average-salary";
import FifoPayCalculator from "@/modules/calculator/fifo-pay-calculator";
import { FIFO_FAQS } from "./fifo-pay-faqs";
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
  { title: "Living-away-from-home allowance fringe benefits (QC 71150)", url: FIFO_SOURCES.lafha, publisher: SOURCES.ato.name },
  { title: "FBT guide for employers, 11 Living-away-from-home allowance fringe benefits", url: FIFO_SOURCES.fbtGuideLafha, publisher: SOURCES.ato.name },
  { title: "Zone tax offset", url: FIFO_SOURCES.zoneOffset, publisher: SOURCES.ato.name },
  { title: "Trips you can and can't claim", url: FIFO_SOURCES.trips, publisher: SOURCES.ato.name },
  { title: "SGR 2009/2 Ordinary time earnings", url: FIFO_SOURCES.ote, publisher: SOURCES.ato.name },
  { title: `${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}`, url: AWE_RELEASE.url, publisher: "Australian Bureau of Statistics" },
];

const MINING = AWE_BY_INDUSTRY.find((r) => r.label === "Mining");
const RATES = [45, 55, 65, 75] as const;
const TABLE_ROSTERS = ["2-1", "8-6", "7-7", "4-1"] as const;
const rosters = TABLE_ROSTERS.map((id) => ROSTER_PRESETS.find((p) => p.id === id)!);
const EXAMPLE = calculateFifoPay({ ...FIFO_DEFAULTS, hourlyRate: 55 });

export default function FifoPayCalculatorPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO Pay Guide" }, { label: "FIFO Pay Calculator" }]} />

      <PageHeader title="FIFO Pay Calculator">
        <p>
          <strong>Work out what a FIFO roster pays: gross per swing, per year and after tax.</strong> Pick your roster (2:1, 8:6, even time, 4:1 or your own), enter your hourly rate and shift length, and add shift loadings and site allowances. Hours past 38 a week, averaged across the roster, are paid as overtime. On a 2:1 roster of 12-hour shifts at {formatAUD(55)} an hour, that&rsquo;s {formatAUD(EXAMPLE.annual.gross)} a year gross and {formatAUD(EXAMPLE.tax.takeHomePay)} after tax ({formatAUD(EXAMPLE.takeHomePerFortnight)} a fortnight).
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "2:1 swing, 12h shifts", v: `${EXAMPLE.hoursPerCycle} h`, s: `${EXAMPLE.ordinaryHoursPerCycle} ordinary + ${EXAMPLE.overtimeHoursPerCycle} overtime` },
          { k: "Days on site a year", v: String(EXAMPLE.daysOnSitePerYear), s: "On a 2:1 roster" },
          { k: "Mining average (ABS)", v: MINING ? formatAUD(annualise(MINING.weekly)) : "n/a", s: `Ordinary time, full-time, ${AWE_RELEASE.referencePeriod}` },
          { k: "Zone tax offset", v: "No", s: "If you live outside the zone" },
        ]}
      />

      <div className="mb-12"><FifoPayCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how">How FIFO Pay Is Worked Out</H2>
            <p>Most FIFO jobs in mining, oil and gas and construction pay an hourly rate set by an enterprise agreement. The roster decides how many hours you work, and the agreement decides which of those hours are ordinary time and which are overtime. Many agreements average the 38-hour week across the roster cycle, and that is what this calculator does:</p>
            <ol>
              <li><strong>Hours per cycle:</strong> days on site × hours per shift (14 × 12 = 168 on a 2:1).</li>
              <li><strong>Ordinary hours:</strong> 38 a week across the whole cycle, including your days off (38 × 3 weeks = 114).</li>
              <li><strong>Overtime:</strong> the rest (168 − 114 = 54 hours) at your overtime rate.</li>
              <li><strong>Loadings and allowances:</strong> shift or night loadings on ordinary hours, plus site, remote or district allowances for each day on site.</li>
              <li><strong>Annual pay:</strong> cycle pay × cycles in a 52-week year, then tax on the total.</li>
            </ol>
            <p>Your agreement may pay overtime in steps (for example time and a half for the first hours and double time after), pay travel days, or set a flat annualised salary instead. If so, use your agreement&rsquo;s figures or put your salary into the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.</p>
          </section>

          <section>
            <H2 id="rosters">What Common FIFO Rosters Pay</H2>
            <p>Gross annual pay for 12-hour shifts, overtime at time and a half past 38 hours a week, no loadings or allowances. Every figure is worked out by the calculator above, not taken from job ads.</p>
            <DataTable
              head={["Hourly rate", ...rosters.map((r) => r.label)]}
              align={["l", "r", "r", "r", "r"]}
              rows={RATES.map((rate) => [
                `${formatAUD(rate)}/h`,
                ...rosters.map((ro) => {
                  const res = calculateFifoPay({ ...FIFO_DEFAULTS, daysOn: ro.daysOn, daysOff: ro.daysOff, hourlyRate: rate });
                  return `${formatAUD(res.annual.gross)} (${formatAUD(res.tax.takeHomePay)} net)`;
                }),
              ])}
              caption="Gross a year, with take-home after 2026-27 income tax, Medicare levy and LITO in brackets. Resident, no HECS, with private hospital cover."
            />
            {MINING && (
              <p>For a benchmark, the ABS&rsquo;s Average Weekly Earnings survey puts full-time adult ordinary time earnings in mining at {formatAUD(MINING.weekly, 2)} a week in {AWE_RELEASE.referencePeriod} ({formatAUD(annualise(MINING.weekly))} a year), the highest of any industry and well above the all-industry {formatAUD(AWE_HEADLINE.fullTimeOrdinaryWeekly, 2)}. That figure excludes overtime, which is where long FIFO rosters add most. See the <Link href="/average-salary-australia/">average salary in Australia</Link> for every industry.</p>
            )}
          </section>

          <section>
            <H2 id="allowances">How FIFO Allowances Are Taxed</H2>
            <DataTable
              head={["Payment", "Taxed as your income?", "Why"]}
              rows={[
                ["Site, remote, district or shift allowance", "Yes", "Paid for working, so it's salary and wages; tax is withheld from each pay."],
                ["Travel allowance", "Yes", "The ATO treats a travel allowance as assessable income, not a fringe benefit."],
                ["Living-away-from-home allowance (LAFHA)", "No", "It's a fringe benefit: your employer pays FBT on it, not you."],
                ["Flights, camp accommodation and meals your employer provides", "No", "Not paid to you in cash, so not part of your wages. Any FBT is your employer's."],
              ]}
              caption={<>Sources: ATO <a href={FIFO_SOURCES.lafha} target="_blank" rel="noopener noreferrer">LAFHA fringe benefits</a> and <a href={FIFO_SOURCES.fbtGuideLafha} target="_blank" rel="noopener noreferrer">FBT guide chapter 11</a>, read {FIFO_VERIFIED_ON}.</>}
            />
            <p><strong>LAFHA.</strong> An allowance that compensates you for living away from your normal home is a LAFHA fringe benefit. For a FIFO or drive-in drive-out worker who gives the employer a living-away-from-home declaration, the employer can reduce its taxable value by the accommodation component and the food component above a statutory {formatAUD(LAFHA_STATUTORY_FOOD.adultWeekly)} a week per adult ({formatAUD(LAFHA_STATUTORY_FOOD.childWeekly)} per child). The ATO counts you as FIFO when you work a regular rotating roster, go home on your days off, and daily travel would be unreasonable.</p>
            <p><strong>Travel to site.</strong> Getting from home to your regular work site is private travel, even when it&rsquo;s a flight and even if you live a long way away (<a href={FIFO_SOURCES.trips} target="_blank" rel="noopener noreferrer">ATO</a>). A cash travel allowance for that trip is taxed and there is no deduction to offset it.</p>
            <p><strong>Reportable fringe benefits.</strong> Some fringe benefits over $2,000 in an FBT year appear on your income statement as a reportable fringe benefits amount. It doesn&rsquo;t add income tax, but it counts for income tests such as HECS repayments and the Medicare levy surcharge.</p>
          </section>

          <section>
            <H2 id="zone">FIFO and the Zone Tax Offset</H2>
            <p>The ATO bases the <Link href="/zone-tax-offset/">zone tax offset</Link> on where you usually live, not where you work. If you fly from Perth, Brisbane or another city to a remote site, you can&rsquo;t claim it, however many days you spend on site (<a href={FIFO_SOURCES.zoneOffset} target="_blank" rel="noopener noreferrer">ATO</a>). If your own home is in a zone (the ATO&rsquo;s example is a worker who lives in Darwin and drives to a mine at Kununurra), you can. The calculator above doesn&rsquo;t apply the offset; use the zone tax offset calculator if you live in a zone.</p>
          </section>

          <section>
            <H2 id="super">Super on FIFO Pay</H2>
            <p>Your employer pays Super Guarantee on ordinary time earnings: ordinary hours, shift loadings and allowances paid for ordinary hours. Overtime is excluded, so on a long roster a large share of your pay earns no super. The calculator shows the estimate separately; it isn&rsquo;t taken out of your pay. Check what you&rsquo;re owed with the <Link href="/superannuation-calculator/">superannuation calculator</Link>.</p>
          </section>

          <section>
            <H2 id="payslip">Why a FIFO Payslip Looks Over-Taxed</H2>
            <p>Most FIFO workers are paid fortnightly whatever the roster, so a fortnight with a full swing of overtime can be much bigger than one on break. Tax is withheld as if you earned that pay every fortnight, which pushes big pays into higher brackets. Across the year it evens out, and any over-withholding comes back when you lodge. Check a single pay with the <Link href="/fortnightly-pay-calculator/">fortnightly pay calculator</Link> or the <Link href="/overtime-pay-calculator/">overtime pay calculator</Link>.</p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/mining-fifo-pay-guide/">Mining &amp; FIFO Pay Guide</Link>: rosters, roles and allowances</li>
              <li><Link href="/zone-tax-offset/">Zone Tax Offset Calculator</Link>: if you live in a remote zone</li>
              <li><Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link></li>
              <li><Link href="/construction-trades-pay/">Construction &amp; Trades Pay</Link></li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link></li>
            </ul>
          </section>

          <FaqSection faqs={FIFO_FAQS} label="FIFO pay" />

          <PageFooter
            slug="fifo-pay-calculator"
            lastVerified={FIFO_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Hours per cycle are days on site × shift length. Ordinary hours are the weekly ordinary hours × (cycle days ÷ 7), capped at hours worked; the remainder is overtime at the multiplier you enter. Shift loading applies to ordinary-hours pay; site allowance is per day on site. Annual figures multiply one cycle by 364 ÷ cycle days (52 weeks, the site-wide convention). Tax, Medicare levy, the Medicare levy surcharge and HECS-HELP come from our 2026-27 tax engine, with LITO applied. Employer super is 12% of ordinary pay, loadings and allowances, capped at the maximum contribution base.</p>
              <p>Not modelled: stepped overtime rates, paid travel days, leave (which usually pays ordinary hours only), the zone tax offset and deductions. General information, not advice: your enterprise agreement sets your actual pay.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO Pay Guide" },
          { href: "/zone-tax-offset/", label: "Zone Tax Offset Calculator" },
          { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
          { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
          { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
