// Shared FAQ copy for /redundancy-pay-calculator/.
//
// Read by both the rendered accordion (client component) and the FAQPage
// JSON-LD in app/redundancy-pay-calculator/page.tsx, so the structured data
// cannot drift from the visible answers. Kept out of the "use client" module:
// a Server Component importing an array across that boundary gets a client
// reference, not the data.

import { NOTICE_PERIODS, formatAUD } from "@/lib/constants";
import { LSL_JURISDICTIONS } from "@/lib/constants/long-service-leave";
import {
  ETP_RATES,
  GENUINE_REDUNDANCY_AGE_LIMIT,
  NES_REDUNDANCY_SCALE,
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

// The NES scale in words, read from the tested table so the prose cannot drift.
const SCALE_PAID = NES_REDUNDANCY_SCALE.filter((b) => b.weeks > 0 && b.toYears !== null);
const SCALE_TOP = NES_REDUNDANCY_SCALE[NES_REDUNDANCY_SCALE.length - 1];
const SCALE_TEXT =
  `${SCALE_PAID[0].weeks} weeks' pay at ${SCALE_PAID[0].fromYears} year, ` +
  SCALE_PAID.slice(1).map((b) => `${b.weeks} at ${b.fromYears}`).join(", ") +
  `, and ${SCALE_TOP.weeks} weeks from ${SCALE_TOP.fromYears} years`;
const NOTICE_MIN = NOTICE_PERIODS[0].weeks;
const NOTICE_MAX = NOTICE_PERIODS[NOTICE_PERIODS.length - 1].weeks;

export const REDUNDANCY_FAQS: readonly RedundancyFaq[] = [
  {
    q: "How much redundancy pay am I entitled to?",
    a: `Under the National Employment Standards, your redundancy pay is set by your completed years of continuous service: ${SCALE_TEXT}. With less than 1 year of service, you get no NES redundancy pay. An award, enterprise agreement or contract can give you more, never less.`,
  },
  {
    q: "How is redundancy pay calculated?",
    a: `Multiply your base weekly rate of pay for ordinary hours by the NES weeks for your years of service. On ${formatAUD(EX_SALARY)} a year with ${EX_YEARS} completed years that is ${formatAUD(EX_SALARY / 52, 2)} × ${nesRedundancyWeeks(EX_YEARS)} weeks = ${formatAUD(EX_GROSS, 2)}. Overtime, bonuses, allowances, loadings and penalty rates are left out of the base rate.`,
  },
  {
    q: `What is the tax-free redundancy limit for ${Y}?`,
    a: `The tax-free limit is ${formatAUD(REDUNDANCY_TAX.taxFreeBase)} plus ${formatAUD(REDUNDANCY_TAX.taxFreePerYear)} for each completed year of service, for genuine redundancy payments made in the ${Y} income year. With 5 completed years that is ${formatAUD(genuineRedundancyTaxFreeLimit(5))}. For payments made in ${REDUNDANCY_TAX_2025_26.incomeYear} it was ${formatAUD(REDUNDANCY_TAX_2025_26.taxFreeBase)} plus ${formatAUD(REDUNDANCY_TAX_2025_26.taxFreePerYear)} a year.`,
  },
  {
    q: "Is redundancy pay tax free?",
    a: `Partly. A genuine redundancy payment is tax-free up to ${formatAUD(REDUNDANCY_TAX.taxFreeBase)} plus ${formatAUD(REDUNDANCY_TAX.taxFreePerYear)} for each completed year of service in ${Y}. Anything above that limit is an employment termination payment (ETP) and is taxed. A payment that is not a genuine redundancy has no tax-free part.`,
  },
  {
    q: "How is redundancy pay taxed?",
    a: `A genuine redundancy payment is tax-free up to the limit. Anything above it is an employment termination payment (ETP). The ETP is taxed at ${pct(ETP_RATES.underPreservationAge)} if you are under preservation age (${PRESERVATION_AGE}) at the end of the income year, or ${pct(ETP_RATES.atOrOverPreservationAge)} if you have reached it. Both rates include the Medicare levy and apply up to the ${Y} ETP cap of ${formatAUD(REDUNDANCY_TAX.etpCap)}. Any amount over the cap is taxed at ${pct(ETP_RATES.aboveCap)}.`,
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
    q: "How much redundancy pay do you get in NSW?",
    a: `NSW redundancy pay is the same as in every other state: the National Employment Standards scale, from ${nesRedundancyWeeks(1)} weeks at 1 year to ${nesRedundancyWeeks(9)} weeks at 9 years and ${nesRedundancyWeeks(10)} weeks from 10 years, for national system employees. NSW adds long service leave under its 1955 Act, with a pro-rata payment from ${LSL_JURISDICTIONS.nsw.proRataFromYears} years when the employer ends the job for a reason other than serious and wilful misconduct.`,
  },
  {
    q: "What are redundancy entitlements in Victoria?",
    a: `Victorian redundancy pay follows the National Employment Standards scale, the same as every state, for national system employees. On top of that, you are paid notice or pay in lieu, unused annual leave and long service leave. Under Victoria's 2018 Act, long service leave is payable from ${LSL_JURISDICTIONS.vic.takeAfterYears} years of continuous service, however the employment ends.`,
  },
  {
    q: "Do small businesses have to pay redundancy?",
    a: `An employer with fewer than ${SMALL_BUSINESS_HEADCOUNT} employees owes no NES redundancy pay. The headcount is taken when notice is given and includes regular casuals. Notice, unused annual leave and any long service leave are still owed, and an award or agreement can still require redundancy pay. If a small business pays a genuine redundancy anyway, the ATO tax-free limit still applies to it.`,
  },
  {
    q: "Are casual employees entitled to redundancy pay?",
    a: "Not under the NES. Casual employees are excluded from NES redundancy pay however long they have worked. A long-term casual may be able to change to permanent employment under the Fair Work Act's employee choice pathway, after which redundancy pay would apply.",
  },
  {
    q: "Is notice pay part of redundancy pay?",
    a: `No. Notice pay and redundancy pay are separate entitlements and you get both. Notice is ${NOTICE_MIN} to ${NOTICE_MAX} weeks depending on service, plus 1 week if you are over 45 with at least 2 years' service. Payment in lieu of notice is an employment termination payment under the ATO's rules, not ordinary salary. How much of a package falls inside the genuine redundancy tax-free limit depends on how it is structured, so check the income statement your employer reports.`,
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
    a: `The usual explanation is long service leave: the long service leave law of every state and territory gives full long service leave by 10 years of continuous service, and it is paid out on top of redundancy pay. The ${nesRedundancyWeeks(10)} weeks is the NES minimum, and an award, agreement or contract can pay more.`,
  },
  // People Also Ask (Google AU, Sept 2026) for "redundancy pay calculator" and
  // "redundancy payment": docs/seo/2026-09-24-paa-optimisation.md.
  {
    q: "How much tax will I pay on $50,000 redundancy?",
    a: `Your tax depends on your completed years of service, because each year adds to the tax-free limit. For a genuine redundancy in ${Y} with 5 completed years, ${formatAUD(T50_5.taxFree)} is tax-free and the other ${formatAUD(T50_5.etpTaxable)} is taxed at ${pct(T50_5.rateWithinCap)}, so tax is about ${formatAUD(T50_5.tax)}. With 2 years only ${formatAUD(T50_2.taxFree)} is tax-free and tax is about ${formatAUD(T50_2.tax)}. Rates assume you are under ${PRESERVATION_AGE}.`,
  },
  {
    q: "Do you get more redundancy if you are over 45?",
    a: `Not under the National Employment Standards. NES redundancy pay depends only on completed years of service, not age, and so does the tax-free limit. Age matters for tax in two other ways: the taxable part is taxed at ${pct(ETP_RATES.atOrOverPreservationAge)} instead of ${pct(ETP_RATES.underPreservationAge)} once you reach ${PRESERVATION_AGE}, and a dismissal at or after ${GENUINE_REDUNDANCY_AGE_LIMIT} cannot be a genuine redundancy. Your agreement may pay more.`,
  },
  {
    q: "Is it better to take redundancy or resign?",
    a: "If your job really is being made redundant, resigning gives up your NES redundancy pay and the tax-free amount for a genuine redundancy. Redundancy also brings notice or pay in lieu. If you resign you still get your unused annual leave and any long service leave your state's rules pay out. Get the offer in writing before you decide.",
  },
];
