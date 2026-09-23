// Queensland — Queensland Ambulance Service (QAS) paramedic salaries.
//
// Instrument: Queensland Ambulance Service Certified Agreement 2025 (QASCA
// 2025), certified by the Queensland Industrial Relations Commission on
// 27 November 2025 (Matter CB/2025/140), nominal expiry 31 August 2028. Read in
// full on 24 September 2026.
//
// Clause 23.2 schedules increases of 3% from 1 September 2025, 2.5% from
// 1 September 2026 and 2.5% from 1 September 2027, plus a CPI Uplift Adjustment
// (CUA). The March 2026 Brisbane CPI (4.2%) triggered the maximum 0.5% CUA for
// year 1, so QAS republished Schedule 1 with year 1 lifted to 3.5% and years 2
// and 3 recalculated (clause 23.6.2 says the schedule rates increase when a CUA
// crystallises). The figures below are the "Rate as at 01.09.2026" column of
// that QAS-published "QASCA 2025 Schedule 1 Updated Wage Rates" document, which
// is the column in force on 24 September 2026. The originally certified
// Schedule 1 (before the CUA) is superseded and is not used.
//
// The schedule prints an annual salary and a fortnightly rate for each level,
// band and increment. Role names (ACP, CCP) are mapped from Schedule 3
// (Progression and Maintenance Arrangements) of the certified agreement.

import type { ServicePayJurisdiction } from "../types";

