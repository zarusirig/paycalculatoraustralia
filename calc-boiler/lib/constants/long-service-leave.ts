// =============================================================================
// Long service leave — the eight state and territory Acts, and the ATO rules
// for withholding from an unused long service leave payment on termination.
//
// Every figure below was read from the page named next to it on 28 August 2026
// (LSL_SOURCES). Long service leave is NOT part of the National Employment
// Standards: each jurisdiction has its own Act, its own qualifying period, its
// own accrual rate and its own pro-rata trigger. They are modelled separately
// here rather than flattened into one formula with a multiplier, because the
// rules differ structurally, not just numerically:
//
//   - the rate is 0.8667 weeks a year in six jurisdictions but 1.3 weeks a
//     year in SA and the NT (13 weeks at 10 years, not 8.667)
//   - Victoria and the ACT let you take leave at 7 years; everyone else at 10
//   - the pro-rata trigger on termination is 5 years in NSW and the ACT,
//     7 years everywhere else
//   - SA and the NT pay pro-rata on COMPLETED years only (8.5 years pays 8);
//     the ACT pays completed years and months; the rest pay part years
//   - Queensland publishes a years/months/weeks/days table, so its part-year
//     arithmetic is modelled with the same components its table uses
//
// Nothing here is estimated. Where a rule is not stated by the jurisdiction's
// own guidance it is recorded as null and the page tells the reader to check
// with the authority instead of guessing (see LSL_UNVERIFIED).
//
// Each jurisdiction's published worked example is carried in `workedExample`
// and reconciled back to these formulas in
// lib/constants/__tests__/long-service-leave.test.ts. A drifted figure fails a
// test rather than shipping on a page.
// =============================================================================

export const LSL_SOURCES = {
  verifiedOn: "28 August 2026",
  /** NSW Industrial Relations, "Long service leave" — FAQs 7, 9 and the milestone/pro-rata tables. */
  nsw: "https://www.nsw.gov.au/employment/rights-responsibilities/leave/long-service-leave",
  /** Business Victoria, "Long service leave – an overview". */
  vic: "https://business.vic.gov.au/business-information/staff-and-hr/long-service-leave-victoria/long-service-leave-an-overview",
  /** Business Victoria, "How is long service leave calculated" — the Lissa worked example. */
  vicExamples: "https://business.vic.gov.au/business-information/staff-and-hr/long-service-leave-victoria/how-is-long-service-leave-calculated",
  /** Business Queensland, "Long service leave entitlements and continuous service". */
  qld: "https://www.business.qld.gov.au/running-business/employing/legal-obligations/long-service-leave/entitlements",
  /** Business Queensland, "Calculating long service leave" — the entitlement tables. */
  qldCalculating: "https://www.business.qld.gov.au/running-business/employing/legal-obligations/long-service-leave/calculating",
  /** Business Queensland, "Transferring, taking and cashing in long service leave in Queensland". */
  qldCashing: "https://www.business.qld.gov.au/running-business/employing/legal-obligations/long-service-leave/cashing-in",
  /** Private Sector Labour Relations (WA), "Taking long service leave". */
  wa: "https://www.wa.gov.au/organisation/private-sector-labour-relations/taking-long-service-leave",
  /** Private Sector Labour Relations (WA), "Long service leave when employment ends" — Riley and Lee examples. */
  waEnding: "https://www.wa.gov.au/organisation/private-sector-labour-relations/long-service-leave-when-employment-ends",
  /** Private Sector Labour Relations (WA), "Entitlements to long service leave" — cashing out. */
  waEntitlements: "https://www.wa.gov.au/organisation/private-sector-labour-relations/entitlements-long-service-leave",
  /** SafeWork SA, "Accruing leave" — the Aisha pro-rata worked example. */
  sa: "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave/accruing-leave",
  /** SafeWork SA long service leave hub. */
  saHub: "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave",
  /** WorkSafe Tasmania, "Long service leave". */
  tas: "https://worksafe.tas.gov.au/topics/laws-and-compliance/long-service-leave",
  /** WorkSafe Tasmania, "Pro rata long service leave" — the two worked examples. */
  tasProRata: "https://worksafe.tas.gov.au/topics/laws-and-compliance/long-service-leave/pro-rata-long-service-leave",
  /** WorkSafe ACT, "Long service leave". */
  act: "https://www.worksafe.act.gov.au/laws-and-compliance/long-service-leave",
  /** WorkSafe ACT Guidance Note 067 — Long Service Leave (PDF). */
  actGuidanceNote: "https://www.worksafe.act.gov.au/__data/assets/pdf_file/0007/1673962/Long-Service-Leave-Guidance-Note.pdf",
  /** NT Government, "Long service leave". */
  nt: "https://nt.gov.au/employ/for-employees-in-nt/holidays-and-leave/long-service-leave",
  /** Fair Work Ombudsman, "Long service leave" — the federal/NES interaction. */
  fwo: "https://www.fairwork.gov.au/leave/long-service-leave",
  /** ATO, "Unused long service leave" (withholding from unused leave payments). */
  ato: "https://www.ato.gov.au/forms-and-instructions/employment-termination-payments-withholding-from-unused-leave-payments/unused-long-service-leave",
} as const;

/**
 * Rules we could NOT read from a jurisdiction's own guidance on the
 * verification date. These are excluded from the comparison table rather than
 * estimated; the pages send the reader to the authority instead.
 */
export const LSL_UNVERIFIED = [
  "SA_CASHING_OUT_UNVERIFIED — SafeWork SA's long service leave pages do not state whether an SA entitlement can be cashed out. Readers are sent to SafeWork SA.",
  "ACT_CASHING_OUT_UNVERIFIED — WorkSafe ACT Guidance Note 067 does not address cashing out. Readers are sent to WorkSafe ACT.",
  "UNPAID_PARENTAL_LEAVE_NSW_QLD_WA_SA_NT_UNVERIFIED — only Victoria and Tasmania state on their own pages how unpaid parental leave is treated for long service leave accrual, so no cross-jurisdiction row is published.",
] as const;

export type JurisdictionCode = "nsw" | "vic" | "qld" | "wa" | "sa" | "tas" | "act" | "nt";

