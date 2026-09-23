// /air-traffic-controller-salary/ and /pilot-salary/ (F5, 24 Sep 2026).
// One component renders both; per-page copy is in AVIATION_COPY below and every
// dollar figure comes from lib/data/aviation-pay.

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
  AVIATION_PATHS,
  aviationEntrySalary,
  aviationRatesYear,
  aviationTopSalary,
  type AviationPageSlug,
  type AviationPayPage,
} from "@/lib/data/aviation-pay";
import { nearestTakeHome, takeHomeHref } from "@/lib/data/service-pay";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink } from "./job-pay-shared";
import { NoticeList, ScaleTable, TakeHomeLinkNote } from "./service-pay-shared";

interface AviationCopy {
  crumb: string;
  heading: (year: string) => string;
  noun: string;
  plural: string;
  employerPhrase: string;
  howPayWorks: string[];
  traineeHeading: string;
  allowanceHeading: string;
}

export const AVIATION_COPY: Readonly<Record<AviationPageSlug, AviationCopy>> = {
  "air-traffic-controller": {
    crumb: "Air Traffic Controller Salary",
    heading: (year) => `Air Traffic Controller Salary Australia ${year} — Airservices ATC Pay Scale`,
    noun: "air traffic controller",
    plural: "air traffic controllers",
    employerPhrase: "Airservices Australia",
    howPayWorks: [
      "Civil air traffic controllers in Australia are employed by Airservices Australia, a Commonwealth corporate entity. Their pay is set by an enterprise agreement approved by the Fair Work Commission, which sits over the Airservices Australia Enterprise Award 2016 as the safety net.",
      "The agreement pays a base salary by classification: trainees are paid a training salary while they complete the Airservices course, then move onto the controller classifications as they gain ratings and endorsements. Shift work and the complexity of the airspace a controller works attract separate payments on top of base salary.",
      "Air traffic controllers in the Royal Australian Air Force are ADF members paid under the ADF pay scales, not this agreement.",
    ],
    traineeHeading: "Air traffic controller trainee pay",
    allowanceHeading: "Allowances, rosters and loadings",
  },
  pilot: {
    crumb: "Pilot Salary",
    heading: (year) => `Pilot Salary Australia ${year} — Air Pilots Award Minimum Pay`,
    noun: "pilot",
    plural: "pilots",
    employerPhrase: "the Air Pilots Award",
    howPayWorks: [
      "Pilots are covered by the Air Pilots Award 2020 [MA000046], a modern award that sets minimum annual salaries. Unlike most awards, it sets pay as annual salaries by type of flying and aircraft rather than as hourly rates.",
      "The award is a floor. Most airline pilots — at Qantas, Virgin Australia, Jetstar, Rex and regional carriers — are paid under their airline's enterprise agreement, which pays well above these minimums and has its own seniority scales. The award rates matter most in general aviation: charter, aerial work, flight instruction and smaller operators.",
    ],
    traineeHeading: "Cadet and trainee pilot pay",
    allowanceHeading: "Casual pilots, allowances and other rules",
  },
};

