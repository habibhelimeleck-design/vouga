'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { reveal, revealContainer, revealItem } from '@/lib/motion'

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 relative overflow-hidden border-b border-border">

      {/* Fond forêt */}
      <div className="absolute inset-0 bg-forest" aria-hidden />

      {/* Texture Fang */}
      <div className="pattern-fang absolute inset-0 pointer-events-none" aria-hidden />

      {/* Lueur or subtile */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 120%, rgba(200,169,106,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="cx relative z-10">
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col items-center text-center"
        >
          <motion.p
            variants={revealItem}
            className="text-[11px] uppercase tracking-[0.14em] text-forest-light/70 font-medium mb-6"
          >
            Commencer maintenant
          </motion.p>

          <motion.h2
            variants={revealItem}
            className="font-display font-light italic text-text text-balance"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.95, letterSpacing: '-0.04em' }}
          >
            Prêt à vou ga ?
          </motion.h2>

          <motion.p
            variants={revealItem}
            className="mt-6 text-forest-light/80 text-lg leading-relaxed max-w-md"
          >
            Créez votre compte en 2 minutes. Envoyez ou transportez des colis dès aujourd'hui.
          </motion.p>

          <motion.div
            variants={revealItem}
            className="mt-9 flex flex-col sm:flex-row items-center gap-3"
          >
            <Button asChild size="xl">
              <Link href="/auth/inscription">
                Créer un compte gratuit
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </Link>
            </Button>
            <Button asChild size="xl" variant="ghost">
              <Link href="/trajets">
                Parcourir les trajets
              </Link>
            </Button>
          </motion.div>

          <motion.p
            variants={revealItem}
            className="mt-6 text-[12px] text-forest-light/50"
          >
            Aucune carte requise · Vérification gratuite · 100% gabonais
          </motion.p>
        </motion.div>
      </div>

    </section>
  )
}