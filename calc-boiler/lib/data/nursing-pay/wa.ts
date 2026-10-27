// =============================================================================
// Western Australia — WA health system nurses, midwives, enrolled nurses.
//
// WA is the one state on this site where two different agreements cover the
// nursing workforce, and they publish in different units:
//
//   - Registered nurses, midwives, enrolled mental health nurses and enrolled
//     (mothercraft) nurses: WA Health System - ANF Industrial Agreement 2024,
//     clause 17. Publishes ANNUAL rates. Column "On and from 12 October 2026",
//     the last column the clause prints. Rolled on 23 October 2026 from the
//     WAIRC's registered copy (AG 5/2025, 2025 WAIRC 00098), clause 17(1),
//     page 27, read 23 October 2026:
//     https://downloads.wairc.wa.gov.au/agreements/wah042.pdf
//   - Enrolled nurses and assistants in nursing generally: WA Health System -
//     United Workers Union (WA) Industrial Agreement 2024, clause 24.
//     Publishes WEEKLY rates. Column "Increase of $65 7 October 2026" — rolled
//     on 9 October 2026 from the WAIRC's registered copy (AG 31/2025),
//     clause 24.1(e) and 24.2(a), read 9 October 2026:
//     https://downloads.wairc.wa.gov.au/agreements/wah044.pdf
//
// Both first read 28 August 2026 from the PDFs published by the Department of
// Health WA. Neither publishes an hourly rate, so this page does not show one — the
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
  // Same agreement as registered by the WAIRC (AG 5/2025, in force); the
  // 12 October 2026 rates were read from this copy on 23 October 2026:
  // https://downloads.wairc.wa.gov.au/agreements/wah042.pdf
  publisher: "Department of Health, Western Australia",
};

const UWU_SOURCE = {
  title:
    "WA Health System – United Workers Union (WA) – Enrolled Nurses, Assistants in Nursing, Aboriginal Health Workers, Ethnic Health Workers and Aboriginal Health Practitioners Industrial Agreement 2024",
  url: "https://www.health.wa.gov.au/~/media/Corp/Documents/Health-for/Industrial-relations/Awards-and-agreements/Enrolled-nurses/WA-Health-System--United-Workers-Union-WA--Enrolled-Nurses-Assistants-in-Nursing-Aboriginal-Health-W.pdf",
  // Same agreement as registered by the WAIRC (AG 31/2025); 7 October 2026
  // rates read from this copy on 9 October 2026:
  // https://downloads.wairc.wa.gov.au/agreements/wah044.pdf
  publisher: "Department of Health, Western Australia",
};

