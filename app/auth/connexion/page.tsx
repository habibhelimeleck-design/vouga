'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { signIn } from '@/lib/actions/auth'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type FormData = z.infer<typeof schema>

export default function ConnexionPage() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const result = await signIn(data.email, data.password)
    if (result?.error) setServerError(result.error)
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="text-center space-y-1">
        <h1 className="font-display font-bold text-2xl text-text">Bon retour</h1>
        <p className="text-sm text-muted">Connectez-vous à votre compte</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        {serverError && (
          <p role="alert" className="text-sm text-destructive text-center">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} fullWidth size="lg" className="mt-1">
          Se connecter
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Pas encore de compte ?{' '}
        <Link
          href="/auth/inscription"
          className="text-accent hover:text-accent-hover font-medium transition-colors"
        >
          S&apos;inscrire
        </Link>
      </p>
    </div>
  )
}