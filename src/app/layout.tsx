import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stoke-AI | AI Operating Systems for Idaho Business Owners | Burley & Magic Valley",
  description: "Custom AI operating systems that give Idaho business owners their freedom back. Built by a local entrepreneur in Burley, ID — serving the Magic Valley and beyond. No jargon, no cookie-cutter solutions.",
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
        <ChatWidget />
      </body>
    </html>
  );
}
