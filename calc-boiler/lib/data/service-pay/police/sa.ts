// South Australia — SA Police (SAPOL) salaries: NOT VERIFIED.
//
// What was read on 24 September 2026:
//
// - South Australia Police Enterprise Agreement 2021, as varied by SAET order
//   ET-24-00737 (operative 27 February 2024), which replaced Schedule 1 salary
//   schedules. Its last printed column is "Rates from 1/1/24". That column has
//   been superseded, so it is NOT published as current.
// - The Attorney-General's Department news item of 16 December 2024: an interim
//   two-year deal giving a 4% salary increase in January 2025 plus a $2,500
//   retention salary increase, and a further "4% increase or adjustment to the
//   national midpoint salary (whichever is higher)" in January 2026. The January
//   2026 rise is therefore not a fixed percentage and cannot be calculated from
//   the 2024 schedule.
// - The AGD "Current agreements" page lists only the 2021 agreement and its
//   April 2023 and February 2024 variations — no instrument printing the January
//   2025 or January 2026 rates was found.
// - SAPOL's "Career progression and salaries" page prints salary ranges by rank
//   (e.g. Probationary Constable, Constable 1 to 7) but gives no effective date
//   and does not print every increment, so it cannot be tied to a date or used
//   as a full table.
//
// Per the no-guessing rule this file ships with empty scales. The page renders
// the "not yet verified" card with links to the official sources.

import type { ServicePayJurisdiction } from "../types";

export const SA_POLICE_PAY: ServicePayJurisdiction = {
  occupation: "police",
  slug: "sa",
  code: "SA",
  name: "South Australia",
  nameInSentence: "South Australia",
  employer: "SA Police (SAPOL)",
  agreementName: "South Australia Police Enterprise Agreement 2021 (as varied)",
  agreementUrl: "https://www.agd.sa.gov.au/industrial-relations/current-agreements",
  ratesEffectiveFrom: "",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  scales: [],
  traineePay: [],
  penalties: [],
  notices: [
    "SA police pay rose in January 2025 and again in January 2026 under an interim two-year arrangement announced by the SA Government on 16 December 2024: 4% in January 2025 plus a $2,500 retention salary increase, then 4% or an adjustment to the national midpoint salary (whichever is higher) in January 2026, plus a $3,500 one-off payment. The published enterprise agreement schedule still ends at January 2024 rates.",
    "In September 2026 the Police Association of South Australia announced it had secured the terms of a proposed new enterprise agreement. A proposed agreement does not change pay until it is approved by the South Australian Employment Tribunal, so it is not reflected here.",
  ],
  unverified: [
    "We could not find an official instrument that prints SA Police salaries from January 2026 increment by increment. The last registered salary schedule (South Australia Police Enterprise Agreement 2021, varied 27 February 2024) shows January 2024 rates, which have since been increased, so we do not publish them as current.",
    "SA Police's own careers page lists salary ranges by rank, but it does not say when those rates took effect, so we have not reproduced them. Check the SA Police careers page and the Attorney-General's Department current agreements page for the latest figures.",
  ],
  sources: [
    {
      title: "Current agreements — South Australia Police Enterprise Agreement 2021 and variations",
      publisher: "Attorney-General's Department (SA)",
      url: "https://www.agd.sa.gov.au/industrial-relations/current-agreements",
    },
    {
      title: "Orders — Variation of Enterprise Agreement (s 84), South Australia Police Enterprise Agreement 2021 (ET-24-00737, February 2024)",
      publisher: "South Australian Employment Tribunal / Attorney-General's Department (SA)",
      url: "https://www.agd.sa.gov.au/__data/assets/pdf_file/0007/988873/ET-24-00737-South-Australian-Police-Enterprise-Agreement-2021-Variation.pdf",
    },
    {
      title: "New agreement to attract and retain police (16 December 2024)",
      publisher: "Attorney-General's Department (SA)",
      url: "https://www.agd.sa.gov.au/news/new-agreement-to-attract-and-retain-police",
    },
    {
      title: "Career progression and salaries",
      publisher: "South Australia Police",
      url: "https://www.police.sa.gov.au/join-us/achievemore/police-officer-careers/working-as-a-police-officer/career-progression-and-salaries",
    },
  ],
  faqs: [],
};
