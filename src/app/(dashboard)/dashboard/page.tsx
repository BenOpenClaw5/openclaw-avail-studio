'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, MousePointer, ShoppingCart, Eye, Zap, BarChart2, Target } from 'lucide-react'
import Card from '@/components/ui/Card'
import KPICard from '@/components/dashboard/KPICard'
import SpendRevenueChart from '@/components/charts/SpendRevenueChart'
import ROASChart from '@/components/charts/ROASChart'
import CTRChart from '@/components/charts/CTRChart'
import CampaignBarChart from '@/components/charts/CampaignBarChart'
import type { KPIs, DailyInsight, Campaign, DateRange } from '@/lib/types'
import { formatCurrency, formatNumber, formatPercent, formatROAS, getDateRange } from '@/lib/utils'

function getInsightStrings(kpis: KPIs, daily: DailyInsight[], campaigns: Campaign[]): string[] {
  if (!daily.length || !kpis) return []

  const insights: string[] = []

  // Best day
  const bestDay = daily.reduce((best, d) => d.revenue > best.revenue ? d : best, daily[0])
  insights.push(`Best day: ${new Date(bestDay.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} with ${formatCurrency(bestDay.revenue)} revenue at ${formatROAS(bestDay.roas)} ROAS`)

  // CTR trend (compare first half vs second half)
  const mid = Math.floor(daily.length / 2)
  const firstHalfCTR = daily.slice(0, mid).reduce((s, d) => s + d.ctr, 0) / mid
  const secondHalfCTR = daily.slice(mid).reduce((s, d) => s + d.ctr, 0) / (daily.length - mid)
  const ctrChange = ((secondHalfCTR - firstHalfCTR) / firstHalfCTR) * 100
  insights.push(`CTR has ${ctrChange >= 0 ? 'improved' : 'declined'} ${Math.abs(ctrChange).toFixed(1)}% over the period`)

  // Top campaign
  if (campaigns.length) {
    const top = campaigns.reduce((best, c) => c.revenue > best.revenue ? c : best, campaigns[0])
    const pct = kpis.revenue > 0 ? ((top.revenue / kpis.revenue) * 100).toFixed(0) : '0'
    insights.push(`Top campaign "${top.name}" drove ${pct}% of total revenue`)
  }

  return insights
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [daily, setDaily] = useState<DailyInsight[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    // Read preset from layout via data attribute
    const layout = document.querySelector('[data-date-preset]')
    const preset = (layout?.getAttribute('data-date-preset') || '30d') as DateRange['preset']

    const load = async () => {
      setIsLoading(true)
      try {
        const [insightsRes, campaignsRes] = await Promise.all([
          fetch(`/api/meta/insights?preset=${preset}`),
          fetch(`/api/meta/campaigns?preset=${preset}`),
        ])
        if (insightsRes.ok) {
          const data = await insightsRes.json()
          setKpis(data.kpis)
          setDaily(data.daily || [])
        }
        if (campaignsRes.ok) {
          setCampaigns(await campaignsRes.json())
        }
        setLastUpdated(new Date())
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // Suppress unused import warnings - formatNumber and getDateRange are used via formatNumber below
  void formatNumber
  void getDateRange

  const insights = kpis && daily.length ? getInsightStrings(kpis, daily, campaigns) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Dashboard</h1>
          {lastUpdated && (
            <p className="text-xs text-[#888888] mt-0.5">
              Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Spend" value={kpis ? formatCurrency(kpis.spend) : '—'} change={kpis?.spendChange} icon={DollarSign} isLoading={isLoading} />
        <KPICard title="Total Revenue" value={kpis ? formatCurrency(kpis.revenue) : '—'} change={kpis?.revenueChange} icon={TrendingUp} isLoading={isLoading} />
        <KPICard title="ROAS" value={kpis ? formatROAS(kpis.roas) : '—'} change={kpis?.roasChange} icon={Target} isLoading={isLoading} />
        <KPICard title="CTR" value={kpis ? formatPercent(kpis.ctr) : '—'} change={kpis?.ctrChange} icon={MousePointer} isLoading={isLoading} />
        <KPICard title="CPC" value={kpis ? formatCurrency(kpis.cpc) : '—'} change={kpis?.cpcChange} icon={Zap} isLoading={isLoading} invertChange />
        <KPICard title="CPA" value={kpis ? formatCurrency(kpis.cpa) : '—'} change={kpis?.cpaChange} icon={BarChart2} isLoading={isLoading} invertChange />
        <KPICard title="Purchases" value={kpis ? formatNumber(kpis.purchases) : '—'} change={kpis?.purchasesChange} icon={ShoppingCart} isLoading={isLoading} />
        <KPICard title="Impressions" value={kpis ? formatNumber(kpis.impressions) : '—'} change={kpis?.impressionsChange} icon={Eye} isLoading={isLoading} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-3" padding="md">
          <h2 className="text-sm font-medium text-[#888888] mb-4">Spend vs Revenue</h2>
          {isLoading ? (
            <div className="h-60 bg-[#1a1a1a] rounded-lg animate-pulse" />
          ) : daily.length > 0 ? (
            <SpendRevenueChart data={daily} />
          ) : (
            <div className="h-60 flex items-center justify-center text-[#444444] text-sm">No data available</div>
          )}
        </Card>
        <Card className="col-span-2" padding="md">
          <h2 className="text-sm font-medium text-[#888888] mb-4">ROAS Trend</h2>
          {isLoading ? (
            <div className="h-60 bg-[#1a1a1a] rounded-lg animate-pulse" />
          ) : daily.length > 0 ? (
            <ROASChart data={daily} />
          ) : (
            <div className="h-60 flex items-center justify-center text-[#444444] text-sm">No data available</div>
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <Card padding="md">
          <h2 className="text-sm font-medium text-[#888888] mb-4">CTR Trend</h2>
          {isLoading ? (
            <div className="h-60 bg-[#1a1a1a] rounded-lg animate-pulse" />
          ) : daily.length > 0 ? (
            <CTRChart data={daily} />
          ) : (
            <div className="h-60 flex items-center justify-center text-[#444444] text-sm">No data available</div>
          )}
        </Card>
        <Card padding="md">
          <h2 className="text-sm font-medium text-[#888888] mb-4">Top Campaigns by Spend</h2>
          {isLoading ? (
            <div className="h-60 bg-[#1a1a1a] rounded-lg animate-pulse" />
          ) : campaigns.length > 0 ? (
            <CampaignBarChart campaigns={campaigns} />
          ) : (
            <div className="h-60 flex items-center justify-center text-[#444444] text-sm">No campaign data</div>
          )}
        </Card>
      </div>

      {/* Quick Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <Card key={i} padding="md">
              <p className="text-sm text-[#888888] leading-relaxed">{insight}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
