'use client'

import { useState, useTransition } from 'react'
import { Check, X } from 'lucide-react'
import { approveDocument, rejectDocument } from '@/lib/actions/admin'

export function DocumentActions({ documentId }: { documentId: string }) {
  const [pending, startTransition] = useTransition()
  const [rejectMode, setRejectMode] = useState(false)
  const [note, setNote] = useState('')
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null)

  if (done === 'approved') {
    return <span className="text-xs font-medium text-green-500">Approuvé ✓</span>
  }
  if (done === 'rejected') {
    return <span className="text-xs font-medium text-red-400">Rejeté ✓</span>
  }

  if (rejectMode) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Raison du rejet (visible par l'utilisateur)…"
          rows={2}
          className="w-full bg-background border border-border rounded-[var(--radius-md)]
                     text-sm text-text placeholder:text-subtle p-2.5 resize-none
                     focus:outline-none focus:border-accent/50"
        />
        <div className="flex gap-2">
          <button
            disabled={pending || !note.trim()}
            onClick={() => startTransition(async () => {
              const res = await rejectDocument(documentId, note.trim())
              if (!res.error) setDone('rejected')
            })}
            className="flex-1 py-1.5 text-xs font-semibold rounded-[var(--radius-md)]
                       bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pending ? '…' : 'Confirmer le rejet'}
          </button>
          <button
            onClick={() => setRejectMode(false)}
            className="px-3 py-1.5 text-xs text-muted hover:text-text transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(async () => {
          const res = await approveDocument(documentId)
          if (!res.error) setDone('approved')
        })}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-md)]
                   bg-green-500/15 text-green-500 hover:bg-green-500/25 transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Check className="size-3.5" />
        Approuver
      </button>
      <button
        onClick={() => setRejectMode(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-md)]
                   bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
      >
        <X className="size-3.5" />
        Rejeter
      </button>
    </div>
  )
}