import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Script from "next/script";
import FirebaseAnalytics from "@/components/firebase-analytics";
import AdsterraBanner from "@/components/common/adsterra-banner";
import { WhatsNext } from "@/components/common/content-slots";
import DeferredSocialBar from "@/components/common/deferred-social-bar";
import EngagementTracking from "@/components/common/engagement-tracking";

export const viewport: Viewport = {
  themeColor: "#1a2744",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    // No "%s | Brand" template: the suffix cost a flat 233px of Google's
    // ~600px title budget and was truncated on every page. Google appends
    // the site name itself when it wants to.
    template: "%s",
    default: "Pay Calculator Australia — Free Tax & Take-Home Pay Calculator",
  },
  description:
    "Free Australian pay & income tax calculator. Calculate your take-home pay instantly with current tax brackets, super, Medicare levy & HECS — official ATO rates.",
  metadataBase: new URL("https://pay-calculator-australia.com"),
  applicationName: "Pay Calculator Australia",
  authors: [{ name: "Pay Calculator Australia" }],
  creator: "Pay Calculator Australia",
  publisher: "Pay Calculator Australia",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Pay Calculator Australia",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <head>
        {/* AdSense script removed: no `<ins class="adsbygoogle">` units exist on
            the site and no application is pending, so it was a blocking
            third-party request on every pageview for zero revenue. Re-add this
            script and the `google-adsense-account` meta tag together if AdSense
            is ever applied for. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Ad origins: connect early so the first impression isn't waiting on DNS/TLS. */}
        <link rel="preconnect" href="https://www.highperformanceformat.com" />
        <link rel="dns-prefetch" href="https://www.highperformanceformat.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground"
        style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:text-eucalyptus-dark focus:font-semibold"
        >
          Skip to main content
        </a>
        <Navbar />

        {/* Sticky vertical rails — wide desktop only.
            Gated at 1700px rather than `xl` (1280px). The content column is
            max-w-7xl = 1280px centred, and each 160px rail plus its offset needs
            roughly 185px of clear space per side, so the rails only clear the
            article above ~1650px. Between 1280px and 1650px they rendered ON TOP
            of the content — which covers 1366x768, 1440x900 and 1536x864, three
            of the most common desktop resolutions in use. */}
        <aside
          aria-hidden="true"
          className="hidden min-[1700px]:block fixed left-2 top-1/2 -translate-y-1/2 z-40"
        >
          <AdsterraBanner slot="sidebar" />
        </aside>
        <aside
          aria-hidden="true"
          className="hidden min-[1700px]:block fixed right-2 top-1/2 -translate-y-1/2 z-40"
        >
          {/* Distinct key from the left rail. Adsterra serves one placement per
              key per pageview, so the previous duplicate `sidebar` either
              no-filled or collapsed in reporting. `skyscraper` is the same
              160x600 size, was already provisioned, and was never rendered. */}
          <AdsterraBanner slot="skyscraper" />
        </aside>

        {/* Top display ad.
            Kept above the fold on BOTH breakpoints on purpose. It is the only
            unit guaranteed to be seen by a visitor who bounces, and Adsterra
            pays per impression — dropping it would have cost an impression on
            every short mobile session, which is most of them. The mobile unit
            uses `compact` spacing so it costs ~60px of fold instead of ~98px. */}
        <div className="hidden sm:block">
          <AdsterraBanner slot="leaderboard" />
        </div>
        <div className="block sm:hidden">
          <AdsterraBanner slot="mobile" compact />
        </div>

        <main id="main-content">{children}</main>

        {/* 300x250 directly after the article, immediately before the
            related-links block. The reader has finished the content and is
            looking for what comes next, so this position is genuinely viewed
            rather than scrolled past. Shown on every breakpoint — on mobile it
            replaces the old second 320x50, which was the lowest-CPM unit in the
            account. */}
        <AdsterraBanner slot="rectangle" />

        <WhatsNext />

        {/* Bottom banner — desktop only. Mobile already has two units above and
            a third would push ad density past the point of diminishing returns. */}
        <div className="hidden sm:block">
          <AdsterraBanner slot="banner" />
        </div>

        <Footer />
        <FirebaseAnalytics />
        <EngagementTracking />

        {/* Adsterra social bar / popunder, deferred until the visitor has stayed
            45s or used a calculator. This is the one change here that costs
            impressions — see the component for the dial. */}
        <DeferredSocialBar />

        {/* GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8WE507LD32"
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8WE507LD32', {
              send_page_view: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `}
        </Script>
      </body>
    </html>
  );
}
