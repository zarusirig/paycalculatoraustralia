// =============================================================================
// Level-specific facts for the 20 state level pages (23 Oct 2026):
//   /public-service-pay-scales/vic/vps-2/ ... vps-7/
//   /public-service-pay-scales/qld/ao2/   ... ao8/
//   /public-service-pay-scales/sa/aso-2/  ... aso-8/
//
// Why: a review found 51% to 71% of each page's visible text was shared
// word for word with its siblings. Everything here is specific to one level and
// read from a primary source on 23 October 2026 (see LEVEL_FACT_SOURCES):
//   - what the level does: the instrument's own classification descriptor,
//     put into plain words (no long quotes);
//   - job titles, only where the instrument names them (VPS only);
//   - headcount, only where the employer publishes it by level (VPS only;
//     QLD now reports by earnings bracket and SA by salary group, so neither
//     is shown and nothing is estimated);
//   - the hourly rate for every pay point, from the instrument's ordinary hours;
//   - questions shaped by GSC queries, 23 Sep to 20 Oct 2026: "vps 5.2" (61
//     impressions), "vps 6.2" (51), "vps 7.2 salary" (41), "vps 4.1 salary"
//     (29); "ao3 pay rate" (23 + 22), "ao4 pay rate" (19); "qld health ao3 pay
//     rate" (16), "ao6 salary qld health" (12); "ao5 salary queensland
//     government pdf" (16); "aso4 pay rate" (12), "aso2 pay rate" (8); "aso6 act
//     government salary" (17), "act government aso6 salary" (11), "aso3 salary
//     act government" (8).
//
// No salary is typed here. Pay figures still come from vic.ts, qld.ts, sa.ts
// and act.ts through the StateLevelData passed in.
// =============================================================================

import { allBands, getJurisdiction } from "./index";
import type { StateLevelData, StateLevelJurisdiction } from "./state-levels";
import type { PayFaq } from "./types";
import { formatSalary } from "./types";

export const FACTS_READ_ON = "23 October 2026";

export interface LevelFactSource {
  title: string;
  publisher: string;
  url: string;
  /** What we took from it. */
  note: string;
}

export const LEVEL_FACT_SOURCES = {
  vpsAgreement: {
    title: "Victorian Public Service Enterprise Agreement 2024 (Schedule C, Tables 31.1 to 31.3 and Table 4; clause 42)",
    publisher: "Department of Treasury and Finance, Victoria",
    url: "https://www.dtf.vic.gov.au/sites/default/files/2024-10/Victorian-Public-Service-Enterprise-Agreement-2024.pdf",
    note: "Grade and value range standard descriptors (Tables 31.1 to 31.3), VPS aligned classifications (Table 4) and ordinary hours of 76 a fortnight (clause 42).",
  },
  vpscGrades: {
    title: "Employee occupations and pay grades 2025 (VPS grades by headcount)",
    publisher: "Victorian Public Sector Commission",
    url: "https://www.vpsc.vic.gov.au/public-sector-data/workforce-data-state-public-sector-2025/employee-and-executive-pay-leave-and-work-arrangements/employee-occupations-and-pay-grades-2025",
    note: "Headcount by VPS grade at June 2025, updated 27 March 2026.",
  },
  qldAward: {
    title: "Queensland Public Service Officers and Other Employees Award – State 2015, reprint as at 1 September 2026 (clause 15.1; Schedule 4)",
    publisher: "Queensland Industrial Relations Commission",
    url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/qld_public_service_010926.pdf",
    note: "Ordinary hours of 36.25 a week (clause 15.1) and the generic level statements for the administrative stream (Schedule 4).",
  },
  qldHealthAdmin: {
    title: "Administrative stream wage rates",
    publisher: "Queensland Health",
    url: "https://www.health.qld.gov.au/hrpolicies/wage-rates/admin",
    note: "States that Queensland Health administrative rates come from schedule 1 of the Queensland Public Health Sector Certified Agreement (No. 12) 2025 (EB12), with a 0.5% CPI uplift in mid-2026. No figure is taken from it.",
  },
  saAsoStandards: {
    title: "Determination 5, Attachment 2: Classification Standards, Administrative Services Stream (issued 22 January 2026)",
    publisher: "Office of the Commissioner for Public Sector Employment, South Australia",
    url: "https://www.publicsector.sa.gov.au/hr-and-policy/Determinations,-Premiers-Directions-and-Guidelines/Determinations/Source/determination-5/determination-5-attachment-2/20260122-Determination-5-Attachment-2-ASO-Classification-Standards.pdf",
    note: "Work level definitions and characteristics for ASO1 to ASO8.",
  },
  saHours: {
    title: "Determination 3.1: Employment Conditions – Hours of Work, Overtime and Leave (clause 2)",
    publisher: "Office of the Commissioner for Public Sector Employment, South Australia",
    url: "https://www.publicsector.sa.gov.au/__data/assets/pdf_file/0011/1170488/20260122-Determination-3.1-Employment-Conditions-Hours-of-Work,-Overtime-and-Leave.pdf",
    note: "Full-time ordinary hours average 37.5 or 38 a week. The Department for Education's 2026 ASO rates use 37.5: its ASO4 tier 1 rate of $3,151.90 a fortnight is $42.03 an hour, which is the fortnightly rate divided by 75.",
  },
} as const satisfies Record<string, LevelFactSource>;

