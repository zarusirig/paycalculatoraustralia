// =============================================================================
// Payroll tax — what genuinely differs in each state and territory.
//
// The eight /payroll-tax/{state}/ pages used to share most of their prose
// (taxable wages, grouping, "employees don't pay it", the all-states table).
// That shared material now lives once on the /payroll-tax/ hub. This module
// holds each jurisdiction's own rules: its revenue office's worked examples,
// levies and concessions, grouping and contractor provisions, and how returns
// are lodged. Every statement was read from the revenue office's own page on
// PAYROLL_TAX_STATE_DETAIL_VERIFIED_ON via Firecrawl (raw markdown); the URL
// sits in `sources`. Figures used in worked examples are also pinned against
// the engine in lib/constants/__tests__/payroll-tax.test.ts.
//
// Server-safe (no "use client"): page.tsx builds FAQPage JSON-LD from `faqs`.
// =============================================================================

import type { SourceLink } from "@/components/common/source-attribution";
import type { PayrollTaxStateCode } from "@/lib/constants/payroll-tax";

export const PAYROLL_TAX_STATE_DETAIL_VERIFIED_ON = "10 October 2026";

export interface StateFaq {
  q: string;
  a: string;
}

export interface PayrollTaxStateDetail {
  /** The Act(s) the revenue office administers, as it names them. */
  legislation: string;
  /** The revenue office's own worked examples, in prose. */
  workedExample: string[];
  /** Heading for the levies / concessions section. */
  leviesHeading: string;
  levies: string[];
  grouping: string[];
  contractorsHeading: string;
  contractors: string[];
  lodgement: string[];
  /** Questions this jurisdiction answers differently (appended to the shared state FAQs). */
  faqs: StateFaq[];
  sources: SourceLink[];
}

const NSW = "Revenue NSW";
const VIC = "State Revenue Office Victoria";
const QLD = "Queensland Revenue Office";
const WA = "RevenueWA (Department of Treasury and Finance)";
const SA = "RevenueSA";
const TAS = "State Revenue Office Tasmania";
const ACT = "ACT Revenue Office";
const NT = "Territory Revenue Office";

