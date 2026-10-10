// /minimum-wage/{state}/ — one page per state or territory (F1, Oct 2026).
// The national rate is identical everywhere, so each page leads with the answer
// and the take-home calculator, then carries the state-specific rules: which
// workers are in the state system, any state wage case, public holidays, payroll
// tax and long service leave. Every figure comes from lib/data/minimum-wage-state.

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { EMPLOYMENT, SOURCES, formatAUD } from "@/lib/constants";
import { NMW_ORDER } from "@/lib/constants/junior-rates";
import { NMW } from "@/lib/constants/minimum-wage";
import {
  MW_STATES,
  MW_STATE_SLUGS,
  MW_STATE_VERIFIED_ON,
  NMW_SOURCE,
  fullTimeAdultTakeHome,
  holidaysInMinimumWageYear,
  lslData,
  mwStateFaqs,
  mwStateH1,
  payrollData,
  publicHolidayData,
  stateOnlyHolidayList,
  type MwStateInfo,
} from "@/lib/data/minimum-wage-state";
import MinimumWageStateCalculator from "@/modules/calculator/minimum-wage-state-calculator";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";
import FeaturedImage from "@/components/common/featured-image";

const m = (v: number) => formatAUD(v, 2);

export default function MinimumWageStatePage({ state: s }: { state: MwStateInfo }) {
  const t = fullTimeAdultTakeHome(s.slug);
  const hols = holidaysInMinimumWageYear(s.slug);
  const lsl = lslData(s.slug);
  const pt = payrollData(s.slug);
  const faqs = mwStateFaqs(s);
  const authorship = getGuideAuthorship("minimum-wage");
  const others = MW_STATE_SLUGS.filter((x) => x !== s.slug).map((x) => MW_STATES[x]);
  const stateOnly = stateOnlyHolidayList(s.slug);
  const publishers = Array.from(new Set(s.sources.map((x) => x.publisher.replace(/ \(.*\)$/, "")))).join(", ");

  const sources: SourceLink[] = [
    { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_SOURCE.url, publisher: SOURCES.fwc.name },
    ...s.sources,
    ...publicHolidayData(s.slug).sources.slice(0, 1).map((x) => ({ title: x.title, url: x.url, publisher: x.publisher })),
    { title: `${pt.name} payroll tax rates and thresholds 2026-27`, url: pt.ratesUrl, publisher: pt.revenueOffice },
    { title: lsl.act, url: lsl.actUrl, publisher: lsl.agency },
  ];

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: "/minimum-wage-australia/", label: "Minimum Wage Australia" },
            { label: s.name },
          ]}
        />

        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {mwStateH1(s)}
          </h1>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> The minimum wage {s.inName} is <strong>{m(NMW.hourly)} an hour</strong>, or{" "}
              <strong>{m(NMW.weekly)} a week</strong> for {EMPLOYMENT.standardWeeklyHours} hours, from 1 July 2026. A full-time adult takes
              home about <strong>{m(t.weeklyNet)} a week</strong> ({formatAUD(t.annualNet)} a year) after tax. Casuals get at least{" "}
              <strong>{m(NMW.casualHourly)}</strong> an hour. {s.answerNote}
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <nav aria-label="On this page" className="not-prose mb-8 flex flex-wrap gap-2 text-sm">
              {[
                ["#calculator", "Calculator"],
                ["#state-system", "State system"],
                ["#young-workers", "Young workers"],
                ["#holidays", "Public holidays"],
                ["#payroll-tax", "Payroll tax and LSL"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="rounded-full border border-sandstone-dark/30 px-3 py-1 text-navy hover:border-eucalyptus hover:text-eucalyptus-dark">
                  {label}
                </a>
              ))}
            </nav>

            <MinimumWageStateCalculator state={s.slug} stateName={s.name} />
            <FeaturedImage placement="content" className="mt-0" />
            <p className="text-sm">
              The rate, the after-tax table and the junior percentages are the same in every state, so they are set out once in{" "}
              <Link href="/minimum-wage-australia/">minimum wage in Australia</Link>. This page covers what is different {s.inName}.
            </p>

            <section id="state-system">
              <h2 style={HEADING_FONT}>{s.stateWageHeading}</h2>
              <p>{s.systemSummary}</p>
              <TableShell caption={`Who is in which system ${s.inName}`} minWidth="26rem">
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th scope="col" className="px-5 py-4">National system (Fair Work)</th>
                    <th scope="col" className="px-5 py-4">{s.code} state system</th>
                  </tr>
                </thead>
                <tbody className="bg-white align-top">
                  <tr>
                    <td className="px-5 py-3">
                      <ul className="m-0 list-disc pl-5">
                        {s.coverage.national.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-5 py-3">
                      {s.coverage.state.length ? (
                        <ul className="m-0 list-disc pl-5">
                          {s.coverage.state.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      ) : (
                        "No general state system"
                      )}
                    </td>
                  </tr>
                </tbody>
              </TableShell>
              <p className="text-sm">
                <strong>Fair Work Ombudsman:</strong> &ldquo;{s.systemFwo}&rdquo;
              </p>
              {s.stateWage.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>

            <section id="young-workers">
              <h2 style={HEADING_FONT}>Young workers and apprentices {s.inName}</h2>
              {s.youngWorkers.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <p className="text-sm">
                The national junior percentages are in the <Link href="/junior-pay-rates/">junior pay rates</Link> table.
              </p>
            </section>

            <section id="holidays">
              <h2 style={HEADING_FONT}>{s.code} public holidays in the 2026-27 wage year</h2>
              <p>
                {hols.length} whole-day public holidays fall between 1 July 2026 and 30 June 2027 {s.inName}.
                {stateOnly ? ` Those not on every state's list are ${stateOnly}.` : ""} Dates, part-day and regional days and
                the award rates are on the <Link href={`/public-holiday-pay/${s.slug}/`}>{s.code} public holiday pay page</Link>.
              </p>
            </section>

            <section id="payroll-tax">
              <h2 style={HEADING_FONT}>{s.code} payroll tax and long service leave</h2>
              <p>
                {pt.name} payroll tax for 2026-27 starts at {formatAUD(pt.annualThreshold)} of annual taxable wages ({pt.headlineRate}),
                administered by {pt.revenueOffice}. {pt.thresholdSummary} See the <Link href={`/payroll-tax/${s.slug}/`}>{s.code} payroll tax page</Link>.
              </p>
              <p id="lsl">
                {lsl.act}: {lsl.summary} Work out your own entitlement with the{" "}
                <Link href={`/long-service-leave-calculator/${s.slug}/`}>{s.code} long service leave calculator</Link>.
              </p>
            </section>

            <section id="regulators">
              <h2 style={HEADING_FONT}>Where to check or complain {s.inName}</h2>
              <ul>
                <li>
                  National system: <a href="https://www.fairwork.gov.au/" rel="noreferrer noopener">Fair Work Ombudsman</a> (13 13 94)
                </li>
                {s.regulators.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} rel="noreferrer noopener">{r.title}</a> ({r.publisher})
                  </li>
                ))}
              </ul>
            </section>

            <nav id="other-states" aria-label="Minimum wage in other states" className="not-prose my-8 text-sm text-warmgray">
              Other states:{" "}
              {others.map((o, i) => (
                <span key={o.slug}>
                  {i ? " · " : ""}
                  <Link href={`/minimum-wage/${o.slug}/`} title={o.uniqueAngle} className="text-eucalyptus-dark hover:underline">
                    {o.name}
                  </Link>
                </span>
              ))}
            </nav>

            <section id="faq">
              <h2 style={HEADING_FONT}>Frequently asked questions</h2>
              <FaqList faqs={faqs} />
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these figures were worked out">
                <p>
                  Rates come from the {NMW_ORDER.citation} ({NMW_ORDER.reference}); take-home uses this site&rsquo;s 2026-27 tax engine. The{" "}
                  {s.code} rules were read from {publishers} on {MW_STATE_VERIFIED_ON}. Holidays, payroll tax and long service leave come
                  from the same verified data as the dedicated pages.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={MW_STATE_VERIFIED_ON} />
              {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">{s.name} pay guides</h2>
                  <div className="space-y-3">
                    <SidebarLink href="/minimum-wage-australia/" label="Minimum Wage Australia" />
                    <SidebarLink href={`/pay-calculator-${s.slug}/`} label={`Pay Calculator ${s.code}`} />
                    <SidebarLink href={`/public-holiday-pay/${s.slug}/`} label={`${s.code} Public Holidays`} />
                    <SidebarLink href={`/payroll-tax/${s.slug}/`} label={`${s.code} Payroll Tax`} />
                    <SidebarLink href={`/long-service-leave-calculator/${s.slug}/`} label={`${s.code} Long Service Leave`} />
                    <SidebarLink href="/junior-pay-rates/" label="Minimum Wage by Age" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-bold">Earning more than the minimum?</h2>
                  <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Calculate Take-Home Pay
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
