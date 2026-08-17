"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { phoneDisplay, phoneHref } from "./MdcChrome";

type BuildingType = "home" | "business";
type OpenerChoice = "yes" | "no";
type State = "idle" | "sending" | "success" | "error";
type PanelOption = {
  name: string;
  image?: string;
};

const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const options = {
  home: {
    sizes: ["8x7", "8x8", "9x7", "9x8", "10x7", "10x8", "12x7", "12x8", "16x7", "16x8", "18x7", "18x8"],
    colors: ["White", "Almond", "Sandstone", "Brown", "Black", "Not sure / other"],
    panels: [
      { name: "Raised panel", image: "/mdc/gallery/trademark.webp" },
      { name: "Flush panel", image: "/mdc/gallery/ap200n.webp" },
      { name: "Carriage-house look", image: "/mdc/gallery/revival-wood.webp" },
      { name: "Ribbed panel" },
      { name: "Not sure" },
    ] satisfies PanelOption[],
    styles: ["Traditional", "Carriage house", "Modern", "Not sure"],
  },
  business: {
    sizes: ["8x8", "10x8", "10x10", "10x12", "12x10", "12x12", "12x14", "14x12", "14x14", "16x12", "16x14", "16x16", "18x14", "18x16", "20x14", "20x16", "24x14", "24x16"],
    colors: ["White", "Almond", "Sandstone", "Gray", "Tan", "Brown", "Black", "Not sure / other"],
    panels: [
      { name: "Flush panel", image: "/mdc/gallery/hormann/modern-tech-3550.webp" },
      { name: "Ribbed panel" },
      { name: "Insulated panel", image: "/mdc/gallery/hormann/therma-tech-3400.webp" },
      { name: "Full-view glass", image: "/mdc/gallery/hormann/luma-classic-7400.webp" },
      { name: "Not sure" },
    ] satisfies PanelOption[],
    styles: ["Sectional overhead", "Rolling steel", "Not sure"],
  },
} as const;

function inferredPhotoType(file: File) {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "heic") return "image/heic";
  if (extension === "heif") return "image/heif";
  return "";
}

async function toBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