export const PAYROLL_TAX_STATE_DETAIL: Record<PayrollTaxStateCode, PayrollTaxStateDetail> = {
  // ---------------------------------------------------------------------------
  nsw: {
    legislation: "Payroll Tax Act 2007 (NSW)",
    workedExample: [
      "Revenue NSW's own examples: an employer paying $1.5 million of NSW wages for the whole year is taxed on $300,000, which is $16,350 at 5.45%. A business with $900,000 of NSW wages out of $3 million Australia-wide gets $1.2 million × $900,000 ÷ $3 million = $360,000 of threshold and is taxed on $540,000.",
      "A part-year employer gets the threshold for the days it employed: $1.2 million × 184 ÷ 365 = $604,931.51, so $1.5 million paid over 184 days is taxed on $895,068.49.",
    ],
    leviesHeading: "No Surcharge, but an Apprentice Rebate",
    levies: [
      "NSW adds no levy or surcharge to the 5.45% rate and has no regional rate. Its main concession is a rebate on wages paid to apprentices and new entrant trainees approved by Training Services NSW. Existing-worker traineeships do not qualify, and where a group training organisation (GTO) places the apprentice, only the GTO can claim — not the host employer. Wages paid by non-profit GTOs approved by Training Services NSW are exempt outright.",
    ],
    grouping: [
      "Only one member of a NSW group, the designated group employer, claims the $1.2 million. Groups arise from related corporations under section 50 of the Corporations Act, common control, tracing of interests, common employees and subsuming smaller groups into a larger one; NSW Public Service agencies and state-owned corporations have their own rules. Groups can now create a group, change members and upload documents themselves in Payroll Tax Online, and a group can use a Group Single Lodger.",
      "NSW also targets phoenix activity. Since amendments to the Payroll Tax Act 2007 in September 2023, a successor business and a former entity form a group if both were sufficiently influenced by the same third party, which lets Revenue NSW recover unpaid payroll tax from employers that have engaged in illegal phoenix activity — and it can now penalise directors and intermediaries who promote phoenix schemes.",
    ],
    contractorsHeading: "Contractors and Owner-Drivers",
    contractors: [
      "Payments under a “relevant contract” — any arrangement where a contractor supplies the services of a worker — are taxable unless one of seven contractor exemptions applies, and if one does, every payment to that contractor is exempt. Only the labour component is taxed: materials, tools, equipment, a vehicle and GST are not, and where an invoice does not split them you can deduct the percentage for the trade in Revenue Ruling PTA 018. Keep the evidence — ABN, contracts, invoices, days worked, proof of services to the public — for at least five years.",
      "From 21 April 2026 the Fair Work Commission's Road Transport Contractual Chain Order makes transport businesses pay owner-drivers more for fuel. Revenue NSW says those fuel contributions do not affect the owner-driver exemption in section 32(2)(d) of the Payroll Tax Act 2007.",
    ],
    lodgement: [
      "If your annual NSW liability is more than $20,000 you must pay monthly and lodge a nil return for any month without taxable wages. Under $20,000 you can pay monthly or just lodge the annual return, which every registered business must lodge by 28 July, even if it is nil.",
      "Monthly lodgers whose annual liability is under $150,000 can use the estimate method instead of actual wages: last year's tax × 1.03 ÷ days employed × (365 ÷ 12). Revenue NSW's example turns $35,000 of tax last year into $98.77 a day, or $3,004 a month. Above $150,000 you must use actual wages.",
    ],
    faqs: [
      {
        q: "Can I pay NSW payroll tax annually instead of monthly?",
        a: "Yes, if your annual NSW payroll tax liability is less than $20,000: you must lodge the annual return by 28 July and can choose whether to pay monthly. Above $20,000 you must pay every month and lodge nil returns for months with no taxable wages.",
      },
      {
        q: "What is the NSW payroll tax estimate method?",
        a: "A way for monthly lodgers with an annual liability under $150,000 to pay a fixed estimate each month instead of calculating actual wages: last year's tax × 1.03, divided by the days employed, times 365 ÷ 12. The annual return then trues it up. Above $150,000 you must use actual wages.",
      },
      {
        q: "Are payments to contractors subject to NSW payroll tax?",
        a: "Often. Payments under a relevant contract are taxable unless one of seven contractor exemptions applies. Only the labour component counts — materials, tools, equipment, vehicles and GST are excluded — and owner-drivers' fuel contributions under the 2026 Road Transport Contractual Chain Order do not affect their exemption.",
      },
    ],
    sources: [
      { title: "Key dates for payroll tax", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/lodge-and-pay-returns/key-dates", publisher: NSW },
      { title: "Calculate and pay your monthly return", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/lodge-and-pay-returns/monthly-return", publisher: NSW },
      { title: "Register for payroll tax", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/registration/register-for-payroll-tax", publisher: NSW },
      { title: "Payroll tax grouping", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/grouping", publisher: NSW },
      { title: "Payroll tax grouping for illegal phoenix operators", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/grouping/illegal-phoenix-operators", publisher: NSW },
      { title: "Contractors and payroll tax", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/taxable-wages/contractors", publisher: NSW },
      { title: "Apprentice and trainee wages", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/taxable-wages/apprentice-and-trainee-wages", publisher: NSW },
    ],
  },

  // ---------------------------------------------------------------------------
  vic: {
    legislation: "Payroll Tax Act 2007 (Vic)",
    workedExample: [
      "SRO Victoria's phase-out example: a metropolitan employer with $4.2 million of Victorian wages in 2024-25 (a $900,000 threshold and 45% phase-out that year) got $900,000 − ($4.2 million − $3 million) × 45% = $360,000. On the current $1 million threshold and 50% rate, a Victoria-only employer can shortcut it as ($5 million − wages) × 50%, so the same $4.2 million now leaves a $400,000 threshold.",
      "Surcharge thresholds are shared out the same way. SRO's Company B paid $80 million in Victoria and $70 million in NSW in 2025-26, so its thresholds were $10 million × 80 ÷ 150 = $5,333,333.33 and $100 million × 80 ÷ 150 = $53,333,333.33.",
    ],
    leviesHeading: "Mental Health and COVID-19 Debt Surcharges, and the Regional Rate",
    levies: [
      "Two surcharges sit on top of the 4.85% rate once Australian wages pass $10 million a year ($833,333 a month). The mental health and wellbeing surcharge was a recommendation of the Royal Commission into Victoria's mental health system and has applied since 1 January 2022; the COVID-19 debt temporary surcharge runs from 1 July 2023 to 30 June 2033. Each is 0.5% — 1% combined — on Victorian wages above the apportioned $10 million, and each adds another 0.5% above $100 million ($8,333,333 a month). Both are calculated automatically in your returns.",
      "Regional employers pay 1.2125%, a quarter of the standard rate, if at least 85% of their Victorian taxable wages go to regional employees — people who do more than half of their Victorian work for you in regional Victoria. The 85% test is applied to each monthly return and again for the year, so a business that misses it for a few months can still get the lower rate, and a refund, at the annual reconciliation. In a group, each member is tested on its own.",
    ],
    grouping: [
      "Under section 70 of Victoria's Payroll Tax Act 2007, related corporations form a mandatory group: section 79(3) stops the Commissioner excluding a related corporation even if its business is independent. Groups formed through common employees, common control or tracing can apply to SRO for exclusion.",
      "Common-employee grouping was tested in Commissioner of State Revenue v Liquid Rock Constructions [2012] VSC 329. For trusts, anyone who may benefit from a discretionary trust is deemed to hold more than 50% of it, so a family trust is readily grouped with other businesses the same family controls.",
    ],
    contractorsHeading: "Contractors, Agencies and Medical Practices",
    contractors: [
      "SRO Victoria warns that contractor arrangements can be relevant contracts and still be taxable, and it publishes industry guidance for the two sectors where this bites hardest: employment agencies, which may owe tax on the wages of workers they place (with a declaration for chains of on-hire), and medical businesses, which must assess payroll tax on practitioners from GPs and dentists to physiotherapists and pharmacists.",
      "From 1 July 2025 a Victorian GP business's wages for GP work are exempt in proportion to its fully-funded consultations: exempt wages = A × B ÷ C, where A is GP wages, B is income from fully-funded GP items and C is income from all GP items (consumables excluded). SRO's example: $20,000 of GP wages × $12,000 ÷ $30,000 = $8,000 exempt, $12,000 taxable. Allied health and dental businesses are not covered.",
    ],
    lodgement: [
      "Returns are lodged and paid through PTX Express: monthly by the 7th, and an electronic annual reconciliation (e-AR) by 21 July with no extensions. Miss it and penalty tax of up to 25% plus interest can apply. The e-AR opens in mid-June, takes about 30 minutes, includes June's wages, and can be edited until early May the following year.",
      "Your registration letter says whether you are on a monthly or an annual return cycle; monthly lodgers must report wages every month even when no tax is owed, and an employer on the annual cycle that wants to switch to monthly asks SRO.",
    ],
    faqs: [
      {
        q: "What are the Victorian payroll tax surcharges?",
        a: "The mental health and wellbeing surcharge (since 1 January 2022) and the COVID-19 debt temporary surcharge (1 July 2023 to 30 June 2033). Each is 0.5% on Victorian wages above an apportioned $10 million of Australian wages, plus another 0.5% each above $100 million — 1% combined from $10 million, 2% from $100 million.",
      },
      {
        q: "Who qualifies for the regional payroll tax rate in Victoria?",
        a: "Employers that pay at least 85% of their Victorian taxable wages to regional employees, meaning employees who do more than half of their Victorian work for the employer in regional Victoria. They pay 1.2125% instead of 4.85%. The test applies monthly and for the full year, and each member of a group is assessed separately.",
      },
      {
        q: "Is GP income exempt from Victorian payroll tax?",
        a: "Partly. From 1 July 2025 wages a GP medical business pays for GP work are exempt in the proportion that its GP income comes from fully-funded items: exempt wages = GP wages × fully-funded GP income ÷ all GP income, excluding consumables. It does not cover allied health or dental businesses.",
      },
    ],
    sources: [
      { title: "Threshold and phase-out rate", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/thresholds-and-grouping/threshold-and-phase-out-rate", publisher: VIC },
      { title: "Payroll tax surcharges", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/thresholds-and-grouping/payroll-tax-surcharges", publisher: VIC },
      { title: "Regional employers", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/industries-and-locations/regional-employers", publisher: VIC },
      { title: "Grouping", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/thresholds-and-grouping/grouping", publisher: VIC },
      { title: "Medical industry", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/industries-and-locations/medical-industry", publisher: VIC },
      { title: "Lodge your annual reconciliation", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/managing-your-payroll-tax/lodge-your-annual-reconciliation", publisher: VIC },
      { title: "Lodge your monthly return", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/managing-your-payroll-tax/lodge-your-monthly-return", publisher: VIC },
    ],
  },

  // ---------------------------------------------------------------------------
  qld: {
    legislation: "Queensland payroll tax legislation, administered by the Queensland Revenue Office",
    workedExample: [
      "QRO's mental health levy examples: Company A, not grouped, pays $112 million, all in Queensland. Its primary levy is ($112 million − $10 million) × 0.25% = $255,000 and its additional levy ($112 million − $100 million) × 0.5% = $60,000 — $315,000 on top of payroll tax. Company C pays $4 million in Queensland out of $16 million Australia-wide, so its threshold is $10 million × 4 ÷ 16 = $2.5 million and its levy ($4 million − $2.5 million) × 0.25% = $3,750.",
      "The deduction also runs month by month: up to $108,333, reduced by $1 for every $7 of monthly wages above that, and nil once monthly wages reach $866,666.",
    ],
    leviesHeading: "Mental Health Levy, Regional Discount and Apprentice Rebate",
    levies: [
      "The mental health levy is charged on Queensland wages above the apportioned thresholds once Australian wages pass $10 million: 0.25%, plus a further 0.5% above $100 million. Thresholds are adjusted for groups, interstate wages, part years and periodic returns, and in a group only the designated group employer reconciles the levy in its annual return.",
      "Regional employers get 1 percentage point off — 3.75% or 3.95% — until 30 June 2030, unless Australian wages exceed $350 million. You qualify if your principal place of employment (your ABN business address) is in regional Queensland and at least 85% of your Queensland wages go to employees whose principal place of residence is there: the Cairns, Central Queensland, Darling Downs–Maranoa, Mackay–Isaac–Whitsunday, Queensland–Outback, Townsville and Wide Bay regions. Working holiday makers and PALM scheme workers in temporary accommodation generally do not count. Eligibility is tested at every return.",
      "Apprentice and trainee wages are exempt, and a 50% rebate applies on top for each year from 1 July 2016 to 30 June 2027: half of those wages × your rate comes off your liability. QRO's example: $50,000 of apprentice wages in a month cuts a $10,000 liability by $1,187.50.",
    ],
    grouping: [
      "A business can be grouped even if it does not employ in Queensland. Only the designated group employer (DGE) can claim the deduction, and only while the group's Australian wages are under $10.4 million. If the DGE's deduction is bigger than its own wages it can nominate another member registered in Queensland to take the excess; the excess cannot be split, and if no one is nominated QRO decides.",
      "Deductions come in three types. A non-grouped employer paying only Queensland wages claims an actual periodic deduction worked out on each return. An employer with interstate wages, or a DGE, sets a fixed periodic deduction at 1 July and must recalculate it if wages move more than 30% from the estimate. The annual deduction is calculated when the annual return is lodged.",
    ],
    contractorsHeading: "Relevant Contracts and General Practitioners",
    contractors: [
      "In Queensland a relevant contract is any arrangement where you supply services, are supplied with services, or re-supply goods (hand goods to someone to work on and get them back altered). Arrangements for services are almost always relevant contracts and are taxable unless one of nine exemptions applies; if they are taxable you may still deduct the non-labour component.",
      "General practitioners are the exception QRO spells out. After an amnesty on payments to contracted GPs, wages a medical practice pays to a GP — as contractor or employee — have been exempt since 1 December 2024, and the Revenue Legislation Amendment Bill 2024 made that permanent.",
    ],
    lodgement: [
      "Register within 7 days of the first month in which Australian wages, yours or your group's, exceed $25,000 a week — even if you expect to stay under $1.3 million for the year.",
      "Monthly and half-yearly lodgers file periodic returns 7 days after the period ends; the July–December half-year and the December month are both due 14 January 2027. There is no June return: June goes into the annual return due 21 July 2027. A final return is due within 21 days of a change of status.",
    ],
    faqs: [
      {
        q: "What is the Queensland mental health levy?",
        a: "A levy on top of payroll tax for employers and groups with more than $10 million of Australian taxable wages: 0.25% on Queensland wages above the apportioned $10 million, plus 0.5% above an apportioned $100 million. A non-grouped Queensland-only employer paying $112 million pays $255,000 + $60,000 = $315,000.",
      },
      {
        q: "Who gets the Queensland regional payroll tax discount?",
        a: "Employers whose ABN business address is in regional Queensland and who pay at least 85% of their Queensland taxable wages to employees who usually live there. They pay 3.75% (or 3.95% above $6.5 million) until 30 June 2030, but not if Australian wages exceed $350 million.",
      },
      {
        q: "Is there a payroll tax rebate for apprentices in Queensland?",
        a: "Yes. Apprentice and trainee wages are exempt, and you also get a rebate of 50% of those wages multiplied by your payroll tax rate, for each financial year from 1 July 2016 to 30 June 2027. It is calculated automatically in QRO Online.",
      },
    ],
    sources: [
      { title: "Payroll tax deductions", url: "https://qro.qld.gov.au/payroll-tax/calculate/deductions/", publisher: QLD },
      { title: "Payroll tax discount for regional businesses", url: "https://qro.qld.gov.au/payroll-tax/calculate/regional-discount/", publisher: QLD },
      { title: "Calculating the mental health levy", url: "https://qro.qld.gov.au/payroll-tax/mental-health-levy/calculating/", publisher: QLD },
      { title: "Apprentice and trainee rebate", url: "https://qro.qld.gov.au/payroll-tax/exemptions/apprentice-rebate/", publisher: QLD },
      { title: "Relevant contracts and payroll tax", url: "https://qro.qld.gov.au/payroll-tax/liability/contractor-payments/relevant-contracts/", publisher: QLD },
      { title: "Payroll tax amnesty for contracted general practitioners", url: "https://qro.qld.gov.au/payroll-tax/liability/contractor-payments/amnesty-general-practitioners/", publisher: QLD },
      { title: "Register for payroll tax", url: "https://qro.qld.gov.au/payroll-tax/register/", publisher: QLD },
      { title: "Payroll tax due dates", url: "https://qro.qld.gov.au/payroll-tax/returns/due-dates/", publisher: QLD },
    ],
  },

  // ---------------------------------------------------------------------------
  wa: {
    legislation: "Pay-roll Tax Act 2002 and Pay-roll Tax Assessment Act 2002 (WA)",
    workedExample: [
      "RevenueWA's examples: $1.2 million of annual wages gives a deductable amount of $1,000,000 − ($200,000 × 2/13) = $969,231 and tax of $12,692.30. Monthly wages of $92,000 ($1,104,000 for the year) give $6,600 for the year. An interstate employer with $1 million in WA out of $4 million Australia-wide gets a deductable amount of $134,616 and pays $47,596.12.",
      "Under an arrangement with the Commonwealth, WA also collects payroll tax in the Indian Ocean Territories (Christmas Island and the Cocos (Keeling) Islands): Australian wages decide whether you are liable, but you pay only on wages paid in WA or the IOT.",
    ],
    leviesHeading: "One Rate, No Levy — and Two Exemptions to Know",
    levies: [
      "WA charges a single 5.5% with no surcharge. The higher tiers for very large employers (6% above $100 million and 6.5% above $1.5 billion of Australian wages) no longer apply; RevenueWA lists them as previous rates that ended on 30 June 2023.",
      "Apprentices' wages under a registered training contract are exempt for the life of the contract (not while it is suspended), but trainees under contracts registered from 1 July 2019 are taxable. Section 41C of the Pay-roll Tax Assessment Act exempts the wages of new employees with a disability for their first two years.",
    ],
    grouping: [
      "Only the designated group employer claims the deductable amount during the year. If a group does not nominate one, RevenueWA may — in most cases the member with the highest share of WA wages — and a business that is the only group member employing in WA is automatically its DGE. Every member still registers and lodges its own return, and the group's tax is worked out on its combined wages.",
      "Group members other than the DGE get no estimated monthly deductable amount. RevenueWA completes the annual reconciliation itself in mid-August, once all members have submitted their wages by 21 July, and raises a debit or credit for the gap between the estimated and actual deductable amount. Exclusion from a group is possible for common-employee and tracing groups, but never for a related corporation.",
    ],
    contractorsHeading: "Contractors: WA Is Not Harmonised",
    contractors: [
      "WA is the one jurisdiction that has not harmonised its contractor rules. It has no relevant-contract provisions: payments to a contractor are taxable only where the relationship is akin to employment under the common law tests (control, integration, the power to delegate, whether the contractor runs an independent business), judged on the totality of the relationship. If it is, every payment is taxable apart from the GST.",
      "If you are unsure, RevenueWA will make a determination: complete form FPRT6 “Questionnaire: Contractor Payments” and it may interview both you and the contractor. Employment agents are deemed the employer of workers they place — a temp paid $140 a day from a $200 daily fee is taxed on the $140.",
    ],
    lodgement: [
      "Register within seven days after the end of the month in which you pay wages in WA or the Indian Ocean Territories and your Australian wages pass $83,333.",
      "Returns are monthly unless you ask for less often: quarterly if your estimated annual liability is under $150,000, annually if it is under $20,000. Monthly and quarterly returns are due 7 days after the period; annual returns and the annual reconciliation (with June) are due 21 days after the year ends, on 21 July.",
    ],
    faqs: [
      {
        q: "Are contractors subject to payroll tax in WA?",
        a: "Only if the relationship is effectively employment under the common law tests. Unlike the other states and territories, WA has no relevant-contract provisions. Where a contractor is in substance an employee, all payments are taxable except the GST. RevenueWA will make a determination if you lodge form FPRT6.",
      },
      {
        q: "Can I lodge WA payroll tax returns quarterly or annually?",
        a: "Yes, on request. RevenueWA allows quarterly returns where the estimated annual liability is under $150,000 and annual returns where it is under $20,000. Quarterly returns are due 7 days after the quarter; annual returns 21 days after the year ends.",
      },
      {
        q: "Are apprentice and trainee wages exempt from WA payroll tax?",
        a: "Apprentices' wages are exempt for the duration of a registered training contract, except while it is suspended. Trainees under contracts registered from 1 July 2019 are not exempt.",
      },
    ],
    sources: [
      { title: "Registration: Payroll Tax Employer Guide", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/registration-payroll-tax-employer-guide", publisher: WA },
      { title: "Returns: Payroll Tax Employer Guide", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/returns-payroll-tax-employer-guide", publisher: WA },
      { title: "Annual reconciliation: Payroll Tax Employer Guide", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/annual-reconciliation-payroll-tax-employer-guide", publisher: WA },
      { title: "Grouping: Payroll Tax Employer Guide", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/grouping-payroll-tax-employer-guide", publisher: WA },
      { title: "Exemptions: Payroll Tax Employer Guide", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/exemptions-payroll-tax-employer-guide", publisher: WA },
      { title: "Contractor payments: Payroll Tax Employer Guide", url: "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/wages-payroll-tax-employer-guide/taxable-wages-payroll-tax-employer-guide/contractor-payments-payroll-tax-employer-guide", publisher: WA },
      { title: "About payroll tax", url: "https://www.wa.gov.au/organisation/department-of-treasury-and-finance/about-payroll-tax", publisher: WA },
    ],
  },

  // ---------------------------------------------------------------------------
  sa: {
    legislation: "Payroll Tax Act 2009 (SA) and Payroll Tax Regulations 2025",
    workedExample: [
      "RevenueSA's example: Business ABC employs only in South Australia and pays $1.6 million. Its deduction is $600,000, so tax is charged on $1 million — at the variable rate for $1.6 million of Australian wages, 2.475% (RevenueSA's rate table shows it truncated to 2.47%), which is $24,750.",
      "A part-year employer's wages are annualised to find the rate. RevenueSA's Business Pty Ltd traded for 211 days and paid $1 million: $1 million ÷ 211 × 365 = $1,729,857, which is over $1.7 million, so the full 4.95% applies.",
    ],
    leviesHeading: "No Levy, but a Rate That Is Only Final in July",
    levies: [
      "SA has no surcharge. Its quirk is the variable rate: because the rate depends on the full year's Australian wages, monthly returns use an estimated rate that RevenueSA Online sets from the annual wages you declare at the start of the year. The true rate is only fixed at the annual reconciliation in July, when you get a refund or pay the shortfall — so RevenueSA asks employers to keep their estimate up to date during the year.",
      "Apprentice and trainee wages are taxable for training contracts started on or after 1 July 2022 (and on or before 9 November 2020); contracts begun between 10 November 2020 and 30 June 2022 were exempt for their first 12 months. Motor vehicle and accommodation allowances are exempt up to 88 cents a kilometre and $328.85 a night in 2026-27.",
    ],
    grouping: [
      "RevenueSA groups employers in four ways: related bodies corporate, common employees, commonly controlled businesses and tracing of interests. The designated group employer must employ in South Australia and claims the group's deduction of up to $600,000; if the group nominates no one, the Commissioner can designate a member. The DGE does not have to be the same member in every state.",
      "If the DGE has not used the group's full deduction by the end of the year, it can allocate the unused part to other members at the annual reconciliation — RevenueSA suggests the DGE lodges its reconciliation first. Each registered member lodges its own return, and businesses operating under one ABN must combine their wages.",
    ],
    contractorsHeading: "Contractors: Six Exemptions",
    contractors: [
      "A relevant contract in SA is one for being supplied with services, supplying services, or giving out goods for re-supply. Payments under it are not taxable if the services are one of three types the legislation exempts, or if any one of six exemptions in the Act applies; otherwise they are wages.",
      "Where a contract mixes labour with equipment or materials and does not split them, the Commissioner allows a set percentage deduction for the non-labour part by trade, listed in Revenue Ruling PTA018.",
    ],
    lodgement: [
      "Register once Australia-wide wages, yours or your group's, exceed $1.5 million a year — $125,000 a month or $28,846 a week — and you pay wages in South Australia. The Commissioner sets whether you lodge monthly or annually.",
      "Monthly payroll tax is due by the 7th of the following month. The annual reconciliation is due 28 July — Wednesday 28 July 2027 for 2026-27 — and RevenueSA accepts it on the next business day if 28 July falls on a weekend or public holiday.",
    ],
    faqs: [
      {
        q: "Why does my SA payroll tax rate change at the annual reconciliation?",
        a: "Because SA's rate depends on your full-year Australian wages (0% to 4.95% between $1.5 million and $1.7 million). Monthly returns use an estimated rate based on the annual wages you declare at the start of the year; the actual rate is set at the July annual reconciliation, with a refund or a shortfall to pay.",
      },
      {
        q: "Are apprentice wages exempt from SA payroll tax?",
        a: "Not for new contracts. Wages under training contracts started on or after 1 July 2022 are taxable. Contracts started between 10 November 2020 and 30 June 2022 were exempt for their first 12 months.",
      },
      {
        q: "Can a group share an unused SA payroll tax deduction?",
        a: "Yes. If the designated group employer has not used the group's full deduction (up to $600,000) by the end of the financial year, it can allocate the unused amount to one or more other group members at the annual reconciliation.",
      },
    ],
    sources: [
      { title: "How is payroll tax calculated?", url: "https://www.revenuesa.sa.gov.au/payrolltax/how-is-payroll-tax-calculated", publisher: SA },
      { title: "Payroll Tax Rate Table (from 1 January 2019)", url: "https://www.revenuesa.sa.gov.au/__data/assets/pdf_file/0007/205459/PRT-Rate-Table.pdf", publisher: SA },
      { title: "Grouping of employers", url: "https://www.revenuesa.sa.gov.au/payrolltax/grouping-of-employers", publisher: SA },
      { title: "Contractors", url: "https://www.revenuesa.sa.gov.au/payrolltax/contractors", publisher: SA },
      { title: "Wages", url: "https://www.revenuesa.sa.gov.au/payrolltax/wages", publisher: SA },
      { title: "Returns and annual reconciliation", url: "https://www.revenuesa.sa.gov.au/payrolltax/returns-and-annual-reconciliation", publisher: SA },
    ],
  },

  // ---------------------------------------------------------------------------
  tas: {
    legislation: "Payroll Tax Act 2008 (Tas)",
    workedExample: [
      "SRO Tasmania's annual adjustment return guideline: $2.4 million paid only in Tasmania is taxed 4% on the $750,000 between $1.25 million and $2 million plus 6.1% on the $400,000 above — $54,400. If the same $2.4 million is paid in Tasmania out of $3 million Australia-wide, both thresholds shrink to 80% ($1 million and $1.6 million), and the tax is 4% × $600,000 + 6.1% × $800,000 = $72,800.",
    ],
    leviesHeading: "Two Rates, No Levy",
    levies: [
      "Tasmania is the only jurisdiction with two marginal rates: 4% on wages between $1.25 million and $2 million and 6.1% above $2 million, unchanged since 1 July 2018 (before then it was a flat 6.1% above $1.25 million). An employer can choose not to claim a threshold, in which case it pays 6.1% on all Tasmanian wages for the month.",
      "Monthly thresholds are the days in the month ÷ days in the year × $1.25 million (and × $2 million), rounded to the nearest dollar. If Australia-wide wages cannot be obtained each month, one twelfth of last year's can be used. Wages paid by non-profit group training organisations registered with the Tasmanian Traineeships and Apprenticeships Committee are exempt.",
    ],
    grouping: [
      "Part 5 of the Payroll Tax Act 2008 groups related corporations, an employer whose employees work solely or mainly for another business (section 71), and commonly controlled businesses. A “business” includes carrying on a trust, even a dormant one, and holding money or property used by another business. Group members are jointly and severally liable for each other's payroll tax.",
      "Under section 79 the Commissioner can de-group a member whose business is carried on independently of, and is not connected with, the rest of the group. SRO Tasmania weighs who makes day-to-day decisions, common customers, whether activities are complementary, shared resources, financial dependence, and whether loans between members are on commercial terms.",
    ],
    contractorsHeading: "Contractors",
    contractors: [
      "“Employee” is not defined in the Payroll Tax Act 2008, so the common law tests decide it: control and direction, the contract and the working relationship, contracts for a given result, an independent business, the power to delegate, risk, and who provides tools and equipment. A worker who passes as a contractor can still be caught: amounts paid under the contractor provisions are wages unless one of the relevant contract exclusions applies.",
    ],
    lodgement: [
      "You are liable once your or your group's Australian wages exceed $1.25 million a year, or $24,038 a week during a month, and you pay wages in Tasmania. Tasmanian Revenue Online (TRO) calculates the tax from your registration and grouping details, and sets your lodgement frequency from the information in your returns.",
      "Monthly returns are due by the 7th of the following month. Every taxpayer lodges an Annual Adjustment Return by 21 July, which replaces the June monthly return. Late returns attract interest, and if you do not lodge you receive an estimated assessment.",
    ],
    faqs: [
      {
        q: "Why does Tasmania have two payroll tax rates?",
        a: "Since 1 July 2018 Tasmania has charged 4% on wages between $1.25 million and $2 million and 6.1% above $2 million, both thresholds apportioned by your Tasmanian share of Australian wages. Before that it was a single 6.1% rate above $1.25 million.",
      },
      {
        q: "Can a business be excluded from a payroll tax group in Tasmania?",
        a: "Yes, at the Commissioner's discretion under section 79 of the Payroll Tax Act 2008, if its business is carried on independently of and is not connected with the other members. Day-to-day management, shared customers and resources, financial dependence and the terms of any loans are all weighed.",
      },
      {
        q: "What is the Tasmanian annual adjustment return?",
        a: "The reconciliation every Tasmanian payroll tax payer must lodge by 21 July. It works out whether a refund is due or more tax is payable for the year, and for monthly lodgers it replaces the June return.",
      },
    ],
    sources: [
      { title: "Lodge your return", url: "https://www.sro.tas.gov.au/payroll-tax/lodge-your-return", publisher: TAS },
      { title: "Payroll tax annual adjustment return guideline", url: "https://www.sro.tas.gov.au/Documents/Annual-Adjustment-Return-Guideline.pdf", publisher: TAS },
      { title: "Grouping and de-grouping", url: "https://sro.tas.gov.au/payroll-tax/grouping-de-grouping", publisher: TAS },
      { title: "Taxable and exempt wages", url: "https://sro.tas.gov.au/payroll-tax/taxable-exempt-wages", publisher: TAS },
      { title: "Contractors", url: "https://sro.tas.gov.au/payroll-tax/taxable-exempt-wages/contractors", publisher: TAS },
    ],
  },

  // ---------------------------------------------------------------------------
  act: {
    legislation: "Payroll Tax Act 2011 (ACT)",
    workedExample: [
      "A business paying $3 million, all in the ACT, deducts the $1.75 million threshold and pays 6.75% on the remaining $1.25 million: $84,375. The band works on total Australia-wide wages and then applies to every ACT dollar above the threshold, not just the slice above a band boundary. A group with $25 million Australia-wide and $5 million in the ACT gets 20% of the threshold ($350,000) and pays 6.85% on $4.65 million.",
    ],
    leviesHeading: "Banded Rates From 1 July 2026, and ACT Exemptions",
    levies: [
      "Until 30 June 2026 the ACT threshold was $2 million and the general rate 6.85%, with a surcharge of 0.5% for groups with $50 million to $100 million of Australian wages and 1% above $100 million; from 1 January 2026 wages above $150 million were taxed at 8.75% with no surcharge. From 1 July 2026 the threshold is $1.75 million and the rate depends on the band: 6.75% to $20 million, 6.85% to $50 million, 7.35% to $100 million, 7.85% to $150 million and 8.75% above. Eligible universities are capped at 6.85%.",
      "ACT exempt wages include new starters receiving eligible training, paid maternity, adoption and primary carer leave, Commonwealth Paid Parental Leave, the tax-free part of a genuine redundancy and workers compensation; there is also a GP wages exemption scheme. Wages for an overseas assignment of more than six continuous months are not taxable, including the first six months.",
    ],
    grouping: [
      "Part 5 of the Payroll Tax Act 2011 groups related corporations, businesses sharing employees, businesses under common control, tracing of interests and people in two or more groups — and an Australian business can be grouped with an overseas one. A “business” includes running a trust, even a dormant one. Each member employing in the ACT must register, and the ACT Revenue Office must be told promptly in writing when an entity joins or leaves.",
      "Only one member claims the threshold. With the Commissioner's approval one member can lodge a single return for all — a Joint Return Lodger — nominated on the same form as the designated group employer.",
    ],
    contractorsHeading: "Contractors and Employment Agents",
    contractors: [
      "Payments under a relevant contract are taxable unless the contract is exempt, and a flat deduction for materials or equipment may apply by trade (circular PTA018). The ACT's exemptions cover contracts where labour is secondary to supplying goods, services not ordinarily required that the contractor offers to the public, owner-drivers carrying goods in their own vehicle, and genuine independent businesses serving the public — the last only if you apply to the Commissioner for ACT Revenue. A contract that includes any non-exempt work, or that was set up to avoid payroll tax, gets no exemption.",
      "Employment agencies pay the payroll tax on wages of the workers they hire out, whoever actually pays them, but in some circumstances can exclude payments to independent contractors. GST is never part of the taxable amount.",
    ],
    lodgement: [
      "Apply to register within seven days after the end of the month in which your or your group's wages pass $145,833.33. Monthly returns and payments are due by the 7th for July to November and January to May, and the December return by 14 January. There is no June return: June goes into the annual reconciliation due 28 July.",
      "All returns are lodged in the ACT Revenue Office's Self Service Portal, and the annual return automatically adjusts the threshold for the part of the year you paid wages. You can apply in writing to the Commissioner to change your lodgement period.",
    ],
    faqs: [
      {
        q: "What changed in ACT payroll tax on 1 July 2026?",
        a: "The threshold fell from $2 million to $1.75 million, and the flat 6.85% rate with surcharges for larger groups was replaced by five bands based on Australia-wide wages: 6.75% up to $20 million, 6.85% to $50 million, 7.35% to $100 million, 7.85% to $150 million and 8.75% above $150 million.",
      },
      {
        q: "Do ACT payroll tax bands work like income tax brackets?",
        a: "No. Your total Australia-wide wages (or your group's) pick a single band, and that one rate applies to all your ACT wages above your share of the $1.75 million threshold — not just to the wages above the band's starting point.",
      },
      {
        q: "Are contractors exempt from ACT payroll tax?",
        a: "Only if the contract fits an exemption: labour secondary to supplying goods, services not ordinarily required from a contractor who serves the public, owner-drivers carrying goods in their own vehicle, or a genuine independent business serving the public (which needs the Commissioner's approval). Otherwise relevant contract payments are taxable, less any allowed deduction for materials.",
      },
    ],
    sources: [
      { title: "About payroll tax (rates, exempt wages, contractors)", url: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax/about-payroll-tax", publisher: ACT },
      { title: "Calculating payroll tax", url: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax/calculating-payroll-tax", publisher: ACT },
      { title: "Grouping", url: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax/grouping", publisher: ACT },
      { title: "Contractors", url: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax/contractors", publisher: ACT },
      { title: "Lodging returns", url: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax/lodging-returns", publisher: ACT },
    ],
  },

  // ---------------------------------------------------------------------------
  nt: {
    legislation: "Payroll Tax Act 2009 (NT)",
    workedExample: [
      "The Territory Revenue Office's guide: an employer paying $2.4 million is under the $2.5 million threshold and pays nothing. At $2.9 million the annual deductible amount (ADA) falls to $2.5 million − ($400,000 ÷ 2) = $2.3 million, leaving $600,000 taxed at 5.5% — $33,000. An employer with $2.7 million in the NT out of $10.4 million Australia-wide has no tax-free amount at all and pays $148,500.",
    ],
    leviesHeading: "A 6.5% Rate for $100 Million Employers",
    levies: [
      "From 1 July 2026 an amendment to the Payroll Tax Act 2009 adds a 6.5% rate for employers and groups with Australia-wide wages of $100 million or more; the $2.5 million threshold, the deduction settings and the 5.5% rate are unchanged for everyone else. The rate test is separate from the deduction: a large group still gets its ADA worked out in the usual way, then pays 6.5% on its net NT wages. Monthly returns should use 6.5% if the employer or group expects to reach $100 million for the year, using last year's wages as the starting point; the annual return corrects any difference.",
      "Non-profit charities, public benevolent institutions, religious institutions, non-profit non-government schools, public and non-profit private hospitals and local governing bodies can be exempt for wages of staff working exclusively in their charitable activities. There is no form: apply to TRO by email or letter for a determination.",
    ],
    grouping: [
      "Grouping is automatic, and smaller groups are subsumed into a single master group. A group of NT taxpayers can apply (form F-PRT-003) for its designated group employer to lodge one consolidated return and make one payment for every member; members stay jointly and severally liable, but their liabilities are treated as met once the DGE pays.",
      "Each month's deduction is fixed in advance: when the annual adjustment return is lodged, INTRA divides the year's ADA by 12 to set the monthly deductable amount (MDA) for the next year.",
    ],
    contractorsHeading: "When Contractor Payments Are Taxable",
    contractors: [
      "TRO's guide lists the signs that payments to a contractor are taxable wages: the services are a normal part of your business for most of the year, the contractor has no employees of their own, invoices you for more than 90 days' work in the year, averages more than 10 days a month in the months they work for you (any part of a day counts), or the labour exceeds 50% of the contract value. It does not matter whether they trade as a company or trust, bring their own tools, or signed an agreement saying they are not an employee.",
      "For fly-in fly-out workers, wages for a month worked entirely in one state are taxed there; if a FIFO worker works in two or more states in the same month, the payroll tax goes to the state or territory where they normally live.",
    ],
    lodgement: [
      "NT payroll tax is due by the 21st of the following month, not the 7th: tax for July 2026 must be received by Friday 21 August 2026, and for October 2026 by Monday 23 November 2026 because 21 November is a Saturday. Returns are lodged in INTRA, and you register within 21 days of the end of the first month your Australian wages pass $208,333.",
      "Employers whose estimated tax for the year is under the annual-lodgement threshold can lodge just an annual return; that threshold rises to $20,000 from 1 September 2026. TRO warns against paying June twice — pay only the amount in the annual return, by 21 July.",
    ],
    faqs: [
      {
        q: "When is NT payroll tax due?",
        a: "By the 21st of the month after the return period — later than the 7th used in most states. If the 21st is a weekend or public holiday, TRO must receive payment by the next NT business day. The annual return and any balance are due by 21 July.",
      },
      {
        q: "Who pays the 6.5% NT payroll tax rate?",
        a: "From 1 July 2026, employers and payroll tax groups whose Australia-wide wages are $100 million or more. They still get the usual annual deductible amount (which is nil at that size); the 6.5% applies to their net NT taxable wages. Everyone else pays 5.5%.",
      },
      {
        q: "When are contractor payments taxable in the NT?",
        a: "Signs include services that are a normal part of your business for most of the year, a contractor with no employees, invoices for more than 90 days' work in the year, more than 10 days' work a month on average, or labour making up more than half the contract value. A company or trust structure, own tools or a signed 'not an employee' agreement do not change the answer.",
      },
    ],
    sources: [
      { title: "Payroll tax (due dates and 1 July 2026 changes)", url: "https://treasury.nt.gov.au/dtf/territory-revenue-office/payroll-tax", publisher: NT },
      { title: "Payroll tax changes from 1 July 2026", url: "https://treasury.nt.gov.au/dtf/territory-revenue-office/payroll-tax/payroll-changes-from-1-july-2026", publisher: NT },
      { title: "Payroll tax guide for Northern Territory employers and businesses", url: "https://treasury.nt.gov.au/pms/tro/information/payroll-tax-guide-for-nt-employers-and-businesses.pdf", publisher: NT },
    ],
  },
};
