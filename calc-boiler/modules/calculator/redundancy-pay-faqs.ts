// Shared FAQ copy for /redundancy-pay-calculator/.
//
// Read by both the rendered accordion (client component) and the FAQPage
// JSON-LD in app/redundancy-pay-calculator/page.tsx, so the structured data
// cannot drift from the visible answers. Kept out of the "use client" module:
// a Server Component importing an array across that boundary gets a client
// reference, not the data.

import { formatAUD } from "@/lib/constants";
import {
  ETP_RATES,
  GENUINE_REDUNDANCY_AGE_LIMIT,
  PRESERVATION_AGE,
  REDUNDANCY_TAX,
  REDUNDANCY_TAX_2025_26,
  SMALL_BUSINESS_HEADCOUNT,
  genuineRedundancyTaxFreeLimit,
  nesRedundancyWeeks,
  redundancyTax,
} from "@/lib/constants/redundancy";

export interface RedundancyFaq {
  q: string;
  a: string;
}

const pct = (r: number) => `${Math.round(r * 100)}%`;
const Y = REDUNDANCY_TAX.incomeYear;
const EX_SALARY = 90_000;
const EX_YEARS = 5;
const EX_GROSS = (EX_SALARY / 52) * nesRedundancyWeeks(EX_YEARS);

// PAA example (Google AU, Sept 2026): "How much tax will I pay on $50,000 redundancy?"
const TAX_50K = (years: number) =>
  redundancyTax({ grossPayment: 50_000, completedYears: years, genuine: true, reachedPreservationAge: false });
const T50_5 = TAX_50K(5);
const T50_2 = TAX_50K(2);

