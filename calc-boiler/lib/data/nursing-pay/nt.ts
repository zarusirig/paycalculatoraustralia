// =============================================================================
// Northern Territory — NT Public Sector nurses and midwives (H2).
//
// Source: Northern Territory Public Sector Nurses and Midwives' 2022–2026
// Enterprise Agreement, approved by the Fair Work Commission on 2 August 2023
// (AG2023/2310) to operate from 9 August 2023, nominal expiry 9 August 2026. Schedule 3, "TABLE 1: ANNUAL
// RATES OF PAY", column "Salary Rates Effective 19.08.2025 $" — the fourth and
// last 3% increase in clause 19.1(d) (first full pay period on or after
// 9 August 2025).
// https://ocpe.nt.gov.au/media/documents/nt-public-sector-employment-information-about-ntps-employment/information-about-ntps-employment/ntps-nurses-and-midwives-2022-2026-enterprise-agreement.PDF
//
// SECOND SOURCE
// -------------
// The Office of the Commissioner for Public Employment's "Nurses and midwives —
// NTPS rates of pay" page, headed "Rates effective 19 August 2025", prints the
// same figure for every row below.
// https://ocpe.nt.gov.au/employment-terms-and-conditions/rates-of-pay/nurses-and-midwives
//
// STATUS ON 24 SEPTEMBER 2026
// ---------------------------
// The agreement passed its nominal expiry on 9 August 2026. Bargaining began
// in March 2026 (OCPE Bulletins 1–3) and on 6 August 2026 the Commissioner made
// an offer (Bulletin 4, issued 7 August 2026): 3% a year for four years, the
// first from 13 August 2026 "on the proviso the offer is approved through a
// ballot of employees", plus a restructure of the Nurse 2 scale. No replacement
// agreement is recorded as approved, so the 19 August 2025 column remains the
// rate in force.
//
// ONE DISCREPANCY WE DO NOT PAPER OVER
// ------------------------------------
// Bulletin 4's table of "Current Rates" shows Nurse 2.1 at $81,479. Both the
// agreement's Table 1 and the OCPE rates page show Nurse 2.1 at $80,665, so
// that is the figure published here, and the difference is flagged on the page.
//
// The NT publishes annual salaries only.
// Read 24 September 2026.
// =============================================================================

import type { NursingStateData } from "./types";

const EA_SOURCE = {
  title: "NT Public Sector Nurses and Midwives' 2022–2026 Enterprise Agreement — Schedule 3, Table 1",
  url: "https://ocpe.nt.gov.au/media/documents/nt-public-sector-employment-information-about-ntps-employment/information-about-ntps-employment/ntps-nurses-and-midwives-2022-2026-enterprise-agreement.PDF",
  publisher: "Office of the Commissioner for Public Employment (NT)",
};

const INSTRUMENT = "nt-nm-ea-2022";

