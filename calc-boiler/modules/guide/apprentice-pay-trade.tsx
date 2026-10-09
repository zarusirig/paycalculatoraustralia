import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD } from "@/lib/constants";
import { fitDescription, fitTitle } from "@/lib/seo-title";
import {
  APPRENTICE_RATES_FROM,
  STAGE_LABELS,
  STANDARD_WEEKLY_RATE,
  getTrade,
} from "@/lib/data/apprentice-pay";
import {
  ADULT_NOTES,
  APPRENTICE_SPOKES,
  INDUSTRY_ALLOWANCE,
  SPOKES_VERIFIED_ON,
  STAGES,
  allowanceRows,
  headlineRate,
  payGuideUrl,
  penaltyAt,
  spokeAdultRate,
  spokeRate,
  type ApprenticeSpoke,
  type BuildingPayGuide,
  type PenaltyTable,
} from "@/lib/data/apprentice-pay/spokes";
import ApprenticePayCalculator from "@/modules/calculator/apprentice-pay-calculator";
import { spokeFaqs, stageTakeHome } from "./apprentice-pay-trade-faqs";
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

// /apprentice-pay/{trade}/ (Oct 2026 keyword-gap family F3). One trade deep:
// year by year, junior vs adult start, the allowances the award adds, penalty
// rates where the award prints them, the qualification behind the stages, and
// take-home. Building trades lead with the Fair Work Ombudsman pay guide's
// all-in rates for their own tool-allowance group (fixed 9 Oct 2026: the three
// building pages used to open on the same bare percentage table). The
// all-trades comparison lives on the hub, /apprentice-pay-rates/.

const f2 = (n: number) => formatAUD(n, 2);
const lc = (s: string) => s.toLowerCase();

export function spokeTitle(spoke: ApprenticeSpoke) {
  return fitTitle(`${spoke.h1} 2026-27: Year 1 to 4 Rates and Take-Home`, `${spoke.h1} 2026-27: Year 1 to 4 Rates`, `${spoke.h1} 2026-27: Rates by Year`);
}

export function spokeDescription(spoke: ApprenticeSpoke) {
  const y1 = headlineRate(spoke, 1, "completed");
  const y4 = headlineRate(spoke, 4, "completed");
  const who = lc(spoke.label);
  if (spoke.payGuide) {
    return fitDescription(
      `Apprentice ${who} minimums from 1 July 2026 with the $${spoke.payGuide.toolAllowance.toFixed(2)} tool and industry allowances: ${f2(y1.hourly)} an hour in year 1 to ${f2(y4.hourly)} in year 4, plus take-home pay.`,
      `Apprentice ${who} minimums from 1 July 2026 with tool and industry allowances: ${f2(y1.hourly)} an hour in year 1 to ${f2(y4.hourly)} in year 4.`,
    );
  }
  return fitDescription(
    `Apprentice ${who} award minimums from 1 July 2026: ${f2(y1.hourly)} an hour in year 1 to ${f2(y4.hourly)} in year 4, with allowances, adult start and take-home pay.`,
    `Apprentice ${who} award minimums from 1 July 2026: ${f2(y1.hourly)} an hour in year 1 to ${f2(y4.hourly)} in year 4, and take-home pay.`,
  );
}

/** FWO pay guide all-in table for one site type (building trades). */
function PayGuideTable({ spoke, pg, site }: { spoke: ApprenticeSpoke; pg: BuildingPayGuide; site: "general" | "residential" }) {
  const industry = INDUSTRY_ALLOWANCE[site];
  return (
    <DataTable
      head={["Year", "No Year 12: hourly", "No Year 12: weekly", "Year 12: hourly", "Year 12: weekly"]}
      align={["l", "r", "r", "r", "r"]}
      rows={STAGES.map((s) => {
        const n = headlineRate(spoke, s, "not-completed", site);
        const y = headlineRate(spoke, s, "completed", site);
        return [STAGE_LABELS[s], f2(n.hourly), f2(n.weekly), f2(y.hourly), f2(y.weekly)];
      })}
      caption={
        <>
          Fair Work Ombudsman pay guide, Building and Construction General On-site Award [MA000020], &ldquo;{pg.group}&rdquo;, {site === "general" ? "general building and construction, not residential work" : "residential work"}. Includes the {f2(pg.toolAllowance)} tool allowance and the {f2(industry)} industry allowance. 4-year apprentice who started on or after 1 January 2014, 38-hour week, from {APPRENTICE_RATES_FROM}.
        </>
      }
    />
  );
}

