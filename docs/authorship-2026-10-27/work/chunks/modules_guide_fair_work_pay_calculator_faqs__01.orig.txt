import type { Faq } from "./t3-shared";
import { formatAUD, calculatePayBreakdown, hourlyToAnnual, EMPLOYMENT } from "@/lib/constants";
import { AWR_2026_FLOORS } from "@/lib/constants/hospitality-award";
import { JUNIOR_PHASE_IN } from "@/lib/constants/modern-awards";
import { NMW, NMW_DECISION } from "@/lib/constants/minimum-wage";
import { SCHADS_SCHEDULE_E_INCREASE } from "@/lib/constants/schads-award";

// Shared by the page body and the FAQPage JSON-LD. Every figure is rendered
// from lib/constants. Sources: FWO Pay and Conditions Tool (PACT), FWO pay
// guides, FWC Annual Wage Review 2026 — read 25 September 2026.

const nmwWeekTakeHome = Math.round(calculatePayBreakdown({ grossSalary: hourlyToAnnual(NMW.hourly, EMPLOYMENT.standardWeeklyHours) }).weekly);

export const FAIR_WORK_PAY_CALCULATOR_FAQS: Faq[] = [
  {
    q: "Is the Fair Work pay calculator accurate?",
    a: `The Pay and Conditions Tool (PACT) is the Fair Work Ombudsman's own calculator and applies the award text, so its figures are the legal minimums for the award, classification, employment type, age and hours you enter. Its accuracy depends on those inputs: the most common error is choosing the wrong award or classification level. The result is a minimum, not what an enterprise agreement or contract may pay, and it does not deduct tax or super.`,
  },
  {
    q: "What if my enterprise agreement pays more than the award?",
    a: `Then the agreement applies and PACT does not calculate your pay. An enterprise agreement replaces the award for the employees it covers, but its base rate cannot be lower than the award base rate for the same classification, so the award figure is still the floor to check against. Find your agreement in the Fair Work Commission's document search and read its pay table.`,
  },
  {
    q: "How often do Fair Work pay rates change?",
    a: `Once a year. The Fair Work Commission's Annual Wage Review sets new minimums that apply from the first full pay period on or after 1 July. The 2026 review lifted the national minimum wage to ${formatAUD(NMW.hourly, 2)} an hour and award rates by ${(AWR_2026_FLOORS.increase * 100).toFixed(2)}% from ${NMW_DECISION.operativeFrom}; the next changes apply from ${NMW_DECISION.nextReviewOperativeFrom}. Some awards also change on other dates: junior rates in the retail, fast food and pharmacy awards start a phase-in on ${JUNIOR_PHASE_IN.commences}, and SCHADS home care disability rates rise on ${SCHADS_SCHEDULE_E_INCREASE.operativeFrom}.`,
  },
  {
    q: "What should I do if the calculator shows I am being underpaid?",
    a: `First confirm the classification and the pay period, since rates apply from the first full pay period on or after 1 July rather than 1 July itself. Then raise it with your employer in writing, showing the PACT result or pay guide. Our backpay calculator works out the shortfall over the period. If it is not fixed, contact the Fair Work Ombudsman on 13 13 94; underpayments can be recovered for up to six years.`,
  },
  {
    q: "Does the Fair Work pay calculator show take-home pay?",
    a: `No. PACT gives gross pay before tax and superannuation. On the national minimum wage of ${formatAUD(NMW.hourly, 2)} an hour, a ${EMPLOYMENT.standardWeeklyHours}-hour week is ${formatAUD(NMW.weekly, 2)} gross and about ${formatAUD(nmwWeekTakeHome)} after income tax and the Medicare levy on the current resident rates, with super paid on top by the employer. Use our take-home pay calculator for your own rate and hours.`,
  },
];
