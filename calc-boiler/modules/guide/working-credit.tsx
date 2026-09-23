import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import { DEFAULT_RATE_SET_KEY, JOBSEEKER_INCOME_TEST, JOBSEEKER_RATES, RATE_SET_LABELS } from "@/lib/constants/centrelink-income-test";
import {
  WORKING_CREDIT,
  WORKING_CREDIT_PAYMENTS,
  WORKING_CREDIT_SOURCES,
  WORKING_CREDIT_VERIFIED_ON,
  depleteWorkingCredit,
  fortnightsToMaxBalance,
  projectJobseekerWithCredit,
  workingCreditAccrual,
} from "@/lib/constants/working-credit";
import WorkingCreditCalculator from "@/modules/calculator/working-credit-calculator";
import { WORKING_CREDIT_FAQS } from "./working-credit-faqs";
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

const SOURCES_LIST: SourceLink[] = [
  { title: "Working Credit (QC 29721)", url: WORKING_CREDIT_SOURCES.servicesAustralia, publisher: SOURCES.servicesAustralia.name },
  { title: "Social Security Guide 3.1.11.10 – Recipients eligible for working credit", url: WORKING_CREDIT_SOURCES.dssEligibility, publisher: "Department of Social Services" },
  { title: "Social Security Guide 3.1.11.20 – Working credit accrual", url: WORKING_CREDIT_SOURCES.dssAccrual, publisher: "Department of Social Services" },
  { title: "Social Security Guide 3.1.11.30 – Working credit depletion", url: WORKING_CREDIT_SOURCES.dssDepletion, publisher: "Department of Social Services" },
];

const T = WORKING_CREDIT.accrualThreshold;
const FREE = JOBSEEKER_INCOME_TEST.freeArea;
const RATES = JOBSEEKER_RATES[DEFAULT_RATE_SET_KEY];
const DSS_EXAMPLE = depleteWorkingCredit({ balance: 500, employmentIncome: 300 });
const JOB = projectJobseekerWithCredit(WORKING_CREDIT.maxBalance, 1_000, RATES.maxFortnightly.single, 3);

