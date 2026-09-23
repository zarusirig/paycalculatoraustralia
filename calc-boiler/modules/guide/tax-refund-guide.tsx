import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, MEDICARE_LEVY, HECS_HELP_2025_26, LITO, TAX_BRACKETS, TAX_BRACKETS_2025_26, TAX_FREE_THRESHOLD, GENERAL_INTEREST_CHARGE, formatAUD, formatPercent } from "@/lib/constants";
import { RETURN_2026, RETURN_2026_SOURCES, MLS_2025_26_SINGLE, incomeTax2025_26, lito2025_26, medicareLevy2025_26 } from "@/lib/constants/tax-return-2025-26";
import { PENALTY_UNIT, FTL_MAX_INDIVIDUAL } from "@/lib/constants/tax-calendar-2026-27";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FaqAccordion from "@/components/common/faq-accordion";
import { TAX_REFUND_FAQS } from "./tax-refund-guide-faqs";

const SOURCES_LIST: SourceLink[] = [
  { title: "Lodge your tax return", url: "https://www.ato.gov.au/individuals-and-families/your-tax-return", publisher: SOURCES.ato.name },
  { title: "Deductions you can claim", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim", publisher: SOURCES.ato.name },
  { title: "Income tax rates for individuals", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Lodge your tax return online with myTax", url: RETURN_2026_SOURCES.myTax, publisher: SOURCES.ato.name },
  { title: "Due dates for tax returns lodged by registered agents", url: RETURN_2026_SOURCES.agentProgram, publisher: SOURCES.ato.name },
  { title: "Working from home fixed rate method", url: RETURN_2026_SOURCES.wfh, publisher: SOURCES.ato.name },
  { title: "Medicare levy surcharge income, thresholds and rates", url: RETURN_2026_SOURCES.mls, publisher: SOURCES.ato.name },
  { title: "Failure to lodge on time penalty", url: "https://www.ato.gov.au/individuals-and-families/paying-the-ato/interest-and-penalties/penalties/failure-to-lodge-on-time-penalty", publisher: SOURCES.ato.name },
];

// The return being lodged now is the 2025-26 return (RETURN_2026.incomeYear),
// so every worked figure below is computed on 2025-26 rates from constants.
const RY = RETURN_2026.incomeYear;
const EX_GROSS = 85_000;
const EX_DEDUCTIONS = 2_500;
const EX_TAXABLE = EX_GROSS - EX_DEDUCTIONS;
const EX_TAX = incomeTax2025_26(EX_TAXABLE);
const EX_LEVY = medicareLevy2025_26(EX_TAXABLE);
const EX_LITO = lito2025_26(EX_TAXABLE);
const EX_LIABILITY = EX_TAX + EX_LEVY - EX_LITO;
// Approximation: PAYG withholding is designed to land close to the full-year
// liability on the gross salary when no deductions are claimed.
const EX_WITHHELD = incomeTax2025_26(EX_GROSS) + medicareLevy2025_26(EX_GROSS) - lito2025_26(EX_GROSS);
const EX_REFUND = EX_WITHHELD - EX_LIABILITY;
const BRACKET_2 = TAX_BRACKETS_2025_26[1];
const BRACKET_3 = TAX_BRACKETS_2025_26[2];
const TOP_BRACKET = TAX_BRACKETS_2025_26[TAX_BRACKETS_2025_26.length - 1];
const MLS_BASE_2025_26 = MLS_2025_26_SINGLE[0].min - 1;
const FTL_PER_PERIOD = PENALTY_UNIT.amount;

export default function TaxRefundGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Tax Refund Guide</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Refund Guide — How Tax Returns Work in Australia</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Understand how tax refunds work, what deductions you can claim, and how to maximise your return. A complete guide to the Australian tax return process for the FY{RY} return you lodge in 2026.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: What Is a Tax Refund? ───── */}
            <section id="what-is-tax-refund">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is a Tax Refund?</h2>
              <p>
                A tax refund is the amount the Australian Taxation Office (ATO) returns to you when your employer withheld <strong>more PAYG tax than your actual liability</strong> for the financial year. The ATO calculates your refund after you lodge your tax return, comparing total tax withheld against your assessed tax on taxable income.
              </p>
              <p>
                Throughout each pay cycle, your employer deducts income tax based on PAYG withholding schedules. These schedules assume you earn the same amount every pay period for the full 12 months. Three common situations create a gap between tax withheld and tax owed: claiming work-related deductions that reduce taxable income, working for only part of the financial year, and receiving tax offsets such as the &quot;Low Income Tax Offset&quot; (LITO) worth up to <strong>{formatAUD(LITO.maxOffset)}</strong>.
              </p>
              <p>
                The refund is not free money from the government — it is your own income that was over-withheld. Use our <Link href="/tax-return-calculator/">Tax Return Estimator</Link> to calculate whether you are likely to receive a refund or owe additional tax for FY{RY}.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Estimate Your Tax Refund</h3>
                    <p className="text-navy text-sm mb-3">Enter your income, tax withheld, and deductions to see if you are getting money back or owe the ATO.</p>
                    <Link href="/tax-return-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Tax Return Estimator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── SECTION 2: How Is Your Tax Refund Calculated? ───── */}
            <section id="how-calculated">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Your Tax Refund Calculated?</h2>
              <p>
                Your tax refund equals the difference between <strong>total PAYG tax withheld and your assessed tax liability</strong>. The ATO applies Australian income tax brackets, the Medicare levy, tax offsets, and allowable deductions to arrive at the final figure.
              </p>
              <p>
                The calculation follows a defined sequence. The ATO first determines gross income from all sources: salary, wages, interest, dividends, rental income, and capital gains. Allowable deductions are then subtracted from gross income to produce taxable income. Income tax is calculated on taxable income using the FY{RY} resident tax brackets.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example at {formatAUD(EX_GROSS)} (FY{RY} return)</h3>
              <p>
                An employee earning <strong>{formatAUD(EX_GROSS)}</strong> gross salary with <strong>{formatAUD(EX_DEDUCTIONS)}</strong> in work-related deductions has a taxable income of <strong>{formatAUD(EX_TAXABLE)}</strong>. The income tax on {formatAUD(EX_TAXABLE)} is <strong>{formatAUD(EX_TAX)}</strong> (calculated as {formatAUD(BRACKET_3.base)} base + {formatPercent(BRACKET_3.rate, 0)} on the amount over {formatAUD(BRACKET_3.min - 1)}). The Medicare levy adds <strong>{formatAUD(EX_LEVY)}</strong> ({formatPercent(MEDICARE_LEVY.rate, 0)} of {formatAUD(EX_TAXABLE)}). After applying the LITO of <strong>{formatAUD(EX_LITO)}</strong> (phased out above {formatAUD(LITO.nilOffsetIncome)}), total tax liability is <strong>{formatAUD(EX_LIABILITY)}</strong>.
              </p>
              <p>
                PAYG withholding on {formatAUD(EX_GROSS)} with no deductions is designed to come close to the full-year tax on {formatAUD(EX_GROSS)}: about <strong>{formatAUD(EX_WITHHELD)}</strong>. If that is what was withheld, the refund is {formatAUD(EX_WITHHELD)} minus {formatAUD(EX_LIABILITY)} = <strong>{formatAUD(EX_REFUND)}</strong> &mdash; the {formatAUD(EX_DEDUCTIONS)} of deductions at the {formatPercent(BRACKET_3.rate, 0)} marginal rate plus the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy. The exact amount withheld depends on how each pay was rounded under the withholding tables, so a real refund will differ slightly. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to model your own scenario with specific income and deduction amounts.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Refund Formula</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Step</th><th className="px-5 py-3">Calculation</th><th className="px-5 py-3 text-right">Example ({formatAUD(EX_GROSS)})</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">1. Gross income</td><td className="px-5 py-3">All assessable income sources</td><td className="px-5 py-3 text-right">{formatAUD(EX_GROSS)}</td></tr>
                      <tr><td className="px-5 py-3">2. Subtract deductions</td><td className="px-5 py-3">Gross income − allowable deductions</td><td className="px-5 py-3 text-right">{formatAUD(EX_TAXABLE)}</td></tr>
                      <tr><td className="px-5 py-3">3. Income tax on taxable income</td><td className="px-5 py-3">Apply FY{RY} tax brackets</td><td className="px-5 py-3 text-right">{formatAUD(EX_TAX)}</td></tr>
                      <tr><td className="px-5 py-3">4. Add Medicare levy</td><td className="px-5 py-3">{formatPercent(MEDICARE_LEVY.rate, 0)} of taxable income</td><td className="px-5 py-3 text-right">{formatAUD(EX_LEVY)}</td></tr>
                      <tr><td className="px-5 py-3">5. Subtract tax offsets</td><td className="px-5 py-3">LITO, SAPTO, other offsets</td><td className="px-5 py-3 text-right">{formatAUD(EX_LITO)}</td></tr>
                      <tr><td className="px-5 py-3">6. Total tax liability</td><td className="px-5 py-3">Step 3 + Step 4 − Step 5</td><td className="px-5 py-3 text-right">{formatAUD(EX_LIABILITY)}</td></tr>
                      <tr className="font-semibold text-navy"><td className="px-5 py-3">7. Tax refund</td><td className="px-5 py-3">Total PAYG withheld (about {formatAUD(EX_WITHHELD)}) − Total tax liability</td><td className="px-5 py-3 text-right">{formatAUD(EX_REFUND)}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ───── SECTION 3: What Is the Average Tax Refund in Australia? ───── */}
            <section id="average-refund">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Big Is a Typical Tax Refund in Australia?</h2>
              <p>
                There is no single typical refund. For most employees the refund is roughly their deductions multiplied by their marginal rate (plus the Medicare levy), plus any offset such as LITO that the withholding tables did not fully build in, plus any over-withholding from part-year work. Averages quoted in the media are early-season snapshots and move week to week, so we don&apos;t repeat them here.
              </p>
              <p>
                Taxpayers in higher income tax brackets tend to receive larger refunds in dollar terms because deductions save tax at a higher marginal rate. For FY{RY}, a $3,000 deduction saves <strong>{formatAUD(3_000 * BRACKET_2.rate)}</strong> in income tax for someone in the {formatPercent(BRACKET_2.rate, 0)} bracket but <strong>{formatAUD(3_000 * TOP_BRACKET.rate)}</strong> for someone in the {formatPercent(TOP_BRACKET.rate, 0)} bracket. Part-year workers and those with multiple income sources also tend to receive above-average refunds due to withholding mismatches.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What $1,000 of Deductions Is Worth by Bracket (FY{RY})</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Taxable Income Range</th><th className="px-5 py-3">Marginal Rate</th><th className="px-5 py-3 text-right">Income Tax Saved per $1,000 Deducted</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {TAX_BRACKETS_2025_26.map((b) => (
                        <tr key={b.min}><td className="px-5 py-3">{formatAUD(b.min)}{b.max === Infinity ? "+" : ` – ${formatAUD(b.max)}`}</td><td className="px-5 py-3">{formatPercent(b.rate, 0)}{b.rate === 0 ? " (tax-free threshold)" : ""}</td><td className="px-5 py-3 text-right">{formatAUD(1_000 * b.rate)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Individuals below the <strong>{formatAUD(TAX_FREE_THRESHOLD)}</strong> tax-free threshold who had PAYG tax withheld receive a full refund of all tax paid. This commonly applies to students, part-time workers, and people who started employment partway through the year. Review the current <Link href="/tax-brackets/">Tax Brackets Guide</Link> to identify which marginal rate applies to your assessable income.
              </p>
            </section>

            {/* ───── SECTION 4: Top Tax Deductions That Increase Your Refund ───── */}
            <section id="top-deductions">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Top Tax Deductions That Increase Your Refund?</h2>
              <p>
                Work-related deductions are the primary driver of tax refunds for Australian employees, reducing taxable income and the tax owed on it. The ATO allows deductions for expenses directly related to earning your assessable income, provided you have records such as receipts, invoices, or diary entries.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Deduction Category</th><th className="px-5 py-3">Method / Details (FY{RY})</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Work from home</td><td className="px-5 py-3">Fixed rate: {RETURN_2026.wfhFixedRateCents}c per work hour, with a record of hours worked from home; or actual costs</td></tr>
                      <tr><td className="px-5 py-3">Car / travel expenses</td><td className="px-5 py-3">Work-related travel (not home-to-work commuting); cents per km method {RETURN_2026.carCentsPerKm}c per km, up to {RETURN_2026.carMaxKm.toLocaleString("en-AU")} km per car</td></tr>
                      <tr><td className="px-5 py-3">Uniforms / protective clothing</td><td className="px-5 py-3">Occupation-specific, compulsory, or protective clothing + laundry</td></tr>
                      <tr><td className="px-5 py-3">Self-education expenses</td><td className="px-5 py-3">Courses, textbooks, and conferences related to current employment</td></tr>
                      <tr><td className="px-5 py-3">Tools and equipment</td><td className="px-5 py-3">Items costing $300 or less: immediate deduction; over $300: depreciate</td></tr>
                      <tr><td className="px-5 py-3">Phone and internet</td><td className="px-5 py-3">Work-use percentage of personal plans (not if you use the WFH fixed rate, which covers them)</td></tr>
                      <tr><td className="px-5 py-3">Union / professional fees</td><td className="px-5 py-3">Membership of unions, professional associations, and registration boards</td></tr>
                      <tr><td className="px-5 py-3">Income protection insurance</td><td className="px-5 py-3">Premiums for policies covering loss of income (not paid through super)</td></tr>
                      <tr><td className="px-5 py-3">Donations (DGR)</td><td className="px-5 py-3">Gifts of $2+ to deductible gift recipients</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Claims without receipts are limited to <strong>$300 total</strong> for work-related expenses under the no-receipt threshold. The ATO uses data matching to compare your claims against others in the same occupation and income bracket. Unusually high claims relative to peers trigger review. Salary sacrifice arrangements offer a separate pathway to reduce taxable income — see our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link> for details.
              </p>
            </section>

            {/* ───── SECTION 5: Step-by-Step: How to Lodge Your Tax Return ───── */}
            <section id="how-to-lodge">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Lodge Your Tax Return?</h2>
              <p>
                Most Australians lodge their tax return through <strong>myTax</strong>, the ATO&apos;s free online tool accessible via myGov. For a straightforward return with pre-filled employer data and no complex investments, it is usually a short job.
              </p>
              <ol>
                <li><strong>Log into myGov</strong> at <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer">my.gov.au</a> and navigate to the ATO section. Link your ATO account if you have not done so previously.</li>
                <li><strong>Wait for pre-fill data.</strong> Your employer&apos;s income statement, bank interest, private health insurance details, and government payments auto-populate once it arrives &mdash; the ATO says most information is pre-filled by {RETURN_2026.prefillReady}. Lodging before pre-fill data is available increases the risk of errors.</li>
                <li><strong>Verify your income.</strong> Check that your salary, wages, allowances, and other income match your final payslip and payment summaries. Report all assessable income including interest above $1, dividends, rental income, and capital gains.</li>
                <li><strong>Add deductions.</strong> Enter work-related expenses, self-education costs, donations, and other allowable deductions. The ATO pre-fills some deductions such as income protection insurance and tax agent fees from the prior year.</li>
                <li><strong>Review offsets and levies.</strong> The system automatically applies the &quot;Low Income Tax Offset&quot; (LITO), the &quot;Medicare Levy&quot; at {formatPercent(MEDICARE_LEVY.rate, 0)}, and the &quot;Medicare Levy Surcharge&quot; if applicable. Confirm your private health insurance status to avoid an incorrect MLS charge &mdash; the <Link href="/medicare-levy-surcharge-calculator/">MLS calculator</Link> shows whether it applies to you.</li>
                <li><strong>Submit and receive your Notice of Assessment.</strong> The ATO issues a Notice of Assessment confirming your refund amount or tax debt. The ATO says most myTax returns process in {RETURN_2026.onlineProcessingBusinessDays} business days and most refunds issue within {RETURN_2026.onlineRefundTypical}, paid by direct deposit.</li>
              </ol>
              <p>
                Alternatively, a registered tax agent can lodge on your behalf. If you are on an agent&apos;s lodgment program (contact them before 31 October), most individuals have until <strong>{RETURN_2026.agentDueDateMostPeople}</strong>. Complex returns involving investment properties, capital gains, foreign income, or business income benefit from professional preparation.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Key Deadlines for the FY{RY} Return</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Event</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">{RETURN_2026.incomeYearEnd}</td><td className="px-5 py-3">FY{RY} ends</td></tr>
                      <tr><td className="px-5 py-3 font-medium">14 July 2026</td><td className="px-5 py-3">Employers must finalise Single Touch Payroll data, making income statements &quot;tax ready&quot; in myGov</td></tr>
                      <tr><td className="px-5 py-3 font-medium">{RETURN_2026.selfLodgeDueDate}</td><td className="px-5 py-3">Deadline for self-prepared tax returns (lodging via myTax)</td></tr>
                      <tr><td className="px-5 py-3 font-medium">{RETURN_2026.agentDueDateLargeLiability}</td><td className="px-5 py-3">Tax agent deadline where your latest return resulted in a tax liability of $20,000 or more</td></tr>
                      <tr><td className="px-5 py-3 font-medium">{RETURN_2026.agentDueDateMostPeople}</td><td className="px-5 py-3">Tax agent deadline for most remaining individuals (or {RETURN_2026.agentConcessionDate} under the ATO concession, provided any tax owing is also paid by then)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Late lodgment can attract a &quot;Failure to Lodge&quot; (FTL) penalty of one penalty unit &mdash; <strong>{formatAUD(FTL_PER_PERIOD)} from {PENALTY_UNIT.from}</strong> &mdash; for every {PENALTY_UNIT.ftlDaysPerUnit} days or part overdue, up to {PENALTY_UNIT.ftlMaxUnits} units ({formatAUD(FTL_MAX_INDIVIDUAL)}). The ATO can remit the penalty depending on your circumstances, so contact it if you will be late. Check our <Link href="/tax-calendar/">Tax Calendar</Link> for a complete schedule of Australian tax dates.
              </p>
            </section>

            {/* ───── SECTION 6: How Long Does a Tax Refund Take? ───── */}
            <section id="processing-time">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Long Does a Tax Refund Take?</h2>
              <p>
                The ATO says most returns lodged online through myTax process in <strong>{RETURN_2026.onlineProcessingBusinessDays} business days</strong>, with most refunds issued within {RETURN_2026.onlineRefundTypical}. For paper returns, most refunds issue within <strong>{RETURN_2026.paperRefundBusinessDays} business days</strong>. The ATO deposits refunds directly into the bank account linked to your tax file number (TFN).
              </p>
              <p>
                Processing times increase during peak lodgment season in July and August. Returns flagged for review — due to unusual deductions, data mismatches, or random audits — take longer. The ATO contacts you via myGov messages if additional information is required.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Processing Time by Lodgment Method</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Lodgment Method</th><th className="px-5 py-3">Typical Processing Time</th><th className="px-5 py-3">Refund Delivery</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">myTax (online)</td><td className="px-5 py-3"><strong>Most within {RETURN_2026.onlineProcessingBusinessDays} business days</strong></td><td className="px-5 py-3">Direct deposit</td></tr>
                      <tr><td className="px-5 py-3">Paper return</td><td className="px-5 py-3"><strong>Most refunds within {RETURN_2026.paperRefundBusinessDays} business days</strong></td><td className="px-5 py-3">Direct deposit</td></tr>
                      <tr><td className="px-5 py-3">Return under review</td><td className="px-5 py-3"><strong>Longer; the ATO contacts you</strong></td><td className="px-5 py-3">Held until review complete</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Track your refund status by logging into myGov and checking the &quot;Tax&quot; section. The progress tracker shows four stages: received, processing, finalised, and paid. Outstanding debts to Centrelink, child support, or prior ATO balances are automatically offset against your refund before payment.
              </p>
            </section>

            {/* ───── SECTION 7: Tax Refund vs Tax Debt ───── */}
            <section id="refund-vs-debt">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between a Tax Refund and a Tax Debt?</h2>
              <p>
                A tax refund occurs when your employer withheld <strong>more tax than your assessed liability</strong>; a tax debt occurs when the total tax withheld is <strong>less than your assessed liability</strong>. The ATO&apos;s Notice of Assessment confirms which outcome applies.
              </p>
              <p>
                Tax debts arise from three primary causes: holding multiple jobs where each employer applies the tax-free threshold separately, earning untaxed investment income such as rental profits or capital gains, and incorrectly completing your TFN declaration (claiming the tax-free threshold at more than one employer). When the threshold is claimed at both jobs, the second employer withholds as if the first {formatAUD(TAX_FREE_THRESHOLD)} of that job&apos;s pay were tax-free, even though your main job has already used it &mdash; the shortfall shows up as a debt at lodgment. Our <Link href="/second-job-tax-calculator/">Second Job Tax Calculator</Link> shows the effect on your own figures.
              </p>
              <p>
                The ATO charges interest on overdue tax debts at the &quot;General Interest Charge&quot; (GIC) rate: <strong>{formatPercent(GENERAL_INTEREST_CHARGE.annualRate, 2)} per annum for {GENERAL_INTEREST_CHARGE.quarter}</strong>, compounding daily and reset every quarter. Payment plans are available for debts you cannot pay in full.
              </p>
              <p>
                Avoid unexpected debts by reviewing your PAYG withholding throughout the year. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to verify your employer is withholding the correct amount based on your current salary and tax circumstances.
              </p>
            </section>

            {/* ───── SECTION 8: Common Tax Refund Mistakes ───── */}
            <section id="common-mistakes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Tax Refund Mistakes?</h2>
              <p>
                The most common tax return error is <strong>claiming deductions without adequate records</strong>, resulting in ATO adjustments, penalties, and reduced refunds. 
              </p>
              <ul>
                <li><strong>Claiming personal expenses as work-related.</strong> Home-to-work commuting, conventional clothing, and personal phone usage are not deductible.</li>
                <li><strong>Forgetting to declare all income sources.</strong> Bank interest, dividends, Centrelink payments, foreign income, and gig economy earnings are all assessable. The ATO data-matches income from banks, share registries, government agencies, and ride-share platforms.</li>
                <li><strong>Double-claiming the tax-free threshold.</strong> Employees with 2 or more jobs sometimes claim the {formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold at each employer. This results in under-withholding and a tax debt at lodgment.</li>
                <li><strong>Lodging before pre-fill data is ready.</strong> Submitting your return before employers finalise income statements (due by 14 July) increases the risk of reporting incorrect income figures, and fixing it later means lodging an amendment.</li>
                <li><strong>Overlooking eligible offsets and rebates.</strong> The &quot;Low Income Tax Offset&quot;, the &quot;Seniors and Pensioners Tax Offset&quot; (SAPTO), and the &quot;Zone Tax Offset&quot; are automatically applied in myTax but require accurate personal details. Incorrect information causes the ATO to omit applicable offsets. Review the <Link href="/low-income-tax-offset/">Low Income Tax Offset Guide</Link> to confirm your eligibility.</li>
              </ul>
            </section>

            {/* ───── CONTEXT BORDER ───── */}

            {/* ───── SECTION 9: What Changed for the FY2025-26 Return? ───── */}
            <section id="changes-fy2025-26">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Tax Refunds in FY2025-26?</h2>
              <p>
                The FY2025-26 financial year retains the Stage 3 tax cuts introduced on 1 July 2024, keeping the <strong>30% marginal rate</strong> for incomes between $45,001 and $135,000. No new changes to individual income tax brackets apply for the 2025-26 year. The next change applies to the 2026-27 return you lodge from July 2027: the {formatPercent(BRACKET_2.rate, 0)} rate fell to {formatPercent(TAX_BRACKETS[1].rate, 0)} from 1 July 2026 (see <Link href="/tax-brackets/">tax brackets</Link>).
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Item</th><th className="px-5 py-3">FY2024-25</th><th className="px-5 py-3">FY2025-26</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Tax-free threshold</td><td className="px-5 py-3">$18,200</td><td className="px-5 py-3">$18,200 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">16% bracket</td><td className="px-5 py-3">$18,201 – $45,000</td><td className="px-5 py-3">$18,201 – $45,000 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">30% bracket</td><td className="px-5 py-3">$45,001 – $135,000</td><td className="px-5 py-3">$45,001 – $135,000 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">37% bracket</td><td className="px-5 py-3">$135,001 – $190,000</td><td className="px-5 py-3">$135,001 – $190,000 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">45% bracket</td><td className="px-5 py-3">$190,001+</td><td className="px-5 py-3">$190,001+ (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">Superannuation Guarantee (SG) rate</td><td className="px-5 py-3">11.5%</td><td className="px-5 py-3"><strong>12%</strong></td></tr>
                      <tr><td className="px-5 py-3">Concessional super contributions cap</td><td className="px-5 py-3">{formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)}</td><td className="px-5 py-3">{formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)} (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">Medicare levy</td><td className="px-5 py-3">2%</td><td className="px-5 py-3">2% (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">Work from home fixed rate</td><td className="px-5 py-3">{RETURN_2026.wfhFixedRateCents}c per hour</td><td className="px-5 py-3">{RETURN_2026.wfhFixedRateCents}c per hour (unchanged)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Two changes matter more for most 2025-26 refunds. Compulsory study loan repayments now apply only once repayment income exceeds <strong>{formatAUD(HECS_HELP_2025_26.minimumThreshold)}</strong>, and only on the income above it. And the Medicare levy surcharge for singles without hospital cover starts above <strong>{formatAUD(MLS_BASE_2025_26)}</strong> for 2025-26. The superannuation guarantee rate increased from <strong>11.5% to 12%</strong> on 1 July 2025. This affects employees who salary sacrifice into super — a higher compulsory SG contribution reduces the remaining cap space for voluntary concessional contributions. See our <Link href="/superannuation-guide/">Superannuation Guide</Link> for the full breakdown of SG rates, caps, and employer obligations.
              </p>
              <p>
                The ATO continues to invest in data-matching technology. Cryptocurrency exchanges, ride-share platforms, short-term rental platforms (Airbnb, Stayz), and the sharing economy reporting regime provide the ATO with third-party transaction data. Unreported income from these sources is increasingly detected during return processing.
              </p>
            </section>

            {/* ───── SECTION 10: Related Resources ───── */}
            <section id="related-resources">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
              <p>
                The Australian tax system connects income tax, superannuation, Medicare, and PAYG withholding into a single framework assessed through your annual tax return. The following tools and guides cover each component in detail.
              </p>
              <ul>
                <li><Link href="/tax-return-calculator/">Tax Return Estimator</Link> — calculate your expected refund or tax debt based on income, deductions, and PAYG withheld.</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — compute income tax, Medicare levy, and take-home pay at any salary level for FY{SITE_CONFIG.financialYear}.</li>
                <li><Link href="/tax-brackets/">Tax Brackets Guide</Link> — view all Australian income tax brackets with marginal rates, base amounts, and worked examples.</li>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link> — learn how salary packaging into superannuation or novated leases reduces taxable income and increases your refund.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP Guide</Link> — understand how HECS-HELP repayments are calculated and how they affect your tax return and take-home pay.</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — review employer SG rate obligations, contribution caps, and the impact of super on your overall tax position.</li>
                <li><Link href="/low-income-tax-offset/">Low Income Tax Offset Guide</Link> — check whether LITO applies to your income and how it reduces your assessed tax liability.</li>
                <li><Link href="/medicare-levy-surcharge-calculator/">Medicare Levy Surcharge Calculator</Link> — check whether the surcharge applies to you and what hospital cover would save.</li>
                <li><Link href="/medicare-levy/">Medicare Levy Guide</Link> — learn about the 2% Medicare levy, the surcharge thresholds, and exemptions for low-income earners.</li>
              </ul>
            </section>

            {/* ───── SECTION 11: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={TAX_REFUND_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Tax return information is sourced from the Australian Taxation Office (ATO). Worked figures are computed from our FY{RY} constants (the return being lodged in 2026); current-year MLS and rebate thresholds are labelled FY{SITE_CONFIG.financialYear}. The GIC rate shown is for {GENERAL_INTEREST_CHARGE.quarter} and resets quarterly. Your individual circumstances, including applicable tax offsets, HECS-HELP obligations, and Medicare levy surcharge status, affect your actual refund amount. Use our Australian tax calculator tools for personalised estimates.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-refund-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/tax-return-calculator/" label="Tax Return Estimator" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/superannuation-calculator/" label="Superannuation Calculator" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Estimate your refund</h3><p className="text-sky-100 text-sm mb-4">Enter your income, tax withheld, and deductions to see if you&apos;re getting money back.</p><Link href="/tax-return-calculator/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Tax Return Estimator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
