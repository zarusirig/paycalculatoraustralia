"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";
import { findGrossForNet } from "@/modules/calculator/gross-for-net";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";
import { nearestSalary, salaryHref } from "@/lib/data/salary-pages";

const LEAD_NET_WEEKLY = 1_500;
const LEAD_GROSS = findGrossForNet(LEAD_NET_WEEKLY * 52);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const PERIOD_MULTIPLIERS = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  annually: 1,
};

type Period = keyof typeof PERIOD_MULTIPLIERS;

/**
 * The interactive part of /gross-pay-calculator/: hero and calculator card.
 * The long-form content below the card is a server component
 * (gross-pay-calculator-content.tsx) passed in as `children`, so it is not
 * part of this client bundle.
 */
export default function GrossPayCalculatorPage({ children }: { children: React.ReactNode }) {
  const [targetNet, setTargetNet] = useState(1500);
  const [period, setPeriod] = useState<Period>("weekly");

  const annualTargetNet = targetNet * PERIOD_MULTIPLIERS[period];

  const requiredGross = useMemo(() => findGrossForNet(annualTargetNet), [annualTargetNet]);
  const finalBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: requiredGross }), [requiredGross]);

  const expectedSuper = requiredGross * SUPER_GUARANTEE.rate;

  // Next steps inside the result card, carrying the gross salary just found.
  const nextSteps = useMemo<ResultNextStep[]>(() => {
    const s = nearestSalary("take-home", requiredGross);
    const h = nearestSalary("salary-to-hourly", requiredGross);
    return [
      { href: salaryHref("take-home", s), label: `Check your take-home on ${formatAUD(s)}`, detail: "Nearest salary page, with super and HECS options" },
      { href: salaryHref("tax-on", s), label: `See the tax on ${formatAUD(s)}` },
      { href: salaryHref("salary-to-hourly", h), label: `What ${formatAUD(h)} a year is an hour` },
    ];
  }, [requiredGross]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-3 md:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HERO */}
        {/* Compact hero: calculator above the fold (head-term intent map, Sep 2026; tightened 26 Sep 2026). */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-5 md:p-8 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Gross Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-navy mt-2 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Gross Pay Calculator Australia — Net to Gross ({SITE_CONFIG.financialYear})
          </h1>
          <p className="text-base md:text-lg text-navy">
            A <strong>{formatAUD(LEAD_NET_WEEKLY)} weekly</strong> net target needs{" "}
            <strong>{formatAUD(Math.round(LEAD_GROSS))} gross a year</strong> under the {SITE_CONFIG.financialYear} brackets.
          </p>
          <TrustBar className="mt-2" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md py-0">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">

                {/* Inputs */}
                <div className="bg-white p-6 rounded-2xl border border-sandstone-dark/10 shadow-sm md:w-80">
                  <h2 className="text-lg font-semibold text-navy mb-5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Set Your Target</h2>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div>
                      <label htmlFor="targetNet" className="block text-sm font-medium text-gray-700 mb-1">I want to take home:</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2 font-medium">$</span>
                        <input type="number" id="targetNet" min={0} max={1000000} step={100} value={targetNet}
                          onChange={(e) => setTargetNet(clamp(Number(e.target.value || 0), 0, 1000000))}
                          className="block w-full text-lg font-bold text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How often?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["weekly", "fortnightly", "monthly", "annually"] as Period[]).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPeriod(p)}
                            className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                              period === p
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <div id="calc-result" className="bg-eucalyptus-dark rounded-2xl p-6 text-center text-white shadow-lg relative overflow-hidden">
                    {/* Decorative background shape */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="text-sm font-medium text-eucalyptus-light uppercase tracking-wider mb-2 relative z-10">Required Annual Gross Salary</div>
                    <div className="text-5xl font-extrabold mb-1 relative z-10">
                      {formatAUD(requiredGross)}
                    </div>
                    <div className="text-sm text-eucalyptus-light mt-2 relative z-10">
                      To take home exactly <strong>{formatAUD(targetNet)} {period}</strong>
                    </div>
                  </div>
                  <StickyResult targetId="calc-result" label="Required gross salary" value={formatAUD(requiredGross)} hint="a year" />

                  {/* Breakdown Box */}
                  <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone-dark/10 px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">How the math works out</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-3 text-sm">
                        <div className="font-semibold text-warmgray-light pb-2 border-b border-sandstone-dark/20">Component</div>
                        <div className="font-semibold text-warmgray-light text-right pb-2 border-b border-sandstone-dark/20 hidden sm:block">Annual</div>
                        <div className="font-semibold text-warmgray-light text-right pb-2 border-b border-sandstone-dark/20">{period.charAt(0).toUpperCase() + period.slice(1)}</div>

                        <div className="text-gray-700 font-medium">Gross Income</div>
                        <div className="text-right text-gray-700 font-medium hidden sm:block">{formatAUD(requiredGross)}</div>
                        <div className="text-right text-navy font-bold">{formatAUD(requiredGross / PERIOD_MULTIPLIERS[period])}</div>

                        <div className="text-warmgray">Income Tax</div>
                        <div className="text-right text-ochre hidden sm:block">{formatNegAUD(finalBreakdown.netIncomeTax)}</div>
                        <div className="text-right text-ochre">{formatNegAUD(finalBreakdown.netIncomeTax / PERIOD_MULTIPLIERS[period])}</div>

                        <div className="text-warmgray">Medicare Levy</div>
                        <div className="text-right text-ochre hidden sm:block">{formatNegAUD(finalBreakdown.medicareLevy)}</div>
                        <div className="text-right text-ochre">{formatNegAUD(finalBreakdown.medicareLevy / PERIOD_MULTIPLIERS[period])}</div>

                        <div className="border-t border-sandstone-dark/20 pt-2 font-bold text-navy">Net Take-Home</div>
                        <div className="border-t border-sandstone-dark/20 pt-2 text-right font-bold text-eucalyptus-dark hidden sm:block">{formatAUD(finalBreakdown.takeHomePay)}</div>
                        <div className="border-t border-sandstone-dark/20 pt-2 text-right font-extrabold text-eucalyptus-dark bg-eucalyptus-light/30 px-2 rounded">{formatAUD(targetNet)}</div>
                      </div>
                      <ResultNextSteps links={nextSteps} />
                    </div>
                  </div>

                  <div className="bg-eucalyptus-light/30 border border-eucalyptus-light p-4 rounded-xl flex items-start text-sm">
                    <div className="mr-3 mt-0.5 text-eucalyptus">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div className="text-navy">
                      <strong>Don&apos;t forget Super:</strong> On top of this base salary, your employer must also pay {SUPER_GUARANTEE.rate * 100}% into your super fund (an extra <strong>{formatAUD(expectedSuper)}</strong> annually), bringing your Total Package to <strong>{formatAUD(requiredGross + expectedSuper)}</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {children}
      </div>
    </div>
  );
}
