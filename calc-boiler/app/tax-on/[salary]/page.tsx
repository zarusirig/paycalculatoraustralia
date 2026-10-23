import Link from "next/link";
import type { Metadata } from 'next';
import { TaxOnSalary } from '@/modules/programmatic/tax-on-salary';
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from '@/lib/constants/australian-tax';
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { taxOnSalaryFaqs } from "@/modules/programmatic/tax-on-salary-faqs";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { TAX_ON_SALARIES, salaryFacts } from "@/lib/data/salary-pages";
import { pageDateModified } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";
import { fitDescription, fitTitle } from "@/lib/seo-title";
import { withFeaturedImage } from "@/lib/featured-image";

interface PageProps {
  params: Promise<{
    salary: string;
  }>;
}

// Grid from lib/data/salary-pages (T6), shared with the sitemap and hub.
export async function generateStaticParams() {
  return TAX_ON_SALARIES.map((salary) => ({ salary: salary.toString() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  // No HECS in these figures: "tax on $60,000" is asked for someone without a
  // study loan. The loan case is covered in the page body.
  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });
  const totalTax = breakdown.netIncomeTax + breakdown.medicareLevy;
  const totalRate = ((totalTax / salaryAmount) * 100).toFixed(1);

  // Top bracket reached (15/30/37/45), from the same facts the page's bracket
  // table and "sits $X into the 30% bracket" sentence use.
  const bracketPct = Math.round(salaryFacts(salaryAmount).bracketRate * 100);
  const fy = SITE_CONFIG.financialYear;

  return withFeaturedImage({
    // Meta intent pass 23 Oct 2026: "Tax on $X in Australia" first, the exact
    // H1 and GSC phrasing ("tax on 60000 australia"); Google was already
    // rewriting the question form to the H1 in the SERP. The bracket is the
    // per-salary differentiator ("tax bracket" queries) and keeps the page on
    // tax-owed intent: no take-home figure here, "X after tax" belongs to
    // /take-home-pay-on/ (44% of this route's query impressions were
    // after-tax queries that page should win). FY label rolls over each 1 July.
    // Previous (25 Sep): "How Much Tax on $100,000 in Australia? $22,520 in 2026-27"
    title: fitTitle(
      ...(bracketPct > 0
        ? [
            `Tax on ${formattedSalary} in Australia ${fy}: ${formatAUD(totalTax)} (${bracketPct}% Tax Bracket)`,
            `Tax on ${formattedSalary} in Australia ${fy}: ${formatAUD(totalTax)} (${bracketPct}% Bracket)`,
          ]
        : []),
      `Tax on ${formattedSalary} in Australia ${fy}: ${formatAUD(totalTax)}`,
    ),
    // Answer first (total, then its two parts, average rate, bracket); the
    // take-home figure stays off this page's snippet (see title note).
    description:
      totalTax === 0
        ? `Tax on ${formattedSalary} in ${fy} is $0: no income tax or Medicare levy is payable at this income, so you keep the full ${formattedSalary}. See the tax in each bracket.`
        : fitDescription(
            `Tax on ${formattedSalary} in ${fy} is ${formatAUD(totalTax)}: ${formatAUD(breakdown.netIncomeTax)} income tax plus ${formatAUD(breakdown.medicareLevy)} Medicare levy, ${totalRate}% of salary, in the ${bracketPct}% tax bracket. See the tax in each bracket.`,
            `Tax on ${formattedSalary} in ${fy} is ${formatAUD(totalTax)}: ${formatAUD(breakdown.netIncomeTax)} income tax plus ${formatAUD(breakdown.medicareLevy)} Medicare levy, ${totalRate}% of salary, in the ${bracketPct}% tax bracket.`,
          ),
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/tax-on/${resolvedParams.salary}/`,
    },
    // og:url + image: without an openGraph object these pages emitted no
    // og:url. og:title/description are filled from title/description.
    openGraph: { url: `${SITE_CONFIG.baseUrl}/tax-on/${resolvedParams.salary}/`, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  });
}

async function TaxOnSalaryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });
  const totalTax = breakdown.netIncomeTax + breakdown.medicareLevy;
  const totalRate = ((totalTax / salaryAmount) * 100).toFixed(1);

  const BASE = SITE_CONFIG.baseUrl;
  const URL = `${BASE}/tax-on/${resolvedParams.salary}/`;

  const webAppSchema: WithContext<WebApplication> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${URL}#webpage`,
    url: URL,
    name: `Tax on ${formattedSalary} in Australia (${SITE_CONFIG.financialYear})`,
    description: `Detailed tax breakdown for a ${formattedSalary} salary in Australia including take-home pay, income tax, and Medicare levy.`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    creator: { "@type": "Organization", name: SITE_CONFIG.name },
    dateModified: pageDateModified(`tax-on/${resolvedParams.salary}`),
    inLanguage: "en-AU",
  };

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Tax on Salary", item: `${BASE}/tax-on/` },
      { "@type": "ListItem", position: 3, name: `Tax on ${formattedSalary}`, item: URL }
    ]
  };

  const faq = faqPageSchema(taxOnSalaryFaqs(salaryAmount));

  return (
    <>
      <JsonLd code={[webAppSchema, breadcrumb, faq, ORGANIZATION_SCHEMA]} />

      <section className="bg-sandstone/30 pt-16 pb-12 border-b border-sandstone-dark/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus transition-colors">Home</Link></li>
              <li className="text-warmgray/50">/</li>
              <li><Link href="/tax-on/" className="hover:text-eucalyptus transition-colors">Tax on Salary</Link></li>
              <li className="text-warmgray/50">/</li>
              <li className="text-navy font-medium">Tax on {formattedSalary}</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Tax on {formattedSalary} in Australia
          </h1>
          <p className="text-xl text-warmgray max-w-2xl mx-auto mb-8">
            <strong className="text-navy">{formatAUD(breakdown.netIncomeTax)} income tax</strong> plus {formatAUD(breakdown.medicareLevy)} Medicare levy on a {formattedSalary} salary in {SITE_CONFIG.financialYear}: {formatAUD(totalTax)} in total ({totalRate}% of salary), leaving {formatAUD(breakdown.takeHomePay)} take-home.
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <TaxOnSalary salary={salaryAmount} />
      </div>
    </>
  );
}

export default withPageEnd(TaxOnSalaryPage, "/tax-on/[salary]/");
