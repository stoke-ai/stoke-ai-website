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
    contactEmail: 'Ceciliareyes@goffwelding.com',
    notificationContacts: [
      { name: 'Austin Goff', role: 'Goff portal sponsor / decision contact', receiveActionRequired: true, receiveProgressUpdates: true },
      { name: 'Cecilia Reyes', email: 'Ceciliareyes@goffwelding.com', role: 'Goff employee materials contact', receiveActionRequired: true, receiveProgressUpdates: true },
    ],
    headline: 'Goff Welding employee portal workspace',
    summary:
      'A simple private workspace for the first Goff priority: building a professional employee portal/training/resource hub from current Goff materials, aimed at all-employee access while keeping sensitive manager/admin items separate.',
    trelloBoardId: process.env.TRELLO_GOFF_BOARD_ID,
  },
  {
    id: 'rachel-hansen',
    username: 'rachel',
    name: 'Rachel Hansen Agency',
    contactEmail: 'rhansen@idfbins.com',
    notificationContacts: [
      { name: 'Rachel Hansen', email: 'rhansen@idfbins.com', role: 'Rachel portal contact', receiveActionRequired: true, receiveProgressUpdates: true },
    ],
    headline: 'Janice photo queue and renewal workflow',
    summary:
      'A simple place for Rachel and the team to see where Janice stands: what is usable now, what Blaze is building next, and what real examples or feedback are needed from the agency.',
    trelloBoardId: process.env.TRELLO_RACHEL_BOARD_ID,
  },
  {
    id: 'handy-truck-lines',
    username: 'handytruck',
    name: 'Handy Truck Lines',
    contactEmail: '',
    notificationContacts: [],
    headline: 'Dispatching operating system',
    summary: 'Active dispatch software build focused on workflow visibility, load tracking, and handoff reliability.',
    trelloBoardId: process.env.TRELLO_HTL_BOARD_ID,
  },
  {
    id: 'stoke-ai',
    username: 'jeff',
    name: 'Stoke-AI',
    contactEmail: 'automate@stoke-ai.com',
    notificationContacts: [
      { name: 'Jeff Stoker', email: 'automate@stoke-ai.com', role: 'Internal portal test contact', receiveActionRequired: true, receiveProgressUpdates: true },
    ],
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
        title: 'First employee portal / training hub',
        status: 'Active first priority',
        detail: 'The first version is a professional employee portal/resource hub for all employees: Start Here, company links, onboarding, training, safety resources, policies, schedules, contacts/org chart, role expectations, and a way for employees to ask for help. Goff has started adding materials to the dedicated Drive folder. The current work is to inventory those files, separate employee-facing from manager/admin-only material, and then choose the right front-door platform after the content and permission needs are clear.'
      },
      {
        id: 'gw-drive-folder-received',
        client: 'Goff Welding',
        title: 'Curated Drive folder received',
        status: 'Waiting for materials',
        detail: 'Austin created the dedicated Google Drive folder for portal materials and Goff has started dropping files into it. This is the right pattern because it keeps Stoke AI focused on portal-related employee materials instead of broad company Drive access.',
      },
      {
        id: 'gw-access-scope-all-employees',
        client: 'Goff Welding',
        title: 'First audience direction: all employees',
        status: 'Direction received',
        detail: 'Austin answered that once the portal is live, all employees should have access. The first build should therefore be mobile-friendly and employee-facing, while still separating anything that belongs in a manager/admin-only area.',
      },
    ],
    'up-next': [
      {
        id: 'gw-materials-inventory',
        client: 'Goff Welding',
        title: 'Inventory materials once Goff adds them',
        status: 'Next after upload',
        detail: 'When files land in the shared folder, Blaze will sort them by portal section: Start Here, company links, schedule, contacts/org chart, onboarding, training, safety, policies/handbook, role expectations/KRAs, manager/admin-only, and archive/unclear.',
      },
      {
        id: 'gw-onboarding-person-walkthrough',
        client: 'Goff Welding',
        title: 'Short onboarding/materials walkthrough',
        status: 'Recommended next step',
        detail: 'Austin provided Cecilia Reyes as the current contact. Because Cecilia is busy, the cleanest next move may be a short recorded walkthrough where Cecilia or the onboarding/admin person shows Jeff and Blaze where current materials live and what new employees ask repeatedly.',
      },
      {
        id: 'gw-first-review',
        client: 'Goff Welding',
        title: 'Review the first portal map together',
        status: 'Next after inventory',
        detail: 'After the first material inventory, Goff can review what employees should see first, what should stay manager/admin-only, what is missing, and which sections should be included in the first useful version.',
      },
      {
        id: 'gw-platform-decision-after-inventory',
        client: 'Goff Welding',
        title: 'Platform decision after Drive inventory',
        status: 'Hold until inventory',
        detail: 'Circle is no longer the default active task. Based on the files already appearing in Drive, Goff likely needs a controlled document/resource portal with clear employee-facing vs manager/admin-only boundaries. Re-evaluate Circle later only as a simple employee-facing front door if it fits after the inventory is complete.',
      },
      {
        id: 'gw-ai-assistant-knowledge-base',
        client: 'Goff Welding',
        title: 'AI knowledge assistant over approved materials',
        status: 'Phase 2',
        detail: 'The AI assistant should come after the source documents are organized and approved. It can eventually answer employee questions from SOPs, policies, training materials, and company documents without creating customer-facing risk.',
      },
      {
        id: 'gw-schedule-communication-improvements',
        client: 'Goff Welding',
        title: 'Schedule and communication improvements',
        status: 'Later phase',
        detail: 'Goff may later want a clearer schedule/crew communication flow than the current Google Sheet approach, potentially with notifications or acknowledgement, but that should not distract from the employee portal foundation.',
      },
      {
        id: 'gw-recurring-ai-training',
        client: 'Goff Welding',
        title: 'Austin AI coaching / personal ops lane',
        status: 'Parking lot',
        detail: 'Austin and Jeff discussed recurring AI training/coaching around Austin’s own workflows, ChatGPT/project clutter, email/file organization, and a possible personal assistant. Keep this captured as a monthly working-session lane, separate from the employee portal build unless Jeff scopes it as the next priority.',
      },
      {
        id: 'gw-later-automation-modules',
        client: 'Goff Welding',
        title: 'AR/AP, procurement, SAP replacement, and customer-facing automation',
        status: 'Future phase',
        detail: 'These remain valid longer-term opportunities, but Austin was cautious about flipping on customer-facing AI with old data. Internal employee workflows are the safer first proving ground.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'gw-fill-current-folder',
        client: 'Goff Welding',
        title: 'Add current employee materials to the shared folder',
        status: 'Needed from Goff',
        detail: 'Goff has started adding materials to the shared folder. Blaze is watching the folder and will inventory current employee-facing materials as they appear: company links, schedule examples, onboarding docs, policies/handbook, safety resources, training material, role descriptions/KRAs, contact/org chart info, FAQs, and anything employees repeatedly need.',
        action: 'Continue adding current materials to the shared Google Drive. It does not need to be perfectly organized; please flag anything old, duplicate, sensitive, or manager/admin-only.',
      },
      {
        id: 'gw-confirm-working-contact',
        client: 'Goff Welding',
        title: 'Confirm Cecilia for the Monday 3:00 call',
        status: 'Needed before Monday',
        detail: 'Austin sent a Monday 3:00 meeting time. The next step is to make sure Cecilia is included if she is the right person for employee materials, onboarding details, current links/docs, and what employees ask repeatedly.',
        action: 'Confirm Cecilia will join the Monday 3:00 call, or let us know who should attend instead. Agenda: current employee materials, shared Drive status, what should be employee-visible, what should stay manager/admin-only, and the first portal sections to build.',
      },
      {
        id: 'gw-manager-only-boundary',
        client: 'Goff Welding',
        title: 'Flag anything that should not be employee-visible',
        status: 'Needed during materials review',
        detail: 'Austin confirmed the finished portal should be for all employees. As files are added, Goff should flag anything that belongs only to managers, office/admin, leadership, or archive/reference so Blaze does not accidentally treat it as employee-facing.',
        action: 'Mark sensitive or manager/admin-only materials clearly in the folder or in a portal note.',
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