export const JURISDICTION_CODES: readonly JurisdictionCode[] = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"];

/**
 * How a part year is counted when the entitlement is paid out.
 *  - "part-years": part years count in full (NSW, VIC, QLD, WA, TAS)
 *  - "completed-years-and-months": completed years and months only (ACT)
 *  - "completed-years": completed years only, part years are dropped (SA, NT)
 */
export type ProRataBasis = "part-years" | "completed-years-and-months" | "completed-years";

/**
 * How the balance you can actually TAKE while still employed steps up.
 *  - "milestones": a block lands at 10 years and again every 5 years (NSW, WA, TAS)
 *  - "milestones-then-continuous": blocks at 10 and 15, continuous after 15 (QLD)
 *  - "continuous": the accrued balance is takeable once you qualify (VIC, ACT, SA, NT)
 */
export type TakingModel = "milestones" | "milestones-then-continuous" | "continuous";

export interface LslJurisdiction {
  code: JurisdictionCode;
  /** Uppercase abbreviation used in tables and headings. */
  abbr: string;
  name: string;
  /** Reads naturally after "in", e.g. "in New South Wales", "in the ACT". */
  inName: string;
  /** Reads naturally before a noun, e.g. "NSW long service leave". */
  adjective: string;
  act: string;
  actUrl: string;
  agency: string;
  agencyUrl: string;
  /** The page the entitlement figures were read from. */
  sourceUrl: string;
  /** Years of continuous service before leave can be TAKEN. */
  takeAfterYears: number;
  /** Weeks that have accrued at takeAfterYears, as the jurisdiction publishes it. */
  weeksAtQualifying: number;
  /** Weeks accrued for each year of continuous service, as published. */
  weeksPerYear: number;
  /** What happens after the qualifying milestone, in the jurisdiction's own words. */
  thereafter: string;
  takingModel: TakingModel;
  /** Extra weeks granted at each further milestone (milestone models only). */
  milestoneStepWeeks: number | null;
  /** Years between milestones after the first (milestone models only). */
  milestoneEveryYears: number | null;
  /** Completed years of service at which a pro-rata payment first becomes possible. */
  proRataFromYears: number;
  /** Completed years from which a pro-rata payment is owed however the job ends. */
  proRataUnconditionalFromYears: number;
  /** The conditions that apply between proRataFromYears and proRataUnconditionalFromYears. */
  proRataConditions: string[];
  proRataBasis: ProRataBasis;
  /** Whether casual employees accrue under this Act, as the authority states it. */
  casualsCovered: boolean;
  casualsNote: string;
  /** null where the jurisdiction's own guidance does not address it — see LSL_UNVERIFIED. */
  cashingOut: "prohibited" | "by-agreement" | "restricted" | null;
  cashingOutNote: string;
  /** Who the Act does not cover, from the authority's own list. */
  notCovered: string[];
  /** One-paragraph summary in the authority's own terms. */
  summary: string;
}

// Six jurisdictions express the rate as 8.667 weeks (two months) per 10 years.
// NSW, Victoria, Queensland and the ACT publish it to four decimal places
// (8.6667 / 0.86667); WA and Tasmania publish 8.667 / 0.8667. The published
// precision is preserved because each jurisdiction's own worked examples are
// computed at that precision — see the tests.
const RATE_4DP = 8.6667 / 10; // 0.86667
const RATE_3DP = 0.8667; // WA and Tasmania, as published
const RATE_SA_NT = 1.3;

