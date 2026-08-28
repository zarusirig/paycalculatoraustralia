"use client";
import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SUPER_GUARANTEE } from "@/lib/constants";
import {
  JURISDICTIONS,
  bandMidpoint,
  formatBandRange,
  formatSalary,
  groupBands,
  groupRange,
  takeHomeHref,
  nearestTakeHomeSalary,
  type ClassificationBand,
  type Jurisdiction,
  type PaySchedule,
} from "@/lib/data/public-service-pay";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };

const BASIS_LABEL: Record<PaySchedule["basis"], string> = {
  award: "Award rate",
  agreement: "Enterprise or certified agreement",
  determination: "Tribunal determination",
  survey: "Reported salaries",
};

function AfterTaxLink({ band }: { band: ClassificationBand }) {
  const midpoint = bandMidpoint(band);
  const target = nearestTakeHomeSalary(midpoint);
  return (
    <Link
      href={takeHomeHref(midpoint)}
      className="text-eucalyptus-dark hover:text-navy hover:underline whitespace-nowrap"
    >
      {formatSalary(target)} after tax
    </Link>
  );
}

function PayPointList({ band }: { band: ClassificationBand }) {
  if (!band.payPoints || band.payPoints.length === 0) return null;
  return (
    <details className="mt-1 text-xs text-warmgray">
      <summary className="cursor-pointer text-eucalyptus-dark hover:underline">
        {band.payPoints.length} pay points
      </summary>
      <ul className="mt-2 space-y-1">
        {band.payPoints.map((point) => (
          <li key={point.label}>
            <span className="font-medium text-navy">{point.label}</span> {formatSalary(point.annual)}
          </li>
        ))}
      </ul>
    </details>
  );
}

