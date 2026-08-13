import type { Metadata } from "next";
import { FinalCta, MdcPage } from "../_components/MdcChrome";
import { hormannDoors, raynorDoors, type DoorGalleryItem } from "../_data/gallery";

export const metadata: Metadata = {
  title: "Residential Garage Door Gallery | Morgan Door Company",
  description: "Explore Raynor and Hörmann residential garage doors available through Morgan Door Company in Southern Idaho.",
  robots: { index: false, follow: false },
};

function DoorGrid({ doors, label }: { doors: DoorGalleryItem[]; label: string }) {
  return (
    <div className="gallery-images" aria-label={label}>
      {doors.map((door) => (
        <figure className="gallery-card" key={door.name}>
          <img
            src={door.image}
            alt={`${door.name} garage door shown on a home`}
            width="720"
            height="478"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <strong>{door.name}</strong>
            <span>{door.line}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <MdcPage>
      <section className="gallery-section gallery-page">
        <div className="gallery-copy">
          <p className="eyebrow">Residential door gallery</p>
          <h1>Find the door that fits your home.</h1>
          <p>Morgan Door installs both Raynor and Hörmann garage doors. Compare modern, carriage-house, and traditional styles here, then ask our local team about insulation, windows, finishes, and fit.</p>
          <a className="button button-light" href="/mdc/free-quote">Get a door quote</a>
        </div>

        <section className="gallery-brand-block" aria-labelledby="raynor-gallery-heading">
          <div className="gallery-brand-heading">
            <p className="eyebrow">Raynor</p>
            <h2 id="raynor-gallery-heading">Raynor residential doors</h2>
            <p>Explore all twelve Design Center selections currently featured by Morgan Door.</p>
          </div>
          <DoorGrid doors={raynorDoors} label="Raynor residential garage door models" />
        </section>

        <section className="gallery-brand-block" aria-labelledby="hormann-gallery-heading">
          <div className="gallery-brand-heading">
            <p className="eyebrow">Hörmann</p>
            <h2 id="hormann-gallery-heading">Hörmann residential doors</h2>
            <p>See a focused mix of official Hörmann carriage-house, contemporary, and traditional residential doors.</p>
          </div>
          <DoorGrid doors={hormannDoors} label="Hörmann residential garage door models" />
        </section>
      </section>
      <FinalCta title="See a door you like? Let’s find the right fit for your home." />
    </MdcPage>
  );
}