export const WA_NURSING_PAY: NursingStateData = {
  slug: "wa",
  code: "WA",
  name: "Western Australia",
  shortName: "WA",
  metaTitle: "WA Nurse Pay Rates 2026 - WA Health Nursing & Midwifery Salary",
  h1: "WA Nurse Pay Rates 2026: WA Health Nursing & Midwifery Pay Scales",
  employer: "WA health service providers (WA Country Health Service, East/North/South Metropolitan and Child and Adolescent Health Services)",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: "wa-anf-2024",
      name:
        "WA Health System – Australian Nursing Federation – Registered Nurses, Midwives, Enrolled (Mental Health) and Enrolled (Mothercraft) Nurses – Industrial Agreement 2024",
      effectiveFrom: "12 October 2026",
      // Clause 17 prints no column after 12 October 2026. The agreement's
      // nominal expiry is 11 October 2027 and it stays in force until a new
      // agreement replaces it (clause 5).
      tribunal: "Western Australian Industrial Relations Commission",
      source: ANF_SOURCE,
      note:
        "Clause 17 prints four columns: existing rate, 12 October 2024, 12 October 2025 and 12 October 2026. The 12 October 2026 column is the last one. The agreement reaches its nominal expiry on 11 October 2027 and keeps applying until a new agreement replaces it (clause 5).",
    },
    {
      id: "wa-uwu-2024",
      name:
        "WA Health System – United Workers Union (WA) – Enrolled Nurses, Assistants in Nursing, Aboriginal Health Workers, Ethnic Health Workers and Aboriginal Health Practitioners Industrial Agreement 2024",
      effectiveFrom: "7 October 2026",
      // Clause 24 prints no column after 7 October 2026.
      tribunal: "Western Australian Industrial Relations Commission",
      source: UWU_SOURCE,
      note:
        "Clause 24 publishes weekly rates and increases enrolled nurses and assistants in nursing by a flat dollar amount rather than a percentage: $65 a week on 7 October 2025 and again on 7 October 2026.",
    },
  ],

  scales: [
    {
      classification: "Registered Nurse/Midwife",
      gradeCode: "RN/M Level 1.1–2.4",
      family: "registered",
      instrumentId: "wa-anf-2024",
      points: [
        { label: "Level 1.1", annual: 85848 },
        { label: "Level 1.2", annual: 88818 },
        { label: "Level 1.3", annual: 92058 },
        { label: "Level 1.4", annual: 96510 },
        { label: "Level 1.5", annual: 101747 },
        { label: "Level 1.6", annual: 105678 },
        { label: "Level 1.7", annual: 109951 },
        { label: "Level 1.8", annual: 112644 },
        { label: "Level 2.1", annual: 115717 },
        { label: "Level 2.2", annual: 119138 },
        { label: "Level 2.3", annual: 122400 },
        { label: "Level 2.4", annual: 124087 },
      ],
      note:
        "These Registered Nurse/Midwife rates apply from 12 October 2026 (clause 17(1)). A registered nurse or midwife doing a post-basic course leading to registration is paid at Level 1.2 or higher (clause 17(8)).",
    },
    {
      classification: "Senior Registered Nurse/Midwife",
      gradeCode: "SRN/M Level 1–10",
      family: "clinical",
      instrumentId: "wa-anf-2024",
      points: [
        { label: "Level 1", annual: 134225 },
        { label: "Level 2", annual: 138346 },
        { label: "Level 3", annual: 142599 },
        { label: "Level 4", annual: 146989 },
        { label: "Level 5", annual: 151521 },
        { label: "Level 6", annual: 160774 },
        { label: "Level 7", annual: 170613 },
        { label: "Level 8", annual: 181076 },
        { label: "Level 9", annual: 191022 },
        { label: "Level 10", annual: 201533 },
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
          annual: 142599,
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
        { label: "Level 1", weekly: 1526.76 },
        { label: "Level 2", weekly: 1553.21 },
        { label: "Level 3", weekly: 1579.65 },
        { label: "Level 4", weekly: 1606.11 },
        { label: "Advanced Skill Enrolled Nurse 1", weekly: 1659.01 },
        { label: "Advanced Skill Enrolled Nurse 2", weekly: 1711.9 },
        { label: "Advanced Skill Enrolled Nurse 3", weekly: 1764.83 },
      ],
      note:
        "These enrolled nurse rates apply from 7 October 2026 (clause 24.1(e), after the second flat $65-a-week rise). Enrolled nurse levels 1 to 4 are years of employment as an enrolled nurse. Advanced skill requires a relevant post-enrolment qualification and at least three years' experience.",
    },
    {
      classification: "Enrolled Mental Health Nurse",
      gradeCode: "EMHN pay point 1–6",
      family: "enrolled",
      instrumentId: "wa-anf-2024",
      points: [
        { label: "Pay point 1", annual: 75453 },
        { label: "Pay point 2", annual: 76939 },
        { label: "Pay point 3", annual: 78423 },
        { label: "Pay point 4", annual: 79908 },
        { label: "Pay point 5", annual: 81393 },
        { label: "Pay point 6", annual: 82878 },
      ],
      note:
        "Enrolled mental health nurses sit under the ANF agreement, not the enrolled nurse agreement, and are paid an annual salary rather than a weekly rate.",
    },
    {
      classification: "Enrolled Nurse (Mothercraft Nursing only)",
      family: "enrolled",
      instrumentId: "wa-anf-2024",
      points: [
        { label: "Year 1", annual: 71493 },
        { label: "Year 2", annual: 72586 },
        { label: "Year 3", annual: 74181 },
        { label: "Year 4", annual: 75845 },
        { label: "Year 5", annual: 77478 },
      ],
      note:
        "Enrolled Nurse (Mothercraft Nursing only) is a closed classification: registration is limited to mothercraft nursing and the holder cannot administer medicines.",
    },
    {
      classification: "Assistant in Nursing",
      family: "support",
      instrumentId: "wa-uwu-2024",
      points: [
        { label: "Year 1", weekly: 1394.54 },
        { label: "Year 2", weekly: 1420.96 },
        { label: "Year 3", weekly: 1447.42 },
      ],
    },
  ],

  penalties: [
    {
      instrumentId: "wa-anf-2024",
      clause: "clause 26, Shift Work Allowances",
      rows: [
        {
          label: "Afternoon shift",
          value: "+15%",
          note: "A complete rostered shift starting no earlier than 1200 and finishing after 1800 on a weekday.",
        },
        {
          label: "Night shift",
          value: "+35%",
          note: "A complete rostered night shift between 1830 and 0730 on a weekday.",
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
      "not shown: neither WA agreement publishes an hourly rate, and neither prescribes a divisor for converting the salary, so this page does not print one",
  },

  notReproduced: [
    "Schedule C scale of allowances (district, travel, uniform, qualification)",
    "Aboriginal health worker, ethnic health worker and Aboriginal health practitioner rates in the United Workers Union agreement",
    "The Exceptional Matters Order at Schedule A of the ANF agreement",
  ],

  unverified: [
    "An hourly rate for any WA classification, as neither agreement publishes one",
    "The nurse practitioner's actual level, which the employer sets by work value assessment case by case",
    "Public holiday penalty rates and overtime multipliers",
  ],

  verifiedOn: "23 October 2026",

  intro:
    "Western Australia splits its nursing workforce across two industrial agreements registered with the WA Industrial Relations Commission. Registered nurses, midwives and enrolled mental health nurses sit under the ANF agreement, which pays an annual salary. Enrolled nurses and assistants in nursing sit under the United Workers Union agreement, which pays a weekly rate. WA also folds the clinical nurse, consultant and unit manager roles into one Senior Registered Nurse/Midwife ladder rather than giving each its own scale.",

  highlights: [
    "WA pays a 35% loading on a weekday night shift.",
    "In WA, Saturday ordinary hours are +50% and Sunday ordinary hours +75%, and those weekend rates replace the afternoon or night shift loading rather than adding to it.",
    "Registered nurses and midwives progress through Level 1.1 to 2.4, then into Senior Registered Nurse/Midwife Levels 1 to 10.",
    "The ANF agreement's last scheduled rise applied from 12 October 2026, taking RN/M Level 1.1 to $85,848 and Level 2.4 to $124,087 a year.",
    "Nurse practitioners have no separate rate: the agreement classifies them as Senior Registered Nurses at a level assessed on work value, floored at Level 3.",
    "Enrolled nurses and assistants in nursing got a flat $65-a-week rise on 7 October 2026, not a percentage, taking EN Level 1 to $1,526.76 a week.",
  ],
};
