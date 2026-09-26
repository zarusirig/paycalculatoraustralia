"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import { formatAUD } from "@/lib/constants";
import {
  FAMILY_PAYMENT_SOURCES,
  FTB_A,
  FTB_B,
  ftbA,
  ftbB,
  type FamilyType,
} from "@/lib/constants/centrelink-family-payments";
import { FONT, INPUT, LABEL, Row, clamp } from "./centrelink-shared";

// DataForSEO 23 Sep 2026: "family tax benefit calculator" and five variants,
// 9.9k each (KD 0–8), fairworkmate #5–12. FTB is a FAMILY income test, the
// furthest node from "Australian pay" — the page is framed around how a pay
// rise or extra hours move the payment, and links back to the pay calculators.
//
// Scope: an estimator, not Services Australia's full model. It applies the
// published 2026–27 rates, thresholds and tapers (reconciled in the tests to
// every published income limit); shared care, the Maintenance Income Test,
// Rent Assistance, Energy Supplement and the newborn supplement are out.

const A = FTB_A;
const B = FTB_B;

function num(v: string, max: number) {
  return clamp(Math.round(Number(v || 0)), 0, max);
}

/**
 * The interactive part of /family-tax-benefit-calculator/: hero and calculator
 * card. The static long-form content is server-rendered
 * (family-tax-benefit-calculator-content.tsx) and passed in as `children`.
 */
export default function FamilyTaxBenefitCalculatorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [family, setFamily] = useState<FamilyType>("couple");
  const [yourIncome, setYourIncome] = useState(75_000);
  const [partnerIncome, setPartnerIncome] = useState(20_000);
  const [kids0to12, setKids0to12] = useState(2);
  const [kids13to19, setKids13to19] = useState(0);
  const [youngest, setYoungest] = useState(3);
  const [incomeSupport, setIncomeSupport] = useState(false);

  const noKids = kids0to12 + kids13to19 === 0;
  const familyIncome = family === "couple" ? yourIncome + partnerIncome : yourIncome;

  const result = useMemo(() => {
    const a = ftbA(familyIncome, { age0to12: kids0to12, age13to19: kids13to19 }, incomeSupport);
    const primary = family === "couple" ? Math.max(yourIncome, partnerIncome) : yourIncome;
    const secondary = family === "couple" ? Math.min(yourIncome, partnerIncome) : 0;
    const b = kids0to12 + kids13to19 === 0
      ? null
      : ftbB({ family, youngestAge: youngest, primaryIncome: primary, secondaryIncome: secondary });
    return { a, b, primary, secondary };
  }, [family, yourIncome, partnerIncome, kids0to12, kids13to19, youngest, incomeSupport, familyIncome]);

  const totalFortnight = result.a.fortnightly + (result.b?.fortnightly ?? 0);
  const totalYear = result.a.annualTotal + (result.b?.annualTotal ?? 0);
  const youngestInconsistent = (kids0to12 > 0 && youngest > 12) || (kids0to12 === 0 && kids13to19 > 0 && youngest < 13);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><Link href="/centrelink-income-test/" className="hover:text-eucalyptus-dark hover:underline">Centrelink Income Test</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Family Tax Benefit Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Family Tax Benefit Calculator — FTB Part A and Part B ({A.financialYear})</h1>
          <p className="text-lg text-warmgray">
            FTB Part A is up to <strong>{formatAUD(A.maxFortnightly.age0to12, 2)} a fortnight per child aged 0–12</strong> and {formatAUD(A.maxFortnightly.age13to19, 2)} for a teenager; FTB Part B is up to <strong>{formatAUD(B.maxFortnightly.youngestUnder5, 2)} per family</strong>. Enter your incomes and children to estimate both — and see how a pay rise or extra hours changes them.
          </p>
          <p className="mt-3 inline-block rounded-full bg-eucalyptus-light/60 px-3 py-1 text-xs font-semibold text-navy">{A.financialYear} rates and thresholds (from 1 July 2026) · verified {FAMILY_PAYMENT_SOURCES.verifiedOn}</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Estimate Your Family Tax Benefit</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="family" className={LABEL}>Your family</label>
                    <select id="family" value={family} onChange={(e) => setFamily(e.target.value as FamilyType)} className={INPUT}>
                      <option value="couple">Couple</option>
                      <option value="single">Single parent</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="yourIncome" className={LABEL}>Your adjusted taxable income (a year)</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="yourIncome" min={0} max={400000} step={1000} value={yourIncome} onChange={(e) => setYourIncome(num(e.target.value, 400_000))} className={INPUT} /></div>
                  </div>
                  {family === "couple" && (
                    <div>
                      <label htmlFor="partnerIncome" className={LABEL}>Your partner&apos;s adjusted taxable income (a year)</label>
                      <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="partnerIncome" min={0} max={400000} step={1000} value={partnerIncome} onChange={(e) => setPartnerIncome(num(e.target.value, 400_000))} className={INPUT} /></div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="kids0to12" className={LABEL}>Children 0–12</label>
                      <input type="number" id="kids0to12" min={0} max={10} value={kids0to12} onChange={(e) => setKids0to12(num(e.target.value, 10))} className={INPUT} />
                    </div>
                    <div>
                      <label htmlFor="kids13to19" className={LABEL}>Children 13–19*</label>
                      <input type="number" id="kids13to19" min={0} max={10} value={kids13to19} onChange={(e) => setKids13to19(num(e.target.value, 10))} className={INPUT} />
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light -mt-3">*13–15, or 16–19 and in full-time secondary study.</p>
                  <div>
                    <label htmlFor="youngest" className={LABEL}>Age of your youngest child</label>
                    <input type="number" id="youngest" min={0} max={19} value={youngest} onChange={(e) => setYoungest(num(e.target.value, 19))} className={INPUT} />
                    {youngestInconsistent && <p className="text-xs text-ochre mt-1">Check this against the children you entered.</p>}
                  </div>
                  <label className="flex items-start gap-2 text-sm text-navy">
                    <input type="checkbox" checked={incomeSupport} onChange={(e) => setIncomeSupport(e.target.checked)} className="mt-1 accent-eucalyptus" />
                    <span>You or your partner get an income support payment (such as Parenting Payment or JobSeeker) that isn&apos;t reduced to $0</span>
                  </label>
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Estimated FTB a fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(totalFortnight, 2)}</div>
                    <div className="text-sm text-warmgray">{formatAUD(totalYear)} a year including supplements · family income {formatAUD(familyIncome)}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How we worked it out</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      {noKids ? <p className="text-warmgray">Add at least one child to estimate FTB.</p> : (
                        <>
                          <Row label="FTB Part A a fortnight" value={formatAUD(result.a.fortnightly, 2)} bold />
                          <Row label={incomeSupport ? "Maximum rate (income support payment)" : result.a.method === "max" ? `Maximum rate (income ≤ ${formatAUD(A.lowerThreshold)})` : result.a.method === "method1" ? "Maximum rate less the income test" : result.a.method === "method2" ? "Base rate (less 30c over the higher threshold)" : "Over the income limit"} value={formatAUD(result.a.annualExSupplement) + " a year"} />
                          <Row label={`Part A supplement (after the year, ATI ≤ ${formatAUD(A.supplementIncomeLimit)})`} value={formatAUD(result.a.supplement)} />
                          <div className="border-t border-sandstone-dark/20 pt-3" />
                          {result.b && result.b.eligible ? (
                            <>
                              <Row label="FTB Part B a fortnight" value={formatAUD(result.b.fortnightly, 2)} bold />
                              <Row label={family === "couple" ? `Lower earner ${formatAUD(result.secondary)} (free to ${formatAUD(B.secondaryFreeArea)})` : "Single parent — maximum rate"} value={formatAUD(result.b.annualExSupplement) + " a year"} />
                              <Row label="Part B supplement (after the year)" value={formatAUD(result.b.supplement)} />
                            </>
                          ) : (
                            <Row label="FTB Part B" value={result.b?.reason ?? "—"} />
                          )}
                          <div className="border-t border-sandstone-dark/20 pt-3" />
                          <Row label="Total a year, including supplements" value={formatAUD(totalYear)} bold highlight />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                    <strong>An estimate, on stated assumptions.</strong> Uses the {A.financialYear} rates, thresholds and tapers published by Services Australia (read {FAMILY_PAYMENT_SOURCES.verifiedOn}). Assumes 100% care of every child and that you meet the Maintenance Action Test and immunisation requirements. Not modelled: shared care, the Maintenance Income Test (child support), Rent Assistance and Energy Supplement paid with FTB, the newborn supplement, grandparent carer rules. Supplements are reduced last. FTB is paid on your income estimate and balanced after the year.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          {afterCalculator}
          {children}
        </div>
      </div>
    </div>
  );
}