export const LSL_JURISDICTIONS: Readonly<Record<JurisdictionCode, LslJurisdiction>> = {
  nsw: {
    code: "nsw",
    abbr: "NSW",
    name: "New South Wales",
    inName: "in New South Wales",
    adjective: "NSW",
    act: "Long Service Leave Act 1955 (NSW)",
    actUrl: "https://legislation.nsw.gov.au/view/html/inforce/current/act-1955-038",
    agency: "NSW Industrial Relations",
    agencyUrl: "https://www.nsw.gov.au/employment/rights-responsibilities/leave/long-service-leave",
    sourceUrl: LSL_SOURCES.nsw,
    takeAfterYears: 10,
    // "10 years — 8.67 weeks (2 months) of paid long service leave."
    weeksAtQualifying: 8.67,
    weeksPerYear: RATE_4DP,
    thereafter: "an extra 4.33 weeks (one month) for every further 5 years, so 20 years is 17.33 weeks",
    takingModel: "milestones",
    milestoneStepWeeks: 4.33,
    milestoneEveryYears: 5,
    proRataFromYears: 5,
    proRataUnconditionalFromYears: 10,
    proRataConditions: [
      "the employer ends the employment for any reason other than serious and wilful misconduct",
      "you resign because of illness, incapacity, or domestic or other pressing necessity",
      "you die (the payment goes to your estate)",
    ],
    proRataBasis: "part-years",
    casualsCovered: true,
    casualsNote:
      "The Act covers full-time, part-time (including part-timers with fluctuating hours), casual, piecework, commission and outworker employees.",
    cashingOut: "prohibited",
    cashingOutNote:
      "Long service leave cannot be cashed out in NSW. It is an offence to give or receive payment instead of taking the leave, and a criminal conviction may be recorded.",
    notCovered: [
      "private sector employees whose long service leave comes from an award, agreement or pre-modernised award",
      "NSW public sector employees under the Government Sector Employment Regulation 2014",
      "Commonwealth government employees",
      "local government employees under the Local Government State Award 2023",
      "building and construction, contract cleaning, community services and black coal mining employees in a portable scheme",
    ],
    summary:
      "Ten years of continuous service with one employer earns 8.67 weeks — two months — of paid long service leave, then 4.33 weeks for every further 5 years. Between 5 and 10 years a pro-rata payment is owed only if the employer ends the job for something other than serious and wilful misconduct, or you resign because of illness, incapacity or pressing necessity. Past 10 years it is paid out however the job ends.",
  },

  vic: {
    code: "vic",
    abbr: "VIC",
    name: "Victoria",
    inName: "in Victoria",
    adjective: "Victorian",
    act: "Long Service Leave Act 2018 (Vic)",
    actUrl: "https://www.legislation.vic.gov.au/in-force/acts/long-service-leave-act-2018",
    agency: "Wage Inspectorate Victoria",
    agencyUrl: "https://www.vic.gov.au/long-service-leave",
    sourceUrl: LSL_SOURCES.vic,
    takeAfterYears: 7,
    // 7 years x 52 weeks / 60 = 6.0667 weeks.
    weeksAtQualifying: 6.0667,
    weeksPerYear: RATE_4DP,
    thereafter: "continuous accrual at one week for every 60 weeks of employment — no further waiting period",
    takingModel: "continuous",
    milestoneStepWeeks: null,
    milestoneEveryYears: null,
    proRataFromYears: 7,
    proRataUnconditionalFromYears: 7,
    proRataConditions: [],
    proRataBasis: "part-years",
    casualsCovered: true,
    casualsNote:
      "Full-time, part-time, casual, seasonal and fixed-term employees are all covered where the employment has been continuous. For casuals and seasonal workers, an absence of more than 12 weeks between engagements can break continuity unless one of the Act's exceptions applies.",
    cashingOut: "prohibited",
    cashingOutNote:
      "Long service leave cannot be cashed out in Victoria. It is an offence under the Act to give or receive payment instead of the employee actually taking the break from work.",
    notCovered: [
      "employees under a federal award or workplace agreement that contains its own long service leave provisions",
      "building and construction employees, whose entitlement comes from the LeavePlus (formerly CoINVEST) scheme",
    ],
    summary:
      "Victoria has one of the shortest qualifying periods in the country: 7 years of continuous employment with one employer, at which point about 6.07 weeks has accrued. Leave accrues at one week for every 60 weeks of employment, and once you pass 7 years the whole unused balance is paid out however the employment ends — resignation included.",
  },

  qld: {
    code: "qld",
    abbr: "QLD",
    name: "Queensland",
    inName: "in Queensland",
    adjective: "Queensland",
    act: "Industrial Relations Act 2016 (Qld)",
    actUrl: "https://www.legislation.qld.gov.au/view/html/inforce/current/act-2016-063",
    agency: "Industrial Relations, Office of Industrial Relations",
    agencyUrl: "https://www.business.qld.gov.au/running-business/employing/legal-obligations/long-service-leave",
    sourceUrl: LSL_SOURCES.qld,
    takeAfterYears: 10,
    weeksAtQualifying: 8.6667,
    weeksPerYear: RATE_4DP,
    thereafter: "a further 4.3333 weeks at 15 years (13 weeks in total); past 15 years leave can be accessed as it accrues",
    takingModel: "milestones-then-continuous",
    milestoneStepWeeks: 4.3333,
    milestoneEveryYears: 5,
    proRataFromYears: 7,
    proRataUnconditionalFromYears: 10,
    proRataConditions: [
      "your service ends because you die",
      "you end your service because of illness, injury, incapacity or another medical condition, or a domestic or other pressing necessity",
      "the employer dismisses you because of your illness",
      "the employer dismisses you for a reason other than your conduct, capacity or performance",
      "the employer unfairly dismisses you",
    ],
    proRataBasis: "part-years",
    casualsCovered: true,
    casualsNote:
      "Casual and regular part-time employees qualify after the same 10 years. Their entitlement is worked out from hours, not weeks: total ordinary hours ÷ 52 × 8.6667 ÷ 10. Since 30 March 1994 all continuous casual service counts, but a break of more than 3 months between contracts can end continuity. Casuals are paid at the loaded casual hourly rate.",
    cashingOut: "restricted",
    cashingOutNote:
      "Queensland long service leave can only be cashed in if the award, enterprise agreement or certified agreement allows it, or if the Queensland Industrial Relations Commission orders it on compassionate grounds or financial hardship (Form 13), and only once the entitlement has been reached.",
    notCovered: [
      "employees whose long service leave comes from a federal award or enterprise agreement",
      "building and construction and contract cleaning employees in Queensland's portable schemes",
    ],
    summary:
      "Ten years of continuous service earns 8.6667 weeks, rising to 13 weeks at 15 years; past 15 years leave can be taken as it accrues. Between 7 and 10 years a proportionate payment is owed only in defined circumstances — death, illness, domestic necessity, or a dismissal that is not about your conduct, capacity or performance. From 10 years the payment on termination is automatic and covers your full continuous service.",
  },

  wa: {
    code: "wa",
    abbr: "WA",
    name: "Western Australia",
    inName: "in Western Australia",
    adjective: "WA",
    act: "Long Service Leave Act 1958 (WA)",
    actUrl: "https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_559_homepage.html",
    agency: "Private Sector Labour Relations (Wageline)",
    agencyUrl: "https://www.wa.gov.au/organisation/private-sector-labour-relations/long-service-leave-western-australia",
    sourceUrl: LSL_SOURCES.wa,
    takeAfterYears: 10,
    weeksAtQualifying: 8.667,
    weeksPerYear: RATE_3DP,
    thereafter: "a further 4.333 weeks for every 5 years of continuous employment after the first 10",
    takingModel: "milestones",
    milestoneStepWeeks: 4.333,
    milestoneEveryYears: 5,
    proRataFromYears: 7,
    proRataUnconditionalFromYears: 7,
    proRataConditions: [],
    proRataBasis: "part-years",
    casualsCovered: true,
    casualsNote:
      "Full-time, part-time, casual and seasonal employees all accrue under the WA Act. All hours worked up to the last day, including a worked notice period, count towards continuous employment.",
    cashingOut: "by-agreement",
    cashingOutNote:
      "WA long service leave can be cashed out by agreement between the employer and employee once the entitlement has fully accrued.",
    notCovered: [
      "employees whose long service leave comes from a federal award or agreement with its own provisions",
      "employees in a portable long service leave scheme",
    ],
    summary:
      "Leave can be taken after 10 years of continuous employment, when 8.667 weeks has accrued, with another 4.333 weeks every 5 years after that. WA is unusually generous at the exit: after 7 years of continuous employment a full-time, part-time, casual or seasonal employee is paid pro-rata long service leave when the job ends by resignation, dismissal, redundancy or death — the only exception being dismissal for serious misconduct.",
  },

  sa: {
    code: "sa",
    abbr: "SA",
    name: "South Australia",
    inName: "in South Australia",
    adjective: "South Australian",
    act: "Long Service Leave Act 1987 (SA)",
    actUrl: "https://www.legislation.sa.gov.au/lz?path=/C/A/LONG%20SERVICE%20LEAVE%20ACT%201987",
    agency: "SafeWork SA",
    agencyUrl: "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave",
    sourceUrl: LSL_SOURCES.sa,
    takeAfterYears: 10,
    weeksAtQualifying: 13,
    weeksPerYear: RATE_SA_NT,
    thereafter: "1.3 weeks (9.1 days) for each subsequent year, which can be taken as it accrues with the employer's approval",
    takingModel: "continuous",
    milestoneStepWeeks: null,
    milestoneEveryYears: null,
    proRataFromYears: 7,
    proRataUnconditionalFromYears: 7,
    proRataConditions: [],
    proRataBasis: "completed-years",
    casualsCovered: true,
    casualsNote:
      "Full-time, part-time and casual workers accrue at the same 1.3 weeks a year — employment status does not change the rate. A casual's contracts must form a continuous series; a prolonged gap or a clear termination can break it. Weeks that do not count as service (such as unpaid leave) must be added on before the 10 years is reached.",
    cashingOut: null,
    cashingOutNote:
      "SafeWork SA's long service leave guidance does not state whether an SA entitlement can be cashed out. Check with SafeWork SA before agreeing to anything.",
    notCovered: [
      "workers whose long service leave comes from the federal system rather than the SA Act",
      "community services workers covered by SA's portable long service leave scheme",
    ],
    summary:
      "South Australia pays the largest entitlement in the country: 13 weeks after 10 years of continuous service, then 1.3 weeks for every year after that, at the same rate whether you are full-time, part-time or casual. A pro-rata payment becomes available once you complete 7 years, worth 1.3 weeks for each COMPLETED year — 8½ years pays 10.4 weeks, not 11.05. It is not payable if you are dismissed for serious and wilful misconduct or you end the contract unlawfully, such as by walking out without working your notice.",
  },

  tas: {
    code: "tas",
    abbr: "TAS",
    name: "Tasmania",
    inName: "in Tasmania",
    adjective: "Tasmanian",
    act: "Long Service Leave Act 1976 (Tas)",
    actUrl: "https://www.legislation.tas.gov.au/view/html/inforce/current/act-1976-095",
    agency: "WorkSafe Tasmania",
    agencyUrl: "https://worksafe.tas.gov.au/topics/laws-and-compliance/long-service-leave",
    sourceUrl: LSL_SOURCES.tas,
    takeAfterYears: 10,
    weeksAtQualifying: 8.667,
    weeksPerYear: RATE_3DP,
    thereafter: "4⅓ weeks after each additional 5 years of continuous employment",
    takingModel: "milestones",
    milestoneStepWeeks: 4.333,
    milestoneEveryYears: 5,
    proRataFromYears: 7,
    proRataUnconditionalFromYears: 10,
    proRataConditions: [
      "you reach retirement age (60 for women, 65 for men, as the Act words it)",
      "you die — the payment goes to your estate",
      "the employer terminates your employment for any reason other than serious and wilful misconduct",
      "employment ends through illness serious enough to justify it, or you resign because of incapacity or domestic or other pressing necessity (these two are decided case by case)",
    ],
    proRataBasis: "part-years",
    casualsCovered: true,
    casualsNote:
      "Part-time and casual employees can be entitled to a pro-rata payment on termination. Absences due to certified illness or injury count as service; maternity leave and industrial-dispute interruptions do not break continuity but do not count as service either, so the time has to be made up.",
    cashingOut: "by-agreement",
    cashingOutNote:
      "By agreement with the employer, Tasmanian employees may cash in long service leave, or take a mixture of cash and leave.",
    notCovered: [
      "local, state and Commonwealth government employees",
      "construction industry employees, who are covered by TasBuild",
      "employees covered by federal awards or agreements that contain long service leave provisions",
      "mining employees, who have separate provisions in the same Act",
    ],
    summary:
      "Private sector Tasmanians get 8⅔ weeks of paid leave after 10 years of continuous employment, then 4⅓ weeks every 5 years. A pro-rata payment may be owed on termination once you have completed 7 but fewer than 10 years, and WorkSafe Tasmania calculates it as your years of continuous employment (including part years) ÷ 10 × 8.667 weeks.",
  },

  act: {
    code: "act",
    abbr: "ACT",
    name: "Australian Capital Territory",
    inName: "in the ACT",
    adjective: "ACT",
    act: "Long Service Leave Act 1976 (ACT)",
    actUrl: "https://www.legislation.act.gov.au/a/1976-27/",
    agency: "WorkSafe ACT",
    agencyUrl: "https://www.worksafe.act.gov.au/laws-and-compliance/long-service-leave",
    sourceUrl: LSL_SOURCES.actGuidanceNote,
    takeAfterYears: 7,
    weeksAtQualifying: 6.0667,
    weeksPerYear: RATE_4DP,
    thereafter: "a further 1/5 of a month (0.8667 weeks) for each subsequent year of continuous service",
    takingModel: "continuous",
    milestoneStepWeeks: null,
    milestoneEveryYears: null,
    proRataFromYears: 5,
    proRataUnconditionalFromYears: 7,
    proRataConditions: [
      "you resign because of illness, incapacity, or a domestic or other pressing necessity serious enough to justify it",
      "you leave on or after reaching the minimum retiring age",
      "you die",
      "the employer ends the employment for a reason other than your serious and wilful misconduct",
    ],
    proRataBasis: "completed-years-and-months",
    casualsCovered: true,
    casualsNote:
      "Full-time and part-time employees, including piece-rate workers, are covered; WorkSafe ACT says casual employees may also be covered. Service outside the ACT may not count towards the total.",
    cashingOut: null,
    cashingOutNote:
      "WorkSafe ACT's Long Service Leave Guidance Note does not address cashing out. Check with WorkSafe ACT before agreeing to anything.",
    notCovered: [
      "employees covered by an award or agreement that contains long service leave provisions",
      "ACT and Commonwealth public sector employees",
      "employees in the ACT's portable schemes — building and construction, contract cleaning, community sector and security",
    ],
    summary:
      "The ACT reaches the entitlement fastest of any jurisdiction: 6.0667 weeks of paid leave after just 7 years of continuous service, then a further fifth of a month each year. If a public holiday or award holiday falls during your long service leave, the leave is extended by a day. A pro-rata payment can be owed from as little as 5 years where the job ends through illness, incapacity, pressing necessity, retirement, death, or a dismissal short of serious and wilful misconduct — and it is worked out on completed years and months.",
  },

  nt: {
    code: "nt",
    abbr: "NT",
    name: "Northern Territory",
    inName: "in the Northern Territory",
    adjective: "NT",
    act: "Long Service Leave Act 1981 (NT)",
    actUrl: "https://legislation.nt.gov.au/Legislation/LONG-SERVICE-LEAVE-ACT-1981",
    agency: "NT Office of the Commissioner for Public Employment",
    agencyUrl: "https://nt.gov.au/employ/for-employees-in-nt/holidays-and-leave/long-service-leave",
    sourceUrl: LSL_SOURCES.nt,
    takeAfterYears: 10,
    weeksAtQualifying: 13,
    weeksPerYear: RATE_SA_NT,
    thereafter: "1.3 weeks of leave for each further completed year of employment",
    takingModel: "continuous",
    milestoneStepWeeks: null,
    milestoneEveryYears: null,
    proRataFromYears: 7,
    proRataUnconditionalFromYears: 10,
    proRataConditions: [
      "you have reached retirement age",
      "the employer ends your employment for a reason other than serious misconduct — redundancy, for example",
      "you resign because you are unable to work due to illness, incapacity, or a domestic or other pressing necessity",
    ],
    proRataBasis: "completed-years",
    casualsCovered: true,
    casualsNote:
      "Casual employment accumulates long service leave, and service carries across when the business is transferred to a new owner. Part years of service, absences on workers compensation and unpaid leave do not accumulate.",
    cashingOut: "prohibited",
    cashingOutNote: "You cannot cash in NT long service leave instead of taking it.",
    notCovered: [
      "NT Government employees",
      "Australian Government employees",
      "construction workers under the NT Build portable long service scheme",
    ],
    summary:
      "Thirteen weeks of paid leave after 10 years of continuous service, calculated at 1.3 weeks for each year of employment. Part years do not count — 14½ years pays 14 years — and you cannot cash the leave out instead of taking it. Between 7 and 10 years a pro-rata payment is owed only if you reach retirement age, the employer ends the job for something other than serious misconduct, or you resign because of illness, incapacity or pressing necessity.",
  },
};

