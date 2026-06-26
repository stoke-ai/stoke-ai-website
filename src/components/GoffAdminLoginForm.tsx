'use client';

import { useState } from 'react';

export default function GoffAdminLoginForm() {
  const [username, setUsername] = useState('goffadmin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nextUrl = (() => {
    if (typeof window === 'undefined') return '/goff-recruiting/';
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next && next.startsWith('/goff-recruiting')) return next;
    return '/goff-recruiting/';
  })();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error || 'Username or password is incorrect.');
        setLoading(false);
        return;
      }
      window.location.href = nextUrl;
    } catch {
      setError('Could not reach the sign-in service. Try again.');
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 14px',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '3px',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      <label style={{display:'flex',flexDirection:'column',gap:'6px',fontSize:'12px',color:'#aaa',fontWeight:700,letterSpacing:'0.04em',textTransform:'uppercase'}}>
        Username
        <input
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          placeholder="goffadmin"
        />
      </label>
      <label style={{display:'flex',flexDirection:'column',gap:'6px',fontSize:'12px',color:'#aaa',fontWeight:700,letterSpacing:'0.04em',textTransform:'uppercase'}}>
        Password
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          placeholder="••••••••"
        />
      </label>
      {error ? (
        <p style={{margin:0,padding:'10px 12px',background:'rgba(192,24,43,0.12)',border:'1px solid rgba(192,24,43,0.3)',borderRadius:'3px',color:'#ff9aa8',fontSize:'13px'}}>{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '13px 22px',
          background: 'linear-gradient(180deg, #c0182b, #9e1320)',
          color: '#fff',
          border: 0,
          borderRadius: '3px',
          fontWeight: 800,
          fontSize: '14px',
          letterSpacing: '0.04em',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          marginTop: '6px',
        }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
