// =============================================================================
// Capital Gains Tax (CGT) — data + pure engine
//
// SOURCES (all retrieved via firecrawl 28 July 2026, raw markdown read directly):
//
//   [1] ATO "CGT discount" QC66019, last updated 29 June 2026
//       https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/cgt-discount
//   [2] ATO "How to calculate your CGT" QC104071, last updated 29 June 2026
//       .../capital-gains-tax/calculating-your-cgt/how-to-calculate-your-cgt
//   [3] ATO "Cost base of assets" QC66022, last updated 29 June 2026
//       .../capital-gains-tax/calculating-your-cgt/cost-base-of-asset
//   [4] ATO "Using capital losses to reduce capital gains" QC66025, 22 June 2026
//       .../capital-gains-tax/calculating-your-cgt/using-capital-losses-to-reduce-capital-gains
//   [5] ATO "What is capital gains tax?" QC69844, last updated 22 June 2026
//       .../capital-gains-tax/what-is-capital-gains-tax
//   [6] ATO "Eligibility for main residence exemption" QC69710, 22 June 2026
//   [7] ATO "Treating former home as main residence" QC66030, 22 June 2026
//   [8] Budget 2026-27, "Tax reform", https://budget.gov.au/content/04-tax-reform.htm
//   [9] Parliament of Australia, Treasury Laws Amendment (Tax Reform No. 1)
//       Bill 2026 — status "Act", assented 26 June 2026, Act No. 49 of 2026.
//       https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7493
//
// THE HEADLINE MISCONCEPTION. There is no separate "capital gains tax rate".
// ATO [5], verbatim: "Although it is referred to as 'capital gains tax', it's
// part of your income tax. It's not a separate tax." The net capital gain is
// added to taxable income and taxed at marginal rates. Every number this engine
// produces is derived that way — it never applies a standalone CGT rate.
//
// ORDER OF OPERATIONS. Losses come off BEFORE the discount, not after. ATO [1]:
// "If you have any capital losses from other assets, you must subtract these
// from your capital gains before applying the discount." Reversing those two
// steps understates the tax, and it is the single most common engine bug in
// third-party CGT calculators. The ATO's two-asset "Rhi" example in [2] exists
// to pin this and is asserted in the tests.
//
// YEAR NOTE — READ BEFORE CHANGING THE DISCOUNT. The 50% discount is CORRECT for
// the 2026-27 income year, but 2026-27 is the last full year it applies in its
// current form. The Treasury Laws Amendment (Tax Reform No. 1) Act 2026 [9]
// received assent on 26 June 2026 and replaces the 50% discount for individuals,
// trusts and partnerships with cost base indexation plus a 30% minimum tax rate
// on capital gains accruing ON AND AFTER 1 JULY 2027. It does not touch gains
// accruing before that date [8]. Do not apply the new regime to this engine
// until the ATO publishes indexation factors and apportionment guidance.
// =============================================================================

import { TAX_BRACKETS, calculateIncomeTax, calculateMedicareLevy } from "./australian-tax";

/** The income year these rules apply to. */
export const CGT_INCOME_YEAR = "2026-27";

// ---------------------------------------------------------------------------
// Discount rates
// ---------------------------------------------------------------------------

/** Entities the discount rules distinguish between. */
export type CgtEntity = "individual" | "trust" | "superFund" | "company";

/**
 * CGT discount by entity, for an asset owned at least 12 months. ATO [1]:
 * individuals and Australian trusts 50%, complying super funds 33.33%, and
 * "Companies can't use the CGT discount."
 */
export const CGT_DISCOUNT_RATES: Readonly<Record<CgtEntity, number>> = {
  individual: 0.5,
  trust: 0.5,
  superFund: 0.3333,
  company: 0,
} as const;

export const CGT_ENTITY_LABELS: Readonly<Record<CgtEntity, string>> = {
  individual: "Individual",
  trust: "Australian trust",
  superFund: "Complying super fund",
  company: "Company",
} as const;

/**
 * The 12-month ownership requirement. ATO [1]: "you must own it for at least
 * 12 months before the 'CGT event' happens", and you "exclude the day of
 * acquisition and the day of the CGT event" when counting.
 */
export const CGT_MINIMUM_OWNERSHIP_MONTHS = 12;

