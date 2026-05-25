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
  { title: "Mining industry earnings", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: SOURCES.abs.name },
  { title: "Mining industry awards", url: "https://services.fairwork.gov.au/find-my-award", publisher: SOURCES.fwo.name },
  { title: "Zone tax offset", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/zone-or-overseas-forces-tax-offsets", publisher: SOURCES.ato.name },
];

export default function MiningFIFOPayGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Mining &amp; FIFO Pay Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Mining &amp; FIFO Pay Guide — Salaries, Rosters &amp; Take-Home Pay
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Australia&apos;s mining sector is one of the highest-paying industries in the country. FIFO (fly-in, fly-out) workers earn between $100,000 and $200,000+ depending on role, roster structure, and allowances. This guide breaks down mining salaries, FIFO rosters, allowances, tax considerations, and how to calculate your real take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ── Section 1: Average Mining Salaries by Role ── */}
            <section id="mining-salaries-by-role">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Mining Salaries by Role</h2>
              <p>
                Mining salaries in Australia are significantly higher than the national average of approximately $98,000. The combination of remote location, physically demanding work, and specialised skills drives salaries well above $100,000 for most roles. The table below shows typical annual salary ranges for common mining positions, including base salary and typical overtime or allowances.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3 text-right">Salary Range (Annual)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Driller</td><td className="px-5 py-3 text-right font-medium">$140,000 – $180,000</td></tr>
                      <tr><td className="px-5 py-3">Operator (Excavator / Haul Truck)</td><td className="px-5 py-3 text-right font-medium">$100,000 – $140,000</td></tr>
                      <tr><td className="px-5 py-3">Electrician (Underground / Surface)</td><td className="px-5 py-3 text-right font-medium">$130,000 – $170,000</td></tr>
                      <tr><td className="px-5 py-3">Geologist</td><td className="px-5 py-3 text-right font-medium">$120,000 – $160,000</td></tr>
                      <tr><td className="px-5 py-3">Site Manager</td><td className="px-5 py-3 text-right font-medium">$160,000 – $220,000</td></tr>
                      <tr><td className="px-5 py-3">Labourer / General Hand</td><td className="px-5 py-3 text-right font-medium">$80,000 – $110,000</td></tr>
                      <tr><td className="px-5 py-3">Truck Driver (Haul / Road Train)</td><td className="px-5 py-3 text-right font-medium">$100,000 – $140,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                These figures reflect total packages including base salary, overtime, and site-specific loadings. The Pilbara region in Western Australia and the Bowen Basin in Queensland consistently offer the highest pay due to labour shortages and high commodity prices. Use the <Link href="/average-salary-australia/">Average Salary Australia</Link> page to compare mining pay against other industries.
              </p>
            </section>

            {/* ── Section 2: How FIFO Rosters Affect Pay ── */}
            <section id="fifo-rosters">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How FIFO Rosters Affect Pay</h2>
              <p>
                FIFO rosters determine how many days you spend on-site versus at home, and directly affect your total earnings. The most common roster structures in Australian mining are:
              </p>
              <ul>
                <li><strong>2 weeks on / 1 week off (2/1):</strong> The most common roster. Workers spend 14 days on-site followed by 7 days off. This &quot;even time&quot; roster means you work approximately 243 days per year and maximises earning potential.</li>
                <li><strong>8 days on / 6 days off (8/6):</strong> A popular roster offering better work-life balance. Workers spend 8 days on-site followed by 6 days at home, working approximately 209 days per year.</li>
                <li><strong>4 days on / 3 days off (4/3):</strong> Common for drive-in, drive-out (DIDO) roles closer to regional centres. Workers spend 4 days on-site and 3 days at home, working approximately 208 days per year.</li>
              </ul>
              <p>
                Pay structures vary between <strong>annualised salary</strong> (a flat amount regardless of hours worked) and <strong>hourly rate plus overtime</strong>. Annualised salaries are simpler but may not compensate for extra hours. Hourly-plus-overtime arrangements can significantly increase total earnings — a 12-hour shift at time-and-a-half for overtime hours can add <strong>$20,000–$40,000</strong> per year above the base salary. Use the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to model your specific roster and hourly rate.
              </p>
            </section>

            {/* ── Section 3: FIFO Allowances ── */}
            <section id="fifo-allowances">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FIFO Allowances</h2>
              <p>
                FIFO workers receive several allowances on top of their base salary that can significantly increase total remuneration. Understanding these allowances is important for calculating your true take-home pay.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Living Away From Home Allowance (LAFHA)</h3>
              <p>
                LAFHA compensates FIFO workers for the additional costs of living away from their usual place of residence. It covers food and accommodation expenses incurred while on-site. LAFHA can be <strong>tax-free</strong> if the worker maintains a home elsewhere and the allowance is paid under a structured arrangement that meets ATO requirements. Typical LAFHA amounts range from <strong>$50 to $100 per day</strong> on-site, adding $7,000–$14,000 per year in tax-free income on a 2/1 roster.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Travel Allowance</h3>
              <p>
                Most FIFO employers cover the cost of flights between the worker&apos;s home city and the mine site. Where flights are not provided directly, a travel allowance of <strong>$200–$500 per swing</strong> may be paid. This allowance is generally taxable unless the employer books and pays for travel directly, in which case it is a fringe benefit to the employer rather than assessable income to the worker.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Accommodation Provided</h3>
              <p>
                On-site accommodation is typically provided free of charge by the employer. This includes a room in a mining camp or village with meals, laundry, and recreational facilities. Because the employer provides this as a condition of employment (the worker cannot perform the role without being on-site), it is generally not treated as a fringe benefit for tax purposes.
              </p>
            </section>

            {/* ── Section 4: Tax for Mining & FIFO Workers ── */}
            <section id="tax-mining-fifo">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax for Mining &amp; FIFO Workers</h2>
              <p>
                Mining and FIFO workers pay income tax on the same marginal tax brackets as all other Australian employees. However, there are specific tax considerations that FIFO workers should understand.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Zone Tax Offset — Key Change for FIFO Workers</h3>
              <p>
                The <Link href="/zone-tax-offset/">zone tax offset</Link> provides a tax reduction for people who live in remote or isolated areas of Australia. Zone A provides an offset of <strong>$338</strong>, Zone B provides <strong>$57</strong>, and special areas within these zones provide additional amounts up to <strong>$1,173</strong>.
              </p>
              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Important: FIFO Workers Generally NOT Eligible</h3>
                  <p className="text-navy text-sm mb-0">
                    Since the <strong>2015 legislative change</strong>, FIFO workers who maintain their usual place of residence <em>outside</em> the remote zone are <strong>not eligible</strong> for the zone tax offset. The offset now requires that the zone is your &quot;usual place of residence&quot; — simply flying in to work does not qualify. Only workers who genuinely relocate to a remote town and maintain their primary residence there can claim the offset.
                  </p>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Fly-In Deductions</h3>
              <p>
                FIFO workers generally <strong>cannot claim</strong> the cost of travel between their home and the airport, or between the airport and the mine site, as a tax deduction. The ATO treats this as ordinary commuting, even though the distances involved are much larger than a typical commute. However, workers required to carry bulky tools or equipment may be able to claim vehicle expenses for the home-to-airport leg. Deductions for work-related protective clothing, tools, union fees, and self-education remain available. See the <Link href="/tax-deductions-guide/">Tax Deductions Guide</Link> for a full list of claimable items.
              </p>
            </section>

            {/* ── Section 5: Take-Home Pay on Mining Salary ── */}
            <section id="take-home-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay on a Mining Salary</h2>
              <p>
                A mining worker earning <strong>$150,000</strong> per year pays approximately <strong>$38,717</strong> in income tax (including the Medicare levy) for FY2025-26, leaving a take-home pay of approximately <strong>$111,283</strong> per year, or <strong>$4,280 per fortnight</strong>. Adding tax-free LAFHA of $10,000 per year brings the effective take-home to approximately <strong>$121,283</strong>.
              </p>
              <p>
                Superannuation at <strong>12%</strong> adds another <strong>$18,000</strong> on top of the $150,000 gross salary, bringing the total remuneration package to <strong>$168,000</strong>. Use the <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to model your exact mining salary, including overtime and allowances, and see your after-tax position for FY2025-26.
              </p>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Mining Take-Home Pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Section 6: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="fifo-salary" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do FIFO miners earn in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">FIFO mining salaries typically range from $100,000 to $200,000+ depending on role, experience, and roster type. Entry-level labourers start around $80,000–$110,000, while experienced drillers, electricians, and site managers can earn $160,000–$220,000. The Pilbara in WA and the Bowen Basin in QLD offer the highest pay.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="zone-offset" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can FIFO workers claim the zone tax offset?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Generally no. Since 2015, FIFO workers who maintain their usual place of residence outside the remote zone are not eligible for the zone tax offset. The offset requires the zone to be your &quot;usual place of residence.&quot; Only workers who genuinely relocate to a remote town can claim it.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="lafha" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is LAFHA tax-free for FIFO workers?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">LAFHA can be tax-free if specific conditions are met: the worker must maintain a home at a different location, and the allowance must be paid under a structured arrangement. The tax-free component covers the additional food and accommodation costs incurred while living away from home for work. Check with your employer&apos;s payroll team for your specific arrangement.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="best-roster" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the best FIFO roster for earning?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The 2 weeks on / 1 week off (2/1) roster maximises earning potential because you work approximately 243 days per year. However, 8/6 and 4/3 rosters offer better work-life balance. The highest-paying rosters are typically those with longer swings (3/1 or 4/1), though these are less common and can impact wellbeing.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="deductions" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can FIFO workers claim travel to the airport as a deduction?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Generally no. The ATO treats travel from home to the airport as ordinary commuting, which is not deductible. However, if you carry bulky tools or equipment that cannot be stored at the workplace, you may be able to claim vehicle expenses for the home-to-airport portion of the journey.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="overtime" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How does overtime work in mining?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Mining overtime depends on your employment agreement. Under the Mining Industry Award, overtime is generally paid at time-and-a-half for the first 2 hours and double time after that. Many mining enterprise agreements offer annualised salaries that include overtime, while others pay hourly rates with overtime loading for hours beyond 7.6 per day or 38 per week.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Mining salary data is compiled from ABS average weekly earnings data for the mining industry, job advertisement data, and published enterprise agreements. Salary ranges represent typical total packages including base salary, overtime, and common allowances. Tax calculations use ATO tax tables for FY2025-26. All figures are estimates and actual pay varies by employer, site, and individual agreement.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("mining-fifo-pay-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Calculator" />
                    <SidebarLink href="/zone-tax-offset/" label="Zone Tax Offset" />
                    <SidebarLink href="/pay-calculator-wa/" label="WA Pay Calculator" />
                    <SidebarLink href="/average-salary-australia/" label="Average Salary Australia" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate Mining Take-Home</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your mining salary and see your after-tax pay, including super and Medicare levy.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Take-Home Calculator
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
