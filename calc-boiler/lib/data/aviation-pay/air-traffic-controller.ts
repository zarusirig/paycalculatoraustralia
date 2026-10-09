// Air traffic controller pay — Airservices Australia.
//
// Source of every salary: Attachment 1 of the Airservices Australia (Air
// Traffic Control and Supporting Air Traffic Services) Enterprise Agreement
// 2024-2027 (AG2024/2680, [2024] FWCA 3415), read in full on 24 September 2026
// from the PDF Airservices publishes, and cross-checked against the separate
// "Air Traffic Control Classification Base Salary 2024-2027" PDF linked from the
// Airservices ATC careers FAQ (identical figures).
//
// The FWC decision (as corrected) says the agreement operates from 7 October
// 2024 with a nominal expiry date of 7 October 2027. Attachment 1 prints three
// salary columns headed "On Commencement" (4%), "12 months" (3.8%) and
// "24 months" (3.4%).
//
// ROLLED 9 October 2026: the "24 months" column is in force from 7 October 2026
// (24 months after the 7 October 2024 commencement). Every salary in ATC_PAY
// below is now the "24 months" column, re-read on 9 October 2026 from
// Attachment 1 of the agreement PDF (pages 124–127: ATC, ADT, SSO and FDC
// tables) and the separate ATC base salary PDF:
//   https://www.airservicesaustralia.com/wp-content/uploads/2024/11/Enterprise_Agreement_2024-2027.pdf
//   https://www.airservicesaustralia.com/wp-content/uploads/2024/11/ATC_Classification_Base_Salary.pdf
// The superseded "12 months" ATC column is kept as ATC_12_MONTH_COLUMN for the
// before/after figures in the October 2026 news article.

import type { AviationPayPage } from "./types";

