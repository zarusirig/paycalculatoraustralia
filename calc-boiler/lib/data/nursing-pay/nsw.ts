// =============================================================================
// New South Wales — NSW Health nurses and midwives.
//
// Source: Public Health System Nurses' and Midwives' (State) Award 2025, Part B
// Table 1 (Salaries), column "Rates from 01/07/2026".
// https://www.health.nsw.gov.au/careers/conditions/Awards/nurses.PDF
// Read 28 August 2026.
//
// UNITS. The award publishes WEEKLY rates and nothing else — no annual figure
// and no hourly figure appears in Table 1. Two consequences:
//
//   - The hourly figures this site shows are the award's own arithmetic, not
//     ours: clause 29(iii) says a permanent part-time employee is "paid an
//     hourly rate calculated on the basis of one thirty-eighth of the
//     appropriate rate prescribed by clause 9, Salaries". Weekly / 38.
//   - The annual figures are weekly x 52, which is what 26 fortnightly pays
//     comes to. NSW Health does not publish an annual salary in this award, so
//     the page says the multiplication out loud rather than presenting the
//     result as a published figure.
//
// The award is a state award made by the NSW Industrial Relations Commission,
// not a Fair Work instrument. NSW public health is in the state system.
// =============================================================================

import type { NursingStateData } from "./types";

const AWARD_SOURCE = {
  title: "Public Health System Nurses' and Midwives' (State) Award 2025",
  url: "https://www.health.nsw.gov.au/careers/conditions/Awards/nurses.PDF",
  publisher: "NSW Health",
};

