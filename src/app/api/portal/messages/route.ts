import { NextResponse } from 'next/server';
import { getPortalAdminSessionClientId } from '@/lib/portal/auth';
import { stagePortalClientNotification } from '@/lib/portal/notifications';
import { listPortalMessages, updatePortalMessage, type PortalMessageStatus } from '@/lib/portal/store';

const validStatuses = new Set<PortalMessageStatus>(['new', 'seen', 'replied', 'converted', 'closed']);

async function requireAdminSession() {
  const clientId = await getPortalAdminSessionClientId();
  return clientId === 'stoke-ai';
}

export async function GET(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Portal admin session required.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId') || undefined;
  const messages = await listPortalMessages(clientId);
  return NextResponse.json({ messages });
}

export async function PATCH(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Portal admin session required.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    status?: PortalMessageStatus;
    blazeReply?: string;
    progressNote?: string;
  } | null;

  if (!body?.id) {
    return NextResponse.json({ error: 'Message id is required.' }, { status: 400 });
  }

  if (body.status && !validStatuses.has(body.status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }

  const message = await updatePortalMessage(body.id, {
    status: body.status,
    blazeReply: body.blazeReply,
    progressNote: body.progressNote,
  });

  if (!message) {
    return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
  }

  const notification = body.blazeReply?.trim()
    ? await stagePortalClientNotification({
        clientId: message.clientId,
        type: 'client-reply',
        actionRequired: false,
        messageId: message.id,
        cardId: message.cardId,
        cardTitle: message.cardTitle,
      })
    : body.progressNote?.trim()
      ? await stagePortalClientNotification({
          clientId: message.clientId,
          type: 'progress-note',
          actionRequired: false,
          messageId: message.id,
          cardId: message.cardId,
          cardTitle: message.cardTitle,
        })
      : null;

  return NextResponse.json({ message, notification });
}