// =============================================================================
// SERVICE ARITHMETIC
// =============================================================================

/** Days in a year used to convert leftover days into a fraction of a year. */
export const DAYS_PER_YEAR = 365;
/** Weeks a year, as every jurisdiction's own worked examples use it. */
export const WEEKS_PER_YEAR = 52;

export interface ServicePeriod {
  /** Completed years of continuous service. */
  years: number;
  /** Completed months on top of the completed years (0–11). */
  months: number;
  /** Completed whole weeks on top of that. */
  weeks: number;
  /** Leftover days on top of that (0–6). */
  days: number;
  /** Total calendar days between the two dates. */
  totalDays: number;
  /**
   * Service expressed as a decimal number of years:
   * years + months/12 + (weeks × 7 + days)/365. This is the form Tasmania and
   * WA publish their worked examples in ("13.5383 years").
   */
  decimalYears: number;
}

function isLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInMonth(year: number, monthIndex0: number) {
  return [31, isLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex0];
}

/** Parse a YYYY-MM-DD string into a UTC date, avoiding local-timezone drift. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
}

/**
 * Break a start and end date into completed years, months, weeks and days —
 * the same components Queensland's published entitlement tables use.
 */
export function serviceBetween(startISO: string, endISO: string): ServicePeriod {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (end.getTime() <= start.getTime()) {
    return { years: 0, months: 0, weeks: 0, days: 0, totalDays: 0, decimalYears: 0 };
  }
  const totalDays = Math.round((end.getTime() - start.getTime()) / 86_400_000);

  // Count whole months by advancing the anniversary date, clamping to the end
  // of a short month (31 January plus one month is 28 or 29 February). The
  // leftover is then a genuine number of days, which is what stops a hire date
  // of the 29th, 30th or 31st from silently losing a day of service.
  const addMonths = (from: Date, n: number) => {
    const y = from.getUTCFullYear();
    const m = from.getUTCMonth() + n;
    const targetYear = y + Math.floor(m / 12);
    const targetMonth = ((m % 12) + 12) % 12;
    const day = Math.min(from.getUTCDate(), daysInMonth(targetYear, targetMonth));
    return new Date(Date.UTC(targetYear, targetMonth, day));
  };

  let totalMonths =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
  if (totalMonths > 0 && addMonths(start, totalMonths).getTime() > end.getTime()) totalMonths -= 1;
  if (totalMonths < 0) totalMonths = 0;

  const anchor = addMonths(start, totalMonths);
  const days = Math.round((end.getTime() - anchor.getTime()) / 86_400_000);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const weeks = Math.floor(days / 7);
  const leftoverDays = days % 7;

  return {
    years,
    months,
    weeks,
    days: leftoverDays,
    totalDays,
    decimalYears: years + months / 12 + (weeks * 7 + leftoverDays) / DAYS_PER_YEAR,
  };
}

