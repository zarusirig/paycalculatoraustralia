import type { Metadata } from "next";
import TrainDriverSalaryPage from "@/modules/guide/train-driver-salary";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { TRAIN_DRIVER_FAQS } from "@/lib/data/train-driver-pay";

// J6 (wave 4, 24 Sep 2026). Targets (DataForSEO AU): train driver salary 1.6k,
// sydney trains driver salary 320, train driver salary nsw 320.

const SLUG = "train-driver-salary";
const TITLE = "Train Driver Salary Australia 2026 — Sydney Trains & Metro Pay";
const DESCRIPTION =
  "Train driver pay from July 2026: Sydney Trains drivers $1,861.35 a week, Metro Trains Melbourne qualified drivers $92,077 a year, trainee rates and take-home pay.";
const URL = `https://pay-calculator-australia.com/${SLUG}/`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return (
    <>
      {t3JsonLd({
        slug: SLUG,
        title: TITLE,
        description: DESCRIPTION,
        headline: "Train Driver Salary Australia 2026: Sydney Trains and Metro Melbourne Pay",
        crumbs: [{ name: "Pay Rates by Job", path: "/job-pay-rates/" }, { name: "Train Driver Salary", path: `/${SLUG}/` }],
        faqs: [...TRAIN_DRIVER_FAQS],
        published: "2026-09-24",
      })}
      <TrainDriverSalaryPage />
    </>
  );
}
