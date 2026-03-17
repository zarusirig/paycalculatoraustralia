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
  { title: "Deductions you can claim", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim", publisher: SOURCES.ato.name },
  { title: "Occupation and industry specific guides", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/occupation-and-industry-specific-guides", publisher: SOURCES.ato.name },
  { title: "Income tax rates for individuals", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Records you need to keep", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/records-you-need-to-keep", publisher: SOURCES.ato.name },
];

export default function TaxDeductionsGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Tax Deductions Guide</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Deductions Guide — Work-Related Deductions That Reduce Your Tax</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Understand how work-related tax deductions reduce your taxable income and lower your tax bill. From vehicle expenses to working from home, this guide covers every major deduction category for Australian taxpayers in FY2025-26.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: How Tax Deductions Work ───── */}
            <section id="how-deductions-work">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Tax Deductions Work</h2>
              <p>
                A tax deduction reduces your <strong>taxable income</strong>, not your tax bill directly. When you claim a $1,000 deduction, you save tax equal to $1,000 multiplied by your marginal tax rate. An employee in the 30% bracket saves <strong>$300</strong> on a $1,000 deduction; someone in the 45% bracket saves <strong>$450</strong> on the same claim.
              </p>
              <p>
                The ATO applies three golden rules to every work-related deduction claim. All three must be satisfied for a deduction to be allowed:
              </p>
              <ol>
                <li><strong>You must have spent the money yourself</strong> and not been reimbursed by your employer. If your employer paid for the expense or reimbursed you, it is not deductible.</li>
                <li><strong>The expense must be directly related to earning your assessable income.</strong> There must be a clear connection between the expense and your work duties. Private or domestic expenses are not deductible.</li>
                <li><strong>You must have a record to prove it.</strong> The ATO requires receipts, invoices, bank statements, or diary entries for all claims. For total work-related expenses of <strong>$300 or less</strong>, you do not need written evidence but must be able to show how you calculated the amount.</li>
              </ol>
              <p>
                Deductions are claimed in your annual tax return. Your employer does not need to approve your deductions — they are between you and the ATO. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to model how deductions affect your take-home pay.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">See How Deductions Affect Your Tax</h3>
                    <p className="text-navy text-sm mb-3">Enter your income and deductions to calculate your exact tax savings and take-home pay for FY2025-26.</p>
                    <Link href="/tax-return-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Tax Return Estimator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── SECTION 2: Common Work-Related Deductions ───── */}
            <section id="common-deductions">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common Work-Related Deductions</h2>
              <p>
                The following categories represent the most frequently claimed work-related deductions by Australian employees. Each category has specific ATO rules about what qualifies and what records you need.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Vehicle and Travel Expenses</h3>
              <p>
                You can claim the cost of travel between separate workplaces, travel for work duties (such as visiting clients), and travel to attend conferences or training. <strong>Home-to-work commuting is not deductible</strong> except in limited circumstances (carrying bulky tools with no secure storage at work, or itinerant workers). The two methods for car expenses are:
              </p>
              <ul>
                <li><strong>Cents per kilometre:</strong> Claim <strong>85 cents per km</strong> up to a maximum of 5,000 business kilometres per year ($4,250 maximum). No written evidence of kilometres is required, but you must be able to show how you calculated the distance.</li>
                <li><strong>Logbook method:</strong> Keep a logbook for a continuous 12-week period to establish the work-use percentage of your car. Claim actual running costs (fuel, registration, insurance, servicing, depreciation) multiplied by the business-use percentage. The logbook is valid for 5 years provided your driving pattern remains similar.</li>
              </ul>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Clothing and Laundry</h3>
              <p>
                Only three types of clothing are deductible: <strong>occupation-specific clothing</strong> (chef&apos;s checked pants, nurse&apos;s uniform), <strong>protective clothing</strong> (steel-capped boots, high-vis vests, sun protection for outdoor workers), and <strong>clothing with your employer&apos;s logo</strong> that is compulsory to wear. Conventional clothing — even if you only wear it for work — is not deductible. Laundry of eligible work clothing can be claimed at <strong>$1 per load</strong> (if washed with other items) or <strong>$2 per load</strong> (exclusive wash), up to <strong>$150</strong> without written records.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tools, Equipment and Technology</h3>
              <p>
                Work-related tools and equipment costing <strong>$300 or less</strong> can be claimed as an immediate deduction. Items costing more than $300 must be depreciated over their effective life. Common claims include laptops, tablets, software subscriptions, professional tools, and safety equipment. If an item is used for both work and personal purposes, only the work-related percentage is deductible.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Working From Home</h3>
              <p>
                If you work from home, you can claim running expenses using the <strong>revised fixed rate method at 67 cents per hour</strong>, which covers electricity, phone, internet, stationery, and computer consumables. Alternatively, the actual cost method lets you calculate each expense separately. Office furniture (desks, chairs) costing over $300 is depreciated. See our detailed <Link href="/work-from-home-deductions/">Work From Home Deductions Guide</Link> for a full comparison of methods.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Self-Education Expenses</h3>
              <p>
                Course fees, textbooks, stationery, and student union fees are deductible when the education is <strong>directly related to your current employment</strong> — either maintaining or improving your skills in your current role, or the course leads to an increase in income from your current job. Study that enables you to move into a <strong>new</strong> occupation is not deductible. A nurse studying for a postgraduate nursing qualification can claim; a nurse studying to become an accountant cannot.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Phone and Internet</h3>
              <p>
                The work-related portion of your personal phone and internet plans is deductible. You need to determine the work-use percentage by keeping a diary of usage for a representative <strong>4-week period</strong>. If your work-use percentage is 40%, you claim 40% of your annual phone and internet costs. Employer-provided phones used solely for work are not a personal deduction (they are an employer expense).
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Union Fees and Professional Memberships</h3>
              <p>
                Membership fees for trade unions, professional associations, and registration boards required for your employment are fully deductible. This includes fees for organisations like CPA Australia, the Law Society, medical boards, and teaching registration bodies. The fees must relate to your <strong>current</strong> employment — joining a professional body for a career you do not yet work in is not deductible.
              </p>
            </section>

            {/* ───── SECTION 3: How Much Will Deductions Save You ───── */}
            <section id="deduction-savings">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Will Deductions Save You?</h2>
              <p>
                Your tax savings depend on your <strong>marginal tax rate</strong> — the rate applied to the last dollar you earn. Higher-income earners save more per dollar of deductions because their marginal rate is higher. The table below shows exact savings at each FY2025-26 tax bracket for common deduction amounts.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Deduction Amount</th><th className="px-5 py-3 text-right">16% bracket ($18,201–$45,000)</th><th className="px-5 py-3 text-right">30% bracket ($45,001–$135,000)</th><th className="px-5 py-3 text-right">37% bracket ($135,001–$190,000)</th><th className="px-5 py-3 text-right">45% bracket ($190,001+)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">$500</td><td className="px-5 py-3 text-right">$80</td><td className="px-5 py-3 text-right">$150</td><td className="px-5 py-3 text-right">$185</td><td className="px-5 py-3 text-right">$225</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$1,000</td><td className="px-5 py-3 text-right">$160</td><td className="px-5 py-3 text-right">$300</td><td className="px-5 py-3 text-right">$370</td><td className="px-5 py-3 text-right">$450</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$2,000</td><td className="px-5 py-3 text-right">$320</td><td className="px-5 py-3 text-right">$600</td><td className="px-5 py-3 text-right">$740</td><td className="px-5 py-3 text-right">$900</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$5,000</td><td className="px-5 py-3 text-right">$800</td><td className="px-5 py-3 text-right">$1,500</td><td className="px-5 py-3 text-right">$1,850</td><td className="px-5 py-3 text-right">$2,250</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                These savings include only the income tax reduction. Deductions also reduce the <strong>Medicare levy</strong> (2% of taxable income), adding approximately $10 per $500 of deductions. For employees with HECS-HELP debt, deductions can also reduce your compulsory repayment amount by lowering your repayment income below a threshold. Review the current <Link href="/tax-brackets/">Tax Brackets Guide</Link> to identify your marginal rate.
              </p>
            </section>

            {/* ───── SECTION 4: Deductions You Can't Claim ───── */}
            <section id="cannot-claim">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Deductions You Cannot Claim</h2>
              <p>
                The ATO specifically disallows these common claims that taxpayers frequently attempt:
              </p>
              <ul>
                <li><strong>Home-to-work commuting:</strong> The cost of travelling between your home and your regular workplace is a private expense, regardless of the distance or whether you work irregular hours.</li>
                <li><strong>Conventional clothing:</strong> Suits, business shirts, dresses, and shoes worn for work but not unique to your occupation are not deductible. The clothing must be occupation-specific, protective, or have a compulsory employer logo.</li>
                <li><strong>Childcare costs:</strong> Childcare, babysitting, and school fees are not deductible work-related expenses, even when required to enable you to work.</li>
                <li><strong>Personal grooming:</strong> Haircuts, cosmetics, and personal hygiene products are private expenses even in customer-facing roles.</li>
                <li><strong>Fines and penalties:</strong> Traffic fines, parking fines, and late fees are not deductible even if incurred while travelling for work.</li>
                <li><strong>Entertainment expenses:</strong> The cost of meals and entertainment with colleagues is generally not deductible for employees (different rules apply to businesses).</li>
                <li><strong>Expenses reimbursed by your employer:</strong> Any expense your employer has already paid for or reimbursed cannot be claimed again as a deduction.</li>
                <li><strong>Study for a new career:</strong> Self-education expenses are only deductible when the course is directly related to your <strong>current</strong> employment, not to enable a career change.</li>
              </ul>
              <p>
                The ATO uses sophisticated data matching to compare your claims against others in the same occupation and income bracket. Claims that are significantly higher than the norm trigger automated reviews. Use our <Link href="/tax-refund-guide/">Tax Refund Guide</Link> for guidance on how deductions flow through to your refund.
              </p>
            </section>

            {/* ───── SECTION 5: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">

                <AccordionItem value="what-is-300" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the $300 no-receipt threshold?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">If your total work-related expense claims are <strong>$300 or less</strong>, you do not need to provide written evidence such as receipts or invoices. However, you must still be able to explain to the ATO how you calculated the amount and demonstrate that the expenses were work-related. This threshold applies to the total of all work-related expenses, not $300 per category.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="claim-without-receipts" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I claim deductions without receipts?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Below the $300 total work-related threshold, written records are not mandatory. Above $300, you need receipts, invoices, or bank/credit card statements. Laundry of eligible work clothing allows claims up to <strong>$150</strong> without written records. The ATO accepts digital records — photos of receipts and accounting apps are valid evidence.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-claim" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I claim deductions?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">You claim deductions when you lodge your annual tax return, either through myTax (the ATO&apos;s free online tool) or through a registered tax agent. Deductions are entered in the &quot;Deductions&quot; section of your return. Your employer does not need to approve them — they are assessed by the ATO.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="reduce-tax-or-income" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do deductions reduce my tax or my taxable income?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Deductions reduce your <strong>taxable income</strong>, which then reduces the amount of tax calculated on that income. A $1,000 deduction does not save you $1,000 in tax — it saves you $1,000 multiplied by your marginal tax rate. At the 30% bracket, a $1,000 deduction saves $300 in tax.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="wfh-deduction" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I claim working from home and car expenses together?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Working from home deductions and car expenses are separate categories. You can claim both in the same tax return. For example, you might claim 67 cents per hour for days worked from home and cents-per-kilometre for work-related driving on office days. Each claim must be separately substantiated.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="laptop" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I claim a laptop purchased for work?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes, if you use it for work. If the laptop costs <strong>$300 or less</strong>, claim the full work-use percentage as an immediate deduction. If it costs more than $300, depreciate it over its effective life (typically 2-4 years). If you use the laptop 60% for work and 40% personal, only 60% of the cost or depreciation is deductible.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="union-fees" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are union fees tax deductible?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Membership fees for trade unions and professional associations related to your current employment are fully deductible. This includes unions such as the CFMEU, NSWNMA, AEU, and professional bodies like CPA Australia, the Law Society, and medical registration boards.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="donations" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I claim charitable donations as a deduction?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Gifts of <strong>$2 or more</strong> to organisations registered as Deductible Gift Recipients (DGRs) are tax deductible. Most major Australian charities hold DGR status. Donations to crowdfunding campaigns, political parties (above $1,500), and overseas organisations without DGR status are not deductible. Keep donation receipts as evidence.</AccordionContent>
                </AccordionItem>

              </Accordion>
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Tax deduction information is sourced from the Australian Taxation Office (ATO). Savings calculations use FY2025-26 resident tax brackets. Individual deduction eligibility depends on your specific work circumstances. Use our Australian tax calculator tools for personalised estimates based on your income and deduction amounts.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-deductions-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/tax-return-calculator/" label="Tax Return Estimator" /><SidebarLink href="/work-from-home-deductions/" label="WFH Deductions Guide" /><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /><SidebarLink href="/tax-refund-guide/" label="Tax Refund Guide" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Calculate your tax savings</h3><p className="text-sky-100 text-sm mb-4">Enter your income and deductions to see exactly how much tax you&apos;ll save this financial year.</p><Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Income Tax Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
