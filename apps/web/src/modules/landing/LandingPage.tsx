import LayoutBase from '../../components/layout/LayoutBase'

import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowItWorks'
import Modules from './Modules'
import Security from './Security'
import CTA from './CTA'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <LayoutBase>
      <Hero />
      <Features />
      <HowItWorks />
      <Modules />
      <Security />
      <CTA />
      <Footer />
    </LayoutBase>
  )
}
