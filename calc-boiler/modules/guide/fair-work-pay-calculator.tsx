import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, calculatePayBreakdown, formatAUD, hourlyToAnnual } from "@/lib/constants";
import { HOSPITALITY_AWARD, HOSPITALITY_RATES, RETAIL_AWARD, RETAIL_RATES } from "@/lib/constants/hospitality-award";
import { SCHADS_AWARD, SCHADS_SACS } from "@/lib/constants/schads-award";
import { FAST_FOOD_AWARD, MODERN_AWARDS, roundCents } from "@/lib/constants/modern-awards";
import { CASUAL_LOADING, JUNIOR_RATES, NMW_ORDER } from "@/lib/constants/junior-rates";
import { NMW, NMW_DECISION } from "@/lib/constants/minimum-wage";
import EaAwardFloorChecker from "@/modules/calculator/ea-award-floor-checker";
import { FAIR_WORK_PAY_CALCULATOR_FAQS } from "./fair-work-pay-calculator-faqs";
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

// Sources, all read 25 September 2026.
const PACT = "https://calculate.fairwork.gov.au/";
const PACT_FIND_AWARD = "https://calculate.fairwork.gov.au/FindYourAward";
const PAY_GUIDES = "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides";
const AWR = "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews";
const VERIFIED = "25 September 2026";

const SOURCES_LIST: SourceLink[] = [
  { title: "Pay and Conditions Tool (PACT)", url: PACT, publisher: SOURCES.fwo.name },
  { title: "Pay guides", url: PAY_GUIDES, publisher: SOURCES.fwo.name },
  { title: `${NMW_DECISION.name} decision ${NMW_DECISION.citation}`, url: AWR, publisher: SOURCES.fwc.name },
  { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: SOURCES.fwc.name },
];

// Every award the site carries a verified rate table for, from the same
// constants the award pages and the floor checker read. Never typed here.
interface AwardRow {
  name: string;
  code: string;
  href: string;
  rates: readonly { level: string; hourly: number }[];
}
const AWARD_ROWS: AwardRow[] = [
  { name: RETAIL_AWARD.name, code: RETAIL_AWARD.code, href: "/retail-award-rates/", rates: RETAIL_RATES },
  { name: HOSPITALITY_AWARD.name, code: HOSPITALITY_AWARD.code, href: "/hospitality-award-rates/", rates: HOSPITALITY_RATES },
  { name: SCHADS_AWARD.name, code: SCHADS_AWARD.code, href: "/schads-award-pay-rates/", rates: SCHADS_SACS.map((r) => ({ level: r.classification, hourly: r.hourly })) },
  ...Object.values(MODERN_AWARDS).map((a) => ({ name: a.meta.name, code: a.meta.code, href: a.meta.href, rates: a.rates })),
].sort((a, b) => a.name.localeCompare(b.name));
const lowest = (rows: AwardRow["rates"]) => rows.reduce((m, r) => (r.hourly < m.hourly ? r : m), rows[0]);
const highest = (rows: AwardRow["rates"]) => rows.reduce((m, r) => (r.hourly > m.hourly ? r : m), rows[0]);

// A worked week for a Fast Food Award Level 1 casual, from the award's own
// PenaltyRow data (casual percentages already include the 25% loading).
const FF_L1 = FAST_FOOD_AWARD.rates[0];
const penaltyRow = (prefix: string) => {
  const row = FAST_FOOD_AWARD.penalties.find((p) => p.label.startsWith(prefix));
  if (!row) throw new Error(`fast food penalty row "${prefix}" missing`);
  return row;
};
const WEEK = [
  { day: "Tuesday", hours: 6, casual: 1 + CASUAL_LOADING, label: `casual base (${Math.round((1 + CASUAL_LOADING) * 100)}%)` },
  { day: "Thursday", hours: 6, casual: 1 + CASUAL_LOADING, label: `casual base (${Math.round((1 + CASUAL_LOADING) * 100)}%)` },
  { day: "Saturday", hours: 6, casual: penaltyRow("Saturday").casual, label: `casual Saturday (${Math.round(penaltyRow("Saturday").casual * 100)}%)` },
  { day: "Sunday", hours: 5, casual: penaltyRow("Sunday (Level 1").casual, label: `casual Sunday, Level 1 (${Math.round(penaltyRow("Sunday (Level 1").casual * 100)}%)` },
].map((d) => {
  const rate = roundCents(FF_L1.hourly * d.casual);
  return { ...d, rate, gross: roundCents(rate * d.hours) };
});
const WEEK_HOURS = WEEK.reduce((s, d) => s + d.hours, 0);
const WEEK_GROSS = roundCents(WEEK.reduce((s, d) => s + d.gross, 0));

