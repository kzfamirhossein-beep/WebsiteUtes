import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import LiveBackground from "@/components/LiveBackground";
import BrandPaletteLoader from "@/components/BrandPaletteLoader";
import BackgroundImageLayer from "@/components/BackgroundImageLayer";
import { LanguageProvider } from "@/components/LanguageContext";
import PageFadeIn from "@/components/PageFadeIn";
import ScrollableHeader from "@/components/ScrollableHeader";
import PositionedLogo from "@/components/PositionedLogo";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "500", "600", "700"] });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "وبسایت رسمی اوتس ایران utes.ir",
  description: "وب‌سایت معرفی کسب‌وکار و محصولات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${playfair.variable} ${inter.variable} min-h-dvh bg-[#1f1f1f] text-gray-200 antialiased font-sans`}>
        <LanguageProvider>
          <PageFadeIn>
            <BrandPaletteLoader />
            <LiveBackground />
            <BackgroundImageLayer />
            <ScrollableHeader />
            <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 pt-24 opacity-0 animate-fade-in" style={{ animationDelay: "1.4s" }}>
              <PositionedLogo />
              {children}
            </main>
            <Footer />
          </PageFadeIn>
        </LanguageProvider>
      </body>
    </html>
  );
}


