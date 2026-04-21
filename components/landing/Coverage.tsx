'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { reveal, revealContainer, revealItem } from '@/lib/motion'

const FRANCE_CITIES = [
  { num: '01', label: 'Paris'     },
  { num: '02', label: 'Lyon'      },
  { num: '03', label: 'Marseille' },
  { num: '04', label: 'Nantes'    },
  { num: '05', label: 'Bordeaux'  },
  { num: '06', label: 'Rennes'    },
] as const

export function Coverage() {
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
            Corridors actifs
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <h2
              className="font-display font-light text-text"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.06, letterSpacing: '-0.035em' }}
            >
              Gabon — France,<br />
              <span className="italic">dans les deux sens.</span>
            </h2>
            <Link
              href="/trajets"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors duration-150 shrink-0 group"
            >
              Voir tous les trajets
              <ArrowUpRight
                className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >

          {/* Gabon */}
          <motion.div
            variants={revealItem}
            className="bg-surface-2 border border-border rounded-[var(--radius-2xl)] p-7 sm:p-9 flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <div className="flex items-center gap-2 mb-10">
                <div className="size-2 rounded-full bg-forest-light" />
                <span className="text-[11px] uppercase tracking-[0.13em] text-subtle font-medium">Gabon</span>
              </div>
              <p
                className="font-display font-light text-text"
                style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', lineHeight: 1, letterSpacing: '-0.03em' }}
              >
                Libreville
              </p>
            </div>
            <p className="text-[13px] text-subtle mt-8 leading-relaxed">
              Point de départ de toutes les expéditions vers la France.
            </p>
          </motion.div>

          {/* France */}
          <motion.div
            variants={revealItem}
            className="bg-surface-2 border border-border rounded-[var(--radius-2xl)] p-7 sm:p-9"
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="size-2 rounded-full bg-atlantic-mid" />
              <span className="text-[11px] uppercase tracking-[0.13em] text-subtle font-medium">France</span>
            </div>
            <ul>
              {FRANCE_CITIES.map((city) => (
                <li
                  key={city.label}
                  className="flex items-center gap-4 py-3.5 border-b border-border last:border-0"
                >
                  <span
                    className="font-display font-light text-accent/30 shrink-0 w-7"
                    style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}
                  >
                    {city.num}
                  </span>
                  <span className="text-[15px] text-text">{city.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}
