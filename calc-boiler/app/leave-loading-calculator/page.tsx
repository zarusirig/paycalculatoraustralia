import type { Metadata } from "next";
import LeaveLoadingPage from "@/modules/guide/leave-loading";
import { LEAVE_LOADING_FAQS } from "@/modules/guide/leave-loading-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";

const SLUG = "leave-loading-calculator";
const TITLE = "Leave Loading Calculator: 17.5% Annual Leave Loading";
const DESCRIPTION =
  "Work out 17.5% annual leave loading, including the award test that pays your shift penalties instead if higher. Which awards pay it, how it's taxed and payout.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Leave Loading Calculator: 17.5% Explained",
  crumbs: [{ name: "Annual Leave", path: "/annual-leave-guide/" }, { name: "Leave Loading Calculator", path: `/${SLUG}/` }],
  faqs: LEAVE_LOADING_FAQS,
  app: { name: "Leave Loading Calculator", description: "Calculates annual leave pay and 17.5% leave loading, applies the award's higher-of-penalties test, and estimates Schedule 5 withholding on a lump-sum loading." },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <LeaveLoadingPage />
    </>
  );
}
