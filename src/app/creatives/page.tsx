'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Creative {
  id: string;
  name: string;
  type: 'image' | 'video' | 'carousel';
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  roas: number;
  status: 'top_performer' | 'good' | 'needs_improvement';
}

export default function CreativesPage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [filter, setFilter] = useState<'all' | 'top_performers' | 'underperformers'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCreatives([
        {
          id: '1',
          name: 'Summer Collection - Hero Shot',
          type: 'image',
          spend: 1200,
          impressions: 450000,
          clicks: 15000,
          ctr: 3.33,
          roas: 3.2,
          status: 'top_performer',
        },
        {
          id: '2',
          name: 'Customer Testimonial Video',
          type: 'video',
          spend: 900,
          impressions: 320000,
          clicks: 8000,
          ctr: 2.5,
          roas: 2.8,
          status: 'good',
        },
        {
          id: '3',
          name: 'Product Carousel - All Items',
          type: 'carousel',
          spend: 600,
          impressions: 280000,
          clicks: 4500,
          ctr: 1.61,
          roas: 1.5,
          status: 'needs_improvement',
        },
        {
          id: '4',
          name: 'Limited Time Offer Banner',
          type: 'image',
          spend: 1500,
          impressions: 520000,
          clicks: 18000,
          ctr: 3.46,
          roas: 2.9,
          status: 'top_performer',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = creatives.filter((c) => {
    if (filter === 'top_performers') return c.status === 'top_performer';
    if (filter === 'underperformers') return c.status === 'needs_improvement';
    return true;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'top_performer')
      return <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded text-xs border border-green-700">🚀 Top Performer</span>;
    if (status === 'good')
      return <span className="text-blue-400 bg-blue-900/30 px-2 py-1 rounded text-xs border border-blue-700">✅ Good</span>;
    return <span className="text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded text-xs border border-yellow-700">⚠️ Needs Review</span>;
  };

  if (loading) {
    return <div className="text-slate-400">Loading creatives...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Creatives</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('top_performers')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'top_performers' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Top Performers
          </button>
          <button
            onClick={() => setFilter('underperformers')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'underperformers' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Needs Review
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 border border-slate-700 text-center">
          <p className="text-slate-400">No creatives found for this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((creative) => (
            <div key={creative.id} className="glass rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                {/* Creative Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{creative.name}</h3>
                      <p className="text-sm text-slate-400">Type: {creative.type}</p>
                    </div>
                  </div>
                  <div className="mt-3">{getStatusBadge(creative.status)}</div>
                </div>

                {/* Metrics */}
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Spend</p>
                    <p className="text-lg font-bold text-white">${creative.spend.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">CTR</p>
                    <p className="text-lg font-bold text-white">{creative.ctr.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">ROAS</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{creative.roas.toFixed(2)}x</span>
                      {creative.status === 'top_performer' && <TrendingUp size={16} className="text-green-400" />}
                      {creative.status === 'needs_improvement' && <TrendingDown size={16} className="text-red-400" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Impressions</p>
                    <p className="text-lg font-bold text-white">{(creative.impressions / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Clicks</p>
                    <p className="text-lg font-bold text-white">{creative.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
