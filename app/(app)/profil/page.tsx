import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Shield, Star, Edit2, LogOut, ChevronRight, MessageCircle, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageShell } from '@/components/layout/PageShell'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/lib/actions/auth'

const VERIFICATION_CONFIG = {
  pending:   { label: 'Non vérifié',              variant: 'warning' as const },
  submitted: { label: 'Vérification en cours',    variant: 'default' as const },
  verified:  { label: 'Identité vérifiée',        variant: 'success' as const },
  rejected:  { label: 'Vérification refusée',     variant: 'destructive' as const },
}

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/connexion')

  const verif = VERIFICATION_CONFIG[profile.verification_status as keyof typeof VERIFICATION_CONFIG]
  const needsVerification = ['pending', 'rejected'].includes(profile.verification_status)

  return (
    <PageShell>
      {/* Header card */}
      <div className="flex flex-col items-center text-center pt-4 pb-6 gap-3">
        <Avatar
          name={profile.full_name}
          src={profile.avatar_url}
          size="xl"
          verified={profile.verification_status === 'verified'}
        />
        <div>
          <h1 className="font-display font-bold text-xl text-text">{profile.full_name}</h1>
          {profile.company_name && (
            <p className="text-sm text-muted mt-0.5">{profile.company_name}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Badge variant={profile.type === 'company' ? 'accent' : 'default'}>
            {profile.type === 'company' ? 'Entreprise' : 'Particulier'}
          </Badge>
          <Badge variant={verif.variant}>
            {verif.label}
          </Badge>
        </div>
        {profile.review_count > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Star className="size-4 fill-accent text-accent" />
            <span className="font-semibold text-text">{profile.rating.toFixed(1)}</span>
            <span>({profile.review_count} avis)</span>
          </div>
        )}
      </div>

      {/* Actions principales */}
      <div className="flex flex-col gap-2 mb-6">
        <Link
          href="/profil/modifier"
          className="flex items-center gap-3 p-4 bg-surface border border-border
                     rounded-[var(--radius-lg)] hover:border-border-strong transition-colors"
        >
          <div className="size-9 rounded-[var(--radius-md)] bg-surface-2 flex items-center justify-center">
            <Edit2 className="size-4 text-muted" />
          </div>
          <span className="flex-1 text-sm font-medium text-text">Modifier mon profil</span>
          <ChevronRight className="size-4 text-subtle" />
        </Link>

        {needsVerification && (
          <Link
            href="/profil/verification"
            className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/25
                       rounded-[var(--radius-lg)] hover:bg-accent/15 transition-colors"
          >
            <div className="size-9 rounded-[var(--radius-md)] bg-accent/15 flex items-center justify-center">
              <Shield className="size-4 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text">Vérifier mon identité</p>
              <p className="text-xs text-muted">
                {profile.verification_status === 'rejected'
                  ? 'Soumettez vos documents à nouveau'
                  : 'Requis pour publier ou réserver'}
              </p>
            </div>
            <ChevronRight className="size-4 text-accent" />
          </Link>
        )}

        {profile.verification_status === 'submitted' && (
          <div className="flex items-center gap-3 p-4 bg-info/10 border border-info/20 rounded-[var(--radius-lg)]">
            <div className="size-9 rounded-[var(--radius-md)] bg-info/15 flex items-center justify-center">
              <Shield className="size-4 text-info" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text">Documents envoyés</p>
              <p className="text-xs text-muted">Vérification en cours (24-48h)</p>
            </div>
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border mb-6">
        {profile.whatsapp && (
          <InfoRow icon={<MessageCircle className="size-4" />} label="WhatsApp" value={profile.whatsapp} />
        )}
        {profile.phone && (
          <InfoRow icon={<Phone className="size-4" />} label="Téléphone" value={profile.phone} />
        )}
        <InfoRow
          icon={<Star className="size-4" />}
          label="Membre depuis"
          value={new Date(profile.created_at).toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric',
          })}
        />
      </div>

      {/* Déconnexion */}
      <form action={signOut}>
        <Button type="submit" variant="ghost" fullWidth className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="size-4" />
          Se déconnecter
        </Button>
      </form>
    </PageShell>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-subtle">{icon}</span>
      <span className="text-sm text-muted w-28 shrink-0">{label}</span>
      <span className="text-sm text-text truncate">{value}</span>
    </div>
  )
}