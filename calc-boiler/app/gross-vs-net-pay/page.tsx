import type { Metadata } from "next";
import GrossVsNetPayPage from "@/modules/guide/gross-vs-net-pay";
import { GROSS_VS_NET_FAQS } from "@/modules/guide/gross-vs-net-pay-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { formatAUD } from "@/lib/constants";
import { payslipFromGross } from "@/lib/constants/gross-vs-net";

const SLUG = "gross-vs-net-pay";
const EX = payslipFromGross({ gross: 3_000, frequency: "fortnightly" });
const TITLE = "Gross vs Net Pay Australia: Difference + Converter";
const DESCRIPTION = `Gross pay is before tax and deductions; net pay is what reaches your bank. ${formatAUD(3_000)} gross a fortnight is ${formatAUD(EX.net, 2)} net in 2026-27. What a gross payment is, a worked payslip, and a gross to net / net to gross converter.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Gross vs Net Pay: What's the Difference?",
  crumbs: [{ name: "Your Payslip", path: "/understanding-your-payslip/" }, { name: "Gross vs Net Pay", path: `/${SLUG}/` }],
  faqs: GROSS_VS_NET_FAQS,
  app: { name: "Gross to Net / Net to Gross Pay Converter", description: "Converts gross pay to net pay and net to gross per pay period using the ATO 2026-27 Schedule 1 withholding formulas, with salary sacrifice, study loans and after-tax deductions." },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <GrossVsNetPayPage />
    </>
  );
}
