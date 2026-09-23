// State page for the F5 emergency-service pay cluster:
// /paramedic-pay/{state}/, /police-pay/{state}/, /firefighter-pay/{state}/.
// Only built for jurisdictions with a verified table (see the routes'
// generateStaticParams); unverified jurisdictions appear on the hub as a
// "not yet verified — see official source" card.

import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import {
  SERVICE_OCCUPATION_CONFIG,
  entrySalary,
  nearestTakeHome,
  ratesYear,
  scaleRanges,
  serviceJurisdictions,
  takeHomeHref,
  topSalary,
  isVerified,
  type ServicePayJurisdiction,
} from "@/lib/data/service-pay";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink } from "./job-pay-shared";
import { NoticeList, RangeTable, ScaleTable, TakeHomeLinkNote } from "./service-pay-shared";

/** H1 / <title> stem shared by the route and the page. */
export function serviceStateHeading(j: ServicePayJurisdiction): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[j.occupation];
  return `${j.code} ${cfg.salaryNoun} ${ratesYear(j)} — ${j.employer} Pay Scale`;
}

export default function ServicePayStatePage({ jurisdiction: j }: { jurisdiction: ServicePayJurisdiction }) {
  const cfg = SERVICE_OCCUPATION_CONFIG[j.occupation];
  const entry = entrySalary(j);
  const top = topSalary(j);
  const authorship = getGuideAuthorship(cfg.authorKey);
  const sources: SourceLink[] = j.sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher }));
  const others = serviceJurisdictions(j.occupation).filter((o) => o.slug !== j.slug && isVerified(o));
  const lowerNoun = cfg.singular.toLowerCase();

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: cfg.hubPath, label: cfg.hubLabel },
            { label: `${j.code} ${cfg.salaryNoun}` },
          ]}
        />

        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {serviceStateHeading(j)}
          </h1>
          {entry !== null && top !== null ? (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">
              {j.employer} pays {cfg.plural} from <strong className="text-navy">{formatAUD(entry)}</strong> a year at
              entry to <strong className="text-navy">{formatAUD(top)}</strong> at the top of the{" "}
              {j.scales[0].title.toLowerCase()} table, before shift penalties, allowances and super. Every figure is read
              from the {j.agreementName} and applies from {j.ratesEffectiveFrom}.
            </p>
          ) : null}
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <NoticeList notices={j.notices} />

            <section id="at-a-glance">
              <h2 style={HEADING_FONT}>
                {j.code} {lowerNoun} pay {ratesYear(j)} at a glance
              </h2>
              <p>
                Full-time base salaries from {j.ratesEffectiveFrom}. Tap a table name for every row, or a salary to see
                it after tax.
              </p>
              <RangeTable rows={scaleRanges(j)} caption={`${j.employer} pay ranges by table`} />
            </section>

            <section id="agreement">
              <h2 style={HEADING_FONT}>
                Which agreement sets {j.code} {lowerNoun} pay
              </h2>
              <p>
                {cfg.plural.charAt(0).toUpperCase() + cfg.plural.slice(1)} employed by {j.employer} are paid under the{" "}
                <a href={j.agreementUrl} target="_blank" rel="noreferrer noopener">
                  {j.agreementName}
                </a>
                . The rates below apply from {j.ratesEffectiveFrom} and were read from the source on {j.verifiedOn}.
              </p>
              {j.nextIncrease ? (
                <p>
                  <strong>Next scheduled increase:</strong> {j.nextIncrease.date}. {j.nextIncrease.detail}
                </p>
              ) : null}
            </section>

            <section id="pay-scale">
              <h2 style={HEADING_FONT}>
                {j.employer} pay scale — every classification
              </h2>
              <p>
                Annual full-time base salary before tax and before superannuation. Part-time staff are paid pro rata.
              </p>
              {j.scales.map((scale) => (
                <ScaleTable key={scale.id} scale={scale} caption={`${j.employer}: ${scale.title}`} />
              ))}
              <TakeHomeLinkNote />
            </section>

            {j.traineePay.length > 0 ? (
              <section id="trainee-pay">
                <h2 style={HEADING_FONT}>
                  {j.occupation === "paramedic"
                    ? "Graduate and intern paramedic pay"
                    : j.occupation === "police"
                      ? "Recruit and trainee police pay"
                      : "Recruit firefighter pay"}
                </h2>
                {j.traineePay.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ) : null}

            {j.penalties.length > 0 ? (
              <section id="penalties">
                <h2 style={HEADING_FONT}>Shift penalties, loadings and allowances</h2>
                <p>
                  Base salary is not the whole of it: {cfg.plural} on rotating rosters are paid extra for shift work.
                  In summary, from the {j.agreementName}:
                </p>
                <ul>
                  {j.penalties.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p>
                  Check the instrument for the exact conditions that apply to your roster. Overtime is worked out
                  separately — the <Link href="/overtime-pay-calculator/">overtime pay calculator</Link> handles time
                  and a half and double time.
                </p>
              </section>
            ) : null}

            <section id="after-tax">
              <h2 style={HEADING_FONT}>
                What a {j.code} {lowerNoun} salary is worth after tax
              </h2>
              {entry !== null && top !== null ? (
                <p>
                  Every salary in the tables links to its take-home figure. Start with{" "}
                  <Link href={takeHomeHref(entry)}>take-home pay on {formatAUD(nearestTakeHome(entry))}</Link> for the
                  entry rate or <Link href={takeHomeHref(top)}>take-home pay on {formatAUD(nearestTakeHome(top))}</Link>{" "}
                  for the top of the scale. Those figures cover base salary only; shift penalties and allowances are
                  taxed as ordinary income on top.
                </p>
              ) : null}
              <p>
                Employer superannuation is paid on top of these salaries. For your own pay including penalties, a study
                loan or salary packaging, use the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> or the{" "}
                <Link href={`/pay-calculator-${j.slug}/`}>{j.code} pay calculator</Link>.
              </p>
              <div className="not-prose my-8">
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

            {j.unverified.length > 0 ? (
              <section id="not-shown">
                <h2 style={HEADING_FONT}>What this page does not show</h2>
                <p>We publish only what we could read from a primary source. These are left off rather than estimated:</p>
                <ul>
                  {j.unverified.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {j.faqs.length > 0 ? (
              <section id="faq">
                <h2 style={HEADING_FONT}>
                  {j.code} {lowerNoun} pay questions
                </h2>
                <FaqList faqs={j.faqs} />
              </section>
            ) : null}

            {others.length > 0 ? (
              <section id="other-states">
                <h2 style={HEADING_FONT}>
                  {cfg.singular} pay in other states
                </h2>
                <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {others.map((o) => (
                    <SidebarLink key={o.slug} href={`${cfg.hubPath}${o.slug}/`} label={`${o.code} ${lowerNoun} pay — ${o.employer}`} />
                  ))}
                </div>
              </section>
            ) : null}

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Every salary on this page was read from the {j.agreementName} or {j.employer}&rsquo;s own published pay
                  table on {j.verifiedOn}, and applies from {j.ratesEffectiveFrom}. Nothing is estimated, averaged or
                  interpolated. Where the instrument publishes a weekly or fortnightly rate, the annual figure is that rate
                  multiplied out and the published rate is shown in the notes column.
                </p>
                <p>
                  Take-home figures come from the site&rsquo;s own calculator using ATO rates for the current income
                  year.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={j.verifiedOn} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">
                    {j.code} {lowerNoun} pay at a glance
                  </h3>
                  <dl className="space-y-3 text-sm">
                    {entry !== null ? (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">{cfg.entryLabel}</dt>
                        <dd className="font-semibold text-navy">{formatAUD(entry)}</dd>
                      </div>
                    ) : null}
                    {top !== null ? (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">{cfg.topLabel}</dt>
                        <dd className="font-semibold text-navy">{formatAUD(top)}</dd>
                      </div>
                    ) : null}
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Rates from</dt>
                      <dd className="text-right font-semibold text-navy">{j.ratesEffectiveFrom}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Verified</dt>
                      <dd className="font-semibold text-navy">{j.verifiedOn}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Related</h3>
                  <div className="space-y-3">
                    <SidebarLink href={cfg.hubPath} label={cfg.hubLabel} />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href={`/pay-calculator-${j.slug}/`} label={`${j.code} Pay Calculator`} />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Pay Calculator" />
                    <SidebarLink href="/public-service-pay-scales/" label="Public Service Pay Scales" />
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
