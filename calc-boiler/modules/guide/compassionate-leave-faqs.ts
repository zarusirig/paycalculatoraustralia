import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources in
// lib/constants/compassionate-leave.ts (fairwork.gov.au, read 24 Sep 2026).

export const COMPASSIONATE_LEAVE_FAQS: Faq[] = [
  {
    q: "How many days of compassionate leave do you get in Australia?",
    a: "2 days each time you meet the criteria, under the National Employment Standards. There is no yearly limit: a new 2 days applies to each death, life-threatening illness or injury, stillbirth or miscarriage. You can take it as one 2-day block, two single days, or other periods your employer agrees to.",
  },
  {
    q: "Is compassionate leave paid?",
    a: "Yes for full-time and part-time employees, at their base pay rate for the ordinary hours they would have worked. Casual employees get the same 2 days, but unpaid. Bonuses, loadings, allowances, overtime and penalty rates aren't included in the pay.",
  },
  {
    q: "Is bereavement leave the same as compassionate leave?",
    a: "Yes. The Fair Work Ombudsman says compassionate leave is also known as bereavement leave. It covers a death in your immediate family or household, and also a life-threatening illness or injury, a stillbirth and a miscarriage.",
  },
  {
    q: "Can I take compassionate leave for a grandparent, aunt or cousin?",
    a: "A grandparent, yes: grandparents are immediate family, as are your partner's grandparents. Aunts, uncles and cousins are not, so you can only take compassionate leave for them if they live in your household or your employer agrees.",
  },
  {
    q: "Does compassionate leave come out of sick leave?",
    a: "No. Compassionate leave doesn't accumulate and isn't part of your sick and carer's leave. If you are already on another type of leave, such as annual leave, when you need it, you can take compassionate leave instead of that leave.",
  },
  {
    q: "What proof do I need for compassionate leave?",
    a: "You must tell your employer as soon as you can, which may be after the leave has started. Your employer can ask for reasonable evidence, such as a death or funeral notice or a statutory declaration. If you don't give requested notice or evidence, you may not get the leave.",
  },
  {
    q: "What is family and domestic violence leave?",
    a: "A separate entitlement: 10 days of paid family and domestic violence leave each year for every employee, including casuals. The full 10 days is available immediately, resets on your work anniversary and doesn't build up from year to year.",
  },
];
