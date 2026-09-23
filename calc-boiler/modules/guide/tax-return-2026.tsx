import Link from "next/link";
import { ChevronRight, AlertTriangle, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SOURCES, formatAUD, formatPercent } from "@/lib/constants";
import {
  HECS_HELP_2025_26,
  MEDICARE_LEVY,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
} from "@/lib/constants/australian-tax";
import {
  MLS_2025_26_SINGLE,
  RETURN_2026,
  RETURN_2026_SOURCES,
  estimateReturn2025_26,
} from "@/lib/constants/tax-return-2025-26";
import { TAX_RETURN_2026_FAQS } from "@/modules/guide/tax-return-2026-faqs";
import RefundEstimator2026 from "@/modules/guide/tax-return-2026-estimator";

const R = RETURN_2026;
const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const pct = (v: number) => `${+(v * 100).toFixed(2)}%`;

const SOURCES_LIST: SourceLink[] = [
  { title: "Lodge your tax return online with myTax", url: RETURN_2026_SOURCES.myTax, publisher: SOURCES.ato.name },
  { title: "Lodge your tax return with a registered tax agent", url: RETURN_2026_SOURCES.taxAgent, publisher: SOURCES.ato.name },
  { title: "Registered agent lodgment program: individuals and trusts", url: RETURN_2026_SOURCES.agentProgram, publisher: SOURCES.ato.name },
  { title: "Check the progress of your tax return", url: RETURN_2026_SOURCES.progress, publisher: SOURCES.ato.name },
  { title: "Working from home: fixed rate method", url: RETURN_2026_SOURCES.wfh, publisher: SOURCES.ato.name },
  { title: "Study and training loans: what's new", url: RETURN_2026_SOURCES.studyLoans, publisher: SOURCES.ato.name },
  { title: "Medicare levy surcharge income thresholds and rates", url: RETURN_2026_SOURCES.mls, publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: RETURN_2026_SOURCES.rates, publisher: SOURCES.ato.name },
];

const EXAMPLE_INCOMES = [30_000, 45_000, 60_000, 80_000, 100_000, 120_000, 150_000, 200_000];

