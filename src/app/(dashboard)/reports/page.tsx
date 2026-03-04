'use client'

import { useState, useEffect } from 'react'
import { Download, FileJson, Printer } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import type { KPIs, DailyInsight, DateRange } from '@/lib/types'
import { formatCurrency, formatPercent, formatROAS, formatNumber, getDateRange, getPresetLabel } from '@/lib/utils'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-[#1a1a1a] hover:bg-[#141414]">
      <td className="px-4 py-2.5 text-sm text-[#888888]">{label}</td>
      <td className="px-4 py-2.5 text-sm font-mono text-white text-right">{value}</td>
    </tr>
  )
}

export default function ReportsPage() {
  const { toast } = useToast()
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [daily, setDaily] = useState<DailyInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [preset, setPreset] = useState<DateRange['preset']>('30d')
  const [showDaily, setShowDaily] = useState(false)

  useEffect(() => {
    const el = document.querySelector('[data-date-preset]')
    const p = (el?.getAttribute('data-date-preset') || '30d') as DateRange['preset']
    setPreset(p)
    fetch(`/api/meta/insights?preset=${p}`)
      .then(r => r.json())
      .then(data => { setKpis(data.kpis); setDaily(data.daily || []); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }, [])

  const exportCSV = () => {
    if (!daily.length) return
    const headers = ['Date','Spend','Revenue','ROAS','Impressions','Clicks','CTR','CPC','Purchases']
    const rows = daily.map(d => [d.date,d.spend.toFixed(2),d.revenue.toFixed(2),d.roas.toFixed(2),d.impressions,d.clicks,(d.ctr*100).toFixed(2)+'%',d.cpc.toFixed(2),d.purchases])
    if (kpis) rows.push(['TOTAL',kpis.spend.toFixed(2),kpis.revenue.toFixed(2),kpis.roas.toFixed(2),kpis.impressions,kpis.clicks,(kpis.ctr*100).toFixed(2)+'%',kpis.cpc.toFixed(2),kpis.purchases])
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([[headers,...rows].map(r=>r.join(',')).join('\n')],{type:'text/csv'}))
    a.download = `avail-studio-${new Date().toISOString().split('T')[0]}.csv`
    a.click(); toast('Exported CSV', 'success')
  }

  const exportJSON = () => {
    if (!kpis) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify({generatedAt:new Date().toISOString(),dateRange:getDateRange(preset),summary:kpis,daily},null,2)],{type:'application/json'}))
    a.download = `avail-studio-${new Date().toISOString().split('T')[0]}.json`
    a.click(); toast('Exported JSON', 'success')
  }

  const dr = getDateRange(preset)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Reports</h1>
          <p className="text-xs text-[#888888] mt-0.5">{getPresetLabel(preset)} · {dr.startDate} to {dr.endDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4"/>} onClick={exportCSV} disabled={!kpis}>Export CSV</Button>
          <Button variant="secondary" size="sm" icon={<FileJson className="w-4 h-4"/>} onClick={exportJSON} disabled={!kpis}>Export JSON</Button>
          <Button variant="secondary" size="sm" icon={<Printer className="w-4 h-4"/>} onClick={()=>window.print()}>Print / PDF</Button>
        </div>
      </div>
      <Card padding="none">
        <div className="px-6 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-sm font-medium text-[#e8e8e8]">Performance Summary</h2>
          <p className="text-xs text-[#888888] mt-0.5">{getPresetLabel(preset)}</p>
        </div>
        {isLoading
          ? <div className="p-6 space-y-2">{Array.from({length:8}).map((_,i)=><div key={i} className="h-9 bg-[#1a1a1a] rounded animate-pulse"/>)}</div>
          : kpis ? (
            <table className="w-full"><tbody>
              <Row label="Total Spend" value={formatCurrency(kpis.spend)} />
              <Row label="Total Revenue" value={formatCurrency(kpis.revenue)} />
              <Row label="ROAS" value={formatROAS(kpis.roas)} />
              <Row label="Impressions" value={formatNumber(kpis.impressions)} />
              <Row label="Clicks" value={formatNumber(kpis.clicks)} />
              <Row label="CTR" value={formatPercent(kpis.ctr)} />
              <Row label="CPC" value={formatCurrency(kpis.cpc)} />
              <Row label="CPM" value={formatCurrency(kpis.cpm)} />
              <Row label="Purchases" value={formatNumber(kpis.purchases)} />
              <Row label="CPA" value={formatCurrency(kpis.cpa)} />
            </tbody></table>
          ) : <p className="p-6 text-[#888888] text-sm">No data available.</p>
        }
      </Card>
      {daily.length > 0 && (
        <Card padding="none">
          <button className="w-full flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] hover:bg-[#141414]" onClick={()=>setShowDaily(s=>!s)}>
            <div><h2 className="text-sm font-medium text-[#e8e8e8] text-left">Daily Breakdown</h2><p className="text-xs text-[#888888] mt-0.5">{daily.length} days</p></div>
            <span className="text-xs text-[#888888]">{showDaily?'Collapse ↑':'Expand ↓'}</span>
          </button>
          {showDaily && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0d0d0d]">
                  <tr>{['Date','Spend','Revenue','ROAS','Impressions','Clicks','CTR','Purchases'].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-[#888888] uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {daily.map((d,i) => (
                    <tr key={d.date} className={`border-b border-[#1a1a1a] hover:bg-[#141414] ${i%2===0?'bg-[#080808]':'bg-[#0d0d0d]'}`}>
                      <td className="px-4 py-2 text-xs text-[#888888]">{d.date}</td>
                      <td className="px-4 py-2 text-xs font-mono text-[#e8e8e8]">{formatCurrency(d.spend)}</td>
                      <td className="px-4 py-2 text-xs font-mono text-[#e8e8e8]">{formatCurrency(d.revenue)}</td>
                      <td className="px-4 py-2 text-xs font-mono" style={{color:d.roas>=3?'#22c55e':d.roas>=1?'#f59e0b':'#ef4444'}}>{formatROAS(d.roas)}</td>
                      <td className="px-4 py-2 text-xs font-mono text-[#888888]">{formatNumber(d.impressions)}</td>
                      <td className="px-4 py-2 text-xs font-mono text-[#888888]">{formatNumber(d.clicks)}</td>
                      <td className="px-4 py-2 text-xs font-mono text-[#888888]">{formatPercent(d.ctr)}</td>
                      <td className="px-4 py-2 text-xs font-mono text-[#888888]">{d.purchases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
