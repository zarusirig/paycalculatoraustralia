// Tasmania — Tasmania Prison Service correctional officers (J8, 9 Oct 2026).
//
// Source: Correctional Officers Agreement 2023 ([2024] TASIC 2, T15107 of
// 2024), Tasmanian Industrial Commission. Read in full on 9 October 2026.
// Clause 4.2: applies from 1 December 2023 "and will remain in force until 30
// November 2026". Clause 8.1(iii): 3.0% from the first full pay period
// commencing on or after 1 December 2025 — the last column printed, and the
// column published here.
//   Schedule 1 (day workers, base salary, 1 Dec 2025 column): CO Training
//   $66,520; CO Probationary $71,290; CO Level 1 $74,013; Level 2 $77,026;
//   Level 3 $78,532; FCCO Level 1 $80,016; Level 2 $82,051; Level 3 $83,260;
//   Correctional Supervisor Level 1–7 $85,501, $87,697, $90,018, $91,519,
//   $93,868, $96,969, $98,413; Correctional Supervisor Grade 2 $98,508.
//   Schedule 2 (salaries "including annual allowance for shift work", 1.30
//   multiplier from the first full pay period on or after 1 December 2025):
//   CO Probationary $92,677; CO Level 1 $96,217; Level 2 $100,134; Level 3
//   $102,092; FCCO Level 1 $104,021; Level 2 $106,666; Level 3 $108,238.

import type { ServicePayJurisdiction } from "../types";

const COA = "https://www.tic.tas.gov.au/__data/assets/pdf_file/0011/757973/Correctional-Officers-Agreement-2023.pdf";

export const TAS_PRISON_OFFICER_PAY: ServicePayJurisdiction = {
  occupation: "prison-officer",
  slug: "tas",
  code: "TAS",
  name: "Tasmania",
  nameInSentence: "Tasmania",
  employer: "Tasmania Prison Service",
  agreementName: "Correctional Officers Agreement 2023",
  agreementUrl: COA,
  ratesEffectiveFrom: "1 December 2025",
  nextIncrease: null,
  verifiedOn: "9 October 2026",
  hubNote: "Day-worker base salary; shift workers are paid Schedule 2 salaries with a 1.30 shift multiplier built in.",

  scales: [
    {
      id: "correctional-officer-day",
      title: "Correctional Officer and First Class Correctional Officer — day workers (Schedule 1)",
      intro: "Base salaries for day workers from the first full pay period on or after 1 December 2025 (a 3.0% increase).",
      stepHeading: "Classification",
      steps: [
        { label: "CO Probationary", salary: 71_290 },
        { label: "CO Level 1", salary: 74_013 },
        { label: "CO Level 2", salary: 77_026 },
        { label: "CO Level 3", salary: 78_532 },
        { label: "First Class Correctional Officer (FCCO) Level 1", salary: 80_016, note: "After the advanced assessment point" },
        { label: "FCCO Level 2", salary: 82_051 },
        { label: "FCCO Level 3", salary: 83_260 },
      ],
    },
    {
      id: "correctional-officer-shift",
      title: "Correctional Officer and FCCO — shift workers (Schedule 2)",
      intro:
        "Salaries including the annual allowance for shift work, which applies a 1.30 multiplier from the first full pay period on or after 1 December 2025.",
      stepHeading: "Classification",
      steps: [
        { label: "CO Probationary (shift)", salary: 92_677 },
        { label: "CO Level 1 (shift)", salary: 96_217 },
        { label: "CO Level 2 (shift)", salary: 100_134 },
        { label: "CO Level 3 (shift)", salary: 102_092 },
        { label: "FCCO Level 1 (shift)", salary: 104_021 },
        { label: "FCCO Level 2 (shift)", salary: 106_666 },
        { label: "FCCO Level 3 (shift)", salary: 108_238 },
      ],
    },
    {
      id: "correctional-supervisor",
      title: "Correctional Supervisor — day workers (Schedule 1)",
      intro: "Base salaries from the first full pay period on or after 1 December 2025.",
      stepHeading: "Classification",
      steps: [
        { label: "Correctional Supervisor (CS) Level 1", salary: 85_501 },
        { label: "CS Level 2", salary: 87_697 },
        { label: "CS Level 3", salary: 90_018 },
        { label: "CS Level 4", salary: 91_519, note: "After the advanced assessment point" },
        { label: "CS Level 5", salary: 93_868 },
        { label: "CS Level 6", salary: 96_969 },
        { label: "CS Level 7", salary: 98_413 },
        { label: "Correctional Supervisor Grade 2", salary: 98_508 },
      ],
    },
  ],
  entryStep: "CO Probationary",
  topStep: "FCCO Level 3",

  traineePay: [
    "A Correctional Officer in training is paid $66,520 a year (Schedule 1, from the first full pay period on or after 1 December 2025), moving to CO Probationary at $71,290, or $92,677 on the shift-worker salary.",
  ],
  penalties: [
    "Shift workers are paid the Schedule 2 salaries, which build in an annual allowance for shift work through a 1.30 multiplier on the base salary from the first full pay period on or after 1 December 2025 — a CO Level 1 on shifts earns $96,217 against $74,013 as a day worker.",
  ],
  notices: [
    "The Correctional Officers Agreement 2023 remains in force until 30 November 2026, and the 1 December 2025 increase is the last one it prints. Any later rise depends on a new agreement.",
  ],
  unverified: [
    "Shift-worker salaries for Correctional Supervisors, and one-off lower income payments under clause 8.4, which are not reproduced here.",
  ],
  sources: [
    {
      title: "Correctional Officers Agreement 2023 ([2024] TASIC 2, T15107 of 2024) — Schedules 1 and 2",
      publisher: "Tasmanian Industrial Commission",
      url: COA,
    },
  ],
  faqs: [
    {
      q: "How much does a correctional officer earn in Tasmania?",
      a: "From the first full pay period on or after 1 December 2025, a day-worker CO Probationary earns $71,290 and a First Class Correctional Officer up to $83,260. Shift workers are paid more because their salary includes the shift allowance: $92,677 for CO Probationary up to $108,238 at FCCO Level 3.",
    },
    {
      q: "What does a trainee correctional officer earn in Tasmania?",
      a: "$66,520 a year while in training, under Schedule 1 of the Correctional Officers Agreement 2023.",
    },
  ],
};
