import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { calculatePayBreakdown, formatAUD } from "@/lib/constants";
import {
  APPRENTICE_PAY_VERIFIED_ON,
  APPRENTICE_RATES_FROM,
  APPRENTICE_TRADES,
  STAGE_LABELS,
  STANDARD_WEEKLY_RATE,
  apprenticeRate,
  getTrade,
  type ApprenticeStage,
  type ApprenticeTrade,
} from "@/lib/data/apprentice-pay";
import { APPRENTICE_SPOKES } from "@/lib/data/apprentice-pay/spokes";
import ApprenticePayCalculator from "@/modules/calculator/apprentice-pay-calculator";
import { APPRENTICE_PAY_FAQS } from "./apprentice-pay-rates-faqs";
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

// /apprentice-pay-rates/ (Oct 2026 trending set, item 6). Merges the "apprentice
// pay rates", "apprentice wages" and "apprentice wages calculator" queries,
// which share one SERP. Every rate: lib/data/apprentice-pay (awards, read
// 5 October 2026). Trades whose award was not verified are listed as omitted.

const STAGES = [1, 2, 3, 4] as const satisfies readonly ApprenticeStage[];

const SOURCES_LIST: SourceLink[] = [
  ...Array.from(new Map(APPRENTICE_TRADES.map((t) => [t.award.code, t])).values()).map((t) => ({
    title: `${t.award.name} [${t.award.code}]: apprentice rates`,
    url: t.award.url,
    publisher: "Fair Work Commission",
  })),
  { title: "Pay guides for modern awards", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides", publisher: "Fair Work Ombudsman" },
  { title: "Annual Wage Review 2025-26 decision [2026] FWCFB 3500", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: "Fair Work Commission" },
];

const f2 = (n: number) => formatAUD(n, 2);

function tradeTable(t: ApprenticeTrade) {
  const split = t.junior.some((r) => r.year12 !== "either");
  if (!split) {
    return (
      <DataTable
        head={["Year", "Hourly minimum", "Weekly minimum (38 hrs)"]}
        align={["l", "r", "r"]}
        rows={STAGES.map((s) => {
          const r = apprenticeRate(t, "junior", s, "completed")!;
          return [STAGE_LABELS[s], f2(r.hourly), f2(r.weekly)];
        })}
        caption={<>{t.award.name} [{t.award.code}], {t.award.clause}. {t.rateIncludes}</>}
      />
    );
  }
  return (
    <DataTable
      head={["Year", "Year 12: hourly", "Year 12: weekly", "No Year 12: hourly", "No Year 12: weekly"]}
      align={["l", "r", "r", "r", "r"]}
      rows={STAGES.map((s) => {
        const y = apprenticeRate(t, "junior", s, "completed")!;
        const n = apprenticeRate(t, "junior", s, "not-completed")!;
        return [STAGE_LABELS[s], f2(y.hourly), f2(y.weekly), f2(n.hourly), f2(n.weekly)];
      })}
      caption={<>{t.award.name} [{t.award.code}], {t.award.clause}. {t.rateIncludes}</>}
    />
  );
}

function adultTable(t: ApprenticeTrade) {
  if (!t.adult) return null;
  return (
    <DataTable
      head={["Adult apprentice", "Hourly minimum", "Weekly minimum (38 hrs)"]}
      align={["l", "r", "r"]}
      rows={STAGES.map((s) => {
        const r = apprenticeRate(t, "adult", s, "completed")!;
        return [STAGE_LABELS[s], f2(r.hourly), f2(r.weekly)];
      })}
    />
  );
}

const building = getTrade("building")!;
const b1 = apprenticeRate(building, "junior", 1, "completed")!;
const exTake = calculatePayBreakdown({ grossSalary: Math.round(b1.hourly * 38 * 52), hasPrivateHealth: true });
const FIRST_YEAR = APPRENTICE_TRADES.map((t) => ({
  t,
  y: apprenticeRate(t, "junior", 1, "completed")!,
  n: apprenticeRate(t, "junior", 1, "not-completed")!,
}));

export default function ApprenticePayRatesPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/award-rates/", label: "Award Rates" }, { label: "Apprentice Pay Rates" }]} />

      <PageHeader title="Apprentice Pay Rates in Australia, by Trade and Year (2026-27)">
        <p>
          <strong>An apprentice&rsquo;s minimum wage is a percentage of the qualified tradesperson&rsquo;s rate that rises each year of the apprenticeship.</strong> From {APPRENTICE_RATES_FROM}, a first-year carpentry apprentice who completed Year 12 must be paid at least {f2(b1.hourly)} an hour before allowances, and the first-year minimums on this page run from {f2(Math.min(...FIRST_YEAR.flatMap((x) => [x.y.hourly, x.n.hourly])))} to {f2(Math.max(...FIRST_YEAR.flatMap((x) => [x.y.hourly, x.n.hourly])))} an hour. Pick your trade and year in the wages calculator to check your payslip.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "1st year, Year 12", v: "55%", s: "Of the tradesperson rate (most trades)" },
          { k: "4th year", v: "82% to 95%", s: "Depends on the award" },
          { k: "Standard rate", v: f2(STANDARD_WEEKLY_RATE), s: "A week, the base for most percentages" },
          { k: "Rates from", v: "1 July 2026", s: "First full pay period on or after" },
        ]}
      />

      <div className="mb-12"><ApprenticePayCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how-it-works">How Apprentice Wages Are Set</H2>
            <p>
              Apprentices are not paid the adult minimum wage. Each modern award sets an apprentice wage as a percentage of its tradesperson rate, usually $1,119.10 a week (for 2026-27), and the percentage steps up each year. A first-year apprentice is typically on 50% (55% if they finished Year 12), and by fourth year it is 82% to 95%, depending on the trade. Because the National Minimum Wage order does not bind apprentice rates under a training contract, a first-year apprentice can lawfully earn less than $26.44 an hour. Many employers pay more, and enterprise agreements often do.
            </p>
            <p>
              Three details change the number on a payslip. <strong>Year 12</strong> matters in most trades: finishing it lifts the first two years by five percentage points. <strong>Allowances</strong> matter too: electrical and plumbing apprentice rates already include them, but in building and construction, automotive, hairdressing and cookery the tables show the wage only, with tool and industry allowances added on top. And <strong>stage progression</strong> can be by calendar year or, where the award allows, by completing training competencies earlier.
            </p>
          </section>

          <section>
            <H2 id="first-year">First-Year Apprentice Pay by Trade</H2>
            <DataTable
              head={["Trade", "Year 12: hourly", "No Year 12: hourly", "Allowances"]}
              align={["l", "r", "r", "l"]}
              rows={FIRST_YEAR.map(({ t, y, n }) => [
                t.name,
                f2(y.hourly),
                y.hourly === n.hourly ? "Same" : f2(n.hourly),
                t.includesAllowances ? "Included" : "Extra",
              ])}
              caption={<>Award minimums in force from {APPRENTICE_RATES_FROM}, read from the Fair Work Commission&rsquo;s consolidated awards on {APPRENTICE_PAY_VERIFIED_ON}. &ldquo;Included&rdquo; means the hourly rate already contains the all-purpose allowances; &ldquo;Extra&rdquo; means they are payable on top. Do not compare the two groups like for like.</>}
            />
          </section>

          {APPRENTICE_TRADES.map((t) => (
            <section key={t.slug}>
              <H2 id={t.slug}>{t.name} Apprentice Pay Rates</H2>
              <p>{t.coverage}</p>
              {tradeTable(t)}
              {adultTable(t) && <p><strong>Adult apprentices</strong> (started over 21):</p>}
              {adultTable(t)}
              <ul>
                {t.notes.map((n) => <li key={n}>{n}</li>)}
                {APPRENTICE_SPOKES.filter((sp) => sp.tradeSlug === t.slug).map((sp) => (
                  <li key={sp.slug}>Year-by-year detail, allowances and take-home: <Link href={`/apprentice-pay/${sp.slug}/`}>{sp.h1}</Link>.</li>
                ))}
                {t.tradePageHref && <li>Fuller detail for qualified workers: <Link href={t.tradePageHref}>{t.name.split(" (")[0]} pay rates</Link>.</li>}
              </ul>
            </section>
          ))}

          <section>
            <H2 id="take-home">What an Apprentice Takes Home</H2>
            <p>
              Apprentices pay the same income tax as everyone else, and with a first-year income the tax is small. As an arithmetic illustration, a first-year carpentry apprentice who completed Year 12 and is paid exactly the award wage of {f2(b1.hourly)} an hour for 38 hours a week, all year, has about {formatAUD(Math.round(b1.hourly * 38 * 52), 0)} gross, and the 2026-27 resident rates (including the low income offset and the Medicare levy) leave roughly {formatAUD(exTake.weekly, 2)} a week after tax, before allowances or overtime. Use the calculator above for your own trade and year, the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> for any wage, and <Link href="/weekly-pay-calculator/">weekly pay calculator</Link> to convert between pay periods.
            </p>
          </section>

          <section>
            <H2 id="progression">When an Apprentice&rsquo;s Pay Goes Up</H2>
            <ul>
              <li><strong>Each stage.</strong> The wage steps up at the start of each year, or earlier when competency-based progression applies and the apprentice completes enough of the training plan (for example, 25% of competencies for stage 2 in the building award).</li>
              <li><strong>Each 1 July.</strong> Every award minimum rises with the Annual Wage Review decision, from the first full pay period starting on or after 1 July.</li>
              <li><strong>Overtime and penalties.</strong> Awards pay these as a percentage of the apprentice&rsquo;s hourly rate. In the Electrical award, for instance, overtime is 150% for the first two hours and 200% after, Sunday 200% and public holidays 250%. An apprentice under 18 cannot be required to work overtime or shiftwork.</li>
              <li><strong>Training time.</strong> Time at training required by the training contract counts as time worked and is paid in the awards read for this page.</li>
            </ul>
          </section>

          <section>
            <H2 id="check-payslip">How to Check Your Apprentice Wage</H2>
            <ol>
              <li>Find your award: look at your training contract, employer, or the pay guide at fairwork.gov.au. The trade is not always the deciding factor, and an enterprise agreement can replace the award.</li>
              <li>Work out your year of apprenticeship and whether you completed Year 12.</li>
              <li>Read the minimum for that year and add any allowances your trade&rsquo;s award requires.</li>
              <li>Compare it with the hourly rate on your <Link href="/understanding-your-payslip/">payslip</Link>. If it is lower, ask your employer to explain, then contact the Fair Work Ombudsman on 13 13 94.</li>
            </ol>
            <p>
              Not all apprenticeships are on this page. Awards for other trades were not checked, and pre-2014 apprentices, school-based apprentices and trainees have separate schedules. See <Link href="/award-rates/">award pay rates</Link>, <Link href="/junior-pay-rates/">junior pay rates</Link> for the age-based rates that apply to workers who aren&rsquo;t apprentices, and <Link href="/first-job-pay-guide/">first job pay guide</Link>.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/job-pay-rates/apprentice-electrician/">Apprentice Electrician Pay Rates</Link>: full detail, adult and penalty rates</li>
              <li><Link href="/construction-trades-pay/">Construction &amp; Trades Pay Guide</Link></li>
              <li><Link href="/award-rates/">Award Pay Rates</Link></li>
              <li><Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link></li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link></li>
              <li><Link href="/fair-work-pay-calculator/">Fair Work Pay Calculator</Link></li>
            </ul>
          </section>

          <FaqSection faqs={APPRENTICE_PAY_FAQS} label="Apprentice pay" />

          <PageFooter
            slug="apprentice-pay-rates"
            lastVerified={APPRENTICE_PAY_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Every rate is the minimum printed in the award&rsquo;s apprentice clause or schedule, or the award&rsquo;s percentage applied to its reference rate ({f2(STANDARD_WEEKLY_RATE)} a week) and rounded to the cent; hourly is the award&rsquo;s published figure or weekly divided by 38. The calculator multiplies the hourly minimum by your hours, then by 52 for a full year, and takes tax from the site&rsquo;s 2026-27 resident rates with the low income offset and the Medicare levy (private hospital cover, no HELP debt).</p>
              <p>Scope: apprentices who started on or after 1 January 2014 on a 4-year term, junior rates for every trade shown and adult rates for Electrical, Automotive, Manufacturing and Meat. Junior rates for the Manufacturing (boilermaker) and Meat Industry (butcher) awards were added on 5 October 2026 and read from the awards. Not shown because they were not checked or depend on individual circumstances: other trades&rsquo; awards, 3-year terms, pre-2014 apprentices, school-based apprentices, trainees, Plumbing, Building, Hair and Beauty and Hospitality adult rules, and enterprise agreements. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/job-pay-rates/apprentice-electrician/", label: "Apprentice Electrician Pay" },
          { href: "/construction-trades-pay/", label: "Construction & Trades Pay" },
          { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
          { href: "/award-rates/", label: "Award Pay Rates" },
          { href: "/first-job-pay-guide/", label: "First Job Pay Guide" },
        ]} />
      </div>
    </div></div>
  );
}
