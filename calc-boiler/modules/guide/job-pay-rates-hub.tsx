import Link from "next/link";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import { FWO_PAY_GUIDES, JOB_PAY_RATES_FROM, JOB_PAY_VERIFIED_ON } from "@/lib/data/job-pay-rates/common";
import { OCCUPATIONS, headlineRow, type Occupation } from "@/lib/data/job-pay-rates";
import { JOB_SECTORS, OCCUPATION_SECTOR } from "@/lib/data/job-pay-rates/sectors";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";

export const JOB_PAY_HUB_FAQS = [
  {
    q: "How do I find the award pay rate for my job?",
    a: "Find the modern award that covers your employer's industry and your role, then find your classification in that award's minimum rates clause. Each job page on this site names the award and clause, explains which classification fits which duties, and lists the 2026–27 rates from the Fair Work Commission's consolidated award text.",
  },
  {
    q: "When do award pay rates change?",
    a: "Award minimums change once a year after the Fair Work Commission's Annual Wage Review. The 2026 increase applies from the first full pay period starting on or after 1 July 2026.",
  },
  {
    q: "Is the award rate what I will actually be paid?",
    a: "The award rate is the legal minimum. Your employer can pay more, and an enterprise agreement, if your workplace has one, replaces the award rates. Each job page also shows the median full-time earnings for that occupation from Jobs and Skills Australia, which is what people in the job typically earn.",
  },
  {
    q: "What if my job is not covered by an award?",
    a: "Award-free employees are still entitled to the National Minimum Wage — $26.44 an hour or $1,004.90 a week for adults from 1 July 2026 — and the National Employment Standards. Accountants are one example: see the accountant page.",
  },
  {
    q: "Why can the same job fall under different awards?",
    a: "Most awards cover an industry, so the employer's business decides which one applies. A chef in a hotel is under the Hospitality Award but one in a restaurant is under the Restaurant Award; a barista in a café and one at a takeaway coffee kiosk can be on different awards with different minimums. The job pages for those roles show each award side by side.",
  },
];

/** Sectors in display order, each with its jobs sorted by name; empty sectors dropped. */
const SECTORS_WITH_JOBS = JOB_SECTORS.map((sector) => ({
  ...sector,
  jobs: OCCUPATIONS.filter((o) => OCCUPATION_SECTOR[o.slug] === sector.id).sort((a, b) => a.name.localeCompare(b.name)),
})).filter((sector) => sector.jobs.length > 0);

function JobRow({ occ }: { occ: Occupation }) {
  const r = headlineRow(occ);
  const casual = r ? r.casualHourly : occ.tables[0].rows[0].casualHourly;
  return (
    <tr>
      <th scope="row" className="px-4 py-3 text-left font-medium">
        <Link
          href={`/job-pay-rates/${occ.slug}/`}
          className="text-eucalyptus-dark underline decoration-eucalyptus/40 underline-offset-4 hover:text-navy"
        >
          {occ.name}
        </Link>
      </th>
      <td className="px-4 py-3">
        {occ.award ? (
          <>
            {occ.award.code}
            {r ? <span className="block text-xs">{r.label}</span> : null}
          </>
        ) : (
          "Award-free (National Minimum Wage)"
        )}
      </td>
      <td className="px-4 py-3 text-right font-semibold text-navy">
        {r ? formatAUD(r.hourly, 2) : formatAUD(occ.tables[0].rows[0].hourly, 2)}
      </td>
      <td className="px-4 py-3 text-right">{casual === null ? "—" : formatAUD(casual, 2)}</td>
      <td className="px-4 py-3 text-right">{occ.median ? formatAUD(occ.median.medianWeekly) : "—"}</td>
    </tr>
  );
}

