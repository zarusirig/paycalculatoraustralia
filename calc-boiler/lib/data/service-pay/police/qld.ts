// Queensland — Queensland Police Service salaries (sworn police officers).
//
// Instrument: Queensland Police Service Certified Agreement 2025, certified by
// the QIRC on 13 October 2025 (Matter CB/2025/116; operates from certification;
// nominal expiry 30 June 2028). Schedule 1 "Salary Rates – Police Officers" and
// the CPI Uplift Adjustment (CUA) and Wages Clause read in full on
// 24 September 2026.
//
// Why the figures are NOT the Schedule 1 figures: the agreement's wages clause
// gives 3% from 1 July 2025, 2.5% from 1 July 2026 and 2.5% from 1 July 2027,
// plus a CPI Uplift Adjustment when the March Brisbane CPI exceeds the rise
// (capped at 0.5% for period 1). It says the salary schedule rates "will be
// increased where the CUA entitlement crystallises", compounding into later
// rises, and that QPS "will publish updated rates reflecting this on a public
// facing website". The March 2026 Brisbane CPI exceeded 3%, so the 1 July 2025
// rise became 3.5%. The QPS "CPI Uplift Adjustment" page (read 24 September
// 2026) publishes the resulting "1 July 2026 Increased Rate" table, and that is
// the table this file publishes. Each step's note quotes the fortnightly rate,
// which is the operative rate; the per-annum amounts are QPS's own published
// annual figures (the agreement notes annual salaries are for reference only).
//
// Cross-check: the uplifted rates sit just under 0.5% above Schedule 1, as
// expected from a 3.5% rather than 3% rise on the 30 June 2025 rate (e.g.
// Constable 1 at 1 July 2026: Schedule 1 $2,994.50 a fortnight, CUA table
// $3,009.10).

import type { ServicePayJurisdiction } from "../types";

