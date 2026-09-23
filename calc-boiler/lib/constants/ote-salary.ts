// =============================================================================
// OTE — "on-target earnings" in a sales salary, and how it meets the other OTE
// ("ordinary time earnings", the super term). Feeds /ote-salary/ (G3, wave 4).
//
// Keyword demand (DataForSEO Labs, AU, 24 Sep 2026): ote meaning salary 3,600,
// ote definition salary 3,600, what is ote 1,300, what does ote mean in salary
// 720, what does ote mean salary 720, ote salary 480 — all KD 0.
//
// On-target earnings is a contract/recruitment term, not a legal one: there is
// no statutory definition, so the page defines it by its arithmetic only
// (base + commission at 100% of target) and cites law only for what law says:
//
//   - ATO, "List of payments that are ordinary time earnings" (last updated 30
//     April 2026, read 24 Sep 2026): "Commission payments" are salary and wages
//     AND ordinary time earnings; commission "solely for work performed
//     entirely outside ordinary hours" is salary and wages but NOT OTE.
//     (From 1 July 2026 SG is calculated on qualifying earnings, which add only
//     that outside-hours commission — see QUALIFYING_EARNINGS in
//     australian-tax.ts, ATO QC105843.)
//   - Fair Work Commission, "High income threshold" (read 24 Sep 2026): the
//     threshold is $190,100 (from 1 July 2026; $183,100 for dismissals to 30
//     June 2026). Earnings do NOT include "payments the amount of which cannot
//     be determined in advance such as commissions, incentive-based payments
//     and bonuses, or overtime (except guaranteed overtime)" (FW Act s 332).
//   - Fair Work Ombudsman, "Piece rates and commission payments" (read 24 Sep
//     2026): commission can be an incentive on top of pay or the whole wage;
//     commission-only only where an award or enterprise agreement allows it;
//     award/agreement-free employees paid commission must still get at least
//     the National Minimum Wage.
// =============================================================================

import { SUPER_GUARANTEE } from "./australian-tax";

export const OTE_VERIFIED_ON = "24 September 2026";

export const OTE_SOURCES = {
  atoOte: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay/list-of-payments-that-are-ordinary-time-earnings",
  fwcHighIncome: "https://www.fwc.gov.au/high-income-threshold",
  fwoCommission: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/piece-rates-and-commission-payments",
} as const;

/** FWC high income threshold from 1 July 2026 (unfair dismissal eligibility for award/agreement-free employees). */
export const HIGH_INCOME_THRESHOLD = { current: 190_100, from: "1 July 2026", previous: 183_100 } as const;

export interface OteInput {
  /** Guaranteed base salary, per year, excluding super. */
  base: number;
  /** Commission or bonus paid at 100% of target, per year. */
  targetVariable: number;
  /** How much of target you actually hit, as a percentage (100 = on target). */
  attainmentPct: number;
}

export interface OteResult {
  ote: number;
  /** Share of OTE that is base, 0–100. */
  basePct: number;
  variableEarned: number;
  totalEarned: number;
  /** SG at the current rate on base + commission, capped at the maximum contribution base. */
  superGuarantee: number;
  /** What counts toward the FWC high income threshold: base only (commission can't be determined in advance). */
  highIncomeEarnings: number;
  aboveHighIncomeThreshold: boolean;
}

export function oteBreakdown(input: OteInput): OteResult {
  const base = Math.max(0, input.base);
  const target = Math.max(0, input.targetVariable);
  const ote = base + target;
  const variableEarned = Math.round(target * Math.max(0, input.attainmentPct)) / 100;
  const totalEarned = Math.round((base + variableEarned) * 100) / 100;
  const sgBase = Math.min(totalEarned, SUPER_GUARANTEE.maxContributionBaseAnnual);
  return {
    ote,
    basePct: ote > 0 ? Math.round((base / ote) * 1000) / 10 : 0,
    variableEarned,
    totalEarned,
    superGuarantee: Math.round(sgBase * SUPER_GUARANTEE.rate * 100) / 100,
    highIncomeEarnings: base,
    aboveHighIncomeThreshold: base >= HIGH_INCOME_THRESHOLD.current,
  };
}
