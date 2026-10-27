// One array renders the visible FAQ (modules/guide/pay-and-tax-changes-calendar.tsx)
// and emits the FAQPage JSON-LD (app/pay-and-tax-changes-calendar/page.tsx).
// Figures come from lib/constants/pay-tax-changes-calendar.ts and the files it reads.
import type { FaqItem } from "@/lib/faq";
import { EMPLOYMENT } from "@/lib/constants/australian-tax";
import { JUNIOR_TRANSITION_SCHEDULES, PENDING_JUNIOR_CHANGE } from "@/lib/constants/junior-rates";
import { NMW_DECISION } from "@/lib/constants/minimum-wage";

const ff = JUNIOR_TRANSITION_SCHEDULES.fastFood;

export const CHANGES_CALENDAR_FAQS: readonly FaqItem[] = [
  {
    q: "What changes on 1 December 2026?",
    a: `The Fair Work Commission's determinations for the General Retail, Fast Food and Pharmacy Industry Awards start the phase-in of higher junior percentages for 18 to 20 year olds with more than 6 months' service, from the first full pay period on or after ${PENDING_JUNIOR_CHANGE.earliestStart}. In fast food, 18 year olds go from ${ff.present.age18}% to ${ff.rows[0].age18}% of the adult rate, 19 year olds from ${ff.present.age19}% to ${ff.rows[0].age19}% and 20 year olds from ${ff.present.age20}% to ${ff.rows[0].age20}%. It is a phase-in, not a move to the adult rate, and it does not change the National Minimum Wage.`,
    links: { "Fast Food": "/fast-food-award-rates/" },
  },
  {
    q: "What changes on 1 January 2027?",
    a: "We have not found any national income tax, super, National Minimum Wage or award minimum rate change dated 1 January 2027 in ATO, Fair Work Ombudsman or Fair Work Commission sources. These rates change on 1 July or on a date set in a specific determination. 1 January is a public holiday, which can move pay days.",
    links: { "public holiday": "/public-holiday-pay/" },
  },
  {
    q: "When does the National Minimum Wage go up next?",
    a: `The next change is the ${NMW_DECISION.nextReview} outcome, which operates from ${NMW_DECISION.nextReviewOperativeFrom}. The current rate is $${EMPLOYMENT.minimumWageHourly.toFixed(2)} an hour, set by the ${NMW_DECISION.name} and in force from 1 July 2026. The new rate is not known until the Commission decides it.`,
    links: { [NMW_DECISION.name]: "/minimum-wage-australia/" },
  },
  {
    q: "When does the next income tax cut start?",
    a: "On 1 July 2027 the rate on income between $18,201 and $45,000 falls from 15% to 14%. It is already law, and the thresholds do not change. The cut that started on 1 July 2026 took that rate from 16% to 15%.",
    links: { "The cut that started on 1 July 2026": "/tax-changes-2026-27/" },
  },
  {
    q: "Can I add these dates to my calendar?",
    a: "Yes. Download the .ics file on this page and import it into Google Calendar, Apple Calendar or Outlook. It contains the upcoming change dates and the key individual tax return dates. It is a snapshot: re-download it after a date changes.",
  },
];
