import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageShell } from '@/components/layout/PageShell'
import { ParcelRequestForm } from '@/components/demandes/ParcelRequestForm'

export default async function NouvelleDemandePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('verification_status, whatsapp')
    .eq('id', user!.id)
    .single()

  const isVerified = profile?.verification_status === 'verified'

  return (
    <PageShell>
      {/* Nav retour */}
      <div className="pt-2 pb-5">
        <Link
          href="/demandes"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="size-4" />
          Retour aux demandes
        </Link>
        <h1 className="font-display font-bold text-2xl text-text mt-3">
          Envoyer un colis
        </h1>
      </div>

      {!isVerified ? (
        <div className="flex flex-col items-center text-center py-12 px-4 gap-5">
          <div className="size-16 rounded-[var(--radius-xl)] bg-accent/10 flex items-center justify-center">
            <Shield className="size-8 text-accent" />
          </div>
          <div className="space-y-2">
            <p className="font-display font-semibold text-text text-lg">
              Vérification requise
            </p>
            <p className="text-sm text-muted max-w-[280px] text-balance">
              Vous devez faire vérifier votre identité avant de publier une demande de colis.
            </p>
            {profile?.verification_status === 'submitted' && (
              <p className="text-xs text-accent font-medium mt-1">
                Votre dossier est en cours d'examen.
              </p>
            )}
          </div>
          {profile?.verification_status !== 'submitted' && (
            <Link
              href="/profil/verification"
              className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold
                         bg-accent text-accent-fg rounded-[var(--radius-md)]
                         hover:bg-accent-hover transition-colors"
            >
              <Shield className="size-4" />
              Vérifier mon identité
            </Link>
          )}
        </div>
      ) : (
        <ParcelRequestForm
          defaultWhatsapp={profile?.whatsapp ?? ''}
          userId={user!.id}
        />
      )}
    </PageShell>
  )
}
