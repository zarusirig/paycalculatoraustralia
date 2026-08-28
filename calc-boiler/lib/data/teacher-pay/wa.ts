// Western Australia — public school teacher salaries.
//
// Source of every figure: the Department of Education's own "Teacher salaries"
// page, table headed "Teacher salaries by level as of December 2025". Read on
// 28 August 2026.
//
// The underlying instrument is the School Education Act Employees' (Teachers
// and Administrators) General Agreement 2023 (WAIRC AG 24/2024, listed "In
// Force"), which the department links from its Awards and agreements page.
//
// That agreement delivered 12% over three years — 5% from 6 December 2023, 4%
// from 6 December 2024 and 3% from 6 December 2025 (WA Government media
// statement, 5 July 2024). The December 2025 rise is the last one it makes,
// which is why the department labels its table "as of December 2025". The same
// agreement created the Senior Teacher Level 2 classification and the Level 3.3
// classroom teacher positions.
//
// The WA Industrial Relations Commission's document server
// (downloads.wairc.wa.gov.au) refused or timed out every connection on
// 28 August 2026 — direct requests over both IP versions and both ports, and
// repeated scraping attempts — so the agreement's own salary schedule could not
// be read.
//
// The consequence is recorded honestly rather than papered over: school
// administrator salaries (deputy principal and principal) and the next
// scheduled increase live in that agreement, not on the department's salary
// page, so neither is published here. See `unverified`. Nothing has been
// estimated to fill the gap.

import type { TeacherPayState } from "./types";

