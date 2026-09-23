import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { LITO, SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  NO_TFN_RATES,
  PAYG_TABLES_UPDATED,
  PAYG_YEAR_INFO,
  PAYG_FINANCIAL_YEAR,
  SCALE_2_TFT,
  calculatePAYGWithholding,
} from "@/lib/constants/payg-withholding";
import { TFT_WITHHOLDING_STARTS_ABOVE } from "@/lib/constants/tax-free-threshold";
import { estimateYearEnd } from "@/lib/constants/tax-rates-reference";
import TaxWithheldCalculator from "@/modules/calculator/tax-withheld-calculator";
import { EXAMPLE, TAX_WITHHELD_FAQS } from "@/modules/guide/tax-withheld-calculator-faqs";

// =============================================================================
// /tax-withheld-calculator/ — new 23 Sep 2026 (Wave 3, T1).
// Intent split: the weekly/fortnightly/monthly tax-table pages answer "what
// is the withholding amount for $X" as a lookup table; this page answers "is
// the tax coming out of my pay right, and will I get a refund?" — per-pay
// withholding for ANY frequency annualised against the actual year's tax.
// Withholding: Schedule 1/8 engine in payg-withholding.ts (reproduces the
// ATO's sample data). Tax: tax-rates-reference.ts → australian-tax.ts.
// =============================================================================

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const FY = SITE_CONFIG.financialYear;
const m = (n: number) => formatAUD(n);
const INFO = PAYG_YEAR_INFO[PAYG_FINANCIAL_YEAR];

const SOURCES_LIST: SourceLink[] = [
  { title: "Schedule 1 – Statement of formulas for calculating amounts to be withheld (NAT 1004)", url: INFO.schedule1Url, publisher: SOURCES.ato.name },
  { title: "Withholding amounts sample data", url: INFO.sampleDataUrl, publisher: SOURCES.ato.name },
  { title: "Tax rates – Australian resident", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Multiple jobs or change of job (QC50527)", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/tax-free-threshold/multiple-jobs-or-change-of-job", publisher: SOURCES.ato.name },
];

const FORTNIGHTLY = [1_000, 1_500, 2_000, 2_500, 3_000, 3_500, 4_000, 5_000, 6_000, 8_000];
const TH = "px-4 py-3 font-semibold text-navy";
const TD = "px-4 py-3";

