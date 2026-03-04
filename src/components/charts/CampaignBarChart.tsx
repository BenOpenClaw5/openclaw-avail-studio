'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Campaign } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111111] border border-[#333333] rounded-lg p-3 shadow-xl">
      <p className="text-[#888888] text-xs mb-2 max-w-[160px] truncate">{label}</p>
      <p className="text-[#e8e8e8] text-sm font-mono">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

const COLORS = ['#3b82f6', '#22c55e', '#0ea5e9', '#8b5cf6']

export default function CampaignBarChart({ campaigns }: { campaigns: Campaign[] }) {
  const data = campaigns
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 6)
    .map(c => ({
      name: c.name.length > 20 ? c.name.slice(0, 20) + '…' : c.name,
      Spend: c.spend,
      roas: c.roas,
    }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${((v as number) / 1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} width={130} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="Spend" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
