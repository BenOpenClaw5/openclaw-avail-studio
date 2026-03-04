import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'circle' | 'chart'
}

export default function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const base = 'animate-pulse bg-[#1a1a1a] rounded'

  const variants = {
    text: 'h-4 w-full',
    card: 'h-32 w-full rounded-xl',
    circle: 'rounded-full',
    chart: 'h-64 w-full rounded-xl',
  }

  return <div className={cn(base, variants[variant], className)} />
}

export function SkeletonKPICard() {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-8 rounded-lg" variant="circle" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}