/** Build a ServicePeriod straight from components, for worked examples. */
export function serviceFromParts(years: number, months = 0, weeks = 0, days = 0): ServicePeriod {
  return {
    years,
    months,
    weeks,
    days,
    totalDays: Math.round((years + months / 12) * DAYS_PER_YEAR) + weeks * 7 + days,
    decimalYears: years + months / 12 + (weeks * 7 + days) / DAYS_PER_YEAR,
  };
}

/**
 * The service figure a jurisdiction actually pays on, in years. This is where
 * the jurisdictions diverge structurally: SA and the NT drop part years, the
 * ACT keeps completed years and months but drops the days, and the rest pay
 * the whole part year.
 */
export function payableServiceYears(code: JurisdictionCode, svc: ServicePeriod): number {
  switch (LSL_JURISDICTIONS[code].proRataBasis) {
    case "completed-years":
      return svc.years;
    case "completed-years-and-months":
      return svc.years + svc.months / 12;
    case "part-years":
    default:
      // Queensland publishes an entitlement table in which a week is 1/52 of a
      // year and a day is 1/7 of a week, so its part-year arithmetic runs on a
      // 364-day year. Every other jurisdiction's worked example reconciles on
      // a 365-day year (Tasmania states "13 years 6 months and 14 days =
      // 13.5383 years", which is 14/365). The two conventions differ by about
      // two ten-thousandths of a week, which is why they are modelled
      // separately rather than averaged.
      return code === "qld"
        ? svc.years + svc.months / 12 + svc.weeks / WEEKS_PER_YEAR + svc.days / (WEEKS_PER_YEAR * 7)
        : svc.decimalYears;
  }
}

