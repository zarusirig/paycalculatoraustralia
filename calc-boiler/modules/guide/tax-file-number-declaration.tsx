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
  { title: "Tax file number declaration (NAT 3092)", url: "https://www.ato.gov.au/forms-and-instructions/tax-file-number-declaration", publisher: SOURCES.ato.name },
  { title: "PAYG withholding", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/in-detail/payg-withholding", publisher: SOURCES.ato.name },
  { title: "Tax-free threshold", url: "https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/your-tax-residency/australian-resident-for-tax-purposes", publisher: SOURCES.ato.name },
  { title: "Study and training loan obligations", url: "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans", publisher: SOURCES.ato.name },
];

export default function TaxFileNumberDeclarationPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">TFN Declaration Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Tax File Number Declaration — How to Complete It Correctly
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Every new job requires a TFN declaration. Getting it wrong can mean too much or too little tax withheld from your pay. Here&apos;s a step-by-step guide to filling it in correctly and avoiding costly mistakes.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: What Is a TFN Declaration */}
            <section id="what-is-tfn-declaration">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is a TFN Declaration?</h2>
              <p>
                A Tax File Number (TFN) declaration is an official ATO form (NAT 3092) that you must provide to each new employer when you start a job. It tells your employer your TFN, whether to claim the tax-free threshold, and whether you have any study or training loan debts (HECS-HELP, VET Student Loan, etc.).
              </p>
              <p>
                Your employer uses the information on your TFN declaration to calculate the correct amount of <strong>PAYG tax withholding</strong> from each pay. Without a correctly completed TFN declaration, your employer must withhold tax at the <strong>highest marginal rate of 47%</strong> from every dollar you earn.
              </p>
              <p>
                The form can be completed on paper or electronically through your employer&apos;s payroll system. You must provide it within <strong>28 days</strong> of starting work. Your employer then sends the information to the ATO.
              </p>
            </section>

            {/* SECTION 2: Step-by-Step */}
            <section id="step-by-step">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step: How to Complete Your TFN Declaration</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 1: Your Tax File Number</h3>
              <p>
                Enter your 9-digit TFN. If you don&apos;t know your TFN, you can find it on previous tax returns, correspondence from the ATO, or your myGov account. If you are a new Australian resident and don&apos;t yet have a TFN, you can apply for one through the ATO. You have 28 days from starting work to provide your TFN.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Don&apos;t Have Your TFN Yet?</strong>
                  <br />
                  If you have applied for a TFN but haven&apos;t received it yet, tick the &ldquo;I have made a separate application&rdquo; box. Your employer can withhold at normal rates for 28 days while you wait. After 28 days without a TFN, the 47% rate applies.
                </p>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Questions 2&ndash;5: Personal Details</h3>
              <p>
                Enter your name, date of birth, and address. These must match the details the ATO holds for your TFN. If you have recently changed your name (e.g., after marriage), update your details with the ATO first to avoid processing delays.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 6: Tax-Free Threshold</h3>
              <p>
                This is the most important question on the form. The tax-free threshold means the first <strong>$18,200</strong> of your annual income is tax-free. Answering &ldquo;Yes&rdquo; tells your employer to factor this into your PAYG withholding, reducing the tax deducted from each pay.
              </p>
              <p>
                <strong>Rules for claiming the tax-free threshold:</strong>
              </p>
              <ul>
                <li><strong>One job:</strong> Claim the tax-free threshold at that job. Answer &ldquo;Yes&rdquo;.</li>
                <li><strong>Multiple jobs:</strong> Claim the tax-free threshold at your <strong>main job only</strong> (usually the highest-paying one). Answer &ldquo;No&rdquo; at all other jobs.</li>
                <li><strong>Pensions:</strong> If you also receive a pension or government payment, you may need to consider whether to claim the threshold at your job or with the payer.</li>
              </ul>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 7: HECS-HELP and Other Study Loans</h3>
              <p>
                Tick &ldquo;Yes&rdquo; if you have any of the following debts:
              </p>
              <ul>
                <li>HECS-HELP (Higher Education Loan Program)</li>
                <li>VET Student Loan</li>
                <li>Financial Supplement debt</li>
                <li>Student Start-up Loan (SSL)</li>
                <li>ABSTUDY Student Start-up Loan (ABSTUDY SSL)</li>
                <li>Trade Support Loan (TSL)</li>
              </ul>
              <p>
                When you tick &ldquo;Yes&rdquo;, your employer withholds additional amounts each pay period to cover your compulsory HECS repayment. If you do not declare your HECS debt here, you will likely owe a lump sum when you lodge your tax return. See our <Link href="/hecs-help-guide/">HECS-HELP Guide</Link> for repayment thresholds and rates.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 8: Financial Supplement Debt</h3>
              <p>
                This applies only to the old Student Financial Supplement Scheme (SFSS). Most workers can answer &ldquo;No&rdquo; to this question. If you received a Financial Supplement loan between 1993 and 2003, answer &ldquo;Yes&rdquo;.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 9: Residency Status</h3>
              <p>
                Select whether you are an Australian resident for tax purposes. This affects your tax rates and entitlement to the tax-free threshold. Residency for tax purposes is different from visa status &mdash; you can be a tax resident even on a temporary visa if you meet the residency tests. Non-residents do not receive the tax-free threshold and are taxed at different rates. See our <Link href="/non-resident-tax/">Non-Resident Tax Guide</Link> if you are unsure.
              </p>
            </section>

            {/* SECTION 3: Common Mistakes */}
            <section id="common-mistakes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common TFN Declaration Mistakes</h2>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Mistake</th>
                        <th className="px-6 py-4">Consequence</th>
                        <th className="px-6 py-4">How to Fix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Claiming tax-free threshold at 2 jobs</td>
                        <td className="px-6 py-4">Under-withholding. Tax debt at end of year.</td>
                        <td className="px-6 py-4">Submit new TFN declaration at second job unchecking the threshold</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Not declaring HECS-HELP debt</td>
                        <td className="px-6 py-4">No HECS withheld from pay. Lump sum HECS bill at tax time.</td>
                        <td className="px-6 py-4">Submit new TFN declaration declaring the debt</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Not providing TFN within 28 days</td>
                        <td className="px-6 py-4">47% withholding rate on every dollar earned</td>
                        <td className="px-6 py-4">Provide TFN to employer; refund comes via tax return</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Wrong residency status</td>
                        <td className="px-6 py-4">Incorrect tax rates applied; potential debt or penalty</td>
                        <td className="px-6 py-4">Submit new TFN declaration with correct status</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Not updating after getting HECS debt</td>
                        <td className="px-6 py-4">HECS not withheld from ongoing pay</td>
                        <td className="px-6 py-4">Submit new TFN declaration to current employer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>The 47% Penalty Rate</strong>
                  <br />
                  If you don&apos;t provide your TFN within 28 days, your employer <strong>must</strong> withhold tax at 47% (the top marginal rate plus Medicare levy) from every dollar you earn. This is not optional &mdash; it is a legal obligation on your employer. You can recover the excess tax when you lodge your annual tax return, but it means reduced pay in the meantime.
                </p>
              </div>
            </section>

            {/* SECTION 4: When to Submit a New One */}
            <section id="when-to-submit-new">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When to Submit a New TFN Declaration</h2>
              <p>
                You need to submit a new TFN declaration to your employer in the following situations:
              </p>
              <ul>
                <li><strong>Starting a new job</strong> &mdash; Always required, even if you have worked for the same employer group before.</li>
                <li><strong>Acquiring a HECS-HELP debt</strong> &mdash; If you start studying and take on a HECS loan while employed.</li>
                <li><strong>Paying off your HECS debt</strong> &mdash; Submit a new declaration to stop the additional withholding.</li>
                <li><strong>Changing your tax-free threshold claim</strong> &mdash; If you get a second job or leave a job and want to move the threshold to a different employer.</li>
                <li><strong>Changing residency status</strong> &mdash; If you become or cease to be an Australian resident for tax purposes.</li>
                <li><strong>Name change</strong> &mdash; After updating your details with the ATO.</li>
              </ul>
              <p>
                You do <strong>not</strong> need to submit a new TFN declaration each financial year or if your salary changes with the same employer. The declaration remains in effect until you submit a replacement or leave the employer.
              </p>
              <p>
                For a comprehensive checklist when starting a new job, see our <Link href="/new-job-checklist/">New Job Checklist</Link>. If this is your first ever job, our <Link href="/first-job-pay-guide/">First Job Pay Guide</Link> walks through everything you need to know.
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="no-tfn" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens if I don&apos;t provide my TFN?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Your employer must withhold tax at the <strong>highest marginal rate of 47%</strong> from every dollar you earn. This rate includes the 45% top tax rate plus 2% Medicare levy. The over-withheld tax is recovered when you lodge your annual tax return, but you will have significantly reduced take-home pay in the meantime.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="two-jobs-threshold" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I claim the tax-free threshold at two jobs?</AccordionTrigger>
                  <AccordionContent className="text-warmgray"><strong>You should only claim the tax-free threshold at one job</strong> &mdash; your main (highest-paying) employer. If you claim it at two jobs, both employers withhold less tax than they should, and you will likely owe money when you lodge your tax return. Use our <Link href="/second-job-tax-calculator/" className="text-eucalyptus-dark underline">Second Job Tax Calculator</Link> to see the impact.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="hecs-not-declared" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What if I forget to declare my HECS debt?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">If you don&apos;t declare your HECS-HELP debt on your TFN declaration, your employer won&apos;t withhold any HECS repayments from your pay. The ATO will calculate your compulsory repayment when you lodge your tax return, and you&apos;ll owe the full amount as a lump sum. Submit a new TFN declaration to your employer as soon as possible to start having HECS withheld going forward.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="lost-tfn" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I find my TFN if I&apos;ve lost it?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">You can find your TFN on previous tax returns, your myGov account (linked to the ATO), or correspondence from the ATO. You can also call the ATO on <strong>13 28 61</strong> to request your TFN. For security, the ATO will post your TFN to your registered address &mdash; they will not provide it over the phone or email.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="new-declaration-needed" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I need a new TFN declaration each financial year?</AccordionTrigger>
                  <AccordionContent className="text-warmgray"><strong>No.</strong> Your TFN declaration remains in effect with your current employer until you submit a replacement or leave the job. You only need a new one if your circumstances change (e.g., new HECS debt, change in residency, want to move the tax-free threshold to a different employer).</AccordionContent>
                </AccordionItem>
                <AccordionItem value="contractor" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do contractors need to complete a TFN declaration?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Independent contractors operating under their own ABN do <strong>not</strong> complete a TFN declaration. Instead, they quote their ABN on invoices. Contractors without an ABN may have the top rate withheld by the payer. Employees (including casuals) must always provide a TFN declaration. See our <Link href="/contractor-vs-employee/" className="text-eucalyptus-dark underline">Contractor vs Employee Guide</Link> for help determining your status.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Information is sourced from the ATO&apos;s official TFN declaration form (NAT 3092) and PAYG withholding guidelines. Tax rates and thresholds are for FY2025-26. The 47% penalty withholding rate comprises the 45% top marginal rate plus 2% Medicare levy. Individual circumstances may vary &mdash; contact the ATO on 13 28 61 for specific queries about your TFN declaration.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-file-number-declaration"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Guides &amp; Tools</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/second-job-tax-calculator/" label="Second Job Tax Calculator" />
                    <SidebarLink href="/hecs-help-guide/" label="HECS-HELP Guide" />
                    <SidebarLink href="/first-job-pay-guide/" label="First Job Pay Guide" />
                    <SidebarLink href="/new-job-checklist/" label="New Job Checklist" />
                    <SidebarLink href="/payg-withholding-tables/" label="PAYG Withholding Tables" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate your pay</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See how your TFN declaration choices affect your take-home pay, including tax-free threshold and HECS withholding.</p>
                  <Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Income Tax Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
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
