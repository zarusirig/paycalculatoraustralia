import Link from "next/link";
import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, formatAUD, formatNegAUD } from "@/lib/constants";
import { MEDIAN_DEFINITION } from "@/lib/data/job-pay-rates/common";
import { ATO_INCOME_YEAR } from "@/lib/data/health-salary/ato-2023-24";
import {
  DIVISION_293_THRESHOLD,
  HEALTH_SALARY_PAGES,
  HOSPITAL_PACKAGING,
  SG_RATE,
  STAFF_SPECIALIST_SCALES,
  healthSalaryPath,
  hospitalPackagingBenefit,
  takeHome,
  takeHomePageFor,
  type AtoRow,
  type AtoTable,
  type HealthSalaryPage,
} from "@/lib/data/health-salary";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";

// /job-pay-rates/{dentist,radiologist,anaesthetist,optometrist,gp,surgeon}/ —
// salary pages for health jobs where no modern award sets most people's pay.
// Same chrome, tone and components as the award occupation pages
// (job-pay-rates-occupation.tsx), but the page leads with the ATO's tax-return
// figures and shows what that pay looks like after tax and on a payslip.

const BASE = SITE_CONFIG.baseUrl;

function guideSlug(page: HealthSalaryPage): string {
  return `job-pay-rates/${page.slug}`;
}

function canonical(page: HealthSalaryPage): string {
  return `${BASE}${healthSalaryPath(page.slug)}`;
}

/** Metadata for the thin route file. Canonical is trailing-slashed. */
export function healthSalaryMetadata(page: HealthSalaryPage): Metadata {
  const url = canonical(page);
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: SITE_CONFIG.name,
      type: "article",
      locale: "en_AU",
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.metaDescription },
  };
}

/** BreadcrumbList, WebPage, Article (with the guide's author) and FAQPage, built from the page data. */
export function healthSalarySchemas(page: HealthSalaryPage) {
  const url = canonical(page);
  const authorship = getGuideAuthorship(guideSlug(page));
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "Job Pay Rates", item: `${BASE}/job-pay-rates/` },
      { "@type": "ListItem", position: 3, name: `${page.name} Salary`, item: url },
    ],
  };
  const webPage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: page.heading,
    url,
    description: page.metaDescription,
    inLanguage: "en-AU",
    dateModified: page.dateModified,
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.heading,
    image: `${BASE}/og-image.png`,
    description: page.metaDescription,
    url,
    datePublished: page.dateModified,
    dateModified: page.dateModified,
    inLanguage: "en-AU",
    ...(authorship ? { author: authorship.author.jsonLd } : {}),
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  };
  // Built from the same array the accordion renders, so markup and visible
  // answers cannot drift.
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };
  return [breadcrumb, webPage, article, faq];
}

/** "a dentist", "an anaesthetist", "a GP". */
function withArticle(name: string): string {
  const word = name === "GP" ? name : name.toLowerCase();
  return /^[aeiou]/i.test(word) ? `an ${word}` : `a ${word}`;
}

function n(x: number): string {
  return x.toLocaleString("en-AU");
}

function AtoRowsTable({ table }: { table: AtoTable }) {
  return (
    <div className="not-prose my-8">
      <h3 className="mb-2 text-xl font-bold text-navy" style={HEADING_FONT} id={table.id}>
        {table.title}
      </h3>
      <p className="mb-4 text-warmgray">{table.intro}</p>
      <AtoGrid rows={table.rows} rowHeading={table.rowHeading} caption={table.title} />
      <p className="mt-2 text-xs text-warmgray">
        ATO Taxation statistics {ATO_INCOME_YEAR}, Individuals {table.part}. Whole dollars, before tax.
      </p>
    </div>
  );
}

