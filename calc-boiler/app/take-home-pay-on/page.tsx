import type { Metadata } from "next";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants/australian-tax";
import { TAKE_HOME_SALARIES } from "@/lib/data/salary-pages";
import { SalaryHub } from "@/modules/programmatic/salary-hub";

// Hub for /take-home-pay-on/[salary]/ (Wave 3 / T6). Every figure is computed
// from the tax engine at build time.
const first = TAKE_HOME_SALARIES[0];
const last = TAKE_HOME_SALARIES[TAKE_HOME_SALARIES.length - 1];
const example = calculatePayBreakdown({ grossSalary: 100_000 });

const TITLE = `Salary After Tax in Australia: Take-Home Pay on ${TAKE_HOME_SALARIES.length} Salaries (${SITE_CONFIG.financialYear})`;
const DESCRIPTION = `Take-home pay after tax for every salary from ${formatAUD(first)} to ${formatAUD(last)} in ${SITE_CONFIG.financialYear}, in $1,000 steps from $40k to $150k. E.g. $100,000 after tax is ${formatAUD(example.takeHomePay)}. Weekly, fortnightly and monthly on each page.`;
const URL = `${SITE_CONFIG.baseUrl}/take-home-pay-on/`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
};

export default function TakeHomePayHubPage() {
  return (
    <SalaryHub
      copy={{
        family: "take-home",
        h1: "Salary After Tax in Australia",
        crumb: "Take-Home Pay by Salary",
        intro: (
          <p>
            Take-home pay for {TAKE_HOME_SALARIES.length} salaries from {formatAUD(first)} to {formatAUD(last)} on {SITE_CONFIG.financialYear} rates — every
            $1,000 from $40,000 to $150,000. Pick a salary for the weekly, fortnightly and monthly figures, the HECS-HELP case and super.
          </p>
        ),
        figure: (s) => formatAUD(calculatePayBreakdown({ grossSalary: s }).takeHomePay),
        figureLabel: "take-home pay a year after income tax and Medicare levy",
        linkLabel: (s) => formatAUD(s),
      }}
      related={[
        { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator (any salary)" },
        { href: "/tax-on/", label: "Tax on every salary" },
        { href: "/salary-to-hourly/", label: "Every salary as an hourly rate" },
        { href: "/average-salary-australia/", label: "Average salary in Australia" },
        { href: "/tax-brackets/", label: `Tax brackets ${SITE_CONFIG.financialYear}` },
      ]}
    />
  );
}
