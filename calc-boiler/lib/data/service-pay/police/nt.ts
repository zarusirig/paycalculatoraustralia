// Northern Territory — Northern Territory Police Force salaries.
//
// Source of every figure: Northern Territory Police Force Consent Agreement
// 2025, certified by the Police Arbitral Tribunal under s.53(2) of the Police
// Administration Act 1978 (NT) and operating from 7 August 2025 to 6 August 2029
// (clause 3). Read in full, including the Tribunal's certification and its
// later s.48B correction (which fixed an allowance amount only), from the Office
// of the Commissioner for Public Employment copy on 24 September 2026.
//
// Attachment A clause 5 sets rises of 5% from 7 August 2025, 4% from 7 August
// 2026, 3% from 7 August 2027 and 3% (plus any Darwin CPI excess) from 7 August
// 2028, and clauses 7 and 8 print the dollar rates for each. On 24 September
// 2026 the column IN FORCE is 7/08/2026, which is what this file publishes.
//
// The agreement prints two salary tables: "Salary Rates – Seven weeks leave"
// (clause 7) and "Salary Rates – Six Weeks Leave" (clause 8). The agreement
// itself uses the seven-weeks-leave table as the reference for its allowances
// (e.g. on-call, stand-by, Territory Response Group), so that table is
// published here; the six-weeks-leave rates are quoted in `notices`.
// Senior Constable First Class is a preserved rank (Attachment A clause 4) that
// is closed to new entrants, so the top step compared is Senior Constable 6.

import type { ServicePayJurisdiction } from "../types";