function AtoGrid({ rows, rowHeading, caption }: { rows: AtoRow[]; rowHeading: string; caption: string }) {
  return (
    <TableShell minWidth="42rem" caption={caption}>
      <thead className="bg-sandstone font-semibold text-navy">
        <tr>
          <th scope="col" className="px-4 py-3">{rowHeading}</th>
          <th scope="col" className="px-4 py-3 text-right">People</th>
          <th scope="col" className="px-4 py-3 text-right">Average taxable income</th>
          <th scope="col" className="px-4 py-3 text-right">Median taxable income</th>
          <th scope="col" className="px-4 py-3 text-right">Average salary or wages</th>
          <th scope="col" className="px-4 py-3 text-right">Median salary or wages</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
        {rows.map((r) => (
          <tr key={r.label}>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">{r.label}</th>
            <td className="px-4 py-3 text-right">{n(r.individuals)}</td>
            <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(r.averageTaxableIncome)}</td>
            <td className="px-4 py-3 text-right">{formatAUD(r.medianTaxableIncome)}</td>
            <td className="px-4 py-3 text-right">{formatAUD(r.averageSalaryOrWages)}</td>
            <td className="px-4 py-3 text-right">{formatAUD(r.medianSalaryOrWages)}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

export default function HealthSalaryPageView({ page }: { page: HealthSalaryPage }) {
  const authorship = getGuideAuthorship(guideSlug(page));
  const lead = takeHome(page.ato.medianTaxableIncome);
  const leadPage = takeHomePageFor(page.ato.medianTaxableIncome);
  const scenarios = page.scenarios.map((s) => ({ ...s, t: takeHome(s.gross) }));
  const anyOver293 = scenarios.some((s) => s.gross > DIVISION_293_THRESHOLD);
  const siblings = HEALTH_SALARY_PAGES.filter((p) => p.slug !== page.slug);
  const sourceLinks: SourceLink[] = page.sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher }));
  const firstNsw = STAFF_SPECIALIST_SCALES.find((s) => s.state === "NSW");
  const packagingExample = firstNsw ? firstNsw.steps[0].annual : null;
  const Plural = page.plural[0].toUpperCase() + page.plural.slice(1);

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: "/job-pay-rates/", label: "Job Pay Rates" },
            { label: `${page.name} Salary` },
          ]}
        />

        <header className="mb-10 max-w-4xl lg:mb-16">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {page.heading}
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            {Plural} reported an average taxable income of{" "}
            <strong className="text-navy">{formatAUD(page.ato.averageTaxableIncome)}</strong> in the {ATO_INCOME_YEAR}{" "}
            income year, and a median of {formatAUD(page.ato.medianTaxableIncome)}, across {n(page.ato.individuals)} people
            who gave the job on their tax return — the latest figures the ATO has published. At 2026–27 tax rates, the
            median comes to about <strong className="text-navy">{formatAUD(lead.fortnightly, 0)} a fortnight</strong>{" "}
            after income tax and the Medicare levy.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            {page.notices.length > 0 && (
              <div className="not-prose mb-8 space-y-3">
                {page.notices.map((notice) => (
                  <div key={notice} className="flex gap-3 rounded-lg border border-sandstone-dark/30 bg-sandstone/50 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" aria-hidden="true" />
                    <p className="text-sm text-navy">{notice}</p>
                  </div>
                ))}
              </div>
            )}

            <section id="award">
              <h2 style={HEADING_FONT}>{page.coverageHeading}</h2>
              {page.coverage.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                {page.upLink.before}
                <Link href={page.upLink.href}>{page.upLink.anchor}</Link>
                {page.upLink.after}
              </p>
            </section>

            <section id="salary">
              <h2 style={HEADING_FONT}>
                {page.name} salary in Australia: the ATO&rsquo;s {ATO_INCOME_YEAR} figures
              </h2>
              <p>
                Every year the ATO publishes what people earned, grouped by the occupation they put on their tax return.
                The {ATO_INCOME_YEAR} figures (released on 17 June 2026) are the most recent. For {page.atoOccupation},{" "}
                {n(page.ato.individuals)} people reported an average taxable income of{" "}
                {formatAUD(page.ato.averageTaxableIncome)} and a median of {formatAUD(page.ato.medianTaxableIncome)}.
                Those who were paid a salary or wage had an average of {formatAUD(page.ato.averageSalaryOrWages)} and a
                median of {formatAUD(page.ato.medianSalaryOrWages)} from it.
              </p>
              <AtoGrid rows={[page.ato, ...page.atoBySex]} rowHeading="Who" caption={`${page.name} income, ${ATO_INCOME_YEAR}`} />
              <p className="text-base">
                <strong>Taxable income</strong> is everything a person earned — salary, business and contracting income,
                investments — less their deductions; the ATO&rsquo;s averages and medians for it include everyone in the
                occupation, whatever hours they worked. <strong>Salary or wages</strong> is only what employers paid, and
                its figures cover only the people who were paid one. Neither is a full-time salary rate.
              </p>
              {page.atoTables.map((t) => (
                <AtoRowsTable key={t.id} table={t} />
              ))}
            </section>

            {page.jsa && (
              <section id="employee-median">
                <h2 style={HEADING_FONT}>What full-time employed {page.plural} earn</h2>
                <p>
                  Jobs and Skills Australia puts median full-time earnings for{" "}
                  <a href={page.jsa.url} target="_blank" rel="noreferrer noopener">
                    {page.jsa.anzscoTitle} (ANZSCO {page.jsa.anzscoCode})
                  </a>{" "}
                  at <strong>{formatAUD(page.jsa.medianWeekly)} a week</strong> ({formatAUD(page.jsa.medianHourly)} an hour),
                  about {formatAUD(page.jsa.medianWeekly * 52)} a year. It also reports that {Math.round(page.jsa.fullTimeShare * 100)}% of
                  people in the group work full-time hours, and that full-time workers average {page.jsa.averageFullTimeHours} hours a
                  week.
                </p>
                {page.jsa.caveat ? <p>{page.jsa.caveat}</p> : null}
                <p className="text-base">{MEDIAN_DEFINITION}</p>
              </section>
            )}

            {page.awardTable && (
              <section id="award-minimum">
                <h2 style={HEADING_FONT}>{page.awardTable.title}</h2>
                <p>{page.awardTable.intro}</p>
                <TableShell minWidth="34rem" caption={page.awardTable.title}>
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-4 py-3">Classification</th>
                      <th scope="col" className="px-4 py-3 text-right">Annual</th>
                      <th scope="col" className="px-4 py-3 text-right">Weekly</th>
                      <th scope="col" className="px-4 py-3 text-right">Hourly</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {page.awardTable.rows.map((r) => (
                      <tr key={r.label}>
                        <th scope="row" className="px-4 py-3 text-left font-medium text-navy">{r.label}</th>
                        <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(r.annual)}</td>
                        <td className="px-4 py-3 text-right">{formatAUD(r.weekly, 2)}</td>
                        <td className="px-4 py-3 text-right">{formatAUD(r.hourly, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableShell>
                <p className="text-xs text-warmgray">{page.awardTable.footnote}</p>
              </section>
            )}

            {page.staffSpecialist && (
              <section id="public-hospital">
                <h2 style={HEADING_FONT}>Public hospital staff specialist salaries</h2>
                <p>
                  {withArticle(page.name).replace(/^a/, "A")} employed by a state public hospital is a staff specialist, paid on the same
                  salary scale as every other specialty in that state. The scales below are the base salaries each state
                  publishes, before the allowances most staff specialists also receive. We show only the states whose
                  schedule we have read from the official source.
                </p>
                {STAFF_SPECIALIST_SCALES.map((scale) => (
                  <div key={scale.state} className="not-prose my-8">
                    <h3 className="mb-2 text-xl font-bold text-navy" style={HEADING_FONT} id={`staff-specialist-${scale.state.toLowerCase()}`}>
                      {scale.state} — {scale.instrument}
                    </h3>
                    <p className="mb-4 text-warmgray">
                      {scale.effectiveFrom}. {scale.note}
                    </p>
                    <TableShell minWidth="30rem" caption={`${scale.state} staff specialist salaries`}>
                      <thead className="bg-sandstone font-semibold text-navy">
                        <tr>
                          <th scope="col" className="px-4 py-3">Step</th>
                          <th scope="col" className="px-4 py-3 text-right">Base salary a year</th>
                          {scale.steps.some((s) => s.withAllowance !== undefined) ? (
                            <th scope="col" className="px-4 py-3 text-right">{scale.allowanceColumn}</th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                        {scale.steps.map((s) => (
                          <tr key={s.label}>
                            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">{s.label}</th>
                            <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(s.annual)}</td>
                            {scale.steps.some((x) => x.withAllowance !== undefined) ? (
                              <td className="px-4 py-3 text-right">{s.withAllowance !== undefined ? formatAUD(s.withAllowance) : "—"}</td>
                            ) : null}
                          </tr>
                        ))}
                      </tbody>
                    </TableShell>
                    <p className="mt-2 text-xs text-warmgray">
                      Source:{" "}
                      <a href={scale.url} target="_blank" rel="noreferrer noopener" className="underline">
                        {scale.publisher}
                      </a>
                      .
                    </p>
                  </div>
                ))}
                {page.staffSpecialistNote ? <p>{page.staffSpecialistNote}</p> : null}

                <h3 style={HEADING_FONT} id="salary-packaging">Salary packaging in a public hospital</h3>
                <p>
                  Public hospital employees can package part of their salary before tax under a{" "}
                  {formatAUD(HOSPITAL_PACKAGING.grossedUpCap)} grossed-up fringe benefits tax cap — about{" "}
                  {formatAUD(HOSPITAL_PACKAGING.faceValue)} a year of everyday expenses such as rent or a mortgage.
                  {packagingExample !== null ? (
                    <>
                      {" "}On a {formatAUD(packagingExample)} salary, packaging the full amount leaves about{" "}
                      {formatAUD(hospitalPackagingBenefit(packagingExample))} more to spend each year, before the packaging
                      provider&rsquo;s fees.
                    </>
                  ) : null}{" "}
                  It lowers the taxable income on your payment summary but raises your reportable fringe benefits, which
                  count towards HELP repayments and the Medicare levy surcharge. See the{" "}
                  <Link href="/salary-packaging-guide/">salary packaging guide</Link> for how it works.
                </p>
              </section>
            )}

            <section id="after-tax">
              <h2 style={HEADING_FONT}>{page.name} salary after tax</h2>
              <p>
                What each figure above leaves after income tax and the Medicare levy at 2026–27 rates, treating it as
                taxable income with no deductions. The ATO figures are from {ATO_INCOME_YEAR}, so this shows what the same
                income takes home today, not what it took home then.
              </p>
              <TableShell minWidth="46rem" caption={`${page.name} take-home pay`}>
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th scope="col" className="px-4 py-3">Gross a year</th>
                    <th scope="col" className="px-4 py-3 text-right">Income tax</th>
                    <th scope="col" className="px-4 py-3 text-right">Medicare levy</th>
                    <th scope="col" className="px-4 py-3 text-right">Take-home a year</th>
                    <th scope="col" className="px-4 py-3 text-right">A fortnight</th>
                    <th scope="col" className="px-4 py-3 text-right">HELP repayment, if any</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                  {scenarios.map((s) => (
                    <tr key={s.label}>
                      <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
                        {formatAUD(s.gross)}
                        <span className="block text-xs font-normal text-warmgray">
                          {s.label} — {s.source}
                        </span>
                      </th>
                      <td className="px-4 py-3 text-right">{formatNegAUD(s.t.tax, 0, "−")}</td>
                      <td className="px-4 py-3 text-right">{formatNegAUD(s.t.medicare, 0, "−")}</td>
                      <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(s.t.net)}</td>
                      <td className="px-4 py-3 text-right">{formatAUD(s.t.fortnightly, 0)}</td>
                      <td className="px-4 py-3 text-right">{formatNegAUD(s.t.help, 0, "−")}</td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
              <p>
                2026–27 resident tax rates with the low income tax offset and the 2% Medicare levy, assuming private
                hospital cover (without it, the Medicare levy surcharge adds up to 1.5% at these incomes — check yours with
                the <Link href="/medicare-levy-surcharge-calculator/">Medicare levy surcharge calculator</Link>). The last
                column is the compulsory repayment if you still have a HELP debt; it comes out of take-home pay on top of
                tax. Super is paid on top by an employer at {Math.round(SG_RATE * 100)}%.
                {anyOver293 ? (
                  <>
                    {" "}Above {formatAUD(DIVISION_293_THRESHOLD)} of income plus concessional super, an extra 15% applies
                    to your super contributions — billed by the ATO after your tax return, not withheld from pay (see{" "}
                    <Link href="/division-293-tax/">Division 293 tax</Link>).
                  </>
                ) : null}
              </p>
              <p>
                For the full breakdown at the median, see{" "}
                <Link href={leadPage.href}>take-home pay on {formatAUD(leadPage.amount)}</Link>
                {leadPage.amount === page.ato.medianTaxableIncome
                  ? ""
                  : ` (the nearest step to ${formatAUD(page.ato.medianTaxableIncome)})`}
                , or put in your own salary below.
              </p>
              <div className="not-prose my-6">
                <Link
                  href="/take-home-pay-calculator/"
                  className="inline-flex items-center gap-2 rounded-lg bg-eucalyptus-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-navy"
                >
                  <Calculator className="h-5 w-5" aria-hidden="true" />
                  Calculate your take-home pay
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>

            <section id="payslip">
              <h2 style={HEADING_FONT}>What {withArticle(page.name)}&rsquo;s pay looks like on a payslip</h2>
              <p>
                An employed {page.name === "GP" ? "GP" : page.name.toLowerCase()} gets a payslip each pay day showing gross
                pay, the PAYG tax withheld (which already allows for the Medicare levy), any HELP repayment withheld, and
                the super the employer paid on top. Check the tax withheld against the{" "}
                <Link href="/tax-withheld-calculator/">tax withheld calculator</Link> and each line against{" "}
                <Link href="/understanding-your-payslip/">understanding your payslip</Link>.
              </p>
              {page.payslip.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                Contracting rather than employed? Compare the two with the{" "}
                <Link href="/contractor-pay-calculator/">contractor pay calculator</Link>.
              </p>
            </section>

            {page.notShown.length > 0 && (
              <section id="not-shown">
                <h2 style={HEADING_FONT}>What this page does not show</h2>
                <ul>
                  {page.notShown.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </section>
            )}

            <section id="faq">
              <h2 style={HEADING_FONT}>{page.name} salary questions</h2>
              <FaqList faqs={page.faqs} />
            </section>

            <section id="other-jobs">
              <h2 style={HEADING_FONT}>Other doctor and dentist salaries</h2>
              <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SidebarLink href="/job-pay-rates/doctor/" label="Doctor pay rates (Medical Practitioners Award)" />
                {siblings.map((p) => (
                  <SidebarLink key={p.slug} href={healthSalaryPath(p.slug)} label={`${p.name} salary`} />
                ))}
              </div>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Income figures are the ATO&rsquo;s Taxation statistics {ATO_INCOME_YEAR}, Individuals Table 15, read from
                  the spreadsheet the ATO publishes on data.gov.au on {page.verifiedOn} and transcribed to the dollar. They
                  describe what people reported on their tax returns; they are not pay rates. Employee medians come from Jobs
                  and Skills Australia&rsquo;s occupation profiles, and award and public hospital salaries from the
                  instrument named beside each table.
                </p>
                <p>
                  Take-home figures use the same tax engine as the rest of this site. Nothing on this page is estimated: a
                  figure we could not read from a primary source is listed under &ldquo;What this page does not show&rdquo;
                  instead.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sourceLinks} lastVerified={page.verifiedOn} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 text-base font-bold text-navy">{page.name} pay at a glance</h2>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Average taxable income ({ATO_INCOME_YEAR})</dt>
                      <dd className="font-semibold text-navy">{formatAUD(page.ato.averageTaxableIncome)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Median taxable income</dt>
                      <dd className="font-semibold text-navy">{formatAUD(page.ato.medianTaxableIncome)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Median salary or wages</dt>
                      <dd className="font-semibold text-navy">{formatAUD(page.ato.medianSalaryOrWages)}</dd>
                    </div>
                    {page.jsa && (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">Full-time employee median</dt>
                        <dd className="font-semibold text-navy">{formatAUD(page.jsa.medianWeekly)}/wk</dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Take-home on the median</dt>
                      <dd className="font-semibold text-navy">{formatAUD(lead.fortnightly, 0)} a fortnight</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Verified</dt>
                      <dd className="font-semibold text-navy">{page.verifiedOn}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 text-base font-bold text-navy">Related pages</h2>
                  <div className="space-y-3">
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    {page.related.map((r) => (
                      <SidebarLink key={r.href} href={r.href} label={r.label} />
                    ))}
                    <SidebarLink href="/job-pay-rates/" label="All job pay rates" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
