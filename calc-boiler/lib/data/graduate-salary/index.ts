// =============================================================================
// Graduate salary hub: first-job pay for six graduate professions, from sources
// only. Nothing is estimated, averaged or taken from a job board.
//
// Two kinds of figure, kept apart on the page:
//
// 1. QILT Graduate Outcomes Survey 2025 (Department of Education, national
//    report, read 5 October 2026): "median annual salary of graduates employed
//    full-time", undergraduates, 4 to 6 months after finishing the course,
//    Figure 24 / the study-area table. What graduates who got a full-time job
//    reported earning. It is a survey median, not a rate anyone must pay.
//    https://qilt.edu.au/docs/default-source/default-document-library/2025-gos-national-report.pdf
//    QILT has no "accounting" study area in that report; accountants are
//    inside "Business and management".
//
// 2. Published minimum or scale rates, already verified elsewhere in this repo
//    from the instrument itself:
//      - Engineer: Professional Employees Award [MA000065] cl 14.1, Level 1 pay
//        point 1.1 (4 or 5 year degree) $68,538 (lib/data/job-pay-rates/engineer.ts)
//      - Lawyer: Legal Services Award [MA000116] Level 5 law graduate, pay while
//        completing practical legal training, weekly x 52 (job-pay-rates/lawyer.ts).
//        Admitted lawyers are award-free.
//      - Doctor: Medical Practitioners Award intern minimum for national-system
//        employers (job-pay-rates/doctor.ts) and NSW Health's intern salary
//        (Information Bulletin IB2026_007, 20 January 2026: $80,638 a year from
//        the first full pay period on or after 1 July 2025; an interim increase
//        pending the NSW IRC's final decision, so it may have moved since).
//      - Teacher: first qualified step of each state's public-school salary
//        schedule (lib/data/teacher-pay).
//      - Nurse: first step of each state's base registered nurse scale
//        (lib/data/nursing-pay).
//      - Accountant: award-free (Fair Work Ombudsman); no minimum above the NMW.
//
// NOT published (could not be verified from an official source): Queensland,
// Victorian and other-state intern salaries, graduate program salaries at
// individual employers, graduate accountant and graduate lawyer market
// salaries beyond the QILT median, and anything from GradAustralia or job
// boards.
// =============================================================================

import { calculatePayBreakdown } from "../../constants/australian-tax";
import { OCCUPATIONS_BY_SLUG, rowAnnual } from "../job-pay-rates";
import { TEACHER_PAY_STATES, graduateSalary } from "../teacher-pay";
import { NURSING_PAY_STATES, annualFor, annualIsPublished, baseRegisteredScale, getNursingPay, instrumentFor } from "../nursing-pay";

export const GRADUATE_SALARY_VERIFIED_ON = "5 October 2026";

export const QILT_SOURCE = {
  title: "2025 Graduate Outcomes Survey: National Report",
  publisher: "Quality Indicators for Learning and Teaching (QILT), Australian Government Department of Education",
  url: "https://qilt.edu.au/docs/default-source/default-document-library/2025-gos-national-report.pdf",
} as const;

/** Undergraduate median annual full-time salary by study area, 2025 GOS (4 to 6 months after graduating). */
export const QILT_MEDIANS_2025 = {
  all: 77_000,
  medicine: 85_900,
  teaching: 82_100,
  engineering: 82_500,
  law: 80_000,
  nursing: 75_100,
  business: 74_000,
} as const;

export type GraduateSlug = "lawyer" | "nurse" | "engineer" | "accountant" | "teacher" | "doctor";

export interface PublishedStart {
  label: string;
  annual: number;
  /** Where it comes from and how it is derived. */
  basis: string;
}

export interface GraduateProfession {
  slug: GraduateSlug;
  title: string;
  /** Short role name used in headings. */
  role: string;
  qiltArea: string;
  qiltMedian: number;
  /** One published starting figure to feature, if any. */
  published: PublishedStart | null;
  /** How the profession is paid, in a sentence that stays within what the sources say. */
  howPaid: string;
  /** Existing page on this site with the full detail. */
  detailHref: string;
  detailLabel: string;
}

