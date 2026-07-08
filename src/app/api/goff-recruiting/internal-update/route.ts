import { NextRequest, NextResponse } from 'next/server';
import { escapeHtml, sendGoffEmailTo } from '@/lib/goff-portal/notify';

const INTERNAL_RECIPIENT = 'careers@goffwelding.com';

function clean(value: unknown, max = 300) {
  return String(value ?? '').trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const candidate = body?.candidate && typeof body.candidate === 'object' ? body.candidate : {};
    const decision = body?.decision && typeof body.decision === 'object' ? body.decision : {};

    const name = clean(candidate.name || `${clean(candidate.first, 80)} ${clean(candidate.last, 80)}`.trim(), 180);
    const role = clean(candidate.role, 180);
    const email = clean(candidate.email, 200);
    const phone = clean(candidate.phone, 80);
    const fromStage = clean(candidate.fromStage || candidate.stage, 160);
    const toStage = clean(decision.stage || candidate.toStage, 160);
    const nextStep = clean(decision.label || decision.nextStep, 160);
    const note = clean(decision.note, 600);

    if (!name || !role || !toStage || !nextStep) {
      return NextResponse.json({ error: 'Missing candidate name, role, or next step.' }, { status: 400 });
    }

    const subject = `Goff recruiting update: ${name} → ${nextStep}`;
    const html = [
      `<h2 style="margin:0 0 12px">Goff recruiting next step</h2>`,
      `<p><b>Candidate:</b> ${escapeHtml(name)}</p>`,
      `<p><b>Role:</b> ${escapeHtml(role)}</p>`,
      email ? `<p><b>Email:</b> ${escapeHtml(email)}</p>` : '',
      phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : '',
      `<p><b>Previous stage:</b> ${escapeHtml(fromStage || 'Not recorded')}</p>`,
      `<p><b>Selected next step:</b> ${escapeHtml(nextStep)}</p>`,
      `<p><b>New stage:</b> ${escapeHtml(toStage)}</p>`,
      note ? `<blockquote style="border-left:4px solid #c0182b;margin:16px 0;padding:8px 14px;background:#f7f7f7">${escapeHtml(note)}</blockquote>` : '',
      `<p style="color:#666;font-size:13px">Automatic routine update from the Goff recruiting portal.</p>`,
    ].filter(Boolean).join('\n');

    const ok = await sendGoffEmailTo(INTERNAL_RECIPIENT, subject, html);
    if (!ok) return NextResponse.json({ error: 'Email notification unavailable.' }, { status: 502 });
    return NextResponse.json({ ok: true, to: INTERNAL_RECIPIENT });
  } catch (err) {
    console.error('[goff-recruiting] internal update failed:', err);
    return NextResponse.json({ error: 'Could not send internal update.' }, { status: 500 });
  }
}
