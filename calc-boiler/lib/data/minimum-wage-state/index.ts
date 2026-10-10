// =============================================================================
// Minimum wage by state and territory (/minimum-wage/{state}/) — F1, Oct 2026.
//
// The National Minimum Wage is one figure for the whole country, so a state
// page earns its place only by carrying what genuinely differs by state:
//   - which workers sit in the STATE industrial system rather than the national
//     one (Fair Work Ombudsman, "Fair Work system", content updated 13 Aug 2026,
//     plus the state's own system page where it publishes one),
//   - any state minimum wage or state wage case (WA, QLD, NSW, and the
//     Tasmanian State Service — read from the tribunals' own pages / decisions),
//   - the state's own child employment rules for under-15s and school-age
//     workers, read from the state government page the Fair Work Ombudsman's
//     "Minimum working age" page links to,
//   - the state's public holidays, payroll tax and long service leave, which are
//     READ FROM the existing verified datasets (lib/data/public-holidays,
//     lib/constants/payroll-tax, lib/constants/long-service-leave) rather than
//     re-keyed, so a refresh of those flows through here.
//
// Nothing here is estimated. A state-system wage figure we could not read from
// the tribunal is left out and the page says so. The national rate, after-tax
// table and junior table are the same in every state, so the state pages give
// them one line and link to /minimum-wage-australia/.
// System coverage and wage cases verified 5 October 2026; coverage lists, child
// employment rules, the WA State Wage order and the Tasmanian State Service
// update read again 10 October 2026 (Firecrawl, official pages, URLs below).
// =============================================================================

import { fitDescription, fitTitle } from "../../seo-title";
import { EMPLOYMENT, SUPER_GUARANTEE } from "../../constants/australian-tax";
import { LSL_JURISDICTIONS } from "../../constants/long-service-leave";
import { NMW, QLD_STATE_WAGE_CASE_2026, WA_STATE_MINIMUM_WAGE } from "../../constants/minimum-wage";
import { PAYROLL_TAX_STATES } from "../../constants/payroll-tax";
import { STATE_PUBLIC_HOLIDAYS, formatHolidayDate, statewideDays, yearOf } from "../public-holidays";
import type { PublicHolidayDate, StatePublicHolidays } from "../public-holidays";

export const MW_STATE_SLUGS = ["nsw", "vic", "wa", "sa", "tas", "qld", "act", "nt"] as const;
import type { MwStateSlug } from "./calc";
export * from "./calc";
import { fullTimeAdultTakeHome } from "./calc";

export const MW_STATE_VERIFIED_ON = "10 October 2026";

/** The 2026-27 minimum wage year: first full pay period from 1 July 2026 to 30 June 2027. */
export const MW_FY_START = "2026-07-01";
export const MW_FY_END = "2027-06-30";

export interface MwSource {
  title: string;
  publisher: string;
  url: string;
}

export interface MwFaq {
  q: string;
  a: string;
}

