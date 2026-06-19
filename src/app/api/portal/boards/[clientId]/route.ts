import { NextResponse } from 'next/server';
import { getPortalAdminSessionClientId } from '@/lib/portal/auth';
import { stagePortalClientNotification } from '@/lib/portal/notifications';
import { getPortalBoard } from '@/lib/portal/trello';
import { saveEditablePortalBoard } from '@/lib/portal/store';
import type { PortalBoard, PortalCard, PortalStage } from '@/lib/portal/data';

async function requireAdminSession() {
  const clientId = await getPortalAdminSessionClientId();
  return clientId === 'stoke-ai';
}

type RouteContext = {
  params: Promise<{ clientId: string }>;
};

function cleanCard(card: Partial<PortalCard>, clientName: string): PortalCard {
  return {
    id: String(card.id || `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
    client: clientName,
    title: String(card.title || '').trim() || 'Untitled priority',
    status: String(card.status || '').trim() || 'Active',
    detail: String(card.detail || '').trim() || 'Add the client-facing detail for this priority.',
    action: String(card.action || '').trim() || undefined,
  };
}

function cleanStages(stages: Partial<PortalStage>[] | undefined, fallback: PortalBoard): PortalStage[] {
  if (!Array.isArray(stages)) return fallback.stages;

  return fallback.stages.map((fallbackStage) => {
    const incoming = stages.find((stage) => stage.id === fallbackStage.id);
    return {
      ...fallbackStage,
      title: incoming?.title || fallbackStage.title,
      tone: incoming?.tone || fallbackStage.tone,
      cards: Array.isArray(incoming?.cards) ? incoming.cards.map((card) => cleanCard(card, fallback.client.name)) : [],
    };
  });
}

export async function GET(_request: Request, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Portal admin session required.' }, { status: 401 });
  }

  const { clientId } = await context.params;
  const board = await getPortalBoard(clientId);
  if (!board) return NextResponse.json({ error: 'Client board not found.' }, { status: 404 });

  return NextResponse.json({ board });
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: 'Portal admin session required.' }, { status: 401 });
  }

  const { clientId } = await context.params;
  const fallback = await getPortalBoard(clientId);
  if (!fallback) return NextResponse.json({ error: 'Client board not found.' }, { status: 404 });

  const body = (await request.json().catch(() => null)) as { stages?: Partial<PortalStage>[]; notifyClient?: boolean } | null;
  if (!body) return NextResponse.json({ error: 'Board payload is required.' }, { status: 400 });

  const board = await saveEditablePortalBoard({
    ...fallback,
    stages: cleanStages(body.stages, fallback),
  });

  const needsClientCards = board.stages.find((stage) => stage.id === 'waiting-blocked')?.cards || [];
  const notification = body.notifyClient
    ? await stagePortalClientNotification({
        clientId: board.client.id,
        type: needsClientCards.length > 0 ? 'action-required' : 'board-update',
        actionRequired: needsClientCards.length > 0,
        cardId: needsClientCards[0]?.id,
        cardTitle: needsClientCards[0]?.title,
      })
    : null;

  return NextResponse.json({ board, notification });
}
