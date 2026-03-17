import type { Metadata } from 'next';
import { TakeHomePayOnSalary } from '@/modules/programmatic/take-home-pay-on-salary';
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

  return {
    title: `Take-Home Pay on ${formattedSalary} — Net Pay After Tax & Super (${SITE_CONFIG.financialYear})`,
    description: `On a ${formattedSalary} salary in Australia, your take-home pay is ${formatAUD(breakdown.takeHomePay)}/year or ${formatAUD(breakdown.weekly)}/week after ${formatAUD(breakdown.netIncomeTax)} income tax and ${formatAUD(breakdown.medicareLevy)} Medicare levy. Full ${SITE_CONFIG.financialYear} breakdown.`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/take-home-pay-on/${resolvedParams.salary}/`,
    },
  };
}

export default async function TakeHomePayOnSalaryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  const breakdown = calculatePayBreakdown({
    grossSalary: salaryAmount,
    includeHECS: salaryAmount >= HECS_HELP.minimumThreshold
  });

  const effectiveRate = (breakdown.effectiveTaxRate * 100).toFixed(1);
  const hoursPerYear = 1982.84;
  const hourlyNet = breakdown.takeHomePay / hoursPerYear;

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
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-AU",
  };

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Take-Home Pay Calculator", item: `${BASE}/take-home-pay-calculator/` },
      { "@type": "ListItem", position: 3, name: `Take-Home Pay on ${formattedSalary}`, item: URL }
    ]
  };

  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the take-home pay on ${formattedSalary} in Australia?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `On a ${formattedSalary} salary, your take-home pay is ${formatAUD(breakdown.takeHomePay)} per year after income tax of ${formatAUD(breakdown.netIncomeTax)} and Medicare levy of ${formatAUD(breakdown.medicareLevy)}. That equals ${formatAUD(breakdown.weekly)} per week or ${formatAUD(breakdown.monthly)} per month.`
        }
      },
      {
        "@type": "Question",
        name: `How much is ${formattedSalary} per week after tax?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A ${formattedSalary} annual salary equals ${formatAUD(breakdown.weekly)} per week after tax, ${formatAUD(breakdown.fortnightly)} per fortnight, and ${formatAUD(breakdown.monthly)} per month.`
        }
      },
      {
        "@type": "Question",
        name: `What is the effective hourly rate on ${formattedSalary}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on a standard 38-hour week (1,982.84 hours/year), the after-tax hourly rate on ${formattedSalary} is ${formatAUD(hourlyNet, 2)}. The effective tax rate is ${effectiveRate}%.`
        }
      },
      {
        "@type": "Question",
        name: `How can I increase my take-home pay on ${formattedSalary}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Salary sacrifice to superannuation is the most effective strategy. Concessional contributions up to $30,000 are taxed at 15% inside super, compared to your marginal rate. Maximising work-related deductions also reduces taxable income.`
        }
      }
    ]
  };

  return (
    <>
      <JsonLd code={[webAppSchema, breadcrumb, faq, ORGANIZATION_SCHEMA]} />

      <section className="bg-sandstone/30 pt-16 pb-12 border-b border-sandstone-dark/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-warmgray">
              <li><a href="/" className="hover:text-eucalyptus transition-colors">Home</a></li>
              <li className="text-warmgray/50">/</li>
              <li><a href="/take-home-pay-calculator/" className="hover:text-eucalyptus transition-colors">Take-Home Pay Calculator</a></li>
              <li className="text-warmgray/50">/</li>
              <li className="text-navy font-medium">Take-Home Pay on {formattedSalary}</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Take-Home Pay on {formattedSalary}
          </h1>
          <p className="text-xl text-warmgray max-w-2xl mx-auto mb-8">
            Net pay after income tax, Medicare levy, and superannuation on a {formattedSalary} salary in {SITE_CONFIG.financialYear}.
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <TakeHomePayOnSalary salary={salaryAmount} />
      </div>
    </>
  );
}
