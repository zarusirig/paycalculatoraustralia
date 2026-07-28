"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { HECS_HELP, SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";

// This guide deliberately does NOT carry a threshold rate table. It used to,
// and it cannibalised /hecs-repayment-threshold/ — a 2,907-word omnibus sitting
// at #40 while 300-500 word competitors held the top five. Thresholds and rates
// belong to /hecs-repayment-threshold/; the calculator and the full scheme list
// belong to /hecs-help-calculator/. Keep this page on how the loan behaves.

const ATO_THRESHOLDS_URL =
  "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds";
const ATO_INDEXATION_URL =
  "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates";
const ATO_OVERSEAS_URL =
  "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/overseas-repayments";
const ATO_VOLUNTARY_URL =
  "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/voluntary-repayments";
const ATO_WHATS_NEW_URL =
  "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/study-and-training-loans-what-s-new";

const SOURCES_LIST: SourceLink[] = [
  { title: "Study and training loan indexation rates (QC18714)", url: ATO_INDEXATION_URL, publisher: SOURCES.ato.name },
  { title: "Overseas obligations when repaying loans (QC47358)", url: ATO_OVERSEAS_URL, publisher: SOURCES.ato.name },
  { title: "Voluntary repayments", url: ATO_VOLUNTARY_URL, publisher: SOURCES.ato.name },
  { title: "Study and training loans – what's new (QC59241)", url: ATO_WHATS_NEW_URL, publisher: SOURCES.ato.name },
  { title: "Study and training loan repayment thresholds and rates (QC16176)", url: ATO_THRESHOLDS_URL, publisher: SOURCES.ato.name },
];

// ATO published indexation rates, QC18714. 2023 and 2024 were recalculated
// under the CPI-or-WPI cap; the original figures are shown for context.
const INDEXATION_HISTORY = [
  { year: "2026", rate: "2.8%", note: "" },
  { year: "2025", rate: "3.2%", note: "" },
  { year: "2024", rate: "4%", note: "recalculated from 4.7%" },
  { year: "2023", rate: "3.2%", note: "recalculated from 7.1%" },
  { year: "2022", rate: "3.9%", note: "" },
  { year: "2021", rate: "0.6%", note: "" },
];

export interface GuideFaq {
  q: string;
  a: string;
}