export const NT_NURSING_PAY: NursingStateData = {
  slug: "nt",
  code: "NT",
  name: "Northern Territory",
  shortName: "NT",
  metaTitle: "NT Nurse Pay Rates 2026 — NT Health Nursing & Midwifery Salary",
  h1: "NT Nurse & Midwife Pay Rates 2026 — NT Public Sector Nursing Pay Scales",
  employer: "NT Health (Northern Territory Public Sector)",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: INSTRUMENT,
      name: "Northern Territory Public Sector Nurses and Midwives' 2022–2026 Enterprise Agreement",
      effectiveFrom: "19 August 2025 (first full pay period on or after 9 August 2025)",
      nextIncrease:
        "none in force — the agreement passed its nominal expiry on 9 August 2026; an offer of 3% a year from 13 August 2026 depends on a successful ballot and approval of a new agreement",
      tribunal: "Fair Work Commission",
      reference: "AG2023/2310",
      source: EA_SOURCE,
      note:
        "Schedule 3, Table 1, column \"Salary Rates Effective 19.08.2025\". Clause 19.1 lists four 3% increases from 9 August 2022 to 9 August 2025.",
    },
  ],

  scales: [
    {
      classification: "Nurse 2 (Registered Nurse / Registered Midwife)",
      gradeCode: "Nurse 2",
      family: "registered",
      instrumentId: INSTRUMENT,
      points: [
        { label: "2.1", annual: 80665 },
        { label: "2.2", annual: 85008 },
        { label: "2.3", annual: 89350 },
        { label: "2.4", annual: 93693 },
        { label: "2.5", annual: 98754 },
        { label: "2.6", annual: 102554 },
        { label: "2.7", annual: 106722 },
        { label: "2.8", annual: 107800 },
      ],
      note:
        "The entry registered nurse and registered midwife classification. The NT pays nurses and midwives on one combined scale.",
    },
    {
      classification: "Nurse 1 (Enrolled Nurse)",
      gradeCode: "Nurse 1",
      family: "enrolled",
      instrumentId: INSTRUMENT,
      points: [
        { label: "1.1", annual: 71359 },
        { label: "1.2", annual: 73568 },
        { label: "1.3", annual: 75854 },
        { label: "1.4", annual: 78203 },
        { label: "1.5", annual: 80665 },
        { label: "1.6", annual: 81479 },
      ],
    },
    {
      classification: "Nurse 1 Advanced Practice",
      gradeCode: "Nurse 1 AP",
      family: "enrolled",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Year 1", annual: 82725 },
        { label: "Year 2", annual: 83561 },
      ],
    },
    {
      classification: "Nurse 3 (Registered Nurse / Registered Midwife)",
      gradeCode: "Nurse 3",
      family: "clinical",
      instrumentId: INSTRUMENT,
      points: [
        { label: "3.1", annual: 111174 },
        { label: "3.2", annual: 115625 },
        { label: "3.3", annual: 118784 },
        { label: "3.4", annual: 119984 },
      ],
    },
    {
      classification: "Nurse 4 (Registered Nurse / Registered Midwife)",
      gradeCode: "Nurse 4",
      family: "clinical",
      instrumentId: INSTRUMENT,
      points: [
        { label: "4.1", annual: 123717 },
        { label: "4.2", annual: 128048 },
        { label: "4.3", annual: 132915 },
        { label: "4.4", annual: 134257 },
      ],
    },
    {
      classification: "Nurse 5 (Registered Nurse / Registered Midwife)",
      gradeCode: "Nurse 5",
      family: "management",
      instrumentId: INSTRUMENT,
      points: [
        { label: "5.1", annual: 136235 },
        { label: "5.2", annual: 141957 },
        { label: "5.3", annual: 143391 },
      ],
    },
    {
      classification: "Nurse 6 (Registered Nurse / Registered Midwife / Nurse Practitioner)",
      gradeCode: "Nurse 6",
      family: "practitioner",
      instrumentId: INSTRUMENT,
      points: [
        { label: "6.1", annual: 149765 },
        { label: "6.2", annual: 155757 },
        { label: "6.3", annual: 157329 },
      ],
      note: "The agreement's Table 1 places nurse practitioners in Nurse 6.",
    },
    {
      classification: "Nurse 7 (Registered Nurse / Registered Midwife)",
      gradeCode: "Nurse 7",
      family: "management",
      instrumentId: INSTRUMENT,
      points: [
        { label: "7.1", annual: 168246 },
        { label: "7.2", annual: 174279 },
        { label: "7.3", annual: 176039 },
      ],
    },
    {
      classification: "Nurse 8 (Registered Nurse / Registered Midwife)",
      gradeCode: "Nurse 8",
      family: "management",
      instrumentId: INSTRUMENT,
      points: [
        { label: "8.1", annual: 181233 },
        { label: "8.2", annual: 187306 },
        { label: "8.3", annual: 189196 },
      ],
    },
    {
      classification: "Enrolled Nurse in Training and Registered Nurse/Midwife in Training",
      gradeCode: "In training",
      family: "support",
      instrumentId: INSTRUMENT,
      points: [
        { label: "Enrolled Nurse in Training (75% of Nurse 1)", annual: 53523 },
        { label: "Registered Nurse/Midwife in Training (75% of Nurse 2)", annual: 60501 },
      ],
    },
  ],

  penalties: [],

  derivation: {
    hourly:
      "not shown — Table 1 publishes annual salaries only; the agreement derives fortnightly pay as annual salary x 12 / 313 but prints no hourly column, so this page does not convert",
  },

  notReproduced: [
    "RUSON/RUSOM (registered undergraduate student of nursing/midwifery) rates in Tables 2 and 3.",
  ],

  unverified: [
    "Shift, weekend and public holiday penalty rates, and the income-related allowances in Table 4 — not transcribed for this page.",
    "An hourly rate for any NT classification — the agreement publishes annual salaries only.",
    "Rates under a replacement agreement — the Commissioner's 6 August 2026 offer (3% a year, first increase from 13 August 2026, and a restructured Nurse 2 scale) depends on a ballot and Fair Work Commission approval, and no new agreement was recorded as approved when this page was checked on 24 September 2026.",
    "Bulletin 4 lists the \"current\" Nurse 2.1 rate as $81,479, while the agreement's Table 1 and the OCPE rates page both show $80,665. We publish $80,665; check your payslip if you are at Nurse 2.1.",
  ],

  verifiedOn: "24 September 2026",

  intro:
    "Northern Territory public sector nurses and midwives are paid under the NT Public Sector Nurses and Midwives' 2022–2026 Enterprise Agreement. The rates below took effect on 19 August 2025, the last of four 3% rises. Registered nurses and midwives share one scale, Nurse 2 to Nurse 8, and enrolled nurses are Nurse 1. The agreement passed its nominal expiry on 9 August 2026; the NT Government offered 3% a year for four years on 6 August 2026, but that only takes effect if employees vote for a new agreement and the Fair Work Commission approves it.",

  highlights: [
    "Nurse 2 (registered nurse or midwife) starts at $80,665 and reaches $107,800 at pay point 2.8, from 19 August 2025.",
    "Enrolled nurses (Nurse 1) are paid $71,359 to $81,479, and Nurse 1 Advanced Practice up to $83,561.",
    "Nurse practitioners sit in Nurse 6, paid $149,765 to $157,329.",
    "The agreement's nominal expiry was 9 August 2026. The government's 6 August 2026 offer proposes 3% a year from 13 August 2026 if a new agreement is voted up.",
    "The NT pays nurses and midwives on one combined scale rather than separate ladders.",
  ],

  extraSources: [
    {
      title: "Nurses and midwives — NTPS rates of pay (rates effective 19 August 2025)",
      url: "https://ocpe.nt.gov.au/employment-terms-and-conditions/rates-of-pay/nurses-and-midwives",
      publisher: "Office of the Commissioner for Public Employment (NT)",
    },
    {
      title: "Bulletin 4 — Offer for a new Enterprise Agreement (7 August 2026)",
      url: "https://ocpe.nt.gov.au/employment-terms-and-conditions/current-enterprise-agreements/enterprise-agreement-negotiations/ntps-nurses-and-midwives-enterprise-agreement/bulletin-4",
      publisher: "Office of the Commissioner for Public Employment (NT)",
    },
  ],
};
