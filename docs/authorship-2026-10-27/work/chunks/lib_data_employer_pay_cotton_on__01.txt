// Cotton On: store staff in Cotton On Group's Australian stores (Cotton On,
// Cotton On Body, Cotton On Kids, Factorie, Typo, Rubi and Supré).
//
// Instrument: General Retail Industry Award 2020 (MA000004). Rates, junior
// percentages, penalties and overtime are imported from iga.ts (cl 17.1
// Table 4 from 1 July 2026). Junior DOLLARS are the Fair Work Ombudsman's own,
// from the Retail Award pay guide published 24 June 2026 (read 22 October
// 2026), so this page shows published figures where IGA derives them.
//
// Coverage evidence (researched 22 October 2026):
//   - The only Cotton On agreement on the FWC register is the Cotton On Group
//     and United Workers Union Enterprise Agreement 2025 - 2028 (AG2025/4071,
//     AE531676, Yilmaz C, 23 Dec 2025, operating 5 Jan 2026, nominal expiry
//     30 June 2028). cl 3 covers COG Regional Team Pty Ltd Team Members "who
//     perform work at any Distribution Centre (DC) facilities"; the decision
//     lists the industry as "Storage services". It does not reach stores.
//   - No agreement with "Cotton On" in its title covers retail staff.
//   - Limits: a store agreement registered under another group company name
//     would not show in a title search; stated on the page.

import type { EmployerPay } from "./types";
import { IGA_PAY } from "./iga";

const PAY_GUIDE_URL = "https://calculate.fairwork.gov.au/ArticleDocuments/872/general-retail-industry-award-ma000004-pay-guide.pdf.aspx";
const DC_AGREEMENT_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae531676.pdf";

