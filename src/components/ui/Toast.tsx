'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium pointer-events-auto',
              'bg-[#111111] shadow-xl shadow-black/40',
              t.type === 'success' && 'border-[#22c55e40] text-[#22c55e]',
              t.type === 'error' && 'border-[#ef444440] text-[#ef4444]',
              t.type === 'info' && 'border-[#3b82f640] text-[#3b82f6]',
            )}
            style={{ animation: 'slideIn 0.2s ease' }}
          >
            {t.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 flex-shrink-0" />}
            <span className="text-[#e8e8e8]">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="ml-2 text-[#444444] hover:text-[#888888]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px) } to { opacity: 1; transform: translateX(0) } }`}</style>
    </ToastContext.Provider>
  )
}
