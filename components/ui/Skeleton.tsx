import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'rounded-[var(--radius-sm)] animate-shimmer',
        className
      )}
    />
  )
}

export function SkeletonCard({ lines = 3 }: SkeletonProps) {
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3 }: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}
