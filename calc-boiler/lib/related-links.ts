/**
 * "What's next" internal linking.
 *
 * Every href here is a real, prerendered route — no raw dynamic segments
 * ([salary], [rate], [slug]) and no invented paths. Concrete paths under a
 * dynamic route (/payroll-tax/nsw/, /job-pay-rates/chef/) must be ones that
 * route's generateStaticParams emits; related-links.test.ts checks this against
 * app/ and the data folders.
 *
 * Why this exists: the site earns per ad impression, and impressions scale with
 * pages per session, not with traffic. Moving a visitor from one page to two
 * roughly doubles the inventory shown to them at zero acquisition cost — and it
 * simultaneously flips a single-page session to "engaged" in GA4. It is the one
 * lever where the ad revenue goal and the engagement goal point the same way.
 */

export type RelatedLink = {
  href: string;
  title: string;
  blurb: string;
};

/** Shown when a page has no cluster of its own. Broadest-appeal destinations. */
const DEFAULT_LINKS: RelatedLink[] = [
  { href: "/take-home-pay-calculator/", title: "Take-Home Pay Calculator", blurb: "See your actual pay after tax, super and Medicare." },
  { href: "/income-tax-calculator/", title: "Income Tax Calculator", blurb: "Work out your tax for the current financial year." },
  { href: "/tax-brackets/", title: "Tax Brackets", blurb: "Current ATO rates and thresholds explained." },
];

const TAKE_HOME: RelatedLink = { href: "/take-home-pay-calculator/", title: "Take-Home Pay Calculator", blurb: "See your actual pay after tax, super and Medicare." };
const INCOME_TAX: RelatedLink = { href: "/income-tax-calculator/", title: "Income Tax Calculator", blurb: "Work out your tax for the current financial year." };
const TAX_BRACKETS: RelatedLink = { href: "/tax-brackets/", title: "Tax Brackets", blurb: "Current ATO rates and thresholds explained." };
const SUPER_CALC: RelatedLink = { href: "/superannuation-calculator/", title: "Superannuation Calculator", blurb: "Check your employer is paying the right super." };
const HECS_CALC: RelatedLink = { href: "/hecs-help-calculator/", title: "HECS-HELP Calculator", blurb: "Estimate your compulsory repayment this year." };
const AWARD_RATES: RelatedLink = { href: "/award-rates/", title: "Award Pay Rates", blurb: "Minimum rates for the awards that cover most workers." };
const PAYSLIP: RelatedLink = { href: "/understanding-your-payslip/", title: "Understanding Your Payslip", blurb: "Decode every line on your payslip." };
const OVERTIME: RelatedLink = { href: "/overtime-pay-calculator/", title: "Overtime Pay Calculator", blurb: "Penalty rates and overtime, worked out for you." };

// --- Shared targets for the cross-cluster weave (Sep 2026 internal-link pass) ---
// Titles and blurbs deliberately vary the wording for the same destination
// (lexical-relationship-map.md): the card text is the anchor text crawlers read.
const L = (href: string, title: string, blurb: string): RelatedLink => ({ href, title, blurb });

const MIN_WAGE = L("/minimum-wage-australia/", "Minimum Wage Australia", "The national minimum wage every award rate sits on top of.");
const JUNIOR = L("/junior-pay-rates/", "Junior Pay Rates", "Minimum wage by age, from 14 to 20.");
const JOBS_HUB = L("/job-pay-rates/", "Pay Rates by Job", "What 40+ occupations earn under their award, with take-home pay.");
const EMPLOYERS_HUB = L("/pay-rates/", "Pay Rates by Employer", "Coles, Woolworths, McDonald's and more: what big employers pay.");
const EA = L("/enterprise-agreement/", "Enterprise Agreement Search (EBA)", "When an EA sets your pay instead of the award, and how to look yours up.");
const PENALTY_GUIDE = L("/overtime-penalty-rates-guide/", "Penalty Rates Guide", "Weekends, public holidays and late nights.");
const TOIL = L("/time-in-lieu/", "Time in Lieu (TOIL)", "Taking paid time off instead of overtime pay: the award rules.");
const LEAVE_LOADING = L("/leave-loading-calculator/", "Leave Loading Calculator", "The 17.5% loading on annual leave, worked out.");
const GROSS_VS_NET = L("/gross-vs-net-pay/", "Gross vs Net Pay", "What comes out of your pay between the gross and net figures.");
const TAX_WITHHELD = L("/tax-withheld-calculator/", "Tax Withheld Calculator", "How much PAYG tax your employer withholds each pay.");
const LITO = L("/low-income-tax-offset/", "Low Income Tax Offset", "The LITO that cuts tax for earners under $66,667.");
const TAX_FREE_THRESHOLD = L("/tax-free-threshold/", "Tax-Free Threshold", "The first $18,200 you earn, and when to claim it.");
const MLS = L("/medicare-levy-surcharge-calculator/", "Medicare Levy Surcharge Calculator", "Whether you owe the MLS without private hospital cover.");
const PAYG_TABLES = L("/payg-withholding-tables/", "PAYG Withholding Tables", "Which ATO PAYG schedule to use for your pay.");
const TAKE_HOME_HUB = L("/take-home-pay-on/", "Take-Home Pay on Every Salary", "Net pay tables from $20,000 to $500,000.");
const TAX_ON_HUB = L("/tax-on/", "Tax on Every Salary", "Income tax, Medicare and your marginal rate at each salary.");
// Exact-match titles (the card title is the anchor) with the "... tax calculator"
// head term in the blurb: both queries share one primary URL (intent map,
// docs/seo/2026-09-23-head-term-intent-map.md). Sep 2026: these two pages
// weren't in the top 20 for their own "weekly/fortnightly pay calculator"
// queries, so the tax-table, withholding, pay-frequency, payday-super and
// state pay pages below now link to them.
const WEEKLY_PAY = L("/weekly-pay-calculator/", "Weekly Pay Calculator", "The weekly tax calculator: tax and take-home on each week's pay.");
const FORTNIGHTLY_PAY = L("/fortnightly-pay-calculator/", "Fortnightly Pay Calculator", "The fortnightly tax calculator: tax and take-home every pay.");
const PAY_RISE = L("/pay-rise-calculator/", "Pay Rise Calculator", "What a raise actually adds to each pay.");
const PAYROLL_TAX_CALC = L("/payroll-tax-calculator/", "Payroll Tax Calculator", "Estimate state payroll tax on your total wages bill.");
const PAYROLL_TAX_HUB = L("/payroll-tax/", "Payroll Tax Rates by State", "Thresholds and rates for all eight states and territories.");
const EMPLOYER_COST = L("/employer-cost-calculator/", "Employer Cost Calculator", "Super, payroll tax and on-costs on top of a salary.");
const INCOME_TEST_HUB = L("/centrelink-income-test/", "Centrelink Income Test", "How free areas, tapers and cut-offs reduce a payment.");
const WORKING_CREDIT = L("/centrelink-working-credit-calculator/", "Working Credit Calculator", "How unused free area banks up and shields future earnings.");
const JOBSEEKER = L("/jobseeker-payment-calculator/", "JobSeeker Payment Calculator", "What you keep of JobSeeker when you work part-time.");

const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as const;
const STATE_NAMES: Record<string, string> = { nsw: "NSW", vic: "VIC", qld: "QLD", wa: "WA", sa: "SA", tas: "TAS", act: "ACT", nt: "NT" };

const job = (slug: string, name: string, blurb: string) => L(`/job-pay-rates/${slug}/`, `${name} Pay Rates`, blurb);
const employer = (slug: string, name: string, blurb: string) => L(`/pay-rates/${slug}/`, `${name} Pay Rates`, blurb);

const COLES = employer("coles", "Coles", "What Coles pays team members, junior to adult.");
const WOOLWORTHS = employer("woolworths", "Woolworths", "Woolies team member rates and weekend penalties.");
const KMART = employer("kmart", "Kmart", "What Kmart pays by age and level.");
const BUNNINGS = employer("bunnings", "Bunnings", "What Bunnings pays team members by level.");
const MCDONALDS = employer("mcdonalds", "McDonald's", "Crew pay at McDonald's, including junior rates.");
const SUBWAY = employer("subway", "Subway", "What Subway pays sandwich artists, by age.");
const CHEMIST_WAREHOUSE = employer("chemist-warehouse", "Chemist Warehouse", "Pharmacy assistant and pharmacist rates.");

/**
 * Award page → the jobs and employers it actually covers. Award pages are the
 * entity hub for rates; job and employer pages are where people land, so the
 * award links down to them and they link back up (see JOB_LINKS / EMPLOYER_LINKS).
 */
