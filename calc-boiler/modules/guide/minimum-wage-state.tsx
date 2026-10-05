// /minimum-wage/{state}/ — one page per state or territory (F1, Oct 2026).
// The national rate is identical everywhere, so each page leads with the answer
// and the take-home calculator, then carries the state-specific rules: which
// workers are in the state system, any state wage case, public holidays, payroll
// tax and long service leave. Every figure comes from lib/data/minimum-wage-state.

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { EMPLOYMENT, SOURCES, formatAUD } from "@/lib/constants";
import { JUNIOR_RATES, NMW_ORDER } from "@/lib/constants/junior-rates";
import { NMW } from "@/lib/constants/minimum-wage";
import { formatHolidayDate } from "@/lib/data/public-holidays";
import {
  MW_STATES,
  MW_STATE_SLUGS,
  MW_STATE_VERIFIED_ON,
  NMW_SOURCE,
  fullTimeAdultTakeHome,
  holidaysInMinimumWageYear,
  lslData,
  minimumWageHeadcountAtThreshold,
  mwStateFaqs,
  mwStateH1,
  payrollData,
  publicHolidayData,
  type MwStateInfo,
} from "@/lib/data/minimum-wage-state";
import MinimumWageStateCalculator from "@/modules/calculator/minimum-wage-state-calculator";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";

const m = (v: number) => formatAUD(v, 2);

const KIND_LABEL: Record<string, string> = {
  statewide: "",
  additional: " (additional day)",
};

