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
  { title: "Income tax rates for individuals", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Stage 3 tax cuts — Treasury fact sheet", url: "https://treasury.gov.au/tax-cuts", publisher: "Australian Treasury" },
  { title: "Historical tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function Stage3TaxCutsPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Stage 3 Tax Cuts</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Stage 3 Tax Cuts — How Much More You Take Home</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">The revised Stage 3 tax cuts took effect on 1 July 2024, changing tax brackets for every Australian taxpayer earning above $18,200. This guide shows exactly how much you save compared to the old rates, with a full before-and-after comparison at every income level.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: What Changed ───── */}
            <section id="what-changed">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed — Original vs Revised Plan</h2>
              <p>
                The Stage 3 tax cuts were originally legislated in 2019 as part of a three-stage plan. The original design collapsed three tax brackets into two, creating a single <strong>30% rate from $45,001 to $200,000</strong>. In January 2024, the government announced a <strong>revised plan</strong> that instead reduced the bottom rate from 19% to 16%, kept more brackets, and spread the benefit more widely.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Bracket</th><th className="px-5 py-3">Pre-Stage 3 (FY2023-24)</th><th className="px-5 py-3">Original Stage 3 Plan</th><th className="px-5 py-3">Revised Stage 3 (Actual)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">$0 – $18,200</td><td className="px-5 py-3">0%</td><td className="px-5 py-3">0%</td><td className="px-5 py-3">0%</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$18,201 – $45,000</td><td className="px-5 py-3">19%</td><td className="px-5 py-3">19%</td><td className="px-5 py-3"><strong>16%</strong></td></tr>
                      <tr><td className="px-5 py-3 font-medium">$45,001 – $120,000</td><td className="px-5 py-3">32.5%</td><td className="px-5 py-3" rowSpan={2}>30% ($45,001–$200,000)</td><td className="px-5 py-3" rowSpan={2}><strong>30%</strong> ($45,001–$135,000)</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$120,001 – $180,000</td><td className="px-5 py-3">37%</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$135,001 – $190,000</td><td className="px-5 py-3">—</td><td className="px-5 py-3">—</td><td className="px-5 py-3"><strong>37%</strong></td></tr>
                      <tr><td className="px-5 py-3 font-medium">$180,001 / $190,001 / $200,001+</td><td className="px-5 py-3">45% ($180,001+)</td><td className="px-5 py-3">45% ($200,001+)</td><td className="px-5 py-3"><strong>45%</strong> ($190,001+)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The key differences in the revised plan: the lowest rate dropped from <strong>19% to 16%</strong> (benefiting everyone earning $18,201–$45,000), the 30% bracket now extends to $135,000 instead of $120,000, and the 37% bracket was retained (the original plan eliminated it entirely). The 45% threshold moved from $180,001 to $190,001.
              </p>
            </section>

            {/* ───── SECTION 2: Before & After Comparison ───── */}
            <section id="before-after">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Before &amp; After — Tax Savings at Every Income Level</h2>
              <p>
                The following table compares the income tax payable under the <strong>pre-Stage 3 rates (FY2023-24)</strong> versus the <strong>revised Stage 3 rates (FY2024-25 onwards)</strong>. All figures exclude Medicare levy and tax offsets, showing pure income tax only.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Taxable Income</th><th className="px-5 py-3 text-right">Old Tax (Pre-Stage 3)</th><th className="px-5 py-3 text-right">New Tax (Revised Stage 3)</th><th className="px-5 py-3 text-right">Annual Saving</th><th className="px-5 py-3 text-right">Weekly Saving</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">$30,000</td><td className="px-5 py-3 text-right">$2,242</td><td className="px-5 py-3 text-right">$1,888</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$354</td><td className="px-5 py-3 text-right">$6.81</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$40,000</td><td className="px-5 py-3 text-right">$4,142</td><td className="px-5 py-3 text-right">$3,488</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$654</td><td className="px-5 py-3 text-right">$12.58</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$50,000</td><td className="px-5 py-3 text-right">$6,717</td><td className="px-5 py-3 text-right">$5,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$929</td><td className="px-5 py-3 text-right">$17.87</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$60,000</td><td className="px-5 py-3 text-right">$9,967</td><td className="px-5 py-3 text-right">$8,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$1,179</td><td className="px-5 py-3 text-right">$22.67</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$70,000</td><td className="px-5 py-3 text-right">$13,217</td><td className="px-5 py-3 text-right">$11,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$1,429</td><td className="px-5 py-3 text-right">$27.48</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$80,000</td><td className="px-5 py-3 text-right">$16,467</td><td className="px-5 py-3 text-right">$14,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$1,679</td><td className="px-5 py-3 text-right">$32.29</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$90,000</td><td className="px-5 py-3 text-right">$19,717</td><td className="px-5 py-3 text-right">$17,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$1,929</td><td className="px-5 py-3 text-right">$37.10</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$100,000</td><td className="px-5 py-3 text-right">$22,967</td><td className="px-5 py-3 text-right">$20,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$2,179</td><td className="px-5 py-3 text-right">$41.90</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$110,000</td><td className="px-5 py-3 text-right">$26,217</td><td className="px-5 py-3 text-right">$23,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$2,429</td><td className="px-5 py-3 text-right">$46.71</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$120,000</td><td className="px-5 py-3 text-right">$29,467</td><td className="px-5 py-3 text-right">$26,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$2,679</td><td className="px-5 py-3 text-right">$51.52</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$130,000</td><td className="px-5 py-3 text-right">$33,167</td><td className="px-5 py-3 text-right">$29,788</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$3,379</td><td className="px-5 py-3 text-right">$64.98</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$140,000</td><td className="px-5 py-3 text-right">$36,867</td><td className="px-5 py-3 text-right">$33,138</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$3,729</td><td className="px-5 py-3 text-right">$71.71</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$150,000</td><td className="px-5 py-3 text-right">$40,567</td><td className="px-5 py-3 text-right">$36,838</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$3,729</td><td className="px-5 py-3 text-right">$71.71</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$160,000</td><td className="px-5 py-3 text-right">$44,267</td><td className="px-5 py-3 text-right">$40,538</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$3,729</td><td className="px-5 py-3 text-right">$71.71</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$170,000</td><td className="px-5 py-3 text-right">$47,967</td><td className="px-5 py-3 text-right">$44,238</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$3,729</td><td className="px-5 py-3 text-right">$71.71</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$180,000</td><td className="px-5 py-3 text-right">$51,667</td><td className="px-5 py-3 text-right">$47,938</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$3,729</td><td className="px-5 py-3 text-right">$71.71</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$190,000</td><td className="px-5 py-3 text-right">$56,167</td><td className="px-5 py-3 text-right">$51,638</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$4,529</td><td className="px-5 py-3 text-right">$87.10</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$200,000</td><td className="px-5 py-3 text-right">$60,667</td><td className="px-5 py-3 text-right">$56,138</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$4,529</td><td className="px-5 py-3 text-right">$87.10</td></tr>
                      <tr><td className="px-5 py-3 font-medium">$250,000</td><td className="px-5 py-3 text-right">$83,167</td><td className="px-5 py-3 text-right">$78,638</td><td className="px-5 py-3 text-right text-eucalyptus-dark font-semibold">$4,529</td><td className="px-5 py-3 text-right">$87.10</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Calculate Your Exact Tax</h3>
                    <p className="text-navy text-sm mb-3">Enter your salary to see your exact tax under the current Stage 3 brackets, including Medicare levy and LITO.</p>
                    <Link href="/income-tax-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Income Tax Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── SECTION 3: Who Benefits Most ───── */}
            <section id="who-benefits">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Benefits Most?</h2>
              <p>
                The revised Stage 3 tax cuts deliver benefits across all income levels, but the distribution differs significantly from the original plan:
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Low-Income Earners ($18,201 – $45,000)</h3>
              <p>
                This group benefits from the reduction in the bottom marginal rate from <strong>19% to 16%</strong>. The maximum saving in this bracket is <strong>$804</strong> (3% on $26,800). Under the original Stage 3 plan, this group received zero additional benefit. The revised plan delivers the most proportional benefit to low and middle-income earners.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Middle-Income Earners ($45,001 – $135,000)</h3>
              <p>
                This group benefits from the 16% rate cut <strong>plus</strong> the reduction in the second bracket from 32.5% to 30%. For someone earning $90,000, the combined saving is <strong>$1,929 per year</strong> ($37.10 per week). The 30% bracket also extends to $135,000 (up from $120,000), providing additional savings for those earning $120,001-$135,000 who previously paid 37%.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>High-Income Earners ($135,001 – $190,000)</h3>
              <p>
                This group receives smaller savings under the revised plan compared to the original plan. The original plan would have applied a flat 30% to incomes up to $200,000, whereas the revised plan retains a <strong>37% bracket from $135,001 to $190,000</strong>. The saving at $150,000 is <strong>$3,729</strong> — still substantial, but less than the $7,575 that the original plan would have delivered.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Very High-Income Earners ($190,001+)</h3>
              <p>
                The top tax rate of 45% now applies from $190,001 (moved from $180,001). This provides a <strong>$4,529</strong> annual saving compared to the pre-Stage 3 rates. Under the original plan, the 45% rate would not have applied until $200,001, providing a larger benefit. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to see your exact take-home amount under the current rates.
              </p>
            </section>

            {/* ───── SECTION 4: Timeline ───── */}
            <section id="timeline">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Timeline — How We Got Here</h2>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Event</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">2018-19 Budget</td><td className="px-5 py-3">Three-stage Personal Income Tax Plan announced by Morrison government</td></tr>
                      <tr><td className="px-5 py-3 font-medium">1 July 2018</td><td className="px-5 py-3"><strong>Stage 1:</strong> Low and Middle Income Tax Offset (LMITO) introduced, worth up to $530</td></tr>
                      <tr><td className="px-5 py-3 font-medium">1 July 2020</td><td className="px-5 py-3"><strong>Stage 2:</strong> 19% bracket extended from $37,000 to $45,000; 32.5% bracket extended from $90,000 to $120,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">June 2022</td><td className="px-5 py-3">LMITO (Stage 1) expired — not extended by the new Albanese government</td></tr>
                      <tr><td className="px-5 py-3 font-medium">25 January 2024</td><td className="px-5 py-3">Albanese government announces <strong>revised Stage 3</strong> — reduces bottom rate to 16%, retains 37% bracket, extends 30% bracket to $135,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">March 2024</td><td className="px-5 py-3">Treasury Laws Amendment (Cost of Living Tax Cuts) Bill 2024 passes Parliament</td></tr>
                      <tr><td className="px-5 py-3 font-medium">1 July 2024</td><td className="px-5 py-3"><strong>Revised Stage 3 takes effect</strong> — new tax brackets apply from FY2024-25</td></tr>
                      <tr><td className="px-5 py-3 font-medium">1 July 2025</td><td className="px-5 py-3">FY2025-26 begins — same brackets continue. SG rate increases to 12%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The three-stage plan took six years to fully implement. For a comprehensive history of Australian income tax rates over the decades, see our <Link href="/tax-bracket-history/">Tax Bracket History Guide</Link>. For upcoming changes, see <Link href="/tax-changes-2026-27/">Tax Changes 2026-27</Link>.
              </p>
            </section>

            {/* ───── SECTION 5: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">

                <AccordionItem value="when-start" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When did the Stage 3 tax cuts start?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The revised Stage 3 tax cuts took effect on <strong>1 July 2024</strong>, applying from FY2024-25 onwards. If you are employed, your employer should have adjusted your PAYG withholding from your first pay in July 2024. The same rates continue in FY2025-26.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-much-save" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do the Stage 3 tax cuts save me?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Every taxpayer earning above $18,200 saves at least <strong>$354 per year</strong>. At $50,000 you save $929, at $100,000 you save $2,179, and at $190,000+ you save $4,529. The exact saving depends on your taxable income — use the comparison table above or our <Link href="/income-tax-calculator/">Income Tax Calculator</Link>.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="automatic" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I need to do anything to receive the tax cuts?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. The tax cuts are automatic. Your employer updates their payroll software to use the new PAYG withholding tables, and you receive more take-home pay each pay period. No forms to fill out, no application required.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="original-vs-revised" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Am I better or worse off under the revised plan vs the original?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Taxpayers earning under approximately <strong>$146,000</strong> are better off under the revised plan. Those earning above $146,000 receive a smaller tax cut than the original plan would have delivered. The maximum difference is at $200,000, where the original plan would have saved $9,075 compared to $4,529 under the revised plan.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="32-5-gone" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happened to the 32.5% tax rate?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The 32.5% rate was <strong>abolished</strong> under both the original and revised Stage 3 plans. It was replaced by a 30% rate. Under the revised plan, the 30% rate applies from $45,001 to $135,000. This 2.5 percentage point reduction saves up to $2,250 for taxpayers in this bracket.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="19-to-16" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Why was the 19% rate reduced to 16%?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The government reduced the bottom marginal rate to deliver tax relief to <strong>all taxpayers</strong>, including the 4.7 million Australians earning between $18,201 and $45,000 who would have received no benefit under the original Stage 3 plan. The 3 percentage point cut saves up to $804 per year for this group.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="more-changes" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are there more tax changes coming?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The current Stage 3 brackets are legislated with no sunset clause — they apply indefinitely. However, the government may announce further adjustments in future budgets. Check our <Link href="/tax-changes-2026-27/">Tax Changes 2026-27 Guide</Link> for the latest announced changes and our <Link href="/tax-brackets/">Tax Brackets Guide</Link> for the current rates.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="affect-super" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do the Stage 3 cuts affect superannuation?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Not directly. Superannuation contributions continue to be taxed at 15% in the fund. However, the Stage 3 cuts change the <strong>tax savings from salary sacrifice</strong>. At the 30% marginal rate, sacrificing $10,000 into super saves $1,500 (30% minus 15%). Under the old 32.5% rate, the same sacrifice saved $1,750. The cuts slightly reduce the tax advantage of salary sacrifice for incomes between $45,001 and $135,000.</AccordionContent>
                </AccordionItem>

              </Accordion>
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Tax calculations use the pre-Stage 3 rates (FY2023-24: 0%, 19%, 32.5%, 37%, 45%) and the revised Stage 3 rates (FY2024-25 onwards: 0%, 16%, 30%, 37%, 45%) as published by the Australian Taxation Office. Figures exclude Medicare levy, LITO, and other offsets to show the pure bracket impact. Weekly savings assume 52 weeks per year.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("stage-3-tax-cuts"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /><SidebarLink href="/tax-bracket-history/" label="Tax Bracket History" /><SidebarLink href="/tax-changes-2026-27/" label="Tax Changes 2026-27" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">See your new take-home pay</h3><p className="text-sky-100 text-sm mb-4">Enter your salary to calculate your exact tax and take-home pay under the current brackets.</p><Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Income Tax Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