/**
 * Weeks of long service leave accrued over a period of continuous service,
 * on the jurisdiction's own basis. This is the figure that is paid out when
 * employment ends and a pro-rata entitlement exists.
 *
 * Victoria's Act expresses the same thing as "total weeks of employment ÷ 60";
 * Business Victoria's worked example runs it as years × 52 ÷ 60, which is
 * identical to 0.86667 weeks a year, so the shared rate is used.
 */
export function accruedWeeks(code: JurisdictionCode, svc: ServicePeriod): number {
  const j = LSL_JURISDICTIONS[code];
  return payableServiceYears(code, svc) * j.weeksPerYear;
}

/**
 * Weeks you can actually TAKE as leave while still employed. In NSW, WA and
 * Tasmania this is a step function — nothing until 10 years, then a block, then
 * another block every 5 years. Queensland steps at 10 and 15 and then runs
 * continuously. Victoria, the ACT, SA and the NT hand over the accrued balance
 * once the qualifying period is met.
 */
export function takeableWeeks(code: JurisdictionCode, svc: ServicePeriod): number {
  const j = LSL_JURISDICTIONS[code];
  const years = svc.years + svc.months / 12 + (svc.weeks * 7 + svc.days) / DAYS_PER_YEAR;
  if (years < j.takeAfterYears) return 0;

  switch (j.takingModel) {
    case "milestones": {
      const extraBlocks = Math.floor((years - j.takeAfterYears) / (j.milestoneEveryYears as number));
      return j.weeksAtQualifying + extraBlocks * (j.milestoneStepWeeks as number);
    }
    case "milestones-then-continuous": {
      const secondMilestone = j.takeAfterYears + (j.milestoneEveryYears as number);
      if (years < secondMilestone) return j.weeksAtQualifying;
      return accruedWeeks(code, svc);
    }
    case "continuous":
    default:
      return accruedWeeks(code, svc);
  }
}

export type EndingReason =
  | "resignation"
  | "redundancy"
  | "dismissal-not-misconduct"
  | "serious-misconduct"
  | "illness-or-pressing-necessity"
  | "retirement"
  | "death";

/**
 * Reasons that satisfy the conditional pro-rata window in every jurisdiction
 * that has one. Serious misconduct is the universal disqualifier; plain
 * resignation is the case that fails the conditional window.
 */
const CONDITIONAL_QUALIFYING: readonly EndingReason[] = [
  "redundancy",
  "dismissal-not-misconduct",
  "illness-or-pressing-necessity",
  "retirement",
  "death",
];

export interface Entitlement {
  code: JurisdictionCode;
  service: ServicePeriod;
  /** Weeks accrued on the jurisdiction's payable basis. */
  accruedWeeks: number;
  /** Weeks you could take as leave right now, still employed. */
  takeableWeeks: number;
  /** True once you have served long enough to take leave. */
  canTakeLeave: boolean;
  /** Years still to serve before leave can be taken (0 once qualified). */
  yearsToQualify: number;
  /** Weeks payable if employment ended now for `reason`. */
  payableOnEndingWeeks: number;
  /** True when a payment is owed however the job ends. */
  payableUnconditionally: boolean;
  /** Why nothing (or something) is payable — plain English, for the page. */
  payableExplanation: string;
}

/**
 * What is owed if employment ends today. Serious and wilful misconduct
 * disqualifies a pro-rata payment in every jurisdiction that words it that
 * way; NSW, QLD, TAS and the NT still pay the full accrued balance once you
 * are past their unconditional threshold, so misconduct only bites inside the
 * conditional window.
 */
export function entitlementOnEnding(
  code: JurisdictionCode,
  svc: ServicePeriod,
  reason: EndingReason = "resignation",
): Entitlement {
  const j = LSL_JURISDICTIONS[code];
  const years = svc.years + svc.months / 12 + (svc.weeks * 7 + svc.days) / DAYS_PER_YEAR;
  const accrued = accruedWeeks(code, svc);
  const takeable = takeableWeeks(code, svc);
  const canTake = years >= j.takeAfterYears;

  let payable = 0;
  let unconditional = false;
  let explanation: string;

  if (years < j.proRataFromYears) {
    explanation = `Under ${j.proRataFromYears} years of continuous service, so no long service leave is payable ${j.inName} however the job ends.`;
  } else if (years >= j.proRataUnconditionalFromYears) {
    // Past the unconditional threshold the balance is paid however the job
    // ends. WA and SA are the exception: both name serious misconduct as a
    // disqualifier at every length of service. Victoria's own guidance says
    // the balance is paid "for any reason" after 7 years and names no
    // misconduct exclusion, so none is applied here.
    const misconductBlocks = reason === "serious-misconduct" && (code === "wa" || code === "sa");
    if (misconductBlocks) {
      explanation =
        code === "sa"
          ? "SafeWork SA says a pro-rata payment is not owed where the contract is terminated for serious and wilful misconduct."
          : "WA does not pay pro-rata long service leave where an employee is dismissed for serious misconduct.";
    } else {
      payable = accrued;
      unconditional = true;
      explanation = `At ${j.proRataUnconditionalFromYears}+ years ${j.inName}, the accrued balance is paid out however the employment ends.`;
    }
  } else if (CONDITIONAL_QUALIFYING.includes(reason)) {
    payable = accrued;
    explanation = `Between ${j.proRataFromYears} and ${j.proRataUnconditionalFromYears} years ${j.inName}, a pro-rata payment is owed only in defined circumstances — and this one qualifies.`;
  } else {
    explanation = `Between ${j.proRataFromYears} and ${j.proRataUnconditionalFromYears} years ${j.inName}, a pro-rata payment is owed only in defined circumstances. A plain resignation is not one of them.`;
  }

  return {
    code,
    service: svc,
    accruedWeeks: accrued,
    takeableWeeks: takeable,
    canTakeLeave: canTake,
    yearsToQualify: Math.max(0, j.takeAfterYears - years),
    payableOnEndingWeeks: payable,
    payableUnconditionally: unconditional,
    payableExplanation: explanation,
  };
}

