import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileCheck, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const NAV = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/documents', label: 'Documents', icon: FileCheck },
  { href: '/admin/litiges', label: 'Litiges', icon: AlertTriangle },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/tableau-de-bord')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-surface px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <span className="font-display font-bold text-text text-base tracking-tight">VOU GA</span>
        <span className="text-subtle text-xs">·</span>
        <span className="text-xs font-medium text-accent uppercase tracking-wide">Admin</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-52 border-r border-border bg-surface shrink-0 pt-4 gap-1 px-2">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)]
                         text-sm text-muted hover:text-text hover:bg-white/5 transition-colors"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {children}
          </div>

          {/* Bottom nav — mobile */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface
                          flex items-center justify-around px-2 pb-safe-area">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 px-4 py-3 text-muted hover:text-text transition-colors"
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </main>
      </div>
    </div>
  )
}