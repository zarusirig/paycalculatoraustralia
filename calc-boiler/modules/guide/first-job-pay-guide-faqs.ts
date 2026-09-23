// Shared FAQ copy for /first-job-pay-guide/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in the page file, so the structured data
// cannot drift from the page. Rates come from lib/constants.

import { EMPLOYMENT, SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE, TAX_FREE_THRESHOLD, formatAUD, formatPercent } from "@/lib/constants";
import { NMW } from "@/lib/constants/minimum-wage";
import { NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import type { FaqItem } from "@/lib/faq";

const TFT = formatAUD(TAX_FREE_THRESHOLD);
const PAY_DAYS = SUPER_GUARANTEE_CHARGE.current.businessDaysToPay;

export const FIRST_JOB_FAQS: readonly FaqItem[] = [
  {
    q: "Why is my first pay less than expected?",
    a: "Your employer deducts PAYG income tax from your gross pay before paying you. The amount deducted depends on your income level and whether you claimed the tax-free threshold on your TFN Declaration.",
  },
  {
    q: "Do I need a tax file number for my first job?",
    a: `Yes. If you don't provide a TFN (or tell your employer you have applied for one), your employer must withhold tax at ${formatPercent(NO_TFN_RATES.resident, 0)} of every dollar — the top marginal rate plus Medicare levy. Apply for a TFN online through the ATO.`,
  },
  {
    q: "How long does it take to get a TFN?",
    a: "Online applications take 10-28 business days. You can start work before receiving your TFN — you have 28 days to provide it to your employer. In the meantime, your employer withholds tax at the higher no-TFN rate, but this is corrected once you provide your TFN.",
  },
  {
    q: "What is the tax-free threshold?",
    a: `The tax-free threshold is ${TFT}. If your total annual income is ${TFT} or less, you pay no income tax. You claim the tax-free threshold on your TFN Declaration form, which tells your employer to withhold less tax from each pay. Only claim it at one employer if you have multiple jobs.`,
  },
  {
    q: "When does my employer pay super?",
    a: `Since ${SUPER_GUARANTEE.paydaySuperStart} (Payday Super), employers must pay super with each pay: the contribution has to reach your fund within ${PAY_DAYS} business days of payday (the old quarterly deadlines ended with the June 2026 quarter). Super appears on your payslip but is paid to your fund, not to you. Check your super fund account online to confirm contributions are being received.`,
  },
  {
    q: "What happens if I get a second job?",
    a: "Claim the tax-free threshold at only one employer — usually the one paying you the most. At your second employer, select \"no\" for the tax-free threshold on your TFN Declaration. Your second employer withholds tax at a higher rate. Use our Second Job Tax Calculator to see the impact.",
    links: { "Second Job Tax Calculator": "/second-job-tax-calculator/" },
  },
  {
    q: "What if my payslip looks wrong?",
    a: "First, check your hours against your roster or timesheet. Verify your pay rate matches your employment contract or the relevant award rate. If something is wrong, raise it with your employer's payroll team immediately. If your employer does not fix the error, contact the Fair Work Ombudsman on 13 13 94 for free advice.",
  },
  {
    q: "What is the minimum wage for my first job?",
    a: `The national minimum wage for adults (21+) is ${formatAUD(NMW.hourly, 2)} per hour or ${formatAUD(NMW.weekly, 2)} per week (from 1 July 2026). Casual employees receive an additional ${formatPercent(EMPLOYMENT.casualLoading, 0)} casual loading, making the casual minimum ${formatAUD(NMW.casualHourly, 2)}/hr. Many industries have award rates that are higher than the minimum wage — check our Award Rates Guide.`,
    links: { "Award Rates Guide": "/award-rates/" },
  },
  {
    q: "Do I have to lodge a tax return?",
    a: `If you earned above the tax-free threshold (${TFT}), you must lodge a tax return. Even if you earned less, you should lodge if tax was withheld from your pay — you will receive a refund of all tax paid. Lodge for free through myTax at my.gov.au after 1 July each year.`,
  },
];