/**
 * Queensland's separate formula for casual and regular part-time employees,
 * published as: total ordinary hours ÷ 52 × 8.6667 ÷ 10 = hours of leave.
 */
export function qldCasualLeaveHours(totalOrdinaryHours: number): number {
  return (totalOrdinaryHours / WEEKS_PER_YEAR) * 8.6667 / 10;
}

/** Gross value of a long service leave balance at an ordinary weekly rate. */
export function payoutValue(weeks: number, ordinaryWeeklyPay: number): number {
  return weeks * ordinaryWeeklyPay;
}

// =============================================================================
// TAX ON A LONG SERVICE LEAVE PAYOUT
// =============================================================================
// Read from the ATO's "Withholding from unused leave payments on termination
// of employment" (QC19081, ATO page last updated 1 May 2020) on
// LSL_SOURCES.verifiedOn. Long service leave TAKEN as leave while still
// employed is paid through normal payroll and withheld at your usual rates —
// this schedule applies only to an UNUSED balance paid out when the job ends.

export const LSL_TAX = {
  atoUrl: LSL_SOURCES.ato,
  /** The ATO's own last-updated stamp on the schedule. */
  atoLastUpdated: "1 May 2020",
  /** Service before this date has only 5% of its component taxed, at marginal rates. */
  preAug1978Cutover: "16 August 1978",
  /** The boundary between the flat-rate band and the marginal-rate band. */
  aug1993Cutover: "17 August 1993",
  /** Proportion of a pre-16 August 1978 component included at marginal rates. */
  pre1978IncludedProportion: 0.05,
  /** Flat withholding rate the ATO applies to the concessional components. */
  flatRate: 0.32,
  /**
   * Where the post-17 August 1993 long service leave component plus unused
   * annual leave is under this, the ATO says withhold 32% instead of running
   * the marginal-rate calculation.
   */
  smallPaymentThreshold: 300,
  /** No tax is withheld from unused leave paid after the death of an employee. */
  noWithholdingAfterDeath: true,
  /** Withholding where no valid TFN was given (resident / foreign resident). */
  noTfnRate: { resident: 0.47, foreignResident: 0.45 },
} as const;

export type LeavingReason = "redundancy-invalidity-early-retirement" | "other";

export interface LslTaxComponents {
  /** Dollars of the payout attributable to service before 16 August 1978. */
  pre1978: number;
  /** Dollars attributable to 16 August 1978 – 17 August 1993. */
  between1978And1993: number;
  /** Dollars attributable to service after 17 August 1993. */
  post1993: number;
}

/**
 * Split a payout across the ATO's three accrual periods, in proportion to the
 * days of the eligible service period that fall in each — the ATO's step 1
 * and step 2. Anyone whose service started after 17 August 1993 lands wholly
 * in `post1993`, which is every employee who started in the last 33 years.
 */
export function splitLslComponents(
  payout: number,
  serviceStartISO: string,
  serviceEndISO: string,
): LslTaxComponents {
  const start = parseISODate(serviceStartISO).getTime();
  const end = parseISODate(serviceEndISO).getTime();
  const cut1978 = parseISODate("1978-08-16").getTime();
  const cut1993 = parseISODate("1993-08-18").getTime();
  const total = Math.max(1, end - start);

  const span = (from: number, to: number) => Math.max(0, Math.min(end, to) - Math.max(start, from));

  return {
    pre1978: (payout * span(-Infinity, cut1978)) / total,
    between1978And1993: (payout * span(cut1978, cut1993)) / total,
    post1993: (payout * span(cut1993, Infinity)) / total,
  };
}

export interface LslWithholding {
  /** Amount withheld from the pre-16 August 1978 component. */
  pre1978Withheld: number;
  /** Amount withheld from the 1978–1993 component (flat 32%). */
  between1978And1993Withheld: number;
  /** Amount withheld from the post-17 August 1993 component. */
  post1993Withheld: number;
  total: number;
  /** True when the whole payout was withheld at the flat concessional rate. */
  flatRateApplied: boolean;
}

/**
 * Withholding from an unused long service leave payment, per the ATO tables.
 *
 * `marginalRate` is the reader's own marginal rate including the Medicare
 * levy — the pages derive it by running salary and salary-plus-payout through
 * the site's tax engine rather than quoting a bracket, because the payout can
 * push you into the next bracket.
 */
