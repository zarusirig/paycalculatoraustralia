// =============================================================================
// Queensland — Queensland Health nurses and midwives.
//
// Source: Queensland Health, "Nursing stream wage rates", table headed
// "Wage rates from 1 April 2026".
// https://www.health.qld.gov.au/hrpolicies/wage-rates/nursing
// Read 28 August 2026 (page last published 30 July 2026).
//
// Queensland is the most generous publisher of the six states: the employer's
// own wage schedule prints per annum, per fortnight, per hour AND casual per
// hour for every pay point. Nothing on this page is derived.
//
// TWO THINGS THE SOURCE SAYS THAT MATTER
// --------------------------------------
//   1. The 1 April 2026 rates include a 0.5% Consumer Price Index Uplift
//      Adjustment applied mid-2026 after the March 2026 quarter Brisbane CPI.
//      Queensland Health notes the published agreement PDF has NOT been updated
//      to show it — so the agreement document and the wage schedule disagree,
//      and the wage schedule is the operative one.
//   2. Nurse Grade 5 pay point 8 exists as a row but has NO rate until
//      1 December 2027. It is published here with the rate omitted and the
//      reason stated, rather than filled in by extrapolation.
//
// Grade 6 Band 1 is being restructured on 1 December 2027 (pay point 1 removed,
// the rest renumbered down). That is future-dated and does not change the rates
// in force now.
// =============================================================================

import type { NursingStateData } from "./types";

const WAGE_SCHEDULE = {
  title: "Nursing stream wage rates — wage rates from 1 April 2026",
  url: "https://www.health.qld.gov.au/hrpolicies/wage-rates/nursing",
  publisher: "Queensland Health",
};

