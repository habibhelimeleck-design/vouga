import Link from 'next/link'
import { Package } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10" aria-label="VOU GA accueil">
        <div className="size-8 bg-accent rounded-[var(--radius-md)] flex items-center justify-center">
          <Package className="size-4.5 text-accent-fg" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight text-text">VOU GA</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-surface border border-border rounded-[var(--radius-xl)] p-6 shadow-lg">
        {children}
      </div>
    </div>
  )
}