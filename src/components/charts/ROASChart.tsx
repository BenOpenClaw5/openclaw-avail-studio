'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import type { DailyInsight } from '@/lib/types'
import { formatROAS } from '@/lib/utils'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111111] border border-[#333333] rounded-lg p-3 shadow-xl">
      <p className="text-[#888888] text-xs mb-1">{label}</p>
      <p className="text-[#3b82f6] text-sm font-mono font-medium">{formatROAS(payload[0].value)}</p>
    </div>
  )
}

export default function ROASChart({ data }: { data: DailyInsight[] }) {
  const formatted = data.map(d => ({ date: d.date.slice(5), ROAS: d.roas }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="roasGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} interval={Math.floor(formatted.length / 6)} />
        <YAxis tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}x`} width={36} domain={[0, 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={2} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Break-even', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
        <Area type="monotone" dataKey="ROAS" stroke="#3b82f6" strokeWidth={2} fill="url(#roasGradient)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
