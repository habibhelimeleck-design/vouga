'use client'

import { motion } from 'framer-motion'
import { reveal, revealContainer, revealItem } from '@/lib/motion'

const TESTIMONIALS = [
  {
    quote:  "J'avais besoin d'envoyer des médicaments à ma mère à Libreville. En 4 jours, elle les avait. Incroyable.",
    name:   'Marie-Claire O.',
    role:   'Expéditrice',
    city:   'Paris',
    initials: 'MC',
  },
  {
    quote:  "Je voyage souvent entre Bordeaux et Libreville pour le travail. Autant rendre service et me faire un peu d'argent de poche.",
    name:   'Patrick N.',
    role:   'Voyageur',
    city:   'Bordeaux',
    initials: 'PN',
  },
  {
    quote:  "Le voyageur était super professionnel. Livraison à l'heure, photo de confirmation. Je recommande sans hésiter.",
    name:   'Sandrine M.',
    role:   'Expéditrice',
    city:   'Libreville',
    initials: 'SM',
  },
] as const

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 border-b border-border bg-surface/20">
      <div className="cx">

        {/* En-tête */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-14"
        >
          <p className="text-[11px] uppercase tracking-[0.14em] text-subtle font-medium mb-4">
            Ils l'utilisent
          </p>
          <h2
            className="font-display font-light text-text"
            style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.03em' }}
          >
            Ce qu'ils en disent.
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={revealItem}
              className="bg-surface-2 border border-border rounded-[var(--radius-xl)] p-6 flex flex-col justify-between gap-6"
            >
              {/* Guillemet décoratif */}
              <div>
                <span
                  className="font-display text-accent/20 select-none leading-none block mb-3"
                  style={{ fontSize: '4rem' }}
                  aria-hidden
                >
                  "
                </span>
                <p className="text-[15px] text-text leading-relaxed">
                  {t.quote}
                </p>
              </div>

              {/* Auteur */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="size-9 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-semibold text-accent">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text leading-none">{t.name}</p>
                  <p className="text-[12px] text-subtle mt-1">{t.role} · {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}