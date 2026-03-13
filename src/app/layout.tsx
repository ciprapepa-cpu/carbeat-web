import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/layout/Topbar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

export const metadata: Metadata = {
  title: {
    default: "CarBeat — Ověřená ojetá auta z Německa",
    template: "%s | CarBeat",
  },
  description:
    "Dovoz prověřených ojetých aut z Německa. Kompletní servis od výběru po předání. Josef Cipra, +420 777 027 809.",
  metadataBase: new URL("https://carbeat.cz"),
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "CarBeat",
  },
};

// Dark mode IIFE — runs before paint to prevent flash
const darkModeScript = `
(function() {
  var theme = localStorage.getItem('cb-theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
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
        <Topbar />
        <Navigation />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
