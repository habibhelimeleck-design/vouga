import { Hero }             from '@/components/landing/Hero'
import { SocialProofStrip } from '@/components/landing/SocialProofStrip'
import { HowItWorks }       from '@/components/landing/HowItWorks'
import { Coverage }         from '@/components/landing/Coverage'
import { TrustSection }     from '@/components/landing/TrustSection'
import { Testimonials }     from '@/components/landing/Testimonials'
import { CtaSection }       from '@/components/landing/CtaSection'
import { Footer }           from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProofStrip />
      <HowItWorks />
      <Coverage />
      <TrustSection />
      <Testimonials />
      <CtaSection />
      <Footer />
    </>
  )
}