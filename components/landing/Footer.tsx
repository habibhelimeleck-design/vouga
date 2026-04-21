import Link from 'next/link'
import { VouGaLogo } from '@/components/layout/Header'

const NAV_LINKS = [
  { href: '/trajets',  label: 'Trajets'           },
  { href: '/demandes', label: 'Demandes'           },
  { href: '#',         label: 'Comment ça marche'  },
] as const

const LEGAL_LINKS = [
  { href: '#', label: 'CGU'             },
  { href: '#', label: 'Confidentialité' },
  { href: '#', label: 'Contact'         },
] as const

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="cx py-14 sm:py-16">

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10 sm:gap-16">

          {/* Brand */}
          <div className="flex flex-col gap-3 shrink-0">
            <VouGaLogo />
            <p className="text-[13px] text-muted leading-relaxed mt-1 max-w-[240px]">
              Plateforme de livraison collaborative entre la France et le Gabon.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-14">
            <div>
              <p className="text-[11px] uppercase tracking-[0.13em] text-subtle font-medium mb-4">
                Plateforme
              </p>
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-muted hover:text-text transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.13em] text-subtle font-medium mb-4">
                Légal
              </p>
              <ul className="flex flex-col gap-2.5">
                {LEGAL_LINKS.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-muted hover:text-text transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-subtle">
            © {new Date().getFullYear()} VOU GA. Tous droits réservés.
          </p>
          <p className="text-[12px] text-subtle tracking-wide">
            Gabon · France · Diaspora
          </p>
        </div>

      </div>
    </footer>
  )
}
