import type { Metadata } from "next";
import ServicePage from "../_components/ServicePage";
import { maintenance } from "../_data/services";

export const metadata: Metadata = {
  title: "Garage Door Maintenance & Safety Checks | Magic Valley",
  description: "Professional garage door tune-ups, maintenance, and safety checks for homes and businesses in Burley, Twin Falls, and the Magic Valley.",
  alternates: { canonical: "https://stoke-ai.com/mdc/maintenance-safety-checks" },
};

export default function Page() { return <ServicePage data={maintenance} />; }
