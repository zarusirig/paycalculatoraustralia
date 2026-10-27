import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  HIGHEST_PAYING_VERIFIED_ON,
  JOB_PAY_VERIFIED_ON,
  MEDIAN_DEFINITION,
  rankedJobs,
  type RankedJob,
} from "@/lib/constants/highest-paying";
import { HIGHEST_PAYING_FAQS } from "./highest-paying-jobs-australia-faqs";
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

// /highest-paying-jobs-australia/ — a link hub from the median pay of each
// occupation we cover to its award page and its take-home page. Payslip-shaped
// only: median gross, tax, net. No career advice. Data and arithmetic:
// lib/constants/highest-paying.ts (medians from lib/data/job-pay-rates/).

const JSA = "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco";
const ATO_RATES = "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents";

const SOURCES_LIST: SourceLink[] = [
  { title: "Occupation and industry profiles (ANZSCO), median weekly earnings", url: JSA, publisher: "Jobs and Skills Australia" },
  { title: "Tax rates – Australian resident", url: ATO_RATES, publisher: "Australian Taxation Office" },
  { title: "Pay guides for modern awards", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides", publisher: "Fair Work Ombudsman" },
];

const FY = SITE_CONFIG.financialYear;

function jobRow(j: RankedJob) {
  return [
    `${j.rank}`,
    <>
      <Link href={`/job-pay-rates/${j.slug}/`}>{j.name}</Link>
      {j.sharesMedianWith.length > 0 && <span className="block text-xs font-normal text-warmgray-light">Same median group as {j.sharesMedianWith.join(", ")}</span>}
    </>,
    formatAUD(j.medianWeekly),
    formatAUD(j.annualGross),
    formatAUD(j.netWeekly),
    <Link key="th" href={j.takeHomeHref}>Take-home on {formatAUD(j.takeHomeAmount)}</Link>,
  ];
}

const HEAD = ["#", "Occupation", "Median gross a week", "Gross a year", "Take-home a week", "Take-home table"];
const ALIGN: ("l" | "r")[] = ["r", "l", "r", "r", "r", "l"];

export default function HighestPayingJobsPage() {
  const jobs = rankedJobs();
  const top = jobs.slice(0, 10);
  const above = jobs.filter((j) => j.medianWeekly >= 2_000);
  const mid = jobs.filter((j) => j.medianWeekly >= ALL_OCCUPATIONS_MEDIAN_WEEKLY && j.medianWeekly < 2_000);
  const below = jobs.filter((j) => j.medianWeekly < ALL_OCCUPATIONS_MEDIAN_WEEKLY);
  const first = jobs[0];
  const tenth = jobs[9];
  const sample = jobs.find((j) => j.slug === "nurse") ?? jobs[1];

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/job-pay-rates/", label: "Pay Rates by Job" }, { label: "Highest Paying Jobs" }]} />

      <PageHeader featuredImage title={`Highest Paying Jobs in Australia ${FY}: Median Pay and Take-Home`}>
        <p>
          <strong>Across the {jobs.length} occupations we cover, median full-time pay runs from {formatAUD(jobs[jobs.length - 1].medianWeekly)} to {formatAUD(first.medianWeekly)} a week.</strong> This page ranks them by median weekly pay and shows what each takes home after tax, with a link to the award rates and take-home table for every job. The all-occupations median is {formatAUD(ALL_OCCUPATIONS_MEDIAN_WEEKLY)} a week. The ranking covers only the jobs we publish pay pages for, so it is a ranking of those, not of every job in the country.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Highest median", v: formatAUD(first.medianWeekly), s: `${first.name}, a week before tax` },
          { k: "Top 10 start at", v: formatAUD(tenth.medianWeekly), s: `${tenth.name}, a week` },
          { k: "All occupations", v: formatAUD(ALL_OCCUPATIONS_MEDIAN_WEEKLY), s: "Median full-time weekly pay" },
          { k: "Jobs ranked", v: `${jobs.length}`, s: `Data read ${JOB_PAY_VERIFIED_ON}` },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="top-10">The 10 Highest Median Weekly Pays</H2>
            <p>
              These are the ten occupations with the highest median weekly pay among the jobs on this site. Each name links to the occupation&rsquo;s award rates, allowances and penalty rates; the last column links to the take-home table for the closest salary.
            </p>
            <DataTable
              head={HEAD}
              align={ALIGN}
              rows={top.map(jobRow)}
              caption={<>Median weekly pay of full-time, non-managerial adult employees, before tax (Jobs and Skills Australia, ABS Survey of Employee Earnings and Hours, May 2025). Take-home applies {FY} resident tax, the low income tax offset and Medicare levy to the median × 52, with no HELP debt and private hospital cover. Read {JOB_PAY_VERIFIED_ON}.</>}
            />
          </section>

          <section>
            <H2 id="how-to-read">How to Read the Median and the Take-Home Figure</H2>
            <p>
              {MEDIAN_DEFINITION} The take-home figure turns that median into what lands in the bank. On the {sample.name.toLowerCase()} median of {formatAUD(sample.medianWeekly)} a week, gross pay is {formatAUD(sample.annualGross)} a year; tax and Medicare take {formatAUD(sample.tax)}, leaving {formatAUD(sample.annualNet)} or {formatAUD(sample.netWeekly)} a week. Higher medians lose a larger share to tax because each higher band is taxed at a higher rate; the <Link href="/marginal-tax-rates/">marginal tax rates</Link> page shows what a raise at each level keeps.
            </p>
            <p>
              The median is not the award minimum. Each occupation page also shows the legal minimum under the modern award, which is usually lower than the median. To start from your own hourly rate instead, use the <Link href="/net-pay-calculator/">net pay calculator</Link>, and for an annual salary the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="above-2000">Median $2,000 a Week or More ({above.length} jobs)</H2>
            <DataTable head={HEAD} align={ALIGN} rows={above.map(jobRow)} />
          </section>

          <section>
            <H2 id="national-median">At or Above the National Median, Under $2,000 ({mid.length} jobs)</H2>
            <p>These occupations earn at least the all-occupations median of {formatAUD(ALL_OCCUPATIONS_MEDIAN_WEEKLY)} a week but under {formatAUD(2_000)}.</p>
            <DataTable head={HEAD} align={ALIGN} rows={mid.map(jobRow)} />
          </section>

          <section>
            <H2 id="below-median">Below the National Median ({below.length} jobs)</H2>
            <p>These occupations have a median under {formatAUD(ALL_OCCUPATIONS_MEDIAN_WEEKLY)} a week. Pay in many of them is set by an award, so the <Link href="/award-rates/">award rates</Link> and <Link href="/overtime-penalty-rates-guide/">penalty rates</Link> matter as much as the median.</p>
            <DataTable head={HEAD} align={ALIGN} rows={below.map(jobRow)} />
          </section>

          <section>
            <H2 id="limits">What This Ranking Does Not Include</H2>
            <ul>
              <li><strong>Jobs we do not cover.</strong> It ranks only occupations with a pay page here. Many managers, executives and professionals are not in it.</li>
              <li><strong>Overtime, penalties and allowances.</strong> The median is ordinary full-time pay. Extras such as <Link href="/overtime-pay-calculator/">overtime</Link> and the <Link href="/allowances-guide/">allowances</Link> in your award are on top.</li>
              <li><strong>Part-time and casual pay.</strong> The median is for full-time employees. See <Link href="/casual-loading-calculator/">casual loading</Link> for casual rates.</li>
              <li><strong>Super.</strong> Employer super is paid on top of the figures shown and is not part of gross or take-home pay.</li>
              <li><strong>HELP repayments and the Medicare levy surcharge.</strong> Neither is assumed. A HELP debt reduces take-home pay: see the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>.</li>
            </ul>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/job-pay-rates/">Pay Rates by Job</Link>: award minimums, penalties and allowances for each occupation</li>
              <li><Link href="/average-salary-australia/">Average Salary Australia</Link>: how a salary compares with the national figures</li>
              <li><Link href="/take-home-pay-on/">Take-Home Pay on Every Salary</Link>: net pay tables from $20,000 to $500,000</li>
              <li><Link href="/pay-rates/">Pay Rates by Employer</Link>: what big employers pay</li>
              <li><Link href="/net-pay-calculator/">Net Pay Calculator</Link>: from hourly rate to payslip</li>
            </ul>
          </section>

          <FaqSection faqs={HIGHEST_PAYING_FAQS} label="Highest paying jobs" />

          <PageFooter
            slug="highest-paying-jobs-australia"
            lastVerified={HIGHEST_PAYING_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Median weekly pay is the Jobs and Skills Australia occupation-profile figure for each job&rsquo;s ANZSCO group (ABS Survey of Employee Earnings and Hours, May 2025), transcribed on each occupation page on {JOB_PAY_VERIFIED_ON}. Gross a year = median weekly × 52. Take-home is calculated with the site&rsquo;s {FY} resident tax engine (ATO resident rates, low income tax offset, Medicare levy), assuming no HELP debt and private hospital cover, and is linked to the nearest published take-home table. Jobs are ranked by median weekly pay; ties keep the registry order.</p>
              <p>Medians are market figures for full-time, non-managerial adult employees and do not describe the pay of any one person or employer. General information, not career or tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/job-pay-rates/", label: "Pay Rates by Job" },
          { href: "/average-salary-australia/", label: "Average Salary Australia" },
          { href: "/take-home-pay-on/", label: "Take-Home Pay on Every Salary" },
          { href: "/net-pay-calculator/", label: "Net Pay Calculator" },
          { href: "/award-rates/", label: "Award Pay Rates" },
        ]} />
      </div>
    </div></div>
  );
}
