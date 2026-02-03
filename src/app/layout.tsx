import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stoke-AI | AI Consulting for Small Businesses | The Magic Valley, Idaho",
  description: "Practical AI consulting tailored to your specific business. No jargon, no cookie-cutter solutions. Based in the Magic Valley, Idaho.",
  keywords: ["AI consulting", "small business", "Magic Valley", "Idaho", "artificial intelligence", "business automation"],
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
