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
  { title: "Business structures", url: "https://www.ato.gov.au/businesses-and-organisations/starting-registering-or-closing-a-business", publisher: SOURCES.ato.name },
  { title: "Company tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/company-tax-rates", publisher: SOURCES.ato.name },
  { title: "GST registration", url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst", publisher: SOURCES.ato.name },
  { title: "Contractor vs employee", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/employee-or-independent-contractor", publisher: SOURCES.ato.name },
];

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

export default function EmployeeVsSoleTraderVsCompanyPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Employee vs Sole Trader vs Company</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Employee vs Sole Trader vs Company — Which Structure Pays More?
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Your business structure determines how much tax you pay, whether you need to manage GST, how super works, and the level of personal liability you carry. Here is a real-numbers comparison at different income levels to help you choose the right structure.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <div className="bg-sandstone border-l-4 border-ochre p-5 rounded-r-xl not-prose my-8">
              <p className="text-navy text-sm"><strong>Disclaimer:</strong> This is general information only, not business structuring advice. Business structure decisions involve legal, tax, and commercial considerations unique to your situation. Consult a qualified accountant or business adviser before making changes to your structure.</p>
            </div>

            <section id="quick-comparison">
              <h2>Quick Comparison Table</h2>
              <p>
                The three most common structures in Australia each have distinct characteristics across tax, super, liability, and administration:
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Factor</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Employee</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Sole Trader (ABN)</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Company (Pty Ltd)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Tax rates</td>
                        <td className="p-3 text-navy">Individual marginal (0-45%)</td>
                        <td className="p-3 text-navy">Individual marginal (0-45%)</td>
                        <td className="p-3 text-navy">Flat 25% company rate</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Superannuation</td>
                        <td className="p-3 text-navy">Employer pays 12% SG</td>
                        <td className="p-3 text-navy">Self-funded (optional)</td>
                        <td className="p-3 text-navy">Company pays SG on director salary</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Personal liability</td>
                        <td className="p-3 text-navy">None (employer liable)</td>
                        <td className="p-3 text-navy">Unlimited personal liability</td>
                        <td className="p-3 text-navy">Limited to company assets</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Admin burden</td>
                        <td className="p-3 text-navy">Minimal — employer handles tax</td>
                        <td className="p-3 text-navy">Moderate — BAS, tax return, records</td>
                        <td className="p-3 text-navy">High — ASIC fees, separate return, accounts</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">GST</td>
                        <td className="p-3 text-navy">Not applicable</td>
                        <td className="p-3 text-navy">Required if turnover &gt; $75K</td>
                        <td className="p-3 text-navy">Required if turnover &gt; $75K</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Insurance</td>
                        <td className="p-3 text-navy">Workers comp via employer</td>
                        <td className="p-3 text-navy">Own public liability, PI, income protection</td>
                        <td className="p-3 text-navy">Company holds policies; directors may need D&O</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-navy font-medium">Asset protection</td>
                        <td className="p-3 text-navy">N/A</td>
                        <td className="p-3 text-navy">None — personal assets at risk</td>
                        <td className="p-3 text-navy">Strong — personal assets separated</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section id="employee">
              <h2>Employee</h2>
              <p>
                As an employee, your employer handles PAYG withholding, superannuation contributions (12% SG), workers&apos; compensation insurance, and payroll tax. You receive the National Employment Standards protections: 4 weeks annual leave, 10 days personal/carer&apos;s leave, notice of termination, and redundancy pay.
              </p>
              <p>
                Employees pay individual income tax at marginal rates from 0% to 45%, plus the 2% Medicare levy. The tax-free threshold of $18,200 applies, and the Low Income Tax Offset (LITO) provides up to $700 in additional relief for incomes under $66,667.
              </p>
              <p>
                <strong>Best for:</strong> Workers who value stability, paid leave, employer-funded super, and minimal administrative burden. Most Australians are best served as employees unless their income or business circumstances specifically favour another structure.
              </p>
            </section>

            <section id="sole-trader">
              <h2>Sole Trader (ABN)</h2>
              <p>
                A sole trader operates under their own name or a registered business name using an Australian Business Number (ABN). The sole trader and the business are legally the same entity — there is no separation between personal and business assets or liabilities.
              </p>
              <p>
                Sole traders pay individual income tax at the same marginal rates as employees. Business income is reported on the individual tax return, and deductions for business expenses reduce taxable income. The key differences from employment are:
              </p>
              <ul>
                <li><strong>No employer super</strong> — Super contributions are optional but highly recommended. You can claim a tax deduction for personal super contributions up to the $30,000 concessional cap</li>
                <li><strong>GST registration</strong> — Required when annual turnover reaches <strong>$75,000</strong>. Below this threshold, registration is optional but may be beneficial for claiming GST credits on business purchases</li>
                <li><strong>BAS lodgment</strong> — Quarterly (or monthly) Business Activity Statements reporting GST collected and paid, plus PAYG instalments on expected income tax</li>
                <li><strong>No leave entitlements</strong> — Time off means no income. Factor in 4-6 weeks of non-earning time when comparing to employment</li>
                <li><strong>Business deductions</strong> — Home office, vehicle, tools, equipment, professional development, and other business-related expenses reduce taxable income</li>
              </ul>
              <p>
                <strong>Best for:</strong> Freelancers, contractors, and small operators earning under $120,000 who want simplicity and full control over their work. Setup is free (ABN registration is instant), and accounting costs are typically $1,000-$2,500 per year.
              </p>
            </section>

            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
              <div className="flex items-start gap-4">
                <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Contractor or Employee?</h3>
                  <p className="text-navy text-sm mb-3">Not sure if your working arrangement is genuinely contracting or actually employment? Check the key indicators.</p>
                  <Link href="/contractor-vs-employee-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                    Use the Contractor vs Employee Calculator <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <section id="company">
              <h2>Company (Pty Ltd)</h2>
              <p>
                A proprietary limited company (Pty Ltd) is a separate legal entity from its directors and shareholders. The company earns income, pays tax, and can hold assets independently. This separation provides <strong>asset protection</strong> — creditors of the company generally cannot access the personal assets of directors.
              </p>
              <p>
                The base rate entity company tax rate is <strong>25%</strong> for companies with aggregated turnover under $50 million. This flat rate is significantly lower than the top individual marginal rate of 45% + 2% Medicare levy = 47%.
              </p>
              <h3>Paying Yourself from a Company</h3>
              <p>
                Company directors typically pay themselves through a combination of:
              </p>
              <ul>
                <li><strong>Salary/wages</strong> — Taxed at individual marginal rates. The company claims a deduction and must pay 12% SG on the director&apos;s salary</li>
                <li><strong>Dividends</strong> — Distributed from after-tax profits. Franked dividends carry franking credits that offset the individual&apos;s tax liability</li>
                <li><strong>Retained earnings</strong> — Profits left in the company are taxed at 25% and can be reinvested or distributed later</li>
              </ul>
              <h3>Setup and Ongoing Costs</h3>
              <ul>
                <li>ASIC company registration: <strong>$576</strong> (2025-26)</li>
                <li>Annual ASIC review fee: <strong>$310</strong></li>
                <li>Accountant fees (company tax return, BAS, bookkeeping): <strong>$2,500-$5,000/year</strong></li>
                <li>Total first-year setup: approximately <strong>$800-$1,200</strong> including registration and initial accounting</li>
              </ul>
              <p>
                <strong>Best for:</strong> Businesses earning consistently over $120,000-$135,000 that want asset protection, the ability to retain profits at 25%, and a more professional structure for clients and contracts.
              </p>
            </section>

            <section id="take-home-comparison">
              <h2>Take-Home Pay Comparison</h2>
              <p>
                The following table compares approximate take-home outcomes at three income levels. The employee column assumes the employer pays SG on top. The sole trader column includes self-funded super. The company column assumes paying a $70,000 salary and retaining/distributing the rest.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">At $100K Income</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Employee</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Sole Trader</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Gross income</td>
                        <td className="p-3 text-navy text-right">$100,000</td>
                        <td className="p-3 text-navy text-right">$100,000</td>
                        <td className="p-3 text-navy text-right">$100,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Income tax + Medicare</td>
                        <td className="p-3 text-navy text-right">$22,788</td>
                        <td className="p-3 text-navy text-right">$22,788</td>
                        <td className="p-3 text-navy text-right">~$22,088*</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Super cost</td>
                        <td className="p-3 text-navy text-right">$0 (employer pays)</td>
                        <td className="p-3 text-navy text-right">$12,000 (self-funded)</td>
                        <td className="p-3 text-navy text-right">$8,400 (on $70K salary)</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/30">
                        <td className="p-3 text-navy font-bold">Cash in hand</td>
                        <td className="p-3 text-navy text-right font-bold">$77,212</td>
                        <td className="p-3 text-navy text-right font-bold">$65,212</td>
                        <td className="p-3 text-navy text-right font-bold">~$69,512</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">At $150K Income</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Employee</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Sole Trader</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Gross income</td>
                        <td className="p-3 text-navy text-right">$150,000</td>
                        <td className="p-3 text-navy text-right">$150,000</td>
                        <td className="p-3 text-navy text-right">$150,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Income tax + Medicare</td>
                        <td className="p-3 text-navy text-right">$38,838</td>
                        <td className="p-3 text-navy text-right">$38,838</td>
                        <td className="p-3 text-navy text-right">~$33,538*</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Super cost</td>
                        <td className="p-3 text-navy text-right">$0 (employer pays)</td>
                        <td className="p-3 text-navy text-right">$18,000 (self-funded)</td>
                        <td className="p-3 text-navy text-right">$8,400 (on $70K salary)</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/30">
                        <td className="p-3 text-navy font-bold">Cash in hand</td>
                        <td className="p-3 text-navy text-right font-bold">$111,162</td>
                        <td className="p-3 text-navy text-right font-bold">$93,162</td>
                        <td className="p-3 text-navy text-right font-bold">~$108,062</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">At $200K Income</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Employee</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Sole Trader</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Gross income</td>
                        <td className="p-3 text-navy text-right">$200,000</td>
                        <td className="p-3 text-navy text-right">$200,000</td>
                        <td className="p-3 text-navy text-right">$200,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Income tax + Medicare</td>
                        <td className="p-3 text-navy text-right">$57,338</td>
                        <td className="p-3 text-navy text-right">$57,338</td>
                        <td className="p-3 text-navy text-right">~$46,538*</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Super cost</td>
                        <td className="p-3 text-navy text-right">$0 (employer pays)</td>
                        <td className="p-3 text-navy text-right">$24,000 (self-funded)</td>
                        <td className="p-3 text-navy text-right">$8,400 (on $70K salary)</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/30">
                        <td className="p-3 text-navy font-bold">Cash in hand</td>
                        <td className="p-3 text-navy text-right font-bold">$142,662</td>
                        <td className="p-3 text-navy text-right font-bold">$118,662</td>
                        <td className="p-3 text-navy text-right font-bold">~$145,062</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-warmgray">
                *Company figures combine personal tax on the $70K director salary with 25% company tax on retained profits, plus franking credits on dividends. Actual outcomes vary based on dividend timing and personal deductions. These are simplified illustrations — consult an accountant for precise modelling.
              </p>
            </section>

            <section id="when-to-switch">
              <h2>When to Switch Structures</h2>
              <p>
                Switching from sole trader to company makes sense when several conditions align:
              </p>
              <ul>
                <li><strong>Consistent income above $120,000-$135,000</strong> — The 25% company tax rate starts saving money compared to the 37% and 45% individual brackets</li>
                <li><strong>Asset protection needs</strong> — If your business carries liability risk (client work, physical services, product supply), a company shields personal assets</li>
                <li><strong>Retaining profits</strong> — If you do not need all business income personally, leaving profits in the company at 25% tax allows reinvestment</li>
                <li><strong>Multiple income streams</strong> — A company can split income through dividends to shareholders (within tax laws) and employ family members</li>
                <li><strong>Professional credibility</strong> — Some clients and government contracts require engaging with a company rather than a sole trader</li>
              </ul>
              <p>
                Do <strong>not</strong> switch solely for tax reasons at lower income levels. The additional accounting costs ($2,500-$5,000/year), ASIC fees ($310/year), and compliance burden (separate bank accounts, company tax returns, director obligations) can outweigh any tax benefit below $120,000.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <ul>
                <li><Link href="/contractor-vs-employee/">Contractor vs Employee Guide</Link> — Understand the legal distinction and ATO tests</li>
                <li><Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> — Compare take-home pay for both arrangements</li>
                <li><Link href="/gig-economy-pay-guide/">Gig Economy Pay Guide</Link> — Tax and super for platform-based workers</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — Calculate individual tax at any income level</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — SG obligations and voluntary contribution strategies</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="when-switch" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When should I switch from sole trader to a company?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Consider switching when your taxable income consistently exceeds $120,000-$135,000, when you need asset protection from business liabilities, or when you want to retain profits at the 25% company tax rate. The additional compliance costs ($3,000-$5,000/year for accounting and ASIC fees) mean the switch is not worthwhile at lower income levels.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="same-tax" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do sole traders pay the same tax as employees?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Sole traders pay individual income tax at the same marginal rates as employees (0% to 45% plus Medicare levy). The difference is that sole traders can deduct business expenses before tax, must self-manage PAYG instalments and BAS lodgment, and are responsible for their own superannuation contributions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="company-rate" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the company tax rate in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The base rate entity company tax rate is <strong>25%</strong> for companies with aggregated turnover under $50 million (FY2025-26). This flat rate applies to all taxable company income. When profits are distributed as franked dividends, the shareholder receives a franking credit for the 25% tax already paid, avoiding double taxation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="gst" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When do I need to register for GST?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    GST registration is mandatory when your annual turnover reaches <strong>$75,000</strong> (or $150,000 for non-profit organisations). Below the threshold, registration is optional but can be beneficial if your business purchases include significant GST that you could claim back as input tax credits. Once registered, you must lodge BAS and charge 10% GST on taxable supplies.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="super-sole" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do sole traders have to pay super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No, super contributions are optional for sole traders — but strongly recommended. You can contribute up to <strong>$30,000</strong> per year in concessional (tax-deductible) contributions and claim the full amount as a deduction on your tax return. This reduces your taxable income while building retirement savings. Without employer SG, sole traders must proactively fund their own retirement.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="abn" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much does it cost to set up each structure?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    <strong>Sole trader:</strong> Free — ABN registration is instant and no-cost through the Australian Business Register. <strong>Company:</strong> ASIC registration costs $576 (2025-26), plus $310 annual review fee. Initial accounting setup adds $500-$1,000. Total first-year cost is approximately $800-$1,200 for a company, compared to $0 for a sole trader.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Tax comparisons use FY2025-26 individual marginal rates and the 25% base rate entity company tax rate. Take-home pay figures are simplified illustrations assuming no deductions beyond the standard tax-free threshold and Medicare levy. Company scenarios assume a $70,000 director salary with retained earnings taxed at 25%. Actual outcomes depend on deductions, dividend timing, and individual circumstances. This is general information, not business structuring advice.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("employee-vs-sole-trader-vs-company"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/contractor-vs-employee-calculator/" label="Contractor vs Employee Calc" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                    <SidebarLink href="/contractor-pay-calculator/" label="Contractor Pay Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/contractor-vs-employee/" label="Contractor vs Employee Guide" />
                    <SidebarLink href="/gig-economy-pay-guide/" label="Gig Economy Pay Guide" />
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Compare your options</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Calculate the real take-home difference between contracting and employment at your income level.</p>
                  <Link href="/contractor-vs-employee-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Open Calculator
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
