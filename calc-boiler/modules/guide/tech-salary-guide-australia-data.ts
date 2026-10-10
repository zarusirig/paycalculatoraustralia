// Figures shared by /tech-salary-guide-australia/ and its FAQ (and so its
// FAQPage JSON-LD). Nothing here is typed in by hand: occupation medians are
// read from the /job-pay-rates/ spokes' ATO Taxation statistics 2023–24 data,
// and the contractor day rates are computed with lib/constants/contractor-rate.

import {
  salaryToContractorDayRate,
  type ContractorSalaryAssumptions,
} from "@/lib/constants/contractor-rate";
import { BUSINESS_ANALYST_ATO } from "@/lib/data/job-pay-rates/business-analyst";
import { CYBER_SECURITY_ATO } from "@/lib/data/job-pay-rates/cyber-security";
import { DATA_ANALYST_ATO } from "@/lib/data/job-pay-rates/data-analyst";
import { PROJECT_MANAGER_ATO } from "@/lib/data/job-pay-rates/project-manager";
import { SOFTWARE_ENGINEER_ATO } from "@/lib/data/job-pay-rates/software-engineer";
import type { AtoOccupationStats } from "@/lib/data/job-pay-rates/types";

// ---------------------------------------------------------------------------
// ATO occupation medians (Taxation statistics 2023–24, Individuals Table 15A)
// ---------------------------------------------------------------------------

const SPOKES: { stats: AtoOccupationStats; href: string; label: string }[] = [
  { stats: SOFTWARE_ENGINEER_ATO, href: "/job-pay-rates/software-engineer/", label: "Software engineer salary" },
  { stats: CYBER_SECURITY_ATO, href: "/job-pay-rates/cyber-security/", label: "Cyber security salary" },
  { stats: DATA_ANALYST_ATO, href: "/job-pay-rates/data-analyst/", label: "Data analyst salary" },
  { stats: BUSINESS_ANALYST_ATO, href: "/job-pay-rates/business-analyst/", label: "Business analyst salary" },
  { stats: PROJECT_MANAGER_ATO, href: "/job-pay-rates/project-manager/", label: "Project manager salary" },
];

/**
 * Data analyst (224114) and data scientist (224115) sit outside the ICT
 * occupation codes but are the data roles the hub covers. Statistician
 * (224116) shares their spoke and is left out, as are the construction project
 * manager (133111) and program administrator (511112) rows on the project
 * manager spoke.
 */
const DATA_ROLE_CODES = new Set(["224114", "224115"]);

/** ICT professionals (26xxxx) and ICT managers (1351xx), plus the two data roles. */
function isTechRow(code: string): boolean {
  return code.startsWith("26") || code.startsWith("1351") || DATA_ROLE_CODES.has(code);
}

export interface TechRoleRow {
  code: string;
  title: string;
  individuals: number;
  medianSalary: number;
  href: string;
  label: string;
}

/** Every tech row the five spokes carry, highest median first. */
export const TECH_ROLE_ROWS: readonly TechRoleRow[] = SPOKES.flatMap(({ stats, href, label }) =>
  stats.rows
    .filter((r) => isTechRow(r.code))
    .map((r) => ({ code: r.code, title: r.title, individuals: r.individuals, medianSalary: r.medianSalary, href, label })),
).sort((a, b) => b.medianSalary - a.medianSalary);

export const TECH_INCOME_YEAR = SOFTWARE_ENGINEER_ATO.incomeYear;

// ---------------------------------------------------------------------------
// Contractor day rate that matches an employee package — our calculation.
// ---------------------------------------------------------------------------

/**
 * 230 billable days: 260 weekdays less 4 weeks' annual leave (20 days) and
 * 10 weekday public holidays, with no sick days and no gap between contracts.
 * Everything else is the contractor-rate defaults ($1,500 insurance and
 * $1,500 accounting and admin a year, SG at the current rate).
 */
export const DAYS_230: Partial<ContractorSalaryAssumptions> = { personalLeaveDays: 0, downtimeDays: 0 };

export const DAY_RATE_SALARIES = [110_000, 150_000] as const;

/** Day rate over 230 billable days for each salary. */
export const DAY_RATE_EXAMPLES = DAY_RATE_SALARIES.map((s) => salaryToContractorDayRate(s, DAYS_230));

/** The same salaries at the contractor calculator's default 210 billable days. */
export const DAY_RATE_EXAMPLES_DEFAULT_DAYS = DAY_RATE_SALARIES.map((s) => salaryToContractorDayRate(s));
