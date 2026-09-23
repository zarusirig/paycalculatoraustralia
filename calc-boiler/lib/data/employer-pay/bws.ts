// BWS — in-store team members at BWS (Endeavour Group). dan-murphys.ts reuses
// this file: one agreement covers both banners.
//
// Instrument: Endeavour Group Retail Agreement 2025, AG2025/2853, AE531119,
// approved [2025] FWCA 3828 (Saunders DP, 14 November 2025; corrected
// 17 November 2025, PR793787, substituting the undertakings), operative
// 21 November 2025, nominal expiry 30 June 2029. Replaced the BWS Agreement
// 2019 and the Dan Murphy's Agreement 2019. Read from the FWC PDF (decision,
// correction, undertakings and agreement) on 24 September 2026.
//
// ⚠️ THE 2026 DOLLARS ARE THE AGREEMENT'S FORMULA, NOT A PRINTED TABLE.
// cl 4.1.1 prints the rates from the first full pay period after commencement
// (Team Member $27.26, Senior Team Member $28.48, Duty Manager $30.07 — Dan
// Murphy's only). The HOURLY rate prevails (cl 4.1.2). cl 4.2.1 lifts them
// "in accordance with the percentage increase for the General Retail Industry
// Award 2020" from the first full pay period on or after 1 July each year —
// 4.75% in 2026: $27.26 x 1.0475 = $28.55. The SDA's pre-ballot summary shows
// $27.26 / $34.08 casual, matching the printed table. Casual = x 1.25 (cl 4.1.3).
//
// No junior rates: adult rates for all ages (the rate table has no age
// percentages; SDA's F18 in decision [62]). Undertakings 5–7 preserve higher
// ex-2019 Level 2 rates for some staff; undertaking 1 sets the BWS in-charge
// allowance at $5.20 a shift.
//
// Award check (MA000004 from 1 July 2026), using the comparisons the FWC made
// at approval (decision [29]): Team Member vs Levels 1–2 ($28.55 > $28.45),
// Senior Team Member vs Levels 3–4 ($29.83 > $29.45), Duty Manager vs Level 6
// ($31.50 > $31.11).

import type { EmployerPay, RateRow } from "./types";

export const ENDEAVOUR_EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae531119.pdf";

/** cl 4.1.1 printed rates (from the first full pay period after commencement). */
export const ENDEAVOUR_PRINTED_2025 = {
  teamMember: 27.26,
  seniorTeamMember: 28.48,
  dutyManager: 30.07,
} as const;

export const ENDEAVOUR_TEAM_MEMBER: RateRow = {
  level: "Team Member",
  description: "Selling and processing payments, receiving and shelf filling, merchandising, deliveries, forklift use, till counting and administrative support (Appendix A)",
  hourly: 28.55,
  casualHourly: 35.69,
};

export const ENDEAVOUR_SENIOR_TEAM_MEMBER: RateRow = {
  level: "Senior Team Member",
  description: "Works above Team Member level — for example supervisory help to the Store Manager, opening and closing, or advanced product qualifications such as WSET (Appendix A)",
  hourly: 29.83,
  casualHourly: 37.29,
};

