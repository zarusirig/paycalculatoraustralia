import { formatAUD } from "@/lib/constants";
import { EXTRA_PAY_SCHEDULES, FY_2026_27, extraPayTriggers, weeksInCalendarYear } from "@/lib/constants/pay-periods";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Calendar facts are computed
// in lib/constants/pay-periods.ts; the extra-withholding bands are the ATO's.

const FN = EXTRA_PAY_SCHEDULES.fortnightly;
const WK = EXTRA_PAY_SCHEDULES.weekly;
const T = extraPayTriggers(FY_2026_27);
const Y2026 = weeksInCalendarYear(2026);

export const PAY_PERIODS_FAQS: Faq[] = [
  {
    q: "How many fortnights are in a year?",
    a: "26. A fortnight is 14 days, so 26 fortnights cover 364 days, one day short of a 365-day year (two short in a leap year). That is why most people paid fortnightly get 26 pays a year, and occasionally 27.",
  },
  {
    q: "How many weeks are in a year?",
    a: `52 weeks and 1 day (${Y2026.days} days), or 52 weeks and 2 days in a leap year. The extra day means one weekday occurs 53 times: in 2026 that is Thursday, because the year starts on a Thursday.`,
  },
  {
    q: "How many fortnights are in the 2026-27 financial year?",
    a: `26 fortnights and 1 day (1 July 2026 to 30 June 2027 is 365 days). If your fortnightly pay day falls on Wednesday 1 July 2026, you get ${FN.extraPayCount} pay days in 2026-27, because the 27th falls on Wednesday 30 June 2027. Any other fortnightly cycle has 26.`,
  },
  {
    q: "Is 2026-27 a 53-week year for payroll?",
    a: `For anyone paid weekly on a ${T.weeklyWeekdays.join(" or ")}. 1 July 2026 and 30 June 2027 are both Wednesdays, so a Wednesday pay day occurs ${WK.extraPayCount} times in the 2026-27 financial year. Weekly pays on any other day give ${WK.standardPayCount}.`,
  },
  {
    q: "What happens to tax when there are 27 pays?",
    a: `The ATO's tax tables assume ${FN.standardPayCount} fortnightly pays, so a 27th pay can leave you under-withheld. The ATO lets you ask your employer to withhold a little more from each pay: ${formatAUD(FN.bands[0].additional)} a fortnight on earnings of ${formatAUD(FN.bands[0].from)} to ${formatAUD(FN.bands[0].to ?? 0)}, ${formatAUD(FN.bands[1].additional)} on ${formatAUD(FN.bands[1].from)} to ${formatAUD(FN.bands[1].to ?? 0)}, and ${formatAUD(FN.bands[2].additional)} from ${formatAUD(FN.bands[2].from)}. It's optional.`,
  },
  {
    q: "Do I get paid more in a 27-pay year?",
    a: "It depends on how your employer sets your pay. If you keep getting the same amount each fortnight, you receive 27 pays in that financial year instead of 26, so more lands in that year (and your taxable income for it is higher). Some employers instead adjust the fortnightly amount so the annual salary is spread over 27 pays. Your contract, award or agreement decides which.",
  },
  {
    q: "How many pay periods are there with monthly pay?",
    a: "Always 12. Monthly pay never has an extra pay period, which is why the extra-pay problem only affects weekly (53) and fortnightly (27) pay.",
  },
  {
    q: "Which months have three fortnightly pays?",
    a: "Two months in most years, because 26 pays spread over 12 months leaves two over. Which two depends on your pay cycle. Use the pay date calculator on this page to see them for your pay day.",
  },
];
