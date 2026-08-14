import raynorCatalog from "./raynor-catalog.json";

export type DoorGalleryItem = {
  name: string;
  image: string;
  line: string;
};

export const raynorDoors: DoorGalleryItem[] = [
  {
    name: "Raynor StyleView",
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

const raynorDoorByName = new Map(raynorDoors.map((door) => [door.name, door]));

export const raynorDoorGroups = raynorCatalog.styles.map((group) => ({
  style: group.name,
  doors: group.models.map((name) => {
    const door = raynorDoorByName.get(name);

    if (!door) {
      throw new Error(`Missing Raynor gallery model: ${name}`);
    }

    const filename = door.image.split("/").at(-1);
    const image = group.name === "Classic"
      ? door.image
      : `/mdc/gallery/${group.name.toLowerCase()}/${filename}`;

    return { ...door, image };
  }),
}));

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
  {
    name: "Builder Collection",
    image: "/mdc/gallery/hormann/builder-collection.webp",
    line: "Carriage-house details and warm wood-look finishes bring character to an everyday home.",
  },
  {
    name: "Clima Elite 5800",
    image: "/mdc/gallery/hormann/clima-elite-5800.webp",
    line: "A highly insulated carriage-house door with classic overlays, windows, and lasting comfort.",
  },
  {
    name: "Deco Safe 5250",
    image: "/mdc/gallery/hormann/deco-safe-5250.webp",
    line: "Traditional carriage-house styling with strong steel construction and a broad range of designs.",
  },
  {
    name: "Heritage Classic E-Series",
    image: "/mdc/gallery/hormann/heritage-classic-e-series.webp",
    line: "A handcrafted wood carriage door with classic detailing and natural curb appeal.",
  },
  {
    name: "Style Safe 5200",
    image: "/mdc/gallery/hormann/style-safe-5200.webp",
    line: "Insulated steel and decorative overlays create a durable carriage-house look.",
  },
  {
    name: "Classic Safe 7200",
    image: "/mdc/gallery/hormann/classic-safe-7200.webp",
    line: "Full-view glass and aluminum construction give homes a clean contemporary option.",
  },
  {
    name: "Pro Safe 2100",
    image: "/mdc/gallery/hormann/pro-safe-2100.webp",
    line: "A dependable steel door with familiar raised panels, window choices, and everyday value.",
  },
  {
    name: "Pro Tech 2500",
    image: "/mdc/gallery/hormann/pro-tech-2500.webp",
    line: "Insulated steel construction pairs practical performance with traditional panel designs.",
  },
  {
    name: "Therma Safe 3200",
    image: "/mdc/gallery/hormann/therma-safe-3200.webp",
    line: "A well-insulated traditional door with durable steel panels and flexible window options.",
  },
  {
    name: "Therma Tech 3500",
    image: "/mdc/gallery/hormann/therma-tech-3500.webp",
    line: "Strong insulation and classic panel choices make this steel door a versatile fit.",
  },
];

export const homepageDoorNames = [
  "RockCreeke",
  "Revival Wood",
  "Country Manor",
  "TradeMark",
  "Heritage Classic C-Series",
  "Therma Tech 3400",
];

const residentialDoors = [...raynorDoors, ...hormannDoors];

export const homepageDoors = homepageDoorNames.map((name) => {
  const door = residentialDoors.find((item) => item.name === name);

  if (!door) {
    throw new Error(`Missing homepage gallery door: ${name}`);
  }

  return door;
});
