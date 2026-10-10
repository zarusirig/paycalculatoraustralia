// =============================================================================
// Long service leave — what is different in each state and territory.
//
// The spoke pages used to render the same template eight times with the
// numbers swapped. This module holds the parts of each Act that genuinely
// differ: how the payout is worked out (ordinary pay and averaging), how leave
// is taken (periods, notice, public holidays), continuity quirks, and the
// portable schemes that sit outside the Act. Every statement was read from the
// state or territory authority's own page on LSL_DETAIL_VERIFIED_ON (via
// Firecrawl, raw markdown) and the URL it came from is listed in `sources`.
//
// No "use client": page.tsx builds FAQPage JSON-LD from `faqs`, and the
// visible accordion renders the same array (see long-service-leave-faqs.ts).
// =============================================================================

import type { SourceLink } from "@/components/common/source-attribution";
import type { JurisdictionCode } from "@/lib/constants/long-service-leave";

export const LSL_DETAIL_VERIFIED_ON = "10 October 2026";

export interface LslFaq {
  q: string;
  a: string;
}

export interface PortableScheme {
  /** Scheme or body name as the authority gives it. */
  name: string;
  /** Who it covers. */
  covers: string;
  url: string;
}

export interface LslStateDetail {
  /** Rows for the entitlement table — the service lengths where this Act changes something. */
  milestones: number[];
  /** One paragraph on the Act and who runs it. */
  actNote: string;
  /** How the payment is worked out: ordinary pay, averaging, worked example. */
  payCalc: string[];
  /** How leave is taken: periods, notice, public holidays, half pay. */
  takingLeave: string[];
  /** What counts as continuous service, beyond the shared summary. */
  continuity: string[];
  portableIntro: string;
  portable: PortableScheme[];
  /** Questions specific to this Act (appended to the shared spoke FAQs). */
  faqs: LslFaq[];
  sources: SourceLink[];
}

const NSW_IR = "NSW Industrial Relations";
const NSW_LSL = "https://www.nsw.gov.au/employment/rights-responsibilities/leave/long-service-leave";
const VIC_BV = "https://business.vic.gov.au/business-information/staff-and-hr/long-service-leave-victoria/long-service-leave-an-overview";
const VIC_CALC = "https://business.vic.gov.au/business-information/staff-and-hr/long-service-leave-victoria/how-is-long-service-leave-calculated";
const VIC_WIV = "https://www.vic.gov.au/long-service-leave";
const QLD_ENT = "https://www.business.qld.gov.au/running-business/employing/legal-obligations/long-service-leave/entitlements";
const QLD_CALC = "https://www.business.qld.gov.au/running-business/employing/legal-obligations/long-service-leave/calculating";
const QLD_TAKE = "https://www.business.qld.gov.au/running-business/employing/legal-obligations/long-service-leave/cashing-in";
const WA_TAKE = "https://www.wa.gov.au/organisation/private-sector-labour-relations/taking-long-service-leave";
const WA_PAY = "https://www.wa.gov.au/organisation/private-sector-labour-relations/payment-long-service-leave";
const WA_END = "https://www.wa.gov.au/organisation/private-sector-labour-relations/long-service-leave-when-employment-ends";
const WA_CASH = "https://www.wa.gov.au/organisation/private-sector-labour-relations/cashing-out-long-service-leave";
const SA_ACCRUE = "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave/accruing-leave";
const SA_CALC = "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave/calculating-long-service-leave";
const SA_PAY = "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave/payment";
const SA_REQ = "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave/requesting-leave";
const SA_WHO = "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave/who-is-entitled-to-long-service-leave";
const TAS_LSL = "https://worksafe.tas.gov.au/topics/laws-and-compliance/long-service-leave";
const TAS_PRO = "https://worksafe.tas.gov.au/topics/laws-and-compliance/long-service-leave/pro-rata-long-service-leave";
const ACT_GN = "https://www.worksafe.act.gov.au/__data/assets/pdf_file/0007/1673962/Long-Service-Leave-Guidance-Note.pdf";
const NT_LSL = "https://nt.gov.au/employ/for-employees-in-nt/holidays-and-leave/long-service-leave";

