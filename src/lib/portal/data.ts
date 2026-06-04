export type PortalCard = {
  id: string;
  client: string;
  title: string;
  status: string;
  detail: string;
  updatedAt?: string;
  action?: string;
};

export type PortalStage = {
  id: string;
  title: string;
  tone: string;
  cards: PortalCard[];
};

export type PortalClient = {
  id: string;
  name: string;
  contactEmail: string;
  headline: string;
  summary: string;
  trelloBoardId?: string;
};

export type PortalBoard = {
  client: PortalClient;
  stages: PortalStage[];
  activity: string[];
  source: 'internal' | 'trello';
  lastUpdated: string;
};

export const portalClients: PortalClient[] = [
  {
    id: 'austin-kevin',
    name: 'Austin & Kevin',
    contactEmail: 'portal@stoke-ai.com',
    headline: 'Austin & Kevin workspace',
    summary:
      'A simple place to see the first Stoke AI priorities, what is being organized now, what is waiting on your input, and what comes next.',
    trelloBoardId: process.env.TRELLO_AUSTIN_KEVIN_BOARD_ID,
  },
  {
    id: 'rachel-hansen',
    name: 'Rachel Hansen Agency',
    contactEmail: 'rachel@example.com',
    headline: 'Insurance renewal operating system',
    summary:
      'Live production work for renewal comparison, profile cards, queue cleanup, and the next automation layer.',
    trelloBoardId: process.env.TRELLO_RACHEL_BOARD_ID,
  },
  {
    id: 'handy-truck-lines',
    name: 'Handy Truck Lines',
    contactEmail: 'bryce@example.com',
    headline: 'Dispatching operating system',
    summary: 'Active dispatch software build focused on workflow visibility, load tracking, and handoff reliability.',
    trelloBoardId: process.env.TRELLO_HTL_BOARD_ID,
  },
  {
    id: 'stoke-ai',
    name: 'Stoke AI',
    contactEmail: 'automate@stoke-ai.com',
    headline: 'Internal portal and delivery system',
    summary: 'Internal customer portal work for project visibility, secure access, and client-ready roadmap updates.',
    trelloBoardId: process.env.TRELLO_STOKE_BOARD_ID,
  },
];

export const stageShell: Omit<PortalStage, 'cards'>[] = [
  {
    id: 'discovery',
    title: 'Discovery',
    tone: 'border-sky-500/30 bg-sky-500/10',
  },
  {
    id: 'building-now',
    title: 'Building Now',
    tone: 'border-orange-500/40 bg-orange-500/10',
  },
  {
    id: 'up-next',
    title: 'Up Next',
    tone: 'border-amber-500/35 bg-amber-500/10',
  },
  {
    id: 'waiting-blocked',
    title: 'Waiting / Blocked',
    tone: 'border-zinc-500/30 bg-zinc-500/10',
  },
];

