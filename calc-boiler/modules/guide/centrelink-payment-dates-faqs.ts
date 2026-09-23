import { CHRISTMAS_2025_26, CHRISTMAS_2026_27_PUBLISHED } from "@/lib/constants/centrelink-payment-dates";
import { weekdayName } from "@/lib/constants/pay-periods";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: Services Australia
// QC 26071 (public holiday dates, live page and the Christmas 2025 version),
// QC 53206 (when to report) and QC 83477 (8 Dec 2025 media release), cited in
// lib/constants/centrelink-payment-dates.ts.
//
// ⚠️ REFRESH with the constants when the Christmas 2026 tables are published.

const S = CHRISTMAS_2025_26;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDate = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${weekdayName(iso)} ${d} ${MONTHS[m - 1]}`;
};

export const CENTRELINK_DATES_FAQS: Faq[] = [
  {
    q: "What are the Centrelink Christmas payment dates for 2026?",
    a: CHRISTMAS_2026_27_PUBLISHED
      ? "Services Australia has published the Christmas 2026 dates; see the tables on this page."
      : "Services Australia hasn't published them yet (checked 24 September 2026). Last year's tables were on its public holiday page in a version dated 27 October 2025. Until then, your Centrelink online account shows your own dates, and last year's official tables on this page show how the changes work.",
  },
  {
    q: "Does Centrelink pay early at Christmas?",
    a: `Often, yes. When a payment date falls on or around a public holiday, Services Australia pays before the normal day, as close to it as it can. In 2025, for example, pension payments due on Thursday 25 December were paid on ${longDate(S.pensions.noReport[3].revisedPayment)}. It isn't an extra payment: it's your regular payment early, so it has to last until your next one.`,
  },
  {
    q: "Is the Christmas early payment an extra payment?",
    a: "No. Services Australia says an early payment is your regular payment paid early, not an extra one. Your next payment comes on your normal date, which makes the gap after Christmas longer.",
  },
  {
    q: "When are Centrelink reporting dates over Christmas?",
    a: `If you report your income, you'll usually need to report earlier than normal, and your online account will show the new reporting date. In 2025, anyone due to report on Christmas Day or Boxing Day had to report on ${longDate(S.allowances.report[5].newReporting)}. When you report early, you include what you expect to earn for the rest of the period, and you can correct it within 14 days or at your next report.`,
  },
  {
    q: "How often does Centrelink pay?",
    a: "Most payments, including JobSeeker Payment and Age Pension, are paid every 2 weeks, and your payment day stays the same weekday each fortnight. Some people can choose to be paid weekly instead.",
  },
  {
    q: "What time do I have to report to Centrelink?",
    a: "By 5 pm on your reporting date, so you can be paid on time. Your reporting period is usually 14 days. You can't report before your reporting date unless a public holiday moves it. If you report late you can still do it online for up to 14 days, and you'll be paid after you report.",
  },
  {
    q: "Do pensioners have to report to Centrelink?",
    a: "Only if they have income to report. An Age Pension recipient who starts working moves onto scheduled reporting and reports every 2 weeks. If you don't have to report, your payment still moves earlier (never later) when your payment day falls on a public holiday.",
  },
  {
    q: "Which public holidays change Centrelink dates?",
    a: "The national holidays Services Australia closes for: New Year's Day, Australia Day, Good Friday, Easter Monday, Anzac Day, Christmas Day and Boxing Day. It publishes the changed dates before each one.",
  },
];
