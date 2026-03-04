import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const REDIRECT_URI = process.env.NEXT_PUBLIC_META_REDIRECT_URI!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://avail-studio-one.vercel.app'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  if (error || !code) {
    return NextResponse.redirect(APP_URL + '/?error=no_code')
  }
  try {
    const tokenRes = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
    })
    if (!tokenRes.ok) {
      const errData = await tokenRes.json().catch(() => ({}))
      console.error('Token exchange failed:', JSON.stringify(errData))
      return NextResponse.redirect(APP_URL + '/?error=token_exchange_failed')
    }
    const tokenData = await tokenRes.json()
    const accessToken: string = tokenData.access_token
    const meRes = await fetch('https://graph.facebook.com/me?fields=id,name,email&access_token=' + accessToken)
    const meData = await meRes.json()
    if (!meData.id) {
      return NextResponse.redirect(APP_URL + '/?error=server_error')
    }
    const supabase = getSupabase()
    if (supabase) {
      await supabase.from('users').upsert({
        meta_user_id: meData.id,
        meta_user_name: meData.name,
        meta_email: meData.email,
        access_token: accessToken,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'meta_user_id' })
    }
    const cookieStore = await cookies()
    cookieStore.set('meta_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return NextResponse.redirect(APP_URL + '/dashboard')
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(APP_URL + '/?error=server_error')
  }
}