const internalCards: Record<string, Record<string, PortalCard[]>> = {
  'austin-kevin': {
    discovery: [
      {
        id: 'ak-workspace-opened',
        client: 'Austin & Kevin',
        title: 'Client workspace opened',
        status: 'Ready',
        detail: 'This portal is the shared place for Stoke AI priorities, build ideas, decisions needed, and progress updates.',
        updatedAt: '2026-06-04',
      },
      {
        id: 'ak-operating-map',
        client: 'Austin & Kevin',
        title: 'Initial operating map',
        status: 'Starting point',
        detail: 'Capture the main workflows, handoffs, follow-ups, reports, and bottlenecks worth reviewing first.',
        action: 'Add the first 3-5 business bottlenecks you want Stoke AI to understand.',
      },
    ],
    'building-now': [
      {
        id: 'ak-build-queue',
        client: 'Austin & Kevin',
        title: 'First build queue setup',
        status: 'In progress',
        detail: 'Organize ideas into a practical queue so the first AI/system build is chosen intentionally instead of from scattered conversations.',
      },
      {
        id: 'ak-decision-rhythm',
        client: 'Austin & Kevin',
        title: 'Decision and request rhythm',
        status: 'In progress',
        detail: 'Create a simple pattern for what Stoke AI needs, what is waiting on the client, and where progress is visible.',
      },
    ],
    'up-next': [
      {
        id: 'ak-first-priority',
        client: 'Austin & Kevin',
        title: 'Choose the first systems priority',
        status: 'Next conversation',
        detail: 'Review the bottleneck list and select one high-leverage workflow to improve first.',
      },
      {
        id: 'ak-90-day-focus',
        client: 'Austin & Kevin',
        title: 'Draft the first 90-day focus',
        status: 'Planned',
        detail: 'Turn the first priorities into a clear near-term roadmap: current build, next build, decisions needed, and completed wins.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'ak-client-input',
        client: 'Austin & Kevin',
        title: 'First client inputs',
        status: 'Waiting on input',
        detail: 'Stoke AI needs a short list of the first workflows or recurring tasks that feel most annoying, slow, or hard to track.',
        action: 'Send examples, screenshots, forms, spreadsheets, or a quick explanation of the workflow.',
      },
    ],
  },
  'rachel-hansen': {
    discovery: [
      {
        id: 'rh-discovery-renewals',
        client: 'Rachel Hansen Agency',
        title: 'Renewal workflow review',
        status: 'Complete',
        detail: 'Mapped the live renewal prep process and identified the next automation bottlenecks.',
        updatedAt: '2026-05-08',
      },
    ],
    'building-now': [
      {
        id: 'rh-profile-cards',
        client: 'Rachel Hansen Agency',
        title: 'Profile card + queue system',
        status: 'In progress',
        detail: 'Improving the customer/account view and reducing manual cleanup in the live card workflow.',
        updatedAt: '2026-05-14',
      },
      {
        id: 'rh-pipedrive-files',
        client: 'Rachel Hansen Agency',
        title: 'PipeDrive file delivery',
        status: 'In progress',
        detail: 'Making generated client files easier to place, review, and reuse inside the sales workflow.',
        updatedAt: '2026-05-14',
      },
    ],
    'up-next': [
      {
        id: 'rh-queue-less-manual',
        client: 'Rachel Hansen Agency',
        title: 'Less manual queue resolution',
        status: 'Next sprint',
        detail: 'Turn repeated cleanup decisions into reusable automation rules so the queue needs less human handling.',
        action: 'Review edge cases when prompted.',
      },
      {
        id: 'rh-bap-cargo',
        client: 'Rachel Hansen Agency',
        title: 'BAP / CPP cargo reconciliation report',
        status: 'Planned',
        detail: 'Combine the commercial cargo checks into one customer-ready review report.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'rh-bop-samples',
        client: 'Rachel Hansen Agency',
        title: 'More BOP sample PDFs',
        status: 'Waiting on samples',
        detail: 'More real policy samples are needed before BOP extraction can be made reliable.',
        action: 'Send representative BOP PDFs when available.',
      },
    ],
  },
  'handy-truck-lines': {
    discovery: [
      {
        id: 'htl-discovery',
        client: 'Handy Truck Lines',
        title: 'Dispatch workflow shape',
        status: 'Complete',
        detail: 'Outlined the core dispatching workflow, load visibility needs, and handoff points.',
      },
    ],
    'building-now': [
      {
        id: 'htl-foundation',
        client: 'Handy Truck Lines',
        title: 'Dispatching operating system foundation',
        status: 'In progress',
        detail: 'Building the base workflow for loads, drivers, dispatch visibility, and operational handoffs.',
      },
    ],
    'up-next': [
      {
        id: 'htl-server-delivery',
        client: 'Handy Truck Lines',
        title: 'Bryce server delivery path',
        status: 'Next sprint',
        detail: 'Prepare the deployment handoff from GitHub into Bryce’s server environment.',
      },
    ],
    'waiting-blocked': [],
  },
  'stoke-ai': {
    discovery: [
      {
        id: 'portal-shell',
        client: 'Stoke AI',
        title: 'Client portal shell',
        status: 'Complete',
        detail: 'Created the first customer-facing portal screen with a clean project-board layout.',
      },
    ],
    'building-now': [
      {
        id: 'portal-auth-data',
        client: 'Stoke AI',
        title: 'Login + board data layer',
        status: 'In progress',
        detail: 'Connecting the portal to client-specific authenticated data instead of hardcoded page content.',
      },
    ],
    'up-next': [
      {
        id: 'portal-trello',
        client: 'Stoke AI',
        title: 'Trello sync',
        status: 'Ready for credentials',
        detail: 'Use Trello board/list/card data when API credentials and board IDs are configured.',
        action: 'Add Trello API key, token, and board IDs to production env.',
      },
    ],
    'waiting-blocked': [],
  },
};

export function getPortalClient(clientId: string | undefined | null) {
  return portalClients.find((client) => client.id === clientId) ?? null;
}

export function getInternalPortalBoard(clientId: string): PortalBoard | null {
  const client = getPortalClient(clientId);
  if (!client) return null;

  const cardsByStage = internalCards[clientId] ?? {};

  return {
    client,
    source: 'internal',
    lastUpdated: new Date().toISOString(),
    stages: stageShell.map((stage) => ({
      ...stage,
      cards: cardsByStage[stage.id] ?? [],
    })),
    activity: [
      `${client.name} portal opened with authenticated client-specific visibility.`,
      'Board cards are now loaded from the portal data layer instead of hardcoded page content.',
      'Trello sync is ready to activate once credentials and board IDs are added to the environment.',
    ],
  };
}
