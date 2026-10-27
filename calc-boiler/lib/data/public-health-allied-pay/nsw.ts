// =============================================================================
// New South Wales — NSW Health (public hospitals and health services).
//
// Four state awards of the Industrial Relations Commission of NSW, each read
// on 23 October 2026 from the copy NSW Health publishes on its awards page
// (https://www.health.nsw.gov.au/careers/conditions/Pages/awards.aspx):
//
//   Health Employees' Pharmacists (State) Award 2025          Part B Table 1
//   Health Employees' Medical Radiation Scientists (State)
//     Award 2025                                              Part B Table 1
//   NSW Health Service Health Professionals (State) Award 2025 Part B Table 1
//   Health and Community Employees Psychologists (State)
//     Award 2025                                              Part B Table 1
//
// Every figure is the FOURTH column, "Ffppoa 01-Jul-2026 Increase 4%": each
// award says the third column applies from the first full pay period on or
// after 1 July 2025 and the fourth from the first full pay period on or after
// 1 July 2026. All four awards took effect on 1 July 2025 "for a period of two
// years" and schedule no rise after July 2026.
//
// Pharmacists and radiographers are paid weekly rates (annualised x 52 on the
// page); health professionals and psychologists are paid published annual
// salaries. Radiographer rates are for a 35-hour week, as Table 1 prints.
//
// Psychologists are NOT in the Health Professionals award (Schedule A does not
// list them); they have their own award, used below. Sonographers do not
// appear in any of these tables, so NSW sonographer pay is not published here.
// =============================================================================

import type { StatePublicHealthPay } from "./types";

const VERIFIED = "23 October 2026";

const AWARDS_PAGE = {
  title: "NSW public health system awards and determinations",
  publisher: "NSW Health",
  url: "https://www.health.nsw.gov.au/careers/conditions/Pages/awards.aspx",
};

