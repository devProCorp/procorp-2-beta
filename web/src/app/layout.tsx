import type { Metadata } from "next";
import { Montserrat, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRO CORP | Corporate Development — Ciudadanía Europea, Inversión y Automatización",
  description: "Desarrollo corporativo, ciudadanía europea por origen sefardí, Golden Visa, inversión en España y automatización de procesos. Presencia en Colombia, España, Portugal y Suiza.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${montserrat.variable} ${spaceGrotesk.variable} antialiased font-ui`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
