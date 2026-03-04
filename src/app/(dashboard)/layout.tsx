'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { AuthProvider } from '@/components/layout/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { useDateRange } from '@/hooks/useDateRange'

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { preset, setPreset, dateRange } = useDateRange('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setRefreshKey(k => k + 1)
    setTimeout(() => setIsRefreshing(false), 1200)
  }

  return (
    <div className="flex h-screen bg-[#080808] overflow-hidden" data-refresh-key={refreshKey} data-date-preset={preset}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          dateRange={dateRange}
          onDateRangeChange={setPreset}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardShell>{children}</DashboardShell>
      </ToastProvider>
    </AuthProvider>
  )
}
