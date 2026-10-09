// One component for the eight holiday-specific pay pages (Christmas Day,
// Boxing Day, New Year, 2027 holidays, Melbourne Cup Day, Easter, Australia
// Day, Christmas shutdown). Every page is a calculator + worked example + dates
// from the shared public holiday data; the copy lives in
// lib/data/public-holidays/seasonal-pages.ts.

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import { COMMON_LEAVE_LOADING } from "@/lib/constants/minimum-wage";
import {
  PH_HUB_PATH,
  STATE_PUBLIC_HOLIDAYS,
  formatHolidayDate,
  getAwardPublicHolidayRate,
  pctLabel,
  publicHolidayPay,
  statePath,
  statewideDays,
  yearOf,
} from "@/lib/data/public-holidays";
import { PH_NES_SOURCES } from "@/lib/data/public-holidays/hub";
import {
  entryHourlyFor,
  exampleRows,
  matrix2027,
  otherHolidays2027,
  partDays2027,
  rowLabel,
  shutdownLeave,
  shutdownLeavePay,
  topicRows,
  weekdayShortDate,
  wholeDays2027,
} from "@/lib/data/public-holidays/seasonal";
import {
  SEASONAL_PAGES,
  SEASONAL_VERIFIED_ON,
  seasonalPath,
  type SeasonalPage,
  type SeasonalSection,
  type SeasonalTopicBlock,
} from "@/lib/data/public-holidays/seasonal-pages";
import PublicHolidayPayCalculator from "@/modules/calculator/public-holiday-pay-calculator";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";
import { RegionalTable } from "./public-holiday-shared";
import FeaturedImage from "@/components/common/featured-image";

