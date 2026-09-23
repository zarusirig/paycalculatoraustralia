// =============================================================================
// ACT Public Service — Administrative and Related Classifications pay (H2).
//
// Source: ACT Public Sector Administrative and Related Classifications
// Enterprise Agreement 2023–2026, approved by the Fair Work Commission on
// 13 September 2023 (AG2023/2959), operating from 20 September 2023, nominal
// expiry 31 March 2026. Annex A — Classifications and Rates of Pay, printed
// pp. 165–166. Every figure is the last column of Annex A, headed
// "1% + $1,000 from 04/12/2025" — the seventh and final increase the agreement
// makes (clause C2.2.7: 1% from the first full pay period on or after
// 1 December 2025 plus a $1,000 flat-rate increase).
// https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0004/2287633/ACT-Public-Sector-Administrative-and-Related-Classifications-Enterprise-Agreement-2023-2026.pdf
//
// STATUS ON 24 SEPTEMBER 2026 (read from the ACTPS Employment Portal)
// ------------------------------------------------------------------
// The proposed Administrative and Related Classifications Enterprise Agreement
// 2026–2029 went to ballot on 26 August 2026; voting closed on 8 September 2026
// and "the Agreement was not approved by employees". Until a replacement comes
// into effect, employees "will continue to be covered by the terms and
// conditions" of the 2023–2026 agreement — so its 4 December 2025 column is
// the rate in force. No interim increase is published on the bargaining page
// (last updated 25 August 2026).
//
// TRANSCRIPTION CHECK
// -------------------
// Every Annex A row was re-derived from the previous column using clause C2.2
// (1% then +$1,000 for the final column). All rows reconcile to within $1,
// which is the rounding the agreement applies.
//
// Read 24 September 2026.
// =============================================================================

import type { Jurisdiction } from "./types";

const VERIFIED = "24 September 2026";

