// Shared FAQ copy for /salary-package-calculator/.
//
// Read by the rendered accordion, its crawlable mirror and the FAQPage JSON-LD
// in app/salary-package-calculator/page.tsx. Every figure comes from
// splitPackage / packageFromBase and calculatePayBreakdown, so the answers
// cannot disagree with the calculator above them.

import { calculatePayBreakdown, formatAUD, formatPercent, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants";
import { packageFromBase, splitPackage } from "@/lib/constants/salary-package";

const RATE = formatPercent(SUPER_GUARANTEE.rate, 0);
const P100 = splitPackage(100_000);
const B100 = packageFromBase(100_000);
const P75 = splitPackage(75_000);
const B90 = packageFromBase(90_000);
const TH_PACKAGE = calculatePayBreakdown({ grossSalary: P100.base });
const TH_BASE = calculatePayBreakdown({ grossSalary: 100_000 });

export interface SalaryPackageFaq {
  q: string;
  a: string;
}

export const SALARY_PACKAGE_FAQS: readonly SalaryPackageFaq[] = [
  {
    q: "How do I calculate superannuation from a total package?",
    a: `Divide the package by 1 + the super guarantee rate (${RATE}), which gives the base salary; the rest is super. A ${formatAUD(100_000)} package is ${formatAUD(P100.base)} base plus ${formatAUD(P100.superAmount)} super. The ${RATE} applies to the base, not to the package, so the super inside a package is a little under ${RATE} of the package figure.`,
  },
  {
    q: "How do I work out base salary from a package including super?",
    a: `Base salary = package ÷ ${(1 + SUPER_GUARANTEE.rate).toFixed(2)}. On ${formatAUD(112_000)} including super that is ${formatAUD(splitPackage(112_000).base)}. Tax is worked out on the base — the super goes to your fund, not your bank account — so the base is the number to put into a take-home pay calculator.`,
  },
  {
    q: "What does 'plus super' mean in a job ad?",
    a: `The figure quoted is your base salary and the employer pays ${RATE} super on top of it. ${formatAUD(90_000)} plus super is a ${formatAUD(B90.total)} package (${formatAUD(B90.superAmount)} of super). It is worth more than the same number quoted as a package.`,
  },
  {
    q: "What does 'package' or 'including super' mean?",
    a: `The figure already contains the employer's super. ${formatAUD(75_000)} including super is a base of ${formatAUD(P75.base)} with ${formatAUD(P75.superAmount)} going to super — so the salary you are taxed on and paid from is ${formatAUD(75_000 - P75.base)} less than the headline.`,
  },
  {
    q: "Is $100,000 package the same as $100,000 plus super?",
    a: `No. ${formatAUD(100_000)} plus super is a ${formatAUD(B100.total)} package. ${formatAUD(100_000)} package is ${formatAUD(P100.base)} base. The gap is ${formatAUD(B100.total - 100_000)} a year in total remuneration, and about ${formatAUD(TH_BASE.takeHomePay - TH_PACKAGE.takeHomePay)} a year in take-home pay (${formatAUD(TH_BASE.takeHomePay)} versus ${formatAUD(TH_PACKAGE.takeHomePay)} after tax in ${SITE_CONFIG.financialYear}).`,
  },
  {
    q: "Is super included in salary in Australia?",
    a: `Usually not unless the offer says so. Awards, enterprise agreements and most job ads quote a base salary with super paid on top. If an offer says "package", "total remuneration" or "including super", the ${RATE} is inside the number. If it is not clear, ask which it is before you accept — on ${formatAUD(90_000)} the difference is ${formatAUD(B90.superAmount)} a year.`,
  },
  {
    q: "Does the super guarantee rate apply to the package or the base?",
    a: `To the base. The ${RATE} is calculated on ordinary time earnings, and the package is simply base plus that super. That is why splitting a package uses ÷${(1 + SUPER_GUARANTEE.rate).toFixed(2)} rather than taking ${RATE} off the top.`,
  },
  {
    q: "Does the super cap change the split for high packages?",
    a: `Yes, above the maximum super contribution base of ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year (${SITE_CONFIG.financialYear}, annual under Payday Super). Employers do not have to pay SG on base salary above it, so the super inside a very large package is capped at ${formatAUD(SUPER_GUARANTEE.maxSGAnnual)} and everything else is base. Below the cap the plain ÷${(1 + SUPER_GUARANTEE.rate).toFixed(2)} split applies.`,
  },
];
