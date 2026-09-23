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
  grossPayCalculator: { href: "/gross-pay-calculator/", anchor: "gross pay calculator" },
  salaryAfterTaxCalculator: { href: "/annual-pay-calculator/", anchor: "salary after tax calculator" },
} as const;