export const QLD_POLICE_PAY: ServicePayJurisdiction = {
  occupation: "police",
  slug: "qld",
  code: "QLD",
  name: "Queensland",
  nameInSentence: "Queensland",
  employer: "Queensland Police Service",
  agreementName: "Queensland Police Service Certified Agreement 2025",
  agreementUrl: "https://www.qirc.qld.gov.au/sites/default/files/2025-10/2025_cb116.pdf",
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: {
    date: "1 July 2027",
    detail:
      "A 2.5% rise from 1 July 2027 is written into the agreement. QPS's published 1 July 2027 rates are $80,467 for Constable 1 and $121,080 for Senior Constable 10. A further CPI Uplift Adjustment of up to 1% applies if the March 2027 Brisbane CPI exceeds 2.5%.",
  },
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "constable-to-senior-constable",
      title: "Constable and Senior Constable",
      intro:
        "Sworn constables and senior constables from 1 July 2026, including the CPI Uplift Adjustment triggered by the March 2026 Brisbane CPI (which lifted the 1 July 2025 rise from 3% to 3.5%).",
      stepHeading: "Rank and pay point",
      steps: [
        { label: "Constable 1", salary: 78_505, note: "First Year Constable (pay point 1.1). $3,009.10 a fortnight" },
        { label: "Constable 2", salary: 80_778, note: "$3,096.20 a fortnight" },
        { label: "Constable 3", salary: 84_242, note: "$3,229.00 a fortnight" },
        { label: "Constable 4", salary: 87_699, note: "$3,361.50 a fortnight" },
        { label: "Constable 5", salary: 92_541, note: "$3,547.10 a fortnight" },
        {
          label: "Constable 6",
          salary: 96_528,
          note: "$3,699.90 a fortnight. Retained for disciplinary sanctions and accelerated progression only",
        },
        { label: "Senior Constable 1", salary: 96_528, note: "$3,699.90 a fortnight" },
        { label: "Senior Constable 2", salary: 98_751, note: "$3,785.10 a fortnight" },
        { label: "Senior Constable 3", salary: 101_031, note: "$3,872.50 a fortnight" },
        { label: "Senior Constable 4", salary: 103_363, note: "$3,961.90 a fortnight" },
        { label: "Senior Constable 5", salary: 105_722, note: "$4,052.30 a fortnight" },
        { label: "Senior Constable 6", salary: 108_153, note: "$4,145.50 a fortnight" },
        { label: "Senior Constable 7", salary: 110_653, note: "$4,241.30 a fortnight" },
        { label: "Senior Constable 8", salary: 113_194, note: "$4,338.70 a fortnight" },
        { label: "Senior Constable 9", salary: 115_787, note: "$4,438.10 a fortnight" },
        {
          label: "Senior Constable 10",
          salary: 118_127,
          note: "$4,527.80 a fortnight. Deemed Leading Senior Constable once qualified for promotion to Sergeant",
        },
      ],
    },
    {
      id: "sergeant",
      title: "Sergeant",
      intro: "Sergeants from 1 July 2026, including the CPI Uplift Adjustment.",
      stepHeading: "Rank and pay point",
      steps: [
        { label: "Sergeant 1", salary: 118_127, note: "$4,527.80 a fortnight" },
        { label: "Sergeant 2", salary: 119_938, note: "$4,597.20 a fortnight" },
        { label: "Sergeant 3", salary: 122_338, note: "$4,689.20 a fortnight" },
        { label: "Sergeant 4", salary: 124_793, note: "$4,783.30 a fortnight" },
        { label: "Sergeant 5", salary: 126_627, note: "$4,853.60 a fortnight" },
        { label: "Sergeant 6", salary: 129_956, note: "$4,981.20 a fortnight" },
        { label: "Sergeant 7", salary: 133_671, note: "$5,123.60 a fortnight" },
      ],
    },
    {
      id: "senior-sergeant",
      title: "Senior Sergeant",
      intro: "Senior sergeants from 1 July 2026, including the CPI Uplift Adjustment.",
      stepHeading: "Rank and pay point",
      steps: [
        { label: "Senior Sergeant 1", salary: 135_281, note: "$5,185.30 a fortnight" },
        { label: "Senior Sergeant 2", salary: 136_679, note: "$5,238.90 a fortnight" },
        { label: "Senior Sergeant 3", salary: 138_753, note: "$5,318.40 a fortnight" },
        { label: "Senior Sergeant 4", salary: 140_491, note: "$5,385.00 a fortnight" },
        { label: "Senior Sergeant 5", salary: 142_935, note: "$5,478.70 a fortnight" },
        { label: "Senior Sergeant 6", salary: 146_518, note: "$5,616.00 a fortnight" },
        { label: "Senior Sergeant 7", salary: 150_175, note: "$5,756.20 a fortnight" },
      ],
    },
  ],
  entryStep: "Constable 1",
  topStep: "Senior Constable 10",

  traineePay: [
    "QPS Recruiting says mainstream recruits are paid 70% of a First Year Constable base salary (as outlined in the QPS Certified Agreement), plus a recruit training allowance of $183 a fortnight, which it says takes training pay to approximately $60,000 a year.",
    "Recruits with previous policing experience may be paid at a higher pay point from their first day at the academy, according to QPS Recruiting.",
  ],
  penalties: [
    "Operational Shift Allowance (clause 43): 21% of base salary for officers in operational shift positions who equitably take part in shift rosters. It is paid in lieu of shift and weekend penalties, public holiday rates and annual leave loading.",
    "Night Operational Shift Allowance (clause 39): an extra 20% of base rate for each shift starting between 6pm and 2am, paid on top of the Operational Shift Allowance.",
  ],
  notices: [
    "The salaries shown are QPS's published CPI-uplifted rates, which are higher than the tables printed in Schedule 1 of the certified agreement because the 1 July 2025 rise became 3.5% instead of 3% and the 1 July 2026 rise compounds on it. QPS says back payments began in the pay fortnight of 24 June 2026 with all adjustments expected to be finished by 5 August 2026.",
    "QPS Recruiting's \"What we offer\" page still quotes a First Year Constable base of $78,124, the pre-uplift Schedule 1 figure. The uplifted rate from 1 July 2026 is $78,505.",
    "The certified agreement runs to a nominal expiry date of 30 June 2028.",
  ],
  unverified: [
    "The recruit rate is described by QPS as a percentage of the First Year Constable salary; no dollar rate for recruits is printed in the agreement's Schedule 1, so none is shown here.",
    "Inspector and above, and Police Liaison Officers and other support classifications, are not reproduced here.",
  ],
  sources: [
    {
      title: "Queensland Police Service Certified Agreement 2025 (CB/2025/116) — Schedule 1 and CPI Uplift Adjustment (CUA) and Wages Clause",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2025-10/2025_cb116.pdf",
    },
    {
      title: "CPI Uplift Adjustment — Police CUA Pay Rates",
      publisher: "Queensland Police Service",
      url: "https://www.police.qld.gov.au/cpi-uplift-adjustment",
    },
    {
      title: "What we offer",
      publisher: "Queensland Police Service Recruiting",
      url: "https://www.policerecruit.qld.gov.au/what-we-offer",
    },
  ],
  faqs: [
    {
      q: "How much does a police officer earn in Queensland?",
      a: "From 1 July 2026 a First Year Constable (Constable 1) earns $78,505 a year ($3,009.10 a fortnight) and a Senior Constable at the top pay point (10) earns $118,127. These are QPS's published rates including the CPI Uplift Adjustment, which made the 1 July 2025 rise 3.5% instead of 3%.",
    },
    {
      q: "How much does a senior constable earn in Queensland?",
      a: "Senior Constables are paid $96,528 at pay point 1 rising to $118,127 at pay point 10 from 1 July 2026. Officers on shift rosters usually also receive the 21% Operational Shift Allowance on top.",
    },
    {
      q: "What do Queensland police recruits get paid?",
      a: "QPS Recruiting says mainstream recruits receive 70% of a First Year Constable base salary plus a $183 a fortnight recruit training allowance, which it puts at approximately $60,000 a year.",
    },
    {
      q: "When is the next Queensland police pay rise?",
      a: "The certified agreement gives a 2.5% rise from 1 July 2027. QPS lists the 1 July 2027 rate for a Constable 1 as $80,467, and a further CPI uplift of up to 1% applies if the March 2027 Brisbane CPI is above 2.5%.",
    },
  ],
};
