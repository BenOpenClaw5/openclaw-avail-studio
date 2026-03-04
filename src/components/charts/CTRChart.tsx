'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyInsight } from '@/lib/types'

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
      <p className="text-[#0ea5e9] text-sm font-mono font-medium">{payload[0].value.toFixed(2)}%</p>
    </div>
  )
}

export default function CTRChart({ data }: { data: DailyInsight[] }) {
  const formatted = data.map(d => ({ date: d.date.slice(5), CTR: d.ctr * 100 }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="ctrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} interval={Math.floor(formatted.length / 6)} />
        <YAxis tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v as number).toFixed(1)}%`} width={44} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="CTR" stroke="#0ea5e9" strokeWidth={2} fill="url(#ctrGradient)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
