import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIS SmartAssist | AI Assistant for Indian Standards & BIS Services",
  description:
    "Describe your product. Understand your BIS journey. Evidence-grounded AI conversational assistant for Indian Standards, BIS certification, testing laboratories, and hallmarking. Built for SIH Problem Statement 26107.",
  keywords: [
    "BIS SmartAssist",
    "Indian Standards",
    "BIS Certification",
    "ISI Mark",
    "Hallmarking HUID",
    "MSME BIS",
    "SIH 2026",
    "Bureau of Indian Standards",
    "Manakonline",
    "IS 17803",
    "RAG AI Assistant"
  ],
  authors: [{ name: "SIH Team — BIS SmartAssist" }],
  robots: "noindex, nofollow", // Prototype — disable indexing
  openGraph: {
    title: "BIS SmartAssist — Describe your product. Understand your BIS journey.",
    description:
      "Evidence-grounded AI assistant for Indian Standards and BIS services. Supporting MSMEs, Industries, Startups, Consumers, and Laboratories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B192C" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
