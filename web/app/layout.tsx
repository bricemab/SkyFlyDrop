import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkyFlyDrop — Deals de vols au départ de Suisse",
  description:
    "Les meilleurs prix de vols depuis Genève, Zurich & Bâle, selon TES critères.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="relative min-h-dvh overflow-x-hidden bg-[#070a12] font-sans text-slate-100 antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[130px]" />
          <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[130px]" />
          <div className="absolute -bottom-40 left-1/3 h-[440px] w-[440px] rounded-full bg-fuchsia-500/10 blur-[130px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
