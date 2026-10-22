import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SUPER_GUARANTEE } from "@/lib/constants";
import { afterTax } from "@/lib/data/job-pay-rates";
import {
  FACTS_READ_ON,
  LEVEL_DESCRIPTORS,
  LEVEL_FACT_SOURCES,
  ORDINARY_HOURS,
  WEEKS_PER_YEAR,
  formatHourly,
  headcountSentence,
  hourlyRate,
  levelFactSources,
  levelHeadcount,
} from "@/lib/data/public-service-pay/state-level-facts";
import {
  levelSteps,
  stateLevelFaqs,
  stateLevelPath,
  type StateLevelData,
  type StateLevelJurisdiction,
} from "@/lib/data/public-service-pay/state-levels";
import {
  TAKE_HOME_MAX,
  TAKE_HOME_STEP,
  formatBandRange,
  formatSalary,
  nearestTakeHomeSalary,
  takeHomeHref,
} from "@/lib/data/public-service-pay/types";
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

// /public-service-pay-scales/{vic|qld|sa}/{level}/ (23 Oct 2026). Figures come
// from levelSections() via lib/data/public-service-pay/state-levels.ts; after
// tax uses the same engine as /take-home-pay-on/N/.

const LINK = "text-eucalyptus-dark hover:underline";

/** The nearest take-home page, or the calculator above the last page ($200k). */
function BreakdownLink({ salary }: { salary: number }) {
  if (salary > TAKE_HOME_MAX + TAKE_HOME_STEP / 2) {
    return <Link href="/take-home-pay-calculator/" className={`${LINK} whitespace-nowrap`}>Calculator</Link>;
  }
  return (
    <Link href={takeHomeHref(salary)} className={`${LINK} whitespace-nowrap`}>
      {formatSalary(nearestTakeHomeSalary(salary))} page
    </Link>
  );
}

