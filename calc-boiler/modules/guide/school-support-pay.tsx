import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { afterTax } from "@/lib/data/job-pay-rates";
import { formatSalary, nearestTakeHomeSalary, takeHomeHref } from "@/lib/data/public-service-pay/types";
import {
  SCHOOL_SUPPORT_HUB_FAQS,
  SCHOOL_SUPPORT_NOT_BUILT,
  SCHOOL_SUPPORT_STATES,
  SCHOOL_SUPPORT_VERIFIED_ON,
  type SchoolSupportState,
  type SupportTable,
} from "@/lib/data/school-support-pay";
import {
  ARTICLE_CLASS,
  Breadcrumbs,
  DataTable,
  FaqSection,
  H2,
  KeyFigures,
  PAGE_INNER,
  PAGE_WRAP,
  PageFooter,
  PageHeader,
  RelatedSidebar,
} from "./t3-shared";

// /school-support-staff-pay/ hub and /school-support-staff-pay/{state}/ (J6).
// Data and sources: lib/data/school-support-pay. After tax uses the engine
// behind /take-home-pay-on/N/ (afterTax in lib/data/job-pay-rates).

const LINK = "text-eucalyptus-dark hover:underline";
const hourly = (n: number) => `$${n.toFixed(n * 100 === Math.round(n * 100) ? 2 : 4)}`;

const STATUS_LABEL: Record<SupportTable["status"], string> = {
  current: "In force",
  upcoming: "Approved, starts later",
  proposed: "Proposed, not yet approved",
};

function RatesTable({ table }: { table: SupportTable }) {
  const derived = table.annualBasis === "derived";
  const head = [
    "Classification",
    ...(table.showHourly ? ["Hourly"] : []),
    derived ? "Full-time equivalent a year" : "Full-time a year",
    "Take-home a year",
    "Full breakdown",
  ];
  const align: ("l" | "r")[] = ["l", ...(table.showHourly ? (["r"] as const) : []), "r", "r", "l"];
  const rows = table.rows.map((r) => [
    <span key="l">{r.label}{r.note ? <span className="block text-xs text-warmgray-light">{r.note}</span> : null}</span>,
    ...(table.showHourly ? [r.hourly !== undefined ? hourly(r.hourly) : "—"] : []),
    formatSalary(r.annual),
    formatSalary(afterTax(r.annual).netAnnual),
    <Link key="t" href={takeHomeHref(r.annual)} className={`${LINK} whitespace-nowrap`}>{formatSalary(nearestTakeHomeSalary(r.annual))} page</Link>,
  ]);
  return (
    <>
      <h3>{table.title} <span className="text-sm font-normal text-warmgray">({STATUS_LABEL[table.status]})</span></h3>
      <DataTable head={head} align={align} rows={rows} caption={table.caption} />
    </>
  );
}

function stateSources(state: SchoolSupportState): SourceLink[] {
  return state.sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher }));
}

const TAX_NOTE = "Take-home pay uses 2026–27 resident tax rates with the low income tax offset and Medicare levy, no HECS, on the full-time figure; the linked page is the nearest $5,000 salary.";

export function SchoolSupportStatePage({ state }: { state: SchoolSupportState }) {
  const faqs = [...state.faqs];
  const current = state.tables.find((t) => t.status === "current")!;
  const entryTax = afterTax(state.entry.annual);
  const others = SCHOOL_SUPPORT_STATES.filter((s) => s.slug !== state.slug);

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[
        { href: "/", label: "Pay Calculator" },
        { href: "/school-support-staff-pay/", label: "School Support Staff Pay" },
        { label: state.code },
      ]} />

      <PageHeader title={state.h1}>
        <p><strong>{state.headline}</strong></p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: `Entry: ${state.entry.label}`, v: state.entry.hourly !== undefined ? `${hourly(state.entry.hourly)}/hr` : formatSalary(state.entry.annual), s: state.entry.hourly !== undefined ? `${formatSalary(state.entry.annual)} a year full-time${state.entry.annualBasis === "derived" ? " (derived)" : ""}` : "A year, full-time" },
          { k: "Take-home at entry", v: formatSalary(entryTax.netAnnual), s: "A year, full-time" },
          { k: "Full-time hours", v: state.fullTimeHours ? `${state.fullTimeHours} a week` : "See below", s: "Per the agreement" },
          { k: "Rates from", v: current.effectiveFrom.replace(/^the first (full )?pay period (commencing |starting )?on or after /, ""), s: state.employer },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="rates">{state.roleName} Pay Rates in {state.stateName}</H2>
            <p>{state.instrument}</p>
            {state.tables.map((t) => <RatesTable key={t.id} table={t} />)}
            <p className="text-sm">{TAX_NOTE}</p>
          </section>

          <section>
            <H2 id="hours">Hours, Part-Time and Term-Time Pay</H2>
            <p>{state.hoursNote}</p>
            <p>
              To turn an hourly rate into your own pay, use the <Link href="/hourly-to-annual-salary-calculator/">hourly to salary calculator</Link> or the <Link href="/pro-rata-salary-calculator/">pro-rata salary calculator</Link> for part-time hours.
            </p>
          </section>

          <section>
            <H2 id="progression">Where You Start and How You Move Up</H2>
            <p>{state.startingPoint}</p>
            <ul>{state.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          </section>

          <section>
            <H2 id="other-states">Teacher Aide Pay in Other States</H2>
            <p>
              Each state sets its own rates. Compare them on the <Link href="/school-support-staff-pay/">school support staff pay</Link> hub, see teacher salaries on the <Link href={state.teacherPayHref}>{state.code} teacher pay</Link> page, and the award minimum for private and Catholic schools on the <Link href="/job-pay-rates/teacher-aide/">teacher aide pay rates</Link> page.
            </p>
            <ul>
              {others.map((s) => (
                <li key={s.slug}><Link href={`/school-support-staff-pay/${s.slug}/`}>{s.code} {s.roleShort} pay rates</Link>: {s.roleName}</li>
              ))}
            </ul>
          </section>

          <FaqSection faqs={faqs} label={`${state.code} ${state.roleShort} pay`} />

          <PageFooter
            slug={`school-support-staff-pay/${state.slug}`}
            lastVerified={state.verifiedOn}
            sources={stateSources(state)}
            methodology={<>
              <p>Rates are copied from the instrument&rsquo;s own table for the date shown. {current.annualBasis === "derived" ? `The instrument publishes hourly rates, so the full-time equivalent is hourly × ${state.fullTimeHours} hours × 52 weeks, and it is labelled as derived.` : "Annual salaries are as printed."} Nothing is estimated from job ads.</p>
              <p>{TAX_NOTE} General information, not advice: your payslip and your school&rsquo;s HR team are the final word.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/school-support-staff-pay/", label: "School Support Staff Pay" },
          { href: "/job-pay-rates/teacher-aide/", label: "Teacher Aide Award Rates" },
          { href: state.teacherPayHref, label: `${state.code} Teacher Pay` },
          { href: `/public-service-pay-scales/${state.slug}/`, label: `${state.code} Public Service Pay` },
          { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Salary Calculator" },
        ]} />
      </div>
    </div></div>
  );
}

