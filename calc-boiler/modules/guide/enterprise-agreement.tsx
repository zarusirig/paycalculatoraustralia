import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import { EMPLOYERS } from "@/lib/data/employer-pay";
import EaAwardFloorChecker from "@/modules/calculator/ea-award-floor-checker";
import { ENTERPRISE_AGREEMENT_FAQS } from "./enterprise-agreement-faqs";
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

// Sources, all read 23 September 2026.
const FWC_FIND = "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement";
const FWC_SEARCH = "https://www.fwc.gov.au/document-search?search-ui=agreements";
const FWC_NOMINAL_EXPIRY = "https://www.fwc.gov.au/nominal-expiry-date";
const FWC_BOOT = "https://www.fwc.gov.au/better-off-overall-test";
const FWO_ABOUT = "https://www.fairwork.gov.au/employment-conditions/agreements/about-agreements";
const FWO_FINDING = "https://www.fairwork.gov.au/employment-conditions/agreements/finding-an-agreement";
const VERIFIED = "23 September 2026";

const SOURCES_LIST: SourceLink[] = [
  { title: "Find an enterprise agreement", url: FWC_FIND, publisher: SOURCES.fwc.name },
  { title: "Document Search – agreements", url: FWC_SEARCH, publisher: SOURCES.fwc.name },
  { title: "Nominal expiry date (s 186(5))", url: FWC_NOMINAL_EXPIRY, publisher: SOURCES.fwc.name },
  { title: "Better off overall test (s 193)", url: FWC_BOOT, publisher: SOURCES.fwc.name },
  { title: "About agreements", url: FWO_ABOUT, publisher: SOURCES.fwo.name },
  { title: "Finding an agreement", url: FWO_FINDING, publisher: SOURCES.fwo.name },
];

const agreementEmployers = EMPLOYERS.filter((e) => e.instrument.kind === "enterprise-agreement");
const awardEmployers = EMPLOYERS.filter((e) => e.instrument.kind === "modern-award");
const pastExpiry = agreementEmployers.filter((e) => /passed/i.test(e.instrument.nominalExpiry ?? ""));

