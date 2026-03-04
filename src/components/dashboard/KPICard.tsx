'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Skeleton from '@/components/ui/Skeleton'

interface KPICardProps {
  title: string
  value: string
  change?: number
  icon: LucideIcon
  isLoading?: boolean
  invertChange?: boolean // For CPC/CPA where lower is better
}

export default function KPICard({ title, value, change, icon: Icon, isLoading, invertChange }: KPICardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    )
  }

  const isPositive = change !== undefined ? (invertChange ? change <= 0 : change >= 0) : null
  const changeText = change !== undefined
    ? `${change >= 0 ? '+' : ''}${(change * 100).toFixed(1)}%`
    : null

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 hover:border-[#2a2a2a] transition-colors duration-150">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#888888] text-xs font-medium uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#222222] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#444444]" />
        </div>
      </div>
      <div className="font-mono text-2xl font-semibold text-white tracking-tight mb-1.5">
        {value}
      </div>
      {changeText && (
        <div className={cn(
          'flex items-center gap-1 text-xs font-medium',
          isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {changeText} vs prev period
        </div>
      )}
    </div>
  )
}
