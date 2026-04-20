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
    <section className="py-20 sm:py-28 lg:py-36 border-b border-border">
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
            Sécurité &amp; confiance
          </p>
          <h2
            className="font-display font-light text-text max-w-xl text-balance"
            style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.03em' }}
          >
            La confiance n'est pas un bonus.<br />
            <span className="italic">C'est l'infrastructure.</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {TRUST_POINTS.map((point, i) => (
            <motion.div
              key={i}
              variants={revealItem}
              className="glass-card border border-[rgba(240,234,224,0.09)] rounded-[var(--radius-xl)] p-6 flex flex-col gap-5"
            >
              {/* Icône */}
              <div className="size-10 rounded-[var(--radius-md)] bg-accent/10 border border-accent/15 flex items-center justify-center shrink-0">
                <point.icon className="size-4.5 text-accent" strokeWidth={1.75} />
              </div>

              {/* Texte */}
              <div>
                <h3 className="font-sans font-semibold text-text text-[15px] tracking-[-0.01em] mb-2">
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