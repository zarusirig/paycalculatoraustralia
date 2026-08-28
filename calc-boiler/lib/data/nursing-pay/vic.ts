// =============================================================================
// Victoria — public health service nurses and midwives.
//
// Source: Nurses and Midwives (Victorian Public Sector) Single Interest
// Employer Agreement 2024-2028, Appendix 2A Part 1 (wages) and Part 2
// (allowances), column "FFPPOOA 11/05/26".
//
// FFPPOOA is the agreement's own abbreviation for "first full pay period on or
// after". The agreement prints eight dated wage columns; 11 May 2026 is the one
// operative on the verification date, with the next step at 30 November 2026.
//
// The agreement prints a weekly rate AND an "Indicative Hourly Rate" for every
// classification, so both figures on this page are published, not derived.
// Annual figures are weekly x 52 and the page says so.
//
// A NAMING WRINKLE WORTH KNOWING
// ------------------------------
// The Fair Work Commission's record calls this the "Nurses and Midwives
// (Victorian Public Sector) Single Interest Employer Agreement 2024-2028"
// (AE526693, AG2024/3737, approved 8 November 2024, [2024] FWCA 3908). Victorian
// health services and the ANMF routinely call it the "Victorian Public Health
// Sector" agreement. Same instrument, two names in circulation.
//
// Victoria classifies midwives separately by title (MIDWIFE GR 2 YR 1-8) but
// pays them identically to the equivalent RN Grade 2 year. Both scales are
// published here because the payslip classification differs.
// =============================================================================

import type { NursingStateData } from "./types";

const FWC_SOURCE = {
  title: "Nurses and Midwives (Victorian Public Sector) Single Interest Employer Agreement 2024-2028 (AE526693)",
  url: "https://www.fwc.gov.au/document-view/agreements/nurses-and-midwives-victorian-public-sector-single-interest-employer",
  publisher: "Fair Work Commission",
};

const EMPLOYER_SOURCE = {
  title: "Nurses & Midwives Enterprise Agreement 2024-2028 and rates of pay",
  url: "https://westerly.wh.org.au/nursing-midwifery/workforce/enterprise-agreements/",
  publisher: "Western Health (a covered Victorian public health service)",
};

