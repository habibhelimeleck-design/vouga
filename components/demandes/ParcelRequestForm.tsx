'use client'

import { useActionState, useRef, useState } from 'react'
import { createParcelRequest } from '@/lib/actions/parcel-requests'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GABON_CITIES } from '@/lib/constants/corridors'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, X, Loader2 } from 'lucide-react'

interface ParcelRequestFormProps {
  defaultWhatsapp?: string
  userId: string
}

const initialState = { error: '' }

function SelectField({
  label,
  name,
  required,
  children,
}: {
  label: string
  name: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-text">
        {label}
        {required && <span className="text-accent ml-1" aria-hidden>*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        className="w-full bg-surface border border-border rounded-[var(--radius-md)]
                   px-4 py-3 text-sm text-text
                   transition-all duration-[150ms]
                   focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
                   min-h-[44px] appearance-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '36px',
        }}
      >
        {children}
      </select>
    </div>
  )
}

export function ParcelRequestForm({ defaultWhatsapp = '', userId }: ParcelRequestFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await createParcelRequest(formData)
      return result ?? initialState
    },
    initialState
  )

  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (photoUrls.length + files.length > 3) {
      alert('Maximum 3 photos.')
      return
    }

    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('parcels').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('parcels').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }

    setPhotoUrls(prev => [...prev, ...uploaded])
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Colis */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Colis</h2>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-text">
            Description <span className="text-accent" aria-hidden>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            placeholder="Ex : Médicaments, vêtements, électronique…"
            className="w-full bg-surface border border-border rounded-[var(--radius-md)]
                       px-4 py-3 text-sm text-text placeholder:text-subtle resize-none
                       transition-all duration-[150ms]
                       focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
          />
        </div>

        <Input
          label="Poids estimé (kg)"
          name="weight_kg"
          type="number"
          min="0.1"
          max="500"
          step="0.1"
          placeholder="Ex : 2.5"
          required
          hint="Poids approximatif du colis"
        />

        {/* Photos */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text">Photos <span className="text-subtle font-normal">(optionnel, max 3)</span></p>

          <input type="hidden" name="photo_urls" value={photoUrls.join(',')} />

          <div className="flex gap-2 flex-wrap">
            {photoUrls.map((url, i) => (
              <div key={url} className="relative size-20 rounded-[var(--radius-md)] overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrls(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 size-5 bg-background/80 rounded-full flex items-center justify-center"
                >
                  <X className="size-3 text-text" />
                </button>
              </div>
            ))}

            {photoUrls.length < 3 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="size-20 rounded-[var(--radius-md)] border border-dashed border-border
                           flex flex-col items-center justify-center gap-1 text-muted
                           hover:border-accent/50 hover:text-accent transition-colors
                           disabled:opacity-40"
              >
                {uploading
                  ? <Loader2 className="size-5 animate-spin" />
                  : <ImagePlus className="size-5" />
                }
                <span className="text-xs">Ajouter</span>
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="special_instructions" className="text-sm font-medium text-text">
            Instructions spéciales
          </label>
          <textarea
            id="special_instructions"
            name="special_instructions"
            rows={2}
            placeholder="Fragile, tenir à l'abri de l'humidité…"
            className="w-full bg-surface border border-border rounded-[var(--radius-md)]
                       px-4 py-3 text-sm text-text placeholder:text-subtle resize-none
                       transition-all duration-[150ms]
                       focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
          />
        </div>
      </div>

      {/* Trajet */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Trajet</h2>

        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Départ" name="origin_city" required>
            <option value="">Choisir…</option>
            {GABON_CITIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </SelectField>

          <SelectField label="Arrivée" name="destination_city" required>
            <option value="">Choisir…</option>
            {GABON_CITIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </SelectField>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Contact</h2>

        <Input
          label="WhatsApp"
          name="whatsapp"
          type="tel"
          placeholder="+241 07 00 00 00"
          defaultValue={defaultWhatsapp}
          required
          hint="Les voyageurs vous contacteront sur ce numéro"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20
                       rounded-[var(--radius-md)] px-4 py-3">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={isPending} fullWidth size="lg" className="mt-1">
        Publier la demande
      </Button>
    </form>
  )
}
