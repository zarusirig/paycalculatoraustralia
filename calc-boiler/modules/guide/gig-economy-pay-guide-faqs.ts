// Shared FAQ copy for /gig-economy-pay-guide/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in the page file, so the structured
// data cannot drift from the page. Rates come from lib/constants.

import { SITE_CONFIG, SUPER_GUARANTEE, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { CPK_KM_CAP, CURRENT_CPK_RATE, CURRENT_CPK_YEAR, PREVIOUS_CPK_RATE, centsPerKmDeduction } from "@/lib/constants/cents-per-km";
import { GST_REGISTRATION_THRESHOLD } from "@/lib/constants/gig-tax";
import type { FaqItem } from "@/lib/faq";

/** GST registration turnover threshold (ATO "Registering for GST"), from lib/constants/gig-tax. */
const GST_THRESHOLD = formatAUD(GST_REGISTRATION_THRESHOLD);

/** Resident income tax + Medicare levy (LITO applied, no HECS) from the current-year engine. */
const taxShare = (income: number) => {
  const tax = calculatePayBreakdown({ grossSalary: income }).totalDeductions;
  return `${formatAUD(tax)} (about ${Math.round((tax / income) * 100)}%)`;
};
const KM = CPK_KM_CAP.toLocaleString("en-AU");

export const GIG_ECONOMY_FAQS: readonly FaqItem[] = [
  {
    q: "Do Uber drivers need to register for GST?",
    a: `Yes. All rideshare drivers must register for GST regardless of income level. This special GST rule applies to taxi and ride-booking services. You must register from your first trip. Delivery-only drivers (Uber Eats, DoorDash) do not need to register until their GST turnover reaches ${GST_THRESHOLD}.`,
  },
  {
    q: "Do food delivery riders need to register for GST?",
    a: `Only once your GST turnover reaches ${GST_THRESHOLD}. GST turnover is your gross income from all your business activities (less GST), not only delivery work. Delivery services are not classified as taxi or ride-booking services, so the special mandatory GST rule does not apply.`,
  },
  {
    q: "How much should I set aside for tax?",
    a: `Set aside two amounts. Income tax and the Medicare levy rise with your taxable income: in ${SITE_CONFIG.financialYear} a resident pays ${taxShare(50_000)} on ${formatAUD(50_000)} and ${taxShare(100_000)} on ${formatAUD(100_000)}. If you are registered for GST, one-eleventh of every GST-inclusive fare is GST you owe the ATO, so set that aside on top. Other income, deductions and a study loan change your figure. Use a separate bank account for tax savings.`,
  },
  {
    q: "Can I use the cents-per-km method for rideshare?",
    a: `Yes, but it is limited to ${KM} business kilometres: a maximum deduction of ${formatAUD(centsPerKmDeduction(CPK_KM_CAP, "2025-26"))} at ${Math.round(PREVIOUS_CPK_RATE * 100)}c/km on a 2025-26 return, and ${formatAUD(centsPerKmDeduction(CPK_KM_CAP))} at ${Math.round(CURRENT_CPK_RATE * 100)}c/km for ${CURRENT_CPK_YEAR}. Kilometres above ${KM} count only under the logbook method. Keep a 12-week logbook to establish your business-use percentage, then apply it to all actual car expenses for the year.`,
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
