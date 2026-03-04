import { LucideIcon } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#222222] flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-[#444444]" />
        </div>
      )}
      <h3 className="text-[#e8e8e8] font-medium mb-2">{title}</h3>
      <p className="text-[#888888] text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}