export default function HecsHelpGuidePage({ faqs }: { faqs: readonly GuideFaq[] }) {
  const authorship = getGuideAuthorship("hecs-help-guide");

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">HECS-HELP Guide</span></li>
          </ol>
        </nav>

        {/* HERO */}
        <header className="mb-10 lg:mb-14 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            HECS-HELP Explained: How the Loan Actually Works
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            No interest, no fixed term, no repayment until you earn enough. A study loan behaves unlike any other debt you will hold, and the parts that catch people out are indexation timing, voluntary repayments and what happens when you move overseas.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* Threshold intent is handled elsewhere — point at it, do not repeat it. */}
            <div className="not-prose mb-8 rounded-r-xl border-l-4 border-eucalyptus bg-eucalyptus-light/40 p-5">
              <h2 className="mb-1 text-base font-bold text-navy">Looking for the repayment threshold?</h2>
              <p className="mb-3 text-sm text-navy">
                Compulsory repayments start at <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> of repayment income in {SITE_CONFIG.financialYear}, then rise through three marginal bands. The full ATO table, what counts as repayment income and the figures for every band live on one page.
              </p>
              <Link href="/hecs-repayment-threshold/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                HECS repayment threshold {SITE_CONFIG.financialYear} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* SECTION 1 */}
            <section id="what-is-hecs-help">
              <h2>What Is HECS-HELP?</h2>
              <p>
                HECS-HELP is the loan that covers the student contribution for a Commonwealth-supported place at an Australian university. It is one of several loans under the <strong>Higher Education Loan Program (HELP)</strong>, alongside FEE-HELP for full-fee places, OS-HELP for study overseas and SA-HELP for student services and amenities fees.
              </p>
              <p>
                What makes it unusual is that it is <em>income-contingent</em>. The government charges no interest and sets no repayment date. You repay nothing at all until your income reaches a threshold, and if it never does, you never make a compulsory repayment. The balance is instead adjusted once a year by indexation, which keeps its real value steady rather than growing it.
              </p>
              <p>
                HELP is not the only loan the ATO collects this way. VET Student Loans, the old Student Financial Supplement Scheme, Student Start-up Loans, ABSTUDY SSL and the Australian Apprenticeship Support Loan all run on the same repayment machinery — our <Link href="/hecs-help-calculator/">HECS repayment calculator</Link> sets out all six schemes and the order the ATO clears them in.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="how-repayments-work">
              <h2>How a Repayment Reaches the ATO</h2>
              <p>
                Nothing about the process is manual. Your employer withholds an estimate each pay; the ATO works out the real number after you lodge; the difference lands in your refund or your bill.
              </p>
              <ol>
                <li><strong>You declare the loan.</strong> Tick the study and training support loan box on your <Link href="/tax-file-number-declaration/">tax file number declaration</Link> when you start a job. Miss it and nothing is withheld all year.</li>
                <li><strong>Your employer withholds.</strong> An extra PAYG amount is taken from each pay, shown on your payslip as <strong>STSL</strong>. It is calculated from that pay period&rsquo;s earnings as though you earned the same amount every period.</li>
                <li><strong>You lodge your return.</strong> The ATO works out your repayment income for the whole year — which is wider than salary — and applies the rates to it.</li>
                <li><strong>The ATO reconciles.</strong> Withheld more than you owed? It comes back in your refund. Less? It is added to your bill. Multiple employers each withhold independently, which is the usual cause of a surprise.</li>
                <li><strong>Your balance drops.</strong> The confirmed repayment is applied to your loan after the assessment issues, not during the year.</li>
              </ol>
              <p>
                The gap between the payslip figure and the assessed figure is the single most common source of confusion. Our guide to <Link href="/stsl-on-payslip/">STSL on your payslip</Link> works through a real payslip and explains how to stop the deduction once the loan is cleared.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="indexation">
              <h2>How Indexation Works</h2>
              <p>
                Indexation is applied on <strong>1 June each year</strong>, and only to the part of your balance that has been unpaid for more than 11 months. The rate is the <strong>lower of CPI or the Wage Price Index</strong>, which means a study loan cannot grow faster than wages.
              </p>
              <p>
                That cap was introduced after the June 2023 indexation came in at 7.1% under a CPI-only formula. It was backdated, and the ATO recalculated both 2023 and 2024, crediting the difference to affected balances.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-6 py-3">Applied 1 June</th>
                        <th scope="col" className="px-6 py-3">Indexation rate</th>
                        <th scope="col" className="px-6 py-3">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {INDEXATION_HISTORY.map((row) => (
                        <tr key={row.year}>
                          <td className="px-6 py-3 font-medium tabular-nums">{row.year}</td>
                          <td className="px-6 py-3 font-semibold tabular-nums">{row.rate}</td>
                          <td className="px-6 py-3 text-warmgray">{row.note || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  ATO, <a href={ATO_INDEXATION_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">Study and training loan indexation rates</a>.
                </p>
              </div>
              <p>
                One quirk matters for timing. Compulsory repayments made through PAYG during the year are not credited to your loan until your return is assessed — usually after 1 June. So the balance that gets indexed is often larger than the balance you think you have.
              </p>
              <p>
                Separately, every study and training support debt that existed on 1 June 2025 received a one-off <strong>20% reduction</strong>. The ATO has finished processing it, and accounts left in credit were refunded.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="voluntary-repayments">
              <h2>Are Voluntary Repayments Worth It?</h2>
              <p>
                A voluntary repayment reduces the principal and nothing else. There is no discount or bonus for paying early — that ended years ago — so the whole decision is a rate comparison: {HECS_HELP.indexationRate * 100}% indexation in {HECS_HELP.indexationDate.slice(-4)} against whatever else that money could do.
              </p>
              <p>
                On those numbers, most other debt beats it. Credit cards, car loans and personal loans all cost several times the indexation rate, and clearing them first is straightforwardly better. The argument for paying down a study loan early is usually not the interest maths.
              </p>
              <p>Where it does stack up:</p>
              <ul>
                <li><strong>You are applying for a mortgage.</strong> Lenders treat the compulsory repayment as a fixed commitment and it reduces borrowing capacity, so clearing a small balance can buy back more than the indexation you save.</li>
                <li><strong>The balance is nearly gone.</strong> Finishing it removes the STSL deduction from every pay for the rest of the year.</li>
                <li><strong>You are leaving Australia.</strong> The obligation follows you, and reporting worldwide income each year from abroad is an ongoing chore.</li>
              </ul>
              <p className="not-prose my-6 rounded-r-xl border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy">
                <strong>Timing beats amount.</strong> Indexation is applied to the balance on 1 June. A payment on 31 May reduces what gets indexed; the same payment on 2 June does not. Allow processing time — BPAY to the ATO is not instant.
              </p>
              <p>
                Weighing it against extra super instead? We modelled both in <Link href="/extra-super-vs-hecs-repayment/">extra super vs HECS repayment</Link>, and note that salary sacrificing does <em>not</em> reduce your compulsory repayment — reportable super contributions are added back into repayment income.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="overseas">
              <h2>What Happens If You Move Overseas?</h2>
              <p>
                The debt does not stay behind. If you have a <strong>HELP, VSL or AASL</strong> loan and you intend to reside outside Australia for <strong>183 days or more in any 12-month period</strong>, you must lodge an <em>overseas travel notification</em> within <strong>7 days of leaving</strong> and keep your contact details current with the ATO.
              </p>
              <p>
                From then on you report your <strong>worldwide income</strong> each year by <strong>31 October</strong>. If it is at or below 25% of the minimum repayment threshold, you lodge a non-lodgment advice instead. Above that, the same thresholds and rates that apply in Australia apply to your worldwide income, collected either as a compulsory repayment or as an overseas levy.
              </p>
              <p>
                Non-residents choose one of three methods to work out the foreign-sourced part: simple self-assessment with a standard occupation-based deduction, the overseas assessed method using a foreign tax assessment, or a comprehensive tax-based assessment. Indexation continues on 1 June wherever you live.
              </p>
              <p className="text-sm">
                Detail and forms: ATO, <a href={ATO_OVERSEAS_URL} target="_blank" rel="noopener noreferrer">Overseas obligations when repaying loans</a>.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="key-dates">
              <h2>Dates That Matter</h2>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">What happens</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3 font-medium">Census date</td><td className="px-6 py-3">Set by your university, per teaching period. Withdraw before it and no debt is incurred; withdraw after and the full subject cost is added.</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Before 1 June</td><td className="px-6 py-3">Last useful moment for a voluntary repayment to reduce the balance that gets indexed.</td></tr>
                      <tr><td className="px-6 py-3 font-medium">1 June</td><td className="px-6 py-3">Indexation applied to the part of the balance unpaid for more than 11 months.</td></tr>
                      <tr><td className="px-6 py-3 font-medium">1 July</td><td className="px-6 py-3">New income year. Thresholds and rates are re-indexed for the year ahead.</td></tr>
                      <tr><td className="px-6 py-3 font-medium">31 October</td><td className="px-6 py-3">Self-lodgers&rsquo; return deadline, and the deadline for reporting worldwide income from overseas.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 7 */}
            <section id="where-next">
              <h2>Where to Find the Numbers</h2>
              <p>
                This guide stays on how the loan behaves. The figures live on two purpose-built pages, both driven by the same verified ATO constants:
              </p>
              <ul>
                <li><Link href="/hecs-repayment-threshold/">HECS repayment threshold {SITE_CONFIG.financialYear}</Link> — the threshold, the marginal bands and what counts as repayment income.</li>
                <li><Link href="/hecs-help-calculator/">HECS repayment calculator</Link> — your exact repayment, plus all six loan schemes and the order they are repaid.</li>
                <li><Link href="/stsl-on-payslip/">STSL on your payslip</Link> — why the withheld amount differs from the assessed one.</li>
                <li><Link href="/take-home-pay-calculator/">Take-home pay calculator</Link> — net pay with income tax, Medicare, super and the study loan together.</li>
              </ul>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              {/* Radix unmounts closed accordion content, so answers would never
                  reach the rendered HTML. This mirror makes them crawlable. */}
              <div className="sr-only">
                <h3>HECS-HELP questions and answers</h3>
                {faqs.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-navy">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose space-y-6">
              <MethodologyDisclosure title="How this guide is maintained">
                <p>
                  Indexation rates, the overseas reporting rules and the loan list come from the ATO pages cited below, read directly rather than summarised from secondary sources. Any threshold figure shown here is read from the same constants file that drives our calculator, so this page cannot disagree with it. Rates and thresholds are not restated in full here by design — they are maintained on <a href="/hecs-repayment-threshold/">the threshold page</a>, which is the page we keep current each 1 July.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h2 className="font-bold text-navy mb-3 text-base">Related</h2>
                  <div className="space-y-3">
                    <SidebarLink href="/hecs-repayment-threshold/" label={`Repayment Threshold ${SITE_CONFIG.financialYear}`} />
                    <SidebarLink href="/hecs-help-calculator/" label="HECS Repayment Calculator" />
                    <SidebarLink href="/stsl-on-payslip/" label="STSL on Your Payslip" />
                    <SidebarLink href="/extra-super-vs-hecs-repayment/" label="Extra Super vs HECS" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-2">What will it cost you?</h2>
                  <p className="text-eucalyptus-light text-sm mb-4">Work out the compulsory repayment on your income, and what your pay looks like after it.</p>
                  <Link href="/hecs-help-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Open the calculator
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
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}
