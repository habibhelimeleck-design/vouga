import { PageShell } from '@/components/layout/PageShell'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function TrajetsLoading() {
  return (
    <PageShell>
      <div className="flex items-center justify-between pt-2 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-10 w-24 rounded-[var(--radius-md)]" />
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-11 rounded-[var(--radius-md)]" />
          <Skeleton className="h-11 rounded-[var(--radius-md)]" />
        </div>
        <Skeleton className="h-11 rounded-[var(--radius-md)]" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map(i => <SkeletonCard key={i} lines={2} />)}
      </div>
    </PageShell>
  )
}