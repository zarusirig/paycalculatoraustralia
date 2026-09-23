"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import {
  AGE_PENSION_INCOME_TEST,
  WORK_BONUS,
  assessableAfterWorkBonus,
  pensionReduction,
} from "@/lib/constants/centrelink-income-test";
import {
  PENSION_ASSETS_TEST as AT,
  applyingTest,
  assetsTestRate,
  assetsTestReduction,
  deemedIncomeFortnightly,
  pensionMaxRate,
  type AssetsSituation,
  type Homeownership,
} from "@/lib/constants/centrelink-means-test";
import { INPUT, LABEL, Row, FONT } from "./centrelink-shared";
import { MoneyInput, W3Hero } from "./centrelink-w3-shared";

// DataForSEO 24 Sep 2026 (AU): "age pension assets test" 9.9k (KD 1),
// "pension asset test" 5.4k, "age pension asset limits" 1.3k, "pension assets
// test calculator" 880, "age pension assets test calculator" 720. Framed as
// "which test sets your pension" so the page still answers the pay question:
// wages go through the income test, savings through both.

const IT = AGE_PENSION_INCOME_TEST;

/** One person's pension under the income test, for any assets situation. */
function incomeTestRate(assessable: number, situation: AssetsSituation): number {
  const test = situation === "single" ? "single" : "couple";
  return Math.max(0, Math.round((pensionMaxRate(situation) - pensionReduction(assessable, test)) * 100) / 100);
}

const SITUATION_LABEL: Record<AssetsSituation, string> = {
  single: "Single",
  couple: "Couple living together",
  coupleIllness: "Couple separated due to illness",
};

/**
 * The interactive part of /age-pension-assets-test-calculator/: hero and
 * calculator card. The static long-form content is server-rendered
 * (age-pension-assets-test-calculator-content.tsx) and passed in as
 * `children`, so it is not part of this client bundle.
 */
