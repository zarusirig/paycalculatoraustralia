// =============================================================================
// South Australia — SA Health nurses and midwives.
//
// Source: Nursing/Midwifery (South Australian Public Sector) Enterprise
// Agreement 2022, Appendix 6 (Classification and Salaries), column "1/1/2025",
// effective on and from the first full pay period after that date.
// https://www.sahealth.sa.gov.au/.../nursing+midwifery+south+australian+public+sector+enterprise+agreement+2022
// Read 28 August 2026.
//
// SA IS MID-BARGAINING AND THIS PAGE SAYS SO
// ------------------------------------------
// The 2022 agreement nominally expired on 31 July 2025. Bargaining for a
// replacement started on 30 April 2025 and a proposed Nursing/Midwifery (South
// Australian Public Sector) Enterprise Agreement 2026 went to ballot from
// 20 to 29 July 2026. SA Health's own page states a proposed agreement "only
// has effect when it is approved by" the South Australian Employment Tribunal.
// As at 28 August 2026 that page did not record an approval, so the operative
// rates remain the 1 January 2025 column of the 2022 agreement — which is also
// the range SA Health quotes on its careers salaries page.
//
// TRANSCRIPTION CHECK
// -------------------
// The 2022 agreement PDF is a scan, so the salary table was read by OCR. Two
// independent checks were run before publishing:
//   1. Every row in Appendix 6 with four rate columns compounds at exactly 3%
//      from one column to the next, as the table header states. A single
//      mis-read digit would break that chain. None did.
//   2. SA Health's careers salaries page independently quotes the registered
//      nurse/midwife range as "$74,831 - $211,200 (RN/M1-RN/M6)". Those are the
//      first and last figures in the 1/1/2025 column below.
// =============================================================================

import type { NursingStateData } from "./types";

const EA_SOURCE = {
  title: "Nursing/Midwifery (South Australian Public Sector) Enterprise Agreement 2022",
  url: "https://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/about+us/about+sa+health/our+workforce/enterprise+bargaining/nursing+and+midwifery+enterprise+agreement",
  publisher: "SA Health",
};

const SALARY_PAGE = {
  title: "Salaries — SA Health careers",
  url: "https://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/careers/working+for+sa+health/our+benefits/salaries/salaries",
  publisher: "SA Health",
};