export default function AviationPayPageView({ page }: { page: AviationPayPage }) {
  const copy = AVIATION_COPY[page.slug];
  const entry = aviationEntrySalary(page);
  const top = aviationTopSalary(page);
  const year = aviationRatesYear(page);
  const authorship = getGuideAuthorship(page.slug === "pilot" ? "pilot-salary" : "air-traffic-controller-salary");
  const sources: SourceLink[] = page.sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher }));
  const otherPath = page.slug === "pilot" ? AVIATION_PATHS["air-traffic-controller"] : AVIATION_PATHS.pilot;
  const otherLabel = page.slug === "pilot" ? "Air traffic controller salary" : "Pilot salary";

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: "/job-pay-rates/", label: "Pay Rates by Job" },
            { label: copy.crumb },
          ]}
        />
        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {copy.heading(year)}
          </h1>
          {entry !== null && top !== null ? (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">
              Under {page.instrument.name}, {page.scales[0].title.toLowerCase()} runs from{" "}
              <strong className="text-navy">{formatAUD(entry)}</strong> to{" "}
              <strong className="text-navy">{formatAUD(top)}</strong> a year in base salary, from{" "}
              {page.ratesEffectiveFrom}. Every figure below is read from the instrument itself.
            </p>
          ) : null}
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <NoticeList notices={page.notices} />

            <section id="how-pay-works">
              <h2 style={HEADING_FONT}>How {copy.noun} pay is set</h2>
              {copy.howPayWorks.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                The figures on this page come from the{" "}
                <a href={page.instrument.url} target="_blank" rel="noreferrer noopener">
                  {page.instrument.name}
                </a>
                . {page.instrument.status}
              </p>
            </section>

            {page.scales.length > 0 ? (
              <section id="pay-scale">
                <h2 style={HEADING_FONT}>
                  {copy.noun.charAt(0).toUpperCase() + copy.noun.slice(1)} pay scale {year}
                </h2>
                <p>Annual full-time base salary before tax and before superannuation.</p>
                {page.scales.map((scale) => (
                  <ScaleTable key={scale.id} scale={scale} caption={scale.title} />
                ))}
                <TakeHomeLinkNote />
                {page.scheduledIncreases.length > 0 ? (
                  <>
                    <h3 style={HEADING_FONT}>Scheduled increases</h3>
                    <ul>
                      {page.scheduledIncreases.map((inc) => (
                        <li key={inc.date}>
                          <strong>{inc.date}:</strong> {inc.detail}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            ) : null}

            {page.traineePay.length > 0 ? (
              <section id="trainee-pay">
                <h2 style={HEADING_FONT}>{copy.traineeHeading}</h2>
                {page.traineePay.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ) : null}

            {page.allowances.length > 0 ? (
              <section id="allowances">
                <h2 style={HEADING_FONT}>{copy.allowanceHeading}</h2>
                <ul>
                  {page.allowances.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {page.otherInstruments.length > 0 ? (
              <section id="other-agreements">
                <h2 style={HEADING_FONT}>Other agreements</h2>
                <ul>
                  {page.otherInstruments.map((o) => (
                    <li key={o.name}>
                      <a href={o.url} target="_blank" rel="noreferrer noopener">
                        {o.name}
                      </a>
                      : {o.summary}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section id="after-tax">
              <h2 style={HEADING_FONT}>What a {copy.noun} salary is worth after tax</h2>
              {entry !== null && top !== null ? (
                <p>
                  Every salary in the tables links to its take-home figure — for example{" "}
                  <Link href={takeHomeHref(entry)}>take-home pay on {formatAUD(nearestTakeHome(entry))}</Link> and{" "}
                  <Link href={takeHomeHref(top)}>take-home pay on {formatAUD(nearestTakeHome(top))}</Link>. Allowances
                  and loadings are taxed as ordinary income on top of base salary.
                </p>
              ) : null}
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

            {page.unverified.length > 0 ? (
              <section id="not-shown">
                <h2 style={HEADING_FONT}>What this page does not show</h2>
                <ul>
                  {page.unverified.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {page.faqs.length > 0 ? (
              <section id="faq">
                <h2 style={HEADING_FONT}>
                  {copy.noun.charAt(0).toUpperCase() + copy.noun.slice(1)} salary questions
                </h2>
                <FaqList faqs={page.faqs} />
              </section>
            ) : null}

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Every figure was read from the {page.instrument.name} and the other sources listed below on{" "}
                  {page.verifiedOn}. Nothing is estimated or taken from salary surveys. Where an instrument publishes a
                  weekly rate, the annual figure is that rate multiplied out and the published rate is shown in the notes
                  column.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={page.verifiedOn} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">At a glance</h3>
                  <dl className="space-y-3 text-sm">
                    {entry !== null ? (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">{page.entryStep ?? "Entry"}</dt>
                        <dd className="font-semibold text-navy">{formatAUD(entry)}</dd>
                      </div>
                    ) : null}
                    {top !== null ? (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">{page.topStep ?? "Top"}</dt>
                        <dd className="font-semibold text-navy">{formatAUD(top)}</dd>
                      </div>
                    ) : null}
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Rates from</dt>
                      <dd className="text-right font-semibold text-navy">{page.ratesEffectiveFrom}</dd>
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
                  <h3 className="mb-3 font-bold text-navy">Related</h3>
                  <div className="space-y-3">
                    <SidebarLink href={otherPath} label={otherLabel} />
                    <SidebarLink href="/job-pay-rates/" label="Pay rates by job" />
                    <SidebarLink href="/adf-pay-scales/air-force/" label="Air Force pay scales" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/salary-to-hourly/" label="Salary to hourly" />
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
