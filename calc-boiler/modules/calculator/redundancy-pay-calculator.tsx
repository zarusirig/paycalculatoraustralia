"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import { formatAUD, formatNegAUD, formatPercent } from "@/lib/constants";
import {
  ETP_RATES,
  GENUINE_REDUNDANCY_AGE_LIMIT,
  PRESERVATION_AGE,
  REDUNDANCY_TAX,
  SMALL_BUSINESS_HEADCOUNT,
  nesRedundancyWeeks,
  redundancyTax,
} from "@/lib/constants/redundancy";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";

// All tax figures come from lib/constants/redundancy.ts (ATO-sourced, tested).
// Before 23 Sep 2026 this page hardcoded the 2024-25 limit ($12,524 + $6,263)
// and a flat 32% — never reintroduce a local figure here.

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const LINK = "text-eucalyptus-dark hover:underline font-medium";

const Y = REDUNDANCY_TAX.incomeYear;
const pct = (r: number) => formatPercent(r, 0);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
}

/**
 * The interactive part of /redundancy-pay-calculator/: hero and calculator
 * card. The long-form content below the card is a server component
 * (redundancy-pay-calculator-content.tsx) passed in as `children`, so it is
 * not part of this client bundle.
 */
export default function RedundancyPayCalculatorPage({ children }: { children: React.ReactNode }) {
  const [baseSalary, setBaseSalary] = useState(90_000);
  const [yearsService, setYearsService] = useState(5);
  const [genuine, setGenuine] = useState(true);
  const [reachedPreservation, setReachedPreservation] = useState(false);
  const [smallBusiness, setSmallBusiness] = useState(false);

  const r = useMemo(() => {
    const weeklyPay = baseSalary / 52;
    const weeks = smallBusiness ? 0 : nesRedundancyWeeks(yearsService);
    const gross = weeklyPay * weeks;
    const tax = redundancyTax({
      grossPayment: gross,
      completedYears: yearsService,
      genuine,
      reachedPreservationAge: reachedPreservation,
    });
    return { weeklyPay, weeks, gross, tax };
  }, [baseSalary, yearsService, genuine, reachedPreservation, smallBusiness]);

  // Next steps inside the result card: the rest of the termination payout.
  const nextSteps = useMemo<ResultNextStep[]>(
    () => [
      { href: "/final-pay-calculator/", label: "Add notice and unused leave to your final pay", detail: "Redundancy pay is only one part of the payout" },
      { href: "/leave-calculator/", label: "Work out your unused annual leave payout" },
      {
        href: "/long-service-leave-calculator/",
        label: yearsService >= 7 ? `Check long service leave after ${yearsService} years` : "Check whether long service leave is owed",
      },
    ],
    [yearsService],
  );

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-3 md:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HERO — compact so the first input sits above the phone fold (26 Sep 2026). */}
        <section className="bg-sandstone rounded-2xl p-5 md:p-8 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Redundancy Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mt-2 mb-2" style={FONT}>
            Redundancy Pay Calculator Australia {Y}
          </h1>
          <p className="text-base md:text-lg text-warmgray">
            NES redundancy pay runs from {nesRedundancyWeeks(1)} weeks at 1 year to {nesRedundancyWeeks(9)} weeks at 9 years,
            tax-free up to {formatAUD(REDUNDANCY_TAX.taxFreeBase)} plus {formatAUD(REDUNDANCY_TAX.taxFreePerYear)} per completed year.
          </p>
          <TrustBar className="mt-2" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md py-0">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy mb-6" style={FONT}>Calculate Your Redundancy Pay</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="baseSalary" className="block text-sm font-medium text-navy mb-1">Base annual salary (ordinary hours)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="baseSalary" min={0} max={1_000_000} step={1000} value={baseSalary}
                        onChange={(e) => setBaseSalary(clamp(Number(e.target.value || 0), 0, 1_000_000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">Exclude overtime, bonuses, allowances and penalty rates.</p>
                  </div>
                  <div>
                    <label htmlFor="yearsService" className="block text-sm font-medium text-navy mb-1">Completed years of continuous service</label>
                    <input type="number" id="yearsService" min={0} max={50} step={1} value={yearsService}
                      onChange={(e) => setYearsService(clamp(Math.floor(Number(e.target.value || 0)), 0, 50))}
                      className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    <input type="range" min={0} max={25} step={1} value={clamp(yearsService, 0, 25)}
                      onChange={(e) => setYearsService(Number(e.target.value))} className="mt-3 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>
                  <label className="flex items-start gap-2 text-sm text-navy">
                    <input type="checkbox" checked={genuine} onChange={(e) => setGenuine(e.target.checked)} className="mt-1 accent-eucalyptus" />
                    <span>Genuine redundancy (the job is gone and I am under {GENUINE_REDUNDANCY_AGE_LIMIT})</span>
                  </label>
                  <label className="flex items-start gap-2 text-sm text-navy">
                    <input type="checkbox" checked={reachedPreservation} onChange={(e) => setReachedPreservation(e.target.checked)} className="mt-1 accent-eucalyptus" />
                    <span>I will be {PRESERVATION_AGE} or older by 30 June (preservation age)</span>
                  </label>
                  <label className="flex items-start gap-2 text-sm text-navy">
                    <input type="checkbox" checked={smallBusiness} onChange={(e) => setSmallBusiness(e.target.checked)} className="mt-1 accent-eucalyptus" />
                    <span>My employer has fewer than {SMALL_BUSINESS_HEADCOUNT} employees</span>
                  </label>
                </form>

                <div className="space-y-5" role="region" aria-live="polite">
                  <div id="calc-result" className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Redundancy pay after tax</div>
                    <div className="text-4xl font-extrabold text-navy mb-1 tabular-nums">{formatAUD(r.tax.net)}</div>
                    <div className="text-sm text-warmgray mt-2">
                      {r.weeks} weeks × {formatAUD(r.weeklyPay, 2)} a week = {formatAUD(r.gross, 2)} gross
                    </div>
                    <ResultNextSteps links={nextSteps} />
                  </div>
                  <StickyResult targetId="calc-result" label="Redundancy pay after tax" value={formatAUD(r.tax.net)} />
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 p-5 space-y-3 text-sm">
                    <Row label="NES redundancy pay (gross)" value={formatAUD(r.gross, 2)} bold />
                    <Row label={genuine ? `Tax-free limit (${Y})` : "Tax-free limit"} value={genuine ? formatAUD(r.tax.taxFreeLimit) : "Nil — not genuine"} />
                    <Row label="Tax-free part" value={formatAUD(r.tax.taxFree, 2)} green />
                    <Row label="Taxable ETP part" value={formatAUD(r.tax.etpTaxable, 2)} />
                    <Row label={`Tax on ETP (${pct(r.tax.rateWithinCap)}${r.tax.etpAboveCap > 0 ? ` / ${pct(ETP_RATES.aboveCap)} over cap` : ""})`} value={formatNegAUD(r.tax.tax, 2, "−")} />
                    <div className="border-t border-sandstone-dark/20 pt-3" />
                    <Row label="Take-home redundancy pay" value={formatAUD(r.tax.net, 2)} bold highlight />
                  </div>
                  {smallBusiness && (
                    <p className="bg-sandstone border-l-4 border-ochre/70 p-4 text-xs text-navy">
                      Small business employers owe no NES redundancy pay. Check your award or agreement, and
                      you are still owed notice, unused annual leave and any long service leave.
                    </p>
                  )}
                  {!smallBusiness && r.weeks === 0 && (
                    <p className="bg-sandstone border-l-4 border-ochre/70 p-4 text-xs text-navy">
                      Under 1 year of continuous service there is no NES redundancy pay.
                    </p>
                  )}
                  <p className="text-xs text-warmgray-light">
                    Excludes notice, unused leave and long service leave, which are paid and taxed separately — use the{" "}
                    <Link href="/final-pay-calculator/" className={LINK}>final pay calculator</Link> for the whole payout.
                  </p>
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

function Row({ label, value, bold, green, highlight }: { label: string; value: string; bold?: boolean; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-ochre" : "text-navy"}`}>{value}</span>
    </div>
  );
}