const AWARD_LINKS: Record<string, RelatedLink[]> = {
  "/award-rates/": [JOBS_HUB, EMPLOYERS_HUB, MIN_WAGE, JUNIOR, L("/apprentice-pay-rates/", "Apprentice Pay Rates", "Award minimums for apprentices by trade and year, with a wages calculator."), EA],
  "/fair-work-pay-calculator/": [AWARD_RATES, MIN_WAGE, JUNIOR, PENALTY_GUIDE, EA, L("/backpay-calculator/", "Backpay Calculator", "What you are owed if you have been paid under the award.")],
  "/retail-award-rates/": [job("retail-worker", "Retail Worker", "Retail award levels as hourly, weekly and annual pay."), job("retail-manager", "Retail Manager", "Store and department manager levels 4 to 8, hourly and annual."), COLES, WOOLWORTHS, KMART, JUNIOR, PENALTY_GUIDE],
  "/fast-food-award-rates/": [MCDONALDS, SUBWAY, job("barista", "Barista", "Cafe and takeaway coffee rates under three awards."), L("/minimum-wage-by-age/15/", "Minimum Wage for 15 Year Olds", "The junior percentage most first jobs start on."), JUNIOR, PENALTY_GUIDE],
  "/pharmacy-award-rates/": [job("pharmacy-assistant", "Pharmacy Assistant", "Pharmacy assistant levels 1 to 4, hourly and annual."), job("pharmacist", "Pharmacist", "Pharmacist pay from intern to manager."), CHEMIST_WAREHOUSE, JUNIOR, PENALTY_GUIDE, TOIL],
  "/hospitality-award-rates/": [job("bartender", "Bartender", "Bar attendant rates and weekend penalties."), job("chef", "Chef", "Cook and chef grades from commis to head chef."), job("barista", "Barista", "Cafe and takeaway coffee rates under three awards."), JUNIOR, PENALTY_GUIDE, L("/apprentice-pay-rates/", "Apprentice Chef Pay", "First to fourth-year apprentice cook minimums, and other trades.")],
  "/restaurant-award-rates/": [job("chef", "Chef", "Cook and chef grades from commis to head chef."), job("barista", "Barista", "Cafe and takeaway coffee rates under three awards."), job("bartender", "Bartender", "Bar attendant rates and weekend penalties."), JUNIOR, PENALTY_GUIDE, TOIL],
  "/aged-care-award-rates/": [job("aged-care-worker", "Aged Care Worker", "Personal care worker pay after the work value increases."), job("nurse", "Nurse", "Registered and enrolled nurse pay rates."), L("/schads-award-pay-rates/", "SCHADS Award Pay Rates", "The award for home care and disability support."), OVERTIME, PENALTY_GUIDE, TOIL],
  "/cleaning-award-rates/": [job("cleaner", "Cleaner", "Cleaning services levels and shift penalties."), MIN_WAGE, OVERTIME, PENALTY_GUIDE, TOIL],
  "/hair-and-beauty-award-rates/": [job("hairdresser", "Hairdresser", "Hairdresser and apprentice rates, hourly to annual."), L("/apprentice-pay-rates/", "Apprentice Pay Rates", "Hairdressing and beauty apprentice minimums by year, plus other trades."), JUNIOR, OVERTIME, PENALTY_GUIDE],
  "/nurses-award-rates/": [job("nurse", "Nurse", "Registered and enrolled nurse pay rates."), job("midwife", "Midwife", "Midwife pay by year of experience."), L("/healthcare-worker-pay/", "Nurse Salary Australia by State", "Public hospital nurse scales in every state."), OVERTIME, PENALTY_GUIDE, TOIL],
  "/road-transport-award-rates/": [job("truck-driver", "Truck Driver", "Truck driver grades 1 to 10, hourly and annual."), job("bus-driver", "Bus Driver", "Bus and coach driver pay rates."), job("forklift-operator", "Forklift Operator", "Warehouse, retail, factory and transport forklift rates."), OVERTIME, PENALTY_GUIDE, L("/cents-per-km/", "Cents per Kilometre", "Vehicle allowances on the payslip and at tax time.")],
  "/clerks-award-rates/": [job("receptionist", "Receptionist", "Receptionist pay under the Clerks Award."), job("bookkeeper", "Bookkeeper", "Bookkeeper pay rates by level."), job("medical-receptionist", "Medical Receptionist", "Practice reception pay rates."), MIN_WAGE, OVERTIME, TOIL],
  "/manufacturing-award-rates/": [job("mechanic", "Mechanic", "Mechanic and automotive tradesperson pay."), job("electrician", "Electrician", "Electrician pay from apprentice to qualified."), job("boilermaker", "Boilermaker", "The C10 trade rate and higher levels for fabrication trades."), job("welder", "Welder", "Welding grades from C13 to the trade rate."), job("lab-technician", "Lab Technician", "Laboratory technician pay rates."), OVERTIME, PENALTY_GUIDE, L("/news/c13-classification-phase-out/", "C13 Classification Phase-Out", "What removing the lowest manufacturing grade means for pay.")],
  "/security-award-rates/": [job("security-guard", "Security Guard", "Security officer levels and night shift rates."), OVERTIME, PENALTY_GUIDE, TOIL],
  // --- October 2026 award batch ---
  "/miscellaneous-award-rates/": [MIN_WAGE, JUNIOR, OVERTIME, PENALTY_GUIDE, TOIL],
  "/building-and-construction-award-rates/": [L("/construction-trades-pay/", "Construction & Trades Pay Guide", "What tradies and apprentices actually earn, with take-home pay."), job("carpenter", "Carpenter", "Carpenter pay with the tool allowance included."), job("crane-operator", "Crane Operator", "Crane operator pay under the award."), OVERTIME, PENALTY_GUIDE, TOIL],
  "/legal-services-award-rates/": [job("lawyer", "Lawyer", "Solicitor and lawyer salaries, which sit outside this award."), job("receptionist", "Receptionist", "Receptionist pay under the Clerks Award."), OVERTIME, PENALTY_GUIDE, TOIL],
  "/electrical-award-rates/": [job("electrician", "Electrician", "Electrician pay from apprentice to qualified."), job("apprentice-electrician", "Apprentice Electrician", "Apprentice electrician rates by year."), L("/construction-trades-pay/", "Construction & Trades Pay Guide", "Trade pay, allowances and take-home."), OVERTIME, PENALTY_GUIDE],
  "/fitness-industry-award-rates/": [JUNIOR, MIN_WAGE, OVERTIME, PENALTY_GUIDE, TOIL],
  "/real-estate-award-rates/": [job("property-manager", "Property Manager", "Property manager pay by level and state."), job("real-estate-agent", "Real Estate Agent", "Agent pay, commission and take-home."), L("/commission-tax-calculator/", "Commission Tax Calculator", "Tax on commission and bonus payments."), OVERTIME, TOIL],
  "/local-government-award-rates/": [L("/enterprise-agreement/", "Enterprise Agreements", "Why most councils pay under an agreement, not the award."), JUNIOR, OVERTIME, PENALTY_GUIDE, TOIL],
  "/live-performance-award-rates/": [JUNIOR, MIN_WAGE, OVERTIME, PENALTY_GUIDE, TOIL],
  "/schads-award-pay-rates/": [job("disability-support-worker", "Disability Support Worker", "SCHADS levels for disability support work."), job("youth-worker", "Youth Worker", "Where youth work sits in the SCHADS levels."), job("social-worker", "Social Worker", "Social and community services pay."), job("aged-care-worker", "Aged Care Worker", "Personal care worker pay after the work value increases."), OVERTIME, PENALTY_GUIDE, TOIL],
};

/** Occupation → award and employer pages. Everything else gets the generic job set. */
const JOB_LINKS: Record<string, RelatedLink[]> = {
  // F4 (Oct 2026)
  "retail-manager": [L("/retail-award-rates/", "Retail Award Rates", "Every General Retail Industry Award level, with penalties."), job("retail-worker", "Retail Worker", "Retail Levels 1 to 4 as hourly, weekly and annual pay.")],
  "youth-worker": [L("/schads-award-pay-rates/", "SCHADS Award Pay Rates", "Every SCHADS level, sleepover and shift rate."), job("disability-support-worker", "Disability Support Worker", "The same award for disability services.")],
  boilermaker: [L("/manufacturing-award-rates/", "Manufacturing Award Rates", "Every C-level in the Manufacturing Award, with penalties."), job("welder", "Welder", "Welding grades under the same award.")],
  welder: [L("/manufacturing-award-rates/", "Manufacturing Award Rates", "Every C-level in the Manufacturing Award, with penalties."), job("boilermaker", "Boilermaker", "The trade rate for fabrication tradespeople.")],
  "forklift-operator": [job("truck-driver", "Truck Driver", "Road transport grades, including forklift work."), job("retail-worker", "Retail Worker", "Forklift and ride-on operators sit at Level 2 in retail.")],
  "flight-attendant": [L("/pilot-salary/", "Pilot Salary", "Pilot pay under the Air Pilots Award and airline agreements."), L("/air-traffic-controller-salary/", "Air Traffic Controller Salary", "Airservices Australia agreement pay by level.")],
  "retail-worker": [COLES, WOOLWORTHS, KMART, BUNNINGS, L("/minimum-wage-by-age/16/", "Minimum Wage for 16 Year Olds", "What a 16-year-old must be paid in retail and elsewhere."), job("retail-manager", "Retail Manager", "Where store and department managers sit in the same award.")],
  "pharmacy-assistant": [CHEMIST_WAREHOUSE, L("/pharmacy-award-rates/", "Pharmacy Award Rates", "Every Pharmacy Industry Award level and penalty."), JUNIOR],
  pharmacist: [CHEMIST_WAREHOUSE, L("/pharmacy-award-rates/", "Pharmacy Award Rates", "Every Pharmacy Industry Award level and penalty.")],
  barista: [MCDONALDS, L("/minimum-wage-by-age/17/", "Minimum Wage for 17 Year Olds", "Junior rates for cafe and takeaway work.")],
  bartender: [L("/hospitality-award-rates/", "Hospitality Award Rates", "Pub and bar minimum rates and penalties."), MIN_WAGE],
  "truck-driver": [L("/road-transport-award-rates/", "Road Transport Award Rates", "Every grade in the Road Transport and Distribution Award."), L("/cents-per-km/", "Cents per Kilometre", "Vehicle allowances on the payslip and at tax time."), job("forklift-operator", "Forklift Operator", "Forklift rates in warehouse, factory and retail awards.")],
  "bus-driver": [L("/road-transport-award-rates/", "Road Transport Award Rates", "Driver grades under the Road Transport Award."), AWARD_RATES],
  cleaner: [L("/cleaning-award-rates/", "Cleaning Award Rates", "Cleaning Services Award levels and shift rates."), MIN_WAGE],
  "apprentice-electrician": [L("/minimum-wage-by-age/18/", "Minimum Wage for 18 Year Olds", "How junior and apprentice rates compare."), AWARD_RATES],
  "childcare-worker": [L("/minimum-wage-by-age/19/", "Minimum Wage for 19 Year Olds", "Junior percentages for trainees under 21."), AWARD_RATES],
};

/** Employer → the award and job pages its rates come from. */
const EMPLOYER_LINKS: Record<string, RelatedLink[]> = {
  "/pay-rates/": [JOBS_HUB, AWARD_RATES, MIN_WAGE, JUNIOR, EA],
  "/pay-rates/coles/": [job("retail-worker", "Retail Worker", "Retail pay under the award, as an hourly and annual figure."), EA, L("/minimum-wage-by-age/16/", "Minimum Wage for 16 Year Olds", "What a 16-year-old must be paid at minimum."), JUNIOR],
  "/pay-rates/woolworths/": [job("retail-worker", "Retail Worker", "Retail pay under the award, as an hourly and annual figure."), EA, L("/minimum-wage-by-age/17/", "Minimum Wage for 17 Year Olds", "The junior rate floor for a 17-year-old."), JUNIOR],
  "/pay-rates/kmart/": [job("retail-worker", "Retail Worker", "Retail pay under the award, as an hourly and annual figure."), EA, L("/minimum-wage-by-age/16/", "Minimum Wage for 16 Year Olds", "What a 16-year-old must be paid at minimum."), JUNIOR],
  "/pay-rates/bunnings/": [job("retail-worker", "Retail Worker", "Retail pay under the award, as an hourly and annual figure."), EA, MIN_WAGE, JUNIOR],
  "/pay-rates/mcdonalds/": [L("/fast-food-award-rates/", "Fast Food Award Rates", "The award behind McDonald's crew pay."), L("/minimum-wage-by-age/15/", "Minimum Wage for 15 Year Olds", "What a 15-year-old must be paid at minimum."), job("barista", "Barista", "Coffee and counter pay across three awards."), EA],
  "/pay-rates/subway/": [L("/fast-food-award-rates/", "Fast Food Award Rates", "Every Fast Food Industry Award level."), L("/minimum-wage-by-age/15/", "Minimum Wage for 15 Year Olds", "What a 15-year-old must be paid at minimum."), JUNIOR, MIN_WAGE],
  "/pay-rates/chemist-warehouse/": [L("/pharmacy-award-rates/", "Pharmacy Award Rates", "The Pharmacy Industry Award behind these rates."), job("pharmacy-assistant", "Pharmacy Assistant", "Pharmacy assistant levels 1 to 4."), job("pharmacist", "Pharmacist", "Pharmacist pay from intern to manager."), JUNIOR],
};