function Sections({ sections }: { sections: readonly SeasonalSection[] }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.id} id={s.id}>
          <h2 style={HEADING_FONT}>{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          {s.bullets?.length ? (
            <ul>
              {s.bullets.map((b) => (
                <li key={b.slice(0, 48)}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </>
  );
}

function TopicTable({ block }: { block: SeasonalTopicBlock }) {
  const rows = topicRows(block.topic);
  const years = Array.from(new Set(rows.flatMap((r) => r.holidays.map((h) => h.date.slice(0, 4))))).sort();
  return (
    <section id={block.id}>
      <h2 style={HEADING_FONT}>{block.heading}</h2>
      <p>{block.intro}</p>
      <TableShell caption={block.heading} minWidth={years.length > 1 ? "34rem" : "24rem"}>
        <thead className="bg-navy text-white">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              State or territory
            </th>
            {years.map((y) => (
              <th key={y} scope="col" className="px-4 py-3 font-semibold">
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/10 bg-white">
          {rows.map(({ state, holidays }) => (
            <tr key={state.slug}>
              <th scope="row" className="px-4 py-2.5 text-left font-medium text-navy">
                <Link href={statePath(state.slug)} className="text-eucalyptus-dark hover:underline">
                  {state.code}
                </Link>
              </th>
              {years.map((y) => {
                const inYear = holidays.filter((h) => h.date.startsWith(y));
                return (
                  <td key={y} className="px-4 py-2.5 text-navy">
                    {inYear.length ? (
                      inYear.map((h) => (
                        <div key={h.date + h.name} className="py-0.5">
                          <time dateTime={h.date} className="whitespace-nowrap font-medium">
                            {rowLabel(h)}
                          </time>
                          <span className="block text-xs text-warmgray">{h.name}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-warmgray-light">–</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </TableShell>
      {block.footnote ? <p className="-mt-2 text-sm text-warmgray">{block.footnote}</p> : null}
    </section>
  );
}

function Matrix2027() {
  const matrix = matrix2027();
  return (
    <>
      <section id="dates">
        <h2 style={HEADING_FONT}>2027 public holidays most workers are paid for</h2>
        <p>
          The holidays that matter on most rosters, state by state. A dash means that state has no public holiday that day. Dates in
          the table come from each state government&rsquo;s own 2027 list and agree with the Fair Work Ombudsman&rsquo;s 2027 page.
        </p>
        <TableShell caption="Public holidays 2027 by state: the main days" minWidth="52rem">
          <thead className="bg-navy text-white">
            <tr>
              <th scope="col" className="px-3 py-3 font-semibold">
                Holiday
              </th>
              {STATE_PUBLIC_HOLIDAYS.map((s) => (
                <th key={s.slug} scope="col" className="px-3 py-3 font-semibold">
                  <Link href={statePath(s.slug)} className="text-white underline-offset-2 hover:underline">
                    {s.code}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/10 bg-white">
            {matrix.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="px-3 py-2.5 text-left font-medium text-navy">
                  {row.label}
                </th>
                {STATE_PUBLIC_HOLIDAYS.map((s) => {
                  const hs = row.cells[s.slug];
                  return (
                    <td key={s.slug} className="whitespace-nowrap px-3 py-2.5 text-navy">
                      {hs.length ? (
                        hs.map((h) => (
                          <div key={h.date + h.name}>
                            <time dateTime={h.date}>{weekdayShortDate(h.date)}</time>
                          </div>
                        ))
                      ) : (
                        <span className="text-warmgray-light">–</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </TableShell>
        <p className="-mt-2 text-sm text-warmgray">
          Where a cell shows two dates, both are public holidays: for example Saturday 25 and Monday 27 December for Christmas Day.
          Tasmania, 2027: the Fair Work Ombudsman&rsquo;s list shows Saturday 25 December as well as Monday 27 December for Christmas
          Day, while WorkSafe Tasmania&rsquo;s table shows the Monday, so check your award or agreement for the Saturday.
        </p>
      </section>

      <section id="state-days">
        <h2 style={HEADING_FONT}>State-only public holidays in 2027</h2>
        <p>
          Labour Day, the King&rsquo;s Birthday and each state&rsquo;s own days are not shared, and they fall on different dates. The
          count is every whole-day holiday for that state in 2027 including the rows above. Show days and other holidays that apply
          to only part of a state are on the state pages.
        </p>
        <TableShell caption="State-only public holidays 2027" minWidth="36rem">
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-4 py-3">
                State
              </th>
              <th scope="col" className="px-4 py-3">
                Whole-day holidays
              </th>
              <th scope="col" className="px-4 py-3">
                Other 2027 holidays
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/10 bg-white">
            {STATE_PUBLIC_HOLIDAYS.map((s) => (
              <tr key={s.slug}>
                <th scope="row" className="px-4 py-2.5 text-left font-medium">
                  <Link href={statePath(s.slug)} className="text-eucalyptus-dark hover:underline">
                    {s.code}
                  </Link>
                </th>
                <td className="px-4 py-2.5 font-semibold text-navy">{wholeDays2027(s).length}</td>
                <td className="px-4 py-2.5 text-xs text-navy">
                  {otherHolidays2027(s).map((h, i) => (
                    <span key={h.date + h.name}>
                      {i > 0 ? "; " : ""}
                      <time dateTime={h.date}>{weekdayShortDate(h.date)}</time> {h.name}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </section>

      <section id="part-day">
        <h2 style={HEADING_FONT}>Part-day public holidays in 2027</h2>
        <p>
          Queensland, South Australia and the Northern Territory add evening holidays. Only the hours inside the window are paid at
          the public holiday rate.
        </p>
        <ul>
          {STATE_PUBLIC_HOLIDAYS.map((s) => {
            const parts = partDays2027(s);
            if (!parts.length) return null;
            return (
              <li key={s.slug}>
                <strong>{s.code}:</strong>{" "}
                {parts.map((h) => `${h.name} ${formatHolidayDate(h.date, false)}, ${h.hours}`).join("; ")}.
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

function ExampleTable({ page }: { page: SeasonalPage }) {
  const rows = exampleRows(page.example.awardKeys, page.example.hours);
  return (
    <>
      <TableShell caption={page.example.heading} minWidth="46rem">
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th scope="col" className="px-4 py-3">
              Award and employment
            </th>
            <th scope="col" className="px-4 py-3">
              Base rate
            </th>
            <th scope="col" className="px-4 py-3">
              Holiday rate
            </th>
            <th scope="col" className="px-4 py-3">
              Pay for {page.example.hours} hours
            </th>
            <th scope="col" className="px-4 py-3">
              Same hours, ordinary day
            </th>
            <th scope="col" className="px-4 py-3">
              Day off, not working
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/10 bg-white">
          {rows.map((r) => (
            <tr key={r.awardKey + r.employment}>
              <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
                {r.awardName}
                <span className="block text-xs font-normal text-warmgray">{r.employment === "casual" ? "Casual" : "Full-time or part-time"}</span>
              </th>
              <td className="px-4 py-3 text-navy">{formatAUD(r.baseHourly, 2)}/h</td>
              <td className="px-4 py-3 text-navy">
                {pctLabel(r.result.multiple)}
                <span className="block text-xs text-warmgray">{formatAUD(r.result.holidayHourly, 2)}/h</span>
              </td>
              <td className="px-4 py-3 font-semibold text-navy">{formatAUD(r.result.holidayPay, 2)}</td>
              <td className="px-4 py-3 text-navy">{formatAUD(r.result.ordinaryPay, 2)}</td>
              <td className="px-4 py-3 text-navy">{r.employment === "casual" ? "$0.00" : formatAUD(r.result.dayOffPay, 2)}</td>
            </tr>
          ))}
        </tbody>
      </TableShell>
      <p className="-mt-2 text-sm text-warmgray">{page.example.shiftNote}</p>
    </>
  );
}

function PartDayExample({ page }: { page: SeasonalPage }) {
  const ex = page.partDayExample;
  if (!ex) return null;
  const award = getAwardPublicHolidayRate(ex.awardKey)!;
  const base = entryHourlyFor(ex.awardKey);
  const r = publicHolidayPay({
    baseHourly: base,
    hours: ex.holidayHours,
    employment: ex.employment,
    permanentMultiple: award.permanent,
    casualMultiple: award.casual,
  });
  const ordinaryRate = ex.employment === "casual" ? base * 1.25 : base;
  return (
    <div className="my-6 rounded-xl border border-sandstone-dark/20 bg-sandstone/40 p-5">
      <h3 className="mb-2 text-lg font-bold text-navy">{ex.heading}</h3>
      <p>
        {ex.employment === "casual" ? "A casual" : "A permanent employee"} on the {award.shortName} entry rate of {formatAUD(base, 2)} an
        hour works {ex.shiftText}: {ex.ordinaryHours} {ex.ordinaryHours === 1 ? "hour" : "hours"} outside the public holiday window and{" "}
        {ex.holidayHours} hours inside it.
      </p>
      <ul>
        <li>
          {ex.holidayHours} public holiday hours at {pctLabel(r.multiple)} ({formatAUD(r.holidayHourly, 2)}/h) = <strong>{formatAUD(r.holidayPay, 2)}</strong>
        </li>
        <li>
          {ex.ordinaryHours} other {ex.ordinaryHours === 1 ? "hour" : "hours"} at a plain weekday rate of {formatAUD(ordinaryRate, 2)}/h would be{" "}
          {formatAUD(Math.round(ordinaryRate * ex.ordinaryHours * 100) / 100, 2)}. Your award may pay evening loadings on top, so check
          the rate for that time.
        </li>
      </ul>
      <p className="mb-0 text-sm text-warmgray">{ex.explanation}</p>
    </div>
  );
}

function ShutdownExample() {
  const nsw = STATE_PUBLIC_HOLIDAYS.find((s) => s.slug === "nsw")!;
  const holidays = [...statewideDays(yearOf(nsw, 2026)!), ...statewideDays(yearOf(nsw, 2027)!)].map((h) => h.date);
  const start = "2026-12-28";
  const end = "2027-01-08";
  const hoursPerDay = 7.6;
  const leave = shutdownLeave({ start, end, publicHolidays: holidays, hoursPerDay });
  const naive = shutdownLeave({ start, end, publicHolidays: [], hoursPerDay });
  const base = entryHourlyFor("hospitality");
  const pay = shutdownLeavePay(leave.leaveHours, base, COMMON_LEAVE_LOADING);
  const inWindow = holidays.filter((d) => d >= start && d <= end);
  return (
    <>
      <TableShell caption="Shutdown leave worked example" minWidth="28rem">
        <tbody className="divide-y divide-sandstone-dark/10 bg-white">
          <tr>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              Shutdown
            </th>
            <td className="px-4 py-3 text-navy">
              {formatHolidayDate(start)} to {formatHolidayDate(end)} ({leave.calendarDays} calendar days)
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              Normal working days (Monday to Friday)
            </th>
            <td className="px-4 py-3 text-navy">{leave.workingDays}</td>
          </tr>
          <tr>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              Public holidays on those days
            </th>
            <td className="px-4 py-3 text-navy">
              {leave.publicHolidayDays} ({inWindow.map((d) => weekdayShortDate(d)).join(" and ")})
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              Annual leave days used
            </th>
            <td className="px-4 py-3 font-semibold text-navy">
              {leave.leaveDays} (not {naive.leaveDays})
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              Annual leave hours at {hoursPerDay} hours a day
            </th>
            <td className="px-4 py-3 text-navy">{leave.leaveHours}</td>
          </tr>
          <tr>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              Leave pay at the Hospitality Award entry rate ({formatAUD(base, 2)}/h)
            </th>
            <td className="px-4 py-3 text-navy">{formatAUD(pay.base, 2)}</td>
          </tr>
          <tr>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              Plus {pctLabel(COMMON_LEAVE_LOADING)} leave loading (Hospitality Award cl 30.3)
            </th>
            <td className="px-4 py-3 text-navy">{formatAUD(pay.loading, 2)}</td>
          </tr>
          <tr>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              Annual leave pay for the shutdown
            </th>
            <td className="px-4 py-3 font-semibold text-navy">{formatAUD(pay.total, 2)}</td>
          </tr>
        </tbody>
      </TableShell>
      <p className="-mt-2 text-sm text-warmgray">
        Before tax. The two public holidays are paid separately as public holidays at your ordinary base rate for the day and are not taken
        out of the leave balance. Whether a leave loading applies, and how it is worked out, depends on your award: see the{" "}
        <Link href="/leave-loading-calculator/">leave loading calculator</Link>.
      </p>
    </>
  );
}

export default function SeasonalHolidayPage({ page }: { page: SeasonalPage }) {
  const authorship = getGuideAuthorship(page.guideKey);
  const preset = page.calculator;
  const presetAward = getAwardPublicHolidayRate(preset.awardKey)!;
  const hasDates = page.topics.length > 0 || page.matrix2027;
  const stateSources = hasDates ? STATE_PUBLIC_HOLIDAYS.map((s) => s.sources[0]) : [];
  const otherGuides = SEASONAL_PAGES.filter((p) => p.slug !== page.slug);
  const chips: [string, string][] = [
    ...(hasDates ? ([["#dates", "Dates"]] as [string, string][]) : []),
    ...(page.vicRegional ? ([["#regional", "Regional Victoria"]] as [string, string][]) : []),
    ["#calculator", "Calculator"],
    ["#example", "Worked example"],
    ["#faq", "FAQ"],
  ];

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: PH_HUB_PATH, label: "Public Holiday Pay" },
            { label: page.shortName },
          ]}
        />

        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {page.h1}
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">{page.standfirst}</p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> {page.directAnswer}
            </p>
          </div>
          <TrustBar className="!max-w-none" />
          <FeaturedImage lazy className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <nav aria-label="On this page" className="not-prose mb-8 flex flex-wrap gap-2 text-sm">
              {chips.map(([href, label]) => (
                <a key={href} href={href} className="rounded-full border border-sandstone-dark/30 px-3 py-1 text-navy hover:border-eucalyptus hover:text-eucalyptus-dark">
                  {label}
                </a>
              ))}
            </nav>

            {page.matrix2027 ? <Matrix2027 /> : null}
            {page.topics.map((t) => (
              <TopicTable key={t.id} block={t} />
            ))}

            {page.vicRegional
              ? (() => {
                  const vic = STATE_PUBLIC_HOLIDAYS.find((s) => s.slug === "vic")!;
                  const table = vic.regional[0];
                  return (
                    <section id="regional">
                      <h2 style={HEADING_FONT}>{table.title}</h2>
                      <p>{table.intro}</p>
                      <RegionalTable table={table} />
                    </section>
                  );
                })()
              : null}

            <Sections sections={page.sectionsBeforeCalculator} />

            <section id="calculator" className="not-prose my-12">
              <PublicHolidayPayCalculator
                holidayName={preset.holidayName}
                stateCode={preset.stateCode}
                awardKey={preset.awardKey}
                employment={preset.employment}
                hours={preset.hours}
                partDayNote={preset.partDayNote}
              />
              <p className="mt-3 text-sm text-warmgray">
                Prefilled for a {preset.employment === "casual" ? "casual" : "permanent"} employee under the {presetAward.shortName}. Change
                the award, rate and hours to match your payslip.
              </p>
            </section>

            <section id="example">
              <h2 style={HEADING_FONT}>{page.example.heading}</h2>
              <p>{page.example.intro}</p>
              {page.shutdownExample ? <ShutdownExample /> : <ExampleTable page={page} />}
              <PartDayExample page={page} />
            </section>

            <Sections sections={page.sectionsAfterCalculator} />

            <section id="more-guides">
              <h2 style={HEADING_FONT}>More holiday pay guides</h2>
              <p>
                Every public holiday is paid by the same rules, but the dates, extra days and part-day windows differ. The{" "}
                <Link href={PH_HUB_PATH}>public holiday pay guide</Link> has the full 14-award rate table, and each state page lists that
                state&rsquo;s own days.
              </p>
              <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {page.related.map((l) => (
                  <SidebarLink key={l.href} href={l.href} label={l.label} />
                ))}
                {otherGuides
                  .filter((p) => !page.related.some((l) => l.href === seasonalPath(p.slug)))
                  .slice(0, 4)
                  .map((p) => (
                    <SidebarLink key={p.slug} href={seasonalPath(p.slug)} label={p.shortName} />
                  ))}
                <SidebarLink href="/understanding-your-payslip/" label="Understanding your payslip" />
                <SidebarLink href="/take-home-pay-calculator/" label="Take-home pay calculator" />
              </div>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>{page.shortName} questions</h2>
              <FaqList faqs={[...page.faqs]} />
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                {hasDates ? (
                  <p>
                    Every date was read from the relevant state or territory government&rsquo;s own public holidays page on 24 September
                    2026 and checked against the Fair Work Ombudsman&rsquo;s 2026 and 2027 public holiday lists on {SEASONAL_VERIFIED_ON}.
                    Each date is stored with the text the government prints, and automated tests check the day, month and weekday.
                  </p>
                ) : (
                  <p>
                    The shutdown and annual leave rules come from the Fair Work Ombudsman&rsquo;s pages on directing an employee to take
                    annual leave during a shutdown and on the end-of-year holiday season, read on {SEASONAL_VERIFIED_ON}, and from the Fair
                    Work Act 2009.
                  </p>
                )}
                <p>
                  Public holiday pay rates are read from the site&rsquo;s award constants (Fair Work Commission award texts, rates from the
                  first full pay period on or after 1 July 2026). Rights when not working come from the Fair Work Ombudsman and the Fair Work
                  Act 2009 ss 114–116. Check your own award or enterprise agreement before relying on a figure.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={[...page.sources, ...stateSources, ...PH_NES_SOURCES]} lastVerified={SEASONAL_VERIFIED_ON} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Holiday pay guides</h3>
                  <div className="space-y-3">
                    {otherGuides.map((p) => (
                      <SidebarLink key={p.slug} href={seasonalPath(p.slug)} label={p.shortName} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Related</h3>
                  <div className="space-y-3">
                    <SidebarLink href={PH_HUB_PATH} label="Public Holiday Pay Guide" />
                    <SidebarLink href="/overtime-penalty-rates-guide/" label="Penalty Rates Guide" />
                    <SidebarLink href="/annual-leave-guide/" label="Annual Leave Guide" />
                    <SidebarLink href="/award-rates/" label="Award Rates" />
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
