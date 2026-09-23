// IGA — staff in IGA supermarkets. IGA is a banner, not an employer: every
// store is independently owned and operated, supplied by Metcash.
//
// Instrument: General Retail Industry Award 2020 (MA000004) — the default for
// supermarket staff whose employer has no enterprise agreement. Rates are
// cl 17.1 Table 4 from the first full pay period on or after 1 July 2026, the
// same transcription as RETAIL_RATES in lib/constants/hospitality-award.ts.
//
// Coverage evidence (researched 24 September 2026):
//   - Metcash describes IGA as "a network of independently owned stores";
//     Metcash's own agreements cover its warehouses and distribution centres
//     (listed by the FWC under storage services), not IGA stores.
//   - The FWC annual agreement lists 2019–2026 carry no IGA-wide agreement.
//   - BUT some store owners have their own: Lloyds IGA and SDA Enterprise
//     Agreement 2023 (AE520134, nominal expiry 30 June 2026) and Champions IGA
//     Supermarket Enterprise Agreement 2023 (AE522127, BMS Retail Group,
//     nominal expiry 31 December 2025), both still operating past expiry as no
//     replacement is listed. The title search cannot catch an agreement named
//     after the owner's company. The page therefore says "unless your store has
//     its own agreement" — never that all IGA staff are award-covered.
//
// Juniors: cl 17.2 Table 5, Levels 1–3 only. 20-year-olds with more than
// 6 months' service already get 100%. Junior dollars are OUR derivation
// (percentage of the weekly rate, / 38) — see lib/constants/junior-rates.ts.
// Phase-in from 1 Dec 2026 (PR813655): 18 → 75%, 19 → 85% for staff with more
// than 6 months with their employer.

import type { EmployerPay } from "./types";

const AWARD_URL = "https://awards.fairwork.gov.au/MA000004.html";

const SEE_AWARD = "Higher retail classification — the award's Schedule A lists the duties at each level";

export const IGA_PAY: EmployerPay = {
  slug: "iga",
  name: "IGA",
  employerEntity:
    "The company that owns your IGA store — every IGA supermarket is independently owned and operated, with Metcash as the wholesaler.",
  industry: "supermarket",
  instrument: {
    kind: "modern-award",
    title: "General Retail Industry Award 2020",
    reference: "MA000004",
    url: AWARD_URL,
    coverage:
      "There is no IGA-wide enterprise agreement: each store's owner is the employer, and the General Retail Industry Award covers its staff unless that owner has its own approved agreement. A few do — for example Lloyds IGA and Champions IGA — and an agreement still cannot pay a base rate below the award.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026 (juniors aged 18 and 19)",
    detail:
      "Staff aged 18 or 19 at Levels 1 to 3 who have worked for their employer for more than 6 months move up: 18-year-olds from 70% to 75% and 19-year-olds from 80% to 85% of the adult rate (determination PR813655). At Level 1 that is $20.86 and $23.64 an hour. Adult rates next change with the 2027 Annual Wage Review.",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Retail employee level 1", description: "Most supermarket staff: checkout, customer service, shelf filling, trolley collection", weekly: 1056.8, hourly: 27.81, casualHourly: 34.76 },
    { level: "Retail employee level 2", description: SEE_AWARD, weekly: 1081.0, hourly: 28.45, casualHourly: 35.56 },
    { level: "Retail employee level 3", description: SEE_AWARD, weekly: 1097.8, hourly: 28.89, casualHourly: 36.11 },
    { level: "Retail employee level 4", description: SEE_AWARD, weekly: 1119.1, hourly: 29.45, casualHourly: 36.81 },
    { level: "Retail employee level 5", description: SEE_AWARD, weekly: 1165.1, hourly: 30.66, casualHourly: 38.33 },
    { level: "Retail employee level 6", description: SEE_AWARD, weekly: 1182.1, hourly: 31.11, casualHourly: 38.89 },
    { level: "Retail employee level 7", description: SEE_AWARD, weekly: 1241.4, hourly: 32.67, casualHourly: 40.84 },
    { level: "Retail employee level 8", description: SEE_AWARD, weekly: 1291.8, hourly: 33.99, casualHourly: 42.49 },
  ],
  juniorScale: [
    { age: "Under 16", percentage: 0.45 },
    { age: "16", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20 (6 months' service or less)", percentage: 0.9 },
    { age: "20 (more than 6 months' service)", percentage: 1 },
    { age: "21 and over", percentage: 1 },
  ],
  juniorNote:
    "Retail Award junior percentages (cl 17.2) apply only at Levels 1 to 3; a junior doing Level 4 work or above gets the full adult rate. A 20-year-old who has worked for the employer for more than 6 months already gets 100%.",
  penalties: [
    { when: "Monday to Friday, before 6pm", permanent: "100%", casual: "125%" },
    { when: "Monday to Friday, after 6pm", permanent: "125%", casual: "150%" },
    { when: "Saturday", permanent: "125%", casual: "150%" },
    { when: "Sunday", permanent: "150%", casual: "175%" },
    { when: "Public holiday", permanent: "225%", casual: "250%" },
  ],
  penaltyNotes: [
    "Percentages are of the minimum hourly rate for your level (award cl 22.1, Table 12, for employees who are not shiftworkers). Casual figures add the 25% loading rather than multiply it: Sunday casual is 175%, not 187.5%.",
    "For an adult Level 1 employee that is $34.76 an hour on a weekday evening or Saturday ($41.72 casual), $41.72 on a Sunday ($48.67 casual) and $62.57 on a public holiday ($69.53 casual).",
    "Staff employed specifically as shiftworkers (for example night fill on shifts) are paid under the award's shiftwork rates instead: 130% Monday to Friday, 150% Saturday and 175% Sunday (casual 155%, 175%, 200%).",
  ],
  overtime: [
    { when: "Monday to Saturday, first 3 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 3 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "Your employer is the company that owns your IGA store, not IGA or Metcash. These are the General Retail Industry Award minimums; some store owners pay more.",
    "Some IGA owners have their own enterprise agreement (for example Lloyds IGA and Champions IGA). If yours does, it sets your pay instead — but it cannot pay a base rate below these award rates (Fair Work Act s 206). Your payslip must name the award or agreement you are paid under.",
  ],
  unverified: [
    "Whether your particular IGA store's owner has its own enterprise agreement — agreements are registered under the owner's company name, which we cannot search store by store.",
    "Rates under the Lloyds IGA and Champions IGA agreements — not transcribed here.",
    "Liquor, pharmacy and some bakery counters inside IGA stores can fall under other classifications or awards.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "General Retail Industry Award 2020 (MA000004), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "Lloyds IGA and SDA Enterprise Agreement 2023 (AE520134)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/agreements/fwa/ae520134.pdf" },
    { title: "Champions IGA Supermarket Enterprise Agreement 2023 (AE522127)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/agreements/fwa/ae522127.pdf" },
    { title: "Our businesses — Food (IGA as a network of independently owned stores)", publisher: "Metcash", url: "https://www.metcash.com/our-businesses/food/" },
  ],
  faqs: [
    {
      q: "How much does IGA pay an hour in 2026?",
      a: "Unless your store's owner has its own agreement, an adult IGA employee at Retail Level 1 must be paid at least $27.81 an hour, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Higher levels go up to $33.99.",
    },
    {
      q: "Does IGA have an enterprise agreement?",
      a: "There is no single IGA agreement. Each IGA supermarket is owned and run independently, so most IGA staff are paid under the General Retail Industry Award. A few owners, such as Lloyds IGA and Champions IGA, have their own agreements, which cannot pay a base rate below the award.",
    },
    {
      q: "How much does IGA pay a 15 or 16 year old?",
      a: "Under the Retail Award, staff under 16 get 45% of the Level 1 rate ($12.51 an hour, or $15.64 as a casual) and 16-year-olds get 50% ($13.91, casual $17.39). At 17 it is 60% ($16.69). These are our arithmetic from the award percentages.",
    },
    {
      q: "What does IGA pay on Sundays and public holidays?",
      a: "Under the Retail Award, permanent staff get 150% on Sundays ($41.72 an hour at Level 1) and 225% on public holidays ($62.57). Casuals get 175% ($48.67) and 250% ($69.53), which already include the casual loading.",
    },
    {
      q: "How do I know if my IGA store has its own agreement?",
      a: "Your payslip must name the award or agreement you are paid under. You can also search the Fair Work Commission's agreement database for your employer's legal company name rather than the IGA brand. If there is no agreement, the Retail Award applies.",
    },
  ],
};
