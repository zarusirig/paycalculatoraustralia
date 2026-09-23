// Coles — supermarket and Coles Liquor (Liquorland, First Choice, Vintage
// Cellars) wages-paid team members.
//
// Instrument: Coles Retail Enterprise Agreement 2024, AG2024/1124, AE524516,
// approved [2024] FWCFB 250 (Full Bench, 3 May 2024) with three undertakings,
// operative 7 October 2024, nominal expiry 3 May 2028. Read in full from the
// FWC PDF on 23 September 2026.
//
// ⚠️ THE 2026 DOLLARS ARE CALCULATED, NOT PRINTED. cl 3.1.1 prints the rates as
// made (March 2024). cl 3.4.1 lifts EVERY level by the percentage increase to
// the General Retail Industry Award LEVEL 1 rate from each July Annual Wage
// Review (2024, 2025, 2026, 2027), from the first full pay period AFTER 1 July
// (cl 3.4.2 — "after", not "on or after").
//
//   2025 column: the SDA's July 2025 Coles wage sheet (reproduces exactly from
//                cl 3.1 x 1.0375 x 1.035, rounded each year).
//   2026 column: 2025 x 1.0475, rounded to the cent. Retail Award Level 1 went
//                $26.55 -> $27.81 on 1 July 2026 (+4.75%).
//   Casual: base x 1.25 (cl 2.2.4(b)). Juniors: base x cl A3.3 percentage.
//
// Keeping unrounded figures through all three rises gives Level 1 $28.42, not
// $28.43 — the page says payslips may differ by a cent.
//
// No award-floor clause; s 206 FW Act is the floor. In 2026 every level is
// 62–73c above the matching Retail Award level.
//
// ⚠️ DO NOT COPY fairworkmate's "Coles pay rates 2026" — it shows the award's
// $26.55 -> $27.81, not the Coles agreement rates.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae524516.pdf";

