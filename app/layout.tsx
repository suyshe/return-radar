import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context/app-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReturnRadar | Product Return Window & Warranty Deadline Tracker",
  description: "Track return deadlines and warranty expirations across Amazon, Apple, Best Buy, and all your favorite stores with automated reminders.",
  keywords: ["return tracker", "warranty tracker", "receipt manager", "return window alert", "SaaS"],
  authors: [{ name: "ReturnRadar Team" }],
  openGraph: {
    title: "ReturnRadar - Track Return Windows & Warranty Deadlines",
    description: "Never lose money on expired return windows. Automatic retailer policy presets, deadline alerts, and 1-click calendar sync.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
