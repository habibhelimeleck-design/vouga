import type { Variants } from 'framer-motion'

export const ease = {
  out:          [0.16, 1, 0.3, 1]   as const,
  inOut:        [0.45, 0, 0.55, 1]  as const,
  spring:       { type: 'spring', stiffness: 400, damping: 30 }  as const,
  springSmooth: { type: 'spring', stiffness: 280, damping: 32 }  as const,
}

/* ── Reveal — entrée d'un élément seul ─────────────────────────────────── */
export const reveal: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } },
}

/* ── RevealContainer + RevealItem — stagger sur les enfants ────────────── */
export const revealContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const revealItem: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: ease.out } },
}

/* ── Fade in — opacité seule ────────────────────────────────────────────── */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: ease.out } },
}

/* ── Fade up — entrée légère ────────────────────────────────────────────── */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.out } },
}

/* ── Scale in — modals, popovers ────────────────────────────────────────── */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1,  transition: { duration: 0.25, ease: ease.out } },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.18, ease: ease.inOut } },
}

/* ── Slide up — drawers, bottom sheets ──────────────────────────────────── */
export const slideUp: Variants = {
  hidden:  { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.out } },
  exit:    { opacity: 0, y: '100%', transition: { duration: 0.3, ease: ease.inOut } },
}

/* ── Stagger container ───────────────────────────────────────────────────── */
export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: ease.out } },
}

/* ── Micro-interactions ──────────────────────────────────────────────────── */
export const buttonTap = { scale: 0.97, transition: { duration: 0.1 } }

export const cardHover = {
  rest:  { y: 0 },
  hover: { y: -2, transition: ease.spring },
}

/* ── Aliases backward-compat (ancienne landing) ─────────────────────────── */
export const scrollReveal          = reveal
export const scrollRevealContainer = revealContainer
export const scrollRevealItem      = revealItem

export const maskContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const maskWord: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } },
}

export const radarRing: Variants = {
  idle: { opacity: 0.5 },
  ping: { opacity: 0, scale: 2, transition: { duration: 1.5, repeat: Infinity, ease: 'easeOut' as const } },
}

export const badgePop: Variants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

export function floatingTracker(index: number) {
  return {
    animate: { y: [-4, 4, -4] },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: index * 1.3,
    },
  }
}