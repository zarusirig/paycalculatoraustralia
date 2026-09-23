// BIG W — wages-paid store team members (Woolworths Group).
//
// Instrument: BIG W Stores Enterprise Agreement 2023, AG2023/5064, AE523762
// (print PR772144), approved [2024] FWCA 849 (Masson DP, 13 March 2024) with
// undertakings, operative 20 May 2024, nominal expiry 1 October 2027. Read
// from the SDA's copy (agreement + decision + undertakings) on 24 Sep 2026.
//
// ⚠️ THE 2026 DOLLARS ARE THE AGREEMENT'S FORMULA, NOT A PRINTED TABLE.
// cl 4.1.1 prints the July 2023 rates only; the WEEKLY rate prevails (cl 4.1.2).
// cl 4.2.1 lifts "All classifications" from the first full pay period on or
// after 1 July each year by the Annual Wage Review percentage "Plus 'Boosted
// Leave' pay increase" of 0.25% (2024), 0.5% (2025), 0.5% (2026), 0.75% (2027).
// Note under the table: "The amounts expressed in the table above do not
// compound." We read that as: the AWR % and the Boosted Leave % are ADDED, not
// multiplied, and each year's rise applies to the rate then in force:
//
//   2024: 3.75% + 0.25% = 4.00%    2025: 3.5% + 0.5% = 4.00%
//   2026: 4.75% + 0.5% = 5.25%     Level 1: 944.18 → 981.95 → 1,021.23 → 1,074.84
//   hourly = weekly / 38 = $28.29; casual = x 1.25 (cl 4.1.3) = $35.36
//
// A narrower reading — every rise applied to the 2023 base without carrying
// forward (x 1.1325) — gives $1,069.28 / $28.14. The page discloses it. We
// found no public 2025 or 2026 BIG W wage sheet to settle it (the SDA's is
// behind a member login).
//
// "BOOSTED LEAVE" (why this page was held back in round 3) — RESOLVED from the
// text. cl 12.1–12.6: permanent staff elect each May to take the above-AWR
// part of the rise as extra leave (3 days in 2026–27 for full-timers) or keep
// it as pay; not electing = electing leave (cl 12.6.3). The leave is credited
// up front and its value "offset against the team member's pay each week ...
// in equal weekly instalments" (cl 12.6.1). The BASE RATE is the same for
// everyone — the election does not create a second rate table — and penalty
// rates stay "base rate + X%". Casuals cannot elect (cl 12.1).
//
// Juniors (cl 4.3.1): Levels 1 and 2 under 20 only — 50/60/70/80%, adult at 20.
// Award check (MA000004, 1 July 2026): every adult level is above its award
// equivalent under either reading. From 1 Dec 2026 the Retail Award phase-in
// (PR813655) lifts 18- and 19-year-olds with >6 months' service to 75%/85% of
// the award rate ($20.86/$23.64), above BIG W's 70%/80% — s 206 then requires
// the award figure.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae523762.pdf";
const SDA_COPY_URL = "https://www.sda.au/wp-content/uploads/ebas/2024/08/EBA-Big-W-2023.pdf";

