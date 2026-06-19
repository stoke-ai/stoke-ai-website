import Link from 'next/link';
import PortalAdminBoardEditor from '@/components/PortalAdminBoardEditor';
import PortalAdminInbox from '@/components/PortalAdminInbox';
import PortalAdminLoginForm from '@/components/PortalAdminLoginForm';
import { getPortalAdminSessionClientId } from '@/lib/portal/auth';
import { portalClients } from '@/lib/portal/data';

export const dynamic = 'force-dynamic';

export default async function PortalAdminPage() {
  const clientId = await getPortalAdminSessionClientId();

  if (clientId !== 'stoke-ai') {
    return (
      <main className="min-h-screen bg-[#08090a] px-6 py-10 text-zinc-50">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.035] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Stoke AI admin</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Portal admin is private.</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Use the separate admin login for the command center. Client/demo portal accounts no longer unlock admin tools.
          </p>
          <PortalAdminLoginForm />
          <Link href="/portal" className="mt-5 inline-flex text-sm font-semibold text-orange-200 underline-offset-4 hover:underline">
            Go to client portal instead
          </Link>
        </div>
      </main>
    );
  }

  const clients = portalClients.map((client) => ({ id: client.id, name: client.name, username: client.username }));

  return (
    <main className="min-h-screen bg-[#08090a] px-4 py-6 text-zinc-50 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Signed in with separate admin access. Client/demo portal accounts cannot unlock this page.
          </span>
          <form action="/api/portal/admin-logout" method="post">
            <button className="rounded-full border border-white/10 px-4 py-2 font-semibold text-zinc-100 transition hover:border-orange-400/40 hover:bg-orange-400/10">
              Sign out of admin
            </button>
          </form>
        </div>
        <PortalAdminBoardEditor clients={clients} />
        <PortalAdminInbox />
      </div>
    </main>
  );
}
