"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const PERIOD_MULTIPLIERS = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
} as const;

type Frequency = keyof typeof PERIOD_MULTIPLIERS;
type Mode = "ytd" | "annualise";
type CountMethod = "periods" | "date";

/** 1 July of the financial year that the given date falls in. */
function fyStartFor(d: Date): Date {
  const year = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  return new Date(year, 6, 1);
}

/** Number of pays received between the FY start and the payslip date (inclusive of the first cycle). */
function periodsFromDate(dateStr: string, frequency: Frequency): number | null {
  if (!dateStr) return null;
  const payslip = new Date(`${dateStr}T00:00:00`);
  if (isNaN(payslip.getTime())) return null;
  const fyStart = fyStartFor(payslip);
  const max = PERIOD_MULTIPLIERS[frequency];

  if (frequency === "monthly") {
    const months = (payslip.getFullYear() - fyStart.getFullYear()) * 12 + (payslip.getMonth() - 6);
    return clamp(months + 1, 1, max);
  }

  const days = Math.floor((payslip.getTime() - fyStart.getTime()) / 86_400_000);
  const cycle = frequency === "weekly" ? 7 : 14;
  return clamp(Math.floor(days / cycle) + 1, 1, max);
}

const SOURCES_LIST: SourceLink[] = [
  { title: "PAYG withholding", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/payg-withholding", publisher: SOURCES.ato.name },
  { title: "Pay slips", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips", publisher: SOURCES.fwo.name },
];

const REFERENCE_WEEKLY_PAYS = [800, 1000, 1500, 2000, 2500];
const REFERENCE_WEEKS = [13, 26, 39, 52];

export default function YTDIncomeCalculatorPage() {
  const [mode, setMode] = useState<Mode>("ytd");
  const [frequency, setFrequency] = useState<Frequency>("fortnightly");
  const [payPerPeriod, setPayPerPeriod] = useState(2000);
  const [ytdAmount, setYtdAmount] = useState(26000);
  const [countMethod, setCountMethod] = useState<CountMethod>("periods");
  const [periodsInput, setPeriodsInput] = useState(13);
  const [payslipDate, setPayslipDate] = useState("");

  const maxPeriods = PERIOD_MULTIPLIERS[frequency];

  const periodsElapsed = useMemo(() => {
    if (countMethod === "date") {
      const fromDate = periodsFromDate(payslipDate, frequency);
      if (fromDate !== null) return fromDate;
    }
    return clamp(periodsInput, 1, maxPeriods);
  }, [countMethod, payslipDate, frequency, periodsInput, maxPeriods]);

  const freqLabel = frequency === "weekly" ? "week" : frequency === "fortnightly" ? "fortnight" : "month";

  // Mode 1 — Calculate YTD from per-period pay
  const ytdGross = payPerPeriod * periodsElapsed;

  // Mode 2 — Annualise from a YTD figure
  const avgPerPeriod = periodsElapsed > 0 ? ytdAmount / periodsElapsed : 0;

  const projectedAnnual = mode === "ytd" ? payPerPeriod * maxPeriods : avgPerPeriod * maxPeriods;
  const breakdown = useMemo(() => calculatePayBreakdown({ grossSalary: projectedAnnual }), [projectedAnnual]);
  const pctOfYear = Math.round((periodsElapsed / maxPeriods) * 100);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">YTD Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            YTD Calculator — Year to Date Income Australia
          </h1>
          <p className="text-lg text-warmgray">
            Year to date (YTD) income is everything you have earned since 1 July, the start of the Australian
            financial year, up to your latest payslip. Use this YTD calculator to add up your year-to-date gross
            pay, or annualise a YTD figure into a projected annual salary and tax estimate.
          </p>
          <p className="text-sm text-warmgray mt-3">Updated: July 2026.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">

                {/* Inputs */}
                <div className="bg-white p-6 rounded-2xl border border-sandstone-dark/10 shadow-sm md:w-80">
                  <h2 className="text-lg font-semibold text-navy mb-5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Pay Details</h2>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to do?</label>
                      <div className="grid grid-cols-1 gap-2">
                        {([
                          { key: "ytd", label: "Calculate my YTD income" },
                          { key: "annualise", label: "Annualise my YTD figure" },
                        ] as { key: Mode; label: string }[]).map((m) => (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => setMode(m.key)}
                            className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors text-left ${
                              mode === m.key
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How often are you paid?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(PERIOD_MULTIPLIERS) as Frequency[]).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setFrequency(f)}
                            className={`py-2 px-2 border rounded-md text-xs font-medium transition-colors ${
                              frequency === f
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {mode === "ytd" ? (
                      <div>
                        <label htmlFor="payPerPeriod" className="block text-sm font-medium text-gray-700 mb-1">Gross pay per {freqLabel}:</label>
                        <div className="flex items-center">
                          <span className="text-warmgray-light mr-2 font-medium">$</span>
                          <input type="number" id="payPerPeriod" min={0} max={1000000} step={50} value={payPerPeriod}
                            onChange={(e) => setPayPerPeriod(clamp(Number(e.target.value || 0), 0, 1000000))}
                            className="block w-full text-lg font-bold text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="ytdAmount" className="block text-sm font-medium text-gray-700 mb-1">YTD gross on your payslip:</label>
                        <div className="flex items-center">
                          <span className="text-warmgray-light mr-2 font-medium">$</span>
                          <input type="number" id="ytdAmount" min={0} max={10000000} step={500} value={ytdAmount}
                            onChange={(e) => setYtdAmount(clamp(Number(e.target.value || 0), 0, 10000000))}
                            className="block w-full text-lg font-bold text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Count pays by:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { key: "periods", label: "Number of pays" },
                          { key: "date", label: "Payslip date" },
                        ] as { key: CountMethod; label: string }[]).map((c) => (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setCountMethod(c.key)}
                            className={`py-2 px-2 border rounded-md text-xs font-medium transition-colors ${
                              countMethod === c.key
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {countMethod === "periods" ? (
                      <div>
                        <label htmlFor="periodsInput" className="block text-sm font-medium text-gray-700 mb-1">Pays received this financial year:</label>
                        <input type="number" id="periodsInput" min={1} max={maxPeriods} step={1} value={periodsInput}
                          onChange={(e) => setPeriodsInput(clamp(Number(e.target.value || 1), 1, maxPeriods))}
                          className="block w-full text-lg font-bold text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        <p className="text-xs text-warmgray-light mt-1">Max {maxPeriods} {frequency} pays per financial year.</p>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="payslipDate" className="block text-sm font-medium text-gray-700 mb-1">Date of your latest payslip:</label>
                        <input type="date" id="payslipDate" value={payslipDate}
                          onChange={(e) => setPayslipDate(e.target.value)}
                          className="block w-full text-sm font-medium text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        <p className="text-xs text-warmgray-light mt-1">
                          {payslipDate && periodsFromDate(payslipDate, frequency) !== null
                            ? `≈ ${periodsFromDate(payslipDate, frequency)} ${frequency} pays since 1 July`
                            : "We count pay cycles from 1 July for you."}
                        </p>
                      </div>
                    )}
                  </form>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-eucalyptus-dark rounded-2xl p-6 text-center text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="text-sm font-medium text-eucalyptus-light uppercase tracking-wider mb-2 relative z-10">
                      {mode === "ytd" ? "Your YTD Gross Income" : "Projected Annual Gross Income"}
                    </div>
                    <div className="text-5xl font-extrabold mb-1 relative z-10">
                      {formatAUD(mode === "ytd" ? ytdGross : projectedAnnual)}
                    </div>
                    <div className="text-sm text-eucalyptus-light mt-2 relative z-10">
                      {mode === "ytd" ? (
                        <>After <strong>{periodsElapsed}</strong> {frequency} pays of <strong>{formatAUD(payPerPeriod)}</strong> ({pctOfYear}% of the financial year)</>
                      ) : (
                        <>Based on <strong>{formatAUD(ytdAmount)}</strong> YTD across <strong>{periodsElapsed}</strong> {frequency} pays (avg {formatAUD(avgPerPeriod)}/{freqLabel})</>
                      )}
                    </div>
                  </div>

                  {/* Breakdown Box */}
                  <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone-dark/10 px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        {mode === "ytd" ? "If you keep earning at this rate" : "Projected full-year tax position"}
                      </h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 text-sm">
                        <div className="font-semibold text-warmgray-light pb-2 border-b border-sandstone-dark/20">Component</div>
                        <div className="font-semibold text-warmgray-light text-right pb-2 border-b border-sandstone-dark/20">Projected Annual</div>

                        <div className="text-gray-700 font-medium">Gross Income</div>
                        <div className="text-right text-navy font-bold">{formatAUD(projectedAnnual)}</div>

                        <div className="text-warmgray">Income Tax</div>
                        <div className="text-right text-ochre">-{formatAUD(breakdown.netIncomeTax)}</div>

                        <div className="text-warmgray">Medicare Levy</div>
                        <div className="text-right text-ochre">-{formatAUD(breakdown.medicareLevy)}</div>

                        <div className="border-t border-sandstone-dark/20 pt-2 font-bold text-navy">Net Take-Home</div>
                        <div className="border-t border-sandstone-dark/20 pt-2 text-right font-extrabold text-eucalyptus-dark bg-eucalyptus-light/30 px-2 rounded">{formatAUD(breakdown.takeHomePay)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-eucalyptus-light/30 border border-eucalyptus-light p-4 rounded-xl flex items-start text-sm">
                    <div className="mr-3 mt-0.5 text-eucalyptus">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div className="text-navy">
                      <strong>New financial year note:</strong> YTD figures reset to zero on 1 July each year. If your
                      payslip is from early in the financial year, the YTD number will look small — that is normal.
                      Compare it against the projected annual figure above instead.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* --- WHAT DOES YTD MEAN? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Does YTD Mean on a Payslip?</h2>
            <p className="mb-4 text-warmgray">
              YTD stands for <strong>year to date</strong>. On an Australian payslip, YTD is the running total of
              everything you have earned and everything that has been withheld since 1 July — the start of the
              financial year — up to and including that payslip. It is not a calendar-year figure.
            </p>
            <p className="mb-4 text-warmgray">
              Most payroll systems show several YTD columns side by side with your current pay:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>YTD gross</strong> — total earnings before tax, including overtime, bonuses, allowances, and leave loading</li>
              <li><strong>YTD tax</strong> — total PAYG withholding your employer has sent to the ATO on your behalf (see the <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline">PAYG withholding tables</Link> for how each pay is calculated)</li>
              <li><strong>YTD STSL</strong> — total study loan (HECS-HELP) amounts withheld, shown separately from income tax (see our <Link href="/stsl-on-payslip/" className="text-eucalyptus-dark hover:underline">guide to STSL on your payslip</Link>)</li>
              <li><strong>YTD super</strong> — total employer superannuation guarantee contributions accrued</li>
              <li><strong>YTD net</strong> — total take-home pay actually deposited into your bank account</li>
            </ul>
            <p className="text-warmgray">
              If any of these labels look unfamiliar, our guide to <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">understanding your payslip</Link> walks
              through every line item Australian employers are required to show.
            </p>
          </section>

          {/* --- HOW TO CALCULATE --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Calculate YTD Income</h2>
            <p className="mb-4 text-warmgray">
              To calculate YTD income, multiply your gross pay per period by the number of pays you have received
              since 1 July. The formula is:
            </p>
            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-5 mb-4 text-center">
              <p className="text-navy font-semibold">YTD gross = gross pay per period × pays received this financial year</p>
            </div>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Find your gross pay per period</strong> — the before-tax amount on your payslip, not the net deposit.</li>
              <li><strong>Count the pays received since 1 July</strong> — check payslip dates, or use the payslip-date option in the calculator above and we count the cycles for you.</li>
              <li><strong>Multiply the two numbers</strong> — the result is your YTD gross income.</li>
            </ol>
            <p className="text-warmgray">
              <strong>Worked example:</strong> Priya earns <strong>$2,000 per fortnight</strong> and has received
              <strong> 13 fortnightly pays</strong> since 1 July. Her YTD gross is 13 × $2,000 = <strong>$26,000</strong>,
              exactly half way through the financial year&apos;s 26 fortnights.
            </p>
          </section>

          {/* --- HOW TO ANNUALISE --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Annualise Your YTD Income</h2>
            <p className="mb-4 text-warmgray">
              Annualising converts a part-year YTD figure into a projected full-year income. Lenders, real estate
              agents, and Centrelink all use annualised income to assess applications, and it is the fastest way to
              sanity-check whether your employer is withholding the right amount of tax.
            </p>
            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-5 mb-4 text-center">
              <p className="text-navy font-semibold">Projected annual income = (YTD gross ÷ pays received) × pays per year</p>
            </div>
            <p className="mb-4 text-warmgray">
              <strong>Worked example:</strong> Tom&apos;s payslip shows <strong>$39,000 YTD</strong> after
              <strong> 26 weekly pays</strong>. His average pay is $39,000 ÷ 26 = $1,500 per week, so his projected
              annual income is $1,500 × 52 = <strong>$78,000</strong>. Feeding that gross figure into the
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline"> take-home pay calculator</Link> shows
              exactly what should be left after tax.
            </p>
            <p className="text-warmgray">
              There are 52 weekly, 26 fortnightly, or 12 monthly pays in a standard financial year. If your income
              is irregular — overtime, casual shifts, commissions — annualising from a longer YTD window gives a
              more reliable projection than multiplying a single big or small pay.
            </p>
          </section>

          {/* --- WHY YTD MATTERS --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Your YTD Figure Matters</h2>
            <ul className="list-disc pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Home loan and rental applications</strong> — lenders annualise the YTD gross on your two most recent payslips to verify the income you declared. A YTD figure that annualises below your stated salary triggers follow-up questions, so it pays to check the maths before they do.</li>
              <li><strong>Estimating your tax refund</strong> — comparing YTD tax withheld against the tax actually payable on your projected annual income reveals whether you are heading for a refund or a bill. Run your projected income through the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">income tax calculator</Link> to see the target figure.</li>
              <li><strong>Catching payroll errors early</strong> — if YTD gross ÷ pays received does not equal your contracted per-period pay, something is off: a missed pay rise, unpaid overtime, or an incorrect tax treatment. YTD totals make errors visible that individual payslips hide.</li>
            </ul>
          </section>

          {/* --- FY CONTEXT --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>YTD and the Australian Financial Year</h2>
            <p className="mb-4 text-warmgray">
              Australian payslips track YTD against the <strong>financial year (1 July to 30 June)</strong>, not the
              calendar year. Every YTD column on your payslip resets to zero with the first pay after 1 July.
            </p>
            <p className="mb-4 text-warmgray">
              A new financial year has just begun, so payslips issued in July show only one or two pays&apos; worth
              of YTD income. That catches people out every year — a $2,000 YTD figure in mid-July is exactly on
              track for a $52,000 year for a fortnightly earner. Use the annualise mode above rather than judging
              the raw YTD number.
            </p>
            <p className="text-warmgray">
              The 30 June cut-off also means your final June payslip is the one that should match your income
              statement in myGov when your employer finalises Single Touch Payroll data for
              <Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline"> tax return</Link> time.
            </p>
          </section>

          {/* --- REFERENCE TABLE --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>YTD Income Reference Table</h2>
            <p className="mb-4 text-warmgray">
              The table below shows YTD gross income for common weekly pay amounts at each quarter of the financial
              year (13, 26, 39, and 52 weekly pays).
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Weekly Gross Pay</th>
                    {REFERENCE_WEEKS.map((w) => (
                      <th key={w} className="text-right px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">After {w} weeks</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  {REFERENCE_WEEKLY_PAYS.map((pay, idx) => (
                    <tr key={pay} className={idx % 2 === 1 ? "bg-sandstone/30" : ""}>
                      <td className="px-4 py-3 font-medium">{formatAUD(pay)}</td>
                      {REFERENCE_WEEKS.map((w) => (
                        <td key={w} className="px-4 py-3 text-right">{w === 52 ? <strong>{formatAUD(pay * w)}</strong> : formatAUD(pay * w)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray-light">
              *The &quot;After 52 weeks&quot; column equals the full-year gross salary. Figures are gross (before tax) amounts.
            </p>
          </section>

          {/* --- RELATED CALCULATORS --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Related Calculators Should You Use?</h2>
            <ul className="list-disc pl-6 space-y-2 text-warmgray">
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — turn your projected annual gross into net pay after tax, Medicare levy, and HECS-HELP</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — check the exact tax payable on your annualised income and compare it with your YTD tax withheld</li>
              <li><Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">Understanding Your Payslip</Link> — a line-by-line guide to every field on an Australian payslip, including all the YTD columns</li>
              <li><Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline">PAYG Withholding Tables</Link> — see how your employer calculates the tax withheld from each individual pay</li>
              <li><Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline">Gross Pay Calculator</Link> — reverse-calculate the gross salary needed to hit a target take-home amount</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">How this YTD calculator works:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>YTD mode multiplies your gross pay per period by the number of pays received since 1 July.</li>
              <li>Annualise mode divides your YTD gross by pays received, then multiplies by the pays in a full financial year (52 weekly / 26 fortnightly / 12 monthly).</li>
              <li>When counting pays from a payslip date, we assume your first pay of the financial year fell in the first pay cycle after 1 July — override the pay count manually if yours did not.</li>
              <li>Projected tax uses the FY{SITE_CONFIG.financialYear} resident tax brackets and 2% Medicare levy; HECS-HELP and salary sacrifice are excluded.</li>
            </ol>
          </MethodologyDisclosure>

          {/* --- FAQs --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="meaning" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What does YTD mean on a payslip?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">YTD means year to date. It is the running total of your earnings, tax withheld, and superannuation from 1 July (the start of the Australian financial year) up to that payslip. Every YTD column resets to zero with the first pay after 1 July.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="gross-net" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is the difference between YTD gross and YTD net?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">YTD gross is your total before-tax earnings for the financial year so far, including overtime, bonuses, and allowances. YTD net is the total that actually reached your bank account after PAYG tax, study loan withholding, and other deductions. Lenders and the ATO work from the gross figure.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does YTD gross include superannuation?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. Employer superannuation guarantee contributions (12% in FY{SITE_CONFIG.financialYear}) are paid on top of your gross salary and tracked in a separate YTD super column. YTD gross only covers your own earnings — salary, overtime, bonuses, allowances, and leave payments.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="wrong" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Why doesn&apos;t my YTD match my own calculation?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The usual culprits are pays that landed just before or after 1 July, a mid-year pay rise (so not every pay was the same amount), one-off payments like bonuses or leave loading, or unpaid leave reducing a pay cycle. Count the actual payslips issued since 1 July and add each gross amount — the running total should reconcile exactly. If it still doesn&apos;t, ask payroll to check.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="reset" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does YTD reset on 1 July?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Australian payroll systems reset all YTD totals to zero at the start of the financial year on 1 July. Your first July payslip will show YTD figures equal to just that single pay. Your final June payslip holds the full-year totals that flow into your income statement in myGov.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="lenders" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How do banks use YTD income on loan applications?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Lenders annualise the YTD gross on your most recent payslips — dividing by the number of pay cycles elapsed and multiplying out to a full year — and cross-check the result against your stated salary and employment contract. Early in the financial year, many lenders will also ask for last year&apos;s income statement because a small YTD sample is less reliable.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="mid-year" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>I started my job part-way through the year — how do I annualise?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Count pays from your first payslip rather than from 1 July. If you have received 8 fortnightly pays of $2,500 since starting, your annualised income is $2,500 × 26 = $65,000 even though your YTD shows only $20,000. Enter the actual number of pays you have received into the calculator above and it handles this correctly.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}
