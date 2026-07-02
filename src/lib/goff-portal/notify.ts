// Email notifications for Goff portal events, via Resend.
// Telegram was a never-finished experiment from an earlier session; email is
// the channel Goff will actually use. Recipient defaults to Jeff until Goff
// routing is decided (GOFF_NOTIFY_EMAIL overrides).

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.PORTAL_EMAIL_FROM || 'portal@stoke-ai.com';
const TO = process.env.GOFF_NOTIFY_EMAIL || 'automate@stoke-ai.com';

export function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function sendGoffEmail(subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[goff-notify] RESEND_API_KEY not set — notification skipped:', subject);
    return false;
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `Goff Portal <${FROM}>`, to: [TO], subject, html }),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error('[goff-notify] Resend failed:', { status: response.status, body: body.slice(0, 400) });
    return false;
  }
  return true;
}