// From award gross to take-home: Retail Level 1 full-time, engine-computed.
const R1 = RETAIL_RATES[0];
const R1_ANNUAL = hourlyToAnnual(R1.hourly, EMPLOYMENT.standardWeeklyHours);
const R1_PAY = calculatePayBreakdown({ grossSalary: R1_ANNUAL });

const pct = (v: number) => `${Math.round(v * 100)}%`;

export default function FairWorkPayCalculatorPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/award-rates/", label: "Award Rates" }, { label: "Fair Work Pay Calculator" }]} />

      <PageHeader title={`Fair Work Pay Calculator (PACT) ${SITE_CONFIG.financialYear}: How It Works and the Rates Behind It`}>
        <p>
          <strong>The Fair Work pay calculator is the Fair Work Ombudsman&rsquo;s Pay and Conditions Tool (PACT), which returns the minimum award rate for your classification, employment type, age and the day and time you worked.</strong> For {SITE_CONFIG.financialYear} those minimums start at the national minimum wage of {formatAUD(NMW.hourly, 2)} an hour and run through every level of the {AWARD_ROWS.length} awards below, from the first full pay period on or after {NMW_DECISION.operativeFrom}. This page explains what PACT asks, shows the base rates it draws on, and lets you check the hourly rate on your payslip against the award floor.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Awards on this page", v: `${AWARD_ROWS.length}`, s: "Every level, from the FWO pay guides" },
          { k: "National minimum wage", v: formatAUD(NMW.hourly, 2), s: `${formatAUD(NMW.weekly, 2)} a week, ${NMW_ORDER.reference}` },
          { k: "Casual loading", v: pct(CASUAL_LOADING), s: "Added to the base rate" },
          { k: "Rates apply from", v: NMW_DECISION.operativeFrom, s: "First full pay period on or after" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="what-is-pact">What the Fair Work Pay Calculator (PACT) Is</H2>
            <p>
              <a href={PACT} target="_blank" rel="noopener noreferrer">PACT</a> is a set of four calculators on the Fair Work Ombudsman&rsquo;s site: a <strong>pay calculator</strong> for base and penalty rates, a <strong>shift calculator</strong> that prices a roster of shifts, a <strong>leave calculator</strong> for annual and personal leave balances, and a <strong>notice and redundancy calculator</strong>. It also holds Find My Award, which works out which award covers a job.
            </p>
            <p>
              It covers employees in the national workplace system who are paid under a modern award: the base rate for each classification, the casual loading, penalty rates, overtime and the allowances the award fixes in dollars. It does not cover pay set by an <Link href="/enterprise-agreement/">enterprise agreement</Link>, above-award rates in a contract, unincorporated employers in the Western Australian state system, or state public sector pay. Where an agreement applies, PACT&rsquo;s figure is still the floor the agreement&rsquo;s base rate cannot go under.
            </p>
          </section>

          <section>
            <H2 id="step-by-step">Step by Step: What PACT Asks and Where to Find the Answer</H2>
            <ol>
              <li><strong>Your award.</strong> Named on many payslips and in most contracts; otherwise run <a href={PACT_FIND_AWARD} target="_blank" rel="noopener noreferrer">Find My Award</a> or start from our <Link href="/award-rates/">award rates A&ndash;Z</Link>.</li>
              <li><strong>Your classification.</strong> The level or grade in your contract or position description (for example &ldquo;retail employee level 1&rdquo;). If it is missing, the award&rsquo;s classification schedule matches duties to a level.</li>
              <li><strong>Employment type.</strong> Full-time, part-time or casual. A casual payslip usually shows the loading as part of the hourly rate.</li>
              <li><strong>Your age.</strong> Some awards pay a junior percentage under 21; others pay the adult rate at any age.</li>
              <li><strong>Hours, and the day and time worked.</strong> From your roster or timesheet. PACT prices each day separately, so weekend, evening and public holiday hours get their own line.</li>
            </ol>
            <p>
              The result is a gross amount for the period: base rate plus loading and penalties, before tax and super. The same figures are printed in the <a href={PAY_GUIDES} target="_blank" rel="noopener noreferrer">FWO pay guides</a>, one PDF per award.
            </p>
          </section>

          <section>
            <H2 id="award-rates">Award Base Rates by Level for {SITE_CONFIG.financialYear}</H2>
            <p>
              The base rates PACT starts from, for the {AWARD_ROWS.length} awards this site carries in full. Each row shows the lowest and highest adult classification; the linked page lists every level, plus penalty, overtime and junior rates.
            </p>
            <DataTable
              head={["Award", "Levels", "Lowest adult rate", "Highest adult rate"]}
              align={["l", "r", "r", "r"]}
              rows={AWARD_ROWS.map((a) => {
                const lo = lowest(a.rates);
                const hi = highest(a.rates);
                return [
                  <Link key={a.code} href={a.href}>{a.name} ({a.code})</Link>,
                  a.rates.length,
                  `${formatAUD(lo.hourly, 2)} (${lo.level})`,
                  `${formatAUD(hi.hourly, 2)} (${hi.level})`,
                ];
              })}
              caption={<>Adult full-time hourly rates from the first full pay period on or after {NMW_DECISION.operativeFrom}, read from the FWO pay guide for each award. Casuals add {pct(CASUAL_LOADING)}.</>}
            />
          </section>

          <section>
            <H2 id="minimum-wage">National Minimum Wage and Junior Percentages</H2>
            <p>
              If no award or agreement covers you, the floor is the national minimum wage of <strong>{formatAUD(NMW.hourly, 2)} an hour</strong>, or {formatAUD(NMW.weekly, 2)} for a {EMPLOYMENT.standardWeeklyHours}-hour week, set by the <a href={NMW_ORDER.url} target="_blank" rel="noopener noreferrer">{NMW_ORDER.citation}</a> ({NMW_ORDER.reference}) from {NMW_ORDER.operativeFrom}. Award-free juniors are paid a percentage of it by age; award-free casuals add the {pct(CASUAL_LOADING)} loading.
            </p>
            <DataTable
              head={["Age", "Percentage of adult rate", "Hourly", "Casual hourly"]}
              align={["l", "r", "r", "r"]}
              rows={JUNIOR_RATES.map((r) => [r.age, `${(r.percentage * 100).toFixed(1)}%`, formatAUD(r.hourly, 2), formatAUD(r.casualHourly, 2)])}
              caption={<>Special national minimum wage 3 percentages applied to the weekly rate, then divided by {EMPLOYMENT.standardWeeklyHours}. Full guide: <Link href="/minimum-wage-australia/">minimum wage Australia</Link> and <Link href="/junior-pay-rates/">junior pay rates</Link>.</>}
            />
          </section>

          <section>
            <H2 id="loading-and-penalties">Casual Loading and Penalty Rates PACT Adds on Top</H2>
            <p>
              PACT adds two things to the base rate. The casual loading of {pct(CASUAL_LOADING)} applies to every casual hour. Penalty rates then apply to particular days and times, and each award tabulates them. The {FAST_FOOD_AWARD.meta.shortName} ({FAST_FOOD_AWARD.meta.code}) table below is typical: the casual column is the full-time percentage plus the loading.
            </p>
            <DataTable
              head={["When worked", "Full-time and part-time", "Casual"]}
              align={["l", "r", "r"]}
              rows={FAST_FOOD_AWARD.penalties.map((p) => [p.label, pct(p.fullTime), pct(p.casual)])}
              caption={<>{FAST_FOOD_AWARD.meta.shortName} {FAST_FOOD_AWARD.penaltiesClause}. Other awards: <Link href="/overtime-penalty-rates-guide/">penalty rates by award</Link>.</>}
            />
            <p>A worked week for a {FAST_FOOD_AWARD.meta.shortName} Level 1 casual on the {formatAUD(FF_L1.hourly, 2)} base rate:</p>
            <DataTable
              head={["Day", "Hours", "Rate", "Hourly", "Gross"]}
              align={["l", "r", "l", "r", "r"]}
              rows={[
                ...WEEK.map((d) => [d.day, d.hours, d.label, formatAUD(d.rate, 2), formatAUD(d.gross, 2)]),
                [<strong key="t">Week</strong>, <strong key="h">{WEEK_HOURS}</strong>, "", "", <strong key="g">{formatAUD(WEEK_GROSS, 2)}</strong>],
              ]}
              caption="Gross before tax. Overtime, allowances and public holidays are not in this example."
            />
          </section>

          <section>
            <H2 id="check-your-rate">Check Your Payslip Rate Against the Award</H2>
            <p>
              Pick your award and classification, enter the base hourly rate from your payslip or agreement, and the checker shows the gap to the award floor. The award rates are the same constants as the tables above.
            </p>
          </section>
          <div className="not-prose my-10"><EaAwardFloorChecker /></div>
          <p>
            If your rate is below the award, the <Link href="/backpay-calculator/">backpay calculator</Link> works out what is owed over the period; underpayments can be recovered for up to six years.
          </p>

          <section>
            <H2 id="take-home">From Award Gross to Take-Home Pay</H2>
            <p>
              PACT stops at gross pay. A {RETAIL_AWARD.name} level 1 full-timer on {formatAUD(R1.hourly, 2)} an hour earns {formatAUD(R1_ANNUAL)} a year at {EMPLOYMENT.standardWeeklyHours} hours a week; on the {SITE_CONFIG.financialYear} resident rates that is {formatAUD(Math.round(R1_PAY.weekly))} a week after income tax and the Medicare levy, with {formatAUD(Math.round(R1_PAY.superContribution))} a year of super paid on top by the employer. Enter your own award rate and hours in the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>, or read the figure off the <Link href="/tax-on/">tax on every salary</Link> tables.
            </p>
          </section>

          <FaqSection faqs={FAIR_WORK_PAY_CALCULATOR_FAQS} label="Fair Work pay calculator" />

          <PageFooter
            slug="fair-work-pay-calculator"
            lastVerified={VERIFIED}
            sources={SOURCES_LIST}
            methodology={<>
              <p>The description of PACT follows the Fair Work Ombudsman&rsquo;s tool as published. Every rate on this page is rendered at build time from the site&rsquo;s award constants, which are transcribed from the FWO pay guides and consolidated award texts for the first full pay period on or after {NMW_DECISION.operativeFrom} and tested against them. Take-home figures use the {SITE_CONFIG.financialYear} resident tax rates with the Medicare levy and no study loan.</p>
              <p>General information, not legal advice. For a ruling on your own pay, use PACT or contact the Fair Work Ombudsman on 13 13 94.</p>
            </>}
          />
        </article>

        <RelatedSidebar
          links={[
            { href: "/award-rates/", label: "Award rates A–Z" },
            { href: "/minimum-wage-australia/", label: "Minimum wage Australia" },
            { href: "/junior-pay-rates/", label: "Junior pay rates" },
            { href: "/overtime-penalty-rates-guide/", label: "Penalty rates by award" },
            { href: "/enterprise-agreement/", label: "Enterprise agreements" },
            { href: "/backpay-calculator/", label: "Backpay calculator" },
            { href: "/take-home-pay-calculator/", label: "Take-home pay calculator" },
          ]}
        />
      </div>
    </div></div>
  );
}
