import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, formatAUD } from "@/lib/constants";
import { PRO_RATA_DEFAULTS, calculateProRata } from "@/lib/constants/minimum-wage";
import ProRataSalaryCalculator from "@/modules/calculator/pro-rata-salary-calculator";
import { PRO_RATA_EXAMPLE, PRO_RATA_FAQS } from "@/modules/guide/pro-rata-salary-faqs";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Maximum weekly hours", url: "https://www.fairwork.gov.au/employment-conditions/hours-of-work-breaks-and-rosters/hours-of-work", publisher: SOURCES.fwo.name },
  { title: "Part-time employees", url: "https://www.fairwork.gov.au/starting-employment/types-of-employees/part-time-employees", publisher: SOURCES.fwo.name },
  { title: "Annual leave", url: "https://www.fairwork.gov.au/leave/annual-leave", publisher: SOURCES.fwo.name },
];

const EXAMPLE_SALARIES = [60_000, 80_000, 100_000, 120_000];
const EXAMPLE_DAYS = [2, 3, 4];

export default function ProRataSalaryPage() {
  const ex = PRO_RATA_EXAMPLE;
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Pro-Rata Salary Calculator</span></li>
          </ol>
        </nav>

        <header className="mb-8 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H2}>
            Pro-Rata Salary Calculator {SITE_CONFIG.financialYear}
          </h1>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> pro-rata salary = full-time salary &times; (your hours &divide; full-time hours). On {formatAUD(ex.fte)} full time, 3 days a week (0.6 FTE) pays <strong>{formatAUD(ex.threeDays.annualSalary)} a year</strong>, or {formatAUD(ex.threeDays.fortnightly, 2)} a fortnight before tax. Your hourly rate stays at {formatAUD(ex.threeDays.hourlyRate, 2)}.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-12">
          <ProRataSalaryCalculator />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="what-is-pro-rata">
              <h2 style={H2}>What Is a Pro-Rata Salary?</h2>
              <p>
                &ldquo;Pro rata&rdquo; means &ldquo;in proportion&rdquo;. A pro-rata salary is the full-time salary for a role, paid in proportion to the hours you work. Job ads say &ldquo;{formatAUD(ex.fte)} pro rata&rdquo; or &ldquo;{formatAUD(ex.fte)} FTE&rdquo; to quote the full-time figure for a part-time job, so you can compare it with full-time roles. What you are actually paid is that figure multiplied by your fraction of full time.
              </p>
              <p>
                Full time is normally {EMPLOYMENT.standardWeeklyHours} ordinary hours a week, the maximum under the National Employment Standards, or {EMPLOYMENT.standardWeeklyHours / 5} hours a day over five days. Some awards and agreements use 35, 37.5 or 40 hours; the calculator lets you change it.
              </p>
            </section>

            <section id="examples">
              <h2 style={H2}>Pro-Rata Salary Examples</h2>
              <p>Annual salary before tax, working full days:</p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">Pro-rata salary by full-time salary and days worked</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Full-time salary</th>
                        {EXAMPLE_DAYS.map((d) => (
                          <th key={d} scope="col" className="px-5 py-4">{d} days ({(d / 5).toFixed(1)} FTE)</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {EXAMPLE_SALARIES.map((s) => (
                        <tr key={s}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{formatAUD(s)}</th>
                          {EXAMPLE_DAYS.map((d) => (
                            <td key={d} className="px-5 py-3">
                              {formatAUD(calculateProRata({ ...PRO_RATA_DEFAULTS, fteSalary: s, mode: "days", daysPerWeek: d }).annualSalary)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                To see any of these after tax, enter the pro-rata figure in the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>, or browse <Link href="/take-home-pay-on/50000/">take-home pay on $50,000</Link> and nearby salaries.
              </p>
            </section>

            <section id="hours-or-days">
              <h2 style={H2}>Hours or Days: Which Should You Use?</h2>
              <p>
                Use hours whenever your days are not full {EMPLOYMENT.standardWeeklyHours / 5}-hour days. Three 6-hour days is 18 hours, or 0.47 FTE, not 0.6. Your employment contract or roster states your ordinary hours, and those are what count for pay, leave and super.
              </p>
            </section>

            <section id="part-year">
              <h2 style={H2}>Pro-Rata Pay for Part of a Year</h2>
              <p>
                The same idea applies when you start or leave part-way through a year. Six months full time on {formatAUD(ex.fte)} is {formatAUD(ex.halfYear.payableSalary)}. Payroll systems usually pro-rate a first or last pay by the working days or calendar days in that pay period, so check your payslip against the daily rate: {formatAUD(ex.fte / 260, 2)} a working day on {formatAUD(ex.fte)} over 260 working days. For a final pay with leave paid out, the <Link href="/final-pay-calculator/">final pay calculator</Link> covers the rest.
              </p>
            </section>

            <section id="leave-super">
              <h2 style={H2}>Leave, Super and Public Holidays When You Work Part Time</h2>
              <ul>
                <li><strong>Annual leave:</strong> {EMPLOYMENT.annualLeaveWeeks} weeks a year of your own ordinary hours, so a 3-day-a-week employee gets 12 days. See the <Link href="/leave-calculator/">leave calculator</Link>.</li>
                <li><strong>Personal/carer&rsquo;s leave:</strong> {EMPLOYMENT.personalLeaveDays} days a year, pro rata to your ordinary hours.</li>
                <li><strong>Super:</strong> your employer pays the super guarantee on your pro-rata salary; see the <Link href="/superannuation-calculator/">super calculator</Link>.</li>
                <li><strong>Public holidays:</strong> paid when they fall on a day you would normally work.</li>
              </ul>
              <p>
                Casual employees are different: there is no pro-rata salary or paid leave, and a 25% loading is paid instead. Compare the two with the <Link href="/casual-loading-calculator/">casual loading calculator</Link>.
              </p>
            </section>

            <section id="faq">
              <h2 style={H2}>Frequently Asked Questions</h2>
              {PRO_RATA_FAQS.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this calculator works">
                <p>
                  The fraction of full time is your hours divided by full-time hours (or days by full-time days), capped at 1. The pro-rata salary is the full-time salary times that fraction; weekly pay divides by {EMPLOYMENT.weeksPerYear}, fortnightly by 26 and monthly by 12. The part-year figure multiplies by months worked over 12. After-tax amounts use this site&rsquo;s {SITE_CONFIG.financialYear} resident tax engine, with the tax-free threshold claimed and no HECS debt. The formula is covered by automated tests.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {(() => { const a = getGuideAuthorship("pro-rata-salary-calculator"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Related Calculators</h2>
                  <div className="space-y-3">
                    {[
                      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
                      { href: "/casual-loading-calculator/", label: "Casual Loading Calculator" },
                      { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Salary" },
                      { href: "/employment-type-calculator/", label: "Full-Time vs Part-Time vs Casual" },
                      { href: "/minimum-wage-australia/", label: "Minimum Wage Australia" },
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
