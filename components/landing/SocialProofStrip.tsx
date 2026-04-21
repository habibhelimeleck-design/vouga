'use client'

import { motion } from 'framer-motion'
import { revealContainer, revealItem } from '@/lib/motion'

const STATS = [
  { value: '47+',  label: 'Voyageurs actifs'  },
  { value: '6',    label: 'Corridors actifs'  },
  { value: '100%', label: 'Profils vérifiés'  },
  { value: '4.9',  label: 'Note moyenne'      },
] as const

export function SocialProofStrip() {
  return (
    <section className="bg-surface border-b border-border" aria-label="Chiffres clés">
      <motion.div
        variants={revealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border"
      >
        {STATS.map(({ value, label }, i) => (
          <motion.div
            key={i}
            variants={revealItem}
            className="flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center"
          >
            <span
              className="font-display font-light text-text"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
            >
              {value}
            </span>
            <span className="mt-2.5 text-[11px] uppercase tracking-[0.13em] text-subtle font-medium">
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}