'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const errorParam = searchParams.get('error')
  const errorMessages: Record<string, string> = {
    token_exchange_failed: 'Authentication failed. Please try again.',
    no_code: 'Login was cancelled.',
    server_error: 'Something went wrong. Please try again.',
  }
  const errorMessage = errorParam ? errorMessages[errorParam] || 'An error occurred. Please try again.' : null

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check')
        if (res.ok) {
          router.push('/dashboard')
          return
        }
      } catch {
        // Not authenticated
      }
      setIsChecking(false)
    }
    checkAuth()
  }, [router])

  const isMockMode = !process.env.NEXT_PUBLIC_META_APP_ID || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  const handleLogin = () => {
    if (isMockMode) {
      router.push('/dashboard')
      return
    }
    setIsLoading(true)
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_META_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_META_REDIRECT_URI!,
      scope: 'email,public_profile,ads_read,ads_management',
      response_type: 'code',
      state: crypto.randomUUID(),
    })
    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?${params}`
  }

  if (isChecking) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #222', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1 }}>
          AVAIL
        </div>
        <div style={{ fontSize: '14px', fontWeight: 400, color: '#888888', letterSpacing: '0.12em', marginTop: '4px' }}>
          STUDIO
        </div>
        <div style={{ fontSize: '13px', color: '#444444', marginTop: '12px', letterSpacing: '0.02em' }}>
          Meta Ads Intelligence Platform
        </div>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#111111',
        border: '1px solid #222222',
        borderRadius: '16px',
        padding: '32px',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Connect your Meta account
        </h1>
        <p style={{ fontSize: '14px', color: '#888888', lineHeight: 1.6, marginBottom: '28px' }}>
          Pull real-time data from your ad accounts. Analyze performance. Make better decisions.
        </p>

        {errorMessage && (
          <div style={{
            background: '#1a0a0a',
            border: '1px solid #ef444440',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#ef4444',
            fontSize: '14px',
          }}>
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 20px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'opacity 150ms ease',
            fontFamily: 'inherit',
          }}
        >
          {isLoading ? (
            <>
              <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              Connecting...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {isMockMode ? 'Enter Demo' : 'Connect with Meta'}
            </>
          )}
        </button>

        <p style={{ fontSize: '12px', color: '#444444', textAlign: 'center', marginTop: '16px' }}>
          We only read your ad data. We never post or modify anything.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '🔒', label: 'Secure OAuth' },
          { icon: '📊', label: 'Read-only access' },
          { icon: '🚫', label: 'No data selling' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#444444' }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #222', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