export default function AgePensionAssetsTestCalculatorPage({ children }: { children: React.ReactNode }) {
  const [situation, setSituation] = useState<AssetsSituation>("single");
  const [home, setHome] = useState<Homeownership>("homeowner");
  const [financial, setFinancial] = useState(250_000);
  const [otherAssets, setOtherAssets] = useState(40_000);
  const [employment, setEmployment] = useState(0);
  const [balance, setBalance] = useState(0);
  const [partnerEmployment, setPartnerEmployment] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);

  const couple = situation !== "single";

  const r = useMemo(() => {
    const assets = financial + otherAssets;
    const deemed = deemedIncomeFortnightly(financial, couple ? "pensionerCouple" : "single");
    const wages = assessableAfterWorkBonus(employment, balance) + (couple ? assessableAfterWorkBonus(partnerEmployment, 0) : 0);
    const assessable = Math.round((wages + deemed + otherIncome) * 100) / 100;
    const byIncome = incomeTestRate(assessable, situation);
    const byAssets = assetsTestRate(assets, situation, home);
    const paid = Math.min(byIncome, byAssets);
    return {
      assets,
      deemed,
      wages,
      assessable,
      byIncome,
      byAssets,
      paid,
      applies: applyingTest(byIncome, byAssets),
      assetsReduction: assetsTestReduction(assets, situation, home),
      max: pensionMaxRate(situation),
      limit: AT.fullPensionLimit[situation][home],
      cutOff: AT.partPensionCutOff[situation][home],
    };
  }, [financial, otherAssets, employment, balance, partnerEmployment, otherIncome, situation, home, couple]);

  const appliesText =
    r.applies === "nil" ? "Both tests reduce your pension to $0." :
      r.applies === "both" ? "Both tests give the same rate." :
        r.applies === "assets" ? "The assets test sets your pension — it gives the lower rate." :
          "The income test sets your pension — it gives the lower rate.";

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Age Pension Assets Test Calculator" title="Age Pension Assets Test Calculator 2026 — Limits, Taper and Which Test Applies">
          <p>
            From {AT.ratesFrom} you get the full Age Pension with assets up to <strong>{formatAUD(AT.fullPensionLimit.single.homeowner)}</strong> (single homeowner) or <strong>{formatAUD(AT.fullPensionLimit.couple.homeowner)}</strong> (couple homeowner, combined). Above that the pension falls by <strong>$3 a fortnight for every $1,000</strong> ($1.50 each for a couple) and stops at <strong>{formatAUD(AT.partPensionCutOff.single.homeowner)}</strong> single or <strong>{formatAUD(AT.partPensionCutOff.couple.homeowner)}</strong> for a couple. Non-homeowners can have {formatAUD(AT.fullPensionLimit.single.nonHomeowner - AT.fullPensionLimit.single.homeowner)} more.
          </p>
          <p className="text-base">The calculator runs the assets test and the income test (with your wages, the Work Bonus and deemed income on your savings) and shows which one sets your pension — Services Australia pays the lower.</p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Your Age Pension Under Both Tests</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="situation" className={LABEL}>You are</label>
                    <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as AssetsSituation)} className={INPUT}>
                      <option value="single">Single</option>
                      <option value="couple">A couple living together (both on Age Pension)</option>
                      <option value="coupleIllness">A couple separated due to illness</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="home" className={LABEL}>Do you own your home?</label>
                    <select id="home" value={home} onChange={(e) => setHome(e.target.value as Homeownership)} className={INPUT}>
                      <option value="homeowner">Yes — homeowner</option>
                      <option value="nonHomeowner">No — non-homeowner</option>
                    </select>
                  </div>
                  <MoneyInput id="financial" label={`Financial assets${couple ? " (combined)" : ""}`} value={financial} onChange={setFinancial} max={5_000_000} step={1_000} hint="Bank accounts, term deposits, shares, managed funds, super once you are Age Pension age. These are also deemed." />
                  <MoneyInput id="otherAssets" label={`Other assets${couple ? " (combined)" : ""}`} value={otherAssets} onChange={setOtherAssets} max={5_000_000} step={1_000} hint="Cars, caravan, boat, home contents, investment property (less its loan). Not your home." />
                  <MoneyInput id="employment" label="Your employment income this fortnight" value={employment} onChange={setEmployment} max={10_000} />
                  <MoneyInput id="balance" label="Your Work Bonus balance" value={balance} onChange={setBalance} max={WORK_BONUS.maxBalance} step={100} hint={`Up to ${formatAUD(WORK_BONUS.maxBalance)}, shown in your Centrelink online account.`} />
                  {couple && <MoneyInput id="partnerEmployment" label="Partner's employment income this fortnight" value={partnerEmployment} onChange={setPartnerEmployment} max={10_000} hint="The first $300 is disregarded (Work Bonus); partner balance not modelled." />}
                  <MoneyInput id="otherIncome" label={`Other income this fortnight${couple ? " (combined)" : ""}`} value={otherIncome} onChange={setOtherIncome} max={10_000} hint="Rent, overseas pensions. Do not include interest — the calculator deems your financial assets." />
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">{couple ? "Age Pension each, this fortnight" : "Age Pension this fortnight"}</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(r.paid, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(r.max, 2)} maximum · about {formatAUD(r.paid * 26 * (couple ? 2 : 1))} a year{couple ? " for the two of you" : ""}</div>
                    <div className="text-sm text-navy mt-3 pt-3 border-t border-sandstone-dark/20 font-medium">{appliesText}</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className={`rounded-xl border p-4 ${r.applies === "income" ? "border-eucalyptus bg-eucalyptus-light/40" : "border-sandstone-dark/20 bg-white"}`}>
                      <div className="text-xs uppercase tracking-wider text-warmgray mb-1">Income test</div>
                      <div className="text-2xl font-bold text-navy">{formatAUD(r.byIncome, 2)}</div>
                      <div className="text-xs text-warmgray mt-1">on {formatAUD(r.assessable, 2)} assessable income a fortnight</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${r.applies === "assets" ? "border-eucalyptus bg-eucalyptus-light/40" : "border-sandstone-dark/20 bg-white"}`}>
                      <div className="text-xs uppercase tracking-wider text-warmgray mb-1">Assets test</div>
                      <div className="text-2xl font-bold text-navy">{formatAUD(r.byAssets, 2)}</div>
                      <div className="text-xs text-warmgray mt-1">on {formatAUD(r.assets)} of assessable assets</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How each test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Assessable assets" value={formatAUD(r.assets)} />
                      <Row label={`Full-pension limit (${SITUATION_LABEL[situation].toLowerCase()}, ${home === "homeowner" ? "homeowner" : "non-homeowner"})`} value={formatAUD(r.limit)} />
                      <Row label={`Over the limit × ${situation === "single" ? "$3" : "$1.50 each"} per $1,000`} value={formatNegAUD(r.assetsReduction, 2)} />
                      <Row label="Assets test rate" value={formatAUD(r.byAssets, 2)} bold />
                      <Row label="Part pension stops above" value={formatAUD(r.cutOff)} />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Wages after the Work Bonus" value={formatAUD(r.wages, 2)} />
                      <Row label="Deemed income on financial assets" value={formatAUD(r.deemed, 2)} />
                      <Row label="Other income" value={formatAUD(otherIncome, 2)} />
                      <Row label={`${situation === "single" ? "50c" : "25c each"} per $1 over ${formatAUD(IT[situation === "single" ? "single" : "couple"].freeArea)}`} value={formatNegAUD(pensionReduction(r.assessable, situation === "single" ? "single" : "couple"), 2)} />
                      <Row label="Income test rate" value={formatAUD(r.byIncome, 2)} bold />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Paid: the lower of the two" value={formatAUD(r.paid, 2)} bold highlight />
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light">Estimate only, on the rates from {AT.ratesFrom}. Not modelled: Rent Assistance (which raises the cut-offs), transitional-rate pensioners, a partner&apos;s Work Bonus balance, couples where only one partner gets a pension. Services Australia&apos;s Payment Finder gives a claim estimate.</p>
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
