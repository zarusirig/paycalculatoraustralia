import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";

export default function NotFound() {
  const topCalculators = [
    { href: "/", label: "Pay Calculator", description: "Full take-home pay breakdown" },
    { href: "/income-tax-calculator/", label: "Income Tax Calculator", description: "Tax by bracket" },
    { href: "/superannuation-calculator/", label: "Super Calculator", description: "Employer SG at 12%" },
    { href: "/take-home-pay-calculator/", label: "Take-Home Pay", description: "Net pay after all deductions" },
    { href: "/tax-brackets/", label: "Tax Brackets 2025-26", description: "Current rates and thresholds" },
  ];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-eucalyptus-light/40 text-eucalyptus">
        <Calculator className="h-10 w-10" />
      </div>

      <h1 className="mb-2 text-6xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>404</h1>
      <h2 className="mb-4 text-xl font-semibold text-warmgray" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        This page doesn&apos;t exist
      </h2>
      <p className="mb-8 max-w-md text-warmgray-light">
        But we can still calculate your pay. Try one of our popular calculators below.
      </p>

      <div className="mb-8 grid w-full max-w-lg gap-3">
        {topCalculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="flex items-center justify-between rounded-xl border border-sandstone-dark/20 bg-white px-5 py-4 text-left shadow-sm transition-all hover:border-eucalyptus/40 hover:shadow-md"
          >
            <div>
              <div className="font-medium text-navy">{calc.label}</div>
              <div className="text-sm text-warmgray-light">{calc.description}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-warmgray-light" />
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="rounded-lg bg-eucalyptus-dark px-6 py-3 font-medium text-white shadow-md transition hover:bg-navy hover:shadow-lg"
      >
        Calculate Your Take-Home Pay →
      </Link>
    </div>
  );
}