/** Minimum wage by age spokes → the employers and jobs that hire at that age. */
const AGE_LINKS: Record<string, RelatedLink[]> = {
  "14": [MCDONALDS, SUBWAY, L("/first-job-pay-guide/", "First Job Pay Guide", "Payslips, tax and super in your first job.")],
  "15": [MCDONALDS, SUBWAY, L("/first-job-pay-guide/", "First Job Pay Guide", "Payslips, tax and super in your first job.")],
  "16": [COLES, WOOLWORTHS, KMART],
  "17": [WOOLWORTHS, COLES, job("barista", "Barista", "Cafe and takeaway coffee rates.")],
  "18": [job("retail-worker", "Retail Worker", "Adult-track retail pay by level."), job("bartender", "Bartender", "Bar work pay once you turn 18."), BUNNINGS],
  "19": [job("retail-worker", "Retail Worker", "Retail pay by level."), job("childcare-worker", "Childcare Worker", "Early childhood educator pay."), CHEMIST_WAREHOUSE],
  "20": [job("retail-worker", "Retail Worker", "Retail pay by level."), job("pharmacy-assistant", "Pharmacy Assistant", "Pharmacy assistant levels 1 to 4."), BUNNINGS],
};

/** Salary number from /take-home-pay-on/85000/ style paths. */
function salaryFromPath(p: string): number | null {
  const m = p.match(/^\/(?:take-home-pay-on|tax-on|salary-to-hourly)\/(\d+)\/$/);
  return m ? Number(m[1]) : null;
}

/** The tax-core page that matters most at this income. */
function taxCoreFor(salary: number): RelatedLink {
  if (salary <= 66000) return LITO;
  if (salary >= 100000) return MLS;
  return TAX_FREE_THRESHOLD;
}

/**
 * Exact-path overrides, checked before the cluster rules. Used where a page is
 * the natural bridge between two clusters (entitlements ↔ payslip, tax core ↔
 * salary tables, Centrelink ↔ pay calculators).
 */
