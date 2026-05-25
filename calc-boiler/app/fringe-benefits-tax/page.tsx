import type { Metadata } from "next"; import FringeBenefitsTaxPage from "@/modules/guide/fringe-benefits-tax"; import { JsonLd } from "@/modules/seo/json-ld"; import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts"; import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS, GUIDE_AUTHORSHIP } from "@/lib/authors";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/fringe-benefits-tax/`;
export const metadata: Metadata = { title: "Fringe Benefits Tax (FBT) Australia 2025-26 — Rate, Gross-Up & Examples", description: "Complete guide to Fringe Benefits Tax in Australia for FY2025-26. The 47% FBT rate, Type 1 (2.0802) & Type 2 (1.8868) gross-up factors, reportable benefits & employer obligations — with worked examples.", alternates: { canonical: URL }, openGraph: { title: "Fringe Benefits Tax (FBT) Australia 2025-26 — Rate, Gross-Up & Examples", description: "FBT rate, Type 1 & Type 2 gross-up factors, worked examples, reportable benefits, and employer obligations for FY2025-26.", url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "FBT Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Fringe Benefits Tax Guide", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the FBT rate in Australia?",
      acceptedAnswer: { "@type": "Answer", text: "The Fringe Benefits Tax rate in Australia is 47% for the FBT year ending 31 March 2026. This equals the top marginal income tax rate (45%) plus the 2% Medicare levy and has been unchanged since 1 April 2017. FBT is applied to the grossed-up taxable value of non-cash benefits, using the Type 1 (2.0802) or Type 2 (1.8868) gross-up factor." },
    },
    {
      "@type": "Question",
      name: "Who pays Fringe Benefits Tax?",
      acceptedAnswer: { "@type": "Answer", text: "Employers pay Fringe Benefits Tax — never employees. The employer calculates the taxable value of all non-cash benefits provided to staff (or their associates), grosses up the amount, applies the 47% FBT rate, and remits the liability directly to the ATO. The employer can claim an income tax deduction for the FBT paid. Employees may still see the grossed-up value reported on their income statement as a Reportable Fringe Benefits Amount (RFBA)." },
    },
    {
      "@type": "Question",
      name: "What is the FBT year?",
      acceptedAnswer: { "@type": "Answer", text: "The FBT year runs from 1 April to 31 March — it is separate from the standard Australian financial year (1 July to 30 June). Employers must lodge the annual FBT return and pay any FBT owing by 21 May each year, or by 25 June if lodging through a registered tax agent. Quarterly instalments may also apply." },
    },
    {
      "@type": "Question",
      name: "What's the difference between Type 1 and Type 2 fringe benefits?",
      acceptedAnswer: { "@type": "Answer", text: "Type 1 benefits are those on which the employer is entitled to claim a GST credit — they use the higher gross-up factor of 2.0802. Type 2 benefits are those on which no GST credit is available (such as GST-free or input-taxed supplies like residential rent) — they use the lower gross-up factor of 1.8868. The FBT rate of 47% applies to both, but the higher Type 1 gross-up means Type 1 benefits attract more FBT for the same taxable value." },
    },
    {
      "@type": "Question",
      name: "Do I pay tax on reportable fringe benefits?",
      acceptedAnswer: { "@type": "Answer", text: "No. The Reportable Fringe Benefits Amount (RFBA) shown on your income statement is not taxed again in your hands — the employer has already paid FBT on the benefit. However, the RFBA is added to your adjusted taxable income and can affect income-tested obligations such as the Medicare Levy Surcharge, HECS-HELP repayments, Division 293 tax, Family Tax Benefit, and the super co-contribution." },
    },
    {
      "@type": "Question",
      name: "Do employees pay FBT?",
      acceptedAnswer: { "@type": "Answer", text: "No. FBT is an employer obligation, though reportable fringe benefits can affect income-tested benefits including HECS-HELP, Medicare Levy Surcharge, and Centrelink payments." },
    },
  ],
};
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><FringeBenefitsTaxPage /></>); }
