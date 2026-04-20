import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: AvatarSize
  className?: string
  verified?: boolean
}

const sizes: Record<AvatarSize, { container: string; text: string; badge: string }> = {
  xs: { container: 'size-6 text-[10px]',  text: 'text-[10px]', badge: 'size-2 border' },
  sm: { container: 'size-8 text-xs',      text: 'text-xs',     badge: 'size-2.5 border' },
  md: { container: 'size-10 text-sm',     text: 'text-sm',     badge: 'size-3 border-[1.5px]' },
  lg: { container: 'size-14 text-base',   text: 'text-base',   badge: 'size-4 border-2' },
  xl: { container: 'size-20 text-xl',     text: 'text-xl',     badge: 'size-5 border-2' },
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export function Avatar({ src, name, size = 'md', className, verified }: AvatarProps) {
  const { container, badge } = sizes[size]

  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden',
          'bg-surface-2 border border-border',
          'flex items-center justify-center',
          'font-display font-semibold text-muted',
          container
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name ?? 'Avatar'}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <span aria-hidden>{getInitials(name)}</span>
        )}
      </div>

      {verified && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full',
            'bg-success border-background',
            badge
          )}
          aria-label="Profil vérifié"
        />
      )}
    </div>
  )
}
