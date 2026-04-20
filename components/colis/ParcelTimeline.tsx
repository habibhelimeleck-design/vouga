import { CheckCircle, Circle, Package, Truck, MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ParcelStatus, ParcelEvent } from '@/types'
import { PARCEL_STATUS_LABELS, PARCEL_STATUS_ORDER } from '@/types'

const STATUS_ICONS: Record<ParcelStatus, React.ElementType> = {
  created:    Package,
  accepted:   CheckCircle,
  picked_up:  Truck,
  in_transit: Truck,
  delivered:  MapPin,
  dispute:    Star,
}

interface ParcelTimelineProps {
  currentStatus: ParcelStatus
  events?: ParcelEvent[]
}

export function ParcelTimeline({ currentStatus, events = [] }: ParcelTimelineProps) {
  const currentIndex = PARCEL_STATUS_ORDER.indexOf(currentStatus)

  return (
    <div className="flex flex-col gap-0">
      {/* Étapes */}
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 mb-4">
        <p className="text-xs text-muted uppercase tracking-wide font-medium mb-4">Progression</p>
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-5">
            {PARCEL_STATUS_ORDER.map((step, i) => {
              const Icon = STATUS_ICONS[step]
              const done    = i < currentIndex
              const current = i === currentIndex
              const pending = i > currentIndex

              return (
                <div key={step} className="flex items-start gap-3 relative">
                  <div className={cn(
                    'size-7 rounded-full flex items-center justify-center shrink-0 z-10',
                    done    && 'bg-success/15',
                    current && 'bg-accent/15',
                    pending && 'bg-surface-2',
                  )}>
                    {done ? (
                      <CheckCircle className="size-4 text-success" />
                    ) : current ? (
                      <Icon className="size-4 text-accent" />
                    ) : (
                      <Circle className="size-4 text-subtle" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={cn(
                      'text-sm font-medium',
                      done || current ? 'text-text' : 'text-subtle'
                    )}>
                      {PARCEL_STATUS_LABELS[step]}
                    </p>
                    {current && (
                      <p className="text-xs text-accent mt-0.5">En cours</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Historique événements */}
      {events.length > 0 && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4">
          <p className="text-xs text-muted uppercase tracking-wide font-medium mb-3">Historique</p>
          <div className="flex flex-col gap-3">
            {events.map(ev => (
              <div key={ev.id} className="flex gap-3">
                <div className="size-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">{ev.note ?? PARCEL_STATUS_LABELS[ev.status as ParcelStatus]}</p>
                  <p className="text-xs text-subtle mt-0.5">
                    {new Date(ev.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  {ev.photo_url && (
                    <a href={ev.photo_url} target="_blank" rel="noopener noreferrer"
                      className="mt-1.5 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ev.photo_url} alt="Preuve" className="h-20 rounded-[var(--radius-sm)] object-cover border border-border" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
