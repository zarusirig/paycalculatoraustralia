// Queensland — Queensland Fire Department (QFD) career firefighter pay.
//
// Sources (all read 24 September 2026):
//  1. Queensland Fire Department Certified Agreement 2025 (CA25), certified by
//     the QIRC on 14 April 2026 (CB/2026/32), nominal expiry 31 July 2028.
//     Clause 23: +2.5% from 1 August 2026 and +2.5% from 1 August 2027, plus a
//     CPI Uplift Adjustment (CUA). Clause 8(5): State Wage Case increases are
//     absorbed. Clause 8(6): "no employee will receive a base rate of pay that
//     is less than the corresponding base rate of pay in the Award."
//  2. QFD "CURRENT - Wages table" (QFD-CA25-wage-tables-SWC-uplift-current.pdf,
//     linked from fire.qld.gov.au/about-us/corporate-knowledge-centre/ca25,
//     page updated 6 May 2026). Prints fortnightly BASE rates for 1 Aug 2025
//     (incl. the CUA and 2025 SWC), 1 Aug 2026 and 1 Aug 2027.
//  3. Queensland Fire and Emergency Service Employees Award – State 2016,
//     QIRC reprint effective 1 September 2026 (after the 2026 State Wage Case,
//     +4.75%), clause 12.4(a): fortnightly award minimums.
//
// HOW THE CURRENT RATE IS CHOSEN: on 24 September 2026 the CA25 1 August 2026
// base rate applies, EXCEPT where the award minimum from 1 September 2026 is
// higher — then clause 8(6) makes the award rate the floor. QFD's own 2025 wage
// table applied exactly this rule (rows marked "*note identified roles have
// increase by SWC"). No arithmetic is done: each row's `salary` is the higher
// of two printed fortnightly rates, × 26.0714, rounded to the dollar, and the
// `note` names which document the rate comes from. QFD has not yet published a
// post-1 September 2026 table, so the award-floor rows are flagged in
// `unverified`.
//
// Base rate only: QFD's "Total f/n" column also adds weekend shift, night
// shift and 38-hour week allowances, which are excluded here.

import type { ServicePayJurisdiction } from "../types";

