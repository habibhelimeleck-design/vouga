'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  action?: React.ReactNode
  transparent?: boolean
}

export function Header({ title, showBack, onBack, action, transparent }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/tableau-de-bord'

  const handleBack = () => {
    if (onBack) onBack()
    else router.back()
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full pt-safe',
        'flex items-center justify-between',
        'px-4 h-14',
        transparent
          ? 'bg-transparent'
          : [
              'bg-background/70 backdrop-blur-xl',
              'border-b border-border',
              'shadow-[0_1px_0_var(--color-border)]',
            ]
      )}
    >
      {/* Left */}
      <div className="flex items-center min-w-[36px]">
        {showBack ? (
          <motion.button
            onClick={handleBack}
            whileTap={{ scale: 0.93 }}
            className={cn(
              'size-9 flex items-center justify-center rounded-[var(--radius-md)]',
              'text-muted hover:text-text hover:bg-surface-2',
              'transition-colors duration-150 cursor-pointer'
            )}
            aria-label="Retour"
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
          </motion.button>
        ) : !isHome ? (
          <Link href="/tableau-de-bord" aria-label="Accueil VOU GA">
            <VouGaLogo size="sm" />
          </Link>
        ) : null}
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center px-3">
        {title ? (
          <motion.h1
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="font-sans font-semibold text-text text-[15px] tracking-[-0.01em] truncate"
          >
            {title}
          </motion.h1>
        ) : isHome ? (
          <VouGaLogo />
        ) : (
          <VouGaLogo />
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 min-w-[36px] justify-end">
        {action}
      </div>
    </header>
  )
}

export function VouGaLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <div className={cn('flex items-center', size === 'sm' ? 'gap-1.5' : 'gap-2')}>
      {/* Emblème — losange d'or, référence à l'écusson gabonais */}
      <div
        className={cn(
          'relative flex items-center justify-center',
          'bg-accent rounded-[var(--radius-sm)] border border-accent/30',
          'shadow-[var(--shadow-gold)]',
          size === 'sm' ? 'size-6' : 'size-7'
        )}
      >
        <span
          className={cn(
            'font-display font-bold text-accent-fg leading-none',
            size === 'sm' ? 'text-[9px]' : 'text-[10px]'
          )}
        >
          VG
        </span>
      </div>
      <span
        className={cn(
          'font-display font-semibold tracking-[-0.02em] text-text',
          size === 'sm' ? 'text-sm' : 'text-[15px]'
        )}
      >
        VOU GA
      </span>
    </div>
  )
}

/* ── Public Nav ──────────────────────────────────────────────────────── */

export function PublicNav() {
  return (
    <nav className="hidden md:flex items-center gap-0.5">
      <NavLink href="/trajets">Trajets</NavLink>
      <NavLink href="/demandes">Demandes</NavLink>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-1.5 rounded-[var(--radius-md)] text-sm',
        'transition-colors duration-150',
        active
          ? 'text-text bg-surface-2 font-medium'
          : 'text-muted hover:text-text hover:bg-surface-2'
      )}
    >
      {children}
    </Link>
  )
}

/* ── Public Header ───────────────────────────────────────────────────── */

export function PublicHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full bg-background/70 backdrop-blur-xl border-b border-border">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        <Link href="/" aria-label="VOU GA accueil">
          <VouGaLogo />
        </Link>

        <PublicNav />

        <div className="flex items-center gap-2">
          {pathname !== '/auth/connexion' && (
            <Link
              href="/auth/connexion"
              className={cn(
                'hidden sm:inline-flex items-center justify-center h-9 px-4',
                'rounded-[var(--radius-md)] text-sm text-muted',
                'hover:text-text hover:bg-surface-2 transition-colors duration-150'
              )}
            >
              Connexion
            </Link>
          )}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/auth/inscription"
              className={cn(
                'inline-flex items-center justify-center h-9 px-4',
                'rounded-[var(--radius-md)] text-sm font-semibold',
                'bg-accent text-accent-fg border border-accent/20',
                'hover:bg-accent-hover shadow-[var(--shadow-gold)]',
                'transition-all duration-200'
              )}
            >
              Commencer
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  )
}