export const VIC_NURSING_PAY: NursingStateData = {
  slug: "vic",
  code: "VIC",
  name: "Victoria",
  shortName: "VIC",
  employer: "Victorian public health services (single interest employer bargaining)",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: "vic-ea-2024",
      name: "Nurses and Midwives (Victorian Public Sector) Single Interest Employer Agreement 2024-2028",
      effectiveFrom: "first full pay period on or after 11 May 2026",
      nextIncrease: "first full pay period on or after 30 November 2026 (+1.06%)",
      tribunal: "Fair Work Commission",
      reference: "AE526693, matter AG2024/3737, approved 8 November 2024, [2024] FWCA 3908",
      source: FWC_SOURCE,
      note:
        "Victorian public health is in the federal system, unlike NSW and Queensland. Appendix 2A prints eight dated wage columns running to 29 November 2027.",
    },
  ],

  scales: [
    {
      classification: "Registered Nurse Grade 2",
      gradeCode: "RN Grade 2 Year 1–8",
      family: "registered",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Year 1 (graduate year)", weekly: 1619.0, hourly: 42.61 },
        { label: "Year 2", weekly: 1665.0, hourly: 43.82 },
        { label: "Year 3", weekly: 1717.0, hourly: 45.18 },
        { label: "Year 4", weekly: 1773.9, hourly: 46.68 },
        { label: "Year 5", weekly: 1836.9, hourly: 48.34 },
        { label: "Year 6", weekly: 1900.0, hourly: 50.0 },
        { label: "Year 7", weekly: 1968.2, hourly: 51.79 },
        { label: "Year 8", weekly: 2067.5, hourly: 54.41 },
      ],
      note:
        "Grade 2 is the base registered nurse grade in Victoria. Grade 1 is a historical classification and does not appear in the current wage table.",
    },
    {
      classification: "Midwife Grade 2",
      gradeCode: "Midwife Gr 2 Yr 1–8",
      family: "midwife",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Year 1 (graduate year)", weekly: 1619.0, hourly: 42.61 },
        { label: "Year 2", weekly: 1665.0, hourly: 43.82 },
        { label: "Year 3", weekly: 1717.0, hourly: 45.18 },
        { label: "Year 4", weekly: 1773.9, hourly: 46.68 },
        { label: "Year 5", weekly: 1836.9, hourly: 48.34 },
        { label: "Year 6", weekly: 1900.0, hourly: 50.0 },
        { label: "Year 7", weekly: 1968.2, hourly: 51.79 },
        { label: "Year 8", weekly: 2067.5, hourly: 54.41 },
      ],
      note:
        "Victoria gives midwives their own classification codes, but the base rate is identical to the equivalent RN Grade 2 year. Endorsed midwife and sole midwife allowances are paid on top under Appendix 2 Part 2.",
    },
    {
      classification: "Enrolled Nurse Level 1",
      gradeCode: "EN 1.1–1.6",
      family: "enrolled",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Year 1", weekly: 1291.6, hourly: 33.99 },
        { label: "Year 2", weekly: 1318.1, hourly: 34.69 },
        { label: "Year 3", weekly: 1344.2, hourly: 35.37 },
        { label: "Year 4", weekly: 1370.9, hourly: 36.08 },
        { label: "Year 5", weekly: 1423.5, hourly: 37.46 },
        { label: "Year 6", weekly: 1467.5, hourly: 38.62 },
      ],
    },
    {
      classification: "Enrolled Nurse Level 2 (Certificate IV)",
      gradeCode: "EN 2.1–2.6",
      family: "enrolled",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Year 1", weekly: 1387.1, hourly: 36.5 },
        { label: "Year 2", weekly: 1417.9, hourly: 37.31 },
        { label: "Year 3", weekly: 1449.2, hourly: 38.14 },
        { label: "Year 4", weekly: 1480.1, hourly: 38.95 },
        { label: "Year 5", weekly: 1511.0, hourly: 39.76 },
        { label: "Year 6", weekly: 1526.8, hourly: 40.18 },
      ],
      note:
        "The Diploma stream starts one pay point higher: EN Level 2 Diploma Year 1 is paid at the Certificate IV Year 3 rate of $1,449.20 a week and tops out at $1,542.00 (EN 2.7).",
    },
    {
      classification: "Enrolled Nurse Level 3",
      gradeCode: "EN 3.1–3.3",
      family: "enrolled",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Level 3 (SA)", weekly: 1619.4, hourly: 42.62 },
        { label: "Level 3 with 4 routes", weekly: 1677.4, hourly: 44.14 },
        { label: "Level 3 with 5 routes", weekly: 1704.5, hourly: 44.86 },
      ],
    },
    {
      classification: "Clinical Nurse Specialist / Clinical Midwife Specialist",
      gradeCode: "CAPR 1",
      family: "clinical",
      instrumentId: "vic-ea-2024",
      points: [{ label: "All years", weekly: 2151.5, hourly: 56.62 }],
    },
    {
      classification: "Clinical Nurse Consultant / Clinical Midwife Consultant",
      gradeCode: "CAPR 3.1–6",
      family: "clinical",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Grade A", weekly: 2340.3, hourly: 61.59 },
        { label: "Grade B", weekly: 2463.5, hourly: 64.83 },
        { label: "Grade C Year 1", weekly: 2586.5, hourly: 68.07 },
        { label: "Grade C Year 2", weekly: 2648.0, hourly: 69.68 },
        { label: "Grade D", weekly: 3079.5, hourly: 81.04 },
        { label: "Grade E", weekly: 3227.1, hourly: 84.92 },
      ],
    },
    {
      classification: "Associate Nurse Unit Manager / Associate Midwife Unit Manager",
      gradeCode: "ANUM / AMUM, NM 1.1–1.2",
      family: "management",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Year 1", weekly: 2315.7, hourly: 60.94 },
        { label: "Year 2", weekly: 2393.7, hourly: 62.99 },
      ],
    },
    {
      classification: "Nurse Unit Manager / Midwife Unit Manager",
      gradeCode: "NUM, NM 2–4",
      family: "management",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Level 1", weekly: 2636.8, hourly: 69.39 },
        { label: "Level 2", weekly: 2732.8, hourly: 71.92 },
        { label: "Level 3", weekly: 2829.1, hourly: 74.45 },
      ],
    },
    {
      classification: "Nurse Practitioner",
      gradeCode: "CAPR 7.1–7.2",
      family: "practitioner",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Year 1", weekly: 2870.4, hourly: 75.54 },
        { label: "Year 2", weekly: 2924.9, hourly: 76.97 },
      ],
    },
    {
      classification: "Registered Undergraduate Student of Nursing / of Midwifery",
      gradeCode: "RUSON / RUSOM",
      family: "support",
      instrumentId: "vic-ea-2024",
      points: [{ label: "Year 1", weekly: 1319.4, hourly: 34.72 }],
    },
    {
      classification: "Trainee Enrolled Nurse",
      gradeCode: "TEN 1–2",
      family: "support",
      instrumentId: "vic-ea-2024",
      points: [
        { label: "Year 1", weekly: 1090.4, hourly: 28.69 },
        { label: "Year 2", weekly: 1180.1, hourly: 31.06 },
      ],
    },
  ],

  penalties: [
    {
      instrumentId: "vic-ea-2024",
      clause: "clause 48 (weekends) and Appendix 2 Part 2 (shift allowances)",
      rows: [
        {
          label: "All ordinary hours, midnight Friday to midnight Sunday",
          value: "Time and a half",
          note: "Casuals are paid 187.5%. Victoria pays the same weekend rate on Saturday and Sunday — most states pay more on Sunday.",
        },
        { label: "Morning shift allowance", value: "$36.60 a shift", note: "Flat dollar amount, not a percentage." },
        { label: "Afternoon shift allowance", value: "$36.60 a shift" },
        { label: "Night shift allowance, Monday to Thursday", value: "$114.00 a shift" },
        { label: "Night shift allowance, Friday and Saturday", value: "$126.60 a shift" },
        { label: "Night shift allowance, Sunday", value: "$196.10 a shift" },
        { label: "Night shift allowance, casuals", value: "$101.40 a shift" },
        { label: "On call, Monday to Friday", value: "$86.90 per 12-hour period" },
        { label: "On call, Saturday", value: "$130.50 per 12-hour period" },
        { label: "On call, Sunday or weekday public holiday", value: "$147.90 per 12-hour period" },
      ],
      incomplete:
        "Allowance amounts are the FFPPOOA 11 May 2026 column of Appendix 2 Part 2 and step up again on 23 November 2026. Public holiday and overtime rates sit in clauses 49 and 56 and are not reproduced here.",
    },
  ],

  derivation: {
    annual: "weekly rate x 52, which is what 26 fortnightly pays comes to — the agreement publishes weekly and hourly, not annual",
  },

  notReproduced: [
    "District nurse, community health nurse and community health midwife scales",
    "Research nurse and research midwife levels 1 to 4",
    "Hospital in the Home / Post Acute Care nurse levels",
    "Nurse and midwife educator, ADON and DON campus-size grades (NM 5A–9A)",
    "Bank (casual pool) classifications, which mirror the permanent rates",
    "Qualification, RIPRN, sole midwife, hyperbaric, lead apron and uniform allowances",
  ],

  unverified: [
    "Public holiday penalty rates and overtime multipliers",
    "The Victorian Public Mental Health Services Enterprise Agreement 2024-2028, which covers mental health nurses on a separate scale",
  ],

  verifiedOn: "28 August 2026",

  intro:
    "Victorian public health nurses and midwives are covered by a single interest employer agreement approved by the Fair Work Commission — federal, unlike the NSW and Queensland state instruments. Victoria runs registered nurses on a Grade 2 Year 1 to Year 8 ladder and gives midwives their own classification codes at the same money. It is also the one state on this site whose agreement publishes an indicative hourly rate next to every weekly rate, so nothing below has to be worked out.",

  highlights: [
    "Victoria pays a flat dollar night shift allowance rather than a percentage — $114.00 a shift Monday to Thursday, $196.10 on Sunday nights.",
    "Weekend ordinary hours are time and a half from midnight Friday to midnight Sunday, the same rate on both days.",
    "Grade 2 Year 1 is the graduate year, and its rate does not move at every step — the agreement repeats it across consecutive wage columns.",
    "The current column is the first full pay period on or after 11 May 2026; the next rise lands on 30 November 2026.",
  ],

  extraSources: [EMPLOYER_SOURCE],
};
