import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'clickable'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({ variant = 'default', padding = 'md', className, children, ...props }: CardProps) {
  const base = 'bg-[#111111] border border-[#222222] rounded-xl transition-all duration-150'

  const variants = {
    default: '',
    elevated: 'border-[#2a2a2a] shadow-lg shadow-black/40',
    clickable: 'cursor-pointer hover:border-[#333333] hover:bg-[#141414]',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div className={cn(base, variants[variant], paddings[padding], className)} {...props}>
      {children}
    </div>
  )
}
