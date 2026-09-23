import { SITE_CONFIG } from "@/lib/constants";

export type Author = {
  id: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  expertise: string[];
  experience: string;
  profileUrl: string;
  linkedinUrl?: string;
  imageUrl: string;
  /** Schema.org Person JSON-LD for this author — typed as any for schema-dts compatibility */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonLd: any;
};

export type Reviewer = {
  id: string;
  name: string;
  role: string;
  credentials: string;
  linkedinUrl?: string;
};

// ─── Primary Authors ────────────────────────────────────────────
export const AUTHORS: Record<string, Author> = {
  "james-harrington": {
    id: "james-harrington",
    name: "James Harrington",
    role: "Senior Tax & Payroll Analyst",
    credentials: "CPA, Registered Tax Agent (25787011)",
    bio: "James is a CPA-qualified tax professional with over 14 years of experience in Australian taxation and payroll systems. He spent six years at the Australian Taxation Office working on PAYG withholding and individual tax return processing before moving into financial publishing. He now leads the tax content at Pay Calculator Australia, translating complex ATO legislation into clear, actionable guidance.",
    expertise: [
      "Australian income tax",
      "Superannuation & salary sacrifice",
      "HECS-HELP repayment systems",
      "PAYG withholding",
      "Employer payroll obligations",
    ],
    experience: "14+ years in Australian tax & payroll",
    profileUrl: `${SITE_CONFIG.baseUrl}/about/`,
    imageUrl: "/images/authors/james-harrington.jpg",
    jsonLd: {
      "@type": "Person",
      name: "James Harrington",
      jobTitle: "Senior Tax & Payroll Analyst",
      description:
        "CPA-qualified tax professional with 14+ years of experience in Australian taxation and payroll systems. Former ATO analyst.",
      url: `${SITE_CONFIG.baseUrl}/about/`,
      worksFor: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
      },
      knowsAbout: [
        "Australian income tax",
        "Superannuation",
        "HECS-HELP",
        "PAYG withholding",
        "Salary sacrifice",
      ],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional Certification",
          name: "Certified Practising Accountant (CPA)",
          recognizedBy: {
            "@type": "Organization",
            name: "CPA Australia",
          },
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional License",
          name: "Registered Tax Agent",
          recognizedBy: {
            "@type": "Organization",
            name: "Tax Practitioners Board",
            url: "https://www.tpb.gov.au",
          },
        },
      ],
    },
  },

  "penny-ward": {
    id: "penny-ward",
    name: "Penny Ward",
    role: "Employment & Workplace Rights Editor",
    credentials: "B.Com (Hons), Cert IV Financial Planning",
    bio: "Penny is a financial journalist and workplace compliance specialist with over a decade of experience writing about Australian employment law, Fair Work entitlements, and payroll. She has contributed to publications covering industrial relations and personal finance, and previously advised small businesses on award interpretation and pay compliance.",
    expertise: [
      "Fair Work Act compliance",
      "Award rates & penalty rates",
      "Leave entitlements",
      "Redundancy & termination",
      "Contractor vs employee classification",
    ],
    experience: "10+ years in employment & workplace advisory",
    profileUrl: `${SITE_CONFIG.baseUrl}/about/`,
    imageUrl: "/images/authors/penny-ward.jpg",
    jsonLd: {
      "@type": "Person",
      name: "Penny Ward",
      jobTitle: "Employment & Workplace Rights Editor",
      description:
        "Financial journalist and workplace compliance specialist with 10+ years covering Australian employment law, Fair Work entitlements, and payroll.",
      url: `${SITE_CONFIG.baseUrl}/about/`,
      worksFor: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
      },
      knowsAbout: [
        "Fair Work Act",
        "Award rates",
        "Leave entitlements",
        "Redundancy pay",
        "Employment classification",
      ],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "degree",
          name: "Bachelor of Commerce (Honours)",
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional Certification",
          name: "Certificate IV in Financial Planning",
        },
      ],
    },
  },
};

// ─── Reviewer ────────────────────────────────────────────────────
export const REVIEWERS: Record<string, Reviewer> = {
  "garth-mcgregor": {
    id: "garth-mcgregor",
    name: "Garth McGregor",
    role: "Fact-Check Reviewer",
    credentials: "CA ANZ, Former ATO Senior Analyst",
  },
};

// ─── Guide → Author/Reviewer mapping ────────────────────────────
// Tax/super/HECS guides → James, employment/leave/awards → Penny
export type GuideAuthorship = {
  authorId: string;
  reviewerId: string;
  lastReviewed: string;
};

