import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Script from "next/script";
import FirebaseAnalytics from "@/components/firebase-analytics";
import AdsterraBanner from "@/components/common/adsterra-banner";

export const viewport: Viewport = {
  themeColor: "#1a2744",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Pay Calculator Australia",
    default: "Pay Calculator Australia 2025-26 — Free Tax & Take-Home Pay Calculator",
  },
  description:
    "Free Australian pay & income tax calculator. Calculate your take-home pay instantly with current tax brackets, super, Medicare levy & HECS — updated for FY2025-26.",
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6191764023643150"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-6191764023643150" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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

        {/* Sticky vertical sidebar ads — follow scroll, shown on wide screens only */}
        <aside
          aria-hidden="true"
          className="hidden xl:block fixed left-2 top-1/2 -translate-y-1/2 z-40"
        >
          <AdsterraBanner slot="sidebar" />
        </aside>
        <aside
          aria-hidden="true"
          className="hidden xl:block fixed right-2 top-1/2 -translate-y-1/2 z-40"
        >
          <AdsterraBanner slot="sidebar" />
        </aside>

        {/* Top display ad — every page (leaderboard on desktop, mobile banner on phones) */}
        <div className="hidden sm:block">
          <AdsterraBanner slot="leaderboard" />
        </div>
        <div className="block sm:hidden">
          <AdsterraBanner slot="mobile" />
        </div>

        <main id="main-content">{children}</main>

        {/* Bottom display ad — every page */}
        <div className="hidden sm:block">
          <AdsterraBanner slot="rectangle" />
        </div>
        <div className="block sm:hidden">
          <AdsterraBanner slot="mobile" />
        </div>

        <Footer />
        <FirebaseAnalytics />

        {/* Adsterra social bar / popunder (loaded once, site-wide) */}
        <Script
          id="adsterra-social"
          src="https://pl29540036.effectivecpmnetwork.com/d6/b7/79/d6b779f19c693c0f80a1c6a82ba34550.js"
          strategy="afterInteractive"
        />

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