export const QLD_PARAMEDIC_PAY: ServicePayJurisdiction = {
  occupation: "paramedic",
  slug: "qld",
  code: "QLD",
  name: "Queensland",
  nameInSentence: "Queensland",
  employer: "Queensland Ambulance Service",
  agreementName: "Queensland Ambulance Service Certified Agreement 2025",
  agreementUrl: "https://www.qirc.qld.gov.au/sites/default/files/2025-12/2025_cb140.pdf",
  ratesEffectiveFrom: "1 September 2026",
  nextIncrease: {
    date: "1 September 2027",
    detail:
      "A further 2.5% from 1 September 2027 is written into the agreement and printed in the updated schedule: Level 2, Band 1, Increment 1 goes to $89,043 and Level 2, Band 2, Increment 7 to $110,201. A CPI Uplift Adjustment of up to 1% may be added if the March 2027 Brisbane CPI exceeds 2.5%.",
  },
  verifiedOn: "24 September 2026",

  entryStep: "Level 2, Band 1, Increment 1",
  topStep: "Level 2, Band 2, Increment 7",

  scales: [
    {
      id: "advanced-care-paramedic",
      title: "Advanced Care Paramedic (ACP) - Level 2",
      intro:
        "Graduate paramedics start at Level 2, Band 1 while completing the QAS internship; qualified Advanced Care Paramedics are paid at Level 2, Band 2. Increments 6 and 7 are the senior increments.",
      stepHeading: "Level, band and increment",
      effectiveFrom: "1 September 2026",
      steps: [
        {
          label: "Level 2, Band 1, Increment 1",
          salary: 86_877,
          note: "$3,330 a fortnight - graduate starting an internship program (first 6 months)",
        },
        {
          label: "Level 2, Band 1, Increment 2",
          salary: 88_808,
          note: "$3,404 a fortnight - continuing the internship (next 6 months)",
        },
        { label: "Level 2, Band 2, Increment 1", salary: 93_452, note: "$3,582 a fortnight - qualified ACP" },
        { label: "Level 2, Band 2, Increment 2", salary: 95_826, note: "$3,673 a fortnight" },
        { label: "Level 2, Band 2, Increment 3", salary: 98_148, note: "$3,762 a fortnight" },
        { label: "Level 2, Band 2, Increment 4", salary: 100_548, note: "$3,854 a fortnight" },
        { label: "Level 2, Band 2, Increment 5", salary: 102_818, note: "$3,941 a fortnight" },
        { label: "Level 2, Band 2, Increment 6", salary: 105_166, note: "$4,031 a fortnight - senior level" },
        { label: "Level 2, Band 2, Increment 7", salary: 107_514, note: "$4,121 a fortnight - senior level" },
      ],
    },
    {
      id: "critical-care-paramedic",
      title: "Critical Care Paramedic (CCP) and extended roles - Level 3",
      intro:
        "Level 3, Band 1 covers Extended Role (ACP) positions and the CCP internship (Band 1, Increment 1); qualified Critical Care Paramedics are paid at Band 2; Band 3 covers Extended Role (CCP) positions.",
      stepHeading: "Level, band and increment",
      effectiveFrom: "1 September 2026",
      steps: [
        {
          label: "Level 3, Band 1, Increment 1",
          salary: 109_888,
          note: "$4,212 a fortnight - CCP intern, or Extended Role (ACP) increment 1",
        },
        { label: "Level 3, Band 1, Increment 2", salary: 112_210, note: "$4,301 a fortnight - Extended Role (ACP)" },
        { label: "Level 3, Band 1, Increment 3", salary: 114_558, note: "$4,391 a fortnight - Extended Role (ACP)" },
        { label: "Level 3, Band 2, Increment 1", salary: 114_558, note: "$4,391 a fortnight - qualified CCP" },
        { label: "Level 3, Band 2, Increment 2", salary: 117_793, note: "$4,515 a fortnight" },
        { label: "Level 3, Band 2, Increment 3", salary: 121_028, note: "$4,639 a fortnight" },
        { label: "Level 3, Band 2, Increment 4", salary: 124_315, note: "$4,765 a fortnight - CCP senior level" },
        { label: "Level 3, Band 2, Increment 5", salary: 127_577, note: "$4,890 a fortnight - CCP senior level" },
        { label: "Level 3, Band 3, Increment 1", salary: 128_542, note: "$4,927 a fortnight - Extended Role (CCP)" },
        { label: "Level 3, Band 3, Increment 2", salary: 131_829, note: "$5,053 a fortnight - Extended Role (CCP)" },
        { label: "Level 3, Band 3, Increment 3", salary: 135_064, note: "$5,177 a fortnight - Extended Role (CCP)" },
      ],
    },
  ],

  traineePay: [
    "Graduates with a paramedic science degree start at Level 2, Band 1, Increment 1 while they complete QAS induction and the first half of the internship program: $86,877 a year ($3,330 a fortnight) from 1 September 2026.",
    "After six months they move to Level 2, Band 1, Increment 2 ($88,808 a year, $3,404 a fortnight) to finish the internship, then to Level 2, Band 2 as a qualified Advanced Care Paramedic ($93,452 a year at Increment 1).",
    "Critical Care Paramedic interns (who already hold a Graduate Diploma in Intensive Care Paramedical Practice or equivalent) are paid at Level 3, Band 1, Increment 1: $109,888 a year.",
  ],

  penalties: [
    "Shift allowance: 12.5% of the ordinary base hourly rate for each hour of an afternoon shift and 15% for each hour of a night shift (clause 26.1.1). Not paid for shifts that attract weekend, public holiday or overtime penalties.",
    "Night coverage allowance from 1 March 2026: 5% of the Level 2, Band 2, Increment 5 ordinary base hourly rate for each full ordinary hour of a night shift worked (clause 26.2).",
    "Ordinary time between midnight Friday and midnight Saturday is paid at time and a half; between midnight Saturday and midnight Sunday at double time (clause 26.10.1).",
  ],

  notices: [
    "The CPI Uplift Adjustment was triggered by the March 2026 Brisbane CPI of 4.2%, lifting the year-one increase from 3% to 3.5%. QAS says the wage increase and back pay were paid on 24 June 2026 and allowance increases on 8 July 2026.",
    "The 2.5% increase due on 1 September 2026 is written into the certified agreement; the recalculated 1 September 2026 rates are published by QAS in its updated Schedule 1.",
  ],

  unverified: [
    "Level 4 and Level 5 supervisory and management rates are printed in the schedule but are not reproduced here because the role titles attached to each band were not confirmed from Schedule 3.",
    "Level 1 (patient transport and Ambulance Technician pathway) rates are not reproduced here.",
  ],

  sources: [
    {
      title: "Queensland Ambulance Service Certified Agreement 2025 (CB/2025/140)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2025-12/2025_cb140.pdf",
    },
    {
      title: "QASCA 2025 Schedule 1 Updated Wage Rates",
      publisher: "Queensland Ambulance Service",
      url: "https://www.ambulance.qld.gov.au/__data/assets/pdf_file/0034/484918/Schedule-1-Updated-Wage-rates-2026.pdf",
    },
    {
      title: "Queensland Ambulance Service Certified Agreement 2025 (QASCA 2025) - CPI Uplift Adjustment update",
      publisher: "Queensland Ambulance Service",
      url: "https://www.ambulance.qld.gov.au/certified-agreement-2025",
    },
  ],

  faqs: [
    {
      q: "How much does a paramedic earn in Queensland?",
      a: "A qualified Advanced Care Paramedic with the Queensland Ambulance Service is paid $93,452 to $107,514 a year base (Level 2, Band 2, Increments 1 to 7) from 1 September 2026, under the QAS Certified Agreement 2025 as updated for the CPI Uplift Adjustment. Shift allowances and weekend penalties are extra.",
    },
    {
      q: "What does a graduate paramedic earn in Queensland?",
      a: "A graduate paramedic starting the QAS internship is paid $86,877 a year ($3,330 a fortnight) at Level 2, Band 1, Increment 1 from 1 September 2026, rising to $88,808 after six months.",
    },
    {
      q: "How much does a critical care paramedic earn in Queensland?",
      a: "A qualified Critical Care Paramedic is paid $114,558 to $127,577 a year (Level 3, Band 2, Increments 1 to 5) from 1 September 2026. Extended Role (CCP) positions at Level 3, Band 3 are paid up to $135,064.",
    },
    {
      q: "When is the next QAS pay rise?",
      a: "The next scheduled increase is 2.5% from 1 September 2027, plus up to 1% more if the March 2027 Brisbane CPI exceeds 2.5%.",
    },
  ],
};
