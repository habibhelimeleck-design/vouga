'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Package, MapPin, Shield, Star } from 'lucide-react'
import { GABON_CITIES } from '@/lib/constants/corridors'
import { Button } from '@/components/ui/Button'
import { VouGaLogo } from '@/components/layout/Header'
import {
  ease,
  maskContainer, maskWord,
  scrollReveal, scrollRevealContainer, scrollRevealItem,
  badgePop,
  radarRing,
} from '@/lib/motion'

const FRANCE_DESTINATIONS = GABON_CITIES.filter(c => c.country === 'France')

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100dvh] overflow-hidden flex flex-col justify-end"
      >
        {/* Ambient — hors flux */}
        <div aria-hidden className="absolute inset-0 pointer-events-none select-none z-0">
          <div className="absolute bottom-0 right-0 w-[55%] h-[60%]
                          bg-[radial-gradient(ellipse_at_bottom_right,oklch(65%_0.12_80_/_11%)_0%,transparent_65%)]" />
          <div className="absolute top-0 left-0 w-[45%] h-[50%]
                          bg-[radial-gradient(ellipse_at_top_left,oklch(40%_0.1_145_/_7%)_0%,transparent_65%)]" />
          <div
            className="absolute bottom-0 right-0 w-[45%] h-[65%]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L10 0 L20 20 L10 40 Z' fill='%23C49428'/%3E%3Cpath d='M20 20 L30 0 L40 20 L30 40 Z' fill='%23C49428'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
              opacity: 0.06,
            }}
          />
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Contenu — dans le flux normal, collé en bas via justify-end */}
        <div className="wrap relative z-10 pb-14 sm:pb-20">

            {/* Ligne horizontale */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: ease.out }}
              style={{ transformOrigin: 'left' }}
              className="w-full h-px bg-border-strong mb-8"
            />

            {/* Grid 2 colonnes desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end">

              {/* Gauche : wordmark + CTAs */}
              <motion.div variants={maskContainer} initial="hidden" animate="visible">

                {/* Eyebrow */}
                <div className="overflow-hidden mb-5">
                  <motion.div variants={maskWord} className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-accent shrink-0" aria-hidden />
                    <span className="text-[11px] text-accent tracking-[0.22em] uppercase font-medium">
                      Diaspora Gabon — France
                    </span>
                  </motion.div>
                </div>

                {/* Wordmark — chaque ligne masquée */}
                <div className="mb-8">
                  {['VOU', 'GA'].map((word) => (
                    <div key={word} className="overflow-hidden">
                      <motion.h1
                        variants={maskWord}
                        className="font-display font-extrabold text-text select-none
                                   tracking-[-0.04em] leading-[0.86]
                                   text-[clamp(4.5rem,12vw,10rem)]"
                      >
                        {word}
                      </motion.h1>
                    </div>
                  ))}
                </div>

                <motion.div variants={maskWord}>
                  <p className="text-muted text-base leading-relaxed max-w-sm mb-6">
                    Voyagez avec un colis, ou envoyez le vôtre avec un voyageur de confiance entre le Gabon et la France.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <Button asChild size="lg">
                      <Link href="/trajets">
                        Trouver un trajet
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                      <Link href="/auth/inscription">Publier un trajet</Link>
                    </Button>
                  </div>
                  <p className="text-[11px] text-subtle mt-4">
                    Gratuit · Identités vérifiées · Gabon ↔ France
                  </p>
                </motion.div>

              </motion.div>

              {/* Droite : stats — desktop uniquement */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease: ease.out }}
                className="hidden lg:block border border-border"
              >
                {[
                  { n: '6',    label: 'villes françaises connectées' },
                  { n: '0 F',  label: 'de frais de plateforme'       },
                  { n: '100%', label: 'des profils vérifiés'          },
                ].map(({ n, label }, i) => (
                  <div key={i} className="px-8 py-6 border-b border-border last:border-b-0">
                    <p className="font-display font-bold text-text text-3xl tracking-tight">{n}</p>
                    <p className="text-subtle text-sm mt-1">{label}</p>
                  </div>
                ))}
                <div className="px-8 py-5 bg-surface/50">
                  <p className="text-xs text-muted leading-relaxed">
                    L&apos;envoi de colis entre particuliers,<br />partout au Gabon — simple et gratuit.
                  </p>
                </div>
              </motion.div>

            </div>
        </div>
      </section>

      {/* ── STATEMENT ────────────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <p className="text-[10px] tracking-[0.28em] text-subtle uppercase mb-8">
              Pourquoi VOU GA
            </p>
            <h2 className="font-display font-bold text-text leading-[1.08] tracking-[-0.03em]
                           text-[clamp(1.875rem,4vw,3.25rem)] max-w-2xl">
              La diaspora voyage.<br />Vos colis aussi.
            </h2>
            <p className="text-muted mt-5 text-base sm:text-lg leading-relaxed max-w-xl">
              Des milliers de Gabonais font l&apos;aller-retour entre la France et Libreville.
              VOU GA connecte ces voyageurs avec ceux qui ont besoin d&apos;envoyer — en confiance, sans frais.
            </p>
          </motion.div>

          <motion.div
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-14 grid grid-cols-3 gap-px bg-border border border-border"
          >
            {[
              { n: '6',    label: 'villes connectées' },
              { n: '0 F',  label: 'frais plateforme'  },
              { n: '100%', label: 'profils vérifiés'  },
            ].map(({ n, label }, i) => (
              <motion.div
                key={i}
                variants={scrollRevealItem}
                className="bg-background px-5 py-6 sm:px-8 sm:py-8"
              >
                <p className="font-display font-bold text-text text-2xl sm:text-3xl">{n}</p>
                <p className="text-subtle text-xs sm:text-sm mt-1.5">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <motion.p
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-[10px] tracking-[0.28em] text-subtle uppercase mb-14"
          >
            Comment ça marche
          </motion.p>

          <motion.div
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-3 sm:gap-px sm:bg-border sm:border sm:border-border"
          >
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={i}
                variants={scrollRevealItem}
                className="flex flex-col gap-5 py-8 sm:p-8 bg-background
                           border-b border-border sm:border-0 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-accent text-sm tracking-wider">0{i + 1}</span>
                  <div className="flex-1 h-px bg-border hidden sm:block" />
                </div>
                <step.icon className="size-5 text-text/50" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display font-semibold text-text text-xl tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted mt-2.5 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── RÉSEAU ───────────────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-12 lg:gap-16">

            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className="text-[10px] tracking-[0.28em] text-subtle uppercase mb-6">
                Corridors actifs
              </p>
              <h2 className="font-display font-bold text-text text-2xl sm:text-3xl tracking-tight leading-tight">
                Gabon — France,<br />dans les deux sens.
              </h2>
              <p className="text-muted mt-4 text-sm leading-relaxed">
                6 villes françaises connectées à Libreville. Envoyez ou transportez sur l&apos;axe diaspora.
              </p>
              <div className="mt-8">
                <Button asChild variant="ghost" size="sm" className="pl-0 gap-1.5">
                  <Link href="/trajets">
                    Voir les trajets disponibles
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={scrollRevealContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {/* Hub */}
              <div className="flex items-center gap-4 py-3.5 border-b border-border-strong">
                <RadarDot />
                <span className="font-display font-semibold text-text">Libreville</span>
                <span className="text-xs text-subtle ml-auto">Hub · Gabon</span>
              </div>

              {/* Villes France */}
              {FRANCE_DESTINATIONS.map((city) => (
                <motion.div
                  key={city.value}
                  variants={scrollRevealItem}
                  className="flex items-center gap-4 py-3 border-b border-border last:border-b-0
                             hover:bg-surface/30 transition-colors"
                >
                  <div className="flex items-center gap-2 shrink-0 pl-4">
                    <span className="w-4 h-px bg-border-strong inline-block" />
                    <MapPin className="size-3 text-accent/40 shrink-0" />
                  </div>
                  <span className="text-sm text-muted flex-1">{city.label}</span>
                  <span className="text-[11px] text-subtle hidden sm:block">France</span>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── CONFIANCE ────────────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <motion.p
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-[10px] tracking-[0.28em] text-subtle uppercase mb-12"
          >
            Sécurité &amp; confiance
          </motion.p>

          <motion.div
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border"
          >
            {TRUST_POINTS.map((point, i) => (
              <motion.div
                key={i}
                variants={scrollRevealItem}
                className="bg-background p-6 sm:p-8 flex flex-col gap-5"
              >
                {/* Icône avec spring pop */}
                <motion.div
                  variants={badgePop}
                  animate="idle"
                  className="size-9 rounded-[var(--radius-md)] bg-surface-2 border border-border
                             flex items-center justify-center"
                  style={{ originX: 0.5, originY: 0.5 }}
                >
                  <point.icon className="size-4 text-accent" strokeWidth={1.75} />
                </motion.div>
                <div>
                  <p className="font-display font-semibold text-text text-lg tracking-tight">
                    {point.title}
                  </p>
                  <p className="text-xs text-muted mt-2 leading-relaxed">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <p className="text-[10px] tracking-[0.28em] text-subtle uppercase mb-6">Commencer</p>
            <h2 className="font-display font-bold text-text leading-[0.92] tracking-[-0.04em]
                           text-[clamp(2.75rem,7vw,5.5rem)] mb-8">
              Prêt à<br />vou ga ?
            </h2>
            <p className="text-muted text-base sm:text-lg leading-relaxed max-w-md mb-10">
              Créez votre compte en 2 minutes. Commencez à envoyer ou transporter des colis dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
              <Button asChild size="xl">
                <Link href="/auth/inscription">
                  Créer un compte gratuit
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="xl">
                <Link href="/trajets">Parcourir les trajets</Link>
              </Button>
            </div>
            <p className="text-xs text-subtle">
              Aucune carte requise · Vérification gratuite · 100% gabonais
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-5">
          <VouGaLogo />
          <p className="text-xs text-subtle">© 2025 VOU GA · Gabon · Plateforme 100% gratuite</p>
          <div className="flex items-center gap-5 text-xs text-subtle">
            <Link href="#" className="hover:text-muted transition-colors">CGU</Link>
            <Link href="#" className="hover:text-muted transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-muted transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

/* ── Data ──────────────────────────────────────────────────────────────────── */

const PROCESS_STEPS = [
  {
    icon: Package,
    title: 'Publiez ou cherchez',
    desc: 'Voyageur : publiez votre trajet. Expéditeur : publiez votre demande ou trouvez un trajet existant.',
  },
  {
    icon: MapPin,
    title: 'Contactez & accordez',
    desc: 'Échangez via WhatsApp. Convenez du tarif, de la remise et des détails du colis.',
  },
  {
    icon: Star,
    title: 'Suivez & confirmez',
    desc: "Confirmez la remise avec un code secret. Notez l'expérience après livraison.",
  },
]

/* ── RadarDot ── point pulsant pour les hotspots ──────────────────────────── */
function RadarDot() {
  return (
    <span className="relative flex size-2.5 shrink-0">
      <motion.span
        variants={radarRing}
        initial="idle"
        animate="ping"
        className="absolute inset-0 rounded-full bg-accent"
      />
      <span className="relative size-2 m-px rounded-full bg-accent" />
    </span>
  )
}

const TRUST_POINTS = [
  {
    icon: Shield,
    title: 'Identités vérifiées',
    desc: 'Chaque profil est validé par notre équipe avant toute publication.',
  },
  {
    icon: Star,
    title: 'Avis & réputation',
    desc: 'Notez et consultez les avis après chaque livraison pour garder la confiance.',
  },
  {
    icon: Package,
    title: 'Suivi complet',
    desc: 'Photo à la remise, photo à la livraison, code de confirmation — zéro litige non documenté.',
  },
]