export default function TaxWithheldCalculatorPage() {
  const authorship = getGuideAuthorship("tax-withheld-calculator");
  const band2 = SCALE_2_TFT[1];
  const example = calculatePAYGWithholding(1_000, "weekly");

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/payg-withholding-tables/" className="hover:text-eucalyptus-dark hover:underline">PAYG Withholding</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Tax Withheld Calculator</span></li>
          </ol>
        </nav>

        <header className="mb-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={FONT}>
            Tax Withheld Calculator {FY}: PAYG Withholding Estimator
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Work out how much tax your employer should withhold from each weekly, fortnightly or monthly pay, then see whether that adds up to the tax you&rsquo;ll actually owe for {FY}, and roughly what refund or bill to expect. It uses the ATO&rsquo;s own withholding formulas for payments from {PAYG_TABLES_UPDATED}, with or without the tax-free threshold and a HECS-HELP debt.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-12"><TaxWithheldCalculator /></div>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 min-w-0 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

            <section id="how-its-calculated">
              <h2 style={FONT}>How Tax Withheld Is Calculated</h2>
              <p>Employers don&rsquo;t take your salary and apply the <Link href="/tax-brackets/">tax brackets</Link>. They use the ATO&rsquo;s Schedule 1 formulas (NAT 1004), which are what the printed tax tables come from:</p>
              <ol>
                <li><strong>Convert to a weekly figure.</strong> Weekly pay: ignore cents and add 99c. Fortnightly: halve it first. Monthly: multiply by 3 and divide by 13, then ignore cents and add 99c.</li>
                <li><strong>Pick the scale.</strong> Tax-free threshold claimed, not claimed, foreign resident, or no TFN ({Math.round(NO_TFN_RATES.resident * 100)}% flat).</li>
                <li><strong>Apply the formula</strong> y = a × x − b, where a and b depend on the earnings band. For example, with the threshold claimed and weekly earnings from ${SCALE_2_TFT[0].lessThan} to under ${band2.lessThan}, a = {band2.a} and b = {band2.b}.</li>
                <li><strong>Round to the dollar</strong> and convert back to your pay period.</li>
                <li><strong>Add the study loan amount</strong> from Schedule 8 if you have a HELP or other study and training loan.</li>
              </ol>
              <p>On {m(1_000)} a week with the threshold claimed that gives <strong>{m(example.totalWithheld)}</strong>. The amounts include the 2% Medicare levy, and they build in part of the <Link href="/low-income-tax-offset/">low income tax offset</Link>: with the threshold claimed, nothing is withheld until you earn more than {m(TFT_WITHHOLDING_STARTS_ABOVE.weekly)} a week.</p>
            </section>

            <section id="withheld-vs-tax">
              <h2 style={FONT}>Tax Withheld vs the Tax You Owe</h2>
              <p>Withholding is a pre-payment. At the end of the year the ATO works out your real tax on your total taxable income and credits everything that was withheld. For someone paid the same amount every fortnight all year, with the threshold claimed, no deductions and no other income:</p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <caption className="sr-only">Annual tax withheld compared with {FY} tax, fortnightly pay</caption>
                  <thead className="bg-sandstone">
                    <tr>
                      <th className={TH}>Fortnightly pay</th>
                      <th className={`${TH} text-right`}>Withheld per fortnight</th>
                      <th className={`${TH} text-right`}>Withheld in a year</th>
                      <th className={`${TH} text-right`}>{FY} tax + Medicare</th>
                      <th className={`${TH} text-right`}>Refund (bill)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {FORTNIGHTLY.map((g) => {
                      const e = estimateYearEnd({ grossPerPeriod: g, frequency: "fortnightly", claimsTaxFreeThreshold: true, hasStudyLoan: false });
                      return (
                        <tr key={g}>
                          <td className={`${TD} font-medium text-navy tabular-nums`}>{m(g)} <span className="text-warmgray-light">({m(e.annualIncome)}/yr)</span></td>
                          <td className={`${TD} text-right tabular-nums`}>{m(e.perPeriod.totalWithheld)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{m(e.annualWithheld)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{m(e.liability)}</td>
                          <td className={`${TD} text-right tabular-nums font-semibold ${e.difference >= 0 ? "text-eucalyptus-dark" : "text-ochre"}`}>{e.difference >= 0 ? m(e.difference) : `(${m(-e.difference)})`}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p>The small differences come from rounding and from how the ATO&rsquo;s formulas approximate the annual scale, including building in only part of LITO at lower incomes. The things that turn a small difference into a large refund or bill are usually outside the formula:</p>
              <ul>
                <li><strong>Deductions</strong> reduce your taxable income but not your withholding, so they usually mean a refund. See the <Link href="/tax-deductions-guide/">tax deductions guide</Link>.</li>
                <li><strong>Two jobs.</strong> The second employer withholds at the no-threshold rate but can&rsquo;t see your total income, so the combined result can go either way. Check it with the <Link href="/second-job-tax-calculator/">second job tax calculator</Link>.</li>
                <li><strong>Claiming the threshold twice</strong> means too little is withheld and a bill at tax time. See <Link href="/tax-free-threshold/">tax-free threshold</Link>.</li>
                <li><strong>Income without withholding</strong> (interest, rent, ABN work) adds tax that nobody withheld.</li>
                <li><strong>Irregular pay</strong>: withholding on a large one-off pay is based on that pay, not your annual income. Bonuses and back pay use <Link href="/schedule-5-tax-table/">Schedule 5</Link>.</li>
              </ul>
              <p>To estimate last year&rsquo;s return rather than this year&rsquo;s withholding, use the <Link href="/tax-return-calculator/">tax return calculator</Link>.</p>
            </section>

            <section id="full-tables">
              <h2 style={FONT}>Full ATO Tax Tables</h2>
              <p>This calculator gives one pay at a time. For every amount in a table, the same Schedule 1 formulas are printed as:</p>
              <ul>
                <li><Link href="/weekly-tax-table/">Weekly tax table {PAYG_FINANCIAL_YEAR}</Link> (NAT 1005)</li>
                <li><Link href="/fortnightly-tax-table/">Fortnightly tax table {PAYG_FINANCIAL_YEAR}</Link> (NAT 1006)</li>
                <li><Link href="/monthly-tax-table/">Monthly tax table {PAYG_FINANCIAL_YEAR}</Link> (NAT 1007)</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5: bonuses, commissions and back pay</Link></li>
                <li><Link href="/payg-withholding-tables/">All PAYG withholding tables</Link></li>
              </ul>
            </section>

            <section id="faq">
              <h2 style={FONT}>Tax Withheld FAQ</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {TAX_WITHHELD_FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-xl border border-sandstone-dark/20 px-5">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose space-y-6">
              <MethodologyDisclosure>
                <p>Per-pay withholding uses the ATO&rsquo;s Schedule 1 coefficients for payments from {PAYG_TABLES_UPDATED} and Schedule 8 for study and training loans; our engine reproduces the ATO&rsquo;s published sample withholding amounts. The year-end figure multiplies one pay by the number of pays in a year (52, 26 or 12) and compares it with {FY} resident tax after the {m(LITO.maxOffset)}-maximum low income tax offset, the Medicare levy (single thresholds) and, if ticked, the compulsory study loan repayment. On {m(EXAMPLE.perPeriod.grossPerPeriod)} a fortnight the difference is {m(EXAMPLE.difference)}.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {authorship && <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-4 not-prose">
              <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-5">
                <p className="font-bold text-navy mb-3">Related</p>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: "/payg-withholding-tables/", label: "PAYG withholding tables" },
                    { href: "/take-home-pay-calculator/", label: "Take-home pay calculator" },
                    { href: "/tax-brackets/", label: `Tax brackets ${FY}` },
                    { href: "/tax-free-threshold/", label: "Tax-free threshold" },
                    { href: "/second-job-tax-calculator/", label: "Second job tax calculator" },
                    { href: "/hecs-help-calculator/", label: "HECS-HELP calculator" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center justify-between rounded-lg bg-white border border-sandstone-dark/20 px-3 py-2 text-navy hover:border-eucalyptus">
                        {l.label}<ChevronRight className="h-4 w-4 text-warmgray-light" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
