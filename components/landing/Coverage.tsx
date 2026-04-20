'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { reveal, revealContainer, revealItem } from '@/lib/motion'
import { GABON_CITIES } from '@/lib/constants/corridors'

const GABON_DESTINATIONS = GABON_CITIES.filter(c => c.country === 'Gabon')
const FRANCE_DESTINATIONS = GABON_CITIES.filter(c => c.country === 'France')

export function Coverage() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 border-b border-border bg-surface/30">
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
            Corridors actifs
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <h2
              className="font-display font-light text-text"
              style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.03em' }}
            >
              Gabon — France,<br />
              <span className="italic">dans les deux sens.</span>
            </h2>
            <Link
              href="/trajets"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors duration-150 shrink-0"
            >
              Voir tous les trajets
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </motion.div>

        {/* Grille des corridors */}
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-[var(--radius-xl)] overflow-hidden border border-border"
        >

          {/* Gabon */}
          <motion.div variants={revealItem} className="bg-background p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-2 rounded-full bg-forest-light" />
              <span className="text-[11px] uppercase tracking-[0.12em] text-subtle font-medium">Gabon</span>
            </div>
            <ul className="space-y-0">
              {GABON_DESTINATIONS.length > 0 ? (
                GABON_DESTINATIONS.map((city) => (
                  <li
                    key={city.value}
                    className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                  >
                    <MapPin className="size-3.5 text-forest-light/60 shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-text">{city.label}</span>
                  </li>
                ))
              ) : (
                /* fallback si le filtre retourne vide — on affiche Libreville en dur */
                ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem'].map((city) => (
                  <li key={city} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                    <MapPin className="size-3.5 text-forest-light/60 shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-text">{city}</span>
                  </li>
                ))
              )}
            </ul>
          </motion.div>

          {/* France */}
          <motion.div variants={revealItem} className="bg-background p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-2 rounded-full bg-atlantic-mid" />
              <span className="text-[11px] uppercase tracking-[0.12em] text-subtle font-medium">France</span>
            </div>
            <ul className="space-y-0">
              {FRANCE_DESTINATIONS.map((city) => (
                <li
                  key={city.value}
                  className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                >
                  <MapPin className="size-3.5 text-atlantic-mid/60 shrink-0" strokeWidth={1.75} />
                  <span className="text-sm text-text">{city.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}