import { SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { LISTO_2027_28, LISTO_CURRENT, salaryForFullListo } from "@/lib/constants/listo";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: ATO "Low income
// super tax offset" (QC26138), ATO "Low Income Superannuation Tax Offset
// (LISTO)" new-legislation page (QC105616, updated 17 Mar 2026) and Treasury's
// LISTO fact sheet (13 Oct 2025), read 5 October 2026.

const NOW = LISTO_CURRENT;
const NEXT = LISTO_2027_28;
const SG_PCT = Math.round(SUPER_GUARANTEE.rate * 100);
/** Worked example: super guarantee on a $28,000 salary. */
const EXAMPLE_SG = 3_360;

export const LISTO_FAQS: Faq[] = [
  {
    q: "What is the low income super tax offset (LISTO)?",
    a: `LISTO is a government payment into your super fund if you are a low-income earner. It is ${Math.round(NOW.rate * 100)}% of the concessional (before-tax) super contributions you or your employer pay into your fund, up to a maximum of ${formatAUD(NOW.maxPayment)} a year. It is designed so low-income earners do not pay more tax on their super contributions than on their take-home pay.`,
  },
  {
    q: "Who is eligible for LISTO?",
    a: `You must meet all of these: concessional contributions (including super guarantee) were paid to a complying super fund; your adjusted taxable income is ${formatAUD(NOW.incomeThreshold)} or less; you did not hold a temporary resident visa at any time in the income year (New Zealand citizens are eligible); and at least 10% of your total income came from employment or business if you lodge a return, or from employment if you do not lodge.`,
  },
  {
    q: "How much is the LISTO payment?",
    a: `${Math.round(NOW.rate * 100)}% of your concessional contributions for the year, to a maximum of ${formatAUD(NOW.maxPayment)}. If you are eligible for less than ${formatAUD(NOW.minPayment)}, the ATO rounds it up to ${formatAUD(NOW.minPayment)}. For example, ${formatAUD(EXAMPLE_SG)} of super guarantee gives ${Math.round(NOW.rate * 100)}% = ${formatAUD(EXAMPLE_SG * NOW.rate)}, so the payment is capped at ${formatAUD(NOW.maxPayment)}.`,
  },
  {
    q: "How is LISTO changing from 1 July 2027?",
    a: `The LISTO income threshold rises from ${formatAUD(NOW.incomeThreshold)} to ${formatAUD(NEXT.incomeThreshold)}, matching the top of the second income tax bracket. The maximum payment rises from ${formatAUD(NOW.maxPayment)} to ${formatAUD(NEXT.maxPayment)} to reflect the higher super guarantee rate. The ATO says the measure is now law.`,
  },
  {
    q: "Do I need to apply for LISTO?",
    a: "No. You do not need to do anything to receive it, but your super fund must hold your tax file number (TFN), because without it the fund cannot accept a LISTO payment. The ATO pays it directly into your fund.",
  },
  {
    q: "When is LISTO paid?",
    a: "The ATO pays LISTO into your super fund after you lodge your tax return, using your return and information from your fund. If you do not lodge a return, the ATO works out your eligibility from your fund and other sources. If you have reached your preservation age and are retired you can apply to have it paid to you.",
  },
  {
    q: "Does LISTO apply to salary sacrifice contributions?",
    a: "Yes, the offset is calculated on concessional contributions, which include your employer's super guarantee, salary sacrifice amounts and personal contributions you claim a deduction for. Extra contributions only lift your payment until you reach the maximum.",
  },
  {
    q: "Is LISTO the same as the super co-contribution?",
    a: "No. LISTO is paid on before-tax contributions, which are usually your employer's. The government super co-contribution matches after-tax personal contributions. Low-income earners can receive both. See the super co-contribution page for the current thresholds.",
  },
  {
    q: "What is the lowest salary that gets the full LISTO?",
    a: `At a ${SG_PCT}% super guarantee rate the full ${formatAUD(NOW.maxPayment)} needs about ${formatAUD(salaryForFullListo(NOW))} of salary today. Under the 2027-28 rules the full ${formatAUD(NEXT.maxPayment)} needs a salary of ${formatAUD(NEXT.incomeThreshold)}, the top of the new income limit.`,
  },
];
