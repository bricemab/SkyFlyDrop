import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyFlyDrop — Deals de vols au départ de Suisse",
  description:
    "Reçois les meilleures affaires de vols depuis Genève, Zurich et Bâle, selon TES critères.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