export const COTTON_ON_PAY: EmployerPay = {
  ...IGA_PAY,
  slug: "cotton-on",
  name: "Cotton On",
  employerEntity:
    "The Cotton On Group company that runs your store. Cotton On Group is a private company based in Geelong that owns the Cotton On, Cotton On Body, Cotton On Kids, Factorie, Typo, Rubi and Supré brands.",
  industry: "clothing and stationery retail",
  instrument: {
    ...IGA_PAY.instrument,
    coverage:
      "We found no enterprise agreement for Cotton On Group store staff. The group's only agreement on the Fair Work Commission's register, the Cotton On Group and United Workers Union Enterprise Agreement 2025 - 2028, covers team members at its distribution centres. Store staff across the group's brands are therefore paid under the General Retail Industry Award, unless a store agreement exists under another company name.",
  },
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026 (juniors aged 18 and 19)",
    detail:
      "Staff aged 18 or 19 at Levels 1 to 3 who have been with their employer for more than 6 months step up under determination PR813655. An 18-year-old moves from 70% to 75% of the adult rate ($20.86 an hour at Level 1), and a 19-year-old from 80% to 85% ($23.64). The Fair Work Ombudsman will reissue its pay guide with the new junior dollars. Adult rates next change with the 2027 Annual Wage Review.",
  },
  verifiedOn: "22 October 2026",
  rates: IGA_PAY.rates.map((r, i) =>
    i === 0
      ? { ...r, description: "Sales assistant or team member: serving customers, fitting rooms, point of sale, stock replenishment and store presentation. Cotton On does not publish which award level each role sits at" }
      : r,
  ),
  juniorNote:
    "The Retail Award's junior percentages (cl 17.2) apply at Levels 1 to 3, where store staff sit. The dollars below are the Fair Work Ombudsman's own, from its Retail Award pay guide published 24 June 2026, for Level 1. A 20-year-old moves to the full adult rate after 6 months with the same employer.",
  publishedJuniorRates: [
    { age: "Under 16", hourly: 12.51, casualHourly: 15.64 },
    { age: "16", hourly: 13.91, casualHourly: 17.39 },
    { age: "17", hourly: 16.69, casualHourly: 20.86 },
    { age: "18", hourly: 19.47, casualHourly: 24.34 },
    { age: "19", hourly: 22.25, casualHourly: 27.81 },
    { age: "20 (6 months' service or less)", hourly: 25.03, casualHourly: 31.29 },
    { age: "20 (more than 6 months' service)", hourly: 27.81, casualHourly: 34.76 },
    { age: "21 and over", hourly: 27.81, casualHourly: 34.76 },
  ],
  penaltyNotes: [
    "Percentages are of the minimum hourly rate for your level (award cl 22.1, Table 12, employees who are not shiftworkers). The casual loading is added, not multiplied: a casual on a Sunday gets 175%, not 187.5%.",
    "The Fair Work Ombudsman's pay guide prints the dollars. For an adult Level 1 sales assistant they are $34.76 an hour on weekday evenings after 6pm and on Saturdays ($41.72 casual). Sundays pay $41.72 ($48.67 casual) and public holidays $62.57 ($69.53 casual).",
    "The pay guide also prints overtime. For a Level 1 adult it is $41.72 an hour for the first 3 hours Monday to Saturday and $55.62 after that or on a Sunday ($48.67 and $62.57 casual). A public holiday pays $69.53 ($76.48 casual).",
  ],
  notices: [
    "These are the General Retail Industry Award minimums for store staff. Cotton On Group can pay above them, but we found no store agreement that sets a different floor.",
    "Cotton On Group does have one enterprise agreement, approved on 23 December 2025. It covers team members at its distribution centres only (COG Regional Team Pty Ltd, with the United Workers Union). If you work in a store it does not apply to you, and your payslip must name the award or agreement you are paid under.",
    "Cotton On Group's other store brands, including Cotton On Body, Cotton On Kids, Factorie, Typo, Rubi and Supré, are covered by the same award, so these rates are the floor there too.",
  ],
  unverified: [
    "Which award level Cotton On classifies each store role at; team member, senior team member and keyholder roles could sit at Levels 1 to 3.",
    "Whether any Cotton On Group company has a store agreement registered under a name without \"Cotton On\" in it; our search was by title.",
    "Rates under the group's distribution centre agreement (AE531676), not transcribed here.",
    "Store manager and assistant manager pay, which Cotton On does not publish.",
  ],
  sources: [
    { title: "Pay Guide: General Retail Industry Award [MA000004], published 24 June 2026 (rates from the first full pay period on or after 1 July 2026)", publisher: "Fair Work Ombudsman", url: PAY_GUIDE_URL },
    { title: "General Retail Industry Award 2020 (MA000004), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: IGA_PAY.instrument.url },
    { title: "Cotton On Group and United Workers Union Enterprise Agreement 2025 - 2028 (AE531676), distribution centres only", publisher: "Fair Work Commission", url: DC_AGREEMENT_URL },
    { title: "Junior rates determination PR813655 (Retail Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813655.pdf" },
  ],
  faqs: [
    {
      q: "How much does Cotton On pay an hour in 2026?",
      a: "Cotton On store staff are paid under the General Retail Industry Award. An adult at Retail Level 1 must get at least $27.81 an hour, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. A full-time week at that rate is $1,056.80, and the award's higher levels run up to $33.99 an hour.",
    },
    {
      q: "Does Cotton On have an enterprise agreement?",
      a: "Not for its stores. The Fair Work Commission approved the Cotton On Group and United Workers Union Enterprise Agreement 2025 - 2028 on 23 December 2025. It covers team members at the group's distribution centres only, so store staff stay on the Retail Award.",
    },
    {
      q: "How much does Cotton On pay a 15 year old?",
      a: "The Fair Work Ombudsman's pay guide puts a Level 1 retail employee under 16 at $12.51 an hour, or $15.64 as a casual: 45% of the adult rate. A 16-year-old gets $13.91 ($17.39 casual) and a 17-year-old $16.69 ($20.86 casual). The full adult rate applies from 21, or from 20 after 6 months with the same employer.",
    },
    {
      q: "Is pay the same at Typo, Factorie and Supré?",
      a: "Yes, as a minimum. They are Cotton On Group retail stores in Australia, so the General Retail Industry Award sets the floor for all of them. That is $27.81 an hour for an adult at Level 1, with the same junior percentages. Anything extra a brand pays is on top of that.",
    },
    {
      q: "What does Cotton On pay on a Sunday?",
      a: "A permanent Level 1 employee gets 150% on a Sunday, which the pay guide prints as $41.72 an hour; a casual gets 175%, or $48.67. Weekday evenings after 6pm and Saturdays pay $34.76 ($41.72 casual), and public holidays $62.57 ($69.53 casual).",
    },
  ],
};