export const QLD_NURSING_PAY: NursingStateData = {
  slug: "qld",
  code: "QLD",
  name: "Queensland",
  shortName: "QLD",
  employer: "Queensland Health (Hospital and Health Services) and the Department of Education",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: "qld-eb12",
      name: "Nurses and Midwives (Queensland Health and Department of Education) Certified Agreement (EB12) 2025",
      effectiveFrom: "1 April 2026",
      nextIncrease: "1 April 2027",
      tribunal: "Queensland Industrial Relations Commission",
      reference: "Certified agreement CB/2025/126",
      source: WAGE_SCHEDULE,
      note:
        "Queensland Health's wage schedule is the operative source: it carries a 0.5% CPI Uplift Adjustment applied in mid-2026 that the published agreement PDF does not yet show.",
    },
    {
      id: "qld-award-2015",
      name: "Nurses and Midwives (Queensland Health) Award — State 2015",
      effectiveFrom: "1 September 2023 (consolidated text)",
      tribunal: "Queensland Industrial Relations Commission",
      source: {
        title: "Nurses and Midwives (Queensland Health) Award — State 2015",
        url: "https://www.qirc.qld.gov.au/sites/default/files/2024-04/nurses_midwives_010923.pdf",
        publisher: "Queensland Industrial Relations Commission",
      },
      note:
        "The parent award supplies the shift and weekend penalties. The certified agreement also guarantees no employee is paid below the corresponding award rate.",
    },
  ],

  scales: [
    {
      classification: "Registered Nurse/Midwife",
      gradeCode: "Nurse Grade 5",
      family: "registered",
      instrumentId: "qld-eb12",
      points: [
        { label: "Re-entry", annual: 83872, fortnightly: 3214.8, hourly: 42.3, casualHourly: 52.875 },
        { label: "Pay point 1", annual: 87790, fortnightly: 3365.0, hourly: 44.2763, casualHourly: 55.3454 },
        { label: "Pay point 2", annual: 91915, fortnightly: 3523.1, hourly: 46.3566, casualHourly: 57.9458 },
        { label: "Pay point 3", annual: 96053, fortnightly: 3681.7, hourly: 48.4434, casualHourly: 60.5543 },
        { label: "Pay point 4", annual: 100180, fortnightly: 3839.9, hourly: 50.525, casualHourly: 63.1563 },
        { label: "Pay point 5", annual: 104318, fortnightly: 3998.5, hourly: 52.6118, casualHourly: 65.7648 },
        { label: "Pay point 6", annual: 108466, fortnightly: 4157.5, hourly: 54.7039, casualHourly: 68.3799 },
        { label: "Pay point 7", annual: 112607, fortnightly: 4316.2, hourly: 56.7921, casualHourly: 70.9901 },
        {
          label: "Pay point 8",
          note:
            "No rate until 1 December 2027, when this pay point commences at $122,873 a year ($61.97 an hour). Pay point 7 employees with 12 months or more service on that date increment automatically (clause 27).",
        },
      ],
      note:
        "Queensland pays registered nurses and midwives on one scale. Nurse Grade 5 is the registered nurse and midwife grade — the number is the grade, not the years of service.",
    },
    {
      classification: "Enrolled Nurse",
      gradeCode: "Nurse Grade 3",
      family: "enrolled",
      instrumentId: "qld-eb12",
      points: [
        { label: "Pay point 1", annual: 75573, fortnightly: 2896.7, hourly: 38.1145, casualHourly: 47.6431 },
        { label: "Pay point 2", annual: 76653, fortnightly: 2938.1, hourly: 38.6592, casualHourly: 48.324 },
        { label: "Pay point 3", annual: 77783, fortnightly: 2981.4, hourly: 39.2289, casualHourly: 49.0361 },
        {
          label: "Pay point 4",
          annual: 78949,
          fortnightly: 3026.1,
          hourly: 39.8171,
          casualHourly: 49.7714,
          note:
            "From 1 June 2026 this is the minimum pay point for a Grade 3 enrolled nurse holding a certificate III or higher in sterilising services and working in sterilising services (clause 31).",
        },
        { label: "Pay point 5", annual: 80204, fortnightly: 3074.2, hourly: 40.45, casualHourly: 50.5625 },
      ],
    },
    {
      classification: "Enrolled Nurse Advanced Skills",
      gradeCode: "Nurse Grade 4",
      family: "enrolled",
      instrumentId: "qld-eb12",
      points: [
        { label: "Pay point 1", annual: 82578, fortnightly: 3165.2, hourly: 41.6474, casualHourly: 52.0593 },
        { label: "Pay point 2", annual: 87626, fortnightly: 3358.7, hourly: 44.1934, casualHourly: 55.2418 },
      ],
    },
    {
      classification: "Clinical Nurse/Midwife",
      gradeCode: "Nurse Grade 6 Band 1",
      family: "clinical",
      instrumentId: "qld-eb12",
      points: [
        { label: "Pay point 1", annual: 114532, fortnightly: 4390.0, hourly: 57.7632, casualHourly: 72.204 },
        { label: "Pay point 2", annual: 117227, fortnightly: 4493.3, hourly: 59.1224, casualHourly: 73.903 },
        { label: "Pay point 3", annual: 119925, fortnightly: 4596.7, hourly: 60.4829, casualHourly: 75.6036 },
        { label: "Pay point 4", annual: 122643, fortnightly: 4700.9, hourly: 61.8539, casualHourly: 77.3174 },
      ],
      note:
        "Band 1 pay point 1 is removed on 1 December 2027 and everyone above shifts down one number (clause 28). That does not change what anyone is paid now.",
    },
    {
      classification:
        "Associate Clinical Nurse/Midwife Consultant, Associate Nurse/Midwife Unit Manager, Associate Nurse/Midwife Manager, Associate Nurse/Midwife Educator, Associate Nurse/Midwife Researcher",
      gradeCode: "Nurse Grade 6 Band 2",
      family: "clinical",
      instrumentId: "qld-eb12",
      points: [
        { label: "Pay point 1", annual: 128740, fortnightly: 4934.6, hourly: 64.9289, casualHourly: 81.1611 },
        { label: "Pay point 2", annual: 131440, fortnightly: 5038.1, hourly: 66.2908, casualHourly: 82.8635 },
      ],
    },
    {
      classification:
        "Clinical Nurse/Midwife Consultant, Nurse/Midwife Unit Manager, Nurse/Midwife Manager, Nurse/Midwife Educator, Nurse/Midwife Researcher, Public Health Nurse, Nurse/Midwife Navigator, Nurse Practitioner Candidate",
      gradeCode: "Nurse Grade 7",
      family: "management",
      instrumentId: "qld-eb12",
      points: [
        { label: "Pay point 1", annual: 140632, fortnightly: 5390.4, hourly: 70.9263, casualHourly: 88.6579 },
        { label: "Pay point 2", annual: 146997, fortnightly: 5634.4, hourly: 74.1368, casualHourly: 92.671 },
        { label: "Pay point 3", annual: 150653, fortnightly: 5774.5, hourly: 75.9803, casualHourly: 94.9754 },
        { label: "Pay point 4", annual: 152685, fortnightly: 5852.4, hourly: 77.0053, casualHourly: 96.2566 },
      ],
      note:
        "Queensland puts the clinical nurse consultant and the nurse unit manager on the same grade and the same money — a difference from NSW, where they are separate scales.",
    },
    {
      classification: "Nurse Practitioner",
      gradeCode: "Nurse Grade 8",
      family: "practitioner",
      instrumentId: "qld-eb12",
      points: [
        { label: "Pay point 1", annual: 158344, fortnightly: 6069.3, hourly: 79.8592, casualHourly: 99.824 },
        { label: "Pay point 2", annual: 162283, fortnightly: 6220.3, hourly: 81.8461, casualHourly: 102.3076 },
        { label: "Pay point 3", annual: 165320, fortnightly: 6336.7, hourly: 83.3776, casualHourly: 104.222 },
      ],
      note: "A nurse practitioner allowance of $237.39 a fortnight is paid on top of these rates from 1 April 2026.",
    },
    {
      classification: "Assistant in Nursing/Midwifery",
      gradeCode: "Nurse Grade 1 Band 1",
      family: "support",
      instrumentId: "qld-eb12",
      points: [
        { label: "Pay point 1", annual: 69836, fortnightly: 2676.8, hourly: 35.2211, casualHourly: 44.0264 },
        { label: "Pay point 2", annual: 71276, fortnightly: 2732.0, hourly: 35.9474, casualHourly: 44.9343 },
        { label: "Pay point 3", annual: 72215, fortnightly: 2768.0, hourly: 36.4211, casualHourly: 45.5264 },
        { label: "Pay point 4", annual: 73848, fortnightly: 2830.6, hourly: 37.2447, casualHourly: 46.5559 },
        { label: "Pay point 5", annual: 75549, fortnightly: 2895.8, hourly: 38.1026, casualHourly: 47.6283 },
        { label: "Pay point 6", annual: 76468, fortnightly: 2931.0, hourly: 38.5658, casualHourly: 48.2073 },
      ],
    },
    {
      classification: "Undergraduate Student in Nursing/Midwifery",
      gradeCode: "Nurse Grade 2",
      family: "support",
      instrumentId: "qld-eb12",
      points: [
        { label: "2nd year", annual: 71276, fortnightly: 2732.0, hourly: 35.9474, casualHourly: 44.9343 },
        { label: "3rd year", annual: 72215, fortnightly: 2768.0, hourly: 36.4211, casualHourly: 45.5264 },
      ],
    },
  ],

  penalties: [
    {
      instrumentId: "qld-award-2015",
      clause: "clause 15.12 — shift work and weekend penalties",
      rows: [
        { label: "Afternoon shift", value: "+12.5%", note: "Shift starting at or after 1200 and before 1800. Nurse Grade 1 gets 15%." },
        { label: "Night shift", value: "+20%", note: "Shift starting at or after 1800 and before 0730. Nurse Grade 1 gets 17.5%." },
        {
          label: "Saturday ordinary hours",
          value: "Time and one half",
          note: "For all time up to and including 10 hours in the shift, 0000 to 2400 Saturday.",
        },
        {
          label: "Sunday ordinary hours",
          value: "Time and three quarters",
          note: "0000 to 2400 Sunday. Nurse Grade 1 employees are paid double time on Sunday.",
        },
        { label: "Over 10 ordinary hours in a weekend shift", value: "Double time", note: "For the hours beyond 10." },
      ],
      incomplete:
        "Shift loadings do not stack on weekend penalties — the weekend rate replaces them. Public holiday rates sit in clause 23 and are not reproduced here.",
    },
  ],

  derivation: {},

  notReproduced: [
    "Assistant in Nursing — Sterilising Services (Nurse Grade 1 Band 2)",
    "Director of Nursing/Midwifery Remote, Assistant Director, Nursing/Midwifery Director and Executive Director grades 9 to 13",
    "Allowance schedules: hyperbaric, laundry, mental health environment, operating theatre, pharmacy, relieving in-charge, targeted training, X-ray and radium, endorsed midwife, RANIP isolation bonuses, on-call and professional development",
  ],

  unverified: [
    "Nurse Grade 5 pay point 8, which has no published rate until 1 December 2027",
    "Public holiday penalty rates (award clause 23)",
    "Overtime multipliers",
  ],

  verifiedOn: "28 August 2026",

  intro:
    "Queensland Health publishes its own nursing wage schedule, and it is the clearest of any state: per annum, per fortnight, per hour and casual per hour for every pay point. Queensland uses NG (nurse grade) numbering rather than years of service — a registered nurse or midwife is Nurse Grade 5, a clinical nurse is Grade 6, a nurse unit manager or clinical nurse consultant is Grade 7 and a nurse practitioner is Grade 8. The rates below are the ones in force from 1 April 2026.",

  highlights: [
    "A registered nurse or midwife in Queensland starts at $87,790 a year, which is $44.2763 an hour — Queensland Health publishes the hourly rate to four decimal places.",
    "The 1 April 2026 rates include a 0.5% CPI Uplift Adjustment that the published agreement PDF does not yet show; the wage schedule is the operative document.",
    "Nurse Grade 5 has seven paid pay points now. Pay point 8 is legislated but does not start paying until 1 December 2027.",
    "Queensland pays the clinical nurse consultant and the nurse unit manager on the same grade and the same money.",
  ],
};
