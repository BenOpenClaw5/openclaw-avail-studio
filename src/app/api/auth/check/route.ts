import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const verifyCache = new Map<string, { data: object; expires: number }>()

export async function GET() {
  if (process.env.USE_MOCK_DATA === 'true') {
    const mockUser = { id: 'mock_user_123', name: 'Demo User', email: 'demo@example.com' }
    return NextResponse.json({ authenticated: true, user: mockUser })
  }
  const cookieStore = await cookies()
  const token = cookieStore.get('meta_access_token')?.value
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  const cached = verifyCache.get(token)
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ authenticated: true, user: cached.data })
  }
  if (process.env.USE_MOCK_DATA === 'true') {
    const mockUser = { id: 'mock_user_123', name: 'Demo User', email: 'demo@example.com' }
    verifyCache.set(token, { data: mockUser, expires: Date.now() + 5 * 60 * 1000 })
    return NextResponse.json({ authenticated: true, user: mockUser })
  }
  try {
    const res = await fetch('https://graph.facebook.com/me?fields=id,name,email&access_token=' + token)
    if (!res.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    const userData = await res.json()
    if (!userData.id) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    verifyCache.set(token, { data: userData, expires: Date.now() + 5 * 60 * 1000 })
    return NextResponse.json({ authenticated: true, user: userData })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
