'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveProofPhoto } from '@/lib/actions/parcels'

interface ProofUploadProps {
  parcelId: string
  type: 'pickup' | 'delivery'
  existingUrl?: string | null
  userId: string
}

export function ProofUpload({ parcelId, type, existingUrl, userId }: ProofUploadProps) {
  const [url, setUrl] = useState(existingUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    const supabase = createClient()
    const ext  = file.name.split('.').pop()
    const path = `proofs/${userId}/${parcelId}/${type}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Erreur upload.')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('proofs').getPublicUrl(path)
    const photoUrl = data.publicUrl

    const result = await saveProofPhoto(parcelId, type, photoUrl)
    if (result?.error) {
      setError(result.error)
    } else {
      setUrl(photoUrl)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const label = type === 'pickup' ? 'récupération' : 'livraison'

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted">Photo de {label}</p>

      {url ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={`Preuve ${label}`}
            className="w-full h-40 object-cover rounded-[var(--radius-md)] border border-border" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-2 right-2 h-8 px-3 text-xs font-medium
                       bg-background/80 backdrop-blur text-text border border-border
                       rounded-[var(--radius-sm)] hover:bg-surface transition-colors"
          >
            Remplacer
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 h-28
                     border border-dashed border-border rounded-[var(--radius-md)]
                     text-muted hover:border-accent/50 hover:text-accent
                     transition-colors disabled:opacity-40"
        >
          {uploading
            ? <Loader2 className="size-5 animate-spin" />
            : <Camera className="size-5" />}
          <span className="text-xs">{uploading ? 'Envoi…' : `Ajouter une photo`}</span>
        </button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  )
}
