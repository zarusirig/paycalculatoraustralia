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
  { title: "Salary packaging", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/salary-sacrificing-for-employees", publisher: SOURCES.ato.name },
  { title: "Fringe benefits tax — exempt benefits", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits", publisher: SOURCES.ato.name },
  { title: "FBT concessions for not-for-profit organisations", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/fbt-concessions-for-not-for-profit-organisations", publisher: SOURCES.ato.name },
  { title: "Reportable fringe benefits", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax", publisher: SOURCES.ato.name },
];

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

export default function SalaryPackagingGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Salary Packaging Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Salary Packaging Guide — Benefits Beyond Novated Leases
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Salary packaging extends far beyond novated car leases. Not-for-profit employees, public hospital staff, and charities workers can access FBT-exempt benefits worth thousands each year — from meal entertainment to portable devices and self-education expenses.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-is">
              <h2>What Is Salary Packaging?</h2>
              <p>
                Salary packaging is an arrangement where your employer pays for certain expenses or benefits from your <strong>pre-tax salary</strong>, reducing your taxable income. While the terms &quot;salary packaging&quot; and &quot;salary sacrifice&quot; are often used interchangeably, salary packaging is the broader concept — it covers all pre-tax benefits including living expenses, meal entertainment, novated leases, portable devices, and superannuation contributions.
              </p>
              <p>
                Salary sacrifice specifically refers to redirecting pre-tax salary into superannuation. Salary packaging encompasses the full range of benefits an employer can provide from pre-tax earnings. The distinction matters because different benefits have different FBT treatment, caps, and eligibility rules.
              </p>
              <p>
                In the private sector, salary packaging options are generally limited to superannuation, novated leases, and portable electronic devices. The real power of salary packaging emerges in the <strong>not-for-profit (NFP)</strong> and <strong>public hospital</strong> sectors, where special FBT exemptions allow employees to package everyday living expenses tax-free.
              </p>
            </section>

            <section id="who-can-access">
              <h2>Who Can Access Salary Packaging?</h2>
              <p>
                All employees can access some form of salary packaging, but the range and value of benefits varies dramatically by employer type. The ATO classifies employers into categories that determine FBT exemptions:
              </p>
              <ul>
                <li><strong>Public benevolent institutions (PBIs)</strong> — Charities, community services, disability organisations. FBT-exempt cap: <strong>$15,900</strong> per FBT year</li>
                <li><strong>Public and not-for-profit hospitals</strong> — Public hospitals, private NFP hospitals. FBT-exempt cap: <strong>$15,900</strong> plus an additional <strong>$2,650</strong> for meal entertainment</li>
                <li><strong>Health promotion charities</strong> — Organisations registered with the ACNC promoting health. FBT-exempt cap: <strong>$15,900</strong></li>
                <li><strong>Private sector employers</strong> — Salary packaging limited to super, novated leases (with FBT unless EV), and portable devices</li>
              </ul>
              <p>
                The $15,900 cap is calculated on the <strong>grossed-up taxable value</strong> of the benefits, not the face value. For most living expenses without GST (rent, mortgage), the grossed-up value equals the face value. For items with GST, the grossed-up value is higher, meaning the effective packaging amount is slightly less than $15,900.
              </p>
            </section>

            <section id="fbt-exempt-benefits">
              <h2>FBT-Exempt Benefits</h2>
              <p>
                The following salary packaging benefits are exempt from Fringe Benefits Tax, making them the most tax-effective options available:
              </p>

              <h3>NFP Living Expenses ($15,900 Cap)</h3>
              <p>
                Employees of PBIs and public hospitals can salary package everyday living expenses up to $15,900 per FBT year (1 April to 31 March). Eligible expenses include:
              </p>
              <ul>
                <li>Rent or mortgage repayments</li>
                <li>Grocery and household bills</li>
                <li>Personal loan repayments</li>
                <li>Credit card payments</li>
                <li>School fees and childcare costs</li>
                <li>Health insurance premiums</li>
              </ul>
              <p>
                At a marginal tax rate of 30%, packaging the full $15,900 saves approximately <strong>$4,770 in income tax</strong> annually. At the 37% bracket, the saving rises to <strong>$5,883</strong>.
              </p>

              <h3>Meal Entertainment ($2,650 Cap)</h3>
              <p>
                Public hospital and certain NFP employees can package meal entertainment expenses up to <strong>$2,650</strong> (grossed-up value) on top of the $15,900 living expenses cap. Qualifying meal entertainment includes:
              </p>
              <ul>
                <li>Restaurant meals and takeaway food</li>
                <li>Catering for social events</li>
                <li>Food and drink consumed at entertainment venues</li>
                <li>Holiday accommodation that includes meals</li>
              </ul>
              <p>
                The meal entertainment benefit does <strong>not</strong> cover regular grocery shopping or work lunches eaten alone at your desk. The expense must have an entertainment or social component.
              </p>

              <h3>Portable Electronic Devices</h3>
              <p>
                All employees — regardless of employer type — can salary package <strong>one portable electronic device per category per FBT year</strong> when the device is used primarily for work. Eligible categories include:
              </p>
              <ul>
                <li>Laptop or notebook computer</li>
                <li>Tablet device</li>
                <li>Mobile phone</li>
                <li>GPS navigation device</li>
                <li>Portable printer</li>
              </ul>
              <p>
                A $2,000 laptop packaged at the 30% marginal rate saves <strong>$600</strong> in income tax. The device must be used primarily (more than 50%) for employment duties.
              </p>

              <h3>Self-Education Expenses</h3>
              <p>
                Employer-provided education that is sufficiently connected to the employee&apos;s current role is an exempt benefit. This includes course fees, textbooks, and related travel for work-related education. The education must maintain or improve skills required in the employee&apos;s <strong>current</strong> employment — courses for a completely new career direction do not qualify.
              </p>
            </section>

            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
              <div className="flex items-start gap-4">
                <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Model Your Salary Package</h3>
                  <p className="text-navy text-sm mb-3">See how salary sacrifice into super affects your take-home pay, tax, and long-term wealth at your exact salary level.</p>
                  <Link href="/salary-sacrifice-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                    Use our Salary Sacrifice Calculator <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <section id="how-it-affects-pay">
              <h2>How Salary Packaging Affects Your Pay</h2>
              <p>
                The following worked example demonstrates the impact of salary packaging for an NFP employee earning <strong>$80,000</strong> who packages the full <strong>$15,900</strong> living expenses cap:
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Component</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Without Packaging</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">With $15,900 Packaging</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Gross salary</td>
                        <td className="p-3 text-navy text-right">$80,000</td>
                        <td className="p-3 text-navy text-right">$80,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Packaged amount (pre-tax)</td>
                        <td className="p-3 text-navy text-right">$0</td>
                        <td className="p-3 text-navy text-right">$15,900</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Taxable income</td>
                        <td className="p-3 text-navy text-right">$80,000</td>
                        <td className="p-3 text-navy text-right">$64,100</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Income tax (incl. Medicare)</td>
                        <td className="p-3 text-navy text-right">$16,188</td>
                        <td className="p-3 text-navy text-right">$11,418</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Cash in hand (salary - tax)</td>
                        <td className="p-3 text-navy text-right">$63,812</td>
                        <td className="p-3 text-navy text-right">$52,682</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/30">
                        <td className="p-3 text-navy font-bold">Total value (cash + packaged)</td>
                        <td className="p-3 text-navy text-right font-bold">$63,812</td>
                        <td className="p-3 text-navy text-right font-bold">$68,582</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The employee saves <strong>$4,770</strong> in income tax by packaging $15,900 of living expenses. The packaged amount pays for expenses the employee would have paid from after-tax income anyway — rent, mortgage, groceries — so the full tax saving flows directly to the bottom line. Over a 10-year career in the NFP sector, this totals <strong>$47,700</strong> in cumulative tax savings.
              </p>
            </section>

            <section id="rfba-reporting">
              <h2>RFBA Reporting — How It Affects Other Obligations</h2>
              <p>
                When you salary package benefits (other than super), your employer reports the grossed-up taxable value as a <strong>Reportable Fringe Benefits Amount (RFBA)</strong> on your income statement. While RFBA does not increase your income tax, it is added back for the following means-tested calculations:
              </p>
              <ul>
                <li><strong>Centrelink income tests</strong> — Services Australia adds RFBA to your adjusted taxable income (ATI) when assessing eligibility for Family Tax Benefit, childcare subsidies, and other payments. See our <Link href="/centrelink-income-test/">Centrelink Income Test Guide</Link></li>
                <li><strong>HECS-HELP repayments</strong> — The ATO includes RFBA in Repayment Income, potentially pushing you above a repayment threshold</li>
                <li><strong>Medicare Levy Surcharge</strong> — RFBA is included in the income test for the MLS, which applies if you earn over $93,000 (single) without private hospital cover</li>
                <li><strong>Child support assessments</strong> — The Child Support Agency includes RFBA in adjusted taxable income</li>
              </ul>
              <p>
                For an employee packaging the full $15,900, the RFBA reported is <strong>$15,900</strong> (for Type 2 benefits without GST, like rent/mortgage). This amount appears on your income statement and payment summary but does <strong>not</strong> increase the tax you owe — it only affects the means-tested obligations listed above.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <ul>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> — Model the tax impact of sacrificing into super</li>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link> — Deep dive into salary sacrifice into superannuation</li>
                <li><Link href="/novated-lease-guide/">Novated Lease Guide</Link> — Compare EV and ICE novated lease structures</li>
                <li><Link href="/fringe-benefits-tax/">Fringe Benefits Tax Guide</Link> — Full FBT rates, exemptions, and employer obligations</li>
                <li><Link href="/centrelink-income-test/">Centrelink Income Test</Link> — How adjusted taxable income affects government payments</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="difference" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the difference between salary packaging and salary sacrifice?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Salary packaging is the broad term for any arrangement where your employer provides benefits from your pre-tax salary — including living expenses, meal entertainment, novated leases, and devices. Salary sacrifice specifically refers to redirecting pre-tax salary into superannuation. All salary sacrifice is salary packaging, but not all salary packaging is salary sacrifice.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="eligibility" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Who is eligible for the $15,900 FBT-exempt cap?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Employees of public benevolent institutions (PBIs), health promotion charities, public hospitals, and not-for-profit hospitals. Your employer must be registered as an FBT-exempt or FBT-rebatable organisation. Private sector employees cannot access the $15,900 living expenses cap — their packaging options are limited to super, novated leases, and portable devices.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="meal-ent" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What counts as meal entertainment?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Meal entertainment includes restaurant and cafe dining, takeaway food and drink, catering for social functions, and food consumed at entertainment venues. It does <strong>not</strong> include regular grocery shopping, meals eaten at your desk, or sustenance food purchased during work travel. The expense must have a social or entertainment element.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="centrelink" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary packaging affect my Centrelink payments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes, potentially. Services Australia includes your Reportable Fringe Benefits Amount (RFBA) in the adjusted taxable income calculation used for income testing. Packaging $15,900 in living expenses means $15,900 is added to your ATI for Centrelink purposes. This may reduce eligibility for Family Tax Benefit, childcare subsidies, and other income-tested payments — even though your taxable income is lower.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hecs" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary packaging reduce my HECS-HELP repayments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The ATO calculates HECS-HELP repayments using Repayment Income, which includes taxable income plus RFBA plus reportable employer super contributions. Salary packaging reduces your taxable income but the RFBA is added back, so your Repayment Income remains essentially unchanged. There is no HECS benefit from salary packaging.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="devices" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can private sector employees salary package a laptop?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Portable electronic devices used primarily for work are FBT-exempt regardless of employer type. You can package one laptop, one tablet, one mobile phone, and one GPS device per FBT year (1 April to 31 March). The device must be used more than 50% for employment duties. A $2,500 laptop at the 30% tax bracket saves $750 in income tax.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fbt-year" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When does the FBT year run?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The FBT year runs from <strong>1 April to 31 March</strong>, which is different from the financial year (1 July to 30 June). The $15,900 and $2,650 caps reset on 1 April each year. If you start a salary packaging arrangement mid-FBT year, the caps are pro-rated based on the number of days remaining in the FBT year.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Salary packaging caps and FBT exemptions are based on the Fringe Benefits Tax Assessment Act 1986 and ATO rulings for public benevolent institutions and public hospitals. The worked example uses FY2025-26 individual tax rates effective 1 July 2025. NFP packaging caps are per FBT year (1 April to 31 March), not per financial year.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("salary-packaging-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                    <SidebarLink href="/fringe-benefits-tax/" label="Fringe Benefits Tax Guide" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Guide" />
                    <SidebarLink href="/novated-lease-guide/" label="Novated Lease Guide" />
                    <SidebarLink href="/centrelink-income-test/" label="Centrelink Income Test" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate your package</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Model different salary sacrifice amounts and see the exact impact on your take-home pay and tax savings.</p>
                  <Link href="/salary-sacrifice-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
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
