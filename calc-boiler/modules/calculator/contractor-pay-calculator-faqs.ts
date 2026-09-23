// Shared FAQ copy for /contractor-pay-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/contractor-pay-calculator/
// page.tsx, so the structured data cannot drift from the page. Figures come
// from the tax engine and lib/constants.

import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  GENERAL_INTEREST_CHARGE,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
} from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";
import { bracketRateList } from "@/modules/calculator/fy-rate-copy";

const FY = SITE_CONFIG.financialYear;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const ML = formatPercent(MEDICARE_LEVY.rate, 0);
/** No-ABN withholding: top marginal rate plus Medicare levy. */
const NO_ABN_RATE = formatPercent(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate + MEDICARE_LEVY.rate, 0);

/** Income tax (after LITO) plus Medicare levy on a full year's income. */
export const annualTaxAndMedicare = (income: number) =>
  Math.max(0, Math.round(calculateIncomeTax(income, true) - calculateLITO(income))) + calculateMedicareLevy(income);
/** $1,000 a day, 5 days a week, 48 working weeks. */
export const DAY_RATE_GROSS = 1_000 * 5 * 48;
export const DAY_RATE_NET = DAY_RATE_GROSS - annualTaxAndMedicare(DAY_RATE_GROSS);

export const CONTRACTOR_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "How much do I take home as a contractor in Australia?",
    a: `A contractor charging $1,000 per day grosses ${formatAUD(DAY_RATE_GROSS)} over 48 working weeks and takes home roughly ${formatAUD(Math.round(DAY_RATE_NET / 1_000) * 1_000)} after income tax and the ${ML} Medicare levy (FY${FY}). Take-home varies with hourly or daily rate, hours worked, GST treatment, and whether you set aside the ${SG} Super Guarantee for yourself. ABN contractors need to charge more than an equivalent PAYG hourly rate to cover lost leave, super, and insurance.`,
  },
  {
    q: "What is a contractor for tax purposes?",
    a: "A contractor (also called an independent contractor or ABN worker) operates their own business and invoices clients for work performed. Unlike employees, contractors handle their own tax, super, and insurance. The ATO uses a multi-factor test to determine if someone is genuinely a contractor — see our contractor vs employee guide.",
    links: { "contractor vs employee guide": "/contractor-vs-employee-calculator/" },
  },
  {
    q: "What's the difference between ABN and PAYG income tax?",
    a: `ABN contractors and PAYG employees pay the same marginal income tax brackets (${bracketRateList()}) plus the ${ML} Medicare levy in FY${FY}. The difference is in how it's collected: PAYG employees have tax withheld every pay cycle by their employer, while ABN contractors invoice gross and pay tax through quarterly PAYG instalments or at year-end. Contractors also handle GST (10%) once turnover reaches $75,000.`,
  },
  {
    q: "Do I need to charge GST as a contractor?",
    a: "If your ABN business turnover is $75,000 or more a year, you must register for GST and charge 10% on your invoices. The GST you collect is remitted to the ATO, usually quarterly on your BAS — it's not your income. If you're under $75,000, GST registration is optional.",
  },
  {
    q: "Do contractors need to pay super?",
    a: `If you're an independent contractor working under your own ABN, super is optional (but recommended). However, if a business hires you primarily for your labour (rather than achieving a specific result), they may be required to pay the ${SG} super guarantee on your behalf. Use the "Includes Super" toggle to model either scenario.`,
  },
  {
    q: "How do I calculate my contractor hourly rate?",
    a: `Your contractor rate should cover the benefits you lose compared to employment: super (${SG}), annual leave (4 weeks), sick leave, public holidays, insurance, and admin time. A common rule of thumb: multiply an equivalent employee hourly rate by 1.4-1.6 to get your contractor rate.`,
  },
  {
    q: "Can contractors claim business deductions?",
    a: "Yes. Contractors can deduct legitimate business expenses from their assessable income — including equipment, home office, vehicle, phone, software, professional development, and insurance. This calculator estimates tax on your gross income; your actual tax may be lower after claiming deductions on your tax return.",
  },
  {
    q: "How do PAYG instalments work for contractors?",
    a: `The ATO calculates your quarterly PAYG instalment amount based on your most recent tax return. Instalments are due on 28 October, 28 February, 28 April, and 28 July. You can choose the instalment amount method (ATO-calculated) or the instalment rate method (percentage of income). Paying a PAYG instalment late attracts the general interest charge — ${formatPercent(GENERAL_INTEREST_CHARGE.annualRate, 2)} a year for ${GENERAL_INTEREST_CHARGE.quarter}, reset every quarter.`,
  },
  {
    q: "Do I need both an ABN and a TFN as a contractor?",
    a: `Yes. Your Tax File Number (TFN) is used for your personal income tax return. Your Australian Business Number (ABN) is required on every invoice you issue. Clients who pay contractors without a valid ABN on the invoice must withhold ${NO_ABN_RATE} of the payment and remit it to the ATO.`,
  },
  {
    q: "What insurance do contractors need in Australia?",
    a: "Most contractors carry 3 types of insurance: public liability ($5–$20 million cover, costing $300–$1,200/year), professional indemnity (required for consultants, accountants, and IT professionals, costing $400–$2,000/year), and income protection (typically replaces up to 70% of income during illness or injury). Workers' compensation is compulsory in some states for contractors who employ others.",
  },
];