export type LevelFactSourceId = keyof typeof LEVEL_FACT_SOURCES;

// ---------- hourly rates ----------

/** Weeks in a year: 365 ÷ 7. */
export const WEEKS_PER_YEAR = 52.1429;

export interface OrdinaryHours {
  weekly: number;
  /** Where the hours come from, as a sentence fragment. */
  basis: string;
  sourceId: LevelFactSourceId;
}

export const ORDINARY_HOURS: Record<StateLevelJurisdiction, OrdinaryHours> = {
  vic: {
    weekly: 38,
    basis: "Clause 42 of the VPS agreement sets ordinary hours of 76 a fortnight, which is 38 a week",
    sourceId: "vpsAgreement",
  },
  qld: {
    weekly: 36.25,
    basis: "Clause 15.1 of the award sets ordinary hours of 36.25 a week (7.25 a day)",
    sourceId: "qldAward",
  },
  sa: {
    weekly: 37.5,
    basis:
      "Commissioner's Determination 3.1 sets full-time hours at 37.5 or 38 a week, and the Department for Education's 2026 ASO hourly rates are worked out on 37.5",
    sourceId: "saHours",
  },
};

/** Hourly rate = annual salary ÷ (ordinary weekly hours × 52.1429). */
export function hourlyRate(annual: number, weeklyHours: number): number {
  return annual / (weeklyHours * WEEKS_PER_YEAR);
}

export function formatHourly(n: number): string {
  return `$${n.toFixed(2)}`;
}

// ---------- what each level does ----------

export interface LevelDescriptor {
  /** 2 to 4 short sentences, our own words, from the instrument's descriptor. */
  text: string;
  sourceId: LevelFactSourceId;
  /** Job titles the instrument itself ties to this level. VPS only. */
  titles?: string;
  /** How the value ranges differ (VPS grades with more than one). */
  valueRanges?: string;
}

const VPS_TITLES_LEAD = "Table 4 of the agreement lines up some named jobs with this grade's value ranges, for example";

