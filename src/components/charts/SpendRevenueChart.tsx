'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { DailyInsight } from '@/lib/types'
import { formatCurrency, formatROAS } from '@/lib/utils'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const spend = payload.find(p => p.name === 'Spend')?.value || 0
  const revenue = payload.find(p => p.name === 'Revenue')?.value || 0
  const roas = spend > 0 ? revenue / spend : 0

  return (
    <div className="bg-[#111111] border border-[#333333] rounded-lg p-3 shadow-xl">
      <p className="text-[#888888] text-xs mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs flex justify-between gap-4" style={{ color: p.color }}>
          <span>{p.name}</span>
          <span className="font-mono font-medium">{formatCurrency(p.value)}</span>
        </p>
      ))}
      <div className="mt-2 pt-2 border-t border-[#222222]">
        <p className="text-xs text-[#888888] flex justify-between gap-4">
          <span>ROAS</span>
          <span className="font-mono text-[#e8e8e8]">{formatROAS(roas)}</span>
        </p>
      </div>
    </div>
  )
}

export default function SpendRevenueChart({ data }: { data: DailyInsight[] }) {
  const formatted = data.map(d => ({
    date: d.date.slice(5), // MM-DD
    Spend: d.spend,
    Revenue: d.revenue,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#888888', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={Math.floor(formatted.length / 6)}
        />
        <YAxis
          tick={{ fill: '#888888', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `$${((v as number) / 1000).toFixed(0)}k`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#888888' }} />
        <Line type="monotone" dataKey="Spend" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