export const NSW_NURSING_PAY: NursingStateData = {
  slug: "nsw",
  code: "NSW",
  name: "New South Wales",
  shortName: "NSW",
  employer: "NSW Health (local health districts and specialty networks)",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: "nsw-award-2025",
      name: "Public Health System Nurses' and Midwives' (State) Award 2025",
      effectiveFrom: "1 July 2026",
      nextIncrease: "1 July 2027",
      tribunal: "Industrial Relations Commission of New South Wales",
      reference: "Case Nos 242813, 242824 and 297588 of 2024, Full Bench, 15 May 2026",
      source: AWARD_SOURCE,
      note:
        "Table 1 of Part B prints three columns — 1 July 2025, 1 July 2026 and 1 July 2027. The 1 July 2026 column is the one in force now.",
    },
  ],

  scales: [
    {
      classification: "Registered Nurse/Midwife",
      gradeCode: "RN/RM Year 1–8",
      family: "registered",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "1st year", weekly: 1566.7 },
        { label: "2nd year", weekly: 1651.7 },
        { label: "3rd year", weekly: 1737.0 },
        { label: "4th year", weekly: 1828.5 },
        { label: "5th year", weekly: 1919.2 },
        { label: "6th year", weekly: 2009.5 },
        { label: "7th year", weekly: 2112.8 },
        { label: "8th year and thereafter", weekly: 2199.6 },
      ],
      note:
        "NSW runs registered nurses and midwives on one scale with the same rate at every year. There is no separate midwifery ladder.",
    },
    {
      classification: "Registered Nurse — Pre Registration",
      family: "registered",
      instrumentId: "nsw-award-2025",
      points: [{ label: "1st year and thereafter", weekly: 1350.7 }],
    },
    {
      classification: "Enrolled Nurse",
      family: "enrolled",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "1st year", weekly: 1437.6 },
        { label: "2nd year", weekly: 1468.2 },
        { label: "3rd year", weekly: 1499.5 },
        { label: "4th year", weekly: 1531.2 },
        { label: "5th year and thereafter", weekly: 1562.1 },
        { label: "Special Grade", weekly: 1609.9 },
      ],
    },
    {
      classification: "Enrolled Nurse Without Medication Qualification",
      family: "enrolled",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "1st year", weekly: 1406.7 },
        { label: "2nd year", weekly: 1437.6 },
        { label: "3rd year", weekly: 1468.2 },
        { label: "4th year", weekly: 1499.5 },
        { label: "5th year and thereafter", weekly: 1531.2 },
        { label: "Special Grade (appointed after 8/12/1999)", weekly: 1578.8 },
      ],
    },
    {
      classification: "Clinical Nurse/Midwife Specialist",
      gradeCode: "CNS / CMS",
      family: "clinical",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "Grade 1 — 1st year and thereafter", weekly: 2289.0 },
        { label: "Grade 2 — 1st year", weekly: 2458.9 },
        { label: "Grade 2 — 2nd year and thereafter", weekly: 2539.8 },
      ],
    },
    {
      classification: "Clinical Nurse/Midwife Consultant",
      gradeCode: "CNC / CMC",
      family: "clinical",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "Grade 1 — 1st year (appointed after 31/12/1999)", weekly: 2751.6 },
        { label: "Grade 1 — 2nd year", weekly: 2807.9 },
        { label: "Grade 2 — 1st year", weekly: 2863.4 },
        { label: "Grade 2 — 2nd year", weekly: 2920.6 },
        { label: "Grade 3 — 1st year", weekly: 3032.6 },
        { label: "Grade 3 — 2nd year", weekly: 3088.9 },
        { label: "Appointed prior to 31/12/1999", weekly: 2815.0 },
      ],
    },
    {
      classification: "Clinical Nurse/Midwife Educator",
      gradeCode: "CNE / CME",
      family: "clinical",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "Year 1", weekly: 2381.7 },
        { label: "Year 2 and thereafter", weekly: 2458.9 },
      ],
    },
    {
      classification: "Nursing/Midwifery Unit Manager",
      gradeCode: "NUM / MUM",
      family: "management",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "Level 1", weekly: 2759.7 },
        { label: "Level 2", weekly: 2890.4 },
        { label: "Level 3", weekly: 2968.2 },
      ],
    },
    {
      classification: "Nurse/Midwife Practitioner",
      gradeCode: "NP",
      family: "practitioner",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "1st year", weekly: 3032.6 },
        { label: "2nd year", weekly: 3088.9 },
        { label: "3rd year", weekly: 3167.8 },
        { label: "4th year", weekly: 3247.1 },
      ],
    },
    {
      classification: "Assistant in Nursing/Midwifery",
      gradeCode: "AIN",
      family: "support",
      instrumentId: "nsw-award-2025",
      points: [
        { label: "1st year", weekly: 1248.6 },
        { label: "2nd year", weekly: 1288.4 },
        { label: "3rd year", weekly: 1328.9 },
        { label: "4th year and thereafter", weekly: 1369.9 },
      ],
    },
  ],

  penalties: [
    {
      instrumentId: "nsw-award-2025",
      clause: "clause 15 — Penalty Rates for Shift Work and Weekend Work",
      rows: [
        { label: "Afternoon shift starting 10am to before 1pm", value: "+10%" },
        { label: "Afternoon shift starting 1pm to before 4pm", value: "+12.5%" },
        {
          label: "Night shift starting 4pm to before 4am",
          value: "+20%",
          note: "Lifted from 15% to 20% from the first full pay period on or after 1 July 2025.",
        },
        { label: "Night shift starting 4am to before 6am", value: "+10%" },
        { label: "Saturday ordinary hours", value: "Time and one half", note: "Midnight Friday to midnight Saturday." },
        { label: "Sunday ordinary hours", value: "Time and three quarters", note: "Midnight Saturday to midnight Sunday." },
      ],
      incomplete:
        "Weekend rates replace the shift loadings rather than stacking on top of them, and clause 15 does not apply to Nurse/Midwife Managers classified Grade 4 or above. Public holiday and overtime rates sit in separate clauses and are not reproduced here.",
    },
  ],

  derivation: {
    annual: "weekly rate x 52, which is what 26 fortnightly pays comes to — the award itself publishes no annual figure",
    hourly:
      "weekly rate divided by 38, the same arithmetic clause 29(iii) of the award prescribes for permanent part-time employees",
  },

  notReproduced: [
    "Nurse/Midwife Manager Grades 1–7 (Table 1)",
    "Nurse/Midwife Educator Grades 1–3 (Table 1)",
    "Registered Mothercraft Nurse 9th year — a closed classification for staff employed before 31 December 1988",
    "Table 2 allowances: in-charge, on-call, continuing education, uniform, Justice Health and remote-hospital rates",
  ],

  unverified: [
    "Public holiday penalty rates and overtime multipliers, which sit in clauses outside clause 15",
    "The 1 July 2027 non-salary allowance column, which the award prints as \"TBC\" pending the March 2027 CPI",
  ],

  verifiedOn: "28 August 2026",

  intro:
    "NSW nurses and midwives in the public health system are paid under a state award made by the Industrial Relations Commission of New South Wales, not under a Fair Work agreement. The award runs registered nurses and midwives up an eight-year ladder, then into clinical nurse specialist, clinical nurse consultant and nurse manager grades. Every rate below is a weekly rate, because the award publishes weekly rates and nothing else.",

  highlights: [
    "Registered nurses and midwives share one scale in NSW — there is no separate midwifery pay ladder.",
    "The night shift loading rose from 15% to 20% from the first full pay period on or after 1 July 2025.",
    "Weekend ordinary hours pay time and a half on Saturday and time and three quarters on Sunday, and those rates replace the shift loading rather than adding to it.",
    "The award prints a further increase for 1 July 2027, so the figures on this page have a known expiry.",
  ],
};
