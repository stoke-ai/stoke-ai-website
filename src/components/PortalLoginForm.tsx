'use client';

import { useState } from 'react';
import type { PortalClient } from '@/lib/portal/data';

type Props = {
  clients: PortalClient[];
};

export default function PortalLoginForm({ clients }: Props) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/portal/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, accessCode }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error || 'Could not open the portal.');
      setLoading(false);
      return;
    }

    window.location.reload();
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <label className="block text-sm font-semibold text-zinc-300">
        Client
        <select
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition focus:border-orange-400"
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold text-zinc-300">
        Access code
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
          placeholder="Enter client access code"
          type="password"
          value={accessCode}
          onChange={(event) => setAccessCode(event.target.value)}
        />
      </label>
      {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 font-bold text-black transition hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Opening portal…' : 'Open portal'}
      </button>
    </form>
  );
}
