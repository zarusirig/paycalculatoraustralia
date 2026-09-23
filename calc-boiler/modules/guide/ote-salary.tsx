import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { HIGH_INCOME_THRESHOLD, OTE_SOURCES as SRC, OTE_VERIFIED_ON, oteBreakdown } from "@/lib/constants/ote-salary";
import OteSalaryCalculator from "@/modules/calculator/ote-salary-calculator";
import { OTE_SALARY_FAQS } from "./ote-salary-faqs";
import {
  ARTICLE_CLASS,
  Breadcrumbs,
  DataTable,
  FaqSection,
  H2,
  KeyFigures,
  PAGE_INNER,
  PAGE_WRAP,
  PageFooter,
  PageHeader,
  RelatedSidebar,
} from "./t3-shared";

// /ote-salary/ (G3, wave 4). Sources: lib/constants/ote-salary.ts.

const SOURCES_LIST: SourceLink[] = [
  { title: "List of payments that are ordinary time earnings", url: SRC.atoOte, publisher: SOURCES.ato.name },
  { title: "High income threshold", url: SRC.fwcHighIncome, publisher: SOURCES.fwc.name },
  { title: "Piece rates and commission payments", url: SRC.fwoCommission, publisher: SOURCES.fwo.name },
];

const EXAMPLE = { base: 80_000, target: 40_000 };
const ATTAINMENTS = [0, 50, 80, 100, 120, 150] as const;
const rows = ATTAINMENTS.map((a) => {
  const r = oteBreakdown({ base: EXAMPLE.base, targetVariable: EXAMPLE.target, attainmentPct: a });
  return { a, r, net: calculatePayBreakdown({ grossSalary: r.totalEarned }).takeHomePay };
});
const SPLITS = [[90_000, 30_000], [80_000, 40_000], [60_000, 60_000]] as const;

