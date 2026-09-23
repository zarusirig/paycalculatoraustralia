import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, formatAUD } from "@/lib/constants";
import { CASUAL_LOADING, NMW_ORDER } from "@/lib/constants/junior-rates";
import {
  HOSPITALITY_AWARD,
  HOSPITALITY_PENALTIES,
  RETAIL_AWARD,
  RETAIL_PENALTIES,
} from "@/lib/constants/hospitality-award";
import { SCHADS_AWARD, SCHADS_PENALTIES } from "@/lib/constants/schads-award";
import { FAST_FOOD_LEVEL_1, NMW } from "@/lib/constants/minimum-wage";
import CasualLoadingCalculator from "@/modules/calculator/casual-loading-calculator";
import { CASUAL_FAQS, EXAMPLE_ALL_LEAVE, EXAMPLE_NO_SICK } from "@/modules/guide/casual-loading-faqs";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;

const SOURCES_LIST: SourceLink[] = [
  { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: SOURCES.fwc.name },
  { title: "Casual employees", url: "https://www.fairwork.gov.au/employment-conditions/types-of-employees/casual-employees", publisher: SOURCES.fwo.name },
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwo.name },
  { title: `${FAST_FOOD_LEVEL_1.award}, cl 11.2(b)`, url: FAST_FOOD_LEVEL_1.awardTextUrl, publisher: SOURCES.fwc.name },
];

const LOADING_TABLE = [
  { instrument: "No award (National Minimum Wage Order)", loading: CASUAL_LOADING, sunday: null as number | null, href: "/minimum-wage-australia/" },
  { instrument: `${RETAIL_AWARD.name} (${RETAIL_AWARD.code})`, loading: RETAIL_AWARD.casualLoading, sunday: RETAIL_PENALTIES.casualSunday, href: "/retail-award-rates/" },
  { instrument: `${HOSPITALITY_AWARD.name} (${HOSPITALITY_AWARD.code})`, loading: HOSPITALITY_AWARD.casualLoading, sunday: HOSPITALITY_PENALTIES.casualSunday, href: "/hospitality-award-rates/" },
  { instrument: `${FAST_FOOD_LEVEL_1.award} (${FAST_FOOD_LEVEL_1.code})`, loading: 0.25, sunday: null, href: null },
  { instrument: `SCHADS Award (${SCHADS_AWARD.code})`, loading: SCHADS_AWARD.casualLoading, sunday: SCHADS_PENALTIES.casualSunday, href: "/schads-award-pay-rates/" },
];

