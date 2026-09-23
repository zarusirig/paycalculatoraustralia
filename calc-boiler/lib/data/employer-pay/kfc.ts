// KFC — Team Members (including delivery drivers) and Shift Supervisors.
//
// Instrument: KFC National Enterprise Agreement 2020, AG2019/4042, AE507798
// (print PR718361), approved [2020] FWCA 2020 (Cross DP, 22 April 2020;
// reissued 8 July 2020 with Annexures A and B), operative 29 April 2020,
// nominal expiry 29 April 2024 per decision [131] (the FWC's 2020 agreement
// list gives 22 April 2024). PAST NOMINAL EXPIRY BUT STILL OPERATING: not on
// the FWC terminated-agreements list (generated 3 Sep 2026) and no newer KFC
// agreement on the approved lists 2021 – 21 Sep 2026.
//
// ⚠️ SOURCE CAVEAT. The FWC's PDF of the agreement (ae507798.pdf) returns "not
// found" under every URL variant tried in rounds 3 and 4. The rate FORMULA is
// taken from the FWC's own approval decision, which we read on 24 Sep 2026:
//   [72](g) "Full and part-time employees will receive an additional 0.25%
//           over the award rate from 1/2/20 and 0.5% over the award rate from
//           1/7/21."
//   [72](h) "Casual employees will receive an additional $0.01 per hour at the
//           adult level (plus the additional 25% loading) over the award rate"
//   [64]    the adult weekly rate is "rounded to the nearest 10 cents after this
//           addition" and "the rates under the Agreement will always be higher
//           than the Award".
// Clause numbers, penalties, junior percentages and Undertaking 3 ("pay all
// casual employees at least $0.01 per hour above the Award rate") come from a
// copy of the agreement text (Scribd), which matches the decision on every
// rate term checked.
//
// 2026 FORMULA (Fast Food Award from the first full pay period on or after
// 1 July 2026: Level 1 $1,056.80/wk, Level 2 $1,119.10/wk):
//   Team Member      1,056.80 x 1.005 = 1,062.084 → $1,062.10 → /38 = $27.95
//   Shift Supervisor 1,119.10 x 1.005 = 1,124.6955 → $1,124.70 → /38 = $29.60
//   Casual           (award hourly + $0.01) x 1.25 = $34.78 (L1), $36.83 (L2)
// cl 5.4.2 reads "weekly rate divided by 38 plus a 25% loading", which would
// give $34.94; the printed Feb 2020 casual figure ($26.7758) follows Table B's
// award-plus-1c method, so we publish Table B and disclose the other reading.
//
// Juniors (cl 6.1 Table A): 40/50/60/70/80/90%, adult at 21. Casual juniors
// get at least award + 1c (Undertaking 3), which lifts ages 16 and 18 by a cent.
// From 1 Dec 2026 the award phase-in (PR813654) overtakes KFC's 18–20 rates
// for staff with more than 6 months' service — s 206 floor applies.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/decisionssigned/pdf/2020fwca2020.pdf";
const EA_COPY_URL = "https://www.scribd.com/document/520115620/2020-KFC-National-Agreement";

