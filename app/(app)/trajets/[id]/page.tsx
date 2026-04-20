import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Calendar, Weight, Phone,
  PlaneTakeoff, CheckCircle, XCircle, AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getTrip, cancelTrip } from '@/lib/actions/trips'
import { getCityLabel, TRANSPORT_MODES } from '@/lib/constants/corridors'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const STATUS_CONFIG = {
  active:    { label: 'Disponible',  variant: 'success'     as const, icon: CheckCircle },
  full:      { label: 'Complet',     variant: 'warning'     as const, icon: AlertCircle },
  completed: { label: 'Terminé',     variant: 'default'     as const, icon: CheckCircle },
  cancelled: { label: 'Annulé',      variant: 'destructive' as const, icon: XCircle    },
}

const TRANSPORT_ICONS: Record<string, string> = {
  road: '🚗',
  air:  '✈️',
  sea:  '⛵',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TrajetDetailPage({ params }: PageProps) {
  const { id } = await params
  const trip = await getTrip(id)
  if (!trip) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === trip.traveler_id

  const status = STATUS_CONFIG[trip.status]
  const StatusIcon = status.icon
  const mode = TRANSPORT_MODES.find(m => m.value === trip.transport_mode)

  const departureDate = new Date(trip.departure_date).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const arrivalDate = trip.arrival_date
    ? new Date(trip.arrival_date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  const whatsappUrl = `https://wa.me/${trip.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Bonjour, j'ai vu votre trajet ${getCityLabel(trip.origin_city)} → ${getCityLabel(trip.destination_city)} sur VOU GA. Je souhaite vous envoyer un colis.`
  )}`

  return (
    <PageShell>
      {/* Retour */}
      <div className="pt-2 pb-5">
        <Link
          href="/trajets"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="size-4" />
          Tous les trajets
        </Link>
      </div>

      {/* Route + statut */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display font-bold text-2xl text-text leading-tight">
            {getCityLabel(trip.origin_city)}{' '}
            <span className="text-muted font-normal">→</span>{' '}
            {getCityLabel(trip.destination_city)}
          </h1>
          <Badge variant={status.variant} className="shrink-0 mt-1">
            <StatusIcon className="size-3" />
            {status.label}
          </Badge>
        </div>
        <p className="text-sm text-muted">
          {TRANSPORT_ICONS[trip.transport_mode]} {mode?.label}
        </p>
      </div>

      {/* Infos trajet */}
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border mb-4">
        <InfoRow icon={<Calendar className="size-4 text-muted" />} label="Départ">
          <span className="text-sm text-text capitalize">{departureDate}</span>
        </InfoRow>

        {arrivalDate && (
          <InfoRow icon={<Calendar className="size-4 text-muted" />} label="Arrivée estimée">
            <span className="text-sm text-text">{arrivalDate}</span>
          </InfoRow>
        )}

        <InfoRow icon={<Weight className="size-4 text-muted" />} label="Capacité">
          <span className="text-sm text-text">{trip.max_weight_kg} kg maximum</span>
        </InfoRow>

        {trip.notes && (
          <InfoRow icon={<MapPin className="size-4 text-muted" />} label="Notes">
            <span className="text-sm text-text whitespace-pre-line">{trip.notes}</span>
          </InfoRow>
        )}
      </div>

      {/* Profil voyageur */}
      {trip.traveler && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-medium mb-3">Voyageur</p>
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-base shrink-0">
              {trip.traveler.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text text-sm truncate">{trip.traveler.full_name}</p>
              {trip.traveler.rating > 0 && (
                <p className="text-xs text-muted mt-0.5">
                  ★ {trip.traveler.rating.toFixed(1)} · {trip.traveler.review_count} avis
                </p>
              )}
            </div>
            <Badge variant="success" className="shrink-0">
              <CheckCircle className="size-3" />
              Vérifié
            </Badge>
          </div>
        </div>
      )}

      {/* CTA */}
      {!isOwner && trip.status === 'active' && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button fullWidth size="lg" className="gap-2">
            <Phone className="size-4" />
            Contacter sur WhatsApp
          </Button>
        </a>
      )}

      {/* Owner actions */}
      {isOwner && trip.status === 'active' && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted mb-3">Vous êtes l'auteur de ce trajet.</p>
          <form
            action={async () => {
              'use server'
              await cancelTrip(id)
            }}
          >
            <Button variant="destructive" fullWidth>
              Annuler ce trajet
            </Button>
          </form>
        </div>
      )}
    </PageShell>
  )
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  )
}
