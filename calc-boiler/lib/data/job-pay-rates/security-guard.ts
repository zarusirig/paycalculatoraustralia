// Security guard — Security Services Industry Award 2020 [MA000016].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000016.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799297 and
// PR799454)". Read 23 September 2026.
//   - Weekly and hourly: cl 15.1, Table 4 (varied by PR799297 ppc 01Jul26),
//     READ FROM lib/constants/modern-awards.ts (SECURITY_AWARD), shared with
//     /security-award-rates/. Independently re-read 23 September 2026.
//   - Casual: hourly + 25%, which matches Schedule B.3's "Day" column; the
//     award's own worked example confirms Level 1 casual = $35.53.
//   - Penalties: cl 20.2, Table 7. Overtime: cl 19.3, Table 5.
//   - Classifications: Schedule A (A.1–A.5).

import { SECURITY_AWARD } from "../../constants/modern-awards";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  rowFromModernAward,
} from "./common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "4422",
  anzscoTitle: "Security Officers and Guards",
  medianWeekly: 1_818,
  medianHourly: 42,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4422-security-officers-and-guards"),
};

export const SECURITY_GUARD: Occupation = {
  slug: "security-guard",
  name: "Security Guard",
  plural: "security guards",
  award: {
    name: "Security Services Industry Award 2020",
    code: "MA000016",
    url: awardTextUrl("MA000016"),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: "/security-award-rates/",
  },
  headline: {
    tableId: "security-officers",
    label: "Security Officer Level 1",
    why: "an entry-level security guard",
  },
  coverage: [
    "Security guards employed by security companies are covered by the Security Services Industry Award 2020 [MA000016]. The award has five Security Officer levels based on skills and duties.",
    "Level 1 covers watching and guarding premises, basic crowd control at venues and events, controlling entry and exit, and responding to basic alarms at your post. Level 2 adds work from complex instructions, first response to incidents, mobile patrols of two or more sites, monitoring alarm and access-control systems, x-ray and walk-through screening, dog handling and frisk searches.",
    "Levels 3 to 5 cover progressively more senior, technical and supervisory work, as defined in Schedule A of the award.",
  ],
  tables: [
    {
      id: "security-officers",
      title: "Security guard pay rates by level, 2026–27",
      intro: "Clause 15.1, Table 4 of the award. Casual day rates are from the award's Schedule B.3.",
      rows: [
        rowFromModernAward(SECURITY_AWARD, "Security Officer Level 1", undefined, "Guarding, basic crowd control, access control"),
        rowFromModernAward(SECURITY_AWARD, "Security Officer Level 2", undefined, "Mobile patrol, screening, alarm monitoring, dog handling"),
        rowFromModernAward(SECURITY_AWARD, "Security Officer Level 3"),
        rowFromModernAward(SECURITY_AWARD, "Security Officer Level 4"),
        rowFromModernAward(SECURITY_AWARD, "Security Officer Level 5"),
      ],
    },
  ],
  penalties: [
    { when: "Monday–Friday, 6 am to 6 pm", permanent: "100%", casual: "125%" },
    { when: "Monday–Friday, midnight–6 am and 6 pm–midnight", permanent: "121.7%", casual: "146.7%" },
    { when: "Permanent night work", permanent: "130%", casual: "155%" },
    { when: "Saturday", permanent: "150%", casual: "175%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (cl 20.2, Table 7). Casual percentages include the 25% casual loading. Permanent night work means more than two-thirds of your shifts in a roster cycle include midnight to 6 am (cl 20.3).",
  overtime: [
    "Monday to Saturday: 150% for the first 2 hours, then 200% (cl 19.3, Table 5).",
    "Sunday: 200%. Public holiday: 250%.",
    "Overtime on each day stands alone from overtime worked on any other day.",
  ],
  allowances: [
    { name: "First aid allowance", amount: "$7.68 per shift (max $38.19 a week)", note: "If you hold a current Senior First Aid (Provide First Aid) certificate and the employer asks or nominates you to act as a first aider (cl 17.2)." },
    { name: "Firearm allowance", amount: "$3.84 per shift (max $19.21 a week)", note: "If you are required to carry a firearm (cl 17.3)." },
    { name: "Broken shift allowance", amount: "$18.30 per rostered shift", note: "For a rostered broken shift (cl 17.4)." },
  ],
  median: MEDIAN,
  notices: [
    "You also need a state or territory security licence for most of this work. Licensing is separate from the award and does not change your minimum rate.",
  ],
  notShown: [
    "Detailed Level 3 to 5 duty definitions — read Schedule A of the award for those.",
    "Cash-in-transit and armoured vehicle allowances.",
    "Junior and trainee rates.",
  ],
  faqs: [
    {
      q: "What is the award rate for a security guard in 2026?",
      a: "An entry-level security guard (Security Officer Level 1) must be paid at least $28.42 an hour, or $1,080.10 a week, under the Security Services Industry Award from the first full pay period on or after 1 July 2026. That is $56,165 a year before tax.",
    },
    {
      q: "What is the casual rate for a security guard?",
      a: "A casual Level 1 security guard earns at least $35.53 an hour for weekday day work. Casual night work (before 6 am or after 6 pm, Monday to Friday) is 146.7%, Saturday 175%, Sunday 225% and public holidays 275% of the minimum hourly rate.",
    },
    {
      q: "Do security guards get night shift penalty rates?",
      a: "Yes. Hours between midnight and 6 am or 6 pm and midnight, Monday to Friday, are paid at 121.7% for permanent staff, or 130% if you are on permanent night work.",
    },
    {
      q: "What level is a crowd controller?",
      a: "Basic crowd control at shopping centres, events, nightclubs and venues is listed at Level 1. Crowd control is also listed among Level 2 tasks, so the level depends on the wider skills and duties the role involves.",
    },
    {
      q: "What do security guards actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,818 a week for security officers and guards (ABS Survey of Employee Earnings and Hours, May 2025). That group includes crowd controllers, alarm monitors and armoured car escorts as well as guards.",
    },
  ],
  sources: [
    { title: "Security Services Industry Award 2020 [MA000016] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000016") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/security-award-rates/", label: "Security Award Pay Rates" },
    { href: "/overtime-penalty-rates-guide/", label: "Overtime & Penalty Rates Guide" },
    { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
  ],
};
