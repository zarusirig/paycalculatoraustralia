"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { AGE_PENSION_INCOME_TEST, WORK_BONUS, assessableAfterWorkBonus, pensionReduction } from "@/lib/constants/centrelink-income-test";
import {
  DEEMING,
  DEEMING_HISTORY,
  deemedIncomeAnnual,
  pensionMaxRate,
  type DeemingKind,
} from "@/lib/constants/centrelink-means-test";
import { FONT, INPUT, LABEL, LINK, Row } from "./centrelink-shared";
import { MoneyInput, Note, W3Hero } from "./centrelink-w3-shared";

// DataForSEO 24 Sep 2026 (AU): "deeming rates" 2.4k (KD 2), "centrelink
// deeming rates" 1.6k, "deeming rates 2026" 720 (rising), "deeming
// calculator" 590. Deeming is part of the income test that wages go through,
// so the calculator adds deemed income to the reader's pay.
//
// The static long-form content is server-rendered (deeming-rates-content.tsx)
// and passed in as `children`.

const IT = AGE_PENSION_INCOME_TEST;
const pct = (r: number) => `${(r * 100).toFixed(2)}%`;
const MARCH = DEEMING_HISTORY.find((r) => r.from === "20 March 2026")!;

const KIND_LABEL: Record<DeemingKind, string> = {
  single: "Single",
  pensionerCouple: "Couple — one or both get a pension",
  nonPensionerCouple: "Couple — neither gets a pension",
};

