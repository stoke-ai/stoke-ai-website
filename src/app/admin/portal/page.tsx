import Link from 'next/link';
import PortalAdminInbox from '@/components/PortalAdminInbox';
import { getPortalSessionClientId } from '@/lib/portal/auth';

export const dynamic = 'force-dynamic';

export default async function PortalAdminPage() {
  const clientId = await getPortalSessionClientId();

  if (clientId !== 'stoke-ai') {
    return (
      <main className="min-h-screen bg-[#08090a] px-6 py-10 text-zinc-50">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.035] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Stoke AI admin</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Portal admin is private.</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Sign into the Stoke-AI portal account first, then come back to the admin inbox.
          </p>
          <Link
            href="/portal"
            className="mt-6 inline-flex rounded-full bg-orange-400 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-300"
          >
            Sign in to portal
          </Link>
        </div>
      </main>
    );
  }

  return <PortalAdminInbox />;
}
