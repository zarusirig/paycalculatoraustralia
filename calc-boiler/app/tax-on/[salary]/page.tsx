import type { Metadata } from 'next';
import { TaxOnSalary } from '@/modules/programmatic/tax-on-salary';
import { calculatePayBreakdown, formatAUD, HECS_HELP, SITE_CONFIG } from '@/lib/constants/australian-tax';
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";

interface PageProps {
  params: Promise<{
    salary: string;
  }>;
}

export async function generateStaticParams() {
  const salaries = [];
  for (let salary = 30000; salary <= 200000; salary += 5000) {
    salaries.push({ salary: salary.toString() });
  }
  return salaries;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  const breakdown = calculatePayBreakdown({
    grossSalary: salaryAmount,
    includeHECS: salaryAmount >= HECS_HELP.minimumThreshold
  });

  const effectiveRate = (breakdown.effectiveTaxRate * 100).toFixed(1);

  return {
    // Leads with the answer, not the tool. Against an AI Overview that has
    // already stated a number, only a listing showing the number competes.
    // Deliberately drops "Take-Home Pay" — that phrase belongs to
    // /take-home-pay-on/, and carrying it here made the two families compete.
    title: `Tax on ${formattedSalary} in Australia — ${formatAUD(breakdown.netIncomeTax)} Income Tax (${effectiveRate}%)`,
    description: `On a ${formattedSalary} salary, you pay ${formatAUD(breakdown.netIncomeTax)} in income tax (${effectiveRate}% effective rate). Your take-home pay is ${formatAUD(breakdown.takeHomePay)}/year or ${formatAUD(breakdown.weekly)}/week. Full ${SITE_CONFIG.financialYear} breakdown.`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/tax-on/${resolvedParams.salary}/`,
    },
  };
}

export default async function TaxOnSalaryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  const breakdown = calculatePayBreakdown({
    grossSalary: salaryAmount,
    includeHECS: salaryAmount >= HECS_HELP.minimumThreshold
  });

  const effectiveRate = (breakdown.effectiveTaxRate * 100).toFixed(1);
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
      { "@type": "ListItem", position: 2, name: `Tax on ${formattedSalary}`, item: URL }
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
          text: `On ${formattedSalary}, you pay ${formatAUD(breakdown.netIncomeTax)} in income tax (${effectiveRate}% effective rate) plus ${formatAUD(breakdown.medicareLevy)} in Medicare levy. Your take-home pay is ${formatAUD(breakdown.takeHomePay)} per year or ${formatAUD(breakdown.weekly)} per week.`
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Tax on {formattedSalary} in Australia
          </h1>
          <p className="text-xl text-warmgray max-w-2xl mx-auto mb-8">
            Complete pay breakdown, income tax, Medicare levy, and take-home pay for a {formattedSalary} salary in {SITE_CONFIG.financialYear}.
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <TaxOnSalary salary={salaryAmount} />
      </div>
    </>
  );
}
