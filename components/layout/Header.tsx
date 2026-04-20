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
          : 'glass-nav border-b border-[rgba(240,234,224,0.08)]'
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

/* ── Logo ─────────────────────────────────────────────────────────────── */

export function VouGaLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { badge: 'size-6', text: 'text-[9px]', name: 'text-sm',    gap: 'gap-1.5' },
    md: { badge: 'size-7', text: 'text-[10px]', name: 'text-[15px]', gap: 'gap-2'   },
    lg: { badge: 'size-9', text: 'text-[12px]', name: 'text-lg',    gap: 'gap-2.5' },
  }
  const s = sizes[size]

  return (
    <div className={cn('flex items-center', s.gap)}>
      <div
        className={cn(
          'relative flex items-center justify-center shrink-0',
          'bg-accent rounded-[var(--radius-sm)]',
          'shadow-[var(--shadow-gold)]',
          s.badge
        )}
      >
        <span className={cn('font-display font-bold text-accent-fg leading-none', s.text)}>
          VG
        </span>
      </div>
      <span className={cn('font-display font-medium tracking-[-0.025em] text-text', s.name)}>
        VOU GA
      </span>
    </div>
  )
}