function occupationRow(slug: "lawyer" | "engineer" | "doctor", tableMatch: (label: string) => boolean) {
  const occ = OCCUPATIONS_BY_SLUG[slug];
  for (const t of occ.tables) {
    const row = t.rows.find((r) => tableMatch(r.label));
    if (row) return row;
  }
  throw new Error(`Graduate salary: no matching row in ${slug}`);
}

const engineerRow = occupationRow("engineer", (l) => l.includes("pay point 1.1 (4 or 5 year degree)"));
const lawyerRow = occupationRow("lawyer", (l) => l.startsWith("Level 5"));
const doctorRow = occupationRow("doctor", (l) => l === "Intern");

export const GRADUATE_PROFESSIONS: readonly GraduateProfession[] = [
  {
    slug: "lawyer",
    title: "Graduate lawyer",
    role: "Graduate lawyer",
    qiltArea: "Law and paralegal studies",
    qiltMedian: QILT_MEDIANS_2025.law,
    published: {
      label: "Law graduate, Level 5 (Legal Services Award), before admission",
      annual: rowAnnual(lawyerRow),
      basis: `Award minimum of $${lawyerRow.hourly.toFixed(2)} an hour while completing practical legal training in a private firm, weekly rate x 52. Admitted lawyers are award-free, so pay after admission is set by contract.`,
    },
    howPaid:
      "Law graduates doing practical legal training in a private firm are covered by the Legal Services Award. Once admitted, a lawyer is award-free: pay is whatever the contract or enterprise agreement says.",
    detailHref: "/job-pay-rates/lawyer/",
    detailLabel: "Lawyer pay rates",
  },
  {
    slug: "nurse",
    title: "Graduate nurse",
    role: "Graduate nurse",
    qiltArea: "Nursing",
    qiltMedian: QILT_MEDIANS_2025.nursing,
    published: null,
    howPaid:
      "Public-sector nurses are paid on a state enterprise agreement scale. A graduate registered nurse starts on the first step of the state's registered nurse scale; the table below shows each state's first step.",
    detailHref: "/nurses-award-rates/",
    detailLabel: "Nurses award and state pay scales",
  },
  {
    slug: "engineer",
    title: "Graduate engineer",
    role: "Graduate engineer",
    qiltArea: "Engineering",
    qiltMedian: QILT_MEDIANS_2025.engineering,
    published: {
      label: "Level 1 graduate professional, pay point 1.1 (4 or 5 year degree)",
      annual: engineerRow.annual ?? rowAnnual(engineerRow),
      basis: "Professional Employees Award 2020 [MA000065] clause 14.1: the minimum annual wage for a graduate engineer with a degree recognised by Engineers Australia. Many employers pay above it.",
    },
    howPaid:
      "A graduate engineer with a 4 or 5-year Engineers Australia-recognised degree starts at Level 1, pay point 1.1 of the Professional Employees Award and can progress to pay points 1.2 to 1.4.",
    detailHref: "/job-pay-rates/engineer/",
    detailLabel: "Engineer pay rates",
  },
  {
    slug: "accountant",
    title: "Graduate accountant",
    role: "Graduate accountant",
    qiltArea: "Business and management (includes accounting)",
    qiltMedian: QILT_MEDIANS_2025.business,
    published: null,
    howPaid:
      "Accountants are award-free (Fair Work Ombudsman guidance): the legal floor is the National Minimum Wage, and everything above it comes from the employment contract or an enterprise agreement. No official source publishes a graduate accountant pay scale, so none is shown.",
    detailHref: "/job-pay-rates/accountant/",
    detailLabel: "Accountant pay rates",
  },
  {
    slug: "teacher",
    title: "Graduate teacher",
    role: "Graduate teacher",
    qiltArea: "Teacher education",
    qiltMedian: QILT_MEDIANS_2025.teaching,
    published: null,
    howPaid:
      "Public-school teachers are paid on a state or territory salary schedule set by an enterprise agreement. A qualified graduate starts at the first qualified step of that state's scale, shown in the table below.",
    detailHref: "/teacher-pay-australia/",
    detailLabel: "Teacher pay by state",
  },
  {
    slug: "doctor",
    title: "Intern doctor",
    role: "Intern doctor",
    qiltArea: "Medicine",
    qiltMedian: QILT_MEDIANS_2025.medicine,
    published: {
      label: "NSW Health intern (public hospitals)",
      annual: 80_638,
      basis:
        "NSW Health Information Bulletin IB2026_007 (20 January 2026): $80,638 a year from the first full pay period on or after 1 July 2025, an interim increase pending the NSW Industrial Relations Commission's final decision. Check NSW Health for any newer rate.",
    },
    howPaid:
      "Public-hospital interns are paid under state medical officer awards or agreements. The Medical Practitioners Award sets a lower national-system minimum for private employers.",
    detailHref: "/job-pay-rates/doctor/",
    detailLabel: "Doctor pay rates",
  },
];

