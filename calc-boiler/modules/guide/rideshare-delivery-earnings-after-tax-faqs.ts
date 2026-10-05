import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Rules are from ato.gov.au
// (read 5 October 2026); see lib/constants/gig-tax.ts. No answer makes a claim
// about what drivers or riders earn.

export const RIDESHARE_AFTER_TAX_FAQS: Faq[] = [
  {
    q: "Do Uber drivers have to register for GST?",
    a: "Yes. The ATO says ride-sourcing drivers must be registered for an ABN and for GST from the day they start, regardless of how much they earn. The only exception is an employee. Once registered you report and pay GST, lodge a business activity statement monthly or quarterly, and can claim GST credits on business purchases.",
  },
  {
    q: "Do food delivery riders have to register for GST?",
    a: "Only when GST turnover reaches $75,000. Delivery is not taxi or limousine travel, so the rule that applies to rideshare from the first trip does not apply. GST turnover is your gross business income less GST, not your profit. If you pass the threshold you register within 21 days.",
  },
  {
    q: "How much tax do rideshare and delivery drivers pay?",
    a: "Income tax is on your profit, which is your income less the expenses you can claim for the work, at the same resident rates as everyone else: 0% to $18,200, 15% to $45,000, 30% to $135,000, then 37% and 45%, plus the 2% Medicare levy. The low income tax offset can reduce tax at lower profits. The calculator on this page does the sums on your own figures.",
  },
  {
    q: "Is tax withheld from Uber or delivery payments?",
    a: "Not normally. The ATO notes that income from the sharing economy may not have tax withheld, so you can end up with a tax bill when you lodge your return. It suggests prepayments towards the bill, which you can make at any time and as often as you like. The ATO also requests data from sharing-economy platforms, so assume your payments are visible to it.",
  },
  {
    q: "What expenses can I claim as a rideshare or delivery driver?",
    a: "Costs related to doing the work, apportioned for private use. For rideshare the ATO says to claim only deductions related to transporting passengers for a fare and to apportion expenses to the time you are providing the service. Keep records. The two car methods are cents per kilometre (capped at 5,000 km) and the logbook method, which uses your business-use percentage of actual costs.",
  },
  {
    q: "Do I charge GST on top of the fare?",
    a: "If you are registered, GST applies to every dollar you earn from ride-sourcing and is included in the fare. You must issue a tax invoice for fares over $82.50 if a passenger asks for one. Your income for income tax purposes is the amount less the GST, and your GST credits reduce what you pay.",
  },
  {
    q: "How much should I set aside for tax?",
    a: "There is no single percentage because it depends on your profit, other income, GST status and any HELP debt. Put in your own annual payments and expenses in the calculator on this page to see a figure, or keep a separate account and make prepayments to the ATO as you go. This page does not state what drivers earn or what share to set aside.",
  },
  {
    q: "Do I get super as a rideshare or delivery driver?",
    a: "Not from the platform. A sole trader does not receive compulsory super guarantee on their own income, so contributions are voluntary. Personal contributions you claim as a deduction are taxed at 15% in the fund and count toward the concessional contributions cap.",
  },
  {
    q: "Am I an employee or a contractor?",
    a: "The ATO says it does not matter whether you are an employee, independent contractor or carrying on a business: income from services through a digital platform is assessable. The label affects whether tax is withheld, whether you get leave and super, and whether you can claim the expenses above. Use the contractor vs employee calculator and check your contract, and see the Fair Work Ombudsman if you are unsure.",
  },
];
