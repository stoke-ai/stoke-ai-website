import { NextRequest, NextResponse } from 'next/server';
import { sendGoffEmailTo, escapeHtml } from '@/lib/goff-portal/notify';
import { getPortalSessionClientId } from '@/lib/portal/auth';

// Sends the generated offer letter to the candidate as an email attachment.
// Gmail compose URLs can't carry attachments, so this is the real in-portal
// send path. Until goffwelding.com is domain-verified with Resend it goes out
// from the stoke-ai.com portal sender with reply-to careers@goffwelding.com;
// after DNS lands the sender flips via GOFF_EMAIL_FROM.

const REPLY_TO = process.env.GOFF_OFFER_REPLY_TO || 'careers@goffwelding.com';

async function authorized(): Promise<boolean> {
  if (process.env.GOFF_RECRUITING_REQUIRE_AUTH !== 'true') return true;
  const clientId = await getPortalSessionClientId().catch(() => null);
  return clientId === 'goff-admin';
}

export async function POST(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const body = await request.json().catch(() => null);
    const to = String(body?.to || '').trim().slice(0, 200);
    const candidate = String(body?.candidate || '').trim().slice(0, 160);
    const role = String(body?.role || '').trim().slice(0, 160);
    const message = String(body?.message || '').trim().slice(0, 8000);
    const attachment = String(body?.attachment || ''); // base64 .doc
    const filename = String(body?.filename || 'goff-offer-letter.doc').replace(/[^\w.-]/g, '-').slice(0, 120);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return NextResponse.json({ error: 'Valid candidate email required.' }, { status: 400 });
    if (!attachment || attachment.length < 100) return NextResponse.json({ error: 'Offer letter attachment missing.' }, { status: 400 });
    if (attachment.length > 2_000_000) return NextResponse.json({ error: 'Attachment too large.' }, { status: 400 });

    const html = [
      `<p>Hi ${escapeHtml(candidate.split(' ')[0] || 'there')},</p>`,
      `<p>${escapeHtml(message) || `Congratulations! Attached is your official offer letter from Goff Welding for the <strong>${escapeHtml(role)}</strong> position. Please review, sign, and return it — and reply to this email with any questions.`}</p>`,
      `<p>We're excited to have you join the team.</p>`,
      `<p>Goff Welding Hiring Team<br>531 W 100 S #24, Paul, ID 83347<br>(208) 647-2488</p>`,
    ].join('\n');

    // Vercel freezes the function when the response returns — await the send.
    const ok = await sendGoffEmailTo(to, `Your Offer Letter — Goff Welding${role ? ` (${role})` : ''}`, html, {
      replyTo: REPLY_TO,
      attachments: [{ filename, content: attachment }],
    });
    if (!ok) return NextResponse.json({ error: 'Email service unavailable — download the letter and send it from Gmail instead.' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[goff-offer-email] send failed:', err);
    return NextResponse.json({ error: 'Could not send the offer email.' }, { status: 500 });
  }
}
