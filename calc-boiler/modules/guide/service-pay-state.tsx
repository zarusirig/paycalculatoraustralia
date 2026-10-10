// State page for the service-pay family: /paramedic-pay/{state}/,
// /police-pay/{state}/, /firefighter-pay/{state}/ and
// /prison-officer-pay/{state}/. Only built for jurisdictions with a verified
// table (see the routes' generateStaticParams); unverified jurisdictions
// appear on the hub as a "not yet verified — see official source" card.
//
// The page leads with the state's own instrument, dates, tables, allowances
// and notices. Explanations that would read the same on every state (how pay
// is set without a modern award, how penalties and super are taxed) live on
// the family hub and the guides, and are linked in one line here.

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
  ratesYear,
  scaleRanges,
  serviceJurisdictions,
  topSalary,
  isVerified,
  type ServicePayJurisdiction,
} from "@/lib/data/service-pay";
import { entryRow, serviceKeyFacts, topRow } from "@/lib/data/service-pay/facts";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink } from "./job-pay-shared";
import { NoticeList, RangeTable, SalaryLink, ScaleTable } from "./service-pay-shared";
import FeaturedImage from "@/components/common/featured-image";

/** H1 / <title> stem shared by the route and the page. */
export function serviceStateHeading(j: ServicePayJurisdiction): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[j.occupation];
  return `${j.code} ${cfg.salaryNoun} ${ratesYear(j)} — ${j.employer} Pay Scale`;
}

const TRAINEE_HEADING: Record<ServicePayJurisdiction["occupation"], string> = {
  paramedic: "Graduate and intern paramedic pay",
  police: "Recruit and trainee police pay",
  "prison-officer": "Trainee and probationary prison officer pay",
  firefighter: "Recruit firefighter pay",
};

export default function ServicePayStatePage({ jurisdiction: j }: { jurisdiction: ServicePayJurisdiction }) {
  const cfg = SERVICE_OCCUPATION_CONFIG[j.occupation];
  const entry = entrySalary(j);
  const top = topSalary(j);
  const entryStep = entryRow(j);
  const topStep = topRow(j);
  const facts = serviceKeyFacts(j);
  const authorship = getGuideAuthorship(cfg.authorKey);
  const sources: SourceLink[] = j.sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher }));
  const others = serviceJurisdictions(j.occupation).filter((o) => o.slug !== j.slug && isVerified(o));
  const lowerNoun = cfg.singular.toLowerCase();
  // Some instruments publish weekly or fortnightly rates; the notes column quotes them.
  const converted = j.scales.some((s) => s.steps.some((step) => /week|fortnight/i.test(step.note ?? "")));

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
          {entry !== null && top !== null && entryStep && topStep ? (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">
              Under the {j.agreementName}, from {j.ratesEffectiveFrom}, the {entryStep.label} rate is{" "}
              <strong className="text-navy">{formatAUD(entry)}</strong> a year and the {topStep.label} rate is{" "}
              <strong className="text-navy">{formatAUD(top)}</strong>.
            </p>
          ) : null}
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <NoticeList notices={j.notices} />

            <section id="at-a-glance">
              <h2 style={HEADING_FONT}>
                {j.code} {lowerNoun} pay {ratesYear(j)} at a glance
              </h2>
              <div className="not-prose my-6 overflow-hidden rounded-xl border border-sandstone-dark/20">
                <dl className="divide-y divide-sandstone-dark/20 text-sm">
                  {facts.map((f) => (
                    <div key={f.label} className="grid gap-1 bg-white px-5 py-3 sm:grid-cols-3 sm:gap-4">
                      <dt className="font-medium text-warmgray">{f.label}</dt>
                      <dd className="text-navy sm:col-span-2">
                        {f.href ? (
                          <a href={f.href} target="_blank" rel="noreferrer noopener" className="underline decoration-eucalyptus/40 underline-offset-4 hover:text-eucalyptus-dark">
                            {f.value}
                          </a>
                        ) : (
                          f.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              {j.nextIncrease ? <p>{j.nextIncrease.detail}</p> : null}
              <RangeTable rows={scaleRanges(j)} caption={`${j.employer} pay ranges by table`} />
            </section>

            <section id="pay-scale">
              <h2 style={HEADING_FONT}>
                {j.employer} pay scale — every classification
              </h2>
              {j.scales.map((scale) => (
                <ScaleTable key={scale.id} scale={scale} caption={`${j.employer}: ${scale.title}`} />
              ))}
            </section>

            {j.traineePay.length > 0 ? (
              <section id="trainee-pay">
                <h2 style={HEADING_FONT}>{TRAINEE_HEADING[j.occupation]}</h2>
                {j.traineePay.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ) : null}

            {j.penalties.length > 0 ? (
              <section id="penalties">
                <h2 style={HEADING_FONT}>{j.employer} penalties, loadings and allowances</h2>
                <ul>
                  {j.penalties.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {j.unverified.length > 0 ? (
              <section id="not-shown">
                <h2 style={HEADING_FONT}>Left off this page</h2>
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

            <section id="after-tax">
              <p>
                How tax, super and penalties apply to these salaries:{" "}
                <Link href={`${cfg.hubPath}#after-tax`}>{cfg.hubLabel}</Link>.
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

            {others.length > 0 ? (
              <section id="other-states">
                <h2 style={HEADING_FONT}>
                  {cfg.singular} pay in other states
                </h2>
                <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {others.map((o) => (
                    <SidebarLink key={o.slug} href={`${cfg.hubPath}${o.slug}/`} label={o.employer} />
                  ))}
                </div>
              </section>
            ) : null}

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Read from the {j.agreementName} on {j.verifiedOn}.
                  {converted
                    ? " A weekly or fortnightly rate in the notes column is the rate as published; where the instrument prints no annual figure, the annual salary is that rate multiplied out."
                    : ""}
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={j.verifiedOn} />
              {authorship ? (
                <AuthorBox
                  author={authorship.author}
                  reviewer={authorship.reviewer}
                  lastReviewed={authorship.lastReviewed}
                  compact
                />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">{j.employer}</h3>
                  <dl className="space-y-3 text-sm">
                    {entry !== null && entryStep ? (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">{entryStep.label}</dt>
                        <dd className="font-semibold">
                          <SalaryLink salary={entry} />
                        </dd>
                      </div>
                    ) : null}
                    {top !== null && topStep ? (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">{topStep.label}</dt>
                        <dd className="font-semibold">
                          <SalaryLink salary={top} />
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </CardContent>
              </Card>
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <SidebarLink href={cfg.hubPath} label={cfg.hubLabel} />
                    <SidebarLink href={`/pay-calculator-${j.slug}/`} label={`${j.code} Pay Calculator`} />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Pay Calculator" />
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
