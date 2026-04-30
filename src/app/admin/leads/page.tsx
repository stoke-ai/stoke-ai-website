'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  name: string;
  email: string;
  business: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => {
        setLeads(data.leads || []);
        setLoading(false);
      });
  }, []);

  const statusColors = {
    new: 'bg-green-500',
    contacted: 'bg-blue-500',
    qualified: 'bg-amber-500',
    closed: 'bg-gray-500',
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Lead Dashboard</h1>
        <p className="text-gray-400 mb-8">Stoke-AI CRM — No HubSpot required 🔥</p>
        
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p>No leads yet. They&apos;ll show up here when someone fills out the form.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.slice().reverse().map(lead => (
              <div key={lead.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{lead.name}</h2>
                    <p className="text-gray-400">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[lead.status]}`}>
                      {lead.status.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-gray-500 text-sm">Business:</span>
                  <span className="ml-2">{lead.business}</span>
                </div>
                {lead.message && (
                  <div>
                    <span className="text-gray-500 text-sm">Message:</span>
                    <p className="mt-1 text-gray-300">{lead.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
