import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
  children: React.ReactNode
}

export default function Badge({ variant = 'neutral', size = 'sm', className, children }: BadgeProps) {
  const base = 'inline-flex items-center font-medium rounded-full'

  const variants = {
    success: 'bg-[#22c55e15] text-[#22c55e] border border-[#22c55e30]',
    warning: 'bg-[#f59e0b15] text-[#f59e0b] border border-[#f59e0b30]',
    danger: 'bg-[#ef444415] text-[#ef4444] border border-[#ef444430]',
    info: 'bg-[#3b82f615] text-[#3b82f6] border border-[#3b82f630]',
    neutral: 'bg-[#88888815] text-[#888888] border border-[#88888830]',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
  }

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