export const WA_TEACHER_PAY: TeacherPayState = {
  slug: "wa",
  code: "WA",
  name: "Western Australia",
  nameInSentence: "Western Australia",
  employer: "the WA Department of Education",
  agreementName:
    "School Education Act Employees' (Teachers and Administrators) General Agreement 2023",
  agreementUrl: "https://www.education.wa.edu.au/teacher-salaries",
  ratesEffectiveFrom: "6 December 2025",
  nextIncrease: null,
  verifiedOn: "28 August 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Teachers — Level 2.1 to 2.9",
      intro:
        "The incremental scale every qualified WA public school teacher is paid on. The department's own wording: provided you teach to a satisfactory standard, you receive an annual increment each year until you reach level 2.9.",
      stepHeading: "Level",
      steps: [
        { label: "Level 2.1", salary: 88_178, note: "Qualified teacher starting salary" },
        { label: "Level 2.2", salary: 95_627 },
        { label: "Level 2.3", salary: 103_568 },
        { label: "Level 2.4", salary: 107_175 },
        { label: "Level 2.5", salary: 110_925 },
        { label: "Level 2.6", salary: 114_820 },
        { label: "Level 2.7", salary: 118_868 },
        { label: "Level 2.8", salary: 123_141 },
        { label: "Level 2.9", salary: 127_737, note: "Top of the incremental scale" },
      ],
    },
    {
      id: "senior-and-level-3",
      title: "Senior teachers and Level 3 classroom teachers",
      intro:
        "The two classifications above the incremental scale that keep you in the classroom. Level 3 Classroom Teacher is WA's distinctive senior classroom role.",
      stepHeading: "Classification",
      steps: [
        { label: "Senior Teacher 1", salary: 132_557 },
        { label: "Senior Teacher 2", salary: 134_165 },
        { label: "Level 3 Classroom Teacher 3.1", salary: 137_567 },
        { label: "Level 3 Classroom Teacher 3.2", salary: 141_551 },
        {
          label: "Level 3 Classroom Teacher 3.3",
          salary: 147_077,
          note: "Top of the classroom teacher structure",
        },
      ],
    },
  ],

  casual: [],

  progression: [
    {
      heading: "An annual increment to 2.9, subject to satisfactory teaching",
      body: [
        "The department states it plainly: provided you teach to a satisfactory standard, you receive an annual increment each year until you reach level 2.9. That is nine levels from 2.1 to the top of the incremental scale.",
        "The single largest jumps are early — 2.1 to 2.2 is $7,449 and 2.2 to 2.3 is $7,941, both well above the roughly $4,000 steps that follow.",
      ],
    },
    {
      heading: "Your starting level is not always 2.1",
      body: [
        "The department says it takes your work experience and qualifications into account when determining your starting salary, and it publishes a separate process for applying for a higher salary based on prior teaching experience or as a five-year trained teacher.",
        "If you came into WA teaching with prior experience and were placed at 2.1 anyway, that is the process to check.",
      ],
    },
    {
      heading: "Above 2.9: Senior Teacher and Level 3 Classroom Teacher",
      body: [
        "Neither is an increment. Senior Teacher has two points, at $132,557 and $134,165, and Level 3 Classroom Teacher has three, from $137,567 to $147,077.",
        "Level 3 Classroom Teacher is the one worth knowing about: it is WA's way of paying a teacher near deputy-principal money for staying in the classroom rather than moving into administration.",
      ],
    },
    {
      heading: "Senior Teacher and Level 3 are applications, not appointments you wait for",
      body: [
        "The department is explicit that both are competitive: current teachers who meet the eligibility criteria can apply to become a senior teacher, and outstanding teachers can apply to become a level 3 classroom teacher, which the department describes as recognising outstanding teaching practice.",
        "Leadership is a separate route again — the department runs a Leadership Institute with programs intended to prepare teachers before they apply for deputy principal or principal roles.",
      ],
    },
    {
      heading: "Regional and remote loadings sit on top",
      body: [
        "Teachers in rural, regional and remote WA locations may receive extra benefits on top of these salaries, and the amounts vary by school. The department publishes an allowances and benefits calculator that resolves it school by school — they are not part of the scale above.",
      ],
    },
  ],

  notices: [
    "These are the rates the WA Department of Education publishes as \"Teacher salaries by level as of December 2025\". They come from the third and final increase under the 2023 general agreement, which delivered 5% from 6 December 2023, 4% from 6 December 2024 and 3% from 6 December 2025.",
    "The WA Industrial Relations Commission's document server was unreachable on 28 August 2026, so the general agreement itself could not be read. Deputy principal and principal salaries live in that document and are therefore not shown here — we would rather leave a gap than estimate a principal's salary.",
  ],

  unverified: [
    "School administrator salaries — deputy principals and principals. These are in the School Education Act Employees' (Teachers and Administrators) General Agreement rather than on the department's salary page, and the WA Industrial Relations Commission's document server did not respond when we tried to read it. We would rather show nothing than a guessed principal salary.",
    "The next scheduled increase. The 2023 agreement's three increases are exhausted as at December 2025, and we could not verify any successor agreement or further increase date. The department and the WAIRC register both still list the 2023 agreement as current.",
    "The agreement's nominal expiry date, which is in the same unreachable document.",
    "Level 1 teacher rates below level 2.1 — the department's published table starts at 2.1.",
    "Relief and casual teacher rates, which the department publishes separately.",
    "Regional, remote and attraction-and-retention incentives, which vary by school and are not a salary rate.",
    "School psychologist salaries, which WA publishes on a separate scale.",
  ],

  sources: [
    {
      title: "Teacher salaries (Teacher salaries by level as of December 2025)",
      publisher: "WA Department of Education",
      url: "https://www.education.wa.edu.au/teacher-salaries",
    },
    {
      title:
        "Awards and agreements — School Education Act Employees' (Teachers and Administrators) General Agreement 2023",
      publisher: "WA Department of Education",
      url: "https://www.education.wa.edu.au/awards-and-agreements",
    },
    {
      title: "Recognition of teaching experience and qualifications",
      publisher: "WA Department of Education",
      url: "https://www.education.wa.edu.au/recognition-of-teaching-experience-and-qualifications",
    },
    {
      title: "Career progression — senior teachers and level 3 classroom teachers",
      publisher: "WA Department of Education",
      url: "https://www.education.wa.edu.au/career-progression",
    },
    {
      title:
        "Teachers receive pay rise as part of big investment into education (5 July 2024) — 5%/4%/3% from 6 December 2023, 2024 and 2025",
      publisher: "Government of Western Australia",
      url: "https://www.wa.gov.au/government/media-statements/Cook-Labor-Government/Teachers-receive-pay-rise-as-part-of-big-investment-into-education-20240705",
    },
    {
      title:
        "School Education Act Employees' (Teachers and Administrators) General Agreement 2023 (AG 24/2024) — register entry",
      publisher: "Western Australian Industrial Relations Commission",
      url: "https://www.wairc.wa.gov.au/resources/agreements?id=SCH013",
    },
  ],

  faqs: [
    {
      q: "What is the starting teacher salary in WA?",
      a: "$88,178 a year at level 2.1 for a qualified teacher, on the department's scale as at 6 December 2025. The department takes prior work experience and qualifications into account, so a teacher with recognised experience or five years of training can start higher.",
    },
    {
      q: "What is the top of the WA teacher pay scale?",
      a: "Level 2.9, $127,737 a year, is the top of the incremental scale. Above it, Senior Teacher pays $132,557 and $134,165, and Level 3 Classroom Teacher runs from $137,567 to $147,077.",
    },
    {
      q: "How long does it take to reach the top of the WA teacher scale?",
      a: "Nine levels, so eight annual increments from 2.1 to 2.9, provided you teach to a satisfactory standard each year. The department describes the increment as annual rather than something you apply for.",
    },
    {
      q: "What is a Level 3 Classroom Teacher in WA?",
      a: "A senior classroom classification that pays $137,567 to $147,077 without moving into administration. It is WA's mechanism for paying an experienced teacher well above the top of the ordinary scale while keeping them teaching.",
    },
    {
      q: "What is a senior teacher paid in WA?",
      a: "Senior Teacher 1 is $132,557 and Senior Teacher 2 is $134,165 a year, both above the $127,737 top of the incremental scale, as at December 2025.",
    },
    {
      q: "What does a WA principal earn?",
      a: "We have not published a figure. WA school administrator salaries sit in the general agreement rather than on the department's salary page, and the WA Industrial Relations Commission's document server did not respond when we tried to read it, so we have left it blank rather than estimate. Check the department's awards and agreements page.",
    },
  ],
};
