import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { afterTax } from "@/lib/data/job-pay-rates";
import { APS } from "@/lib/data/public-service-pay/aps";
import {
  APS_GRADES,
  APS_GRADES_VERIFIED_ON,
  APS_SUPER_RATE,
  DEFENCE_SUPER_CLAUSE,
  agencySpread,
  apsGradeFaqs,
  type ApsGradeData,
} from "@/lib/data/public-service-pay/aps-grades";
import { formatSalary, nearestTakeHomeSalary, takeHomeHref, type PayPoint } from "@/lib/data/public-service-pay/types";
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

// /public-service-pay-scales/aps/{grade}/ (J6, wave 4). Figures: ./aps.ts
// (APS-wide) and ./aps-grades.ts (agency agreements). After tax uses the same
// engine as /take-home-pay-on/N/ (afterTax in lib/data/job-pay-rates).

const LINK = "text-eucalyptus-dark hover:underline";

function TakeHomeLink({ salary }: { salary: number }) {
  return (
    <Link href={takeHomeHref(salary)} className={`${LINK} whitespace-nowrap`}>
      {formatSalary(nearestTakeHomeSalary(salary))} page
    </Link>
  );
}

function afterTaxRows(points: readonly PayPoint[]) {
  return points.map((p) => {
    const t = afterTax(p.annual);
    return [
      p.label,
      formatSalary(p.annual),
      formatSalary(p.annual / 26),
      formatSalary(t.netAnnual),
      formatSalary(t.netAnnual / 26),
      <TakeHomeLink key={p.label} salary={p.annual} />,
    ];
  });
}

const AFTER_TAX_HEAD = ["Pay point", "Salary", "Gross per fortnight", "Take-home a year", "Take-home per fortnight", "Full breakdown"];
const AFTER_TAX_ALIGN: ("l" | "r")[] = ["l", "r", "r", "r", "r", "l"];

