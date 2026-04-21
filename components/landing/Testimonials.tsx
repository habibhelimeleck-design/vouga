'use client'

import { motion } from 'framer-motion'
import { reveal, revealContainer, revealItem } from '@/lib/motion'

const TESTIMONIALS = [
  {
    quote:    "J'avais besoin d'envoyer des médicaments à ma mère à Libreville. En 4 jours, elle les avait. Incroyable.",
    name:     'Marie-Claire O.',
    role:     'Expéditrice',
    city:     'Paris',
    initials: 'MC',
  },
  {
    quote:    "Je voyage souvent entre Bordeaux et Libreville pour le travail. Autant rendre service et me faire un peu d'argent de poche.",
    name:     'Patrick N.',
    role:     'Voyageur',
    city:     'Bordeaux',
    initials: 'PN',
  },
  {
    quote:    "Le voyageur était super professionnel. Livraison à l'heure, photo de confirmation. Je recommande sans hésiter.",
    name:     'Sandrine M.',
    role:     'Expéditrice',
    city:     'Libreville',
    initials: 'SM',
  },
] as const

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-surface border-b border-border">
      <div className="cx">

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16 sm:mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.13em] text-subtle font-medium mb-5">
            Ils l'utilisent
          </p>
          <h2
            className="font-display font-light text-text"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.06, letterSpacing: '-0.035em' }}
          >
            Ce qu'ils en disent.
          </h2>
        </motion.div>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={revealItem}
              className="bg-surface-2 border border-border rounded-[var(--radius-2xl)] p-7 flex flex-col justify-between gap-7"
            >
              <div>
                <span
                  className="font-display text-accent/12 select-none leading-none block mb-4"
                  style={{ fontSize: '5rem', lineHeight: 0.8 }}
                  aria-hidden
                >
                  "
                </span>
                <p
                  className="font-display font-light text-text leading-relaxed"
                  style={{ fontSize: '1.0625rem', letterSpacing: '-0.01em' }}
                >
                  {t.quote}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-5 border-t border-border">
                <div className="size-9 rounded-full bg-accent/10 border border-accent/18 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-semibold text-accent tracking-wide">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p
                    className="font-display font-light italic text-accent leading-none"
                    style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}
                  >
                    {t.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-subtle mt-1.5">
                    {t.role} · {t.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
