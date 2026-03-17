"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  calculateHECS,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  MEDICARE_LEVY,
  EMPLOYMENT,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "GST registration", url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst", publisher: SOURCES.ato.name },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

interface ContractorResult {
  grossAnnual: number;
  taxableIncome: number;
  gstAmount: number;
  superContribution: number;
  incomeTax: number;
  medicareLevy: number;
  litoOffset: number;
  netIncomeTax: number;
  totalDeductions: number;
  takeHomePay: number;
  daily: number;
  weekly: number;
  fortnightly: number;
  monthly: number;
}

function calculateContractorPay(
  hourlyRate: number,
  hoursPerWeek: number,
  weeksPerYear: number,
  includesGST: boolean,
  includesSuper: boolean,
): ContractorResult {
  const grossAnnual = Math.round(hourlyRate * hoursPerWeek * weeksPerYear);

  // If rate includes GST, strip the 10% to find the real income
  const incomeBeforeGST = includesGST ? Math.round(grossAnnual / 1.1) : grossAnnual;
  const gstAmount = includesGST ? grossAnnual - incomeBeforeGST : 0;

  // If rate includes super, strip the 12% SG
  const baseSalary = includesSuper
    ? Math.round(incomeBeforeGST / (1 + SUPER_GUARANTEE.rate))
    : incomeBeforeGST;

  const superContribution = includesSuper
    ? incomeBeforeGST - baseSalary
    : Math.round(baseSalary * SUPER_GUARANTEE.rate);

  const taxableIncome = baseSalary;

  // Tax calculations
  const rawTax = calculateIncomeTax(taxableIncome, true);
  const litoOffset = calculateLITO(taxableIncome);
  const netIncomeTax = Math.max(0, Math.round(rawTax - litoOffset));
  const medicareLevy = calculateMedicareLevy(taxableIncome);

  const totalDeductions = netIncomeTax + medicareLevy;
  const takeHomePay = taxableIncome - totalDeductions;

  const workDays = weeksPerYear * 5;

  return {
    grossAnnual,
    taxableIncome,
    gstAmount,
    superContribution,
    incomeTax: Math.round(rawTax),
    medicareLevy,
    litoOffset: Math.round(litoOffset),
    netIncomeTax,
    totalDeductions,
    takeHomePay,
    daily: Math.round((takeHomePay / workDays) * 100) / 100,
    weekly: Math.round((takeHomePay / weeksPerYear) * 100) / 100,
    fortnightly: Math.round((takeHomePay / (weeksPerYear / 2)) * 100) / 100,
    monthly: Math.round((takeHomePay / 12) * 100) / 100,
  };
}