export const NSW_PUBLIC_HEALTH_PAY: StatePublicHealthPay = {
  state: "nsw",
  code: "NSW",
  name: "New South Wales",
  employer: "NSW Health",
  instruments: [
    {
      id: "nsw-pharmacists-2025",
      name: "Health Employees' Pharmacists (State) Award 2025",
      tribunal: "Industrial Relations Commission of NSW",
      ratesFrom: "the first full pay period on or after 1 July 2026",
      column: "Ffppoa01-Jul-2026Increase 4%$",
      source: {
        title: "Health Employees' Pharmacists (State) Award 2025, Part B Table 1",
        publisher: "NSW Health",
        url: "https://www.health.nsw.gov.au/careers/conditions/Awards/hsu-he-pharmacists.pdf",
      },
      extraSources: [AWARDS_PAGE],
      verifiedOn: VERIFIED,
      nextIncrease: null,
      status: "The award took effect on 1 July 2025 for two years and sets no rise after July 2026.",
      proof:
        "Clause 8(i): \"This Award takes effect from 1 July 2025 and shall remain in force for a period of two years. The rates in the third column in Table 1 of Part B - Monetary Rates, will apply from the first full pay period on or after (ffppoa) 1 July 2025 and the rates in the fourth column in Table 1 of Part B – Monetary Rates shall apply from the first full pay period on or after (ffppoa) 1 July 2026.\" Table 1: \"1st Year | Weekly | 1604.76 | 1668.95\".",
    },
    {
      id: "nsw-mrs-2025",
      name: "Health Employees' Medical Radiation Scientists (State) Award 2025",
      tribunal: "Industrial Relations Commission of NSW",
      ratesFrom: "the first full pay period on or after 1 July 2026",
      column: "Ffppoa01-Jul-2026Increase4%$",
      source: {
        title: "Health Employees' Medical Radiation Scientists (State) Award 2025, Part B Table 1",
        publisher: "NSW Health",
        url: "https://www.health.nsw.gov.au/careers/conditions/Awards/hsu-he-medical-radiation-scientist.pdf",
      },
      extraSources: [
        {
          title: "Determination 25 of 2023: Medical Radiation Scientists, commencement rate",
          publisher: "NSW Ministry of Health",
          url: "https://www.health.nsw.gov.au/careers/conditions/Documents/mrs-commencement-rate-determination.pdf",
        },
        AWARDS_PAGE,
      ],
      verifiedOn: VERIFIED,
      nextIncrease: null,
      status: "The award took effect on 1 July 2025 for two years and sets no rise after July 2026.",
      proof:
        "Clause 7(i): \"The rates in the third column in Table 1 of Part B - Monetary Rates, will apply from the first full pay period on or after (ffppoa) 1 July 2025 and the rates in the fourth column in Table 1 of Part B – Monetary Rates shall apply from the first full pay period on or after (ffppoa) 1 July 2026.\" Table 1: \"Radiographer | Level1(35hrs) | Year1 | Weekly | 1463.71 | 1522.26\". Determination 25 of 2023, para 5: sets \"the commencement rate for the employment of new MRS graduates to 'Level 2 Year 1'\"; para 9: \"remains in force until 30 October 2026 unless rescinded or replaced earlier\".",
    },
    {
      id: "nsw-health-professionals-2025",
      name: "NSW Health Service Health Professionals (State) Award 2025",
      tribunal: "Industrial Relations Commission of NSW",
      ratesFrom: "the first full pay period on or after 1 July 2026",
      column: "Ffppoa 01-Jul-2026 Increase 4%$",
      source: {
        title: "NSW Health Service Health Professionals (State) Award 2025, Part B Table 1",
        publisher: "NSW Health",
        url: "https://www.health.nsw.gov.au/careers/conditions/Awards/health-professional.pdf",
      },
      extraSources: [AWARDS_PAGE],
      verifiedOn: VERIFIED,
      nextIncrease: null,
      status: "The award took effect on 1 July 2025 for two years and sets no rise after July 2026.",
      proof:
        "Clause 14.1: \"This Award takes effect from 1 July 2025 and shall remain in force for a period of two years. The rates in the third column in Table 1 of Part B - Monetary Rates, will apply from the first full pay period on or after (ffppoa) 1 July 2025 and the rates in the fourth column in Table 1 of Part B – Monetary Rates shall apply from the first full pay period on or after (ffppoa) 1 July 2026\". Table 1: \"Level 1 | Year 1 | Annual | 76364 | 79419\". Schedule A lists Occupational Therapist and Physiotherapist.",
    },
    {
      id: "nsw-psychologists-2025",
      name: "Health and Community Employees Psychologists (State) Award 2025",
      tribunal: "Industrial Relations Commission of NSW",
      ratesFrom: "the first full pay period on or after 1 July 2026",
      column: "Ffppoa 01-Jul-2026 Increase 4%",
      source: {
        title: "Health and Community Employees Psychologists (State) Award 2025, Part B Table 1",
        publisher: "NSW Health",
        url: "https://www.health.nsw.gov.au/careers/conditions/Awards/hsu-hc-psychologists.pdf",
      },
      extraSources: [AWARDS_PAGE],
      verifiedOn: VERIFIED,
      nextIncrease: null,
      status: "The award took effect on 1 July 2025 for two years and sets no rise after July 2026.",
      proof:
        "Clause 9(i): \"This Award takes effect from 1 July 2025 and shall remain in force for a period of two years. The rates in the third column in Table 1 of Part B - Monetary Rates, will apply from the first full pay period on or after (ffppoa) 1 July 2025 and the rates in the fourth column in Table 1 of Part B - Monetary Rates shall apply from the first full pay period on or after (ffppoa) 1 July 2026.\" Table 1: \"1st year of service | Annual | 80452 | 83670\".",
    },
  ],
  scales: [
    {
      id: "nsw-pharmacists",
      state: "nsw",
      professions: ["pharmacist"],
      instrumentId: "nsw-pharmacists-2025",
      title: "Hospital pharmacists",
      annualBasis: "weekly x 52",
      steps: [
        { label: "Graduate pharmacist (unregistered)", weekly: 1576.39, note: "intern year, before registration" },
        { label: "Grade 1, year 1", weekly: 1668.95 },
        { label: "Grade 1, year 2", weekly: 1778.07 },
        { label: "Grade 1, year 3", weekly: 1895.55 },
        { label: "Grade 1, year 4", weekly: 2105.85 },
        { label: "Grade 1, year 5", weekly: 2171.37 },
        { label: "Grade 2, year 1", weekly: 2330.11 },
        { label: "Grade 2, year 2", weekly: 2405.37 },
        { label: "Grade 2, year 3", weekly: 2470.33 },
        { label: "Grade 3, year 1", weekly: 2732.69, note: "senior pharmacist" },
        { label: "Grade 3, year 2", weekly: 2806.64 },
        { label: "Grade 4, year 1", weekly: 2806.64 },
        { label: "Grade 4, year 2", weekly: 2899.29 },
        { label: "Grade 5, year 1", weekly: 2985.21 },
        { label: "Grade 5, year 2", weekly: 3058.39 },
        { label: "Grade 6, year 1", weekly: 3271.28 },
        { label: "Grade 6, year 2", weekly: 3351.03 },
        { label: "Grade 7, Group A, year 1", weekly: 3519.35 },
        { label: "Grade 7, Group A, year 2", weekly: 3602.91 },
        { label: "Grade 7, Group B, year 1", weekly: 3685.35 },
        { label: "Grade 7, Group B, year 2", weekly: 3768.65 },
      ],
      entry: "Grade 1, year 1",
      entryRule:
        "A registered pharmacist starts on Grade 1, year 1 and moves up a year each year. With at least three years' hospital experience after registration and the award's competency criteria, a pharmacist is classified Grade 2 (clause 1). Grades 3 to 7 are senior, deputy director and director roles, graded by hospital group.",
      top: "Grade 7, Group B, year 2",
      topNote: "Grade 7 is the Director of Pharmacy at a Group 1 hospital",
    },
    {
      id: "nsw-radiographers",
      state: "nsw",
      professions: ["radiographer"],
      instrumentId: "nsw-mrs-2025",
      title: "Radiographers (medical radiation scientists)",
      annualBasis: "weekly x 52",
      hoursPerWeek: 35,
      steps: [
        { label: "Level 1, year 1", weekly: 1522.26, note: "supervised first year, provisional registration" },
        { label: "Level 2, year 1", weekly: 1576.33, note: "new graduate with full registration" },
        { label: "Level 2, year 2", weekly: 1778.06 },
        { label: "Level 2, year 3", weekly: 2011.57 },
        { label: "Level 2, year 4", weekly: 2105.94 },
        { label: "Level 2, year 5", weekly: 2171.43 },
        { label: "Level 3, grade 1, year 1", weekly: 2330.16, note: "specialist" },
        { label: "Level 3, grade 1, year 2", weekly: 2405.51 },
        { label: "Level 3, grade 2, year 1", weekly: 2470.21, note: "consultant" },
        { label: "Level 3, grade 2, year 2", weekly: 2732.72 },
        { label: "Level 3, grade 3, year 1", weekly: 2806.61 },
        { label: "Level 4, grade 1, year 1", weekly: 2806.61 },
        { label: "Level 4, grade 1, year 2", weekly: 2899.3 },
        { label: "Level 4, grade 2, year 1", weekly: 2985.05 },
        { label: "Level 4, grade 2, year 2", weekly: 3058.38 },
        { label: "Level 5, year 1", weekly: 3271.4 },
        { label: "Level 5, year 2", weekly: 3351.11 },
        { label: "Level 5, year 3", weekly: 3519.36 },
        { label: "Level 6, year 1", weekly: 3602.87 },
        { label: "Level 6, year 2", weekly: 3685.38 },
        { label: "Level 6, year 3", weekly: 3768.55 },
      ],
      entry: "Level 2, year 1",
      entryRule:
        "Level 1 is a supervised first year after graduating (the provisional development year), and the move to Level 2 is automatic once the supervised practice program is done. Under NSW Health Determination 25 of 2023, a new graduate who is already fully registered starts on Level 2, year 1 instead. The determination is in force until 30 October 2026 unless it is replaced. Level 2 rises a year at a time to year 5.",
      top: "Level 6, year 3",
      topNote: "Level 6 is a chief radiographer running a department of 20 or more radiographers",
      notes: ["Radiographer rates are for a 35-hour week, as the award's table states."],
    },
    {
      id: "nsw-health-professionals",
      state: "nsw",
      professions: ["physiotherapist", "occupational-therapist"],
      instrumentId: "nsw-health-professionals-2025",
      title: "Health professionals (physiotherapists, occupational therapists and others)",
      annualBasis: "published",
      steps: [
        { label: "Level 1, year 1", annual: 79_419 },
        { label: "Level 1, year 2", annual: 82_262 },
        { label: "Level 1, year 3", annual: 87_090 },
        { label: "Level 1, year 4", annual: 92_801 },
        { label: "Level 2, year 1", annual: 98_936 },
        { label: "Level 2, year 2", annual: 104_964 },
        { label: "Level 2, year 3", annual: 109_881 },
        { label: "Level 2, year 4", annual: 113_301 },
        { label: "Level 3, year 1", annual: 121_568, note: "senior clinician" },
        { label: "Level 3, year 2", annual: 125_507 },
        { label: "Level 4, year 1", annual: 131_585 },
        { label: "Level 4, year 2", annual: 134_775 },
        { label: "Level 5, year 1", annual: 141_319 },
        { label: "Level 5, year 2", annual: 144_756 },
        { label: "Level 6, year 1", annual: 151_736 },
        { label: "Level 6, year 2", annual: 155_492 },
        { label: "Level 7, grade 1", annual: 163_070 },
        { label: "Level 7, grade 2", annual: 171_030 },
        { label: "Level 7, grade 3", annual: 179_382 },
        { label: "Level 8, grade 1", annual: 171_030 },
        { label: "Level 8, grade 2", annual: 179_382 },
        { label: "Level 8, grade 3", annual: 188_159 },
        { label: "Level 8, grade 4", annual: 197_370 },
      ],
      entry: "Level 1, year 1",
      entryRule:
        "Clause 5.2 sets the starting step by degree. A health professional with a three-year degree starts on Level 1, year 1. One with a degree of more than three years starts on year 2 and one with a degree plus a master's (more than four years of study) starts on year 3. The move to Level 2 is automatic after 12 months on Level 1, year 4. Levels 3 to 6 are senior clinician, educator, department head and clinical specialist roles.",
      top: "Level 8, grade 4",
      topNote: "Level 8 is a discipline director or adviser for a local health district",
    },
    {
      id: "nsw-psychologists",
      state: "nsw",
      professions: ["psychologist"],
      instrumentId: "nsw-psychologists-2025",
      title: "Psychologists",
      annualBasis: "published",
      steps: [
        { label: "Psychologist, year 1", annual: 83_670, note: "psychologist in training" },
        { label: "Psychologist, year 2", annual: 87_984 },
        { label: "Psychologist, year 3", annual: 92_293, note: "start with full registration" },
        { label: "Psychologist, year 4", annual: 97_680 },
        { label: "Psychologist, year 5", annual: 103_071 },
        { label: "Psychologist, year 6", annual: 108_458 },
        { label: "Psychologist, year 7", annual: 113_847 },
        { label: "Psychologist, year 8", annual: 118_161 },
        { label: "Psychologist, year 9 and after", annual: 122_465 },
        { label: "Senior psychologist, year 1", annual: 128_933 },
        { label: "Senior psychologist, year 2", annual: 134_325 },
        { label: "Senior psychologist, year 3 and after", annual: 139_712 },
        { label: "Clinical psychologist, year 1", annual: 118_162 },
        { label: "Clinical psychologist, year 2", annual: 124_621 },
        { label: "Clinical psychologist, year 3", annual: 131_091 },
        { label: "Clinical psychologist, year 4", annual: 137_560 },
        { label: "Clinical psychologist, year 5 and after", annual: 144_021 },
        { label: "Senior clinical psychologist, year 1", annual: 150_490 },
        { label: "Senior clinical psychologist, year 2", annual: 154_800 },
        { label: "Senior clinical psychologist, year 3 and after", annual: 159_112 },
        { label: "Principal clinical psychologist, year 1 and after", annual: 180_666 },
      ],
      entry: "Psychologist, year 3",
      entryRule:
        "A psychologist in training (provisional registration) starts on year 1 of the psychologist scale. A psychologist who already has full registration starts on year 3 (clause 2A). Clinical psychologists, who hold a clinical master's or higher, have their own scale.",
      top: "Principal clinical psychologist, year 1 and after",
      topNote: "The principal clinical psychologist role is filled by merit selection from senior clinical psychologists",
    },
  ],
};
