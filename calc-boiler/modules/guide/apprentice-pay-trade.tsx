import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD } from "@/lib/constants";
import { fitDescription, fitTitle } from "@/lib/seo-title";
import {
  APPRENTICE_PAY_VERIFIED_ON,
  APPRENTICE_RATES_FROM,
  STAGE_LABELS,
  STANDARD_WEEKLY_RATE,
  getTrade,
} from "@/lib/data/apprentice-pay";
import {
  ADULT_NOTES,
  APPRENTICE_SPOKES,
  STAGES,
  allowanceRows,
  penaltyHourly,
  spokeAdultRate,
  spokeRate,
  type ApprenticeSpoke,
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

// /apprentice-pay/{trade}/ (Oct 2026 keyword-gap family F3). One trade deep:
// year by year, junior vs adult start, the allowances the award adds, penalty
// rates where the award prints them, and take-home. The all-trades comparison
// and the generic "how apprentice wages work" explainer live on the hub,
// /apprentice-pay-rates/, and are not repeated here.

const f2 = (n: number) => formatAUD(n, 2);
const lc = (s: string) => s.toLowerCase();

export function spokeTitle(spoke: ApprenticeSpoke) {
  return fitTitle(`${spoke.h1} 2026-27: Year 1 to 4 Rates and Take-Home`, `${spoke.h1} 2026-27: Year 1 to 4 Rates`, `${spoke.h1} 2026-27: Rates by Year`);
}

export function spokeDescription(spoke: ApprenticeSpoke) {
  const y1 = spokeRate(spoke, 1, "completed");
  const y4 = spokeRate(spoke, 4, "completed");
  return fitDescription(
    `Apprentice ${lc(spoke.label)} award minimums from 1 July 2026: ${f2(y1.hourly)} an hour in year 1 to ${f2(y4.hourly)} in year 4, with allowances, adult start and take-home pay.`,
    `Apprentice ${lc(spoke.label)} award minimums from 1 July 2026: ${f2(y1.hourly)} an hour in year 1 to ${f2(y4.hourly)} in year 4, and take-home pay.`,
  );
}

export default function ApprenticePayTradePage({ spoke }: { spoke: ApprenticeSpoke }) {
  const trade = getTrade(spoke.tradeSlug)!;
  const split = trade.junior.some((r) => r.year12 !== "either");
  const adultAvailable = trade.adult !== null;
  const label = lc(spoke.label);
  const faqs = spokeFaqs(spoke);

  const y1y = spokeRate(spoke, 1, "completed");
  const y1n = spokeRate(spoke, 1, "not-completed");
  const y4y = spokeRate(spoke, 4, "completed");
  const th1 = stageTakeHome(spoke, 1, "completed");
  const th4 = stageTakeHome(spoke, 4, "completed");

  const siblings = APPRENTICE_SPOKES.filter((s) => s.slug !== spoke.slug);
  const shared = (spoke.sharesTableWith ?? []).map((s) => APPRENTICE_SPOKES.find((x) => x.slug === s)!);

  const sources: SourceLink[] = [
    { title: `${trade.award.name} [${trade.award.code}], ${trade.award.clause}`, url: trade.award.url, publisher: "Fair Work Commission" },
    { title: "Pay guides for modern awards", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides", publisher: "Fair Work Ombudsman" },
    { title: "Annual Wage Review 2025-26 decision [2026] FWCFB 3500", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: "Fair Work Commission" },
    { title: "Tax rates for resident individuals 2026-27", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "Australian Taxation Office" },
  ];

  const yearTable = split ? (
    <DataTable
      head={["Year", "No Year 12: hourly", "No Year 12: weekly", "Year 12: hourly", "Year 12: weekly"]}
      align={["l", "r", "r", "r", "r"]}
      rows={STAGES.map((s) => {
        const n = spokeRate(spoke, s, "not-completed");
        const y = spokeRate(spoke, s, "completed");
        return [STAGE_LABELS[s], f2(n.hourly), f2(n.weekly), f2(y.hourly), f2(y.weekly)];
      })}
      caption={<>{trade.award.name} [{trade.award.code}], {trade.award.clause}. Junior apprentice who started on or after 1 January 2014, 38-hour week, in force from {APPRENTICE_RATES_FROM}.</>}
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

  const takeHomeTable = split ? (
    <DataTable
      head={["Year", "Yearly gross (Year 12)", "Weekly take-home (Year 12)", "Yearly gross (no Year 12)", "Weekly take-home (no Year 12)"]}
      align={["l", "r", "r", "r", "r"]}
      rows={STAGES.map((s) => {
        const y = stageTakeHome(spoke, s, "completed");
        const n = stageTakeHome(spoke, s, "not-completed");
        return [STAGE_LABELS[s], formatAUD(y.annual, 0), f2(y.weekly), formatAUD(n.annual, 0), f2(n.weekly)];
      })}
      caption="Award wage only, 38 hours a week for 52 weeks, resident taxpayer, 2026-27 rates with the low income offset and Medicare levy, private hospital cover, no HELP debt. Allowances and overtime are not included."
    />
  ) : (
    <DataTable
      head={["Year", "Yearly gross", "Weekly take-home"]}
      align={["l", "r", "r"]}
      rows={STAGES.map((s) => {
        const y = stageTakeHome(spoke, s, "completed");
        return [STAGE_LABELS[s], formatAUD(y.annual, 0), f2(y.weekly)];
      })}
      caption="Award wage only, 38 hours a week for 52 weeks, resident taxpayer, 2026-27 rates with the low income offset and Medicare levy, private hospital cover, no HELP debt. Allowances and overtime are not included."
    />
  );

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/apprentice-pay-rates/", label: "Apprentice Pay Rates" }, { label: `Apprentice ${spoke.label}` }]} />

      <PageHeader title={`${spoke.h1} in Australia: Year 1 to 4 (2026-27)`}>
        <p>
          <strong>
            {split
              ? `An apprentice ${label} must be paid at least ${f2(y1n.hourly)} an hour in first year (${f2(y1y.hourly)} with Year 12), rising to ${f2(y4y.hourly)} in fourth year.`
              : `An apprentice ${label} must be paid at least ${f2(y1y.hourly)} an hour in first year, rising to ${f2(y4y.hourly)} in fourth year.`}
          </strong>{" "}
          That is the {trade.award.name} minimum from {APPRENTICE_RATES_FROM}, for a 38-hour week. On the award wage alone a first-year apprentice {label} takes home about {f2(th1.weekly)} a week after tax. This page is the {spoke.trade} view; for every trade side by side, see <Link href="/apprentice-pay-rates/">apprentice pay rates by trade</Link>.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Year 1 minimum", v: `${f2(y1y.hourly)}/hr`, s: split ? `${f2(y1n.hourly)} without Year 12` : "No Year 12 split in this award" },
          { k: "Year 4 minimum", v: `${f2(y4y.hourly)}/hr`, s: `${f2(y4y.weekly)} a week` },
          { k: "Take-home, year 1", v: `${f2(th1.weekly)}/wk`, s: "Award wage only, after tax" },
          { k: "Award", v: trade.award.code, s: `In force from 1 July 2026` },
        ]}
      />

      <div className="mb-12">
        <ApprenticePayCalculator defaultTrade={spoke.tradeSlug} lockTrade heading={`Apprentice ${spoke.label} Wages Calculator`} />
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="by-year">Apprentice {spoke.label} Pay by Year</H2>
            <p>
              These are the minimums the award sets for a junior apprentice on a standard four-year term, in dollars, from {APPRENTICE_RATES_FROM}. Your actual rate may be higher if you are on an enterprise agreement or your employer simply pays above the award; it cannot lawfully be lower.
            </p>
            {yearTable}
            {shared.length > 0 && (
              <p>
                {spoke.label}s share this table with {shared.map((s, i) => (
                  <span key={s.slug}>{i > 0 ? " and " : ""}<Link href={`/apprentice-pay/${s.slug}/`}>{lc(s.label)}s</Link></span>
                ))}. The tables are the same because the Building and Construction General On-site Award sets one percentage scale for all of its apprentices. Your own number differs in the allowances below.
              </p>
            )}
          </section>

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
                  head={split ? ["Year", "Allowances a week", "Weekly with allowances (no Year 12)", "Weekly with allowances (Year 12)", "Hourly equivalent (Year 12)"] : ["Year", "Allowances a week", "Weekly with allowances", "Hourly equivalent"]}
                  align={split ? ["l", "r", "r", "r", "r"] : ["l", "r", "r", "r"]}
                  rows={allowanceRows(spoke, sc).map((r) =>
                    split
                      ? [STAGE_LABELS[r.stage], f2(r.allowance), r.noYear12Weekly === null ? "n/a" : f2(r.noYear12Weekly), f2(r.year12Weekly), f2(r.year12Hourly)]
                      : [STAGE_LABELS[r.stage], f2(r.allowance), f2(r.year12Weekly), f2(r.year12Hourly)],
                  )}
                  caption={
                    <>
                      {sc.lines.map((l) => `${l.label} (${l.clause})`).join(" plus ")}.{sc.condition ? ` ${sc.condition}.` : ""} Hourly equivalent is weekly divided by 38.
                    </>
                  }
                />
              </div>
            ))}
          </section>

          {spoke.slug === "mechanic" && (
            <section>
              <H2 id="penalty-rates">Weekend and Public Holiday Rates</H2>
              <p>
                Schedule B.5.1 of the Vehicle Repair, Services and Retail Award prints the rates for a junior apprentice as a percentage of the ordinary hourly rate: Saturday 150%, Sunday 200% and public holidays 250%. Applied to the Year 12 rates in the first table:
              </p>
              <DataTable
                head={["Year (Year 12)", "Ordinary", "Saturday", "Sunday", "Public holiday"]}
                align={["l", "r", "r", "r", "r"]}
                rows={STAGES.map((s) => {
                  const r = spokeRate(spoke, s, "completed");
                  return [STAGE_LABELS[s], f2(r.hourly), f2(penaltyHourly(r.hourly, "saturday")), f2(penaltyHourly(r.hourly, "sunday")), f2(penaltyHourly(r.hourly, "publicHoliday"))];
                })}
                caption="Hourly dollars. The apprentice tool allowance is not subject to penalty additions (cl 19.6(c))."
              />
            </section>
          )}

          <section>
            <H2 id="take-home">How Much Do Apprentice {spoke.label}s Earn After Tax?</H2>
            <p>
              On the award wage alone, a first-year apprentice {label} on a full-time 38-hour week is paid about {formatAUD(th1.annual, 0)} a year (Year 12 completed) and takes home about {f2(th1.weekly)} a week. By fourth year the same hours give about {formatAUD(th4.annual, 0)} gross and {f2(th4.weekly)} a week after tax. Apprentices pay the same income tax as everyone else, but the low income offset and the tax-free threshold mean the tax in the early years is small.
            </p>
            {takeHomeTable}
            <p>
              To see your own figure, put your hourly rate and hours into the calculator above, or use the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to add overtime. Your hourly rate to a yearly salary is on the <Link href="/hourly-to-annual-salary-calculator/">hourly to annual salary calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="specifics">What Is Specific to {spoke.label} Apprentices</H2>
            {spoke.facts.map((f) => <p key={f}>{f}</p>)}
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
              <li>Find your year of apprenticeship{split ? " and whether you completed Year 12" : ""} and read the matching hourly figure in the first table.</li>
              <li>Add any allowance that applies to you from the allowances section, and compare the total with the hourly rate on your <Link href="/understanding-your-payslip/">payslip</Link>.</li>
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
            lastVerified={APPRENTICE_PAY_VERIFIED_ON}
            sources={sources}
            methodology={<>
              <p>Every rate is the minimum printed in the award&rsquo;s apprentice clause or schedule, or the award&rsquo;s percentage applied to its reference rate ({f2(STANDARD_WEEKLY_RATE)} a week) and rounded to the cent; hourly is the award&rsquo;s published figure or weekly divided by 38. Allowances are the amounts in the award&rsquo;s allowance clauses in force from 1 July 2026, added to the weekly wage. Take-home is the site&rsquo;s 2026-27 resident calculation on the award wage for 38 hours, 52 weeks, with the low income offset and the Medicare levy (private hospital cover, no HELP debt).</p>
              <p>Scope: a junior apprentice on a four-year term who started on or after 1 January 2014{adultAvailable ? ", plus the adult rates the award prints" : ""}. Pre-2014 apprentices, three-year terms, school-based apprentices, trainees and enterprise agreements are not modelled. General information, not advice.</p>
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