const PAGE_LINKS: Record<string, RelatedLink[]> = {
  // Entitlement attributes ↔ payslip, leave and overtime tools
  "/time-in-lieu/": [OVERTIME, PENALTY_GUIDE, EA, PAYSLIP],
  "/leave-loading-calculator/": [L("/leave-calculator/", "Leave Payout Calculator", "Unused annual leave paid out when you finish up."), L("/annual-leave-guide/", "Annual Leave Guide", "Accrual, cashing out and the four-week rule."), PAYSLIP, L("/final-pay-calculator/", "Final Pay Calculator", "Everything owed when employment ends.")],
  "/enterprise-agreement/": [AWARD_RATES, EMPLOYERS_HUB, TOIL, L("/backpay-calculator/", "Backpay Calculator", "Work out an underpayment and the tax on back pay.")],
  "/travel-allowance/": [L("/cents-per-km/", "Cents per Kilometre", "Car expense claims at the ATO rate."), PAYSLIP, L("/tax-deductions-guide/", "Tax Deductions Guide", "What you can actually claim."), L("/tax-return-calculator/", "Tax Return Calculator", "Estimate your refund before you lodge.")],
  "/cents-per-km/": [L("/travel-allowance/", "Travel Allowance", "ATO reasonable amounts for overnight work travel."), PAYSLIP, L("/work-from-home-deductions/", "Work From Home Deductions", "The fixed-rate method and what it covers."), L("/tax-deductions-guide/", "Tax Deductions Guide", "What you can actually claim."), L("/rideshare-delivery-earnings-after-tax/", "Rideshare & Delivery Tax", "GST, tax and expenses for drivers and riders, on your figures."), L("/delivery-driver-pay-rate/", "Delivery Driver Pay Rate", "The legal hourly minimum for delivery workers, before expenses.")],
  "/gross-vs-net-pay/": [WEEKLY_PAY, FORTNIGHTLY_PAY, TAKE_HOME, L("/gross-pay-calculator/", "Gross Pay Calculator", "Work back from net pay to the gross figure."), TAX_WITHHELD, PAYSLIP],
  "/centrelink-working-credit-calculator/": [JOBSEEKER, INCOME_TEST_HUB, FORTNIGHTLY_PAY, L("/age-pension-income-test-calculator/", "Age Pension Income Test", "The Work Bonus, the pension's own earnings shield.")],
  "/understanding-your-payslip/": [GROSS_VS_NET, LEAVE_LOADING, L("/travel-allowance/", "Allowances on Your Payslip", "Travel allowance rates and when they are taxed."), TAX_WITHHELD, TOIL, L("/news/payday-super-employees-payslip/", "Payday Super on Your Payslip", "What changed on payslips from July 2026.")],
  "/payslip-generator/": [PAYSLIP, GROSS_VS_NET, LEAVE_LOADING, TAX_WITHHELD],
  "/overtime-pay-calculator/": [TOIL, PENALTY_GUIDE, L("/casual-loading-calculator/", "Casual Loading Calculator", "The 25% loading and how it interacts with penalties."), AWARD_RATES],
  "/overtime-penalty-rates-guide/": [OVERTIME, TOIL, EA, AWARD_RATES],
  "/casual-loading-calculator/": [OVERTIME, JUNIOR, L("/full-time-vs-part-time-vs-casual/", "Full-Time vs Part-Time vs Casual", "Leave, loading and hours compared."), AWARD_RATES],
  // --- G3 wave 4 opportunities (24 Sep 2026) ---
  "/sick-leave-calculator/": [L("/annual-leave-guide/", "Annual Leave Guide", "Four weeks a year, how it accrues and when it can be cashed out."), LEAVE_LOADING, L("/final-pay-calculator/", "Final Pay Calculator", "What is (and isn't) paid out when you leave."), PAYSLIP],
  "/compassionate-leave/": [L("/sick-leave-calculator/", "Sick Leave Calculator", "Personal/carer's leave: how much you have and how it accrues."), L("/annual-leave-guide/", "Annual Leave Guide", "Four weeks a year, how it accrues and when it can be cashed out."), L("/parental-leave-pay/", "Paid Parental Leave", "Government Parental Leave Pay, worked out."), PAYSLIP],
  "/ote-salary/": [L("/commission-tax-calculator/", "Commission Tax Calculator", "Tax withheld on a commission payment."), L("/bonus-tax-calculator/", "Bonus Tax Calculator", "What a bonus is worth after tax."), SUPER_CALC, TAKE_HOME],
  "/jury-duty-pay/": [L("/sick-leave-calculator/", "Sick Leave Calculator", "How much personal/carer's leave you have."), L("/compassionate-leave/", "Compassionate Leave", "2 days paid bereavement leave each time."), PAYSLIP, TAKE_HOME],
  // --- end G3 ---
  // --- J6 wave 4 backlog (24 Sep 2026) ---
  "/centrelink-payment-rates/": [JOBSEEKER, INCOME_TEST_HUB, L("/age-pension-income-test-calculator/", "Age Pension Calculator", "Rates from 20 September and the income test with the Work Bonus."), L("/family-tax-benefit-calculator/", "Family Tax Benefit Calculator", "FTB Part A and Part B on your family income."), L("/centrelink-payment-dates/", "Centrelink Payment Dates", "When each payment lands, including around public holidays.")],
  "/train-driver-salary/": [JOBS_HUB, EA, L("/overtime-pay-calculator/", "Overtime Pay Calculator", "Extra shifts and overtime, worked out."), TAKE_HOME],
  "/school-support-staff-pay/": [L("/job-pay-rates/teacher-aide/", "Teacher Aide Award Rates", "The minimum for private and Catholic school aides."), L("/teacher-pay-australia/", "Teacher Pay by State", "Classroom teacher salaries in every state."), L("/hourly-to-annual-salary-calculator/", "Hourly to Salary Calculator", "Turn an hourly rate into a yearly figure."), TAKE_HOME],
  // --- end J6 ---
  // --- Oct 2026 gig / apprentice / graduate set ---
  "/delivery-driver-pay-rate/": [L("/rideshare-delivery-earnings-after-tax/", "Rideshare & Delivery Tax", "GST, tax and what to set aside, on your figures."), L("/gig-economy-pay-guide/", "Gig Economy Pay Guide", "ABN, BAS and deductions for gig workers."), L("/contractor-pay-calculator/", "Contractor Pay Calculator", "Convert a contractor rate to a salary equivalent."), L("/cents-per-km/", "Cents per Kilometre", "The ATO car expense rate for deliveries."), L("/hourly-to-annual-salary-calculator/", "Hourly to Annual Salary Calculator", "Turn an hourly rate into a yearly figure."), TAKE_HOME],
  "/rideshare-delivery-earnings-after-tax/": [L("/delivery-driver-pay-rate/", "Delivery Driver Pay Rate", "The $31.30 an hour minimum, and a payout checker."), L("/gig-economy-pay-guide/", "Gig Economy Pay Guide", "ABN, BAS and deductions for gig workers."), L("/contractor-vs-employee-calculator/", "Contractor vs Employee", "Compare both sides on the same income."), L("/cents-per-km/", "Cents per Kilometre", "Cents per km vs logbook for car expenses."), TAX_BRACKETS, TAKE_HOME],
  "/gig-economy-pay-guide/": [L("/delivery-driver-pay-rate/", "Delivery Driver Pay Rate", "The legal hourly minimum for delivery workers from 17 August 2026."), L("/rideshare-delivery-earnings-after-tax/", "Rideshare & Delivery Tax", "GST, income tax and what to set aside, on your figures."), L("/contractor-pay-calculator/", "Contractor Pay Calculator", "Convert a contract rate to real take-home."), L("/contractor-vs-employee-calculator/", "Contractor vs Employee", "Compare both sides on the same income."), L("/cents-per-km/", "Cents per Kilometre", "The car expense methods compared."), TAKE_HOME],
  "/contractor-pay-calculator/": [L("/delivery-driver-pay-rate/", "Delivery Driver Pay Rate", "The legal hourly minimum for delivery workers."), L("/rideshare-delivery-earnings-after-tax/", "Rideshare & Delivery Tax", "GST and tax for drivers and riders."), L("/contractor-vs-employee-calculator/", "Contractor vs Employee", "Compare both sides on the same income."), L("/gig-economy-pay-guide/", "Gig Economy Pay Guide", "Rideshare and delivery earnings, tax and super."), L("/employer-cost-calculator/", "Employer Cost Calculator", "The full cost of employing someone."), TAKE_HOME],
  "/apprentice-pay-rates/": [L("/job-pay-rates/apprentice-electrician/", "Apprentice Electrician Pay", "Full electrical apprentice rates, adult and penalty rates."), L("/construction-trades-pay/", "Construction & Trades Pay", "Tradie rates, allowances and overtime."), JUNIOR, AWARD_RATES, L("/hourly-to-annual-salary-calculator/", "Hourly to Annual Salary Calculator", "Turn an hourly rate into a yearly figure."), TAKE_HOME],
  "/graduate-salary-australia/": [HECS_CALC, TAKE_HOME_HUB, JOBS_HUB, L("/first-job-pay-guide/", "First Job Pay Guide", "Payslips, tax and super in your first job."), L("/teacher-pay-australia/", "Teacher Pay by State", "Classroom teacher salaries in every state."), PAY_RISE],
  "/construction-trades-pay/": [L("/apprentice-pay-rates/", "Apprentice Pay Rates", "Award minimums by trade and year, with a wages calculator."), TAKE_HOME, AWARD_RATES, INCOME_TAX],
  "/teacher-pay-australia/": [L("/graduate-salary-australia/", "Graduate Salary Australia", "What new graduates earn, teachers included, from official sources."), TAKE_HOME, { href: "/pay-rise-calculator/", title: "Pay Rise Calculator", blurb: "What a raise actually adds to each pay." }, AWARD_RATES],
  "/healthcare-worker-pay/": [L("/graduate-salary-australia/", "Graduate Salary Australia", "What new nurses, doctors and others earn, from official sources."), TAKE_HOME, { href: "/pay-rise-calculator/", title: "Pay Rise Calculator", blurb: "What a raise actually adds to each pay." }, AWARD_RATES],
  // --- end Oct 2026 set ---

  // Tax core ↔ salary tables
  "/tax-brackets/": [TAX_ON_HUB, TAX_WITHHELD, TAX_FREE_THRESHOLD, L("/tax-bracket-history/", "Tax Bracket History", "How the rates and thresholds have changed over time."), L("/australian-tax-and-pay-data/", "Tax and Pay Data (CSV)", "The tax scales and thresholds as a free download.")],
  "/australian-tax-and-pay-data/": [L("/tax-bracket-history/", "Tax Bracket History", "How the rates and thresholds have changed over time."), L("/minimum-wage-history-australia/", "Minimum Wage History", "How the national minimum wage has changed year by year."), L("/pay-and-tax-changes-calendar/", "Pay and Tax Changes Calendar", "What changes on 1 December, 1 January and 1 July."), L("/embed/", "Live Rate Badges", "Show the current minimum wage or super rate on your site."), L("/australian-pay-report-2026/", "Australian Pay Report 2026", "Take-home pay, minimum wage and award rates in tables."), TAKE_HOME],
  "/pay-and-tax-changes-calendar/": [L("/tax-changes-2026-27/", "Tax Changes 2026-27", "Everything that changed on 1 July."), L("/tax-calendar/", "Tax Calendar", "Tax return, BAS and super due dates."), L("/junior-pay-rates/", "Junior Pay Rates", "Minimum wage by age, from 14 to 20."), L("/australian-tax-and-pay-data/", "Tax and Pay Data (CSV)", "The rates behind these dates as a free download."), L("/minimum-wage-australia/", "Minimum Wage Australia", "The national minimum wage and when it next changes."), TAKE_HOME],
  "/low-income-tax-offset/": [L("/take-home-pay-on/45000/", "Take-Home Pay on $45,000", "Net pay at an income where LITO is in play."), TAX_FREE_THRESHOLD, L("/super-co-contribution/", "Super Co-Contribution", "The government top-up for lower-income earners."), L("/sapto-calculator/", "SAPTO Calculator", "The seniors offset, stacked with LITO.")],
  "/tax-free-threshold/": [L("/tax-on/20000/", "Tax on $20,000", "What you pay just above the tax-free threshold."), LITO, TAX_WITHHELD, TAX_BRACKETS],
  "/tax-withheld-calculator/": [WEEKLY_PAY, FORTNIGHTLY_PAY, PAYG_TABLES, TAKE_HOME_HUB, GROSS_VS_NET, L("/fortnightly-tax-table/", "Fortnightly Tax Table", "PAYG withholding for fortnightly pay.")],
  "/medicare-levy-surcharge-calculator/": [L("/medicare-levy/", "Medicare Levy Calculator", "The 2% levy and the low-income reduction."), L("/take-home-pay-on/120000/", "Take-Home Pay on $120,000", "Net pay at an income where the surcharge can bite."), L("/private-health-insurance-medicare/", "Private Health Insurance & Medicare", "Cover, the rebate and the surcharge together."), TAX_BRACKETS],
  "/medicare-levy/": [MLS, TAX_ON_HUB, TAX_BRACKETS, TAKE_HOME],

  // Salary hubs ↔ pay calculators
  "/take-home-pay-on/": [TAKE_HOME, WEEKLY_PAY, FORTNIGHTLY_PAY, PAY_RISE],
  "/tax-on/": [INCOME_TAX, TAX_WITHHELD, TAX_BRACKETS, FORTNIGHTLY_PAY, WEEKLY_PAY, TAKE_HOME_HUB],
  "/salary-to-hourly/": [L("/hourly-to-annual-salary-calculator/", "Hourly to Annual Salary Calculator", "Convert any hourly rate to a yearly salary."), WEEKLY_PAY, FORTNIGHTLY_PAY, PAY_RISE, TAKE_HOME, TAKE_HOME_HUB],
  "/pay-rise-calculator/": [TAKE_HOME_HUB, INCOME_TAX, TAX_BRACKETS, L("/salary-sacrifice-calculator/", "Salary Sacrifice Calculator", "Put part of the rise into super before tax.")],
  "/weekly-pay-calculator/": [TAKE_HOME, L("/weekly-tax-table/", "Weekly Tax Table", "The ATO withholding for weekly pay."), FORTNIGHTLY_PAY, TAKE_HOME_HUB, OVERTIME, PAYSLIP],
  "/fortnightly-pay-calculator/": [TAKE_HOME, L("/fortnightly-tax-table/", "Fortnightly Tax Table", "The ATO withholding for fortnightly pay."), WEEKLY_PAY, TAKE_HOME_HUB, WORKING_CREDIT, L("/fortnights-in-a-year/", "Fortnights in a Year", "26 or 27 pay days: every pay date this financial year.")],

  // Minimum wage and junior pages ↔ jobs and employers
  "/minimum-wage-australia/": [JUNIOR, JOBS_HUB, EMPLOYERS_HUB, AWARD_RATES, L("/minimum-wage-history-australia/", "Minimum Wage History", "How the national minimum wage has changed year by year."), L("/news/minimum-wage-increase-july-2026/", "Minimum Wage Increase July 2026", "What the latest review changed.")],
  "/minimum-wage-history-australia/": [MIN_WAGE, JUNIOR, L("/australian-pay-report-2026/", "Australian Pay Report 2026", "How the minimum wage compares with median and average earnings."), AWARD_RATES, L("/news/minimum-wage-increase-july-2026/", "Minimum Wage Increase July 2026", "What the latest review changed."), L("/australian-tax-and-pay-data/", "Minimum Wage Data (CSV)", "Every year since 2010 as a free download.")],
  "/junior-pay-rates/": [MIN_WAGE, MCDONALDS, COLES, L("/apprentice-pay-rates/", "Apprentice Pay Rates", "Trade apprentice minimums by year, with a wages calculator."), L("/retail-award-rates/", "Retail Award Rates", "The award covering most junior retail workers."), L("/fast-food-award-rates/", "Fast Food Award Rates", "The award behind most first jobs."), L("/first-job-pay-guide/", "First Job Pay Guide", "Payslips, tax and super in your first job.")],
  "/first-job-pay-guide/": [JUNIOR, L("/new-job-checklist/", "New Job Checklist", "TFN declaration, super choice and your first payslip."), MCDONALDS, PAYSLIP, L("/graduate-salary-australia/", "Graduate Salary Australia", "Law, nursing, engineering, teaching and more, from official sources."), L("/apprentice-pay-rates/", "Apprentice Pay Rates", "What apprentices must be paid, by trade and year.")],
  "/new-job-checklist/": [L("/tax-file-number-declaration/", "TFN Declaration", "Which boxes to tick on your first day."), JUNIOR, AWARD_RATES, PAYSLIP],

  // Payroll tax ↔ employer cost
  "/employer-cost-calculator/": [PAYROLL_TAX_CALC, PAYROLL_TAX_HUB, L("/payday-super/", "Payday Super", "Paying SG with every pay run from July 2026."), L("/contractor-vs-employee-calculator/", "Contractor vs Employee", "Compare both sides on the same income.")],
  "/payroll-tax-calculator/": [PAYROLL_TAX_HUB, EMPLOYER_COST, L("/payday-super/", "Payday Super", "Paying SG with every pay run from July 2026."), L("/super-guarantee-charge/", "Super Guarantee Charge", "What late or missed super costs an employer.")],
  "/payroll-tax/": [PAYROLL_TAX_CALC, EMPLOYER_COST, L("/pay-calculator-nsw/", "NSW Pay Calculator", "Employee take-home pay in New South Wales."), L("/pay-calculator-vic/", "VIC Pay Calculator", "Employee take-home pay in Victoria.")],

  // Weak pages found by the audit
  "/salary-sacrifice-calculator/": [L("/salary-sacrifice-vs-mortgage/", "Salary Sacrifice vs Mortgage", "Extra super or extra home loan repayments?"), L("/salary-packaging-guide/", "Salary Packaging Guide", "What else you can package, and the caps."), L("/concessional-contributions-cap/", "Concessional Contributions Cap", "The yearly limit on pre-tax super."), SUPER_CALC],
  "/average-salary-australia/": [JOBS_HUB, L("/australian-pay-report-2026/", "Australian Pay Report 2026", "Minimum, median and average pay side by side, with the data."), L("/tech-salary-guide-australia/", "Tech Salary Guide", "Software, data and IT salaries in Australia."), TAKE_HOME_HUB, L("/graduate-salary-australia/", "Graduate Salary Australia", "What new graduates earn in six professions, sourced."), PAY_RISE],
  "/pension-age-australia/": [L("/age-pension-income-test-calculator/", "Age Pension Income Test Calculator", "Single and couple tests with the Work Bonus."), L("/sapto-calculator/", "SAPTO Calculator", "The seniors and pensioners tax offset."), INCOME_TEST_HUB, SUPER_CALC],
  "/age-pension-income-test-calculator/": [L("/age-pension-assets-test-calculator/", "Age Pension Assets Test Calculator", "Both tests together, with your savings deemed."), L("/deeming-rates/", "Deeming Rates", "1.75% and 3.75% from 20 September 2026."), L("/pension-age-australia/", "Pension Age Australia", "When you qualify for the Age Pension."), INCOME_TEST_HUB],
  // H3 Centrelink wave 3 (added 2026-09-24)
  "/age-pension-assets-test-calculator/": [L("/age-pension-income-test-calculator/", "Age Pension Calculator", "Rates from 20 September and the income test with the Work Bonus."), L("/deeming-rates/", "Deeming Rates", "How your savings count as income."), L("/commonwealth-seniors-health-card/", "Commonwealth Seniors Health Card", "If your assets rule out a pension."), FORTNIGHTLY_PAY],
  "/deeming-rates/": [L("/age-pension-income-test-calculator/", "Age Pension Calculator", "Deemed income and wages in the income test."), L("/age-pension-assets-test-calculator/", "Age Pension Assets Test Calculator", "The same savings, counted as assets."), JOBSEEKER, INCOME_TEST_HUB],
  "/disability-support-pension-calculator/": [WORKING_CREDIT, FORTNIGHTLY_PAY, L("/carer-payment-calculator/", "Carer Payment Calculator", "The other pension-rate payment, with a 100-hour work rule."), INCOME_TEST_HUB],
  "/child-care-subsidy-calculator/": [L("/family-tax-benefit-calculator/", "Family Tax Benefit Calculator", "The other payment on your family income estimate."), L("/parental-leave-pay/", "Paid Parental Leave Calculator", "26 weeks from 1 July 2026."), PAY_RISE, TAKE_HOME],
  "/commonwealth-seniors-health-card/": [L("/age-pension-assets-test-calculator/", "Age Pension Assets Test Calculator", "Whether you would get a part pension instead."), L("/deeming-rates/", "Deeming Rates", "How your account-based pension is deemed."), L("/sapto-calculator/", "SAPTO Calculator", "The seniors tax offset on your wages."), INCOME_TAX],
  // end H3
  "/division-293-tax/": [L("/news/super-tax-changes-explained/", "Super Tax Changes Explained", "Who the new Division 296 tax affects."), L("/concessional-contributions-cap/", "Concessional Contributions Cap", "The yearly limit on pre-tax super."), SUPER_CALC, TAX_BRACKETS],
  "/tax-file-number-declaration/": [L("/new-job-checklist/", "New Job Checklist", "Everything to sort out in your first week."), TAX_FREE_THRESHOLD, TAX_WITHHELD, L("/second-job-tax-calculator/", "Second Job Tax Calculator", "Why only one employer should apply the threshold.")],
  "/sapto-calculator/": [L("/pension-age-australia/", "Pension Age Australia", "When the Age Pension, and SAPTO, can start."), L("/age-pension-income-test-calculator/", "Age Pension Income Test Calculator", "Single and couple tests with the Work Bonus."), LITO, TAX_BRACKETS],
  "/salary-packaging-guide/": [L("/salary-package-calculator/", "Salary Package Calculator", "Base salary and take-home from a total package."), L("/novated-lease-calculator/", "Novated Lease Calculator", "Packaging a car, with the EV exemption."), L("/salary-sacrifice-vs-mortgage/", "Salary Sacrifice or Pay Down the Mortgage?", "Where a spare pre-tax dollar does more."), L("/salary-sacrifice-calculator/", "Salary Sacrifice Calculator", "See if sacrificing into super leaves you better off.")],
  "/teacher-pay-australia/vic/": [L("/teacher-pay-australia/", "Teacher Pay Australia", "Every state's classroom teacher scale, side by side."), L("/news/victorian-teachers-pay-rise-2026/", "Victorian Teachers' Pay Rise 2026", "The new VIC agreement and when each step lands."), TAKE_HOME, L("/salary-packaging-guide/", "Salary Packaging Guide", "What teachers can package and what it saves.")],
  "/fortnights-in-a-year/": [FORTNIGHTLY_PAY, WEEKLY_PAY, L("/fortnightly-tax-table/", "Fortnightly Tax Table", "Withholding on each fortnightly pay, including the 27-pay extra."), L("/centrelink-payment-dates/", "Centrelink Payment Dates", "When fortnightly Centrelink payments land.")],
  "/payday-super/": [L("/news/payday-super-employees-payslip/", "Payday Super and Your Payslip", "What employees see from July 2026."), L("/super-guarantee-charge/", "Super Guarantee Charge", "What late or missed super costs an employer."), EMPLOYER_COST, SUPER_CALC, WEEKLY_PAY, FORTNIGHTLY_PAY],
  // --- Oct 2026 tax and super pages (feat/oct-tax-super) ---
  "/late-tax-return-penalty/": [L("/tax-return-2026/", "Tax Return 2026 Guide", "Deadlines, refund times and what changed this year."), L("/tax-return-calculator/", "Tax Return Calculator", "Estimate your refund or bill before you lodge."), L("/tax-calendar/", "Tax Calendar 2026-27", "Every ATO date, including agent lodgment programs."), L("/tax-refund-guide/", "Tax Refund Guide", "Why refunds are what they are."), L("/work-from-home-deductions/", "Work From Home Deductions", "What to claim before you lodge."), INCOME_TAX],
  "/working-australians-tax-offset/": [L("/tax-changes-2026-27/", "Tax Changes 2026-27", "What changed on 1 July 2026, ahead of 2027."), INCOME_TAX, TAKE_HOME, PAY_RISE, TAX_BRACKETS, LITO],
  "/listo-calculator/": [SUPER_CALC, L("/super-co-contribution/", "Super Co-Contribution", "The other government top-up for lower earners."), L("/salary-sacrifice-calculator/", "Salary Sacrifice Calculator", "See if sacrificing into super leaves you better off."), LITO, L("/working-australians-tax-offset/", "Working Australians Tax Offset", "The $250 offset and 14% rate from 2027-28."), L("/super-guarantee-rate-history/", "Super Guarantee Rate History", "Every SG rate change, year by year.")],
  "/carry-forward-concessional-contributions-calculator/": [L("/concessional-contributions-cap/", "Concessional Contributions Cap", "The $32,500 cap and a one-year check."), L("/salary-sacrifice-calculator/", "Salary Sacrifice Calculator", "Take-home pay after sacrificing into super."), SUPER_CALC, L("/division-293-tax/", "Division 293 Tax", "The extra tax on high incomes and big contributions."), INCOME_TAX, TAX_BRACKETS],
  "/termination-payment-tax-calculator/": [L("/redundancy-pay-calculator/", "Redundancy Pay Calculator", "What you are owed under the NES, by years of service."), L("/final-pay-calculator/", "Final Pay Calculator", "Notice, leave and wages when you leave."), L("/bonus-tax-calculator/", "Bonus Tax Calculator", "Tax on a one-off lump sum."), L("/long-service-leave-calculator/", "Long Service Leave Calculator", "Payout on redundancy, by state."), L("/jobseeker-payment-calculator/", "JobSeeker Payment Calculator", "Income support after you finish."), INCOME_TAX],
  "/concessional-contributions-cap/": [L("/carry-forward-concessional-contributions-calculator/", "Carry-Forward Contributions Calculator", "Use five years of unused cap, year by year."), L("/salary-sacrifice-calculator/", "Salary Sacrifice Calculator", "See if sacrificing into super leaves you better off."), SUPER_CALC, L("/division-293-tax/", "Division 293 Tax", "The extra tax on high incomes."), L("/super-guarantee-rate-history/", "Super Guarantee Rate History", "Every SG rate change, year by year."), L("/listo-calculator/", "LISTO Calculator", "The super offset for incomes up to $37,000.")],
  "/superannuation-calculator/": [L("/salary-sacrifice-calculator/", "Salary Sacrifice Calculator", "See if sacrificing into super leaves you better off."), L("/concessional-contributions-cap/", "Concessional Contributions Cap", "The yearly limit on pre-tax super."), L("/listo-calculator/", "LISTO Calculator", "Low income super tax offset, $500 now and $810 from 2027."), L("/super-co-contribution/", "Super Co-Contribution", "Up to $500 from the government on after-tax contributions."), L("/super-guarantee-rate-history/", "Super Guarantee Rate History", "Every SG rate change, year by year."), L("/payday-super/", "Payday Super", "Super paid every payday from 1 July 2026.")],
  "/super-co-contribution/": [L("/listo-calculator/", "LISTO Calculator", "The other low-income super offset, on before-tax contributions."), SUPER_CALC, L("/salary-sacrifice-calculator/", "Salary Sacrifice Calculator", "See if sacrificing into super leaves you better off."), LITO, L("/concessional-contributions-cap/", "Concessional Contributions Cap", "The yearly limit on pre-tax super."), TAKE_HOME],
  "/redundancy-pay-calculator/": [L("/termination-payment-tax-calculator/", "Termination Payment Tax Calculator", "Tax on a redundancy or termination payment, with the caps."), L("/final-pay-calculator/", "Final Pay Calculator", "What you are owed when employment ends."), L("/long-service-leave-calculator/", "Long Service Leave Calculator", "The other leave entitlement, by state."), L("/leave-calculator/", "Leave Payout Calculator", "What unused annual leave is worth when you finish up."), L("/jobseeker-payment-calculator/", "JobSeeker Payment Calculator", "Income support after you finish."), TAKE_HOME],
  "/final-pay-calculator/": [L("/termination-payment-tax-calculator/", "Termination Payment Tax Calculator", "Tax on a redundancy or termination payment."), L("/redundancy-pay-calculator/", "Redundancy Pay Calculator", "Severance entitlements by years of service."), L("/leave-calculator/", "Leave Payout Calculator", "What unused annual leave is worth when you finish up."), L("/long-service-leave-calculator/", "Long Service Leave Calculator", "The other leave entitlement, by state."), LEAVE_LOADING, TAKE_HOME],
  "/tax-changes-2026-27/": [L("/working-australians-tax-offset/", "Working Australians Tax Offset", "The $250 offset and 14% rate from 1 July 2027."), INCOME_TAX, TAKE_HOME, TAX_BRACKETS, PAY_RISE, L("/tax-bracket-history/", "Tax Bracket History", "How the rates have moved, year by year.")],
};