export const NMW_INTERN_AWARD_MINIMUM = {
  annual: doctorRow.annual ?? rowAnnual(doctorRow),
  hourly: doctorRow.hourly,
} as const;

export interface TeacherStart {
  state: string;
  code: string;
  annual: number;
  effectiveFrom: string;
  href: string;
}

export function teacherStarts(): TeacherStart[] {
  const out: TeacherStart[] = [];
  for (const s of TEACHER_PAY_STATES) {
    const annual = graduateSalary(s);
    if (annual === null) continue;
    out.push({ state: s.name, code: s.code, annual, effectiveFrom: s.ratesEffectiveFrom, href: `/teacher-pay-australia/${s.slug}/` });
  }
  return out;
}

export interface NurseStart {
  state: string;
  code: string;
  label: string;
  annual: number;
  /** True when the annual figure is printed in the instrument rather than weekly x 52. */
  annualPublished: boolean;
  effectiveFrom: string;
}

export function nurseStarts(): NurseStart[] {
  const out: NurseStart[] = [];
  for (const slug of NURSING_PAY_STATES) {
    const st = getNursingPay(slug);
    if (!st) continue;
    const scale = baseRegisteredScale(st);
    // Queensland's first row is a re-entry rate for returning nurses, not a graduate step.
    const point = scale?.points.find((p) => !/re-entry/i.test(p.label));
    if (!scale || !point) continue;
    const annual = annualFor(point);
    if (annual === null) continue;
    out.push({
      state: st.name,
      code: st.code,
      label: `${scale.classification}, ${point.label}`,
      annual,
      annualPublished: annualIsPublished(point),
      effectiveFrom: instrumentFor(st, scale.instrumentId)?.effectiveFrom ?? "",
    });
  }
  return out;
}

export interface GraduateTakeHome {
  gross: number;
  /** Net annual with no HELP debt. */
  net: number;
  netWeekly: number;
  /** Compulsory HELP repayment on this income (FY2026-27 marginal system), if the graduate has a debt. */
  helpRepayment: number;
  netAfterHelp: number;
  netAfterHelpWeekly: number;
}

/** Take-home from the site's own engine (resident, FY2026-27, private cover, super on top). */
export function graduateTakeHome(gross: number): GraduateTakeHome {
  const base = calculatePayBreakdown({ grossSalary: gross, hasPrivateHealth: true });
  const hecs = calculatePayBreakdown({ grossSalary: gross, includeHECS: true, hasPrivateHealth: true });
  return {
    gross,
    net: base.takeHomePay,
    netWeekly: base.weekly,
    helpRepayment: hecs.hecsRepayment,
    netAfterHelp: hecs.takeHomePay,
    netAfterHelpWeekly: hecs.weekly,
  };
}