/**
 * Affordable rental housing. ATO [1]: an additional discount of up to 10% for
 * Australian-resident individuals providing affordable rental housing, which
 * "increases the CGT discount to up to 60%".
 */
export const CGT_AFFORDABLE_HOUSING = {
  extraDiscount: 0.1,
  maxDiscount: 0.6,
} as const;

/**
 * Indexation is an alternative to the discount, available only for assets
 * acquired before 21 September 1999 — and you cannot use both. ATO [1], [2].
 */
export const CGT_INDEXATION_CUTOFF = "21 September 1999";

/**
 * Assets acquired before this date are pre-CGT. ATO "List of CGT assets and
 * exemptions" QC66014 [10], last updated 22 June 2026: "Assets you acquired
 * before 20 September 1985 are exempt from CGT."
 *
 *   [10] .../capital-gains-tax/list-of-cgt-assets-and-exemptions
 */
export const CGT_START_DATE = "20 September 1985";

/**
 * Acquisition-cost thresholds below which a gain is disregarded [10].
 *   collectable    — "unless you acquired the collectable for $500 or less"
 *   personalUse    — "subject to CGT if it cost you more than $10,000"
 */
export const CGT_EXEMPT_THRESHOLDS = {
  collectable: 500,
  personalUse: 10_000,
} as const;

/** Assets the ATO lists as specifically exempt from CGT [10]. */
export const CGT_EXEMPT_ASSETS: readonly string[] = [
  "Assets acquired before 20 September 1985 (pre-CGT assets)",
  "Your main residence, where you meet all the conditions",
  "Cars and motorcycles — a car being a vehicle carrying under 1 tonne and fewer than 9 passengers",
  "Depreciating assets used solely for taxable purposes, such as business equipment and items in a rental property",
  "Collectables acquired for $500 or less, and personal use assets acquired for $10,000 or less",
  "Eligible granny flat arrangements",
  "Compensation or damages for a wrong, injury or illness suffered by you or a relative",
  "Winnings or losses from gambling, a game, or a competition with prizes",
] as const;

/**
 * Foreign and temporary residents cannot use the full discount for gains after
 * this date, though an apportioned discount may apply for a period of
 * Australian residency during ownership. ATO [1].
 */
export const CGT_FOREIGN_RESIDENT_CUTOFF = "8 May 2012";

// ---------------------------------------------------------------------------
// The 2027 reform — legislated, but NOT yet in force
// ---------------------------------------------------------------------------

/**
 * Treasury Laws Amendment (Tax Reform No. 1) Act 2026. Verified at the
 * Parliament of Australia bill page [9]: status "Act", finally passed both
 * Houses 25 June 2026, assent 26 June 2026, Act No. 49 of 2026.
 *
 * This is law, but it applies only to gains accruing on and after 1 July 2027.
 * For the 2026-27 income year the 50% discount is unchanged.
 */
export const CGT_REFORM_2027 = {
  actName: "Treasury Laws Amendment (Tax Reform No. 1) Act 2026",
  actNumber: "Act No. 49 of 2026",
  assentDate: "26 June 2026",
  startDate: "1 July 2027",
  /** Financial year in which the new regime first applies. */
  firstAffectedYear: "2027-28",
  /** Minimum tax rate on capital gains accruing from the start date. */
  minimumTaxRate: 0.3,
  /**
   * The Act itself, hosted on the ATO's own legal database. Cite this rather
   * than the bill page: the ATO's CGT pages still describe the change as
   * "announced in the 2026-27 Federal Budget" even after assent, which reads
   * as though it were only a proposal.
   */
  actUrl: "https://www.ato.gov.au/law/view/pdf/acts/20260049.pdf",
  billUrl:
    "https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7493",
  billsDigestUrl:
    "https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/bd/bd2526/26bd067",
  budgetUrl: "https://budget.gov.au/content/04-tax-reform.htm",
  /**
   * It is not a clean switch-off. Verified against the Parliamentary Library
   * bills digest for the Act.
   */
  discountSurvivesFor: [
    "capital gains accrued before 1 July 2027",
    "eligible new residential dwellings, where the taxpayer opts for the discount instead of indexation",
    "certain entities and assets placed outside the reforms",
  ],
  /** Entities excluded from the new indexation regime entirely. */
  indexationExcludes: [
    "companies",
    "complying superannuation entities",
    "life insurance companies",
    "foreign residents",
    "temporary residents",
  ],
  /**
   * The mechanic most likely to surprise a reader: assets are treated as
   * deemed-disposed on 30 June 2027 and reacquired on 1 July 2027, so a gain
   * can be split across the two regimes and apportioned between them.
   */
  deemedDisposalDate: "30 June 2027",
  splitsGainsAcrossRegimes: true,
} as const;

