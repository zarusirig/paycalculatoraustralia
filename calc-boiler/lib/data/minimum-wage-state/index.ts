// =============================================================================
// Minimum wage by state and territory (/minimum-wage/{state}/) — F1, Oct 2026.
//
// The National Minimum Wage is one figure for the whole country, so a state
// page earns its place only by carrying what genuinely differs by state:
//   - which workers sit in the STATE industrial system rather than the national
//     one (Fair Work Ombudsman, "Fair Work system", content updated 13 Aug 2026),
//   - any state minimum wage or state wage case (WA, QLD, NSW — read from the
//     tribunals' own pages / decisions),
//   - the state's public holidays, payroll tax and long service leave, which are
//     READ FROM the existing verified datasets (lib/data/public-holidays,
//     lib/constants/payroll-tax, lib/constants/long-service-leave) rather than
//     re-keyed, so a refresh of those flows through here.
//
// Nothing here is estimated. A state-system wage figure we could not read from
// the tribunal is left out and the page says "check with the state regulator".
// Verified 5 October 2026 (Firecrawl) unless a line says otherwise.
// =============================================================================

import { fitDescription, fitTitle } from "../../seo-title";
import { EMPLOYMENT, SUPER_GUARANTEE } from "../../constants/australian-tax";
import { LSL_JURISDICTIONS } from "../../constants/long-service-leave";
import { NMW, QLD_STATE_WAGE_CASE_2026, WA_STATE_MINIMUM_WAGE } from "../../constants/minimum-wage";
import { PAYROLL_TAX_STATES } from "../../constants/payroll-tax";
import { STATE_PUBLIC_HOLIDAYS, statewideDays, yearOf } from "../public-holidays";
import type { PublicHolidayDate, StatePublicHolidays } from "../public-holidays";

export const MW_STATE_SLUGS = ["nsw", "vic", "wa", "sa", "tas", "qld", "act", "nt"] as const;
import type { MwStateSlug } from "./calc";
export * from "./calc";
import { fullTimeAdultTakeHome } from "./calc";

export const MW_STATE_VERIFIED_ON = "5 October 2026";

/** The 2026-27 minimum wage year: first full pay period from 1 July 2026 to 30 June 2027. */
export const MW_FY_START = "2026-07-01";
export const MW_FY_END = "2027-06-30";

export interface MwSource {
  title: string;
  publisher: string;
  url: string;
}

export interface MwStateInfo {
  slug: MwStateSlug;
  code: string;
  name: string;
  /** "in Victoria", "in the ACT". */
  inName: string;
  /** Plain-English reading of who is in the state system, from the FWO page. */
  systemSummary: string;
  /** What the FWO page says, quoted closely, for the "who the national wage covers" section. */
  systemFwo: string;
  /** True when a worker's minimum can be set by a state tribunal rather than the FWC. */
  hasStateWageSetting: boolean;
  /** Headline for the "state wage" section. */
  stateWageHeading: string;
  /** Paragraphs for the state wage-setting section. */
  stateWage: string[];
  /** Junior / apprentice / young-worker notes specific to the state. */
  youngWorkers: string[];
  /** The state's own regulators and information pages (all read on the verification date). */
  regulators: MwSource[];
  /** Where each state-specific figure was read. */
  sources: MwSource[];
  /** The role this state's page plays in the FAQ and title. */
  uniqueAngle: string;
}

const FWO_SYSTEM: MwSource = {
  title: "Fair Work system — who is covered",
  publisher: "Fair Work Ombudsman",
  url: "https://www.fairwork.gov.au/about-us/workplace-laws/fair-work-system",
};

const NMW_SOURCE: MwSource = {
  title: "National Minimum Wage Order 2026 (PR799279) and Annual Wage Review 2026 [2026] FWCFB 3500",
  publisher: "Fair Work Commission",
  url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr799279.pdf",
};

