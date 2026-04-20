'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type Variant = 'default' | 'raised' | 'premium' | 'feature'

type LegacyElevation = 'flat' | 'raised' | 'float'
const elevationToVariant: Record<LegacyElevation, Variant> = {
  flat:   'default',
  raised: 'raised',
  float:  'raised',
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  /** @deprecated use variant instead */
  elevation?: LegacyElevation
  hoverable?: boolean
  padded?: boolean
}

const variantBase: Record<Variant, string> = {
  default: 'bg-surface border border-border',
  raised:  'bg-surface-2 border border-border shadow-[var(--shadow-sm)]',
  premium: 'glass-card border border-[rgba(240,234,224,0.10)] shadow-[var(--shadow-md)]',
  feature: 'bg-forest border border-forest-light/15',
}

const variantHover: Record<Variant, { y: number; boxShadow: string }> = {
  default: { y: -1, boxShadow: '0 4px 16px rgba(8,8,6,0.65)' },
  raised:  { y: -2, boxShadow: '0 8px 28px rgba(8,8,6,0.72)' },
  premium: { y: -3, boxShadow: '0 12px 40px rgba(8,8,6,0.78), 0 4px 32px rgba(200,169,106,0.12)' },
  feature: { y: -2, boxShadow: '0 8px 28px rgba(8,8,6,0.72)' },
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant: variantProp = 'default',
      elevation,
      hoverable = false,
      padded = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variant: Variant = elevation ? elevationToVariant[elevation] : variantProp

    const base = cn(
      'rounded-[var(--radius-lg)] transition-colors duration-200',
      variantBase[variant],
      padded && 'p-4',
      className
    )

    if (hoverable) {
      return (
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          initial="rest"
          whileHover="hover"
          whileTap={{ scale: 0.99 }}
          variants={{
            rest:  { y: 0 },
            hover: variantHover[variant],
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={cn(base, 'cursor-pointer')}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={base} {...props}>
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
        'font-display font-medium text-text text-lg leading-snug tracking-tight',
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