export default function WorkingCreditPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/centrelink-income-test/", label: "Centrelink Income Test" }, { label: "Working Credit Calculator" }]} />

      <PageHeader title="Centrelink Working Credit Calculator">
        <p>
          <strong>Working Credit lets you earn more from a new job before your Centrelink payment drops.</strong> You build credits in any fortnight your income is under {formatAUD(T)}, up to {WORKING_CREDIT.maxPerFortnight} a fortnight and a maximum of {WORKING_CREDIT.maxBalance.toLocaleString("en-AU")} ({WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker.toLocaleString("en-AU")} on Youth Allowance as a job seeker). When you start work, each credit cancels $1 of employment income above your income free area, so your payment isn&rsquo;t reduced until the credits run out. It&rsquo;s automatic: you don&rsquo;t apply.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Build credits when", v: `< ${formatAUD(T)}`, s: "Income per fortnight" },
          { k: "Most per fortnight", v: String(WORKING_CREDIT.maxPerFortnight), s: `${formatAUD(T)} minus your income` },
          { k: "Maximum balance", v: WORKING_CREDIT.maxBalance.toLocaleString("en-AU"), s: `${WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker.toLocaleString("en-AU")} for Youth Allowance job seekers` },
          { k: "Each credit", v: "$1", s: "Of employment income not counted" },
        ]}
      />

      <div className="mb-12"><WorkingCreditCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="who">Who Gets Working Credit</H2>
            <DataTable
              head={["Payment", "Maximum credits"]}
              align={["l", "r"]}
              rows={WORKING_CREDIT_PAYMENTS.map((p) => [p.href ? <Link key={p.name} href={p.href}>{p.name}</Link> : p.name, p.maxBalance.toLocaleString("en-AU")])}
              caption={<>Services Australia, <a href={WORKING_CREDIT_SOURCES.servicesAustralia} target="_blank" rel="noopener noreferrer">Working Credit</a>, page updated 3 July 2026, read {WORKING_CREDIT_VERIFIED_ON}.</>}
            />
            <p>You can&rsquo;t use Working Credit once you reach Age Pension age (pensioners use the Work Bonus instead: see the <Link href="/age-pension-income-test-calculator/">Age Pension income test calculator</Link>). Full-time students and apprentices on Youth Allowance, Austudy or ABSTUDY have the Income Bank instead (<Link href="/austudy-youth-allowance-calculator/">student income test</Link>), and Special Benefit isn&rsquo;t eligible.</p>
          </section>

          <section>
            <H2 id="build">How Working Credits Build Up</H2>
            <p>Each fortnight your total income is under {formatAUD(T)}, you earn {formatAUD(T)} minus that income in credits. Income here means paid work and investments, not Centrelink payments. The DSS guide works it out daily, so a change part-way through a fortnight is pro-rated.</p>
            <DataTable
              head={["Income in the fortnight", "Credits earned"]}
              align={["l", "r"]}
              rows={[0, 20, 40, 48, 100].map((i) => [formatAUD(i), String(workingCreditAccrual(i))])}
              caption={`With no income you reach ${WORKING_CREDIT.maxBalance.toLocaleString("en-AU")} credits in ${fortnightsToMaxBalance()} fortnights (${WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker.toLocaleString("en-AU")} takes ${fortnightsToMaxBalance(WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker)}).`}
            />
          </section>

          <section>
            <H2 id="use">How Credits Offset Your Income</H2>
            <p>When you have employment income, the credits used in a fortnight are the <strong>smallest</strong> of (<a href={WORKING_CREDIT_SOURCES.dssDepletion} target="_blank" rel="noopener noreferrer">DSS 3.1.11.30</a>):</p>
            <ol>
              <li>your employment income (credits can&rsquo;t offset investment income);</li>
              <li>your total income above the income free area ({formatAUD(FREE)} a fortnight for JobSeeker); and</li>
              <li>your balance.</li>
            </ol>
            <p>The DSS guide&rsquo;s own example: John has {(500).toLocaleString("en-AU")} credits and earns $300 in a fortnight on JobSeeker. He uses {DSS_EXAMPLE.depleted} credits ($300 − {formatAUD(FREE)}), so only {formatAUD(DSS_EXAMPLE.assessableIncome)} is assessed (within the free area) and {DSS_EXAMPLE.balanceAfter} credits remain.</p>
            <p>With a full {WORKING_CREDIT.maxBalance.toLocaleString("en-AU")} credits and a job paying $1,000 a fortnight, a single JobSeeker recipient ({RATE_SET_LABELS[DEFAULT_RATE_SET_KEY]} rates) gets:</p>
            <DataTable
              head={["Fortnight", "Credits used", "JobSeeker with credits", "Without credits", "Credits left"]}
              align={["l", "r", "r", "r", "r"]}
              rows={JOB.map((p) => [String(p.fortnight), String(p.depleted), formatAUD(p.paymentWithCredit, 2), formatAUD(p.paymentWithoutCredit, 2), String(p.balanceEnd)])}
              caption="Income test only, single with no children, no other income. Your payment is also subject to the assets test."
            />
            <p>If your job would otherwise stop you qualifying (for example, you&rsquo;re no longer unemployed), you&rsquo;re still treated as qualified while you use up your credits, so full-time work doesn&rsquo;t end the payment on day one. It won&rsquo;t save a payment you lose for other reasons, such as the assets test.</p>
          </section>

          <section>
            <H2 id="couples">Couples</H2>
            <p>If you and your partner both get an allowance such as JobSeeker, each of you builds and uses credits on your own income. If either of you gets a pension, credits are built and used on half your combined income (<a href={WORKING_CREDIT_SOURCES.dssAccrual} target="_blank" rel="noopener noreferrer">DSS 3.1.11.20</a>). A partner&rsquo;s income over the partner income limit still reduces your payment directly: credits don&rsquo;t offset it.</p>
          </section>

          <section>
            <H2 id="after">When Your Payment Stops</H2>
            <p>Once your income is over the cut-off and your credits are gone, the payment stops. You may keep your Health Care Card or Pensioner Concession Card, and some other benefits, for up to {WORKING_CREDIT.concessionFortnights} fortnights. If you get Family Tax Benefit, give Centrelink a family income estimate so it continues. Check what the job will pay with the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.</p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/jobseeker-payment-calculator/">JobSeeker Payment Calculator</Link>: your rate after the income test</li>
              <li><Link href="/centrelink-income-test/">Centrelink Income Test</Link>: free areas and tapers for every payment</li>
              <li><Link href="/parenting-payment-calculator/">Parenting Payment Calculator</Link></li>
              <li><Link href="/carer-payment-calculator/">Carer Payment Calculator</Link></li>
              <li><Link href="/gross-vs-net-pay/">Gross vs Net Pay</Link>: Centrelink counts your gross wages</li>
            </ul>
          </section>

          <FaqSection faqs={WORKING_CREDIT_FAQS} label="Working Credit" />

          <PageFooter
            slug="centrelink-working-credit-calculator"
            lastVerified={WORKING_CREDIT_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Accrual is {formatAUD(T)} minus fortnightly income, capped at the maximum balance. Credits used each fortnight are the smallest of employment income, income above the income free area, and the balance, as the DSS Social Security Guide sets out. JobSeeker is then worked out on the remaining income with the same income test and dated rates as our JobSeeker calculator. We calculate by fortnight; Centrelink works daily, which can differ slightly when income changes mid-fortnight.</p>
              <p>Services Australia&rsquo;s own short example deducts credits from the whole of a person&rsquo;s wages; the DSS guide (which decision-makers apply) deducts them only from income above the free area, so real balances last longer than that example suggests. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/jobseeker-payment-calculator/", label: "JobSeeker Payment Calculator" },
          { href: "/centrelink-income-test/", label: "Centrelink Income Test" },
          { href: "/parenting-payment-calculator/", label: "Parenting Payment Calculator" },
          { href: "/carer-payment-calculator/", label: "Carer Payment Calculator" },
          { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
