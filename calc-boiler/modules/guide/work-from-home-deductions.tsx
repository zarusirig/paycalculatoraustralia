"use client";
import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, TAX_BRACKETS_2025_26, formatAUD } from "@/lib/constants";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";

// ATO fixed rate method page (last updated 8 Jun 2026, checked 24 Sep 2026):
// "2024–25 and 2025–26: use 70 cents per work hour"; 67c applied to 2022–23
// and 2023–24; 52c to 2020–21 and 2021–22. No 2026–27 rate published yet.
const WFH_CENTS = RETURN_2026.wfhFixedRateCents;
const WFH_RATE = WFH_CENTS / 100;
// 7.6-hour day x 48 working weeks, per WFH day per week.
const WFH_ROWS = [1, 2, 3, 4, 5].map((days) => {
  const hours = Math.round(days * 7.6 * 48);
  return { days, hours, deduction: Math.floor(hours * WFH_RATE) };
});
// The marginal rates that apply to a 2025-26 return (16% became 15% from 1 July 2026).
const SAVING_RATES = TAX_BRACKETS_2025_26.slice(1).map((b) => b.rate);
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FaqAccordion from "@/components/common/faq-accordion";
import { WFH_FAQS } from "./work-from-home-deductions-faqs";

const SOURCES_LIST: SourceLink[] = [
  { title: "Working from home expenses", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses", publisher: SOURCES.ato.name },
  { title: "Fixed rate method", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method", publisher: SOURCES.ato.name },
  { title: "Actual cost method", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/actual-cost-method", publisher: SOURCES.ato.name },
  { title: "Income tax rates for individuals", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function WorkFromHomeDeductionsPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Work From Home Deductions</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Work From Home Tax Deductions — What You Can Claim in 2025-26</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">If you work from home — even one day a week — you can claim a tax deduction for running expenses. This guide explains the two available methods, what each covers, the records you need, and exactly how much you can expect to save.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: Two Methods Compared ───── */}
            <section id="two-methods">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Two Methods for Claiming WFH Expenses</h2>
              <p>
                The ATO provides two methods for claiming work from home running expenses: the <strong>revised fixed rate method</strong> and the <strong>actual cost method</strong>. You choose one method per financial year — you cannot mix methods for different expenses within the same year.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Feature</th><th className="px-5 py-3">Fixed Rate Method ({WFH_CENTS}c/hr)</th><th className="px-5 py-3">Actual Cost Method</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Rate</td><td className="px-5 py-3">{WFH_CENTS} cents per hour worked from home ({RETURN_2026.incomeYear})</td><td className="px-5 py-3">Calculate each expense separately</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Covers</td><td className="px-5 py-3">Electricity, phone, internet, stationery, computer consumables</td><td className="px-5 py-3">Only what you calculate and claim</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Records required</td><td className="px-5 py-3">Record of total hours worked from home for the full year</td><td className="px-5 py-3">Bills, receipts, and a method to apportion work-use %</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Dedicated office needed?</td><td className="px-5 py-3">No</td><td className="px-5 py-3">No (but needed for occupancy expenses like rent/mortgage interest)</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Best for</td><td className="px-5 py-3">Most employees — simpler record-keeping</td><td className="px-5 py-3">High utility costs or significant work-use percentage</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Can also claim separately</td><td className="px-5 py-3">Office furniture depreciation, work-specific equipment</td><td className="px-5 py-3">Everything is calculated individually</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Calculate Your WFH Deduction</h3>
                    <p className="text-navy text-sm mb-3">Enter your income and WFH hours to see the tax impact of claiming work from home deductions.</p>
                    <Link href="/tax-return-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Tax Return Estimator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── SECTION 2: What Fixed Rate Covers ───── */}
            <section id="fixed-rate-covers">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What the Fixed Rate Covers</h2>
              <p>
                The {WFH_CENTS} cents per hour fixed rate is a single rate that bundles the running costs of working from home. You <strong>cannot claim separate deductions</strong> for any of these expenses if you use the fixed rate method:
              </p>
              <ul>
                <li><strong>Electricity and gas</strong> — for heating, cooling, and lighting your workspace</li>
                <li><strong>Phone usage</strong> — work-related calls and data on your personal phone plan</li>
                <li><strong>Internet usage</strong> — your home broadband used for work activities</li>
                <li><strong>Stationery and computer consumables</strong> — printer ink, paper, pens, USB drives</li>
              </ul>
              <p>
                The rate was revised from the former 52 cents per hour (which covered a narrower range of expenses) to 67 cents per hour from 1 July 2022, and rose to {WFH_CENTS} cents per hour for the 2024-25 and 2025-26 income years. The higher rate since 2022 reflects the inclusion of phone and internet costs, which were previously claimed separately. The ATO has not yet published the rate for 2026-27.
              </p>
            </section>

            {/* ───── SECTION 3: What You Claim Separately ───── */}
            <section id="claim-separately">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What You Claim Separately (Under Either Method)</h2>
              <p>
                Certain WFH expenses are <strong>not included</strong> in the fixed rate and can be claimed as separate deductions regardless of which method you choose:
              </p>
              <ul>
                <li><strong>Office furniture:</strong> Desks, chairs, bookshelves. Items costing $300 or less are an immediate deduction (work-use %). Items over $300 are depreciated over their effective life.</li>
                <li><strong>Technology and equipment:</strong> Monitors, keyboards, webcams, headsets, printers. Same $300 threshold for immediate vs depreciation.</li>
                <li><strong>Computer software and subscriptions:</strong> Microsoft 365, Adobe Creative Cloud, antivirus — work-use percentage of the annual subscription.</li>
                <li><strong>Repairs to home office equipment:</strong> Repair costs for work-related equipment are immediately deductible at the work-use percentage.</li>
              </ul>
              <p>
                <strong>Occupancy expenses</strong> (rent, mortgage interest, property insurance, land tax, rates) are only deductible if you have a dedicated home office used exclusively or primarily for work — and you run a business from home. Most employees working from home for an employer cannot claim occupancy expenses.
              </p>
            </section>

            {/* ───── SECTION 4: Record-Keeping Requirements ───── */}
            <section id="record-keeping">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Record-Keeping Requirements</h2>
              <p>
                The ATO has specific record-keeping requirements for each method. Failure to keep adequate records means the ATO can disallow your entire WFH claim.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Fixed Rate Method Records</h3>
              <ul>
                <li>A record of the <strong>total number of hours</strong> you worked from home during the income year. Acceptable records include timesheets, rosters, time-tracking apps, or a diary maintained for the entire year.</li>
                <li>A record for each <strong>separate expense</strong> you claim on top of the fixed rate (e.g., receipts for furniture, equipment purchases).</li>
              </ul>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Actual Cost Method Records</h3>
              <ul>
                <li><strong>All bills and receipts</strong> for expenses you are claiming (electricity, gas, internet, phone bills).</li>
                <li>A <strong>reasonable basis</strong> for apportioning work-use vs personal-use percentage. For electricity, this could be based on floor area of your workspace relative to the whole house, or the wattage and usage hours of work-related appliances.</li>
                <li>A <strong>4-week representative diary</strong> for phone and internet to establish your work-use percentage, which you then apply to the full year.</li>
              </ul>
            </section>

            {/* ───── SECTION 5: How Much Will You Save ───── */}
            <section id="wfh-savings">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Will You Save?</h2>
              <p>
                The table below shows annual deduction amounts and tax savings using the <strong>fixed rate method ({WFH_CENTS}c/hour, {RETURN_2026.incomeYear})</strong>, based on a standard 7.6-hour work day across 48 working weeks per year. Tax saved uses the {RETURN_2026.incomeYear} marginal rates and excludes the 2% Medicare levy.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">WFH Days/Week</th><th className="px-5 py-3 text-right">Annual Hours</th><th className="px-5 py-3 text-right">Deduction ({WFH_CENTS}c/hr)</th><th className="px-5 py-3 text-right">Tax Saved @ 16%</th><th className="px-5 py-3 text-right">Tax Saved @ 30%</th><th className="px-5 py-3 text-right">Tax Saved @ 37%</th><th className="px-5 py-3 text-right">Tax Saved @ 45%</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {WFH_ROWS.map((r) => (
                        <tr key={r.days}><td className="px-5 py-3 font-medium">{r.days} day{r.days > 1 ? "s" : ""}</td><td className="px-5 py-3 text-right">{r.hours.toLocaleString("en-AU")}</td><td className="px-5 py-3 text-right">{formatAUD(r.deduction)}</td>{SAVING_RATES.map((rate) => (<td key={rate} className="px-5 py-3 text-right">{formatAUD(r.deduction * rate)}</td>))}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                These figures use the fixed rate method only. If you also claim office furniture, a monitor, or other separately deductible items, your total WFH deduction and tax savings will be higher. A $600 office chair depreciated over 10 years adds <strong>$60 per year</strong> in deductions (at 100% work use). Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to model your total deductions against your income.
              </p>
            </section>

            {/* ───── SECTION 6: Common WFH Mistakes ───── */}
            <section id="common-mistakes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common WFH Deduction Mistakes</h2>
              <p>
                The ATO flags WFH claims as a key audit focus area. These are the most common errors that lead to disallowed deductions or penalties:
              </p>
              <ul>
                <li><strong>Claiming phone/internet separately under the fixed rate method.</strong> The {WFH_CENTS}c/hr rate already includes phone and internet costs. Claiming them again separately results in double-counting and ATO adjustment.</li>
                <li><strong>No record of hours.</strong> You must maintain a record of hours worked from home for the <strong>entire income year</strong>. A 4-week representative period is not sufficient under the revised fixed rate method — the ATO requires a full-year record.</li>
                <li><strong>Claiming occupancy expenses as an employee.</strong> Rent, mortgage interest, and property rates are only deductible for home-based businesses, not employees working from home for their employer.</li>
                <li><strong>Claiming 100% of shared expenses.</strong> If you share your home with a partner who also works from home, each person can only claim their own proportion of expenses or hours.</li>
                <li><strong>Not adjusting for leave periods.</strong> You cannot claim WFH deductions for hours when you were on annual leave, sick leave, or public holidays — even if your home office equipment was still set up.</li>
              </ul>
            </section>

            {/* ───── SECTION 7: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={WFH_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Work from home deduction information is sourced from the Australian Taxation Office (ATO). The fixed rate is 70 cents per hour for FY2024-25 and FY2025-26 (67 cents for FY2022-23 and FY2023-24); the ATO has not yet published the FY2026-27 rate. Hours and savings calculations assume a 7.6-hour work day across 48 working weeks. Your individual circumstances, working hours, and marginal tax rate determine your actual savings.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("work-from-home-deductions"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/tax-deductions-guide/" label="Tax Deductions Guide" /><SidebarLink href="/tax-return-calculator/" label="Tax Return Estimator" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">How much will WFH save you?</h3><p className="text-sky-100 text-sm mb-4">Add your WFH deduction to your tax return estimate and see your total refund.</p><Link href="/tax-return-calculator/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Tax Return Estimator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
