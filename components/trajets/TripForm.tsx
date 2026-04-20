'use client'

import { useActionState } from 'react'
import { createTrip } from '@/lib/actions/trips'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GABON_CITIES, TRANSPORT_MODES } from '@/lib/constants/corridors'

interface TripFormProps {
  defaultWhatsapp?: string
}

const initialState = { error: '' }

function SelectField({
  label,
  name,
  required,
  children,
  error,
}: {
  label: string
  name: string
  required?: boolean
  children: React.ReactNode
  error?: string
}) {
  const id = name
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && <span className="text-accent ml-1" aria-hidden>*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        className="w-full bg-surface border border-border rounded-[var(--radius-md)]
                   px-4 py-3 text-sm text-text
                   transition-all duration-[150ms] ease-out
                   focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
                   min-h-[44px] appearance-none
                   disabled:opacity-40"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
      >
        {children}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function TextareaField({
  label,
  name,
  placeholder,
  hint,
}: {
  label: string
  name: string
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-text">{label}</label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-surface border border-border rounded-[var(--radius-md)]
                   px-4 py-3 text-sm text-text placeholder:text-subtle resize-none
                   transition-all duration-[150ms] ease-out
                   focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
      />
      {hint && <p className="text-xs text-subtle">{hint}</p>}
    </div>
  )
}

export function TripForm({ defaultWhatsapp = '' }: TripFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await createTrip(formData)
      return result ?? initialState
    },
    initialState
  )

  const today = new Date().toISOString().split('T')[0]

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Trajet */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-semibold text-text text-sm uppercase tracking-wide text-muted">
          Trajet
        </h2>

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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date de départ"
            name="departure_date"
            type="date"
            min={today}
            required
          />
          <Input
            label="Arrivée estimée"
            name="arrival_date"
            type="date"
            min={today}
            hint="Optionnel"
          />
        </div>

        <SelectField label="Mode de transport" name="transport_mode" required>
          {TRANSPORT_MODES.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </SelectField>
      </div>

      {/* Capacité */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-semibold text-text text-sm uppercase tracking-wide text-muted">
          Capacité
        </h2>

        <Input
          label="Poids max accepté (kg)"
          name="max_weight_kg"
          type="number"
          min="0.1"
          max="500"
          step="0.1"
          placeholder="Ex : 10"
          required
          hint="Poids total que vous pouvez transporter"
        />

        <TextareaField
          label="Notes"
          name="notes"
          placeholder="Objets acceptés, contraintes, tarif indicatif…"
          hint="Optionnel — visible par tous"
        />
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-semibold text-text text-sm uppercase tracking-wide text-muted">
          Contact
        </h2>

        <Input
          label="WhatsApp"
          name="whatsapp"
          type="tel"
          placeholder="+241 07 00 00 00"
          defaultValue={defaultWhatsapp}
          required
          hint="Numéro que les expéditeurs utiliseront pour vous contacter"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20
                       rounded-[var(--radius-md)] px-4 py-3">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={isPending} fullWidth size="lg" className="mt-1">
        Publier le trajet
      </Button>
    </form>
  )
}