export default function ApsGradePage({ data }: { data: ApsGradeData }) {
  const { grade, survey, threshold, treasury, agencies } = data;
  const faqs = apsGradeFaqs(data);
  const spread = agencySpread(data);
  const ato = agencies.find((a) => a.scale.id === "ato")!;
  const median = survey.median ?? 0;
  const medianTax = afterTax(median);
  const slug = `public-service-pay-scales/aps/${grade.slug}`;

  const sources: SourceLink[] = [
    ...APS.sources
      .filter((s) => ["apsc-rem-2025", "apsc-common-conditions", "treasury-ea", "classification-rules"].includes(s.id))
      .map((s) => ({ title: s.title, url: s.url, publisher: s.publisher })),
    ...agencies.map((a) => ({ title: a.scale.source.title, url: a.scale.source.url, publisher: a.scale.source.publisher })),
  ];

  const keyPoints: PayPoint[] = [
    { label: "Threshold minimum", annual: threshold.min },
    { label: "APS-wide median", annual: median },
    { label: "Threshold maximum", annual: threshold.max },
  ];

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[
        { href: "/", label: "Pay Calculator" },
        { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
        { href: "/public-service-pay-scales/aps/", label: "APS (federal)" },
        { label: `${grade.label} salary` },
      ]} />

      <PageHeader title={`${grade.label} Salary 2026: Pay Rates by Agency, Pay Points and Take-Home Pay`}>
        <p>
          <strong>
            From 12 March 2026 every APS agency must pay {grade.label} at least {formatSalary(threshold.min)} at the bottom of its range, and its range must reach at least {formatSalary(threshold.max)} at the top.
          </strong>{" "}
          Across the whole APS the median {grade.label} ({grade.alsoCalled}{grade.typicalTitle ? `, usually titled ${grade.typicalTitle}` : ""}) base salary was {formatSalary(median)} at 31 December 2025, which is about {formatSalary(medianTax.netAnnual)} a year after tax. Actual pay depends on your agency&rsquo;s enterprise agreement: in the five agreements below, {grade.label} runs from {formatSalary(spread.min)} to {formatSalary(spread.max)}, before {APS_SUPER_RATE}% employer super.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Minimum from 12 Mar 2026", v: formatSalary(threshold.min), s: "APS-wide threshold, bottom of range" },
          { k: "APS-wide median", v: formatSalary(median), s: "Base salary, 31 Dec 2025" },
          { k: "ATO range", v: `${formatSalary(ato.min)}–${formatSalary(ato.max)}`, s: `${ato.points.length} pay points` },
          { k: "Employer super", v: `${APS_SUPER_RATE}%`, s: "APS median, every level" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="aps-wide">{grade.label} Pay Across the APS</H2>
            <p>
              The APS has no single {grade.label} pay rate. Since service-wide bargaining in 2023, every agency&rsquo;s range for a level must meet two thresholds: a minimum starting salary and a minimum top of range. The Australian Public Service Commission also publishes what {grade.label} staff were actually paid across all agencies.
            </p>
            <DataTable
              head={["Measure", "Salary", "Take-home pay"]}
              align={["l", "r", "r"]}
              rows={[
                ["Threshold minimum (bottom of every agency's range), from 12 Mar 2026", formatSalary(threshold.min), formatSalary(afterTax(threshold.min).netAnnual)],
                ["Threshold maximum (the top of every range must reach at least this)", formatSalary(threshold.max), formatSalary(afterTax(threshold.max).netAnnual)],
                ["5th percentile of actual base salaries, 31 Dec 2025", formatSalary(survey.min), formatSalary(afterTax(survey.min).netAnnual)],
                ["Median base salary, 31 Dec 2025", formatSalary(median), formatSalary(medianTax.netAnnual)],
                ["95th percentile of actual base salaries, 31 Dec 2025", formatSalary(survey.max), formatSalary(afterTax(survey.max).netAnnual)],
              ]}
              caption={<>Thresholds: APS Bargaining Statement of Common Conditions, Year 3 column. Actual salaries: APSC remuneration data at 31 December 2025{survey.headcount ? `, ${survey.headcount.toLocaleString("en-AU")} ${grade.label} employees` : ""}, before the 3.4% rise in March 2026. Take-home pay uses 2026–27 resident tax rates, the Medicare levy and no HECS.</>}
            />
            <p>{survey.summary}</p>
          </section>

          <section>
            <H2 id="by-agency">{grade.label} Salary by Agency</H2>
            <p>
              Five agencies&rsquo; enterprise agreements, all at the rates from 12 March 2026 (the 3.4% service-wide increase). Where an agreement lists every pay point, the table shows the lowest and highest.
            </p>
            <DataTable
              head={["Agency", "Bottom", "Top", "How the agreement sets it"]}
              align={["l", "r", "r", "l"]}
              rows={[
                ...agencies.map((a) => [
                  a.scale.agency,
                  formatSalary(a.min),
                  formatSalary(a.max),
                  <span key={a.scale.id}>{a.scale.kind === "points" ? `${a.points.length} pay points` : "Salary band (minimum and maximum)"}{a.note ? `. ${a.note}` : ""}</span>,
                ]),
                ["Department of the Treasury", formatSalary(treasury.min), formatSalary(treasury.max), `${treasury.payPoints?.length ?? 0} pay points`],
              ]}
              caption={<>Read from each agreement&rsquo;s &ldquo;from 12 March 2026&rdquo; column on {APS_GRADES_VERIFIED_ON} (Treasury on {APS.sources.find((s) => s.id === "treasury-ea")?.verifiedOn}). Around 100 agencies have their own agreement; check yours before relying on another agency&rsquo;s figure.</>}
            />
          </section>

          <section>
            <H2 id="pay-points">{grade.label} Pay Points and Take-Home Pay</H2>
            <p>
              The ATO and Treasury agreements list every {grade.label} pay point. Fortnightly figures divide the year by 26.
            </p>
            <h3>ATO Enterprise Agreement 2024</h3>
            <DataTable head={AFTER_TAX_HEAD} align={AFTER_TAX_ALIGN} rows={afterTaxRows(ato.points)} caption={<>The ATO table does not number its pay points; they are numbered here from lowest to highest.</>} />
            {treasury.payPoints && treasury.payPoints.length > 0 ? (
              <>
                <h3>Treasury Enterprise Agreement 2024</h3>
                <DataTable head={AFTER_TAX_HEAD} align={AFTER_TAX_ALIGN} rows={afterTaxRows(treasury.payPoints)} />
              </>
            ) : null}
            <h3>At the APS-wide figures</h3>
            <DataTable head={AFTER_TAX_HEAD} align={AFTER_TAX_ALIGN} rows={afterTaxRows(keyPoints)} caption={<>Take-home pay: 2026–27 resident tax rates with the low income tax offset and Medicare levy, no HECS or salary sacrifice. The linked pages are the nearest $5,000 salary, with HECS and super shown.</>} />
          </section>

          <section>
            <H2 id="super">{grade.label} Superannuation: {APS_SUPER_RATE}%</H2>
            <p>
              APS agencies pay employer super well above the 12% Superannuation Guarantee. The APSC reports a median employer contribution of {APS_SUPER_RATE}% of base salary at every classification in 2025, and the Defence agreement puts it in writing: &ldquo;{DEFENCE_SUPER_CLAUSE}&rdquo; (clause C7.4). On the {grade.label} threshold minimum of {formatSalary(threshold.min)}, {APS_SUPER_RATE}% is {formatSalary(threshold.min * 0.154)} a year; on the median of {formatSalary(median)} it is {formatSalary(median * 0.154)}. Super is paid on top of salary and is not part of take-home pay.
            </p>
            <p>
              To compare an APS offer with a private-sector job quoted as a package, use the <Link href="/salary-package-calculator/">salary package calculator</Link>, and the <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> for extra contributions.
            </p>
          </section>

          <section>
            <H2 id="progression">Moving Up Within {grade.label}</H2>
            <p>
              Within a level you move up pay points under your agency&rsquo;s agreement, usually one increment a year subject to a satisfactory performance rating. Promotion to the next level is a new job, not an increment, and normally starts at its bottom pay point, which is why ranges overlap between levels.
              {data.next ? <> The next level up is <Link href={`/public-service-pay-scales/aps/${data.next.slug}/`}>{data.next.label}</Link>.</> : null}
              {data.previous ? <> The level below is <Link href={`/public-service-pay-scales/aps/${data.previous.slug}/`}>{data.previous.label}</Link>.</> : null}
            </p>
            <p>
              Every other level, the SES and the full APSC tables are on the <Link href="/public-service-pay-scales/aps/">APS pay scales</Link> page; state public services are on the <Link href="/public-service-pay-scales/">public service pay scales</Link> hub.
            </p>
            <nav aria-label="APS levels" className="not-prose my-4">
              <ul className="flex flex-wrap gap-2">
                {APS_GRADES.map((g) => (
                  <li key={g.slug}>
                    {g.slug === grade.slug ? (
                      <span className="inline-block rounded-full border border-navy bg-navy px-3 py-1 text-sm font-medium text-white" aria-current="page">{g.label}</span>
                    ) : (
                      <Link href={`/public-service-pay-scales/aps/${g.slug}/`} className="inline-block rounded-full border border-sandstone-dark/30 bg-white px-3 py-1 text-sm font-medium text-navy hover:border-eucalyptus hover:text-eucalyptus-dark">{g.label} salary</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <FaqSection faqs={faqs} label={`${grade.label} salary`} />

          <PageFooter
            slug={slug}
            lastVerified={APS_GRADES_VERIFIED_ON}
            sources={sources}
            methodology={<>
              <p>APS-wide figures come from the APSC&rsquo;s remuneration data at 31 December 2025 and the salary thresholds in the APS Bargaining Statement of Common Conditions (Year 3, from 12 March 2026). Agency figures are copied from each enterprise agreement&rsquo;s column for 12 March 2026; nothing is averaged or estimated. Where an agreement lifted a figure to the APS-wide threshold, the agreement&rsquo;s figure is shown.</p>
              <p>Take-home pay uses the same engine as our take-home pay pages: 2026–27 resident tax rates, the low income tax offset and the 2% Medicare levy, with no HECS, salary sacrifice or Medicare levy surcharge. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/public-service-pay-scales/aps/", label: "APS Pay Scales (all levels)" },
          { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
          { href: takeHomeHref(median), label: `Take-Home Pay on ${formatSalary(nearestTakeHomeSalary(median))}` },
          { href: "/salary-package-calculator/", label: "Salary Package Calculator" },
          { href: "/long-service-leave-calculator/", label: "Long Service Leave Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