export const LSL_STATE_DETAIL: Record<JurisdictionCode, LslStateDetail> = {
  // ---------------------------------------------------------------------------
  nsw: {
    milestones: [5, 7, 10, 12, 15, 20, 25],
    actNote:
      "NSW Industrial Relations regulates the Long Service Leave Act 1955 and launched an updated Long Service Leave Guide on 1 March 2026. The Act defines a month as 4⅓ weeks, so “two months” is 8.67 weeks, and the entitlement is counted in weeks rather than days or hours.",
    payCalc: [
      "NSW pays long service leave at “ordinary pay”, which can have three parts: a primary component, the cash value of any board or lodging, and the average weekly value of bonuses or incentives. Shift-work, overtime and other penalty rates are left out; casual loading is kept in.",
      "The primary component depends on how you are paid on the “prescribed date” — the day the leave starts or the job ends. If you are on a fixed rate (a salary for standard hours, or an hourly rate tied to hours worked, which covers casuals with variable hours), it is the higher of your ordinary remuneration on that date or your average weekly ordinary remuneration over the previous five years (section 3(1)(a)). Anyone else gets the higher of their average weekly wage over the previous 12 months or the previous five years (section 3(1)(b)).",
      "Allowances paid for the work itself — height, heat, a first-aid allowance paid for all ordinary hours — are included; expense allowances for travel, meals, uniforms, a car or tools are not. Where board or lodging is supplied but no value is fixed in the contract or award, the Act adds $15 a week for board and $5 a week for lodging. Bonuses and incentives only count while annual ordinary pay without them is under the high-income threshold.",
    ],
    takingLeave: [
      "Leave is meant to be taken in one continuous block. By agreement it can be split into periods of at least one day: two periods for a 2-month entitlement, two or three where it is more than 2 months, and two, three or four where it is more than 19.5 weeks.",
      "Leave in advance needs the employer's agreement and is subtracted from what you accrue later; if you leave before earning it back, the employer may recover the value to the extent the law allows. An employer can direct you to take long service leave on at least one month's notice. You do not have to give a fixed period of notice to ask for it.",
    ],
    continuity: [
      "Service stays continuous when you move between permanent, casual and part-time work, or sign several contracts, with the same employer. Unpaid leave does not count as service, so it has to be made up: NSW Industrial Relations' example has a worker serving 56 extra days past his 10-year anniversary to cover unpaid leave taken in 2008.",
    ],
    portableIntro:
      "Three NSW portable schemes, run by the Long Service Corporation (13 14 41), let service build up across employers in one industry. Where a worker in a scheme still reaches 10 years with one employer, the employer may have to pay the leave directly under the Act and report it to the Corporation.",
    portable: [
      { name: "Building and construction industry long service payments scheme", covers: "building and construction workers", url: "https://www.nsw.gov.au/employment/rights-responsibilities/portable-long-service/bci-long-service-payments-scheme" },
      { name: "Community services industry portable long service leave scheme", covers: "community services workers — about 6.1 weeks of paid leave after 7 years of recognised service in the industry, funded by an employer levy", url: "https://www.nsw.gov.au/employment/rights-responsibilities/portable-long-service/csi-long-service-leave-scheme" },
      { name: "Contract cleaning industry portable long service leave scheme", covers: "contract cleaners", url: "https://www.nsw.gov.au/employment/rights-responsibilities/portable-long-service/cci-long-service-leave-scheme" },
      { name: "Coal LSL (Australian Government)", covers: "black coal mining workers, who accrue under Commonwealth law rather than the NSW Act", url: "https://coallsl.com.au/" },
    ],
    faqs: [
      {
        q: "Can I take long service leave in advance in NSW?",
        a: "Only if your employer agrees. Leave taken before 10 years (or before each further 5 years) is subtracted from what you later accrue, and if the job ends before you have earned it back the employer may recover the value to the extent the law allows. An employer does not have to agree.",
      },
      {
        q: "How is ordinary pay worked out for NSW long service leave?",
        a: "On a fixed rate — a salary or an hourly rate, including casuals with variable hours — it is the higher of your ordinary remuneration on the day the leave starts or the job ends, or your average weekly ordinary remuneration over the previous five years. Otherwise it is the higher of your average weekly wage over 12 months or five years. Board, lodging and qualifying bonuses are added; overtime, shift and penalty rates are not, but casual loading is.",
      },
      {
        q: "Can my employer make me take long service leave in NSW?",
        a: "Yes. NSW Industrial Relations says an employer may ask a worker to take long service leave by giving at least one month's notice, or a shorter period if both agree.",
      },
    ],
    sources: [
      { title: "Long service leave — FAQs on ordinary pay, taking leave and portable schemes", url: NSW_LSL, publisher: NSW_IR },
      { title: "Long Service Leave Guide (March 2026)", url: "https://www.nsw.gov.au/sites/default/files/noindex/2026-03/long-service-leave-guide-final-march26.pdf", publisher: NSW_IR },
    ],
  },

  // ---------------------------------------------------------------------------
  vic: {
    milestones: [5, 7, 8, 10, 15, 20],
    actNote:
      "Victoria's Long Service Leave Act 2018 is enforced by Workforce Inspectorate Victoria, which was called Wage Inspectorate Victoria until 12 December 2025. It counts leave as one week for every 60 weeks of continuous employment — about 0.866 of a week a year — and breaches are criminal: failing to pay the balance on the last day of employment is an offence under section 9(2).",
    payCalc: [
      "Ordinary pay is the actual pay for your normal weekly hours when the leave starts or the job ends, plus the cash value of any board or lodging. Most allowances, penalty rates and overtime are left out, but a casual's ordinary rate includes the casual loading, and non-discretionary commissions and regular bonuses written into the contract can count.",
      "Two averaging rules protect anyone whose work changed. If your hours changed in the last 104 weeks, they are averaged over the last 52 weeks, the last 260 weeks or the whole period of employment, whichever is highest. If your pay rate moves week to week, it is averaged over the last 12 months, five years or whole period, whichever is greater.",
      "Business Victoria's worked example: Lissa resigns after 11 years on $1,100 a week. 11 × 52 = 572 weeks, ÷ 60 = 9.53 weeks, which it prints as 9.5 weeks and $10,450.",
    ],
    takingLeave: [
      "You can ask to take leave at any time after 7 years. By agreement it can be taken in periods of at least one day, taken in advance of 7 years, or taken as twice the period at half pay.",
      "An employer can direct you to take leave by giving at least 12 weeks' written notice. If you do not want to take it then, you can apply to the Industrial Division of the Magistrates' Court.",
    ],
    continuity: [
      "Paid and unpaid parental leave never breaks continuous employment. Unpaid leave of up to 52 weeks counts towards accrual; longer unpaid leave counts only if the contract or instrument provides for it, it is agreed in writing beforehand, or it is for illness or injury.",
      "A new owner who keeps you on inherits your whole period of service, and Business Victoria warns that failing to recognise it is an offence.",
    ],
    portableIntro:
      "Building and construction workers are outside the 2018 Act altogether: their entitlement comes from the Construction Industry Long Service Leave Act 1997 through LeavePlus (formerly CoINVEST). Community services, contract cleaning and security workers carry their service from job to job under the Long Service Benefits Portability Act 2018.",
    portable: [
      { name: "LeavePlus (formerly CoINVEST)", covers: "building and construction workers", url: "https://leaveplus.com.au/" },
      { name: "Portable Long Service Benefits Authority", covers: "community services, contract cleaning and security workers, under the Long Service Benefits Portability Act 2018", url: "https://plsa.vic.gov.au/" },
    ],
    faqs: [
      {
        q: "Can I take long service leave at half pay in Victoria?",
        a: "You can ask. The Long Service Leave Act 2018 lets an employee request a period of leave twice as long as the entitlement at half their ordinary pay; it needs the employer's agreement.",
      },
      {
        q: "How much notice does a Victorian employer need to give to make me take long service leave?",
        a: "At least 12 weeks' written notice. If you do not want to take the leave at the time the employer nominates, you can apply to the Industrial Division of the Magistrates' Court.",
      },
      {
        q: "Does parental leave affect long service leave in Victoria?",
        a: "It never breaks continuous employment. Unpaid parental leave of up to 52 weeks also counts towards the leave you accrue; anything longer counts only if your contract or award provides for it or you and your employer agree in writing.",
      },
    ],
    sources: [
      { title: "Long service leave — an overview", url: VIC_BV, publisher: "Business Victoria" },
      { title: "How is long service leave calculated", url: VIC_CALC, publisher: "Business Victoria" },
      { title: "Long service leave", url: VIC_WIV, publisher: "Workforce Inspectorate Victoria" },
    ],
  },

  // ---------------------------------------------------------------------------
  qld: {
    milestones: [7, 10, 12, 15, 17, 20],
    actNote:
      "Queensland has no stand-alone long service leave Act: the entitlement sits in the Industrial Relations Act 2016, and Business Queensland publishes the entitlement tables in years, months, weeks and days. In Infosys Technologies Limited v Fox [2025] QCA 45 the Court of Appeal held that service outside Queensland, including overseas, needs no “substantial connection” to the state to count.",
    payCalc: [
      "Leave is paid at the ordinary rate being paid when it is taken — no overtime — and if you are paid above the award, at the higher rate.",
      "Casual and regular part-time employees, and anyone whose status changed during their service, use an hours formula instead of weeks: total ordinary hours worked ÷ 52 × 8.6667 ÷ 10. Business Queensland's example: 15,600 ordinary hours over 10 years gives 260.001 hours of paid leave. Employers must keep a running record of each casual's total ordinary hours to 30 June each year.",
      "Commission is paid as the “default average commission”: total commission in the year before the leave ÷ 52.179 × the weeks of leave, unless an award, agreement or contract says otherwise or the Queensland Industrial Relations Commission finds it unfair.",
    ],
    takingLeave: [
      "Leave is taken at a time agreed with the employer and can be any length the employer agrees to. If you cannot agree, the employer can require you to take at least 4 weeks by giving at least 3 months' written notice.",
      "Long service leave is exclusive of public holidays: a public holiday that falls on a day you would normally work is added to the leave.",
    ],
    continuity: [
      "Generally only paid leave and WorkCover absences count as service. Unpaid parental leave does not accumulate long service leave but does not break continuity either. Re-employment by the same employer within 3 months keeps you continuous, and so does re-employment after a stand-down for an industrial dispute or slackness of trade.",
    ],
    portableIntro:
      "QLeave runs three portable schemes — building and construction, contract cleaning and community services — in which service builds up across employers in the industry rather than with one employer.",
    portable: [
      { name: "QLeave — building and construction", covers: "building and construction workers", url: "https://www.qleave.qld.gov.au/" },
      { name: "QLeave — contract cleaning", covers: "contract cleaning workers", url: "https://www.qleave.qld.gov.au/" },
      { name: "QLeave — community services", covers: "community services workers", url: "https://www.qleave.qld.gov.au/" },
    ],
    faqs: [
      {
        q: "Do public holidays extend long service leave in Queensland?",
        a: "Yes. Long service leave in Queensland is exclusive of public holidays, so any public holiday that falls on a day you would ordinarily work is added to the period of leave.",
      },
      {
        q: "Can my employer make me take long service leave in Queensland?",
        a: "Only after trying to agree. If agreement cannot be reached, the employer can require you to take at least 4 weeks of long service leave by giving at least 3 months' written notice.",
      },
      {
        q: "How is commission included in Queensland long service leave pay?",
        a: "Through the default average commission: the total commission payable in the year before the leave, divided by 52.179, multiplied by the number of weeks of leave — unless an award, agreement or contract provides otherwise or the Queensland Industrial Relations Commission decides it would not be fair.",
      },
    ],
    sources: [
      { title: "Long service leave entitlements and continuous service", url: QLD_ENT, publisher: "Business Queensland" },
      { title: "Calculating long service leave", url: QLD_CALC, publisher: "Business Queensland" },
      { title: "Transferring, taking and cashing in long service leave", url: QLD_TAKE, publisher: "Business Queensland" },
    ],
  },

  // ---------------------------------------------------------------------------
  wa: {
    milestones: [7, 8, 10, 12, 15, 20],
    actNote:
      "Private Sector Labour Relations (Wageline) administers the Long Service Leave Act 1958, which covers many state and national system private sector employers in Western Australia. Full-time, part-time, casual and seasonal employees all accrue under it on the same terms.",
    payCalc: [
      "Ordinary pay is your normal weekly number of hours multiplied by your ordinary time rate. Shift premiums, overtime rates, penalty rates and allowances are excluded; casual loading is included, as is the cash value of meals or accommodation normally provided but not taken during the leave.",
      "WA averages hours separately for each accrual period — the first 10 years, then each 5-year block — rather than over your whole career. Unusually, hours of overtime you regularly worked count towards your normal weekly hours. Wageline's example: 27,040 hours over 10 years ÷ 521.7 weeks = 52 hours a week, so 8.667 weeks is 450.684 hours of leave.",
      "Dismissal for serious misconduct changes the payout. Between 7 and 10 years nothing is owed. After 10 years you are paid only the part of your last fully accrued entitlement you have not taken — Wageline's Anastasia, dismissed after 12 years and one month, gets 8.667 weeks but nothing for the two years since.",
    ],
    takingLeave: [
      "An employer cannot direct you to take long service leave at a particular time. If you have not agreed on timing, the employer cannot refuse leave that fell due more than 12 months ago: give at least 2 weeks' notice and take it in one continuous period.",
      "You can ask to take it at half pay (8 weeks becomes 16) or double pay (8 weeks becomes 4). A public holiday during the leave adds a day for full-time and part-time employees. Leave in advance is by agreement, and if you leave before earning it back the employer may deduct the difference from your final pay.",
    ],
    continuity: [
      "Cashing out is allowed only once an entitlement has fully accrued, by written agreement signed by both parties, and at no less than the ordinary pay you would have received on leave. It cannot be done in advance — not as a lump sum, a loading on top of base pay or a commission.",
    ],
    portableIntro:
      "Employees working on site in the construction industry are covered by the Construction Industry Portable Paid Long Service Leave Act 1985 instead of the 1958 Act; MyLeave administers it.",
    portable: [
      { name: "MyLeave", covers: "on-site construction industry employees, under the Construction Industry Portable Paid Long Service Leave Act 1985", url: "http://www.myleave.wa.gov.au/" },
    ],
    faqs: [
      {
        q: "Can my employer make me take long service leave in WA?",
        a: "No. Under the WA Long Service Leave Act an employer cannot direct an employee to take long service leave at a particular time. If the two of you have not agreed on timing, you can take leave that fell due more than 12 months ago by giving at least 2 weeks' notice, in one continuous period.",
      },
      {
        q: "Is overtime included in WA long service leave pay?",
        a: "Overtime rates are not, but overtime hours can be. If you regularly worked overtime during an accrual period, those hours are counted in your normal weekly number of hours, which are then paid at your ordinary time rate.",
      },
      {
        q: "What happens to WA long service leave if I am dismissed for serious misconduct?",
        a: "Between 7 and 10 years of continuous employment, no pro-rata payment is owed. After 10 years you are paid only the untaken part of your last fully accrued entitlement — the 8.667 weeks at 10 years, or 4.333 weeks for each further 5 years — and nothing pro-rata for the time since. The employer has to prove the misconduct.",
      },
    ],
    sources: [
      { title: "Taking long service leave", url: WA_TAKE, publisher: "Private Sector Labour Relations (WA)" },
      { title: "Payment of long service leave", url: WA_PAY, publisher: "Private Sector Labour Relations (WA)" },
      { title: "Long service leave when employment ends", url: WA_END, publisher: "Private Sector Labour Relations (WA)" },
      { title: "Cashing out long service leave", url: WA_CASH, publisher: "Private Sector Labour Relations (WA)" },
    ],
  },

  // ---------------------------------------------------------------------------
  sa: {
    milestones: [7, 8, 10, 11, 15, 20],
    actNote:
      "SafeWork SA administers the Long Service Leave Act 1987 and investigates claims lodged on its long service leave claim form free of charge. SA counts entitlement in calendar weeks: 13 weeks at 10 years, then 1.3 weeks — 9.1 calendar days — for each further completed year.",
    payCalc: [
      "Leave is paid at your ordinary weekly rate: your normal weekly pay excluding overtime, shift premiums and penalty rates, on the day leave starts or payment in lieu is made. A higher rate you are acting in on that day counts, and if a pay rise lands while you are on leave, the remaining weeks are paid at the new rate.",
      "Hours are averaged over 3 years. Someone full-time for at least the last 3 years gets 13 weeks of full-time hours at the current rate; part-time, casual and mixed workers are paid on their average hours over the previous 3 years; commission, target and piece workers on their average income over the previous 12 months. A casual's rate includes the casual loading.",
      "Payment is due in advance for the whole period, on normal paydays, or as agreed — and immediately when employment ends. Once you reach 10 years, dismissal for misconduct cannot take the entitlement away: it must be paid out in full.",
    ],
    takingLeave: [
      "Leave should be taken in one continuous period as soon as practicable after it falls due. Separate periods, as short as one day, need both sides to agree. An employer can direct you to take leave only with at least 60 days' notice.",
      "Every day after the leave starts counts as a day of leave, weekends and public holidays included: 13 weeks starting Monday 1 August ends Monday 31 October. Leave at half pay needs the employer's agreement.",
    ],
    continuity: [
      "Parental leave — employer-funded or government-funded — does not break service but does not count towards it, so it has to be made up before 10 years is reached. Periods of apprenticeship count where you are re-employed by the same employer within 12 months of finishing it.",
    ],
    portableIntro:
      "Two groups in South Australia accrue through portable schemes instead of the 1987 Act.",
    portable: [
      { name: "Portable Long Service Leave (Construction Industry Long Service Leave Act 1987)", covers: "construction industry workers", url: "https://www.portableleave.org.au/" },
      { name: "SA Portable Long Service Leave — community services (Portable Long Service Leave Act 2024)", covers: "community services sector workers, based on service to the industry", url: "https://saplsl-community.org.au/" },
    ],
    faqs: [
      {
        q: "Do weekends and public holidays count as long service leave days in South Australia?",
        a: "Yes. SafeWork SA says every day after the leave starts counts as a day of long service leave, including weekends and public holidays, so they do not extend the leave.",
      },
      {
        q: "How is long service leave worked out for part-time and casual workers in SA?",
        a: "On the average number of hours worked over the previous 3 years, at the current ordinary rate (including casual loading for casuals). A worker who has been full-time for at least the last 3 years is paid on full-time hours; commission, target and piece workers are paid on their average income over the previous 12 months.",
      },
      {
        q: "Does parental leave count towards long service leave in SA?",
        a: "It does not break continuous service, but it does not count as service either, whether employer-funded or government-funded (unless an enterprise agreement says otherwise). The time has to be made up: 12 months of maternity leave pushes the 10-year point back by 12 months.",
      },
    ],
    sources: [
      { title: "Accruing leave", url: SA_ACCRUE, publisher: "SafeWork SA" },
      { title: "Calculating long service leave", url: SA_CALC, publisher: "SafeWork SA" },
      { title: "Payment of entitlement", url: SA_PAY, publisher: "SafeWork SA" },
      { title: "Requesting and taking leave", url: SA_REQ, publisher: "SafeWork SA" },
      { title: "Who is entitled to long service leave", url: SA_WHO, publisher: "SafeWork SA" },
    ],
  },

  // ---------------------------------------------------------------------------
  tas: {
    milestones: [7, 9, 10, 13, 15, 20],
    actNote:
      "WorkSafe Tasmania administers the Long Service Leave Act 1976 for the private sector. The same Act carries separate provisions for mining employees, so the figures on this page do not apply to them.",
    payCalc: [
      "Ordinary pay is what you would have earned had you stayed at work. Tasmania includes shift penalties, part-time and casual loadings, allowances paid for all hours and all purposes of the award, and the cash value of board and lodging (unless supplied for work far from home). It excludes overtime, special rates such as danger or hardship allowances, travel allowances, bonuses, living-away-from-home and meal allowances.",
      "A casual's ordinary pay is based on average hours over the 12 months before the leave starts — total hours ÷ 52. Commission earners, such as real estate salespeople, are paid on average weekly remuneration over the 3 months before the leave.",
      "A pro-rata payment is years of continuous employment, including part years, ÷ 10 × 8.667 weeks. On death, the estate is paid 1/60th of ordinary pay for the period of continuous employment (between 7 and 10 years), or for the period since the last accrued entitlement.",
    ],
    takingLeave: [
      "Leave is taken in one period unless the employer and employee agree to two periods. By agreement it can instead be cashed in, or taken as a mix of cash and leave.",
    ],
    continuity: [
      "Casual and part-time employees count as continuously employed if they regularly work 32 hours or more in each consecutive four-week period. Moving between associated corporations keeps your service, and so does being re-engaged within 2 months at the same place of business by a new employer doing substantially the same kind of business.",
    ],
    portableIntro:
      "Construction industry employees in Tasmania build their long service leave through TasBuild, a private trustee company that runs the Construction Industry (Long Service) Act 1997 scheme, not the 1976 Act.",
    portable: [{ name: "TasBuild", covers: "construction industry employees, under the Construction Industry (Long Service) Act 1997", url: "https://tasbuild.com.au/" }],
    faqs: [
      {
        q: "How many hours does a casual need to work for long service leave in Tasmania?",
        a: "WorkSafe Tasmania treats casual and part-time employees as continuously employed if they regularly work 32 hours or more in each consecutive four-week period. They then qualify after the same 10 years, or for pro-rata after 7.",
      },
      {
        q: "Do shift penalties count in Tasmanian long service leave pay?",
        a: "Yes. Tasmanian ordinary pay includes shift penalties, part-time and casual loadings and all-purpose allowances. Overtime, special rates, travel and meal allowances, bonuses and living-away-from-home allowances are excluded.",
      },
      {
        q: "Can long service leave be split in Tasmania?",
        a: "Only into two periods, and only if the employer and employee agree. Otherwise it is taken in one period. You can also agree to cash it in, or take a mix of cash and leave.",
      },
    ],
    sources: [
      { title: "Long service leave", url: TAS_LSL, publisher: "WorkSafe Tasmania" },
      { title: "Pro rata long service leave", url: TAS_PRO, publisher: "WorkSafe Tasmania" },
    ],
  },

  // ---------------------------------------------------------------------------
  act: {
    milestones: [5, 6, 7, 10, 15, 20],
    actNote:
      "WorkSafe ACT administers the Long Service Leave Act 1976 through Guidance Note 067. Its authorised officers can inspect records and investigate complaints, and an employer can ask the Registrar of Long Service Leave to review their decisions. Employers must keep long service leave records for seven years after service ends.",
    payCalc: [
      "Leave is paid at your ordinary remuneration, which excludes overtime, penalty rates and allowances paid under an award or agreement.",
      "A special rule protects people who cut their hours late in their career: if you moved from full-time to part-time or casual in the two years before becoming entitled, your ordinary remuneration is your previous five years' salary added together and divided by five.",
      "Payment is made before you go on leave, or on normal paydays if you agree, and as soon as possible after termination. Pro-rata payments between 5 and 7 years are worked out on completed years and months of service.",
    ],
    takingLeave: [
      "The employer must grant leave as soon as practicable after it accrues, at an agreed time. If you cannot agree, the employer gives written notice that the leave must be taken after 60 days. It is an offence for an employer not to grant leave of four weeks or more as soon as practicable, unless both sides agree otherwise.",
      "A public holiday or award holiday during long service leave adds one day to the leave.",
    ],
    continuity: [
      "Continuous service includes annual and long service leave, up to 2 weeks a year of illness or injury, a break engineered to avoid granting leave, and an apprenticeship where you start with the same employer within 12 months of finishing it. Service outside the ACT may not count.",
    ],
    portableIntro:
      "Employees in the industries covered by the Long Service Leave (Portable Schemes) Act 2009 would not usually be entitled under the 1976 Act; ACT Leave runs those schemes. Since 1 April 2025 the old contract cleaning scheme has been part of a wider Services Industry Scheme, and on 3 May 2026 the ACT Government delayed the entry of hairdressing and beauty, and accommodation and food services, into that scheme until 1 January 2027.",
    portable: [
      { name: "ACT Leave — Building and Construction Industry Scheme", covers: "the building and construction industry", url: "https://actleave.act.gov.au/" },
      { name: "ACT Leave — Community Sector Industry Scheme", covers: "the community sector", url: "https://actleave.act.gov.au/" },
      { name: "ACT Leave — Security Industry Scheme", covers: "the security industry", url: "https://actleave.act.gov.au/" },
      { name: "ACT Leave — Services Industry Scheme", covers: "contract cleaning now; hairdressing and beauty, and accommodation and food services, from 1 January 2027", url: "https://actleave.act.gov.au/" },
    ],
    faqs: [
      {
        q: "Do public holidays extend long service leave in the ACT?",
        a: "Yes. WorkSafe ACT's guidance says that when a public holiday or award holiday falls during long service leave, the leave is increased by one day for each one.",
      },
      {
        q: "Can my ACT employer make me take long service leave?",
        a: "If you cannot agree on a time, the employer can give you written notice that the leave must be taken after 60 days from the date of the notice.",
      },
      {
        q: "What if I went part-time before reaching long service leave in the ACT?",
        a: "If you changed from full-time to part-time or casual in the two years immediately before becoming entitled, your ordinary remuneration is your total salary over the previous five years divided by five, so the drop in hours does not shrink your leave pay.",
      },
    ],
    sources: [
      { title: "Guidance Note 067 — Long Service Leave", url: ACT_GN, publisher: "WorkSafe ACT" },
      { title: "Portable long service leave in the ACT", url: "https://actleave.act.gov.au/", publisher: "ACT Leave" },
    ],
  },

  // ---------------------------------------------------------------------------
  nt: {
    milestones: [7, 8, 10, 14, 15, 20],
    actNote:
      "The Long Service Leave Act 1981 covers most NT private sector employees; NT and Australian Government employees and NT Build construction workers are outside it. Disputes go to the Office of the Commissioner for Public Employment (OCPE), which can investigate, request your employer's records and refer a matter to the Solicitor for the Northern Territory.",
    payCalc: [
      "While on leave you are paid your usual rate of pay, which does not include overtime, penalties, or district and site allowances.",
      "Only completed years are paid. After 10 years the credit is paid out when you resign — 14½ years pays 14 — less any leave already used. Part years, absences on workers compensation and unpaid leave do not accumulate any leave at all.",
      "Between 7 and 10 years, a resignation for illness, incapacity or a domestic or other pressing necessity has to be shown to be genuine and the real reason, and one a reasonable person would make. If your employer goes bankrupt or into liquidation, unpaid long service leave may be covered by the Australian Government's Fair Entitlements Guarantee.",
    ],
    takingLeave: [
      "Leave is taken in one continuous period or, if your employer agrees, in no more than 3 periods of at least 4 weeks each.",
      "Public holidays and weekends are part of long service leave and do not add days to it. Your employer can require you to take your entitlement, but must give at least 2 months' notice.",
    ],
    continuity: [
      "Casual employment accumulates long service leave, and your service carries across when the business is transferred to a new owner.",
    ],
    portableIntro:
      "Construction workers in the Territory accrue through the NT Build portable long service scheme rather than the 1981 Act.",
    portable: [{ name: "NT Build", covers: "construction workers", url: "https://www.ntbuild.com.au/" }],
    faqs: [
      {
        q: "Can I split long service leave in the NT?",
        a: "Only if your employer agrees, and then into no more than 3 periods of at least 4 weeks each. Otherwise it is taken in one continuous period.",
      },
      {
        q: "Do public holidays extend NT long service leave?",
        a: "No. Public holidays and weekends are part of long service leave in the NT and do not add extra days.",
      },
      {
        q: "How do I make a long service leave complaint in the NT?",
        a: "Call the Office of the Commissioner for Public Employment for help from a consultant. If that does not resolve it, lodge the long service leave complaint form with the OCPE, which can investigate, ask your employer for records, and refer the matter to the Solicitor for the Northern Territory or recommend you take your own legal action.",
      },
    ],
    sources: [{ title: "Long service leave", url: NT_LSL, publisher: "NT Government (OCPE)" }],
  },
};