// ---------------------------------------------------------------------------
// Cost base
// ---------------------------------------------------------------------------

export interface CostBaseElement {
  /** ATO's numbering — "first element", "second element", and so on. */
  element: number;
  name: string;
  description: string;
  examples: readonly string[];
}

/** The five elements of the cost base, verbatim in substance from ATO [3]. */
export const COST_BASE_ELEMENTS: readonly CostBaseElement[] = [
  {
    element: 1,
    name: "Money paid or property given for the asset",
    description:
      "The money you paid (or are required to pay) for the asset, plus the market value of any property you gave to acquire it.",
    examples: ["Purchase price", "Market value of property exchanged"],
  },
  {
    element: 2,
    name: "Incidental costs of acquiring the asset or of the CGT event",
    description:
      "Ten specific incidental costs, incurred either when you acquired the asset or when you disposed of it.",
    examples: [
      "Stamp duty",
      "Conveyancing and legal fees",
      "Agent's commission on sale",
      "Surveyor, valuer, auctioneer, accountant or broker fees",
      "Advertising or marketing to find a buyer or seller",
      "Borrowing expenses such as loan application and mortgage discharge fees",
      "Search fees and the cost of a conveyancing kit",
    ],
  },
  {
    element: 3,
    name: "Costs of owning the asset",
    description:
      "Holding costs — but only where you could not claim them as a deduction. You cannot use these to work out a capital loss, and they do not apply to assets acquired before 21 August 1991.",
    examples: [
      "Rates and land tax",
      "Insurance premiums",
      "Repairs",
      "Non-deductible interest on money borrowed to acquire the asset",
    ],
  },
  {
    element: 4,
    name: "Capital costs to increase or preserve the asset's value",
    description:
      "Capital expenditure to increase or preserve the asset's value, or to install or move it. Goodwill is excluded.",
    examples: ["Capital improvements and extensions", "Costs of applying for zoning changes"],
  },
  {
    element: 5,
    name: "Capital costs of preserving or defending your title",
    description:
      "Capital expenditure to preserve or defend your ownership of, or rights to, the asset.",
    examples: ["Legal costs of defending title", "Paying a call on shares"],
  },
] as const;

/** Amounts the ATO expressly excludes from the cost base [3]. */
export const COST_BASE_EXCLUSIONS: readonly string[] = [
  "Any cost you can claim as a tax deduction — including capital works deductions, which reduce the cost base rather than adding to it",
  "GST net input tax credits, if you are registered for GST",
  "Expenditure you later recouped, such as an insurance payout or an amount paid by someone else, unless you included it in assessable income",
  "Heritage conservation expenditure, and land care or water facility spending that gave rise to a tax offset, for assets acquired after 13 May 1997",
  "Any part of an expense not attributable to acquiring the asset",
] as const;

// ---------------------------------------------------------------------------
// Main residence
// ---------------------------------------------------------------------------

/**
 * The main residence exemption is NOT automatic. All three conditions in ATO [6]
 * must hold for the full exemption; otherwise a partial exemption applies.
 */
export const MAIN_RESIDENCE_CONDITIONS: readonly string[] = [
  "The dwelling has been the home of you, your partner and other dependants for the whole period you owned it",
  "It has not been used to produce income — you have not run a business from it, rented it out, or bought it to renovate and sell at a profit",
  "It is on land of 2 hectares or less",
] as const;

/**
 * The absence ("6-year") rule, ATO [7]. Two different limits, and conflating
 * them is the common error: unlimited if the former home produces no income,
 * 6 years per absence if it does.
 */
