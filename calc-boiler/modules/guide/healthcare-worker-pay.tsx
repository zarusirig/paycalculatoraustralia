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
  { title: "Nurses Award", url: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000034-nurses-award", publisher: SOURCES.fwo.name },
  { title: "Salary packaging", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/how-fringe-benefits-tax-works/types-of-fringe-benefits", publisher: SOURCES.ato.name },
  { title: "Healthcare earnings", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: SOURCES.abs.name },
];

export default function HealthcareWorkerPayPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Healthcare Worker Pay Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Healthcare Worker Pay Guide — Salaries, Penalties &amp; Salary Packaging
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Healthcare is one of Australia&apos;s largest employers, with over 1.9 million workers. From registered nurses to specialists, pay varies widely based on classification, experience, shift patterns, and whether you work in the public or private sector. This guide covers salaries, penalty rates, and the powerful salary packaging benefits available to public hospital employees.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ── Section 1: Average Healthcare Salaries ── */}
            <section id="healthcare-salaries">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Healthcare Salaries</h2>
              <p>
                Healthcare salaries in Australia vary enormously depending on profession, classification level, and years of experience. Nurses and midwives are covered by state-based enterprise agreements that specify salary bands, while doctors progress through a separate classification system. Allied health professionals (physiotherapists, pharmacists, occupational therapists) fall under their own award or enterprise agreement structures.
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
                      <tr><td className="px-5 py-3">Registered Nurse — Year 1</td><td className="px-5 py-3 text-right font-medium">$72,000</td></tr>
                      <tr><td className="px-5 py-3">Registered Nurse — Year 8</td><td className="px-5 py-3 text-right font-medium">$95,000</td></tr>
                      <tr><td className="px-5 py-3">Clinical Nurse Specialist</td><td className="px-5 py-3 text-right font-medium">$100,000 – $110,000</td></tr>
                      <tr><td className="px-5 py-3">Nurse Practitioner</td><td className="px-5 py-3 text-right font-medium">$115,000 – $130,000</td></tr>
                      <tr><td className="px-5 py-3">Junior Doctor (Intern / HMO)</td><td className="px-5 py-3 text-right font-medium">$85,000 – $100,000</td></tr>
                      <tr><td className="px-5 py-3">Registrar</td><td className="px-5 py-3 text-right font-medium">$120,000 – $160,000</td></tr>
                      <tr><td className="px-5 py-3">Specialist (Consultant)</td><td className="px-5 py-3 text-right font-medium">$250,000 – $500,000+</td></tr>
                      <tr><td className="px-5 py-3">Physiotherapist</td><td className="px-5 py-3 text-right font-medium">$70,000 – $90,000</td></tr>
                      <tr><td className="px-5 py-3">Pharmacist</td><td className="px-5 py-3 text-right font-medium">$75,000 – $100,000</td></tr>
                      <tr><td className="px-5 py-3">Aged Care Worker</td><td className="px-5 py-3 text-right font-medium">$55,000 – $65,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                These figures represent base salaries before penalty rates and allowances. Nurses and doctors who work regular evening, night, and weekend shifts can earn <strong>15–30% more</strong> than the base salary through penalty rate loadings. Use the <Link href="/average-salary-australia/">Average Salary Australia</Link> page to compare healthcare pay against other industries.
              </p>
            </section>

            {/* ── Section 2: Penalty Rates & Shift Allowances ── */}
            <section id="penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Penalty Rates &amp; Shift Allowances</h2>
              <p>
                Healthcare workers, particularly nurses and midwives, receive significant penalty rate loadings for working outside standard business hours. These rates are set out in enterprise agreements (EAs) that vary by state and employer, but typically follow a similar structure across public hospitals.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Shift Type</th>
                        <th className="px-5 py-3 text-right">Loading (FT/PT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3 text-right font-medium">+25%</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3 text-right font-medium">+50%</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3 text-right font-medium">+150%</td></tr>
                      <tr><td className="px-5 py-3">Evening Shift (after 6pm)</td><td className="px-5 py-3 text-right font-medium">+12.5%</td></tr>
                      <tr><td className="px-5 py-3">Night Shift (after 10pm)</td><td className="px-5 py-3 text-right font-medium">+15%</td></tr>
                      <tr><td className="px-5 py-3">Permanent Night Shift</td><td className="px-5 py-3 text-right font-medium">+25%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                A registered nurse on Year 4 rates ($85,000 base) who works a regular night shift roster can earn an additional <strong>$12,000–$18,000</strong> per year through penalty loadings alone. Emergency department and intensive care nurses often attract additional allowances of <strong>$2,000–$5,000</strong> per year for working in high-acuity environments. See the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to model your shift pattern and penalty rates.
              </p>
            </section>

            {/* ── Section 3: Salary Packaging for Health Workers ── */}
            <section id="salary-packaging">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Packaging for Health Workers</h2>
              <p>
                Salary packaging (also called salary sacrifice) is one of the most valuable financial benefits available to healthcare workers employed in public hospitals and not-for-profit health organisations. It allows you to pay for certain expenses with <strong>pre-tax dollars</strong>, reducing your taxable income and increasing your take-home pay.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Public Hospital FBT Exemption</h3>
              <p>
                Public hospital employees can salary package up to <strong>$15,900 per FBT year</strong> for general living expenses (rent, mortgage repayments, credit card payments, school fees) without incurring fringe benefits tax. This is a significant advantage over private sector workers, who cannot access this exemption. On top of the $15,900, an additional <strong>$2,650 per year</strong> can be salary packaged for meal entertainment and holiday accommodation expenses.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: Salary Packaging Impact</h3>
              <p>
                Consider a registered nurse earning <strong>$85,000</strong> per year who salary packages the full $15,900 plus $2,650 meal entertainment:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Component</th>
                        <th className="px-5 py-3 text-right">Without Packaging</th>
                        <th className="px-5 py-3 text-right">With Packaging</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Gross Salary</td><td className="px-5 py-3 text-right">$85,000</td><td className="px-5 py-3 text-right">$85,000</td></tr>
                      <tr><td className="px-5 py-3">Salary Packaged Amount</td><td className="px-5 py-3 text-right">$0</td><td className="px-5 py-3 text-right">$18,550</td></tr>
                      <tr><td className="px-5 py-3">Taxable Income</td><td className="px-5 py-3 text-right">$85,000</td><td className="px-5 py-3 text-right">$66,450</td></tr>
                      <tr><td className="px-5 py-3">Income Tax + Medicare</td><td className="px-5 py-3 text-right">$19,717</td><td className="px-5 py-3 text-right">$14,150</td></tr>
                      <tr className="font-bold bg-sandstone/50"><td className="px-5 py-3">Annual Benefit</td><td className="px-5 py-3 text-right">—</td><td className="px-5 py-3 text-right text-eucalyptus-dark">+$5,567 per year</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                That is an extra <strong>$214 per fortnight</strong> in take-home pay simply by structuring existing expenses through salary packaging. Read the full <Link href="/salary-packaging-guide/">Salary Packaging Guide</Link> for eligibility criteria and step-by-step setup instructions.
              </p>
            </section>

            {/* ── Section 4: Take-Home Pay Examples ── */}
            <section id="take-home-examples">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay Examples</h2>
              <p>
                Below are take-home pay estimates for common healthcare roles in FY2025-26, calculated on base salary before penalty rates. Actual take-home will be higher for workers doing shift work.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3 text-right">Gross Salary</th>
                        <th className="px-5 py-3 text-right">Tax + Medicare</th>
                        <th className="px-5 py-3 text-right">Take-Home</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Aged Care Worker</td><td className="px-5 py-3 text-right">$60,000</td><td className="px-5 py-3 text-right">$10,967</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$49,033</td></tr>
                      <tr><td className="px-5 py-3">RN Year 1</td><td className="px-5 py-3 text-right">$72,000</td><td className="px-5 py-3 text-right">$14,567</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$57,433</td></tr>
                      <tr><td className="px-5 py-3">RN Year 8</td><td className="px-5 py-3 text-right">$95,000</td><td className="px-5 py-3 text-right">$21,717</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$73,283</td></tr>
                      <tr><td className="px-5 py-3">Registrar</td><td className="px-5 py-3 text-right">$140,000</td><td className="px-5 py-3 text-right">$35,867</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$104,133</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Healthcare Take-Home Pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Section 5: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="nurse-salary" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do registered nurses earn in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Registered nurses earn between $72,000 (Year 1) and $95,000 (Year 8) in base salary. Clinical nurse specialists earn $100,000–$110,000, and nurse practitioners earn $115,000–$130,000. Add penalty rates for shift work and the actual income is typically 15–30% higher than the base.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="sal-packaging" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Who is eligible for salary packaging in healthcare?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Employees of public hospitals and not-for-profit health organisations are eligible for salary packaging of up to $15,900 for general living expenses plus $2,650 for meal entertainment per FBT year. Private hospital employees may have different or limited salary packaging options depending on their employer.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="penalty-rates" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What penalty rates do nurses receive?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Under most enterprise agreements, nurses receive +25% for Saturday shifts, +50% for Sunday, +150% for public holidays, +12.5% for evening shifts (after 6pm), and +15% for night shifts (after 10pm). Permanent night shift workers receive +25%. Rates vary slightly between states and employers.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="aged-care" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do aged care workers earn?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Aged care workers (personal care assistants / AINs) earn between $55,000 and $65,000 per year. Following the Fair Work Commission&apos;s aged care work value case in 2023, wages increased by 15% for direct care workers. Further increases are being phased in through to 2025.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="doctor-pay" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do doctors earn in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Junior doctors (interns/HMOs) earn $85,000–$100,000, registrars earn $120,000–$160,000, and specialists earn $250,000–$500,000+. GP earnings vary widely based on billing structure — bulk-billing GPs may earn $150,000–$250,000, while those in private practice with mixed billing can earn significantly more.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="public-private" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is public or private healthcare better paid?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Base salaries are often similar, but public hospital employees benefit from salary packaging ($15,900 FBT-free) which can increase take-home pay by $4,000–$6,000 per year. Private hospitals may offer higher base rates for experienced nurses but typically cannot match the salary packaging benefit. Overall, public sector total remuneration is often higher for nurses and allied health when salary packaging is included.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Healthcare salary data is sourced from ABS average weekly earnings, published enterprise agreements (NSW Health, Victoria Health, Queensland Health), and the Nurses and Midwives Award. Salary packaging calculations use ATO FBT exemption thresholds for public hospitals. Tax calculations use FY2025-26 marginal rates including the 2% Medicare levy. Penalty rate percentages reflect typical public hospital enterprise agreement provisions.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("healthcare-worker-pay"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
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
                    <SidebarLink href="/salary-packaging-guide/" label="Salary Packaging Guide" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Calculator" />
                    <SidebarLink href="/average-salary-australia/" label="Average Salary Australia" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Salary Packaging Impact</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Public hospital workers can save $4,000–$6,000 per year through salary packaging. Calculate your benefit.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Calculate Take-Home Pay
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
