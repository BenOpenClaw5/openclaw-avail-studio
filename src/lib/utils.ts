import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { DateRange } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toLocaleString('en-US')
}

export function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatROAS(value: number): string {
  return `${value.toFixed(2)}x`
}

export function formatChange(value: number): { text: string; positive: boolean } {
  const isPositive = value >= 0
  return {
    text: `${isPositive ? '+' : ''}${(value * 100).toFixed(1)}%`,
    positive: isPositive,
  }
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getDateRange(preset: DateRange['preset']): DateRange {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let startDate: Date
  let endDate: Date = new Date(today)
  endDate.setDate(endDate.getDate() - 1)

  switch (preset) {
    case '7d':
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 7)
      break
    case '14d':
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 14)
      break
    case '30d':
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90d':
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 90)
      break
    case 'this_month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today)
      break
    case 'last_month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    default:
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 30)
  }

  return {
    preset,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  }
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getPresetLabel(preset: DateRange['preset']): string {
  const labels: Record<DateRange['preset'], string> = {
    '7d': 'Last 7 days',
    '14d': 'Last 14 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    'this_month': 'This month',
    'last_month': 'Last month',
  }
  return labels[preset]
}
