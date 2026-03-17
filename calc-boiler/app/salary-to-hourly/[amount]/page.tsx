import type { Metadata } from 'next';
import { SalaryToHourly } from '@/modules/programmatic/salary-to-hourly';
import { calculatePayBreakdown, formatAUD, HECS_HELP, SITE_CONFIG } from '@/lib/constants/australian-tax';
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";

interface PageProps {
  params: Promise<{
    amount: string;
  }>;
}

const SALARY_LIST = [30000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000, 200000];

export async function generateStaticParams() {
  return SALARY_LIST.map(amount => ({ amount: amount.toString() }));
}

const HOURS_PER_YEAR = 1982.84; // 38 hrs × 52.18 weeks

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.amount, 10);
  const formattedSalary = formatAUD(salaryAmount);
  const grossHourly = salaryAmount / HOURS_PER_YEAR;

  const breakdown = calculatePayBreakdown({
    grossSalary: salaryAmount,
    includeHECS: salaryAmount >= HECS_HELP.minimumThreshold
  });
  const netHourly = breakdown.takeHomePay / HOURS_PER_YEAR;

  return {
    title: `${formattedSalary} Salary to Hourly Rate — How Much Per Hour? (Australia)`,
    description: `A ${formattedSalary} salary equals ${formatAUD(grossHourly, 2)}/hour before tax and ${formatAUD(netHourly, 2)}/hour after tax in Australia, based on a 38-hour week. Full breakdown by frequency for ${SITE_CONFIG.financialYear}.`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/salary-to-hourly/${resolvedParams.amount}/`,
    },
  };
}

export default async function SalaryToHourlyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.amount, 10);
  const formattedSalary = formatAUD(salaryAmount);

  const grossHourly = salaryAmount / HOURS_PER_YEAR;

  const breakdown = calculatePayBreakdown({
    grossSalary: salaryAmount,
    includeHECS: salaryAmount >= HECS_HELP.minimumThreshold
  });
  const netHourly = breakdown.takeHomePay / HOURS_PER_YEAR;

  const BASE = SITE_CONFIG.baseUrl;
  const URL = `${BASE}/salary-to-hourly/${resolvedParams.amount}/`;

  const webAppSchema: WithContext<WebApplication> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${URL}#webpage`,
    url: URL,
    name: `${formattedSalary} Salary to Hourly Rate (Australia ${SITE_CONFIG.financialYear})`,
    description: `Convert a ${formattedSalary} annual salary to hourly rate. Gross: ${formatAUD(grossHourly, 2)}/hr, After-tax: ${formatAUD(netHourly, 2)}/hr.`,
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
      { "@type": "ListItem", position: 2, name: "Hourly to Annual Calculator", item: `${BASE}/hourly-to-annual-salary-calculator/` },
      { "@type": "ListItem", position: 3, name: `${formattedSalary} to Hourly`, item: URL }
    ]
  };

  return (
    <>
      <JsonLd code={[webAppSchema, breadcrumb, ORGANIZATION_SCHEMA]} />

      <section className="bg-sandstone/30 pt-16 pb-12 border-b border-sandstone-dark/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-warmgray">
              <li><a href="/" className="hover:text-eucalyptus transition-colors">Home</a></li>
              <li className="text-warmgray/50">/</li>
              <li><a href="/hourly-to-annual-salary-calculator/" className="hover:text-eucalyptus transition-colors">Hourly to Annual Calculator</a></li>
              <li className="text-warmgray/50">/</li>
              <li className="text-navy font-medium">{formattedSalary} to Hourly</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {formattedSalary} Salary to Hourly Rate
          </h1>
          <p className="text-xl text-warmgray max-w-2xl mx-auto mb-8">
            A {formattedSalary} annual salary equals {formatAUD(grossHourly, 2)}/hour before tax and {formatAUD(netHourly, 2)}/hour after tax, based on a 38-hour week.
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <SalaryToHourly salary={salaryAmount} />
      </div>
    </>
  );
}
