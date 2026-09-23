// FAQ copy for /pro-rata-salary-calculator/, read by the page and its JSON-LD.
// Worked examples come from calculateProRata so the prose cannot drift.

import { EMPLOYMENT, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { PRO_RATA_DEFAULTS, calculateProRata } from "@/lib/constants/minimum-wage";

const threeDays = calculateProRata({ ...PRO_RATA_DEFAULTS, mode: "days", daysPerWeek: 3 });
const halfYear = calculateProRata({ ...PRO_RATA_DEFAULTS, mode: "hours", hoursPerWeek: EMPLOYMENT.standardWeeklyHours, monthsWorked: 6 });

export const PRO_RATA_EXAMPLE = { fte: PRO_RATA_DEFAULTS.fteSalary, threeDays, halfYear };

export const PRO_RATA_FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What is a pro rata salary?",
    a: `A pro rata salary is a full-time salary scaled down to the hours you actually work. "Pro rata" is Latin for "in proportion". A job advertised at ${formatAUD(PRO_RATA_DEFAULTS.fteSalary)} pro rata for three days a week pays 3/5 of that, or ${formatAUD(threeDays.annualSalary)} a year. The hourly rate is the same as a full-timer's; only the hours change.`,
  },
  {
    q: "How do you calculate a pro rata salary?",
    a: `Divide your ordinary hours by the full-time hours and multiply by the full-time salary. Full time is usually ${EMPLOYMENT.standardWeeklyHours} hours a week, the National Employment Standards maximum, so 22.8 hours is 0.6 FTE and ${formatAUD(PRO_RATA_DEFAULTS.fteSalary)} becomes ${formatAUD(threeDays.annualSalary)}. If you work full days, dividing days by five gives the same answer.`,
  },
  {
    q: "What does a salary of $X pro rata mean in a job ad?",
    a: `It means the advertised figure is the full-time equivalent (FTE). You are paid that figure multiplied by your fraction of full-time hours. For a 0.6 FTE role advertised at ${formatAUD(PRO_RATA_DEFAULTS.fteSalary)} pro rata, expect ${formatAUD(threeDays.annualSalary)} a year, or ${formatAUD(threeDays.fortnightly, 2)} a fortnight before tax.`,
  },
  {
    q: "How is pay pro-rated when you start part-way through the year?",
    a: `For a partial year the salary is scaled by the time you are employed. Six months full time on ${formatAUD(PRO_RATA_DEFAULTS.fteSalary)} is ${formatAUD(halfYear.payableSalary)}. Employers differ on method (calendar days, working days or pay periods), so a first or last pay can differ from this by a few dollars.`,
  },
  {
    q: "Do part-time employees get pro-rata leave and super?",
    a: `Yes. Part-time employees get the National Employment Standards leave in proportion to their ordinary hours: four weeks of annual leave and ten days of personal/carer's leave a year, each measured in their own ordinary hours. Super is paid at ${(SUPER_GUARANTEE.rate * 100).toFixed(0)}% of the pro-rata salary.`,
  },
];
