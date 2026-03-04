'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Pause, TestTube, DollarSign, Users, Sparkles, RefreshCw, Bot, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { AssistantResponse, AssistantRecommendation, KPIs, Campaign, Creative, DateRange } from '@/lib/types'
import { getDateRange } from '@/lib/utils'

function HealthRing({ score, health }: { score: number; health: AssistantResponse['accountHealth'] }) {
  const color = { excellent: '#22c55e', good: '#3b82f6', warning: '#f59e0b', critical: '#ef4444' }[health]
  const r = 48, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ
  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#1a1a1a" strokeWidth="8" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono text-white">{score}</span>
        <span className="text-xs text-[#888888] capitalize">{health}</span>
      </div>
    </div>
  )
}

const TYPE_ICONS: Record<AssistantRecommendation['type'], React.ReactNode> = {
  scale: <TrendingUp className="w-4 h-4 text-[#22c55e]" />,
  pause: <Pause className="w-4 h-4 text-[#ef4444]" />,
  test: <TestTube className="w-4 h-4 text-[#3b82f6]" />,
  budget: <DollarSign className="w-4 h-4 text-[#f59e0b]" />,
  audience: <Users className="w-4 h-4 text-[#8b5cf6]" />,
  creative: <Sparkles className="w-4 h-4 text-[#0ea5e9]" />,
}

function RecCard({ rec }: { rec: AssistantRecommendation }) {
  const pv = { high: 'danger', medium: 'warning', low: 'neutral' }[rec.priority] as 'danger' | 'warning' | 'neutral'
  return (
    <Card padding="md" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#222222] flex items-center justify-center flex-shrink-0">{TYPE_ICONS[rec.type]}</div>
          <h3 className="text-sm font-semibold text-white leading-tight">{rec.title}</h3>
        </div>
        <Badge variant={pv} size="sm">{rec.priority.toUpperCase()}</Badge>
      </div>
      <p className="text-sm text-[#888888] leading-relaxed">{rec.insight}</p>
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
        <p className="text-xs text-[#444444] mb-1">Action</p>
        <p className="text-sm text-[#e8e8e8]">{rec.action}</p>
      </div>
      <div className="pt-2 border-t border-[#1a1a1a]">
        <p className="text-xs text-[#22c55e]">{rec.impact}</p>
      </div>
      {rec.metric && rec.metricValue && (
        <div className="flex items-center justify-between bg-[#0d0d0d] rounded-lg p-2.5">
          <span className="text-xs text-[#888888]">{rec.metric}</span>
          <span className="text-sm font-mono font-semibold text-white">{rec.metricValue}</span>
        </div>
      )}
    </Card>
  )
}

