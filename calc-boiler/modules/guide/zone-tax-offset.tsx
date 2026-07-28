"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, calculateIncomeTax, calculateMedicareLevy, formatAUD } from "@/lib/constants";
import {
  ZONE_AREA_RATES,
  ZONE_OFFSET_INCOME_YEAR,
  ZONE_QUALIFYING_DAYS,
  DEPENDANT_BASE_AMOUNTS,
  SOLE_PARENT_BASE,
  INVALID_CARER_OFFSET,
  DEPENDANT_ATI,
} from "@/lib/constants/zone-tax-offset";
import ZoneTaxOffsetCalculator from "@/modules/calculator/zone-tax-offset-calculator";
import { ZONE_FAQS } from "@/modules/guide/zone-tax-offset-faqs";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const ZONE_LIST_URL = "https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones";
const T4_URL =
  "https://www.ato.gov.au/forms-and-instructions/individual-supplementary-tax-return-2026-instructions/tax-offset-questions-t3-t9-supplementary-tax-return-2026/t4-zone-or-overseas-forces-2026";

const SOURCES_LIST: SourceLink[] = [
  {
    title: "Zone tax offset",
    url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/zone-or-overseas-forces-tax-offsets/zone-tax-offset",
    publisher: SOURCES.ato.name,
  },
  { title: "T4 Zone or overseas forces 2026", url: T4_URL, publisher: SOURCES.ato.name },
  { title: "Australian zone list", url: ZONE_LIST_URL, publisher: SOURCES.ato.name },
];

const A = ZONE_AREA_RATES.zoneA.fixedAmount;
const B = ZONE_AREA_RATES.zoneB.fixedAmount;
const SPECIAL = ZONE_AREA_RATES.specialArea.fixedAmount;
const OVERSEAS = ZONE_AREA_RATES.overseasForces.fixedAmount;

// Worked example, derived from the engine so it cannot drift from the brackets.
const EXAMPLE_SALARY = 85_000;
const EXAMPLE_TAX = calculateIncomeTax(EXAMPLE_SALARY);
const EXAMPLE_MEDICARE = calculateMedicareLevy(EXAMPLE_SALARY);
const EXAMPLE_TOTAL_TAX = EXAMPLE_TAX + EXAMPLE_MEDICARE;
const EXAMPLE_TOTAL_TAX_ZTO = EXAMPLE_TOTAL_TAX - SPECIAL;
const EXAMPLE_NET = EXAMPLE_SALARY - EXAMPLE_TOTAL_TAX;
const EXAMPLE_NET_ZTO = EXAMPLE_SALARY - EXAMPLE_TOTAL_TAX_ZTO;

