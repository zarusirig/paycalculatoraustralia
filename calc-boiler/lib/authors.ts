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
  "tax-brackets": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-10" },
  "medicare-levy": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-08" },
  "low-income-tax-offset": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-05" },
  "payg-withholding-tables": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "weekly-tax-table": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "fortnightly-tax-table": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "monthly-tax-table": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "schedule-5-tax-table": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-01" },
  "bonus-tax-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-09" },
  "tax-refund-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-06" },
  "tax-calendar": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-11" },
  "fringe-benefits-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-04" },
  "working-holiday-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-03" },
  "non-resident-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-02" },
  "zone-tax-offset": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "sapto-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },

  // Super & salary guides — James Harrington
  "superannuation-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-12" },
  "salary-sacrifice-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-10" },
  "hecs-help-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-11" },
  "novated-lease-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-01" },
  "employer-cost-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-07" },

  // Employment & pay guides — Penny Ward
  "understanding-your-payslip": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-09" },
  "award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-08" },
  "contractor-vs-employee": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-06" },
  "redundancy-pay-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-05" },
  "overtime-penalty-rates-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-04" },
  "annual-leave-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-07" },
  "centrelink-income-test": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-03" },
  "parental-leave-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-02" },

  // Wave 8-11 Expansion Guides — Tax & Deductions (James Harrington)
  "tax-deductions-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "work-from-home-deductions": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "stage-3-tax-cuts": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },
  "tax-changes-2026-27": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },
  "private-health-insurance-medicare": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "division-293-tax": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "tax-file-number-declaration": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-12" },
  "notice-of-assessment": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-12" },
  "salary-packaging-guide": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-11" },
  "super-co-contribution": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-11" },
  "tax-bracket-history": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-16" },
  "super-guarantee-rate-history": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-16" },
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
  "minimum-wage-history-australia": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-16" },
  "mining-fifo-pay-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-15" },
  "healthcare-worker-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "teacher-pay-australia": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-14" },
  "retail-hospitality-pay-guide": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "tech-salary-guide-australia": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-13" },
  "construction-trades-pay": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-03-12" },

  "hecs-help-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "hecs-repayment-threshold": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "capital-gains-tax-calculator": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "work-hours-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "super-guarantee-charge": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },

  // Per-award rate pages — Penny Ward (employment & pay)
  "schads-award-pay-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "hospitality-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "retail-award-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },
  "junior-pay-rates": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-28" },

  // Wave 13 Expansion — Payslip Tools (tax-table slugs registered above)
  "stsl-on-payslip": { authorId: "james-harrington", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-02" },
  "payslip-generator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-02" },
  "ytd-income-calculator": { authorId: "penny-ward", reviewerId: "garth-mcgregor", lastReviewed: "2026-07-02" },
};

/** Helper: get full author + reviewer for a guide slug */
export function getGuideAuthorship(slug: string) {
  const mapping = GUIDE_AUTHORSHIP[slug];
  if (!mapping) return null;
  const author = AUTHORS[mapping.authorId];
  const reviewer = REVIEWERS[mapping.reviewerId];
  return { author, reviewer, lastReviewed: mapping.lastReviewed };
}
