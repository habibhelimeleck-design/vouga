import { PageShell } from '@/components/layout/PageShell'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function ColisLoading() {
  return (
    <PageShell>
      <div className="pt-2 pb-5 space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map(i => <SkeletonCard key={i} lines={2} />)}
      </div>
    </PageShell>
  )
}