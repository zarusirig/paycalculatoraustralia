import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import {
  TEACHER_PAY_STATES,
  graduateSalary,
  nearestTakeHomeAmount,
  takeHomeHref,
  topOfClassroomScale,
} from "@/lib/data/teacher-pay";
import { teacherHubFaqs, teacherHubSummary } from "@/lib/data/teacher-pay/hub";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

function SalaryLink({ salary }: { salary: number }) {
  return (
    <Link
      href={takeHomeHref(salary)}
      title={`See take-home pay on ${formatAUD(nearestTakeHomeAmount(salary))}`}
      className="font-medium text-navy underline decoration-eucalyptus/40 decoration-dotted underline-offset-4 hover:text-eucalyptus-dark"
    >
      {formatAUD(salary)}
    </Link>
  );
}

export default function TeacherPayAustraliaPage() {
  const { rows, lowestGraduate, highestGraduate, lowestTop, highestTop, year } = teacherHubSummary();
  const faqs = teacherHubFaqs();
  const authorship = getGuideAuthorship("teacher-pay-australia");

  const sources: SourceLink[] = TEACHER_PAY_STATES.map((s) => ({
    title: `${s.code}: ${s.agreementName}`,
    url: s.agreementUrl,
    publisher: s.employer,
  }));
  const latestVerified = TEACHER_PAY_STATES.reduce((a, b) => (Date.parse(b.verifiedOn) > Date.parse(a.verifiedOn) ? b : a)).verifiedOn;

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Teacher Pay Australia</span></li>
          </ol>
        </nav>

        {/* HERO */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={HEADING_FONT}>
            Teacher Salary in Australia {year} — Pay Scales by State
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Every state and territory sets its own public school teacher pay scale. A qualified graduate
            starts on between <strong className="text-navy">{formatAUD(lowestGraduate.graduate)}</strong> (
            {lowestGraduate.state.code}) and <strong className="text-navy">{formatAUD(highestGraduate.graduate)}</strong> (
            {highestGraduate.state.code}), and the top of the classroom teacher scale runs from{" "}
            <strong className="text-navy">{formatAUD(lowestTop.top)}</strong> ({lowestTop.state.code}) to{" "}
            <strong className="text-navy">{formatAUD(highestTop.top)}</strong> ({highestTop.state.code}). Every figure
            below is read from the state&rsquo;s own agreement or salary schedule and links to its take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">
            {/* ── State comparison ── */}
            <section id="salary-by-state">
              <h2 style={HEADING_FONT}>Teacher salary by state, {year}</h2>
              <p>
                Graduate is the step a qualified teacher starts on; top is the last step of the incremental
                classroom teacher scale, before roles reached by application or certification. Full-time annual
                salaries before tax, with superannuation paid on top. Tap a salary to see it after tax, or a state
                for its full pay scale.
              </p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full min-w-[40rem] text-sm text-left text-warmgray">
                  <caption className="sr-only">Public school teacher salary by state and territory</caption>
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-4 py-3">State</th>
                      <th scope="col" className="px-4 py-3 text-right">Graduate</th>
                      <th scope="col" className="px-4 py-3 text-right">Top of classroom scale</th>
                      <th scope="col" className="px-4 py-3">Rates from</th>
                      <th scope="col" className="px-4 py-3">Next change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {rows.map(({ state, graduate, top }) => (
                      <tr key={state.slug}>
                        <th scope="row" className="px-4 py-3 text-left font-medium">
                          <Link href={`/teacher-pay-australia/${state.slug}/`} className="text-eucalyptus-dark hover:text-navy hover:underline">
                            {state.code} teacher salary
                          </Link>
                        </th>
                        <td className="px-4 py-3 text-right"><SalaryLink salary={graduate} /></td>
                        <td className="px-4 py-3 text-right"><SalaryLink salary={top} /></td>
                        <td className="px-4 py-3 text-xs">{state.ratesEffectiveFrom}</td>
                        <td className="px-4 py-3 text-xs">{state.nextIncrease ? state.nextIncrease.date : "None scheduled"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Comparing raw numbers across states is only half the story: states step up on different dates, and
                Queensland and Victoria both have pay changes in train that their published schedules do not yet show.
                Each state page says exactly what applies and when.
              </p>
            </section>

            {/* ── Spoke cards ── */}
            <section id="state-pay-scales">
              <h2 style={HEADING_FONT}>Full pay scale for your state</h2>
              <p>
                Each state page carries the complete published scale — every classification and step, leadership and
                principal rates, the agreement it comes from, and the rules for moving up a step.
              </p>
              <div className="not-prose my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TEACHER_PAY_STATES.map((s) => {
                  const grad = graduateSalary(s);
                  const top = topOfClassroomScale(s);
                  return (
                    <Link
                      key={s.slug}
                      href={`/teacher-pay-australia/${s.slug}/`}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-sandstone-dark/20 bg-white p-4 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-navy group-hover:text-eucalyptus-dark">
                          {s.code} teacher salary {year} — {s.name}
                        </span>
                        <span className="block text-xs text-warmgray">
                          {grad !== null && top !== null
                            ? `${formatAUD(grad)} to ${formatAUD(top)} · verified ${s.verifiedOn}`
                            : "Scale not yet verified — see the page"}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* ── Career stages ── */}
            <section id="classification-levels">
              <h2 style={HEADING_FONT}>Teacher career stages and pay</h2>
              <p>
                The Australian Professional Standards for Teachers describe four career stages — Graduate,
                Proficient, Highly Accomplished and Lead. How those map to pay differs by state:
              </p>
              <ul>
                <li>
                  <strong>Graduate and Proficient</strong> teachers move up the incremental classroom scale, usually one
                  step a year once the state&rsquo;s accreditation or performance conditions are met. That scale is
                  the graduate-to-top range in the table above.
                </li>
                <li>
                  <strong>Highly Accomplished and Lead Teacher</strong> certification carries its own salary in several
                  states — Queensland, South Australia and NSW among them — above the top of the incremental scale.
                  Each state page lists those rows where they are published.
                </li>
                <li>
                  <strong>Leadership roles</strong> — head teacher, assistant principal, deputy principal and
                  principal — sit on separate scales set by school size or complexity, also listed on each state page.
                </li>
              </ul>
            </section>

            {/* ── After tax ── */}
            <section id="salary-after-tax">
              <h2 style={HEADING_FONT}>Teacher salary after tax</h2>
              <p>
                Every salary on this page and the state pages links to the nearest take-home pay page, which shows
                income tax, the Medicare levy and net pay by week, fortnight and month. Most early-career teachers also
                have a HECS-HELP repayment taken out — the{" "}
                <Link href="/hecs-help-calculator/">HECS repayment calculator</Link> shows how much at your salary.
                Public school teachers can salary sacrifice into super; the{" "}
                <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> shows the effect.
              </p>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate your teacher take-home pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p>
                For how teacher pay sits against other jobs, see{" "}
                <Link href="/average-salary-australia/">average salary in Australia</Link>.
              </p>
            </section>

            {/* ── FAQs ── */}
            <section id="faq">
              <h2 style={HEADING_FONT}>Teacher salary questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`faq-${i}`} className="border rounded-lg px-4 bg-white">
                    <AccordionTrigger className="text-left font-semibold text-navy">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Every salary on this page is taken from the state pages, each of which transcribes its state&rsquo;s
                  enterprise agreement, award or department salary schedule and records the date it was checked. Nothing
                  here is rounded, averaged or estimated. Catholic and independent school salaries are set by their own
                  agreements and are not covered. Take-home links go to the nearest $5,000 salary page.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={latestVerified} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h2 className="font-bold text-navy mb-3">Teacher pay by state</h2>
                  <div className="space-y-2">
                    {TEACHER_PAY_STATES.map((s) => (
                      <SidebarLink key={s.slug} href={`/teacher-pay-australia/${s.slug}/`} label={`${s.code} teacher salary`} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h2 className="font-bold text-navy mb-3">Related calculators</h2>
                  <div className="space-y-3">
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/hecs-help-calculator/" label="HECS Repayment Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/average-salary-australia/" label="Average Salary Australia" />
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

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}