export default function OteSalaryPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/commission-tax-calculator/", label: "Commission" }, { label: "OTE Salary" }]} />

      <PageHeader title="OTE Salary Meaning: On-Target Earnings Explained, with Calculator">
        <p>
          <strong>OTE stands for on-target earnings: your base salary plus the commission or bonus you would earn at exactly 100% of your target.</strong> A sales job at $120,000 OTE with an $80,000 base guarantees $80,000; the other $40,000 depends on results. Commission is ordinary time earnings, so 12% super is paid on it too. But for the Fair Work high income threshold, only the base counts.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "OTE", v: "Base + target", s: "Commission or bonus at 100% of target" },
          { k: "Guaranteed", v: "Base only", s: "Variable pay rises or falls with results" },
          { k: "Super on commission", v: "Yes, 12%", s: "ATO: commission is ordinary time earnings" },
          { k: "High income threshold", v: formatAUD(HIGH_INCOME_THRESHOLD.current), s: "Commission doesn't count toward it" },
        ]}
      />

      <div className="mb-12"><OteSalaryCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="meaning">What OTE Means in a Job Offer</H2>
            <p>
              On-target earnings is how sales, account management and recruitment roles quote pay: one number that assumes you hit your target. It is a contract term, not a legal one, so read the offer for three things: the <strong>base</strong> (guaranteed), the <strong>target</strong> the variable pay is measured against, and whether commission is <strong>capped</strong>. An uncapped plan pays more than OTE when you beat target; a capped one stops at a set amount.
            </p>
            <DataTable
              head={["Offer", "Base", "Variable at target", "Split"]}
              align={["l", "r", "r", "r"]}
              rows={SPLITS.map(([b, v]) => {
                const r = oteBreakdown({ base: b, targetVariable: v, attainmentPct: 100 });
                return [`${formatAUD(r.ote)} OTE`, formatAUD(b), formatAUD(v), `${Math.round(r.basePct)}:${Math.round(100 - r.basePct)}`];
              })}
              caption={<>Split = base ÷ OTE. The same OTE can carry very different risk.</>}
            />
          </section>

          <section>
            <H2 id="missed-target">What You Earn Above and Below Target</H2>
            <p>With an {formatAUD(EXAMPLE.base)} base and {formatAUD(EXAMPLE.target)} at target (a {formatAUD(EXAMPLE.base + EXAMPLE.target)} OTE), assuming commission scales in a straight line with results:</p>
            <DataTable
              head={["Target hit", "Earned before tax", "Super (12%)", "Take-home a year"]}
              align={["l", "r", "r", "r"]}
              rows={rows.map(({ a, r, net }) => [`${a}%`, formatAUD(r.totalEarned), formatAUD(r.superGuarantee), formatAUD(net)])}
              caption={<>2026-27 resident tax, Medicare levy and LITO; no HECS. Your plan may pay differently (for example, higher rates above target or nothing below a threshold), so check your commission schedule. See the <Link href="/commission-tax-calculator/">commission tax calculator</Link> for tax on a single payment.</>}
            />
          </section>

          <section>
            <H2 id="two-otes">OTE in Super: Ordinary Time Earnings</H2>
            <p>
              On your payslip and in super law, OTE means something else: <strong>ordinary time earnings</strong>, the pay for your ordinary hours of work. The ATO lists &ldquo;commission payments&rdquo; as ordinary time earnings, so your employer must pay the 12% super guarantee on commission as well as base salary. Commission solely for work done entirely outside ordinary hours was the exception; from 1 July 2026 super is worked out on qualifying earnings, which include that commission too. Check that super appears on each commission payment, and use the <Link href="/superannuation-calculator/">super calculator</Link> to check the year&rsquo;s total.
            </p>
          </section>

          <section>
            <H2 id="high-income-threshold">OTE and the High Income Threshold</H2>
            <p>
              If no award or enterprise agreement covers you, you can only make an unfair dismissal claim if your earnings are below the high income threshold, <strong>{formatAUD(HIGH_INCOME_THRESHOLD.current)}</strong> from {HIGH_INCOME_THRESHOLD.from} ({formatAUD(HIGH_INCOME_THRESHOLD.previous)} before). The Fair Work Commission excludes payments that can&rsquo;t be determined in advance, such as commissions, incentive payments and bonuses. So a {formatAUD(250_000)} OTE on a {formatAUD(150_000)} base is assessed at {formatAUD(150_000)}. Guaranteed amounts, salary sacrifice and the agreed value of non-monetary benefits (such as private use of a car) can count.
            </p>
          </section>

          <section>
            <H2 id="minimum">Commission and the Minimum Wage</H2>
            <p>
              Commission can be an incentive on top of your pay or, where your award or enterprise agreement allows it, your whole wage. If no award or agreement covers you, the Fair Work Ombudsman says you can be paid commission but must still get at least the <Link href="/minimum-wage-australia/">National Minimum Wage</Link>. If you are covered by an award, check its commission clause on our <Link href="/award-rates/">award rates</Link> pages.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/commission-tax-calculator/">Commission Tax Calculator</Link>: tax withheld on a commission payment</li>
              <li><Link href="/bonus-tax-calculator/">Bonus Tax Calculator</Link>: the same for bonuses</li>
              <li><Link href="/salary-package-calculator/">Salary Package Calculator</Link>: base, super and benefits together</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>: any salary after tax</li>
            </ul>
          </section>

          <FaqSection faqs={OTE_SALARY_FAQS} label="OTE salary" />

          <PageFooter
            slug="ote-salary"
            lastVerified={OTE_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>OTE = base + variable pay at 100% of target. Earned = base + target × attainment, assuming a straight-line plan. Super = 12% of earned pay up to the maximum contribution base, because commission is ordinary time earnings (ATO). Take-home uses this site&rsquo;s 2026-27 resident tax engine. The high income threshold figure and what counts toward it are from the Fair Work Commission, read {OTE_VERIFIED_ON}.</p>
              <p>On-target earnings has no statutory definition; this page describes the arithmetic, not any employer&rsquo;s plan. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/commission-tax-calculator/", label: "Commission Tax Calculator" },
          { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator" },
          { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
          { href: "/salary-package-calculator/", label: "Salary Package Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
