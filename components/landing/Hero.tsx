'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ease } from '@/lib/motion'

const DELAY = {
  eyebrow: 0.1,
  heading: 0.25,
  sub:     0.42,
  ctas:    0.56,
  trust:   0.70,
  chevron: 0.90,
}

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden bg-background">

      {/* Motif Fang — fond très subtil */}
      <div className="pattern-fang absolute inset-0 pointer-events-none" aria-hidden />

      {/* Lueur or — coin bas-droit */}
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[60%] h-[55%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 90%, rgba(200,169,106,0.07) 0%, transparent 60%)',
        }}
      />

      {/* Lueur forêt — coin haut-gauche */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-[50%] h-[45%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 15% 10%, rgba(28,61,46,0.18) 0%, transparent 60%)',
        }}
      />

      {/* Contenu centré */}
      <div className="cx relative z-10 flex flex-col items-center justify-center text-center flex-1 pt-24 pb-20">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ease.out, delay: DELAY.eyebrow }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/8 mb-8">
            <span className="size-1.5 rounded-full bg-accent shrink-0" aria-hidden />
            <span className="text-[11px] text-accent tracking-[0.14em] uppercase font-medium">
              Gabon · France · Diaspora
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.out, delay: DELAY.heading }}
          className="font-display font-light italic text-text text-balance"
          style={{ fontSize: 'clamp(2.8rem, 9vw, 6.5rem)', lineHeight: 0.95, letterSpacing: '-0.04em' }}
        >
          Vos colis voyagent<br />
          <span className="text-accent not-italic font-light">avec des gens</span><br />
          de confiance.
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ease.out, delay: DELAY.sub }}
          className="mt-7 text-muted text-lg leading-relaxed max-w-[520px]"
        >
          VOU GA met en relation voyageurs et expéditeurs pour livrer vos colis
          entre la France et le Gabon. Simple, gratuit, fiable.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ease.out, delay: DELAY.ctas }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/auth/inscription">
              Commencer gratuitement
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/trajets">Voir les trajets</Link>
          </Button>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: ease.out, delay: DELAY.trust }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          aria-label="Indicateurs de confiance"
        >
          {[
            '47 voyageurs actifs',
            '6 villes connectées',
            '100% identités vérifiées',
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-[13px] text-subtle">
              {i > 0 && <span className="size-1 rounded-full bg-subtle/40" aria-hidden />}
              {item}
            </span>
          ))}
        </motion.div>

      </div>

      {/* Chevron scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: DELAY.chevron }}
        className="relative z-10 flex justify-center pb-8"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="size-5 text-subtle/50" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

    </section>
  )
}