export const ATC_PAY: AviationPayPage = {
  slug: "air-traffic-controller",
  instrument: {
    name: "Airservices Australia (Air Traffic Control and Supporting Air Traffic Services) Enterprise Agreement 2024-2027",
    url: "https://www.airservicesaustralia.com/wp-content/uploads/2024/11/Enterprise_Agreement_2024-2027.pdf",
    status:
      "Approved by the Fair Work Commission on 30 September 2024 ([2024] FWCA 3415, AG2024/2680); operates from 7 October 2024; nominal expiry date 7 October 2027.",
  },
  ratesEffectiveFrom: "7 October 2026",
  // The "24 months" column is the agreement's last; none is scheduled after it.
  scheduledIncreases: [],
  verifiedOn: "9 October 2026",

  scales: [
    {
      id: "atc-classification",
      title: "Air traffic controller classification and base salary (Attachment 1)",
      intro:
        "Base salaries for Airservices air traffic controllers, from ab initio trainee through the licensed Level 1 to Level 10 scale to the supervisor classifications. Figures are the agreement's \"24 months\" column, in force from 7 October 2026.",
      stepHeading: "Classification",
      steps: [
        { label: "Ab Initio Trainee", salary: 64_398, note: "In initial training, before any ATC licence" },
        { label: "Field Trainee", salary: 92_251, note: "On-the-job final field training" },
        { label: "Level 1", salary: 125_564 },
        { label: "Level 2", salary: 140_941 },
        { label: "Level 3", salary: 156_315 },
        { label: "Level 4", salary: 169_981 },
        { label: "Level 5", salary: 183_648 },
        { label: "Level 6", salary: 199_878 },
        { label: "Level 7", salary: 213_544 },
        { label: "Level 8", salary: 227_212 },
        { label: "Level 9", salary: 234_898 },
        { label: "Level 10", salary: 243_589, note: "Top of the controller progression scale" },
        {
          label: "SY TTCU",
          salary: 260_422,
          note: "Grandfathered: closed to new employees from 1 July 2025",
        },
        { label: "UTS", salary: 266_142, note: "Unit Tower Supervisor" },
        { label: "CSS / SS", salary: 266_142 },
        {
          label: "SY CSS/Supervisor",
          salary: 286_463,
          note: "Grandfathered: closed to new employees from 1 July 2025",
        },
      ],
    },
    {
      id: "fdc-classification",
      title: "Flight Data Co-ordinator (FDC) classification and base salary",
      intro:
        "Base salaries for Flight Data Co-ordinators covered by the same agreement. Figures are the \"24 months\" column, in force from 7 October 2026.",
      stepHeading: "Classification",
      steps: [
        { label: "FDC Trainee", salary: 91_854 },
        { label: "FDC Level 1", salary: 116_946 },
        { label: "FDC Level 2", salary: 126_405 },
        { label: "FDC Level 3", salary: 129_655 },
        { label: "FDC Level 4", salary: 133_189 },
        { label: "FDC Level 5", salary: 142_569 },
        { label: "FDC Level 6", salary: 147_429 },
        { label: "FDC Level 7", salary: 152_883 },
        { label: "FDC Supervisor", salary: 176_948 },
      ],
    },
    {
      id: "sso-classification",
      title: "Simulator Support Officer (SSO) classification and base salary",
      intro:
        "Base salaries for Simulator Support Officers, who support ATC training simulators. Figures are the \"24 months\" column, in force from 7 October 2026.",
      stepHeading: "Classification",
      steps: [
        { label: "Trainee", salary: 87_184 },
        { label: "SSO1 - Level 1", salary: 95_766 },
        { label: "SSO2 - Level 2", salary: 101_463 },
        { label: "SSO3 - Level 3", salary: 107_222 },
        { label: "SSO4 - Level 4", salary: 110_579 },
        { label: "SSO5 - Level 5 Fully Endorsed SSO", salary: 114_002 },
        { label: "SSO6 - Level 6 Multi-Skilled SSO", salary: 118_220 },
        { label: "SSO7 - Level 7 Exercise Design and Development", salary: 120_939 },
        { label: "SSO8 - Level 8 Competency, Training and Standards", salary: 133_034 },
        {
          label: "SSO9 - Level 9 Simulator Data and Design SSO Instructor - ASA ATC Instructor Higher Duties",
          salary: 138_594,
        },
        { label: "Supervisor", salary: 155_919 },
      ],
    },
    {
      id: "adt-classification",
      title: "Airways Data Team (ADT) classification and base salary",
      intro:
        "Base salaries for the Airways Data Team (previously the TAAATS Data Management Unit). Figures are the \"24 months\" column, in force from 7 October 2026.",
      stepHeading: "Classification",
      steps: [
        { label: "ADT Trainee", salary: 84_518 },
        { label: "Level 1", salary: 136_512 },
        { label: "Level 2", salary: 147_191 },
        { label: "Level 3", salary: 152_637 },
        { label: "ADT Supervisor", salary: 188_677 },
      ],
    },
  ],
  entryStep: "Ab Initio Trainee",
  topStep: "Level 10",

  traineePay: [
    "An Ab Initio Trainee is paid $64,398 a year under the agreement's \"24 months\" column, in force from 7 October 2026 (it was $62,280 under the \"12 months\" column). Schedule 1 defines an Ab Initio as an employee who does not hold, and has never held, an air traffic control licence and is undergoing Airservices training to become a licensed controller.",
    "Under Schedule 1, Ab Initios are not required to work night shifts or to perform ordinary hours on Saturdays or Sundays.",
    "An Ab Initio moves to the Field Trainee classification ($92,251) when they start final field training, or automatically two weeks (14 days) after finishing the Ab Initio course if field training has not started by then.",
    "Airservices' careers FAQ says initial training may take up to 18 months, followed by on-the-job field training managing live traffic with an instructor for about three to six months. Trainees work Monday to Friday, about 7.5 hours a day, during initial training.",
    "Once at Level 1, a controller moves up one classification level per year to Level 10, provided their performance is satisfactory and they meet the conditions in clause 27.3 (ASIC renewal, mandatory training, exams and CASA Class 3 medical on time).",
    "The FAQ says new recruits must sign a Training Bond Agreement committing to Airservices for five years after completing training, and must repay a proportion of training fees if the bond is broken.",
  ],
  allowances: [
    "Additional hours: ATC and FDC employees who work outside their ordinary hours are paid at 1.90 for all additional hours, with a minimum of four hours if recalled to duty after ceasing work (clause 20.22).",
    "Public holidays: ordinary duty on a public holiday is paid at 1.97 times the hourly rate; a controller on a rostered day off on a public holiday gets a 0.79 penalty for the average hours per shift of their base roster, or time off in lieu (clause 20.27).",
    "Ordinary hours: rostered ordinary hours average no more than 72 hours per fortnight, including shift hand-over duties (clause 20.3).",
    "Night shift leave: two extra hours of leave are credited for each night shift, or shift starting or ending between 0001 and 0459, up to 72 hours a financial year (clause 53).",
    "On-the-job training instructor (OJTI) allowance: 20% of base salary for ATC/FDC, 15% for SSO and 10% for supervisor positions (SS, UTS, CSS and SM) while instructing (clause 24.13).",
    "ATC instructors at the Academy receive a 5% higher duties allowance if they keep a current Class 3 medical and ATC licence (clause 24.1(g)).",
    "Multi-skill allowance: $100, $150 or $200 per fortnight for Tier 1, 2 or 3 (clause 24.15). Portfolio allowance: $60 per fortnight per portfolio (clause 24.16).",
    "District allowance is paid at listed remote locations — for example $7,079.47 a year (with eligible dependants) or $5,043.02 (without) at Broome, Port Hedland and Karratha (clause 24.10).",
    "Superannuation for accumulation members: the higher of 14% of base salary plus listed allowances (shift allowance, public holiday penalties, higher duties, OJTI and others) or the Superannuation Guarantee minimum (clause 34.4).",
  ],
  otherInstruments: [
    {
      name: "Airservices Australia Enterprise Award 2016 [MA000141]",
      url: "https://awards.fairwork.gov.au/MA000141.html",
      summary:
        "The award the enterprise agreement was tested against at approval (the better off overall test). It is the safety net for Airservices employees; the enterprise agreement salaries above are what controllers are actually paid.",
    },
  ],
  notices: [
    "Every salary on this page is the agreement's \"24 months\" column, a 3.4% rise that took effect on 7 October 2026 and the last scheduled under this agreement. Figures re-read from Attachment 1 on 9 October 2026.",
    "The SY TTCU and SY CSS/Supervisor classifications closed to new employees from 1 July 2025 and are grandfathered for existing employees who meet clauses 27.14 to 27.21.",
    "These are base salaries only. Controllers' actual earnings also include penalty rates, overtime and allowances, which vary by roster and location.",
    "Air traffic controllers in the Australian Defence Force are paid under ADF pay scales, not this agreement.",
    "The agreement reaches its nominal expiry date on 7 October 2027. Salaries after that depend on a replacement agreement.",
  ],
  unverified: [
    "The agreement's salary table is headed \"On Commencement\", \"12 months\" and \"24 months\" without naming a pay period. The dates on this page (7 October 2025 and 7 October 2026) are 12 and 24 months after the 7 October 2024 commencement date in the FWC decision; the exact pay period in which each rise was or will be paid is not printed in the table.",
    "Salary-related allowances in clause 24 (for example the workplace responsibility and community language allowances) print their increases from the first full pay period after 18 November 2024 and 18 November 2025. Those allowance dates differ from the salary table's column headings and are not used for salaries here.",
    "Overall earnings figures (base plus penalties and allowances) are not published by Airservices and are not estimated here.",
  ],
  sources: [
    {
      title:
        "Airservices Australia (Air Traffic Control and Supporting Air Traffic Services) Enterprise Agreement 2024-2027, with FWC approval decision [2024] FWCA 3415 and correction",
      publisher: "Airservices Australia / Fair Work Commission",
      url: "https://www.airservicesaustralia.com/wp-content/uploads/2024/11/Enterprise_Agreement_2024-2027.pdf",
    },
    {
      title: "Air Traffic Control Classification Base Salary 2024-2027",
      publisher: "Airservices Australia",
      url: "https://www.airservicesaustralia.com/wp-content/uploads/2024/11/ATC_Classification_Base_Salary.pdf",
    },
    {
      title: "Air traffic control careers — frequently asked questions",
      publisher: "Airservices Australia",
      url: "https://www.airservicesaustralia.com/careers/air-traffic-control-careers/frequently-asked-questions/",
    },
    {
      title: "Airservices Australia Enterprise Award 2016 [MA000141]",
      publisher: "Fair Work Commission",
      url: "https://awards.fairwork.gov.au/MA000141.html",
    },
  ],
  faqs: [
    {
      q: "How much does an air traffic controller earn in Australia?",
      a: "Airservices Australia controllers are paid under their 2024-2027 enterprise agreement. A licensed controller starts at Level 1 on $125,564 a year and moves up one level a year to Level 10 on $243,589. Supervisor classifications (UTS, CSS / SS) are $266,142. These are base salaries before penalty rates and allowances, from the 3.4% rise on 7 October 2026.",
    },
    {
      q: "What do ATC trainees get paid?",
      a: "An Ab Initio Trainee earns $64,398 a year during initial training, which Airservices says can take up to 18 months. On starting final field training they move to Field Trainee at $92,251. Once licensed they start at Level 1 on $125,564.",
    },
    {
      q: "How often do air traffic controllers get a pay rise?",
      a: "Two ways. The agreement's salary table rose 4% on commencement, 3.8% after 12 months and 3.4% after 24 months (from 7 October 2026, the last scheduled rise). Separately, controllers from Level 1 progress one classification level each year up to Level 10 if their performance is satisfactory and they meet the licence, medical and training conditions in clause 27.3.",
    },
    {
      q: "Do air traffic controllers get paid overtime?",
      a: "Yes. ATC and FDC employees are paid at 1.90 for all hours worked outside their ordinary hours, with a four-hour minimum if recalled to duty. Ordinary duty on a public holiday is paid at 1.97.",
    },
    {
      q: "What super do Airservices controllers get?",
      a: "For accumulation fund members, Airservices contributes the higher of 14% of base salary plus listed allowances, or the Superannuation Guarantee minimum.",
    },
  ],
};

