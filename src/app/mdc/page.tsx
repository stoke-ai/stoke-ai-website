import type { Metadata } from "next";
import MorganDoorDemo from "./MorganDoorDemo";

export const metadata: Metadata = {
  title: "Morgan Door Company | Garage Door Repair & Installation",
  description:
    "Garage door repair, installation, commercial doors, and safety checks across Burley and the Magic Valley. Family-owned since 1975.",
  openGraph: {
    title: "Morgan Door Company | Magic Valley Since 1975",
    description: "Fast repairs. Straight answers. Doors installed to last.",
    type: "website",
    url: "https://stoke-ai.com/mdc",
    images: [
      {
        url: "https://stoke-ai.com/mdc-og.png",
        width: 1200,
        height: 630,
        alt: "Morgan Door Company concept site",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morgan Door Company | Magic Valley Since 1975",
    description: "Fast repairs. Straight answers. Doors installed to last.",
    images: ["https://stoke-ai.com/mdc-og.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function MorganDoorPage() {
  return <MorganDoorDemo />;
}
