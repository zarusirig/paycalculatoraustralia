// =============================================================================
// /pay-and-tax-changes-calendar/: what changes and when, 1 Jul 2026 to 1 Jul 2027.
// Every date and figure is read from lib/constants/pay-tax-changes-calendar.ts
// (which reads the site's verified constants); the same module produces the
// .ics download, so page and file cannot disagree.
// =============================================================================

import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarPlus, ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import FaqAccordion from "@/components/common/faq-accordion";
import { getGuideAuthorship } from "@/lib/authors";
import { JUNIOR_TRANSITION_SCHEDULES } from "@/lib/constants/junior-rates";
import {
  CHANGES_CALENDAR,
  CHANGES_SOURCES,
  CHANGE_DATES,
  CUT_SALARIES,
  changesCitation,
  changesCitationHtml,
  type ChangeStatus,
} from "@/lib/constants/pay-tax-changes-calendar";
import { takeHomeRows } from "@/lib/data/pay-report";
import CopySnippet from "@/modules/guide/copy-snippet";
import { CHANGES_CALENDAR_FAQS } from "./pay-and-tax-changes-calendar-faqs";
import FeaturedImage from "@/components/common/featured-image";

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const td = "px-3 py-2";
const aud = (n: number) => `$${n.toLocaleString("en-AU")}`;
const signed = (n: number) => (n > 0 ? `+${aud(n)}` : aud(n));

export const CHANGES_SOURCE_LINKS: SourceLink[] = CHANGES_SOURCES.map((s) => ({ ...s }));

const STATUS: Record<ChangeStatus, { label: string; cls: string }> = {
  "in-force": { label: "Already in force", cls: "bg-eucalyptus-light text-eucalyptus-dark" },
  upcoming: { label: "Upcoming", cls: "bg-sandstone text-navy" },
  "none-verified": { label: "No change found", cls: "bg-white text-warmgray border border-sandstone-dark/30" },
};

function Table({ caption, head, children, minWidth = 520 }: { caption: string; head: string[]; children: ReactNode; minWidth?: number }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-left text-sm text-navy" style={{ minWidth }}>
        <caption className="caption-top bg-white px-3 pt-3 pb-1 text-left text-xs font-semibold uppercase tracking-wide text-warmgray">{caption}</caption>
        <thead className="bg-sandstone font-semibold">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-3 py-2.5">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white tabular-nums">{children}</tbody>
      </table>
    </div>
  );
}

