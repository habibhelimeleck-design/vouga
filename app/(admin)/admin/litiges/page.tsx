import { AlertTriangle } from 'lucide-react'
import { getDisputeParcels } from '@/lib/actions/admin'
import { DisputeActions } from './DisputeActions'

export default async function AdminLitigesPage() {
  const parcels = await getDisputeParcels()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-text">Litiges en cours</h1>
        <p className="text-sm text-muted mt-1">
          {parcels.length === 0
            ? 'Aucun litige actif.'
            : `${parcels.length} litige${parcels.length > 1 ? 's' : ''} à résoudre`}
        </p>
      </div>

      {parcels.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
            <AlertTriangle className="size-6 text-subtle" />
          </div>
          <p className="text-muted text-sm">Aucun litige actif pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {parcels.map(parcel => (
            <div
              key={parcel.id}
              className="bg-surface border border-amber-600/20 rounded-[var(--radius-lg)] p-4 space-y-4"
            >
              {/* Parties */}
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-subtle uppercase tracking-wide font-medium mb-1">Expéditeur</p>
                  <p className="text-sm font-semibold text-text truncate">{parcel.sender.full_name}</p>
                  <a
                    href={`https://wa.me/${parcel.sender.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline"
                  >
                    WhatsApp →
                  </a>
                </div>
                <span className="text-subtle text-lg shrink-0">⇄</span>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs text-subtle uppercase tracking-wide font-medium mb-1">Voyageur</p>
                  <p className="text-sm font-semibold text-text truncate">{parcel.traveler.full_name}</p>
                  <a
                    href={`https://wa.me/${parcel.traveler.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline"
                  >
                    WhatsApp →
                  </a>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-subtle border-t border-border pt-3">
                <span>Colis #{parcel.id.slice(0, 8)}</span>
                <span>
                  Litige depuis le{' '}
                  {new Date(parcel.updated_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>

              {/* Resolution */}
              <DisputeActions
                parcelId={parcel.id}
                senderName={parcel.sender.full_name}
                travelerName={parcel.traveler.full_name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}