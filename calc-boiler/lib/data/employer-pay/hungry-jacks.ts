// Hungry Jack's — crew, crew coaches, shift supervisors and managers in Hungry
// Jack's Pty Ltd restaurants and at the 13 franchisee companies listed in
// Schedule A of the agreement.
//
// Instrument: Hungry Jack's National Enterprise Agreement 2024, AG2025/3915,
// AE531466, approved [2025] FWCA 4208 (Dean DP, 10 December 2025; corrected
// 11 December 2025): operates from the first pay period 3 months after
// 10 December 2025, nominal expiry 9 December 2029. Schedule B was then
// replaced by an s 218A variation, AG2026/295 (Wright DP, 20 March 2026),
// operating from 10 December 2025. Read in full from the FWC PDF (which
// bundles both decisions and the agreement) on 24 September 2026.
//
// ⚠️ THE 2026 DOLLARS ARE THE AGREEMENT'S FORMULA, NOT A PRINTED TABLE.
// Schedule B (as varied) prints 2025 dollars next to each formula, all
// expressed against the Fast Food Industry Award (FFIA) hourly rate:
//
//   Permanent ordinary hours:  FFIA rate x 100.75%   (Crew Coach, managers)
//   Crew Member – Team Lead:   (FFIA Level 1 + 10c) x 100.75%
//   Shift Supervisor:          FFIA Level 3(a) rate, no additional loading
//   Casual ordinary hours:     FFIA rate x 125.25%  (Shift Supervisor x 125%)
//
// cl 21.1 makes Schedule B the rate the employer must pay; cl 21.2 moves it
// with the annual wage increase to the award. From the first full pay period
// on or after 1 July 2026 the FFIA Level 1 rate is $27.81, so Crew Member is
// $27.81 x 1.0075 = $28.02 and casual $27.81 x 1.2525 = $34.83. The printed
// 2025 column reproduces exactly from the 2025 award rates ($26.55 x 1.0075 =
// $26.75; x 1.2525 = $33.25) — the tests check both years.
//
// ⚠️ THE CASUAL AMBIGUITY (why this page was held back in round 3). cl 15.2
// says a casual gets "the ordinary hourly rate paid to a full-time employee and
// an additional 25%" — read literally, $28.02 x 1.25 = $35.03 — while
// Schedule B pays the award rate x 125.25% ($34.83). Resolved for publication
// by the FWC's own later decision: in AG2026/295 the employer submitted that
// Schedule B reflects "the calculation of rates provided for in the
// Agreement's terms", the SDA and AWU consented, and the Commission re-made
// Schedule B with the casual column still at 125.25% (correcting only other
// cells). The SDA's pre-ballot summary describes the same deal: permanent
// +0.75% on non-penalty time and +0.25% on penalty time, casual +0.25%. We
// publish Schedule B and tell casuals about cl 15.2.
//
// Juniors (cl 22.1): % of the Schedule B rate for the classification —
// 40/50/60/70/80/95/100 (20-year-olds get 95%, above the award's 90%).
// cl 22.2: if the award's junior percentage rises above the agreement's, the
// higher % applies from the first full pay period after the award is amended.
// Award phase-in from 1 Dec 2026 (PR813654): 18 → 75%, 19 → 85% for 18–20 year
// olds with more than 6 months' service; 20 stays at 95% (equal).

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae531466.pdf";

