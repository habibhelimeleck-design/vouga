'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageShell } from '@/components/layout/PageShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from '@/lib/actions/profile'

const schema = z.object({
  full_name: z.string().min(2, 'Minimum 2 caractères'),
  phone: z.string().optional(),
  whatsapp: z.string().min(8, 'Numéro invalide'),
  company_name: z.string().optional(),
  company_reg: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ModifierProfilPage() {
  const router = useRouter()
  const [isCompany, setIsCompany] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('profiles')
        .select('full_name, phone, whatsapp, company_name, company_reg, type')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (!data) return
          setIsCompany(data.type === 'company')
          reset({
            full_name: data.full_name ?? '',
            phone: data.phone ?? '',
            whatsapp: data.whatsapp ?? '',
            company_name: data.company_name ?? '',
            company_reg: data.company_reg ?? '',
          })
        })
    })
  }, [reset])

  async function onSubmit(data: FormData) {
    setServerError(null)
    const result = await updateProfile(data)
    if (result?.error) {
      setServerError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Modifier mon profil" showBack onBack={() => router.back()} />
      <PageShell>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-2">
          <Input
            label="Nom complet"
            placeholder="Prénom Nom"
            required
            {...register('full_name')}
            error={errors.full_name?.message}
          />

          <Input
            label="Téléphone"
            type="tel"
            placeholder="+241 06 00 00 00"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input
            label="WhatsApp"
            type="tel"
            placeholder="+241 06 00 00 00"
            hint="Affiché aux autres utilisateurs pour vous contacter"
            required
            {...register('whatsapp')}
            error={errors.whatsapp?.message}
          />

          {isCompany && (
            <>
              <Input
                label="Nom de l'entreprise"
                placeholder="SARL Mon Entreprise"
                {...register('company_name')}
                error={errors.company_name?.message}
              />
              <Input
                label="N° d'enregistrement"
                placeholder="RCCM / NIF"
                {...register('company_reg')}
                error={errors.company_reg?.message}
              />
            </>
          )}

          {serverError && (
            <p role="alert" className="text-sm text-destructive text-center">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!isDirty && !saved}
            fullWidth
            size="lg"
            className="mt-2"
          >
            {saved ? (
              <>
                <Check className="size-4" />
                Enregistré
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </form>
      </PageShell>
    </div>
  )
}