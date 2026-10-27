"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD, formatPercent } from "@/lib/constants";
import { RETURN_2026, estimateReturn2025_26 } from "@/lib/constants/tax-return-2025-26";

/**
 * The interactive refund estimator on /tax-return-2026/. Split out so the
 * rest of tax-return-2026.tsx renders on the server.
 */

const R = RETURN_2026;
const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function MoneyInput({ id, label, hint, value, onChange, max }: { id: string; label: string; hint: string; value: number; onChange: (n: number) => void; max: number }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy">{label}</label>
      <div className="flex items-center">
        <span className="mr-2 text-warmgray-light">$</span>
        <input id={id} type="number" min={0} max={max} step={100} value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value || 0), 0, max))}
          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
      </div>
      <p className="mt-1 text-xs text-warmgray-light">{hint}</p>
    </div>
  );
}

export default function RefundEstimator2026() {
  const [gross, setGross] = useState(85_000);
  const [withheld, setWithheld] = useState(18_500);
  const [deductions, setDeductions] = useState(1_500);
  const [cover, setCover] = useState(true);
  const [loan, setLoan] = useState(false);

  const r = useMemo(
    () => estimateReturn2025_26({ grossIncome: gross, deductions, taxWithheld: withheld, hasPrivateHospitalCover: cover, hasStudyLoan: loan }),
    [gross, deductions, withheld, cover, loan],
  );
  const isRefund = r.refund >= 0;

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 md:p-8">
        <h2 style={H} className="mb-6 text-xl font-semibold text-navy">2026 tax refund estimator ({R.incomeYear} rates)</h2>
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <MoneyInput id="tr-gross" label="Total income 2025-26" hint="Salary and wages from your income statement, plus interest and other income" value={gross} onChange={setGross} max={1_000_000} />
            <MoneyInput id="tr-withheld" label="Tax withheld" hint="Total PAYG withheld by all your employers" value={withheld} onChange={setWithheld} max={500_000} />
            <MoneyInput id="tr-ded" label="Deductions" hint={`Work expenses, WFH at ${R.wfhFixedRateCents}c/hour, donations, tax agent fees`} value={deductions} onChange={setDeductions} max={200_000} />
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={!cover} onChange={(e) => setCover(!e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
              <span className="text-navy">No private hospital cover all year</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={loan} onChange={(e) => setLoan(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
              <span className="text-navy">HECS-HELP or other study loan</span>
            </label>
          </form>

          <div className="space-y-4" aria-live="polite">
            <div className={`rounded-xl border p-6 text-center ${isRefund ? "border-sandstone-dark/20 bg-eucalyptus-light/30" : "border-ochre/40 bg-sandstone"}`}>
              <div className={`mb-1 text-sm font-semibold uppercase tracking-wider ${isRefund ? "text-eucalyptus-dark" : "text-ochre"}`}>{isRefund ? "Estimated refund" : "Estimated amount owing"}</div>
              <div className="text-4xl font-extrabold text-navy">{formatAUD(Math.abs(r.refund))}</div>
              <div className="mt-2 text-sm text-warmgray">Tax withheld {formatAUD(withheld)} minus total tax {formatAUD(r.totalLiability)}</div>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-sandstone-dark/20">
                {[
                  ["Taxable income", r.taxableIncome],
                  ["Income tax (before offsets)", r.incomeTax],
                  ...(r.lito ? [["Low income tax offset", -r.lito] as [string, number]] : []),
                  ["Medicare levy", r.medicareLevy],
                  ...(r.mls ? [["Medicare levy surcharge", r.mls] as [string, number]] : []),
                  ...(loan ? [["Study loan repayment", r.helpRepayment] as [string, number]] : []),
                ].map(([k, v]) => (
                  <tr key={k as string}><td className="py-2 text-warmgray">{k}</td><td className="py-2 text-right font-medium text-navy">{(v as number) < 0 ? formatNegAUD(-(v as number), 0, "−") : formatAUD(v as number)}</td></tr>
                ))}
                <tr><td className="py-2 font-semibold text-navy">Total tax for {R.incomeYear}</td><td className="py-2 text-right font-bold text-navy">{formatAUD(r.totalLiability)}</td></tr>
                <tr><td className="py-2 text-warmgray">Average rate</td><td className="py-2 text-right text-navy">{formatPercent(r.averageRate)}</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-warmgray">
              Estimate for a single Australian resident with a full year of residency and no dependants. It uses taxable income for the surcharge and study loan tests, which in real returns also add items such as reportable fringe benefits. It leaves out other offsets, private health rebate adjustments and investment income rules. Your notice of assessment is the final figure.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