export const ACT: Jurisdiction = {
  slug: "act",
  name: "ACT Public Service",
  shortName: "ACTPS",
  label: "ACT (ASO and Senior Officer)",
  verifiedOn: VERIFIED,

  levelGuide: {
    scheduleId: "act-admin-2025",
    streamIds: ["act-aso"],
    year: "2026",
    headingTemplate: "ACT {label} salary {year}",
    title: "ACT Public Service salary by classification",
    intro:
      "Each classification below lists every pay point in the final column of Annex A of the ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023–2026, in force from 4 December 2025. Every salary links to the nearest take-home pay page.",
  },

  headline:
    "An ACT public servant at ASO 4 is paid $86,750 to $93,416, at ASO 6 $102,657 to $116,592 and at Senior Officer Grade C $127,597 to $136,873, under the ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023–2026. These are the rates from 4 December 2025, still in force because employees voted down the proposed 2026–2029 replacement in September 2026.",

  metaTitle: "ACT Public Service Pay Scales 2026 — ASO & SOG Salaries",
  metaDescription:
    "ACT Public Service pay from 4 December 2025: every ASO 1–6 and Senior Officer Grade C, B and A pay point ($65,124 to $172,246) from the ACTPS Administrative and Related Classifications EA 2023–2026, with take-home pay.",

  instrument:
    "The ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023–2026, a single-enterprise agreement approved by the Fair Work Commission on 13 September 2023 (AG2023/2959). It covers Administrative Services Officers (ASO 1 to 6) and Senior Officers (Grades C, B and A) across all ACT Government directorates, plus a number of related local classifications, in Annex A. ACT executives are not covered by it.",

  payRise:
    "The agreement made seven increases between January 2023 and December 2025, the last being 1% plus a $1,000 flat-rate increase from the first full pay period on or after 1 December 2025 (4 December 2025). It passed its nominal expiry date on 31 March 2026. A proposed 2026–2029 replacement was put to a ballot that closed on 8 September 2026 and was not approved by employees, so the 2023–2026 rates continue to apply and no further increase is scheduled until a new agreement is made.",

  schedules: [
    {
      id: "act-admin-2025",
      title: "ACT Administrative and Related Classifications EA 2023–2026, from 4 December 2025",
      coverage:
        "ACT Public Service employees in the Administrative Services Officer and Senior Officer classifications, across all directorates.",
      basis: "agreement",
      effectiveFrom: "4 December 2025",
      rangeMeaning:
        "First and last pay point of the classification. Annual full-time salary only — superannuation is paid on top.",
      sourceId: "act-admin-ea-2023",
      streams: [
        {
          id: "act-aso",
          name: "Administrative Services Officers and Senior Officers (Annex A)",
          code: "ASO",
          description:
            "Six Administrative Services Officer classes, then Senior Officer Grades C, B and A. Each class has annual pay points you move through by increment. Retention points that apply only to Trust Officers or DPP staff are not shown.",
          bands: [
            {
              code: "ASO 1",
              name: "Administrative Services Officer Class 1",
              aliases: ["aso1", "act aso1", "act aso 1 salary", "aso class 1"],
              summary:
                "Entry level. The first two pay points are both $65,124 because the agreement set a $62,860 minimum full-time salary in December 2024, which lifted them to the same figure.",
              min: 65_124,
              max: 68_798,
              payPoints: [
                { label: "ASO 1 pay points 1 and 2", annual: 65_124 },
                { label: "ASO 1 pay point 3", annual: 66_441 },
                { label: "ASO 1 pay point 4", annual: 68_798 },
              ],
            },
            {
              code: "ASO 2",
              name: "Administrative Services Officer Class 2",
              aliases: ["aso2", "act aso2", "act aso 2 salary", "aso class 2"],
              summary: "Five pay points.",
              min: 70_236,
              max: 76_910,
              payPoints: [
                { label: "ASO 2 pay point 1", annual: 70_236 },
                { label: "ASO 2 pay point 2", annual: 71_922 },
                { label: "ASO 2 pay point 3", annual: 73_575 },
                { label: "ASO 2 pay point 4", annual: 75_250 },
                { label: "ASO 2 pay point 5", annual: 76_910 },
              ],
            },
            {
              code: "ASO 3",
              name: "Administrative Services Officer Class 3",
              aliases: ["aso3", "act aso3", "act aso 3 salary", "aso class 3"],
              summary: "Four pay points.",
              min: 78_755,
              max: 84_284,
              payPoints: [
                { label: "ASO 3 pay point 1", annual: 78_755 },
                { label: "ASO 3 pay point 2", annual: 80_569 },
                { label: "ASO 3 pay point 3", annual: 82_377 },
                { label: "ASO 3 pay point 4", annual: 84_284 },
              ],
            },
            {
              code: "ASO 4",
              name: "Administrative Services Officer Class 4",
              aliases: ["aso4", "act aso4", "act aso 4 salary", "aso class 4"],
              summary: "Four pay points. A Trust Officers-only retention point ($97,557) sits above it and is not shown.",
              min: 86_750,
              max: 93_416,
              payPoints: [
                { label: "ASO 4 pay point 1", annual: 86_750 },
                { label: "ASO 4 pay point 2", annual: 89_217 },
                { label: "ASO 4 pay point 3", annual: 91_303 },
                { label: "ASO 4 pay point 4", annual: 93_416 },
              ],
            },
            {
              code: "ASO 5",
              name: "Administrative Services Officer Class 5",
              aliases: ["aso5", "act aso5", "act aso 5 salary", "aso class 5"],
              summary: "Three pay points. A DPP-only retention point ($104,227) sits above it and is not shown.",
              min: 95_722,
              max: 100_956,
              payPoints: [
                { label: "ASO 5 pay point 1", annual: 95_722 },
                { label: "ASO 5 pay point 2", annual: 98_432 },
                { label: "ASO 5 pay point 3", annual: 100_956 },
              ],
            },
            {
              code: "ASO 6",
              name: "Administrative Services Officer Class 6",
              aliases: ["aso6", "act aso6", "act aso 6 salary", "aso class 6"],
              summary: "Five pay points. A Trust Officers-only retention point ($122,280) sits above it and is not shown.",
              min: 102_657,
              max: 116_592,
              payPoints: [
                { label: "ASO 6 pay point 1", annual: 102_657 },
                { label: "ASO 6 pay point 2", annual: 104_996 },
                { label: "ASO 6 pay point 3", annual: 107_622 },
                { label: "ASO 6 pay point 4", annual: 112_584 },
                { label: "ASO 6 pay point 5", annual: 116_592 },
              ],
            },
            {
              code: "SOG C",
              name: "Senior Officer Grade C",
              aliases: ["sogc", "senior officer grade c", "act sog c", "sog c salary"],
              summary: "Two pay points. The first Senior Officer grade.",
              min: 127_597,
              max: 136_873,
              payPoints: [
                { label: "SOG C pay point 1", annual: 127_597 },
                { label: "SOG C pay point 2", annual: 136_873 },
              ],
            },
            {
              code: "SOG B",
              name: "Senior Officer Grade B",
              aliases: ["sogb", "senior officer grade b", "act sog b", "sog b salary"],
              summary: "Three pay points.",
              min: 149_172,
              max: 167_151,
              payPoints: [
                { label: "SOG B pay point 1", annual: 149_172 },
                { label: "SOG B pay point 2", annual: 156_563 },
                { label: "SOG B pay point 3", annual: 167_151 },
              ],
            },
            {
              code: "SOG A",
              name: "Senior Officer Grade A",
              aliases: ["soga", "senior officer grade a", "act sog a", "sog a salary"],
              summary: "Single rate — the top of the non-executive administrative structure.",
              min: 172_246,
              max: 172_246,
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "A new starter or promoted employee is paid the first pay point of the classification (clause C5.1), although the head of service can approve a start at a higher pay point (clause C5.2).",
    "An eligible employee moves up one pay point each year on the anniversary of starting in the classification, provided no underperformance or discipline action is under way (clause C5.5). After 12 months of higher duties within a 24-month period, an increment is also paid at the higher classification (clause C5.3).",
    "Moving from one class to the next — ASO 4 to ASO 5, or ASO 6 to Senior Officer Grade C — is a promotion to a position at that level, not an increment. The top of ASO 6 is $116,592 and the bottom of SOG C is $127,597.",
  ],

  superannuation: {
    rate: 12.5,
    text:
      "Clause D7.5 sets the employer contribution at 12.5% from 1 January 2026 for members of accumulation funds (it was 12% from 1 July to 31 December 2025), plus a further 1% in each pay period where the employee contributes 3% or more of ordinary time earnings. Members of the CSS and PSSdb defined-benefit schemes receive what their scheme rules specify instead.",
    sourceId: "act-admin-ea-2023",
  },

  sources: [
    {
      id: "act-admin-ea-2023",
      title: "ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023–2026 (AG2023/2959) — Annex A",
      publisher: "ACT Government (Chief Minister, Treasury and Economic Development Directorate)",
      url: "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0004/2287633/ACT-Public-Sector-Administrative-and-Related-Classifications-Enterprise-Agreement-2023-2026.pdf",
      effectiveFrom: "4 December 2025",
      verifiedOn: VERIFIED,
      note: "Annex A, final column \"1% + $1,000 from 04/12/2025\". Clause C2.2 lists the increases; clause A4.2 the 31 March 2026 nominal expiry.",
    },
    {
      id: "act-agreements-portal",
      title: "Enterprise Agreements — ACTPS Employment Portal",
      publisher: "ACT Government",
      url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements",
      verifiedOn: VERIFIED,
      note: "States that the proposed Administrative and Related Classifications EA 2026–2029 was not approved by employees (ballot closed 8 September 2026) and that the 2023–2026 agreement continues to apply. Page last updated 10 September 2026.",
    },
    {
      id: "act-bargaining-2025-26",
      title: "2025/2026 ACTPS Enterprise Bargaining",
      publisher: "ACT Government",
      url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements/20252026-enterprise-bargaining",
      verifiedOn: VERIFIED,
      note: "Bargaining history: initial pay offer 9 December 2025, updated 11 March 2026, further offer 20 July 2026.",
    },
  ],

  unverified: [
    "Rates under the proposed Administrative and Related Classifications Enterprise Agreement 2026–2029 — employees voted it down in September 2026, so its figures are not in force and are not shown.",
    "ACT Public Service executive (SES-equivalent) remuneration, which is set outside this agreement.",
    "Graduate, cadet, trainee and apprentice rates, and the other local classifications in Annex A (Audit Office, Capital Linen Service, research officers, school assistants and others) — published in the same annex but not transcribed here.",
    "Retention points restricted to Trust Officers and DPP staff.",
    "Teachers, nurses, health professionals and other ACT staff on their own enterprise agreements (see the teacher and nurse pages).",
  ],

  faqs: [
    {
      q: "What is the ACT Public Service pay scale in 2026?",
      a: "The rates in force are the 4 December 2025 column of the ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023–2026. They run from $65,124 at ASO 1 to $116,592 at the top of ASO 6, then $127,597 to $136,873 at Senior Officer Grade C, $149,172 to $167,151 at Grade B and $172,246 at Grade A.",
    },
    {
      q: "What does an ACT ASO 6 earn?",
      a: "ASO 6 has five pay points: $102,657, $104,996, $107,622, $112,584 and $116,592 a year from 4 December 2025, plus employer superannuation of 12.5% (13.5% if you contribute at least 3% yourself).",
    },
    {
      q: "When is the next ACT public service pay rise?",
      a: "None is scheduled. The 2023–2026 agreement's last increase was 1% plus $1,000 from 4 December 2025, and it passed its nominal expiry on 31 March 2026. The proposed 2026–2029 replacement was not approved by employees when voting closed on 8 September 2026, so the next rise depends on a new agreement being made and approved by the Fair Work Commission.",
    },
    {
      q: "What does an ACT Senior Officer Grade C earn?",
      a: "SOG C pays $127,597 at the first pay point and $136,873 at the second, from 4 December 2025. Grade B pays $149,172 to $167,151 and Grade A is a single rate of $172,246.",
    },
    {
      q: "Why are the first two ASO 1 pay points the same?",
      a: "In December 2024 the agreement moved the minimum full-time salary for every Annex A classification to $62,860, which lifted the first two ASO 1 pay points to the same figure. Both then rose by the same percentages, so both are $65,124 from 4 December 2025.",
    },
    {
      q: "What superannuation do ACT public servants get?",
      a: "12.5% of ordinary time earnings from 1 January 2026 under clause D7.5 of the agreement, plus an extra 1% in any pay where you contribute 3% or more yourself. Members of the older CSS and PSSdb schemes get what their scheme rules set instead.",
    },
  ],
};