export default function ContractorPayCalculator() {
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursPerWeek, setHoursPerWeek] = useState(38);
  const [weeksPerYear, setWeeksPerYear] = useState(48);
  const [includesSuper, setIncludesSuper] = useState(false);
  const [includesGST, setIncludesGST] = useState(false);

  const result = useMemo(
    () => calculateContractorPay(hourlyRate, hoursPerWeek, weeksPerYear, includesGST, includesSuper),
    [hourlyRate, hoursPerWeek, weeksPerYear, includesGST, includesSuper]
  );

  return (
    <div className="flex-grow">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pb-16 pt-24 lg:pt-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDM5NTAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGgtNHYyaC00di00aDJ2LTJoLTR2MmgtMnY0aDJ2MmgtMnY0aDR2LTJoNHYyaDJ2LTRoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Left copy */}
            <div>
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-1.5 text-sm text-blue-300">
                  <li><Link href="/" className="hover:text-white">Pay Calculator</Link></li>
                  <li>/</li>
                  <li className="text-white">Contractor Pay Calculator</li>
                </ol>
              </nav>
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Contractor Pay Calculator Australia
                <span className="mt-2 block text-lg font-normal text-blue-300 sm:text-xl">
                  ABN Workers, Freelancers &amp; Sole Traders — {SITE_CONFIG.financialYear}
                </span>
              </h1>
              <p className="mb-6 max-w-lg text-lg leading-relaxed text-sandstone-dark/50">
                Calculate your real take-home pay as a contractor. Enter your hourly rate and see net earnings after tax, Medicare, GST, and super — broken down by day, week, fortnight, month, and year.
              </p>
              <TrustBar className="mb-6" />
            </div>

            {/* Right — Calculator */}
            <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  {/* Hourly Rate */}
                  <div>
                    <label htmlFor="hourly-rate" className="mb-1.5 block text-sm font-semibold text-navy">
                      Hourly Rate
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-warmgray-light">$</span>
                      <input
                        type="number"
                        id="hourly-rate"
                        min={0}
                        max={500}
                        step={5}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(clamp(Number(e.target.value || 0), 0, 500))}
                        className="block w-full rounded-xl border border-sandstone-dark/30 bg-white py-3 pl-8 pr-4 text-xl font-bold text-navy shadow-sm focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                      />
                    </div>
                  </div>

                  {/* Hours per week */}
                  <div>
                    <label htmlFor="hours-per-week" className="mb-1.5 block text-sm font-semibold text-navy">
                      Hours per Week
                    </label>
                    <input
                      type="number"
                      id="hours-per-week"
                      min={1}
                      max={60}
                      step={1}
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 1), 1, 60))}
                      className="block w-full rounded-xl border border-sandstone-dark/30 bg-white px-4 py-3 text-lg font-bold text-navy shadow-sm focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                    />
                  </div>

                  {/* Weeks per year */}
                  <div>
                    <label htmlFor="weeks-per-year" className="mb-1.5 block text-sm font-semibold text-navy">
                      Weeks per Year (1–52)
                    </label>
                    <input
                      type="number"
                      id="weeks-per-year"
                      min={1}
                      max={52}
                      step={1}
                      value={weeksPerYear}
                      onChange={(e) => setWeeksPerYear(clamp(Number(e.target.value || 1), 1, 52))}
                      className="block w-full rounded-xl border border-sandstone-dark/30 bg-white px-4 py-3 text-lg font-bold text-navy shadow-sm focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                    />
                    <p className="mt-1 text-xs text-warmgray-light">
                      Most contractors work 46-48 weeks (allowing for holidays)
                    </p>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={includesSuper}
                        onChange={(e) => setIncludesSuper(e.target.checked)}
                        className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus focus:ring-eucalyptus/20"
                      />
                      <span className="text-navy">Includes Superannuation ({formatPercent(SUPER_GUARANTEE.rate, 0)})</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={includesGST}
                        onChange={(e) => setIncludesGST(e.target.checked)}
                        className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus focus:ring-eucalyptus/20"
                      />
                      <span className="text-navy">Includes GST (10%)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-eucalyptus-dark py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-navy hover:shadow-xl"
                  >
                    Calculate Contractor Pay →
                  </button>
                </form>

                {/* Summary Table */}
                <div className="mt-6 overflow-x-auto rounded-xl border border-sandstone-dark/20" role="region" aria-live="polite" aria-label="Contractor pay results">
                  <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="bg-sandstone px-3 py-3 text-base font-bold text-navy sm:px-4">Gross &amp; Net — Summary Table</h2>
                  <table className="w-full text-xs">
                    <thead className="bg-sandstone">
                      <tr>
                        <th className="px-2 py-2 text-left font-semibold text-navy sm:px-3">Component</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Daily</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Weekly</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Fortnightly</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Monthly</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Annual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/10">
                      <SummaryRow label="Taxable Income" annual={result.taxableIncome} weeks={weeksPerYear} />
                      <SummaryRow label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} annual={result.superContribution} weeks={weeksPerYear} />
                      <SummaryRow label="Total Taxes" annual={result.totalDeductions} weeks={weeksPerYear} highlight />
                      <SummaryRow label="  Income Tax" annual={result.netIncomeTax} weeks={weeksPerYear} sub />
                      <SummaryRow label="  Medicare Levy" annual={result.medicareLevy} weeks={weeksPerYear} sub />
                      {result.litoOffset > 0 && (
                        <SummaryRow label="  LITO Offset" annual={-result.litoOffset} weeks={weeksPerYear} sub />
                      )}
                      <SummaryRow label="Take-Home Pay" annual={result.takeHomePay} weeks={weeksPerYear} bold />
                    </tbody>
                  </table>
                  <p className="px-3 py-2 text-xs text-warmgray-light sm:px-4">
                    Weekly/fortnightly tax &amp; Medicare use {weeksPerYear}/{Math.floor(weeksPerYear / 2)} periods. Daily uses ({weeksPerYear}×5) workdays.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {/* Key Features */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">Contractor Pay Calculator Key Features</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Accurate take-home pay for ABN workers, freelancers, consultants and gig-economy roles",
              "Calculate hourly, daily, weekly, fortnightly and monthly contractor income",
              "GST integration — shows income with and without GST (10%) for sole traders",
              `Super choice options — calculate contractor super contributions at ${formatPercent(SUPER_GUARANTEE.rate, 0)}`,
              "ATO-compliant tax estimate based on marginal tax rates and Medicare levy",
              "Real net pay after tax, GST, Medicare and optional super contributions",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-sandstone-dark/20 bg-white p-4 text-sm text-navy shadow-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-eucalyptus-light/40 text-xs font-bold text-eucalyptus-dark">✓</span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* Understanding Results */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">Understanding Your Contractor Results</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard title="Income" desc="Gross contractor earnings based on your hourly rate, hours per week, and working weeks per year." />
            <ResultCard title="Tax" desc="Estimated using ATO progressive brackets applicable to contractors, including the 2% Medicare levy." />
            <ResultCard title="GST" desc="If registered for GST, 10% is added to your invoices. GST collected isn't your income — you remit it to the ATO." />
            <ResultCard title="Superannuation" desc={`Voluntary or employer-provided super shown separately. The default rate is ${formatPercent(SUPER_GUARANTEE.rate, 0)} from July 2025.`} />
            <ResultCard title="Net Pay" desc="Final contractor take-home pay after tax, Medicare, and contributions. This is what you actually keep." />
            <ResultCard title="Working Weeks" desc="Contractors typically work 46-48 weeks per year (52 minus holidays). Adjust this to match your situation." />
          </div>

          <MethodologyDisclosure className="mt-4">
            <ol className="list-decimal space-y-1 pl-4">
              <li>Gross annual income = hourly rate × hours/week × weeks/year</li>
              <li>If GST is included, strip 10% (÷ 1.1) to find income before GST</li>
              <li>If super is included, strip {formatPercent(SUPER_GUARANTEE.rate, 0)} (÷ 1.12) to find base salary</li>
              <li>Apply ATO resident tax brackets to taxable income</li>
              <li>Apply LITO offset where eligible</li>
              <li>Add 2% Medicare levy</li>
              <li>Take-home = taxable income − income tax − Medicare levy</li>
            </ol>
          </MethodologyDisclosure>
        </section>

        {/* How Is Contractor Pay Calculated? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">How Is Contractor Pay Calculated in Australia?</h2>
          <p className="mb-3 text-warmgray">
            Contractor pay is calculated by multiplying your hourly rate by hours worked, then subtracting income tax, the <strong>2% Medicare levy</strong>, and any GST obligations to arrive at net take-home pay. Unlike employees who receive a payslip with deductions already removed, ABN contractors invoice clients for their gross amount and manage taxation independently through the PAYG instalment system.
          </p>
          <p className="mb-4 text-warmgray">
            The Australian Tax Office requires every contractor operating under an ABN to lodge a tax return. Contractors earning above <strong>$75,000 per year</strong> in gross business turnover must register for GST and remit <strong>10%</strong> of invoiced amounts quarterly via a Business Activity Statement (BAS). Use our <Link href="/income-tax-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to see the exact marginal rates applied to each income bracket for FY{SITE_CONFIG.financialYear}.
          </p>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-3 mt-6 text-xl font-semibold text-navy">Step-by-Step Contractor Pay Calculation</h3>
          <ol className="list-decimal space-y-2 pl-6 text-warmgray">
            <li><strong>Calculate gross annual income:</strong> Hourly rate ($50) × hours per week (38) × working weeks per year (48) = <strong>$91,200</strong></li>
            <li><strong>Strip GST if included:</strong> $91,200 ÷ 1.1 = <strong>$82,909</strong> (the remaining $8,291 is GST you owe the ATO)</li>
            <li><strong>Set aside superannuation:</strong> $82,909 × {formatPercent(SUPER_GUARANTEE.rate, 0)} = <strong>$9,949</strong> contributed to your super fund</li>
            <li><strong>Calculate income tax:</strong> Apply ATO progressive marginal tax brackets to your taxable income of $82,909</li>
            <li><strong>Apply LITO:</strong> Subtract the Low Income Tax Offset if your taxable income falls below $66,667</li>
            <li><strong>Add Medicare levy:</strong> $82,909 × 2% = <strong>$1,658</strong></li>
            <li><strong>Determine take-home pay:</strong> Gross income minus income tax minus Medicare levy equals your net contractor earnings</li>
          </ol>
          <p className="mt-3 text-sm text-warmgray-light">
            BAS lodgement deadlines fall on the 28th of the month following each quarter: 28 October, 28 February, 28 April, and 28 July. Late BAS lodgements attract penalties starting at <strong>$313 per 28-day period</strong>.
          </p>
        </section>

        {/* Contractor vs Employee Take-Home Pay */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">How Does Contractor Take-Home Pay Compare to Employee Pay?</h2>
          <p className="mb-4 text-warmgray">
            A contractor charging <strong>$50/hour</strong> earns a higher gross figure than an equivalent employee but loses access to paid leave, employer super, and workers&apos; compensation insurance. The table below compares identical gross earnings of $91,200 for a contractor versus an employee for FY{SITE_CONFIG.financialYear}.
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Component</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Contractor (ABN)</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Employee (PAYG)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr>
                  <td className="px-4 py-3 text-navy">Gross Annual Income</td>
                  <td className="px-4 py-3 text-right text-navy">$91,200</td>
                  <td className="px-4 py-3 text-right text-navy">$91,200</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-navy">Paid Leave (4 weeks)</td>
                  <td className="px-4 py-3 text-right text-ochre">$0 (unpaid)</td>
                  <td className="px-4 py-3 text-right text-eucalyptus-dark">$7,015 (included)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-navy">Superannuation ({formatPercent(SUPER_GUARANTEE.rate, 0)})</td>
                  <td className="px-4 py-3 text-right text-ochre">Self-funded</td>
                  <td className="px-4 py-3 text-right text-eucalyptus-dark">$10,944 (employer-paid)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-navy">Workers&apos; Comp Insurance</td>
                  <td className="px-4 py-3 text-right text-ochre">$800–$2,500/yr</td>
                  <td className="px-4 py-3 text-right text-eucalyptus-dark">Employer-covered</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-navy">GST Administration</td>
                  <td className="px-4 py-3 text-right text-ochre">Quarterly BAS</td>
                  <td className="px-4 py-3 text-right text-eucalyptus-dark">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-navy">Sick Leave (10 days)</td>
                  <td className="px-4 py-3 text-right text-ochre">$0 (unpaid)</td>
                  <td className="px-4 py-3 text-right text-eucalyptus-dark">$3,508 (included)</td>
                </tr>
                <tr className="bg-eucalyptus-light/30">
                  <td className="px-4 py-3 font-bold text-navy">True Cost Difference</td>
                  <td className="px-4 py-3 text-right font-bold text-navy">—</td>
                  <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">+$22,267 in benefits</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">
            To match an employee on $91,200, a contractor needs to charge approximately <strong>$65–$70/hour</strong> (not $50/hour) to cover lost entitlements. Use our <Link href="/contractor-vs-employee-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Contractor vs Employee Calculator</Link> for a personalised side-by-side comparison.
          </p>
        </section>

        {/* Who Uses This Calculator? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">Who Uses This Contractor Pay Calculator?</h2>
          <p className="mb-4 text-warmgray">
            Over <strong>1 million</strong> independent contractors operate in Australia across construction, IT, healthcare, creative industries, and transport. This Australian tax calculator serves 5 primary user groups.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-warmgray">
            <li><strong>Freelancers and sole traders</strong> — graphic designers, copywriters, and web developers who invoice multiple clients and need to estimate quarterly tax obligations before each BAS lodgement</li>
            <li><strong>IT contractors</strong> — software engineers, data analysts, and project managers on 6–12 month contracts who compare contractor rates against permanent salary offers</li>
            <li><strong>Construction and trades contractors</strong> — electricians, plumbers, and builders operating under an ABN who calculate net pay after GST, insurance, and tool expenses</li>
            <li><strong>Gig-economy workers</strong> — rideshare drivers, delivery riders, and platform workers who need to set aside tax from irregular income streams</li>
            <li><strong>Business owners evaluating hiring costs</strong> — companies comparing the total cost of engaging a contractor versus hiring a permanent employee on a salary</li>
          </ul>
          <p className="mt-3 text-sm text-warmgray-light">
            Employees looking to convert their salary into an equivalent contractor hourly rate use this calculator alongside the <Link href="/hourly-to-annual-salary-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> to model both scenarios.
          </p>
        </section>

        {/* What Tax Obligations Do Contractors Have? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">What Tax Obligations Do Contractors Have?</h2>
          <p className="mb-4 text-warmgray">
            Australian contractors have <strong>3 core tax obligations</strong>: income tax through PAYG instalments, GST registration and lodgement above the $75,000 threshold, and optional (but recommended) superannuation contributions at {formatPercent(SUPER_GUARANTEE.rate, 0)} of assessable income.
          </p>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-3 mt-6 text-xl font-semibold text-navy">GST Registration and BAS Lodgement</h3>
          <p className="mb-3 text-warmgray">
            Contractors with annual turnover exceeding <strong>$75,000</strong> must register for GST. Once registered, you charge an additional <strong>10%</strong> on every invoice, collect it from clients, and remit it to the ATO via quarterly BAS returns. Taxi drivers, rideshare operators, and Uber drivers must register for GST regardless of turnover. Voluntary GST registration below $75,000 allows you to claim input tax credits on business purchases, which benefits contractors with significant equipment or supply costs.
          </p>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-3 mt-6 text-xl font-semibold text-navy">PAYG Instalments and Income Tax</h3>
          <p className="mb-3 text-warmgray">
            The ATO assesses contractors on their net business income using the same progressive income tax brackets as employees. The tax-free threshold remains <strong>$18,200</strong> for FY{SITE_CONFIG.financialYear}. Contractors pay tax through quarterly PAYG instalments rather than having tax withheld each pay. The income tax brackets apply at marginal rates of <strong>0%, 16%, 30%, 37%, and 45%</strong>. Use our <Link href="/take-home-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to see the exact tax amount at any income level.
          </p>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-3 mt-6 text-xl font-semibold text-navy">Superannuation for Contractors</h3>
          <p className="text-warmgray">
            Sole-trader contractors are not legally required to pay themselves super, but concessional contributions of up to <strong>$30,000 per year</strong> reduce taxable income and are taxed at just <strong>15%</strong> inside the fund. Contractors earning above <strong>$250,000</strong> pay an additional <strong>15% Division 293 tax</strong> on super contributions. If a hiring business pays you primarily for your labour (not to achieve a result), that business must pay super on your behalf at the SG rate of {formatPercent(SUPER_GUARANTEE.rate, 0)}. Check entitlements with our <Link href="/superannuation-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Superannuation Calculator</Link>.
          </p>
        </section>

        {/* What Hourly Rate Equals a Salary? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">What Contractor Hourly Rate Equals a Salary?</h2>
          <p className="mb-4 text-warmgray">
            A contractor hourly rate of <strong>$50</strong> produces gross annual income of <strong>$91,200</strong> (at 38 hours/week, 48 weeks/year), but the equivalent employee salary is approximately <strong>$65,000–$70,000</strong> once leave, super, and insurance are factored in. The conversion table below maps common contractor rates to their equivalent employee salaries for FY{SITE_CONFIG.financialYear}.
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Contractor Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Gross Annual (48 wks)</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Equivalent Salary</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {[
                  { rate: 30, gross: 54720, salary: 42000, takeHome: 45834 },
                  { rate: 40, gross: 72960, salary: 55000, takeHome: 58638 },
                  { rate: 50, gross: 91200, salary: 68000, takeHome: 70648 },
                  { rate: 60, gross: 109440, salary: 82000, takeHome: 81098 },
                  { rate: 75, gross: 136800, salary: 102000, takeHome: 97298 },
                  { rate: 100, gross: 182400, salary: 135000, takeHome: 123148 },
                  { rate: 125, gross: 228000, salary: 168000, takeHome: 147148 },
                  { rate: 150, gross: 273600, salary: 200000, takeHome: 169598 },
                ].map((row) => (
                  <tr key={row.rate} className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">${row.rate}/hr</td>
                    <td className="px-4 py-3 text-right text-navy">{formatAUD(row.gross)}</td>
                    <td className="px-4 py-3 text-right text-navy">~{formatAUD(row.salary)}</td>
                    <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">~{formatAUD(row.takeHome)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">
            Equivalent salary assumes 4 weeks annual leave, 10 days sick leave, {formatPercent(SUPER_GUARANTEE.rate, 0)} employer super, and $1,500/yr in insurance costs paid by the employer. Actual take-home pay varies based on deductions claimed. Use the <Link href="/annual-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Annual Pay Calculator</Link> for a precise salary-based breakdown.
          </p>
        </section>

        {/* Common Contractor Tax Mistakes */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">What Are Common Contractor Tax Mistakes?</h2>
          <p className="mb-4 text-warmgray">
            The most common contractor tax mistake is <strong>failing to set aside enough money for tax</strong>, leaving a shortfall at BAS or tax-return time. The ATO issued over <strong>$1.2 billion</strong> in penalties and interest to small businesses for late or incorrect lodgements in the 2023-24 financial year. Avoid these 5 errors.
          </p>
          <ol className="list-decimal space-y-3 pl-6 text-warmgray">
            <li>
              <strong>Not separating GST from income:</strong> The 10% GST collected on invoices belongs to the ATO, not to you. Spending GST funds as personal income creates a shortfall of <strong>$9,120 per year</strong> on $100,000 of billings.
            </li>
            <li>
              <strong>Ignoring PAYG instalments:</strong> Contractors who skip quarterly PAYG instalments face a single lump-sum tax bill. On $100,000 of taxable income, the annual tax bill is approximately <strong>$24,187</strong> — a difficult amount to pay at once.
            </li>
            <li>
              <strong>Setting the hourly rate too low:</strong> Pricing contractor rates at the same level as employee hourly rates ignores the <strong>30–40%</strong> loading needed to cover super, leave, insurance, and admin costs. A $40/hr employee rate requires approximately <strong>$56–$64/hr</strong> as a contractor.
            </li>
            <li>
              <strong>Missing legitimate deductions:</strong> Contractors overlook deductible expenses including home office costs (67 cents/hour fixed rate), vehicle logbook expenses, professional development courses, accounting software subscriptions, and professional indemnity insurance premiums.
            </li>
            <li>
              <strong>Skipping voluntary super contributions:</strong> Concessional super contributions of up to <strong>$30,000/year</strong> are taxed at 15% inside the fund instead of your marginal rate. A contractor on $100,000 saves <strong>$4,500 in tax</strong> by contributing $30,000 to super versus taking it as income taxed at the 30% marginal rate.
            </li>
          </ol>
        </section>

        {/* Contractor vs Employee link */}
        <section className="rounded-xl border-2 border-eucalyptus/30 bg-eucalyptus-light/40 p-6">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-2 text-xl font-bold text-navy">Contractor vs Employee: Compare Side-by-Side</h2>
          <p className="mb-4 text-warmgray">
            Not sure whether you&apos;re better off as a contractor or employee? Our comparison calculator shows you the real difference after tax, super, GST, and insurance.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contractor-vs-employee-calculator/"
              className="inline-flex items-center gap-2 rounded-lg bg-eucalyptus-dark px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-navy"
            >
              Compare Contractor vs Employee →
            </Link>
            <Link
              href="/contractor-vs-employee/"
              className="inline-flex items-center gap-2 rounded-lg border border-eucalyptus/40 px-5 py-2.5 text-sm font-medium text-eucalyptus-dark transition-all hover:bg-eucalyptus-light/40"
            >
              Read the Guide
            </Link>
          </div>
        </section>

        {/* Related Calculators */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">Related Australian Tax Calculators</h2>
          <p className="mb-4 text-warmgray">
            Contractor pay calculations intersect with income tax brackets, superannuation, salary sacrifice, and hourly-to-annual conversions. These 5 calculators cover the most common related scenarios.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/contractor-vs-employee-calculator/", title: "Contractor vs Employee Calculator", desc: "Compare contractor rates against employee salaries with full entitlement costing" },
              { href: "/income-tax-calculator/", title: "Income Tax Calculator", desc: "Calculate income tax at every bracket for FY2025-26 including LITO and Medicare levy" },
              { href: "/superannuation-calculator/", title: "Superannuation Calculator", desc: "Model voluntary and compulsory super contributions at the 12% SG rate" },
              { href: "/hourly-to-annual-salary-calculator/", title: "Hourly to Annual Salary Calculator", desc: "Convert any hourly rate to an annual salary with tax, super, and leave adjustments" },
              { href: "/tax-return-calculator/", title: "Tax Return Calculator", desc: "Estimate your end-of-year tax refund or liability after claiming business deductions" },
              { href: "/salary-sacrifice-calculator/", title: "Salary Sacrifice Calculator", desc: "See how redirecting pre-tax income to super or novated lease reduces your tax bill" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex flex-col rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:border-eucalyptus/40 hover:shadow-md">
                  <span className="font-semibold text-eucalyptus-dark">{item.title}</span>
                  <span className="mt-1 text-sm text-warmgray">{item.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-2xl font-bold text-navy">Frequently Asked Questions</h2>
          <Accordion type="multiple" className="space-y-3">
            <FAQItem value="what-contractor" question="What is a contractor for tax purposes?">
              A contractor (also called an independent contractor or ABN worker) operates their own business and invoices clients for work performed. Unlike employees, contractors handle their own tax, super, and insurance. The ATO uses a multi-factor test to determine if someone is genuinely a contractor — see our <Link href="/contractor-vs-employee/" className="font-medium text-eucalyptus-dark hover:underline">contractor vs employee guide</Link>.
            </FAQItem>
            <FAQItem value="gst" question="Do I need to charge GST as a contractor?">
              If your ABN business income exceeds <strong>$75,000 per year</strong>, you must register for GST and charge 10% on your invoices. The GST you collect is remitted to the ATO quarterly — it&apos;s not your income. If you&apos;re under $75,000, GST registration is optional.
            </FAQItem>
            <FAQItem value="super-contractor" question="Do contractors need to pay super?">
              If you&apos;re an independent contractor working under your own ABN, super is optional (but recommended). However, if a business hires you primarily for your labour (rather than achieving a specific result), they may be required to pay super on your behalf. Use the &quot;Includes Super&quot; toggle to model either scenario.
            </FAQItem>
            <FAQItem value="hourly-rate" question="How do I calculate my contractor hourly rate?">
              Your contractor rate should cover the benefits you lose compared to employment: super ({formatPercent(SUPER_GUARANTEE.rate, 0)}), annual leave (4 weeks), sick leave, public holidays, insurance, and admin time. A common rule of thumb: multiply an equivalent employee hourly rate by 1.4-1.6 to get your contractor rate.
            </FAQItem>
            <FAQItem value="deductions" question="Can contractors claim business deductions?">
              Yes. Contractors can deduct legitimate business expenses from their assessable income — including equipment, home office, vehicle, phone, software, professional development, and insurance. This calculator estimates tax on your gross income; your actual tax may be lower after claiming deductions on your tax return.
            </FAQItem>
            <FAQItem value="payg-instalments" question="How do PAYG instalments work for contractors?">
              The ATO calculates your quarterly PAYG instalment amount based on your most recent tax return. Instalments are due on <strong>28 October, 28 February, 28 April, and 28 July</strong>. You can choose the instalment amount method (ATO-calculated) or the instalment rate method (percentage of income). Missing a PAYG instalment attracts a general interest charge of approximately <strong>11.36% per annum</strong>.
            </FAQItem>
            <FAQItem value="abn-tfn" question="Do I need both an ABN and a TFN as a contractor?">
              Yes. Your <strong>Tax File Number (TFN)</strong> is used for your personal income tax return. Your <strong>Australian Business Number (ABN)</strong> is required on every invoice you issue. Clients who pay contractors without a valid ABN on the invoice must withhold <strong>47%</strong> of the payment and remit it to the ATO.
            </FAQItem>
            <FAQItem value="contractor-insurance" question="What insurance do contractors need in Australia?">
              Most contractors carry 3 types of insurance: <strong>public liability</strong> ($5–$20 million cover, costing $300–$1,200/year), <strong>professional indemnity</strong> (required for consultants, accountants, and IT professionals, costing $400–$2,000/year), and <strong>income protection</strong> (replaces up to 75% of income during illness or injury). Workers&apos; compensation is compulsory in some states for contractors who employ others.
            </FAQItem>
          </Accordion>
        </section>

        <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
      </div>
    </div>
  );
}

// ---------- Helper components ----------

function SummaryRow({
  label,
  annual,
  weeks,
  bold,
  sub,
  highlight,
}: {
  label: string;
  annual: number;
  weeks: number;
  bold?: boolean;
  sub?: boolean;
  highlight?: boolean;
}) {
  const workDays = weeks * 5;
  const daily = annual / workDays;
  const weekly = annual / weeks;
  const fortnightly = annual / (weeks / 2);
  const monthly = annual / 12;

  const cellClass = bold
    ? "font-bold text-navy"
    : highlight
      ? "font-semibold text-ochre"
      : sub
        ? "text-warmgray-light"
        : "text-navy";

  const labelClass = bold
    ? "font-bold text-navy"
    : highlight
      ? "font-semibold text-ochre"
      : sub
        ? "pl-3 text-warmgray-light"
        : "text-navy";

  const fmt = (v: number) => formatAUD(Math.abs(v), v !== 0 && Math.abs(v) < 100 ? 2 : 0);

  return (
    <tr className={bold ? "bg-eucalyptus-light/30" : ""}>
      <td className={`whitespace-nowrap px-2 py-1.5 sm:px-3 ${labelClass}`}>{label}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(daily)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(weekly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(fortnightly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(monthly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(annual)}</td>
    </tr>
  );
}

function ResultCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5 shadow-sm">
      <h3 className="mb-2 font-semibold text-navy">{title}</h3>
      <p className="text-sm leading-relaxed text-warmgray">{desc}</p>
    </div>
  );
}

function FAQItem({ value, question, children }: { value: string; question: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={value} className="rounded-xl border border-sandstone-dark/20 px-5">
      <AccordionTrigger className="text-left text-base font-medium text-navy">{question}</AccordionTrigger>
      <AccordionContent>
        <p className="leading-relaxed text-warmgray">{children}</p>
      </AccordionContent>
    </AccordionItem>
  );
}
