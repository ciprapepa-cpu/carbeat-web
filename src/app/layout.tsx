import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Topbar from "@/components/layout/Topbar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import ConsentDefaults from "@/components/analytics/ConsentDefaults";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import RouteChangeTracker from "@/components/analytics/RouteChangeTracker";
import CookieConsent from "@/components/analytics/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "CarBeat — Ověřená ojetá auta z Německa",
    template: "%s | CarBeat",
  },
  description:
    "Dovoz prověřených ojetých aut z Německa. Kompletní servis od výběru po předání. Josef Cipra, +420 777 027 809.",
  metadataBase: new URL("https://www.carbeat.cz"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "CarBeat",
    title: "CarBeat — Ověřená ojetá auta z Německa",
    description:
      "Dovoz prověřených ojetých aut z Německa. Kompletní servis od výběru po předání.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CarBeat — Ověřená ojetá auta z Německa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarBeat — Ověřená ojetá auta z Německa",
    description:
      "Dovoz prověřených ojetých aut z Německa. Kompletní servis od výběru po předání.",
    images: ["/og-image.jpg"],
  },
};

// Dark mode IIFE — runs before paint to prevent flash
// Default is dark (class on <html>), script removes it if user chose light
const darkModeScript = `
(function() {
  var theme = localStorage.getItem('cb-theme');
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark" suppressHydrationWarning>
      <head>
        <ConsentDefaults />
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-text antialiased">
        <OrganizationJsonLd />
        <GoogleAnalytics />
        <MetaPixel />
        <Suspense fallback={null}>
          <RouteChangeTracker />
        </Suspense>
        <Topbar />
        <Navigation />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieConsent />
      </body>
    </html>
  );
}