function ScheduleTable({ schedule }: { schedule: PaySchedule }) {
  const isSurvey = schedule.basis === "survey";

  return (
    <div className="not-prose my-8">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-navy" style={HEADING_FONT}>
          {schedule.title}
        </h3>
        <p className="mt-2 text-sm text-warmgray">{schedule.coverage}</p>
        <p className="mt-2 text-xs text-warmgray">
          <span className="font-semibold text-navy">{BASIS_LABEL[schedule.basis]}</span> &middot;{" "}
          {schedule.effectiveFrom} &middot; {schedule.rangeMeaning}
        </p>
      </div>

      {schedule.streams.map((stream) => {
        const groups = groupBands(stream.bands);
        return (
          <div key={stream.id} className="mb-8">
            <h4 className="mb-1 text-base font-semibold text-navy" style={HEADING_FONT}>
              {stream.name}
            </h4>
            <p className="mb-3 text-sm text-warmgray">{stream.description}</p>

            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
              <table className="w-full text-left text-sm text-warmgray">
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th className="px-4 py-3">Classification</th>
                    <th className="px-4 py-3 text-right">
                      {isSurvey ? "5th–95th percentile" : "Salary range"}
                    </th>
                    {isSurvey && <th className="px-4 py-3 text-right">Median</th>}
                    {isSurvey && <th className="px-4 py-3 text-right">Employees</th>}
                    <th className="px-4 py-3 text-right">Mid-band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                  {groups.map((group) => (
                    <Fragment key={`${stream.id}-${group.label}`}>
                      {group.bands.length > 1 && (
                        <tr className="bg-sandstone/40">
                          <td className="px-4 py-2 font-semibold text-navy" colSpan={isSurvey ? 5 : 3}>
                            {group.label} &mdash; {formatBandRange(groupRange(group.bands))}
                          </td>
                        </tr>
                      )}
                      {group.bands.map((band) => (
                        <tr key={`${stream.id}-${band.code}`}>
                          <td className="px-4 py-3 align-top">
                            <span className="font-semibold text-navy">{band.code}</span>
                            <span className="block text-xs">{band.summary}</span>
                            {band.note && <span className="block text-xs italic">{band.note}</span>}
                            <PayPointList band={band} />
                          </td>
                          <td className="px-4 py-3 text-right align-top font-medium text-navy">
                            {formatBandRange(band)}
                          </td>
                          {isSurvey && (
                            <td className="px-4 py-3 text-right align-top">
                              {band.median ? formatSalary(band.median) : "—"}
                            </td>
                          )}
                          {isSurvey && (
                            <td className="px-4 py-3 text-right align-top">
                              {band.headcount ? band.headcount.toLocaleString("en-AU") : "—"}
                            </td>
                          )}
                          <td className="px-4 py-3 text-right align-top">
                            <AfterTaxLink band={band} />
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {schedule.note && <p className="text-sm text-warmgray">{schedule.note}</p>}
    </div>
  );
}

export default function PublicServicePayJurisdictionPage({
  jurisdiction,
}: {
  jurisdiction: Jurisdiction;
}) {
  const sources: SourceLink[] = jurisdiction.sources.map((source) => ({
    title: source.effectiveFrom
      ? `${source.title} (from ${source.effectiveFrom})`
      : source.title,
    url: source.url,
    publisher: source.publisher,
  }));

  const others = JURISDICTIONS.filter((j) => j.slug !== jurisdiction.slug);
  const primary = jurisdiction.schedules[0];
  const spanOfService = primary.streams.flatMap((s) => s.bands);
  const lowest = Math.min(...spanOfService.map((b) => b.min));
  const highest = Math.max(...spanOfService.map((b) => b.max));

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* BREADCRUMB */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li>
              <Link href="/" className="hover:text-eucalyptus-dark hover:underline">
                Pay Calculator
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-3 w-3 text-warmgray-light" />
            </li>
            <li>
              <Link
                href="/public-service-pay-scales/"
                className="hover:text-eucalyptus-dark hover:underline"
              >
                Public Service Pay Scales
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-3 w-3 text-warmgray-light" />
            </li>
            <li>
              <span className="font-medium text-navy" aria-current="page">
                {jurisdiction.label}
              </span>
            </li>
          </ol>
        </nav>

        {/* HERO */}
        <header className="mb-10 max-w-4xl">
          <h1
            className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl"
            style={HEADING_FONT}
          >
            {jurisdiction.metaTitle}
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">{jurisdiction.headline}</p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark lg:w-2/3">
            {/* Who sets the rates */}
            <section id="who-sets-the-rates">
              <h2 style={HEADING_FONT}>Who sets these rates</h2>
              <p>{jurisdiction.instrument}</p>
              <p>{jurisdiction.payRise}</p>
              <p>
                Across the schedule below, published salaries run from{" "}
                <strong>{formatSalary(lowest)}</strong> to <strong>{formatSalary(highest)}</strong>.
                Every figure on this page is transcribed from the instrument named beside it and was
                checked on {jurisdiction.verifiedOn}. Where a level could not be read from a primary
                source it is left out and listed further down rather than estimated.
              </p>
            </section>

            {/* Schedules */}
            <section id="pay-scales">
              <h2 style={HEADING_FONT}>{jurisdiction.shortName} pay scales</h2>
              {jurisdiction.schedules.map((schedule) => (
                <ScheduleTable key={schedule.id} schedule={schedule} />
              ))}
            </section>

            {/* Progression */}
            <section id="progression">
              <h2 style={HEADING_FONT}>How progression between pay points works</h2>
              {jurisdiction.progression.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </section>

            {/* Super */}
            <section id="superannuation">
              <h2 style={HEADING_FONT}>Superannuation on top of the band</h2>
              <p>{jurisdiction.superannuation.text}</p>
              <p>
                The Superannuation Guarantee minimum is{" "}
                {(SUPER_GUARANTEE.rate * 100).toFixed(1)}% from {SUPER_GUARANTEE.effectiveDate}, so
                a public sector employer contribution above that rate is real money you should count
                when you compare offers. Our{" "}
                <Link href="/superannuation-calculator/">superannuation calculator</Link> and{" "}
                <Link href="/superannuation-guide/">superannuation guide</Link> work through the
                difference over a career.
              </p>
            </section>

            {/* After tax */}
            <section id="after-tax">
              <h2 style={HEADING_FONT}>What the band is worth after tax</h2>
              <p>
                The salaries above are gross. To check a payslip you need the figure after income
                tax, the Medicare levy and any study loan repayment. The mid-band link in each row
                opens the nearest published take-home page, and the calculators below take your
                exact salary:
              </p>
              <ul>
                <li>
                  <Link href="/income-tax-calculator/">Income tax calculator</Link> &mdash; tax and
                  Medicare levy on an exact salary.
                </li>
                <li>
                  <Link href="/take-home-pay-calculator/">Take-home pay calculator</Link> &mdash;
                  weekly, fortnightly and monthly net pay.
                </li>
                <li>
                  <Link href="/fortnightly-pay-calculator/">Fortnightly pay calculator</Link> &mdash;
                  most public service payrolls pay fortnightly, and the classification tables above
                  are published as fortnightly rates.
                </li>
                <li>
                  <Link href="/pay-rise-calculator/">Pay rise calculator</Link> &mdash; what an
                  increment or an agreement increase is worth in the hand.
                </li>
                <li>
                  <Link href="/salary-sacrifice-calculator/">Salary sacrifice calculator</Link>{" "}
                  &mdash; public sector employers commonly offer packaging; this shows the tax
                  effect.
                </li>
                <li>
                  <Link href="/understanding-your-payslip/">Understanding your payslip</Link> &mdash;
                  how a classification and pay point appear on the payslip itself.
                </li>
              </ul>
            </section>

            {/* Gaps */}
            <section id="not-published">
              <h2 style={HEADING_FONT}>What this page does not cover</h2>
              <p>
                These are the rates we could not read from a primary source. Nothing here is
                estimated in their place:
              </p>
              <ul>
                {jurisdiction.unverified.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 style={HEADING_FONT}>{jurisdiction.shortName} pay questions</h2>
              <div className="not-prose">
                <Accordion type="single" collapsible className="w-full">
                  {jurisdiction.faqs.map((faq, index) => (
                    <AccordionItem key={faq.q} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-navy">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            <section id="method">
              <MethodologyDisclosure title="How these figures were put together" className="not-prose my-8">
                <p className="mb-2">
                  Every salary is transcribed from the instrument named in the sources list, at the
                  effective date shown on each table. No figure is averaged, indexed forward or taken
                  from a job advertisement.
                </p>
                <p className="mb-2">
                  Ranges are the bottom and top of the published band unless the table says
                  otherwise. Where a schedule reports actual salaries rather than a rate table, the
                  range shown is the 5th to 95th percentile and the median is shown beside it.
                </p>
                <p>
                  Mid-band links point at the nearest published take-home page, which steps in
                  $5,000 increments, so the after-tax figure it shows is close to but not identical
                  to the mid-band salary. Use a calculator for your exact pay point.
                </p>
              </MethodologyDisclosure>
            </section>

            <SourceAttribution
              sources={sources}
              lastVerified={jurisdiction.verifiedOn}
              className="mt-12"
            />
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone/30 p-5">
                <h2 className="mb-3 text-lg font-semibold text-navy" style={HEADING_FONT}>
                  Other public services
                </h2>
                <ul className="space-y-2 text-sm">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/public-service-pay-scales/${other.slug}/`}
                        className="font-medium text-eucalyptus-dark hover:text-navy hover:underline"
                      >
                        {other.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/public-service-pay-scales/"
                      className="font-medium text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Compare all public service pay scales
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-sandstone-dark/20 p-5">
                <h2 className="mb-3 text-lg font-semibold text-navy" style={HEADING_FONT}>
                  Check your own pay
                </h2>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/income-tax-calculator/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Income tax calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/take-home-pay-calculator/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Take-home pay calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/fortnightly-pay-calculator/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Fortnightly pay calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hecs-help-calculator/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      HECS-HELP repayment calculator
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-sandstone-dark/20 p-5">
                <h2 className="mb-3 text-lg font-semibold text-navy" style={HEADING_FONT}>
                  Go to the source
                </h2>
                <ul className="space-y-3 text-sm">
                  {jurisdiction.sources.slice(0, 4).map((source) => (
                    <li key={source.id}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-start gap-1 text-eucalyptus-dark hover:text-navy hover:underline"
                      >
                        <span>{source.title}</span>
                        <ExternalLink className="mt-1 h-3 w-3 shrink-0" />
                      </a>
                      <span className="block text-xs text-warmgray">{source.publisher}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
