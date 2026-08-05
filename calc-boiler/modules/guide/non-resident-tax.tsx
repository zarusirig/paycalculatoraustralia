"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, NON_RESIDENT_TAX_BRACKETS, TAX_BRACKETS, SECOND_BRACKET_RATE, TAX_FREE_THRESHOLD, SUPER_GUARANTEE, HECS_HELP, calculateIncomeTax, calculateLITO, calculateMedicareLevy, formatAUD, formatPercent } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

// Resident-vs-non-resident comparison figures, derived from the current-year
// engine so a bracket change (like the 16%→15% cut) can never strand them.
const RES_TAX_80K = Math.round(calculateIncomeTax(80_000));
const NR_TAX_80K = Math.round(calculateIncomeTax(80_000, false));
const RES_TAX_100K = Math.round(calculateIncomeTax(100_000));
const NR_TAX_100K = Math.round(calculateIncomeTax(100_000, false));
const RES_TOTAL_100K = RES_TAX_100K - Math.round(calculateLITO(100_000)) + calculateMedicareLevy(100_000);
// Worked example at $90,000
const RES_TAX_90K = Math.round(calculateIncomeTax(90_000));
const LITO_90K = Math.round(calculateLITO(90_000));
const MEDICARE_90K = calculateMedicareLevy(90_000);
const RES_TOTAL_90K = RES_TAX_90K - LITO_90K + MEDICARE_90K;
const NR_TAX_90K = Math.round(calculateIncomeTax(90_000, false));
const RES_TAKE_HOME_90K = 90_000 - RES_TOTAL_90K;
const NR_TAKE_HOME_90K = 90_000 - NR_TAX_90K;

const SOURCES_LIST: SourceLink[] = [
  { title: "Foreign resident tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-foreign-residents", publisher: SOURCES.ato.name },
  { title: "Residency for tax purposes", url: "https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/your-tax-residency", publisher: SOURCES.ato.name },
  { title: "Double tax agreements", url: "https://www.ato.gov.au/about-ato/international-tax-agreements/in-detail/what-are-tax-treaties", publisher: SOURCES.ato.name },
  { title: "Working holiday makers", url: "https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/coming-to-australia/working-holiday-makers", publisher: SOURCES.ato.name },
];

