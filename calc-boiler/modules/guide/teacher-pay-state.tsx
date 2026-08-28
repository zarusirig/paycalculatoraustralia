"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator, AlertTriangle, Info } from "lucide-react";
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
  TEACHER_PAY_STATES,
  graduateSalary,
  isExactTakeHomeAmount,
  nearestTakeHomeAmount,
  takeHomeHref,
  topOfClassroomScale,
  type PayScale,
  type TeacherPayState,
} from "@/lib/data/teacher-pay";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

/**
 * A salary that also links to its take-home page. The site only generates
 * /take-home-pay-on/N/ in 5,000 steps, so where the salary is not itself a
 * round 5,000 the link is labelled as the nearest step rather than passed off
 * as the exact figure.
 */
function SalaryLink({ salary }: { salary: number }) {
  const nearest = nearestTakeHomeAmount(salary);
  const exact = isExactTakeHomeAmount(salary);
  const label = exact
    ? `See take-home pay on ${formatAUD(salary)}`
    : `See take-home pay on ${formatAUD(nearest)}, the nearest step to ${formatAUD(salary)}`;

  return (
    <Link
      href={takeHomeHref(salary)}
      title={label}
      aria-label={label}
      className="font-medium text-navy underline decoration-eucalyptus/40 decoration-dotted underline-offset-4 transition-colors hover:text-eucalyptus-dark hover:decoration-eucalyptus"
    >
      {formatAUD(salary)}
    </Link>
  );
}

