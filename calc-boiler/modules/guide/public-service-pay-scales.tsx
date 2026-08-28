"use client";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SUPER_GUARANTEE } from "@/lib/constants";
import {
  JURISDICTIONS,
  PLANNED_JURISDICTIONS,
  PUBLIC_SERVICE_PAY_FAQS,
  allBands,
  formatSalary,
  type Jurisdiction,
} from "@/lib/data/public-service-pay";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };


function summarise(jurisdiction: Jurisdiction) {
  const bands = allBands(jurisdiction);
  const primary = jurisdiction.schedules[0];
  const primaryBands = primary.streams.flatMap((s) => s.bands);
  return {
    lowest: Math.min(...primaryBands.map((b) => b.min)),
    highest: Math.max(...primaryBands.map((b) => b.max)),
    levels: primaryBands.length,
    bandCount: bands.length,
    schedule: primary,
  };
}

export default function PublicServicePayScalesPage() {
  const sources: SourceLink[] = JURISDICTIONS.flatMap((jurisdiction) =>
    jurisdiction.sources.slice(0, 3).map((source) => ({
      title: `${jurisdiction.shortName}: ${source.title}`,
      url: source.url,
      publisher: source.publisher,
    })),
  );

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* BREADCRUMB */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li>
              <Link href="/" className="hover:text-eucalyptus-dark hover:underline">
                Pay Calculator
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-3 w-3 text-warmgray-light" />
            </li>
            <li>
              <span className="font-medium text-navy" aria-current="page">
                Public Service Pay Scales
              </span>
            </li>
          </ol>
        </nav>

        {/* HERO */}
        <header className="mb-10 max-w-4xl">
          <h1
            className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl"
            style={HEADING_FONT}
          >
            Public Service Pay Scales in Australia
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            Three different classification systems, three different sets of numbers. The federal APS
            runs APS 1&ndash;6, EL 1, EL 2 and SES Bands 1&ndash;3 with a median APS 6 base salary of{" "}
            <strong className="text-navy">$108,092</strong>; the Victorian Public Service runs grades
            1&ndash;7 with value ranges and progression steps, paying{" "}
            <strong className="text-navy">$56,677 to $263,771</strong> from 1 May 2026; Queensland
            runs AO, PO, TO and OO streams, with an AO3 on{" "}
            <strong className="text-navy">$77,354 to $85,833</strong> under the state award. Every
            figure on these pages is transcribed from the agreement, award or determination that sets
            it.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark lg:w-2/3">
            {/* Jurisdiction cards */}
            <section id="jurisdictions">
              <h2 style={HEADING_FONT}>Pay scales by service</h2>
              <div className="not-prose my-6 grid gap-4">
                {JURISDICTIONS.map((jurisdiction) => {
                  const stats = summarise(jurisdiction);
                  return (
                    <Link
                      key={jurisdiction.slug}
                      href={`/public-service-pay-scales/${jurisdiction.slug}/`}
                      className="group block rounded-xl border border-sandstone-dark/20 p-5 transition-colors hover:border-eucalyptus hover:bg-sandstone/30"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-navy" style={HEADING_FONT}>
                          {jurisdiction.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 shrink-0 text-eucalyptus-dark transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-warmgray">
                        {jurisdiction.headline}
                      </p>
                      <p className="mt-3 text-xs text-warmgray">
                        <span className="font-semibold text-navy">
                          {formatSalary(stats.lowest)} &ndash; {formatSalary(stats.highest)}
                        </span>{" "}
                        across {stats.levels} published classifications &middot;{" "}
                        {stats.schedule.effectiveFrom} &middot; verified {jurisdiction.verifiedOn}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* How the systems differ */}
            <section id="how-the-systems-work">
              <h2 style={HEADING_FONT}>How the classification systems work</h2>
              <p>
                A public service classification does two things at once: it describes the work level,
                and it fixes the salary range attached to it. The three services build that structure
                differently.
              </p>
              <ul>
                <li>
                  <strong>APS (federal).</strong> Classifications come from the Public Service
                  Classification Rules 2000 &mdash; APS 1 to APS 6, then Executive Level 1 and 2,
                  then Senior Executive Service Bands 1 to 3. The classification is service-wide but
                  the salary is not: each agency&rsquo;s enterprise agreement sets its own pay points
                  inside the level.
                </li>
                <li>
                  <strong>Victoria (VPS).</strong> Grades 1 to 7, each split into value ranges (3.1,
                  3.2 and so on) that reflect work value, and each value range split into progression
                  steps. One agreement covers the whole service, so the table is the same wherever
                  you work in the VPS.
                </li>
                <li>
                  <strong>Queensland.</strong> Four streams &mdash; administrative (AO), professional
                  (PO), technical (TO) and operational (OO) &mdash; each with numbered levels and
                  numbered pay points inside them, written as AO3/2 or PO4/1. The award sets the
                  floor and each entity&rsquo;s certified agreement can sit above it.
                </li>
              </ul>

              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-left text-sm text-warmgray">
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Levels are written as</th>
                      <th className="px-4 py-3">Salary set by</th>
                      <th className="px-4 py-3 text-right">Employer super</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    <tr>
                      <td className="px-4 py-3 font-medium text-navy">APS (federal)</td>
                      <td className="px-4 py-3">APS 1&ndash;6, EL 1, EL 2, SES Band 1&ndash;3</td>
                      <td className="px-4 py-3">Each agency&rsquo;s enterprise agreement</td>
                      <td className="px-4 py-3 text-right">15.4% (median)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-navy">Victoria (VPS)</td>
                      <td className="px-4 py-3">Grade.value range.step, e.g. 3.1.4</td>
                      <td className="px-4 py-3">One service-wide enterprise agreement</td>
                      <td className="px-4 py-3 text-right">
                        Superannuation Guarantee ({(SUPER_GUARANTEE.rate * 100).toFixed(1)}%)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-navy">Queensland</td>
                      <td className="px-4 py-3">Stream + level/pay point, e.g. AO3/2, PO4/1</td>
                      <td className="px-4 py-3">State award floor plus entity certified agreements</td>
                      <td className="px-4 py-3 text-right">12.75% (under 75)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* The APS problem */}
            <section id="no-single-aps-scale">
              <h2 style={HEADING_FONT}>Why there is no single APS salary</h2>
              <p>
                Search &ldquo;APS 6 salary&rdquo; and you will be given a number. Treat it carefully:
                the APS has around 102 agency enterprise agreements and each one sets its own pay
                points, so the honest answer is a range. Across the whole service at 31 December
                2025 the median APS 6 base salary was <strong>$108,092</strong>, and 90% of APS 6
                employees were paid between <strong>$97,316</strong> and <strong>$115,199</strong>.
                One agency&rsquo;s agreement &mdash; Treasury&rsquo;s &mdash; pays APS 6 across four
                pay points from $105,260 to $127,521 from 12 March 2026. Both statements are true;
                neither is &ldquo;the&rdquo; APS 6 salary.
              </p>
              <p>
                Service-wide bargaining has been narrowing the spread since 2023, which the APSC
                calls reducing pay fragmentation, and the same three-year package delivered 4%, 3.8%
                and 3.4% increases in March 2024, 2025 and 2026. Until alignment finishes, the number
                that matters to you is in your own agency&rsquo;s agreement. The{" "}
                <Link href="/public-service-pay-scales/aps/">APS pay scales page</Link> sets out the
                service-wide ranges level by level and shows where to look for your agency.
              </p>
              <p>
                Queensland has a milder version of the same problem, and the{" "}
                <Link href="/public-service-pay-scales/qld/">Queensland page</Link> keeps the two
                layers apart: the award rate that job advertisements quote, and one entity&rsquo;s
                certified agreement schedule shown beside it. Victoria is the exception &mdash; one
                agreement, one table, published in{" "}
                <Link href="/public-service-pay-scales/vic/">Schedule C</Link>.
              </p>
            </section>

            {/* Where the money lines up */}
            <section id="comparing">
              <h2 style={HEADING_FONT}>Comparing levels across services</h2>
              <p>
                There is no official mapping between APS levels, VPS grades and Queensland streams,
                and inventing one would be guesswork. What can be compared is the money. At the same
                point in the pay range:
              </p>
              <ul>
                <li>
                  The median APS 6 base salary of <strong>$108,092</strong> sits close to VPS pay
                  point 4.1.4 (<strong>$107,681</strong>) and Queensland&rsquo;s AO5/2 award rate (
                  <strong>$107,721</strong>).
                </li>
                <li>
                  The median EL 1 base salary of <strong>$135,701</strong> sits between VPS 5.2.4 (
                  <strong>$139,100</strong>) and Queensland&rsquo;s AO7/2 award rate (
                  <strong>$136,837</strong>).
                </li>
                <li>
                  The top of the published VPS structure, <strong>$263,771</strong> at 7.3.5, is
                  above the median SES Band 1 base salary of <strong>$253,804</strong> and below the
                  median SES Band 2 of <strong>$321,888</strong>.
                </li>
              </ul>
              <p>
                Similar salary does not mean similar work, and it does not mean similar total
                remuneration either: the same gross salary is worth more in the APS than in the VPS
                once the 15.4% employer superannuation contribution is counted.
              </p>
            </section>

            {/* After tax */}
            <section id="after-tax">
              <h2 style={HEADING_FONT}>What a band is worth after tax</h2>
              <p>
                Classification tables are gross figures. What lands in your account depends on income
                tax, the Medicare levy and any study loan repayment, and public service payrolls
                usually pay fortnightly, which is why the schedules are published as fortnightly
                rates in the first place. Every band on the jurisdiction pages links to the nearest
                take-home page, and these calculators take an exact salary:
              </p>
              <ul>
                <li>
                  <Link href="/income-tax-calculator/">Income tax calculator</Link> &mdash; tax and
                  Medicare levy on your exact classification salary.
                </li>
                <li>
                  <Link href="/take-home-pay-calculator/">Take-home pay calculator</Link> &mdash; net
                  pay weekly, fortnightly and monthly.
                </li>
                <li>
                  <Link href="/fortnightly-pay-calculator/">Fortnightly pay calculator</Link> &mdash;
                  matches the way public service pay points are published.
                </li>
                <li>
                  <Link href="/pay-rise-calculator/">Pay rise calculator</Link> &mdash; what an
                  increment or an agreement increase is worth in the hand.
                </li>
                <li>
                  <Link href="/superannuation-calculator/">Superannuation calculator</Link> &mdash;
                  the effect of an employer rate above the guarantee.
                </li>
                <li>
                  <Link href="/understanding-your-payslip/">Understanding your payslip</Link> &mdash;
                  where the classification and pay point appear on the payslip.
                </li>
              </ul>
            </section>

            {/* Not covered */}
            <section id="not-covered">
              <h2 style={HEADING_FONT}>Services not covered yet</h2>
              <p>
                Six public services are not on this page. Rather than publish figures we have not
                read from the primary instrument, here is who sets them:
              </p>
              <ul>
                {PLANNED_JURISDICTIONS.map((planned) => (
                  <li key={planned.slug}>
                    <strong>{planned.name}</strong> &mdash; {planned.authority}.
                  </li>
                ))}
              </ul>
              <p>
                For state pay and tax questions in the meantime, the state calculators cover income
                tax and take-home pay wherever you work:{" "}
                <Link href="/pay-calculator-vic/">Victoria</Link>,{" "}
                <Link href="/pay-calculator-qld/">Queensland</Link>,{" "}
                <Link href="/pay-calculator-nsw/">NSW</Link>,{" "}
                <Link href="/pay-calculator-wa/">WA</Link>, <Link href="/pay-calculator-sa/">SA</Link>
                , <Link href="/pay-calculator-tas/">Tasmania</Link>,{" "}
                <Link href="/pay-calculator-act/">ACT</Link> and{" "}
                <Link href="/pay-calculator-nt/">NT</Link>.
              </p>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 style={HEADING_FONT}>Public service pay questions</h2>
              <div className="not-prose">
                <Accordion type="single" collapsible className="w-full">
                  {PUBLIC_SERVICE_PAY_FAQS.map((faq, index) => (
                    <AccordionItem key={faq.q} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-navy">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            <section id="method">
              <MethodologyDisclosure
                title="How these pay scales were compiled"
                className="not-prose my-8"
              >
                <p className="mb-2">
                  Every salary comes from the enterprise agreement, award, determination or official
                  remuneration release named beside it, read on the verification date shown on each
                  page. Nothing is estimated, indexed forward or taken from job advertisements or
                  salary surveys run by recruiters.
                </p>
                <p className="mb-2">
                  Where a service publishes a rate table, the range is the bottom and top pay point.
                  Where a service publishes actual salaries instead &mdash; the APS &mdash; the range
                  is the 5th to 95th percentile of reported base salaries with the median beside it,
                  because there is no service-wide rate table to quote.
                </p>
                <p>
                  Levels we could not verify are listed on each page under &ldquo;what this page does
                  not cover&rdquo; rather than filled in by interpolation.
                </p>
              </MethodologyDisclosure>
            </section>

            <SourceAttribution sources={sources} lastVerified="28 August 2026" className="mt-12" />
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone/30 p-5">
                <h2 className="mb-3 text-lg font-semibold text-navy" style={HEADING_FONT}>
                  Jump to a service
                </h2>
                <ul className="space-y-2 text-sm">
                  {JURISDICTIONS.map((jurisdiction) => (
                    <li key={jurisdiction.slug}>
                      <Link
                        href={`/public-service-pay-scales/${jurisdiction.slug}/`}
                        className="font-medium text-eucalyptus-dark hover:text-navy hover:underline"
                      >
                        {jurisdiction.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-sandstone-dark/20 p-5">
                <h2 className="mb-3 text-lg font-semibold text-navy" style={HEADING_FONT}>
                  Check your own pay
                </h2>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/income-tax-calculator/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Income tax calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/take-home-pay-calculator/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Take-home pay calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/fortnightly-pay-calculator/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Fortnightly pay calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/salary-packaging-guide/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Salary packaging guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/teacher-pay-australia/"
                      className="text-eucalyptus-dark hover:text-navy hover:underline"
                    >
                      Teacher pay by state
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
