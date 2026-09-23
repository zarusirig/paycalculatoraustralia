// =============================================================================
// Australian Capital Territory — ACT public sector nurses and midwives (H2).
//
// Source: ACT Public Sector Nursing and Midwifery Enterprise Agreement
// 2023–2026, approved by the Fair Work Commission on 6 August 2024
// (AG2024/2516), nominal expiry 31 March 2026. Schedule 1 — Nursing and
// Midwifery Classifications and Rates of Pay, printed pp. 180–185. Every figure
// is the last column, headed "1% + $1,000 from 04/12/2025" — the seventh and
// final increase in clause 11.2 (1% from the first full pay period on or after
// 1 December 2025, plus a $1,000 flat-rate increase).
// https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0007/2548897/ACTPS-Nursing-and-Midwifery-EA-2023-2026.pdf
//
// STATUS ON 24 SEPTEMBER 2026
// ---------------------------
// The ACTPS Employment Portal (last updated 10 September 2026) says 17 of the
// 18 ACTPS agreements, including this one, are under negotiation. No replacement
// nursing agreement or interim increase is published, so the 4 December 2025
// column is the rate in force.
//
// TRANSCRIPTION CHECK
// -------------------
// Every Schedule 1 row was re-derived column by column from clause 11.2 ($1,750,
// 1%, $1,750, 1.5%, 1% + $1,500, 1%, 1% + $1,000). All 61 priced rows reconcile
// to within $1, the agreement's own rounding.
//
// The ACT publishes annual salaries only — no weekly or hourly column.
// Read 24 September 2026.
// =============================================================================

import type { NursingStateData } from "./types";

const EA_SOURCE = {
  title: "ACT Public Sector Nursing and Midwifery Enterprise Agreement 2023–2026 — Schedule 1",
  url: "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0007/2548897/ACTPS-Nursing-and-Midwifery-EA-2023-2026.pdf",
  publisher: "ACT Government (Chief Minister, Treasury and Economic Development Directorate)",
};

const INSTRUMENT = "act-nm-ea-2023";

