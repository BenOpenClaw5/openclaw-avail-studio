import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAdAccounts } from '@/lib/meta-api'
import { mockAccount } from '@/lib/mock-data'

export async function GET() {
  if (process.env.USE_MOCK_DATA === 'true') {
    return NextResponse.json([mockAccount])
  }
  const cookieStore = await cookies()
  const token = cookieStore.get('meta_access_token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  try {
    const accounts = await getAdAccounts(token)
    return NextResponse.json(accounts)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch accounts'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
