import { formatAUD } from "@/lib/constants";
import { NMW_INTERN_AWARD_MINIMUM, QILT_MEDIANS_2025, nurseStarts, teacherStarts } from "@/lib/data/graduate-salary";
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

export const GRADUATE_SALARY_FAQS: Faq[] = [
  {
    q: "What is the average graduate salary in Australia?",
    a: `The Government's 2025 Graduate Outcomes Survey (QILT) found the median salary of undergraduates working full-time four to six months after finishing was ${formatAUD(QILT_MEDIANS_2025.all, 0)}. It varies by field: ${formatAUD(QILT_MEDIANS_2025.medicine, 0)} for medicine, ${formatAUD(QILT_MEDIANS_2025.engineering, 0)} for engineering, ${formatAUD(QILT_MEDIANS_2025.teaching, 0)} for teacher education, ${formatAUD(QILT_MEDIANS_2025.law, 0)} for law, ${formatAUD(QILT_MEDIANS_2025.nursing, 0)} for nursing and ${formatAUD(QILT_MEDIANS_2025.business, 0)} for business and management. These are survey medians, not rates anyone must pay.`,
  },
  {
    q: "How much does a graduate lawyer earn in Australia?",
    a: `The Government's 2025 Graduate Outcomes Survey reports a median of ${formatAUD(QILT_MEDIANS_2025.law, 0)} for full-time law and paralegal studies undergraduates four to six months after graduating. The only legal minimum is the Legal Services Award for law graduates doing practical legal training in a private firm, at $33.99 an hour or about $67,174 a year; once admitted a lawyer is award-free and pay comes from the contract. We do not publish firm salary bands because no official source does.`,
  },
  {
    q: "How much does a graduate nurse earn in Australia?",
    a: `The median full-time salary for nursing undergraduates in the 2025 Graduate Outcomes Survey was ${formatAUD(QILT_MEDIANS_2025.nursing, 0)}. Public-sector nurses are paid on state enterprise agreement scales, and the first step of the registered nurse scale in each state is listed on this page, from about ${formatAUD(round100(NURSE_LOW), 0)} to about ${formatAUD(round100(NURSE_HIGH), 0)} on a full-time basis before overtime, penalties and allowances.`,
  },
  {
    q: "How much does a graduate engineer earn in Australia?",
    a: `The Professional Employees Award sets a minimum of $68,538 a year for a graduate engineer with a 4 or 5-year degree recognised by Engineers Australia (Level 1, pay point 1.1). The 2025 Graduate Outcomes Survey median for engineering graduates in full-time work was ${formatAUD(QILT_MEDIANS_2025.engineering, 0)}, so many employers pay well above the award.`,
  },
  {
    q: "How much does a graduate accountant earn in Australia?",
    a: `Accountants are award-free, so the only legal floor is the National Minimum Wage. No official source publishes a graduate accountant scale. The closest official figure is the ${formatAUD(QILT_MEDIANS_2025.business, 0)} median for business and management graduates in full-time work (2025 Graduate Outcomes Survey), a broad group that includes accounting.`,
  },
  {
    q: "How much does a graduate teacher earn in Australia?",
    a: `Public-school graduates start on the first qualified step of their state's salary scale, which ranges from about ${formatAUD(round100(TEACHER_LOW.annual), 0)} in ${TEACHER_LOW.state} to ${formatAUD(round100(TEACHER_HIGH.annual), 0)} in ${TEACHER_HIGH.state} in the current agreements listed on this page. The 2025 Graduate Outcomes Survey median for teacher education graduates in full-time work was ${formatAUD(QILT_MEDIANS_2025.teaching, 0)}.`,
  },
  {
    q: "How much does an intern doctor earn in Australia?",
    a: `NSW Health pays interns $80,638 a year from the first full pay period on or after 1 July 2025, an interim rate that may have been updated. The Medical Practitioners Award sets a lower national-system minimum of ${formatAUD(NMW_INTERN_AWARD_MINIMUM.annual, 0)} for employers such as private hospitals. The 2025 Graduate Outcomes Survey median for medicine graduates in full-time work was ${formatAUD(QILT_MEDIANS_2025.medicine, 0)}. Other states' intern salaries are not shown because we could not verify them from an official source.`,
  },
  {
    q: "How much of a graduate salary do you take home?",
    a: "It depends on the salary, your HELP debt and super arrangement. On $80,000 a resident pays about $14,520 in income tax and $1,600 Medicare levy in 2026-27, leaving about $63,880 a year, or $1,228 a week, before any HELP repayment. Use the take-home pay pages linked here for the nearest salary, and the HECS-HELP calculator if you have a debt.",
  },
  {
    q: "Does super come on top of a graduate salary?",
    a: "If the offer says salary plus super, the employer adds 12% super on top of the salary. If it quotes a package or total remuneration, super is inside it, so the cash salary is lower. Ask which one applies before comparing offers.",
  },
  {
    q: "How is a graduate's HELP debt repaid?",
    a: "Compulsory HELP repayments come out through your employer's PAYG withholding once your income passes the threshold, using the 2026-27 marginal system. At $80,000 the repayment is about $1,571 a year, which the take-home table on this page shows separately. Use the HECS-HELP calculator to see your own figure.",
  },
];
