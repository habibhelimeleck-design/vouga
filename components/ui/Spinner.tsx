import { cn } from '@/lib/utils/cn'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

const sizes: Record<SpinnerSize, string> = {
  xs: 'size-3 border-[1.5px]',
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-[3px]',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Chargement"
      className={cn(
        'inline-block rounded-full',
        'border-current border-r-transparent',
        'animate-[spin_600ms_linear_infinite]',
        sizes[size],
        className
      )}
    />
  )
}
