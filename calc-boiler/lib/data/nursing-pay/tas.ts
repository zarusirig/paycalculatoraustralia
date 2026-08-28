// =============================================================================
// Tasmania — Department of Health nurses and midwives.
//
// Source: Department of Health Tasmania, "Nurses and Midwives salary rates",
// full-time-equivalent award salaries effective from 1 December 2025.
// https://www.health.tas.gov.au/careers/employee-benefits/salary-rates/nurses-and-midwives-salary-rates
// Read 28 August 2026.
//
// AN INSTRUMENT DISCREPANCY WE DO NOT PAPER OVER
// ----------------------------------------------
// The Department's salary page says the rates are aligned to the "Nurses and
// Midwives (Tasmanian State Service) Award" and the "Nurses and Midwives
// (Tasmanian State Service) Agreement 2019". The Tasmanian Industrial
// Commission's list of CURRENT public sector agreements instead shows the
// Nurses and Midwives (Tasmanian State Service) Agreement 2023 (matter T15086),
// with the 2019 agreement filed under previous agreements.
//
// We publish the Department's figures, because the Department is the employer
// and prints an explicit effective date, and we link both instruments so a
// reader can check which one their payslip cites. We do not assert which
// agreement produced the 1 December 2025 rates, because neither source says.
//
// Tasmania publishes an annual FTE salary only — no weekly and no hourly rate.
// Tasmania's grade numbering is also unlike every other state: the registered
// nurse ladder STARTS at Grade 3, because Grades 1 and 2 are the undergraduate
// and enrolled nurse classifications.
// =============================================================================

import type { NursingStateData } from "./types";

const DOH_SOURCE = {
  title: "Nurses and Midwives salary rates (effective 1 December 2025)",
  url: "https://www.health.tas.gov.au/careers/employee-benefits/salary-rates/nurses-and-midwives-salary-rates",
  publisher: "Department of Health, Tasmania",
};

