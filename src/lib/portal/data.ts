export type PortalCardOwner = 'stoke' | 'you' | 'shared';

export type PortalCard = {
  id: string;
  client: string;
  title: string;
  status: string;
  detail: string;
  updatedAt?: string;
  action?: string;
  /** Who owns the next move. Defaults by stage when omitted. */
  owner?: PortalCardOwner;
  /** Short client-safe proof line for finished work (URL, date, verified outcome). */
  evidence?: string;
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
    headline: 'Goff Welding project workspace',
    summary:
      'A private workspace for Goff and Stoke AI to see the two active priorities, what Goff still needs to do, and a verifiable list of what Stoke has already finished.',
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
        id: 'gw-two-active-priorities',
        client: 'Goff Welding',
        title: 'Two active priorities right now',
        status: 'Current focus',
        owner: 'stoke',
        detail:
          'Stoke AI is running two focused lanes for Goff: Accounts Receivable follow-up and Procurement request intake. Everything else stays visible as finished work or lined up later — not mixed into these two.',
      },
      {
        id: 'gw-ar-collections-active',
        client: 'Goff Welding',
        title: 'Accounts receivable follow-up system',
        status: 'Active priority · Stoke building',
        owner: 'stoke',
        detail:
          'Priority 1. Stoke is mapping the live AR process and preparing a reviewed follow-up system. Discovery outreach was sent July 14. Next Stoke step is the walkthrough and source data review once Goff shares the aging export and schedule.',
      },
      {
        id: 'gw-procurement-specialist-active',
        client: 'Goff Welding',
        title: 'Procurement request assistant V1',
        status: 'Active priority · Stoke building',
        owner: 'stoke',
        detail:
          'Priority 2. V1 scope is defined from Kevin’s walkthrough: one simple request entry point, relevant clarification questions, read-only catalog/inventory checks, and a clean packet for Kevin’s review. V1 will not select vendors, place orders, write to SAP, or approve spending automatically.',
      },
    ],
    'up-next': [
      {
        id: 'gw-employee-portal-refinement',
        client: 'Goff Welding',
        title: 'Employee portal and onboarding refinement',
        status: 'In use / refining',
        owner: 'shared',
        detail:
          'The employee portal, recruiting workflow, and Move to onboarding handoff are live working tools. Stoke will keep fixing unclear steps and handoff gaps as Jerry, Quinton, Austin, and the team use them.',
      },
      {
        id: 'gw-procurement-later-capabilities',
        client: 'Goff Welding',
        title: 'Saltbox and SAP connection after the reviewed V1',
        status: 'Later / test environment first',
        owner: 'stoke',
        detail:
          'After the human-reviewed intake works reliably, Goff can evaluate Saltbox for draft SAP purchase requests and status updates. No SAP write until the test environment is verified.',
      },
      {
        id: 'gw-ar-later-automation',
        client: 'Goff Welding',
        title: 'AR automation after the reviewed workflow proves itself',
        status: 'Later',
        owner: 'stoke',
        detail:
          'AP, job closeout, invoice creation, direct SAP replacement, and fully autonomous customer email are not part of the first AR build.',
      },
    ],
    'waiting-blocked': [
      {
        id: 'gw-ar-current-workflow-walkthrough',
        client: 'Goff Welding',
        title: 'Current AR follow-up walkthrough',
        status: 'Needed from Goff',
        owner: 'you',
        detail:
          'Stoke asked the team on July 14 to schedule a walkthrough covering one normal invoice, one discrepancy, one promise to pay, the Dunning Wizard/report, calls and notes, payment updates, and escalation ownership.',
        action: 'Cecilia and Alice: walk Jeff through one normal invoice and one invoice delayed by a discrepancy.',
      },
      {
        id: 'gw-fresh-sap-aging-export',
        client: 'Goff Welding',
        title: 'Fresh SAP accounts receivable aging export',
        status: 'Needed from Goff',
        owner: 'you',
        detail:
          'Stoke AI emailed the AR team on July 14 requesting a fresh SAP Customer Receivables Aging export in Excel or CSV so the current data and future importer format can be reviewed.',
        action: 'Kevin or Cecilia: generate one fresh SAP AR aging export and share it with Stoke AI.',
      },
      {
        id: 'gw-billing-mailbox-confirmation',
        client: 'Goff Welding',
        title: 'Confirm billing@goffwelding.com setup',
        status: 'Needed from Goff',
        owner: 'you',
        detail:
          'Stoke asked whether billing@goffwelding.com is a mailbox, group, or alias; who has access; and how it should support reports, customer replies, payment promises, discrepancies, and escalation.',
        action: 'Cecilia or Austin: confirm what type of address billing@goffwelding.com is and who currently has access.',
      },
      {
        id: 'gw-procurement-approval-routing',
        client: 'Goff Welding',
        title: 'Confirm procurement approval routing',
        status: 'Decision needed from Goff',
        owner: 'you',
        detail:
          'Before approval routing can be configured, Goff needs to confirm who approves tools, equipment, and other internal purchases and when dollar thresholds apply. Until then, V1 keeps approvals human-reviewed.',
        action: 'Cecilia and Austin: confirm the procurement approval roles and dollar thresholds Kevin should follow.',
      },
      {
        id: 'gw-employee-portal-feedback',
        client: 'Goff Welding',
        title: 'Employee portal and recruiting feedback',
        status: 'Send issues as they appear',
        owner: 'you',
        detail:
          'The workforce tools are being refined through use. Screenshots, short screen recordings, and plain-language notes are enough whenever a step is unclear or wrong.',
        action: 'Quinton, Jerry, Austin, or any reviewer: send the exact screen and what you expected to happen.',
      },
      {
        id: 'gw-info-email-test-delivery-confirmation',
        client: 'Goff Welding',
        title: 'Confirm website test delivery at info@goffwelding.com',
        status: 'Receipt confirmation needed',
        owner: 'you',
        detail:
          'Goff’s public website has been migrated to hosting managed by Stoke AI. The remaining delivery check is confirming that the website test message reached info@goffwelding.com.',
        action:
          'Austin or a Goff team member with access to info@goffwelding.com: confirm whether the test message arrived. If it is not in the inbox, check Spam or Junk and let Jeff know the result.',
      },
    ],
    shipped: [
      {
        id: 'gw-employee-recruiting-refinements-live',
        client: 'Goff Welding',
        title: 'Recruiting refinements live on Goff-owned production',
        status: 'Shipped Aug 6',
        owner: 'stoke',
        updatedAt: '2026-08-06T20:00:00.000Z',
        evidence: 'Verified production deploy Ready on employees.goffwelding.com and careers.goffwelding.com',
        detail:
          'Recruiting database refinements and production release were applied on Goff’s owned hosting and database. Candidate records were preserved and the live workforce domains responded successfully after deploy.',
      },
      {
        id: 'gw-recruiting-email-from-careers-live',
        client: 'Goff Welding',
        title: 'Recruiting emails now send from Goff Careers',
        status: 'Live and delivery verified',
        owner: 'stoke',
        updatedAt: '2026-07-30T18:00:00.000Z',
        evidence: 'Messages deliver from careers@goffwelding.com through the Workforce Platform',
        detail:
          'Goff staff can send applicant and candidate emails from the recruiting side of the Workforce Platform under Goff’s own careers@ identity.',
      },
      {
        id: 'gw-website-hosting-migration-complete',
        client: 'Goff Welding',
        title: 'Goff website migrated to Stoke AI hosting',
        status: 'Migrated July 16',
        owner: 'stoke',
        updatedAt: '2026-07-16T18:00:00.000Z',
        evidence: 'Public website hosting ownership moved; receipt check remains a separate open item',
        detail:
          'Goff’s public website was moved from the prior provider to hosting managed by Stoke AI. Domain/hosting migration is complete; inbox receipt confirmation is tracked separately under Needs from Goff.',
      },
      {
        id: 'gw-procurement-walkthrough-complete',
        client: 'Goff Welding',
        title: 'Kevin procurement process walkthrough completed',
        status: 'Completed July 17',
        owner: 'stoke',
        updatedAt: '2026-07-17T18:00:00.000Z',
        evidence: 'Live walkthrough completed with Kevin; V1 scope written from that evidence',
        detail:
          'Kevin walked through quoted jobs, time-and-material requests, inventory, purchasing, receiving, back-order follow-up, approvals, and SAP handoffs. That evidence defined the human-reviewed intake V1.',
      },
      {
        id: 'gw-procurement-source-review-complete',
        client: 'Goff Welding',
        title: 'Procurement request, catalog, and inventory sources received',
        status: 'Received and reviewed',
        owner: 'stoke',
        updatedAt: '2026-07-18T18:00:00.000Z',
        evidence: 'Purchase Request workbook and Inventory Checkout List reviewed for V1 fields',
        detail:
          'Kevin shared the Purchase Request workbook and Inventory Checkout List. Catalog fields needed for the first read-only assistant are in hand; no extra catalog export is required for V1.',
      },
      {
        id: 'gw-ar-discovery-outreach-sent',
        client: 'Goff Welding',
        title: 'AR discovery request sent to the team',
        status: 'Sent July 14',
        owner: 'stoke',
        updatedAt: '2026-07-14T18:00:00.000Z',
        evidence: 'Email sent to Cecilia and Kevin; Austin, Quinton, and billing@ copied',
        detail:
          'Stoke requested current SAP aging data, workflow examples, mailbox/access details, and a scheduled walkthrough, with Jeff’s calendar link for direct booking.',
      },
      {
        id: 'gw-recruiting-platform-draft-live',
        client: 'Goff Welding',
        title: 'Recruiting platform working in production',
        status: 'Live',
        owner: 'stoke',
        updatedAt: '2026-07-20T18:00:00.000Z',
        evidence: 'Live Workforce Platform covering intake, pipeline, review, offers, and communication drafts',
        detail:
          'A working recruiting dashboard covers candidate intake, pipeline stages, manager review, offer workflow, clearance guardrails, and template-driven communication drafts.',
      },
      {
        id: 'gw-employee-portal-training-draft-live',
        client: 'Goff Welding',
        title: 'Employee onboarding / training portal live draft',
        status: 'Live',
        owner: 'stoke',
        updatedAt: '2026-07-20T18:00:00.000Z',
        evidence: 'Employee portal path live with Start Here through 30-day check-in structure',
        detail:
          'A private employee portal draft organizes Start Here, BBSI/myBBSI, ExakTime, safety, company forms, tools/apparel, manager handoff, and 30-day check-in content.',
      },
      {
        id: 'gw-admin-control-handoff-draft-live',
        client: 'Goff Welding',
        title: 'Admin control and Move to onboarding handoff',
        status: 'Live',
        owner: 'stoke',
        updatedAt: '2026-07-22T18:00:00.000Z',
        evidence: 'Cleared candidates can move into the onboarding queue with admin status and blockers visible',
        detail:
          'Recruiting can move a cleared candidate into onboarding, and the employee admin control view shows status, blockers, owner lanes, and next actions.',
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
