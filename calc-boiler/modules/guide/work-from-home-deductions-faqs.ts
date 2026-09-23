// Shared FAQ copy for /work-from-home-deductions/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/work-from-home-deductions/page.tsx, so the structured data cannot drift
// from the page. The fixed rate comes from RETURN_2026.wfhFixedRateCents.

import { formatAUD } from "@/lib/constants";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import type { FaqItem } from "@/lib/faq";

const CENTS = RETURN_2026.wfhFixedRateCents;
const PART_DAY_HOURS = 4;

export const WFH_FAQS: readonly FaqItem[] = [
  {
    q: "What is the fixed rate for working from home?",
    a: `The fixed rate is ${CENTS} cents per hour worked from home for the 2024-25 and 2025-26 income years (it was 67 cents from 2022-23 to 2023-24). It covers electricity and gas, phone, internet, stationery, and computer consumables, so you cannot claim those separately. You need a record of the actual hours you worked from home for the whole year.`,
  },
  {
    q: "Do I need a dedicated home office to claim WFH deductions?",
    a: "No. You do not need a dedicated room or separate office space. Under the fixed rate method, you need only a workspace where you perform your work duties — this can be a kitchen table, spare room, or any area of your home. A dedicated office is only required if you want to claim occupancy expenses (rent, mortgage interest), which most employees cannot claim.",
  },
  {
    q: "How do I track my WFH hours?",
    a: "Acceptable records include timesheets, rosters, time-tracking apps (Toggl, Clockify), employer-provided login/logout reports, or a personal diary. The record must cover the entire income year, not just a representative period. Digital records are accepted. The ATO recommends starting your record from 1 July.",
  },
  {
    q: "Should I use the fixed rate or actual cost method?",
    a: "The fixed rate method suits most employees — it is simpler and requires less record-keeping. The actual cost method may produce a larger deduction if you have high electricity costs (e.g., running air conditioning), an expensive internet plan with high work-use, or other significant running costs. Calculate both methods and choose the higher deduction.",
  },
  {
    q: "Can I claim WFH if my employer provides a laptop?",
    a: "Yes. Even if your employer provides a laptop and other equipment, you can still claim the fixed rate for running expenses (electricity, internet, phone, etc.). You cannot claim a deduction for the employer-provided equipment itself, but the running costs of working from home are still your expense.",
  },
  {
    q: "Can I claim for part of a day worked from home?",
    a: `Yes. The fixed rate method is based on hours, not days. If you work from home for ${PART_DAY_HOURS} hours in the morning and travel to the office in the afternoon, you claim ${PART_DAY_HOURS} hours at ${CENTS} cents (${formatAUD((PART_DAY_HOURS * CENTS) / 100, 2)}). Only count actual working hours — not lunch breaks, personal errands, or time between tasks.`,
  },
  {
    q: "Can both my partner and I claim WFH deductions?",
    a: `Yes. Each person claims separately based on their own hours worked from home. Under the fixed rate method, you each claim ${CENTS} cents per hour for the hours you individually worked from home. Under the actual cost method, you would each apportion expenses based on your individual work use — you cannot both claim 100% of the same bill.`,
  },
  {
    q: "Can I claim a new desk and chair?",
    a: `Yes. Office furniture is claimed separately from the fixed rate — it is not included in the ${CENTS}c/hr. Items costing $300 or less are an immediate deduction at the work-use percentage. Items over $300 are depreciated. A $500 office chair with 80% work use is depreciated at $40 per year (10-year effective life, 80% work use). Keep the purchase receipt.`,
  },
];