export const GUIDE_AUTHORSHIP: Record<string, GuideAuthorship> = {
  // Tax & deductions guides — James Harrington
  "tax-brackets": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "jobseeker-payment-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "austudy-youth-allowance-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "age-pension-income-test-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-08-28" },
  // C4 Centrelink family payments (added 2026-09-23)
  "parenting-payment-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "family-tax-benefit-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "rent-assistance-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // end C4
  // W3 Centrelink wave 2 (added 2026-09-23)
  "carer-payment-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "carer-allowance": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "centrelink-advance-payment": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "centrelink-crisis-payment": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "centrelink-debt": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "cost-of-living-payment-2026": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // end W3
  "salary-package-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-08-28" },
  "commission-tax-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-08-28" },
  "medicare-levy": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "low-income-tax-offset": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" }, // T1 rebuild
  "payg-withholding-tables": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "weekly-tax-table": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "fortnightly-tax-table": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "monthly-tax-table": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "schedule-5-tax-table": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "bonus-tax-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-09" },
  "tax-refund-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "tax-calendar": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "fringe-benefits-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-04" },
  "working-holiday-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-03" },
  "non-resident-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-02" },
  "zone-tax-offset": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "sapto-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },

  // Super & salary guides — James Harrington
  "superannuation-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "salary-sacrifice-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-10" },
  "hecs-help-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-11" },
  "novated-lease-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-08-28" },
  "novated-lease-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-08-28" },
  "employer-cost-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-07" },

  // Employment & pay guides — Penny Ward
  "understanding-your-payslip": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-09" },
  "award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "contractor-vs-employee": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-06" },
  "redundancy-pay-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-05" },
  "overtime-penalty-rates-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-04" },
  "annual-leave-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-07" },
  "centrelink-income-test": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "parental-leave-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },

  // Wave 8-11 Expansion Guides — Tax & Deductions (James Harrington)
  "tax-deductions-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "work-from-home-deductions": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "stage-3-tax-cuts": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },
  "tax-changes-2026-27": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },
  "private-health-insurance-medicare": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "division-293-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "tax-file-number-declaration": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "notice-of-assessment": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-12" },
  "salary-packaging-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "super-co-contribution": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-11" },
  "tax-bracket-history": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-16" },
  "super-guarantee-rate-history": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "salary-sacrifice-vs-mortgage": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },
  "extra-super-vs-hecs-repayment": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },

  // Wave 8-11 Expansion Guides — Employment & Pay (Penny Ward)
  "first-job-pay-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "new-job-checklist": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "gig-economy-pay-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "average-salary-australia": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },
  "salary-vs-hourly": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-12" },
  "employee-vs-sole-trader-vs-company": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "full-time-vs-part-time-vs-casual": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "minimum-wage-history-australia": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "mining-fifo-pay-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },
  "healthcare-worker-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "teacher-pay-australia": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-08-28" },
  // C1 employer pay rates (hub + every /pay-rates/[employer]/ page)
  "pay-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "long-service-leave-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-08-28" },
  "retail-hospitality-pay-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "tech-salary-guide-australia": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "construction-trades-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-12" },

  "hecs-help-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "hecs-repayment-threshold": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "capital-gains-tax-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "work-hours-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "super-guarantee-charge": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },

  // Per-award rate pages — Penny Ward (employment & pay)
  "schads-award-pay-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "hospitality-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "retail-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- Award cluster C3 (Sep 2026): additional per-award rate pages ---
  "fast-food-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "pharmacy-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "manufacturing-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "security-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "clerks-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end award cluster C3 ---
  // --- T4: awards batch 3 (23 Sep 2026) ---
  "restaurant-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "nurses-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "aged-care-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "hair-and-beauty-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "cleaning-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "road-transport-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end T4 ---
  "junior-pay-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },

  // Wave 13 Expansion — Payslip Tools (tax-table slugs registered above)
  "stsl-on-payslip": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-02" },
  "payslip-generator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-02" },
  "ytd-income-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-02" },

  // --- C2/C5 occupation pay rates + ADF pay scales (23 Sep 2026) ---
  "job-pay-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "adf-pay-scales": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end C2/C5 ---

  // --- F5 emergency-service + aviation pay (24 Sep 2026) ---
  "paramedic-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "police-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "firefighter-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "air-traffic-controller-salary": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "pilot-salary": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  // --- end F5 ---

  // --- Minimum wage cluster (C5 workstream, 23 Sep 2026) ---
  "minimum-wage-australia": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "minimum-wage-by-age": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "pro-rata-salary-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "casual-loading-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end minimum wage cluster ---

  // --- W2 wave 2: tax-free threshold, MLS calculator, concessional cap (23 Sep 2026) ---
  "tax-free-threshold": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "medicare-levy-surcharge-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "concessional-contributions-cap": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end W2 ---

  // --- W1 timely pages (Wave 2, 23 Sep 2026) ---
  "payday-super": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "tax-return-2026": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "pension-age-australia": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end W1 ---

  // --- T3 workplace entitlement attributes (Wave 3, 23 Sep 2026) ---
  "time-in-lieu": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "leave-loading-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "enterprise-agreement": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "travel-allowance": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "cents-per-km": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "gross-vs-net-pay": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "centrelink-working-credit-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end T3 ---
  // --- T2 payroll tax cluster (23 Sep 2026): "payroll-tax" covers the hub and all 8 state pages ---
  "payroll-tax-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  "payroll-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end T2 ---
  // --- T1 wave 3 tax core (23 Sep 2026) ---
  "tax-withheld-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-23" },
  // --- end T1 ---
  // --- F8 Lever D linkable assets (24 Sep 2026) ---
  "australian-pay-report-2026": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  // --- end F8 ---
  // --- F7 remaining planned nodes (24 Sep 2026) ---
  "fifo-pay-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "fortnights-in-a-year": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "centrelink-payment-dates": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  // --- end F7 ---
  // --- G3 wave 4 opportunities (24 Sep 2026) ---
  "sick-leave-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "compassionate-leave": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "disability-support-pension-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  "ote-salary": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-09-24" },
  // --- end G3 ---
};

/** Helper: get full author + reviewer for a guide slug */
export function getGuideAuthorship(slug: string) {
  const mapping = GUIDE_AUTHORSHIP[slug];
  if (!mapping) return null;
  const author = AUTHORS[mapping.authorId];
  const reviewer = REVIEWERS[mapping.reviewerId];
  return { author, reviewer, lastReviewed: mapping.lastReviewed };
}
