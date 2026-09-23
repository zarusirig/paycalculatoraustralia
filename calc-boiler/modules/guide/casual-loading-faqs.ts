// FAQ copy and worked examples for /casual-loading-calculator/, shared by the
// page body and its JSON-LD. Every figure comes from compareCasualPermanent.

import { EMPLOYMENT, formatAUD } from "@/lib/constants";
import { CASUAL_LOADING } from "@/lib/constants/junior-rates";
import { RETAIL_PENALTIES, HOSPITALITY_PENALTIES } from "@/lib/constants/hospitality-award";
import { NMW, compareCasualPermanent } from "@/lib/constants/minimum-wage";

const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;

/** $30/hr full time, taking the 4 weeks' holiday and no sick days. */
export const EXAMPLE_NO_SICK = compareCasualPermanent({ baseHourly: 30, hoursPerWeek: EMPLOYMENT.standardWeeklyHours, loading: CASUAL_LOADING, sickDaysUsed: 0, leaveLoading: false });
/** The same, using all 10 personal leave days and with 17.5% leave loading. */
export const EXAMPLE_ALL_LEAVE = compareCasualPermanent({ baseHourly: 30, hoursPerWeek: EMPLOYMENT.standardWeeklyHours, loading: CASUAL_LOADING, sickDaysUsed: EMPLOYMENT.personalLeaveDays, leaveLoading: true });

export const CASUAL_FAQS: readonly { q: string; a: string }[] = [
  {
    q: "How much is casual loading in Australia?",
    a: `Usually ${pct(CASUAL_LOADING)} of the base hourly rate. That is the loading for award and agreement-free employees under the National Minimum Wage Order, and it is the loading in the retail, fast food, hospitality and SCHADS awards. On the ${formatAUD(NMW.hourly, 2)} minimum wage, a casual gets at least ${formatAUD(NMW.casualHourly, 2)} an hour.`,
  },
  {
    q: "How do you calculate a casual rate?",
    a: `Multiply the permanent hourly rate by 1.25. A $30.00 permanent rate is ${formatAUD(EXAMPLE_NO_SICK.casualHourly, 2)} casual. On weekends and public holidays most awards add the loading to the penalty rather than multiplying them: a retail casual on Sunday gets ${pct(RETAIL_PENALTIES.casualSunday)} of the base rate (${pct(RETAIL_PENALTIES.sunday)} + 25%), not 187.5%.`,
  },
  {
    q: "What does casual loading replace?",
    a: `Casual loading is paid instead of the entitlements permanent employees get: paid annual leave, paid personal/carer's leave, notice of termination and redundancy pay. Casuals are also not paid for public holidays they do not work. They do get super, including on the loading, and unpaid carer's and compassionate leave.`,
  },
  {
    q: "Is casual or permanent better paid?",
    a: `For the same hours and the same weeks off, casual usually pays more in cash. On $30 an hour full time with four weeks' holiday, the casual earns ${formatAUD(EXAMPLE_NO_SICK.casualAnnual)} against ${formatAUD(EXAMPLE_NO_SICK.permanentAnnual)} permanent. Paid leave alone is worth the equivalent of a loading of about ${pct(EXAMPLE_NO_SICK.breakEvenLoading)}, rising to about ${pct(EXAMPLE_ALL_LEAVE.breakEvenLoading)} if the permanent employee uses all ten sick days and gets 17.5% leave loading. What the loading does not buy is job security, notice, redundancy pay or paid public holidays.`,
  },
  {
    q: "Do casuals get paid more on public holidays?",
    a: `Only if they work. Under the hospitality award a casual working a public holiday gets ${pct(HOSPITALITY_PENALTIES.casualPublicHoliday)} of the base rate, and under the retail award ${pct(RETAIL_PENALTIES.casualPublicHoliday)}. A casual who is not rostered on is not paid for the day, unlike a permanent employee.`,
  },
];
