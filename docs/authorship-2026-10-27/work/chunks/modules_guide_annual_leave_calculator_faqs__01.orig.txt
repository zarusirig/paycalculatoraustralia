import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: Fair Work
// Ombudsman "Annual leave" and "Payment for annual leave" (read 5 October
// 2026) and ATO PAYG withholding Schedule 7 (applies to payments from 1 July
// 2026). See lib/constants/annual-leave.ts.

export const ANNUAL_LEAVE_CALCULATOR_FAQS: Faq[] = [
  {
    q: "How is annual leave calculated in Australia?",
    a: "Full-time and part-time employees get 4 weeks of paid annual leave a year, based on their ordinary hours. That is 1 hour of leave for every 13 ordinary hours worked. On a 38-hour week it is 152 hours a year, about 2.92 hours a week and 5.85 hours a fortnight. A part-timer on 20 hours a week earns 80 hours a year.",
  },
  {
    q: "How many hours of annual leave do I get on a 38-hour week?",
    a: "152 hours a year (4 weeks × 38 hours), which is 20 days of 7.6 hours. It builds gradually from your first day, so after six months you have about 76 hours. Unused leave rolls over each year.",
  },
  {
    q: "Do part-time employees get annual leave?",
    a: "Yes. Part-time employees get the same 4 weeks, pro rata to their ordinary hours. The Fair Work Ombudsman's own example is a part-timer on 20 hours a week, who accumulates 80 hours a year, the equivalent of 4 weeks of work for her.",
  },
  {
    q: "Do casual employees get annual leave?",
    a: "No. Casual employees do not get paid annual leave under the National Employment Standards. They are instead paid a casual loading, usually 25% on top of the hourly rate. A casual who no longer meets the definition of casual employment can ask to become permanent, after which annual leave applies.",
  },
  {
    q: "Do shiftworkers get 5 weeks of annual leave?",
    a: "Some do. Shiftworkers are entitled to more than 4 weeks if their award or enterprise agreement includes shiftwork provisions and defines them as employees who receive the additional week under the NES. If that applies to you, you get 5 weeks, or 190 hours on a 38-hour week. Check your award or agreement.",
  },
  {
    q: "Does annual leave keep building while I am on other leave?",
    a: "It keeps building while you are on paid leave (annual, sick and carer's, family and domestic violence), community service leave including jury duty, and long service leave. It does not build during unpaid annual leave, unpaid sick or carer's leave or unpaid parental leave, and not on leave that has been cashed out.",
  },
  {
    q: "How is annual leave paid?",
    a: "Annual leave is paid at your current base pay rate for all hours of leave taken. That excludes overtime, penalty rates, allowances and bonuses, unless your award or enterprise agreement says otherwise. Many awards add a 17.5% leave loading on top, which is not part of the NES.",
  },
  {
    q: "Do I get paid out for unused annual leave when I leave?",
    a: "Yes. When employment ends, your employer must pay the annual leave you have accumulated and not taken, even if your award, agreement or contract says otherwise. It is paid at the same amount as if you had taken the leave, including any leave loading you would have received.",
  },
  {
    q: "How is a payout of unused annual leave taxed?",
    a: "On a normal termination (such as resigning), unused annual leave and leave loading accrued after 17 August 1993 are taxed at your marginal rates, as part of your salary and wages for the year. If you are made genuinely redundant, or leave on invalidity or under an early retirement scheme, the ATO's withholding rate on unused annual leave and loading is a flat 32%. Leave accrued before 18 August 1993 on a normal termination is also withheld at 32%.",
  },
  {
    q: "Is super paid on an unused annual leave payout?",
    a: "No. The ATO treats unused leave on termination, including annual leave, leave loading and long service leave, as not ordinary time earnings and not qualifying earnings, so no super guarantee is payable on it. Super is payable on annual leave you take while still employed.",
  },
];