export interface MwStateInfo {
  slug: MwStateSlug;
  code: string;
  name: string;
  /** "in Victoria", "in the ACT". */
  inName: string;
  /** The state-specific sentence that closes the direct answer. */
  answerNote: string;
  /** Plain-English reading of who is in the state system, from the FWO page. */
  systemSummary: string;
  /** What the FWO page says, quoted closely, for the "who the national wage covers" section. */
  systemFwo: string;
  /** Who is in each system, in the official sources' own categories. */
  coverage: { national: readonly string[]; state: readonly string[] };
  /** True when a worker's minimum can be set by a state tribunal rather than the FWC. */
  hasStateWageSetting: boolean;
  /** Headline for the "state wage" section. */
  stateWageHeading: string;
  /** Paragraphs for the state wage-setting section. */
  stateWage: readonly string[];
  /** Child employment, junior and apprentice rules specific to the state. */
  youngWorkers: readonly string[];
  /** The state's own regulators and information pages (all read on the verification date). */
  regulators: readonly MwSource[];
  /** Where each state-specific figure or rule was read. */
  sources: readonly MwSource[];
  /** The role this state's page plays in the "other states" list and title. */
  uniqueAngle: string;
  /** Questions only this state's page answers (rendered and emitted as FAQPage JSON-LD). */
  faqs: readonly MwFaq[];
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

const money = (n: number) => `$${n.toFixed(2)}`;
const wholeMoney = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const NMW_HOURLY = money(NMW.hourly);

// --- Sources read 10 October 2026 -------------------------------------------
const NSW_STARTING_WORK: MwSource = {
  title: "Starting work: your rights and responsibilities",
  publisher: "NSW Industrial Relations",
  url: "https://www.nsw.gov.au/employment/rights-responsibilities/starting-work",
};
const VIC_CHILD_LICENCE: MwSource = {
  title: "Employing children under 15 years old",
  publisher: "Workforce Inspectorate Victoria",
  url: "https://www.vic.gov.au/child-employment-licence",
};
const WA_WHICH_SYSTEM: MwSource = {
  title: "Which system of employment law applies",
  publisher: "Government of Western Australia (Wageline)",
  url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/which-system-of-employment-law-applies",
};
const WA_CHILDREN: MwSource = {
  title: "When children can work in Western Australia",
  publisher: "Government of Western Australia (Wageline)",
  url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/when-children-can-work-western-australia",
};
const WA_STATE_WAGE_ORDER: MwSource = {
  title: "2026 State Wage order [2026] WAIRC 00400",
  publisher: "WA Industrial Relations Commission",
  url: "https://www.wairc.wa.gov.au/assets/Documents/WageCase/2026/Decisions-Orders/2026-State-Wage-order-2026-WAIRC-00400-LS-Copy.pdf",
};
const SA_IR_SYSTEM: MwSource = {
  title: "Industrial relations: private sector, public sector and local government",
  publisher: "SafeWork SA",
  url: "https://safework.sa.gov.au/workers/wages-and-conditions/industrial-relations",
};
const SAET_SWC_2026_NOTICE: MwSource = {
  title: "State Wage Case 2026 notice (ET-26-02424), 22 June 2026",
  publisher: "South Australian Employment Tribunal",
  url: "https://www.saet.sa.gov.au/app/uploads/2026/07/StateWageCase2026Notice.pdf",
};
const SA_MIN_AGE: MwSource = {
  title: "Minimum working age",
  publisher: "SafeWork SA",
  url: "https://safework.sa.gov.au/workers/wages-and-conditions/minimum-working-age",
};
const TAS_SSMO_UPDATE: MwSource = {
  title: "Wages and conditions update for State Service agreements",
  publisher: "Tasmanian Department of Premier and Cabinet",
  url: "https://www.dpac.tas.gov.au/working-in-the-state-service/messages-from-the-head-of-the-state-service/wages-and-conditions-update-for-state-service-agreements",
};
const TAS_TIC_WAGE_CASES: MwSource = {
  title: "State wage cases",
  publisher: "Tasmanian Industrial Commission",
  url: "https://www.tic.tas.gov.au/decisions_issued/decision_summaries/state_wage_cases",
};
const QLD_CHILD_RULES: MwSource = {
  title: "Restrictions on children working in Queensland",
  publisher: "Business Queensland",
  url: "https://www.business.qld.gov.au/running-business/employing/hiring-recruitment/employing-children/restrictions",
};
const ACT_YOUNG_WORKER: MwSource = {
  title: "Your rights as a young worker",
  publisher: "ACT Government",
  url: "https://www.act.gov.au/community/youth/your-rights-as-a-young-worker",
};
const NT_WAGES: MwSource = {
  title: "Wages and conditions of employment",
  publisher: "Northern Territory Government",
  url: "https://nt.gov.au/employ/for-employees-in-nt/your-rights,-health-and-safety/wages-and-conditions-of-employment",
};

const WA_APPRENTICE_ADULT = 828.9;
/** 2026 State Wage order cl 5(b): award-free apprentices, four-year term, by reference to the Manufacturing, Maintenance and Metal Trades Award. */
const WA_APPRENTICE_FOUR_YEAR = [464.2, 607.9, 828.9, 972.6] as const;
/** Tasmanian Industrial Commission state wage cases page: latest Tasmanian minimum wage decision listed (T14984 of 2022). */
const TAS_LAST_MINIMUM = { weekly: 812.6, decided: "22 December 2022", operative: "1 August 2022" } as const;

export const MW_STATES: Readonly<Record<MwStateSlug, MwStateInfo>> = {
  nsw: {
    slug: "nsw",
    code: "NSW",
    name: "New South Wales",
    inName: "in New South Wales",
    uniqueAngle: "NSW state awards rose 4.75% in the 2026 State Wage Case",
    answerNote: "NSW has no separate minimum wage, but NSW state awards for public sector and council work rose 4.75% in the 2026 State Wage Case.",
    systemFwo: "State public sector and local government employees aren't covered by the national system and remain under the state system.",
    systemSummary:
      "Almost every private-sector employee in NSW is in the national system, so the National Minimum Wage and modern awards apply. NSW state public sector and local government employees are the main group left in the state system.",
    coverage: {
      national: ["Private-sector employers and their employees"],
      state: ["NSW state public sector employees", "NSW local government (council) employees"],
    },
    hasStateWageSetting: true,
    stateWageHeading: "NSW state awards: the 2026 State Wage Case",
    stateWage: [
      "NSW has no minimum wage of its own that differs from the national one for private-sector employees. What NSW does have is a state Industrial Relations Commission that sets rates in NSW state awards, which cover state public sector and local government work and a handful of industries.",
      "In the State Wage Case 2026 ([2026] NSWIRComm 16, 25 August 2026) the Full Bench of the Industrial Relations Commission of NSW adopted the Fair Work Commission's 4.75% increase and applied it to the minimum rates in several state awards, including the Kindergartens and Child Care Centres (State) Award, the Health, Fitness and Indoor Sports Centres (State) Award and the Transport Industry (State) Award from the first full pay period on or after 1 July 2026. Some awards, including the Local Government, Aged, Disability and Home Care (State) Award and the Live Theatre and Concert (State) Award, move from the first full pay period on or after 1 September 2026.",
      "If your pay is set by a NSW state award, read the award itself on the Industrial Relations Commission site for the exact classification rate. The 4.75% figure is the size of the increase, not a new rate.",
    ],
    youngWorkers: [
      "NSW sets no minimum age for starting work. NSW Industrial Relations notes that many teenagers take a part-time or casual job while still at school, and the limit is schooling itself: compulsory schooling for children under 17 is set by the Education Act 1990 (NSW), so shifts have to fit around school attendance.",
      "The Office of the Children's Guardian regulates the working hours of employees under 16 only in specific areas, namely still photography, modelling, promotional work, performance art and public speaking, under the Children's Guardian Act 2019. It does not cover an under-16 working in retail or hospitality, whose pay comes from the national junior percentages or their award's junior scale.",
      "Where a NSW state award applies, its own junior and apprentice provisions govern, not the national table.",
    ],
    regulators: [
      { title: "NSW Industrial Relations (131 628)", publisher: "NSW Government", url: "https://www.nsw.gov.au/departments-and-agencies/premiers-department/nsw-industrial-relations" },
      { title: "State Wage Case 2026", publisher: "Industrial Relations Commission of NSW", url: "https://irc.nsw.gov.au/content/dcj/ctsd/irc/irc/major-cases-and-decisions/state-wage-case-2026.html" },
    ],
    sources: [
      FWO_SYSTEM,
      { title: "State Wage Case 2026 [2026] NSWIRComm 16", publisher: "Industrial Relations Commission of NSW", url: "https://www.caselaw.nsw.gov.au/decision/1a032a13e159214c92ded7b4" },
      NSW_STARTING_WORK,
    ],
    faqs: [
      {
        q: "Is there a minimum age to start work in NSW?",
        a: "No. NSW Industrial Relations states there is no minimum legal age for starting work in NSW. Work has to fit around compulsory schooling, which applies to children under 17 under the Education Act 1990 (NSW), and the Office of the Children's Guardian regulates the hours of under-16s only in modelling, still photography, promotional work, performance art and public speaking.",
      },
      {
        q: "Did NSW state award wages go up in 2026?",
        a: "Yes, by 4.75%. In the State Wage Case 2026 ([2026] NSWIRComm 16, 25 August 2026) the Industrial Relations Commission of NSW applied the Fair Work Commission's 4.75% increase to minimum rates in several state awards, from the first full pay period on or after 1 July 2026 for most and 1 September 2026 for some, including the Local Government, Aged, Disability and Home Care (State) Award.",
      },
      {
        q: "Are NSW public servants and council workers paid under the national minimum wage?",
        a: "No. The Fair Work Ombudsman states that NSW state public sector and local government employees are not covered by the national system and remain under the state system, so their pay comes from NSW state awards and agreements set through the Industrial Relations Commission of NSW.",
      },
    ],
  },
  vic: {
    slug: "vic",
    code: "VIC",
    name: "Victoria",
    inName: "in Victoria",
    uniqueAngle: "Victoria is almost entirely in the national system and licenses employers of under-15s",
    answerNote: "There is no separate Victorian minimum wage: almost every Victorian employee, including most state government staff, is in the national system.",
    systemFwo: "Most employees in Victoria are covered by the national system. This includes state government employees with some exceptions such as senior public servants.",
    systemSummary:
      "Victoria is the clearest case of a single national wage: most Victorian employees, including state government employees apart from exceptions such as senior public servants, are in the national system. There is no Victorian state minimum wage.",
    coverage: {
      national: ["Private-sector employers and their employees", "Most Victorian state government employees"],
      state: ["Some exceptions, such as senior public servants"],
    },
    hasStateWageSetting: false,
    stateWageHeading: "Is there a Victorian minimum wage?",
    stateWage: [
      `No. Victoria referred its industrial relations powers to the Commonwealth, so the Fair Work Commission sets the minimum wage and award rates for almost everyone who works in the state. A Melbourne cafe, a Geelong factory and a Victorian state government department all start from the same ${NMW_HOURLY} floor.`,
      "What Victoria does regulate itself, through the Workforce Inspectorate Victoria (called the Wage Inspectorate Victoria until 12 December 2025), is long service leave, the employment of children under 15 through child employment licences, and owner-driver and forestry contractor laws. Those are the Victorian rules that sit around a minimum-wage job.",
    ],
    youngWorkers: [
      "Victoria licenses the employment of children under 15. An employer usually needs a child employment licence from the Workforce Inspectorate Victoria before employing anyone under 15, whether the work is paid or voluntary. Licences are free, last up to 2 years and can cover several children, and employing a child without one is a crime.",
      "A child must be 11 to deliver newspapers and advertising material, and 13 for other work such as retail or hospitality. Children usually work only between 6am and 9pm and never in school hours: at most 3 hours a day and 12 hours a week during term, or 6 hours a day and 30 hours a week in school holidays, with a 30-minute break after every 3 hours. A supervisor must be 18 or over and hold a Victorian Working with Children Clearance.",
      "From 15, pay follows the national junior percentages or your award's junior scale. Apprentice wages are set by the award or agreement that covers the trade, not by Victoria.",
    ],
    regulators: [
      { title: "Workforce Inspectorate Victoria (1800 287 287)", publisher: "Victorian Government", url: "https://www.vic.gov.au/workforce-inspectorate-victoria" },
      { title: "Business Victoria", publisher: "Victorian Government", url: "https://business.vic.gov.au/" },
    ],
    sources: [FWO_SYSTEM, VIC_CHILD_LICENCE],
    faqs: [
      {
        q: "At what age can you start work in Victoria?",
        a: "At 11 to deliver newspapers and advertising material, and at 13 for other work such as retail or hospitality, according to the Workforce Inspectorate Victoria. An employer usually needs a free child employment licence to employ anyone under 15, paid or voluntary.",
      },
      {
        q: "How many hours can a 14-year-old work in Victoria?",
        a: "During school term, at most 3 hours a day and 12 hours a week, usually between 6am and 9pm and never during school hours. In school holidays the limit is 6 hours a day and 30 hours a week. A 30-minute rest break is due after every 3 hours, with at least 12 hours between shifts.",
      },
      {
        q: "Are Victorian state government employees in the national system?",
        a: "Mostly, yes. The Fair Work Ombudsman states that most Victorian employees are covered by the national system, including state government employees, with some exceptions such as senior public servants. That sets Victoria apart from NSW, Queensland, South Australia, Western Australia and Tasmania, whose state public servants stay in the state system.",
      },
    ],
  },
  wa: {
    slug: "wa",
    code: "WA",
    name: "Western Australia",
    inName: "in Western Australia",
    uniqueAngle: "WA is the only state with its own State Minimum Wage for private-sector workers",
    answerNote: `Employees of sole traders, unincorporated partnerships and other non-company employers in the WA state system have their own State Minimum Wage of ${money(WA_STATE_MINIMUM_WAGE.hourly)} an hour (${money(WA_STATE_MINIMUM_WAGE.weekly)} a week).`,
    systemFwo: "All Western Australian State public sector employers are covered by the state industrial relations system. Sole traders, partnerships, other unincorporated entities and non-trading corporations are also covered by the state system.",
    systemSummary:
      "Western Australia is the one state where a private-sector employee's minimum wage can differ, because WA runs two systems side by side and which one covers you depends on your employer's legal structure, not where you live. Unincorporated businesses, household employers, some not-for-profits, every WA local government and most state public sector agencies are in the WA state system. Pty Ltd companies are in the national system.",
    coverage: {
      national: [
        "Pty Ltd businesses that are trading or financial corporations",
        "Partnerships with a Pty Ltd partner, and trusts with a Pty Ltd trustee",
        "Not-for-profits with substantial trading or financial activities",
        "Foreign corporations, and all federal public sector agencies",
      ],
      state: [
        "Sole traders, and unincorporated partnerships",
        "Unincorporated trusts where no trustee is a Pty Ltd entity",
        "Household employers who hire someone for domestic work in a private home",
        "Incorporated associations and not-for-profits that are not trading or financial corporations, such as some sporting clubs and school P&Cs",
        "All WA local governments (since 1 January 2023)",
        "Most WA state public sector agencies",
      ],
    },
    hasStateWageSetting: true,
    stateWageHeading: "WA State Minimum Wage 2026",
    stateWage: [
      `The Western Australian Industrial Relations Commission raised the State Minimum Wage by ${(WA_STATE_MINIMUM_WAGE.increase * 100).toFixed(2)}% to $${WA_STATE_MINIMUM_WAGE.weekly.toFixed(2)} a week from ${WA_STATE_MINIMUM_WAGE.operativeFrom} (2026 State Wage Case, [2026] WAIRC 00381). It also increased award rates of pay by 4.75% from that time. The increases apply only to employees who are paid the minimum wage or award rates in the WA state system, which the Commission estimates covers about 27,000 employers and more than 300,000 employees.`,
      `The State Minimum Wage works out at $${WA_STATE_MINIMUM_WAGE.hourly.toFixed(2)} an hour for adults, which is $${(NMW.hourly - WA_STATE_MINIMUM_WAGE.hourly).toFixed(2)} an hour below the National Minimum Wage of $${NMW.hourly.toFixed(2)}. Which one applies depends on whether the employer is in the state or national system, not on where you live. A WA employee of a company is in the national system and gets at least $${NMW.hourly.toFixed(2)}.`,
      `The 2026 State Wage order ([2026] WAIRC 00400) fixes the $${WA_STATE_MINIMUM_WAGE.weekly.toFixed(2)} under section 12 of the Minimum Conditions of Employment Act 1993 for employees aged 21 or over who are not apprentices, and sets ${money(WA_APPRENTICE_ADULT)} a week for apprentices aged 21 or over. An apprentice with no award is paid by reference to the Manufacturing, Maintenance and Metal Trades Award: on a four-year term, ${WA_APPRENTICE_FOUR_YEAR.map(money).join(", ").replace(/, ([^,]*)$/, " and $1")} a week from first to fourth year.`,
      "Every WA local government has been in the state system since 1 January 2023, under a state declaration the federal Minister endorsed. Council pay comes from industrial agreements or the two main local government state awards, the Local Government Officers (Western Australia) Award and the Municipal Employees (Western Australia) Award, and long service leave for most council staff from the Local Government (Long Service Leave) Regulations 2024.",
      "To check your system, find the employer's legal entity name on your payslip or contract, which can differ from the trading name. Wageline's example: you work at the Perth Café, but Café Pty Ltd employs you, so you are in the national system. Search the name on the ABN Lookup, or ask Wageline (1300 655 266) at the Department of Local Government, Industry Regulation and Safety. A business that changes from a sole trader to a company may move systems.",
    ],
    youngWorkers: [
      "WA's child employment law, the Children and Community Services Act 2004, covers under-15s working for WA businesses in both the state and national systems, including unpaid 'volunteer' work. Children aged 10 to 12 may only deliver newspapers, pamphlets or advertising material, outside school hours, between 6am and 7pm, accompanied by a parent or an adult with a parent's written permission.",
      "At 13 and 14 a child may also work in a shop, fast food outlet, cafe or restaurant, or collect shopping trolleys, with a parent's written permission, outside school hours and not before 6am or after 10pm. A child of any age may work in a family business or perform as an actor, musician or entertainer if it does not stop them attending school. Fines reach $24,000, or $120,000 for an incorporated employer.",
      `The State Minimum Wage is the adult rate. In the state system an under-21 covered by a WA award gets the award's junior percentage of the $${WA_STATE_MINIMUM_WAGE.weekly.toFixed(2)} minimum adult award wage (2026 State Wage order). A WA employee of a company is on the national junior percentages of ${NMW_HOURLY} or their award's junior scale.`,
    ],
    regulators: [
      { title: "WA Private Sector Labour Relations (Wageline, 1300 655 266)", publisher: "Government of Western Australia", url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/private-sector-labour-relations" },
      { title: "Which system of employment law applies", publisher: "Government of Western Australia", url: WA_WHICH_SYSTEM.url },
      { title: "The 2026 State Wage Case", publisher: "WA Industrial Relations Commission", url: "https://www.wairc.wa.gov.au/state-wage-case/wage-case-5" },
    ],
    sources: [
      FWO_SYSTEM,
      { title: "The 2026 State Wage Case", publisher: "WA Industrial Relations Commission", url: "https://www.wairc.wa.gov.au/state-wage-case/wage-case-5" },
      WA_STATE_WAGE_ORDER,
      { title: "WA award and minimum rates of pay to increase from 1 July 2026", publisher: "Government of Western Australia", url: WA_STATE_MINIMUM_WAGE.url },
      WA_WHICH_SYSTEM,
      WA_CHILDREN,
    ],
    faqs: [
      {
        q: "Am I in the WA state system or the national system?",
        a: "It depends on your employer's legal structure. Sole traders, unincorporated partnerships and trusts with no Pty Ltd trustee, household employers, not-for-profits that are not trading or financial corporations, every WA local government and most state public sector agencies are in the WA state system. A Pty Ltd company, or a partnership or trust with a Pty Ltd partner or trustee, is in the national system. Wageline (1300 655 266) can check.",
      },
      {
        q: "What is the minimum wage for an apprentice in the WA state system?",
        a: `${money(WA_APPRENTICE_ADULT)} a week for apprentices aged 21 or over. Younger apprentices get their WA award's rate or, with no award, the Manufacturing, Maintenance and Metal Trades Award rate: ${money(WA_APPRENTICE_FOUR_YEAR[0])} a week in the first year of a four-year apprenticeship, rising to ${money(WA_APPRENTICE_FOUR_YEAR[3])} in the fourth (2026 State Wage order, [2026] WAIRC 00400).`,
      },
      {
        q: "At what age can a child work in WA?",
        a: "From 10 to deliver newspapers, pamphlets or advertising material, and from 13 in shops, fast food outlets, cafes and restaurants with a parent's written permission, outside school hours and between 6am and 10pm. A child of any age can work in a family business or perform as an entertainer if it does not stop them attending school.",
      },
    ],
  },
  sa: {
    slug: "sa",
    code: "SA",
    name: "South Australia",
    inName: "in South Australia",
    uniqueAngle: "SA has no minimum working age, and its public sector and councils stay in the state system",
    answerNote: "There is no separate South Australian minimum wage for private-sector work; SA public sector and council employees have their own state safety net, the minimum standard of remuneration, reviewed each year by the SA Employment Tribunal.",
    systemFwo: "State public sector and local government employees aren't covered by the national system and remain under the state system.",
    systemSummary:
      "SafeWork SA states that all South Australian private-sector businesses, including the non-government community services sector, private schools and universities, are in the national system, so the National Minimum Wage and modern awards apply. The SA public sector, including almost all Government Business Enterprises, and SA local government are in the state system.",
    coverage: {
      national: ["All private-sector businesses", "Non-government community services organisations", "Private schools and universities"],
      state: ["SA public sector employees", "Almost all Government Business Enterprises", "SA local government employees"],
    },
    hasStateWageSetting: true,
    stateWageHeading: "South Australia's state safety net: the minimum standard of remuneration",
    stateWage: [
      `No separate South Australian minimum wage applies to private-sector employees. South Australia referred its private-sector industrial relations powers to the Commonwealth, so the Fair Work Commission's ${NMW_HOURLY} floor and its modern awards apply, and SafeWork SA sends private-sector pay claims to the Fair Work Ombudsman (13 13 94).`,
      "The state system has its own floor. Under section 100A of the Fair Work Act 1994 (SA), a Full Bench of the South Australian Employment Tribunal must review each year the minimum standard of remuneration (section 69), the minimum wage rates in state awards and their work-related allowances and loadings. SafeWork SA says this State Wage Case safety net cannot be overridden by an award or agreement, and that most state-system staff have their pay set by enterprise agreements or state awards.",
      `For 2026 the Tribunal gave notice on 22 June 2026 (ET-26-02424) that, unless someone objected by 14 July 2026, it could adopt the Fair Work Commission's outcome: a minimum standard of remuneration of $1,004.90 a week (${NMW_HOURLY} an hour) and a 4.75% rise in state award wages, allowances and loadings. We have not read the final declaration, so treat those figures as the proposal. Anyone unsure whether a state award or agreement covers them can ring the SafeWork SA Help Centre on 1300 365 255.`,
    ],
    youngWorkers: [
      "South Australia has no minimum working age, so a child of any age may do paid work. SafeWork SA's own example is a newsagent employing a 12-year-old to deliver newspapers before school. Some businesses set their own minimum age, and liquor licensing and mining laws restrict some duties for younger workers.",
      "The limit is schooling: a child of compulsory school age (6 to 16) cannot be employed during the hours they must attend school or an approved learning program, or at times, such as late at night or early in the morning, likely to leave them unfit for school (Education and Children's Services Act 2019, s 74). Students aged 15 and 16 can apply for a permanent exemption from school for employment.",
      "Under-21 and apprentice pay in South Australia follows the national junior percentages or the scales in your modern award, the same as in every national-system state.",
    ],
    regulators: [
      { title: "SafeWork SA Help Centre (1300 365 255)", publisher: "Government of South Australia", url: "https://www.safework.sa.gov.au/" },
      { title: "Current notices, including the State Wage Case", publisher: "South Australian Employment Tribunal", url: "https://www.saet.sa.gov.au/resources/current-notices-2/" },
    ],
    sources: [FWO_SYSTEM, SA_IR_SYSTEM, SAET_SWC_2026_NOTICE, SA_MIN_AGE],
    faqs: [
      {
        q: "Is there a minimum working age in South Australia?",
        a: "No. SafeWork SA states there is no minimum working age in South Australia, so a child of any age may do paid work. A child of compulsory school age (6 to 16) cannot work during the hours they must attend school, or at times likely to leave them unfit for school, and students aged 15 and 16 can apply for a permanent exemption from school for employment.",
      },
      {
        q: "Is there a state minimum wage for South Australian public sector and council workers?",
        a: `Yes, within the state system: the minimum standard of remuneration under section 69 of the Fair Work Act 1994 (SA), which the South Australian Employment Tribunal reviews every year. Its 22 June 2026 notice proposed adopting the national $1,004.90 a week (${NMW_HOURLY} an hour) and a 4.75% rise in state award wages if no objection was lodged by 14 July 2026.`,
      },
      {
        q: "Who handles minimum wage complaints in South Australia?",
        a: "For private-sector jobs, the Fair Work Ombudsman on 13 13 94: SafeWork SA states that every South Australian private-sector business is in the national system. SafeWork SA takes pay claims from the state system, which covers the SA public sector, almost all Government Business Enterprises and local government.",
      },
    ],
  },
  tas: {
    slug: "tas",
    code: "TAS",
    name: "Tasmania",
    inName: "in Tasmania",
    uniqueAngle: "Tasmanian councils are in the national system, State Service staff are not",
    answerNote: "There is no separate Tasmanian minimum wage for private-sector or council work; Tasmanian State Service pay is set by state awards and agreements.",
    systemFwo: "State public sector employees remain under the state system. Local government employees are covered by the national system.",
    systemSummary:
      "Tasmania splits the public sector in two: Tasmanian State Service employees remain in the state system, while local government employees are in the national system. Private-sector employees are in the national system.",
    coverage: {
      national: ["Private-sector employers and their employees", "Tasmanian local government (council) employees"],
      state: ["Tasmanian State Service employees"],
    },
    hasStateWageSetting: true,
    stateWageHeading: "Tasmanian State Service pay and the Tasmanian minimum wage",
    stateWage: [
      `No separate Tasmanian minimum wage applies to private-sector employees, and Tasmanian local government employees are also in the national system, so the ${NMW_HOURLY} National Minimum Wage and modern awards apply to them.`,
      "Tasmanian State Service pay comes from State Service awards and from agreements registered with the Tasmanian Industrial Commission. The Head of the State Service reported in 2026 that agencies had begun adjusting salaries, with back pay to the first full pay in December 2025, under seven State Service agreements including the Public Sector Unions Wages Agreement and the Allied Health Professionals Public Sector Unions Wages Agreement. Most State Service awards were also varied to add reproductive leave, pregnancy loss leave and a right to disconnect, after a Commission hearing on 1 June 2026.",
      `The Commission also determines a Tasmanian minimum wage for public sector awards (s 47AB). Its state wage case page lists the most recent decision as ${TAS_LAST_MINIMUM.decided}: ${money(TAS_LAST_MINIMUM.weekly)} a week from ${TAS_LAST_MINIMUM.operative}. We have not found a later decision, so we do not quote a current Tasmanian state-system minimum.`,
    ],
    youngWorkers: [
      "Junior and apprentice pay for Tasmanian private-sector employees follows the national junior percentages or the scale in the relevant modern award.",
      "Because Tasmanian councils are national-system employers, a junior or apprentice working for a council is also paid under national rules: the junior or apprentice scale in the award or agreement that covers the job.",
    ],
    regulators: [
      { title: "Wages and conditions update for State Service agreements", publisher: "Tasmanian Department of Premier and Cabinet", url: TAS_SSMO_UPDATE.url },
      { title: "State wage cases", publisher: "Tasmanian Industrial Commission", url: TAS_TIC_WAGE_CASES.url },
    ],
    sources: [FWO_SYSTEM, TAS_SSMO_UPDATE, TAS_TIC_WAGE_CASES],
    faqs: [
      {
        q: "Are Tasmanian council workers in the state or national system?",
        a: "The national system. The Fair Work Ombudsman states that Tasmanian local government employees are covered by the national system, while State Service employees remain in the state system. In NSW, Queensland, South Australia and Western Australia councils are in the state system instead.",
      },
      {
        q: "Does the Tasmanian Industrial Commission set a state minimum wage?",
        a: `For public sector awards, yes (s 47AB). Its state wage case page lists the latest decision as ${TAS_LAST_MINIMUM.decided}, setting ${money(TAS_LAST_MINIMUM.weekly)} a week from ${TAS_LAST_MINIMUM.operative}. Private-sector and council employees in Tasmania get the National Minimum Wage of ${NMW_HOURLY} an hour instead.`,
      },
    ],
  },
  qld: {
    slug: "qld",
    code: "QLD",
    name: "Queensland",
    inName: "in Queensland",
    uniqueAngle: "QLD set its own state minimum from 1 September 2026",
    answerNote: `Queensland state-system employees have a Queensland minimum wage of ${money(QLD_STATE_WAGE_CASE_2026.qmwWeekly)} a week from ${QLD_STATE_WAGE_CASE_2026.operativeFrom}.`,
    systemFwo: "State public sector and local government employees aren't covered by the national system and remain under the state system.",
    systemSummary:
      "Queensland private-sector employees are in the national system, but state public sector and local government employees remain under the Queensland system, which has its own minimum wage and state awards.",
    coverage: {
      national: ["Private-sector employers and their employees"],
      state: ["Queensland public sector employees", "Queensland local government employees"],
    },
    hasStateWageSetting: true,
    stateWageHeading: "Queensland minimum wage 2026",
    stateWage: [
      `The Queensland Industrial Relations Commission's State Wage Case ${QLD_STATE_WAGE_CASE_2026.citation} (delivered ${QLD_STATE_WAGE_CASE_2026.deliveredOn}) increased wages in state awards by ${(QLD_STATE_WAGE_CASE_2026.increase * 100).toFixed(2)}%, increased monetary allowances by the same amount, and set the Queensland minimum wage for full-time employees at $${QLD_STATE_WAGE_CASE_2026.qmwWeekly.toFixed(2)} a week, operative from ${QLD_STATE_WAGE_CASE_2026.operativeFrom}.`,
      `That is the same weekly figure as the National Minimum Wage ($${NMW.weekly.toFixed(2)}), but the Queensland minimum applies to employees in the Queensland state system (the Commission estimates about ${QLD_STATE_WAGE_CASE_2026.qldSystemWorkers.toLocaleString("en-AU")} workers, of whom ${QLD_STATE_WAGE_CASE_2026.qldPublicSector.toLocaleString("en-AU")} are in the Queensland public sector, which has ${Math.round(QLD_STATE_WAGE_CASE_2026.qldPublicSectorAgreementCoverage * 100)}% enterprise agreement coverage). The operative date is 1 September 2026, not 1 July, for the state award and Queensland minimum wage increases.`,
      "The Commission noted that employees under 21 who are covered by a Queensland modern award get that award's junior rates rather than the Queensland minimum wage.",
      "Some Queensland law reaches national-system workplaces too. The Queensland Government states that its legislation on private employment agents, trading hours, public holidays and child employment continues to apply to all businesses and employees in Queensland.",
    ],
    youngWorkers: [
      "The Child Employment Act 2006 sets a general minimum working age of 13 in Queensland, lowered to 11 for supervised delivery of newspapers or advertising material between 6am and 6pm. A school-aged child can work at most 4 hours on a school day and 12 hours in a school week, or 8 hours a day and 38 hours in a non-school week, never between 10pm and 6am, with a one-hour break after the fourth hour unless an award provides otherwise.",
      `In the Queensland state system, an employee under 21 under a Queensland modern award is paid that award's junior rates, not the Queensland minimum wage (State Wage Case 2026, [81]). Private-sector juniors are in the national system: the junior percentages of ${NMW_HOURLY} apply when no award does.`,
    ],
    regulators: [
      { title: "State wage cases", publisher: "Queensland Industrial Relations Commission", url: "https://www.qirc.qld.gov.au/state-wage-cases" },
      { title: "State Wage Case 2026 decision (B/2026/59 and B/2026/60)", publisher: "Queensland Industrial Relations Commission", url: QLD_STATE_WAGE_CASE_2026.url },
      { title: "Queensland Government employment information", publisher: "Queensland Government", url: "https://www.forgov.qld.gov.au/" },
    ],
    sources: [
      FWO_SYSTEM,
      { title: "State Wage Case 2026 reasons for decision [2026] QIRC 280", publisher: "Queensland Industrial Relations Commission", url: QLD_STATE_WAGE_CASE_2026.url },
      QLD_CHILD_RULES,
    ],
    faqs: [
      {
        q: "How old do you have to be to work in Queensland?",
        a: "Generally 13. Children from 11 can do supervised delivery of newspapers or advertising material between 6am and 6pm. Under the Child Employment Act 2006 a school-aged child can work at most 4 hours on a school day and 12 hours in a school week, and no child can work between 10pm and 6am.",
      },
      {
        q: "Who is in the Queensland state industrial relations system?",
        a: `State public sector and local government employees. The Queensland Industrial Relations Commission estimates about ${QLD_STATE_WAGE_CASE_2026.qldSystemWorkers.toLocaleString("en-AU")} workers are in the Queensland system, ${QLD_STATE_WAGE_CASE_2026.qldPublicSector.toLocaleString("en-AU")} of them in the Queensland public sector, where ${Math.round(QLD_STATE_WAGE_CASE_2026.qldPublicSectorAgreementCoverage * 100)}% are covered by enterprise agreements. Private-sector employees are in the national system.`,
      },
    ],
  },
  act: {
    slug: "act",
    code: "ACT",
    name: "Australian Capital Territory",
    inName: "in the ACT",
    uniqueAngle: "The ACT is wholly in the national system and caps children at 10 hours of light work a week",
    answerNote: "There is no ACT minimum wage: generally every employee and employer in the ACT is in the national system.",
    systemFwo: "Generally, all employees and employers in the Australian Capital Territory and Northern Territory are covered by the national system.",
    systemSummary:
      "Generally all employees and employers in the ACT are in the national system, so there is no state-level minimum wage and no state wage case. The ACT's own rules matter for young workers, payroll tax, long service leave and public holidays.",
    coverage: {
      national: ["Generally all employees and employers in the ACT"],
      state: [],
    },
    hasStateWageSetting: false,
    stateWageHeading: "Is there an ACT minimum wage?",
    stateWage: [
      `No. The Fair Work Ombudsman states that generally all employees and employers in the Australian Capital Territory are covered by the national system, so the ${NMW_HOURLY} National Minimum Wage and modern award rates are the only wage floors.`,
      "Where the ACT does differ is around the wage: the ACT has its own long service leave scheme, its own public holiday list (including Canberra Day and Reconciliation Day) and a payroll tax threshold that was cut from $2 million to $1.75 million on 1 July 2026.",
    ],
    youngWorkers: [
      "The ACT Government's guidance for young workers sets the limits: the work must be light work, can total up to 10 hours a week, cannot be during school hours, and needs a parent's agreement, given in writing for a child under 15. The same rules apply to volunteering or helping in a family business without pay.",
      "Supervision depends on age. Children under 12 must be supervised by a parent or a responsible adult the parent approves, including for letterbox delivery and door-to-door or charity work, and 12 to 14-year-olds must be supervised by a responsible adult.",
      "Under-21 and apprentice pay in the ACT follows the national junior percentages or the scale in the modern award for the job.",
    ],
    regulators: [
      { title: "Access Canberra", publisher: "ACT Government", url: "https://www.accesscanberra.act.gov.au/" },
      { title: "Your rights as a young worker", publisher: "ACT Government", url: ACT_YOUNG_WORKER.url },
    ],
    sources: [FWO_SYSTEM, ACT_YOUNG_WORKER],
    faqs: [
      {
        q: "How many hours can a child work in the ACT?",
        a: "Up to 10 hours a week, according to the ACT Government's young worker guidance. The work must be light work, cannot be during school hours and needs a parent's agreement, in writing for a child under 15. Children under 12 must be supervised by a parent or a responsible adult the parent approves.",
      },
      {
        q: "Do ACT Government employees get the national minimum wage protections?",
        a: "Yes. The Fair Work Ombudsman states that generally all employees and employers in the ACT are covered by the national system, so the National Minimum Wage and Fair Work rules set the floor for ACT public servants as well as private-sector staff.",
      },
    ],
  },
  nt: {
    slug: "nt",
    code: "NT",
    name: "Northern Territory",
    inName: "in the Northern Territory",
    uniqueAngle: "The NT is wholly in the national system, with the highest payroll tax threshold",
    answerNote: "There is no Northern Territory minimum wage: generally every NT employee and employer is in the national system.",
    systemFwo: "Generally, all employees and employers in the Australian Capital Territory and Northern Territory are covered by the national system.",
    systemSummary:
      "Generally all employees and employers in the Northern Territory are in the national system, so there is no territory minimum wage. The NT's own rules matter for payroll tax, long service leave and a public holiday list with part-day and regional days.",
    coverage: {
      national: ["Generally all employees and employers in the NT"],
      state: [],
    },
    hasStateWageSetting: false,
    stateWageHeading: "Is there a Northern Territory minimum wage?",
    stateWage: [
      `No. The Fair Work Ombudsman states that generally all employees and employers in the Northern Territory are covered by the national system, so the ${NMW_HOURLY} National Minimum Wage and modern award rates are the wage floors.`,
      "The NT Government's own wages page says the same thing from the Territory's side: private-sector minimum pay and conditions are set under Commonwealth law, so it sends workers to the Fair Work Ombudsman for pay, leave, awards and agreements, and sends NT public servants to the Office of the Commissioner for Public Employment.",
      "The Territory's own rules show up around the wage instead: a long service leave scheme that accrues at a different rate from most states, a public holiday list with part-day holidays and regional show days, and the highest payroll tax threshold of any state or territory.",
    ],
    youngWorkers: [
      "Under-21 and apprentice pay in the NT follows the national junior percentages or the scale in the modern award for the job.",
    ],
    regulators: [
      { title: "Wages and conditions of employment", publisher: "Northern Territory Government", url: NT_WAGES.url },
      { title: "Office of the Commissioner for Public Employment", publisher: "Northern Territory Government", url: "http://www.ocpe.nt.gov.au/" },
    ],
    sources: [FWO_SYSTEM, NT_WAGES],
    faqs: [
      {
        q: "Where do NT public servants check their pay and conditions?",
        a: "With the Office of the Commissioner for Public Employment, which the NT Government's wages and conditions page directs public servants to. Private-sector workers in the NT are under Commonwealth law and go to the Fair Work Ombudsman for pay, leave and award questions.",
      },
      {
        q: "Does the Northern Territory have its own minimum wage?",
        a: `No. The Fair Work Ombudsman states that generally all employees and employers in the Northern Territory are covered by the national system, so the ${NMW_HOURLY} National Minimum Wage and modern awards set the floor. The Territory's own rules cover long service leave, public holidays and payroll tax.`,
      },
    ],
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

const baseName = (name: string) => name.replace(/\s*\(observed\)$/, "");

/**
 * The whole-day holidays in the 2026-27 wage year that are NOT on every state's
 * list (Labour Day, Canberra Day, Easter Saturday, an extra Anzac Monday...).
 * A day counts as shared when every other state has a whole-day holiday on the
 * same date or under the same name ("Boxing Day (observed)" = "Boxing Day").
 * Read from the verified public holiday data, so the list is the state's own.
 */
export function stateOnlyHolidays(slug: MwStateSlug): PublicHolidayDate[] {
  const others = MW_STATE_SLUGS.filter((x) => x !== slug).map((x) => {
    const days = holidaysInMinimumWageYear(x);
    return { dates: new Set(days.map((h) => h.date)), names: new Set(days.map((h) => baseName(h.name))) };
  });
  return holidaysInMinimumWageYear(slug).filter((h) => !others.every((o) => o.dates.has(h.date) || o.names.has(baseName(h.name))));
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
    `Minimum wage ${s.inName}: ${money(NMW.hourly)}/hr, ${money(NMW.weekly)}/wk, about ${wholeMoney(t.weeklyNet)}/wk after tax. ${stateBit}Who is in the state system, child work rules and a calculator.`,
    `Minimum wage ${s.inName}: ${money(NMW.hourly)}/hr, about ${wholeMoney(t.weeklyNet)}/wk after tax. ${stateBit}State system, child work rules, calculator.`,
    `Minimum wage ${s.inName}: ${money(NMW.hourly)}/hr, about ${wholeMoney(t.weeklyNet)}/wk after tax. State rules and a take-home calculator.`,
  );
}

/** "Labour Day (Monday 5 October 2026), Easter Saturday (...) and ..." for the holidays paragraph. */
export function stateOnlyHolidayList(slug: MwStateSlug): string {
  const parts = stateOnlyHolidays(slug).map((h) => `${h.name.replace(/^The /, "the ")} on ${formatHolidayDate(h.date)}`);
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/**
 * The FAQ array a state page renders AND emits as FAQPage JSON-LD. The one
 * shared question carries the state's own answer note; the rest are the
 * state's own questions.
 */
export function mwStateFaqs(s: MwStateInfo): MwFaq[] {
  return [
    {
      q: `What is the minimum wage ${s.inName}?`,
      a: `${money(NMW.hourly)} an hour, or ${money(NMW.weekly)} for a ${EMPLOYMENT.standardWeeklyHours}-hour week, from the first full pay period on or after 1 July 2026. ${s.answerNote}`,
    },
    ...s.faqs,
  ];
}

export { NMW_SOURCE };