// --- Oct core new pages (5 Oct 2026) ---------------------------------------
// Seven new pages, each linked from at least three existing pages and linking
// out to its neighbours. Kept in one block so the shared file stays easy to
// merge: new entries go into PAGE_LINKS, and links added to an existing entry
// are spliced in as its second card.
const MARGINAL_RATES = L("/marginal-tax-rates/", "Marginal Tax Rates", "What the next dollar, a raise or a bonus really costs after tax.");
const ANNUAL_LEAVE_CALC = L("/annual-leave-calculator/", "Annual Leave Calculator", "Hours accrued, your balance and what it is worth.");
const NET_PAY_CALC = L("/net-pay-calculator/", "Net Pay Calculator", "From hourly rate and hours to net pay on a payslip.");
const PILON = L("/payment-in-lieu-of-notice/", "Payment in Lieu of Notice", "NES notice periods, and the tax and super on a payout.");
const CASUAL_CONVERSION = L("/casual-conversion/", "Casual Conversion", "Becoming permanent: the 6 and 12 month rule and what it does to pay.");
const ALLOWANCES = L("/allowances-guide/", "Allowances Guide", "First aid, laundry, tool, split shift and on-call allowances by award.");
const HIGHEST_PAYING = L("/highest-paying-jobs-australia/", "Highest Paying Jobs", "Median pay for each job we cover, and what it takes home.");
const LEAVE_PAYOUT = L("/leave-calculator/", "Leave Payout Calculator", "Unused annual leave paid out when you leave.");
const ANNUAL_LEAVE_GUIDE = L("/annual-leave-guide/", "Annual Leave Guide", "Four weeks a year, how it accrues and when it can be cashed out.");
const FINAL_PAY = L("/final-pay-calculator/", "Final Pay Calculator", "Everything you are owed when employment ends.");
const REDUNDANCY = L("/redundancy-pay-calculator/", "Redundancy Pay Calculator", "NES severance by years of service, and the tax on it.");
const LSL_CALC = L("/long-service-leave-calculator/", "Long Service Leave Calculator", "Weeks accrued and what a payout is worth, in every state.");
const EMPLOYMENT_TYPES = L("/full-time-vs-part-time-vs-casual/", "Full-Time vs Part-Time vs Casual", "Leave, loading and hours compared.");