export const ACT_NURSING_PAY: NursingStateData = {
  slug: "act",
  code: "ACT",
  name: "Australian Capital Territory",
  shortName: "ACT",
  metaTitle: "ACT Nurse Pay Rates 2026 — Canberra Health Services Nursing Pay",
  h1: "ACT Nurse & Midwife Pay Rates 2026 — ACT Public Sector Nursing Pay Scales",
  employer: "ACT Public Service (Canberra Health Services and ACT Health)",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: INSTRUMENT,
      name: "ACT Public Sector Nursing and Midwifery Enterprise Agreement 2023–2026",
      effectiveFrom: "first full pay period on or after 1 December 2025 (4 December 2025)",
      nextIncrease:
        "none scheduled — the agreement passed its nominal expiry on 31 March 2026 and a replacement is under negotiation",
      tribunal: "Fair Work Commission",
      reference: "AG2024/2516",
      source: EA_SOURCE,
      note:
        "Schedule 1, final column \"1% + $1,000 from 04/12/2025\". Clause 11.2 lists the increases; clause 55.1 sets ordinary hours at an average of 38 a week.",
    },
  ],

  scales: [
    {
      classification: "Registered Nurse Level 1",
      gradeCode: "RN1",
      family: "registered",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Pay point 1", annual: 82993 },
        { label: "Pay point 2", annual: 85976 },
        { label: "Pay point 3", annual: 89260 },
        { label: "Pay point 4", annual: 93162 },
        { label: "Pay point 5", annual: 97068 },
        { label: "Pay point 6", annual: 100970 },
        { label: "Pay point 7", annual: 104873 },
        { label: "Pay point 8", annual: 108780 },
      ],
      note: "The entry registered nurse classification — eight annual pay points.",
    },
    {
      classification: "Midwife (RM) Level 1",
      gradeCode: "RM1",
      family: "midwife",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Pay point 1", annual: 82993 },
        { label: "Pay point 2", annual: 85976 },
        { label: "Pay point 3", annual: 89260 },
        { label: "Pay point 4", annual: 93162 },
        { label: "Pay point 5", annual: 97068 },
        { label: "Pay point 6", annual: 100970 },
        { label: "Pay point 7", annual: 104873 },
        { label: "Pay point 8", annual: 108780 },
      ],
      note:
        "Schedule 1 prints a separate midwife ladder. Every midwife level is paid the same as the registered nurse level of the same number and grade.",
    },
    {
      classification: "Enrolled Nurse Level 1",
      gradeCode: "EN1",
      family: "enrolled",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Pay point 1", annual: 75849 },
        { label: "Pay point 2", annual: 77041 },
        { label: "Pay point 3", annual: 78230 },
        { label: "Pay point 4", annual: 79421 },
        { label: "Pay point 5", annual: 80611 },
      ],
    },
    {
      classification: "Enrolled Nurse Level 2",
      gradeCode: "EN2",
      family: "enrolled",
      instrumentId: INSTRUMENT,
      points: [{ label: "Single rate", annual: 81806 }],
    },
    {
      classification: "Registered Nurse Level 2",
      gradeCode: "RN2",
      family: "clinical",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Pay point 1", annual: 112841 },
        { label: "Pay point 2", annual: 114970 },
        { label: "Pay point 3", annual: 117095 },
        { label: "Pay point 4", annual: 119223 },
      ],
    },
    {
      classification: "Registered Nurse Level 3",
      gradeCode: "RN3",
      family: "clinical",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Grade 1 pay point 1", annual: 128458 },
        { label: "Grade 1 pay point 2", annual: 130973 },
        { label: "Grade 1 pay point 3", annual: 133489 },
        { label: "Grade 2", annual: 144410 },
      ],
    },
    {
      classification: "Registered Nurse Level 4",
      gradeCode: "RN4",
      family: "management",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Grade 1", annual: 144410 },
        { label: "Grade 2", annual: 154206 },
        { label: "Grade 3", annual: 163994 },
      ],
    },
    {
      classification: "Registered Nurse Level 5",
      gradeCode: "RN5",
      family: "management",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Grade 1", annual: 144410 },
        { label: "Grade 2", annual: 154206 },
        { label: "Grade 3", annual: 163994 },
        { label: "Grade 4", annual: 175188 },
        { label: "Grade 5", annual: 194780 },
        { label: "Grade 6", annual: 214371 },
      ],
      note: "Levels 4 and 5 share the same rates at Grades 1 to 3; Level 5 adds Grades 4 to 6.",
    },
    {
      classification: "Nurse Practitioner",
      gradeCode: "NP",
      family: "practitioner",
      instrumentId: INSTRUMENT,
      points: [{ label: "Single rate", annual: 154206 }],
      note: "Paid the same as Registered Nurse Level 4 Grade 2.",
    },
    {
      classification: "Assistant in Nursing",
      gradeCode: "AIN",
      family: "support",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Pay point 1", annual: 65279 },
        { label: "Pay point 2", annual: 67279 },
      ],
    },
    {
      classification: "Undergraduate Student Nurse / Midwife",
      gradeCode: "Undergraduate",
      family: "support",
      instrumentId: INSTRUMENT,
      points: [{ label: "Single rate", annual: 69242 }],
    },
  ],

  penalties: [],

  derivation: {
    hourly:
      "not shown — Schedule 1 publishes annual salaries only, and this page does not convert them to an hourly rate",
  },

  notReproduced: [
    "Midwife (RM) Levels 2 to 5 — Schedule 1 prints them as a separate ladder, but every figure is identical to the Registered Nurse level of the same number and grade shown here.",
  ],

  unverified: [
    "Shift, weekend and public holiday penalty rates — the agreement sets them, but they have not been transcribed for this page.",
    "An hourly rate for any ACT classification — the agreement publishes annual salaries only.",
    "Rates under a replacement agreement — the 2023–2026 agreement is being renegotiated and no replacement or interim increase had been published when this page was checked on 24 September 2026.",
  ],

  verifiedOn: "24 September 2026",

  intro:
    "ACT public sector nurses and midwives are paid under the ACT Public Sector Nursing and Midwifery Enterprise Agreement 2023–2026, approved by the Fair Work Commission. The rates below are its final column, in force from 4 December 2025 after a 1% rise plus a $1,000 flat-rate increase. The agreement passed its nominal expiry on 31 March 2026 and is being renegotiated; until a replacement is approved these remain the rates paid. The ACT publishes annual salaries only, and pays its midwife ladder exactly the same as the nursing ladder.",

  highlights: [
    "Registered Nurse Level 1 starts at $82,993 and runs to $108,780 across eight pay points, from 4 December 2025.",
    "Enrolled nurses start at $75,849 at Level 1 and reach $81,806 at Level 2.",
    "The ACT's last pay rise was 1% plus a flat $1,000 on 4 December 2025 — the flat amount gives lower-paid staff a bigger percentage rise.",
    "Midwives are paid the same as registered nurses at the same level and grade — Midwife Level 1 is also $82,993 to $108,780.",
    "The agreement's nominal expiry was 31 March 2026 and a replacement is being negotiated, so watch for a rate change.",
  ],

  extraSources: [
    {
      title: "Enterprise Agreements — ACTPS Employment Portal",
      url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements",
      publisher: "ACT Government",
    },
    {
      title: "Enterprise agreements — ACT Government health careers",
      url: "https://www.act.gov.au/work-with-act-government/act-government-health-careers/enterprise-agreements",
      publisher: "ACT Government",
    },
  ],
};
