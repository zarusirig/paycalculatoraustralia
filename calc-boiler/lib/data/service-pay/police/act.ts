// Australian Capital Territory — ACT Policing (Australian Federal Police).
//
// ACT Policing is provided by the AFP, so ACT police officers are AFP employees
// paid under the AFP enterprise agreement, not an ACT instrument.
//
// Source of every figure: Australian Federal Police Enterprise Agreement
// 2024 - 2027, Attachment A "Classification Structure Base Salary Rates (bands 1
// to 8)" and section 101 (policing broadband progression), read in full on the
// AFP's publication page on 24 September 2026.
//
// Section 9 builds in 4.5% on the Commencement Date, 4.0% 12 months later and
// 2.7% 24 months later. The AFP's "AFP Enterprise Agreement" jobs page gives the
// Commencement Date as 9/12/2024, so the columns apply from 9 December 2024,
// 9 December 2025 and 9 December 2026. On 24 September 2026 the column IN FORCE
// is the 4.0% column (9 December 2025), which is what this file publishes.
//
// Rank labels: the agreement pays by band and increment point, not rank. The
// "Team Member/Constable" broadband spans bands 2–5 and "Team Leader/Sergeant"
// spans bands 6–7 (section 101). The AFP's "Skilled police program" page maps
// 3.3 to Constable, 4.2 and 4.5 to Senior Constable and 5.2 and 5.3 to Leading
// Senior Constable, quoting $81,350, $91,420, $103,256, $107,566 and $111,861 —
// the 4.0% column exactly. The rows below follow the progression table in
// section 101, so the duplicate "4.1" and "5.1" points (which equal 3.5 and 4.5)
// are skipped, as the policing broadband advances 3.5 → 4.2 and 4.5 → 5.2.

import type { ServicePayJurisdiction } from "../types";

