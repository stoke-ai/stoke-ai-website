import { Geist, Oswald } from "next/font/google";
import type { Metadata } from "next";
import "./mdc.css";

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stoke-ai.com"),
  robots: { index: false, follow: false },
};

export default function MorganDoorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "Morgan Door Company",
    url: "https://stoke-ai.com/mdc",
    telephone: "+1-208-678-3667",
    foundingDate: "1975",
    description: "Family-owned residential and commercial garage door company serving Burley and the Magic Valley.",
    areaServed: ["Burley", "Twin Falls", "Rupert", "Heyburn", "Kimberly", "Jerome", "Buhl", "Filer", "Magic Valley"],
    knowsAbout: ["Garage door repair", "Garage door installation", "Commercial overhead doors", "Garage door maintenance"],
  };

  return (
    <div className={`${body.variable} ${display.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      {children}
    </div>
  );
}
