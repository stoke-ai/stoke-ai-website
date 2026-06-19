import { portalClients, type PortalClient } from './data';
import { createPortalNotification, type PortalNotification, type PortalNotificationType } from './store';

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://stoke-ai.com/portal';
const CLIENT_NOTIFICATIONS_ENABLED = process.env.PORTAL_CLIENT_NOTIFICATIONS_ENABLED === 'true';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PORTAL_EMAIL_FROM = process.env.PORTAL_EMAIL_FROM || 'Blaze at Stoke AI <blaze@stoke-ai.com>';
const PORTAL_EMAIL_REPLY_TO = process.env.PORTAL_EMAIL_REPLY_TO || 'blaze@stoke-ai.com';

type EmailRecipient = {
  name?: string;
  email: string;
  role?: string;
};

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

function emailRecipients(recipients: Array<{ name?: string; email?: string; role?: string }>): EmailRecipient[] {
  const seen = new Set<string>();
  return recipients
    .map((recipient) => ({ ...recipient, email: recipient.email?.trim().toLowerCase() }))
    .filter((recipient): recipient is EmailRecipient => Boolean(recipient.email))
    .filter((recipient) => {
      if (seen.has(recipient.email)) return false;
      seen.add(recipient.email);
      return true;
    });
}

function defaultSubject(client: PortalClient, type: PortalNotificationType, actionRequired: boolean) {
  if (type === 'client-reply') return `Blaze replied in your Stoke AI workspace`;
  if (type === 'board-update') return `New Stoke AI portal update for ${client.name}`;
  return actionRequired ? `Action needed in your Stoke AI workspace` : `New Stoke AI portal update for ${client.name}`;
}

function defaultPreview(type: PortalNotificationType, actionRequired: boolean) {
  if (type === 'client-reply') {
    return 'Blaze replied in your private Stoke AI workspace. Open the portal to review and respond.';
  }

  return actionRequired
    ? 'Jeff/Blaze needs one item from your team to keep the work moving. Open your private workspace to review and respond.'
    : 'Jeff/Blaze posted an update in your private Stoke AI workspace. Open the portal to review it.';
}

function actionLabel(type: PortalNotificationType, actionRequired: boolean) {
  if (type === 'client-reply') return 'Open the reply';
  if (actionRequired) return 'Review what is needed';
  return 'Open the portal update';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function notificationHtml(input: {
  clientName: string;
  preview: string;
  portalUrl: string;
  type: PortalNotificationType;
  actionRequired: boolean;
  cardTitle?: string;
}) {
  const title = input.actionRequired ? 'Action needed' : input.type === 'client-reply' ? 'Blaze replied' : 'Portal update';
  const cardLine = input.cardTitle
    ? `<p style="margin: 18px 0 0; color: #71717a; font-size: 14px;">Related item: <strong style="color: #3f3f46;">${escapeHtml(input.cardTitle)}</strong></p>`
    : '';

  return `<!doctype html>
<html>
  <body style="margin:0; padding:0; background:#f4f4f5; font-family: Arial, sans-serif; color:#18181b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px; background:#ffffff; border-radius:22px; border:1px solid #e4e4e7; overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 8px;">
                <p style="margin:0 0 12px; color:#f97316; font-size:12px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase;">Stoke AI workspace</p>
                <h1 style="margin:0; font-size:28px; line-height:1.15; color:#18181b;">${escapeHtml(title)}</h1>
                <p style="margin:14px 0 0; color:#52525b; font-size:16px; line-height:1.6;">${escapeHtml(input.preview)}</p>
                ${cardLine}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 30px;">
                <a href="${escapeHtml(input.portalUrl)}" style="display:inline-block; background:#fb923c; color:#111827; text-decoration:none; font-weight:800; padding:13px 18px; border-radius:999px; font-size:14px;">${escapeHtml(actionLabel(input.type, input.actionRequired))}</a>
                <p style="margin:18px 0 0; color:#71717a; font-size:13px; line-height:1.6;">This email is only a nudge. The portal stays the source of truth so details, files, and next actions stay organized.</p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e4e4e7; padding:18px 28px; background:#fafafa;">
                <p style="margin:0; color:#71717a; font-size:12px; line-height:1.5;">Sent by Blaze at Stoke AI for ${escapeHtml(input.clientName)}. If this went to the wrong person, reply to this email and Jeff/Blaze will update the portal contacts.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function notificationText(input: {
  clientName: string;
  preview: string;
  portalUrl: string;
  type: PortalNotificationType;
  actionRequired: boolean;
  cardTitle?: string;
}) {
  return [
    input.preview,
    input.cardTitle ? `Related item: ${input.cardTitle}` : '',
    `${actionLabel(input.type, input.actionRequired)}: ${input.portalUrl}`,
    '',
    `Sent by Blaze at Stoke AI for ${input.clientName}. The portal stays the source of truth so details, files, and next actions stay organized.`,
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendNotificationEmail(input: {
  recipients: EmailRecipient[];
  subject: string;
  preview: string;
  clientName: string;
  portalUrl: string;
  type: PortalNotificationType;
  actionRequired: boolean;
  cardTitle?: string;
}) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured.');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: PORTAL_EMAIL_FROM,
      to: input.recipients.map((recipient) => recipient.email),
      reply_to: PORTAL_EMAIL_REPLY_TO,
      subject: input.subject,
      html: notificationHtml(input),
      text: notificationText(input),
    }),
  });

  const result = (await response.json().catch(() => null)) as { id?: string; message?: string; error?: string } | null;
  if (!response.ok) {
    throw new Error(result?.message || result?.error || `Resend request failed with ${response.status}`);
  }

  return result?.id || 'resend-email-sent';
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
  const deliverableRecipients = emailRecipients(recipients);
  const notificationSubject = subject || defaultSubject(client, type, actionRequired);
  const notificationPreview = preview || defaultPreview(type, actionRequired);

  let status: PortalNotification['status'] = 'paused';
  let error = 'Client notification delivery is paused. No email or SMS was sent.';

  if (CLIENT_NOTIFICATIONS_ENABLED) {
    if (!deliverableRecipients.length) {
      status = 'missing-recipient';
      error = 'No recipient email address is configured for this client notification.';
    } else {
      try {
        const resendId = await sendNotificationEmail({
          recipients: deliverableRecipients,
          subject: notificationSubject,
          preview: notificationPreview,
          clientName: client.name,
          portalUrl: PORTAL_URL,
          type,
          actionRequired,
          cardTitle,
        });
        status = 'sent';
        error = `Email sent via Resend (${resendId}).`;
      } catch (sendError) {
        status = 'failed';
        error = sendError instanceof Error ? sendError.message : 'Email delivery failed.';
      }
    }
  }

  const notification = await createPortalNotification({
    clientId: client.id,
    clientName: client.name,
    type,
    status,
    subject: notificationSubject,
    preview: notificationPreview,
    portalUrl: PORTAL_URL,
    actionRequired,
    recipients,
    messageId,
    cardId,
    cardTitle,
    error,
  });

  console.log('Portal client notification processed:', {
    notificationId: notification.id,
    clientId: notification.clientId,
    type: notification.type,
    status: notification.status,
    actionRequired: notification.actionRequired,
    deliverableRecipients: deliverableRecipients.length,
  });

  return notification;
}

export function portalClientNotificationsArePaused() {
  return !CLIENT_NOTIFICATIONS_ENABLED;
}
