// Shared FAQ copy for /overtime-pay-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/overtime-pay-calculator/page.tsx,
// so the structured data cannot drift from the page. Rates come from
// lib/constants; the TOIL ratio rules are in lib/constants/time-in-lieu.ts.

import { EMPLOYMENT, formatAUD, formatPercent, QUALIFYING_EARNINGS, SUPER_GUARANTEE, TAX_BRACKETS } from "@/lib/constants";
import { HOSPITALITY_OVERTIME, RETAIL_AWARD, RETAIL_OVERTIME, RETAIL_PENALTIES } from "@/lib/constants/hospitality-award";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const WEEK = EMPLOYMENT.standardWeeklyHours;
const DAY = WEEK / 5;
const LOW = TAX_BRACKETS[1];
const MID = TAX_BRACKETS[2];
const EXAMPLE_BASE = 30;
const HO = HOSPITALITY_OVERTIME;
const RO = RETAIL_OVERTIME;

export const OVERTIME_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "How is overtime pay calculated?",
    a: `Overtime pay is your base hourly rate multiplied by the overtime rate set in your award or enterprise agreement. Time-and-a-half on a ${formatAUD(EXAMPLE_BASE)}/hr base rate is ${formatAUD(EXAMPLE_BASE * 1.5)}/hr. Your award sets how many hours are paid at the first rate. The Hospitality Award pays ${pct(HO.weekdayFirst2Hours)} for the first 2 overtime hours Monday to Friday and ${pct(HO.weekdayAfter2Hours)} after that. The General Retail Award pays ${pct(RO.weekdayFirst3Hours)} for the first 3 hours Monday to Saturday and ${pct(RO.weekdayAfter3Hours)} after that.`,
  },
  {
    q: "When does overtime start?",
    a: `For most full-time employees, overtime begins after ${WEEK} hours per week (or ${DAY} hours per day). Your award or enterprise agreement sets the exact threshold, including whether a part-time employee earns overtime for hours past their agreed hours.`,
  },
  {
    q: "Do casual workers get overtime?",
    a: `Yes, where your award gives casuals overtime, and the Hospitality and General Retail awards both do. Your award sets when it starts, such as after ${WEEK} hours a week or past a daily maximum. Awards differ on the casual loading. The Hospitality Award pays casual overtime on the ordinary rate without the loading, so casuals get the same overtime dollars as full-time staff except on public holidays. The General Retail Award includes the loading: ${pct(RO.casualWeekdayFirst3Hours)} for the first 3 hours, against ${pct(RO.weekdayFirst3Hours)} for full-time staff. In both awards, casual weekend and public holiday rates are higher for the same reason: a General Retail casual gets ${pct(RETAIL_PENALTIES.casualSaturday)} on Saturday against ${pct(RETAIL_PENALTIES.saturday)} for permanent staff, and the gap is the ${pct(RETAIL_AWARD.casualLoading)} casual loading, which casuals are paid instead of paid leave.`,
  },
  {
    q: "Can I refuse to work overtime?",
    a: "You can refuse overtime if it is unreasonable. Under the National Employment Standards, an employer can request \"reasonable overtime\". The factors that decide whether it is reasonable include your personal circumstances, the notice given, your role, and health and safety risks. The Fair Work Ombudsman publishes guidance on what counts as reasonable overtime.",
  },
  {
    q: "Is superannuation paid on overtime hours?",
    a: `The ${formatPercent(SUPER_GUARANTEE.rate, 0)} Superannuation Guarantee is not paid on overtime where your award or agreement clearly sets your ordinary hours. From 1 July 2026, super is worked out on "qualifying earnings", and the ATO excludes ${QUALIFYING_EARNINGS.stillExcluded[0]}, the same as under the old ordinary time earnings rule. An enterprise agreement or employment contract can require your employer to pay super on overtime as well, so check yours.`,
  },
  {
    q: "Does overtime push me into a higher tax bracket?",
    a: `Overtime pushes only the part of your income above a bracket threshold into the higher tax bracket, not your entire income. Overtime adds to your total assessable income for the financial year. If total earnings including overtime cross an income tax bracket threshold (for example, from ${formatAUD(LOW.max)} to above ${formatAUD(MID.min)}), the portion above the threshold is taxed at the higher marginal rate of ${pct(MID.rate)} instead of ${pct(LOW.rate)}.`,
  },
  {
    q: "Can I take time off instead of overtime pay?",
    a: "Time off in lieu (TOIL) lets you take paid time off instead of overtime pay, but only where your award, enterprise agreement or contract allows it. The National Employment Standards do not provide TOIL. The award sets the ratio. The Clerks, Hospitality, Manufacturing, Security and SCHADS awards give time off hour for hour. The General Retail, Fast Food and Pharmacy awards give time equal to the overtime payment (2 hours at 150% = 3 hours off). You must genuinely agree to TOIL; an employer cannot unilaterally substitute it for overtime pay.",
  },
  {
    q: "Is there a maximum number of overtime hours per week?",
    a: "The National Employment Standards do not set a hard cap on overtime hours. However, an employer can only request \"reasonable\" additional hours. Under the Fair Work Act 2009, whether additional hours are reasonable depends on factors such as any risk to health and safety, your family responsibilities, the notice given, and the usual patterns of work in the industry.",
  },
];