export default function MinimumWageStatePage({ state: s }: { state: MwStateInfo }) {
  const t = fullTimeAdultTakeHome(s.slug);
  const hols = holidaysInMinimumWageYear(s.slug);
  const lsl = lslData(s.slug);
  const pt = payrollData(s.slug);
  const faqs = mwStateFaqs(s);
  const authorship = getGuideAuthorship("minimum-wage");
  const others = MW_STATE_SLUGS.filter((x) => x !== s.slug).map((x) => MW_STATES[x]);
  const dayPay = t.publicHolidayDayPay;

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
              <strong>{m(NMW.casualHourly)}</strong> an hour.{" "}
              {s.slug === "wa"
                ? "Employees of sole traders, partnerships and other non-corporate employers in the WA state system have their own State Minimum Wage of $26.27 an hour."
                : s.slug === "qld"
                  ? "Queensland state-system employees have a Queensland minimum wage of $1,004.90 a week from 1 September 2026."
                  : `There is no separate ${s.name} minimum wage.`}
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <nav aria-label="On this page" className="not-prose mb-8 flex flex-wrap gap-2 text-sm">
              {[
                ["#calculator", "Calculator"],
                ["#rate", "The rate"],
                ["#state-system", "State rules"],
                ["#young-workers", "Under 21s and apprentices"],
                ["#holidays", "Public holidays"],
                ["#payroll-tax", "Payroll tax"],
                ["#lsl", "Long service leave"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="rounded-full border border-sandstone-dark/30 px-3 py-1 text-navy hover:border-eucalyptus hover:text-eucalyptus-dark">
                  {label}
                </a>
              ))}
            </nav>

            <MinimumWageStateCalculator state={s.slug} stateName={s.name} />

            <section id="rate">
              <h2 style={HEADING_FONT}>The minimum wage rate {s.inName}</h2>
              <p>
                The Fair Work Commission set the National Minimum Wage in the Annual Wage Review 2026, and it applies to employees in the
                national system from the first full pay period starting on or after 1 July 2026. That is the same figure in every state. For
                the full rate history, junior table and what the award floors are, see{" "}
                <Link href="/minimum-wage-australia/">minimum wage in Australia</Link>.
              </p>
              <TableShell caption={`Minimum wage ${s.inName} from 1 July 2026`} minWidth="26rem">
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th scope="col" className="px-5 py-4">Period</th>
                    <th scope="col" className="px-5 py-4">Before tax</th>
                    <th scope="col" className="px-5 py-4">After tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                  <tr><th scope="row" className="px-5 py-3 text-left font-medium text-navy">Hourly</th><td className="px-5 py-3">{m(NMW.hourly)}</td><td className="px-5 py-3">&mdash;</td></tr>
                  <tr><th scope="row" className="px-5 py-3 text-left font-medium text-navy">Weekly ({EMPLOYMENT.standardWeeklyHours} hours)</th><td className="px-5 py-3">{m(NMW.weekly)}</td><td className="px-5 py-3">{m(t.weeklyNet)}</td></tr>
                  <tr><th scope="row" className="px-5 py-3 text-left font-medium text-navy">Fortnightly</th><td className="px-5 py-3">{m(NMW.fortnightly)}</td><td className="px-5 py-3">{m(t.fortnightlyNet)}</td></tr>
                  <tr><th scope="row" className="px-5 py-3 text-left font-medium text-navy">Annual (52 weeks)</th><td className="px-5 py-3">{m(NMW.annual)}</td><td className="px-5 py-3">{formatAUD(t.annualNet)}</td></tr>
                  <tr className="bg-eucalyptus/5"><th scope="row" className="px-5 py-3 text-left font-medium text-navy">Casual hourly (+25%)</th><td className="px-5 py-3">{m(NMW.casualHourly)}</td><td className="px-5 py-3">&mdash;</td></tr>
                </tbody>
              </TableShell>
              <p className="text-sm">
                After-tax figures use the 2026-27 resident tax rates and the Medicare levy for a full-time adult, with the tax-free threshold
                claimed and no HECS-HELP debt. Income tax is set by the Commonwealth, so the take-home figure is identical in every state. Your
                employer also pays about {formatAUD(t.superAnnual)} a year in super on top. Run your own hours through the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
              </p>
            </section>

            <section id="state-system">
              <h2 style={HEADING_FONT}>{s.stateWageHeading}</h2>
              <p>{s.systemSummary}</p>
              <p>
                <strong>Fair Work Ombudsman:</strong> &ldquo;{s.systemFwo}&rdquo;
              </p>
              {s.stateWage.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <p>
                Most people are paid above the minimum anyway, under a modern award. Check{" "}
                <Link href="/award-rates/">your award&rsquo;s rates</Link> or the{" "}
                <Link href="/job-pay-rates/">pay rates by job</Link>, which apply the same way {s.inName}.
              </p>
            </section>

            <section id="young-workers">
              <h2 style={HEADING_FONT}>Under-21s and apprentices {s.inName}</h2>
              {s.youngWorkers.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <TableShell caption="National Minimum Wage junior rates from 1 July 2026" minWidth="24rem">
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th scope="col" className="px-5 py-4">Age</th>
                    <th scope="col" className="px-5 py-4">% of adult</th>
                    <th scope="col" className="px-5 py-4">Hourly</th>
                    <th scope="col" className="px-5 py-4">Casual hourly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                  {JUNIOR_RATES.map((r) => (
                    <tr key={r.age}>
                      <th scope="row" className="px-5 py-3 text-left font-medium text-navy">{r.age}</th>
                      <td className="px-5 py-3">{(r.percentage * 100).toFixed(1)}%</td>
                      <td className="px-5 py-3">{m(r.hourly)}</td>
                      <td className="px-5 py-3">{m(r.casualHourly)}</td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
              <p className="text-sm">
                These percentages apply only to employees with no award or agreement (National Minimum Wage Order 2026, cl 8.2). Awards set
                their own junior scales; see{" "}
                <Link href="/junior-pay-rates/">minimum wage by age</Link>, or go to a{" "}
                <Link href="/minimum-wage-by-age/16/">16</Link>, <Link href="/minimum-wage-by-age/17/">17</Link> or{" "}
                <Link href="/minimum-wage-by-age/18/">18 year old</Link>. Apprentice rates are covered in{" "}
                <Link href="/job-pay-rates/apprentice-electrician/">apprentice electrician pay</Link>.
              </p>
            </section>

            <section id="holidays">
              <h2 style={HEADING_FONT}>{s.code} public holidays in the 2026-27 minimum wage year</h2>
              <p>
                {hols.length} whole-day public holidays fall between 1 July 2026 and 30 June 2027 {s.inName}. A full-time or part-time
                employee who has the day off on a day they would normally work is paid their base rate for those hours: at the minimum wage
                and a standard {EMPLOYMENT.standardWeeklyHours}-hour week that is about {m(dayPay)} for the day. If you work the day, your
                award sets the penalty rate. Dates are from the state government&rsquo;s own list; the{" "}
                <Link href={`/public-holiday-pay/${s.slug}/`}>{s.code} public holiday pay page</Link> has 2026 and 2027 in full, plus part-day
                and regional holidays.
              </p>
              <TableShell caption={`${s.code} public holidays 1 July 2026 to 30 June 2027`} minWidth="22rem">
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th scope="col" className="px-5 py-4">Date</th>
                    <th scope="col" className="px-5 py-4">Holiday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                  {hols.map((h) => (
                    <tr key={`${h.date}-${h.name}`}>
                      <td className="px-5 py-3 font-medium text-navy">{formatHolidayDate(h.date)}</td>
                      <td className="px-5 py-3">{h.name}{KIND_LABEL[h.kind] ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
              <p className="text-sm">
                The list shows whole-day, state-wide holidays only. Check the pay page for any regional or part-day holidays that apply to
                your workplace.
              </p>
            </section>

            <section id="payroll-tax">
              <h2 style={HEADING_FONT}>Payroll tax {s.inName}: when employing minimum-wage staff triggers it</h2>
              <p>
                {pt.name} payroll tax for 2026-27 starts at {formatAUD(pt.annualThreshold)} of annual taxable wages, with a headline rate of{" "}
                {pt.headlineRate}, administered by {pt.revenueOffice}. {pt.thresholdSummary}
              </p>
              <p>
                On wages alone, {formatAUD(pt.annualThreshold)} is about {minimumWageHeadcountAtThreshold(s.slug)} full-time adult employees on
                the minimum wage ({formatAUD(NMW.annual)} each). That is our own arithmetic: super and other taxable wages also count, and
                groups and interstate apportionment change the test, so a real business reaches the threshold sooner. Use the{" "}
                <Link href={`/payroll-tax/${s.slug}/`}>{s.code} payroll tax page</Link> or the{" "}
                <Link href="/payroll-tax-calculator/">payroll tax calculator</Link> for a proper estimate, and the{" "}
                <Link href="/employer-cost-calculator/">employer cost calculator</Link> for the full cost of a worker.
              </p>
            </section>

            <section id="lsl">
              <h2 style={HEADING_FONT}>Long service leave {s.inName} on the minimum wage</h2>
              <p>
                Under the {lsl.act}, {lsl.takeAfterYears} years of continuous service qualifies you to take {lsl.weeksAtQualifying} weeks of leave.{" "}
                {lsl.summary} At the full-time minimum wage ({m(NMW.weekly)} a week) {lsl.weeksAtQualifying} weeks is worth about{" "}
                {formatAUD(lsl.weeksAtQualifying * NMW.weekly)}. {lsl.casualsNote} Work out your own entitlement with the{" "}
                <Link href={`/long-service-leave-calculator/${s.slug}/`}>{s.code} long service leave calculator</Link>.
              </p>
            </section>

            <section id="regulators">
              <h2 style={HEADING_FONT}>Where to check or complain {s.inName}</h2>
              <p>
                National-system employees can ask the{" "}
                <a href="https://www.fairwork.gov.au/" rel="noreferrer noopener">Fair Work Ombudsman</a> (13 13 94). For the state-system and
                state-run matters on this page:
              </p>
              <ul>
                {s.regulators.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} rel="noreferrer noopener">{r.title}</a> ({r.publisher})
                  </li>
                ))}
              </ul>
            </section>

            <section id="other-states">
              <h2 style={HEADING_FONT}>Minimum wage in other states</h2>
              <p>The national rate is the same, but the state rules differ:</p>
              <ul>
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/minimum-wage/${o.slug}/`}>Minimum wage in {o.name}</Link>: {o.uniqueAngle}.
                  </li>
                ))}
              </ul>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>Frequently asked questions</h2>
              <FaqList faqs={faqs} />
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these figures were worked out">
                <p>
                  The National Minimum Wage, casual loading and junior percentages come from the {NMW_ORDER.citation} ({NMW_ORDER.reference}) and are
                  held by automated tests. After-tax figures use this site&rsquo;s 2026-27 tax engine. Which employees are in the state system comes from the
                  Fair Work Ombudsman&rsquo;s Fair Work system page. State wage figures were read from the tribunal decisions linked above.
                  Public holidays, payroll tax and long service leave are read from the same verified data as the dedicated pages. Verified{" "}
                  {MW_STATE_VERIFIED_ON}.
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
                  <h2 className="mb-2 text-lg font-bold">Earning more than the minimum?</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">Put your own hourly rate or salary through the calculator.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Calculate Take-Home Pay
                  </Link>
                </CardContent>
              </Card>
              <p className="flex items-center gap-1 text-xs text-warmgray-light">
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                Verified {MW_STATE_VERIFIED_ON}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
