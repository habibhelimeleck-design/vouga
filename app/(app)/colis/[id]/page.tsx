import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getParcel, confirmPickup, confirmDelivery } from '@/lib/actions/parcels'
import { getCityLabel } from '@/lib/constants/corridors'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { ParcelTimeline } from '@/components/colis/ParcelTimeline'
import { OTPConfirm } from '@/components/colis/OTPConfirm'
import { ProofUpload } from '@/components/colis/ProofUpload'
import { PARCEL_STATUS_LABELS } from '@/types'
import type { ParcelStatus } from '@/types'

const STATUS_VARIANT: Record<ParcelStatus, 'success' | 'accent' | 'default' | 'destructive'> = {
  created:    'default',
  accepted:   'accent',
  picked_up:  'accent',
  in_transit: 'accent',
  delivered:  'success',
  dispute:    'destructive',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ColisDetailPage({ params }: PageProps) {
  const { id } = await params
  const parcel = await getParcel(id)
  if (!parcel) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const isSender   = user.id === parcel.sender_id
  const isTraveler = user.id === parcel.traveler_id
  if (!isSender && !isTraveler) notFound()

  const canConfirmPickup   = isTraveler && ['created', 'accepted'].includes(parcel.status)
  const canConfirmDelivery = isSender   && ['picked_up', 'in_transit'].includes(parcel.status)
  const showCodeToSender   = isSender   && ['created', 'accepted'].includes(parcel.status)
  const showCodeToTraveler = isTraveler && ['picked_up', 'in_transit'].includes(parcel.status)
  const isDelivered        = parcel.status === 'delivered'

  const other = isSender ? parcel.traveler : parcel.sender
  const otherRole = isSender ? 'Voyageur' : 'Expéditeur'

  return (
    <PageShell>
      {/* Retour */}
      <div className="pt-2 pb-5">
        <Link href="/colis" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors">
          <ArrowLeft className="size-4" />
          Mes colis
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-text leading-tight">
            Colis #{parcel.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted mt-0.5">
            {isSender ? 'Vous expédiez' : 'Vous transportez'}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[parcel.status]} className="shrink-0 mt-1">
          {PARCEL_STATUS_LABELS[parcel.status]}
        </Badge>
      </div>

      {/* Interlocuteur */}
      {other && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-4">
          <p className="text-xs text-muted uppercase tracking-wide font-medium mb-3">{otherRole}</p>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold shrink-0">
              {other.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{other.full_name}</p>
              {other.rating > 0 && (
                <p className="text-xs text-muted">★ {other.rating.toFixed(1)} · {other.review_count} avis</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Code secret — affiché à qui doit le partager */}
      {(showCodeToSender || showCodeToTraveler) && (
        <div className="bg-accent/10 border border-accent/25 rounded-[var(--radius-lg)] p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="size-4 text-accent" />
            <p className="text-sm font-semibold text-accent">
              {showCodeToSender
                ? 'Montrez ce code au voyageur pour confirmer la récupération'
                : 'Montrez ce code à l\'expéditeur pour confirmer la livraison'}
            </p>
          </div>
          <p className="text-4xl font-mono font-bold tracking-[0.4em] text-text text-center py-3">
            {parcel.secret_code}
          </p>
          <p className="text-xs text-muted text-center">Partagez ce code verbalement — ne l'envoyez pas par écrit</p>
        </div>
      )}

      {/* OTP Confirmation */}
      {canConfirmPickup && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <EyeOff className="size-4 text-muted" />
            <p className="text-sm font-semibold text-text">Confirmer la récupération</p>
          </div>
          <p className="text-xs text-muted mb-4">Demandez le code secret à l'expéditeur et saisissez-le.</p>
          <OTPConfirm
            action={confirmPickup}
            parcelId={parcel.id}
            label="Confirmer la récupération"
            hint="Code à 6 chiffres communiqué par l'expéditeur"
          />
        </div>
      )}

      {canConfirmDelivery && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <EyeOff className="size-4 text-muted" />
            <p className="text-sm font-semibold text-text">Confirmer la livraison</p>
          </div>
          <p className="text-xs text-muted mb-4">Le voyageur vous montre le code — saisissez-le pour valider.</p>
          <OTPConfirm
            action={confirmDelivery}
            parcelId={parcel.id}
            label="Confirmer la livraison"
            hint="Code à 6 chiffres communiqué par le voyageur"
          />
        </div>
      )}

      {/* Preuves photo */}
      {(parcel.status === 'picked_up' || parcel.status === 'in_transit' || isDelivered) && isTraveler && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-4">
          <p className="text-xs text-muted uppercase tracking-wide font-medium mb-3">Preuve de récupération</p>
          <ProofUpload
            parcelId={parcel.id}
            type="pickup"
            existingUrl={parcel.pickup_proof_url}
            userId={user.id}
          />
        </div>
      )}

      {isDelivered && isSender && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-4">
          <p className="text-xs text-muted uppercase tracking-wide font-medium mb-3">Preuve de livraison</p>
          <ProofUpload
            parcelId={parcel.id}
            type="delivery"
            existingUrl={parcel.delivery_proof_url}
            userId={user.id}
          />
        </div>
      )}

      {/* Timeline */}
      <div className="mt-2">
        <ParcelTimeline
          currentStatus={parcel.status}
          events={parcel.events}
        />
      </div>
    </PageShell>
  )
}
