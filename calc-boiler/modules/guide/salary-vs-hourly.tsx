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
  { title: "Pay and wages", url: "https://www.fairwork.gov.au/pay-and-wages", publisher: SOURCES.fwo.name },
  { title: "Hours of work, overtime and penalty rates", url: "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-and-allowances", publisher: SOURCES.fwo.name },
  { title: "Types of employees", url: "https://www.fairwork.gov.au/starting-employment/before-starting-employment/types-of-employees", publisher: SOURCES.fwo.name },
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwo.name },
];

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

export default function SalaryVsHourlyPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Salary vs Hourly Pay</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Salary vs Hourly Pay — Which Is Better For You?
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Choosing between a salaried role and hourly pay affects your income stability, overtime access, leave entitlements, and total package value. Here is how to compare them side by side and determine which arrangement genuinely pays more for your situation.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="key-differences">
              <h2>Key Differences at a Glance</h2>
              <p>
                The fundamental difference is simple: salaried employees receive a fixed annual amount divided into equal pay periods, while hourly employees are paid for each hour actually worked. But the downstream effects on overtime, leave, stability, and tax treatment create a more complex picture.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Factor</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Salaried</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Hourly</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Income predictability</td>
                        <td className="p-3 text-navy">Fixed every pay period</td>
                        <td className="p-3 text-navy">Varies with hours worked</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Overtime</td>
                        <td className="p-3 text-navy">Usually unpaid (&quot;reasonable additional hours&quot;)</td>
                        <td className="p-3 text-navy">Paid at 1.5x or 2x penalty rates</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Leave entitlements</td>
                        <td className="p-3 text-navy">4 weeks annual + 10 days personal leave</td>
                        <td className="p-3 text-navy">Same for permanent; casual gets 25% loading instead</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Superannuation</td>
                        <td className="p-3 text-navy">12% on OTE (ordinary time earnings)</td>
                        <td className="p-3 text-navy">12% on OTE (includes casual loading)</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Notice period</td>
                        <td className="p-3 text-navy">1-4 weeks (based on tenure)</td>
                        <td className="p-3 text-navy">Same for permanent hourly; nil for casual</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Flexibility</td>
                        <td className="p-3 text-navy">Less — fixed schedule expected</td>
                        <td className="p-3 text-navy">More — can vary shifts and availability</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Tax treatment</td>
                        <td className="p-3 text-navy">PAYG withheld by employer</td>
                        <td className="p-3 text-navy">PAYG withheld by employer (same)</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-navy font-medium">Career progression</td>
                        <td className="p-3 text-navy">Typically clearer path to senior roles</td>
                        <td className="p-3 text-navy">May require transition to salary for advancement</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section id="salary-pros-cons">
              <h2>Salary: Pros and Cons</h2>
              <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <Card className="bg-eucalyptus-light/30 border-eucalyptus/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-eucalyptus-dark mb-2">The Pros</h4>
                    <ul className="list-disc list-inside text-sm text-navy space-y-1">
                      <li>Predictable income — same amount every pay cycle</li>
                      <li>Paid annual leave and personal/sick leave included</li>
                      <li>Easier to budget and plan for mortgage applications</li>
                      <li>Often includes additional benefits (bonuses, salary packaging)</li>
                      <li>Stronger path to management and leadership roles</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-sandstone border-sandstone-dark/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-ochre mb-2">The Cons</h4>
                    <ul className="list-disc list-inside text-sm text-ochre space-y-1">
                      <li>Often expected to work beyond 38 hours without extra pay</li>
                      <li>No overtime or penalty rate payments in most roles</li>
                      <li>Less flexibility to increase income through extra shifts</li>
                      <li>Salary increases dependent on annual review cycles</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p>
                The biggest advantage of salary is <strong>stability</strong>. You know exactly what you will earn each fortnight, regardless of public holidays, sick days, or quiet periods. This makes loan applications and long-term financial planning significantly easier. The trade-off is that additional effort — working late, weekend emails, extra projects — is rarely compensated separately.
              </p>
            </section>

            <section id="hourly-pros-cons">
              <h2>Hourly Pay: Pros and Cons</h2>
              <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <Card className="bg-eucalyptus-light/30 border-eucalyptus/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-eucalyptus-dark mb-2">The Pros</h4>
                    <ul className="list-disc list-inside text-sm text-navy space-y-1">
                      <li>Paid for every hour worked — no unpaid overtime</li>
                      <li>Overtime at 1.5x (first 2-3 hours) and 2x (thereafter)</li>
                      <li>Weekend and public holiday penalty rates (1.25x to 2.5x)</li>
                      <li>Can increase income by taking extra shifts</li>
                      <li>Casual loading (25%) compensates for lack of leave</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-sandstone border-sandstone-dark/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-ochre mb-2">The Cons</h4>
                    <ul className="list-disc list-inside text-sm text-ochre space-y-1">
                      <li>Income varies — fewer hours means less pay</li>
                      <li>Casual workers have no paid leave entitlements</li>
                      <li>Hours may be cut during quiet business periods</li>
                      <li>Harder to plan finances with variable income</li>
                      <li>Mortgage lenders may view income as less stable</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p>
                Hourly pay shines when <strong>overtime and penalty rates</strong> are available. A worker earning $38.50/hr who regularly works 5 hours of overtime per week at 1.5x earns an additional <strong>$15,015 per year</strong> — money a salaried employee in an equivalent role would not receive. Use our <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to model exact amounts.
              </p>
            </section>

            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
              <div className="flex items-start gap-4">
                <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Convert Your Rate Instantly</h3>
                  <p className="text-navy text-sm mb-3">Convert between hourly, weekly, fortnightly, monthly, and annual pay in seconds.</p>
                  <Link href="/hourly-to-annual-salary-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                    Hourly to Annual Calculator <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <section id="total-package-comparison">
              <h2>Total Package Comparison</h2>
              <p>
                Comparing salary to hourly pay requires looking beyond the base rate. The following example compares a <strong>$75,000 salaried</strong> role with an <strong>hourly role at $38.50/hr</strong> (approximately equivalent base rate) where the hourly worker averages 5 hours of overtime per week.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Component</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">$75K Salary</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">$38.50/hr + OT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Base annual pay</td>
                        <td className="p-3 text-navy text-right">$75,000</td>
                        <td className="p-3 text-navy text-right">$76,076</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Overtime (5hrs/wk at 1.5x)</td>
                        <td className="p-3 text-navy text-right">$0</td>
                        <td className="p-3 text-navy text-right">$15,015</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Total gross income</td>
                        <td className="p-3 text-navy text-right">$75,000</td>
                        <td className="p-3 text-navy text-right">$91,091</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Paid leave value (4 weeks)</td>
                        <td className="p-3 text-navy text-right">$5,769 (included)</td>
                        <td className="p-3 text-navy text-right">$5,852 (perm) / $0 (casual)</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Super (12% on OTE)</td>
                        <td className="p-3 text-navy text-right">$9,000</td>
                        <td className="p-3 text-navy text-right">$9,129</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/30">
                        <td className="p-3 text-navy font-bold">Total package value</td>
                        <td className="p-3 text-navy text-right font-bold">$84,000</td>
                        <td className="p-3 text-navy text-right font-bold">$100,220</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                In this scenario, the hourly worker earns <strong>$16,220 more per year</strong> in total package value — but works 260 additional hours (5 hours x 52 weeks). If overtime is not consistently available, the gap narrows or reverses. The salaried employee benefits from guaranteed income during quiet periods, paid sick days, and no income reduction during annual leave.
              </p>
            </section>

            <section id="tax-treatment">
              <h2>Which Is Better for Tax?</h2>
              <p>
                From a pure tax perspective, <strong>there is no difference</strong>. Both salaried and hourly employees pay individual income tax at the same marginal rates. PAYG withholding is calculated on gross earnings regardless of how pay is structured. The ATO does not differentiate between salary and hourly income on your tax return.
              </p>
              <p>
                The tax difference emerges <strong>indirectly</strong>. Hourly workers with overtime earn higher gross income, pushing them into higher tax brackets. A salaried employee on $75,000 pays approximately <strong>$13,688</strong> in income tax (including Medicare). The hourly worker earning $91,091 pays approximately <strong>$18,515</strong>. While the hourly worker earns more, a larger proportion goes to tax — the effective tax rate rises from 18.3% to 20.3%.
              </p>
              <p>
                Salary sacrifice opportunities are typically more accessible to salaried employees. Employers are more likely to offer packaging arrangements (super, novated leases, devices) to permanent salaried staff. Check your eligibility with our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>.
              </p>
            </section>

            <section id="how-to-convert">
              <h2>How to Convert Between Salary and Hourly</h2>
              <p>
                The standard conversion assumes <strong>38 hours per week</strong> (full-time under the Fair Work Act) and <strong>52 weeks per year</strong>:
              </p>
              <ul>
                <li><strong>Annual to hourly:</strong> $75,000 / 52 / 38 = <strong>$37.93/hr</strong></li>
                <li><strong>Hourly to annual:</strong> $38.50 x 38 x 52 = <strong>$76,076/yr</strong></li>
              </ul>
              <p>
                For an instant conversion at any rate, use our <Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link>. The calculator accounts for different weekly hours and includes tax, super, and take-home pay breakdowns.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <ul>
                <li><Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link> — Convert between hourly, weekly, and annual pay instantly</li>
                <li><Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> — Calculate overtime earnings at penalty rates</li>
                <li><Link href="/employment-type-calculator/">Employment Type Calculator</Link> — Compare full-time, part-time, and casual arrangements</li>
                <li><Link href="/leave-calculator/">Leave Calculator</Link> — Calculate annual leave entitlements and loading</li>
                <li><Link href="/full-time-vs-part-time-vs-casual/">Full-Time vs Part-Time vs Casual Guide</Link> — Compare employment types in detail</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="better" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is salary or hourly pay better in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Neither is universally better. Salary provides income stability, guaranteed paid leave, and predictable budgeting — ideal for employees who value consistency. Hourly pay ensures compensation for every hour worked including overtime and penalty rates — better for workers in industries with regular overtime opportunities. The best choice depends on your industry, role, and financial priorities.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="convert" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I convert my salary to an hourly rate?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Divide your annual salary by 52 weeks, then divide by your standard weekly hours (38 for full-time). For example: $75,000 / 52 / 38 = $37.93 per hour. Use our <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> for an instant conversion with tax and super included.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="overtime" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do salaried employees get overtime in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    It depends on the award or enterprise agreement. Many salaried employees have &quot;reasonable additional hours&quot; clauses, meaning overtime is not separately compensated. However, some awards require overtime payments for salaried workers who exceed standard hours. Employees earning above the high income threshold ($175,000 in FY2025-26) can be directed to work reasonable additional hours without extra pay under the Fair Work Act.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="casual" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is casual hourly pay higher than salary?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Casual employees receive a <strong>25% casual loading</strong> on top of the base hourly rate, which compensates for the absence of paid leave entitlements. This means the headline hourly rate is higher, but when you account for the value of 4 weeks annual leave, 10 days personal leave, and other entitlements, the total package is typically comparable to a permanent role.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="super" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do hourly workers get superannuation?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. All employees — salaried, hourly permanent, and hourly casual — receive the 12% Superannuation Guarantee from their employer on ordinary time earnings (OTE). There is no minimum earnings threshold. Super is calculated on OTE, which includes base rate, shift loadings, and casual loading, but generally excludes overtime.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mortgage" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Which is better for getting a mortgage?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Lenders generally prefer salaried income because it is predictable and verifiable with a single letter of employment. Hourly and casual workers may need to provide 3-6 months of payslips, group certificates, or tax returns to prove consistent income. Overtime and penalty rate income is often discounted by 20-50% in lending assessments because it is not guaranteed.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Total package calculations use FY2025-26 tax rates, 12% SG rate, and standard Fair Work Act entitlements. Overtime is calculated at 1.5x the base hourly rate for the first 2 hours per day, consistent with most modern awards. Individual award conditions may vary.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("salary-vs-hourly"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/hourly-to-annual-salary-calculator/" label="Hourly to Annual Calculator" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Pay Calculator" />
                    <SidebarLink href="/employment-type-calculator/" label="Employment Type Calculator" />
                    <SidebarLink href="/leave-calculator/" label="Leave Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/full-time-vs-part-time-vs-casual/" label="Full-Time vs Part-Time vs Casual" />
                    <SidebarLink href="/award-rates/" label="Award Rates Guide" />
                    <SidebarLink href="/overtime-penalty-rates-guide/" label="Overtime & Penalty Rates" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Convert your rate</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Instantly convert between hourly, weekly, fortnightly, monthly, and annual pay with full tax breakdown.</p>
                  <Link href="/hourly-to-annual-salary-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Open Converter
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
