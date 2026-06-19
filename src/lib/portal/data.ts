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
  notificationContacts?: PortalNotificationContact[];
  headline: string;
  summary: string;
  trelloBoardId?: string;
};

export type PortalNotificationContact = {
  name: string;
  email?: string;
  role?: string;
  receiveActionRequired?: boolean;
  receiveProgressUpdates?: boolean;
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
    id: 'goff-welding',
    username: 'goff',
    name: 'Goff Welding',
    contactEmail: 'portal@stoke-ai.com',
    notificationContacts: [
      { name: 'Austin', role: 'Goff portal contact', receiveActionRequired: true, receiveProgressUpdates: true },
      { name: 'Cecilia', role: 'Goff employee materials contact', receiveActionRequired: true, receiveProgressUpdates: true },
    ],
    headline: 'Goff Welding workspace',
    summary:
      'A simple private workspace for the first Goff employee portal priority: gathering current materials, organizing the first employee resource hub, and keeping the longer-term AI roadmap visible without distracting from the first build.',
    trelloBoardId: process.env.TRELLO_GOFF_BOARD_ID,
  },
  {
    id: 'rachel-hansen',
    username: 'rachel',
    name: 'Rachel Hansen Agency',
    contactEmail: 'rachel@example.com',
    headline: 'Janice photo queue and renewal workflow',
    summary:
      'A simple place for Rachel and the team to see where Janice stands: what is usable now, what Blaze is building next, and what real examples or feedback are needed from the agency.',
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
  {
    // Recently shipped surfaces on the client portal as a "Wins worth seeing"
    // strip — only renders when this stage has cards. Move items here from
    // building-now / up-next via the admin board editor when complete.
    id: 'shipped',
    title: 'Recently shipped',
    tone: 'border-emerald-500/35 bg-emerald-500/10',
  },
];

const internalCards: Record<string, Record<string, PortalCard[]>> = {
  'goff-welding': {
    discovery: [],
    'building-now': [
      {
        id: 'gw-employee-portal-first-version',
        client: 'Goff Welding',
        title: 'First employee portal version',
        status: 'Starting',
        detail: 'Jeff and Blaze are setting up the first simple employee hub for Goff: one organized place for company links, onboarding, training, safety resources, policies, and common employee questions. The first phase is to centralize the existing materials before adding heavier automation.'
      },
    ],
    'up-next': [
      {
        id: 'gw-organize-materials',
        client: 'Goff Welding',
        title: 'Organize the materials',
        status: 'Next',
        detail: 'After Goff shares a dedicated folder, Stoke AI will sort the current employee materials into a clear first portal structure employees can use without digging through scattered files or company Drive folders.',
      },
      {
        id: 'gw-first-review',
        client: 'Goff Welding',
        title: 'Review the first draft together',
        status: 'Next',
        detail: 'Once the first version is organized, Goff can review what feels right, what is missing, and what should stay private or manager-only.',
      },
      {
        id: 'gw-ai-assistant-communication',
        client: 'Goff Welding',
        title: 'AI assistant and team communication options',
        status: 'On the horizon',
        detail: 'Austin and Jeff discussed exploring how Telegram or a similar simple communication layer could let the team interact with an AI assistant, ask practical questions, and keep project updates from getting buried in email.',
      },
      {
        id: 'gw-operations-workflow-modules',
        client: 'Goff Welding',
        title: 'Operational workflow modules',
        status: 'On the horizon',
        detail: 'After the resource hub is stable, Stoke AI can look at custom tools that replace manual processes, disconnected files, or rigid legacy software with simpler workflow modules built around how Goff actually operates.',
      },
      {
        id: 'gw-recurring-ai-training',
        client: 'Goff Welding',
        title: 'Recurring AI training and process improvement',
        status: 'Future phase',
        detail: 'The longer-term plan includes a regular rhythm for AI training, reviewing what is working, and identifying the next practical automation opportunity after the employee portal foundation is in place.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'gw-share-current-folder',
        client: 'Goff Welding',
        title: 'Share the current employee materials',
        status: 'Needed',
        detail: 'Please create a separate folder in Google Drive called something like “Share with Stoke AI” or “Goff Employee Portal - Stoke AI,” put only the portal-related employee materials in it, and share that one folder link. This gives Jeff and Blaze access to what is needed without opening the main company Drive folders.',
        action: 'Create the separate shared folder, add employee-facing links, onboarding docs, policies, safety resources, training material, role info, and FAQs, then paste that folder link here.',
      },
      {
        id: 'gw-introduce-point-person',
        client: 'Goff Welding',
        title: 'Introduce the best point person',
        status: 'Needed',
        detail: 'Please introduce the person who knows the current onboarding/training process best so Jeff can ask practical questions without pulling Cecilia into every detail.',
        action: 'Introduce the onboarding/admin point person or small office group.',
      },
      {
        id: 'gw-access-basics',
        client: 'Goff Welding',
        title: 'Confirm access basics',
        status: 'Needed soon',
        detail: 'Before launch, we need a simple answer on who should see the portal: all employees, managers only, or separate employee/management sections.',
      },
    ],
  },
  'rachel-hansen': {
    discovery: [
      {
        id: 'rh-photo-status-portal',
        client: 'Rachel Hansen Agency',
        title: 'Rachel status portal for Janice work',
        status: 'Built',
        detail: 'This portal gives Rachel one simple place to see what is available now, what Blaze is building next, and what the agency should send when something needs correction.',
      },
      {
        id: 'rh-photo-queue-v12-live',
        client: 'Rachel Hansen Agency',
        title: 'Photo queue v1.2 is live in Telegram',
        status: 'Usable now',
        detail: 'Janice can create photo, drone, and Flyreel tickets in the Hansen Photo Tasks group, assign them to Owen or another field person, track research, show the open queue, and move work through review checkpoints.',
      },
      {
        id: 'rh-field-research-rule-decided',
        client: 'Rachel Hansen Agency',
        title: 'Field research rule is decided',
        status: 'Decided',
        detail: 'New tickets start with rough intake, then the Field Rep owns parcel, owner, Land ID / Google Earth research, latitude/longitude, access notes, and the phone-friendly field packet before driving out.',
      },
    ],
    'building-now': [
      {
        id: 'rh-packet-generation-next-layer',
        client: 'Rachel Hansen Agency',
        title: 'Finish the photo packet output loop',
        status: 'Active build priority',
        detail: 'Blaze is building the finished output layer: gather returned photos against the ticket, generate the branded underwriting PDF, and keep raw originals organized with useful file names instead of making staff copy everything by hand.',
      },
    ],
    'up-next': [
      {
        id: 'rh-telegram-photo-attachment-saving',
        client: 'Rachel Hansen Agency',
        title: 'Save photos and videos from Telegram tickets',
        status: 'Next',
        detail: 'Janice needs to capture the actual images/video sent back on each ticket, keep them tied to the right PH number, and preserve enough context so photos do not get mixed between clients or buildings.',
      },
      {
        id: 'rh-branded-pdf-packet',
        client: 'Rachel Hansen Agency',
        title: 'Generate the branded underwriting PDF',
        status: 'Next',
        detail: 'Build the PDF Rachel described: landscape pages, large photos, agency branding, policy/client/location/building details, parcel/owner/lat-long, and property information repeated where underwriting needs it.',
      },
      {
        id: 'rh-raw-photo-filing',
        client: 'Rachel Hansen Agency',
        title: 'File raw originals with useful names',
        status: 'Next',
        detail: 'Save each original photo/video separately with a structured name so the team can reuse one image later without digging through a chatbot, spreadsheet, or exported PDF.',
      },
      {
        id: 'rh-onedrive-guidewire-filing',
        client: 'Rachel Hansen Agency',
        title: 'OneDrive / client-file filing automation',
        status: 'After packet loop',
        detail: 'Once the packet loop is reliable, connect the output to the agency filing path so finished PDFs and raw photos land where staff already expect them.',
      },
      {
        id: 'rh-landid-research-provider',
        client: 'Rachel Hansen Agency',
        title: 'Land ID / property lookup helper',
        status: 'Future phase',
        detail: 'Add a lookup layer for parcel, owner, lat/long, and map links after the manual research loop proves the exact fields Rachel wants to rely on.',
      },
      {
        id: 'rh-renewal-comparison-hooks',
        client: 'Rachel Hansen Agency',
        title: 'Renewal comparison hooks',
        status: 'Future phase',
        detail: 'Use Janice renewal data to pre-fill policy, insured, location, building, and address details when a photo task comes from a renewal comparison.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'rh-run-one-real-photo-task',
        client: 'Rachel Hansen Agency',
        title: 'Run one real photo task through Janice',
        status: 'Needed',
        detail: 'The fastest way to improve the queue is to use one real photo/drone/Flyreel item in Hansen Photo Tasks and let Janice show where the process is clear or awkward.',
        action: 'In Hansen Photo Tasks, create one real ticket with the client/policy if available, address, what needs photographed, and who should handle it. Example: Need photos for client [name] address [address] needs [shots] assign to Owen.',
      },
      {
        id: 'rh-send-confusing-example',
        client: 'Rachel Hansen Agency',
        title: 'Send examples when something is confusing',
        status: 'Needed as discovered',
        detail: 'If a ticket, renewal item, photo packet, or field instruction is confusing, Blaze needs the real example so the fix is based on agency work instead of guesses.',
        action: 'Send a screenshot, policy number, PH ticket number, or short note describing what felt confusing, missing, or wrong.',
      },
      {
        id: 'rh-share-preferred-packet-sample',
        client: 'Rachel Hansen Agency',
        title: 'Share a preferred packet example if available',
        status: 'Helpful, not blocking',
        detail: 'The current sample showed what is missing. A packet Rachel likes would help Blaze match the preferred PDF style faster, but the build can continue from the known landscape/large-photo/info-block direction.',
        action: 'If Rachel has a ChatGPT-made or manually edited packet she likes, send it as the style target for the PDF output.',
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
        id: 'stoke-portal-admin-simplified',
        client: 'Stoke-AI',
        title: 'Portal admin simplified',
        status: 'Finished',
        detail: 'The admin side was simplified into Current focus, Needed from client, and Later so Jeff can update client work without a confusing Kanban board.',
      },
      {
        id: 'stoke-logout-fixed',
        client: 'Stoke-AI',
        title: 'Client login/logout loop fixed',
        status: 'Finished',
        detail: 'The portal sign-out flow now clears the real session cookie and returns the client to the sign-in screen.',
      },
    ],
    'building-now': [
      {
        id: 'stoke-goff-employee-portal',
        client: 'Stoke-AI',
        title: 'Goff employee portal first version',
        status: 'Working now',
        detail: 'Jeff and Blaze are setting up the first private employee hub for Goff Welding: company links, onboarding, training, safety resources, and common employee questions.',
      },
      {
        id: 'stoke-rachel-renewal-workflow',
        client: 'Stoke-AI',
        title: 'Rachel renewal workflow cleanup',
        status: 'Active',
        detail: 'Janice/Rachel’s renewal and photo queue workflow is being tightened so staff can see what is active, what needs review, and what is ready to send.',
      },
      {
        id: 'stoke-client-portal-operating-layer',
        client: 'Stoke-AI',
        title: 'Client portal operating layer',
        status: 'Active',
        detail: 'The portal is being shaped into a simple front door where clients can see priorities, send missing information, and keep work out of scattered texts and emails.',
      },
    ],
    'up-next': [
      {
        id: 'stoke-goff-first-review',
        client: 'Stoke-AI',
        title: 'Review Goff’s first portal draft',
        status: 'Next',
        detail: 'After Goff shares the current employee materials, Stoke AI will organize the first draft and review what should be public, private, or manager-only.',
      },
      {
        id: 'stoke-schedule-google-meet',
        client: 'Stoke-AI',
        title: 'Let clients schedule a walkthrough',
        status: 'Add now',
        detail: 'Add a simple way for a client to book a Google Meet with Jeff when a live conversation is easier than sending notes back and forth.',
      },
      {
        id: 'stoke-loom-screen-recordings',
        client: 'Stoke-AI',
        title: 'Loom-style screen recording option',
        status: 'Discussed',
        detail: 'Give clients an easy way to record their screen and explain what they like, dislike, or need changed without booking a meeting.',
      },
      {
        id: 'stoke-voice-memo-updates',
        client: 'Stoke-AI',
        title: 'Voice memo updates',
        status: 'Future phase',
        detail: 'Let clients talk through concerns, compliments, or corrections in their own words, then have Blaze transcribe and organize the update.',
      },
      {
        id: 'stoke-handy-dispatch-handoff',
        client: 'Stoke-AI',
        title: 'Handy dispatch handoff path',
        status: 'Next',
        detail: 'Prepare the next deployment/handoff steps for the Handy Truck Lines dispatching app so Bryce can review it in the right environment.',
      },
      {
        id: 'stoke-client-account-model',
        client: 'Stoke-AI',
        title: 'Real client account model',
        status: 'Next decision',
        detail: 'Decide how client logins, team members, and access should work once the portal moves from Jeff testing into real client/team use.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'stoke-goff-current-materials',
        client: 'Stoke-AI',
        title: 'Goff current employee materials',
        status: 'Needed',
        detail: 'Goff needs to share the current employee-facing materials so the first portal version is built from their real documents instead of guesses.',
        action: 'Send the current folder or copies of employee links, onboarding docs, safety resources, training material, role info, policies, and FAQs.',
      },
      {
        id: 'stoke-goff-point-person',
        client: 'Stoke-AI',
        title: 'Goff onboarding point person',
        status: 'Needed',
        detail: 'A practical office/admin contact will help answer process questions without pulling Cecilia into every small detail.',
        action: 'Introduce the person or small office group that knows the current onboarding and training process best.',
      },
      {
        id: 'stoke-rachel-examples',
        client: 'Stoke-AI',
        title: 'Rachel confusing renewal examples',
        status: 'Needed when available',
        detail: 'Rachel’s workflow improves fastest when staff send real examples of confusing renewal packets, photo queue items, or fields that need correction.',
        action: 'Send screenshots, policy examples, or short notes when a renewal/photo item is confusing, missing information, or needs a correction.',
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
