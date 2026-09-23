// Copy for /public-holiday-pay/ that is also emitted as JSON-LD. One array feeds
// both the visible FAQ and the FAQPage schema.
//
// NES sources (read 24 Sep 2026): Fair Work Ombudsman "Not working on public
// holidays" and "Public holiday penalty rates" (content updated 10 Aug 2026),
// Fair Work Act 2009 ss 114–116.

import { getAwardPublicHolidayRate, publicHolidayRateRange, PUBLIC_HOLIDAY_AWARD_RATES } from "./award-rates";
import { pctLabel } from "./calc";
import type { PhSource } from "./types";

export const PH_HUB_TITLE = "Public Holiday Pay Rates 2026 — Penalty Rates, Your Rights & Calculator";

export const PH_NES_SOURCES: readonly PhSource[] = [
  {
    title: "Not working on public holidays",
    url: "https://www.fairwork.gov.au/employment-conditions/public-holidays/not-working-on-public-holidays",
    publisher: "Fair Work Ombudsman",
  },
  {
    title: "Public holiday penalty rates",
    url: "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/penalty-rates/public-holiday-penalty-rates",
    publisher: "Fair Work Ombudsman",
  },
  {
    title: "Public holidays (working outside your state or region)",
    url: "https://www.fairwork.gov.au/employment-conditions/public-holidays",
    publisher: "Fair Work Ombudsman",
  },
  {
    title: "Fair Work Act 2009, sections 114–116",
    url: "https://www.legislation.gov.au/C2009A00028/latest/text",
    publisher: "Federal Register of Legislation",
  },
];

export function hubFaqs(): { q: string; a: string }[] {
  const range = publicHolidayRateRange();
  const retail = getAwardPublicHolidayRate("retail")!;
  const manufacturing = getAwardPublicHolidayRate("manufacturing")!;
  const hair = getAwardPublicHolidayRate("hair-and-beauty")!;
  return [
    {
      q: "What is the public holiday pay rate in Australia?",
      a: `There is no single national rate — your award or enterprise agreement sets it. Across the ${PUBLIC_HOLIDAY_AWARD_RATES.length} modern awards on this site, full-time and part-time employees are paid ${pctLabel(range.permanentMin)} to ${pctLabel(range.permanentMax)} of their base hourly rate for hours worked on a public holiday, and casuals ${pctLabel(range.casualMin)} to ${pctLabel(range.casualMax)}. The General Retail Award pays ${pctLabel(retail.permanent)} (casuals ${pctLabel(retail.casual)}).`,
    },
    {
      q: "Do I get paid for a public holiday if I don't work?",
      a: "Yes, if you are full-time or part-time and the public holiday falls on a day you would normally work. The National Employment Standards pay your base rate for the ordinary hours you would have worked. Penalties, loadings, allowances, bonuses and overtime are not included, and your employer can't change your roster to avoid the payment. Casuals are not paid for public holidays they don't work.",
    },
    {
      q: "Can my employer make me work on a public holiday?",
      a: "Your employer can ask, but the request has to be reasonable, and you can refuse if the request is unreasonable or you have reasonable grounds. Relevant factors include the type of workplace and job, your personal circumstances and caring responsibilities, whether you are full-time, part-time or casual, whether you could have expected to be asked, the penalty rates on offer and how much notice you were given. If the request is reasonable and your refusal is not, you can be required to work.",
    },
    {
      q: "Are casual public holiday rates added to the casual loading?",
      a: `In most awards the casual public holiday rate already includes the 25% loading — Retail's ${pctLabel(retail.casual)} is its ${pctLabel(retail.permanent)} plus 25 points — so nothing more is added. Two awards on this site work the other way: Manufacturing and Nurses express the casual rate as a percentage of the casual hourly rate, so Manufacturing's ${pctLabel(manufacturing.casualAsPrinted)} works out at ${pctLabel(manufacturing.casual)} of the base rate. The Hair and Beauty Award pays casuals ${pctLabel(hair.casual)}, the same as permanent staff.`,
    },
    {
      q: "What happens if a public holiday falls during my annual leave?",
      a: "If it falls on a day you would normally work, you are paid for the public holiday and it is not deducted from your annual leave or sick leave balance. Public holidays during unpaid leave, such as unpaid parental leave, are not paid. Whether a public holiday extends long service leave depends on your state's long service leave law.",
    },
    {
      q: "Can I swap a public holiday for another day?",
      a: "Only where your award or agreement allows it and you and your employer agree, or, if you are award and agreement free, by agreement with your employer. The substitute day is then treated as the public holiday for pay. Some awards also let a permanent employee take a lower rate plus a day added to annual leave instead of the full public holiday rate.",
    },
    {
      q: "Which state's public holidays do I get if I work interstate?",
      a: "The public holidays of the place your job is based, not where you happen to be working that day. The Fair Work Ombudsman's example is a Melbourne-based employee working in Sydney on Melbourne Cup Day, who still gets the Victorian public holiday entitlement.",
    },
    {
      q: "How are part-day public holidays paid?",
      a: "Only the hours inside the part-day window attract public holiday rates. Queensland's Christmas Eve holiday runs from 6pm to midnight, and South Australia's and the Northern Territory's Christmas Eve and New Year's Eve holidays from 7pm to midnight. A 3pm to 9pm shift on Christmas Eve in Adelaide is four ordinary hours and two public holiday hours.",
    },
  ];
}
