import Link from 'next/link'
import { FileCheck, AlertTriangle, Users, ShieldCheck } from 'lucide-react'
import { getAdminStats } from '@/lib/actions/admin'

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  urgent,
}: {
  label: string
  value: number
  icon: React.ElementType
  href?: string
  urgent?: boolean
}) {
  const inner = (
    <div className={`p-5 rounded-[var(--radius-lg)] border transition-colors
      ${urgent && value > 0
        ? 'bg-amber-600/10 border-amber-600/25 hover:bg-amber-600/15'
        : 'bg-surface border-border hover:bg-white/5'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">{label}</span>
        <div className={`size-8 rounded-[var(--radius-md)] flex items-center justify-center
          ${urgent && value > 0 ? 'bg-amber-600/20' : 'bg-white/5'}`}
        >
          <Icon className={`size-4 ${urgent && value > 0 ? 'text-accent' : 'text-muted'}`} />
        </div>
      </div>
      <p className={`font-display font-bold text-3xl ${urgent && value > 0 ? 'text-accent' : 'text-text'}`}>
        {value}
      </p>
    </div>
  )

  if (href) {
    return <Link href={href}>{inner}</Link>
  }
  return inner
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  if (!stats) {
    return <p className="text-muted text-sm">Erreur de chargement.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-text">Administration</h1>
        <p className="text-sm text-muted mt-1">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Docs en attente"
          value={stats.pendingDocs}
          icon={FileCheck}
          href="/admin/documents"
          urgent
        />
        <StatCard
          label="Litiges actifs"
          value={stats.disputes}
          icon={AlertTriangle}
          href="/admin/litiges"
          urgent
        />
        <StatCard
          label="Utilisateurs"
          value={stats.totalUsers}
          icon={Users}
        />
        <StatCard
          label="Vérifiés"
          value={stats.verifiedUsers}
          icon={ShieldCheck}
        />
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-xs text-subtle uppercase tracking-wide font-medium">Actions rapides</p>
        <Link
          href="/admin/documents"
          className="flex items-center justify-between p-4 bg-surface border border-border
                     rounded-[var(--radius-lg)] hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileCheck className="size-4.5 text-accent" />
            <span className="text-sm font-medium text-text">Valider les documents</span>
          </div>
          {stats.pendingDocs > 0 && (
            <span className="text-xs font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-full">
              {stats.pendingDocs}
            </span>
          )}
        </Link>
        <Link
          href="/admin/litiges"
          className="flex items-center justify-between p-4 bg-surface border border-border
                     rounded-[var(--radius-lg)] hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-4.5 text-accent" />
            <span className="text-sm font-medium text-text">Gérer les litiges</span>
          </div>
          {stats.disputes > 0 && (
            <span className="text-xs font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-full">
              {stats.disputes}
            </span>
          )}
        </Link>
      </div>
    </div>
  )
}