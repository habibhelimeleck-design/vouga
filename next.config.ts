import type { NextConfig } from 'next'

// Validation des variables d'environnement requises au démarrage
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variable d'environnement manquante : ${key}\nCopier .env.example en .env.local et renseigner les valeurs.`)
  }
}

const supabaseHostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig