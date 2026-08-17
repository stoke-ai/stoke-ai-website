import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECIPIENT = process.env.MDC_QUOTE_RECIPIENT || "jeff@stoke-ai.com";
const BRAXTON_RECIPIENT = "braxton@mdcidaho.com";
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

function clean(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[character] || character));
}

function looksLikePhoto(base64: string, type: string) {
  const header = Buffer.from(base64.slice(0, 64), "base64");
  if (type === "image/jpeg") return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  if (type === "image/png") return header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === "image/webp") return header.subarray(0, 4).toString("ascii") === "RIFF" && header.subarray(8, 12).toString("ascii") === "WEBP";
  if (type === "image/heic" || type === "image/heif") return header.subarray(4, 8).toString("ascii") === "ftyp";
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (clean(body.website)) return NextResponse.json({ success: true });

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 180);
    const location = clean(body.location, 100);
    const formType = clean(body.formType, 40);
    const isDoorRequest = formType === "door-request";
    const buildingType = clean(body.buildingType, 20);
    const buildingLabel = buildingType === "home" ? "Home" : buildingType === "business" ? "Business" : "";
    const service = clean(body.service, 120) || (buildingType === "home" ? "New residential door" : buildingType === "business" ? "Commercial / overhead door" : "");
    const details = clean(body.details || body.notes, 2000);
    const urgent = clean(body.urgent, 10) === "yes";
    const size = clean(body.size, 80);
    const sizeOther = clean(body.sizeOther, 120);
    const obstruction = clean(body.obstruction, 160);
    const color = clean(body.color, 100);
    const panelStyle = clean(body.panelStyle, 100);
    const windows = clean(body.windows, 60);
    const style = clean(body.style, 100);
    const glassType = clean(body.glassType, 100);
    const opener = clean(body.opener, 20);

    if (!name || !phone || !location || (isDoorRequest ? !buildingLabel : !service)) {
      return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
    }
    if (!/^[+\d().\-\s]{7,24}$/.test(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!RESEND_API_KEY) {
      console.error("MDC quote delivery is missing RESEND_API_KEY");
      return NextResponse.json({ error: "Online requests are temporarily unavailable." }, { status: 503 });
    }

    let attachment: { filename: string; content: string } | undefined;
    const photoName = clean(body.photoName, 180).replace(/[^a-zA-Z0-9._ -]/g, "_");
    const photoType = clean(body.photoType, 80).toLowerCase();
    const photoBase64 = typeof body.photoBase64 === "string" ? body.photoBase64.trim() : "";
    if (photoName || photoType || photoBase64) {
      const decodedBytes = Math.floor((photoBase64.length * 3) / 4) - (photoBase64.endsWith("==") ? 2 : photoBase64.endsWith("=") ? 1 : 0);
      const validBase64 = /^[a-zA-Z0-9+/]+={0,2}$/.test(photoBase64);
      if (!photoName || !PHOTO_TYPES.has(photoType) || !validBase64 || decodedBytes <= 0 || decodedBytes > MAX_PHOTO_BYTES || !looksLikePhoto(photoBase64, photoType)) {
        return NextResponse.json({ error: "Please attach a JPG, PNG, WebP, or HEIC image smaller than 3 MB." }, { status: 400 });
      }
      attachment = { filename: photoName, content: photoBase64 };
    }

    const subject = isDoorRequest
      ? `Morgan Door request: ${buildingLabel} door in ${location}`
      : `${urgent ? "URGENT — " : ""}Morgan Door quote: ${service} in ${location}`;
    const doorFields = isDoorRequest ? `
        <p><strong>Building:</strong> ${escapeHtml(buildingLabel)}</p>
        <p><strong>Opener:</strong> ${escapeHtml(opener === "yes" ? "Yes" : opener === "no" ? "No" : opener === "not-sure" ? "Not sure" : opener || "Not provided")}</p>
        <p><strong>Opening size:</strong> ${escapeHtml(size === "other" ? sizeOther || "Not sure / other" : size || "Not provided")}</p>
        <p><strong>Floor to lowest obstruction:</strong> ${escapeHtml(obstruction || "Not provided")}</p>
        <p><strong>Color:</strong> ${escapeHtml(color || "Not provided")}</p>
        <p><strong>Panel style:</strong> ${escapeHtml(panelStyle || "Not provided")}</p>
        <p><strong>Windows:</strong> ${escapeHtml(windows || "Not provided")}</p>
        <p><strong>Door style:</strong> ${escapeHtml(style || "Not provided")}</p>
        <p><strong>Glass type:</strong> ${escapeHtml(glassType || "Not selected")}</p>
        <p><strong>Photo:</strong> ${attachment ? escapeHtml(photoName) : "Not attached"}</p>` : "";
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;color:#17202a">
        <h1 style="color:#0d2740">New Morgan Door ${isDoorRequest ? "door" : "quote"} request</h1>
        <p><strong>Urgent:</strong> ${urgent ? "YES — call promptly" : "No"}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
        <p><strong>City / ZIP:</strong> ${escapeHtml(location)}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        ${doorFields}
        <p><strong>Details:</strong><br>${escapeHtml(details || "No details provided").replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#667">Submitted from the Morgan Door concept at stoke-ai.com/mdc on ${new Date().toISOString()}.</p>
      </div>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Morgan Door Website <spark@stoke-ai.com>",
        to: Array.from(new Set([RECIPIENT, BRAXTON_RECIPIENT])),
        reply_to: email || undefined,
        subject,
        html,
        attachments: attachment ? [attachment] : undefined,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("MDC quote email failed", result);
      return NextResponse.json({ error: "We could not deliver the request." }, { status: 502 });
    }

    return NextResponse.json({ success: true, requestId: result.id });
  } catch (error) {
    console.error("MDC quote error", error);
    return NextResponse.json({ error: "We could not process the request." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Morgan Door quote endpoint active", deliveryConfigured: Boolean(RESEND_API_KEY) });
}
