// =============================================================================
// NSW public sector — classification pay.
//
// TWO INSTRUMENTS, KEPT APART:
//
//   1. nsw-crown-2026 — Crown Employees (Public Sector - Salaries 2024) Award
//      (IRC award code 385; Case No. 342428 of 2024; published 6 December 2024,
//      397 I.G. 163, Publication No. C9875). The Administrative and Clerical
//      Officers table in Part B, column "1.7.26 Per annum 3%". Clause 3(iii)(c):
//      "a further 3% increases to salaries payable with effect from the first
//      full pay period to commence on or after 1 July 2026." The award remains
//      in force until 30 June 2027 (clause 9(iii)); no later column exists.
//      Later variations C10023 (7 July 2025) and C10041 (22 September 2025)
//      only touch Psychologists and Fisheries provisions.
//      http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9875
//
//   2. nsw-health-admin-2026 — Health Employees' Administrative Staff (State)
//      Award 2025 (IRC award code 721; Case No. 377050 of 2025; published
//      27 November 2025, 398 I.G. 913, Publication No. C10078). Part B, Table 1,
//      column "Ffppoa 01-Jul-2026 Increase 4%" (clause 8(i)). The award takes
//      effect from 1 July 2025 for two years; no column after 1 July 2026.
//      http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C10078
//
// UNITS. The Crown Employees award prints annual salaries. The NSW Health
// award prints WEEKLY rates only, so the annual figures for NSW Health are the
// weekly rate x 52 — the same convention the nursing pages use — rounded to the
// dollar, and every pay point label carries the published weekly figure so the
// source number is never hidden behind the conversion. The test file checks
// the arithmetic.
//
// Read 23 September 2026.
// =============================================================================

import type { Jurisdiction } from "./types";

const VERIFIED = "23 September 2026";

