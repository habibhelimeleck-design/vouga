'use client'

import { useState, useTransition } from 'react'
import { resolveDispute } from '@/lib/actions/admin'

export function DisputeActions({
  parcelId,
  senderName,
  travelerName,
}: {
  parcelId: string
  senderName: string
  travelerName: string
}) {
  const [pending, startTransition] = useTransition()
  const [resolution, setResolution] = useState<'delivered' | 'cancelled' | null>(null)
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <span className="text-xs font-medium text-accent">
        Résolu — {resolution === 'delivered' ? 'Livraison confirmée' : 'Annulé'}
      </span>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setResolution('delivered')}
          className={`flex-1 py-2 text-xs font-semibold rounded-[var(--radius-md)] border transition-colors
            ${resolution === 'delivered'
              ? 'bg-green-500/20 border-green-500/40 text-green-400'
              : 'bg-white/3 border-border text-muted hover:text-text hover:border-white/15'
            }`}
        >
          ✓ Livraison confirmée
          <span className="block text-[10px] font-normal opacity-70">Faveur : {travelerName}</span>
        </button>
        <button
          onClick={() => setResolution('cancelled')}
          className={`flex-1 py-2 text-xs font-semibold rounded-[var(--radius-md)] border transition-colors
            ${resolution === 'cancelled'
              ? 'bg-red-500/20 border-red-500/40 text-red-400'
              : 'bg-white/3 border-border text-muted hover:text-text hover:border-white/15'
            }`}
        >
          ✗ Annuler le colis
          <span className="block text-[10px] font-normal opacity-70">Faveur : {senderName}</span>
        </button>
      </div>

      {resolution && (
        <>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Note de résolution (obligatoire)…"
            rows={2}
            className="w-full bg-background border border-border rounded-[var(--radius-md)]
                       text-sm text-text placeholder:text-subtle p-2.5 resize-none
                       focus:outline-none focus:border-accent/50"
          />
          <button
            disabled={pending || !note.trim()}
            onClick={() => startTransition(async () => {
              const res = await resolveDispute(parcelId, resolution, note.trim())
              if (!res.error) setDone(true)
            })}
            className="w-full py-2 text-xs font-semibold rounded-[var(--radius-md)]
                       bg-accent text-background hover:bg-amber-500 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pending ? 'Enregistrement…' : 'Confirmer la résolution'}
          </button>
        </>
      )}
    </div>
  )
}