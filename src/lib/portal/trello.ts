import { getInternalPortalBoard, getPortalClient, stageShell, type PortalBoard, type PortalCard } from './data';

type TrelloList = {
  id: string;
  name: string;
  closed: boolean;
  pos: number;
};

type TrelloCard = {
  id: string;
  idList: string;
  name: string;
  desc: string;
  closed: boolean;
  dateLastActivity?: string;
  labels?: { name: string; color: string | null }[];
};

function hasTrelloConfig(clientId: string) {
  const client = getPortalClient(clientId);
  return Boolean(process.env.TRELLO_KEY && process.env.TRELLO_TOKEN && client?.trelloBoardId);
}

function normalizeStageName(name: string) {
  const value = name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  if (value.includes('discover')) return 'discovery';
  if (value.includes('building') || value.includes('doing') || value.includes('progress')) return 'building-now';
  if (value.includes('next') || value.includes('todo') || value.includes('backlog')) return 'up-next';
  if (value.includes('waiting') || value.includes('blocked') || value.includes('hold')) return 'waiting-blocked';

  return null;
}

function cardStatus(card: TrelloCard) {
  return card.labels?.find((label) => label.name)?.name || 'Active';
}

function cardDetail(card: TrelloCard) {
  const cleanDescription = card.desc?.trim();
  if (!cleanDescription) return 'No public update added yet.';

  const firstParagraph = cleanDescription.split(/\n\s*\n/)[0]?.trim();
  return firstParagraph || 'No public update added yet.';
}

async function trelloFetch<T>(path: string): Promise<T> {
  const key = process.env.TRELLO_KEY;
  const token = process.env.TRELLO_TOKEN;
  const url = new URL(`https://api.trello.com/1/${path}`);
  url.searchParams.set('key', key ?? '');
  url.searchParams.set('token', token ?? '');

  const response = await fetch(url, { next: { revalidate: 120 } });
  if (!response.ok) throw new Error(`Trello request failed: ${response.status}`);

  return response.json() as Promise<T>;
}

export async function getPortalBoard(clientId: string): Promise<PortalBoard | null> {
  if (!hasTrelloConfig(clientId)) return getInternalPortalBoard(clientId);

  const client = getPortalClient(clientId);
  if (!client?.trelloBoardId) return getInternalPortalBoard(clientId);

  try {
    const [lists, cards] = await Promise.all([
      trelloFetch<TrelloList[]>(`boards/${client.trelloBoardId}/lists?filter=open`),
      trelloFetch<TrelloCard[]>(`boards/${client.trelloBoardId}/cards?filter=open&fields=id,idList,name,desc,closed,dateLastActivity,labels`),
    ]);

    const listStageMap = new Map(
      lists
        .map((list) => [list.id, normalizeStageName(list.name)] as const)
        .filter(([, stageId]) => Boolean(stageId)),
    );

    const cardsByStage = cards.reduce<Record<string, PortalCard[]>>((grouped, card) => {
      const stageId = listStageMap.get(card.idList);
      if (!stageId || card.closed) return grouped;

      grouped[stageId] = grouped[stageId] ?? [];
      grouped[stageId].push({
        id: card.id,
        client: client.name,
        title: card.name,
        status: cardStatus(card),
        detail: cardDetail(card),
        updatedAt: card.dateLastActivity,
      });

      return grouped;
    }, {});

    return {
      client,
      source: 'trello',
      lastUpdated: new Date().toISOString(),
      stages: stageShell.map((stage) => ({
        ...stage,
        cards: cardsByStage[stage.id] ?? [],
      })),
      activity: [
        'Board synced from Trello.',
        'Only open cards in customer-safe lists are shown here.',
        'Descriptions should stay client-facing because they appear in the portal.',
      ],
    };
  } catch (error) {
    console.error('Portal Trello sync failed; falling back to internal board.', error);
    return getInternalPortalBoard(clientId);
  }
}
