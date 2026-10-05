import { formatAUD } from "@/lib/constants";
import { ETP_RATES, PRESERVATION_AGE, REDUNDANCY_TAX_2025_26, REDUNDANCY_TAX_2026_27 as Y } from "@/lib/constants/redundancy";
import { WHOLE_OF_INCOME_CAP } from "@/lib/constants/termination-tax";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: ATO "Genuine
// redundancy payments" (QC27128, updated 5 Jun 2026), "Employment termination
// payments" key rates (updated 17 Apr 2026), "Payments that are ETPs" and
// "Working out the whole-of-income cap amount" (updated 24 Jul 2025), read
// 5 October 2026. See lib/constants/redundancy.ts and termination-tax.ts.

const pct = (r: number) => `${Math.round(r * 100)}%`;

export const TERMINATION_TAX_FAQS: Faq[] = [
  {
    q: "How is a termination payment taxed in Australia?",
    a: `An employment termination payment (ETP) is taxed at ${pct(ETP_RATES.atOrOverPreservationAge)} (including Medicare levy) if you have reached preservation age (${PRESERVATION_AGE}) by the end of the income year, or ${pct(ETP_RATES.underPreservationAge)} if you have not, up to the ETP cap of ${formatAUD(Y.etpCap)} for ${Y.incomeYear}. Anything above the cap is taxed at the top rate, ${pct(ETP_RATES.aboveCap)}. A genuine redundancy payment is tax-free up to a limit before any of this applies.`,
  },
  {
    q: "How much of a redundancy payment is tax-free?",
    a: `For a genuine redundancy in ${Y.incomeYear} the tax-free limit is ${formatAUD(Y.taxFreeBase)} plus ${formatAUD(Y.taxFreePerYear)} for each completed year of service. With 6 completed years that is ${formatAUD(Y.taxFreeBase + 6 * Y.taxFreePerYear)}. The limit was ${formatAUD(REDUNDANCY_TAX_2025_26.taxFreeBase)} plus ${formatAUD(REDUNDANCY_TAX_2025_26.taxFreePerYear)} in ${REDUNDANCY_TAX_2025_26.incomeYear} and is indexed each 1 July.`,
  },
  {
    q: "What makes a redundancy genuine for tax purposes?",
    a: "The ATO says a genuine redundancy is when your job is abolished, you no longer have a job and you are under age pension age. It is not genuine if you are dismissed because you reach normal retirement age, are age pension age or older on the day of dismissal, leave voluntarily, your contract ends, or you are dismissed for disciplinary or inefficiency reasons.",
  },
  {
    q: "What is the ETP cap for 2026-27?",
    a: `${formatAUD(Y.etpCap)}, up from ${formatAUD(REDUNDANCY_TAX_2025_26.etpCap)} in ${REDUNDANCY_TAX_2025_26.incomeYear}. The ETP cap is indexed each year. The amount of an ETP up to the cap is taxed at the concessional rate and the amount above it at the top marginal rate.`,
  },
  {
    q: "What is the whole-of-income cap?",
    a: `A separate ${formatAUD(WHOLE_OF_INCOME_CAP)} cap that applies to ETPs that are not excluded, such as a golden handshake or a non-genuine redundancy. It is reduced by your other taxable income in the same income year, whether earned before or after the payment, and the lesser of it and the ETP cap applies. The part of a genuine redundancy above the tax-free limit is an excluded ETP and is tested only against the ETP cap.`,
  },
  {
    q: "Is a payment in lieu of notice taxed as an ETP?",
    a: "Yes. The ATO lists payments in lieu of notice of termination as ETPs. If the payment is part of a genuine redundancy it counts towards the tax-free limit first. Notice you worked, and salary owed for work done, are ordinary pay and not ETPs.",
  },
  {
    q: "Is unused annual leave or long service leave taxed as an ETP?",
    a: "No. The ATO says payments for unused annual leave and long service leave are not ETPs. They are taxed under their own rules and also count as other taxable income for the whole-of-income cap. Use the final pay calculator for the leave part of a payout.",
  },
  {
    q: "Who pays the tax, and when?",
    a: "Your employer withholds the tax from the payment at the ETP rates and reports it to the ATO. When your tax return is assessed the ATO checks the caps against your full-year income. If you earn more taxable income later in the same financial year, for example from a new job, the whole-of-income cap can fall and you may owe extra tax on the ETP.",
  },
  {
    q: "Do I get a tax-free amount on a golden handshake or non-genuine redundancy?",
    a: "Not under the genuine redundancy rules. The tax-free base and per-year amount apply only to a genuine redundancy or an early retirement scheme payment. A golden handshake or non-genuine redundancy is an ETP from the first dollar, although a tax-free component can exist in some other cases, which the ATO explains on its tax-free component of ETPs page.",
  },
];