export const MW_STATES: Readonly<Record<MwStateSlug, MwStateInfo>> = {
  nsw: {
    slug: "nsw",
    code: "NSW",
    name: "New South Wales",
    inName: "in New South Wales",
    uniqueAngle: "NSW state awards rose 4.75% in the 2026 State Wage Case",
    systemFwo: "State public sector and local government employees aren't covered by the national system and remain under the state system.",
    systemSummary:
      "Almost every private-sector employee in NSW is in the national system, so the National Minimum Wage and modern awards apply. NSW state public sector and local government employees are the main group left in the state system.",
    hasStateWageSetting: true,
    stateWageHeading: "NSW state awards: the 2026 State Wage Case",
    stateWage: [
      "NSW has no minimum wage of its own that differs from the national one for private-sector employees. What NSW does have is a state Industrial Relations Commission that sets rates in NSW state awards, which cover state public sector and local government work and a handful of industries.",
      "In the State Wage Case 2026 ([2026] NSWIRComm 16, 25 August 2026) the Full Bench of the Industrial Relations Commission of NSW adopted the Fair Work Commission's 4.75% increase and applied it to the minimum rates in several state awards, including the Kindergartens and Child Care Centres (State) Award, the Health, Fitness and Indoor Sports Centres (State) Award and the Transport Industry (State) Award from the first full pay period on or after 1 July 2026. Some awards, including the Local Government, Aged, Disability and Home Care (State) Award and the Live Theatre and Concert (State) Award, move from the first full pay period on or after 1 September 2026.",
      "If your pay is set by a NSW state award, read the award itself on the Industrial Relations Commission site for the exact classification rate. The 4.75% figure is the size of the increase, not a new rate.",
    ],
    youngWorkers: [
      "Under-21 and apprentice rates for NSW private-sector employees come from the same national sources as everywhere else: the National Minimum Wage junior percentages if no award applies, or the junior and apprentice scales in the award that covers the job.",
      "Where a NSW state award applies, its own junior and apprentice provisions govern, not the national table.",
    ],
    regulators: [
      { title: "NSW Industrial Relations", publisher: "NSW Government", url: "https://www.nsw.gov.au/departments-and-agencies/premiers-department/nsw-industrial-relations" },
      { title: "State Wage Case 2026", publisher: "Industrial Relations Commission of NSW", url: "https://irc.nsw.gov.au/content/dcj/ctsd/irc/irc/major-cases-and-decisions/state-wage-case-2026.html" },
    ],
    sources: [
      FWO_SYSTEM,
      { title: "State Wage Case 2026 [2026] NSWIRComm 16", publisher: "Industrial Relations Commission of NSW", url: "https://www.caselaw.nsw.gov.au/decision/1a032a13e159214c92ded7b4" },
    ],
  },
  vic: {
    slug: "vic",
    code: "VIC",
    name: "Victoria",
    inName: "in Victoria",
    uniqueAngle: "Victoria is almost entirely in the national system",
    systemFwo: "Most employees in Victoria are covered by the national system. This includes state government employees with some exceptions such as senior public servants.",
    systemSummary:
      "Victoria is the clearest case of a single national wage: most Victorian employees, including state government employees apart from exceptions such as senior public servants, are in the national system. There is no Victorian state minimum wage.",
    hasStateWageSetting: false,
    stateWageHeading: "Is there a Victorian minimum wage?",
    stateWage: [
      "No. Victoria referred its industrial relations powers to the Commonwealth, so the Fair Work Commission sets the minimum wage and award rates for almost everyone who works in the state. A Melbourne cafe, a Geelong factory and a Victorian state government department all start from the same $26.44 floor.",
      "What Victoria does regulate itself, through the Workforce Inspectorate Victoria, is long service leave, the employment of children under 15 (child employment permits) and owner-driver and forestry contractor laws. Those are the Victorian rules that sit around a minimum-wage job.",
    ],
    youngWorkers: [
      "Victoria has its own child employment laws for children under 15, administered by the Workforce Inspectorate Victoria. Pay for 15-year-olds and older follows the national junior percentages or your award.",
      "Apprentice wages are set by the award or agreement that covers the trade, not by Victoria.",
    ],
    regulators: [
      { title: "Workforce Inspectorate Victoria", publisher: "Victorian Government", url: "https://www.vic.gov.au/workforce-inspectorate-victoria" },
      { title: "Business Victoria", publisher: "Victorian Government", url: "https://business.vic.gov.au/" },
    ],
    sources: [FWO_SYSTEM, { title: "Workforce Inspectorate Victoria", publisher: "Victorian Government", url: "https://www.vic.gov.au/workforce-inspectorate-victoria" }],
  },
  wa: {
    slug: "wa",
    code: "WA",
    name: "Western Australia",
    inName: "in Western Australia",
    uniqueAngle: "WA is the only state with its own State Minimum Wage",
    systemFwo: "All Western Australian State public sector employers are covered by the state industrial relations system. Sole traders, partnerships, other unincorporated entities and non-trading corporations are also covered by the state system.",
    systemSummary:
      "Western Australia is the one state where the minimum wage can differ. Employees of sole traders, partnerships, other unincorporated entities and non-trading corporations, and all WA state public sector employers, are in the WA state system. Employees of trading companies are in the national system.",
    hasStateWageSetting: true,
    stateWageHeading: "WA State Minimum Wage 2026",
    stateWage: [
      `The Western Australian Industrial Relations Commission raised the State Minimum Wage by ${(WA_STATE_MINIMUM_WAGE.increase * 100).toFixed(2)}% to $${WA_STATE_MINIMUM_WAGE.weekly.toFixed(2)} a week from ${WA_STATE_MINIMUM_WAGE.operativeFrom} (2026 State Wage Case, [2026] WAIRC 00381). It also increased award rates of pay by 4.75% from that time. The increases apply only to employees who are paid the minimum wage or award rates in the WA state system, which the Commission estimates covers about 27,000 employers and more than 300,000 employees.`,
      `The State Minimum Wage works out at $${WA_STATE_MINIMUM_WAGE.hourly.toFixed(2)} an hour for adults, which is $${(NMW.hourly - WA_STATE_MINIMUM_WAGE.hourly).toFixed(2)} an hour below the National Minimum Wage of $${NMW.hourly.toFixed(2)}. Which one applies depends on whether the employer is in the state or national system, not on where you live. A WA employee of a company is in the national system and gets at least $${NMW.hourly.toFixed(2)}.`,
      "Because the line between the two systems turns on the employer's legal structure, a business that changes from a sole trader to a company may move from one system to the other. The WA Department of Local Government, Industry Regulation and Safety (Wageline, 1300 655 266) can confirm which system applies.",
    ],
    youngWorkers: [
      "The WA State Minimum Wage figure on this page is the adult rate. Junior and apprentice rates in the WA state system come from the WA state award that covers the job, so check that award or Wageline for a worker under 21.",
      "A WA employee of a company in the national system gets the national junior percentages of the $26.44 rate, or their award's junior scale.",
    ],
    regulators: [
      { title: "WA Private Sector Labour Relations (Wageline)", publisher: "Government of Western Australia", url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/private-sector-labour-relations" },
      { title: "Which system of employment laws applies", publisher: "Government of Western Australia", url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/which-system-of-employment-laws-applies" },
      { title: "The 2026 State Wage Case", publisher: "WA Industrial Relations Commission", url: "https://www.wairc.wa.gov.au/state-wage-case/wage-case-5" },
    ],
    sources: [
      FWO_SYSTEM,
      { title: "The 2026 State Wage Case", publisher: "WA Industrial Relations Commission", url: "https://www.wairc.wa.gov.au/state-wage-case/wage-case-5" },
      { title: "WA award and minimum rates of pay to increase from 1 July 2026", publisher: "Government of Western Australia", url: WA_STATE_MINIMUM_WAGE.url },
    ],
  },
  sa: {
    slug: "sa",
    code: "SA",
    name: "South Australia",
    inName: "in South Australia",
    uniqueAngle: "SA payroll tax phases in between $1.5 million and $1.7 million",
    systemFwo: "State public sector and local government employees aren't covered by the national system and remain under the state system.",
    systemSummary:
      "Private-sector employees in South Australia are in the national system and get the National Minimum Wage and modern award rates. South Australian state public sector and local government employees remain under the state system.",
    hasStateWageSetting: false,
    stateWageHeading: "Is there a South Australian minimum wage?",
    stateWage: [
      "No separate South Australian minimum wage applies to private-sector employees. South Australia referred its private-sector industrial relations powers to the Commonwealth, so the Fair Work Commission's $26.44 floor and its modern awards apply, with SafeWork SA as the state body listed by the Fair Work Ombudsman for those outside the national system.",
      "State public sector and local government employees in South Australia remain in the state system. Their pay comes from state awards and enterprise agreements, not from a state minimum wage, so we do not publish a figure for them: check with SafeWork SA or your employer.",
    ],
    youngWorkers: [
      "Under-21 and apprentice pay in South Australia follows the national junior percentages or the scales in your modern award, the same as in every national-system state.",
    ],
    regulators: [{ title: "SafeWork SA", publisher: "Government of South Australia", url: "https://www.safework.sa.gov.au/" }],
    sources: [FWO_SYSTEM],
  },
  tas: {
    slug: "tas",
    code: "TAS",
    name: "Tasmania",
    inName: "in Tasmania",
    uniqueAngle: "Tasmanian local government is in the national system",
    systemFwo: "State public sector employees remain under the state system. Local government employees are covered by the national system.",
    systemSummary:
      "Tasmania splits the public sector in two: Tasmanian State Service employees remain in the state system, while local government employees are in the national system. Private-sector employees are in the national system.",
    hasStateWageSetting: false,
    stateWageHeading: "Is there a Tasmanian minimum wage?",
    stateWage: [
      "No separate Tasmanian minimum wage applies to private-sector employees, and Tasmanian local government employees are also in the national system, so the $26.44 National Minimum Wage and modern awards apply to them.",
      "Tasmanian State Service employees remain in the state system. Their pay is set through State Service awards and agreements, which the Tasmanian State Service Industrial Relations unit publishes. We do not publish a state-system figure for them.",
    ],
    youngWorkers: [
      "Junior and apprentice pay for Tasmanian private-sector employees follows the national junior percentages or the scale in the relevant modern award.",
    ],
    regulators: [
      { title: "Tasmanian State Service Industrial Relations", publisher: "Tasmanian Government", url: "https://www.dpac.tas.gov.au/divisions/ssmo/awards_and_agreements/state_service_industrial_relations" },
    ],
    sources: [FWO_SYSTEM],
  },
  qld: {
    slug: "qld",
    code: "QLD",
    name: "Queensland",
    inName: "in Queensland",
    uniqueAngle: "QLD set its own state minimum from 1 September 2026",
    systemFwo: "State public sector and local government employees aren't covered by the national system and remain under the state system.",
    systemSummary:
      "Queensland private-sector employees are in the national system, but state public sector and local government employees remain under the Queensland system, which has its own minimum wage and state awards.",
    hasStateWageSetting: true,
    stateWageHeading: "Queensland minimum wage 2026",
    stateWage: [
      `The Queensland Industrial Relations Commission's State Wage Case ${QLD_STATE_WAGE_CASE_2026.citation} (delivered ${QLD_STATE_WAGE_CASE_2026.deliveredOn}) increased wages in state awards by ${(QLD_STATE_WAGE_CASE_2026.increase * 100).toFixed(2)}%, increased monetary allowances by the same amount, and set the Queensland minimum wage for full-time employees at $${QLD_STATE_WAGE_CASE_2026.qmwWeekly.toFixed(2)} a week, operative from ${QLD_STATE_WAGE_CASE_2026.operativeFrom}.`,
      `That is the same weekly figure as the National Minimum Wage ($${NMW.weekly.toFixed(2)}), but the Queensland minimum applies to employees in the Queensland state system (the Commission estimates about ${QLD_STATE_WAGE_CASE_2026.qldSystemWorkers.toLocaleString("en-AU")} workers, of whom ${QLD_STATE_WAGE_CASE_2026.qldPublicSector.toLocaleString("en-AU")} are in the Queensland public sector, which has ${Math.round(QLD_STATE_WAGE_CASE_2026.qldPublicSectorAgreementCoverage * 100)}% enterprise agreement coverage). The operative date is 1 September 2026, not 1 July, for the state award and Queensland minimum wage increases.`,
      "The Commission noted that employees under 21 who are covered by a Queensland modern award get that award's junior rates rather than the Queensland minimum wage.",
    ],
    youngWorkers: [
      "In the Queensland system, an employee under 21 under a Queensland modern award is paid that award's junior rates, not the Queensland minimum wage (State Wage Case 2026, [81]).",
      "Private-sector juniors are in the national system: the junior percentages of $26.44 apply when no award does.",
    ],
    regulators: [
      { title: "State wage cases", publisher: "Queensland Industrial Relations Commission", url: "https://www.qirc.qld.gov.au/state-wage-cases" },
      { title: "State Wage Case 2026 decision (B/2026/59 and B/2026/60)", publisher: "Queensland Industrial Relations Commission", url: QLD_STATE_WAGE_CASE_2026.url },
      { title: "Queensland Government employment information", publisher: "Queensland Government", url: "https://www.forgov.qld.gov.au/" },
    ],
    sources: [
      FWO_SYSTEM,
      { title: "State Wage Case 2026 reasons for decision [2026] QIRC 280", publisher: "Queensland Industrial Relations Commission", url: QLD_STATE_WAGE_CASE_2026.url },
    ],
  },
  act: {
    slug: "act",
    code: "ACT",
    name: "Australian Capital Territory",
    inName: "in the ACT",
    uniqueAngle: "The ACT is wholly in the national system, with a lower payroll tax threshold from 1 July 2026",
    systemFwo: "Generally, all employees and employers in the Australian Capital Territory and Northern Territory are covered by the national system.",
    systemSummary:
      "Generally all employees and employers in the ACT are in the national system, so there is no state-level minimum wage and no state wage case. The ACT's own rules matter for payroll tax, long service leave and public holidays.",
    hasStateWageSetting: false,
    stateWageHeading: "Is there an ACT minimum wage?",
    stateWage: [
      "No. The Fair Work Ombudsman states that generally all employees and employers in the Australian Capital Territory are covered by the national system, so the $26.44 National Minimum Wage and modern award rates are the only wage floors.",
      "Where the ACT does differ is around the wage: the ACT has its own long service leave scheme, its own public holiday list (including Canberra Day and Reconciliation Day) and a payroll tax threshold that was cut from $2 million to $1.75 million on 1 July 2026.",
    ],
    youngWorkers: [
      "Under-21 and apprentice pay in the ACT follows the national junior percentages or the scale in the modern award for the job.",
    ],
    regulators: [{ title: "Access Canberra", publisher: "ACT Government", url: "https://www.accesscanberra.act.gov.au/" }],
    sources: [FWO_SYSTEM],
  },
  nt: {
    slug: "nt",
    code: "NT",
    name: "Northern Territory",
    inName: "in the Northern Territory",
    uniqueAngle: "The NT is wholly in the national system, with the highest payroll tax threshold",
    systemFwo: "Generally, all employees and employers in the Australian Capital Territory and Northern Territory are covered by the national system.",
    systemSummary:
      "Generally all employees and employers in the Northern Territory are in the national system, so there is no territory minimum wage. The NT's own rules matter for payroll tax, long service leave and a public holiday list with part-day and regional days.",
    hasStateWageSetting: false,
    stateWageHeading: "Is there a Northern Territory minimum wage?",
    stateWage: [
      "No. The Fair Work Ombudsman states that generally all employees and employers in the Northern Territory are covered by the national system, so the $26.44 National Minimum Wage and modern award rates are the wage floors.",
      "The Territory's own rules show up around the wage instead: a long service leave scheme that accrues at a different rate from most states, a public holiday list with part-day holidays and regional show days, and the highest payroll tax threshold of any state or territory.",
    ],
    youngWorkers: [
      "Under-21 and apprentice pay in the NT follows the national junior percentages or the scale in the modern award for the job.",
    ],
    regulators: [{ title: "Northern Territory Government", publisher: "Northern Territory Government", url: "https://nt.gov.au/" }],
    sources: [FWO_SYSTEM],
  },
};

export function isMwStateSlug(v: string): v is MwStateSlug {
  return (MW_STATE_SLUGS as readonly string[]).includes(v);
}

export function getMwState(slug: string): MwStateInfo | undefined {
  return isMwStateSlug(slug) ? MW_STATES[slug] : undefined;
}

// -----------------------------------------------------------------------------
// Public holidays, payroll tax and long service leave, read from the datasets
// -----------------------------------------------------------------------------

export function publicHolidayData(slug: MwStateSlug): StatePublicHolidays {
  const s = STATE_PUBLIC_HOLIDAYS.find((x) => x.slug === slug);
  if (!s) throw new Error(`minimum-wage-state: no public holiday data for ${slug}`);
  return s;
}

/** Whole-day public holidays that fall in the 2026-27 minimum wage year (1 Jul 2026 to 30 Jun 2027). */
export function holidaysInMinimumWageYear(slug: MwStateSlug): PublicHolidayDate[] {
  const s = publicHolidayData(slug);
  const days: PublicHolidayDate[] = [];
  for (const y of [2026, 2027] as const) {
    const year = yearOf(s, y);
    if (!year) continue;
    for (const h of statewideDays(year)) {
      if (h.date >= MW_FY_START && h.date <= MW_FY_END) days.push(h);
    }
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export function payrollData(slug: MwStateSlug) {
  return PAYROLL_TAX_STATES[slug];
}

export function lslData(slug: MwStateSlug) {
  return LSL_JURISDICTIONS[slug];
}

/**
 * Whole full-time adult minimum-wage employees whose WAGES ALONE would reach the
 * state's headline payroll tax threshold. Our arithmetic, labelled as such on
 * the page: it ignores super (which also counts), interstate apportionment,
 * grouping and the phase-outs, so the real figure is lower.
 */
export function minimumWageHeadcountAtThreshold(slug: MwStateSlug): number {
  return Math.ceil(PAYROLL_TAX_STATES[slug].annualThreshold / NMW.annual);
}

/** Employer super on a full-time adult minimum-wage year (12% SG). */
export function employerSuperRate(): number {
  return SUPER_GUARANTEE.rate;
}

// -----------------------------------------------------------------------------
// Copy that feeds the page, metadata and FAQPage together
// -----------------------------------------------------------------------------

const money = (n: number) => `$${n.toFixed(2)}`;
const wholeMoney = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

export function mwStateTitle(s: MwStateInfo): string {
  return fitTitle(
    `Minimum Wage ${s.name} 2026: ${money(NMW.hourly)}/hr, Take-Home & State Rules`,
    `Minimum Wage in ${s.code} 2026: ${money(NMW.hourly)}/hr, Take-Home & State Rules`,
    `${s.code} Minimum Wage 2026: ${money(NMW.hourly)}/hr, Take-Home & Rules`,
  );
}

export function mwStateH1(s: MwStateInfo): string {
  return `Minimum Wage in ${s.name} 2026–27`;
}

export function mwStateDescription(s: MwStateInfo): string {
  const t = fullTimeAdultTakeHome(s.slug);
  const stateBit =
    s.slug === "wa"
      ? `WA state-system minimum ${money(WA_STATE_MINIMUM_WAGE.hourly)}/hr. `
      : s.slug === "qld"
        ? `Queensland minimum ${wholeMoney(QLD_STATE_WAGE_CASE_2026.qmwWeekly)}/wk from 1 Sep 2026. `
        : s.slug === "nsw"
          ? "NSW state awards +4.75%. "
          : "";
  return fitDescription(
    `Minimum wage ${s.inName}: ${money(NMW.hourly)}/hr, ${money(NMW.weekly)}/wk, about ${wholeMoney(t.weeklyNet)}/wk after tax. ${stateBit}State holidays, payroll tax, long service leave and a calculator.`,
    `Minimum wage ${s.inName}: ${money(NMW.hourly)}/hr, about ${wholeMoney(t.weeklyNet)}/wk after tax. ${stateBit}State holidays, payroll tax, long service leave, calculator.`,
    `Minimum wage ${s.inName}: ${money(NMW.hourly)}/hr, about ${wholeMoney(t.weeklyNet)}/wk after tax. State rules and a take-home calculator.`,
  );
}

export interface MwFaq {
  q: string;
  a: string;
}

export function mwStateFaqs(s: MwStateInfo): MwFaq[] {
  const t = fullTimeAdultTakeHome(s.slug);
  const hol = holidaysInMinimumWageYear(s.slug);
  const lsl = lslData(s.slug);
  const pt = payrollData(s.slug);
  const faqs: MwFaq[] = [
    {
      q: `What is the minimum wage ${s.inName}?`,
      a: `${money(NMW.hourly)} an hour, or ${money(NMW.weekly)} for a ${EMPLOYMENT.standardWeeklyHours}-hour week (${wholeMoney(NMW.annual)} a year full-time), from the first full pay period on or after 1 July 2026. ${s.slug === "wa" ? `In the WA state system the State Minimum Wage is ${money(WA_STATE_MINIMUM_WAGE.hourly)} an hour (${money(WA_STATE_MINIMUM_WAGE.weekly)} a week).` : s.slug === "qld" ? `The Queensland minimum wage for the Queensland state system is ${money(QLD_STATE_WAGE_CASE_2026.qmwWeekly)} a week from 1 September 2026.` : `There is no separate ${s.name} minimum wage.`}`,
    },
    {
      q: `How much is the minimum wage ${s.inName} after tax?`,
      a: `A full-time adult on ${wholeMoney(t.annualGross)} a year takes home about ${wholeMoney(t.annualNet)} a year, or ${money(t.weeklyNet)} a week, after income tax and the Medicare levy (resident, tax-free threshold claimed, no HECS debt). Tax is the same in every state, so this figure is the same ${s.inName} as anywhere else.`,
    },
    {
      q: `Is there a state minimum wage ${s.inName} that differs from the national rate?`,
      a: s.systemSummary,
    },
    {
      q: `How many public holidays does ${s.name} have in 2026-27?`,
      a: `${hol.length} whole-day public holidays fall between 1 July 2026 and 30 June 2027 ${s.inName}, according to the state government's own list. A full-time or part-time employee who has the day off is paid their base rate for the hours they would have worked.`,
    },
    {
      q: `When does long service leave start ${s.inName}?`,
      a: `After ${lsl.takeAfterYears} years of continuous service you can take ${lsl.weeksAtQualifying} weeks of leave under the ${lsl.act}; ${lsl.casualsCovered ? "casual employees can qualify" : "check how the Act treats casuals"}. At the minimum wage that is worth about ${wholeMoney(lsl.weeksAtQualifying * NMW.weekly)}.`,
    },
    {
      q: `What is the payroll tax threshold ${s.inName}?`,
      a: `${pt.name} payroll tax starts at ${wholeMoney(pt.annualThreshold)} of annual taxable wages for 2026-27 (${pt.headlineRate} headline rate), set by ${pt.revenueOffice}. On wages alone that is ${minimumWageHeadcountAtThreshold(s.slug)} full-time minimum-wage employees, although super and other wages also count, so a real business reaches it sooner.`,
    },
  ];
  return faqs;
}

export { NMW_SOURCE };
