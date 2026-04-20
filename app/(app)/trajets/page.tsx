import Link from 'next/link'
import { PlaneTakeoff, Plus } from 'lucide-react'
import { getTrips } from '@/lib/actions/trips'
import { GABON_CITIES } from '@/lib/constants/corridors'
import { PageShell, PageSection, EmptyState } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { TripList } from '@/components/features/TripList'

const SELECT_CLASS = [
  'w-full bg-surface-2 border border-border rounded-[var(--radius-md)]',
  'px-3 py-2.5 text-sm text-text min-h-[44px]',
  'focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10',
  'hover:border-border-strong hover:bg-surface-3',
  'transition-all duration-200',
].join(' ')

const DATE_CLASS = [
  'flex-1 bg-surface-2 border border-border rounded-[var(--radius-md)]',
  'px-3 py-2.5 text-sm text-text min-h-[44px]',
  'focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10',
  'hover:border-border-strong hover:bg-surface-3',
  'transition-all duration-200',
].join(' ')

interface PageProps {
  searchParams: Promise<{ origin?: string; destination?: string; date?: string }>
}

export default async function TrajetsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const trips = await getTrips({
    origin: params.origin,
    destination: params.destination,
    date: params.date,
  })

  const hasFilters = !!(params.origin || params.destination || params.date)

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-text">Trajets</h1>
          <p className="text-sm text-muted mt-0.5">
            {trips.length} trajet{trips.length !== 1 ? 's' : ''} disponible{trips.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/trajets/nouveau">
            <Plus className="size-4" />
            Publier
          </Link>
        </Button>
      </div>

      {/* Filtres */}
      <form method="GET" className="flex flex-col gap-2 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <select name="origin" defaultValue={params.origin ?? ''} className={SELECT_CLASS}>
            <option value="">Départ…</option>
            {GABON_CITIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select name="destination" defaultValue={params.destination ?? ''} className={SELECT_CLASS}>
            <option value="">Arrivée…</option>
            {GABON_CITIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <input
            name="date"
            type="date"
            defaultValue={params.date ?? ''}
            className={DATE_CLASS}
          />
          <Button type="submit" size="sm" className="shrink-0">
            Filtrer
          </Button>
          {hasFilters && (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href="/trajets">Effacer</Link>
            </Button>
          )}
        </div>
      </form>

      {/* Liste */}
      <PageSection>
        {trips.length === 0 ? (
          <EmptyState
            icon={<PlaneTakeoff className="size-6" />}
            title="Aucun trajet trouvé"
            description={
              hasFilters
                ? "Essayez d'autres filtres ou dates."
                : "Soyez le premier à proposer un trajet !"
            }
            action={
              <Button asChild variant="link" size="sm">
                <Link href="/trajets/nouveau">Proposer un trajet →</Link>
              </Button>
            }
          />
        ) : (
          <TripList trips={trips} />
        )}
      </PageSection>
    </PageShell>
  )
}