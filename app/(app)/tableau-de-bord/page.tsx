import Link from 'next/link'
import { PlaneTakeoff, Package, Shield, BoxIcon, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageShell, PageSection } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'

export default async function TableauDeBordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, verification_status')
    .eq('id', user!.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'là'
  const isVerified = profile?.verification_status === 'verified'

  return (
    <PageShell>
      {/* Hero greeting */}
      <div className="pt-4 pb-7">
        <p className="text-xs text-muted font-sans tracking-widest uppercase">Bonjour,</p>
        <h1 className="font-display font-bold text-3xl text-text mt-1.5 leading-tight">
          {firstName}{' '}
          <span className="text-accent">✦</span>
        </h1>
        {isVerified && (
          <div className="mt-2.5">
            <Badge variant="forest">
              <Shield className="size-3" />
              Identité vérifiée
            </Badge>
          </div>
        )}
      </div>

      {/* Verification banner */}
      {!isVerified && (
        <Link
          href="/profil/verification"
          className="group flex items-center gap-3 p-4 mb-7
                     bg-accent/8 border border-accent/20
                     rounded-[var(--radius-xl)]
                     hover:bg-accent/12 hover:border-accent/35
                     hover:shadow-[var(--shadow-gold)]
                     transition-all duration-200"
        >
          <div className="size-10 rounded-[var(--radius-lg)] bg-accent/15 flex items-center justify-center shrink-0">
            <Shield className="size-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text">Vérifiez votre identité</p>
            <p className="text-xs text-muted mt-0.5">Obligatoire pour publier ou réserver</p>
          </div>
          <ArrowRight className="size-4 text-accent shrink-0 group-hover:translate-x-0.5 transition-transform duration-150" />
        </Link>
      )}

      {/* Quick actions */}
      <PageSection title="Que souhaitez-vous faire ?">
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            href="/trajets/nouveau"
            icon={<PlaneTakeoff className="size-5" />}
            label="Proposer un trajet"
            desc="Je voyage et transporte des colis"
          />
          <QuickAction
            href="/demandes/nouvelle"
            icon={<Package className="size-5" />}
            label="Envoyer un colis"
            desc="Je cherche un voyageur"
          />
        </div>
      </PageSection>

      {/* Explorer */}
      <PageSection title="Explorer" className="mt-8">
        <div className="flex flex-col gap-2">
          <ExploreLink
            href="/trajets"
            icon={<PlaneTakeoff className="size-4.5" />}
            label="Voir les trajets disponibles"
          />
          <ExploreLink
            href="/demandes"
            icon={<Package className="size-4.5" />}
            label="Voir les demandes de colis"
          />
          <ExploreLink
            href="/colis"
            icon={<BoxIcon className="size-4.5" />}
            label="Mes colis en cours"
          />
        </div>
      </PageSection>
    </PageShell>
  )
}

function QuickAction({
  href,
  icon,
  label,
  desc,
}: {
  href: string
  icon: React.ReactNode
  label: string
  desc: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 p-4
                 bg-surface-2 border border-border
                 rounded-[var(--radius-xl)]
                 hover:border-accent/35 hover:bg-surface-3
                 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5
                 transition-all duration-200 active:scale-[0.98]"
    >
      <div className="size-11 rounded-[var(--radius-lg)] bg-accent/10 border border-accent/15
                      flex items-center justify-center text-accent
                      group-hover:bg-accent/15 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-text leading-tight">{label}</p>
        <p className="text-xs text-muted mt-1 leading-snug">{desc}</p>
      </div>
    </Link>
  )
}

function ExploreLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-4
                 bg-surface border border-border
                 rounded-[var(--radius-lg)]
                 hover:border-border-strong hover:bg-surface-2
                 transition-all duration-150"
    >
      <span className="text-muted group-hover:text-text transition-colors shrink-0">
        {icon}
      </span>
      <span className="text-sm text-text flex-1">{label}</span>
      <ArrowRight className="size-3.5 text-subtle group-hover:text-muted group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
    </Link>
  )
}