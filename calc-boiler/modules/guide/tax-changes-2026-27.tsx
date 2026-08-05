"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  SITE_CONFIG,
  SOURCES,
  HECS_HELP,
  SUPER_GUARANTEE,
  MEDICARE_LEVY,
  GENERAL_INTEREST_CHARGE,
  PAYDAY_SUPER_CAP_RELIEF,
  TAX_BRACKETS_2025_26,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
} from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { TAX_CHANGES_2026_27_FAQS } from "./tax-changes-2026-27-faqs";

const HECS_SOURCE_URL = "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds";

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers", publisher: SOURCES.ato.name },
  { title: "Study and training support loans rates and repayment thresholds", url: HECS_SOURCE_URL, publisher: SOURCES.ato.name },
  { title: "Medicare levy thresholds", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: SOURCES.ato.name },
  { title: "General interest charge rates", url: GENERAL_INTEREST_CHARGE.sourceUrl, publisher: SOURCES.ato.name },
];

// Take-home pay under the current FY2026-27 engine: LITO applied
// (non-refundable), 2% Medicare levy, no HECS, no MLS, resident.
function takeHomeCurrent(gross: number): number {
  const netTax = Math.max(0, calculateIncomeTax(gross) - calculateLITO(gross));
  return gross - netTax - calculateMedicareLevy(gross);
}

// FY2025-26 comparison column. Identical LITO and Medicare settings; only the
// bracket scale differs, taken from the retained historical constant. Mirrors
// the arithmetic of calculateIncomeTax.
function takeHomePrevious(gross: number): number {
  let tax = 0;
  for (let i = TAX_BRACKETS_2025_26.length - 1; i >= 0; i--) {
    const bracket = TAX_BRACKETS_2025_26[i];
    if (gross >= bracket.min) {
      tax = bracket.base + (gross - (bracket.min - 1)) * bracket.rate;
      break;
    }
  }
  const netTax = Math.max(0, tax - calculateLITO(gross));
  return gross - netTax - calculateMedicareLevy(gross);
}

const TAKE_HOME_SALARIES = [60_000, 80_000, 100_000, 120_000, 150_000, 200_000] as const;

