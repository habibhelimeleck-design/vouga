'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { fadeIn } from '@/lib/motion'

interface PageShellProps {
  children: ReactNode
  className?: string
  withBottomNav?: boolean
  centered?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  /** Désactiver l'animation d'entrée */
  noAnimate?: boolean
}

const maxWidths = {
  sm: 'max-w-sm',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export function PageShell({
  children,
  className,
  withBottomNav = true,
  centered = false,
  maxWidth = 'lg',
  noAnimate = false,
}: PageShellProps) {
  const content = (
    <main
      className={cn(
        'flex-1 w-full',
        'px-4 pt-4 sm:px-6',
        withBottomNav && 'pb-[calc(5rem+env(safe-area-inset-bottom))]',
        centered && cn('mx-auto', maxWidths[maxWidth]),
        className
      )}
    >
      {children}
    </main>
  )

  if (noAnimate) return content

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="flex-1 flex flex-col"
    >
      {content}
    </motion.div>
  )
}

/** Section avec titre et sous-titre */
export function PageSection({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-3', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3">
          <div>
            {title && (
              <h2 className="font-display font-semibold text-text text-lg tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

/** Divider */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-border', className)} />
}

/** Empty state designé */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 gap-5"
    >
      {icon && (
        <div className="relative">
          {/* Halo doré très subtil */}
          <div className="absolute inset-0 rounded-full bg-accent/5 blur-xl scale-150" />
          <div className={cn(
            'relative size-16 rounded-[var(--radius-xl)]',
            'bg-surface-2 border border-border',
            'flex items-center justify-center text-subtle',
            'shadow-[var(--shadow-sm)]'
          )}>
            {icon}
          </div>
        </div>
      )}
      <div className="space-y-1.5 max-w-[240px]">
        <p className="font-display font-semibold text-text text-lg tracking-tight">
          {title}
        </p>
        {description && (
          <p className="text-sm text-muted leading-relaxed text-balance">
            {description}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  )
}