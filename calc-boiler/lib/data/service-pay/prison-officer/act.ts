// Australian Capital Territory — ACT Corrective Services correctional officers
// (J8, 9 Oct 2026).
//
// Source: ACT Public Sector Correctional Officers Enterprise Agreement
// 2023-2026 (AE522330 PR768340), Annex A – Classifications and Rates of Pay.
// Read in full on 9 October 2026. "The nominal expiry date of the Agreement is
// 31 March 2026" (A4.2). The last column printed is "1% + $1,000 from
// 4/12/2025", published here. The ACT Government's agreements page (read the
// same day) still lists this agreement and says "17 out of the 18 ACTPS
// Enterprise Agreements are currently under negotiation".
//   4/12/2025 column: Correctional Officer Trainee (While on course) $65,146;
//   Correctional Officer Class 1 $79,546, Cert III Correctional Practice point
//   $83,297, next point $89,092, Cert IV Correctional Practice point $93,658;
//   Class 2 $97,903, $101,168, Cert IV point $104,432; Class 3 $111,366,
//   $114,630, $118,302; Class 4 $128,909, $133,805, $137,068.
// Clause C8: shift any part of which falls between 6 pm and 6.30 am +15%;
// continuously for more than 4 weeks wholly within 6 pm–8 am +30%; Saturday
// +50%, Sunday +100%, public holiday +150% of the ordinary hourly rate.

import type { ServicePayJurisdiction } from "../types";

const ACT_EA = "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0006/2330187/ACT-Public-Sector-Correctional-Officers-Agreement-2023-2026-FINAL.pdf";

export const ACT_PRISON_OFFICER_PAY: ServicePayJurisdiction = {
  occupation: "prison-officer",
  slug: "act",
  code: "ACT",
  name: "Australian Capital Territory",
  nameInSentence: "the ACT",
  employer: "ACT Corrective Services",
  agreementName: "ACT Public Sector Correctional Officers Enterprise Agreement 2023-2026",
  agreementUrl: ACT_EA,
  ratesEffectiveFrom: "4 December 2025",
  nextIncrease: null,
  verifiedOn: "9 October 2026",

  scales: [
    {
      id: "correctional-officer-class-1",
      title: "Correctional Officer Class 1",
      intro:
        "Annex A, the \"1% + $1,000 from 4/12/2025\" column. Pay points above the first are tied to the Certificate III and Certificate IV in Correctional Practice, as the agreement labels them.",
      stepHeading: "Pay point",
      steps: [
        { label: "Class 1 — entry", salary: 79_546 },
        { label: "Class 1 — Cert III Correctional Practice", salary: 83_297 },
        { label: "Class 1 — next pay point", salary: 89_092 },
        { label: "Class 1 — Cert IV Correctional Practice", salary: 93_658 },
      ],
    },
    {
      id: "correctional-officer-class-2",
      title: "Correctional Officer Class 2",
      intro: "Annex A, from 4 December 2025.",
      stepHeading: "Pay point",
      steps: [
        { label: "Class 2 — pay point 1", salary: 97_903 },
        { label: "Class 2 — pay point 2", salary: 101_168 },
        { label: "Class 2 — Cert IV Correctional Practice", salary: 104_432 },
      ],
    },
    {
      id: "correctional-officer-class-3-4",
      title: "Correctional Officer Class 3 and Class 4",
      intro: "Annex A, from 4 December 2025.",
      stepHeading: "Pay point",
      steps: [
        { label: "Class 3 — pay point 1", salary: 111_366 },
        { label: "Class 3 — pay point 2", salary: 114_630 },
        { label: "Class 3 — pay point 3", salary: 118_302 },
        { label: "Class 4 — pay point 1", salary: 128_909 },
        { label: "Class 4 — pay point 2", salary: 133_805 },
        { label: "Class 4 — pay point 3", salary: 137_068 },
      ],
    },
  ],
  entryStep: "Class 1 — entry",
  topStep: "Class 1 — Cert IV Correctional Practice",

  traineePay: [
    "A Correctional Officer Trainee is paid $65,146 a year while on the course, from the first full pay period on or after 1 December 2025 (Annex A).",
  ],
  penalties: [
    "Shift workers get an extra 15% of the ordinary hourly rate for a shift any part of which falls between 6 pm and 6.30 am, or 30% when working continuously for more than 4 weeks on shifts wholly between 6 pm and 8 am (clause C8.1–C8.2).",
    "Rostered ordinary duty on a Saturday attracts an extra 50%, on a Sunday 100%, and on a public holiday 150% of the ordinary hourly rate (clause C8.5–C8.7). These replace the shift penalty for that shift (C8.3).",
  ],
  notices: [
    "The agreement passed its nominal expiry date on 31 March 2026 but continues to apply until it is replaced. The ACT Government says 17 of its 18 public sector agreements are under negotiation, so a new agreement could change these rates.",
  ],
  unverified: [
    "Allowances in Annex B and later annexes (first aid, dog handler, community language and others), which are not reproduced here.",
  ],
  sources: [
    {
      title: "ACT Public Sector Correctional Officers Enterprise Agreement 2023-2026 — Annex A, Classifications and Rates of Pay",
      publisher: "ACT Government (CMTEDD)",
      url: ACT_EA,
    },
    {
      title: "ACT Public Service enterprise agreements",
      publisher: "ACT Government (CMTEDD)",
      url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements",
    },
  ],
  faqs: [
    {
      q: "How much does a correctional officer earn in the ACT?",
      a: "From 4 December 2025, a Correctional Officer Class 1 starts on $79,546 a year and reaches $93,658 at the Certificate IV pay point. Class 2 earns $97,903 to $104,432, Class 3 $111,366 to $118,302 and Class 4 $128,909 to $137,068.",
    },
    {
      q: "What do ACT correctional officer trainees earn?",
      a: "$65,146 a year while on the trainee course, under Annex A of the agreement.",
    },
  ],
};
