import type { Metadata } from "next";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants/australian-tax";
import { TAX_ON_SALARIES } from "@/lib/data/salary-pages";
import { SalaryHub } from "@/modules/programmatic/salary-hub";

// Hub for /tax-on/[salary]/ (Wave 3 / T6). Every figure is computed from the
// tax engine at build time.
const first = TAX_ON_SALARIES[0];
const last = TAX_ON_SALARIES[TAX_ON_SALARIES.length - 1];
const example = calculatePayBreakdown({ grossSalary: 80_000 });

const TITLE = `Tax on Every Salary in Australia: ${formatAUD(first)} to ${formatAUD(last)} (${SITE_CONFIG.financialYear})`;
const DESCRIPTION = `Income tax and Medicare levy on ${TAX_ON_SALARIES.length} salaries from ${formatAUD(first)} to ${formatAUD(last)} for ${SITE_CONFIG.financialYear}. E.g. tax on $80,000 is ${formatAUD(example.netIncomeTax)} plus ${formatAUD(example.medicareLevy)} Medicare. Bracket by bracket.`;
const URL = `${SITE_CONFIG.baseUrl}/tax-on/`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
};

export default function TaxOnHubPage() {
  return (
    <SalaryHub
      copy={{
        family: "tax-on",
        h1: "Tax on Every Salary in Australia",
        crumb: "Tax on Salary",
        intro: (
          <p>
            Income tax on {TAX_ON_SALARIES.length} salaries from {formatAUD(first)} to {formatAUD(last)} at {SITE_CONFIG.financialYear} resident rates. Each page
            splits the bill bracket by bracket, shows LITO, the Medicare levy and surcharge, HECS-HELP and what the next $1,000 is taxed at.
          </p>
        ),
        figure: (s) => formatAUD(calculatePayBreakdown({ grossSalary: s }).netIncomeTax),
        figureLabel: "income tax a year after LITO (Medicare levy shown on each page)",
        linkLabel: (s) => formatAUD(s),
      }}
      related={[
        { href: "/income-tax-calculator/", label: "Income Tax Calculator (any salary)" },
        { href: "/take-home-pay-on/", label: "Take-home pay on every salary" },
        { href: "/tax-brackets/", label: `Tax brackets ${SITE_CONFIG.financialYear}` },
        { href: "/average-salary-australia/", label: "Average salary in Australia" },
        { href: "/medicare-levy/", label: "Medicare levy" },
      ]}
    />
  );
}