export const BIG_W_PAY: EmployerPay = {
  slug: "big-w",
  name: "Big W",
  employerEntity: "Woolworths Group Limited and Woolworths (South Australia) Pty Ltd, trading as BIG W",
  industry: "department store",
  instrument: {
    kind: "enterprise-agreement",
    title: "BIG W Stores Enterprise Agreement 2023",
    reference: "AG2023/5064, AE523762",
    url: EA_URL,
    approvedOn: "13 March 2024 ([2024] FWCA 849, with undertakings), operating from 20 May 2024",
    nominalExpiry: "1 October 2027",
    coverage:
      "It covers BIG W team members who work in BIG W stores. Salaried supervisors, department managers, night fill managers and store managers are excluded, and BIG W distribution centres have their own agreements.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 July 2027",
    detail:
      "Every level rises by the 2027 Annual Wage Review percentage plus a 0.75% Boosted Leave increase (cl 4.2.1) — the last rise before the agreement's nominal expiry on 1 October 2027.",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Store Team Member Level 1", description: "Checkouts, service desk, fill and inventory, online pick and pack, merchandising, fitting rooms, cleaning; Clerical Assistant Level 1", weekly: 1074.84, hourly: 28.29, casualHourly: 35.36 },
    { level: "Store Team Member Level 2", description: "Forklift operator, ride-on equipment operator", weekly: 1099.56, hourly: 28.94, casualHourly: 36.18 },
    { level: "Store Team Member Level 4", description: "Supervisor of fewer than 15 people (including self), cash office; Clerical Officer Level 2", weekly: 1153.82, hourly: 30.36, casualHourly: 37.95 },
    { level: "Store Team Member Level 6", description: "Helps lead the store team; Clerical Officer Level 3", weekly: 1202.61, hourly: 31.65, casualHourly: 39.56 },
  ],
  juniorScale: [
    { age: "16 and under", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20 and over", percentage: 1 },
  ],
  juniorNote:
    "BIG W pays the full adult rate from 20 (cl 4.3.1). Junior percentages apply only at Store Team Member Levels 1 and 2; a junior at Level 4 or 6 gets the adult rate (cl 4.3.2). The table shows Level 1.",
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
    "Casual rates include the 25% loading, and casuals are not paid a penalty on a penalty (cl 4.1.3). The loadings replace each other rather than stacking (cl 6.2).",
    "For an adult Level 1 team member that is $35.36 an hour on a weekday evening or Saturday ($42.44 casual), $42.44 on a Sunday ($49.51 casual) and $63.65 on a public holiday ($70.73 casual) — our arithmetic on the formula rate.",
    "Under BIG W's undertaking to the Fair Work Commission, the span of ordinary hours is the Retail Award's, and hours outside it are paid at overtime rates. Overtime is not reduced by the lower penalty in the table.",
  ],
  overtime: [
    { when: "Monday to Saturday, first 3 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 3 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "BIG W's agreement prints only its 2023 rates. Each July they rise by the Annual Wage Review percentage plus a Boosted Leave increase — 4.75% + 0.5% = 5.25% in 2026 — so the 2026 figures here are our calculation from that formula, not a BIG W table. The agreement says the increases \"do not compound\"; if that is read as applying every rise to the 2023 rate, Level 1 would be $28.14 rather than $28.29. Check your payslip, and ask the SDA if it shows less.",
    "Boosted Leave does not change your hourly rate. Permanent staff who elect it (or who do not choose by 31 May, which counts as electing it) get extra paid leave — 3 days in 2026–27 for a full-timer — and its value is taken back out of pay in equal weekly amounts. Unused Boosted Leave is paid out at the end of the financial year. Casuals cannot elect it.",
    "From the first full pay period on or after 1 December 2026, the Retail Award pays 18- and 19-year-olds with more than 6 months' service 75% and 85% of the award rate ($20.86 and $23.64). That is more than BIG W's 70% and 80%, and an agreement cannot pay a base rate below the award, so those staff must get at least the award figure.",
  ],
  unverified: [
    "BIG W's own 2025 and 2026 pay tables — not public, so the 2026 dollars are calculated from the agreement's formula.",
    "The dollar value of the weekly Boosted Leave offset — the agreement does not print one.",
    "Saved-rate employees (Appendix D) and salaried managers — paid outside the rate table.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "BIG W Stores Enterprise Agreement 2023 (AE523762)", publisher: "Fair Work Commission", url: EA_URL },
    { title: "BIG W Stores Enterprise Agreement 2023, with approval decision [2024] FWCA 849 and undertakings", publisher: "Shop, Distributive and Allied Employees' Association", url: SDA_COPY_URL },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
  ],
  faqs: [
    {
      q: "How much does Big W pay an hour in 2026?",
      a: "An adult Store Team Member Level 1 at BIG W is paid about $28.29 an hour ($1,074.84 a week full-time), or $35.36 as a casual, from the first full pay period on or after 1 July 2026. That is our calculation from the agreement's formula: the 4.75% Annual Wage Review plus a 0.5% Boosted Leave increase. Level 6 is about $31.65.",
    },
    {
      q: "What is Boosted Leave at Big W, and does it lower my hourly rate?",
      a: "No. Permanent staff can use the above-award part of each pay rise to buy extra leave — up to 3 days in 2026–27 for a full-timer. Your base rate stays the same; the value of the leave is deducted from pay in equal weekly amounts, and anything unused is paid out at the end of the financial year. If you do not choose by 31 May, you are treated as opting in.",
    },
    {
      q: "How much does Big W pay a 16 or 17 year old?",
      a: "At Level 1, BIG W pays 50% of the adult rate at 16 and under (about $14.14 an hour, $17.68 casual) and 60% at 17 (about $16.97, $21.21 casual). It is 70% at 18, 80% at 19 and the full adult rate from 20.",
    },
    {
      q: "What does Big W pay on Sundays and public holidays?",
      a: "Between 9am and 11pm on a Sunday, permanent staff get base + 50% and casuals base + 75% (about $42.44 and $49.51 an hour at Level 1). Public holidays pay base + 125%, or base + 150% for casuals.",
    },
    {
      q: "What is the Big W enterprise agreement?",
      a: "The BIG W Stores Enterprise Agreement 2023 (AE523762), approved by the Fair Work Commission on 13 March 2024. It started on 20 May 2024 and has a nominal expiry date of 1 October 2027. Pay rises each July by the Annual Wage Review percentage plus a Boosted Leave margin.",
    },
  ],
};