export const ABSENCE_RULE = {
  /** Years you can treat a former home as your main residence while it earns income. */
  incomeProducingYears: 6,
  /** Grace period for treating two dwellings as your main residence when moving. */
  overlapMonths: 6,
  /** Land limit for the exemption, in hectares. */
  landLimitHectares: 2,
} as const;

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

/** Marginal rate applying at a given taxable income, from the shared brackets. */
export function marginalRateFor(taxableIncome: number): number {
  const income = Math.max(0, taxableIncome);
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
    if (income >= TAX_BRACKETS[i].min) return TAX_BRACKETS[i].rate;
  }
  return 0;
}

/**
 * The discount rate actually available. Returns 0 when the 12-month test fails,
 * when the entity is a company, or for a non-resident — matching ATO [1].
 */
export function discountRateFor(
  entity: CgtEntity,
  ownedAtLeast12Months: boolean,
  isAustralianResident = true,
): number {
  if (!ownedAtLeast12Months) return 0;
  if (!isAustralianResident) return 0;
  return CGT_DISCOUNT_RATES[entity];
}

export interface CostBaseInput {
  /** First element — what you paid for the asset. */
  purchasePrice: number;
  /** Second element, acquisition side — stamp duty, conveyancing, legal. */
  buyingCosts?: number;
  /** Second element, disposal side — agent's commission, legal fees on sale. */
  sellingCosts?: number;
  /** Third element — non-deductible rates, land tax, insurance, interest. */
  ownershipCosts?: number;
  /** Fourth element — capital improvements. */
  capitalImprovements?: number;
}

/** Sum the five elements. ATO [3]: the cost base is the total of the elements. */
export function calculateCostBase(input: CostBaseInput): number {
  const {
    purchasePrice,
    buyingCosts = 0,
    sellingCosts = 0,
    ownershipCosts = 0,
    capitalImprovements = 0,
  } = input;
  return (
    Math.max(0, purchasePrice) +
    Math.max(0, buyingCosts) +
    Math.max(0, sellingCosts) +
    Math.max(0, ownershipCosts) +
    Math.max(0, capitalImprovements)
  );
}

export interface CgtInput extends CostBaseInput {
  /** Capital proceeds — what you received on disposal. */
  salePrice: number;
  /** Whether the 12-month ownership test is met. */
  ownedAtLeast12Months: boolean;
  /** Your other taxable income for the year, before the gain. */
  otherIncome: number;
  /** Capital losses made this year on other assets. */
  currentYearLosses?: number;
  /** Net capital losses carried forward from earlier years. */
  carriedForwardLosses?: number;
  entity?: CgtEntity;
  isAustralianResident?: boolean;
  /**
   * Proportion of the gain that is exempt, 0 to 1 — for a partial main
   * residence exemption. 1 means fully exempt.
   */
  exemptProportion?: number;
}

export interface CgtResult {
  costBase: number;
  capitalProceeds: number;
  /** Proceeds less cost base. Negative means a capital loss. */
  grossGain: number;
  /** True when the disposal produced a capital loss rather than a gain. */
  isCapitalLoss: boolean;
  /** Portion of the gain removed by an exemption, before losses. */
  exemptAmount: number;
  /** Gain remaining after any exemption — the amount losses are applied to. */
  assessableGain: number;
  /** Losses actually used this year. */
  lossesApplied: number;
  /** Losses left over to carry forward. */
  lossesCarriedForward: number;
  /** Gain after losses, before the discount. */
  gainAfterLosses: number;
  discountRate: number;
  discountAmount: number;
  /** What goes in the tax return and is added to taxable income. */
  netCapitalGain: number;
  /** Taxable income once the net capital gain is included. */
  taxableIncomeWithGain: number;
  /** Income tax attributable to the gain. */
  incomeTaxOnGain: number;
  /** Medicare levy attributable to the gain. */
  medicareLevyOnGain: number;
  /** Income tax plus Medicare levy on the gain. */
  totalTaxOnGain: number;
  /** Top marginal rate the gain is exposed to. */
  marginalRate: number;
  /** Total tax on the gain as a share of the gross gain. */
  effectiveRateOnGain: number;
  /** Total tax had the discount not been available — for the 12-month comparison. */
  taxWithoutDiscount: number;
  /** Cash saved by qualifying for the discount. */
  discountSaving: number;
}

