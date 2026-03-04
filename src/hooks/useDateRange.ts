'use client'

import { useState } from 'react'
import { getDateRange } from '@/lib/utils'
import type { DateRange } from '@/lib/types'

export function useDateRange(initial: DateRange['preset'] = '30d') {
  const [preset, setPreset] = useState<DateRange['preset']>(initial)
  const dateRange = getDateRange(preset)

  return { preset, setPreset, dateRange }
}
