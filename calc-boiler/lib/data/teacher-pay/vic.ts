// Victoria — public school teacher salaries.
//
// Source of every figure: the Department of Education's own salary schedules
// under the Victorian Government Schools Agreement 2022 —
//   Teacher Class Salaries in Victorian Government Schools (last updated
//   17 August 2022), and
//   Principal Class Remuneration in Victorian Government Schools (last updated
//   19 September 2022).
// Both read in full on 28 August 2026.
//
// Those schedules publish nine dated columns, from 24/12/21 through to
// "1/07/25". 1 July 2025 is the LAST column the VGSA 2022 makes, and it is what
// this file publishes. The agreement's nominal expiry date was 31 December 2025
// (VGSA 2022 clause 5), and on 28 August 2026 the department's Industrial
// Agreements resources page still lists the VGSA 2022 as the agreement in
// force, with no newer salary schedule published.
//
// A replacement — the proposed VGSA 2026 — was approved by staff ballot on
// 17 September 2026 (93.1% yes) and awaits Fair Work Commission approval. Its
// Schedule 1 salary rates are published by the department and live in
// vic-2026-agreement.ts; the page tables them separately as PROPOSED rates. The
// scales below stay on the VGSA 2022 until the new agreement is approved and
// operating.
//
// 22 October 2026: AG2026/2746 is no longer on the FWC agreements-in-progress
// list and the AEU Victorian Branch reports approval with effect from
// 23 October 2026, but no FWC decision and no new department salary schedule
// had been published (Salary Rates page still "Updated 8 May 2025"). So the
// scales below stay on the VGSA 2022 for now; see vic-2026-agreement.ts.
// 23 October 2026: re-checked, still unofficial (no FWC decision among the
// published [2026] FWCA decisions to 22 October, department pages unchanged);
// only verifiedOn moved. Evening re-check (FWCA 2915 to 2933 now published,
// none is AG2026/2746): still unofficial. The FAQ and notice wording now says
// what every other page says: the AEU reports approval from 23 October 2026
// and the decision is not yet published.
// 27 October 2026: official. [2026] FWCA 2836 (AG2026/2746, Deputy President
// Millhouse, 16 October 2026) approves the VGSA 2026 with undertakings; it
// operates from 23 October 2026 (s 54), nominal expiry 10 August 2030
// (AE534356, PR815386). The department's Enterprise Bargaining overview
// ("Updated 26 October 2026") confirms it. Its Salary Rates page ("Updated
// 26 October 2026") says the policy "is under review" and no VGSA 2026
// schedule is published, so the scales below stay on the VGSA 2022 1 July 2025
// column for now. Notices, nextIncrease and FAQs now state the approval as
// official. Moving the scales to the VGSA 2026 is an owner decision (see the
// steps in vic-2026-agreement.ts).

import type { TeacherPayState } from "./types";
import { formatAUD } from "../../constants/australian-tax";
import { proposedRate } from "./vic-2026-agreement";

/** VGSA 2026 Schedule 1 rate, formatted, from the first pay period on or after 1 October 2026 (column 1). */
const oct2026 = (scaleId: string, label: string) => formatAUD(proposedRate(scaleId, label, 1)!);
/** VGSA 2026 Schedule 1 rate, formatted, from the first pay period on or after 1 November 2029 (column 4). */
const nov2029 = (label: string) => formatAUD(proposedRate("classroom-teachers-2026", label, 4)!);

