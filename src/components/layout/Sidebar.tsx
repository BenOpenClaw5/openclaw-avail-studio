'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Megaphone, Image, Bot, FileText, Settings, LogOut, Circle } from 'lucide-react'
import { useAuth } from './AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { href: '/creatives', icon: Image, label: 'Creatives' },
  { href: '/assistant', icon: Bot, label: 'Assistant' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="w-60 flex-shrink-0 h-screen sticky top-0 bg-[#080808] border-r border-[#1a1a1a] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#1a1a1a]">
        <div className="text-white font-bold text-xl tracking-[-0.04em]">AVAIL</div>
        <div className="text-[#444444] text-xs tracking-[0.12em] font-medium mt-0.5">STUDIO</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                'relative',
                isActive
                  ? 'text-white bg-[#111111]'
                  : 'text-[#888888] hover:text-[#e8e8e8] hover:bg-[#111111]'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#2563eb] rounded-r-full" />
              )}
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-[#3b82f6]' : '')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[#1a1a1a] space-y-3">
        <div className="px-3 flex items-center gap-2">
          <Circle className="w-2 h-2 text-[#22c55e] fill-[#22c55e] flex-shrink-0" />
          <span className="text-xs text-[#888888] truncate">
            {user?.name || 'Demo Account'}
          </span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#888888] hover:text-[#ef4444] hover:bg-[#1a0a0a] transition-all duration-150"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
