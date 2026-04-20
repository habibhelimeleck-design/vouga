'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PackageSearch, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/tableau-de-bord', label: 'Accueil',    icon: Home         },
  { href: '/trajets',          label: 'Trajets',    icon: Search       },
  { href: '/demandes',         label: 'Demandes',   icon: PackageSearch },
  { href: '/profil',           label: 'Profil',     icon: User         },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn(
        'fixed bottom-0 inset-x-0 z-40',
        'pb-safe',
        'bg-surface/85 backdrop-blur-2xl',
        'border-t border-border',
      )}
      aria-label="Navigation principale"
    >
      <ul className="flex items-stretch max-w-md mx-auto h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1',
                  'h-full transition-colors duration-150',
                  'touch-action-manipulation',
                  active ? 'text-accent' : 'text-subtle hover:text-muted'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {/* Indicateur actif — pill dorée en haut */}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[2px] rounded-full bg-accent"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      aria-hidden
                    />
                  )}
                </AnimatePresence>

                {/* Fond actif subtil */}
                {active && (
                  <span className="absolute inset-x-2 inset-y-1 rounded-[var(--radius-md)] bg-accent/6" />
                )}

                <motion.span
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative z-10"
                >
                  <Icon
                    className="size-[22px]"
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                </motion.span>

                <span className={cn(
                  'relative z-10 text-[10px] tracking-wide',
                  active ? 'font-semibold' : 'font-normal'
                )}>
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </motion.nav>
  )
}