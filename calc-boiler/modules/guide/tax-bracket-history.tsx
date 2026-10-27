import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import { TAX_BRACKETS_2023_24, TAX_BRACKETS_2025_26, TAX_BRACKETS_2026_27, type TaxBracket } from "@/lib/constants/australian-tax";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FaqAccordion from "@/components/common/faq-accordion";
import { TAX_BRACKET_HISTORY_FAQS } from "./tax-bracket-history-faqs";
import FeaturedImage from "@/components/common/featured-image";

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates for Australian residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Stage 3 Personal Income Tax Plan", url: "https://treasury.gov.au/tax-cuts", publisher: "Australian Treasury" },
  { title: "Low and middle income earner tax offsets", url: "https://www.ato.gov.au/forms-and-instructions/low-and-middle-income-earner-tax-offsets", publisher: SOURCES.ato.name },
];

const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;
const OLD = TAX_BRACKETS_2023_24;
const S3 = TAX_BRACKETS_2025_26;
const NOW = TAX_BRACKETS_2026_27;

function rows(scale: readonly TaxBracket[]) {
  return scale.map((b) => ({
    bracket: b.max === Infinity ? `${formatAUD(b.min)}+` : `${formatAUD(b.min)} \u2013 ${formatAUD(b.max)}`,
    rate: pct(b.rate),
  }));
}

const PRE_STAGE3 = rows(OLD);
const POST_STAGE3 = rows(S3);