export default function NonResidentTaxPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Non-Resident Tax</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Non-Resident Tax Rates Australia {SITE_CONFIG.financialYear}</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Tax rates for foreign residents working in Australia: no tax-free threshold, no LITO, and different brackets. See a side-by-side comparison with resident rates.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

            {/* ── Section 1: What Is Non-Resident Tax? ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is Non-Resident Tax in Australia?</h2>
              <p>Non-resident tax is a separate set of Australian income tax rates that apply to individuals classified as <strong>foreign residents for tax purposes</strong> by the ATO.</p>
              <p>Foreign residents pay tax from their very first dollar of Australian-sourced income. The tax-free threshold of <strong>$18,200</strong> does not apply, and non-residents cannot claim the &quot;Low Income Tax Offset&quot; (LITO) worth up to <strong>$700</strong>. The lowest marginal rate for non-residents is <strong>30%</strong>, compared to <strong>0%</strong> for residents earning below $18,200 and <strong>{formatPercent(SECOND_BRACKET_RATE, 0)}</strong> for residents earning between $18,201 and $45,000. Non-residents also cannot access the &quot;Senior Australians and Pensioners Tax Offset&quot; (SAPTO), the &quot;Zone Tax Offset&quot;, or the Medicare levy exemption benefit that residents receive.</p>
              <p>Non-resident taxation applies only to Australian-sourced income, including salary and wages earned in Australia, rental income from Australian property, and dividends from Australian companies. Foreign-sourced income (for example, rental income from a property in the United Kingdom, interest earned in a Singapore bank account, or salary paid by an overseas employer for work performed outside Australia) is not assessable in Australia for non-residents. Use the <Link href="/income-tax-calculator/">Income Tax Calculator</Link> with the non-resident toggle to calculate your exact after-tax income.</p>
            </section>

            {/* ── Section 2: Non-Resident Tax Brackets Table ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Non-Resident Tax Brackets for FY{SITE_CONFIG.financialYear}?</h2>
              <p>Non-residents pay <strong>30% on every dollar</strong> up to $135,000, with no tax-free threshold and no lower-rate bands.</p>
              <p>The table below shows the 3 non-resident income tax brackets for the {SITE_CONFIG.financialYear} financial year. Resident brackets are included for comparison. Non-residents face significantly higher taxation at all income levels below $135,000 because residents benefit from the $0 tax-free threshold and the {formatPercent(SECOND_BRACKET_RATE, 0)} marginal rate on income between $18,201 and $45,000.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Non-Resident Tax Rate Table</h3>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Taxable Income</th><th className="px-5 py-3">Tax Rate</th><th className="px-5 py-3 text-right">Tax Payable</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                {NON_RESIDENT_TAX_BRACKETS.map((b, i) => (<tr key={i}><td className="px-5 py-3">{formatAUD(b.min)} – {b.max === Infinity ? "∞" : formatAUD(b.max)}</td><td className="px-5 py-3 font-medium">{(b.rate * 100).toFixed(0)}%</td><td className="px-5 py-3 text-right">{b.base > 0 ? `${formatAUD(b.base)} + ` : ""}{(b.rate * 100).toFixed(0)}c per $1{b.min > 0 ? ` over ${formatAUD(b.min)}` : ""}</td></tr>))}
              </tbody></table></div></div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Resident Tax Rate Table (for Comparison)</h3>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Taxable Income</th><th className="px-5 py-3">Tax Rate</th><th className="px-5 py-3 text-right">Tax Payable</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                {TAX_BRACKETS.map((b, i) => (<tr key={i}><td className="px-5 py-3">{formatAUD(b.min)} – {b.max === Infinity ? "∞" : formatAUD(b.max)}</td><td className="px-5 py-3 font-medium">{(b.rate * 100).toFixed(0)}%</td><td className="px-5 py-3 text-right">{b.base > 0 ? `${formatAUD(b.base)} + ` : ""}{b.rate === 0 ? "Nil" : `${(b.rate * 100).toFixed(0)}c per $1${b.min > 0 ? ` over ${formatAUD(b.min)}` : ""}`}</td></tr>))}
              </tbody></table></div></div>
              <p>Non-resident brackets and resident <Link href="/tax-brackets/">income tax brackets</Link> converge at the $135,001 threshold. Above $135,000, both groups pay the same marginal rates of <strong>37%</strong> and <strong>45%</strong>, though cumulative tax payable remains higher for non-residents due to the flat 30% applied to the first $135,000.</p>
            </section>

            {/* ── Section 3: How Does the ATO Determine Residency? ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the ATO Determine Tax Residency?</h2>
              <p>The ATO determines your tax residency using <strong>4 statutory tests</strong>, and you are an Australian resident for tax purposes if you satisfy any one of them.</p>
              <p>Tax residency is different from visa status or citizenship. A person on a temporary visa can be a tax resident, and an Australian citizen living overseas can be a non-resident. The ATO examines your personal circumstances, economic connections, and behaviour patterns to determine where you &quot;reside&quot; in the ordinary sense of the word.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Four Residency Tests</h3>
              <ol>
                <li><strong>Resides test:</strong> The primary test. You reside in Australia if Australia is your usual place of abode. The ATO considers factors including the physical presence of your family, your dwelling arrangements, the location of your personal property, and your social and economic ties. A person who maintains a home in Sydney, has children enrolled in school in Melbourne, or holds an ongoing employment contract in Brisbane generally satisfies this test.</li>
                <li><strong>Domicile test:</strong> Your domicile is your permanent home by law (typically inherited from your parents). If your domicile is in Australia, you are a resident unless the ATO is satisfied that your &quot;permanent place of abode&quot; is outside Australia. Relocating to London, Tokyo, or Dubai for an indefinite period with no firm intention to return typically satisfies the permanent-place-of-abode exception.</li>
                <li><strong>183-day test:</strong> If you are physically present in Australia for <strong>183 days or more</strong> (continuous or broken) during the income year, you are a resident unless you can show your usual place of abode is overseas and you have no intention of taking up residence. This test most commonly captures long-stay business travellers, extended-holiday visitors, and individuals on transitional visa arrangements.</li>
                <li><strong>Superannuation test:</strong> Commonwealth government employees posted overseas are treated as residents regardless of their physical location. This covers diplomats, ADF members, and APS officers stationed in embassies, consulates, or military bases in countries including the United States, United Kingdom, and Japan.</li>
              </ol>
              <p>The ATO applies these tests hierarchically. The resides test is considered first. If it provides a clear answer, the remaining 3 tests are not required. Individuals uncertain about their residency status can request a <strong>private ruling</strong> from the ATO at no cost, which provides a binding determination for the relevant financial year.</p>
            </section>

            {/* ── Section 4: Do Non-Residents Pay Medicare Levy? ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Do Non-Residents Pay the Medicare Levy?</h2>
              <p>Non-residents are <strong>fully exempt</strong> from the 2% Medicare levy and the &quot;Medicare Levy Surcharge&quot; (MLS) of up to 1.5%.</p>
              <p>The Medicare levy funds Australia&apos;s public health system, and non-residents cannot access Medicare services. This exemption saves a non-resident earning $100,000 a total of <strong>$2,000</strong> per year compared to a resident without private health insurance. However, the exemption does not offset the higher income tax rates: a non-resident earning $100,000 pays <strong>{formatAUD(NR_TAX_100K)}</strong> in income tax versus approximately <strong>{formatAUD(RES_TOTAL_100K)}</strong> for a resident (including Medicare levy), a net disadvantage of <strong>{formatAUD(NR_TAX_100K - RES_TOTAL_100K)}</strong>.</p>
              <p>Non-residents working in Australia need private health insurance or must pay for medical services out of pocket. Australia has &quot;Reciprocal Health Care Agreements&quot; (RHCAs) with 11 countries including the United Kingdom, Ireland, New Zealand, Sweden, the Netherlands, Finland, Belgium, Norway, Slovenia, Italy, and Malta. Citizens of these countries receive limited Medicare access for essential treatment during temporary stays.</p>
            </section>

            {/* ── Section 5: Resident vs Non-Resident Tax Comparison ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Non-Resident Tax Compare to Resident Tax?</h2>
              <p>A non-resident earning $80,000 pays approximately <strong>{formatAUD(NR_TAX_80K - RES_TAX_80K)} more</strong> in income tax than an Australian resident at the same salary.</p>
              <p>The comparison table below calculates exact tax payable at 5 common salary levels for the {SITE_CONFIG.financialYear} financial year. Resident tax is income tax only &mdash; it excludes the LITO offset and the Medicare levy &mdash; to isolate the bracket difference. The &quot;Extra Cost&quot; column shows how much additional taxation a non-resident faces compared to a resident at each income level.</p>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Income</th><th className="px-5 py-3 text-right">Resident Tax</th><th className="px-5 py-3 text-right">Non-Resident Tax</th><th className="px-5 py-3 text-right">Extra Cost</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                {[30000, 50000, 80000, 100000, 150000].map(income => {
                  const resTax = Math.round(calculateIncomeTax(income, true));
                  const nrTax = Math.round(calculateIncomeTax(income, false));
                  return (<tr key={income}><td className="px-5 py-3">{formatAUD(income)}</td><td className="px-5 py-3 text-right">{formatAUD(resTax)}</td><td className="px-5 py-3 text-right font-medium text-red-600">{formatAUD(nrTax)}</td><td className="px-5 py-3 text-right text-red-500">+{formatAUD(nrTax - resTax)}</td></tr>);
                })}
              </tbody></table></div></div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: $90,000 Salary</h3>
              <p>Consider an IT contractor earning <strong>$90,000</strong> per year in Melbourne. The tax calculation differs significantly based on residency status:</p>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Component</th><th className="px-5 py-3 text-right">Resident</th><th className="px-5 py-3 text-right">Non-Resident</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr><td className="px-5 py-3">Gross Income</td><td className="px-5 py-3 text-right">$90,000</td><td className="px-5 py-3 text-right">$90,000</td></tr>
                <tr><td className="px-5 py-3">Income Tax</td><td className="px-5 py-3 text-right">{formatAUD(RES_TAX_90K)}</td><td className="px-5 py-3 text-right text-red-600">{formatAUD(NR_TAX_90K)}</td></tr>
                <tr><td className="px-5 py-3">LITO</td><td className="px-5 py-3 text-right">{LITO_90K > 0 ? `-${formatAUD(LITO_90K)}` : "$0 (fully phased out)"}</td><td className="px-5 py-3 text-right">$0</td></tr>
                <tr><td className="px-5 py-3">Medicare Levy (2%)</td><td className="px-5 py-3 text-right">{formatAUD(MEDICARE_90K)}</td><td className="px-5 py-3 text-right">$0</td></tr>
                <tr className="font-bold"><td className="px-5 py-3">Total Tax</td><td className="px-5 py-3 text-right">{formatAUD(RES_TOTAL_90K)}</td><td className="px-5 py-3 text-right text-red-600">{formatAUD(NR_TAX_90K)}</td></tr>
                <tr className="font-bold bg-sandstone/50"><td className="px-5 py-3">Take-Home Pay</td><td className="px-5 py-3 text-right text-eucalyptus-dark">{formatAUD(RES_TAKE_HOME_90K)}</td><td className="px-5 py-3 text-right text-red-600">{formatAUD(NR_TAKE_HOME_90K)}</td></tr>
              </tbody></table></div></div>
              <p>The non-resident in this example takes home <strong>{formatAUD(RES_TAKE_HOME_90K - NR_TAKE_HOME_90K)} less</strong> per year, or <strong>{formatAUD(Math.round((RES_TAKE_HOME_90K - NR_TAKE_HOME_90K) / 12))} less per month</strong>, than the resident. Both employees receive superannuation at <strong>12%</strong> ($10,800) on top of their gross salary. Use the <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to run your own comparison at any salary level.</p>
            </section>

            {/* ── Section 6: What You DON'T Get as a Non-Resident ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Tax Benefits Do Non-Residents Lose?</h2>
              <p>Non-residents lose access to <strong>6 major tax concessions</strong> that reduce the tax burden for Australian residents.</p>
              <ul>
                <li><strong>No tax-free threshold ($18,200)</strong> &mdash; tax applies from the first dollar of income, costing up to <strong>{formatAUD(Math.round(TAX_FREE_THRESHOLD * SECOND_BRACKET_RATE))}</strong> in additional tax at the {formatPercent(SECOND_BRACKET_RATE, 0)} marginal rate</li>
                <li><strong>No Low Income Tax Offset</strong> &mdash; residents earning below $66,667 receive up to <strong>$700</strong> in LITO, reducing their effective tax rate. See the <Link href="/low-income-tax-offset/">Low Income Tax Offset guide</Link> for full phase-out details</li>
                <li><strong>No Senior Australians and Pensioners Tax Offset</strong> &mdash; SAPTO provides up to <strong>$2,230</strong> for eligible seniors, creating an effective tax-free threshold of <strong>$33,532</strong> for single pensioners</li>
                <li><strong>No Zone Tax Offset</strong> &mdash; residents living in remote or isolated areas (Zone A, Zone B, or special areas) receive offsets ranging from <strong>$338</strong> to <strong>$1,173</strong> per year. See the <Link href="/zone-tax-offset/">Zone Tax Offset guide</Link> for eligible locations</li>
                <li><strong>No Medicare levy exemption</strong> &mdash; while non-residents do not pay the 2% levy, they also cannot access bulk-billed GP visits, public hospital treatment, or subsidised prescriptions under the PBS</li>
                <li><strong>No CGT main residence exemption</strong> &mdash; non-residents pay capital gains tax on the sale of Australian property with no 50% CGT discount and no main residence exemption, even if the property was their home while they were a resident</li>
              </ul>
              <p>Non-residents retain the ability to claim work-related deductions, <Link href="/salary-sacrifice-guide/">salary sacrifice</Link> into superannuation (subject to the concessional contribution cap of <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong>), and claim deductions for self-education expenses, union fees, and work-related travel.</p>
            </section>

            {/* ── Section 7: Working Holiday Makers ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What About Working Holiday Makers on Subclass 417/462 Visas?</h2>
              <p>Working holiday makers pay a <strong>flat 15% tax rate</strong> on the first $45,000 of income, a concessional rate that sits between the resident and standard non-resident rates.</p>
              <p>Subclass 417 (Working Holiday) and subclass 462 (Work and Holiday) visa holders are classified as &quot;working holiday makers&quot; (WHMs) under a separate taxation schedule. WHMs are not subject to standard non-resident rates, provided their employer registers as an employer of working holiday makers with the ATO. Unregistered employers must withhold at the non-resident rate of <strong>30%</strong> from the first dollar.</p>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Income Range</th><th className="px-5 py-3 text-right">WHM Rate</th><th className="px-5 py-3 text-right">Non-Resident Rate</th><th className="px-5 py-3 text-right">Resident Rate</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr><td className="px-5 py-3">$0 &ndash; $18,200</td><td className="px-5 py-3 text-right font-medium">15%</td><td className="px-5 py-3 text-right">30%</td><td className="px-5 py-3 text-right">0%</td></tr>
                <tr><td className="px-5 py-3">$18,201 &ndash; $45,000</td><td className="px-5 py-3 text-right font-medium">15%</td><td className="px-5 py-3 text-right">30%</td><td className="px-5 py-3 text-right">{formatPercent(SECOND_BRACKET_RATE, 0)}</td></tr>
                <tr><td className="px-5 py-3">$45,001 &ndash; $135,000</td><td className="px-5 py-3 text-right">30%</td><td className="px-5 py-3 text-right">30%</td><td className="px-5 py-3 text-right">30%</td></tr>
                <tr><td className="px-5 py-3">$135,001 &ndash; $190,000</td><td className="px-5 py-3 text-right">37%</td><td className="px-5 py-3 text-right">37%</td><td className="px-5 py-3 text-right">37%</td></tr>
                <tr><td className="px-5 py-3">$190,001+</td><td className="px-5 py-3 text-right">45%</td><td className="px-5 py-3 text-right">45%</td><td className="px-5 py-3 text-right">45%</td></tr>
              </tbody></table></div></div>
              <p>WHMs who earn <strong>$40,000</strong> pay <strong>$6,000</strong> in tax under the WHM schedule, compared to <strong>{formatAUD(Math.round(calculateIncomeTax(40_000, false)))}</strong> under non-resident rates and <strong>{formatAUD(Math.round(calculateIncomeTax(40_000, true)))}</strong> under resident rates. Read the full <Link href="/working-holiday-tax/">Working Holiday Maker Tax Rate guide</Link> for details on employer registration, DASP claims, and departure tax returns.</p>
            </section>

            {/* ── Section 8: Double Tax Agreements ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Double Tax Agreements Affect Non-Residents?</h2>
              <p>Australia has <strong>46 bilateral Double Tax Agreements</strong> (DTAs) that prevent the same income from being taxed in both Australia and the individual&apos;s home country.</p>
              <p>DTAs allocate taxing rights between countries based on the type of income. Employment income is generally taxed in the country where the work is performed. Dividends, interest, and royalties have reduced withholding rates under most DTAs. A non-resident receiving dividends from an Australian company typically faces a withholding rate of <strong>15%</strong> under most DTAs, reduced from the standard 30% domestic rate.</p>
              <p>Key DTA partner countries include the United States, United Kingdom, Canada, Germany, Japan, Singapore, India, China, New Zealand, and South Korea. Each agreement contains specific provisions for different income types, so the applicable rate depends on both the income category and the treaty country.</p>
              <p>Non-residents can claim a &quot;Foreign Income Tax Offset&quot; (FITO) in their home country for Australian tax paid, or claim an offset in Australia for tax paid overseas, depending on the DTA terms. This prevents double taxation on income such as Australian rental income earned by a UK-based property investor or Australian employment income earned by a US national on temporary assignment. The ATO publishes a complete list of DTAs on its website with country-specific withholding rates for dividends, interest, and royalties.</p>
            </section>

            {/* ── Section 9: How to Lodge a Tax Return ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Non-Residents Lodge a Tax Return?</h2>
              <p>Non-residents lodge an Australian tax return through <strong>myTax</strong> (the ATO&apos;s online portal) or through a registered tax agent, with the same 31 October deadline as residents.</p>
              <p>The lodgement process follows 6 steps:</p>
              <ol>
                <li><strong>Obtain a Tax File Number (TFN)</strong> &mdash; apply online through the ATO or at an Australian post office. Without a TFN, your employer withholds at the maximum rate of <strong>45%</strong> plus the 2% Medicare levy</li>
                <li><strong>Collect your income statements</strong> &mdash; your employer provides an income statement (previously called a payment summary or group certificate) through Single Touch Payroll by 14 July each year</li>
                <li><strong>Log in to myTax</strong> &mdash; access myTax through your myGov account. Non-residents outside Australia can use myTax without an Australian phone number</li>
                <li><strong>Select &quot;non-resident&quot;</strong> &mdash; when completing the return, select your residency status for each period. The system applies non-resident tax rates automatically</li>
                <li><strong>Claim deductions</strong> &mdash; enter work-related deductions including uniforms, tools, travel, and self-education. Non-residents claim the same deductions as residents</li>
                <li><strong>Submit and track</strong> &mdash; the ATO processes most electronic returns within <strong>2 weeks</strong>. Refunds are paid to an Australian bank account or a nominated overseas account</li>
              </ol>
              <p>Non-residents who have left Australia permanently should lodge a &quot;departure tax return&quot; covering the period from 1 July to their departure date. This return uses the non-resident rates for the non-resident portion and can be lodged from overseas through myTax. Using a registered tax agent extends the lodgement deadline to <strong>15 May</strong> of the following year for most taxpayers.</p>
            </section>

            {/* ── Section 10: What Changed This Financial Year? ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Non-Residents in FY{SITE_CONFIG.financialYear}?</h2>
              <p>Non-resident brackets are <strong>unchanged</strong> in FY{SITE_CONFIG.financialYear} &mdash; still a flat <strong>30%</strong> up to $135,000. The 1 July 2026 tax cut applied to the resident second bracket only, lowering its rate from 16% to <strong>{formatPercent(SECOND_BRACKET_RATE, 0)}</strong>; non-residents have no equivalent band, so their tax payable did not move.</p>
              <p>The current non-resident structure dates from the Stage 3 tax cuts (effective 1 July 2024), which changed resident brackets significantly: the 19% bracket was replaced with a 16% rate (cut again to 15% from 1 July 2026), and the 32.5% bracket dropped to 30%. Non-resident rates were adjusted in parallel &mdash; the previous 32.5% rate on income from $0 to $120,000 became <strong>30%</strong> on income from $0 to $135,000. The net effect is that non-residents earning up to $135,000 received a small tax reduction, but residents received a proportionally larger benefit.</p>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Bracket</th><th className="px-5 py-3 text-right">FY2023-24 Rate</th><th className="px-5 py-3 text-right">FY{SITE_CONFIG.financialYear} Rate</th><th className="px-5 py-3 text-right">Change</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr><td className="px-5 py-3">$0 &ndash; $120,000</td><td className="px-5 py-3 text-right">32.5%</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">30%*</td><td className="px-5 py-3 text-right text-eucalyptus-dark">-2.5%</td></tr>
                <tr><td className="px-5 py-3">$120,001 &ndash; $135,000</td><td className="px-5 py-3 text-right">37%</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">30%*</td><td className="px-5 py-3 text-right text-eucalyptus-dark">-7%</td></tr>
                <tr><td className="px-5 py-3">$135,001 &ndash; $180,000</td><td className="px-5 py-3 text-right">37%</td><td className="px-5 py-3 text-right">37%*</td><td className="px-5 py-3 text-right">0%</td></tr>
                <tr><td className="px-5 py-3">$180,001 &ndash; $190,000</td><td className="px-5 py-3 text-right">45%</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">37%*</td><td className="px-5 py-3 text-right text-eucalyptus-dark">-8%</td></tr>
                <tr><td className="px-5 py-3">$190,001+</td><td className="px-5 py-3 text-right">45%</td><td className="px-5 py-3 text-right">45%</td><td className="px-5 py-3 text-right">0%</td></tr>
              </tbody></table></div><p className="text-xs text-warmgray-light mt-2">*Bracket boundaries also changed. Current brackets use $135,000 and $190,000 thresholds.</p></div>
              <p>The superannuation guarantee rate remains at <strong>12%</strong> &mdash; its legislated ceiling, reached on 1 July 2025 &mdash; applying equally to residents and non-residents. Employers must pay the SG rate on top of gross salary for all employees, regardless of tax residency status. Check the <Link href="/superannuation-calculator/">Superannuation Calculator</Link> to see how this affects your total remuneration package.</p>
            </section>

            {/* ── Section 11: Related Resources ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
              <p>These Australian tax calculators and guides cover topics closely related to non-resident taxation for the {SITE_CONFIG.financialYear} financial year.</p>
              <ul>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> &mdash; calculate your take-home pay as a resident or non-resident with the residency toggle</li>
                <li><Link href="/working-holiday-tax/">Working Holiday Maker Tax Rate guide</Link> &mdash; 15% flat rate details for subclass 417 and 462 visa holders</li>
                <li><Link href="/tax-brackets/">Tax Brackets guide</Link> &mdash; complete FY{SITE_CONFIG.financialYear} income tax bracket tables for residents</li>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; calculate employer SG contributions at the 12% rate</li>
                <li><Link href="/salary-sacrifice-guide/">Salary Sacrifice guide</Link> &mdash; pre-tax contribution strategies available to both residents and non-residents</li>
                <li><Link href="/low-income-tax-offset/">Low Income Tax Offset guide</Link> &mdash; LITO details (residents only, up to $700)</li>
              </ul>
            </section>

            {/* ── CONTEXT BORDER ── */}

            {/* ── Section 12: FAQs ── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="medicare" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do non-residents pay Medicare levy?</AccordionTrigger><AccordionContent className="text-warmgray">No. Non-residents are exempt from the 2% Medicare levy. However, this also means you cannot access Medicare services. If you need medical care, you&apos;ll need private health insurance or pay out of pocket. Citizens of the 11 RHCA countries (including the UK, Ireland, and New Zealand) receive limited Medicare access for essential treatment.</AccordionContent></AccordionItem>

                <AccordionItem value="claiming" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Can non-residents claim work-related deductions?</AccordionTrigger><AccordionContent className="text-warmgray">Yes, non-residents can claim work-related deductions in the same way as residents. The deductions reduce your taxable income, which then has non-resident rates applied. Common deductions include uniforms, tools, work-related travel, self-education, and union fees.</AccordionContent></AccordionItem>

                <AccordionItem value="change" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">What if my residency status changes mid-year?</AccordionTrigger><AccordionContent className="text-warmgray">Your tax return is split into resident and non-resident periods. Resident rates apply to income earned during the resident period, and non-resident rates to income during the non-resident period. The tax-free threshold of $18,200 is pro-rated based on the number of months you were a resident.</AccordionContent></AccordionItem>

                <AccordionItem value="super" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do non-residents receive superannuation?</AccordionTrigger><AccordionContent className="text-warmgray">Yes. Employers must pay the 12% superannuation guarantee on top of gross salary for all employees, regardless of residency status. Non-residents who leave Australia permanently can apply for a Departing Australia Superannuation Payment (DASP). The tax rate on DASP is 35% for non-residents (65% for working holiday makers).</AccordionContent></AccordionItem>

                <AccordionItem value="tfn" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do non-residents need a Tax File Number?</AccordionTrigger><AccordionContent className="text-warmgray">Yes. Without a TFN, your employer must withhold tax at the maximum rate of 45% from every dollar of income. Non-residents can apply for a TFN online through the ATO website or at an Australian post office upon arrival.</AccordionContent></AccordionItem>

                <AccordionItem value="rental" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do non-residents pay tax on Australian rental income?</AccordionTrigger><AccordionContent className="text-warmgray">Yes. Rental income from Australian property is Australian-sourced income and is taxable at non-resident rates (30% from the first dollar). Non-residents can claim the same rental deductions as residents, including interest, repairs, depreciation, and property management fees. Capital gains on the sale of Australian property are also taxable with no 50% CGT discount.</AccordionContent></AccordionItem>

                <AccordionItem value="dta" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Can I avoid double taxation on Australian income?</AccordionTrigger><AccordionContent className="text-warmgray">Yes, if your home country has a Double Tax Agreement (DTA) with Australia. Australia has 46 DTAs that allocate taxing rights and provide mechanisms to claim foreign income tax offsets. You can claim a credit for Australian tax paid against your home country tax liability, or vice versa, preventing the same income from being taxed twice.</AccordionContent></AccordionItem>

                <AccordionItem value="cgt" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do non-residents get the 50% CGT discount?</AccordionTrigger><AccordionContent className="text-warmgray">No. Non-residents do not receive the 50% capital gains tax discount on any Australian asset, including shares and property. A non-resident selling an Australian investment property held for 3 years pays CGT on the full capital gain at their marginal non-resident rate, with no discount applied.</AccordionContent></AccordionItem>

                <AccordionItem value="hecs" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do non-residents have to repay HECS-HELP debts?</AccordionTrigger><AccordionContent className="text-warmgray">Yes. Since 1 July 2017, Australian citizens living overseas with a HECS-HELP debt must lodge an overseas return with the ATO and make compulsory repayments based on their worldwide income. The minimum repayment threshold is {formatAUD(HECS_HELP.minimumThreshold)} for FY{SITE_CONFIG.financialYear}. Non-citizens do not incur HECS-HELP debts as they pay full tuition fees upfront.</AccordionContent></AccordionItem>

                <AccordionItem value="private-ruling" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">How do I confirm my residency status with the ATO?</AccordionTrigger><AccordionContent className="text-warmgray">Request a private ruling from the ATO at no cost. A private ruling provides a binding determination of your residency status for the relevant financial year. You can apply online through the ATO website by providing details of your living arrangements, family ties, economic connections, and intention to remain in or return to Australia.</AccordionContent></AccordionItem>

                <AccordionItem value="whm-vs-nr" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Is a working holiday maker a non-resident?</AccordionTrigger><AccordionContent className="text-warmgray">Not for tax purposes. Working holiday makers (subclass 417/462) have their own tax schedule with a 15% rate on the first $45,000. Standard non-resident rates (30% from dollar one) only apply if the employer has not registered as an employer of working holiday makers with the ATO. WHMs are treated as a distinct taxpayer category, separate from both residents and standard non-residents.</AccordionContent></AccordionItem>

                <AccordionItem value="departure" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do I need to lodge a tax return after leaving Australia?</AccordionTrigger><AccordionContent className="text-warmgray">Yes. If you earned any Australian income during the financial year, you must lodge a tax return. Lodge a departure return covering 1 July to your departure date. You can lodge from overseas through myTax. If you continue to earn Australian-sourced income (such as rental income) after departure, you must lodge a return each financial year that income is received.</AccordionContent></AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Non-resident tax rates and comparison calculations use ATO-published tax tables for FY{SITE_CONFIG.financialYear}. The worked example at $90,000 includes LITO and the Medicare levy for the resident; the salary-level comparison table is income tax only. It uses standard non-resident brackets (30% flat rate on income up to $135,000) and resident brackets including the $18,200 tax-free threshold, {formatPercent(SECOND_BRACKET_RATE, 0)} rate from $18,201 to $45,000, and 30% rate from $45,001 to $135,000.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("non-resident-tax"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Guides</h3><div className="space-y-3"><SidebarLink href="/working-holiday-tax/" label="Working Holiday Tax" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /></div></CardContent></Card>
            <Card className="bg-indigo-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Calculate your tax</h3><p className="text-indigo-100 text-sm mb-4">Use the income tax calculator with the non-resident toggle to see your take-home pay.</p><Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-indigo-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Income Tax Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
