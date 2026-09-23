import type { Metadata } from "next";
import { EMPLOYMENT, formatAUD, SITE_CONFIG } from "@/lib/constants/australian-tax";
import { SALARY_TO_HOURLY_SALARIES } from "@/lib/data/salary-pages";
import { SalaryHub } from "@/modules/programmatic/salary-hub";

// Hub for /salary-to-hourly/[amount]/ (Wave 3 / T6). Hourly figures use
// EMPLOYMENT.hoursPerYear, never a typed-in divisor.
const first = SALARY_TO_HOURLY_SALARIES[0];
const last = SALARY_TO_HOURLY_SALARIES[SALARY_TO_HOURLY_SALARIES.length - 1];
const hours = EMPLOYMENT.hoursPerYear;

const TITLE = `Annual Salary to Hourly Rate in Australia: ${formatAUD(first)} to ${formatAUD(last)} (${SITE_CONFIG.financialYear})`;
const DESCRIPTION = `Hourly rate for ${SALARY_TO_HOURLY_SALARIES.length} annual salaries on a ${EMPLOYMENT.standardWeeklyHours}-hour week (${hours.toLocaleString("en-AU")} hours a year). E.g. $80,000 a year is ${formatAUD(80_000 / hours, 2)} an hour before tax. After-tax hourly rate on each page.`;
const URL = `${SITE_CONFIG.baseUrl}/salary-to-hourly/`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
};

export default function SalaryToHourlyHubPage() {
  return (
    <SalaryHub
      copy={{
        family: "salary-to-hourly",
        h1: "Annual Salary to Hourly Rate",
        crumb: "Salary to Hourly",
        intro: (
          <p>
            {SALARY_TO_HOURLY_SALARIES.length} annual salaries converted to an hourly rate on a standard {EMPLOYMENT.standardWeeklyHours}-hour week
            ({hours.toLocaleString("en-AU")} hours a year). Each page adds the after-tax hourly rate, daily pay and a comparison with the minimum wage.
          </p>
        ),
        figure: (s) => `${formatAUD(s / hours, 2)}/hr`,
        figureLabel: `gross hourly rate on ${hours.toLocaleString("en-AU")} hours a year`,
        linkLabel: (s) => formatAUD(s),
      }}
      related={[
        { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Salary Calculator" },
        { href: "/take-home-pay-on/", label: "Take-home pay on every salary" },
        { href: "/salary-vs-hourly/", label: "Salary vs hourly pay" },
        { href: "/average-salary-australia/", label: "Average salary in Australia" },
      ]}
    />
  );
}
