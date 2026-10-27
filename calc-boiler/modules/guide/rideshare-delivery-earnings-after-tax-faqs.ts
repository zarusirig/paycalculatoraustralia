import type { Faq } from "./t3-shared";
import { MEDICARE_LEVY, TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { CPK_KM_CAP } from "@/lib/constants/cents-per-km";
import { GST_REGISTRATION_THRESHOLD, RIDE_SOURCING_TAX_INVOICE_THRESHOLD } from "@/lib/constants/gig-tax";
import { CONTRIBUTIONS_TAX_RATE } from "@/lib/constants/super-contributions";

const pct = (n: number) => `${Math.round(n * 100)}%`;
const [B0, B1, B2, B3, B4] = TAX_BRACKETS;
const RESIDENT_RATES = `${pct(B0.rate)} to ${formatAUD(B0.max, 0)}, ${pct(B1.rate)} to ${formatAUD(B1.max, 0)}, ${pct(B2.rate)} to ${formatAUD(B2.max, 0)}, then ${pct(B3.rate)} and ${pct(B4.rate)}`;

// Shared by the page body and the FAQPage JSON-LD. Rules are from ato.gov.au
// (read 5 October 2026); see lib/constants/gig-tax.ts. No answer makes a claim
// about what drivers or riders earn.

export const RIDESHARE_AFTER_TAX_FAQS: Faq[] = [
  {
    q: "Do Uber drivers have to register for GST?",
    a: "Yes. The ATO says Uber and other ride-sourcing drivers must be registered for an ABN and for GST from the day they start, regardless of how much they earn. The only exception is a driver who is an employee. Once registered you report and pay GST, lodge a business activity statement monthly or quarterly, and can claim GST credits on business purchases.",
  },
  {
    q: "Do food delivery riders have to register for GST?",
    a: `Food delivery riders must register for GST only when their GST turnover reaches ${formatAUD(GST_REGISTRATION_THRESHOLD, 0)}. Delivery is not taxi or limousine travel, so the rideshare rule of registering from the first trip does not apply. GST turnover is your gross business income less GST, not your profit. If you pass the threshold you register within 21 days.`,
  },
  {
    q: "How much tax do rideshare and delivery drivers pay?",
    a: `Rideshare and delivery drivers pay income tax on their profit, which is their income less the expenses they can claim for the work. The resident rates are the same as for everyone else: ${RESIDENT_RATES}, plus the ${pct(MEDICARE_LEVY.rate)} Medicare levy. The low income tax offset can reduce the tax when your total taxable income is low. The calculator on this page does the sums on your own payments and expenses.`,
  },
  {
    q: "Is tax withheld from Uber or delivery payments?",
    a: "Tax is not normally withheld from Uber or delivery payments. The ATO notes that income from the sharing economy may not have tax withheld, so you can end up with a tax bill when you lodge your return. The ATO suggests prepayments towards the bill, which you can make at any time and as often as you like. The ATO also requests data from sharing-economy platforms, so assume your payments are visible to it.",
  },
  {
    q: "What expenses can I claim as a rideshare or delivery driver?",
    a: `You can claim costs related to doing the rideshare or delivery work, apportioned for private use. For rideshare the ATO says to claim only deductions related to transporting passengers for a fare and to apportion expenses to the time you are providing the service. Keep records. The two car methods are cents per kilometre (capped at ${CPK_KM_CAP.toLocaleString("en-AU")} km) and the logbook method, which uses your business-use percentage of actual costs.`,
  },
  {
    q: "Do I charge GST on top of the fare?",
    a: `If you are registered, GST is included in the fare, not added on top, and applies to every dollar you earn from ride-sourcing. You must issue a tax invoice for fares over ${formatAUD(RIDE_SOURCING_TAX_INVOICE_THRESHOLD, 2)} if a passenger asks for one. Your income for income tax purposes is the fare less the GST, and your GST credits reduce what you pay.`,
  },
  {
    q: "How much should I set aside for tax?",
    a: "There is no single percentage because it depends on your profit, other income, GST status and any HELP debt. Enter your own annual payments and expenses in the calculator on this page to see the amount to set aside, or keep a separate account and make prepayments to the ATO as you go. This page does not state what drivers earn or what share to set aside.",
  },
  {
    q: "Do I get super as a rideshare or delivery driver?",
    a: `You do not get super from the rideshare or delivery platform. A sole trader does not receive compulsory super guarantee on their own income, so contributions are voluntary. Personal contributions you claim as a deduction are taxed at ${pct(CONTRIBUTIONS_TAX_RATE)} in the fund and count toward the concessional contributions cap.`,
  },
  {
    q: "Am I an employee or a contractor?",
    a: "The ATO says it does not matter whether you are an employee, independent contractor or carrying on a business: income from services through a digital platform is assessable. The label affects whether tax is withheld, whether you get leave and super, and whether you can claim the expenses above. Use the contractor vs employee calculator and check your contract, and see the Fair Work Ombudsman if you are unsure.",
  },
];
