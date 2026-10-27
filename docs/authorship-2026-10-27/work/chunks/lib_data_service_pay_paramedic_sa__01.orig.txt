// South Australia — SA Ambulance Service (SAAS) paramedic salaries.
//
// Source of every figure: SA Ambulance Service Enterprise Agreement 2025,
// approved by the South Australian Employment Tribunal (Commissioner Kaur,
// case ET-26-00076) on 16 February 2026, in force from 16 February 2026 with a
// nominal life to 31 December 2028. Read in full on 24 September 2026 from the
// approved agreement published by the SA Attorney-General's Department.
//
// Clause 15.2: increases from the first full pay period on or after
// 31 December 2025 (3.5%), 31 December 2026 (3.5%), 31 December 2027 (3.5%) and
// 31 December 2028 (3.0%). Clause 16: new pay points take effect from the first
// full pay period on or after 1 July 2026, and pay points marked for deletion
// are removed on that date.
//
// Schedule 1 prints ANNUAL salaries in columns 31-Dec-24, 31-Dec-25, 1-Jul-26,
// 31-Dec-26 (and 1-Jul-27 for some tables), 31-Dec-27 and 31-Dec-28. On
// 24 September 2026 the rate in force for each pay point is its 1-Jul-26 figure
// where one is printed, otherwise its 31-Dec-25 figure. Pay points that end at
// 1 July 2026 (e.g. Intern 1.1, ICP 3.2) are omitted; pay point 2.8, which
// starts 1 July 2027, is not yet in force and is omitted.

import type { ServicePayJurisdiction } from "../types";

