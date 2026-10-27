// Shared FAQ copy for /gig-economy-pay-guide/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in the page file, so the structured
// data cannot drift from the page. Rates come from lib/constants.

import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { CPK_KM_CAP, CURRENT_CPK_RATE, CURRENT_CPK_YEAR, PREVIOUS_CPK_RATE, centsPerKmDeduction } from "@/lib/constants/cents-per-km";
import type { FaqItem } from "@/lib/faq";

/** GST registration turnover threshold (ATO); not modelled elsewhere in lib/constants. */
const GST_THRESHOLD = formatAUD(75_000);
const KM = CPK_KM_CAP.toLocaleString("en-AU");

export const GIG_ECONOMY_FAQS: readonly FaqItem[] = [
  {
    q: "Do Uber drivers need to register for GST?",
    a: `Yes. All rideshare drivers must register for GST regardless of income level. This special GST rule applies to taxi and ride-booking services. You must register from your first trip. Delivery-only drivers (Uber Eats, DoorDash) do not need to register until their turnover exceeds ${GST_THRESHOLD}.`,
  },
  {
    q: "Do food delivery riders need to register for GST?",
    a: `Only if your annual turnover from delivery work exceeds ${GST_THRESHOLD}. Delivery services are not classified as taxi or ride-booking services, so the special mandatory GST rule does not apply. Most part-time delivery riders do not reach the threshold.`,
  },
  {
    q: "How much should I set aside for tax?",
    a: "As a general rule, set aside 25-30% of your gross gig income. That amount covers income tax, the Medicare levy and GST if you are GST-registered. The exact amount depends on your total annual income, deductions, and whether you have other income sources. Use a separate bank account specifically for tax savings.",
  },
  {
    q: "Can I use the cents-per-km method for rideshare?",
    a: `Yes, but it is limited to ${KM} business kilometres: a maximum deduction of ${formatAUD(centsPerKmDeduction(CPK_KM_CAP, "2025-26"))} at ${Math.round(PREVIOUS_CPK_RATE * 100)}c/km on a 2025-26 return, and ${formatAUD(centsPerKmDeduction(CPK_KM_CAP))} at ${Math.round(CURRENT_CPK_RATE * 100)}c/km for ${CURRENT_CPK_YEAR}. Most rideshare drivers exceed ${KM} km quickly, so the logbook method suits them better. Keep a 12-week logbook to establish your business-use percentage, then apply it to all actual car expenses for the year.`,
  },
  {
    q: "Do I need an accountant for gig work?",
    a: "An accountant is not legally required for gig work, but it is strongly recommended if you are GST-registered or your gig income exceeds $30,000-$40,000. An accountant checks your BAS, finds the deductions you can claim and helps with tax planning. Tax agent fees are themselves tax deductible. Simple gig income with few deductions can be managed through myTax.",
  },
  {
    q: "Are platform commission fees deductible?",
    a: "Platform fees (Uber's service fee, Airtasker's commission) are deductible when you report gross income (total fares before fees). If you report net income (what you actually received), the fee is already accounted for. Platforms generally deduct their fee before you receive payment, so check your platform's annual tax summary to see which figure it reports to the ATO.",
  },
  {
    q: "Do I have to pay my own super as a gig worker?",
    a: `Super is not compulsory for sole traders, and no employer makes super contributions on your sole-trader gig income. Any super you build from gig work comes from contributions you make yourself. Personal concessional contributions (up to ${formatAUD(SUPER_GUARANTEE.concessionalCap)}/year in FY${SITE_CONFIG.financialYear}) are tax-deductible and taxed at only 15% in the fund.`,
  },
];