function AlertBanner({ alert, onDismiss }: { alert: AssistantResponse['alerts'][0]; onDismiss: () => void }) {
  const cfg = {
    high: { icon: <AlertTriangle className="w-4 h-4 flex-shrink-0" />, cls: 'border-[#ef444440] text-[#ef4444] bg-[#1a0a0a]' },
    medium: { icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />, cls: 'border-[#f59e0b40] text-[#f59e0b] bg-[#1a1000]' },
    low: { icon: <Info className="w-4 h-4 flex-shrink-0" />, cls: 'border-[#3b82f640] text-[#3b82f6] bg-[#0a0f1a]' },
  }[alert.severity]
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${cfg.cls}`}>
      {cfg.icon}
      <p className="text-sm text-[#e8e8e8] flex-1">{alert.message}</p>
      <button onClick={onDismiss} className="text-[#444444] hover:text-[#888888]"><X className="w-4 h-4" /></button>
    </div>
  )
}

export default function AssistantPage() {
  const [result, setResult] = useState<AssistantResponse | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())

  const generate = async () => {
    setGenerating(true); setError(null)
    try {
      const el = document.querySelector('[data-date-preset]')
      const preset = (el?.getAttribute('data-date-preset') || '30d') as DateRange['preset']
      const dateRange = getDateRange(preset)
      const [ir, cr, ar] = await Promise.all([
        fetch(`/api/meta/insights?preset=${preset}`),
        fetch(`/api/meta/campaigns?preset=${preset}`),
        fetch(`/api/meta/creatives?preset=${preset}`),
      ])
      const insights = await ir.json()
      const campaigns: Campaign[] = await cr.json()
      const creatives: Creative[] = await ar.json()
      if (!insights.kpis) throw new Error('No account data available')
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountData: insights.kpis as KPIs, campaigns, creatives, dateRange }),
      })
      if (!res.ok) throw new Error('Failed to generate analysis')
      const data = await res.json()
      setResult(data); setDismissed(new Set())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setGenerating(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { generate() }, [])

  const visible = result?.alerts.filter((_, i) => !dismissed.has(i)) || []
  const order = { high: 0, medium: 1, low: 2 }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white tracking-tight">AI Assistant</h1>
          <div className="flex items-center gap-1.5 bg-[#111111] border border-[#222222] px-2.5 py-1 rounded-full">
            <Bot className="w-3 h-3 text-[#3b82f6]" />
            <span className="text-xs text-[#888888]">Powered by Claude</span>
          </div>
        </div>
        <button onClick={generate} disabled={generating}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#111111] border border-[#333333] text-[#e8e8e8] rounded-lg hover:border-[#444444] transition-all disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

      {error && <div className="bg-[#1a0a0a] border border-[#ef444440] rounded-xl p-4 text-[#ef4444] text-sm">{error} — Check ANTHROPIC_API_KEY is configured.</div>}

      {generating && !result && (
        <div className="space-y-4">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 flex items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-[#1a1a1a] animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-[#1a1a1a] rounded animate-pulse w-1/2" />
              <div className="h-3 bg-[#1a1a1a] rounded animate-pulse" />
              <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-3/4" />
              <p className="text-xs text-[#444444] mt-2">Analyzing your account data with Claude...</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl p-6 h-48 space-y-3">
                <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-3/4" />
                <div className="h-2 bg-[#1a1a1a] rounded animate-pulse" />
                <div className="h-2 bg-[#1a1a1a] rounded animate-pulse w-5/6" />
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <>
          <Card padding="lg">
            <div className="flex items-center gap-8">
              <HealthRing score={result.healthScore} health={result.accountHealth} />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-2 capitalize">{result.accountHealth} Health</h2>
                <p className="text-[#888888] text-sm leading-relaxed">{result.healthSummary}</p>
                <div className="flex gap-6 mt-4">
                  <div><p className="text-xs text-[#444444]">Recommendations</p><p className="text-xl font-mono font-bold text-white">{result.recommendations.length}</p></div>
                  <div><p className="text-xs text-[#444444]">High Priority</p><p className="text-xl font-mono font-bold text-[#ef4444]">{result.recommendations.filter(r => r.priority === 'high').length}</p></div>
                  <div><p className="text-xs text-[#444444]">Alerts</p><p className="text-xl font-mono font-bold text-[#f59e0b]">{result.alerts.length}</p></div>
                </div>
              </div>
            </div>
          </Card>

          {visible.length > 0 && (
            <div className="space-y-2">
              {visible.map((a, i) => <AlertBanner key={i} alert={a} onDismiss={() => setDismissed(p => new Set([...p, result.alerts.indexOf(a)]))} />)}
            </div>
          )}

          <div>
            <h2 className="text-sm font-medium text-[#888888] mb-3">Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...result.recommendations].sort((a,b) => order[a.priority] - order[b.priority]).map((rec,i) => <RecCard key={i} rec={rec} />)}
            </div>
          </div>
          <p className="text-xs text-[#444444] text-center">Generated {new Date(result.generatedAt).toLocaleTimeString()} · Click Regenerate for a fresh analysis</p>
        </>
      )}
    </div>
  )
}