export function lslWithholding(
  components: LslTaxComponents,
  reason: LeavingReason,
  marginalRate: number,
): LslWithholding {
  // Pre-16 August 1978: 5% of the component is taxed at marginal rates.
  const pre1978Withheld = components.pre1978 * LSL_TAX.pre1978IncludedProportion * marginalRate;

  if (reason === "redundancy-invalidity-early-retirement") {
    // Everything after 15 August 1978 is withheld at the flat rate.
    const post1978 = components.between1978And1993 + components.post1993;
    return {
      pre1978Withheld,
      between1978And1993Withheld: components.between1978And1993 * LSL_TAX.flatRate,
      post1993Withheld: components.post1993 * LSL_TAX.flatRate,
      total: pre1978Withheld + post1978 * LSL_TAX.flatRate,
      flatRateApplied: true,
    };
  }

  const between = components.between1978And1993 * LSL_TAX.flatRate;
  // The ATO withholds 32% from a post-1993 component under $300; above that it
  // runs the marginal-rate calculation.
  const small = components.post1993 < LSL_TAX.smallPaymentThreshold;
  const post = components.post1993 * (small ? LSL_TAX.flatRate : marginalRate);

  return {
    pre1978Withheld,
    between1978And1993Withheld: between,
    post1993Withheld: post,
    total: pre1978Withheld + between + post,
    flatRateApplied: small,
  };
}

// =============================================================================
// PUBLISHED WORKED EXAMPLES
// =============================================================================
// Each jurisdiction that publishes a worked example has it recorded here with
// the figure that jurisdiction printed, and the tests reconcile the formulas
// above back to it. `tolerance` is the published rounding: where a source
// prints four decimals the tolerance is tight, where it prints two and does
// not publish its own day-count convention the tolerance is one cent of a
// week. If a rate changes, these tests fail before the page can drift.

export interface WorkedExample {
  code: JurisdictionCode;
  label: string;
  /** Service as the source states it. */
  service: ServicePeriod;
  /** The number of weeks the source prints. */
  publishedWeeks: number;
  tolerance: number;
  sourceUrl: string;
  note?: string;
}

export const LSL_WORKED_EXAMPLES: readonly WorkedExample[] = [
  {
    code: "nsw",
    label: "Dean — part-time from 1 November 2009, store closed 1 May 2015",
    // NSW Industrial Relations gives dates, not a decimal, so the example is
    // reconciled from the dates themselves in the test.
    service: serviceBetween("2009-11-01", "2015-05-01"),
    publishedWeeks: 4.76,
    tolerance: 0.01,
    sourceUrl: LSL_SOURCES.nsw,
    note: "NSW FAQ 9. NSW does not publish its calculator's day-count convention, so the tolerance is one hundredth of a week.",
  },
  {
    code: "vic",
    label: "Lissa — 11 years of continuous employment, resigns",
    service: serviceFromParts(11),
    // 11 x 52 = 572 weeks; 572 / 60 = 9.5333, printed as 9.5.
    publishedWeeks: 9.5333,
    tolerance: 0.001,
    sourceUrl: LSL_SOURCES.vicExamples,
    note: "Business Victoria prints 9.5 weeks and $10,450 at $1,100 a week.",
  },
  {
    code: "qld",
    label: "18 years, 3 months, 2 weeks and 2 days of continuous service",
    service: serviceFromParts(18, 3, 2, 2),
    publishedWeeks: 15.8548,
    tolerance: 0.0001,
    sourceUrl: LSL_SOURCES.qldCalculating,
    note: "Business Queensland's own worked total from its entitlement tables.",
  },
  {
    code: "qld",
    label: "Terminated after 12 years with no leave taken",
    service: serviceFromParts(12),
    publishedWeeks: 10.4,
    tolerance: 0.0001,
    sourceUrl: LSL_SOURCES.qld,
    note: "8.6667 + 1.73333 weeks.",
  },
  {
    code: "wa",
    label: "Riley — resigned after 8 years, 4 months and 5 days",
    service: serviceFromParts(8, 4, 0, 5),
    publishedWeeks: 7.24,
    tolerance: 0.01,
    sourceUrl: LSL_SOURCES.waEnding,
    note: "WA does not publish its calculator's day-count convention; the tolerance is one hundredth of a week.",
  },
  {
    code: "wa",
    label: "Lee — made redundant after 12 years of continuous employment",
    service: serviceFromParts(12),
    publishedWeeks: 10.4,
    tolerance: 0.005,
    sourceUrl: LSL_SOURCES.waEnding,
  },
  {
    code: "sa",
    label: "Aisha — resigns after 8½ years with Fabulous Floors",
    service: serviceFromParts(8, 6),
    // SafeWork SA: 8 x 1.3 weeks. The half year is dropped.
    publishedWeeks: 10.4,
    tolerance: 0.0001,
    sourceUrl: LSL_SOURCES.sa,
    note: "SA pays completed years only, so 8½ years pays 8.",
  },
  {
    code: "tas",
    label: "Resigns because of ill health after exactly 9 years",
    service: serviceFromParts(9),
    publishedWeeks: 7.8003,
    tolerance: 0.0005,
    sourceUrl: LSL_SOURCES.tasProRata,
  },
  {
    code: "tas",
    label: "Resigns after 13 years, 6 months and 14 days (13.5383 years)",
    service: serviceFromParts(13, 6, 2, 0),
    publishedWeeks: 11.7336,
    tolerance: 0.0015,
    sourceUrl: LSL_SOURCES.tasProRata,
    note: "WorkSafe Tasmania states 13.5383 years x 0.8667 weeks. 14 days is modelled as 2 whole weeks.",
  },
  {
    code: "act",
    label: "Completes 7 years of continuous service",
    service: serviceFromParts(7),
    publishedWeeks: 6.0667,
    tolerance: 0.0001,
    sourceUrl: LSL_SOURCES.actGuidanceNote,
  },
  {
    code: "nt",
    label: "Resigns after 14½ years — paid for 14 completed years",
    service: serviceFromParts(14, 6),
    publishedWeeks: 18.2,
    tolerance: 0.0001,
    sourceUrl: LSL_SOURCES.nt,
    note: "NT pays completed years only: 14 x 1.3 weeks.",
  },
];

/** Business Queensland's three casual/part-time hours examples. */
export const QLD_CASUAL_EXAMPLES: readonly { hours: number; publishedLeaveHours: number; label: string }[] = [
  { hours: 9_600, publishedLeaveHours: 160.0006, label: "9,600 ordinary hours over 8 years (pro-rata on termination)" },
  { hours: 15_600, publishedLeaveHours: 260.001, label: "15,600 ordinary hours over 10 years" },
  { hours: 18_720, publishedLeaveHours: 312.0012, label: "18,720 ordinary hours over 13 years" },
];
