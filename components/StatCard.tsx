import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const variantClasses = {
    default: 'bg-card border-border',
    success: 'bg-card border-green-900/30',
    warning: 'bg-card border-yellow-900/30',
    error: 'bg-card border-red-900/30',
  }

  return (
    <div className={cn(
      'rounded-lg border p-6 space-y-2',
      variantClasses[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-foreground/60">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="text-foreground/40">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <span className={trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-foreground/40">from yesterday</span>
        </div>
      )}
    </div>
  )
}
