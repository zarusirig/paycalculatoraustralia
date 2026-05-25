import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Script from "next/script";
import FirebaseAnalytics from "@/components/firebase-analytics";

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
        <main id="main-content">{children}</main>
        <Footer />
        <FirebaseAnalytics />

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
