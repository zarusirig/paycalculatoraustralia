"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Notice of assessment", url: "https://www.ato.gov.au/individuals-and-families/your-tax-return/after-you-lodge-your-tax-return", publisher: SOURCES.ato.name },
  { title: "Objecting to a decision", url: "https://www.ato.gov.au/about-ato/dealing-with-us", publisher: SOURCES.ato.name },
  { title: "Amending your tax return", url: "https://www.ato.gov.au/individuals-and-families/your-tax-return/after-you-lodge-your-tax-return", publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function NoticeOfAssessmentPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Notice of Assessment</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Notice of Assessment — Understanding Your ATO Tax Assessment
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Your Notice of Assessment is the ATO&apos;s official statement of your tax calculation. Here&apos;s how to read each line, understand what the numbers mean, and what to do if something doesn&apos;t look right.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: What Is a NOA */}
            <section id="what-is-noa">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is a Notice of Assessment?</h2>
              <p>
                A Notice of Assessment (NOA) is an official document the Australian Taxation Office issues after processing your income tax return. It is the ATO&apos;s formal calculation of your tax position for the financial year, showing exactly how much tax you owe, any credits you are entitled to, and whether you receive a refund or have an amount owing.
              </p>
              <p>
                The NOA is issued for every tax return lodged &mdash; whether you lodge through myTax, a registered tax agent, or on paper. It is typically available within <strong>2 weeks</strong> of electronic lodgement or <strong>10&ndash;12 weeks</strong> for paper returns.
              </p>
              <p>
                Your NOA is an important document. You may need it when applying for loans, government benefits, or rental applications as proof of income. Keep a copy of each year&apos;s NOA for at least <strong>5 years</strong> (the standard ATO record-keeping period). You can access all your past NOAs through your myGov account linked to the ATO.
              </p>
            </section>

            {/* SECTION 2: How to Read Each Section */}
            <section id="how-to-read">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Read Your Notice of Assessment</h2>
              <p>
                Your NOA follows a structured calculation. Each line builds on the previous one to arrive at your final refund or debt. Here&apos;s what each section means:
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Line Item</th>
                        <th className="px-6 py-4">What It Means</th>
                        <th className="px-6 py-4">Example ($90K salary)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Taxable Income</td>
                        <td className="px-6 py-4">Your gross income minus allowable deductions</td>
                        <td className="px-6 py-4">$87,000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Tax on Taxable Income</td>
                        <td className="px-6 py-4">Income tax calculated using progressive tax brackets</td>
                        <td className="px-6 py-4">$17,288</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Less: Tax Offsets</td>
                        <td className="px-6 py-4">Reductions including LITO, private health rebate, etc.</td>
                        <td className="px-6 py-4">&minus;$325</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Plus: Medicare Levy</td>
                        <td className="px-6 py-4">Standard 2% Medicare levy on taxable income</td>
                        <td className="px-6 py-4">+$1,740</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Plus: Medicare Levy Surcharge</td>
                        <td className="px-6 py-4">1%&ndash;1.5% if no PHI and income over $93K</td>
                        <td className="px-6 py-4">$0</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Plus: HECS-HELP Repayment</td>
                        <td className="px-6 py-4">Compulsory repayment if income exceeds threshold</td>
                        <td className="px-6 py-4">+$3,000</td>
                      </tr>
                      <tr className="bg-sandstone/50">
                        <td className="px-6 py-4 font-bold">Total Tax Liability</td>
                        <td className="px-6 py-4 font-bold">Sum of all taxes and levies</td>
                        <td className="px-6 py-4 font-bold">$21,703</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Less: PAYG Credits</td>
                        <td className="px-6 py-4">Tax already withheld by your employer(s) during the year</td>
                        <td className="px-6 py-4">&minus;$23,500</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/20">
                        <td className="px-6 py-4 font-bold">Result</td>
                        <td className="px-6 py-4 font-bold">Refund (if negative) or Amount Owing (if positive)</td>
                        <td className="px-6 py-4 font-bold text-green-600">Refund: $1,797</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Understanding Each Line</h3>

              <p><strong>Taxable Income</strong> is your total assessable income (salary, wages, interest, dividends, capital gains, rental income) minus allowable deductions (work-related expenses, self-education, working from home, etc.). This is the starting point for your tax calculation.</p>

              <p><strong>Tax on Taxable Income</strong> is calculated using the <Link href="/tax-brackets/">progressive tax brackets</Link>. For FY2025-26, the first $18,200 is tax-free, $18,201&ndash;$45,000 is taxed at 16%, $45,001&ndash;$135,000 at 30%, and so on. The ATO applies each bracket sequentially to your taxable income.</p>

              <p><strong>Tax Offsets</strong> reduce the tax calculated above. The most common offset is the <Link href="/low-income-tax-offset/">Low Income Tax Offset (LITO)</Link>, which provides up to $700 for incomes under $66,667. Other offsets include the private health insurance rebate, senior and pensioner tax offset, and zone tax offset. Non-refundable offsets can reduce tax to zero but not below.</p>

              <p><strong>Medicare Levy</strong> is a flat 2% of your taxable income. A reduced rate applies if your taxable income is below the low-income threshold ($27,222 for singles). See our <Link href="/medicare-levy/">Medicare Levy Guide</Link> for the full details, including exemptions for foreign residents and certain visa holders.</p>

              <p><strong>Medicare Levy Surcharge</strong> applies if you earn over $93,000 (singles) or $186,000 (families) and do not hold eligible private hospital cover. The surcharge is 1%&ndash;1.5% depending on your income tier. See our <Link href="/private-health-insurance-medicare/">Private Health Insurance &amp; Medicare guide</Link>.</p>

              <p><strong>HECS-HELP Repayment</strong> is your compulsory student loan repayment, calculated on your Repayment Income. Under the new marginal system, you only pay on income above the $67,000 threshold. The amount shown on your NOA is the total compulsory repayment for the year.</p>

              <p><strong>PAYG Credits</strong> represent the tax your employer(s) withheld from your pay during the year. If your employer withheld more than your total tax liability, you receive a refund. If they withheld less, you owe the difference.</p>
            </section>

            {/* SECTION 3: What to Do If You Disagree */}
            <section id="disagree">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What to Do If You Disagree With Your NOA</h2>
              <p>
                If you believe your Notice of Assessment contains an error, you have two main options: requesting an amendment or lodging a formal objection.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Requesting an Amendment</h3>
              <p>
                For most individual taxpayers, you have <strong>2 years</strong> from the date of your original assessment to request an amendment. If you are classified as having more complex tax affairs (e.g., you are a beneficiary of a trust or have a foreign income), the review period extends to <strong>4 years</strong>.
              </p>
              <p>
                You can request an amendment through:
              </p>
              <ul>
                <li><strong>myTax</strong> &mdash; Log in to your myGov account, navigate to the ATO, and select &ldquo;Amend my return&rdquo;</li>
                <li><strong>Tax agent</strong> &mdash; Your registered tax agent can lodge an amendment on your behalf</li>
                <li><strong>Paper form</strong> &mdash; Complete a paper amendment request and mail it to the ATO</li>
              </ul>
              <p>
                Common reasons for amendments include: forgetting to claim a deduction, incorrect income reported by a payer, or receiving a revised payment summary after lodging.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Lodging a Formal Objection</h3>
              <p>
                If the ATO has made a decision you disagree with (as opposed to a simple error), you can lodge a formal objection. Objections must be lodged within <strong>2 years</strong> of the assessment date for individuals. The ATO will review your objection and issue a decision, typically within 60 days.
              </p>
              <p>
                If your objection is disallowed, you can escalate to the <strong>Administrative Appeals Tribunal (AAT)</strong> or the <strong>Federal Court</strong> for an independent review.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Important</strong>
                  <br />
                  Even if you lodge an objection, you are generally required to pay the assessed amount by the due date. If the objection is successful, the ATO will refund the overpayment with interest. If you are experiencing genuine financial hardship, you can request a deferral of payment.
                </p>
              </div>
            </section>

            {/* SECTION 4: Common NOA Scenarios */}
            <section id="common-scenarios">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common NOA Scenarios</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Did I Get a Tax Debt?</h3>
              <p>
                You receive a tax debt when your PAYG credits (tax withheld during the year) are less than your total tax liability. Common reasons include:
              </p>
              <ul>
                <li>Claiming the tax-free threshold at two jobs simultaneously</li>
                <li>Investment income (interest, dividends, rental) with no tax withheld</li>
                <li>Capital gains from selling shares or property</li>
                <li>Not declaring HECS-HELP debt to your employer</li>
                <li>Underpayment of Medicare Levy Surcharge</li>
              </ul>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Is My Refund Different From Expected?</h3>
              <p>
                Common reasons your refund differs from your estimate include:
              </p>
              <ul>
                <li><strong>ATO data matching</strong> &mdash; The ATO pre-fills income from banks, employers, and government agencies. If you missed reporting income, the ATO adds it automatically.</li>
                <li><strong>Deductions disallowed</strong> &mdash; If the ATO does not accept a claimed deduction, your taxable income increases and your refund decreases.</li>
                <li><strong>Prior year debt offset</strong> &mdash; The ATO may apply your refund to an outstanding debt from a previous year.</li>
                <li><strong>Child support obligations</strong> &mdash; Refunds may be redirected to cover child support debts.</li>
              </ul>
              <p>
                Use our <Link href="/tax-return-calculator/">Tax Return Calculator</Link> before lodging to estimate your expected outcome and identify any discrepancies early.
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-is-noa" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is a Notice of Assessment?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">A Notice of Assessment (NOA) is the ATO&apos;s official document showing the results of processing your tax return. It details your taxable income, tax calculated, offsets applied, Medicare levy, HECS repayment, PAYG credits, and the final result &mdash; either a refund or an amount you owe.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="how-long" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How long does it take to receive my NOA?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Electronic lodgements through myTax or a tax agent are typically processed within <strong>2 weeks</strong>. Paper returns take <strong>10&ndash;12 weeks</strong>. Complex returns that require manual review may take longer. You can check the status of your return through your myGov account.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="disagree" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What can I do if I disagree with my NOA?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">You can request an <strong>amendment</strong> within 2 years of the assessment date (4 years for complex affairs). Amendments are lodged through myTax, your tax agent, or by paper. For formal disputes, you can lodge an <strong>objection</strong> with the ATO, and if that fails, escalate to the Administrative Appeals Tribunal.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="refund-timing" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When will I receive my tax refund?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">If you lodge electronically and your return is straightforward, refunds are typically paid within <strong>2 weeks</strong> of lodgement. The ATO deposits refunds directly to the bank account you nominate in your tax return. During peak lodgement periods (July&ndash;October), processing may take slightly longer.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="debt" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens if I owe tax?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">If your NOA shows an amount owing, you must pay by the due date on the notice (typically <strong>21 days</strong> from the issue date). You can pay via BPAY, credit/debit card, or direct debit. If you can&apos;t pay in full, contact the ATO to set up a <strong>payment plan</strong>. Interest charges (the General Interest Charge) apply to late payments.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="keep-noa" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How long should I keep my Notice of Assessment?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Keep your NOA for at least <strong>5 years</strong> from the date you lodge your tax return. This aligns with the ATO&apos;s standard record-keeping requirements. If you have carry-forward losses, capital gains cost base records, or other ongoing tax matters, keep relevant records for longer. You can access past NOAs through your myGov account at any time.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="noa-for-loans" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I use my NOA as proof of income?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Many lenders, landlords, and government agencies accept the NOA as proof of income. It is an official ATO document showing your assessed taxable income for the financial year. Banks commonly request your last 2 NOAs when assessing home loan applications. You can download your NOA from your myGov account.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Information is sourced from the Australian Taxation Office&apos;s published guidance on Notices of Assessment, amendment processes, and objection procedures. Tax calculations use FY2025-26 resident tax brackets and rates. The worked example is illustrative and simplified. Individual NOA results depend on your specific income, deductions, offsets, and withholding arrangements.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("notice-of-assessment"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Guides &amp; Tools</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/tax-return-calculator/" label="Tax Return Calculator" />
                    <SidebarLink href="/tax-refund-guide/" label="Tax Refund Guide" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                    <SidebarLink href="/low-income-tax-offset/" label="Low Income Tax Offset" />
                    <SidebarLink href="/medicare-levy/" label="Medicare Levy Guide" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Estimate your tax return</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Model your expected refund or amount owing before lodging your tax return.</p>
                  <Link href="/tax-return-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Tax Return Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
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

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
