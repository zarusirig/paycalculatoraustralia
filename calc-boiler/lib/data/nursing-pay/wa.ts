// =============================================================================
// Western Australia — WA health system nurses, midwives, enrolled nurses.
//
// WA is the one state on this site where two different agreements cover the
// nursing workforce, and they publish in different units:
//
//   - Registered nurses, midwives, enrolled mental health nurses and enrolled
//     (mothercraft) nurses: WA Health System - ANF Industrial Agreement 2024,
//     clause 17. Publishes ANNUAL rates. Column "On and from 12 October 2025".
//   - Enrolled nurses and assistants in nursing generally: WA Health System -
//     United Workers Union (WA) Industrial Agreement 2024, clause 24.
//     Publishes WEEKLY rates. Column "7 October 2025".
//
// Both read 28 August 2026 from the PDFs published by the Department of Health
// WA. Neither publishes an hourly rate, so this page does not show one — the
// ordinary hours are an average of 38 a week under both agreements, but no
// hourly divisor is prescribed and we will not invent one.
//
// NURSE PRACTITIONERS. Clause 17(7) does not give nurse practitioners their own
// rates. It says a nurse practitioner "will be classified as a Senior
// Registered Nurse" at a level the employer sets by work value assessment, and
// "will be not less than Senior Registered Nurse/Midwife Level 3". That floor is
// published here as a floor, not as a salary.
// =============================================================================

import type { NursingStateData } from "./types";

const ANF_SOURCE = {
  title:
    "WA Health System – Australian Nursing Federation – Registered Nurses, Midwives, Enrolled (Mental Health) and Enrolled (Mothercraft) Nurses – Industrial Agreement 2024",
  url: "https://www.health.wa.gov.au/~/media/Corp/Documents/Health-for/Industrial-relations/Awards-and-agreements/Nurses-Registered-and-Enrolled-Mental-Health/WA-Health-ANF-Agreement-2024.pdf",
  publisher: "Department of Health, Western Australia",
};

const UWU_SOURCE = {
  title:
    "WA Health System – United Workers Union (WA) – Enrolled Nurses, Assistants in Nursing, Aboriginal Health Workers, Ethnic Health Workers and Aboriginal Health Practitioners Industrial Agreement 2024",
  url: "https://www.health.wa.gov.au/~/media/Corp/Documents/Health-for/Industrial-relations/Awards-and-agreements/Enrolled-nurses/WA-Health-System--United-Workers-Union-WA--Enrolled-Nurses-Assistants-in-Nursing-Aboriginal-Health-W.pdf",
  publisher: "Department of Health, Western Australia",
};

