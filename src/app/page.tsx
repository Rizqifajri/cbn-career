'use client'
import { CardJobList } from "@/components/card-job-list";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { NavigationMenu } from "@/components/navigation-menu";
import { SosmedSection } from "@/components/sosmed-section";
import StepsToApply from "@/components/steps-to-apply";
import useScrollSmooth from "@/hooks/use-scroll-smooth";

export default function Home() {
  useScrollSmooth();
  return (
    <section id="smooth-wrapper">
      <NavigationMenu />
      <div id="smooth-content">
        <HeroSection />
        <CardJobList />
        <StepsToApply />
        <SosmedSection />
        <Footer />
      </div>
    </section>
  );
}
