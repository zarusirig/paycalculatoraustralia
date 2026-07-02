"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Printer, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  calculateIncomeTax,
  calculateMedicareLevy,
  calculateHECS,
  formatAUD,
  SUPER_GUARANTEE,
  EMPLOYMENT,
  TAX_FREE_THRESHOLD,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

const SOURCES_LIST: SourceLink[] = [
  { title: "Pay slips", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips", publisher: SOURCES.fwo.name },
  { title: "Tax tables", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
];

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

export default function PayslipGeneratorPage() {
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
              <div className="grid lg:grid-cols-[minmax(320px,380px)_1fr] gap-8 items-start">

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
                  <div id="payslip-print-area" className="bg-white border border-sandstone-dark/20 rounded-2xl shadow-sm p-6 md:p-8">
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
                          <td className="py-2 text-right text-ochre">-{formatAUD(calc.periodTax, 2)}</td>
                          <td className="py-2 text-right text-warmgray">-{formatAUD(calc.ytd.tax, 2)}</td>
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

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Use This Payslip Generator</h2>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Enter employer details</strong> — the business name and ABN that must appear on every Australian payslip.</li>
              <li><strong>Add the employee and pay period</strong> — employee name, pay frequency, period start and end dates, and the date of payment.</li>
              <li><strong>Enter earnings</strong> — an hourly rate and hours worked, or an annual salary. Add overtime and allowances if they apply.</li>
              <li><strong>Check tax and super</strong> — the tool estimates PAYG withholding from the ATO tax rates and calculates the {(SUPER_GUARANTEE.rate * 100).toFixed(0)}% Super Guarantee. If you know the exact PAYG amount from your payroll software, type it in to override the estimate.</li>
              <li><strong>Print or save</strong> — click Print / Save as PDF. Your browser&apos;s print dialog lets you save the payslip as a PDF file.</li>
            </ol>
            <p className="text-warmgray">
              Every calculation happens locally in your browser. Nothing you type is uploaded, stored, or shared — which makes this
              generator safe to use with real employee names and pay figures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Must a Payslip Include in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Under the Fair Work Act 2009 and Fair Work Regulations 2009, an Australian payslip must include the employer&apos;s
              name and ABN, the employee&apos;s name, the date of payment, the pay period, gross and net pay, and any
              superannuation contributions with the fund name. Hourly workers must also see their rate and hours.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Required field</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Details</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Employer name and ABN</td>
                    <td className="px-4 py-3">The legal or registered business name, plus the Australian Business Number if the employer has one</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Employee name</td>
                    <td className="px-4 py-3">The name of the person being paid</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Date of payment</td>
                    <td className="px-4 py-3">The day the wages were paid</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Pay period</td>
                    <td className="px-4 py-3">The start and end dates the payment covers (e.g. 24/06/2026 – 07/07/2026)</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Gross and net pay</td>
                    <td className="px-4 py-3">Total earnings before deductions, and the amount actually paid to the employee</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Hourly rate and hours (if paid hourly)</td>
                    <td className="px-4 py-3">The ordinary hourly rate, the number of hours worked at that rate, and the total for those hours</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Annual salary (if salaried)</td>
                    <td className="px-4 py-3">The rate of salary as at the last day of the pay period</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Loadings, allowances, bonuses and penalty rates</td>
                    <td className="px-4 py-3">Any separately identifiable entitlement, listed as its own line item</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Deductions</td>
                    <td className="px-4 py-3">The amount and purpose of each deduction, including PAYG withholding, plus the name (or name and number) of the fund or account it was paid into</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Superannuation contributions</td>
                    <td className="px-4 py-3">The amount of each contribution the employer made (or is liable to make) during the period, and the name of the super fund</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              The full list is published by the <a href="https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Fair Work Ombudsman</a>.
              If a line on your own payslip does not make sense, our <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">guide to understanding your payslip</Link> explains every field.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Payslip Template vs Payslip Generator — Which Do You Need?</h2>
            <p className="mb-4 text-warmgray">
              A payslip template is a blank layout (usually Word or Excel) that you fill in and recalculate by hand every pay run.
              A payslip generator does the calculations for you: it estimates PAYG withholding from the current ATO rates,
              applies the {(SUPER_GUARANTEE.rate * 100).toFixed(0)}% Super Guarantee to ordinary time earnings, and keeps
              year-to-date totals consistent. The output of this page works as both — generate a payslip online, or print a
              blank one and use it as a free Australian payslip template.
            </p>
            <p className="text-warmgray">
              Because the maths follows the same ATO tax brackets used across this site, the tax figure here matches our
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline"> take-home pay calculator</Link> for
              the same annualised income. To see how the withholding amount is derived, check the
              <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline"> PAYG withholding tables</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Employer Payslip Obligations in Australia</h2>
            <p className="mb-4 text-warmgray">
              Payslips are a legal requirement, not a courtesy. Under the Fair Work Act, employers must give every employee a
              payslip — electronic or paper — <strong>within one working day of payday</strong>, even if the employee is on leave.
              Employee records, including pay records, must be kept for <strong>seven years</strong>. The Fair Work Ombudsman can
              issue infringement notices and pursue penalties for missing or inaccurate payslips.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Single Touch Payroll (STP) still applies</strong> — generating a payslip does not replace STP reporting. Employers must report salaries, PAYG and super to the ATO through STP-enabled software each pay day.</li>
              <li><strong>Super must be shown</strong> — the payslip must list the Super Guarantee contribution for the period and the fund it is (or will be) paid into.</li>
              <li><strong>Casuals get payslips too</strong> — every employee, including casual and part-time staff, must receive one.</li>
            </ul>
            <p className="text-warmgray">
              Hiring and unsure what a wage really costs once super, leave and workers&apos; compensation are added? Use the
              <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline"> employer cost calculator</Link> to
              see the true cost of an employee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is the PAYG Withholding on a Payslip Calculated?</h2>
            <p className="mb-4 text-warmgray">
              Employers calculate PAYG withholding using the ATO&apos;s tax tables, based on the employee&apos;s earnings for the
              period, whether they claim the tax-free threshold, and whether they have a HECS-HELP (STSL) debt. This generator
              annualises the period&apos;s gross pay, applies the FY{SITE_CONFIG.financialYear} resident tax rates, Medicare levy
              and (optionally) HECS repayment, then divides back to the pay period.
            </p>
            <p className="text-warmgray">
              The estimate is typically within a few dollars of payroll software. For exact figures, take the PAYG amount from
              the ATO tables and enter it in the override field. Working backwards from a target take-home amount instead? The
              <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline"> gross pay calculator</Link> reverses
              the calculation, and the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">superannuation calculator</Link> projects
              what those {(SUPER_GUARANTEE.rate * 100).toFixed(0)}% contributions grow into.
            </p>
          </section>

          <MethodologyDisclosure title="How this payslip generator works">
            <ol className="list-decimal pl-4 space-y-1">
              <li>Ordinary earnings = hourly rate x hours (or annual salary ÷ pay periods per year).</li>
              <li>Gross pay for the period = ordinary earnings + overtime + allowances.</li>
              <li>PAYG estimate: the period gross is annualised, FY{SITE_CONFIG.financialYear} income tax, LITO and the 2% Medicare levy are applied (plus HECS-HELP if selected), and the result is divided back to the pay period. If the tax-free threshold is not claimed, tax scales are applied from the first dollar. Employers&apos; payroll software uses the ATO Schedule 1 coefficients, so figures can differ by a few dollars — use the override field for exact amounts.</li>
              <li>Super Guarantee ({(SUPER_GUARANTEE.rate * 100).toFixed(0)}%) is calculated on ordinary time earnings (ordinary hours plus allowances, excluding overtime).</li>
              <li>YTD totals multiply the current period by the number of pays this financial year — replace with actual YTD figures from payroll records where available.</li>
              <li>All processing is client-side. No names, ABNs or pay figures leave your device.</li>
            </ol>
          </MethodologyDisclosure>

          <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-sm text-warmgray">
            <strong className="text-navy">Disclaimer:</strong> this tool creates payslip documents and PAYG estimates for
            record-keeping and template purposes. It is not payroll software and does not lodge Single Touch Payroll reports,
            and it is not legal or tax advice. Employers remain responsible for meeting Fair Work and ATO obligations.
          </div>

          {/* FAQs */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="legal" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is it legal to make your own payslip?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes — as long as the payslip is accurate. Small employers, bookkeepers and sole traders regularly create payslips manually or with tools like this one. What is illegal is creating a false payslip (for example, to inflate income on a loan application), which is fraud. Employers must also still meet Single Touch Payroll reporting obligations regardless of how the payslip itself is produced.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="include" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What must a payslip include in Australia?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">At minimum: the employer&apos;s name and ABN, the employee&apos;s name, the date of payment, the pay period, gross and net pay, the hourly rate and hours worked (for hourly employees) or annual salary (for salaried employees), any loadings, allowances or bonuses as separate line items, each deduction with its purpose, and superannuation contributions with the name of the fund. The full list is set out in the Fair Work Regulations 2009 and summarised in the table on this page.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="abn" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How do I make a payslip for an ABN contractor?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Genuine independent contractors invoice for their work rather than receiving payslips — they handle their own tax and (usually) their own super, so a contractor normally issues an invoice, not a payslip. If you are paying someone with an ABN but they work like an employee (set hours, your direction, your equipment), they may legally be an employee entitled to payslips and super. Check the distinction with our <Link href="/contractor-vs-employee/" className="text-eucalyptus-dark hover:underline">contractor vs employee guide</Link> and use the <Link href="/contractor-pay-calculator/" className="text-eucalyptus-dark hover:underline">contractor pay calculator</Link> to compare rates.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="casual" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do casual employees get payslips?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Every employee — full-time, part-time or casual — must receive a payslip within one working day of being paid. A casual&apos;s payslip should show the ordinary hourly rate including casual loading, the hours worked, and any penalty rates as separate items.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="software" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I use this instead of payroll software?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">For producing a compliant payslip document, yes. But employers with staff must also report each pay run to the ATO through Single Touch Payroll (STP), which requires STP-enabled software or a registered agent. This generator is ideal for one-off payslips, replacing lost payslips in your records, nannies and household employees under simplified arrangements, or checking that payroll software output looks right.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="accuracy" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How accurate is the PAYG tax estimate?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Typically within a few dollars per pay. The generator annualises the period&apos;s earnings and applies the FY{SITE_CONFIG.financialYear} tax brackets, LITO and Medicare levy, while employers&apos; payroll software uses the ATO&apos;s Schedule 1 withholding coefficients, which round slightly differently. If you need the exact figure, look it up in the <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline">PAYG withholding tables</Link> and enter it in the override field.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}