export const LEVEL_DESCRIPTORS: Record<string, LevelDescriptor> = {
  // VPS: Schedule C, Tables 31.1 to 31.3 (value range standard descriptors).
  "vps-2": {
    text: "VPS 2 staff follow set rules and processes under general supervision and plan their own work to meet set targets. Typical work is office support, data entry and payments, routine letters and minutes, and phone or counter service. At value range 2.2 you also choose between accepted options and make decisions that can have a big effect on clients.",
    sourceId: "vpsAgreement",
    titles: `${VPS_TITLES_LEAD} Prison Officer (COG 2A), Sheriff's Officer and Police Custody Officer (PCO2). A qualified admitted solicitor (Solicitor 1) starts at 2.2.`,
    valueRanges:
      "2.1 is standard work under general supervision, such as processing, office support and counter service. 2.2 adds choosing between accepted options, decisions that can have a big effect on clients, and research or data analysis that others set.",
  },
  "vps-3": {
    text: "VPS 3 is the first grade where the agreement mentions team leadership. Staff use professional judgement to apply rules, fix local service problems, review work from less experienced colleagues and manage the work area's budget and resources. At value range 3.2 their decisions can set local precedents.",
    sourceId: "vpsAgreement",
    titles: `${VPS_TITLES_LEAD} Solicitor 2, Senior Sheriff's Officer and Senior Prison Officer (COG 2B).`,
    valueRanges:
      "3.1 is where team leadership can start, with judgement about how rules apply and responsibility for the work area's budget. 3.2 adds setting local precedents and guiding others in the work area and related areas.",
  },
  "vps-4": {
    text: "VPS 4 staff write guidelines for their work area, solve service problems in line with program goals and give advice that feeds into policy. The work often means managing projects with little direction, leading a larger or complex support unit, or managing operational teams.",
    sourceId: "vpsAgreement",
    titles: `${VPS_TITLES_LEAD} Solicitor 3, Senior Fisheries Officer and Housing Services Officer 3.`,
  },
  "vps-5": {
    text: "VPS 5 staff make decisions that often affect people outside their own work area, where there is some but not full precedent. They are accountable for how the work area is organised, its resources and its outputs, and they write policy options and lead projects. At value range 5.2 decisions may set precedents for peers.",
    sourceId: "vpsAgreement",
    titles: `${VPS_TITLES_LEAD} Senior Solicitor, Supervising Fisheries Officer and Regional Manager (Sheriff's Operations).`,
    valueRanges:
      "At 5.1, decisions often affect people outside the immediate work area, and staff lead projects and draft policy options. At 5.2, decisions may set precedents for peers, projects are more complex, and staff argue for policy options and write business plans for changing priorities.",
  },
  "vps-6": {
    text: "VPS 6 staff build policy frameworks in their field and take part in strategic planning. They are accountable for corporate goals, including local business plans, and often manage a large service, a regional function or an area with a big budget. At value range 6.2 the work reaches across whole functional areas and includes policy advice to government.",
    sourceId: "vpsAgreement",
    titles: `${VPS_TITLES_LEAD} Principal Solicitor, Fisheries Manager and, at 6.2, Deputy Sheriff.`,
    valueRanges:
      "6.1 covers policy frameworks and local business plans for one major functional area. 6.2 covers policy and programs that reach across functional areas, major projects for the organisation and policy advice to government and senior leaders.",
  },
  "vps-7": {
    text: "VPS 7 is the Senior Technical Specialist grade. Staff lead highly specialised research or give state-wide expertise in a field that matters to the whole agency, often with few rules to follow beyond government policy and the standards of their profession. Value range 7.3 is for the agency's top experts, recognised nationally and internationally.",
    sourceId: "vpsAgreement",
    titles: "The agreement calls this grade Senior Technical Specialist. Table 4 also lines up the Senior General Manager of a major prison (COG 7) with value ranges 7.1 to 7.3.",
    valueRanges:
      "7.1 leads specialised research or gives state-wide expertise in one field. 7.2 is the same kind of work with broader scope, complexity and impact. 7.3 is for the agency's top experts, recognised nationally and internationally, who manage multi-million dollar or cross-portfolio projects.",
  },

  // QLD: award Schedule 4, generic level statements, administrative stream.
  ao2: {
    text: "AO2 work is a mix of administrative and clerical tasks with clear, set outcomes and basic problem solving within guidelines. It is usually done under close supervision, using precedents, procedures and advice from senior staff. AO2 has no supervisory duties, although experienced staff may guide new starters.",
    sourceId: "qldAward",
  },
  ao3: {
    text: "AO3 work needs relevant experience and a sound knowledge of the main activity in the work area. It includes drafting early reports, papers and letters, giving information to clients and supporting senior officers, usually under general direction. It is the first AO level where the award mentions supervision, such as on-the-job training and checking team members' work.",
    sourceId: "qldAward",
  },
  ao4: {
    text: "AO4 staff supervise a work group, a small work area or an office and coordinate a range of office functions. The work includes papers and reports, complex letters for senior officers, specialist tasks and helping write procedure guidelines. Staff work under general direction, set priorities, monitor work flow and may develop local procedures.",
    sourceId: "qldAward",
  },
  ao5: {
    text: "AO5 staff may manage a discrete unit, program or activity, or give subject matter or policy advice across several programs. The work is done under limited direction, within limits set by senior management. The award expects significant management ability, such as supervising staff, setting priorities and allocating resources.",
    sourceId: "qldAward",
  },
  ao6: {
    text: "AO6 work covers policy, administrative or specialist advice, program management, project work and research papers. It includes replies to Parliamentary Questions, ministerial representations and briefing material, and representing the office at meetings. Staff work under limited direction, and their decisions can have a major impact on the day-to-day running of the work area.",
    sourceId: "qldAward",
  },
  ao7: {
    text: "AO7 staff may control a unit that runs a program, activity or corporate support function at branch or department head level. The work includes developing policy, handling representations to the Minister, helping prepare Cabinet Submissions and writing briefing notes for senior managers. It is done under broad direction, and managing people and resources is usually a large part of the job.",
    sourceId: "qldAward",
  },
  ao8: {
    text: "AO8 staff may run a major state-wide program that is critical to the agency, or a service-wide function. They work under the broad direction of a senior executive and use significant independent judgement. Their delegations can include being the final authority on approving spending.",
    sourceId: "qldAward",
  },

  // SA: OCPSE Determination 5, Attachment 2, work level definitions.
  "aso-2": {
    text: "ASO-2 work has clearly defined outcomes, problem solving or both, and is done under general direction. Staff may run a minor function or part of a major one, using limited judgement based on precedents and guidelines. ASO-2 staff may allocate and check work and train others on the job, but they do not line-supervise staff.",
    sourceId: "saAsoStandards",
  },
  "aso-3": {
    text: "ASO-3 work needs previous experience and particular knowledge or skills, often from post-secondary study. Staff sort out day-to-day issues where clear procedures may not exist and may be responsible for one or more minor functions. ASO-3 is the first level where line supervision may be part of the job.",
    sourceId: "saAsoStandards",
  },
  "aso-4": {
    text: "ASO-4 staff are responsible for particular functions within an agency and work under limited direction with some autonomy. They use judgement or delegated authority where precedents are not clear, and may run minor projects. The effect of their work can reach the community and other agencies.",
    sourceId: "saAsoStandards",
  },
  "aso-5": {
    text: "ASO-5 work needs proven experience and competence in a discipline. Staff give expert advice, use delegated authority, approve documents to make sure legal requirements are met, and run significant projects with written reports and recommendations. They work under limited direction and may negotiate with other agencies and the public.",
    sourceId: "saAsoStandards",
  },
  "aso-6": {
    text: "ASO-6 staff control or coordinate projects or programs in line with corporate goals, and plan, run and evaluate agency activities. Their work can shape state, regional or local office operations and includes policy advice, under broad direction. The standard names ASO-6 as the first level for managerial responsibilities.",
    sourceId: "saAsoStandards",
  },
  "aso-7": {
    text: "ASO-7 staff plan and deliver agency objectives within set corporate goals, and design, run and evaluate projects and programs under broad direction only. The work can affect agency goals and help shape government policy, and its scope may be statewide or service wide. Staff hold significant delegated authority.",
    sourceId: "saAsoStandards",
  },
  "aso-8": {
    text: "ASO-8 staff are responsible for a major statewide program, or one of critical importance to the agency, within broad policy guidelines. The work calls for original thinking, significant independent judgement and very high expertise in the discipline. Duties can include managing significant resources or a service-wide function.",
    sourceId: "saAsoStandards",
  },
};