export const TAS_NURSING_PAY: NursingStateData = {
  slug: "tas",
  code: "TAS",
  name: "Tasmania",
  shortName: "TAS",
  employer: "Department of Health Tasmania (Tasmanian State Service)",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: "tas-doh-rates",
      name: "Nurses and Midwives (Tasmanian State Service) Award and Agreement — salary rates published by the Department of Health",
      effectiveFrom: "1 December 2025",
      tribunal: "Tasmanian Industrial Commission",
      source: DOH_SOURCE,
      note:
        "The Department's page names the 2019 agreement. The Tasmanian Industrial Commission lists the Nurses and Midwives (Tasmanian State Service) Agreement 2023 (T15086) as the current registered agreement. Both are linked below.",
    },
    {
      id: "tas-tic-2023",
      name: "Nurses and Midwives (Tasmanian State Service) Agreement 2023",
      effectiveFrom: "registered by the Tasmanian Industrial Commission (matter T15086)",
      tribunal: "Tasmanian Industrial Commission",
      reference: "T15086 of 2023",
      source: {
        title: "Nurses and Midwives (Tasmanian State Service) Agreement 2023",
        url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0011/738866/Nurses-and-Midwives-Tasmanian-State-Service-Agreement-2023.pdf",
        publisher: "Tasmanian Industrial Commission",
      },
      note: "Listed by the Commission under current public sector agreements. No rates are reproduced from it on this page.",
    },
  ],

  scales: [
    {
      classification: "Registered Nurse Grade 3",
      gradeCode: "RN Grade 3",
      family: "registered",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Year 1", annual: 80524 },
        { label: "Year 2", annual: 83346 },
        { label: "Year 3", annual: 86715 },
        { label: "Year 4", annual: 90081 },
        { label: "Year 5", annual: 93453 },
        { label: "Year 6", annual: 96820 },
        { label: "Year 7", annual: 100196 },
        { label: "Year 8", annual: 101318 },
        { label: "Year 9", annual: 102295 },
      ],
      note:
        "Grade 3 is the entry registered nurse grade in Tasmania. Grades 1 and 2 are undergraduate and enrolled nurse classifications, which is why the RN ladder starts at 3.",
    },
    {
      classification: "Registered Nurse Grade 4",
      gradeCode: "RN Grade 4",
      family: "clinical",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Year 1 (application for progression)", annual: 102439 },
        { label: "Year 2", annual: 104685 },
        { label: "Year 3 (formal capability review)", annual: 106935 },
        { label: "Year 4", annual: 108131 },
        { label: "Year 5", annual: 109175 },
      ],
      note:
        "Progression into Grade 4 is by application, and Year 3 carries a formal capability review — Tasmania gates its steps rather than paying them automatically.",
    },
    {
      classification: "Registered Nurse Grade 5",
      gradeCode: "RN Grade 5",
      family: "clinical",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Year 1", annual: 109767 },
        { label: "Year 2", annual: 111425 },
        { label: "Year 3", annual: 113669 },
        { label: "Year 4", annual: 114700 },
        { label: "Year 5", annual: 115813 },
      ],
    },
    {
      classification: "Registered Nurse Grade 6",
      gradeCode: "RN Grade 6",
      family: "management",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Year 1", annual: 118297 },
        { label: "Year 2", annual: 120928 },
        { label: "Year 3", annual: 123562 },
        { label: "Year 4", annual: 124333 },
        { label: "Year 5", annual: 125543 },
      ],
    },
    {
      classification: "Registered Nurse Grade 7",
      gradeCode: "RN Grade 7a and 7b",
      family: "management",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Grade 7a Year 0", annual: 126036 },
        { label: "Grade 7a Year 1", annual: 128844 },
        { label: "Grade 7a Year 2", annual: 131650 },
        { label: "Grade 7a Year 3", annual: 132932 },
        { label: "Grade 7b Year 1", annual: 134109 },
        { label: "Grade 7b Year 2", annual: 136570 },
        { label: "Grade 7b Year 3", annual: 139028 },
        { label: "Grade 7b Year 4", annual: 140384 },
      ],
    },
    {
      classification: "Registered Nurse Grade 8",
      gradeCode: "RN Grade 8",
      family: "management",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Level 1", annual: 141509 },
        { label: "Level 2", annual: 142632 },
        { label: "Level 3", annual: 148470 },
        { label: "Level 4", annual: 154301 },
        { label: "Level 5", annual: 164681 },
      ],
    },
    {
      classification: "Registered Nurse Grade 9",
      gradeCode: "RN Grade 9",
      family: "management",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Level 1", annual: 182734 },
        { label: "Level 2", annual: 192563 },
        { label: "Level 3", annual: 204381 },
      ],
    },
    {
      classification: "Enrolled Nurse",
      gradeCode: "EN Grade 1–2",
      family: "enrolled",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Grade 1 Year G", annual: 73109 },
        { label: "Grade 2 Year 1", annual: 75205 },
        { label: "Grade 2 Year 2", annual: 77204 },
        { label: "Grade 2 Year 3", annual: 79304 },
        { label: "Grade 2 Year 4", annual: 80524 },
      ],
      note: "Enrolled Nurse Grade 2 Year 4 tops out at exactly the Registered Nurse Grade 3 Year 1 rate.",
    },
    {
      classification: "Specialist Enrolled Nurse",
      family: "enrolled",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Year 1", annual: 83346 },
        { label: "Year 2", annual: 84469 },
        { label: "Year 3", annual: 85592 },
        { label: "Year 4", annual: 86715 },
      ],
    },
    {
      classification: "Community Health and Family Child Health Nurse",
      gradeCode: "RN CH/FCH G3–G4",
      family: "clinical",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Grade 3 Year 4", annual: 90081 },
        { label: "Grade 3 Year 5 (capability assessment / advanced progression point)", annual: 93453 },
        { label: "Grade 3 Year 6", annual: 96820 },
        { label: "Grade 3 Year 7", annual: 100196 },
        { label: "Grade 3 Year 8", annual: 101318 },
        { label: "Grade 3 Year 9", annual: 102295 },
        { label: "Grade 4 Year 1 (application for progression)", annual: 102439 },
        { label: "Grade 4 Year 2", annual: 104685 },
        { label: "Grade 4 Year 3 (formal capability review)", annual: 106935 },
        { label: "Grade 4 Year 4", annual: 108131 },
        { label: "Grade 4 Year 5", annual: 109175 },
      ],
      note:
        "This scale starts at Grade 3 Year 4 — community and family child health nurses enter above the general RN entry point.",
    },
    {
      classification: "Registered Undergraduate Nurse",
      gradeCode: "Grade 1",
      family: "support",
      instrumentId: "tas-doh-rates",
      points: [
        { label: "Year 1", annual: 66935 },
        { label: "Year 2", annual: 68999 },
        { label: "Year 3", annual: 71068 },
        { label: "Year 4", annual: 73138 },
      ],
    },
  ],

  penalties: [],

  derivation: {
    hourly:
      "not shown — the Department publishes a full-time-equivalent annual salary only, with no hourly rate and no prescribed divisor",
  },

  notReproduced: [],

  unverified: [
    "Shift, weekend and public holiday penalty rates — the Department's salary page publishes base salaries only, and the agreement text has not been read for this page",
    "An hourly rate for any Tasmanian classification",
    "A separate nurse practitioner rate — the Department's salary page does not publish one, and we will not guess which grade it maps to",
    "A separate midwifery scale — Tasmania's published rates cover nurses and midwives together without distinguishing them",
  ],

  verifiedOn: "28 August 2026",

  intro:
    "Tasmania's Department of Health publishes full-time-equivalent salaries for nurses and midwives, effective 1 December 2025. Tasmania numbers its grades differently from every other state: the registered nurse ladder starts at Grade 3, because Grades 1 and 2 are the undergraduate and enrolled nurse classifications. Progression is also gated — the step into Grade 4 requires an application, and Year 3 of Grade 4 carries a formal capability review.",

  highlights: [
    "The registered nurse scale starts at Grade 3, not Grade 1 — Grades 1 and 2 are undergraduate and enrolled nurse.",
    "Registered Nurse Grade 3 Year 1 is $80,524 a year, and the grade runs to $102,295 at Year 9.",
    "Enrolled Nurse Grade 2 Year 4 lands on exactly the Registered Nurse Grade 3 Year 1 salary.",
    "Progression into Grade 4 requires an application and Year 3 requires a formal capability review, so the ladder is not automatic.",
    "The Department's page names the 2019 agreement while the Tasmanian Industrial Commission lists a 2023 agreement as current — check which one your payslip cites.",
  ],
};
