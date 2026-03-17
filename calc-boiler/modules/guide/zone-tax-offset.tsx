"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
const SOURCES_LIST: SourceLink[] = [{ title: "Zone tax offset", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/zone-or-overseas-forces-tax-offsets/zone-tax-offset", publisher: SOURCES.ato.name }];

export default function ZoneTaxOffsetPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Zone Tax Offset</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Zone Tax Offset Guide — FY2025-26</h1><p className="text-xl text-warmgray leading-relaxed mb-6">The Zone Tax Offset is an Australian tax rebate worth up to <strong>$1,511</strong> per year for taxpayers living in remote or isolated areas. This guide covers zone classifications, offset amounts, eligibility rules, and step-by-step claiming instructions for the 2025-26 financial year.</p><TrustBar className="!max-w-none" /></header>
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ── SECTION 1 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Zone Tax Offset?</h2>
            <p>The &ldquo;Zone Tax Offset&rdquo; (ZTO) is a non-refundable tax offset that reduces the income tax payable by Australian residents who live in <strong>remote or isolated areas</strong> for more than 183 days in a financial year. The ATO classifies eligible locations into Zone A, Zone B, and Special Areas, each carrying a different offset amount.</p>
            <p>The offset recognises that residents of remote towns face higher costs for groceries, fuel, medical care, and education compared to residents of metropolitan centres like Sydney, Melbourne, and Brisbane. Approximately <strong>2.4 million Australians</strong> live in areas that qualify for some level of zone tax offset. The ZTO has existed since the 1945 income tax assessment regime and remains one of the longest-running tax concessions in Australian taxation law.</p>
            <p>Because the ZTO is non-refundable, it reduces your tax liability to a minimum of zero but does not generate a refund on its own. The offset applies after other tax offsets including the <Link href="/low-income-tax-offset/">Low Income Tax Offset (LITO)</Link> have been calculated. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to see how the zone tax offset interacts with your marginal tax rate for FY2025-26.</p>
          </section>

          {/* ── SECTION 2 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Is the Zone Tax Offset?</h2>
            <p>The Zone Tax Offset ranges from <strong>$57 for Zone B residents</strong> to <strong>$1,511 for Special Area residents</strong> in Zone A for the 2025-26 financial year. The exact amount depends on your zone classification and whether you have dependants.</p>
            <p>The base offset has two components: a fixed amount determined by your zone, and an additional amount for taxpayers in designated Special Areas. If you have a dependant spouse, invalid, or carer, you receive a supplementary dependant component on top of the base offset. The dependant component adds <strong>$130</strong> for Zone A residents and <strong>$22</strong> for Zone B residents, plus an additional 50% of relevant dependant rebates.</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Zone</th><th className="px-5 py-3">Base Offset</th><th className="px-5 py-3">With Special Area</th><th className="px-5 py-3">Dependant Add-On</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Zone A (Remote)</td><td className="px-5 py-3 font-medium">$338</td><td className="px-5 py-3 font-medium">$338 + $1,173 = $1,511</td><td className="px-5 py-3">$130</td></tr>
              <tr><td className="px-5 py-3 font-medium">Zone B (Less Remote)</td><td className="px-5 py-3 font-medium">$57</td><td className="px-5 py-3 font-medium">$57 + $1,173 = $1,230</td><td className="px-5 py-3">$22</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Special Area (within Zone A or B)</td><td className="px-5 py-3 font-medium">+$1,173</td><td className="px-5 py-3 font-medium">Included above</td><td className="px-5 py-3">Same as zone</td></tr>
            </tbody></table></div></div>

            <p>The base offset amounts have remained unchanged since FY2015-16. Unlike income tax brackets, the Zone Tax Offset is not indexed to inflation or wage growth. The offset applies to your total tax liability after the tax-free threshold of <strong>$18,200</strong> and the standard <Link href="/tax-brackets/">Australian tax brackets</Link> have been calculated.</p>
          </section>

          {/* ── SECTION 3 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Is Eligible for the Zone Tax Offset?</h2>
            <p>Any Australian resident for tax purposes who maintains their usual place of residence in a designated zone for <strong>more than 183 days</strong> during the financial year is eligible for the Zone Tax Offset. The 183-day requirement does not need to be consecutive.</p>
            <p>Eligibility is determined by where you live, not where you work. The following criteria must be met:</p>
            <ul>
              <li>Your <strong>usual place of residence</strong> (primary home) is located within a Zone A, Zone B, or Special Area postcode</li>
              <li>You lived in the zone for <strong>more than 183 days</strong> between 1 July and 30 June of the financial year</li>
              <li>You are an <strong>Australian resident for tax purposes</strong> during the relevant income year</li>
              <li>You have a <strong>tax liability greater than zero</strong> (the offset is non-refundable and cannot create a refund)</li>
            </ul>
            <p>Temporary absences for holidays, work travel, or medical treatment do not break your residency in the zone, provided you maintain your home there and intend to return. Defence force personnel posted to remote areas qualify under separate overseas forces provisions. Non-residents for tax purposes are not eligible for the ZTO — see our <Link href="/non-resident-tax/">Non-Resident Tax Guide</Link> for applicable tax rules.</p>
          </section>

          {/* ── SECTION 4 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Claim the Zone Tax Offset?</h2>
            <p>You claim the Zone Tax Offset at <strong>Item D7</strong> in your individual income tax return (Zone or overseas forces tax offset). The claim requires your zone classification and the number of days you resided in the zone during the financial year.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step Claiming Process</h3>
            <ol>
              <li><strong>Confirm your zone classification</strong> — Search your postcode on the ATO&rsquo;s zone list or use the ATO&rsquo;s online zone tax offset tool to verify whether your address falls in Zone A, Zone B, or a Special Area.</li>
              <li><strong>Count your residency days</strong> — Calculate the total number of days between 1 July and 30 June that you maintained your usual place of residence in the zone. The total must exceed 183 days.</li>
              <li><strong>Gather supporting evidence</strong> — Keep records including your lease agreement or mortgage documents, utility bills, electoral roll enrolment, and vehicle registration showing your zone address.</li>
              <li><strong>Complete Item D7</strong> — In your tax return (paper or myTax), navigate to Item D7 and select the applicable zone. Enter the number of days and whether you are claiming for a dependant.</li>
              <li><strong>Lodge your return</strong> — Submit your tax return by the due date (<strong>31 October</strong> for self-lodgers, or by your tax agent&rsquo;s extended deadline). The offset reduces your assessed tax payable.</li>
            </ol>
            <p>Your employer does not apply the Zone Tax Offset through <Link href="/payg-withholding-tables/">PAYG withholding</Link> during the year. The offset is claimed entirely at tax return time, which means you receive it as a lump-sum tax reduction or increased refund when you lodge. Check your expected refund using our <Link href="/tax-refund-guide/">Tax Refund Guide</Link>.</p>
          </section>

          {/* ── SECTION 5 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Zone Tax Offset Amounts by Zone?</h2>
            <p>The full Zone Tax Offset amount table below shows the base offset, Special Area supplement, and combined maximum for each zone classification in FY2025-26. These amounts apply identically to all eligible taxpayers regardless of income level.</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Zone Classification</th><th className="px-5 py-3">Base Offset</th><th className="px-5 py-3">Special Area Supplement</th><th className="px-5 py-3">Maximum Total Offset</th><th className="px-5 py-3">Weekly Benefit</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Zone A only</td><td className="px-5 py-3">$338</td><td className="px-5 py-3">—</td><td className="px-5 py-3 font-medium">$338</td><td className="px-5 py-3">$6.50</td></tr>
              <tr><td className="px-5 py-3 font-medium">Zone A + Special Area</td><td className="px-5 py-3">$338</td><td className="px-5 py-3">$1,173</td><td className="px-5 py-3 font-medium">$1,511</td><td className="px-5 py-3">$29.06</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Zone B only</td><td className="px-5 py-3">$57</td><td className="px-5 py-3">—</td><td className="px-5 py-3 font-medium">$57</td><td className="px-5 py-3">$1.10</td></tr>
              <tr><td className="px-5 py-3 font-medium">Zone B + Special Area</td><td className="px-5 py-3">$57</td><td className="px-5 py-3">$1,173</td><td className="px-5 py-3 font-medium">$1,230</td><td className="px-5 py-3">$23.65</td></tr>
            </tbody></table></div></div>

            <p>The weekly benefit column shows the effective per-week tax saving when the offset is spread across 52 weeks. A Zone A Special Area resident effectively pays <strong>$29.06 less tax per week</strong> than an identical taxpayer living in a metropolitan area. The offset stacks with other tax offsets such as LITO and the <Link href="/superannuation-guide/">Superannuation Co-contribution</Link>.</p>
          </section>

          {/* ── SECTION 6 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Zone Tax Offset Affect Take-Home Pay?</h2>
            <p>The Zone Tax Offset increases your after-tax income by reducing your total tax payable at assessment time. A Zone A Special Area resident earning $85,000 saves <strong>$1,511 in tax</strong> compared to an equivalent taxpayer in Sydney or Melbourne.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: $85,000 Salary in Zone A Special Area</h3>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Component</th><th className="px-5 py-3">Without ZTO</th><th className="px-5 py-3">With ZTO (Zone A Special)</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Gross salary</td><td className="px-5 py-3">$85,000</td><td className="px-5 py-3">$85,000</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Income tax (FY2025-26 brackets)</td><td className="px-5 py-3">$16,467</td><td className="px-5 py-3">$16,467</td></tr>
              <tr><td className="px-5 py-3">LITO</td><td className="px-5 py-3">−$0</td><td className="px-5 py-3">−$0</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Zone Tax Offset</td><td className="px-5 py-3">−$0</td><td className="px-5 py-3">−$1,511</td></tr>
              <tr><td className="px-5 py-3">Medicare levy (2%)</td><td className="px-5 py-3">$1,700</td><td className="px-5 py-3">$1,700</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Total tax payable</td><td className="px-5 py-3 font-medium">$18,167</td><td className="px-5 py-3 font-medium">$16,656</td></tr>
              <tr><td className="px-5 py-3 font-medium">Annual take-home pay</td><td className="px-5 py-3 font-medium">$66,833</td><td className="px-5 py-3 font-medium">$68,344</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Fortnightly take-home pay</td><td className="px-5 py-3 font-medium">$2,570</td><td className="px-5 py-3 font-medium">$2,629</td></tr>
            </tbody></table></div></div>
            <p>The ZTO delivers an extra <strong>$1,511 per year</strong> or <strong>$58 per fortnight</strong> in take-home pay for this taxpayer. At lower salaries, the offset represents a larger percentage of total tax. A worker earning $45,000 in Zone A Special Area pays <strong>$1,511 less tax</strong> on a base tax liability of $3,392 (before LITO), reducing their effective tax rate from 7.5% to 4.2%. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to model your specific salary and zone.</p>
          </section>

          {/* ── SECTION 7 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Can FIFO Workers Claim the Zone Tax Offset?</h2>
            <p>Fly-in-fly-out (FIFO) workers <strong>cannot claim the Zone Tax Offset</strong> unless their usual place of residence is in a designated zone. Working in a remote area on a roster arrangement does not qualify — the ATO requires you to live in the zone, not commute to it.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FIFO vs Resident Worker Eligibility</h3>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Scenario</th><th className="px-5 py-3">Eligible?</th><th className="px-5 py-3">Reason</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Lives in Perth, flies to Karratha mine site for 2/1 roster</td><td className="px-5 py-3 font-medium">No</td><td className="px-5 py-3">Usual residence is Perth (not in a zone)</td></tr>
              <tr><td className="px-5 py-3">Lives in Karratha permanently, works at nearby mine</td><td className="px-5 py-3 font-medium">Yes — Zone A</td><td className="px-5 py-3">Karratha is usual place of residence in Zone A</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Lives in Darwin, works office job in Darwin CBD</td><td className="px-5 py-3 font-medium">Yes — Zone B</td><td className="px-5 py-3">Darwin is in Zone B, and resident lives there</td></tr>
              <tr><td className="px-5 py-3">Lives in Brisbane, FIFO to Mount Isa 8/6 roster</td><td className="px-5 py-3 font-medium">No</td><td className="px-5 py-3">Usual residence is Brisbane (not in a zone)</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Relocated to Broken Hill, family home established</td><td className="px-5 py-3 font-medium">Yes — Zone A</td><td className="px-5 py-3">Broken Hill is usual residence in Zone A</td></tr>
            </tbody></table></div></div>
            <p>The ATO applies the &ldquo;usual place of residence&rdquo; test, not a day-counting test at the work site. Key indicators include where your family lives, where you are enrolled to vote, where your personal belongings are stored, and where you return after work rosters. FIFO workers based in capital cities like Perth, Brisbane, and Adelaide do not qualify regardless of how many days they spend at a remote site. These workers may still benefit from other deductions — check the <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> for alternative tax-saving strategies.</p>
          </section>

          {/* ── SECTION 8 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Towns Are in Each Zone?</h2>
            <p>Zone boundaries are defined by postcodes and geographic coordinates set by the ATO. Zone A covers the most remote inland and northern areas, Zone B covers less remote but still isolated regions, and Special Areas designate the most geographically isolated communities within either zone.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Zone A Example Towns</h3>
            <p>Zone A includes towns with extreme remoteness across Western Australia, Northern Territory, Queensland, New South Wales, and South Australia. Key examples include:</p>
            <ul>
              <li><strong>Western Australia:</strong> Karratha, Port Hedland, Newman, Tom Price, Exmouth</li>
              <li><strong>Northern Territory:</strong> Alice Springs, Tennant Creek, Katherine</li>
              <li><strong>Queensland:</strong> Mount Isa, Longreach, Cloncurry, Winton, Birdsville</li>
              <li><strong>New South Wales:</strong> Broken Hill, Tibooburra, White Cliffs</li>
              <li><strong>South Australia:</strong> Coober Pedy, Woomera, Roxby Downs, Leigh Creek</li>
            </ul>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Zone B Example Towns</h3>
            <p>Zone B encompasses larger regional centres that are remote but maintain more infrastructure than Zone A locations:</p>
            <ul>
              <li><strong>Northern Territory:</strong> Darwin, Palmerston, Humpty Doo</li>
              <li><strong>Western Australia:</strong> Geraldton, Kalgoorlie, Broome, Carnarvon</li>
              <li><strong>Queensland:</strong> Cairns, Townsville, Mackay, Rockhampton, Gladstone</li>
              <li><strong>South Australia:</strong> Whyalla, Port Augusta, Port Lincoln, Ceduna</li>
            </ul>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Special Area Examples</h3>
            <p>Special Areas are the most isolated communities in Australia, typically with populations under 1,000 and located hundreds of kilometres from the nearest service centre. Examples include remote Aboriginal communities, pastoral stations, and mining outposts across the Western Desert, Arnhem Land, and Cape York Peninsula. A Special Area resident in Zone A receives the combined offset of <strong>$1,511</strong> ($338 + $1,173). Use the <Link href="/pay-calculator-wa/">WA Pay Calculator</Link> or <Link href="/pay-calculator-nt/">NT Pay Calculator</Link> to calculate take-home pay for salaries in these regions.</p>
          </section>

          {/* ── CONTEXT BORDER ── */}

          {/* ── SECTION 9 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for the Zone Tax Offset in FY2025-26?</h2>
            <p>The Zone Tax Offset amounts remain <strong>unchanged for FY2025-26</strong> at $338 (Zone A), $57 (Zone B), and $1,173 (Special Area supplement). No zone boundary reclassifications were announced in the 2025-26 Federal Budget.</p>
            <p>The ZTO base amounts have not been adjusted since FY2015-16, despite significant inflation in remote area living costs over the past decade. The Productivity Commission and the Regional Australia Institute have both recommended indexation of the ZTO to the Consumer Price Index, but no legislative changes have been introduced.</p>
            <p>The key change affecting remote area taxpayers in FY2025-26 is the updated income tax bracket structure introduced on 1 July 2024 under Stage 3 tax cuts. The 32.5% marginal rate was reduced to <strong>30%</strong> for incomes between $45,001 and $135,000, and the 37% bracket was lowered to <strong>37%</strong> for incomes between $135,001 and $190,000. These bracket changes deliver additional tax relief on top of the Zone Tax Offset. A Zone A worker earning $85,000 benefits from both the reduced 30% marginal rate and the $338 zone offset. See the full rate schedule on our <Link href="/tax-brackets/">Australian Tax Brackets</Link> page.</p>
          </section>

          {/* ── SECTION 10 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Zone Tax Offset Interact with Other Offsets?</h2>
            <p>The Zone Tax Offset stacks with other non-refundable tax offsets including the <strong>Low Income Tax Offset (LITO)</strong> and the <strong>Senior and Pensioner Tax Offset (SAPTO)</strong>. The combined effect reduces your tax payable but cannot reduce it below zero.</p>
            <p>The ATO applies offsets in a specific order. The tax-free threshold of $18,200 is applied first through the marginal rate calculation, then LITO (up to $700), then SAPTO (if eligible), and then the Zone Tax Offset. A low-income earner in Zone A Special Area earning $30,000 receives LITO of <strong>$700</strong> plus ZTO of <strong>$1,511</strong>, reducing their income tax from $1,888 to zero. The excess offset amount is not refunded.</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Tax Offset</th><th className="px-5 py-3">Maximum Value</th><th className="px-5 py-3">Refundable?</th><th className="px-5 py-3">Stacks with ZTO?</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Zone Tax Offset (Zone A Special)</td><td className="px-5 py-3">$1,511</td><td className="px-5 py-3">No</td><td className="px-5 py-3">—</td></tr>
              <tr><td className="px-5 py-3">Low Income Tax Offset (LITO)</td><td className="px-5 py-3">$700</td><td className="px-5 py-3">No</td><td className="px-5 py-3">Yes</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Senior &amp; Pensioner Tax Offset</td><td className="px-5 py-3">$2,230</td><td className="px-5 py-3">No</td><td className="px-5 py-3">Yes</td></tr>
              <tr><td className="px-5 py-3">Private Health Insurance Offset</td><td className="px-5 py-3">Varies</td><td className="px-5 py-3">No</td><td className="px-5 py-3">Yes</td></tr>
            </tbody></table></div></div>
          </section>

          {/* ── SECTION 11 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Records Do You Need to Claim the Zone Tax Offset?</h2>
            <p>You must retain evidence proving your usual place of residence was in a designated zone for more than <strong>183 days</strong>. The ATO does not require you to submit documents with your return, but you must produce them if audited.</p>
            <p>Acceptable evidence includes:</p>
            <ul>
              <li><strong>Property records</strong> — lease agreement, mortgage statement, or council rates notice showing the zone address</li>
              <li><strong>Utility bills</strong> — electricity, water, gas, or internet bills addressed to the zone property</li>
              <li><strong>Electoral enrolment</strong> — AEC enrolment confirmation showing the zone address</li>
              <li><strong>Vehicle registration</strong> — registration papers listing the zone address</li>
              <li><strong>School enrolment</strong> — children&rsquo;s school records at a zone-area school</li>
              <li><strong>Employment records</strong> — payslips or employment contract showing the zone address as your home address</li>
            </ul>
            <p>Keep these records for <strong>5 years</strong> from the date of lodgement. Understanding your payslip details helps verify your address records match — see our <Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> guide for what each field means.</p>
          </section>

          {/* ── SECTION 12: Related Resources ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
            <p>Use these Australian tax calculators and guides alongside the Zone Tax Offset to calculate your complete take-home pay and tax position for the 2025-26 financial year.</p>
            <ul>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> — Calculate your net pay after income tax, Medicare levy, superannuation, and HECS-HELP deductions</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — Model your income tax liability across all Australian tax brackets for FY2025-26</li>
              <li><Link href="/low-income-tax-offset/">Low Income Tax Offset (LITO) Guide</Link> — Understand the $700 maximum LITO and how it phases out between $37,500 and $66,667</li>
              <li><Link href="/tax-brackets/">Australian Tax Brackets</Link> — Full marginal rate table including the Stage 3 tax cut changes</li>
              <li><Link href="/pay-calculator-nt/">NT Pay Calculator</Link> — Take-home pay for Northern Territory workers, many of whom qualify for Zone A or Zone B offsets</li>
              <li><Link href="/pay-calculator-wa/">WA Pay Calculator</Link> — Take-home pay for Western Australian workers in Pilbara, Kimberley, and Goldfields zone areas</li>
            </ul>
          </section>

          {/* ── SECTION 13: FAQs ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">

              <AccordionItem value="what-is" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is the Zone Tax Offset for FY2025-26?</AccordionTrigger>
                <AccordionContent className="text-warmgray">The Zone Tax Offset is a non-refundable tax rebate for Australian residents living in remote or isolated areas. The base offset is <strong>$338</strong> for Zone A, <strong>$57</strong> for Zone B, and an additional <strong>$1,173</strong> for designated Special Areas. These amounts are unchanged from previous years.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="fly-in" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can FIFO workers claim the Zone Tax Offset?</AccordionTrigger>
                <AccordionContent className="text-warmgray">FIFO workers cannot claim the Zone Tax Offset unless their usual place of residence is in a designated zone. Working at a remote mine site on a fly-in-fly-out roster does not qualify. Your home address — where your family lives, where you vote, and where you return after shifts — determines eligibility, not your work location.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="find" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">How do I find which zone my town is in?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Search your postcode on the ATO&rsquo;s <a href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/zone-or-overseas-forces-tax-offsets/zone-tax-offset" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Zone Tax Offset tool</a>. The tool confirms whether your address falls in Zone A, Zone B, a Special Area, or no zone at all.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="183-days" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Do the 183 days need to be consecutive?</AccordionTrigger>
                <AccordionContent className="text-warmgray">No. The 183 days do not need to be consecutive. The ATO counts the total number of days your usual place of residence was in the zone during the financial year (1 July to 30 June). Temporary absences for holidays, medical trips, or work travel do not break your zone residency, provided you maintain your home in the zone.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="pro-rata" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is the Zone Tax Offset pro-rated for partial years?</AccordionTrigger>
                <AccordionContent className="text-warmgray">No. The Zone Tax Offset is not pro-rated. You either qualify for the full offset (more than 183 days in the zone) or you receive nothing. There is no partial offset for living in a zone for 100 or 150 days.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="refundable" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is the Zone Tax Offset refundable?</AccordionTrigger>
                <AccordionContent className="text-warmgray">No. The ZTO is a non-refundable offset. It reduces your tax liability to a minimum of zero but does not generate a cash refund on its own. If your total tax payable is less than the offset amount, the excess is lost — it cannot be carried forward to future years.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="employer-apply" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does my employer apply the Zone Tax Offset to my pay?</AccordionTrigger>
                <AccordionContent className="text-warmgray">No. Your employer does not factor the Zone Tax Offset into PAYG withholding calculations. The offset is claimed entirely through your annual tax return at Item D7. This means your regular pay does not reflect the offset — you receive the benefit as a reduced tax assessment or increased refund when you lodge.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="darwin" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is Darwin in Zone A or Zone B?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Darwin is classified as <strong>Zone B</strong>, providing a base offset of <strong>$57</strong>. Other Zone B cities in the Northern Territory include Palmerston and Humpty Doo. Alice Springs, by contrast, falls in <strong>Zone A</strong> with a base offset of <strong>$338</strong>.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="stack-lito" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can I claim the Zone Tax Offset and LITO together?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. The Zone Tax Offset and the Low Income Tax Offset (LITO) are separate non-refundable offsets that stack. Both reduce your tax payable, but the combined effect cannot reduce your tax below zero. A Zone A Special Area resident earning $35,000 receives LITO of <strong>$700</strong> plus ZTO of <strong>$1,511</strong>.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="moved-mid-year" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What if I moved to a zone area mid-year?</AccordionTrigger>
                <AccordionContent className="text-warmgray">You qualify for the Zone Tax Offset if you lived in the zone for more than 183 days total during the financial year. Moving to a zone area on 1 January gives you approximately 181 days (1 January to 30 June), which falls short of the 183-day threshold. Moving by <strong>30 December</strong> provides exactly 183 days and qualifies you for the full offset.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="multiple-zones" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What if I lived in two different zones during the year?</AccordionTrigger>
                <AccordionContent className="text-warmgray">If you lived in more than one zone during the financial year, the ATO applies the zone where you resided for the <strong>longest period</strong>. You cannot combine days from different zones to meet the 183-day threshold. The offset amount corresponds to the single zone where you spent the majority of the year.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="overseas-forces" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is the Zone Tax Offset different from the Overseas Forces Tax Offset?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. The Zone Tax Offset and the Overseas Forces Tax Offset are separate concessions claimed at the same Item D7 in the tax return. The Overseas Forces Tax Offset applies to Australian Defence Force members serving overseas in specified areas. Both are non-refundable, but the eligibility criteria, qualifying locations, and offset calculations differ.</AccordionContent>
              </AccordionItem>

            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Zone classifications and offset amounts sourced from the ATO for FY2025-26. Income tax calculations use the current marginal rate schedule including Stage 3 tax cuts effective 1 July 2024. Medicare levy calculated at 2% of taxable income. Superannuation guarantee rate is 12% for FY2025-26.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("zone-tax-offset"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/pay-calculator-nt/" label="NT Pay Calculator" /><SidebarLink href="/pay-calculator-wa/" label="WA Pay Calculator" /><SidebarLink href="/low-income-tax-offset/" label="LITO Guide" /><SidebarLink href="/tax-brackets/" label="Australian Tax Brackets" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
