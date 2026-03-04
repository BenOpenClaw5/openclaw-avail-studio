'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, fullWidth, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080808] disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-[#2563eb] text-white border-transparent hover:bg-[#1d4ed8] focus:ring-[#2563eb]',
      secondary: 'bg-[#1a1a1a] text-[#e8e8e8] border-[#333333] hover:bg-[#222222] hover:border-[#444444] focus:ring-[#333333]',
      ghost: 'bg-transparent text-[#e8e8e8] border-[#333333] hover:bg-[#1a1a1a] hover:text-white focus:ring-[#333333]',
      danger: 'bg-transparent text-[#ef4444] border-[#ef444440] hover:bg-[#1a0a0a] hover:border-[#ef4444] focus:ring-[#ef4444]',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