// ---------- headcount (VPS only) ----------

/** VPSC, VPS grades by headcount, June 2025. Grade 1 is 43; grade 7 is Senior Technical Specialist. */
export const VPS_GRADE_HEADCOUNT = {
  asAt: "June 2025",
  byGrade: { "vps-1": 43, "vps-2": 3_109, "vps-3": 6_440, "vps-4": 9_783, "vps-5": 12_768, "vps-6": 8_763, "vps-7": 1_275 } as Record<string, number>,
  sourceId: "vpscGrades" as LevelFactSourceId,
};

export interface LevelHeadcount {
  count: number;
  total: number;
  share: number;
  /** 1 = the largest grade. */
  rank: number;
  asAt: string;
}

export function levelHeadcount(sectionId: string): LevelHeadcount | undefined {
  const count = VPS_GRADE_HEADCOUNT.byGrade[sectionId];
  if (count === undefined) return undefined;
  const all = Object.values(VPS_GRADE_HEADCOUNT.byGrade);
  const total = all.reduce((a, b) => a + b, 0);
  return { count, total, share: (count / total) * 100, rank: all.filter((n) => n > count).length + 1, asAt: VPS_GRADE_HEADCOUNT.asAt };
}

export function headcountSentence(label: string, h: LevelHeadcount): string {
  const rank =
    h.rank === 1 ? "the largest grade" : h.rank === 2 ? "the second-largest grade" : h.rank === 3 ? "the third-largest grade" : `number ${h.rank} of the 7 grades by size`;
  return `At ${h.asAt}, ${h.count.toLocaleString("en-AU")} people worked at ${label}. That is ${h.share.toFixed(1)}% of the ${h.total.toLocaleString("en-AU")} staff on the VPS grade structure, which makes it ${rank}.`;
}