export const COLES_PAY: EmployerPay = {
  slug: "coles",
  name: "Coles",
  employerEntity: "Coles Supermarkets Australia Pty Ltd and Liquorland (Australia) Pty Ltd",
  industry: "supermarket and liquor store",
  instrument: {
    kind: "enterprise-agreement",
    title: "Coles Retail Enterprise Agreement 2024",
    reference: "AG2024/1124, AE524516",
    url: EA_URL,
    approvedOn: "3 May 2024 ([2024] FWCFB 250), operating from 7 October 2024",
    nominalExpiry: "3 May 2028",
    coverage:
      "It covers wages-paid team members in Coles supermarkets — including online and home delivery and every department in store — and in Coles Liquor stores such as Liquorland, First Choice Liquor Market and Vintage Cellars. Salaried managers and Store Support Centre staff are excluded, and distribution centres fall outside it.",
  },
  ratesEffectiveFrom: "the first full pay period after 1 July 2026",
  nextIncrease: {
    date: "First full pay period after 1 July 2027",
    detail:
      "Every level rises by the percentage the 2027 Annual Wage Review gives the General Retail Industry Award Level 1 rate (cl 3.4.1). That is the last increase the agreement provides for.",
  },
  verifiedOn: "23 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Level 1", description: "Store team member, store cleaner, personal shopper; liquor sales assistant", hourly: 28.43, casualHourly: 35.54 },
    { level: "Level 2", description: "Ride-on trolley collector, Coles Services vehicle operator", hourly: 29.11, casualHourly: 36.39 },
    { level: "Level 3", description: "Skilled non-trades team member, second in charge (non-trades), customer service agent; liquor senior sales assistant", hourly: 29.56, casualHourly: 36.95 },
    { level: "Level 4", description: "Baker, administration assistant, service supervisor of up to 15 staff", hourly: 30.15, casualHourly: 37.69 },
    { level: "Level 5", description: "Service supervisor of more than 15 staff, second in charge (trades)", hourly: 31.37, casualHourly: 39.21 },
    { level: "Level 6", description: "Office in charge, department manager or team leader, duty manager", hourly: 31.84, casualHourly: 39.8 },
  ],
  juniorScale: [
    { age: "Under 16", percentage: 0.465 },
    { age: "16", percentage: 0.51 },
    { age: "17", percentage: 0.61 },
    { age: "18", percentage: 0.71 },
    { age: "19", percentage: 0.805 },
    { age: "20 and over", percentage: 1 },
  ],
  juniorNote:
    "Coles pays the full adult rate from 20 (Appendix A3.3). The agreement applies the junior percentage to \"the appropriate wage rate\" for your level; the table below shows Level 1, where almost every junior starts.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "Base rate", casual: "Base + 25%" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "Base + 25%", casual: "Base + 50%" },
    { when: "Saturday, 7am to 11pm", permanent: "Base + 25%", casual: "Base + 50%" },
    { when: "Sunday, 9am to 11pm", permanent: "Base + 50%", casual: "Base + 75%" },
    { when: "Public holiday, 7am to 11pm", permanent: "Base + 125%", casual: "Base + 150%", note: "9am to 11pm when the public holiday is a Sunday" },
  ],
  penaltyNotes: [
    "Casual rates already include the 25% loading, and the agreement says no rates are cumulative or compounding (cl 3.1.2): Sunday casual is 175%, not 150% × 1.25.",
    "There is no early-morning or late-night penalty for ordinary hours. Work before 7am, after 11pm, or before 9am on a Sunday is outside the ordinary spread and is paid as overtime.",
    "Employees engaged as night shiftworkers (shifts starting from 6pm to before 5am) are paid 130% Sunday night to Friday, 150% Saturday and 175% Sunday (casual 155%, 175%, 200%). Baking production shifts have their own early-start loadings.",
    "If you do not get a 12-hour break between shifts, you are paid 200% until you do (cl 4.3).",
  ],
  overtime: [
    { when: "Monday to Saturday", permanent: "150% for the first 3 hours, then 200%", casual: "175% for the first 3 hours, then 225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "The Coles agreement prints its 2024 starting rates and then lifts every level each July by the same percentage the Retail Award's Level 1 rate rises (cl 3.4.1) — 4.75% in 2026. The dollar figures here apply that rule to the agreement's own rates. Coles has not published a 2026 table, so your payslip may differ by a cent.",
    "Junior rates under the Retail Award rise from the first full pay period on or after 1 December 2026 for 18- to 20-year-olds with more than 6 months' service ([2026] FWCFB 222). An agreement can never pay a base rate below the award, so if the award rate for your age overtakes the Coles junior rate, you must be paid at least the award rate.",
  ],
  unverified: [
    "Coles Express, Coles Local and distribution centre pay — not named in the agreement; we have not confirmed which instrument covers them.",
    "Legacy Liquorland rates — some long-serving liquor staff keep higher 2014 rates under Appendix A4.3 until the Coles rate overtakes them.",
    "Allowances — see the agreement itself.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Coles Retail Enterprise Agreement 2024 (AE524516)", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Approval decision [2024] FWCFB 250", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2024fwcfb250.pdf" },
    { title: "General Retail Industry Award 2020 (MA000004), Level 1 from 1 July 2026", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
    { title: "Coles wage rates, July 2025 (cross-check of the 2025 column)", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://content.solcon.org.au/live/files/61299D6D-F0D7-4594-B150-6CDE2965EEEF.pdf" },
  ],
  faqs: [
    {
      q: "How much does Coles pay an hour in 2026?",
      a: "An adult Level 1 team member at Coles is paid $28.43 an hour as a permanent employee and $35.54 as a casual, from the first full pay period after 1 July 2026. Department managers at Level 6 are paid $31.84.",
    },
    {
      q: "How much does Coles pay 15 year olds?",
      a: "A Level 1 team member under 16 is paid 46.5% of the adult rate: about $13.22 an hour, or $16.53 as a casual. At 16 it rises to 51% (about $14.50), at 17 to 61% (about $17.34), and from 20 you get the full adult rate.",
    },
    {
      q: "What are Coles penalty rates?",
      a: "Weekday evenings from 6pm and Saturdays pay base + 25% (casual + 50%). Sundays from 9am pay base + 50% (casual + 75%), and public holidays base + 125% (casual + 150%). For an adult Level 1 casual, Sunday is about $49.75 an hour.",
    },
    {
      q: "What is the Coles EBA?",
      a: "The Coles Retail Enterprise Agreement 2024 (AE524516), approved by the Fair Work Commission on 3 May 2024. It covers Coles supermarket and Coles Liquor team members, runs to 3 May 2028, and ties each July's pay rise to the Retail Award Level 1 increase.",
    },
    {
      q: "Does Coles pay more than the award?",
      a: "Yes, by a small margin. In 2026 Coles Level 1 is $28.43 against $27.81 under the General Retail Industry Award, and Coles pays the adult rate from 20 where the award can pay 90% at that age.",
    },
  ],
};