export default function RequestDoorForm() {
  const [buildingType, setBuildingType] = useState<BuildingType | "">("");
  const [opener, setOpener] = useState<OpenerChoice | "">("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [panelStyle, setPanelStyle] = useState("");
  const [style, setStyle] = useState("");
  const [windows, setWindows] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  function resetChoices() {
    setOpener("");
    setSize("");
    setColor("");
    setPanelStyle("");
    setStyle("");
    setWindows("");
  }

  function chooseBuilding(nextType: BuildingType) {
    setBuildingType(nextType);
    resetChoices();
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const nextPhoto = event.target.files?.[0] ?? null;
    setPhotoError("");
    setPhoto(null);

    if (!nextPhoto) return;
    const type = inferredPhotoType(nextPhoto);
    if (!PHOTO_TYPES.includes(type)) {
      setPhotoError("Please choose a JPG, PNG, WebP, or HEIC image.");
      event.target.value = "";
      return;
    }
    if (nextPhoto.size > MAX_PHOTO_BYTES) {
      setPhotoError("Please choose an image smaller than 3 MB.");
      event.target.value = "";
      return;
    }
    setPhoto(nextPhoto);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.delete("photo");
    const payload: Record<string, FormDataEntryValue> = Object.fromEntries(formData.entries());

    try {
      if (photo) {
        payload.photoName = photo.name;
        payload.photoType = inferredPhotoType(photo);
        payload.photoBase64 = await toBase64(photo);
      }

      const response = await fetch("/api/mdc-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not send your request.");
      form.reset();
      setBuildingType("");
      resetChoices();
      setPhoto(null);
      setState("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send your request.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="success" role="status">
        <div className="success-mark">✓</div>
        <p className="quote-kicker">We got it</p>
        <h2>Your door request reached Morgan Door.</h2>
        <p>A local team member will review the details and follow up. If you need to add something right away, call the shop.</p>
        <a className="button button-form" href={phoneHref}>Call {phoneDisplay}</a>
        <button className="text-button" type="button" onClick={() => setState("idle")}>Request another door</button>
      </div>
    );
  }

  const selectedOptions = buildingType ? options[buildingType] : null;

  return (
    <form className="quote-form door-request-form" onSubmit={submit}>
      <input type="hidden" name="formType" value="door-request" />
      <label className="hp-field" aria-hidden="true">
        Company website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <fieldset className="door-type-fieldset">
        <legend>Is this door for a home or a business?</legend>
        <p>Choose one to see the right door options.</p>
        <div className="door-type-choice">
          <label className={buildingType === "home" ? "door-type-card selected" : "door-type-card"}>
            <input name="buildingType" type="radio" value="home" required checked={buildingType === "home"} onChange={() => chooseBuilding("home")} />
            <span><strong>Home</strong><small>Garage, shop, or new home</small></span>
          </label>
          <label className={buildingType === "business" ? "door-type-card selected" : "door-type-card"}>
            <input name="buildingType" type="radio" value="business" required checked={buildingType === "business"} onChange={() => chooseBuilding("business")} />
            <span><strong>Business</strong><small>Commercial, farm, or overhead door</small></span>
          </label>
        </div>
      </fieldset>

      {selectedOptions && (
        <div className="door-request-fields">
          <fieldset className="door-type-fieldset opener-fieldset">
            <legend>Do you want an opener?</legend>
            <p>Yes or no. We can check an existing opener later if needed.</p>
            <div className="door-type-choice">
              <label className={opener === "yes" ? "door-type-card selected" : "door-type-card"}>
                <input name="opener" type="radio" value="yes" required checked={opener === "yes"} onChange={() => setOpener("yes")} />
                <span><strong>Yes</strong><small>Include an opener</small></span>
              </label>
              <label className={opener === "no" ? "door-type-card selected" : "door-type-card"}>
                <input name="opener" type="radio" value="no" required checked={opener === "no"} onChange={() => setOpener("no")} />
                <span><strong>No</strong><small>Door only</small></span>
              </label>
            </div>
          </fieldset>

          <div className="field-row">
            <label>
              Size
              <select name="size" value={size} onChange={(event) => setSize(event.target.value)} required>
                <option value="" disabled>Select a size</option>
                {selectedOptions.sizes.map((option) => <option key={option}>{option}</option>)}
                <option value="other">Not sure / other</option>
              </select>
            </label>
            {size === "other" && (
              <label>
                Size, if you know it <span className="optional">(optional)</span>
                <input name="sizeOther" placeholder="About 11 feet wide" />
              </label>
            )}
          </div>

          <label>
            Floor to lowest obstruction <span className="optional">(optional)</span>
            <input name="obstruction" placeholder="About 10 feet" />
            <small className="field-help">From the floor up to the ceiling, a beam, or a light. A guess is fine.</small>
          </label>

          <label>
            Color
            <select name="color" value={color} onChange={(event) => setColor(event.target.value)} required>
              <option value="" disabled>Select a color</option>
              {selectedOptions.colors.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>

          <fieldset className="door-type-fieldset panel-style-fieldset">
            <legend>Panel style</legend>
            <p>Pick a look. A picture shows the style when we have one.</p>
            <div className="panel-style-choice">
              {selectedOptions.panels.map((option) => (
                <label key={option.name} className={panelStyle === option.name ? "panel-style-card selected" : "panel-style-card"}>
                  <input name="panelStyle" type="radio" value={option.name} required checked={panelStyle === option.name} onChange={() => setPanelStyle(option.name)} />
                  {option.image ? (
                    <img src={option.image} alt={option.name} />
                  ) : (
                    <span className="panel-style-placeholder">No photo yet</span>
                  )}
                  <span className="panel-style-name">{option.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field-row">
            <label>
              Windows or no windows?
              <select name="windows" value={windows} onChange={(event) => setWindows(event.target.value)} required>
                <option value="" disabled>Select one</option>
                <option value="windows">Windows</option>
                <option value="no-windows">No windows</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>
            <label>
              Door style
              <select name="style" value={style} onChange={(event) => setStyle(event.target.value)} required>
                <option value="" disabled>Select a style</option>
                {selectedOptions.styles.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          {windows === "windows" && (
            <label>
              Glass type
              <select name="glassType" defaultValue="" required>
                <option value="" disabled>Select glass</option>
                <option>Clear</option>
                <option>Frosted / privacy</option>
                <option>Tinted</option>
                <option>Not sure</option>
              </select>
            </label>
          )}

          <div className="form-divider"><span>How should Morgan Door reach you?</span></div>
          <div className="field-row">
            <label>
              Name
              <input name="name" autoComplete="name" placeholder="Your name" required />
            </label>
            <label>
              City or ZIP
              <input name="location" autoComplete="postal-code" placeholder="Burley" required />
            </label>
          </div>
          <div className="field-row">
            <label>
              Mobile phone
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(208) 555-0000" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </label>
          </div>
          <label>
            Anything else we should know? <span className="optional">(optional)</span>
            <textarea name="details" rows={4} placeholder="New construction, replacing an old door, timing, or anything else..." />
          </label>
          <label>
            Add one photo <span className="optional">(optional)</span>
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" onChange={choosePhoto} />
            <small className="field-help">JPG, PNG, WebP, or HEIC. Maximum 3 MB.</small>
          </label>
          {photoError && <p className="form-error" role="alert">{photoError}</p>}

          <button className="button button-form" type="submit" disabled={state === "sending" || Boolean(photoError)}>
            {state === "sending" ? "Sending…" : "Send My Door Request"}
          </button>
          {state === "error" && <p className="form-error" role="alert">{error} Please call <a href={phoneHref}>{phoneDisplay}</a>.</p>}
          <p className="form-note">No obligation. Your information is used only to respond to this request.</p>
        </div>
      )}
    </form>
  );
}