// ---------- level-specific questions ----------

/** QLD levels with Queensland Health searches in GSC. */
const QLD_HEALTH_LEVELS = ["ao3", "ao4", "ao6", "ao7"];
/** QLD levels with "... pdf" searches in GSC. */
const QLD_PDF_LEVELS = ["ao5"];

/** The same ASO number in the ACT, from act.ts, if the ACT has it. */
export function actCounterpart(sectionId: string) {
  const n = sectionId.match(/^aso-(\d)$/)?.[1];
  if (!n) return undefined;
  const act = getJurisdiction("act");
  if (!act) return undefined;
  const band = allBands(act).find((b) => b.code === `ASO ${n}`);
  if (!band) return undefined;
  const schedule = act.schedules.find((s) => s.streams.some((st) => st.bands.includes(band)));
  return { band, schedule, jurisdiction: act };
}

function hourlyFaq(d: StateLevelData): PayFaq {
  const hours = ORDINARY_HOURS[d.jurisdiction.slug as StateLevelJurisdiction];
  const first = d.points[0];
  const last = d.points[d.points.length - 1];
  const lo = formatHourly(hourlyRate(first.annual, hours.weekly));
  const hi = formatHourly(hourlyRate(last.annual, hours.weekly));
  return {
    q: `What is the ${d.section.label} hourly rate?`,
    a: `From ${d.config.effective}, ${d.section.label} works out at ${lo} an hour at ${first.label} and ${hi} at ${last.label}, on ${hours.weekly} ordinary hours a week. ${d.section.label} hourly rates for all ${d.points.length} ${d.config.stepWord}s are in the table above.`,
  };
}

