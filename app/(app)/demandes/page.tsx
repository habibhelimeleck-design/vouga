import Link from 'next/link'
import { Package, Plus } from 'lucide-react'
import { getParcelRequests } from '@/lib/actions/parcel-requests'
import { GABON_CITIES } from '@/lib/constants/corridors'
import { PageShell, PageSection, EmptyState } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { ParcelRequestList } from '@/components/features/ParcelRequestList'

const SELECT_CLASS = [
  'w-full bg-surface-2 border border-border rounded-[var(--radius-md)]',
  'px-3 py-2.5 text-sm text-text min-h-[44px]',
  'focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10',
  'hover:border-border-strong hover:bg-surface-3',
  'transition-all duration-200',
].join(' ')

interface PageProps {
  searchParams: Promise<{ origin?: string; destination?: string }>
}

export default async function DemandesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const requests = await getParcelRequests({
    origin: params.origin,
    destination: params.destination,
  })

  const hasFilters = !!(params.origin || params.destination)

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-text">Demandes</h1>
          <p className="text-sm text-muted mt-0.5">
            {requests.length} demande{requests.length !== 1 ? 's' : ''} ouverte{requests.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/demandes/nouvelle">
            <Plus className="size-4" />
            Envoyer
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
          <Button type="submit" size="sm" fullWidth>
            Filtrer
          </Button>
          {hasFilters && (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href="/demandes">Effacer</Link>
            </Button>
          )}
        </div>
      </form>

      {/* Liste */}
      <PageSection>
        {requests.length === 0 ? (
          <EmptyState
            icon={<Package className="size-6" />}
            title="Aucune demande trouvée"
            description={
              hasFilters
                ? "Essayez d'autres filtres."
                : "Publiez votre première demande de colis !"
            }
            action={
              <Button asChild variant="link" size="sm">
                <Link href="/demandes/nouvelle">Envoyer un colis →</Link>
              </Button>
            }
          />
        ) : (
          <ParcelRequestList requests={requests} />
        )}
      </PageSection>
    </PageShell>
  )
}