export default function TaxBracketHistoryPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Tax Bracket History</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Tax Bracket History &mdash; Australian Income Tax Rates 2020 to 2026
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            The Australian resident income tax brackets and marginal tax rates below cover the six financial years from FY2020-21 through FY2025-26, the period that includes the revised Stage 3 tax cuts. Those cuts lowered rates and widened brackets from 1 July 2024. The tables show every rate and threshold by year. The timeline explains each stage of the Personal Income Tax Plan, and a worked example compares the tax payable on a single salary across the years.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="mv-content lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: Tax Brackets by Financial Year */}
            <section id="brackets-by-year">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Brackets by Financial Year</h2>
              <p>
                Australia&apos;s individual income tax brackets remained stable from FY2020-21 through FY2023-24, with five brackets and a top marginal rate of <strong>45%</strong>. From 1 July 2024, the revised Stage 3 tax cuts lowered rates and widened brackets for every taxpayer with taxable income above the tax-free threshold.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY2020-21 to FY2023-24</h3>
              <p>
                The resident tax brackets were identical in all four of these years. The main change in this period was the removal of the Low and Middle Income Tax Offset (LMITO) from FY2022-23 onwards, which raised the tax payable by taxpayers with taxable income up to $126,000 who had received it.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Taxable Income</th>
                        <th className="px-6 py-4 border-l text-right">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {PRE_STAGE3.map((row) => (
                        <tr key={row.bracket}>
                          <td className="px-6 py-4 font-semibold text-navy bg-sandstone">{row.bracket}</td>
                          <td className="px-6 py-4 border-l text-right">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Excludes Medicare Levy (2%) and LMITO (available FY2020-21 &amp; FY2021-22 only). Brackets identical for FY2020-21, FY2021-22, FY2022-23, and FY2023-24.</p>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY2024-25 &amp; FY2025-26 (Revised Stage 3)</h3>
              <p>
                The revised Stage 3 tax cuts lowered the {pct(OLD[1].rate)} rate to <strong>{pct(S3[1].rate)}</strong>, replaced the {pct(OLD[2].rate)} rate with <strong>{pct(S3[2].rate)}</strong>, extended the middle bracket to {formatAUD(S3[2].max)}, and raised the top threshold from {formatAUD(OLD[3].max)} to {formatAUD(S3[3].max)}. These brackets applied for FY2024-25 and FY2025-26; from 1 July 2026 the {pct(S3[1].rate)} rate fell again to {pct(NOW[1].rate)}.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Taxable Income</th>
                        <th className="px-6 py-4 border-l text-right">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {POST_STAGE3.map((row) => (
                        <tr key={row.bracket}>
                          <td className="px-6 py-4 font-semibold text-navy bg-sandstone">{row.bracket}</td>
                          <td className="px-6 py-4 border-l text-right">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Excludes Medicare Levy (2%). Applied for FY2024-25 and FY2025-26. From 1 July 2026 the second rate is {pct(NOW[1].rate)}.</p>
              </div>
            </section>

            {/* SECTION 2: Year-Over-Year Master Comparison */}
            <section id="master-comparison">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Year-Over-Year Master Comparison</h2>
              <p>
                The table below places all six financial years side by side so you can see exactly when each rate and threshold changed. The shaded columns highlight the FY2024-25 shift.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-x-auto overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-4 py-4">Bracket</th>
                        <th className="px-4 py-4 border-l text-center">20-21</th>
                        <th className="px-4 py-4 border-l text-center">21-22</th>
                        <th className="px-4 py-4 border-l text-center">22-23</th>
                        <th className="px-4 py-4 border-l text-center">23-24</th>
                        <th className="px-4 py-4 border-l text-center bg-eucalyptus/10">24-25</th>
                        <th className="px-4 py-4 border-l text-center bg-eucalyptus/10">25-26</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$0 &ndash; $18,200</td>
                        <td className="px-4 py-3 border-l text-center">0%</td>
                        <td className="px-4 py-3 border-l text-center">0%</td>
                        <td className="px-4 py-3 border-l text-center">0%</td>
                        <td className="px-4 py-3 border-l text-center">0%</td>
                        <td className="px-4 py-3 border-l text-center bg-eucalyptus/10">0%</td>
                        <td className="px-4 py-3 border-l text-center bg-eucalyptus/10">0%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$18,201 &ndash; $45,000</td>
                        <td className="px-4 py-3 border-l text-center">19%</td>
                        <td className="px-4 py-3 border-l text-center">19%</td>
                        <td className="px-4 py-3 border-l text-center">19%</td>
                        <td className="px-4 py-3 border-l text-center">19%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">16%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">16%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$45,001 &ndash; $120,000</td>
                        <td className="px-4 py-3 border-l text-center">32.5%</td>
                        <td className="px-4 py-3 border-l text-center">32.5%</td>
                        <td className="px-4 py-3 border-l text-center">32.5%</td>
                        <td className="px-4 py-3 border-l text-center">32.5%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10" colSpan={2}>See below</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$45,001 &ndash; $135,000</td>
                        <td className="px-4 py-3 border-l text-center text-warmgray-light" colSpan={4}>&mdash;</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">30%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">30%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$120,001 &ndash; $180,000</td>
                        <td className="px-4 py-3 border-l text-center">37%</td>
                        <td className="px-4 py-3 border-l text-center">37%</td>
                        <td className="px-4 py-3 border-l text-center">37%</td>
                        <td className="px-4 py-3 border-l text-center">37%</td>
                        <td className="px-4 py-3 border-l text-center text-warmgray-light bg-eucalyptus/10" colSpan={2}>Replaced</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$135,001 &ndash; $190,000</td>
                        <td className="px-4 py-3 border-l text-center text-warmgray-light" colSpan={4}>&mdash;</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">37%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">37%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$180,001+ / $190,001+</td>
                        <td className="px-4 py-3 border-l text-center">45%</td>
                        <td className="px-4 py-3 border-l text-center">45%</td>
                        <td className="px-4 py-3 border-l text-center">45%</td>
                        <td className="px-4 py-3 border-l text-center">45%</td>
                        <td className="px-4 py-3 border-l text-center bg-eucalyptus/10">45%</td>
                        <td className="px-4 py-3 border-l text-center bg-eucalyptus/10">45%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 3: Key Changes Timeline */}
            <section id="key-changes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Key Changes Timeline</h2>
              <p>
                Australia&apos;s Personal Income Tax Plan was legislated in 2018 as a three-stage reform spanning seven years. The timeline below captures the major milestones.
              </p>
              <ul>
                <li><strong>FY2018-19 &mdash; Stage 1:</strong> Introduced the temporary Low and Middle Income Tax Offset (LMITO) for taxable incomes up to $126,000. From FY2018-19 to FY2020-21 it was worth $255 to $1,080, and for FY2021-22 it rose to $675 to $1,500.</li>
                <li><strong>FY2020-21 &mdash; Stage 2:</strong> Raised the upper limit of the 19% bracket from $37,000 to $45,000 and the 32.5% bracket from $90,000 to $120,000, and raised the Low Income Tax Offset (LITO) to $700. These changes were brought forward from the originally planned FY2022-23.</li>
                <li><strong>FY2022-23 &mdash; LMITO Removed:</strong> The temporary Low and Middle Income Tax Offset was not extended beyond FY2021-22, so taxpayers with taxable income up to $126,000 lost it. Tax rose by up to $1,500, the full amount for incomes from $48,001 to $90,000.</li>
                <li><strong>FY2024-25 &mdash; Revised Stage 3:</strong> The original Stage 3 plan (a flat 30% rate from $45,001 to $200,000) was replaced with the revised version: {pct(S3[1].rate)} for {formatAUD(S3[1].min)} to {formatAUD(S3[1].max)}, {pct(S3[2].rate)} for {formatAUD(S3[2].min)} to {formatAUD(S3[2].max)}, {pct(S3[3].rate)} for {formatAUD(S3[3].min)} to {formatAUD(S3[3].max)}, and {pct(S3[4].rate)} above {formatAUD(S3[3].max)}. Every taxpayer earning above {formatAUD(S3[0].max)} received a cut.</li>
              </ul>
              <p>
                Read the full breakdown of Stage 3 savings at every income level in our <Link href="/stage-3-tax-cuts/">Stage 3 Tax Cuts</Link> guide.
              </p>
            </section>

            {/* SECTION 4: Tax on $80,000 Historical */}
            <section id="tax-on-80k">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax on $80,000 &mdash; Historical Comparison</h2>
              <p>
                To compare the bracket changes at a single salary, the table below shows the total income tax payable on a <strong>$80,000</strong> taxable income in each financial year, before the Medicare Levy and any tax offsets.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Financial Year</th>
                        <th className="px-6 py-4 border-l text-right">Tax on $80,000</th>
                        <th className="px-6 py-4 border-l text-right">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2020-21</td>
                        <td className="px-6 py-4 border-l text-right">$16,467</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">&mdash;</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2021-22</td>
                        <td className="px-6 py-4 border-l text-right">$16,467</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">$0</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2022-23</td>
                        <td className="px-6 py-4 border-l text-right">$16,467</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">$0</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2023-24</td>
                        <td className="px-6 py-4 border-l text-right">$16,467</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">$0</td>
                      </tr>
                      <tr className="bg-eucalyptus/5">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2024-25</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">$14,788</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">&minus;$1,679</td>
                      </tr>
                      <tr className="bg-eucalyptus/5">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2025-26</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">$14,788</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">$0</td>
                      </tr>
                      <tr className="bg-eucalyptus/5">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2026-27</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">$14,520</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">&minus;$268</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Excludes Medicare Levy and all offsets (LITO, LMITO). At $80,000, LMITO reduced the tax by $1,080 in FY2020-21 and $1,500 in FY2021-22.</p>
              </div>
              <p>
                The Stage 3 tax cuts delivered a <strong>$1,679 annual saving</strong> at $80,000 income, and the cut to 15% from 1 July 2026 adds a further $268. Enter your own taxable income in the <Link href="/income-tax-calculator/">Income Tax Calculator</Link>.
              </p>
              <p>
                For the current year&apos;s full breakdown at this and nearby salaries, including Medicare and the offsets excluded above, see <Link href="/tax-on/80000/">Tax on $80,000 in Australia</Link>, <Link href="/tax-on/90000/">Tax on $90,000 in Australia</Link> and <Link href="/tax-on/50000/">Tax on $50,000 in Australia</Link>. The current, previous and legislated 2027-28 scales are also available as CSV and JSON on the <Link href="/australian-tax-and-pay-data/">Australian tax and pay data</Link> page.
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={TAX_BRACKET_HISTORY_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-sandstone bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-navy" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Tax brackets and rates on this page are sourced directly from the ATO&apos;s published individual income tax rate schedules for each financial year. Tax calculations exclude the Medicare Levy (2%) and any offsets unless explicitly noted. Stage 3 figures reflect the revised legislation, which became law on 5 March 2024.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-bracket-history"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="mv-sidebar space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/tax-brackets/" label="Current Tax Brackets" />
                    <SidebarLink href="/stage-3-tax-cuts/" label="Stage 3 Tax Cuts Explained" />
                    <SidebarLink href="/tax-changes-2026-27/" label="Tax Changes 2026-27" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate Your Tax</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See exactly how much tax you owe under the current FY{SITE_CONFIG.financialYear} brackets.</p>
                  <Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Calculate Now <ArrowRight className="inline h-4 w-4 ml-1" />
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

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}