Object.assign(PAGE_LINKS, {
  // The new pages themselves
  "/marginal-tax-rates/": [TAX_BRACKETS, PAY_RISE, L("/bonus-tax-calculator/", "Bonus Tax Calculator", "Tax on a bonus, and what is withheld."), LITO, TAKE_HOME, INCOME_TAX],
  "/annual-leave-calculator/": [LEAVE_PAYOUT, ANNUAL_LEAVE_GUIDE, LEAVE_LOADING, L("/sick-leave-calculator/", "Sick Leave Calculator", "Personal/carer's leave: 10 days, 1/26 of hours."), LSL_CALC, PAYSLIP],
  "/net-pay-calculator/": [TAKE_HOME, GROSS_VS_NET, FORTNIGHTLY_PAY, L("/gross-pay-calculator/", "Gross Pay Calculator", "Work back from the net pay you want."), TAX_WITHHELD, PAYSLIP],
  "/payment-in-lieu-of-notice/": [FINAL_PAY, REDUNDANCY, LEAVE_PAYOUT, ANNUAL_LEAVE_CALC, LSL_CALC, PAYSLIP],
  "/casual-conversion/": [L("/casual-loading-calculator/", "Casual Loading Calculator", "The 25% loading and how it compares with permanent pay."), EMPLOYMENT_TYPES, ANNUAL_LEAVE_CALC, L("/sick-leave-calculator/", "Sick Leave Calculator", "Personal/carer's leave: 10 days, 1/26 of hours."), PAYSLIP, JUNIOR],
  "/allowances-guide/": [PAYSLIP, PENALTY_GUIDE, L("/travel-allowance/", "Travel Allowance", "ATO reasonable amounts for overnight work travel."), JOBS_HUB, AWARD_RATES, L("/backpay-calculator/", "Backpay Calculator", "What you are owed if you have been underpaid.")],
  "/highest-paying-jobs-australia/": [JOBS_HUB, L("/average-salary-australia/", "Average Salary Australia", "How your pay compares with the national average."), TAKE_HOME_HUB, EMPLOYERS_HUB, NET_PAY_CALC, MARGINAL_RATES],
  // Existing pages that point at them and had no card list of their own
  "/leave-calculator/": [ANNUAL_LEAVE_CALC, LEAVE_LOADING, ANNUAL_LEAVE_GUIDE, FINAL_PAY, PILON, LSL_CALC],
  "/annual-leave-guide/": [ANNUAL_LEAVE_CALC, LEAVE_PAYOUT, LEAVE_LOADING, LSL_CALC, FINAL_PAY, REDUNDANCY],
  "/final-pay-calculator/": [PILON, LEAVE_PAYOUT, REDUNDANCY, ANNUAL_LEAVE_CALC, LSL_CALC, TAKE_HOME],
  "/redundancy-pay-calculator/": [PILON, FINAL_PAY, LEAVE_PAYOUT, LSL_CALC, ANNUAL_LEAVE_GUIDE, TAKE_HOME],
  "/bonus-tax-calculator/": [L("/commission-tax-calculator/", "Commission Tax Calculator", "Annual tax on commission and what is withheld from the pay."), MARGINAL_RATES, L("/schedule-5-tax-table/", "Schedule 5 Tax Table", "ATO withholding on bonuses, commissions and back pay."), PAY_RISE, TAKE_HOME],
  "/take-home-pay-calculator/": [NET_PAY_CALC, GROSS_VS_NET, MARGINAL_RATES, TAX_WITHHELD, PAYSLIP, INCOME_TAX],
  "/full-time-vs-part-time-vs-casual/": [CASUAL_CONVERSION, L("/casual-loading-calculator/", "Casual Loading Calculator", "The 25% loading and how it compares with permanent pay."), ANNUAL_LEAVE_CALC, L("/sick-leave-calculator/", "Sick Leave Calculator", "Personal/carer's leave: 10 days, 1/26 of hours."), L("/employment-type-calculator/", "Employment Type Calculator", "Employee or contractor, worked out."), PAYSLIP],
} satisfies Record<string, RelatedLink[]>);

// Existing cards that gain a link: spliced in as the second card, so the page's
// own first priority stays where it was.
const SPLICE_SECOND: Record<string, RelatedLink[]> = {
  "/tax-brackets/": [MARGINAL_RATES],
  "/pay-rise-calculator/": [MARGINAL_RATES],
  "/low-income-tax-offset/": [MARGINAL_RATES],
  "/sick-leave-calculator/": [ANNUAL_LEAVE_CALC],
  "/leave-loading-calculator/": [ANNUAL_LEAVE_CALC],
  "/gross-vs-net-pay/": [NET_PAY_CALC],
  "/understanding-your-payslip/": [NET_PAY_CALC, ALLOWANCES],
  "/payslip-generator/": [NET_PAY_CALC],
  "/casual-loading-calculator/": [CASUAL_CONVERSION],
  "/travel-allowance/": [ALLOWANCES],
  "/cents-per-km/": [ALLOWANCES],
  "/overtime-penalty-rates-guide/": [ALLOWANCES],
  "/average-salary-australia/": [HIGHEST_PAYING],
};
for (const [path, add] of Object.entries(SPLICE_SECOND)) {
  const existing = PAGE_LINKS[path];
  if (existing) PAGE_LINKS[path] = [existing[0], ...add, ...existing.slice(1)];
}
// --- end Oct core new pages -------------------------------------------------

/**
 * Wider pool used to top up a page that filtered itself out of its own cluster.
 * Ordered by breadth of appeal — the first entries suit almost any visitor.
 */
const TOP_UP_POOL: RelatedLink[] = [
  TAKE_HOME,
  INCOME_TAX,
  TAX_BRACKETS,
  PAYSLIP,
  SUPER_CALC,
  PAY_RISE,
  { href: "/tax-return-calculator/", title: "Tax Return Calculator", blurb: "Estimate your refund before you lodge." },
  { href: "/salary-sacrifice-calculator/", title: "Salary Sacrifice Calculator", blurb: "See if sacrificing into super leaves you better off." },
  HECS_CALC,
  { href: "/site-directory/", title: "All Calculators", blurb: "Every calculator and guide on the site." },
];

/**
 * Cluster rules, evaluated in order. First match wins, so put narrow patterns
 * above broad ones.
 */
type Cluster = {
  match: (p: string) => boolean;
  links: RelatedLink[] | ((p: string) => RelatedLink[]);
  /** Cards to show. Default 4; cross-cluster bridges show up to 6. */
  limit?: number;
};

// --- Holiday pay pages (Oct 2026): the hub, its state pages and the eight holiday guides ---
const HOLIDAY_GUIDES = [
  "/christmas-day-pay-rates/",
  "/boxing-day-pay-rates/",
  "/new-years-day-pay-rates/",
  "/public-holidays-2027/",
  "/melbourne-cup-day-pay/",
  "/easter-public-holiday-pay/",
  "/australia-day-public-holiday-pay/",
  "/christmas-shutdown-annual-leave/",
];
const HOLIDAY_LINKS: RelatedLink[] = [
  L("/public-holiday-pay/", "Public Holiday Pay Rates", "Rates for 14 awards and a calculator."),
  L("/christmas-day-pay-rates/", "Christmas Day Pay Rates", "Dates by state and what the day pays."),
  L("/boxing-day-pay-rates/", "Boxing Day Pay Rates", "Saturday 26 and Monday 28 December, state by state."),
  L("/public-holidays-2027/", "Public Holidays 2027", "Every state's 2027 dates with the pay rate."),
  L("/christmas-shutdown-annual-leave/", "Christmas Shutdown Leave", "When your employer can direct annual leave."),
  L("/easter-public-holiday-pay/", "Easter 2027 Pay", "Good Friday to Easter Monday, by state."),
];

