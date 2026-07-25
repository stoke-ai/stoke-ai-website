import type { Metadata } from "next";
import ServicePage from "../_components/ServicePage";
import { repair } from "../_data/services";

export const metadata: Metadata = {
  title: "Garage Door Repair Burley ID | All Brands | Morgan Door",
  description: "Garage door repair for broken springs, cables, off-track doors, openers, and safety issues across Burley and the Magic Valley. Same-day availability.",
  alternates: { canonical: "https://stoke-ai.com/mdc/garage-door-repair" },
};

export default function Page() { return <ServicePage data={repair} />; }
