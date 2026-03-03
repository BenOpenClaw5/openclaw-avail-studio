'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: 'active' | 'paused' | 'archived';
  spend: number;
  revenue: number;
  roas: number;
  impressions: number;
  clicks: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setCampaigns([
        {
          id: '1',
          name: 'Summer Sale Campaign',
          objective: 'Conversions',
          status: 'active',
          spend: 3200,
          revenue: 8400,
          roas: 2.63,
          impressions: 125000,
          clicks: 3500,
        },
        {
          id: '2',
          name: 'Brand Awareness Q2',
          objective: 'Brand Awareness',
          status: 'active',
          spend: 2100,
          revenue: 4200,
          roas: 2.0,
          impressions: 450000,
          clicks: 2100,
        },
        {
          id: '3',
          name: 'Retargeting - Cart Abandoners',
          objective: 'Conversions',
          status: 'paused',
          spend: 1500,
          revenue: 3600,
          roas: 2.4,
          impressions: 80000,
          clicks: 1200,
        },
        {
          id: '4',
          name: 'Lead Generation - Webinar',
          objective: 'Leads',
          status: 'active',
          spend: 2610,
          revenue: 3881,
          roas: 1.49,
          impressions: 320000,
          clicks: 4100,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'paused':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-600';
    }
  };

  if (loading) {
    return <div className="text-slate-400">Loading campaigns...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Campaigns</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          + New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="glass rounded-xl p-12 border border-slate-700 text-center">
          <p className="text-slate-400 mb-4">No campaigns found</p>
          <p className="text-slate-500 text-sm">Create your first campaign to get started</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden border border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Campaign Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Objective</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Spend</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Revenue</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-800/50 transition cursor-pointer">
                    <td className="px-6 py-4 text-sm text-white font-medium">{campaign.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{campaign.objective}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded border text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-slate-300">${campaign.spend.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-green-400 font-medium">${campaign.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-white font-medium">{campaign.roas.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
