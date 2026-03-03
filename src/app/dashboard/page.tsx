'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface KPI {
  label: string;
  value: string;
  change?: string;
  icon?: string;
}

const mockData = [
  { date: 'Mon', spend: 1200, revenue: 2400, clicks: 240, impressions: 2210 },
  { date: 'Tue', spend: 1300, revenue: 2210, clicks: 221, impressions: 2290 },
  { date: 'Wed', spend: 1100, revenue: 2290, clicks: 229, impressions: 2000 },
  { date: 'Thu', spend: 1400, revenue: 2000, clicks: 200, impressions: 2181 },
  { date: 'Fri', spend: 1600, revenue: 2181, clicks: 218, impressions: 2500 },
  { date: 'Sat', spend: 1500, revenue: 2500, clicks: 250, impressions: 2100 },
  { date: 'Sun', spend: 1800, revenue: 2100, clicks: 210, impressions: 2290 },
];

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [chartData, setChartData] = useState(mockData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching real data from Meta API
    setTimeout(() => {
      setKpis([
        { label: 'Spend', value: '$9,910', change: '+12%', icon: '💰' },
        { label: 'Revenue', value: '$16,681', change: '+8%', icon: '📈' },
        { label: 'ROAS', value: '1.68x', change: '+5%', icon: '🎯' },
        { label: 'CTR', value: '2.4%', change: '-1%', icon: '👆' },
        { label: 'CPC', value: '$0.84', change: '+3%', icon: '💵' },
        { label: 'CPA', value: '$12.50', change: '-2%', icon: '📊' },
        { label: 'Purchases', value: '798', change: '+15%', icon: '🛒' },
        { label: 'Impressions', value: '15.7M', change: '+9%', icon: '👁️' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium mb-1">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-white mb-2">{kpi.value}</h3>
                {kpi.change && (
                  <div className={`text-sm flex items-center gap-1 ${
                    kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp size={14} />
                    {kpi.change} vs last week
                  </div>
                )}
              </div>
              <div className="text-3xl">{kpi.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spend & Revenue */}
        <div className="glass rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="spend" stroke="#3b82f6" name="Spend ($)" />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Clicks & Impressions */}
        <div className="glass rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Engagement Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="clicks" fill="#6366f1" name="Clicks" />
              <Bar dataKey="impressions" fill="#f59e0b" name="Impressions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Note */}
      <div className="glass rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400 text-sm">
          📊 This dashboard is pulling mock data for demonstration. Once you connect a real Meta ad account with data, these metrics will update automatically.
        </p>
      </div>
    </div>
  );
}