function ScaleTable({ scale }: { scale: PayScale }) {
  return (
    <div className="not-prose my-8">
      <h3 className="mb-2 text-xl font-bold text-navy" style={HEADING_FONT} id={scale.id}>
        {scale.title}
      </h3>
      <p className="mb-4 text-warmgray">{scale.intro}</p>
      {scale.effectiveFrom && (
        <p className="mb-4 text-sm font-medium text-navy">
          Rates in this table took effect {scale.effectiveFrom}.
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[34rem] text-left text-sm text-warmgray">
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-5 py-3">
                {scale.stepHeading}
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                Annual salary
              </th>
              <th scope="col" className="px-5 py-3">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {scale.steps.map((step) => (
              <tr key={`${scale.id}-${step.label}`}>
                <th scope="row" className="px-5 py-3 text-left font-medium text-navy">
                  {step.label}
                </th>
                <td className="px-5 py-3 text-right">
                  <SalaryLink salary={step.salary} />
                </td>
                <td className="px-5 py-3 text-warmgray">{step.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-warmgray">
        Every salary links to its take-home figure. Where a salary is not a round $5,000 the link
        goes to the nearest amount the calculator publishes.
      </p>
    </div>
  );
}

export default function TeacherPayStatePage({ state }: { state: TeacherPayState }) {
  const grad = graduateSalary(state);
  const top = topOfClassroomScale(state);
  const hasScales = state.scales.length > 0;
  const authorship = getGuideAuthorship("teacher-pay-australia");

  const sourceLinks: SourceLink[] = state.sources.map((s) => ({
    title: s.title,
    url: s.url,
    publisher: s.publisher,
  }));

  const otherStates = TEACHER_PAY_STATES.filter((s) => s.slug !== state.slug);

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center space-x-1 text-sm text-warmgray">
            <li>
              <Link href="/" className="hover:text-eucalyptus-dark hover:underline">
                Pay Calculator
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-3 w-3 text-warmgray-light" />
            </li>
            <li>
              <Link
                href="/teacher-pay-australia/"
                className="hover:text-eucalyptus-dark hover:underline"
              >
                Teacher Pay Australia
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-3 w-3 text-warmgray-light" />
            </li>
            <li>
              <span className="font-medium text-navy" aria-current="page">
                {state.code} Teacher Salary
              </span>
            </li>
          </ol>
        </nav>

        {/* HERO */}
        <header className="mb-10 max-w-4xl lg:mb-16">
          <h1
            className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl"
            style={HEADING_FONT}
          >
            {state.code} Teacher Salary — {state.name} Public School Pay Scale
          </h1>
          {hasScales && grad !== null && top !== null ? (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">
              A graduate teacher in a {state.nameInSentence} public school is paid{" "}
              <strong className="text-navy">{formatAUD(grad)}</strong> a year, rising to{" "}
              <strong className="text-navy">{formatAUD(top)}</strong> at the top of the classroom
              teacher scale. Every figure on this page is read from the {state.agreementName} and
              applies from {state.ratesEffectiveFrom}.
            </p>
          ) : (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">
              The full salary scale for {state.nameInSentence} public school teachers could not be read from a
              primary source on {state.verifiedOn}. Rather than publish estimated numbers, this page
              tells you what is missing and points you at {state.employer}.
            </p>
          )}
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            {/* NOTICES */}
            {state.notices.length > 0 && (
              <div className="not-prose mb-8 space-y-3">
                {state.notices.map((notice) => (
                  <div
                    key={notice}
                    className="flex gap-3 rounded-lg border border-sandstone-dark/30 bg-sandstone/50 p-4"
                  >
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" />
                    <p className="text-sm text-navy">{notice}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── The agreement ── */}
            <section id="agreement">
              <h2 style={HEADING_FONT}>Which agreement sets {state.code} teacher pay</h2>
              <p>
                {state.nameInSentence} public school teacher salaries are set by the{" "}
                <a href={state.agreementUrl} target="_blank" rel="noreferrer noopener">
                  {state.agreementName}
                </a>
                , the instrument {state.employer} pays against. The rates below took effect from{" "}
                {state.ratesEffectiveFrom} and were read from that instrument on {state.verifiedOn}.
              </p>
              {state.nextIncrease && (
                <p>
                  <strong>Next scheduled increase:</strong> {state.nextIncrease.date}.{" "}
                  {state.nextIncrease.detail}
                </p>
              )}
              <p>
                These are the government (public) school scales. Catholic systemic and independent
                schools in {state.nameInSentence} negotiate their own agreements and are not covered here.
              </p>
            </section>

            {/* ── Pay scale tables ── */}
            {hasScales && (
              <section id="pay-scale">
                <h2 style={HEADING_FONT}>
                  {state.code} teacher pay scale — every classification and step
                </h2>
                <p>
                  Full-time annual salaries before tax and before superannuation. Part-time teachers
                  are paid these rates pro rata on their time fraction.
                </p>
                {state.scales.map((scale) => (
                  <ScaleTable key={scale.id} scale={scale} />
                ))}
              </section>
            )}

            {/* ── Casual rates ── */}
            {state.casual.length > 0 && (
              <section id="casual">
                <h2 style={HEADING_FONT}>Casual and relief teacher rates</h2>
                <p>
                  Casual teachers in {state.nameInSentence} are paid a fixed rate per engagement rather than an
                  annual salary.
                </p>
                <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-3">
                          Classification
                        </th>
                        <th scope="col" className="px-5 py-3 text-right">
                          Rate
                        </th>
                        <th scope="col" className="px-5 py-3">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {state.casual.map((rate) => (
                        <tr key={rate.label}>
                          <th scope="row" className="px-5 py-3 text-left font-medium text-navy">
                            {rate.label}
                          </th>
                          <td className="px-5 py-3 text-right font-medium text-navy">
                            {formatAUD(rate.rate, 2)} per {rate.unit}
                          </td>
                          <td className="px-5 py-3">{rate.note ?? ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>
                  To turn a daily rate into an annual equivalent, and then into take-home pay, use
                  the <Link href={`/pay-calculator-${state.slug}/`}>{state.code} pay calculator</Link>.
                </p>
              </section>
            )}

            {/* ── Which step am I on ── */}
            {state.progression.length > 0 && (
              <section id="which-step">
                <h2 style={HEADING_FONT}>Which step am I on?</h2>
                <p>
                  This is the part most teachers get wrong on their own payslip. Progression in{" "}
                  {state.nameInSentence} is not simply one step per calendar year — the rules below are what{" "}
                  {state.employer} actually applies.
                </p>
                {state.progression.map((rule) => (
                  <div key={rule.heading} className="mb-6">
                    <h3 className="text-lg font-bold text-navy" style={HEADING_FONT}>
                      {rule.heading}
                    </h3>
                    {rule.body.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                ))}
                <div className="not-prose my-8 rounded-lg border border-sandstone-dark/20 bg-sandstone/40 p-5">
                  <p className="text-sm text-navy">
                    <strong>Checking your payslip:</strong> find the classification code on your
                    payslip, match it to the first column of the tables above, and compare the
                    annual figure. If your gross fortnightly pay does not divide back to the annual
                    salary for your step, you are either on the wrong step or being paid pro rata on
                    a time fraction. The{" "}
                    <Link href={`/pay-calculator-${state.slug}/`}>{state.code} pay calculator</Link>{" "}
                    will convert an annual salary to fortnightly for you.
                  </p>
                </div>
              </section>
            )}

            {/* ── After tax ── */}
            <section id="after-tax">
              <h2 style={HEADING_FONT}>What a {state.code} teacher salary is worth after tax</h2>
              {hasScales && grad !== null && top !== null ? (
                <p>
                  Gross salary is not what lands in your account. A graduate on{" "}
                  {formatAUD(grad)} and a top-of-scale teacher on {formatAUD(top)} both pay income
                  tax and the Medicare levy, and most also have a compulsory HECS-HELP repayment
                  deducted at these income levels. Every salary in the tables above links to its
                  take-home figure — start with{" "}
                  <Link href={takeHomeHref(grad)}>
                    take-home pay on {formatAUD(nearestTakeHomeAmount(grad))}
                  </Link>{" "}
                  or{" "}
                  <Link href={takeHomeHref(top)}>
                    take-home pay on {formatAUD(nearestTakeHomeAmount(top))}
                  </Link>
                  .
                </p>
              ) : (
                <p>
                  Once you know your gross salary from {state.employer}, put it through the
                  calculator to see income tax, the Medicare levy and any HECS-HELP repayment.
                </p>
              )}
              <p>
                Superannuation sits on top of these salaries rather than inside them. Check the exact
                figure for your own step with the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>, and if you
                have a study debt the{" "}
                <Link href="/hecs-help-calculator/">HECS repayment calculator</Link> shows what
                comes out at your income.
              </p>
              <div className="not-prose my-8">
                <Link
                  href="/take-home-pay-calculator/"
                  className="inline-flex items-center gap-2 rounded-lg bg-eucalyptus-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-navy"
                >
                  <Calculator className="h-5 w-5" />
                  Calculate your {state.code} teacher take-home pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Salary packaging ── */}
            <section id="salary-packaging">
              <h2 style={HEADING_FONT}>Salary packaging available to {state.code} teachers</h2>
              <p>
                Public school teachers can salary sacrifice into superannuation, which reduces
                taxable income at your marginal rate. Because the classroom teacher scale runs
                through the 30% and 37% brackets, the saving is meaningful at the top of the scale
                and smaller at the graduate step. Work out your own number with the{" "}
                <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link>.
              </p>
              <p>
                Salary sacrificing also lowers the income your compulsory HECS-HELP repayment is
                assessed on only in limited cases — reportable fringe benefits and reportable super
                contributions are added back for that test. If you are packaging, check the effect on
                repayment income before assuming a saving.
              </p>
            </section>

            {/* ── What is not on this page ── */}
            {state.unverified.length > 0 && (
              <section id="not-shown">
                <h2 style={HEADING_FONT}>What this page does not show</h2>
                <p>
                  We publish only what we could read from a primary source. These are deliberately
                  left off rather than estimated:
                </p>
                <ul>
                  {state.unverified.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  For anything in that list, go to{" "}
                  <a href={state.agreementUrl} target="_blank" rel="noreferrer noopener">
                    {state.employer}
                  </a>
                  .
                </p>
              </section>
            )}

            {/* ── FAQ ── */}
            {state.faqs.length > 0 && (
              <section id="faq">
                <h2 style={HEADING_FONT}>{state.code} teacher salary questions</h2>
                <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                  {state.faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.q}
                      value={`faq-${index}`}
                      className="rounded-lg border bg-white px-4"
                    >
                      <AccordionTrigger className="text-left font-semibold text-navy">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* ── Other states ── */}
            <section id="other-states">
              <h2 style={HEADING_FONT}>Teacher salaries in other states</h2>
              <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {otherStates.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/teacher-pay-australia/${other.slug}/`}
                    className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-4 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
                  >
                    <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">
                      {other.code} teacher salary
                    </span>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                  </Link>
                ))}
              </div>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Every salary on this page was read from the {state.agreementName} or from{" "}
                  {state.employer}&rsquo;s own published salary schedule on {state.verifiedOn}, and
                  applies from {state.ratesEffectiveFrom}. Nothing is estimated, averaged or
                  interpolated: a step we could not read from a primary source is listed under
                  &ldquo;What this page does not show&rdquo; rather than filled in.
                </p>
                <p>
                  State scales step up on dates written into the agreement, so re-check after the
                  next scheduled increase. Take-home figures come from the site&rsquo;s own
                  calculator using ATO rates; because those pages exist in $5,000 steps, a salary
                  that is not a round $5,000 links to the nearest one and says so.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sourceLinks} lastVerified={state.verifiedOn} />
              {authorship ? (
                <AuthorBox
                  author={authorship.author}
                  reviewer={authorship.reviewer}
                  lastReviewed={authorship.lastReviewed}
                />
              ) : null}
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">{state.code} teacher pay at a glance</h3>
                  <dl className="space-y-3 text-sm">
                    {hasScales && grad !== null && (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">Graduate</dt>
                        <dd className="font-semibold text-navy">{formatAUD(grad)}</dd>
                      </div>
                    )}
                    {hasScales && top !== null && (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">Top of classroom scale</dt>
                        <dd className="font-semibold text-navy">{formatAUD(top)}</dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Rates from</dt>
                      <dd className="text-right font-semibold text-navy">
                        {state.ratesEffectiveFrom}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Verified</dt>
                      <dd className="font-semibold text-navy">{state.verifiedOn}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {!hasScales && (
                <Card className="border-sandstone-dark/30 bg-white">
                  <CardContent className="flex gap-3 p-6">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" />
                    <p className="text-sm text-warmgray">
                      No verified scale is published for {state.nameInSentence} yet. We would rather show
                      nothing than a guessed salary.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Related calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink
                      href="/salary-sacrifice-calculator/"
                      label="Salary Sacrifice Calculator"
                    />
                    <SidebarLink href="/hecs-help-calculator/" label="HECS Repayment Calculator" />
                    <SidebarLink
                      href={`/pay-calculator-${state.slug}/`}
                      label={`${state.code} Pay Calculator`}
                    />
                    <SidebarLink href="/teacher-pay-australia/" label="Teacher Pay Australia" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold">Check your step against your payslip</h3>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    Enter the annual salary for your step and see the fortnightly gross and net your
                    payslip should show.
                  </p>
                  <Link
                    href="/take-home-pay-calculator/"
                    className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50"
                  >
                    Calculate take-home pay
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
