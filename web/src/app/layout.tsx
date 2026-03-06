import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientProviders from "@/components/layout/ClientProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://procorp.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "PRO CORP | Technology-Based Orchestration — BPA, Legal Solutions & Sustainable Growth",
    template: "%s | PRO CORP",
  },
  description:
    "Pro Corp redesigns operating models, automates execution, and integrates assets, capital, and expertise through a transparent exchange platform — amplified by intelligent marketing systems.",
  keywords: [
    "PRO CORP",
    "BPA",
    "Business Process Automation",
    "Legal Solutions",
    "Sustainable Growth",
    "Technology Orchestration",
    "Digital Transformation",
  ],
  authors: [{ name: "PRO CORP" }],
  creator: "PRO CORP",
  publisher: "PRO CORP",
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
    locale: "en_US",
    alternateLocale: "es_ES",
    url: siteUrl,
    siteName: "PRO CORP",
    title:
      "PRO CORP | Technology-Based Orchestration — BPA, Legal Solutions & Sustainable Growth",
    description:
      "Pro Corp redesigns operating models, automates execution, and integrates assets, capital, and expertise through a transparent exchange platform — amplified by intelligent marketing systems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PRO CORP — Technology-Based Orchestration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PRO CORP | Technology-Based Orchestration",
    description:
      "Pro Corp redesigns operating models, automates execution, and integrates assets, capital, and expertise through a transparent exchange platform.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": `${siteUrl}/en`,
      "es-ES": `${siteUrl}/es`,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-ui`}
      >
        <ClientProviders>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-bold">
            Skip to content
          </a>
          <Navbar />
          <div id="main-content">{children}</div>
          <Footer />
        </ClientProviders>
      </body>
      {gaId && gaId !== "G-XXXXXXXXXX" && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
