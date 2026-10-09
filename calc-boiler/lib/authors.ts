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
  "anita-bell": {
    id: "anita-bell",
    name: "Anita Bell",
    role: "Founder & Senior Bookkeeper",
    credentials: "Accountancy degree (2015); certified in Xero, QuickBooks Online, MYOB, Saasu, Zoho and Reckon One",
    bio: "Anita Bell earned her accountancy degree in 2015 and has worked as a senior bookkeeper with Prime Bookkeeping for over 5 years. This built her skills in Australian and New Zealand tax legislation and industry regulations. She is certified in Xero, QuickBooks Online, MYOB, Saasu, Zoho and Reckon One, and works with payroll and rostering software including Gusto, Deputy, Tsheets and KeyPay. She has strong experience in hospitality, building and construction, financial services, real estate, ecommerce, and medical and health services.",
    expertise: [
      "Australian and New Zealand tax legislation",
      "Bookkeeping and accounting software",
      "Payroll and rostering software",
    ],
    experience: "5+ years as a senior bookkeeper",
    profileUrl: `${SITE_CONFIG.baseUrl}/about/`,
    imageUrl: "/images/authors/anita-bell.jpg",
    jsonLd: {
      "@type": "Person",
      name: "Anita Bell",
      jobTitle: "Founder & Senior Bookkeeper",
      description:
        "Senior bookkeeper with an accountancy degree (2015) and 5+ years of experience in Australian and New Zealand tax legislation and payroll software.",
      url: `${SITE_CONFIG.baseUrl}/about/`,
      worksFor: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
      },
      knowsAbout: [
        "Australian tax legislation",
        "Bookkeeping",
        "Payroll software",
      ],
    },
  },
};

// ─── Reviewer (none: Anita Bell writes and checks every page) ───
export const REVIEWERS: Record<string, Reviewer> = {};

// ─── Guide → Author/Reviewer mapping ────────────────────────────
// Anita Bell is the author of every guide.
export type GuideAuthorship = {
  authorId: string;
  reviewerId?: string;
  lastReviewed: string;
};

