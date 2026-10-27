// ALDI: Store Assistants and Duty Store Managers in ALDI stores.
//
// Instrument: ALDI Prestons Agreement 2024, AG2024/4407, AE531722 (PR795441),
// approved 2 January 2026 by Slevin DP ([2026] FWC 2) with an amendment the
// Commission specified itself under s 191A (written fixed hours for hourly-paid
// warehouse staff, Schedule 3). Operates from the first pay period starting
// 7 days after approval; nominal expiry 2 January 2030. Read in full from the
// FWC PDF on 22 October 2026.
//
// WHY PRESTONS. ALDI has one agreement per region, each named after the
// region's distribution centre and each printing the rates current when it was
// made. Prestons is the most recently approved, so its printed Store Assistant
// rates are the latest on the FWC register. The ALDI Minchinbury Agreement 2024
// (AG2024/1941, AE525264, Masson DP, approved 1 July 2024, operating 8 July
// 2024, nominal expiry 30 June 2028) prints the same structure 4% lower:
// Full-time $29.04, Limited Roster $28.50, Fixed Roster $25.76, Duty Store
// Manager $31.46. Also read from the FWC PDF on 22 October 2026.
//
// NO FIXED PAY RISES. cl 27: ALDI reviews all rates annually against business
// performance and market conditions; increases take effect from the first full
// pay period after 1 September. The printed dollars are minimums and ALDI's
// current rates may be higher. Nothing here is projected.
//
// NO ADULT CASUALS. Casual Store Assistants are juniors only (Sch 2 cl 7.2):
// they move to a permanent type in the first full pay period after turning 18.
// Every adult row carries noCasual, casualLoading is 0, and the page, hub and
// meta description drop the casual figure (template change, 22 Oct 2026).
//
// RATES ARE PRINTED AS DOLLARS PER TIME BAND (Sch 2 Part D), inclusive of all
// allowances (Sch 2 cl 10), so the penalty table shows dollars, not percentages.
// Fixed Roster Store Assistant prints $26.79, below the Retail Award Level 1
// rate of $27.81 from 1 July 2026: s 206 FW Act makes $27.81 the floor, so the
// classification is explained in a notice rather than tabled.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae531722.pdf";
const MINCHINBURY_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae525264.pdf";

