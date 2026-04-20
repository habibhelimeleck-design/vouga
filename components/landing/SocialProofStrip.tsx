'use client'

import { motion } from 'framer-motion'
import { revealContainer, revealItem } from '@/lib/motion'

const STATS = [
  { value: '47',   label: 'Voyageurs actifs'     },
  { value: '6',    label: 'Villes connectées'    },
  { value: '100%', label: 'Profils vérifiés'     },
  { value: '4.9',  label: 'Note moyenne'         },
] as const

export function SocialProofStrip() {
  return (
    <section
      className="border-y border-border"
      aria-label="Chiffres clés"
    >
      <motion.div
        variants={revealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border"
      >
        {STATS.map(({ value, label }, i) => (
            <motion.div
              key={i}
              variants={revealItem}
              className="flex flex-col items-center justify-center py-7 px-4 text-center"
            >
              <span
                className="font-display font-light text-text"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1, letterSpacing: '-0.03em' }}
              >
                {value}
              </span>
              <span className="mt-1.5 text-[12px] text-subtle uppercase tracking-[0.08em] font-medium">
                {label}
              </span>
            </motion.div>
          ))}
      </motion.div>
    </section>
  )
}