"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Printer, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculatePayBreakdown,
  calculateIncomeTax,
  calculateMedicareLevy,
  calculateHECS,
  formatAUD,
  formatNegAUD,
  SUPER_GUARANTEE,
  EMPLOYMENT,
  TAX_FREE_THRESHOLD,
  SITE_CONFIG,
} from "@/lib/constants";

const PERIODS_PER_YEAR = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
} as const;

type Frequency = keyof typeof PERIODS_PER_YEAR;
type PayBasis = "hourly" | "salary";

const inputClass =
  "block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 text-navy";

function clampNum(value: string, min: number, max: number): number {
  const n = Number(value || 0);
  return Math.min(max, Math.max(min, isNaN(n) ? 0 : n));
}

function formatDateAU(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/**
 * The interactive part of /payslip-generator/: hero and the generator card.
 * The static long-form content is server-rendered (payslip-generator-content.tsx)
 * and passed in as `children`, so it is not part of this client bundle.
 */
export default function PayslipGeneratorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  // Employer & employee
  const [businessName, setBusinessName] = useState("");
  const [abn, setAbn] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  // Pay period
  const [frequency, setFrequency] = useState<Frequency>("fortnightly");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [periodsCompleted, setPeriodsCompleted] = useState(1);

  // Earnings
  const [payBasis, setPayBasis] = useState<PayBasis>("hourly");
  const [hourlyRate, setHourlyRate] = useState(35);
  const [hoursWorked, setHoursWorked] = useState(76);
  const [annualSalary, setAnnualSalary] = useState(85000);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5);
  const [allowanceLabel, setAllowanceLabel] = useState("Allowance");
  const [allowanceAmount, setAllowanceAmount] = useState(0);

  // Tax & super
  const [claimTaxFreeThreshold, setClaimTaxFreeThreshold] = useState(true);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [manualTax, setManualTax] = useState("");
  const [superFund, setSuperFund] = useState("");

  const periodsPerYear = PERIODS_PER_YEAR[frequency];

  const calc = useMemo(() => {
    const derivedHourlyRate =
      payBasis === "hourly"
        ? hourlyRate
        : annualSalary / (52 * EMPLOYMENT.standardWeeklyHours);

    const ordinaryEarnings =
      payBasis === "hourly"
        ? hourlyRate * hoursWorked
        : annualSalary / periodsPerYear;

    const overtimeEarnings = overtimeHours * derivedHourlyRate * overtimeMultiplier;
    const periodGross = ordinaryEarnings + overtimeEarnings + allowanceAmount;

    // Annualise the period gross to estimate PAYG withholding
    const annualisedGross = periodGross * periodsPerYear;

    let annualTax: number;
    if (claimTaxFreeThreshold) {
      const breakdown = calculatePayBreakdown({ grossSalary: annualisedGross, includeHECS });
      annualTax = breakdown.netIncomeTax + breakdown.medicareLevy + breakdown.hecsRepayment;
    } else {
      // No tax-free threshold claimed (e.g. second job): tax scales apply from the
      // first dollar. Approximated by shifting income above the threshold.
      const raw = calculateIncomeTax(annualisedGross + TAX_FREE_THRESHOLD, true);
      annualTax =
        Math.round(raw) +
        calculateMedicareLevy(annualisedGross) +
        (includeHECS ? calculateHECS(annualisedGross) : 0);
    }

    const autoTax = annualTax / periodsPerYear;
    const overrideTax = manualTax.trim() === "" ? null : clampNum(manualTax, 0, periodGross);
    const periodTax = overrideTax ?? autoTax;

    // Super Guarantee applies to Ordinary Time Earnings (excludes overtime)
    const oteBase = ordinaryEarnings + allowanceAmount;
    const superContribution = oteBase * SUPER_GUARANTEE.rate;

    const netPay = periodGross - periodTax;
    const n = Math.max(1, periodsCompleted);

    return {
      derivedHourlyRate,
      ordinaryEarnings,
      overtimeEarnings,
      periodGross,
      periodTax,
      autoTax,
      usingOverride: overrideTax !== null,
      superContribution,
      netPay,
      ytd: {
        gross: periodGross * n,
        tax: periodTax * n,
        net: netPay * n,
        super: superContribution * n,
        ordinary: ordinaryEarnings * n,
        overtime: overtimeEarnings * n,
        allowance: allowanceAmount * n,
      },
    };
  }, [
    payBasis, hourlyRate, hoursWorked, annualSalary, overtimeHours, overtimeMultiplier,
    allowanceAmount, periodsPerYear, claimTaxFreeThreshold, includeHECS, manualTax, periodsCompleted,
  ]);

  const frequencyLabel = frequency.charAt(0).toUpperCase() + frequency.slice(1);

  return (
    <div className="min-h-screen flex-grow">
      {/* Print isolation: only the payslip preview is visible when printing */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #payslip-print-area, #payslip-print-area * { visibility: visible !important; }
          #payslip-print-area {
            position: absolute !important;
            left: 0; top: 0; width: 100%;
            margin: 0 !important; padding: 24px !important;
            box-shadow: none !important; border: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Payslip Generator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Free Payslip Generator — Create Australian Payslips Online
          </h1>
          <p className="text-lg text-warmgray">
            A payslip generator creates a professional, Fair Work-compliant payslip from your pay details in seconds.
            Enter employer, employee, and earnings information below to build a payslip with PAYG withholding, superannuation,
            and year-to-date totals — then print it or save it as a PDF. Free, no signup, updated July 2026.
          </p>
          <TrustBar className="mt-4" />
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/70 border border-sandstone-dark/20 px-4 py-2.5 text-sm text-navy">
            <Lock className="h-4 w-4 text-eucalyptus-dark" />
            <span><strong>100% private:</strong> everything runs in your browser — no data is sent to a server or stored.</span>
          </div>
        </section>

        {/* TOOL */}
        <section className="max-w-6xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,380px)_1fr] gap-8 items-start">

                {/* INPUTS */}
                <div className="bg-white p-6 rounded-2xl border border-sandstone-dark/10 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Employer &amp; Employee</h2>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
                        <input type="text" id="businessName" value={businessName} placeholder="e.g. Acme Trades Pty Ltd"
                          onChange={(e) => setBusinessName(e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="abn" className="block text-sm font-medium text-gray-700 mb-1">ABN</label>
                        <input type="text" id="abn" value={abn} placeholder="e.g. 51 824 753 556"
                          onChange={(e) => setAbn(e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">Employee name</label>
                        <input type="text" id="employeeName" value={employeeName} placeholder="e.g. Sarah Nguyen"
                          onChange={(e) => setEmployeeName(e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job title <span className="text-warmgray-light">(optional)</span></label>
                        <input type="text" id="jobTitle" value={jobTitle} placeholder="e.g. Retail Assistant"
                          onChange={(e) => setJobTitle(e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Pay Period</h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pay frequency</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(Object.keys(PERIODS_PER_YEAR) as Frequency[]).map((f) => (
                            <button key={f} type="button" onClick={() => setFrequency(f)}
                              className={`py-2 px-2 border rounded-md text-sm font-medium transition-colors ${
                                frequency === f
                                  ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                  : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                              }`}>
                              {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="periodStart" className="block text-sm font-medium text-gray-700 mb-1">Period start</label>
                          <input type="date" id="periodStart" value={periodStart}
                            onChange={(e) => setPeriodStart(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="periodEnd" className="block text-sm font-medium text-gray-700 mb-1">Period end</label>
                          <input type="date" id="periodEnd" value={periodEnd}
                            onChange={(e) => setPeriodEnd(e.target.value)} className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-1">Payment date</label>
                          <input type="date" id="paymentDate" value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="periodsCompleted" className="block text-sm font-medium text-gray-700 mb-1">Pays this FY <span className="text-warmgray-light">(for YTD)</span></label>
                          <input type="number" id="periodsCompleted" min={1} max={53} value={periodsCompleted}
                            onChange={(e) => setPeriodsCompleted(clampNum(e.target.value, 1, 53))} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Earnings</h2>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {(["hourly", "salary"] as PayBasis[]).map((b) => (
                          <button key={b} type="button" onClick={() => setPayBasis(b)}
                            className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                              payBasis === b
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}>
                            {b === "hourly" ? "Hourly rate" : "Annual salary"}
                          </button>
                        ))}
                      </div>
                      {payBasis === "hourly" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">Hourly rate ($)</label>
                            <input type="number" id="hourlyRate" min={0} max={1000} step={0.01} value={hourlyRate}
                              onChange={(e) => setHourlyRate(clampNum(e.target.value, 0, 1000))} className={inputClass} />
                          </div>
                          <div>
                            <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700 mb-1">Ordinary hours</label>
                            <input type="number" id="hoursWorked" min={0} max={400} step={0.25} value={hoursWorked}
                              onChange={(e) => setHoursWorked(clampNum(e.target.value, 0, 400))} className={inputClass} />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label htmlFor="annualSalary" className="block text-sm font-medium text-gray-700 mb-1">Annual salary ($)</label>
                          <input type="number" id="annualSalary" min={0} max={2000000} step={1000} value={annualSalary}
                            onChange={(e) => setAnnualSalary(clampNum(e.target.value, 0, 2000000))} className={inputClass} />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="overtimeHours" className="block text-sm font-medium text-gray-700 mb-1">Overtime hours</label>
                          <input type="number" id="overtimeHours" min={0} max={200} step={0.25} value={overtimeHours}
                            onChange={(e) => setOvertimeHours(clampNum(e.target.value, 0, 200))} className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="overtimeMultiplier" className="block text-sm font-medium text-gray-700 mb-1">Overtime rate</label>
                          <select id="overtimeMultiplier" value={overtimeMultiplier}
                            onChange={(e) => setOvertimeMultiplier(Number(e.target.value))} className={inputClass}>
                            <option value={1.5}>Time and a half (1.5x)</option>
                            <option value={2}>Double time (2x)</option>
                            <option value={2.5}>Double time and a half (2.5x)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="allowanceLabel" className="block text-sm font-medium text-gray-700 mb-1">Allowance name</label>
                          <input type="text" id="allowanceLabel" value={allowanceLabel}
                            onChange={(e) => setAllowanceLabel(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="allowanceAmount" className="block text-sm font-medium text-gray-700 mb-1">Allowance ($/pay)</label>
                          <input type="number" id="allowanceAmount" min={0} max={100000} step={1} value={allowanceAmount}
                            onChange={(e) => setAllowanceAmount(clampNum(e.target.value, 0, 100000))} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax &amp; Super</h2>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-sm text-gray-700">
                        <input type="checkbox" checked={claimTaxFreeThreshold}
                          onChange={(e) => setClaimTaxFreeThreshold(e.target.checked)}
                          className="rounded border-gray-300 text-eucalyptus focus:ring-eucalyptus/20" />
                        Employee claims the tax-free threshold
                      </label>
                      <label className="flex items-center gap-3 text-sm text-gray-700">
                        <input type="checkbox" checked={includeHECS}
                          onChange={(e) => setIncludeHECS(e.target.checked)}
                          className="rounded border-gray-300 text-eucalyptus focus:ring-eucalyptus/20" />
                        Withhold extra for HECS-HELP (STSL)
                      </label>
                      <div>
                        <label htmlFor="manualTax" className="block text-sm font-medium text-gray-700 mb-1">
                          Override PAYG amount <span className="text-warmgray-light">(optional — auto: {formatAUD(calc.autoTax, 2)})</span>
                        </label>
                        <input type="number" id="manualTax" min={0} step={0.01} value={manualTax} placeholder="Leave blank to auto-estimate"
                          onChange={(e) => setManualTax(e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="superFund" className="block text-sm font-medium text-gray-700 mb-1">Super fund name</label>
                        <input type="text" id="superFund" value={superFund} placeholder="e.g. AustralianSuper"
                          onChange={(e) => setSuperFund(e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 bg-eucalyptus-dark text-white font-semibold py-3 px-4 rounded-xl hover:bg-eucalyptus transition-colors">
                    <Printer className="h-4 w-4" />
                    Print / Save as PDF
                  </button>
                </div>

                {/* PAYSLIP PREVIEW */}
                <div>
                  <div id="payslip-print-area" className="bg-white border border-sandstone-dark/20 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 max-sm:overflow-x-auto">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-navy pb-4 mb-4">
                      <div>
                        <div className="text-xl font-bold text-navy">{businessName || "Business Name"}</div>
                        <div className="text-sm text-warmgray">ABN: {abn || "—"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold tracking-widest text-navy uppercase">Payslip</div>
                        <div className="text-xs text-warmgray">Pay period: {formatDateAU(periodStart)} – {formatDateAU(periodEnd)}</div>
                        <div className="text-xs text-warmgray">Payment date: {formatDateAU(paymentDate)}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between gap-4 mb-5 text-sm">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-warmgray-light mb-0.5">Employee</div>
                        <div className="font-semibold text-navy">{employeeName || "Employee Name"}</div>
                        {jobTitle && <div className="text-warmgray">{jobTitle}</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-warmgray-light mb-0.5">Pay frequency</div>
                        <div className="font-semibold text-navy">{frequencyLabel}</div>
                      </div>
                    </div>

                    {/* Earnings table */}
                    <table className="w-full text-sm mb-5">
                      <thead>
                        <tr className="border-b border-sandstone-dark/30 text-warmgray-light">
                          <th className="text-left py-2 font-semibold">Earnings</th>
                          <th className="text-right py-2 font-semibold">Hours</th>
                          <th className="text-right py-2 font-semibold">Rate</th>
                          <th className="text-right py-2 font-semibold">This pay</th>
                          <th className="text-right py-2 font-semibold">YTD</th>
                        </tr>
                      </thead>
                      <tbody className="text-navy">
                        <tr className="border-b border-sandstone-dark/10">
                          <td className="py-2">{payBasis === "hourly" ? "Ordinary hours" : "Salary"}</td>
                          <td className="py-2 text-right">{payBasis === "hourly" ? hoursWorked.toFixed(2) : "—"}</td>
                          <td className="py-2 text-right">{formatAUD(calc.derivedHourlyRate, 2)}/hr</td>
                          <td className="py-2 text-right">{formatAUD(calc.ordinaryEarnings, 2)}</td>
                          <td className="py-2 text-right text-warmgray">{formatAUD(calc.ytd.ordinary, 2)}</td>
                        </tr>
                        {calc.overtimeEarnings > 0 && (
                          <tr className="border-b border-sandstone-dark/10">
                            <td className="py-2">Overtime ({overtimeMultiplier}x)</td>
                            <td className="py-2 text-right">{overtimeHours.toFixed(2)}</td>
                            <td className="py-2 text-right">{formatAUD(calc.derivedHourlyRate * overtimeMultiplier, 2)}/hr</td>
                            <td className="py-2 text-right">{formatAUD(calc.overtimeEarnings, 2)}</td>
                            <td className="py-2 text-right text-warmgray">{formatAUD(calc.ytd.overtime, 2)}</td>
                          </tr>
                        )}
                        {allowanceAmount > 0 && (
                          <tr className="border-b border-sandstone-dark/10">
                            <td className="py-2">{allowanceLabel || "Allowance"}</td>
                            <td className="py-2 text-right">—</td>
                            <td className="py-2 text-right">—</td>
                            <td className="py-2 text-right">{formatAUD(allowanceAmount, 2)}</td>
                            <td className="py-2 text-right text-warmgray">{formatAUD(calc.ytd.allowance, 2)}</td>
                          </tr>
                        )}
                        <tr className="font-semibold">
                          <td className="py-2">Gross pay</td>
                          <td></td><td></td>
                          <td className="py-2 text-right">{formatAUD(calc.periodGross, 2)}</td>
                          <td className="py-2 text-right text-warmgray">{formatAUD(calc.ytd.gross, 2)}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Deductions */}
                    <table className="w-full text-sm mb-5">
                      <thead>
                        <tr className="border-b border-sandstone-dark/30 text-warmgray-light">
                          <th className="text-left py-2 font-semibold">Deductions</th>
                          <th className="text-right py-2 font-semibold">This pay</th>
                          <th className="text-right py-2 font-semibold">YTD</th>
                        </tr>
                      </thead>
                      <tbody className="text-navy">
                        <tr className="border-b border-sandstone-dark/10">
                          <td className="py-2">PAYG withholding{includeHECS ? " (incl. STSL)" : ""}{calc.usingOverride ? "" : " — estimate"}</td>
                          <td className="py-2 text-right text-ochre">{formatNegAUD(calc.periodTax, 2)}</td>
                          <td className="py-2 text-right text-warmgray">{formatNegAUD(calc.ytd.tax, 2)}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Net pay */}
                    <div className="flex items-center justify-between bg-eucalyptus-light/30 border border-eucalyptus-light rounded-xl px-5 py-3 mb-5">
                      <div className="font-bold text-navy">Net pay</div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-eucalyptus-dark">{formatAUD(calc.netPay, 2)}</div>
                        <div className="text-xs text-warmgray">YTD: {formatAUD(calc.ytd.net, 2)}</div>
                      </div>
                    </div>

                    {/* Super */}
                    <table className="w-full text-sm mb-4">
                      <thead>
                        <tr className="border-b border-sandstone-dark/30 text-warmgray-light">
                          <th className="text-left py-2 font-semibold">Superannuation</th>
                          <th className="text-right py-2 font-semibold">This pay</th>
                          <th className="text-right py-2 font-semibold">YTD</th>
                        </tr>
                      </thead>
                      <tbody className="text-navy">
                        <tr>
                          <td className="py-2">
                            Super Guarantee ({(SUPER_GUARANTEE.rate * 100).toFixed(0)}%){superFund ? ` — ${superFund}` : ""}
                          </td>
                          <td className="py-2 text-right">{formatAUD(calc.superContribution, 2)}</td>
                          <td className="py-2 text-right text-warmgray">{formatAUD(calc.ytd.super, 2)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="text-[10px] text-warmgray-light border-t border-sandstone-dark/10 pt-3">
                      PAYG figures are estimates unless entered manually. Generated free with {SITE_CONFIG.name} — {SITE_CONFIG.domain}
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light mt-3">
                    Tip: click <strong>Print / Save as PDF</strong> and choose &quot;Save as PDF&quot; as the destination to download this payslip.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {afterCalculator}
          {children}
        </div>
      </div>
    </div>
  );
}
