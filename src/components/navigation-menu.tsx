"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export const NavigationMenu = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBar, setShowBar] = useState(true)
  const lastYRef = useRef(0)
  const tickingRef = useRef(false)
  const THRESHOLD = 6 // biar gak terlalu sensitif

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          // status "sudah lewat ambang" untuk ubah background
          const scrolled = y > 10
          setIsScrolled(scrolled)

          // SELALU tampilkan navbar saat di paling atas
          if (!scrolled) {
            setShowBar(true)
          } else {
            // deteksi arah scroll (down = hide, up = show)
            const lastY = lastYRef.current
            if (y > lastY + THRESHOLD) {
              setShowBar(false) // scroll down → hide
            } else if (y < lastY - THRESHOLD) {
              setShowBar(true) // scroll up → show
            }
          }

          lastYRef.current = y
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    // init
    lastYRef.current = window.scrollY || 0
    const initScrolled = lastYRef.current > 10
    setIsScrolled(initScrolled)
    setShowBar(true)

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={[
        "fixed left-0 right-0 top-0 z-50",
        "transition-all duration-300 ease-out will-change-transform",
        showBar ? "translate-y-0" : "-translate-y-full",
        isScrolled ? "bg-white/95 shadow-sm backdrop-blur" : "bg-transparent",
      ].join(" ")}
    >
      <div className="container mx-4 sm:mx-8 lg:mx-24 xl:mx-auto flex h-[70px] w-full items-center justify-between px-4">
        <div className="flex items-center">
          <Image
            src="/cretivox.png"
            alt="CBN Logo"
            width={100}
            height={100}
            className="h-auto w-auto"
            priority
          />
        </div>

        <ul
          className={[
            "flex gap-6 sm:gap-8 md:gap-10 text-base sm:text-lg md:text-xl transition-colors duration-300 mr-4 sm:mr-6 md:mr-10",
            isScrolled ? "text-black" : "text-black",
          ].join(" ")}
        >
          <li
            className="font-serif relative after:absolute after:left-0 after:-bottom-1 
               after:h-[2px] after:w-0 after:bg-current after:transition-all 
               after:duration-300 hover:after:w-full cursor-pointer"
          >
            <Link href={"https://cretivox.com/work"}>
              Work
            </Link>
          </li>
          <li
            className="font-serif relative after:absolute after:left-0 after:-bottom-1 
               after:h-[2px] after:w-0 after:bg-current after:transition-all 
               after:duration-300 hover:after:w-full cursor-pointer"
          >
            <Link href={"https://cretivox.com/work#contact"}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