export default function TaxReturn2026Page() {
  const authorship = getGuideAuthorship("tax-return-2026");
  const oldRate = TAX_BRACKETS_2025_26[1].rate;
  const newRate = TAX_BRACKETS[1].rate;
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/tax-refund-guide/" className="hover:text-eucalyptus-dark hover:underline">Tax Returns</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Tax Return 2026</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 style={H} className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Tax Return 2026: Deadline, Refund Estimate and 2025-26 Tax Rates
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            Your 2026 tax return covers {R.incomeYearStart} to {R.incomeYearEnd}. Here is when it is due, how long the refund takes, what changed this year, and a refund estimator that uses the {R.incomeYear} rates your return is actually assessed on.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> If you lodge your own 2026 tax return, it is due by <strong>{R.selfLodgeDueDate}</strong>. If you use a registered tax agent and are on their client list before then, you usually have until <strong>{R.agentDueDateMostPeople}</strong>. Most returns lodged online through myTax are processed in {R.onlineProcessingBusinessDays} business days, and most refunds are issued within {R.onlineRefundTypical}.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section className="not-prose mb-10">
              <RefundEstimator2026 />
              <Link
                href="/tax-return-calculator/"
                className="mt-4 flex items-center justify-between gap-4 rounded-xl border-2 border-eucalyptus bg-eucalyptus-light/30 p-5 transition-shadow hover:shadow-md"
              >
                <span>
                  <span className="block font-semibold text-navy">Need the full breakdown? Use the tax return calculator</span>
                  <span className="block text-sm text-warmgray">It defaults to the {R.incomeYear} rates this return is assessed on, and switches to 2026-27 when you want to plan next year.</span>
                </span>
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-eucalyptus-dark" aria-hidden="true" />
              </Link>
            </section>

            <section id="deadlines">
              <h2 style={H}>2026 tax return deadlines</h2>
              <div className="not-prose overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-sandstone text-navy"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">What happens</th></tr></thead>
                  <tbody className="divide-y divide-sandstone-dark/20 text-warmgray">
                    <tr><td className="px-4 py-3 font-medium text-navy">{R.incomeYearEnd}</td><td className="px-4 py-3">The {R.incomeYear} income year ends</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">Late July 2026</td><td className="px-4 py-3">The ATO has pre-filled most employer, bank, health fund and government data</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">{R.selfLodgeDueDate}</td><td className="px-4 py-3">Deadline if you lodge yourself. Also the last day to get on a tax agent&rsquo;s client list. Agent clients with a prior-year return still outstanding at 30 June 2026 are also due now.</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">{R.agentDueDateLargeLiability}</td><td className="px-4 py-3">Agent clients whose latest return had a tax liability of $20,000 or more</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">{R.agentDueDateMostPeople}</td><td className="px-4 py-3">Most other agent clients</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">{R.agentConcessionDate}</td><td className="px-4 py-3">Concession date for 15 May returns, if any payment is also made by then</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                The agent dates depend on your lodgment history, so your agent will confirm the one that applies to you. The ATO says to contact a new or different agent before {R.selfLodgeDueDate} to be included in their lodgment program. For every tax date in the year, including BAS and super, see the <Link href="/tax-calendar/">tax calendar</Link>.
              </p>
            </section>

            <section id="how-much-tax">
              <h2 style={H}>How much tax will I pay? 2025-26 tax rates</h2>
              <p>
                Your 2026 return is assessed on the {R.incomeYear} resident tax rates below. The Medicare levy of {pct(MEDICARE_LEVY.rate)} is added on top. People on low incomes pay a reduced levy or none, with the reduction starting at {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} for singles.
              </p>
              <div className="not-prose overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-sandstone text-navy"><tr><th className="px-4 py-3">Taxable income</th><th className="px-4 py-3">Tax on this income</th></tr></thead>
                  <tbody className="divide-y divide-sandstone-dark/20 text-warmgray">
                    {TAX_BRACKETS_2025_26.map((b) => (
                      <tr key={b.min}>
                        <td className="px-4 py-3 font-medium text-navy">{b.max === Infinity ? `${formatAUD(b.min)} and over` : `${formatAUD(b.min)} – ${formatAUD(b.max)}`}</td>
                        <td className="px-4 py-3">{b.rate === 0 ? "Nil" : b.base ? `${formatAUD(b.base)} plus ${b.label}` : b.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 style={H}>Tax on common incomes in 2025-26</h3>
              <div className="not-prose overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-sandstone text-navy"><tr><th className="px-4 py-3">Taxable income</th><th className="px-4 py-3">Income tax after LITO</th><th className="px-4 py-3">Medicare levy</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Average rate</th></tr></thead>
                  <tbody className="divide-y divide-sandstone-dark/20 text-warmgray">
                    {EXAMPLE_INCOMES.map((inc) => {
                      const e = estimateReturn2025_26({ grossIncome: inc, deductions: 0, taxWithheld: 0, hasPrivateHospitalCover: true, hasStudyLoan: false });
                      return (
                        <tr key={inc}>
                          <td className="px-4 py-3 font-medium text-navy">{formatAUD(inc)}</td>
                          <td className="px-4 py-3">{formatAUD(e.incomeTax - e.lito)}</td>
                          <td className="px-4 py-3">{formatAUD(e.medicareLevy)}</td>
                          <td className="px-4 py-3 font-semibold text-navy">{formatAUD(e.totalLiability)}</td>
                          <td className="px-4 py-3">{formatPercent(e.averageRate)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="not-prose my-6 flex items-start gap-3 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-ochre" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-navy">
                  <strong>Don&rsquo;t use a 2026-27 calculator for this return.</strong> The second tax rate fell from {pct(oldRate)} to {pct(newRate)} on 1 July 2026. That cut applies to pay from July 2026 onwards, not to this return. A current-year calculator will show up to $268 less tax than your 2026 return. Our <Link href="/tax-return-calculator/" className="font-medium text-eucalyptus-dark hover:underline">tax return calculator</Link> uses the {R.incomeYear} rates by default. For pay you are earning now, use the <Link href="/income-tax-calculator/" className="font-medium text-eucalyptus-dark hover:underline">income tax calculator</Link> or see the <Link href="/tax-changes-2026-27/" className="font-medium text-eucalyptus-dark hover:underline">2026-27 tax changes</Link>.
                </p>
              </div>
            </section>

            <section id="what-changed">
              <h2 style={H}>What changed for 2025-26 returns</h2>
              <ul>
                <li><strong>Tax rates:</strong> the same as 2024-25. The {pct(oldRate)} rate on $18,201 to $45,000 still applies. The cut to {pct(newRate)} starts with the 2026-27 year.</li>
                <li><strong>Study loans:</strong> from {R.incomeYear}, compulsory repayments only start above {formatAUD(HECS_HELP_2025_26.minimumThreshold)} of repayment income. They are also worked out only on the income above that amount, instead of on your whole income. Separately, a one-off {R.helpReductionPercent}% cut was applied to every study loan debt that existed on {R.helpReductionDebtsAsAt}. The ATO has finished processing it. Model your repayment with the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>.</li>
                <li><strong>Medicare levy surcharge:</strong> the singles threshold is {formatAUD(MLS_2025_26_SINGLE[0].min - 1)} for {R.incomeYear}. Above it, you pay {pct(MLS_2025_26_SINGLE[0].rate)} to {pct(MLS_2025_26_SINGLE[2].rate)} if you don&rsquo;t have private hospital cover. See <Link href="/private-health-insurance-medicare/">private health insurance and Medicare</Link>.</li>
                <li><strong>Working from home:</strong> the fixed rate stays at {R.wfhFixedRateCents} cents an hour for {R.incomeYear}. You need a record of your actual hours for the whole year. See the <Link href="/work-from-home-deductions/">work from home deductions guide</Link>.</li>
              </ul>
            </section>

            <section id="refund-timing">
              <h2 style={H}>How long will my 2026 tax refund take?</h2>
              <p>
                The ATO says most myTax returns are processed in {R.onlineProcessingBusinessDays} business days and most refunds are issued within {R.onlineRefundTypical}. Paper returns take much longer: most refunds are issued within {R.paperRefundBusinessDays} business days. A return can take longer if the ATO needs to check something, or if the refund goes toward another tax or government debt first. You can track your return in ATO online services through myGov or in the ATO app. When it is finished, your <Link href="/notice-of-assessment/">notice of assessment</Link> shows how the refund was worked out.
              </p>
            </section>

            <section id="how-to-lodge">
              <h2 style={H}>Lodging with myTax or a tax agent</h2>
              <div className="not-prose grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
                  <div className="mb-2 flex items-center gap-2"><CalendarDays className="h-5 w-5 text-eucalyptus-dark" aria-hidden="true" /><h3 className="font-semibold text-navy">myTax (lodge yourself)</h3></div>
                  <p className="text-sm text-warmgray">Free and done online through myGov. Most details are pre-filled. It&rsquo;s due {R.selfLodgeDueDate}.</p>
                </div>
                <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
                  <div className="mb-2 flex items-center gap-2"><CalendarDays className="h-5 w-5 text-eucalyptus-dark" aria-hidden="true" /><h3 className="font-semibold text-navy">Registered tax agent</h3></div>
                  <p className="text-sm text-warmgray">Usually due {R.agentDueDateMostPeople} if you are on their list by {R.selfLodgeDueDate}. Registered agents are the only people who can charge a fee to prepare your return, and the fee is deductible in the year you pay it.</p>
                </div>
              </div>
              <p>
                Getting a big refund usually means too much tax was withheld from your pay. To see how withholding and refunds work, and the deductions people most often miss, read the <Link href="/tax-refund-guide/">tax refund guide</Link>.
              </p>
            </section>

            <section id="faq">
              <h2 style={H}>Tax return 2026 FAQs</h2>
              <div className="sr-only">
                {TAX_RETURN_2026_FAQS.map((f) => (<div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {TAX_RETURN_2026_FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How the estimate is calculated">
                <p>
                  The estimator applies the {R.incomeYear} resident tax rates, the low income tax offset and the {R.incomeYear} Medicare levy thresholds from the site&rsquo;s tax-constants file. It adds the {R.incomeYear} surcharge tiers and study loan bands where they apply. It does not use the site&rsquo;s current-year engine, which runs on 2026-27 rates. The figures are covered by tests, including the published 2025-26 bracket amounts: {formatAUD(4_288)} at $45,000, {formatAUD(31_288)} at $135,000 and {formatAUD(51_638)} at $190,000. The dates come from the ATO&rsquo;s myTax page (updated 22 September 2026) and the registered agent lodgment program for 2026-27.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">2026 return at a glance</h2>
                  <dl className="space-y-3 text-sm">
                    {[
                      { t: "Income year", d: `${R.incomeYearStart} to ${R.incomeYearEnd}` },
                      { t: "Lodge yourself by", d: R.selfLodgeDueDate },
                      { t: "With a tax agent", d: `Usually ${R.agentDueDateMostPeople}` },
                      { t: "Online refund", d: `Most within ${R.onlineRefundTypical}` },
                      { t: "WFH fixed rate", d: `${R.wfhFixedRateCents}c per hour` },
                      { t: "Study loan threshold", d: formatAUD(HECS_HELP_2025_26.minimumThreshold) },
                    ].map((row) => (
                      <div key={row.t} className="rounded-lg border border-sandstone-dark/20 bg-white p-3">
                        <dt className="font-medium text-navy">{row.t}</dt>
                        <dd className="text-warmgray">{row.d}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold">Related guides</h2>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/tax-return-calculator/" className="text-white underline hover:text-eucalyptus-light">Tax return calculator ({R.incomeYear})</Link></li>
                    <li><Link href="/tax-refund-guide/" className="text-white underline hover:text-eucalyptus-light">Tax refund guide</Link></li>
                    <li><Link href="/tax-calendar/" className="text-white underline hover:text-eucalyptus-light">Tax calendar</Link></li>
                    <li><Link href="/tax-deductions-guide/" className="text-white underline hover:text-eucalyptus-light">Tax deductions guide</Link></li>
                    <li><Link href="/tax-brackets/" className="text-white underline hover:text-eucalyptus-light">Tax brackets</Link></li>
                    <li><Link href="/notice-of-assessment/" className="text-white underline hover:text-eucalyptus-light">Notice of assessment</Link></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
