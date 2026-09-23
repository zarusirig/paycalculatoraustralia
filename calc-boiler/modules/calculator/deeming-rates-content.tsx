// The static long-form content on /deeming-rates/. A server component, so it
// ships as HTML; the client module (deeming-rates.tsx) renders it via
// `children` below the calculator card.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import { AGE_PENSION_INCOME_TEST, assessableAfterWorkBonus } from "@/lib/constants/centrelink-income-test";
import {
  DEEMING,
  DEEMING_HISTORY,
  MEANS_TEST_SOURCES as SRC,
  deemedIncomeAnnual,
} from "@/lib/constants/centrelink-means-test";
import { W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { DEEMING_FAQS } from "./centrelink-h3-faqs";

// Same values as the exports of centrelink-shared.tsx, which is a "use client"
// module and so cannot supply plain values to a server component.
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

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

export default function DeemingRatesContent() {
  return (
    <>
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
    </>
  );
}
