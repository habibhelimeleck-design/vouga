'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { VouGaLogo } from './Header'

const NAV_LINKS = [
  { href: '/trajets',  label: 'Trajets'  },
  { href: '/demandes', label: 'Demandes' },
] as const

export function Navbar() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="glass-nav border-b border-[rgba(240,234,224,0.08)]">
        <div className="cx flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link
            href="/"
            aria-label="VOU GA — Accueil"
            className="shrink-0 transition-opacity duration-150 hover:opacity-80"
          >
            <VouGaLogo />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Navigation principale">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative px-4 py-2 rounded-[var(--radius-md)] text-sm',
                    'transition-colors duration-150',
                    active
                      ? 'text-text font-medium'
                      : 'text-muted hover:text-text hover:bg-surface-2/60'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-1 left-4 right-4 h-px bg-accent/60 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {!isAuthPage && (
              <Link
                href="/auth/connexion"
                className={cn(
                  'hidden sm:inline-flex items-center justify-center',
                  'h-9 px-4 rounded-[var(--radius-lg)] text-sm text-muted',
                  'hover:text-text hover:bg-surface-2/60',
                  'transition-all duration-150'
                )}
              >
                Connexion
              </Link>
            )}

            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
              <Link
                href="/auth/inscription"
                className={cn(
                  'inline-flex items-center justify-center gap-1.5',
                  'h-9 px-4 rounded-full text-sm font-semibold',
                  'bg-accent text-accent-fg',
                  'shadow-[var(--shadow-gold)]',
                  'hover:bg-accent-hover hover:shadow-[var(--shadow-gold-lg)]',
                  'transition-all duration-200'
                )}
              >
                Commencer
                <ArrowRight className="size-3.5" strokeWidth={2.5} />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </header>
  )
}