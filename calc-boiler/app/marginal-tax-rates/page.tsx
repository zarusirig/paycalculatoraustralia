import type { Metadata } from "next";
import MarginalTaxRatesPage from "@/modules/guide/marginal-tax-rates";
import { MARGINAL_TAX_RATES_FAQS } from "@/modules/guide/marginal-tax-rates-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct core batch (5 Oct 2026): "marginal tax rates" / "marginal tax rate
// australia". Distinct from /tax-brackets/ (the scale and the tax at each
// threshold): this page answers what the next dollar, a raise or a bonus costs.

const SLUG = "marginal-tax-rates";
const TITLE = "Marginal Tax Rates Australia 2026-27: What a Raise Nets";
const DESCRIPTION =
  "Marginal vs average tax rate in Australia for 2026-27. See how much of a raise, bonus or overtime you keep after tax, Medicare levy and HELP, with a calculator.";

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Marginal Tax Rates Australia 2026-27: What a Raise or Bonus Really Nets",
  crumbs: [{ name: "Tax", path: "/tax-brackets/" }, { name: "Marginal Tax Rates", path: `/${SLUG}/` }],
  faqs: MARGINAL_TAX_RATES_FAQS,
  app: { name: "Marginal vs Average Tax Rate Calculator", description: "Shows how much of a pay rise, bonus or extra income you keep after income tax, Medicare levy and HELP using 2026-27 resident rates, with the marginal and average rate before and after." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <MarginalTaxRatesPage />
    </>
  );
}

export default withPageEnd(Page, "/marginal-tax-rates/");
