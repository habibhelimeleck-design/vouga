import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'VOU GA — Envoyez vos colis avec des voyageurs de confiance',
    template: '%s · VOU GA',
  },
  description:
    'VOU GA met en relation les voyageurs et les particuliers qui souhaitent envoyer des colis au Gabon. Simple, rapide, fiable.',
  keywords: ['colis', 'Gabon', 'Libreville', 'envoi', 'voyageur', 'transport'],
  openGraph: {
    title: 'VOU GA',
    description: 'Envoyez vos colis avec des voyageurs de confiance au Gabon.',
    siteName: 'VOU GA',
    locale: 'fr_GA',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080806',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jakarta.variable} h-full`}
    >
      <body className="min-h-dvh bg-background text-text antialiased">
        {children}
      </body>
    </html>
  )
}