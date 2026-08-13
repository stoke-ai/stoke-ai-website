export type DoorGalleryItem = {
  name: string;
  image: string;
  line: string;
};

export const raynorDoors: DoorGalleryItem[] = [
  {
    name: "StyleView",
    image: "/mdc/gallery/raynor-styleview.webp",
    line: "Clean aluminum lines and expansive glass for a bright, architectural look.",
  },
  {
    name: "Revival Wood",
    image: "/mdc/gallery/revival-wood.webp",
    line: "Carriage-house warmth with the character of a handcrafted wood door.",
  },
  {
    name: "Eden Coast",
    image: "/mdc/gallery/eden-coast.webp",
    line: "A polished coastal profile with generous windows and inviting curb appeal.",
  },
  {
    name: "RockCreeke",
    image: "/mdc/gallery/rockcreeke.webp",
    line: "Layered carriage-house detailing for a timeless, substantial entrance.",
  },
  {
    name: "Country Manor",
    image: "/mdc/gallery/country-manor.webp",
    line: "Classic farmhouse character paired with durable insulated steel sections.",
  },
  {
    name: "AP200LV",
    image: "/mdc/gallery/ap200lv.webp",
    line: "An insulated Aspen door with oversized top windows for more natural light.",
  },
  {
    name: "AP200N",
    image: "/mdc/gallery/ap200n.webp",
    line: "A clean, narrow-groove Aspen profile for understated modern homes.",
  },
  {
    name: "AP200",
    image: "/mdc/gallery/ap200.webp",
    line: "Raynor’s flagship insulated steel door, built for comfort and strength.",
  },
  {
    name: "AP138",
    image: "/mdc/gallery/ap138.webp",
    line: "Insulated performance in a slimmer door with flexible design choices.",
  },
  {
    name: "TradeMark",
    image: "/mdc/gallery/trademark.webp",
    line: "Durable steel, defined panels, and classic woodgrain texture at a practical price.",
  },
  {
    name: "BuildMark",
    image: "/mdc/gallery/buildmark.webp",
    line: "Straightforward steel construction with familiar, versatile styling.",
  },
  {
    name: "Encore",
    image: "/mdc/gallery/encore.webp",
    line: "Two-sided steel construction with dependable insulation and broad style options.",
  },
];

export const homepageDoorNames = ["StyleView", "RockCreeke", "Revival Wood", "AP200"];

export const homepageDoors = homepageDoorNames.map((name) => {
  const door = raynorDoors.find((item) => item.name === name);

  if (!door) {
    throw new Error(`Missing homepage gallery door: ${name}`);
  }

  return door;
});

export const hormannDoors: DoorGalleryItem[] = [
  {
    name: "Heritage Classic C-Series",
    image: "/mdc/gallery/hormann/heritage-classic-c-series.webp",
    line: "Handcrafted wood carriage-house styling with arched windows and rich natural character.",
  },
  {
    name: "Infinity Classic 7800",
    image: "/mdc/gallery/hormann/infinity-classic-7800.webp",
    line: "The look of a classic wood carriage door in durable, insulated aluminum construction.",
  },
  {
    name: "Therma Style 5500",
    image: "/mdc/gallery/hormann/therma-style-5500.webp",
    line: "A clean carriage-house profile with insulated steel panels and welcoming windows.",
  },
  {
    name: "Luma Classic 7400",
    image: "/mdc/gallery/hormann/luma-classic-7400.webp",
    line: "Full-view aluminum and glass bring light and a crisp contemporary finish.",
  },
  {
    name: "Modern Classic 7500",
    image: "/mdc/gallery/hormann/modern-classic-7500.webp",
    line: "Commercial-grade aluminum framing creates a refined full-view residential door.",
  },
  {
    name: "Modern Tech 3550",
    image: "/mdc/gallery/hormann/modern-tech-3550.webp",
    line: "Insulated steel, broad modern panels, and slimline windows make a bold statement.",
  },
  {
    name: "Clima Tech 4400",
    image: "/mdc/gallery/hormann/clima-tech-4400.webp",
    line: "High-performance insulated construction paired with flexible contemporary detailing.",
  },
  {
    name: "Therma Tech 3400",
    image: "/mdc/gallery/hormann/therma-tech-3400.webp",
    line: "A versatile insulated steel door with traditional panel choices and durable finishes.",
  },
];
