"use client";

import Link from "next/link";
import { ChevronRight, AlertTriangle, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  GENERAL_INTEREST_CHARGE,
  PAYDAY_SUPER_CAP_RELIEF,
  QUALIFYING_EARNINGS,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
} from "@/lib/constants/australian-tax";
import { SGC_FAQS } from "@/modules/guide/super-guarantee-charge-faqs";

const C = SUPER_GUARANTEE_CHARGE.current;
const L = SUPER_GUARANTEE_CHARGE.legacy;
const pct = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 2)}%`;

const SOURCES_LIST: SourceLink[] = [
  { title: "What happens if you don't pay super correctly (QC105848)", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/missed-or-late-payday-super-payments/what-happens-if-you-dont-pay-super-correctly", publisher: SOURCES.ato.name },
  { title: "Payment deadlines for Payday Super (QC105846)", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/payment-deadlines-for-payday-super", publisher: SOURCES.ato.name },
  { title: "What payments are qualifying earnings (QC105843)", url: QUALIFYING_EARNINGS.sourceUrl, publisher: SOURCES.ato.name },
  { title: "General interest charge rates (QC16145)", url: GENERAL_INTEREST_CHARGE.sourceUrl, publisher: SOURCES.ato.name },
];

export default function SuperGuaranteeChargePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/superannuation-guide/" className="hover:text-eucalyptus-dark hover:underline">Superannuation</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Super Guarantee Charge</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Super Guarantee Charge &mdash; What Late Super Actually Costs
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            Payday Super commenced on {SUPER_GUARANTEE.paydaySuperStart} and rebuilt the super guarantee charge from the ground up. Here is what the charge is now made of, when super is actually due, and what changed.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> If super is not received by your employee&rsquo;s fund within <strong>{C.businessDaysToPay} business days</strong> of payday, you owe the super guarantee charge. It has four components: the shortfall, notional earnings at the general interest charge rate ({pct(GENERAL_INTEREST_CHARGE.annualRate)} for {GENERAL_INTEREST_CHARGE.quarter}) compounded daily, an administrative uplift of up to <strong>{pct(C.administrativeUpliftMax)}</strong>, and a choice loading. Unlike the old quarterly charge, it is now <strong>tax-deductible</strong> &mdash; and you no longer lodge a statement.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">

            {/* TIME-CRITICAL: the last legacy statement is due 28 August 2026 */}
            <section id="final-statement">
              <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <div className="flex items-start gap-4">
                  <Clock className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                  <div>
                    <h2 className="mb-2 text-base font-bold text-navy">The last-ever quarterly SGC statement is due {L.finalQuarterStatementDue}</h2>
                    <p className="text-sm leading-relaxed text-navy">
                      The June 2026 quarter was the final one under the old rules. Its SG payment was due {L.finalQuarterSGDue}. If you missed that, you must lodge a super guarantee charge statement and pay the charge by <strong>{L.finalQuarterStatementDue}</strong>, under the old regime and at the old rates. Two traps on the way out: the late payment offset is <strong>not available</strong> for this final quarter, and contributions received on or after <strong>{L.tooLateForJuneQuarter}</strong> cannot be applied to it at all.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="what-is-sgc">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Super Guarantee Charge?</h2>
              <p>
                The super guarantee charge is what an employer owes the ATO when super is not paid in full and on time. It is designed to cost more than paying the super would have, and under Payday Super it is assessed <strong>per payday</strong> rather than per quarter &mdash; so a single misconfigured pay run can generate a charge every fortnight until it is fixed.
              </p>
              <p>
                Since {SUPER_GUARANTEE.paydaySuperStart} the charge has exactly <strong>four components</strong>:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[32rem] text-left text-sm text-navy">
                    <caption className="sr-only">The four components of the super guarantee charge under Payday Super</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-3">Component</th>
                        <th scope="col" className="px-5 py-3">Amount</th>
                        <th scope="col" className="px-5 py-3">Can it be reduced?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Individual final SG shortfall</th>
                        <td className="px-5 py-3">The super that should have been paid</td>
                        <td className="px-5 py-3 text-warmgray">No</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Notional earnings</th>
                        <td className="px-5 py-3">{pct(GENERAL_INTEREST_CHARGE.annualRate)} ({GENERAL_INTEREST_CHARGE.quarter}), compounded daily</td>
                        <td className="px-5 py-3 text-warmgray">Only by paying sooner</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Administrative uplift</th>
                        <td className="px-5 py-3">Up to {pct(C.administrativeUpliftMax)} of shortfall + notional earnings</td>
                        <td className="px-5 py-3 font-medium">Yes &mdash; to nil</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Choice loading</th>
                        <td className="px-5 py-3">{pct(C.choiceLoading)} of the {C.choiceLoadingBasis}, max {formatAUD(C.choiceLoadingCap)} per {C.choiceLoadingCapBasis}</td>
                        <td className="px-5 py-3 text-warmgray">Only by following choice rules</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                <strong>The late payment penalty is not one of them.</strong> It is widely listed as a fifth component and it is not &mdash; it arises separately and much later. See below.
              </p>
            </section>

            <section id="deadlines">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Is Super Actually Due?</h2>
              <p>
                Within <strong>{C.businessDaysToPay} business days</strong> of payday &mdash; but the test is when the money is <em>received</em> by the employee&rsquo;s fund, not when you send it. Clearing house and fund processing time counts against you, which is the single most common way a compliant-looking payroll still generates a charge.
              </p>
              <p>
                A longer <strong>{C.businessDaysNewEmployee} business day</strong> deadline covers two situations, not one: a new employee, and a first contribution to a new complying fund for an existing employee after you stopped contributing to another. And a business day excludes weekends and public holidays &mdash; a public holiday anywhere in Australia removes a day nationally, so a state you do not operate in can still move your deadline.
              </p>
            </section>

            <section id="administrative-uplift">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Get the Administrative Uplift to Nil</h2>
              <p>
                This is the largest lever available once a shortfall has happened, and it is routinely described wrongly as a single all-or-nothing test. There are <strong>two independent reductions and they stack</strong>. The uplift starts at {pct(C.administrativeUpliftMax)}:
              </p>
              <ul>
                <li><strong>No ATO-initiated assessment</strong> in the two years to that payday removes <strong>20 percentage points</strong>. SGC from before 1 July 2026 is ignored for this test.</li>
                <li><strong>A voluntary disclosure</strong> made before an assessment removes <strong>up to 40 more</strong>, decaying with time.</li>
              </ul>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[32rem] text-left text-sm text-navy">
                    <caption className="sr-only">Administrative uplift by voluntary disclosure timing</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-3">Voluntary disclosure lodged</th>
                        <th scope="col" className="px-5 py-3">No prior assessment</th>
                        <th scope="col" className="px-5 py-3">Prior assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {C.upliftSchedule.map((row) => (
                        <tr key={row.disclosure} className={row.noPriorAssessment === 0 ? "bg-eucalyptus/5 font-medium" : undefined}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{row.disclosure}</th>
                          <td className="px-5 py-3">{row.noPriorAssessment}%</td>
                          <td className="px-5 py-3">{row.priorAssessment}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">Percentages are the resulting administrative uplift, measured from the payday.</p>
              </div>
              <p>
                The practical conclusion: <strong>disclosing quickly beats disclosing precisely.</strong> The reduction decays from the payday, not from when you finish reconciling, so an employer who discovers a problem is almost always better off disclosing immediately and refining the numbers afterwards.
              </p>
            </section>

            <section id="late-payment-penalty">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Late Payment Penalty Is Separate</h2>
              <p>
                A late payment penalty of <strong>{pct(C.latePayment.penalty)}</strong> of the outstanding charge can be imposed &mdash; rising to <strong>{pct(C.latePayment.penaltyRepeatWithin24Months)}</strong> if you were liable for the same penalty in the previous 24 months. It is <em>not</em> part of the SGC, and it does not arrive automatically. The sequence is: the charge is assessed, it goes unpaid for 28 days, a Notice to Pay issues, and it remains unpaid a further 28 days.
              </p>
              <p>
                The ATO says the penalty <strong>cannot be remitted</strong>, so unlike the administrative uplift there is no disclosure route out of it. Two qualifications matter, though: it reduces to nil under an exceptional circumstance determination, and if the ATO reduces the underlying charge the penalty reduces with it.
              </p>
            </section>

            <section id="deductibility">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Charge Is Now Tax-Deductible &mdash; This Reversed</h2>
              <p>
                For paydays from {SUPER_GUARANTEE.paydaySuperStart}, all four components of the super guarantee charge are <strong>deductible</strong>. The legacy quarterly SGC was expressly <strong>not</strong>, and that non-deductibility was much of what made it punitive. A great deal of published guidance &mdash; and, until recently, this site &mdash; still says the SGC cannot be claimed. That is now true only of the old charge.
              </p>
              <p>Three things attached to the new charge remain non-deductible:</p>
              <ul>
                {C.nonDeductible.map((item) => (<li key={item}>{item}</li>))}
              </ul>
            </section>

            <section id="qualifying-earnings">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Does Payday Super Mean Super on Overtime?</h2>
              <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                  <div>
                    <h3 className="mb-2 text-base font-bold text-navy">No. Overtime is still excluded.</h3>
                    <p className="text-sm leading-relaxed text-navy">
                      Payday Super calculates SG on &ldquo;qualifying earnings&rdquo; instead of ordinary time earnings, and that sounds like a broadening. The ATO is explicit that <strong>the only additional payment type is {QUALIFYING_EARNINGS.onlyChangeFromOTE}</strong>. Everything counted for SG up to 30 June 2026 still counts; nothing else was added. What changed is the timing and the penalties, not the base.
                    </p>
                  </div>
                </div>
              </div>
              <p><strong>Still excluded, despite frequent claims otherwise:</strong></p>
              <ul>
                {QUALIFYING_EARNINGS.stillExcluded.map((item) => (<li key={item}>{item}</li>))}
              </ul>
              <p><strong>Included, as before:</strong></p>
              <ul>
                {QUALIFYING_EARNINGS.stillIncluded.map((item) => (<li key={item}>{item}</li>))}
              </ul>
            </section>

            <section id="maximum-contribution-base">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Maximum Contribution Base Became Annual</h2>
              <p>
                The maximum contribution base caps the earnings on which SG is compulsory. From {SUPER_GUARANTEE.paydaySuperStart} it is an <strong>annual {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong>, replacing {formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter. That is a change of structure, not just of number &mdash; it is now a running year-to-date test that resets each financial year, rather than four separate quarterly caps.
              </p>
              <p>
                It is derived from the concessional cap: {formatAUD(SUPER_GUARANTEE.concessionalCap)} × 100 ÷ 12, rounded down to the nearest $10. At {pct(SUPER_GUARANTEE.rate)} that caps compulsory SG at about <strong>{formatAUD(SUPER_GUARANTEE.maxSGAnnual)}</strong> a year. Employers can always contribute more voluntarily. See our <Link href="/superannuation-calculator/">superannuation calculator</Link> to model contributions.
              </p>
            </section>

            <section id="cap-relief">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Concessional Cap Relief Is Announced, Not Law</h2>
              <p>
                More frequent contributions can shift which financial year some of them land in, which can push an employee over the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap through no fault of their own. Treasury said in February 2026 that it would introduce technical amendments to prevent this.
              </p>
              <p>
                As at {SITE_CONFIG.lastVerified}, the ATO&rsquo;s own changeover guidance still states in terms: <strong>&ldquo;{PAYDAY_SUPER_CAP_RELIEF.atoWording}&rdquo;</strong> We could locate no bill. Until it is legislated the ordinary rules apply, and the existing options are the existing ones &mdash; reduce voluntary contributions, or apply to have contributions disregarded or reallocated. <strong>Do not plan around relief that does not yet exist.</strong> See our <Link href="/division-293-tax/">Division 293</Link> guide for the related high-income charge.
              </p>
            </section>

            <section id="legacy-regime">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Old Quarterly Charge, for Earnings up to 30 June 2026</h2>
              <p>
                Still live, and still governing anything paid before the changeover. Under that regime the charge was:
              </p>
              <ul>
                <li>The shortfall calculated on <strong>total salary and wages including overtime</strong>, not OTE &mdash; so the charge exceeded the super actually owed</li>
                <li>Nominal interest at <strong>{pct(L.nominalInterestRate)} a year</strong>, running from the start of the quarter, which by law could not be reduced or waived</li>
                <li>An administration fee of <strong>{formatAUD(L.adminFeePerEmployeePerQuarter)} per employee per quarter</strong></li>
                <li>Choice liability capped at {formatAUD(L.choiceLiabilityCap)}</li>
                <li><strong>Not tax-deductible</strong>, and a statement had to be lodged</li>
              </ul>
              <p>
                The final quarterly SG payment was due {L.finalQuarterSGDue}, and the final statement is due <strong>{L.finalQuarterStatementDue}</strong>.
              </p>
              <div className="not-prose mt-6">
                <a href="https://www.ato.gov.au/businesses-and-organisations/super-for-employers/missed-or-late-payday-super-payments/what-happens-if-you-dont-pay-super-correctly" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-transparent bg-eucalyptus-dark px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-navy">
                  Read the ATO&rsquo;s guidance on the charge
                  <ExternalLink className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section id="related">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Guides</h2>
              <ul>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> &mdash; how super works, contributions and caps</li>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; employer SG at {pct(SUPER_GUARANTEE.rate)} on any salary</li>
                <li><Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> &mdash; checking super is actually being paid</li>
                <li><Link href="/employer-cost-calculator/">Employer Cost Calculator</Link> &mdash; the true cost of employing someone</li>
                <li><Link href="/contractor-vs-employee/">Contractor vs Employee</Link> &mdash; misclassification is a common source of SGC exposure</li>
                <li><Link href="/tax-calendar/">Tax Calendar</Link> &mdash; key ATO dates and deadlines</li>
              </ul>
            </section>

            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              {/* Crawlable mirror — the Radix accordion unmounts closed content. */}
              <div className="sr-only">
                <h3>Super guarantee charge questions and answers</h3>
                {SGC_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {SGC_FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide was verified">
                <p>
                  Every figure derives from a single constants file checked against ato.gov.au on {SITE_CONFIG.lastVerified}: the charge components and administrative uplift schedule from QC105848, payment deadlines from QC105846, qualifying earnings from QC105843, the general interest charge rate from QC16145, and the legacy quarterly regime from QC33743.
                </p>
                <p>
                  Three things commonly published about this charge are wrong and are corrected here: the late payment penalty is not one of its components, the administrative uplift is two stacking reductions rather than one all-or-nothing test, and the {formatAUD(C.choiceLoadingCap)} choice-loading cap applies per {C.choiceLoadingCapBasis}. The general interest charge rate resets quarterly, so the quarter it belongs to is printed beside it &mdash; the {GENERAL_INTEREST_CHARGE.quarter} rate is current and the next is expected {GENERAL_INTEREST_CHARGE.nextRateDue}.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("super-guarantee-charge"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Key numbers</h2>
                  <dl className="space-y-3 text-sm">
                    {[
                      { t: "Pay super within", d: `${C.businessDaysToPay} business days of payday` },
                      { t: "Notional earnings rate", d: `${pct(GENERAL_INTEREST_CHARGE.annualRate)} (${GENERAL_INTEREST_CHARGE.quarter})` },
                      { t: "Administrative uplift", d: `up to ${pct(C.administrativeUpliftMax)}, reducible to nil` },
                      { t: "Late payment penalty", d: `${pct(C.latePayment.penalty)}, separate from the charge` },
                      { t: "Max contribution base", d: `${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year` },
                      { t: "Final legacy statement", d: L.finalQuarterStatementDue },
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
                  <h2 className="mb-2 text-lg font-bold">Work out the SG you owe</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    Calculate {pct(SUPER_GUARANTEE.rate)} super on any salary, and the true cost of employing someone.
                  </p>
                  <Link href="/superannuation-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Superannuation Calculator
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
