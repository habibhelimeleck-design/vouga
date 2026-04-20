import Link from 'next/link'
import { Package } from 'lucide-react'
import { getMyParcels } from '@/lib/actions/parcels'
import { PageShell, EmptyState } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { ColisSections } from '@/components/features/ColisSections'

export default async function ColisPage() {
  const { asSender, asTraveler } = await getMyParcels()
  const total = asSender.length + asTraveler.length

  return (
    <PageShell>
      <div className="pt-2 pb-6">
        <h1 className="font-display font-bold text-2xl text-text">Mes colis</h1>
        <p className="text-sm text-muted mt-0.5">
          {total} colis en cours
        </p>
      </div>

      {total === 0 ? (
        <EmptyState
          icon={<Package className="size-6" />}
          title="Aucun colis en cours"
          description="Vos colis apparaîtront ici une fois une demande acceptée."
          action={
            <Button asChild variant="link" size="sm">
              <Link href="/demandes">Voir les demandes →</Link>
            </Button>
          }
        />
      ) : (
        <ColisSections asSender={asSender} asTraveler={asTraveler} />
      )}
    </PageShell>
  )
}