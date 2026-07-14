import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Text Message Consent | Stoke AI',
  description: 'Enroll in conversational client text messages from Stoke AI.',
  robots: { index: true, follow: true },
};

export default function SmsConsentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
