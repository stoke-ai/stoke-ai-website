import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const componentPath = path.join(repoRoot, "src/app/mdc/MorganDoorDemo.tsx");
const stylesheetPath = path.join(repoRoot, "src/app/mdc/mdc.css");

const models = [
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

test("gallery lists every approved Raynor Design Center model with a caption", async () => {
  const component = await readFile(componentPath, "utf8");

  for (const [name, filename] of models) {
    assert.match(component, new RegExp(`name: ["“]${name}["”]`));
    assert.match(component, new RegExp(`/mdc/gallery/${filename}`));
  }

  assert.equal((component.match(/line: /g) ?? []).length, models.length);
  assert.match(component, /alt={`\$\{door\.name\} garage door shown on a home`}/);
  assert.match(component, /href="\/mdc\/free-quote">Get a door quote/);
});

test("all gallery images are local, compressed WebP assets", async () => {
  for (const [, filename] of models) {
    const image = await stat(path.join(repoRoot, "public/mdc/gallery", filename));
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
