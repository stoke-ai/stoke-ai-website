import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECIPIENT = process.env.MDC_QUOTE_RECIPIENT || "jeff@stoke-ai.com";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (clean(body.website)) return NextResponse.json({ success: true });

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 180);
    const location = clean(body.location, 100);
    const service = clean(body.service, 120);
    const details = clean(body.details, 2000);
    const urgent = clean(body.urgent, 10) === "yes";

    if (!name || !phone || !location || !service) {
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

    const subject = `${urgent ? "URGENT — " : ""}Morgan Door quote: ${service} in ${location}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;color:#17202a">
        <h1 style="color:#0d2740">New Morgan Door quote request</h1>
        <p><strong>Urgent:</strong> ${urgent ? "YES — call promptly" : "No"}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
        <p><strong>City / ZIP:</strong> ${escapeHtml(location)}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        <p><strong>Details:</strong><br>${escapeHtml(details || "No details provided").replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#667">Submitted from the Morgan Door concept at stoke-ai.com/mdc on ${new Date().toISOString()}.</p>
      </div>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Morgan Door Website <spark@stoke-ai.com>",
        to: [RECIPIENT],
        reply_to: email || undefined,
        subject,
        html,
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
