import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Weight, Phone, CheckCircle, XCircle, Clock,
  Package, Truck, ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getParcelRequest, closeParcelRequest } from '@/lib/actions/parcel-requests'
import { createBooking, getBookingsForRequest, acceptBooking, rejectBooking } from '@/lib/actions/parcels'
import { getCityLabel } from '@/lib/constants/corridors'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Booking } from '@/types'

const STATUS_CONFIG = {
  open:    { label: 'Ouverte',  variant: 'success'     as const, icon: CheckCircle },
  matched: { label: 'Appairée', variant: 'accent'      as const, icon: Clock      },
  closed:  { label: 'Fermée',   variant: 'default'     as const, icon: XCircle    },
}

const BOOKING_STATUS_CONFIG = {
  pending:   { label: 'En attente', variant: 'warning'     as const },
  accepted:  { label: 'Acceptée',   variant: 'success'     as const },
  rejected:  { label: 'Refusée',    variant: 'destructive' as const },
  cancelled: { label: 'Annulée',    variant: 'default'     as const },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DemandeDetailPage({ params }: PageProps) {
  const { id } = await params
  const req = await getParcelRequest(id)
  if (!req) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === req.sender_id

  const bookings = isOwner ? await getBookingsForRequest(id) : []
  const myBooking = !isOwner
    ? (await getBookingsForRequest(id)).find(b => b.traveler_id === user?.id)
    : undefined

  const status = STATUS_CONFIG[req.status]
  const StatusIcon = status.icon

  const createdAt = new Date(req.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const whatsappUrl = `https://wa.me/${req.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Bonjour, j'ai vu votre demande de colis ${getCityLabel(req.origin_city)} → ${getCityLabel(req.destination_city)} sur VOU GA. Je peux transporter votre colis.`
  )}`

  return (
    <PageShell>
      {/* Retour */}
      <div className="pt-2 pb-5">
        <Link href="/demandes" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors">
          <ArrowLeft className="size-4" />
          Toutes les demandes
        </Link>
      </div>

      {/* Route + statut */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display font-bold text-2xl text-text leading-tight">
            {getCityLabel(req.origin_city)}{' '}
            <span className="text-muted font-normal">→</span>{' '}
            {getCityLabel(req.destination_city)}
          </h1>
          <Badge variant={status.variant} className="shrink-0 mt-1">
            <StatusIcon className="size-3" />
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-subtle">Publié le {createdAt}</p>
      </div>

      {/* Description */}
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="size-4 text-muted" />
          <p className="text-xs text-muted uppercase tracking-wide font-medium">Colis</p>
          <Badge variant="accent" className="ml-auto">
            <Weight className="size-3" />
            {req.weight_kg} kg
          </Badge>
        </div>
        <p className="text-sm text-text leading-relaxed">{req.description}</p>
        {req.special_instructions && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted mb-1">Instructions spéciales</p>
            <p className="text-sm text-text">{req.special_instructions}</p>
          </div>
        )}
      </div>

      {/* Photos */}
      {req.photo_urls.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted uppercase tracking-wide font-medium mb-2">Photos</p>
          <div className="flex gap-2">
            {req.photo_urls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="size-24 rounded-[var(--radius-md)] overflow-hidden border border-border block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Photo ${i + 1}`} className="size-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Profil expéditeur */}
      {req.sender && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-medium mb-3">Expéditeur</p>
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-base shrink-0">
              {req.sender.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text text-sm truncate">{req.sender.full_name}</p>
              {req.sender.rating > 0 && (
                <p className="text-xs text-muted mt-0.5">★ {req.sender.rating.toFixed(1)} · {req.sender.review_count} avis</p>
              )}
            </div>
            <Badge variant="success" className="shrink-0">
              <CheckCircle className="size-3" />
              Vérifié
            </Badge>
          </div>
        </div>
      )}

      {/* ─── Actions voyageur ─── */}
      {!isOwner && req.status === 'open' && (
        <div className="flex flex-col gap-3 mb-6">
          {myBooking ? (
            <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-[var(--radius-lg)]">
              <Truck className="size-4 text-muted shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">Proposition envoyée</p>
                <p className="text-xs text-muted mt-0.5">L'expéditeur va examiner votre offre.</p>
              </div>
              <Badge variant={BOOKING_STATUS_CONFIG[myBooking.status].variant}>
                {BOOKING_STATUS_CONFIG[myBooking.status].label}
              </Badge>
            </div>
          ) : (
            <>
              <form
                action={async () => {
                  'use server'
                  await createBooking(id)
                }}
              >
                <Button type="submit" fullWidth size="lg" className="gap-2">
                  <Truck className="size-4" />
                  Je prends en charge ce colis
                </Button>
              </form>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" fullWidth className="gap-2">
                  <Phone className="size-4" />
                  Contacter d'abord sur WhatsApp
                </Button>
              </a>
            </>
          )}
        </div>
      )}

      {/* ─── Propositions reçues (owner) ─── */}
      {isOwner && bookings.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
            Propositions reçues ({bookings.length})
          </p>
          <div className="flex flex-col gap-3">
            {bookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} requestId={id} />
            ))}
          </div>
        </div>
      )}

      {/* Owner — fermer la demande */}
      {isOwner && req.status === 'open' && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted mb-3">Vous êtes l'auteur de cette demande.</p>
          <form action={async () => { 'use server'; await closeParcelRequest(id) }}>
            <Button variant="destructive" fullWidth>Fermer cette demande</Button>
          </form>
        </div>
      )}
    </PageShell>
  )
}

function BookingCard({ booking, requestId }: { booking: Booking; requestId: string }) {
  const cfg = BOOKING_STATUS_CONFIG[booking.status]
  const traveler = booking.traveler

  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="size-10 rounded-full bg-surface-2 flex items-center justify-center text-muted font-semibold shrink-0">
          {traveler?.full_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text">{traveler?.full_name}</p>
          {traveler && traveler.rating > 0 && (
            <p className="text-xs text-muted">★ {traveler.rating.toFixed(1)} · {traveler.review_count} avis</p>
          )}
        </div>
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      </div>

      {booking.notes && (
        <p className="text-sm text-muted mb-3 italic">"{booking.notes}"</p>
      )}

      {booking.status === 'pending' && (
        <div className="flex gap-2">
          <form action={async () => { 'use server'; await acceptBooking(booking.id) }} className="flex-1">
            <Button type="submit" fullWidth size="sm">
              <CheckCircle className="size-3.5" />
              Accepter
            </Button>
          </form>
          <form action={async () => { 'use server'; await rejectBooking(booking.id) }} className="flex-1">
            <Button type="submit" variant="outline" fullWidth size="sm">
              <XCircle className="size-3.5" />
              Refuser
            </Button>
          </form>
        </div>
      )}

      {booking.status === 'accepted' && (
        <Link
          href="/colis"
          className="flex items-center gap-2 text-sm text-accent font-medium hover:text-accent-hover transition-colors"
        >
          <ChevronRight className="size-4" />
          Voir le colis créé
        </Link>
      )}
    </div>
  )
}
