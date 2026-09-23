// Every date on this page comes from lib/constants/tax-calendar-2026-27.ts,
// which derives the return dates from RETURN_2026 and the last quarterly super
// dates from SUPER_GUARANTEE_CHARGE.legacy. ATO source URLs for each date are
// cited in that file (verified 23 Sep 2026 via Firecrawl).
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import {
  GENERAL_INTEREST_CHARGE,
  HECS_HELP,
  MEDICARE_LEVY,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
} from "@/lib/constants/australian-tax";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import {
  CALENDAR_YEAR,
  FTL_MAX_INDIVIDUAL,
  LEGACY_SUPER_DATES,
  PENALTY_UNIT,
  QUARTERS_2026_27,
  RETURN_DATES_2026,
  TAX_CALENDAR_2026_27,
  TAX_CALENDAR_SOURCES,
  formatIso,
  type CalendarEvent,
} from "@/lib/constants/tax-calendar-2026-27";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const R = RETURN_2026;
const Y = CALENDAR_YEAR;
const SGC = SUPER_GUARANTEE_CHARGE;
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;

const SOURCES_LIST: SourceLink[] = [
  { title: "Due dates for lodging and paying your BAS", url: TAX_CALENDAR_SOURCES.bas, publisher: SOURCES.ato.name },
  { title: "When are PAYG instalments due?", url: TAX_CALENDAR_SOURCES.paygInstalments, publisher: SOURCES.ato.name },
  { title: "Registered agent lodgment program – individuals and trusts", url: TAX_CALENDAR_SOURCES.agentProgram, publisher: SOURCES.ato.name },
  { title: "Lodge your tax return online with myTax", url: TAX_CALENDAR_SOURCES.myTax, publisher: SOURCES.ato.name },
  { title: "End-of-year finalisation through STP", url: TAX_CALENDAR_SOURCES.stp, publisher: SOURCES.ato.name },
  { title: "Payment deadlines for Payday Super", url: TAX_CALENDAR_SOURCES.paydaySuper, publisher: SOURCES.ato.name },
  { title: "Lodgment and payment dates on weekends or public holidays", url: TAX_CALENDAR_SOURCES.weekends, publisher: SOURCES.ato.name },
  { title: "Failure to lodge on time penalty", url: TAX_CALENDAR_SOURCES.failureToLodge, publisher: SOURCES.ato.name },
  { title: "Penalty units", url: TAX_CALENDAR_SOURCES.penaltyUnits, publisher: SOURCES.ato.name },
  { title: "General interest charge rates", url: GENERAL_INTEREST_CHARGE.sourceUrl, publisher: SOURCES.ato.name },
];

/** "31 Oct 2026", plus the next business day underneath when the date moves. */
function DueDate({ iso, effectiveIso, long = false }: { iso: string; effectiveIso: string; long?: boolean }) {
  return (
    <>
      {formatIso(iso, long ? "long" : "short")}
      {effectiveIso !== iso && (
        <span className="block text-xs font-normal text-warmgray">next business day: {formatIso(effectiveIso)}</span>
      )}
    </>
  );
}

function monthLabel(e: CalendarEvent) {
  const [y, m] = e.iso.split("-").map(Number);
  return `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1]} ${y}`;
}

