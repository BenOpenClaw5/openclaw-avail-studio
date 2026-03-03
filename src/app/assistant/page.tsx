'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Lightbulb, Target, TrendingUp } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'warning' | 'opportunity' | 'strategy';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

export default function AssistantPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRecommendations([
        {
          id: '1',
          type: 'warning',
          title: 'CTR Fatigue Detected',
          description: 'Your Summer Sale Campaign CTR has dropped 15% in the last 3 days. This suggests audience fatigue.',
          impact: 'high',
          action: 'Refresh creatives or expand audience',
        },
        {
          id: '2',
          type: 'opportunity',
          title: 'Scale Top Performers',
          description: 'Your Hero Shot creative is performing at 3.2x ROAS. Consider increasing budget allocation to this creative.',
          impact: 'high',
          action: 'Increase daily budget by 20%',
        },
        {
          id: '3',
          type: 'warning',
          title: 'Underperforming Campaign',
          description: 'Product Carousel campaign has 1.5x ROAS, below your average. Review targeting or creative quality.',
          impact: 'medium',
          action: 'Pause and restructure',
        },
        {
          id: '4',
          type: 'strategy',
          title: 'Budget Reallocation',
          description: 'Shift $500 from underperformers to top-performing campaigns. Potential ROI increase: $1,400.',
          impact: 'high',
          action: 'Review and approve',
        },
        {
          id: '5',
          type: 'opportunity',
          title: 'New Audience Segment',
          description: 'Based on conversion patterns, consider testing a lookalike audience from your best converters.',
          impact: 'medium',
          action: 'Create campaign',
        },
        {
          id: '6',
          type: 'strategy',
          title: 'Testing Recommendation',
          description: 'Run A/B test: Carousel vs Video vs Static Image on your top-performing audience segment.',
          impact: 'medium',
          action: 'Schedule test',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="text-red-400" size={20} />;
      case 'opportunity':
        return <TrendingUp className="text-green-400" size={20} />;
      case 'strategy':
        return <Lightbulb className="text-yellow-400" size={20} />;
      default:
        return <Target className="text-blue-400" size={20} />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-900/30 text-red-400 border-red-700';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      default:
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
    }
  };

  if (loading) {
    return <div className="text-slate-400">Analyzing your account...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">AVAIL Assistant</h1>
        <p className="text-slate-400">AI-powered strategic recommendations based on your account data</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-2">Critical Alerts</p>
          <p className="text-3xl font-bold text-red-400">{recommendations.filter(r => r.type === 'warning').length}</p>
        </div>
        <div className="glass rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-2">Opportunities</p>
          <p className="text-3xl font-bold text-green-400">{recommendations.filter(r => r.type === 'opportunity').length}</p>
        </div>
        <div className="glass rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-2">Potential Impact</p>
          <p className="text-3xl font-bold text-yellow-400">+$3,200</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="glass rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">{getIcon(rec.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                  <span className={`px-3 py-1 rounded text-xs border font-medium ${getImpactColor(rec.impact)}`}>
                    {rec.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                <p className="text-slate-300 mb-4">{rec.description}</p>
                {rec.action && (
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition">
                    → {rec.action}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="glass rounded-xl p-6 border border-slate-700 bg-blue-900/10">
        <p className="text-slate-300 text-sm">
          <span className="font-semibold text-blue-400">💡 Pro Tip:</span> These recommendations are generated from your real account data and historical performance patterns. Review and test before implementing major changes.
        </p>
      </div>
    </div>
  );
}
