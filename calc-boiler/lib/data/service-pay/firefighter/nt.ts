// Northern Territory — NT Fire and Rescue Service (NTFRS) career firefighter pay.
//
// Source of every figure: Northern Territory Public Sector Fire and Rescue
// Service 2021-2025 Enterprise Agreement, approved by the Fair Work Commission
// to operate from 30 October 2023, nominal expiry 7 November 2025. Published by
// the Office of the Commissioner for Public Employment (OCPE). Read in full on
// 24 September 2026.
//
// Clause 14.1 sets four 3% increases (first full pay period after 7 November
// 2021, 2022, 2023 and 2024). Schedule 3 prints ANNUAL salaries; the last
// column, "Salary rate effective 21/11/2024", is the one IN FORCE on
// 24 September 2026, because no replacement agreement has been made: the
// proposed 2025–2029 agreement did not become an agreement after the June 2026
// ballot (OCPE Bulletin 20) and the FWC made an
// intractable bargaining declaration on 4 September 2026 (OCPE Bulletin 21).

import type { ServicePayJurisdiction } from "../types";

export const NT_FIREFIGHTER_PAY: ServicePayJurisdiction = {
  occupation: "firefighter",
  slug: "nt",
  code: "NT",
  name: "Northern Territory",
  nameInSentence: "the Northern Territory",
  employer: "NT Fire and Rescue Service",
  agreementName: "Northern Territory Public Sector Fire and Rescue Service 2021-2025 Enterprise Agreement",
  agreementUrl:
    "https://ocpe.nt.gov.au/media/documents/nt-public-sector-employment-information-about-ntps-employment/information-about-ntps-employment/ntps-fire-rescue-2021-2025-enterprise-agreement.PDF",
  ratesEffectiveFrom: "21 November 2024",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "firefighters",
      title: "Firefighters (Schedule 3 — base annual salary)",
      intro:
        "NTFRS firefighters from recruit through Firefighter Classes D, C, B and A (Qualified Firefighter, the 100% rate) to Senior Firefighter.",
      stepHeading: "Rank",
      steps: [
        { label: "Recruit Firefighter - first 4 months", salary: 80_285 },
        { label: "Recruit Firefighter - next 8 months", salary: 84_403 },
        { label: "Firefighter Class D", salary: 87_489 },
        { label: "Firefighter Class C", salary: 89_547 },
        { label: "Firefighter Class B", salary: 100_868 },
        { label: "Firefighter Class A", salary: 102_930, note: "Qualified Firefighter — the 100% relativity rate" },
        { label: "Senior Firefighter", salary: 108_074 },
      ],
    },
    {
      id: "leading-firefighters-and-officers",
      title: "Leading Firefighter and officers (Schedule 3 — base annual salary)",
      intro: "Leading Firefighter and the officer ranks.",
      stepHeading: "Rank",
      steps: [
        { label: "Leading Firefighter", salary: 113_222 },
        { label: "Station Officer", salary: 123_515 },
        { label: "Senior Station Officer", salary: 133_809 },
        { label: "District Officer", salary: 154_393 },
      ],
    },
  ],
  entryStep: "Recruit Firefighter - first 4 months",
  topStep: "Senior Firefighter",

  traineePay: [
    "Recruit Firefighters are paid $80,285 a year for the first 4 months and $84,403 a year for the next 8 months (rates effective 21 November 2024) — 78% and 82% of the Firefighter Class A rate.",
    "Recruits undertaking recruit training under the Training and Development Command do not receive the General Fire Fighting Allowance (clause 15.4).",
  ],
  penalties: [
    "A General Fire Fighting Allowance of 4% of base salary is paid to employees on shift duty at a Darwin or Alice Springs station and on Track Station day shift — for example $4,117 a year for Firefighter Class A (clause 15, Schedule 3).",
    "A 10% Day Shift Allowance (e.g. $10,293 a year for Firefighter Class A) and a 5.2% Alice Springs Allowance (e.g. $5,352 a year for Firefighter Class A) apply where eligible (Schedule 3).",
    "Shift work follows the 10/14 roster: 10-hour day shifts (0800–1800) and 14-hour night shifts (1800–0800), with ordinary hours averaging 38 a week over 52 weeks (clauses 39 and 41).",
  ],
  notices: [
    "The 2021-2025 agreement passed its nominal expiry date on 7 November 2025 but continues to operate until it is replaced (OCPE Bulletin 21).",
    "Bargaining for a 2025–2029 agreement has not produced a deal. A revised offer went to an employee ballot that closed on 22 June 2026 without producing a new agreement, and on 4 September 2026 the Fair Work Commission made an intractable bargaining declaration. If the parties still cannot agree, the Commission will make a workplace determination setting the terms (OCPE Bulletins 20 and 21).",
  ],
  unverified: [
    "No pay increase after 21 November 2024 appears in the agreement or in the OCPE bulletins read (Bulletins 15, 20 and 21 and the negotiations index), so none is shown. The terms of the offer put to ballot did not become an agreement and are not shown.",
    "Allowances such as urban search and rescue, fire investigator and aerial appliance allowances are paid on top and are not included in the salaries.",
  ],
  sources: [
    {
      title: "Northern Territory Public Sector Fire and Rescue Service 2021-2025 Enterprise Agreement (Schedule 3)",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: "https://ocpe.nt.gov.au/media/documents/nt-public-sector-employment-information-about-ntps-employment/information-about-ntps-employment/ntps-fire-rescue-2021-2025-enterprise-agreement.PDF",
    },
    {
      title: "Northern Territory Public Sector Fire and Rescue Service Enterprise Agreement — negotiations bulletins",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: "https://ocpe.nt.gov.au/employment-terms-and-conditions/current-enterprise-agreements/enterprise-agreement-negotiations/ntps-fire-and-rescue-service-ea",
    },
    {
      title: "Bulletin 21 - Intractable Bargaining Declaration (issued 7 September 2026)",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: "https://ocpe.nt.gov.au/employment-terms-and-conditions/current-enterprise-agreements/enterprise-agreement-negotiations/ntps-fire-and-rescue-service-ea/bulletin-21",
    },
  ],
  faqs: [
    {
      q: "How much does a firefighter earn in the NT?",
      a: "A qualified NT Fire and Rescue Service firefighter (Firefighter Class A) earns a base salary of $102,930 a year and a Senior Firefighter $108,074, on rates effective 21 November 2024. Eligible station-based firefighters also get a 4% General Fire Fighting Allowance ($4,117 a year at Class A).",
    },
    {
      q: "What is a recruit firefighter's salary in the NT?",
      a: "NT recruit firefighters earn $80,285 a year for their first 4 months and $84,403 for the next 8 months, before moving to Firefighter Class D at $87,489.",
    },
    {
      q: "How much does a station officer earn in the NT?",
      a: "An NTFRS Station Officer earns a base salary of $123,515 a year and a Senior Station Officer $133,809, on rates effective 21 November 2024.",
    },
    {
      q: "Why haven't NT firefighters had a pay rise since 2024?",
      a: "The 2021-2025 agreement's last increase took effect on 21 November 2024. Negotiations for a new agreement have not produced a deal, and on 4 September 2026 the Fair Work Commission declared the bargaining intractable.",
    },
  ],
};
