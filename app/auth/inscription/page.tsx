'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils/cn'
import { signUp } from '@/lib/actions/auth'

const schema = z
  .object({
    type: z.enum(['individual', 'company']),
    full_name: z.string().min(2, 'Minimum 2 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Minimum 8 caractères'),
    whatsapp: z.string().min(8, 'Numéro invalide'),
    company_name: z.string().optional(),
  })
  .refine(
    (d) => !(d.type === 'company' && !d.company_name?.trim()),
    { message: "Nom de l'entreprise requis", path: ['company_name'] }
  )

type FormData = z.infer<typeof schema>

const TYPES = [
  { value: 'individual', label: 'Particulier', icon: User },
  { value: 'company', label: 'Entreprise', icon: Building2 },
] as const

export default function InscriptionPage() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'individual' },
  })

  const type = watch('type')

  async function onSubmit(data: FormData) {
    setServerError(null)
    const result = await signUp(data)
    if (result?.error) setServerError(result.error)
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="text-center space-y-1">
        <h1 className="font-display font-bold text-2xl text-text">Créer un compte</h1>
        <p className="text-sm text-muted">Rejoignez VOU GA et connectez-vous au Gabon</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Type toggle */}
        <div className="flex gap-1.5 p-1 bg-background rounded-[var(--radius-md)] border border-border">
          {TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('type', value)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-sm)]',
                'text-sm font-medium transition-all duration-[150ms]',
                type === value
                  ? 'bg-accent text-accent-fg'
                  : 'text-muted hover:text-text'
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <Input
          label="Nom complet"
          placeholder={type === 'company' ? 'Prénom Nom du représentant' : 'Prénom Nom'}
          autoComplete="name"
          required
          {...register('full_name')}
          error={errors.full_name?.message}
        />

        {type === 'company' && (
          <Input
            label="Nom de l'entreprise"
            placeholder="SARL Mon Entreprise"
            required
            {...register('company_name')}
            error={errors.company_name?.message}
          />
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          hint="8 caractères minimum"
          required
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="WhatsApp"
          type="tel"
          autoComplete="tel"
          placeholder="+241 06 00 00 00"
          hint="Numéro sur lequel vous souhaitez être contacté"
          required
          {...register('whatsapp')}
          error={errors.whatsapp?.message}
        />

        {serverError && (
          <p role="alert" className="text-sm text-destructive text-center">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} fullWidth size="lg" className="mt-1">
          Créer mon compte
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Déjà un compte ?{' '}
        <Link
          href="/auth/connexion"
          className="text-accent hover:text-accent-hover font-medium transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}