export function SchoolSupportHubPage() {
  const faqs = [...SCHOOL_SUPPORT_HUB_FAQS];
  const sources: SourceLink[] = SCHOOL_SUPPORT_STATES.flatMap(stateSources);
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" }, { label: "School Support Staff Pay" }]} />

      <PageHeader title="Teacher Aide Pay by State 2026: School Support Staff Pay Rates">
        <p>
          <strong>A teacher aide in a government school starts on $38.33 an hour in NSW (SLSO 1), $31.69 in Queensland (OO2), $34.75 in WA (Education Assistant 1.1), $51,622 a year full-time in Victoria (ES 1-1) and $58,360 a year in South Australia (SSO-1).</strong> Each state pays its school support staff under its own award or agreement, with different job titles, hours and pay dates. Private and Catholic school teacher aides are covered by a federal award instead, on our <Link href="/job-pay-rates/teacher-aide/">teacher aide pay rates</Link> page.
        </p>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="by-state">Entry Rates by State</H2>
            <DataTable
              head={["State", "Job title", "Entry level", "Hourly", "Full-time a year", "Rates from", "Details"]}
              align={["l", "l", "l", "r", "r", "l", "l"]}
              rows={SCHOOL_SUPPORT_STATES.map((s) => {
                const cur = s.tables.find((t) => t.status === "current")!;
                return [
                  s.stateName,
                  `${s.roleName} (${s.roleShort})`,
                  s.entry.label,
                  s.entry.hourly !== undefined ? hourly(s.entry.hourly) : "—",
                  `${formatSalary(s.entry.annual)}${s.entry.annualBasis === "derived" ? "*" : ""}`,
                  cur.effectiveFrom.replace(/^the first (full )?pay period (commencing |starting )?on or after /, ""),
                  <Link key={s.slug} href={`/school-support-staff-pay/${s.slug}/`} className={LINK}>{s.code} rates</Link>,
                ];
              })}
              caption={<>* Derived full-time equivalent: the hourly rate × the agreement&rsquo;s full-time hours (NSW 31.25, WA 32.5) × 52. Queensland&rsquo;s figure is 38 hours as printed. Victoria and SA publish annual salaries only. Read {SCHOOL_SUPPORT_VERIFIED_ON}.</>}
            />
            <p>
              Full-time hours differ: 31.25 a week for a NSW SLSO, 32.5 for a WA Education Assistant and 38 for a Queensland teacher aide, whose department builds its standard job on 30 hours. Compare hourly rates, not annual salaries, when the hours differ.
            </p>
          </section>

          <section>
            <H2 id="states">Pay Rates for Each State</H2>
            <ul>
              {SCHOOL_SUPPORT_STATES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/school-support-staff-pay/${s.slug}/`}>{s.metaTitle.split(" — ")[0]}</Link>: {s.instrument.split(". ")[0]}.
                </li>
              ))}
            </ul>
            <p>
              We have not yet verified current rates for {SCHOOL_SUPPORT_NOT_BUILT.join(", ")}, so they are not listed. Other public-sector pay is on the <Link href="/public-service-pay-scales/">public service pay scales</Link> hub and teacher salaries on <Link href="/teacher-pay-australia/">teacher pay by state</Link>.
            </p>
          </section>

          <FaqSection faqs={faqs} label="Teacher aide pay" />

          <PageFooter
            slug="school-support-staff-pay"
            lastVerified={SCHOOL_SUPPORT_VERIFIED_ON}
            sources={sources}
            methodology={<>
              <p>Each rate is copied from the state&rsquo;s award or agreement for the date shown. Where the instrument publishes hourly rates only (NSW and WA) the annual figure is a full-time equivalent we derive, and is marked. South Australia&rsquo;s figures are the School Services Officer schedule on our SA public service page.</p>
              <p>General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/job-pay-rates/teacher-aide/", label: "Teacher Aide Award Rates" },
          { href: "/teacher-pay-australia/", label: "Teacher Pay by State" },
          { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
          { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Salary Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
