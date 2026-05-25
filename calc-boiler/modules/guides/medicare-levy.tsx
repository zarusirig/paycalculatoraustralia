import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  MEDICARE_LEVY,
  SOURCES,
  SITE_CONFIG,
  formatAUD,
  formatPercent,
  annualToWeekly,
} from "@/lib/constants";

const SOURCES_LIST: SourceLink[] = [
  { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: SOURCES.ato.name },
  { title: "Medicare levy surcharge", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge", publisher: SOURCES.ato.name },
  { title: "Medicare levy reduction", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction", publisher: SOURCES.ato.name },
];

export default function MedicareLevyGuidePage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Medicare Levy</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Medicare Levy 2025-26 — Rate, Surcharge &amp; Exemptions
          </h1>

          {/* DIRECT-ANSWER BLOCK (featured snippet target) */}
          <div className="mb-6">
            <p className="text-lg text-navy leading-relaxed mb-5 border-l-4 border-eucalyptus pl-4 bg-white/60 py-2 rounded-r-md">
              The standard Medicare Levy is <strong>2% of your taxable income</strong>. It applies if you earn above <strong>$26,000</strong> (single, FY2025-26), with a phase-in between $26,000 and $32,500. Above <strong>$97,000</strong> (single) you may also pay a 1–1.5% Medicare Levy Surcharge unless you hold private hospital cover.
            </p>

            <h2 className="text-base font-bold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Medicare Levy by taxable income (2025-26, single, no MLS)</h2>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Medicare Levy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className="px-4 py-3 font-medium text-navy">$26,000</td><td className="px-4 py-3 text-right text-navy">$0</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">$30,000</td><td className="px-4 py-3 text-right text-navy">$400</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">$32,500</td><td className="px-4 py-3 text-right text-navy">$650</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">$40,000</td><td className="px-4 py-3 text-right text-navy">$800</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">$60,000</td><td className="px-4 py-3 text-right text-navy">$1,200</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">$80,000</td><td className="px-4 py-3 text-right text-navy">$1,600</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">$100,000</td><td className="px-4 py-3 text-right text-navy">$2,000</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-lg text-warmgray">
            The Medicare levy is a {formatPercent(MEDICARE_LEVY.rate, 0)} charge on your taxable income that helps fund Australia&apos;s public healthcare system. Most resident taxpayers pay it. Here&apos;s how it works, who&apos;s exempt, and how the surcharge applies.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* What Is the Medicare Levy? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Medicare Levy?</h2>
          <p className="mb-4 text-warmgray">
            The Medicare levy is a <strong>{formatPercent(MEDICARE_LEVY.rate, 0)} tax on assessable income</strong> that funds Medicare, Australia&apos;s universal public healthcare system.
          </p>
          <p className="mb-4 text-warmgray">
            Almost every Australian resident for tax purposes pays the Medicare levy. It covers bulk-billed doctor visits, public hospital treatment, and subsidised prescription medicines through the Pharmaceutical Benefits Scheme (PBS). The levy is calculated on your taxable income and collected through the PAYG withholding system, meaning your employer deducts it from each pay cycle alongside your{" "}
            <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">income tax</Link>.
          </p>
          <p className="mb-4 text-warmgray">
            The Medicare levy applies in addition to income tax brackets. A taxpayer earning $100,000 pays income tax based on the standard marginal rates plus a separate {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy of <strong>{formatAUD(Math.round(100000 * MEDICARE_LEVY.rate))}</strong>. The levy does not replace any part of income tax. It is a flat-rate charge with no marginal tiers, unlike the progressive income tax system.
          </p>
          <p className="text-warmgray">
            Three groups pay less than the standard rate: low-income earners below the reduction threshold, non-residents who are not entitled to Medicare benefits, and holders of specific Medicare exemption certificates. A separate &quot;Medicare Levy Surcharge&quot; applies to higher earners without private hospital cover.
          </p>
        </section>

        {/* How Much Is the Medicare Levy? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Is the Medicare Levy?</h2>
          <p className="mb-4 text-warmgray">
            The Medicare levy is <strong>{formatPercent(MEDICARE_LEVY.rate, 0)} of your taxable income</strong> for FY2025-26, with no upper cap.
          </p>
          <p className="mb-4 text-warmgray">
            The {formatPercent(MEDICARE_LEVY.rate, 0)} rate has remained unchanged since 2014. It applies to your entire taxable income once you exceed the low-income threshold of {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}. Unlike income tax, there are no escalating brackets — every dollar of taxable income attracts the same {formatPercent(MEDICARE_LEVY.rate, 0)} charge. This makes the Medicare levy calculation straightforward: multiply your taxable income by {MEDICARE_LEVY.rate}. Use our{" "}
            <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">take-home pay calculator</Link> to see the exact Medicare levy amount separated from your income tax.
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Medicare Levy ({formatPercent(MEDICARE_LEVY.rate, 0)})</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Per Week</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {[40_000, 60_000, 80_000, 100_000, 120_000, 150_000].map((s) => {
                  const levy = Math.round(s * MEDICARE_LEVY.rate);
                  return (
                    <tr key={s} className="hover:bg-sandstone">
                      <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                      <td className="px-4 py-3 text-right text-navy">{formatAUD(levy)}</td>
                      <td className="px-4 py-3 text-right text-warmgray-light">{formatAUD(annualToWeekly(levy), 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">
            The Medicare levy is calculated on taxable income, which equals gross income minus allowable deductions. Salary sacrifice arrangements that reduce taxable income also reduce the Medicare levy.
          </p>
        </section>

        {/* Who Is Exempt from the Medicare Levy? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Is Exempt from the Medicare Levy?</h2>
          <p className="mb-3 text-warmgray">
            <strong>Non-residents, certain visa holders, and members of foreign defence forces</strong> are fully exempt from the Medicare levy for the period they are not entitled to Medicare benefits.
          </p>
          <p className="mb-3 text-warmgray">Exemptions fall into four categories recognised by the ATO:</p>
          <ul className="list-disc pl-6 space-y-2 text-warmgray">
            <li><strong>Full-year non-residents</strong> — taxpayers who are not Australian residents for tax purposes for the entire financial year pay no Medicare levy, as they have no access to Medicare services</li>
            <li><strong>Part-year residents</strong> — the levy applies only to income earned during the period of Australian residency; the low-income threshold is proportionally reduced</li>
            <li><strong>Specific visa holders</strong> — temporary residents on visas that do not confer Medicare eligibility (such as subclass 457/482 holders from non-reciprocal countries) can apply for a &quot;Medicare Levy Exemption Certificate&quot; through Services Australia</li>
            <li><strong>Foreign defence force members</strong> — personnel serving in a foreign military force who are not entitled to Medicare benefits</li>
          </ul>
          <p className="mt-3 text-warmgray">
            Citizens of countries with reciprocal healthcare agreements — the United Kingdom, New Zealand, Ireland, Sweden, the Netherlands, Finland, Italy, Belgium, Slovenia, and Norway — are entitled to Medicare and therefore pay the levy. You claim exemptions when lodging your tax return. See our{" "}
            <Link href="/non-resident-tax/" className="text-eucalyptus-dark hover:underline font-medium">non-resident tax guide</Link> for a full explanation of residency rules.
          </p>
        </section>

        {/* What Is the Medicare Levy Surcharge? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Medicare Levy Surcharge?</h2>
          <p className="mb-4 text-warmgray">
            The &quot;Medicare Levy Surcharge&quot; (MLS) is an <strong>additional charge of 1% to 1.5%</strong> on top of the standard 2% Medicare levy, payable by higher-income earners who do not hold compliant private hospital cover.
          </p>
          <p className="mb-4 text-warmgray">
            The MLS uses &quot;income for MLS purposes,&quot; which includes taxable income, reportable fringe benefits, total net investment loss (including negative gearing), and reportable super contributions. This broader income base means some taxpayers who appear below the threshold on taxable income alone still trigger the surcharge.
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Income (Singles)</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Income (Families)</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">MLS Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Cost at Mid-Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">$0 – $93,000</td>
                  <td className="px-4 py-3 text-navy">$0 – $186,000</td>
                  <td className="px-4 py-3 text-right font-medium text-navy">0%</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">$0</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">{formatAUD(MEDICARE_LEVY.surcharge.tier1.min)} – {formatAUD(MEDICARE_LEVY.surcharge.tier1.max)}</td>
                  <td className="px-4 py-3 text-navy">$186,001 – $216,000</td>
                  <td className="px-4 py-3 text-right font-medium text-navy">{formatPercent(MEDICARE_LEVY.surcharge.tier1.rate)}</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">{formatAUD(Math.round(100000 * MEDICARE_LEVY.surcharge.tier1.rate))}/yr</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">{formatAUD(MEDICARE_LEVY.surcharge.tier2.min)} – {formatAUD(MEDICARE_LEVY.surcharge.tier2.max)}</td>
                  <td className="px-4 py-3 text-navy">$216,001 – $288,000</td>
                  <td className="px-4 py-3 text-right font-medium text-navy">{formatPercent(MEDICARE_LEVY.surcharge.tier2.rate)}</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">{formatAUD(Math.round(125000 * MEDICARE_LEVY.surcharge.tier2.rate))}/yr</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">{formatAUD(MEDICARE_LEVY.surcharge.tier3.min)}+</td>
                  <td className="px-4 py-3 text-navy">$288,001+</td>
                  <td className="px-4 py-3 text-right font-medium text-navy">{formatPercent(MEDICARE_LEVY.surcharge.tier3.rate)}</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">{formatAUD(Math.round(180000 * MEDICARE_LEVY.surcharge.tier3.rate))}/yr</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-warmgray">
            Family thresholds increase by <strong>$1,500 for each dependent child</strong> after the first. A family with 2 children has a Tier 1 threshold of $187,501 instead of $186,001. The surcharge is calculated on total income for MLS purposes, not just salary.
          </p>
        </section>

        {/* How to Avoid the Medicare Levy Surcharge */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Do You Avoid the Medicare Levy Surcharge?</h2>
          <p className="mb-4 text-warmgray">
            Holding compliant private hospital cover for the full financial year <strong>eliminates the MLS entirely</strong>, regardless of income level.
          </p>
          <p className="mb-3 text-warmgray">The cover must meet three requirements to be MLS-compliant:</p>
          <ol className="list-decimal pl-6 space-y-2 text-warmgray">
            <li><strong>Hospital cover</strong> — extras-only policies do not satisfy the MLS requirement; the policy must include hospital treatment</li>
            <li><strong>Excess cap</strong> — the policy excess (also called the &quot;front-end deductible&quot;) must be $750 or less for singles or $1,500 or less for couples and families</li>
            <li><strong>Full-year coverage</strong> — the policy must be held for the entire financial year, or for the full period you are an Australian resident; gaps of even a single day can trigger a pro-rata MLS charge</li>
          </ol>
          <p className="mt-4 text-warmgray">
            A basic hospital policy from a registered health fund typically costs <strong>$1,200 to $1,800 per year</strong> for singles. On a $150,000 salary, the MLS costs {formatAUD(Math.round(150000 * MEDICARE_LEVY.surcharge.tier2.rate))} per year — making private cover the cheaper option in most cases. Consider using a{" "}
            <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">salary sacrifice calculator</Link> to explore pre-tax health insurance arrangements that further reduce your taxable income.
          </p>

          <h3 className="text-lg font-semibold text-navy mt-6 mb-2">What Happens if You Have Cover for Only Part of the Year?</h3>
          <p className="text-warmgray">
            The ATO calculates the MLS on a daily basis. Holding cover for 300 out of 365 days means you pay the surcharge for the remaining <strong>65 days</strong>. The calculation is: (days without cover / 365) x annual MLS amount. Starting or cancelling a policy mid-year triggers a pro-rata charge for the uncovered period.
          </p>
        </section>

        {/* Medicare Levy Reduction for Low Income Earners */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Medicare Levy Reduction for Low-Income Earners?</h2>
          <p className="mb-4 text-warmgray">
            Taxpayers earning below <strong>{formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}</strong> pay no Medicare levy at all for FY2025-26, and a reduced levy applies up to $34,028.
          </p>
          <p className="mb-4 text-warmgray">
            The reduction phases in at 10 cents for every dollar of taxable income above the threshold. This means the levy gradually increases from $0 at {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} until it equals the standard {formatPercent(MEDICARE_LEVY.rate, 0)} charge at $34,028. The formula is: Medicare levy = 10% x (taxable income - {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}).
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Category</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">No Levy Below</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Full Levy Above</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Phase-In Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">Singles</td>
                  <td className="px-4 py-3 text-right text-navy">{formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}</td>
                  <td className="px-4 py-3 text-right text-navy">$34,028</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">10%</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">Families (no children)</td>
                  <td className="px-4 py-3 text-right text-navy">$45,924</td>
                  <td className="px-4 py-3 text-right text-navy">$57,406</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">10%</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">Families (per child add)</td>
                  <td className="px-4 py-3 text-right text-navy">+$4,213</td>
                  <td className="px-4 py-3 text-right text-navy">+$5,266</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">10%</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">Seniors &amp; pensioners (singles)</td>
                  <td className="px-4 py-3 text-right text-navy">$43,020</td>
                  <td className="px-4 py-3 text-right text-navy">$53,776</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">10%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">
            These thresholds are adjusted annually by the ATO. The family threshold increases by $4,213 for each dependent child or student after the first. The &quot;Low Income Tax Offset&quot; (LITO) is a separate concession — see our{" "}
            <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline font-medium">low-income tax offset guide</Link> for details on how LITO interacts with income tax.
          </p>
        </section>

        {/* Worked Example at $85,000 */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Medicare Levy Do You Pay on $85,000?</h2>
          <p className="mb-4 text-warmgray">
            An employee earning <strong>$85,000</strong> per year pays a Medicare levy of <strong>{formatAUD(Math.round(85000 * MEDICARE_LEVY.rate))}</strong>, which equals <strong>{formatAUD(annualToWeekly(Math.round(85000 * MEDICARE_LEVY.rate)), 2)} per week</strong>.
          </p>
          <p className="mb-3 text-warmgray">Here is the full pay breakdown for an $85,000 salary in FY2025-26:</p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Component</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Annual</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Weekly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">Gross salary</td>
                  <td className="px-4 py-3 text-right text-navy">$85,000</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">$1,634.62</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">Income tax</td>
                  <td className="px-4 py-3 text-right text-navy">-$16,288</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">-$313.23</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">Medicare levy ({formatPercent(MEDICARE_LEVY.rate, 0)})</td>
                  <td className="px-4 py-3 text-right text-navy">-{formatAUD(Math.round(85000 * MEDICARE_LEVY.rate))}</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">-{formatAUD(annualToWeekly(Math.round(85000 * MEDICARE_LEVY.rate)), 2)}</td>
                </tr>
                <tr className="hover:bg-sandstone bg-sandstone/50">
                  <td className="px-4 py-3 font-semibold text-navy">Take-home pay</td>
                  <td className="px-4 py-3 text-right font-semibold text-navy">$67,012</td>
                  <td className="px-4 py-3 text-right font-semibold text-warmgray-light">$1,288.69</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">Super (SG at 12%)</td>
                  <td className="px-4 py-3 text-right text-navy">$10,200</td>
                  <td className="px-4 py-3 text-right text-warmgray-light">$196.15</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-warmgray">
            The {formatAUD(Math.round(85000 * MEDICARE_LEVY.rate))} Medicare levy represents <strong>{formatPercent(MEDICARE_LEVY.rate, 0)}</strong> of the $85,000 taxable income. Combined with income tax of $16,288, the total tax burden is $18,288 — an effective tax rate of <strong>21.5%</strong>. The LITO does not apply at this income level because it phases out completely above $66,667. The employer pays an additional $10,200 in superannuation guarantee contributions on top. Use our{" "}
            <Link href="/" className="text-eucalyptus-dark hover:underline font-medium">Australian tax calculator</Link> to calculate your exact take-home pay at any salary.
          </p>

          <h3 className="text-lg font-semibold text-navy mt-6 mb-2">How the Calculation Works Step by Step</h3>
          <ol className="list-decimal pl-6 space-y-2 text-warmgray">
            <li>Start with gross taxable income: <strong>$85,000</strong></li>
            <li>Check the low-income threshold: $85,000 exceeds {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}, so the full levy applies</li>
            <li>Multiply by the levy rate: $85,000 x {MEDICARE_LEVY.rate} = <strong>{formatAUD(Math.round(85000 * MEDICARE_LEVY.rate))}</strong></li>
            <li>Check the MLS: $85,000 is below {formatAUD(MEDICARE_LEVY.surcharge.tier1.min)}, so no surcharge applies</li>
            <li>Total Medicare cost: <strong>{formatAUD(Math.round(85000 * MEDICARE_LEVY.rate))} per year</strong> ({formatAUD(annualToWeekly(Math.round(85000 * MEDICARE_LEVY.rate)), 2)} per week)</li>
          </ol>
        </section>

        {/* Medicare Levy vs Private Health Insurance */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Medicare Levy vs Private Health Insurance — Which Costs More?</h2>
          <p className="mb-4 text-warmgray">
            The standard {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy is <strong>not avoidable</strong> by holding private health insurance — everyone pays it. Private cover only eliminates the additional Medicare Levy Surcharge.
          </p>
          <p className="mb-4 text-warmgray">
            The financial comparison between paying the MLS and buying private hospital cover depends on your income tier. The table below compares the annual MLS cost against a typical basic hospital policy at each tier.
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Income (Singles)</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Annual MLS Cost</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Basic Hospital Policy</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Saving with Cover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">$93,001 (Tier 1 entry)</td>
                  <td className="px-4 py-3 text-right text-navy">$930</td>
                  <td className="px-4 py-3 text-right text-navy">~$1,400</td>
                  <td className="px-4 py-3 text-right text-red-600">-$470</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">$108,000 (Tier 1 max)</td>
                  <td className="px-4 py-3 text-right text-navy">$1,080</td>
                  <td className="px-4 py-3 text-right text-navy">~$1,400</td>
                  <td className="px-4 py-3 text-right text-red-600">-$320</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">$130,000 (Tier 2 mid)</td>
                  <td className="px-4 py-3 text-right text-navy">$1,625</td>
                  <td className="px-4 py-3 text-right text-navy">~$1,400</td>
                  <td className="px-4 py-3 text-right text-green-700">+$225</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">$150,000 (Tier 3 entry)</td>
                  <td className="px-4 py-3 text-right text-navy">{formatAUD(Math.round(150000 * MEDICARE_LEVY.surcharge.tier3.rate))}</td>
                  <td className="px-4 py-3 text-right text-navy">~$1,400</td>
                  <td className="px-4 py-3 text-right text-green-700">+$850</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">$200,000</td>
                  <td className="px-4 py-3 text-right text-navy">{formatAUD(Math.round(200000 * MEDICARE_LEVY.surcharge.tier3.rate))}</td>
                  <td className="px-4 py-3 text-right text-navy">~$1,400</td>
                  <td className="px-4 py-3 text-right text-green-700">+$1,600</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-warmgray">
            The crossover point is approximately <strong>$120,000</strong>. Below that income, the MLS costs less than a basic hospital policy. Above $120,000, buying private cover saves money and provides hospital benefits. At $200,000, the saving is approximately <strong>$1,600 per year</strong> plus access to private hospital treatment, shorter waiting lists, and choice of doctor.
          </p>

          <h3 className="text-lg font-semibold text-navy mt-6 mb-2">Does Private Health Insurance Replace the Medicare Levy?</h3>
          <p className="text-warmgray">
            No. The standard {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy applies to all Australian residents regardless of private health insurance status. Private cover only removes the <strong>additional</strong> MLS (1% to 1.5%). On a $150,000 salary, you pay the {formatAUD(Math.round(150000 * MEDICARE_LEVY.rate))} Medicare levy either way. The difference is whether you also pay the {formatAUD(Math.round(150000 * MEDICARE_LEVY.surcharge.tier3.rate))} surcharge or a ~$1,400 hospital policy instead.
          </p>
        </section>

        {/* Medicare Levy on Your Payslip */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does the Medicare Levy Appear on Your Payslip?</h2>
          <p className="mb-3 text-warmgray">
            The Medicare levy is <strong>bundled into your PAYG withholding</strong> — it does not appear as a separate line item on most payslips.
          </p>
          <p className="mb-3 text-warmgray">
            Your employer uses the ATO&apos;s PAYG withholding tax tables, which already incorporate the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy into the total &quot;tax withheld&quot; amount. The figure shown as &quot;tax&quot; on your payslip includes both income tax and the Medicare levy combined. For example, on an $80,000 salary, approximately {formatAUD(Math.round(80000 * MEDICARE_LEVY.rate))} of your total PAYG withholding is the Medicare levy ({formatAUD(annualToWeekly(Math.round(80000 * MEDICARE_LEVY.rate)), 2)} per week).
          </p>
          <p className="mb-3 text-warmgray">
            The MLS is handled differently. If you do not have private hospital cover and your income exceeds {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}, the ATO calculates the surcharge at tax return time. Your employer does not withhold the MLS during the year unless you specifically request an upward variation to your PAYG withholding. See our{" "}
            <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline font-medium">payslip guide</Link> for a full explanation of each line item.
          </p>

          <h3 className="text-lg font-semibold text-navy mt-6 mb-2">Can You Get a Medicare Levy Refund?</h3>
          <p className="text-warmgray">
            Yes. If your employer withheld the Medicare levy throughout the year but you are entitled to a reduction (low income) or exemption (non-resident or specific visa), the ATO refunds the excess when you lodge your tax return. The refund appears as part of your overall tax refund or reduced tax debt. Use our{" "}
            <Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline font-medium">tax return calculator</Link> to estimate your refund amount.
          </p>
        </section>

        {/* What Changed in FY2025-26? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Changed for the Medicare Levy in FY2025-26?</h2>
          <p className="mb-4 text-warmgray">
            The Medicare levy rate remains at <strong>{formatPercent(MEDICARE_LEVY.rate, 0)}</strong> for FY2025-26. The low-income thresholds increased to reflect CPI indexation.
          </p>
          <p className="mb-3 text-warmgray">Key changes for the 2025-26 financial year:</p>
          <ul className="list-disc pl-6 space-y-2 text-warmgray">
            <li><strong>Singles low-income threshold</strong> increased to {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} (from $26,000 in FY2024-25)</li>
            <li><strong>Family threshold</strong> increased to $45,924 (from $43,846 in FY2024-25), plus $4,213 per dependent child</li>
            <li><strong>Seniors and pensioners threshold</strong> increased to $43,020 (from $41,089 in FY2024-25)</li>
            <li><strong>MLS income tiers</strong> remain unchanged — Tier 1 starts at {formatAUD(MEDICARE_LEVY.surcharge.tier1.min)}</li>
            <li><strong>Stage 3 tax cuts</strong> from 1 July 2024 reduced income tax but did not change the Medicare levy rate; the combined effective tax rate is lower for incomes between $45,001 and $200,000</li>
          </ul>
          <p className="mt-3 text-warmgray">
            The threshold increases mean approximately <strong>80,000 additional low-income taxpayers</strong> pay no Medicare levy or a reduced levy compared to the prior year. The standard {formatPercent(MEDICARE_LEVY.rate, 0)} rate has not changed since 1 July 2014 and no legislation is currently before Parliament to alter it. See our{" "}
            <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline font-medium">tax brackets guide</Link> for the full FY2025-26 income tax rate schedule.
          </p>

          <h3 className="text-lg font-semibold text-navy mt-6 mb-2">Medicare Levy Rate History</h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Period</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Rate</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">1984 – 1986</td>
                  <td className="px-4 py-3 text-right text-navy">1.0%</td>
                  <td className="px-4 py-3 text-warmgray-light">Medicare introduced 1 February 1984</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">1986 – 1995</td>
                  <td className="px-4 py-3 text-right text-navy">1.25%</td>
                  <td className="px-4 py-3 text-warmgray-light">First increase</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">1995 – 2014</td>
                  <td className="px-4 py-3 text-right text-navy">1.5%</td>
                  <td className="px-4 py-3 text-warmgray-light">Second increase</td>
                </tr>
                <tr className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">2014 – present</td>
                  <td className="px-4 py-3 text-right text-navy">2.0%</td>
                  <td className="px-4 py-3 text-warmgray-light">Increased to fund NDIS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Resources */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Resources</h2>
          <p className="mb-4 text-warmgray">
            The Medicare levy interacts with several other Australian tax and payroll obligations. These calculators and guides provide detailed breakdowns of each component.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-warmgray">
            <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> — calculate your income tax separately from the Medicare levy using current FY2025-26 brackets</li>
            <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> — see your after-tax income with Medicare levy, HECS-HELP, and super broken out as separate line items</li>
            <li><Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline font-medium">Tax Brackets Guide</Link> — full FY2025-26 marginal tax rate table including effective rates at each income level</li>
            <li><Link href="/superannuation-guide/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Guide</Link> — understand the 12% SG rate, concessional caps, and how super interacts with your take-home pay</li>
            <li><Link href="/salary-sacrifice-guide/" className="text-eucalyptus-dark hover:underline font-medium">Salary Sacrifice Guide</Link> — reduce your taxable income and Medicare levy through pre-tax salary packaging arrangements</li>
            <li><Link href="/hecs-help-guide/" className="text-eucalyptus-dark hover:underline font-medium">HECS-HELP Guide</Link> — repayment thresholds and how HECS interacts with Medicare levy and income tax withholding</li>
          </ul>
        </section>

        <MethodologyDisclosure>
          <ol className="list-decimal space-y-1 pl-4">
            <li>Medicare levy = taxable income × {formatPercent(MEDICARE_LEVY.rate, 0)}.</li>
            <li>Low-income reduction applies below ~{formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}.</li>
            <li>MLS applies on top if no private health insurance and income above {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}.</li>
          </ol>
        </MethodologyDisclosure>

        {/* FAQ */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="included" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Is the Medicare levy included in the tax tables?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Yes, for PAYG withholding purposes. The ATO&apos;s withholding tax tables used by employers incorporate the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy into the &quot;tax withheld&quot; amount. However, when you see <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link> on the ATO website, they show income tax only — without the levy. Your total effective tax rate is your income tax rate plus {formatPercent(MEDICARE_LEVY.rate, 0)}.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="optout" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Can I opt out of paying the Medicare levy?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. The Medicare levy is mandatory for all Australian residents for tax purposes, regardless of whether you use public healthcare. The only way to avoid it entirely is to be classified as a non-resident for tax purposes, hold an eligible visa exemption, or earn below the low-income threshold of {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}. Having private health insurance does not remove the standard {formatPercent(MEDICARE_LEVY.rate, 0)} levy.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="difference" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Is the Medicare levy the same as the Medicare Levy Surcharge?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. The Medicare levy ({formatPercent(MEDICARE_LEVY.rate, 0)}) applies to nearly all residents regardless of income or insurance status. The &quot;Medicare Levy Surcharge&quot; (1% to 1.5%) is a separate, additional charge that applies only to higher-income earners ({formatAUD(MEDICARE_LEVY.surcharge.tier1.min)}+ for singles, $186,001+ for families) who do not hold compliant private hospital cover. You can owe both simultaneously.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="part-year" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Do I pay Medicare levy for a part year?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">If you are an Australian resident for only part of the financial year (for example, arriving on a permanent visa mid-year), the Medicare levy applies to income earned during your period of residency. The low-income threshold is also reduced proportionally based on the number of days you were a resident. Non-residents pay no Medicare levy for any period of non-residency.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="temp-resident" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Are temporary residents exempt from the Medicare levy?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">It depends on your visa type and country of origin. Temporary residents from reciprocal healthcare agreement countries (including the UK, New Zealand, Ireland, Sweden, the Netherlands, Finland, Italy, Belgium, Slovenia, and Norway) are entitled to Medicare and pay the levy. Temporary residents from non-reciprocal countries can apply for a Medicare Levy Exemption Certificate through Services Australia to claim an exemption when lodging their tax return.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-calculated" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>How is the Medicare levy calculated?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The Medicare levy is {formatPercent(MEDICARE_LEVY.rate, 0)} of your taxable income — a flat rate with no tiers. On $100,000, the levy is {formatAUD(Math.round(100000 * MEDICARE_LEVY.rate))} ({formatAUD(annualToWeekly(Math.round(100000 * MEDICARE_LEVY.rate)), 2)} per week). It is calculated on taxable income after deductions, not gross salary. If your taxable income falls below {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}, you pay no levy; between {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} and $34,028, a reduced rate phases in at 10 cents per dollar above the threshold.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="salary-sacrifice" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Does salary sacrifice reduce my Medicare levy?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Yes. Salary sacrifice into superannuation reduces your taxable income, and the Medicare levy is calculated on taxable income. Sacrificing $10,000 on a $100,000 salary lowers your taxable income to $90,000 and your Medicare levy from {formatAUD(Math.round(100000 * MEDICARE_LEVY.rate))} to {formatAUD(Math.round(90000 * MEDICARE_LEVY.rate))} — a saving of <strong>{formatAUD(Math.round(10000 * MEDICARE_LEVY.rate))}</strong>. However, reportable super contributions are included in &quot;income for MLS purposes,&quot; so salary sacrifice does not reduce the Medicare Levy Surcharge calculation.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="hecs-interaction" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Does the Medicare levy affect my HECS-HELP repayments?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. HECS-HELP repayments are calculated on &quot;HELP repayment income,&quot; which is a separate measure from taxable income. The Medicare levy does not increase or decrease your HECS repayment obligation. Both are deducted through the PAYG withholding system, but they are independent calculations. On an $85,000 salary, you pay {formatAUD(Math.round(85000 * MEDICARE_LEVY.rate))} in Medicare levy and a separate HECS repayment based on the applicable marginal rate.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="family-threshold" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>How does the family threshold for the Medicare levy work?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The family threshold uses the combined taxable income of both spouses. For FY2025-26, families with a combined income below <strong>$45,924</strong> pay no Medicare levy. The threshold increases by $4,213 for each dependent child or student after the first. A family with 3 children has a threshold of $45,924 + (2 x $4,213) = <strong>$54,350</strong>. If the combined income exceeds the threshold, the levy phases in at 10% of the excess until it reaches the standard {formatPercent(MEDICARE_LEVY.rate, 0)} rate.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="mls-income" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>What income counts towards the Medicare Levy Surcharge?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The MLS uses &quot;income for MLS purposes,&quot; which is broader than taxable income. It includes taxable income, reportable fringe benefits (grossed up), total net investment loss (including negative gearing losses), and reportable superannuation contributions. This means salary sacrifice into super does not reduce your MLS income. A taxpayer with $80,000 taxable income, $10,000 in reportable super contributions, and $5,000 in net investment losses has an MLS income of <strong>$95,000</strong> — above the {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} threshold.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="private-cover-timing" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>When do I need private health insurance to avoid the MLS?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">You need compliant private hospital cover for the entire financial year (1 July to 30 June) to fully avoid the MLS. The ATO calculates the surcharge on a daily basis. If you take out cover partway through the year, you pay the MLS for each day you were uncovered. Starting a policy on 1 October means you are liable for 92 days of surcharge (1 July to 30 September). The most cost-effective approach is to take out cover before 1 July if your income is likely to exceed {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="ndis" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Does the Medicare levy fund the NDIS?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Partially. The Medicare levy increased from 1.5% to {formatPercent(MEDICARE_LEVY.rate, 0)} on 1 July 2014 specifically to help fund the &quot;National Disability Insurance Scheme&quot; (NDIS). The additional 0.5% is sometimes referred to as the &quot;NDIS levy,&quot; but it is not a separate line item — it is incorporated into the standard {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy. Revenue from the levy goes into general consolidated revenue, with NDIS funding allocated through the federal budget.</p></AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA */}
        <section className="bg-sandstone rounded-2xl p-8 text-center">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Calculate your take-home pay including Medicare</h2>
          <p className="text-warmgray mb-6 max-w-lg mx-auto">See your full pay breakdown with income tax, Medicare levy, HECS, and super.</p>
          <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Pay Calculator →</Link>
        </section>

        <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("medicare-levy"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
      </div>
    </div>
  );
}
