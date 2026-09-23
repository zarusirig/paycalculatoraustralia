// =============================================================================
// Western Australian public sector — classification pay.
//
// Source: Public Sector CSA Agreement 2024, registered by the Public Service
// Arbitrator on 23 December 2024 (PSAAG 3 of 2024, 2024 WAIRC 01069; WAIRC
// agreement PUB072, listed "In Force"). Schedule 2 – General Division Salaries
// (printed pp. 108–109) and Schedule 3 – Specified Calling Salaries (p. 110).
// Every figure is the column headed "2026 salary — Effective on and from
// 13 June 2026", the third and last increase the agreement makes (clauses 10.2
// and 10.5). The agreement expires on 12 June 2027 (clause 6.1).
//
// The WAIRC PDF (https://downloads.wairc.wa.gov.au/agreements/pub072.pdf)
// refused connections when read, so the figures were transcribed from the copy
// WA Health publishes, which carries the same registration order and citation:
// https://www.health.wa.gov.au/~/media/Corp/Documents/Health-for/Industrial-relations/Awards-and-agreements/Public-service/Public-Sector-CSA-Agreement-2024.pdf
//
// Read 23 September 2026.
// =============================================================================

import type { Jurisdiction } from "./types";

const VERIFIED = "23 September 2026";

export const WA: Jurisdiction = {
  slug: "wa",
  name: "Western Australian public sector",
  shortName: "WA public sector",
  label: "Western Australia (Level 1–9)",
  verifiedOn: VERIFIED,

  levelGuide: {
    scheduleId: "wa-csa-2026",
    streamIds: ["wa-general"],
    year: "2026",
    headingTemplate: "WA {label} salary {year}",
    title: "WA public sector salary by level, from 13 June 2026",
    intro:
      "Each General Division level below lists every increment in the 13 June 2026 column of Schedule 2 of the Public Sector CSA Agreement 2024. Every salary links to the nearest take-home pay page.",
  },

  headline:
    "From 13 June 2026 a Western Australian public servant at Level 2 is paid $79,604 to $85,350, at Level 4 $99,134 to $104,044, at Level 5 $108,848 to $118,961 and at Level 6 $124,673 to $137,399, under the Public Sector CSA Agreement 2024. The General Division runs from $68,028 at Level 1.1 to $244,449 at Class 4.",

  metaTitle: "WA Public Sector Pay Rates 2026 — Level 1–9 Salary Scale",
  metaDescription:
    "Western Australian public sector pay from 13 June 2026: every General Division increment from Level 1.1 ($68,028) to Class 4 ($244,449) and the Specified Calling scale, from the Public Sector CSA Agreement 2024, with take-home pay.",

  instrument:
    "The Public Sector CSA Agreement 2024, registered by the Public Service Arbitrator of the Western Australian Industrial Relations Commission on 23 December 2024. It sets the General Division salaries (Levels 1 to 9 and Classes 1 to 4) in Schedule 2, the Specified Calling salaries in Schedule 3 and the Legal Grade salaries in Schedule 4, for public service officers employed by the agencies listed in Schedule 6.",

  payRise:
    "The agreement makes three increases: from 13 June 2024 (backdated), on and from 13 June 2025, and on and from 13 June 2026. The rates on this page are the 13 June 2026 column, which is the last one. The agreement expires on 12 June 2027 and aims for a replacement to apply from 13 June 2027 (clause 6.2); no rate beyond 13 June 2026 is published.",

  schedules: [
    {
      id: "wa-csa-2026",
      title: "Public Sector CSA Agreement 2024, from 13 June 2026",
      coverage:
        "Public service officers employed by the Western Australian agencies listed in Schedule 6 of the agreement.",
      basis: "agreement",
      effectiveFrom: "13 June 2026",
      rangeMeaning: "First and last increment of the level. Annual salary only — superannuation is paid on top.",
      sourceId: "wa-csa-2024",
      streams: [
        {
          id: "wa-general",
          name: "General Division (Schedule 2)",
          description:
            "Levels 1 to 9, each divided into increments written as level.increment (5.1, 5.2 …), then four single-rate Classes above Level 9. Rates for Level 1 employees under 21 were removed from Schedule 2 (clause 10.9).",
          bands: [
            {
              code: "Level 1",
              name: "General Division Level 1",
              aliases: ["wa level 1", "level 1 wa", "wa government level 1 salary"],
              summary: "Four increments. Adult trainees are paid Level 1.1 (clause 11.3).",
              min: 68_028,
              max: 77_574,
              payPoints: [
                { label: "Level 1.1", annual: 68_028 },
                { label: "Level 1.2", annual: 71_206 },
                { label: "Level 1.3", annual: 74_547 },
                { label: "Level 1.4", annual: 77_574 },
              ],
            },
            {
              code: "Level 2",
              name: "General Division Level 2",
              aliases: ["wa level 2", "level 2 wa", "wa government level 2 salary"],
              summary: "Four increments.",
              min: 79_604,
              max: 85_350,
              payPoints: [
                { label: "Level 2.1", annual: 79_604 },
                { label: "Level 2.2", annual: 81_422 },
                { label: "Level 2.3", annual: 83_344 },
                { label: "Level 2.4", annual: 85_350 },
              ],
            },
            {
              code: "Level 3",
              name: "General Division Level 3",
              aliases: ["wa level 3", "level 3 wa", "wa government level 3 salary"],
              summary: "Four increments.",
              min: 89_464,
              max: 96_043,
              payPoints: [
                { label: "Level 3.1", annual: 89_464 },
                { label: "Level 3.2", annual: 91_594 },
                { label: "Level 3.3", annual: 93_789 },
                { label: "Level 3.4", annual: 96_043 },
              ],
            },
            {
              code: "Level 4",
              name: "General Division Level 4",
              aliases: ["wa level 4", "level 4 wa", "wa government level 4 salary"],
              summary: "Three increments.",
              min: 99_134,
              max: 104_044,
              payPoints: [
                { label: "Level 4.1", annual: 99_134 },
                { label: "Level 4.2", annual: 101_554 },
                { label: "Level 4.3", annual: 104_044 },
              ],
            },
            {
              code: "Level 5",
              name: "General Division Level 5",
              aliases: ["wa level 5", "level 5 wa", "wa government level 5 salary"],
              summary: "Four increments.",
              min: 108_848,
              max: 118_961,
              payPoints: [
                { label: "Level 5.1", annual: 108_848 },
                { label: "Level 5.2", annual: 112_089 },
                { label: "Level 5.3", annual: 115_459 },
                { label: "Level 5.4", annual: 118_961 },
              ],
            },
            {
              code: "Level 6",
              name: "General Division Level 6",
              aliases: ["wa level 6", "level 6 wa", "wa government level 6 salary"],
              summary: "Four increments.",
              min: 124_673,
              max: 137_399,
              payPoints: [
                { label: "Level 6.1", annual: 124_673 },
                { label: "Level 6.2", annual: 128_718 },
                { label: "Level 6.3", annual: 132_918 },
                { label: "Level 6.4", annual: 137_399 },
              ],
            },
            {
              code: "Level 7",
              name: "General Division Level 7",
              aliases: ["wa level 7", "level 7 wa", "wa government level 7 salary"],
              summary: "Three increments.",
              min: 144_755,
              max: 154_717,
              payPoints: [
                { label: "Level 7.1", annual: 144_755 },
                { label: "Level 7.2", annual: 149_522 },
                { label: "Level 7.3", annual: 154_717 },
              ],
            },
            {
              code: "Level 8",
              name: "General Division Level 8",
              aliases: ["wa level 8", "level 8 wa", "wa government level 8 salary"],
              summary: "Three increments.",
              min: 163_427,
              max: 176_990,
              payPoints: [
                { label: "Level 8.1", annual: 163_427 },
                { label: "Level 8.2", annual: 169_483 },
                { label: "Level 8.3", annual: 176_990 },
              ],
            },
            {
              code: "Level 9",
              name: "General Division Level 9",
              aliases: ["wa level 9", "level 9 wa", "wa government level 9 salary"],
              summary: "Three increments.",
              min: 186_680,
              max: 200_259,
              payPoints: [
                { label: "Level 9.1", annual: 186_680 },
                { label: "Level 9.2", annual: 193_023 },
                { label: "Level 9.3", annual: 200_259 },
              ],
            },
            {
              code: "Class 1",
              name: "General Division Class 1",
              aliases: ["wa class 1"],
              summary: "Single rate. Classes sit above Level 9.",
              min: 211_558,
              max: 211_558,
            },
            {
              code: "Class 2",
              name: "General Division Class 2",
              aliases: ["wa class 2"],
              summary: "Single rate. Classes sit above Level 9.",
              min: 222_530,
              max: 222_530,
            },
            {
              code: "Class 3",
              name: "General Division Class 3",
              aliases: ["wa class 3"],
              summary: "Single rate. Classes sit above Level 9.",
              min: 233_486,
              max: 233_486,
            },
            {
              code: "Class 4",
              name: "General Division Class 4",
              aliases: ["wa class 4"],
              summary: "Single rate. Classes sit above Level 9.",
              min: 244_449,
              max: 244_449,
            },
          ],
        },
        {
          id: "wa-specified-calling",
          name: "Specified Calling (Schedule 3)",
          description:
            "A separate scale for professional officers in specified callings. Levels 1 to 6 have increments; Levels 7 to 10 are single rates.",
          bands: [
            {
              code: "Specified Calling Level 1",
              name: "Specified Calling Level 1",
              aliases: ["specified calling level 1"],
              summary: "Specified Calling salaries, Schedule 3.",
              min: 86_377,
              max: 113_705,
              payPoints: [
                { label: "SC 1.1", annual: 86_377 },
                { label: "SC 1.2", annual: 90_256 },
                { label: "SC 1.3", annual: 94_560 },
                { label: "SC 1.4", annual: 99_939 },
                { label: "SC 1.5", annual: 108_278 },
                { label: "SC 1.6", annual: 113_705 },
              ],
            },
            {
              code: "Specified Calling Level 2",
              name: "Specified Calling Level 2",
              aliases: ["specified calling level 2"],
              summary: "Specified Calling salaries, Schedule 3.",
              min: 116_195,
              max: 127_313,
              payPoints: [
                { label: "SC 2.1", annual: 116_195 },
                { label: "SC 2.2", annual: 119_684 },
                { label: "SC 2.3", annual: 123_368 },
                { label: "SC 2.4", annual: 127_313 },
              ],
            },
            {
              code: "Specified Calling Level 3",
              name: "Specified Calling Level 3",
              aliases: ["specified calling level 3"],
              summary: "Specified Calling salaries, Schedule 3.",
              min: 133_733,
              max: 147_446,
              payPoints: [
                { label: "SC 3.1", annual: 133_733 },
                { label: "SC 3.2", annual: 138_102 },
                { label: "SC 3.3", annual: 142_619 },
                { label: "SC 3.4", annual: 147_446 },
              ],
            },
            {
              code: "Specified Calling Level 4",
              name: "Specified Calling Level 4",
              aliases: ["specified calling level 4"],
              summary: "Specified Calling salaries, Schedule 3.",
              min: 152_143,
              max: 162_635,
              payPoints: [
                { label: "SC 4.1", annual: 152_143 },
                { label: "SC 4.2", annual: 157_164 },
                { label: "SC 4.3", annual: 162_635 },
              ],
            },
            {
              code: "Specified Calling Level 5",
              name: "Specified Calling Level 5",
              aliases: ["specified calling level 5"],
              summary: "Specified Calling salaries, Schedule 3.",
              min: 171_519,
              max: 185_781,
              payPoints: [
                { label: "SC 5.1", annual: 171_519 },
                { label: "SC 5.2", annual: 177_890 },
                { label: "SC 5.3", annual: 185_781 },
              ],
            },
            {
              code: "Specified Calling Level 6",
              name: "Specified Calling Level 6",
              aliases: ["specified calling level 6"],
              summary: "Specified Calling salaries, Schedule 3.",
              min: 195_642,
              max: 209_900,
              payPoints: [
                { label: "SC 6.1", annual: 195_642 },
                { label: "SC 6.2", annual: 202_303 },
                { label: "SC 6.3", annual: 209_900 },
              ],
            },
            {
              code: "Specified Calling Level 7",
              name: "Specified Calling Level 7",
              aliases: ["specified calling level 7"],
              summary: "Single rate.",
              min: 221_389,
              max: 221_389,
            },
            {
              code: "Specified Calling Level 8",
              name: "Specified Calling Level 8",
              aliases: ["specified calling level 8"],
              summary: "Single rate.",
              min: 232_879,
              max: 232_879,
            },
            {
              code: "Specified Calling Level 9",
              name: "Specified Calling Level 9",
              aliases: ["specified calling level 9"],
              summary: "Single rate.",
              min: 244_359,
              max: 244_359,
            },
            {
              code: "Specified Calling Level 10",
              name: "Specified Calling Level 10",
              aliases: ["specified calling level 10"],
              summary: "Single rate.",
              min: 255_846,
              max: 255_846,
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "Within a level you move through the increments written as level.increment — Level 5 has four (5.1 to 5.4), Level 4 has three (4.1 to 4.3). Increment rules are set by the agreement and the Public Service Award 1992 rather than restated here; check your agency's HR policy for the review date that applies to you.",
    "The levels do not overlap: the top of Level 4 is $104,044 and the bottom of Level 5 is $108,848, a gap of $4,804. Moving up a level is an appointment to a position classified at the higher level, not an increment.",
    "Adult trainees are paid at Level 1.1 (clause 11.3), and the separate rates for Level 1 employees under 21 were removed from the salary schedule (clause 10.9).",
  ],

  superannuation: {
    rate: null,
    text:
      "The agreement does not state an employer superannuation percentage. Clause 12.1 points to clause 15(6) of the applicable award for compulsory Superannuation Guarantee contributions, so the Superannuation Guarantee rate is the floor for WA public servants unless another arrangement applies to you.",
    sourceId: "wa-csa-2024",
  },

  sources: [
    {
      id: "wa-csa-2024",
      title: "Public Sector CSA Agreement 2024 (2024 WAIRC 01069) — Schedules 2 and 3",
      publisher: "WA Health (copy of the registered agreement)",
      url: "https://www.health.wa.gov.au/~/media/Corp/Documents/Health-for/Industrial-relations/Awards-and-agreements/Public-service/Public-Sector-CSA-Agreement-2024.pdf",
      effectiveFrom: "13 June 2026",
      verifiedOn: VERIFIED,
      note: "Schedule 2 (General Division, pp. 108–109) and Schedule 3 (Specified Calling, p. 110), 2026 salary column.",
    },
    {
      id: "wa-wairc-pub072",
      title: "Public Sector CSA Agreement 2024 — agreement record PUB072",
      publisher: "Western Australian Industrial Relations Commission",
      url: "https://www.wairc.wa.gov.au/resources/agreements?id=PUB072",
      verifiedOn: VERIFIED,
      note: "Lists the agreement as In Force.",
    },
  ],

  unverified: [
    "Schedule 4 – Legal Grade salaries for WA Government lawyers — published in the same agreement but not transcribed.",
    "Public Service Award 1992 minimum rates, which sit beneath the agreement rates actually paid.",
    "Junior and trainee rates below Level 1.1.",
    "WA Health nurses, WA teachers and other WA public sector employees on their own agreements (see the nurse and teacher pages).",
    "An employer superannuation percentage above the Superannuation Guarantee — the agreement states none.",
  ],

  faqs: [
    {
      q: "What is the WA public sector pay scale in 2026?",
      a: "From 13 June 2026 the General Division of the Public Sector CSA Agreement 2024 runs from $68,028 at Level 1.1 to $200,259 at Level 9.3, then four single-rate Classes up to $244,449 at Class 4. Level 2 pays $79,604 to $85,350, Level 3 $89,464 to $96,043, Level 4 $99,134 to $104,044, Level 5 $108,848 to $118,961 and Level 6 $124,673 to $137,399.",
    },
    {
      q: "What is a WA Level 5 salary?",
      a: "Level 5 pays $108,848 (5.1), $112,089 (5.2), $115,459 (5.3) and $118,961 (5.4) from 13 June 2026.",
    },
    {
      q: "When is the next WA public sector pay rise?",
      a: "Not yet scheduled. The 13 June 2026 increase is the last one in the Public Sector CSA Agreement 2024, which expires on 12 June 2027. The next rise depends on a replacement agreement.",
    },
    {
      q: "What does a WA Level 2 or Level 3 public servant earn?",
      a: "From 13 June 2026, Level 2 pays $79,604, $81,422, $83,344 and $85,350 across its four increments, and Level 3 pays $89,464, $91,594, $93,789 and $96,043.",
    },
    {
      q: "What is a Specified Calling in the WA public sector?",
      a: "A separate salary scale in Schedule 3 of the agreement for professional officers in specified callings. From 13 June 2026 it runs from $86,377 at Level 1.1 to $255,846 at Level 10.",
    },
  ],
};
