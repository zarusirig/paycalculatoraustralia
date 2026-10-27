// New South Wales — NSW Ambulance paramedic salaries.
//
// Source of every figure: NSW Ambulance Paramedics (State) Award 2026, made by
// the Industrial Relations Commission of NSW (Case No. 2026/312775, Justice I.
// Taylor, President, 5 August 2026) and published on the IRC's award 008 page on
// 27 August 2026 (Serial C10190). Read in full on 24 September 2026.
//
// The award rescinds and replaces the NSW Ambulance Paramedics (State) Award
// 2023, takes effect from 1 July 2026 for one year, and its Section 8 rates apply
// from the first full pay period on or after (ffppoa) 1 July 2026. Table 1A
// prints two columns: ffppoa 1 July 2025 and ffppoa 1 July 2026. The 1 July 2026
// column is the one in force on 24 September 2026 and is what this file
// publishes. The award publishes WEEKLY rates only; annual figures below are the
// weekly rate x 52.143, rounded to the dollar, with the weekly rate quoted in
// each row's note.
//
// Cross-check: the award's 1 July 2025 column matches the ffppoa 1 July 2025
// column of the 2023 award as published at Serial C9809 (e.g. Paramedic Intern
// $1,587.20, Paramedic increment 6 $1,942.06 a week).
//
// Known defect in the source: Table 1B (Management Staff Wages) prints the
// 1 January 2025 management rates under its "1 July 2025" heading. The 1 July
// 2026 management column itself is used here; the mislabelled column is not.

import type { ServicePayJurisdiction } from "../types";

