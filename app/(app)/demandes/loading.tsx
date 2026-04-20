import { PageShell } from '@/components/layout/PageShell'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function DemandesLoading() {
  return (
    <PageShell>
      <div className="flex items-center justify-between pt-2 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-28 rounded-[var(--radius-md)]" />
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-11 rounded-[var(--radius-md)]" />
          <Skeleton className="h-11 rounded-[var(--radius-md)]" />
        </div>
        <Skeleton className="h-11 rounded-[var(--radius-md)]" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map(i => <SkeletonCard key={i} lines={3} />)}
      </div>
    </PageShell>
  )
}