export default function EnterpriseAgreementPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/award-rates/", label: "Awards & Agreements" }, { label: "Enterprise Agreements" }]} />

      <PageHeader title="Enterprise Agreements (EBAs): What They Are and How to Find Yours">
        <p>
          <strong>An enterprise agreement is a set of pay rates and conditions bargained between an employer and its staff and approved by the Fair Work Commission.</strong> If one covers you, it replaces the award, but it can&rsquo;t pay a lower base rate than the award, it had to leave award-covered staff better off overall, and the National Employment Standards still apply. To find yours, search the business name from your payslip in the Commission&rsquo;s <a href={FWC_SEARCH} target="_blank" rel="noopener noreferrer">Document Search</a>. An agreement past its nominal expiry date still applies until it&rsquo;s replaced.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Approved by", v: "FWC", s: "After the better off overall test" },
          { k: "Base pay floor", v: "Award", s: "Agreement base rate can't be lower" },
          { k: "Nominal term", v: "≤ 4 years", s: "From the date of approval" },
          { k: "After expiry", v: "Still applies", s: "Until replaced or terminated" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="find">How to Find Your Enterprise Agreement: EBA Search, Step by Step</H2>
            <ol>
              <li><strong>Check whether one applies.</strong> Look at your payslip or contract for an agreement name, check the company intranet, or ask HR, payroll, a colleague or your union.</li>
              <li><strong>Open the Fair Work Commission&rsquo;s <a href={FWC_SEARCH} target="_blank" rel="noopener noreferrer">Document Search</a></strong> (from the Commission&rsquo;s <a href={FWC_FIND} target="_blank" rel="noopener noreferrer">Find an enterprise agreement</a> page). It holds every current agreement and details of past ones.</li>
              <li><strong>Search the business name in quotation marks.</strong> Use the trading name, the legal employer name or the ABN, all usually on your payslip. For example, <em>&ldquo;Coles Supermarkets&rdquo;</em>.</li>
              <li><strong>Add a location</strong> if a large employer has several agreements, for example by state, site or division.</li>
              <li><strong>Pick the most recent one.</strong> Check the approval date. Several versions often exist, and the newest approved one replaces the old.</li>
              <li><strong>Try the advanced filters</strong> to narrow the results. If you know the agreement ID (AE number) or matter number (AG number), the Commission&rsquo;s yearly agreement lists (Excel or PDF, on the <a href={FWC_FIND} target="_blank" rel="noopener noreferrer">Find an enterprise agreement</a> page) can be searched by either, and it also publishes a list of all agreements made since 1994 that are still operating.</li>
            </ol>
            <p>Can&rsquo;t find it? It may still be in approval (the Commission lists <em>agreements in progress</em>), or it may have been terminated; terminated agreements are listed but no longer published. If you work for a WA local government, you&rsquo;re in the state system, not the Fair Work Commission&rsquo;s.</p>
          </section>

          <section>
            <H2 id="reading">Reading Your Agreement: Where the Pay Terms Are</H2>
            <ul>
              <li><strong>Coverage clause</strong> near the start: confirms which employees and roles it covers.</li>
              <li><strong>Table of contents:</strong> find wages or classifications, hours, penalty rates, overtime, allowances and leave.</li>
              <li><strong>Pay tables</strong> are often in a schedule at the back, with a column for each pay rise date.</li>
              <li><strong>Search the PDF</strong> for the term you need, such as &ldquo;Sunday&rdquo;, &ldquo;<Link href="/leave-loading-calculator/">leave loading</Link>&rdquo; or &ldquo;<Link href="/time-in-lieu/">time off instead of</Link>&rdquo;.</li>
              <li><strong>Dispute resolution clause:</strong> the steps to follow if you think you&rsquo;re being paid wrongly.</li>
            </ul>
          </section>

          <section>
            <H2 id="employers">Enterprise Agreement Pay Rates at Big Employers</H2>
            <p>We&rsquo;ve read these agreements in full and turned them into pay tables. Each page cites the agreement&rsquo;s AE and AG numbers so you can check it on the Commission&rsquo;s site.</p>
            <DataTable
              head={["Employer", "Agreement", "FWC reference", "Nominal expiry"]}
              rows={agreementEmployers.map((e) => [
                <Link key={e.slug} href={`/pay-rates/${e.slug}/`}>{e.name} enterprise agreement pay rates</Link>,
                e.instrument.title,
                e.instrument.reference,
                e.instrument.nominalExpiry ?? "",
              ])}
              caption={<>Some big employers have no store-level agreement and pay under the award instead: {awardEmployers.map((e, i) => (<span key={e.slug}>{i > 0 ? ", " : ""}<Link href={`/pay-rates/${e.slug}/`}>{e.name} pay rates</Link> ({e.instrument.title})</span>))}. All employers: <Link href="/pay-rates/">pay rates by employer</Link>.</>}
            />
          </section>

          <section>
            <H2 id="award-floor">How Agreement Pay Relates to the Award</H2>
            <p>An award won&rsquo;t apply if an enterprise agreement covers you (<a href={FWO_ABOUT} target="_blank" rel="noopener noreferrer">FWO</a>). But three safety nets remain:</p>
            <ul>
              <li><strong>The award is a floor on base pay.</strong> The base rate in the agreement can&rsquo;t be less than the base rate in the award that covers you. When annual wage reviews lift award rates above an older agreement&rsquo;s rates, the employer must pay at least the award base rate.</li>
              <li><strong>The better off overall test.</strong> Before approving, the Commission must be satisfied that each award-covered employee, and each prospective one, would be better off overall under the agreement than under the award. It&rsquo;s an overall judgement, so an agreement can trade, say, lower weekend penalties for higher base rates, as long as the package is better (<a href={FWC_BOOT} target="_blank" rel="noopener noreferrer">FWC</a>).</li>
              <li><strong>The National Employment Standards</strong> still apply: annual leave, personal leave, notice, redundancy and the rest.</li>
            </ul>
          </section>

          <div className="not-prose my-10"><EaAwardFloorChecker /></div>

          <section>
            <H2 id="expired">Expired Agreements Keep Applying</H2>
            <p>
              Every agreement has a nominal expiry date, no more than 4 years after approval. It is not an end date. The agreement continues to operate until it is replaced by a new approved agreement or terminated by the Commission, and its terms are fully enforceable even years later (<a href={FWC_NOMINAL_EXPIRY} target="_blank" rel="noopener noreferrer">FWC</a>). A replacement agreement applies from 7 days after approval unless it specifies a later date.
            </p>
            {pastExpiry.length > 0 && (
              <p>
                {pastExpiry.map((e, i) => (
                  <span key={e.slug}>{i > 0 ? " " : ""}For example, the {e.instrument.title} ({e.instrument.reference}) reached its nominal expiry on {e.instrument.nominalExpiry?.replace(/\s*\(.*\)\s*$/, "")} and still sets <Link href={`/pay-rates/${e.slug}/`}>{e.name} pay rates</Link>.</span>
                ))}
              </p>
            )}
            <p>Older agreements made before 2010 (&ldquo;zombie agreements&rdquo;) are different: those still operating automatically ended on 7 December 2023 unless an extension was applied for.</p>
          </section>

          <section>
            <H2 id="types">Types of Agreement</H2>
            <ul>
              <li><strong>Single-enterprise agreements:</strong> one employer, or two or more related employers.</li>
              <li><strong>Multi-enterprise agreements:</strong> more than one employer.</li>
              <li><strong>Greenfields agreements:</strong> a single or multi-enterprise agreement for a new enterprise that has no employees yet.</li>
            </ul>
            <p>An enterprise agreement is also different from an employment contract: an agreement covers at least 2 employees, while a contract is between you and your employer and can&rsquo;t give you less than your agreement or award (<a href={FWO_ABOUT} target="_blank" rel="noopener noreferrer">FWO</a>).</p>
          </section>

          <section>
            <H2 id="payslip">Checking Your Payslip Against Your Agreement</H2>
            <p>Once you have the pay table, check your base hourly rate, then the penalty and overtime lines. Our tools use the same arithmetic an agreement does:</p>
            <ul>
              <li><Link href="/overtime-pay-calculator/">Overtime pay calculator</Link> for overtime and penalty hours</li>
              <li><Link href="/backpay-calculator/">Backpay calculator</Link> if a pay rise was paid late</li>
              <li><Link href="/take-home-pay-calculator/">Take-home pay calculator</Link> for what lands in your account</li>
              <li><Link href="/award-rates/">Award rates</Link> to compare with the award floor</li>
            </ul>
          </section>

          <FaqSection faqs={ENTERPRISE_AGREEMENT_FAQS} label="Enterprise agreement" />

          <PageFooter
            slug="enterprise-agreement"
            lastVerified={VERIFIED}
            sources={SOURCES_LIST}
            methodology={<>
              <p>The steps for finding an agreement follow the Fair Work Commission&rsquo;s and Fair Work Ombudsman&rsquo;s own guidance. Employer agreement details come from our employer pay pages, each transcribed from the approved agreement on the Commission&rsquo;s site. The award comparison uses the award base rates published on our award pages (from the first full pay period on or after 1 July 2026).</p>
              <p>General information, not legal advice. For help with your agreement, contact the Fair Work Ombudsman on 13 13 94 or your union.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/pay-rates/", label: "Pay Rates by Employer" },
          { href: "/award-rates/", label: "Award Rates" },
          { href: "/pay-rates/coles/", label: "Coles EBA Pay Rates" },
          { href: "/pay-rates/woolworths/", label: "Woolworths EBA Pay Rates" },
          { href: "/time-in-lieu/", label: "Time in Lieu" },
          { href: "/leave-loading-calculator/", label: "Leave Loading Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
