import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { StatusBanner } from "@/components/StatusBanner";
import "./globals.css";

// Fonts load from Google Fonts in the browser (not at build time), so a
// font-server hiccup can never fail the Vercel build.
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

export const metadata: Metadata = {
  title: { default: "RERUN — Every legend deserves a rerun", template: "%s · RERUN" },
  description: "Late-night reruns for Solana's legendary memecoins: vote which legends come back, watch live charts and trade with Phantom.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body className="min-h-dvh font-sans">
        <Providers>
          <div className="relative z-10 flex min-h-dvh flex-col">
            <Header />
            <StatusBanner />
            <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-16 sm:px-6">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