export default function JobPayRatesHubPage() {
  const authorship = getGuideAuthorship("job-pay-rates");
  const sources: SourceLink[] = [
    { title: "Awards", publisher: "Fair Work Ombudsman", url: "https://www.fairwork.gov.au/employment-conditions/awards" },
    { title: FWO_PAY_GUIDES.title, publisher: FWO_PAY_GUIDES.publisher, url: FWO_PAY_GUIDES.url },
    { title: "Modern awards (consolidated text)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/" },
    { title: "Occupation and industry profiles", publisher: "Jobs and Skills Australia", url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles" },
  ];

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs trail={[{ href: "/", label: "Pay Calculator" }, { label: "Job Pay Rates" }]} />

        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            Job Pay Rates Australia 2026 — Award Minimums by Occupation
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            The minimum hourly, casual and weekly pay for {OCCUPATIONS.length} common jobs, read from each job&rsquo;s
            modern award and applying from {JOB_PAY_RATES_FROM}. Each page adds penalty rates, overtime, take-home pay
            and what people in the job actually earn.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="all-jobs">
              <h2 style={HEADING_FONT}>Minimum pay by job, 2026–27</h2>
              <p>
                The award minimum is for the classification named in the second column; each job page explains why
                that classification fits and lists every other level. The median is Jobs and Skills Australia&rsquo;s figure for full-time
                employees in the occupation. Jobs are grouped by sector; several — chefs, baristas, lab technicians —
                are covered by different awards depending on the employer, and their pages show each one.
              </p>
              <nav aria-label="Jobs by sector" className="not-prose mb-6 flex flex-wrap gap-2 text-sm">
                {SECTORS_WITH_JOBS.map((sector) => (
                  <a
                    key={sector.id}
                    href={`#${sector.id}`}
                    className="rounded-full border border-sandstone-dark/30 px-3 py-1 text-eucalyptus-dark hover:text-navy"
                  >
                    {sector.title}
                  </a>
                ))}
              </nav>
              {SECTORS_WITH_JOBS.map((sector) => (
                <div key={sector.id} id={sector.id} className="scroll-mt-24">
                  <h3 style={HEADING_FONT}>{sector.title}</h3>
                  <TableShell minWidth="46rem" caption={`Minimum pay by job, 2026–27 — ${sector.title}`}>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-4 py-3">Job</th>
                        <th scope="col" className="px-4 py-3">Award / classification</th>
                        <th scope="col" className="px-4 py-3 text-right">Minimum hourly</th>
                        <th scope="col" className="px-4 py-3 text-right">Casual hourly</th>
                        <th scope="col" className="px-4 py-3 text-right">Median weekly</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {sector.jobs.map((occ) => (
                        <JobRow key={occ.slug} occ={occ} />
                      ))}
                    </tbody>
                  </TableShell>
                </div>
              ))}
            </section>

            <section id="how-to-read">
              <h2 style={HEADING_FONT}>How to read an award rate</h2>
              <p>
                An award sets a minimum for each classification. Your classification depends on your duties,
                qualifications and experience as the award defines them — not your job title. The weekly rate is for a
                38-hour full-time week; part-timers get the same hourly rate; casuals get the hourly rate plus a 25%
                casual loading instead of paid leave.
              </p>
              <p>
                Work on weekends, public holidays, early mornings or nights often attracts a penalty rate, and extra hours
                attract overtime. Those rules differ between awards, so each job page sets them out. To turn an hourly
                rate into weekly take-home pay use the <Link href="/weekly-pay-calculator/">weekly pay calculator</Link>,
                or see every modern award we cover on the <Link href="/award-rates/">award rates hub</Link>.
              </p>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>Job pay rate questions</h2>
              <FaqList faqs={JOB_PAY_HUB_FAQS} />
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these rates are sourced">
                <p>
                  Every award minimum on these pages was read from the Fair Work Commission&rsquo;s consolidated award
                  text, consolidated to 1 July 2026 (the SCHADS Award to 1 September 2026), on {JOB_PAY_VERIFIED_ON}.
                  Median earnings are from Jobs and Skills Australia occupation profiles (ABS Survey of Employee Earnings
                  and Hours, May 2025). Nothing is estimated.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={JOB_PAY_VERIFIED_ON} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-3">
              <h2 className="mb-2 text-base font-bold text-navy">Pay rates by job</h2>
              {SECTORS_WITH_JOBS.map((sector) => (
                <div key={sector.id} className="space-y-3">
                  <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-warmgray">{sector.title}</p>
                  {sector.jobs.map((occ) => (
                    <SidebarLink key={occ.slug} href={`/job-pay-rates/${occ.slug}/`} label={`${occ.name} pay rates`} />
                  ))}
                </div>
              ))}
              <SidebarLink href="/adf-pay-scales/" label="ADF pay scales" />
              {/* --- F5: agreement-paid jobs with no award floor (24 Sep 2026) --- */}
              <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-warmgray">
                Paid under state or employer agreements
              </p>
              <SidebarLink href="/paramedic-pay/" label="Paramedic pay by state" />
              <SidebarLink href="/police-pay/" label="Police pay by state" />
              <SidebarLink href="/firefighter-pay/" label="Firefighter pay by state" />
              <SidebarLink href="/air-traffic-controller-salary/" label="Air traffic controller salary" />
              <SidebarLink href="/pilot-salary/" label="Pilot salary" />
              {/* --- end F5 --- */}
              <SidebarLink href="/award-rates/" label="All award rates" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
