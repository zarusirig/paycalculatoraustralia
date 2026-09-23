// Shared FAQ copy for /private-health-insurance-medicare/ — rendered by the
// page's accordion and turned into FAQPage JSON-LD in
// app/private-health-insurance-medicare/page.tsx. Every figure derives from
// lib/constants/medicare-levy-surcharge.ts.

import { MEDICARE_LEVY, formatAUD } from "@/lib/constants";
import { MLS_CHILD_INCREMENT } from "@/lib/constants/medicare-levy-extra";
import {
  MLS_APPROPRIATE_COVER_MAX_EXCESS,
  MLS_DAYS_IN_YEAR,
  MLS_INCOME_YEAR,
  estimateMls,
  familyBaseThreshold,
  formatMlsRate,
  phiRebateRate,
} from "@/lib/constants/medicare-levy-surcharge";
import type { FaqItem } from "@/lib/faq";

const S = MEDICARE_LEVY.surcharge;
const SINGLE_BASE = S.tier1.min - 1;
const FAMILY_BASE = familyBaseThreshold(0);
const EG_INCOME = 150_000;
const EG = estimateMls({
  own: { taxableIncome: EG_INCOME, reportableFringeBenefits: 0, netInvestmentLosses: 0, reportableSuperContributions: 0 },
  hasSpouse: false,
  spouseMlsIncome: 0,
  dependentChildren: 0,
  daysWithoutCover: MLS_DAYS_IN_YEAR,
});
const EG_BREAK_EVEN = EG.fullYearSurcharge / (1 - phiRebateRate(EG.tier, "under65"));

// LHC loading: 2% for each year over 30 without hospital cover, capped at 70%.
const LHC_PER_YEAR = 2;
const LHC_MAX = 70;
const LHC_EG_AGE = 45;

// Cover taken out on 1 January: days uncovered from 1 July to 31 December.
const DAYS_JUL_TO_DEC = 31 + 31 + 30 + 31 + 30 + 31;

export const PHI_MEDICARE_FAQS: readonly FaqItem[] = [
  {
    q: "What income triggers the Medicare Levy Surcharge?",
    a: `In ${MLS_INCOME_YEAR} the MLS applies to singles with income for MLS purposes above ${formatAUD(SINGLE_BASE)} or families above ${formatAUD(FAMILY_BASE)} who do not hold appropriate private patient hospital cover. The surcharge ranges from ${formatMlsRate(S.tier1.rate)} to ${formatMlsRate(S.tier3.rate)} depending on your income tier. Income for MLS purposes includes taxable income, reportable fringe benefits, total net investment losses and reportable super contributions.`,
  },
  {
    q: "Is it cheaper to get private health insurance or pay the surcharge?",
    a: `It depends on your income and your quote. Compare the surcharge you would pay with the premium after your rebate: at ${formatAUD(EG_INCOME)} a single pays ${formatAUD(EG.fullYearSurcharge)} of surcharge, so cover is cheaper if it costs less than ${formatAUD(EG_BREAK_EVEN)} a year before the rebate. The surcharge rises with income while the rebate falls, so cover tends to compare better at higher incomes. Private hospital cover also provides actual hospital coverage.`,
  },
  {
    q: "Does extras-only cover exempt me from the MLS?",
    a: `No. Only private hospital cover (or combined hospital and extras) counts for MLS exemption. An extras-only policy covering dental, optical, or physiotherapy does not satisfy the requirement. You need a compliant hospital insurance policy with an excess of ${formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.single)} or less for singles (${formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.family)} for families).`,
  },
  {
    q: "What is Lifetime Health Cover loading?",
    a: `Lifetime Health Cover (LHC) loading adds ${LHC_PER_YEAR}% per year to your hospital cover premium for every year you are aged over 30 without hospital cover. It maxes out at ${LHC_MAX}%. A person who first takes out cover at age ${LHC_EG_AGE} pays a ${(LHC_EG_AGE - 30) * LHC_PER_YEAR}% loading. The loading is removed after 10 continuous years of holding hospital cover.`,
  },
  {
    q: "Do I pay MLS for the full year if I get PHI part-way through?",
    a: `The MLS is calculated on a daily basis. If you hold eligible hospital cover for part of the financial year, the surcharge only applies for the days you were not covered. Taking out cover on 1 January means you pay MLS for the first ${DAYS_JUL_TO_DEC} days and are exempt for the remaining ${MLS_DAYS_IN_YEAR - DAYS_JUL_TO_DEC} days.`,
  },
  {
    q: "How does the family threshold work?",
    a: `The ${MLS_INCOME_YEAR} family MLS threshold is ${formatAUD(FAMILY_BASE)} combined income for MLS purposes. This increases by ${formatAUD(MLS_CHILD_INCREMENT)} for each dependent child after the first. Family income is the combined income of you and your spouse (including de facto partners). You, your spouse and your dependent children all need appropriate hospital cover for the family to avoid it.`,
  },
];
