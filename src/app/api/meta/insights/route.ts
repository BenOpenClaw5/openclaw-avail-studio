import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDailyInsights } from '@/lib/meta-api'
import { getMockKPIs, getMockDailyInsights } from '@/lib/mock-data'
import { getDateRange } from '@/lib/utils'
import type { DateRange } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const preset = (searchParams.get('preset') || '30d') as DateRange['preset']
  const dateRange = getDateRange(preset)
  if (process.env.USE_MOCK_DATA === 'true') {
    const kpis = getMockKPIs(dateRange.startDate, dateRange.endDate)
    const daily = getMockDailyInsights(dateRange.startDate, dateRange.endDate)
    return NextResponse.json({ kpis, daily, dateRange })
  }
  const cookieStore = await cookies()
  const token = cookieStore.get('meta_access_token')?.value
  const accountId = searchParams.get('accountId')
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!accountId) return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
  try {
    const daily = await getDailyInsights(token, accountId, dateRange)
    return NextResponse.json({ daily, dateRange })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch insights'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
