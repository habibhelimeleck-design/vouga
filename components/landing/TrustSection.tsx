'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Star, Camera, Lock } from 'lucide-react'
import { reveal, revealContainer, revealItem } from '@/lib/motion'

const TRUST_POINTS = [
  {
    icon:  ShieldCheck,
    title: 'Identités vérifiées',
    desc:  "Chaque profil est validé manuellement avant toute publication. Pièce d'identité obligatoire pour voyageurs et expéditeurs.",
  },
  {
    icon:  Star,
    title: 'Avis & réputation',
    desc:  "Chaque livraison peut être notée. Consultez l'historique avant de choisir votre partenaire. La confiance se construit.",
  },
  {
    icon:  Camera,
    title: 'Suivi par preuve',
    desc:  "Photo à la remise, photo à la livraison. Code de confirmation à l'arrivée. Zéro litige non documenté.",
  },
  {
    icon:  Lock,
    title: 'Données sécurisées',
    desc:  "Vos informations personnelles sont chiffrées et ne sont jamais partagées sans votre accord explicite.",
  },
] as const

export function TrustSection() {
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
            Sécurité &amp; confiance
          </p>
          <h2
            className="font-display font-light text-text max-w-xl text-balance"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.06, letterSpacing: '-0.035em' }}
          >
            La confiance n'est pas un bonus.<br />
            <span className="italic">C'est l'infrastructure.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {TRUST_POINTS.map((point, i) => (
            <motion.div
              key={i}
              variants={revealItem}
              className="bg-surface-2 border border-border rounded-[var(--radius-2xl)] p-7 flex flex-col gap-6"
            >
              <div className="size-11 rounded-[var(--radius-xl)] bg-accent/8 border border-accent/12 flex items-center justify-center shrink-0">
                <point.icon className="size-5 text-accent" strokeWidth={1.5} />
              </div>

              <div>
                <h3
                  className="font-display font-light text-text mb-2.5"
                  style={{ fontSize: '1.1875rem', lineHeight: 1.3, letterSpacing: '-0.02em' }}
                >
                  {point.title}
                </h3>
                <p className="text-[13px] text-muted leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
