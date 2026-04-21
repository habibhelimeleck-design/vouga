'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { reveal, revealContainer, revealItem } from '@/lib/motion'

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 relative overflow-hidden border-b border-border">

      <div className="absolute inset-0 bg-forest" aria-hidden />
      <div className="pattern-fang absolute inset-0 pointer-events-none" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 110%, rgba(200,169,106,0.14) 0%, transparent 65%)',
        }}
      />

      <div className="cx relative z-10">
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col items-center text-center max-w-2xl mx-auto"
        >

          <motion.p
            variants={revealItem}
            className="text-[11px] uppercase tracking-[0.13em] text-forest-light/50 font-medium mb-6"
          >
            Commencer maintenant
          </motion.p>

          <motion.div variants={revealItem} className="w-10 h-px bg-accent/35 mb-8" />

          <motion.h2
            variants={revealItem}
            className="font-display font-light italic text-text text-balance"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', lineHeight: 0.96, letterSpacing: '-0.04em' }}
          >
            Prêt à vou ga ?
          </motion.h2>

          <motion.p
            variants={revealItem}
            className="mt-7 text-[15px] leading-relaxed max-w-sm"
            style={{ color: 'rgba(58, 122, 98, 0.85)' }}
          >
            Créez votre compte en 2 minutes. Envoyez ou transportez des colis dès aujourd'hui.
          </motion.p>

          <motion.div
            variants={revealItem}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="/auth/inscription">
                Créer un compte gratuit
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </Link>
            </Button>

            <Link
              href="/trajets"
              className="inline-flex items-center justify-center h-12 px-7 text-base rounded-[var(--radius-lg)] border transition-all duration-200"
              style={{
                borderColor: 'rgba(58,122,98,0.35)',
                color:       'rgba(58,122,98,0.80)',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(58,122,98,0.6)'
                ;(e.currentTarget as HTMLAnchorElement).style.color       = 'rgba(58,122,98,1)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(58,122,98,0.35)'
                ;(e.currentTarget as HTMLAnchorElement).style.color       = 'rgba(58,122,98,0.80)'
              }}
            >
              Parcourir les trajets
            </Link>
          </motion.div>

          <motion.p
            variants={revealItem}
            className="mt-8 text-[11px] uppercase tracking-[0.12em]"
            style={{ color: 'rgba(58,122,98,0.40)' }}
          >
            Aucune carte requise · Vérification gratuite · 100% sécurisé
          </motion.p>

        </motion.div>
      </div>

    </section>
  )
}
