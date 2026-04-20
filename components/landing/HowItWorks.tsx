'use client'

import { motion } from 'framer-motion'
import { Package, MessageCircle, CheckCircle } from 'lucide-react'
import { reveal, revealContainer, revealItem } from '@/lib/motion'

const STEPS = [
  {
    number: '01',
    icon:   Package,
    title:  'Publiez',
    desc:   'Voyageur : publiez votre trajet. Expéditeur : publiez votre demande ou trouvez un trajet existant. En quelques clics.',
  },
  {
    number: '02',
    icon:   MessageCircle,
    title:  'Connectez-vous',
    desc:   "Échangez via WhatsApp. Convenez du tarif, du lieu de remise et des détails du colis. Directement entre vous.",
  },
  {
    number: '03',
    icon:   CheckCircle,
    title:  'Confirmez',
    desc:   "À la livraison, confirmez avec un code secret. Notez l'expérience. Le colis est tracé à chaque étape.",
  },
] as const

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 border-b border-border">
      <div className="cx">

        {/* En-tête */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-14 sm:mb-18"
        >
          <p className="text-[11px] uppercase tracking-[0.14em] text-subtle font-medium mb-4">
            Comment ça marche
          </p>
          <h2
            className="font-display font-light text-text text-balance"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}
          >
            Simple comme un aller-retour.
          </h2>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 lg:gap-10"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              variants={revealItem}
              className="group flex flex-col"
            >
              {/* Numéro éditorial */}
              <div className="flex items-start justify-between mb-6">
                <span
                  className="font-display font-light text-accent/30 leading-none"
                  style={{ fontSize: 'clamp(3.5rem, 8vw, 5rem)', letterSpacing: '-0.04em' }}
                  aria-hidden
                >
                  {step.number}
                </span>
                <step.icon
                  className="size-5 text-muted mt-3 shrink-0"
                  strokeWidth={1.5}
                />
              </div>

              {/* Séparateur */}
              <div className="w-full h-px bg-border mb-6" />

              {/* Contenu */}
              <h3 className="font-sans font-semibold text-text text-[18px] tracking-[-0.01em] mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}