/** Questions only this level's page answers. Every figure comes from `d` or act.ts. */
export function levelFactFaqs(d: StateLevelData): PayFaq[] {
  const { id, label } = d.section;
  const slug = d.jurisdiction.slug as StateLevelJurisdiction;
  const faqs: PayFaq[] = [];
  const desc = LEVEL_DESCRIPTORS[id];

  if (slug === "vic") {
    if (desc?.valueRanges && d.section.bands.length > 1) {
      const codes = d.section.bands.map((b) => b.code.replace("VPS ", ""));
      const list = codes.length === 2 ? `${codes[0]} and ${codes[1]}` : `${codes.slice(0, -1).join(", ")} and ${codes[codes.length - 1]}`;
      const parts = d.section.bands.map((b) => `${b.code.replace("VPS ", "")} pays ${formatSalary(b.min)} to ${formatSalary(b.max)}`);
      const ranges = `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
      faqs.push({
        q: `What is the difference between VPS ${list}?`,
        a: `They are the ${codes.length} value ranges of ${label}. From ${d.config.effective}, ${ranges}. ${desc.valueRanges}`,
      });
    } else if (d.section.bands.length === 1) {
      const first = d.points[0];
      const last = d.points[d.points.length - 1];
      faqs.push({
        q: `What does the ${d.section.bands[0].code.replace("VPS ", "")} in ${d.section.bands[0].code} mean?`,
        a: `${label} has only one value range, so every ${label} job is ${d.section.bands[0].code.replace("VPS ", "")}. The last number in a pay point is the ${d.config.stepWord}: ${first.label} is the first and ${last.label} is the top. From ${d.config.effective}, ${first.label} pays ${formatSalary(first.annual)} and ${last.label} pays ${formatSalary(last.annual)}.`,
      });
    }
  }

  if (slug === "qld") {
    faqs.push(hourlyFaq(d));
    if (QLD_HEALTH_LEVELS.includes(id)) {
      faqs.push({
        q: `Does Queensland Health pay ${withArticleLocal(label)} the same rates?`,
        a: `Queensland Health pays ${label} from schedule 1 of its own agreement, the Queensland Public Health Sector Certified Agreement (No. 12) 2025 (EB12), not from the award table on this page. Its ${label} rates include a 0.5% CPI uplift added in mid-2026, and they are listed on the Queensland Health administrative stream wage rates page.`,
      });
    }
    if (QLD_PDF_LEVELS.includes(id)) {
      faqs.push({
        q: `Where is the official ${label} pay scale PDF?`,
        a: `The award rates on this page come from the Queensland Public Service Officers and Other Employees Award – State 2015, reprinted as at 1 September 2026. The Queensland Industrial Relations Commission publishes it as a PDF, and Schedule 4 holds the ${label} level statement. Most departments pay under the State Government Entities Certified Agreement 2023, so also check your department's own salary schedule.`,
      });
    }
  }

  if (slug === "sa") {
    faqs.push(hourlyFaq(d));
    const act = actCounterpart(id);
    if (act) {
      const n = id.split("-")[1];
      faqs.push({
        q: `Is ${label} in South Australia the same as ASO ${n} in the ACT?`,
        a: `No. Both services use the name Administrative Services Officer, but they have different agreements and pay. SA ${label} pays ${formatSalary(d.section.range.min)} to ${formatSalary(d.section.range.max)} from ${d.config.effective}. ACT ASO ${n} pays ${formatSalary(act.band.min)} to ${formatSalary(act.band.max)}${act.schedule ? ` under the ${act.schedule.title}` : ""}. The ACT rates are on our ACT pay scales page.`,
      });
    }
  }

  return faqs;
}

function withArticleLocal(label: string): string {
  return `${/^[AEIOU]/i.test(label) ? "an" : "a"} ${label}`;
}

/** Fact sources a level page cites, deduplicated by URL by the caller. */
export function levelFactSources(d: StateLevelData): { title: string; url: string; publisher: string }[] {
  const slug = d.jurisdiction.slug as StateLevelJurisdiction;
  const ids = new Set<LevelFactSourceId>();
  const desc = LEVEL_DESCRIPTORS[d.section.id];
  if (desc) ids.add(desc.sourceId);
  if (levelHeadcount(d.section.id)) ids.add(VPS_GRADE_HEADCOUNT.sourceId);
  ids.add(ORDINARY_HOURS[slug].sourceId);
  if (slug === "qld" && QLD_HEALTH_LEVELS.includes(d.section.id)) ids.add("qldHealthAdmin");
  const out: { title: string; url: string; publisher: string }[] = [...ids].map((id) => {
    const s = LEVEL_FACT_SOURCES[id];
    return { title: s.title, url: s.url, publisher: s.publisher };
  });
  const act = slug === "sa" ? actCounterpart(d.section.id) : undefined;
  const actSource = act?.schedule ? act.jurisdiction.sources.find((s) => s.id === act.schedule!.sourceId) : undefined;
  if (actSource) out.push({ title: actSource.title, url: actSource.url, publisher: actSource.publisher });
  return out;
}
