"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SG_RATE_FAQS } from "@/modules/guide/super-guarantee-rate-faqs";

// Retargeted 23 Sep 2026 (W2) to answer "superannuation rate" / "super
// guarantee rate" first: the rate is 12% from 1 July 2025. Rates from 1 July
// 2002 are the ATO's "Super guarantee" key rates table (Table 21, last updated
// 17 April 2026, read 23 Sep 2026), which also lists 12% for "1 July 2027
// onwards" and the Norfolk Island transitional rates. The ATO table starts at
// 2002, so 1992-2002 is shown as a single summarised row rather than per-year
// figures we could not verify against a primary source (the pre-2002 rate
// also varied with employer payroll size).

const SOURCES_LIST: SourceLink[] = [
  { title: "Key superannuation rates and thresholds – super guarantee", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee", publisher: SOURCES.ato.name },
  { title: "Superannuation Guarantee (Administration) Act 1992", url: "https://www.legislation.gov.au/C2004A04402/latest/text", publisher: "Federal Register of Legislation" },
];

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const RATE = formatPercent(SUPER_GUARANTEE.rate, 0);
const FY = SITE_CONFIG.financialYear;

/** ATO Table 21, general super guarantee %. */
const SG_RATES: { period: string; rate: string; current?: boolean }[] = [
  { period: "1 July 2027 onwards", rate: "12%" },
  { period: `1 July 2026 – 30 June 2027 (${FY}, current)`, rate: "12%", current: true },
  { period: "1 July 2025 – 30 June 2026", rate: "12%" },
  { period: "1 July 2024 – 30 June 2025", rate: "11.5%" },
  { period: "1 July 2023 – 30 June 2024", rate: "11%" },
  { period: "1 July 2022 – 30 June 2023", rate: "10.5%" },
  { period: "1 July 2021 – 30 June 2022", rate: "10%" },
  { period: "1 July 2014 – 30 June 2021", rate: "9.5%" },
  { period: "1 July 2013 – 30 June 2014", rate: "9.25%" },
  { period: "1 July 2002 – 30 June 2013", rate: "9%" },
  { period: "1 July 1992 – 30 June 2002", rate: "Phased in; varied by employer payroll" },
];

const SUPER_ON = [60_000, 80_000, 100_000, 120_000];

export default function SuperGuaranteeRateHistoryPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/superannuation-guide/" className="hover:text-eucalyptus-dark hover:underline">Superannuation</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Super Guarantee Rate</span></li>
          </ol>
        </nav>

        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={FONT}>
            Superannuation Guarantee Rate: {RATE} from {SUPER_GUARANTEE.effectiveDate}
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            The super guarantee rate is <strong>{RATE}</strong>. It rose from {formatPercent(SUPER_GUARANTEE.previousRate, 1)} on {SUPER_GUARANTEE.effectiveDate}, stays at {RATE} for {FY}, and {RATE} is the rate the ATO lists for 1 July 2027 onwards. Your employer pays it on top of your wages: {formatAUD(100_000 * SUPER_GUARANTEE.rate)} a year on a {formatAUD(100_000)} salary. From {SUPER_GUARANTEE.paydaySuperStart} it is paid with every pay under Payday Super.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-10 grid gap-4 sm:grid-cols-3 not-prose max-w-4xl">
          {[
            { k: `SG rate ${FY}`, v: RATE, s: `Since ${SUPER_GUARANTEE.effectiveDate}` },
            { k: "Previous rate", v: formatPercent(SUPER_GUARANTEE.previousRate, 1), s: "2024-25" },
            { k: "Norfolk Island", v: formatPercent(SUPER_GUARANTEE.norfolkIslandRate, 0), s: `${FY}, reaching 12% on 1 July 2027` },
          ].map((c) => (
            <div key={c.k} className="rounded-xl border border-sandstone-dark/20 bg-sandstone/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">{c.k}</p>
              <p className="text-2xl font-extrabold text-navy tabular-nums" style={FONT}>{c.v}</p>
              <p className="text-xs text-warmgray-light">{c.s}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="current-rate">
              <h2 style={FONT}>The Current Superannuation Rate</h2>
              <p>
                The superannuation guarantee (SG) is the minimum your employer must contribute to your super fund. For {FY} it is <strong>{RATE}</strong>, the same as {SITE_CONFIG.previousFinancialYear}. What changed on {SUPER_GUARANTEE.paydaySuperStart} is <em>when and on what</em> it is paid: under Payday Super, employers pay SG for each payday, calculated on your <strong>qualifying earnings</strong> rather than quarterly on ordinary time earnings.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-6 py-3">Salary</th><th className="px-6 py-3 border-l text-right">Employer super at {RATE}</th><th className="px-6 py-3 border-l text-right">Per fortnight</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {SUPER_ON.map((s) => (
                        <tr key={s}><td className="px-6 py-3 font-semibold">{formatAUD(s)}</td><td className="px-6 py-3 border-l text-right">{formatAUD(s * SUPER_GUARANTEE.rate)}</td><td className="px-6 py-3 border-l text-right">{formatAUD((s * SUPER_GUARANTEE.rate) / 26, 2)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Paid on top of salary unless your package is quoted including super. SG isn&rsquo;t payable on earnings above the annual maximum contribution base of {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}. Work out your own figure with the <Link href="/superannuation-calculator/" className="underline">super calculator</Link>.</p>
              </div>
              <p>
                Employer SG counts towards your <Link href="/concessional-contributions-cap/">concessional contributions cap</Link> of {formatAUD(SUPER_GUARANTEE.concessionalCap)}, which also covers salary sacrifice. If your employer pays late or short, see the <Link href="/super-guarantee-charge/">super guarantee charge</Link>.
              </p>
            </section>

            <section id="sg-rate-timeline">
              <h2 style={FONT}>Super Guarantee Rate History</h2>
              <p>
                Compulsory employer super began on 1 July 1992 under the <em>Superannuation Guarantee (Administration) Act 1992</em>. The rate reached 9% in July 2002, sat at 9.5% for seven years from July 2014, then rose half a percentage point a year until it reached {RATE} on {SUPER_GUARANTEE.effectiveDate}.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Period</th>
                        <th className="px-6 py-4 border-l text-right">SG rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {SG_RATES.map((row) => (
                        <tr key={row.period} className={row.current ? "bg-eucalyptus/5" : ""}>
                          <td className="px-6 py-4 font-semibold text-navy bg-sandstone">{row.period}</td>
                          <td className={`px-6 py-4 border-l text-right ${row.current ? "font-bold text-eucalyptus-dark" : ""}`}>{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">ATO, super guarantee percentage (Table 21), from 1 July 2002. Before then the rate was phased in and depended on the employer&rsquo;s payroll.</p>
              </div>
            </section>

            <section id="impact-take-home">
              <h2 style={FONT}>What Each Rise Meant on {formatAUD(100_000)}</h2>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-6 py-4">Period</th><th className="px-6 py-4 border-l text-right">SG rate</th><th className="px-6 py-4 border-l text-right">Annual super on $100K</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[["2014-15 to 2020-21", 0.095], ["2021-22", 0.10], ["2022-23", 0.105], ["2023-24", 0.11], ["2024-25", 0.115], ["2025-26 onwards", 0.12]].map(([p, r]) => (
                        <tr key={p as string}><td className="px-6 py-4 font-semibold text-navy bg-sandstone">{p}</td><td className="px-6 py-4 border-l text-right">{formatPercent(r as number, Math.round((r as number) * 1000) % 10 ? 1 : 0)}</td><td className="px-6 py-4 border-l text-right">{formatAUD(100_000 * (r as number))}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                SG is paid on top of salary, so a rate rise doesn&rsquo;t reduce the gross pay in your contract. Whether employers pass the cost on through smaller pay rises over time is debated among economists. The <Link href="/employer-cost-calculator/">employer cost calculator</Link> shows the full cost of employing someone.
              </p>
            </section>

            <section id="after-12">
              <h2 style={FONT}>Will the Super Rate Go Above 12%?</h2>
              <p>
                Not under current law. The Act sets the charge percentage at 12, and the ATO&rsquo;s table lists 12% for 1 July 2027 onwards. The only remaining step-up is Norfolk Island&rsquo;s transitional rate, which is {formatPercent(SUPER_GUARANTEE.norfolkIslandRate, 0)} for {FY} and reaches 12% on 1 July 2027.
              </p>
              <p>
                To put in more than the SG, you can salary sacrifice or make deductible personal contributions within the {formatAUD(SUPER_GUARANTEE.concessionalCap)} <Link href="/concessional-contributions-cap/">concessional cap</Link> (employer SG included), or make after-tax contributions up to the {formatAUD(SUPER_GUARANTEE.nonConcessionalCap)} non-concessional cap. See the <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> and our <Link href="/superannuation-guide/">superannuation guide</Link>.
              </p>
            </section>

            <section id="faq">
              <h2 style={FONT}>Frequently Asked Questions</h2>
              <div className="sr-only">
                <h3>Super guarantee rate questions and answers</h3>
                {SG_RATE_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {SG_RATE_FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-navy">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Rates from 1 July 2002 are the ATO&rsquo;s published super guarantee percentage table, verified 23 September 2026; the current rate and caps come from the site&rsquo;s single constants file. Dollar examples assume a single employer and a salary under the maximum contribution base, with no salary sacrifice.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {(() => { const a = getGuideAuthorship("super-guarantee-rate-history"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/concessional-contributions-cap/" label="Concessional Contributions Cap" />
                    <SidebarLink href="/superannuation-calculator/" label="Super Calculator" />
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                    <SidebarLink href="/super-guarantee-charge/" label="Super Guarantee Charge" />
                    <SidebarLink href="/employer-cost-calculator/" label="Employer Cost Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">How much super will you get?</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See what your employer pays at {RATE} on your salary, per pay and per year.</p>
                  <Link href="/superannuation-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Super Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
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

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}
