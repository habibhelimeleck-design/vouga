import { cva, type VariantProps } from 'class-variance-authority'
import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'font-sans font-medium leading-none whitespace-nowrap',
    'border',
  ],
  {
    variants: {
      variant: {
        default:     'bg-surface-3 text-muted border-border',
        accent:      'bg-accent/12 text-accent border-accent/20',
        forest:      'bg-forest/12 text-forest-light border-forest/20',
        success:     'bg-success/10 text-success border-success/20',
        warning:     'bg-accent/10 text-accent border-accent/15',
        destructive: 'bg-destructive/10 text-destructive border-destructive/20',
        outline:     'bg-transparent text-muted border-border-strong',
        ghost:       'bg-surface-2 text-subtle border-transparent',
      },
      size: {
        sm: 'px-1.5 py-px text-[10px] rounded-[var(--radius-xs)]',
        md: 'px-2 py-0.5 text-xs rounded-[var(--radius-sm)]',
        lg: 'px-2.5 py-1 text-xs rounded-[var(--radius-sm)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, size, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  )
}