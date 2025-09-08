// app/page.tsx (SERVER component)
import { Suspense } from "react"
import { NavigationMenu } from "@/components/navigation-menu"
import { HeroSection } from "@/components/hero-section"
import { CardJobList } from "@/components/card-job-list"
import StepsToApply from "@/components/steps-to-apply"
import { SosmedSection } from "@/components/sosmed-section"
import { Footer } from "@/components/footer"
import { ClientEffects } from "@/components/client-effects"

// Jika perlu memaksa non-prerender (opsional):
// export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <section id="smooth-wrapper">
      {/* efek client-side yang tidak butuh Suspense */}
      <ClientEffects />

      <NavigationMenu />
      <div id="smooth-content">
        {/* Suspense utk HeroSection karena di dalamnya ada useSearchParams */}
        <Suspense
          fallback={
            <div className="relative flex h-[500px] sm:h-[600px] lg:h-[650px] w-full items-center justify-center bg-gray-50" />
          }
        >
          <HeroSection />
        </Suspense>

        {/* Suspense utk CardJobList karena juga pakai useSearchParams */}
        <Suspense
          fallback={
            <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 mt-10 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
                <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
                <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
              </div>
              <aside className="space-y-4">
                <div className="h-40 bg-gray-100 animate-pulse rounded-md" />
              </aside>
            </div>
          }
        >
          <CardJobList />
        </Suspense>

        <StepsToApply />
        <SosmedSection />
        <Footer />
      </div>
    </section>
  )
}
