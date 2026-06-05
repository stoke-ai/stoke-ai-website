import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWidgetGate from "@/components/ChatWidgetGate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stoke AI | Custom Automation for the Magic Valley",
  description: "Eliminate manual data entry, messy spreadsheets, and operational busywork. Stoke AI builds custom back-office systems for Magic Valley logistics and ag companies.",
  keywords: ["AI operating system", "Idaho business", "Magic Valley", "Burley Idaho", "small business automation", "commission-based entrepreneurs", "insurance agent AI", "realtor AI", "business automation Idaho"],
  openGraph: {
    title: "Stoke-AI | Igniting Intelligence",
    description: "Practical AI consulting tailored to your specific business.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatWidgetGate />
      </body>
    </html>
  );
}
