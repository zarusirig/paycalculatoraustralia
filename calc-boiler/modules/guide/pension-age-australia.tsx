import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SOURCES } from "@/lib/constants";
import { SUPER_GUARANTEE } from "@/lib/constants/australian-tax";
import {
  AGE_PENSION_AGE,
  AGE_PENSION_AGE_SINCE,
  AGE_PENSION_CLAIM_WEEKS_EARLY,
  PENSION_AGE_SOURCES,
  PENSION_AGE_TABLE,
  PRESERVATION_AGE_TABLE,
  SUPER_ACCESS_AGE_WHILE_WORKING,
} from "@/lib/constants/pension-age";
import { PENSION_AGE_FAQS } from "@/modules/guide/pension-age-australia-faqs";
import RetirementDatesCalculator from "@/modules/guide/pension-age-calculator";

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Who can get Age Pension", url: PENSION_AGE_SOURCES.whoCanGet, publisher: SOURCES.servicesAustralia.name },
  { title: "How to prepare to claim Age Pension", url: PENSION_AGE_SOURCES.prepareToClaim, publisher: SOURCES.servicesAustralia.name },
  { title: "Social Security Guide 3.4.1.10: Qualification for Age", url: PENSION_AGE_SOURCES.dssGuide, publisher: "Department of Social Services" },
  { title: "When you can withdraw your super (preservation age)", url: PENSION_AGE_SOURCES.preservation, publisher: SOURCES.ato.name },
  { title: "Age discrimination: know your rights", url: PENSION_AGE_SOURCES.ageDiscrimination, publisher: "Australian Human Rights Commission" },
];

