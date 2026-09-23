import type { Metadata } from 'next';
import { TakeHomePayOnSalary } from '@/modules/programmatic/take-home-pay-on-salary';
import { calculatePayBreakdown, formatAUD, EMPLOYMENT, SITE_CONFIG, SUPER_GUARANTEE } from '@/lib/constants/australian-tax';
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

  // No HECS in the headline: "$110k after tax" is asked for someone without a
  // study loan, which is what the ATO and every other AU pay site answer.
  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });
  const withHecs = calculatePayBreakdown({ grossSalary: salaryAmount, includeHECS: true });
  const shortSalary = `$${salaryAmount / 1000}k`;

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
  };
}

export default async function TakeHomePayOnSalaryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.salary, 10);
  const formattedSalary = formatAUD(salaryAmount);

  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });
  const withHecs = calculatePayBreakdown({ grossSalary: salaryAmount, includeHECS: true });

  const effectiveRate = (breakdown.effectiveTaxRate * 100).toFixed(1);
  const hourlyNet = breakdown.takeHomePay / EMPLOYMENT.hoursPerYear;

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
          text: `Based on a standard ${EMPLOYMENT.standardWeeklyHours}-hour week (${EMPLOYMENT.hoursPerYear.toLocaleString("en-AU")} hours a year), the after-tax hourly rate on ${formattedSalary} is ${formatAUD(hourlyNet, 2)}. The effective tax rate is ${effectiveRate}%.`
        }
      },
      {
        "@type": "Question",
        name: `How much is ${formattedSalary} after tax with a HECS debt?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: withHecs.hecsRepayment > 0
            ? `With a HECS-HELP debt, the compulsory repayment on ${formattedSalary} is ${formatAUD(withHecs.hecsRepayment)} a year, so take-home pay falls to ${formatAUD(withHecs.takeHomePay)} (${formatAUD(withHecs.weekly)} a week) in ${SITE_CONFIG.financialYear}.`
            : `${formattedSalary} is below the ${SITE_CONFIG.financialYear} compulsory HECS-HELP repayment threshold, so a study loan does not change take-home pay of ${formatAUD(breakdown.takeHomePay)}.`
        }
      },
      {
        "@type": "Question",
        name: `How can I increase my take-home pay on ${formattedSalary}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Salary sacrifice to superannuation is the most effective strategy. Concessional contributions up to ${formatAUD(SUPER_GUARANTEE.concessionalCap)} are taxed at 15% inside super, compared to your marginal rate. Maximising work-related deductions also reduces taxable income.`
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