const CLUSTERS: Cluster[] = [
  {
    match: (p) => p.startsWith("/public-holiday-pay/") || HOLIDAY_GUIDES.includes(p),
    links: HOLIDAY_LINKS,
    limit: 6,
  },
  // --- F4 (Oct 2026): aviation salary pages → cabin crew award page ---
  {
    match: (p) => p === "/pilot-salary/" || p === "/air-traffic-controller-salary/",
    links: [
      job("flight-attendant", "Flight Attendant", "Cabin crew award rates and the flying allowance."),
      L("/pilot-salary/", "Pilot Salary", "Pilot pay under the Air Pilots Award and airline agreements."),
      L("/air-traffic-controller-salary/", "Air Traffic Controller Salary", "Airservices Australia agreement pay by level."),
      JOBS_HUB,
      TAKE_HOME,
      EA,
    ],
    limit: 6,
  },
  // --- Award pages: award → jobs and employers it covers ---
  {
    match: (p) => p in AWARD_LINKS,
    links: (p) => AWARD_LINKS[p],
    limit: 6,
  },
  // --- Job pages: job → its employers / award, minimum wage and the employer hub ---
  {
    match: (p) => /^\/job-pay-rates\/[^/]+\/$/.test(p),
    links: (p) => {
      const slug = p.split("/")[2];
      return [...(JOB_LINKS[slug] ?? [AWARD_RATES]), MIN_WAGE, EMPLOYERS_HUB, EA, TAKE_HOME];
    },
    limit: 6,
  },
  {
    match: (p) => p === "/job-pay-rates/",
    links: [EMPLOYERS_HUB, HIGHEST_PAYING, AWARD_RATES, MIN_WAGE, JUNIOR, L("/average-salary-australia/", "Average Salary Australia", "How your pay compares with the national average.")],
    limit: 6,
  },
  // --- Employer pages: employer → award, job, junior rates, EA explainer ---
  {
    match: (p) => p in EMPLOYER_LINKS,
    links: (p) => [...EMPLOYER_LINKS[p], JOBS_HUB, TAKE_HOME],
    limit: 6,
  },
  // --- Minimum wage by age spokes → employers and jobs that hire at that age ---
  {
    match: (p) => /^\/minimum-wage-by-age\/\d+\/$/.test(p),
    links: (p) => [...(AGE_LINKS[p.split("/")[2]] ?? []), MIN_WAGE, L("/fast-food-award-rates/", "Fast Food Award Rates", "The award behind most first jobs."), EMPLOYERS_HUB],
    limit: 6,
  },
  // --- Salary tables: take-home / tax-on / salary-to-hourly → tax core ---
  {
    match: (p) => /^\/take-home-pay-on\/\d+\/$/.test(p),
    links: (p) => [TAX_WITHHELD, taxCoreFor(salaryFromPath(p) ?? 0), FORTNIGHTLY_PAY, PAY_RISE],
  },
  {
    match: (p) => /^\/tax-on\/\d+\/$/.test(p),
    links: (p) => [taxCoreFor(salaryFromPath(p) ?? 0), TAX_WITHHELD, PAYG_TABLES, TAKE_HOME_HUB],
  },
  {
    match: (p) => /^\/salary-to-hourly\/\d+\/$/.test(p),
    // Keeps the two head-term tax pages linked from the ~300 hourly/salary
    // conversion pages (they were there via DEFAULT_LINKS before this pass).
    links: [OVERTIME, L("/salary-vs-hourly/", "Salary vs Hourly Pay", "Which suits you, and what each leaves out."), INCOME_TAX, TAX_BRACKETS],
  },
  {
    match: (p) => p.startsWith("/hourly-to-salary/"),
    links: [MIN_WAGE, L("/casual-loading-calculator/", "Casual Loading Calculator", "What a 25% loading adds to an hourly rate."), INCOME_TAX, TAX_BRACKETS],
  },
  // --- Payroll tax state pages ↔ employer cost ↔ state pay pages ---
  {
    match: (p) => /^\/payroll-tax\/[a-z]+\/$/.test(p),
    links: (p) => {
      const st = p.split("/")[2];
      return [
        PAYROLL_TAX_CALC,
        EMPLOYER_COST,
        L(`/pay-calculator-${st}/`, `${STATE_NAMES[st] ?? st.toUpperCase()} Pay Calculator`, "The employee side: take-home pay in this state."),
        L("/payday-super/", "Payday Super", "Paying SG with every pay run from July 2026."),
        L(`/minimum-wage/${st}/`, `${STATE_NAMES[st] ?? st.toUpperCase()} Minimum Wage`, "What a minimum-wage employee costs and keeps in this state."),
        L(`/public-holiday-pay/${st}/`, `${STATE_NAMES[st] ?? st.toUpperCase()} Public Holidays`, "State public holiday dates and the pay rates that go with them."),
      ];
    },
    limit: 6,
  },
  // --- Minimum wage state pages (F1, Oct 2026) ---
  {
    match: (p) => /^\/minimum-wage\/[a-z]+\/$/.test(p),
    links: (p) => {
      const st = p.split("/")[2];
      const name = STATE_NAMES[st] ?? st.toUpperCase();
      return [
        MIN_WAGE,
        L(`/payroll-tax/${st}/`, `${name} Payroll Tax`, "For employers: the threshold and rate in this state."),
        L(`/long-service-leave-calculator/${st}/`, `${name} Long Service Leave`, `Accrual and payout under ${name} long service leave law.`),
        L(`/public-holiday-pay/${st}/`, `${name} Public Holidays`, "State public holiday dates and the pay rates that go with them."),
        L(`/pay-calculator-${st}/`, `${name} Pay Calculator`, "Take-home pay at any wage in this state."),
        L("/junior-pay-rates/", "Minimum Wage by Age", "What under-21s must legally be paid."),
      ];
    },
    limit: 6,
  },
  // --- State pay calculators → payroll tax and long service leave for that state ---
  {
    match: (p) => /^\/pay-calculator-[a-z]+\/$/.test(p) && (STATES as readonly string[]).includes(p.slice(16, -1)),
    links: (p) => {
      const st = p.slice(16, -1);
      const name = STATE_NAMES[st];
      return [
        TAKE_HOME,
        L(`/minimum-wage/${st}/`, `${name} Minimum Wage`, "The rate, state rules and take-home at minimum wage."),
        L(`/long-service-leave-calculator/${st}/`, `${name} Long Service Leave`, `Accrual and payout under ${name} long service leave law.`),
        L(`/payroll-tax/${st}/`, `${name} Payroll Tax`, "For employers: the threshold and rate in this state."),
        AWARD_RATES,
        FORTNIGHTLY_PAY,
        WEEKLY_PAY,
      ];
    },
    limit: 6,
  },
  // --- Centrelink income-test spokes ↔ hub ↔ pay calculators ---
  {
    match: (p) =>
      p.startsWith("/centrelink-") ||
      ["/jobseeker-payment-calculator/", "/austudy-youth-allowance-calculator/", "/parenting-payment-calculator/", "/carer-payment-calculator/", "/carer-allowance/", "/family-tax-benefit-calculator/", "/rent-assistance-calculator/", "/cost-of-living-payment-2026/",
        // H3 Centrelink wave 3
        "/deeming-rates/", "/disability-support-pension-calculator/", "/child-care-subsidy-calculator/", "/commonwealth-seniors-health-card/"].includes(p),
    links: [
      INCOME_TEST_HUB,
      JOBSEEKER,
      L("/austudy-youth-allowance-calculator/", "Austudy & Youth Allowance Calculator", "The student income test with current rates."),
      WORKING_CREDIT,
      L("/parenting-payment-calculator/", "Parenting Payment Calculator", "Single and partnered income tests."),
      FORTNIGHTLY_PAY,
    ],
    limit: 6,
  },

  // --- Long service leave (hub + 8 jurisdiction spokes) ---
  // Listed first: the spokes must not fall through to the broader leave cluster.
  {
    match: (p) => p.startsWith("/long-service-leave-calculator/"),
    links: [
      { href: "/long-service-leave-calculator/", title: "Long Service Leave Calculator", blurb: "Weeks accrued and what a payout is worth, in every state." },
      { href: "/leave-calculator/", title: "Leave Payout Calculator", blurb: "A different entitlement: unused annual leave paid out when you leave." },
      { href: "/final-pay-calculator/", title: "Final Pay Calculator", blurb: "Everything owed when you leave a job." },
      TAKE_HOME,
    ],
  },
  // --- Teacher pay state spokes ---
  {
    match: (p) => p.startsWith("/teacher-pay-australia/") && p !== "/teacher-pay-australia/",
    links: [
      { href: "/teacher-pay-australia/", title: "Teacher Pay Australia", blurb: "Every state's classroom teacher scale, side by side." },
      TAKE_HOME,
      { href: "/salary-packaging-guide/", title: "Salary Packaging Guide", blurb: "What teachers can package and what it saves." },
      { href: "/long-service-leave-calculator/", title: "Long Service Leave Calculator", blurb: "What your accrued leave is worth." },
    ],
  },
  // --- Nurse and midwife pay state spokes ---
  {
    match: (p) => p.startsWith("/healthcare-worker-pay/") && p !== "/healthcare-worker-pay/",
    links: [
      { href: "/healthcare-worker-pay/", title: "Nurse Salary Australia by State", blurb: "Registered, enrolled and practitioner nurse pay in every state, compared." },
      OVERTIME,
      { href: "/salary-packaging-guide/", title: "Salary Packaging Guide", blurb: "Public health packaging and what it is worth." },
      TAKE_HOME,
    ],
  },
  // --- Public service pay scales (hub + jurisdictions) ---
  {
    match: (p) => p.startsWith("/public-service-pay-scales/"),
    links: [
      { href: "/public-service-pay-scales/", title: "Public Service Pay Scales", blurb: "APS and every state and territory classification side by side." },
      TAKE_HOME,
      { href: "/salary-package-calculator/", title: "Salary Package Calculator", blurb: "Turn a package including super into base salary and take-home." },
      { href: "/long-service-leave-calculator/", title: "Long Service Leave Calculator", blurb: "What your accrued leave is worth." },
    ],
  },
  // --- J6 wave 4 backlog (24 Sep 2026): school support staff state pages ---
  {
    match: (p) => p.startsWith("/school-support-staff-pay/") && p !== "/school-support-staff-pay/",
    links: [
      { href: "/school-support-staff-pay/", title: "Teacher Aide Pay by State", blurb: "Every state's school support staff rates side by side." },
      { href: "/job-pay-rates/teacher-aide/", title: "Teacher Aide Award Rates", blurb: "The minimum for private and Catholic school aides." },
      { href: "/hourly-to-annual-salary-calculator/", title: "Hourly to Salary Calculator", blurb: "Turn an hourly rate into a yearly figure." },
      TAKE_HOME,
    ],
  },
  // --- end J6 ---
  // --- Novated lease: calculator and explainer point at each other ---
  {
    match: (p) => p === "/novated-lease-calculator/" || p === "/novated-lease-guide/",
    links: [
      { href: "/novated-lease-calculator/", title: "Novated Lease Calculator", blurb: "FBT, the EV exemption and your take-home pay before and after." },
      { href: "/novated-lease-guide/", title: "How a Novated Lease Works", blurb: "The three-way agreement and the running-cost budget, explained." },
      { href: "/salary-sacrifice-calculator/", title: "Salary Sacrifice Calculator", blurb: "Compare pay before and after sacrificing." },
      { href: "/salary-packaging-guide/", title: "Salary Packaging Guide", blurb: "What else you can package, and the caps." },
    ],
  },

  // --- Junior / first job / award rates ---
  {
    match: (p) => ["/junior-pay-rates/", "/first-job-pay-guide/", "/new-job-checklist/"].includes(p),
    links: [
      AWARD_RATES,
      { href: "/retail-award-rates/", title: "Retail Award Rates", blurb: "The award covering most junior retail workers." },
      { href: "/hospitality-award-rates/", title: "Hospitality Award Rates", blurb: "Cafe, pub and restaurant minimum rates." },
      PAYSLIP,
    ],
  },
  // --- Award rate pages ---
  {
    match: (p) => p.endsWith("-award-rates/") || p === "/award-rates/" || p === "/schads-award-pay-rates/",
    links: [
      { href: "/junior-pay-rates/", title: "Junior Pay Rates", blurb: "What under-21s must legally be paid." },
      OVERTIME,
      { href: "/overtime-penalty-rates-guide/", title: "Penalty Rates Guide", blurb: "Weekends, public holidays and late nights." },
      TAKE_HOME,
    ],
  },
  // --- Superannuation ---
  {
    match: (p) => p.includes("super") || p === "/division-293-tax/" || p === "/salary-package-calculator/",
    links: [
      { href: "/salary-package-calculator/", title: "Salary Package Calculator", blurb: "Base salary and take-home from a package including super." },
      SUPER_CALC,
      { href: "/salary-sacrifice-calculator/", title: "Salary Sacrifice Calculator", blurb: "See if sacrificing into super leaves you better off." },
      { href: "/super-guarantee-rate-history/", title: "Super Guarantee Rate History", blurb: "Every SG rate change, year by year." },
      { href: "/super-co-contribution/", title: "Super Co-Contribution", blurb: "Up to $500 from the government on after-tax contributions." },
    ],
  },
  // --- Bonuses, commissions and other additional payments (Schedule 5) ---
  {
    match: (p) => p.includes("bonus") || p.includes("commission") || p === "/schedule-5-tax-table/" || p === "/backpay-calculator/",
    links: [
      { href: "/bonus-tax-calculator/", title: "Bonus Tax Calculator", blurb: "Tax on a bonus at your marginal rate." },
      { href: "/commission-tax-calculator/", title: "Commission Tax Calculator", blurb: "Annual tax on commission and what is withheld from the pay." },
      { href: "/schedule-5-tax-table/", title: "Schedule 5 Tax Table", blurb: "ATO withholding on bonuses, commissions and back pay." },
      { href: "/pay-rise-calculator/", title: "Pay Rise Calculator", blurb: "What a permanent increase is worth after tax." },
      TAKE_HOME,
    ],
  },
  // --- Centrelink income tests ---
  {
    match: (p) => p.includes("centrelink") || p.includes("jobseeker") || p.includes("austudy") || p.includes("age-pension") || p === "/parental-leave-pay/" || p === "/sapto-calculator/",
    links: [
      { href: "/jobseeker-payment-calculator/", title: "JobSeeker Payment Calculator", blurb: "What you keep of JobSeeker when you work part-time." },
      { href: "/austudy-youth-allowance-calculator/", title: "Austudy & Youth Allowance Calculator", blurb: "The student income test with current rates." },
      { href: "/age-pension-income-test-calculator/", title: "Age Pension Income Test Calculator", blurb: "Single and couple tests with the Work Bonus." },
      { href: "/centrelink-income-test/", title: "Centrelink Income Test Guide", blurb: "How free areas, tapers and cut-offs work." },
      { href: "/pension-age-australia/", title: "Pension Age Australia", blurb: "The Age Pension qualifying age, 67, and how it got there." },
    ],
  },
  // --- HECS / student debt ---
  {
    match: (p) => p.includes("hecs") || p === "/stsl-on-payslip/",
    links: [
      HECS_CALC,
      { href: "/extra-super-vs-hecs-repayment/", title: "Extra Super vs HECS", blurb: "Which is the better use of a spare dollar?" },
      TAKE_HOME,
    ],
  },
  // --- Tax tables / withholding ---
  {
    match: (p) => p.endsWith("-tax-table/") || p === "/payg-withholding-tables/",
    links: [
      WEEKLY_PAY,
      FORTNIGHTLY_PAY,
      TAX_WITHHELD,
      { href: "/weekly-tax-table/", title: "Weekly Tax Table", blurb: "PAYG withholding for weekly pay cycles." },
      { href: "/fortnightly-tax-table/", title: "Fortnightly Tax Table", blurb: "PAYG withholding for fortnightly pay cycles." },
      PAYSLIP,
      { href: "/monthly-tax-table/", title: "Monthly Tax Table", blurb: "PAYG withholding for monthly pay cycles." },
    ],
    limit: 6,
  },
  // --- Leave, redundancy, final pay ---
  {
    match: (p) => ["/annual-leave-guide/", "/leave-calculator/", "/redundancy-pay-calculator/", "/final-pay-calculator/", "/parental-leave-pay/"].includes(p),
    links: [
      LEAVE_LOADING,
      { href: "/annual-leave-guide/", title: "Annual Leave Guide", blurb: "Four weeks a year, how it accrues and when it can be cashed out." },
      { href: "/leave-calculator/", title: "Leave Payout Calculator", blurb: "What unused annual leave is worth when you finish up." },
      { href: "/long-service-leave-calculator/", title: "Long Service Leave Calculator", blurb: "The other leave entitlement — 7 or 10 years, by state." },
      { href: "/final-pay-calculator/", title: "Final Pay Calculator", blurb: "What you're owed when employment ends." },
      { href: "/redundancy-pay-calculator/", title: "Redundancy Pay Calculator", blurb: "Severance entitlements by years of service." },
      TAKE_HOME,
    ],
  },
  // --- Contractor / employment type ---
  {
    match: (p) => p.includes("contractor") || p.includes("employment-type") || p === "/employee-vs-sole-trader-vs-company/" || p === "/full-time-vs-part-time-vs-casual/" || p === "/salary-vs-hourly/" || p === "/gig-economy-pay-guide/",
    links: [
      { href: "/contractor-pay-calculator/", title: "Contractor Pay Calculator", blurb: "Convert a contract rate to real take-home." },
      { href: "/contractor-vs-employee-calculator/", title: "Contractor vs Employee", blurb: "Compare both sides on the same income." },
      { href: "/employer-cost-calculator/", title: "Employer Cost Calculator", blurb: "The full cost of employing someone." },
      { href: "/gig-economy-pay-guide/", title: "Gig Economy Pay Guide", blurb: "Rideshare and delivery earnings, tax and super." },
      TAKE_HOME,
    ],
  },
  // --- Tax guides / deductions / returns ---
  {
    match: (p) => p.includes("tax-refund") || p.includes("deduction") || p === "/tax-return-calculator/" || p === "/tax-return-2026/" || p === "/notice-of-assessment/" || p === "/work-from-home-deductions/" || p === "/tax-calendar/" || p === "/capital-gains-tax-calculator/",
    links: [
      { href: "/tax-return-calculator/", title: "Tax Return Calculator", blurb: "Estimate your refund before you lodge." },
      { href: "/tax-return-2026/", title: "Tax Return 2026 Guide", blurb: "Lodgement deadlines, refund times and what changed this year." },
      { href: "/tax-deductions-guide/", title: "Tax Deductions Guide", blurb: "What you can actually claim." },
      { href: "/notice-of-assessment/", title: "Notice of Assessment", blurb: "Reading the ATO's verdict on your return." },
      { href: "/late-tax-return-penalty/", title: "Late Tax Return Penalty", blurb: "The failure-to-lodge penalty and when the ATO waives it." },
      { href: "/ytd-income-calculator/", title: "YTD Income Calculator", blurb: "Annualise your year-to-date pay from a payslip." },
    ],
    limit: 6,
  },
  // --- Pay frequency calculators ---
  {
    match: (p) => ["/weekly-pay-calculator/", "/fortnightly-pay-calculator/", "/monthly-pay-calculator/", "/annual-pay-calculator/", "/gross-pay-calculator/", "/hourly-to-salary/", "/hourly-to-annual-salary-calculator/", "/ytd-income-calculator/", "/work-hours-calculator/"].includes(p),
    links: [WEEKLY_PAY, FORTNIGHTLY_PAY, TAKE_HOME, INCOME_TAX, OVERTIME, PAYSLIP],
    limit: 6,
  },
  // --- Occupation / salary guides ---
  {
    match: (p) => ["/teacher-pay-australia/", "/healthcare-worker-pay/", "/construction-trades-pay/", "/mining-fifo-pay-guide/", "/tech-salary-guide-australia/", "/retail-hospitality-pay-guide/", "/average-salary-australia/"].includes(p),
    links: [TAKE_HOME, { href: "/pay-rise-calculator/", title: "Pay Rise Calculator", blurb: "What a raise actually adds to each pay." }, AWARD_RATES, INCOME_TAX],
  },
  // --- News posts with no topical cluster above: back to the news index ---
  {
    match: (p) => p.startsWith("/news/"),
    links: [L("/news/", "Pay and Tax News", "Every rate change and rule change, as it happens."), L("/tax-changes-2026-27/", "Tax Changes 2026-27", "Everything that changed on 1 July."), L("/australian-pay-report-2026/", "Australian Pay Report 2026", "What Australians earn and keep, in charts and CSVs."), TAKE_HOME],
  },
];

