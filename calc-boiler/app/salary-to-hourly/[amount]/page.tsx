import Link from "next/link";
import type { Metadata } from 'next';
import { SalaryToHourly } from '@/modules/programmatic/salary-to-hourly';
import { calculatePayBreakdown, formatAUD, SITE_CONFIG, EMPLOYMENT } from '@/lib/constants/australian-tax';
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebApplication, WithContext } from "schema-dts";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { SALARY_TO_HOURLY_SALARIES } from "@/lib/data/salary-pages";

interface PageProps {
  params: Promise<{
    amount: string;
  }>;
}

// Grid from lib/data/salary-pages (T6): the take-home grid from $40k up plus
// the original $30,000 page. Shared with the sitemap and the hub.
export async function generateStaticParams() {
  return SALARY_TO_HOURLY_SALARIES.map(amount => ({ amount: amount.toString() }));
}

// From EMPLOYMENT, not redeclared: this was duplicated here as 1982.84 and
// drifted from the module, which is how $40.35 survived a 52-week change.
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const salaryAmount = parseInt(resolvedParams.amount, 10);
  const formattedSalary = formatAUD(salaryAmount);
  const grossHourly = salaryAmount / HOURS_PER_YEAR;

  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });
  const netHourly = breakdown.takeHomePay / HOURS_PER_YEAR;

  return {
    // Answer-first, in the GSC phrasing ("80000 a year is how much an hour",
    // "80k a year is how much an hour"). Hourly figures from the tax engine
    // and EMPLOYMENT.hoursPerYear, never hardcoded.
    title: `${formattedSalary} a Year Is How Much an Hour? ${formatAUD(grossHourly, 2)} in Australia`,
    description: `$${(salaryAmount / 1000).toLocaleString("en-AU")}k a year is ${formatAUD(grossHourly, 2)} an hour before tax on a ${EMPLOYMENT.standardWeeklyHours}-hour week (${HOURS_PER_YEAR.toLocaleString("en-AU")} hours a year), or ${formatAUD(netHourly, 2)} an hour after tax in ${SITE_CONFIG.financialYear}. Weekly, fortnightly and monthly pay too.`,
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

  const breakdown = calculatePayBreakdown({ grossSalary: salaryAmount });
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
      { "@type": "ListItem", position: 2, name: "Salary to Hourly", item: `${BASE}/salary-to-hourly/` },
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
              <li><Link href="/" className="hover:text-eucalyptus transition-colors">Home</Link></li>
              <li className="text-warmgray/50">/</li>
              <li><Link href="/salary-to-hourly/" className="hover:text-eucalyptus transition-colors">Salary to Hourly</Link></li>
              <li className="text-warmgray/50">/</li>
              <li className="text-navy font-medium">{formattedSalary} to Hourly</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {formattedSalary} a Year Is How Much an Hour?
          </h1>
          <p className="text-xl text-warmgray max-w-2xl mx-auto mb-8">
            <strong className="text-navy">{formatAUD(grossHourly, 2)} an hour</strong> before tax and {formatAUD(netHourly, 2)} an hour after tax ({SITE_CONFIG.financialYear}), based on a {EMPLOYMENT.standardWeeklyHours}-hour week and {HOURS_PER_YEAR.toLocaleString("en-AU")} hours a year.
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <SalaryToHourly salary={salaryAmount} />
      </div>
    </>
  );
}