export const SA_PARAMEDIC_PAY: ServicePayJurisdiction = {
  occupation: "paramedic",
  slug: "sa",
  code: "SA",
  name: "South Australia",
  nameInSentence: "South Australia",
  employer: "SA Ambulance Service",
  agreementName: "SA Ambulance Service Enterprise Agreement 2025",
  agreementUrl:
    "https://www.agd.sa.gov.au/__data/assets/pdf_file/0020/809012/ET-26-00076-SA-Ambulance-Service-Enterprise-Agreement-2025.pdf",
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: {
    date: "31 December 2026",
    detail:
      "A 3.5% increase from the first full pay period on or after 31 December 2026 is printed in Schedule 1: Intern (pay point 1.2) goes to $79,753, Paramedic pay point 2.1 to $86,841 and pay point 2.7 to $108,114. A new top Paramedic pay point 2.8 ($111,654) starts on 1 July 2027.",
  },
  verifiedOn: "24 September 2026",

  entryStep: "Intern - pay point 1.2",
  topStep: "Paramedic - pay point 2.7",

  scales: [
    {
      id: "paramedics",
      title: "Intern and Paramedic (Schedule 1, Parts 2.2 and 2.3)",
      intro:
        "Graduate interns and qualified Paramedics in SAAS emergency operations. Pay points 2.1 and 2.2 also cover Paramedic Defined Practice. Rates are annual base salary.",
      stepHeading: "Classification and pay point",
      steps: [
        { label: "Intern - pay point 1.2", salary: 77_059, note: "From 1 July 2026 (pay point 1.1 deleted on that date)" },
        { label: "Paramedic - pay point 2.1", salary: 83_904, note: "From 31 December 2025; also Paramedic Defined Practice" },
        { label: "Paramedic - pay point 2.2", salary: 87_329, note: "From 31 December 2025; also Paramedic Defined Practice" },
        { label: "Paramedic - pay point 2.3", salary: 90_756, note: "From 31 December 2025" },
        { label: "Paramedic - pay point 2.4", salary: 94_182, note: "From 31 December 2025" },
        { label: "Paramedic - pay point 2.5", salary: 97_607, note: "From 31 December 2025" },
        { label: "Paramedic - pay point 2.6", salary: 101_029, note: "From 31 December 2025" },
        { label: "Paramedic - pay point 2.7", salary: 104_458, note: "New pay point from 1 July 2026" },
      ],
    },
    {
      id: "intensive-care",
      title: "Intensive Care Paramedic (Schedule 1, Part 2.5)",
      intro: "Intensive Care Paramedics (ICPs) and ICP interns. ICP pay points 3.2 and 3.3 were deleted from 1 July 2026.",
      stepHeading: "Classification and pay point",
      steps: [
        { label: "Intensive Care Paramedic Intern - pay point 3.3", salary: 107_878, note: "From 1 July 2026" },
        { label: "Intensive Care Paramedic - pay point 3.4", salary: 111_306, note: "From 31 December 2025" },
        { label: "Intensive Care Paramedic - pay point 3.5", salary: 114_727, note: "From 31 December 2025" },
        { label: "Intensive Care Paramedic - pay point 3.6", salary: 118_168, note: "New pay point from 1 July 2026" },
      ],
    },
    {
      id: "sot-ecp",
      title: "Special Operations Team, Retrieval ICP and Extended Care Paramedics (Schedule 1, Part 2.8)",
      intro: "SOT/Retrieval Intensive Care Paramedics and Extended Care Paramedics (ECP).",
      stepHeading: "Classification and pay point",
      steps: [
        { label: "SOT/Retrieval ICP, ECP - pay point 5.1", salary: 135_277, note: "From 31 December 2025" },
        { label: "SOT/Retrieval ICP, ECP - pay point 5.2", salary: 138_700, note: "From 31 December 2025" },
        { label: "SOT/Retrieval ICP, ECP - pay point 5.3", salary: 143_840, note: "From 31 December 2025" },
        { label: "SOT/Retrieval ICP, ECP - pay point 5.4", salary: 147_262, note: "New pay point from 1 July 2026" },
      ],
    },
    {
      id: "icp-team-leaders",
      title: "Intensive Care Paramedic Team Leaders (Schedule 1, Part 3.2)",
      intro:
        "ICP Clinical Team Leaders (CTL), Regional Team Leaders (RTL) and Area Clinical Team Leaders (ACTL). Pay depends on the number of reports.",
      stepHeading: "Classification and pay point",
      steps: [
        { label: "CTL/RTL <12 reports - pay point 4.1", salary: 119_867, note: "From 31 December 2025" },
        { label: "CTL/RTL <12 reports - pay point 4.2", salary: 123_287, note: "From 31 December 2025" },
        { label: "CTL/RTL <12 reports - pay point 4.3", salary: 126_714, note: "New pay point from 1 July 2026" },
        { label: "CTL/RTL >12 reports, ACTL - pay point 5.3", salary: 143_840, note: "From 31 December 2025" },
        { label: "CTL/RTL >12 reports, ACTL - pay point 5.4", salary: 147_262, note: "From 31 December 2025" },
        { label: "CTL/RTL >12 reports, ACTL - pay point 5.5", salary: 150_207, note: "New pay point from 1 July 2026" },
      ],
    },
  ],

  traineePay: [
    "From 1 July 2026 a SAAS Intern is paid $77,059 a year (pay point 1.2); the lower Intern pay point 1.1 was deleted on that date.",
    "Student Ambulance Officers in the Sponsored Paramedic Degree Program are paid $72,776 (SPDP 1.1) to $80,531 (SPDP 1.4) a year from 1 July 2026.",
    "Qualified Paramedics start at pay point 2.1 ($83,904 a year) and progress to pay point 2.7 ($104,458 a year from 1 July 2026). Incremental progression under the new pay points occurs yearly on 1 July.",
  ],

  penalties: [
    "Shift workers not on a rolled-in rate get an early morning penalty of 17% for work between midnight and 6:30am, or a night shift penalty of 20.5% for night shifts between 7pm and 7am (clause 18).",
    "Most rostered emergency staff are paid a rolled-in rate (RIR) allowance on top of base salary instead of separate shift penalties - 37.57% of base for the Metro Emergency Operations Day/Night roster (Schedule 4).",
    "Casual employees receive a 25% loading (clause 14.6); casuals working weekends get the 50% weekend penalty under clause 17.10.2 of the Award (clause 38.2).",
    "Work on part-day public holidays (Christmas Eve and New Year's Eve from 7pm) and Easter Sunday attracts Award penalty rates even for employees on the rolled-in rate (clause 20).",
  ],

  notices: [
    "The SA Ambulance Service Enterprise Agreement 2025 was approved by SAET on 16 February 2026 with the first 3.5% increase backdated to the first full pay period on or after 31 December 2025.",
    "New pay points (including Paramedic 2.7 and ICP 3.6) took effect from 1 July 2026, when several older pay points were deleted.",
  ],

  unverified: [
    "Patient transport, Emergency Support Service, Clinical Instructor, SPRINT, ICP Solo Responder, paramedic team leader (Part 3.1) and operational management pay points are in Schedule 1 but are not reproduced here.",
  ],

  sources: [
    {
      title: "SA Ambulance Service Enterprise Agreement 2025 (ET-26-00076), with SAET approval order",
      publisher: "SA Attorney-General's Department / South Australian Employment Tribunal",
      url: "https://www.agd.sa.gov.au/__data/assets/pdf_file/0020/809012/ET-26-00076-SA-Ambulance-Service-Enterprise-Agreement-2025.pdf",
    },
  ],

  faqs: [
    {
      q: "How much does a paramedic earn in SA?",
      a: "Under the SA Ambulance Service Enterprise Agreement 2025, a SAAS Paramedic earns $83,904 (pay point 2.1) to $104,458 (pay point 2.7) a year in base salary. Most rostered paramedics also receive a rolled-in rate allowance - 37.57% of base on the metropolitan day/night roster.",
    },
    {
      q: "What does a graduate paramedic earn in SA?",
      a: "A SAAS Intern is paid $77,059 a year from 1 July 2026, rising to $79,753 from the first full pay period on or after 31 December 2026.",
    },
    {
      q: "How much does an intensive care paramedic earn in SA?",
      a: "An Intensive Care Paramedic with SAAS is paid $111,306 to $118,168 a year (pay points 3.4 to 3.6); an ICP Intern is paid $107,878. SOT/Retrieval ICPs and Extended Care Paramedics are paid $135,277 to $147,262.",
    },
    {
      q: "When is the next SA paramedic pay rise?",
      a: "The next increase is 3.5% from the first full pay period on or after 31 December 2026, followed by 3.5% from 31 December 2027 and 3.0% from 31 December 2028.",
    },
  ],
};