export const WA_NURSING_PAY: NursingStateData = {
  slug: "wa",
  code: "WA",
  name: "Western Australia",
  shortName: "WA",
  employer: "WA health service providers (WA Country Health Service, East/North/South Metropolitan and Child and Adolescent Health Services)",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: "wa-anf-2024",
      name:
        "WA Health System – Australian Nursing Federation – Registered Nurses, Midwives, Enrolled (Mental Health) and Enrolled (Mothercraft) Nurses – Industrial Agreement 2024",
      effectiveFrom: "12 October 2025",
      nextIncrease: "12 October 2026",
      tribunal: "Western Australian Industrial Relations Commission",
      source: ANF_SOURCE,
      note: "Clause 17 prints four columns: existing rate, 12 October 2024, 12 October 2025 and 12 October 2026.",
    },
    {
      id: "wa-uwu-2024",
      name:
        "WA Health System – United Workers Union (WA) – Enrolled Nurses, Assistants in Nursing, Aboriginal Health Workers, Ethnic Health Workers and Aboriginal Health Practitioners Industrial Agreement 2024",
      effectiveFrom: "7 October 2025",
      nextIncrease: "7 October 2026 (a flat $65 a week)",
      tribunal: "Western Australian Industrial Relations Commission",
      source: UWU_SOURCE,
      note:
        "Clause 24 publishes weekly rates and increases enrolled nurses and assistants in nursing by a flat dollar amount rather than a percentage.",
    },
  ],

  scales: [
    {
      classification: "Registered Nurse/Midwife",
      gradeCode: "RN/M Level 1.1–2.4",
      family: "registered",
      instrumentId: "wa-anf-2024",
      points: [
        { label: "Level 1.1", annual: 82945 },
        { label: "Level 1.2", annual: 85815 },
        { label: "Level 1.3", annual: 88800 },
        { label: "Level 1.4", annual: 92413 },
        { label: "Level 1.5", annual: 96151 },
        { label: "Level 1.6", annual: 99509 },
        { label: "Level 1.7", annual: 103001 },
        { label: "Level 1.8", annual: 106630 },
        { label: "Level 2.1", annual: 109599 },
        { label: "Level 2.2", annual: 111584 },
        { label: "Level 2.3", annual: 113613 },
        { label: "Level 2.4", annual: 115682 },
      ],
      note:
        "A registered nurse or midwife doing a post-basic course leading to registration is paid at Level 1.2 or higher (clause 17(8)).",
    },
    {
      classification: "Senior Registered Nurse/Midwife",
      gradeCode: "SRN/M Level 1–10",
      family: "clinical",
      instrumentId: "wa-anf-2024",
      points: [
        { label: "Level 1", annual: 129203 },
        { label: "Level 2", annual: 133185 },
        { label: "Level 3", annual: 137294 },
        { label: "Level 4", annual: 141535 },
        { label: "Level 5", annual: 145914 },
        { label: "Level 6", annual: 154854 },
        { label: "Level 7", annual: 164360 },
        { label: "Level 8", annual: 174470 },
        { label: "Level 9", annual: 184080 },
        { label: "Level 10", annual: 194235 },
      ],
      note:
        "WA does not run separate clinical nurse, clinical nurse consultant and nurse unit manager scales the way NSW does. Those roles are all Senior Registered Nurse/Midwife levels, with the level set by the position.",
    },
    {
      classification: "Nurse Practitioner",
      family: "practitioner",
      instrumentId: "wa-anf-2024",
      points: [
        {
          label: "Floor: not less than Senior Registered Nurse/Midwife Level 3",
          annual: 137294,
          note:
            "Clause 17(7) sets a floor, not a rate. The employer assesses the work value of the scope of practice and picks the SRN/M level. This is the minimum that assessment can land on.",
        },
      ],
    },
    {
      classification: "Enrolled Nurse",
      gradeCode: "EN Level 1–4, ASEN 1–3",
      family: "enrolled",
      instrumentId: "wa-uwu-2024",
      points: [
        { label: "Level 1", weekly: 1461.76 },
        { label: "Level 2", weekly: 1488.21 },
        { label: "Level 3", weekly: 1514.65 },
        { label: "Level 4", weekly: 1541.11 },
        { label: "Advanced Skill Enrolled Nurse 1", weekly: 1594.01 },
        { label: "Advanced Skill Enrolled Nurse 2", weekly: 1646.9 },
        { label: "Advanced Skill Enrolled Nurse 3", weekly: 1699.83 },
      ],
      note:
        "Enrolled nurse levels 1 to 4 are years of employment as an enrolled nurse. Advanced skill requires a relevant post-enrolment qualification and at least three years' experience.",
    },
    {
      classification: "Enrolled Mental Health Nurse",
      gradeCode: "EMHN pay point 1–6",
      family: "enrolled",
      instrumentId: "wa-anf-2024",
      points: [
        { label: "Pay point 1", annual: 72902 },
        { label: "Pay point 2", annual: 74337 },
        { label: "Pay point 3", annual: 75771 },
        { label: "Pay point 4", annual: 77205 },
        { label: "Pay point 5", annual: 78640 },
        { label: "Pay point 6", annual: 80075 },
      ],
      note:
        "Enrolled mental health nurses sit under the ANF agreement, not the enrolled nurse agreement, and are paid an annual salary rather than a weekly rate.",
    },
    {
      classification: "Enrolled Nurse (Mothercraft Nursing only)",
      family: "enrolled",
      instrumentId: "wa-anf-2024",
      points: [
        { label: "Year 1", annual: 69076 },
        { label: "Year 2", annual: 70132 },
        { label: "Year 3", annual: 71672 },
        { label: "Year 4", annual: 73280 },
        { label: "Year 5", annual: 74858 },
      ],
      note:
        "A closed classification: registration is limited to mothercraft nursing and the holder cannot administer medicines.",
    },
    {
      classification: "Assistant in Nursing",
      family: "support",
      instrumentId: "wa-uwu-2024",
      points: [
        { label: "Year 1", weekly: 1329.54 },
        { label: "Year 2", weekly: 1355.96 },
        { label: "Year 3", weekly: 1382.42 },
      ],
    },
  ],

  penalties: [
    {
      instrumentId: "wa-anf-2024",
      clause: "clause 26 — Shift Work Allowances",
      rows: [
        {
          label: "Afternoon shift",
          value: "+15%",
          note: "A complete rostered shift starting no earlier than 1200 and finishing after 1800 on a weekday.",
        },
        {
          label: "Night shift",
          value: "+35%",
          note: "A complete rostered night shift between 1830 and 0730 on a weekday. The highest night loading of any state on this site.",
        },
        { label: "Saturday ordinary hours", value: "+50%", note: "Midnight Friday to midnight Saturday, on actual hours worked." },
        { label: "Sunday ordinary hours", value: "+75%", note: "Midnight Saturday to midnight Sunday, on actual hours worked." },
        {
          label: "Day-duty nurse called in on a Sunday",
          value: "Double time",
          note: "Where the employee is normally rostered Monday to Friday day duty (clause 26(7)).",
        },
      ],
      incomplete:
        "Weekend rates replace the afternoon and night loadings rather than stacking on them. Clause 26 does not apply to community-setting nurses unless a clause 28(28)(d) agreement is in place. Public holiday and overtime rates are in separate clauses and are not reproduced here.",
    },
  ],

  derivation: {
    hourly:
      "not shown — neither WA agreement publishes an hourly rate, and neither prescribes a divisor for converting the salary, so this page does not print one",
  },

  notReproduced: [
    "Schedule C scale of allowances (district, travel, uniform, qualification)",
    "Aboriginal health worker, ethnic health worker and Aboriginal health practitioner rates in the United Workers Union agreement",
    "The Exceptional Matters Order at Schedule A of the ANF agreement",
  ],

  unverified: [
    "An hourly rate for any WA classification — neither agreement publishes one",
    "The nurse practitioner's actual level, which the employer sets by work value assessment case by case",
    "Public holiday penalty rates and overtime multipliers",
  ],

  verifiedOn: "28 August 2026",

  intro:
    "Western Australia splits its nursing workforce across two industrial agreements registered with the WA Industrial Relations Commission. Registered nurses, midwives and enrolled mental health nurses sit under the ANF agreement, which pays an annual salary. Enrolled nurses and assistants in nursing sit under the United Workers Union agreement, which pays a weekly rate. WA also folds the clinical nurse, consultant and unit manager roles into one Senior Registered Nurse/Midwife ladder rather than giving each its own scale.",

  highlights: [
    "WA pays the highest night shift loading of the six states on this site: 35% on a weekday night shift.",
    "Saturday is +50% and Sunday +75%, and those replace the shift loading rather than adding to it.",
    "Registered nurses and midwives progress through Level 1.1 to 2.4, then into Senior Registered Nurse/Midwife Levels 1 to 10.",
    "Nurse practitioners have no separate rate: the agreement classifies them as Senior Registered Nurses at a level assessed on work value, floored at Level 3.",
    "Enrolled nurses get a flat $65-a-week rise on 7 October 2026, not a percentage.",
  ],
};