export const HUNGRY_JACKS_PAY: EmployerPay = {
  slug: "hungry-jacks",
  name: "Hungry Jack's",
  employerEntity:
    "Hungry Jack's Pty Ltd, and the 13 franchisee companies named in Schedule A of the agreement",
  industry: "fast food",
  instrument: {
    kind: "enterprise-agreement",
    title: "Hungry Jack's National Enterprise Agreement 2024",
    reference: "AG2025/3915, AE531466",
    url: EA_URL,
    approvedOn:
      "10 December 2025 ([2025] FWCA 4208), operating from the first pay period 3 months later; Schedule B of wage rates replaced by variation AG2026/295 on 20 March 2026",
    nominalExpiry: "9 December 2029",
    coverage:
      "It covers crew, crew coaches, shift supervisors and managers in restaurants run by Hungry Jack's Pty Ltd and by the 13 franchisee companies listed in its Schedule A. Staff of any other franchisee are paid under the Fast Food Industry Award unless their employer has its own agreement.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period after 1 December 2026 (juniors aged 18 and 19)",
    detail:
      "The agreement lifts its junior percentages whenever the Fast Food Award's go higher (cl 22.2). The award's phase-in from 1 December 2026 takes 18-year-olds with more than 6 months' service to 75% (the agreement says 70%) and 19-year-olds to 85% (the agreement says 80%). 20-year-olds already get 95%. Adult rates next move with the 2027 Annual Wage Review (cl 21.2).",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  casualRateNote:
    "How the casual rate is worked out: Schedule B pays casuals the Fast Food Award rate for their level × 125.25% (the award's 25% casual loading plus 0.25%), while permanent staff get the award rate × 100.75%. So a casual is paid 25% more than the award rate, not 25% more than the Hungry Jack's permanent rate. Clause 15.2 of the agreement is worded as 25% on top of the full-time rate, which would give a Crew Member $35.03 rather than $34.83; the Fair Work Commission re-made Schedule B with the 125.25% figure in March 2026, with both unions' consent, so the table uses it. If you think clause 15.2 entitles you to more, raise it with your SDA organiser or the Fair Work Ombudsman.",
  juniorCasualFromAdultCasual: true,
  rates: [
    { level: "Crew Member", description: "Taking orders, cooking, serving and delivering food, including cleaning (award Level 1 × 100.75%)", hourly: 28.02, casualHourly: 34.83 },
    { level: "Crew Member – Team Lead", description: "Champions a production area such as the burger station or drive-thru, without supervising others (award Level 1 + 10c, × 100.75%)", hourly: 28.12, casualHourly: 34.96 },
    { level: "Crew Coach", description: "Trains and cross-trains crew, or is completing shift supervisor training (award Level 2 × 100.75%)", hourly: 29.67, casualHourly: 36.89 },
    { level: "Shift Supervisor", description: "Supervises crew day to day or trains new employees (paid the award Level 3(a) rate)", hourly: 29.91, casualHourly: 37.39 },
    { level: "Assistant Manager", description: "Supervises crew and has one restaurant portfolio (award Level 3(b) × 100.75%)", hourly: 30.5, casualHourly: 37.91 },
    { level: "Restaurant Manager", description: "Appointed to be in charge of a restaurant (award Level 3(b) × 100.75%)", hourly: 30.5, casualHourly: 37.91 },
  ],
  juniorScale: [
    { age: "15 and under", percentage: 0.4 },
    { age: "16", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20", percentage: 0.95 },
    { age: "21 and over", percentage: 1 },
  ],
  juniorNote:
    "The percentages are clause 22.1 of the agreement, applied to the Schedule B rate for your level (casual juniors: to the casual rate). Hungry Jack's pays 20-year-olds 95% of the adult rate, more than the Fast Food Award's 90%. The table shows Crew Member rates.",
  penalties: [
    { when: "Monday to Friday, 6am to 10pm", permanent: "100.75% of award rate ($28.02)", casual: "125.25% ($34.83)", note: "Shift Supervisors: 100% and 125% of award Level 3(a)" },
    { when: "Monday to Friday, 10pm to midnight", permanent: "110.25% ($30.66)", casual: "135.25% ($37.61)" },
    { when: "Monday to Friday, midnight to 6am", permanent: "115.25% ($32.05)", casual: "140.25% ($39.00)" },
    { when: "Saturday", permanent: "125.25% ($34.83)", casual: "150.25% ($41.78)" },
    { when: "Sunday — Crew Member and Team Lead", permanent: "125.25% ($34.83)", casual: "150.25% ($41.78)" },
    { when: "Sunday — Crew Coach, Assistant and Restaurant Manager", permanent: "150.25%", casual: "175.25%", note: "Shift Supervisors: 150% and 175% of award Level 3(a)" },
    { when: "Public holiday", permanent: "225.25% ($62.64)", casual: "250.25% ($69.59)", note: "Shift Supervisors: 225% and 250%" },
  ],
  penaltyNotes: [
    "Every percentage is of the Fast Food Award hourly rate for the award level your classification maps to (Schedule B, as varied on 20 March 2026) — not of the Hungry Jack's rate. Dollar figures in brackets are for an adult Crew Member from 1 July 2026 (award Level 1, $27.81), our arithmetic rounded to the cent.",
    "Casual figures already include the casual loading: the 25% is added to the penalty, not multiplied by it.",
    "There is no evening penalty before 10pm on weekdays, the same as the Fast Food Award.",
  ],
  overtime: [
    { when: "Monday to Saturday, first 2 hours", permanent: "150% ($41.72)", casual: "175% ($48.67)" },
    { when: "Monday to Saturday after 2 hours, and Sunday", permanent: "200% ($55.62)", casual: "225% ($62.57)" },
    { when: "Public holiday", permanent: "250%", casual: "275%", note: "cl 29.1" },
  ],
  notices: [
    "The 2026 dollar rates are calculated from the agreement's formula (the Fast Food Award rate for each level plus a set percentage), because the agreement prints only the 2025 figures. Your payslip may differ by a cent.",
    "This agreement only covers restaurants run by Hungry Jack's Pty Ltd and the 13 franchisee companies named in it. If your restaurant's owner is not one of them, the Fast Food Industry Award applies instead — see McDonald's or Subway pay rates for those award figures.",
    "Casual rates follow Schedule B of the agreement. Clause 15.2 is worded differently and, read literally, would pay casuals slightly more — see the note under the rate table.",
  ],
  unverified: [
    "Salaried Assistant and Restaurant Manager pay — set individually above the agreement rates (cl 20.7), not published.",
    "Whether the award's 6-month service condition for the December 2026 junior phase-in carries over to the agreement under cl 22.2 — the clause does not say.",
    "Delivery driver rates beyond the allowances in cl 23.5 (52c/km for your own car) — drivers are paid at their crew classification.",
  ],
  awardHref: "/fast-food-award-rates/",
  awardLabel: "Fast Food Award rates 2026",
  sources: [
    { title: "Hungry Jack's National Enterprise Agreement 2024 (AE531466), with approval decision [2025] FWCA 4208 and variation AG2026/295", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Hungry Jack's National Enterprise Agreement 2024 — summary for franchise store workers", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/wp-content/uploads/ebas/2024/08/Hungry-Jacks-Summary-Doc-Franchise-Stores-NAT.pdf" },
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000003.html" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does Hungry Jack's pay an hour in 2026?",
      a: "An adult Crew Member is paid $28.02 an hour as a permanent employee or $34.83 as a casual, from the first full pay period on or after 1 July 2026. Crew Coaches get $29.67, Shift Supervisors $29.91 and Assistant or Restaurant Managers $30.50. Those are the agreement's formula applied to the 2026 Fast Food Award rates.",
    },
    {
      q: "How much does Hungry Jack's pay a 15 or 16 year old?",
      a: "A Crew Member aged 15 or under gets 40% of the adult rate: $11.21 an hour, or $13.93 as a casual. At 16 it is 50% ($14.01, casual $17.42) and at 17 it is 60% ($16.81, casual $20.90). The full adult rate applies from 21.",
    },
    {
      q: "Does Hungry Jack's pay more than the award?",
      a: "Slightly. The agreement pays permanent staff the Fast Food Award rate plus 0.75% for ordinary hours and plus 0.25 percentage points on penalty times, and casuals plus 0.25 points. The bigger difference is for 20-year-olds, who get 95% of the adult rate instead of the award's 90%.",
    },
    {
      q: "What does Hungry Jack's pay on Sundays and public holidays?",
      a: "A permanent Crew Member gets 125.25% of the award rate on Sundays ($34.83 an hour) and a casual 150.25% ($41.78). Crew Coaches and managers get 150.25% (casual 175.25%). Public holidays pay 225.25% ($62.64), or 250.25% ($69.59) for casuals.",
    },
    {
      q: "What is the Hungry Jack's enterprise agreement?",
      a: "The Hungry Jack's National Enterprise Agreement 2024 (AE531466), approved by the Fair Work Commission on 10 December 2025. It started in March 2026, replaces the 2019 agreement and has a nominal expiry date of 9 December 2029. Its pay rates are tied to the Fast Food Industry Award, so they rise with each Annual Wage Review.",
    },
  ],
};
