import type { Metadata } from "next";
import ServicePage from "../_components/ServicePage";
import { installation } from "../_data/services";

export const metadata: Metadata = {
  title: "Garage Door Installation Burley ID | Morgan Door Company",
  description: "Raynor and Hörmann residential garage door installation in Burley, Twin Falls, Rupert, Kimberly, and the Magic Valley. Family-owned since 1975. Get a free quote.",
  alternates: { canonical: "https://stoke-ai.com/mdc/garage-door-installation" },
};

export default function Page() { return <ServicePage data={installation} />; }
