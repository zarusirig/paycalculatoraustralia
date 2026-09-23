import Link from "next/link";
import type { Metadata } from 'next';
import { TaxOnSalary } from '@/modules/programmatic/tax-on-salary';
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from '@/lib/constants/australian-tax';
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { TAX_ON_SALARIES } from "@/lib/data/salary-pages";

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

  return {
    // Leads with the answer, in GSC phrasing ("tax on 60000 australia"). Only a
    // listing showing the number competes with an AI Overview that already
    // states one. Deliberately drops "Take-Home Pay"/"After Tax" — those belong
    // to /take-home-pay-on/. FY label from SITE_CONFIG rolls over each 1 July.
    title: `Tax on ${formattedSalary} in Australia: ${formatAUD(breakdown.netIncomeTax)} Income Tax (${SITE_CONFIG.financialYear})`,
    description: `Tax on ${formattedSalary} in ${SITE_CONFIG.financialYear} is ${formatAUD(breakdown.netIncomeTax)} income tax plus ${formatAUD(breakdown.medicareLevy)} Medicare levy: ${formatAUD(totalTax)} in total (${totalRate}% of salary), leaving ${formatAUD(breakdown.takeHomePay)} take-home a year.`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/tax-on/${resolvedParams.salary}/`,
    },
    // og:url + image: without an openGraph object these pages emitted no
    // og:url. og:title/description are filled from title/description.
    openGraph: { url: `${SITE_CONFIG.baseUrl}/tax-on/${resolvedParams.salary}/`, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  };
}

export default async function TaxOnSalaryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });
  const totalTax = breakdown.netIncomeTax + breakdown.medicareLevy;
  const totalRate = ((totalTax / salaryAmount) * 100).toFixed(1);
  const marginalRate = (breakdown.marginalTaxRate * 100).toFixed(1);

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
    dateModified: new Date().toISOString().split("T")[0],
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

  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much tax do I pay on ${formattedSalary}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `On ${formattedSalary} in ${SITE_CONFIG.financialYear}, you pay ${formatAUD(breakdown.netIncomeTax)} in income tax plus ${formatAUD(breakdown.medicareLevy)} in Medicare levy, ${formatAUD(totalTax)} in total (${totalRate}% of salary). Your take-home pay is ${formatAUD(breakdown.takeHomePay)} per year or ${formatAUD(breakdown.weekly)} per week.`
        }
      },
      {
        "@type": "Question",
        name: `What is my marginal tax rate on ${formattedSalary}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Your marginal tax rate on ${formattedSalary} is ${marginalRate}%. This means each additional dollar you earn is taxed at ${marginalRate}c.`
        }
      }
    ]
  };

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