const fmtBorn = (from: string | null, to: string | null) => {
  const f = (s: string) =>
    new Date(`${s}T00:00:00Z`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  if (from === null && to) return `Before ${f(addDayIso(to))}`;
  if (to === null && from) return `On or after ${f(from)}`;
  return `${f(from!)} to ${f(to!)}`;
};
function addDayIso(s: string): string {
  const d = new Date(`${s}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function PensionAgeAustraliaPage() {
  const authorship = getGuideAuthorship("pension-age-australia");
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/superannuation-guide/" className="hover:text-eucalyptus-dark hover:underline">Superannuation</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Pension Age Australia</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 style={H} className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Pension Age in Australia: When You Can Get the Age Pension and Your Super
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            Enter your date of birth to see the date you reach Age Pension age, the date you can first claim, and when you can access your super.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> The Age Pension age in Australia is <strong>{AGE_PENSION_AGE}</strong> for anyone born on or after 1 January 1957. It has been {AGE_PENSION_AGE} since {AGE_PENSION_AGE_SINCE}. There is <strong>no compulsory retirement age</strong> for most workers. You can generally access your super at your <strong>preservation age of 60</strong> once you retire (if born from 1 July 1964), or at {SUPER_ACCESS_AGE_WHILE_WORKING} even if you keep working.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section className="not-prose mb-10">
              <RetirementDatesCalculator />
            </section>

            <section id="age-pension-age">
              <h2 style={H}>Age Pension age: {AGE_PENSION_AGE}</h2>
              <p>
                Services Australia says Age Pension age is {AGE_PENSION_AGE} years or older and that there are no plans to change it. It rose in six-month steps from 65, reaching {AGE_PENSION_AGE} on {AGE_PENSION_AGE_SINCE}. Anyone born before 1957 has already reached pension age. The table matters mainly if you are checking an older relative&rsquo;s dates.
              </p>
              <div className="not-prose overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-sandstone text-navy"><tr><th className="px-4 py-3">Date of birth</th><th className="px-4 py-3">Age Pension age</th></tr></thead>
                  <tbody className="divide-y divide-sandstone-dark/20 text-warmgray">
                    <tr><td className="px-4 py-3">Before 1 July 1952</td><td className="px-4 py-3">65 or younger (reached before 1 July 2017)</td></tr>
                    {PENSION_AGE_TABLE.map((b) => (
                      <tr key={b.label}><td className="px-4 py-3">{fmtBorn(b.bornFrom, b.bornTo)}</td><td className="px-4 py-3 font-medium text-navy">{b.label}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Reaching the age is only the first test. You also need to meet the residence rules, usually 10 years of Australian residence, and the income and assets tests. If you keep working, your wages go through the income test. The <Link href="/age-pension-income-test-calculator/">Age Pension income test calculator</Link> shows how much pension you would keep after the Work Bonus. You can lodge your claim up to {AGE_PENSION_CLAIM_WEEKS_EARLY} weeks before your pension age.
              </p>
            </section>

            <section id="retirement-age">
              <h2 style={H}>Retirement age in Australia: there isn&rsquo;t a compulsory one</h2>
              <p>
                Australia has no general retirement age. You can keep working as long as you like, and under the Age Discrimination Act 2004 an employer generally can&rsquo;t make you retire because of your age. A few public offices have a fixed age by law. Federal judges, for example, must retire at 70 under the Constitution.
              </p>
              <p>
                When people talk about the &ldquo;retirement age&rdquo;, they usually mean one of two different ages:
              </p>
              <ul>
                <li><strong>Age Pension age ({AGE_PENSION_AGE})</strong>: when you can get the government pension, if you pass the means tests.</li>
                <li><strong>Preservation age (60 for most people)</strong>: when you can access your super once you retire.</li>
              </ul>
              <p>The seven years between 60 and {AGE_PENSION_AGE} are the years many people pay for with their own super.</p>
            </section>

            <section id="preservation-age">
              <h2 style={H}>Super preservation age table</h2>
              <p>
                Your preservation age depends on your date of birth. Anyone born on or after 1 July 1964 has a preservation age of 60. The lower ages only apply to people born before then.
              </p>
              <div className="not-prose overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-sandstone text-navy"><tr><th className="px-4 py-3">Date of birth</th><th className="px-4 py-3">Preservation age</th></tr></thead>
                  <tbody className="divide-y divide-sandstone-dark/20 text-warmgray">
                    {PRESERVATION_AGE_TABLE.map((b) => (
                      <tr key={b.label}><td className="px-4 py-3">{fmtBorn(b.bornFrom, b.bornTo)}</td><td className="px-4 py-3 font-medium text-navy">{b.label}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>The ATO lists three common ways to access super because of age:</p>
              <ol>
                <li>You turn {SUPER_ACCESS_AGE_WHILE_WORKING}, even if you are still working.</li>
                <li>You reach preservation age and retire. From age 60, leaving a job counts as retirement.</li>
                <li>You reach preservation age, keep working, and start a <strong>transition to retirement</strong> income stream.</li>
              </ol>
              <p>
                If you are still building your balance, the <Link href="/superannuation-calculator/">superannuation calculator</Link> shows your employer&rsquo;s {SUPER_GUARANTEE.rate * 100}% contributions. The <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> shows what adding more from your pay costs you after tax. Since {SUPER_GUARANTEE.paydaySuperStart}, employers must pay super every payday; see <Link href="/payday-super/">Payday Super</Link>.
              </p>
            </section>

            <section id="pension-vs-preservation">
              <h2 style={H}>Pension age vs preservation age</h2>
              <div className="not-prose my-6 flex items-start gap-3 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-eucalyptus-dark" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-navy">
                  The ATO puts it directly: &ldquo;Your preservation age is not the same as your pension age.&rdquo; Preservation age is a super rule run by your fund and the ATO. Age Pension age is a social security rule run by Services Australia. They are set by different laws and apply different tests.
                </p>
              </div>
              <p>
                After 60, super withdrawals from a taxed fund are generally tax-free. Once you reach pension age, your super balance counts toward the Age Pension assets test and deeming. The <Link href="/centrelink-income-test/">Centrelink income test guide</Link> explains how. If you are over pension age and still earning, the <Link href="/sapto-calculator/">SAPTO calculator</Link> shows the seniors tax offset that can reduce the tax on your pay.
              </p>
            </section>

            <section id="faq">
              <h2 style={H}>Pension age FAQs</h2>
              <div className="sr-only">
                {PENSION_AGE_FAQS.map((f) => (<div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {PENSION_AGE_FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How the dates are calculated">
                <p>
                  Pension age comes from the Social Security Act 1991 s 23(5A) to (5D), as set out in the Department of Social Services&rsquo; Social Security Guide 3.4.1.10. Preservation ages come from the ATO&rsquo;s table (last updated 10 July 2026). Where a birthday has no matching day in the target month, such as 29 February, the date moves to the first day of the next month. That follows the Social Security Guide&rsquo;s rule. The claim date is {AGE_PENSION_CLAIM_WEEKS_EARLY} weeks (91 days) before pension age, per Services Australia. The calculator is covered by tests that include the Guide&rsquo;s worked example: someone born 31 October 1953 reached pension age on 1 May 2019.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Key ages</h2>
                  <dl className="space-y-3 text-sm">
                    {[
                      { t: "Age Pension age", d: `${AGE_PENSION_AGE} (born on or after 1 Jan 1957)` },
                      { t: "Claim from", d: `${AGE_PENSION_CLAIM_WEEKS_EARLY} weeks before pension age` },
                      { t: "Preservation age", d: "60 (born on or after 1 Jul 1964)" },
                      { t: "Super access while working", d: `${SUPER_ACCESS_AGE_WHILE_WORKING}` },
                      { t: "Compulsory retirement age", d: "None for most workers" },
                    ].map((row) => (
                      <div key={row.t} className="rounded-lg border border-sandstone-dark/20 bg-white p-3">
                        <dt className="font-medium text-navy">{row.t}</dt>
                        <dd className="text-warmgray">{row.d}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold">Working past pension age?</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">See how your wages affect your Age Pension under the income test and Work Bonus.</p>
                  <Link href="/age-pension-income-test-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Age Pension Income Test Calculator
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
