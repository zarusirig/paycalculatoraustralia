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
  formatPercent,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "Contribution caps", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps", publisher: SOURCES.ato.name },
  { title: "Salary sacrificing to super", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/salary-sacrificing-super", publisher: SOURCES.ato.name },
];

export default function SalarySacrificeCalculatorPage() {
  const [salary, setSalary] = useState(100_000);
  const [sacrifice, setSacrifice] = useState(10_000);

  const without = useMemo(() => calculatePayBreakdown({ grossSalary: salary }), [salary]);
  const withSac = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, salarySacrifice: sacrifice }),
    [salary, sacrifice]
  );

  const taxSaved = without.totalDeductions - withSac.totalDeductions;
  const takeHomeReduction = without.takeHomePay - withSac.takeHomePay;
  const employerSuper = Math.round(salary * SUPER_GUARANTEE.rate);
  const capRoom = Math.max(0, SUPER_GUARANTEE.concessionalCap - employerSuper);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Salary Sacrifice Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Salary Sacrifice Calculator — How Much Will You Save?
          </h1>
          <p className="text-lg text-warmgray">
            Compare your take-home pay before and after salary sacrifice. See the exact tax savings, super boost,
            and net benefit of sacrificing part of your pre-tax salary into superannuation for FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Compare Your Pay Before and After Salary Sacrifice</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross Annual Salary</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>
                  <div>
                    <label htmlFor="sacrifice" className="block text-sm font-medium text-navy mb-1">Salary Sacrifice Amount</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="sacrifice" min={0} max={capRoom} step={500} value={sacrifice}
                        onChange={(e) => setSacrifice(clamp(Number(e.target.value || 0), 0, Math.min(salary, capRoom)))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">Cap room: {formatAUD(capRoom)} (of {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap)</p>
                  </div>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">
                    Compare Pay
                  </button>
                </form>

                {/* Without Sacrifice */}
                <Card className="bg-sandstone border-0 shadow-none" role="region" aria-label="Pay without sacrifice">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold text-warmgray-light uppercase tracking-wider mb-3">Without Sacrifice</h3>
                    <div className="space-y-2 text-sm">
                      <Row label="Gross Salary" value={formatAUD(salary)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={`-${formatAUD(without.netIncomeTax)}`} />
                      <Row label="Medicare" value={`-${formatAUD(without.medicareLevy)}`} />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Take-Home" value={formatAUD(without.takeHomePay)} bold green />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Employer Super" value={formatAUD(without.superContribution)} />
                      <Row label="Total Super" value={formatAUD(without.superContribution)} />
                    </div>
                  </CardContent>
                </Card>

                {/* With Sacrifice */}
                <Card className="bg-sandstone border-sandstone-dark/20 shadow-none" role="region" aria-label="Pay with sacrifice">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-3">With Sacrifice</h3>
                    <div className="space-y-2 text-sm">
                      <Row label="Gross Salary" value={formatAUD(salary)} bold />
                      <Row label="Sacrifice" value={`-${formatAUD(sacrifice)}`} highlight />
                      <Row label="Taxable Income" value={formatAUD(salary - sacrifice)} />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={`-${formatAUD(withSac.netIncomeTax)}`} />
                      <Row label="Medicare" value={`-${formatAUD(withSac.medicareLevy)}`} />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Take-Home" value={formatAUD(withSac.takeHomePay)} bold green />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Employer Super" value={formatAUD(employerSuper)} />
                      <Row label="Sacrifice to Super" value={`+${formatAUD(sacrifice)}`} highlight />
                      <Row label="Total Super" value={formatAUD(employerSuper + sacrifice)} bold />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-eucalyptus-light/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-eucalyptus-dark">{formatAUD(taxSaved)}</div>
                  <div className="text-sm text-warmgray">Tax Saved</div>
                </div>
                <div className="bg-eucalyptus-light/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-eucalyptus-dark">{formatAUD(sacrifice)}</div>
                  <div className="text-sm text-warmgray">Extra Super</div>
                </div>
                <div className="bg-sandstone/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-ochre">-{formatAUD(takeHomeReduction)}</div>
                  <div className="text-sm text-warmgray">Take-Home Reduction</div>
                </div>
              </div>

              <div className="mt-4 bg-sandstone border-l-4 border-eucalyptus/70 p-4 text-sm text-warmgray">
                <p>You receive <strong>{formatAUD(takeHomeReduction)}</strong> less in take-home pay, but <strong>{formatAUD(sacrifice)}</strong> goes to super — that&apos;s <strong>{formatAUD(taxSaved)}</strong> in tax savings.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* --- H2: How Does Salary Sacrifice Work? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Salary Sacrifice Work?</h2>
            <p className="mb-4 text-warmgray">
              Salary sacrifice redirects a portion of your pre-tax gross salary into superannuation, reducing your taxable income and the income tax you pay in FY{SITE_CONFIG.financialYear}.
            </p>
            <p className="mb-4 text-warmgray">
              The sacrificed amount is taxed at <strong>15%</strong> inside your super fund as a concessional contribution, instead of your marginal tax rate of <strong>30%</strong>, <strong>37%</strong>, or <strong>45%</strong>. The difference between those two rates is your tax saving. Use our{" "}
              <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>{" "}
              to confirm your marginal rate before setting up a salary sacrifice arrangement.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-2">Step-by-Step: How Salary Sacrifice Is Calculated</h3>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li>Start with your gross annual salary (e.g., <strong>$100,000</strong>).</li>
              <li>Choose a salary sacrifice amount (e.g., <strong>$10,000</strong>).</li>
              <li>Your employer deducts <strong>$10,000</strong> before PAYG withholding, reducing taxable income to <strong>$90,000</strong>.</li>
              <li>Income tax is calculated on <strong>$90,000</strong> instead of $100,000, saving you the difference in tax.</li>
              <li>Your super fund receives the $10,000 as a concessional contribution and applies <strong>15% contributions tax</strong> ($1,500).</li>
              <li>Net result: <strong>$8,500</strong> added to your super balance, with a take-home pay reduction smaller than $10,000 because of the tax saving.</li>
            </ol>

            <h3 className="text-lg font-semibold text-navy mb-2">Worked Example: $100,000 Salary With $10,000 Sacrifice</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Item</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Without Sacrifice</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">With $10,000 Sacrifice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(() => {
                    const w = calculatePayBreakdown({ grossSalary: 100_000 });
                    const ws = calculatePayBreakdown({ grossSalary: 100_000, salarySacrifice: 10_000 });
                    const saved = w.totalDeductions - ws.totalDeductions;
                    return (
                      <>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Gross Salary</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(100_000)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(100_000)}</td>
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Salary Sacrifice</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(0)}</td>
                          <td className="px-4 py-3 text-right text-eucalyptus-dark font-medium">-{formatAUD(10_000)}</td>
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Taxable Income</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(100_000)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(90_000)}</td>
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Income Tax</td>
                          <td className="px-4 py-3 text-right text-navy">-{formatAUD(w.netIncomeTax)}</td>
                          <td className="px-4 py-3 text-right text-navy">-{formatAUD(ws.netIncomeTax)}</td>
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Medicare Levy</td>
                          <td className="px-4 py-3 text-right text-navy">-{formatAUD(w.medicareLevy)}</td>
                          <td className="px-4 py-3 text-right text-navy">-{formatAUD(ws.medicareLevy)}</td>
                        </tr>
                        <tr className="hover:bg-sandstone bg-sandstone/50">
                          <td className="px-4 py-3 font-semibold text-navy">Take-Home Pay</td>
                          <td className="px-4 py-3 text-right font-bold text-navy">{formatAUD(w.takeHomePay)}</td>
                          <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(ws.takeHomePay)}</td>
                        </tr>
                        <tr className="hover:bg-sandstone bg-eucalyptus-light/20">
                          <td className="px-4 py-3 font-semibold text-navy">Tax Saved</td>
                          <td className="px-4 py-3 text-right text-navy">—</td>
                          <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(saved)}</td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              The sacrifice reduces take-home pay by less than $10,000 because the Australian tax calculator applies a lower tax rate to the reduced assessable income. Every dollar sacrificed from the 30% income tax bracket saves <strong>$0.15</strong> in net tax (30% marginal rate minus 15% super contributions tax).
            </p>
          </section>

          {/* --- H2: What Are the Tax Benefits of Salary Sacrifice? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Tax Benefits of Salary Sacrifice?</h2>
            <p className="mb-4 text-warmgray">
              Salary sacrifice saves tax because concessional super contributions are taxed at <strong>15%</strong>, which is lower than every income tax bracket above the tax-free threshold in FY{SITE_CONFIG.financialYear}.
            </p>
            <p className="mb-4 text-warmgray">
              The tax benefit increases with your marginal tax rate. An employee earning <strong>$80,000</strong> in the 30% bracket saves <strong>15 cents per dollar</strong> sacrificed. An employee earning <strong>$150,000</strong> in the 37% bracket saves <strong>22 cents per dollar</strong>. High-income earners above <strong>$190,000</strong> in the 45% bracket save <strong>30 cents per dollar</strong>, even after accounting for the 2% Medicare levy. Use our{" "}
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>{" "}
              to see your after-tax income with and without a sacrifice arrangement.
            </p>

            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income Bracket</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Marginal Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Super Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Net Saving per $1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$18,201 – $45,000</td>
                    <td className="px-4 py-3 text-right text-navy">16%</td>
                    <td className="px-4 py-3 text-right text-navy">15%</td>
                    <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">$0.01</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$45,001 – $135,000</td>
                    <td className="px-4 py-3 text-right text-navy">30%</td>
                    <td className="px-4 py-3 text-right text-navy">15%</td>
                    <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">$0.15</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$135,001 – $190,000</td>
                    <td className="px-4 py-3 text-right text-navy">37%</td>
                    <td className="px-4 py-3 text-right text-navy">15%</td>
                    <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">$0.22</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$190,001+</td>
                    <td className="px-4 py-3 text-right text-navy">45%</td>
                    <td className="px-4 py-3 text-right text-navy">15%</td>
                    <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">$0.30</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-warmgray-light">
              Savings shown exclude the 2% Medicare levy reduction, which adds a further $0.02 per dollar for all brackets. Earners in the 16% bracket gain minimal benefit from salary sacrifice into super.
            </p>
          </section>

          {/* --- H2: Who Uses This Salary Sacrifice Calculator? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Salary Sacrifice Calculator?</h2>
            <p className="mb-4 text-warmgray">
              Australian employees earning above <strong>$45,000</strong> per year benefit most from salary sacrifice, as their marginal tax rate exceeds the 15% super contributions tax rate.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Full-time employees</strong> earning $60,000 to $200,000 who want to maximise retirement savings while minimising taxation</li>
              <li><strong>Employees approaching retirement</strong> (aged 50+) who want to accelerate super growth before accessing their balance at preservation age</li>
              <li><strong>High-income earners</strong> above $135,000 in the 37% or 45% income tax brackets, where the tax saving per dollar sacrificed is largest</li>
              <li><strong>HR and payroll professionals</strong> advising staff on salary packaging options and concessional contribution limits</li>
              <li><strong>Financial planners</strong> modelling salary sacrifice scenarios for clients alongside the{" "}
                <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link>{" "}
                to project long-term super balances</li>
            </ul>
          </section>

          {/* --- H2: How Does Salary Sacrifice Compare to No Sacrifice? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Salary Sacrifice Compare to No Sacrifice?</h2>
            <p className="mb-4 text-warmgray">
              Salary sacrifice reduces take-home pay but increases total super contributions and delivers a net tax saving at every marginal rate above 16%.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Sacrifice</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax Saved</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home Drop</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Net Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    [80_000, 5_000], [80_000, 10_000], [100_000, 10_000],
                    [100_000, 15_000], [120_000, 15_000], [150_000, 20_000],
                  ].map(([s, sac]) => {
                    const w = calculatePayBreakdown({ grossSalary: s! });
                    const ws = calculatePayBreakdown({ grossSalary: s!, salarySacrifice: sac });
                    const saved = w.totalDeductions - ws.totalDeductions;
                    const drop = w.takeHomePay - ws.takeHomePay;
                    return (
                      <tr key={`${s}-${sac}`} className="hover:bg-sandstone">
                        <td className="px-4 py-3 font-medium text-navy">{formatAUD(s!)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(sac!)}</td>
                        <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(saved)}</td>
                        <td className="px-4 py-3 text-right text-navy">-{formatAUD(drop)}</td>
                        <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(saved)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">The tax saving increases with your marginal rate. At 30%, every $1,000 sacrificed saves <strong>$300</strong> in income tax (minus $150 in contributions tax = <strong>$150</strong> net). At 37%, it saves <strong>$220</strong> net per $1,000.</p>
          </section>

          {/* --- H2: What Are the Contribution Caps for Salary Sacrifice? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Contribution Caps for Salary Sacrifice?</h2>
            <p className="mb-4 text-warmgray">
              The concessional contribution cap for FY{SITE_CONFIG.financialYear} is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> per year, covering employer SG contributions, salary sacrifice, and personal deductible contributions combined.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-2">How the Concessional Cap Works</h3>
            <p className="mb-3 text-warmgray">
              Your employer&apos;s compulsory {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee counts toward the {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap. On a $100,000 salary, your employer contributes <strong>$12,000</strong>, leaving <strong>$18,000</strong> of cap room for salary sacrifice. On a $150,000 salary, employer SG is <strong>$18,000</strong>, leaving only <strong>$12,000</strong> of cap room. Exceeding the cap results in the excess being added to your assessable income and taxed at your marginal rate, plus an interest charge.
            </p>

            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Employer SG (12%)</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Cap Room for Sacrifice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[60_000, 80_000, 100_000, 120_000, 150_000, 200_000].map((s) => {
                    const sg = Math.round(s * SUPER_GUARANTEE.rate);
                    const room = Math.max(0, SUPER_GUARANTEE.concessionalCap - sg);
                    return (
                      <tr key={s} className="hover:bg-sandstone">
                        <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(sg)}</td>
                        <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(room)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-navy mb-2">What Is Division 293 Tax?</h3>
            <p className="text-warmgray">
              &quot;Division 293&quot; applies an additional <strong>15% tax</strong> on concessional contributions when your income plus concessional super contributions exceed <strong>$250,000</strong>. This brings the total super contributions tax to <strong>30%</strong> instead of 15%. Even at 30%, salary sacrifice remains beneficial for high-income earners because the top marginal income tax rate of 45% plus the 2% Medicare levy totals <strong>47%</strong> — still 17 percentage points higher than Division 293 taxation. Check your total assessable income using the{" "}
              <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>{" "}
              to determine if Division 293 applies to your situation.
            </p>
          </section>

          {/* --- H2: What Are Common Salary Sacrifice Mistakes? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common Salary Sacrifice Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The most common salary sacrifice mistake is exceeding the <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> concessional cap, which triggers excess contributions tax at your marginal rate plus an interest charge.
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray">
              <li><strong>Exceeding the concessional cap</strong> — Forgetting that employer SG contributions count toward the {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap. On a $120,000 salary, employer SG is $14,400, leaving only $15,600 of cap room — not the full $30,000.</li>
              <li><strong>Ignoring the HECS-HELP impact</strong> — Reportable super contributions are added back to &quot;repayment income&quot; when calculating HECS-HELP repayments. Salary sacrifice does not reduce your{" "}
                <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP</Link>{" "}
                obligation.</li>
              <li><strong>Sacrificing on a low marginal rate</strong> — Employees in the 16% income tax bracket ($18,201 to $45,000) gain only 1 cent per dollar from salary sacrifice into super. The reduced liquidity is rarely worth the minimal tax saving.</li>
              <li><strong>Reducing borrowing capacity</strong> — Lenders assess income after salary sacrifice deductions. A $15,000 annual sacrifice reduces your borrowing capacity by approximately <strong>$90,000</strong> on a standard 30-year home loan at 6% interest.</li>
              <li><strong>Not using carry-forward unused cap amounts</strong> — Since 1 July 2018, unused concessional cap amounts carry forward for up to 5 years if your total super balance is below <strong>$500,000</strong>. Employees who miss this opportunity leave tax savings on the table.</li>
            </ol>
          </section>

          {/* --- H2: What Changed for Salary Sacrifice in FY2025-26? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Salary Sacrifice in FY2025-26?</h2>
            <p className="mb-4 text-warmgray">
              The superannuation guarantee rate increased to <strong>12%</strong> from 1 July 2025, up from 11.5% in FY2024-25, reducing the available concessional cap room for salary sacrifice.
            </p>
            <p className="text-warmgray">
              On a $100,000 salary, employer SG rose from $11,500 to <strong>$12,000</strong>, reducing cap room from $18,500 to <strong>$18,000</strong>. The concessional contribution cap remains at <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong>. The Stage 3 income tax cuts from 1 July 2024 also changed the calculus: the 30% bracket now extends to $135,000 (previously $120,000), giving more employees access to the 30% vs 15% salary sacrifice benefit. Use the{" "}
              <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline">Gross Pay Calculator</Link>{" "}
              to determine your total gross salary before modelling sacrifice scenarios.
            </p>
          </section>

          <MethodologyDisclosure>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Calculate pay breakdown without salary sacrifice.</li>
              <li>Reduce taxable income by sacrifice amount.</li>
              <li>Recalculate income tax, LITO, and Medicare on reduced taxable income.</li>
              <li>Tax saved = original total deductions − reduced total deductions.</li>
              <li>Take-home reduction = sacrifice amount − tax saved.</li>
            </ol>
          </MethodologyDisclosure>

          {/* --- H2: Related Calculators --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Australian Tax Calculators</h2>
            <p className="mb-4 text-warmgray">
              Salary sacrifice is one component of your total pay package. These calculators model the other components that affect your take-home pay and superannuation balance.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray">
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> — Project your total super balance at retirement, including employer SG and salary sacrifice contributions.</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — See the full income tax brackets, LITO offset, and Medicare levy for FY{SITE_CONFIG.financialYear}.</li>
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — Calculate your net pay after tax, Medicare, and HECS deductions on any salary.</li>
              <li><Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> — Model your HECS-HELP repayment under the new marginal system, including the impact of reportable super contributions.</li>
              <li><Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> — Compare the after-tax value of a pay rise versus increasing your salary sacrifice amount.</li>
            </ul>
          </section>

          {/* --- H2: Frequently Asked Questions --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="limit" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much can I salary sacrifice into super?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">There is no legal limit on the amount you can salary sacrifice, but your total concessional super contributions (employer SG + salary sacrifice + personal deductible contributions) cannot exceed <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> per year without incurring excess contributions tax. On a $100,000 salary, your employer contributes $12,000 in SG, leaving room for up to <strong>$18,000</strong> in salary sacrifice.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="reduce" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does salary sacrifice reduce my take-home pay?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. The sacrificed amount is deducted before income tax is calculated, reducing your net pay. The reduction is smaller than the sacrifice amount because of the tax saving. Sacrificing <strong>$10,000</strong> on an $80,000 salary reduces take-home pay by approximately <strong>$6,800</strong> — the remaining $3,200 is the tax you no longer pay.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="other" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I salary sacrifice into things other than super?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Salary sacrifice arrangements can cover novated car leases, portable electronic devices, and additional employer super contributions. Non-super items attract &quot;Fringe Benefits Tax&quot; (FBT) unless they qualify for an exemption. Super sacrifice is the most tax-effective option for most Australian employees because concessional contributions are taxed at only <strong>15%</strong>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="hecs" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does salary sacrifice reduce my HECS-HELP repayment?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. The ATO adds reportable super contributions back to your income when calculating your &quot;HECS-HELP repayment income.&quot; Salary sacrifice does not lower your HECS repayment threshold or repayment amount. Use the <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to model your repayment obligation.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="div293" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is Division 293 tax and does it affect my salary sacrifice?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Division 293 imposes an additional <strong>15%</strong> tax on concessional contributions when your income plus concessional super exceeds <strong>$250,000</strong>. This brings the total contributions tax to <strong>30%</strong>. Even at 30%, salary sacrifice saves tax for earners in the 37% or 45% brackets because the marginal rate plus Medicare levy (<strong>39%</strong> or <strong>47%</strong>) still exceeds the 30% Division 293 rate.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="change-amount" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I change my salary sacrifice amount mid-year?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Most employers allow adjustments to salary sacrifice arrangements at any time, though some restrict changes to quarterly intervals. Changes apply to future pay periods only — you cannot retrospectively sacrifice income already received. Contact your payroll team to confirm your employer&apos;s specific adjustment schedule.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="carry-forward" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I carry forward unused concessional cap amounts?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. If your total super balance is below <strong>$500,000</strong> on 30 June of the previous financial year, you can carry forward unused concessional cap amounts from up to <strong>5 prior years</strong> (starting from FY2018-19). This allows a larger one-off salary sacrifice in a high-income year without exceeding the cap.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="mortgage" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Should I salary sacrifice or pay off my mortgage faster?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The answer depends on your mortgage interest rate versus expected after-tax super return. At a 6% mortgage rate, salary sacrifice into super typically delivers a better after-tax outcome because the 15% concessional tax rate is significantly lower than the 30%+ marginal rate on the same income used for extra mortgage repayments. Run the numbers at your specific salary using the calculator above.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="bg-sandstone rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See your full pay breakdown</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">Get the complete picture with income tax, Medicare, HECS, and super — all in one calculation.</p>
            <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Pay Calculator →</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, green, highlight }: { label: string; value: string; bold?: boolean; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span>
    </div>
  );
}
