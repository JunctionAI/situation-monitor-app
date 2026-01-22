import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Situation Monitor | Real-Time Global Crisis Tracker",
  description: "Track global conflicts, geopolitical tensions, and breaking news in real-time. Live updates from 20+ news sources with AI-powered analysis. Monitor Ukraine, Gaza, Sudan, and emerging hotspots worldwide.",
  keywords: ["global news", "crisis tracker", "geopolitics", "world news", "conflict map", "real-time news", "situation awareness", "intelligence", "Ukraine war", "Gaza conflict", "breaking news"],
  authors: [{ name: "Situation Monitor" }],
  openGraph: {
    title: "Situation Monitor | Real-Time Global Crisis Tracker",
    description: "Track global conflicts and breaking news in real-time. Live updates from 20+ sources with AI analysis.",
    type: "website",
    locale: "en_US",
    siteName: "Situation Monitor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Situation Monitor | Real-Time Global Crisis Tracker",
    description: "Track global conflicts and breaking news in real-time. Live updates from 20+ sources.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)]`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
