// Kept out of head-term-ui.tsx ("use client") so server components can read
// the intent map without importing a client module (a client module's plain
// exports are opaque references on the server).

/** One primary URL per head term (the intent map). Anchors are exact-match. */
export const HEAD_TERM_PRIMARY = {
  payCalculatorAustralia: { href: "/", anchor: "pay calculator Australia" },
  salaryCalculator: { href: "/", anchor: "salary calculator" },
  takeHomePayCalculator: { href: "/take-home-pay-calculator/", anchor: "take home pay calculator" },
  netPayCalculator: { href: "/take-home-pay-calculator/", anchor: "net pay calculator" },
  afterTaxIncomeCalculator: { href: "/take-home-pay-calculator/", anchor: "after tax income calculator" },
  incomeTaxCalculator: { href: "/income-tax-calculator/", anchor: "income tax calculator" },
  taxCalculatorAustralia: { href: "/income-tax-calculator/", anchor: "tax calculator Australia" },
  weeklyTaxCalculator: { href: "/weekly-pay-calculator/", anchor: "weekly tax calculator" },
  fortnightlyTaxCalculator: { href: "/fortnightly-pay-calculator/", anchor: "fortnightly tax calculator" },
  // Sep 2026: /weekly-pay-calculator/ and /fortnightly-pay-calculator/ were not
  // in the top 20 for their own "… pay calculator" queries (the homepage ranked
  // instead), so these anchors join the tax anchors above. Same primary URLs.
  weeklyPayCalculator: { href: "/weekly-pay-calculator/", anchor: "weekly pay calculator" },
  fortnightlyPayCalculator: { href: "/fortnightly-pay-calculator/", anchor: "fortnightly pay calculator" },
  grossPayCalculator: { href: "/gross-pay-calculator/", anchor: "gross pay calculator" },
  salaryAfterTaxCalculator: { href: "/annual-pay-calculator/", anchor: "salary after tax calculator" },
} as const;
