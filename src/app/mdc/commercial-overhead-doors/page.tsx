import type { Metadata } from "next";
import ServicePage from "../_components/ServicePage";
import { commercial } from "../_data/services";

export const metadata: Metadata = {
  title: "Commercial Overhead Doors Twin Falls & Magic Valley | Morgan Door",
  description: "Commercial overhead door installation, repair, operators, and maintenance for Southern Idaho shops, farms, warehouses, and facilities.",
  alternates: { canonical: "https://stoke-ai.com/mdc/commercial-overhead-doors" },
};

export default function Page() { return <ServicePage data={commercial} />; }
