'use client'

import { RefreshCw } from 'lucide-react'
import { useAuth } from './AuthContext'
import { getGreeting, getPresetLabel } from '@/lib/utils'
import type { DateRange } from '@/lib/types'

interface HeaderProps {
  dateRange: DateRange
  onDateRangeChange: (preset: DateRange['preset']) => void
  onRefresh: () => void
  isRefreshing?: boolean
}

const presets: DateRange['preset'][] = ['7d', '14d', '30d', '90d', 'this_month', 'last_month']

export default function Header({ dateRange, onDateRangeChange, onRefresh, isRefreshing }: HeaderProps) {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const greeting = getGreeting()

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#1a1a1a] bg-[#080808] sticky top-0 z-10">
      <div>
        <span className="text-[#e8e8e8] font-medium text-sm">
          {greeting}, <span className="text-white">{firstName}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Date range selector */}
        <select
          value={dateRange.preset}
          onChange={e => onDateRangeChange(e.target.value as DateRange['preset'])}
          className="bg-[#111111] border border-[#333333] text-[#e8e8e8] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2563eb] cursor-pointer"
        >
          {presets.map(p => (
            <option key={p} value={p}>{getPresetLabel(p)}</option>
          ))}
        </select>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#333333] bg-[#111111] text-[#888888] hover:text-[#e8e8e8] hover:border-[#444444] transition-all duration-150"
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  )
}
