'use client'

import { useState, useEffect } from 'react'
import type { DailyInsight, KPIs, DateRange } from '@/lib/types'

interface InsightsData {
  kpis: KPIs | null
  daily: DailyInsight[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useInsights(dateRange: DateRange): InsightsData {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [daily, setDaily] = useState<DailyInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetch(`/api/meta/insights?preset=${dateRange.preset}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch insights')
        return res.json()
      })
      .then(data => {
        if (!cancelled) {
          setKpis(data.kpis)
          setDaily(data.daily || [])
          setIsLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [dateRange.preset, tick])

  return { kpis, daily, isLoading, error, refetch: () => setTick(t => t + 1) }
}