export const KFC_PAY: EmployerPay = {
  slug: "kfc",
  name: "KFC",
  employerEntity:
    "Kentucky Fried Chicken Pty Limited, its subsidiaries, and the franchisees named in the agreement when it was approved",
  industry: "fast food",
  instrument: {
    kind: "enterprise-agreement",
    title: "KFC National Enterprise Agreement 2020",
    reference: "AG2019/4042, AE507798",
    url: EA_URL,
    approvedOn: "22 April 2020 ([2020] FWCA 2020), operating from 29 April 2020",
    nominalExpiry: "29 April 2024 (passed — the agreement keeps operating until replaced or terminated)",
    coverage:
      "It covers Team Members (including delivery drivers) and Shift Supervisors at KFC's company restaurants and at the franchisees named in the agreement when the Fair Work Commission approved it (77 employers). Managers are excluded. A franchisee that was not named, or that has its own agreement, is not covered — its staff are paid under that agreement or the Fast Food Industry Award.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026 (juniors aged 18 to 20)",
    detail:
      "The Fast Food Award's junior phase-in lifts 18-, 19- and 20-year-olds with more than 6 months' service to 75%, 85% and 95% of the award rate ($20.86, $23.64 and $26.42 an hour). That is more than KFC's fixed 70%, 80% and 90%, and an agreement cannot pay a base rate below the award, so those staff must get at least the award figure. Adult rates next move with the 2027 Annual Wage Review, because KFC's rates are tied to the award.",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  casualRateNote:
    "How the casual rate is worked out: the agreement's pay table (Table B) sets the casual rate at the Fast Food Award hourly rate plus 1 cent, plus the 25% loading — $34.78 for a Team Member — while permanent staff get the award weekly rate plus 0.5%. So the casual rate is not 25% on top of the $27.95 permanent rate. One clause (cl 5.4.2) could be read as 25% on top of the permanent rate ($34.94); the agreement's own printed 2020 casual figure follows the Table B method, so the table uses it.",
  rates: [
    { level: "Team Member (Level 1)", description: "Crew, including delivery drivers and school-based trainees (award Level 1 weekly rate + 0.5%)", weekly: 1062.1, hourly: 27.95, casualHourly: 34.78 },
    { level: "Shift Supervisor (Level 2)", description: "Supervises the shift (award Level 2 weekly rate + 0.5%)", weekly: 1124.7, hourly: 29.6, casualHourly: 36.83 },
  ],
  juniorScale: [
    { age: "15 and under", percentage: 0.4 },
    { age: "16", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20", percentage: 0.9 },
    { age: "21 and over", percentage: 1 },
  ],
  juniorNote:
    "KFC's junior percentages (cl 6.1 Table A) apply to both classifications; the table shows Team Member. Casual juniors are paid at least the award rate plus 1 cent (Undertaking 3), which lifts ages 16 and 18 by a cent over the straight percentage.",
  derivedJuniorRates: [
    { age: "15 and under", hourly: 11.18, casualHourly: 13.91 },
    { age: "16", hourly: 13.98, casualHourly: 17.4 },
    { age: "17", hourly: 16.77, casualHourly: 20.87 },
    { age: "18", hourly: 19.57, casualHourly: 24.35 },
    { age: "19", hourly: 22.36, casualHourly: 27.82 },
    { age: "20", hourly: 25.16, casualHourly: 31.3 },
    { age: "21 and over", hourly: 27.95, casualHourly: 34.78 },
  ],
  penalties: [
    { when: "Monday to Friday, 6am to 10pm", permanent: "Base rate", casual: "+ 25% (casual loading)" },
    { when: "Monday to Friday, 10pm to midnight", permanent: "+ 10%", casual: "+ 35%" },
    { when: "Monday to Friday, midnight to 6am", permanent: "+ 15%", casual: "+ 40%" },
    { when: "Saturday", permanent: "+ 25%", casual: "+ 50%" },
    { when: "Sunday — Team Members", permanent: "+ 25%", casual: "+ 50%" },
    { when: "Sunday — Shift Supervisors", permanent: "+ 50%", casual: "+ 75%" },
    { when: "Public holiday", permanent: "225%", casual: "250%" },
  ],
  penaltyNotes: [
    "Penalties are paid on the ordinary hourly rate for your level (cl 7.1); casual figures include the 25% loading, added rather than multiplied. They are the same percentages as the Fast Food Award.",
    "For a permanent Team Member ($27.95) that is $30.75 an hour from 10pm to midnight, $32.14 from midnight to 6am, $34.94 on a weekend and $62.89 on a public holiday — our arithmetic.",
  ],
  overtime: [
    { when: "First 2 hours", permanent: "150%", casual: "150% plus the casual loading" },
    { when: "After 2 hours", permanent: "200%", casual: "200% plus the casual loading" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "The KFC agreement's rates are tied to the Fast Food Award: permanent staff get the award weekly rate plus 0.5%, and casuals the award hourly rate plus 1 cent plus the 25% loading. The 2026 dollars here are our calculation from that formula, which the Fair Work Commission's approval decision sets out.",
    "The KFC agreement passed its nominal expiry date in April 2024. It keeps applying until it is replaced or terminated, and no replacement has been approved or lodged as at September 2026.",
    "Not every KFC restaurant is covered. The agreement covers KFC's own restaurants and the franchisees named when it was approved. If your restaurant's owner was not named — or has its own agreement — the Fast Food Award or that agreement applies instead. Your payslip must say which one you are paid under.",
    "The Fair Work Commission's copy of the agreement is not currently downloadable, so the clause details (junior percentages, penalties, casual undertaking) were read from a published copy of the agreement and checked against the Commission's approval decision.",
  ],
  unverified: [
    "The list of franchisees covered — KFC's own 2024 court defence says the Schedule A published on the Commission's website is blank, while the approval decision names 77 employers.",
    "Whether Collins Foods' KFC restaurants in Queensland and northern NSW, which had their own 2014 agreement, now fall under this agreement.",
    "Salaried and trainee manager pay — managers are excluded from the agreement.",
  ],
  awardHref: "/fast-food-award-rates/",
  awardLabel: "Fast Food Award rates 2026",
  sources: [
    { title: "Approval decision [2020] FWCA 2020 — KFC National Enterprise Agreement 2020 (AE507798), with undertakings", publisher: "Fair Work Commission", url: EA_URL },
    { title: "KFC National Enterprise Agreement 2020 (copy of the agreement text)", publisher: "Scribd", url: EA_COPY_URL },
    { title: "Your pay and conditions at KFC", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/your-rights/agreements/kfc-agreement/your-pay-and-conditions-at-kfc/" },
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000003.html" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does KFC pay an hour in 2026?",
      a: "Under the KFC National Enterprise Agreement 2020, an adult Team Member (including delivery drivers) gets $1,062.10 a week or $27.95 an hour as a permanent employee, and $34.78 an hour as a casual, from the first full pay period on or after 1 July 2026. A Shift Supervisor gets $29.60 an hour ($36.83 casual). These are calculated from the agreement's award-plus formula.",
    },
    {
      q: "How much does KFC pay a 15 or 16 year old?",
      a: "A Team Member aged 15 or under gets 40% of the adult rate: $11.18 an hour, or $13.91 as a casual. At 16 it is 50% ($13.98, casual $17.40) and at 17 it is 60% ($16.77, casual $20.87). The full adult rate applies from 21.",
    },
    {
      q: "Is the KFC enterprise agreement still in force?",
      a: "Yes. Its nominal expiry date was in April 2024, but an agreement keeps applying until it is replaced or terminated, and no replacement KFC agreement had been approved or lodged by September 2026. It only covers KFC's own restaurants and the franchisees named in it.",
    },
    {
      q: "What does KFC pay on weekends and public holidays?",
      a: "Team Members get base + 25% on Saturdays and Sundays ($34.94 an hour for a permanent adult) and casuals + 50%. Shift Supervisors get + 50% on Sundays (casual + 75%). Public holidays pay 225%, or 250% for casuals.",
    },
    {
      q: "Does KFC pay more than the award?",
      a: "Only slightly: permanent staff get the Fast Food Award rate plus 0.5% ($27.95 against $27.81 for an adult Team Member) and casuals the award rate plus 1 cent before the loading. From 1 December 2026 the award's higher rates for some 18 to 20 year olds will overtake KFC's junior rates, and those staff must be paid the award figure.",
    },
  ],
};
