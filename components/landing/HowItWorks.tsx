'use client'

import { motion } from 'framer-motion'
import { reveal, revealContainer, revealItem } from '@/lib/motion'

const STEPS = [
  {
    number: '01',
    title:  'Publiez votre besoin.',
    desc:   'Voyageur : publiez votre trajet avec la date et les villes. Expéditeur : publiez votre demande ou trouvez un trajet existant. En quelques clics.',
  },
  {
    number: '02',
    title:  'Connectez-vous directement.',
    desc:   'Échangez via WhatsApp. Convenez du tarif, du lieu de remise et des détails du colis. Directement entre vous, sans intermédiaire.',
  },
  {
    number: '03',
    title:  'Confirmez à la livraison.',
    desc:   "Confirmez avec un code secret à la réception. Notez l'expérience. Le colis est tracé à chaque étape. Zéro litige non documenté.",
  },
] as const

export function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-background border-b border-border">
      <div className="cx">

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16 sm:mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.13em] text-subtle font-medium mb-5">
            Comment ça marche
          </p>
          <h2
            className="font-display font-light text-text text-balance"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.06, letterSpacing: '-0.035em' }}
          >
            Simple comme<br />
            <span className="italic">un aller-retour.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 lg:gap-14"
        >
          {STEPS.map((step, i) => (
            <motion.div key={i} variants={revealItem} className="flex flex-col">

              <span
                className="font-display font-light text-accent/25 leading-none mb-6"
                style={{ fontSize: 'clamp(4.5rem, 9vw, 6.5rem)', letterSpacing: '-0.04em', lineHeight: 0.9 }}
                aria-hidden
              >
                {step.number}
              </span>

              <div className="w-10 h-px bg-accent/35 mb-7" />

              <h3
                className="font-display font-light text-text mb-3"
                style={{ fontSize: '1.25rem', lineHeight: 1.3, letterSpacing: '-0.02em' }}
              >
                {step.title}
              </h3>
              <p className="text-[14px] text-muted leading-relaxed">
                {step.desc}
              </p>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