function PenaltySection({ spoke, penalty }: { spoke: ApprenticeSpoke; penalty: PenaltyTable }) {
  return (
    <section>
      <H2 id="penalty-rates">{penalty.heading}</H2>
      <p>{penalty.intro}</p>
      <DataTable
        head={["Year", "Ordinary", ...penalty.columns.map((c) => c.label)]}
        align={["l", "r", ...penalty.columns.map(() => "r" as const)]}
        rows={STAGES.map((s) => {
          const r = spokeRate(spoke, s, "completed");
          return [STAGE_LABELS[s], f2(r.hourly), ...penalty.columns.map((c) => f2(penaltyAt(r.hourly, c.pct)))];
        })}
        caption={penalty.caption}
      />
    </section>
  );
}

export default function ApprenticePayTradePage({ spoke }: { spoke: ApprenticeSpoke }) {
  const trade = getTrade(spoke.tradeSlug)!;
  const split = trade.junior.some((r) => r.year12 !== "either");
  const adultAvailable = trade.adult !== null;
  const label = lc(spoke.label);
  const faqs = spokeFaqs(spoke);
  const pg = spoke.payGuide;
  const q = spoke.qualification;

  const y1y = headlineRate(spoke, 1, "completed");
  const y1n = headlineRate(spoke, 1, "not-completed");
  const y4y = headlineRate(spoke, 4, "completed");
  const th1 = stageTakeHome(spoke, 1, "completed");
  const th4 = stageTakeHome(spoke, 4, "completed");

  const siblings = APPRENTICE_SPOKES.filter((s) => s.slug !== spoke.slug);
  const shared = (spoke.sharesTableWith ?? []).map((s) => APPRENTICE_SPOKES.find((x) => x.slug === s)!);

  const sources: SourceLink[] = [
    { title: `${trade.award.name} [${trade.award.code}], ${trade.award.clause}`, url: trade.award.url, publisher: "Fair Work Commission" },
    { title: `Pay guide: ${trade.award.name} [${trade.award.code}]`, url: payGuideUrl(trade.award.code), publisher: "Fair Work Ombudsman" },
    { title: `${q.code} ${q.title}`, url: q.url, publisher: "training.gov.au" },
    { title: "Annual Wage Review 2025-26 decision [2026] FWCFB 3500", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: "Fair Work Commission" },
    { title: "Tax rates for resident individuals 2026-27", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "Australian Taxation Office" },
  ];

  // Award wage only: the main table for every trade except building, where it becomes the "how it is built" table.
  const wageTable = split ? (
    <DataTable
      head={["Year", "No Year 12: hourly", "No Year 12: weekly", "Year 12: hourly", "Year 12: weekly"]}
      align={["l", "r", "r", "r", "r"]}
      rows={STAGES.map((s) => {
        const n = spokeRate(spoke, s, "not-completed");
        const y = spokeRate(spoke, s, "completed");
        return [STAGE_LABELS[s], f2(n.hourly), f2(n.weekly), f2(y.hourly), f2(y.weekly)];
      })}
      caption={<>{trade.award.name} [{trade.award.code}], {trade.award.clause}. Junior apprentice who started on or after 1 January 2014, 38-hour week, in force from {APPRENTICE_RATES_FROM}.{pg ? " Wage only, before the tool and industry allowances." : ""}</>}
    />
  ) : (
    <DataTable
      head={["Year", "Hourly minimum", "Weekly minimum (38 hrs)", "Percent of standard rate"]}
      align={["l", "r", "r", "r"]}
      rows={STAGES.map((s) => {
        const r = spokeRate(spoke, s, "completed");
        return [STAGE_LABELS[s], f2(r.hourly), f2(r.weekly), r.pct ? `${r.pct}%` : "n/a"];
      })}
      caption={<>{trade.award.name} [{trade.award.code}], {trade.award.clause}. In force from {APPRENTICE_RATES_FROM}.</>}
    />
  );

  const takeHomeCaption = pg
    ? "General building site minimum including the tool and industry allowances, 38 hours a week for 52 weeks, resident taxpayer, 2026-27 rates with the low income offset and Medicare levy, private hospital cover, no HELP debt. Overtime and other allowances are not included."
    : "Award wage only, 38 hours a week for 52 weeks, resident taxpayer, 2026-27 rates with the low income offset and Medicare levy, private hospital cover, no HELP debt. Allowances and overtime are not included.";
  const takeHomeTable = split ? (
    <DataTable
      head={["Year", "Yearly gross (Year 12)", "Weekly take-home (Year 12)", "Yearly gross (no Year 12)", "Weekly take-home (no Year 12)"]}
      align={["l", "r", "r", "r", "r"]}
      rows={STAGES.map((s) => {
        const y = stageTakeHome(spoke, s, "completed");
        const n = stageTakeHome(spoke, s, "not-completed");
        return [STAGE_LABELS[s], formatAUD(y.annual, 0), f2(y.weekly), formatAUD(n.annual, 0), f2(n.weekly)];
      })}
      caption={takeHomeCaption}
    />
  ) : (
    <DataTable
      head={["Year", "Yearly gross", "Weekly take-home"]}
      align={["l", "r", "r"]}
      rows={STAGES.map((s) => {
        const y = stageTakeHome(spoke, s, "completed");
        return [STAGE_LABELS[s], formatAUD(y.annual, 0), f2(y.weekly)];
      })}
      caption={takeHomeCaption}
    />
  );

  const headline = pg ? (
    <>
      An apprentice {label} on a general building, civil or engineering construction site must be paid at least {f2(y1n.hourly)} an hour in first year ({f2(y1y.hourly)} with Year 12), rising to {f2(y4y.hourly)} in fourth year; on residential building work the minimums are {f2(headlineRate(spoke, 1, "not-completed", "residential").hourly)} ({f2(headlineRate(spoke, 1, "completed", "residential").hourly)} with Year 12) rising to {f2(headlineRate(spoke, 4, "completed", "residential").hourly)}.
    </>
  ) : split ? (
    <>An apprentice {label} must be paid at least {f2(y1n.hourly)} an hour in first year ({f2(y1y.hourly)} with Year 12), rising to {f2(y4y.hourly)} in fourth year.</>
  ) : (
    <>An apprentice {label} must be paid at least {f2(y1y.hourly)} an hour in first year, rising to {f2(y4y.hourly)} in fourth year.</>
  );

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/apprentice-pay-rates/", label: "Apprentice Pay Rates" }, { label: `Apprentice ${spoke.label}` }]} />

      <PageHeader title={`${spoke.h1} in Australia: Year 1 to 4 (2026-27)`}>
        <p>
          <strong>{headline}</strong>{" "}
          {pg
            ? <>Those are the Fair Work Ombudsman pay guide minimums for the {pg.groupShort} group under the {trade.award.name} from {APPRENTICE_RATES_FROM}, for a 38-hour week.</>
            : <>That is the {trade.award.name} minimum from {APPRENTICE_RATES_FROM}, for a 38-hour week.</>}
        </p>
        <p>{spoke.lead}</p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Year 1 minimum", v: `${f2(y1y.hourly)}/hr`, s: pg ? `With Year 12, general site; ${f2(y1n.hourly)} without` : split ? `${f2(y1n.hourly)} without Year 12` : "No Year 12 split in this award" },
          { k: "Year 4 minimum", v: `${f2(y4y.hourly)}/hr`, s: `${f2(y4y.weekly)} a week` },
          pg
            ? { k: "Tool allowance", v: `${f2(pg.toolAllowance)}/wk`, s: "cl 21.1(a), paid in full to apprentices" }
            : { k: "Take-home, year 1", v: `${f2(th1.weekly)}/wk`, s: "Award wage only, after tax" },
          { k: "Qualification", v: q.code, s: q.title },
        ]}
      />

      <div className="mb-12">
        <ApprenticePayCalculator
          defaultTrade={spoke.tradeSlug}
          lockTrade
          heading={`Apprentice ${spoke.label} Wages Calculator`}
          siteAllowances={pg ? spoke.allowances.map((sc) => ({
            id: sc.id,
            label: sc.label,
            byStage: sc.lines.reduce<[number, number, number, number]>((acc, l) => [acc[0] + l.byStage[0], acc[1] + l.byStage[1], acc[2] + l.byStage[2], acc[3] + l.byStage[3]], [0, 0, 0, 0]),
            note: `The minimum includes the ${f2(pg.toolAllowance)} ${label} tool allowance and the ${f2(INDUSTRY_ALLOWANCE[sc.id === "residential" ? "residential" : "general"])} industry allowance, which the award pays apprentices for all purposes (cl 19.7(c)); hourly is the weekly total divided by 38.`,
          })) : undefined}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <FeaturedImage placement="content" className="mt-0" />
          <section>
            <H2 id="by-year">Apprentice {spoke.label} Pay by Year</H2>
            {pg ? (
              <>
                <p>
                  These are the minimums for an apprentice {label} on a standard four-year term, from {APPRENTICE_RATES_FROM}, as the Fair Work Ombudsman pay guide prints them for the {pg.groupShort} group. They include the tool and industry allowances, because the award makes both part of an apprentice&rsquo;s ordinary rate. Your rate may be higher under an enterprise agreement or if your employer pays above the award; it cannot lawfully be lower.
                </p>
                <h3 className="font-semibold text-navy mt-6">General building, civil or engineering construction site</h3>
                <PayGuideTable spoke={spoke} pg={pg} site="general" />
                <h3 className="font-semibold text-navy mt-6">Residential building (single or dual occupancy, not multistorey)</h3>
                <PayGuideTable spoke={spoke} pg={pg} site="residential" />
              </>
            ) : (
              <>
                <p>
                  These are the minimums the award sets for a junior apprentice on a standard four-year term, in dollars, from {APPRENTICE_RATES_FROM}. Your actual rate may be higher if you are on an enterprise agreement or your employer simply pays above the award; it cannot lawfully be lower.
                </p>
                {wageTable}
              </>
            )}
          </section>

          {pg ? (
            <section>
              <H2 id="allowances">How the {spoke.label} Rate Is Built</H2>
              <p>
                Clause 19.7(b) of the award sets the wage as a percentage of the {f2(STANDARD_WEEKLY_RATE)} standard rate, and clause 19.7(c) adds the clause 21.1 tool allowance and the clause 22 industry allowance as part of the ordinary weekly rate for all purposes. The wage part alone is:
              </p>
              {wageTable}
              {shared.length > 0 && (
                <p>
                  That wage table is the same for {shared.map((s, i) => (
                    <span key={s.slug}>{i > 0 ? " and " : ""}<Link href={`/apprentice-pay/${s.slug}/`}>{lc(s.label)}s</Link></span>
                  ))}, because the award has one percentage scale for its apprentices. What differs is the tool allowance: {f2(pg.toolAllowance)} a week for {lc(spoke.label)}s. Adding it and the industry allowance to the wage gives the pay guide figure in every row:
                </p>
              )}
              <DataTable
                head={["Year", "Wage (Year 12)", "Tool allowance", "Industry allowance (general)", "Total a week", "Hourly (total / 38)"]}
                align={["l", "r", "r", "r", "r", "r"]}
                rows={allowanceRows(spoke, spoke.allowances.find((a) => a.id === "general")!).map((r) => {
                  const wage = spokeRate(spoke, r.stage, "completed").weekly;
                  return [STAGE_LABELS[r.stage], f2(wage), f2(pg.toolAllowance), f2(INDUSTRY_ALLOWANCE.general), f2(r.year12Weekly), f2(r.year12Hourly)];
                })}
                caption={<>Our arithmetic on cl 19.7(b), 21.1(a) and 22.1(a); every total matches the Fair Work Ombudsman pay guide. On residential work the industry allowance is {f2(INDUSTRY_ALLOWANCE.residential)} (cl 22.1(b)).</>}
              />
            </section>
          ) : (
            <section>
              <H2 id="allowances">Allowances and What the Table Leaves Out</H2>
              {trade.includesAllowances ? (
                <p>
                  What the rate contains: {trade.rateIncludes} So unlike most trades you do not add the tool or industry allowance to the number in the table.
                </p>
              ) : spoke.allowances.length === 0 ? (
                <p>
                  The table shows the wage only. What the rate contains: {trade.rateIncludes} Allowances that the award adds on top are not in these figures.
                </p>
              ) : (
                <p>
                  The table shows the wage only. What the rate contains: {trade.rateIncludes}
                </p>
              )}
              {spoke.allowances.map((sc) => (
                <div key={sc.id}>
                  <h3 className="font-semibold text-navy mt-6">{sc.label}</h3>
                  <DataTable
                    head={[
                      "Year",
                      "Allowance a week",
                      ...(split ? ["Weekly with allowance (no Year 12)", "Weekly with allowance (Year 12)"] : ["Weekly with allowance"]),
                      ...(sc.allPurpose ? ["Hourly with allowance (Year 12)"] : []),
                    ]}
                    align={["l", "r", ...(split ? ["r", "r"] as const : ["r"] as const), ...(sc.allPurpose ? ["r"] as const : [])]}
                    rows={allowanceRows(spoke, sc).map((r) => [
                      STAGE_LABELS[r.stage],
                      f2(r.allowance),
                      ...(split ? [r.noYear12Weekly === null ? "n/a" : f2(r.noYear12Weekly), f2(r.year12Weekly)] : [f2(r.year12Weekly)]),
                      ...(sc.allPurpose ? [f2(r.year12Hourly)] : []),
                    ])}
                    caption={
                      <>
                        {sc.lines.map((l) => `${l.label} (${l.clause})`).join(" plus ")}.{sc.condition ? ` ${sc.condition}.` : ""}{sc.allPurpose ? " Paid for all purposes; hourly is the weekly total divided by 38." : " Not part of the hourly rate, so no hourly figure is shown."}
                      </>
                    }
                  />
                </div>
              ))}
            </section>
          )}

          <section>
            <H2 id="adult-vs-junior">Adult vs Junior Start</H2>
            {adultAvailable ? (
              <>
                <p>
                  The award treats an apprentice who starts at 21 or older as an adult apprentice, with its own rates.
                </p>
                <DataTable
                  head={["Adult apprentice", "Hourly minimum", "Weekly minimum (38 hrs)"]}
                  align={["l", "r", "r"]}
                  rows={STAGES.map((s) => {
                    const a = spokeAdultRate(spoke, s)!;
                    return [STAGE_LABELS[s], f2(a.hourly), f2(a.weekly)];
                  })}
                  caption={`${trade.award.name} [${trade.award.code}]. A person who was already employed by the same employer before the apprenticeship generally cannot be paid less than they were.`}
                />
                <p>
                  In first year the adult rate is {f2(spokeAdultRate(spoke, 1)!.hourly)} an hour, which is {f2(spokeAdultRate(spoke, 1)!.hourly - y1y.hourly)} more than a junior with Year 12 ({f2(y1y.hourly)}). {spokeAdultRate(spoke, 4)!.hourly - y4y.hourly > 0.005 ? `By fourth year the gap narrows to ${f2(spokeAdultRate(spoke, 4)!.hourly - y4y.hourly)} an hour.` : "By fourth year the adult and junior (Year 12) rates are the same."}
                </p>
              </>
            ) : (
              <p>{ADULT_NOTES[spoke.slug] ?? "Adult apprentice rates are not tabulated on this page. Check the award clause named in the pay table above."}</p>
            )}
          </section>

          {spoke.penalty && <PenaltySection spoke={spoke} penalty={spoke.penalty} />}

          <section>
            <H2 id="take-home">How Much Do Apprentice {spoke.label}s Earn After Tax?</H2>
            <p>
              On the {pg ? "general building site minimum, which includes the tool and industry allowances," : "award wage alone"} a first-year apprentice {label} on a full-time 38-hour week is paid about {formatAUD(th1.annual, 0)} a year (Year 12 completed) and takes home about {f2(th1.weekly)} a week. By fourth year the same hours give about {formatAUD(th4.annual, 0)} gross and {f2(th4.weekly)} a week after tax. Apprentices pay the same income tax as everyone else, but the low income offset and the tax-free threshold mean the tax in the early years is small.
            </p>
            {takeHomeTable}
            <p>
              To see your own figure, put your hourly rate and hours into the calculator above, or use the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to add overtime. Your hourly rate to a yearly salary is on the <Link href="/hourly-to-annual-salary-calculator/">hourly to annual salary calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="specifics">What Is Specific to {spoke.label} Apprentices</H2>
            {spoke.facts.map((f) => <p key={f}>{f}</p>)}
            <p>
              Qualification: <a href={q.url} rel="noopener">{q.code} {q.title}</a>. {q.detail}
            </p>
            {spoke.job && (
              <p>
                Once qualified, see <Link href={spoke.job.href}>{lc(spoke.job.label)}</Link>. Other award detail: {spoke.extraLinks.map((l, i) => (
                  <span key={l.href}>{i > 0 ? ", " : ""}<Link href={l.href}>{l.label}</Link></span>
                ))}.
              </p>
            )}
          </section>

          <section>
            <H2 id="check-payslip">Check Your Payslip</H2>
            <ol>
              <li>Find your year of apprenticeship{split ? " and whether you completed Year 12" : ""} and read the matching hourly figure in the first table{pg ? " for your type of site" : ""}.</li>
              <li>{pg ? "Your payslip may show the wage and the tool and industry allowances as separate lines; add them before comparing with the table." : "Add any allowance that applies to you from the allowances section, and compare the total with the hourly rate on your payslip."} The <Link href="/understanding-your-payslip/">payslip guide</Link> explains each line.</li>
              <li>If you are paid less, ask your employer to explain which award or agreement they use, then contact the Fair Work Ombudsman on 13 13 94. The <Link href="/backpay-calculator/">backpay calculator</Link> shows what a shortfall adds up to.</li>
            </ol>
            <p>
              Pre-2014 apprentices, three-year terms, school-based apprentices and trainees are paid under other schedules and are not covered here. Rates change each 1 July, so check the date on this page.
            </p>
          </section>

          <section>
            <H2 id="other-trades">Other Apprentice Pay Guides</H2>
            <ul>
              <li><Link href="/apprentice-pay-rates/">Apprentice Pay Rates by Trade</Link>: every trade side by side</li>
              <li><Link href="/job-pay-rates/apprentice-electrician/">Apprentice Electrician Pay</Link>: adult, junior and penalty rates</li>
              {siblings.map((s) => (
                <li key={s.slug}><Link href={`/apprentice-pay/${s.slug}/`}>{s.h1}</Link></li>
              ))}
              <li><Link href="/junior-pay-rates/">Junior Pay Rates</Link> for non-apprentices</li>
            </ul>
          </section>

          <FaqSection faqs={faqs} label={`Apprentice ${label} pay`} />

          <PageFooter
            slug={`apprentice-pay/${spoke.slug}`}
            lastVerified={SPOKES_VERIFIED_ON}
            sources={sources}
            methodology={<>
              {pg ? (
                <p>The pay tables are the Fair Work Ombudsman pay guide for the Building and Construction General On-site Award, published 2 July 2026, for the {pg.groupShort} group. We checked every row against the award: the clause 19.7(b) percentage of the {f2(STANDARD_WEEKLY_RATE)} standard rate, plus the {f2(pg.toolAllowance)} clause 21.1(a) tool allowance, plus the clause 22.1 industry allowance, gives the pay guide&rsquo;s weekly figure to the cent, and the hourly figure is that total divided by 38 and rounded to the cent. The bare wage table is the award&rsquo;s percentage applied to the standard rate.</p>
              ) : (
                <p>Every rate is the minimum printed in the award&rsquo;s apprentice clause or schedule, or the award&rsquo;s percentage applied to its reference rate ({f2(STANDARD_WEEKLY_RATE)} a week) and rounded to the cent, and each was checked against the Fair Work Ombudsman pay guide. Hourly is the award&rsquo;s published figure or weekly divided by 38. Allowances are the amounts in the award&rsquo;s allowance clauses in force from 1 July 2026. {spoke.penalty ? "Penalty rates are the hourly rate times the award percentage, rounded to the cent, and match the pay guide." : ""}</p>
              )}
              <p>Take-home is the site&rsquo;s 2026-27 resident calculation for 38 hours, 52 weeks, with the low income offset and the Medicare levy (private hospital cover, no HELP debt). The qualification details are from training.gov.au, checked {SPOKES_VERIFIED_ON}.</p>
              <p>Scope: a junior apprentice on a four-year term who started on or after 1 January 2014{adultAvailable ? ", plus the adult rates the award prints" : ""}. Pre-2014 apprentices, three-year terms, school-based apprentices, trainees, enterprise agreements and state licensing rules are not modelled. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/apprentice-pay-rates/", label: "Apprentice Pay Rates by Trade" },
          ...(spoke.job ? [{ href: spoke.job.href, label: spoke.job.label }] : []),
          ...spoke.extraLinks.map((l) => ({ href: l.href, label: l.label })),
          { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
          { href: "/award-rates/", label: "Award Pay Rates" },
        ]} />
      </div>
    </div></div>
  );
}
