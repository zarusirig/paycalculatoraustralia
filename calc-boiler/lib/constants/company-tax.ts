// =============================================================================
// Company tax, GST and business-structure facts used by the structure pages
// (/employee-vs-sole-trader-vs-company/, /tech-salary-guide-australia/).
// Every value was read from the page cited beside it on 10 October 2026.
// =============================================================================

import { GST_REGISTRATION_THRESHOLD } from "./gig-tax";

/**
 * ATO "Changes to company tax rates" (last updated 4 September 2026): "From
 * the 2021–22 income year onwards, companies that are base rate entities must
 * apply the 25% company tax rate"; the table gives 25.0% for base rate
 * entities and 30.0% for all other companies for "2021–22 and future years",
 * with a $50m aggregated turnover threshold. A base rate entity also has "80%
 * or less of their assessable income ... that is base rate entity passive
 * income". ATO "Tax rates 2025–26" (companies) shows the same 25 / 30.
 */
export const COMPANY_TAX = {
  baseRateEntityRate: 0.25,
  fullRate: 0.3,
  aggregatedTurnoverThreshold: 50_000_000,
  /** Maximum share of assessable income that can be base rate entity passive income. */
  maxPassiveIncomeShare: 0.8,
  firstYear: "2021–22",
  sources: {
    rateChanges: "https://www.ato.gov.au/tax-rates-and-codes/company-tax-rate-changes",
    rates2025_26: "https://www.ato.gov.au/tax-rates-and-codes/company-tax-rates/tax-rates-2025-26",
  },
} as const;

/**
 * ATO "Registering for GST" (last updated 14 September 2026): register when
 * GST turnover is $75,000 or more, or $150,000 or more for a non-profit
 * organisation, within 21 days. The $75,000 figure is read from
 * GST_REGISTRATION_THRESHOLD in ./gig-tax.ts so the two cannot disagree.
 */
export const GST_REGISTRATION = {
  threshold: GST_REGISTRATION_THRESHOLD,
  nonProfitThreshold: 150_000,
  daysToRegister: 21,
  source: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst",
} as const;

/** ATO "How GST works": "a broad-based tax of 10% on most goods, services and other items". */
export const GST_RATE = 0.1;
export const GST_RATE_SOURCE = "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/how-gst-works";

/**
 * ATO personal services income pages: PSI is "income produced mainly (more
 * than 50%) from your skills or efforts as an individual"; where a company,
 * partnership or trust receives it and the PSI rules apply, it must "attribute
 * or treat any PSI received as belonging to each individual who produced the
 * income".
 */
export const PSI_SOURCES = {
  overview: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/personal-services-income",
  attribute:
    "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/personal-services-income/what-to-do-when-the-psi-rules-apply/how-to-attribute-psi",
} as const;

/**
 * ABR: a sole trader structure "is the simplest and cheapest business
 * structure" (Sole trader entitlement page); a successful online ABN
 * application means "you'll receive your 11-digit ABN immediately" (Applying
 * for an ABN).
 */
export const ABR_SOURCES = {
  soleTrader: "https://www.abr.gov.au/business-super-funds-charities/applying-abn/abn-entitlement/sole-trader",
  applying: "https://www.abr.gov.au/business-super-funds-charities/applying-abn",
} as const;
