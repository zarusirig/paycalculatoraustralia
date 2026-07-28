"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { HECS_HELP, HECS_HELP_2025_26, SITE_CONFIG, SOURCES, calculateHECS, formatAUD } from "@/lib/constants";
import { HECS_THRESHOLD_FAQS } from "@/modules/guide/hecs-repayment-threshold-faqs";

// Deliberately narrow page. It exists to own "hecs repayment threshold" and
// "hecs threshold" — the SERP winners for those terms run 300-500 words and are
// mostly table. Calculator intent belongs to /hecs-help-calculator/; how the
// loan actually works belongs to /hecs-help-guide/. Do not grow this page.

const ATO_THRESHOLDS_URL =
  "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds";

const SOURCES_LIST: SourceLink[] = [
  { title: "Study and training loan repayment thresholds and rates (QC16176)", url: ATO_THRESHOLDS_URL, publisher: SOURCES.ato.name },
  {
    title: "Study and training loan indexation rates (QC18714)",
    url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates",
    publisher: SOURCES.ato.name,
  },
];

// Every figure below is derived from HECS_HELP so the page, the FAQ copy and
// the JSON-LD cannot disagree with the engine that runs the calculator.
const T = HECS_HELP.minimumThreshold;
const [, B1, B2, B3] = HECS_HELP.bands;

const BAND_ROWS = [
  { range: `${formatAUD(0)} – ${formatAUD(T)}`, repayment: "Nil" },
  { range: `${formatAUD(B1.min)} – ${formatAUD(B1.max)}`, repayment: `15c for each $1 over ${formatAUD(T)}` },
  { range: `${formatAUD(B2.min)} – ${formatAUD(B2.max)}`, repayment: `${formatAUD(B2.base)} plus 17c for each $1 over ${formatAUD(B2.min - 1)}` },
  { range: `${formatAUD(B3.min)} and over`, repayment: `${B3.marginalRate * 100}% of your total repayment income` },
];

const EXAMPLE_INCOMES = [75_000, 85_000, 100_000, 130_000, 190_000];

export default function HecsRepaymentThresholdPage() {
  const authorship = getGuideAuthorship("hecs-repayment-threshold");

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">HECS Repayment Threshold</span></li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            HECS Repayment Threshold {SITE_CONFIG.financialYear}: {formatAUD(T)}
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-5">
            Compulsory repayments start once your repayment income passes <strong>{formatAUD(T)}</strong> in {SITE_CONFIG.financialYear}. Below that you repay nothing. Above it you repay only on the income above the threshold, not on your whole salary.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{SITE_CONFIG.financialYear} Thresholds and Rates</h2>
            <div className="not-prose my-5">
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-navy">
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-5 py-3">Repayment income</th>
                      <th scope="col" className="px-5 py-3">Repayment on this income</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {BAND_ROWS.map((row, i) => (
                      <tr key={row.range} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className="px-5 py-3 font-medium tabular-nums">{row.range}</td>
                        <td className="px-5 py-3">{row.repayment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-warmgray-light">
                ATO, <a href={ATO_THRESHOLDS_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">Study and training loan repayment thresholds and rates</a>.
              </p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Threshold Applies to Repayment Income, Not Salary</h2>
            <p>Repayment income is wider than your pay. The ATO adds together:</p>
            <ul>
              <li>taxable income</li>
              <li>reportable fringe benefits</li>
              <li>total net investment loss</li>
              <li>reportable super contributions</li>
              <li>exempt foreign employment income</li>
            </ul>
            <p>
              That is why <Link href="/extra-super-vs-hecs-repayment/">salary sacrificing into super</Link> does not drop you under the threshold — the contributions are added back.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Repayment at Common Incomes</h2>
            <div className="not-prose my-5">
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-navy">
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-5 py-3">Repayment income</th>
                      <th scope="col" className="px-5 py-3 text-right">Compulsory repayment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {EXAMPLE_INCOMES.map((income, i) => (
                      <tr key={income} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className="px-5 py-3 font-medium tabular-nums">{formatAUD(income)}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{formatAUD(calculateHECS(income))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-warmgray-light">
                Work out your own figure with the <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS repayment calculator</Link>.
              </p>
            </div>
            <p>
              The threshold is indexed annually — it was {formatAUD(HECS_HELP_2025_26.minimumThreshold)} in {SITE_CONFIG.previousFinancialYear} — and the rates have applied marginally since 1 July 2025.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>One Threshold Covers Every Study Loan</h2>
            <p>
              HELP (including HECS-HELP and FEE-HELP), VSL, SFSS, SSL, ABSTUDY SSL and AASL all share this threshold. The <Link href="/hecs-help-calculator/">HECS repayment calculator</Link> lists every scheme and the order they are repaid. See also <Link href="/stsl-on-payslip/">STSL on your payslip</Link> and the <Link href="/hecs-help-guide/">HECS-HELP guide</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <div className="sr-only">
              <h3>HECS repayment threshold questions and answers</h3>
              {HECS_THRESHOLD_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="not-prose mt-5 space-y-3">
              {HECS_THRESHOLD_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-10 not-prose space-y-6">
            <MethodologyDisclosure title="How we verified these figures">
              <p>
                Thresholds, rates and the definition of repayment income come from the ATO&rsquo;s <a href={ATO_THRESHOLDS_URL} target="_blank" rel="noopener noreferrer">Study and training loan repayment thresholds and rates</a> (QC16176). Every figure on this page is read from one constants file that also drives our calculator, and it reconciles to the ATO&rsquo;s own worked example: repayment income of {formatAUD(137_064)} gives {formatAUD(B2.base)} + {formatAUD(1_248.99, 2)} = {formatAUD(10_276.99, 2)}.
              </p>
            </MethodologyDisclosure>
            <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
            {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
          </div>

        </article>
      </div>
    </div>
  );
}