export const NT_POLICE_PAY: ServicePayJurisdiction = {
  occupation: "police",
  slug: "nt",
  code: "NT",
  name: "Northern Territory",
  nameInSentence: "the Northern Territory",
  employer: "Northern Territory Police",
  agreementName: "Northern Territory Police Force Consent Agreement 2025",
  agreementUrl: "https://ocpe.nt.gov.au/__data/assets/pdf_file/0010/1624438/nt-police-force-consent-agreement.pdf",
  ratesEffectiveFrom: "7 August 2026",
  nextIncrease: {
    date: "7 August 2027",
    detail:
      "A 3% rise from 7 August 2027 is already in the agreement: Constable 1 goes to $89,615, Senior Constable 6 to $124,155 and recruits in training to $76,858 (seven-weeks-leave table).",
  },
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "constable-to-senior-constable",
      title: "Constable to Senior Constable (seven weeks leave)",
      intro:
        "Sworn constables and senior constables on the seven-weeks-leave salary table (Attachment A clause 7), from 7 August 2026 (a 4% increase).",
      stepHeading: "Rank",
      steps: [
        { label: "Constable 1 (Graduation to end 12 months service)", salary: 87_005 },
        { label: "Constable 2 (Probationer to 24 months)", salary: 88_744 },
        { label: "Constable 3", salary: 90_520 },
        { label: "Constable 4", salary: 92_330 },
        { label: "Constable 1/C 5", salary: 94_175, note: "Constable First Class — from 4 completed years of service or on meeting the rank qualification pathway" },
        { label: "Constable 1/C 6", salary: 96_059 },
        { label: "Constable 1/C 7", salary: 97_980 },
        { label: "Constable 1/C 8", salary: 99_942 },
        { label: "Constable 1/C 9", salary: 101_939 },
        { label: "Constable 1/C 10", salary: 103_977 },
        { label: "Senior Constable 1", salary: 109_176 },
        { label: "Senior Constable 2", salary: 111_359 },
        { label: "Senior Constable 3", salary: 113_587 },
        { label: "Senior Constable 4", salary: 115_857 },
        { label: "Senior Constable 5", salary: 118_176 },
        { label: "Senior Constable 6", salary: 120_539, note: "Top of the open constable ranks" },
        { label: "Senior Constable 1/C 1", salary: 124_757, note: "Preserved rank — closed to new entrants" },
        { label: "Senior Constable 1/C 2", salary: 126_628, note: "Preserved rank" },
        { label: "Senior Constable 1/C 3", salary: 128_529, note: "Preserved rank" },
      ],
    },
    {
      id: "sergeant",
      title: "Sergeant (seven weeks leave)",
      intro: "Sergeants on the seven-weeks-leave salary table, from 7 August 2026.",
      stepHeading: "Rank",
      steps: [
        { label: "Sergeant 1", salary: 130_457 },
        { label: "Sergeant 2", salary: 132_546 },
        { label: "Sergeant 3", salary: 134_665 },
        { label: "Sergeant 4", salary: 136_820 },
        { label: "Sergeant 5", salary: 139_008 },
      ],
    },
    {
      id: "senior-sergeant",
      title: "Senior Sergeant (seven weeks leave)",
      intro: "Senior sergeants on the seven-weeks-leave salary table, from 7 August 2026.",
      stepHeading: "Rank",
      steps: [
        { label: "Senior Sergeant 1", salary: 143_876 },
        { label: "Senior Sergeant 2", salary: 146_320 },
        { label: "Senior Sergeant 3", salary: 148_809 },
        { label: "Senior Sergeant 4", salary: 151_337 },
      ],
    },
  ],
  entryStep: "Constable 1 (Graduation to end 12 months service)",
  topStep: "Senior Constable 6",

  traineePay: [
    "Recruits in training are paid $74,619 a year from 7 August 2026 on the seven-weeks-leave table, rising to $79,095 after 4 months (Attachment A clause 7).",
    "Recruit Constables in training at the NTPFES College are excluded from the General Policing Allowance and the Night Shift Allowance (clauses 17 and 20).",
  ],
  penalties: [
    "Consolidated Allowance (clause 15): increased from 20% to 23% of salary for the life of the agreement.",
    "General Policing Allowance (clause 17): 5% of base annual salary, paid fortnightly to Senior Sergeants and below (not recruits in training).",
    "Night Shift Allowance (clause 20): 15% of base annual salary for each night shift actually worked, for Senior Sergeants and below; not payable when the night shift is worked as overtime.",
  ],
  notices: [
    "The agreement prints a separate, higher \"Six Weeks Leave\" salary table (Attachment A clause 8). From 7 August 2026 it pays Constable 1 $89,700, Senior Constable 6 $124,277, Sergeant 1 $134,502, Senior Sergeant 4 $156,030 and recruits in training $76,932.",
    "The agreement runs from 7 August 2025 to 6 August 2029, with further rises of 3% from 7 August 2027 and 3% from 7 August 2028 (plus any amount by which Darwin CPI for the year to March 2029 exceeds 3%).",
    "Police Auxiliaries and Aboriginal Community Police Officers have their own rows in Attachment A; they are not reproduced here.",
  ],
  unverified: [
    "The agreement does not itself say which members are on the seven-weeks-leave table and which are on the six-weeks-leave table; that is set by the parent Police Arbitral Tribunal Determination No. 1 of 2011, which was not read for this page.",
    "How the 23% Consolidated Allowance applies (which members and rosters) is set by Determination No. 1 of 2011, which was not read for this page.",
  ],
  sources: [
    {
      title: "Northern Territory Police Force Consent Agreement 2025 — Attachment A Salary Rates, clauses 3, 15, 17 and 20, and Police Arbitral Tribunal certification",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: "https://ocpe.nt.gov.au/__data/assets/pdf_file/0010/1624438/nt-police-force-consent-agreement.pdf",
    },
  ],
  faqs: [
    {
      q: "How much does a police officer earn in the NT?",
      a: "Under the NT Police Force Consent Agreement 2025, from 7 August 2026 a Constable in their first year after graduation earns $87,005 and a Senior Constable at the top open pay point (Senior Constable 6) earns $120,539, on the seven-weeks-leave table.",
    },
    {
      q: "What do NT police recruits get paid?",
      a: "Recruits in training are paid $74,619 a year from 7 August 2026, rising to $79,095 after four months (seven-weeks-leave table).",
    },
    {
      q: "How much does a senior constable earn in the Northern Territory?",
      a: "Senior Constables earn $109,176 at pay point 1 rising to $120,539 at pay point 6 from 7 August 2026 on the seven-weeks-leave table.",
    },
    {
      q: "When is the next NT police pay rise?",
      a: "A 3% rise applies from 7 August 2027, taking Constable 1 to $89,615 and Senior Constable 6 to $124,155 on the seven-weeks-leave table.",
    },
  ],
};
