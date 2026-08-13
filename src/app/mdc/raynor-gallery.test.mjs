import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const componentPath = path.join(repoRoot, "src/app/mdc/MorganDoorDemo.tsx");
const dataPath = path.join(repoRoot, "src/app/mdc/_data/gallery.ts");
const galleryPagePath = path.join(repoRoot, "src/app/mdc/gallery/page.tsx");
const layoutPath = path.join(repoRoot, "src/app/mdc/layout.tsx");
const stylesheetPath = path.join(repoRoot, "src/app/mdc/mdc.css");

const raynorModels = [
  ["StyleView", "raynor-styleview.webp"],
  ["Revival Wood", "revival-wood.webp"],
  ["Eden Coast", "eden-coast.webp"],
  ["RockCreeke", "rockcreeke.webp"],
  ["Country Manor", "country-manor.webp"],
  ["AP200LV", "ap200lv.webp"],
  ["AP200N", "ap200n.webp"],
  ["AP200", "ap200.webp"],
  ["AP138", "ap138.webp"],
  ["TradeMark", "trademark.webp"],
  ["BuildMark", "buildmark.webp"],
  ["Encore", "encore.webp"],
];

const homepageModels = [
  ["RockCreeke", "Raynor"],
  ["Revival Wood", "Raynor"],
  ["Country Manor", "Raynor"],
  ["TradeMark", "Raynor"],
  ["Heritage Classic C-Series", "Hörmann"],
  ["Therma Tech 3400", "Hörmann"],
];

const hormannModels = [
  ["Heritage Classic C-Series", "heritage-classic-c-series.webp"],
  ["Infinity Classic 7800", "infinity-classic-7800.webp"],
  ["Therma Style 5500", "therma-style-5500.webp"],
  ["Luma Classic 7400", "luma-classic-7400.webp"],
  ["Modern Classic 7500", "modern-classic-7500.webp"],
  ["Modern Tech 3550", "modern-tech-3550.webp"],
  ["Clima Tech 4400", "clima-tech-4400.webp"],
  ["Therma Tech 3400", "therma-tech-3400.webp"],
  ["Builder Collection", "builder-collection.webp"],
  ["Clima Elite 5800", "clima-elite-5800.webp"],
  ["Deco Safe 5250", "deco-safe-5250.webp"],
  ["Heritage Classic E-Series", "heritage-classic-e-series.webp"],
  ["Style Safe 5200", "style-safe-5200.webp"],
  ["Classic Safe 7200", "classic-safe-7200.webp"],
  ["Pro Safe 2100", "pro-safe-2100.webp"],
  ["Pro Tech 2500", "pro-tech-2500.webp"],
  ["Therma Safe 3200", "therma-safe-3200.webp"],
  ["Therma Tech 3500", "therma-tech-3500.webp"],
];

test("homepage gallery is a six-door Raynor and Hörmann tease with gallery and quote paths", async () => {
  const [component, data, layout] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(dataPath, "utf8"),
    readFile(layoutPath, "utf8"),
  ]);

  assert.match(component, /<QuoteForm compact \/>/);
  assert.match(component, /homepageDoors\.map/);
  assert.match(component, /href="\/mdc\/gallery">See all doors/);
  assert.match(component, /href="\/mdc\/free-quote">Get a door quote/);
  assert.match(component, /Raynor \+ Hörmann/);
  assert.match(component, /six Raynor and Hörmann doors/);
  assert.match(component, /Burley and the Magic Valley/);
  assert.match(layout, /robots: \{ index: false, follow: false \}/);
  const homepageBlock = data.match(/homepageDoorNames = \[([\s\S]*?)\];/)?.[1] ?? "";
  for (const [name] of homepageModels) {
    assert.ok(homepageBlock.includes(`"${name}"`), `${name} should be in the homepage tease`);
  }
  assert.equal(homepageModels.length, 6);
  assert.equal((homepageBlock.match(/^\s+"/gm) ?? []).length, 6);
  assert.equal(homepageModels.filter(([, brand]) => brand === "Raynor").length, 4);
  assert.equal(homepageModels.filter(([, brand]) => brand === "Hörmann").length, 2);
  assert.doesNotMatch(homepageBlock, /StyleView|AP200LV|AP200N|AP200|AP138/);
  assert.match(data, /const residentialDoors = \[\.\.\.raynorDoors, \.\.\.hormannDoors\]/);
});

test("gallery page contains every hosted Raynor and Hörmann door", async () => {
  const [data, page] = await Promise.all([
    readFile(dataPath, "utf8"),
    readFile(galleryPagePath, "utf8"),
  ]);

  for (const [name, filename] of raynorModels) {
    assert.match(data, new RegExp(`name: ["“]${name}["”]`));
    assert.match(data, new RegExp(`/mdc/gallery/${filename}`));
  }

  for (const [name, filename] of hormannModels) {
    assert.match(data, new RegExp(`name: ["“]${name}["”]`));
    assert.match(data, new RegExp(`/mdc/gallery/hormann/${filename}`));
  }

  assert.equal((data.match(/^\s+line: "/gm) ?? []).length, raynorModels.length + hormannModels.length);
  assert.match(page, /id="raynor-gallery-heading"/);
  assert.match(page, /id="hormann-gallery-heading"/);
  assert.match(page, /Morgan Door installs both Raynor and Hörmann/);
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(page, /<FinalCta/);
});

test("all gallery images are local, compressed WebP assets", async () => {
  for (const [, filename] of raynorModels) {
    const image = await stat(path.join(repoRoot, "public/mdc/gallery", filename));
    assert.ok(image.isFile(), `${filename} should be a file`);
    assert.ok(image.size > 0, `${filename} should not be empty`);
    assert.ok(image.size < 400_000, `${filename} should remain below 400 KB`);
  }

  for (const [, filename] of hormannModels) {
    const image = await stat(path.join(repoRoot, "public/mdc/gallery/hormann", filename));
    assert.ok(image.isFile(), `${filename} should be a file`);
    assert.ok(image.size > 0, `${filename} should not be empty`);
    assert.ok(image.size < 400_000, `${filename} should remain below 400 KB`);
  }
});

test("gallery has desktop, tablet, mobile, and reduced-motion styles", async () => {
  const css = await readFile(stylesheetPath, "utf8");

  assert.match(css, /\.gallery-images\s*{[^}]*grid-template-columns: repeat\(3, 1fr\)/s);
  assert.match(css, /@media \(max-width: 1020px\)[\s\S]*?\.gallery-images\s*{[^}]*grid-template-columns: repeat\(2, 1fr\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.gallery-images\s*{[^}]*grid-template-columns: 1fr/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition: none/);
});