export const QLD_FIREFIGHTER_PAY: ServicePayJurisdiction = {
  occupation: "firefighter",
  slug: "qld",
  code: "QLD",
  name: "Queensland",
  nameInSentence: "Queensland",
  employer: "Queensland Fire Department (QFD)",
  agreementName: "Queensland Fire Department Certified Agreement 2025",
  agreementUrl: "https://www.qirc.qld.gov.au/sites/default/files/2026-04/2026_cb32.pdf",
  ratesEffectiveFrom: "1 August 2026 (award-floor rows from 1 September 2026)",
  nextIncrease: {
    date: "1 August 2027",
    detail:
      "A further 2.5% under CA25 clause 23, already printed in QFD's wage table: Recruit $2,297.67, Firefighter $2,744.59, Senior Firefighter PP4 $3,321.90 and Station Officer 3 PP3 $4,125.81 per fortnight (base). A CPI Uplift Adjustment of up to 1% may also be added if Brisbane CPI exceeds 2.5%. Where a future State Wage Case lifts the award minimum above a CA25 rate, the award rate applies instead.",
  },
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "firefighters",
      title: "Firefighters (CA25 Schedule 1, base rates)",
      intro:
        "Career firefighters from recruit to Senior Firefighter. Progression to First Class Firefighter is compulsory; Senior Firefighter is optional. Pay points within each rank are reached by time served (1 year per point, 4 years at Senior Firefighter PP2).",
      stepHeading: "Classification / pay point",
      steps: [
        {
          label: "Recruit",
          salary: 59_730,
          note: "$2,291.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $2,241.63 is lower)",
        },
        {
          label: "Firefighter PP1 (including temporary Firefighter)",
          salary: 71_331,
          note: "$2,736.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $2,677.65 is lower)",
        },
        {
          label: "Firefighter PP2",
          salary: 71_331,
          note: "$2,736.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $2,677.65 is lower)",
        },
        {
          label: "First Class Firefighter PP1",
          salary: 76_702,
          note: "$2,942.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $2,879.21 is lower)",
        },
        {
          label: "First Class Firefighter PP2",
          salary: 76_702,
          note: "$2,942.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $2,879.21 is lower)",
        },
        {
          label: "First Class Firefighter PP3",
          salary: 76_702,
          note: "$2,942.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $2,905.99 is lower)",
        },
        {
          label: "First Class Firefighter PP4",
          salary: 76_900,
          note: "$2,949.58 per fortnight — CA25 rate from 1 Aug 2026",
        },
        {
          label: "Senior Firefighter PP1",
          salary: 81_004,
          note: "$3,107.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $3,054.44 is lower)",
        },
        {
          label: "Senior Firefighter PP2",
          salary: 81_004,
          note: "$3,107.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $3,085.00 is lower)",
        },
        {
          label: "Senior Firefighter PP3",
          salary: 83_245,
          note: "$3,192.98 per fortnight — CA25 rate from 1 Aug 2026",
        },
        {
          label: "Senior Firefighter PP4",
          salary: 84_494,
          note: "$3,240.88 per fortnight — CA25 rate from 1 Aug 2026",
        },
      ],
    },
    {
      id: "leading-firefighters-and-station-officers",
      title: "Leading Firefighters and Station Officers (CA25 Schedule 1, base rates)",
      intro:
        "Leading Firefighter (reached after the Station Officer training program) and the three Station Officer levels, each with its own pay points.",
      stepHeading: "Classification / pay point",
      steps: [
        {
          label: "Leading Firefighter PP1",
          salary: 86_140,
          note: "$3,304.00 per fortnight — award minimum from 1 Sep 2026 (CA25 rate $3,260.00 is lower)",
        },
        {
          label: "Leading Firefighter PP2",
          salary: 86_268,
          note: "$3,308.92 per fortnight — CA25 rate from 1 Aug 2026",
        },
        { label: "Station Officer 1 PP1", salary: 95_010, note: "$3,644.21 per fortnight — CA25 rate from 1 Aug 2026" },
        { label: "Station Officer 1 PP2", salary: 95_959, note: "$3,680.64 per fortnight — CA25 rate from 1 Aug 2026" },
        { label: "Station Officer 1 PP3", salary: 97_399, note: "$3,735.86 per fortnight — CA25 rate from 1 Aug 2026" },
        { label: "Station Officer 2 PP1", salary: 97_443, note: "$3,737.55 per fortnight — CA25 rate from 1 Aug 2026" },
        { label: "Station Officer 2 PP2", salary: 98_417, note: "$3,774.91 per fortnight — CA25 rate from 1 Aug 2026" },
        { label: "Station Officer 2 PP3", salary: 99_893, note: "$3,831.53 per fortnight — CA25 rate from 1 Aug 2026" },
        { label: "Station Officer 3 PP1", salary: 102_369, note: "$3,926.47 per fortnight — CA25 rate from 1 Aug 2026" },
        { label: "Station Officer 3 PP2", salary: 103_391, note: "$3,965.69 per fortnight — CA25 rate from 1 Aug 2026" },
        { label: "Station Officer 3 PP3", salary: 104_942, note: "$4,025.18 per fortnight — CA25 rate from 1 Aug 2026" },
      ],
    },
  ],
  entryStep: "Recruit",
  topStep: "Senior Firefighter PP4",

  traineePay: [
    "Recruits are paid a base rate of $2,291.00 per fortnight from 1 September 2026 — the award minimum, which is higher than the CA25 recruit rate of $2,241.63 from 1 August 2026. That is about $59,730 a year before shift allowances.",
    "The award sets the Recruit stage at 16 weeks, followed by 32 months as a Firefighter and 12 months as a First Class Firefighter before Senior Firefighter.",
  ],
  penalties: [
    "Firefighters on the 10/14 continuous shift roster (the recognised continuous shift roster under CA25 clause 49) are also paid a weekend shift allowance of 21.43% of base rate (clause 73) and a night shift allowance of 6.45% of base rate (clause 72).",
    "A 38-hour week allowance is paid fortnightly in lieu of reducing ordinary hours from 40 to 38: (base + weekend + night shift) ÷ 76 × 4 (clause 74). It is superannuated (clause 75).",
    "Firefighters and Station Officers in specified operational day-staff positions (for example roster, planning and building approval officers) receive a 2.5% Special Flexibility Allowance on base rate for normal hours worked, in compensation for the flexibility required.",
    "With those allowances, QFD's table shows a total of $3,017.35 per fortnight for a Recruit and $4,362.38 for a Senior Firefighter PP4 from 1 August 2026 (before the 1 September 2026 award-floor adjustment).",
  ],
  notices: [
    "CA25 was certified by the Queensland Industrial Relations Commission on 14 April 2026 and replaced the Queensland Fire and Emergency Services Certified Agreement 2022. Its nominal expiry date is 31 July 2028.",
    "The 2026 State Wage Case raised award wages by 4.75% from 1 September 2026. Because CA25 guarantees no employee is paid below the award base rate, several lower pay points now sit on the award rate rather than the CA25 rate. QFD had not published an updated table for 1 September 2026 when we checked.",
    "A CPI Uplift Adjustment for the year from 1 August 2026 (CUA period 2) is triggered only if the March 2027 Brisbane CPI exceeds 2.5% (capped at 1%). Any such adjustment would be back-paid.",
  ],
  unverified: [
    "Rows marked 'award minimum from 1 Sep 2026' apply CA25 clause 8(6) to the award's printed minimum; QFD has not yet published its own post-1 September 2026 wage table confirming these rows.",
    "The CUA for 1 August 2026 is not yet known, so it is not included.",
    "Rural Fire Service, Fire Communications and Senior Officer (Inspector and above) classifications are not shown.",
  ],
  sources: [
    {
      title: "Queensland Fire Department Certified Agreement 2025 (CB/2026/32)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-04/2026_cb32.pdf",
    },
    {
      title: "CURRENT - Wages table (QFD CA25 wage tables, SWC uplift, effective as at 1 September 2025)",
      publisher: "Queensland Fire Department",
      url: "https://www.fire.qld.gov.au/sites/default/files/2026-05/QFD-CA25-wage-tables-SWC-uplift-current.pdf",
    },
    {
      title: "Queensland Fire Department Certified Agreement 2025 (CA25) — bargaining updates and key documents",
      publisher: "Queensland Fire Department",
      url: "https://www.fire.qld.gov.au/about-us/corporate-knowledge-centre/ca25",
    },
    {
      title: "Queensland Fire and Emergency Service Employees Award – State 2016, reprint effective 1 September 2026 (clause 12.4)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/qld_fire_010926.pdf",
    },
    {
      title: "Declaration of General Ruling (State Wage Case 2026)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/2026_b59_b60_declaration_0.pdf",
    },
  ],
  faqs: [
    {
      q: "How much does a firefighter earn in Queensland?",
      a: "A Queensland Fire Department Senior Firefighter at the top pay point (PP4) has a base rate of $3,240.88 a fortnight, about $84,494 a year, from 1 August 2026. Shift allowances add to this: QFD's table shows a total of $4,362.38 a fortnight for that pay point.",
    },
    {
      q: "What is a recruit firefighter's salary in Queensland?",
      a: "From 1 September 2026 a QFD Recruit is paid the award minimum base rate of $2,291.00 a fortnight, about $59,730 a year, because it is higher than the CA25 recruit rate of $2,241.63. Recruits then move to Firefighter at $2,736.00 a fortnight.",
    },
    {
      q: "How much does a station officer earn in Queensland?",
      a: "Under CA25 from 1 August 2026, Station Officer base rates run from $3,644.21 a fortnight (Station Officer 1 PP1, about $95,010 a year) to $4,025.18 a fortnight (Station Officer 3 PP3, about $104,942 a year).",
    },
    {
      q: "When do Queensland firefighters get their next pay rise?",
      a: "CA25 gives a further 2.5% from 1 August 2027 — for example the Recruit rate becomes $2,297.67 a fortnight. A CPI top-up of up to 1% can also apply if Brisbane inflation runs above 2.5%.",
    },
  ],
};