export default function DeemingRatesPage({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<DeemingKind>("single");
  const [assets, setAssets] = useState(120_000);
  const [partnerAssets, setPartnerAssets] = useState(0);
  const [wages, setWages] = useState(0);

  const r = useMemo(() => {
    const perPerson = kind === "nonPensionerCouple";
    const annual = deemedIncomeAnnual(assets, kind) + (perPerson ? deemedIncomeAnnual(partnerAssets, kind) : 0);
    const marchAnnual = deemedIncomeAnnual(assets, kind, { lower: MARCH.lower, upper: MARCH.upper, threshold: kind === "single" ? MARCH.single : kind === "pensionerCouple" ? MARCH.pensionerCouple : MARCH.nonPensionerCoupleEach })
      + (perPerson ? deemedIncomeAnnual(partnerAssets, kind, { lower: MARCH.lower, upper: MARCH.upper, threshold: MARCH.nonPensionerCoupleEach }) : 0);
    const fortnight = Math.round((annual / 26) * 100) / 100;
    const threshold = DEEMING.thresholds[kind];
    const below = Math.min(assets, threshold);
    const above = Math.max(0, assets - threshold);
    // Pension effect: only for the single and pensioner-couple settings.
    const situation = kind === "single" ? "single" : "couple";
    const assessable = assessableAfterWorkBonus(wages, 0) + fortnight;
    const pension = kind === "nonPensionerCouple" ? null : Math.max(0, Math.round((pensionMaxRate(kind === "single" ? "single" : "couple") - pensionReduction(assessable, situation)) * 100) / 100);
    const pensionNoDeeming = kind === "nonPensionerCouple" ? null : Math.max(0, Math.round((pensionMaxRate(kind === "single" ? "single" : "couple") - pensionReduction(assessableAfterWorkBonus(wages, 0), situation)) * 100) / 100);
    return { annual, marchAnnual, fortnight, below, above, threshold, assessable, pension, pensionNoDeeming, situation };
  }, [kind, assets, partnerAssets, wages]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Deeming Rates" title="Deeming Rates 2026 and Deeming Calculator — 1.75% and 3.75% From 20 September">
          <p>
            From {DEEMING.ratesFrom} Centrelink deems your financial assets to earn <strong>{pct(DEEMING.lowerRate)}</strong> on the first <strong>{formatAUD(DEEMING.thresholds.single)}</strong> (single) or <strong>{formatAUD(DEEMING.thresholds.pensionerCouple)}</strong> (pensioner couple, combined), and <strong>{pct(DEEMING.upperRate)}</strong> on everything above. The deemed amount is added to your wages and other income for the income test — whatever your savings actually earn.
          </p>
          <p className="text-base">The rates were {pct(MARCH.lower)} / {pct(MARCH.upper)} from 20 March to 19 September 2026. Enter your savings and your pay to see your deemed income and what it does to an Age Pension.</p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Deeming Calculator</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="kind" className={LABEL}>You are</label>
                    <select id="kind" value={kind} onChange={(e) => setKind(e.target.value as DeemingKind)} className={INPUT}>
                      {(Object.keys(KIND_LABEL) as DeemingKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
                    </select>
                  </div>
                  <MoneyInput id="assets" label={kind === "pensionerCouple" ? "Financial assets (combined)" : kind === "nonPensionerCouple" ? "Your financial assets (and your share of joint)" : "Financial assets"} value={assets} onChange={setAssets} max={5_000_000} step={1_000} hint="Bank accounts, term deposits, shares, managed funds, account-based pensions, super once you are Age Pension age." />
                  {kind === "nonPensionerCouple" && <MoneyInput id="partnerAssets" label="Partner's financial assets (and their share of joint)" value={partnerAssets} onChange={setPartnerAssets} max={5_000_000} step={1_000} />}
                  <MoneyInput id="wages" label="Your employment income this fortnight" value={wages} onChange={setWages} max={10_000} hint={kind === "nonPensionerCouple" ? "Used only for the pension estimate, which does not apply to this setting." : `For the pension estimate. The first ${formatAUD(WORK_BONUS.fortnightlyCredit)} is taken off (Work Bonus).`} />
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Deemed income</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(r.fortnight, 2)} <span className="text-lg font-semibold text-warmgray">a fortnight</span></div>
                    <div className="text-sm text-warmgray">{formatAUD(r.annual, 2)} a year · was {formatAUD(r.marchAnnual, 2)} a year on the 20 March 2026 settings</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How it was worked out</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label={`${pct(DEEMING.lowerRate)} on the first ${formatAUD(r.threshold)}${kind === "nonPensionerCouple" ? " (yours)" : ""}`} value={formatAUD(r.below * DEEMING.lowerRate, 2)} />
                      <Row label={`${pct(DEEMING.upperRate)} on ${formatAUD(r.above)} above it`} value={formatAUD(r.above * DEEMING.upperRate, 2)} />
                      {kind === "nonPensionerCouple" && <Row label="Partner's deemed income (same thresholds, separately)" value={formatAUD(deemedIncomeAnnual(partnerAssets, kind), 2)} />}
                      <Row label="Deemed income a year" value={formatAUD(r.annual, 2)} bold />
                      <Row label="÷ 26 = per fortnight" value={formatAUD(r.fortnight, 2)} bold highlight />
                      {r.pension !== null && (
                        <>
                          <div className="border-t border-sandstone-dark/10 pt-3" />
                          <Row label="Wages after the Work Bonus" value={formatAUD(assessableAfterWorkBonus(wages, 0), 2)} />
                          <Row label="Assessable income (wages + deemed)" value={formatAUD(r.assessable, 2)} />
                          <Row label={`Age Pension${kind === "pensionerCouple" ? " each" : ""} on the income test`} value={formatAUD(r.pension, 2)} bold />
                          <Row label="Without the deemed income it would be" value={formatAUD(r.pensionNoDeeming ?? 0, 2)} />
                        </>
                      )}
                    </div>
                  </div>
                  {r.pension === null
                    ? <Note>For a couple on allowances (JobSeeker, Parenting Payment Partnered), deemed income joins each person&apos;s income test — try it in the <Link href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker calculator</Link> as &ldquo;other income&rdquo;.</Note>
                    : <p className="text-xs text-warmgray-light">Pension figures use the income test only, with the {formatAUD(IT.single.freeArea)} single / {formatAUD(IT.couple.freeArea)} couple (combined) free areas. The assets test may give a lower rate — see the <Link href="/age-pension-assets-test-calculator/" className={LINK}>assets test calculator</Link>.</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          {children}
        </div>
      </div>
    </div>
  );
}