/**
 * Work out CGT for an individual, following the ATO's own 8 steps in [2].
 *
 * The gain is NOT taxed at a separate rate. It is added to taxable income and
 * the extra tax is measured as the difference in income tax and Medicare levy
 * with and without the net capital gain — which is what "taxed at your marginal
 * rate" actually means once the gain straddles brackets.
 *
 * Companies and super funds are handled for the DISCOUNT only. Their income is
 * not taxed on the individual scale, so the tax figures below assume an
 * individual.
 */
export function calculateCGT(input: CgtInput): CgtResult {
  const {
    salePrice,
    ownedAtLeast12Months,
    otherIncome,
    currentYearLosses = 0,
    carriedForwardLosses = 0,
    entity = "individual",
    isAustralianResident = true,
    exemptProportion = 0,
  } = input;

  const costBase = calculateCostBase(input);
  const capitalProceeds = Math.max(0, salePrice);
  const grossGain = capitalProceeds - costBase;
  const isCapitalLoss = grossGain < 0;

  // A partial main residence exemption removes a slice of the gain up front.
  const exemptShare = Math.min(1, Math.max(0, exemptProportion));
  const positiveGain = Math.max(0, grossGain);
  const exemptAmount = positiveGain * exemptShare;
  const assessableGain = positiveGain - exemptAmount;

  // Step 5 — losses come off BEFORE the discount, never after.
  const availableLosses = Math.max(0, currentYearLosses) + Math.max(0, carriedForwardLosses);
  const lossesApplied = Math.min(availableLosses, assessableGain);
  const lossesCarriedForward = availableLosses - lossesApplied;
  const gainAfterLosses = assessableGain - lossesApplied;

  // Step 7 — apply the discount to what is left.
  const discountRate = discountRateFor(entity, ownedAtLeast12Months, isAustralianResident);
  const discountAmount = gainAfterLosses * discountRate;
  const netCapitalGain = gainAfterLosses - discountAmount;

  // Step 8 — add it to taxable income and tax it at marginal rates.
  const base = Math.max(0, otherIncome);
  const taxableIncomeWithGain = base + netCapitalGain;

  const incomeTaxOnGain = calculateIncomeTax(taxableIncomeWithGain) - calculateIncomeTax(base);
  const medicareLevyOnGain = calculateMedicareLevy(taxableIncomeWithGain) - calculateMedicareLevy(base);
  const totalTaxOnGain = Math.max(0, incomeTaxOnGain + medicareLevyOnGain);

  // What it would have cost with no discount, so the 12-month rule can be priced.
  const undiscountedTaxable = base + gainAfterLosses;
  const taxWithoutDiscount = Math.max(
    0,
    calculateIncomeTax(undiscountedTaxable) -
      calculateIncomeTax(base) +
      calculateMedicareLevy(undiscountedTaxable) -
      calculateMedicareLevy(base),
  );

  return {
    costBase,
    capitalProceeds,
    grossGain,
    isCapitalLoss,
    exemptAmount,
    assessableGain,
    lossesApplied,
    lossesCarriedForward,
    gainAfterLosses,
    discountRate,
    discountAmount,
    netCapitalGain,
    taxableIncomeWithGain,
    incomeTaxOnGain,
    medicareLevyOnGain,
    totalTaxOnGain,
    marginalRate: marginalRateFor(taxableIncomeWithGain),
    effectiveRateOnGain: positiveGain > 0 ? totalTaxOnGain / positiveGain : 0,
    taxWithoutDiscount,
    discountSaving: Math.max(0, taxWithoutDiscount - totalTaxOnGain),
  };
}

/**
 * Apportion a gain where the main residence exemption applies to part of the
 * ownership period — the calculation behind the ATO's "Roya" example in [7]:
 *
 *   assessable gain = capital gain × (non-main-residence days ÷ ownership days)
 *
 * The ATO rounds the result to the nearest dollar.
 */
export function apportionMainResidenceGain(
  capitalGain: number,
  nonMainResidenceDays: number,
  ownershipDays: number,
): number {
  if (ownershipDays <= 0) return 0;
  const days = Math.min(Math.max(0, nonMainResidenceDays), ownershipDays);
  return Math.round(Math.max(0, capitalGain) * (days / ownershipDays));
}
