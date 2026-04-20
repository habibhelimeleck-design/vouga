'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

/* ── Trois niveaux d'élévation ─────────────────────────────────────────
   flat    → surface + border, pas de shadow
   raised  → +shadow-sm, shadow-md au hover
   float   → +shadow-md, shadow-lg au hover, translateY
   ──────────────────────────────────────────────────────────────────── */

type Elevation = 'flat' | 'raised' | 'float'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation
  hoverable?: boolean
  padded?: boolean
  asLink?: boolean
}

const elevationBase: Record<Elevation, string> = {
  flat:   'bg-surface border border-border',
  raised: 'bg-surface border border-border shadow-[var(--shadow-sm)]',
  float:  'bg-surface-2 border border-border-strong shadow-[var(--shadow-md)]',
}

const elevationHover: Record<Elevation, Variants['hover']> = {
  flat:   { y: -1, boxShadow: '0 2px 10px oklch(5% 0.04 145 / 50%)' },
  raised: { y: -2, boxShadow: '0 6px 24px oklch(5% 0.04 145 / 65%)' },
  float:  { y: -3, boxShadow: '0 12px 40px oklch(5% 0.04 145 / 75%)' },
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = 'flat',
      hoverable = false,
      padded = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (hoverable) {
      return (
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          initial="rest"
          whileHover="hover"
          whileTap={{ scale: 0.99 }}
          variants={{
            rest:  { y: 0 },
            hover: elevationHover[elevation],
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={cn(
            'rounded-[var(--radius-lg)] transition-colors duration-200',
            elevationBase[elevation],
            padded && 'p-4',
            'cursor-pointer',
            className
          )}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-lg)]',
          elevationBase[elevation],
          padded && 'p-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-display font-semibold text-text text-lg leading-snug tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted mt-1 leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-border flex items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardSection({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('py-3 border-b border-border last:border-0', className)} {...props}>
      {children}
    </div>
  )
}