export default function TaxCalendarPage() {
  const q = QUARTERS_2026_27;
  const self = RETURN_DATES_2026.selfLodge;
  const agent = RETURN_DATES_2026.agentMostPeople;
  const units = [1, 2, 3, 4, 5];
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Tax Calendar</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={H}>Australian Tax Calendar {Y.incomeYear}</h1><p className="text-xl text-warmgray leading-relaxed mb-6">Every key tax date from {Y.start} to {Y.end}: when your {R.incomeYear} tax return is due, quarterly BAS and PAYG instalments, STP finalisation, and how super deadlines work now that Payday Super has replaced quarterly super payments. Where a due date falls on a weekend or public holiday, we show the next business day the ATO accepts.</p><TrustBar className="!max-w-none" /></header>
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ===== SECTION 1: Key Tax Dates ===== */}
          <section><h2 style={H}>What Are the Key Tax Dates for {Y.incomeYear}?</h2>
            <p>The {Y.incomeYear} income year runs from <strong>{Y.start}</strong> to <strong>{Y.end}</strong>. The most important date for most people this year is <strong>{R.selfLodgeDueDate}</strong>, the deadline to lodge your own {R.incomeYear} tax return. It falls on a {self.effectiveIso !== self.iso ? "weekend this year, so you can lodge on " + formatIso(self.effectiveIso, "long") : "business day"}.</p>
            <p>The big change for employers is Payday Super: super is now due each payday instead of each quarter. STP finalisation is still due by 14 July. Use our <Link href="/tax-return-calculator/">Tax Return Calculator</Link> to estimate your {R.incomeYear} refund before you lodge.</p>
            <div className="not-prose my-6 space-y-4">
              <DateCard date={formatIso("2026-07-01")} title="New income year and Payday Super" desc={`${Y.incomeYear} starts. Super is now due within ${SGC.current.businessDaysToPay} business days of each payday. The second tax bracket falls from ${pct(TAX_BRACKETS_2025_26[1].rate)} to ${pct(TAX_BRACKETS_2026_27[1].rate)}.`} colour="green" />
              <DateCard date={formatIso(self.iso)} title={`${R.incomeYear} tax return deadline`} desc={`Deadline if you lodge your own return.${self.effectiveIso !== self.iso ? ` It falls on a weekend, so you can lodge on ${formatIso(self.effectiveIso, "long")}.` : ""} Also the last day to get on a tax agent's client list.`} colour="red" />
              <DateCard date={formatIso(agent.iso)} title="Tax agent deadline" desc={`Usual due date for ${R.incomeYear} returns lodged by a registered tax agent, if you were on their list by ${R.selfLodgeDueDate}.${agent.effectiveIso !== agent.iso ? ` Next business day: ${formatIso(agent.effectiveIso, "long")}.` : ""}`} colour="amber" />
              <DateCard date={formatIso("2027-06-30")} title="End of the income year" desc={`Last day for deductible spending, super contributions and donations to count for ${Y.incomeYear}.`} colour="red" />
            </div>
          </section>

          {/* ===== SECTION 2: Month-by-Month Tax Calendar Table ===== */}
          <section><h2 style={H}>What Does the Full Tax Calendar Look Like Month by Month?</h2>
            <p>The table lists <strong>{TAX_CALENDAR_2026_27.length} dates</strong> from July 2026 to July 2027, including the monthly BAS due on the 21st of each month. Quarterly BAS and PAYG instalments share the same four dates.</p>
            <p>If a date falls on a weekend, or on a public holiday for the whole of any state or territory, the ATO lets you lodge and pay on the next business day. That date is shown underneath.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Month</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Deadline</th><th className="px-5 py-3">Who</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {TAX_CALENDAR_2026_27.map((e) => (
                <tr key={`${e.iso}-${e.title}`} className={e.key ? "bg-ochre/5" : undefined}>
                  <td className="px-5 py-3 font-medium whitespace-nowrap">{monthLabel(e)}</td>
                  <td className={`px-5 py-3 whitespace-nowrap ${e.key ? "font-bold" : ""}`}><DueDate iso={e.iso} effectiveIso={e.effectiveIso} /></td>
                  <td className={`px-5 py-3 ${e.key ? "font-bold" : ""}`}>{e.title}</td>
                  <td className="px-5 py-3">{e.who}</td>
                </tr>
              ))}
            </tbody></table></div></div>
          </section>

          {/* ===== SECTION 3: Individual Tax Return Deadlines ===== */}
          <section><h2 style={H}>What Are the Individual Tax Return Deadlines?</h2>
            <p>If you lodge your own {R.incomeYear} return, it is due by <strong>{R.selfLodgeDueDate}</strong>. If you use a registered tax agent and are on their client list by then, most people have until <strong>{R.agentDueDateMostPeople}</strong>. Some agent clients are due earlier, so your agent will confirm your date.</p>
            <p>The ATO says most returns lodged through myTax are processed in <strong>{R.onlineProcessingBusinessDays} business days</strong> and most refunds are issued within <strong>{R.onlineRefundTypical}</strong>. For paper returns, most refunds are issued within {R.paperRefundBusinessDays} business days. If you owe tax, the amount is due by the date on your notice of assessment.</p>
            <p>Key dates for the {R.incomeYear} return:</p>
            <ul>
              <li><strong>{R.prefillReady.replace(/^./, (c) => c.toUpperCase())} 2026</strong> — the ATO has pre-filled most employer, bank, health fund and government data</li>
              <li><strong>{R.selfLodgeDueDate}</strong> — self-lodgment deadline{self.effectiveIso !== self.iso && <> (lodge by {formatIso(self.effectiveIso, "long")} because it falls on a weekend)</>}. Also due now: agent clients with a prior-year return still outstanding at 30 June 2026</li>
              <li><strong>{R.agentDueDateLargeLiability}</strong> — agent clients whose latest return had a tax liability of $20,000 or more</li>
              <li><strong>{R.agentDueDateMostPeople}</strong> — most other agent clients{agent.effectiveIso !== agent.iso && <> (next business day {formatIso(agent.effectiveIso, "long")})</>}</li>
              <li><strong>{R.agentConcessionDate}</strong> — concession date for 15 May agent returns, if any payment is also made by then</li>
            </ul>
            <p>Your {R.incomeYear} return uses the {R.incomeYear} rates, with a {pct(TAX_BRACKETS_2025_26[1].rate)} second bracket. See the <Link href="/tax-return-2026/">2026 tax return guide</Link> for what changed, or check the rates on our <Link href="/tax-brackets/">Income Tax Brackets</Link> page.</p>
          </section>

          {/* ===== SECTION 4: Employer/Business Tax Deadlines ===== */}
          <section><h2 style={H}>What Are the Employer and Business Tax Deadlines?</h2>
            <p>Businesses lodge <strong>BAS quarterly or monthly</strong>, employers finalise STP by <strong>14 July</strong>, and since Payday Super started on {SUPER_GUARANTEE.paydaySuperStart}, <strong>super must reach the fund within {SGC.current.businessDaysToPay} business days of every payday</strong>. Businesses with GST turnover of $20 million or more must lodge BAS monthly.</p>

            <h3 style={H}>Business Activity Statement (BAS) Deadlines for {Y.incomeYear}</h3>
            <p>Quarterly BAS covers GST, PAYG withholding and PAYG instalments. If you lodge online, you may get an extra 2 weeks for quarters 1, 3 and 4. Quarter 2 does not get the extra time because its due date already includes a one-month extension. Monthly BAS is due on the 21st of the following month.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Quarter</th><th className="px-5 py-3">Period</th><th className="px-5 py-3 text-right">Due Date</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {q.map((row) => (
                <tr key={row.q}><td className="px-5 py-3">{row.q}</td><td className="px-5 py-3">{row.period}</td><td className="px-5 py-3 text-right font-medium"><DueDate iso={row.iso} effectiveIso={row.effectiveIso} /></td></tr>
              ))}
            </tbody></table></div></div>
            <p>If you are voluntarily registered for GST and report annually, your annual GST return is due {formatIso(RETURN_DATES_2026.annualGstReturn.iso, "long")}.</p>

            <h3 style={H}>Single Touch Payroll (STP) Finalisation</h3>
            <p>Employers must make their STP finalisation declaration by <strong>14 July</strong> each year: 14 July 2026 for {R.incomeYear} and 14 July 2027 for {Y.incomeYear}. Employers with 20 or more employees have until <strong>30 September</strong> to finalise closely held payees, such as family members. Until you finalise, your employees&rsquo; income statements won&rsquo;t show as &quot;tax ready&quot;.</p>
            <p>To estimate the full cost of an employee, including super and payroll tax, use our <Link href="/employer-cost-calculator/">Employer Cost Calculator</Link>.</p>
          </section>

          {/* ===== SECTION 5: Late Lodgment Penalties ===== */}
          <section><h2 style={H}>What Happens If You Lodge Late?</h2>
            <p>The ATO can charge a failure-to-lodge (FTL) penalty of <strong>one penalty unit for every {PENALTY_UNIT.ftlDaysPerUnit} days or part of that</strong> the return is overdue, up to <strong>{PENALTY_UNIT.ftlMaxUnits} penalty units</strong>. A penalty unit is <strong>{formatAUD(PENALTY_UNIT.amount)}</strong> from {PENALTY_UNIT.from} (it was {formatAUD(PENALTY_UNIT.previousAmount)} from {PENALTY_UNIT.previousPeriod}). A {R.incomeYear} return lodged late after {R.selfLodgeDueDate} uses the new amount, so the most an individual can be charged is <strong>{formatAUD(FTL_MAX_INDIVIDUAL)}</strong>.</p>
            <p>The penalty is doubled for medium withholders and multiplied by five for large withholders. The ATO usually writes to you before it applies a penalty.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Days late</th><th className="px-5 py-3">Penalty units</th><th className="px-5 py-3 text-right">Individual / small withholder</th><th className="px-5 py-3 text-right">Medium withholder (x{PENALTY_UNIT.mediumWithholderMultiplier})</th><th className="px-5 py-3 text-right">Large withholder (x{PENALTY_UNIT.largeWithholderMultiplier})</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {units.map((n) => (
                <tr key={n}>
                  <td className="px-5 py-3">{n === PENALTY_UNIT.ftlMaxUnits ? `${(n - 1) * PENALTY_UNIT.ftlDaysPerUnit + 1}+ days` : `${(n - 1) * PENALTY_UNIT.ftlDaysPerUnit + 1} – ${n * PENALTY_UNIT.ftlDaysPerUnit} days`}</td>
                  <td className="px-5 py-3">{n}{n === PENALTY_UNIT.ftlMaxUnits ? " (max)" : ""}</td>
                  <td className="px-5 py-3 text-right font-medium">{formatAUD(n * PENALTY_UNIT.amount)}</td>
                  <td className="px-5 py-3 text-right font-medium">{formatAUD(n * PENALTY_UNIT.amount * PENALTY_UNIT.mediumWithholderMultiplier)}</td>
                  <td className="px-5 py-3 text-right font-medium">{formatAUD(n * PENALTY_UNIT.amount * PENALTY_UNIT.largeWithholderMultiplier)}</td>
                </tr>
              ))}
            </tbody></table></div></div>
            <p>Late BAS can attract the same FTL penalty. Unpaid tax also attracts the general interest charge ({pct(GENERAL_INTEREST_CHARGE.annualRate)} a year for {GENERAL_INTEREST_CHARGE.quarter}; the rate resets every quarter). Late super attracts the <strong>Super Guarantee Charge</strong> (SGC), explained in the super section below.</p>
          </section>

          {/* ===== SECTION 6: How to Lodge ===== */}
          <section><h2 style={H}>How Do You Lodge Your Tax Return?</h2>
            <p>You can lodge through <strong>myTax (via myGov)</strong>, through a registered tax agent, or on paper. myTax is the fastest: most returns are processed in <strong>{R.onlineProcessingBusinessDays} business days</strong>.</p>

            <h3 style={H}>Step-by-Step: Lodging via myTax</h3>
            <ol>
              <li><strong>Log in to myGov</strong> at my.gov.au and link the ATO. To link for the first time you need your tax file number and identity details.</li>
              <li><strong>Wait for your income statement</strong> to show as &quot;tax ready&quot;. Employers must finalise it through STP by 14 July, and the ATO has most other pre-fill data by {R.prefillReady}.</li>
              <li><strong>Check the pre-filled information</strong> — salary, bank interest, dividends and government payments. Add any income that is missing, such as rent or freelance work.</li>
              <li><strong>Claim your deductions</strong> — work-related expenses, working from home at {R.wfhFixedRateCents}c per hour for {R.incomeYear}, self-education and donations. Keep records for every claim.</li>
              <li><strong>Check your offsets</strong> — the <Link href="/low-income-tax-offset/">Low Income Tax Offset</Link> is applied automatically. Others, such as the zone tax offset, need you to enter details.</li>
              <li><strong>Review your estimate</strong> — myTax shows your refund or amount owing before you submit. Cross-check it with our <Link href="/tax-return-calculator/">Tax Return Calculator</Link>.</li>
              <li><strong>Submit</strong> — most refunds are issued within <strong>{R.onlineRefundTypical}</strong>. If you owe tax, pay by the due date on your notice of assessment to avoid the general interest charge.</li>
            </ol>

            <h3 style={H}>Using a Registered Tax Agent</h3>
            <p>Most agent clients have until <strong>{R.agentDueDateMostPeople}</strong> to lodge their {R.incomeYear} return, as long as they are on the agent&rsquo;s client list by {R.selfLodgeDueDate}. The agent&rsquo;s fee is deductible in the year you pay it.</p>
          </section>

          {/* ===== SECTION 7: PAYG Instalments ===== */}
          <section><h2 style={H}>What Are the Key Dates for PAYG Instalments?</h2>
            <p>Quarterly PAYG instalments for {Y.incomeYear} are due on <strong>{q.map((row) => formatIso(row.iso)).join(", ")}</strong>. If you pay one annual instalment and a tax agent lodges your return, your annual instalment is due <strong>{formatIso(RETURN_DATES_2026.annualPaygInstalment.iso, "long")}</strong>. If you lodge your own return, you just lodge it by {R.selfLodgeDueDate}.</p>
            <p>The ATO puts you into PAYG instalments if you have business or investment income over its thresholds. It works out your instalment amount or rate from your latest tax return. Primary producers and special professionals may pay two instalments instead: 75% by 28 April and the rest by 28 July.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Instalment</th><th className="px-5 py-3">Period Covered</th><th className="px-5 py-3 text-right">Due Date</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {q.map((row) => (
                <tr key={row.q}><td className="px-5 py-3">{row.q}</td><td className="px-5 py-3">{row.period}</td><td className="px-5 py-3 text-right font-medium"><DueDate iso={row.iso} effectiveIso={row.effectiveIso} /></td></tr>
              ))}
              <tr className="bg-sandstone/50"><td className="px-5 py-3 font-medium">Annual</td><td className="px-5 py-3">Full {R.incomeYear}</td><td className="px-5 py-3 text-right font-medium"><DueDate iso={RETURN_DATES_2026.annualPaygInstalment.iso} effectiveIso={RETURN_DATES_2026.annualPaygInstalment.effectiveIso} /></td></tr>
            </tbody></table></div></div>
            <p>You can vary your instalments on your activity statement before the due date. If you vary them too low, you may be charged the general interest charge on the shortfall. For tax withheld from employees&rsquo; wages, see the <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link>.</p>
          </section>

          {/* ===== SECTION 8: Super Guarantee Due Dates ===== */}
          <section><h2 style={H}>When Are Super Guarantee Payments Due?</h2>
            <p>From {SUPER_GUARANTEE.paydaySuperStart}, there are <strong>no quarterly super due dates</strong>. Under <Link href="/payday-super/">Payday Super</Link>, employers must pay {pct(SUPER_GUARANTEE.rate)} super on each payday, and it must be <strong>received by the employee&rsquo;s fund within {SGC.current.businessDaysToPay} business days</strong> of that payday. For a new employee, or the first payment to a new fund, you have {SGC.current.businessDaysNewEmployee} business days.</p>
            <p>Super is now worked out on <strong>qualifying earnings</strong>, and the maximum contribution base is an annual figure: <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong> for {Y.incomeYear}, so the most SG owed for one employee this year is {formatAUD(SUPER_GUARANTEE.maxSGAnnual, 2)}. Our <Link href="/payday-super/">Payday Super calculator</Link> works out the super and earliest due date for each pay.</p>
            <p>The old quarterly system finished with the April–June 2026 quarter:</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Obligation</th><th className="px-5 py-3">Applies to</th><th className="px-5 py-3 text-right">Due</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Last quarterly SG payment</td><td className="px-5 py-3">Earnings paid April – June 2026</td><td className="px-5 py-3 text-right font-medium">{formatIso(LEGACY_SUPER_DATES.finalQuarterSG.iso)}</td></tr>
              <tr><td className="px-5 py-3">SGC statement, if that payment was late</td><td className="px-5 py-3">April – June 2026 quarter</td><td className="px-5 py-3 text-right font-medium">{formatIso(LEGACY_SUPER_DATES.finalQuarterStatement.iso)}</td></tr>
              <tr className="bg-sandstone/50"><td className="px-5 py-3 font-medium">Payday Super</td><td className="px-5 py-3">Qualifying earnings paid from {SUPER_GUARANTEE.paydaySuperStart}</td><td className="px-5 py-3 text-right font-medium">{SGC.current.businessDaysToPay} business days after each payday</td></tr>
            </tbody></table></div></div>
            <p>Late super attracts the <strong>Super Guarantee Charge</strong> (SGC). For earnings paid from {SUPER_GUARANTEE.paydaySuperStart}, the SGC is made up of the shortfall, notional earnings at the general interest charge rate <strong>compounded daily</strong>, an <strong>administrative uplift of up to {pct(SGC.current.administrativeUpliftMax)}</strong> (reduced if you make a voluntary disclosure quickly and have no recent ATO assessment), and a choice loading where it applies. The new SGC is <strong>tax-deductible</strong>, and you no longer lodge an SGC statement: the ATO assesses the charge and sends a notice. For earnings paid up to 30 June 2026 the old rules still apply: {pct(SGC.legacy.nominalInterestRate)} nominal interest, a ${SGC.legacy.adminFeePerEmployeePerQuarter} per employee per quarter administration fee, and no deduction. Learn more in our <Link href="/superannuation-guide/">Superannuation Guide</Link>.</p>
          </section>

          {/* ===== SECTION 9: EOFY Checklist ===== */}
          <section><h2 style={H}>What Should You Do Before the End of the Financial Year?</h2>
            <p><strong>{Y.end}</strong> is the last day to take actions that reduce your taxable income for {Y.incomeYear}, such as concessional super contributions, prepaying deductible expenses and realising capital losses.</p>
            <ul>
              <li>Keep records for every work-related deduction you plan to claim</li>
              <li>Check your concessional super contributions against the <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)} annual cap</strong>. Employer super counts toward it, and under Payday Super more of it may land in {Y.incomeYear} than usual</li>
              <li>Prepay deductible expenses for up to 12 months ahead, such as income protection insurance or professional subscriptions</li>
              <li>Check your private hospital cover for the Medicare levy surcharge. For {Y.incomeYear} the thresholds are <strong>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}</strong> for singles and <strong>{formatAUD(MEDICARE_LEVY.surcharge.familyTier1.min - 1)}</strong> for families, with a surcharge of 1% to 1.5% above them</li>
              <li>Consider selling investments that have fallen in value to offset capital gains</li>
              <li>Make donations to deductible gift recipients (DGRs) before 30 June</li>
              <li>Plan salary sacrifice for the new year from 1 July — see our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link></li>
            </ul>
          </section>

          {/* ===== SECTION 10: Changes in FY2026-27 ===== */}
          <section><h2 style={H}>What Tax Changes Apply in {Y.incomeYear}?</h2>
            <p>The biggest changes on {Y.start} are a lower second tax rate and Payday Super. The SG rate stays at <strong>{pct(SUPER_GUARANTEE.rate)}</strong> and the Medicare levy at <strong>{pct(MEDICARE_LEVY.rate)}</strong>.</p>
            <ul>
              <li><strong>Second tax bracket</strong> — {pct(TAX_BRACKETS_2026_27[1].rate)} on income from $18,201 to $45,000, down from {pct(TAX_BRACKETS_2025_26[1].rate)}</li>
              <li><strong>Payday Super</strong> — super is due within {SGC.current.businessDaysToPay} business days of each payday, on qualifying earnings</li>
              <li><strong>Maximum super contribution base</strong> — {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year (previously a quarterly figure)</li>
              <li><strong>Concessional contributions cap</strong> — {formatAUD(SUPER_GUARANTEE.concessionalCap)}; non-concessional cap {formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</li>
              <li><strong>Study loan repayment threshold</strong> — {formatAUD(HECS_HELP.minimumThreshold)} of repayment income</li>
              <li><strong>Medicare levy surcharge thresholds</strong> — {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} for singles, {formatAUD(MEDICARE_LEVY.surcharge.familyTier1.min - 1)} for families</li>
              <li><strong>Penalty unit</strong> — {formatAUD(PENALTY_UNIT.amount)}, up from {formatAUD(PENALTY_UNIT.previousAmount)}</li>
              <li><strong>Car expenses</strong> — {R.carCentsPerKmNextYear}c per km for {Y.incomeYear}, up from {R.carCentsPerKm}c</li>
            </ul>
            <p>See all of them on our <Link href="/tax-changes-2026-27/">2026-27 tax changes</Link> page, or see your take-home pay at current rates with the <Link href="/">Pay Calculator</Link>.</p>
          </section>

          {/* ---- CONTEXT BORDER ---- */}

          {/* ===== SECTION 11: Related Resources ===== */}
          <section><h2 style={H}>Related Resources</h2>
            <p>Explore these guides and calculators for related Australian tax and payroll topics:</p>
            <ul>
              <li><Link href="/tax-return-calculator/">Tax Return Calculator</Link> — estimate your {R.incomeYear} refund or tax payable on the {R.incomeYear} rates</li>
              <li><Link href="/tax-return-2026/">Tax Return 2026 Guide</Link> — deadlines, refund times and what changed for the {R.incomeYear} return</li>
              <li><Link href="/payday-super/">Payday Super</Link> — how super on payday works and when each payment is due</li>
              <li><Link href="/tax-brackets/">Income Tax Brackets</Link> — marginal tax rates, thresholds and worked examples</li>
              <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — employer SG obligations, contribution caps and Division 293 tax</li>
              <li><Link href="/tax-refund-guide/">Tax Refund Guide</Link> — how refunds are worked out and common reasons for ATO adjustments</li>
              <li><Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> — weekly, fortnightly and monthly withholding amounts</li>
            </ul>
          </section>

          {/* ===== SECTION 12: FAQs ===== */}
          <section><h2 style={H}>Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 style={H}>When does the Australian financial year start and end?</h3>
                <p>The Australian financial (income) year runs from <strong>1 July to 30 June</strong>. {Y.incomeYear} started on {Y.start} and ends on {Y.end}. The return you lodge in 2026 is for {R.incomeYear}, which ended on {R.incomeYearEnd}.</p>
              </div>
              <div>
                <h3 style={H}>When is the {R.incomeYear} tax return due?</h3>
                <p>If you lodge it yourself, by <strong>{R.selfLodgeDueDate}</strong>{self.effectiveIso !== self.iso && <> — it falls on a weekend, so the ATO accepts it on {formatIso(self.effectiveIso, "long")}</>}. With a registered tax agent, most people have until <strong>{R.agentDueDateMostPeople}</strong> if they are on the agent&rsquo;s list by {R.selfLodgeDueDate}.</p>
              </div>
              <div>
                <h3 style={H}>Can I lodge my tax return before 14 July?</h3>
                <p>Yes, you can lodge from <strong>1 July</strong>, but it is safer to wait until your income statement shows as &quot;tax ready&quot;. Employers have until 14 July to finalise it, and the ATO has most other pre-fill data by {R.prefillReady}.</p>
              </div>
              <div>
                <h3 style={H}>What is the penalty for not lodging a tax return?</h3>
                <p>The ATO can charge a failure-to-lodge penalty of <strong>{formatAUD(PENALTY_UNIT.amount)} for every {PENALTY_UNIT.ftlDaysPerUnit} days or part of that</strong> the return is overdue, up to <strong>{formatAUD(FTL_MAX_INDIVIDUAL)}</strong> ({PENALTY_UNIT.ftlMaxUnits} penalty units) for an individual. The ATO usually writes to you first.</p>
              </div>
              <div>
                <h3 style={H}>When are quarterly BAS due in {Y.incomeYear}?</h3>
                <p>Quarterly BAS is due on <strong>{q.map((row) => formatIso(row.iso, "long")).join(", ")}</strong>.{q[1].effectiveIso !== q[1].iso && <> The quarter 2 date falls on a Sunday and the next day is a public holiday in WA, so you can lodge and pay on {formatIso(q[1].effectiveIso, "long")}.</>} Monthly BAS is due on the 21st of the following month. Lodging online may give you 2 extra weeks for quarters 1, 3 and 4.</p>
              </div>
              <div>
                <h3 style={H}>Are there still quarterly super due dates?</h3>
                <p>No. The last quarterly payment was due {SGC.legacy.finalQuarterSGDue}, for April to June 2026. Since {SUPER_GUARANTEE.paydaySuperStart}, super must reach the fund within {SGC.current.businessDaysToPay} business days of each payday under <Link href="/payday-super/">Payday Super</Link>.</p>
              </div>
              <div>
                <h3 style={H}>What happens if my employer pays super late?</h3>
                <p>They are liable for the <strong>Super Guarantee Charge</strong>. From {SUPER_GUARANTEE.paydaySuperStart}, it is made up of the shortfall, notional earnings at the general interest charge rate compounded daily, an administrative uplift of up to {pct(SGC.current.administrativeUpliftMax)}, and a choice loading where it applies. The charge is now tax-deductible. For earnings paid up to 30 June 2026 the old quarterly rules still apply.</p>
              </div>
              <div>
                <h3 style={H}>How long does the ATO take to process a tax refund?</h3>
                <p>The ATO says most myTax returns are processed in <strong>{R.onlineProcessingBusinessDays} business days</strong> and most refunds are issued within <strong>{R.onlineRefundTypical}</strong>. For paper returns, most refunds are issued within <strong>{R.paperRefundBusinessDays} business days</strong>. It takes longer if the ATO needs to check your return.</p>
              </div>
              <div>
                <h3 style={H}>Do PAYG instalments reduce my end-of-year tax bill?</h3>
                <p>Yes. PAYG instalments are <strong>prepayments of your expected tax</strong>. They are credited against your final assessment, so you usually get a smaller bill, or a refund, when you lodge.</p>
              </div>
              <div>
                <h3 style={H}>What is the maximum super contribution base for {Y.incomeYear}?</h3>
                <p>It is <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong> for the year. Under Payday Super it became an annual figure instead of a quarterly one. Employers don&rsquo;t have to pay SG on qualifying earnings above it, so the most SG owed for one employee is {formatAUD(SUPER_GUARANTEE.maxSGAnnual, 2)}.</p>
              </div>
              <div>
                <h3 style={H}>What is the concessional super contributions cap for {Y.incomeYear}?</h3>
                <p>The concessional (before-tax) cap is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong>. It includes employer SG, salary sacrifice and personal contributions you claim a deduction for. Contributions above the cap are added to your income and taxed at your marginal rate.</p>
              </div>
            </div>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Dates are taken from the ATO pages listed below and checked on 23 September 2026. Tax return dates come from the ATO&rsquo;s myTax page and the registered agent lodgment program for individuals and trusts. BAS and PAYG instalment dates come from the ATO&rsquo;s BAS and PAYG instalment due-date pages. Where a date falls on a weekend or on a public holiday for a whole state or territory, the next business day follows the ATO&rsquo;s own public holiday table. Super dates follow the ATO&rsquo;s Payday Super deadlines. Penalty amounts use the ATO&rsquo;s penalty unit table.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {(() => { const a = getGuideAuthorship("tax-calendar"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/tax-return-calculator/" label="Tax Return Calculator" /><SidebarLink href="/tax-return-2026/" label="Tax Return 2026" /><SidebarLink href="/payday-super/" label="Payday Super" /><SidebarLink href="/tax-refund-guide/" label="Tax Refund Guide" /><SidebarLink href="/tax-brackets/" label="Tax Brackets" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}

function DateCard({ date, title, desc, colour }: { date: string; title: string; desc: string; colour: string }) {
  const colourMap: Record<string, string> = { green: "border-l-eucalyptus bg-eucalyptus-light/30", blue: "border-l-eucalyptus-dark bg-eucalyptus-light/40", red: "border-l-ochre bg-ochre/10", amber: "border-l-amber-500 bg-amber-50" };
  return (<div className={`border-l-4 rounded-r-lg p-4 ${colourMap[colour] || colourMap.blue}`}><div className="flex items-center justify-between mb-1"><span className="text-sm font-bold text-navy">{title}</span><span className="text-xs font-medium text-warmgray-light bg-white px-2 py-1 rounded-full border border-sandstone-dark/20">{date}</span></div><p className="text-sm text-warmgray">{desc}</p></div>);
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
