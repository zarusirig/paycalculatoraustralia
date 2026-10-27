import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD } from "@/lib/constants";
import {
  GRADUATE_PROFESSIONS,
  GRADUATE_SALARY_VERIFIED_ON,
  NMW_INTERN_AWARD_MINIMUM,
  QILT_MEDIANS_2025,
  QILT_SOURCE,
  graduateTakeHome,
  nurseStarts,
  teacherStarts,
} from "@/lib/data/graduate-salary";
import { takeHomeHref } from "@/lib/data/teacher-pay";
import { GRADUATE_SALARY_FAQS } from "./graduate-salary-australia-faqs";
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

// /graduate-salary-australia/ (Oct 2026 trending set, item 7). Sourced figures
// only: QILT's Graduate Outcomes Survey 2025, awards and state agreements
// already verified in this repo, and NSW Health's intern bulletin. See
// lib/data/graduate-salary/index.ts for what is deliberately left out.

const SOURCES_LIST: SourceLink[] = [
  { title: QILT_SOURCE.title, url: QILT_SOURCE.url, publisher: "QILT (Australian Government Department of Education)" },
  { title: "Professional Employees Award 2020 [MA000065], clause 14.1", url: "https://awards.fairwork.gov.au/MA000065.html", publisher: "Fair Work Commission" },
  { title: "Legal Services Award 2020 [MA000116] and award coverage for lawyers and law graduates", url: "https://library.fairwork.gov.au/viewer/?krn=K600646", publisher: "Fair Work Ombudsman" },
  { title: "Medical Practitioners Award 2020, clause 16.1", url: "https://awards.fairwork.gov.au/MA000031.html", publisher: "Fair Work Commission" },
  { title: "Interim Salary Increases for Non-Specialist Medical Officers, IB2026_007 (20 January 2026)", url: "https://www1.health.nsw.gov.au/pds/ActivePDSDocuments/IB2026_007.pdf", publisher: "NSW Health" },
  { title: "Teacher pay scales by state and territory", url: "/teacher-pay-australia/", publisher: "Pay Calculator Australia (from each state's enterprise agreement)" },
  { title: "Nurses award and state pay scales", url: "/nurses-award-rates/", publisher: "Pay Calculator Australia (from each state's enterprise agreement)" },
];

const f0 = (n: number) => formatAUD(n, 0);
const f2 = (n: number) => formatAUD(n, 2);

const TEACHERS = teacherStarts();
const NURSES = nurseStarts();

const SUMMARY = GRADUATE_PROFESSIONS.map((p) => ({ p, th: graduateTakeHome(p.qiltMedian) }));
const th80 = graduateTakeHome(80_000);

export default function GraduateSalaryAustraliaPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/first-job-pay-guide/", label: "First Job" }, { label: "Graduate Salary" }]} />

      <PageHeader featuredImage title="Graduate Salary in Australia: Law, Nursing, Engineering, Accounting, Teaching & Medicine">
        <p>
          <strong>The median full-time salary for Australian undergraduates four to six months after finishing was {f0(QILT_MEDIANS_2025.all)} in the Government&rsquo;s 2025 Graduate Outcomes Survey.</strong> By field it runs from {f0(QILT_MEDIANS_2025.business)} (business and management) to {f0(QILT_MEDIANS_2025.medicine)} (medicine). This page lines those survey medians up against the published award or agreement starting rates we could verify, then shows what each leaves in your first payslip.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "All undergraduates", v: f0(QILT_MEDIANS_2025.all), s: "Median full-time, QILT 2025" },
          { k: "Medicine", v: f0(QILT_MEDIANS_2025.medicine), s: "Highest of the six fields" },
          { k: "Engineering award start", v: f0(68_538), s: "Level 1, pay point 1.1 minimum" },
          { k: "Data from", v: "Official only", s: "QILT, awards, state agreements" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="at-a-glance">Graduate Salaries at a Glance</H2>
            <p>
              Two kinds of number are in the table, and they answer different questions. The <strong>survey median</strong> is what graduates who had a full-time job reported earning (QILT, 2025). The <strong>published start</strong> is a minimum or a scale step that an award, bulletin or agreement sets, which is what you can be sure of being paid. Take-home figures use the 2026-27 resident tax rates and Medicare levy with no HELP debt, and the HELP column shows the repayment at that income.
            </p>
            <DataTable
              head={["Graduate", "Survey median (QILT 2025)", "Take-home a week", "HELP repayment a year"]}
              align={["l", "r", "r", "r"]}
              rows={SUMMARY.map(({ p, th }) => [
                <Link key={p.slug} href={`#${p.slug}`}>{p.title}</Link>,
                f0(p.qiltMedian),
                f2(th.netWeekly),
                f0(th.helpRepayment),
              ])}
              caption={<>QILT figures are the median annual full-time salary of undergraduate graduates in the matching study area (accounting sits inside business and management). Take-home is on the survey median, before any HELP repayment, from the site&rsquo;s tax engine. Read {GRADUATE_SALARY_VERIFIED_ON}.</>}
            />
            <p>
              A survey median is not a rate anyone has to pay. It only counts graduates in full-time work, it was taken a few months after graduating, and it can&rsquo;t say whether super is included. Treat it as a market reference and check the offer in front of you against the award or agreement minimum below.
            </p>
          </section>

          <section>
            <H2 id="lawyer">Graduate Lawyer Salary</H2>
            <p>
              Law and paralegal studies graduates in full-time work reported a median of {f0(QILT_MEDIANS_2025.law)}. The legal floor is narrower than the market: a law graduate doing practical legal training in a private firm is covered by the Legal Services Award at Level 5, at least {f2(GRADUATE_PROFESSIONS[0].published!.annual / 52 / 38)} an hour, about {f0(GRADUATE_PROFESSIONS[0].published!.annual)} a year. Once admitted, a lawyer is award-free, so pay comes from the contract. We don&rsquo;t publish firm salary bands, because no official source does. See <Link href={GRADUATE_PROFESSIONS[0].detailHref}>{GRADUATE_PROFESSIONS[0].detailLabel}</Link> and, for take-home on {f0(QILT_MEDIANS_2025.law)}, <Link href={takeHomeHref(QILT_MEDIANS_2025.law)}>the take-home page for {f0(takeHomeAmount(QILT_MEDIANS_2025.law))}</Link>.
            </p>
          </section>

          <section>
            <H2 id="nurse">Graduate Nurse Salary</H2>
            <p>
              Nursing graduates in full-time work reported a median of {f0(QILT_MEDIANS_2025.nursing)}. Public-sector nurses are paid on state scales, and a graduate registered nurse starts at the bottom of the base registered nurse scale. These are the first steps, before overtime, penalties and allowances:
            </p>
            <DataTable
              head={["State", "First step", "Annual", "Rates from"]}
              align={["l", "l", "r", "l"]}
              rows={NURSES.map((n) => [n.state, n.label, `${f0(n.annual)}${n.annualPublished ? "" : "*"}`, n.effectiveFrom])}
              caption={<>*Weekly rate x 52 where the agreement prints no annual salary. Each state&rsquo;s classification and first step differ, so they are not strictly comparable. Full detail on <Link href="/nurses-award-rates/">nurses award and state pay scales</Link>.</>}
            />
          </section>

          <section>
            <H2 id="engineer">Graduate Engineer Salary</H2>
            <p>
              Engineering graduates in full-time work reported a median of {f0(QILT_MEDIANS_2025.engineering)}. The legal floor is the Professional Employees Award: a graduate engineer with a 4 or 5-year degree recognised by Engineers Australia is Level 1, pay point 1.1, at least {f0(68_538)} a year ({f2(34.57)} an hour), then moves through pay points 1.2 to 1.4 ($69,688, $72,590 and $76,267) as they are assessed competent. A 3-year degree starts at $66,825. Employers commonly pay above the award, which the survey median reflects. See <Link href={GRADUATE_PROFESSIONS[2].detailHref}>{GRADUATE_PROFESSIONS[2].detailLabel}</Link>.
            </p>
          </section>

          <section>
            <H2 id="accountant">Graduate Accountant Salary</H2>
            <p>
              Accountants are award-free: the Fair Work Ombudsman says accountants working for an accounting firm aren&rsquo;t covered by a modern award, so the only legal floor is the National Minimum Wage and everything above it is in your contract or enterprise agreement. No official source publishes a graduate accountant pay scale, and we don&rsquo;t estimate one. The closest official figure is the {f0(QILT_MEDIANS_2025.business)} median for business and management graduates, a broad group that includes accounting. See <Link href={GRADUATE_PROFESSIONS[3].detailHref}>{GRADUATE_PROFESSIONS[3].detailLabel}</Link>.
            </p>
          </section>

          <section>
            <H2 id="teacher">Graduate Teacher Salary</H2>
            <p>
              Teacher education graduates in full-time work reported a median of {f0(QILT_MEDIANS_2025.teaching)}. Public-school graduates start on the first qualified step of their state&rsquo;s scale:
            </p>
            <DataTable
              head={["State", "Graduate step salary", "Rates from"]}
              align={["l", "r", "l"]}
              rows={TEACHERS.map((t) => [<Link key={t.code} href={t.href}>{t.state}</Link>, f0(t.annual), t.effectiveFrom])}
              caption={<>The first qualified classroom teacher step in each state&rsquo;s published schedule, from the enterprise agreement or salary determination. Rises scheduled after these dates are on each state&rsquo;s page. See <Link href="/teacher-pay-australia/">teacher pay by state</Link>.</>}
            />
          </section>

          <section>
            <H2 id="doctor">Intern Doctor Salary</H2>
            <p>
              Medicine graduates in full-time work reported a median of {f0(QILT_MEDIANS_2025.medicine)}. NSW Health pays interns {f0(80_638)} a year from the first full pay period on or after 1 July 2025 (Information Bulletin IB2026_007, an interim increase pending the NSW Industrial Relations Commission&rsquo;s decision, so it may have been updated). The Medical Practitioners Award sets a lower national-system minimum of {f0(NMW_INTERN_AWARD_MINIMUM.annual)} ({f2(NMW_INTERN_AWARD_MINIMUM.hourly)} an hour) for employers such as private hospitals. Other states&rsquo; intern salaries aren&rsquo;t shown because we couldn&rsquo;t verify them from an official source. See <Link href={GRADUATE_PROFESSIONS[5].detailHref}>{GRADUATE_PROFESSIONS[5].detailLabel}</Link>.
            </p>
          </section>

          <section>
            <H2 id="first-payslip">What Your First Payslip Looks Like</H2>
            <p>
              Your first payslip shows gross pay, tax withheld, and super paid on top (12% if the offer is salary plus super; inside the package if it is a total remuneration offer). For a graduate on {f0(80_000)} a year, the 2026-27 resident rates give about {f0(80_000 - th80.net)} of tax and Medicare, leaving {f0(th80.net)} a year or {f2(th80.netWeekly)} a week. With a HELP debt the compulsory repayment is about {f0(th80.helpRepayment)} a year, taking the weekly figure to {f2(th80.netAfterHelpWeekly)}.
            </p>
            <p>Look up the nearest salary to your offer on the take-home pay pages:</p>
            <ul>
              {SUMMARY.map(({ p }) => (
                <li key={p.slug}><Link href={takeHomeHref(p.qiltMedian)}>Take-home pay on {f0(takeHomeAmount(p.qiltMedian))}</Link> (nearest page to the {p.role.toLowerCase()} survey median of {f0(p.qiltMedian)})</li>
              ))}
            </ul>
            <p>
              If you have a student loan, the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> shows your repayment, <Link href="/stsl-on-payslip/">how it appears on a payslip</Link> and <Link href="/extra-super-vs-hecs-repayment/">whether extra super beats paying down the debt</Link>. For the rest of your first job see the <Link href="/first-job-pay-guide/">first job pay guide</Link>, the <Link href="/new-job-checklist/">new job checklist</Link> and <Link href="/tax-file-number-declaration/">tax file number declaration</Link>.
            </p>
          </section>

          <section>
            <H2 id="left-out">What This Page Leaves Out</H2>
            <p>
              Graduate program salaries at individual employers, graduate accountant and graduate lawyer scales, and intern salaries outside NSW are not shown: no official source we could check publishes them, and job-board figures are not used here. Pay in the public sector also changes on scheduled dates, so check the state page or the agreement for the date your rate applies from.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/job-pay-rates/">Pay Rates by Job</Link>: award minimums for 40+ occupations</li>
              <li><Link href="/take-home-pay-on/">Take-Home Pay on Every Salary</Link></li>
              <li><Link href="/hecs-help-calculator/">HECS-HELP Calculator</Link></li>
              <li><Link href="/average-salary-australia/">Average Salary in Australia</Link></li>
              <li><Link href="/first-job-pay-guide/">First Job Pay Guide</Link></li>
              <li><Link href="/pay-rise-calculator/">Pay Rise Calculator</Link></li>
            </ul>
          </section>

          <FaqSection faqs={GRADUATE_SALARY_FAQS} label="Graduate salary" />

          <PageFooter
            slug="graduate-salary-australia"
            lastVerified={GRADUATE_SALARY_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Survey medians are QILT&rsquo;s 2025 Graduate Outcomes Survey figures for undergraduates in full-time employment, by study area. Published starts are read from the Professional Employees Award, the Legal Services Award, the Medical Practitioners Award, NSW Health&rsquo;s bulletin IB2026_007 and each state&rsquo;s teacher and nurse agreement as published on this site. Take-home uses the 2026-27 resident rates, the low income offset and the Medicare levy; the HELP repayment uses the 2026-27 marginal system.</p>
              <p>General information, not advice. The survey medians describe a group, not any employer&rsquo;s offer. We did not use salary guides, recruiter surveys or job-board data.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/job-pay-rates/", label: "Pay Rates by Job" },
          { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
          { href: "/take-home-pay-on/", label: "Take-Home Pay on Every Salary" },
          { href: "/first-job-pay-guide/", label: "First Job Pay Guide" },
          { href: "/teacher-pay-australia/", label: "Teacher Pay by State" },
        ]} />
      </div>
    </div></div>
  );
}

function takeHomeAmount(annual: number): number {
  const m = takeHomeHref(annual).match(/(\d+)\/$/);
  return m ? Number(m[1]) : annual;
}