export default function TaxChanges202627Page() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Tax Changes 2026-27</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Tax Changes 2026-27 — What&apos;s Changing From 1 July 2026
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            The confirmed Australian tax changes for the 2026-27 financial year, now in effect. From the 15% rate cut and Payday Super to the published HECS thresholds, here&apos;s what you need to know to plan your take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-xl not-prose mb-8">
              <p className="text-navy text-sm font-medium">
                <strong>Living Document</strong>
                <br />
                This page will be updated as further changes are confirmed. Last updated: 5 August 2026.
              </p>
            </div>

            {/* SECTION 1: Overview */}
            <section id="overview">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY2026-27 Tax Year Overview</h2>
              <p>
                The 2026-27 financial year runs from <strong>1 July 2026 to 30 June 2027</strong>. The year&apos;s settings are now confirmed: the legislated rate cut took effect on 1 July 2026, the ATO has published the 2026-27 HELP repayment thresholds and super contribution caps, and the headline measures from the 12 May 2026 federal budget &mdash; including the CGT changes that start on 1 July 2027 &mdash; have passed into law.
              </p>
              <p>
                Building on the Stage 3 structure that took effect on 1 July 2024, the legislated cost-of-living tax cuts lower the first marginal rate from <strong>16% to 15%</strong> on 1 July 2026 (and to 14% from 1 July 2027). For anyone earning $45,000 or more, that is a tax cut of <strong>$268 per year</strong> in FY2026-27. All other rates and thresholds carry over from FY2025-26.
              </p>
            </section>

            {/* SECTION 2: Confirmed Changes */}
            <section id="confirmed-changes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Confirmed Changes for FY2026-27</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>First Tax Rate Drops from 16% to 15%</h3>
              <p>
                Under the cost-of-living tax cuts legislated in 2025, the marginal rate on income between <strong>$18,201 and $45,000</strong> falls from 16% to <strong>15%</strong> on 1 July 2026. This delivers up to <strong>$268</strong> in annual tax savings, with the full amount going to anyone earning $45,000 or more. A further cut to <strong>14%</strong> is legislated for 1 July 2027. PAYG withholding schedules have been updated accordingly &mdash; see our <Link href="/payg-withholding-tables/">PAYG withholding tables</Link> for the new weekly, fortnightly and monthly amounts.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super Guarantee Stays at 12%</h3>
              <p>
                The Superannuation Guarantee (SG) rate reached its legislated ceiling of <strong>12%</strong> on 1 July 2025 after a decade-long incremental increase from 9.5%. No further increases are legislated for FY2026-27 or beyond. Employers must continue paying SG on ordinary time earnings up to the maximum super contribution base.
              </p>
              <p>
                The concessional contributions cap is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> for FY2026-27 (up from {formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)}), and the non-concessional cap is <strong>{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</strong> &mdash; both confirmed by the ATO and applying from 1 July 2026. These caps are indexed to Average Weekly Ordinary Time Earnings (AWOTE) and are rounded down to the nearest $2,500.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Payday Super Starts</h3>
              <p>
                Payday Super commenced on <strong>1 July 2026</strong>. Employers must now get super guarantee contributions into your fund within <strong>7 business days of each payday</strong> instead of quarterly, and the maximum contribution base became an annual figure of <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong>. Late payments attract a rebuilt super guarantee charge with interest at the general interest charge rate &mdash; <strong>{(GENERAL_INTEREST_CHARGE.annualRate * 100).toFixed(2)}%</strong> for {GENERAL_INTEREST_CHARGE.quarter}. That rate resets quarterly, with the next rate due {GENERAL_INTEREST_CHARGE.nextRateDue}.
              </p>
              <p>
                One transition measure is still pending: relief {PAYDAY_SUPER_CAP_RELIEF.purpose} was announced by {PAYDAY_SUPER_CAP_RELIEF.announcedBy}, but it is <strong>not yet law</strong> &mdash; the ATO&apos;s changeover page still says &ldquo;{PAYDAY_SUPER_CAP_RELIEF.atoWording}&rdquo; Treat the {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap as it stands until legislation passes.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS-HELP Thresholds Confirmed</h3>
              <p>
                The ATO has published the 2026-27 HELP/STSL repayment thresholds &mdash; see <a href={HECS_SOURCE_URL}>Study and training support loans rates and repayment thresholds</a>. You repay nothing on repayment income up to <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> (up from {formatAUD(HECS_HELP.previousThreshold)} in FY2025-26). Above that, repayments are <strong>{(HECS_HELP.bands[1].marginalRate * 100).toFixed(0)}c for each $1 over {formatAUD(HECS_HELP.minimumThreshold)}</strong> up to {formatAUD(HECS_HELP.bands[1].max)}, then <strong>{formatAUD(HECS_HELP.bands[2].base)} plus {(HECS_HELP.bands[2].marginalRate * 100).toFixed(0)}c for each $1 over {formatAUD(HECS_HELP.bands[1].max)}</strong> up to {formatAUD(HECS_HELP.bands[2].max)}, and <strong>{(HECS_HELP.bands[3].marginalRate * 100).toFixed(0)}% of total repayment income</strong> from {formatAUD(HECS_HELP.bands[3].min)}.
              </p>
              <p>
                Under this marginal system, introduced in FY2025-26, you only pay the repayment percentage on income <em>above</em> each threshold, not on your entire income. Work out your exact repayment with the <Link href="/hecs-help-calculator/">HECS-HELP Calculator</Link>, or see our <Link href="/hecs-help-guide/">HECS-HELP Guide</Link> for the full breakdown.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Medicare Levy Thresholds</h3>
              <p>
                The Medicare levy low-income thresholds are adjusted annually, but the ATO publishes them in arrears: its threshold pages (last updated 30 June 2026) still show only the 2025-26 figures, and no 2026-27 thresholds have been legislated yet. The operative numbers are therefore the 2025-26 ones &mdash; no levy below <strong>{formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}</strong> for singles, phasing in at 10c per dollar up to {formatAUD(MEDICARE_LEVY.shadeInThreshold)} (the singles upper threshold), with the family threshold starting at {formatAUD(MEDICARE_LEVY.familyThreshold)} plus {formatAUD(MEDICARE_LEVY.additionalChild)} per dependent child.
              </p>
              <p>
                The Medicare Levy Surcharge tiers <em>are</em> confirmed for FY2026-27: the surcharge starts above <strong>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}</strong> for singles and <strong>{formatAUD(MEDICARE_LEVY.surcharge.familyTier1.min - 1)}</strong> for families, at rates of 1% to 1.5% for anyone without private hospital cover.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>CGT Discount Replacement Is Now Law (From 1 July 2027)</h3>
              <p>
                The 2026-27 budget&apos;s capital gains reforms have passed into law: from <strong>1 July 2027</strong>, the 50% CGT discount for individuals, trusts and partnerships is replaced with cost base indexation and a 30% minimum tax rate on capital gains, applying only to gains that accrue after that date. Nothing changes for assets sold during FY2026-27, and the ATO has not yet published indexation or apportionment guidance. See the <Link href="/capital-gains-tax-calculator/">Capital Gains Tax Calculator</Link> for the current rules.
              </p>
            </section>

            {/* SECTION 3: Expected Changes */}
            <section id="expected-changes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Other Confirmed FY2026-27 Settings</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Bracket Indexation</h3>
              <p>
                Australia does not automatically index income tax bracket thresholds to inflation &mdash; threshold changes require legislation. The bracket <em>thresholds</em> are unchanged for FY2026-27; the only legislated change is the rate cut on the first taxable bracket described above. See the <Link href="/tax-brackets/">current tax brackets</Link> for full detail.
              </p>
              <p>
                The FY2026-27 brackets are:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Taxable Income</th>
                        <th className="px-6 py-4">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4">$0 &ndash; $18,200</td><td className="px-6 py-4">0%</td></tr>
                      <tr><td className="px-6 py-4">$18,201 &ndash; $45,000</td><td className="px-6 py-4">15% <span className="text-warmgray">(was 16%)</span></td></tr>
                      <tr><td className="px-6 py-4">$45,001 &ndash; $135,000</td><td className="px-6 py-4">30%</td></tr>
                      <tr><td className="px-6 py-4">$135,001 &ndash; $190,000</td><td className="px-6 py-4">37%</td></tr>
                      <tr><td className="px-6 py-4">$190,001+</td><td className="px-6 py-4">45%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Low Income Tax Offset (LITO)</h3>
              <p>
                LITO provides up to <strong>$700</strong> in tax offset for low-to-middle income earners. The offset phases out between $37,500 and $66,667. These thresholds are not automatically indexed, so any changes would require budget legislation. No changes have been flagged.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Minimum Wage &mdash; FWC Annual Review</h3>
              <p>
                The Fair Work Commission conducts its Annual Wage Review each financial year, typically announcing the new national minimum wage in June for effect from 1 July. The FWC&apos;s 2 June 2026 decision lifted the national minimum wage from $24.95 to <strong>$26.44 per hour</strong> ($1,004.90 per week), effective 1 July 2026, alongside a 4.75% award wage increase.
              </p>
            </section>

            {/* SECTION 4: Impact on Take-Home Pay */}
            <section id="impact-take-home-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Impact on Take-Home Pay</h2>
              <p>
                The legislated rate cut lifts take-home pay by up to <strong>$268 a year</strong> (about $5.15 a week) for employees at the same nominal salary, with the full benefit reaching anyone earning $45,000 or more. On top of that, the indexed HECS threshold and the FWC minimum wage decision shape the final numbers.
              </p>
              <p>
                The table below shows annual take-home pay at key salary levels, computed from the same FY2026-27 tax engine that powers the site&apos;s calculators (LITO and the 2% Medicare levy included; no HECS debt, no MLS, resident status).
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Gross Salary</th>
                        <th className="px-6 py-4">FY2025-26 Take-Home</th>
                        <th className="px-6 py-4">FY2026-27 Take-Home</th>
                        <th className="px-6 py-4">Difference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {TAKE_HOME_SALARIES.map((gross) => {
                        const previous = takeHomePrevious(gross);
                        const current = takeHomeCurrent(gross);
                        return (
                          <tr key={gross}>
                            <td className="px-6 py-4 font-medium">{formatAUD(gross)}</td>
                            <td className="px-6 py-4">{formatAUD(previous)}</td>
                            <td className="px-6 py-4">{formatAUD(current)}</td>
                            <td className="px-6 py-4 text-eucalyptus-dark font-medium">+{formatAUD(current - previous)}*</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">*Reflects the legislated 16% &rarr; 15% rate cut on income between $18,201 and $45,000 from 1 July 2026. Excludes HECS, MLS, and salary sacrifice.</p>
              </div>
            </section>

            {/* SECTION 5: How to Prepare */}
            <section id="how-to-prepare">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Prepare for FY2026-27</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Sacrifice Timing</h3>
              <p>
                If you are considering increasing salary sacrifice into superannuation, review your arrangements early in the financial year. The concessional contributions cap applies per financial year, so timing contributions strategically can maximise your tax benefit. Use our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model different scenarios.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super Contribution Planning</h3>
              <p>
                With the SG rate locked at 12%, any additional super contributions must come from salary sacrifice or personal after-tax contributions. The carry-forward rule allows you to use unused concessional cap amounts from the previous 5 years if your total super balance is under <strong>$500,000</strong>. This can be particularly valuable for one-off bonus years.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Action Item</strong>
                  <br />
                  Review your current salary sacrifice arrangements, HECS balance, and private health insurance status. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Income Tax Calculator</Link> to model your FY2026-27 take-home pay.
                </p>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS Voluntary Repayments</h3>
              <p>
                If you hold a HECS-HELP debt, consider making a voluntary repayment before <strong>1 June 2027</strong>, when the next annual indexation is applied. With the indexation cap set at the lower of CPI or WPI, the rate is moderate but still adds to your debt each year.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Private Health Insurance Review</h3>
              <p>
                If your income is approaching the FY2026-27 Medicare Levy Surcharge threshold of {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} for singles, compare the cost of basic hospital cover against the 1% surcharge. See our <Link href="/private-health-insurance-medicare/">Private Health Insurance &amp; Medicare guide</Link> for a detailed comparison.
              </p>
            </section>

            {/* SECTION 6: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              {/*
                The Radix accordion unmounts closed content, so answers never
                reach the rendered HTML. This mirror makes them crawlable and
                AI-Overview eligible — same pattern as the award/guide pages.
              */}
              <div className="sr-only">
                <h3>Tax changes 2026-27 questions and answers</h3>
                {TAX_CHANGES_2026_27_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {TAX_CHANGES_2026_27_FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Information is based on current legislation, ATO publications, and scheduled indexation formulas. Anything not yet legislated (such as the Payday Super cap relief) is clearly marked as pending. Take-home pay figures are computed from the FY2026-27 rates in the site&apos;s tax engine, with FY2025-26 figures shown for comparison. This page is updated as new information becomes available from the ATO, Treasury, and federal budget announcements.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-changes-2026-27"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/tax-brackets/" label="Tax Brackets 2026-27" />
                    <SidebarLink href="/stage-3-tax-cuts/" label="Stage 3 Tax Cuts Explained" />
                    <SidebarLink href="/hecs-help-guide/" label="HECS-HELP Guide" />
                    <SidebarLink href="/tax-bracket-history/" label="Tax Bracket History" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Model your FY2026-27 pay</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Use our calculator to estimate your take-home pay under current rates and plan for the year ahead.</p>
                  <Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Income Tax Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