export const NSW: Jurisdiction = {
  slug: "nsw",
  name: "NSW public sector",
  shortName: "NSW public service",
  label: "NSW (Clerk Grades, NSW Health)",
  verifiedOn: VERIFIED,

  levelGuide: {
    scheduleId: "nsw-crown-2026",
    extraScheduleIds: ["nsw-health-admin-2026"],
    year: "2026",
    title: "NSW public service salary by grade, and NSW Health administration levels",
    intro:
      "Each Clerk Grade below shows the 1st-year and thereafter salary from the first full pay period on or after 1 July 2026, followed by each NSW Health Administration Officer level, whose award publishes weekly rates. Every salary links to the nearest take-home pay page.",
  },

  headline:
    "From the first full pay period on or after 1 July 2026, a NSW public servant at Clerk Grade 3 is paid $87,199 in the first year and $89,829 thereafter, Clerk Grade 5 $102,936 then $106,182, Clerk Grade 7 $116,981 then $120,478 and Clerk Grade 9 $133,348 then $137,098, under the Crown Employees (Public Sector - Salaries 2024) Award. NSW Health administration staff are on a separate award: an Administration Officer Level 1 starts at $1,138.62 a week.",

  metaTitle: "NSW Public Service Pay Rates 2026 — Clerk Grade 1–12 & NSW Health",
  metaDescription:
    "NSW public sector pay from 1 July 2026: every Clerk Grade 1 to 12 salary, NSW Health Administration Officer rates, the next increase date and each salary after tax.",

  instrument:
    "Administrative and clerical officers in the NSW public service are paid under the Crown Employees (Public Sector - Salaries 2024) Award, made by the Industrial Relations Commission of New South Wales. It is a state award, not a Fair Work instrument. NSW Health administrative staff are covered instead by the Health Employees' Administrative Staff (State) Award 2025.",

  payRise:
    "The Crown Employees award applied 4% from 1 July 2024, 3% from the first full pay period on or after 1 July 2025 and 3% from the first full pay period on or after 1 July 2026; it remains in force until 30 June 2027 and prints no later column. The NSW Health administrative staff award applied 4% from the first full pay period on or after 1 July 2025 and 4% from the first full pay period on or after 1 July 2026, and runs for two years from 1 July 2025. Both sets of rates on this page are the 1 July 2026 columns; neither award yet provides a July 2027 increase.",

  schedules: [
    {
      id: "nsw-crown-2026",
      title: "Crown Employees (Public Sector - Salaries 2024) Award — Administrative and Clerical Officers, from 1 July 2026",
      coverage:
        "Administrative and clerical officers in NSW public service agencies covered by the Crown Employees (Administrative and Clerical Officers - Salaries) Award 2007 table in Part B of the award.",
      basis: "award",
      effectiveFrom: "the first full pay period on or after 1 July 2026",
      rangeMeaning:
        "1st year of service and thereafter rates for the grade. Annual salary only — superannuation is paid on top.",
      sourceId: "nsw-crown-2024",
      streams: [
        {
          id: "nsw-clerks",
          name: "Administrative and Clerical Officers",
          description:
            "Grades 1 to 12, each with a 1st-year-of-service rate and a thereafter rate. The award prints \"Grade 1\", \"Grade 2\" and so on; job ads write the same grades as \"Clerk Grade 1/2\", \"Clerk Grade 9/10\" and so on when a role spans two grades.",
          bands: [
            {
              code: "Clerk Grade 1",
              name: "Administrative and Clerical Officer, Grade 1",
              aliases: ["clerk grade 1", "nsw clerk grade 1", "grade 1 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 78_000,
              max: 80_292,
              payPoints: [
                { label: "Grade 1, 1st year of service", annual: 78_000 },
                { label: "Grade 1, thereafter", annual: 80_292 },
              ],
            },
            {
              code: "Clerk Grade 2",
              name: "Administrative and Clerical Officer, Grade 2",
              aliases: ["clerk grade 2", "nsw clerk grade 2", "grade 2 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 82_533,
              max: 84_799,
              payPoints: [
                { label: "Grade 2, 1st year of service", annual: 82_533 },
                { label: "Grade 2, thereafter", annual: 84_799 },
              ],
            },
            {
              code: "Clerk Grade 3",
              name: "Administrative and Clerical Officer, Grade 3",
              aliases: ["clerk grade 3", "nsw clerk grade 3", "grade 3 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 87_199,
              max: 89_829,
              payPoints: [
                { label: "Grade 3, 1st year of service", annual: 87_199 },
                { label: "Grade 3, thereafter", annual: 89_829 },
              ],
            },
            {
              code: "Clerk Grade 4",
              name: "Administrative and Clerical Officer, Grade 4",
              aliases: ["clerk grade 4", "nsw clerk grade 4", "grade 4 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 92_632,
              max: 95_482,
              payPoints: [
                { label: "Grade 4, 1st year of service", annual: 92_632 },
                { label: "Grade 4, thereafter", annual: 95_482 },
              ],
            },
            {
              code: "Clerk Grade 5",
              name: "Administrative and Clerical Officer, Grade 5",
              aliases: ["clerk grade 5", "nsw clerk grade 5", "grade 5 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 102_936,
              max: 106_182,
              payPoints: [
                { label: "Grade 5, 1st year of service", annual: 102_936 },
                { label: "Grade 5, thereafter", annual: 106_182 },
              ],
            },
            {
              code: "Clerk Grade 6",
              name: "Administrative and Clerical Officer, Grade 6",
              aliases: ["clerk grade 6", "nsw clerk grade 6", "grade 6 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 110_345,
              max: 113_579,
              payPoints: [
                { label: "Grade 6, 1st year of service", annual: 110_345 },
                { label: "Grade 6, thereafter", annual: 113_579 },
              ],
            },
            {
              code: "Clerk Grade 7",
              name: "Administrative and Clerical Officer, Grade 7",
              aliases: ["clerk grade 7", "nsw clerk grade 7", "grade 7 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 116_981,
              max: 120_478,
              payPoints: [
                { label: "Grade 7, 1st year of service", annual: 116_981 },
                { label: "Grade 7, thereafter", annual: 120_478 },
              ],
            },
            {
              code: "Clerk Grade 8",
              name: "Administrative and Clerical Officer, Grade 8",
              aliases: ["clerk grade 8", "nsw clerk grade 8", "grade 8 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 125_500,
              max: 129_492,
              payPoints: [
                { label: "Grade 8, 1st year of service", annual: 125_500 },
                { label: "Grade 8, thereafter", annual: 129_492 },
              ],
            },
            {
              code: "Clerk Grade 9",
              name: "Administrative and Clerical Officer, Grade 9",
              aliases: ["clerk grade 9", "nsw clerk grade 9", "grade 9 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 133_348,
              max: 137_098,
              payPoints: [
                { label: "Grade 9, 1st year of service", annual: 133_348 },
                { label: "Grade 9, thereafter", annual: 137_098 },
              ],
            },
            {
              code: "Clerk Grade 10",
              name: "Administrative and Clerical Officer, Grade 10",
              aliases: ["clerk grade 10", "nsw clerk grade 10", "grade 10 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 142_695,
              max: 146_945,
              payPoints: [
                { label: "Grade 10, 1st year of service", annual: 142_695 },
                { label: "Grade 10, thereafter", annual: 146_945 },
              ],
            },
            {
              code: "Clerk Grade 11",
              name: "Administrative and Clerical Officer, Grade 11",
              aliases: ["clerk grade 11", "nsw clerk grade 11", "grade 11 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 154_231,
              max: 160_771,
              payPoints: [
                { label: "Grade 11, 1st year of service", annual: 154_231 },
                { label: "Grade 11, thereafter", annual: 160_771 },
              ],
            },
            {
              code: "Clerk Grade 12",
              name: "Administrative and Clerical Officer, Grade 12",
              aliases: ["clerk grade 12", "nsw clerk grade 12", "grade 12 nsw public service"],
              summary: "Two rates: 1st year of service, then thereafter.",
              min: 170_841,
              max: 178_369,
              payPoints: [
                { label: "Grade 12, 1st year of service", annual: 170_841 },
                { label: "Grade 12, thereafter", annual: 178_369 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "nsw-health-admin-2026",
      title: "Health Employees' Administrative Staff (State) Award 2025, from 1 July 2026",
      coverage:
        "Administrative staff employed in the NSW public health system — local health districts and specialty networks — under the Health Employees' Administrative Staff (State) Award 2025.",
      basis: "award",
      effectiveFrom: "the first full pay period on or after 1 July 2026",
      rangeMeaning:
        "First and last yearly step of the level. The award publishes weekly rates only; the annual figures are the weekly rate x 52, and each step shows the published weekly rate beside it.",
      sourceId: "nsw-health-admin-2025",
      note:
        "Level 2A 2nd year and Level 3 1st year are the same published rate ($1,416.58 a week). The same table also carries Telephonist rates, and the separate Health Employees' General Administrative Staff (State) Award 2025 sets General Administrative Grades 1 to 14; neither is reproduced here.",
      streams: [
        {
          id: "nsw-health-admin",
          name: "NSW Health Administration Officers",
          description:
            "Administration Officer Levels 1, 2, 2A and 3 to 6. There is no Level 7 or 8 in this award.",
          bands: [
            {
              code: "Administration Officer Level 1",
              name: "NSW Health Administration Officer Level 1",
              aliases: ["nsw health level 1", "health administration officer level 1"],
              summary: "5 yearly steps, published as weekly rates.",
              min: 59_208,
              max: 66_808,
              payPoints: [
                { label: "Level 1, 1st Year ($1,138.62 a week)", annual: 59_208 },
                { label: "Level 1, 2nd Year ($1,183.43 a week)", annual: 61_538 },
                { label: "Level 1, 3rd Year ($1,226.74 a week)", annual: 63_790 },
                { label: "Level 1, 4th Year ($1,255.25 a week)", annual: 65_273 },
                { label: "Level 1, 5th Year ($1,284.76 a week)", annual: 66_808 },
              ],
            },
            {
              code: "Administration Officer Level 2",
              name: "NSW Health Administration Officer Level 2",
              aliases: ["nsw health level 2", "health administration officer level 2"],
              summary: "2 yearly steps, published as weekly rates.",
              min: 69_035,
              max: 71_325,
              payPoints: [
                { label: "Level 2, 1st Year ($1,327.60 a week)", annual: 69_035 },
                { label: "Level 2, 2nd Year ($1,371.64 a week)", annual: 71_325 },
              ],
            },
            {
              code: "Administration Officer Level 2A",
              name: "NSW Health Administration Officer Level 2A",
              aliases: ["nsw health level 2a", "health administration officer level 2a"],
              summary: "2 yearly steps, published as weekly rates.",
              min: 72_621,
              max: 73_662,
              payPoints: [
                { label: "Level 2A, 1st Year ($1,396.56 a week)", annual: 72_621 },
                { label: "Level 2A, 2nd Year ($1,416.58 a week)", annual: 73_662 },
              ],
            },
            {
              code: "Administration Officer Level 3",
              name: "NSW Health Administration Officer Level 3",
              aliases: ["nsw health level 3", "health administration officer level 3"],
              summary: "2 yearly steps, published as weekly rates.",
              min: 73_662,
              max: 75_958,
              payPoints: [
                { label: "Level 3, 1st Year ($1,416.58 a week)", annual: 73_662 },
                { label: "Level 3, 2nd Year ($1,460.73 a week)", annual: 75_958 },
              ],
            },
            {
              code: "Administration Officer Level 4",
              name: "NSW Health Administration Officer Level 4",
              aliases: ["nsw health level 4", "health administration officer level 4"],
              summary: "2 yearly steps, published as weekly rates.",
              min: 77_916,
              max: 79_700,
              payPoints: [
                { label: "Level 4, 1st Year ($1,498.39 a week)", annual: 77_916 },
                { label: "Level 4, 2nd Year ($1,532.69 a week)", annual: 79_700 },
              ],
            },
            {
              code: "Administration Officer Level 5",
              name: "NSW Health Administration Officer Level 5",
              aliases: ["nsw health level 5", "health administration officer level 5"],
              summary: "2 yearly steps, published as weekly rates.",
              min: 82_056,
              max: 83_917,
              payPoints: [
                { label: "Level 5, 1st Year ($1,578.00 a week)", annual: 82_056 },
                { label: "Level 5, 2nd Year ($1,613.79 a week)", annual: 83_917 },
              ],
            },
            {
              code: "Administration Officer Level 6",
              name: "NSW Health Administration Officer Level 6",
              aliases: ["nsw health level 6", "health administration officer level 6"],
              summary: "2 yearly steps, published as weekly rates.",
              min: 86_599,
              max: 88_647,
              payPoints: [
                { label: "Level 6, 1st Year ($1,665.37 a week)", annual: 86_599 },
                { label: "Level 6, 2nd Year ($1,704.75 a week)", annual: 88_647 },
              ],
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "Each Clerk Grade has two rates: the 1st year of service and thereafter. After a year at the grade you move to the thereafter rate — a rise of $2,292 at Grade 1 and $7,528 at Grade 12 — and beyond that pay only moves with the award increases or a move to a higher grade.",
    "Most NSW public service roles are advertised across two grades, such as Clerk Grade 5/6 or Clerk Grade 9/10. The range in the ad runs from the 1st-year rate of the lower grade to the thereafter rate of the higher one: Clerk Grade 9/10 is $133,348 to $146,945 from 1 July 2026.",
    "NSW Health Administration Officers move through yearly steps within their level — five at Level 1 and two at every other level. Moving to a higher level is an appointment to a position graded at that level.",
  ],

  superannuation: {
    rate: null,
    text:
      "Superannuation is paid on top of the salaries on this page, not inside them, and never at less than the Superannuation Guarantee rate. The salary tables in both awards are salary only; this page does not state an above-guarantee rate because neither table publishes one.",
    sourceId: "nsw-crown-2024",
  },

  sources: [
    {
      id: "nsw-crown-2024",
      title: "Crown Employees (Public Sector - Salaries 2024) Award (C9875)",
      publisher: "NSW Industrial Relations Commission — Industrial Gazette",
      url: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9875",
      effectiveFrom: "first full pay period on or after 1 July 2026",
      verifiedOn: VERIFIED,
      note: "Part B, Administrative and Clerical Officers table, column 1.7.26; clause 3(iii)(c) for the date.",
    },
    {
      id: "nsw-health-admin-2025",
      title: "Health Employees' Administrative Staff (State) Award 2025 (C10078)",
      publisher: "NSW Industrial Relations Commission — Industrial Gazette",
      url: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C10078",
      effectiveFrom: "first full pay period on or after 1 July 2026",
      verifiedOn: VERIFIED,
      note: "Part B, Table 1 - Rates of Pay, column Ffppoa 01-Jul-2026; clause 8(i) for the date.",
    },
  ],

  unverified: [
    "NSW public service Senior Executive bands, which are set by the Statutory and Other Offices Remuneration Tribunal rather than this award.",
    "The Clerks General Scale and the other occupational tables in the Crown Employees award (correctional officers, police administrative officers, psychologists and others).",
    "NSW Health General Administrative Grades 1 to 14 and Telephonist rates.",
    "NSW Health nurses and NSW teachers, who are on their own awards (see the nurse and teacher pages).",
    "Any July 2027 increase — neither award provides one yet.",
  ],

  faqs: [
    {
      q: "What is the NSW public service pay scale in 2026?",
      a: "From the first full pay period on or after 1 July 2026, the Crown Employees (Public Sector - Salaries 2024) Award pays Clerk Grade 1 $78,000 in the first year rising to $80,292, through to Clerk Grade 12 at $170,841 rising to $178,369. Grade 5 pays $102,936 then $106,182, and Grade 9 pays $133,348 then $137,098.",
    },
    {
      q: "What is a Clerk Grade 9/10 salary?",
      a: "From 1 July 2026, $133,348 (Grade 9, 1st year) to $146,945 (Grade 10, thereafter). Grade 9 thereafter is $137,098 and Grade 10 1st year is $142,695.",
    },
    {
      q: "What are the NSW Health pay rates for administration staff?",
      a: "From the first full pay period on or after 1 July 2026, the Health Employees' Administrative Staff (State) Award 2025 pays an Administration Officer Level 1 $1,138.62 a week in the first year, rising to $1,284.76 in the fifth year, and a Level 6 $1,665.37 then $1,704.75 a week. The award publishes weekly rates only.",
    },
    {
      q: "What is a Clerk Grade 5/6 salary?",
      a: "From the first full pay period on or after 1 July 2026, $102,936 (Grade 5, 1st year of service) to $113,579 (Grade 6, thereafter). Grade 5 thereafter is $106,182 and Grade 6 1st year is $110,345.",
    },
    {
      q: "When is the next NSW public service pay rise?",
      a: "Neither award provides one yet. The 1 July 2026 increase — 3% for the Crown Employees award and 4% for the NSW Health administrative staff award — is the last column in each. The Crown Employees award remains in force until 30 June 2027.",
    },
  ],
};
