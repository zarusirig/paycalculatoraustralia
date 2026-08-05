"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, calculateIncomeTax, calculateLITO, calculateMedicareLevy, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

// Resident-side comparison figures, derived from the current-year engine so
// they can never lag a bracket change (the 16%→15% cut moved all of these).
const RES_TAX_45K = Math.round(calculateIncomeTax(45_000)); // income tax before offsets
const RES_LITO_45K = Math.round(calculateLITO(45_000));
const RES_MEDICARE_45K = calculateMedicareLevy(45_000);
const WHM_TAKE_HOME_45K = 45_000 - 6_750; // flat 15% WHM schedule
const RES_TAKE_HOME_45K = 45_000 - (RES_TAX_45K - RES_LITO_45K) - RES_MEDICARE_45K;

// WHM schedule: 15% to $45,000, then non-resident marginal rates.
const WHM_TAX: Record<number, number> = {
  20_000: 3_000,
  40_000: 6_000,
  45_000: 6_750,
  60_000: 11_250,
  80_000: 17_250,
};

const SOURCES_LIST: SourceLink[] = [
  { title: "Working holiday makers", url: "https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/coming-to-australia/working-holiday-makers", publisher: SOURCES.ato.name },
  { title: "Tax rates – Working holiday makers", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-working-holiday-makers", publisher: SOURCES.ato.name },
  { title: "DASP – Departing Australia superannuation payment", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/temporary-residents-and-superannuation/departing-australia-superannuation-payment-dasp", publisher: SOURCES.ato.name },
  { title: "Employer registration – WHM", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/engaging-a-worker/hiring-a-new-worker/employers-of-working-holiday-makers", publisher: SOURCES.ato.name },
];

export default function WorkingHolidayTaxPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Working Holiday Tax</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Working Holiday Maker Tax Rate {SITE_CONFIG.financialYear}</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Complete guide to tax rates for 417 and 462 visa holders working in Australia. Understand the 15% flat rate, employer obligations, and how to lodge your departure tax return.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

            {/* ───────── SECTION 1: What Is the Working Holiday Maker Tax Rate? ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Working Holiday Maker Tax Rate?</h2>
              <p>Working holiday makers pay a <strong>flat 15% tax rate</strong> on the first $45,000 of assessable income earned in Australia during FY{SITE_CONFIG.financialYear}.</p>
              <p>This special rate applies to holders of subclass 417 (Working Holiday) and subclass 462 (Work and Holiday) visas. Unlike Australian residents, working holiday makers do not receive the <strong>$18,200 tax-free threshold</strong>, the &quot;Low Income Tax Offset&quot; (LITO), or the &quot;Low and Middle Income Tax Offset&quot; (LAMITO). Every dollar earned from $1 is taxable at 15%. Above $45,000, standard non-resident marginal rates apply at 30%, 37%, and 45% depending on the income tax bracket.</p>
              <p>The 15% flat rate was introduced in January 2017 after the &quot;backpacker tax&quot; debate. The rate was a compromise between the original proposal of 32.5% and the 0% tax-free threshold that residents enjoy. The rate has remained at <strong>15%</strong> since the 2017-18 financial year through to FY{SITE_CONFIG.financialYear}. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to model your exact take-home pay under the WHM tax schedule.</p>
            </section>

            {/* ───────── SECTION 2: Working Holiday Tax Brackets Table ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Working Holiday Tax Brackets for FY{SITE_CONFIG.financialYear}?</h2>
              <p>Working holiday maker income tax brackets use a <strong>4-tier structure</strong> starting at 15% on the first $45,000 and escalating to 45% above $190,000.</p>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Taxable Income</th><th className="px-5 py-3">Tax Rate</th><th className="px-5 py-3">Tax Payable</th><th className="px-5 py-3 text-right">Cumulative Tax</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr className="bg-orange-50"><td className="px-5 py-3 font-medium">$0 &ndash; $45,000</td><td className="px-5 py-3 font-bold text-orange-700">15%</td><td className="px-5 py-3">15c per $1</td><td className="px-5 py-3 text-right">$6,750</td></tr>
                <tr><td className="px-5 py-3">$45,001 &ndash; $135,000</td><td className="px-5 py-3">30%</td><td className="px-5 py-3">$6,750 + 30c per $1 over $45,000</td><td className="px-5 py-3 text-right">$33,750</td></tr>
                <tr><td className="px-5 py-3">$135,001 &ndash; $190,000</td><td className="px-5 py-3">37%</td><td className="px-5 py-3">$33,750 + 37c per $1 over $135,000</td><td className="px-5 py-3 text-right">$54,100</td></tr>
                <tr><td className="px-5 py-3">$190,001+</td><td className="px-5 py-3">45%</td><td className="px-5 py-3">$54,100 + 45c per $1 over $190,000</td><td className="px-5 py-3 text-right">&mdash;</td></tr>
              </tbody></table></div></div>
              <p>The first bracket aligns with the resident $45,000 threshold where the 30% marginal rate begins. From $45,001 onwards, WHM rates mirror <Link href="/non-resident-tax/">non-resident tax rates</Link> exactly. For a full breakdown of how Australian income tax brackets work for all residency types, see our <Link href="/tax-brackets/">Tax Brackets Guide</Link>.</p>
            </section>

            {/* ───────── SECTION 3: Who Is Classified as a Working Holiday Maker? ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Is Classified as a Working Holiday Maker?</h2>
              <p>A &quot;Working Holiday Maker&quot; is any individual holding a subclass <strong>417</strong> or subclass <strong>462</strong> visa, regardless of whether they meet the ATO&apos;s standard residency test.</p>
              <p>The WHM tax classification overrides the normal resident or non-resident determination. A backpacker who has lived in Australia for 11 months and passes the 183-day residency test still pays 15% on the first $45,000 &mdash; not the resident rates with the tax-free threshold. The classification is determined solely by visa subclass, not by days spent in the country, accommodation arrangements, or intention to remain.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Subclass 417 vs 462: What Is the Difference?</h3>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Feature</th><th className="px-5 py-3">Subclass 417</th><th className="px-5 py-3">Subclass 462</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr><td className="px-5 py-3 font-medium">Visa name</td><td className="px-5 py-3">Working Holiday</td><td className="px-5 py-3">Work and Holiday</td></tr>
                <tr><td className="px-5 py-3 font-medium">Eligible countries</td><td className="px-5 py-3">19 countries (UK, Ireland, Canada, France, Germany, etc.)</td><td className="px-5 py-3">27 countries (USA, China, Argentina, Indonesia, Spain, etc.)</td></tr>
                <tr><td className="px-5 py-3 font-medium">Age limit</td><td className="px-5 py-3">18&ndash;30 (35 for select countries)</td><td className="px-5 py-3">18&ndash;30</td></tr>
                <tr><td className="px-5 py-3 font-medium">Tax rate</td><td className="px-5 py-3 font-bold">15% on first $45,000</td><td className="px-5 py-3 font-bold">15% on first $45,000</td></tr>
                <tr><td className="px-5 py-3 font-medium">Max duration</td><td className="px-5 py-3">Up to 3 years (with extensions)</td><td className="px-5 py-3">Up to 3 years (with extensions)</td></tr>
                <tr><td className="px-5 py-3 font-medium">Visa cost (2025-26)</td><td className="px-5 py-3">$640</td><td className="px-5 py-3">$640</td></tr>
              </tbody></table></div></div>
              <p>Both visa subclasses receive identical tax treatment. The 15% rate applies from the date the visa is granted until the date it ceases, including any bridging visa period while a substantive visa application is pending.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Does the WHM Classification End?</h3>
              <p>The WHM tax rate ceases on the day the 417 or 462 visa expires, is cancelled, or the holder transitions to a different visa subclass. A backpacker who switches to a student visa (subclass 500), employer-sponsored visa (subclass 482), or partner visa (subclass 820) is taxed under standard resident or non-resident rates from that date forward. Income earned before the visa change remains taxed at WHM rates for that portion of the financial year.</p>
            </section>

            {/* ───────── SECTION 4: Do Working Holiday Makers Pay Medicare Levy? ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Do Working Holiday Makers Pay Medicare Levy?</h2>
              <p>Working holiday makers are <strong>exempt from the 2% Medicare levy</strong> because they are classified as non-residents for Medicare purposes.</p>
              <p>WHM visa holders are not eligible for Medicare benefits under the reciprocal health care agreements (with the exception of those from the United Kingdom, Ireland, Belgium, Finland, Italy, Malta, the Netherlands, New Zealand, Norway, Slovenia, and Sweden). Even backpackers from these 11 reciprocal countries do not pay the Medicare levy &mdash; the exemption applies to all WHMs regardless of country of origin. The &quot;Medicare Levy Surcharge&quot; (MLS) also does not apply to WHMs.</p>
              <p>This exemption means the effective tax rate on a $45,000 income is exactly <strong>15%</strong> ($6,750), with no additional Medicare levy on top. By comparison, an Australian resident earning $45,000 pays {formatAUD(RES_TAX_45K)} in income tax plus {formatAUD(RES_MEDICARE_45K)} in Medicare levy (before LITO), totalling {formatAUD(RES_TAX_45K + RES_MEDICARE_45K)}. For more detail on how the levy affects residents, see our <Link href="/income-tax-calculator/">Income Tax Calculator</Link>.</p>
            </section>

            {/* ───────── SECTION 5: Worked Example at $45,000 ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Tax Does a Working Holiday Maker Pay on $45,000?</h2>
              <p>A working holiday maker earning <strong>$45,000</strong> in FY{SITE_CONFIG.financialYear} pays <strong>$6,750 in tax</strong>, resulting in take-home pay of <strong>$38,250</strong> ($736 per week).</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step Calculation</h3>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Component</th><th className="px-5 py-3 text-right">Amount</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr><td className="px-5 py-3">Gross annual income</td><td className="px-5 py-3 text-right font-medium">$45,000</td></tr>
                <tr><td className="px-5 py-3">Income tax ($45,000 x 15%)</td><td className="px-5 py-3 text-right text-red-600">-$6,750</td></tr>
                <tr><td className="px-5 py-3">Medicare levy</td><td className="px-5 py-3 text-right">$0 (exempt)</td></tr>
                <tr><td className="px-5 py-3">LITO / tax offsets</td><td className="px-5 py-3 text-right">$0 (not eligible)</td></tr>
                <tr className="bg-green-50 font-bold"><td className="px-5 py-3">Annual take-home pay</td><td className="px-5 py-3 text-right text-green-700">$38,250</td></tr>
                <tr><td className="px-5 py-3">Fortnightly take-home</td><td className="px-5 py-3 text-right font-medium">$1,471</td></tr>
                <tr><td className="px-5 py-3">Weekly take-home</td><td className="px-5 py-3 text-right font-medium">$736</td></tr>
                <tr><td className="px-5 py-3">Effective tax rate</td><td className="px-5 py-3 text-right font-medium">15.00%</td></tr>
              </tbody></table></div></div>
              <p>The employer also pays <strong>$5,400 in superannuation</strong> (12% of $45,000) on top of gross salary. This super is claimable via DASP after departure. For comparison, an Australian resident earning $45,000 takes home approximately <strong>{formatAUD(RES_TAKE_HOME_45K)}</strong> after income tax and Medicare levy (with LITO applied) &mdash; <strong>{formatAUD(RES_TAKE_HOME_45K - WHM_TAKE_HOME_45K)} more</strong> than a WHM at the same salary.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>WHM vs Resident vs Non-Resident Tax Comparison</h3>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Income</th><th className="px-5 py-3 text-right">WHM Tax</th><th className="px-5 py-3 text-right">Resident Tax</th><th className="px-5 py-3 text-right">Non-Resident Tax</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                {[20_000, 40_000, 45_000, 60_000, 80_000].map((income) => (
                  <tr key={income}><td className="px-5 py-3">{formatAUD(income)}</td><td className="px-5 py-3 text-right font-medium">{formatAUD(WHM_TAX[income])}</td><td className="px-5 py-3 text-right">{formatAUD(Math.round(calculateIncomeTax(income, true)))}</td><td className="px-5 py-3 text-right">{formatAUD(Math.round(calculateIncomeTax(income, false)))}</td></tr>
                ))}
              </tbody></table></div><p className="text-xs text-warmgray-light mt-2">Income tax only. Excludes Medicare levy and tax offsets.</p></div>
              <p>WHMs pay more income tax than residents at every income level: with the resident second-bracket rate now matching the WHM 15% rate, the gap is the 15% applied to the $18,200 tax-free threshold that WHMs miss out on &mdash; a constant {formatAUD(Math.round(18_200 * 0.15))} once income passes $18,200. Against standard non-residents (30% from the first dollar), WHMs always pay less. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to compare scenarios at your specific salary.</p>
            </section>

            {/* ───────── SECTION 6: Super for Working Holiday Makers (DASP) ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Superannuation Work for Working Holiday Makers?</h2>
              <p>Working holiday makers receive superannuation at the standard <strong>12% SG rate</strong> in FY{SITE_CONFIG.financialYear}, and can claim their balance back via a &quot;Departing Australia Superannuation Payment&quot; (DASP) after leaving the country.</p>
              <p>Employers pay the superannuation guarantee on top of a WHM&apos;s ordinary time earnings, identical to any other employee. There is no minimum earnings threshold &mdash; the $450-per-month threshold was removed on 1 July 2022. A backpacker earning $45,000 accumulates <strong>$5,400 in super</strong> over the year across one or more super funds.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the DASP Tax Rate?</h3>
              <p>The DASP tax rate for working holiday makers is <strong>65%</strong> on the taxed element of the super balance. This rate is significantly higher than the 38% rate that applies to other temporary residents. On a $5,400 super balance, the DASP payment after tax is <strong>$1,890</strong>. While 65% taxation appears steep, the alternative is forfeiting the entire balance to the ATO&apos;s unclaimed super fund after 6 months of visa expiry.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Apply for DASP</h3>
              <ol>
                <li>Leave Australia and confirm your visa has expired or been cancelled (check via VEVO)</li>
                <li>Consolidate multiple super accounts into one fund via myGov (optional, but reduces paperwork)</li>
                <li>Apply online through the ATO&apos;s DASP application portal at <strong>ato.gov.au</strong></li>
                <li>Provide your passport, visa details, TFN, and super fund membership numbers</li>
                <li>The ATO processes claims within <strong>28 business days</strong> of receiving a complete application</li>
              </ol>
              <p>DASP claims must be lodged after departure. Applications submitted while still in Australia on a valid visa are rejected. For a deeper understanding of super guarantee obligations, see our <Link href="/superannuation-guide/">Superannuation Guide</Link>.</p>
            </section>

            {/* ───────── SECTION 7: Employer Obligations for WHMs ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Employer Obligations for Working Holiday Makers?</h2>
              <p>Employers hiring working holiday makers must <strong>register with the ATO</strong> as a WHM employer and withhold tax at the correct 15% rate from the first dollar of income.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Registration and Withholding Requirements</h3>
              <p>Employers must complete 4 specific obligations when employing WHMs:</p>
              <ul>
                <li><strong>Register as a WHM employer</strong> through the ATO Business Portal or by phoning 13 28 66 &mdash; registration is free and takes effect immediately</li>
                <li><strong>Withhold tax at 15%</strong> on the first $45,000 of income using the WHM PAYG withholding tax tables, not the standard employee tables</li>
                <li><strong>Verify visa status</strong> through the Visa Entitlement Verification Online (VEVO) system before the employee starts work</li>
                <li><strong>Pay superannuation</strong> at 12%, with the contribution received by the fund within 7 business days of each payday since Payday Super commenced on 1 July 2026</li>
              </ul>
              <div className="not-prose bg-red-50 border-l-4 border-red-500 p-4 my-6 text-sm text-warmgray"><strong>Warning:</strong> If the employer is NOT registered as a WHM employer, they must withhold at the <strong>non-resident rate of 30%</strong> from dollar one instead of 15%. This doubles the worker&apos;s tax withholding and reduces their take-home pay by approximately $6,750 on a $45,000 income. The worker can recover the overpaid tax by lodging a tax return, but this creates cash flow issues during the working period.</div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Penalties for Non-Compliance</h3>
              <p>Employers who fail to register or who apply incorrect withholding rates face administrative penalties of up to <strong>$1,110 per instance</strong> under the Taxation Administration Act 1953. The ATO also conducts targeted compliance audits in industries with high WHM employment, including agriculture, hospitality, meat processing, construction, and tourism. Employers in these sectors report to the ATO via Single Touch Payroll (STP), which flags discrepancies between visa type and withholding rate automatically.</p>
            </section>

            {/* ───────── SECTION 8: How to Lodge a Tax Return as a WHM ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Working Holiday Makers Lodge a Tax Return?</h2>
              <p>Working holiday makers lodge a tax return through <strong>myTax</strong> (the ATO&apos;s online portal) for each financial year in which they earned Australian income, even after departing the country.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step Process</h3>
              <ol>
                <li><strong>Create a myGov account</strong> and link it to the ATO &mdash; you need your TFN, bank details, and a recent payment summary or income statement from your employer</li>
                <li><strong>Select &quot;non-resident&quot;</strong> as your residency status when prompted (WHMs are treated as non-residents for tax purposes)</li>
                <li><strong>Verify your income</strong> &mdash; your employer&apos;s STP data pre-fills in myTax from mid-July each year</li>
                <li><strong>Claim deductions</strong> for work-related expenses such as protective clothing, tools, travel between work sites, and sun protection for outdoor work</li>
                <li><strong>Submit the return</strong> &mdash; the ATO processes most WHM returns within <strong>12 business days</strong></li>
                <li><strong>Receive your refund</strong> via direct deposit to an Australian bank account or a nominated overseas account</li>
              </ol>
              <p>The deadline for lodging is <strong>31 October</strong> following the end of the financial year (e.g., 31 October 2026 for FY2025-26 income). WHMs who have already left Australia can still lodge online. A registered tax agent can lodge on your behalf with an extended deadline, typically to 15 May of the following year. For general guidance on tax returns, see our <Link href="/tax-refund-guide/">Tax Refund Guide</Link>.</p>

              <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6 text-sm text-warmgray"><strong>Tip:</strong> Lodge your tax return <em>before</em> applying for DASP. If your employer over-withheld tax (e.g., at 30% because they were not registered), you receive a refund on the income tax first, then claim your super separately through the DASP process.</div>
            </section>

            {/* ───────── SECTION 9: What Changed This Financial Year? ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Working Holiday Makers in FY{SITE_CONFIG.financialYear}?</h2>
              <p>The WHM 15% flat rate on the first $45,000 is <strong>unchanged</strong> in FY{SITE_CONFIG.financialYear}, and the superannuation guarantee rate stays at its legislated <strong>12%</strong> ceiling. The year&apos;s main change is on the resident side: the resident second-bracket rate fell from 16% to <strong>15%</strong> on 1 July 2026.</p>
              <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Item</th><th className="px-5 py-3">FY{SITE_CONFIG.previousFinancialYear}</th><th className="px-5 py-3">FY{SITE_CONFIG.financialYear}</th><th className="px-5 py-3">Change</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr><td className="px-5 py-3">WHM tax rate (first $45,000)</td><td className="px-5 py-3">15%</td><td className="px-5 py-3 font-bold">15%</td><td className="px-5 py-3 text-warmgray-light">No change</td></tr>
                <tr><td className="px-5 py-3">WHM $45,000 threshold</td><td className="px-5 py-3">$45,000</td><td className="px-5 py-3 font-bold">$45,000</td><td className="px-5 py-3 text-warmgray-light">No change</td></tr>
                <tr><td className="px-5 py-3">Superannuation guarantee rate</td><td className="px-5 py-3">12%</td><td className="px-5 py-3 font-bold">12%</td><td className="px-5 py-3 text-warmgray-light">No change (ceiling reached 1 July 2025)</td></tr>
                <tr><td className="px-5 py-3">DASP tax rate (WHM)</td><td className="px-5 py-3">65%</td><td className="px-5 py-3 font-bold">65%</td><td className="px-5 py-3 text-warmgray-light">No change</td></tr>
                <tr><td className="px-5 py-3">Resident tax-free threshold</td><td className="px-5 py-3">$18,200</td><td className="px-5 py-3 font-bold">$18,200</td><td className="px-5 py-3 text-warmgray-light">No change (WHMs ineligible)</td></tr>
                <tr><td className="px-5 py-3">Resident 2nd bracket rate</td><td className="px-5 py-3">16%</td><td className="px-5 py-3 font-bold">15%</td><td className="px-5 py-3 text-green-600">-1%</td></tr>
              </tbody></table></div></div>
              <p>A backpacker earning $45,000 still accumulates <strong>$5,400</strong> in super contributions &mdash; the SG rate reached its legislated 12% ceiling on 1 July 2025 and no further increases are scheduled. The resident second-bracket cut from 16% to 15% does not change WHM rates, but it narrows the resident comparison: resident income tax on $45,000 fell from $4,288 in FY{SITE_CONFIG.previousFinancialYear} to {formatAUD(RES_TAX_45K)} in FY{SITE_CONFIG.financialYear}, while a WHM still pays $6,750. The 15% flat rate operates independently of the standard income tax bracket structure.</p>
            </section>

            {/* ───────── SECTION 10: Common Mistakes ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common Mistakes Working Holiday Makers Make?</h2>
              <p>The most common WHM tax mistake is <strong>claiming the tax-free threshold</strong> on the TFN declaration form, which results in under-withholding and a tax debt at lodgement.</p>
              <ul>
                <li><strong>Ticking &quot;yes&quot; to the tax-free threshold</strong> on the TFN declaration &mdash; WHMs are not entitled to the $18,200 threshold, and selecting it causes the employer to under-withhold tax. The backpacker then owes a lump sum when they lodge their return.</li>
                <li><strong>Not providing a TFN within 28 days</strong> &mdash; without a TFN, the employer withholds at the top marginal rate of 45% from dollar one. Applying for a TFN at a post office or online takes approximately 10 business days.</li>
                <li><strong>Failing to lodge a tax return</strong> &mdash; backpackers who leave Australia without lodging may miss out on a refund if their employer over-withheld. The ATO retains overpaid tax until a return is lodged.</li>
                <li><strong>Not checking employer WHM registration</strong> &mdash; if the employer is unregistered, 30% is withheld instead of 15%. Backpackers can verify registration by asking their employer for their WHM registration number.</li>
                <li><strong>Waiting too long for DASP</strong> &mdash; unclaimed super is transferred to the ATO&apos;s lost super fund after the visa has been expired for 6 months. While the funds remain claimable, the process becomes slower and more complex.</li>
              </ul>
            </section>

            {/* ───────── CONTEXT BORDER ───────── */}

            {/* ───────── SECTION 11: Related Resources ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
              <p>These Australian tax calculator tools and guides provide additional context for working holiday makers planning their finances.</p>
              <ul>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> &mdash; model your take-home pay under WHM, resident, or non-resident tax schedules</li>
                <li><Link href="/non-resident-tax/">Non-Resident Tax Rates</Link> &mdash; understand the rates that apply above $45,000 for WHMs and for other temporary visa holders</li>
                <li><Link href="/tax-brackets/">Tax Brackets Guide</Link> &mdash; complete FY{SITE_CONFIG.financialYear} income tax bracket tables for all residency types</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> &mdash; how the 12% SG rate works, contribution caps, and employer obligations</li>
                <li><Link href="/tax-refund-guide/">Tax Refund Guide</Link> &mdash; step-by-step instructions for lodging your Australian tax return and claiming deductions</li>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; calculate your net pay after tax, super, and deductions at any salary level</li>
              </ul>
            </section>

            {/* ───────── SECTION 12: FAQs ───────── */}
            <section>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">

                <AccordionItem value="tfn" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do I need a Tax File Number as a working holiday maker?</AccordionTrigger><AccordionContent className="text-warmgray">Yes. Apply for a TFN when you arrive in Australia. Without one, your employer must withhold tax at the maximum rate of <strong>45%</strong> from your first dollar of income. You can apply online through the ATO website or in person at a participating Australia Post office. Processing takes approximately <strong>10 business days</strong>.</AccordionContent></AccordionItem>

                <AccordionItem value="lodge" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do I need to lodge a tax return if I leave Australia?</AccordionTrigger><AccordionContent className="text-warmgray">Yes. You must lodge a tax return for each financial year in which you earned Australian income, even after leaving the country. Lodge through myTax online. The deadline is <strong>31 October</strong> following the end of the financial year. You can also appoint a registered tax agent to lodge on your behalf.</AccordionContent></AccordionItem>

                <AccordionItem value="super-claim" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">How do I claim back my superannuation after leaving Australia?</AccordionTrigger><AccordionContent className="text-warmgray">Apply for a &quot;Departing Australia Superannuation Payment&quot; (DASP) through the ATO online portal after your visa has expired or been cancelled. You need your passport, visa details, TFN, and super fund membership numbers. The ATO processes claims within <strong>28 business days</strong>. The tax rate on DASP for WHMs is <strong>65%</strong>.</AccordionContent></AccordionItem>

                <AccordionItem value="tax-free" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Can working holiday makers claim the tax-free threshold?</AccordionTrigger><AccordionContent className="text-warmgray"><strong>No.</strong> Working holiday makers are not entitled to the $18,200 tax-free threshold, regardless of how long they live in Australia. Every dollar earned from $1 is taxed at 15%. Do not tick &quot;yes&quot; to the tax-free threshold question on your TFN declaration form.</AccordionContent></AccordionItem>

                <AccordionItem value="medicare" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do working holiday makers pay the Medicare levy?</AccordionTrigger><AccordionContent className="text-warmgray"><strong>No.</strong> WHMs are exempt from the 2% Medicare levy. They are classified as non-residents for Medicare purposes and are not eligible for Medicare benefits (with limited exceptions under reciprocal health care agreements). The &quot;Medicare Levy Surcharge&quot; also does not apply.</AccordionContent></AccordionItem>

                <AccordionItem value="employer-not-registered" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">What happens if my employer is not registered as a WHM employer?</AccordionTrigger><AccordionContent className="text-warmgray">An unregistered employer must withhold tax at the <strong>non-resident rate of 30%</strong> from dollar one, instead of 15%. This effectively doubles your tax withholding. You can recover the overpaid amount by lodging a tax return at the end of the financial year, but you experience reduced take-home pay in the meantime. Ask your employer to register with the ATO before you start work.</AccordionContent></AccordionItem>

                <AccordionItem value="visa-change" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">What happens to my tax rate if I change visa type?</AccordionTrigger><AccordionContent className="text-warmgray">The WHM 15% rate ceases on the day your 417 or 462 visa expires or you transition to a different visa subclass (e.g., student visa 500, employer-sponsored visa 482, or partner visa 820). From that date, you are taxed under standard resident or non-resident rates. Income earned while on your working holiday visa remains taxed at WHM rates for that portion of the financial year.</AccordionContent></AccordionItem>

                <AccordionItem value="two-employers" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">What if I work for two employers on a working holiday visa?</AccordionTrigger><AccordionContent className="text-warmgray">Both employers withhold at 15% independently, as the $45,000 threshold applies to your <strong>total combined income</strong> for the financial year. If your combined earnings exceed $45,000, you may have a tax shortfall because each employer applies the 15% rate without knowing about the other. Lodge a tax return to settle the difference &mdash; the ATO calculates the correct tax on your total WHM income.</AccordionContent></AccordionItem>

                <AccordionItem value="deductions" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Can working holiday makers claim tax deductions?</AccordionTrigger><AccordionContent className="text-warmgray"><strong>Yes.</strong> WHMs can claim work-related deductions including protective clothing, tools and equipment, travel between work sites (not home-to-work), sun protection for outdoor work, and union fees. Deductions reduce your assessable income, which reduces tax payable. Keep all receipts and records for expenses over $300.</AccordionContent></AccordionItem>

                <AccordionItem value="hecs" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Do working holiday makers pay HECS-HELP repayments?</AccordionTrigger><AccordionContent className="text-warmgray"><strong>No.</strong> HECS-HELP repayments apply only to Australian residents with an outstanding Higher Education Loan Program debt. Working holiday makers on 417 and 462 visas are not liable for HECS-HELP repayments, even if they previously studied in Australia on a different visa and accumulated a HELP debt.</AccordionContent></AccordionItem>

                <AccordionItem value="how-long" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">How long does a WHM tax refund take?</AccordionTrigger><AccordionContent className="text-warmgray">The ATO processes most WHM tax returns within <strong>12 business days</strong> of lodgement. If your return is selected for manual review, processing takes up to <strong>30 business days</strong>. Refunds are paid via direct deposit to an Australian bank account or a nominated overseas account. Lodge electronically through myTax for the fastest processing.</AccordionContent></AccordionItem>

                <AccordionItem value="abn" className="border rounded-lg px-4 bg-white"><AccordionTrigger className="text-left font-semibold text-navy">Can I work as a sole trader on a working holiday visa?</AccordionTrigger><AccordionContent className="text-warmgray"><strong>Yes,</strong> but sole trader income is taxed at WHM rates only if the payer is registered with the ATO as a WHM employer. If you operate as a contractor with an ABN, the business paying you must still register as a WHM employer for the 15% rate to apply. Otherwise, standard non-resident withholding rates apply. Lodge a tax return to reconcile your total income and claim business deductions.</AccordionContent></AccordionItem>

              </Accordion>
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Tax rate information is sourced from the ATO&apos;s working holiday maker tax tables for FY{SITE_CONFIG.financialYear}. Comparison calculations use standard ATO tax brackets for residents and non-residents. Superannuation guarantee rates reflect the legislated 12% rate effective 1 July 2025. DASP tax rates are current as of FY{SITE_CONFIG.financialYear}. All calculations exclude employer-specific arrangements, salary sacrifice, and voluntary super contributions.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("working-holiday-tax"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Guides</h3><div className="space-y-3"><SidebarLink href="/non-resident-tax/" label="Non-Resident Tax Rates" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /><SidebarLink href="/superannuation-guide/" label="Superannuation Guide" /><SidebarLink href="/tax-refund-guide/" label="Tax Refund Guide" /></div></CardContent></Card>
            <Card className="bg-orange-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Calculate your take-home</h3><p className="text-orange-100 text-sm mb-4">See how much you&apos;ll take home after the 15% WHM rate.</p><Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-orange-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Income Tax Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
