import Link from 'next/link'
import { VouGaLogo } from '@/components/layout/Header'

const LINKS = [
  { href: '#', label: 'CGU'             },
  { href: '#', label: 'Confidentialité' },
  { href: '#', label: 'Contact'         },
  { href: '#', label: 'FAQ'             },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border py-10 sm:py-12">
      <div className="cx">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <VouGaLogo />
            <p className="text-[12px] text-subtle mt-1">
              Plateforme gabonaise de livraison collaborative
            </p>
          </div>

          {/* Links */}
          <nav
            className="flex items-center flex-wrap justify-center gap-x-5 gap-y-2"
            aria-label="Liens du pied de page"
          >
            {LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="text-[13px] text-subtle hover:text-muted transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[12px] text-subtle">
            © {new Date().getFullYear()} VOU GA
          </p>

        </div>
      </div>
    </footer>
  )
}