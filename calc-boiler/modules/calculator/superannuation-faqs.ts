// Shared FAQ copy for /superannuation-calculator/.
//
// Read by both the rendered accordion (via an sr-only crawlable mirror) and
// the FAQPage JSON-LD in app/superannuation-calculator/page.tsx, so the
// structured data cannot drift from the visible page. Every figure is
// interpolated from lib/constants — none are typed as literals here.

import {
  formatAUD,
  formatPercent,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
} from "@/lib/constants";

const RATE = formatPercent(SUPER_GUARANTEE.rate, 0);

// ABS "Employee earnings" (Characteristics of Employment survey), reference
// period August 2025, released 12 December 2025: median weekly earnings in
// main job for full-time employees (persons) was $1,741, up from $1,700 in
// August 2024. Annualised below (×52) — not itself an ABS-published figure.
// https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings/latest-release
const MEDIAN_FULL_TIME_WEEKLY_EARNINGS = 1_741;
const MEDIAN_FULL_TIME_SALARY = MEDIAN_FULL_TIME_WEEKLY_EARNINGS * 52;

export interface SuperannuationFaq {
  q: string;
  a: string;
}

export const SUPERANNUATION_FAQS: readonly SuperannuationFaq[] = [
  {
    q: "Is super included in my salary?",
    a: `Typically, no — most contracts quote base salary with super paid on top of it. Check the wording: "plus super" means additional, "including super" means the headline figure already covers it, so your base salary is lower. For a worked example on a $90,000 package, see the pay-package FAQ on the homepage.`,
  },
  {
    q: "Do casual workers get super?",
    a: `Yes. Since 1 July 2022, all employees — including casuals — are entitled to SG regardless of how much they earn, after the previous ${formatAUD(450)}-a-month minimum earnings threshold was abolished. A casual worker earning ${formatAUD(200)} per week receives ${formatAUD(200 * SUPER_GUARANTEE.rate)} per week in super contributions at the ${RATE} rate.`,
  },
  {
    q: "Can my employer pay super less than 12%?",
    a: `No. ${RATE} SG is the legal minimum. Employers who don't pay in full and on time face the Super Guarantee Charge (SGC). Since Payday Super commenced on ${SUPER_GUARANTEE.paydaySuperStart} that is the shortfall, notional earnings at the general interest charge rate compounded daily, and an administrative uplift of up to ${formatPercent(SUPER_GUARANTEE_CHARGE.current.administrativeUpliftMax, 0)} — and unlike the old quarterly charge it is now tax-deductible.`,
  },
  {
    q: "How much super should I have at 30?",
    a: `A common benchmark is 1x your annual salary by age 30. The ABS's Employee earnings survey (reference period August 2025) put median full-time earnings at ${formatAUD(MEDIAN_FULL_TIME_SALARY)} a year (${formatAUD(MEDIAN_FULL_TIME_WEEKLY_EARNINGS)} a week), so that target is roughly ${formatAUD(MEDIAN_FULL_TIME_SALARY)} in super by age 30. If you're behind, salary sacrifice and voluntary contributions can help you catch up using the carry-forward unused cap rule for balances under ${formatAUD(500_000)}.`,
  },
  {
    q: "Is super paid on overtime?",
    a: `No. Overtime is excluded from Ordinary Time Earnings (OTE), so your employer doesn't have to pay super on overtime hours — a rule Payday Super kept. Super is calculated on your base hourly rate for ordinary hours only. Shift loadings for ordinary hours are included in OTE.`,
  },
  {
    q: "What is the maximum super contribution base?",
    a: `For FY${SITE_CONFIG.financialYear}, the maximum super contribution base is ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} per year. Payday Super replaced the old quarterly base (${formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter) with this annual figure from ${SUPER_GUARANTEE.paydaySuperStart}. Your employer only has to pay the ${RATE} SG rate on earnings up to this threshold, so the maximum SG for the year is ${formatAUD(SUPER_GUARANTEE.maxSGAnnual)}.`,
  },
  {
    q: "When does my employer have to pay super?",
    a: `Every payday. Since Payday Super commenced on ${SUPER_GUARANTEE.paydaySuperStart}, employers must pay SG each time they pay you, and the contribution must arrive in your fund within ${SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days of payday (${SUPER_GUARANTEE_CHARGE.current.businessDaysNewEmployee} business days for a new employee's first contribution). The old quarterly deadlines — within 28 days of each quarter's end — only applied to earnings paid up to 30 June 2026. Late or missed contributions trigger the Super Guarantee Charge, which is now tax-deductible, unlike the old quarterly charge.`,
  },
  {
    q: "What is Division 293 tax on super?",
    a: `Division 293 is an additional 15% tax on concessional super contributions for individuals with combined income and contributions above ${formatAUD(250_000)}. This brings the total tax on super contributions to 30% for high-income earners. The ATO issues a Division 293 assessment after you lodge your tax return.`,
  },
];
