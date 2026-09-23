"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import { AGE_PENSION_INCOME_TEST, WORK_BONUS, assessableAfterWorkBonus, pensionReduction } from "@/lib/constants/centrelink-income-test";
import {
  DEEMING,
  DEEMING_HISTORY,
  MEANS_TEST_SOURCES as SRC,
  deemedIncomeAnnual,
  pensionMaxRate,
  type DeemingKind,
} from "@/lib/constants/centrelink-means-test";
import { FONT, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, source } from "./centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { DEEMING_FAQS } from "./centrelink-h3-faqs";

// DataForSEO 24 Sep 2026 (AU): "deeming rates" 2.4k (KD 2), "centrelink
// deeming rates" 1.6k, "deeming rates 2026" 720 (rising), "deeming
// calculator" 590. Deeming is part of the income test that wages go through,
// so the calculator adds deemed income to the reader's pay.

const IT = AGE_PENSION_INCOME_TEST;
const pct = (r: number) => `${(r * 100).toFixed(2)}%`;
const MARCH = DEEMING_HISTORY.find((r) => r.from === "20 March 2026")!;
const TABLE_BALANCES = [25_000, 50_000, 66_800, 100_000, 150_000, 200_000, 300_000, 500_000];

const SOURCES_LIST = [
  source("Deeming (Age Pension)", SRC.deeming),
  { title: "Social Security Guide 4.4.1.10 — Overview of deeming (rates and thresholds history)", url: SRC.deemingHistory, publisher: "Department of Social Services" },
  source("Income test for Age Pension", SRC.agePensionIncomeTest),
  source("Asset types", SRC.assetTypes),
];

const KIND_LABEL: Record<DeemingKind, string> = {
  single: "Single",
  pensionerCouple: "Couple — one or both get a pension",
  nonPensionerCouple: "Couple — neither gets a pension",
};

