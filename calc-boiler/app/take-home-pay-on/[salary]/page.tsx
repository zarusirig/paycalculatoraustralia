import Link from "next/link";
import type { Metadata } from 'next';
import { TakeHomePayOnSalary } from '@/modules/programmatic/take-home-pay-on-salary';
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from '@/lib/constants/australian-tax';
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { takeHomePayOnSalaryFaqs } from "@/modules/programmatic/take-home-pay-on-salary-faqs";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { TAKE_HOME_SALARIES } from "@/lib/data/salary-pages";
import { pageDateModified } from "@/lib/page-dates";

interface PageProps {
  params: Promise<{
    salary: string;
  }>;
}

// The grid lives in lib/data/salary-pages (T6: $1k steps $40k-$150k plus the
// high-salary tail) so the sitemap, hub and prev/next links cannot drift.
export async function generateStaticParams() {
  return TAKE_HOME_SALARIES.map((salary) => ({ salary: salary.toString() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  // No HECS in the headline: "$110k after tax" is asked for someone without a
  // study loan, which is what the ATO and every other AU pay site answer.
  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });
  const withHecs = calculatePayBreakdown({ grossSalary: salaryAmount, includeHECS: true });
  const shortSalary = `$${(salaryAmount / 1000).toLocaleString("en-AU")}k`;

  return {
    // Answer-first, in the phrasing GSC shows ("110k after tax australia",
    // "100 000 after tax australia"). Owns net-pay intent; /tax-on/ owns
    // tax-owed intent, so neither title carries the other's head phrase.
    // FY label comes from SITE_CONFIG so the title rolls over each 1 July.
    title: `${formattedSalary} After Tax in Australia = ${formatAUD(breakdown.takeHomePay)} (${SITE_CONFIG.financialYear})`,
    description: `${shortSalary} after tax is ${formatAUD(breakdown.takeHomePay)} a year in Australia for ${SITE_CONFIG.financialYear}: ${formatAUD(breakdown.fortnightly)} a fortnight or ${formatAUD(breakdown.weekly)} a week, after ${formatAUD(breakdown.netIncomeTax)} tax and ${formatAUD(breakdown.medicareLevy)} Medicare.${withHecs.hecsRepayment > 0 ? ` With HECS: ${formatAUD(withHecs.takeHomePay)}.` : ""}`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/take-home-pay-on/${resolvedParams.salary}/`,
    },
    // og:url + image: without an openGraph object these pages emitted no
    // og:url. og:title/description are filled from title/description.
    openGraph: { url: `${SITE_CONFIG.baseUrl}/take-home-pay-on/${resolvedParams.salary}/`, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  };
}

export default async function TakeHomePayOnSalaryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });


  const BASE = SITE_CONFIG.baseUrl;
  const URL = `${BASE}/take-home-pay-on/${resolvedParams.salary}/`;

  const webAppSchema: WithContext<WebApplication> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${URL}#webpage`,
    url: URL,
    name: `Take-Home Pay on ${formattedSalary} in Australia (${SITE_CONFIG.financialYear})`,
    description: `Net pay breakdown for a ${formattedSalary} salary in Australia including income tax, Medicare levy, superannuation, and take-home pay by frequency.`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    creator: { "@type": "Organization", name: SITE_CONFIG.name },
    dateModified: pageDateModified(`take-home-pay-on/${resolvedParams.salary}`),
    inLanguage: "en-AU",
  };

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Take-Home Pay by Salary", item: `${BASE}/take-home-pay-on/` },
      { "@type": "ListItem", position: 3, name: `Take-Home Pay on ${formattedSalary}`, item: URL }
    ]
  };

  const faq = faqPageSchema(takeHomePayOnSalaryFaqs(salaryAmount));

  return (
    <>
      <JsonLd code={[webAppSchema, breadcrumb, faq, ORGANIZATION_SCHEMA]} />

      <section className="bg-sandstone/30 pt-16 pb-12 border-b border-sandstone-dark/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus transition-colors">Home</Link></li>
              <li className="text-warmgray/50">/</li>
              <li><Link href="/take-home-pay-on/" className="hover:text-eucalyptus transition-colors">Take-Home Pay by Salary</Link></li>
              <li className="text-warmgray/50">/</li>
              <li className="text-navy font-medium">Take-Home Pay on {formattedSalary}</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {formattedSalary} After Tax in Australia
          </h1>
          <p className="text-xl text-warmgray max-w-2xl mx-auto mb-8">
            <strong className="text-navy">{formatAUD(breakdown.takeHomePay)} a year</strong> take-home on a {formattedSalary} salary in {SITE_CONFIG.financialYear}: {formatAUD(breakdown.fortnightly)} a fortnight or {formatAUD(breakdown.weekly)} a week, after income tax and the Medicare levy.
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <TakeHomePayOnSalary salary={salaryAmount} />
      </div>
    </>
  );
}
