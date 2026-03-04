'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, Megaphone } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonTable } from '@/components/ui/Skeleton'
import type { Campaign, DateRange } from '@/lib/types'
import { formatCurrency, formatPercent, formatROAS, formatNumber } from '@/lib/utils'

type SortKey = keyof Campaign
type SortDir = 'asc' | 'desc'

function StatusBadge({ status }: { status: Campaign['status'] }) {
  const map: Record<Campaign['status'], { variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string }> = {
    ACTIVE: { variant: 'success', label: 'Active' },
    PAUSED: { variant: 'warning', label: 'Paused' },
    ARCHIVED: { variant: 'neutral', label: 'Archived' },
    DELETED: { variant: 'danger', label: 'Deleted' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

function ROASCell({ roas }: { roas: number }) {
  const color = roas >= 3 ? '#22c55e' : roas >= 1 ? '#f59e0b' : '#ef4444'
  return <span style={{ color }} className="font-mono text-sm font-medium">{formatROAS(roas)}</span>
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | Campaign['status']>('ALL')
  const [sortKey, setSortKey] = useState<SortKey>('spend')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  useEffect(() => {
    const el = document.querySelector('[data-date-preset]')
    const preset = (el?.getAttribute('data-date-preset') || '30d') as DateRange['preset']
    fetch(`/api/meta/campaigns?preset=${preset}`)
      .then(r => r.json())
      .then(data => { setCampaigns(Array.isArray(data) ? data : []); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let r = [...campaigns]
    if (statusFilter !== 'ALL') r = r.filter(c => c.status === statusFilter)
    if (search) r = r.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    r.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number')
        return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return r
  }, [campaigns, statusFilter, search, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => sortKey !== k
    ? <span className="text-[#333333] ml-1 text-xs">&#8597;</span>
    : sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-1 text-[#3b82f6]" />
                        : <ChevronDown className="w-3 h-3 inline ml-1 text-[#3b82f6]" />

  const totals = useMemo(() => ({
    spend: filtered.reduce((s, c) => s + c.spend, 0),
    revenue: filtered.reduce((s, c) => s + c.revenue, 0),
    purchases: filtered.reduce((s, c) => s + c.purchases, 0),
  }), [filtered])

  const th = 'px-4 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider cursor-pointer hover:text-[#e8e8e8] select-none whitespace-nowrap'
  const td = 'px-4 py-3 text-sm'

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-white tracking-tight">Campaigns</h1>
        {!isLoading && <span className="bg-[#1a1a1a] border border-[#222222] text-[#888888] text-xs px-2 py-0.5 rounded-full">{filtered.length} of {campaigns.length}</span>}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input type="text" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-[#111111] border border-[#333333] text-[#e8e8e8] text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#2563eb] placeholder-[#444444] w-60" />
        </div>
        <div className="flex gap-1.5">
          {(['ALL', 'ACTIVE', 'PAUSED', 'ARCHIVED'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${statusFilter === s ? 'bg-[#2563eb] text-white' : 'bg-[#111111] border border-[#333333] text-[#888888] hover:text-[#e8e8e8]'}`}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        {isLoading ? <div className="p-6"><SkeletonTable rows={5} /></div>
        : filtered.length === 0 ? <EmptyState icon={Megaphone} title="No campaigns found" description="No campaigns match your filters. Try adjusting your search or date range." />
        : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d0d0d] border-b border-[#1a1a1a] sticky top-0">
                <tr>
                  <th className={th} onClick={() => handleSort('name')}>Campaign <SortIcon k="name" /></th>
                  <th className={th}>Status</th>
                  <th className={th}>Objective</th>
                  <th className={`${th} text-right`} onClick={() => handleSort('spend')}>Spend <SortIcon k="spend" /></th>
                  <th className={`${th} text-right`} onClick={() => handleSort('revenue')}>Revenue <SortIcon k="revenue" /></th>
                  <th className={`${th} text-right`} onClick={() => handleSort('roas')}>ROAS <SortIcon k="roas" /></th>
                  <th className={`${th} text-right`} onClick={() => handleSort('ctr')}>CTR <SortIcon k="ctr" /></th>
                  <th className={`${th} text-right`} onClick={() => handleSort('cpc')}>CPC <SortIcon k="cpc" /></th>
                  <th className={`${th} text-right`} onClick={() => handleSort('purchases')}>Purchases <SortIcon k="purchases" /></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} className={`border-b border-[#1a1a1a] hover:bg-[#141414] ${i % 2 === 0 ? 'bg-[#080808]' : 'bg-[#0d0d0d]'}`}>
                    <td className={td}><div className="font-medium text-[#e8e8e8] max-w-[200px] truncate" title={c.name}>{c.name}</div>{c.dailyBudget && <div className="text-xs text-[#444444]">{formatCurrency(c.dailyBudget)}/day</div>}</td>
                    <td className={td}><StatusBadge status={c.status} /></td>
                    <td className={td}><span className="text-[#888888] text-xs">{c.objective.replace(/_/g, ' ')}</span></td>
                    <td className={`${td} text-right font-mono text-[#e8e8e8]`}>{formatCurrency(c.spend)}</td>
                    <td className={`${td} text-right font-mono text-[#e8e8e8]`}>{formatCurrency(c.revenue)}</td>
                    <td className={`${td} text-right`}><ROASCell roas={c.roas} /></td>
                    <td className={`${td} text-right font-mono text-[#888888]`}>{formatPercent(c.ctr)}</td>
                    <td className={`${td} text-right font-mono text-[#888888]`}>{formatCurrency(c.cpc)}</td>
                    <td className={`${td} text-right font-mono text-[#888888]`}>{formatNumber(c.purchases)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#0d0d0d] border-t border-[#222222]">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-xs text-[#888888]">Totals ({filtered.length})</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-white">{formatCurrency(totals.spend)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-white">{formatCurrency(totals.revenue)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-white">{formatROAS(totals.spend > 0 ? totals.revenue / totals.spend : 0)}</td>
                  <td colSpan={2} />
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-white">{formatNumber(totals.purchases)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
