import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCampaigns } from '@/lib/meta-api'
import { mockCampaigns } from '@/lib/mock-data'
import { getDateRange } from '@/lib/utils'
import type { DateRange } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const preset = (searchParams.get('preset') || '30d') as DateRange['preset']
  const dateRange = getDateRange(preset)
  if (process.env.USE_MOCK_DATA === 'true') {
    return NextResponse.json(mockCampaigns)
  }
  const cookieStore = await cookies()
  const token = cookieStore.get('meta_access_token')?.value
  const accountId = searchParams.get('accountId')
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!accountId) return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
  try {
    const campaigns = await getCampaigns(token, accountId, dateRange)
    return NextResponse.json(campaigns)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch campaigns'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