export default function ZoneTaxOffsetPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Zone Tax Offset</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Zone Tax Offset Calculator — Remote Area Tax Rebate</h1><p className="text-xl text-warmgray leading-relaxed mb-6">The zone tax offset is a tax rebate for Australians whose usual place of residence is in a remote or isolated area. The fixed amount is <strong>{formatAUD(A)}</strong> in Zone A, <strong>{formatAUD(B)}</strong> in Zone B and <strong>{formatAUD(SPECIAL)}</strong> in a special area, plus a share of any dependant base amount. Work out your exact entitlement below.</p><TrustBar className="!max-w-none" /></header>

      <div className="mb-12"><ZoneTaxOffsetCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ── SECTION 1 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Zone Tax Offset?</h2>
            <p>The zone tax offset (ZTO) is a non-refundable tax offset for Australian residents whose usual place of residence is in a <strong>remote or isolated area</strong> for {ZONE_QUALIFYING_DAYS} days or more in an income year. The ATO classifies eligible locations as Zone A or Zone B, with <em>special areas</em> designated inside either zone.</p>
            <p>The offset exists to recognise the higher cost of living, isolation and other factors that come with living in these areas. It does not apply to an offshore oil or gas rig.</p>
            <p>Because the ZTO is non-refundable, it reduces your tax liability to a minimum of zero but does not generate a refund on its own. Use our <Link href="/income-tax-calculator/">income tax calculator</Link> to see how it sits against your marginal rate, and the <Link href="/low-income-tax-offset/">Low Income Tax Offset (LITO)</Link> guide for the other offset most remote workers claim.</p>
          </section>

          {/* ── SECTION 2 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Is the Zone Tax Offset?</h2>
            <p>The offset has two parts: a <strong>fixed amount</strong> set by your zone, and a <strong>percentage of your base amount</strong> if you maintained dependants. The maximum with no dependants is <strong>{formatAUD(SPECIAL)}</strong>, for a special area.</p>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>A special area replaces the Zone A or Zone B fixed amount — it is not added to it.</strong> A resident of a special area within Zone A claims {formatAUD(SPECIAL)}, not {formatAUD(A)} plus {formatAUD(SPECIAL)}.</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Zone or area</th><th className="px-5 py-3">Fixed amount</th><th className="px-5 py-3">Percentage of base amount</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Zone A</td><td className="px-5 py-3 font-medium">{formatAUD(A)}</td><td className="px-5 py-3">50%</td></tr>
              <tr><td className="px-5 py-3 font-medium">Zone B</td><td className="px-5 py-3 font-medium">{formatAUD(B)}</td><td className="px-5 py-3">20%</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Special area (in Zone A or Zone B)</td><td className="px-5 py-3 font-medium">{formatAUD(SPECIAL)}</td><td className="px-5 py-3">50%</td></tr>
              <tr><td className="px-5 py-3 font-medium">Overseas forces</td><td className="px-5 py-3 font-medium">{formatAUD(OVERSEAS)}</td><td className="px-5 py-3">50%</td></tr>
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO table 3, <a href={T4_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">T4 Zone or overseas forces 2026</a>. Amounts apply to the {ZONE_OFFSET_INCOME_YEAR} income year.</p></div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The base amount</h3>
            <p>You only have a base amount if you maintained a dependent child or student, had sole care of one, or were entitled to the invalid and invalid carer tax offset. The components are:</p>
            <ul>
              <li><strong>{formatAUD(DEPENDANT_BASE_AMOUNTS.studentUnder25)}</strong> for each full-time student under 25</li>
              <li><strong>{formatAUD(DEPENDANT_BASE_AMOUNTS.oldestChildUnder21)}</strong> for the oldest non-student child under 21, and <strong>{formatAUD(DEPENDANT_BASE_AMOUNTS.otherChildUnder21)}</strong> for each other child under 21</li>
              <li><strong>{formatAUD(SOLE_PARENT_BASE.fullYear)}</strong> if you had sole care for the whole year ({formatAUD(SOLE_PARENT_BASE.perDay, 2)} a day for part of a year)</li>
              <li>The invalid and invalid carer tax offset you claim at question T5, up to <strong>{formatAUD(INVALID_CARER_OFFSET.fullYearMax)}</strong></li>
            </ul>
            <p>Add those together, then apply your zone&rsquo;s percentage. A Zone A resident with one student dependant claims {formatAUD(A)} + 50% of {formatAUD(DEPENDANT_BASE_AMOUNTS.studentUnder25)} = <strong>{formatAUD(A + DEPENDANT_BASE_AMOUNTS.studentUnder25 * 0.5)}</strong>. The same person in Zone B claims {formatAUD(B)} + 20% = <strong>{formatAUD(B + DEPENDANT_BASE_AMOUNTS.studentUnder25 * 0.2, 2)}</strong>.</p>
            <p>A dependant&rsquo;s base amount reduces by $1 for every $4 of their adjusted taxable income over <strong>{formatAUD(DEPENDANT_ATI.reductionThreshold)}</strong>. If their income is under {formatAUD(DEPENDANT_ATI.fullClaimCeiling)} you claim the base amount in full.</p>
          </section>

          {/* ── SECTION 3 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Is Eligible for the Zone Tax Offset?</h2>
            <p>Eligibility rests on your <strong>usual place of residence</strong>, not where you work. To claim, your usual place of residence must have been in a zone for <strong>{ZONE_QUALIFYING_DAYS} days or more</strong> during the income year. The days need not be consecutive.</p>
            <ul>
              <li>Your usual place of residence was in a Zone A, Zone B or special area location</li>
              <li>That was true for {ZONE_QUALIFYING_DAYS} days or more between 1 July and 30 June</li>
              <li>You received assessable income that you pay tax on, and you lodge a tax return</li>
            </ul>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>If you were there fewer than {ZONE_QUALIFYING_DAYS} days</h3>
            <p>You may still qualify. If your residence in the zone was a continuous period of less than 5 years, you can carry forward unused days from the first year, provided:</p>
            <ul>
              <li>you could not claim in that first year because you lived there fewer than {ZONE_QUALIFYING_DAYS} days</li>
              <li>the first year&rsquo;s days plus the current year&rsquo;s days total {ZONE_QUALIFYING_DAYS} or more</li>
              <li>the current-year period includes the first day of the income year</li>
            </ul>
            <p>The ATO&rsquo;s own example: a taxpayer living in a remote area from 1 March 2021 to 30 September 2025 could not claim in the first year (122 days), but added those 122 days to the 92 days from 1 July to 30 September 2025 for a total of 214 — enough to claim.</p>
            <p>Non-residents for tax purposes are not eligible — see our <Link href="/non-resident-tax/">non-resident tax guide</Link>.</p>
          </section>

          {/* ── SECTION 4 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Claim the Zone Tax Offset?</h2>
            <p>You claim it at question <strong>T4 Zone or overseas forces</strong>, label R, in the supplementary section of your individual tax return.</p>
            <ol>
              <li><strong>Confirm your zone</strong> — check your location on the ATO&rsquo;s <a href={ZONE_LIST_URL} target="_blank" rel="noopener noreferrer">Australian zone list</a>. The list is not exhaustive; some locations qualify as special areas without appearing on it.</li>
              <li><strong>Count your days</strong> — the number of days between 1 July and 30 June your usual place of residence was in the zone.</li>
              <li><strong>Work out any base amount</strong> — dependants, sole care, invalid and invalid carer offset.</li>
              <li><strong>Subtract any remote area allowance</strong> you received from Centrelink or the Department of Veterans&rsquo; Affairs.</li>
              <li><strong>Lodge</strong> — by 31 October if you self-lodge, or by your tax agent&rsquo;s extended date.</li>
            </ol>
            <p>Your employer does not apply the offset through <Link href="/payg-withholding-tables/">PAYG withholding</Link> during the year, so you receive it as a reduced assessment or larger refund when you lodge.</p>
            <p>If you qualify for both a zone tax offset and an overseas forces tax offset, you can claim <strong>only one</strong> — take whichever is greater.</p>
          </section>

          {/* ── SECTION 5 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What If You Lived in More Than One Zone?</h2>
            <p>The offset <strong>is</strong> apportioned in this case. If one zone accounted for {ZONE_QUALIFYING_DAYS} days or more and it has the highest fixed amount of the places involved, you claim that zone in full and ignore the rest. Otherwise you claim each location as a fraction of {ZONE_QUALIFYING_DAYS} days, starting with the zone that pays most, and capping the total at {ZONE_QUALIFYING_DAYS} days.</p>
            <p>The ATO&rsquo;s worked examples make the two paths concrete:</p>
            <ul>
              <li><strong>Zone A for 190 days, Zone B for 40 days.</strong> Zone A pays more and already exceeds {ZONE_QUALIFYING_DAYS} days, so the claim is the full Zone A amount of {formatAUD(A)}. The Zone B time is ignored.</li>
              <li><strong>Zone A for 100 days, Zone B for 120 days.</strong> Neither reaches {ZONE_QUALIFYING_DAYS}. The claim is 100/{ZONE_QUALIFYING_DAYS} of the Zone A amount plus 83/{ZONE_QUALIFYING_DAYS} of the Zone B amount — the Zone B days are trimmed so the total stops at {ZONE_QUALIFYING_DAYS}.</li>
            </ul>
            <p>The calculator above handles both. Tick &ldquo;I also lived in a second zone&rdquo; and it selects the correct ATO worksheet for you.</p>
          </section>

          {/* ── SECTION 6 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Zone Tax Offset Affect Take-Home Pay?</h2>
            <p>The offset reduces the tax you owe at assessment time. On a {formatAUD(EXAMPLE_SALARY)} salary, a special area resident pays <strong>{formatAUD(SPECIAL)}</strong> less tax than an identical taxpayer in a capital city.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked example: {formatAUD(EXAMPLE_SALARY)} in a special area</h3>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Component</th><th className="px-5 py-3">Without ZTO</th><th className="px-5 py-3">With ZTO (special area)</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Gross salary</td><td className="px-5 py-3">{formatAUD(EXAMPLE_SALARY)}</td><td className="px-5 py-3">{formatAUD(EXAMPLE_SALARY)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Income tax (FY{SITE_CONFIG.financialYear})</td><td className="px-5 py-3">{formatAUD(EXAMPLE_TAX)}</td><td className="px-5 py-3">{formatAUD(EXAMPLE_TAX)}</td></tr>
              <tr><td className="px-5 py-3">Medicare levy</td><td className="px-5 py-3">{formatAUD(EXAMPLE_MEDICARE)}</td><td className="px-5 py-3">{formatAUD(EXAMPLE_MEDICARE)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Zone tax offset</td><td className="px-5 py-3">−{formatAUD(0)}</td><td className="px-5 py-3">−{formatAUD(SPECIAL)}</td></tr>
              <tr><td className="px-5 py-3 font-medium">Total tax payable</td><td className="px-5 py-3 font-medium">{formatAUD(EXAMPLE_TOTAL_TAX)}</td><td className="px-5 py-3 font-medium">{formatAUD(EXAMPLE_TOTAL_TAX_ZTO)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Annual take-home pay</td><td className="px-5 py-3 font-medium">{formatAUD(EXAMPLE_NET)}</td><td className="px-5 py-3 font-medium">{formatAUD(EXAMPLE_NET_ZTO)}</td></tr>
              <tr><td className="px-5 py-3 font-medium">Fortnightly take-home pay</td><td className="px-5 py-3 font-medium">{formatAUD(EXAMPLE_NET / 26)}</td><td className="px-5 py-3 font-medium">{formatAUD(EXAMPLE_NET_ZTO / 26)}</td></tr>
            </tbody></table></div></div>
            <p>That is roughly <strong>{formatAUD(SPECIAL / 26)} a fortnight</strong>. Because the offset is a flat amount rather than a percentage, it is worth proportionally more at lower incomes. Model your own salary with our <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.</p>
          </section>

          {/* ── SECTION 7 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Can FIFO Workers Claim the Zone Tax Offset?</h2>
            <p>Fly-in fly-out workers <strong>cannot claim the zone tax offset</strong> unless their usual place of residence is itself in a zone. The ATO is explicit: &ldquo;You&rsquo;re not eligible if you work in a qualifying remote or isolated area but don&rsquo;t live there.&rdquo;</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Scenario</th><th className="px-5 py-3">Eligible?</th><th className="px-5 py-3">Reason</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Lives in Adelaide, flies to Alice Springs for 12-day shifts</td><td className="px-5 py-3 font-medium">No</td><td className="px-5 py-3">Usual residence is Adelaide, which is not in a zone</td></tr>
              <tr><td className="px-5 py-3">Lives in Darwin, drives to a Zone A special area mine for 14-day shifts</td><td className="px-5 py-3 font-medium">Yes — Zone A</td><td className="px-5 py-3">Usual residence is Darwin, a Zone A location</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Lives in Brisbane, FIFO to a Zone B mine</td><td className="px-5 py-3 font-medium">No</td><td className="px-5 py-3">Usual residence is Brisbane</td></tr>
              <tr><td className="px-5 py-3">Flies in from Auckland, stays in hospital accommodation in Darwin</td><td className="px-5 py-3 font-medium">No</td><td className="px-5 py-3">Usual residence is overseas</td></tr>
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">All four are ATO worked examples.</p></div>
            <p>The indicators the ATO weighs are where your family lives, where you are enrolled to vote, where your belongings are, and where you return after a roster. See our <Link href="/mining-fifo-pay-guide/">mining and FIFO pay guide</Link> for the deductions FIFO workers <em>can</em> claim.</p>
          </section>

          {/* ── SECTION 8 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Towns Are in Each Zone?</h2>
            <p>Zone boundaries are defined in tax law and published by the ATO as a per-state list of locations. A <strong>special area</strong> is one more than 250 km, by the shortest practicable surface route, from the nearest population centre of 2,500 or more people.</p>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy">The zone list changed on <strong>1 July 2026</strong>. Locations widely described elsewhere as Zone B — including <strong>Darwin, Palmerston and Humpty Doo</strong> — are now listed as <strong>Zone A</strong>. Always check the current ATO list rather than an older summary.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Verified examples</h3>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Location</th><th className="px-5 py-3">State</th><th className="px-5 py-3">Zone</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Darwin</td><td className="px-5 py-3">NT</td><td className="px-5 py-3">Zone A</td></tr>
              <tr><td className="px-5 py-3 font-medium">Palmerston</td><td className="px-5 py-3">NT</td><td className="px-5 py-3">Zone A</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Alice Springs</td><td className="px-5 py-3">NT</td><td className="px-5 py-3">Zone A</td></tr>
              <tr><td className="px-5 py-3 font-medium">Katherine</td><td className="px-5 py-3">NT</td><td className="px-5 py-3">Zone A</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Tennant Creek</td><td className="px-5 py-3">NT</td><td className="px-5 py-3">Zone A (special area)</td></tr>
              <tr><td className="px-5 py-3 font-medium">Nhulunbuy (Gove)</td><td className="px-5 py-3">NT</td><td className="px-5 py-3">Zone A (special area)</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Yulara / Uluru</td><td className="px-5 py-3">NT</td><td className="px-5 py-3">Zone A (special area)</td></tr>
              <tr><td className="px-5 py-3 font-medium">Townsville</td><td className="px-5 py-3">QLD</td><td className="px-5 py-3">Zone B</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Longreach</td><td className="px-5 py-3">QLD</td><td className="px-5 py-3">Zone B</td></tr>
              <tr><td className="px-5 py-3 font-medium">Atherton</td><td className="px-5 py-3">QLD</td><td className="px-5 py-3">Zone B</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Normanton</td><td className="px-5 py-3">QLD</td><td className="px-5 py-3">Zone A (special area)</td></tr>
              <tr><td className="px-5 py-3 font-medium">Thursday Island</td><td className="px-5 py-3">QLD</td><td className="px-5 py-3">Zone A (special area)</td></tr>
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Verified against the ATO <a href={ZONE_LIST_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">Australian zone list</a>, last updated 1 July 2026.</p></div>

            <p>There are no zone locations in the Australian Capital Territory or Victoria. For every other state, check the ATO list directly: <a href={`${ZONE_LIST_URL}/new-south-wales`} target="_blank" rel="noopener noreferrer">New South Wales</a>, <a href={`${ZONE_LIST_URL}/northern-territory`} target="_blank" rel="noopener noreferrer">Northern Territory</a>, <a href={`${ZONE_LIST_URL}/queensland`} target="_blank" rel="noopener noreferrer">Queensland</a>, <a href={`${ZONE_LIST_URL}/south-australia`} target="_blank" rel="noopener noreferrer">South Australia</a>, <a href={`${ZONE_LIST_URL}/tasmania`} target="_blank" rel="noopener noreferrer">Tasmania</a> and <a href={`${ZONE_LIST_URL}/western-australia`} target="_blank" rel="noopener noreferrer">Western Australia</a>. Work out take-home pay for these regions with our <Link href="/pay-calculator-nt/">NT</Link>, <Link href="/pay-calculator-wa/">WA</Link> and <Link href="/pay-calculator-qld/">QLD</Link> pay calculators.</p>
          </section>

          {/* ── SECTION 9 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Zone Tax Offset Interact with Other Offsets?</h2>
            <p>The zone tax offset stacks with other non-refundable offsets, including the <Link href="/low-income-tax-offset/">Low Income Tax Offset</Link>. Together they reduce your tax payable, but never below zero — any excess is lost rather than refunded or carried forward.</p>
            <p>Two interactions are worth knowing. A <strong>remote area allowance</strong> from Centrelink or DVA reduces your zone offset dollar for dollar. And the zone tax offset itself is <strong>not assessable income for Centrelink purposes</strong>, so claiming it does not affect your payments.</p>
            <p>You cannot claim both the zone tax offset and the overseas forces tax offset — if you qualify for both, claim the larger.</p>
          </section>

          {/* ── SECTION 10 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Records Do You Need?</h2>
            <p>You must be able to show your usual place of residence was in the zone for the days you claim. The ATO does not want documents with your return, but you must produce them if asked.</p>
            <ul>
              <li><strong>Property records</strong> — lease, mortgage statement or council rates notice at the zone address</li>
              <li><strong>Utility bills</strong> — electricity, water, gas or internet at that address</li>
              <li><strong>Electoral enrolment</strong> and <strong>vehicle registration</strong> showing the zone address</li>
              <li><strong>School enrolment</strong> for children at a zone-area school</li>
            </ul>
            <p>You will also need the adjusted taxable income of any dependent children or students, and the amount of any remote area allowance. Keep records for five years from lodgement. Our <Link href="/understanding-your-payslip/">payslip guide</Link> explains which fields to check.</p>
          </section>

          {/* ── SECTION 11 ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
            <ul>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> — net pay after income tax, Medicare levy, super and HECS-HELP</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — your liability across the current brackets</li>
              <li><Link href="/low-income-tax-offset/">Low Income Tax Offset Guide</Link> — the other offset most zone residents claim</li>
              <li><Link href="/tax-brackets/">Australian Tax Brackets</Link> — the full marginal rate table</li>
              <li><Link href="/mining-fifo-pay-guide/">Mining &amp; FIFO Pay Guide</Link> — what FIFO workers can claim instead</li>
              <li><Link href="/pay-calculator-nt/">NT Pay Calculator</Link> and <Link href="/pay-calculator-wa/">WA Pay Calculator</Link></li>
            </ul>
          </section>

          {/* ── SECTION 12: FAQs ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>

            {/* Crawlable copy — the Radix accordion below unmounts closed content. */}
            <div className="sr-only">
              <h3>Zone tax offset questions and answers</h3>
              {ZONE_FAQS.map((f) => (
                <div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>
              ))}
            </div>

            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              {ZONE_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this calculator works"><p>Offset amounts and the calculation method are taken from ATO question T4 Zone or overseas forces 2026 (QC106871), worksheets 4 to 7, and the ATO zone tax offset page (QC105018). They apply to the {ZONE_OFFSET_INCOME_YEAR} income year — the return being lodged now. The ATO has not yet published zone amounts for FY{SITE_CONFIG.financialYear}; when it does, this page will be updated. Income tax and Medicare levy in the worked example are computed from the site&rsquo;s FY{SITE_CONFIG.financialYear} engine, not hardcoded. The invalid and invalid carer offset is taken as an input, exactly as ATO worksheet 4 row f does.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("zone-tax-offset"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/pay-calculator-nt/" label="NT Pay Calculator" /><SidebarLink href="/pay-calculator-wa/" label="WA Pay Calculator" /><SidebarLink href="/low-income-tax-offset/" label="LITO Guide" /><SidebarLink href="/tax-brackets/" label="Australian Tax Brackets" /><SidebarLink href="/mining-fifo-pay-guide/" label="Mining & FIFO Pay Guide" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}


function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
