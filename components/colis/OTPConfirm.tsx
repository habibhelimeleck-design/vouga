'use client'

import { useActionState, useRef } from 'react'
import { Button } from '@/components/ui/Button'

interface OTPConfirmProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>
  parcelId: string
  label: string
  hint?: string
}

const initialState = { error: '' }

export function OTPConfirm({ action, parcelId, label, hint }: OTPConfirmProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await action(formData)
      return (result as typeof initialState) ?? initialState
    },
    initialState
  )

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="parcel_id" value={parcelId} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="otp-code" className="text-sm font-medium text-text">
          Code secret <span className="text-accent" aria-hidden>*</span>
        </label>
        <input
          ref={inputRef}
          id="otp-code"
          name="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          pattern="\d{6}"
          placeholder="• • • • • •"
          required
          autoComplete="one-time-code"
          className="w-full bg-surface border border-border rounded-[var(--radius-md)]
                     px-4 py-4 text-center text-2xl font-mono font-bold tracking-[0.5em]
                     text-text placeholder:text-subtle placeholder:tracking-normal
                     transition-all duration-[150ms]
                     focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
          onChange={e => {
            e.target.value = e.target.value.replace(/\D/g, '')
          }}
        />
        {hint && <p className="text-xs text-subtle">{hint}</p>}
      </div>

      {state?.error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20
                       rounded-[var(--radius-md)] px-4 py-3">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={isPending} fullWidth>
        {label}
      </Button>
    </form>
  )
}