export const GUIDE_AUTHORSHIP: Record<string, GuideAuthorship> = {
  // Tax & deductions guides
  "tax-brackets": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "jobseeker-payment-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "austudy-youth-allowance-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "age-pension-income-test-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-24" }, // H3: re-reviewed with the rates-first upgrade
  // C4 Centrelink family payments (added 2026-09-23)
  "parenting-payment-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "family-tax-benefit-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "rent-assistance-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // end C4
  // W3 Centrelink wave 2 (added 2026-09-23)
  "carer-payment-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "carer-allowance": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "centrelink-advance-payment": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "centrelink-crisis-payment": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "centrelink-debt": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "cost-of-living-payment-2026": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // end W3
  // H3 Centrelink wave 3 (added 2026-09-24)
  "age-pension-assets-test-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "deeming-rates": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "disability-support-pension-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "child-care-subsidy-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "commonwealth-seniors-health-card": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  // end H3
  "salary-package-calculator": { authorId: "anita-bell", lastReviewed: "2026-08-28" },
  "commission-tax-calculator": { authorId: "anita-bell", lastReviewed: "2026-08-28" },
  "medicare-levy": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "low-income-tax-offset": { authorId: "anita-bell", lastReviewed: "2026-09-23" }, // T1 rebuild
  "payg-withholding-tables": { authorId: "anita-bell", lastReviewed: "2026-07-01" },
  "weekly-tax-table": { authorId: "anita-bell", lastReviewed: "2026-07-01" },
  "fortnightly-tax-table": { authorId: "anita-bell", lastReviewed: "2026-07-01" },
  "monthly-tax-table": { authorId: "anita-bell", lastReviewed: "2026-07-01" },
  "schedule-5-tax-table": { authorId: "anita-bell", lastReviewed: "2026-07-01" },
  "bonus-tax-guide": { authorId: "anita-bell", lastReviewed: "2026-03-09" },
  "tax-refund-guide": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "tax-calendar": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "fringe-benefits-tax": { authorId: "anita-bell", lastReviewed: "2026-03-04" },
  "working-holiday-tax": { authorId: "anita-bell", lastReviewed: "2026-03-03" },
  "non-resident-tax": { authorId: "anita-bell", lastReviewed: "2026-03-02" },
  "zone-tax-offset": { authorId: "anita-bell", lastReviewed: "2026-07-28" },
  "sapto-calculator": { authorId: "anita-bell", lastReviewed: "2026-07-28" },

  // Super & salary guides
  "superannuation-guide": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "salary-sacrifice-guide": { authorId: "anita-bell", lastReviewed: "2026-03-10" },
  "hecs-help-guide": { authorId: "anita-bell", lastReviewed: "2026-03-11" },
  "novated-lease-guide": { authorId: "anita-bell", lastReviewed: "2026-08-28" },
  "novated-lease-calculator": { authorId: "anita-bell", lastReviewed: "2026-08-28" },
  "employer-cost-calculator": { authorId: "anita-bell", lastReviewed: "2026-03-07" },

  // Employment & pay guides
  "understanding-your-payslip": { authorId: "anita-bell", lastReviewed: "2026-03-09" },
  "award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "contractor-vs-employee": { authorId: "anita-bell", lastReviewed: "2026-03-06" },
  "redundancy-pay-guide": { authorId: "anita-bell", lastReviewed: "2026-03-05" },
  "overtime-penalty-rates-guide": { authorId: "anita-bell", lastReviewed: "2026-03-04" },
  "annual-leave-guide": { authorId: "anita-bell", lastReviewed: "2026-03-07" },
  "centrelink-income-test": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "parental-leave-pay": { authorId: "anita-bell", lastReviewed: "2026-09-23" },

  // Wave 8-11 Expansion Guides — Tax & Deductions
  "tax-deductions-guide": { authorId: "anita-bell", lastReviewed: "2026-03-14" },
  "work-from-home-deductions": { authorId: "anita-bell", lastReviewed: "2026-03-14" },
  "stage-3-tax-cuts": { authorId: "anita-bell", lastReviewed: "2026-03-15" },
  "tax-changes-2026-27": { authorId: "anita-bell", lastReviewed: "2026-03-15" },
  "private-health-insurance-medicare": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "division-293-tax": { authorId: "anita-bell", lastReviewed: "2026-03-13" },
  "tax-file-number-declaration": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "notice-of-assessment": { authorId: "anita-bell", lastReviewed: "2026-03-12" },
  "salary-packaging-guide": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "super-co-contribution": { authorId: "anita-bell", lastReviewed: "2026-03-11" },
  "tax-bracket-history": { authorId: "anita-bell", lastReviewed: "2026-03-16" },
  "super-guarantee-rate-history": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "salary-sacrifice-vs-mortgage": { authorId: "anita-bell", lastReviewed: "2026-03-15" },
  "extra-super-vs-hecs-repayment": { authorId: "anita-bell", lastReviewed: "2026-03-15" },

  // Wave 8-11 Expansion Guides — Employment & Pay
  "first-job-pay-guide": { authorId: "anita-bell", lastReviewed: "2026-03-14" },
  "new-job-checklist": { authorId: "anita-bell", lastReviewed: "2026-03-14" },
  "gig-economy-pay-guide": { authorId: "anita-bell", lastReviewed: "2026-03-13" },
  "average-salary-australia": { authorId: "anita-bell", lastReviewed: "2026-03-15" },
  "salary-vs-hourly": { authorId: "anita-bell", lastReviewed: "2026-03-12" },
  "employee-vs-sole-trader-vs-company": { authorId: "anita-bell", lastReviewed: "2026-03-13" },
  "full-time-vs-part-time-vs-casual": { authorId: "anita-bell", lastReviewed: "2026-03-14" },
  "minimum-wage-history-australia": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "mining-fifo-pay-guide": { authorId: "anita-bell", lastReviewed: "2026-03-15" },
  "healthcare-worker-pay": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "teacher-pay-australia": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // C1 employer pay rates (hub + every /pay-rates/[employer]/ page)
  "pay-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "long-service-leave-calculator": { authorId: "anita-bell", lastReviewed: "2026-08-28" },
  "retail-hospitality-pay-guide": { authorId: "anita-bell", lastReviewed: "2026-03-13" },
  "tech-salary-guide-australia": { authorId: "anita-bell", lastReviewed: "2026-03-13" },
  "construction-trades-pay": { authorId: "anita-bell", lastReviewed: "2026-03-12" },

  "hecs-help-calculator": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "hecs-repayment-threshold": { authorId: "anita-bell", lastReviewed: "2026-07-28" },
  "capital-gains-tax-calculator": { authorId: "anita-bell", lastReviewed: "2026-07-28" },
  "work-hours-calculator": { authorId: "anita-bell", lastReviewed: "2026-07-28" },
  "super-guarantee-charge": { authorId: "anita-bell", lastReviewed: "2026-07-28" },

  // Per-award rate pages
  "schads-award-pay-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "hospitality-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "retail-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- Award cluster C3 (Sep 2026): additional per-award rate pages ---
  "fast-food-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "pharmacy-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "manufacturing-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "security-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "clerks-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end award cluster C3 ---
  // --- October 2026 award batch ---
  "miscellaneous-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "building-and-construction-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "legal-services-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "electrical-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "fitness-industry-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "real-estate-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "local-government-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "live-performance-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // --- end October 2026 award batch ---
  // --- October 2026 award batch 2 ---
  "plumbing-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "pastoral-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "horticulture-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "health-professionals-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "timber-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "meat-industry-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "commercial-sales-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "mining-award-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // --- end October 2026 award batch 2 ---
  // --- T4: awards batch 3 (23 Sep 2026) ---
  "restaurant-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "nurses-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "aged-care-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "hair-and-beauty-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "cleaning-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "road-transport-award-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end T4 ---
  "junior-pay-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },

  // Wave 13 Expansion — Payslip Tools (tax-table slugs registered above)
  "stsl-on-payslip": { authorId: "anita-bell", lastReviewed: "2026-07-02" },
  "payslip-generator": { authorId: "anita-bell", lastReviewed: "2026-07-02" },
  "ytd-income-calculator": { authorId: "anita-bell", lastReviewed: "2026-07-02" },

  // --- C2/C5 occupation pay rates + ADF pay scales (23 Sep 2026) ---
  "job-pay-rates": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "adf-pay-scales": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end C2/C5 ---

  // --- F5 emergency-service + aviation pay (24 Sep 2026) ---
  "paramedic-pay": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "police-pay": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "firefighter-pay": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "prison-officer-pay": { authorId: "anita-bell", lastReviewed: "2026-10-09" }, // J8
  "air-traffic-controller-salary": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "pilot-salary": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  // --- end F5 ---

  // --- G4 public holiday pay cluster (24 Sep 2026) ---
  "public-holiday-pay": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  // --- end G4 ---

  // --- holiday-specific pay pages (5 Oct 2026) ---
  "christmas-day-pay-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "boxing-day-pay-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "new-years-day-pay-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "public-holidays-2027": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "melbourne-cup-day-pay": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "easter-public-holiday-pay": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "australia-day-public-holiday-pay": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "christmas-shutdown-annual-leave": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // --- end holiday-specific pay pages ---

  // --- Minimum wage cluster (C5 workstream, 23 Sep 2026) ---
  "minimum-wage-australia": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "minimum-wage-by-age": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "minimum-wage": { authorId: "anita-bell", lastReviewed: "2026-10-05" }, // /minimum-wage/{state}/ (F1)
  "pro-rata-salary-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "casual-loading-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end minimum wage cluster ---

  // --- W2 wave 2: tax-free threshold, MLS calculator, concessional cap (23 Sep 2026) ---
  "tax-free-threshold": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "medicare-levy-surcharge-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "concessional-contributions-cap": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end W2 ---

  // --- W1 timely pages (Wave 2, 23 Sep 2026) ---
  "payday-super": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "tax-return-2026": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "pension-age-australia": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end W1 ---

  // --- T3 workplace entitlement attributes (Wave 3, 23 Sep 2026) ---
  "time-in-lieu": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "leave-loading-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "enterprise-agreement": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "fair-work-pay-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-25" },
  "travel-allowance": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "cents-per-km": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "gross-vs-net-pay": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "centrelink-working-credit-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end T3 ---
  // --- T2 payroll tax cluster (23 Sep 2026): "payroll-tax" covers the hub and all 8 state pages ---
  "payroll-tax-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  "payroll-tax": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end T2 ---
  // --- T1 wave 3 tax core (23 Sep 2026) ---
  "tax-withheld-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-23" },
  // --- end T1 ---
  // --- F8 Lever D linkable assets (24 Sep 2026) ---
  "australian-pay-report-2026": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "australian-tax-and-pay-data": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "pay-and-tax-changes-calendar": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // --- end F8 ---
  // --- Oct 2026 tax and super pages (feat/oct-tax-super) ---
  "late-tax-return-penalty": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "working-australians-tax-offset": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "listo-calculator": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "carry-forward-concessional-contributions-calculator": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "termination-payment-tax-calculator": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // --- end Oct 2026 tax and super pages ---
  // --- F7 remaining planned nodes (24 Sep 2026) ---
  "fifo-pay-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "fortnights-in-a-year": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "centrelink-payment-dates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // --- end F7 ---
  // --- G3 wave 4 opportunities (24 Sep 2026) ---
  "sick-leave-calculator": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "compassionate-leave": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "ote-salary": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "jury-duty-pay": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  // --- end G3 ---
  // --- Oct core new pages (5 Oct 2026) ---
  "marginal-tax-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "annual-leave-calculator": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "net-pay-calculator": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "payment-in-lieu-of-notice": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "casual-conversion": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "allowances-guide": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "highest-paying-jobs-australia": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // --- end Oct core new pages ---
  // --- J6 wave 4 backlog (24 Sep 2026) ---
  "centrelink-payment-rates": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "public-service-pay-scales/aps/aps-3": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "public-service-pay-scales/aps/aps-4": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "public-service-pay-scales/aps/aps-5": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "public-service-pay-scales/aps/aps-6": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "public-service-pay-scales/aps/el1": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "public-service-pay-scales/aps/el2": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "school-support-staff-pay": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "school-support-staff-pay/nsw": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "school-support-staff-pay/vic": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "school-support-staff-pay/qld": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "school-support-staff-pay/wa": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "school-support-staff-pay/sa": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  "train-driver-salary": { authorId: "anita-bell", lastReviewed: "2026-09-24" },
  // --- end J6 ---
  // --- Oct 2026 gig / apprentice / graduate set (5 Oct 2026) ---
  "delivery-driver-pay-rate": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "rideshare-delivery-earnings-after-tax": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay-rates": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/carpenter": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/bricklayer": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/painter": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/plumber": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/mechanic": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/hairdresser": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/chef": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/boilermaker": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "apprentice-pay/butcher": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  "graduate-salary-australia": { authorId: "anita-bell", lastReviewed: "2026-10-05" },
  // --- end Oct 2026 set ---
};

/** Helper: get full author + reviewer for a guide slug */
export function getGuideAuthorship(slug: string) {
  const mapping = GUIDE_AUTHORSHIP[slug];
  if (!mapping) return null;
  const author = AUTHORS[mapping.authorId];
  const reviewer = mapping.reviewerId ? REVIEWERS[mapping.reviewerId] : undefined;
  return { author, reviewer, lastReviewed: mapping.lastReviewed };
}
