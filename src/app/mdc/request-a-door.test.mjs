import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const pagePath = path.join(repoRoot, "src/app/mdc/request-a-door/page.tsx");
const formPath = path.join(repoRoot, "src/app/mdc/_components/RequestDoorForm.tsx");
const galleryPath = path.join(repoRoot, "src/app/mdc/gallery/page.tsx");
const servicePagePath = path.join(repoRoot, "src/app/mdc/_components/ServicePage.tsx");
const servicesPath = path.join(repoRoot, "src/app/mdc/_data/services.ts");
const apiPath = path.join(repoRoot, "src/app/api/mdc-quote/route.ts");
const quoteFormPath = path.join(repoRoot, "src/app/mdc/_components/QuoteForm.tsx");

test("dedicated request-a-door page offers a Home or Business first choice", async () => {
  const [pageFile, page, form] = await Promise.all([
    stat(pagePath),
    readFile(pagePath, "utf8"),
    readFile(formPath, "utf8"),
  ]);

  assert.ok(pageFile.isFile());
  assert.match(page, /RequestDoorForm/);
  assert.match(page, /home or business/i);
  assert.match(form, /name="buildingType"/);
  assert.match(form, /value="home"/);
  assert.match(form, /value="business"/);
  assert.match(form, /formType.*door-request/);
});

test("door request collects Braxton's door and contact fields", async () => {
  const form = await readFile(formPath, "utf8");

  for (const field of ["size", "opener", "obstruction", "color", "panelStyle", "windows", "style", "glassType", "name", "phone", "email", "location", "details", "website"]) {
    assert.match(form, new RegExp(`name=["']${field}["']`), `${field} should be present`);
  }
  assert.match(form, /8x7/);
  assert.match(form, /18x7/);
  assert.match(form, /10x10/);
  assert.match(form, /16x16/);
  assert.match(form, /Traditional/);
  assert.match(form, /Rolling steel/);
  assert.match(form, /photoBase64/);
  assert.match(form, /Maximum 3 MB/);
});

test("gallery and installation route new-door shoppers to the dedicated page", async () => {
  const [gallery, servicePage, services] = await Promise.all([
    readFile(galleryPath, "utf8"),
    readFile(servicePagePath, "utf8"),
    readFile(servicesPath, "utf8"),
  ]);

  assert.match(gallery, /href="\/mdc\/request-a-door">Request a door/);
  assert.match(servicePage, /quoteHref\?: string/);
  assert.match(servicePage, /data\.quoteHref \?\? "\/mdc\/free-quote"/);
  const installation = services.match(/export const installation:[\s\S]*?export const repair:/)?.[0] ?? "";
  assert.match(installation, /quoteHref: "\/mdc\/request-a-door"/);
  assert.match(installation, /quoteLabel: "Request a Door"/);
});

test("the shared quote API copies Braxton and preserves the compact QuoteForm path", async () => {
  const [api, quoteForm] = await Promise.all([
    readFile(apiPath, "utf8"),
    readFile(quoteFormPath, "utf8"),
  ]);

  assert.match(api, /braxton@mdcidaho\.com/);
  assert.match(api, /formType === "door-request"/);
  assert.match(api, /looksLikePhoto/);
  assert.match(api, /attachments: attachment \? \[attachment\] : undefined/);
  assert.match(quoteForm, /fetch\("\/api\/mdc-quote"/);
  assert.match(quoteForm, /compact \? "quote-form compact-form"/);
  assert.match(quoteForm, /name="service"/);
});

test("door request labels follow Braxton's size, obstruction, color, panel, windows, style, and glass list", async () => {
  const form = await readFile(formPath, "utf8");

  assert.match(form, /Size\n\s*<select name="size"/);
  assert.match(form, /Floor to lowest obstruction/);
  assert.match(form, /Color\n\s*<select name="color"/);
  assert.match(form, /Need an opener/);
  assert.match(form, /name="opener"/);
  assert.match(form, /panel-style-fieldset/);
  assert.match(form, /name="panelStyle"/);
  assert.match(form, /panel-style-photo/);
  assert.match(form, /Windows or no windows/);
  assert.match(form, /Door style\n\s*<select name="style"/);
  assert.match(form, /Glass type\n\s*<select name="glassType"/);
  assert.match(form, /setColor\(""\)/);
  assert.match(form, /setPanelStyle\(""\)/);
  assert.doesNotMatch(form, /high lift|WebConnect|Aspen AP200C/i);
});

test("customer-facing product claims name both Raynor and Hörmann", async () => {
  const homepagePath = path.join(repoRoot, "src/app/mdc/MorganDoorDemo.tsx");
  const aboutPath = path.join(repoRoot, "src/app/mdc/about/page.tsx");
  const quotePath = path.join(repoRoot, "src/app/mdc/free-quote/page.tsx");
  const installMetaPath = path.join(repoRoot, "src/app/mdc/garage-door-installation/page.tsx");
  const [homepage, servicePage, services, about, quote, installMeta] = await Promise.all([
    readFile(homepagePath, "utf8"),
    readFile(servicePagePath, "utf8"),
    readFile(servicesPath, "utf8"),
    readFile(aboutPath, "utf8"),
    readFile(quotePath, "utf8"),
    readFile(installMetaPath, "utf8"),
  ]);

  for (const [name, source] of [
    ["homepage", homepage],
    ["service page", servicePage],
    ["installation copy", services],
    ["about", about],
    ["free quote", quote],
    ["installation meta", installMeta],
  ]) {
    assert.match(source, /Raynor/, `${name} should still name Raynor`);
    assert.match(source, /Hörmann/, `${name} should name Hörmann alongside Raynor`);
  }
  assert.doesNotMatch(homepage, /<strong>Raynor<\/strong>/);
  assert.doesNotMatch(servicePage, /<strong>Raynor<\/strong>/);
  assert.doesNotMatch(services, /title: "Raynor quality"/);
  assert.doesNotMatch(quote, /Raynor installation partner/);
  assert.doesNotMatch(about, /Raynor partner/);
});