/** Most cards any page shows. Keeps the grid even (2 columns). */
const MAX_LINKS = 6;

export function getRelatedLinks(pathname: string): RelatedLink[] {
  // Normalise to a trailing slash so `/tax-brackets` and `/tax-brackets/` match.
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;

  let links: RelatedLink[];
  let limit = 4;
  if (path in PAGE_LINKS) {
    links = PAGE_LINKS[path];
    limit = MAX_LINKS;
  } else {
    const cluster = CLUSTERS.find((c) => c.match(path));
    links = !cluster ? DEFAULT_LINKS : typeof cluster.links === "function" ? cluster.links(path) : cluster.links;
    limit = Math.min(cluster?.limit ?? 4, MAX_LINKS);
  }

  // Never link a page to itself, and never show the same destination twice.
  const filtered = links.filter((l, i) => l.href !== path && links.findIndex((x) => x.href === l.href) === i);

  // Top up if self-filtering left us short. This draws from a wider pool than
  // DEFAULT_LINKS on purpose: a page that IS one of the defaults would
  // otherwise filter itself out and have nothing left to top up with.
  if (filtered.length < 3) {
    for (const fallback of TOP_UP_POOL) {
      if (filtered.length >= 4) break;
      if (fallback.href !== path && !filtered.some((l) => l.href === fallback.href)) {
        filtered.push(fallback);
      }
    }
  }

  const out = filtered.slice(0, limit);
  // An odd count above four leaves a hole in the two-column grid.
  return out.length > 4 && out.length % 2 === 1 ? out.slice(0, out.length - 1) : out;
}
