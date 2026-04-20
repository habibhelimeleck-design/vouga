import type { Variants } from 'framer-motion'

export const ease = {
  out:         [0.16, 1, 0.3, 1]    as const,
  inOut:       [0.45, 0, 0.55, 1]   as const,
  spring:      { type: 'spring', stiffness: 400, damping: 30 }  as const,
  springSmooth:{ type: 'spring', stiffness: 300, damping: 35 }  as const,
}

/* ── 1. Masked Slide-up ─────────────────────────────────────────────────────
   Usage :
     <motion.div variants={maskContainer}>
       <div className="overflow-hidden">
         <motion.h1 variants={maskWord}>Titre</motion.h1>
       </div>
     </motion.div>
   Le parent orchestre le stagger, chaque overflow-hidden masque le glissement.
──────────────────────────────────────────────────────────────────────────── */
export const maskContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const maskWord: Variants = {
  hidden:  { y: '108%' },
  visible: { y: 0, transition: { duration: 0.8, ease: ease.out } },
}

/* ── 2. Floating Tracker ────────────────────────────────────────────────────
   Usage :
     <motion.div {...floatingTracker(0)}>...</motion.div>   // delay 0
     <motion.div {...floatingTracker(1)}>...</motion.div>   // delay 1.3s
   Retourne les props animate + transition directement (pas un Variants objet).
──────────────────────────────────────────────────────────────────────────── */
export function floatingTracker(index: number) {
  return {
    animate: { y: [-5, 5, -5] },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: index * 1.3,
    },
  }
}

/* ── 3. Radar Hotspot ───────────────────────────────────────────────────────
   Usage :
     <div className="relative">
       <RadarDot />          ← composant utilitaire ci-dessous
     </div>
──────────────────────────────────────────────────────────────────────────── */
export const radarRing: Variants = {
  idle: { scale: 0.8,  opacity: 0.5 },
  ping: { scale: 2.5,  opacity: 0,
    transition: { duration: 2, repeat: Infinity, ease: 'easeOut' as const } },
}

/* ── 4. Badge Spring Pop + Idle Float ───────────────────────────────────────
   Usage :
     <motion.span
       variants={badgePop}
       initial="hidden"
       whileInView="visible"
       viewport={{ once: true }}
       animate="idle"
     >
──────────────────────────────────────────────────────────────────────────── */
export const badgePop: Variants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 } },
  idle:    { rotate: [-1, 1, -1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.8 } },
}

/* ── 5. Scroll Reveal ───────────────────────────────────────────────────────
   Usage :
     <motion.div variants={scrollReveal} initial="hidden" whileInView="visible"
       viewport={{ once: true, margin: '-100px' }}>
──────────────────────────────────────────────────────────────────────────── */
export const scrollReveal: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.6, ease: ease.out } },
}

export const scrollRevealContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export const scrollRevealItem: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.55, ease: ease.out } },
}

/* ── Héritage ───────────────────────────────────────────────────────────── */

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.out } },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: ease.out } },
}

export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055 } },
}

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: ease.out } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.28, ease: ease.out } },
}

export const slideUp: Variants = {
  hidden:  { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: ease.out } },
  exit:    { opacity: 0, y: '100%', transition: { duration: 0.25, ease: ease.inOut } },
}

export const cardHover = {
  rest:  { y: 0, boxShadow: '0 0 0 transparent' },
  hover: { y: -2, transition: ease.spring },
}

export const buttonTap = { scale: 0.97, transition: { duration: 0.1 } }