export const REDUNDANCY_FAQS: readonly RedundancyFaq[] = [
  {
    q: "How much redundancy pay am I entitled to?",
    a: `Under the National Employment Standards it depends on your completed years of continuous service: 4 weeks' pay at 1 year, 6 at 2, 7 at 3, 8 at 4, 10 at 5, 11 at 6, 13 at 7, 14 at 8, 16 at 9, and 12 weeks from 10 years. Less than 1 year gets nothing. An award, enterprise agreement or contract can give you more, never less.`,
  },
  {
    q: "How is redundancy pay calculated?",
    a: `Multiply your base weekly rate of pay for ordinary hours by the NES weeks for your years of service. On ${formatAUD(EX_SALARY)} a year with ${EX_YEARS} completed years that is ${formatAUD(EX_SALARY / 52, 2)} × ${nesRedundancyWeeks(EX_YEARS)} weeks = ${formatAUD(EX_GROSS, 2)}. Overtime, bonuses, allowances, loadings and penalty rates are left out of the base rate.`,
  },
  {
    q: `What is the tax-free redundancy limit for ${Y}?`,
    a: `${formatAUD(REDUNDANCY_TAX.taxFreeBase)} plus ${formatAUD(REDUNDANCY_TAX.taxFreePerYear)} for each completed year of service, for genuine redundancy payments made in the ${Y} income year. With 5 completed years that is ${formatAUD(genuineRedundancyTaxFreeLimit(5))}. For payments made in ${REDUNDANCY_TAX_2025_26.incomeYear} it was ${formatAUD(REDUNDANCY_TAX_2025_26.taxFreeBase)} plus ${formatAUD(REDUNDANCY_TAX_2025_26.taxFreePerYear)} a year.`,
  },
  {
    q: "How is redundancy pay taxed?",
    a: `A genuine redundancy payment is tax-free up to the limit. Anything above it is an employment termination payment (ETP), taxed at ${pct(ETP_RATES.underPreservationAge)} if you are under preservation age (${PRESERVATION_AGE}) at the end of the income year or ${pct(ETP_RATES.atOrOverPreservationAge)} if you have reached it, both including the Medicare levy, up to the ${Y} ETP cap of ${formatAUD(REDUNDANCY_TAX.etpCap)}. Any amount over the cap is taxed at ${pct(ETP_RATES.aboveCap)}.`,
  },
  {
    q: "What makes a redundancy genuine for tax?",
    a: `The ATO treats a payment as a genuine redundancy payment when you are dismissed because your position is genuinely redundant, before you reach pension age (${GENUINE_REDUNDANCY_AGE_LIMIT}), the payment is no more than an arm's length amount, and there is no arrangement to employ you again. A dismissal for performance or misconduct, or a resignation, is not a redundancy.`,
  },
  {
    q: "Is there a different redundancy calculator for QLD, NSW, Victoria or WA?",
    a: "No. NES redundancy pay is set by the Fair Work Act and is the same in every state and territory for national system employees, so one calculator covers Queensland, NSW, Victoria, WA, SA, Tasmania, the ACT and the NT. What differs by state is long service leave, which is paid on top. The main exceptions are state public servants and, in WA, employees of sole traders, partnerships and other unincorporated businesses, who sit in state industrial systems.",
  },
  {
    q: "Do small businesses have to pay redundancy?",
    a: `No NES redundancy pay is owed by an employer with fewer than ${SMALL_BUSINESS_HEADCOUNT} employees, counted when the notice is given and including regular casuals. Notice, unused annual leave and any long service leave are still owed, and an award or agreement can still require redundancy pay. If a small business pays a genuine redundancy anyway, the ATO tax-free limit still applies to it.`,
  },
  {
    q: "Are casual employees entitled to redundancy pay?",
    a: "Not under the NES. Casual employees are excluded from NES redundancy pay however long they have worked. A long-term casual may be able to change to permanent employment under the Fair Work Act's employee choice pathway, after which redundancy pay would apply.",
  },
  {
    q: "Is notice pay part of redundancy pay?",
    a: "No. They are separate entitlements and you get both. Notice is 1 to 4 weeks depending on service, plus 1 week if you are over 45 with at least 2 years' service, Payment in lieu of notice is an employment termination payment under the ATO's rules rather than ordinary salary; how much of a package falls inside the genuine redundancy tax-free limit depends on how it is structured, so check the income statement your employer reports.",
  },
  {
    q: "Is superannuation paid on redundancy pay?",
    a: "No. The redundancy payment and unused leave paid out on termination are not ordinary time earnings, so the super guarantee does not apply to them. Your employer still owes super on wages up to your last day.",
  },
  {
    q: "Does redundancy pay affect Centrelink?",
    a: "It can delay your first JobSeeker payment. Services Australia may apply an income maintenance period based on the redundancy and leave payments, so a payment worth 10 weeks of wages can mean a waiting period of about 10 weeks, and a liquid assets waiting period of up to 13 weeks can also apply. Hardship provisions can reduce these.",
  },
  {
    q: "Why does redundancy pay drop from 16 to 12 weeks at 10 years?",
    a: "The usual explanation is long service leave: by 10 years most employees also qualify for it under their state or territory Act, and it is paid out on top of redundancy pay. The 12 weeks is the NES minimum; many agreements keep paying more after 10 years.",
  },
  // People Also Ask (Google AU, Sept 2026) for "redundancy pay calculator" and
  // "redundancy payment": docs/seo/2026-09-24-paa-optimisation.md.
  {
    q: "How much tax will I pay on $50,000 redundancy?",
    a: `It depends on your years of service. For a genuine redundancy in ${Y} with 5 completed years, ${formatAUD(T50_5.taxFree)} is tax-free and the other ${formatAUD(T50_5.etpTaxable)} is taxed at ${pct(T50_5.rateWithinCap)}, so tax is about ${formatAUD(T50_5.tax)}. With 2 years only ${formatAUD(T50_2.taxFree)} is tax-free and tax is about ${formatAUD(T50_2.tax)}. Rates assume you are under ${PRESERVATION_AGE}.`,
  },
  {
    q: "Do you get more redundancy if you are over 45?",
    a: `Not under the National Employment Standards. NES redundancy pay depends only on completed years of service, not age, and so does the tax-free limit. Age matters for tax in two other ways: the taxable part is taxed at ${pct(ETP_RATES.atOrOverPreservationAge)} instead of ${pct(ETP_RATES.underPreservationAge)} once you reach ${PRESERVATION_AGE}, and a dismissal at or after ${GENUINE_REDUNDANCY_AGE_LIMIT} cannot be a genuine redundancy. Your agreement may pay more.`,
  },
  {
    q: "Is it better to take redundancy or resign?",
    a: "If your job really is being made redundant, taking the redundancy is usually worth more. Redundancy brings NES redundancy pay, notice or pay in lieu, and a tax-free amount for a genuine redundancy. If you resign you get your unused annual leave and any long service leave your state's rules pay out, but no redundancy pay. Get the offer in writing before you decide.",
  },
];
