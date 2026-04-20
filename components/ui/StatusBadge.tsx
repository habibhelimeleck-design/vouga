import { cn } from '@/lib/utils/cn'
import { type ParcelStatus, PARCEL_STATUS_LABELS } from '@/types'

interface StatusBadgeProps {
  status: ParcelStatus
  className?: string
}

const statusStyles: Record<ParcelStatus, string> = {
  created:    'bg-surface-3 text-muted border-border',
  accepted:   'bg-info/10 text-info border-info/20',
  picked_up:  'bg-accent/10 text-accent border-accent/20',
  in_transit: 'bg-accent/15 text-accent border-accent/30',
  delivered:  'bg-success/10 text-success border-success/20',
  dispute:    'bg-destructive/10 text-destructive border-destructive/20',
}

const statusDots: Record<ParcelStatus, string> = {
  created:    'bg-subtle',
  accepted:   'bg-info',
  picked_up:  'bg-accent',
  in_transit: 'bg-accent animate-[pulse-accent_1.5s_ease-in-out_infinite]',
  delivered:  'bg-success',
  dispute:    'bg-destructive',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1',
        'text-xs font-medium rounded-[var(--radius-sm)] border',
        statusStyles[status],
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full shrink-0', statusDots[status])} aria-hidden />
      {PARCEL_STATUS_LABELS[status]}
    </span>
  )
}
