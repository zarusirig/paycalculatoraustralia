"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import {
  EMPLOYERS,
  annualFullTime,
  entryRate,
  formatPct,
  hourlyToSalaryLink,
  juniorRates,
  takeHomeHrefForHourly,
  topRate,
  weeklyExamples,
  type EmployerPay,
  type PenaltyRow,
} from "@/lib/data/employer-pay";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const money = (v: number) => formatAUD(v, 2);

function PenaltyTable({ rows, caption }: { rows: PenaltyRow[]; caption: string }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full min-w-[34rem] text-left text-sm text-warmgray">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th scope="col" className="px-5 py-3">When</th>
            <th scope="col" className="px-5 py-3">Full-time &amp; part-time</th>
            <th scope="col" className="px-5 py-3">Casual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {rows.map((row) => (
            <tr key={row.when}>
              <th scope="row" className="px-5 py-3 text-left font-medium text-navy">
                {row.when}
                {row.note && <span className="mt-1 block text-xs font-normal text-warmgray">{row.note}</span>}
              </th>
              <td className="px-5 py-3">{row.permanent}</td>
              <td className="px-5 py-3">{row.casual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EmployerPayRatesPage({ employer }: { employer: EmployerPay }) {
  const e = employer;
  const entry = entryRate(e);
  const top = topRate(e);
  const juniors = juniorRates(e);
  const anyDerivedJunior = juniors.some((j) => !j.published);
  const examples = weeklyExamples(e);
  const takeHome = takeHomeHrefForHourly(entry.hourly);
  const hourlyLink = hourlyToSalaryLink(entry.hourly);
  const loading = formatPct(e.casualLoading);
  const isAward = e.instrument.kind === "modern-award";
  const authorship = getGuideAuthorship("pay-rates");
  const others = EMPLOYERS.filter((o) => o.slug !== e.slug);

  const sourceLinks: SourceLink[] = e.sources.map((s) => ({
    title: s.title,
    url: s.url,
    publisher: s.publisher,
  }));

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/pay-rates/" className="hover:text-eucalyptus-dark hover:underline">Pay Rates by Employer</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{e.name} Pay Rates</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl lg:mb-16">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {e.name} Pay Rates 2026 — Hourly Wage by Age &amp; Level
          </h1>
          <p className="mb-4 text-xl leading-relaxed text-warmgray">
            An adult {e.name} employee at {entry.level} is paid{" "}
            <strong className="text-navy">{money(entry.hourly)} an hour</strong> as a full-time or
            part-time worker, or <strong className="text-navy">{money(entry.casualHourly)}</strong>{" "}
            as a casual, under the {e.instrument.title}. Those rates apply from {e.ratesEffectiveFrom}.
            Weekend, evening and public holiday work is paid at the penalty rates below.
          </p>
          <p className="mb-6 text-sm text-warmgray">
            Pay Calculator Australia is independent and not affiliated with, endorsed by or sponsored
            by {e.name}. Rates are read from the public {isAward ? "modern award" : "enterprise agreement"} on
            the Fair Work {isAward ? "Ombudsman" : "Commission"} website, verified {e.verifiedOn}.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            {e.notices.length > 0 && (
              <div className="not-prose mb-8 space-y-3">
                {e.notices.map((notice) => (
                  <div key={notice} className="flex gap-3 rounded-lg border border-sandstone-dark/30 bg-sandstone/50 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" />
                    <p className="text-sm text-navy">{notice}</p>
                  </div>
                ))}
              </div>
            )}

            <section id="agreement">
              <h2 style={HEADING_FONT}>
                Which {isAward ? "award" : "agreement"} sets {e.name} pay
              </h2>
              <p>
                {e.name} {e.industry} staff are paid under the{" "}
                <a href={e.instrument.url} target="_blank" rel="noreferrer noopener">
                  {e.instrument.title}
                </a>{" "}
                ({e.instrument.reference}). {e.instrument.coverage}
              </p>
              {!isAward && (
                <ul>
                  {e.instrument.approvedOn && <li>Approved by the Fair Work Commission: {e.instrument.approvedOn}</li>}
                  {e.instrument.nominalExpiry && <li>Nominal expiry date: {e.instrument.nominalExpiry}</li>}
                  <li>Employer: {e.employerEntity}</li>
                </ul>
              )}
              {isAward && <p>Employer: {e.employerEntity}</p>}
              {e.nextIncrease && (
                <p>
                  <strong>Next scheduled increase:</strong> {e.nextIncrease.date}. {e.nextIncrease.detail}
                </p>
              )}
              {e.awardHref && e.awardLabel && (
                <p>
                  For the underlying award minimums across every employer in the industry, see{" "}
                  <Link href={e.awardHref}>{e.awardLabel}</Link>.
                </p>
              )}
            </section>

            <section id="hourly-rates">
              <h2 style={HEADING_FONT}>{e.name} hourly pay rates by level (adults)</h2>
              <p>
                Base hourly rates before tax for adult employees. Casual rates include the {loading}{" "}
                casual loading, paid instead of leave entitlements.
              </p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full min-w-[36rem] text-left text-sm text-warmgray">
                  <caption className="sr-only">{e.name} adult hourly rates by classification</caption>
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-5 py-3">Level</th>
                      <th scope="col" className="px-5 py-3 text-right">Full-time &amp; part-time</th>
                      <th scope="col" className="px-5 py-3 text-right">Casual (incl. {loading})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {e.rates.map((row) => (
                      <tr key={row.level}>
                        <th scope="row" className="px-5 py-3 text-left font-medium text-navy">
                          {row.level}
                          <span className="mt-1 block text-xs font-normal text-warmgray">{row.description}</span>
                        </th>
                        <td className="px-5 py-3 text-right font-medium text-navy">{money(row.hourly)}</td>
                        <td className="px-5 py-3 text-right">{money(row.casualHourly)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {juniors.length > 0 && (
              <section id="junior-rates">
                <h2 style={HEADING_FONT}>{e.name} pay rates by age (junior rates)</h2>
                <p>
                  Junior employees are paid a set percentage of the adult {entry.level} rate for their age. {e.juniorNote}
                </p>
                <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[32rem] text-left text-sm text-warmgray">
                    <caption className="sr-only">{e.name} junior hourly rates by age</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-3">Age</th>
                        <th scope="col" className="px-5 py-3 text-right">% of adult</th>
                        <th scope="col" className="px-5 py-3 text-right">Full-time &amp; part-time</th>
                        <th scope="col" className="px-5 py-3 text-right">Casual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {juniors.map((j) => (
                        <tr key={j.age}>
                          <th scope="row" className="px-5 py-3 text-left font-medium text-navy">{j.age}</th>
                          <td className="px-5 py-3 text-right">{formatPct(j.percentage)}</td>
                          <td className="px-5 py-3 text-right font-medium text-navy">{money(j.hourly)}</td>
                          <td className="px-5 py-3 text-right">{money(j.casualHourly)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {anyDerivedJunior && (
                  <p className="text-sm">
                    The percentages are the instrument&rsquo;s own. The dollar figures are our
                    arithmetic — the percentage applied to the adult {entry.level} rate, rounded to
                    the cent — because the instrument does not print junior dollars. Your payslip
                    may differ by a cent.
                  </p>
                )}
                <p>
                  For how junior rates work across every award, and when you move to the adult rate,
                  see <Link href="/junior-pay-rates/">junior pay rates in Australia</Link>.
                </p>
              </section>
            )}

            <section id="penalty-rates">
              <h2 style={HEADING_FONT}>{e.name} penalty rates: evenings, weekends and public holidays</h2>
              <p>
                Penalty rates are a percentage of the base hourly rate for your level (or, where
                stated, a flat amount per hour) for hours worked at the times below.
              </p>
              <PenaltyTable rows={e.penalties} caption={`${e.name} penalty rates`} />
              {e.penaltyNotes.length > 0 && (
                <ul>
                  {e.penaltyNotes.map((n) => <li key={n}>{n}</li>)}
                </ul>
              )}
              {e.overtime.length > 0 && (
                <>
                  <h3 style={HEADING_FONT}>Overtime</h3>
                  <PenaltyTable rows={e.overtime} caption={`${e.name} overtime rates`} />
                </>
              )}
              <p>
                To price a mix of weekday, weekend and overtime hours, use the{" "}
                <Link href="/overtime-pay-calculator/">overtime and penalty rate calculator</Link>.
              </p>
            </section>

            <section id="weekly-pay">
              <h2 style={HEADING_FONT}>How much {e.name} pays a week</h2>
              <p>
                Gross weekly pay for an adult at {entry.level}, with every hour at the ordinary
                weekday rate. Weekend and evening shifts push these figures up; tax comes off them.
              </p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full min-w-[30rem] text-left text-sm text-warmgray">
                  <caption className="sr-only">{e.name} weekly gross pay examples</caption>
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-5 py-3">Hours a week</th>
                      <th scope="col" className="px-5 py-3 text-right">Part-time / full-time</th>
                      <th scope="col" className="px-5 py-3 text-right">Casual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {examples.map((x) => (
                      <tr key={x.hours}>
                        <th scope="row" className="px-5 py-3 text-left font-medium text-navy">{x.hours} hours</th>
                        <td className="px-5 py-3 text-right font-medium text-navy">{money(x.permanentWeekly)}</td>
                        <td className="px-5 py-3 text-right">{money(x.casualWeekly)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                A full-time year (38 hours × 52 weeks) at {money(entry.hourly)} is{" "}
                {formatAUD(annualFullTime(entry.hourly))} before tax. See{" "}
                <Link href={takeHome.href}>take-home pay on {formatAUD(takeHome.amount)}</Link>{" "}
                (the nearest salary we publish) and{" "}
                <Link href={hourlyLink.href}>
                  {money(hourlyLink.rate)} an hour as a yearly salary
                </Link>
                {hourlyLink.exact ? "" : " (the nearest hourly rate we publish)"}.
              </p>
              <div className="not-prose my-8 flex flex-wrap gap-3">
                <Link
                  href="/weekly-pay-calculator/"
                  className="inline-flex items-center gap-2 rounded-lg bg-eucalyptus-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-navy"
                >
                  <Calculator className="h-5 w-5" />
                  Work out your {e.name} take-home pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="text-sm">
                Enter your hourly rate and hours in the weekly pay calculator to see tax withheld and
                what lands in your account. Casual or part-time with a second job? Check the{" "}
                <Link href="/second-job-tax-calculator/">second job tax calculator</Link>.
              </p>
            </section>

            {e.unverified.length > 0 && (
              <section id="not-shown">
                <h2 style={HEADING_FONT}>What this page does not show</h2>
                <p>We publish only what we could read from a primary source. Left off rather than estimated:</p>
                <ul>
                  {e.unverified.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            )}

            {e.faqs.length > 0 && (
              <section id="faq">
                <h2 style={HEADING_FONT}>{e.name} pay questions</h2>
                <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                  {e.faqs.map((faq, index) => (
                    <AccordionItem key={faq.q} value={`faq-${index}`} className="rounded-lg border bg-white px-4">
                      <AccordionTrigger className="text-left font-semibold text-navy">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            <section id="other-employers">
              <h2 style={HEADING_FONT}>Pay rates at other employers</h2>
              <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/pay-rates/${o.slug}/`}
                    className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-4 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
                  >
                    <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{o.name} pay rates</span>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                  </Link>
                ))}
              </div>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Every rate on this page was read from the {e.instrument.title} ({e.instrument.reference})
                  {isAward ? " and the Fair Work Ombudsman pay guide" : " as lodged with the Fair Work Commission"} on{" "}
                  {e.verifiedOn}. Nothing is estimated or averaged. Junior dollar figures the instrument
                  does not print are calculated from its own percentages and labelled as such.
                </p>
                <p>
                  Rates change on dates written into the {isAward ? "award (usually 1 July each year)" : "agreement"},
                  and a new agreement can replace this one. Re-check against your payslip and the
                  instrument itself; the Fair Work Ombudsman (13 13 94) can confirm what applies to you.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sourceLinks} lastVerified={e.verifiedOn} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">{e.name} pay at a glance</h3>
                  <dl className="space-y-3 text-sm">
                    <Row label={`Adult ${entry.level}`} value={`${money(entry.hourly)}/hr`} />
                    <Row label="Adult casual" value={`${money(entry.casualHourly)}/hr`} />
                    {top.level !== entry.level && <Row label={`Top: ${top.level}`} value={`${money(top.hourly)}/hr`} />}
                    <Row label="Casual loading" value={loading} />
                    <Row label="Rates from" value={e.ratesEffectiveFrom} />
                    <Row label="Verified" value={e.verifiedOn} />
                  </dl>
                </CardContent>
              </Card>

              {e.unverified.length > 0 && (
                <Card className="border-sandstone-dark/30 bg-white">
                  <CardContent className="flex gap-3 p-6">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" />
                    <p className="text-sm text-warmgray">
                      Some classifications are not shown because we could not read them from a
                      primary source. See &ldquo;What this page does not show&rdquo;.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Related calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/weekly-pay-calculator/" label="Weekly Pay Calculator" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime & Penalty Rate Calculator" />
                    <SidebarLink href={takeHome.href} label={`Take-Home Pay on ${formatAUD(takeHome.amount)}`} />
                    <SidebarLink href="/junior-pay-rates/" label="Junior Pay Rates" />
                    {e.awardHref && e.awardLabel && <SidebarLink href={e.awardHref} label={e.awardLabel} />}
                    <SidebarLink href="/pay-rates/" label="Pay Rates by Employer" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold">Check your {e.name} payslip</h3>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    Enter your hourly rate and hours to see the gross, tax and net your payslip should show.
                  </p>
                  <Link
                    href="/weekly-pay-calculator/"
                    className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50"
                  >
                    Calculate weekly pay
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-warmgray">{label}</dt>
      <dd className="text-right font-semibold text-navy">{value}</dd>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
    >
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}
