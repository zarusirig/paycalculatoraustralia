export type NavigationItem = {
  href: string;
  label: string;
  hasMegaMenu?: boolean;
};

export type NavigationLogo = {
  href: string;
  label: string;
};

export const navigationLogo: NavigationLogo = {
  href: "/",
  label: "Pay Calculator Australia",
};

export const navigationItems: NavigationItem[] = [
  { href: "/", label: "Pay Calculator" },
  { href: "/income-tax-calculator/", label: "Tax Calculator" },
  { href: "/superannuation-calculator/", label: "Super Calculator" },
  { href: "/take-home-pay-calculator/", label: "Take-Home Pay" },
  { href: "/news/", label: "News" },
  { href: "#", label: "Tax on Salary", hasMegaMenu: true },
  { href: "#", label: "Guides", hasMegaMenu: true },
  { href: "#", label: "By State", hasMegaMenu: true },
];

// ===== Mega menu content =====

export const CALCULATOR_CATEGORIES = [
  {
    title: "Core Calculators",
    calculators: [
      { href: "/income-tax-calculator/", label: "Income Tax Calculator", description: "Calculate your income tax with bracket breakdown" },
      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator", description: "See your net pay after all deductions" },
      { href: "/superannuation-calculator/", label: "Superannuation Calculator", description: "Calculate employer SG contributions at 12%" },
      { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator", description: "Compare pay before and after sacrifice" },
      { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator", description: "Marginal repayment system, FY2026-27 thresholds" },
    ],
  },
  {
    title: "Specialist Calculators",
    calculators: [
      { href: "/pay-rise-calculator/", label: "Pay Rise Calculator", description: "See how much extra you actually take home" },
      { href: "/redundancy-pay-calculator/", label: "Redundancy Pay Calculator", description: "Entitlements and tax on redundancy" },
      { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee", description: "Side-by-side pay comparison" },
      { href: "/gross-pay-calculator/", label: "Gross Pay Calculator", description: "Gross to net and net to gross" },
      { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Converter", description: "Convert between any pay frequency" },
      { href: "/contractor-pay-calculator/", label: "Contractor Pay Calculator", description: "ABN workers, freelancers & gig economy rates" },
      { href: "/employer-cost-calculator/", label: "Employer Cost Calculator", description: "True cost beyond salary" },
      { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator", description: "Tax on bonuses and lump sum payments" },
      { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator", description: "Overtime and penalty rate pay" },
      { href: "/leave-calculator/", label: "Leave Calculator", description: "Annual leave entitlements and payout" },
      { href: "/tax-return-calculator/", label: "Tax Return Calculator", description: "Estimate your tax refund" },
      { href: "/second-job-tax-calculator/", label: "Second Job Tax Calculator", description: "Tax on multiple jobs" },
      { href: "/final-pay-calculator/", label: "Final Pay Calculator", description: "End of employment payout" },
      { href: "/employment-type-calculator/", label: "Employment Type Calculator", description: "Compare FT vs PT vs casual" },
      { href: "/backpay-calculator/", label: "Backpay Calculator", description: "Underpayment and arrears" },
      { href: "/payslip-generator/", label: "Payslip Generator", description: "Create a compliant payslip free" },
      { href: "/ytd-income-calculator/", label: "YTD Income Calculator", description: "Year-to-date pay and annualised income" },
    ],
  },
  {
    title: "Pay Frequency",
    calculators: [
      { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator", description: "Take-home pay per week" },
      { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator", description: "Net pay every two weeks" },
      { href: "/monthly-pay-calculator/", label: "Monthly Pay Calculator", description: "Net salary per month" },
      { href: "/annual-pay-calculator/", label: "Annual Pay Calculator", description: "Yearly take-home pay summary" },
    ],
  },
] as const;

export const GUIDE_CATEGORIES = [
  {
    title: "Tax & Deductions",
    guides: [
      { href: "/tax-brackets/", label: "Tax Brackets", description: "Income tax rates and thresholds" },
      { href: "/medicare-levy/", label: "Medicare Levy Guide", description: "Rate, surcharge and exemptions" },
      { href: "/low-income-tax-offset/", label: "Low Income Tax Offset (LITO)", description: "Up to $700 tax reduction" },
      { href: "/payg-withholding-tables/", label: "PAYG Withholding Tables", description: "Weekly, fortnightly and monthly tables" },
      { href: "/weekly-tax-table/", label: "Weekly Tax Table", description: "ATO weekly withholding amounts" },
      { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table", description: "ATO fortnightly withholding amounts" },
      { href: "/bonus-tax-guide/", label: "Bonus Tax Guide", description: "How bonuses are taxed in Australia" },
      { href: "/tax-refund-guide/", label: "Tax Refund Guide", description: "Maximise your tax return" },
      { href: "/tax-calendar/", label: "Tax Calendar", description: "Key ATO dates and deadlines" },
      { href: "/fringe-benefits-tax/", label: "Fringe Benefits Tax (FBT)", description: "Employer-provided benefits tax" },
    ],
  },
  {
    title: "Super & Salary",
    guides: [
      { href: "/superannuation-guide/", label: "Superannuation Guide", description: "How super works in Australia" },
      { href: "/salary-sacrifice-guide/", label: "Salary Sacrifice Guide", description: "Tax savings and FBT" },
      { href: "/hecs-help-guide/", label: "HECS-HELP Guide", description: "New marginal repayment system explained" },
      { href: "/novated-lease-guide/", label: "Novated Lease Guide", description: "Salary packaging a car" },
    ],
  },
  {
    title: "Employment & Pay",
    guides: [
      { href: "/understanding-your-payslip/", label: "Understanding Your Payslip", description: "What every deduction means" },
      { href: "/award-rates/", label: "Award Rates", description: "Minimum wage and penalty rates" },
      { href: "/contractor-vs-employee/", label: "Contractor vs Employee Guide", description: "Key differences, tax and super" },
      { href: "/redundancy-pay-guide/", label: "Redundancy Pay Guide", description: "NES entitlements and tax" },
      { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates", description: "Weekend, evening and public holiday rates" },
      { href: "/annual-leave-guide/", label: "Annual Leave Guide", description: "Entitlements and loading" },
    ],
  },
  {
    // Per-award rate pages. The /award-rates/ hub is the parent; each child
    // owns one award's classification table so no two pages compete for the
    // same term. Rates derive from lib/constants/schads-award.ts,
    // hospitality-award.ts and junior-rates.ts — never hardcoded here.
    title: "Award Pay Rates",
    guides: [
      { href: "/award-rates/", label: "Award Rates Hub", description: "How modern awards set minimum pay" },
      { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates", description: "Social, community, home care & disability" },
      { href: "/hospitality-award-rates/", label: "Hospitality Award Rates", description: "Cafes, restaurants, pubs & hotels" },
      { href: "/retail-award-rates/", label: "Retail Award Rates", description: "General Retail Industry Award levels 1–8" },
      { href: "/junior-pay-rates/", label: "Junior Pay Rates", description: "Minimum wage by age, 16 to 20" },
      { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates by Award", description: "Weekend, evening and public holiday loadings" },
    ],
  },
  {
    title: "Special Situations",
    guides: [
      { href: "/working-holiday-tax/", label: "Working Holiday Tax", description: "Tax rates for 417 & 462 visa holders" },
      { href: "/non-resident-tax/", label: "Non-Resident Tax", description: "Foreign resident tax rates" },
      { href: "/centrelink-income-test/", label: "Centrelink Income Test", description: "Payment thresholds and taper rates" },
      { href: "/parental-leave-pay/", label: "Parental Leave Pay", description: "Government-funded parental leave" },
      { href: "/zone-tax-offset/", label: "Zone Tax Offset", description: "Remote area tax concessions" },
      { href: "/sapto-calculator/", label: "SAPTO Calculator", description: "Seniors and pensioners tax offset" },
    ],
  },
  {
    title: "Money & Deductions",
    guides: [
      { href: "/tax-deductions-guide/", label: "Tax Deductions Guide", description: "Work-related deductions explained" },
      { href: "/work-from-home-deductions/", label: "WFH Deductions", description: "Fixed rate & actual cost methods" },
      { href: "/stage-3-tax-cuts/", label: "Stage 3 Tax Cuts", description: "Before & after comparison" },
      { href: "/private-health-insurance-medicare/", label: "PHI & Medicare", description: "Surcharge decision guide" },
      { href: "/division-293-tax/", label: "Division 293 Tax", description: "Extra super tax for high earners" },
      { href: "/salary-packaging-guide/", label: "Salary Packaging", description: "Beyond novated leases" },
    ],
  },
  {
    title: "Getting Started",
    guides: [
      { href: "/first-job-pay-guide/", label: "First Job Guide", description: "Tax, super & your first payslip" },
      { href: "/new-job-checklist/", label: "New Job Checklist", description: "TFN, super & pay setup" },
      { href: "/gig-economy-pay-guide/", label: "Gig Economy Guide", description: "Uber, delivery & freelancer tax" },
      { href: "/tax-file-number-declaration/", label: "TFN Declaration", description: "How to fill it in correctly" },
      { href: "/notice-of-assessment/", label: "Notice of Assessment", description: "Read your ATO assessment" },
      { href: "/employee-vs-sole-trader-vs-company/", label: "Business Structure", description: "Employee vs sole trader vs company" },
    ],
  },
  {
    title: "Industry Pay Guides",
    guides: [
      { href: "/average-salary-australia/", label: "Average Salary Australia", description: "By industry, state & experience" },
      { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO Pay", description: "Salaries, rosters & allowances" },
      { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay", description: "Nurses, doctors & allied health" },
      { href: "/teacher-pay-australia/", label: "Teacher Pay", description: "Salary by state & classification" },
      { href: "/retail-hospitality-pay-guide/", label: "Retail & Hospitality", description: "Award rates & penalties" },
      { href: "/tech-salary-guide-australia/", label: "IT & Tech Salaries", description: "Developer, engineer & PM pay" },
      { href: "/construction-trades-pay/", label: "Construction & Trades", description: "Apprentice & tradie rates" },
    ],
  },
] as const;

export const STATE_CATEGORIES = [
  {
    title: "Pay Calculator by State",
    states: [
      { href: "/pay-calculator-nsw/", label: "NSW", description: "Sydney & New South Wales" },
      { href: "/pay-calculator-vic/", label: "Victoria", description: "Melbourne & VIC" },
      { href: "/pay-calculator-qld/", label: "Queensland", description: "Brisbane & QLD" },
      { href: "/pay-calculator-wa/", label: "Western Australia", description: "Perth & WA" },
      { href: "/pay-calculator-sa/", label: "South Australia", description: "Adelaide & SA" },
      { href: "/pay-calculator-tas/", label: "Tasmania", description: "Hobart & TAS" },
      { href: "/pay-calculator-act/", label: "ACT", description: "Canberra & ACT" },
      { href: "/pay-calculator-nt/", label: "Northern Territory", description: "Darwin & NT" },
    ],
  },
] as const;

export const TAX_ON_SALARY_CATEGORIES = [
  {
    title: "$30K – $50K",
    salaries: [
      { href: "/tax-on/30000/", label: "Tax on $30,000", description: "Entry-level & part-time" },
      { href: "/tax-on/35000/", label: "Tax on $35,000" },
      { href: "/tax-on/40000/", label: "Tax on $40,000" },
      { href: "/tax-on/45000/", label: "Tax on $45,000" },
      { href: "/tax-on/50000/", label: "Tax on $50,000", description: "Median part-time salary" },
    ],
  },
  {
    title: "$55K – $75K",
    salaries: [
      { href: "/tax-on/55000/", label: "Tax on $55,000" },
      { href: "/tax-on/60000/", label: "Tax on $60,000" },
      { href: "/tax-on/65000/", label: "Tax on $65,000", description: "Near national median" },
      { href: "/tax-on/70000/", label: "Tax on $70,000" },
      { href: "/tax-on/75000/", label: "Tax on $75,000" },
    ],
  },
  {
    title: "$80K – $100K",
    salaries: [
      { href: "/tax-on/80000/", label: "Tax on $80,000" },
      { href: "/tax-on/85000/", label: "Tax on $85,000" },
      { href: "/tax-on/90000/", label: "Tax on $90,000" },
      { href: "/tax-on/95000/", label: "Tax on $95,000" },
      { href: "/tax-on/100000/", label: "Tax on $100,000", description: "Six-figure threshold" },
    ],
  },
  {
    title: "$105K – $130K",
    salaries: [
      { href: "/tax-on/105000/", label: "Tax on $105,000" },
      { href: "/tax-on/110000/", label: "Tax on $110,000" },
      { href: "/tax-on/115000/", label: "Tax on $115,000" },
      { href: "/tax-on/120000/", label: "Tax on $120,000" },
      { href: "/tax-on/125000/", label: "Tax on $125,000" },
      { href: "/tax-on/130000/", label: "Tax on $130,000" },
    ],
  },
  {
    title: "$135K – $165K",
    salaries: [
      { href: "/tax-on/135000/", label: "Tax on $135,000" },
      { href: "/tax-on/140000/", label: "Tax on $140,000" },
      { href: "/tax-on/145000/", label: "Tax on $145,000" },
      { href: "/tax-on/150000/", label: "Tax on $150,000" },
      { href: "/tax-on/155000/", label: "Tax on $155,000" },
      { href: "/tax-on/160000/", label: "Tax on $160,000" },
      { href: "/tax-on/165000/", label: "Tax on $165,000" },
    ],
  },
  {
    title: "$170K – $200K",
    salaries: [
      { href: "/tax-on/170000/", label: "Tax on $170,000" },
      { href: "/tax-on/175000/", label: "Tax on $175,000" },
      { href: "/tax-on/180000/", label: "Tax on $180,000", description: "Top tax bracket" },
      { href: "/tax-on/185000/", label: "Tax on $185,000" },
      { href: "/tax-on/190000/", label: "Tax on $190,000" },
      { href: "/tax-on/195000/", label: "Tax on $195,000" },
      { href: "/tax-on/200000/", label: "Tax on $200,000" },
    ],
  },
] as const;

// Footer links — organised in 3 columns
export const FOOTER_CALCULATORS = [
  { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
  { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
  { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
  { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator" },
  { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
  { href: "/pay-rise-calculator/", label: "Pay Rise Calculator" },
  { href: "/redundancy-pay-calculator/", label: "Redundancy Pay Calculator" },
  { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee" },
  { href: "/gross-pay-calculator/", label: "Gross Pay Calculator" },
  { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Converter" },
  { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
  { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator" },
  { href: "/monthly-pay-calculator/", label: "Monthly Pay Calculator" },
  { href: "/annual-pay-calculator/", label: "Annual Pay Calculator" },
  { href: "/employer-cost-calculator/", label: "Employer Cost Calculator" },
  { href: "/contractor-pay-calculator/", label: "Contractor Pay Calculator" },
  { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator" },
  { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
  { href: "/leave-calculator/", label: "Leave Calculator" },
  { href: "/tax-return-calculator/", label: "Tax Return Calculator" },
  { href: "/second-job-tax-calculator/", label: "Second Job Tax Calculator" },
  { href: "/final-pay-calculator/", label: "Final Pay Calculator" },
  { href: "/employment-type-calculator/", label: "Employment Type Calculator" },
  { href: "/backpay-calculator/", label: "Backpay Calculator" },
  { href: "/payslip-generator/", label: "Payslip Generator" },
  { href: "/ytd-income-calculator/", label: "YTD Income Calculator" },
] as const;

// Footer guides — split into logical groups for multi-column layout
export const FOOTER_GUIDES_TAX = [
  { href: "/tax-brackets/", label: "Tax Brackets" },
  { href: "/medicare-levy/", label: "Medicare Levy" },
  { href: "/low-income-tax-offset/", label: "Low Income Tax Offset" },
  { href: "/payg-withholding-tables/", label: "PAYG Withholding Tables" },
  { href: "/weekly-tax-table/", label: "Weekly Tax Table" },
  { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table" },
  { href: "/monthly-tax-table/", label: "Monthly Tax Table" },
  { href: "/schedule-5-tax-table/", label: "Schedule 5 Tax Table" },
  { href: "/tax-deductions-guide/", label: "Tax Deductions Guide" },
  { href: "/work-from-home-deductions/", label: "WFH Deductions" },
  { href: "/tax-refund-guide/", label: "Tax Refund Guide" },
  { href: "/bonus-tax-guide/", label: "Bonus Tax Guide" },
  { href: "/stage-3-tax-cuts/", label: "Stage 3 Tax Cuts" },
  { href: "/tax-changes-2026-27/", label: "FY2026-27 Tax Changes" },
  { href: "/tax-bracket-history/", label: "Tax Bracket History" },
  { href: "/tax-calendar/", label: "Tax Calendar" },
  { href: "/tax-file-number-declaration/", label: "TFN Declaration" },
  { href: "/notice-of-assessment/", label: "Notice of Assessment" },
  { href: "/private-health-insurance-medicare/", label: "PHI & Medicare" },
  { href: "/fringe-benefits-tax/", label: "Fringe Benefits Tax" },
] as const;

export const FOOTER_GUIDES_SUPER_PAY = [
  { href: "/superannuation-guide/", label: "Superannuation Guide" },
  { href: "/salary-sacrifice-guide/", label: "Salary Sacrifice Guide" },
  { href: "/hecs-help-guide/", label: "HECS-HELP Guide" },
  { href: "/novated-lease-guide/", label: "Novated Lease Guide" },
  { href: "/salary-packaging-guide/", label: "Salary Packaging" },
  { href: "/division-293-tax/", label: "Division 293 Tax" },
  { href: "/super-co-contribution/", label: "Super Co-Contribution" },
  { href: "/super-guarantee-rate-history/", label: "SG Rate History" },
  { href: "/salary-sacrifice-vs-mortgage/", label: "Sacrifice vs Mortgage" },
  { href: "/extra-super-vs-hecs-repayment/", label: "Super vs HECS" },
  { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
  { href: "/stsl-on-payslip/", label: "STSL on Your Payslip" },
  { href: "/award-rates/", label: "Award Rates" },
  { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates" },
  { href: "/hospitality-award-rates/", label: "Hospitality Award Rates" },
  { href: "/retail-award-rates/", label: "Retail Award Rates" },
  { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
  { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates" },
  { href: "/annual-leave-guide/", label: "Annual Leave Guide" },
  { href: "/redundancy-pay-guide/", label: "Redundancy Pay Guide" },
  { href: "/minimum-wage-history-australia/", label: "Minimum Wage History" },
] as const;

export const FOOTER_GUIDES_EMPLOYMENT = [
  { href: "/first-job-pay-guide/", label: "First Job Guide" },
  { href: "/new-job-checklist/", label: "New Job Checklist" },
  { href: "/gig-economy-pay-guide/", label: "Gig Economy Guide" },
  { href: "/contractor-vs-employee/", label: "Contractor vs Employee" },
  { href: "/employee-vs-sole-trader-vs-company/", label: "Business Structure" },
  { href: "/salary-vs-hourly/", label: "Salary vs Hourly" },
  { href: "/full-time-vs-part-time-vs-casual/", label: "FT vs PT vs Casual" },
  { href: "/working-holiday-tax/", label: "Working Holiday Tax" },
  { href: "/non-resident-tax/", label: "Non-Resident Tax" },
  { href: "/centrelink-income-test/", label: "Centrelink Income Test" },
  { href: "/parental-leave-pay/", label: "Parental Leave Pay" },
  { href: "/zone-tax-offset/", label: "Zone Tax Offset" },
  { href: "/sapto-calculator/", label: "SAPTO Calculator" },
  { href: "/hourly-to-salary/40/", label: "$40 an Hour Is How Much a Year" },
  { href: "/hourly-to-salary/35/", label: "$35 an Hour Is How Much a Year" },
  { href: "/average-salary-australia/", label: "Average Salary Australia" },
  { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO Pay" },
  { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
  { href: "/teacher-pay-australia/", label: "Teacher Pay" },
  { href: "/retail-hospitality-pay-guide/", label: "Retail & Hospitality Pay" },
  { href: "/tech-salary-guide-australia/", label: "IT & Tech Salaries" },
  { href: "/construction-trades-pay/", label: "Construction & Trades" },
] as const;

/** @deprecated Use FOOTER_GUIDES_TAX, FOOTER_GUIDES_SUPER_PAY, FOOTER_GUIDES_EMPLOYMENT instead */
export const FOOTER_GUIDES = [
  ...FOOTER_GUIDES_TAX,
  ...FOOTER_GUIDES_SUPER_PAY,
  ...FOOTER_GUIDES_EMPLOYMENT,
] as const;

export const FOOTER_STATES_AND_LEGAL = [
  { href: "/pay-calculator-nsw/", label: "Pay Calculator NSW" },
  { href: "/pay-calculator-vic/", label: "Pay Calculator VIC" },
  { href: "/pay-calculator-qld/", label: "Pay Calculator QLD" },
  { href: "/pay-calculator-wa/", label: "Pay Calculator WA" },
  { href: "/pay-calculator-sa/", label: "Pay Calculator SA" },
  { href: "/pay-calculator-tas/", label: "Pay Calculator TAS" },
  { href: "/pay-calculator-act/", label: "Pay Calculator ACT" },
  { href: "/pay-calculator-nt/", label: "Pay Calculator NT" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms of Use" },
] as const;

export const FOOTER_TAX_ON_SALARY = [
  { href: "/tax-on/40000/", label: "Tax on $40K" },
  { href: "/tax-on/50000/", label: "Tax on $50K" },
  { href: "/tax-on/60000/", label: "Tax on $60K" },
  { href: "/tax-on/70000/", label: "Tax on $70K" },
  { href: "/tax-on/80000/", label: "Tax on $80K" },
  { href: "/tax-on/90000/", label: "Tax on $90K" },
  { href: "/tax-on/100000/", label: "Tax on $100K" },
  { href: "/tax-on/120000/", label: "Tax on $120K" },
  { href: "/tax-on/150000/", label: "Tax on $150K" },
  { href: "/tax-on/200000/", label: "Tax on $200K" },
] as const;

// Footer news links — hub + 8 curated articles. All hrefs verified against
// NEWS_ARTICLES in lib/news.ts (24 articles, Tasks 6–10 complete).
export const FOOTER_NEWS = [
  { href: "/news/", label: "Pay & Tax News" },
  { href: "/news/july-1-2026-money-changes/", label: "July 1 Money Changes" },
  { href: "/news/minimum-wage-increase-july-2026/", label: "Minimum Wage Increase 2026" },
  { href: "/news/payday-super-starts-july-2026/", label: "Payday Super" },
  { href: "/news/tax-cut-july-2026/", label: "July 2026 Tax Cut" },
  { href: "/news/hecs-indexation-2026/", label: "HECS Indexation 2026" },
  { href: "/news/super-contribution-caps-2026-27/", label: "Super Caps 2026-27" },
  { href: "/news/age-pension-increase-march-2026/", label: "Age Pension Increase" },
  { href: "/news/centrelink-changes-july-2026/", label: "Centrelink Changes July 2026" },
] as const;