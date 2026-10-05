import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Rates are the ATO 2026-27
// resident scale (ato.gov.au, "Tax rates – Australian resident", last updated
// 13 August 2026); the all-in bands are derived from them in
// lib/constants/marginal-rates.ts.

export const MARGINAL_TAX_RATES_FAQS: Faq[] = [
  {
    q: "What is a marginal tax rate?",
    a: "Your marginal tax rate is the tax rate on your next dollar of taxable income: the rate of the bracket your income finishes in. In 2026-27 the resident scale is 0% to $18,200, 15% to $45,000, 30% to $135,000, 37% to $190,000 and 45% above that, before the 2% Medicare levy. Only the dollars inside each bracket are taxed at that bracket's rate.",
  },
  {
    q: "What is the difference between marginal and average tax rate?",
    a: "The marginal rate is what you pay on the next dollar. The average (effective) rate is your total tax divided by your total income. Because the lower bands are taxed at lower rates, your average rate is always below your marginal rate. On $90,000 the marginal rate is 30% plus 2% Medicare, but the average rate including Medicare is only about 21%.",
  },
  {
    q: "Can a pay rise push me into a higher bracket and reduce my take-home pay?",
    a: "No. Moving into a higher bracket only taxes the part of your income above the threshold at the higher rate. Your existing income is taxed exactly as before, so a raise always increases take-home pay. The one thing that can make a raise feel small is the combined cost of tax, Medicare levy, HELP repayments and, without private hospital cover, the Medicare levy surcharge.",
  },
  {
    q: "How much of a $10,000 raise do I keep?",
    a: "It depends on where the raise falls. On $85,000 a $10,000 raise sits entirely inside the 30% bracket, so tax and Medicare take 32% and you keep $6,800. If a HELP debt applies, the repayment adds 15c per $1 above the threshold, so you keep less. Use the calculator above for your own figures.",
  },
  {
    q: "Is a bonus taxed at a higher rate than my normal pay?",
    a: "No. A bonus is added to your income for the year and taxed at your marginal rate, the same as a raise. It can look higher because your employer withholds tax on the bonus using the ATO's method for bonuses and back payments, which estimates the tax by spreading the payment across the year's pay periods. The withholding is only an estimate; any over-withholding comes back when you lodge your tax return.",
  },
  {
    q: "Why does the next dollar cost more than the bracket rate at lower incomes?",
    a: "Two things stack on top of the scale rate between about $28,000 and $67,000: the Medicare levy phases in at 10c per $1 above $28,011 until it reaches the full 2%, and the low income tax offset is withdrawn at 5c per $1 from $37,500 to $45,000 and 1.5c per $1 from $45,000 to $66,667. The all-in marginal rate in those ranges is 25%, 22% and 33.5%.",
  },
  {
    q: "What is my marginal tax rate at $100,000?",
    a: "At $100,000 taxable income your scale rate is 30%, and with the 2% Medicare levy the all-in marginal rate is 32%. Your average rate is lower, around 22% including Medicare. Without private hospital cover, crossing $105,000 adds the Medicare levy surcharge on your whole income.",
  },
  {
    q: "Does salary sacrifice save tax at my marginal rate?",
    a: "Yes. Salary sacrificed into super is taken from your pre-tax pay, so you avoid your marginal rate on it and pay 15% contributions tax in the fund instead. The higher your marginal rate, the bigger the saving. Employer concessional contributions are subject to the annual cap, so check it before sacrificing a large amount.",
  },
  {
    q: "Where can I see the full tax brackets?",
    a: "The full 2026-27 scale, with the tax payable at each threshold and the change from 2025-26, is on the tax brackets page. This page is about the other question: what the tax system takes from a raise, bonus or extra shifts.",
  },
];