export const VIC_TEACHER_PAY: TeacherPayState = {
  slug: "vic",
  code: "VIC",
  name: "Victoria",
  nameInSentence: "Victoria",
  h1: "Victorian Teacher Salary 2026: Classroom Teacher Scale (Range 1 and 2, VGSA) and the Pay Rise",
  classificationNote:
    "Victorian government school teachers are classroom teachers in Range 1 and Range 2 of the Victorian Government Schools Agreement (VGSA). Each pay point is written as a subdivision, from 1-1 (graduate entry) to 2-6. Leading teachers and learning specialists sit in Range 3.",
  principalScaleIds: ["principals"],
  employer: "Victorian Department of Education",
  agreementName: "Victorian Government Schools Agreement 2022 (VGSA 2022)",
  agreementUrl: "https://www2.education.vic.gov.au/pal/salary-rates/overview",
  ratesEffectiveFrom: "the first pay period on or after 1 July 2025",
  nextIncrease: {
    date: "the first pay period on or after 1 November 2027",
    detail:
      "The Fair Work Commission approved the Victorian Government Schools Agreement 2026 on 16 October 2026 ([2026] FWCA 2836, matter AG2026/2746), and it operates from 23 October 2026 in place of the VGSA 2022. Its Schedule 1 sets new rates from the first pay period on or after 10 August 2026 and 1 October 2026, then each 1 November from 2027 to 2029. The department had not published its VGSA 2026 salary schedule when we checked on 27 October 2026, so the tables on this page still show the VGSA 2022 rates from 1 July 2025. The VGSA 2026 rates are in the 2026 pay rise section.",
  },
  verifiedOn: "23 October 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Classroom teachers, Range 1 and Range 2",
      intro:
        "The classroom teacher classification has two salary ranges, each divided into subdivisions. This is the scale every Victorian government school teacher starts on, primary and secondary alike.",
      stepHeading: "Subdivision",
      steps: [
        { label: "1-1", salary: 79_589, note: "Graduate entry point" },
        { label: "1-2", salary: 81_676 },
        { label: "1-3", salary: 84_690 },
        { label: "1-4", salary: 87_814 },
        { label: "1-5", salary: 91_056, note: "Top of Range 1" },
        { label: "2-1", salary: 94_415 },
        { label: "2-2", salary: 97_899 },
        { label: "2-3", salary: 101_512 },
        { label: "2-4", salary: 105_258 },
        { label: "2-5", salary: 109_142 },
        { label: "2-6", salary: 118_063, note: "Top of the classroom teacher scale" },
      ],
    },
    {
      id: "leading-teacher-learning-specialist",
      title: "Leading teachers and learning specialists, Range 3",
      intro:
        "Leading teachers and learning specialists both sit in Range 3 and are paid identically. They are fixed-term appointments made by the principal, not a step on the classroom teacher scale.",
      stepHeading: "Subdivision",
      steps: [
        { label: "3-1", salary: 123_966 },
        { label: "3-2", salary: 129_544 },
      ],
    },
    {
      id: "assistant-principals",
      title: "Assistant principals, Range 1 to Range 4",
      intro:
        "The principal, having regard to the duties and the funding available in the school, determines how many assistant principal positions there are and which range each sits in.",
      stepHeading: "Range and subdivision",
      steps: [
        { label: "1-1", salary: 136_022 },
        { label: "1-2", salary: 138_782 },
        { label: "1-3", salary: 142_806 },
        { label: "1-4", salary: 147_347 },
        { label: "2-1", salary: 148_890 },
        { label: "2-2", salary: 152_165 },
        { label: "2-3", salary: 155_514 },
        { label: "2-4", salary: 161_584 },
        { label: "3-1", salary: 165_139 },
        { label: "3-2", salary: 168_772 },
        { label: "3-3", salary: 172_485 },
        { label: "3-4", salary: 175_820 },
        { label: "4-1", salary: 179_688 },
        { label: "4-2", salary: 183_642 },
        { label: "4-3", salary: 187_682 },
        { label: "4-4", salary: 191_811 },
      ],
    },
    {
      id: "principals",
      title: "Principals, Range 2 to Range 6",
      intro:
        "A principal position's salary range is set by the school's Student Resource Package budget: Range 2 at the bottom, Range 6 for schools with a budget above $15,526,127 (2025 threshold).",
      stepHeading: "Range and subdivision",
      steps: [
        { label: "2-1", salary: 156_335 },
        { label: "2-2", salary: 159_773 },
        { label: "2-3", salary: 163_289 },
        { label: "2-4", salary: 169_664 },
        { label: "3-1", salary: 173_396 },
        { label: "3-2", salary: 177_211 },
        { label: "3-3", salary: 181_109 },
        { label: "3-4", salary: 184_611 },
        { label: "4-1", salary: 188_672 },
        { label: "4-2", salary: 192_824 },
        { label: "4-3", salary: 197_066 },
        { label: "4-4", salary: 201_401 },
        { label: "5-1", salary: 207_782 },
        { label: "5-2", salary: 211_937 },
        { label: "5-3", salary: 216_176 },
        { label: "5-4", salary: 220_499 },
        { label: "6-1", salary: 224_910 },
        { label: "6-2", salary: 229_408 },
        { label: "6-3", salary: 233_996 },
        { label: "6-4", salary: 238_676, note: "Top of the principal class" },
      ],
    },
  ],

  casual: [],

  progression: [
    {
      heading: "Progression happens once a year, on 1 May",
      body: [
        "Within every teaching service classification, salary progression is available on 1 May each year, up to the maximum subdivision of your salary range. The progression cycle runs 1 May to 30 April, and a performance review is done at the end of each school year.",
        "Progression is not automatic. It is based on the annual assessment of your performance under the performance and development process. The VGSA 2022 does, however, forbid the employer from imposing a quota on how many staff can progress in a year. The decision rests solely on each person's own assessment.",
      ],
    },
    {
      heading: "You need six months of eligible service",
      body: [
        "An employee with six or more months of eligible service at or above a subdivision in a progression cycle is eligible to move up. Eligible service includes duty (including time on higher duties), paid leave, and unpaid leave that has been approved to count as service.",
        "If you were promoted in the six months before 1 May, you are not eligible to progress that year. The exception is time on higher duties at or above the promotion level earlier in the same cycle, which does count.",
      ],
    },
    {
      heading: "Range 1 to Range 2 is not a time-served step",
      body: [
        "VGSA 2022 clause 16(3): advancement from classroom teacher salary range 1 to classroom teacher salary range 2 is subject to the teacher satisfying the requirements of salary range 2. Reaching 1-5 does not roll you into 2-1 on the calendar.",
        "Range 2 classroom teachers are expected to play a significant role in improving student performance across the school and to build other staff's knowledge of high quality instruction. That is what the requirements test.",
      ],
    },
    {
      heading: "Leading teacher and learning specialist are appointments",
      body: [
        "Range 3 is not the next rung of the classroom teacher scale. Leading teacher and learning specialist are positions the principal creates and fills for a fixed term, and both are paid on the same Range 3 rates.",
        "When a leading teacher or learning specialist appointment expires without renewal, transfer or promotion, the employee becomes a classroom teacher at subdivision 2-6.",
      ],
    },
    {
      heading: "If you are told you will not progress",
      body: [
        "A teacher assessed as not meeting the requirements does not progress that year. That outcome applies only if the teacher was told in writing before 1 March what standard was expected, where their performance fell short and what the consequences are. The teacher must also have been given the chance to improve.",
        "Progression for everyone else is processed centrally on the payroll.",
      ],
    },
    {
      heading: "Accelerated progression exists but is rare",
      body: [
        "Where a principal considers a teacher is performing well above normal expectations, or where retention is a concern, they can approve accelerated progression within a salary range. It takes effect from 1 May of that cycle and can only come out of the performance and development process.",
        "Accelerated progression is confined to the school that granted it. If you change schools, your salary reverts to what it would have been without the acceleration, unless the new principal determines otherwise.",
      ],
    },
  ],

  notices: [
    "The Victorian Government Schools Agreement 2026 replaced the VGSA 2022 from 23 October 2026, after the Fair Work Commission approved it on 16 October 2026. The department had not published its VGSA 2026 salary schedule when we checked on 27 October 2026, so the tables below still show the last VGSA 2022 rates, from 1 July 2025. The VGSA 2026 rates are in the 2026 pay rise section.",
    "Staff approved the proposed Victorian Government Schools Agreement 2026 in a ballot announced on 17 September 2026: 80,742 employees voted (77.1% of those eligible) and 93.1% voted yes. It lifts the top classroom teacher step from $118,063 to $133,456 from the first pay period on or after 1 October 2026 and to $151,419 by November 2029, plus a $2,000 lump sum. The department lodged its application for Fair Work Commission approval on 23 September 2026 (AG2026/2746). The Commission approved the agreement on 16 October 2026 ([2026] FWCA 2836), and it operates from 23 October 2026. The department's new salary schedule had not been published when we checked on 27 October 2026, so the new rates are tabled in the 2026 pay rise section and the tables further down stay on the VGSA 2022.",
  ],

  unverified: [
    "Principal, assistant principal and liaison principal rates under the VGSA 2026, published in its Schedule 1 but not tabled here; read them in the agreement itself.",
    "Casual relief teacher (CRT) rates, published on a separate departmental schedule not read for this page.",
    "Paraprofessional and education support class scales, which are separate classifications.",
    "Liaison principal rates, which mirror the principal ranges but are a distinct classification.",
  ],

  sources: [
    {
      title: "Proposed Victorian Government Schools Agreement 2026 (Schedule 1: Salary Rates)",
      publisher: "Victorian Department of Education",
      url: "https://content.sdp.education.vic.gov.au/media/proposed-vgsa-2026-3615",
    },
    {
      title: "State of Victoria (Department of Education) T/A Department of Education [2026] FWCA 2836 (AG2026/2746, approved 16 October 2026, operative 23 October 2026)",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2026fwca2836.pdf",
    },
    {
      title: "Agreements in progress: Victorian Government Schools Agreement 2026 (AG2026/2746, lodged 23 September 2026; member consideration on 14 October 2026; no longer listed on 22 October 2026)",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement/agreements-progress",
    },
    {
      title: "Enterprise Bargaining: Overview (FWC approval and 23 October 2026 start, updated 26 October 2026)",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/enterprise-bargaining/overview",
    },
    {
      title: "Labor Seals The Deal For Education Staff Pay Rise (17 September 2026)",
      publisher: "Premier of Victoria",
      url: "https://www.premier.vic.gov.au/labor-seals-deal-education-staff-pay-rise",
    },
    {
      title: "Salary Rates: Overview (teacher and principal class salary schedules)",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/salary-rates/overview",
    },
    {
      title: "Victorian Government Schools Agreement 2022",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/industrial-agreements/resources",
    },
    {
      title: "Remuneration, Teaching Service: Annual progression",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/annual-progression",
    },
    {
      title: "Career Structure, Teaching Service: Policy and Guidelines",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/career-structure-teaching-service/policy-and-guidelines",
    },
    {
      title: "Labor Is Giving Education Workers A Payrise (17 August 2026)",
      publisher: "Premier of Victoria",
      url: "https://www.premier.vic.gov.au/labor-giving-education-workers-payrise",
    },
  ],

  faqs: [
    {
      q: "What is the graduate teacher salary in Victoria?",
      a: `A graduate teacher starts at classroom teacher subdivision 1-1. Under the Victorian Government Schools Agreement 2026, which operates from 23 October 2026, 1-1 is ${oct2026("classroom-teachers-2026", "1-1")} a year from the first pay period on or after 1 October 2026. The tables below still show the VGSA 2022 rate of $79,589 from 1 July 2025, because the department had not published its new schedule when we checked.`,
    },
    {
      q: "What is the top of the Victorian teacher pay scale?",
      a: `Subdivision 2-6 is the top of the classroom teacher scale: ${oct2026("classroom-teachers-2026", "2-6")} a year under the VGSA 2026 from the first pay period on or after 1 October 2026 ($118,063 under the VGSA 2022 tables below). Above it, leading teachers and learning specialists are paid ${oct2026("leading-teacher-learning-specialist-2026", "3-1")} at 3-1 and ${oct2026("leading-teacher-learning-specialist-2026", "3-2")} at 3-2 under the VGSA 2026, but those are fixed-term appointments rather than steps.`,
    },
    {
      q: "When do Victorian teachers move up a pay step?",
      a: "Victorian teachers move up a pay step on 1 May each year, subject to the annual performance and development assessment and at least six months of eligible service at or above their current subdivision. The employer cannot impose a quota on how many teachers progress.",
    },
    {
      q: "How do you get from Range 1 to Range 2 in Victoria?",
      a: "VGSA 2022 clause 16(3) makes advancement from classroom teacher Range 1 to Range 2 subject to satisfying the requirements of Range 2 rather than length of service. Those requirements are a role expectation about improving student performance across the school and building other staff's practice.",
    },
    {
      q: "What is a principal paid in Victoria?",
      a: "Under the VGSA 2022 schedule from 1 July 2025, principal salaries run from $156,335 at Range 2 subdivision 2-1 to $238,676 at Range 6 subdivision 6-4. The VGSA 2026, which operates from 23 October 2026, sets new principal rates in its Schedule 1, which this page does not yet table. The range a principal position sits in is set by the school's Student Resource Package budget and reviewed each year.",
    },
    {
      q: "When do Victorian teachers get a pay rise?",
      a: `The department reports that the Fair Work Commission approved the Victorian Government Schools Agreement 2026 on 16 October 2026 ([2026] FWCA 2836) and that it came into effect on 23 October 2026. Staff had approved it with 93.1% voting yes (announced 17 September 2026). From the first pay period on or after 1 October 2026, its salary schedule lifts a graduate at 1-1 from $79,589 to ${oct2026("classroom-teachers-2026", "1-1")} and the top classroom step 2-6 from $118,063 to ${oct2026("classroom-teachers-2026", "2-6")}. Those steps rise to ${nov2029("1-1")} and ${nov2029("2-6")} by November 2029, and a $2,000 lump sum is paid when the agreement starts.`,
    },
    {
      q: "When will Victorian teachers get the pay rise?",
      a: "The Victorian Government Schools Agreement 2026 starts seven days after the Fair Work Commission approves it. The Commission approved it on 16 October 2026 ([2026] FWCA 2836), so it operates from 23 October 2026. Its Schedule 1 dates the first two increases from the first pay period on or after 10 August 2026 and 1 October 2026. Further increases follow from 1 November 2027, 2028 and 2029. The department had not published its new salary schedule or when the new rates reach pay when we checked on 27 October 2026.",
    },
  ],
};
