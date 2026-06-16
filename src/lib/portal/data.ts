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
  username: string;
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
    username: 'austin-kevin',
    name: 'Austin & Kevin',
    contactEmail: 'portal@stoke-ai.com',
    headline: 'Austin & Kevin workspace',
    summary:
      'A simple place to see the first Stoke AI priorities, what is being organized now, what is waiting on your input, and what comes next.',
    trelloBoardId: process.env.TRELLO_AUSTIN_KEVIN_BOARD_ID,
  },
  {
    id: 'goff-welding',
    username: 'goff',
    name: 'Goff Welding',
    contactEmail: 'portal@stoke-ai.com',
    headline: 'Goff Welding workspace',
    summary:
      'A simple private workspace for the first Stoke AI priorities: requests, estimates, follow-ups, scheduling, team questions, and what Jeff needs next.',
    trelloBoardId: process.env.TRELLO_GOFF_BOARD_ID,
  },
  {
    id: 'rachel-hansen',
    username: 'rachel',
    name: 'Rachel Hansen Agency',
    contactEmail: 'rachel@example.com',
    headline: 'Insurance renewal operating system',
    summary:
      'Live production work for renewal comparison, profile cards, queue cleanup, and the next automation layer.',
    trelloBoardId: process.env.TRELLO_RACHEL_BOARD_ID,
  },
  {
    id: 'handy-truck-lines',
    username: 'handytruck',
    name: 'Handy Truck Lines',
    contactEmail: 'bryce@example.com',
    headline: 'Dispatching operating system',
    summary: 'Active dispatch software build focused on workflow visibility, load tracking, and handoff reliability.',
    trelloBoardId: process.env.TRELLO_HTL_BOARD_ID,
  },
  {
    id: 'stoke-ai',
    username: 'jeff',
    name: 'Stoke-AI',
    contactEmail: 'automate@stoke-ai.com',
    headline: 'Stoke-AI internal workspace',
    summary: 'A working sample of how client priorities, active builds, decisions needed, and completed wins can look inside the Stoke AI portal.',
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
  'goff-welding': {
    discovery: [
      {
        id: 'gw-workspace-opened',
        client: 'Goff Welding',
        title: 'Private workspace opened',
        status: 'Ready',
        detail: 'This is the shared place for Stoke AI work: what Jeff is building, what the Goff team needs to send, and what is coming next.',
      },
      {
        id: 'gw-current-process-map',
        client: 'Goff Welding',
        title: 'Current request-to-job process',
        status: 'Starting point',
        detail: 'Map how a customer request turns into an estimate, approval, scheduled work, job notes, invoice, and follow-up.',
        action: 'Send a few real examples: recent request texts, quote notes, photos, job sheets, or anything the team currently uses to track work.',
      },
    ],
    'building-now': [
      {
        id: 'gw-first-priority-board',
        client: 'Goff Welding',
        title: 'First priority board',
        status: 'In progress',
        detail: 'Create a simple working board so active requests, estimates, follow-ups, and scheduling items stop living only in texts or memory.',
      },
      {
        id: 'gw-team-input-rhythm',
        client: 'Goff Welding',
        title: 'Team input rhythm',
        status: 'In progress',
        detail: 'Define what the team should send into the workspace and what Jeff/Blaze will organize behind the scenes.',
      },
    ],
    'up-next': [
      {
        id: 'gw-estimate-followup-flow',
        client: 'Goff Welding',
        title: 'Estimate and follow-up workflow',
        status: 'Next build',
        detail: 'Turn estimate requests, open quotes, customer follow-ups, and scheduling handoffs into one repeatable workflow.',
      },
      {
        id: 'gw-90-day-focus',
        client: 'Goff Welding',
        title: 'First 90-day systems focus',
        status: 'Planned',
        detail: 'Choose the first high-value operating system Stoke AI should improve before adding more automation.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'gw-first-team-inputs',
        client: 'Goff Welding',
        title: 'First team examples',
        status: 'Waiting on input',
        detail: 'Stoke AI needs real examples before designing the first workflow around how the team actually works.',
        action: 'Send 3-5 examples of jobs, quotes, customer requests, photos, spreadsheets, or texts that show where things get hard to track.',
      },
    ],
  },
  'rachel-hansen': {
    discovery: [
      {
        id: 'rh-renewal-process',
        client: 'Rachel Hansen Agency',
        title: 'Renewal workflow operating map',
        status: 'In use',
        detail: 'The renewal workflow is being organized around what staff need to review, edit, and send — not just what automation can generate.',
      },
      {
        id: 'rh-photo-queue-intake',
        client: 'Rachel Hansen Agency',
        title: 'Photo queue intake rules',
        status: 'Defined',
        detail: 'New photo tickets should start with the Field Rep when more research is needed. The creator enters what they know, then Field Rep owns Guidewire, Land ID, and Google Earth research before field work.',
      },
    ],
    'building-now': [
      {
        id: 'rh-staff-review-packet',
        client: 'Rachel Hansen Agency',
        title: 'Staff-friendly renewal packet',
        status: 'In progress',
        detail: 'Make renewal outputs easier for Janice/Rachel/staff to review, correct, and turn into a client-ready PDF before sending.',
      },
      {
        id: 'rh-queue-visibility',
        client: 'Rachel Hansen Agency',
        title: 'Queue visibility and next action',
        status: 'In progress',
        detail: 'Clarify which renewals, photo items, and research steps are active, waiting, or ready for staff review.',
      },
    ],
    'up-next': [
      {
        id: 'rh-editable-notes',
        client: 'Rachel Hansen Agency',
        title: 'Editable staff notes before client delivery',
        status: 'Next sprint',
        detail: 'Let staff adjust wording, notes, and missing details before a renewal/comparison packet becomes customer-facing.',
      },
      {
        id: 'rh-recurring-exceptions',
        client: 'Rachel Hansen Agency',
        title: 'Recurring exception rules',
        status: 'Planned',
        detail: 'Turn repeated staff cleanup decisions into reusable rules so fewer items require manual rework over time.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'rh-staff-feedback',
        client: 'Rachel Hansen Agency',
        title: 'Staff feedback on confusing spots',
        status: 'Waiting on input',
        detail: 'Stoke AI needs examples of anything that is confusing, missing, or awkward in the current renewal/photo workflow.',
        action: 'Send screenshots, policy examples, or quick notes when a renewal, queue item, or photo ticket is hard to understand or needs a correction.',
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
        id: 'stoke-homepage-flow',
        client: 'Stoke-AI',
        title: 'Homepage trust flow cleanup',
        status: 'Complete',
        detail: 'The homepage now leads with proof, local trust, and a simpler explanation of how Stoke AI works.',
      },
      {
        id: 'stoke-offer-shape',
        client: 'Stoke-AI',
        title: 'Premium client relationship shape',
        status: 'Defined',
        detail: 'Stoke AI is positioned as an ongoing operating partner, not a one-off automation shop.',
      },
    ],
    'building-now': [
      {
        id: 'stoke-client-portal',
        client: 'Stoke-AI',
        title: 'Client portal prototype',
        status: 'In progress',
        detail: 'Make the client workspace simple enough to understand without an explanation.',
      },
      {
        id: 'stoke-test-account',
        client: 'Stoke-AI',
        title: 'Internal test account',
        status: 'Ready to review',
        detail: 'Let Jeff sign in and experience the portal exactly like a client would.',
      },
    ],
    'up-next': [
      {
        id: 'stoke-account-model',
        client: 'Stoke-AI',
        title: 'Real team account model',
        status: 'Next decision',
        detail: 'Choose how client logins, team members, and access should work for the first live version.',
      },
      {
        id: 'stoke-austin-kevin',
        client: 'Stoke-AI',
        title: 'Austin & Kevin workspace',
        status: 'Next client setup',
        detail: 'Prepare their real workspace once their business name, first priorities, and access needs are confirmed.',
      },
      {
        id: 'stoke-sales-rhythm',
        client: 'Stoke-AI',
        title: 'Prospect follow-up rhythm',
        status: 'Planned',
        detail: 'Create a simple place to track prospects, follow-ups, and next best actions.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'stoke-client-details',
        client: 'Stoke-AI',
        title: 'Real client workspace details',
        status: 'Waiting on client info',
        detail: 'Before a real client gets access, the portal needs their business name, users, and first priorities.',
        action: 'Confirm the client name, who needs access, and the first 3-5 priorities to show in their workspace.',
      },
    ],
  },
};

export function getPortalClient(clientId: string | undefined | null) {
  return portalClients.find((client) => client.id === clientId) ?? null;
}

export function getPortalClientByUsername(username: string | undefined | null) {
  const normalized = username?.trim().toLowerCase();
  if (!normalized) return null;
  return portalClients.find((client) => client.username.toLowerCase() === normalized || client.id === normalized) ?? null;
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