export const ALDI_PAY: EmployerPay = {
  slug: "aldi",
  name: "ALDI",
  employerEntity:
    "ALDI Foods Pty Limited as General Partner of ALDI Stores (A Limited Partnership), trading as ALDI Stores",
  industry: "supermarket",
  instrument: {
    kind: "enterprise-agreement",
    title: "ALDI Prestons Agreement 2024",
    reference: "AG2024/4407, AE531722",
    url: EA_URL,
    approvedOn: "2 January 2026 ([2026] FWC 2), operating from the first pay period starting 7 days after approval",
    nominalExpiry: "2 January 2030",
    coverage:
      "It covers hourly-paid and salaried staff in ALDI's Prestons Region: the stores and distribution centre in and around south-west Sydney mapped in the agreement's Schedule 5. Store Managers, Assistant Store Managers, Duty Store Managers and Store Assistants are covered; executive managers, directors and office employees are not. ALDI's other regions each have their own agreement with the same structure.",
  },
  ratesEffectiveFrom: "the agreement's start in January 2026 (its printed minimum rates)",
  nextIncrease: {
    date: "First full pay period after 1 September each year",
    detail:
      "The Prestons agreement does not fix any pay rise. ALDI reviews every rate of pay once a year against business performance and market conditions (cl 27), and any increase starts in the first full pay period after 1 September. The rates on this page are the minimums printed in the agreement; your payslip may show more.",
  },
  verifiedOn: "22 October 2026",
  casualLoading: 0,
  casualRateNote:
    "ALDI stores do not employ adult casuals under this agreement. Casual Store Assistants are juniors only (Schedule 2 cl 7.2). They move to a Limited Roster, Fixed Roster, Flexible or Full-time role in the first full pay period after their 18th birthday. The agreement prints the casual junior rates: $17.31 an hour at 16 and $20.75 at 17 on weekdays before 6pm.",
  rates: [
    {
      level: "Limited Roster Store Assistant",
      description: "Part-time store assistant who is not available on every day or at all times; up to 30 contract hours a fortnight (Schedule 2 cl 4)",
      hourly: 29.64,
      casualHourly: 0,
      noCasual: true,
    },
    {
      level: "Full-time or Flexible Store Assistant",
      description: "Store assistant rostered at any time Monday to Sunday, up to 10 shifts a fortnight; full-time means 76 ordinary hours a fortnight (Schedule 2 cls 2 and 3)",
      hourly: 30.21,
      casualHourly: 0,
      noCasual: true,
    },
    {
      level: "Duty Store Manager",
      description: "Hourly-paid store manager on 60, 70 or 76 contract hours a fortnight (Schedule 1 cl 12)",
      hourly: 32.72,
      casualHourly: 0,
      noCasual: true,
    },
  ],
  juniorScale: [],
  juniorNote:
    "Juniors get 50% of the adult rate for their employment type at 16 and 60% at 17 (Schedule 2 cl 15), and the adult rate from 18. That is $14.82 and $17.78 an hour for a Limited Roster Store Assistant, or $15.11 and $18.13 for a Full-time or Flexible Store Assistant (our arithmetic). Juniors are the only casuals ALDI stores employ, and the agreement prints their casual rates. On weekdays before 6pm a casual gets $17.31 an hour at 16 and $20.75 at 17. After 6pm and on Saturdays it is $20.75 and $24.90, on Sundays $24.23 and $29.06, and on public holidays $34.59 and $41.51. The agreement prints no rate for staff under 16.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "$30.21 (base rate)", casual: "$17.31 at 16, $20.75 at 17" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "$37.00", casual: "$20.75 at 16, $24.90 at 17" },
    { when: "Saturday, 7am to 8pm", permanent: "$37.00", casual: "$20.75 at 16, $24.90 at 17", note: "Casual juniors get the same rate until 11pm" },
    { when: "Saturday, 8pm to 11pm", permanent: "$43.41", casual: "$20.75 at 16, $24.90 at 17" },
    { when: "Late night and early morning: 11pm to 6am, 6am to 7am Monday to Saturday, and Saturday 11pm to midnight", permanent: "$43.78", casual: "$24.23 at 16, $29.06 at 17" },
    { when: "Sunday, 9am to 11pm", permanent: "$43.78", casual: "$24.23 at 16, $29.06 at 17" },
    { when: "Sunday, midnight to 9am and 11pm to midnight", permanent: "$57.36", casual: "$31.14 at 16, $37.37 at 17" },
    { when: "Public holidays", permanent: "$64.15", casual: "$34.59 at 16, $41.51 at 17" },
  ],
  penaltyNotes: [
    "The agreement prints a dollar rate for each time band rather than a percentage. The rates include all allowances, such as laundry, meal, dairy-room and freezer-room allowances (Schedule 2 cl 10). The table shows the Full-time or Flexible Store Assistant column; the casual column shows the printed junior casual rates, because ALDI stores have no adult casuals.",
    "A Limited Roster Store Assistant gets $36.30 on weekday evenings and on Saturdays to 8pm. Early mornings (6am to 7am) and Sundays from 9am to 8pm pay $42.95. Late Saturdays, overnight hours and Sunday evenings pay $43.41, Sundays before 9am or after 11pm $56.26, and public holidays $62.92.",
    "A Duty Store Manager gets $40.06 on weekday evenings (6pm to 11pm) and on Saturdays from 7am to 11pm, with no separate late-Saturday rate. Overnight hours (11pm to 7am) and Sundays from 9am to 11pm pay $47.42. Sundays before 9am or after 11pm pay $62.10, and public holidays $69.45 (Schedule 1 cl 12.3).",
    "Each rate table also prints a Break Loading equal to the base rate. It is paid on top of your hourly rate for every hour you work after returning with less than a 10-hour break.",
  ],
  overtime: [
    {
      when: "More than 9 ordinary hours in a day, or 76 in a fortnight (Full-time, Flexible and Limited Roster Store Assistants)",
      permanent: "150% of the base rate: $45.32 for a Full-time or Flexible Store Assistant, $44.46 Limited Roster (our arithmetic)",
      casual: "Juniors: $24.23 at 16 or $29.06 at 17 for the first 3 hours Monday to Saturday, then $31.14 or $37.37",
    },
    {
      when: "Duty Store Manager, more than 9 ordinary hours in a day or 76 in a fortnight",
      permanent: "150% of the base rate: $49.08 (our arithmetic)",
      casual: "No casual Duty Store Managers",
    },
  ],
  allowances: [
    {
      name: "Relieving Shift Manager allowance",
      amount: "$9.00 an hour",
      when: "A Store Assistant invited and trained to work as a Relieving Shift Manager, for every hour in that role, paid in the following pay period (Schedule 2 cl 17)",
    },
  ],
  allowancesNote:
    "Store Assistant and Duty Store Manager rates are otherwise inclusive of all allowances, including laundry, meal, dairy-room and freezer-room allowances (Schedule 2 cl 10).",
  notices: [
    "ALDI has a separate agreement for each of its regions, named after the region's distribution centre. They include Prestons and Minchinbury in New South Wales, Derrimut in Victoria, Stapylton and Brendale in Queensland, and Jandakot in Western Australia. They share one structure but print the rates current when each was made. The Minchinbury agreement, approved in July 2024, prints $29.04 for a Full-time Store Assistant, $28.50 Limited Roster and $31.46 for a Duty Store Manager. That is about 4% below the Prestons figures here. Your payslip names the agreement that covers you.",
    "The rates on this page are printed minimums, not ALDI's current pay. The agreement fixes no pay rise; ALDI reviews every rate each year and increases start in the first full pay period after 1 September (cl 27). The Prestons rates were approved in January 2026, so a September 2026 review may have lifted them.",
    "The agreement also prints $26.79 an hour for a Fixed Roster Store Assistant (set days, times and hours each week). That is below the General Retail Industry Award's $27.81 Level 1 rate from 1 July 2026. An agreement cannot pay a base rate below the award (Fair Work Act s 206), so Fixed Roster Store Assistants must get at least $27.81 for ordinary hours. The role is left out of the hourly rates table below because its printed figure no longer applies.",
    "The Fair Work Commission approved this agreement only after specifying its own amendment under s 191A of the Fair Work Act. ALDI must agree hours, days and start and finish times in writing with each hourly-paid warehouse employee within 8 weeks. The amendment changes Schedule 3 (warehouse) and does not alter store rates.",
  ],
  unverified: [
    "Store Manager and Assistant Store Manager pay: both are salaried under Schedule 1, with salary tables by agreed fortnightly hours and years of service, not transcribed here.",
    "Rates in ALDI's other regional agreements, beyond the Minchinbury comparison above.",
    "ALDI's actual rates after its September 2026 review, which the agreement does not print.",
    "Warehouse, transport and distribution rates (Schedules 3 and 4).",
    "Pay for staff under 16: the agreement's junior table starts at 16.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "ALDI Prestons Agreement 2024 (AE531722), with approval decision [2026] FWC 2 and specified amendment", publisher: "Fair Work Commission", url: EA_URL },
    { title: "ALDI Minchinbury Agreement 2024 (AE525264), approved 1 July 2024", publisher: "Fair Work Commission", url: MINCHINBURY_URL },
    { title: "General Retail Industry Award 2020 (MA000004), Level 1 from 1 July 2026", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
  ],
  faqs: [
    {
      q: "How much does ALDI pay an hour in 2026?",
      a: "The ALDI Prestons Agreement 2024, approved in January 2026, prints $30.21 an hour for a Full-time or Flexible Store Assistant. A Limited Roster Store Assistant gets $29.64 and a Duty Store Manager $32.72, before any evening, weekend or public holiday rate. ALDI reviews pay every September and does not print the increases, so these are the minimums.",
    },
    {
      q: "Does ALDI hire casuals?",
      a: "ALDI stores do not hire adult casuals. Under the agreement, casual Store Assistants are juniors only. They move to a Limited Roster, Fixed Roster, Flexible or Full-time role in the first full pay period after turning 18. Adults who want part-time hours are employed as Limited Roster Store Assistants on up to 30 contract hours a fortnight.",
    },
    {
      q: "How much does ALDI pay a 16 or 17 year old?",
      a: "A 16-year-old gets 50% and a 17-year-old 60% of the adult rate for their job type. That is $14.82 and $17.78 an hour as a Limited Roster Store Assistant, or $15.11 and $18.13 as a Full-time or Flexible Store Assistant. Casual juniors have their own printed rates of $17.31 at 16 and $20.75 at 17 on weekdays before 6pm. From 18, juniors get the adult rate.",
    },
    {
      q: "What does ALDI pay on Sundays and public holidays?",
      a: "A Full-time or Flexible Store Assistant gets $43.78 an hour on a Sunday between 9am and 11pm and $57.36 before 9am or after 11pm, and $64.15 on a public holiday. A Limited Roster Store Assistant gets $42.95, $56.26 and $62.92 for the same hours. Casual juniors get $24.23 (16) or $29.06 (17) on Sunday daytime and $34.59 or $41.51 on public holidays.",
    },
    {
      q: "Why does ALDI have more than one enterprise agreement?",
      a: "ALDI bargains region by region, so each distribution-centre region (Prestons, Minchinbury, Derrimut, Stapylton, Brendale, Jandakot and others) has its own agreement with the same clauses. Each prints the rates in force when it was made: Minchinbury's 2024 agreement prints $29.04 for a Full-time Store Assistant where the later Prestons agreement prints $30.21.",
    },
    {
      q: "Does ALDI pay more than the award?",
      a: "Yes, ALDI's printed Store Assistant rates are above the award, with one exception. The printed $30.21 for a Full-time or Flexible Store Assistant is about 8.6% above the General Retail Industry Award's $27.81 Level 1 rate from 1 July 2026. The $29.64 Limited Roster rate is 6.6% above it. The one exception is the printed $26.79 Fixed Roster rate, which the award now overtakes, so $27.81 is the floor for that role.",
    },
  ],
};
