// Hub for the F5 emergency-service pay cluster: /paramedic-pay/, /police-pay/,
// /firefighter-pay/. Verified states get a comparison row and a link; states
// whose table could not be verified get a "not yet verified — see the official
// source" card instead of a number.

import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";
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
  isVerified,
  occupationSummary,
  serviceJurisdictions,
  topSalary,
  type ServiceOccupation,
} from "@/lib/data/service-pay";
import { HOW_PAY_IS_SET, serviceHubFaqs } from "@/lib/data/service-pay/hub";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";
import { SalaryLink, TakeHomeLinkNote } from "./service-pay-shared";

const SIBLINGS: { href: string; label: string }[] = [
  { href: "/paramedic-pay/", label: "Paramedic pay by state" },
  { href: "/police-pay/", label: "Police pay by state" },
  { href: "/firefighter-pay/", label: "Firefighter pay by state" },
  { href: "/healthcare-worker-pay/", label: "Nurse and healthcare worker pay" },
  { href: "/teacher-pay-australia/", label: "Teacher pay by state" },
  { href: "/public-service-pay-scales/", label: "Public service pay scales" },
  { href: "/adf-pay-scales/", label: "ADF pay scales" },
  { href: "/job-pay-rates/", label: "Pay rates by job" },
];

export function serviceHubHeading(occupation: ServiceOccupation): string {
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const year = occupationSummary(occupation)?.year ?? "2026";
  return `${cfg.salaryNoun} Australia ${year} — ${cfg.singular} Pay by State`;
}

export default function ServicePayHub({ occupation }: { occupation: ServiceOccupation }) {
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const all = serviceJurisdictions(occupation);
  const verified = all.filter(isVerified);
  const unverified = all.filter((j) => !isVerified(j));
  const summary = occupationSummary(occupation);
  const authorship = getGuideAuthorship(cfg.authorKey);
  const faqs = serviceHubFaqs(occupation);
  const sources: SourceLink[] = verified.flatMap((j) => j.sources.slice(0, 1));

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs trail={[{ href: "/", label: "Pay Calculator" }, { label: cfg.hubLabel }]} />
        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {serviceHubHeading(occupation)}
          </h1>
          {summary ? (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">
              {cfg.plural.charAt(0).toUpperCase() + cfg.plural.slice(1)} start on{" "}
              <strong className="text-navy">
                {formatAUD(summary.lowestEntry.entry)} to {formatAUD(summary.highestEntry.entry)}
              </strong>{" "}
              a year depending on the state, and the top of the {cfg.singular.toLowerCase()} scale runs from{" "}
              <strong className="text-navy">
                {formatAUD(summary.lowestTop.top)} to {formatAUD(summary.highestTop.top)}
              </strong>
              . Each figure is read from the state&rsquo;s own agreement or official pay table — there is no national
              award rate for {cfg.plural}.
            </p>
          ) : null}
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="by-state">
              <h2 style={HEADING_FONT}>
                {cfg.singular} salary by state
              </h2>
              <p>
                Base salary, full time, before tax, shift penalties and super. &ldquo;{cfg.entryLabel}&rdquo; is the
                first qualified or entry row of each state&rsquo;s table and &ldquo;{cfg.topLabel}&rdquo; the top of its
                core scale; supervisory and specialist rows are on the state pages.
              </p>
              <TableShell caption={`${cfg.singular} pay by state`} minWidth="38rem">
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      State
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Employer
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      {cfg.entryLabel}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      {cfg.topLabel}
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Rates from
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                  {verified.map((j) => {
                    const entry = entrySalary(j);
                    const top = topSalary(j);
                    return (
                      <tr key={j.slug}>
                        <th scope="row" className="px-4 py-3 text-left font-medium">
                          <Link href={`${cfg.hubPath}${j.slug}/`} className="text-navy hover:text-eucalyptus-dark hover:underline">
                            {j.code}
                          </Link>
                        </th>
                        <td className="px-4 py-3">
                          {j.employer}
                          {j.hubNote ? <span className="mt-1 block text-xs text-warmgray">{j.hubNote}</span> : null}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {entry !== null ? <SalaryLink salary={entry} /> : "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {top !== null ? <SalaryLink salary={top} /> : "—"}
                        </td>
                        <td className="px-4 py-3">{j.ratesEffectiveFrom}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableShell>
              <TakeHomeLinkNote />

              <div className="not-prose mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {verified.map((j) => (
                  <SidebarLink
                    key={j.slug}
                    href={`${cfg.hubPath}${j.slug}/`}
                    label={`${j.code} ${cfg.singular.toLowerCase()} pay — ${j.employer}`}
                  />
                ))}
              </div>

              {unverified.length > 0 ? (
                <div className="not-prose mt-8">
                  <h3 className="mb-3 text-lg font-bold text-navy" style={HEADING_FONT}>
                    Not yet verified — see the official source
                  </h3>
                  <p className="mb-4 text-sm text-warmgray">
                    We could not read a current table for these from a primary source, so we show no figure rather than
                    an estimate.
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {unverified.map((j) => (
                      <Card key={j.slug} className="border-sandstone-dark/30 bg-white">
                        <CardContent className="p-4">
                          <p className="mb-1 flex items-center gap-2 font-semibold text-navy">
                            <AlertTriangle className="h-4 w-4 text-eucalyptus-dark" aria-hidden="true" />
                            {j.code} — {j.employer}
                          </p>
                          {j.unverified[0] ? <p className="mb-2 text-sm text-warmgray">{j.unverified[0]}</p> : null}
                          <a
                            href={j.agreementUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 text-sm font-medium text-eucalyptus-dark hover:underline"
                          >
                            {j.agreementName}
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <section id="how-pay-is-set">
              <h2 style={HEADING_FONT}>
                How {cfg.singular.toLowerCase()} pay is set
              </h2>
              {HOW_PAY_IS_SET[occupation].map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>

            <section id="after-tax">
              <h2 style={HEADING_FONT}>
                {cfg.singular} pay after tax
              </h2>
              <p>
                Each salary in the table links to its take-home page. Shift penalties, overtime and allowances are taxed
                as ordinary income on top of base salary, so for your real pay enter your expected total in the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>. Overtime is covered by the{" "}
                <Link href="/overtime-pay-calculator/">overtime pay calculator</Link>.
              </p>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>
                {cfg.singular} pay questions
              </h2>
              <FaqList faqs={faqs} />
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these pages are sourced">
                <p>
                  Each state page is transcribed from that state&rsquo;s enterprise agreement, award, determination or
                  the employer&rsquo;s own published pay table, on the date shown on the page. Nothing is estimated,
                  averaged or interpolated, and states we could not verify carry no figures.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={verified[0]?.verifiedOn ?? ""} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Other pay scales</h3>
                  <div className="space-y-3">
                    {SIBLINGS.filter((s) => s.href !== cfg.hubPath).map((s) => (
                      <SidebarLink key={s.href} href={s.href} label={s.label} />
                    ))}
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
