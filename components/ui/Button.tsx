'use client'

import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Spinner } from './Spinner'

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-sans font-medium select-none cursor-pointer',
    'transition-all duration-[var(--duration-base)] ease-out',
    'touch-action-manipulation',
    'disabled:opacity-40 disabled:pointer-events-none',
    'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-3',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-accent-fg font-semibold',
          'shadow-[var(--shadow-gold)]',
          'hover:bg-accent-hover hover:shadow-[var(--shadow-gold-lg)]',
          'border border-accent/20',
        ],
        secondary: [
          'bg-surface-2 text-text border border-border',
          'hover:bg-surface-3 hover:border-border-strong',
        ],
        outline: [
          'bg-transparent text-text border border-border-strong',
          'hover:bg-surface-2 hover:border-accent/30',
        ],
        ghost: [
          'bg-transparent text-muted border border-transparent',
          'hover:text-text hover:bg-surface-2',
        ],
        forest: [
          'bg-forest/15 text-forest-light border border-forest/25',
          'hover:bg-forest/25',
        ],
        destructive: [
          'bg-destructive/10 text-destructive border border-destructive/25',
          'hover:bg-destructive/20',
        ],
        link: [
          'bg-transparent text-accent underline-offset-4',
          'hover:underline hover:text-accent-hover',
          'h-auto p-0',
        ],
      },
      size: {
        xs: 'h-7 px-3 text-xs rounded-[var(--radius-sm)] gap-1',
        sm: 'h-9 px-4 text-sm rounded-[var(--radius-md)] gap-1.5',
        md: 'h-11 px-5 text-sm rounded-[var(--radius-md)] gap-2',
        lg: 'h-13 px-7 text-base rounded-[var(--radius-lg)] gap-2.5',
        xl: 'h-14 px-8 text-base rounded-[var(--radius-xl)] gap-3',
        icon: 'size-10 rounded-[var(--radius-md)]',
        'icon-sm': 'size-8 rounded-[var(--radius-sm)]',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      fullWidth,
      loading = false,
      asChild = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <motion.div
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.1 }}
        className={fullWidth ? 'w-full' : 'inline-flex'}
      >
        <Comp
          ref={ref as React.Ref<HTMLButtonElement>}
          disabled={asChild ? undefined : isDisabled}
          className={cn(
            buttonVariants({ variant, size, fullWidth }),
            className
          )}
          {...props}
        >
          {asChild ? children : (
            <>
              {loading && <Spinner size="sm" className="shrink-0" />}
              {children}
            </>
          )}
        </Comp>
      </motion.div>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }