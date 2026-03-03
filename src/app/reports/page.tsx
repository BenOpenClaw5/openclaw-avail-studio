'use client';

import { useState } from 'react';
import { Download, Eye } from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last_30_days');

  const reports = [
    {
      id: '1',
      name: 'Performance Summary',
      description: 'Overview of all KPIs and metrics for the selected period',
      formats: ['PDF', 'CSV', 'JSON'],
      generated: '2026-03-03',
    },
    {
      id: '2',
      name: 'Campaign Breakdown',
      description: 'Detailed performance of each campaign with trend analysis',
      formats: ['PDF', 'CSV'],
      generated: '2026-03-03',
    },
    {
      id: '3',
      name: 'Creative Performance',
      description: 'Analysis of all active creatives ranked by ROAS and CTR',
      formats: ['PDF', 'CSV', 'JSON'],
      generated: '2026-03-02',
    },
    {
      id: '4',
      name: 'Audience Insights',
      description: 'Demographics, interests, and behaviors of engaged audiences',
      formats: ['PDF', 'CSV'],
      generated: '2026-02-28',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-4">Reports</h1>

        {/* Date Range Selector */}
        <div className="glass rounded-xl p-6 border border-slate-700 mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Date Range</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {['today', 'last_7_days', 'last_30_days', 'last_90_days', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {range === 'today' && 'Today'}
                {range === 'last_7_days' && 'Last 7 Days'}
                {range === 'last_30_days' && 'Last 30 Days'}
                {range === 'last_90_days' && 'Last 90 Days'}
                {range === 'custom' && 'Custom'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="glass rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{report.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{report.description}</p>
                <p className="text-xs text-slate-500">Last generated: {report.generated}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400">Export as:</span>
              {report.formats.map((format) => (
                <button
                  key={format}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded transition"
                >
                  <Download size={14} />
                  {format}
                </button>
              ))}
              <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition">
                <Eye size={14} />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Report Section */}
      <div className="glass rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Create Custom Report</h3>
        <p className="text-slate-400 text-sm mb-4">
          Select metrics and filters to generate a custom report tailored to your needs
        </p>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          + Create Custom Report
        </button>
      </div>
    </div>
  );
}