export const NSW_PARAMEDIC_PAY: ServicePayJurisdiction = {
  occupation: "paramedic",
  slug: "nsw",
  code: "NSW",
  name: "New South Wales",
  nameInSentence: "New South Wales",
  employer: "NSW Ambulance",
  agreementName: "NSW Ambulance Paramedics (State) Award 2026",
  agreementUrl:
    "https://irc.nsw.gov.au/industrial-instruments/awards/current-awards/008---nsw-ambulance-paramedics--state--award.html",
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  entryStep: "Paramedic Intern",
  topStep: "Paramedic (Level 1, Band 1, Increment 6)",

  scales: [
    {
      id: "paramedics",
      title: "Paramedic entry level and Paramedic Level 1 (Table 1A)",
      intro:
        "Trainee Paramedics, Paramedic Interns and qualified Paramedics employed by NSW Ambulance. Paramedics move up one increment automatically after each 12 months.",
      stepHeading: "Classification",
      effectiveFrom: "1 July 2026",
      steps: [
        { label: "Trainee Paramedic", salary: 74_254, note: "$1,424.05 a week (Entry, Band 1, Increment 1)" },
        { label: "Paramedic Intern", salary: 84_416, note: "$1,618.94 a week (Entry, Band 1, Increment 2)" },
        { label: "Paramedic (Level 1, Band 1, Increment 1)", salary: 89_814, note: "$1,722.45 a week" },
        { label: "Paramedic (Level 1, Band 1, Increment 2)", salary: 92_510, note: "$1,774.16 a week" },
        { label: "Paramedic (Level 1, Band 1, Increment 3)", salary: 95_205, note: "$1,825.85 a week" },
        { label: "Paramedic (Level 1, Band 1, Increment 4)", salary: 97_900, note: "$1,877.53 a week" },
        { label: "Paramedic (Level 1, Band 1, Increment 5)", salary: 100_595, note: "$1,929.22 a week" },
        {
          label: "Paramedic (Level 1, Band 1, Increment 6)",
          salary: 103_290,
          note: "$1,980.90 a week - top of the Paramedic scale",
        },
      ],
    },
    {
      id: "specialist",
      title: "Paramedic Specialist and Critical Care (Table 1A)",
      intro:
        "Paramedic Specialist (Level 2) covers Intensive Care Paramedics and Extended Care Paramedics. Level 3 covers aeromedical critical care roles. Movement between levels is by appointment, not automatic.",
      stepHeading: "Classification",
      effectiveFrom: "1 July 2026",
      steps: [
        { label: "Paramedic Specialist (Level 2, Band 1, Increment 1)", salary: 110_517, note: "$2,119.50 a week" },
        { label: "Paramedic Specialist (Level 2, Band 1, Increment 2)", salary: 113_833, note: "$2,183.09 a week" },
        { label: "Paramedic Specialist (Level 2, Band 1, Increment 3)", salary: 117_248, note: "$2,248.58 a week" },
        {
          label: "Critical Care Paramedic (Aeromedical) (Level 3, Band 1, Increment 1)",
          salary: 123_963,
          note: "$2,377.37 a week (printed as \"Critical Care (Aeromedical)\" in the table)",
        },
        {
          label: "Critical Care Paramedic (Aeromedical) (Level 3, Band 1, Increment 2)",
          salary: 127_174,
          note: "$2,438.95 a week",
        },
        {
          label: "Critical Care Paramedic (Aeromedical) Team Leader (Level 3, Band 3, Increment 1)",
          salary: 133_537,
          note: "$2,560.97 a week",
        },
        { label: "Clinical Training Officer (Level 4, Band 1, Increment 1)", salary: 132_500, note: "$2,541.08 a week" },
        { label: "Paramedic Educator (Level 4, Band 2, Increment 1)", salary: 158_749, note: "$3,044.49 a week" },
        { label: "Paramedic Educator (Level 4, Band 2, Increment 2)", salary: 169_517, note: "$3,251.00 a week" },
      ],
    },
    {
      id: "management",
      title: "Management staff (Table 1B)",
      intro:
        "Registered paramedics appointed to management roles. Manager Level 1 includes Team Leader and VCCC Clinical Team Leader positions.",
      stepHeading: "Management level",
      effectiveFrom: "1 July 2026",
      steps: [
        { label: "Management Level 1", salary: 121_192, note: "$2,324.23 a week (includes Team Leader)" },
        { label: "Management Level 2", salary: 125_818, note: "$2,412.94 a week" },
        { label: "Management Level 3", salary: 130_431, note: "$2,501.40 a week" },
      ],
    },
  ],

  traineePay: [
    "A Trainee Paramedic is paid $1,424.05 a week from the first full pay period on or after 1 July 2026 (about $74,254 a year). A Trainee Paramedic is undertaking the training and work experience required to become a Paramedic Intern.",
    "A Paramedic Intern - a registered paramedic completing the NSW Ambulance internship program - is paid $1,618.94 a week (about $84,416 a year).",
    "After the internship, a Paramedic starts at Level 1, Band 1, Increment 1 on $1,722.45 a week (about $89,814 a year) and moves up an increment automatically after each 12 months, to $1,980.90 a week (about $103,290 a year) at Increment 6.",
  ],

  penalties: [
    "Afternoon shift starting at or after 10am and before 1pm: 10% extra; starting at or after 1pm and before 4pm: 12.5% extra (clause 30).",
    "Night shift starting at or after 4pm and before 4am: 15% extra; starting at or after 4am and before 6am: 10% extra (clause 30).",
    "Ordinary hours on Saturday are paid at time and a half and on Sunday at time and three-quarters, instead of the shift premiums (clause 30).",
    "Work on a public holiday is paid at double time and a half for employees covered by clause 32(c)(i) and (ii) of the award (clause 31).",
    "On-call allowance: $31.00 per 24 hours or $124.40 a week from ffppoa 1 July 2026 (Table 2D).",
  ],

  notices: [
    "The NSW Ambulance Paramedics (State) Award 2026 was made on 5 August 2026 and published on 27 August 2026, with its rates backdated to the first full pay period on or after 1 July 2026. Paramedics paid at the old rate after 1 July 2026 should expect back pay.",
    "The 2026 award runs for one year from 1 July 2026. It contains no further scheduled increase, so the next rise depends on a new award or variation.",
  ],

  unverified: [
    "Allowances marked TBC in the award (travelling and overtime meal allowances, living away from home) are not published here because the award itself does not state an amount.",
    "The award's Table 1B heading for management staff labels its first column \"1 July 2025\" but prints the 1 January 2025 rates. Only the 1 July 2026 management column is used here.",
  ],

  sources: [
    {
      title: "NSW Ambulance Paramedics (State) Award 2026 (Serial C10190, PDF)",
      publisher: "Industrial Relations Commission of NSW",
      url: "https://irc.nsw.gov.au/content/dam/dcj/ctsd/irc/documents/current-awards/008---nsw-ambulance-paramedics-state-award/20260805-008-AIRC-C10190.pdf",
    },
    {
      title: "008 - NSW Ambulance Paramedics (State) Award (award history page)",
      publisher: "Industrial Relations Commission of NSW",
      url: "https://irc.nsw.gov.au/industrial-instruments/awards/current-awards/008---nsw-ambulance-paramedics--state--award.html",
    },
    {
      title: "NSW Ambulance Paramedics (State) Award 2023 (Serial C9809)",
      publisher: "NSW Industrial Gazette",
      url: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9809",
    },
  ],

  faqs: [
    {
      q: "How much does a paramedic earn in NSW?",
      a: "Under the NSW Ambulance Paramedics (State) Award 2026, a qualified NSW Ambulance paramedic earns $1,722.45 to $1,980.90 a week base from the first full pay period on or after 1 July 2026 - about $89,814 to $103,290 a year. Shift, weekend and public holiday penalties are paid on top.",
    },
    {
      q: "What does a graduate paramedic earn in NSW?",
      a: "A Paramedic Intern with NSW Ambulance is paid $1,618.94 a week (about $84,416 a year) from 1 July 2026. A Trainee Paramedic is paid $1,424.05 a week (about $74,254 a year).",
    },
    {
      q: "How much does an intensive care paramedic earn in NSW?",
      a: "Intensive Care Paramedics are classified as Paramedic Specialist (Level 2) and are paid $2,119.50 to $2,248.58 a week - about $110,517 to $117,248 a year - from 1 July 2026. Critical Care Paramedics (Aeromedical) are paid $2,377.37 to $2,438.95 a week (about $123,963 to $127,174 a year).",
    },
    {
      q: "When is the next NSW paramedic pay rise?",
      a: "The 2026 award runs for one year from 1 July 2026 and schedules no further increase. Any rise after that needs a new award or variation from the Industrial Relations Commission.",
    },
  ],
};