export default function PayAndTaxChangesCalendar() {
  const authorship = getGuideAuthorship(CHANGES_CALENDAR.slug);
  const rows = takeHomeRows(CUT_SALARIES);
  const retail = JUNIOR_TRANSITION_SCHEDULES.retail;
  const fastFood = JUNIOR_TRANSITION_SCHEDULES.fastFood;
  const pharmacy = JUNIOR_TRANSITION_SCHEDULES.pharmacy;

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{CHANGES_CALENDAR.title}</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl lg:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-eucalyptus-dark">Dated reference · version {CHANGES_CALENDAR.version}</p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H}>
            What Changes and When: Australian Pay and Tax Dates, 1 July 2026 to 1 July 2027
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            Every pay, tax and super date that moves in the next twelve months, in order: what changed on 1 July 2026, what changes
            on 1 December 2026, what does not change on 1 January 2027, and what is already legislated for 1 July 2027. Each date
            is tied to an ATO or Fair Work Commission source, and you can add the upcoming ones to your calendar.
          </p>
          <p className="mb-6 text-sm text-warmgray">
            Published <time dateTime={CHANGES_CALENDAR.publishedIso}>{CHANGES_CALENDAR.publishedOn}</time> · checked{" "}
            <time dateTime={CHANGES_CALENDAR.updatedIso}>{CHANGES_CALENDAR.updatedOn}</time>.{" "}
            <a href="#cite" className="font-semibold text-eucalyptus-dark underline">Cite this page</a>
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage lazy className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="at-a-glance">
              <h2 style={H}>At a glance</h2>
              <ol className="not-prose my-4 space-y-3">
                {CHANGE_DATES.map((c) => (
                  <li key={c.iso} className="rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm">
                    <p className="flex flex-wrap items-center gap-2">
                      <a href={`#d-${c.iso}`} className="text-lg font-bold text-navy hover:text-eucalyptus-dark hover:underline" style={H}>{c.label}</a>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[c.status].cls}`}>{STATUS[c.status].label}</span>
                    </p>
                    <p className="mt-1 text-sm text-warmgray">{c.headline}</p>
                  </li>
                ))}
              </ol>
              <p>
                <a href={CHANGES_CALENDAR.icsPath} download className="inline-flex items-center gap-2 rounded-md border border-eucalyptus/40 bg-white px-4 py-2 text-sm font-semibold text-eucalyptus-dark no-underline hover:bg-eucalyptus-light">
                  <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Add upcoming dates to your calendar (.ics)
                </a>
              </p>
              <p className="text-sm">
                The file works in Google Calendar, Apple Calendar and Outlook. It is a snapshot of this page, so download it again if a
                date changes. For business deadlines (BAS, PAYG instalments, STP) see the <Link href="/tax-calendar/">tax calendar</Link>.
              </p>
            </section>

            {CHANGE_DATES.map((c) => (
              <section key={c.iso} id={`d-${c.iso}`}>
                <h2 style={H}>{c.label}</h2>
                <p className="not-prose mb-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[c.status].cls}`}>{STATUS[c.status].label}</span>
                </p>
                <p className="font-semibold">{c.headline}.</p>
                <ul>
                  {c.items.map((i) => (
                    <li key={i.text}>
                      {i.text}
                      {i.href && <> <Link href={i.href}>More detail</Link>.</>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section id="tax-cut-table">
              <h2 style={H}>What the two tax cuts are worth at each salary</h2>
              <p>
                The rate on income between $18,201 and $45,000 goes 16%, then 15% (1 July 2026), then 14% (1 July 2027). Each step is
                worth the same flat amount to anyone earning $45,000 or more and less to people earning below that. The table shows the
                change in take-home pay after income tax (low income tax offset applied) and the Medicare levy, for an Australian
                resident for a full year with no HECS-HELP.
              </p>
              <Table caption="Change in yearly take-home pay from each rate cut" head={["Salary", "Take-home 2025-26", "From 1 Jul 2026", "From 1 Jul 2027 (legislated)", "Both cuts, per week"]} minWidth={620}>
                {rows.map((r) => (
                  <tr key={r.salary}>
                    <th scope="row" className={`${td} font-medium`}>{aud(r.salary)}</th>
                    <td className={td}>{aud(r.takeHome2025)}</td>
                    <td className={td}>{signed(r.gainYear)}</td>
                    <td className={td}>{signed(r.takeHome2027 - r.takeHome2026)}</td>
                    <td className={td}>{`+$${(r.gainBy2027 / 52).toFixed(2)}`}</td>
                  </tr>
                ))}
              </Table>
              <p className="text-sm">
                Worked example: on {aud(80_000)} the 1 July 2026 cut adds {signed(rows.find((r) => r.salary === 80_000)!.gainYear)} a year and the 2027 cut
                a further {signed(rows.find((r) => r.salary === 80_000)!.takeHome2027 - rows.find((r) => r.salary === 80_000)!.takeHome2026)}. Work out your own figure in
                the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> or see every salary in the{" "}
                <Link href="/australian-pay-report-2026/">Australian Pay Report 2026</Link>. The scales behind the table are in the{" "}
                <Link href="/australian-tax-and-pay-data/">open tax and pay data</Link>.
              </p>
            </section>

            <section id="junior-steps">
              <h2 style={H}>The junior phase-in, step by step</h2>
              <p>
                For employees aged 18 to 20 with more than 6 months with their employer, the awards below move toward the adult rate in
                stages, each starting from the first full pay period on or after the date. Under-18 rates are unchanged. The numbers are
                the percentage of the adult classification rate.
              </p>
              <Table caption="Fast Food and Retail awards: 18, 19 and 20 year olds (% of adult rate)" head={["From", "18", "19", "20 (fast food)", "20 (retail)"]} minWidth={460}>
                <tr>
                  <th scope="row" className={`${td} font-medium`}>Now</th>
                  <td className={td}>{fastFood.present.age18}%</td><td className={td}>{fastFood.present.age19}%</td><td className={td}>{fastFood.present.age20}%</td><td className={td}>{retail.present.age20}%</td>
                </tr>
                {fastFood.rows.map((r, i) => (
                  <tr key={r.effective}>
                    <th scope="row" className={`${td} font-medium`}>{r.effective}</th>
                    <td className={td}>{r.age18}%</td><td className={td}>{r.age19}%</td><td className={td}>{r.age20}%</td><td className={td}>{retail.rows[i].age20}%</td>
                  </tr>
                ))}
              </Table>
              <Table caption="Pharmacy Industry Award: pharmacy assistants levels 1 and 2 (% of adult rate)" head={["From", "18", "19", "20"]} minWidth={360}>
                <tr>
                  <th scope="row" className={`${td} font-medium`}>Now</th>
                  <td className={td}>{pharmacy.present.age18}%</td><td className={td}>{pharmacy.present.age19}%</td><td className={td}>{pharmacy.present.age20}%</td>
                </tr>
                {pharmacy.rows.map((r) => (
                  <tr key={r.effective}>
                    <th scope="row" className={`${td} font-medium`}>{r.effective}</th>
                    <td className={td}>{r.age18}%</td><td className={td}>{r.age19}%</td><td className={td}>{r.age20}%</td>
                  </tr>
                ))}
              </Table>
              <p>
                See the dollar rates on <Link href="/junior-pay-rates/">junior pay rates</Link>, the{" "}
                <Link href="/retail-award-rates/">retail</Link> and <Link href="/fast-food-award-rates/">fast food</Link> award pages,
                and the age pages such as <Link href="/minimum-wage-by-age/19/">minimum wage at 19</Link>.
              </p>
            </section>

            <section id="how-to-use">
              <h2 style={H}>Using this page</h2>
              <ul>
                <li><strong>Employees and students.</strong> Check the date before assuming a rise: most national rates change on 1 July, and the December junior step applies only to specific awards and only after 6 months with an employer.</li>
                <li><strong>Payroll and HR.</strong> Put 1 December 2026 and 1 July 2027 in the payroll calendar now. Show the current figures on your own site with the <Link href="/embed/">live figure badges</Link>.</li>
                <li><strong>Writers.</strong> Quote any date with the link below. Tables of the underlying rates are free to download from the <Link href="/australian-tax-and-pay-data/">tax and pay data page</Link>.</li>
              </ul>
            </section>

            <section id="cite">
              <h2 style={H}>Cite this page</h2>
              <p>
                You are welcome to quote or link to any date on this page. The permanent address is{" "}
                <a href={CHANGES_CALENDAR.url}>{CHANGES_CALENDAR.url}</a>. The page is re-checked and its version and date updated
                whenever a source changes.
              </p>
              <CopySnippet id="cite-text" label="Suggested citation" text={changesCitation()} />
              <CopySnippet id="cite-html" label="Link (HTML)" text={changesCitationHtml()} />
            </section>

            <section id="faq">
              <h2 style={H}>Questions about the dates</h2>
              <div className="not-prose"><FaqAccordion faqs={CHANGES_CALENDAR_FAQS} /></div>
            </section>

            <div className="not-prose mt-12">
              <SourceAttribution sources={CHANGES_SOURCE_LINKS} lastVerified={CHANGES_CALENDAR.updatedOn} />
              {authorship && <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-6">
                <h3 className="mb-3 font-bold text-navy">On this page</h3>
                <div className="space-y-2 text-sm">
                  {CHANGE_DATES.map((c) => (
                    <a key={c.iso} href={`#d-${c.iso}`} className="block text-navy hover:text-eucalyptus-dark hover:underline">{c.label}</a>
                  ))}
                  <a href="#tax-cut-table" className="block text-navy hover:text-eucalyptus-dark hover:underline">What the tax cuts are worth</a>
                  <a href="#junior-steps" className="block text-navy hover:text-eucalyptus-dark hover:underline">Junior phase-in steps</a>
                  <a href="#cite" className="block text-navy hover:text-eucalyptus-dark hover:underline">Cite this page</a>
                </div>
              </div>
              <div className="rounded-xl bg-eucalyptus-dark p-6 text-white shadow-md">
                <h3 className="mb-2 text-lg font-bold">See your own take-home pay</h3>
                <p className="mb-4 text-sm text-eucalyptus-light">Current-year rates, applied to your salary.</p>
                <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                  Take-Home Pay Calculator
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