export default function StateLevelPage({ data }: { data: StateLevelData }) {
  const { jurisdiction: j, config, section, points, previous, next, siblings } = data;
  const { label, range } = section;
  const faqs = stateLevelFaqs(data);
  const slug = stateLevelPath(data).replace(/^\/|\/$/g, "");
  const hub = `/public-service-pay-scales/${j.slug}/`;
  const superRate = config.superRate ?? SUPER_GUARANTEE.rate * 100;
  const low = afterTax(range.min);
  const high = afterTax(range.max);
  const multiBand = section.bands.length > 1;
  const ladder = levelSteps(data);
  const source = j.sources.find((s) => s.id === section.schedule.sourceId);
  const descriptor = LEVEL_DESCRIPTORS[section.id];
  const headcount = levelHeadcount(section.id);
  const hours = ORDINARY_HOURS[j.slug as StateLevelJurisdiction];
  const allSources: SourceLink[] = [
    ...(source ? [{ title: source.title, url: source.url, publisher: source.publisher }] : []),
    ...section.compare.flatMap((c) => {
      const s = j.sources.find((x) => x.id === c.schedule.sourceId);
      return s ? [{ title: s.title, url: s.url, publisher: s.publisher }] : [];
    }),
    ...levelFactSources(data),
  ];
  const sources = allSources.filter((s, i) => allSources.findIndex((x) => x.url === s.url) === i);

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[
        { href: "/", label: "Pay Calculator" },
        { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
        { href: hub, label: j.label },
        { label: `${label} salary` },
      ]} />

      <PageHeader featuredImage title={`${label} Salary 2026: Pay Points, Pay per Fortnight and Take-Home Pay`}>
        <p>
          <strong>
            From {config.effective}, {label} pays {formatSalary(range.min)} to {formatSalary(range.max)} a year across {points.length} {config.stepWord}s.
          </strong>{" "}
          That is about {formatSalary(low.netAnnual)} to {formatSalary(high.netAnnual)} a year after tax. {label} is also written {config.alsoCalled(label)}. The figures come from the {section.schedule.title}.
          {multiBand ? ` The level has ${section.bands.length} value ranges: ${section.bands.map((b) => `${b.code} ${formatBandRange(b)}`).join("; ")}.` : ""}
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Bottom of level", v: formatSalary(range.min), s: points[0].label },
          { k: "Top of level", v: formatSalary(range.max), s: points[points.length - 1].label },
          { k: "Per fortnight", v: `${formatSalary(range.min / 26)}–${formatSalary(range.max / 26)}`, s: "Before tax, annual ÷ 26" },
          { k: "Employer super", v: `${superRate}%`, s: config.superRate ? "Set for this service" : "Superannuation Guarantee" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          {config.caveat ? (
            <p className="rounded-lg border border-sandstone-dark/30 bg-sandstone/40 p-4 text-base">
              <strong>Award rates, not every agreement.</strong> The {label} figures on this page are the award minimum. Most {j.shortName} departments pay under their own agreement; the last question below explains.
            </p>
          ) : null}

          <section>
            <H2 id="pay-points">{label} Pay Points and Take-Home Pay</H2>
            <p>
              Every {config.stepWord} in {label}, from {config.effective}. Fortnightly figures divide the year by 26. Take-home pay uses 2026–27 resident tax rates, the Medicare levy and no HECS.
            </p>
            <DataTable
              head={[...(multiBand ? ["Value range"] : []), "Step", "Salary", "Gross per fortnight", "Take-home a year", "Take-home per fortnight", "Full breakdown"]}
              align={[...(multiBand ? ["l" as const] : []), "l", "r", "r", "r", "r", "l"]}
              rows={points.map((p) => {
                const t = afterTax(p.annual);
                return [
                  ...(multiBand ? [p.band] : []),
                  p.label,
                  formatSalary(p.annual),
                  formatSalary(p.annual / 26),
                  formatSalary(t.netAnnual),
                  formatSalary(t.netAnnual / 26),
                  <BreakdownLink key={p.label} salary={p.annual} />,
                ];
              })}
              caption={<>Every {config.stepWord} in {label}. Full-time annual salary; super is paid on top. Read from the {section.schedule.title}; verified {j.verifiedOn}.</>}
            />
            <p>
              From the first {config.stepWord} to the top of {label} is {ladder.moves} {ladder.moves === 1 ? "move" : "moves"}, worth {formatSalary(ladder.spread)} a year in total ({ladder.spreadPct.toFixed(1)}% on the starting salary). That is about {formatSalary(ladder.averageStep)} a move on average. The biggest single move is {ladder.largest.from} to {ladder.largest.to}, at {formatSalary(ladder.largest.gain)}. After tax, the bottom of {label} is {formatSalary(low.netAnnual / 26)} a fortnight and the top is {formatSalary(high.netAnnual / 26)}.
            </p>
            {section.bands.map((b) => (
              <p key={b.code} className="text-base">{multiBand ? <strong>{b.code}: </strong> : null}{b.summary}</p>
            ))}
          </section>

          <section>
            <H2 id="hourly-rate">{label} Hourly Rate</H2>
            <p>
              {label} works out at {formatHourly(hourlyRate(range.min, hours.weekly))} to {formatHourly(hourlyRate(range.max, hours.weekly))} an hour before tax. Hourly rate = annual salary ÷ ({hours.weekly} × {WEEKS_PER_YEAR}). {hours.basis}. A year has {WEEKS_PER_YEAR} weeks (365 ÷ 7).
            </p>
            <DataTable
              head={["Step", "Salary", "Hourly rate"]}
              align={["l", "r", "r"]}
              rows={points.map((p) => [p.label, formatSalary(p.annual), formatHourly(hourlyRate(p.annual, hours.weekly))])}
              caption={<>{label} base hourly rate on {hours.weekly} ordinary hours a week, before tax. No casual loading, overtime or penalties. A payslip can differ by a few cents.</>}
            />
          </section>

          {descriptor ? (
            <section>
              <H2 id="what-the-level-does">What {label} Staff Do</H2>
              <p>{descriptor.text}</p>
              {descriptor.titles ? <p>{descriptor.titles}</p> : null}
              {headcount ? <p>{headcountSentence(label, headcount)}</p> : null}
              <p className="text-base">
                Our summary of the {LEVEL_FACT_SOURCES[descriptor.sourceId].title}, read {FACTS_READ_ON}.
              </p>
            </section>
          ) : null}

          {section.compare.length > 0 ? (
            <section>
              <H2 id="agreement">{label} Under an Agency Agreement</H2>
              {section.compare.map((c) => {
                const pts = c.band.payPoints ?? [];
                const awardAlwaysHigher = pts.every((p, i) => (points[i]?.annual ?? 0) >= p.annual);
                return (
                <div key={c.schedule.id}>
                  <p>
                    {c.label}.{" "}
                    {awardAlwaysHigher
                      ? `At ${label} the award is higher at every pay point, so the award rate is what this agency pays.`
                      : "Where the agreement is higher, it is what this agency pays."}
                  </p>
                  <DataTable
                    head={["Pay point", "Agreement rate", "Award rate", "Paid"]}
                    align={["l", "r", "r", "r"]}
                    rows={(c.band.payPoints ?? []).map((p, i) => {
                      const award = points[i]?.annual ?? 0;
                      return [p.label, formatSalary(p.annual), formatSalary(award), formatSalary(Math.max(p.annual, award))];
                    })}
                    caption={<>Where the agreement rate is below the award rate, the award rate is paid.</>}
                  />
                </div>
                );
              })}
            </section>
          ) : null}

          <section>
            <H2 id="super">{label} Superannuation</H2>
            <p>{config.superText}</p>
            <p>
              At {superRate}%, employer super on {label} is {formatSalary(range.min * superRate / 100)} a year at the bottom and {formatSalary(range.max * superRate / 100)} at the top. Super is paid on top of salary and is not part of take-home pay.
            </p>
          </section>

          <section>
            <H2 id="progression">Moving Up Within and Beyond {label}</H2>
            <p>{config.progression}</p>
            <p>
              {previous ? <>The level below is {previous.label} ({formatBandRange(previous.range)}). </> : null}
              {next ? <>The next level up is {next.label} ({formatBandRange(next.range)}). </> : null}
            </p>
            <nav aria-label={`${j.shortName} levels`} className="not-prose my-4">
              <ul className="flex flex-wrap gap-2">
                {siblings.map((s) => (
                  <li key={s.id}>
                    {s.id === section.id ? (
                      <span className="inline-block rounded-full border border-navy bg-navy px-3 py-1 text-sm font-medium text-white" aria-current="page">{s.label}</span>
                    ) : (
                      <Link href={`${hub}${s.id}/`} className="inline-block rounded-full border border-sandstone-dark/30 bg-white px-3 py-1 text-sm font-medium text-navy hover:border-eucalyptus hover:text-eucalyptus-dark">{s.label} salary</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <p>
              Every level, the full schedule and the other streams are on the <Link href={hub}>{j.label} pay scales</Link> page. Other services are on the <Link href="/public-service-pay-scales/">public service pay scales</Link> hub, including <Link href="/public-service-pay-scales/aps/">APS levels</Link>.
            </p>
          </section>

          <FaqSection faqs={faqs} label={`${label} salary`} />

          <PageFooter
            slug={slug}
            lastVerified={j.verifiedOn}
            sources={sources}
            methodology={<>
              <p>Every salary on this page is copied from the {section.schedule.title}, the same figures as the {j.label} page. Nothing is averaged or estimated. Fortnightly figures divide the annual salary by 26, so they can differ by a few dollars from a payslip.</p>
              <p>Take-home pay uses the same engine as our take-home pay pages: 2026–27 resident tax rates, the low income tax offset and the 2% Medicare levy, with no HECS, salary sacrifice or Medicare levy surcharge. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: hub, label: `${j.label} pay scales` },
          ...(next && siblings.some((s) => s.id === next.id) ? [{ href: `${hub}${next.id}/`, label: `${next.label} salary` }] : []),
          { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
          { href: takeHomeHref(range.min), label: `Take-Home Pay on ${formatSalary(nearestTakeHomeSalary(range.min))}` },
          { href: "/pay-rise-calculator/", label: "Pay Rise Calculator" },
          { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
