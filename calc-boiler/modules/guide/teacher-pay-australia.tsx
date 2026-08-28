"use client";
import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { TEACHER_PAY_STATES, graduateSalary, topOfClassroomScale } from "@/lib/data/teacher-pay";
import { formatAUD } from "@/lib/constants";

const SOURCES_LIST: SourceLink[] = [
  { title: "NSW Teachers Award", url: "https://www.nsw.gov.au/education-and-training/teaching-and-learning", publisher: "NSW Government" },
  { title: "Victorian Government Schools Agreement", url: "https://www.vic.gov.au/teachers", publisher: "Victorian Government" },
  { title: "Educational Services Award", url: "https://services.fairwork.gov.au/find-my-award", publisher: SOURCES.fwo.name },
];

export default function TeacherPayAustraliaPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Teacher Pay Australia</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Teacher Pay Australia — Salary Scales by State &amp; Experience Level
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Teacher salaries in Australia are set by state and territory governments through enterprise agreements and awards. Starting salaries range from $70,000 to $78,000 depending on the state, with top-of-band classroom teachers earning $104,000 to $118,000. This guide covers salary scales for every state, classification levels, and how teacher pay compares to other professions.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ── Section 1: Teacher Salary by State ── */}
            <section id="salary-by-state">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Teacher Salary by State</h2>
              <p>
                Teacher salaries differ across states and territories because each jurisdiction negotiates its own enterprise agreement for government school teachers. The table below shows the approximate annual salary at three key points on the classroom teacher pay scale: starting salary (Graduate), mid-band (typically Year 5–6), and top of band (the maximum a classroom teacher can earn without moving into a leadership role).
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">State / Territory</th>
                        <th className="px-5 py-3 text-right">Starting</th>
                        <th className="px-5 py-3 text-right">Mid-Band</th>
                        <th className="px-5 py-3 text-right">Top of Band</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">NSW</td><td className="px-5 py-3 text-right">$75,000</td><td className="px-5 py-3 text-right">$95,000</td><td className="px-5 py-3 text-right font-medium">$113,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">VIC</td><td className="px-5 py-3 text-right">$76,000</td><td className="px-5 py-3 text-right">$93,000</td><td className="px-5 py-3 text-right font-medium">$110,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">QLD</td><td className="px-5 py-3 text-right">$73,000</td><td className="px-5 py-3 text-right">$92,000</td><td className="px-5 py-3 text-right font-medium">$108,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">WA</td><td className="px-5 py-3 text-right">$76,000</td><td className="px-5 py-3 text-right">$96,000</td><td className="px-5 py-3 text-right font-medium">$115,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">SA</td><td className="px-5 py-3 text-right">$72,000</td><td className="px-5 py-3 text-right">$90,000</td><td className="px-5 py-3 text-right font-medium">$106,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">TAS</td><td className="px-5 py-3 text-right">$70,000</td><td className="px-5 py-3 text-right">$88,000</td><td className="px-5 py-3 text-right font-medium">$104,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">ACT</td><td className="px-5 py-3 text-right">$78,000</td><td className="px-5 py-3 text-right">$97,000</td><td className="px-5 py-3 text-right font-medium">$118,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">NT</td><td className="px-5 py-3 text-right">$74,000</td><td className="px-5 py-3 text-right">$94,000</td><td className="px-5 py-3 text-right font-medium">$112,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The ACT consistently offers the highest teacher salaries in Australia, followed by WA and NSW. Tasmania and South Australia sit at the lower end of the scale. These figures apply to government school teachers — Catholic and independent school salaries may differ based on their own enterprise agreements or individual contracts. Use the <Link href="/pay-calculator-nsw/">NSW Pay Calculator</Link> or <Link href="/pay-calculator-vic/">VIC Pay Calculator</Link> to calculate after-tax pay in your state. <strong>These summary figures are rounded and indicative only.</strong> For the exact published salary at every step &mdash; read from each state&rsquo;s enterprise agreement, with the date it took effect &mdash; use the per-state pages below.
              </p>
            </section>

            {/* ── Section 1b: Verified state pay scales (spoke selector) ── */}
            <section id="state-pay-scales">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full Pay Scale for Your State</h2>
              <p>
                The table above is a summary. Each state below has its own page carrying the <strong>complete</strong> published scale — every classification and step, the enterprise agreement it comes from, the date the rates took effect, and the rules for moving up a step. Every salary links to its take-home figure.
              </p>
              <div className="not-prose my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TEACHER_PAY_STATES.map((s) => {
                  const grad = graduateSalary(s);
                  const top = topOfClassroomScale(s);
                  return (
                    <Link
                      key={s.slug}
                      href={`/teacher-pay-australia/${s.slug}/`}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-sandstone-dark/20 bg-white p-4 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-navy group-hover:text-eucalyptus-dark">
                          {s.code} teacher salary
                        </span>
                        <span className="block text-xs text-warmgray">
                          {grad !== null && top !== null
                            ? `${formatAUD(grad)} to ${formatAUD(top)} · verified ${s.verifiedOn}`
                            : "Scale not yet verified — see the page"}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  );
                })}
              </div>
              <p>
                Those figures are the graduate step and the top of the classroom teacher scale, read from each state&rsquo;s own enterprise agreement or department salary schedule. Nothing on those pages is estimated.
              </p>
            </section>

            {/* ── Section 2: Teacher Classification Levels ── */}
            <section id="classification-levels">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Teacher Classification Levels</h2>
              <p>
                The Australian Professional Standards for Teachers define four career stages that correspond to salary classification levels across all states and territories:
              </p>
              <ul>
                <li><strong>Graduate Teacher:</strong> Newly qualified teachers in their first 1–2 years of practice. Graduate teachers enter at the bottom of the salary scale and are working towards demonstrating proficiency against the teaching standards.</li>
                <li><strong>Proficient Teacher:</strong> Teachers who have demonstrated competence against all 7 teaching standards. Most teachers reach Proficient status within 2–3 years and continue progressing through annual salary increments within this classification.</li>
                <li><strong>Highly Accomplished Teacher:</strong> An advanced voluntary certification recognising teachers who demonstrate exemplary practice. Not all states offer additional salary for this classification, but some provide allowances of <strong>$5,000–$10,000</strong> per year.</li>
                <li><strong>Lead Teacher / Head Teacher:</strong> The highest classification for teachers who take on leadership, mentoring, and curriculum development responsibilities. Head teachers in NSW earn <strong>$130,000–$145,000</strong>, while equivalent roles in other states carry similar salary premiums above the top-of-band classroom teacher rate.</li>
              </ul>
            </section>

            {/* ── Section 3: How Progression Works ── */}
            <section id="progression">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Progression Works</h2>
              <p>
                Teacher salary progression is largely automatic within the classroom teacher band. After achieving Proficient status (typically Year 2–3), teachers receive annual increments that move them through the salary scale until they reach the top of band. The number of increments varies by state — NSW has 13 steps from Graduate to top of band, while Victoria has 12.
              </p>
              <p>
                Progression beyond the top of band requires moving into a leadership or specialist role (Head Teacher, Deputy Principal, Principal) or achieving Highly Accomplished / Lead Teacher certification. Principal salaries range from <strong>$130,000 to $200,000+</strong> depending on school size, location, and complexity. Rural and remote school teachers may receive additional allowances of <strong>$3,000–$15,000</strong> per year as an incentive for working in hard-to-staff locations.
              </p>
              <p>
                Teachers can also increase their income through additional responsibilities such as year coordinator, subject head, or sports coordinator roles, which typically attract allowances of <strong>$2,000–$8,000</strong> per year on top of the classroom teacher salary.
              </p>
            </section>

            {/* ── Section 4: Teacher Salary After Tax ── */}
            <section id="salary-after-tax">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Teacher Salary After Tax</h2>
              <p>
                A mid-career teacher earning <strong>$95,000</strong> per year pays approximately <strong>$21,717</strong> in income tax and Medicare levy for FY2025-26, leaving a take-home pay of <strong>$73,283</strong> per year (approximately <strong>$2,819 per fortnight</strong>). On top of this, the employer pays superannuation at <strong>12%</strong> ($11,400), bringing the total remuneration package to <strong>$106,400</strong>.
              </p>
              <p>
                Government school teachers may also benefit from salary sacrifice into superannuation, which can reduce taxable income. Contributing an extra <strong>$5,000</strong> per year through salary sacrifice saves approximately <strong>$1,500</strong> in tax for a teacher on $95,000. See the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> for exact savings at your salary level.
              </p>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Teacher Take-Home Pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Section 5: Teacher Pay vs Other Professions ── */}
            <section id="comparison">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Teacher Pay vs Other Professions</h2>
              <p>
                Teacher pay in Australia is often debated in the context of attracting and retaining talent. At the graduate level, teacher starting salaries of <strong>$70,000–$78,000</strong> compare favourably with many other graduate roles. However, the salary ceiling for classroom teachers (<strong>$104,000–$118,000</strong>) is reached relatively quickly (within 10–13 years) and remains fixed without moving into leadership.
              </p>
              <p>
                By comparison, graduate engineers start at <strong>$65,000–$75,000</strong> but can reach <strong>$120,000–$160,000</strong> as senior engineers. Graduate accountants start at <strong>$55,000–$65,000</strong> but can reach <strong>$100,000–$150,000</strong> within 8–10 years. The national average full-time salary is approximately <strong>$98,000</strong>, meaning a mid-career teacher earning $95,000 is close to the national average. Visit <Link href="/average-salary-australia/">Average Salary Australia</Link> for broader comparisons across industries.
              </p>
            </section>

            {/* ── Section 6: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="starting-salary" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the starting salary for teachers in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Starting teacher salaries range from $70,000 in Tasmania to $78,000 in the ACT for government school teachers. NSW starts at $75,000, Victoria at $76,000, and Queensland at $73,000. These are base salaries before superannuation and any additional allowances.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="top-salary" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the maximum salary for a classroom teacher?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The top-of-band salary for classroom teachers ranges from $104,000 in Tasmania to $118,000 in the ACT. Most states reach $108,000–$115,000 at the top of the classroom teacher scale. Beyond this, teachers must move into leadership roles (Head Teacher, Deputy Principal, Principal) for further salary increases.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="increments" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How long does it take to reach top of band?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Most teachers reach the top of the classroom teacher band within 10–13 years, depending on the state. Annual increments are largely automatic after achieving Proficient Teacher status. NSW has 13 increments, Victoria has 12, and Queensland has 10.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="private-school" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do private school teachers earn more?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">It depends. Catholic systemic schools generally follow a pay scale similar to government schools. Independent schools set their own salaries, with some elite schools paying 5–15% above government rates. However, many independent schools pay at or below government rates. The main differences are in additional benefits, class sizes, and working conditions.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="rural-allowance" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do rural teachers get paid more?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Rural and remote school teachers receive incentive allowances ranging from $3,000 to $15,000 per year, depending on the remoteness of the school. Some states also offer subsidised housing, retention bonuses, and additional leave entitlements. These incentives are designed to attract and retain teachers in hard-to-staff locations.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-sacrifice" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can teachers salary sacrifice?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Government school teachers can salary sacrifice additional contributions into superannuation, which reduces taxable income and can save $1,000–$3,000 per year in tax depending on the contribution amount. Some states also allow salary sacrifice for laptops or novated vehicle leases. See the salary sacrifice calculator for exact savings.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Teacher salary data is sourced from published state and territory government enterprise agreements for government school teachers. Salary figures are approximate and reflect the most recent agreements in effect. Private and Catholic school salaries may differ. Tax calculations use ATO marginal rates for FY2025-26 including the 2% Medicare levy. Superannuation is calculated at the 12% SG rate.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("teacher-pay-australia"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/average-salary-australia/" label="Average Salary Australia" />
                    <SidebarLink href="/pay-calculator-nsw/" label="NSW Pay Calculator" />
                    <SidebarLink href="/pay-calculator-vic/" label="VIC Pay Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Teacher After-Tax Pay</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your teacher salary and see exactly how much you take home after tax, Medicare, and super.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Calculate Take-Home Pay
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
