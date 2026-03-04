'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          router.push('/')
        }
      } catch {
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.04em', color: '#ffffff', marginBottom: '24px' }}>AVAIL</div>
          <div style={{ width: '32px', height: '32px', border: '2px solid #222', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