export const SA_NURSING_PAY: NursingStateData = {
  slug: "sa",
  code: "SA",
  name: "South Australia",
  shortName: "SA",
  employer: "SA Health (Department for Health and Wellbeing and local health networks)",
  ordinaryHoursPerWeek: 38,

  instruments: [
    {
      id: "sa-ea-2022",
      name: "Nursing/Midwifery (South Australian Public Sector) Enterprise Agreement 2022",
      effectiveFrom: "first full pay period after 1 January 2025",
      nextIncrease:
        "none scheduled under this agreement — it nominally expired on 31 July 2025 and a replacement was balloted in July 2026",
      tribunal: "South Australian Employment Tribunal",
      source: EA_SOURCE,
      note:
        "Appendix 6 prints four columns, each 3% above the last: 1/1/2022, 1/1/2023, 1/1/2024 and 1/1/2025. The 1/1/2025 column is the last one and the one still in force.",
    },
  ],

  scales: [
    {
      classification: "Registered Nurse/Midwife (Level 1)",
      gradeCode: "RN/M1",
      family: "registered",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 74831 },
        { label: "2nd increment", annual: 77175 },
        { label: "3rd increment", annual: 80475 },
        { label: "4th increment", annual: 83918 },
        { label: "5th increment", annual: 87416 },
        { label: "6th increment", annual: 90931 },
        { label: "7th increment", annual: 94451 },
        { label: "8th increment", annual: 97967 },
        { label: "9th increment", annual: 102103 },
      ],
      note: "SA runs registered nurses and midwives on one scale, with increments rather than years.",
    },
    {
      classification: "Clinical Nurse/Midwife (Level 2)",
      gradeCode: "RN/M2",
      family: "clinical",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 87416 },
        { label: "2nd increment", annual: 90931 },
        { label: "3rd increment", annual: 94451 },
        { label: "4th increment", annual: 97967 },
        { label: "5th increment", annual: 102103 },
        { label: "6th increment", annual: 103353 },
        { label: "7th increment", annual: 105735 },
        { label: "8th increment", annual: 108115 },
        { label: "9th increment", annual: 110497 },
      ],
      note:
        "SA overlaps its levels deliberately: Clinical Nurse/Midwife 1st increment is the same money as Registered Nurse/Midwife 5th increment.",
    },
    {
      classification: "Associate Nurse/Midwife Unit Manager (Level 2)",
      gradeCode: "RN/M2",
      family: "management",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 103353 },
        { label: "2nd increment", annual: 105735 },
        { label: "3rd increment", annual: 108115 },
        { label: "4th increment", annual: 110497 },
      ],
    },
    {
      classification:
        "Nurse/Midwife Unit Manager, Nurse/Midwife Consultant, Nurse/Midwife Educator, Nurse/Midwife Manager (Level 3)",
      gradeCode: "RN/M3",
      family: "management",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 125183 },
        { label: "2nd increment", annual: 127980 },
        { label: "3rd increment", annual: 130779 },
      ],
      note:
        "SA pays the unit manager, consultant, educator and manager roles at one level and one rate — the step up from Level 2 is the largest single jump in the SA structure.",
    },
    {
      classification:
        "Advanced Nurse/Midwife Unit Manager, Advanced Nurse/Midwife Consultant, Advanced Nurse/Midwife Educator, Advanced Nurse/Midwife Manager, Nurse Practitioner (Level 4)",
      gradeCode: "RN/M4",
      family: "practitioner",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 132177 },
        { label: "2nd increment", annual: 135674 },
        { label: "3rd increment", annual: 137771 },
      ],
      note:
        "South Australia does not give the nurse practitioner a separate scale: the role sits at Level 4 alongside the advanced unit manager, consultant, educator and manager roles.",
    },
    {
      classification: "Enrolled Nurse (Diploma), or Enrolled Nurse (Certificate) authorised in medication administration",
      family: "enrolled",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 66438 },
        { label: "2nd increment", annual: 68083 },
        { label: "3rd increment", annual: 69637 },
        { label: "4th increment", annual: 70983 },
        { label: "5th increment", annual: 72729 },
        { label: "6th increment", annual: 74831 },
      ],
    },
    {
      classification: "Enrolled Nurse (Certificate), not authorised in medication administration",
      family: "enrolled",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 63992 },
        { label: "2nd increment", annual: 65040 },
        { label: "3rd increment", annual: 66438 },
        { label: "4th increment", annual: 67836 },
        { label: "5th increment", annual: 69236 },
        { label: "6th increment", annual: 70633 },
        { label: "7th increment", annual: 72033 },
      ],
      note:
        "The medication-administration authorisation is worth about $2,450 a year at the bottom of the scale — the two enrolled nurse streams run in parallel.",
    },
    {
      classification: "Advanced Skills Enrolled Nurse",
      family: "enrolled",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 74831 },
        { label: "2nd increment", annual: 76229 },
      ],
      note: "By appointment only under Appendix 7.",
    },
    {
      classification: "Nursing/Midwifery Director (Level 5)",
      gradeCode: "RN/M5",
      family: "management",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "5.1", annual: 144064 },
        { label: "5.2", annual: 160848 },
        { label: "5.3", annual: 169240 },
      ],
    },
    {
      classification: "Director of Nursing/Midwifery (Level 6)",
      gradeCode: "RN/M6",
      family: "management",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "6.1", annual: 144064 },
        { label: "6.2", annual: 152456 },
        { label: "6.3", annual: 160848 },
        { label: "6.4", annual: 169240 },
        { label: "6.5", annual: 177633 },
        { label: "6.6", annual: 193019 },
        { label: "6.7", annual: 211200 },
      ],
    },
    {
      classification: "Assistant in Nursing/Midwifery",
      gradeCode: "AIN/M",
      family: "support",
      instrumentId: "sa-ea-2022",
      points: [
        { label: "1st increment", annual: 59094 },
        { label: "2nd increment", annual: 60844 },
      ],
    },
  ],

  penalties: [
    {
      instrumentId: "sa-ea-2022",
      clause: "clause 9.3 — Night Shift Penalty",
      rows: [
        {
          label: "Rostered night shift, Monday to Friday",
          value: "+20.5%",
          note:
            "Applies to everyone except registered nurses and midwives at Levels 5 and 6. The agreement pays this in place of the parent award's night shift rate.",
        },
      ],
      incomplete:
        "Only the night shift penalty is set by the enterprise agreement. Afternoon, Saturday, Sunday and public holiday rates come from clause 5.3 of the Nursing/Midwifery (South Australian Public Sector) Award, which has not been read for this page and is therefore not published.",
    },
  ],

  derivation: {
    hourly:
      "not shown — the agreement publishes an annual salary only and prescribes no hourly divisor, so this page does not print one",
  },

  notReproduced: [
    "Appendix 7 career structure descriptors",
    "Professional development allowance and rural and remote incentives",
    "Rostering and workload (nurse-to-patient ratio) schedules",
  ],

  unverified: [
    "An hourly rate for any SA classification",
    "Afternoon, weekend and public holiday penalty rates, which sit in the parent award rather than the agreement",
    "Any rate under the proposed Nursing/Midwifery (South Australian Public Sector) Enterprise Agreement 2026, which had not been recorded as approved by the South Australian Employment Tribunal when this page was checked",
  ],

  verifiedOn: "28 August 2026",

  intro:
    "South Australian public sector nurses and midwives are paid under an enterprise agreement approved by the South Australian Employment Tribunal, and SA is the one state on this page where the current instrument has passed its nominal expiry. The 2022 agreement's last scheduled increase landed on 1 January 2025; a replacement went to ballot in July 2026 and takes effect only once the Tribunal approves it. Until then the figures below are what SA Health pays.",

  highlights: [
    "SA numbers its scales RN/M1 to RN/M6 and overlaps them: a Clinical Nurse/Midwife at the bottom of Level 2 earns exactly what a Registered Nurse/Midwife earns at the 5th increment.",
    "There is no separate nurse practitioner scale — nurse practitioners sit at Level 4 with the advanced unit manager and consultant roles.",
    "Night shift Monday to Friday attracts 20.5%, set by the agreement itself in place of the award rate.",
    "The 2022 agreement nominally expired on 31 July 2025. A replacement was balloted 20 to 29 July 2026 and had not been recorded as approved when this page was checked, so watch for a rate change.",
  ],

  extraSources: [SALARY_PAGE],
};
