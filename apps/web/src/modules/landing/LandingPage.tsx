import LayoutBase from '../../components/layout/LayoutBase'
import Hero from './Hero'
import Features from './Features'
import CTA from './CTA'
import { ThemeProvider } from '../../theme/ThemeProvider'

export default function LandingPage() {
  return (
    <ThemeProvider forceTheme="blue">
      <LayoutBase>
        <Hero />
        <Features />
        <CTA />
      </LayoutBase>
    </ThemeProvider>
  )
}