export const ACT_POLICE_PAY: ServicePayJurisdiction = {
  occupation: "police",
  slug: "act",
  code: "ACT",
  name: "Australian Capital Territory",
  nameInSentence: "the ACT",
  employer: "AFP (ACT Policing)",
  agreementName: "Australian Federal Police Enterprise Agreement 2024 - 2027",
  agreementUrl: "https://www.afp.gov.au/news-centre/publications/enterprise-agreement-2024-2027",
  ratesEffectiveFrom: "9 December 2025",
  nextIncrease: {
    date: "9 December 2026",
    detail:
      "The agreement's final 2.7% rise applies 24 months after its 9 December 2024 commencement. Band 2.4 goes to $74,270, Band 5.3 to $114,881 and the recruit rate (Band 2.3) to $71,580.",
  },
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "constable-broadband",
      title: "Team Member/Constable broadband (bands 2–5)",
      intro:
        "AFP sworn members in the constable ranks, including ACT Policing, from 9 December 2025 (the 4.0% rise). Rows follow the policing progression in section 101 of the agreement.",
      stepHeading: "Band and increment point",
      steps: [
        {
          label: "Band 2.4",
          salary: 72_317,
          note: "On graduation from recruit training, for a minimum of 12 months",
        },
        { label: "Band 3.1", salary: 75_233, note: "Constable, after completing the AFP workbook" },
        { label: "Band 3.2", salary: 78_291, note: "Constable" },
        { label: "Band 3.3", salary: 81_350, note: "Constable" },
        { label: "Band 3.4", salary: 84_597, note: "Constable" },
        { label: "Band 3.5", salary: 87_836, note: "Constable" },
        { label: "Band 4.2", salary: 91_420, note: "Senior Constable, after meeting the assessment criteria (firm barrier)" },
        { label: "Band 4.3", salary: 95_000, note: "Senior Constable" },
        { label: "Band 4.4", salary: 98_963, note: "Senior Constable" },
        { label: "Band 4.5", salary: 103_256, note: "Senior Constable" },
        {
          label: "Band 5.2",
          salary: 107_566,
          note: "Leading Senior Constable. From 1 July 2025 requires a minimum of 9 years' policing experience (firm barrier)",
        },
        { label: "Band 5.3", salary: 111_861, note: "Leading Senior Constable — top of the constable broadband" },
      ],
    },
    {
      id: "sergeant-broadband",
      title: "Team Leader/Sergeant broadband (bands 6–7)",
      intro:
        "AFP sworn members in team leader/sergeant roles, from 9 December 2025. Entry is by merit selection at 6.1; advancement from 6.3 to 7.2 requires meeting assessment criteria.",
      stepHeading: "Band and increment point",
      steps: [
        { label: "Band 6.1", salary: 111_861 },
        { label: "Band 6.2", salary: 117_642 },
        { label: "Band 6.3", salary: 123_420 },
        { label: "Band 7.2", salary: 127_806 },
        { label: "Band 7.3", salary: 132_185 },
      ],
    },
  ],
  entryStep: "Band 2.4",
  topStep: "Band 5.3",

  traineePay: [
    "A new employee who joins the AFP as a police recruit starts at band and increment point 2.3 and stays there until they complete the recruit training program (section 101). From 9 December 2025 Band 2.3 is $69,698 a year, rising to $71,580 from 9 December 2026.",
    "The agreement's progression table sets a minimum of 19 weeks at Band 2.3 from the start of recruit training. A current AFP employee who becomes a police recruit keeps the salary of their previous role.",
  ],
  penalties: [
    "Core Composite (section 27): employees on the Operations or Rostered Operations working pattern receive 22% of base salary, which counts as salary for superannuation, to recognise expanded hours and shift patterns including afternoon shifts, night shifts, weekends and public holidays.",
    "High-volume Operations areas identified by the Commissioner attract the 22% Core Composite plus an additional composite of 35% of base salary, which does not count for superannuation.",
    "Night Shift Allowance (section 40): $9.88 for each hour worked between midnight and 6am from 9 December 2025 ($10.15 from 9 December 2026), for roles on the Operations or Rostered Operations working pattern.",
  ],
  notices: [
    "ACT Policing officers are AFP employees; there is no separate ACT police pay instrument. The same AFP bands apply to AFP sworn members nationally.",
    "The agreement has a nominal expiry date three years after its 9 December 2024 commencement. The 9 December 2026 rise is its last scheduled increase.",
    "The AFP does not use a Senior Sergeant rank in this structure. Band 8 and Executive Level rates are in the agreement but not reproduced here.",
  ],
  unverified: [
    "The agreement pays by band, not rank title. The rank names in the notes (Constable, Senior Constable, Leading Senior Constable) come from the AFP's Skilled police program page, not from the agreement itself.",
    "Any ACT Policing-specific allowances outside the enterprise agreement are not covered here.",
  ],
  sources: [
    {
      title: "Australian Federal Police Enterprise Agreement 2024 - 2027 — section 9, section 27, section 40, section 101 and Attachment A",
      publisher: "Australian Federal Police",
      url: "https://www.afp.gov.au/news-centre/publications/enterprise-agreement-2024-2027",
    },
    {
      title: "AFP Enterprise Agreement (salary rates; Commencement Date 9/12/2024)",
      publisher: "Australian Federal Police",
      url: "https://www.afp.gov.au/jobs/benefits-conditions/enterprise-agreements",
    },
    {
      title: "Skilled police program — skilled police officer salaries",
      publisher: "Australian Federal Police",
      url: "https://www.afp.gov.au/jobs/pathway/skilled-policing",
    },
  ],
  faqs: [
    {
      q: "How much does a police officer earn in the ACT?",
      a: "ACT Policing officers are paid under the AFP Enterprise Agreement 2024 - 2027. From 9 December 2025 a newly graduated officer at Band 2.4 earns $72,317 and a Leading Senior Constable at the top of the constable broadband (Band 5.3) earns $111,861. Officers on rostered operations also receive a 22% Core Composite allowance.",
    },
    {
      q: "What do AFP police recruits get paid?",
      a: "New police recruits are paid at Band 2.3 until they finish recruit training: $69,698 a year from 9 December 2025, rising to $71,580 from 9 December 2026.",
    },
    {
      q: "How much does a senior constable earn in the AFP?",
      a: "A Senior Constable is paid $91,420 at Band 4.2 rising to $103,256 at Band 4.5 from 9 December 2025, according to the AFP's band-to-rank mapping.",
    },
    {
      q: "When is the next AFP pay rise?",
      a: "The final 2.7% rise under the agreement applies from 9 December 2026, taking Band 2.4 to $74,270 and Band 5.3 to $114,881.",
    },
  ],
};
