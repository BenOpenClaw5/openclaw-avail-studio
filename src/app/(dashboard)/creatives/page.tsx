'use client'

import { useState, useEffect, useMemo } from 'react'
import { Grid3X3, List, Search, Image as ImageIcon } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonTable } from '@/components/ui/Skeleton'
import type { Creative, DateRange } from '@/lib/types'
import { formatCurrency, formatPercent, formatROAS } from '@/lib/utils'

type Tab = 'all' | 'top' | 'bottom' | 'paused'
type View = 'grid' | 'list'
type SortKey = 'spend' | 'roas' | 'ctr' | 'cpc' | 'purchases'

function PerfBadge({ tier }: { tier: Creative['performanceTier'] }) {
  const m = {
    top: { l: 'Scale 🚀', v: 'success' as const },
    mid: { l: 'Watch 👀', v: 'warning' as const },
    bottom: { l: 'Pause ⛔', v: 'danger' as const },
  }
  return <Badge variant={m[tier].v}>{m[tier].l}</Badge>
}

function Thumb({ c }: { c: Creative }) {
  const init = c.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  if (c.thumbnailUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={c.thumbnailUrl} alt={c.name} className="w-full h-full object-cover" />
  }
  return <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center"><span className="text-[#444444] text-sm font-medium">{init}</span></div>
}

function CreativeCard({ c }: { c: Creative }) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden hover:border-[#333333] hover:bg-[#141414] transition-all group">
      <div className="aspect-video bg-[#0d0d0d] relative overflow-hidden">
        <Thumb c={c} />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium">View Details</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-medium text-[#e8e8e8] truncate flex-1" title={c.name}>{c.name}</p>
          <PerfBadge tier={c.performanceTier} />
        </div>
        <p className="text-xs text-[#888888] truncate mb-4">{c.campaignName}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {[['Spend', formatCurrency(c.spend)], ['ROAS', formatROAS(c.roas)], ['CTR', formatPercent(c.ctr)], ['CPC', formatCurrency(c.cpc)]].map(([l, v]) => (
            <div key={l}><p className="text-xs text-[#444444]">{l}</p><p className="text-sm font-mono text-[#e8e8e8]">{v}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CreativesPage() {
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('all')
  const [view, setView] = useState<View>('grid')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('roas')

  useEffect(() => {
    const el = document.querySelector('[data-date-preset]')
    const preset = (el?.getAttribute('data-date-preset') || '30d') as DateRange['preset']
    fetch(`/api/meta/creatives?preset=${preset}`)
      .then(r => r.json())
      .then(data => { setCreatives(Array.isArray(data) ? data : []); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let r = [...creatives]
    if (tab === 'top') r = r.filter(c => c.performanceTier === 'top')
    else if (tab === 'bottom') r = r.filter(c => c.performanceTier === 'bottom')
    else if (tab === 'paused') r = r.filter(c => c.status === 'PAUSED')
    if (search) r = r.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    r.sort((a, b) => b[sortKey] - a[sortKey])
    return r
  }, [creatives, tab, search, sortKey])

  const counts = useMemo(() => ({
    top: creatives.filter(c => c.performanceTier === 'top').length,
    mid: creatives.filter(c => c.performanceTier === 'mid').length,
    bottom: creatives.filter(c => c.performanceTier === 'bottom').length,
  }), [creatives])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'top', label: 'Top Performers' },
    { key: 'bottom', label: 'Underperformers' }, { key: 'paused', label: 'Paused' },
  ]
  const th = 'px-4 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider'
  const td = 'px-4 py-3 text-sm text-[#e8e8e8]'

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight mb-4">Creatives</h1>
        {!isLoading && creatives.length > 0 && (
          <div className="flex rounded-lg overflow-hidden border border-[#222222] text-xs">
            <div className="flex-1 bg-[#22c55e10] border-r border-[#222222] px-4 py-2.5"><span className="text-[#22c55e] font-medium">{counts.top} scaling</span><span className="text-[#888888] ml-1">(ROAS &gt;3x)</span></div>
            <div className="flex-1 bg-[#f59e0b10] border-r border-[#222222] px-4 py-2.5"><span className="text-[#f59e0b] font-medium">{counts.mid} watching</span><span className="text-[#888888] ml-1">(ROAS 1-3x)</span></div>
            <div className="flex-1 bg-[#ef444410] px-4 py-2.5"><span className="text-[#ef4444] font-medium">{counts.bottom} burning</span><span className="text-[#888888] ml-1">(ROAS &lt;1.5x)</span></div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${tab === t.key ? 'bg-[#2563eb] text-white' : 'bg-[#111111] border border-[#333333] text-[#888888] hover:text-[#e8e8e8]'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444444]" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-[#111111] border border-[#333333] text-[#e8e8e8] text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2563eb] placeholder-[#444444] w-40" />
          </div>
          <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
            className="bg-[#111111] border border-[#333333] text-[#e8e8e8] text-xs rounded-lg px-2 py-1.5">
            <option value="roas">ROAS</option><option value="spend">Spend</option>
            <option value="ctr">CTR</option><option value="cpc">CPC</option><option value="purchases">Purchases</option>
          </select>
          <div className="flex border border-[#333333] rounded-lg overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-1.5 ${view === 'grid' ? 'bg-[#2563eb] text-white' : 'bg-[#111111] text-[#888888]'}`}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-1.5 ${view === 'list' ? 'bg-[#2563eb] text-white' : 'bg-[#111111] text-[#888888]'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
      {isLoading ? (
        view === 'grid'
          ? <div className="grid grid-cols-3 gap-4">{Array.from({length:6}).map((_,i) => <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden"><div className="aspect-video bg-[#1a1a1a] animate-pulse"/><div className="p-4 space-y-2"><div className="h-3 bg-[#1a1a1a] rounded animate-pulse"/><div className="h-2 bg-[#1a1a1a] rounded w-2/3 animate-pulse"/></div></div>)}</div>
          : <div className="bg-[#111111] border border-[#222222] rounded-xl p-6"><SkeletonTable rows={6}/></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No creatives found" description="No ad creatives match your filters." />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map(c => <CreativeCard key={c.id} c={c} />)}</div>
      ) : (
        <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d0d0d] border-b border-[#1a1a1a]">
                <tr><th className={th}>Creative</th><th className={th}>Campaign</th><th className={th}>Status</th><th className={`${th} text-right`}>Spend</th><th className={`${th} text-right`}>Revenue</th><th className={`${th} text-right`}>ROAS</th><th className={`${th} text-right`}>CTR</th><th className={th}>Tier</th></tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} className={`border-b border-[#1a1a1a] hover:bg-[#141414] ${i%2===0?'bg-[#080808]':'bg-[#0d0d0d]'}`}>
                    <td className={td}><div className="flex items-center gap-3"><div className="w-12 h-8 rounded overflow-hidden flex-shrink-0 bg-[#1a1a1a]"><Thumb c={c}/></div><span className="max-w-[160px] truncate" title={c.name}>{c.name}</span></div></td>
                    <td className="px-4 py-3 text-sm text-[#888888] max-w-[140px]"><span className="truncate block">{c.campaignName}</span></td>
                    <td className={td}><Badge variant={c.status==='ACTIVE'?'success':'warning'}>{c.status==='ACTIVE'?'Active':'Paused'}</Badge></td>
                    <td className={`${td} text-right font-mono`}>{formatCurrency(c.spend)}</td>
                    <td className={`${td} text-right font-mono`}>{formatCurrency(c.revenue)}</td>
                    <td className={`${td} text-right`}><span style={{color:c.roas>=3?'#22c55e':c.roas>=1.5?'#f59e0b':'#ef4444'}} className="font-mono font-medium">{formatROAS(c.roas)}</span></td>
                    <td className={`${td} text-right font-mono text-[#888888]`}>{formatPercent(c.ctr)}</td>
                    <td className={td}><PerfBadge tier={c.performanceTier}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
