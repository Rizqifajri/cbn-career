"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import { Send, FileText, NotebookPen, Ear, Sparkles } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { InterviewHRIcon, InterviewManagerIcon, InterviewUserIcon } from "./icons"

gsap.registerPlugin(ScrollTrigger)

type Step = {
  title: string
  icon: ReactNode
}

type Props = {
  title?: string
  steps?: Step[]
}

const DEFAULT_STEPS: Step[] = [
  { title: "Registration", icon: <Send className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" /> },
  { title: "Administration", icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" /> },
  { title: "HR Interview", icon: <InterviewHRIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" /> },
  { title: "User Interview", icon: <InterviewUserIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" /> },
  { title: "Manager Interview", icon: <InterviewManagerIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" /> },
  { title: "Onboarding", icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" /> },
]

export function StepsToApply({ title = "Steps to Apply", steps = DEFAULT_STEPS }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const stepsRef = useRef<HTMLOListElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Steps stagger animation
      gsap.fromTo(
        ".step-item",
        {
          opacity: 0,
          y: 60,
          scale: 0.8,
          rotateY: 45,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: {
            amount: 1.2,
            from: "start",
          },
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Connecting line animation
      gsap.fromTo(
        lineRef.current,
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
          delay: 0.8,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Hover animations for step items
      const stepItems = document.querySelectorAll(".step-item")
      stepItems.forEach((item) => {
        const circle = item.querySelector(".step-circle")
        const icon = item.querySelector(".step-icon")
        const number = item.querySelector(".step-number")

        item.addEventListener("mouseenter", () => {
          gsap.to(circle, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" })
          gsap.to(icon, { scale: 1.2, rotation: 5, duration: 0.3, ease: "back.out(1.7)" })
          gsap.to(number, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" })
        })

        item.addEventListener("mouseleave", () => {
          gsap.to(circle, { scale: 1, duration: 0.3, ease: "back.out(1.7)" })
          gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.7)" })
          gsap.to(number, { scale: 1, duration: 0.3, ease: "back.out(1.7)" })
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 w-full mx-auto overflow-hidden"
    >
      <h2
        ref={titleRef}
        className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-left mb-8 sm:mb-12 lg:mb-16 text-gray-900 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text"
      >
        {title}
      </h2>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-8 sm:top-10 md:top-9 lg:top-10 xl:top-12 justify-center hidden lg:flex">
          <div className="w-full max-w-7xl mx-auto px-8 sm:px-12 md:px-4 lg:px-8">
            <div ref={lineRef} className="border-t-2 border-dashed border-gray-300 w-full origin-left" />
          </div>
        </div>

        <ol
          ref={stepsRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 md:gap-4 lg:gap-6 xl:gap-8 place-items-center"
        >
          {steps.map((step, idx) => (
            <li
              key={idx}
              className="step-item relative flex flex-col items-center text-center w-full max-w-[120px] sm:max-w-[140px] md:max-w-none cursor-pointer"
            >
              <div className="step-circle relative z-10 grid place-items-center rounded-full border-2 border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-16 w-16 sm:h-20 sm:w-20 md:h-18 md:w-18 lg:h-20 lg:w-20 xl:h-24 xl:w-24 backdrop-blur-sm bg-white/90 hover:bg-white group">
                <div className="step-icon text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {step.icon}
                </div>
                <span className="step-number absolute -bottom-1 -right-1 grid h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 place-items-center rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-xs sm:text-sm font-bold text-white shadow-lg">
                  {idx + 1}
                </span>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base font-medium text-gray-700 leading-tight px-1 group-hover:text-gray-900 transition-colors duration-300">
                {step.title}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default StepsToApply
