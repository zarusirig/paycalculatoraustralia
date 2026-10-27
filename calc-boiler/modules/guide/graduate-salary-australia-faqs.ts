import { calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { GRADUATE_PROFESSIONS, NMW_INTERN_AWARD_MINIMUM, QILT_MEDIANS_2025, graduateTakeHome, nurseStarts, teacherStarts } from "@/lib/data/graduate-salary";
import { OCCUPATIONS_BY_SLUG, rowAnnual, type RateRow } from "@/lib/data/job-pay-rates";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Figures: QILT 2025 Graduate
// Outcomes Survey, the Professional Employees Award, the Legal Services Award,
// NSW Health IB2026_007 and state agreements (see lib/data/graduate-salary).

const NURSES = nurseStarts();
const NURSE_LOW = Math.min(...NURSES.map((n) => n.annual));
const NURSE_HIGH = Math.max(...NURSES.map((n) => n.annual));
const TEACHERS = teacherStarts();
const TEACHER_LOW = TEACHERS.reduce((a, b) => (b.annual < a.annual ? b : a));
const TEACHER_HIGH = TEACHERS.reduce((a, b) => (b.annual > a.annual ? b : a));
const round100 = (n: number) => Math.round(n / 100) * 100;

/** Reads one award row from lib/data/job-pay-rates, so award figures here are never typed by hand. */
function awardRow(slug: "lawyer" | "engineer", match: (label: string) => boolean): RateRow {
  for (const t of OCCUPATIONS_BY_SLUG[slug].tables) {
    const row = t.rows.find((r) => match(r.label));
    if (row) return row;
  }
  throw new Error(`Graduate salary FAQs: no matching ${slug} row`);
}

/** Legal Services Award [MA000116] Level 5 law graduate. */
export const LAW_GRADUATE_ROW = awardRow("lawyer", (l) => l.includes("Law graduate"));
/** Professional Employees Award [MA000065] cl 14.1, Level 1 graduate professional pay points. */
export const ENGINEER_LEVEL1 = {
  pp11Degree3: awardRow("engineer", (l) => l.includes("pay point 1.1 (3 year degree)")),
  pp11: awardRow("engineer", (l) => l.includes("pay point 1.1 (4 or 5 year degree)")),
  pp12: awardRow("engineer", (l) => l.includes("pay point 1.2")),
  pp13: awardRow("engineer", (l) => l.includes("pay point 1.3")),
  pp14: awardRow("engineer", (l) => l.includes("pay point 1.4")),
} as const;
/** NSW Health intern salary (IB2026_007), held in lib/data/graduate-salary. */
export const NSW_INTERN = GRADUATE_PROFESSIONS.find((p) => p.slug === "doctor")!.published!;

const TH80 = graduateTakeHome(80_000);
const TAX80 = calculatePayBreakdown({ grossSalary: 80_000, hasPrivateHealth: true });

export const GRADUATE_SALARY_FAQS: Faq[] = [
  {
    q: "What is the average graduate salary in Australia?",
    a: `The Government's 2025 Graduate Outcomes Survey (QILT) found the median salary of undergraduates working full-time four to six months after finishing was ${formatAUD(QILT_MEDIANS_2025.all, 0)}. It varies by field: ${formatAUD(QILT_MEDIANS_2025.medicine, 0)} for medicine, ${formatAUD(QILT_MEDIANS_2025.engineering, 0)} for engineering, ${formatAUD(QILT_MEDIANS_2025.teaching, 0)} for teacher education, ${formatAUD(QILT_MEDIANS_2025.law, 0)} for law, ${formatAUD(QILT_MEDIANS_2025.nursing, 0)} for nursing and ${formatAUD(QILT_MEDIANS_2025.business, 0)} for business and management. These are survey medians, not rates anyone must pay.`,
  },
  {
    q: "How much does a graduate lawyer earn in Australia?",
    a: `The Government's 2025 Graduate Outcomes Survey reports a median of ${formatAUD(QILT_MEDIANS_2025.law, 0)} for full-time law and paralegal studies undergraduates four to six months after graduating. The only legal minimum is the Legal Services Award for law graduates doing practical legal training in a private firm, at ${formatAUD(LAW_GRADUATE_ROW.hourly, 2)} an hour or about ${formatAUD(rowAnnual(LAW_GRADUATE_ROW), 0)} a year. Once admitted, a lawyer is award-free and pay comes from the employment contract. We do not publish firm salary bands because no official source does.`,
  },
  {
    q: "How much does a graduate nurse earn in Australia?",
    a: `The median full-time salary for nursing undergraduates in the 2025 Graduate Outcomes Survey was ${formatAUD(QILT_MEDIANS_2025.nursing, 0)}. Public-sector nurses are paid on state enterprise agreement scales. The first step of the registered nurse scale runs from about ${formatAUD(round100(NURSE_LOW), 0)} to about ${formatAUD(round100(NURSE_HIGH), 0)} full-time across the states listed on this page, before overtime, penalties and allowances.`,
  },
  {
    q: "How much does a graduate engineer earn in Australia?",
    a: `The Professional Employees Award sets a minimum of ${formatAUD(rowAnnual(ENGINEER_LEVEL1.pp11), 0)} a year for a graduate engineer with a 4 or 5-year degree recognised by Engineers Australia (Level 1, pay point 1.1). The 2025 Graduate Outcomes Survey median for engineering graduates in full-time work was ${formatAUD(QILT_MEDIANS_2025.engineering, 0)}, so at least half of engineering graduates in full-time work were paid well above the award minimum.`,
  },
  {
    q: "How much does a graduate accountant earn in Australia?",
    a: `Accountants are award-free, so the only legal floor is the National Minimum Wage. No official source publishes a graduate accountant scale. The closest official figure is the ${formatAUD(QILT_MEDIANS_2025.business, 0)} median for business and management graduates in full-time work (2025 Graduate Outcomes Survey), a broad group that includes accounting.`,
  },
  {
    q: "How much does a graduate teacher earn in Australia?",
    a: `Graduate teachers in public schools start on the first qualified step of their state's salary scale, from about ${formatAUD(round100(TEACHER_LOW.annual), 0)} in ${TEACHER_LOW.state} to ${formatAUD(round100(TEACHER_HIGH.annual), 0)} in ${TEACHER_HIGH.state} under the current agreements listed on this page. The 2025 Graduate Outcomes Survey median for teacher education graduates in full-time work was ${formatAUD(QILT_MEDIANS_2025.teaching, 0)}.`,
  },
  {
    q: "How much does an intern doctor earn in Australia?",
    a: `NSW Health pays interns ${formatAUD(NSW_INTERN.annual, 0)} a year from the first full pay period on or after 1 July 2025. This is an interim rate (Information Bulletin IB2026_007) while the NSW Industrial Relations Commission arbitrates the doctors' awards, and any further increase follows the Commission's final decision. The Medical Practitioners Award sets a lower national-system minimum of ${formatAUD(NMW_INTERN_AWARD_MINIMUM.annual, 0)} for employers such as private hospitals. The 2025 Graduate Outcomes Survey median for medicine graduates in full-time work was ${formatAUD(QILT_MEDIANS_2025.medicine, 0)}. Other states' intern salaries are not shown because we could not verify them from an official source.`,
  },
  {
    q: "How much of a graduate salary do you take home?",
    a: `On an ${formatAUD(TH80.gross, 0)} graduate salary, a resident takes home about ${formatAUD(TH80.net, 0)} a year, or ${formatAUD(TH80.netWeekly, 0)} a week, in 2026-27, before any HELP repayment. That is after about ${formatAUD(TAX80.netIncomeTax, 0)} income tax and ${formatAUD(TAX80.medicareLevy, 0)} Medicare levy. Your own figure changes with the salary, your HELP debt and your super arrangement. Use the take-home pay pages linked here for the nearest salary, and the HECS-HELP calculator if you have a debt.`,
  },
  {
    q: "Does super come on top of a graduate salary?",
    a: "If the offer says salary plus super, the employer adds 12% super on top of the salary. If it quotes a package or total remuneration, super is inside it, so the cash salary is lower. Ask which one applies before comparing offers.",
  },
  {
    q: "How is a graduate's HELP debt repaid?",
    a: `Compulsory HELP repayments come out through your employer's PAYG withholding once your income passes the threshold, using the 2026-27 marginal system. At ${formatAUD(TH80.gross, 0)} the repayment is about ${formatAUD(TH80.helpRepayment, 0)} a year, which the take-home table on this page shows separately. Use the HECS-HELP calculator to see your own figure.`,
  },
];