/**
 * The superseded "12 months" ATC column (in force 7 October 2025 to
 * 6 October 2026), from the same Attachment 1, re-read 9 October 2026. Kept
 * only for before/after comparisons; ATC_PAY carries the current column.
 */
export const ATC_12_MONTH_COLUMN = {
  inForceFrom: "7 October 2025",
  salaries: {
    "Ab Initio Trainee": 62_280,
    "Field Trainee": 89_218,
    "Level 1": 121_435,
    "Level 2": 136_307,
    "Level 3": 151_175,
    "Level 4": 164_391,
    "Level 5": 177_609,
    "Level 6": 193_305,
    "Level 7": 206_522,
    "Level 8": 219_741,
    "Level 9": 227_174,
    "Level 10": 235_580,
    "SY TTCU": 251_859,
    UTS: 257_391,
    "CSS / SS": 257_391,
    "SY CSS/Supervisor": 277_044,
  } as Record<string, number>,
} as const;

// --- G6: the agreement's "24 months" salary column (3.4%) ---
/**
 * Attachment 1 of the 2024-2027 agreement, "24 months" column, read on
 * 24 September 2026 and re-read 9 October 2026 from Airservices' "Air Traffic Control Classification Base
 * Salary 2024-2027" PDF (identical to the agreement's Attachment 1). Due
 * 24 months after the 7 October 2024 commencement — see ATC_PAY.unverified on
 * the exact pay period. Labels match ATC_PAY's "atc-classification" steps.
 */
export const ATC_24_MONTH_COLUMN = {
  increase: 0.034,
  dueOn: "7 October 2026",
  sourceUrl: "https://www.airservicesaustralia.com/wp-content/uploads/2024/11/ATC_Classification_Base_Salary.pdf",
  salaries: {
    "Ab Initio Trainee": 64_398,
    "Field Trainee": 92_251,
    "Level 1": 125_564,
    "Level 2": 140_941,
    "Level 3": 156_315,
    "Level 4": 169_981,
    "Level 5": 183_648,
    "Level 6": 199_878,
    "Level 7": 213_544,
    "Level 8": 227_212,
    "Level 9": 234_898,
    "Level 10": 243_589,
    "SY TTCU": 260_422,
    UTS: 266_142,
    "CSS / SS": 266_142,
    "SY CSS/Supervisor": 286_463,
  } as Record<string, number>,
} as const;
// --- end G6 ---
