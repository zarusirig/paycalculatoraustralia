import { SUPER_GUARANTEE, formatPercent } from "@/lib/constants";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources are cited in
// lib/constants/leave-loading.ts (award clauses and ATO schedules read
// 23 September 2026).

export const LEAVE_LOADING_FAQS: Faq[] = [
  {
    q: "What is leave loading?",
    a: "Leave loading is an extra payment, usually 17.5% of your base pay, paid on top of your normal pay while you're on annual leave. It comes from your award or enterprise agreement, not the National Employment Standards, so not every employee gets it.",
  },
  {
    q: "How do I calculate 17.5% leave loading?",
    a: "Multiply your base pay for the leave period by 0.175. Four weeks at $30 an hour and 38 hours a week is $4,560 of leave pay, and the loading is $4,560 × 17.5% = $798, so you're paid $5,358 before tax.",
  },
  {
    q: "Is leave loading 17.5% or my penalty rates?",
    a: "Under many awards it's whichever is higher. The Retail, Clerks, Fast Food, Pharmacy and Manufacturing awards compare 17.5% with the weekend (and, for shiftworkers, shift) penalties you would have earned and pay the greater amount, never both. The Hospitality Award pays a flat 17.5%.",
  },
  {
    q: "Is leave loading taxed?",
    a: "Yes. When it's paid with your leave, it's added to that pay's earnings and taxed through normal PAYG withholding. When it's paid as a separate lump sum, your employer uses the ATO's Schedule 5 method. It counts as income in your tax return either way.",
  },
  {
    q: "Is leave loading paid out when I resign?",
    a: "Yes, if your award or agreement pays it. Unused annual leave must be paid out as if you had taken it, including any loading. For leave accrued after 17 August 1993, tax is withheld at marginal rates on a normal resignation, or at a flat 32% on a genuine redundancy (ATO Schedule 7).",
  },
  {
    q: "Do casuals get leave loading?",
    a: "No. Casual employees don't get paid annual leave, so there's no leave loading. The 25% casual loading is paid instead of leave and other entitlements.",
  },
  {
    q: "Is super paid on leave loading?",
    a: `Generally yes. The ATO treats annual leave loading as ordinary time earnings unless it is linked to a lost opportunity to work overtime, so the ${formatPercent(SUPER_GUARANTEE.rate, 0)} super guarantee applies to it.`,
  },
];
