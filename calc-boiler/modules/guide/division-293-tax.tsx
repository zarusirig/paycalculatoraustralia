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

const DIV293_THRESHOLD = 250_000;

const SOURCES_LIST: SourceLink[] = [
  { title: "Division 293 tax", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals/super/growing-and-keeping-track-of-your-super/caps-on-super-contributions/division-293-tax", publisher: SOURCES.ato.name },
  { title: "Concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals/super/growing-and-keeping-track-of-your-super/caps-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/how-much-to-pay", publisher: SOURCES.ato.name },
];

export default function Division293TaxPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Division 293 Tax</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Division 293 Tax — The Extra Super Tax for High Income Earners
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            If your income plus super contributions exceed $250,000, you may owe an additional 15% tax on your super. Here&apos;s how Division 293 works, how to calculate it, and what strategies can help you manage it.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: What Is Div 293 */}
            <section id="what-is-div-293">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is Division 293 Tax?</h2>
              <p>
                Division 293 is an additional <strong>15% tax</strong> on concessional (before-tax) superannuation contributions for individuals whose combined income and concessional super contributions exceed <strong>${DIV293_THRESHOLD.toLocaleString()}</strong> in a financial year.
              </p>
              <p>
                Concessional super contributions are normally taxed at just <strong>15%</strong> inside your super fund, compared to your marginal tax rate of up to 45% on regular income. Division 293 adds another 15%, bringing the total tax on super contributions to <strong>30%</strong> for high-income earners. This partially closes the tax advantage that higher earners receive from the concessional super tax rate.
              </p>
              <p>
                The $250,000 threshold was reduced from $300,000 on 1 July 2017. It is not indexed, meaning bracket creep gradually draws more taxpayers into Division 293 each year.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Who Is Affected?</strong>
                  <br />
                  Division 293 primarily impacts high-income professionals, executives, and business owners. An employee earning $230,000 with $30,000 in employer SG contributions has a combined income of $260,000 &mdash; triggering Division 293 on $10,000 of their super contributions.
                </p>
              </div>
            </section>

            {/* SECTION 2: How Calculated */}
            <section id="how-calculated">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Division 293 Tax Calculated?</h2>
              <p>
                The ATO calculates Division 293 tax after you lodge your tax return. The formula considers two key amounts:
              </p>
              <ol>
                <li><strong>Income for Division 293 purposes</strong> &mdash; This includes your taxable income, reportable fringe benefits, and total net investment losses (similar to MLS income).</li>
                <li><strong>Low-tax contributed amounts</strong> &mdash; Your concessional (before-tax) super contributions, including employer SG, salary sacrifice, and personal deductible contributions.</li>
              </ol>
              <p>
                The additional 15% tax applies to the <strong>lesser of</strong>:
              </p>
              <ul>
                <li>Your total concessional super contributions, or</li>
                <li>The amount by which your income + super exceeds ${DIV293_THRESHOLD.toLocaleString()}</li>
              </ul>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Examples</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Scenario</th>
                        <th className="px-6 py-4">Taxable Income</th>
                        <th className="px-6 py-4">Super Contributions</th>
                        <th className="px-6 py-4">Combined</th>
                        <th className="px-6 py-4">Div 293 Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Example A</td>
                        <td className="px-6 py-4">$260,000</td>
                        <td className="px-6 py-4">$30,000</td>
                        <td className="px-6 py-4">$290,000</td>
                        <td className="px-6 py-4 font-semibold">$4,500</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Example B</td>
                        <td className="px-6 py-4">$300,000</td>
                        <td className="px-6 py-4">$30,000</td>
                        <td className="px-6 py-4">$330,000</td>
                        <td className="px-6 py-4 font-semibold">$4,500</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Example C</td>
                        <td className="px-6 py-4">$245,000</td>
                        <td className="px-6 py-4">$30,000</td>
                        <td className="px-6 py-4">$275,000</td>
                        <td className="px-6 py-4 font-semibold">$3,750</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Example D</td>
                        <td className="px-6 py-4">$350,000</td>
                        <td className="px-6 py-4">$30,000</td>
                        <td className="px-6 py-4">$380,000</td>
                        <td className="px-6 py-4 font-semibold">$4,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                <strong>Example A explained:</strong> Taxable income of $260,000 plus $30,000 super = $290,000. The excess over $250,000 is $40,000. The lesser of $40,000 (excess) and $30,000 (contributions) is $30,000. Division 293 tax = $30,000 x 15% = <strong>$4,500</strong>.
              </p>
              <p>
                <strong>Example C explained:</strong> Taxable income of $245,000 plus $30,000 super = $275,000. The excess over $250,000 is $25,000. The lesser of $25,000 (excess) and $30,000 (contributions) is $25,000. Division 293 tax = $25,000 x 15% = <strong>$3,750</strong>.
              </p>
            </section>

            {/* SECTION 3: How to Pay */}
            <section id="how-to-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Pay Division 293 Tax</h2>
              <p>
                After you lodge your tax return, the ATO will issue a <strong>Division 293 tax assessment notice</strong> if you are liable. You then have two options for paying the tax:
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Option 1: Pay From Your Super Fund</h3>
              <p>
                You can elect to release money from your super fund to pay the Division 293 tax. The ATO will send you a <strong>release authority</strong>, which you sign and return within <strong>60 days</strong>. The ATO then contacts your super fund to release the amount. This is the most common option as it preserves your personal cash flow.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Option 2: Pay From Personal Funds</h3>
              <p>
                You can pay the Division 293 assessment directly using BPAY, credit card, or direct debit, just like any other ATO debt. The due date is shown on your assessment notice, typically 21 days from the date of issue. Paying from personal funds preserves your super balance but reduces your available cash.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Tip</strong>
                  <br />
                  If you don&apos;t respond to the release authority within 60 days, the ATO will automatically release the amount from your super fund. Set a reminder when you receive the assessment to make your election before the deadline.
                </p>
              </div>
            </section>

            {/* SECTION 4: Strategies */}
            <section id="strategies">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Strategies to Manage Division 293</h2>
              <p>
                While Division 293 cannot be avoided if your income exceeds the threshold, there are strategies to manage its impact:
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Reduce Concessional Contributions</h3>
              <p>
                If your income alone exceeds $250,000, your mandatory employer SG contributions will trigger Division 293 regardless. However, you can choose not to make additional salary sacrifice contributions to limit the amount subject to the extra tax. The trade-off is losing the tax-advantaged super growth.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Consider Non-Concessional Contributions</h3>
              <p>
                Non-concessional (after-tax) contributions do not count towards Division 293 income. If you want to boost your super balance without triggering additional Division 293 tax, after-tax contributions (up to the $120,000 annual cap) are an alternative. These contributions enter your super fund tax-free.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Timing of Income</h3>
              <p>
                If you have discretionary income (e.g., from a business or investments), timing the realisation of capital gains or business profits can help manage whether you cross the $250,000 threshold in a given year. This requires careful planning with a qualified tax adviser.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Despite Division 293, Super Is Still Tax-Effective</h3>
              <p>
                Even with Division 293, the total tax on super contributions is <strong>30%</strong> &mdash; still lower than the top marginal rate of <strong>45%</strong> (plus 2% Medicare levy = 47%). For someone in the top tax bracket, super contributions still save 17% compared to taking the money as salary. Use our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the net benefit.
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-is-div293" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is Division 293 tax?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Division 293 is an additional 15% tax on concessional super contributions for individuals whose income plus super contributions exceed <strong>$250,000</strong>. It effectively doubles the tax on super from 15% to 30% for high-income earners, partially closing the gap between the concessional super tax rate and the top marginal rate.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="who-pays" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I have to pay Division 293 if my salary is under $250K?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes, potentially. Division 293 looks at your <strong>combined</strong> income and concessional super contributions. If your taxable income is $230,000 and your employer pays $30,000 in SG contributions, your combined total is $260,000 &mdash; above the $250,000 threshold. You would owe Division 293 tax on $10,000 of super contributions ($1,500).</AccordionContent>
                </AccordionItem>
                <AccordionItem value="pay-from-super" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I pay Division 293 from my super fund?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. When you receive your Division 293 assessment, the ATO sends a release authority. You have <strong>60 days</strong> to elect to release the amount from your super fund. If you don&apos;t respond within 60 days, the ATO will automatically release it from your super. You can also choose to pay from personal funds instead.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-sacrifice" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary sacrifice into super trigger Division 293?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Salary sacrifice reduces your taxable income but the sacrificed amount is added as a concessional super contribution. Since Division 293 adds income + super contributions, salary sacrifice does <strong>not</strong> help you avoid the threshold. The total of taxable income plus super remains the same. However, the net tax benefit of salary sacrifice is still positive even with Division 293.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="threshold-indexed" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is the $250,000 threshold indexed?</AccordionTrigger>
                  <AccordionContent className="text-warmgray"><strong>No.</strong> The $250,000 Division 293 threshold is not indexed to inflation or wage growth. It has remained at $250,000 since 1 July 2017 (reduced from $300,000). Over time, wage growth means more taxpayers will cross this threshold. Any change would require new legislation.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="still-worth-it" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is it still worth contributing to super with Division 293?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes, for most people. Even with Division 293, super contributions are taxed at <strong>30%</strong> total, compared to a top marginal rate of <strong>47%</strong> (including Medicare levy). That&apos;s still a 17% tax saving on each dollar contributed. The investment earnings inside super are also taxed at a maximum of 15%, compared to your marginal rate outside super.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Division 293 thresholds and calculations are sourced from the Australian Taxation Office. Worked examples use FY2025-26 concessional contribution caps ($30,000) and the 12% SG rate. Individual circumstances vary based on reportable fringe benefits, investment losses, and multiple super fund arrangements. Consult a qualified tax adviser for personalised Division 293 planning.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("division-293-tax"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Guides &amp; Tools</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                    <SidebarLink href="/superannuation-calculator/" label="Superannuation Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Model your super tax</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See how salary sacrifice and SG contributions affect your overall tax position, including Division 293.</p>
                  <Link href="/salary-sacrifice-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Salary Sacrifice Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
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