export default function CasualLoadingPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Casual Loading Calculator</span></li>
          </ol>
        </nav>

        <header className="mb-8 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H2}>
            Casual Loading Calculator {SITE_CONFIG.financialYear}
          </h1>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> casual loading in Australia is usually <strong>{pct(CASUAL_LOADING)}</strong> of the base hourly rate, so casual rate = base rate &times; 1.25. On the {formatAUD(NMW.hourly, 2)} minimum wage that is <strong>{formatAUD(NMW.casualHourly, 2)} an hour</strong>. The loading replaces paid leave; on the same hours, paid leave alone is worth the equivalent of a loading of about {pct(EXAMPLE_NO_SICK.breakEvenLoading)}.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-12">
          <CasualLoadingCalculator />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="loading-by-award">
              <h2 style={H2}>Casual Loading Rate by Award</h2>
              <p>
                The {pct(CASUAL_LOADING)} figure is set instrument by instrument. These are the loadings in the National Minimum Wage Order and the awards that cover the most casuals, with the casual Sunday rate as a percentage of the base rate:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[32rem] text-left text-sm text-navy">
                    <caption className="sr-only">Casual loading by award</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Award or order</th>
                        <th scope="col" className="px-5 py-4">Casual loading</th>
                        <th scope="col" className="px-5 py-4">Casual Sunday</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {LOADING_TABLE.map((r) => (
                        <tr key={r.instrument}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">
                            {r.href ? <Link href={r.href} className="text-eucalyptus-dark hover:underline">{r.instrument}</Link> : r.instrument}
                          </th>
                          <td className="px-5 py-3 font-medium">{pct(r.loading)}</td>
                          <td className="px-5 py-3">{r.sunday ? pct(r.sunday) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  Sunday rates for non-shiftworkers from each award&rsquo;s penalty table. Fast food Sunday rates vary by level, so they are not shown; the award adds the loading to the penalty in the same way.
                </p>
              </div>
              <p>
                <strong>The loading is added, not compounded.</strong> In these awards the casual penalty is the permanent penalty plus 25 percentage points. A retail casual on Sunday gets {pct(RETAIL_PENALTIES.casualSunday)} ({pct(RETAIL_PENALTIES.sunday)} + 25%), not 150% &times; 1.25 = 187.5%. Using 1.25 &times; the permanent penalty rate overstates weekend casual pay.
              </p>
            </section>

            <section id="what-it-replaces">
              <h2 style={H2}>What Casual Loading Pays For</h2>
              <p>
                Casuals do not get the paid entitlements permanent employees do, and the loading is compensation for that. It replaces:
              </p>
              <ul>
                <li><strong>Paid annual leave:</strong> {EMPLOYMENT.annualLeaveWeeks} weeks a year for a permanent employee.</li>
                <li><strong>Paid personal/carer&rsquo;s leave:</strong> {EMPLOYMENT.personalLeaveDays} days a year.</li>
                <li><strong>Paid public holidays</strong> that fall on a day you would normally work.</li>
                <li><strong>Notice of termination and redundancy pay.</strong></li>
              </ul>
              <p>
                Casuals do get super, calculated on pay that includes the loading, and unpaid carer&rsquo;s and compassionate leave. The <Link href="/employment-type-calculator/">employment type calculator</Link> compares full-time, part-time and casual more broadly.
              </p>
            </section>

            <section id="worked-example">
              <h2 style={H2}>Casual vs Permanent: A Worked Example</h2>
              <p>
                Take a $30.00 base rate, {EMPLOYMENT.standardWeeklyHours} hours a week, and four weeks&rsquo; holiday a year for both employees.
              </p>
              <ul>
                <li>The permanent employee is paid {EMPLOYMENT.weeksPerYear} weeks: <strong>{formatAUD(EXAMPLE_NO_SICK.permanentAnnual)}</strong>.</li>
                <li>The casual is paid {formatAUD(EXAMPLE_NO_SICK.casualHourly, 2)} an hour for the {EXAMPLE_NO_SICK.weeksWorked} weeks worked: <strong>{formatAUD(EXAMPLE_NO_SICK.casualAnnual)}</strong>, which is {formatAUD(EXAMPLE_NO_SICK.difference)} more.</li>
                <li>If the permanent employee also takes all ten sick days and the award pays 17.5% leave loading, the gap narrows to {formatAUD(EXAMPLE_ALL_LEAVE.difference)}, and the break-even loading rises to {pct(EXAMPLE_ALL_LEAVE.breakEvenLoading)}.</li>
              </ul>
              <p>
                So at 25%, casual work usually pays more in cash for the same hours. The trade is certainty: a casual has no guaranteed hours, is not paid for public holidays off, and has no notice or redundancy pay when the work stops.
              </p>
            </section>

            <section id="juniors">
              <h2 style={H2}>Casual Loading for Junior Employees</h2>
              <p>
                Juniors get the same 25% loading on their junior rate. A 16-year-old on no award earns the junior rate plus 25%. See <Link href="/junior-pay-rates/">minimum wage by age</Link> for every age&rsquo;s casual rate, or the <Link href="/minimum-wage-by-age/16/">16-year-old</Link> and <Link href="/minimum-wage-by-age/15/">15-year-old</Link> pages.
              </p>
            </section>

            <section id="faq">
              <h2 style={H2}>Frequently Asked Questions</h2>
              {CASUAL_FAQS.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this calculator works">
                <p>
                  The casual rate is the base rate times (1 + loading), rounded to the cent. For the annual comparison both employees work the same weekly hours and take the same {EMPLOYMENT.annualLeaveWeeks} weeks&rsquo; holiday and sick days; the permanent employee is paid for {EMPLOYMENT.weeksPerYear} weeks (plus leave loading if ticked), the casual only for the weeks worked. Penalty rates, overtime and public holidays are excluded. Super uses the {SITE_CONFIG.financialYear} super guarantee rate. Loadings come from the {NMW_ORDER.citation} and each award&rsquo;s casual employment clause; the arithmetic is covered by automated tests.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {(() => { const a = getGuideAuthorship("casual-loading-calculator"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Related</h2>
                  <div className="space-y-3">
                    {[
                      { href: "/employment-type-calculator/", label: "Employment Type Calculator" },
                      { href: "/pro-rata-salary-calculator/", label: "Pro-Rata Salary Calculator" },
                      { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates" },
                      { href: "/minimum-wage-australia/", label: "Minimum Wage Australia" },
                      { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
                    ].map((l) => (
                      <Link key={l.href} href={l.href} className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm">
                        <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{l.label}</span>
                        <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