export const BWS_PAY: EmployerPay = {
  slug: "bws",
  name: "BWS",
  employerEntity: "Endeavour Group Limited, trading as BWS",
  industry: "liquor store",
  instrument: {
    kind: "enterprise-agreement",
    title: "Endeavour Group Retail Agreement 2025",
    reference: "AG2025/2853, AE531119",
    url: ENDEAVOUR_EA_URL,
    approvedOn: "14 November 2025 ([2025] FWCA 3828), operating from 21 November 2025",
    nominalExpiry: "30 June 2029",
    coverage:
      "It covers team members in Endeavour Group's stores — BWS and Dan Murphy's (including The Cellar, W for Wine and Swanbourne Cellars) — and its Customer Hub. Salaried positions, the support office, hotels (ALH) and distribution centres are not covered.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 July 2027",
    detail:
      "Every rate rises by the percentage the 2027 Annual Wage Review gives the General Retail Industry Award (cl 4.2.1). The agreement does not print the dollar figure.",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [ENDEAVOUR_TEAM_MEMBER, ENDEAVOUR_SENIOR_TEAM_MEMBER],
  juniorScale: [],
  juniorNote:
    "The Endeavour Group agreement pays adult rates to every team member regardless of age — there are no junior percentages.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "Base rate", casual: "Base + 25%" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "Base + 25%", casual: "Base + 50%" },
    { when: "Saturday, 7am to 11pm", permanent: "Base + 25%", casual: "Base + 50%" },
    { when: "Monday to Saturday, 11pm to 7am", permanent: "Base + 50% for the first 3 hours, then + 100%", casual: "Base + 75%, then + 125%" },
    { when: "Sunday, 9am to 11pm", permanent: "Base + 50%", casual: "Base + 75%" },
    { when: "Sunday, before 9am and after 11pm", permanent: "Base + 100%", casual: "Base + 125%" },
    { when: "Public holiday", permanent: "Base + 125%", casual: "Base + 150%" },
  ],
  penaltyNotes: [
    "Casual rates include the 25% loading (cl 6.3); penalties replace each other rather than stacking, and are not used to work out overtime or public holiday pay.",
    "For an adult Team Member that is about $35.69 an hour on a weekday evening or Saturday ($42.83 casual), $42.83 on a Sunday ($49.96 casual) and $64.24 on a public holiday ($71.38 casual) — our arithmetic on the formula rate.",
    "If the Retail Award's Sunday penalty rates go up, the agreement's Sunday rates go up to match (cl 6.4). Christmas Day worked when it is not a public holiday is paid 200% (casual 225%).",
    "Staff engaged specifically as shiftworkers (shifts starting from 6pm to before 5am) get + 30% Sunday night to Friday, + 50% Saturday and + 75% Sunday (casual + 55%, + 75%, + 100%).",
  ],
  overtime: [
    { when: "Monday to Saturday, first 3 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 3 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "The agreement prints its starting rates ($27.26 an hour for a Team Member) and lifts them each July by the Retail Award's Annual Wage Review percentage — 4.75% in 2026. The 2026 figures here are our calculation from that rule, rounded to the cent; your payslip may differ by a cent.",
    "When it approved the agreement, the Fair Work Commission compared Team Member with Retail Award Levels 1 and 2 and Senior Team Member with Levels 3 and 4. In 2026 both stay above those award rates ($28.45 and $29.45).",
    "Some staff who were paid the higher Level 2 rate under the old BWS or Dan Murphy's 2019 agreements keep it (undertakings 5–7): about $29.21 (ex-BWS) or $28.81 (ex-Dan Murphy's) an hour in 2026, by the same formula. BWS Team Members put in charge of a store get an in-charge allowance ($5.20 a shift when the agreement was made, rising with the award each July — undertaking 1 and cl 5.2).",
  ],
  unverified: [
    "Endeavour Group's own 2026 pay table — not public, so the 2026 dollars are calculated from the agreement's formula.",
    "Which Retail Award level each Endeavour role equates to — the agreement does not map them.",
    "Whether the overtime meal allowance ($23.59 when the agreement was made) has been indexed since.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Endeavour Group Retail Agreement 2025 (AE531119), with decision [2025] FWCA 3828 and undertakings", publisher: "Fair Work Commission", url: ENDEAVOUR_EA_URL },
    { title: "Endeavour Group Agreement 2025", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/your-rights/agreements/dan-murphys-agreement/endeavour-group-agreement-2025/" },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
  ],
  faqs: [
    {
      q: "How much does BWS pay an hour in 2026?",
      a: "A BWS Team Member is paid about $28.55 an hour, or $35.69 as a casual, from the first full pay period on or after 1 July 2026. A Senior Team Member gets about $29.83. These apply the 2026 Annual Wage Review increase of 4.75% to the rates printed in the Endeavour Group Retail Agreement 2025.",
    },
    {
      q: "What agreement covers BWS staff?",
      a: "The Endeavour Group Retail Agreement 2025 (AE531119), approved by the Fair Work Commission on 14 November 2025 and operating from 21 November 2025. It covers BWS and Dan Murphy's, replaced their separate 2019 agreements and runs to a nominal expiry of 30 June 2029.",
    },
    {
      q: "Does BWS pay junior rates?",
      a: "No. The Endeavour Group agreement pays the adult rate to every team member regardless of age.",
    },
    {
      q: "What does BWS pay on Sundays and public holidays?",
      a: "Between 9am and 11pm on a Sunday, permanent staff get base + 50% and casuals base + 75% (about $42.83 and $49.96 an hour for a Team Member). Public holidays pay base + 125%, or base + 150% for casuals.",
    },
    {
      q: "When is the next BWS pay rise?",
      a: "From the first full pay period on or after 1 July 2027, by the same percentage the Fair Work Commission's 2027 Annual Wage Review gives the General Retail Industry Award.",
    },
  ],
};
