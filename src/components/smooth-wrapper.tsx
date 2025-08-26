"use client"

import useScrollSmooth from "@/hooks/use-scroll-smooth"


export default function SmoothWrapper({ children }: { children: React.ReactNode }) {
  // aktifkan GSAP ScrollSmoother sekali di root
  useScrollSmooth()

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  )
}
