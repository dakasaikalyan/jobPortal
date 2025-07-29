import { HeroSection } from "@/components/hero-section"
import { FeaturedJobs } from "@/components/featured-jobs"
import { StatsSection } from "@/components/stats-section"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <HeroSection />
      <StatsSection />
      <FeaturedJobs />
      <HowItWorks />
      <Testimonials />
    </div>
  )
}
