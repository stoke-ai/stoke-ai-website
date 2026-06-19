import { portalClients, type PortalClient } from './data';
import { createPortalNotification, type PortalNotification, type PortalNotificationType } from './store';

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://stoke-ai.com/portal';
const CLIENT_NOTIFICATIONS_ENABLED = process.env.PORTAL_CLIENT_NOTIFICATIONS_ENABLED === 'true';

export type StagePortalClientNotificationInput = {
  clientId: string;
  type: PortalNotificationType;
  actionRequired?: boolean;
  subject?: string;
  preview?: string;
  messageId?: string;
  cardId?: string;
  cardTitle?: string;
};

function getClient(clientId: string): PortalClient | null {
  return portalClients.find((client) => client.id === clientId) ?? null;
}

function recipientsFor(client: PortalClient, actionRequired: boolean) {
  const configuredContacts = client.notificationContacts || [];
  const contacts = configuredContacts.length
    ? configuredContacts.filter((contact) =>
        actionRequired ? contact.receiveActionRequired !== false : contact.receiveProgressUpdates !== false,
      )
    : [{ name: client.name, email: client.contactEmail, role: 'Primary portal contact' }];

  return contacts.map((contact) => ({
    name: contact.name,
    email: contact.email,
    role: contact.role,
  }));
}

function defaultSubject(client: PortalClient, actionRequired: boolean) {
  return actionRequired ? `Action needed in your Stoke AI workspace` : `New Stoke AI portal update for ${client.name}`;
}

function defaultPreview(actionRequired: boolean) {
  return actionRequired
    ? 'Jeff/Blaze needs one item from your team to keep the work moving. Open your private workspace to review and respond.'
    : 'Jeff/Blaze posted an update in your private Stoke AI workspace. Open the portal to review it.';
}

export async function stagePortalClientNotification({
  clientId,
  type,
  actionRequired = false,
  subject,
  preview,
  messageId,
  cardId,
  cardTitle,
}: StagePortalClientNotificationInput): Promise<PortalNotification | null> {
  const client = getClient(clientId);
  if (!client) return null;

  const recipients = recipientsFor(client, actionRequired);
  const notification = await createPortalNotification({
    clientId: client.id,
    clientName: client.name,
    type,
    status: CLIENT_NOTIFICATIONS_ENABLED ? 'ready' : 'paused',
    subject: subject || defaultSubject(client, actionRequired),
    preview: preview || defaultPreview(actionRequired),
    portalUrl: PORTAL_URL,
    actionRequired,
    recipients,
    messageId,
    cardId,
    cardTitle,
    error: CLIENT_NOTIFICATIONS_ENABLED
      ? 'Delivery provider not connected yet. Notification staged only.'
      : 'Client notification delivery is paused. No email or SMS was sent.',
  });

  console.log('Portal client notification staged:', {
    notificationId: notification.id,
    clientId: notification.clientId,
    type: notification.type,
    status: notification.status,
    actionRequired: notification.actionRequired,
  });

  return notification;
}

export function portalClientNotificationsArePaused() {
  return !CLIENT_NOTIFICATIONS_ENABLED;
}