export default function DeemingRatesPage() {
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
          <W3Section title="Current Deeming Rates and Thresholds">
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation</th><th scope="col" className={TH + " text-right"}>{pct(DEEMING.lowerRate)} on the first</th><th scope="col" className={TH + " text-right"}>{pct(DEEMING.upperRate)} on the balance above</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Single</td><td className={TD + " text-right"}>{formatAUD(DEEMING.thresholds.single)}</td><td className={TD + " text-right"}>over {formatAUD(DEEMING.thresholds.single)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Couple, at least one gets a pension (combined)</td><td className={TD + " text-right"}>{formatAUD(DEEMING.thresholds.pensionerCouple)}</td><td className={TD + " text-right"}>over {formatAUD(DEEMING.thresholds.pensionerCouple)}</td></tr>
                  <tr><td className={TD}>Couple, neither gets a pension (each person)</td><td className={TD + " text-right"}>{formatAUD(DEEMING.thresholds.nonPensionerCouple)}</td><td className={TD + " text-right"}>over {formatAUD(DEEMING.thresholds.nonPensionerCouple)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Rates from {DEEMING.ratesFrom}; thresholds from {DEEMING.thresholdsFrom}. Deeming rates are set by {DEEMING.setBy}. A non-pensioner couple&apos;s threshold applies to each person&apos;s own assets plus their share of joint assets.</p>
          </W3Section>

          <W3Section title="Deemed Income at Different Balances">
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Financial assets</th><th scope="col" className={TH + " text-right"}>Single, a year</th><th scope="col" className={TH + " text-right"}>Single, a fortnight</th><th scope="col" className={TH + " text-right"}>Pensioner couple, a year</th><th scope="col" className={TH + " text-right"}>Pensioner couple, a fortnight</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_BALANCES.map((b, i) => {
                    const s = deemedIncomeAnnual(b, "single");
                    const c = deemedIncomeAnnual(b, "pensionerCouple");
                    return (
                      <tr key={b} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{formatAUD(b)}</td>
                        <td className={TD + " text-right"}>{formatAUD(s, 2)}</td>
                        <td className={TD + " text-right"}>{formatAUD(s / 26, 2)}</td>
                        <td className={TD + " text-right"}>{formatAUD(c, 2)}</td>
                        <td className={TD + " text-right"}>{formatAUD(c / 26, 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>A single pensioner&apos;s income free area is {formatAUD(IT.single.freeArea)} a fortnight. With no other income, deemed income reaches that at roughly {formatAUD(Math.round(((IT.single.freeArea * 26 - DEEMING.thresholds.single * DEEMING.lowerRate) / DEEMING.upperRate + DEEMING.thresholds.single) / 1_000) * 1_000)} of financial assets; above it every extra deemed dollar costs 50 cents of pension. Wages from a job use up the same free area, after the Work Bonus.</p>
          </W3Section>

          <W3Section title="Deeming Rate History">
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>From</th><th scope="col" className={TH + " text-right"}>Lower rate</th><th scope="col" className={TH + " text-right"}>Upper rate</th><th scope="col" className={TH + " text-right"}>Single threshold</th><th scope="col" className={TH + " text-right"}>Pensioner couple</th><th scope="col" className={TH + " text-right"}>Non-pensioner couple (each)</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[...DEEMING_HISTORY].reverse().map((h, i) => (
                    <tr key={h.from} className={i === 0 ? "bg-eucalyptus-light/30 font-semibold" : undefined}>
                      <td className={TD}>{h.from}</td>
                      <td className={TD + " text-right"}>{pct(h.lower)}</td>
                      <td className={TD + " text-right"}>{pct(h.upper)}</td>
                      <td className={TD + " text-right"}>{formatAUD(h.single)}</td>
                      <td className={TD + " text-right"}>{formatAUD(h.pensionerCouple)}</td>
                      <td className={TD + " text-right"}>{formatAUD(h.nonPensionerCoupleEach)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">From the DSS Social Security Guide 4.4.1.10, which lists every change since 1 July 1996. The rates sat at 0.25% / 2.25% from 1 May 2020 until 20 September 2025, then rose in three steps.</p>
          </W3Section>

          <W3Section title="What Is Deemed — and What Isn't">
            <ul className="list-disc pl-6 space-y-1 text-warmgray">
              <li><strong>Deemed:</strong> bank, building society and credit union accounts, term deposits, cash, managed investments, loans and debentures, listed shares and securities, some income streams (including account-based pensions), some gifts, and superannuation once you are Age Pension age.</li>
              <li><strong>Not deemed:</strong> your home, car, contents and other personal assets (they only count in the assets test), and super in accumulation phase while you are under Age Pension age.</li>
              <li><strong>Home sale proceeds</strong> you intend to use for a new home (sales from 1 January 2023) are deemed at the lower rate only.</li>
              <li><strong>Exemptions</strong> are granted by the Minister only in special cases — failed investments, some inaccessible super, or an account holding only NDIS funds — never for poor performance.</li>
            </ul>
          </W3Section>

          <W3Section title="Deeming, Your Pay and Your Payment">
            <p className={P}>Deeming does not change your wages or the tax you pay on them. What it changes is how much of the Centrelink income free area your savings use up before your pay is counted. A single pensioner with {formatAUD(100_000)} in the bank is deemed to earn {formatAUD(deemedIncomeAnnual(100_000, "single") / 26, 2)} a fortnight; add a {formatAUD(500)} pay packet (only {formatAUD(assessableAfterWorkBonus(500, 0), 2)} of which counts after the Work Bonus) and the income test starts reducing the pension. See the full picture on the <Link href="/age-pension-income-test-calculator/" className={LINK}>Age Pension calculator</Link>, and your net pay on the <Link href="/fortnightly-pay-calculator/" className={LINK}>fortnightly pay calculator</Link>.</p>
            <p className={P}>Deeming also applies to working-age payments — JobSeeker, Parenting Payment, Austudy and Youth Allowance — and to the <Link href="/commonwealth-seniors-health-card/" className={LINK}>Commonwealth Seniors Health Card</Link> (account-based income streams only). It does not affect Family Tax Benefit.</p>
          </W3Section>

          <W3Section title="Related Calculators and Guides">
            <W3Related current="deeming" />
          </W3Section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Deemed income a year = lower rate × assets up to the threshold + upper rate × assets above it. Per fortnight = annual ÷ 26. A non-pensioner couple&apos;s assets are deemed person by person on the {formatAUD(DEEMING.thresholds.nonPensionerCouple)} threshold.</li>
              <li>The &ldquo;was&rdquo; figure recomputes the same assets on the 20 March 2026 settings ({pct(MARCH.lower)} / {pct(MARCH.upper)} on {formatAUD(MARCH.single)} single), for comparison.</li>
              <li>The pension estimate adds deemed income to wages after the Work Bonus credit (no balance assumed) and applies the pension income test on the rates from 20 September 2026. The assets test is not applied here.</li>
              <li>Figures read at Services Australia and in the DSS Social Security Guide on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia.</li>
            </ul>
          </MethodologyDisclosure>

          <W3Faqs faqs={DEEMING_FAQS} topic="Deeming" />
          <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="deeming-rates" />
        </div>
      </div>
    </div>
  );
}
