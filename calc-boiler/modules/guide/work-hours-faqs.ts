// Shared FAQ copy for /work-hours-calculator/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD so the structured
// data cannot drift from the visible page.

import { EMPLOYMENT, formatAUD } from "@/lib/constants";
import { CASUAL_LOADING, STANDARD_WEEKLY_HOURS, decimalHoursToHm } from "@/lib/constants/work-hours";

export interface WorkHoursFaq {
  q: string;
  a: string;
}

export const WORK_HOURS_FAQS: readonly WorkHoursFaq[] = [
  {
    q: "How do I calculate my work hours?",
    a: `Take the finish time away from the start time, then subtract any unpaid break. A 9:00 am to 5:00 pm shift is 8 hours, less a 30-minute unpaid lunch, which leaves ${decimalHoursToHm(7.5)} — 7.5 hours in the decimal format payroll systems use. Do that for every day, then add the daily totals together for the week. The calculator above does all of it, including days that finish after midnight.`,
  },
  {
    q: "How does the calculator handle a shift that finishes after midnight?",
    a: "If the finish time is earlier than the start time, the shift is treated as crossing midnight and a full day is added before the subtraction. A shift from 10:00 pm to 6:00 am is eight hours, not minus sixteen. This is the single most common bug in timesheet tools, so it is covered by automated tests. Rows that cross midnight are flagged with a \"+1 day\" marker so you can see the calculator understood what you meant.",
  },
  {
    q: "How do I convert minutes to decimal hours?",
    a: `Divide the minutes by 60. 15 minutes is 0.25 hours, 30 minutes is 0.5, and 45 minutes is 0.75. The mistake to avoid is reading a decimal figure as hours and minutes: 7.5 hours is 7 hours 30 minutes, not 7 hours 50 minutes, and 7.25 hours is ${decimalHoursToHm(7.25)}. The calculator shows both formats side by side so you can check a payslip that uses either.`,
  },
  {
    q: "Should unpaid breaks be deducted from my hours?",
    a: "Yes, if the break is unpaid. A meal break taken under most awards is unpaid and does not count as time worked, so it comes off your paid hours. Shorter rest or tea breaks are usually paid and stay in. If you were required to stay on site or remain available during a break, it may still count as work — check your award or agreement, because the treatment varies.",
  },
  {
    q: "How many hours is a full-time week in Australia?",
    a: `${STANDARD_WEEKLY_HOURS} hours. The National Employment Standards set maximum weekly hours for a full-time employee at ${STANDARD_WEEKLY_HOURS} ordinary hours, plus reasonable additional hours. Part-time employees work fewer agreed hours with the same entitlements pro rata, and casuals have no guaranteed hours at all.`,
  },
  {
    q: "When does overtime start?",
    a: `It depends on your award or enterprise agreement, not on a single national rule. ${STANDARD_WEEKLY_HOURS} ordinary hours a week is the usual reference point, but many awards also trigger overtime on a daily limit, on hours outside the rostered span, or on work on a day you were not rostered. The multiplier varies too — the Hospitality Award pays the first two hours at time and a half then double time, while the Retail Award bands overtime differently from Monday to Saturday. The calculator lets you set the threshold and both multipliers so you can match your own award.`,
  },
  {
    q: "Do casual employees get the 25% loading on overtime hours?",
    a: `The ${CASUAL_LOADING * 100}% casual loading applies to a casual's ordinary hourly rate in place of paid leave. How it interacts with overtime is award-specific: some awards calculate overtime on the base rate plus loading, others compound the loading and the overtime multiplier differently, and a few pay overtime on the ordinary rate alone. This calculator applies the loading first and then the overtime multiplier, which matches the common approach — verify it against your award before relying on the figure.`,
  },
  {
    q: "Is 9am to 5pm eight hours or seven and a half?",
    a: "The span is eight hours. Whether you are paid for eight depends on the break. With a 30-minute unpaid lunch you are paid 7.5 hours; with a 60-minute unpaid lunch, 7 hours. Many salaried roles describe themselves as \"9 to 5\" while actually paying 7.6 hours a day, which is the standard 38-hour week spread over five days.",
  },
  {
    q: "How long does my employer have to keep timesheet records?",
    a: "Seven years. The Fair Work Act requires employers to keep time and wages records for seven years, including hours worked where an employee is casual or irregular part-time, overtime hours, and the start and finish times of any penalty-rate or loading period. Employees are entitled to ask for a copy of their own records. Keeping your own timesheet is still worth doing — it is the fastest way to spot an underpayment.",
  },
  {
    q: "Does this calculator work out my take-home pay?",
    a: `No — it works out gross pay for the period, before PAYG tax, study loan repayments and superannuation. At the ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} national minimum wage, a ${STANDARD_WEEKLY_HOURS}-hour week is ${formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} gross. Put that gross figure into the take-home pay calculator to see the net amount.`,
  },
  {
    q: "Is my timesheet saved anywhere?",
    a: "Only in your own browser. Entries are stored in this device's local storage so a part-filled timesheet survives a refresh or an accidental tab close. Nothing is uploaded, nothing is tied to an account, and the \"Clear timesheet\" button wipes the saved copy immediately.",
  },
];
