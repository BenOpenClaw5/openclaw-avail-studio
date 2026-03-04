'use client'

import { useState } from 'react'
import { useAuth } from '@/components/layout/AuthContext'
import { useToast } from '@/components/ui/Toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [defaultRange, setDefaultRange] = useState('30d')
  const [currency, setCurrency] = useState('USD')
  const [timezone, setTimezone] = useState('America/New_York')
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setIsSaving(false)
    toast('Settings saved', 'success')
  }

  const handleReconnect = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_META_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_META_REDIRECT_URI!,
      scope: 'email,public_profile,ads_read,ads_management',
      response_type: 'code',
      state: crypto.randomUUID(),
    })
    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?${params}`
  }

  const inp = 'w-full bg-[#0d0d0d] border border-[#333333] text-[#e8e8e8] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#2563eb]'
  const lbl = 'block text-xs font-medium text-[#888888] mb-1.5'
  const row = 'flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0'

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-white tracking-tight">Settings</h1>

      <Card padding="none">
        <div className="px-6 py-4 border-b border-[#1a1a1a]"><h2 className="text-sm font-medium text-[#e8e8e8]">Profile</h2></div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#222222] flex items-center justify-center text-lg font-semibold text-[#888888]">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name || 'Demo User'}</p>
              <p className="text-xs text-[#888888]">{user?.email || 'demo@example.com'}</p>
            </div>
          </div>
          <div className={row}><span className="text-sm text-[#888888]">Connected via</span><span className="text-sm text-[#e8e8e8]">Meta / Facebook</span></div>
          <div className={row}><span className="text-sm text-[#888888]">Account ID</span><span className="text-sm font-mono text-[#e8e8e8]">{user?.id || 'mock_user_123'}</span></div>
        </div>
      </Card>

      <Card padding="none">
        <div className="px-6 py-4 border-b border-[#1a1a1a]"><h2 className="text-sm font-medium text-[#e8e8e8]">Preferences</h2></div>
        <div className="px-6 py-5 space-y-4">
          <div><label className={lbl}>Default Date Range</label>
            <select value={defaultRange} onChange={e=>setDefaultRange(e.target.value)} className={inp}>
              <option value="7d">Last 7 days</option><option value="14d">Last 14 days</option>
              <option value="30d">Last 30 days</option><option value="90d">Last 90 days</option>
              <option value="this_month">This month</option><option value="last_month">Last month</option>
            </select></div>
          <div><label className={lbl}>Currency</label>
            <select value={currency} onChange={e=>setCurrency(e.target.value)} className={inp}>
              <option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option><option value="CAD">CAD — Canadian Dollar</option>
            </select></div>
          <div><label className={lbl}>Timezone</label>
            <select value={timezone} onChange={e=>setTimezone(e.target.value)} className={inp}>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
            </select></div>
          <Button onClick={handleSave} loading={isSaving} size="sm">Save Preferences</Button>
        </div>
      </Card>

      <Card padding="none">
        <div className="px-6 py-4 border-b border-[#1a1a1a]"><h2 className="text-sm font-medium text-[#e8e8e8]">Meta Connection</h2></div>
        <div className="px-6 py-5">
          <div className={row}><span className="text-sm text-[#888888]">Status</span><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#22c55e]"/><span className="text-sm text-[#22c55e]">Connected</span></div></div>
          <div className={row}><div><p className="text-sm text-[#888888]">Connected as</p><p className="text-sm text-[#e8e8e8]">{user?.name || 'Demo User'}</p></div><Button variant="secondary" size="sm" onClick={handleReconnect}>Reconnect</Button></div>
          <div className="pt-4">
            {!showConfirm
              ? <button onClick={()=>setShowConfirm(true)} className="text-sm text-[#888888] hover:text-[#ef4444] transition-colors">Disconnect account</button>
              : <div className="bg-[#1a0a0a] border border-[#ef444430] rounded-lg p-4 space-y-3">
                  <p className="text-sm text-[#e8e8e8]">Are you sure? You will be logged out.</p>
                  <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={logout}>Yes, disconnect</Button>
                    <Button variant="ghost" size="sm" onClick={()=>setShowConfirm(false)}>Cancel</Button>
                  </div>
                </div>
            }
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="px-6 py-4 border-b border-[#1a1a1a]"><h2 className="text-sm font-medium text-[#e8e8e8]">About</h2></div>
        <div className="px-6 py-5">
          <div className={row}><span className="text-sm text-[#888888]">Version</span><span className="text-sm font-mono text-[#e8e8e8]">0.1.0</span></div>
          <div className={row}><span className="text-sm text-[#888888]">Build date</span><span className="text-sm font-mono text-[#e8e8e8]">2026-03-04</span></div>
          <div className="pt-3"><a href="https://developers.facebook.com/docs/marketing-api/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#3b82f6] hover:text-[#60a5fa]">Meta Marketing API Docs &#x2192;</a></div>
        </div>
      </Card>
    </div>
  )
}
